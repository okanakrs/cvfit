export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface Skill {
  id: string
  name: string
  level: 'Başlangıç' | 'Orta' | 'İleri' | 'Uzman'
}

export interface Language {
  id: string
  name: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Anadil'
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface CVData {
  personal: {
    fullName: string
    title: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    summary: string
    photo?: string
  }
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
}

export const emptyCVData: CVData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
}
