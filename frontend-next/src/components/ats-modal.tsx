"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, AlertCircle, Check, X, Star, ArrowRight, RotateCcw } from "lucide-react"
import type { CVData } from "@/types/cv"

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

  async function handleAnalyze() {
    setError("")
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
      const res = await fetch("/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Analiz sırasında bir hata oluştu."); return }
      setResult(data)
    } catch {
      setError("Sunucuya bağlanılamadı.")
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

  const scoreColor = result
    ? result.new_score >= 70 ? "text-green-500" : result.new_score >= 40 ? "text-yellow-500" : "text-red-500"
    : ""

  const scoreLabel = result
    ? result.new_score >= 70 ? "ATS'yi geçme ihtimali yüksek ✓" : result.new_score >= 40 ? "Orta uyumluluk" : "Düşük uyumluluk"
    : ""

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden" style={{ width: "92vw", maxWidth: "1100px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="border-b border-border px-6 py-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="size-4 text-primary" />
              ATS Analizi
            </DialogTitle>
          </DialogHeader>
        </div>

        {!result ? (
          /* ── Input view ── */
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              CV&apos;niz otomatik olarak kullanılacak. Hedef iş ilanını yapıştırın.
            </p>
            <div>
              <label className="text-sm font-medium mb-1.5 block">İş İlanı</label>
              <Textarea
                placeholder="İş ilanının metnini buraya yapıştırın — ne kadar detaylı olursa analiz o kadar isabetli olur..."
                rows={12}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="resize-none text-sm"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button className="w-full h-11" disabled={analyzing || !jobDesc.trim()} onClick={handleAnalyze}>
              {analyzing
                ? <><Loader2 className="size-4 mr-2 animate-spin" />Analiz Ediliyor...</>
                : <><Sparkles className="size-4 mr-2" />Analiz Et</>}
            </Button>
          </div>
        ) : (
          /* ── Result view — two columns, no scroll ── */
          <div className="flex flex-col flex-1 min-h-0">
            {/* Score bar — full width */}
            <div className="px-8 py-5 border-b border-border shrink-0 bg-muted/20">
              <div className="flex items-center gap-10">
                <div className="shrink-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Önceki Skor</p>
                  <p className="text-4xl font-bold text-muted-foreground">{result.original_score}<span className="text-2xl">%</span></p>
                </div>
                <ArrowRight className="size-5 text-muted-foreground shrink-0" />
                <div className="shrink-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Yeni Skor</p>
                  <p className={`text-4xl font-bold ${scoreColor}`}>{result.new_score}<span className="text-2xl">%</span></p>
                </div>
                <div className="flex-1">
                  <Progress value={result.new_score} className="h-3 mb-2" />
                  <p className="text-xs text-muted-foreground">{scoreLabel}</p>
                </div>
              </div>
            </div>

            {/* Two-column body */}
            <div className="grid grid-cols-2 gap-0 divide-x divide-border flex-1 overflow-hidden" style={{ minHeight: 0 }}>
              {/* Left column */}
              <div className="px-5 py-4 space-y-5 overflow-y-auto">
                {/* Added keywords */}
                {result.added_keywords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Eklenen Anahtar Kelimeler</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.added_keywords.map((kw) => (
                        <Badge key={kw} variant="secondary" className="gap-1.5 text-xs">
                          <span className="size-1.5 rounded-full bg-green-500 shrink-0" />{kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Öneriler</p>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                          <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right column — Skill map */}
              <div className="px-5 py-4 overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Beceri Haritası</p>
                <div className="space-y-4">
                  {([
                    { label: "Eşleşen", items: result.skill_match.matched, icon: <Check className="size-3.5 text-green-500" />, badgeCls: "border-green-500/30 text-green-700 dark:text-green-400 bg-green-500/10" },
                    { label: "Eksik",   items: result.skill_match.missing, icon: <X    className="size-3.5 text-red-500"   />, badgeCls: "border-red-500/30 text-red-700 dark:text-red-400 bg-red-500/10" },
                    { label: "Bonus",   items: result.skill_match.bonus,   icon: <Star className="size-3.5 text-blue-500"  />, badgeCls: "border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/10" },
                  ] as const).map(({ label, items, icon, badgeCls }) => (
                    <div key={label} className="rounded-xl border border-border bg-muted/20 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium">{icon}{label}</div>
                        <span className="text-xs text-muted-foreground font-semibold">{items.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <Badge key={item} variant="outline" className={`text-xs ${badgeCls}`}>{item}</Badge>
                        ))}
                        {items.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button className="flex-1 h-10" onClick={handleTransfer} disabled={!result.cv_data}>
                <ArrowRight className="size-4 mr-2" />
                Editöre Aktar
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={() => { setResult(null); setJobDesc(""); setError("") }} title="Yeni analiz">
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
