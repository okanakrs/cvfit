from fastapi import APIRouter, Form, HTTPException, BackgroundTasks, Request, Header
from typing import Optional
from fastapi.responses import FileResponse
import os, json, tempfile, subprocess, shutil, platform, logging

logger = logging.getLogger(__name__)
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as rl_canvas

from services.pdf_themes import tema1_classic, tema2_modern, tema3_mint, tema4_dark, tema5_bold

router = APIRouter()

# tema_adi -> (modul, renk)
# ornek: "classic_mavi" -> (tema1_classic, "mavi")
TEMA_MODUL = {
    "classic": tema1_classic,
    "modern":  tema2_modern,
    "minimal": tema3_mint,
    "coffee":  tema4_dark,
    "bold":    tema5_bold,
}
RENKLER = ["mavi", "gri", "teal", "bordo", "yesil"]

_fonts_registered = False

def register_fonts():
    global _fonts_registered
    if _fonts_registered: return
    
    # Önce proje kökünden dene
    base_options = [
        os.path.join(os.path.dirname(__file__), "..", "static"),
        os.path.join(os.path.dirname(__file__), "static"),
        "/app/static",
    ]
    
    for base in base_options:
        regular = os.path.join(base, "DejaVuSans.ttf")
        bold    = os.path.join(base, "DejaVuSans-Bold.ttf")
        if os.path.exists(regular) and os.path.exists(bold):
            pdfmetrics.registerFont(TTFont("DJ",   regular))
            pdfmetrics.registerFont(TTFont("DJ-B", bold))
            _fonts_registered = True
            logger.info("Fonts registered from: %s", base)
            return
    
    logger.error("DejaVu fonts NOT FOUND! PDF text will not be selectable.")

def parse_theme_renk(theme: str):
    """
    "classic_mavi" -> ("classic", "mavi")
    "classic"      -> ("classic", "mavi")
    """
    parts = theme.split("_", 1)
    tema_adi = parts[0] if parts[0] in TEMA_MODUL else "classic"
    renk = parts[1] if len(parts) > 1 and parts[1] in RENKLER else "mavi"
    return tema_adi, renk

def _cleanup_file(path: str):
    try:
        os.unlink(path)
    except OSError:
        pass


@router.post("/download-pdf")
async def download_pdf(background_tasks: BackgroundTasks, request: Request, cv_text: str = Form(...), theme: str = Form("classic_mavi"), authorization: Optional[str] = Header(None)):
    from routers.auth import get_user_from_token, get_user_profile
    token = (authorization or "").replace("Bearer ", "").strip()
    user = get_user_from_token(token) if token else None
    if not user:
        raise HTTPException(status_code=401, detail="İndirmek için giriş yapmanız gerekiyor")
    profile = get_user_profile(user.id)
    plan = profile.get("plan", "free") if profile else "free"
    if plan != "pro":
        from supabase import create_client
        import os
        sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY"))
        paid = sb.table("cv_downloads").select("id").eq("user_id", user.id).limit(1).execute()
        if not paid.data:
            raise HTTPException(status_code=402, detail="İndirmek için ödeme yapmanız gerekiyor")
    try:
        cv = json.loads(cv_text)
    except Exception:
        cv = {"name": "CV", "summary": cv_text}

    register_fonts()
    tema_adi, renk = parse_theme_renk(theme)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp.close()

    page_w, page_h = A4
    c = rl_canvas.Canvas(tmp.name, pagesize=A4)
    tema_modul = TEMA_MODUL[tema_adi]
    tema_modul.render(c, cv, page_w, page_h, renk)
    c.save()

    background_tasks.add_task(_cleanup_file, tmp.name)
    return FileResponse(tmp.name, media_type="application/pdf", filename="uyarlanmis_cv.pdf")


DOCX_THEMES_JSON = os.path.join(os.path.dirname(__file__), "..", "services", "docx_themes", "themes.json")

