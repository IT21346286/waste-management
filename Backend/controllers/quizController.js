import { QuizResult } from '../models/quizModel';
import fetch from 'node-fetch';
import pdf from 'pdf-parse';
import User from '../models/User';

export const getStageRequirements = async (req, res) => {
  try {
    const calculateRequirements = (stageNumber) => {
      const BASE_TIME = 60;
      const BASE_SCORE = 3;

      return {
        time: BASE_TIME * stageNumber,
        requiredScore: BASE_SCORE * stageNumber, // Linear growth
      };
    };

    const stage = parseInt(req.query.stage) || 1;
    const showNext = parseInt(req.query.next) || 1;

    const stages = {};
    for (let s = stage; s < stage + showNext; s++) {
      stages[s] = calculateRequirements(s);
    }

    res.json(stages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveQuizResult = async (req, res) => {
  try {
    const stage = Number(req.body.stage);
    const score = Number(req.body.score);

    if (isNaN(stage)) return res.status(400).json({ message: 'Invalid stage format' });
    if (isNaN(score)) return res.status(400).json({ message: 'Invalid score format' });

    const calculateRequirements = (stageNumber) => {
      const BASE_SCORE = 3;
      return { requiredScore: BASE_SCORE * stageNumber };
    };

    const requiredScore = calculateRequirements(stage).requiredScore;
    const passed = score >= requiredScore;

    // Get the last level completed by the user from quizHistory
    const userHistory = await User.findById(req.user._id).select('quizHistory');
    const lastLevel = Number(req.body.currentLevel) || 1;


    // Update the user's last completed level for the current stage
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        quizHistory: {
          score,
          stage,
          timestamp: new Date(),
          passed,
          level: lastLevel // now coming from the actual currentLevel the user had
        },
      },
    });

    // Save the result for the stage
    const result = await QuizResult.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          stages: {
            stage,
            score,
            passed,
            timestamp: new Date(),
          },
        },
        userName: req.user.name,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getHighestStage = async (req, res) => {
  try {
    const result = await QuizResult.findOne({ user: req.user._id });
    if (result && result.stages.length > 0) {
      const passedStages = result.stages.filter((stage) => stage.passed);
      if (passedStages.length > 0) {
        passedStages.sort((a, b) => b.stage - a.stage);
        res.json({ highestStage: passedStages[0].stage });
      } else {
        res.json({ highestStage: 0 });
      }
    } else {
      res.json({ highestStage: 0 });
    }
  } catch (error) {
    console.error('Error in getHighestStage:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await QuizResult.aggregate([
      { $unwind: '$stages' },
      {
        $sort: {
          user: 1,
          'stages.stage': -1,
          'stages.timestamp': -1,
        },
      },
      {
        $group: {
          _id: '$user',
          userName: { $first: '$userName' },
          stage: { $max: '$stages.stage' },
          score: { $first: '$stages.score' },
        },
      },
      {
        $sort: {
          stage: -1,
          score: -1,
        },
      },
      {
        $project: {
          _id: 0,
          userName: 1,
          stage: 1,
          score: 1,
        },
      },
    ]);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExplanation = async (req, res) => {
  console.log('Request Body:', req.body);
  try {
    const { question, options, correctAnswer } = req.body;

    const prompt = `Calculate and explain step-by-step: ${question}\nOptions: ${options.join(
      ', '
    )}\nCorrect answer: ${options[correctAnswer.charCodeAt(0) - 65]}\nFirst show the mathematical calculation, then provide detailed explanations.`;

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. List Available models.
    const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listModelsResponse = await fetch(listModelsUrl);

    if (!listModelsResponse.ok) {
      const errorData = await listModelsResponse.json();
      console.error('Gemini ListModels API Error:', errorData);
      return res.status(500).json({
        explanation: `Gemini ListModels API Error: ${errorData.error && errorData.error.message || listModelsResponse.statusText}`,
      });
    }

    const listModelsData = await listModelsResponse.json();
    console.log("Available Gemini Models:", listModelsData);

    // 2. Try using a model that is available.
    //old model: const modelName = 'models/gemini-1.5-pro-latest';
    const modelName = 'models/gemini-2.0-flash'; // Use the correct model from the list.
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(500).json({
        explanation: `Gemini API Error: ${errorData.error && errorData.error.message || response.statusText}`,
      });
    }

    const data = await response.json();
    let explanation = 'Explanation not available';

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      explanation = data.candidates[0].content.parts[0].text.trim();
    }

    res.json({ explanation });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      explanation: 'An error occurred while generating the explanation. Please try again later.',
    });
  }
};


