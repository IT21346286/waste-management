import axios from 'axios';


// Get my donations
export const getMyDonations = async (token, currentPage = 1, itemsPerPage = 12) => { 
  try { 
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`, 
      }, 
    }; 
    const { data } = await axios.get(`/api/donations/my-donations?page=${currentPage}&limit=${itemsPerPage}`, config); 
    console.log(data); // Log the data to ensure it is being fetched correctly 
    return data; 
  } catch (error) { 
        throw new Error(error.response?.data?.message || error.message); 
    } 
};


// Get all donations (frontend service)
export const getAllDonations = async (token, currentPage, itemsPerPage) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch all donations from backend
    const { data } = await axios.get(`/api/donations/all-donations?page=${currentPage}&limit=${itemsPerPage}`, config);
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Edit page's get donation by id code

export const getDonationById = async (token, donationId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`/api/donations/${donationId}`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};



// Update an donation
export const updateDonation = async (token, donationId, updatedData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(`/api/donations/${donationId}`, updatedData, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};


// Delete an donation
export const deleteDonation = async (token, donationId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(`/api/donations/${donationId}`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
