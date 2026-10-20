"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, AlertCircle, Check, X, Star, ArrowRight, RotateCcw } from "lucide-react"
import type { CVData } from "@/types/cv"
import { Link } from "@/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface ATSModalProps {
  open: boolean
  onClose: () => void
  cvData: CVData
  onTransfer?: (cvData: Record<string, unknown>) => void
}

interface AnalysisResult {
  cv_data: Record<string, unknown>
  original_score: number
  new_score: number
  added_keywords: string[]
  skill_match: { matched: string[]; missing: string[]; bonus: string[] }
  suggestions: string[]
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "")

function cvDataToText(cv: CVData): string {
  const lines: string[] = []
  const p = cv.personal
  if (p.fullName) lines.push(p.fullName)
  if (p.title) lines.push(p.title)
  const contact = [p.email, p.phone, p.location].filter(Boolean)
  if (contact.length) lines.push(contact.join(" | "))
  if (p.summary) lines.push("\nÖZET\n" + p.summary)
  if (cv.experience.length) {
    lines.push("\nDENEYİM")
    for (const e of cv.experience) {
      lines.push(`${e.position} — ${e.company}`)
      if (e.description) lines.push(e.description)
    }
  }
  if (cv.education.length) {
    lines.push("\nEĞİTİM")
    for (const e of cv.education) lines.push(`${[e.degree, e.field].filter(Boolean).join(", ")} — ${e.school}`)
  }
  if (cv.skills.length) lines.push("\nBECERİLER\n" + cv.skills.map(s => s.name).join(", "))
  return lines.join("\n")
}

