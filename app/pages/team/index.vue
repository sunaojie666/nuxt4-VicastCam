<template>
  <div class="team-page-shell">
    <SiteHeader />

    <main class="team-page-main">
      <section class="team-hero-section" aria-labelledby="team-hero-title">
        <div class="page-container team-hero-inner">
          <span class="team-hero-eyebrow">{{ teamBox.hero.eyebrow }}</span>

          <h1 id="team-hero-title" class="team-hero-title">
            <span>{{ teamBox.hero.title }}</span>
            <span class="theme-gradient-text team-hero-title-highlight">
              {{ teamBox.hero.highlight }}
              <img class="team-hero-title-line" src="/images/common/title-underline.png" alt="" aria-hidden="true" role="presentation">
            </span>
          </h1>

          <p class="team-hero-description">
            {{ teamBox.hero.description }}
          </p>

          <div class="team-hero-actions">
            <button class="team-hero-button team-hero-button-primary" type="button" @click="scrollToApplication">{{ teamBox.hero.actions.primary }}</button>
            <button class="team-hero-button team-hero-button-secondary" type="button" @click="scrollToAdvantages">{{ teamBox.hero.actions.secondary }}</button>
          </div>
        </div>
      </section>

      <section id="team-cooperation-advantages" class="team-advantages-section" aria-labelledby="team-advantages-title">
        <div class="page-container team-advantages-inner">
          <span class="team-section-eyebrow">{{ teamBox.advantages.eyebrow }}</span>

          <h2 id="team-advantages-title" class="team-section-title">
            <span>{{ teamBox.advantages.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.advantages.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.advantages.description }}
          </p>

          <div class="team-advantage-grid">
            <article
              v-for="item in advantageItems"
              :key="item.title"
              class="team-advantage-card"
            >
              <span class="team-advantage-icon" aria-hidden="true">
                <img v-if="item.icon" :src="item.icon" alt="" role="presentation">
              </span>
              <div class="team-advantage-content">
                <h3>{{ item.title }}</h3>
                <span class="team-advantage-line" aria-hidden="true"></span>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="team-rules-section" aria-labelledby="team-rules-title">
        <div class="page-container team-rules-inner">
          <span class="team-section-eyebrow">{{ teamBox.rules.eyebrow }}</span>

          <h2 id="team-rules-title" class="team-section-title">
            <span>{{ teamBox.rules.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.rules.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.rules.description }}
          </p>

          <div class="team-rules-grid">
            <section class="team-rule-panel team-rule-panel-blue" aria-labelledby="team-agent-level-title">
              <h3 id="team-agent-level-title">{{ teamBox.rules.agentLevelTitle }}</h3>

              <div class="team-agent-level-list">
                <article v-for="item in agentLevels" :key="item.title" class="team-agent-level-item">
                  <img :src="item.icon" alt="" aria-hidden="true" role="presentation">
                  <div>
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                </article>
              </div>
            </section>

            <section class="team-rule-panel team-rule-panel-purple" aria-labelledby="team-settlement-title">
              <h3 id="team-settlement-title">{{ teamBox.rules.settlementTitle }}</h3>

              <ul class="team-settlement-list">
                <li v-for="item in settlementRules" :key="item">
                  <span aria-hidden="true"></span>
                  <p>{{ item }}</p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section class="team-support-section" aria-labelledby="team-support-title">
        <div class="page-container team-support-inner">
          <span class="team-section-eyebrow">{{ teamBox.support.eyebrow }}</span>

          <h2 id="team-support-title" class="team-section-title">
            <span>{{ teamBox.support.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.support.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.support.description }}
          </p>

          <div class="team-support-grid">
            <article
              v-for="item in supportItems"
              :key="item.title"
              class="team-support-card"
            >
              <span class="team-support-icon" aria-hidden="true">
                <img v-if="item.icon" :src="item.icon" alt="" role="presentation">
              </span>
              <div class="team-support-content">
                <h3>{{ item.title }}</h3>
                <span class="team-support-line" aria-hidden="true"></span>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="team-plans-section" aria-labelledby="team-plans-title">
        <div class="page-container team-plans-inner">
          <span class="team-section-eyebrow">{{ teamBox.plans.eyebrow }}</span>

          <h2 id="team-plans-title" class="team-section-title">
            <span>{{ teamBox.plans.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.plans.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.plans.description }}
          </p>

          <div class="team-plans-grid">
            <article
              v-for="item in planItems"
              :key="item.title"
              class="team-plan-card"
            >
              <div class="team-plan-content">
                <h3>{{ item.title }}</h3>
                <span class="team-plan-line" aria-hidden="true"></span>
                <p>{{ item.description }}</p>
              </div>
              <img v-if="item.image" class="team-plan-image" :src="item.image" alt="" aria-hidden="true" role="presentation">
            </article>
          </div>
        </div>
      </section>

      <section id="team-cooperation-application" class="team-application-section" aria-labelledby="team-application-title">
        <div class="page-container team-application-inner">
          <span class="team-section-eyebrow">{{ teamBox.application.eyebrow }}</span>

          <h2 id="team-application-title" class="team-section-title">
            <span>{{ teamBox.application.titlePrefix }}</span>
            <span class="theme-gradient-text">{{ teamBox.application.titleHighlight }}</span>
          </h2>

          <p class="team-section-description">
            {{ teamBox.application.description }}
          </p>

          <div class="team-application-layout">
            <form class="team-application-form" @submit.prevent>
              <div class="team-form-grid">
                <label v-for="field in applicationFields" :key="field.name" class="team-form-field">
                  <span>{{ field.label }}</span>
                  <span class="team-form-control">
                    <Icon :name="field.icon" aria-hidden="true" />
                    <select v-if="field.type === 'select'" :name="field.name" :required="field.required">
                      <option value="">{{ field.placeholder }}</option>
                      <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                    </select>
                    <input
                      v-else
                      :name="field.name"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      :required="field.required"
                    >
                  </span>
                </label>

                <label class="team-form-field team-form-field-wide">
                  <span>{{ teamBox.application.intentLabel }}</span>
                  <span class="team-form-control team-form-textarea-control">
                    <Icon name="lucide:pencil-line" aria-hidden="true" />
                    <textarea name="cooperationIntent" :placeholder="teamBox.application.intentPlaceholder"></textarea>
                  </span>
                </label>
              </div>

              <p class="team-form-note">{{ teamBox.application.note }}</p>

              <button class="team-form-submit" type="submit">{{ teamBox.application.submitLabel }}</button>
            </form>

            <aside class="team-application-contact" aria-labelledby="team-application-contact-title">
              <div class="team-contact-heading">
                <span class="team-contact-icon">
                  <Icon name="lucide:headset" aria-hidden="true" />
                </span>
                <h3 id="team-application-contact-title">{{ teamBox.contact.title }}</h3>
              </div>

              <ul class="team-contact-list">
                <li v-for="item in contactItems" :key="item.label">
                  <span class="team-contact-list-icon" aria-hidden="true">
                    <Icon :name="item.icon" />
                  </span>
                  <span>
                    <small>{{ item.label }}</small>
                    <strong>{{ item.value }}</strong>
                  </span>
                </li>
              </ul>

              <p class="team-contact-note">
                {{ teamBox.contact.note }}
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { getTeams } from '../../api/request/strapi'
import { createAbsoluteUrl, createLocalizedUrl, setupPageSeo, setupStructuredData } from '../../utils/seo'

