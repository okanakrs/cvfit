// ============================================================
// BLOG YAPI TİPLERİ — mevcut blog.ts dosyanı bununla güncelle
// ============================================================

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "bold_p"; label: string; text: string }
  | { type: "callout"; text: string }

export type BlogPost = {
  slug: string
  tag: string
  tagClass: string
  title: string
  excerpt: string
  readTime: string
  date: string
  featuredBg: string
  accentText: string
  content: ContentBlock[]
}

// ============================================================
// BLOG #1 — ATS Nedir ve CV'nin Neden Reddediliyor?
// Hedef keyword: "ATS nedir", "ATS uyumlu CV", "ATS CV reddi"
// ============================================================

const POST_ATS_NEDIR: BlogPost = {
  slug: "ats-nedir",
  tag: "ATS & İşe Alım",
  tagClass:
    "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-400/10",
  title: "ATS Nedir ve CV'nin Neden Reddediliyor?",
  excerpt:
    "Şirketlerin %99'u artık başvuruları önce bir yazılımdan geçiriyor. Bu yazılımların nasıl çalıştığını ve CV'ni nasıl geçirebileceğini öğren.",
  readTime: "7 dk",
  date: "28 Mar 2025",
  featuredBg:
    "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-500/20",
  accentText: "text-purple-600 dark:text-purple-400",
  content: [
    {
      type: "p",
      text: "Onlarca iş başvurusu yaptın ama hiçbirinden geri dönüş almadın. CV'nde bir sorun yok gibi görünüyor; deneyimin var, yetkinliklerin yerli yerinde. Peki ne oluyor? Büyük ihtimalle CV'n, bir insan gözüne bile ulaşmadan ATS tarafından eleniyor.",
    },
    {
      type: "h2",
      text: "ATS Nedir?",
    },
    {
      type: "p",
      text: "ATS, yani Applicant Tracking System (Aday Takip Sistemi), işe alım ekiplerinin gelen başvuruları otomatik olarak filtrelemek, sıralamak ve takip etmek için kullandığı yazılımdır. Workday, Greenhouse, Lever, iCIMS ve SAP SuccessFactors bu alanda en yaygın kullanılan platformlardır.",
    },
    {
      type: "p",
      text: "Bir şirkete başvuru yaptığında CV'n önce bu sistem tarafından okunur. ATS, CV'ndeki metni analiz eder, iş ilanındaki anahtar kelimelerle karşılaştırır ve sana bir uyum skoru verir. Skoru yetersiz bulunan adaylar, insan kaynakları uzmanına ulaşmadan elenebilir.",
    },
    {
      type: "callout",
      text: "Araştırmalara göre büyük şirketlere yapılan başvuruların %75'i ATS tarafından filtreleniyor ve bir insan tarafından hiç okunmuyor.",
    },
    {
      type: "h2",
      text: "ATS Nasıl Çalışır?",
    },
    {
      type: "p",
      text: "ATS sistemleri CV'ni birkaç aşamada analiz eder:",
    },
    {
      type: "ol",
      items: [
        "Parsing (Ayrıştırma): CV'ndeki metni okur ve ad, iletişim bilgisi, iş deneyimi, eğitim, beceriler gibi bölümlere ayırır.",
        "Keyword Matching (Anahtar Kelime Eşleştirme): İş ilanındaki terimlerle CV'nindeki terimleri karşılaştırır. Tam eşleşmeler daha yüksek skor alır.",
        "Skorlama: Her aday için bir uyum skoru oluşturur. Belirli eşiğin altındaki adaylar otomatik olarak elenebilir.",
        "Sıralama: Kalan adaylar skora göre sıralanır ve işe alım uzmanına bu sırayla sunulur.",
      ],
    },
    {
      type: "h2",
      text: "CV'nin ATS Tarafından Reddedilmesinin 6 Ana Sebebi",
    },
    {
      type: "h3",
      text: "1. Anahtar Kelime Eksikliği",
    },
    {
      type: "p",
      text: "İş ilanında geçen kritik terimler CV'nde yer almıyorsa ATS seni uyumsuz sayar. Örneğin ilan 'proje yönetimi' yazıyorsa ama CV'nde 'ekip koordinasyonu' yazıyorsa, aynı işi yapıyor olsan bile sistem bunu eşleştiremeyebilir.",
    },
    {
      type: "h3",
      text: "2. Karmaşık veya Grafik Ağırlıklı Tasarım",
    },
    {
      type: "p",
      text: "Tablo, sütun, metin kutusu, grafik ve simgelerle dolu CV'ler ATS tarafından düzgün okunamaz. Sistem bu öğeleri ayrıştıramadığı için kritik bilgileri atlayabilir. Canva veya tasarım odaklı CV şablonları bu açıdan büyük risk taşır.",
    },
    {
      type: "h3",
      text: "3. Yanlış veya Alışılmamış Bölüm Başlıkları",
    },
    {
      type: "p",
      text: "ATS belirli standart başlıkları tanır: 'İş Deneyimi', 'Eğitim', 'Beceriler' gibi. 'Maceralarım' veya 'Süper Güçlerim' gibi yaratıcı başlıklar ATS için anlamsızdır ve bilgi kaybolabilir.",
    },
    {
      type: "h3",
      text: "4. Dosya Formatı Sorunu",
    },
    {
      type: "p",
      text: "Bazı ATS sistemleri .docx formatını tercih ederken bazıları PDF'i daha iyi okur. İlan özellikle bir format belirtmiyorsa standart, sade bir PDF genellikle daha güvenlidir.",
    },
    {
      type: "h3",
      text: "5. Deneyim Süresi Eşleşmemesi",
    },
    {
      type: "p",
      text: "İlan '5 yıl deneyim' şartı koymuşsa ATS bu kriteri otomatik olarak kontrol edebilir. Deneyim sürelerini CV'nde net ve tarih formatıyla (Oca 2020 – Haz 2023 gibi) belirtmemek bu kontrolü zorlaştırır.",
    },
    {
      type: "h3",
      text: "6. Genel Amaçlı CV Kullanımı",
    },
    {
      type: "p",
      text: "Aynı CV'yi farklı pozisyonlara göndermek ATS uyum skorunu düşürür. Her başvuruyu o ilana özel anahtar kelimeler ve önceliklerle uyarlamak gerekir.",
    },
    {
      type: "h2",
      text: "ATS Uyumlu CV Nasıl Yapılır?",
    },
    {
      type: "ul",
      items: [
        "İş ilanındaki anahtar kelimeleri tespit et ve CV'ne doğal bir şekilde yerleştir.",
        "Tek sütunlu, sade bir düzen kullan. Tablo ve grafik kullanma.",
        "Standart bölüm başlıkları seç: İş Deneyimi, Eğitim, Beceriler, Sertifikalar.",
        "Her pozisyon için tarihleri açıkça belirt (Ay Yıl – Ay Yıl formatında).",
        "Özel karakterler, simgeler ve emoji kullanmaktan kaçın.",
        "CV'ni her başvuruda o ilanın gereksinimlerine göre özelleştir.",
      ],
    },
    {
      type: "h2",
      text: "CVFit ile ATS Uyumunu Otomatik Artır",
    },
    {
      type: "p",
      text: "CVFit, CV'ni yapay zeka ile analiz eder ve hedeflediğin iş ilanıyla karşılaştırır. Eksik anahtar kelimeleri tespit eder, bölüm yapını değerlendirir ve somut iyileştirme önerileri sunar. Böylece her başvuruyu manuel olarak düzenlemek yerine dakikalar içinde ATS uyumlu bir CV elde edebilirsin.",
    },
    {
      type: "h2",
      text: "Sık Sorulan Sorular",
    },
    {
      type: "bold_p",
      label: "Tüm şirketler ATS kullanıyor mu?",
      text: "Büyük ve orta ölçekli şirketlerin büyük çoğunluğu ATS kullanıyor. Küçük işletmeler ve startuplar ise genellikle başvuruları doğrudan inceliyor. Ancak LinkedIn, Indeed gibi platformlar üzerinden yapılan başvurularda ATS benzeri filtreleme sisteme entegre edilmiş durumda.",
    },
    {
      type: "bold_p",
      label: "ATS'yi geçmek için anahtar kelimeleri doldurmak yeterli mi?",
      text: "Hayır. Anahtar kelimeler önemli ama ATS geçtikten sonra CV'ni bir insan okuyacak. Keyword doldurmak yerine kelimeleri deneyimlerinle destekleyerek doğal bir şekilde kullanmak hem ATS hem işe alım uzmanı için en doğru yaklaşımdır.",
    },
    {
      type: "bold_p",
      label: "CV'mi her başvuru için değiştirmem şart mı?",
      text: "Evet, her ilanın öne çıkardığı yetkinlikler ve kullandığı terimler farklıdır. CV'ni bu terimlere göre uyarlamak ATS uyum skorunu belirgin şekilde artırır. CVFit bu süreci otomatikleştirerek seni bu dertten kurtarır.",
    },
  ],
}

