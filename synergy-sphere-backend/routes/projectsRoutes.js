import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createProject, listProjects, getProject, addMember, deleteProject, removeMember, getProjectStats } from '../controllers/projectsController.js';

const router = express.Router();
router.use(protect);

router.post('/', createProject);
router.get('/', listProjects);
router.get('/:id', getProject);
router.get('/:id/stats', getProjectStats);
router.post('/:id/members', addMember);
router.delete('/:id/members', removeMember);
router.delete('/:id', deleteProject);

export default router;
