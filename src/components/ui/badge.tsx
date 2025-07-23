import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  // add any custom props here if needed
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("badge", className)} {...props} />
  )
);

Badge.displayName = "Badge";
export { Badge };
