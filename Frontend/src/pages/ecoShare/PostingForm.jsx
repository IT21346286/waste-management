import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const PostingForm = () => {
  const [donationName, setDonationName] = useState("");
  const [donationCategory, setDonationCategory] = useState(""); // New state for Donation Category
  const [donationCondition, setDonationCondition] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const storedData = localStorage.getItem("account");
    if (!storedData) {
      console.error("No user data found in localStorage, please log in");
      return;
    }
  
    const userData = JSON.parse(storedData);
    const token = userData?.token;
    console.log("Token:", token); // Log the token to verify its value
  
    if (!token) {
      console.error("No token found, please log in");
      return; // Stop execution if no token is found
    }
  
    const formData = new FormData();
    formData.append("donationName", donationName);
    formData.append("donationCategory", donationCategory);
    formData.append("donationCondition", donationCondition);
    formData.append("description", description);
    formData.append("image", image);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/donations/add-donation`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("Donation added successfully:", response.data);

      // Display success message 
      toast.success("Donation posted successfully");

      // Navigate to Green Mart page after successful submission 
      navigate("/all-donations");

    } catch (error) {
      console.error("Error adding donation:", error.response ? error.response.data : error.message);
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          Post a Donation
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Donation Name</label>
            <input
              type="text"
              value={donationName}
              onChange={(e) => setDonationName(e.target.value)}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              placeholder="Enter the donating item's name"
              required
            />
          </div>

          {/* New Donation Category field */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Donation Category</label>
            <select
              value={donationCategory}
              onChange={(e) => setDonationCategory(e.target.value)}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Stationery and School Supplies">Stationery and School Supplies</option>
              <option value=" Books and Educational Materials"> Books and Educational Materials</option>
              <option value="Clothing and Footwear">Clothing and Footwear</option>
              <option value="Technology and Electronics">Technology and Electronics</option>
              <option value="Art and Creative Supplies">Art and Creative Supplies</option>
              <option value="Sports Supplies">Sports Supplies</option>
              <option value="Other Categories">Other Categories</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Condition</label>
            <input
              type="text"
              value={donationCondition}
              onChange={(e) => setDonationCondition(e.target.value)}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              placeholder="Enter the condition of the items"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              placeholder="Describe the item in detail"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              required
            />
          </div>
          
          <div className="flex justify-between mt-6 mb-6">
              <button 
                type="submit"
                className="py-2 px-8 text-white text-base font-bold rounded-md overflow-hidden bg-[#84cc16] transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-md hover:before:left-0"
              >
                Submit
              </button>
              
              <button 
                className="py-2 px-8 text-white text-base font-bold rounded-md overflow-hidden bg-[#3b82f6] transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-md hover:before:left-0" 
                onClick={() => navigate('/all-donations')}
              >
                Back
              </button>
          </div>



        </form>
      </div>
    </div>
  );
};

export default PostingForm;