@router.post("/download-docx")
async def download_docx(background_tasks: BackgroundTasks, request: Request, cv_text: str = Form(...), theme: str = Form("classic_mavi"), authorization: Optional[str] = Header(None)):
    from routers.auth import get_user_from_token, get_user_profile
    token = (authorization or "").replace("Bearer ", "").strip()
    user = get_user_from_token(token) if token else None
    if not user:
        raise HTTPException(status_code=401, detail="İndirmek için giriş yapmanız gerekiyor")
    profile = get_user_profile(user.id)
    plan = profile.get("plan", "free") if profile else "free"
    if plan != "pro":
        from supabase import create_client
        import os
        sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY"))
        paid = sb.table("cv_downloads").select("id").eq("user_id", user.id).limit(1).execute()
        if not paid.data:
            raise HTTPException(status_code=402, detail="İndirmek için ödeme yapmanız gerekiyor")
    try:
        cv = json.loads(cv_text)
    except Exception:
        cv = {"name": "CV", "summary": cv_text}

    tema_adi, renk = parse_theme_renk(theme)
    cv_json = json.dumps(cv, ensure_ascii=False)

    # Renk hex degerlerini DOCX'e aktar
    PALETTES = {
        "mavi":  {"p":"1A5276","s":"2E86C1","sb":"154360","lt":"AED6F1"},
        "gri":   {"p":"212121","s":"555555","sb":"111111","lt":"CCCCCC"},
        "teal":  {"p":"00695C","s":"00897B","sb":"004D40","lt":"80CBC4"},
        "bordo": {"p":"7B1A1A","s":"C0392B","sb":"5B0E0E","lt":"F1948A"},
        "yesil": {"p":"1E6B3C","s":"27AE60","sb":"145A32","lt":"A9DFBF"},
    }
    pal = PALETTES.get(renk, PALETTES["mavi"])

    # Node PATH
    try:
        npm_root = subprocess.run(
            ["npm","root","-g"], capture_output=True, text=True, timeout=10,
            shell=(platform.system()=="Windows")
        ).stdout.strip()
    except Exception:
        npm_root = ""
    if not npm_root:
        npm_root = (
            os.path.join(os.environ.get("APPDATA",""), "npm","node_modules")
            if platform.system()=="Windows"
            else os.path.expanduser("~/.npm-global/lib/node_modules")
        )
    sep = ";" if platform.system()=="Windows" else ":"
    env = os.environ.copy()
    env["NODE_PATH"] = npm_root + sep + env.get("NODE_PATH","")

    with open(DOCX_THEMES_JSON, encoding="utf-8") as f:
        themes = json.load(f)
    
    # tema_adi -> tema1/tema2/tema3/tema4/tema5
    tema_key_map = {"classic":"tema1","modern":"tema2","minimal":"tema3","coffee":"tema4","bold":"tema5"}
    tema_key = tema_key_map.get(tema_adi, "tema1")
    theme_js = themes.get(tema_key, themes["tema1"])

    tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    tmp_out.close()
    out_path = tmp_out.name

    # Safely embed CV data as JSON string to prevent code injection
    cv_json_safe = json.dumps(cv_json)
    js = f"""
const {{
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell,
  BorderStyle, WidthType, ShadingType, VerticalAlign, AlignmentType
}} = require('docx');
const fs = require('fs');
const cv  = JSON.parse({cv_json_safe});
const OUT = {json.dumps(out_path)};
const PAL = {json.dumps(pal)};

{theme_js}

Packer.toBuffer(doc)
  .then(buf => {{ fs.writeFileSync(OUT, buf); process.exit(0); }})
  .catch(e  => {{ console.error(e.message); process.exit(1); }});
"""

    tmp_js = tempfile.NamedTemporaryFile(delete=False, suffix=".js", mode="w", encoding="utf-8")
    tmp_js.write(js)
    tmp_js.close()

    try:
        result = subprocess.run(
            [shutil.which("node") or "node", tmp_js.name],
            capture_output=True, text=True, timeout=30, env=env
        )
        if result.returncode != 0:
            raise Exception("Node: " + result.stderr[:400])
    except Exception as e:
        os.unlink(tmp_js.name)
        logger.error("DOCX generation error: %s", e)
        raise HTTPException(status_code=500, detail="DOCX olusturulamadi")

    os.unlink(tmp_js.name)
    background_tasks.add_task(_cleanup_file, out_path)
    return FileResponse(
        out_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="uyarlanmis_cv.docx"
    )