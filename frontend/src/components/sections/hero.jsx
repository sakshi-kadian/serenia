import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E11D48]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D97706]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFF1F2] rounded-full blur-3xl opacity-50" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="default" className="mb-6">
                        v1.0 Public Release
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1C1917] mb-6 font-serif">
                        Extending Human <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-[#D97706]">
                            Intelligence.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#475569] mb-10 leading-relaxed">
                        Serenia is a next-generation cognitive interface designed for research, problem-solving, and creative synthesis.
                        Experience the "Rose Gold" standard of AI.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="w-full sm:w-auto gap-2">
                            Start Conversation <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                            <PlayCircle className="h-4 w-4" /> Watch Demo
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Mockup Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-16 mx-auto max-w-5xl px-4"
            >
                <div className="rounded-2xl border border-[#E11D48]/10 bg-white/50 backdrop-blur-xl shadow-2xl p-2 md:p-4">
                    <div className="rounded-xl bg-white border border-[#E2E8F0] overflow-hidden aspect-[16/9] flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF1F2] via-[#FFFBEB] to-[#E9D5FF] opacity-30" />
                        <p className="text-[#E11D48] font-medium z-10">Interactive Interface Preview</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
