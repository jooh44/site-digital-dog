'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-light-blue mb-2"
          >
            {label}
            {props.required && <span className="text-gradient-pink ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-dark-blue border-2 border-primary-blue/30',
            'text-white placeholder:text-light-blue/50',
            'focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20',
            'transition-all duration-200',
            error && 'border-gradient-pink focus:border-gradient-pink focus:ring-gradient-pink/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-1 text-sm text-gradient-pink"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