const config = useRuntimeConfig()
const { locale, locales } = useI18n()

const activeLocaleConfig = computed(() => {
  return locales.value.find(item => typeof item !== 'string' && item.code === locale.value) || {}
})
const siteUrl = computed(() => String(config.public.siteUrl || 'https://vicastcam.com').replace(/\/+$/, ''))
const defaultLocale = computed(() => config.public.i18n?.defaultLocale || 'en')
const teamPageUrl = computed(() => createLocalizedUrl('/team', locale.value, siteUrl.value, defaultLocale.value))

const fieldDefaults = [
  {
    name: 'contactName',
    type: 'text',
    icon: 'lucide:user',
    required: true,
  },
  {
    name: 'companyName',
    type: 'text',
    icon: 'lucide:building-2',
    required: false,
  },
  {
    name: 'email',
    type: 'email',
    icon: 'lucide:mail',
    required: true,
  },
  {
    name: 'phone',
    type: 'tel',
    icon: 'lucide:message-circle',
    required: false,
  },
  {
    name: 'businessType',
    type: 'select',
    icon: 'lucide:briefcase-business',
    required: false,
  },
  {
    name: 'region',
    type: 'text',
    icon: 'lucide:map-pin',
    required: false,
  },
  {
    name: 'position',
    type: 'text',
    icon: 'lucide:id-card',
    required: false,
  },
  {
    name: 'budget',
    type: 'text',
    icon: 'lucide:circle-dollar-sign',
    required: false,
  },
  {
    name: 'country',
    type: 'select',
    icon: 'lucide:globe-2',
    required: false,
  },
  {
    name: 'website',
    type: 'url',
    icon: 'lucide:link',
    required: false,
  },
]

const contactIconDefaults = ['lucide:mail', 'lucide:message-circle', 'lucide:clock']
const advantageIconDefaults = [
  '/images/team/advantage-creators-icon.png',
  '/images/team/advantage-delivery-icon.png',
  '/images/team/advantage-competition-icon.png',
]
const supportIconDefaults = [
  '/images/team/support-marketing-materials-icon.png',
  '/images/team/support-technical-service-icon.png',
  '/images/team/support-brand-authorization-icon.png',
  '/images/team/support-priority-beta-icon.png',
]
const planImageDefaults = [
  '/images/team/plan-channel-agent-image.png',
  '/images/team/plan-oem-sdk-image.png',
  '/images/team/plan-enterprise-custom-image.png',
]

const defaultTeamBox = {
  hero: {
    eyebrow: '',
    title: '',
    highlight: '',
    description: '',
    actions: {
      primary: '',
      secondary: '',
    },
  },
  advantages: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  rules: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    agentLevelTitle: '',
    agentLevels: [],
    settlementTitle: '',
    settlementRules: [],
  },
  support: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  plans: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    items: [],
  },
  application: {
    eyebrow: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    fields: [],
    intentLabel: '',
    intentPlaceholder: '',
    note: '',
    submitLabel: '',
  },
  contact: {
    title: '',
    items: [],
    note: '',
  },
  seo: {
    title: '',
    description: '',
    image: '',
    imageAlt: '',
  },
}

const cloneJson = value => JSON.parse(JSON.stringify(value))
const normalizeList = value => Array.isArray(value) ? value.filter(Boolean) : []

