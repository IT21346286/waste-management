// backend/routes/qLearningRoutes.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from '../models/User.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Q-learning model and questions
const modelPath = path.join(__dirname, '../models/q_learning_model.json');
const questionsPath = path.join(__dirname, '../models/questions.json');

const qLearningModel = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// In-memory per-user state
const userPerformance = {};

// GET questions by level
router.get('/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const levelQuestions = questions.filter(q => parseInt(q.level) === level);
  res.json(levelQuestions);
});

// POST to calculate next level based on answer
router.post('/next-level', async (req, res) => {
  try {
    const { userId, stage, isCorrect, currentLevel } = req.body;

    // Force sync from frontend-provided level (most reliable)
    const actualLevel = parseInt(currentLevel) || 1;

    if (!userPerformance[userId]) {
      userPerformance[userId] = {
        currentLevel: actualLevel,
        correctStreak: 0,
        incorrectStreak: 0,
      };
    }

    const user = userPerformance[userId];

    // ✅ Force overwrite currentLevel with frontend's reported level
    user.currentLevel = actualLevel;

    let nextLevel = user.currentLevel;

    if (isCorrect) {
      user.correctStreak++;
      user.incorrectStreak = 0;

      if (user.correctStreak >= 3) {
        const stateKey = `${user.currentLevel},1`;
        const qValues = qLearningModel.q_table[stateKey] || [-0.5, 0.0, 0.5];
        const action = Math.random() < qLearningModel.epsilon
          ? Math.floor(Math.random() * 3)
          : qValues.indexOf(Math.max(...qValues));

        if (action === 2) {
          nextLevel = Math.min(user.currentLevel + 1, qLearningModel.n_levels);
        }

        user.correctStreak = 0;
      }
    } else {
      user.incorrectStreak++;
      user.correctStreak = 0;

      if (user.incorrectStreak >= 3) {
        const stateKey = `${user.currentLevel},0`;
        const qValues = qLearningModel.q_table[stateKey] || [0.5, 0.0, -0.5];
        const action = Math.random() < qLearningModel.epsilon
          ? Math.floor(Math.random() * 3)
          : qValues.indexOf(Math.max(...qValues));

        if (action === 0) {
          nextLevel = Math.max(user.currentLevel - 1, 1);
        }

        user.incorrectStreak = 0;
      }
    }

    // ✅ Update current level after Q-learning action
    user.currentLevel = nextLevel;

    res.json({ nextLevel });
  } catch (err) {
    console.error('Error determining next level:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
