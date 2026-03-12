from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
import os, json, hashlib, uuid, logging, requests as req_lib
from supabase import create_client

try:
    import iyzipay
except ImportError:
    iyzipay = None

logger = logging.getLogger(__name__)

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
IYZICO_API_KEY = os.getenv("IYZICO_API_KEY")
IYZICO_SECRET_KEY = os.getenv("IYZICO_SECRET_KEY")
IYZICO_BASE_URL = os.getenv("IYZICO_BASE_URL", "sandbox-api.iyzipay.com")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

iyzico_options = {
    'api_key': IYZICO_API_KEY,
    'secret_key': IYZICO_SECRET_KEY,
    'base_url': IYZICO_BASE_URL,
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

@router.post("/api/payment/confirm")
async def payment_confirm(request: Request):
    body = await request.json()
    token = body.get("access_token")
    plan = body.get("plan", "single")

    if not token:
        raise HTTPException(status_code=401, detail="Token gerekli")
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Gecersiz token")

    if plan == "pro":
        supabase.table("profiles").update({"plan": "pro", "free_credits": 9999}).eq("id", user.id).execute()
    else:
        profile = get_user_profile(user.id)
        new_credits = (profile.get("free_credits") or 0) + 1
        supabase.table("profiles").update({"free_credits": new_credits}).eq("id", user.id).execute()

    return {"success": True}


@router.post("/api/payment/start")
async def start_payment(request: Request):
    body = await request.json()
    plan = body.get("plan", "single")
    token_str = body.get("access_token", "")

    user = get_user_from_token(token_str) if token_str else None
    if not user:
        raise HTTPException(status_code=401, detail="Giris gerekli")

    conversation_id = str(uuid.uuid4()).replace("-", "")[:12]
    price_display = "39.00" if plan == "single" else "149.00"
    price_int = 3900 if plan == "single" else 14900
    plan_name = "Tekil Analiz" if plan == "single" else "Pro Plan - Aylik"

    full_name = user.user_metadata.get("full_name") or "CVFit Kullanici"
    name_parts = full_name.split()
    first_name = name_parts[0]
    last_name = name_parts[-1] if len(name_parts) > 1 else "Kullanici"

    request_data = {
        'locale': 'tr',
        'conversationId': conversation_id,
        'price': price_display,
        'paidPrice': price_display,
        'currency': 'TRY',
        'basketId': f'cvfit-{plan}-{user.id[:8]}',
        'paymentGroup': 'PRODUCT',
        'callbackUrl': f'{BASE_URL}/api/payment/callback',
        'enabledInstallments': ['1', '2', '3'],
        'buyer': {
            'id': user.id[:20],
            'name': first_name,
            'surname': last_name,
            'gsmNumber': '+905350000000',
            'email': user.email,
            'identityNumber': '11111111111',
            'lastLoginDate': '2025-01-01 00:00:00',
            'registrationDate': '2025-01-01 00:00:00',
            'registrationAddress': 'Turkiye',
            'ip': '85.34.78.112',
            'city': 'Istanbul',
            'country': 'Turkey',
            'zipCode': '34000'
        },
        'shippingAddress': {
            'contactName': full_name,
            'city': 'Istanbul',
            'country': 'Turkey',
            'address': 'Turkiye',
            'zipCode': '34000'
        },
        'billingAddress': {
            'contactName': full_name,
            'city': 'Istanbul',
            'country': 'Turkey',
            'address': 'Turkiye',
            'zipCode': '34000'
        },
        'basketItems': [{
            'id': f'cvfit-{plan}',
            'name': plan_name,
            'category1': 'Yazilim',
            'itemType': 'VIRTUAL',
            'price': price_display
        }]
    }

    try:
        supabase.table("payments").insert({
            "user_id": user.id,
            "plan": plan,
            "amount": price_int,
            "conversation_id": conversation_id,
            "status": "pending"
        }).execute()
    except Exception as e:
        logger.error("Payment insert error: %s", e)

    if iyzipay is None:
        raise HTTPException(status_code=500, detail="Odeme sistemi yapilandirilamadi")

    try:
        checkout_form = iyzipay.CheckoutFormInitialize().create(request_data, iyzico_options)
        result = json.loads(checkout_form.read().decode('utf-8'))
    except Exception as e:
        logger.error("iyzico connection error: %s", e)
        raise HTTPException(status_code=500, detail="Odeme sistemi ile baglanti kurulamadi")

    if result.get("status") == "success":
        return {
            "success": True,
            "checkoutFormContent": result.get("checkoutFormContent"),
            "token": result.get("token"),
            "conversation_id": conversation_id
        }
    else:
        raise HTTPException(status_code=400, detail=result.get("errorMessage", "Odeme baslatılamadi"))


@router.post("/api/payment/callback")
async def payment_callback(request: Request):
    form = await request.form()
    iyzico_token = form.get("token")

    if not iyzico_token:
        return RedirectResponse(url="/payment/fail", status_code=303)

    if iyzipay is None:
        logger.error("iyzipay module not available for callback")
        return RedirectResponse(url="/payment/fail", status_code=303)

    try:
        result_data = {'locale': 'tr', 'token': iyzico_token}
        checkout_form = iyzipay.CheckoutForm().retrieve(result_data, iyzico_options)
        result = json.loads(checkout_form.read().decode('utf-8'))
    except Exception as e:
        logger.error("iyzico callback error: %s", e)
        return RedirectResponse(url="/payment/fail", status_code=303)

    if result.get("status") == "success" and result.get("paymentStatus") == "SUCCESS":
        conversation_id = result.get("conversationId", "")
        try:
            payment_row = supabase.table("payments").select("*").eq("conversation_id", conversation_id).single().execute()
            if payment_row.data:
                user_id = payment_row.data["user_id"]
                plan = payment_row.data["plan"]
                if plan == "pro":
                    supabase.table("profiles").update({"plan": "pro", "free_credits": 9999}).eq("id", user_id).execute()
                else:
                    profile = get_user_profile(user_id)
                    new_credits = (profile.get("free_credits") or 0) + 1
                    supabase.table("profiles").update({"free_credits": new_credits}).eq("id", user_id).execute()
                supabase.table("payments").update({"status": "success"}).eq("conversation_id", conversation_id).execute()
        except Exception as e:
            logger.error("Payment callback error: %s", e)
        return RedirectResponse(url="/payment/success", status_code=303)
    else:
        return RedirectResponse(url="/payment/fail", status_code=303)


# ── ANALİZ ────────────────────────────────────────────────────────────────────

