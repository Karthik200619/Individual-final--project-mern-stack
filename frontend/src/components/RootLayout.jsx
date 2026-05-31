import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'

function RootLayout() {
  // Apply theme initial class on mount to prevent flash
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300'>

      <Header />

      <main className='flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-8'>
        <Outlet />
      </main>

      <Footer />

    </div>
  )
}

export default RootLayout