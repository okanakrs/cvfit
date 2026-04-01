from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
import os, logging, hmac, hashlib, json
from supabase import create_client

logger = logging.getLogger(__name__)

router = APIRouter()

SUPABASE_URL      = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
PADDLE_API_KEY    = os.getenv("PADDLE_API_KEY")
PADDLE_CLIENT_TOKEN = os.getenv("PADDLE_CLIENT_TOKEN", "")
PADDLE_WEBHOOK_SECRET = os.getenv("PADDLE_WEBHOOK_SECRET", "")

PADDLE_TEKIL_PRICE_ID = os.getenv("PADDLE_TEKIL_PRICE_ID", "pri_01kme95qpfjbqftqg6wgcf6qrt")
PADDLE_PRO_PRICE_ID   = os.getenv("PADDLE_PRO_PRICE_ID",   "pri_01kme9291xerp3e37wtm8z9pcx")

PADDLE_API_BASE = "https://api.paddle.com"

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


@router.get("/api/payment/public-config")
async def payment_public_config():
    """Frontend icin gerekli genel odeme konfigunu dondurur."""
    return {
        "paddle_client_token": PADDLE_CLIENT_TOKEN,
    }


def get_user_from_token(token: str):
    try:
        return supabase.auth.get_user(token).user
    except Exception:
        return None

def get_user_profile(user_id: str):
    try:
        return supabase.table("profiles").select("*").eq("id", user_id).single().execute().data
    except Exception:
        return None


@router.post("/api/payment/create-checkout")
async def create_checkout(request: Request):
    """
    Paddle Checkout oturumu oluşturur.
    Frontend Paddle.js ile bu transaction_id'yi kullanarak checkout açar.
    """
    body = await request.json()
    plan  = body.get("plan", "single")   # "single" veya "pro"
    token = body.get("access_token", "")
    session_token = body.get("session_token", "")

    user = get_user_from_token(token) if token else None
    if not user:
        raise HTTPException(status_code=401, detail="Giriş gerekli")

    price_id = PADDLE_TEKIL_PRICE_ID if plan == "single" else PADDLE_PRO_PRICE_ID

    import httpx
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{PADDLE_API_BASE}/transactions",
                headers={
                    "Authorization": f"Bearer {PADDLE_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "items": [{"price_id": price_id, "quantity": 1}],
                    "customer": {"email": user.email},
                    "custom_data": {
                        "user_id": user.id,
                        "plan": plan,
                        "session_token": session_token
                    }
                }
            )
        data = resp.json()
    except Exception as e:
        logger.error("Paddle transaction error: %s", e)
        raise HTTPException(status_code=500, detail="Ödeme sistemi ile bağlantı kurulamadı")

    if resp.status_code != 201:
        logger.error("Paddle error: %s", data)
        raise HTTPException(status_code=400, detail=data.get("error", {}).get("detail", "Ödeme başlatılamadı"))

    transaction_id = data["data"]["id"]

    # Ödemeyi pending olarak kaydet
    try:
        supabase.table("payments").insert({
            "user_id": user.id,
            "plan": plan,
            "amount": 3999 if plan == "single" else 29900,
            "transaction_id": transaction_id,
            "status": "pending"
        }).execute()
    except Exception as e:
        logger.error("Payment insert error: %s", e)

    return {"success": True, "transaction_id": transaction_id}


@router.post("/api/payment/webhook")
async def paddle_webhook(request: Request):
    """
    Paddle'dan gelen webhook olaylarını işler.
    Ödeme tamamlandığında kullanıcı planını günceller.
    """
    raw_body = await request.body()

    # Webhook imzasını doğrula
    if PADDLE_WEBHOOK_SECRET:
        signature = request.headers.get("paddle-signature", "")
        if not _verify_webhook_signature(raw_body, signature, PADDLE_WEBHOOK_SECRET):
            logger.warning("Paddle webhook signature mismatch")
            raise HTTPException(status_code=401, detail="Geçersiz imza")

    try:
        payload = json.loads(raw_body)
    except Exception:
        raise HTTPException(status_code=400, detail="Geçersiz payload")

    event_type = payload.get("event_type", "")
    logger.info("Paddle webhook: %s", event_type)

    # Ödeme tamamlandı
    
    if event_type == "transaction.completed":
        tx = payload.get("data", {})
        transaction_id = tx.get("id")
        custom_data    = tx.get("custom_data") or {}
        user_id        = custom_data.get("user_id")
        plan           = custom_data.get("plan", "single")

        if not user_id:
            # custom_data yoksa payments tablosundan bul
            try:
                row = supabase.table("payments").select("*").eq("transaction_id", transaction_id).single().execute()
                if row.data:
                    user_id = row.data["user_id"]
                    plan    = row.data["plan"]
            except Exception:
                pass

        if user_id:
            _activate_plan(user_id, plan)
            try:
                supabase.table("payments").update({"status": "success"}).eq("transaction_id", transaction_id).execute()
            except Exception as e:
                logger.error("Payment update error: %s", e)
            session_token = custom_data.get("session_token")
            if session_token:
                try:
                    supabase.table("cv_drafts").update({"user_id": user_id}).eq("session_token", session_token).execute()
                    draft = supabase.table("cv_drafts").select("id").eq("session_token", session_token).limit(1).execute()
                    draft_id = draft.data[0]["id"] if draft.data else None
                    supabase.table("cv_downloads").insert({
                        "user_id": user_id,
                        "cv_draft_id": draft_id,
                        "format": "pdf",
                        "payment_id": transaction_id,
                    }).execute()
                except Exception as e:
                    logger.error("Draft claim error: %s", e)

    # Abonelik yenilendi
    elif event_type == "subscription.activated":
        sub = payload.get("data", {})
        custom_data = sub.get("custom_data") or {}
        user_id     = custom_data.get("user_id")
        if user_id:
            _activate_plan(user_id, "pro")

    return {"success": True}


def _activate_plan(user_id: str, plan: str):
    """Kullanıcının planını aktifleştirir."""
    try:
        if plan == "pro":
            supabase.table("profiles").update({
                "plan": "pro",
                "free_credits": 9999
            }).eq("id", user_id).execute()
        else:
            profile = get_user_profile(user_id)
            new_credits = (profile.get("free_credits") or 0) + 1
            supabase.table("profiles").update({
                "free_credits": new_credits
            }).eq("id", user_id).execute()
        logger.info("Plan activated: user=%s plan=%s", user_id, plan)
    except Exception as e:
        logger.error("Plan activation error: %s", e)


def _verify_webhook_signature(raw_body: bytes, signature_header: str, secret: str) -> bool:
    """Paddle webhook imzasını doğrular."""
    try:
        # Paddle imza formatı: ts=timestamp;h1=hash
        parts = dict(p.split("=", 1) for p in signature_header.split(";"))
        ts    = parts.get("ts", "")
        h1    = parts.get("h1", "")
        signed_payload = f"{ts}:{raw_body.decode()}"
        expected = hmac.new(secret.encode(), signed_payload.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, h1)
    except Exception:
        return False