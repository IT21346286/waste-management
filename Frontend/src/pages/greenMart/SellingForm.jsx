import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const SellingForm = () => {
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState(""); // New state for Item Category
  const [itemPrice, setItemPrice] = useState("");
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
    formData.append("itemName", itemName);
    formData.append("itemCategory", itemCategory);
    formData.append("itemPrice", itemPrice);
    formData.append("description", description);
    formData.append("image", image);
  
    try {
      const response = await axios.post("http://localhost:3002/api/items/add-item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("Item added successfully:", response.data);

      // Display success message 
      toast.success("Item posted successfully");

      // Navigate to Green Mart page after successful submission 
      navigate("/all-items");

    } catch (error) {
      console.error("Error adding item:", error.response ? error.response.data : error.message);
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          Post an Item for Sale
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              placeholder="Enter the item name"
              required
            />
          </div>

          {/* New Item Category field */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Item Category</label>
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Fashion and Accessories">Fashion and Accessories</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Art and Crafts">Art and Crafts</option>
              <option value="Electronics and Gadgets">Electronics and Gadgets</option>
              <option value="Other Categories">Other Categories</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Item Price</label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              placeholder="Enter the price in LKR"
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
                onClick={() => navigate('/all-items')}
              >
                Back
              </button>
          </div>



        </form>
      </div>
    </div>
  );
};

export default SellingForm;
