<template>
  <div class="privacy-page-shell">
    <SiteHeader />

    <main class="privacy-page-main">
      <section class="privacy-hero-section" aria-labelledby="privacy-hero-title">
        <div class="privacy-hero-inner">
          <span class="privacy-hero-eyebrow">{{ policyCenterContent.eyebrow }}</span>

          <h1 id="privacy-hero-title" class="privacy-hero-title">
            <span>VicastCam</span>
            <span class="theme-gradient-text">{{ activePolicy.heroTitle }}</span>
          </h1>

          <p class="privacy-hero-subtitle">
            <span>{{ activePolicy.heroDescription }}</span>
          </p>
        </div>
      </section>

      <div class="page-container privacy-layout">
        <aside class="privacy-sidebar" role="tablist" :aria-label="policyCenterContent.sidebarAriaLabel">
          <button
            v-for="tab in policyTabs"
            :key="tab.key"
            type="button"
            role="tab"
            :aria-selected="tab.key === activePolicyKey"
            :aria-controls="`${tab.key}-policy-panel`"
            :class="['privacy-menu-item', { 'privacy-menu-item-active': tab.key === activePolicyKey }]"
            @click="selectPolicyTab(tab.key)"
          >
            <Icon :name="tab.icon" aria-hidden="true" />
            <span>{{ tab.label }}</span>
            <Icon class="privacy-menu-chevron" name="lucide:chevron-right" aria-hidden="true" />
          </button>
        </aside>

        <article class="privacy-content-card" :aria-labelledby="`${activePolicy.key}-policy-title`">
          <header class="privacy-content-header">
            <nav class="privacy-breadcrumb" :aria-label="policyCenterContent.breadcrumbAriaLabel">
              <span>{{ policyCenterContent.breadcrumbRoot }}</span>
              <Icon name="lucide:chevron-right" aria-hidden="true" />
              <strong>{{ activePolicy.label }}</strong>
            </nav>

            <button type="button" class="privacy-share-button" :aria-label="policyCenterContent.shareLabel">
              <Icon name="lucide:share-2" aria-hidden="true" />
            </button>
          </header>

          <div
            :id="`${activePolicy.key}-policy-panel`"
            class="privacy-article"
            role="tabpanel"
          >
            <h2 :id="`${activePolicy.key}-policy-title`">{{ activePolicy.title }}</h2>

            <p v-if="activePolicy.updatedAt" class="privacy-policy-date">{{ activePolicy.updatedAt }}</p>

            <template v-if="activePolicy.documentBlocks.length">
              <template v-for="(block, blockIndex) in activePolicy.documentBlocks" :key="`${activePolicy.key}-block-${blockIndex}`">
                <h3 v-if="block.type === 'heading'" class="privacy-document-heading">{{ block.text }}</h3>
                <p v-else-if="block.type === 'paragraph'">{{ block.text }}</p>
                <component
                  :is="block.ordered ? 'ol' : 'ul'"
                  v-else-if="block.type === 'list'"
                  class="privacy-document-list"
                >
                  <li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
                </component>
                <div v-else-if="block.type === 'table'" class="privacy-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th v-for="(header, headerIndex) in block.headers" :key="headerIndex" scope="col">{{ header }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                        <td
                          v-for="(cell, cellIndex) in row"
                          :key="cellIndex"
                          :data-label="block.headers[cellIndex] || ''"
                        >
                          {{ cell }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </template>

            <section
              v-else
              v-for="section in activePolicy.sections"
              :key="section.key"
              :id="section.key"
              class="privacy-section"
            >
              <h3>{{ section.title }}</h3>
              <template v-for="(block, blockIndex) in section.blocks" :key="`${section.key}-${blockIndex}`">
                <p v-if="block.type === 'paragraph'">{{ block.text }}</p>
                <div v-else-if="block.type === 'table'" class="privacy-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th v-for="(header, headerIndex) in block.headers" :key="headerIndex" scope="col">{{ header }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                        <td
                          v-for="(cell, cellIndex) in row"
                          :key="cellIndex"
                          :data-label="block.headers[cellIndex] || ''"
                        >
                          {{ cell }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </section>
          </div>
        </article>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from './SiteFooter.vue'
import SiteHeader from './SiteHeader.vue'
import { getAgreements, getGdprs, getMembers, getPrivacys, getRefunds, getSafetys } from '../api/request/strapi'
import { setupPageSeo } from '../utils/seo'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { locale } = useI18n()
const policyCenterContentLocale = useState('policy-center-content-locale', () => '')

const policyCenterCommonCopyMap = {
  'zh-CN': { policyCenter: '政策中心', sidebarAriaLabel: '政策目录', breadcrumbAriaLabel: '当前位置', shareLabel: '分享' },
  'zh-TW': { policyCenter: '政策中心', sidebarAriaLabel: '政策目錄', breadcrumbAriaLabel: '目前位置', shareLabel: '分享' },
  en: { policyCenter: 'Policy Center', sidebarAriaLabel: 'Policy navigation', breadcrumbAriaLabel: 'Breadcrumb', shareLabel: 'Share' },
  id: { policyCenter: 'Pusat Kebijakan', sidebarAriaLabel: 'Navigasi kebijakan', breadcrumbAriaLabel: 'Breadcrumb', shareLabel: 'Bagikan' },
  ms: { policyCenter: 'Pusat Dasar', sidebarAriaLabel: 'Navigasi dasar', breadcrumbAriaLabel: 'Jejak navigasi', shareLabel: 'Kongsi' },
  th: { policyCenter: 'ศูนย์นโยบาย', sidebarAriaLabel: 'เมนูนโยบาย', breadcrumbAriaLabel: 'เส้นทางนำทาง', shareLabel: 'แชร์' },
  vi: { policyCenter: 'Trung tâm chính sách', sidebarAriaLabel: 'Điều hướng chính sách', breadcrumbAriaLabel: 'Đường dẫn điều hướng', shareLabel: 'Chia sẻ' },
  fil: { policyCenter: 'Sentro ng Patakaran', sidebarAriaLabel: 'Nabigasyon ng patakaran', breadcrumbAriaLabel: 'Breadcrumb', shareLabel: 'Ibahagi' },
  es: { policyCenter: 'Centro de políticas', sidebarAriaLabel: 'Navegación de políticas', breadcrumbAriaLabel: 'Ruta de navegación', shareLabel: 'Compartir' },
  pt: { policyCenter: 'Centro de Políticas', sidebarAriaLabel: 'Navegação de políticas', breadcrumbAriaLabel: 'Percurso de navegação', shareLabel: 'Partilhar' },
  ar: { policyCenter: 'مركز السياسات', sidebarAriaLabel: 'التنقل بين السياسات', breadcrumbAriaLabel: 'مسار التنقل', shareLabel: 'مشاركة' },
  ja: { policyCenter: 'ポリシーセンター', sidebarAriaLabel: 'ポリシーナビゲーション', breadcrumbAriaLabel: 'パンくずリスト', shareLabel: '共有' },
  tr: { policyCenter: 'Politika Merkezi', sidebarAriaLabel: 'Politika navigasyonu', breadcrumbAriaLabel: 'İçerik haritası', shareLabel: 'Paylaş' },
  it: { policyCenter: 'Centro norme', sidebarAriaLabel: 'Navigazione delle norme', breadcrumbAriaLabel: 'Percorso di navigazione', shareLabel: 'Condividi' },
  de: { policyCenter: 'Richtliniencenter', sidebarAriaLabel: 'Richtliniennavigation', breadcrumbAriaLabel: 'Brotkrümelnavigation', shareLabel: 'Teilen' },
  fr: { policyCenter: 'Centre des politiques', sidebarAriaLabel: 'Navigation des politiques', breadcrumbAriaLabel: "Fil d'Ariane", shareLabel: 'Partager' },
  ko: { policyCenter: '정책 센터', sidebarAriaLabel: '정책 탐색', breadcrumbAriaLabel: '이동 경로', shareLabel: '공유' },
  ru: { policyCenter: 'Центр политик', sidebarAriaLabel: 'Навигация по политикам', breadcrumbAriaLabel: 'Навигационная цепочка', shareLabel: 'Поделиться' },
  pl: { policyCenter: 'Centrum zasad', sidebarAriaLabel: 'Nawigacja po zasadach', breadcrumbAriaLabel: 'Ścieżka nawigacji', shareLabel: 'Udostępnij' },
  nl: { policyCenter: 'Beleidscentrum', sidebarAriaLabel: 'Beleidsnavigatie', breadcrumbAriaLabel: 'Kruimelpad', shareLabel: 'Delen' },
  hi: { policyCenter: 'नीति केंद्र', sidebarAriaLabel: 'नीति नेविगेशन', breadcrumbAriaLabel: 'नेविगेशन पथ', shareLabel: 'साझा करें' },
  ur: { policyCenter: 'پالیسی مرکز', sidebarAriaLabel: 'پالیسی نیویگیشن', breadcrumbAriaLabel: 'نیویگیشن پاتھ', shareLabel: 'شیئر کریں' },
  bn: { policyCenter: 'নীতিমালা কেন্দ্র', sidebarAriaLabel: 'নীতিমালা নেভিগেশন', breadcrumbAriaLabel: 'নেভিগেশন পথ', shareLabel: 'শেয়ার করুন' },
  fa: { policyCenter: 'مرکز سیاست‌ها', sidebarAriaLabel: 'پیمایش سیاست‌ها', breadcrumbAriaLabel: 'مسیر پیمایش', shareLabel: 'اشتراک‌گذاری' },
}

const getPolicyCenterCommonCopy = currentLocale => policyCenterCommonCopyMap[currentLocale] || policyCenterCommonCopyMap.en

const policyFallbackCopyMap = {
  'zh-CN': {
    terms: { label: '用户协议', heroTitle: '用户许可与使用规则', heroDescription: '了解您下载、安装、注册、登录和使用 VicastCam 时需要遵守的许可规则。' },
    privacy: { label: '隐私政策', heroTitle: '用户隐私与数据保护', heroDescription: '了解我们如何收集、使用、存储、传输、披露和保护您的个人信息。' },
    sales: { label: '会员订阅协议', heroTitle: '会员订阅、付款与退款说明', heroDescription: '了解 VicastCam 会员订阅套餐购买、订单确认、发票、续费相关规则。' },
    refund: { label: '退款规则', heroTitle: '退款规则', heroDescription: '明确会员订阅退费条件、申请流程、时效限制及不予退款情形，规范订单售后全流程处理标准。' },
    'privacy-security': { label: '安全与隐私承诺', heroTitle: '安全与隐私承诺', heroDescription: '公示平台数据安全防护体系、个人信息保护执行标准，郑重承诺合法合规采集、存储与使用用户数据。' },
    gdpr: { label: 'GDPR 与数据保护', heroTitle: 'GDPR 与数据保护', heroDescription: '针对欧盟通用数据保护条例做出专项合规说明，告知欧盟地区用户数据权利、跨境传输规则与行权方式。' },
  },
  'zh-TW': {
    terms: { label: '用戶協議', heroTitle: '用戶許可與使用規則', heroDescription: '了解您下載、安裝、註冊、登入和使用 VicastCam 時需要遵守的許可規則。' },
    privacy: { label: '隱私政策', heroTitle: '用戶隱私與資料保護', heroDescription: '了解我們如何收集、使用、儲存、傳輸、披露和保護您的個人資料。' },
    sales: { label: '會員訂閱協議', heroTitle: '會員訂閱、付款與退款說明', heroDescription: '了解 VicastCam 會員訂閱方案購買、訂單確認、發票及續費相關規則。' },
    refund: { label: '退款規則', heroTitle: '退款規則', heroDescription: '了解會員訂閱退款條件、申請流程、時效限制及不予退款情形，以及訂單售後處理標準。' },
    'privacy-security': { label: '安全與隱私承諾', heroTitle: '安全與隱私承諾', heroDescription: '了解平台資料安全防護體系與個人資料保護標準，以及我們依法收集、儲存和使用用戶資料的承諾。' },
    gdpr: { label: 'GDPR 與資料保護', heroTitle: 'GDPR 與資料保護', heroDescription: '了解歐盟《一般資料保護規則》合規說明、歐盟用戶的資料權利、跨境傳輸規則及權利行使方式。' },
  },
  en: {
    terms: { label: 'User Agreement', heroTitle: 'User License and Usage Rules', heroDescription: 'Learn which license rules apply when you download, install, register, sign in to, and use VicastCam.' },
    privacy: { label: 'Privacy Policy', heroTitle: 'User Privacy and Data Protection', heroDescription: 'Learn how we collect, use, store, transfer, disclose, and protect your personal information.' },
    sales: { label: 'Membership Subscription Agreement', heroTitle: 'Membership Subscriptions and Payments', heroDescription: 'Learn the rules for purchasing VicastCam membership plans, order confirmation, invoices, and renewals.' },
    refund: { label: 'Refund Policy', heroTitle: 'Refund Policy', heroDescription: 'Learn the eligibility requirements, request process, deadlines, exclusions, and after-sales standards for subscription refunds.' },
    'privacy-security': { label: 'Security and Privacy Commitment', heroTitle: 'Security and Privacy Commitment', heroDescription: 'Learn about our data security safeguards, personal information protection standards, and commitment to lawful data handling.' },
    gdpr: { label: 'GDPR and Data Protection', heroTitle: 'GDPR and Data Protection', heroDescription: 'Learn about our GDPR compliance, EEA user rights, international data transfers, and how to exercise your rights.' },
  },
}

const policyHeroDescriptionMap = {
  'zh-CN': Object.fromEntries(Object.entries(policyFallbackCopyMap['zh-CN']).map(([key, copy]) => [key, copy.heroDescription])),
  'zh-TW': Object.fromEntries(Object.entries(policyFallbackCopyMap['zh-TW']).map(([key, copy]) => [key, copy.heroDescription])),
  en: Object.fromEntries(Object.entries(policyFallbackCopyMap.en).map(([key, copy]) => [key, copy.heroDescription])),
  id: {
    terms: 'Pelajari aturan lisensi yang harus Anda patuhi saat mengunduh, menginstal, mendaftar, masuk, dan menggunakan VicastCam.',
    privacy: 'Pelajari cara kami mengumpulkan, menggunakan, menyimpan, mentransfer, mengungkapkan, dan melindungi informasi pribadi Anda.',
    sales: 'Pelajari aturan pembelian paket keanggotaan VicastCam, konfirmasi pesanan, faktur, dan perpanjangan.',
    refund: 'Pelajari syarat, proses pengajuan, batas waktu, pengecualian, dan standar layanan purnajual untuk pengembalian dana langganan.',
    'privacy-security': 'Pelajari sistem keamanan data, standar perlindungan informasi pribadi, dan komitmen kami untuk menangani data pengguna secara sah.',
    gdpr: 'Pelajari kepatuhan GDPR kami, hak data pengguna di Uni Eropa, aturan transfer lintas batas, dan cara menggunakan hak Anda.',
  },
  ms: {
    terms: 'Ketahui peraturan lesen yang perlu anda patuhi semasa memuat turun, memasang, mendaftar, log masuk dan menggunakan VicastCam.',
    privacy: 'Ketahui cara kami mengumpul, menggunakan, menyimpan, memindahkan, mendedahkan dan melindungi maklumat peribadi anda.',
    sales: 'Ketahui peraturan pembelian pelan keahlian VicastCam, pengesahan pesanan, invois dan pembaharuan.',
    refund: 'Ketahui syarat, proses permohonan, had masa, pengecualian dan piawaian selepas jualan bagi bayaran balik langganan.',
    'privacy-security': 'Ketahui sistem keselamatan data, piawaian perlindungan maklumat peribadi dan komitmen kami untuk mengendalikan data pengguna secara sah.',
    gdpr: 'Ketahui pematuhan GDPR kami, hak data pengguna EU, peraturan pemindahan rentas sempadan dan cara melaksanakan hak anda.',
  },
  th: {
    terms: 'เรียนรู้กฎการอนุญาตที่คุณต้องปฏิบัติตามเมื่อดาวน์โหลด ติดตั้ง ลงทะเบียน เข้าสู่ระบบ และใช้ VicastCam',
    privacy: 'เรียนรู้วิธีที่เราเก็บรวบรวม ใช้ จัดเก็บ โอน เปิดเผย และปกป้องข้อมูลส่วนบุคคลของคุณ',
    sales: 'เรียนรู้กฎเกี่ยวกับการซื้อแพ็กเกจสมาชิก VicastCam การยืนยันคำสั่งซื้อ ใบแจ้งหนี้ และการต่ออายุ',
    refund: 'เรียนรู้เงื่อนไข ขั้นตอนการยื่นคำขอ ระยะเวลา ข้อยกเว้น และมาตรฐานบริการหลังการขายสำหรับการคืนเงินค่าสมาชิก',
    'privacy-security': 'เรียนรู้ระบบรักษาความปลอดภัยข้อมูล มาตรฐานการคุ้มครองข้อมูลส่วนบุคคล และคำมั่นของเราในการจัดการข้อมูลผู้ใช้อย่างถูกกฎหมาย',
    gdpr: 'เรียนรู้การปฏิบัติตาม GDPR สิทธิด้านข้อมูลของผู้ใช้ในสหภาพยุโรป กฎการโอนข้อมูลข้ามพรมแดน และวิธีใช้สิทธิของคุณ',
  },
  vi: {
    terms: 'Tìm hiểu các quy tắc cấp phép bạn phải tuân thủ khi tải xuống, cài đặt, đăng ký, đăng nhập và sử dụng VicastCam.',
    privacy: 'Tìm hiểu cách chúng tôi thu thập, sử dụng, lưu trữ, truyền, tiết lộ và bảo vệ thông tin cá nhân của bạn.',
    sales: 'Tìm hiểu quy định về mua gói thành viên VicastCam, xác nhận đơn hàng, hóa đơn và gia hạn.',
    refund: 'Tìm hiểu điều kiện, quy trình yêu cầu, thời hạn, trường hợp loại trừ và tiêu chuẩn hậu mãi đối với hoàn tiền đăng ký.',
    'privacy-security': 'Tìm hiểu hệ thống bảo mật dữ liệu, tiêu chuẩn bảo vệ thông tin cá nhân và cam kết xử lý dữ liệu người dùng hợp pháp của chúng tôi.',
    gdpr: 'Tìm hiểu việc tuân thủ GDPR, quyền dữ liệu của người dùng EU, quy tắc truyền dữ liệu xuyên biên giới và cách thực hiện quyền của bạn.',
  },
  fil: {
    terms: 'Alamin ang mga tuntunin sa lisensya na dapat mong sundin kapag dina-download, ini-install, nirerehistro, sini-sign in, at ginagamit ang VicastCam.',
    privacy: 'Alamin kung paano namin kinokolekta, ginagamit, iniimbak, inililipat, ibinubunyag, at pinoprotektahan ang iyong personal na impormasyon.',
    sales: 'Alamin ang mga tuntunin sa pagbili ng VicastCam membership plan, pagkumpirma ng order, invoice, at renewal.',
    refund: 'Alamin ang mga kundisyon, proseso, deadline, hindi saklaw, at pamantayan ng after-sales para sa refund ng subscription.',
    'privacy-security': 'Alamin ang aming mga pananggalang sa data, pamantayan sa personal na impormasyon, at pangakong legal na pangasiwaan ang data ng user.',
    gdpr: 'Alamin ang aming pagsunod sa GDPR, mga karapatan sa data ng mga user sa EU, paglilipat ng data sa ibang bansa, at paggamit ng iyong mga karapatan.',
  },
  es: {
    terms: 'Conoce las reglas de licencia que debes cumplir al descargar, instalar, registrarte, iniciar sesión y utilizar VicastCam.',
    privacy: 'Conoce cómo recopilamos, usamos, almacenamos, transferimos, divulgamos y protegemos tu información personal.',
    sales: 'Conoce las reglas de compra de planes de membresía de VicastCam, confirmación de pedidos, facturas y renovaciones.',
    refund: 'Conoce los requisitos, el proceso, los plazos, las exclusiones y las normas de posventa para los reembolsos de suscripciones.',
    'privacy-security': 'Conoce nuestras medidas de seguridad de datos, normas de protección de información personal y compromiso con el tratamiento lícito de los datos.',
    gdpr: 'Conoce nuestro cumplimiento del RGPD, los derechos de los usuarios de la UE, las transferencias internacionales y cómo ejercer tus derechos.',
  },
  pt: {
    terms: 'Conheça as regras de licença que deve cumprir ao transferir, instalar, registar-se, iniciar sessão e utilizar o VicastCam.',
    privacy: 'Conheça a forma como recolhemos, utilizamos, armazenamos, transferimos, divulgamos e protegemos os seus dados pessoais.',
    sales: 'Conheça as regras de compra dos planos de membro VicastCam, confirmação de encomendas, faturas e renovações.',
    refund: 'Conheça os requisitos, o processo, os prazos, as exclusões e as normas pós-venda dos reembolsos de subscrições.',
    'privacy-security': 'Conheça as nossas medidas de segurança, normas de proteção de dados pessoais e compromisso com o tratamento lícito dos dados.',
    gdpr: 'Conheça a nossa conformidade com o RGPD, os direitos dos utilizadores da UE, as transferências internacionais e como exercer os seus direitos.',
  },
  ar: {
    terms: 'تعرّف على قواعد الترخيص التي يجب الالتزام بها عند تنزيل VicastCam وتثبيته والتسجيل فيه وتسجيل الدخول إليه واستخدامه.',
    privacy: 'تعرّف على كيفية جمع معلوماتك الشخصية واستخدامها وتخزينها ونقلها والإفصاح عنها وحمايتها.',
    sales: 'تعرّف على قواعد شراء خطط عضوية VicastCam وتأكيد الطلبات والفواتير والتجديد.',
    refund: 'تعرّف على شروط رد رسوم الاشتراك وإجراءات الطلب والمواعيد والاستثناءات ومعايير خدمة ما بعد البيع.',
    'privacy-security': 'تعرّف على نظام أمن البيانات ومعايير حماية المعلومات الشخصية والتزامنا بالتعامل القانوني مع بيانات المستخدمين.',
    gdpr: 'تعرّف على امتثالنا للائحة GDPR وحقوق مستخدمي الاتحاد الأوروبي وقواعد النقل عبر الحدود وكيفية ممارسة حقوقك.',
  },
  ja: {
    terms: 'VicastCam のダウンロード、インストール、登録、ログインおよび利用時に遵守すべきライセンス規則をご確認ください。',
    privacy: '個人情報を収集、利用、保存、移転、開示および保護する方法をご確認ください。',
    sales: 'VicastCam 会員プランの購入、注文確認、請求書および更新に関する規則をご確認ください。',
    refund: '会員登録の返金条件、申請手続、期限、返金対象外となる場合およびアフターサービス基準をご確認ください。',
    'privacy-security': 'データセキュリティ体制、個人情報保護基準、およびユーザーデータを適法に取り扱う当社の取り組みをご確認ください。',
    gdpr: 'GDPR への対応、EU ユーザーのデータに関する権利、越境移転規則および権利行使の方法をご確認ください。',
  },
  tr: {
    terms: 'VicastCam uygulamasını indirirken, kurarken, kaydolurken, oturum açarken ve kullanırken uymanız gereken lisans kurallarını öğrenin.',
    privacy: 'Kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı, sakladığımızı, aktardığımızı, açıkladığımızı ve koruduğumuzu öğrenin.',
    sales: 'VicastCam üyelik planlarının satın alınması, sipariş onayı, faturalar ve yenilemelerle ilgili kuralları öğrenin.',
    refund: 'Abonelik iadelerine ilişkin koşulları, başvuru sürecini, süreleri, istisnaları ve satış sonrası standartları öğrenin.',
    'privacy-security': 'Veri güvenliği sistemimizi, kişisel bilgi koruma standartlarımızı ve kullanıcı verilerini hukuka uygun işleme taahhüdümüzü öğrenin.',
    gdpr: 'GDPR uyumluluğumuzu, AB kullanıcılarının veri haklarını, sınır ötesi aktarım kurallarını ve haklarınızı nasıl kullanacağınızı öğrenin.',
  },
  it: {
    terms: 'Scopri le regole di licenza da rispettare quando scarichi, installi, registri, accedi e utilizzi VicastCam.',
    privacy: 'Scopri come raccogliamo, utilizziamo, conserviamo, trasferiamo, divulghiamo e proteggiamo i tuoi dati personali.',
    sales: 'Scopri le regole per acquisto dei piani VicastCam, conferma degli ordini, fatture e rinnovi.',
    refund: 'Scopri requisiti, procedura, scadenze, esclusioni e standard post-vendita per i rimborsi degli abbonamenti.',
    'privacy-security': 'Scopri le misure di sicurezza, gli standard di protezione dei dati personali e il nostro impegno a trattare legalmente i dati.',
    gdpr: 'Scopri la nostra conformità al GDPR, i diritti degli utenti UE, i trasferimenti internazionali e come esercitare i tuoi diritti.',
  },
  de: {
    terms: 'Informieren Sie sich über die Lizenzregeln für Download, Installation, Registrierung, Anmeldung und Nutzung von VicastCam.',
    privacy: 'Erfahren Sie, wie wir Ihre personenbezogenen Daten erheben, verwenden, speichern, übermitteln, offenlegen und schützen.',
    sales: 'Informieren Sie sich über Kauf, Auftragsbestätigung, Rechnungen und Verlängerung der VicastCam-Mitgliedschaft.',
    refund: 'Informieren Sie sich über Voraussetzungen, Antragsverfahren, Fristen, Ausschlüsse und Kundendienststandards für Abonnementerstattungen.',
    'privacy-security': 'Informieren Sie sich über unsere Datensicherheit, Datenschutzstandards und Verpflichtung zur rechtmäßigen Verarbeitung von Nutzerdaten.',
    gdpr: 'Informieren Sie sich über unsere DSGVO-Konformität, EU-Datenrechte, internationale Übermittlungen und die Ausübung Ihrer Rechte.',
  },
  fr: {
    terms: 'Découvrez les règles de licence à respecter lors du téléchargement, de l’installation, de l’inscription, de la connexion et de l’utilisation de VicastCam.',
    privacy: 'Découvrez comment nous recueillons, utilisons, stockons, transférons, divulguons et protégeons vos informations personnelles.',
    sales: 'Découvrez les règles d’achat des offres VicastCam, de confirmation des commandes, de facturation et de renouvellement.',
    refund: 'Découvrez les conditions, la procédure, les délais, les exclusions et les normes après-vente applicables aux remboursements.',
    'privacy-security': 'Découvrez nos mesures de sécurité, nos normes de protection des données personnelles et notre engagement à traiter les données légalement.',
    gdpr: 'Découvrez notre conformité au RGPD, les droits des utilisateurs de l’UE, les transferts internationaux et comment exercer vos droits.',
  },
  ko: {
    terms: 'VicastCam을 다운로드, 설치, 등록, 로그인 및 사용할 때 준수해야 하는 라이선스 규칙을 알아보세요.',
    privacy: '당사가 개인정보를 수집, 사용, 저장, 전송, 공개 및 보호하는 방법을 알아보세요.',
    sales: 'VicastCam 멤버십 플랜 구매, 주문 확인, 청구서 및 갱신 관련 규칙을 알아보세요.',
    refund: '멤버십 환불 조건, 신청 절차, 기한, 환불 제외 사유 및 판매 후 처리 기준을 알아보세요.',
    'privacy-security': '데이터 보안 체계, 개인정보 보호 기준 및 사용자 데이터를 합법적으로 처리하기 위한 당사의 약속을 알아보세요.',
    gdpr: 'GDPR 준수, EU 사용자의 데이터 권리, 국경 간 전송 규칙 및 권리 행사 방법을 알아보세요.',
  },
  ru: {
    terms: 'Ознакомьтесь с лицензионными правилами, применимыми при скачивании, установке, регистрации, входе и использовании VicastCam.',
    privacy: 'Узнайте, как мы собираем, используем, храним, передаем, раскрываем и защищаем ваши персональные данные.',
    sales: 'Ознакомьтесь с правилами покупки подписки VicastCam, подтверждения заказов, выставления счетов и продления.',
    refund: 'Ознакомьтесь с условиями, процедурой, сроками, исключениями и стандартами обслуживания при возврате средств за подписку.',
    'privacy-security': 'Узнайте о защите данных, стандартах защиты персональной информации и нашем обязательстве законно обрабатывать данные.',
    gdpr: 'Узнайте о соблюдении GDPR, правах пользователей ЕС, трансграничной передаче и порядке реализации ваших прав.',
  },
  pl: {
    terms: 'Poznaj zasady licencji obowiązujące podczas pobierania, instalowania, rejestracji, logowania i korzystania z VicastCam.',
    privacy: 'Dowiedz się, jak gromadzimy, wykorzystujemy, przechowujemy, przekazujemy, ujawniamy i chronimy Twoje dane osobowe.',
    sales: 'Poznaj zasady zakupu planów VicastCam, potwierdzania zamówień, fakturowania i odnawiania subskrypcji.',
    refund: 'Poznaj warunki, procedurę, terminy, wyłączenia i standardy obsługi zwrotów płatności za subskrypcję.',
    'privacy-security': 'Poznaj nasze zabezpieczenia, standardy ochrony danych osobowych i zobowiązanie do zgodnego z prawem przetwarzania danych.',
    gdpr: 'Poznaj naszą zgodność z RODO, prawa użytkowników UE, transfery międzynarodowe i sposób wykonywania swoich praw.',
  },
  nl: {
    terms: 'Lees welke licentieregels gelden wanneer u VicastCam downloadt, installeert, registreert, aanmeldt en gebruikt.',
    privacy: 'Lees hoe wij uw persoonsgegevens verzamelen, gebruiken, opslaan, overdragen, openbaar maken en beschermen.',
    sales: 'Lees de regels voor aankoop van VicastCam-lidmaatschappen, orderbevestiging, facturen en verlenging.',
    refund: 'Lees de voorwaarden, aanvraagprocedure, termijnen, uitsluitingen en nazorgnormen voor terugbetaling van abonnementen.',
    'privacy-security': 'Lees over onze gegevensbeveiliging, privacynormen en toezegging om gebruikersgegevens rechtmatig te verwerken.',
    gdpr: 'Lees over onze AVG-naleving, gegevensrechten van EU-gebruikers, internationale doorgifte en hoe u uw rechten uitoefent.',
  },
  hi: {
    terms: 'VicastCam को डाउनलोड, इंस्टॉल, पंजीकृत, लॉग इन और उपयोग करते समय लागू लाइसेंस नियमों के बारे में जानें।',
    privacy: 'जानें कि हम आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग, संग्रहीत, स्थानांतरित, प्रकट और सुरक्षित करते हैं।',
    sales: 'VicastCam सदस्यता प्लान की खरीद, ऑर्डर पुष्टि, इनवॉइस और नवीनीकरण के नियमों के बारे में जानें।',
    refund: 'सदस्यता रिफंड की शर्तों, आवेदन प्रक्रिया, समय सीमा, अपवादों और बिक्री-पश्चात मानकों के बारे में जानें।',
    'privacy-security': 'हमारी डेटा सुरक्षा व्यवस्था, व्यक्तिगत जानकारी सुरक्षा मानकों और वैध डेटा प्रबंधन प्रतिबद्धता के बारे में जानें।',
    gdpr: 'हमारे GDPR अनुपालन, EU उपयोगकर्ताओं के डेटा अधिकारों, सीमा-पार स्थानांतरण नियमों और अधिकार प्रयोग के तरीके के बारे में जानें।',
  },
  ur: {
    terms: 'VicastCam ڈاؤن لوڈ، انسٹال، رجسٹر، لاگ اِن اور استعمال کرتے وقت قابلِ عمل لائسنس قواعد کے بارے میں جانیں۔',
    privacy: 'جانیں کہ ہم آپ کی ذاتی معلومات کیسے جمع، استعمال، محفوظ، منتقل، ظاہر اور ان کی حفاظت کرتے ہیں۔',
    sales: 'VicastCam رکنیت پلان کی خریداری، آرڈر کی تصدیق، انوائس اور تجدید کے قواعد کے بارے میں جانیں۔',
    refund: 'رکنیت کی رقم واپسی کی شرائط، درخواست کے عمل، مدت، استثنا اور بعد از فروخت معیارات کے بارے میں جانیں۔',
    'privacy-security': 'ہمارے ڈیٹا سکیورٹی نظام، ذاتی معلومات کے تحفظ کے معیارات اور قانونی ڈیٹا استعمال کے عزم کے بارے میں جانیں۔',
    gdpr: 'ہماری GDPR تعمیل، یورپی صارفین کے ڈیٹا حقوق، سرحد پار منتقلی اور اپنے حقوق استعمال کرنے کے طریقے کے بارے میں جانیں۔',
  },
  bn: {
    terms: 'VicastCam ডাউনলোড, ইনস্টল, নিবন্ধন, লগইন ও ব্যবহার করার সময় প্রযোজ্য লাইসেন্সের নিয়মগুলি জানুন।',
    privacy: 'আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ, স্থানান্তর, প্রকাশ ও সুরক্ষিত করি তা জানুন।',
    sales: 'VicastCam সদস্যতা প্ল্যান কেনা, অর্ডার নিশ্চিতকরণ, চালান ও নবায়নের নিয়মগুলি জানুন।',
    refund: 'সদস্যতার অর্থ ফেরতের শর্ত, আবেদন প্রক্রিয়া, সময়সীমা, ব্যতিক্রম এবং বিক্রয়োত্তর মানগুলি জানুন।',
    'privacy-security': 'আমাদের ডেটা নিরাপত্তা ব্যবস্থা, ব্যক্তিগত তথ্য সুরক্ষা মান এবং বৈধভাবে ব্যবহারকারীর ডেটা ব্যবহারের অঙ্গীকার জানুন।',
    gdpr: 'আমাদের GDPR সম্মতি, EU ব্যবহারকারীর ডেটা অধিকার, আন্তঃসীমান্ত স্থানান্তর এবং অধিকার প্রয়োগের উপায় জানুন।',
  },
  fa: {
    terms: 'با قواعد مجوزی که هنگام دانلود، نصب، ثبت‌نام، ورود و استفاده از VicastCam باید رعایت کنید آشنا شوید.',
    privacy: 'با نحوه جمع‌آوری، استفاده، ذخیره‌سازی، انتقال، افشا و حفاظت از اطلاعات شخصی شما آشنا شوید.',
    sales: 'با قواعد خرید طرح‌های عضویت VicastCam، تأیید سفارش، صورتحساب و تمدید آشنا شوید.',
    refund: 'با شرایط، فرایند درخواست، مهلت‌ها، موارد استثنا و استانداردهای پس از فروش بازپرداخت اشتراک آشنا شوید.',
    'privacy-security': 'با سامانه امنیت داده، استانداردهای حفاظت از اطلاعات شخصی و تعهد ما به پردازش قانونی داده‌های کاربران آشنا شوید.',
    gdpr: 'با انطباق ما با GDPR، حقوق داده کاربران اتحادیه اروپا، انتقال برون‌مرزی و روش اعمال حقوق خود آشنا شوید.',
  },
}

const getPolicyFallbackCopy = currentLocale => policyFallbackCopyMap[currentLocale] || policyFallbackCopyMap.en
const getPolicyHeroDescriptions = currentLocale => policyHeroDescriptionMap[currentLocale] || policyHeroDescriptionMap.en

const createDefaultPolicy = ({ key, path, label, icon, title, heroTitle, heroDescription = '' }) => ({
  key,
  path,
  label,
  icon,
  title,
  heroTitle,
  heroDescription,
  updatedAt: '',
  description: '',
  highlights: [],
  sections: [],
  documentBlocks: [],
})

const createDefaultPolicyCenterContent = (currentLocale = locale.value) => {
  const commonCopy = getPolicyCenterCommonCopy(currentLocale)
  const policyCopy = getPolicyFallbackCopy(currentLocale)
  const heroDescriptions = getPolicyHeroDescriptions(currentLocale)
  const createLocalizedPolicy = ({ key, path, icon }) => createDefaultPolicy({
    key,
    path,
    icon,
    label: policyCopy[key].label,
    title: policyCopy[key].label,
    heroTitle: policyCopy[key].heroTitle,
    heroDescription: heroDescriptions[key],
  })

  return {
    eyebrow: commonCopy.policyCenter,
    breadcrumbRoot: commonCopy.policyCenter,
    sidebarAriaLabel: commonCopy.sidebarAriaLabel,
    breadcrumbAriaLabel: commonCopy.breadcrumbAriaLabel,
    shareLabel: commonCopy.shareLabel,
    policies: [
    createLocalizedPolicy({
      key: 'privacy',
      path: '/privacy',
      icon: 'lucide:shield-check',
    }),
    createLocalizedPolicy({
      key: 'gdpr',
      path: '/gdpr-data-protection',
      icon: 'lucide:globe-lock',
    }),
    createLocalizedPolicy({
      key: 'privacy-security',
      path: '/privacy-security',
      icon: 'lucide:shield-check',
    }),
    createLocalizedPolicy({
      key: 'refund',
      path: '/refund-policy',
      icon: 'lucide:badge-dollar-sign',
    }),
    createLocalizedPolicy({
      key: 'terms',
      path: '/terms',
      icon: 'lucide:file-check-2',
    }),
    createLocalizedPolicy({
      key: 'sales',
      path: '/sales-policy',
      icon: 'lucide:receipt-text',
    }),
    ],
  }
}

const policyCenterContent = useState('policy-center-content', createDefaultPolicyCenterContent)

const policyDisplayOrder = ['terms', 'privacy', 'sales', 'refund', 'privacy-security', 'gdpr']

const defaultPolicyPathMap = {
  privacy: '/privacy',
  terms: '/terms',
  sales: '/sales-policy',
  gdpr: '/gdpr-data-protection',
  refund: '/refund-policy',
  'privacy-security': '/privacy-security',
}

const routePolicyKeyMap = {
  privacy: 'privacy',
  terms: 'terms',
  'sales-policy': 'sales',
  'gdpr-data-protection': 'gdpr',
  'refund-policy': 'refund',
  refund: 'refund',
  'privacy-security': 'privacy-security',
}

const parseStrapiJsonField = (value) => {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const normalizeStrapiRecord = (record) => {
  if (!record || typeof record !== 'object') {
    return {}
  }

  const recordData = record.privacys ||
    record.privacy ||
    record.attributes?.privacys ||
    record.attributes?.privacy ||
    record.attributes ||
    record

  return {
    ...recordData,
    ...(recordData.attributes || {}),
  }
}

// The Strapi privacy type is scoped to the privacy page. Keep this extractor
// tolerant of both the current single-record response and the old JSON shape.
const getPrivacyPolicySource = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || response || {})
  const fieldValue = record.privacyPolicy ||
    record.privacy_policy ||
    record.privacy ||
    record.policyCenter ||
    record.policy_center ||
    record.policycenter ||
    record.content ||
    record.data ||
    record
  const parsedValue = parseStrapiJsonField(fieldValue)

  const extractedValue = parsedValue?.privacy ||
    parsedValue?.privacyPolicy ||
    parsedValue?.policyCenter?.privacy ||
    parsedValue?.data?.privacy ||
    parsedValue?.data?.privacyPolicy ||
    parsedValue?.data?.policyCenter?.privacy ||
    parsedValue?.policyCenter ||
    parsedValue?.data?.policyCenter ||
    parsedValue?.data ||
    parsedValue ||
    {}

  // A plain-text content field is still a valid privacy record; retain the
  // surrounding record so title and metadata are not discarded.
  return typeof extractedValue === 'object' && extractedValue !== null
    ? extractedValue
    : record
}

const getGdprPolicySource = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || response || {})
  const fieldValue = record.gdprPolicy ||
    record.gdpr_policy ||
    record.gdprs ||
    record.gdpr ||
    record.content ||
    record.data ||
    record
  const parsedValue = parseStrapiJsonField(fieldValue)
  const extractedValue = parsedValue?.gdpr ||
    parsedValue?.gdprs ||
    parsedValue?.gdprPolicy ||
    parsedValue?.policyCenter?.gdpr ||
    parsedValue?.data?.gdpr ||
    parsedValue?.data?.gdprs ||
    parsedValue?.data?.gdprPolicy ||
    parsedValue?.data?.policyCenter?.gdpr ||
    parsedValue?.data ||
    parsedValue ||
    {}

  return typeof extractedValue === 'object' && extractedValue !== null
    ? extractedValue
    : record
}

