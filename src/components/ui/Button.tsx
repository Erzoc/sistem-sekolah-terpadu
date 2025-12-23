'use client'

import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function Button({ 
  variant = 'primary', 
  size = 'default', 
  fullWidth = false, 
  children, 
  onClick,
  className 
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
  }
  
  const sizes = {
    sm: 'h-9 px-3',
    default: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  }

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
