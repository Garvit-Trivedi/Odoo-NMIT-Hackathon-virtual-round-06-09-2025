import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { sendResetEmail } from '../utils/email.js';

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP || '15m' });
};

const createRefreshToken = async (userId) => {
  const raw = crypto.randomBytes(64).toString('hex');
  const hash = await bcrypt.hash(raw, 10);
  const expires = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '30') * 24 * 60 * 60 * 1000));
  await RefreshToken.create({ user: userId, tokenHash: hash, expiresAt: expires });
  return raw;
};

const setRefreshCookie = (res, token) => {
  const maxAge = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '30') * 24 * 60 * 60 * 1000;
  res.cookie('refreshToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hash });

    const accessToken = createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);

    setRefreshCookie(res, refreshToken);

    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email }, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);

    setRefreshCookie(res, refreshToken);

    res.json({ user: { _id: user._id, name: user.name, email: user.email }, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshToken = async (req, res) => {
  const raw = req.body?.refreshToken || req.cookies?.refreshToken;
  if (!raw) return res.status(400).json({ message: 'Refresh token required' });

  try {
    const tokens = await RefreshToken.find({ revoked: false }).sort({ createdAt: -1 }).limit(500);
    for (const t of tokens) {
      const match = await bcrypt.compare(raw, t.tokenHash);
      if (match) {
        if (t.expiresAt < new Date() || t.revoked) return res.status(401).json({ message: 'Refresh token invalid' });
        t.revoked = true;
        await t.save();
        const newRaw = await createRefreshToken(t.user);
        const accessToken = createAccessToken(t.user);
        setRefreshCookie(res, newRaw);
        return res.json({ accessToken, refreshToken: newRaw });
      }
    }
    return res.status(401).json({ message: 'Refresh token invalid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  const raw = req.body?.refreshToken || req.cookies?.refreshToken;
  if (!raw) return res.status(400).json({ message: 'Refresh token required' });
  try {
    const tokens = await RefreshToken.find({ revoked: false });
    for (const t of tokens) {
      const match = await bcrypt.compare(raw, t.tokenHash);
      if (match) {
        t.revoked = true;
        await t.save();
        res.clearCookie('refreshToken');
        return res.json({ message: 'Logged out' });
      }
    }
    res.status(400).json({ message: 'Token not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const raw = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(raw, 10);
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await PasswordResetToken.create({ user: user._id, tokenHash: hash, expiresAt: expires });

    const resetLink = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
    await sendResetEmail(user.email, resetLink);

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, token: raw, newPassword } = req.body;
  if (!email || !raw || !newPassword) return res.status(400).json({ message: 'Missing required fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    const tokens = await PasswordResetToken.find({ user: user._id, used: false });
    for (const t of tokens) {
      const match = await bcrypt.compare(raw, t.tokenHash);
      if (match && t.expiresAt > new Date()) {
        t.used = true;
        await t.save();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        user.password = hash;
        await user.save();
        return res.json({ message: 'Password updated' });
      }
    }
    res.status(400).json({ message: 'Invalid token' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.body.name) user.name = req.body.name;
    if (req.body.image) user.image = req.body.image;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, image: user.image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
