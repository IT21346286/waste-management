import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getDonationById, updateDonation } from "../../services/index/donations";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const EditDonationPage = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: donation, isLoading } = useQuery({
    queryKey: ["donation", donationId],
    queryFn: () => getDonationById(userState.userInfo.token, donationId),
  });

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();

  useEffect(() => {
    if (donation) {
      setValue("donationName", donation.donationName);
      setValue("description", donation.description);
      setValue("donationCategory", donation.donationCategory);
      setValue("donationCondition", donation.donationCondition);
      setValue("image", donation.image);
    }
  }, [donation, setValue]);

  const { mutate, isLoading: updateLoading } = useMutation({
    mutationFn: (updatedData) => updateDonation(userState.userInfo.token, donationId, updatedData),
    onSuccess: () => {
      toast.success("Donation Details updated successfully");
      queryClient.invalidateQueries(["myDonations"]);
      navigate("/my-donations");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitHandler = (data) => {
    const formData = new FormData();
    formData.append("donationName", data.donationName);
    formData.append("description", data.description);
    formData.append("donationCategory", data.donationCategory);
    formData.append("donationCondition", data.donationCondition);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    console.log([...formData.entries()]); // Log FormData contents
    mutate(formData);
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const donationCategory = watch("donationCategory");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-700 mt-6 mb-6 text-center">Edit Donations</h1>
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Donation Name</label>
            <input
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              type="text"
              {...register("donationName", { required: "Donated Item's name is required" })}
            />
            {errors.donationName && <p>{errors.donationName.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Category</label>
            <select
              value={donationCategory}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              {...register("donationCategory", { required: "Category is required" })}
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Stationery and School Supplies">Stationery and School Supplies</option>
              <option value="Books and Educational Materials">Books and Educational Materials</option>
              <option value="Clothing and Footwear">Clothing and Footwear</option>
              <option value="Technology and Electronics">Technology and Electronics</option>
              <option value="Art and Creative Supplies">Art and Creative Supplies</option>
              <option value="Sports Supplies">Sports Supplies</option>
              <option value="Other Categories">Other Categories</option>
            </select>
            {errors.donationCategory && <p>{errors.donationCategory.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Item's Condition</label>
            <input
              type="text"
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              {...register("donationCondition", { required: "Item's condition is required" })}
            />
            {errors.donationCondition && <p>{errors.donationCondition.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Description</label>
            <textarea
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p>{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            />
          </div>
          <div className="flex justify-between mt-6 mb-6">
          <button className="py-2 px-8 text-white text-base font-bold rounded-md overflow-hidden bg-[#84cc16] transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-md hover:before:left-0"
            type="submit" disabled={updateLoading}>Update</button>
          <button className="py-2 px-8 text-white text-base font-bold rounded-md overflow-hidden bg-[#3b82f6] transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-md hover:before:left-0" 
                onClick={() => navigate('/my-donations')}>Back</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditDonationPage;
