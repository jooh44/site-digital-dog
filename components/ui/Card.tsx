'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'service'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const baseStyles = 'rounded-xl p-6 transition-all duration-300'
  
  const variants = {
    default: 'bg-white dark:bg-dark-blue shadow-card hover:shadow-card-hover',
    service: 'bg-gradient-to-br from-dark-blue to-darker-blue border-l-4 border-primary-blue hover:-translate-y-1 hover:shadow-card-hover'
  }
  
  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}

