from fastapi import APIRouter, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os, json, re
from anthropic import Anthropic
from supabase import create_client
import fitz  # PyMuPDF

router = APIRouter()

SUPABASE_URL     = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY= os.getenv("SUPABASE_ANON_KEY")
ANTHROPIC_API_KEY= os.getenv("ANTHROPIC_API_KEY")

supabase         = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)


# ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def get_match_score(cv: str, job: str) -> int:
    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=10,
        messages=[{
            "role": "user",
            "content": f"""Bu CV ile is ilani arasindaki anahtar kelime esleme yuzdesini hesapla.
Sadece 0-100 arasinda bir TAM SAYI yaz. Baska hicbir sey yazma.

CV:
{cv}

Is Ilani:
{job}"""
        }]
    )
    try:
        return int(''.join(filter(str.isdigit, message.content[0].text.strip()))[:3])
    except Exception:
        return 0


def get_user_from_token(token: str):
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except Exception:
        return None


def get_user_profile(user_id: str):
    try:
        result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        return result.data
    except Exception:
        return None


def cv_data_to_text(data: dict) -> str:
    """Convert structured CV data back to readable text for scoring."""
    parts = []
    if data.get("name"):
        parts.append(data["name"])
    if data.get("title"):
        parts.append(data["title"])
    if data.get("summary"):
        parts.append(data["summary"])
    if data.get("contact"):
        parts.append(" | ".join(data["contact"]))
    if data.get("skills"):
        parts.append("Beceriler: " + ", ".join(s["name"] if isinstance(s, dict) else str(s) for s in data["skills"]))
    if data.get("languages"):
        parts.append("Diller: " + ", ".join(l["name"] if isinstance(l, dict) else str(l) for l in data["languages"]))
    for exp in data.get("experience", []):
        line = f"{exp.get('title','')} - {exp.get('company','')} ({exp.get('date','')})"
        parts.append(line)
        for b in exp.get("bullets", []):
            parts.append(f"  - {b}")
    for edu in data.get("education", []):
        parts.append(f"{edu.get('degree','')} - {edu.get('school','')} ({edu.get('date','')})")
    for c in data.get("courses", []):
        parts.append(f"{c.get('name','')} - {c.get('provider','')} ({c.get('date','')})")
        if c.get("description"):
            parts.append(f"  {c['description']}")
    if data.get("added_keywords"):
        parts.append("Ek Beceriler: " + ", ".join(data["added_keywords"]))
    return "\n".join(parts)


GENERAL_SKILL_EVIDENCE = {
    "takim calismasi": ["takim", "ekip", "birlikte", "isbirligi", "koordinasyon"],
    "iletisim": ["iletisim", "musteri", "sunum", "raporlama", "gorusme"],
    "problem cozme": ["problem", "cozum", "iyilestirme", "analiz", "optimiz"],
    "liderlik": ["yonett", "lider", "ekip yonet", "sorumlu", "koordine"],
    "proje yonetimi": ["proje", "planlama", "zaman cizelgesi", "teslim", "paydas"],
    "zaman yonetimi": ["termin", "sure", "zaman", "oncelik", "deadline"],
    "analitik dusunme": ["analiz", "veri", "rapor", "olcum", "kpi"],
    "musteri odaklilik": ["musteri", "memnuniyet", "hizmet", "talep"],
}

GENERAL_SKILL_SYNONYMS = {
    "takim calismasi": ["takim calismasi", "ekip calismasi", "teamwork"],
    "iletisim": ["iletisim", "communication"],
    "problem cozme": ["problem cozme", "problem solving"],
    "liderlik": ["liderlik", "leadership"],
    "proje yonetimi": ["proje yonetimi", "project management"],
    "zaman yonetimi": ["zaman yonetimi", "time management"],
    "analitik dusunme": ["analitik dusunme", "analytical thinking"],
    "musteri odaklilik": ["musteri odaklilik", "customer focus"],
}


def _normalize_text(value: str) -> str:
    if not value:
        return ""
    value = value.lower()
    repl = {
        "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
    }
    for src, dst in repl.items():
        value = value.replace(src, dst)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def _extract_skill_name(skill_item):
    if isinstance(skill_item, dict):
        return str(skill_item.get("name", "")).strip()
    if isinstance(skill_item, str):
        return skill_item.strip()
    return ""


