import React from "react";

export function Ethics() {
    return (
        <section id="ethics" className="py-24 bg-[#FFFBEB]">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="bg-[#FFF1F2] rounded-3xl p-8 md:p-12 border border-[#E11D48]/10 text-center">
                    <h2 className="text-3xl font-bold font-serif text-[#1C1917] mb-6">Built with Principle</h2>
                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-[#E11D48]">01. Transparency</h3>
                            <p className="text-[#475569]">
                                Serenia is designed to be explainable. We prioritize systems that can cite their sources and reasoning paths, minimizing "black box" behavior.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 text-[#E11D48]">02. Data Sovereignty</h3>
                            <p className="text-[#475569]">
                                Your research data is your intellectual property. Serenia operates with strict local-first protocols, ensuring no unauthorized training on your private work.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
