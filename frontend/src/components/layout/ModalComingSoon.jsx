import React from "react";
import { X, Sparkles, CloudSun } from "lucide-react";

export function ModalComingSoon({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300">
                {/* Sunset Gradient Header */}
                <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#E11D48]">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-4 left-4 h-16 w-16 rounded-full bg-white/20 blur-xl" />
                        <div className="absolute bottom-4 right-4 h-24 w-24 rounded-full bg-yellow-200/20 blur-xl" />
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-center translate-y-1/2">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white">
                            <CloudSun className="h-10 w-10 text-[#F59E0B]" />
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="pt-12 pb-8 px-8 text-center">
                    <h2 className="text-2xl font-bold text-[#1e293b] mb-2">
                        Coming Soon!
                    </h2>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF5EB] px-3 py-1 mb-4">
                        <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                        <span className="text-xs font-semibold text-[#D97706] uppercase tracking-wide">
                            Work in Progress
                        </span>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                        We're crafting something magical for you. The app isn't quite ready to launch yet, but the sunset is just the beginning of a new day!
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#E11D48] px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-95"
                    >
                        Notify Me When Ready
                    </button>
                </div>
            </div>
        </div>
    );
}
