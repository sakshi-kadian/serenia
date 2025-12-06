import React from "react";
import { Card } from "../ui/card";
import { BrainCircuit, ShieldCheck, Infinity } from "lucide-react";

const features = [
    {
        icon: Infinity,
        title: "Infinite Memory",
        description: "Serenia retains context across weeks of conversation, ensuring no detail is ever lost in the void.",
    },
    {
        icon: BrainCircuit,
        title: "Adaptive Intelligence",
        description: "Dynamically switches between 'Creative' and 'Precise' modes to match your specific task intent.",
    },
    {
        icon: ShieldCheck,
        title: "Local-First Privacy",
        description: "Your data is encrypted and processed locally where possible. Enterprise-grade security by default.",
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-[#FFFBEB]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-serif text-[#1C1917] mb-4">The Core Engine</h2>
                    <p className="text-[#475569] max-w-2xl mx-auto">
                        Built with a focus on long-term cognition and user alignment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-8 hover:-translate-y-1 transition-transform duration-300">
                            <div className="h-12 w-12 rounded-xl bg-[#FFF1F2] flex items-center justify-center mb-6">
                                <feature.icon className="h-6 w-6 text-[#E11D48]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1C1917] mb-3">{feature.title}</h3>
                            <p className="text-[#475569] leading-relaxed">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
