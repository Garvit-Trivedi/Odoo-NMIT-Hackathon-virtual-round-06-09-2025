import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();
router.use(protect);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitized = file.originalname.replace(/[^a-z0-9.\-]/gi,'_').toLowerCase();
    cb(null, uniqueSuffix + '-' + sanitized);
  }
});

const upload = multer({ storage });
router.post('/', upload.array('files', 6), uploadFile);

export default router;
