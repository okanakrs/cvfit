from __future__ import annotations

import html
import mimetypes
import shutil
import zipfile
from pathlib import Path
from urllib.parse import quote
from xml.etree import ElementTree as ET

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse

router = APIRouter()

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# ── Shared HTML fragments for legal pages (matches site dark/light theme) ─────

_LEGAL_PAGE_STYLE = """
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --pri:#818CF8;--pri-d:#6366F1;--pri-dd:#4F46E5;--pri-l:rgba(99,102,241,.12);--pri-ll:rgba(99,102,241,.2);
    --bg:#0a0a0a;--surface:#141414;--surface2:#1a1a1a;--surface3:#222;
    --ink:#F1F5F9;--ink2:#CBD5E1;--ink3:#94A3B8;--ink4:#64748B;--ink5:#475569;
    --bd:rgba(255,255,255,.08);--bd2:rgba(255,255,255,.12);
    --grad:linear-gradient(135deg,#818CF8 0%,#A78BFA 50%,#C4B5FD 100%);
    --nav-bg:rgba(10,10,10,.8);--nav-bd:rgba(255,255,255,.06);
    --sh:0 1px 3px rgba(0,0,0,.3),0 1px 2px rgba(0,0,0,.2);
    --sh-lg:0 10px 15px -3px rgba(0,0,0,.4),0 4px 6px -2px rgba(0,0,0,.3);
    --r:12px;--r-lg:16px;
  }
  html[data-theme="light"]{
    --bg:#F5F4F0;--surface:#FFFFFF;--surface2:#EDECE6;--surface3:#E2E1DB;
    --ink:#1A1A2E;--ink2:#2D2D44;--ink3:#555570;--ink4:#8888A0;--ink5:#AAAABC;
    --bd:rgba(0,0,0,.08);--bd2:rgba(0,0,0,.12);
    --pri-l:rgba(99,102,241,.08);--pri-ll:rgba(99,102,241,.15);
    --sh:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
    --sh-lg:0 10px 15px -3px rgba(0,0,0,.08),0 4px 6px -2px rgba(0,0,0,.04);
    --nav-bg:rgba(245,244,240,.85);--nav-bd:rgba(0,0,0,.06);
  }
  html{scroll-behavior:smooth}
  body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}

  /* NAV */
  .legal-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;background:var(--nav-bg);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid var(--nav-bd);transition:background .3s,border-color .3s}
  .legal-nav .logo{font-size:22px;font-weight:800;color:var(--ink);text-decoration:none;display:flex;align-items:center;gap:10px}
  .legal-nav .logo img{height:32px;width:auto}
  .legal-nav .logo-wordmark-light{display:none}
  html[data-theme="light"] .legal-nav .logo-wordmark-dark{display:none}
  html[data-theme="light"] .legal-nav .logo-wordmark-light{display:block}
  .nav-r{display:flex;align-items:center;gap:8px}
  .nbtn{display:inline-flex;align-items:center;gap:6px;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'Inter',sans-serif;white-space:nowrap;text-decoration:none}
  .nbtn-ghost{background:transparent;border:1px solid var(--bd2);color:var(--ink4)}
  .nbtn-ghost:hover{background:var(--pri-l);color:var(--ink);border-color:var(--pri-ll)}
  .theme-toggle{width:38px;height:38px;border-radius:10px;border:1px solid var(--bd2);background:transparent;color:var(--ink3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;transition:all .2s;flex-shrink:0}
  .theme-toggle:hover{background:var(--pri-l);color:var(--pri);border-color:var(--pri-ll)}
  .theme-toggle .ico-sun,.theme-toggle .ico-moon{transition:opacity .2s,transform .3s}
  html[data-theme="light"] .theme-toggle .ico-moon{display:none}
  html:not([data-theme="light"]) .theme-toggle .ico-sun{display:none}

  /* CONTENT */
  .legal-wrap{max-width:860px;margin:0 auto;padding:88px 24px 60px}
  .legal-card{background:var(--surface);border:1px solid var(--bd);border-radius:var(--r-lg);padding:36px 32px;box-shadow:var(--sh-lg);transition:background .3s,border-color .3s}
  .legal-title{font-size:26px;font-weight:700;color:var(--ink);margin-bottom:6px;letter-spacing:-.5px}
  .legal-subtitle{font-size:14px;color:var(--ink4);margin-bottom:20px}
  .legal-actions{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px}
  .legal-btn{display:inline-flex;align-items:center;gap:6px;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;text-decoration:none;font-family:'Inter',sans-serif}
  .legal-btn-outline{background:var(--pri-l);color:var(--pri);border:1px solid var(--pri-ll)}
  .legal-btn-outline:hover{background:var(--pri-ll);border-color:var(--pri)}
  .legal-btn-ghost{background:transparent;color:var(--ink4);border:1px solid var(--bd2)}
  .legal-btn-ghost:hover{color:var(--ink);background:var(--pri-l);border-color:var(--pri-ll)}
  .doc-frame{width:100%;min-height:72vh;border:1px solid var(--bd);border-radius:var(--r);background:var(--surface2)}
  .doc-content{border:1px solid var(--bd);border-radius:var(--r);background:var(--surface2);padding:28px 24px;line-height:1.75;color:var(--ink2);font-size:14.5px;transition:background .3s,border-color .3s}
  .doc-content p{margin:0 0 14px}
  .legal-list{list-style:none;padding:0}
  .legal-list li{border-bottom:1px solid var(--bd);transition:border-color .3s}
  .legal-list li:last-child{border-bottom:none}
  .legal-list a{display:flex;align-items:center;gap:10px;padding:14px 8px;color:var(--ink2);text-decoration:none;font-size:14px;font-weight:500;transition:all .15s;border-radius:8px}
  .legal-list a:hover{color:var(--pri);background:var(--pri-l)}
  .legal-list a::before{content:'';display:block;width:8px;height:8px;border-radius:50%;background:var(--pri);flex-shrink:0;opacity:.5}

  /* FOOTER */
  .legal-footer{padding:32px 24px 24px;text-align:center;border-top:1px solid var(--bd);margin-top:40px;transition:border-color .3s}
  .legal-footer-inner{max-width:860px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px}
  .legal-footer-brand{display:flex;align-items:center;gap:8px;text-decoration:none}
  .legal-footer-brand img{height:22px}
  .legal-footer-brand .logo-wordmark-light{display:none}
  html[data-theme="light"] .legal-footer-brand .logo-wordmark-dark{display:none}
  html[data-theme="light"] .legal-footer-brand .logo-wordmark-light{display:block}
  .legal-footer-links{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
  .legal-footer-links a{font-size:12px;color:var(--ink4);text-decoration:none;font-weight:500;transition:color .15s}
  .legal-footer-links a:hover{color:var(--pri)}
  .legal-footer-copy{font-size:11px;color:var(--ink5)}

  @media(max-width:600px){
    .legal-nav{padding:0 16px}
    .legal-wrap{padding:80px 14px 40px}
    .legal-card{padding:24px 18px}
    .legal-title{font-size:22px}
  }
</style>
"""

