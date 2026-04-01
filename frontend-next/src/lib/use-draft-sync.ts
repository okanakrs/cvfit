"use client"

import { useEffect, useRef, useCallback } from "react"
import type { CVData } from "@/types/cv"

const SESSION_KEY = "cvfit_session_token"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""

export function getSessionToken(): string {
  if (typeof window === "undefined") return ""
  let token = localStorage.getItem(SESSION_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, token)
  }
  return token
}

export function useDraftSync(cvData: CVData, template: string, ready: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSaved = useRef<string>("")

  const save = useCallback(async () => {
    const token = getSessionToken()
    const payload = JSON.stringify({ cv_data: cvData, template_id: template })
    if (payload === lastSaved.current) return
    lastSaved.current = payload
    // Always save to localStorage as fallback
    localStorage.setItem("cvfit_editor_data", JSON.stringify(cvData))
    localStorage.setItem("cvfit_editor_template", template)
    try {
      await fetch(`${BACKEND_URL}/api/cv/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_token: token,
          cv_data: cvData,
          template_id: template,
          color_id: "mavi",
        }),
      })
    } catch {
      // Silent fail - localStorage is the fallback
    }
  }, [cvData, template])

  useEffect(() => {
    if (!ready) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(save, 1500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [save, ready])
}

export async function loadDraftFromCloud(): Promise<{ cv_data: CVData; template_id: string } | null> {
  const token = getSessionToken()
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
  try {
    const res = await fetch(`${BACKEND_URL}/api/cv/draft/${token}`)
    const data = await res.json()
    if (data.draft) {
      return { cv_data: data.draft.cv_data, template_id: data.draft.template_id }
    }
  } catch {}
  return null
}
