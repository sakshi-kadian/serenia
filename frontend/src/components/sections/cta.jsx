import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export function CTA() {
    console.log("CTA Rendered");
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-black text-white">
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >

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
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
