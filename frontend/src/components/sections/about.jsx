import React from "react";
import { motion } from "framer-motion";
import { Heart, Brain, Zap } from "lucide-react";

export function About() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#E11D48 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-[#1C1917]">
                            Not just smart. <br />
                            <span className="text-[#E11D48]">Emotionally Intelligent.</span>
                        </h2>
                        <p className="text-xl text-[#475569] leading-relaxed mb-6">
                            Traditional AI processes words. Serenia processes intent, tone, and feeling. We've built the first cognitive engine that treats empathy as a first-class citizen in the conversation.
                        </p>
                        <p className="text-lg text-[#475569] leading-relaxed mb-8">
                            Whether you're brainstorming a masterpiece, navigating a complex problem, or just need someone to really listen—Serenia adapts to <i>you</i>.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-[#E11D48]/10 flex items-center justify-center text-[#E11D48]">
                                    <Brain size={20} />
                                </div>
                                <h3 className="font-semibold text-[#1C1917]">Cognitive</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-[#E11D48]/10 flex items-center justify-center text-[#E11D48]">
                                    <Heart size={20} />
                                </div>
                                <h3 className="font-semibold text-[#1C1917]">Empathic</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-[#E11D48]/10 flex items-center justify-center text-[#E11D48]">
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
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF1F2] to-white opacity-80 z-0"></div>

                            {/* Abstract Visualization of Empathy */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <div className="w-64 h-64 bg-gradient-to-tr from-[#E11D48] to-[#D97706] rounded-full blur-[80px] opacity-20 animate-pulse"></div>

                                <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center">
                                    <div className="glass-card px-6 py-4 rounded-2xl rounded-tl-none self-start ml-12 animate-float" style={{ animationDelay: '0s' }}>
                                        <p className="text-sm text-[#475569]">I'm feeling a bit overwhelmed today.</p>
                                    </div>
                                    <div className="glass-card px-6 py-4 rounded-2xl rounded-tr-none self-end mr-12 bg-[#E11D48]/5 border-[#E11D48]/20 animate-float" style={{ animationDelay: '1s' }}>
                                        <p className="text-sm text-[#1C1917]">I hear you. Let's take it one step at a time. What's on your mind?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
