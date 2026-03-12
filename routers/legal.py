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
<html lang=\"tr\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>CVFit | {html.escape(file_path.stem)}</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }}
    .wrap {{ max-width: 1000px; margin: 28px auto; padding: 0 20px; }}
    .card {{ background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; }}
    h1 {{ margin: 0 0 8px; font-size: 24px; }}
    .meta {{ margin: 0 0 16px; color: #64748b; font-size: 13px; }}
    .actions {{ display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }}
    .btn {{ text-decoration: none; color: #1d4ed8; font-weight: 600; font-size: 14px; }}
    .btn:hover {{ text-decoration: underline; }}
    .doc-frame {{ width: 100%; min-height: 72vh; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; }}
    .doc-content {{ border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; padding: 20px; line-height: 1.65; }}
    .doc-content p {{ margin: 0 0 12px; }}
    .nav {{ margin-top: 16px; display: flex; gap: 14px; flex-wrap: wrap; }}
  </style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"card\">
      <h1>{html.escape(file_path.stem)}</h1>
      <p class=\"meta\">Dosya: {html.escape(relative_path)}</p>

      <div class=\"actions\">
        <a class=\"btn\" href=\"{raw_url}\" target=\"_blank\" rel=\"noopener\">Yeni sekmede ac</a>
        <a class=\"btn\" href=\"{download_url}\">Indir</a>
      </div>

      {content_html}

      <div class=\"nav\">
        <a class=\"btn\" href=\"/legal\">Tum yasal dokumanlar</a>
        <a class=\"btn\" href=\"/\">Ana sayfa</a>
      </div>
    </div>
  </div>
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
<html lang=\"tr\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>CVFit | Yasal Dokumanlar</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }}
    h1 {{ margin-bottom: 8px; }}
    ul {{ padding-left: 18px; }}
    a {{ color: #4F46E5; text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
  </style>
</head>
<body>
  <h1>Yasal Dokumanlar</h1>
  <p>Asagidaki belgeleri goruntuleyebilirsiniz:</p>
  <ul>{links}</ul>
  <p><a href=\"/\">Ana sayfaya don</a></p>
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