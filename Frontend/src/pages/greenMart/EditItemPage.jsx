import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, updateItem } from "../../services/index/items";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const EditItemPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItemById(userState.userInfo.token, itemId),
  });

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();

  useEffect(() => {
    if (item) {
      setValue("itemName", item.itemName);
      setValue("description", item.description);
      setValue("itemCategory", item.itemCategory);
      setValue("itemPrice", item.itemPrice);
      setValue("image", item.image);
    }
  }, [item, setValue]);

  const { mutate, isLoading: updateLoading } = useMutation({
    mutationFn: (updatedData) => updateItem(userState.userInfo.token, itemId, updatedData),
    onSuccess: () => {
      toast.success("Item updated successfully");
      queryClient.invalidateQueries(["myItems"]);
      navigate("/my-items");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitHandler = (data) => {
    const formData = new FormData();
    formData.append("itemName", data.itemName);
    formData.append("description", data.description);
    formData.append("itemCategory", data.itemCategory);
    formData.append("itemPrice", data.itemPrice);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    console.log([...formData.entries()]); // Log FormData contents
    mutate(formData);
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const itemCategory = watch("itemCategory");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-700 mt-6 mb-6 text-center">Edit Item</h1>
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Item Name</label>
            <input
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              type="text"
              {...register("itemName", { required: "Item name is required" })}
            />
            {errors.itemName && <p>{errors.itemName.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Category</label>
            <select
              value={itemCategory}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              {...register("itemCategory", { required: "Category is required" })}
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
            {errors.itemCategory && <p>{errors.itemCategory.message}</p>}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Price</label>
            <input
              type="number"
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              {...register("itemPrice", { required: "Price is required" })}
            />
            {errors.itemPrice && <p>{errors.itemPrice.message}</p>}
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
                onClick={() => navigate('/my-items')}>Back</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;