const mergeObject = (fallback, source) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return cloneJson(fallback)
  }

  const result = cloneJson(fallback)

  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      result[key] = value
      return
    }

    if (value && typeof value === 'object') {
      result[key] = mergeObject(result[key] || {}, value)
      return
    }

    if (value !== undefined && value !== null && value !== '') {
      result[key] = value
    }
  })

  return result
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

const normalizeStrapiRecord = record => {
  const data = record?.attributes || record || {}
  return {
    ...data,
    ...(data.attributes || {}),
  }
}

const getTeamContentData = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = normalizeStrapiRecord(firstRecord)
  const parsedData = parseStrapiJsonField(record.data)

  const content = parsedData?.team ||
    parsedData?.teamBox ||
    parsedData?.data?.team ||
    parsedData?.data?.teamBox ||
    parsedData?.data ||
    parsedData ||
    {}

  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return {}
  }

  return {
    ...content,
    seo: {
      ...(record.seo || {}),
      ...(content.seo || {}),
    },
  }
}

const createTeamBox = (content = {}) => {
  return mergeObject(defaultTeamBox, content)
}

const teamBox = useState('team-page-box', () => createTeamBox())
const teamBoxLocale = useState('team-page-box-locale', () => '')

const syncTeamBox = (content = {}) => {
  teamBox.value = createTeamBox(content)
}

const advantageItems = computed(() => {
  return normalizeList(teamBox.value.advantages.items).map((item, index) => ({
    ...item,
    icon: item.icon || advantageIconDefaults[index] || '',
  }))
})
const agentLevels = computed(() => normalizeList(teamBox.value.rules.agentLevels))
const settlementRules = computed(() => normalizeList(teamBox.value.rules.settlementRules))
const supportItems = computed(() => {
  return normalizeList(teamBox.value.support.items).map((item, index) => ({
    ...item,
    icon: item.icon || supportIconDefaults[index] || '',
  }))
})
const planItems = computed(() => {
  return normalizeList(teamBox.value.plans.items).map((item, index) => ({
    ...item,
    image: planImageDefaults[index] || item.image || '',
  }))
})
const applicationFields = computed(() => {
  const fields = normalizeList(teamBox.value.application.fields)

  return fieldDefaults.map(defaultField => {
    const sourceField = fields.find(item => item.name === defaultField.name) || {}

    return {
      ...defaultField,
      ...sourceField,
      options: normalizeList(sourceField.options),
    }
  })
})
const contactItems = computed(() => {
  return normalizeList(teamBox.value.contact.items).map((item, index) => ({
    icon: contactIconDefaults[index] || 'lucide:circle',
    ...item,
  }))
})

const scrollToTeamSection = (sectionId) => {
  if (!process.client) {
    return
  }

  const sectionElement = document.getElementById(sectionId)
  if (!sectionElement) {
    return
  }

  const headerHeight = document.querySelector('.page-header')?.getBoundingClientRect().height || 0
  const targetTop = window.scrollY + sectionElement.getBoundingClientRect().top - headerHeight - 24

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth',
  })
}

const scrollToApplication = () => {
  scrollToTeamSection('team-cooperation-application')
}

const scrollToAdvantages = () => {
  scrollToTeamSection('team-cooperation-advantages')
}

useLocalizedAsyncState({
  locale,
  loadedLocale: teamBoxLocale,
  load: currentLocale => getTeams(currentLocale),
  sync: response => {
    syncTeamBox(getTeamContentData(response))
  },
  reset: () => {
    syncTeamBox()
  },
})

setupPageSeo('team', () => teamBox.value.seo)

setupStructuredData(() => {
  const pageTitle = teamBox.value.seo.title ||
    [teamBox.value.hero.title, teamBox.value.hero.highlight].filter(Boolean).join(' ') ||
    'VicastCam Business Cooperation'
  const pageDescription = teamBox.value.seo.description ||
    teamBox.value.hero.description ||
    'Partner with VicastCam for channel agency, OEM, SDK, and enterprise cooperation.'
  const inLanguage = activeLocaleConfig.value.language || locale.value
  const contactPoint = contactItems.value
    .map((item) => {
      const label = String(item.label || '').trim()
      const labelKey = label.toLowerCase()
      const value = String(item.value || '').trim()

      if (!value) {
        return null
      }

      const point = {
        '@type': 'ContactPoint',
        contactType: label || 'business cooperation',
        availableLanguage: inLanguage,
      }

      if (labelKey.includes('email') || labelKey.includes('mail') || label.includes('邮箱')) {
        point.email = value
      } else if (labelKey.includes('phone') || labelKey.includes('whatsapp') || label.includes('电话')) {
        point.telephone = value
      } else {
        point.name = value
      }

      return point
    })
    .filter(Boolean)

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: pageTitle,
      description: pageDescription,
      url: teamPageUrl.value,
      image: createAbsoluteUrl(teamBox.value.seo.image || '/images/team/partner-plan-hero-bg.png', siteUrl.value),
      inLanguage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'VicastCam',
      url: siteUrl.value,
      logo: createAbsoluteUrl('/images/common/logo.png', siteUrl.value),
      ...(contactPoint.length ? { contactPoint } : {}),
    },
  ]
}, { id: 'team-cooperation-jsonld' })
</script>

