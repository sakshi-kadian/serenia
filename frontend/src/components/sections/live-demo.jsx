import React, { useState } from "react";
import { Button } from "../ui/button";
import { Send, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LiveDemo() {
    const [messages, setMessages] = useState([
        { role: "ai", content: "Hello! I am Serenia. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: "user", content: input }]);
        setInput("");

        // Simulate response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", content: "That is a fascinating topic. Based on my database, I can tell you that..." }]);
        }, 1000);
    };

    return (
        <section id="demo" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FFFBEB] to-[#FFF1F2]" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-serif text-[#1C1917] mb-4">Experience Serenia</h2>
                    <p className="text-[#475569]">Try the interface firsthand. Fluid, responsive, and intelligent.</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col h-[600px]">
                    {/* Header */}
                    <div className="h-14 border-b border-[#E2E8F0] flex items-center px-6 bg-[#FAFAF9]">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="ml-4 text-xs font-medium text-gray-500">Separated Context / Research Mode</div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-6 overflow-y-auto bg-[#FAFAF9] space-y-6">
                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-[#FFF1F2] text-[#E11D48]' : 'bg-[#E2E8F0] text-gray-600'}`}>
                                        {msg.role === 'ai' ? <Sparkles size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'ai'
                                            ? 'bg-white border border-[#E2E8F0] text-[#1C1917]'
                                            : 'bg-[#E11D48] text-white'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-[#E2E8F0]">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                className="w-full bg-[#F5F5F4] rounded-full pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 transition-all placeholder:text-gray-400"
                                placeholder="Ask Serenia anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button
                                size="sm"
                                type="submit"
                                className="absolute right-2 top-2 h-10 w-10 p-0 rounded-full"
                            >
                                <Send size={18} />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
