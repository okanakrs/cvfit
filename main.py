import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, payment, analyze, download, legal

app = FastAPI(title="CVFit")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# ── Router'ları bağla ─────────────────────────────────────────────────────────
app.include_router(auth.router,     tags=["auth"])
app.include_router(payment.router,  tags=["payment"])
app.include_router(analyze.router,  tags=["analyze"])
app.include_router(download.router, tags=["download"])
app.include_router(legal.router,    tags=["legal"])

# ── Sayfa route'ları ──────────────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/payment/success", response_class=HTMLResponse)
async def payment_success(request: Request):
    return templates.TemplateResponse("payment_success.html", {"request": request})

@app.get("/payment/fail", response_class=HTMLResponse)
def payment_fail(request: Request):
    return templates.TemplateResponse("payment_fail.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
