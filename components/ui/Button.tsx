'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const baseStyles = 'px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-gradient-orange to-gradient-pink text-white hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg hover:shadow-xl',
    secondary: 'bg-transparent border-2 border-primary-blue text-light-blue hover:bg-primary-blue hover:text-white hover:shadow-[0_0_20px_rgba(0,188,212,0.5)]'
  }
  
  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}

