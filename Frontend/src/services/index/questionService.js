import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Fetch questions by difficulty
export const fetchQuestionsByDifficulty = async (difficulty) => {
  const response = await axios.get(`${API_URL}/questions/difficulty/${difficulty}`);
  return response.data;
};

// Generate a quiz
export const generateQuiz = async (difficulty, numQuestions) => {
  const response = await axios.get(`${API_URL}/generate-quiz`, {
    params: { difficulty, numQuestions },
  });
  return response.data;
};

// Fetch adaptive quiz
export const fetchAdaptiveQuiz = async (userId) => {
  const response = await axios.get(`${API_URL}/adaptive-quiz`, {
    params: { userId },
  });
  return response.data;
};

// Save quiz score
export const saveQuizScore = async (userId, score) => {
  const response = await axios.post(`${API_URL}/save-score`, { userId, score });
  return response.data;
};
