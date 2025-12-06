import React from "react";
import { Sparkles, Twitter, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-[#E2E8F0] pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-[#E11D48]" />
                            <span className="text-lg font-bold">Serenia</span>
                        </div>
                        <p className="text-[#475569] max-w-xs">
                            The next generation cognitive interface for research and creative synthesis.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1C1917] mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-[#475569]">
                            <li><a href="#" className="hover:text-[#E11D48]">Features</a></li>
                            <li><a href="#" className="hover:text-[#E11D48]">Research</a></li>
                            <li><a href="#" className="hover:text-[#E11D48]">Changelog</a></li>
                            <li><a href="#" className="hover:text-[#E11D48]">Download</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#1C1917] mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-[#475569]">
                            <li><a href="#" className="hover:text-[#E11D48]">Privacy</a></li>
                            <li><a href="#" className="hover:text-[#E11D48]">Terms</a></li>
                            <li><a href="#" className="hover:text-[#E11D48]">Ethics Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[#64748B]">© 2024 Serenia AI. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Twitter className="h-5 w-5 text-[#94A3B8] hover:text-[#E11D48] cursor-pointer" />
                        <Github className="h-5 w-5 text-[#94A3B8] hover:text-[#E11D48] cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
