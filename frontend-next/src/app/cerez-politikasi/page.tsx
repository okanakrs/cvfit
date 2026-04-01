export default function CookiePolicyPage() {
  const content = `Çerez (Cookie) Politikası

www.cvfit.com.tr

Çerezlerin Kullanımına İlişkin Bilgilendirme

Son Güncelleme: 12 Mart 2026

Okan Akarsu — Konuralp, Düzce

okanakarsu1074@gmail.com

1. Çerez Nedir?

Çerezler, web siteleri tarafından tarayıcınız aracılığıyla cihazınıza yerleştirilen küçük metin dosyalarıdır. Bu dosyalar, siteyi bir sonraki ziyaretinizde sizi tanımak, tercihlerinizi hatırlamak ve size daha iyi bir kullanıcı deneyimi sunmak amacıyla kullanılır.

2. Kullandığımız Çerez Türleri

2.1. Zorunlu Çerezler

Platformun temel işlevlerinin çalışması için gerekli olan çerezlerdir. Oturum yönetimi, güvenlik ve kimlik doğrulama gibi işlevleri sağlar. Bu çerezler olmadan Platform düzgün çalışamaz.

2.2. İşlevsel Çerezler

Dil tercihi, tema seçimi gibi kullanıcı tercihlerini hatırlamak için kullanılır. Bu çerezler sayesinde her ziyaretinizde tercihlerinizi yeniden ayarlamanız gerekmez.

2.3. Analitik Çerezler

Platform kullanım istatistiklerini toplamak, ziyaretçi davranışlarını analiz etmek ve hizmet kalitesini artırmak amacıyla kullanılır. Bu veriler anonim olarak işlenir.

2.4. Ödeme Çerezleri

Paddle ödeme altyapısı tarafından güvenli ödeme işlemlerinin gerçekleştirilmesi amacıyla kullanılan çerezlerdir.

3. Üçüncü Taraf Çerezleri

Platformumuz aşağıdaki üçüncü taraf hizmet sağlayıcılarının çerezlerini kullanabilir:

Paddle: Ödeme işlemleri ve abonelik yönetimi

Analitik Araçlar: Kullanım istatistikleri ve performans ölçümü

4. Çerezlerin Saklanma Süresi

Oturum Çerezleri: Tarayıcınızı kapattığınızda otomatik olarak silinir

Kalıcı Çerezler: Belirli bir süre boyunca (genellikle 1 ay ile 1 yıl arasında) cihazınızda saklanır

5. Çerez Yönetimi

Tarayıcınızın ayarlarını değiştirerek çerezleri kabul etmeyi reddedebilir veya mevcut çerezleri silebilirsiniz. Ancak çerezleri devre dışı bırakmanız halinde Platformun bazı özelliklerinin düzgün çalışmayabileceğini hatırlatırız.

Çerez ayarlarınızı tarayıcınızın ayarlar menüsünden yönetebilirsiniz. Ayrıca Platform üzerindeki çerez tercih paneli aracılığıyla tercihlerinizi güncelleyebilirsiniz.

6. Hukuki Dayanak

Zorunlu çerezler, Platformun işleyişi için teknik olarak gerekli olduğundan KVKK m.5/2-f kapsamında meşru menfaat hukuki sebebine dayanılarak kullanılır. Zorunlu olmayan çerezler ise açık rızanıza dayalı olarak kullanılır.

7. Değişiklikler

Bu Çerez Politikası zaman zaman güncellenebilir. Güncellemeler Platform üzerinde yayımlandığı tarihte yürürlüğe girer.

8. İletişim

Çerezler hakkında sorularınız için: okanakarsu1074@gmail.com`

  const paragraphs = content.split("\n\n")

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cerez Politikasi</h1>
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