const getSafetyPolicySource = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || response || {})
  const fieldValue = record.safetyPolicy ||
    record.safety_policy ||
    record.safetys ||
    record.safety ||
    record.content ||
    record.data ||
    record
  const parsedValue = parseStrapiJsonField(fieldValue)
  const extractedValue = parsedValue?.safety ||
    parsedValue?.safetys ||
    parsedValue?.safetyPolicy ||
    parsedValue?.policyCenter?.privacySecurity ||
    parsedValue?.data?.safety ||
    parsedValue?.data?.safetys ||
    parsedValue?.data?.safetyPolicy ||
    parsedValue?.data?.policyCenter?.privacySecurity ||
    parsedValue?.data ||
    parsedValue ||
    {}

  return typeof extractedValue === 'object' && extractedValue !== null
    ? extractedValue
    : record
}

const getRefundPolicySource = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || response || {})
  const fieldValue = record.refundPolicy ||
    record.refund_policy ||
    record.refunds ||
    record.refund ||
    record.content ||
    record.data ||
    record
  const parsedValue = parseStrapiJsonField(fieldValue)
  const extractedValue = parsedValue?.refund ||
    parsedValue?.refunds ||
    parsedValue?.refundPolicy ||
    parsedValue?.policyCenter?.refund ||
    parsedValue?.data?.refund ||
    parsedValue?.data?.refunds ||
    parsedValue?.data?.refundPolicy ||
    parsedValue?.data?.policyCenter?.refund ||
    parsedValue?.data ||
    parsedValue ||
    {}

  return typeof extractedValue === 'object' && extractedValue !== null
    ? extractedValue
    : record
}

