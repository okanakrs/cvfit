"use client"

import { useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  FileDown,
  Sparkles,
  Cloud,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

const TEMPLATES_PREVIEW = [
  { value: "classic", name: "Klasik", color: "bg-slate-100", accent: "bg-slate-400" },
  { value: "modern", name: "Modern", color: "bg-blue-50", accent: "bg-blue-500" },
  { value: "minimal", name: "Minimal", color: "bg-white", accent: "bg-gray-300" },
  { value: "executive", name: "Kurumsal", color: "bg-slate-800", accent: "bg-white", dark: true },
  { value: "creative", name: "Yaratıcı", color: "bg-violet-500", accent: "bg-white", dark: true },
  { value: "elegant", name: "Zarif", color: "bg-teal-50", accent: "bg-teal-500" },
  { value: "professional", name: "Profesyonel", color: "bg-red-50", accent: "bg-red-500" },
  { value: "tech", name: "Teknoloji", color: "bg-slate-900", accent: "bg-sky-400", dark: true },
  { value: "steel", name: "Çelik Mavi", color: "bg-sky-700", accent: "bg-white", dark: true },
  { value: "bordeaux", name: "Bordo", color: "bg-red-900", accent: "bg-white", dark: true },
  { value: "navy", name: "Lacivert", color: "bg-indigo-950", accent: "bg-white", dark: true },
  { value: "teal", name: "Turkuaz", color: "bg-teal-700", accent: "bg-white", dark: true },
]

function TemplateMockup({ color, accent, dark }: { color: string; accent: string; dark?: boolean }) {
  const line = dark ? "bg-white/20" : "bg-gray-300"
  const lineDark = dark ? "bg-white/40" : "bg-gray-500"
  return (
    <div className={`${color} rounded-md w-full h-full p-2 flex flex-col gap-1`}>
      <div className={`${lineDark} h-1.5 w-16 rounded`} />
      <div className={`${accent} h-0.5 w-10 rounded`} />
      <div className="mt-1 space-y-0.5">
        <div className={`${line} h-0.5 w-full rounded`} />
        <div className={`${line} h-0.5 w-4/5 rounded`} />
        <div className={`${line} h-0.5 w-full rounded`} />
      </div>
      <div className={`${accent} h-0.5 w-8 rounded mt-1`} />
      <div className="space-y-0.5">
        <div className={`${line} h-0.5 w-3/4 rounded`} />
        <div className={`${line} h-0.5 w-2/3 rounded`} />
      </div>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  useAuth()
  const hasDraft = useSyncExternalStore(
    () => () => {},
    () => {
      const saved = localStorage.getItem("cvfit_editor_data")
      if (!saved) return false
      try {
        const data = JSON.parse(saved)
        return Boolean(data?.personal?.fullName || (data?.experience?.length ?? 0) > 0)
      } catch {
        return false
      }
    },
    () => false
  )

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Glow top-center */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="mx-auto max-w-4xl px-4 pt-24 pb-20 md:pt-32 md:pb-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Ücretsiz · Kayıt gerektirmez
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            AI ile ATS Uyumlu CV&apos;nizi
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Hemen Oluşturun
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            12 hazır şablondan birini seç, AI ATS&apos;e göre optimize etsin, buluta kaydet — tek tıkla indir.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 px-8 text-sm font-semibold gap-2 rounded-full shadow-lg shadow-primary/20"
              onClick={() => router.push("/builder")}
            >
              {hasDraft ? "CV'me Devam Et" : "Hemen Başla"}
              <ArrowRight className="size-4" />
            </Button>

            {hasDraft && (
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-sm rounded-full"
                onClick={() => {
                  localStorage.removeItem("cvfit_editor_data")
                  localStorage.removeItem("cvfit_editor_template")
                  localStorage.removeItem("cvfit_session_token")
                  router.push("/builder")
                }}
              >
                Sıfırdan Başla
              </Button>
            )}
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Template Showcase ─────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">12 Profesyonel Şablon</h2>
            <p className="text-muted-foreground">Her meslek ve sektöre uygun tasarımlar</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {TEMPLATES_PREVIEW.map((t) => (
              <button
                key={t.name}
                onClick={() => router.push(`/builder?template=${t.value}`)}
                className="group flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-border shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all duration-200">
                  <TemplateMockup color={t.color} accent={t.accent} dark={t.dark} />
                </div>
                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Neden CVFit?</h2>
            <p className="text-muted-foreground">Sade, hızlı ve etkili</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="size-5 text-yellow-500" />,
                title: "Anında Başla",
                desc: "Kayıt olmadan, formlar doldurmadan. Hemen CV oluşturmaya başla.",
              },
              {
                icon: <Cloud className="size-5 text-blue-500" />,
                title: "Otomatik Bulut Kayıt",
                desc: "Tarayıcını kapatsanda CV'n kaybolmaz. Döndüğünde kaldığın yerden devam et.",
              },
              {
                icon: <FileDown className="size-5 text-green-500" />,
                title: "PDF & DOCX İndir",
                desc: "Hazırladığında tek seferlik ödemeyle indir. 39₺ PDF veya DOCX.",
              },
              {
                icon: <Sparkles className="size-5 text-purple-500" />,
                title: "AI ATS Optimizasyonu",
                desc: "Pro plan ile CV'ni iş ilanına göre yapay zeka ile optimize et.",
              },
              {
                icon: <Shield className="size-5 text-orange-500" />,
                title: "Güvenli & Gizli",
                desc: "Verileriniz şifreli saklanır. KVKK uyumlu altyapı.",
              },
              {
                icon: <CheckCircle2 className="size-5 text-teal-500" />,
                title: "ATS Uyumlu Şablonlar",
                desc: "Klasik şablonlar başta olmak üzere tüm şablonlar ATS sistemlerine uygun.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-background p-5">
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATS Info ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold mb-3">ATS Optimize CV Nedir?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ATS (Applicant Tracking System), şirketlerin başvuruları otomatik
              taradığı yazılımlardır. ATS uyumlu bir CV; doğru anahtar kelimeleri,
              temiz bir yapıyı ve standart bölümleri içerir. CVFit&apos;in
              şablonları bu kriterlere göre tasarlanmıştır.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">ATS Geçen CV Nasıl Yapılır?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ATS sistemini geçen bir CV oluşturmak için iş ilanındaki anahtar
              kelimeleri CV&apos;nize ekleyin, sade bir şablon kullanın ve
              tablolardan kaçının. CVFit Pro ile yapay zeka, CV&apos;nizi hedef
              ilanınıza göre otomatik olarak ATS&apos;e optimize eder.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-3">Hazır mısınız?</h2>
          <p className="text-muted-foreground mb-8">
            Binlerce kişi CVFit ile profesyonel CV&apos;sini oluşturdu.
            Siz de ücretsiz başlayın.
          </p>
          <Button size="lg" className="h-12 px-8 gap-2" onClick={() => router.push("/builder")}>
            CV Oluşturmaya Başla
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            <img src="/cvfit-logo-light.svg" alt="CVFit" className="h-10 md:h-11 w-auto dark:hidden" />
            <img src="/cvfit-logo-dark.svg" alt="CVFit" className="hidden h-10 md:h-11 w-auto dark:block" />
          </div>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="hover:text-foreground transition-colors">Gizlilik Politikası</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Kullanım Koşulları</a>
            <a href="/kvkk" className="hover:text-foreground transition-colors">KVKK</a>
            <a href="/cerez-politikasi" className="hover:text-foreground transition-colors">Çerez Politikası</a>
            <a href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">Mesafeli Satış Sözleşmesi</a>
          </div>
          <div>© 2025 CVFit. Tüm hakları saklıdır.</div>
        </div>
      </footer>
    </div>
  )
}
