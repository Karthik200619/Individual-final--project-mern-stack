import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router'
import { FaArrowLeft, FaSpinner, FaCloudUploadAlt } from 'react-icons/fa'

function UpdateItem() {
    const { itemId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('OTHERS')
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [coverImage, setCoverImage] = useState('')
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [rating, setRating] = useState(5)

    const [uploadingCover, setUploadingCover] = useState(false)
    const [uploadingImages, setUploadingImages] = useState(false)
    const [uploadingVideos, setUploadingVideos] = useState(false)

    useEffect(() => {
        const getItem = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`http://localhost:5000/user-api/item/${itemId}`, {
                    withCredentials: true
                })
                const item = res.data.payload
                if (item) {
                    setTitle(item.title)
                    setDescription(item.description)
                    setCategory(item.category)
                    setPrice(item.price)
                    setQuantity(item.quantity)
                    setCoverImage(item.coverImage)
                    setImages(item.images || [])
                    setVideos(item.videos || [])
                    setRating(item.rating || 5)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        getItem()
    }, [itemId])

    const uploadFile = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await axios.post('http://localhost:5000/user-api/test-video-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
        return res.data.url
    }

    const handleCoverChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadingCover(true)
            const url = await uploadFile(file)
            setCoverImage(url)
            alert('Cover image uploaded successfully')
        } catch (err) {
            console.log(err)
            alert('Failed to upload cover image')
        } finally {
            setUploadingCover(false)
        }
    }

    const handleImagesChange = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return
        try {
            setUploadingImages(true)
            const urls = []
            for (let file of files) {
                const url = await uploadFile(file)
                urls.push(url)
            }
            setImages(prev => [...prev, ...urls])
            alert('Additional images uploaded successfully')
        } catch (err) {
            console.log(err)
            alert('Failed to upload one or more images')
        } finally {
            setUploadingImages(false)
        }
    }

    const handleVideosChange = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return
        try {
            setUploadingVideos(true)
            const urls = []
            for (let file of files) {
                const url = await uploadFile(file)
                urls.push(url)
            }
            setVideos(prev => [...prev, ...urls])
            alert('Videos uploaded successfully')
        } catch (err) {
            console.log(err)
            alert('Failed to upload one or more videos')
        } finally {
            setUploadingVideos(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const payload = {
                title,
                description,
                category,
                price: Number(price),
                quantity: Number(quantity),
                coverImage,
                images,
                videos,
                rating: Number(rating)
            }
            await axios.post(`http://localhost:5000/user-api/updateitem/${itemId}`, payload, {
                withCredentials: true
            })
            alert('Item updated successfully! It is now pending admin approval.')
            navigate('/myitems')
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to update item')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
            </div>
        )
    }

    return (
        <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex items-center justify-center p-4 md:p-8 transition-colors duration-300">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
                
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition mb-6"
                >
                    <FaArrowLeft /> Back
                </button>

                <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-50 mb-2">
                    Update Product Listing
                </h2>
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center mb-8">
                    Note: Updating this product will require new admin approval.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Product Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                            required
                        >
                            <option value="BOOKS">Books</option>
                            <option value="ELECTRONICS">Electronics</option>
                            <option value="FASHION">Fashion</option>
                            <option value="FURNITURE">Furniture</option>
                            <option value="SPORTS">Sports</option>
                            <option value="STATIONERY">Stationery</option>
                            <option value="OTHERS">Others</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[100px] p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Price (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Product Rating (1-5 Stars)</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                            required
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value="4">⭐⭐⭐⭐ (4/5)</option>
                            <option value="3">⭐⭐⭐ (3/5)</option>
                            <option value="2">⭐⭐ (2/5)</option>
                            <option value="1">⭐ (1/5)</option>
                        </select>
                    </div>

                    {/* File Uploads */}
                    <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Update Cover Image</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleCoverChange} 
                                className="text-xs" 
                                disabled={uploadingCover}
                            />
                            {uploadingCover && <span className="text-xs text-indigo-600 block mt-1 animate-pulse">Uploading...</span>}
                            {coverImage && (
                                <img src={coverImage} alt="Cover" className="w-20 h-20 object-cover rounded-lg border mt-2" />
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Add Additional Images</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                onChange={handleImagesChange} 
                                className="text-xs"
                                disabled={uploadingImages}
                            />
                            {uploadingImages && <span className="text-xs text-indigo-600 block mt-1 animate-pulse">Uploading...</span>}
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {images.map((img, i) => (
                                    <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border">
                                        <img src={img} alt="Additional" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Add Videos</label>
                            <input 
                                type="file" 
                                accept="video/*" 
                                multiple 
                                onChange={handleVideosChange} 
                                className="text-xs"
                                disabled={uploadingVideos}
                            />
                            {uploadingVideos && <span className="text-xs text-indigo-600 block mt-1 animate-pulse">Uploading...</span>}
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {videos.map((vid, i) => (
                                    <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border bg-black flex items-center justify-center">
                                        <video src={vid} className="w-full h-full object-cover" muted />
                                        <button 
                                            type="button"
                                            onClick={() => setVideos(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || uploadingCover || uploadingImages || uploadingVideos}
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-300 transform active:scale-95 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Updating Listing...' : 'Update Listing'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdateItem
