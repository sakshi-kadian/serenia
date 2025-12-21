'use client';
import React, { useState, useEffect } from 'react';
import {
    Settings,
    LogOut,
    User,
    ArrowRight,
    LifeBuoy,
    Bot,
    BookOpen,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';

export default function DashboardPage() {
    const { user } = useUser();
    const [greeting, setGreeting] = useState("Good morning");
    const [date, setDate] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeMood, setActiveMood] = useState<string | null>(null);


    const [quote, setQuote] = useState({ text: "Peace comes from within. Do not seek it without.", author: "Buddha" });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");

        setDate(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));

        const quotes = [
            { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
            { text: "The soul always knows what to do to heal itself.", author: "Michelangelo" },
            { text: "Breath is the bridge which connects life to consciousness.", author: "Thich Nhat Hanh" },
            { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
            { text: "Nothing can bring you peace but yourself.", author: "Ralph Waldo Emerson" }
        ];
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A26] font-sans overflow-x-hidden animate-in fade-in duration-700">

            {/* HEADER */}
            <header className="w-full flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center rounded-full shadow-md group-hover:shadow-lg transition-all duration-500 overflow-hidden bg-white border border-yellow-100">
                        <img src="/assets/whiz.png" alt="Serenia Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-serif font-bold text-xl tracking-tight text-yellow-600">Serenia</span>
                </Link>

                {/* Right Side: Helpline + Account */}
                <div className="flex items-center gap-6">

                    {/* Crisis Support - Compact */}
                    <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-rose-100 rounded-full shadow-sm shadow-rose-50">
                        <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase tracking-widest">
                            <LifeBuoy size={14} />
                            Helpline
                        </div>
                        <div className="w-px h-4 bg-rose-100/50"></div>
                        <a
                            href="https://findahelpline.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
                        >
                            Get Support <ArrowRight size={12} />
                        </a>
                    </div>

                    {/* User Profile & Settings */}
                    <div className="flex items-center gap-4 pl-4 md:border-l border-stone-200/50">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-500 shadow-sm">
                                <User size={16} />
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-bold text-stone-800">{user?.firstName || user?.username || 'Friend'}</p>
                            </div>
                        </div>

                        <div className="relative z-50">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={`cursor-pointer transition-all duration-200 ${isSettingsOpen ? 'text-stone-900 bg-stone-100 rotate-90' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'} p-2 rounded-full`}
                            >
                                <Settings size={20} />
                            </button>

                            {/* Dropdown Menu */}
                            {isSettingsOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50 p-1.5">
                                    <div className="md:hidden px-3 py-2 text-xs font-medium text-stone-500 border-b border-stone-50 mb-1">
                                        {user?.firstName || user?.username || 'Friend'}
                                    </div>
                                    <Link
                                        href="/"
                                        className="w-full text-left px-3 py-2.5 text-xs font-bold text-stone-900 hover:bg-stone-100 rounded-xl flex items-center gap-2 transition-colors uppercase tracking-wider"
                                    >
                                        <LogOut size={14} />
                                        Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-20">

                {/* Background Decorations - Repositioned */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-amber-50/40 via-emerald-50/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-50/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

                <div className="space-y-12 mt-4 md:mt-8">

                    {/* Greeting + Daily Wisdom - Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Greeting Header - Left Side (2 cols) */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className="text-stone-400 font-bold tracking-widest uppercase text-xs mb-1 pl-1">
                                {date}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 tracking-tight">
                                {greeting}, <span className="italic text-stone-500">{user?.firstName || user?.username || 'Friend'}</span>.
                            </h1>
                            <p className="text-lg text-stone-500 font-light max-w-2xl leading-relaxed">
                                Your space to reflect, grow, and find balance with WHIZ, your AI companion.
                            </p>
                        </div>

                        {/* Daily Wisdom - Compact Right Side (1 col) */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-stone-900 shadow-xl shadow-stone-900/10 group h-full">
                            {/* Abstract Background */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-yellow-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-1000" />

                            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-yellow-500 font-bold tracking-widest uppercase text-[9px] mb-3 border border-yellow-500/30 rounded-full px-2.5 py-1 w-fit bg-yellow-500/10">
                                        Daily Wisdom
                                    </div>
                                    <p className="text-base md:text-lg font-serif text-white leading-snug mb-3">
                                        "{quote.text}"
                                    </p>
                                    <p className="text-stone-400 text-xs font-medium italic">
                                        — {quote.author}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Feature Cards Grid - Larger & More Prominent */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                        {/* Whiz Chat Card */}
                        <Link href="/features/chat" className="group">
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-yellow-100/40 p-8 border border-yellow-50 hover:border-yellow-200 hover:shadow-2xl hover:shadow-yellow-200/50 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-[100%] -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out" />

                                <div className="w-16 h-16 rounded-3xl bg-yellow-100 flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                                    <Bot size={32} />
                                </div>

                                <h3 className="text-2xl font-bold text-yellow-700 mb-3">WHIZ Chat</h3>
                                <p className="text-base text-stone-500 leading-relaxed mb-8 flex-1">
                                    Talk to your AI companion. Share your thoughts, feelings, and get real-time emotional support.
                                </p>
                                <div className="flex items-center gap-3 text-yellow-600 font-bold text-sm tracking-wide uppercase group-hover:gap-4 transition-all">
                                    Start chatting
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Reflections Card */}
                        <Link href="/features/journal" className="group">
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-100/40 p-8 border border-emerald-50 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100%] -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out" />

                                <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                                    <BookOpen size={30} />
                                </div>

                                <h3 className="text-2xl font-bold text-emerald-700 mb-3">Reflections</h3>
                                <p className="text-base text-stone-500 leading-relaxed mb-8 flex-1">
                                    AI-generated journal entries from your conversations. Review and save your emotional journey.
                                </p>
                                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm tracking-wide uppercase group-hover:gap-4 transition-all">
                                    View reflections
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Insights Card */}
                        <Link href="/features/analytics" className="group">
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-sky-100/40 p-8 border border-sky-50 hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[100%] -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out" />

                                <div className="w-16 h-16 rounded-3xl bg-sky-100 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                                    <BarChart3 size={30} />
                                </div>

                                <h3 className="text-2xl font-bold text-sky-700 mb-3">Insights</h3>
                                <p className="text-base text-stone-500 leading-relaxed mb-8 flex-1">
                                    Track your emotional patterns, mood trends, and anxiety levels over time with AI analytics.
                                </p>
                                <div className="flex items-center gap-3 text-sky-600 font-bold text-sm tracking-wide uppercase group-hover:gap-4 transition-all">
                                    See insights
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                    </div>

                    {/* How It Works Section */}
                    {/* How It Works Section - Redesigned */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden relative">
                        {/* Decorative background blur */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-gradient-to-b from-stone-50/50 to-transparent blur-3xl -z-10" />

                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 tracking-tight mb-3">Your Journey</h2>
                            <p className="text-stone-500 text-lg">Building emotional resilience through thoughtful conversation.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-[3rem] left-[20%] right-[20%] h-px border-t-2 border-dashed border-stone-200/60 -z-10" />

                            {/* Step 1 */}
                            <div className="relative group text-center">
                                <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-lg shadow-yellow-100 border border-yellow-50 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-500 z-10 relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400 text-white font-bold flex items-center justify-center shadow-md text-sm">1</div>
                                    <div className="w-20 h-20 bg-yellow-50/50 rounded-2xl flex items-center justify-center">
                                        <Bot size={32} className="text-yellow-600" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Chat with WHIZ</h3>
                                <p className="text-sm text-stone-500 leading-relaxed max-w-[250px] mx-auto">
                                    Share your thoughts and feelings in real-time, supportive conversations.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative group text-center">
                                <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-lg shadow-emerald-100 border border-emerald-50 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-500 z-10 relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shadow-md text-sm">2</div>
                                    <div className="w-20 h-20 bg-emerald-50/50 rounded-2xl flex items-center justify-center">
                                        <BookOpen size={32} className="text-emerald-600" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Review Reflections</h3>
                                <p className="text-sm text-stone-500 leading-relaxed max-w-[250px] mx-auto">
                                    WHIZ automatically generates journal entries for you to review and save.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative group text-center">
                                <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-500 z-10 relative">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shadow-md text-sm">3</div>
                                    <div className="w-20 h-20 bg-sky-50/50 rounded-2xl flex items-center justify-center">
                                        <BarChart3 size={32} className="text-sky-600" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Track Growth</h3>
                                <p className="text-sm text-stone-500 leading-relaxed max-w-[250px] mx-auto">
                                    Gain insights into your mood patterns and anxiety levels over time.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>


            </main>
        </div>
    );
}
