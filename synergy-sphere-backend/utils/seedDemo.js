import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

const run = async () => {
  await connectDB();
  await User.deleteMany({});
  await Project.deleteMany({});
  const alice = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'Password123!' });
  console.log('Created demo user alice@example.com (password Password123!)'); 
  process.exit(0);
};

run();