_LEGAL_NAV = """
<nav class="legal-nav">
  <a class="logo" href="/" aria-label="CVFit Ana Sayfa">
    <img class="logo-wordmark logo-wordmark-dark" src="/medias/cvfit-logo-dark.svg" alt="CVFit">
    <img class="logo-wordmark logo-wordmark-light" src="/medias/cvfit-logo-light.svg" alt="CVFit">
  </a>
  <div class="nav-r">
    <button class="theme-toggle" onclick="toggleThemeMode()" title="Tema Degistir"><span class="ico-sun">☀️</span><span class="ico-moon">🌙</span></button>
    <a class="nbtn nbtn-ghost" href="/">Ana Sayfa</a>
  </div>
</nav>
"""

_LEGAL_FOOTER = """
<footer class="legal-footer">
  <div class="legal-footer-inner">
    <a class="legal-footer-brand" href="/" aria-label="CVFit">
      <img class="logo-wordmark logo-wordmark-dark" src="/medias/cvfit-logo-dark.svg" alt="CVFit">
      <img class="logo-wordmark logo-wordmark-light" src="/medias/cvfit-logo-light.svg" alt="CVFit">
    </a>
    <div class="legal-footer-links">
      <a href="/privacy">Gizlilik Politikasi</a>
      <a href="/terms">Kullanim Kosullari</a>
      <a href="/kvkk">KVKK Aydinlatma</a>
      <a href="/cerez-politikasi">Cerez Politikasi</a>
      <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satis Sozlesmesi</a>
    </div>
    <div class="legal-footer-copy">&copy; 2026 CVFit. Tum haklari saklidir.</div>
  </div>
</footer>
"""

