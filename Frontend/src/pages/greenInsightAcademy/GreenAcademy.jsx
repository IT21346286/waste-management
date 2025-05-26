import React from "react";
import MainLayout from "../../components/MainLayout";
import { images } from "../../constants";
import { useNavigate } from "react-router-dom";

const GreenAcademy = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <section className="relative container mx-auto flex flex-col px-10 py-5 lg:flex-row">
        <div className="mt-10 lg:w-1/2 lg:mr-32">
          <h1 className="text-6xl font-bold text-[#020D4D] text-center lg:text-left lg:text-7xl">
            Green Insight Academy
          </h1><br />
         
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col items-center text-center">
              <button 
                className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-3 px-4 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl flex items-center justify-center"
                onClick={() => navigate("/all-items")}
              >
                Green Mart
              </button>
              <p className="mt-2 text-gray-700">Explore and support eco-friendly products made by your peers.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <button 
                className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold py-3 px-4 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl flex items-center justify-center"
                onClick={() => navigate("/quiz")}
              >
                Waste Whiz
              </button>
              <p className="mt-2 text-gray-700">Test your environmental knowledge and unlock sustainable insights.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <button 
                className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-3 px-4 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl flex items-center justify-center"
                onClick={() => navigate("/all-donations")}
              >
                Eco Share
              </button>
              <p className="mt-2 text-gray-700">Share, reuse, and reduce your impact on the planet.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <button 
                className="bg-gradient-to-r from-red-400 to-yellow-500 text-white font-bold py-3 px-4 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl flex items-center justify-center"
                onClick={() => navigate("/visual-learning-library")}
              >
                Visual Learning Library
              </button>
              <p className="mt-2 text-gray-700">Dive into a world of inspiring stories and practical tips for a greener lifestyle.</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 lg:ml-32">
          <img
            className="w-full h-full object-cover"
            src={images.greenPoster}
            alt="users are reading articles"
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default GreenAcademy;
