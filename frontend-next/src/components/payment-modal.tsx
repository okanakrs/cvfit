"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, Check, Lock } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: { token: string; eventCallback?: (data: PaddleEvent) => void }) => void
      Checkout: {
        open: (config: {
          transactionId?: string
          items?: Array<{ priceId: string; quantity: number }>
          customer?: { email?: string }
          discountId?: string
          successCallback?: () => void
        }) => void
      }
    }
  }
}

interface PaddleEvent {
  name: string
  data?: Record<string, unknown>
}

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  sessionToken: string
  downloadFormat: "pdf" | "docx"
  accessToken: string
  onPaymentSuccess: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ""
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || ""

export function PaymentModal({ open, onClose, sessionToken, downloadFormat, accessToken, onPaymentSuccess }: PaymentModalProps) {
  const { refresh } = useAuth()
  const [loading, setLoading] = useState<"pro" | null>(null)
  const [paddleReady, setPaddleReady] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!open) return

    if (!PADDLE_CLIENT_TOKEN) {
      toast.error("Paddle token eksik. NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ayarlayın.")
      return
    }

    if (window.Paddle) { setPaddleReady(true); return }
    const script = document.createElement("script")
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js"
    script.onload = () => {
      window.Paddle?.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: (event: PaddleEvent) => {
          if (event.name === "checkout.completed") {
            setSuccess(true)
            setTimeout(async () => {
              // Webhook is asynchronous; refresh auth a few times to reflect Pro plan in UI.
              for (let i = 0; i < 3; i++) {
                await refresh()
                await new Promise((resolve) => setTimeout(resolve, 600))
              }
              onPaymentSuccess()
              onClose()
            }, 2000)
          }
        }
      })
      setPaddleReady(true)
    }
    script.onerror = () => {
      setPaddleReady(false)
      toast.error("Odeme sistemi yuklenemedi. Sayfayi yenileyip tekrar deneyin.")
    }
    document.head.appendChild(script)
  }, [open, onClose, onPaymentSuccess, refresh])

  async function startCheckout() {
    const customerEmail = (typeof window !== "undefined" ? localStorage.getItem("cvfit_user_email") : "") || ""

    if (!accessToken) {
      toast.error("Odeme icin once giris yapmaniz gerekiyor.")
      return
    }
    if (!paddleReady || !window.Paddle) {
      toast.error("Odeme sistemi hazirlaniyor. Bir kac saniye sonra tekrar deneyin.")
      return
    }

    setLoading("pro")
    try {
      const endpoint = API_URL ? `${API_URL}/api/payment/create-checkout` : "/api/payment/create-checkout"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "pro",
          customer_email: customerEmail || null,
          access_token: accessToken,
          session_token: sessionToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.detail || "Checkout baslatilamadi")
      }
      if (!data?.transaction_id) {
        throw new Error("Transaction ID donmedi")
      }
      window.Paddle.Checkout.open({ transactionId: data.transaction_id })
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : "Odeme baslatilamadi")
    } finally {
      setLoading(null)
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle2 className="size-16 text-green-500" />
            <div>
              <h3 className="text-xl font-bold">Ödeme Başarılı!</h3>
              <p className="text-muted-foreground mt-1">CV&apos;niz indiriliyor...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const perks = [
    `PDF ve DOCX olarak sınırsız indirme`,
    "12 şablonun hepsi",
    "3 AI ATS analizi, ilana göre eksik anahtar kelimeler",
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <div className="px-6 pb-5 pt-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {downloadFormat.toUpperCase()} indirmek için paketi al
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              CV&apos;n hazır. Tek ödemeyle indir, abonelik yok.
            </p>
          </DialogHeader>

          <div className="mt-5 flex items-end justify-between gap-4 rounded-xl border border-border bg-muted/40 px-5 py-4">
            <div>
              <p className="text-sm font-medium">CVFit Paketi</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Tek seferlik, otomatik yenileme yok</p>
            </div>
            <p className="text-3xl font-semibold leading-none tracking-tight tabular-nums">₺139,99</p>
          </div>

          <ul className="mt-5 space-y-2.5">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border bg-muted/30 px-6 py-4">
          <Button
            className="h-11 w-full text-sm font-medium"
            disabled={loading !== null || !paddleReady}
            onClick={startCheckout}
          >
            {loading === "pro" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Lock className="mr-2 size-3.5" />
            )}
            {paddleReady ? "₺139,99 öde ve indir" : "Ödeme sistemi hazırlanıyor..."}
          </Button>
          <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
            Ödeme Paddle ile güvenle alınır, kart bilgilerin bize ulaşmaz. CV&apos;ndeki isim ilk indirmede hesabına sabitlenir.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