<style scoped>
.team-page-shell {
  --team-page-background: #02071c;
  --team-hero-title: var(--theme-white);
  --team-hero-copy: rgba(226, 232, 240, 0.84);
  --team-hero-eyebrow-border: rgba(56, 189, 248, 0.32);
  --team-hero-eyebrow-text: rgba(125, 211, 252, 1);
  --team-hero-eyebrow-background: rgba(14, 165, 233, 0.1);
  --team-hero-eyebrow-shadow: inset 0 0 18px rgba(14, 165, 233, 0.12);
  --team-hero-overlay:
    radial-gradient(circle at 50% 44%, rgba(2, 6, 23, 0.12) 0%, transparent 48%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.12) 0%, rgba(2, 6, 23, 0.34) 100%);
  --team-hero-background:
    linear-gradient(180deg, rgba(3, 7, 18, 0.06) 0%, rgba(3, 7, 18, 0.16) 100%),
    url("/images/team/partner-plan-hero-bg.png") center / cover no-repeat,
    #040915;
  --team-primary-button-background: linear-gradient(135deg, #16a8f8 0%, #2563eb 100%);
  --team-primary-button-shadow: rgba(37, 99, 235, 0.34);
  --team-primary-button-hover-shadow: rgba(37, 99, 235, 0.42);
  --team-secondary-button-background: rgba(15, 23, 42, 0.45);
  --team-secondary-button-hover-background: rgba(15, 23, 42, 0.62);
  --team-secondary-button-border: rgba(255, 255, 255, 0.12);
  --team-secondary-button-hover-border: rgba(125, 211, 252, 0.42);
  --team-section-title: var(--theme-white);
  --team-section-copy: rgba(203, 213, 225, 0.78);
  --team-section-eyebrow-text: rgba(56, 189, 248, 0.95);
  --team-section-eyebrow-background: rgba(14, 165, 233, 0.12);
  --team-section-eyebrow-border: rgba(56, 189, 248, 0.24);
  --team-advantage-card-background: #0a143f;
  --team-advantage-card-border: rgba(80, 120, 218, 0.28);
  --team-advantage-icon-background: rgba(40, 91, 166, 0.42);
  --team-advantage-icon-border: rgba(97, 167, 255, 0.58);
  --team-image-card-title: var(--theme-white);
  --team-image-card-copy: rgba(248, 250, 252, 0.86);
  --team-support-card-background: rgba(5, 7, 28, 1);
  --team-support-card-border: rgba(80, 120, 218, 0.22);
  --team-support-icon-background: rgba(40, 91, 166, 0.42);
  --team-support-icon-border: rgba(97, 167, 255, 0.58);
  --team-support-card-copy: rgba(226, 232, 240, 0.82);
  --team-plan-card-background: rgba(5, 14, 47, 1);
  --team-plan-card-alt-background: rgba(10, 15, 57, 1);
  --team-plan-card-purple-background: rgba(20, 14, 62, 1);
  --team-plan-card-border: rgba(80, 120, 218, 0.18);
  --team-rule-blue-border: rgba(96, 165, 250, 0.62);
  --team-rule-blue-background: rgba(5, 14, 47, 0.78);
  --team-rule-blue-shadow: inset 0 0 28px rgba(37, 99, 235, 0.1);
  --team-rule-purple-border: rgba(168, 85, 247, 0.7);
  --team-rule-purple-background: rgba(18, 8, 52, 0.78);
  --team-rule-purple-shadow: inset 0 0 28px rgba(147, 51, 234, 0.12);
  --team-panel-title: var(--theme-white);
  --team-panel-item-background: rgba(255, 255, 255, 0.09);
  --team-panel-item-copy: rgba(203, 213, 225, 0.82);
  --team-settlement-copy: rgba(248, 250, 252, 0.92);
  --team-form-panel-border: rgba(148, 163, 184, 0.58);
  --team-form-panel-background: rgba(5, 9, 29, 0.74);
  --team-form-label: var(--theme-white);
  --team-form-control-border: rgba(92, 111, 152, 0.28);
  --team-form-control-background: rgba(27, 33, 62, 0.82);
  --team-form-icon: rgba(148, 163, 184, 0.78);
  --team-form-value: rgba(226, 232, 240, 0.94);
  --team-form-placeholder: rgba(148, 163, 184, 0.58);
  --team-form-muted: rgba(148, 163, 184, 0.68);
  --team-contact-icon-border: rgba(168, 85, 247, 0.58);
  --team-contact-icon-background: rgba(88, 28, 135, 0.42);
  --team-contact-title: rgba(125, 211, 252, 1);
  --team-contact-divider: rgba(148, 163, 184, 0.14);
  --team-contact-label: rgba(148, 163, 184, 0.78);
  --team-contact-value: rgba(248, 250, 252, 0.94);
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

.team-page-main {
  width: 100%;
  flex: 1;
  background: var(--team-page-background);
}

.team-hero-section {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 704px;
  overflow: hidden;
  color: var(--theme-white);
  background: var(--team-hero-background);
}

.team-hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--team-hero-overlay);
}

.team-hero-inner {
  position: relative;
  z-index: 1;
  height: auto;
  min-height: 704px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 68px;
  padding-bottom: 72px;
  text-align: center;
}

