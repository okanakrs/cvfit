import type { CVData } from "@/types/cv"

/**
 * Maps a backend /analyze API response to CVData format
 * for auto-populating the editor.
 */
export function mapAnalysisToCV(analysisResult: Record<string, unknown>): CVData {
  const cv = (analysisResult.cv_data ?? {}) as Record<string, unknown>

  // Parse contact array
  const contact = (cv.contact ?? []) as string[]
  let email = ""
  let phone = ""
  let location = ""
  let linkedin = ""
  let website = ""

  for (const c of contact) {
    const lower = c.toLowerCase()
    if (lower.includes("@")) email = c
    else if (/^[\d\s+\-()]+$/.test(c.trim()) || lower.includes("tel")) phone = c
    else if (lower.includes("linkedin")) linkedin = c
    else if (lower.includes("http") || lower.includes("www") || lower.includes(".com"))
      website = c
    else location = c
  }

  // Parse experience
  const rawExp = (cv.experience ?? []) as Array<Record<string, unknown>>
  const experience = rawExp.map((e) => {
    const bullets = (e.bullets ?? []) as string[]
    const description = bullets.join("\n")
    const dateStr = (e.date ?? "") as string
    const [startDate, endDate] = parseDateRange(dateStr)
    return {
      id: crypto.randomUUID(),
      company: (e.company ?? "") as string,
      position: (e.title ?? "") as string,
      startDate,
      endDate,
      current: endDate.toLowerCase().includes("devam") || endDate.toLowerCase().includes("present"),
      description,
    }
  })

  // Parse education
  const rawEdu = (cv.education ?? []) as Array<Record<string, unknown>>
  const education = rawEdu.map((e) => {
    const dateStr = (e.date ?? "") as string
    const [startDate, endDate] = parseDateRange(dateStr)
    return {
      id: crypto.randomUUID(),
      school: (e.school ?? "") as string,
      degree: (e.degree ?? "") as string,
      field: "",
      startDate,
      endDate,
    }
  })

  // Parse skills
  const rawSkills = (cv.skills ?? []) as Array<Record<string, unknown>>
  const skills = rawSkills.map((s) => ({
    id: crypto.randomUUID(),
    name: (s.name ?? "") as string,
    level: mapSkillLevel((s.level as number) ?? 3),
  }))

  // Parse languages
  const rawLangs = (cv.languages ?? []) as Array<Record<string, unknown>>
  const languages = rawLangs.map((l) => ({
    id: crypto.randomUUID(),
    name: (l.name ?? "") as string,
    level: mapLangLevel((l.level as number) ?? 3),
  }))

  // Parse courses → certifications
  const rawCourses = (cv.courses ?? []) as Array<Record<string, unknown>>
  const certifications = rawCourses.map((c) => ({
    id: crypto.randomUUID(),
    name: (c.name ?? "") as string,
    issuer: (c.provider ?? "") as string,
    date: (c.date ?? "") as string,
    url: "",
  }))

  return {
    personal: {
      fullName: (cv.name ?? "") as string,
      title: (cv.title ?? "") as string,
      email,
      phone,
      location,
      linkedin,
      website,
      summary: (cv.summary ?? "") as string,
    },
    experience,
    education,
    skills,
    languages,
    certifications,
  }
}

function parseDateRange(dateStr: string): [string, string] {
  if (!dateStr) return ["", ""]
  const parts = dateStr.split(/\s*[-–—]\s*/)
  return [parts[0]?.trim() ?? "", parts[1]?.trim() ?? ""]
}

function mapSkillLevel(level: number): "Başlangıç" | "Orta" | "İleri" | "Uzman" {
  if (level >= 5) return "Uzman"
  if (level >= 4) return "İleri"
  if (level >= 2) return "Orta"
  return "Başlangıç"
}

function mapLangLevel(level: number): "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Anadil" {
  if (level >= 5) return "Anadil"
  if (level >= 4) return "C1"
  if (level >= 3) return "B2"
  if (level >= 2) return "B1"
  return "A2"
}
