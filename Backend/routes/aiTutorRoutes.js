import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path to Python script
const pythonScriptPath = path.join(__dirname, '../utils/aiTutor.py');

// AI Tutor endpoint
router.post('/get-explanation', async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;
        const pythonProcess = spawn('python', [
            pythonScriptPath,
            question,
            options.join('|'),
            correctAnswer
        ]);

        let explanation = '';
        pythonProcess.stdout.on('data', (data) => {
            explanation += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                res.status(500).json({ error: 'Failed to generate explanation' });
                return;
            }
            res.json({ explanation });
        });
    } catch (error) {
        console.error('AI Tutor error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;