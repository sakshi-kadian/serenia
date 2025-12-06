import React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-2xl border border-[#E11D48]/10 bg-[#FFF1F2]/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:border-[#E11D48]/20",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
Card.displayName = "Card";

export { Card };
