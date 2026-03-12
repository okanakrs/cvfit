# CVFit — AI ile CV Optimizasyonu & ATS Analizi

CV'nizi yapay zeka ile iş ilanına göre optimize eden web uygulaması. ATS uyumlu özgeçmiş analizi, anahtar kelime eşleştirme ve profesyonel CV oluşturma.

🌐 **Canlı:** [cvfit.com.tr](https://www.cvfit.com.tr)

---

## Özellikler

- **PDF CV Yükleme** — Mevcut CV'nizi PDF olarak yükleyin
- **Sıfırdan CV Oluşturma** — Adım adım form ile yeni CV oluşturun
- **AI Anahtar Kelime Eşleştirme** — İş ilanındaki kritik kelimeleri tespit eder, CV'nize ekler
- **ATS Eşleşme Skoru** — Önceki ve sonraki eşleşme yüzdesini gösterir
- **Beceri Haritası** — Eşleşen, eksik ve bonus beceriler
- **Bölüm Skorları** — Beceriler, deneyim, eğitim ve özet için ayrı skorlar
- **25+ CV Teması** — PDF ve DOCX formatında profesyonel temalar
- **PDF & DOCX İndirme** — Optimize edilmiş CV'yi anında indirin
- **Karanlık/Aydınlık Tema** — Tam tema desteği
- **Google ile Giriş** — OAuth 2.0 kimlik doğrulama

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Backend | FastAPI, Uvicorn |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Auth | Supabase (Google OAuth 2.0) |
| Ödeme | iyzipay |
| PDF Okuma | PyMuPDF |
| PDF Oluşturma | ReportLab |
| DOCX Oluşturma | Node.js + docx |
| Frontend | Vanilla HTML/CSS/JS, Jinja2 Templates |
| Veritabanı | Supabase (PostgreSQL) |
| Deploy | Heroku |

## Proje Yapısı

```
main.py                  # FastAPI uygulama giriş noktası
Procfile                 # Heroku deploy yapılandırması
requirements.txt         # Python bağımlılıkları
routers/
  auth.py                # Google OAuth giriş/çıkış
  analyze.py             # CV analizi (Claude AI)
  download.py            # PDF & DOCX indirme
  payment.py             # iyzipay ödeme entegrasyonu
  legal.py               # Yasal sayfalar (KVKK, gizlilik, vb.)
services/
  pdf_themes/            # 5 PDF tema şablonu (ReportLab)
  docx_themes/           # DOCX tema yapılandırması
templates/
  index.html             # Ana sayfa (SPA)
  callback.html          # OAuth callback
  payment_success.html   # Ödeme başarılı
  payment_fail.html      # Ödeme başarısız
static/
  robots.txt             # Arama motoru yönergeleri
  sitemap.xml            # Site haritası
```

## Kurulum

### Gereksinimler

- Python 3.10+
- Node.js (DOCX oluşturma için)

### Ortam Değişkenleri

`.env` dosyası oluşturun:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key
ALLOWED_ORIGINS=https://cvfit.com.tr,https://www.cvfit.com.tr
```

### Çalıştırma

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Uygulama `http://localhost:8000` adresinde çalışır.

## API Endpoints

| Yöntem | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/` | Ana sayfa |
| GET | `/auth/google` | Google ile giriş |
| GET | `/auth/callback` | OAuth callback |
| POST | `/auth/verify` | Token doğrulama |
| POST | `/auth/logout` | Çıkış |
| POST | `/analyze` | CV analizi |
| GET | `/api/history` | Analiz geçmişi |
| POST | `/download-pdf` | PDF indirme |
| POST | `/download-docx` | DOCX indirme |
| GET | `/privacy` | Gizlilik Politikası |
| GET | `/terms` | Kullanım Koşulları |
| GET | `/kvkk` | KVKK Aydınlatma Metni |

## Lisans

Bu proje özel lisanslıdır. Tüm hakları saklıdır.
