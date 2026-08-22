import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-cream-50/15 bg-night-800/60 px-4 py-2 text-sm text-cream-50 shadow-sm transition-colors placeholder:text-bark-500 focus-visible:border-lamp-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lamp-400/30 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }