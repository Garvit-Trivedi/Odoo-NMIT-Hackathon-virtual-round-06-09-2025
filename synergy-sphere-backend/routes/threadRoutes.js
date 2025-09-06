import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createThread, addComment, listThreads, deleteThread } from '../controllers/threadsController.js';

const router = express.Router();
router.use(protect);

router.post('/', createThread);
router.get('/', listThreads);
router.post('/:id/comments', addComment);
router.delete('/:id', deleteThread);

export default router;
