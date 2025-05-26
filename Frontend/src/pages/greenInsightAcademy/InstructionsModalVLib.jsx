import React from 'react';

const InstructionsModalVLib = ({ isOpen, onClose }) => {
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
          Welcome to Green Insight Academy's Learning Library!
        </h2>
        <hr className="border-t-2 border-white opacity-50 mb-4"/><br />
        {/* Intro Paragraph */}
        <p className="text-md font-semibold text-center text-blue-900 mb-6">
          Explore a world of knowledge with videos about waste management that empower you to make a real difference.
        </p>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">Our Mission:</h3>
          <p className="text-gray-700">
            To provide knowledge that inspires everyone to build a cleaner, healthier planet.
          </p>
        </div>

        {/* Explore Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">
            Explore our videos on:
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Waste Basics: What is waste and why it matters.</li>
            <li>Reduce, Reuse, Recycle: Tips to cut down waste.</li>
            <li>Composting: Turn food scraps into garden gold.</li>
            <li>Hazardous Waste: How to handle dangerous waste safely.</li>
            <li>Upcycling Projects: Turn waste into useful products with creative ideas.</li>
            <li>Innovative Tech: Cool new ways to manage waste.</li>
          </ul>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <p className="text-gray-700 mb-4 font-medium">
            By watching these videos, you can:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Reduce your environmental footprint.</li>
            <li>Help make your community cleaner.</li>
            <li>Make smart choices about waste.</li>
            <li>Inspire others to be eco-friendly.</li>
          </ul>
        </div>

        {/* Final Message */}
        <p className="text-md font-bold text-center text-blue-900 mb-6">
          Let’s build a better future together!
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

export default InstructionsModalVLib;
