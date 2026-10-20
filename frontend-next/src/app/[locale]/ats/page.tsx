"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "@/navigation"
import { FileText, Upload, Search, Loader2, Sparkles, Link, X } from "lucide-react"
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

function Hit({ d, children }: { d: number; children: React.ReactNode }) {
  return (
    <mark className="ats-mark" style={{ ["--d" as string]: `${d}s` }}>
      {children}
    </mark>
  )
}

function ReaderPreview() {
  return (
    <figure className="m-0">
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] md:p-8"
        role="img"
        aria-label="Örnek bir CV: ATS ilandaki anahtar kelimeleri bulur, bulamadıklarını eksik olarak işaretler."
      >
        <div className="ats-scanline" />

        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-lg font-semibold tracking-tight md:text-xl">Elif Kaya</p>
          <p className="text-xs text-muted-foreground">elif.kaya@ornek.com &middot; İstanbul</p>
        </div>
        <p className="text-sm text-muted-foreground">Veri analisti adayı</p>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold text-muted-foreground">Özet</p>
          <p className="mt-1.5 text-sm leading-relaxed">
            Perakende sektöründe 3 yıl deneyimli analist. Haftalık satış <Hit d={0.9}>raporlama</Hit> süreçlerini yönetir,{" "}
            <Hit d={1.1}>Excel</Hit> ile otomasyon kurar.
          </p>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-semibold text-muted-foreground">Deneyim</p>
          <p className="mt-1.5 text-sm font-medium">
            Satış analisti <span className="font-normal text-muted-foreground">&middot; Örnek Perakende A.Ş. &middot; 2022 – Günümüz</span>
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            <li>Aylık satış panolarını hazırladı ve yönetime sundu.</li>
            <li>
              <Hit d={1.7}>Excel</Hit> makrolarıyla <Hit d={1.9}>raporlama</Hit> süresini kısalttı.
            </li>
            <li>
              Departmanlar arası <Hit d={2.3}>takım çalışması</Hit> ile kampanya analizleri yaptı.
            </li>
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">İlanda var, CV&apos;de yok:</span>
          <span className="ats-miss inline-flex items-center gap-1 rounded-md border border-dashed px-2 py-0.5 text-xs font-medium" style={{ ["--d" as string]: "2.6s" }}>
            <X className="size-3" />SQL
          </span>
          <span className="ats-miss inline-flex items-center gap-1 rounded-md border border-dashed px-2 py-0.5 text-xs font-medium" style={{ ["--d" as string]: "2.8s" }}>
            <X className="size-3" />Power BI
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
        ATS bir CV&apos;yi böyle okur: ilandaki kelimeleri arar, bulamadıklarını eksik sayar. Örnek gösterim, gerçek bir sonuç değildir.
      </figcaption>
    </figure>
  )
}

export default function ATSPage() {
  const router = useRouter()
  const { user, profile, loading, login, refresh } = useAuth()

  const [file, setFile] = useState<File | null>(null)
  const [jobDesc, setJobDesc] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState("")

  // Giriş yapmadan kullanılamaz: doğrudan giriş sayfasına yönlendir, sonra buraya dön.
  useEffect(() => {
    if (loading || user) return
    try { sessionStorage.setItem("cvfit_post_login_redirect", "/ats") } catch { /* ignore */ }
    login()
  }, [loading, user, login])

  if (loading || !user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      {!loading && !user && (
        <p className="text-sm text-muted-foreground">Giriş sayfasına yönlendiriliyorsun...</p>
      )}
    </div>
  )

  const credits = profile?.free_credits ?? 0
  if (credits <= 0 && !analyzing) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8 text-center">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Sparkles className="size-8 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Analiz hakkın bitti</h1>
        <p className="text-muted-foreground max-w-md">
          {profile?.plan === "pro"
            ? "Paketine dahil analiz haklarının hepsini kullandın."
            : "Ücretsiz analiz hakkını kullandın. Yeni analizler için bir paket seçebilirsin."}
        </p>
      </div>
      {profile?.plan === "pro" ? (
        <Button onClick={() => router.push("/builder")}>CV Düzenleyiciye Dön</Button>
      ) : (
        <Button onClick={() => router.push("/pricing")}>Planı Gör</Button>
      )}
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
      void refresh()
      router.push(`/result/${resultId}`)
    } catch (e) {
      setError(e instanceof Error ? `Sunucuya bağlanılamadı: ${e.message}` : "Sunucuya bağlanılamadı.")
    } finally {
      setAnalyzing(false)
    }
  }

  const isFirstFree = profile?.plan !== "pro" && credits === 1

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <header className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
          <Sparkles className="size-3.5" />
          {isFirstFree ? "İlk analizin ücretsiz" : `Kalan analiz hakkın: ${credits}`}
        </p>
        <h1 className="mx-auto mt-4 max-w-xl text-3xl font-semibold tracking-tight text-balance md:text-5xl md:leading-[1.08]">
          CV&apos;n ATS filtresini geçiyor mu?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground text-balance">
          CV&apos;ni ve başvurmak istediğin ilanı ver. Uyum puanını, eksik anahtar kelimeleri ve ilana göre düzenlenmiş CV&apos;ni alırsın.
        </p>
      </header>

      <section className="mt-10 md:mt-12">
        <ReaderPreview />
      </section>

      <section className="mx-auto mt-12 max-w-xl space-y-7 md:mt-16">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">1</span>
            CV dosyanı yükle
          </label>
          <DropZone file={file} onFile={setFile} />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">2</span>
            İş ilanını yapıştır
          </label>
          <Textarea
            placeholder="İş ilanını buraya yapıştırın. Ne kadar detaylı olursa analiz o kadar isabetli olur."
            className="min-h-[160px] resize-none bg-card"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <label className="mb-1.5 mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Link className="size-3.5" />
            veya ilan linki (opsiyonel)
          </label>
          <Input
            placeholder="https://kariyer.net/is-ilani/..."
            className="bg-card"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">Metin ve link varsa metin öncelikli kullanılır.</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div>
          <Button
            className="h-12 w-full text-base"
            disabled={!file || (!jobDesc.trim() && !jobUrl.trim()) || analyzing}
            onClick={handleAnalyze}
          >
            {analyzing ? (
              <><Loader2 className="mr-2 size-4 animate-spin" />Analiz ediliyor, birkaç saniye sürebilir</>
            ) : (
              <><Search className="mr-2 size-4" />{isFirstFree ? "İlk analizimi ücretsiz yap" : "Analiz et"}</>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Analiz olası sorunları görmene yardımcı olur; görüşme veya sonuç garantisi vermez.
          </p>
        </div>
      </section>
    </main>
  )
}
