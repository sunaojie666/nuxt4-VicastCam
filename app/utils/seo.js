import { computed, unref, useHead, useI18n, useLocaleHead, useSeoMeta } from '#imports'

const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const privateRobots = 'noindex, nofollow, noarchive'

export const pageSeoCopy = {
  'zh-CN': {
    home: {
      title: '虚拟背景与直播增强工具',
      description: 'VicastCam 为创作者提供虚拟背景、直播增强、多平台推流和跨平台直播工具。',
    },
    download: {
      title: '下载中心',
      description: '下载 VicastCam，支持 Windows、iOS 和 Android 平台。',
    },
    faq: {
      title: '常见问题',
      description: '查看 VicastCam 常见问题、下载、安装和直播使用说明。',
    },
    privacy: {
      title: '隐私政策',
      description: '查看 VicastCam 隐私政策，了解我们如何收集、使用和保护您的个人信息。',
    },
    tutorial: {
      title: '教程中心',
      description: '查看 VicastCam 教程中心，学习下载、安装和使用方法。',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: '查看 VicastCam SDK 文档与 Demo 下载，快速集成虚拟相机、虚拟声卡和投屏能力。',
    },
    login: {
      title: '登录',
      description: '登录 VicastCam 账号。',
      robots: privateRobots,
    },
    profile: {
      title: '个人中心',
      description: 'VicastCam 个人中心页面。',
      robots: privateRobots,
    },
  },
  en: {
    home: {
      title: 'Virtual Backgrounds and Live Streaming Tools',
      description: 'VicastCam helps creators stream with virtual backgrounds, live enhancements, and multi-platform tools.',
    },
    download: {
      title: 'Download Center',
      description: 'Download VicastCam for Windows, iOS, and Android.',
    },
    faq: {
      title: 'FAQ',
      description: 'Find answers about VicastCam downloads, installation, accounts, and live streaming.',
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'Read the VicastCam Privacy Policy to learn how we collect, use, and protect personal information.',
    },
    tutorial: {
      title: 'Tutorial Center',
      description: 'Learn how to download, install, and use VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Explore VicastCam SDK documentation and demo downloads for virtual camera, virtual audio, and screen casting integrations.',
    },
    login: {
      title: 'Login',
      description: 'Log in to your VicastCam account.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profile',
      description: 'Your VicastCam profile center.',
      robots: privateRobots,
    },
  },
  'zh-TW': {
    home: {
      title: '虛擬背景與直播增強工具',
      description: 'VicastCam 為創作者提供虛擬背景、直播增強、多平台推流與跨平台直播工具。',
    },
    download: {
      title: '下載中心',
      description: '下載 VicastCam，支援 Windows、iOS 和 Android 平台。',
    },
    faq: {
      title: '常見問題',
      description: '查看 VicastCam 常見問題、下載、安裝與直播使用說明。',
    },
    privacy: {
      title: '隱私政策',
      description: '查看 VicastCam 隱私政策，了解我們如何收集、使用與保護您的個人資訊。',
    },
    tutorial: {
      title: '教程中心',
      description: '查看 VicastCam 教程中心，學習下載、安裝與使用方法。',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: '查看 VicastCam SDK 文件與 Demo 下載，快速整合虛擬相機、虛擬聲卡與投屏能力。',
    },
    login: {
      title: '登入',
      description: '登入您的 VicastCam 帳號。',
      robots: privateRobots,
    },
    profile: {
      title: '個人中心',
      description: '您的 VicastCam 個人中心。',
      robots: privateRobots,
    },
  },
  id: {
    home: {
      title: 'Latar Belakang Virtual dan Alat Live Streaming',
      description: 'VicastCam membantu kreator melakukan live streaming dengan latar belakang virtual, peningkatan siaran, dan alat multi-platform.',
    },
    download: {
      title: 'Pusat Unduhan',
      description: 'Unduh VicastCam untuk Windows, iOS, dan Android.',
    },
    faq: {
      title: 'Pertanyaan Umum',
      description: 'Temukan jawaban tentang unduhan, instalasi, akun, dan live streaming VicastCam.',
    },
    privacy: {
      title: 'Kebijakan Privasi',
      description: 'Baca Kebijakan Privasi VicastCam untuk mengetahui cara kami mengumpulkan, menggunakan, dan melindungi informasi pribadi.',
    },
    tutorial: {
      title: 'Pusat Tutorial',
      description: 'Pelajari cara mengunduh, menginstal, dan menggunakan VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Jelajahi dokumentasi VicastCam SDK dan unduhan demo untuk integrasi kamera virtual, audio virtual, dan screen casting.',
    },
    login: {
      title: 'Masuk',
      description: 'Masuk ke akun VicastCam Anda.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profil',
      description: 'Pusat profil VicastCam Anda.',
      robots: privateRobots,
    },
  },
  ms: {
    home: {
      title: 'Latar Belakang Maya dan Alat Penstriman Langsung',
      description: 'VicastCam membantu pencipta bersiaran dengan latar belakang maya, peningkatan siaran langsung dan alat berbilang platform.',
    },
    download: {
      title: 'Pusat Muat Turun',
      description: 'Muat turun VicastCam untuk Windows, iOS dan Android.',
    },
    faq: {
      title: 'Soalan Lazim',
      description: 'Cari jawapan tentang muat turun, pemasangan, akaun dan penstriman langsung VicastCam.',
    },
    privacy: {
      title: 'Dasar Privasi',
      description: 'Baca Dasar Privasi VicastCam untuk mengetahui cara kami mengumpul, menggunakan dan melindungi maklumat peribadi.',
    },
    tutorial: {
      title: 'Pusat Tutorial',
      description: 'Ketahui cara memuat turun, memasang dan menggunakan VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Terokai dokumentasi VicastCam SDK dan muat turun demo untuk integrasi kamera maya, audio maya dan perkongsian skrin.',
    },
    login: {
      title: 'Log Masuk',
      description: 'Log masuk ke akaun VicastCam anda.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profil',
      description: 'Pusat profil VicastCam anda.',
      robots: privateRobots,
    },
  },
  th: {
    home: {
      title: 'เครื่องมือพื้นหลังเสมือนและไลฟ์สตรีม',
      description: 'VicastCam ช่วยครีเอเตอร์ไลฟ์สตรีมด้วยพื้นหลังเสมือน การเสริมประสิทธิภาพไลฟ์ และเครื่องมือหลายแพลตฟอร์ม',
    },
    download: {
      title: 'ศูนย์ดาวน์โหลด',
      description: 'ดาวน์โหลด VicastCam สำหรับ Windows, iOS และ Android',
    },
    faq: {
      title: 'คำถามที่พบบ่อย',
      description: 'ค้นหาคำตอบเกี่ยวกับการดาวน์โหลด การติดตั้ง บัญชี และการไลฟ์สตรีมของ VicastCam',
    },
    privacy: {
      title: 'นโยบายความเป็นส่วนตัว',
      description: 'อ่านนโยบายความเป็นส่วนตัวของ VicastCam เพื่อดูว่าเราเก็บ ใช้ และปกป้องข้อมูลส่วนบุคคลอย่างไร',
    },
    tutorial: {
      title: 'ศูนย์บทเรียน',
      description: 'เรียนรู้วิธีดาวน์โหลด ติดตั้ง และใช้งาน VicastCam',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'ดูเอกสาร VicastCam SDK และดาวน์โหลดเดโมสำหรับการผสานกล้องเสมือน เสียงเสมือน และการแคสต์หน้าจอ',
    },
    login: {
      title: 'เข้าสู่ระบบ',
      description: 'เข้าสู่ระบบบัญชี VicastCam ของคุณ',
      robots: privateRobots,
    },
    profile: {
      title: 'โปรไฟล์',
      description: 'ศูนย์โปรไฟล์ VicastCam ของคุณ',
      robots: privateRobots,
    },
  },
  vi: {
    home: {
      title: 'Công Cụ Nền Ảo và Phát Trực Tiếp',
      description: 'VicastCam giúp nhà sáng tạo phát trực tiếp với nền ảo, công cụ tăng cường livestream và hỗ trợ đa nền tảng.',
    },
    download: {
      title: 'Trung Tâm Tải Xuống',
      description: 'Tải VicastCam cho Windows, iOS và Android.',
    },
    faq: {
      title: 'Câu Hỏi Thường Gặp',
      description: 'Tìm câu trả lời về tải xuống, cài đặt, tài khoản và phát trực tiếp với VicastCam.',
    },
    privacy: {
      title: 'Chính Sách Quyền Riêng Tư',
      description: 'Đọc Chính sách quyền riêng tư của VicastCam để biết cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân.',
    },
    tutorial: {
      title: 'Trung Tâm Hướng Dẫn',
      description: 'Tìm hiểu cách tải xuống, cài đặt và sử dụng VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Khám phá tài liệu VicastCam SDK và bản demo để tích hợp camera ảo, âm thanh ảo và truyền màn hình.',
    },
    login: {
      title: 'Đăng Nhập',
      description: 'Đăng nhập vào tài khoản VicastCam của bạn.',
      robots: privateRobots,
    },
    profile: {
      title: 'Hồ Sơ',
      description: 'Trung tâm hồ sơ VicastCam của bạn.',
      robots: privateRobots,
    },
  },
  fil: {
    home: {
      title: 'Mga Virtual Background at Live Streaming Tool',
      description: 'Tinutulungan ng VicastCam ang mga creator na mag-stream gamit ang virtual backgrounds, live enhancements, at multi-platform tools.',
    },
    download: {
      title: 'Sentro ng Pag-download',
      description: 'I-download ang VicastCam para sa Windows, iOS, at Android.',
    },
    faq: {
      title: 'Mga Madalas Itanong',
      description: 'Humanap ng sagot tungkol sa pag-download, pag-install, account, at live streaming ng VicastCam.',
    },
    privacy: {
      title: 'Patakaran sa Privacy',
      description: 'Basahin ang Patakaran sa Privacy ng VicastCam upang malaman kung paano namin kinokolekta, ginagamit, at pinoprotektahan ang personal na impormasyon.',
    },
    tutorial: {
      title: 'Sentro ng Tutorial',
      description: 'Alamin kung paano i-download, i-install, at gamitin ang VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Tingnan ang dokumentasyon ng VicastCam SDK at mga demo download para sa virtual camera, virtual audio, at screen casting.',
    },
    login: {
      title: 'Mag-login',
      description: 'Mag-login sa iyong VicastCam account.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profile',
      description: 'Ang iyong VicastCam profile center.',
      robots: privateRobots,
    },
  },
  es: {
    home: {
      title: 'Fondos Virtuales y Herramientas de Transmisión en Vivo',
      description: 'VicastCam ayuda a los creadores a transmitir con fondos virtuales, mejoras en vivo y herramientas multiplataforma.',
    },
    download: {
      title: 'Centro de Descargas',
      description: 'Descarga VicastCam para Windows, iOS y Android.',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      description: 'Encuentra respuestas sobre descargas, instalación, cuentas y transmisión en vivo con VicastCam.',
    },
    privacy: {
      title: 'Política de Privacidad',
      description: 'Lee la Política de Privacidad de VicastCam para saber cómo recopilamos, usamos y protegemos la información personal.',
    },
    tutorial: {
      title: 'Centro de Tutoriales',
      description: 'Aprende a descargar, instalar y usar VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Explora la documentación de VicastCam SDK y las descargas de demo para cámara virtual, audio virtual y transmisión de pantalla.',
    },
    login: {
      title: 'Iniciar Sesión',
      description: 'Inicia sesión en tu cuenta de VicastCam.',
      robots: privateRobots,
    },
    profile: {
      title: 'Perfil',
      description: 'Tu centro de perfil de VicastCam.',
      robots: privateRobots,
    },
  },
  pt: {
    home: {
      title: 'Fundos Virtuais e Ferramentas de Transmissão ao Vivo',
      description: 'O VicastCam ajuda criadores a transmitir com fundos virtuais, melhorias ao vivo e ferramentas multiplataforma.',
    },
    download: {
      title: 'Central de Downloads',
      description: 'Baixe o VicastCam para Windows, iOS e Android.',
    },
    faq: {
      title: 'Perguntas Frequentes',
      description: 'Encontre respostas sobre downloads, instalação, contas e transmissão ao vivo com o VicastCam.',
    },
    privacy: {
      title: 'Política de Privacidade',
      description: 'Leia a Política de Privacidade do VicastCam para saber como coletamos, usamos e protegemos informações pessoais.',
    },
    tutorial: {
      title: 'Central de Tutoriais',
      description: 'Aprenda a baixar, instalar e usar o VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Explore a documentação do VicastCam SDK e downloads de demo para câmera virtual, áudio virtual e espelhamento de tela.',
    },
    login: {
      title: 'Entrar',
      description: 'Entre na sua conta VicastCam.',
      robots: privateRobots,
    },
    profile: {
      title: 'Perfil',
      description: 'Seu centro de perfil do VicastCam.',
      robots: privateRobots,
    },
  },
  ar: {
    home: {
      title: 'أدوات الخلفيات الافتراضية والبث المباشر',
      description: 'يساعد VicastCam المبدعين على البث باستخدام خلفيات افتراضية وتحسينات مباشرة وأدوات متعددة المنصات.',
    },
    download: {
      title: 'مركز التنزيل',
      description: 'نزّل VicastCam لأنظمة Windows و iOS و Android.',
    },
    faq: {
      title: 'الأسئلة الشائعة',
      description: 'اعثر على إجابات حول تنزيل VicastCam وتثبيته والحسابات والبث المباشر.',
    },
    privacy: {
      title: 'سياسة الخصوصية',
      description: 'اقرأ سياسة خصوصية VicastCam لمعرفة كيفية جمع المعلومات الشخصية واستخدامها وحمايتها.',
    },
    tutorial: {
      title: 'مركز الدروس',
      description: 'تعلّم كيفية تنزيل VicastCam وتثبيته واستخدامه.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'استكشف وثائق VicastCam SDK وتنزيلات العروض التجريبية لدمج الكاميرا الافتراضية والصوت الافتراضي وبث الشاشة.',
    },
    login: {
      title: 'تسجيل الدخول',
      description: 'سجّل الدخول إلى حساب VicastCam الخاص بك.',
      robots: privateRobots,
    },
    profile: {
      title: 'الملف الشخصي',
      description: 'مركز ملفك الشخصي في VicastCam.',
      robots: privateRobots,
    },
  },
  ja: {
    home: {
      title: 'バーチャル背景とライブ配信ツール',
      description: 'VicastCam は、バーチャル背景、ライブ配信の強化、マルチプラットフォーム配信ツールをクリエイターに提供します。',
    },
    download: {
      title: 'ダウンロードセンター',
      description: 'Windows、iOS、Android 向け VicastCam をダウンロードできます。',
    },
    faq: {
      title: 'よくある質問',
      description: 'VicastCam のダウンロード、インストール、アカウント、ライブ配信に関する回答をご覧ください。',
    },
    privacy: {
      title: 'プライバシーポリシー',
      description: 'VicastCam のプライバシーポリシーで、個人情報の収集、使用、保護について確認できます。',
    },
    tutorial: {
      title: 'チュートリアルセンター',
      description: 'VicastCam のダウンロード、インストール、使用方法を学べます。',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'バーチャルカメラ、仮想オーディオ、画面キャスト統合向けの VicastCam SDK ドキュメントとデモを確認できます。',
    },
    login: {
      title: 'ログイン',
      description: 'VicastCam アカウントにログインします。',
      robots: privateRobots,
    },
    profile: {
      title: 'プロフィール',
      description: 'VicastCam のプロフィールセンターです。',
      robots: privateRobots,
    },
  },
  tr: {
    home: {
      title: 'Sanal Arka Planlar ve Canlı Yayın Araçları',
      description: 'VicastCam, içerik üreticilerin sanal arka planlar, canlı yayın geliştirmeleri ve çoklu platform araçlarıyla yayın yapmasına yardımcı olur.',
    },
    download: {
      title: 'İndirme Merkezi',
      description: 'Windows, iOS ve Android için VicastCam indirin.',
    },
    faq: {
      title: 'SSS',
      description: 'VicastCam indirme, kurulum, hesaplar ve canlı yayın hakkında yanıtlar bulun.',
    },
    privacy: {
      title: 'Gizlilik Politikası',
      description: 'Kişisel bilgileri nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenmek için VicastCam Gizlilik Politikasını okuyun.',
    },
    tutorial: {
      title: 'Eğitim Merkezi',
      description: 'VicastCam indirmeyi, kurmayı ve kullanmayı öğrenin.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Sanal kamera, sanal ses ve ekran yayını entegrasyonları için VicastCam SDK belgelerini ve demo indirmelerini keşfedin.',
    },
    login: {
      title: 'Giriş Yap',
      description: 'VicastCam hesabınıza giriş yapın.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profil',
      description: 'VicastCam profil merkeziniz.',
      robots: privateRobots,
    },
  },
  it: {
    home: {
      title: 'Sfondi Virtuali e Strumenti per Live Streaming',
      description: 'VicastCam aiuta i creator a trasmettere con sfondi virtuali, miglioramenti live e strumenti multipiattaforma.',
    },
    download: {
      title: 'Centro Download',
      description: 'Scarica VicastCam per Windows, iOS e Android.',
    },
    faq: {
      title: 'FAQ',
      description: 'Trova risposte su download, installazione, account e live streaming con VicastCam.',
    },
    privacy: {
      title: 'Informativa sulla Privacy',
      description: 'Leggi l’Informativa sulla Privacy di VicastCam per sapere come raccogliamo, usiamo e proteggiamo le informazioni personali.',
    },
    tutorial: {
      title: 'Centro Tutorial',
      description: 'Scopri come scaricare, installare e usare VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Esplora la documentazione VicastCam SDK e i download demo per camera virtuale, audio virtuale e trasmissione dello schermo.',
    },
    login: {
      title: 'Accedi',
      description: 'Accedi al tuo account VicastCam.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profilo',
      description: 'Il tuo centro profilo VicastCam.',
      robots: privateRobots,
    },
  },
  de: {
    home: {
      title: 'Virtuelle Hintergründe und Live-Streaming-Tools',
      description: 'VicastCam hilft Creators beim Streamen mit virtuellen Hintergründen, Live-Verbesserungen und Multi-Plattform-Tools.',
    },
    download: {
      title: 'Download-Center',
      description: 'Laden Sie VicastCam für Windows, iOS und Android herunter.',
    },
    faq: {
      title: 'FAQ',
      description: 'Finden Sie Antworten zu VicastCam-Downloads, Installation, Konten und Live-Streaming.',
    },
    privacy: {
      title: 'Datenschutzrichtlinie',
      description: 'Lesen Sie die VicastCam Datenschutzrichtlinie, um zu erfahren, wie wir personenbezogene Daten erheben, verwenden und schützen.',
    },
    tutorial: {
      title: 'Tutorial-Center',
      description: 'Erfahren Sie, wie Sie VicastCam herunterladen, installieren und verwenden.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Entdecken Sie die VicastCam SDK-Dokumentation und Demo-Downloads für virtuelle Kamera, virtuelles Audio und Bildschirmübertragung.',
    },
    login: {
      title: 'Anmelden',
      description: 'Melden Sie sich bei Ihrem VicastCam-Konto an.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profil',
      description: 'Ihr VicastCam Profilcenter.',
      robots: privateRobots,
    },
  },
  fr: {
    home: {
      title: 'Arrière-Plans Virtuels et Outils de Streaming en Direct',
      description: 'VicastCam aide les créateurs à diffuser avec des arrière-plans virtuels, des améliorations live et des outils multiplateformes.',
    },
    download: {
      title: 'Centre de Téléchargement',
      description: 'Téléchargez VicastCam pour Windows, iOS et Android.',
    },
    faq: {
      title: 'FAQ',
      description: 'Trouvez des réponses sur les téléchargements, l’installation, les comptes et le streaming en direct avec VicastCam.',
    },
    privacy: {
      title: 'Politique de Confidentialité',
      description: 'Lisez la Politique de confidentialité de VicastCam pour savoir comment nous collectons, utilisons et protégeons les informations personnelles.',
    },
    tutorial: {
      title: 'Centre de Tutoriels',
      description: 'Apprenez à télécharger, installer et utiliser VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Explorez la documentation du VicastCam SDK et les démos pour intégrer caméra virtuelle, audio virtuel et diffusion d’écran.',
    },
    login: {
      title: 'Connexion',
      description: 'Connectez-vous à votre compte VicastCam.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profil',
      description: 'Votre centre de profil VicastCam.',
      robots: privateRobots,
    },
  },
  ko: {
    home: {
      title: '가상 배경 및 라이브 스트리밍 도구',
      description: 'VicastCam은 크리에이터에게 가상 배경, 라이브 향상 기능, 멀티 플랫폼 도구를 제공합니다.',
    },
    download: {
      title: '다운로드 센터',
      description: 'Windows, iOS, Android용 VicastCam을 다운로드하세요.',
    },
    faq: {
      title: '자주 묻는 질문',
      description: 'VicastCam 다운로드, 설치, 계정 및 라이브 스트리밍에 대한 답변을 확인하세요.',
    },
    privacy: {
      title: '개인정보 처리방침',
      description: 'VicastCam 개인정보 처리방침에서 개인정보를 수집, 사용, 보호하는 방법을 확인하세요.',
    },
    tutorial: {
      title: '튜토리얼 센터',
      description: 'VicastCam을 다운로드, 설치, 사용하는 방법을 알아보세요.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: '가상 카메라, 가상 오디오, 화면 전송 통합을 위한 VicastCam SDK 문서와 데모 다운로드를 확인하세요.',
    },
    login: {
      title: '로그인',
      description: 'VicastCam 계정에 로그인하세요.',
      robots: privateRobots,
    },
    profile: {
      title: '프로필',
      description: 'VicastCam 프로필 센터입니다.',
      robots: privateRobots,
    },
  },
  ru: {
    home: {
      title: 'Виртуальные Фоны и Инструменты для Прямых Трансляций',
      description: 'VicastCam помогает авторам вести трансляции с виртуальными фонами, улучшениями эфира и мультиплатформенными инструментами.',
    },
    download: {
      title: 'Центр Загрузок',
      description: 'Скачайте VicastCam для Windows, iOS и Android.',
    },
    faq: {
      title: 'Вопросы и Ответы',
      description: 'Найдите ответы о загрузке, установке, аккаунтах и прямых трансляциях VicastCam.',
    },
    privacy: {
      title: 'Политика Конфиденциальности',
      description: 'Прочитайте Политику конфиденциальности VicastCam, чтобы узнать, как мы собираем, используем и защищаем персональные данные.',
    },
    tutorial: {
      title: 'Центр Обучения',
      description: 'Узнайте, как скачать, установить и использовать VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Изучите документацию VicastCam SDK и демо-загрузки для виртуальной камеры, виртуального аудио и трансляции экрана.',
    },
    login: {
      title: 'Войти',
      description: 'Войдите в свою учетную запись VicastCam.',
      robots: privateRobots,
    },
    profile: {
      title: 'Профиль',
      description: 'Ваш центр профиля VicastCam.',
      robots: privateRobots,
    },
  },
  pl: {
    home: {
      title: 'Wirtualne Tła i Narzędzia do Transmisji na Żywo',
      description: 'VicastCam pomaga twórcom streamować z wirtualnymi tłami, ulepszeniami transmisji i narzędziami wieloplatformowymi.',
    },
    download: {
      title: 'Centrum Pobierania',
      description: 'Pobierz VicastCam dla Windows, iOS i Android.',
    },
    faq: {
      title: 'FAQ',
      description: 'Znajdź odpowiedzi dotyczące pobierania, instalacji, kont i transmisji na żywo w VicastCam.',
    },
    privacy: {
      title: 'Polityka Prywatności',
      description: 'Przeczytaj Politykę prywatności VicastCam, aby dowiedzieć się, jak zbieramy, używamy i chronimy dane osobowe.',
    },
    tutorial: {
      title: 'Centrum Poradników',
      description: 'Dowiedz się, jak pobrać, zainstalować i używać VicastCam.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Poznaj dokumentację VicastCam SDK i pobieranie demo dla kamery wirtualnej, wirtualnego audio i udostępniania ekranu.',
    },
    login: {
      title: 'Logowanie',
      description: 'Zaloguj się na swoje konto VicastCam.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profil',
      description: 'Twoje centrum profilu VicastCam.',
      robots: privateRobots,
    },
  },
  nl: {
    home: {
      title: 'Virtuele Achtergronden en Live Streaming Tools',
      description: 'VicastCam helpt makers streamen met virtuele achtergronden, live verbeteringen en tools voor meerdere platforms.',
    },
    download: {
      title: 'Downloadcentrum',
      description: 'Download VicastCam voor Windows, iOS en Android.',
    },
    faq: {
      title: 'Veelgestelde Vragen',
      description: 'Vind antwoorden over VicastCam-downloads, installatie, accounts en live streaming.',
    },
    privacy: {
      title: 'Privacybeleid',
      description: 'Lees het privacybeleid van VicastCam om te zien hoe we persoonlijke informatie verzamelen, gebruiken en beschermen.',
    },
    tutorial: {
      title: 'Tutorialcentrum',
      description: 'Leer hoe je VicastCam downloadt, installeert en gebruikt.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'Bekijk de VicastCam SDK-documentatie en demo-downloads voor virtuele camera, virtuele audio en schermcasting.',
    },
    login: {
      title: 'Inloggen',
      description: 'Log in op je VicastCam-account.',
      robots: privateRobots,
    },
    profile: {
      title: 'Profiel',
      description: 'Je VicastCam-profielcentrum.',
      robots: privateRobots,
    },
  },
  hi: {
    home: {
      title: 'वर्चुअल बैकग्राउंड और लाइव स्ट्रीमिंग टूल्स',
      description: 'VicastCam क्रिएटर्स को वर्चुअल बैकग्राउंड, लाइव एन्हांसमेंट और मल्टी-प्लेटफॉर्म टूल्स के साथ स्ट्रीम करने में मदद करता है।',
    },
    download: {
      title: 'डाउनलोड केंद्र',
      description: 'Windows, iOS और Android के लिए VicastCam डाउनलोड करें।',
    },
    faq: {
      title: 'अक्सर पूछे जाने वाले प्रश्न',
      description: 'VicastCam डाउनलोड, इंस्टॉलेशन, अकाउंट और लाइव स्ट्रीमिंग से जुड़े जवाब पाएँ।',
    },
    privacy: {
      title: 'गोपनीयता नीति',
      description: 'व्यक्तिगत जानकारी को हम कैसे एकत्र, उपयोग और सुरक्षित करते हैं, यह जानने के लिए VicastCam गोपनीयता नीति पढ़ें।',
    },
    tutorial: {
      title: 'ट्यूटोरियल केंद्र',
      description: 'VicastCam को डाउनलोड, इंस्टॉल और उपयोग करना सीखें।',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'वर्चुअल कैमरा, वर्चुअल ऑडियो और स्क्रीन कास्टिंग इंटीग्रेशन के लिए VicastCam SDK दस्तावेज़ और डेमो डाउनलोड देखें।',
    },
    login: {
      title: 'लॉग इन',
      description: 'अपने VicastCam खाते में लॉग इन करें।',
      robots: privateRobots,
    },
    profile: {
      title: 'प्रोफ़ाइल',
      description: 'आपका VicastCam प्रोफ़ाइल केंद्र।',
      robots: privateRobots,
    },
  },
  ur: {
    home: {
      title: 'ورچوئل بیک گراؤنڈز اور لائیو اسٹریمنگ ٹولز',
      description: 'VicastCam کری ایٹرز کو ورچوئل بیک گراؤنڈز، لائیو بہتریوں اور ملٹی پلیٹ فارم ٹولز کے ساتھ اسٹریمنگ میں مدد دیتا ہے۔',
    },
    download: {
      title: 'ڈاؤن لوڈ سینٹر',
      description: 'Windows، iOS اور Android کے لیے VicastCam ڈاؤن لوڈ کریں۔',
    },
    faq: {
      title: 'عمومی سوالات',
      description: 'VicastCam ڈاؤن لوڈ، انسٹالیشن، اکاؤنٹس اور لائیو اسٹریمنگ کے بارے میں جوابات تلاش کریں۔',
    },
    privacy: {
      title: 'رازداری کی پالیسی',
      description: 'یہ جاننے کے لیے VicastCam رازداری کی پالیسی پڑھیں کہ ہم ذاتی معلومات کو کیسے جمع، استعمال اور محفوظ کرتے ہیں۔',
    },
    tutorial: {
      title: 'ٹیوٹوریل سینٹر',
      description: 'VicastCam کو ڈاؤن لوڈ، انسٹال اور استعمال کرنا سیکھیں۔',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'ورچوئل کیمرہ، ورچوئل آڈیو اور اسکرین کاسٹنگ انٹیگریشنز کے لیے VicastCam SDK دستاویزات اور ڈیمو ڈاؤن لوڈز دیکھیں۔',
    },
    login: {
      title: 'لاگ ان',
      description: 'اپنے VicastCam اکاؤنٹ میں لاگ ان کریں۔',
      robots: privateRobots,
    },
    profile: {
      title: 'پروفائل',
      description: 'آپ کا VicastCam پروفائل سینٹر۔',
      robots: privateRobots,
    },
  },
  bn: {
    home: {
      title: 'ভার্চুয়াল ব্যাকগ্রাউন্ড ও লাইভ স্ট্রিমিং টুলস',
      description: 'VicastCam ক্রিয়েটরদের ভার্চুয়াল ব্যাকগ্রাউন্ড, লাইভ উন্নতি এবং মাল্টি-প্ল্যাটফর্ম টুল দিয়ে স্ট্রিম করতে সাহায্য করে।',
    },
    download: {
      title: 'ডাউনলোড সেন্টার',
      description: 'Windows, iOS এবং Android-এর জন্য VicastCam ডাউনলোড করুন।',
    },
    faq: {
      title: 'সাধারণ প্রশ্ন',
      description: 'VicastCam ডাউনলোড, ইনস্টলেশন, অ্যাকাউন্ট এবং লাইভ স্ট্রিমিং সম্পর্কে উত্তর খুঁজুন।',
    },
    privacy: {
      title: 'গোপনীয়তা নীতি',
      description: 'আমরা কীভাবে ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি তা জানতে VicastCam গোপনীয়তা নীতি পড়ুন।',
    },
    tutorial: {
      title: 'টিউটোরিয়াল সেন্টার',
      description: 'VicastCam ডাউনলোড, ইনস্টল এবং ব্যবহার করা শিখুন।',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'ভার্চুয়াল ক্যামেরা, ভার্চুয়াল অডিও এবং স্ক্রিন কাস্টিং ইন্টিগ্রেশনের জন্য VicastCam SDK ডকুমেন্টেশন ও ডেমো ডাউনলোড দেখুন।',
    },
    login: {
      title: 'লগ ইন',
      description: 'আপনার VicastCam অ্যাকাউন্টে লগ ইন করুন।',
      robots: privateRobots,
    },
    profile: {
      title: 'প্রোফাইল',
      description: 'আপনার VicastCam প্রোফাইল সেন্টার।',
      robots: privateRobots,
    },
  },
  fa: {
    home: {
      title: 'پس‌زمینه‌های مجازی و ابزارهای پخش زنده',
      description: 'VicastCam به سازندگان کمک می‌کند با پس‌زمینه‌های مجازی، بهبودهای زنده و ابزارهای چندپلتفرمی پخش کنند.',
    },
    download: {
      title: 'مرکز دانلود',
      description: 'VicastCam را برای Windows، iOS و Android دانلود کنید.',
    },
    faq: {
      title: 'پرسش‌های متداول',
      description: 'پاسخ‌هایی درباره دانلود، نصب، حساب‌ها و پخش زنده VicastCam پیدا کنید.',
    },
    privacy: {
      title: 'سیاست حفظ حریم خصوصی',
      description: 'سیاست حفظ حریم خصوصی VicastCam را بخوانید تا بدانید چگونه اطلاعات شخصی را جمع‌آوری، استفاده و محافظت می‌کنیم.',
    },
    tutorial: {
      title: 'مرکز آموزش',
      description: 'یاد بگیرید چگونه VicastCam را دانلود، نصب و استفاده کنید.',
    },
    sdk: {
      title: 'VicastCam SDK',
      description: 'مستندات VicastCam SDK و دانلودهای دمو برای دوربین مجازی، صدای مجازی و انتقال صفحه را بررسی کنید.',
    },
    login: {
      title: 'ورود',
      description: 'وارد حساب VicastCam خود شوید.',
      robots: privateRobots,
    },
    profile: {
      title: 'پروفایل',
      description: 'مرکز پروفایل VicastCam شما.',
      robots: privateRobots,
    },
  },
}

