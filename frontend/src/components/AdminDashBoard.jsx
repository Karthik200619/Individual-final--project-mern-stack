import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    FaChartBar,
    FaClipboardList,
    FaTag,
    FaUsers,
    FaMapMarkerAlt,
    FaPlusCircle,
    FaTrash,
    FaCheckCircle,
    FaTimesCircle,
    FaInbox,
    FaSpinner,
    FaBoxOpen,
    FaSearch
} from 'react-icons/fa'

function ReplyForm({ queryId, onSend }) {
    const [replyText, setReplyText] = React.useState('')
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSend(queryId, replyText);
                setReplyText('');
            }}
            className="flex gap-2 w-full"
        >
            <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the student..."
                className="flex-1 h-9 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-xs outline-none focus:border-indigo-500"
                required
            />
            <button
                type="submit"
                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
            >
                Send Reply
            </button>
        </form>
    )
}

function AdminDashBoard() {
    const [activeTab, setActiveTab] = useState('stats')
    const [loading, setLoading] = useState(true)

    // Data states
    const [stats, setStats] = useState({ totalUsers: 0, activeItems: 0, pendingItems: 0, totalOrders: 0, revenue: 0 })
    const [pendingItems, setPendingItems] = useState([])
    const [approvedItems, setApprovedItems] = useState([])
    const [coupons, setCoupons] = useState([])
    const [usersPagination, setUsersPagination] = useState({ users: [], totalPages: 1, currentPage: 1, totalUsers: 0 })
    const [userSearch, setUserSearch] = useState('')
    const [userSortBy, setUserSortBy] = useState('')
    const [userPage, setUserPage] = useState(1)
    const [campuses, setCampuses] = useState([])
    const [queries, setQueries] = useState([])
    const [notifications, setNotifications] = useState([])

    // Forms states
    const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: 10, expiresAt: '', category: 'ALL', minPrice: 0, maxPrice: '', usageLimit: '' })
    const [newNotification, setNewNotification] = useState({ recipientId: '', title: '', message: '', type: 'admin', all: false })
    const [submittingNotification, setSubmittingNotification] = useState(false)
    const [newCampus, setNewCampus] = useState({ campusName: '', campusLogo: '', campusEmailDomain: '', description: '', city: '' })
    const [submittingCoupon, setSubmittingCoupon] = useState(false)
    const [submittingCampus, setSubmittingCampus] = useState(false)

    const fetchUsers = async (page = 1, search = '', sortBy = '') => {
        try {
            const res = await axios.get(`http://localhost:5000/admin-api/users?page=${page}&limit=10&search=${search}&sortBy=${sortBy}`, { withCredentials: true })
            setUsersPagination(res.data.payload || { users: [], totalPages: 1, currentPage: 1, totalUsers: 0 })
        } catch (err) {
            console.log(err)
        }
    }

    const fetchQueries = async () => {
        try {
            const res = await axios.get('http://localhost:5000/admin-api/queries', { withCredentials: true })
            setQueries(res.data.payload || [])
        } catch (err) {
            console.log(err)
        }
    }

    const fetchAllData = async () => {
        try {
            setLoading(true)
            // Stats
            const statsRes = await axios.get('http://localhost:5000/admin-api/stats', { withCredentials: true })
            setStats(statsRes.data.payload)

            // Pending
            const pendingRes = await axios.get('http://localhost:5000/admin-api/pending-items', { withCredentials: true })
            setPendingItems(pendingRes.data.payload)

            // Approved
            const approvedRes = await axios.get('http://localhost:5000/admin-api/approved-items', { withCredentials: true })
            setApprovedItems(approvedRes.data.payload)

            // Coupons
            const couponRes = await axios.get('http://localhost:5000/admin-api/discounts', { withCredentials: true })
            setCoupons(couponRes.data.payload)

            // Users
            await fetchUsers(userPage, userSearch, userSortBy)

            // Campuses
            const campusRes = await axios.get('http://localhost:5000/admin-api/campuses', { withCredentials: true })
            setCampuses(campusRes.data.payload)

            // Help Queries
            await fetchQueries()

            // Notifications
            await fetchNotifications()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [])

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers(userPage, userSearch, userSortBy)
        } else if (activeTab === 'queries') {
            fetchQueries()
        } else if (activeTab === 'notifications') {
            fetchNotifications()
        }
    }, [userPage, userSearch, userSortBy, activeTab])

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/admin-api/notifications', { withCredentials: true })
            setNotifications(res.data.payload || [])
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateNotification = async (e) => {
        e.preventDefault()
        if (!newNotification.title.trim() || !newNotification.message.trim()) return
        try {
            setSubmittingNotification(true)
            await axios.post('http://localhost:5000/admin-api/notifications', newNotification, { withCredentials: true })
            alert('Notification sent successfully!')
            setNewNotification({ recipientId: '', title: '', message: '', type: 'admin', all: false })
            fetchNotifications()
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to send notification')
        } finally {
            setSubmittingNotification(false)
        }
    }

    // Listing operations
    const handleApproveItem = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin-api/approve-item/${id}`, {}, { withCredentials: true })
            alert('Item approved successfully!')
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to approve item')
        }
    }

    const handleRejectItem = async (id) => {
        if (!window.confirm('Are you sure you want to reject/delete this item?')) return
        try {
            await axios.delete(`http://localhost:5000/admin-api/reject-item/${id}`, { withCredentials: true })
            alert('Item rejected/deleted successfully')
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to reject item')
        }
    }

    const handleAdminDeleteItem = async (id) => {
        if (!window.confirm('Delete this listing permanently?')) return
        try {
            await axios.delete(`http://localhost:5000/admin-api/items/${id}`, { withCredentials: true })
            alert('Item deleted successfully')
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to delete item')
        }
    }

    // Coupon operations
    const handleCreateCoupon = async (e) => {
        e.preventDefault()
        if (!newCoupon.code.trim()) return
        try {
            setSubmittingCoupon(true)
            await axios.post('http://localhost:5000/admin-api/discounts', newCoupon, { withCredentials: true })
            alert('Coupon created successfully!')
            setNewCoupon({ code: '', discountPercentage: 10, expiresAt: '', category: 'ALL', minPrice: 0, maxPrice: '', usageLimit: '' })
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to create coupon')
        } finally {
            setSubmittingCoupon(false)
        }
    }

    const handleToggleCoupon = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/admin-api/discounts/${id}/toggle`, {}, { withCredentials: true })
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to toggle coupon status')
        }
    }
    const handleApproveAllPending = async () => {
        if (!window.confirm(`Approve all ${pendingItems.length} pending items at once?`)) return
        try {
            await axios.put('http://localhost:5000/admin-api/approve-all-items', {}, { withCredentials: true })
            alert(`All ${pendingItems.length} pending items approved successfully!`)
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to approve all items')
        }
    }

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Delete this coupon code?')) return
        try {
            await axios.delete(`http://localhost:5000/admin-api/discounts/${id}`, { withCredentials: true })
            alert('Coupon deleted')
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to delete coupon')
        }
    }

    // User operations
    const handleToggleUser = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/admin-api/users/${id}/toggle-active`, {}, { withCredentials: true })
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to toggle user status')
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Permanently delete this user account?')) return
        try {
            await axios.delete(`http://localhost:5000/admin-api/users/${id}`, { withCredentials: true })
            alert('User deleted successfully')
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to delete user')
        }
    }

    // Campus operations
    const handleCreateCampus = async (e) => {
        e.preventDefault()
        if (!newCampus.campusName.trim() || !newCampus.campusEmailDomain.trim()) return
        try {
            setSubmittingCampus(true)
            await axios.post('http://localhost:5000/admin-api/campuses', newCampus, { withCredentials: true })
            alert('Campus registered successfully!')
            setNewCampus({ campusName: '', campusLogo: '', campusEmailDomain: '', description: '', city: '' })
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to register campus')
        } finally {
            setSubmittingCampus(false)
        }
    }

    const handleToggleCampusApprove = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/admin-api/campuses/${id}/approve`, {}, { withCredentials: true })
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to toggle campus approval')
        }
    }

    const handleDeleteCampus = async (id) => {
        if (!window.confirm('Delete this campus?')) return
        try {
            await axios.delete(`http://localhost:5000/admin-api/campuses/${id}`, { withCredentials: true })
            alert('Campus deleted')
            fetchAllData()
        } catch (err) {
            console.log(err)
            alert('Failed to delete campus')
        }
    }

    const handleSendReply = async (queryId, reply) => {
        try {
            await axios.post(`http://localhost:5000/admin-api/queries/${queryId}/reply`, { reply }, { withCredentials: true })
            alert('Reply sent successfully!')
            fetchQueries()
        } catch (err) {
            console.log(err)
            alert('Failed to send reply')
        }
    }

    const handleMarkViewed = async (queryId) => {
        try {
            await axios.patch(`http://localhost:5000/admin-api/queries/${queryId}/view`, {}, { withCredentials: true })
            fetchQueries()
        } catch (err) {
            console.log(err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center dark:bg-slate-950">
                <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">

            {/* Top Overview Banner */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#6366f1_1px,transparent_1px)]"></div>
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                        🛡️ System Operations Console
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">Admin Control Panel</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Moderation, Statistics, and Marketplace configurations</p>
                </div>
                <button
                    onClick={fetchAllData}
                    className="relative z-10 px-4 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-650 rounded-xl transition"
                >
                    Refresh Console
                </button>
            </div>

            {/* Tabbed Navigation */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                {[
                    { key: 'stats', label: 'Overview', icon: <FaChartBar /> },
                    { key: 'pending', label: `Pending Listings (${pendingItems.length})`, icon: <FaClipboardList /> },
                    { key: 'approved', label: 'Approved Listings', icon: <FaBoxOpen /> },
                    { key: 'coupons', label: 'Discounts / Coupons', icon: <FaTag /> },
                    { key: 'users', label: 'User Directory', icon: <FaUsers /> },
                    { key: 'campuses', label: 'Campuses', icon: <FaMapMarkerAlt /> },
                    { key: 'notifications', label: `Notifications`, icon: <FaInbox /> },
                    { key: 'queries', label: `Help Queries (${queries.length})`, icon: <FaInbox /> }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap border flex items-center gap-2
                        ${activeTab === tab.key
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:text-indigo-650'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Panel Contents */}
            <div className="space-y-6">

                {/* 1. OVERVIEW STATS TAB */}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { title: 'Total Revenue', value: `₹${stats.revenue || 0}`, bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-450' },
                                { title: 'Registered Students', value: stats.totalUsers || 0, bg: 'bg-indigo-50 dark:bg-indigo-950/20', text: 'text-indigo-600 dark:text-indigo-455' },
                                { title: 'Approved Listings', value: stats.activeItems || 0, bg: 'bg-teal-50 dark:bg-teal-950/20', text: 'text-teal-600 dark:text-teal-450' },
                                { title: 'Pending Approval', value: stats.pendingItems || 0, bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-450' },
                                { title: 'Total Transactions', value: stats.totalOrders || 0, bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-600 dark:text-purple-450' }
                            ].map((stat, i) => (
                                <div key={i} className={`p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 ${stat.bg} space-y-1 shadow-sm`}>
                                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.title}</span>
                                    <span className={`block text-2xl font-black ${stat.text}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Recent Transactions placeholder / general advice */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-50 mb-3 uppercase tracking-wider">Moderator Quick Instructions</h2>
                            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-5">
                                <li>Review items in <strong>Pending Listings</strong> diligently to keep spam off the marketplace.</li>
                                <li>Ensure listing descriptions match their categories and verify their compliance with campus rules.</li>
                                <li>Create discount codes to incentivize trade or provide welcoming events.</li>
                                <li>Campuses registered with correct email domains are critical to user-registration security.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* 2. PENDING LISTINGS TAB */}
                {activeTab === 'pending' && (
                    pendingItems.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
                            <FaCheckCircle className="mx-auto text-3xl text-emerald-500 mb-3" />
                            <h3 className="font-extrabold text-slate-900 dark:text-slate-550 text-sm">Inbox cleared!</h3>
                            <p className="text-xs text-slate-400 mt-1">There are no listing approval requests pending currently.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* ✅ Approve All button */}
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-sm">
                                <div>
                                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                                        {pendingItems.length} item{pendingItems.length !== 1 ? 's' : ''} awaiting approval
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Review individually or approve all trusted listings at once
                                    </p>
                                </div>
                                <button
                                    onClick={handleApproveAllPending}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-100 dark:shadow-none active:scale-95"
                                >
                                    <FaCheckCircle /> Approve All ({pendingItems.length})
                                </button>
                            </div>

                            {/* existing individual cards grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pendingItems.map(item => (
                                    <div key={item._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex gap-4 shadow-sm">
                                        <img src={item.coverImage} alt="" className="w-24 h-24 rounded-xl object-cover border" />
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-50 truncate">{item.title}</h3>
                                                    <span className="text-indigo-600 font-bold text-xs">₹{item.price}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 border-t pt-2 border-slate-100 dark:border-slate-800">
                                                <span>Seller: {item.seller?.firstname} {item.seller?.lastname}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleApproveItem(item._id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold">Approve</button>
                                                    <button onClick={() => handleRejectItem(item._id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">Reject</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}

                {/* 3. APPROVED LISTINGS TAB */}
                {activeTab === 'approved' && (
                    approvedItems.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
                            <FaInbox className="mx-auto text-3xl text-slate-350 mb-3" />
                            <h3 className="font-extrabold text-slate-900 dark:text-slate-550 text-sm">No approved items</h3>
                            <p className="text-xs text-slate-400 mt-1">There are no approved listings available on the marketplace.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {approvedItems.map(item => (
                                <div key={item._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex gap-4 shadow-sm">
                                    <img src={item.coverImage} alt="" className="w-20 h-20 rounded-xl object-cover border" />
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-50 truncate">{item.title}</h3>
                                                <span className="text-[10px] text-slate-400 mt-0.5 block">Category: {item.category} | Seller: {item.seller?.firstname}</span>
                                            </div>
                                            <span className="text-indigo-650 font-bold text-xs">₹{item.price}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] mt-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                                            <span className="text-emerald-500 font-semibold flex items-center gap-1"><FaCheckCircle /> Approved</span>
                                            <button onClick={() => handleAdminDeleteItem(item._id)} className="p-1.5 text-red-500 hover:text-red-600 transition" title="Delete listing"><FaTrash size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* 4. DISCOUNTS / COUPONS TAB */}
                {activeTab === 'coupons' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Coupon Creator */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 h-fit">
                            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-50 flex items-center gap-1.5"><FaPlusCircle /> Create Discount Coupon</h2>
                            <form onSubmit={handleCreateCoupon} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Coupon Code</label>
                                    <input
                                        type="text"
                                        value={newCoupon.code}
                                        onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                                        placeholder="e.g. CAMPUS20"
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500 uppercase"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Discount Percentage (%)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={newCoupon.discountPercentage}
                                        onChange={(e) => setNewCoupon(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expires At (Optional)</label>
                                    <input
                                        type="date"
                                        value={newCoupon.expiresAt}
                                        onChange={(e) => setNewCoupon(prev => ({ ...prev, expiresAt: e.target.value }))}
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Applicable Category</label>
                                    <select
                                        value={newCoupon.category}
                                        onChange={(e) => setNewCoupon(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500 font-semibold"
                                    >
                                        {["ALL", "BOOKS", "ELECTRONICS", "FASHION", "FURNITURE", "SPORTS", "STATIONERY", "OTHERS"].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Min Price (₹)</label>
                                        <input
                                            type="number"
                                            value={newCoupon.minPrice}
                                            onChange={(e) => setNewCoupon(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                                            className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Max Price (₹)</label>
                                        <input
                                            type="number"
                                            value={newCoupon.maxPrice}
                                            onChange={(e) => setNewCoupon(prev => ({ ...prev, maxPrice: e.target.value === '' ? '' : Number(e.target.value) }))}
                                            placeholder="No Max"
                                            className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Usage Limit (Optional)</label>
                                    <input
                                        type="number"
                                        value={newCoupon.usageLimit}
                                        onChange={(e) => setNewCoupon(prev => ({ ...prev, usageLimit: e.target.value === '' ? '' : Number(e.target.value) }))}
                                        placeholder="Unlimited usage"
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingCoupon}
                                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                                >
                                    {submittingCoupon ? 'Creating...' : 'Create Coupon'}
                                </button>
                            </form>
                        </div>

                        {/* Coupon List Table */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm overflow-x-auto">
                            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-3">Active Coupons</h2>
                            {coupons.length === 0 ? (
                                <p className="text-xs text-slate-400 py-6 text-center">No coupons created yet</p>
                            ) : (
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Code</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Discount</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Rules</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Usage</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Expires</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                                        {coupons.map((c) => {
                                            const expired = c.expiresAt && new Date(c.expiresAt) < new Date()
                                            return (
                                                <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                                    <td className="py-3 font-bold text-slate-900 dark:text-slate-50 whitespace-normal wrap-break-word">{c.code}</td>
                                                    <td className="py-3 font-semibold text-indigo-650 whitespace-normal wrap-break-word">{c.discountPercentage}% OFF</td>
                                                    <td className="py-3 text-[11px] text-slate-500 dark:text-slate-400 whitespace-normal wrap-break-word">
                                                        <div><span className="font-semibold text-slate-400">Category:</span> {c.category || 'ALL'}</div>
                                                        <div><span className="font-semibold text-slate-400">Range:</span> ₹{c.minPrice || 0} - {c.maxPrice ? `₹${c.maxPrice}` : 'No Max'}</div>
                                                    </td>
                                                    <td className="py-3 font-bold text-slate-700 dark:text-slate-300">
                                                        {c.usageLimit ? `${c.usageCount || 0} / ${c.usageLimit}` : `${c.usageCount || 0} / ♾️`}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${expired ? 'bg-red-100 text-red-700' :
                                                            c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {expired ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-slate-400">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                                                    <td className="py-3 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleToggleCoupon(c._id)}
                                                            className={`px-2 py-1 text-[10px] rounded-lg font-bold border transition ${c.isActive ? 'border-amber-300 text-amber-700 bg-amber-50' : 'border-emerald-300 text-emerald-750 bg-emerald-50'
                                                                }`}
                                                            disabled={expired}
                                                        >
                                                            {c.isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button onClick={() => handleDeleteCoupon(c._id)} className="p-1.5 text-red-500 hover:text-red-600 transition"><FaTrash size={10} /></button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* 5. USER DIRECTORY TAB */}
                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
                            <div>
                                <h2 className="font-bold text-sm text-slate-900 dark:text-slate-50">Student Profiles</h2>
                                <p className="text-[11px] text-slate-400 mt-0.5">Total Users: {usersPagination.totalUsers || 0}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                {/* Search input */}
                                <div className="relative flex-1 sm:w-64">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <FaSearch size={12} />
                                    </span>
                                    <input
                                        type="text"
                                        value={userSearch}
                                        onChange={(e) => {
                                            setUserSearch(e.target.value);
                                            setUserPage(1); // reset to page 1 on new search
                                        }}
                                        placeholder="Search by name..."
                                        className="w-full h-9 pl-9 pr-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl outline-none text-xs focus:border-indigo-500"
                                    />
                                </div>

                                {/* Sort select */}
                                <select
                                    value={userSortBy}
                                    onChange={(e) => {
                                        setUserSortBy(e.target.value);
                                        setUserPage(1);
                                    }}
                                    className="h-9 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                >
                                    <option value="">Sort by: Newest Joined</option>
                                    <option value="purchased">Sort by: Most Orders</option>
                                    <option value="active">Sort by: Most Active</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {(usersPagination.users || []).length === 0 ? (
                                <p className="text-xs text-slate-400 py-6 text-center">No students found matching filters</p>
                            ) : (
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Student Name</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Email Address</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Campus</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Sex</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-center">Orders</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-center">Activity</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                                        {(usersPagination.users || []).map(u => (
                                            <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                                <td className="py-3 flex items-center gap-2">
                                                    <img src={u.profileImageUrl || 'https://via.placeholder.com/150'} alt="" className="w-8 h-8 rounded-full object-cover border" />
                                                    <span className="font-bold text-slate-900 dark:text-slate-50">{u.firstname} {u.lastname}</span>
                                                </td>
                                                <td className="py-3 text-slate-450">{u.email}</td>
                                                <td className="py-3 text-slate-650 dark:text-slate-350">{u.campus?.campusName || 'Unassigned'}</td>
                                                <td className="py-3 text-slate-450">{u.gender}</td>
                                                <td className="py-3 text-center font-semibold text-slate-600 dark:text-slate-400 whitespace-normal wrap-break-word">{u.ordersCount ?? 0}</td>
                                                <td className="py-3 text-center text-[10px] text-slate-400 whitespace-normal wrap-break-word">
                                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                                                        Score: {u.activityScore ?? 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 whitespace-normal wrap-break-word">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {u.isActive ? 'Active' : 'Blocked'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleToggleUser(u._id)}
                                                        className={`px-2.5 py-1 text-[10px] rounded-lg font-bold border transition ${u.isActive ? 'border-amber-305 text-amber-700 bg-amber-50' : 'border-emerald-355 text-emerald-750 bg-emerald-50'
                                                            }`}
                                                    >
                                                        {u.isActive ? 'Block User' : 'Unblock User'}
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-red-500 hover:text-red-650 transition"><FaTrash size={10} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination footer controls */}
                        {usersPagination.totalPages > 1 && (
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <span className="text-slate-400 font-semibold">
                                    Page {usersPagination.currentPage} of {usersPagination.totalPages}
                                </span>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setUserPage(prev => Math.max(prev - 1, 1))}
                                        disabled={userPage === 1}
                                        className="px-3 h-8 rounded-lg font-bold border text-[11px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: usersPagination.totalPages }, (_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setUserPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg font-bold text-[11px] border transition ${userPage === pageNum
                                                    ? 'bg-indigo-650 border-indigo-650 text-white shadow-sm'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setUserPage(prev => Math.min(prev + 1, usersPagination.totalPages))}
                                        disabled={userPage === usersPagination.totalPages}
                                        className="px-3 h-8 rounded-lg font-bold border text-[11px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'campuses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Campus Creator */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 h-fit">
                            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-50 flex items-center gap-1.5"><FaPlusCircle /> Register Campus</h2>
                            <form onSubmit={handleCreateCampus} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Campus Name</label>
                                    <input
                                        type="text"
                                        value={newCampus.campusName}
                                        onChange={(e) => setNewCampus(prev => ({ ...prev, campusName: e.target.value }))}
                                        placeholder="e.g. UNIVERSITY OF OXFORD"
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500 uppercase"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Domain suffix</label>
                                    <input
                                        type="text"
                                        value={newCampus.campusEmailDomain}
                                        onChange={(e) => setNewCampus(prev => ({ ...prev, campusEmailDomain: e.target.value }))}
                                        placeholder="e.g. oxford.ac.uk"
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">City Location</label>
                                    <input
                                        type="text"
                                        value={newCampus.city}
                                        onChange={(e) => setNewCampus(prev => ({ ...prev, city: e.target.value }))}
                                        placeholder="e.g. Oxford"
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Campus Logo URL</label>
                                    <input
                                        type="text"
                                        value={newCampus.campusLogo}
                                        onChange={(e) => setNewCampus(prev => ({ ...prev, campusLogo: e.target.value }))}
                                        placeholder="https://logo-url.png"
                                        className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Short Description</label>
                                    <textarea
                                        rows="2"
                                        value={newCampus.description}
                                        onChange={(e) => setNewCampus(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Brief details..."
                                        className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl p-3 outline-none text-xs focus:border-indigo-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingCampus}
                                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                                >
                                    {submittingCampus ? 'Registering...' : 'Register Campus'}
                                </button>
                            </form>
                        </div>

                        {/* Campus List Table */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm overflow-x-auto">
                            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-3">Campus Directory</h2>
                            {campuses.length === 0 ? (
                                <p className="text-xs text-slate-400 py-6 text-center">No campuses registered</p>
                            ) : (
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Campus Name</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Suffix Domain</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">City</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Verification</th>
                                            <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                                        {campuses.map((c) => (
                                            <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                                <td className="py-3 flex items-center gap-2">
                                                    {c.campusLogo && <img src={c.campusLogo} alt="" className="w-6 h-6 object-contain rounded" />}
                                                    <span className="font-bold text-slate-900 dark:text-slate-50">{c.campusName}</span>
                                                </td>
                                                <td className="py-3 font-semibold text-indigo-650">@{c.campusEmailDomain}</td>
                                                <td className="py-3 text-slate-450">{c.city}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${c.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {c.isApproved ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleToggleCampusApprove(c._id)}
                                                        className={`px-2 py-1 text-[10px] rounded-lg font-bold border transition ${c.isApproved ? 'border-amber-305 text-amber-700 bg-amber-50' : 'border-emerald-300 text-emerald-750 bg-emerald-50'
                                                            }`}
                                                    >
                                                        {c.isApproved ? 'Unapprove' : 'Approve'}
                                                    </button>
                                                    <button onClick={() => handleDeleteCampus(c._id)} className="p-1.5 text-red-500 hover:text-red-600 transition"><FaTrash size={10} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div>
                                    <h2 className="font-bold text-sm text-slate-900 dark:text-slate-50">Admin Notifications</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create system notices or send a message to a specific user.</p>
                                </div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-200">
                                    <FaInbox /> Notification Center
                                </span>
                            </div>

                            <form onSubmit={handleCreateNotification} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Title</label>
                                    <input
                                        value={newNotification.title}
                                        onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                        placeholder="Notification title"
                                        className="w-full h-10 px-3 text-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Message</label>
                                    <input
                                        value={newNotification.message}
                                        onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                        placeholder="Write your notification message"
                                        className="w-full h-10 px-3 text-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Recipient</label>
                                    <select
                                        value={newNotification.recipientId}
                                        onChange={(e) => setNewNotification({ ...newNotification, recipientId: e.target.value, all: false })}
                                        className="w-full h-10 px-3 text-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                                    >
                                        <option value="">All Users</option>
                                        {usersPagination.users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.firstname} {user.lastname} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    <label className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <input
                                            type="checkbox"
                                            checked={newNotification.all}
                                            onChange={(e) => setNewNotification({ ...newNotification, all: e.target.checked, recipientId: '' })}
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                                        />
                                        Send to all users
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={submittingNotification}
                                        className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-semibold transition"
                                    >
                                        {submittingNotification ? 'Sending…' : 'Send Notification'}
                                    </button>
                                </div>
                            </form>

                            {notifications.length === 0 ? (
                                <div className="text-center py-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No notifications created yet.</p>
                                    <p className="text-xs text-slate-400 mt-2">Send a notification to keep students and sellers informed.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map((note) => (
                                        <div key={note._id} className="border border-slate-200 dark:border-slate-800 rounded-3xl p-4 bg-white dark:bg-slate-900">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{note.title}</h3>
                                                    <p className="text-[11px] text-slate-400">{new Date(note.createdAt).toLocaleString()}</p>
                                                </div>
                                                <span className="text-[11px] inline-flex items-center rounded-full px-2.5 py-1 font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                                                    {note.all ? 'All Users' : note.recipient?.email || 'Admin Alert'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{note.message}</p>
                                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">Type: {note.type || 'admin'}</span>
                                                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">Status: {note.isRead ? 'Read' : 'Unread'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'queries' && (
                    queries.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
                            <FaInbox className="mx-auto text-3xl text-slate-350 mb-3" />
                            <h3 className="font-extrabold text-slate-900 dark:text-slate-550 text-sm">No queries found</h3>
                            <p className="text-xs text-slate-400 mt-1">There are no support queries submitted by users.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
                                <h2 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-4">User Support & Product Queries</h2>
                                <div className="space-y-4">
                                    {queries.map((q) => (
                                        <div key={q._id} className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                                <div>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${q.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                        q.status === 'Viewed' ? 'bg-blue-100 text-blue-700' :
                                                            q.status === 'Working on query' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
                                                                'bg-indigo-100 text-indigo-700'
                                                        }`}>
                                                        {q.status}
                                                    </span>
                                                    <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm mt-1">{q.subject}</h3>
                                                    <p className="text-[10px] text-slate-400">Submitted: {new Date(q.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {q.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handleMarkViewed(q._id)}
                                                            className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                                        >
                                                            Mark as Viewed
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-xs space-y-2">
                                                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <p className="font-semibold text-slate-550 dark:text-slate-400 mb-1">User Message:</p>
                                                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{q.message}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                                        <p className="font-semibold text-slate-550 dark:text-slate-400 mb-1">Raised By User:</p>
                                                        <p className="text-slate-900 dark:text-slate-100 font-bold">{q.user?.firstname} {q.user?.lastname}</p>
                                                        <p className="text-slate-450">{q.user?.email}</p>
                                                    </div>

                                                    {q.order && (
                                                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                                            <p className="font-semibold text-red-500 mb-1">Product/Order Query Details:</p>
                                                            <p className="text-slate-900 dark:text-slate-100"><span className="font-semibold text-slate-400">Item:</span> {q.order.item?.title || 'Deleted Item'}</p>
                                                            <p className="text-slate-450"><span className="font-semibold text-slate-400">Order ID:</span> {q.order._id}</p>
                                                            {q.seller && (
                                                                <p className="text-slate-450"><span className="font-semibold text-slate-400">Seller:</span> {q.seller.firstname} {q.seller.lastname} ({q.seller.email})</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {q.adminResponse ? (
                                                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 text-xs">
                                                    <p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">🛡️ Admin Response Sent:</p>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-indigo-100/30">
                                                        "{q.adminResponse}"
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="pt-2">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Send Admin Response & Update Status</p>
                                                    <ReplyForm queryId={q._id} onSend={handleSendReply} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default AdminDashBoard