// Agreements use the same page-level data shape as privacy, but populate only
// the user-agreement route.
const getAgreementPolicySource = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || response || {})
  const fieldValue = record.agreementPolicy ||
    record.agreement_policy ||
    record.agreement ||
    record.agreements ||
    record.content ||
    record.data ||
    record
  const parsedValue = parseStrapiJsonField(fieldValue)
  const extractedValue = parsedValue?.agreement ||
    parsedValue?.agreementPolicy ||
    parsedValue?.agreements ||
    parsedValue?.policyCenter?.terms ||
    parsedValue?.data?.agreement ||
    parsedValue?.data?.agreementPolicy ||
    parsedValue?.data?.agreements ||
    parsedValue?.data?.policyCenter?.terms ||
    parsedValue?.data ||
    parsedValue ||
    {}

  return typeof extractedValue === 'object' && extractedValue !== null
    ? extractedValue
    : record
}

// Members contains the subscription agreement page content. Accept both the
// current member record shape and the legacy policy-center JSON shape.
const getMemberPolicySource = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || response || {})
  const fieldValue = record.memberPolicy ||
    record.member_policy ||
    record.members ||
    record.member ||
    record.content ||
    record.data ||
    record
  const parsedValue = parseStrapiJsonField(fieldValue)
  const extractedValue = parsedValue?.member ||
    parsedValue?.members ||
    parsedValue?.memberPolicy ||
    parsedValue?.subscriptionAgreement ||
    parsedValue?.policyCenter?.sales ||
    parsedValue?.data?.member ||
    parsedValue?.data?.members ||
    parsedValue?.data?.memberPolicy ||
    parsedValue?.data?.subscriptionAgreement ||
    parsedValue?.data?.policyCenter?.sales ||
    parsedValue?.data ||
    parsedValue ||
    {}

  return typeof extractedValue === 'object' && extractedValue !== null
    ? extractedValue
    : record
}

