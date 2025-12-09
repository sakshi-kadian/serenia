import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { ModalComingSoon } from "./ModalComingSoon";

export function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#F59E0B]/10 bg-[#FFF5EB]/80 backdrop-blur-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#D97706] bg-clip-text text-transparent">
                                Serenia
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#about" className="text-sm font-medium text-[#475569] hover:text-[#E11D48] transition-colors">
                                About
                            </a>
                            <a href="#features" className="text-sm font-medium text-[#475569] hover:text-[#E11D48] transition-colors">
                                Features
                            </a>
                            <a href="#mission" className="text-sm font-medium text-[#475569] hover:text-[#E11D48] transition-colors">
                                Mission
                            </a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
                            <Button onClick={() => setIsModalOpen(true)}>Launch App</Button>
                            <div className="md:hidden">
                                <Button variant="ghost" size="sm">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <ModalComingSoon isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
