import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaSpinner, FaPaperPlane, FaClock, FaEye, FaWrench, FaCheckCircle, FaInbox, FaLifeRing, FaQuestionCircle } from 'react-icons/fa'

function HelpCenter() {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [queries, setQueries] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [formSuccess, setFormSuccess] = useState('')
    const [formError, setFormError] = useState('')
    const [selectedQuery, setSelectedQuery] = useState(null)

    const fetchQueries = async () => {
        try {
            const res = await axios.get('http://localhost:5000/user-api/help-queries', { withCredentials: true })
            setQueries(res.data.payload || [])
        } catch (err) {
            console.log(err)
        }
    }

    const loadData = async () => {
        try {
            setLoading(true)
            await fetchQueries()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!subject.trim() || !message.trim()) {
            setFormError('Please fill in all fields.')
            return
        }

        try {
            setSubmitting(true)
            setFormError('')
            setFormSuccess('')
            
            await axios.post('http://localhost:5000/user-api/help-queries', {
                subject: subject.trim(),
                message: message.trim()
            }, { withCredentials: true })

            setFormSuccess('Your query has been submitted successfully. Admin has been notified and a confirmation email has been sent to you!')
            setSubject('')
            setMessage('')
            await fetchQueries()
        } catch (err) {
            console.log(err)
            setFormError(err.response?.data?.message || 'Failed to submit query. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
                        <FaClock className="text-[10px]" /> Pending
                    </span>
                )
            case 'Viewed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30">
                        <FaEye className="text-[10px]" /> Viewed
                    </span>
                )
            case 'Working on query':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 animate-pulse">
                        <FaWrench className="text-[10px]" /> Working on Query
                    </span>
                )
            case 'Resolved':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/30">
                        <FaCheckCircle className="text-[10px]" /> Resolved
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 dark:bg-slate-900 text-slate-650 border border-slate-200 dark:border-slate-800">
                        {status}
                    </span>
                )
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center dark:bg-slate-950">
                <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 dark:bg-slate-950 min-h-screen">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
                <div className="relative z-10 space-y-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                        <FaLifeRing /> Support Center
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">How can we help you today?</h1>
                    <p className="text-sm md:text-base text-indigo-100 max-w-2xl">
                        Have a question, issue, or feedback? Send a message directly to our campus administration. We review and process all support inquiries actively.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submit New Query */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit space-y-6">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-850">
                        <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                            <FaQuestionCircle />
                        </span>
                        <div>
                            <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm">Submit New Query</h2>
                            <p className="text-[10px] text-slate-400">Direct channel to platform admins</p>
                        </div>
                    </div>

                    {formSuccess && (
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-250 dark:border-emerald-900/30">
                            {formSuccess}
                        </div>
                    )}

                    {formError && (
                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs border border-red-250 dark:border-red-900/30">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="What is your query about?"
                                className="w-full h-10 border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl px-4 outline-none text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Message Description</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Provide as much detail as possible..."
                                rows="5"
                                className="w-full border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl p-4 outline-none text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                        >
                            {submitting ? (
                                <FaSpinner className="animate-spin text-sm" />
                            ) : (
                                <>
                                    <FaPaperPlane className="text-[10px]" /> Submit Query
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* My Queries History */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col min-h-125">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850">
                        <div>
                            <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm">Your Ticket History</h2>
                            <p className="text-[10px] text-slate-400">Track and view responses to your queries</p>
                        </div>
                        <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">
                            Total: {queries.length}
                        </span>
                    </div>

                    {queries.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-850 flex items-center justify-center text-slate-400 mb-3 border border-slate-100 dark:border-slate-800/80">
                                <FaInbox className="text-xl" />
                            </div>
                            <h3 className="font-bold text-slate-905 dark:text-slate-400 text-sm">No support tickets found</h3>
                            <p className="text-xs text-slate-400 max-w-sm mt-1">If you need help or have general questions, submit your first query using the sidebar form.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-850 overflow-y-auto flex-1 max-h-137.5 pr-1">
                            {queries.map((q) => (
                                <div 
                                    key={q._id} 
                                    onClick={() => setSelectedQuery(selectedQuery?._id === q._id ? null : q)}
                                    className={`py-4 transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer rounded-xl px-2 my-1 ${
                                        selectedQuery?._id === q._id ? 'bg-indigo-50/20 dark:bg-indigo-950/10 border-l-4 border-indigo-500' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="min-w-0 space-y-1">
                                            <h3 className="font-bold text-xs md:text-sm text-slate-905 dark:text-slate-50 truncate">{q.subject}</h3>
                                            <p className="text-[10px] text-slate-400">Submitted: {new Date(q.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="shrink-0">
                                            {getStatusBadge(q.status)}
                                        </div>
                                    </div>

                                    {/* Collapsible content details */}
                                    <div className={`mt-3 space-y-3 text-xs text-slate-600 dark:text-slate-400 transition-all ${
                                        selectedQuery?._id === q._id ? 'block' : 'hidden'
                                    }`}>
                                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                                            <p className="font-semibold text-slate-900 dark:text-slate-200 mb-1">Your query message:</p>
                                            <p className="whitespace-pre-wrap">{q.message}</p>
                                        </div>

                                        {q.order && (
                                            <div className="bg-indigo-50/20 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100/30 dark:border-indigo-900/30 text-[11px] text-slate-500">
                                                Order ID: <span className="font-bold">{q.order._id}</span> | Item: <span className="font-bold">{q.order.item?.title}</span> {q.seller && <>| Seller: <span className="font-bold">{q.seller.firstname} {q.seller.lastname}</span></>}
                                            </div>
                                        )}

                                        {q.adminResponse ? (
                                            <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-150/40 dark:border-indigo-900/20">
                                                <p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
                                                    <span>🛡️</span> Admin Response:
                                                </p>
                                                <p className="font-semibold text-slate-800 dark:text-slate-350 bg-white/70 dark:bg-slate-900 p-2.5 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
                                                    "{q.adminResponse}"
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-amber-50/30 dark:bg-amber-950/10 p-3 rounded-xl border border-amber-100/30 text-amber-705 dark:text-amber-400 text-[11px] font-medium">
                                                ⏳ Our administrators are currently reviewing this query and will follow up shortly.
                                            </div>
                                        )}
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

export default HelpCenter
