import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, assignee, dueDate, project, priority, tags, images } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Title and project required' });
    const t = await Task.create({ title, description, assignee, dueDate, project, priority, tags, images });
    try { const io = (await import('../utils/socket.js')).getIO(); if (io && project) io.to(`project:${project}`).emit('taskCreated', t); } catch(e){console.error(e);}
    res.status(201).json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listTasks = async (req, res) => {
  try {
    const { project, status, priority, assignee, q, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (q) filter.$text = { $search: q };

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const tasks = await Task.find(filter).populate('assignee', 'name email image').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTask = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id).populate('assignee', 'name email image');
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    Object.assign(t, req.body);
    await t.save();
    try { const io = (await import('../utils/socket.js')).getIO(); if (io && t.project) io.to(`project:${t.project}`).emit('taskUpdated', t); } catch(e){console.error(e);}
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    await t.deleteOne();
    try { const io = (await import('../utils/socket.js')).getIO(); if (io && t.project) io.to(`project:${t.project}`).emit('taskDeleted', { _id: t._id, projectId: t.project }); } catch(e){console.error(e);}
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const myTasks = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = { assignee: req.user };
    if (status) filter.status = status;
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const tasks = await Task.find(filter).populate('project', 'name').sort({ dueDate: 1 }).skip(skip).limit(Number(limit));
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