.team-hero-eyebrow {
  min-width: 92px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid var(--team-hero-eyebrow-border);
  border-radius: 999px;
  color: var(--team-hero-eyebrow-text);
  background: var(--team-hero-eyebrow-background);
  box-shadow: var(--team-hero-eyebrow-shadow);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.team-hero-title {
  max-width: min(100%, 1040px);
  margin-top: 24px;
  color: var(--team-hero-title);
  font-size: clamp(38px, 5vw, 60px);
  font-weight: 900;
  line-height: 1.16;
  text-align: center;
  overflow-wrap: anywhere;
}

.team-hero-title span {
  display: block;
}

.team-hero-title-highlight {
  position: relative;
  display: inline-block !important;
  margin-top: 6px;
}

.team-hero-title-line {
  position: absolute;
  left: 50%;
  bottom: -16px;
  width: min(260px, 78%);
  height: auto;
  transform: translateX(-50%);
  pointer-events: none;
}

.team-hero-description {
  max-width: 840px;
  margin-top: 32px;
  color: var(--team-hero-copy);
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  overflow-wrap: anywhere;
}

.team-hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 34px;
}

.team-hero-button {
  min-width: 132px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border: 1px solid var(--team-secondary-button-border);
  border-radius: 10px;
  color: var(--theme-white);
  background: rgba(255, 255, 255, 0.06);
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.team-hero-button:hover,
.team-hero-button:focus-visible {
  transform: translateY(-1px);
}

.team-hero-button-primary {
  border-color: transparent;
  background: var(--team-primary-button-background);
  box-shadow: 0 14px 30px var(--team-primary-button-shadow);
}

.team-hero-button-primary:hover,
.team-hero-button-primary:focus-visible {
  box-shadow: 0 18px 36px var(--team-primary-button-hover-shadow);
}

.team-hero-button-secondary {
  background: var(--team-secondary-button-background);
}

.team-hero-button-secondary:hover,
.team-hero-button-secondary:focus-visible {
  border-color: var(--team-secondary-button-hover-border);
  background: var(--team-secondary-button-hover-background);
}

.team-advantages-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-advantages-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-section-eyebrow {
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 1px solid var(--team-section-eyebrow-border);
  border-radius: 999px;
  color: var(--team-section-eyebrow-text);
  background: var(--team-section-eyebrow-background);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.team-section-title {
  margin-top: 18px;
  color: var(--team-section-title);
  font-size: 40px;
  font-weight: 900;
  line-height: 48px;
  text-align: center;
}

.team-section-title span {
  display: block;
}

.team-section-description {
  max-width: 640px;
  margin-top: 18px;
  color: var(--team-section-copy);
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  overflow-wrap: anywhere;
}

.team-advantage-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 38px;
}

.team-advantage-card {
  position: relative;
  height: auto;
  min-height: 231px;
  overflow: hidden;
  padding: 16px 20px 22px;
  border: 1px solid var(--team-advantage-card-border);
  border-radius: 8px;
  background: var(--team-advantage-card-background);
}

.team-advantage-icon {
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--team-advantage-icon-border);
  border-radius: 8px;
  background: var(--team-advantage-icon-background);
}

.team-advantage-icon img {
  width: 33px;
  height: 33px;
  object-fit: contain;
}

.team-advantage-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-top: 18px;
}

.team-advantage-content h3 {
  color: var(--team-image-card-title);
  font-size: 18px;
  font-weight: 900;
  line-height: 25px;
  overflow-wrap: anywhere;
}

.team-advantage-line {
  width: 36px;
  height: 2px;
  display: block;
  margin-top: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0) 100%);
}

.team-advantage-content p {
  margin-top: 12px;
  color: var(--team-image-card-copy);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.team-rules-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-rules-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-rules-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.team-rule-panel {
  min-width: 0;
  min-height: 0;
  padding: 22px;
  border: 1px solid var(--team-rule-blue-border);
  border-radius: 20px;
  background: var(--team-rule-blue-background);
}

.team-rule-panel-blue {
  box-shadow: var(--team-rule-blue-shadow);
}

.team-rule-panel-purple {
  border-color: var(--team-rule-purple-border);
  background: var(--team-rule-purple-background);
  box-shadow: var(--team-rule-purple-shadow);
}

.team-rule-panel h3 {
  color: var(--team-panel-title);
  font-size: 24px;
  font-weight: 900;
  line-height: 32px;
}

.team-agent-level-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.team-agent-level-item {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  padding: 14px 22px;
  border-radius: 8px;
  background: var(--team-panel-item-background);
}

.team-agent-level-item img {
  width: 39px;
  height: 40px;
  object-fit: contain;
}

.team-agent-level-item h4 {
  color: var(--team-panel-title);
  font-size: 16px;
  font-weight: 900;
  line-height: 22px;
}

.team-agent-level-item p {
  margin-top: 4px;
  color: var(--team-panel-item-copy);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.team-settlement-list {
  display: grid;
  gap: 22px;
  margin-top: 20px;
  padding: 31px 28px;
  border-radius: 8px;
  background: var(--team-panel-item-background);
}

.team-settlement-list li {
  min-width: 0;
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  align-items: start;
  gap: 22px;
}

.team-settlement-list span {
  width: 12px;
  height: 12px;
  display: block;
  margin-top: 6px;
  border-radius: 999px;
  background: #36d9f3;
}

.team-settlement-list p {
  color: var(--team-settlement-copy);
  font-size: 16px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

.team-support-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-support-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-support-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  justify-content: center;
  gap: 24px;
  margin-top: 56px;
}

.team-support-card {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: auto;
  min-height: 233px;
  overflow: hidden;
  padding: 19px 14px 24px;
  border: 1px solid var(--team-support-card-border);
  border-radius: 16px;
  background: var(--team-support-card-background);
}

.team-support-icon {
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--team-support-icon-border);
  border-radius: 8px;
  background: var(--team-support-icon-background);
}

.team-support-icon img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.team-support-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-top: 19px;
}

