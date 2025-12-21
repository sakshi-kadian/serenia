'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, ArrowLeft, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { sendChatMessage, generateReflection, ChatMessage, ChatResponse } from '@/utils/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
    emotion?: string;
    anxiety_detected?: boolean;
    crisis_detected: boolean;
}

export default function ChatPage() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatingReflection, setGeneratingReflection] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [crisisDetected, setCrisisDetected] = useState(false);
    const [crisisResources, setCrisisResources] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Send initial greeting
    useEffect(() => {
        const userName = user?.firstName || user?.username || 'Traveler';
        setMessages([
            {
                id: 'greeting',
                role: 'assistant',
                content: `Hello, ${userName}. I'm WHIZ. How are you feeling today?`,
                created_at: new Date().toISOString(),
                crisis_detected: false
            }
        ]);
    }, [user]);

    const handleGenerateReflection = async () => {
        if (!conversationId || !user) return;

        try {
            setGeneratingReflection(true);
            const token = await getToken();

            await generateReflection({
                user_id: user.id,
                conversation_id: conversationId
            }, token);

            // Redirect to journal to see the reflection
            router.push('/features/journal');
        } catch (err) {
            console.error('Error generating reflection:', err);
            alert('Failed to generate reflection. Please try again.');
        } finally {
            setGeneratingReflection(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading || !user) return;

        const userMessageContent = input;
        setInput("");
        setLoading(true);

        // Add user message to UI immediately
        const tempUserMessage: Message = {
            id: `temp-${Date.now()}`,
            role: 'user',
            content: userMessageContent,
            created_at: new Date().toISOString(),
            crisis_detected: false
        };
        setMessages(prev => [...prev, tempUserMessage]);

        try {
            // Get auth token
            const token = await getToken();

            // Send message to backend
            const request: ChatMessage = {
                user_id: user.id,
                message: userMessageContent,
                conversation_id: conversationId || undefined
            };

            const response: ChatResponse = await sendChatMessage(request, token);

            // Update conversation ID if this is the first message
            if (!conversationId) {
                setConversationId(response.conversation_id);
            }

            // Update crisis detection state
            if (response.crisis?.detected) {
                setCrisisDetected(true);
                setCrisisResources(response.crisis.resources);
            }

            // Add AI response to messages
            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: response.response,
                created_at: response.timestamp,
                emotion: response.emotion?.label,
                anxiety_detected: response.anxiety?.detected,
                crisis_detected: response.crisis?.detected || false
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment.",
                created_at: new Date().toISOString(),
                crisis_detected: false
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A26] font-sans relative flex flex-col">
            {/* Abstract Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-50/40 via-orange-50/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-50 px-6 py-4 flex items-center justify-between gap-4 border-b border-amber-100/50 bg-white/80 backdrop-blur-xl sticky top-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-amber-50 rounded-full transition-colors text-amber-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl group-hover:scale-105 transition-transform duration-300">
                            <img
                                src="/assets/whiz.png"
                                alt="Whiz"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-xl text-stone-900">Whiz</h1>
                            <p className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative">
                                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                                </span>
                                Always here for you
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Crisis Alert */}
            {crisisDetected && crisisResources && (
                <div className="relative z-40 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-200 p-4">
                    <div className="max-w-3xl mx-auto flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="text-rose-600" size={20} />
                        </div>
                        <div className="text-sm flex-1">
                            <p className="font-bold text-rose-900 mb-1">Crisis Support Available</p>
                            <p className="text-rose-700 mb-3">You don't have to face this alone. Help is available 24/7:</p>
                            <div className="space-y-2">
                                <a href={`tel:${crisisResources.hotline?.number}`} className="flex items-center gap-2 text-rose-700 hover:text-rose-900 font-medium">
                                    <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">📞</span>
                                    Call {crisisResources.hotline?.number} ({crisisResources.hotline?.name})
                                </a>
                                <div className="flex items-center gap-2 text-rose-700">
                                    <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">💬</span>
                                    {crisisResources.text?.description}
                                </div>
                                <a href={crisisResources.chat?.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-rose-700 hover:text-rose-900 font-medium">
                                    <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">🌐</span>
                                    Online Crisis Chat
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-500`}>
                        {/* Whiz Avatar (left side for assistant) */}
                        {msg.role === 'assistant' && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 mt-1 shadow-sm border border-stone-100 bg-white">
                                <img
                                    src="/assets/whiz.png"
                                    alt="Whiz"
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`
                            max-w-[75%] md:max-w-[65%] px-6 py-4 rounded-[1.5rem] text-[1.05rem] leading-relaxed shadow-sm relative
                            ${msg.role === 'user'
                                ? 'bg-yellow-50 text-stone-800 font-medium rounded-br-none shadow-md shadow-stone-100 border border-yellow-100'
                                : 'bg-white border border-stone-100 text-stone-700 rounded-bl-none shadow-sm shadow-stone-100'}
                        `}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {/* Emotion badge for Whiz messages */}
                            {msg.role === 'assistant' && msg.emotion && (
                                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2">
                                    <Sparkles size={12} className="text-yellow-500" />
                                    <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                                        Detected: <span className="text-yellow-600 font-bold">{msg.emotion}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* User Avatar (right side for user) */}
                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700 flex-shrink-0 mt-1 font-serif font-bold border border-yellow-200 shadow-sm text-lg">
                                <span>{user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}</span>
                            </div>
                        )}
                    </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                    <div className="flex gap-4 justify-start animate-pulse">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-stone-100">
                            <img
                                src="/assets/whiz.png"
                                alt="Whiz"
                                className="w-full h-full object-contain p-1"
                            />
                        </div>
                        <div className="bg-white border border-amber-100/50 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" />
                                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <div className="relative z-50 p-4 md:p-6 bg-white/90 backdrop-blur-xl border-t border-amber-100/50">
                <div className="max-w-4xl mx-auto relative flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Share what's on your mind..."
                        onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                        disabled={loading}
                        className="flex-1 bg-white border border-stone-200 rounded-full px-6 py-4 text-base focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all outline-none disabled:opacity-50 placeholder:text-stone-400 shadow-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full hover:scale-105 hover:bg-yellow-200 transition-all shadow-md shadow-yellow-100 border border-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
