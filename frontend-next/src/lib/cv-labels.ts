export function getCVLabels(locale?: string) {
  const isEN = locale === "en"
  return {
    summary: isEN ? "SUMMARY" : "ÖZET",
    about: isEN ? "ABOUT ME" : "HAKKIMDA",
    experience: isEN ? "EXPERIENCE" : "DENEYİM",
    workExperience: isEN ? "WORK EXPERIENCE" : "İŞ DENEYİMİ",
    education: isEN ? "EDUCATION" : "EĞİTİM",
    skills: isEN ? "SKILLS" : "BECERİLER",
    languages: isEN ? "LANGUAGES" : "DİLLER",
    languagesShort: isEN ? "Languages" : "Diller",
    certifications: isEN ? "CERTIFICATIONS" : "SERTİFİKALAR",
    certificationsShort: isEN ? "Certifications" : "Sertifikalar",
    contact: isEN ? "CONTACT" : "İLETİŞİM",
    ongoing: isEN ? "Present" : "Devam Ediyor",
    fullName: isEN ? "Full Name" : "Ad Soyad",
    position: isEN ? "Position" : "Pozisyon",
    degree: isEN ? "Degree" : "Derece",
  }
}
