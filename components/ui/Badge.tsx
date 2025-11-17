'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'outline' | 'filled'
  pulse?: boolean
}

export function Badge({ variant = 'outline', pulse = false, className, children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300'
  
  const variants = {
    outline: 'border-2 border-primary-blue text-light-blue hover:bg-primary-blue/10',
    filled: 'bg-primary-blue text-white'
  }
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

