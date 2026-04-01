"use client"

import type { CVData } from "@/types/cv"

const SIDEBAR_BG = "#3d6b8e"
const BAR_COLOR = "#2c5072"

function SideLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>{children}</p>
}

function SideValue({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, marginBottom: 8 }}>{children}</p>
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: 8,
        marginTop: 16,
      }}
    >
      {children}
    </h3>
  )
}

function SkillBar({ name, level }: { name: string; level: string }) {
  const pct =
    level === "Uzman" ? 95 : level === "İleri" ? 80 : level === "Orta" ? 60 : 35
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a", minWidth: 70 }}>{name}</span>
        <div
          style={{
            flex: 1,
            height: 7,
            backgroundColor: "#e5e7eb",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              backgroundColor: BAR_COLOR,
              borderRadius: 3,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function SteelTemplate({ data }: { data: CVData }) {
  const p = data.personal
  const dateRange = (start?: string, end?: string, current?: boolean) =>
    [start, current ? "Halen" : end].filter(Boolean).join(" - ")

  return (
    <div style={{ display: "flex", minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* ── Sidebar ── */}
      <div
        style={{
          width: "30%",
          backgroundColor: SIDEBAR_BG,
          padding: "24px 16px",
          color: "#ffffff",
        }}
      >
        {/* Kişisel header */}
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            paddingBottom: 6,
            marginBottom: 14,
          }}
        >
          Kişisel
        </h2>

        {p.fullName && (
          <>
            <SideLabel>İsim</SideLabel>
            <SideValue>{p.fullName}</SideValue>
          </>
        )}

        {p.location && (
          <>
            <SideLabel>Adres</SideLabel>
            <SideValue>{p.location}</SideValue>
          </>
        )}

        {p.phone && (
          <>
            <SideLabel>Telefon numarası</SideLabel>
            <SideValue>{p.phone}</SideValue>
          </>
        )}

        {p.email && (
          <>
            <SideLabel>E-posta</SideLabel>
            <SideValue>{p.email}</SideValue>
          </>
        )}

        {p.website && (
          <>
            <SideLabel>İnternet sitesi</SideLabel>
            <SideValue>{p.website}</SideValue>
          </>
        )}

        {p.linkedin && (
          <>
            <SideLabel>LinkedIn</SideLabel>
            <SideValue>{p.linkedin}</SideValue>
          </>
        )}

        {/* Diller */}
        {data.languages.length > 0 && (
          <>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: 6,
                marginTop: 20,
                marginBottom: 14,
              }}
            >
              Diller
            </h2>
            {data.languages.map((lang) => (
              <div
                key={lang.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)" }}>{lang.name}</span>
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 600,
                  }}
                >
                  {lang.level}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Main Content ── */}
      <div style={{ width: "70%", padding: "24px 28px" }}>
        {/* Name */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "#1a1a1a",
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          {p.fullName || "Ad Soyad"}
        </h1>

        {/* Summary */}
        {p.summary && (
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "#444444",
              marginBottom: 8,
            }}
          >
            {p.summary}
          </p>
        )}

        {/* İş Deneyimi */}
        {data.experience.length > 0 && (
          <>
            <SectionHeading>İş deneyimi</SectionHeading>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{exp.position}</p>
                </div>
                <p style={{ fontSize: 12, fontStyle: "italic", color: "#666666", marginBottom: 4 }}>
                  {[exp.company, dateRange(exp.startDate, exp.endDate, exp.current)]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {exp.description && (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {exp.description.split("\n").map((line, i) => (
                      <li key={i} style={{ fontSize: 12, color: "#444444", lineHeight: 1.5, marginBottom: 2 }}>
                        {line.replace(/^[-•]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}

        {/* Eğitim */}
        {data.education.length > 0 && (
          <>
            <SectionHeading>Eğitim ve Nitelikler</SectionHeading>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
                    {[edu.degree, edu.field].filter(Boolean).join(", ") || "Bölüm"}
                  </p>
                  <span style={{ fontSize: 11, color: "#888888" }}>
                    {dateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: 12, fontStyle: "italic", color: "#666666" }}>
                  {edu.school}
                </p>
              </div>
            ))}
          </>
        )}

        {/* Referanslar */}
        <SectionHeading>Referanslar</SectionHeading>
        <p style={{ fontSize: 12, color: "#666666" }}>Talep durumunda referans sunulabilir.</p>

        {/* Beceriler */}
        {data.skills.length > 0 && (
          <>
            <SectionHeading>Beceriler</SectionHeading>
            {data.skills.map((skill) => (
              <SkillBar key={skill.id} name={skill.name} level={skill.level} />
            ))}
          </>
        )}

        {/* Sertifikalar / Kurslar */}
        {data.certifications.length > 0 && (
          <>
            <SectionHeading>Kurslar</SectionHeading>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
                    {cert.name}
                  </p>
                  <span style={{ fontSize: 11, color: "#888888" }}>{cert.date}</span>
                </div>
                {cert.issuer && (
                  <p style={{ fontSize: 12, fontStyle: "italic", color: "#666666" }}>{cert.issuer}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
