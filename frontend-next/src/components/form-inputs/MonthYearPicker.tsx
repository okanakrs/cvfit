'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MonthYearPickerProps {
  value: string // Format: MM/YYYY
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  locale?: string
}

const MONTHS = [
  { num: 1, name: 'Ocak' },
  { num: 2, name: 'Şubat' },
  { num: 3, name: 'Mart' },
  { num: 4, name: 'Nisan' },
  { num: 5, name: 'Mayıs' },
  { num: 6, name: 'Haziran' },
  { num: 7, name: 'Temmuz' },
  { num: 8, name: 'Ağustos' },
  { num: 9, name: 'Eylül' },
  { num: 10, name: 'Ekim' },
  { num: 11, name: 'Kasım' },
  { num: 12, name: 'Aralık' },
]

const COPY = {
  tr: { year: 'Yıl', month: 'Ay', close: 'Tamam' },
  en: { year: 'Year', month: 'Month', close: 'Done' },
} as const

export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'MM/YYYY',
  disabled = false,
  className,
  locale = 'tr',
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayMonth, setDisplayMonth] = useState<number>(new Date().getMonth() + 1)
  const [displayYear, setDisplayYear] = useState<number>(new Date().getFullYear())

  const parseValue = (val: string) => {
    const match = val.match(/^(\d{1,2})\/(\d{4})$/)
    if (match) {
      return { month: parseInt(match[1]), year: parseInt(match[2]) }
    }
    return null
  }

  const parsed = parseValue(value)
  const selectedMonth = parsed?.month
  const selectedYear = parsed?.year

  const handleMonthChange = (m: number) => {
    const yearStr = String(displayYear)
    const monthStr = String(m).padStart(2, '0')
    onChange(`${monthStr}/${yearStr}`)
    setIsOpen(false)
  }

  const handleYearChange = (y: number) => {
    setDisplayYear(y)
  }

  const previousYear = () => {
    setDisplayYear(y => Math.max(1900, y - 1))
  }

  const nextYear = () => {
    setDisplayYear(y => Math.min(new Date().getFullYear() + 1, y + 1))
  }

  // Generate year options (last 50 years + next year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 52 }, (_, i) => currentYear - 50 + i)
  const copy = COPY[locale === 'en' ? 'en' : 'tr']
  const monthLabels = locale === 'en'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : MONTHS.map(({ name }) => name.slice(0, 3))

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
            if (val.match(/^(\d{1,2})\/(\d{4})?$/) || val === '') {
              onChange(val)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          )}
          maxLength={7}
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
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-lg shadow-lg p-4">
          <div className="space-y-3">
            {/* Year selector */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">{copy.year}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={previousYear}
                  className="p-1 hover:bg-muted rounded"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <Select value={String(displayYear)} onValueChange={(y) => y && handleYearChange(parseInt(y))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map(y => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={nextYear}
                  className="p-1 hover:bg-muted rounded"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Month selector */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">{copy.month}</div>
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map(({ num, name }) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleMonthChange(num)}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium transition-colors border',
                      selectedMonth === num && selectedYear === displayYear
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {monthLabels[num - 1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Close button */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              {copy.close}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
