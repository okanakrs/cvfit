"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorksPage() {
  const t = useTranslations("how_it_works");

  const STEPS = [
    { num: "01", title: t("step1_title"), desc: t("step1_desc") },
    { num: "02", title: t("step2_title"), desc: t("step2_desc") },
    { num: "03", title: t("step3_title"), desc: t("step3_desc") },
    { num: "04", title: t("step4_title"), desc: t("step4_desc") },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="pt-24 pb-20 text-center px-4">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4 font-medium">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
          {t("title")}
          <br />
          <span className="text-primary">{t("title_accent")}</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
          {t("subtitle")}
        </p>
        <a
          href="/builder"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold transition-all"
        >
          {t("try_now")} <ArrowRight className="size-4" />
        </a>
      </section>

      {/* Steps — vertical timeline */}
      <section className="max-w-2xl mx-auto px-4 pb-24">
        <div className="relative">
          <div
            className="absolute left-6 top-6 w-px bg-border hidden sm:block"
            style={{ bottom: "3rem" }}
          />
          <div className="space-y-0">
            {STEPS.map((step) => (
              <div key={step.num} className="relative flex gap-6 sm:gap-10 pb-10 last:pb-0">
                <div className="relative z-10 shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{step.num}</span>
                </div>
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
        <h2 className="text-2xl font-bold mb-3">{t("cta_title")}</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">{t("cta_body")}</p>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold transition-all"
        >
          {t("cta_button")} <ArrowRight className="size-4" />
        </a>
      </section>
    </main>
  );
}