export const getPageSeoCopy = (pageKey, locale = 'zh-CN') => {
  return pageSeoCopy[locale]?.[pageKey] || pageSeoCopy['zh-CN']?.[pageKey] || {}
}

export const setupPageSeo = (pageKey, options = {}) => {
  const { locale, locales } = useI18n()
  const localeHead = useLocaleHead({
    seo: {
      canonicalQueries: [],
    },
  })

  const activeLocaleConfig = computed(() => {
    return locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
  })

  const pageSeo = computed(() => {
    const optionValues = typeof options === 'function' ? options() : unref(options)
    const normalizedOptions = Object.fromEntries(
      Object.entries(optionValues || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )

    return {
      robots: defaultRobots,
      ...getPageSeoCopy(pageKey, locale.value),
      ...normalizedOptions,
    }
  })

  useHead(() => ({
    meta: localeHead.value.meta,
    link: localeHead.value.link,
    htmlAttrs: {
      ...localeHead.value.htmlAttrs,
      dir: activeLocaleConfig.value.dir || 'ltr',
    },
  }))

  useSeoMeta({
    title: () => pageSeo.value.title,
    description: () => pageSeo.value.description,
    robots: () => pageSeo.value.robots,
    ogTitle: () => pageSeo.value.title,
    ogDescription: () => pageSeo.value.description,
    ogType: 'website',
    ogImage: () => pageSeo.value.image || '/images/common/logo.png',
    twitterCard: 'summary_large_image',
    twitterTitle: () => pageSeo.value.title,
    twitterDescription: () => pageSeo.value.description,
    twitterImage: () => pageSeo.value.image || '/images/common/logo.png',
  })
}

// 根据图片路径生成兜底 alt，避免页面图片完全没有替代文本。
export const createImageAlt = (src, fallbackAlt = '') => {
  if (fallbackAlt) {
    return fallbackAlt
  }

  if (!src) {
    return ''
  }

  const fileName = src.split('/').pop().split('?')[0]
  return fileName.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
}
