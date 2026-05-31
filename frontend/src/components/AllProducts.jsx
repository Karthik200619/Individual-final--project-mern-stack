import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { FaSlidersH, FaSearch, FaTimes, FaInbox, FaMapMarkerAlt, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAuth } from '../store/authStore'

const categories = [
    { key: 'ALL', label: 'All Categories' },
    { key: 'BOOKS', label: 'Books' },
    { key: 'ELECTRONICS', label: 'Electronics' },
    { key: 'FASHION', label: 'Fashion' },
    { key: 'FURNITURE', label: 'Furniture' },
    { key: 'SPORTS', label: 'Sports' },
    { key: 'STATIONERY', label: 'Stationery' },
    { key: 'OTHERS', label: 'Others' }
]

const LIMIT = 18

function AllProducts() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [items, setItems] = useState([])
    const [campuses, setCampuses] = useState([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [selectedCampus, setSelectedCampus] = useState('ALL')
    const [sortBy, setSortBy] = useState('newest')
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    // Fetch campuses once
    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const res = await axios.get('https://individual-final-project-mern-stack.onrender.com/user-api/campuses', { withCredentials: true })
                setCampuses(res.data.payload || [])
            } catch (err) {
                console.error(err)
            }
        }
        fetchCampuses()
    }, [])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedCategory, minPrice, maxPrice, selectedCampus, sortBy])

    // Fetch items on filter or page change
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true)
            try {
                const res = await axios.get('https://individual-final-project-mern-stack.onrender.com/user-api/items', {
                    params: {
                        search,
                        category: selectedCategory,
                        minPrice,
                        maxPrice,
                        campusId: selectedCampus,
                        sortBy,
                        page: currentPage,
                        limit: LIMIT
                    }
                })
                const payload = res.data.payload || {}
                setItems(payload.items || [])
                setTotalPages(payload.pagination?.totalPages || 1)
                setTotalItems(payload.pagination?.totalItems || 0)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [search, selectedCategory, minPrice, maxPrice, selectedCampus, sortBy, currentPage])

    const resetFilters = () => {
        setSearch('')
        setSelectedCategory('ALL')
        setMinPrice('')
        setMaxPrice('')
        setSelectedCampus('ALL')
        setSortBy('newest')
        setCurrentPage(1)
    }

    // Smart page number array with ellipsis
    const getPageNumbers = () => {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
            }, [])
    }

    const FilterSidebarContent = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <FaSlidersH /> Filters
                </h3>
                <button
                    onClick={resetFilters}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    Reset All
                </button>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Keyword</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400"><FaSearch size={11} /></span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="e.g. textbook"
                        className="w-full h-10 pl-9 pr-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl outline-none text-xs focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                >
                    {categories.map(cat => (
                        <option key={cat.key} value={cat.key} className="dark:bg-slate-900">{cat.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus</label>
                <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                >
                    <option value="ALL" className="dark:bg-slate-900">All Campuses</option>
                    {campuses.map(campus => (
                        <option key={campus._id} value={campus._id} className="dark:bg-slate-900">{campus.campusName}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Price Range (₹)</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort By</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                >
                    <option value="newest" className="dark:bg-slate-900">Date Added: Newest</option>
                    <option value="price_asc" className="dark:bg-slate-900">Price: Low to High</option>
                    <option value="price_desc" className="dark:bg-slate-900">Price: High to Low</option>
                    <option value="rating_desc" className="dark:bg-slate-900">Rating: High to Low</option>
                </select>
            </div>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 transition-colors duration-300 pb-16">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50">Browse Campus Deals</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        {totalItems > 0 ? `${totalItems} items available across all campuses` : 'Discover items listed by students on verified campuses.'}
                    </p>
                </div>
                <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="md:hidden flex items-center gap-1.5 h-10 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                    <FaSlidersH /> Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Desktop Sidebar */}
                <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-fit sticky top-24">
                    <FilterSidebarContent />
                </div>

                {/* Mobile Filters Panel */}
                {mobileFiltersOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-4 mb-6">
                        <div className="flex items-start justify-between gap-3 mb-5">
                            <div>
                                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">Refine Selection</h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Adjust filters without leaving the page.</p>
                            </div>
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="p-2 rounded-full text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <FilterSidebarContent />
                        <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="mt-5 w-full h-11 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-100 dark:shadow-none"
                        >
                            Apply Filters ({totalItems})
                        </button>
                    </div>
                )}

                {/* Items Grid + Pagination */}
                <div className="md:col-span-3 space-y-6">

                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-4">
                                <FaInbox />
                            </div>
                            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">No items match your criteria</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                                Try widening your price range, choosing another category, or clearing your search.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(item => (
                                    <div
                                        key={item._id}
                                        onClick={() => navigate(`/item/${item._id}`)}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg dark:hover:shadow-indigo-950/10 cursor-pointer transition flex flex-col h-full group"
                                    >
                                        <div className="aspect-[4/3] relative bg-slate-50 dark:bg-slate-950 border-b dark:border-slate-800 overflow-hidden">
                                            <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <span className="absolute top-3 left-3 text-[8px] font-extrabold tracking-wider bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full uppercase">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="p-4 grow flex flex-col justify-between space-y-4">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-500 transition">{item.title}</h3>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs font-black text-indigo-500">₹{item.price}</span>
                                                        <span className="text-[10px] font-bold text-amber-500 whitespace-nowrap">⭐ {item.rating || 5}/5</span>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mt-1">{item.description}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-[9px] text-slate-400 border-t pt-3 dark:border-slate-800">
                                                <span className="flex-1 truncate flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-indigo-500 shrink-0" />
                                                    {item.seller?.campus?.campusName || 'Campus'}
                                                </span>
                                                <span className="font-bold">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Bar */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Page <span className="font-bold text-slate-600 dark:text-slate-300">{currentPage}</span> of{' '}
                                        <span className="font-bold text-slate-600 dark:text-slate-300">{totalPages}</span>
                                        {' '}· <span className="font-bold text-slate-600 dark:text-slate-300">{totalItems}</span> total items
                                    </p>

                                    <div className="flex items-center gap-1">
                                        {/* Prev */}
                                        <button
                                            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                            disabled={currentPage === 1}
                                            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:border-indigo-400 hover:text-indigo-600 transition flex items-center gap-1"
                                        >
                                            <FaChevronLeft size={10} /> Prev
                                        </button>

                                        {/* Page numbers */}
                                        {getPageNumbers().map((p, idx) =>
                                            p === '...' ? (
                                                <span key={`dots-${idx}`} className="h-9 w-9 flex items-center justify-center text-xs text-slate-400">
                                                    …
                                                </span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                                    className={`h-9 w-9 rounded-xl border text-xs font-bold transition ${
                                                        currentPage === p
                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100 dark:shadow-none'
                                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )}

                                        {/* Next */}
                                        <button
                                            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                            disabled={currentPage === totalPages}
                                            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:border-indigo-400 hover:text-indigo-600 transition flex items-center gap-1"
                                        >
                                            Next <FaChevronRight size={10} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AllProducts