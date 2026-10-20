'use client'

import { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  required?: boolean
  optional?: boolean
  optionalLabel?: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  required = false,
  optional = false,
  optionalLabel = "(opsiyonel)",
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-[13px] font-medium text-foreground/80">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
        {optional && <span className="text-muted-foreground/70 text-xs font-normal ml-1.5">{optionalLabel}</span>}
      </label>

      {children}

      {error && (
        <div className="flex items-start gap-1.5 text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
          <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