def _canonical_general_skill(skill_name: str):
    norm = _normalize_text(skill_name)
    for canonical, variants in GENERAL_SKILL_SYNONYMS.items():
        if norm in (_normalize_text(v) for v in variants):
            return canonical
    return None


def _term_or_synonym_in_cv(skill_name: str, cv_norm: str) -> bool:
    if not skill_name:
        return False

    norm = _normalize_text(skill_name)
    if norm and norm in cv_norm:
        return True

    canonical = _canonical_general_skill(skill_name)
    if canonical:
        for variant in GENERAL_SKILL_SYNONYMS.get(canonical, []):
            if _normalize_text(variant) in cv_norm:
                return True
    return False


def _is_general_transferable_skill(skill_name: str) -> bool:
    return _canonical_general_skill(skill_name) is not None


def _has_general_skill_evidence(skill_name: str, cv_norm: str) -> bool:
    canonical = _canonical_general_skill(skill_name)
    if not canonical:
        return False
    evidence_terms = GENERAL_SKILL_EVIDENCE.get(canonical, [])
    return any(_normalize_text(term) in cv_norm for term in evidence_terms)


def sanitize_skill_injection(cv_data: dict, original_cv_text: str, max_added: int = 5) -> dict:
    cv_norm = _normalize_text(original_cv_text)
    raw_skills = cv_data.get("skills", [])
    skill_match = cv_data.get("skill_match", {}) if isinstance(cv_data.get("skill_match", {}), dict) else {}
    bonus_terms = {_normalize_text(s) for s in (skill_match.get("bonus", []) or []) if isinstance(s, str)}

    kept = []
    seen = set()
    added_general_count = 0
    approved_added = []

    for item in raw_skills if isinstance(raw_skills, list) else []:
        name = _extract_skill_name(item)
        if not name:
            continue

        norm_name = _normalize_text(name)
        if not norm_name or norm_name in seen:
            continue

        mentioned_in_cv = _term_or_synonym_in_cv(name, cv_norm)
        is_bonus = norm_name in bonus_terms

        if mentioned_in_cv:
            kept.append(item)
            seen.add(norm_name)
            continue

        # Rule 4: never auto-inject bonus-category skills.
        if is_bonus:
            continue

        # Rule 1 + 2 + 3: only inferred general skills with evidence, max 5.
        if not _is_general_transferable_skill(name):
            continue
        if not _has_general_skill_evidence(name, cv_norm):
            continue
        if added_general_count >= max_added:
            continue

        kept.append(item)
        seen.add(norm_name)
        added_general_count += 1
        approved_added.append(name)

    cv_data["skills"] = kept
    cv_data["added_keywords"] = approved_added
    return cv_data


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/analyze")
async def analyze_cv(
    request: Request,
    job_description: str = Form(...),
    cv_text: str = Form(""),
    cv_file: UploadFile = File(None)
):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = get_user_from_token(token)

    if user:
        profile = get_user_profile(user.id)
        if not profile:
            supabase.table("profiles").insert({"id": user.id, "plan": "free", "free_credits": 1}).execute()
            profile = get_user_profile(user.id)

        plan = profile.get("plan", "free") if profile else "free"
        credits = profile.get("free_credits", 0) if profile else 0

        if credits <= 0:
            return JSONResponse({"error": "Analiz hakkınız bitti"}, status_code=402)
    else:
        return JSONResponse({"error": "Giriş yapılmamış"}, status_code=401)

    # CV içeriğini al
    cv_content = cv_text
    if cv_file and cv_file.filename:
        file_bytes = await cv_file.read()
        if cv_file.filename.lower().endswith(".pdf"):
            cv_content = extract_text_from_pdf(file_bytes)
        else:
            cv_content = file_bytes.decode("utf-8", errors="ignore")

    if not cv_content.strip():
        return JSONResponse({"error": "CV içeriği boş"}, status_code=400)

    original_score = get_match_score(cv_content, job_description)

    # Claude ile CV'yi optimize et + beceri haritası çıkar
    prompt = f"""Sen bir profesyonel CV uzmanısın. Aşağıdaki CV'yi verilen iş ilanına göre optimize et.

CV:
{cv_content}

İş İlanı:
{job_description}

KURALLAR:
1. CV'nin tüm bölümlerini koru ama anahtar kelimeler ekle
2. Deneyim bullet point'lerini güçlendir
3. Türkçe CV ise Türkçe, İngilizce ise İngilizce çıktı ver
4. Sadece JSON döndür, başka hiçbir şey yazma
5. skills ve languages için level değeri: CV'de seviye bilgisi varsa ona göre 1-5 arası kullan. CV'de seviye yoksa level alanını dahil etme (null veya 0 koyma, tamamen çıkar).
6. Eğer orijinal CV'de beceri seviyeleri veya dil seviyeleri yoksa yeni CV'de de uydurma, sadece isim yaz.
7. İş ilanındaki gereksinimleri analiz et ve beceri haritası oluştur
8. CV'de hiç geçmeyen spesifik teknik/domain becerilerini (araç, framework, mevzuat vb.) skills alanına ekleme.
9. Genel/aktarılabilir becerileri yalnızca CV içeriğinde dolaylı kanıt varsa ekle.
10. Bonus kategorisi becerileri skills listesine ekleme; sadece skill_match.bonus içinde göster.
11. Otomatik eklenen beceri sayısını sınırlı tut (maksimum 5).

JSON formatı:
{{
  "name": "Ad Soyad",
  "title": "Ünvan",
  "summary": "Kısa özet",
  "contact": ["tel", "email", "adres", "website"],
  "skills": [{{"name": "beceri adı", "level": 3}}],
  "languages": [{{"name": "dil adı", "level": 4}}],
  "education": [{{"degree": "Bölüm", "school": "Okul", "date": "Yıl"}}],
  "experience": [{{"title": "Pozisyon", "company": "Şirket", "date": "Tarih", "bullets": ["madde1"]}}],
  "courses": [{{"name": "Kurs", "provider": "Kurum", "date": "Tarih", "description": "Açıklama"}}],
  "added_keywords": ["kelime1", "kelime2"],
  "skill_match": {{
    "matched": ["CV'de olan ve iş ilanında aranan beceriler"],
    "missing": ["İş ilanında aranan ama CV'de olmayan beceriler"],
    "bonus": ["CV'de olan ama iş ilanında aranmayan ekstra beceriler"]
  }},
  "section_scores": {{
    "skills": 85,
    "experience": 70,
    "education": 90,
    "summary": 75
  }},
  "suggestions": ["CV'yi geliştirmek için 2-3 kısa öneri cümlesi"]
}}"""

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    # JSON bloğunu temizle
    raw = re.sub(r'^```json\s*', '', raw)
    raw = re.sub(r'^```\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)

    try:
        cv_data = json.loads(raw)
    except Exception:
        return JSONResponse({"error": "AI yanıtı parse edilemedi", "raw": raw[:500]}, status_code=500)

    cv_data = sanitize_skill_injection(cv_data, cv_content, max_added=5)

    new_score = get_match_score(cv_data_to_text(cv_data), job_description)

    # Ensure new score is never lower than original (keywords were added)
    if new_score < original_score:
        new_score = original_score

    # Kredi düş (pro dahil herkes için; paket 3 analiz hakkı verir)
    supabase.table("profiles").update({"free_credits": credits - 1}).eq("id", user.id).execute()

    # Analizi kaydet
    try:
        supabase.table("analyses").insert({
            "user_id": user.id,
            "original_score": original_score,
            "new_score": new_score,
            "job_description": job_description[:500],
            "cv_data": cv_data,
            "keywords": cv_data.get("added_keywords", [])
        }).execute()
    except Exception:
        pass

    return JSONResponse({
        "cv_data": cv_data,
        "original_score": original_score,
        "new_score": new_score,
        "added_keywords": cv_data.get("added_keywords", []),
        "skill_match": cv_data.get("skill_match", {"matched": [], "missing": [], "bonus": []}),
        "section_scores": cv_data.get("section_scores", {}),
        "suggestions": cv_data.get("suggestions", []),
        "remaining_credits": credits - 1
    })


@router.get("/api/history")
async def get_history(request: Request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = get_user_from_token(token)
    if not user:
        return JSONResponse({"error": "Giriş yapılmamış"}, status_code=401)
    try:
        result = supabase.table("analyses")\
            .select("id,original_score,new_score,job_description,cv_data,keywords,created_at")\
            .eq("user_id", user.id)\
            .order("created_at", desc=True)\
            .limit(20)\
            .execute()
        return JSONResponse({"history": result.data})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)