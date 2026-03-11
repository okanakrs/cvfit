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
    except:
        return 0


def get_user_from_token(token: str):
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except:
        return None


def get_user_profile(user_id: str):
    try:
        result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        return result.data
    except:
        return None


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

        if plan != "pro" and credits <= 0:
            return JSONResponse({"error": "Kredi yetersiz"}, status_code=402)
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
    except:
        return JSONResponse({"error": "AI yanıtı parse edilemedi", "raw": raw[:500]}, status_code=500)

    new_score = get_match_score(str(cv_data), job_description)

    # Kredi düş (pro değilse)
    if plan != "pro":
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
    except:
        pass

    return JSONResponse({
        "cv_data": cv_data,
        "original_score": original_score,
        "new_score": new_score,
        "added_keywords": cv_data.get("added_keywords", []),
        "skill_match": cv_data.get("skill_match", {"matched": [], "missing": [], "bonus": []}),
        "section_scores": cv_data.get("section_scores", {}),
        "suggestions": cv_data.get("suggestions", []),
        "remaining_credits": credits - 1 if plan != "pro" else 9999
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