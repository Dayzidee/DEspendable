"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { FaHeadset, FaBars, FaTimes, FaUser, FaInfoCircle, FaPaperPlane, FaSpinner, FaCommentSlash, FaUserCircle, FaComments } from "react-icons/fa";

export default function AdminChat() {
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedCustomerId = searchParams.get('customer_id');

    const [sessions, setSessions] = useState<any[]>([]);
    const [activeSession, setActiveSession] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar
    const [showUserDetails, setShowUserDetails] = useState(false); // For user details panel

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user && token) {
            // Fetch active chat sessions
            // Mock data
            setTimeout(() => {
                const mockSessions = [
                    { id: 1, customer_id: 101, customer: { username: "john_doe" }, status: "active", last_message: "Hello, I need help", created_at: new Date().toISOString() },
                    { id: 2, customer_id: 102, customer: { username: "jane_smith" }, status: "waiting", last_message: "Payment issue", created_at: new Date(Date.now() - 3600000).toISOString() },
                ];
                setSessions(mockSessions);
                setLoadingSessions(false);

                if (preselectedCustomerId) {
                    const session = mockSessions.find(s => s.customer_id.toString() === preselectedCustomerId);
                    if (session) handleSelectSession(session);
                }
            }, 800);
        }
    }, [user, token, authLoading, router, preselectedCustomerId]);

    const handleSelectSession = (session: any) => {
        setActiveSession(session);
        setSidebarOpen(false); // Close sidebar on mobile on selection
        // Fetch messages for session
        // Mock messages
        setMessages([
            { id: 1, sender: "user", content: "Hi, I have a question about my transaction.", timestamp: new Date(Date.now() - 100000).toISOString() },
            { id: 2, sender: "admin", content: "Hello! I'd be happy to help. Which transaction are you referring to?", timestamp: new Date(Date.now() - 80000).toISOString() },
            { id: 3, sender: "user", content: "The one from yesterday for $50.", timestamp: new Date(Date.now() - 60000).toISOString() },
        ]);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        // Add message optimistically
        const newMessage = {
            id: Date.now(),
            sender: "admin",
            content: messageInput,
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, newMessage]);
        setMessageInput("");

        // API call to send message would go here
    };

    if (authLoading || loadingSessions) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="text-[var(--color-primary)] text-lg flex items-center gap-2">
                    <FaSpinner className="animate-spin" /> Loading Chat Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#F4F6F8] overflow-hidden">
            {/* Page Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden text-gray-600 hover:text-[var(--color-primary)] p-2"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <FaBars />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                            <FaHeadset className="text-[var(--color-primary)]" /> Support Chat Dashboard
                        </h1>
                        <p className="text-xs text-[var(--color-text-secondary)] hidden sm:block">Manage customer conversations</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar Overlay (Mobile) */}
                {sidebarOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Left Sidebar - Conversation List */}
                <aside
                    className={`
                        absolute md:relative z-30 h-full w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                            <FaComments /> Active Conversations
                        </h2>
                        <button className="md:hidden text-gray-500 hover:text-red-500" onClick={() => setSidebarOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {sessions.length > 0 ? (
                            sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => handleSelectSession(session)}
                                    className={`
                                        p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 items-start
                                        ${activeSession?.id === session.id ? 'bg-[var(--color-primary-light)]/10 border-l-4 border-l-[var(--color-primary)]' : ''}
                                    `}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                        <FaUser />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-[var(--color-text-primary)] truncate">{session.customer.username}</span>
                                            <span className="text-xs text-[var(--color-text-secondary)]">
                                                {new Date(session.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[var(--color-text-secondary)] truncate">
                                            {session.status}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">Click to view messages</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-[var(--color-text-secondary)] flex flex-col items-center">
                                <FaCommentSlash className="text-3xl mb-2 opacity-30" />
                                <p>No active conversations</p>
                                <small>New chat sessions will appear here</small>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col bg-[#F4F6F8] relative overflow-hidden">
                    {activeSession ? (
                        <>
                            {/* Chat Header */}
                            <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--color-text-primary)]">{activeSession.customer.username}</h3>
                                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-gray-100"
                                        title="User Details"
                                        onClick={() => setShowUserDetails(!showUserDetails)}
                                    >
                                        <FaInfoCircle size={18} />
                                    </button>
                                    <button
                                        className="md:hidden p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                                        onClick={() => setActiveSession(null)}
                                    >
                                        <FaTimes size={18} />
                                    </button>
                                </div>
                            </header>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg) => {
                                    const isMe = msg.sender === 'admin';
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`
                                                    max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm
                                                    ${isMe ? 'bg-[var(--color-primary)] text-white rounded-br-none' : 'bg-white text-[var(--color-text-primary)] rounded-bl-none border border-gray-100'}
                                                `}
                                            >
                                                <p>{msg.content}</p>
                                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input Area */}
                            <footer className="bg-white border-t border-gray-200 p-4">
                                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            className="w-full bg-[#F4F6F8] border border-gray-200 rounded-full px-5 py-3 pr-20 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                                            placeholder="Type your response..."
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            maxLength={500}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                            {messageInput.length} / 500
                                        </span>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={!messageInput.trim()}
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--color-text-secondary)]">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300 text-4xl">
                                <FaComments />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Select a Conversation</h3>
                            <p className="max-w-md">Choose a chat from the sidebar to view messages and respond to customers.</p>
                        </div>
                    )}
                </main>

                {/* Right Panel - User Details (Desktop) */}
                {showUserDetails && activeSession && (
                    <aside className="w-80 bg-white border-l border-gray-200 hidden lg:flex flex-col z-10 shadow-lg animate-fade-in-up">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <FaUserCircle /> Customer Details
                            </h3>
                            <button className="text-gray-500 hover:text-red-500" onClick={() => setShowUserDetails(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-3xl mb-3">
                                    <FaUser />
                                </div>
                                <h2 className="text-lg font-bold">{activeSession.customer.username}</h2>
                                <span className="text-sm text-gray-500">ID: {activeSession.customer_id}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-xs text-gray-500 uppercase block mb-1">Status</span>
                                    <span className="font-medium text-green-600">Active</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-xs text-gray-500 uppercase block mb-1">Account Tier</span>
                                    <span className="font-medium">Standard</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-xs text-gray-500 uppercase block mb-1">Last Active</span>
                                    <span className="font-medium">Just now</span>
                                </div>
                                <button className="w-full btn-secondary text-sm py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
