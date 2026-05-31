import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa'

function AddItem() {
  const { handleSubmit, register } = useForm()
  const navigate = useNavigate()
  const onceDone = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("category", data.category);
      formData.append("rating", data.rating || "5");
      // Thumbnail / Cover Image
      formData.append("coverImage", data.coverImage[0]);
      // Additional Images
      if (data.images) {
        for (const image of data.images) {
          formData.append(
            "images",
            image
          );
        }
      }
      // Videos
      if (data.videos?.[0]) {

        formData.append(
          "videos",
          data.videos[0]
        );

      }
      // axios call to backend
      const res = await axios.post(
        "https://individual-final-project-mern-stack.onrender.com/user-api/additem",
        formData,
        {
          withCredentials: true
        }
      );
      alert("Product listed successfully!")
      navigate('/userhome')
    }
    catch (err) {
      console.log(err)
      alert(err.response?.data?.message || "Failed to add item. Please try again.")
    }
  }

  return (
    <div className='min-h-[85vh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex items-center justify-center p-4 md:p-8 transition-colors duration-300'>
      <div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm'>

        {/* Go back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mx-auto mb-4 animate-float">
          📦
        </div>

        <h2 className='text-2xl font-bold text-center text-slate-900 dark:text-slate-50 mb-2'>
          List a New Product
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center mb-8">
          Fill in the details below to publish your item to the campus community.
        </p>

        <form
          onSubmit={handleSubmit(onceDone)}
          encType="multipart/form-data"
          className='flex flex-col gap-5'
        >
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Product Title</label>
            <input
              type="text"
              placeholder='e.g., Introduction to Algorithms textbook'
              {...register('title')}
              className='w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
            <select
              {...register('category')}
              className='w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
              required
            >
              <option value="" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Select Category</option>
              <option value="BOOKS" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Books</option>
              <option value="ELECTRONICS" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Electronics</option>
              <option value="FASHION" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Fashion</option>
              <option value="FURNITURE" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Furniture</option>
              <option value="SPORTS" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Sports</option>
              <option value="STATIONERY" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Stationery</option>
              <option value="OTHERS" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              placeholder='Describe the condition, features, or details of your item...'
              {...register('description')}
              className='w-full min-h-[100px] p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Price (₹)</label>
              <input
                type="number"
                placeholder='Price'
                {...register('price')}
                className='w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Quantity</label>
              <input
                type="number"
                placeholder='Quantity'
                {...register('quantity')}
                className='w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Product Rating (1-5 Stars)</label>
            <select
              {...register('rating')}
              className='w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
              required
              defaultValue="5"
            >
              <option value="5" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">⭐⭐⭐⭐ (4/5)</option>
              <option value="3" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">⭐⭐⭐ (3/5)</option>
              <option value="2" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">⭐⭐ (2/5)</option>
              <option value="1" className="text-slate-900 dark:text-slate-50 dark:bg-slate-900">⭐ (1/5)</option>
            </select>
          </div>


          <div>
            CoverImage
            <input type="file" accept="image/*"   {...register("coverImage")} required />
          </div>
          <div>
            images
            <input type="file" accept="image/*" multiple {...register("images")} required />
          </div>
          <div>
            Videos
            <input type="file" accept="video/*"  {...register("videos")}  />
          </div>

          <button
            type="submit"
            className='w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-100 dark:shadow-none transition duration-300 transform active:scale-95'
          >
            Publish Listing
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddItem