// Form validation and formatting utilities for CV builder

export const formatters = {
  // Format full name - capitalize each word
  fullName: (value: string): string => {
    return value
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  },

  // Format phone number for Turkish numbers - accept only digits, +, and spaces
  phone: (value: string): string => {
    // Remove everything except digits and +
    let cleaned = value.replace(/[^0-9+]/g, '')
    
    // If it starts with +90, format as +90 5XX XXX XX XX
    if (cleaned.startsWith('+90')) {
      const digits = cleaned.slice(3)
      if (digits.length === 10) {
        return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
      }
      return `+90 ${digits}`.trim()
    }
    
    // If it starts with 90, convert to +90 format
    if (cleaned.startsWith('90') && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned
      const digits = cleaned.slice(3)
      if (digits.length === 10) {
        return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
      }
      return `+90 ${digits}`.trim()
    }

    // If starts with 5, treat as Turkish number (starts with 5)
    if (cleaned.startsWith('5') && !cleaned.startsWith('+')) {
      if (cleaned.length === 10) {
        return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`
      }
      if (cleaned.length <= 10) {
        return `+90 ${cleaned}`.trim()
      }
    }

    return value
  },

  // Format city/location - text only, no numbers
  city: (value: string): string => {
    return value.replace(/[0-9]/g, '')
  },

  // Format degree field - title case
  titleCase: (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }
}

export const validators = {
  // Email validation
  email: (email: string): { valid: boolean; error?: string } => {
    if (!email) return { valid: true } // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Geçerli bir e-posta adresi girin' }
    }
    return { valid: true }
  },

  // URL validation
  url: (url: string): { valid: boolean; error?: string } => {
    if (!url) return { valid: true } // Optional field
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      return { valid: false, error: 'URL https:// ile başlamalıdır' }
    }
    try {
      new URL(url)
      return { valid: true }
    } catch {
      return { valid: false, error: 'Geçerli bir URL girin' }
    }
  },

  // Phone validation - Turkish format
  phone: (phone: string): { valid: boolean; error?: string } => {
    if (!phone) return { valid: true } // Optional field
    const phoneRegex = /^\+90 5\d{2} \d{3} \d{2} \d{2}$/
    if (!phoneRegex.test(phone)) {
      return { valid: false, error: 'Telefon formatı: +90 5XX XXX XX XX' }
    }
    return { valid: true }
  },

  // Text only - no numbers
  textOnly: (text: string): { valid: boolean; error?: string } => {
    if (!text) return { valid: true } // Optional field
    if (/[0-9]/.test(text)) {
      return { valid: false, error: 'Sayı içeremez' }
    }
    return { valid: true }
  },

  // GPA validation - 0.00 to 4.00
  gpa: (gpa: string): { valid: boolean; error?: string } => {
    if (!gpa) return { valid: true } // Optional field
    const num = parseFloat(gpa)
    if (isNaN(num) || num < 0 || num > 4) {
      return { valid: false, error: 'GPA 0.00 ile 4.00 arasında olmalıdır' }
    }
    const parts = gpa.split('.')
    if (parts[1] && parts[1].length > 2) {
      return { valid: false, error: 'En fazla 2 ondalık basamak' }
    }
    return { valid: true }
  },

  // Description length - max 500 chars
  description: (text: string): { valid: boolean; error?: string } => {
    if (text.length > 500) {
      return { valid: false, error: `Maksimum 500 karakter (${text.length}/500)` }
    }
    return { valid: true }
  },

  // Date validation - check if end date is before start date
  dateRange: (startDate: string, endDate: string): { valid: boolean; error?: string } => {
    if (!startDate || !endDate) return { valid: true }
    if (new Date(startDate) > new Date(endDate)) {
      return { valid: false, error: 'Bitiş tarihi başlangıçtan önce olamaz' }
    }
    return { valid: true }
  },

  // Month/Year format - MM/YYYY
  monthYear: (date: string): { valid: boolean; error?: string } => {
    if (!date) return { valid: true }
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/
    if (!regex.test(date)) {
      return { valid: false, error: 'Format: MM/YYYY' }
    }
    return { valid: true }
  },

  // Year format - YYYY
  year: (year: string): { valid: boolean; error?: string } => {
    if (!year) return { valid: true }
    const num = parseInt(year, 10)
    const currentYear = new Date().getFullYear()
    if (isNaN(num) || num < 1900 || num > currentYear + 1) {
      return { valid: false, error: `Yıl 1900 ile ${currentYear + 1} arasında olmalıdır` }
    }
    return { valid: true }
  },

  // Required field check
  required: (value: string, fieldName: string): { valid: boolean; error?: string } => {
    if (!value || !value.trim()) {
      return { valid: false, error: `${fieldName} zorunludur` }
    }
    return { valid: true }
  },

  // Skill name - no duplicates (case insensitive)
  skillUnique: (name: string, existingSkills: string[]): { valid: boolean; error?: string } => {
    const normalizedName = name.toLowerCase().trim()
    if (existingSkills.some(skill => skill.toLowerCase().trim() === normalizedName)) {
      return { valid: false, error: 'Bu beceri zaten eklenmiş' }
    }
    return { valid: true }
  }
}

// Format GPA to 2 decimal places
export const formatGPA = (value: string): string => {
  // Remove non-numeric characters except dot
  let cleaned = value.replace(/[^0-9.]/g, '')
  
  // Remove multiple dots
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit to 2 decimal places
  const [intPart, decPart] = cleaned.split('.')
  if (decPart && decPart.length > 2) {
    return intPart + '.' + decPart.slice(0, 2)
  }
  
  return cleaned
}

// Parse month/year string to date
export const parseMonthYear = (dateStr: string): { month: number; year: number } | null => {
  const match = dateStr.match(/^(\d{1,2})\/(\d{4})$/)
  if (!match) return null
  return {
    month: parseInt(match[1], 10),
    year: parseInt(match[2], 10)
  }
}

// Format month/year to string
export const formatMonthYear = (month: number, year: number): string => {
  const m = String(month).padStart(2, '0')
  return `${m}/${year}`
}

// Compare month/year dates
export const compareMonthYears = (date1: string, date2: string): number => {
  const d1 = parseMonthYear(date1)
  const d2 = parseMonthYear(date2)
  if (!d1 || !d2) return 0
  if (d1.year !== d2.year) return d1.year - d2.year
  return d1.month - d2.month
}

// Common Turkish job titles for autocomplete
export const COMMON_JOB_TITLES = [
  'Yazılım Geliştirici',
  'Yazılım Mühendisi',
  'Veri Analisti',
  'Veri Bilimci',
  'Sistem Yöneticisi',
  'Ağ Yöneticisi',
  'Siber Güvenlik Uzmanı',
  'Proje Yöneticisi',
  'Ürün Müdürü',
  'İş Analisti',
  'Grafik Tasarımcı',
  'UI/UX Tasarımcı',
  'Pazarlama Müdürü',
  'İnsan Kaynakları Müdürü',
  'Mali Müşavir',
  'Muhasebe Müdürü',
  'Satış Müdürü',
  'Satış Temsilcisi',
  'Müşteri Hizmetleri Uzmanı',
  'Operasyon Müdürü',
]

// Common languages
export const COMMON_LANGUAGES = [
  'Türkçe',
  'İngilizce',
  'Almanca',
  'Fransızca',
  'İspanyolca',
  'İtalyanca',
  'Portekizce',
  'Rusça',
  'Çince',
  'Japonca',
  'Korece',
  'Arapça',
]
