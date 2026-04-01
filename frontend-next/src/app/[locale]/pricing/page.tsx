"use client";

import { Check, ArrowRight, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";

export default function PricingPage() {
  const { user, login } = useAuth();
  const t = useTranslations("pricing");

  const features = [
    t("feature_1"),
    t("feature_2"),
    t("feature_3"),
    t("feature_4"),
    t("feature_5"),
    t("feature_6"),
    t("feature_7"),
    t("feature_8"),
  ];

  const faqs = [
    { q: t("faq_1_q"), a: t("faq_1_a") },
    { q: t("faq_2_q"), a: t("faq_2_a") },
    { q: t("faq_3_q"), a: t("faq_3_a") },
  ];

  const handleStart = () => {
    if (user) {
      window.location.href = "/builder";
      return;
    }
    login();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative pt-20 pb-10 text-center px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-56 w-[44rem] rounded-full bg-primary/10 blur-3xl" />
        <h1 className="relative text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          {t("title")}
        </h1>
        <p className="relative text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-balance">
          {t("subtitle")}
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground mb-5">
              <Crown className="size-3.5 text-primary" />
              {t("badge")}
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-background px-4 md:px-5 py-4">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm md:text-base">{t("first_month")}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      {t("starting_price")}
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap tabular-nums">
                    <span className="text-2xl md:text-3xl font-bold leading-none">₺39.99</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs md:text-sm text-muted-foreground">
              {t("renewal")}
            </p>

            <div className="my-7 h-px bg-border" />

            <ul className="space-y-2.5 mb-7">
              {features.map((f) => (
                <li
                  key={f}
                  className="grid grid-cols-[16px_1fr] items-start gap-2 text-sm md:text-[15px] leading-6"
                >
                  <Check className="size-4 text-primary mt-1" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleStart}
              className="relative flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold transition-all"
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </button>
            <p className="text-center text-xs text-muted-foreground mt-3">{t("cancel")}</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-border bg-card p-5 md:p-7 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            CVFit ile CV oluşturma, düzenleme, ATS analizi ve bulut kayıt tek abonelikte birleşir.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {features.map((f) => (
              <span key={f} className="rounded-full border border-border bg-background px-3 py-1.5">
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-border bg-muted/30 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-center">{t("faq_title")}</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-card p-4 md:p-5">
                <p className="font-semibold text-sm md:text-base mb-1.5 leading-snug">{item.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