export const analyzeReport = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Extract text from the PDF
    let pdfText;
    try {
      const dataBuffer = req.file.buffer;
      const data = await pdf(dataBuffer);
      pdfText = data.text;

      // Basic validation to ensure we got meaningful text
      if (!pdfText || pdfText.trim().length < 50) {
        return res.status(400).json({ error: 'PDF text extraction failed or empty PDF content' });
      }
    } catch (err) {
      console.error('PDF text extraction error:', err);
      return res.status(400).json({ error: 'Failed to extract text from PDF' });
    }

    // Instruction-Based Prompting
    const prompt = `
    Analyze the following student quiz performance report. Provide a precise, excellent, and on-point analysis, incorporating the shown emotions during the questions.

    --- Quiz Performance Report ---
    ${pdfText}
    --- End of Report ---

    Your analysis should cover the following points in detail:

    1.  **Overall Performance Analysis:**
        * Calculate and provide the student's overall accuracy percentage.
        * Summarize performance across all questions.
        * Interpret the implications of this overall performance.

    2.  **Question-by-Question Analysis (including Emotional Insights):**
        * For each question (Q1, Q2, etc.), analyze:
          - Correct/Incorrect status
          - Detected Emotions and their meaning
          - Connection between emotions and answer outcome
        * Format as a clear table, ensuring each row is on a new line:
          | Question | Subject | Status | Emotions | Interpretation |
          |---|---|---|---|---|
          | Q1 | Maths & commerce | Correct | Neutral, Happiness, Happiness | The student felt confident and **happy or neutral** about answering this question correctly. This indicates a good understanding of the topic. |
          | Q2 | Environmental Pollution and Conservation | Incorrect | Anger, Contempt, Sadness | The student exhibited strong **negative emotions (anger, contempt, sadness)** during the reading of this question. This suggests immediate frustration or disengagement with the topic or question, potentially hindering their ability to process information effectively and leading to an incorrect answer. |
          | Q3 | General Waste Management Knowledge | Incorrect | Surprise, Fear, Surprise, Surprise | The repeated **surprise and fear** while reading this question indicate the student encountered unexpected difficulty or uncertainty with the content or phrasing. This initial emotional reaction suggests a fundamental lack of clarity or knowledge in this area, resulting in an incorrect answer. |
          | Q4 | Science (bio,physics,chemistry) | Incorrect | Surprise, Fear, Surprise, Surprise | Similar to Q3, the consistent **surprise and fear** detected during the reading of this science question suggest the student found the concepts or terminology unfamiliar or intimidating. This immediate cognitive or emotional block likely contributed to an incorrect response, highlighting a gap in their scientific understanding. |
          | Q5 | Technology & Engineering | Incorrect | Surprise, Fear, Surprise, Surprise | The prominent **surprise and fear** while reading this technology question imply the student was unprepared or overwhelmed by its demands. This initial emotional state indicates a significant knowledge gap or difficulty in grasping the technical concepts, leading to an incorrect answer. |
          | Q6 | Environmental Pollution and Conservation | Incorrect | Contempt, Disgust, Neutral | The presence of **contempt and disgust**, alongside periods of neutrality, while reading this environmental question suggests a strong negative reaction to the topic or its presentation. This emotional state might have led to disengagement or impaired focus, contributing to the incorrect answer. |
          
    3.  **Subject Strengths and Weaknesses:**
        * Identify strongest subjects (correct answers + positive emotions)
        * Identify weakest subjects (incorrect answers + negative emotions)
        * Be specific with subject names from the report.

    4.  **Improvement Recommendations:**
        * List specific subjects needing more focus
        **Suggested Learning Resources & Links:** For each weak subject, suggest highly relevant and reputable learning websites or platforms. **Where possible, include direct links (URLs) to these resources.** If a specific link isn't immediately available or reliable, suggest the website name and indicate it's a general recommendation.
        * **Example Format:**
            * **Subject:** Environmental Pollution and Conservation
                * **Resource 1:** Khan Academy - Environmental Science ([https://www.khanacademy.org/science/environmental-science](https://www.khanacademy.org/science/environmental-science))
                * **Resource 2:** National Geographic Kids - Pollution Facts ([https://kids.nationalgeographic.com/explore/science/pollution/](https://kids.nationalgeographic.com/explore/science/pollution/))
                
            * **Subject:** General Waste Management Knowledge
                * **Resource 1:** EPA - Waste Management Basics ([https://www.epa.gov/recycle/waste-management-basics](https://www.epa.gov/recycle/waste-management-basics))
    
    5. **Actionable Learning Strategies:**  
       * Provide actionable learning strategies for each weak area. 
    
    6.  **Emotion Management Tips:**
        * Provide strategies for managing negative emotions during quizzes or tests.
        * Suggest relaxation techniques, mindfulness practices, or study breaks to help students cope with stress and anxiety.

    Guidelines:
    - Be concise yet thorough
    - Use markdown formatting for readability
    - Only analyze what's in the report - don't invent data
    - Highlight key takeaways at the top
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Backend is using API Key (first few chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND');
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const modelName = 'models/gemini-2.0-flash'; // Updated to newer model
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      // This line has been carefully re-written to avoid optional chaining (?.):
      return res.status(500).json({
        error: (errorData.error && errorData.error.message) ? errorData.error.message : 'Analysis API request failed'
      });
    }

    const data = await response.json();

    // The logic here is also written to avoid optional chaining for broader compatibility:
    let analysis = "No analysis generated";
    if (data.candidates && data.candidates[0] &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
        analysis = data.candidates[0].content.parts[0].text;
    }

    res.json({ analysis });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Server error during analysis',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};