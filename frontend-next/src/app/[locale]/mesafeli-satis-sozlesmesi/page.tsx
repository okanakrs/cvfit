export default function DistanceSalesAgreementPage() {
  const content = `Mesafeli Satış Sözleşmesi

www.cvfit.com.tr

6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği Kapsamında

Son Güncelleme: 12 Mart 2026

Okan Akarsu — Konuralp, Düzce

okanakarsu1074@gmail.com

1. Taraflar

1.1. Satıcı

Ad/Unvan: Okan Akarsu

Adres: Konuralp, Düzce

E-posta: okanakarsu1074@gmail.com

1.2. Alıcı

Platform üzerinden abonelik satın alan kullanıcı (üyelik sırasında beyan edilen bilgiler geçerlidir).

2. Sözleşme Konusu

İşbu sözleşme, Alıcı'nın Platform üzerinden satın aldığı abonelik hizmetine ilişkin tarafların hak ve yükümlülüklerini 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri çerçevesinde düzenler.

3. Hizmet Bilgileri

CVFit platformu aşağıdaki dijital hizmetleri abonelik modeli ile sunmaktadır:

Yapay zeka destekli CV analizi ve değerlendirmesi

CV içerik ve format optimizasyon önerileri

Sektörel uyumluluk analizi

Abonelik planına göre belirlenen ek özellikler

Hizmetin kapsamı, seçilen abonelik planına göre farklılık gösterebilir. Güncel plan detayları Platform üzerinde yayımlanmaktadır.

4. Hizmet Bedeli ve Ödeme

Abonelik ücretleri Platform üzerinde güncel olarak yayımlanır. Ödemeler, Paddle ödeme altyapısı üzerinden kredi kartı ile gerçekleştirilir.

Abonelik otomatik olarak yenilenir. Yenileme öncesinde kullanıcıya bildirim gönderilir. Kullanıcı, yenileme tarihinden önce aboneliğini iptal edebilir.

5. Cayma Hakkı

6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, dijital içerik ve hizmetlerin ifasına başlanması halinde cayma hakkı kullanılamaz.

Alıcı, abonelik satın alırken dijital hizmetin ifasına derhal başlanacağını ve bu durumda cayma hakkını kaybedeceğini kabul ve beyan eder.

Ancak hizmetin hiç kullanılmadığı hallerde, satın alma tarihinden itibaren 14 (on dört) gün içinde cayma hakkı kullanılabilir. Cayma hakkını kullanmak için:

okanakarsu1074@gmail.com adresine yazılı başvuru yapılması gerekmektedir

Cayma bildiriminin açık ve net bir şekilde ifade edilmesi yeterlidir

İade, ödemenin yapıldığı yöntemle 14 gün içinde gerçekleştirilir

6. Hizmetin İfası

Abonelik ödemesinin onaylanmasının ardından hizmet derhal kullanıma sunulur. Dijital hizmetin niteliği gereği teslimat süresi bulunmamaktadır.

7. Genel Hükümler

Alıcı, satın alma işlemini tamamlamadan önce bu sözleşmenin tüm koşullarını okuduğunu, anladığını ve kabul ettiğini beyan eder.

İşbu sözleşmede yer almayan hususlarda 6502 sayılı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği ve ilgili mevzuat hükümleri uygulanır.

8. Uyuşmazlık Çözümü

İşbu sözleşmeden doğan uyuşmazlıklarda Tüketici Hakem Heyetleri (yasal sınırlar dahilinde) ve Düzce Tüketici Mahkemeleri yetkilidir.

Tüketici, şikayetlerini Ticaret Bakanlığı Tüketici Şikayet Platformu (sikayetvar.com veya tuketici.ticaret.gov.tr) üzerinden de iletebilir.

9. Yürürlük

İşbu sözleşme, Alıcı tarafından elektronik ortamda onaylandığı tarihte yürürlüğe girer.`

  const paragraphs = content.split("\n\n")

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mesafeli Satis Sozlesmesi</h1>
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
