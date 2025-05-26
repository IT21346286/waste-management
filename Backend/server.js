import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import cors from "cors";
import fs from "fs";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler";

// Routes
import userRoutes from "./routes/userRoutes";
import itemRoutes from "./routes/itemRoutes";
import questionRoutes from './routes/questionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import aiTutorRoutes from './routes/aiTutorRoutes.js';
import donationRoutes from "./routes/donationRoutes.js";



dotenv.config();
connectDB();
const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes); // Ensure this line is correct
app.use('/api/questions', questionRoutes); // Handling question routes
app.use('/api/quiz', quizRoutes);
app.use('/api/ai-tutor', aiTutorRoutes);
app.use("/api/donations", donationRoutes);




// Static assets
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
