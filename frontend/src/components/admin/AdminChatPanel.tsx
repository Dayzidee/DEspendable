"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Check, Clock, User, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

interface Chat {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    status: 'active' | 'closed';
    created_at: string;
    last_message_at: string;
    message_count: number;
}

interface Message {
    id: string;
    sender_uid: string;
    sender_type: 'user' | 'agent';
    text: string;
    timestamp: string;
}

export default function AdminChatPanel() {
    const { token } = useAuth();
    const t = useTranslations('chat');

    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            fetchChats();
            const interval = setInterval(fetchChats, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        if (selectedChat && token) {
            fetchMessages(selectedChat.id);
            const interval = setInterval(() => fetchMessages(selectedChat.id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedChat, token]);

    const fetchChats = async () => {
        try {
            const res = await fetch('/api/admin/chats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setChats(data);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const res = await fetch(`/api/admin/chats/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedChat) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/chats/${selectedChat.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: inputText })
            });

            if (res.ok) {
                setInputText("");
                fetchMessages(selectedChat.id);
                fetchChats(); // Update chat list
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleChatStatus = async (chatId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        try {
            const res = await fetch(`/api/admin/chats/${chatId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchChats();
                if (selectedChat?.id === chatId) {
                    setSelectedChat({ ...selectedChat, status: newStatus as 'active' | 'closed' });
                }
            }
        } catch (error) {
            console.error("Error updating chat status:", error);
        }
    };

    const filteredChats = chats.filter(chat => {
        const matchesSearch = chat.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.user_email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chat List */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#0018A8]" />
                        {t('all_chats')}
                    </h3>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['all', 'active', 'closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as any)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${statusFilter === status
                                        ? 'bg-[#0018A8] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chats */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            {t('no_chats')}
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <motion.div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition ${selectedChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                                whileHover={{ x: 4 }}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#0018A8] text-white flex items-center justify-center text-xs font-bold">
                                            {chat.user_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{chat.user_name}</p>
                                            <p className="text-xs text-gray-500">{chat.user_email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${chat.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {chat.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                    <span>{chat.message_count} messages</span>
                                    <span>{new Date(chat.last_message_at).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{selectedChat.user_name}</h3>
                                <p className="text-sm text-gray-500">{selectedChat.user_email}</p>
                            </div>
                            <button
                                onClick={() => toggleChatStatus(selectedChat.id, selectedChat.status)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedChat.status === 'active'
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                            >
                                {selectedChat.status === 'active' ? t('close_chat') : t('reopen_chat')}
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-8">
                                    {t('no_messages')}
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender_type === 'agent'
                                                    ? 'bg-[#0018A8] text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-200 text-[#1C1C1C] rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender_type === 'agent' ? 'text-blue-100' : 'text-gray-400'
                                                }`}>
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t('type_message')}
                                disabled={selectedChat.status === 'closed'}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0018A8] disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || loading || selectedChat.status === 'closed'}
                                className="p-2 bg-[#0018A8] text-white rounded-xl hover:bg-[#0025D9] disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Select a chat to view messages</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
