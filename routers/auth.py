from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
import os
from supabase import create_client

router = APIRouter()
templates = Jinja2Templates(directory="templates")

SUPABASE_URL      = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
BASE_URL          = os.getenv("BASE_URL", "")

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


def _get_base_url(request: Request) -> str:
    if BASE_URL:
        return BASE_URL.rstrip("/")
    return str(request.base_url).rstrip("/")


def get_user_from_token(token: str):
    try:
        return supabase.auth.get_user(token).user
    except:
        return None


def get_user_profile(user_id: str):
    try:
        return supabase.table("profiles").select("*").eq("id", user_id).single().execute().data
    except:
        return None


@router.get("/auth/google")
async def auth_google(request: Request):
    base = _get_base_url(request)
    result = supabase.auth.sign_in_with_oauth({
        "provider": "google",
        "options": {
            "redirect_to": f"{base}/auth/callback",
            "flow_type": "pkce"
        }
    })
    return RedirectResponse(url=result.url)


@router.get("/auth/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")
    if code:
        try:
            session = supabase.auth.exchange_code_for_session({"auth_code": code})
            return templates.TemplateResponse("callback.html", {
                "request": request,
                "access_token": session.session.access_token,
                "refresh_token": session.session.refresh_token,
                "error": ""
            })
        except Exception as e:
            return templates.TemplateResponse("callback.html", {
                "request": request, "access_token": "", "refresh_token": "", "error": str(e)
            })
    return templates.TemplateResponse("callback.html", {
        "request": request, "access_token": "", "refresh_token": "", "error": "Token bulunamadi"
    })


@router.post("/auth/verify")
async def auth_verify(request: Request):
    body = await request.json()
    token = body.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token gerekli")
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Gecersiz token")
    profile = get_user_profile(user.id)
    if not profile:
        supabase.table("profiles").insert({"id": user.id, "plan": "free", "free_credits": 1}).execute()
        profile = get_user_profile(user.id)
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.user_metadata.get("full_name", ""),
            "avatar_url": user.user_metadata.get("avatar_url", ""),
        },
        "profile": profile
    }


@router.post("/auth/logout")
async def auth_logout():
    try:
        supabase.auth.sign_out()
    except:
        pass
    return {"success": True}