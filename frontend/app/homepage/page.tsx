'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Menu, X, Music, Book, Bot, ArrowRight, ChevronDown, Shield, BarChart3, User, Brain, Zap, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

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
        // Base Background
        <div className="min-h-screen bg-[#FDFBF7] text-[#4A4741] font-sans overflow-x-hidden relative">

            {/* Global Hero Background Glow (Firework/Blob) */}
            <div className="absolute top-0 left-0 w-full h-[120vh] overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-gradient-to-b from-amber-100/60 via-yellow-50/30 to-transparent rounded-full blur-[120px] opacity-100" />
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full blur-[100px] animate-pulse duration-[3000ms]" />
            </div>

            {/* HEADER */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#FDFBF7]/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 flex items-center justify-center rounded-full shadow-md group-hover:shadow-lg transition-all duration-500 overflow-hidden bg-white border border-yellow-100">
                            <img src="/assets/whiz.png" alt="Serenia Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-serif font-bold text-xl tracking-tight text-yellow-600">
                            Serenia
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-10">
                        <NavLink href="#home">Home</NavLink>
                        <NavLink href="#about">About</NavLink>
                        <NavLink href="#features">Features</NavLink>
                        <NavLink href="#mission">Philosophy</NavLink>
                        <NavLink href="#faq">FAQ</NavLink>
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
                    <MobileNavLink href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                    <MobileNavLink href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileNavLink>
                    <MobileNavLink href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
                    <MobileNavLink href="#mission" onClick={() => setIsMobileMenuOpen(false)}>Philosophy</MobileNavLink>
                    <MobileNavLink href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</MobileNavLink>

                </div>
            </header>

            <main className="relative z-10 pt-40 pb-20">

                {/* HERO SECTION */}
                <section id="home" className="relative px-6 lg:px-8 mb-40 scroll-mt-32">

                    <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="font-serif font-medium tracking-tight text-[#2C2A26] mb-8 leading-none"
                        >
                            <span className="block text-7xl md:text-9xl lg:text-[8rem] mb-4 text-yellow-600 drop-shadow-sm">Serenia</span>
                            <span className="block text-3xl md:text-4xl lg:text-5xl font-extralight italic text-stone-500 tracking-wide">
                                Your Emotion Aware Platform
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-[#6B665E] mb-12 max-w-2xl mx-auto leading-relaxed font-light"
                        >
                            A digital sanctuary that listens, understands, and reflects. <br className="hidden md:block" />
                            Connect with your inner world through music and meaningful dialogue.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Link
                                href="/auth"
                                className="group relative px-12 py-5 bg-yellow-100/80 backdrop-blur-md border border-yellow-200 text-amber-900 rounded-full font-medium text-lg tracking-wide hover:bg-yellow-200/90 hover:scale-105 transition-all duration-500 shadow-[0_8px_30px_rgb(251,191,36,0.2)] overflow-hidden"
                            >
                                <span className="flex items-center gap-2 relative z-10">
                                    Begin Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </section>


                {/* ABOUT SECTION */}
                <section id="about" className="py-24 relative overflow-hidden bg-[#FDFBF7]">
                    {/* Subtle Texture */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#D97706 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-[#1C1917]">
                                    More than a tool. <br />
                                    <span className="text-amber-600">A companion for life.</span>
                                </h2>
                                <p className="text-xl text-[#475569] leading-relaxed mb-6">
                                    Serenia was born from a simple belief: mental wellness shouldn't be a solitary struggle. Creating a digital sanctuary that feels human, warm, and understanding.
                                </p>
                                <p className="text-lg text-[#475569] leading-relaxed mb-8">
                                    Combining cutting-edge emotional intelligence with timeless design to build a space where you can truly be yourself, heard, validated, and supported, every step of the way.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Brain size={20} />
                                        </div>
                                        <h3 className="font-semibold text-[#1C1917]">Cognitive</h3>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Heart size={20} />
                                        </div>
                                        <h3 className="font-semibold text-[#1C1917]">Empathic</h3>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Zap size={20} />
                                        </div>
                                        <h3 className="font-semibold text-[#1C1917]">Adaptive</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-8 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white opacity-80 z-0"></div>

                                    {/* Abstract Visualization */}
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-yellow-500 rounded-full blur-[100px] opacity-30 animate-pulse"></div>

                                        <div className="absolute inset-0 flex flex-col gap-4 justify-center px-6">
                                            {/* User Message 1 */}
                                            <div className="glass-card px-5 py-3 rounded-2xl rounded-tr-none self-end max-w-[80%] bg-white/80 animate-float" style={{ animationDelay: '0s' }}>
                                                <p className="text-sm text-[#57534E]">I'm feeling a bit overwhelmed today.</p>
                                            </div>

                                            {/* Bot Message 1 */}
                                            <div className="glass-card px-5 py-3 rounded-2xl rounded-tl-none self-start max-w-[80%] bg-amber-50/80 border-amber-100 animate-float" style={{ animationDelay: '0.5s' }}>
                                                <p className="text-sm text-[#451A03]">I hear you. Let's take it one step at a time.</p>
                                            </div>

                                            {/* User Message 2 */}
                                            <div className="glass-card px-5 py-3 rounded-2xl rounded-tr-none self-end max-w-[80%] bg-white/80 animate-float" style={{ animationDelay: '1s' }}>
                                                <p className="text-sm text-[#57534E]">I just want to feel like myself again.</p>
                                            </div>

                                            {/* Bot Message 2 */}
                                            <div className="glass-card px-5 py-3 rounded-2xl rounded-tl-none self-start max-w-[80%] bg-amber-50/80 border-amber-100 animate-float" style={{ animationDelay: '1.5s' }}>
                                                <p className="text-sm text-[#451A03]">We'll get there. For now, just being here is enough.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* FEATURES GRID */}
                <motion.section
                    id="features"
                    className="px-6 lg:px-8 py-24 bg-[#FDFBF7]"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col items-center text-center mb-16 gap-4">
                            <h2 className="text-4xl lg:text-6xl font-serif font-medium text-[#2C2A26] italic tracking-tight">
                                Key Features
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr max-w-6xl mx-auto">

                            {/* Feature 1: Chatbot */}
                            <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-white border border-amber-50 shadow-[0_20px_40px_-20px_rgba(245,158,11,0.1)] transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(245,158,11,0.3)] hover:border-amber-200/60 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white via-60% to-white opacity-60" />

                                <div className="relative z-10 flex flex-col md:flex-row p-6 md:p-8 gap-5 items-center justify-between">
                                    <div className="flex-1 space-y-3 max-w-2xl">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                                            <Bot size={20} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-medium text-stone-900 mb-1.5 tracking-tight">Chat with Whiz</h3>
                                            <p className="text-stone-500 text-sm leading-relaxed">
                                                Share your burden in real-time. Whiz offers immediate, supportive dialogue and understanding your context and nuance to provide a safe space for unedited thoughts.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-100 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />Real-time Support
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-100 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />Tone Detection
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-100 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />24/7 Companion
                                            </div>
                                        </div>
                                    </div>

                                    {/* Whiz Visual (Compacted) */}
                                    <div className="relative w-40 h-40 lg:w-48 lg:h-48 flex-shrink-0 flex items-center justify-center">
                                        <div className="absolute w-32 h-32 lg:w-40 lg:h-40 rounded-full border border-amber-500/10" />
                                        <div className="absolute w-24 h-24 lg:w-32 lg:h-32 rounded-full border border-amber-500/20 bg-amber-50/5" />
                                        <img src="/assets/whiz.png" alt="Whiz Avatar" className="relative z-10 w-28 h-28 lg:w-36 lg:h-36 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700" />
                                        {/* Badge */}
                                        <div className="absolute -right-2 top-6 bg-white border border-stone-100 shadow-md px-2 py-1 rounded-md animate-float">
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex space-x-0.5">
                                                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
                                                </div>
                                                <span className="text-[8px] font-bold text-stone-500 uppercase tracking-wide">Listening</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: Journal */}
                            <div className="relative overflow-hidden rounded-[2rem] bg-white border border-emerald-50 shadow-[0_20px_40px_-20px_rgba(16,185,129,0.1)] transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.3)] hover:border-emerald-200/60 group p-6 flex flex-col gap-4">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white to-white opacity-60" />
                                <div className="relative z-10 space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        <Book size={20} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif font-medium text-stone-900 mb-1.5">Reflective Journal</h4>
                                        <p className="text-stone-500 leading-relaxed text-sm">
                                            Forget the blank page. Whiz automatically distills your conversations into profound journal entries, ready for you to review and save.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="px-2.5 py-1 bg-white border border-stone-100 rounded-md text-[10px] font-bold text-stone-500 shadow-sm flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-400" />Auto-Generation
                                        </span>
                                        <span className="px-2.5 py-1 bg-white border border-stone-100 rounded-md text-[10px] font-bold text-stone-500 shadow-sm flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-400" />Contextual
                                        </span>
                                        <span className="px-2.5 py-1 bg-white border border-stone-100 rounded-md text-[10px] font-bold text-stone-500 shadow-sm flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-400" />E2E Encrypted
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3: Insights */}
                            <div className="relative overflow-hidden rounded-[2rem] bg-white border border-sky-50 shadow-[0_20px_40px_-20px_rgba(14,165,233,0.1)] transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(14,165,233,0.3)] hover:border-sky-200/60 group p-6 flex flex-col gap-4">
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-50/40 via-white to-white opacity-60" />
                                <div className="relative z-10 space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        <BarChart3 size={20} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif font-medium text-stone-900 mb-1.5">Personalized Insights</h4>
                                        <p className="text-stone-500 leading-relaxed text-sm">
                                            See the invisible. Advanced modeling tracks your mood patterns and anxiety levels over time, turning feelings into actionable data.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="px-2.5 py-1 bg-white border border-stone-100 rounded-md text-[10px] font-bold text-stone-500 shadow-sm flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-sky-400" />Weekly Trends
                                        </span>
                                        <span className="px-2.5 py-1 bg-white border border-stone-100 rounded-md text-[10px] font-bold text-stone-500 shadow-sm flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-sky-400" />Trigger Spotting
                                        </span>
                                        <span className="px-2.5 py-1 bg-white border border-stone-100 rounded-md text-[10px] font-bold text-stone-500 shadow-sm flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-sky-400" />Smart Reports
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>


                {/* PHILOSOPHY SECTION */}
                <motion.section
                    id="mission"
                    className="px-6 lg:px-8 py-32"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-7xl mx-auto rounded-[3rem] bg-[#2C2A26] p-12 lg:p-24 overflow-hidden relative">

                        {/* Background Texture */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/20 to-yellow-300/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <h2 className="text-4xl lg:text-6xl font-serif font-medium text-[#FDFBF7] leading-tight">
                                    Technology that <br />
                                    <span className="italic text-amber-100">respects your peace.</span>
                                </h2>
                                <p className="text-lg text-stone-300 leading-relaxed font-light">
                                    In a world screaming for your attention, Serenia whispers. This is built as a digital refuge where you can reconnect with your self.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="px-6 py-3 rounded-full bg-white/10 text-stone-200 backdrop-blur-sm border border-white/5">Science-Backed</div>
                                    <div className="px-6 py-3 rounded-full bg-white/10 text-stone-200 backdrop-blur-sm border border-white/5">Emotion-Aware</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <PhilosophyCard
                                    icon={<User size={20} />}
                                    title="Emotional Intelligence"
                                    desc="Listening without judgment. Understanding your feelings to guide you toward peace."
                                />
                                <PhilosophyCard
                                    icon={<Shield size={20} />}
                                    title="Sacred Privacy"
                                    desc="Your thoughts are yours alone. End-to-end encrypted."
                                />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* FAQ SECTION */}
                <motion.section
                    id="faq"
                    className="px-6 lg:px-8 py-32 bg-[#FDFBF7]"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl lg:text-6xl font-serif font-medium text-center text-[#2C2A26] italic mb-20 tracking-tight">
                            Common Questions
                        </h2>
                        <div className="space-y-4">
                            <FaqItem
                                question="What is Serenia?"
                                answer="Serenia is an emotion-aware digital sanctuary. It combines reflective journaling, mood-based music, and empathetic AI to help you find balance and reconnect with your inner self."
                            />
                            <FaqItem
                                question="Who is Whiz?"
                                answer="Whiz is your personal empathetic AI companion. Designed to listen without judgment, Whiz offers warm support, gentle guidance, and a safe space to unburden your thoughts 24/7."
                            />
                            <FaqItem
                                question="Is my data safe?"
                                answer="Your privacy is our core value. All your chats, reflections and insights are fully encrypted. This place is a sanctuary where data remains yours alone."
                            />
                        </div>
                    </div>
                </motion.section>

            </main>

            {/* FOOTER */}
            <footer className="bg-[#FDFBF7] pb-12 px-6">
                <div className="max-w-7xl mx-auto border-t border-stone-200/60 mb-8" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 flex items-center justify-center rounded-full overflow-hidden bg-white border border-yellow-100 shadow-sm">
                            <img src="/assets/whiz.png" alt="Serenia Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-serif font-bold text-yellow-600 tracking-tight">Serenia</span>
                    </Link>

                    <p className="text-stone-400 text-sm">© 2025 Serenia. All Rights Reserved.</p>

                    <div className="flex gap-8 text-sm font-medium text-[#6B665E]">
                        <a href="#" className="hover:text-[#2C2A26] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#2C2A26] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#2C2A26] transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div >
    );
}


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
            <div className="p-3 rounded-full bg-white/10 text-amber-200">
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
        <div className={`rounded-3xl transition-all duration-300 ${isOpen ? 'bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] scale-[1.02] border-transparent' : 'bg-transparent border border-stone-200/50 hover:bg-[#FAF9F6] hover:border-stone-300 hover:shadow-sm'}`}>
            <button
                className="w-full flex items-center justify-between p-6 md:p-8 text-left group cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`text-xl font-serif transition-colors duration-300 ${isOpen ? 'text-[#2C2A26]' : 'text-[#4A4741] group-hover:text-[#2C2A26]'}`}>
                    {question}
                </span>
                <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isOpen ? 'bg-[#2C2A26] text-[#FDFBF7] rotate-180' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200 group-hover:text-[#2C2A26]'}`}>
                    <ChevronDown size={20} strokeWidth={2} />
                </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="px-6 md:px-8 pb-8 text-[#6B665E] leading-relaxed text-lg">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
}
