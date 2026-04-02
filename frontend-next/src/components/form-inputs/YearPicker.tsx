'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface YearPickerProps {
  value: string // Format: YYYY
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function YearPicker({
  value,
  onChange,
  placeholder = 'YYYY',
  disabled = false,
  className,
}: YearPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayYear, setDisplayYear] = useState<number>(
    value ? parseInt(value) : new Date().getFullYear()
  )

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 52 }, (_, i) => currentYear - 50 + i)

  const handleYearSelect = (y: number) => {
    onChange(String(y))
    setIsOpen(false)
  }

  const previousYear = () => {
    setDisplayYear(y => Math.max(1900, y - 1))
  }

  const nextYear = () => {
    setDisplayYear(y => Math.min(currentYear + 1, y + 1))
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Calendar className="size-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const val = e.target.value
            if (val.match(/^\d{0,4}$/) || val === '') {
              onChange(val)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          )}
          maxLength={4}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded disabled:opacity-50"
        >
          <Calendar className="size-4 text-muted-foreground" />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-48">
          <div className="space-y-3">
            {/* Year selector header */}
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={previousYear}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm font-medium flex-1 text-center">{displayYear}</span>
              <button
                type="button"
                onClick={nextYear}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Year grid */}
            <Select value={String(displayYear)} onValueChange={(y) => y && setDisplayYear(parseInt(y))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {years.map(y => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year grid buttons */}
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }, (_, i) => {
                const offset = Math.floor(displayYear / 12) * 12
                const year = offset + i * 4
                if (year < 1900 || year > currentYear + 1) return null
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium transition-colors border',
                      value === String(year)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {year}
                  </button>
                )
              }).filter(Boolean)}
            </div>

            {/* Close button */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Tamam
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
