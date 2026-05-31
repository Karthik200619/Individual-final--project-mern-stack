import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { FaArrowLeft, FaTrash, FaShoppingBag, FaArrowRight, FaSpinner } from 'react-icons/fa'

function Cart() {
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    const getCart = async () => {
        try {
            setLoading(true)
            const res = await axios.get('http://localhost:5000/user-api/cart', {
                withCredentials: true
            })
            setCartItems(res.data.payload || [])
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    const updateQuantity = async (itemId, newQty) => {
        if (newQty <= 0) {
            handleRemove(itemId)
            return
        }
        try {
            const res = await axios.post('http://localhost:5000/user-api/cart/update', {
                itemId,
                quantity: newQty
            }, {
                withCredentials: true
            })
            // Update state
            setCartItems(res.data.payload)
        } catch (err) {
            console.log(err)
            alert('Failed to update quantity')
        }
    }

    const handleRemove = async (itemId) => {
        try {
            const res = await axios.delete(`http://localhost:5000/user-api/cart/remove/${itemId}`, {
                withCredentials: true
            })
            setCartItems(res.data.payload)
            alert('Item removed from cart')
        } catch (err) {
            console.log(err)
            alert('Failed to remove item')
        }
    }

    const clearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return
        try {
            await axios.delete('http://localhost:5000/user-api/cart/clear', {
                withCredentials: true
            })
            setCartItems([])
            alert('Cart cleared')
        } catch (err) {
            console.log(err)
            alert('Failed to clear cart')
        }
    }

    const calculateTotal = () => {
        return cartItems.reduce((acc, ci) => {
            if (!ci.item) return acc
            return acc + (ci.item.price * ci.quantity)
        }, 0)
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/userhome')} 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    >
                        <FaArrowLeft className="text-slate-700 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">My Shopping Cart</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Review items before meeting sellers</p>
                    </div>
                </div>
                {cartItems.length > 0 && (
                    <button 
                        onClick={clearCart} 
                        className="text-xs font-semibold text-red-500 hover:text-red-600 transition"
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
                </div>
            ) : cartItems.length === 0 ? (
                <div className="text-center py-16 px-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center text-2xl mx-auto mb-4">
                        <FaShoppingBag />
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-lg mb-1">Your cart is empty</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                        Explore listings from other students to find textbooks, electronics, and more!
                    </p>
                    <button
                        onClick={() => navigate('/userhome')}
                        className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition shadow-md shadow-indigo-100 dark:shadow-none"
                    >
                        Browse Marketplace
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-xs font-medium leading-relaxed">
                            💡 <strong>P2P Campus Tip:</strong> Since items belong to different students on campus, checkouts are processed per-item so you can coordinate individual meetup spots with each seller.
                        </div>

                        {cartItems.map((ci) => {
                            if (!ci.item) return null
                            return (
                                <div 
                                    key={ci.item._id} 
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex gap-4 shadow-sm"
                                >
                                    <img 
                                        src={ci.item.coverImage} 
                                        alt={ci.item.title} 
                                        className="w-20 h-20 rounded-xl object-cover border"
                                    />
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                                                    {ci.item.title}
                                                </h3>
                                                <button 
                                                    onClick={() => handleRemove(ci.item._id)}
                                                    className="text-slate-400 hover:text-red-500 transition"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                Category: {ci.item.category}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden h-8 bg-slate-50 dark:bg-slate-950">
                                                <button 
                                                    onClick={() => updateQuantity(ci.item._id, ci.quantity - 1)}
                                                    className="px-2.5 h-full hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition"
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 text-xs font-semibold">{ci.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(ci.item._id, ci.quantity + 1)}
                                                    className="px-2.5 h-full hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <span className="block text-xs text-slate-400">Price</span>
                                                <span className="text-sm font-extrabold text-indigo-500">₹{ci.item.price * ci.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary Section */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-50 uppercase tracking-wider">Cart Summary</h2>
                            
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>Total Items:</span>
                                    <span>{cartItems.reduce((acc, ci) => acc + ci.quantity, 0)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-slate-50">
                                    <span>Subtotal:</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-base">₹{calculateTotal()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Trigger */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
                            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Checkout Listings</h3>
                            {cartItems.map((ci) => {
                                if (!ci.item) return null
                                return (
                                    <button
                                        key={ci.item._id}
                                        onClick={() => navigate(`/buy/${ci.item._id}?quantity=${ci.quantity}`)}
                                        className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-indigo-50/5 dark:hover:bg-indigo-950/10 rounded-xl transition group text-left"
                                    >
                                        <div className="min-w-0 pr-2">
                                            <span className="block text-xs font-bold text-slate-950 dark:text-slate-50 truncate">{ci.item.title}</span>
                                            <span className="text-[10px] text-slate-400">Buy {ci.quantity} for ₹{ci.item.price * ci.quantity}</span>
                                        </div>
                                        <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-lg group-hover:translate-x-0.5 transition">
                                            <FaArrowRight size={10} />
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart
