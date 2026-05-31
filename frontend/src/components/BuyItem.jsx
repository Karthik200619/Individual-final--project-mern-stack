import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router'
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaTruck,
    FaTag,
    FaSpinner
} from 'react-icons/fa'

function BuyItem() {
    const { itemId } = useParams()
    const navigate = useNavigate()

    const [item, setItem] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [deliveryType, setDeliveryType] = useState('pickup')
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [meetupLocation, setMeetupLocation] = useState('')
    const [deliveryInstructions, setDeliveryInstructions] = useState('')
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(false)

    // Coupon / Discount states
    const [couponCode, setCouponCode] = useState('')
    const [discountPercentage, setDiscountPercentage] = useState(0)
    const [couponApplied, setCouponApplied] = useState(false)
    const [applyingCoupon, setApplyingCoupon] = useState(false)

    useEffect(() => {
        // Read quantity from query parameter if it exists
        const queryParams = new URLSearchParams(window.location.search)
        const qtyParam = queryParams.get('quantity')
        if (qtyParam) {
            setQuantity(Number(qtyParam))
        }

        const getItem = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/user-api/item/${itemId}`,
                    {
                        withCredentials: true
                    }
                )
                setItem(res.data.payload)

                // filter locations based on category
                const preferredLocations = res.data.payload.seller.campus.preferredDeliveryLocations.filter(
                    loc => loc.categorySupport.includes(res.data.payload.category)
                )

                setLocations(preferredLocations)

                if (preferredLocations.length > 0) {
                    setMeetupLocation(preferredLocations[0].locationName)
                }
            }
            catch (err) {
                console.log(err)
            }
        }

        getItem()
    }, [itemId])

    const applyCoupon = async () => {
        if (!couponCode.trim()) return
        try {
            setApplyingCoupon(true)
            const res = await axios.post('http://localhost:5000/user-api/discount/apply', {
                code: couponCode,
                itemId: item._id,
                subtotal: item.price * quantity
            }, {
                withCredentials: true
            })
            setDiscountPercentage(res.data.payload.discountPercentage)
            setCouponApplied(true)
            alert(`Coupon applied! ${res.data.payload.discountPercentage}% discount applied.`)
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Invalid coupon code')
            setDiscountPercentage(0)
            setCouponApplied(false)
        } finally {
            setApplyingCoupon(false)
        }
    }

    const placeOrder = async () => {
        try {
            setLoading(true)
            await axios.post(
                `http://localhost:5000/user-api/buyitem/${itemId}`,
                {
                    quantity,
                    deliveryType,
                    meetupLocation,
                    paymentMethod,
                    deliveryInstructions,
                    discountCode: couponApplied ? couponCode.toUpperCase().trim() : undefined
                },
                {
                    withCredentials: true
                }
            )

            // Remove from cart if it was in cart
            try {
                await axios.delete(`http://localhost:5000/user-api/cart/remove/${itemId}`, {
                    withCredentials: true
                })
            } catch (cartErr) {
                // If it wasn't in cart, it will just fail silently which is fine
                console.log('Not in cart or failed removing:', cartErr.message)
            }

            alert('Order placed successfully!')
            navigate('/orders')
        }
        catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to place order')
        }
        finally {
            setLoading(false)
        }
    }

    if (!item) {
        return (
            <div className='min-h-screen flex items-center justify-center dark:bg-slate-950 text-slate-800 dark:text-slate-200'>
                <FaSpinner className="animate-spin text-indigo-650 text-3xl" />
            </div>
        )
    }

    const subtotal = item.price * quantity
    const discountAmount = Math.round((subtotal * discountPercentage) / 100)
    const finalTotal = subtotal - discountAmount

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-12 transition-colors duration-300">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center gap-3">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full transition"
                >
                    <FaArrowLeft className="text-slate-700 dark:text-slate-300" />
                </button>
                <h1 className="font-extrabold text-lg text-slate-900 dark:text-slate-50">
                    Order Checkout
                </h1>
            </div>

            <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
                {/* Item Details Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4">
                    <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full sm:w-28 h-28 rounded-2xl object-cover border"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start gap-2">
                                <h2 className="font-bold text-base text-slate-950 dark:text-slate-550 truncate">
                                    {item.title}
                                </h2>
                                <span className="text-indigo-650 dark:text-indigo-400 font-extrabold text-sm whitespace-nowrap">
                                    ₹{item.price}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                {item.description}
                            </p>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-2">
                            Stock Available: {item.quantity}
                        </p>
                    </div>
                </div>

                {/* Configurations */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                    
                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(item.quantity, Number(e.target.value))))}
                            className="w-full h-11 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-sm focus:border-indigo-500"
                        />
                    </div>

                    {/* Delivery Type */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <FaTruck className="text-indigo-550" /> Delivery Type
                        </label>
                        <select
                            value={deliveryType}
                            onChange={(e) => setDeliveryType(e.target.value)}
                            className="w-full h-11 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-sm focus:border-indigo-500"
                        >
                            <option value="pickup">Self Pickup</option>
                            <option value="campus_delivery">Deliver on Campus</option>
                        </select>
                    </div>

                    {/* Meetup Location */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <FaMapMarkerAlt className="text-indigo-550" /> Meetup Location
                        </label>
                        {locations.length > 0 ? (
                            <select
                                value={meetupLocation}
                                onChange={(e) => setMeetupLocation(e.target.value)}
                                className="w-full h-11 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-sm focus:border-indigo-500"
                            >
                                {locations.map((loc, index) => (
                                    <option key={index} value={loc.locationName}>
                                        {loc.locationName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={meetupLocation}
                                onChange={(e) => setMeetupLocation(e.target.value)}
                                placeholder="Enter coordinate details (e.g. Quad library entrance)"
                                className="w-full h-11 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-sm focus:border-indigo-500"
                                required
                            />
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <FaMoneyBillWave className="text-indigo-550" /> Payment Method
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full h-11 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-sm focus:border-indigo-500"
                        >
                            <option value="cash">Cash on Meetup</option>
                            <option value="upi">UPI Transfer</option>
                        </select>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions for meetup/delivery</label>
                        <textarea
                            rows="3"
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl p-3 outline-none text-sm focus:border-indigo-500"
                            placeholder="e.g., I'll be wearing a red jacket, see you by 4 PM..."
                        />
                    </div>
                </div>

                {/* Coupon Code Panel */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <FaTag className="text-indigo-550" /> Apply Coupon
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="e.g. CAMPUS20"
                            className="flex-1 h-11 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-sm focus:border-indigo-500 uppercase"
                            disabled={couponApplied}
                        />
                        {couponApplied ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setCouponApplied(false)
                                    setDiscountPercentage(0)
                                    setCouponCode('')
                                }}
                                className="h-11 px-4 bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-650 text-xs font-bold rounded-xl transition"
                            >
                                Remove
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={applyCoupon}
                                disabled={applyingCoupon || !couponCode.trim()}
                                className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400"
                            >
                                Apply
                            </button>
                        )}
                    </div>
                </div>

                {/* Total Invoice Details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Items Subtotal:</span>
                        <span>₹{subtotal}</span>
                    </div>
                    {couponApplied && (
                        <div className="flex justify-between text-xs text-emerald-500">
                            <span>Discount ({discountPercentage}%):</span>
                            <span>-₹{discountAmount}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-850">
                        <span className="font-extrabold text-base">Amount Payable:</span>
                        <span className="text-indigo-650 dark:text-indigo-450 font-black text-xl">₹{finalTotal}</span>
                    </div>
                </div>

                {/* Purchase Action Trigger */}
                <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center transition shadow-md disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <FaSpinner className="animate-spin text-white" />
                            Placing Order...
                        </div>
                    ) : (
                        'Confirm Purchase Order'
                    )}
                </button>
            </div>
        </div>
    )
}

export default BuyItem