export default function KvkkPage() {
  const content = `KVKK Aydınlatma Metni

www.cvfit.com.tr

6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Yükümlülüğü

Son Güncelleme: 12 Mart 2026

Okan Akarsu — Konuralp, Düzce

okanakarsu1074@gmail.com

1. Veri Sorumlusu

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak Okan Akarsu tarafından aşağıda açıklanan kapsamda işlenecektir.

Veri Sorumlusu: Okan Akarsu

Adres: Konuralp, Düzce

E-posta: okanakarsu1074@gmail.com

2. İşlenen Kişisel Veriler

Platformumuz tarafından işlenen kişisel veri kategorileri aşağıda belirtilmiştir:

Kimlik Bilgileri: Ad, soyad

İletişim Bilgileri: E-posta adresi

Finansal Bilgiler: Abonelik ve ödeme kayıtları (Paddle aracılığıyla)

Mesleki Bilgiler: CV/özgeçmiş içerikleri, kariyer bilgileri

İşlem Güvenliği: IP adresi, çerez verileri, oturum bilgileri

Pazarlama: E-posta iletişim tercihleri

3. Kişisel Verilerin İşlenme Amaçları

Kişisel verileriniz aşağıdaki amaçlarla KVKK'nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayalı olarak işlenmektedir:

Üyelik sözleşmesinin kurulması ve ifası

CV analiz ve optimizasyon hizmetinin sunulması

Abonelik yönetimi ve ödeme işlemlerinin gerçekleştirilmesi

Müşteri destek ve iletişim faaliyetlerinin yürütülmesi

Platform güvenliğinin sağlanması

Yasal yükümlülüklerin yerine getirilmesi

Hizmet kalitesinin artırılması ve istatistiksel analizler

4. Hukuki Sebepler

Kişisel verileriniz aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:

Açık rızanızın bulunması (KVKK m.5/1)

Sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (KVKK m.5/2-c)

Hukuki yükümlülüğün yerine getirilmesi (KVKK m.5/2-ç)

Meşru menfaatimiz için zorunlu olması (KVKK m.5/2-f)

5. Kişisel Verilerin Aktarılması

Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda aşağıdaki alıcı gruplarına aktarılabilir:

Ödeme hizmet sağlayıcısı (Paddle) — ödeme işlemlerinin yürütülmesi amacıyla

Yapay zeka hizmet sağlayıcıları — CV analiz hizmetinin sunulması amacıyla

Hosting ve altyapı sağlayıcıları — platformun işletilmesi amacıyla

Yetkili kamu kurum ve kuruluşları — yasal zorunluluklar çerçevesinde

Kişisel verileriniz yurt dışına aktarılabilir. Bu aktarım KVKK'nın 9. maddesi kapsamında gerekli tedbirler alınarak gerçekleştirilir.

6. Kişisel Veri Toplamanın Yöntemi

Kişisel verileriniz; Platform üzerindeki üyelik formu, CV yükleme alanı, ödeme sayfası ve çerezler aracılığıyla otomatik ve otomatik olmayan yöntemlerle toplanmaktadır.

7. İlgili Kişi Olarak Haklarınız

KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

Kişisel verilerinizin işlenip işlenmediğini öğrenme

Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme

Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme

Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme

Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme

KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme

Düzeltme, silme ve yok etme işlemlerinin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme

İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme

Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme

8. Başvuru Yöntemi

Yukarıda belirtilen haklarınızı kullanmak için okanakarsu1074@gmail.com adresine kimliğinizi tespit edici bilgiler ile birlikte yazılı olarak başvurabilirsiniz. Başvurunuz en geç 30 (otuz) gün içinde sonuçlandırılacaktır.`

  const paragraphs = content.split("\n\n")

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">KVKK Aydinlatma Metni</h1>
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
