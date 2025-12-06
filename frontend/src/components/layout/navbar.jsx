import React from "react";
import { Button } from "../ui/button";
import { Sparkles, Menu } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#E11D48]/5 bg-[#FFFBEB]/80 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-[#E11D48]" />
                        <span className="text-xl font-bold bg-gradient-to-r from-[#E11D48] to-[#D97706] bg-clip-text text-transparent">
                            Serenia
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-[#475569] hover:text-[#E11D48] transition-colors">
                            Features
                        </a>
                        <a href="#demo" className="text-sm font-medium text-[#475569] hover:text-[#E11D48] transition-colors">
                            Live Demo
                        </a>
                        <a href="#ethics" className="text-sm font-medium text-[#475569] hover:text-[#E11D48] transition-colors">
                            Ethics
                        </a>
                        <a href="#research" className="text-sm font-medium text-[#475569] hover:text-[#E11D48] transition-colors">
                            Research
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
                        <Button>Launch App</Button>
                        <div className="md:hidden">
                            <Button variant="ghost" size="sm">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
