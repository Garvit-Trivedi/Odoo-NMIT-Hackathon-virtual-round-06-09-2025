import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String },
}, { timestamps: true });

const threadSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  title: { type: String },
  comments: [commentSchema]
}, { timestamps: true });

export default mongoose.model('Thread', threadSchema);
