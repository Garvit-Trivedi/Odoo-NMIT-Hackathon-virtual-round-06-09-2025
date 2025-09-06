// src/models/Project.js
import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [memberSchema]
}, { timestamps: true });

// Optional: index for queries on members
projectSchema.index({ 'members.user': 1 });

export default mongoose.model('Project', projectSchema);