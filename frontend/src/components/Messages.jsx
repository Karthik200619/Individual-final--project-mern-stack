import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useSearchParams, useNavigate } from 'react-router'
import { FaArrowLeft, FaPaperPlane, FaSpinner, FaComments, FaInbox, FaBoxOpen } from 'react-icons/fa'
import { useAuth } from '../store/authStore'

function Messages() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const queryUserId = searchParams.get('userId')
    const queryItemId = searchParams.get('itemId')

    const [conversations, setConversations] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [itemContext, setItemContext] = useState(null)
    const [typedMessage, setTypedMessage] = useState('')
    const [loadingConversations, setLoadingConversations] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [sending, setSending] = useState(false)

    const messageEndRef = useRef(null)

    // Fetch conversations list
    const getConversations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/user-api/chat/conversations', {
                withCredentials: true
            })
            setConversations(res.data.payload || [])
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingConversations(false)
        }
    }

    // Load active item context if query parameter is set
    const getItemContext = async () => {
        if (!queryItemId) return
        try {
            const res = await axios.get(`http://localhost:5000/user-api/item/${queryItemId}`, {
                withCredentials: true
            })
            setItemContext(res.data.payload)
        } catch (err) {
            console.log(err)
        }
    }

    // Scroll chat history to bottom
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Load messages with selected user
    const getMessages = async (userId, silence = false) => {
        if (!userId) return
        try {
            if (!silence) setLoadingMessages(true)
            const res = await axios.get(`http://localhost:5000/user-api/chat/messages/${userId}`, {
                withCredentials: true
            })
            setMessages(res.data.payload || [])
        } catch (err) {
            console.log(err)
        } finally {
            if (!silence) setLoadingMessages(false)
        }
    }

    // Fetch conversations and item details on mount
    useEffect(() => {
        getConversations()
        getItemContext()
    }, [])

    // If queryUserId is set and not already in conversations, handle temporary insert
    useEffect(() => {
        const setupQueryUser = async () => {
            if (!queryUserId || loadingConversations) return
            
            // Find if this user already exists in our conversation list
            const foundUser = conversations.find(c => c._id === queryUserId)
            if (foundUser) {
                setSelectedUser(foundUser)
            } else {
                // If it's a new conversation, fetch their user details first
                try {
                    // We can find their name from the item details or use a common fetch
                    // For now, let's fetch item details if we haven't already, which has seller details
                    let tempUser = null
                    if (itemContext && itemContext.seller._id === queryUserId) {
                        tempUser = itemContext.seller
                    } else {
                        // Fetch item details or mock user details from seller info
                        // We will check if we can query them from an item if available
                        const res = await axios.get(`http://localhost:5000/user-api/item/${queryItemId}`, {
                            withCredentials: true
                        })
                        tempUser = res.data.payload?.seller
                    }

                    if (tempUser) {
                        const newUserObj = {
                            _id: tempUser._id,
                            firstname: tempUser.firstname,
                            lastname: tempUser.lastname,
                            profileImageUrl: tempUser.profileImageUrl,
                            email: tempUser.email
                        }
                        setSelectedUser(newUserObj)
                        setConversations(prev => [newUserObj, ...prev])
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
        setupQueryUser()
    }, [queryUserId, loadingConversations, itemContext])

    // Load messages on selecting a user
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
        }
    }, [selectedUser])

    // Poll for new messages every 4 seconds
    useEffect(() => {
        if (!selectedUser) return
        const interval = setInterval(() => {
            getMessages(selectedUser._id, true)
        }, 4000)
        return () => clearInterval(interval)
    }, [selectedUser])

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Send Message
    const handleSend = async (e) => {
        e.preventDefault()
        if (!typedMessage.trim() || !selectedUser) return
        try {
            setSending(true)
            await axios.post('http://localhost:5000/user-api/chat/send', {
                receiverId: selectedUser._id,
                message: typedMessage,
                itemId: queryItemId || undefined
            }, {
                withCredentials: true
            })
            setTypedMessage('')
            getMessages(selectedUser._id, true)
            getConversations() // Update conversations list ordering
        } catch (err) {
            console.log(err)
            alert('Failed to send message')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto h-[82vh] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            
            {/* Conversations Sidebar (Left Panel) */}
            <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col h-1/3 md:h-full">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-lg">Chats</h2>
                        <p className="text-[10px] text-slate-400">Connect with other student buyers & sellers</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                    {loadingConversations ? (
                        <div className="flex justify-center items-center h-32">
                            <FaSpinner className="animate-spin text-indigo-600" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            <FaComments className="mx-auto text-2xl mb-2 text-slate-300" />
                            No conversations yet
                        </div>
                    ) : (
                        conversations.map((user) => (
                            <button
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left ${
                                    selectedUser?._id === user._id ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-l-4 border-indigo-600' : ''
                                }`}
                            >
                                <img
                                    src={user.profileImageUrl || 'https://via.placeholder.com/150'}
                                    alt={user.firstname}
                                    className="w-10 h-10 rounded-full object-cover border"
                                />
                                <div className="min-w-0 flex-1">
                                    <span className="block font-bold text-xs text-slate-900 dark:text-slate-50 truncate">
                                        {user.firstname} {user.lastname}
                                    </span>
                                    <span className="block text-[10px] text-slate-400 truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat History Panel (Right Panel) */}
            <div className="flex-1 flex flex-col h-2/3 md:h-full bg-slate-50/40 dark:bg-slate-950/20">
                {selectedUser ? (
                    <>
                        {/* Selected User Info Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedUser.profileImageUrl || 'https://via.placeholder.com/150'}
                                    alt={selectedUser.firstname}
                                    className="w-10 h-10 rounded-full object-cover border"
                                />
                                <div>
                                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-50">
                                        {selectedUser.firstname} {selectedUser.lastname}
                                    </h3>
                                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/myitems?userId=${selectedUser._id}`)}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <FaBoxOpen /> View Listings
                            </button>
                        </div>

                        {/* Optional Listing Context Bar */}
                        {itemContext && itemContext.seller._id === selectedUser._id && (
                            <div className="bg-white dark:bg-slate-900 px-4 py-2.5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Context:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{itemContext.title}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">₹{itemContext.price}</span>
                                </div>
                                <button 
                                    onClick={() => navigate(`/buy/${itemContext._id}`)}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-[10px] transition"
                                >
                                    Buy Now
                                </button>
                            </div>
                        )}

                        {/* Messages Flow */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {loadingMessages ? (
                                <div className="flex justify-center items-center h-full">
                                    <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                                    <FaComments size={24} className="text-slate-350 mb-2" />
                                    No messages. Start the conversation!
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMine = msg.sender === currentUser?._id
                                    return (
                                        <div 
                                            key={msg._id} 
                                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="max-w-[70%] space-y-1">
                                                <div 
                                                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                                        isMine 
                                                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                                                    }`}
                                                >
                                                    {msg.message}
                                                </div>
                                                <span className={`block text-[9px] text-slate-400 ${isMine ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messageEndRef} />
                        </div>

                        {/* Input Box */}
                        <form 
                            onSubmit={handleSend}
                            className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={typedMessage}
                                onChange={(e) => setTypedMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 h-11 px-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={sending || !typedMessage.trim()}
                                className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400"
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-2xl mb-4 text-slate-400">
                            💬
                        </div>
                        <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base mb-1">Your Inbox</h3>
                        <p className="text-center max-w-xs leading-relaxed">
                            Select a chat thread from the left list to view messaging logs or coordinate student listings.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Messages
