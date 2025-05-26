import React from 'react';

const InstructionsQuiz = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Scrollable container */}
      <div className="bg-gradient-to-br from-[#bef264] via-[#93c5fd] to-[#cbd5e1] rounded-3xl shadow-2xl p-10 w-full max-w-4xl relative animate-fadeIn mx-4 my-10 overflow-y-auto max-h-[90vh] border-2 border-[#bef264]">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-blue-800 hover:text-red-500 font-bold text-3xl transition-transform transform hover:scale-125"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">
          Welcome to Green Insight Academy's Waste Whiz Quiz!
        </h2>
        <hr className="border-t-2 border-white opacity-50 mb-4"/><br />
        {/* Intro Paragraph */}
        <p className="text-md font-semibold text-center text-blue-900 mb-6">
          Test your knowledge and learn about waste management through subject-based quizzes.
        </p>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">Our Mission:</h3>
          <p className="text-gray-700">
          To educate and empower students to learn about waste management while enhancing their academic knowledge through an adaptive learning experience.
          </p>
        </div>

        {/* Explore Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">
            Quiz Instructions:
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Students can go any number of stages in this quiz.</li>
            <li>These quizzes are based on your school subjects and focus on waste management.</li>
            <li>Learn about waste management while improving your academic knowledge.</li>
            <li>This is an adaptive learning quiz platform that adjusts the quiz level based on student performance.</li>
            <li>There are 4 levels of questions: Level 1 (easy), Level 2 (medium), Level 3 (hard), and Level 4 (super hard).</li>
            <li>Correct answers to higher-level questions will earn higher marks.</li>
            <li>Every stage has a minimum score requirement to advance to the next level.</li>
            <li>Use the special feature "MyAiTutor" for explanations when you answer incorrectly.</li>
            <li className="font-semibold">Emotion Detection (Optional):
              <ul className="list-disc list-inside ml-5">
                <li>You can grant webcam access for optional, real-time emotion detection.</li>
                <li>A webcam is required for this feature.</li>
                <li>No images are saved. We only store detected emotions.</li>
                <li>If you allow camera permission, remember to face the camera continuously for a better experience.</li>
                <li>For the most accurate "emotion analysis", ensure good lighting, a clear view of your face, and a plain background.</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <p className="text-gray-700 mb-4 font-medium">
            By participating in these quizzes, you can:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Enhance your understanding of waste management.</li>
            <li>Improve your academic knowledge across various subjects.</li>
            <li>Experience adaptive learning tailored to your performance.</li>
            <li>Utilize AI-powered explanations for better learning.</li>
          </ul>
        </div>

        {/* Final Message */}
        <p className="text-md font-bold text-center text-blue-900 mb-6">
          Start learning and making a difference today!
        </p>
      </div>

      <style>
        {`
          /* Keyframe Animations */
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }

          /* Decorative Shadows */
          .shadow-2xl {
            box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
    </div>
  );
};

export default InstructionsQuiz;