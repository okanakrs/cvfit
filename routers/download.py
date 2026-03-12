from fastapi import APIRouter, Form, HTTPException, BackgroundTasks
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
    base = os.path.join(os.path.dirname(__file__), "..", "static")
    try:
        pdfmetrics.registerFont(TTFont("DJ",   os.path.join(base, "DejaVuSans.ttf")))
        pdfmetrics.registerFont(TTFont("DJ-B", os.path.join(base, "DejaVuSans-Bold.ttf")))
        _fonts_registered = True
    except Exception:
        pass

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
async def download_pdf(background_tasks: BackgroundTasks, cv_text: str = Form(...), theme: str = Form("classic_mavi")):
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
async def download_docx(background_tasks: BackgroundTasks, cv_text: str = Form(...), theme: str = Form("classic_mavi")):
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