import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { getIO } from '../utils/socket.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, tags = [], manager } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const project = await Project.create({
      name,
      description,
      owner: req.user,
      manager: manager || req.user,
      tags,
      members: [{ user: req.user, role: 'owner' }]
    });

    const populated = await Project.findById(project._id).populate('members.user', 'name email image').populate('manager', 'name email image');
    res.status(201).json(populated);
  } catch (err) {
    console.error('createProject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listProjects = async (req, res) => {
  try {
    const { q, tag, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const projects = await Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit));
    res.json(projects);
  } catch (err) {
    console.error('listProjects error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members.user', 'name email image').populate('manager', 'name email image');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error('getProject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, userId, role = 'member' } = req.body;
    const allowedRoles = ['member', 'admin'];
    if (!allowedRoles.includes(role)) return res.status(400).json({ message: 'Invalid role. Allowed: member, admin' });

    let user = null;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ message: 'User not found by email' });
    } else if (userId) {
      user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found by id' });
    } else {
      return res.status(400).json({ message: 'Provide email or userId in request body' });
    }

    const project = await Project.findById(req.params.id).populate('members.user', 'name email image');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const requester = project.members.find(m => m.user._id.toString() === req.user);
    const isOwner = project.owner && project.owner.toString() === req.user;
    const isAdmin = requester && requester.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only project owner or admins can add members' });
    }

    const already = project.members.find(m => m.user._id.toString() === user._id.toString());
    if (already) return res.status(400).json({ message: 'User already in project' });

    project.members.push({ user: user._id, role });
    await project.save();

    const populated = await Project.findById(project._id).populate('members.user', 'name email image');

    try {
      const io = getIO();
      if (io) io.to(`project:${project._id}`).emit('projectUpdated', { projectId: project._id, type: 'memberAdded', member: { _id: user._id, name: user.name, email: user.email, role } });
    } catch (e) { console.error('socket emit error (memberAdded):', e); }

    return res.json(populated);
  } catch (err) {
    console.error('addMember error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const project = await Project.findById(req.params.id).populate('members.user', 'name email image');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const requester = project.members.find(m => m.user._id.toString() === req.user);
    const isOwner = project.owner && project.owner.toString() === req.user;
    const isAdmin = requester && requester.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Only project owner or admins can remove members' });

    if (user._id.toString() === (project.owner && project.owner.toString())) return res.status(400).json({ message: 'Cannot remove project owner' });

    project.members = project.members.filter(m => m.user._id.toString() !== user._id.toString());
    await project.save();

    const populated = await Project.findById(project._id).populate('members.user', 'name email image');

    try {
      const io = getIO();
      if (io) io.to(`project:${project._id}`).emit('projectUpdated', { projectId: project._id, type: 'memberRemoved', member: { _id: user._id, name: user.name, email: user.email } });
    } catch (e) { console.error('socket emit error (memberRemoved):', e); }

    res.json(populated);
  } catch (err) {
    console.error('removeMember error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const projectId = req.params.id;
    const total = await Task.countDocuments({ project: projectId });
    const todo = await Task.countDocuments({ project: projectId, status: 'todo' });
    const inprogress = await Task.countDocuments({ project: projectId, status: 'inprogress' });
    const done = await Task.countDocuments({ project: projectId, status: 'done' });
    const percentDone = total === 0 ? 0 : Math.round((done / total) * 100);
    res.json({ total, todo, inprogress, done, percentDone });
  } catch (err) {
    console.error('getProjectStats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner || project.owner.toString() !== req.user) return res.status(403).json({ message: 'Only owner can delete the project' });

    await project.deleteOne();
    try { const io = getIO(); if (io) io.to(`project:${project._id}`).emit('projectDeleted', { projectId: project._id }); } catch(e){}
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('deleteProject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
