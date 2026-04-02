"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, FileDown, ArrowRight } from "lucide-react"
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
const PADDLE_PRO_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || ""
const PADDLE_FIRST_MONTH_DISCOUNT_ID = process.env.NEXT_PUBLIC_PADDLE_FIRST_MONTH_DISCOUNT_ID || ""

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

  async function startCheckout(priceId: string, discountId?: string) {
    const customerEmail = (typeof window !== "undefined" ? localStorage.getItem("cvfit_user_email") : "") || ""

    if (!priceId) {
      toast.error("Paddle priceId eksik. NEXT_PUBLIC_PADDLE_PRO_PRICE_ID ayarlayin.")
      return
    }
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
          price_id: priceId,
          discount_id: discountId || null,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">CV&apos;nizi İndirin</DialogTitle>
          <p className="text-muted-foreground text-sm">İlk ay özel fiyatla başla, sonrasında aylık abonelikle devam et</p>
        </DialogHeader>

        <div className="mt-4 rounded-xl border-2 border-primary/40 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileDown className="size-5 text-primary" />
            <span className="font-semibold">Pro Plan</span>
          </div>

          <div className="text-3xl font-bold mb-1">₺39.99</div>
          <p className="text-xs text-muted-foreground mb-4">Sonraki aylarda ₺299/ay olarak devam eder.</p>

          <ul className="text-sm text-muted-foreground space-y-1 mb-5">
            <li>✓ Sınırsız indirme ({downloadFormat.toUpperCase()})</li>
            <li>✓ Tüm şablonlar</li>
            <li>✓ AI ATS optimizasyonu</li>
            <li>✓ Öncelikli destek</li>
          </ul>

          <Button
            className="w-full"
            disabled={loading !== null || !paddleReady}
            onClick={() => startCheckout(PADDLE_PRO_PRICE_ID, PADDLE_FIRST_MONTH_DISCOUNT_ID)}
          >
            {loading === "pro" ? <Loader2 className="size-4 mr-2 animate-spin" /> : <ArrowRight className="size-4 mr-2" />}
            {paddleReady ? "Hemen Basla" : "Odeme sistemi hazirlaniyor..."}
          </Button>
          </div>
        
      </DialogContent>
    </Dialog>
  )
}