const normalizeString = value => String(value ?? '').trim()

const normalizeParagraphs = value => {
  if (Array.isArray(value)) {
    return value.map(paragraph => normalizeString(paragraph)).filter(Boolean)
  }

  const text = normalizeString(value)

  return text ? [text] : []
}

const normalizeHighlights = highlights => Array.isArray(highlights)
  ? highlights.map((highlight = {}) => ({
      title: normalizeString(highlight.title),
      text: normalizeString(highlight.text),
      icon: normalizeString(highlight.icon) || 'lucide:info',
    })).filter(highlight => highlight.title || highlight.text)
  : []

const normalizeSectionBlocks = (paragraphs) => {
  const normalizedParagraphs = normalizeParagraphs(paragraphs)
  const blocks = []

  for (let index = 0; index < normalizedParagraphs.length; index += 1) {
    const paragraph = normalizedParagraphs[index]
    const isTableMarker = ['表格', 'table'].includes(paragraph.toLowerCase())
    const firstTableRow = normalizedParagraphs[index + 1]

    if (isTableMarker && firstTableRow?.includes('\t')) {
      const tableRows = []
      let rowIndex = index + 1

      while (rowIndex < normalizedParagraphs.length && normalizedParagraphs[rowIndex].includes('\t')) {
        tableRows.push(normalizedParagraphs[rowIndex].split('\t').map(cell => normalizeString(cell)))
        rowIndex += 1
      }

      const [headers = [], ...rows] = tableRows
      blocks.push({ type: 'table', headers, rows })
      index = rowIndex - 1
      continue
    }

    blocks.push({ type: 'paragraph', text: paragraph })
  }

  return blocks
}

