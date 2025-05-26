import React from 'react';
import { FaLeaf, FaGraduationCap, FaUsers, FaHandsHelping } from 'react-icons/fa';
import MainLayout from '../../components/MainLayout';

const AboutUsPage = () => {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold text-green-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Green Insight Academy
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Empowering the next generation of environmental stewards through education and action.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto mb-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <FaLeaf className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-4 text-3xl font-bold text-green-800">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              At Green Insight Academy, we're committed to fostering environmental awareness and 
              sustainable practices through innovative education programs that inspire individuals 
              and communities to protect our planet.
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">What We Do</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
              <FaGraduationCap className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold text-green-800">Education Programs</h3>
              <p className="mt-2 text-gray-600">
                Comprehensive courses on sustainability, conservation, and eco-friendly technologies.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
              <FaUsers className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold text-green-800">Community Engagement</h3>
              <p className="mt-2 text-gray-600">
                Workshops and events that bring people together to implement green solutions.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
              <FaHandsHelping className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold text-green-800">Partnerships</h3>
              <p className="mt-2 text-gray-600">
                Collaborating with organizations to amplify our environmental impact.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
              <FaLeaf className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold text-green-800">Research</h3>
              <p className="mt-2 text-gray-600">
                Conducting studies to develop innovative solutions for environmental challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              Founded in 2020, Green Insight Academy began as a small initiative by a group of 
              environmental educators passionate about making sustainability education accessible 
              to everyone. What started as weekend workshops has grown into a comprehensive 
              academy offering online and in-person programs across multiple countries.
            </p>
            <p className="mt-4">
              Today, we've educated over 10,000 students and partnered with 50+ organizations 
              to implement real environmental change. Our alumni are making waves in various 
              industries, bringing their green insight to businesses, governments, and communities.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUsPage;