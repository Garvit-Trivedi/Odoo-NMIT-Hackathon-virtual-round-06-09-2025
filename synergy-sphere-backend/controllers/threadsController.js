import Thread from '../models/Thread.js';

export const createThread = async (req, res) => {
  const { project, title, initialComment } = req.body;
  if (!project || !title) return res.status(400).json({ message: 'Project and title required' });
  const thread = await Thread.create({ project, title, comments: initialComment ? [{ author: req.user, text: initialComment }] : [] });
  res.status(201).json(thread);
};

export const listThreads = async (req, res) => {
  const { project } = req.query;
  const q = project ? { project } : {};
  const threads = await Thread.find(q).populate('comments.author', 'name');
  res.json(threads);
};

export const addComment = async (req, res) => {
  const { text } = req.body;
  const thread = await Thread.findById(req.params.id);
  if (!thread) return res.status(404).json({ message: 'Not found' });
  thread.comments.push({ author: req.user, text });
  await thread.save();
  try { const io = (await import('../utils/socket.js')).getIO(); if (io && thread.project) io.to(`project:${thread.project}`).emit('threadComment', { threadId: thread._id, text, author: req.user }); } catch(e){console.error(e);}
  res.json(thread);
};

export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Not found' });
    await thread.deleteOne();
    try { const io = (await import('../utils/socket.js')).getIO(); if (io && thread.project) io.to(`project:${thread.project}`).emit('threadDeleted', { _id: thread._id, projectId: thread.project }); } catch(e){console.error(e);}
    res.json({ message: 'Thread deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
