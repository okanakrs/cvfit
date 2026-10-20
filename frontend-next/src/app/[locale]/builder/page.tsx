"use client"
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import type { CVData, Experience, Education, Skill, Language, Certification } from "@/types/cv"
import { emptyCVData } from "@/types/cv"
import { cn } from "@/lib/utils"
import { getCVLabels } from "@/lib/cv-labels"
import { mapAnalysisToCV } from "@/lib/cv-mapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ClassicTemplate,
  ModernTemplate,
  MinimalTemplate,
  ExecutiveTemplate,
  CreativeTemplate,
  ElegantTemplate,
  ProfessionalTemplate,
  TechTemplate,
  SteelTemplate,
  BordeauxTemplate,
  NavyTemplate,
  TealTemplate,
} from "@/components/cv-templates"
import {
  Plus,
  Trash2,
  ChevronDown,
  FileDown,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Award,
  Loader2,
  Cloud,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Upload,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useDraftSync, loadDraftFromCloud, getSessionToken } from "@/lib/use-draft-sync"
import { PaymentModal } from "@/components/payment-modal"
import { ATSModal } from "@/components/ats-modal"
import { toast } from "sonner"
import { useTranslations, useLocale } from "next-intl"
import { MonthYearPicker, YearPicker, SkillTagInput, FormField } from "@/components/form-inputs"
import {
  formatters,
  validators,
  formatGPA,
  compareMonthYears,
  COMMON_JOB_TITLES,
  COMMON_LANGUAGES,
} from "@/lib/form-validation"

type Template = "classic" | "modern" | "minimal" | "executive" | "creative" | "elegant" | "professional" | "tech" | "steel" | "bordeaux" | "navy" | "teal"
const genId = () => crypto.randomUUID()
const TEMPLATE_VALUES = new Set<Template>([
  "classic", "modern", "minimal", "executive", "creative", "elegant",
  "professional", "tech", "steel", "bordeaux", "navy", "teal",
])

function parseTemplateParam(value: string | null): Template | null {
  if (!value) return null
  return TEMPLATE_VALUES.has(value as Template) ? (value as Template) : null
}

function TemplateThumbnail({ tmpl, active, onClick, label }: { tmpl: Template; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg border-2 p-1.5 transition-all cursor-pointer hover:border-foreground/40",
        active ? "border-foreground bg-muted" : "border-transparent"
      )}
    >
      <div className="w-14 h-[72px] rounded bg-white overflow-hidden shadow-sm">
        <MiniPreview template={tmpl} />
      </div>
      <span className="text-[10px] font-medium text-foreground/80">{label}</span>
    </button>
  )
}

