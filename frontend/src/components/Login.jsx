import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { FaLock, FaEnvelope, FaShoppingBag, FaArrowRight } from 'react-icons/fa'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { handleSubmit, register } = useForm()

  const onceDone = async (data) => {
    try {
      const user = await login(data);
      if (user.role === "ADMIN") {
        navigate("/admindashboard");
      }
      else {
        navigate("/userhome");
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-[80vh] flex rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 shadow-xl max-w-5xl mx-auto my-4 md:my-8">

      {/* Left Info Pane (Visible on Medium screens and up) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-600 to-purple-600 p-12 flex-col justify-between text-white relative overflow-hidden">

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-xl mb-6">
            <FaShoppingBag />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
            Safe, Simple & <br />Campus Verified
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed max-w-sm">
            Access great student deals, recycle dorm gear, and trade securely with verified peers from your university.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6">
          <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-indigo-200 uppercase mb-3">
            ✨ Powered by Google Gemini AI
          </div>
          <p className="text-xs text-indigo-100/80 leading-normal max-w-xs">
            Describe what you need in natural language and let our AI semantic search match items instantly.
          </p>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center !bg-white dark:!bg-slate-900">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center text-xl mb-4">
          🔐
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Welcome back</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-8">
          Sign in to your campus marketplace account
        </p>

        <form onSubmit={handleSubmit(onceDone)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <FaEnvelope size={13} />
              </span>
              <input
                type="email"
                placeholder="you@college.edu"
                {...register('email')}
                className="w-full h-11 pl-10 pr-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
              <span
                onClick={() => navigate('/forgotpassword')}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 cursor-pointer transition"
              >
                Forgot?
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <FaLock size={13} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full h-11 pl-10 pr-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition duration-300 transform active:scale-95 shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
          >
            Sign In <FaArrowRight size={12} />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-indigo-500 font-semibold cursor-pointer hover:underline"
          >
            Create one here
          </span>
        </p>
      </div>

    </div>
  )
}

export default Login