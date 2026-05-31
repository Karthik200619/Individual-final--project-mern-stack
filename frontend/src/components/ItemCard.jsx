import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router'
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaUniversity,
    FaBoxOpen,
    FaChevronLeft,
    FaChevronRight,
    FaShoppingCart,
    FaTrash,
    FaEdit,
    FaComments,
    FaPlayCircle
} from 'react-icons/fa'
import { useAuth } from '../store/authStore'

function ItemCard() {
    const { itemId } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const [item, setItem] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)

    // Comments State
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedCommentBody, setEditedCommentBody] = useState('')

    const getItem = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/user-api/item/${itemId}`,
                {
                    withCredentials: true
                }
            )
            setItem(res.data.payload)
            setComments(res.data.payload.comments || [])
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getItem()
    }, [itemId])

    const handleAddToCart = async () => {
        try {
            await axios.post('http://localhost:5000/user-api/cart/add', {
                itemId: item._id,
                quantity: 1
            }, {
                withCredentials: true
            })
            alert('Item added to cart successfully!')
        } catch (err) {
            console.log(err)
            alert('Failed to add to cart')
        }
    }

    // Comment operations
    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        try {
            const res = await axios.post(`http://localhost:5000/user-api/item/${itemId}/comment`, {
                commentBody: newComment
            }, {
                withCredentials: true
            })
            setComments(res.data.payload)
            setNewComment('')
        } catch (err) {
            console.log(err)
            alert('Failed to post comment')
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return
        try {
            const res = await axios.delete(`http://localhost:5000/user-api/item/${itemId}/comment/${commentId}`, {
                withCredentials: true
            })
            setComments(res.data.payload)
        } catch (err) {
            console.log(err)
            alert('Failed to delete comment')
        }
    }

    const handleEditCommentSubmit = async (commentId) => {
        if (!editedCommentBody.trim()) return
        try {
            const res = await axios.put(`http://localhost:5000/user-api/item/${itemId}/comment/${commentId}`, {
                commentBody: editedCommentBody
            }, {
                withCredentials: true
            })
            setComments(res.data.payload)
            setEditingCommentId(null)
            setEditedCommentBody('')
        } catch (err) {
            console.log(err)
            alert('Failed to edit comment')
        }
    }

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    Loading item...
                </div>
            </div>
        )
    }

    // Consolidate images and videos into one list of media objects
    const mediaList = [
        { type: 'image', url: item.coverImage },
        ...(item.images || []).map(img => ({ type: 'image', url: img })),
        ...(item.videos || []).map(vid => ({ type: 'video', url: vid }))
    ].filter(m => m.url)

    const nextSlide = () => {
        setActiveSlide(prev => (prev === mediaList.length - 1 ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setActiveSlide(prev => (prev === 0 ? mediaList.length - 1 : prev - 1))
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-12 transition-colors duration-300">
            {/* Top Bar Header */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm px-6 py-4 flex items-center gap-3">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full transition"
                >
                    <FaArrowLeft className="text-slate-700 dark:text-slate-300" />
                </button>
                <h1 className="font-extrabold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Listing Details
                </h1>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Panel: Media Carousel */}
                <div className="space-y-4">
                    <div className="relative aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
                        {mediaList.length > 0 ? (
                            mediaList[activeSlide].type === 'video' ? (
                                <video
                                    src={mediaList[activeSlide].url}
                                    controls
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img
                                    src={mediaList[activeSlide].url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                No media available
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        {mediaList.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full transition opacity-0 group-hover:opacity-100"
                                >
                                    <FaChevronLeft size={12} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full transition opacity-0 group-hover:opacity-100"
                                >
                                    <FaChevronRight size={12} />
                                </button>

                                {/* Slide indicators (dots) */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    {mediaList.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveSlide(index)}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                                activeSlide === index ? 'bg-white w-3' : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Small thumbnails preview row */}
                    {mediaList.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {mediaList.map((media, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveSlide(index)}
                                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-black ${
                                        activeSlide === index ? 'border-indigo-600' : 'border-transparent'
                                    }`}
                                >
                                    {media.type === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white relative">
                                            <video src={media.url} className="w-full h-full object-cover opacity-60" muted />
                                            <FaPlayCircle className="absolute text-xs" />
                                        </div>
                                    ) : (
                                        <img src={media.url} alt="" className="w-full h-full object-cover" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel: Product Info & Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <span className="inline-block text-[9px] font-extrabold tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full uppercase mb-2">
                                    {item.category}
                                </span>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
                                    {item.title}
                                </h2>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                    ₹{item.price}
                                </p>
                                <p className="text-xs font-bold text-amber-500 mt-1.5 whitespace-nowrap">
                                    ⭐ {item.rating || 5}/5
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                            {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-850">
                            <FaBoxOpen className="text-indigo-500" />
                            <span>Stock Quantity: {item.quantity}</span>
                        </div>
                    </div>

                    {/* Seller Details */}
                    {item.seller && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                            <h3 className="font-extrabold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Seller Profile</h3>
                            
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.seller.profileImageUrl || 'https://via.placeholder.com/150'}
                                    alt="Seller profile"
                                    className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50">
                                        {item.seller.firstname} {item.seller.lastname}
                                    </h4>
                                    <div className="flex flex-col gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="flex items-center gap-1.5">
                                            <FaUniversity className="text-indigo-500" />
                                            {item.seller.campus?.campusName || 'Campus details'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FaMapMarkerAlt className="text-indigo-500" />
                                            {item.seller.campus?.city || 'Location'}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/myitems?userId=${item.seller._id}`)}
                                            className="mt-2.5 w-fit px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <FaBoxOpen /> View Listings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            onClick={() => navigate(`/messages?userId=${item.seller?._id}&itemId=${item._id}`)}
                            className="h-12 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                        >
                            <FaComments /> Chat Seller
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="h-12 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                        >
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button
                            onClick={() => navigate(`/buy/${item._id}`)}
                            className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center transition shadow-md shadow-indigo-100 dark:shadow-none"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Comments */}
            <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                        💬 Comments & Inquiries ({comments.length})
                    </h3>

                    {/* Write new comment */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ask the seller a question about condition, price, or meetup..."
                            className="flex-1 h-11 px-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition"
                        >
                            Post
                        </button>
                    </form>

                    {/* Comments list */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                        {comments.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-6">No comments yet. Be the first to inquire!</p>
                        ) : (
                            comments.map((comment) => {
                                const isCommentOwner = comment.commentedBy?._id === currentUser?._id
                                const isItemSeller = item.seller?._id === currentUser?._id
                                const isAdmin = currentUser?.role === 'ADMIN'
                                const canDelete = isCommentOwner || isItemSeller || isAdmin

                                return (
                                    <div 
                                        key={comment._id} 
                                        className="flex items-start gap-3 text-xs border-b border-slate-50 dark:border-slate-850/50 pb-4 last:border-b-0"
                                    >
                                        <img
                                            src={comment.commentedBy?.profileImageUrl || 'https://via.placeholder.com/150'}
                                            alt=""
                                            className="w-8 h-8 rounded-full object-cover border"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center gap-2">
                                                <span className="font-bold text-slate-950 dark:text-slate-50">
                                                    {comment.commentedBy?.firstname} {comment.commentedBy?.lastname}
                                                </span>
                                                <span className="text-[10px] text-slate-450">
                                                    {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {editingCommentId === comment._id ? (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input
                                                        type="text"
                                                        value={editedCommentBody}
                                                        onChange={(e) => setEditedCommentBody(e.target.value)}
                                                        className="flex-1 h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => handleEditCommentSubmit(comment._id)}
                                                        className="h-9 px-3 bg-green-600 text-white rounded-lg text-[10px] font-bold"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCommentId(null)}
                                                        className="h-9 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px]"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-slate-650 dark:text-slate-350 mt-1 leading-relaxed">
                                                    {comment.commentBody}
                                                </p>
                                            )}

                                            {/* Action buttons (Edit/Delete) */}
                                            {!editingCommentId && (isCommentOwner || canDelete) && (
                                                <div className="flex gap-3 mt-2 text-[10px] font-semibold text-slate-400">
                                                    {isCommentOwner && (
                                                        <button 
                                                            onClick={() => {
                                                                setEditingCommentId(comment._id)
                                                                setEditedCommentBody(comment.commentBody)
                                                            }}
                                                            className="hover:text-indigo-600 flex items-center gap-1 transition"
                                                        >
                                                            <FaEdit size={10} /> Edit
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="hover:text-red-500 flex items-center gap-1 transition"
                                                        >
                                                            <FaTrash size={10} /> Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCard