/* eslint-disable @next/next/no-img-element */
import type { CVData } from "@/types/cv"
import { getCVLabels } from "@/lib/cv-labels"

const SIDEBAR_BG = "#7b1a1a"
const ACCENT = "#7b1a1a"

function DotRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex gap-0.5 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="inline-block rounded-full"
          style={{
            width: 7,
            height: 7,
            backgroundColor: i < value ? "#ffffff" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </span>
  )
}

function langDots(level: string) {
  const map: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 4, C2: 5, Anadil: 5 }
  return map[level] ?? 3
}
function skillDots(level: string) {
  const map: Record<string, number> = { Başlangıç: 1, Orta: 2, İleri: 3, Uzman: 5 }
  return map[level] ?? 2
}

export default function BordeauxTemplate({ data, locale }: { data: CVData; locale?: string }) {
  const p = data.personal
  const L = getCVLabels(locale)
  return (
    <div className="flex" style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Sidebar */}
      <div className="flex-shrink-0 p-5 space-y-4" style={{ width: "33%", backgroundColor: SIDEBAR_BG, color: "#ffffff" }}>
        {/* Photo */}
        <div className="flex justify-center pt-2">
          {p.photo ? (
            <img
              src={p.photo}
              alt={p.fullName}
              className="rounded-full object-cover"
              style={{ width: 85, height: 85, border: "3px solid rgba(255,255,255,0.4)" }}
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ width: 85, height: 85, backgroundColor: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.3)" }}
            >
              {(p.fullName || "A S").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          )}
        </div>
        <div className="text-center">
          <h1 className="text-base font-bold text-white leading-tight">{p.fullName || L.fullName}</h1>
          {p.title && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{p.title}</p>}
        </div>

        {/* Contact */}
        <SideBlock title={L.contact}>
          <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
            {p.phone && <p>{p.phone}</p>}
            {p.email && <p className="break-all">{p.email}</p>}
            {p.location && <p>{p.location}</p>}
            {p.linkedin && <p className="break-all">{p.linkedin}</p>}
            {p.website && <p className="break-all">{p.website}</p>}
          </div>
        </SideBlock>

        {/* Languages */}
        {data.languages.length > 0 && (
          <SideBlock title={L.languagesShort}>
            <div className="space-y-2">
              {data.languages.map((l) => (
                <div key={l.id}>
                  <div className="flex justify-between items-center text-xs mb-0.5">
                    <span className="text-white">{l.name}</span>
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>{l.level}</span>
                  </div>
                  <DotRating value={langDots(l.level)} />
                </div>
              ))}
            </div>
          </SideBlock>
        )}

        {/* Skills in sidebar as dots */}
        {data.skills.length > 0 && (
          <SideBlock title={L.skills}>
            <div className="space-y-2">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <p className="text-xs text-white mb-0.5">{s.name}</p>
                  <DotRating value={skillDots(s.level)} />
                </div>
              ))}
            </div>
          </SideBlock>
        )}
      </div>

      {/* Main */}
      <div className="p-6 space-y-5 bg-white" style={{ width: "67%" }}>
        {p.summary && (
          <div>
            <MainHeading>{L.about}</MainHeading>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{p.summary}</p>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <MainHeading>{L.education}</MainHeading>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">
                      {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                    </span>
                    <span className="text-xs shrink-0 ml-4" style={{ color: ACCENT }}>
                      {edu.startDate}{edu.startDate && edu.endDate ? " – " : ""}{edu.endDate}
                    </span>
                  </div>
                  {edu.school && <p className="text-sm text-gray-500">{edu.school}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <MainHeading>{L.experience}</MainHeading>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{exp.position || L.position}</span>
                    <span className="text-xs shrink-0 ml-4" style={{ color: ACCENT }}>
                      {exp.startDate}{exp.startDate && " – "}{exp.current ? L.ongoing : exp.endDate}
                    </span>
                  </div>
                  {exp.company && <p className="text-sm font-medium text-gray-500">{exp.company}</p>}
                  {exp.description && (
                    <p className="text-sm text-gray-600 whitespace-pre-line mt-1 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <MainHeading>{L.certifications}</MainHeading>
            <div className="space-y-2">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-bold text-gray-900">{c.name}</span>
                  {c.issuer && <span className="text-gray-500"> — {c.issuer}</span>}
                  {c.date && <span className="ml-2" style={{ color: ACCENT, fontSize: 12 }}>{c.date}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="text-xs uppercase tracking-widest font-bold mb-2 pb-1"
        style={{ color: "#ffffff", borderBottom: "1px solid rgba(255,255,255,0.25)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-sm uppercase tracking-wider font-bold mb-3 pb-1 border-b"
      style={{ color: ACCENT, borderColor: `${ACCENT}40` }}
    >
      {children}
    </h2>
  )
}
