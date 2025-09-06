import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createTask, updateTask, listTasks, getTask, deleteTask, myTasks } from '../controllers/tasksController.js';

const router = express.Router();
router.use(protect);

router.post('/', createTask);
router.get('/my', myTasks);
router.get('/', listTasks);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