function MiniPreview({ template }: { template: Template }) {
  if (template === "modern")
    return (
      <div className="flex h-full">
        <div className="w-[35%] bg-gray-100 p-1">
          <div className="h-1 w-6 bg-gray-400 rounded mb-1" />
          <div className="h-0.5 w-4 bg-[#2563eb]/40 rounded mb-1.5" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-5 bg-gray-300 rounded" />
            <div className="h-0.5 w-4 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="w-[65%] p-1">
          <div className="h-0.5 w-6 bg-[#2563eb]/40 rounded mb-1" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "minimal")
    return (
      <div className="flex h-full">
        <div className="w-[33%] p-1" style={{ backgroundColor: "#263444" }}>
          <div className="mx-auto w-3.5 h-3.5 rounded-full mb-1" style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
          <div className="h-0.5 w-5 rounded mb-0.5 mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
          <div className="h-px w-4 rounded mx-auto mb-1.5" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          <div className="space-y-0.5">
            <div className="h-0.5 w-5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
            <div className="h-0.5 w-4 rounded" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>
        <div className="w-[67%] p-1">
          <div className="h-0.5 w-6 rounded mb-1" style={{ backgroundColor: "#263444", opacity: 0.5 }} />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "executive")
    return (
      <div>
        <div className="bg-slate-800 p-1.5 pb-1">
          <div className="h-1 w-7 bg-white/80 rounded mb-0.5" />
          <div className="h-0.5 w-5 bg-white/40 rounded" />
        </div>
        <div className="p-1.5">
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "creative")
    return (
      <div className="flex h-full">
        <div className="w-[34%] bg-violet-500 p-1">
          <div className="mx-auto w-3 h-3 rounded-full bg-white/30 mb-1" />
          <div className="h-0.5 w-5 bg-white/60 rounded mx-auto mb-1.5" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-5 bg-white/30 rounded" />
            <div className="h-0.5 w-4 bg-white/30 rounded" />
          </div>
        </div>
        <div className="w-[66%] p-1">
          <div className="h-0.5 w-6 bg-violet-400 rounded mb-1" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "elegant")
    return (
      <div className="p-1.5">
        <div className="w-3 h-0.5 bg-teal-500 rounded mb-1" />
        <div className="h-1.5 w-8 bg-gray-300 rounded mb-0.5" />
        <div className="h-0.5 w-5 bg-teal-400 rounded mb-1.5" />
        <div className="flex gap-1 mb-1">
          <div className="w-1 h-1 rounded-full bg-teal-500" />
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-3/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "professional")
    return (
      <div>
        <div className="h-0.5 bg-red-500" />
        <div className="p-1.5">
          <div className="h-1 w-7 bg-gray-400 rounded mb-0.5" />
          <div className="h-0.5 w-5 bg-red-400 rounded mb-1.5" />
          <div className="border-l-2 border-red-400 pl-1 mb-1">
            <div className="h-0.5 w-full bg-gray-100 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "tech")
    return (
      <div className="flex h-full">
        <div className="w-[36%] bg-slate-900 p-1">
          <div className="h-1 w-6 bg-white/60 rounded mb-0.5" />
          <div className="h-0.5 w-4 bg-sky-400/60 rounded mb-1.5" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-5 bg-slate-600 rounded" />
            <div className="h-0.5 w-4 bg-sky-400/30 rounded" />
          </div>
        </div>
        <div className="w-[64%] p-1">
          <div className="h-0.5 w-6 bg-slate-800 rounded mb-1" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "bordeaux")
    return (
      <div className="flex h-full">
        <div className="w-[33%] p-1" style={{ backgroundColor: "#7b1a1a" }}>
          <div className="mx-auto w-3.5 h-3.5 rounded-full mb-1" style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
          <div className="h-0.5 w-5 rounded mb-1 mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
          <div className="space-y-0.5">
            <div className="h-0.5 w-5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
            <div className="h-0.5 w-4 rounded" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>
        <div className="w-[67%] p-1">
          <div className="h-0.5 w-6 rounded mb-1" style={{ backgroundColor: "#7b1a1a", opacity: 0.5 }} />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "navy")
    return (
      <div className="flex h-full">
        <div className="w-[33%] p-1" style={{ backgroundColor: "#1a2744" }}>
          <div className="mx-auto w-3.5 h-3.5 rounded-full mb-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          <div className="h-0.5 w-5 rounded mb-1 mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
          <div className="space-y-0.5">
            <div className="h-0.5 w-5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
            <div className="h-0.5 w-4 rounded" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
          </div>
        </div>
        <div className="w-[67%] p-1">
          <div className="h-0.5 w-6 rounded mb-1" style={{ backgroundColor: "#1a2744", opacity: 0.4 }} />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  if (template === "teal")
    return (
      <div>
        <div className="p-1.5 pb-1" style={{ backgroundColor: "#0d7b7b" }}>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
            <div>
              <div className="h-1 w-6 bg-white/70 rounded mb-0.5" />
              <div className="h-0.5 w-4 bg-white/40 rounded" />
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-[60%] p-1 border-r border-gray-100">
            <div className="h-0.5 w-5 rounded mb-1" style={{ backgroundColor: "#0d7b7b", opacity: 0.6 }} />
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="w-[40%] p-1">
            <div className="h-0.5 w-5 rounded mb-1" style={{ backgroundColor: "#0d7b7b", opacity: 0.4 }} />
            <div className="space-y-1">
              <div className="h-1 w-full bg-teal-100 rounded" />
              <div className="h-1 w-4/5 bg-teal-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  if (template === "steel")
    return (
      <div className="flex h-full">
        <div className="w-[30%] bg-[#3d6b8e] p-1">
          <div className="h-0.5 w-5 bg-white/60 rounded mb-0.5" />
          <div className="h-0.5 w-4 bg-white/30 rounded mb-1" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-5 bg-white/40 rounded" />
            <div className="h-0.5 w-4 bg-white/30 rounded" />
          </div>
        </div>
        <div className="w-[70%] p-1">
          <div className="h-1.5 w-8 bg-gray-300 rounded mb-1" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            <div className="h-0.5 w-4 bg-gray-300 rounded" />
            <div className="h-1 w-6 bg-[#2c5072]/40 rounded" />
          </div>
        </div>
      </div>
    )
  return (
    <div className="p-1.5">
      <div className="flex flex-col items-center mb-1">
        <div className="h-1 w-8 bg-gray-400 rounded mb-0.5" />
        <div className="h-0.5 w-5 bg-gray-300 rounded" />
      </div>
      <div className="h-px w-full bg-gray-400 mb-1" />
      <div className="space-y-0.5">
        <div className="h-0.5 w-full bg-gray-200 rounded" />
        <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
        <div className="h-0.5 w-full bg-gray-200 rounded" />
      </div>
    </div>
  )
}

const A4_WIDTH = 794
const A4_HEIGHT = 1123

function CVPreview({ data, template, zoom, previewRef, locale }: { data: CVData; template: Template; zoom: number; previewRef?: React.RefObject<HTMLDivElement | null>; locale: string }) {
  return (
    <div style={{ width: A4_WIDTH * zoom, height: A4_HEIGHT * zoom, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: A4_WIDTH, height: A4_HEIGHT, position: "absolute", top: 0, left: 0 }}>
        <div ref={previewRef} className="bg-white text-gray-900 shadow-xl" style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}>
          {template === "classic" && <ClassicTemplate data={data} locale={locale} />}
          {template === "modern" && <ModernTemplate data={data} locale={locale} />}
          {template === "minimal" && <MinimalTemplate data={data} locale={locale} />}
          {template === "executive" && <ExecutiveTemplate data={data} locale={locale} />}
          {template === "creative" && <CreativeTemplate data={data} locale={locale} />}
          {template === "elegant" && <ElegantTemplate data={data} locale={locale} />}
          {template === "professional" && <ProfessionalTemplate data={data} locale={locale} />}
          {template === "tech" && <TechTemplate data={data} locale={locale} />}
          {template === "steel" && <SteelTemplate data={data} locale={locale} />}
          {template === "bordeaux" && <BordeauxTemplate data={data} locale={locale} />}
          {template === "navy" && <NavyTemplate data={data} locale={locale} />}
          {template === "teal" && <TealTemplate data={data} locale={locale} />}
        </div>
      </div>
    </div>
  )
}

const SKILL_LEVELS: Skill["level"][] = ["Başlangıç", "Orta", "İleri", "Uzman"]
const LANG_LEVELS: Language["level"][] = ["A1", "A2", "B1", "B2", "C1", "C2", "Anadil"]

const SKILL_LEVEL_LABELS: Record<string, Record<Skill["level"], string>> = {
  tr: { "Başlangıç": "Başlangıç", "Orta": "Orta", "İleri": "İleri", "Uzman": "Uzman" },
  en: { "Başlangıç": "Beginner", "Orta": "Intermediate", "İleri": "Advanced", "Uzman": "Expert" },
}

const LANG_LEVEL_LABELS: Record<string, Record<string, string>> = {
  tr: { "Anadil": "Anadil" },
  en: { "Anadil": "Native" },
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

function ensureIds(data: CVData): CVData {
  const g = () => crypto.randomUUID()
  return {
    ...data,
    experience:     (data.experience     || []).map(e => e.id ? e : { ...e, id: g() }),
    education:      (data.education      || []).map(e => e.id ? e : { ...e, id: g() }),
    skills:         (data.skills         || []).map(e => e.id ? e : { ...e, id: g() }),
    languages:      (data.languages      || []).map(e => e.id ? e : { ...e, id: g() }),
    certifications: (data.certifications || []).map(e => e.id ? e : { ...e, id: g() }),
  }
}

function CVBuilderPage() {
  const searchParams = useSearchParams()
  const { user, profile, loading: authLoading, refresh } = useAuth()
  const t = useTranslations("builder")
  const tt = useTranslations("templates")
  const locale = useLocale()

  const fieldCopy = locale === "tr"
    ? {
        optional: "(opsiyonel)",
        skillSection: "Beceriler",
        languageSection: "Dil",
        levelSection: "Seviye",
        fullName: "Ad Soyad",
        title: "Meslek / Pozisyon",
        email: "E-posta",
        phone: "Telefon",
        location: "Şehir",
        linkedin: "LinkedIn",
        website: "Website",
        summary: "Özet",
        company: "Şirket",
        position: "Pozisyon",
        startDate: "Başlangıç Tarihi",
        endDate: "Bitiş Tarihi",
        description: "Açıklama",
        school: "Okul / Üniversite",
        field: "Bölüm",
        degree: "Derece",
        startYear: "Başlama Yılı",
        endYear: "Bitirme Yılı",
        gpa: "GPA",
        language: "Dil",
        level: "Seviye",
        certificateName: "Sertifika Adı",
        issuer: "Veriliş Kuruluşu",
        certificateDate: "Tarih",
        certificateUrl: "Sertifika Linki",
        ongoing: "Halen çalışıyorum",
        continuing: "Devam ediyor",
        currentStudiesHint: "Hala öğreniyorsanız boş bırakın",
        dateRangeError: "Bitiş tarihi başlangıçtan önce olamaz",
        gpaHint: "Örn: 3.85 (0.00 - 4.00)",
        phoneHint: "Örn: +90 5XX XXX XX XX",
        linkedInHint: "https://linkedin.com/...",
        websiteHint: "https://example.com",
        namePlaceholder: "Adınız Soyadınız",
        titlePlaceholder: "Frontend Developer",
        emailPlaceholder: "E-posta",
        phonePlaceholder: "Telefon",
        locationPlaceholder: "Konum",
        linkedinPlaceholder: "LinkedIn URL",
        websitePlaceholder: "Website",
        summaryPlaceholder: "Kendinizi kısaca tanıtın...",
        companyPlaceholder: "Şirket",
        positionPlaceholder: "Pozisyon",
        descriptionPlaceholder: "Görev ve başarılarınızı yazın...",
        schoolPlaceholder: "Okul / Üniversite",
        fieldPlaceholder: "Bölüm",
        degreePlaceholder: "Derece (Lise, Lisans...)",
        monthYearPlaceholder: "MM/YYYY",
        yearPlaceholder: "YYYY",
        gpaPlaceholder: "0.00",
        skillPlaceholder: "Beceri adı yazıp Enter tuşuna basın",
        skillHelper: "Beceri adı yazıp Enter tuşuna basın veya virgül kullanın.",
        certNamePlaceholder: "Sertifika Adı",
        certIssuerPlaceholder: "Veren Kurum",
        certUrlPlaceholder: "URL (opsiyonel)",
      }
    : {
        optional: "(optional)",
        skillSection: "Skills",
        languageSection: "Language",
        levelSection: "Level",
        fullName: "Full Name",
        title: "Job Title / Position",
        email: "Email",
        phone: "Phone",
        location: "City",
        linkedin: "LinkedIn",
        website: "Website",
        summary: "Summary",
        company: "Company",
        position: "Position",
        startDate: "Start Date",
        endDate: "End Date",
        description: "Description",
        school: "School / University",
        field: "Department",
        degree: "Degree",
        startYear: "Start Year",
        endYear: "End Year",
        gpa: "GPA",
        language: "Language",
        level: "Level",
        certificateName: "Certificate Name",
        issuer: "Issuing Organization",
        certificateDate: "Date",
        certificateUrl: "Certificate URL",
        ongoing: "Currently working",
        continuing: "In progress",
        currentStudiesHint: "Leave empty if you're still studying",
        dateRangeError: "End date cannot be before start date",
        gpaHint: "E.g. 3.85 (0.00 - 4.00)",
        phoneHint: "E.g. +90 5XX XXX XX XX",
        linkedInHint: "https://linkedin.com/...",
        websiteHint: "https://example.com",
        namePlaceholder: "Your full name",
        titlePlaceholder: "Frontend Developer",
        emailPlaceholder: "Email",
        phonePlaceholder: "Phone",
        locationPlaceholder: "City",
        linkedinPlaceholder: "LinkedIn URL",
        websitePlaceholder: "Website",
        summaryPlaceholder: "Write a short summary about yourself...",
        companyPlaceholder: "Company",
        positionPlaceholder: "Position",
        descriptionPlaceholder: "Write your responsibilities and achievements...",
        schoolPlaceholder: "School / University",
        fieldPlaceholder: "Department",
        degreePlaceholder: "Degree (High School, Bachelor...)",
        monthYearPlaceholder: "MM/YYYY",
        yearPlaceholder: "YYYY",
        gpaPlaceholder: "0.00",
        skillPlaceholder: "Type a skill and press Enter",
        skillHelper: "Type a skill and press Enter or use comma.",
        certNamePlaceholder: "Certificate Name",
        certIssuerPlaceholder: "Issuing Organization",
        certUrlPlaceholder: "URL (optional)",
      }

  const TEMPLATES: { value: Template; label: string }[] = [
    { value: "classic",      label: tt("classic") },
    { value: "modern",       label: tt("modern") },
    { value: "minimal",      label: tt("minimal") },
    { value: "executive",    label: tt("executive") },
    { value: "creative",     label: tt("creative") },
    { value: "elegant",      label: tt("elegant") },
    { value: "professional", label: tt("professional") },
    { value: "tech",         label: tt("tech") },
    { value: "steel",        label: tt("steel") },
    { value: "bordeaux",     label: tt("bordeaux") },
    { value: "navy",         label: tt("navy") },
    { value: "teal",         label: tt("teal") },
  ]

  const [cvData, setCvData] = useState<CVData>(emptyCVData)
  const [template, setTemplate] = useState<Template>("classic")
  const [ready, setReady] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle")
  const [zoom, setZoom] = useState(0.85)
  const cvPreviewRef = useRef<HTMLDivElement>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "docx">("pdf")
  const [atsOpen, setAtsOpen] = useState(false)
  const [parsing, setParsing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewHostRef = useRef<HTMLDivElement>(null)
  const [previewHostWidth, setPreviewHostWidth] = useState(0)

  useEffect(() => {
    if (!previewHostRef.current || typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      setPreviewHostWidth(entry.contentRect.width)
    })

    observer.observe(previewHostRef.current)
    return () => observer.disconnect()
  }, [])

  const previewZoom = previewHostWidth > 0
    ? Math.min(zoom, Math.max(0.34, (previewHostWidth - 16) / A4_WIDTH))
    : zoom

  async function handleCVUpload(file: File) {
    if (!file || file.type !== "application/pdf") {
      toast.error(t("toast_upload_pdf_only"))
      return
    }
    setParsing(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch(`${API_URL}/api/cv/parse`, { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data))
      const parsed = data.cv_data
      const g = () => crypto.randomUUID()
      setCvData({
        personal: { ...emptyCVData.personal, ...parsed.personal },
        experience: (parsed.experience || []).map((e: Record<string,unknown>) => ({ id: g(), ...e })),
        education: (parsed.education || []).map((e: Record<string,unknown>) => ({ id: g(), ...e })),
        skills: (parsed.skills || []).map((e: Record<string,unknown>) => ({ id: g(), ...e })),
        languages: (parsed.languages || []).map((e: Record<string,unknown>) => ({ id: g(), ...e })),
        certifications: (parsed.certifications || []).map((e: Record<string,unknown>) => ({ id: g(), ...e })),
      })
      toast.success(t("toast_upload_success"))
    } catch (e) {
      toast.error(`${t("toast_upload_error")} ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setParsing(false)
    }
  }

  const [downloading, setDownloading] = useState(false)
  const [openSections, setOpenSections] = useState({
    personal: true, experience: true, education: false, skills: false, languages: false, certifications: false,
  })

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const setFieldError = (fieldId: string, error?: string) => {
    setValidationErrors(prev => {
      if (error) {
        return { ...prev, [fieldId]: error }
      } else {
        const next = { ...prev }
        delete next[fieldId]
        return next
      }
    })
  }

  const getFieldError = (fieldId: string): string | undefined => validationErrors[fieldId]

  useEffect(() => {
    async function load() {
      try {
        const queryTemplate = parseTemplateParam(searchParams.get("template"))
        const analysisId = searchParams.get("from")
        if (analysisId) {
          const raw = sessionStorage.getItem(`analysis_${analysisId}`)
          if (raw) {
            const mapped = mapAnalysisToCV(JSON.parse(raw))
            setCvData(mapped)
            if (queryTemplate) setTemplate(queryTemplate)
            setReady(true)
            return
          }
        }
        const cloud = await loadDraftFromCloud()
        if (cloud) {
          setCvData(ensureIds(cloud.cv_data))
          const cloudTemplate = parseTemplateParam(cloud.template_id)
          setTemplate(queryTemplate ?? cloudTemplate ?? "classic")
          setReady(true)
          return
        }
        const saved = localStorage.getItem("cvfit_editor_data")
        if (saved) setCvData(ensureIds(JSON.parse(saved)))
        if (queryTemplate) {
          setTemplate(queryTemplate)
        } else {
          const savedTpl = localStorage.getItem("cvfit_editor_template")
          const parsedSavedTemplate = parseTemplateParam(savedTpl)
          if (parsedSavedTemplate) setTemplate(parsedSavedTemplate)
        }
      } catch { /* ignore */ }
      setReady(true)
    }
    load()
  }, [searchParams])

  useDraftSync(cvData, template, ready)

  // Hesaba sabitlenmiş isim varsa CV'deki isim her zaman o olur (taslak/yükleme ezemez).
  useEffect(() => {
    const locked = profile?.locked_name
    if (!ready || !locked) return
    setCvData((prev) => (prev.personal.fullName === locked ? prev : { ...prev, personal: { ...prev.personal, fullName: locked } }))
  }, [ready, profile?.locked_name, cvData.personal.fullName])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!ready) return
    setSaveStatus("saving")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveStatus("saved"), 2000)
  }, [cvData, template, ready])

  useEffect(() => {
    if (authLoading || !user) return
    const intent = sessionStorage.getItem("cvfit_download_intent")
    if (intent === "pdf" || intent === "docx") {
      sessionStorage.removeItem("cvfit_download_intent")
      setDownloadFormat(intent)
      if (profile?.plan === "pro") {
        doDownload(intent)
      } else {
        setPaymentOpen(true)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, profile])

  async function handleDownloadRequest(format: "pdf" | "docx") {
    setDownloadFormat(format)
    if (authLoading) {
      toast.info(t("toast_checking"))
      return
    }
    const liveAccessToken = typeof window !== "undefined" ? localStorage.getItem("cvfit_access_token") || "" : ""
    if (!user) {
      if (liveAccessToken) {
        await refresh()
        setPaymentOpen(true)
        return
      }
      sessionStorage.setItem("cvfit_download_intent", format)
      sessionStorage.setItem("cvfit_post_login_redirect", "/builder")
      window.location.href = "/auth/google"
      return
    }
    if (profile?.plan === "pro") {
      await doDownload(format)
      return
    }
    setPaymentOpen(true)
  }

  async function doDownload(format: "pdf" | "docx") {
    setDownloading(true)
    try {
      // Sunucu ödeme + isim kilidini doğrular; ilk indirmede isim hesaba sabitlenir.
      const authFd = new FormData()
      authFd.append("full_name", cvData.personal.fullName || "")
      const authRes = await fetch(`${API_URL}/api/download/authorize`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("cvfit_access_token") || ""}` },
        body: authFd,
      })
      if (!authRes.ok) {
        const err = await authRes.json().catch(() => ({}))
        toast.error(typeof err?.detail === "string" ? err.detail : t("toast_download_error"))
        if (authRes.status === 402) setPaymentOpen(true)
        return
      }
      await refresh()

      if (format === "pdf") {
        const { pdf } = await import("@react-pdf/renderer")
        const { CVDocument } = await import("@/lib/pdf-templates")
        const { saveAs } = await import("file-saver")
        const blob = await pdf(CVDocument({ data: cvData, template: template as import("@/lib/pdf-templates").TemplateKey })).toBlob()
        saveAs(blob, `${cvData.personal.fullName || "cv"}-cv.pdf`)
      } else {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx")
        const { saveAs } = await import("file-saver")
        const p = cvData.personal
        const L = getCVLabels(locale)
        const children: InstanceType<typeof Paragraph>[] = []
        children.push(new Paragraph({ children: [new TextRun({ text: p.fullName || L.fullName, bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }))
        if (p.title) children.push(new Paragraph({ children: [new TextRun({ text: p.title, size: 22, color: "666666" })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }))
        const contactParts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean)
        if (contactParts.length) children.push(new Paragraph({ children: [new TextRun({ text: contactParts.join("  |  "), size: 18, color: "888888" })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }))
        if (p.summary) { children.push(new Paragraph({ text: L.summary, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } })); children.push(new Paragraph({ children: [new TextRun({ text: p.summary, size: 20 })], spacing: { after: 200 } })) }
        if (cvData.experience.length > 0) {
          children.push(new Paragraph({ text: L.experience, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }))
          for (const exp of cvData.experience) {
            const date = [exp.startDate, exp.current ? L.ongoing : exp.endDate].filter(Boolean).join(" – ")
            children.push(new Paragraph({ children: [new TextRun({ text: exp.position || L.position, bold: true, size: 20 }), ...(exp.company ? [new TextRun({ text: ` — ${exp.company}`, size: 20 })] : []), ...(date ? [new TextRun({ text: `   ${date}`, size: 18, color: "888888" })] : [])], spacing: { after: 50 } }))
            if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20 })], spacing: { after: 150 } }))
          }
        }
        const doc = new Document({ sections: [{ children }] })
        const blob = await Packer.toBlob(doc)
        saveAs(blob, `${cvData.personal.fullName || "cv"}-cv.docx`)
      }
      toast.success(t("toast_download_success"))
    } catch (e) {
      console.error(e)
      toast.error(t("toast_download_error"))
    } finally {
      setDownloading(false)
    }
  }

  const updatePersonal = (field: keyof CVData["personal"], value: string) =>
    setCvData((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }))

  const addExperience = () => { setCvData((prev) => ({ ...prev, experience: [...prev.experience, { id: genId(), company: "", position: "", startDate: "", endDate: "", current: false, description: "" }] })); setOpenSections((s) => ({ ...s, experience: true })) }
  const updateExperience = (id: string, u: Partial<Experience>) => setCvData((prev) => ({ ...prev, experience: prev.experience.map((e) => (e.id === id ? { ...e, ...u } : e)) }))
  const removeExperience = (id: string) => setCvData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }))

  const addEducation = () => { setCvData((prev) => ({ ...prev, education: [...prev.education, { id: genId(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }] })); setOpenSections((s) => ({ ...s, education: true })) }
  const updateEducation = (id: string, u: Partial<Education>) => setCvData((prev) => ({ ...prev, education: prev.education.map((e) => (e.id === id ? { ...e, ...u } : e)) }))
  const removeEducation = (id: string) => setCvData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }))

  const addSkill = () => { setCvData((prev) => ({ ...prev, skills: [...prev.skills, { id: genId(), name: "", level: "Orta" as const }] })); setOpenSections((s) => ({ ...s, skills: true })) }
  const updateSkill = (id: string, u: Partial<Skill>) => setCvData((prev) => ({ ...prev, skills: prev.skills.map((s) => (s.id === id ? { ...s, ...u } : s)) }))
  const removeSkill = (id: string) => setCvData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }))

  const addLanguage = () => { setCvData((prev) => ({ ...prev, languages: [...prev.languages, { id: genId(), name: "", level: "B1" as const }] })); setOpenSections((s) => ({ ...s, languages: true })) }
  const updateLanguage = (id: string, u: Partial<Language>) => setCvData((prev) => ({ ...prev, languages: prev.languages.map((l) => (l.id === id ? { ...l, ...u } : l)) }))
  const removeLanguage = (id: string) => setCvData((prev) => ({ ...prev, languages: prev.languages.filter((l) => l.id !== id) }))

  const addCertification = () => { setCvData((prev) => ({ ...prev, certifications: [...prev.certifications, { id: genId(), name: "", issuer: "", date: "", url: "" }] })); setOpenSections((s) => ({ ...s, certifications: true })) }
  const updateCertification = (id: string, u: Partial<Certification>) => setCvData((prev) => ({ ...prev, certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...u } : c)) }))
  const removeCertification = (id: string) => setCvData((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c.id !== id) }))

  const toggle = (key: keyof typeof openSections) => (open: boolean) => setOpenSections((prev) => ({ ...prev, [key]: open }))

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("cvfit_access_token") || "" : ""
  const sessionToken = typeof window !== "undefined" ? getSessionToken() : ""

  return (
    <div className="flex flex-col bg-background" style={{ minHeight: "calc(100dvh - 56px)" }}>
      {/* Header */}
      <header className="flex min-h-14 shrink-0 flex-col gap-2 border-b border-border px-4 py-3 bg-background/95 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1"><Loader2 className="size-3 animate-spin" />{t("saving")}</span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Cloud className="size-3 text-green-500" />{t("saved")}</span>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 shrink-0 sm:w-auto sm:justify-end">
          <div className="flex items-center gap-1 border rounded-md px-1">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-muted rounded cursor-pointer">
              <ZoomOut className="size-3.5 text-muted-foreground" />
            </button>
            <span className="text-xs w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.2, z + 0.1))} className="p-1 hover:bg-muted rounded cursor-pointer">
              <ZoomIn className="size-3.5 text-muted-foreground" />
            </button>
          </div>
          {profile?.plan === "pro" && (
            <Button variant="outline" size="sm" onClick={() => setAtsOpen(true)}>
              <Sparkles className="size-4 mr-1.5 text-primary" />
              {t("ats_analysis")}
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" disabled={downloading} onClick={() => handleDownloadRequest("pdf")}> 
            {downloading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <FileDown className="size-4 mr-1" />}
            {t("download_pdf")}
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none" disabled={downloading} onClick={() => handleDownloadRequest("docx")}> 
            {downloading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <FileText className="size-4 mr-1" />}
            {t("download_docx")}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left Panel */}
        <div className="w-full overflow-y-auto p-4 space-y-4 lg:w-[52%] lg:p-6">
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCVUpload(f); e.target.value = "" }} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={parsing}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-all px-4 py-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parsing ? <><Loader2 className="size-4 animate-spin" />{t("uploading")}</> : <><Upload className="size-4" />{t("upload_cv")}</>}
          </button>

          {/* Kişisel Bilgiler */}
          <Collapsible open={openSections.personal} onOpenChange={toggle("personal")}>
            <Card>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="size-4 text-muted-foreground" />
                  {t("personal_info")}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.personal && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border">
                      {cvData.personal.photo ? (
                        <img src={cvData.personal.photo} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <User className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm border border-border rounded-md px-3 py-1.5 hover:bg-muted/50 transition-colors w-fit">
                          <Upload className="size-3.5" />
                          {t("upload_photo")}
                        </div>
                        <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => updatePersonal("photo", ev.target?.result as string); reader.readAsDataURL(file) }} />
                      </label>
                      {cvData.personal.photo && (
                        <button className="text-xs text-destructive hover:underline" onClick={() => updatePersonal("photo", "")}>{t("remove_photo")}</button>
                      )}
                      <p className="text-xs text-muted-foreground">{t("photo_hint")}</p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <FormField label={fieldCopy.fullName} required error={getFieldError("fullName")}>
                    <Input
                      placeholder={t("placeholder_name")}
                      className="text-base"
                      value={cvData.personal.fullName}
                      disabled={!!profile?.locked_name}
                      title={profile?.locked_name ? "İsim ilk indirmede sabitlenir ve değiştirilemez" : undefined}
                      onChange={(e) => {
                        const formatted = formatters.fullName(e.target.value)
                        updatePersonal("fullName", formatted)
                        setFieldError("fullName")
                      }}
                    />
                  </FormField>

                  {/* Job Title with suggestions */}
                  <FormField label={fieldCopy.title} optional optionalLabel={fieldCopy.optional}>
                    <div className="relative">
                      <Input
                        placeholder={fieldCopy.titlePlaceholder}
                        value={cvData.personal.title}
                        onChange={(e) => updatePersonal("title", e.target.value)}
                        list="job-titles-list"
                      />
                      <datalist id="job-titles-list">
                        {COMMON_JOB_TITLES.map((title) => (
                          <option key={title} value={title} />
                        ))}
                      </datalist>
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Email */}
                    <FormField label={fieldCopy.email} required error={getFieldError("email")}>
                      <Input
                        placeholder={fieldCopy.emailPlaceholder}
                        type="email"
                        value={cvData.personal.email}
                        onChange={(e) => {
                          updatePersonal("email", e.target.value)
                          const validation = validators.email(e.target.value)
                          setFieldError("email", validation.error)
                        }}
                      />
                    </FormField>

                    {/* Phone */}
                    <FormField label={fieldCopy.phone} required hint={fieldCopy.phoneHint} error={getFieldError("phone")}>
                      <Input
                        placeholder={fieldCopy.phonePlaceholder}
                        value={cvData.personal.phone}
                        onChange={(e) => {
                          const formatted = formatters.phone(e.target.value)
                          updatePersonal("phone", formatted)
                          if (e.target.value) {
                            const validation = validators.phone(formatted)
                            setFieldError("phone", validation.error)
                          } else {
                            setFieldError("phone")
                          }
                        }}
                      />
                    </FormField>

                    {/* Location */}
                    <FormField label={fieldCopy.location} required error={getFieldError("location")}>
                      <Input
                        placeholder={fieldCopy.locationPlaceholder}
                        value={cvData.personal.location}
                        onChange={(e) => {
                          const formatted = formatters.city(e.target.value)
                          updatePersonal("location", formatted)
                          const validation = validators.textOnly(formatted)
                          setFieldError("location", validation.error)
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* LinkedIn */}
                    <FormField label={fieldCopy.linkedin} optional optionalLabel={fieldCopy.optional} hint={fieldCopy.linkedInHint} error={getFieldError("linkedin")}>
                      <Input
                        placeholder={fieldCopy.linkedinPlaceholder}
                        type="url"
                        value={cvData.personal.linkedin}
                        onChange={(e) => {
                          updatePersonal("linkedin", e.target.value)
                          if (e.target.value) {
                            const validation = validators.url(e.target.value)
                            setFieldError("linkedin", validation.error)
                          } else {
                            setFieldError("linkedin")
                          }
                        }}
                      />
                    </FormField>

                    {/* Website */}
                    <FormField label={fieldCopy.website} optional optionalLabel={fieldCopy.optional} hint={fieldCopy.websiteHint} error={getFieldError("website")}>
                      <Input
                        placeholder={fieldCopy.websitePlaceholder}
                        type="url"
                        value={cvData.personal.website}
                        onChange={(e) => {
                          updatePersonal("website", e.target.value)
                          if (e.target.value) {
                            const validation = validators.url(e.target.value)
                            setFieldError("website", validation.error)
                          } else {
                            setFieldError("website")
                          }
                        }}
                      />
                    </FormField>
                  </div>

                  {/* Summary */}
                  <FormField
                    label={fieldCopy.summary}
                    optional
                    optionalLabel={fieldCopy.optional}
                    hint={locale === "tr" ? `${cvData.personal.summary.length}/500 karakter` : `${cvData.personal.summary.length}/500 characters`}
                  >
                    <Textarea
                      placeholder={fieldCopy.summaryPlaceholder}
                      rows={4}
                      maxLength={500}
                      value={cvData.personal.summary}
                      onChange={(e) => updatePersonal("summary", e.target.value)}
                    />
                  </FormField>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Deneyim */}
          <Collapsible open={openSections.experience} onOpenChange={toggle("experience")}>
            <Card>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="size-4 text-muted-foreground" />
                  {t("experience")}
                  {cvData.experience.length > 0 && <span className="text-xs text-muted-foreground">({cvData.experience.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.experience && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {cvData.experience.map((exp) => {
                    const dateRangeError = exp.startDate && exp.endDate && !exp.current
                      ? compareMonthYears(exp.startDate, exp.endDate) > 0
                        ? fieldCopy.dateRangeError
                        : undefined
                      : undefined
                    const expErrorKey = `exp_${exp.id}`
                    const errorId = `exp_dates_${exp.id}`
                    
                    return (
                      <div key={exp.id} className="relative space-y-3 rounded-lg border border-border p-4">
                        <Button variant="ghost" size="icon-xs" className="absolute top-3 right-3 text-destructive hover:text-destructive" onClick={() => removeExperience(exp.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>

                        <div className="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-2">
                          {/* Company */}
                          <FormField label={fieldCopy.company} required>
                            <Input
                              placeholder={fieldCopy.companyPlaceholder}
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                            />
                          </FormField>

                          {/* Position */}
                          <FormField label={fieldCopy.position} required>
                            <Input
                              placeholder={fieldCopy.positionPlaceholder}
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {/* Start Date */}
                          <FormField label={fieldCopy.startDate} required hint={fieldCopy.monthYearPlaceholder}>
                            <MonthYearPicker
                              value={exp.startDate}
                              onChange={(date) => updateExperience(exp.id, { startDate: date })}
                              placeholder={fieldCopy.monthYearPlaceholder}
                              locale={locale}
                            />
                          </FormField>

                          {/* End Date or Current */}
                          <FormField label={fieldCopy.endDate} required={!exp.current} error={dateRangeError}>
                            <MonthYearPicker
                              value={exp.endDate}
                              onChange={(date) => updateExperience(exp.id, { endDate: date })}
                              placeholder={fieldCopy.monthYearPlaceholder}
                              disabled={exp.current}
                              locale={locale}
                            />
                          </FormField>
                        </div>

                        {/* Current Job Checkbox */}
                        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 rounded px-2 py-1 w-fit">
                          <Checkbox
                            checked={exp.current}
                            onCheckedChange={(checked) => updateExperience(exp.id, { current: !!checked, endDate: checked ? "" : exp.endDate })}
                          />
                          <span className="font-medium">{fieldCopy.ongoing}</span>
                        </label>

                        {/* Description */}
                        <FormField
                          label={fieldCopy.description}
                          optional
                          optionalLabel={fieldCopy.optional}
                          hint={locale === "tr" ? `${exp.description.length}/500 karakter` : `${exp.description.length}/500 characters`}
                          error={getFieldError(`exp_desc_${exp.id}`)}
                        >
                          <Textarea
                            placeholder={fieldCopy.descriptionPlaceholder}
                            rows={3}
                            maxLength={500}
                            value={exp.description}
                            onChange={(e) => {
                              updateExperience(exp.id, { description: e.target.value })
                              const validation = validators.description(e.target.value)
                              setFieldError(`exp_desc_${exp.id}`, validation.error)
                            }}
                          />
                        </FormField>
                      </div>
                    )
                  })}
                  <Button variant="outline" size="sm" className="w-full" onClick={addExperience}>
                    <Plus className="size-4 mr-1" /> {t("add_experience")}
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Eğitim */}
          <Collapsible open={openSections.education} onOpenChange={toggle("education")}>
            <Card>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  {t("education")}
                  {cvData.education.length > 0 && <span className="text-xs text-muted-foreground">({cvData.education.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.education && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {cvData.education.map((edu) => {
                    const dateRangeError = edu.startDate && edu.endDate
                      ? parseInt(edu.startDate) > parseInt(edu.endDate)
                        ? 'Bitiş tarihi başlangıçtan önce olamaz'
                        : undefined
                      : undefined
                    
                    return (
                      <div key={edu.id} className="relative space-y-3 rounded-lg border border-border p-4">
                        <Button variant="ghost" size="icon-xs" className="absolute top-3 right-3 text-destructive hover:text-destructive" onClick={() => removeEducation(edu.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>

                        <div className="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-2">
                          {/* School */}
                          <FormField label={fieldCopy.school} required>
                            <Input
                              placeholder={fieldCopy.schoolPlaceholder}
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                            />
                          </FormField>

                          {/* Field/Major */}
                          <FormField label={fieldCopy.field} required>
                            <Input
                              placeholder={fieldCopy.fieldPlaceholder}
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                            />
                          </FormField>
                        </div>

                        {/* Degree */}
                        <FormField label={fieldCopy.degree} required>
                          <Select
                            value={edu.degree || ""}
                            onValueChange={(value) => updateEducation(edu.id, { degree: value || "" })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={fieldCopy.degreePlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lise">Lise</SelectItem>
                              <SelectItem value="Önlisans">Önlisans</SelectItem>
                              <SelectItem value="Lisans">Lisans</SelectItem>
                              <SelectItem value="Yüksek Lisans">Yüksek Lisans</SelectItem>
                              <SelectItem value="Doktora">Doktora</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {/* Start Year */}
                          <FormField label={fieldCopy.startYear} required hint="YYYY">
                            <YearPicker
                              value={edu.startDate}
                              onChange={(year) => updateEducation(edu.id, { startDate: year })}
                              placeholder={fieldCopy.yearPlaceholder}
                              locale={locale}
                            />
                          </FormField>

                          {/* End Year */}
                          <FormField
                            label={fieldCopy.endYear}
                            required={false}
                            error={dateRangeError}
                            hint={fieldCopy.currentStudiesHint}
                          >
                            <YearPicker
                              value={edu.endDate}
                              onChange={(year) => updateEducation(edu.id, { endDate: year })}
                              placeholder={fieldCopy.yearPlaceholder}
                              locale={locale}
                            />
                          </FormField>
                        </div>

                        {/* GPA */}
                        <FormField
                          label={fieldCopy.gpa}
                          optional
                          optionalLabel={fieldCopy.optional}
                          hint={fieldCopy.gpaHint}
                          error={getFieldError(`edu_gpa_${edu.id}`)}
                        >
                          <Input
                            placeholder={fieldCopy.gpaPlaceholder}
                            value={edu.gpa}
                            onChange={(e) => {
                              const formatted = formatGPA(e.target.value)
                              updateEducation(edu.id, { gpa: formatted })
                              if (formatted) {
                                const validation = validators.gpa(formatted)
                                setFieldError(`edu_gpa_${edu.id}`, validation.error)
                              } else {
                                setFieldError(`edu_gpa_${edu.id}`)
                              }
                            }}
                            maxLength={4}
                          />
                        </FormField>
                      </div>
                    )
                  })}
                  <Button variant="outline" size="sm" className="w-full" onClick={addEducation}>
                    <Plus className="size-4 mr-1" /> {t("add_education")}
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Beceriler */}
          <Collapsible open={openSections.skills} onOpenChange={toggle("skills")}>
            <Card>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wrench className="size-4 text-muted-foreground" />
                  {t("skills")}
                  {cvData.skills.length > 0 && <span className="text-xs text-muted-foreground">({cvData.skills.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.skills && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  <FormField label={fieldCopy.skillSection} optional optionalLabel={fieldCopy.optional}>
                    <SkillTagInput
                      skills={cvData.skills}
                      onSkillsChange={(skills) => setCvData(prev => ({ ...prev, skills }))}
                      skillLevels={SKILL_LEVELS}
                      skillLevelLabels={SKILL_LEVEL_LABELS[locale] || SKILL_LEVEL_LABELS.tr}
                      maxSkills={20}
                      locale={locale}
                      placeholder={fieldCopy.skillPlaceholder}
                      helperText={fieldCopy.skillHelper}
                    />
                  </FormField>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Diller */}
          <Collapsible open={openSections.languages} onOpenChange={toggle("languages")}>
            <Card>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="size-4 text-muted-foreground" />
                  {t("languages")}
                  {cvData.languages.length > 0 && <span className="text-xs text-muted-foreground">({cvData.languages.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.languages && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {cvData.languages.map((lang) => (
                    <div key={lang.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center">
                      {/* Language with suggestions */}
                      <div className="flex-1">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{fieldCopy.languageSection}</label>
                        <div className="relative">
                          <Input
                            placeholder={locale === "tr" ? "Dil" : "Language"}
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                            list="languages-list"
                            className="w-full"
                          />
                          <datalist id="languages-list">
                            {COMMON_LANGUAGES.map((name) => (
                              <option key={name} value={name} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Proficiency */}
                      <div className="w-full sm:w-32">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{fieldCopy.levelSection}</label>
                        <Select value={lang.level} onValueChange={(v) => updateLanguage(lang.id, { level: v as Language["level"] })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{LANG_LEVELS.map((l) => (<SelectItem key={l} value={l}>{(LANG_LEVEL_LABELS[locale] || LANG_LEVEL_LABELS.tr)[l] || l}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-destructive hover:text-destructive shrink-0"
                        onClick={() => removeLanguage(lang.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addLanguage}>
                    <Plus className="size-4 mr-1" /> {t("add_language")}
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Sertifikalar */}
          <Collapsible open={openSections.certifications} onOpenChange={toggle("certifications")}>
            <Card>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Award className="size-4 text-muted-foreground" />
                  {t("certifications")}
                  {cvData.certifications.length > 0 && <span className="text-xs text-muted-foreground">({cvData.certifications.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.certifications && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {cvData.certifications.map((cert) => (
                    <div key={cert.id} className="relative space-y-3 rounded-lg border border-border p-4">
                      <Button variant="ghost" size="icon-xs" className="absolute top-3 right-3 text-destructive hover:text-destructive" onClick={() => removeCertification(cert.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>

                      <div className="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-2">
                        {/* Certificate name */}
                        <FormField label={fieldCopy.certNamePlaceholder} required>
                          <Input
                            placeholder={fieldCopy.certNamePlaceholder}
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          />
                        </FormField>

                        {/* Issuer */}
                        <FormField label={fieldCopy.certIssuerPlaceholder} required>
                          <Input
                            placeholder={fieldCopy.certIssuerPlaceholder}
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                          />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Date */}
                        <FormField label={fieldCopy.certificateDate} required hint={fieldCopy.monthYearPlaceholder}>
                          <MonthYearPicker
                            value={cert.date}
                            onChange={(date) => updateCertification(cert.id, { date })}
                            placeholder={fieldCopy.monthYearPlaceholder}
                            locale={locale}
                          />
                        </FormField>

                        {/* URL */}
                        <FormField
                          label={fieldCopy.certificateUrl}
                          optional
                          optionalLabel={fieldCopy.optional}
                          hint={fieldCopy.websiteHint}
                          error={getFieldError(`cert_url_${cert.id}`)}
                        >
                          <Input
                            placeholder={fieldCopy.certUrlPlaceholder}
                            type="url"
                            value={cert.url}
                            onChange={(e) => {
                              updateCertification(cert.id, { url: e.target.value })
                              if (e.target.value) {
                                const validation = validators.url(e.target.value)
                                setFieldError(`cert_url_${cert.id}`, validation.error)
                              } else {
                                setFieldError(`cert_url_${cert.id}`)
                              }
                            }}
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addCertification}>
                    <Plus className="size-4 mr-1" /> {t("add_certification")}
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Right Panel — Preview */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/30 p-4 flex flex-col items-center gap-6 lg:p-4">
          <div ref={previewHostRef} className="w-full flex justify-center">
            <CVPreview data={cvData} template={template} zoom={previewZoom} previewRef={cvPreviewRef} locale={locale} />
          </div>
          <div className="w-full pb-4" style={{ maxWidth: "800px" }}>
            <p className="text-xs text-muted-foreground mb-3 font-medium">{t("select_template")}</p>
            <div className="flex items-end gap-3 overflow-x-auto pb-1">
              {TEMPLATES.map((tmpl) => (
                <TemplateThumbnail key={tmpl.value} tmpl={tmpl.value} label={tmpl.label} active={template === tmpl.value} onClick={() => setTemplate(tmpl.value)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        sessionToken={sessionToken}
        downloadFormat={downloadFormat}
        accessToken={accessToken}
        onPaymentSuccess={() => doDownload(downloadFormat)}
      />
      <ATSModal
        open={atsOpen}
        onClose={() => setAtsOpen(false)}
        cvData={cvData}
        onTransfer={(incoming) => {
          try {
            const mapped = incoming as Record<string, unknown>
            if (!mapped || typeof mapped !== "object") return
            const g = () => crypto.randomUUID()
            const normalizeSkillLevel = (value: unknown): Skill["level"] => {
              if (typeof value === "number" && Number.isFinite(value)) {
                const idx = Math.min(Math.max(Math.round(value) - 1, 0), SKILL_LEVELS.length - 1)
                return SKILL_LEVELS[idx]
              }
              if (typeof value === "string" && SKILL_LEVELS.includes(value as Skill["level"])) return value as Skill["level"]
              return "Orta"
            }
            const normalizeLanguageLevel = (value: unknown): Language["level"] => {
              if (typeof value === "string" && LANG_LEVELS.includes(value as Language["level"])) return value as Language["level"]
              return "B1"
            }
            setCvData((prev) => ({
              ...prev,
              personal: mapped.personal ? { ...prev.personal, ...(mapped.personal as object) } : prev.personal,
              experience: Array.isArray(mapped.experience) ? (mapped.experience as Record<string,unknown>[]).map((e) => ({ id: g(), company: "", position: "", startDate: "", endDate: "", current: false, description: "", ...e })) : prev.experience,
              education: Array.isArray(mapped.education) ? (mapped.education as Record<string,unknown>[]).map((e) => ({ id: g(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", ...e })) : prev.education,
              skills: Array.isArray(mapped.skills) ? (mapped.skills as Record<string,unknown>[]).map((e) => ({ id: g(), name: "", ...e, level: normalizeSkillLevel(e.level) })) : prev.skills,
              languages: Array.isArray(mapped.languages) ? (mapped.languages as Record<string,unknown>[]).map((e) => ({ id: g(), name: "", ...e, level: normalizeLanguageLevel(e.level) })) : prev.languages,
              certifications: Array.isArray(mapped.certifications) ? (mapped.certifications as Record<string,unknown>[]).map((e) => ({ id: g(), name: "", issuer: "", date: "", ...e })) : prev.certifications,
            }))
          } catch { /* ignore */ }
        }}
      />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <CVBuilderPage />
    </Suspense>
  )
}
