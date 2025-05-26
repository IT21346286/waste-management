import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { detectEmotion } from '../controllers/emotionController.js';

const router = express.Router();

router.route('/detect').post(protect, detectEmotion); // Protect this route if needed

export default router;