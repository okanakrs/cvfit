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
  content: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ats-nedir",
    tag: "ATS & İşe Alım",
    tagClass: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-400/10",
    title: "ATS Nedir ve CV'nin Neden Reddediliyor?",
    excerpt: "Şirketlerin %99'u artık başvuruları önce bir yazılımdan geçiriyor. Bu yazılımları nasıl geçeceğini öğren.",
    readTime: "5 dk",
    date: "28 Mar 2025",
    featuredBg: "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-500/20",
    accentText: "text-purple-600 dark:text-purple-400",
    content: [
      "ATS (Applicant Tracking System), işe alım ekiplerinin başvuruları filtrelemek için kullandığı yazılımdır.",
      "CV'n önce ATS'den geçer, ardından insan kaynağı uzmanına ulaşır. Bu yüzden doğru anahtar kelimeler, temiz başlık yapısı ve okunabilir format çok önemlidir.",
      "CVFit ile CV'ni iş ilanına göre optimize ederek ATS uyumluluğunu artırabilir, red oranını ciddi şekilde düşürebilirsin.",
    ],
  },
  {
    slug: "cv-yazim-rehberi",
    tag: "CV Yazımı",
    tagClass: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10",
    title: "2025'te CV Nasıl Yazılır? Tam Rehber",
    excerpt: "İşe alım uzmanlarının gerçekten dikkat ettiği detaylar, kaçınılması gereken hatalar ve sektöre göre CV ipuçları.",
    readTime: "8 dk",
    date: "20 Mar 2025",
    featuredBg: "",
    accentText: "text-blue-600 dark:text-blue-400",
    content: [
      "İyi bir CV; net, kısa ve hedef pozisyona özel olmalıdır.",
      "Her deneyimde ölçülebilir etki belirtmek (örn. yüzde artış, süre kısalması) CV'ni daha güçlü kılar.",
      "Karmaşık tasarım yerine okunabilir bir hiyerarşi tercih etmek hem ATS hem insan gözü için daha iyidir.",
    ],
  },
  {
    slug: "ozet-bolumu",
    tag: "CV Yazımı",
    tagClass: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10",
    title: "CV Özet Bölümü Nasıl Yazılır? (Örneklerle)",
    excerpt: "İlk 6 saniyede fark yaratacak bir özet bölümü yazmak için kullanabileceğin formüller ve gerçek örnekler.",
    readTime: "4 dk",
    date: "12 Mar 2025",
    featuredBg: "",
    accentText: "",
    content: [
      "Özet bölümü, işe alım uzmanının ilk baktığı kısımdır.",
      "2-4 cümlede uzmanlığını, sektörünü ve sağladığın ana etkiyi söylemelisin.",
      "Genel ifadeler yerine somut sonuçlar kullan: 'sorumluluk aldım' yerine 'dönüşümü %18 artırdım' gibi.",
    ],
  },
  {
    slug: "is-ilani-analizi",
    tag: "Kariyer",
    tagClass: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10",
    title: "İş İlanını Okumayı Bilmek: Gizli İpuçları",
    excerpt: "İş ilanlarındaki 'olsa iyi olur' ve 'şart' ayrımını nasıl anlarsın? Başvuru öncesi yapman gereken 5 adım.",
    readTime: "6 dk",
    date: "5 Mar 2025",
    featuredBg: "",
    accentText: "",
    content: [
      "İlanda geçen gereksinimleri mutlaka 'zorunlu' ve 'tercih edilen' diye ayır.",
      "CV'ndeki deneyimleri ilana göre yeniden sıralamak, uyum algısını hızlıca artırır.",
      "Aynı ilan için tek bir CV yerine hedeflenmiş sürüm göndermek daha yüksek geri dönüş sağlar.",
    ],
  },
  {
    slug: "linkedin-profil",
    tag: "Kariyer",
    tagClass: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10",
    title: "LinkedIn Profilini CV ile Uyumlu Hale Getir",
    excerpt: "İşe alım uzmanları LinkedIn'e ne zaman bakıyor? Profilini güçlendirmek için bilmen gereken 8 şey.",
    readTime: "5 dk",
    date: "25 Şub 2025",
    featuredBg: "",
    accentText: "",
    content: [
      "CV ve LinkedIn başlığı birbiriyle çelişmemeli; mesajın her yerde aynı olmalı.",
      "Hakkında bölümünü CV özetinle aynı omurgada tutup daha konuşma diline çevirebilirsin.",
      "Projeler ve başarı metrikleri LinkedIn'de görünür olduğunda güven ve etki artar.",
    ],
  },
  {
    slug: "mulakat-hazirlik",
    tag: "Mülakat",
    tagClass: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-400/10",
    title: "CV'den Mülakata: Kendi CV'nle Hazırlık Yap",
    excerpt: "CV'ndeki her deneyimi mülakata nasıl çevirirsin? STAR metoduyla güçlü cevaplar hazırlamanın yolu.",
    readTime: "7 dk",
    date: "15 Şub 2025",
    featuredBg: "",
    accentText: "",
    content: [
      "Mülakat hazırlığının en iyi kaynağı kendi CV'ndir. Her madde için bir hikaye hazırla.",
      "STAR yöntemi (Situation, Task, Action, Result) ile cevaplarının yapısı netleşir.",
      "Sonuç kısmını ölçülebilir tutmak, anlattığın deneyimin ikna gücünü artırır.",
    ],
  },
]

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
