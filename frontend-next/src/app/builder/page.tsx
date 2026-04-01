"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { CVData, Experience, Education, Skill, Language, Certification } from "@/types/cv"
import { emptyCVData } from "@/types/cv"
import { cn } from "@/lib/utils"
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

type Template = "classic" | "modern" | "minimal" | "executive" | "creative" | "elegant" | "professional" | "tech" | "steel" | "bordeaux" | "navy" | "teal"
const genId = () => crypto.randomUUID()
const TEMPLATE_VALUES = new Set<Template>([
  "classic",
  "modern",
  "minimal",
  "executive",
  "creative",
  "elegant",
  "professional",
  "tech",
  "steel",
  "bordeaux",
  "navy",
  "teal",
])

function parseTemplateParam(value: string | null): Template | null {
  if (!value) return null
  return TEMPLATE_VALUES.has(value as Template) ? (value as Template) : null
}

const TEMPLATES: { value: Template; label: string; desc: string }[] = [
  { value: "classic", label: "Klasik", desc: "Sade & ATS dostu" },
  { value: "modern", label: "Modern", desc: "İki kolon, mavi aksan" },
  { value: "minimal", label: "Portre", desc: "Fotoğraflı, koyu sidebar" },
  { value: "executive", label: "Kurumsal", desc: "Koyu header, profesyonel" },
  { value: "creative", label: "Yaratıcı", desc: "Mor gradient, modern" },
  { value: "elegant", label: "Zarif", desc: "Teal aksan, timeline" },
  { value: "professional", label: "Profesyonel", desc: "Kırmızı aksan, kurumsal" },
  { value: "tech", label: "Teknoloji", desc: "Dark sidebar, geliştirici" },
  { value: "steel", label: "Çelik Mavi", desc: "Mavi sidebar, kurumsal" },
  { value: "bordeaux", label: "Bordo", desc: "Koyu kırmızı sidebar, fotoğraflı" },
  { value: "navy", label: "Lacivert", desc: "Koyu lacivert sidebar, fotoğraflı" },
  { value: "teal", label: "Turkuaz", desc: "Teal header, iki kolon" },
]

function TemplateThumbnail({ t, active, onClick }: { t: typeof TEMPLATES[number]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg border-2 p-1.5 transition-all cursor-pointer hover:border-foreground/40",
        active ? "border-foreground bg-muted" : "border-transparent"
      )}
    >
      <div className="w-14 h-[72px] rounded bg-white overflow-hidden shadow-sm">
        <MiniPreview template={t.value} />
      </div>
      <span className="text-[10px] font-medium text-foreground/80">{t.label}</span>
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

function CVPreview({ data, template, zoom, previewRef }: { data: CVData; template: Template; zoom: number; previewRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div style={{
      width: A4_WIDTH * zoom,
      height: A4_HEIGHT * zoom,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    }}>
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          width: A4_WIDTH,
          height: A4_HEIGHT,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <div ref={previewRef} className="bg-white text-gray-900 shadow-xl" style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}>
          {template === "classic" && <ClassicTemplate data={data} />}
          {template === "modern" && <ModernTemplate data={data} />}
          {template === "minimal" && <MinimalTemplate data={data} />}
          {template === "executive" && <ExecutiveTemplate data={data} />}
          {template === "creative" && <CreativeTemplate data={data} />}
          {template === "elegant" && <ElegantTemplate data={data} />}
          {template === "professional" && <ProfessionalTemplate data={data} />}
          {template === "tech" && <TechTemplate data={data} />}
          {template === "steel" && <SteelTemplate data={data} />}
          {template === "bordeaux" && <BordeauxTemplate data={data} />}
          {template === "navy" && <NavyTemplate data={data} />}
          {template === "teal" && <TealTemplate data={data} />}
        </div>
      </div>
    </div>
  )
}

