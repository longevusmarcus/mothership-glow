"use client"

import React, { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  loadingText?: string
  successText?: string
  icon?: React.ReactNode
  onAsyncClick?: () => Promise<void>
}

export function InteractiveHoverButton({
  text = "Button",
  loadingText = "Processing...",
  successText = "Complete!",
  icon,
  className,
  onClick,
  onAsyncClick,
  children,
  ...props
}: InteractiveHoverButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const label = children || text

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status !== "idle") return
    if (onAsyncClick) {
      setStatus("loading")
      try {
        await onAsyncClick()
        setStatus("success")
        setTimeout(() => setStatus("idle"), 3000)
      } catch {
        setStatus("idle")
      }
    } else {
      onClick?.(e)
    }
  }

  return (
    <button
      className={cn(
        "group relative inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-border bg-card px-6 text-[13px] font-heading font-medium text-foreground transition-all duration-300 hover:border-foreground/20",
        status === "loading" && "pointer-events-none",
        status === "success" && "pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {/* Sliding background */}
      <div className="absolute inset-0 flex w-full [transform:translateX(-100%)] group-hover:[transform:translateX(0)] transition-transform duration-300 ease-out">
        <div className="h-full w-full bg-foreground/5" />
      </div>

      {/* Icon */}
      {icon && <span className="relative z-10 mr-2 shrink-0">{icon}</span>}

      {/* Content */}
      <AnimatePresence mode="wait" initial={false}>
        {status === "idle" ? (
          <motion.span
            key="idle"
            className="relative z-10 flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {label}
            <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </motion.span>
        ) : status === "loading" ? (
          <motion.span
            key="loading"
            className="relative z-10 flex items-center gap-2 text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
            {loadingText}
          </motion.span>
        ) : (
          <motion.span
            key="success"
            className="relative z-10 flex items-center gap-2 text-success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="h-3.5 w-3.5" />
            {successText}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
