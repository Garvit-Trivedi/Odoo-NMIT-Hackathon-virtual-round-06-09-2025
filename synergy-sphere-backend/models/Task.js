import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  dueDate: { type: Date },
  status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  tags: [{ type: String }],
  images: [{ type: String }]
}, { timestamps: true });

taskSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Task', taskSchema);
