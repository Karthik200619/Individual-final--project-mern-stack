import React, { useEffect, useState } from 'react'
import axios from 'axios'

function SellerOrders() {
    const [orders, setOrders] = useState([])
    const [activeTab, setActiveTab] = useState('orders') // 'orders' or 'queries'
    const [queries, setQueries] = useState([])
    const [loadingQueries, setLoadingQueries] = useState(false)

    const getSellerOrders = async () => {
        try {
            const res = await axios.get(
                'http://localhost:5000/user-api/sellerorders',
                {
                    withCredentials: true
                }
            )
            setOrders(res.data.payload)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getSellerOrders()
    }, [])

    const getSellerQueries = async () => {
        try {
            setLoadingQueries(true)
            const res = await axios.get('http://localhost:5000/user-api/seller/help-queries', { withCredentials: true })
            setQueries(res.data.payload || [])
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingQueries(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'queries') {
            getSellerQueries()
        }
    }, [activeTab])

    const acceptOrder = async (orderId) => {
        try {
            await axios.patch(
                `http://localhost:5000/user-api/acceptorder/${orderId}`,
                {},
                {
                    withCredentials: true
                }
            )
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId
                        ? { ...order, status: 'accepted' }
                        : order
                )
            )
            alert('Order accepted successfully!')
            getSellerOrders()
        } catch (err) {
            console.log(err)
            alert('Failed to accept order')
        }
    }

    const rejectOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to reject this order?')) return
        try {
            await axios.patch(
                `http://localhost:5000/user-api/rejectorder/${orderId}`,
                {},
                {
                    withCredentials: true
                }
            )
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId
                        ? { ...order, status: 'rejected' }
                        : order
                )
            )
            alert('Order rejected successfully!')
            getSellerOrders()
        } catch (err) {
            console.log(err)
            alert('Failed to reject order')
        }
    }

    const handleUpdateDeliveryStatus = async (deliveryId, status, orderId) => {
        try {
            const res = await axios.patch(
                `http://localhost:5000/user-api/delivery/${deliveryId}/status`,
                { status },
                { withCredentials: true }
            )
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId
                        ? { ...order, delivery: res.data.payload }
                        : order
                )
            )
            alert(`Delivery status updated to ${status.replaceAll('_', ' ')}`)
            getSellerOrders()
        } catch (err) {
            console.log(err)
            alert('Failed to update delivery status')
        }
    }

    const visibleQueries = queries.filter(q => q.order?.item)

    return (
        <div className='min-h-screen bg-gray-100 p-4'>
            <h1 className='text-2xl font-bold mb-5'>
                Seller Orders Control
            </h1>

            {/* Tabs */}
            <div className='flex gap-2 mb-6 border-b pb-2 border-gray-200'>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition
                    ${activeTab === 'orders'
                        ? 'bg-indigo-650 text-white bg-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    Orders Received
                </button>
                <button
                    onClick={() => setActiveTab('queries')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition
                    ${activeTab === 'queries'
                        ? 'bg-indigo-650 text-white bg-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    Buyer Queries / Disputes
                </button>
            </div>

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
                <div className='space-y-4'>
                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-sm">No orders received</h3>
                            <p className="text-xs text-slate-450 mt-1">Items you listed have not received any orders yet.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order._id}
                                className='bg-white rounded-2xl p-4 shadow-sm'
                            >
                                <div className='flex justify-between'>
                                    <div>
                                        <h2 className='font-semibold text-sm md:text-base'>
                                            {order.item?.title || 'Unknown Item'}
                                        </h2>
                                        <p className='text-xs text-gray-500 mt-1'>
                                            Buyer: {order.buyer?.firstname} {order.buyer?.lastname}
                                        </p>
                                        <p className='text-xs text-gray-500 mt-0.5'>
                                            Quantity: {order.quantity}
                                        </p>
                                    </div>
                                    <div>
                                        <span className='text-indigo-600 font-semibold text-sm'>
                                            ₹{order.totalPrice}
                                        </span>
                                    </div>
                                </div>

                                <div className='mt-2.5'>
                                    <span className='px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold capitalize'>
                                        Order Status: {order.status}
                                    </span>
                                </div>

                                {/* Order Action Buttons */}
                                <div className='flex gap-3 mt-4'>
                                    {order.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => acceptOrder(order._id)}
                                                className='flex-1 h-10 rounded-xl bg-indigo-600 text-white font-semibold text-xs transition active:scale-95'
                                            >
                                                Accept Order
                                            </button>
                                            <button
                                                onClick={() => rejectOrder(order._id)}
                                                className='flex-1 h-10 rounded-xl border border-red-500 text-red-500 font-semibold text-xs transition active:scale-95'
                                            >
                                                Reject Order
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Delivery Handoff Status Dropdown (only for accepted orders) */}
                                {(order.status === 'accepted' || order.status === 'completed') && order.delivery && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Update Delivery Status</label>
                                        <select
                                            value={order.delivery.status || 'pending'}
                                            onChange={(e) => handleUpdateDeliveryStatus(order.delivery._id, e.target.value, order._id)}
                                            className="w-full h-10 border border-gray-200 bg-gray-50 text-gray-900 rounded-xl px-3 outline-none text-xs focus:border-indigo-500 font-semibold"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="meetup_confirmed">Meetup Confirmed</option>
                                            <option value="out_for_delivery">Out for Delivery</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Tab: Queries */}
            {activeTab === 'queries' && (
                loadingQueries ? (
                    <div className="text-center py-10 text-slate-400">Loading queries...</div>
                ) : visibleQueries.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm">No active item disputes found</h3>
                        <p className="text-xs text-slate-450 mt-1">Only queries tied to existing item orders are shown here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {visibleQueries.map((q) => (
                            <div key={q._id} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{q.subject}</h3>
                                        <p className="text-[10px] text-slate-450 mt-1">Raised by Buyer: {q.user?.firstname} {q.user?.lastname} ({q.user?.email})</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-250`}>
                                        {q.status}
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border text-xs">
                                    <p className="font-semibold text-slate-700 mb-1">Issue Description:</p>
                                    <p className="text-slate-600 whitespace-pre-wrap">{q.message}</p>
                                </div>
                                {q.order && (
                                    <div className="bg-indigo-50/20 p-3 rounded-xl border border-indigo-100/50 text-[11px] text-slate-500">
                                        Order ID: <span className="font-bold">{q.order._id}</span> | Item: <span className="font-bold">{q.order.item?.title}</span> | Total Price: <span className="font-bold">₹{q.order.totalPrice}</span>
                                    </div>
                                )}
                                {q.adminResponse && (
                                    <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-150 text-xs">
                                        <p className="font-bold text-indigo-700 mb-1">🛡️ Admin Response:</p>
                                        <p className="font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-indigo-100/50">
                                            "{q.adminResponse}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}

export default SellerOrders