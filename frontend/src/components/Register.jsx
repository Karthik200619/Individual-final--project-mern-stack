import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import axios from 'axios'

function Register() {
  const { registeruser } = useAuth()
  const navigate = useNavigate()
  const { handleSubmit, register } = useForm()
  const [campuses, setCampuses] = useState([])
  const onDone = async (data) => {
    try {

      const res = await registeruser(data)

      if (res) {

        navigate('/verifyotp', {
          state: {
            email: data.email,
            purpose: 'REGISTER'
          }
        })

      }

    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {

    const getCampuses = async () => {

      try {

        const res = await axios.get(
          'https://individual-final-project-mern-stack.onrender.com/user-api/campuses'
        )

        setCampuses(res.data.payload)

      }
      catch (err) {

        console.log(err)

      }

    }

    getCampuses()

  }, [])

  return (
    <div className="min-h-[85vh] flex rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 !bg-white dark:!bg-slate-900 shadow-xl max-w-5xl mx-auto my-4 md:my-8">

      {/* Left Info Pane (Visible on Medium screens and up) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-600 to-purple-600 p-12 flex-col justify-between text-white relative overflow-hidden">

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-xl mb-6 animate-float">
            👤
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
            Join the Campus <br />Buy & Sell Network
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed max-w-sm">
            Unlock exclusive student deals, connect directly with classmates, and participate in a circular campus economy.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6">
          <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-indigo-200 uppercase mb-3">
            🎓 Campus Verified Security
          </div>
          <p className="text-xs text-indigo-100/80 leading-normal max-w-xs">
            We enforce registration using official college email domains to keep exchanges safe, reliable, and completely localized.
          </p>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center !bg-white dark:!bg-slate-900 overflow-y-auto max-h-[85vh] scrollbar-thin">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center text-xl mb-4">
          👋
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Create account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
          Register with your campus email to get started
        </p>

        <form onSubmit={handleSubmit(onDone)} encType="multipart/form-data" className="space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">First name</label>
              <input
                type="text"
                placeholder="Arjun"
                {...register('firstname')}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Last name</label>
              <input
                type="text"
                placeholder="Kumar"
                {...register('lastname')}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Email address</label>
            <input
              type="email"
              placeholder="you@college.edu"
              {...register('email')}
              className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Phone number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                {...register('phoneNo')}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Gender</label>
              <div className="flex gap-2">
                {['MALE', 'FEMALE'].map((g) => (
                  <label key={g}
                    className="flex-1 flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 cursor-pointer text-xs text-slate-500 dark:text-slate-400 has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-950/20 has-[:checked]:text-indigo-600 transition"
                  >
                    <input type="radio" value={g} {...register('gender')} className="accent-indigo-600" required />
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Campus</label>
              <select
                {...register('campus')}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                required
              >
                {campuses.map((campus) => (
                  <option key={campus._id} value={campus._id}>
                    {campus.campusName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Profile photo</label>
            <label className="flex flex-col items-center gap-1 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition">
              <span className="text-lg">☁️</span>
              <span className="text-[11px] text-gray-400">
                <span className="text-indigo-500 font-semibold">Click to upload</span> or drag
              </span>
              <input type="file" {...register('profileImageUrl')} className="hidden" required />
            </label>
          </div>

          <button type="submit"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 dark:shadow-none transition duration-300 transform active:scale-95">
            Create account
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-indigo-500 font-semibold cursor-pointer hover:underline">
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register