_LEGAL_THEME_SCRIPT = """
<script>
  function getThemeMode(){return localStorage.getItem('cvfit_theme')||'dark'}
  function applyThemeMode(m){if(m==='light')document.documentElement.setAttribute('data-theme','light');else document.documentElement.removeAttribute('data-theme')}
  function toggleThemeMode(){var c=getThemeMode(),n=c==='dark'?'light':'dark';localStorage.setItem('cvfit_theme',n);applyThemeMode(n)}
  applyThemeMode(getThemeMode());
</script>
"""

# Supports different folder naming styles for legal docs.
LEGAL_DIR_CANDIDATES = [
    "privacy policy",
    "privacy_policy",
    "privacy-policy",
    "legal",
    "hukuki",
    "static/privacy policy",
    "static/privacy_policy",
    "static/privacy-policy",
    "static/legal",
]

ALLOWED_SUFFIXES = {
    ".html",
    ".htm",
    ".txt",
    ".md",
    ".pdf",
    ".doc",
    ".docx",
}

ARCHIVE_SUFFIXES = {".zip"}
LEGAL_FILE_SUFFIXES = ALLOWED_SUFFIXES | ARCHIVE_SUFFIXES

LEGAL_FOLDER_HINTS = (
    "privacy",
    "gizlilik",
    "policy",
    "legal",
    "hukuki",
    "kvkk",
)

PRIVACY_KEYWORDS = {
    "privacy": 8,
    "gizlilik": 8,
    "policy": 6,
    "politika": 6,
    "cookie": 2,
    "cerez": 2,
    "kvkk": 1,
    "aydinlatma": 1,
}

TERMS_KEYWORDS = {
    "terms": 8,
    "kullanim": 8,
    "kosul": 6,
    "sart": 6,
    "agreement": 4,
    "sozlesme": 4,
    "mesafeli": 1,
}

KVKK_KEYWORDS = {
    "kvkk": 10,
    "aydinlatma": 8,
}

COOKIE_KEYWORDS = {
    "cerez": 10,
    "cookie": 10,
    "policy": 2,
    "politika": 2,
}

DISTANCE_SALES_KEYWORDS = {
    "mesafeli": 10,
    "satis": 8,
    "sozlesme": 8,
    "agreement": 2,
}


def _normalize_name(value: str) -> str:
    return value.strip().lower().replace("_", " ").replace("-", " ")


def _resolve_case_insensitive_path(base: Path, relative_path: str) -> Path | None:
    current = base
    parts = [part for part in relative_path.replace("\\", "/").split("/") if part]

    for part in parts:
        direct = current / part
        if direct.exists() and direct.is_dir():
            current = direct
            continue

        normalized_part = _normalize_name(part)
        matches = [
            child
            for child in current.iterdir()
            if child.is_dir() and _normalize_name(child.name) == normalized_part
        ]
        if not matches:
            return None
        current = matches[0]

    return current if current.exists() and current.is_dir() else None


def _contains_legal_files(directory: Path) -> bool:
    for file_path in directory.rglob("*"):
        if file_path.is_file() and file_path.suffix.lower() in LEGAL_FILE_SUFFIXES:
            return True
    return False


def _looks_like_legal_dir(directory: Path) -> bool:
    normalized_name = _normalize_name(directory.name)
    if not any(hint in normalized_name for hint in LEGAL_FOLDER_HINTS):
        return False
    return _contains_legal_files(directory)


