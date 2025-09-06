import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import threadsRoutes from './routes/threadsRoutes.js';
import { verifySocket } from './utils/socketAuth.js';
import { setIO } from './utils/socket.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// security
app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

io.use(async (socket, next) => {
  try {
    await verifySocket(socket);
    next();
  } catch (err) {
    next(new Error('unauthorized'));
  }
});

setIO(io);

io.on('connection', (socket) => {
  console.log('socket connected', socket.id, 'user:', socket.userId);
  socket.on('joinProject', ({ projectId }) => {
    socket.join(`project:${projectId}`);
  });

  socket.on('leaveProject', ({ projectId }) => {
    socket.leave(`project:${projectId}`);
  });

  socket.on('taskUpdated', (payload) => {
    if (payload?.projectId) {
      io.to(`project:${payload.projectId}`).emit('taskUpdated', payload);
    }
  });
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/threads', threadsRoutes);

app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
