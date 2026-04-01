"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, FileDown, ArrowRight } from "lucide-react"

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: { token: string; eventCallback?: (data: PaddleEvent) => void }) => void
      Checkout: {
        open: (config: { transactionId: string }) => void
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || ""

export function PaymentModal({ open, onClose, sessionToken, downloadFormat, accessToken, onPaymentSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState<"pro" | null>(null)
  const [paddleReady, setPaddleReady] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!open) return
    if (window.Paddle) { setPaddleReady(true); return }
    const script = document.createElement("script")
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js"
    script.onload = () => {
      window.Paddle?.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: (event: PaddleEvent) => {
          if (event.name === "checkout.completed") {
            setSuccess(true)
            setTimeout(() => {
              onPaymentSuccess()
              onClose()
            }, 2000)
          }
        }
      })
      setPaddleReady(true)
    }
    document.head.appendChild(script)
  }, [open, onClose, onPaymentSuccess])

  async function startCheckout(plan: "pro") {
    setLoading(plan)
    try {
      const res = await fetch(`${BACKEND_URL}/api/payment/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, access_token: accessToken, session_token: sessionToken }),
      })
      const data = await res.json()
      if (data.transaction_id && paddleReady) {
        window.Paddle?.Checkout.open({ transactionId: data.transaction_id })
      }
    } catch (e) {
      console.error(e)
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

          <Button className="w-full" disabled={loading !== null} onClick={() => startCheckout("pro")}>
            {loading === "pro" ? <Loader2 className="size-4 mr-2 animate-spin" /> : <ArrowRight className="size-4 mr-2" />}
            Hemen Başla
          </Button>
          </div>
        
      </DialogContent>
    </Dialog>
  )
}