// ============================================================
// BLOG #2 — 2025'te CV Nasıl Yazılır? Tam Rehber
// Hedef keyword: "CV nasıl yazılır", "2025 CV rehberi", "ATS uyumlu CV yazımı"
// ============================================================

const POST_CV_YAZIM_REHBERI: BlogPost = {
  slug: "cv-yazim-rehberi",
  tag: "CV Yazımı",
  tagClass:
    "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10",
  title: "2025'te CV Nasıl Yazılır? Tam Rehber",
  excerpt:
    "İşe alım uzmanlarının gerçekten dikkat ettiği detaylar, kaçınılması gereken hatalar ve sektöre göre CV ipuçları.",
  readTime: "10 dk",
  date: "20 Mar 2025",
  featuredBg: "",
  accentText: "text-blue-600 dark:text-blue-400",
  content: [
    {
      type: "p",
      text: "2025'te iş pazarı hem daha rekabetçi hem de daha teknoloji odaklı hale geldi. İşe alım süreçlerinde yapay zeka destekli ATS sistemleri yaygınlaşırken, işe alım uzmanlarının dikkat ettiği kriterler de değişiyor. İyi bir CV artık sadece deneyimlerini listeleyen bir belge değil; doğru anahtar kelimeleri doğru formatta sunan, hem sistemi hem de insanı ikna eden stratejik bir araçtır.",
    },
    {
      type: "h2",
      text: "2025'te İyi CV'nin Temel Özellikleri",
    },
    {
      type: "ul",
      items: [
        "Net ve sade format: Tek sütun, okunabilir font, yeterli boşluk.",
        "ATS uyumlu yapı: Standart başlıklar, keyword odaklı içerik.",
        "Ölçülebilir başarılar: Yüzde, rakam ve somut çıktılarla desteklenmiş deneyimler.",
        "Pozisyona özel uyarlama: Her başvuru için özelleştirilmiş versiyon.",
        "1-2 sayfa uzunluk: 10 yıldan az deneyim için 1 sayfa idealdir.",
      ],
    },
    {
      type: "h2",
      text: "CV'nin Bölümleri ve Sıralama",
    },
    {
      type: "h3",
      text: "1. İletişim Bilgileri",
    },
    {
      type: "p",
      text: "Ad soyad, telefon, profesyonel e-posta adresi ve LinkedIn profil linki olmalı. Fotoğraf Türkiye'de hâlâ yaygın kullanılıyor; ancak uluslararası başvurularda genellikle beklenmez. Adres bilgisini şehir ve ülke düzeyinde tutmak yeterlidir.",
    },
    {
      type: "h3",
      text: "2. Profesyonel Özet",
    },
    {
      type: "p",
      text: "2-4 cümlelik bu bölüm, işe alım uzmanının ilk okuduğu kısımdır. Kim olduğunu, hangi alanda uzmanlaştığını ve ne sağladığını net biçimde ifade etmelidir. Genel ifadeler yerine somut başarılara dayalı bir özet yaz.",
    },
    {
      type: "h3",
      text: "3. İş Deneyimi",
    },
    {
      type: "p",
      text: "Ters kronolojik sırayla listele (en yeni en üstte). Her pozisyon için şirket adı, unvan, tarih aralığı ve madde madde başarılar yer almalı. Her madde güçlü bir eylem fiiliyle başlamalı: 'Yönettim', 'Geliştirdim', 'Artırdım', 'Azalttım' gibi.",
    },
    {
      type: "callout",
      text: "İpucu: 'Sorumluluklarım şunlardı...' yerine 'X yaparak Y sonucunu elde ettim' formatını kullan. Rakam olmayan bir başarı, başarı değildir.",
    },
    {
      type: "h3",
      text: "4. Eğitim",
    },
    {
      type: "p",
      text: "Üniversite, bölüm, mezuniyet yılı. Yüksek lisans veya doktora varsa lisans bilgisinin üstüne yaz. Mezuniyet notu yüksekse (3.5+) ekleyebilirsin; düşükse ekleme.",
    },
    {
      type: "h3",
      text: "5. Beceriler",
    },
    {
      type: "p",
      text: "Teknik beceriler (yazılım, diller, araçlar) ve dil becerileri ayrı ayrı listelenmeli. 'Microsoft Office biliyor' gibi genel ifadelerden kaçın; bunun yerine hangi araçları hangi seviyede kullandığını belirt.",
    },
    {
      type: "h3",
      text: "6. Sertifikalar ve Ödüller (varsa)",
    },
    {
      type: "p",
      text: "Pozisyonla ilgili sertifikalar (Google, AWS, PMP gibi) CV'ne değer katar. Alakasız veya çok eski sertifikaları ekleme.",
    },
    {
      type: "h2",
      text: "CV Yazımında Yapılan 7 Klasik Hata",
    },
    {
      type: "ol",
      items: [
        "Genel amaçlı tek CV göndermek — her başvuru için özelleştir.",
        "Sorumlulukları listelemek ama başarıları yazmamak — rakamlar kullan.",
        "Yazım ve dilbilgisi hataları — en az iki kez kontrol et.",
        "Çok uzun CV — 10 yıldan az deneyim için 1 sayfa yeterli.",
        "Grafik ağırlıklı tasarım — ATS okuyamaz, sade tut.",
        "Kişisel bilgileri aşırı paylaşmak — medeni hal, din gibi bilgiler gerekmez.",
        "Eski veya alakasız deneyimleri dahil etmek — son 10 yıla odaklan.",
      ],
    },
    {
      type: "h2",
      text: "Sektöre Göre CV İpuçları",
    },
    {
      type: "h3",
      text: "Teknoloji ve Yazılım",
    },
    {
      type: "p",
      text: "GitHub linki ve portföy ekle. Kullandığın diller ve frameworkleri açıkça belirt. Proje bazlı deneyimleri öne çıkar. ATS için 'Python', 'React', 'AWS' gibi teknik terimleri ilan dilinde kullan.",
    },
    {
      type: "h3",
      text: "Pazarlama ve İletişim",
    },
    {
      type: "p",
      text: "Kampanya performanslarını rakamlarla göster: 'Dönüşüm oranını %35 artırdım.' Kullandığın araçları (Google Ads, HubSpot, Meta Ads) beceriler bölümüne ekle.",
    },
    {
      type: "h3",
      text: "Finans ve Muhasebe",
    },
    {
      type: "p",
      text: "Sertifikalar (CPA, CFA, ACCA) öne çıkar. Yönettiğin bütçe büyüklükleri ve finansal çıktılar somut olarak belirtilmeli.",
    },
    {
      type: "h2",
      text: "ATS Uyumlu CV için Format Kuralları",
    },
    {
      type: "ul",
      items: [
        "Font: Arial, Calibri veya Times New Roman — 10-12 punto arası.",
        "Renk: Siyah metin, beyaz arka plan. Çok renkli tasarımlardan kaçın.",
        "Dosya adı: 'AdSoyad_CV.pdf' formatında kaydet.",
        "Kenar boşlukları: En az 1,5 cm her tarafta.",
        "Simge ve emoji kullanma — ATS okuyamaz.",
      ],
    },
    {
      type: "h2",
      text: "CVFit ile CV'ni Hızla Optimize Et",
    },
    {
      type: "p",
      text: "Doğru CV yazmak zaman alır ve her başvuru için yeniden yapmak yorucu olabilir. CVFit, CV'ni yüklediğinde iş ilanıyla karşılaştırır, eksik keyword'leri tespit eder ve bölüm bazında öneriler sunar. Dakikalar içinde ATS uyumlu, pozisyona özel bir CV elde edersin.",
    },
    {
      type: "h2",
      text: "Sık Sorulan Sorular",
    },
    {
      type: "bold_p",
      label: "CV kaç sayfa olmalı?",
      text: "10 yıldan az deneyim için 1 sayfa idealdir. 10 yılı aşan deneyimlerde 2 sayfa kabul edilebilir. Akademik veya araştırma pozisyonları için CV daha uzun olabilir.",
    },
    {
      type: "bold_p",
      label: "Fotoğraf eklemeli miyim?",
      text: "Türkiye'deki başvurularda fotoğraf hâlâ yaygın kullanılıyor. Uluslararası başvurularda (özellikle ABD ve İngiltere) fotoğraf eklenmesi önerilmez.",
    },
    {
      type: "bold_p",
      label: "Hobiler CV'de yer almalı mı?",
      text: "Genellikle gerekmez. Ancak pozisyonla doğrudan ilgili veya seni farklılaştıran bir hobin varsa (örneğin bir yazılım topluluğu kurucusuysan) kısaca ekleyebilirsin.",
    },
  ],
}

