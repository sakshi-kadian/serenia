import React from "react";
import { X } from "lucide-react";

export function ModalComingSoon({ isOpen, onClose }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content - Full Gradient */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#E11D48] shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300">

                {/* Decorational Blurs */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-[-50px] left-[-50px] h-40 w-40 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-[-50px] right-[-50px] h-40 w-40 rounded-full bg-yellow-200/20 blur-3xl" />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* content */}
                <div className="flex flex-col items-center pt-12 pb-8 px-8 text-center text-white relative z-10">

                    <h2 className="text-3xl font-bold mb-3 drop-shadow-sm">
                        Coming Soon!
                    </h2>

                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 mb-6 ring-1 ring-white/30">
                        <span className="text-xs font-bold uppercase tracking-wide text-yellow-50 shadow-sm">
                            Work in Progress
                        </span>
                    </div>

                    <p className="text-white/90 mb-8 leading-relaxed text-lg font-medium drop-shadow-sm">
                        We're crafting something magical for you. The app isn't quite ready to launch yet, but the sunset is just the beginning of a new day!
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-white px-6 py-3.5 font-bold text-[#D97706] shadow-lg hover:shadow-xl hover:bg-yellow-50 hover:scale-[1.02] transition-all active:scale-95"
                    >
                        I'll be waiting!
                    </button>
                </div>
            </div>
        </div>
    );
}
