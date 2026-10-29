import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'
import { FaShoppingBag, FaBell, FaSignOutAlt, FaUserCircle, FaTimes } from 'react-icons/fa'
import axios from 'axios'

function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeCoupons, setActiveCoupons] = useState([])
  const [couponBarDismissed, setCouponBarDismissed] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([])
      setActiveCoupons([])
      return
    }
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('https://individual-final-project-mern-stack.onrender.com/user-api/notifications', { withCredentials: true })
        setNotifications(res.data.payload || [])
      } catch (err) {
        console.error('Error fetching notifications for header:', err)
      }
    }
    const fetchCoupons = async () => {
      try {
        const res = await axios.get('https://individual-final-project-mern-stack.onrender.com/user-api/active-coupons', { withCredentials: true })
        setActiveCoupons(res.data.payload || [])
      } catch (err) {
        console.error('Error fetching active coupons for header:', err)
      }
    }
    fetchNotifications()
    fetchCoupons()
  }, [isAuthenticated])

  const unreadCount = notifications.filter(note => !note.read).length

  const markNotificationRead = async (id) => {
    try {
      await axios.patch(`https://individual-final-project-mern-stack.onrender.com/user-api/notifications/${id}/read`, {}, { withCredentials: true })
      setNotifications(prev => prev.map(note => note._id === id ? { ...note, read: true } : note))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const onLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      {isAuthenticated && activeCoupons.length > 0 && !couponBarDismissed && (
        <div className="flex items-center justify-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-950">
          <span>🎉 Use code <strong>{activeCoupons[0].code}</strong> for {activeCoupons[0].discountPercentage}% off{activeCoupons[0].category !== 'ALL' ? ` on ${activeCoupons[0].category}` : ''}{activeCoupons[0].minPrice > 0 ? ` orders above ₹${activeCoupons[0].minPrice}` : ''}.</span>
          <button onClick={() => setCouponBarDismissed(true)} aria-label="Dismiss coupon offer" className="rounded p-1 text-amber-800 hover:bg-amber-100"><FaTimes /></button>
        </div>
      )}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2.5 rounded-lg" aria-label="CampusKart home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm"><FaShoppingBag /></span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">CampusKart</span>
          </button>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <button type="button" onClick={() => setNotificationOpen(prev => !prev)} className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700" aria-label="View notifications">
                  <FaBell size={17} />
                  {unreadCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{unreadCount}</span>}
                </button>
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 max-h-96 w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</h2>
                      <button type="button" onClick={() => setNotificationOpen(false)} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close notifications"><FaTimes /></button>
                    </div>
                    {notifications.length === 0 ? <p className="text-sm text-slate-500">No notifications yet.</p> : (
                      <ul className="space-y-2">
                        {notifications.slice(0, 6).map(note => (
                          <li key={note._id} className={`rounded-xl border p-3 ${note.read ? 'border-slate-200 bg-slate-50' : 'border-indigo-200 bg-indigo-50'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div><p className="text-sm font-bold text-slate-900">{note.title}</p><p className="mt-1 whitespace-pre-wrap text-xs text-slate-600">{note.message}</p></div>
                              {!note.read && <button type="button" onClick={() => markNotificationRead(note._id)} className="shrink-0 text-xs font-bold text-indigo-700">Mark read</button>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => navigate('/profile')} className="flex items-center gap-2 rounded-full p-1 transition hover:bg-slate-100" aria-label="Open profile" title="Profile">
                {currentUser?.profileImageUrl ? <img src={currentUser.profileImageUrl} alt="" className="h-9 w-9 rounded-full border border-slate-200 object-cover" /> : <FaUserCircle className="h-8 w-8 text-slate-400" />}
              </button>
              <button type="button" onClick={onLogout} aria-label="Log out" title="Log out" className="rounded-full p-2.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"><FaSignOutAlt size={17} /></button>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header
