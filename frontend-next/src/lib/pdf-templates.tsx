import React from "react"
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer"
import type { CVData } from "@/types/cv"

/* ──────────────────────────────────────────────────────────────
   Font Registration
   ────────────────────────────────────────────────────────────── */

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf", fontWeight: 400, fontStyle: "italic" },
  ],
})

/* ──────────────────────────────────────────────────────────────
   Template Type & Config
   ────────────────────────────────────────────────────────────── */

export type TemplateKey =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "creative"
  | "elegant"
  | "professional"
  | "tech"
  | "steel"
  | "bordeaux"
  | "navy"
  | "teal"

interface TemplateConfig {
  layout: "single" | "sidebar"
  sidebarWidth?: string
  sidebarBg?: string
  sidebarColor?: string
  accentColor: string
  headerBg?: string
  headerColor?: string
  fontFamily: string
  bodyColor: string
  mutedColor: string
  sectionBorderColor: string
}

const CONFIGS: Record<TemplateKey, TemplateConfig> = {
  classic: {
    layout: "single",
    accentColor: "#111827",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#9ca3af",
  },
  modern: {
    layout: "sidebar",
    sidebarWidth: "35%",
    sidebarBg: "#f3f4f6",
    sidebarColor: "#1f2937",
    accentColor: "#2563eb",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#d1d5db",
  },
  minimal: {
    layout: "single",
    accentColor: "#6b7280",
    fontFamily: "Roboto",
    bodyColor: "#4b5563",
    mutedColor: "#9ca3af",
    sectionBorderColor: "#e5e7eb",
  },
  executive: {
    layout: "single",
    headerBg: "#1e293b",
    headerColor: "#ffffff",
    accentColor: "#334155",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#64748b",
    sectionBorderColor: "#cbd5e1",
  },
  creative: {
    layout: "sidebar",
    sidebarWidth: "34%",
    sidebarBg: "#7c3aed",
    sidebarColor: "#ffffff",
    accentColor: "#7c3aed",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#ddd6fe",
  },
  elegant: {
    layout: "single",
    accentColor: "#0d9488",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#99f6e4",
  },
  professional: {
    layout: "single",
    accentColor: "#dc2626",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#fecaca",
  },
  tech: {
    layout: "sidebar",
    sidebarWidth: "34%",
    sidebarBg: "#0f172a",
    sidebarColor: "#e2e8f0",
    accentColor: "#38bdf8",
    fontFamily: "Roboto",
    bodyColor: "#334155",
    mutedColor: "#64748b",
    sectionBorderColor: "#e2e8f0",
  },
  steel: {
    layout: "sidebar",
    sidebarWidth: "30%",
    sidebarBg: "#3d6b8e",
    sidebarColor: "#ffffff",
    accentColor: "#2c5072",
    fontFamily: "Roboto",
    bodyColor: "#1a1a1a",
    mutedColor: "#666666",
    sectionBorderColor: "#d1d5db",
  },
  bordeaux: {
    layout: "sidebar",
    sidebarWidth: "33%",
    sidebarBg: "#7b1a1a",
    sidebarColor: "#ffffff",
    accentColor: "#7b1a1a",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#f5c2c2",
  },
  navy: {
    layout: "sidebar",
    sidebarWidth: "33%",
    sidebarBg: "#1a2744",
    sidebarColor: "#ffffff",
    accentColor: "#1a2744",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#c7d2e8",
  },
  teal: {
    layout: "single",
    accentColor: "#0d7b7b",
    fontFamily: "Roboto",
    bodyColor: "#374151",
    mutedColor: "#6b7280",
    sectionBorderColor: "#99e6e6",
  },
}

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */

function dateRange(start?: string, end?: string, current?: boolean) {
  return [start, current ? "Devam Ediyor" : end].filter(Boolean).join(" – ")
}

function skillPct(level: string) {
  return level === "Uzman" ? 95 : level === "İleri" ? 80 : level === "Orta" ? 60 : 35
}

