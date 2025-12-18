'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Menu, X, Music, Book, Bot, ArrowRight, Check, ChevronDown,
    Sparkles, Shield, PlayCircle, Heart, Star, Users, Leaf, Sun
} from 'lucide-react';

export default function Homepage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        // Base Background: Warm Cream/Stone for that organic, calming feel
        <div className="min-h-screen bg-[#FDFBF7] text-[#4A4741] font-sans selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">

            {/* Soft Watercolor Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
                <div className="absolute top-[30%] right-[-10%] w-[700px] h-[700px] bg-indigo-100/50 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            {/* --- HEADER --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#FDFBF7]/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md group-hover:shadow-lg transition-all duration-500">
                            <Sun className="w-5 h-5 text-amber-400 fill-amber-50" />
                        </div>
                        <span className="text-2xl font-serif font-medium tracking-tight text-[#2C2A26]">
                            Serenia
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-10">
                        <NavLink href="#features">Features</NavLink>
                        <NavLink href="#mission">Philosophy</NavLink>
                        <NavLink href="#faq">FAQ</NavLink>
                        <Link
                            href="/auth"
                            className="text-sm font-medium text-[#6B665E] hover:text-[#2C2A26] transition-colors"
                        >
                            Log in
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-[#4A4741] hover:bg-stone-100 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Nav */}
                <div className={`md:hidden absolute top-full left-0 right-0 bg-[#FDFBF7] border-b border-stone-100 p-6 flex flex-col gap-6 shadow-xl transition-all duration-300 origin-top transform ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0 overflow-hidden'}`}>
                    <MobileNavLink href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
                    <MobileNavLink href="#mission" onClick={() => setIsMobileMenuOpen(false)}>Philosophy</MobileNavLink>
                    <MobileNavLink href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</MobileNavLink>
                    <Link
                        href="/auth"
                        className="text-xl font-serif font-medium text-[#2C2A26] block text-center mt-4"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Log in
                    </Link>
                </div>
            </header>

            <main className="relative z-10 pt-40 pb-20">

                {/* --- HERO SECTION --- */}
                <section className="px-6 lg:px-8 mb-40">
                    <div className="max-w-4xl mx-auto text-center">

                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 border border-stone-200/50 backdrop-blur-sm shadow-sm mb-10 animate-fade-in-up hover:bg-white/80 transition-all cursor-default text-[#6B665E]">
                            <Leaf className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-medium tracking-wide">A sanctuary for your mind</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-[#2C2A26] mb-8 leading-[1.1] animate-fade-in-up [animation-delay:200ms]">
                            Gentle guidance for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-indigo-400 to-amber-400">
                                inner harmony.
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-[#6B665E] mb-14 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up [animation-delay:400ms]">
                            Connect your emotions with music, reflection, and understanding.
                            <br className="hidden md:block" />
                            Serenia is an emotion-aware companion for your daily life.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up [animation-delay:600ms]">
                            <Link
                                href="/auth"
                                className="group relative px-10 py-5 bg-[#2C2A26] text-[#FDFBF7] rounded-full font-medium text-lg hover:bg-[#403D37] hover:scale-105 transition-all duration-300 shadow-xl shadow-[#2C2A26]/10 overflow-hidden"
                            >
                                <span className="flex items-center gap-3">
                                    Begin Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>

                            <Link
                                href="/about"
                                className="px-10 py-5 bg-white text-[#4A4741] rounded-full font-medium text-lg border border-stone-200/50 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300"
                            >
                                Our Story
                            </Link>
                        </div>
                    </div>
                </section>

                {/* --- FEATURES BENTO GRID (Soft Style) --- */}
                <section id="features" className="px-6 lg:px-8 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-[#2C2A26] mb-6">Designed for gentleness</h2>
                            <p className="text-[#6B665E] text-lg max-w-2xl mx-auto">
                                No clutter, no noise. Just the tools you need to feel grounded.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[420px]">

                            {/* Feature 1: Journal (Large) */}
                            <div className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white p-10 md:p-14 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.02)] border border-stone-100 hover:shadow-[0_40px_60px_-10px_rgba(0,0,0,0.05)] transition-all duration-700">
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 rotate-3">
                                            <Book size={32} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-3xl font-serif font-medium text-[#2C2A26] mb-4">Reflective Journaling</h3>
                                        <p className="text-lg text-[#6B665E] max-w-md leading-relaxed">
                                            A secure, quiet space for your thoughts. Our gentle AI analyzes your entries to offer warm insights into your emotional patterns.
                                        </p>
                                    </div>
                                </div>
                                {/* Decoration */}
                                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-rose-50 rounded-full blur-[80px] group-hover:bg-rose-100 transition-colors duration-700" />
                            </div>

                            {/* Feature 2: Music (Tall) */}
                            <div className="md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.02)] border border-stone-100 hover:shadow-[0_40px_60px_-10px_rgba(0,0,0,0.05)] transition-all duration-700">
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="w-16 h-16 bg-amber-50 text-amber-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 -rotate-3">
                                        <Music size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-3xl font-serif font-medium text-[#2C2A26] mb-4">Sonic Harmony</h3>
                                    <p className="text-lg text-[#6B665E] mb-12 leading-relaxed">
                                        We connect with Spotify to weave playlists that match your heart's rhythm. Music that understands how you feel.
                                    </p>

                                    <div className="mt-auto relative w-full aspect-square bg-stone-50 rounded-3xl overflow-hidden border border-stone-100 group-hover:border-amber-200 transition-all duration-500">
                                        {/* Fake player UI */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-500 text-amber-400">
                                                <PlayCircle size={40} strokeWidth={1.5} className="ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-50 rounded-full blur-[80px] group-hover:bg-amber-100 transition-colors duration-700" />
                            </div>

                            {/* Feature 3: Chat (Normal) */}
                            <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.02)] border border-stone-100 hover:shadow-[0_40px_60px_-10px_rgba(0,0,0,0.05)] transition-all duration-700">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 rotate-3">
                                        <Bot size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-medium text-[#2C2A26] mb-3">Empathetic AI</h3>
                                    <p className="text-[#6B665E] leading-relaxed">
                                        A companion that listens without judgment. Available 24/7 to help you navigate through anxious moments.
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-[60px] group-hover:bg-emerald-100 transition-colors duration-700" />
                            </div>

                            {/* Feature 4: Analytics (Normal) */}
                            <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.02)] border border-stone-100 hover:shadow-[0_40px_60px_-10px_rgba(0,0,0,0.05)] transition-all duration-700">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 -rotate-3">
                                        <Heart size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-medium text-[#2C2A26] mb-3">Mood Insights</h3>
                                    <p className="text-[#6B665E] leading-relaxed">
                                        See your emotional journey unfold in soft, beautiful charts. Understand what brings you joy.
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-[60px] group-hover:bg-indigo-100 transition-colors duration-700" />
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- PHILOSOPHY SECTION --- */}
                <section id="mission" className="px-6 lg:px-8 py-32">
                    <div className="max-w-7xl mx-auto rounded-[3rem] bg-[#2C2A26] p-12 lg:p-24 overflow-hidden relative">

                        {/* Background Texture */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <h2 className="text-4xl lg:text-6xl font-serif font-medium text-[#FDFBF7] leading-tight">
                                    Technology that <br />
                                    <span className="italic text-indigo-200">respects your peace.</span>
                                </h2>
                                <p className="text-lg text-stone-300 leading-relaxed font-light">
                                    In a world screaming for your attention, Serenia whispers. We built a digital refuge where you can reset, recharge, and reconnect with your true self.
                                </p>

                                <div className="flex gap-4 pt-4">
                                    <div className="px-6 py-3 rounded-full bg-white/10 text-stone-200 backdrop-blur-sm border border-white/5">Private</div>
                                    <div className="px-6 py-3 rounded-full bg-white/10 text-stone-200 backdrop-blur-sm border border-white/5">Science-backed</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <PhilosophyCard
                                    icon={<Users size={20} />}
                                    title="Community of Calm"
                                    desc="You are not alone. Join thousands finding their balance."
                                />
                                <PhilosophyCard
                                    icon={<Shield size={20} />}
                                    title="Sacred Privacy"
                                    desc="Your thoughts are yours alone. End-to-end encrypted."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FAQ SECTION --- */}
                <section id="faq" className="px-6 lg:px-8 py-32 bg-white">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-serif font-medium text-center text-[#2C2A26] mb-16">Common questions</h2>
                        <div className="space-y-4">
                            <FaqItem question="Is Serenia free to use?" answer="Yes, Serenia is open for everyone. We offer a generous free tier that gives you full access to the Journal and basic Mood Tracking. We believe peace should be accessible." />
                            <FaqItem question="Do I need a Spotify account?" answer="To generate the Mood Playlists, yes. We use your Spotify Premium account to seamlessly play music. However, journaling and the AI companion work perfectly without it." />
                            <FaqItem question="Is my data safe?" answer="Your privacy is our core value. All journal entries are encrypted before they touch our database. We do not sell your personal emotional data." />
                        </div>
                    </div>
                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-[#FDFBF7] py-20 px-6 border-t border-stone-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 flex items-center justify-center bg-[#2C2A26] rounded-full text-white">
                            <Sun className="w-4 h-4 text-amber-100" />
                        </div>
                        <span className="text-xl font-serif font-medium text-[#2C2A26]">Serenia</span>
                    </Link>

                    <div className="flex gap-8 text-sm font-medium text-[#6B665E]">
                        <a href="#" className="hover:text-[#2C2A26] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#2C2A26] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#2C2A26] transition-colors">About</a>
                        <a href="#" className="hover:text-[#2C2A26] transition-colors">Support</a>
                    </div>

                    <p className="text-stone-400 text-sm">© {new Date().getFullYear()} Serenia Inc.</p>
                </div>
            </footer>
        </div>
    );
}

// Subcomponents

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} className="text-sm font-medium text-[#6B665E] hover:text-[#2C2A26] transition-colors relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#2C2A26] transition-all group-hover:w-full opacity-0 group-hover:opacity-100" />
        </a>
    )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <a href={href} onClick={onClick} className="text-xl font-serif font-medium text-[#2C2A26] block">
            {children}
        </a>
    )
}

function PhilosophyCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="p-3 rounded-full bg-white/10 text-indigo-200">
                {icon}
            </div>
            <div>
                <h4 className="text-[#FDFBF7] font-medium text-lg mb-1">{title}</h4>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-stone-100 last:border-0">
            <button
                className="w-full flex items-center justify-between py-6 text-left group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-[#2C2A26] group-hover:text-indigo-900 transition-colors">{question}</span>
                <span className={`transform transition-transform duration-300 text-stone-400 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="pb-6 text-[#6B665E] leading-relaxed pr-8">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
}