const normalizeSections = sections => Array.isArray(sections)
  ? sections.map((section = {}, sectionIndex) => {
      const paragraphs = normalizeParagraphs(section.paragraphs)

      return {
        key: normalizeString(section.key) || `policy-section-${sectionIndex + 1}`,
        title: normalizeString(section.title),
        paragraphs,
        blocks: normalizeSectionBlocks(paragraphs),
      }
    }).filter(section => section.title || section.paragraphs.length)
  : []

const normalizePolicy = (policy = {}, index) => {
  const key = normalizeString(policy.key) || `policy-${index + 1}`
  const defaultPolicy = createDefaultPolicy({
    key,
    path: defaultPolicyPathMap[key] || `/${key}`,
    label: policy.label || policy.title || key,
    icon: 'lucide:file-text',
    title: policy.title || policy.label || key,
    heroTitle: policy.heroTitle || policy.hero_title || policy.title || policy.label || key,
  })

  return {
    ...defaultPolicy,
    path: normalizeString(policy.path) || defaultPolicy.path,
    label: normalizeString(policy.label) || defaultPolicy.label,
    icon: normalizeString(policy.icon) || defaultPolicy.icon,
    title: normalizeString(policy.title) || defaultPolicy.title,
    heroTitle: normalizeString(policy.heroTitle || policy.hero_title) || defaultPolicy.heroTitle,
    heroDescription: normalizeString(policy.heroDescription || policy.hero_description),
    updatedAt: normalizeString(policy.updatedAt || policy.updated_at),
    description: normalizeString(policy.description),
    highlights: normalizeHighlights(policy.highlights),
    sections: normalizeSections(policy.sections),
    documentBlocks: Array.isArray(policy.documentBlocks) ? policy.documentBlocks : [],
  }
}

