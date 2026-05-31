import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { FaSun, FaMoon, FaShoppingBag, FaBars, FaTimes, FaBell } from 'react-icons/fa'
import axios from 'axios'

function Header() {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const navigate = useNavigate()

    // Theme state
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    // Coupons state for notification bar
    const [activeCoupons, setActiveCoupons] = useState([])
    const [couponBarDismissed, setCouponBarDismissed] = useState(false)

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([])
            return
        }

        const fetchNotifications = async () => {
            try {
                const res = await axios.get('http://localhost:5000/user-api/notifications', { withCredentials: true })
                setNotifications(res.data.payload || [])
            } catch (err) {
                console.error('Error fetching notifications for header:', err)
            }
        }
        fetchNotifications()
    }, [isAuthenticated])

    const unreadCount = notifications.filter(n => !n.read).length

    const markNotificationRead = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/user-api/notifications/${id}/read`, {}, { withCredentials: true })
            setNotifications(prev => prev.map(note => note._id === id ? { ...note, read: true } : note))
        } catch (err) {
            console.error('Failed to mark notification as read:', err)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            const fetchCoupons = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/user-api/active-coupons', { withCredentials: true })
                    setActiveCoupons(res.data.payload || [])
                } catch (err) {
                    console.error("Error fetching active coupons for header:", err)
                }
            }
            fetchCoupons()
        } else {
            setActiveCoupons([])
        }
    }, [isAuthenticated])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const onlogout = async () => {
        await logout();
        navigate('/');
    }

    const headerarr = !isAuthenticated
        ? [
            { path: '/', label: 'Home' },
            { path: '/login', label: 'Login' },
            { path: '/register', label: 'Register' }
        ]
        : currentUser?.role === "ADMIN"
            ? [
                {
                    path: '/admin-dashboard',
                    label: 'Dashboard'
                }
            ]
            : [
                {
                    path: '/userhome',
                    label: 'Dashboard'
                },
                {
                    path: '/allproducts',
                    label: 'Browse'
                },
                {
                    path: '/additem',
                    label: 'Sell Item'
                },
                {
                    path: '/myitems',
                    label: 'My Listings'
                },
                {
                    path: '/messages',
                    label: 'Messages'
                },
                {
                    path: '/cart',
                    label: 'Cart'
                }
            ];

    return (
        <>
            {activeCoupons.length > 0 && !couponBarDismissed && (
                <div className="bg-linear-to-r from-amber-500 via-orange-500 to-indigo-650 text-white text-xs font-bold px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 relative shadow-sm border-b border-orange-400/20 z-50">
                    <div className="flex-1 flex flex-col sm:flex-row justify-center items-center gap-2 overflow-hidden text-center">
                        <span className="animate-bounce">🎉</span>
                        <span className="tracking-wide truncate">
                            Special Offer: Use code <span className="bg-white/20 dark:bg-black/20 px-2 py-0.5 rounded font-black border border-white/35 uppercase select-all">{activeCoupons[0].code}</span> for <span className="underline">{activeCoupons[0].discountPercentage}% OFF</span>
                            {activeCoupons[0].category !== 'ALL' && ` on ${activeCoupons[0].category}`}
                            {activeCoupons[0].minPrice > 0 && ` (orders above ₹${activeCoupons[0].minPrice})`}!
                        </span>
                    </div>
                    <button 
                        onClick={() => setCouponBarDismissed(true)} 
                        className="text-white hover:text-orange-105 transition text-[10px] font-black"
                        aria-label="Dismiss coupon bar"
                    >
                        ✕
                    </button>
                </div>
            )}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm px-6 py-3 transition-all duration-300">
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-3">

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="sm:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                    </button>

                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">
                            <FaShoppingBag />
                        </span>
                        <span className="hidden sm:inline bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-xl font-extrabold">
                            CampusBuy
                        </span>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                    {headerarr.map((ele) => (
                        <NavLink
                            key={ele.path}
                            to={ele.path}
                            className={({ isActive }) =>
                                `px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300
                                ${isActive
                                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                                }`
                            }
                        >
                            {ele.label}
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setNotificationOpen(prev => !prev)
                                setMobileMenuOpen(false)
                            }}
                            className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            aria-label="View notifications"
                        >
                            <FaBell size={16} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] text-white font-black px-1">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {notificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl p-3 z-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notifications</h2>
                                    <button
                                        type="button"
                                        onClick={() => setNotificationOpen(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        aria-label="Close notifications"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                                {notifications.length === 0 ? (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">No notifications yet.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {notifications.slice(0, 6).map(note => (
                                            <li key={note._id} className={`rounded-2xl p-3 border ${note.read ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900' : 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-800 dark:bg-indigo-950/40'}`}>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">{note.title}</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 whitespace-pre-wrap">{note.message}</p>
                                                    </div>
                                                    {!note.read && (
                                                        <button
                                                            type="button"
                                                            onClick={() => markNotificationRead(note._id)}
                                                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400"
                                                        >
                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition hover:scale-110"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <FaMoon size={14} /> : <FaSun size={14} className="text-yellow-400" />}
                    </button>

                    {isAuthenticated && (
                        <>
                            {currentUser?.profileImageUrl && (
                                <img
                                    src={currentUser.profileImageUrl}
                                    alt="profile"
                                    className="hidden sm:block w-8 h-8 rounded-full border border-indigo-400 object-cover shadow-sm"
                                />
                            )}
                            <span className="hidden md:block text-slate-900 dark:text-slate-100 font-medium text-xs">
                                {currentUser?.firstname}
                            </span>
                            <button
                                onClick={onlogout}
                                className="hidden sm:inline-flex bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 text-xs font-semibold rounded-full hover:bg-red-500 hover:text-white transition duration-300"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="sm:hidden mt-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-lg">
                    <div className="space-y-3">
                        {headerarr.map((ele) => (
                            <NavLink
                                key={ele.path}
                                to={ele.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                                }
                            >
                                {ele.label}
                            </NavLink>
                        ))}
                        <button
                            onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                            className="w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                        >
                            Toggle Theme
                        </button>
                        {isAuthenticated && (
                            <>
                                <button
                                    onClick={() => { onlogout(); setMobileMenuOpen(false); }}
                                    className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-300"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
        </>
    )
}

export default Header