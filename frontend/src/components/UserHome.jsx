import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

import {
    FaPlusCircle,
    FaBoxOpen,
    FaShoppingCart,
    FaComments,
    FaSearch,
    FaGraduationCap,
    FaInbox,
    FaSpinner
} from 'react-icons/fa'

import { useAuth } from '../store/authStore'

const actions = [
    {
        title: "Sell Item",
        icon: <FaPlusCircle />,
        path: '/additem',
        bg: 'rgba(99, 102, 241, 0.1)',
        color: '#6366f1'
    },
    {
        title: "My Listings",
        icon: <FaBoxOpen />,
        path: '/myitems',
        bg: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981'
    },
    {
        title: "My Orders",
        icon: <FaShoppingCart />,
        path: '/orders',
        bg: 'rgba(245, 158, 11, 0.1)',
        color: '#f59e0b'
    },
    {
        title: "Messages",
        icon: <FaComments />,
        path: '/messages',
        bg: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444'
    }
]

const categories = [
    { key: 'ALL', label: '🌟 All Listings' },
    { key: 'BOOKS', label: '📚 Books' },
    { key: 'ELECTRONICS', label: '💻 Electronics' },
    { key: 'FASHION', label: '👕 Fashion' },
    { key: 'FURNITURE', label: '🛋️ Furniture' },
    { key: 'SPORTS', label: '⚽ Sports' },
    { key: 'STATIONERY', label: '✏️ Stationery' },
    { key: 'OTHERS', label: '📦 Others' }
]

const LIMIT = 12

function UserHome() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [items, setItems] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('ALL')

    // Cursor pagination states
    const [lastId, setLastId] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

    // Initial load
    useEffect(() => {
        const getItems = async () => {
            try {
                setLoading(true)
                const res = await axios.get('http://localhost:5000/user-api/items', {
                    params: { limit: LIMIT },
                    withCredentials: true
                })
                const fetched = res.data.payload?.items || []
                setItems(fetched)
                setLastId(fetched.length > 0 ? fetched[fetched.length - 1]._id : null)
                setHasMore(fetched.length === LIMIT)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        getItems()
    }, [])

    // Load more (cursor-based)
    const loadMore = async () => {
        if (!hasMore || loadingMore) return
        try {
            setLoadingMore(true)
            const res = await axios.get('http://localhost:5000/user-api/items', {
                params: { limit: LIMIT, after: lastId },
                withCredentials: true
            })
            const fetched = res.data.payload?.items || []
            setItems(prev => [...prev, ...fetched])
            setLastId(fetched.length > 0 ? fetched[fetched.length - 1]._id : lastId)
            setHasMore(fetched.length === LIMIT)
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingMore(false)
        }
    }

    // AI search
    const searchWithAI = async (value) => {
        setSearch(value)

        if (value.trim() === '') {
            try {
                setLoading(true)
                const res = await axios.get('http://localhost:5000/user-api/items', {
                    params: { limit: LIMIT },
                    withCredentials: true
                })
                const fetched = res.data.payload?.items || []
                setItems(fetched)
                setLastId(fetched.length > 0 ? fetched[fetched.length - 1]._id : null)
                setHasMore(fetched.length === LIMIT)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(
                'http://localhost:5000/user-api/aisearch',
                { query: value },
                { withCredentials: true }
            )
            setItems(res.data.payload || [])
            setHasMore(false) // no pagination during search
            setLastId(null)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // Category filter (client-side on loaded items)
    const filteredItems = selectedCategory === 'ALL'
        ? items
        : items.filter(item => item.category === selectedCategory)

    return (
        <div className="space-y-8">

            {/* Top Greeting Dashboard Header */}
            <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>

                <div className="relative z-10 space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 animate-pulse-soft">
                        <FaGraduationCap /> Verified Student Member
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                        Welcome back, {currentUser?.firstname || 'Student'}! 👋
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Find great deals, swap resources, and connect with your campus marketplace.
                    </p>
                </div>

                <div className="relative z-10 flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                        <span className="block text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {items.length}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Loaded Deals
                        </span>
                    </div>
                    <div className="flex-1 md:flex-initial p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 text-center">
                        <span className="block text-xl font-bold text-teal-600 dark:text-teal-400">
                            Safe
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Quad Delivery
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="!bg-white dark:!bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition duration-300 group"
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                            style={{ background: item.bg, color: item.color }}
                        >
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 transition group-hover:text-indigo-500">
                                {item.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Access fast
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and CTA */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <FaSearch size={14} />
                        </span>
                        <input
                            value={search}
                            onChange={(e) => searchWithAI(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 border border-slate-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 text-slate-900 dark:text-slate-50 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                            placeholder="Describe what you want... (e.g., 'physics textbook under 500')"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/additem')}
                        className="w-full md:w-auto h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 transition"
                    >
                        <FaPlusCircle /> List a New Product
                    </button>
                </div>

                {loading && (
                    <div className="bg-indigo-500/5 border border-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-3.5 rounded-2xl text-sm font-medium animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                        Searching matching products...
                    </div>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap border
                        ${selectedCategory === cat.key
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100 dark:shadow-none'
                                : '!bg-white dark:!bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 hover:border-indigo-300'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div>
                {filteredItems.length === 0 && !loading ? (
                    <div className="text-center py-16 px-4 border border-dashed border-slate-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 rounded-3xl max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center text-2xl mx-auto mb-4">
                            <FaInbox />
                        </div>
                        <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-lg mb-1">No products found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                            We couldn't find any products matching your selection. Try browsing another category or clearing your search.
                        </p>
                        <button
                            onClick={() => { setSelectedCategory('ALL'); searchWithAI('') }}
                            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredItems.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => navigate(`/item/${item._id}`)}
                                    className="!bg-white dark:!bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-indigo-950/20 hover:-translate-y-1 transition duration-300 flex flex-col h-full group"
                                >
                                    <div className="relative overflow-hidden aspect-[4/3] bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                        <img
                                            src={item.coverImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute top-3 left-3 text-[9px] font-extrabold tracking-wider bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-full uppercase">
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="p-4 flex flex-col justify-between flex-grow">
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug group-hover:text-indigo-500 transition line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm font-extrabold text-indigo-500 whitespace-nowrap">
                                                    ₹{item.price}
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Qty: {item.quantity}
                                            </span>
                                            <span>Active Listing</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More button */}
                        {hasMore && !search && (
                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition shadow-md shadow-indigo-100 dark:shadow-none active:scale-95"
                                >
                                    {loadingMore ? (
                                        <><FaSpinner className="animate-spin" /> Loading...</>
                                    ) : (
                                        'Load More Products'
                                    )}
                                </button>
                            </div>
                        )}

                        {!hasMore && items.length > 0 && (
                            <p className="text-center text-xs text-slate-400 dark:text-slate-600 pt-2">
                                You've seen all available products 🎉
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserHome