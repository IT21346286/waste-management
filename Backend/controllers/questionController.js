import Question from '../models/Question';


// Get questions by difficulty
exports.getQuestionsByDifficulty = async (req, res) => {
  const { difficulty } = req.params;
  try {
    const questions = await Question.find({ difficulty });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate a quiz (random questions by difficulty)
exports.generateQuiz = async (req, res) => {
  const { difficulty, numQuestions } = req.query;
  try {
    const questions = await Question.aggregate([
      { $match: { difficulty } },
      { $sample: { size: parseInt(numQuestions) } },
    ]);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