export function ATSModal({ open, onClose, cvData, onTransfer }: ATSModalProps) {
  const [jobDesc, setJobDesc] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [noCredits, setNoCredits] = useState(false)
  const { refresh, profile } = useAuth()

  async function handleAnalyze() {
    setError("")
    setNoCredits(false)
    if (!jobDesc.trim()) { setError("Lütfen iş ilanını girin."); return }
    const token = localStorage.getItem("cvfit_access_token")
    if (!token) { setError("Analiz için giriş yapmanız gerekiyor."); return }
    const cvText = cvDataToText(cvData)
    if (!cvText.trim()) { setError("CV verisi bulunamadı. Önce CV'nizi doldurun."); return }

    setAnalyzing(true)
    try {
      const fd = new FormData()
      fd.append("job_description", jobDesc)
      fd.append("cv_text", cvText)
      const endpoint = API_URL ? `${API_URL}/analyze` : "/analyze"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const raw = await res.text()
      let data: Record<string, unknown> = {}
      try {
        data = raw ? JSON.parse(raw) as Record<string, unknown> : {}
      } catch {
        data = {}
      }

      if (!res.ok) {
        if (res.status === 402) setNoCredits(true)
        setError(
          typeof data.error === "string"
            ? data.error
            : typeof data.detail === "string"
              ? data.detail
              : `Analiz sırasında bir hata oluştu. (${res.status})`
        )
        return
      }

      if (!raw || !data || typeof data !== "object") {
        setError("Sunucudan geçersiz yanıt alındı.")
        return
      }

      if (
        typeof data.cv_data !== "object" ||
        typeof data.original_score !== "number" ||
        typeof data.new_score !== "number" ||
        !Array.isArray(data.added_keywords) ||
        typeof data.skill_match !== "object" ||
        !Array.isArray(data.suggestions)
      ) {
        setError("Sunucudan beklenen analiz formatı alınamadı.")
        return
      }

      setResult(data as unknown as AnalysisResult)
      void refresh()
    } catch (e) {
      setError(e instanceof Error ? `Sunucuya bağlanılamadı: ${e.message}` : "Sunucuya bağlanılamadı.")
    } finally {
      setAnalyzing(false)
    }
  }

  function handleTransfer() {
    if (!result?.cv_data) return
    onTransfer?.(result.cv_data)
    onClose()
  }

  function handleClose() {
    if (!analyzing) {
      setResult(null)
      setJobDesc("")
      setError("")
    }
    onClose()
  }

  const scoreTone = result
    ? result.new_score >= 70 ? "text-green-600 dark:text-green-400" : result.new_score >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
    : ""

  const scoreLabel = result
    ? result.new_score >= 70 ? "ATS'yi geçme ihtimali yüksek" : result.new_score >= 40 ? "Orta uyumluluk, birkaç eksik var" : "Düşük uyumluluk, eksikleri tamamla"
    : ""

  const credits = profile?.free_credits ?? 0
  const gain = result ? result.new_score - result.original_score : 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "cv-form flex max-h-[90vh] w-[92vw] flex-col gap-0 overflow-hidden p-0",
          result ? "sm:max-w-[960px]" : "sm:max-w-lg"
        )}
      >
        {!result ? (
          <>
            <div className="px-6 pb-5 pt-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  CV&apos;ni ilana göre analiz et
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Mevcut CV&apos;n otomatik kullanılır. Başvuracağın ilanı yapıştır.
                </p>
              </DialogHeader>

              <div className="mt-5">
                <label htmlFor="ats-job" className="mb-1.5 block text-[13px] font-medium text-foreground/80">
                  İş ilanı
                </label>
                <Textarea
                  id="ats-job"
                  placeholder="İlanın metnini buraya yapıştır. Ne kadar ayrıntılı olursa analiz o kadar isabetli olur."
                  rows={10}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="space-y-1.5">
                    <p className="text-sm text-destructive">{error}</p>
                    {noCredits && (
                      <Link href="/pricing" className="inline-block text-sm font-medium underline underline-offset-4">
                        Paketleri gör
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-muted/30 px-6 py-4">
              <Button className="h-11 w-full text-sm font-medium" disabled={analyzing || !jobDesc.trim()} onClick={handleAnalyze}>
                {analyzing ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" />Analiz ediliyor, birkaç saniye sürebilir</>
                ) : (
                  <><Sparkles className="mr-2 size-3.5" />Analiz et</>
                )}
              </Button>
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                Kalan analiz hakkın: {credits}. Analiz olası sorunları görmene yardımcı olur, sonuç garantisi vermez.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="shrink-0 px-6 pb-5 pt-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold tracking-tight">Analiz sonucu</DialogTitle>
                <p className="text-sm text-muted-foreground">{scoreLabel}</p>
              </DialogHeader>

              <div className="mt-5 flex items-center gap-5 rounded-xl border border-border bg-muted/40 px-5 py-4">
                <div className="shrink-0">
                  <p className="text-xs text-muted-foreground">Önceki</p>
                  <p className="text-2xl font-semibold leading-tight tabular-nums text-muted-foreground">%{result.original_score}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                <div className="shrink-0">
                  <p className="text-xs text-muted-foreground">Yeni</p>
                  <p className={cn("text-4xl font-semibold leading-none tracking-tight tabular-nums", scoreTone)}>%{result.new_score}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <Progress value={result.new_score} className="h-2" />
                  {gain > 0 && <p className="mt-2 text-xs text-muted-foreground">+{gain} puan artış</p>}
                </div>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto border-t border-border md:grid-cols-2 md:divide-x md:divide-border">
              <div className="space-y-6 px-6 py-5">
                {result.added_keywords.length > 0 && (
                  <section>
                    <h3 className="mb-2.5 text-sm font-semibold">CV&apos;ne eklenen anahtar kelimeler</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {result.added_keywords.map((kw) => (
                        <Badge key={kw} variant="secondary" className="gap-1.5 text-xs">
                          <span className="size-1.5 shrink-0 rounded-full bg-green-500" />{kw}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {result.suggestions.length > 0 && (
                  <section>
                    <h3 className="mb-2.5 text-sm font-semibold">Öneriler</h3>
                    <ul className="space-y-2.5">
                      {result.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/60" />
                          {sug}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <div className="px-6 py-5">
                <h3 className="mb-2.5 text-sm font-semibold">Beceri haritası</h3>
                <div className="space-y-3">
                  {([
                    { label: "Eşleşen", items: result.skill_match.matched, icon: <Check className="size-3.5 text-green-600 dark:text-green-400" />, badgeCls: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400" },
                    { label: "İlanda var, CV'de yok", items: result.skill_match.missing, icon: <X className="size-3.5 text-red-600 dark:text-red-400" />, badgeCls: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400" },
                    { label: "Ekstra becerilerin", items: result.skill_match.bonus, icon: <Star className="size-3.5 text-muted-foreground" />, badgeCls: "border-border bg-muted/50 text-muted-foreground" },
                  ] as const).map(({ label, items, icon, badgeCls }) => (
                    <div key={label} className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[13px] font-medium">{icon}{label}</div>
                        <span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <Badge key={item} variant="outline" className={cn("text-xs", badgeCls)}>{item}</Badge>
                        ))}
                        {items.length === 0 && <span className="text-xs text-muted-foreground">Yok</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 gap-2 border-t border-border bg-muted/30 px-6 py-4">
              <Button className="h-11 flex-1 text-sm font-medium" onClick={handleTransfer} disabled={!result.cv_data}>
                Düzenlenen CV&apos;yi editöre aktar
              </Button>
              <Button
                variant="outline"
                className="h-11 shrink-0 gap-2 text-sm"
                onClick={() => { setResult(null); setJobDesc(""); setError("") }}
              >
                <RotateCcw className="size-3.5" />
                Yeni analiz
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
