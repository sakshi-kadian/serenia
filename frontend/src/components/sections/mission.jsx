import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Lock } from "lucide-react";

const principles = [
    {
        title: "01. Transparency",
        description: "Serenia is designed to be explainable. We prioritize systems that can cite their sources and reasoning paths, minimizing 'black box' behavior."
    },
    {
        title: "02. Data Sovereignty",
        description: "Your research data is your intellectual property. Serenia operates with strict local-first protocols ensuring no unauthorized training on your private work."
    },
    {
        title: "03. Mental Wellbeing",
        description: "Built with safeguards to encourage healthy attachment and disconnect. We optimize for utility, not addiction."
    }
];

export function Mission() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#E11D48]/5 -skew-y-3 z-0 origin-top-left transform scale-110"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[#E11D48] font-semibold tracking-wider uppercase text-sm block mb-2"
                        >
                            Our Ethos
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold font-serif text-[#1C1917] mb-8"
                        >
                            Built with Principle. <br />
                            Grounded in Trust.
                        </motion.h2>
                        <p className="text-xl text-[#475569] leading-relaxed mb-10">
                            We believe AI should extend human capability, not replace human agency. Our core mission is to build a companion that respects your boundaries.
                        </p>

                        <div className="space-y-8">
                            {principles.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="pl-6 border-l-2 border-[#E11D48]/20 hover:border-[#E11D48] transition-colors duration-300"
                                >
                                    <h4 className="text-lg font-bold text-[#E11D48] mb-2">{item.title}</h4>
                                    <p className="text-[#475569]">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[600px] hidden lg:block rounded-3xl overflow-hidden glass-panel">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF1F2] to-[#FFFBEB] opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Abstract clean loop animation or static graphic representing trust */}
                            <div className="w-96 h-96 border-[1px] border-[#E11D48]/10 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                                <div className="w-64 h-64 border-[1px] border-[#E11D48]/20 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                                    <div className="w-32 h-32 bg-[#E11D48]/5 rounded-full flex items-center justify-center backdrop-blur-md">
                                        <ShieldCheck className="w-12 h-12 text-[#E11D48] opacity-80" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