// ============================================================
// BLOG #3 — CV Özet Bölümü Nasıl Yazılır?
// Hedef keyword: "CV özet bölümü", "CV özeti nasıl yazılır", "profesyonel özet CV"
// ============================================================

const POST_OZET_BOLUMU: BlogPost = {
  slug: "ozet-bolumu",
  tag: "CV Yazımı",
  tagClass:
    "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10",
  title: "CV Özet Bölümü Nasıl Yazılır? (Örneklerle)",
  excerpt:
    "İlk 6 saniyede fark yaratacak bir özet bölümü yazmak için kullanabileceğin formüller ve gerçek örnekler.",
  readTime: "6 dk",
  date: "12 Mar 2025",
  featuredBg: "",
  accentText: "",
  content: [
    {
      type: "p",
      text: "İşe alım uzmanları bir CV'ye ortalama 6-7 saniye ayırıyor. Bu sürede dikkat çekemeyen CV'ler bir kenara bırakılıyor. Özet bölümü, bu saniyeler içinde 'Bu adaya devam etmeye değer' dedirtebilecek tek bölümdür.",
    },
    {
      type: "h2",
      text: "CV Özet Bölümü Nedir?",
    },
    {
      type: "p",
      text: "Profesyonel özet (ya da kariyer özeti), CV'nin en üstünde yer alan ve adayın kim olduğunu, ne yaptığını ve ne sağladığını 2-4 cümleyle özetleyen bölümdür. Amaç, işe alım uzmanına 'Bu kişiyi çağırmalıyım' düşüncesini hızla vermektir.",
    },
    {
      type: "callout",
      text: "Özet bölümü 'Hedef' (Objective) bölümünden farklıdır. Hedef bölümü sen ne istiyorsun diye sorar; özet bölümü sen ne sunuyorsun sorusunu cevaplar. 2025'te işverenler özet bölümü tercih ediyor.",
    },
    {
      type: "h2",
      text: "Güçlü Bir Özet İçin Temel Formül",
    },
    {
      type: "p",
      text: "Şu üç soruyu yanıtlayan bir özet her zaman işe yarar:",
    },
    {
      type: "ol",
      items: [
        "Kim/Ne: Kaç yıllık deneyime sahip, hangi alanda uzman birisin?",
        "Ne yaptın: En önemli başarın veya uzmanlık alanın ne?",
        "Ne sunuyorsun: Şirkete sağlayacağın değer ne?",
      ],
    },
    {
      type: "h2",
      text: "Sektöre Göre CV Özet Örnekleri",
    },
    {
      type: "h3",
      text: "Yazılım Geliştirici",
    },
    {
      type: "callout",
      text: "\"5 yıllık deneyime sahip full-stack geliştirici. React ve Node.js ile ölçeklenebilir web uygulamaları geliştiriyorum; son projemde sayfa yüklenme süresini %40 azalttım. Kullanıcı deneyimini teknik performansla buluşturan ürünler inşa etmek için yeni bir ekibe katılmaya hazırım.\"",
    },
    {
      type: "h3",
      text: "Dijital Pazarlama Uzmanı",
    },
    {
      type: "callout",
      text: "\"4 yıldır e-ticaret markalarının büyümesine katkı sağlayan dijital pazarlama uzmanıyım. Google Ads ve Meta kampanyalarında yönettiğim bütçeler toplamda 2M TL'yi aştı; ortalama ROAS'ı 3,2'den 5,8'e çıkardım. Performansa dayalı büyüme odaklı bir ekipte çalışmayı hedefliyorum.\"",
    },
    {
      type: "h3",
      text: "İnsan Kaynakları Uzmanı",
    },
    {
      type: "callout",
      text: "\"İşe alım ve organizasyonel gelişim alanında 6 yıllık deneyime sahibim. Yıllık 200+ pozisyon için işe alım süreçlerini yönettim; ortalama işe alım süresini 45 günden 28 güne düşürdüm. Çalışan bağlılığını ve şirket kültürünü güçlendirmeye odaklanıyorum.\"",
    },
    {
      type: "h3",
      text: "Yeni Mezun / Az Deneyimli",
    },
    {
      type: "callout",
      text: "\"İşletme bölümü mezunu, pazarlama ve marka yönetimine odaklanan genç bir profesyonelim. Üniversite döneminde 3 startup'ın sosyal medya stratejisini geliştirdim; toplam organik erişimi 6 ayda %120 artırdım. Büyüme odaklı bir ekipte kariyerime başlamak istiyorum.\"",
    },
    {
      type: "h2",
      text: "Özet Yazarken Yapılan 5 Hata",
    },
    {
      type: "ol",
      items: [
        "Genel ifadeler kullanmak: 'Takım oyuncusuyum, azimli ve çalışkanım.' — Bunları herkes yazar, kimse okumaz.",
        "Çok uzun yazmak: 6 cümleyi aşan özetler okunmaz. 2-4 cümle yeterli.",
        "Kopyala-yapıştır yapmak: Aynı özeti her başvuruya göndermek uyum algısını düşürür.",
        "Rakamsız yazmak: Başarılarını sayısal verilerle desteklemeyen özetler ikna etmez.",
        "İlan dilini yansıtmamak: ATS için ilandaki anahtar kelimeleri özete doğal biçimde yerleştir.",
      ],
    },
    {
      type: "h2",
      text: "ATS İçin Özet Bölümünü Optimize Et",
    },
    {
      type: "p",
      text: "Özet bölümü aynı zamanda ATS tarafından taranan ilk kısımlardan biridir. İş ilanındaki kritik kelimeleri (unvan, sektör, teknoloji adları gibi) özete doğal biçimde yerleştirmek uyum skorunu artırır.",
    },
    {
      type: "ul",
      items: [
        "Pozisyon unvanını özette kullan: 'Senior Product Manager olarak...'",
        "Sektör spesifik terimleri ekle: Fintech, SaaS, B2B gibi.",
        "Anahtar yetenekleri ilk cümlede geçir.",
        "Genel kelimeler yerine ilandaki tam ifadeleri tercih et.",
      ],
    },
    {
      type: "h2",
      text: "CVFit ile Özet Bölümünü Otomatik Yaz",
    },
    {
      type: "p",
      text: "CVFit, hedeflediğin iş ilanını analiz ederek sana özelleştirilmiş bir profesyonel özet taslağı oluşturur. Hem ATS uyumlu hem de insan okuyucuya hitap eden bir özet için başlangıç noktasını dakikalar içinde hazırlarsın.",
    },
    {
      type: "h2",
      text: "Sık Sorulan Sorular",
    },
    {
      type: "bold_p",
      label: "Her başvuruda özet bölümünü değiştirmeli miyim?",
      text: "Evet. Özet bölümü, o pozisyona neden uygun olduğunu anlatan kısımdır. İlanın diline ve önceliklerine göre uyarlamak uyum algısını ve ATS skorunu ciddi ölçüde artırır.",
    },
    {
      type: "bold_p",
      label: "Yeni mezunsam özet bölümü eklemeli miyim?",
      text: "Evet, ama beklenti farklı olmalı. Staj deneyimleri, üniversite projeleri ve sağladığın somut çıktılar üzerinden yaz. 'Henüz çok fazla deneyimim yok' yerine ne öğrendiğini ve ne sunabileceğini öne çıkar.",
    },
  ],
}

