from __future__ import annotations

import mimetypes
import shutil
import zipfile
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse

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


def _file_response(file_path: Path) -> FileResponse:
    media_type, _ = mimetypes.guess_type(file_path.name)
    return FileResponse(path=str(file_path), media_type=media_type or "application/octet-stream")


def _serve_by_keywords(keywords: dict[str, int], not_found_detail: str) -> FileResponse:
    legal_dir = _get_legal_dir()
    if legal_dir is None:
        raise HTTPException(status_code=404, detail="Legal documents folder not found.")

    files = _iter_legal_files(legal_dir)
    selected = _pick_best_file(files, keywords)
    if selected is None:
        raise HTTPException(status_code=404, detail=not_found_detail)

    return _file_response(selected)


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

    links = "".join(
        (
            f'<li><a href="/legal/{file_path.relative_to(legal_dir).as_posix()}">'
            f"{file_path.relative_to(legal_dir).as_posix()}</a></li>"
        )
        for file_path in files
    )

    html = f"""
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
    return HTMLResponse(html)


@router.get("/legal/{file_path:path}")
def legal_document(file_path: str) -> FileResponse:
    legal_dir = _get_legal_dir()
    if legal_dir is None:
        raise HTTPException(status_code=404, detail="Legal documents folder not found.")

    resolved = _safe_resolve_file(legal_dir, file_path)
    return _file_response(resolved)


@router.get("/privacy")
def privacy_policy() -> FileResponse:
    return _serve_by_keywords(PRIVACY_KEYWORDS, "No privacy policy document found.")


@router.get("/terms")
def terms_of_service() -> FileResponse:
    return _serve_by_keywords(TERMS_KEYWORDS, "No terms document found.")


@router.get("/kvkk")
def kvkk_notice() -> FileResponse:
    return _serve_by_keywords(KVKK_KEYWORDS, "No KVKK disclosure document found.")


@router.get("/cookies")
@router.get("/cookie-policy")
@router.get("/cerez-politikasi")
def cookie_policy() -> FileResponse:
    return _serve_by_keywords(COOKIE_KEYWORDS, "No cookie policy document found.")


@router.get("/distance-sales-agreement")
@router.get("/mesafeli-satis-sozlesmesi")
def distance_sales_agreement() -> FileResponse:
    return _serve_by_keywords(DISTANCE_SALES_KEYWORDS, "No distance sales agreement document found.")