.team-support-content h3 {
  color: var(--team-image-card-title);
  font-size: 20px;
  font-weight: 900;
  line-height: 28px;
  overflow-wrap: anywhere;
}

.team-support-line {
  width: 66px;
  height: 2px;
  display: block;
  margin-top: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0) 100%);
}

.team-support-content p {
  margin-top: 10px;
  color: var(--team-support-card-copy);
  font-size: 15px;
  line-height: 23px;
  overflow-wrap: anywhere;
}

.team-plans-section {
  width: 100%;
  padding: 40px 20px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-plans-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-plans-grid {
  width: 100%;
  max-width: 1162px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 370px));
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
}

.team-plan-card {
  position: relative;
  width: 370px;
  max-width: 100%;
  height: auto;
  min-height: 160px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 134px;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  padding: 24px 16px 22px 18px;
  border: 1px solid var(--team-plan-card-border);
  border-radius: 12px;
  background: var(--team-plan-card-background);
}

.team-plan-card:nth-child(2) {
  background: var(--team-plan-card-alt-background);
}

.team-plan-card:nth-child(3) {
  background: var(--team-plan-card-purple-background);
}

.team-plan-content {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.team-plan-content h3 {
  color: var(--team-image-card-title);
  font-size: 17px;
  font-weight: 900;
  line-height: 24px;
  overflow-wrap: anywhere;
}

.team-plan-line {
  width: 40px;
  height: 2px;
  display: block;
  margin-top: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0) 100%);
}

.team-plan-content p {
  margin-top: 9px;
  color: var(--team-support-card-copy);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.team-plan-image {
  position: relative;
  z-index: 1;
  width: 126px;
  height: 126px;
  object-fit: contain;
  justify-self: center;
}

.team-application-section {
  width: 100%;
  padding: 40px 20px 88px;
  color: var(--theme-white);
  background: var(--team-page-background);
}

.team-application-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-application-layout {
  width: 100%;
  max-width: 1148px;
  display: grid;
  grid-template-columns: 778px 346px;
  align-items: start;
  gap: 24px;
  margin-top: 24px;
}

.team-application-form,
.team-application-contact {
  border: 1px solid var(--team-form-panel-border);
  border-radius: 22px;
  background: var(--team-form-panel-background);
}

.team-application-form {
  width: 778px;
  height: auto;
  min-width: 0;
  padding: 34px 36px 36px;
}

.team-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px 26px;
}

.team-form-field {
  min-width: 0;
  display: grid;
  gap: 10px;
  color: var(--team-form-label);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
}

.team-form-field-wide {
  grid-column: 1 / -1;
}

.team-form-control {
  width: 100%;
  min-width: 0;
  height: 55px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid var(--team-form-control-border);
  border-radius: 12px;
  color: var(--team-form-icon);
  background: var(--team-form-control-background);
}

.team-form-control svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: var(--team-form-icon);
}

.team-form-control input,
.team-form-control select,
.team-form-control textarea {
  width: 100%;
  min-width: 0;
  border: 0;
  color: var(--team-form-value);
  background: transparent;
  font-size: 12px;
  line-height: 18px;
  outline: none;
}

.team-form-control input::placeholder,
.team-form-control textarea::placeholder {
  color: var(--team-form-placeholder);
}

.team-form-control select {
  color: var(--team-form-icon);
  cursor: pointer;
}

.team-form-textarea-control {
  width: 100%;
  height: 103px;
  align-items: flex-start;
  padding-top: 14px;
}

.team-form-textarea-control textarea {
  height: 75px;
  resize: none;
}

.team-form-note {
  margin-top: 10px;
  color: var(--team-form-muted);
  font-size: 12px;
  line-height: 18px;
}

.team-form-submit {
  width: min(100%, 300px);
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  border-radius: 10px;
  color: var(--theme-white);
  background: linear-gradient(135deg, #2d91ff 0%, #9246f5 100%);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.28);
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.team-form-submit:hover,
.team-form-submit:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 22px 42px rgba(37, 99, 235, 0.36);
}

.team-application-contact {
  width: 346px;
  height: auto;
  min-width: 0;
  padding: 36px 28px 30px;
}

.team-contact-heading {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-contact-icon {
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid var(--team-contact-icon-border);
  border-radius: 50%;
  color: var(--theme-white);
  background: var(--team-contact-icon-background);
}

.team-contact-icon svg {
  width: 23px;
  height: 23px;
}

.team-contact-heading h3 {
  color: var(--team-contact-title);
  font-size: 20px;
  font-weight: 900;
  line-height: 28px;
}

.team-contact-list {
  display: grid;
  gap: 26px;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--team-contact-divider);
}

.team-contact-list li {
  min-width: 0;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.team-contact-list-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--team-contact-title);
  background: var(--team-contact-icon-background);
  box-shadow: inset 0 0 0 1px var(--team-contact-icon-border);
}

.team-contact-list-icon svg {
  width: 17px;
  height: 17px;
}