def _get_legal_dir() -> Path | None:
    for candidate in LEGAL_DIR_CANDIDATES:
        directory = _resolve_case_insensitive_path(PROJECT_ROOT, candidate)
        if directory is not None:
            return directory

    for directory in PROJECT_ROOT.iterdir():
        if directory.is_dir() and _looks_like_legal_dir(directory):
            return directory

    static_root = PROJECT_ROOT / "static"
    if static_root.exists() and static_root.is_dir():
        for directory in static_root.iterdir():
            if directory.is_dir() and _looks_like_legal_dir(directory):
                return directory

    return None


def _iter_legal_files(directory: Path) -> list[Path]:
    extracted_root = directory / "_extracted"
    files: list[Path] = []
    archives: list[Path] = []

    for file_path in directory.rglob("*"):
        if not file_path.is_file():
            continue
        if extracted_root in file_path.parents:
            continue

        suffix = file_path.suffix.lower()
        if suffix in ALLOWED_SUFFIXES:
            files.append(file_path)
        elif suffix in ARCHIVE_SUFFIXES:
            archives.append(file_path)

    for archive_path in archives:
        files.extend(_extract_zip_documents(directory, archive_path))

    return sorted(files)


def _score_file_name(file_path: Path, keywords: dict[str, int]) -> int:
    normalized_name = file_path.stem.lower().replace("_", " ").replace("-", " ")
    return sum(weight for keyword, weight in keywords.items() if keyword in normalized_name)


def _extract_zip_documents(legal_dir: Path, archive_path: Path) -> list[Path]:
    extract_root = legal_dir / "_extracted" / archive_path.stem
    extract_root_resolved = extract_root.resolve()
    source_mtime = str(int(archive_path.stat().st_mtime))
    marker_file = extract_root / ".source_mtime"

    is_fresh = extract_root.exists() and marker_file.exists() and marker_file.read_text(encoding="utf-8") == source_mtime
    if not is_fresh and extract_root.exists():
        shutil.rmtree(extract_root)

    if not is_fresh:
        extract_root.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(archive_path, "r") as archive:
            for member in archive.infolist():
                if member.is_dir():
                    continue

                member_path = Path(member.filename)
                if member_path.is_absolute() or ".." in member_path.parts:
                    continue
                if member_path.suffix.lower() not in ALLOWED_SUFFIXES:
                    continue

                destination = (extract_root / member_path).resolve()
                if extract_root_resolved != destination and extract_root_resolved not in destination.parents:
                    continue

                destination.parent.mkdir(parents=True, exist_ok=True)
                with archive.open(member, "r") as source, destination.open("wb") as target:
                    shutil.copyfileobj(source, target)

        marker_file.write_text(source_mtime, encoding="utf-8")

    return [
        file_path
        for file_path in extract_root.rglob("*")
        if file_path.is_file() and file_path.suffix.lower() in ALLOWED_SUFFIXES
    ]


def _pick_best_file(files: list[Path], keywords: dict[str, int]) -> Path | None:
    best_file: Path | None = None
    best_score = -1

    for file_path in files:
        score = _score_file_name(file_path, keywords)
        if score > best_score:
            best_score = score
            best_file = file_path

    if best_score <= 0:
        return None
    return best_file


def _safe_resolve_file(directory: Path, requested_path: str) -> Path:
    root = directory.resolve()
    resolved = (directory / requested_path).resolve()

    if root != resolved and root not in resolved.parents:
        raise HTTPException(status_code=400, detail="Invalid legal document path.")
    if not resolved.exists() or not resolved.is_file():
        raise HTTPException(status_code=404, detail="Legal document not found.")
    if resolved.suffix.lower() not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=415, detail="Unsupported legal file type.")

    return resolved


def _file_response(file_path: Path, *, as_attachment: bool = False) -> FileResponse:
    media_type, _ = mimetypes.guess_type(file_path.name)
    disposition = "attachment" if as_attachment else "inline"
    return FileResponse(
        path=str(file_path),
        media_type=media_type or "application/octet-stream",
        filename=file_path.name,
        content_disposition_type=disposition,
    )


