import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { FaRocket, FaShieldAlt, FaMapMarkedAlt, FaArrowRight } from 'react-icons/fa'

function Home() {
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)

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
        <div className="py-8 md:py-16 px-4 max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-float">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4 border border-indigo-100">
                  ✨ The ultimate campus marketplace
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight leading-none mb-6">
                    Buy & Sell Within Your <br/>
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Campus Community</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
                    Discover amazing deals from peers, list items in under 2 minutes, and meet up securely at campus delivery spots. Fast, safe, and built exclusively for students.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full sm:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition duration-300 flex items-center justify-center gap-2 group"
                    >
                        Create Account <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-indigo-600 hover:border-indigo-200 transition duration-300 font-medium flex items-center justify-center"
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {/* Premium Image Carousel */}
            <div className="mb-20 max-w-5xl mx-auto relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
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
    )
}

export default Home