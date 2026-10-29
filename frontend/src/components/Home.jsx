import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { FaRocket, FaShieldAlt, FaMapMarkedAlt, FaArrowRight, FaUsers, FaLeaf, FaShoppingBag } from 'react-icons/fa'

function Home() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', title: 'List items in seconds', desc: 'Snap a photo, add a price, and get discovered by students on your campus.' },
    { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', title: 'Find what you need', desc: 'Discover useful items, great deals, and student-to-student offers.' },
    { img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80', title: 'Reuse more, waste less', desc: 'Give textbooks, electronics, and campus essentials a second life.' }
  ]

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-6 py-14 sm:px-10 md:px-16 md:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold tracking-wide text-indigo-700"><FaShoppingBag /> THE CAMPUS MARKETPLACE</span>
          <h1 className="campuskart-hero-title mt-7 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-7xl">Your campus.<br /><span className="text-indigo-700">Your community.</span><br />Better finds.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Buy what you need, sell what you no longer use, and meet the people behind every deal — all within your campus community.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate('/register')} className="inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700">Join CampusKart <FaArrowRight /></button>
            <button onClick={() => navigate('/login')} className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Sign in</button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><FaUsers className="text-xl text-indigo-600" /><span className="text-sm font-semibold">Built for students</span></div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><FaShieldAlt className="text-xl text-emerald-600" /><span className="text-sm font-semibold">Peer-to-peer deals</span></div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><FaLeaf className="text-xl text-teal-600" /><span className="text-sm font-semibold">Reuse and save</span></div>
          </div>
        </div>
      </section>

      <section className="campuskart-carousel mx-auto my-12 max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-64 w-full bg-slate-100 md:h-[400px]">
          <img src={slides[currentSlide].img} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent p-6 md:p-10">
            <h2 className="text-2xl font-extrabold text-white md:text-3xl">{slides[currentSlide].title}</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-100">{slides[currentSlide].desc}</p>
          </div>
          <div className="absolute bottom-5 right-5 flex gap-2 rounded-full bg-black/25 px-3 py-2">
            {slides.map((slide, i) => <button key={slide.title} onClick={() => setCurrentSlide(i)} aria-label={`Show slide ${i + 1}`} className={`h-2 rounded-full transition-all ${currentSlide === i ? 'w-5 bg-white' : 'w-2 bg-white/60'}`} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 pb-10 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-700"><FaRocket /></span>
          <h2 className="text-lg font-bold text-slate-900">Quick, free listings</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">List books, electronics, and college gear in minutes, with no platform fee.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700"><FaShieldAlt /></span>
          <h2 className="text-lg font-bold text-slate-900">Campus community</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Connect with fellow students and arrange exchanges with confidence.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-700"><FaMapMarkedAlt /></span>
          <h2 className="text-lg font-bold text-slate-900">Easy campus handoffs</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Coordinate pickups at familiar campus locations and keep communication in one place.</p>
        </article>
      </section>
    </div>
  )
}

export default Home
