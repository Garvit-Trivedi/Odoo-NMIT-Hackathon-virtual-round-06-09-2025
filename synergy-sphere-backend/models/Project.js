import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }],
  image: { type: String }, // project cover image
  members: [memberSchema]
}, { timestamps: true });

projectSchema.index({ 'members.user': 1 });
projectSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Project', projectSchema);
