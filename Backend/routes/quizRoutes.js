import express from 'express';
import multer from 'multer';
import { authGuard } from '../middleware/authMiddleware.js';
import { 
  saveQuizResult, 
  getStageRequirements, 
  getHighestStage,
  getExplanation,
  analyzeReport,
  getLeaderboard
} from '../controllers/quizController.js';

const router = express.Router();
const upload = multer(); // For handling multipart/form-data

// Quiz progression routes
router.get('/stage-requirements', authGuard, getStageRequirements);
router.post('/save-result', authGuard, saveQuizResult);
router.get('/highest-stage', authGuard, getHighestStage);
router.post('/get-explanation', authGuard, getExplanation);
//router.post('/analyze-report', analyzeReport); 
router.post('/analyze-report', upload.single('pdf'), analyzeReport);
router.get('/leaderboard', getLeaderboard);

export default router;

