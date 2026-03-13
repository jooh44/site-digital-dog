'use client'

import { HTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'service'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl p-6 transition-all duration-300'
    
    const variants = {
      default: 'bg-white dark:bg-dark-blue shadow-card hover:shadow-card-hover',
      service: 'bg-gradient-to-br from-dark-blue to-darker-blue border-l-4 border-transparent hover:shadow-card-hover'
    }
    
    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

