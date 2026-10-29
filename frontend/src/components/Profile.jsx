import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaUserEdit, FaCamera, FaSpinner, FaLock } from 'react-icons/fa'
import { useAuth } from '../store/authStore'
import { showToast } from '../utils/toast'

const API = 'https://individual-final-project-mern-stack.onrender.com/user-api'

function Profile() {
  const { currentUser, setCurrentUser } = useAuth()
  const [form, setForm] = useState({ firstname: '', lastname: '', phoneNo: '' })
  const [profile, setProfile] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    const loadProfile = async () => {
      try {
        const response = await axios.get(`${API}/profile`, { withCredentials: true })
        if (!active) return
        const user = response.data?.payload
        setProfile(user)
        setForm({
          firstname: user?.firstname || '',
          lastname: user?.lastname || '',
          phoneNo: user?.phoneNo == null ? '' : String(user.phoneNo)
        })
        setCurrentUser?.(user)
      } catch (error) {
        showToast(error.response?.data?.message || 'Could not load your profile.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadProfile()
    return () => { active = false }
  }, [setCurrentUser])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const first = form.firstname.trim()
    const last = form.lastname.trim()
    const phone = form.phoneNo.trim()
    if (first.length < 2 || first.length > 30 || last.length < 2 || last.length > 30) {
      showToast('Names must be between 2 and 30 characters.', 'error')
      return
    }
    if (!/^\+?[0-9]{7,15}$/.test(phone)) {
      showToast('Enter a valid phone number (7–15 digits, optional leading +).', 'error')
      return
    }

    const data = new FormData()
    data.append('firstname', first)
    data.append('lastname', last)
    data.append('phoneNo', phone)
    if (photo) data.append('profileImageUrl', photo)

    try {
      setSaving(true)
      const response = await axios.patch(`${API}/profile`, data, { withCredentials: true })
      const user = response.data?.payload
      setProfile(user)
      setCurrentUser?.(user)
      setForm({ firstname: user.firstname || '', lastname: user.lastname || '', phoneNo: String(user.phoneNo ?? '') })
      setPhoto(null)
      showToast('Profile updated successfully.', 'success')
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not save your profile. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-indigo-700 dark:text-indigo-300" role="status"><FaSpinner className="animate-spin text-2xl mr-3" /> Loading profile…</div>
  }

  const displayedProfile = profile || currentUser

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-xl"><FaUserEdit /></span>
          <div>
            <p className="text-sm font-semibold text-indigo-100">Account settings</p>
            <h1 className="text-2xl font-extrabold sm:text-3xl">Edit your profile</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-50">Keep your contact details and profile photo up to date. Your campus identity and login email stay protected.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col items-center text-center">
            {displayedProfile?.profileImageUrl ? (
              <img src={displayedProfile.profileImageUrl} alt="Your profile" className="h-24 w-24 rounded-full border-4 border-indigo-100 object-cover dark:border-indigo-900" />
            ) : (
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-black text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">{form.firstname.charAt(0).toUpperCase() || 'U'}</span>
            )}
            <h2 className="mt-4 text-lg font-extrabold text-slate-950 dark:text-white">{profile ? `${profile.firstname} ${profile.lastname}` : 'Your account'}</h2>
            <p className="mt-1 break-all text-sm text-slate-700 dark:text-slate-300">{displayedProfile?.email || 'Email unavailable'}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"><FaLock /> Campus identity protected</span>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Campus</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{typeof profile?.campus === 'object' ? profile.campus?.campusName : 'Campus account'}</p>
          </div>
        </aside>

        <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <div>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Personal information</h2>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Fields marked editable can be changed and saved.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstname" className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">First name</label>
              <input id="firstname" name="firstname" value={form.firstname} onChange={handleChange} minLength={2} maxLength={30} autoComplete="given-name" required className="profile-field" />
            </div>
            <div>
              <label htmlFor="lastname" className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">Last name</label>
              <input id="lastname" name="lastname" value={form.lastname} onChange={handleChange} minLength={2} maxLength={30} autoComplete="family-name" required className="profile-field" />
            </div>
            <div>
              <label htmlFor="phoneNo" className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">Phone number</label>
              <input id="phoneNo" name="phoneNo" type="tel" inputMode="tel" value={form.phoneNo} onChange={handleChange} autoComplete="tel" placeholder="+91 9876543210" required className="profile-field" />
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">7–15 digits; a leading + is optional.</p>
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">Login email</label>
              <input id="email" value={displayedProfile?.email || ''} readOnly disabled className="profile-field cursor-not-allowed opacity-80" />
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">Email changes require a separate verification flow.</p>
            </div>
          </div>

          <div>
            <label htmlFor="profileImageUrl" className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">Profile photo</label>
            <label htmlFor="profileImageUrl" className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-slate-400 bg-slate-50 p-4 transition hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-950 dark:hover:bg-indigo-950/40">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"><FaCamera /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-900 dark:text-white">{photo?.name || 'Choose a new photo'}</span>
                <span className="block text-xs text-slate-700 dark:text-slate-300">Image files only · maximum 5 MB</span>
              </span>
              <input id="profileImageUrl" type="file" accept="image/*" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => { setForm({ firstname: profile?.firstname || '', lastname: profile?.lastname || '', phoneNo: String(profile?.phoneNo ?? '') }); setPhoto(null) }} className="rounded-xl border border-slate-400 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">Reset changes</button>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500">{saving ? <><FaSpinner className="animate-spin" /> Saving…</> : 'Save profile'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Profile