def _encode_path(relative_path: str) -> str:
    return "/".join(quote(part) for part in relative_path.split("/"))


def _raw_legal_url(relative_path: str, *, download: bool = False) -> str:
    base = f"/legal/raw/{_encode_path(relative_path)}"
    if download:
        return f"{base}?download=1"
    return base


def _text_to_html_paragraphs(text: str) -> str:
    normalized = text.replace("\r\n", "\n").strip()
    if not normalized:
        return "<p>Icerik bulunamadi.</p>"

    blocks = [block.strip() for block in normalized.split("\n\n") if block.strip()]
    if not blocks:
        return "<p>Icerik bulunamadi.</p>"

    return "".join(f"<p>{html.escape(block).replace(chr(10), '<br/>')}</p>" for block in blocks)


def _extract_docx_text(file_path: Path) -> str:
    try:
        with zipfile.ZipFile(file_path, "r") as archive:
            xml_bytes = archive.read("word/document.xml")
    except Exception:
        return ""

    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return ""

    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs: list[str] = []
    for paragraph in root.findall(".//w:p", ns):
        parts = [node.text for node in paragraph.findall(".//w:t", ns) if node.text]
        line = "".join(parts).strip()
        if line:
            paragraphs.append(line)

    return "\n\n".join(paragraphs)


def _render_legal_preview(file_path: Path, legal_dir: Path) -> HTMLResponse:
    relative_path = file_path.relative_to(legal_dir).as_posix()
    raw_url = _raw_legal_url(relative_path)
    download_url = _raw_legal_url(relative_path, download=True)
    suffix = file_path.suffix.lower()

    content_html: str
    if suffix in {".pdf", ".html", ".htm"}:
        content_html = f'<iframe class="doc-frame" src="{raw_url}" title="Yasal Dokuman"></iframe>'
    elif suffix in {".txt", ".md"}:
        text = file_path.read_text(encoding="utf-8", errors="ignore")
        content_html = f'<div class="doc-content">{_text_to_html_paragraphs(text)}</div>'
    elif suffix == ".docx":
        text = _extract_docx_text(file_path)
        content_html = f'<div class="doc-content">{_text_to_html_paragraphs(text)}</div>'
    elif suffix == ".doc":
        content_html = (
            "<div class=\"doc-content\"><p>Bu DOC dosyasi tarayicida onizlenemiyor. "
            "Asagidaki baglanti ile indirebilirsiniz.</p></div>"
        )
    else:
        content_html = "<div class=\"doc-content\"><p>Bu dosya tipi desteklenmiyor.</p></div>"

    html_doc = f"""
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CVFit | {html.escape(file_path.stem)}</title>
  <link rel="icon" type="image/x-icon" href="/medias/favicon.ico">
  <link rel="icon" type="image/png" sizes="192x192" href="/medias/cvfit-icon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/medias/cvfit-apple-touch-icon.png">
  <meta name="theme-color" content="#3730a3">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  {_LEGAL_PAGE_STYLE}
</head>
<body>
  {_LEGAL_NAV}
  <main class="legal-wrap">
    <div class="legal-card">
      <h1 class="legal-title">{html.escape(file_path.stem.replace('_', ' '))}</h1>

      <div class="legal-actions">
        <a class="legal-btn legal-btn-outline" href="{download_url}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Indir
        </a>
        <a class="legal-btn legal-btn-ghost" href="{raw_url}" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Yeni sekmede ac
        </a>
      </div>

      {content_html}
    </div>
  </main>
  {_LEGAL_FOOTER}
  {_LEGAL_THEME_SCRIPT}
</body>
</html>
"""
    return HTMLResponse(html_doc)


def _select_by_keywords(keywords: dict[str, int], not_found_detail: str) -> tuple[Path, Path]:
    legal_dir = _get_legal_dir()
    if legal_dir is None:
        raise HTTPException(status_code=404, detail="Legal documents folder not found.")

    files = _iter_legal_files(legal_dir)
    selected = _pick_best_file(files, keywords)
    if selected is None:
        raise HTTPException(status_code=404, detail=not_found_detail)

    return legal_dir, selected