const getRemotePolicy = (source, key, path) => {
  if (!source || typeof source !== 'object') {
    return null
  }

  const legacyPolicy = Array.isArray(source.policies)
    ? source.policies.find(policy => normalizeString(policy?.key) === key)
    : null
  const policySource = legacyPolicy || source
  const hasPolicyContent = Object.keys(policySource).some(field => [
    'title', 'label', 'heroTitle', 'hero_title', 'heroDescription', 'hero_description', 'description', 'sections',
    'documentBlocks', 'content', 'updatedAt', 'updated_at',
  ].includes(field))

  return hasPolicyContent
    ? normalizePolicy({ ...policySource, key, path })
    : null
}

const normalizePolicyCenterContent = (source = {}, currentLocale = locale.value) => {
  const fallback = createDefaultPolicyCenterContent(currentLocale)
  const privacySource = source.privacy && typeof source.privacy === 'object'
    ? source.privacy
    : {}
  const gdprSource = source.gdpr && typeof source.gdpr === 'object'
    ? source.gdpr
    : {}
  const safetySource = source.safety && typeof source.safety === 'object'
    ? source.safety
    : {}
  const refundSource = source.refund && typeof source.refund === 'object'
    ? source.refund
    : {}
  const agreementSource = source.agreement && typeof source.agreement === 'object'
    ? source.agreement
    : {}
  const memberSource = source.member && typeof source.member === 'object'
    ? source.member
    : {}
  const remotePolicies = new Map([
    ['privacy', getRemotePolicy(privacySource, 'privacy', '/privacy')],
    ['gdpr', getRemotePolicy(gdprSource, 'gdpr', '/gdpr-data-protection')],
    ['privacy-security', getRemotePolicy(safetySource, 'privacy-security', '/privacy-security')],
    ['refund', getRemotePolicy(refundSource, 'refund', '/refund-policy')],
    ['terms', getRemotePolicy(agreementSource, 'terms', '/terms')],
    ['sales', getRemotePolicy(memberSource, 'sales', '/sales-policy')],
  ])
  const policies = fallback.policies.map(policy => {
    const remotePolicy = remotePolicies.get(policy.key)

    if (!remotePolicy) {
      return policy
    }

    return {
      ...policy,
      ...remotePolicy,
      path: remotePolicy.path || policy.path,
      label: remotePolicy.label || policy.label,
      icon: remotePolicy.icon || policy.icon,
      title: remotePolicy.title || policy.title,
      heroTitle: remotePolicy.heroTitle || policy.heroTitle,
      // Hero summaries are product copy maintained locally for every locale.
      heroDescription: policy.heroDescription,
    }
  })

  return {
    eyebrow: normalizeString(source.eyebrow) || fallback.eyebrow,
    breadcrumbRoot: normalizeString(source.breadcrumbRoot || source.breadcrumb_root) || fallback.breadcrumbRoot,
    sidebarAriaLabel: normalizeString(source.sidebarAriaLabel || source.sidebar_aria_label) || fallback.sidebarAriaLabel,
    breadcrumbAriaLabel: normalizeString(source.breadcrumbAriaLabel || source.breadcrumb_aria_label) || fallback.breadcrumbAriaLabel,
    shareLabel: normalizeString(source.shareLabel || source.share_label) || fallback.shareLabel,
    policies,
  }
}

