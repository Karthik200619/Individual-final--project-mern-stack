import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { FaArrowLeft, FaEdit, FaTrash, FaInbox, FaSpinner } from 'react-icons/fa'
import { useAuth } from '../store/authStore'

function MyListings() {
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // ✅ FIX 1: "isOwnListings" declared — this page always shows your own listings
    const isOwnListings = true

    const getMyItems = async () => {
        try {
            setLoading(true)
            const res = await axios.get('http://localhost:5000/user-api/my-items', {
                withCredentials: true
            })
            const payload = res.data.payload || {}
            setItems(payload.items || [])
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // ✅ FIX 2: dependency was "userId" (undefined) → now empty array, runs once on mount
    useEffect(() => {
        getMyItems()
    }, [])

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return
        try {
            await axios.delete(`http://localhost:5000/user-api/deleteitem/${itemId}`, {
                withCredentials: true
            })
            alert('Listing deleted successfully')
            getMyItems()
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to delete listing')
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                >
                    <FaArrowLeft className="text-slate-700 dark:text-slate-300" />
                </button>
                <div>
                    {/* ✅ FIX 3: "sellerName" removed — this is always "My Listings" */}
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
                        My Listings
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage, edit, or delete items you listed for sale
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-16 px-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center text-2xl mx-auto mb-4">
                        <FaInbox />
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-lg mb-1">
                        No listings found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                        You haven't listed any items for sale yet. Why not list your first item now?
                    </p>
                    <button
                        onClick={() => navigate('/additem')}
                        className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition shadow-md shadow-indigo-100 dark:shadow-none"
                    >
                        List an Item
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/item/${item._id}`)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition duration-300 flex flex-col h-full group"
                            >
                                <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className={`absolute top-3 left-3 text-[9px] font-extrabold tracking-wider px-2 py-1 rounded-full uppercase text-white ${item.isActive ? 'bg-emerald-600' : 'bg-amber-500'}`}>
                                        {item.isActive ? 'Approved' : 'Pending Approval'}
                                    </span>
                                </div>

                                <div className="p-4 flex flex-col justify-between grow">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-500 transition">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm font-extrabold text-indigo-500">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                        <span>Qty: {item.quantity}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/update-item/${item._id}`) }}
                                                className="p-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-lg transition"
                                                title="Edit listing"
                                            >
                                                <FaEdit size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item._id) }}
                                                className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition"
                                                title="Delete listing"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyListings