'use client';
import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    MessageCircle, // Changed from ChatBubbleLeftRight (not in Lucide) to MessageCircle
    BookOpen,
    Music,
    BarChart3,
    Wind,
    Settings,
    LogOut,
    User,
    Smile,
    Coffee, // Changed from Moon (approximate match)
    Zap,
    CloudRain,
    Meh,
    Sparkles,
    ArrowRight,
    LifeBuoy
} from 'lucide-react';
import Link from 'next/link';

// Sidebar Link Component (Internal)
const SidebarLink = ({
    href,
    icon: Icon,
    label,
    active,
    activeClasses = "bg-stone-100 text-stone-900",
    hoverClasses = "hover:bg-stone-100 hover:text-stone-900",
    iconColor = "text-stone-400"
}: {
    href: string;
    icon: any;
    label: string;
    active?: boolean;
    activeClasses?: string;
    hoverClasses?: string;
    iconColor?: string;
}) => (
    <Link
        href={href}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
            ${active
                ? `${activeClasses} shadow-sm`
                : `text-stone-500 ${hoverClasses}`}
        `}
    >
        <Icon size={24} className={`${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} ${iconColor} transition-all`} />
        <span className="font-medium text-base tracking-wide">{label}</span>
    </Link>
);

export default function DashboardPage() {
    const [greeting, setGreeting] = useState("Good morning");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeMood, setActiveMood] = useState<string | null>(null);
    const user = { name: "Traveler" };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    const moods = [
        { id: 'happy', label: 'Happy', icon: Smile, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        { id: 'calm', label: 'Calm', icon: Coffee, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { id: 'anxious', label: 'Anxious', icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
        { id: 'sad', label: 'Sad', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'tired', label: 'Tired', icon: Meh, color: 'text-stone-500', bg: 'bg-stone-50', border: 'border-stone-200' },
    ];

    return (
        <div className="flex h-screen bg-[#FDFBF7] text-[#2C2A26] font-sans overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-72 bg-white border-r border-stone-100 flex flex-col justify-between p-6 hidden md:flex z-50">
                <div>
                    <div className="flex items-center gap-3 px-2 mb-10">
                        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
                            S
                        </div>
                        <span className="font-serif font-bold text-xl tracking-tight text-stone-900">Serenia</span>
                    </div>

                    <nav className="space-y-3">
                        <SidebarLink
                            href="/dashboard"
                            icon={LayoutDashboard}
                            label="Home"
                            active
                            activeClasses="bg-orange-50 text-orange-900"
                            hoverClasses="hover:bg-orange-50 hover:text-orange-900"
                            iconColor="text-orange-500"
                        />
                        <SidebarLink
                            href="/features/chat"
                            icon={MessageCircle}
                            label="Whiz"
                            activeClasses="bg-amber-50 text-amber-900"
                            hoverClasses="hover:bg-amber-50 hover:text-amber-900"
                            iconColor="text-amber-500"
                        />
                        <SidebarLink
                            href="/features/journal"
                            icon={BookOpen}
                            label="Journal"
                            activeClasses="bg-emerald-50 text-emerald-900"
                            hoverClasses="hover:bg-emerald-50 hover:text-emerald-900"
                            iconColor="text-emerald-500"
                        />
                        <SidebarLink
                            href="/features/analytics"
                            icon={BarChart3}
                            label="Insights"
                            activeClasses="bg-sky-50 text-sky-900"
                            hoverClasses="hover:bg-sky-50 hover:text-sky-900"
                            iconColor="text-sky-500"
                        />
                    </nav>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100">
                        <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                            Crisis Support
                        </div>
                        <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                            If you're in immediate distress, please reach out. You are not alone.
                        </p>
                        <a
                            href="https://findahelpline.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
                        >
                            Find Help Now →
                        </a>
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 border-t border-stone-100 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
                                <User size={16} />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-stone-800">{user.name}</p>
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={`cursor-pointer transition-all duration-200 ${isSettingsOpen ? 'text-stone-900 bg-stone-100 rotate-45' : 'text-stone-400 hover:text-stone-600'} p-1.5 rounded-lg`}
                            >
                                <Settings size={18} />
                            </button>

                            {/* Simple Logout Popup */}
                            {isSettingsOpen && (
                                <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <Link
                                        href="/"
                                        className="block w-full text-left px-4 py-3 text-xs font-bold text-stone-900 hover:bg-stone-50 flex items-center gap-2 transition-colors uppercase tracking-wider"
                                    >
                                        <LogOut size={14} />
                                        Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto relative p-6 md:p-12">

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-50/30 via-emerald-50/20 to-transparent rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-50/40 to-transparent rounded-full blur-3xl -z-10" />

                <div className="w-full max-w-6xl mx-auto space-y-10">

                    {/* Greeting Header */}
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight">
                            {greeting}, <span className="italic text-stone-500">{user.name}</span>.
                        </h1>
                        <p className="text-lg text-stone-500 font-light max-w-2xl leading-relaxed">
                            Your sanctuary for emotional wellness. Choose how you'd like to connect with yourself today.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-stone-100">
                            <div className="text-2xl font-bold text-amber-600">12</div>
                            <div className="text-xs text-stone-500 font-medium">Conversations</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-stone-100">
                            <div className="text-2xl font-bold text-emerald-600">8</div>
                            <div className="text-xs text-stone-500 font-medium">Reflections</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-stone-100">
                            <div className="text-2xl font-bold text-sky-600">5</div>
                            <div className="text-xs text-stone-500 font-medium">Day Streak</div>
                        </div>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Whiz Chat Card */}
                        <Link href="/features/chat" className="group">
                            <div className="bg-white rounded-[2rem] shadow-lg shadow-amber-100/50 p-6 border border-amber-100/50 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-200/60 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Whiz Chat</h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-4 flex-1">
                                    Talk to your AI companion. Share your thoughts, feelings, and get real-time emotional support.
                                </p>
                                <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                    Start chatting
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Reflections Card */}
                        <Link href="/features/journal" className="group">
                            <div className="bg-white rounded-[2rem] shadow-lg shadow-emerald-100/50 p-6 border border-emerald-100/50 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-200/60 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                    <BookOpen size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Reflections</h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-4 flex-1">
                                    AI-generated journal entries from your conversations. Review, edit, and save your emotional journey.
                                </p>
                                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                    View reflections
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Insights Card */}
                        <Link href="/features/analytics" className="group">
                            <div className="bg-white rounded-[2rem] shadow-lg shadow-sky-100/50 p-6 border border-sky-100/50 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-200/60 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-200 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Insights</h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-4 flex-1">
                                    Track your emotional patterns, mood trends, and anxiety levels over time with AI-powered analytics.
                                </p>
                                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                    See insights
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                    </div>

                    {/* How It Works Section */}
                    <div className="bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-[2rem] p-8 border border-stone-200/50">
                        <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">How Serenia Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto font-bold text-lg">
                                    1
                                </div>
                                <h4 className="font-semibold text-stone-800">Chat with Whiz</h4>
                                <p className="text-sm text-stone-500 leading-relaxed">
                                    Share your thoughts and feelings in real-time conversations
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-bold text-lg">
                                    2
                                </div>
                                <h4 className="font-semibold text-stone-800">Review Reflections</h4>
                                <p className="text-sm text-stone-500 leading-relaxed">
                                    AI creates summaries you can edit and approve
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto font-bold text-lg">
                                    3
                                </div>
                                <h4 className="font-semibold text-stone-800">Track Progress</h4>
                                <p className="text-sm text-stone-500 leading-relaxed">
                                    See patterns and trends in your emotional wellness
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
