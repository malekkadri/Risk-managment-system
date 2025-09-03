"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("tooltip", className)} {...props}>
      {props.children}
    </div>
  )
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        ref,
        ...props,
      })
    }
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} {...props}>
        {children}
      </span>
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("tooltip-text", className)} {...props} />
  )
)
TooltipContent.displayName = "TooltipContent"

