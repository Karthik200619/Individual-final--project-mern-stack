import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

function Orders() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])

    // Query Modal states
    const [queryModalOpen, setQueryModalOpen] = useState(false)
    const [selectedOrderForQuery, setSelectedOrderForQuery] = useState(null)
    const [querySubject, setQuerySubject] = useState('')
    const [queryMessage, setQueryMessage] = useState('')
    const [submittingQuery, setSubmittingQuery] = useState(false)

    useEffect(() => {
        const getOrders = async () => {
            try {
                const res = await axios.get(
                    'https://individual-final-project-mern-stack.onrender.com/user-api/myorders',
                    {
                        withCredentials: true
                    }
                )
                setOrders(res.data.payload)
            } catch (err) {
                console.log(err)
            }
        }
        getOrders()
    }, [])

    const handleOpenQueryModal = (order) => {
        setSelectedOrderForQuery(order)
        setQuerySubject(`Issue with Order for "${order.item?.title}"`)
        setQueryMessage('')
        setQueryModalOpen(true)
    }

    const handleRaiseQuery = async (e) => {
        e.preventDefault()
        if (!querySubject.trim() || !queryMessage.trim()) {
            alert('Please fill in all fields.')
            return
        }
        try {
            setSubmittingQuery(true)
            await axios.post(
                `https://individual-final-project-mern-stack.onrender.com/user-api/help-queries/order/${selectedOrderForQuery._id}`,
                {
                    subject: querySubject.trim(),
                    message: queryMessage.trim()
                },
                { withCredentials: true }
            )
            alert('Your query has been raised successfully. The seller and admin can view it.')
            setQueryModalOpen(false)
            setQuerySubject('')
            setQueryMessage('')
            setSelectedOrderForQuery(null)
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to raise query.')
        } finally {
            setSubmittingQuery(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-100 p-4'>
            <h1 className='text-2xl font-bold mb-5'>
                My Orders
            </h1>

            <div className='space-y-4'>
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className='bg-white rounded-2xl p-4 shadow-sm'
                    >
                        <div className='flex gap-4'>
                            <img
                                src={order.item?.coverImage}
                                alt=''
                                className='w-24 h-24 rounded-xl object-cover'
                            />

                            <div className='flex-1'>
                                <div className='flex justify-between'>
                                    <h2 className='font-semibold'>
                                        {order.item?.title}
                                    </h2>
                                    <span className='text-indigo-600 font-semibold'>
                                        ₹{order?.totalPrice}
                                    </span>
                                </div>

                                <p className='text-sm text-gray-500 mt-2'>
                                    Quantity: {order.quantity}
                                </p>
                                <p className='text-sm text-gray-500 mt-1'>
                                    Payment: {order.paymentMethod}
                                </p>

                                <div className='mt-3'>
                                    <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs capitalize'>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-3 mt-4'>
                            {order.delivery && (
                                <button
                                    onClick={() => navigate(`/delivery/${order.delivery?._id || order.delivery}`)}
                                    className='flex-1 h-10 rounded-xl border border-indigo-600 text-indigo-600 text-xs font-semibold hover:bg-indigo-50 transition'
                                >
                                    Track Delivery
                                </button>
                            )}
                            <button
                                onClick={() => handleOpenQueryModal(order)}
                                className='flex-1 h-10 rounded-xl border border-red-500 text-red-500 text-xs font-semibold hover:bg-red-50 transition'
                            >
                                Raise Query
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Query Modal */}
            {queryModalOpen && selectedOrderForQuery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">Raise Support Query / Dispute</h2>
                        <p className="text-xs text-slate-500">This query will be visible to the seller (classmate) and the site administration to help resolve issues.</p>
                        
                        <form onSubmit={handleRaiseQuery} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={querySubject}
                                    onChange={(e) => setQuerySubject(e.target.value)}
                                    className="w-full h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-3 outline-none text-xs focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Message Description</label>
                                <textarea
                                    value={queryMessage}
                                    onChange={(e) => setQueryMessage(e.target.value)}
                                    placeholder="Explain the issue with delivery, condition, payment or meetup details..."
                                    rows="4"
                                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl p-3 outline-none text-xs focus:border-indigo-500 resize-none"
                                    required
                                />
                            </div>
                            
                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setQueryModalOpen(false)}
                                    className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingQuery}
                                    className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                                >
                                    {submittingQuery ? 'Submitting...' : 'Submit Query'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Orders