// ============================================================
// BLOG #4 — İş İlanını Okumayı Bilmek: Gizli İpuçları
// Hedef keyword: "iş ilanı nasıl okunur", "iş ilanı analizi", "CV iş ilanına göre uyarlama"
// ============================================================

const POST_IS_ILANI_ANALIZI: BlogPost = {
  slug: "is-ilani-analizi",
  tag: "Kariyer",
  tagClass:
    "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10",
  title: "İş İlanını Okumayı Bilmek: Gizli İpuçları",
  excerpt:
    "İş ilanlarındaki 'olsa iyi olur' ve 'şart' ayrımını nasıl anlarsın? Başvuru öncesi yapman gereken 5 adım.",
  readTime: "7 dk",
  date: "5 Mar 2025",
  featuredBg: "",
  accentText: "",
  content: [
    {
      type: "p",
      text: "Bir iş ilanı okuduğunda ne görürsün? Çoğu kişi görev tanımını ve gereksinimleri sıradan bir liste olarak okur. Oysa iş ilanları, doğru yorumlandığında başvuruyu nasıl şekillendireceğini gösteren bir haritadır.",
    },
    {
      type: "h2",
      text: "İş İlanının Anatomisi",
    },
    {
      type: "p",
      text: "Çoğu iş ilanı benzer bir yapıya sahiptir. Bu yapıyı tanımak, hangi bilginin ne kadar önemli olduğunu anlamanı sağlar.",
    },
    {
      type: "ul",
      items: [
        "Şirket tanıtımı: Kültür ve öncelikler hakkında ipuçları içerir.",
        "Pozisyon özeti: Rolün temel amacını ve şirkete katkısını açıklar.",
        "Görev ve sorumluluklar: Günlük iş yükünü ve öncelikleri gösterir.",
        "Gereksinimler / Nitelikler: Zorunlu ve tercih edilen kriterler yer alır.",
        "Avantajlar / Yan haklar: Şirketin sunduğu değeri gösterir.",
      ],
    },
    {
      type: "h2",
      text: "'Zorunlu' ve 'Tercih Edilen' Ayrımı",
    },
    {
      type: "p",
      text: "İlanlar genellikle gereksinimleri iki kategoride sunar. Bu ayrımı doğru okumak başvurma kararını etkiler.",
    },
    {
      type: "h3",
      text: "Zorunlu Gereksinimler",
    },
    {
      type: "p",
      text: "'Şart', 'gereklidir', 'olması beklenir', 'en az X yıl deneyim' gibi ifadeler zorunlu kriterleri işaret eder. Bu kriterlerin büyük çoğunluğunu karşılamıyorsan başvurmak zaman kaybı olabilir.",
    },
    {
      type: "h3",
      text: "Tercih Edilen Gereksinimler",
    },
    {
      type: "p",
      text: "'Tercih edilir', 'artı sayılır', 'olursa iyi olur', 'avantaj sağlar' gibi ifadeler zorunlu değil, bonus kriterlerdir. Bu kriterlerin tamamını karşılamasan da başvurabilirsin; ancak karşıladıklarını öne çıkarmak skoru artırır.",
    },
    {
      type: "callout",
      text: "Araştırmalar, kadın adayların listedeki tüm kriterleri karşılamadan başvurmadığını, erkeklerin ise %60'ını karşıladığında başvurduğunu gösteriyor. Zorunlu kriterlerin büyük çoğunluğunu karşılıyorsan başvur.",
    },
    {
      type: "h2",
      text: "Başvuru Öncesi Yapman Gereken 5 Adım",
    },
    {
      type: "h3",
      text: "1. İlanı Anahtar Kelimeler için Tara",
    },
    {
      type: "p",
      text: "İlanda en sık tekrar eden teknik terimler, unvanlar ve araçlar ATS'nin aradığı keyword'lerdir. Bunları bir listeye çıkar ve CV'nde geçip geçmediğini kontrol et.",
    },
    {
      type: "h3",
      text: "2. Görevleri Öncelik Sırasına Göre Oku",
    },
    {
      type: "p",
      text: "İlandaki görev listesinin sıralaması önemlidir — genellikle en kritik sorumluluklar üstte yer alır. CV'ndeki deneyimleri bu öncelik sırasına göre yeniden düzenle.",
    },
    {
      type: "h3",
      text: "3. Şirket Kültürünü Anla",
    },
    {
      type: "p",
      text: "İlandaki dil tonu şirket kültürü hakkında ipucu verir. 'Hızlı tempolu ortam', 'startup zihniyeti', 'süreç odaklı' gibi ifadeler ne tür bir çalışma ortamı olduğunu anlatır. Buna göre CV tonunu ve kapak mektubunu şekillendir.",
    },
    {
      type: "h3",
      text: "4. Gizli Gereksinimleri Bul",
    },
    {
      type: "p",
      text: "Bazen ilanın tamamı okunduğunda yazılmayan ama ima edilen beceriler ortaya çıkar. Örneğin 'birden fazla paydaşla çalışma' ifadesi iletişim ve stakeholder yönetimi becerisine işaret eder.",
    },
    {
      type: "h3",
      text: "5. CV'ni İlana Göre Uyarla",
    },
    {
      type: "p",
      text: "Aynı CV'yi her yere göndermek, ATS uyum skorunu ve insan gözündeki ilk izlenimi düşürür. İlandaki öncelikli yetkinlikleri CV'nde öne çıkar, deneyimlerini o dille yeniden ifade et.",
    },
    {
      type: "h2",
      text: "İlan Analizi Örneği",
    },
    {
      type: "p",
      text: "Bir yazılım mühendisi ilanı şunu yazıyorsa: 'React ile karmaşık UI bileşenleri geliştirme deneyimi (zorunlu), GraphQL bilgisi (tercih edilen), AWS deneyimi (artı sayılır)' — CV'nde React deneyimini öne çıkarmak şarttır. GraphQL bilgin varsa belirgin yere koy. AWS varsa beceriler bölümüne ekle.",
    },
    {
      type: "h2",
      text: "CVFit ile İlan Analizi Otomatik Olsun",
    },
    {
      type: "p",
      text: "CVFit, iş ilanını yapay zeka ile analiz ederek zorunlu ve tercih edilen kriterleri ayırt eder, CV'nde eksik olan keyword'leri tespit eder ve hangi deneyimlerini öne çıkarman gerektiğini gösterir. Manuel analiz yerine saniyeler içinde aksiyon alabilirsin.",
    },
    {
      type: "h2",
      text: "Sık Sorulan Sorular",
    },
    {
      type: "bold_p",
      label: "İlandaki tüm kriterleri karşılamasam da başvurmalı mıyım?",
      text: "Zorunlu kriterlerin %70-80'ini karşılıyorsan başvurmak mantıklıdır. Tercih edilen kriterleri tam karşılamasan da bu seni elemez; ancak karşıladıklarını vurgulamak önemlidir.",
    },
    {
      type: "bold_p",
      label: "Her iş başvurusu için ayrı CV oluşturmak çok zaman almıyor mu?",
      text: "Manuel yapıldığında evet. Ancak CVFit gibi araçlar bu uyarlama sürecini otomatikleştirerek dakikalar içinde pozisyona özel bir CV hazırlamana olanak tanır.",
    },
  ],
}

