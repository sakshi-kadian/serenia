import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                {
                    "bg-[#E11D48] text-white hover:bg-[#be123c] shadow-lg shadow-[#E11D48]/30 hover:shadow-[#E11D48]/50": variant === "default",
                    "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]": variant === "outline",
                    "hover:bg-[#FFF1F2] text-[#E11D48]": variant === "ghost",
                    "h-10 px-4 py-2": size === "default",
                    "h-12 px-8 text-lg": size === "lg",
                    "h-9 px-3": size === "sm",
                },
                className
            )}
            {...props}
        />
    );
});
Button.displayName = "Button";

export { Button };
