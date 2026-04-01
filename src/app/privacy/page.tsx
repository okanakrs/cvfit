export default function PrivacyPage() {
  const content = `Gizlilik Politikası

www.cvfit.com.tr

Kişisel Verilerin Korunması ve İşlenmesine İlişkin Bilgilendirme

Son Güncelleme: 12 Mart 2026

Okan Akarsu — Konuralp, Düzce

okanakarsu1074@gmail.com

1. Giriş

Bu Gizlilik Politikası, www.cvfit.com.tr adresinde hizmet veren CVFit platformunun ("Platform") kullanıcılarına ait kişisel verilerin nasıl toplandığını, işlendiğini, saklandığını ve korunduğunu açıklamaktadır. Platform, Okan Akarsu tarafından işletilmektedir.

Platformumuzu kullanarak bu Gizlilik Politikası'nda belirtilen koşulları kabul etmiş sayılırsınız.

2. Veri Sorumlusu

Veri Sorumlusu: Okan Akarsu

Adres: Konuralp, Düzce

E-posta: okanakarsu1074@gmail.com

3. Toplanan Kişisel Veriler

Platformumuz aşağıdaki kişisel verileri toplamaktadır:

3.1. Kimlik ve İletişim Bilgileri

Ad, soyad, e-posta adresi

Üyelik oluşturma sırasında verilen bilgiler

3.2. Finansal Bilgiler

Ödeme işlemleri Paddle altyapısı üzerinden gerçekleştirilmektedir

Kredi kartı bilgileri doğrudan Platform tarafından saklanmaz; bu veriler Paddle tarafından işlenir

3.3. CV ve Kariyer Verileri

Yüklenen CV/özgeçmiş dosyaları ve içerikleri

Yapay zeka analiz sonuçları ve öneriler

3.4. Teknik Veriler

IP adresi, tarayıcı türü, işletim sistemi bilgileri

Çerez verileri ve oturum bilgileri

Platform kullanım istatistikleri

4. Kişisel Verilerin İşlenme Amaçları

Toplanan kişisel veriler aşağıdaki amaçlarla işlenmektedir:

Üyelik kaydının oluşturulması ve hesap yönetimi

CV analizi ve yapay zeka destekli optimizasyon hizmetlerinin sunulması

Abonelik ve ödeme işlemlerinin yürütülmesi

Müşteri destek taleplerinin karşılanması

Platform performansının iyileştirilmesi ve hata giderme

Yasal yükümlülüklerin yerine getirilmesi

5. Kişisel Verilerin Paylaşılması

Kişisel verileriniz aşağıdaki üçüncü taraflarla paylaşılabilir:

Paddle: Ödeme işlemleri için

Yapay Zeka Hizmet Sağlayıcıları: CV analiz hizmetinin sağlanması amacıyla

Yasal Merciler: Mevzuat gereği zorunlu hallerde

Kişisel verileriniz, yukarıda belirtilen amaçlar dışında üçüncü taraflarla paylaşılmaz ve ticari amaçla satılmaz.

6. Verilerin Saklanma Süresi

Kişisel verileriniz, işlenme amaçları için gerekli olan süre boyunca saklanır. Üyeliğinizi sonlandırmanız halinde verileriniz yasal zorunluluklar saklı kalmak kaydıyla makul süre içinde silinir veya anonim hale getirilir.

7. Veri Güvenliği

Kişisel verilerinizin korunması için teknik ve idari tedbirler alınmakta, SSL şifreleme ve güvenli sunucu altyapıları kullanılmaktadır. Ancak internet üzerinden yapılan veri iletiminin mutlak güvenliği garanti edilemez.

8. Kullanıcı Hakları

6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:

Kişisel verilerinizin işlenip işlenmediğini öğrenme

İşlenmişse buna ilişkin bilgi talep etme

İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme

Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme

Eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme

Kanun'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme

İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme

Bu haklarınızı kullanmak için okanakarsu1074@gmail.com adresine başvurabilirsiniz.

9. Değişiklikler

Bu Gizlilik Politikası zaman zaman güncellenebilir. Güncellemeler Platform üzerinde yayımlandığı tarihte yürürlüğe girer. Önemli değişiklikler hakkında kullanıcılarımız e-posta yoluyla bilgilendirilecektir.

10. İletişim

Bu politika hakkında sorularınız için okanakarsu1074@gmail.com adresi üzerinden bizimle iletişime geçebilirsiniz.`

  const paragraphs = content.split("\n\n")

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Gizlilik Politikasi</h1>
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
