from fastapi import APIRouter, HTTPException, Request, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import os, json, re
from supabase import create_client
import fitz
from anthropic import Anthropic

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def _get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


class DraftUpsert(BaseModel):
    session_token: str
    cv_data: dict
    template_id: str = "classic"
    color_id: str = "mavi"


class ClaimDraft(BaseModel):
    session_token: str
    access_token: str


@router.post("/api/cv/draft")
async def upsert_draft(body: DraftUpsert):
    sb = _get_supabase()
    existing = sb.table("cv_drafts").select("id").eq("session_token", body.session_token).limit(1).execute()
    payload = {
        "session_token": body.session_token,
        "cv_data": body.cv_data,
        "template_id": body.template_id,
        "color_id": body.color_id,
    }
    if existing.data:
        sb.table("cv_drafts").update(payload).eq("session_token", body.session_token).execute()
    else:
        sb.table("cv_drafts").insert(payload).execute()
    return {"success": True}


@router.get("/api/cv/draft/{session_token}")
async def get_draft(session_token: str):
    sb = _get_supabase()
    result = sb.table("cv_drafts").select("*").eq("session_token", session_token).limit(1).execute()
    if not result.data:
        return {"draft": None}
    return {"draft": result.data[0]}


@router.post("/api/cv/parse")
async def parse_cv(file: UploadFile = File(...)):
    """PDF CV'yi okuyup yapılandırılmış CVData'ya çevirir."""
    content = await file.read()
    try:
        doc = fitz.open(stream=content, filetype="pdf")
        text = "".join(page.get_text() for page in doc)
    except Exception:
        raise HTTPException(status_code=400, detail="PDF okunamadı")

    if not text.strip():
        raise HTTPException(status_code=400, detail="PDF'den metin çıkarılamadı")

    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    prompt = f"""Aşağıdaki CV metnini analiz et ve JSON formatında döndür.
Sadece JSON döndür, başka hiçbir şey yazma.

Format:
{{
  "personal": {{
    "fullName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "summary": ""
  }},
  "experience": [
    {{
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }}
  ],
  "education": [
    {{
      "school": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }}
  ],
  "skills": [
    {{
      "name": "",
      "level": "Orta"
    }}
  ],
  "languages": [
    {{
      "name": "",
      "level": "B2"
    }}
  ],
  "certifications": [
    {{
      "name": "",
      "issuer": "",
      "date": "",
      "url": ""
    }}
  ]
}}

Skill level değerleri: "Başlangıç", "Orta", "İleri", "Uzman"
Language level değerleri: "A1", "A2", "B1", "B2", "C1", "C2", "Anadil"
Boş alanları boş string bırak, diziler boşsa [] yaz.

CV metni:
{text[:4000]}"""

    try:
        msg = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = msg.content[0].text.strip()
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            raw = match.group()
        cv_data = json.loads(raw)
        return {"success": True, "cv_data": cv_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CV parse edilemedi: {str(e)}")


@router.post("/api/cv/claim")
async def claim_draft(body: ClaimDraft):
    from routers.auth import get_user_from_token
    user = get_user_from_token(body.access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Geçersiz token")
    sb = _get_supabase()
    sb.table("cv_drafts").update({"user_id": user.id}).eq("session_token", body.session_token).execute()
    return {"success": True}