def _redirect_by_keywords(keywords: dict[str, int], not_found_detail: str) -> RedirectResponse:
    legal_dir, selected = _select_by_keywords(keywords, not_found_detail)
    relative_path = selected.relative_to(legal_dir).as_posix()
    return RedirectResponse(url=f"/legal/{_encode_path(relative_path)}", status_code=307)


@router.get("/legal", response_class=HTMLResponse)
def legal_documents_index() -> HTMLResponse:
    legal_dir = _get_legal_dir()
    if legal_dir is None:
        return HTMLResponse(
            "<h1>Legal documents folder not found.</h1><p>Create one of: "
            + ", ".join(LEGAL_DIR_CANDIDATES)
            + "</p>",
            status_code=404,
        )

    files = _iter_legal_files(legal_dir)
    if not files:
        return HTMLResponse("<h1>No legal documents found in folder.</h1>", status_code=404)

    links_parts: list[str] = []
    for file_path in files:
        relative = file_path.relative_to(legal_dir).as_posix()
        href = f"/legal/{_encode_path(relative)}"
        links_parts.append(f'<li><a href="{href}">{html.escape(relative)}</a></li>')

    links = "".join(links_parts)

    page_html = f"""
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CVFit | Yasal Dokumanlar</title>
  <link rel="icon" type="image/x-icon" href="/medias/favicon.ico">
  <link rel="icon" type="image/png" sizes="192x192" href="/medias/cvfit-icon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/medias/cvfit-apple-touch-icon.png">
  <meta name="theme-color" content="#3730a3">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  {_LEGAL_PAGE_STYLE}
</head>
<body>
  {_LEGAL_NAV}
  <main class="legal-wrap">
    <div class="legal-card">
      <h1 class="legal-title">Yasal Dokumanlar</h1>
      <p class="legal-subtitle">Asagidaki belgeleri goruntuleyebilirsiniz:</p>
      <ul class="legal-list">{links}</ul>
    </div>
  </main>
  {_LEGAL_FOOTER}
  {_LEGAL_THEME_SCRIPT}
</body>
</html>
"""
    return HTMLResponse(page_html)


@router.get("/legal/raw/{file_path:path}")
def legal_document_raw(file_path: str, download: bool = Query(False)) -> FileResponse:
    legal_dir = _get_legal_dir()
    if legal_dir is None:
        raise HTTPException(status_code=404, detail="Legal documents folder not found.")

    resolved = _safe_resolve_file(legal_dir, file_path)
    return _file_response(resolved, as_attachment=download)


@router.get("/legal/{file_path:path}")
def legal_document(file_path: str) -> HTMLResponse:
    legal_dir = _get_legal_dir()
    if legal_dir is None:
        raise HTTPException(status_code=404, detail="Legal documents folder not found.")

    resolved = _safe_resolve_file(legal_dir, file_path)
    return _render_legal_preview(resolved, legal_dir)


@router.get("/privacy")
def privacy_policy() -> RedirectResponse:
    return _redirect_by_keywords(PRIVACY_KEYWORDS, "No privacy policy document found.")


@router.get("/terms")
def terms_of_service() -> RedirectResponse:
    return _redirect_by_keywords(TERMS_KEYWORDS, "No terms document found.")


@router.get("/kvkk")
def kvkk_notice() -> RedirectResponse:
    return _redirect_by_keywords(KVKK_KEYWORDS, "No KVKK disclosure document found.")


@router.get("/cookies")
@router.get("/cookie-policy")
@router.get("/cerez-politikasi")
def cookie_policy() -> RedirectResponse:
    return _redirect_by_keywords(COOKIE_KEYWORDS, "No cookie policy document found.")


@router.get("/distance-sales-agreement")
@router.get("/mesafeli-satis-sozlesmesi")
def distance_sales_agreement() -> RedirectResponse:
    return _redirect_by_keywords(DISTANCE_SALES_KEYWORDS, "No distance sales agreement document found.")