function getInitials(fullName?: string) {
  const source = (fullName || "A S").trim()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "AS"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? "A"}${parts[parts.length - 1][0] ?? "S"}`.toUpperCase()
}

/* ──────────────────────────────────────────────────────────────
   Single-Column Templates
   ────────────────────────────────────────────────────────────── */

function ClassicPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { padding: 40, fontFamily: cfg.fontFamily, fontSize: 9, color: cfg.bodyColor },
    header: { textAlign: "center", paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: cfg.accentColor, marginBottom: 12 },
    name: { fontSize: 20, fontWeight: 700, color: cfg.accentColor, letterSpacing: 1 },
    title: { fontSize: 10, color: cfg.mutedColor, marginTop: 2 },
    contact: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 6, marginTop: 4, fontSize: 8, color: cfg.mutedColor },
    sHead: { fontSize: 9, fontWeight: 700, color: cfg.accentColor, letterSpacing: 2, borderBottomWidth: 1, borderBottomColor: cfg.sectionBorderColor, paddingBottom: 2, marginTop: 12, marginBottom: 6 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    bold: { fontWeight: 700, color: cfg.accentColor },
    desc: { fontSize: 8.5, color: cfg.bodyColor, lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: cfg.mutedColor },
    inlineWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
        {p.title ? <Text style={s.title}>{p.title}</Text> : null}
        <View style={s.contact}>
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((c, i) => (
            <Text key={i}>{i > 0 ? "|  " : ""}{c}</Text>
          ))}
        </View>
      </View>

      {p.summary ? (<><Text style={s.sHead}>ÖZET</Text><Text style={s.desc}>{p.summary}</Text></>) : null}

      {data.experience.length > 0 && (
        <>
          <Text style={s.sHead}>DENEYİM</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={{ marginBottom: 6 }}>
              <View style={s.row}>
                <Text style={{ fontSize: 9 }}>
                  <Text style={s.bold}>{exp.position}</Text>
                  {exp.company ? `, ${exp.company}` : ""}
                </Text>
                <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
            </View>
          ))}
        </>
      )}

      {data.education.length > 0 && (
        <>
          <Text style={s.sHead}>EĞİTİM</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={s.row}>
              <Text style={{ fontSize: 9 }}>
                <Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>
                {edu.school ? ` — ${edu.school}` : ""}
                {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
              </Text>
              <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
            </View>
          ))}
        </>
      )}

      {data.skills.length > 0 && (
        <>
          <Text style={s.sHead}>BECERİLER</Text>
          <View style={s.inlineWrap}>
            {data.skills.map((sk) => (
              <Text key={sk.id} style={{ fontSize: 9 }}>{sk.name} ({sk.level})</Text>
            ))}
          </View>
        </>
      )}

      {data.languages.length > 0 && (
        <>
          <Text style={s.sHead}>DİLLER</Text>
          <View style={s.inlineWrap}>
            {data.languages.map((l) => (
              <Text key={l.id} style={{ fontSize: 9 }}>{l.name} ({l.level})</Text>
            ))}
          </View>
        </>
      )}

      {data.certifications.length > 0 && (
        <>
          <Text style={s.sHead}>SERTİFİKALAR</Text>
          {data.certifications.map((c) => (
            <View key={c.id} style={{ marginBottom: 3 }}>
              <Text style={{ fontSize: 9 }}>
                <Text style={s.bold}>{c.name}</Text>
                {c.issuer ? ` — ${c.issuer}` : ""}
                {c.date ? `   ${c.date}` : ""}
              </Text>
            </View>
          ))}
        </>
      )}
    </Page>
  )
}

function MinimalPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const SIDEBAR_BG = "#263444"
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: cfg.fontFamily, fontSize: 9 },
    sidebar: { width: "33%", backgroundColor: SIDEBAR_BG, padding: 18, color: "#e2e8f0" },
    main: { width: "67%", padding: 24, color: "#374151" },
    photo: { width: 70, height: 70, borderRadius: 35, alignSelf: "center", marginBottom: 8 },
    photoPlaceholder: { width: 70, height: 70, borderRadius: 35, alignSelf: "center", marginBottom: 8, backgroundColor: "rgba(255,255,255,0.15)" },
    name: { fontSize: 13, fontWeight: 700, color: "#ffffff", textAlign: "center", marginBottom: 2 },
    titleText: { fontSize: 8, color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: 10 },
    sideHead: { fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: 1.5, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.2)", paddingBottom: 3, marginBottom: 5, marginTop: 10 },
    sideText: { fontSize: 8, color: "rgba(255,255,255,0.75)", marginBottom: 2 },
    sideMuted: { fontSize: 7, color: "rgba(255,255,255,0.45)", marginBottom: 2 },
    eduItem: { marginBottom: 6 },
    eduName: { fontSize: 8, fontWeight: 700, color: "#ffffff" },
    skillRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
    skillDot: { fontSize: 8, color: "rgba(255,255,255,0.4)", marginRight: 4 },
    skillText: { fontSize: 8, color: "rgba(255,255,255,0.8)" },
    langRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    mainHead: { fontSize: 9, fontWeight: 700, color: SIDEBAR_BG, letterSpacing: 1.5, borderBottomWidth: 1.5, borderBottomColor: SIDEBAR_BG, paddingBottom: 3, marginBottom: 8, marginTop: 12 },
    expItem: { marginBottom: 8, paddingLeft: 10, borderLeftWidth: 1.5, borderLeftColor: "#e5e7eb" },
    expRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontSize: 8, color: SIDEBAR_BG, fontWeight: 500, marginBottom: 1 },
    desc: { fontSize: 8.5, color: "#6b7280", lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: "#9ca3af" },
    certItem: { marginBottom: 4 },
  })
  return (
    <Page size="A4" style={s.page}>
      {/* Sidebar */}
      <View style={s.sidebar}>
        {p.photo ? (
          <Image src={p.photo} style={s.photo} />
        ) : (
          <View style={s.photoPlaceholder} />
        )}
        <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
        {p.title ? <Text style={s.titleText}>{p.title}</Text> : null}

        <Text style={s.sideHead}>İLETİŞİM</Text>
        {p.phone ? <Text style={s.sideText}>{p.phone}</Text> : null}
        {p.email ? <Text style={s.sideText}>{p.email}</Text> : null}
        {p.location ? <Text style={s.sideText}>{p.location}</Text> : null}
        {p.linkedin ? <Text style={s.sideText}>{p.linkedin}</Text> : null}
        {p.website ? <Text style={s.sideText}>{p.website}</Text> : null}

        {data.education.length > 0 && (
          <>
            <Text style={s.sideHead}>EĞİTİM</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.eduItem}>
                <Text style={s.eduName}>{[edu.degree, edu.field].filter(Boolean).join(" — ")}</Text>
                {edu.school ? <Text style={s.sideText}>{edu.school}</Text> : null}
                {(edu.startDate || edu.endDate) ? (
                  <Text style={s.sideMuted}>{dateRange(edu.startDate, edu.endDate)}</Text>
                ) : null}
              </View>
            ))}
          </>
        )}

        {data.skills.length > 0 && (
          <>
            <Text style={s.sideHead}>UZMANLIK</Text>
            {data.skills.map((sk) => (
              <View key={sk.id} style={s.skillRow}>
                <Text style={s.skillDot}>•</Text>
                <Text style={s.skillText}>{sk.name}</Text>
              </View>
            ))}
          </>
        )}

        {data.languages.length > 0 && (
          <>
            <Text style={s.sideHead}>DİLLER</Text>
            {data.languages.map((l) => (
              <View key={l.id} style={s.langRow}>
                <Text style={s.sideText}>{l.name}</Text>
                <Text style={s.sideMuted}>{l.level}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Main Content */}
      <View style={s.main}>
        {p.summary ? (
          <>
            <Text style={[s.mainHead, { marginTop: 0 }]}>HAKKIMDA</Text>
            <Text style={s.desc}>{p.summary}</Text>
          </>
        ) : null}

        {data.experience.length > 0 && (
          <>
            <Text style={s.mainHead}>DENEYİM</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={s.expItem}>
                <View style={s.expRow}>
                  <Text style={s.bold}>{exp.position || "Pozisyon"}</Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.company ? <Text style={s.accent}>{exp.company}</Text> : null}
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <Text style={s.mainHead}>SERTİFİKALAR</Text>
            {data.certifications.map((c) => (
              <View key={c.id} style={s.certItem}>
                <Text><Text style={s.bold}>{c.name}</Text>{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

function ExecutivePDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { fontFamily: cfg.fontFamily, fontSize: 9, color: cfg.bodyColor },
    header: { backgroundColor: cfg.headerBg!, padding: 28, paddingBottom: 16 },
    name: { fontSize: 22, fontWeight: 700, color: "#ffffff", letterSpacing: 0.5 },
    headerTitle: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 3 },
    headerContact: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, fontSize: 8, color: "rgba(255,255,255,0.6)" },
    body: { padding: 28, paddingTop: 16 },
    sHead: { fontSize: 10, fontWeight: 700, color: cfg.accentColor, letterSpacing: 1.5, borderBottomWidth: 1, borderBottomColor: cfg.sectionBorderColor, paddingBottom: 3, marginTop: 14, marginBottom: 6 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
    bold: { fontWeight: 700, color: "#1e293b" },
    desc: { fontSize: 8.5, color: cfg.bodyColor, lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: cfg.mutedColor },
    twoCols: { flexDirection: "row", gap: 20 },
    col: { flex: 1 },
    badge: { fontSize: 8, backgroundColor: "#f1f5f9", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, color: "#334155" },
    badgeWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
        {p.title ? <Text style={s.headerTitle}>{p.title}</Text> : null}
        <View style={s.headerContact}>
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((c, i) => (
            <Text key={i}>{c}</Text>
          ))}
        </View>
      </View>
      <View style={s.body}>
        {p.summary ? (<><Text style={s.sHead}>ÖZET</Text><Text style={s.desc}>{p.summary}</Text></>) : null}

        {data.experience.length > 0 && (
          <>
            <Text style={s.sHead}>DENEYİM</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{exp.position}</Text>{exp.company ? ` — ${exp.company}` : ""}</Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Text style={s.sHead}>EĞİTİM</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.row}>
                <Text><Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>{edu.school ? ` — ${edu.school}` : ""}</Text>
                <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
              </View>
            ))}
          </>
        )}

        <View style={s.twoCols}>
          {data.skills.length > 0 && (
            <View style={s.col}>
              <Text style={s.sHead}>BECERİLER</Text>
              <View style={s.badgeWrap}>
                {data.skills.map((sk) => (
                  <Text key={sk.id} style={s.badge}>{sk.name} ({sk.level})</Text>
                ))}
              </View>
            </View>
          )}
          {data.languages.length > 0 && (
            <View style={s.col}>
              <Text style={s.sHead}>DİLLER</Text>
              <View style={s.badgeWrap}>
                {data.languages.map((l) => (
                  <Text key={l.id} style={s.badge}>{l.name} ({l.level})</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {data.certifications.length > 0 && (
          <>
            <Text style={s.sHead}>SERTİFİKALAR</Text>
            {data.certifications.map((c) => (
              <Text key={c.id} style={{ fontSize: 9, marginBottom: 2 }}>
                <Text style={s.bold}>{c.name}</Text>
                {c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}
              </Text>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

function ElegantPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { padding: 36, fontFamily: cfg.fontFamily, fontSize: 9, color: cfg.bodyColor },
    topBar: { width: 40, height: 3, backgroundColor: cfg.accentColor, marginBottom: 8 },
    name: { fontSize: 22, fontWeight: 700, color: "#111827" },
    title: { fontSize: 10, color: cfg.accentColor, marginTop: 2 },
    contact: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, fontSize: 8, color: cfg.mutedColor },
    sHead: { fontSize: 10, fontWeight: 700, color: "#111827", letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: cfg.sectionBorderColor, paddingBottom: 3, marginTop: 14, marginBottom: 8 },
    summary: { fontSize: 9, fontStyle: "italic", color: cfg.bodyColor, lineHeight: 1.6 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
    bold: { fontWeight: 700, color: "#111827" },
    desc: { fontSize: 8.5, color: cfg.bodyColor, lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: cfg.mutedColor },
    timelineItem: { flexDirection: "row", marginBottom: 8 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: cfg.accentColor, marginRight: 8, marginTop: 2 },
    dotOutline: { width: 6, height: 6, borderRadius: 3, borderWidth: 1.5, borderColor: cfg.accentColor, marginRight: 8, marginTop: 2 },
    barBg: { height: 5, backgroundColor: "#e5e7eb", borderRadius: 2, flex: 1 },
    barFill: { height: 5, backgroundColor: cfg.accentColor, borderRadius: 2 },
    skillRow: { flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 6 },
    twoCols: { flexDirection: "row", gap: 20, marginTop: 10 },
    col: { flex: 1 },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.topBar} />
      <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
      {p.title ? <Text style={s.title}>{p.title}</Text> : null}
      <View style={s.contact}>
        {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((c, i) => (
          <Text key={i}>{c}</Text>
        ))}
      </View>

      {p.summary ? (<><Text style={s.sHead}>HAKKIMDA</Text><Text style={s.summary}>{p.summary}</Text></>) : null}

      {data.experience.length > 0 && (
        <>
          <Text style={s.sHead}>DENEYİM</Text>
          {data.experience.map((exp, idx) => (
            <View key={exp.id} style={s.timelineItem}>
              <View style={idx === 0 ? s.dot : s.dotOutline} />
              <View style={{ flex: 1 }}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{exp.position}</Text>{exp.company ? ` — ${exp.company}` : ""}</Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            </View>
          ))}
        </>
      )}

      {data.education.length > 0 && (
        <>
          <Text style={s.sHead}>EĞİTİM</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={s.row}>
              <Text><Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>{edu.school ? ` — ${edu.school}` : ""}</Text>
              <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
            </View>
          ))}
        </>
      )}

      <View style={s.twoCols}>
        {data.skills.length > 0 && (
          <View style={s.col}>
            <Text style={s.sHead}>BECERİLER</Text>
            {data.skills.map((sk) => (
              <View key={sk.id} style={s.skillRow}>
                <Text style={{ fontSize: 8, width: 60 }}>{sk.name}</Text>
                <View style={s.barBg}><View style={[s.barFill, { width: `${skillPct(sk.level)}%` }]} /></View>
              </View>
            ))}
          </View>
        )}
        {data.languages.length > 0 && (
          <View style={s.col}>
            <Text style={s.sHead}>DİLLER</Text>
            {data.languages.map((l) => (
              <View key={l.id} style={s.skillRow}>
                <Text style={{ fontSize: 8, width: 60 }}>{l.name}</Text>
                <View style={s.barBg}><View style={[s.barFill, { width: `${skillPct(l.level === "Anadil" ? "Uzman" : l.level)}%` }]} /></View>
              </View>
            ))}
          </View>
        )}
      </View>

      {data.certifications.length > 0 && (
        <>
          <Text style={s.sHead}>SERTİFİKALAR</Text>
          {data.certifications.map((c) => (
            <Text key={c.id} style={{ fontSize: 9, marginBottom: 2 }}>
              <Text style={s.bold}>{c.name}</Text>
              {c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}
            </Text>
          ))}
        </>
      )}
    </Page>
  )
}

function ProfessionalPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { fontFamily: cfg.fontFamily, fontSize: 9, color: cfg.bodyColor },
    strip: { height: 4, backgroundColor: cfg.accentColor },
    body: { padding: 32 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    name: { fontSize: 22, fontWeight: 700, color: "#111827" },
    title: { fontSize: 11, color: cfg.accentColor, marginTop: 2 },
    contact: { fontSize: 8, color: cfg.mutedColor, textAlign: "right" as const },
    summary: { borderLeftWidth: 3, borderLeftColor: cfg.accentColor, backgroundColor: "#f9fafb", padding: 10, paddingLeft: 12, fontSize: 9, color: cfg.bodyColor, lineHeight: 1.6, marginBottom: 12 },
    sHead: { fontSize: 10, fontWeight: 700, color: "#111827", letterSpacing: 1, marginTop: 14, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 3 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
    bold: { fontWeight: 700, color: "#111827" },
    companyAccent: { fontWeight: 500, color: cfg.accentColor },
    desc: { fontSize: 8.5, color: cfg.bodyColor, lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: cfg.mutedColor },
    skillPill: { fontSize: 8, backgroundColor: "#111827", color: "#ffffff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    twoCols: { flexDirection: "row", gap: 20, marginTop: 10 },
    col: { flex: 1 },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.strip} />
      <View style={s.body}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
            {p.title ? <Text style={s.title}>{p.title}</Text> : null}
          </View>
          <View>
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((c, i) => (
              <Text key={i} style={s.contact}>{c}</Text>
            ))}
          </View>
        </View>

        {p.summary ? <Text style={s.summary}>{p.summary}</Text> : null}

        {data.experience.length > 0 && (
          <>
            <Text style={s.sHead}>DENEYİM</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={s.row}>
                  <Text>
                    <Text style={s.bold}>{exp.position}</Text>
                    {exp.company ? <Text style={s.companyAccent}> — {exp.company}</Text> : null}
                  </Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Text style={s.sHead}>EĞİTİM</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.row}>
                <Text><Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>{edu.school ? ` — ${edu.school}` : ""}</Text>
                <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={s.sHead}>BECERİLER</Text>
        <View style={s.pillWrap}>
          {data.skills.map((sk) => (
            <Text key={sk.id} style={s.skillPill}>{sk.name}</Text>
          ))}
        </View>

        <View style={s.twoCols}>
          {data.languages.length > 0 && (
            <View style={s.col}>
              <Text style={s.sHead}>DİLLER</Text>
              {data.languages.map((l) => (
                <Text key={l.id} style={{ fontSize: 9, marginBottom: 2 }}>{l.name} ({l.level})</Text>
              ))}
            </View>
          )}
          {data.certifications.length > 0 && (
            <View style={s.col}>
              <Text style={s.sHead}>SERTİFİKALAR</Text>
              {data.certifications.map((c) => (
                <Text key={c.id} style={{ fontSize: 9, marginBottom: 2 }}>
                  <Text style={s.bold}>{c.name}</Text>
                  {c.issuer ? ` — ${c.issuer}` : ""}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  )
}

/* ──────────────────────────────────────────────────────────────
   Sidebar Templates
   ────────────────────────────────────────────────────────────── */

function SidebarSkillBar({ name, level, barColor, barBg }: { name: string; level: string; barColor: string; barBg: string }) {
  return (
    <View style={{ marginBottom: 5 }}>
      <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>{name}</Text>
      <View style={{ height: 4, backgroundColor: barBg, borderRadius: 2 }}>
        <View style={{ height: 4, width: `${skillPct(level)}%`, backgroundColor: barColor, borderRadius: 2 }} />
      </View>
    </View>
  )
}

function MainSkillBar({ name, level, barColor }: { name: string; level: string; barColor: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 6 }}>
      <Text style={{ fontSize: 8, fontWeight: 700, color: "#1a1a1a", width: 70 }}>{name}</Text>
      <View style={{ flex: 1, height: 6, backgroundColor: "#e5e7eb", borderRadius: 3 }}>
        <View style={{ height: 6, width: `${skillPct(level)}%`, backgroundColor: barColor, borderRadius: 3 }} />
      </View>
    </View>
  )
}

function ModernPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: cfg.fontFamily, fontSize: 9 },
    sidebar: { width: cfg.sidebarWidth!, backgroundColor: cfg.sidebarBg!, padding: 20, color: cfg.sidebarColor! },
    main: { flex: 1, padding: 24 },
    sideHead: { fontSize: 10, fontWeight: 700, color: cfg.accentColor, letterSpacing: 1, marginTop: 14, marginBottom: 6 },
    sideText: { fontSize: 8, color: "#4b5563", marginBottom: 2 },
    name: { fontSize: 20, fontWeight: 700, color: "#1f2937", marginBottom: 2 },
    title: { fontSize: 10, color: cfg.accentColor },
    mainHead: { fontSize: 10, fontWeight: 700, color: cfg.accentColor, letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 3, marginTop: 14, marginBottom: 6 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    bold: { fontWeight: 700, color: "#1f2937" },
    desc: { fontSize: 8.5, color: "#4b5563", lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: "#9ca3af" },
    barBg: { height: 4, backgroundColor: "#d1d5db", borderRadius: 2, marginTop: 2, marginBottom: 6 },
    barFill: { height: 4, backgroundColor: cfg.accentColor, borderRadius: 2 },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sidebar}>
        <Text style={s.sideHead}>İLETİŞİM</Text>
        {p.email ? <Text style={s.sideText}>{p.email}</Text> : null}
        {p.phone ? <Text style={s.sideText}>{p.phone}</Text> : null}
        {p.location ? <Text style={s.sideText}>{p.location}</Text> : null}
        {p.linkedin ? <Text style={s.sideText}>{p.linkedin}</Text> : null}
        {p.website ? <Text style={s.sideText}>{p.website}</Text> : null}

        {data.skills.length > 0 && (
          <>
            <Text style={s.sideHead}>BECERİLER</Text>
            {data.skills.map((sk) => (
              <View key={sk.id}>
                <Text style={[s.sideText, { fontWeight: 500 }]}>{sk.name}</Text>
                <View style={s.barBg}><View style={[s.barFill, { width: `${skillPct(sk.level)}%` }]} /></View>
              </View>
            ))}
          </>
        )}

        {data.languages.length > 0 && (
          <>
            <Text style={s.sideHead}>DİLLER</Text>
            {data.languages.map((l) => (
              <Text key={l.id} style={s.sideText}>{l.name} — {l.level}</Text>
            ))}
          </>
        )}
      </View>
      <View style={s.main}>
        <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
        {p.title ? <Text style={s.title}>{p.title}</Text> : null}

        {p.summary ? (<><Text style={s.mainHead}>HAKKIMDA</Text><Text style={s.desc}>{p.summary}</Text></>) : null}

        {data.experience.length > 0 && (
          <>
            <Text style={s.mainHead}>DENEYİM</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{exp.position}</Text>{exp.company ? `, ${exp.company}` : ""}</Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Text style={s.mainHead}>EĞİTİM</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.row}>
                <Text><Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>{edu.school ? ` — ${edu.school}` : ""}</Text>
                <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
              </View>
            ))}
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <Text style={s.mainHead}>SERTİFİKALAR</Text>
            {data.certifications.map((c) => (
              <Text key={c.id} style={{ fontSize: 9, marginBottom: 2 }}>
                <Text style={s.bold}>{c.name}</Text>{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}
              </Text>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

function CreativePDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const initials = (p.fullName || "CV")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: cfg.fontFamily, fontSize: 9 },
    sidebar: { width: cfg.sidebarWidth!, backgroundColor: cfg.sidebarBg!, padding: 20, color: "#ffffff" },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 8 },
    avatarText: { fontSize: 18, fontWeight: 700, color: "#ffffff" },
    sName: { fontSize: 11, fontWeight: 700, color: "#ffffff", textAlign: "center", marginBottom: 2 },
    sTitle: { fontSize: 8, color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: 14 },
    sHead: { fontSize: 9, fontWeight: 700, color: "#ffffff", letterSpacing: 1, marginTop: 14, marginBottom: 6, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.3)", paddingBottom: 2 },
    sText: { fontSize: 8, color: "rgba(255,255,255,0.85)", marginBottom: 2 },
    main: { flex: 1, padding: 24 },
    mainHead: { fontSize: 11, fontWeight: 700, color: cfg.accentColor, borderBottomWidth: 1.5, borderBottomColor: cfg.accentColor, paddingBottom: 3, marginTop: 14, marginBottom: 8 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    bold: { fontWeight: 700, color: "#1f2937" },
    desc: { fontSize: 8.5, color: "#4b5563", lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: "#9ca3af" },
    pill: { fontSize: 7.5, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, color: "#ffffff", marginBottom: 3 },
    pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sidebar}>
        <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
        <Text style={s.sName}>{p.fullName}</Text>
        {p.title ? <Text style={s.sTitle}>{p.title}</Text> : null}

        <Text style={s.sHead}>İLETİŞİM</Text>
        {p.email ? <Text style={s.sText}>{p.email}</Text> : null}
        {p.phone ? <Text style={s.sText}>{p.phone}</Text> : null}
        {p.location ? <Text style={s.sText}>{p.location}</Text> : null}
        {p.linkedin ? <Text style={s.sText}>{p.linkedin}</Text> : null}
        {p.website ? <Text style={s.sText}>{p.website}</Text> : null}

        {data.skills.length > 0 && (
          <>
            <Text style={s.sHead}>BECERİLER</Text>
            <View style={s.pillWrap}>
              {data.skills.map((sk) => (
                <Text key={sk.id} style={s.pill}>{sk.name}</Text>
              ))}
            </View>
          </>
        )}

        {data.languages.length > 0 && (
          <>
            <Text style={s.sHead}>DİLLER</Text>
            {data.languages.map((l) => (
              <Text key={l.id} style={s.sText}>{l.name} — {l.level}</Text>
            ))}
          </>
        )}
      </View>
      <View style={s.main}>
        {p.summary ? (<><Text style={s.mainHead}>HAKKIMDA</Text><Text style={s.desc}>{p.summary}</Text></>) : null}

        {data.experience.length > 0 && (
          <>
            <Text style={s.mainHead}>DENEYİM</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{exp.position}</Text>{exp.company ? `, ${exp.company}` : ""}</Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Text style={s.mainHead}>EĞİTİM</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.row}>
                <Text><Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>{edu.school ? ` — ${edu.school}` : ""}</Text>
                <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
              </View>
            ))}
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <Text style={s.mainHead}>SERTİFİKALAR</Text>
            {data.certifications.map((c) => (
              <Text key={c.id} style={{ fontSize: 9, marginBottom: 2 }}>
                <Text style={s.bold}>{c.name}</Text>{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}
              </Text>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

function TechPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: cfg.fontFamily, fontSize: 9 },
    sidebar: { width: cfg.sidebarWidth!, backgroundColor: cfg.sidebarBg!, padding: 18, color: cfg.sidebarColor! },
    sName: { fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 2 },
    sTitle: { fontSize: 9, color: cfg.accentColor, marginBottom: 14 },
    sHead: { fontSize: 9, fontWeight: 700, color: cfg.accentColor, letterSpacing: 1, textTransform: "uppercase" as const, marginTop: 14, marginBottom: 6, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.15)", paddingBottom: 2 },
    sText: { fontSize: 8, color: "rgba(226,232,240,0.8)", marginBottom: 2 },
    sLabel: { fontSize: 7, color: cfg.accentColor, marginBottom: 1 },
    main: { flex: 1, padding: 24 },
    mainHead: { fontSize: 10, fontWeight: 700, color: "#0f172a", letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 3, marginTop: 14, marginBottom: 8 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    bold: { fontWeight: 700, color: "#0f172a" },
    desc: { fontSize: 8.5, color: cfg.bodyColor, lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 8, color: cfg.mutedColor },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sidebar}>
        <Text style={s.sName}>{p.fullName || "Ad Soyad"}</Text>
        {p.title ? <Text style={s.sTitle}>{`> ${p.title}`}</Text> : null}

        <Text style={s.sHead}>İletişim</Text>
        {p.email ? <><Text style={s.sLabel}>@</Text><Text style={s.sText}>{p.email}</Text></> : null}
        {p.phone ? <><Text style={s.sLabel}>#</Text><Text style={s.sText}>{p.phone}</Text></> : null}
        {p.location ? <><Text style={s.sLabel}>~</Text><Text style={s.sText}>{p.location}</Text></> : null}
        {p.linkedin ? <><Text style={s.sLabel}>in</Text><Text style={s.sText}>{p.linkedin}</Text></> : null}
        {p.website ? <><Text style={s.sLabel}>www</Text><Text style={s.sText}>{p.website}</Text></> : null}

        {data.skills.length > 0 && (
          <>
            <Text style={s.sHead}>Teknolojiler</Text>
            {data.skills.map((sk) => (
              <SidebarSkillBar key={sk.id} name={sk.name} level={sk.level} barColor={cfg.accentColor} barBg="rgba(255,255,255,0.1)" />
            ))}
          </>
        )}

        {data.languages.length > 0 && (
          <>
            <Text style={s.sHead}>Diller</Text>
            {data.languages.map((l) => (
              <Text key={l.id} style={s.sText}>{l.name} — {l.level}</Text>
            ))}
          </>
        )}
      </View>
      <View style={s.main}>
        {p.summary ? (<><Text style={s.mainHead}>Hakkımda</Text><Text style={s.desc}>{p.summary}</Text></>) : null}

        {data.experience.length > 0 && (
          <>
            <Text style={s.mainHead}>Deneyim</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6, borderLeftWidth: 1.5, borderLeftColor: cfg.accentColor, paddingLeft: 8 }}>
                <View style={s.row}>
                  <Text><Text style={s.bold}>{exp.position}</Text></Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.company ? <Text style={{ fontSize: 8.5, color: cfg.accentColor }}>{exp.company}</Text> : null}
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Text style={s.mainHead}>Eğitim</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.row}>
                <Text><Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>{edu.school ? ` — ${edu.school}` : ""}</Text>
                <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
              </View>
            ))}
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <Text style={s.mainHead}>Sertifikalar</Text>
            {data.certifications.map((c) => (
              <Text key={c.id} style={{ fontSize: 9, marginBottom: 2 }}>
                <Text style={s.bold}>{c.name}</Text>{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}
              </Text>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

function SteelPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: cfg.fontFamily, fontSize: 9 },
    sidebar: { width: cfg.sidebarWidth!, backgroundColor: cfg.sidebarBg!, padding: 20, color: "#ffffff" },
    sHead: { fontSize: 10, fontWeight: 700, color: "#ffffff", letterSpacing: 1.5, textTransform: "uppercase" as const, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.3)", paddingBottom: 4, marginBottom: 10 },
    sLabel: { fontSize: 8, fontWeight: 700, color: "#ffffff", marginBottom: 1 },
    sValue: { fontSize: 7.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, marginBottom: 6 },
    main: { flex: 1, padding: 24 },
    name: { fontSize: 24, fontWeight: 300, color: "#1a1a1a", letterSpacing: 0.5, marginBottom: 10 },
    summary: { fontSize: 8.5, lineHeight: 1.6, color: "#444444", marginBottom: 6 },
    mainHead: { fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginTop: 14, marginBottom: 8 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    bold: { fontWeight: 700, color: "#1a1a1a" },
    desc: { fontSize: 8, color: "#444444", lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 7.5, color: "#888888" },
    italic: { fontSize: 8.5, fontStyle: "italic", color: "#666666", marginBottom: 3 },
    refText: { fontSize: 8.5, color: "#666666" },
  })
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sidebar}>
        <Text style={s.sHead}>Kişisel</Text>
        {p.fullName ? <><Text style={s.sLabel}>İsim</Text><Text style={s.sValue}>{p.fullName}</Text></> : null}
        {p.location ? <><Text style={s.sLabel}>Adres</Text><Text style={s.sValue}>{p.location}</Text></> : null}
        {p.phone ? <><Text style={s.sLabel}>Telefon numarası</Text><Text style={s.sValue}>{p.phone}</Text></> : null}
        {p.email ? <><Text style={s.sLabel}>E-posta</Text><Text style={s.sValue}>{p.email}</Text></> : null}
        {p.website ? <><Text style={s.sLabel}>İnternet sitesi</Text><Text style={s.sValue}>{p.website}</Text></> : null}
        {p.linkedin ? <><Text style={s.sLabel}>LinkedIn</Text><Text style={s.sValue}>{p.linkedin}</Text></> : null}

        {data.languages.length > 0 && (
          <>
            <Text style={[s.sHead, { marginTop: 16 }]}>Diller</Text>
            {data.languages.map((l) => (
              <View key={l.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.9)" }}>{l.name}</Text>
                <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>{l.level}</Text>
              </View>
            ))}
          </>
        )}
      </View>
      <View style={s.main}>
        <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
        {p.summary ? <Text style={s.summary}>{p.summary}</Text> : null}

        {data.experience.length > 0 && (
          <>
            <Text style={s.mainHead}>İş deneyimi</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 9.5, fontWeight: 700, color: "#1a1a1a" }}>{exp.position}</Text>
                <Text style={s.italic}>
                  {[exp.company, dateRange(exp.startDate, exp.endDate, exp.current)].filter(Boolean).join(", ")}
                </Text>
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Text style={s.mainHead}>Eğitim ve Nitelikler</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={s.row}>
                  <Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ") || "Bölüm"}</Text>
                  <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
                </View>
                {edu.school ? <Text style={s.italic}>{edu.school}</Text> : null}
              </View>
            ))}
          </>
        )}

        <Text style={s.mainHead}>Referanslar</Text>
        <Text style={s.refText}>Talep durumunda referans sunulabilir.</Text>

        {data.skills.length > 0 && (
          <>
            <Text style={s.mainHead}>Beceriler</Text>
            {data.skills.map((sk) => (
              <MainSkillBar key={sk.id} name={sk.name} level={sk.level} barColor={cfg.accentColor} />
            ))}
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <Text style={s.mainHead}>Kurslar</Text>
            {data.certifications.map((c) => (
              <View key={c.id} style={{ marginBottom: 8 }}>
                <View style={s.row}>
                  <Text style={s.bold}>{c.name}</Text>
                  <Text style={s.muted}>{c.date}</Text>
                </View>
                {c.issuer ? <Text style={s.italic}>{c.issuer}</Text> : null}
              </View>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

/* ──────────────────────────────────────────────────────────────
   Bordeaux PDF (dark red sidebar + photo)
   ────────────────────────────────────────────────────────────── */

function BordeauxPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const initials = getInitials(p.fullName)
  const SIDEBAR = "#7b1a1a"
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: cfg.fontFamily, fontSize: 9 },
    sidebar: { width: "33%", backgroundColor: SIDEBAR, padding: 16, color: "#ffffff" },
    main: { width: "67%", padding: 22, color: "#374151" },
    photo: { width: 68, height: 68, borderRadius: 34, alignSelf: "center", marginBottom: 6 },
    photoBox: { width: 68, height: 68, borderRadius: 34, alignSelf: "center", marginBottom: 6, backgroundColor: "rgba(255,255,255,0.2)" },
    photoInitialsWrap: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center" },
    photoInitials: { fontSize: 20, fontWeight: 700, color: "#ffffff" },
    name: { fontSize: 12, fontWeight: 700, color: "#ffffff", textAlign: "center", marginBottom: 2 },
    titleT: { fontSize: 8, color: "rgba(255,255,255,0.65)", textAlign: "center", marginBottom: 8 },
    sideHead: { fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: 1.5, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.2)", paddingBottom: 3, marginBottom: 4, marginTop: 10 },
    sideText: { fontSize: 8, color: "rgba(255,255,255,0.75)", marginBottom: 2 },
    dotRow: { flexDirection: "row", marginBottom: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 3, marginTop: 1 },
    skillLabel: { fontSize: 8, color: "rgba(255,255,255,0.8)", marginBottom: 2 },
    mainHead: { fontSize: 9, fontWeight: 700, color: SIDEBAR, letterSpacing: 1.5, borderBottomWidth: 1, borderBottomColor: `${SIDEBAR}40`, paddingBottom: 3, marginBottom: 7, marginTop: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontSize: 8, color: SIDEBAR, marginBottom: 2 },
    desc: { fontSize: 8.5, color: "#6b7280", lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 7.5, color: "#9ca3af" },
    expItem: { marginBottom: 8 },
  })
  function SideDots({ value, max = 5 }: { value: number; max?: number }) {
    return (
      <View style={s.dotRow}>
        {Array.from({ length: max }).map((_, i) => (
          <View key={i} style={[s.dot, { backgroundColor: i < value ? "#ffffff" : "rgba(255,255,255,0.2)" }]} />
        ))}
      </View>
    )
  }
  function langDots(level: string) {
    const m: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 4, C2: 5, Anadil: 5 }
    return m[level] ?? 3
  }
  function skillDots(level: string) {
    const m: Record<string, number> = { Başlangıç: 1, Orta: 2, İleri: 3, Uzman: 5 }
    return m[level] ?? 2
  }
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sidebar}>
        {p.photo ? (
          <Image src={p.photo} style={s.photo} />
        ) : (
          <View style={s.photoBox}>
            <View style={s.photoInitialsWrap}>
              <Text style={s.photoInitials}>{initials}</Text>
            </View>
          </View>
        )}
        <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
        {p.title ? <Text style={s.titleT}>{p.title}</Text> : null}
        <Text style={s.sideHead}>KİŞİSEL BİLGİLER</Text>
        {[p.phone, p.email, p.location, p.linkedin, p.website].filter(Boolean).map((c, i) => (
          <Text key={i} style={s.sideText}>{c}</Text>
        ))}
        {data.languages.length > 0 && (
          <>
            <Text style={s.sideHead}>DİLLER</Text>
            {data.languages.map((l) => (
              <View key={l.id}>
                <Text style={s.skillLabel}>{l.name}</Text>
                <SideDots value={langDots(l.level)} />
              </View>
            ))}
          </>
        )}
        {data.skills.length > 0 && (
          <>
            <Text style={s.sideHead}>BECERİLER</Text>
            {data.skills.map((sk) => (
              <View key={sk.id}>
                <Text style={s.skillLabel}>{sk.name}</Text>
                <SideDots value={skillDots(sk.level)} />
              </View>
            ))}
          </>
        )}
      </View>
      <View style={s.main}>
        {p.summary ? (
          <>
            <Text style={[s.mainHead, { marginTop: 0 }]}>PROFİL</Text>
            <Text style={s.desc}>{p.summary}</Text>
          </>
        ) : null}
        {data.education.length > 0 && (
          <>
            <Text style={s.mainHead}>EĞİTİMLER</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.expItem}>
                <View style={s.row}>
                  <Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(" — ")}</Text>
                  <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
                </View>
                {edu.school ? <Text style={s.accent}>{edu.school}</Text> : null}
              </View>
            ))}
          </>
        )}
        {data.experience.length > 0 && (
          <>
            <Text style={s.mainHead}>İŞ DENEYİMİ</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={s.expItem}>
                <View style={s.row}>
                  <Text style={s.bold}>{exp.position || "Pozisyon"}</Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.company ? <Text style={s.accent}>{exp.company}</Text> : null}
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}
        {data.certifications.length > 0 && (
          <>
            <Text style={s.mainHead}>SERTİFİKALAR</Text>
            {data.certifications.map((c) => (
              <View key={c.id} style={{ marginBottom: 4 }}>
                <Text><Text style={s.bold}>{c.name}</Text>{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

/* ──────────────────────────────────────────────────────────────
   Navy PDF (dark navy sidebar + photo)
   ────────────────────────────────────────────────────────────── */

function NavyPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const initials = getInitials(p.fullName)
  const SIDEBAR = "#1a2744"
  const s = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: cfg.fontFamily, fontSize: 9 },
    sidebar: { width: "33%", backgroundColor: SIDEBAR, padding: 16, color: "#ffffff" },
    main: { width: "67%", padding: 22, color: "#374151" },
    photo: { width: 68, height: 68, borderRadius: 34, alignSelf: "center", marginBottom: 6 },
    photoBox: { width: 68, height: 68, borderRadius: 34, alignSelf: "center", marginBottom: 6, backgroundColor: "rgba(255,255,255,0.15)" },
    photoInitialsWrap: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center" },
    photoInitials: { fontSize: 20, fontWeight: 700, color: "#ffffff" },
    name: { fontSize: 12, fontWeight: 700, color: "#ffffff", textAlign: "center", marginBottom: 2 },
    titleT: { fontSize: 8, color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: 8 },
    sideHead: { fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: 1.5, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.18)", paddingBottom: 3, marginBottom: 4, marginTop: 10 },
    sideText: { fontSize: 8, color: "rgba(255,255,255,0.72)", marginBottom: 2 },
    dotRow: { flexDirection: "row", marginBottom: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 3, marginTop: 1 },
    skillLabel: { fontSize: 8, color: "rgba(255,255,255,0.8)", marginBottom: 2 },
    skillBullet: { fontSize: 8, color: "rgba(255,255,255,0.75)", marginBottom: 2 },
    mainHead: { fontSize: 9, fontWeight: 700, color: SIDEBAR, letterSpacing: 1.5, borderBottomWidth: 1, borderBottomColor: `${SIDEBAR}30`, paddingBottom: 3, marginBottom: 7, marginTop: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontSize: 8, color: SIDEBAR, marginBottom: 2 },
    desc: { fontSize: 8.5, color: "#6b7280", lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 7.5, color: "#9ca3af" },
    expItem: { marginBottom: 8 },
  })
  function LangDots({ level }: { level: string }) {
    const map: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 4, C2: 5, Anadil: 5 }
    const val = map[level] ?? 3
    return (
      <View style={s.dotRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={[s.dot, { backgroundColor: i < val ? "#ffffff" : "rgba(255,255,255,0.18)" }]} />
        ))}
      </View>
    )
  }
  return (
    <Page size="A4" style={s.page}>
      <View style={s.sidebar}>
        {p.photo ? (
          <Image src={p.photo} style={s.photo} />
        ) : (
          <View style={s.photoBox}>
            <View style={s.photoInitialsWrap}>
              <Text style={s.photoInitials}>{initials}</Text>
            </View>
          </View>
        )}
        <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
        {p.title ? <Text style={s.titleT}>{p.title}</Text> : null}
        <Text style={s.sideHead}>KİŞİSEL BİLGİLER</Text>
        {[p.phone, p.email, p.location, p.linkedin, p.website].filter(Boolean).map((c, i) => (
          <Text key={i} style={s.sideText}>{c}</Text>
        ))}
        {data.languages.length > 0 && (
          <>
            <Text style={s.sideHead}>DİLLER</Text>
            {data.languages.map((l) => (
              <View key={l.id}>
                <Text style={s.skillLabel}>{l.name}</Text>
                <LangDots level={l.level} />
              </View>
            ))}
          </>
        )}
        {data.skills.length > 0 && (
          <>
            <Text style={s.sideHead}>BECERİLER</Text>
            {data.skills.map((sk) => (
              <Text key={sk.id} style={s.skillBullet}>▸ {sk.name}</Text>
            ))}
          </>
        )}
      </View>
      <View style={s.main}>
        {p.summary ? (
          <>
            <Text style={[s.mainHead, { marginTop: 0 }]}>PROFİL</Text>
            <Text style={s.desc}>{p.summary}</Text>
          </>
        ) : null}
        {data.experience.length > 0 && (
          <>
            <Text style={s.mainHead}>İŞ DENEYİMİ</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={s.expItem}>
                <View style={s.row}>
                  <Text style={s.bold}>{exp.position || "Pozisyon"}</Text>
                  <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.company ? <Text style={s.accent}>{exp.company}</Text> : null}
                {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
              </View>
            ))}
          </>
        )}
        {data.education.length > 0 && (
          <>
            <Text style={s.mainHead}>EĞİTİMLER</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={s.expItem}>
                <View style={s.row}>
                  <Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(" — ")}</Text>
                  <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
                </View>
                {edu.school ? <Text style={s.accent}>{edu.school}</Text> : null}
              </View>
            ))}
          </>
        )}
        {data.certifications.length > 0 && (
          <>
            <Text style={s.mainHead}>SERTİFİKALAR</Text>
            {data.certifications.map((c) => (
              <View key={c.id} style={{ marginBottom: 4 }}>
                <Text><Text style={s.bold}>{c.name}</Text>{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `  ${c.date}` : ""}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </Page>
  )
}

/* ──────────────────────────────────────────────────────────────
   Teal PDF (teal header + two-column body)
   ────────────────────────────────────────────────────────────── */

function TealPDF({ data, cfg }: { data: CVData; cfg: TemplateConfig }) {
  const p = data.personal
  const initials = getInitials(p.fullName)
  const TEAL = "#0d7b7b"
  const s = StyleSheet.create({
    page: { fontFamily: cfg.fontFamily, fontSize: 9, color: "#374151" },
    header: { flexDirection: "row", alignItems: "center", backgroundColor: TEAL, padding: 18, gap: 14 },
    photo: { width: 62, height: 62, borderRadius: 31 },
    photoBox: { width: 62, height: 62, borderRadius: 31, backgroundColor: "rgba(255,255,255,0.2)" },
    photoInitialsWrap: { width: 62, height: 62, borderRadius: 31, alignItems: "center", justifyContent: "center" },
    photoInitials: { fontSize: 18, fontWeight: 700, color: "#ffffff" },
    name: { fontSize: 16, fontWeight: 700, color: "#ffffff" },
    titleT: { fontSize: 9, color: "rgba(255,255,255,0.8)", marginTop: 2 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4, fontSize: 8, color: "rgba(255,255,255,0.85)" },
    body: { flexDirection: "row" },
    left: { width: "60%", padding: 18, borderRightWidth: 0.5, borderRightColor: "#e5e7eb" },
    right: { width: "40%", padding: 18 },
    lHead: { fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: 1.2, borderBottomWidth: 1.5, borderBottomColor: TEAL, paddingBottom: 3, marginBottom: 7, marginTop: 10 },
    rHead: { fontSize: 8, fontWeight: 700, color: TEAL, letterSpacing: 1.2, borderBottomWidth: 0.5, borderBottomColor: `${TEAL}40`, paddingBottom: 2, marginBottom: 6, marginTop: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontSize: 8, color: TEAL, marginBottom: 2 },
    desc: { fontSize: 8.5, color: "#6b7280", lineHeight: 1.5, marginTop: 1 },
    muted: { fontSize: 7.5, color: "#9ca3af" },
    expItem: { marginBottom: 8 },
    barBg: { height: 5, backgroundColor: "#f0fafa", borderRadius: 3, marginBottom: 5 },
    barFill: { height: 5, backgroundColor: TEAL, borderRadius: 3 },
    skillRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    langRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  })
  function skillPct(level: string) {
    return level === "Uzman" ? 95 : level === "İleri" ? 75 : level === "Orta" ? 50 : 25
  }
  return (
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        {p.photo ? (
          <Image src={p.photo} style={s.photo} />
        ) : (
          <View style={s.photoBox}>
            <View style={s.photoInitialsWrap}>
              <Text style={s.photoInitials}>{initials}</Text>
            </View>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{p.fullName || "Ad Soyad"}</Text>
          {p.title ? <Text style={s.titleT}>{p.title}</Text> : null}
          <View style={s.contactRow}>
            {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((c, i) => (
              <Text key={i}>{c}</Text>
            ))}
          </View>
        </View>
      </View>
      <View style={s.body}>
        <View style={s.left}>
          {p.summary ? (
            <>
              <Text style={[s.lHead, { marginTop: 0 }]}>PROFİL</Text>
              <Text style={s.desc}>{p.summary}</Text>
            </>
          ) : null}
          {data.education.length > 0 && (
            <>
              <Text style={s.lHead}>EĞİTİM</Text>
              {data.education.map((edu) => (
                <View key={edu.id} style={s.expItem}>
                  <View style={s.row}>
                    <Text style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(" — ")}</Text>
                    <Text style={s.muted}>{dateRange(edu.startDate, edu.endDate)}</Text>
                  </View>
                  {edu.school ? <Text style={s.accent}>{edu.school}</Text> : null}
                </View>
              ))}
            </>
          )}
          {data.experience.length > 0 && (
            <>
              <Text style={s.lHead}>İŞ DENEYİMİ</Text>
              {data.experience.map((exp) => (
                <View key={exp.id} style={s.expItem}>
                  <View style={s.row}>
                    <Text style={s.bold}>{exp.position || "Pozisyon"}</Text>
                    <Text style={s.muted}>{dateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                  </View>
                  {exp.company ? <Text style={s.accent}>{exp.company}</Text> : null}
                  {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
                </View>
              ))}
            </>
          )}
        </View>
        <View style={s.right}>
          {data.skills.length > 0 && (
            <>
              <Text style={[s.rHead, { marginTop: 0 }]}>BECERİLER</Text>
              {data.skills.map((sk) => (
                <View key={sk.id}>
                  <View style={s.skillRow}>
                    <Text style={{ fontSize: 8, color: "#374151" }}>{sk.name}</Text>
                    <Text style={s.muted}>{sk.level}</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${skillPct(sk.level)}%` }]} />
                  </View>
                </View>
              ))}
            </>
          )}
          {data.languages.length > 0 && (
            <>
              <Text style={s.rHead}>DİLLER</Text>
              {data.languages.map((l) => (
                <View key={l.id} style={s.langRow}>
                  <Text style={{ fontSize: 8, color: "#374151" }}>{l.name}</Text>
                  <Text style={s.muted}>{l.level}</Text>
                </View>
              ))}
            </>
          )}
          {data.certifications.length > 0 && (
            <>
              <Text style={s.rHead}>SERTİFİKALAR</Text>
              {data.certifications.map((c) => (
                <View key={c.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: "#111827" }}>{c.name}</Text>
                  {c.issuer ? <Text style={s.muted}>{c.issuer}</Text> : null}
                  {c.date ? <Text style={[s.muted, { color: TEAL }]}>{c.date}</Text> : null}
                </View>
              ))}
            </>
          )}
        </View>
      </View>
    </Page>
  )
}

/* ──────────────────────────────────────────────────────────────
   Public Document Generator
   ────────────────────────────────────────────────────────────── */

export function CVDocument({ data, template }: { data: CVData; template: TemplateKey }) {
  const cfg = CONFIGS[template]
  return (
    <Document>
      {template === "classic" && <ClassicPDF data={data} cfg={cfg} />}
      {template === "modern" && <ModernPDF data={data} cfg={cfg} />}
      {template === "minimal" && <MinimalPDF data={data} cfg={cfg} />}
      {template === "executive" && <ExecutivePDF data={data} cfg={cfg} />}
      {template === "creative" && <CreativePDF data={data} cfg={cfg} />}
      {template === "elegant" && <ElegantPDF data={data} cfg={cfg} />}
      {template === "professional" && <ProfessionalPDF data={data} cfg={cfg} />}
      {template === "tech" && <TechPDF data={data} cfg={cfg} />}
      {template === "steel" && <SteelPDF data={data} cfg={cfg} />}
      {template === "bordeaux" && <BordeauxPDF data={data} cfg={cfg} />}
      {template === "navy" && <NavyPDF data={data} cfg={cfg} />}
      {template === "teal" && <TealPDF data={data} cfg={cfg} />}
    </Document>
  )
}