const syncPolicyCenterContent = ([privacyResponse, gdprResponse, safetyResponse, refundResponse, agreementResponse, memberResponse], currentLocale) => {
  policyCenterContent.value = normalizePolicyCenterContent({
    privacy: getPrivacyPolicySource(privacyResponse),
    gdpr: getGdprPolicySource(gdprResponse),
    safety: getSafetyPolicySource(safetyResponse),
    refund: getRefundPolicySource(refundResponse),
    agreement: getAgreementPolicySource(agreementResponse),
    member: getMemberPolicySource(memberResponse),
  }, currentLocale)
}

const resetPolicyCenterContent = (currentLocale = locale.value) => {
  policyCenterContent.value = createDefaultPolicyCenterContent(currentLocale)
}

useLocalizedAsyncState({
  locale,
  loadedLocale: policyCenterContentLocale,
  load: currentLocale => Promise.all([
    getPrivacys(currentLocale).catch(() => null),
    getGdprs(currentLocale).catch(() => null),
    getSafetys(currentLocale).catch(() => null),
    getRefunds(currentLocale).catch(() => null),
    getAgreements(currentLocale).catch(() => null),
    getMembers(currentLocale).catch(() => null),
  ]),
  sync: (response, currentLocale) => {
    syncPolicyCenterContent(response, currentLocale)
  },
  reset: currentLocale => {
    resetPolicyCenterContent(currentLocale)
  },
})

const policyTabs = computed(() => [...policyCenterContent.value.policies].sort((left, right) => {
  const leftIndex = policyDisplayOrder.indexOf(left.key)
  const rightIndex = policyDisplayOrder.indexOf(right.key)

  return (leftIndex === -1 ? policyDisplayOrder.length : leftIndex) -
    (rightIndex === -1 ? policyDisplayOrder.length : rightIndex)
}))
const policyKeySet = computed(() => new Set(policyTabs.value.map(tab => tab.key)))
const getSingleQueryValue = value => Array.isArray(value) ? value[0] : value

const normalizePolicyKey = value => {
  const key = String(value || '').trim()

  return policyKeySet.value.has(key) ? key : 'privacy'
}

const getRoutePolicyKey = () => {
  const routeSegment = route.path.split('/').filter(Boolean).pop() || 'privacy'

  return routePolicyKeyMap[routeSegment] || 'privacy'
}

const activePolicyKey = computed(() => {
  return getRoutePolicyKey()
})

const activePolicy = computed(() => {
  return policyTabs.value.find(tab => tab.key === activePolicyKey.value) || policyTabs.value[0] || createDefaultPolicy({
    key: 'privacy',
    path: '/privacy',
    label: '隐私政策',
    icon: 'lucide:shield-check',
    title: '隐私政策',
    heroTitle: '用户隐私与数据保护',
  })
})

const selectPolicyTab = (key) => {
  const targetKey = normalizePolicyKey(key)
  const targetPolicy = policyTabs.value.find(tab => tab.key === targetKey) || policyTabs.value[0]

  if (!targetPolicy) {
    return
  }

  const targetPath = localePath(targetPolicy.path)

  if (route.path === targetPath && !route.query.tab) {
    return
  }

  router.push(targetPath)
}

onMounted(() => {
  const legacyQueryKey = getSingleQueryValue(route.query.tab)

  if (!legacyQueryKey) {
    return
  }

  const targetKey = normalizePolicyKey(legacyQueryKey)
  const targetPolicy = policyTabs.value.find(tab => tab.key === targetKey)

  if (targetPolicy) {
    router.replace(localePath(targetPolicy.path))
  }
})

setupPageSeo(activePolicyKey, () => ({
  title: activePolicy.value.title,
  description: activePolicy.value.description || activePolicy.value.heroDescription,
}))
</script>

<style scoped>
.privacy-page-shell {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;
  padding-top: var(--page-header-height);
  color: var(--theme-text);
  background: var(--theme-route-page-background, var(--page-route-background));
}

.privacy-page-main {
  width: 100%;
  flex: 1;
  background: var(--theme-route-page-background, var(--page-route-background));
}

