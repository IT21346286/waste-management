import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiPriceTag } from "react-icons/gi";
import { TiThList } from "react-icons/ti";
import { FaCartShopping } from "react-icons/fa6";
import { BiEnvelope } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllItems } from "../../services/index/items"; 
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";

let isFirstRun = true;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);   
};

const GreenMartPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllItems(searchKeyword, currentPage, 12),
    queryKey: ["items", searchKeyword, currentPage],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

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

  const handleContactSeller = () => {
    window.location.href = "mailto:";
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center p-5">
      <h1 className="text-3xl font-bold text-gray-700 text-center mx-8 flex items-center">
        <FaCartShopping className="w-6 h-6 mr-2" /> Green Mart
      </h1>
          {/* Group buttons together */}
          <div className="flex space-x-4">
            <button
              className="bg-gradient-to-b from-[#f87171] to-[#fc0303] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
              onClick={() => navigate("/post-item")}
            >
              <GiPriceTag className="w-6 h-6 mr-2" /><span className="text-xl font-playfair-display"> Sell Items! </span> 
            </button>
            
            <button
              className="bg-gradient-to-b from-[#a3d8ff] to-[#60a5fa] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
              onClick={() => navigate("/my-items")}
            >
              <TiThList className="w-6 h-6 mr-2" /><span className="text-xl font-playfair-display"> My Items </span> 
            </button>
            {/* New Contact Seller Button */}
            <button
              className="bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] text-white font-bold px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg flex items-center justify-center active:translate-y-1"
              onClick={handleContactSeller}
            >
              <BiEnvelope className="w-6 h-6 mr-2" /><span className="text-xl font-playfair-display"> Contact Seller </span> 
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
            <ErrorMessage message="Couldn't fetch the items data" />
          ) : !data || data.length === 0 ? ( // Corrected condition to check both undefined and empty array
            <p className="text-orange-500">No Items Found!</p>
          ) : (
            data.map((item) => ( // Ensured the correct mapping
              <div key={item._id} className="item-card border p-4 shadow-lg">
                <img
                  src={`/${item.image.replace("\\", "/")}`} // Convert backslash to forward slash for web path
                  alt={item.itemName}
                  className="w-full h-64 object-cover mb-4"
                />
                <h2 className="text-xl font-bold">{item.itemName}</h2>
                <hr className="my-4 border-t-2 border-gray-300" />
                <p className="text-blue-500 font-bold">Price: Rs. {item.itemPrice}</p>
                <p className="text-gray-700 font-semibold">Category: {item.itemCategory}</p>
                <br />
                <p className="text-gray-700">{item.description}</p>
                <br />
                <p className="text-gray-500 text-sm">Posted on: {formatDate(item.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default GreenMartPage;
