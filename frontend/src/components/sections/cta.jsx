import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export function CTA() {
    console.log("CTA Rendered");
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#1C1917] text-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E11D48] rounded-full blur-[120px] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                        <Star className="w-4 h-4 text-[#D97706]" fill="currentColor" />
                        <span className="text-sm font-medium text-white/90">Join 10,000+ Early Adopters</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold font-serif text-white mb-8 tracking-tight">
                        Ready to meet <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-[#D97706]">
                            Serenia?
                        </span>
                    </h2>

                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
                        Step into a new era of digital companionship. Experience the warmth of intelligence designed for you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-10 text-lg bg-white text-[#1C1917] hover:bg-white/90 border-0">
                            Join Waitlist
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/20 text-white hover:bg-white/10 hover:text-white">
                            View Plans <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
