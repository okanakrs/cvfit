import type { CVData } from "@/types/cv"
import { getCVLabels } from "@/lib/cv-labels"

const SIDEBAR_BG = "#263444"
const ACCENT = "#ffffff"

export default function MinimalTemplate({ data, locale }: { data: CVData; locale?: string }) {
  const p = data.personal
  const L = getCVLabels(locale)
  return (
    <div className="flex" style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Dark Sidebar */}
      <div className="flex-shrink-0 p-6 space-y-5" style={{ width: "33%", backgroundColor: SIDEBAR_BG, color: "#e2e8f0" }}>
        {/* Photo */}
        <div className="flex justify-center pt-2">
          {p.photo ? (
            <img
              src={p.photo}
              alt={p.fullName}
              className="rounded-full object-cover"
              style={{ width: 90, height: 90, border: "3px solid rgba(255,255,255,0.3)" }}
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ width: 90, height: 90, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "3px solid rgba(255,255,255,0.3)" }}
            >
              {(p.fullName || "A S").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Title */}
        <div className="text-center">
          <h1 className="text-lg font-bold text-white leading-tight">{p.fullName || L.fullName}</h1>
          {p.title && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{p.title}</p>}
        </div>

        {/* Contact */}
        <SideBlock title={L.contact}>
          <div className="space-y-1.5 text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
            {p.phone && <p>📞 {p.phone}</p>}
            {p.email && <p>✉ {p.email}</p>}
            {p.location && <p>📍 {p.location}</p>}
            {p.linkedin && <p className="break-all">in {p.linkedin}</p>}
            {p.website && <p className="break-all">🌐 {p.website}</p>}
          </div>
        </SideBlock>

        {/* Education */}
        {data.education.length > 0 && (
          <SideBlock title={L.education}>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-xs font-semibold text-white">
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                  </p>
                  {edu.school && <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{edu.school}</p>}
                  {(edu.startDate || edu.endDate) && (
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {edu.startDate}{edu.startDate && edu.endDate ? " – " : ""}{edu.endDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SideBlock>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <SideBlock title={L.skills}>
            <div className="space-y-1">
              {data.skills.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                  {s.name}
                </div>
              ))}
            </div>
          </SideBlock>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <SideBlock title={L.languagesShort}>
            <div className="space-y-1.5">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{l.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>{l.level}</span>
                </div>
              ))}
            </div>
          </SideBlock>
        )}
      </div>

      {/* Main Content */}
      <div className="p-7 space-y-5 bg-white" style={{ width: "67%" }}>
        {p.summary && (
          <div>
            <MainHeading>{L.about}</MainHeading>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{p.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <MainHeading>{L.experience}</MainHeading>
            <div className="space-y-4 ml-2 border-l-2 border-gray-200 pl-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div
                    className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: SIDEBAR_BG }}
                  />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{exp.position || L.position}</span>
                    <span className="text-xs text-gray-400 shrink-0 ml-4">
                      {exp.startDate}{exp.startDate && " – "}{exp.current ? L.ongoing : exp.endDate}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="text-xs font-medium mt-0.5" style={{ color: SIDEBAR_BG }}>
                      {exp.company}
                    </p>
                  )}
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
            <MainHeading>{L.certificationsShort}</MainHeading>
            <div className="space-y-2">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-bold text-gray-900">{c.name}</span>
                  {c.issuer && <span className="text-gray-600"> — {c.issuer}</span>}
                  {c.date && <span className="text-gray-400 ml-2">{c.date}</span>}
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
        style={{ color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.15)" }}
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
      className="text-sm uppercase tracking-wider font-bold mb-3 pb-1 border-b-2"
      style={{ color: SIDEBAR_BG, borderColor: SIDEBAR_BG }}
    >
      {children}
    </h2>
  )
}
