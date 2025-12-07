
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";


export function Hero() {
    return (
        <section className="relative pt-32 pb-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D97706]/10 rounded-full blur-[100px] animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#FFEDD5]/80 via-white/50 to-[#FEF3C7]/30 rounded-full blur-[60px] opacity-60" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 border-[#F59E0B]/20">
                        <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                        <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#D97706] to-[#F59E0B]">
                            Redefining Human-AI Connection
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#451A03] mb-8 font-serif leading-tight">
                        <span className="text-gradient-yellow">Serenia</span>: Your <br />
                        <span className="text-gradient-yellow">
                            Emotion Aware Chatbot
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed">
                        More than just answers. Serenia understands nuance, context, and the subtle emotional undercurrents of your conversation.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-[#E11D48]/25 hover:shadow-[#E11D48]/40 hover:-translate-y-1 transition-all duration-300 gap-3">
                            Start Journey <ArrowRight className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-white/50 backdrop-blur-sm gap-3">
                            Read Manifesto
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Floating Elements for "Wow" Factor */}
            <div className="absolute top-1/3 left-10 md:left-20 animate-float opacity-40 md:opacity-100 hidden sm:block">
                <div className="glass-card p-4 rounded-2xl rotate-[-6deg]">
                    <span className="text-4xl">💭</span>
                </div>
            </div>
            <div className="absolute bottom-1/4 right-10 md:right-20 animate-float delay-1000 opacity-40 md:opacity-100 hidden sm:block">
                <div className="glass-card p-4 rounded-2xl rotate-[6deg]">
                    <span className="text-4xl">❤️</span>
                </div>
            </div>
        </section>
    );
}
