import axios from 'axios';


// Get my items
export const getMyItems = async (token, currentPage = 1, itemsPerPage = 12) => { 
  try { 
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`, 
      }, 
    }; 
    const { data } = await axios.get(`/api/items/my-items?page=${currentPage}&limit=${itemsPerPage}`, config); 
    console.log(data); // Log the data to ensure it is being fetched correctly 
    return data; 
  } catch (error) { 
        throw new Error(error.response?.data?.message || error.message); 
    } 
};


// Get all items (frontend service)
export const getAllItems = async (token, currentPage, itemsPerPage) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch all items from backend
    const { data } = await axios.get(`/api/items/all-items?page=${currentPage}&limit=${itemsPerPage}`, config);
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Edit page's get item by id code

export const getItemById = async (token, itemId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`/api/items/${itemId}`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};



// Update an item
export const updateItem = async (token, itemId, updatedData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(`/api/items/${itemId}`, updatedData, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};


// Delete an item
export const deleteItem = async (token, itemId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(`/api/items/${itemId}`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