const SKILL_LEVELS: Skill["level"][] = ["Başlangıç", "Orta", "İleri", "Uzman"]
const LANG_LEVELS: Language["level"][] = ["A1", "A2", "B1", "B2", "C1", "C2", "Anadil"]
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, loading: authLoading } = useAuth()

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

  async function handleCVUpload(file: File) {
    if (!file || file.type !== "application/pdf") {
      toast.error("Lütfen bir PDF dosyası seçin")
      return
    }
    setParsing(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch(`${API_URL}/api/cv/parse`, { method: "POST", body: fd })
      const data = await res.json()
      console.log("Parse response:", res.status, data)
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data))
      const parsed = data.cv_data
      // id ekle
      const genId = () => crypto.randomUUID()
      setCvData({
        personal: { ...emptyCVData.personal, ...parsed.personal },
        experience: (parsed.experience || []).map((e: Record<string,unknown>) => ({ id: genId(), ...e })),
        education: (parsed.education || []).map((e: Record<string,unknown>) => ({ id: genId(), ...e })),
        skills: (parsed.skills || []).map((e: Record<string,unknown>) => ({ id: genId(), ...e })),
        languages: (parsed.languages || []).map((e: Record<string,unknown>) => ({ id: genId(), ...e })),
        certifications: (parsed.certifications || []).map((e: Record<string,unknown>) => ({ id: genId(), ...e })),
      })
      toast.success("CV başarıyla yüklendi!")
    } catch (e) {
      console.error("CV parse error:", e)
      toast.error(`CV yüklenirken hata: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setParsing(false)
    }
  }
  const [downloading, setDownloading] = useState(false)

  const [openSections, setOpenSections] = useState({
    personal: true,
    experience: true,
    education: false,
    skills: false,
    languages: false,
    certifications: false,
  })

  // Load draft on mount
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
        // Try cloud first
        const cloud = await loadDraftFromCloud()
        if (cloud) {
          setCvData(ensureIds(cloud.cv_data))
          const cloudTemplate = parseTemplateParam(cloud.template_id)
          setTemplate(queryTemplate ?? cloudTemplate ?? "classic")
          setReady(true)
          return
        }
        // Fallback to localStorage
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

  // Auto-save
  useDraftSync(cvData, template, ready)

  // Save status indicator
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!ready) return
    setSaveStatus("saving")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveStatus("saved"), 2000)
  }, [cvData, template, ready])

  // Handle download intent after login redirect
  useEffect(() => {
    if (authLoading || !user) return          // auth henüz yüklenmediyse bekle
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
    if (!user) {
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
        const children: InstanceType<typeof Paragraph>[] = []
        children.push(new Paragraph({ children: [new TextRun({ text: p.fullName || "Ad Soyad", bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }))
        if (p.title) children.push(new Paragraph({ children: [new TextRun({ text: p.title, size: 22, color: "666666" })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }))
        const contactParts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean)
        if (contactParts.length) children.push(new Paragraph({ children: [new TextRun({ text: contactParts.join("  |  "), size: 18, color: "888888" })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }))
        if (p.summary) { children.push(new Paragraph({ text: "ÖZET", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } })); children.push(new Paragraph({ children: [new TextRun({ text: p.summary, size: 20 })], spacing: { after: 200 } })) }
        if (cvData.experience.length > 0) {
          children.push(new Paragraph({ text: "DENEYİM", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }))
          for (const exp of cvData.experience) {
            const date = [exp.startDate, exp.current ? "Devam Ediyor" : exp.endDate].filter(Boolean).join(" – ")
            children.push(new Paragraph({ children: [new TextRun({ text: exp.position || "Pozisyon", bold: true, size: 20 }), ...(exp.company ? [new TextRun({ text: ` — ${exp.company}`, size: 20 })] : []), ...(date ? [new TextRun({ text: `   ${date}`, size: 18, color: "888888" })] : [])], spacing: { after: 50 } }))
            if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20 })], spacing: { after: 150 } }))
          }
        }
        const doc = new Document({ sections: [{ children }] })
        const blob = await Packer.toBlob(doc)
        saveAs(blob, `${cvData.personal.fullName || "cv"}-cv.docx`)
      }
      toast.success("CV başarıyla indirildi!")
    } catch (e) {
      console.error(e)
      toast.error("İndirme sırasında bir hata oluştu")
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
    <div className="flex flex-col bg-background" style={{ height: "calc(100vh - 56px)" }}>
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 gap-2 bg-background/95 backdrop-blur-sm">
        {/* Left: save status */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1"><Loader2 className="size-3 animate-spin" />Kaydediliyor...</span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Cloud className="size-3 text-green-500" />Kaydedildi</span>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Zoom */}
          <div className="flex items-center gap-1 border rounded-md px-1">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-muted rounded cursor-pointer">
              <ZoomOut className="size-3.5 text-muted-foreground" />
            </button>
            <span className="text-xs w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.2, z + 0.1))} className="p-1 hover:bg-muted rounded cursor-pointer">
              <ZoomIn className="size-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* ATS Button (Pro only) */}
          {profile?.plan === "pro" && (
            <Button variant="outline" size="sm" onClick={() => setAtsOpen(true)}>
              <Sparkles className="size-4 mr-1.5 text-primary" />
              ATS Analizi
            </Button>
          )}

          {/* Download buttons */}
          <Button
            variant="outline"
            size="sm"
            disabled={downloading}
            onClick={() => handleDownloadRequest("pdf")}
          >
            {downloading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <FileDown className="size-4 mr-1" />}
            PDF İndir
          </Button>
          <Button
            size="sm"
            disabled={downloading}
            onClick={() => handleDownloadRequest("docx")}
          >
            {downloading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <FileText className="size-4 mr-1" />}
            DOCX İndir
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Editor */}
        <div className="w-[52%] overflow-y-auto p-6 space-y-4">
          {/* CV Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCVUpload(f); e.target.value = "" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={parsing}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-all px-4 py-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parsing ? (
              <><Loader2 className="size-4 animate-spin" />CV okunuyor...</>
            ) : (
              <><Upload className="size-4" />Mevcut CV&apos;nizi yükleyin (PDF)</>
            )}
          </button>

          {/* Kişisel Bilgiler */}
          <Collapsible open={openSections.personal} onOpenChange={toggle("personal")}>
            <Card>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="size-4 text-muted-foreground" />
                  Kişisel Bilgiler
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.personal && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-3">
                  {/* Photo Upload */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border">
                      {cvData.personal.photo ? (
                        <img src={cvData.personal.photo} alt="Fotoğraf" className="w-full h-full object-cover" />
                      ) : (
                        <User className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm border border-border rounded-md px-3 py-1.5 hover:bg-muted/50 transition-colors w-fit">
                          <Upload className="size-3.5" />
                          Fotoğraf Yükle
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            const reader = new FileReader()
                            reader.onload = (ev) => updatePersonal("photo", ev.target?.result as string)
                            reader.readAsDataURL(file)
                          }}
                        />
                      </label>
                      {cvData.personal.photo && (
                        <button className="text-xs text-destructive hover:underline" onClick={() => updatePersonal("photo", "")}>
                          Fotoğrafı kaldır
                        </button>
                      )}
                      <p className="text-xs text-muted-foreground">Portre şablonunda görünür</p>
                    </div>
                  </div>
                  <Input placeholder="Adınız Soyadınız" className="text-base" value={cvData.personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} />
                  <Input placeholder="Frontend Developer" value={cvData.personal.title} onChange={(e) => updatePersonal("title", e.target.value)} />
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="E-posta" type="email" value={cvData.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} />
                    <Input placeholder="Telefon" value={cvData.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} />
                    <Input placeholder="Konum" value={cvData.personal.location} onChange={(e) => updatePersonal("location", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="LinkedIn URL" value={cvData.personal.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} />
                    <Input placeholder="Website" value={cvData.personal.website} onChange={(e) => updatePersonal("website", e.target.value)} />
                  </div>
                  <Textarea placeholder="Kendinizi kısaca tanıtın..." rows={4} value={cvData.personal.summary} onChange={(e) => updatePersonal("summary", e.target.value)} />
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
                  Deneyim
                  {cvData.experience.length > 0 && <span className="text-xs text-muted-foreground">({cvData.experience.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.experience && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="relative space-y-2 rounded-lg border border-border p-3">
                      <Button variant="ghost" size="icon-xs" className="absolute top-2 right-2 text-destructive hover:text-destructive" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                      <div className="grid grid-cols-2 gap-2 pr-8">
                        <Input placeholder="Şirket" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                        <Input placeholder="Pozisyon" value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Başlangıç (Oca 2022)" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                        <Input placeholder="Bitiş (Ara 2023)" value={exp.endDate} disabled={exp.current} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
                      </div>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={exp.current} onCheckedChange={(checked) => updateExperience(exp.id, { current: !!checked, endDate: checked ? "" : exp.endDate })} />
                        Devam ediyor
                      </label>
                      <Textarea placeholder="Görev ve başarılarınızı yazın..." rows={3} value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addExperience}>
                    <Plus className="size-4 mr-1" /> Deneyim Ekle
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
                  Eğitim
                  {cvData.education.length > 0 && <span className="text-xs text-muted-foreground">({cvData.education.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.education && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="relative space-y-2 rounded-lg border border-border p-3">
                      <Button variant="ghost" size="icon-xs" className="absolute top-2 right-2 text-destructive hover:text-destructive" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                      <div className="grid grid-cols-2 gap-2 pr-8">
                        <Input placeholder="Okul / Üniversite" value={edu.school} onChange={(e) => updateEducation(edu.id, { school: e.target.value })} />
                        <Input placeholder="Bölüm" value={edu.field} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="Derece (Lisans)" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
                        <Input placeholder="Başlangıç" value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} />
                        <Input placeholder="Bitiş" value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addEducation}>
                    <Plus className="size-4 mr-1" /> Eğitim Ekle
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
                  Beceriler
                  {cvData.skills.length > 0 && <span className="text-xs text-muted-foreground">({cvData.skills.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.skills && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-3">
                  {cvData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <Input placeholder="Beceri (React, Python...)" value={skill.name} onChange={(e) => updateSkill(skill.id, { name: e.target.value })} className="flex-1" />
                      <Select value={skill.level} onValueChange={(v) => updateSkill(skill.id, { level: v as Skill["level"] })}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>{SKILL_LEVELS.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon-xs" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeSkill(skill.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addSkill}>
                    <Plus className="size-4 mr-1" /> Beceri Ekle
                  </Button>
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
                  Diller
                  {cvData.languages.length > 0 && <span className="text-xs text-muted-foreground">({cvData.languages.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.languages && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-3">
                  {cvData.languages.map((lang) => (
                    <div key={lang.id} className="flex items-center gap-2">
                      <Input placeholder="Dil" value={lang.name} onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} className="flex-1" />
                      <Select value={lang.level} onValueChange={(v) => updateLanguage(lang.id, { level: v as Language["level"] })}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent>{LANG_LEVELS.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon-xs" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeLanguage(lang.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addLanguage}>
                    <Plus className="size-4 mr-1" /> Dil Ekle
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
                  Sertifikalar
                  {cvData.certifications.length > 0 && <span className="text-xs text-muted-foreground">({cvData.certifications.length})</span>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", openSections.certifications && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <CardContent className="p-4 space-y-4">
                  {cvData.certifications.map((cert) => (
                    <div key={cert.id} className="relative space-y-2 rounded-lg border border-border p-3">
                      <Button variant="ghost" size="icon-xs" className="absolute top-2 right-2 text-destructive hover:text-destructive" onClick={() => removeCertification(cert.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                      <div className="grid grid-cols-2 gap-2 pr-8">
                        <Input placeholder="Sertifika Adı" value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} />
                        <Input placeholder="Veren Kurum" value={cert.issuer} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Tarih" value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} />
                        <Input placeholder="URL (opsiyonel)" value={cert.url} onChange={(e) => updateCertification(cert.id, { url: e.target.value })} />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addCertification}>
                    <Plus className="size-4 mr-1" /> Sertifika Ekle
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Right Panel — Preview */}
        <div className="flex-1 overflow-y-auto bg-muted/30 p-4 flex flex-col items-center gap-6">
          <div className="w-full flex justify-center">
            <CVPreview data={cvData} template={template} zoom={zoom} previewRef={cvPreviewRef} />
          </div>

          {/* Template Selector */}
          <div className="w-full pb-4" style={{ maxWidth: "800px" }}>
            <p className="text-xs text-muted-foreground mb-3 font-medium">Şablon Seç</p>
            <div className="flex items-end gap-3 overflow-x-auto pb-1">
              {TEMPLATES.map((t) => (
                <TemplateThumbnail key={t.value} t={t} active={template === t.value} onClick={() => setTemplate(t.value)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        sessionToken={sessionToken}
        downloadFormat={downloadFormat}
        accessToken={accessToken}
        onPaymentSuccess={() => doDownload(downloadFormat)}
      />

      {/* ATS Modal */}
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
              if (typeof value === "string" && SKILL_LEVELS.includes(value as Skill["level"])) {
                return value as Skill["level"]
              }
              return "Orta"
            }

            const normalizeLanguageLevel = (value: unknown): Language["level"] => {
              if (typeof value === "string" && LANG_LEVELS.includes(value as Language["level"])) {
                return value as Language["level"]
              }
              return "B1"
            }

            setCvData((prev) => ({
              ...prev,
              personal: mapped.personal ? { ...prev.personal, ...(mapped.personal as object) } : prev.personal,
              experience: Array.isArray(mapped.experience)
                ? (mapped.experience as Record<string,unknown>[]).map((e) => ({ id: g(), company: "", position: "", startDate: "", endDate: "", current: false, description: "", ...e }))
                : prev.experience,
              education: Array.isArray(mapped.education)
                ? (mapped.education as Record<string,unknown>[]).map((e) => ({ id: g(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", ...e }))
                : prev.education,
              skills: Array.isArray(mapped.skills)
                ? (mapped.skills as Record<string,unknown>[]).map((e) => ({ id: g(), name: "", ...e, level: normalizeSkillLevel(e.level) }))
                : prev.skills,
              languages: Array.isArray(mapped.languages)
                ? (mapped.languages as Record<string,unknown>[]).map((e) => ({ id: g(), name: "", ...e, level: normalizeLanguageLevel(e.level) }))
                : prev.languages,
              certifications: Array.isArray(mapped.certifications)
                ? (mapped.certifications as Record<string,unknown>[]).map((e) => ({ id: g(), name: "", issuer: "", date: "", ...e }))
                : prev.certifications,
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
