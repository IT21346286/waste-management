import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  stages: [{
      stage: { type: Number, required: true },
      score: { type: Number, required: true },
      passed: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now }
  }]
});

  // Add compound index to prevent duplicate entries
  QuizResultSchema.index({ user: 1, stage: 1 }, { unique: true });
  
export const QuizResult = mongoose.model('QuizResult', QuizResultSchema);