.team-contact-list span {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.team-contact-list small {
  color: var(--team-contact-label);
  font-size: 12px;
  line-height: 16px;
}

.team-contact-list strong {
  color: var(--team-contact-value);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  overflow-wrap: anywhere;
}

.team-contact-note {
  margin-top: 30px;
  padding-top: 28px;
  border-top: 1px solid var(--team-contact-divider);
  color: var(--team-contact-label);
  font-size: 13px;
  line-height: 21px;
  overflow-wrap: anywhere;
}

:root[data-theme="light"] .team-page-shell {
  --team-page-background: rgba(248, 252, 255, 1);
  --team-hero-title: var(--theme-white);
  --team-hero-copy: rgba(226, 232, 240, 0.84);
  --team-hero-eyebrow-border: rgba(56, 189, 248, 0.32);
  --team-hero-eyebrow-text: rgba(125, 211, 252, 1);
  --team-hero-eyebrow-background: rgba(14, 165, 233, 0.1);
  --team-hero-eyebrow-shadow: inset 0 0 18px rgba(14, 165, 233, 0.12);
  --team-hero-overlay:
    radial-gradient(circle at 50% 44%, rgba(2, 6, 23, 0.12) 0%, transparent 48%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.12) 0%, rgba(2, 6, 23, 0.34) 100%);
  --team-hero-background:
    linear-gradient(180deg, rgba(3, 7, 18, 0.06) 0%, rgba(3, 7, 18, 0.16) 100%),
    url("/images/team/partner-plan-hero-bg.png") center / cover no-repeat,
    #040915;
  --team-primary-button-background: linear-gradient(135deg, rgba(6, 182, 212, 1) 0%, rgba(37, 99, 235, 1) 100%);
  --team-primary-button-shadow: rgba(37, 99, 235, 0.2);
  --team-primary-button-hover-shadow: rgba(37, 99, 235, 0.28);
  --team-secondary-button-background: rgba(15, 23, 42, 0.45);
  --team-secondary-button-hover-background: rgba(15, 23, 42, 0.62);
  --team-secondary-button-border: rgba(255, 255, 255, 0.12);
  --team-secondary-button-hover-border: rgba(125, 211, 252, 0.42);
  --team-section-title: rgba(17, 24, 39, 1);
  --team-section-copy: rgba(31, 41, 55, 0.78);
  --team-section-eyebrow-text: rgba(40, 115, 253, 1);
  --team-section-eyebrow-background: rgba(239, 248, 255, 1);
  --team-section-eyebrow-border: rgba(42, 130, 228, 0.18);
  --team-advantage-card-background: rgba(255, 255, 255, 1);
  --team-advantage-card-border: rgba(42, 130, 228, 0.16);
  --team-advantage-icon-background: rgba(239, 248, 255, 1);
  --team-advantage-icon-border: rgba(42, 130, 228, 0.24);
  --team-image-card-title: rgba(17, 24, 39, 1);
  --team-image-card-copy: rgba(31, 41, 55, 0.78);
  --team-support-card-background: rgba(255, 255, 255, 1);
  --team-support-card-border: rgba(42, 130, 228, 0.16);
  --team-support-icon-background: rgba(239, 248, 255, 1);
  --team-support-icon-border: rgba(42, 130, 228, 0.24);
  --team-support-card-copy: rgba(31, 41, 55, 0.78);
  --team-plan-card-background: rgba(255, 255, 255, 1);
  --team-plan-card-alt-background: rgba(247, 250, 255, 1);
  --team-plan-card-purple-background: rgba(250, 245, 255, 1);
  --team-plan-card-border: rgba(42, 130, 228, 0.16);
  --team-rule-blue-border: rgba(42, 130, 228, 0.2);
  --team-rule-blue-background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 248, 255, 1) 100%);
  --team-rule-blue-shadow: 0 18px 42px rgba(37, 99, 235, 0.08);
  --team-rule-purple-border: rgba(168, 85, 247, 0.18);
  --team-rule-purple-background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(250, 245, 255, 1) 100%);
  --team-rule-purple-shadow: 0 18px 42px rgba(124, 58, 237, 0.08);
  --team-panel-title: rgba(17, 24, 39, 1);
  --team-panel-item-background: rgba(255, 255, 255, 0.86);
  --team-panel-item-copy: rgba(31, 41, 55, 0.78);
  --team-settlement-copy: rgba(31, 41, 55, 0.86);
  --team-form-panel-border: rgba(149, 156, 168, 0.16);
  --team-form-panel-background: rgba(255, 255, 255, 1);
  --team-form-label: rgba(17, 24, 39, 1);
  --team-form-control-border: rgba(229, 231, 235, 1);
  --team-form-control-background: rgba(248, 250, 252, 1);
  --team-form-icon: rgba(107, 114, 128, 1);
  --team-form-value: rgba(17, 24, 39, 1);
  --team-form-placeholder: rgba(107, 114, 128, 0.72);
  --team-form-muted: rgba(31, 41, 55, 0.62);
  --team-contact-icon-border: rgba(40, 115, 253, 0.18);
  --team-contact-icon-background: rgba(239, 248, 255, 1);
  --team-contact-title: rgba(40, 115, 253, 1);
  --team-contact-divider: rgba(229, 231, 235, 1);
  --team-contact-label: rgba(31, 41, 55, 0.68);
  --team-contact-value: rgba(17, 24, 39, 0.92);
  background: var(--team-page-background);
}

