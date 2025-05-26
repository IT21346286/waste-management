import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: String,
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
