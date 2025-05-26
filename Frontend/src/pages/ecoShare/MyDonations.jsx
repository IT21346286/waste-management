import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHandsHelping } from "react-icons/fa";
import { BiSolidDonateHeart } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { TiThList } from "react-icons/ti";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getMyDonations, deleteDonation } from "../../services/index/donations"; 
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";

let isFirstRun = true;

// Define the formatDate function here
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);  
};

const MyDonations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";
  const storedData = localStorage.getItem('account'); 
  const userData = JSON.parse(storedData); 
  const token = userData?.token; // Ensure token is retrieved correctly

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getMyDonations(token, currentPage, 12),
    queryKey: ["myDonations", searchKeyword, currentPage], // Unique queryKey for user-specific items
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    console.log(data); // Add this line to log the data
  }, [data]);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, searchKeyword, refetch]);

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  // Handle delete donation
  const handleDelete = async (donationId) => {
    try {
      console.log("Deleting donated item with ID:", donationId); // Log donation ID
      console.log("Token:", token); // Log token to ensure it's correct
      await deleteDonation(token, donationId); // Pass token and donationId as separate arguments
      toast.success("Donated Item deleted successfully");
      refetch(); // Refetch donated items to update the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle edit item
  const handleEdit = (donation) => {
    navigate(`/edit-donation/${donation._id}`);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center p-5">
          <h1 className="text-3xl font-bold text-gray-700 text-center mx-8 flex items-center">
             <TiThList className="w-6 h-6 mr-2" />My Donations List
          </h1>
          {/* Group buttons together */}
          <div className="flex space-x-4">
            <button
              className="bg-gradient-to-b from-[#f87171] to-[#fc0303] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
              onClick={() => navigate("/post-donation")}
            >
              <FaHandsHelping className="w-6 h-6 mr-2" /><span class="text-xl font-playfair-display"> Post Donations! </span> 
            </button>
            <button
              className="bg-gradient-to-b from-[#a3e635] to-[#65a30d] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
              onClick={() => navigate("/all-donations")}
            >
              <BiSolidDonateHeart className="w-6 h-6 mr-2" /><span class="text-xl font-playfair-display"> Eco Share </span> 
            </button>
          </div>
          
          {/* Align search bar to the right */}
          <div className="flex-1 ml-4">
            <Search className="w-full max-w-lg ml-auto" onSearchKeyword={handleSearch} />
          </div>
      </div>
      <hr className="my-4 border-t-2 border-gray-300" />


      <section className="container mx-auto px-5 py-10 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {isLoading || isFetching ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-card">Loading...</div>
            ))
          ) : isError ? (
            <ErrorMessage message="Couldn't fetch the donations data" />
          ) : !data || data.length === 0 ? ( // Corrected condition
            <p className="text-orange-500">No Donations Found!</p>
          ) : (
            data.map((donation) => ( // Ensured the correct mapping
              <div key={donation._id} className="item-card border p-4 shadow-lg">
                <button onClick={() => handleEdit(donation)}><FaEdit className="w-6 h-6 mr-2" /></button>
                <button onClick={() => handleDelete(donation._id)}><RiDeleteBin5Fill className="w-6 h-6 mr-2"/></button>
                <img
                  src={`/${donation.image.replace("\\", "/")}`} // Convert backslash to forward slash for web path
                  alt={donation.donationName}
                  className="w-full h-64 object-cover mb-4"
                />
                <h2 className="text-xl font-bold">{donation.donationName}</h2>
                <hr className="my-4 border-t-2 border-gray-300" />
                <p className="text-blue-500 font-bold">Condition:  {donation.donationCondition}</p>
                <p className="text-gray-700 font-semibold">Category: {donation.donationCategory}</p>
                <br />
                <p className="text-gray-700">{donation.description}</p>
                <br />
                <p className="text-gray-500 text-sm">Posted on: {formatDate(donation.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default MyDonations;
