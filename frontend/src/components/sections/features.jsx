import React from "react";
import { motion } from "framer-motion";
import {
    Cpu,
    Shield,
    Zap,
    Globe,
    MessageSquare,
    Lock
} from "lucide-react";

const features = [
    {
        icon: <Cpu className="w-6 h-6 text-[#E11D48]" />,
        title: "Deep Context Engine",
        description: "Remembers details from weeks ago, ensuring conversations flow naturally without repetition."
    },
    {
        icon: <Shield className="w-6 h-6 text-[#E11D48]" />,
        title: "Privacy First",
        description: "Your emotional data is encrypted locally. We believe your inner world belongs to you."
    },
    {
        icon: <Zap className="w-6 h-6 text-[#E11D48]" />,
        title: "Adaptive Tone",
        description: "Switches seamlessly between professional analysis and empathetic support."
    },
    {
        icon: <Globe className="w-6 h-6 text-[#E11D48]" />,
        title: "Cultural Nuance",
        description: "Trained on diverse datasets to understand idioms, humor, and cultural references."
    },
    {
        icon: <MessageSquare className="w-6 h-6 text-[#E11D48]" />,
        title: "Multi-Modal Input",
        description: "Speak, type, or share images. Serenia understands you through any medium."
    },
    {
        icon: <Lock className="w-6 h-6 text-[#E11D48]" />,
        title: "Sovereign Identity",
        description: "You own your model. Carry your personalized Serenia core across devices."
    }
];

export function Features() {
    return (
        <section className="py-24 bg-[#FFFBEB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#E11D48] font-semibold tracking-wider uppercase text-sm"
                    >
                        Capabilities
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 text-4xl md:text-5xl font-bold font-serif text-[#1C1917]"
                    >
                        Engineered for Connection
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 rounded-3xl bg-white border border-[#E2E8F0] hover:border-[#E11D48]/30 hover:shadow-xl hover:shadow-[#E11D48]/5 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFF1F2] to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />

                            <div className="relative z-10">
                                <div className="h-12 w-12 rounded-2xl bg-[#FFF1F2] flex items-center justify-center mb-6 group-hover:bg-[#E11D48] group-hover:text-white transition-colors duration-300">
                                    {React.cloneElement(feature.icon, { className: "w-6 h-6 text-inherit transition-colors duration-300" })}
                                </div>
                                <h3 className="text-xl font-bold text-[#1C1917] mb-3 group-hover:text-[#E11D48] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-[#475569] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
