import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/get-action', async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.MODEL_API_URL}/get-action`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error('Model API error:', error);
    res.status(500).json({ error: 'Failed to get model prediction' });
  }
});

export default router;