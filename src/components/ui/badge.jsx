import React from "react";
import { cn } from "../../lib/utils";

const Badge = ({ className, variant = "default", ...props }) => {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "border-transparent bg-[#FFF1F2] text-[#E11D48] hover:bg-[#FFE4E6]": variant === "default",
                    "border-transparent bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7]": variant === "amber",
                },
                className
            )}
            {...props}
        />
    );
};

export { Badge };