// ============================================================
// BLOG #5 — LinkedIn Profilini CV ile Uyumlu Hale Getir
// Hedef keyword: "LinkedIn CV uyumu", "LinkedIn profil optimizasyonu", "LinkedIn ATS"
// ============================================================

const POST_LINKEDIN_PROFIL: BlogPost = {
  slug: "linkedin-profil",
  tag: "Kariyer",
  tagClass:
    "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10",
  title: "LinkedIn Profilini CV ile Uyumlu Hale Getir",
  excerpt:
    "İşe alım uzmanları LinkedIn'e ne zaman bakıyor? Profilini güçlendirmek için bilmen gereken 8 şey.",
  readTime: "7 dk",
  date: "25 Şub 2025",
  featuredBg: "",
  accentText: "",
  content: [
    {
      type: "p",
      text: "Bir işe alım uzmanı CV'ni beğendikten sonra ne yapıyor? Neredeyse her zaman LinkedIn'ini açıyor. Eğer profil bilgilerin CV'nle çelişiyorsa ya da profilin boşsa, o başvuru riske giriyor. LinkedIn artık sadece bir profesyonel ağ değil; dijital CV'nin ikinci yüzüdür.",
    },
    {
      type: "h2",
      text: "Neden CV ve LinkedIn Uyumu Önemli?",
    },
    {
      type: "p",
      text: "İşe alım uzmanlarının büyük çoğunluğu, beğendikleri adayları LinkedIn'de araştırıyor. Profilde farklı bir unvan, çelişen tarihler veya eksik bilgiler güven sorununa yol açar. Öte yandan LinkedIn'deki içerik, CV'nde yer veremeceğin detayları — referanslar, yayınlar, projeler — sergilemene olanak tanır.",
    },
    {
      type: "h2",
      text: "LinkedIn Profilini Güçlendirmek için 8 Adım",
    },
    {
      type: "h3",
      text: "1. Başlığı (Headline) Optimize Et",
    },
    {
      type: "p",
      text: "LinkedIn başlığı, adın altında görünen 220 karakterlik alandır ve arama sonuçlarında en çok önem taşıyan yerdir. 'Şirket X'te Çalışıyorum' yerine 'Dijital Pazarlama Uzmanı | SEO & Performance Marketing | E-Ticaret' gibi keyword odaklı bir başlık kullan. Bu aynı zamanda LinkedIn'in kendi arama algoritması için de kritik.",
    },
    {
      type: "h3",
      text: "2. CV Özeti ile LinkedIn Hakkında Bölümünü Hizala",
    },
    {
      type: "p",
      text: "CV özetindeki çekirdek mesaj LinkedIn Hakkında bölümünde de yer almalı. Ancak LinkedIn'deki ton daha konuşkan ve kişisel olabilir. CV özeti resmiyken, LinkedIn özeti 'sen'i daha iyi tanıtır. Aynı omurgayı koru ama sesi biraz yumuşat.",
    },
    {
      type: "h3",
      text: "3. Deneyimlerde Tarih Tutarsızlığı Olmamalı",
    },
    {
      type: "p",
      text: "CV'nde Ocak 2021'de başladığını yazdığın bir iş, LinkedIn'de Mart 2021 gösteriyorsa bu soru işareti yaratır. Her pozisyon için ay/yıl bazında kontrol yap ve her iki platformu senkronize tut.",
    },
    {
      type: "h3",
      text: "4. Başarı Metriklerini LinkedIn'e Taşı",
    },
    {
      type: "p",
      text: "CV'nde yazdığın başarı rakamlarını LinkedIn'deki iş deneyimi açıklamalarına da ekle. 'Müşteri memnuniyetini %30 artırdım' gibi metrikler profil görüntülenme oranını artırır ve recruiter'ların dikkatini çeker.",
    },
    {
      type: "h3",
      text: "5. Beceriler Bölümünü CV ile Paralel Tut",
    },
    {
      type: "p",
      text: "LinkedIn'deki beceriler bölümü hem işe alım uzmanları hem de LinkedIn'in algoritması tarafından kullanılır. CV'nde öne çıkardığın teknik becerilerin LinkedIn beceriler listesinde de yer aldığından emin ol. Onaylanan beceriler profil görünürlüğünü artırır.",
    },
    {
      type: "h3",
      text: "6. Profil Fotoğrafı ve Banner",
    },
    {
      type: "p",
      text: "Profesyonel bir fotoğraf, profil görüntülenme oranını önemli ölçüde artırıyor. Sektöre uygun, sade arka planlı bir fotoğraf kullan. Banner alanı da personal brand mesajını destekleyecek şekilde özelleştirilebilir.",
    },
    {
      type: "h3",
      text: "7. Öne Çıkan Bölümünü (Featured) Kullan",
    },
    {
      type: "p",
      text: "LinkedIn'in Öne Çıkan bölümü portföy linkleri, yayınlar, sunumlar ve medya dosyaları eklemeye olanak tanır. CV'nde gösteremediğin projeleri burada sergile.",
    },
    {
      type: "h3",
      text: "8. Open to Work Ayarını Akıllıca Kullan",
    },
    {
      type: "p",
      text: "'Open to Work' özelliğini açtığında recruiter'lara görünür hale gelirsin. Sadece recruiter'lara açık tutmak, mevcut işvereninden gizlemek istiyorsan daha iyi bir seçenek olabilir.",
    },
    {
      type: "h2",
      text: "LinkedIn'de ATS Mantığı Var mı?",
    },
    {
      type: "p",
      text: "Evet. LinkedIn'in kendi arama algoritması, başlık ve beceri bölümlerine önem verir. Recruiter'lar arama yaparken keyword filtreler kullanır. Bu yüzden LinkedIn profilini de aynen CV gibi keyword odaklı optimize etmek gerekir.",
    },
    {
      type: "callout",
      text: "LinkedIn'de 'All Star' profil statüsüne ulaşmak arama görünürlüğünü artırır. Bunun için: fotoğraf, başlık, konum, sektör, özet, deneyim (en az 3), beceriler (en az 5) ve eğitim bölümlerini doldurman gerekiyor.",
    },
    {
      type: "h2",
      text: "CVFit ile CV-LinkedIn Senkronizasyonu",
    },
    {
      type: "p",
      text: "CVFit'in oluşturduğu optimize edilmiş CV içeriklerini LinkedIn profiline taşımak için iyi bir başlangıç noktası olarak kullanabilirsin. ATS uyumlu keyword'ler aynı zamanda LinkedIn'de de seni öne çıkarır.",
    },
    {
      type: "h2",
      text: "Sık Sorulan Sorular",
    },
    {
      type: "bold_p",
      label: "CV ve LinkedIn birebir aynı mı olmalı?",
      text: "Birebir aynı olması şart değil. Bilgilerin tutarlı ve çelişmez olması önemli. LinkedIn'de daha fazla içerik yer alabilir; projeler, yayınlar, tavsiyeler gibi.",
    },
    {
      type: "bold_p",
      label: "LinkedIn başlığı ne kadar önemli?",
      text: "Çok önemli. Hem recruiter aramaları hem de LinkedIn'in algoritması başlığa büyük ağırlık verir. Sadece unvan yazmak yerine anahtar becerilerini de eklemek görünürlüğü ciddi artırır.",
    },
  ],
}

