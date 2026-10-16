import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import ToastViewport from './ToastViewport'
import { useAuth } from '../store/authStore'
import { FaHome, FaSearch, FaPlusCircle, FaBoxOpen, FaShoppingCart, FaComments, FaTruck, FaQuestionCircle, FaCompass } from 'react-icons/fa'

const userNavigation = [
  { to: '/userhome', label: 'Home dashboard', icon: FaHome, end: true },
  { to: '/allproducts', label: 'Explore marketplace', icon: FaCompass },
  { to: '/additem', label: 'Sell an item', icon: FaPlusCircle },
  { to: '/myitems', label: 'My listings', icon: FaBoxOpen },
  { to: '/orders', label: 'My orders', icon: FaShoppingCart },
  { to: '/seller-orders', label: 'Seller orders', icon: FaTruck },
  { to: '/messages', label: 'Messages', icon: FaComments },
  { to: '/help-center', label: 'Help & support', icon: FaQuestionCircle },
]

function RootLayout() {
  const { isAuthenticated, currentUser } = useAuth()
  const location = useLocation()

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const showSidebar = isAuthenticated && currentUser?.role !== 'ADMIN' && !['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {!(location.pathname === '/' && !isAuthenticated) && <Header />}
      <div className="flex-1 w-full max-w-[1600px] mx-auto md:flex md:items-stretch">
        {showSidebar && (
          <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-4 py-6">
            <div className="px-3 mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Your campus</p>
              <h2 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">Marketplace</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Everything you need, close to home.</p>
            </div>
            <nav className="space-y-1.5" aria-label="Main sidebar navigation">
              {userNavigation.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/10'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'}`
                }>
                  <Icon className="shrink-0 text-base" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto pt-8">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/70">
                <p className="text-sm font-bold text-indigo-950 dark:text-white">Student-to-student</p>
                <p className="mt-1 text-xs leading-relaxed text-indigo-900 dark:text-indigo-100">Keep deals friendly. Meet in public campus spots and confirm details in chat.</p>
              </div>
            </div>
          </aside>
        )}
        <main className="min-w-0 flex-1 w-full px-4 md:px-6 py-4 md:py-8">
          <Outlet />
        </main>
      </div>
      <Footer />
      <ToastViewport />
    </div>
  )
}

export default RootLayout
