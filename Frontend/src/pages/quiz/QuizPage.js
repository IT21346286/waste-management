import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from "../../components/MainLayout";
import InstructionsQuiz from './InstructionsQuiz';
import { TbHandClick } from "react-icons/tb";
import { FaRankingStar } from "react-icons/fa6";
import { RiRobot2Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import "../../css/quiz.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStage, setCompletedStage] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [stageRequirements, setStageRequirements] = useState({});
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const [timerActive, setTimerActive] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [statusMessage, setStatusMessage] = useState("");
  // Quiz Hearts:
  const [correctStreak, setCorrectStreak] = useState(0);
  // Quiz Report:
  const [emotionLog, setEmotionLog] = useState([]);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [showReport, setShowReport] = useState(false);
 
  // PDF Analysis:
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false); // New state for loading indicator
  const analysisModalRef = useRef(null); // Create a ref for your analysis modal content
  const analysisTextRef = useRef(null); // NEW: Ref for the scrollable text content inside

  // NEW: Consecutive negative emotions tracking
  const [consecutiveNegativeEmotions, setConsecutiveNegativeEmotions] = useState(0);
  const [showEmotionWarning, setShowEmotionWarning] = useState(false);

  


  const requestCameraPermission = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      setStream(userStream);
    } catch (err) {
      console.error("Camera permission denied", err);
      alert("Please allow camera access to continue.");
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (cameraPermission && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current.play();
    }
  }, [cameraPermission, stream]);

  const captureImage = useCallback(async () => {
    if (!cameraPermission || !videoRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
  
    const imageData = canvas.toDataURL("image/jpeg");
  
    try {
      const response = await axios.post('http://localhost:8000/predict-emotion', {
        image: imageData
      });
  
      if (response.data && response.data.emotion) {
        setDetectedEmotion(response.data.emotion);
        setStatusMessage(""); // ✅ clear the message when emotion is detected
        // Save emotion to log
        setEmotionLog(prev => [...prev, response.data.emotion]);
        // NEW: Track negative emotions
        const negativeEmotions = ['anger', 'sadness', 'fear', 'disgust', 'contempt'];
        const currentEmotion = response.data.emotion.toLowerCase();
        if (negativeEmotions.includes(currentEmotion)) {
          setConsecutiveNegativeEmotions(prev => prev + 1);
        } else {
          setConsecutiveNegativeEmotions(0);
        }
      }
      else if (response.data.message) {
      setStatusMessage(response.data.message);  // Fixed this line
      setDetectedEmotion("");
    }
    } catch (error) {
      console.error("Emotion detection failed:", error);
    }
  }, [cameraPermission]);

  useEffect(() => {
    if (quizStarted && cameraPermission) {
      const interval = setInterval(() => {
        captureImage();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [quizStarted, cameraPermission, captureImage]);

  useEffect(() => {
    if (consecutiveNegativeEmotions >= 5 && quizStarted) {
        setShowEmotionWarning(true);
        setConsecutiveNegativeEmotions(0);
    }
  }, [consecutiveNegativeEmotions, quizStarted]);
    
    const loadRequirements = useCallback(async (stage) => {
        try {
               const storedData = localStorage.getItem('account');
               const { token } = JSON.parse(storedData);
               const response = await axios.get(`/api/quiz/stage-requirements?stage=${stage}`, {
                   headers: { Authorization: `Bearer ${token}` }
               });
               setStageRequirements(prev => ({ ...prev, ...response.data }));
           } catch (error) {
               console.error('Error loading requirements:', error);
           }
    }, []);

       useEffect(() => {
           const initializeQuiz = async () => {
               const storedData = localStorage.getItem('account');
               if (!storedData) {
                   navigate('/login');
                   return;
               }
               try {
                   const { token } = JSON.parse(storedData);
                   const config = { headers: { Authorization: `Bearer ${token}` } };

                   const progressRes = await axios.get('/api/quiz/highest-stage', config);
                   const highestStage = progressRes.data.highestStage;

                   const requirementsRes = await axios.get(`/api/quiz/stage-requirements?stage=${highestStage + 1}`, config);

                   const initialStage = highestStage + 1;
                   setCurrentStage(initialStage);
                   setTime(requirementsRes.data[initialStage]?.time || 60);
                   setStageRequirements(requirementsRes.data);
                   setLoading(false);

               } catch (error) {
                   console.error('Error initializing quiz:', error);
                   if (error.response?.status === 401) {
                       navigate('/login');
                   } else {
                       alert("An error occurred while initializing the quiz.");
                       setLoading(false);
                   }
               }
           };
           initializeQuiz();
       }, [navigate, loadRequirements]);

       const handleQuizFinish = useCallback(async (stage, finalScore) => {
           setQuizFinished(true);
           setCompletedStage(stage);
           setTimerActive(false);
           if (timerRef.current) {
               clearInterval(timerRef.current);
               timerRef.current = null;
           }
           try {
               const storedData = localStorage.getItem('account');
               const { token } = JSON.parse(storedData);
               await axios.post('/api/quiz/save-result',
                   { score: finalScore, stage, currentLevel },
                   { headers: { Authorization: `Bearer ${token}` } }
               );

               // Save last completed level to localStorage
               localStorage.setItem(`stage_${stage}_level`, currentLevel);

           } catch (error) {
               console.error('Result save error:', error);
           }
       }, [currentLevel]);

       useEffect(() => {
           if (quizStarted && timerActive && !quizFinished) {
               timerRef.current = setInterval(() => {
                   setTime(prev => {
                       if (prev <= 1) {
                           clearInterval(timerRef.current);
                           timerRef.current = null;
                           handleQuizFinish(currentStage, score);
                           return 0;
                       }
                       return prev - 1;
                   });
               }, 1000);
           } else if (timerRef.current) {
               clearInterval(timerRef.current);
               timerRef.current = null;
           }
           return () => {
               if (timerRef.current) {
                   clearInterval(timerRef.current);
                   timerRef.current = null;
               }
           };
       }, [quizStarted, timerActive, quizFinished, currentStage, score, handleQuizFinish]);

       const loadQuestion = useCallback(async (level) => {
           try {
               const storedData = localStorage.getItem('account');
               const { token } = JSON.parse(storedData);
               const response = await axios.get(`/api/questions/${level}`, {
                   headers: { Authorization: `Bearer ${token}` }
               });
               if (response.data?.length > 0) {
                   const randomQuestion = response.data[Math.floor(Math.random() * response.data.length)];
                   setCurrentQuestion(randomQuestion);
               }
           } catch (error) {
               console.error('Question load error:', error);
           }
       }, []);

       const handleAnswer = async (answer) => {
        if (feedback || !currentQuestion) return;
      
        const correct = answer === currentQuestion.correct_answer;
        setFeedback(correct ? 'Correct!' : 'Incorrect!');
        setSelectedAnswer(answer);
        setTimerActive(false);

        // report
        setQuestionHistory(prev => [
        ...prev,
        {
            subject: currentQuestion.subject,
            question: currentQuestion.question,
            selectedAnswer: answer,
            isCorrect: correct,
            detectedEmotions: [...emotionLog], // emotions captured during this question
        }
        ]);
        setEmotionLog([]); // clear for next question
      
        const questionLevel = parseInt(currentQuestion.level);
        if (correct) {
          setScore(prev => prev + questionLevel);
          //Quiz Hearts (inclusing else section):
          setCorrectStreak(prev => Math.min(prev + 1, 3));
         } else {
            setCorrectStreak(prev => Math.max(prev - 1, 0));
     }
      
        try {
          const storedData = localStorage.getItem('account');
          const { token, _id: userId } = JSON.parse(storedData);
      
          const response = await axios.post('/api/questions/next-level',
            { userId, stage: currentStage, currentLevel: questionLevel, isCorrect: correct },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // ❌setCurrentLevel(response.data.nextLevel);❌
          const newLevel = response.data.nextLevel;
          setCurrentLevel(newLevel); // ✅ just save new level
          // ❌ don't load question yet
        } catch (error) {
          console.error('Level progression error:', error);
        }
      };  
      

       const startNewStage = (stage) => {
        const stageTime = stageRequirements[stage]?.time || 60;
    
        // Retrieve the last completed level for the given stage
        const lastCompletedLevel = localStorage.getItem(`stage_${stage - 1}_level`);
        const startingLevel = lastCompletedLevel ? parseInt(lastCompletedLevel) : 1; // Default to level 1 if no level is found
    
        localStorage.setItem('currentStage', stage);
        setCurrentStage(stage);
        setQuizStarted(true);
        setQuizFinished(false);
        setScore(0);
        setCurrentLevel(startingLevel); // Set the starting level based on the last completed level
        setTime(stageTime);
        setFeedback('');
        setSelectedAnswer('');
        loadQuestion(startingLevel);
        setTimerActive(true);
    };
    

       useEffect(() => {
           if (currentStage > 1 && !stageRequirements[currentStage]) {
               loadRequirements(currentStage);
           }
           const stageTime = stageRequirements[currentStage]?.time || 60;
           setTime(stageTime);
       }, [currentStage, stageRequirements, loadRequirements]);

       const fetchLeaderboard = useCallback(async () => {
           try {
               const storedData = localStorage.getItem('account');
               if (!storedData) return;
               const { token } = JSON.parse(storedData);
               const response = await axios.get('/api/quiz/leaderboard', {
                   headers: { Authorization: `Bearer ${token}` }
               });
               setLeaderboard(response.data);
               setShowLeaderboard(true);
           } catch (error) {
               console.error('Error fetching leaderboard:', error);
           }
       }, []);

       const generatePDF = () => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Add title
            pdf.setFontSize(20);
            pdf.text('Performance Summary', 105, 20, { align: 'center' });
            pdf.setFontSize(12);
            
            let yPosition = 30; // Starting Y position
            
            // Add each question entry
            questionHistory.forEach((entry, index) => {
                // Add question number and subject
                pdf.text(`Q${index + 1} Subject: ${entry.subject}`, 20, yPosition);
                yPosition += 7;
                
                // Add question text (split into multiple lines if needed)
                const questionLines = pdf.splitTextToSize(`Question: ${entry.question}`, 170);
                pdf.text(questionLines, 20, yPosition);
                yPosition += 7 * questionLines.length;
                
                // Add answer status
                pdf.setTextColor(entry.isCorrect ? '#28a745' : '#dc3545');
                pdf.text(`Answer: ${entry.isCorrect ? 'Correct' : 'Incorrect'}`, 20, yPosition);
                pdf.setTextColor('#000000'); // Reset color
                yPosition += 7;
                
                // Add emotions
                pdf.text(`Detected Emotions: ${entry.detectedEmotions.join(', ') || 'None'}`, 20, yPosition);
                yPosition += 10;
                
                // Add a horizontal line for separation between questions
                pdf.line(20, yPosition, 190, yPosition); // Draw a line
                yPosition += 10; // Add some space after the line
                
                // Add page break if needed
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
            });
            
            pdf.save('performance-summary.pdf');
        };


       // NEW FUNCTION FOR ANALYSIS PDF
        const generateAnalysisPDF = useCallback(async () => {
        // Target the main content div for capture
        const input = analysisModalRef.current;

        if (!input) {
            console.error("Analysis content ref is not set. Cannot generate PDF.");
            alert("Cannot generate PDF: Analysis content is not available. Please ensure the analysis modal is fully loaded.");
            return;
        }

        // Store original styles to restore later
        const originalInputOverflow = input.style.overflow;
        const originalInputMaxHeight = input.style.maxHeight;
        const originalInputHeight = input.style.height; // Capture original height too

        const originalAnalysisTextOverflowY = analysisTextRef.current ? analysisTextRef.current.style.overflowY : '';
        const originalAnalysisTextMaxHeight = analysisTextRef.current ? analysisTextRef.current.style.maxHeight : '';
        const originalAnalysisTextHeight = analysisTextRef.current ? analysisTextRef.current.style.height : ''; // Capture original height too

        try {
            // Temporarily adjust styles for html2canvas to capture full content
            // IMPORTANT: Allow elements to fully expand
            input.style.overflow = 'visible';
            input.style.maxHeight = 'none';
            input.style.height = 'auto'; // Ensure height adjusts to content

            if (analysisTextRef.current) {
                analysisTextRef.current.style.overflowY = 'visible';
                analysisTextRef.current.style.maxHeight = 'none';
                analysisTextRef.current.style.height = 'auto'; // Ensure height adjusts to content
            }

            // Wait for styles to apply before capturing (optional, but can help)
            await new Promise(resolve => setTimeout(resolve, 50));

            const canvas = await html2canvas(input, {
                scale: 4, // INCREASED SCALE for better resolution (try 5 if needed)
                useCORS: true, // Important if you have external images/resources
                logging: false, // Set to true if you need html2canvas debug logs
                // Explicitly set windowWidth and windowHeight to capture the full scrollable area
                windowWidth: input.scrollWidth,
                windowHeight: input.scrollHeight,
                // You might need to adjust x, y, width, height if your modal has specific padding/margins
                // x: input.getBoundingClientRect().left,
                // y: input.getBoundingClientRect().top,
                // width: input.scrollWidth,
                // height: input.scrollHeight,
            });

            // Use JPEG for potentially smaller file sizes with good quality
            // 0.9 quality is good, increase to 1.0 if any artifacts
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;
            const margin = 10; // Standard margin for all sides

            // Add first page
            // Ensure image starts after a top margin
            pdf.addImage(imgData, 'JPEG', margin, margin, pdfWidth - (2 * margin), imgHeight);
            heightLeft -= (pdfHeight - (2 * margin)); // Subtract page height minus top and bottom margins

            // Add remaining pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight; // Calculate vertical position for the current slice
                pdf.addPage();
                // Add image to the new page, adjust Y to ensure content flow
                pdf.addImage(imgData, 'JPEG', margin, margin + position, pdfWidth - (2 * margin), imgHeight);
                heightLeft -= (pdfHeight - (2 * margin));
            }

            pdf.save('quiz_analysis_report.pdf');

        } catch (err) {
            console.error("Error generating analysis PDF:", err);
            alert("Failed to generate analysis PDF. Please try again. Check console for details.");
        } finally {
            // Restore original styles
            input.style.overflow = originalInputOverflow;
            input.style.maxHeight = originalInputMaxHeight;
            input.style.height = originalInputHeight;

            if (analysisTextRef.current) {
                analysisTextRef.current.style.overflowY = originalAnalysisTextOverflowY;
                analysisTextRef.current.style.maxHeight = originalAnalysisTextMaxHeight;
                analysisTextRef.current.style.height = originalAnalysisTextHeight;
            }
        }
    }, []);
        

       const handleGetExplanation = useCallback(async () => {
           setExplanationLoading(true);
           setAiExplanation('');
           try {
               const storedData = localStorage.getItem('account');
               const { token } = JSON.parse(storedData);

               const response = await axios.post('/api/quiz/get-explanation', {
                   question: currentQuestion.question,
                   options: currentQuestion.options,
                   correctAnswer: currentQuestion.options[
                       currentQuestion.correct_answer.charCodeAt(0) - 65
                   ]
               }, {
                   headers: { Authorization: `Bearer ${token}` }
               });

               const explanation = response.data.explanation || "Could not generate explanation";
               setAiExplanation(explanation);

           } catch (error) {
               console.error('Explanation error:', error);
               setAiExplanation(error.response?.data?.explanation || "Explanation service unavailable");
           }
           setExplanationLoading(false);
       }, [currentQuestion]);

       const handleNextQuestion = () => {
           setFeedback('');
           setSelectedAnswer('');
           setAiExplanation('');
           loadQuestion(currentLevel);
           setTimerActive(true);
       };

       const handleModalOpen = () => {
           setModalOpen(true);
       };

       const handleModalClose = () => {
           setModalOpen(false);
       };


       if (loading) {
           return <MainLayout><div className="loading-container">Loading...</div></MainLayout>;
       }

       const currentRequirements = stageRequirements[completedStage] || {};
       const nextStage = (completedStage || currentStage) + 1;
       const passed = score >= currentRequirements.requiredScore;

       return (
           <MainLayout>
               <div className="quiz-container">
                    <div className="camera-feed">
                        <video ref={videoRef} style={{ width: '200px', height: '150px', borderRadius: '10px' }} autoPlay muted></video>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </div>
                    <div className="emotion-label">
                        {detectedEmotion && (
                            <p className="text-sm mt-2 text-center text-blue-700 font-semibold">
                            Detected Emotion: {detectedEmotion}
                            </p>
                        )}

                        {statusMessage && (
                            <p className="text-sm mt-2 text-center text-red-700 font-semibold">
                            Detected Emotion: {statusMessage}
                            </p>
                        )}
                    </div>

                   <div className="absolute top-1/2 left-20 transform -translate-y-1/2 flex flex-col gap-4" style={{ zIndex: 2 }}>
                        {/* PDF Upload Button */}
                        <div className="relative">
                            <input
                                type="file"
                                id="pdf-upload"
                                accept=".pdf"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    try {
                                        setIsAnalyzingPdf(true); // Set loading state
                                        setAnalysisResults(null); // Clear previous results
                                        setShowAnalysisModal(true); // Open modal to show loading/results
                                        
                                        const formData = new FormData();
                                        formData.append('pdf', file);
                                        
                                        const storedData = localStorage.getItem('account');
                                        const { token } = JSON.parse(storedData);
                                        
                                        const response = await axios.post('/api/quiz/analyze-report', formData, {
                                            headers: {
                                                'Authorization': `Bearer ${token}`,
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        });
                                        
                                        setAnalysisResults(response.data.analysis || "No analysis available.");
                                        
                                    } catch (error) {
                                        console.error('Error analyzing PDF:', error);
                                        // Provide a user-friendly error message
                                        setAnalysisResults("Failed to analyze the PDF. Please ensure it's a valid quiz report PDF and try again. Error: " + (error.response?.data?.error || error.message));
                                    } finally {
                                        setIsAnalyzingPdf(false); // Clear loading state
                                    }
                                }}
                            />
                            <label
                                htmlFor="pdf-upload"
                                className="bg-gradient-to-b from-[#fbc2eb] to-[#a6c1ee] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1 cursor-pointer"
                                style={{ width: '150px' }}
                            >
                                <div className="flex flex-col items-center">
                                    <FaUpload className="w-6 h-6 mb-1" />
                                    <span className="text-xl font-playfair-display leading-tight">
                                        Upload Report
                                    </span>
                                    <span className="text-xl font-playfair-display leading-tight">
                                        for Analysis
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div> 
 

                   {showAnalysisModal && (
                        <div className="analysis-modal">
                            <div className="analysis-content" ref={analysisModalRef}>
                                <div className="analysis-header">
                                    <h3>Quiz Performance Analysis Report</h3>
                                    <button 
                                        onClick={() => setShowAnalysisModal(false)} 
                                        className="close-button"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="analysis-text" ref={analysisTextRef}>
                                    {isAnalyzingPdf ? (
                                        <p>Analyzing report, please wait...</p>
                                    ) : analysisResults ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ children }) => {
                                                // Normalize to array
                                                const childrenArray = Array.isArray(children) ? children : [children];

                                                // Convert children to raw string for detection
                                                const rawText = childrenArray.map(child => {
                                                    if (typeof child === 'string') return child;
                                                    if (child?.props?.children) {
                                                    const inner = child.props.children;
                                                    return Array.isArray(inner) ? inner.join('') : inner;
                                                    }
                                                    return '';
                                                }).join('').trim();

                                                // Conditions
                                                const isSectionTitle = /^([1-6])\.\s/.test(rawText);
                                                const isSubjectStart = /^Subject:/i.test(rawText);

                                                // Combine class names
                                                const classNames = [
                                                    isSectionTitle ? 'section-title' : '',
                                                    isSubjectStart ? 'subject-block' : ''
                                                ].join(' ').trim();

                                                return <p className={classNames}>{children}</p>;
                                                }
                                            }}
                                            >
                                            {analysisResults}
                                            </ReactMarkdown>

                                        // <-- This is the crucial change!

 
                                    ) : (
                                        <p>No analysis available. Upload a PDF report to get insights.</p>
                                    )}
                                </div>
                                <div className="analysis-actions">
                                    <button
                                        onClick={generateAnalysisPDF} // <-- Call your new function directly here
                                        className="download-button"
                                        disabled={!analysisResults || isAnalyzingPdf || analysisResults.includes("Failed to analyze")}
                                    >
                                        Download Analysis as PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                   <div className="absolute top-1/2 right-20 transform -translate-y-1/2 flex flex-col gap-4" style={{ zIndex: 2 }}>
                       <button
                           className="bg-gradient-to-b from-[#a3d8ff] to-[#60a5fa] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
                           onClick={handleModalOpen}
                       >
                           <TbHandClick className="w-6 h-6 mr-2" />
                           <span className="text-xl font-playfair-display">Instructions</span>
                       </button>
                       <button
                           className="bg-gradient-to-b from-[#e3fcd7] to-[#4caf50] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
                           onClick={fetchLeaderboard}
                       >
                           <FaRankingStar className="w-6 h-6 mr-2" />
                           <span className="text-xl font-playfair-display">Leaderboard</span>
                       </button>
                       <div className="flex justify-center mt-4">
                            {[...Array(3)].map((_, i) => (
                                <FaHeart
                                key={i}
                                className="mx-1 text-3xl"
                                color={i < correctStreak ? 'red' : 'white'}
                                style={{ stroke: 'black', strokeWidth: 30 }}
                                />
                            ))}
                        </div>
                   </div>
                   {showLeaderboard && (
                       <div className="leaderboard-modal">
                           <div className="leaderboard-content">
                               <div className="leaderboard-header">
                                   <h3>Leaderboard</h3>
                                   <button
                                       onClick={() => setShowLeaderboard(false)}
                                       className="close-button"
                                   >
                                       ×
                                   </button>
                               </div>
                               <table>
                                   <thead>
                                       <tr>
                                           <th>Rank</th>
                                           <th>User</th>
                                           <th>Stage</th>
                                           <th>Score</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {leaderboard.map((user, index) => (
                                           <tr key={user.userName + index}>
                                               <td>{index + 1}</td>
                                               <td>{user.userName}</td>
                                               <td>{user.stage}</td>
                                               <td>{user.score}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                       </div>
                   )}
                   {quizFinished ? (
                       <div className="results-screen">
                           <h2>Stage {completedStage} Results</h2>
                           <div className="final-score">
                               Score: {score} / {currentRequirements.requiredScore}
                           </div>
                           {passed ? (
                               <button
                                   onClick={() => startNewStage(nextStage)}
                                   className="next-button"
                               >
                                   Start Stage {nextStage}
                               </button>
                           ) : (
                               <>
                                   <p className="retake-message">
                                       Required score for Stage {completedStage + 1}: {currentRequirements.requiredScore}
                                   </p>
                                   <button
                                       onClick={() => startNewStage(completedStage)}
                                       className="retake-button"
                                   >
                                       Retry Stage {completedStage}
                                   </button>
                               </>
                           )}
                           {questionHistory.length > 0 && (
                            <button
                                onClick={() => setShowReport(true)}
                                className="performance-report-button"
                            >
                                Performance Report
                            </button>
                            )}
                       </div>

                   ) : !quizStarted ? (
                       <div className="start-screen">
                           <h1>Waste Management Challenge</h1>
                           <button
                               onClick={() => startNewStage(currentStage)}
                               className="start-button"
                           >
                               Start Stage {currentStage}
                           </button>
                       </div>
                   ) : (
                       <>
                           <h1>Stage {currentStage} - Time Left: {time}s</h1>
                           <div className="quiz-status">
                               <span>Difficulty: {currentLevel}</span>
                               <span>Score: {score}</span>
                               <button
                                   onClick={() => setShowExitConfirmation(true)}
                                   className="exit-button"
                               >
                                   Exit Quiz
                               </button>
                           </div>



                           {showExitConfirmation && (
                               <div className="confirmation-modal">
                                   <div className="confirmation-content">
                                       <h3>Are you sure you want to exit?</h3>
                                       <div className="confirmation-buttons">
                                           <button
                                               className="confirm-button"
                                               onClick={() => {
                                                   setQuizStarted(false);
                                                   setQuizFinished(false);
                                                   navigate('/');
                                               }}
                                           >
                                               Yes
                                           </button>
                                           <button
                                               className="cancel-button"
                                               onClick={() => setShowExitConfirmation(false)}
                                           >
                                               No
                                           </button>
                                       </div>
                                   </div>
                               </div>
                           )}


                           {currentQuestion ? (
                               <div className="question-block">
                                   <div className="question-meta">
                                       <span className="subject-tag">{currentQuestion.subject}</span>
                                       <span className="level-info">Difficulty: {currentQuestion.level}</span>
                                   </div>
                                   <h2>{currentQuestion.question}</h2>
                                   <div className="options">
                                       {currentQuestion.options.map((option, index) => (
                                           <button
                                               key={index}
                                               onClick={() => handleAnswer(String.fromCharCode(65 + index))}
                                               disabled={!!feedback}
                                               className={`option-btn ${
                                                   selectedAnswer === String.fromCharCode(65 + index)
                                                       ? 'selected'
                                                       : ''
                                               }`}
                                           >
                                               {String.fromCharCode(65 + index)}. {option}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           ) : (
                               <div className="loading-container">Loading Question...</div>
                           )}

                           {feedback && (
                               <div className={`feedback ${feedback.toLowerCase()}`}>
                                   <h3 style={{ color: feedback === 'Correct!' ? '#28a745' : '#dc3545' }}>
                                       {feedback}
                                   </h3>

                                   {feedback === 'Incorrect!' && (
                                       <div className="correct-answer">
                                           <strong>Correct Answer:</strong> {String.fromCharCode(65 + currentQuestion.correct_answer.charCodeAt(0) - 65)}. {currentQuestion.options[currentQuestion.correct_answer.charCodeAt(0) - 65]}
                                       </div>
                                   )}

                                   <div className="feedback-buttons">
                                       {!explanationLoading && !aiExplanation && (
                                           <button onClick={handleGetExplanation} className="ai-tutor-button">
                                               <RiRobot2Fill className="w-6 h-6 mr-2" />
                                               <span className="text-xl font-playfair-display">Ask My AI Tutor</span>
                                           </button>
                                       )}

                                       <button onClick={handleNextQuestion} className="next-button">
                                           Next Question
                                       </button>
                                   </div>

                                   {explanationLoading && <div className="explanation-loading">Generating explanation...</div>}

                                   {aiExplanation && (
                                       <div className="ai-explanation">
                                           <h4>AI Explanation:</h4>
                                           <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                                           {/*<p>{aiExplanation}</p>*/}
                                       </div>
                                   )}
                               </div>
                           )}
                       </>
                   )}
               </div>

               {showEmotionWarning && (
                    <div className="emotion-warning-modal">
                        <div className="emotion-warning-content">
                        <h3>Feeling overwhelmed?</h3>
                        <p>
                            We noticed you might be feeling some challenging emotions during the quiz. 
                            It's perfectly normal to feel this way sometimes! Taking a short break 
                            can help you refocus and come back stronger.
                        </p>
                        <p>Would you like to exit the quiz now and take a breather?</p>
                        <div className="emotion-warning-buttons">
                            <button 
                            className="warning-confirm-button"
                            onClick={() => {
                                setQuizStarted(false);
                                setQuizFinished(false);
                                setShowEmotionWarning(false);
                                navigate('/');
                            }}
                            >
                            Yes, exit quiz
                            </button>
                            <button 
                            className="warning-cancel-button"
                            onClick={() => setShowEmotionWarning(false)}
                            >
                            No, I'm okay
                            </button>
                        </div>
                        </div>
                    </div>
                    )}

               {showReport && (
                    <div className="performance-report" id="report-to-export">
                        <div className="report-heading">
                            <h2>Performance Summary</h2><hr /><br />
                        </div>
                        {questionHistory.map((entry, index) => (
                        <div key={index} className="report-entry">
                            <p><strong>Q{index + 1} Subject:</strong> {entry.subject}</p>
                            <p><strong>Question:</strong> {entry.question}</p>
                            <p>
                            <strong>Answer:</strong>{' '}
                            {entry.isCorrect ? (
                                <span style={{ color: 'green' }}>Correct</span>
                            ) : (
                                <span style={{ color: 'red' }}>Incorrect</span>
                            )}
                            </p>
                            <p><strong>Detected Emotions:</strong> {entry.detectedEmotions.join(', ') || 'None'}</p>
                            <hr />
                        </div>
                        ))}
                        <button onClick={generatePDF} className="print-button">Export as PDF</button>
                    </div>
                    )}
               <InstructionsQuiz isOpen={isModalOpen} onClose={handleModalClose} />
           </MainLayout>
       );
   };

   export default QuizPage

