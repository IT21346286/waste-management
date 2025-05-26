import React, { useState } from 'react';
import { TbListSearch, TbHandClick } from "react-icons/tb";
import MainLayout from '../../components/MainLayout'; // MainLayout component
import InstructionsModalVLib from './InstructionsModalVLib'; // Import the modal component


const videoData = [
  {
    id: '_NkqwMitQ8o',
    title: '1. Introduction to Waste Management',
    description: 'Understanding what waste is and its impact on the environment.'
  },
  {
    id: 'AlwgMnT3KNc',
    title: '2. Types of Waste',
    description: 'Differentiating between organic, recyclable, hazardous, and electronic waste.'
  },
  {
    id: '21nj7WbndBs',
    title: '3. The Waste Hierarchy',
    description: 'Exploring the principles of Reduce, Reuse, Recycle, and Recovery.'
  },
  {
    id: '5sOj1M92UC4',
    title: '4. Waste Audit',
    description: 'Conducting a waste audit to assess the amount and types of waste generated.'
  },
  {
    id: '52pjTKl8E6M',
    title: '5. Waste Reduction Strategies',
    description: 'Implementing practical ways to reduce waste production.'
  },
  {
    id: '5oLGcKPTJWk',
    title: '6. Reusing Everyday Items',
    description: 'Finding creative ways to reuse items instead of discarding them.'
  },
  {
    id: 'Txp2bwjkCE4',
    title: '7. Recycling Basics',
    description: 'Learning what can be recycled and the recycling process.'
  },
  {
    id: 'mDIVpJgjoXQ',
    title: '8. Composting Organic Waste At Home',
    description: 'Understanding the process of composting and its benefits.'
  },
  {
    id: 'epEIjY7_76M',
    title: '9. Handling Hazardous Waste',
    description: 'Identifying hazardous waste and learning proper disposal methods.'
  },
  {
    id: 'kMONRrLd-NU',
    title: '10. Impact of Waste on Health and Environment',
    description: 'Examining how waste affects human health and the environment.'
  },
  {
    id: 'Xs_HbZO8lOQ',
    title: '11. Upcycling Projects',
    description: 'Learn how to transform waste materials into new, useful products through creative projects.'
  },
  {
    id: 'lhMooyLGWkc',
    title: '12. Circular Economy',
    description: 'Understand the principles of a circular economy and how it promotes sustainable waste management by keeping resources in use for as long as possible.'
  },
  {
    id: 'y--oFdGK7Bs',
    title: '13. Developing a Waste Management Plan',
    description: 'Formulating a plan for waste management in schools or communities.'
  },
  {
    id: 'TutyOvzQ0xA',
    title: '14. Waste Management Policies and Legislation',
    description: 'Understanding relevant policies, regulations, and legislation.'
  },
  {
    id: 'On5WUCUNmfc',
    title: '15. Innovative Technologies in Waste Management',
    description: 'Exploring new technologies and solutions for effective waste management.'
  }
];

const VisualLearningLib = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVideos = videoData.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchClick = () => {
    // Optionally, you can add any actions you want to trigger when the icon is clicked.
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="relative mb-8">
          <h1 className="text-4xl font-bold text-center">Visual Learning Library</h1>
          <button 
            className="absolute top-1/2 right-10 transform -translate-y-1/2 bg-gradient-to-b from-[#a3d8ff] to-[#60a5fa] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
            onClick={handleModalOpen}
          >
            <TbHandClick className="w-6 h-6 mr-2" /><span className="text-xl font-playfair-display">Instructions</span>
          </button>
        </div>
        <h5 className="text-xl text-center text-gray-700 mb-8">Welcome to the Green Insight Academy's Visual Learning Library. This platform is designed to provide you with engaging and informative video resources to enhance your understanding of waste management.</h5>
        <div className="mb-8 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search videos..."
            className="w-full p-4 pr-12 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition duration-300 ease-in-out" 
          />
          <button 
            onClick={handleSearchClick} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <TbListSearch className="w-6 h-6"/>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <div key={video.id} className="video-card p-4 border rounded-lg shadow-lg">
              <iframe
                id="video"
                height="315"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?feature=shared`}
                frameBorder="0"
                allowFullScreen
                className="w-full mb-4"
                title={video.title}
              ></iframe>
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-gray-700">{video.description}</p>
            </div>
          ))}
        </div>
      </section>
      <InstructionsModalVLib isOpen={isModalOpen} onClose={handleModalClose} />
    </MainLayout>
  );
};

export default VisualLearningLib;
