import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import MainLayout from '../../components/MainLayout';

const ContactUsPage = () => {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold text-green-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Contact Green Insight Academy
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            We'd love to hear from you! Reach out with questions, partnership inquiries, or just to say hello.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Get In Touch</h2>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex">
                <FaMapMarkerAlt className="flex-shrink-0 h-6 w-6 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="mt-1 text-gray-600">
                    123 Green Way, Eco District<br />
                    Sustainability City, Sri Lanka, 10101
                  </p>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex">
                <FaPhone className="flex-shrink-0 h-6 w-6 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex">
                <FaEnvelope className="flex-shrink-0 h-6 w-6 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">it21346286@my.sliit.lk</p>
                </div>
              </div>
              
              {/* Hours */}
              <div className="flex">
                <FaClock className="flex-shrink-0 h-6 w-6 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Office Hours</h3>
                  <p className="mt-1 text-gray-600">
                    Monday-Friday: 9am-5pm<br />
                    Saturday: 10am-2pm<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Send Us a Message</h2>
             <a 
                    href="mailto:it21346286@my.sliit.lk?subject=Contact%20Form%20Submission"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                    Send Email Directly
                </a>
            {/*<form className="space-y-6">
               <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div> 
              
              <div>
               
                {/* <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Send Message
                </button> 
              </div>
            </form>*/}
          </div>
        </div>

        
        {/* Map Section */}
        <div className="max-w-7xl mx-auto mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-96 w-full">
            <iframe
              title="Google Maps Location"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?q=123%20Green%20Way,%20Eco%20District&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUsPage;