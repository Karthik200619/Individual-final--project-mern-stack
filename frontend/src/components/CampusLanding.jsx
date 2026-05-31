import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'
import { FaMapMarkerAlt, FaUniversity, FaArrowLeft, FaGraduationCap, FaChevronRight } from 'react-icons/fa'

function CampusLanding() {
    const { campusId } = useParams()
    const navigate = useNavigate()
    const [campus, setCampus] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCampusDetails = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`http://localhost:5000/user-api/campus/${campusId}`)
                setCampus(res.data.campus)
                setItems(res.data.items || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchCampusDetails()
    }, [campusId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
                <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            </div>
        )
    }

    if (!campus) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                <p className="text-sm font-semibold text-red-500 mb-4">Campus not found</p>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                    Go Home
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 pb-16">
            
            {/* Header Hero Banner */}
            <div className="relative py-12 md:py-20 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <button 
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition mb-6 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm"
                    >
                        <FaArrowLeft /> Back to Main
                    </button>

                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        {campus.campusLogo ? (
                            <img 
                                src={campus.campusLogo} 
                                alt={campus.campusName} 
                                className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white p-3 rounded-3xl shadow-xl border border-white/10"
                            />
                        ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 text-white flex items-center justify-center text-4xl rounded-3xl font-extrabold shadow-xl">
                                {campus.campusName.substring(0, 2)}
                            </div>
                        )}

                        <div className="text-center md:text-left space-y-2 flex-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                                <FaUniversity /> Campus Hub
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase">
                                {campus.campusName}
                            </h1>
                            <p className="text-xs md:text-sm text-indigo-200 flex items-center justify-center md:justify-start gap-1">
                                <FaMapMarkerAlt /> {campus.city} | Email suffix: @{campus.campusEmailDomain}
                            </p>
                            {campus.description && (
                                <p className="text-xs text-slate-350 max-w-2xl mt-2 leading-relaxed">
                                    {campus.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left side: Handoff spots & Auth CTA */}
                <div className="space-y-6">
                    {/* Delivery Spots */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                        <h3 className="font-extrabold text-xs text-slate-500 dark:text-slate-450 uppercase tracking-wider">📦 Delivery Handoff Locations</h3>
                        {campus.preferredDeliveryLocations?.length === 0 ? (
                            <p className="text-xs text-slate-400">Default Campus Quad hubs supported.</p>
                        ) : (
                            <div className="space-y-3">
                                {campus.preferredDeliveryLocations?.map((loc, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1.5">
                                        <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">{loc.locationName}</span>
                                        <div className="flex flex-wrap gap-1">
                                            {loc.categorySupport?.map((cat, i) => (
                                                <span key={i} className="text-[8px] font-extrabold tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Join/Login Banner */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-3xl shadow-md space-y-4 relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 text-8xl opacity-10">🎓</div>
                        <h3 className="font-extrabold text-lg leading-tight">Trade inside your campus safely!</h3>
                        <p className="text-xs text-indigo-100 leading-relaxed">
                            Sign up with your campus email address (@{campus.campusEmailDomain}) to purchase books, electronics, and dorm gear from classmates.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={() => navigate(`/register?campus=${campus._id}`)}
                                className="flex-1 h-10 rounded-xl bg-white text-indigo-600 text-xs font-bold hover:bg-slate-100 active:scale-95 transition"
                            >
                                Register Now
                            </button>
                            <button 
                                onClick={() => navigate('/login')}
                                className="flex-1 h-10 rounded-xl bg-indigo-700/40 border border-white/20 text-white text-xs font-bold hover:bg-indigo-700/60 active:scale-95 transition"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: Campus Listings Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                            🛍️ Marketplace Deals ({items.length})
                        </h2>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                            <span className="block text-3xl mb-2">🛍️</span>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">No products available</h3>
                            <p className="text-xs text-slate-500 mt-1">Be the first to list a product in this campus community!</p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                            >
                                Login to Start Selling
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {items.map(item => (
                                <div 
                                    key={item._id}
                                    onClick={() => navigate(`/item/${item._id}`)}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md cursor-pointer transition flex flex-col h-full group"
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
                                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <span className="absolute top-2 left-2 text-[8px] font-extrabold tracking-wider bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full uppercase">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className="font-bold text-xs text-slate-900 dark:text-slate-50 line-clamp-1 group-hover:text-indigo-500 transition">{item.title}</h3>
                                                <span className="text-xs font-extrabold text-indigo-500">₹{item.price}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] text-slate-400 mt-3 pt-2 border-t">
                                            <span>Qty: {item.quantity}</span>
                                            <span className="flex items-center gap-1 text-indigo-500 font-bold">
                                                Buy Deal <FaChevronRight size={7} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CampusLanding
