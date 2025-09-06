import crypto from 'crypto';
import bcrypt from 'bcrypt';
import InviteToken from '../models/InviteToken.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { sendResetEmail } from '../utils/email.js';

export const sendInvite = async (req, res) => {
  try {
    const { email } = req.body;
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user) return res.status(403).json({ message: 'Only owner can invite' });
    const raw = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(raw, 10);
    const expires = new Date(Date.now() + 7*24*60*60*1000);
    await InviteToken.create({ email, project: projectId, tokenHash: hash, expiresAt: expires });
    const link = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/accept-invite?token=${raw}&email=${encodeURIComponent(email)}&project=${projectId}`;
    await sendResetEmail(email, link);
    res.json({ message: 'Invite sent (if email exists the recipient will receive it)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { email, token, project: projectId, name, password } = req.body;
    const inviteTokens = await InviteToken.find({ email, used: false });
    for (const t of inviteTokens) {
      const match = await bcrypt.compare(token, t.tokenHash);
      if (match && t.expiresAt > new Date()) {
        t.used = true; await t.save();
        let user = await User.findOne({ email });
        if (!user) {
          if (!name || !password) return res.status(400).json({ message: 'Name and password required to create account' });
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          user = await User.create({ name, email, password: hash });
        }
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (!project.members.includes(user._id)) project.members.push(user._id);
        await project.save();
        return res.json({ message: 'Joined project', projectId });
      }
    }
    res.status(400).json({ message: 'Invalid or expired token' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