:root[data-theme="light"] .team-page-main {
  background:
    linear-gradient(180deg, rgba(248, 252, 255, 1) 0%, rgba(255, 255, 255, 1) 44%, rgba(248, 252, 255, 1) 100%);
}

:root[data-theme="light"] .team-hero-button-secondary {
  color: var(--theme-white);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
}

:root[data-theme="light"] .team-advantages-section,
:root[data-theme="light"] .team-rules-section,
:root[data-theme="light"] .team-support-section,
:root[data-theme="light"] .team-plans-section,
:root[data-theme="light"] .team-application-section {
  color: rgba(17, 24, 39, 1);
  background: transparent;
}

:root[data-theme="light"] .team-advantage-card,
:root[data-theme="light"] .team-support-card,
:root[data-theme="light"] .team-plan-card {
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.1);
}

:root[data-theme="light"] .team-rule-panel,
:root[data-theme="light"] .team-application-form,
:root[data-theme="light"] .team-application-contact {
  padding-left: 28px;
  padding-right: 28px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
}

:root[data-theme="light"] .team-contact-list li {
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
}

:root[data-theme="light"] .team-contact-icon,
:root[data-theme="light"] .team-contact-list-icon {
  color: rgba(40, 115, 253, 1);
  background: rgba(239, 248, 255, 1);
  box-shadow: inset 0 0 0 1px rgba(40, 115, 253, 0.14);
}

:root[data-theme="light"] .team-agent-level-item,
:root[data-theme="light"] .team-settlement-list {
  border: 1px solid rgba(229, 231, 235, 0.82);
}

:root[data-theme="light"] .team-form-control:focus-within {
  border-color: rgba(40, 115, 253, 0.46);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(40, 115, 253, 0.1);
}

:root[data-theme="light"] .team-form-control select option {
  color: rgba(17, 24, 39, 1);
  background: rgba(255, 255, 255, 1);
}

@media (max-width: 768px) {
  .team-hero-section,
  .team-hero-inner {
    height: auto;
    min-height: 704px;
  }

  .team-hero-inner {
    padding-top: 56px;
    padding-bottom: 58px;
  }

  .team-hero-title {
    margin-top: 20px;
    font-size: 32px;
    line-height: 40px;
  }

  .team-hero-description {
    margin-top: 28px;
    font-size: 14px;
    line-height: 24px;
  }

  .team-hero-actions {
    width: 100%;
    gap: 12px;
    margin-top: 28px;
  }

  .team-hero-button {
    min-width: 124px;
    height: 44px;
    padding: 0 18px;
    font-size: 14px;
  }

  .team-advantages-section {
    padding: 40px 24px;
  }

  .team-section-title {
    font-size: 32px;
    line-height: 40px;
  }

  .team-section-description {
    font-size: 13px;
    line-height: 20px;
  }

  .team-advantage-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-top: 32px;
  }

  .team-advantage-card {
    min-height: calc((100vw - 48px) * 231 / 370);
    padding: 16px 18px 18px;
    border-radius: 12px;
  }

  .team-advantage-content {
    padding-top: 16px;
  }

  .team-advantage-content h3 {
    font-size: 17px;
    line-height: 24px;
  }

  .team-advantage-content p {
    margin-top: 10px;
    font-size: 12px;
    line-height: 19px;
  }

  .team-rules-section {
    padding: 40px 16px;
  }

  .team-rules-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 28px;
  }

  .team-rule-panel {
    padding: 20px;
    border-radius: 16px;
  }

  .team-agent-level-item {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 14px;
    padding: 14px;
  }

  .team-settlement-list {
    gap: 18px;
    padding: 22px 18px;
  }

  .team-settlement-list li {
    gap: 14px;
  }

  .team-settlement-list p {
    font-size: 14px;
    line-height: 22px;
  }

  .team-support-section {
    padding: 40px 16px;
  }

  .team-support-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-top: 32px;
  }

  .team-support-card {
    width: 100%;
    height: auto;
    min-height: 220px;
    padding: 18px 18px 22px;
  }

  .team-support-content {
    padding-top: 16px;
  }

  .team-support-content h3 {
    font-size: 18px;
    line-height: 25px;
  }

  .team-support-content p {
    font-size: 13px;
    line-height: 20px;
  }

  .team-plans-section {
    padding: 40px 16px;
  }

  .team-plans-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .team-plan-card {
    width: 100%;
    height: auto;
    min-height: 160px;
    grid-template-columns: minmax(0, 1fr) 118px;
    padding: 22px 14px 20px 18px;
  }

  .team-plan-content {
    min-width: 0;
  }

  .team-plan-image {
    width: 112px;
    height: 112px;
  }

  .team-application-section {
    padding: 40px 16px 72px;
  }

  .team-application-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .team-application-form,
  .team-application-contact {
    border-radius: 16px;
  }

  .team-application-form {
    width: 100%;
    height: auto;
    padding: 22px 18px 24px;
  }

  .team-form-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .team-form-control,
  .team-form-textarea-control {
    width: 100%;
  }

  .team-form-submit {
    width: 100%;
  }

  .team-application-contact {
    width: 100%;
    height: auto;
    padding: 24px 20px;
  }

  .team-contact-heading h3 {
    font-size: 18px;
    line-height: 25px;
  }
}
</style>
