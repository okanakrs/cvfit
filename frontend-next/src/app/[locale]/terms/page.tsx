export default function TermsPage() {
  const content = `Kullanım Koşulları

www.cvfit.com.tr

Platform Kullanımına İlişkin Genel Şartlar ve Koşullar

Son Güncelleme: 12 Mart 2026

Okan Akarsu — Konuralp, Düzce

okanakarsu1074@gmail.com

1. Genel Hükümler

Bu Kullanım Koşulları, www.cvfit.com.tr adresinde hizmet veren CVFit platformunun ("Platform") kullanımına ilişkin şartları düzenler. Platform, Okan Akarsu ("İşletmeci") tarafından işletilmektedir.

Platformu kullanarak bu koşulları kabul etmiş sayılırsınız. Kabul etmemeniz halinde Platformu kullanmamanız gerekmektedir.

2. Hizmet Tanımı

CVFit, yapay zeka teknolojileri kullanarak CV/özgeçmiş analizi ve optimizasyonu hizmeti sunan bir SaaS (Hizmet Olarak Yazılım) platformudur. Sunulan hizmetler şunlardır:

CV yükleme ve yapay zeka destekli analiz

CV içerik ve format optimizasyon önerileri

Sektörel uyumluluk değerlendirmesi

Abonelik kapsamında sunulan ek özellikler

3. Üyelik ve Hesap

3.1. Hesap Oluşturma

Platformu kullanmak için geçerli bir e-posta adresi ile kayıt olmanız gerekmektedir. Kayıt sırasında verdiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz.

3.2. Hesap Güvenliği

Hesap bilgilerinizin ve şifrenizin gizliliğinden siz sorumlusunuz. Hesabınız üzerinden gerçekleştirilen tüm işlemlerden siz sorumlu tutulursunuz. Yetkisiz kullanım tespit etmeniz halinde derhal bizimle iletişime geçmelisiniz.

3.3. Hesap Askıya Alma ve Fesih

İşletmeci, bu Kullanım Koşullarını ihlal eden hesapları önceden bildirimde bulunmaksızın askıya alma veya feshetme hakkını saklı tutar.

4. Abonelik ve Ödeme

4.1. Ücretlendirme

Platform, abonelik modeli ile çalışmaktadır. Güncel abonelik planları ve ücretleri Platform üzerinde yayımlanır. İşletmeci, fiyatlandırmada değişiklik yapma hakkını saklı tutar.

4.2. Ödeme

Ödemeler, Paddle ödeme altyapısı aracılığıyla kredi kartı ile gerçekleştirilir. Ödeme işlemleri Paddle'ın kendi hizmet şartlarına tabidir.

4.3. İptal ve İade

Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal halinde mevcut abonelik döneminizin sonuna kadar hizmetten faydalanmaya devam edebilirsiniz. İade politikası, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili mevzuat hükümleri çerçevesinde uygulanır.

5. Fikri Mülkiyet Hakları

Platform üzerindeki tüm içerik, tasarım, yazılım, logo ve görseller İşletmeci'ye aittir ve fikri mülkiyet hakları ile korunmaktadır. Kullanıcılar tarafından yüklenen CV'lerin fikri mülkiyeti ilgili kullanıcıya aittir.

Kullanıcılar, yükledikleri CV'lerin yapay zeka ile analiz edilmesi ve işlenmesi için İşletmeci'ye sınırlı lisans vermektedir. Bu lisans yalnızca hizmet sunumu amacıyla kullanılır.

6. Kullanıcı Yükümlülükleri

Kullanıcılar aşağıdaki kurallara uymayı kabul eder:

Platformu yalnızca yasal amaçlarla kullanmak

Başkalarına ait kişisel verileri izinsiz yüklememek

Platformun güvenliğini tehlikeye atacak girişimlerde bulunmamak

Otomatik veri toplama araçları (bot, scraper vb.) kullanmamak

Platform üzerinden zararlı yazılım dağıtmamak

7. Sorumluluk Sınırlaması

Platform, yapay zeka destekli öneriler sunmakta olup bu öneriler tavsiye niteliğindedir. İşletmeci, CV analiz sonuçlarının kesinliğini veya iş başvurularında başarı garantisi vermez.

Platformun kesintisiz ve hatasız çalışacağı garanti edilmez. Teknik arızalar, bakım çalışmaları veya mücbir sebeplerden kaynaklanan erişim kesintilerinden İşletmeci sorumlu tutulamaz.

8. Uygulanacak Hukuk ve Uyuşmazlık Çözümü

Bu Kullanım Koşulları Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda Düzce Mahkemeleri ve İcra Daireleri yetkilidir.

9. Değişiklikler

İşletmeci, bu Kullanım Koşulları'nı önceden bildirimde bulunarak güncelleme hakkını saklı tutar. Güncellemeler Platform üzerinde yayımlandığı tarihte yürürlüğe girer.

10. İletişim

Sorularınız için: okanakarsu1074@gmail.com`

  const paragraphs = content.split("\n\n")

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Kullanim Kosullari</h1>
        <p className="text-sm text-muted-foreground mb-8">Son guncelleme: 12.03.2026</p>

        <section className="space-y-4 text-sm md:text-base leading-7 text-muted-foreground whitespace-pre-line">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </section>
      </div>
    </main>
  )
}
