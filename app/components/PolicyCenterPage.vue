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

            <section
              v-for="section in activePolicy.sections"
              :key="section.key"
              :id="section.key"
              class="privacy-section"
            >
              <h3>{{ section.title }}</h3>
              <p v-for="(paragraph, paragraphIndex) in section.paragraphs" :key="`${section.key}-${paragraphIndex}`">{{ paragraph }}</p>
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
import { getPrivacys } from '../api/request/strapi'
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

const createDefaultPolicy = ({ key, path, label, icon, title, heroTitle }) => ({
  key,
  path,
  label,
  icon,
  title,
  heroTitle,
  heroDescription: '',
  updatedAt: '',
  description: '',
  highlights: [],
  sections: [],
})

const createDefaultPolicyCenterContent = (currentLocale = locale.value) => ({
  eyebrow: getPolicyCenterCommonCopy(currentLocale).policyCenter,
  breadcrumbRoot: getPolicyCenterCommonCopy(currentLocale).policyCenter,
  sidebarAriaLabel: getPolicyCenterCommonCopy(currentLocale).sidebarAriaLabel,
  breadcrumbAriaLabel: getPolicyCenterCommonCopy(currentLocale).breadcrumbAriaLabel,
  shareLabel: getPolicyCenterCommonCopy(currentLocale).shareLabel,
  policies: [
    createDefaultPolicy({
      key: 'privacy',
      path: '/privacy',
      label: '隐私政策',
      icon: 'lucide:shield-check',
      title: '隐私政策',
      heroTitle: '用户隐私与数据保护',
    }),
    createDefaultPolicy({
      key: 'terms',
      path: '/terms',
      label: '用户协议',
      icon: 'lucide:file-check-2',
      title: '用户协议',
      heroTitle: '用户许可与使用规则',
    }),
    createDefaultPolicy({
      key: 'sales',
      path: '/sales-policy',
      label: '销售政策',
      icon: 'lucide:receipt-text',
      title: '销售政策',
      heroTitle: '订阅、付款与退款说明',
    }),
  ],
})

const policyCenterContent = useState('policy-center-content', createDefaultPolicyCenterContent)

const defaultPolicyPathMap = {
  privacy: '/privacy',
  terms: '/terms',
  sales: '/sales-policy',
}

const routePolicyKeyMap = {
  privacy: 'privacy',
  terms: 'terms',
  'sales-policy': 'sales',
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

const getPolicyCenterSource = (response) => {
  const responseData = response?.data
  const firstRecord = Array.isArray(responseData)
    ? responseData[0]
    : responseData
  const record = normalizeStrapiRecord(firstRecord || response || {})
  const fieldValue = record.policyCenter ||
    record.policy_center ||
    record.policycenter ||
    record.content ||
    record.data ||
    record
  const parsedValue = parseStrapiJsonField(fieldValue)

  return parsedValue?.policyCenter || parsedValue?.data?.policyCenter || parsedValue?.data || parsedValue || {}
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

const normalizeSections = sections => Array.isArray(sections)
  ? sections.map((section = {}, sectionIndex) => ({
      key: normalizeString(section.key) || `policy-section-${sectionIndex + 1}`,
      title: normalizeString(section.title),
      paragraphs: normalizeParagraphs(section.paragraphs),
    })).filter(section => section.title || section.paragraphs.length)
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
  }
}

const normalizePolicyCenterContent = (source = {}) => {
  const fallback = createDefaultPolicyCenterContent()
  const policies = Array.isArray(source.policies)
    ? source.policies.map(normalizePolicy).filter(policy => policy.key)
    : []

  return {
    eyebrow: normalizeString(source.eyebrow) || fallback.eyebrow,
    breadcrumbRoot: normalizeString(source.breadcrumbRoot || source.breadcrumb_root) || fallback.breadcrumbRoot,
    sidebarAriaLabel: normalizeString(source.sidebarAriaLabel || source.sidebar_aria_label) || fallback.sidebarAriaLabel,
    breadcrumbAriaLabel: normalizeString(source.breadcrumbAriaLabel || source.breadcrumb_aria_label) || fallback.breadcrumbAriaLabel,
    shareLabel: normalizeString(source.shareLabel || source.share_label) || fallback.shareLabel,
    policies: policies.length ? policies : fallback.policies,
  }
}

const syncPolicyCenterContent = (response) => {
  policyCenterContent.value = normalizePolicyCenterContent(getPolicyCenterSource(response))
}

const resetPolicyCenterContent = () => {
  policyCenterContent.value = createDefaultPolicyCenterContent()
}

useLocalizedAsyncState({
  locale,
  loadedLocale: policyCenterContentLocale,
  load: currentLocale => getPrivacys(currentLocale),
  sync: response => {
    syncPolicyCenterContent(response)
  },
  reset: () => {
    resetPolicyCenterContent()
  },
})

const policyTabs = computed(() => policyCenterContent.value.policies)
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
    background: url("/images/common/light-page-hero-bg.png") center / cover no-repeat;
  }
}

.privacy-hero-inner {
  width: min(100%, var(--page-max-width));
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.privacy-section p {
  color: var(--theme-text-muted);
  font-size: 14px;
  line-height: 24px;
}

.privacy-section p + p {
  margin-top: 14px;
}

@media (max-width: 900px) {
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
}
</style>
