"use client"

import { ArrowRight } from "lucide-react"

const STEPS = [
  {
    num: "01",
    title: "CV'ni Yükle veya Sıfırdan Başla",
    desc: "Mevcut CV'ni PDF olarak yükle, AI saniyeler içinde tüm bilgileri otomatik doldurur. Ya da 12 şablondan birini seçerek sıfırdan başla.",
  },
  {
    num: "02",
    title: "Düzenle ve Kişiselleştir",
    desc: "Bilgilerini forma gir, önizlemeyi gerçek zamanlı takip et. Şablon değiştirmek tek tık — tüm veriler korunur.",
  },
  {
    num: "03",
    title: "AI ile Optimize Et",
    desc: "İş ilanını yapıştır, AI CV'ini o pozisyon için yeniden yapılandırır. ATS uyumluluk skoru ile sistemleri geçme şansını artır.",
  },
  {
    num: "04",
    title: "İndir ve Başvur",
    desc: "PDF veya DOCX formatında anında indir. A4 piksel-perfect çıktı, her platform uyumlu.",
  },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="pt-24 pb-20 text-center px-4">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4 font-medium">Nasıl Çalışır?</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
          Dakikalar içinde<br />
          <span className="text-primary">iş hazır CV.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
          Yükle, düzenle, optimize et, indir. 4 adım, sonsuz fırsat.
        </p>
        <a
          href="/builder"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold transition-all"
        >
          Hemen Dene <ArrowRight className="size-4" />
        </a>
      </section>

      {/* Steps — vertical timeline */}
      <section className="max-w-2xl mx-auto px-4 pb-24">
        <div className="relative">
          {/* Vertical line — only between steps, not after last */}
          <div className="absolute left-6 top-6 w-px bg-border hidden sm:block" style={{ bottom: "3rem" }} />

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex gap-6 sm:gap-10 pb-10 last:pb-0">
                {/* Circle */}
                <div className="relative z-10 shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{step.num}</span>
                </div>

                {/* Content */}
                <div className="pt-2 pb-2">
                  <h2 className="text-lg font-bold mb-2">{step.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-muted/30 py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Hazır mısın?</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          İlk ay sadece ₺39,99 — tüm özellikler dahil.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold transition-all"
        >
          Fiyatlandırmayı Gör <ArrowRight className="size-4" />
        </a>
      </section>
    </main>
  )
}
