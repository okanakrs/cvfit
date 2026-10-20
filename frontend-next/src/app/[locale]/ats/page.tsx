"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "@/navigation"
import { FileText, Upload, Search, Loader2, Sparkles, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "")

function DropZone({ file, onFile }: { file: File | null; onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === "application/pdf") onFile(f)
  }, [onFile])

  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept=".pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
      {file ? (
        <>
          <FileText className="h-10 w-10 text-primary" />
          <div>
            <p className="text-sm font-semibold">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <span className="text-xs text-primary font-medium">Değiştirmek için tıkla</span>
        </>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">PDF&apos;inizi sürükleyin veya tıklayın</p>
            <p className="text-xs text-muted-foreground mt-1">Sadece .pdf dosyaları kabul edilir</p>
          </div>
        </>
      )}
    </button>
  )
}

export default function ATSPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  const [file, setFile] = useState<File | null>(null)
  const [jobDesc, setJobDesc] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState("")

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )

  if (!user || profile?.plan !== "pro") return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8 text-center">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Sparkles className="size-8 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">ATS Optimizasyonu</h1>
        <p className="text-muted-foreground max-w-md">
          Bu özellik yalnızca Pro kullanıcılara açıktır. CV&apos;nizi yapay zeka ile analiz edin.
        </p>
      </div>
      <Button onClick={() => router.push("/pricing")}>Planı Gör</Button>
    </div>
  )

  async function handleAnalyze() {
    setError("")
    if (!file) { setError("Lütfen CV dosyanızı yükleyin."); return }
    if (!jobDesc.trim() && !jobUrl.trim()) { setError("İş ilanı metni veya linki giriniz."); return }

    const token = localStorage.getItem("cvfit_access_token")
    if (!token) { setError("Lütfen önce giriş yapın."); return }

    setAnalyzing(true)
    try {
      const fd = new FormData()
      fd.append("cv_file", file)
      fd.append("job_description", jobDesc.trim() || jobUrl.trim())

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

      const resultId = crypto.randomUUID()
      sessionStorage.setItem(`analysis_${resultId}`, JSON.stringify(data))
      router.push(`/result/${resultId}`)
    } catch (e) {
      setError(e instanceof Error ? `Sunucuya bağlanılamadı: ${e.message}` : "Sunucuya bağlanılamadı.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-primary/10 mb-4">
          <Sparkles className="size-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">ATS Analizi</h1>
        <p className="mt-2 text-muted-foreground">CV&apos;nizi yükleyin, iş ilanıyla karşılaştırın</p>
      </div>

      <div className="space-y-5">
        {/* PDF Upload */}
        <div>
          <label className="text-sm font-medium mb-2 block">CV Dosyası</label>
          <DropZone file={file} onFile={setFile} />
        </div>

        {/* Job description */}
        <div>
          <label className="text-sm font-medium mb-2 block">İş İlanı Metni</label>
          <Textarea
            placeholder="İş ilanını buraya yapıştırın — ne kadar detaylı olursa analiz o kadar isabetli olur..."
            className="min-h-[160px] resize-none"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>

        {/* Job URL */}
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Link className="size-3.5" />
            İş İlanı Linki (opsiyonel)
          </label>
          <Input
            placeholder="https://kariyer.net/is-ilani/..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Metin ve link varsa metin öncelikli kullanılır.</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          className="w-full h-12"
          disabled={!file || (!jobDesc.trim() && !jobUrl.trim()) || analyzing}
          onClick={handleAnalyze}
        >
          {analyzing ? (
            <><Loader2 className="mr-2 size-4 animate-spin" />Analiz Ediliyor...</>
          ) : (
            <><Search className="mr-2 size-4" />Analiz Et</>
          )}
        </Button>
      </div>
    </main>
  )
}