// ============================================================
// BLOG #6 — CV'den Mülakata: Kendi CV'nle Hazırlık Yap
// Hedef keyword: "mülakat hazırlık", "STAR yöntemi mülakat", "CV'den mülakat soruları"
// ============================================================

const POST_MULAKAT_HAZIRLIK: BlogPost = {
  slug: "mulakat-hazirlik",
  tag: "Mülakat",
  tagClass:
    "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-400/10",
  title: "CV'den Mülakata: Kendi CV'nle Hazırlık Yap",
  excerpt:
    "CV'ndeki her deneyimi mülakata nasıl çevirirsin? STAR metoduyla güçlü cevaplar hazırlamanın yolu.",
  readTime: "9 dk",
  date: "15 Şub 2025",
  featuredBg: "",
  accentText: "",
  content: [
    {
      type: "p",
      text: "ATS'yi geçtin, mülakat daveti geldi. Şimdi ne yapacaksın? Çoğu kişi genel mülakat sorularını araştırıp ezberler. Ama en etkili hazırlık aracı zaten elinde: kendi CV'n.",
    },
    {
      type: "h2",
      text: "Neden CV Üzerinden Hazırlık?",
    },
    {
      type: "p",
      text: "İşe alım uzmanları mülakata CV'ni okuyarak gelir. Anlattıklarının, yazdıklarınla örtüşmesini beklerler. 'Bana X projesini anlat', 'Bu sonuca nasıl ulaştın?' gibi sorular doğrudan CV'nden üretilir. CV'ndeki her madde aslında bir mülakat sorusunun cevabıdır — ama hazır değilse.",
    },
    {
      type: "h2",
      text: "STAR Yöntemi Nedir?",
    },
    {
      type: "p",
      text: "STAR, davranışsal mülakat sorularını yapılandırılmış bir şekilde yanıtlamak için kullanılan bir çerçevedir.",
    },
    {
      type: "ul",
      items: [
        "S — Situation (Durum): Bağlamı anlat. Ne zaman, nerede, hangi koşullarda?",
        "T — Task (Görev): Senin rolün ve sorumluluğun ne oldu?",
        "A — Action (Aksiyon): Tam olarak ne yaptın? Hangi adımları attın?",
        "R — Result (Sonuç): Ne oldu? Ölçülebilir bir çıktı var mı?",
      ],
    },
    {
      type: "callout",
      text: "STAR yönteminin gücü sonuç kısmında. 'Sorunları çözdüm' demek ile 'Destek taleplerini %40 azalttık ve müşteri memnuniyeti 7.2'den 9.1'e çıktı' demek arasındaki fark, işte o fark.",
    },
    {
      type: "h2",
      text: "CV'ndeki Her Maddeyi STAR'a Dönüştür",
    },
    {
      type: "h3",
      text: "Adım 1: CV'ndeki her deneyim maddesini listele",
    },
    {
      type: "p",
      text: "Her iş deneyimindeki her maddeyi ayrı ayrı incele. 'Müşteri hizmetleri süreçlerini iyileştirdim' gibi bir ifade gördüğünde, bunun arkasındaki hikayeyi çıkarmaya çalış.",
    },
    {
      type: "h3",
      text: "Adım 2: Her madde için STAR şemasını doldur",
    },
    {
      type: "p",
      text: "Bir kağıda ya da nota uygulamasına STAR başlıklarını yaz. Her deneyim için bu dört soruyu cevapla. İlk başta zor gelebilir ama her biri aslında zaten bildiğin bir hikaye.",
    },
    {
      type: "h3",
      text: "Adım 3: Sonucu ölçülebilir hale getir",
    },
    {
      type: "p",
      text: "CV'ndeki rakamlar burada kritik. Eğer rakam yoksa şunu dene: 'Bu değişiklikten önce ve sonra ne farklılaştı?' Ekibin kaç kişiydi? Bütçe ne kadardı? Süreç ne kadar sürdü? Bunlardan bile bir bağlam çıkarabilirsin.",
    },
    {
      type: "h2",
      text: "Sık Sorulan Davranışsal Mülakat Soruları ve CV Bağlantısı",
    },
    {
      type: "h3",
      text: "\"Bana en zorlu iş deneyimini anlat\"",
    },
    {
      type: "p",
      text: "CV'ndeki en karmaşık veya kriz dönemini bul. STAR ile anlat. Sonuç kısmında öğrendiklerine de yer ver.",
    },
    {
      type: "h3",
      text: "\"Bir hedefi aştığın bir durumu anlat\"",
    },
    {
      type: "p",
      text: "CV'nde rakamsal başarı olan bir maddeyi seç. 'Hedef X'ti, Y'ye ulaştık' formatı mükemmel çalışır.",
    },
    {
      type: "h3",
      text: "\"Ekiple anlaşmazlık yaşadın mı?\"",
    },
    {
      type: "p",
      text: "Liderlik veya ekip çalışması deneyimlerinden birini seç. Çatışmanın nasıl çözüldüğüne ve sonucuna odaklan.",
    },
    {
      type: "h3",
      text: "\"Neden bu şirketi seçtin?\"",
    },
    {
      type: "p",
      text: "Bu soru CV'den değil, şirket araştırmasından gelir. Ama CV'ndeki kariyer yolculuğunu bu şirketle nasıl birleştirdiğini açıklaman beklenir.",
    },
    {
      type: "h2",
      text: "Mülakat Hazırlık Süreci: Adım Adım Plan",
    },
    {
      type: "ol",
      items: [
        "CV'ni önüne al ve her deneyim maddesini incele.",
        "Her madde için bir STAR hikayesi hazırla (3-5 hikaye yeterli).",
        "Hikayeleri 2 dakikayı geçmeyecek şekilde özetle.",
        "Rakamları not et — sonuç kısmı için kritik.",
        "Sesli pratik yap: Kendi kendine veya biriyle konuş.",
        "Şirketin değerleri ve kültürüyle hikayelerin örtüşüp örtüşmediğini kontrol et.",
      ],
    },
    {
      type: "h2",
      text: "CV'nde Rakam Yoksa Ne Yaparsın?",
    },
    {
      type: "p",
      text: "Mülakatta 'somut bir başarıyı anlat' sorusuna verecek yanıtın zayıf kalmasının en büyük sebebi CV'de rakam olmamasıdır. Bu yüzden CV hazırlarken her deneyim maddesine bir ölçüt eklemeye çalış. Eğer gerçek rakam yoksa kapsam bilgisi bile işe yarar: 'Günlük 200 müşteri talebi işleyen bir süreç geliştirdim.'",
    },
    {
      type: "h2",
      text: "CVFit ile Mülakat Hazırlığını Destekle",
    },
    {
      type: "p",
      text: "CVFit, CV'ni analiz ederken aynı zamanda hangi deneyimlerin mülakatta öne çıkabileceğini de gösterir. İş ilanıyla eşleşen güçlü noktaların farkına varman, mülakat hikayelerini doğru seçmeni kolaylaştırır.",
    },
    {
      type: "h2",
      text: "Sık Sorulan Sorular",
    },
    {
      type: "bold_p",
      label: "STAR yöntemi her soru tipi için geçerli mi?",
      text: "Davranışsal sorular için idealdir. Teknik sorular veya 'kendinizi tanıtın' gibi sorular farklı bir yapı gerektirebilir. Ama çoğu 'Bana bir örnek ver' sorusu için STAR mükemmel çalışır.",
    },
    {
      type: "bold_p",
      label: "Kaç tane STAR hikayesi hazırlamalıyım?",
      text: "3-5 güçlü hikaye çoğu mülakatı kapsar. Önemli olan sayı değil, her hikayenin net, ölçülebilir ve o pozisyona uygun olması.",
    },
    {
      type: "bold_p",
      label: "Hikayelerimi ezberlemeli miyim?",
      text: "Ezber yerine anahtar noktaları ve rakamları ezberle. Hikayeyi doğal bir akışla anlat. Ezberlenmiş cevaplar samimi gelmez ve dinamik sorulara cevap vermeni zorlaştırır.",
    },
  ],
}

// ============================================================
// EXPORT — tüm BLOG_POSTS dizisi
// ============================================================

export const BLOG_POSTS: BlogPost[] = [
  POST_ATS_NEDIR,
  POST_CV_YAZIM_REHBERI,
  POST_OZET_BOLUMU,
  POST_IS_ILANI_ANALIZI,
  POST_LINKEDIN_PROFIL,
  POST_MULAKAT_HAZIRLIK,
]

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
