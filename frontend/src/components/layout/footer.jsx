import React from "react";
import { Twitter, Github, Linkedin, Heart } from "lucide-react";

export function Footer() {
    console.log("Footer Rendered");
    return (
        <footer className="bg-white border-t border-[#E2E8F0] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#E11D48] to-[#D97706] rounded-lg"></div>
                            <span className="text-xl font-bold font-serif text-[#1C1917]">Serenia</span>
                        </div>
                        <p className="text-[#475569] text-sm leading-relaxed mb-6">
                            The first emotion-aware cognitive interface. Designed to extend human intelligence through empathy and understanding.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-[#FFF1F2] text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-[#FFF1F2] text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition-colors">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-[#FFF1F2] text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1C1917] mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-[#475569]">
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1C1917] mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-[#475569]">
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1C1917] mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-[#475569]">
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[#E11D48] transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[#94a3b8]">
                        &copy; 2025 Serenia AI Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                        <span>Crafted with</span>
                        <Heart size={14} className="text-[#E11D48] fill-[#E11D48]" />
                        <span>in San Francisco</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