.privacy-hero-section {
  width: 100%;
  display: flex;
  justify-content: center;
  color: var(--theme-route-card-title, var(--theme-white));
  background:
    radial-gradient(circle at 50% 42%, var(--theme-extra-14-165-233-018), transparent 34%),
    linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-extra-13-22-39-1) 100%);
  border-bottom: none;
}

@media (min-width: 901px) {
  :root[data-theme="light"] .privacy-hero-section {
    background: url("https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/common/light-page-hero-bg.png") center / cover no-repeat;
  }
}

.privacy-hero-inner {
  width: min(100%, var(--page-max-width));
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 34px var(--page-padding-x) 32px;
  text-align: center;
}

.privacy-hero-eyebrow {
  min-width: 76px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid var(--theme-primary-border);
  border-radius: 999px;
  color: var(--theme-primary-light);
  background: var(--theme-primary-softer);
  font-size: 12px;
  line-height: 1;
}

.privacy-hero-title {
  max-width: 100%;
  margin-top: 18px;
  font-size: 42px;
  font-weight: 900;
  line-height: 52px;
  overflow-wrap: anywhere;
}

.privacy-hero-title span {
  display: block;
}

.privacy-hero-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 14px;
  line-height: 22px;
  overflow-wrap: anywhere;
}

.privacy-layout {
  display: grid;
  grid-template-columns: 266px 830px;
  justify-content: center;
  align-items: start;
  gap: 20px;
  padding-top: 32px;
  padding-bottom: 84px;
}

.privacy-sidebar {
  width: 266px;
  height: fit-content;
  display: grid;
  gap: 0;
  overflow: hidden;
  padding: 8px;
  border: 1px solid var(--theme-route-card-border, var(--theme-border-panel));
  border-radius: var(--theme-route-card-radius, 15px);
  background: var(--theme-route-card-background, var(--theme-surface-soft-90));
  box-shadow: var(--theme-route-card-shadow, 0 20px 48px var(--theme-black-18));
}

.privacy-menu-item {
  width: 100%;
  min-height: 48px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border-radius: 8px;
  color: var(--theme-text-muted);
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
}

.privacy-menu-item svg {
  width: 16px;
  height: 16px;
}

.privacy-menu-item span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.privacy-menu-chevron {
  color: var(--theme-text-muted-soft);
}

.privacy-menu-item-active {
  color: var(--theme-accent);
  background: var(--theme-sdk-sidebar-active-background, var(--theme-extra-14-116-144-045));
}

.privacy-menu-item-active .privacy-menu-chevron {
  color: var(--theme-accent);
}

.privacy-content-card {
  width: 830px;
  min-width: 0;
  min-height: 680px;
  padding: 22px 24px 38px;
  border: 1px solid var(--theme-route-card-border, var(--theme-border-panel-soft));
  border-radius: var(--theme-route-card-radius, 15px);
  background: var(--theme-route-card-background, var(--theme-surface-soft-88));
  box-shadow: var(--theme-route-card-shadow, 0 24px 56px var(--theme-black-18));
}

.privacy-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--theme-border-muted-70);
}

.privacy-breadcrumb {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--theme-text-muted);
  font-size: 14px;
  line-height: 20px;
}

.privacy-breadcrumb span,
.privacy-breadcrumb strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.privacy-breadcrumb svg {
  width: 11px;
  height: 11px;
  flex: 0 0 auto;
}

.privacy-breadcrumb strong {
  color: var(--theme-route-card-title, var(--theme-white-90));
  font-weight: 600;
}

.privacy-share-button {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 6px;
  color: var(--theme-text-muted);
  cursor: pointer;
}

.privacy-share-button svg {
  width: 15px;
  height: 15px;
}

.privacy-article {
  padding-top: 28px;
  color: var(--theme-text-muted);
}

.privacy-article h2 {
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 30px;
  font-weight: 900;
  line-height: 42px;
}

.privacy-section {
  margin-top: 18px;
}

.privacy-section h3 {
  margin-bottom: 8px;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 18px;
  font-weight: 800;
  line-height: 28px;
}

.privacy-section h3:empty {
  display: none;
}

.privacy-policy-date {
  margin-top: 8px;
  color: var(--theme-text-muted-soft);
  font-size: 13px;
  line-height: 22px;
}

.privacy-article > p:not(.privacy-policy-date) {
  margin-top: 14px;
  color: var(--theme-text-muted);
  font-size: 14px;
  line-height: 24px;
}

.privacy-document-heading {
  margin-top: 24px;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 18px;
  font-weight: 800;
  line-height: 28px;
}

.privacy-document-list {
  display: grid;
  gap: 7px;
  margin-top: 12px;
  padding-left: 24px;
  color: var(--theme-text-muted);
  font-size: 14px;
  line-height: 24px;
}

.privacy-document-list li {
  padding-left: 3px;
}

.privacy-document-list:is(ul) {
  list-style: disc;
}

.privacy-document-list:is(ol) {
  list-style: decimal;
}

.privacy-table-wrap {
  width: 100%;
  overflow-x: auto;
  margin-top: 14px;
  border: 1px solid var(--theme-border-muted-70);
  border-radius: 6px;
}

.privacy-table-wrap table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  color: var(--theme-text-muted);
  font-size: 13px;
  line-height: 21px;
}

.privacy-table-wrap th,
.privacy-table-wrap td {
  padding: 10px 12px;
  border-right: 1px solid var(--theme-border-muted-70);
  border-bottom: 1px solid var(--theme-border-muted-70);
  text-align: left;
  vertical-align: top;
  overflow-wrap: anywhere;
  word-break: normal;
  white-space: normal;
}

.privacy-table-wrap th {
  color: var(--theme-route-card-title, var(--theme-white));
  background: var(--theme-sdk-sidebar-active-background, var(--theme-extra-14-116-144-045));
  font-weight: 700;
}

.privacy-table-wrap th:last-child,
.privacy-table-wrap td:last-child {
  border-right: 0;
}

.privacy-table-wrap tbody tr:last-child td {
  border-bottom: 0;
}

.privacy-section p {
  color: var(--theme-text-muted);
  font-size: 14px;
  line-height: 24px;
}

.privacy-section p + p {
  margin-top: 14px;
}

@media (max-width: 900px) {
  .privacy-hero-section {
    display: none;
  }

  .privacy-layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 22px;
    padding-bottom: 44px;
  }

  .privacy-sidebar {
    width: 100%;
    height: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .privacy-content-card {
    width: 100%;
    min-height: 0;
    padding: 20px 16px 30px;
  }

  .privacy-hero-inner {
    min-height: 360px;
    padding-top: 28px;
  }

  .privacy-hero-title {
    font-size: 32px;
    line-height: 40px;
  }
}

@media (max-width: 520px) {
  .privacy-sidebar {
    grid-template-columns: 1fr;
  }

  .privacy-content-header {
    align-items: flex-start;
  }

  .privacy-breadcrumb {
    flex-wrap: wrap;
  }

  .privacy-article h2 {
    font-size: 24px;
    line-height: 32px;
  }

  .privacy-table-wrap {
    overflow: hidden;
    border: 0;
    border-radius: 0;
  }

  .privacy-table-wrap table,
  .privacy-table-wrap tbody,
  .privacy-table-wrap tr,
  .privacy-table-wrap td {
    display: block;
    width: 100%;
  }

  .privacy-table-wrap thead {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .privacy-table-wrap tbody tr {
    overflow: hidden;
    border: 1px solid var(--theme-border-muted-70);
    border-radius: 6px;
  }

  .privacy-table-wrap tbody tr + tr {
    margin-top: 12px;
  }

  .privacy-table-wrap td {
    display: grid;
    grid-template-columns: minmax(88px, 32%) minmax(0, 1fr);
    gap: 12px;
    padding: 10px 12px;
    border-right: 0;
  }

  .privacy-table-wrap td::before {
    content: attr(data-label);
    color: var(--theme-route-card-title, var(--theme-white));
    font-weight: 700;
    overflow-wrap: anywhere;
  }
}
</style>
