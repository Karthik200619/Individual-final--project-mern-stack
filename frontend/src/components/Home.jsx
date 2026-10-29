import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { FaRocket, FaShieldAlt, FaMapMarkedAlt, FaArrowRight, FaPlay, FaUsers, FaLeaf, FaBolt, FaShoppingBag } from 'react-icons/fa'

function Home() {
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showVideo, setShowVideo] = useState(false)

    useEffect(() => {
        const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
        const updateVideoPreference = () => setShowVideo(media.matches)
        updateVideoPreference()
        media.addEventListener?.('change', updateVideoPreference)
        return () => media.removeEventListener?.('change', updateVideoPreference)
    }, [])

    const slides = [
        {
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
            title: "List items in seconds",
            desc: "Snap a photo, add a price, and get discovered by thousands on campus."
        },
        {
            img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
            title: "AI-Powered Intelligent Search",
            desc: "Tell our AI what you need and watch it dynamically match products."
        },
        {
            img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
            title: "Eco-friendly Campus Life",
            desc: "Recycle textbooks, laptops, dorm gear and promote a circular campus economy."
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
            {/* Full-page landing background: video stays behind every landing section while scrolling. */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85')" }} />
            {showVideo && (
                <video className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85" aria-hidden="true">
                    <source src="https://videos.pexels.com/video-files/5198157/5198157-hd_1920_1080_25fps.mp4" type="video/mp4" />
                </video>
            )}
            <div className="pointer-events-none fixed inset-0 z-0 bg-slate-950/65" />
            <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-indigo-950/65 via-slate-950/45 to-fuchsia-950/45" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
                <div className="mb-5 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/25 px-4 py-2.5 backdrop-blur-xl transition hover:bg-white/10" aria-label="CampusKart home">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg"><FaShoppingBag /></span>
                        <span className="text-lg font-black tracking-tight text-white">CampusKart</span>
                    </button>
                    <span className="hidden rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-xl sm:inline-flex">Made for student life</span>
                </div>
            
            {/* Cinematic landing hero: video is only mounted on medium/large screens. */}
            <section className="campuskart-hero relative isolate mb-16 md:mb-20 min-h-[570px] md:min-h-[650px] overflow-hidden rounded-[2rem] border border-white/15 bg-black/15 text-white shadow-2xl shadow-indigo-950/20 backdrop-blur-[2px]">
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-indigo-950/30" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/15" />
                <div className="absolute -right-24 -top-24 z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute bottom-10 right-10 z-10 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />

                <div className="relative z-20 flex min-h-[570px] md:min-h-[650px] flex-col justify-center px-6 py-12 sm:px-10 md:px-16 lg:px-20">
                    <div className="mb-7 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-lg backdrop-blur-xl">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> THE CAMPUS MARKETPLACE, REIMAGINED
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-200 backdrop-blur-xl">
                            <FaBolt className="text-amber-300" /> Made for student life
                        </span>
                    </div>
                    <h1 className="campuskart-hero-title max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-7xl lg:text-[5.2rem]">
                        Your campus.<br />
                        <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">Your community.</span><br />
                        <span className="text-white">Better finds.</span>
                    </h1>
                    <p className="mt-7 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg md:text-xl md:leading-8">
                        Buy what you need. Give good things a second life. Meet the people behind every deal — all within your campus community.
                    </p>
                    <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <button onClick={() => navigate('/register')} className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
                            Join CampusKart <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                        <button onClick={() => navigate('/login')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30">
                            <FaPlay className="text-[10px]" /> Sign in to explore
                        </button>
                    </div>
                    <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3.5 backdrop-blur-xl transition duration-300 hover:bg-white/10">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/20 text-indigo-200"><FaUsers /></span>
                            <span><strong className="block text-sm font-extrabold">Student-first</strong><span className="text-xs text-slate-300">Built for your campus</span></span>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3.5 backdrop-blur-xl transition duration-300 hover:bg-white/10">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><FaShieldAlt /></span>
                            <span><strong className="block text-sm font-extrabold">Peer-to-peer</strong><span className="text-xs text-slate-300">Connect directly</span></span>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3.5 backdrop-blur-xl transition duration-300 hover:bg-white/10">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-400/20 text-teal-200"><FaLeaf /></span>
                            <span><strong className="block text-sm font-extrabold">Reuse more</strong><span className="text-xs text-slate-300">Waste less together</span></span>
                        </div>
                    </div>
                    <p className="mt-6 text-[11px] font-medium tracking-wide text-slate-300/80">A marketplace that feels a little closer to home.</p>
                </div>
                <div className="pointer-events-none absolute right-7 top-7 z-20 hidden items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-lg lg:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Campus life in motion
                </div>
            </section>

            {/* Premium Image Carousel */}
            <div className="campuskart-carousel mb-20 max-w-5xl mx-auto relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="relative h-[250px] md:h-[450px] w-full bg-slate-900">
                    <img
                        src={slides[currentSlide].img}
                        alt=""
                        className="w-full h-full object-cover transition-all duration-1000 transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-12">
                        <h3 className="text-xl md:text-3xl font-black text-white mb-2">{slides[currentSlide].title}</h3>
                        <p className="text-xs md:text-sm text-slate-250 max-w-md leading-relaxed">{slides[currentSlide].desc}</p>
                    </div>
                </div>
                {/* Dots indicator */}
                <div className="absolute bottom-6 right-6 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                currentSlide === i ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* How it Works / Features */}
            <div className="campuskart-feature-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-5">
                        <FaRocket />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Fast & Free Listings</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        List books, electronics, or college gear in under 2 minutes. No hidden service charges or platform fee. It's completely free!
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl mb-5">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Campus Verified Only</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Only users registered with official campus email domains can buy or sell, keeping the community absolutely safe and trustworthy.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl mb-5">
                        <FaMapMarkedAlt />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Campus Pick-up Hubs</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Coordinate handoffs at designated locations on campus (Libraries, Cafeterias, Quad) for smooth, instant face-to-face handoffs.
                    </p>
                </div>

            </div>
            </div>
        </div>
    )
}

export default Home