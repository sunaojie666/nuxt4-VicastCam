<template>
  <div class="sdk-page-shell">
    <SiteHeader />

    <main class="sdk-page-main">
      <section class="sdk-hero">
        <div class="page-container sdk-hero-inner">
          <span v-if="sdkBox.hero.eyebrow" class="sdk-eyebrow">{{ sdkBox.hero.eyebrow }}</span>
          <h1 v-if="sdkBox.hero.title">{{ sdkBox.hero.title }}</h1>
          <p v-if="sdkBox.hero.description">{{ sdkBox.hero.description }}</p>

          <div v-if="heroFeatures.length" class="sdk-feature-row" :aria-label="sdkBox.hero.featuresAriaLabel">
            <article v-for="feature in heroFeatures" :key="feature.key || feature.title" class="sdk-feature">
              <span class="sdk-feature-icon">
                <img v-if="feature.icon" :src="feature.icon" :alt="feature.title">
              </span>
              <strong>{{ feature.title }}</strong>
              <span>{{ feature.text }}</span>
            </article>
          </div>
        </div>
      </section>

      <section class="sdk-content-section">
        <div class="page-container sdk-content-layout">
          <aside class="sdk-sidebar" :aria-label="cameraLabels.sidebarAriaLabel">
            <section
              v-for="group in leadingStandaloneGroups"
              :key="group.key"
              :class="['sdk-sidebar-single', { 'sdk-sidebar-single-active': group.key === activeGroupKey }]"
            >
              <button type="button" class="sdk-sidebar-group-button" @click="selectStandaloneGroup(group, true)">
                <span class="sdk-sidebar-icon">
                  <Icon :name="group.icon" aria-hidden="true" />
                </span>
                <span class="sdk-sidebar-title">
                  <strong>{{ group.title }}</strong>
                  <small>{{ group.count }}</small>
                </span>
                <Icon class="sdk-sidebar-arrow" name="lucide:chevron-right" aria-hidden="true" />
              </button>
            </section>

            <div class="sdk-sidebar-accordion">
              <section
                v-for="group in accordionGroups"
                :key="group.key"
                :class="['sdk-sidebar-group', { 'sdk-sidebar-group-open': group.key === activeGroupKey }]"
              >
                <button type="button" class="sdk-sidebar-group-button" @click="toggleGroup(group.key)">
                  <span class="sdk-sidebar-icon">
                    <Icon :name="group.icon" aria-hidden="true" />
                  </span>
                  <span class="sdk-sidebar-title">
                    <strong>{{ group.title }}</strong>
                    <small>{{ group.count }}</small>
                  </span>
                  <Icon class="sdk-sidebar-chevron" name="lucide:chevron-down" aria-hidden="true" />
                </button>

                <div
                  :class="['sdk-sidebar-items-wrap', { 'sdk-sidebar-items-wrap-open': group.key === activeGroupKey }]"
                >
                  <div class="sdk-sidebar-items">
                    <button
                      v-for="item in group.items"
                      :key="item.key"
                      type="button"
                      :class="['sdk-sidebar-item', { 'sdk-sidebar-item-active': item.key === activeItemKey }]"
                      @click="selectSdkItem(item)"
                    >
                      <Icon name="lucide:file-text" aria-hidden="true" />
                      <span>{{ item.title }}</span>
                      <Icon name="lucide:chevron-right" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <section
              v-for="group in standaloneGroups"
              :key="group.key"
              :class="['sdk-sidebar-single', { 'sdk-sidebar-single-active': group.key === activeGroupKey }]"
            >
              <button type="button" class="sdk-sidebar-group-button" @click="selectStandaloneGroup(group, true)">
                <span class="sdk-sidebar-icon">
                  <Icon :name="group.icon" aria-hidden="true" />
                </span>
                <span class="sdk-sidebar-title">
                  <strong>{{ group.title }}</strong>
                  <small>{{ group.count }}</small>
                </span>
                <Icon class="sdk-sidebar-arrow" name="lucide:chevron-right" aria-hidden="true" />
              </button>
            </section>

            <div
              v-if="sdkBox.help.title || sdkBox.help.description || sdkBox.help.buttonText"
              class="sdk-help-panel"
            >
              <h2 v-if="sdkBox.help.title">{{ sdkBox.help.title }}</h2>
              <p v-if="sdkBox.help.description">{{ sdkBox.help.description }}</p>
              <NuxtLink
                v-if="sdkBox.help.buttonText"
                class="sdk-help-button"
                :to="teamApplicationPath"
              >
                {{ sdkBox.help.buttonText }}
              </NuxtLink>
            </div>
          </aside>

          <section ref="sdkDownloadPanel" class="sdk-download-panel" aria-labelledby="sdk-content-title">
            <nav class="sdk-breadcrumb" :aria-label="cameraLabels.breadcrumbAriaLabel">
              <span>{{ cameraLabels.breadcrumbRoot }}</span>
              <Icon name="lucide:chevron-right" aria-hidden="true" />
              <span>{{ activeGroupTitle }}</span>
              <template v-if="activeItemTitle">
                <Icon name="lucide:chevron-right" aria-hidden="true" />
                <strong>{{ activeItemTitle }}</strong>
              </template>
            </nav>

            <template v-if="isDemoDownloadView">
              <h2 id="sdk-content-title">{{ demoContent.title }}</h2>
              <p class="sdk-download-copy">{{ demoContent.description }}</p>

              <div class="sdk-demo-list" :aria-label="demoContent.listAriaLabel">
                <article
                  v-for="demo in demoDownloads"
                  :key="demo.key"
                  :class="['sdk-demo-card', `sdk-demo-card-${demo.theme}`]"
                  :style="{ '--sdk-demo-image': `url(${demo.image})` }"
                >
                  <div class="sdk-demo-art" aria-hidden="true"></div>

                  <div class="sdk-demo-content">
                    <h3>{{ demo.title }}</h3>
                    <p>{{ demo.description }}</p>

                    <button type="button" class="sdk-download-button" @click="handleDemoDownload(demo)">
                      <Icon name="lucide:download" aria-hidden="true" />
                      <span>{{ demoContent.downloadButtonText }}</span>
                    </button>
                  </div>
                </article>
              </div>
            </template>

            <div v-else-if="isNoticeView" class="sdk-notice-doc">
              <h3 class="sdk-language-title">{{ cameraLabels.developmentLanguage }}</h3>
              <div class="sdk-code-tabs sdk-language-tabs" role="tablist" aria-label="Notice language">
                <button
                  v-for="tab in sdkLanguageTabs"
                  :key="'notice-' + tab"
                  type="button"
                  :class="['sdk-code-tab', { 'sdk-code-tab-active': tab === activeCodeTab }]"
                  @click="activeCodeTab = tab"
                >
                  {{ tab }}
                </button>
              </div>

              <h2 id="sdk-content-title">{{ activeNoticeDoc.title }}</h2>
              <p class="sdk-download-copy">{{ activeNoticeDoc.description }}</p>
              <a
                v-if="activeNoticeDownloadUrl"
                class="sdk-notice-download-button"
                :href="activeNoticeDownloadUrl"
                download
              >
                <Icon name="lucide:download" aria-hidden="true" />
                <span>{{ cameraLabels.downloadComponent }}</span>
              </a>
              <button v-else type="button" class="sdk-notice-download-button">
                <Icon name="lucide:download" aria-hidden="true" />
                <span>{{ cameraLabels.downloadComponent }}</span>
              </button>

              <section
                v-for="section in activeNoticeDoc.sections"
                :key="section.key"
                class="sdk-doc-section"
              >
                <h3>{{ section.title }}</h3>
                <p v-if="section.description" class="sdk-notice-copy">{{ section.description }}</p>

                <div v-if="section.key === 'components'" class="sdk-notice-image-wrap">
                  <img
                    class="sdk-notice-image"
                    :src="activeNoticeComponentImage.src"
                    :alt="activeNoticeComponentImage.alt"
                    loading="lazy"
                  >
                </div>

                <div v-else-if="section.rows" class="sdk-table sdk-notice-list">
                  <div v-for="row in section.rows" :key="row.name" class="sdk-table-row">
                    <span class="sdk-param-name">{{ row.name }}</span>
                    <span>{{ row.description }}</span>
                  </div>
                </div>

                <div v-if="section.pathItems" class="sdk-notice-path-grid">
                  <div v-for="item in section.pathItems" :key="item.label" class="sdk-notice-path-item">
                    <strong>{{ item.label }}</strong>
                    <code>{{ item.path }}</code>
                  </div>
                </div>

                <div
                  v-if="section.table"
                  :class="['sdk-notice-table', `sdk-notice-table-${section.table.headers.length}-columns`]"
                >
                  <div class="sdk-notice-table-row sdk-notice-table-head">
                    <span v-for="header in section.table.headers" :key="header">{{ header }}</span>
                  </div>
                  <div
                    v-for="(row, rowIndex) in section.table.rows"
                    :key="rowIndex"
                    class="sdk-notice-table-row"
                  >
                    <span v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</span>
                  </div>
                </div>

                <template v-if="section.codeBlocks">
                  <div
                    v-for="block in section.codeBlocks"
                    :key="block.title"
                    class="sdk-notice-code-group"
                  >
                    <p v-if="block.title" class="sdk-notice-copy">{{ block.title }}</p>
                    <div class="sdk-code-block sdk-notice-code-block">
                      <button
                        type="button"
                        class="sdk-code-copy-button"
                        :aria-label="cameraLabels.copyCode"
                        @click="copyCode(block.code)"
                      >
                        <Icon name="lucide:copy" aria-hidden="true" />
                      </button>
                      <pre><code>{{ block.code }}</code></pre>
                    </div>
                  </div>
                </template>
              </section>
            </div>

            <div v-else-if="isEmptyContentView" id="sdk-content-title" class="sdk-empty-doc"></div>

            <div v-else-if="isApiDocView" class="sdk-api-doc">
              <template v-if="hasApiLanguageTabs">
                <h3 class="sdk-language-title">{{ cameraLabels.developmentLanguage }}</h3>
                <div class="sdk-code-tabs sdk-language-tabs" role="tablist" aria-label="Function language">
                  <button
                    v-for="tab in apiDoc.codeTabs"
                    :key="'path-' + tab"
                    type="button"
                    :class="['sdk-code-tab', { 'sdk-code-tab-active': tab === activeCodeTab }]"
                    @click="activeCodeTab = tab"
                  >
                    {{ tab }}
                  </button>
                </div>
              </template>

              <template v-if="activeFunctionPath">
                <h2 id="sdk-content-title">{{ cameraLabels.callFunction }}</h2>
                <div class="sdk-api-path">{{ activeFunctionPath }}</div>
              </template>

              <section v-if="apiDoc.params.length" class="sdk-doc-section" aria-labelledby="sdk-function-params-title">
                <h3 id="sdk-function-params-title">{{ cameraLabels.functionParameters }}</h3>
                <div class="sdk-table">
                  <div v-for="(param, index) in apiDoc.params" :key="`${param.name}-${index}`" class="sdk-table-row">
                    <span v-if="param.name" class="sdk-param-name">{{ param.name }}</span>
                    <span v-else aria-hidden="true"></span>
                    <span>{{ param.description }}</span>
                  </div>
                </div>
              </section>

              <section v-if="activeCode" class="sdk-doc-section" aria-labelledby="sdk-code-title">
                <h3 id="sdk-code-title">{{ cameraLabels.exampleCode }}</h3>
                <div class="sdk-code-block">
                  <button
                    type="button"
                    :class="['sdk-code-copy-button', { 'sdk-code-copy-button-copied': isActiveCodeCopied }]"
                    :aria-label="copyCodeButtonAriaLabel"
                    @click="copyActiveCode"
                  >
                    <Icon name="lucide:copy" aria-hidden="true" />
                  </button>
                  <pre><code>{{ activeCode }}</code></pre>
                </div>
              </section>

              <section v-if="apiDoc.responseFields.length" class="sdk-doc-section" aria-labelledby="sdk-return-title">
                <h3 id="sdk-return-title">{{ cameraLabels.returnValues }}</h3>
                <div class="sdk-response-card">
                  <div class="sdk-response-body">
                    <div class="sdk-response-fields">
                      <div v-for="(field, index) in apiDoc.responseFields" :key="`${field.name}-${index}`" class="sdk-table-row">
                        <span v-if="field.name" class="sdk-param-name">{{ field.name }}</span>
                        <span v-else aria-hidden="true"></span>
                        <span>{{ field.description }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { getPlatformDownload } from '../../api/request/download'
import { getCameras, getExamples, getSdks, getSoundcards } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'
const mediaUrl = useMediaUrl()

const { showRequestSuccessToast, showRequestFailToast } = useSiteToast()
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()
const teamApplicationPath = computed(() => ({
  path: localePath('/team'),
  query: { section: 'application' },
}))

const sdkFeatureAssets = [
  { key: 'compatible', icon: mediaUrl('/images/sdk/feature-compatible.png') },
  { key: 'support', icon: mediaUrl('/images/sdk/feature-support.png') },
  { key: 'api', icon: mediaUrl('/images/sdk/feature-api.png') },
  { key: 'secure', icon: mediaUrl('/images/sdk/feature-secure.png') },
]

const createEmptySdkBox = () => ({
  hero: {
    eyebrow: '',
    title: '',
    description: '',
    featuresAriaLabel: '',
    features: [],
  },
  help: {
    title: '',
    description: '',
    buttonText: '',
  },
  seo: {
    title: '',
    description: '',
  },
})

const sdkBox = useState('sdk-page-box', createEmptySdkBox)
const sdkBoxLocale = useState('sdk-page-box-locale', () => '')
const cameraModule = useState('sdk-camera-module', () => null)
const cameraModuleLocale = useState('sdk-camera-module-locale', () => '')
const soundcardModule = useState('sdk-soundcard-module', () => null)
const soundcardModuleLocale = useState('sdk-soundcard-module-locale', () => '')
const exampleModule = useState('sdk-example-module', () => null)
const exampleModuleLocale = useState('sdk-example-module-locale', () => '')
const sdkDownloadConfig = useState('sdk-download-config', () => ({}))

const normalizeList = value => Array.isArray(value) ? value.filter(Boolean) : []
const getSingleQueryValue = value => Array.isArray(value) ? value[0] : value
const getSdkTargetFromRoute = () => String(getSingleQueryValue(route.query.sdkTarget) || '').trim().toLowerCase()

const createInitialSdkSelection = () => {
  const target = getSdkTargetFromRoute()

  if (target === 'audio') {
    return { groupKey: 'audio', itemKey: 'audio-notice' }
  }

  if (target === 'api') {
    return { groupKey: 'camera', itemKey: 'camera-load-dll' }
  }

  return { groupKey: 'camera', itemKey: 'camera-notice' }
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
  const data = record?.attributes || record || {}

  return {
    ...data,
    ...(data.attributes || {}),
  }
}

const createSdkBox = (content = {}) => {
  const source = content.sdkBox || content.sdk_box || content
  const hero = source.hero || {}

  return {
    hero: {
      ...createEmptySdkBox().hero,
      ...hero,
      features: normalizeList(hero.features),
    },
    help: {
      ...createEmptySdkBox().help,
      ...(source.help || {}),
    },
    seo: {
      ...createEmptySdkBox().seo,
      ...(source.seo || {}),
    },
  }
}

const getSdkBoxFromResponse = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = normalizeStrapiRecord(firstRecord)
  const parsedData = parseStrapiJsonField(record.data)
  const content = parsedData?.sdkBox ||
    parsedData?.sdk_box ||
    parsedData?.data?.sdkBox ||
    parsedData?.data?.sdk_box ||
    parsedData?.data ||
    parsedData ||
    {}

  return createSdkBox(content)
}

const getCameraModuleFromResponse = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = normalizeStrapiRecord(firstRecord)
  const parsedData = parseStrapiJsonField(record.data)
  const source = parsedData?.module ||
    parsedData?.cameraModule ||
    parsedData?.camera_module ||
    parsedData?.data?.module ||
    parsedData?.data ||
    parsedData ||
    {}

  if (source.key !== 'camera') {
    return null
  }

  return {
    ...source,
    items: normalizeList(source.items),
    documents: source.documents || {},
  }
}

const getSoundcardModuleFromResponse = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = normalizeStrapiRecord(firstRecord)
  const parsedData = parseStrapiJsonField(record.data)
  const source = parsedData?.module ||
    parsedData?.soundcardModule ||
    parsedData?.soundcard_module ||
    parsedData?.data?.module ||
    parsedData?.data ||
    parsedData ||
    {}

  if (source.key !== 'audio') {
    return null
  }

  return {
    ...source,
    items: normalizeList(source.items),
    documents: source.documents || {},
  }
}

const getExampleModuleFromResponse = (response) => {
  const records = response?.data
  const firstRecord = Array.isArray(records) ? records[0] : records
  const record = normalizeStrapiRecord(firstRecord)
  const parsedData = parseStrapiJsonField(record.data)
  const source = parsedData?.module ||
    parsedData?.exampleModule ||
    parsedData?.example_module ||
    parsedData?.data?.module ||
    parsedData?.data ||
    parsedData ||
    {}

  if (source.key !== 'demo') {
    return null
  }

  return {
    ...source,
    items: normalizeList(source.items),
    content: source.content || {},
  }
}

const heroFeatures = computed(() => {
  return normalizeList(sdkBox.value.hero.features).map(item => {
    const asset = sdkFeatureAssets.find(feature => feature.key === item.key) || {}

    return {
      ...asset,
      ...item,
      key: item.key || asset.key || item.title || '',
    }
  })
})

const demoImageAssets = {
  camera: mediaUrl('/images/sdk/demo-camera.png'),
  audio: mediaUrl('/images/sdk/demo-basic.png'),
}

const demoContent = computed(() => {
  const content = exampleModule.value?.content || {}
  const downloads = normalizeList(content.downloads).map(item => ({
    ...item,
    image: demoImageAssets[item.key] || item.image,
  }))

  return {
    ...content,
    downloads,
  }
})
const demoDownloads = computed(() => demoContent.value.downloads.filter(item => item.key !== 'cast'))

const initialSdkSelection = createInitialSdkSelection()
const activeGroupKey = ref(initialSdkSelection.groupKey)
const activeItemKey = ref(initialSdkSelection.itemKey)
const activeCodeTab = ref('C')
const sdkDownloadPanel = ref(null)
const sdkDownloadKeys = {
  audio: {
    C: 'sdk-card-c',
    'C++': 'sdk-card-cjj',
    'C#': 'sdk-card-cx',
  },
  camera: {
    C: 'sdk-camera-c',
    'C++': 'sdk-camera-cjj',
    'C#': 'sdk-camera-cx',
  },
}
const sdkDemoDownloadKeys = {
  audio: 'sdk-card-demo',
  camera: 'sdk-camera-demo',
}
const pickFirstText = (source, keys) => {
  return keys
    .map(key => source?.[key])
    .find(value => String(value || '').trim()) || ''
}
const getSdkDownloadDataFromResponse = (response) => {
  const data = response?.data || response

  return data && typeof data === 'object' ? data : {}
}
const normalizeSdkDownloadConfig = (config = {}) => {
  return {
    downloadUrl: pickFirstText(config, ['file_url', 'downloadUrl', 'download_url', 'url', 'link', 'value']),
  }
}
const getAllSdkDownloadsSafely = () => {
  const entries = Object.entries(sdkDownloadKeys).flatMap(([groupKey, languageKeys]) => {
    return Object.entries(languageKeys).map(([language, apiKey]) => ({ groupKey, language, apiKey }))
  })
  const demoEntries = Object.entries(sdkDemoDownloadKeys).map(([demoKey, apiKey]) => ({
    groupKey: 'demo',
    language: demoKey,
    apiKey,
  }))

  return Promise.all([...entries, ...demoEntries].map(({ groupKey, language, apiKey }) => {
    return getPlatformDownload(apiKey).then(
      response => [`${groupKey}:${language}`, getSdkDownloadDataFromResponse(response)],
      () => [`${groupKey}:${language}`, {}]
    )
  })).then(downloadEntries => Object.fromEntries(downloadEntries))
}
const leadingStandaloneGroups = computed(() => [])
const sdkGroups = computed(() => [
  ...(soundcardModule.value ? [soundcardModule.value] : []),
  ...(cameraModule.value ? [cameraModule.value] : []),
  ...(exampleModule.value ? [exampleModule.value] : []),
])
const accordionGroups = computed(() => sdkGroups.value.filter(group => group.key !== 'demo'))
const standaloneGroups = computed(() => sdkGroups.value.filter(group => group.key === 'demo'))
const sdkItems = computed(() => sdkGroups.value.flatMap(group => group.items || []))
const activeSdkGroup = computed(() => sdkGroups.value.find(group => group.key === activeGroupKey.value) || null)
const activeSdkItem = computed(() => sdkItems.value.find(item => item.key === activeItemKey.value) || null)
const activeSdkModule = computed(() => {
  if (activeGroupKey.value === 'audio') {
    return soundcardModule.value
  }

  return cameraModule.value
})
const sdkLanguageTabs = computed(() => normalizeList(activeSdkModule.value?.languageTabs))

const activeGroupTitle = computed(() => {
  return activeSdkGroup.value?.title || ''
})

const activeItemTitle = computed(() => {
  return activeSdkItem.value?.title || ''
})

const isNoticeView = computed(() => activeItemKey.value === activeSdkModule.value?.defaultItemKey)
const cameraLabels = computed(() => activeSdkModule.value?.labels || {})
const cameraNoticeDocs = computed(() => activeSdkModule.value?.documents?.notice || {})
const cameraNoticeComponentImages = computed(() => activeSdkModule.value?.assets?.noticeComponentImages || {})
const activeNoticeDoc = computed(() => cameraNoticeDocs.value[activeCodeTab.value] || {})
const activeNoticeComponentImage = computed(() => {
  return cameraNoticeComponentImages.value[activeCodeTab.value] || {}
})
const activeNoticeDownloadUrl = computed(() => {
  const groupKey = activeGroupKey.value === 'audio' ? 'audio' : 'camera'
  const config = normalizeSdkDownloadConfig(sdkDownloadConfig.value?.[`${groupKey}:${activeCodeTab.value}`])

  return config.downloadUrl
})
const getDemoDownloadUrl = (demo = {}) => {
  const directConfig = normalizeSdkDownloadConfig(demo)

  if (directConfig.downloadUrl) {
    return directConfig.downloadUrl
  }

  const demoKey = String(demo.key || '').trim()
  const config = normalizeSdkDownloadConfig(sdkDownloadConfig.value?.[`demo:${demoKey}`])

  return config.downloadUrl
}
const isDemoDownloadView = computed(() => activeGroupKey.value === 'demo' || activeItemKey.value.includes('demo'))
const isEmptyContentView = computed(() => activeSdkGroup.value && !activeSdkGroup.value.items?.length && !isNoticeView.value)
const isApiDocView = computed(() => {
  const functionName = activeSdkItem.value?.functionName
  const sdkDoc = activeSdkModule.value?.documents?.functions?.[functionName]

  return Boolean(functionName && sdkDoc && ['path', 'params', 'returns', 'codeSamples'].some((key) => {
    return String(sdkDoc[key] || '').replace(/\r\n?/g, '\n').trim()
  }))
})

const normalizeSdkDocText = value => String(value || '').replace(/\r\n?/g, '\n').trim()

const parseSdkDocRows = (value) => {
  const lines = normalizeSdkDocText(value)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  if (!lines.length) {
    return []
  }

  return lines.map((line) => {
    const separatorIndex = line.search(/[：:]/)

    if (separatorIndex > 0) {
      return {
        name: line.slice(0, separatorIndex).trim(),
        description: line.slice(separatorIndex + 1).trim(),
      }
    }

    const sentenceIndex = line.search(/[；。]/)

    if (sentenceIndex > 0) {
      return {
        name: line.slice(0, sentenceIndex).trim(),
        description: line.slice(sentenceIndex + 1).trim(),
      }
    }

    return { name: '', description: line }
  })
}

const parseSdkCodeSamples = (value) => {
  const text = normalizeSdkDocText(value)

  if (!text) {
    return {}
  }

  const samples = {}
  const pattern = /^(C|C\+\+|C#):\n([\s\S]*?)(?=^(?:C|C\+\+|C#):\n|(?![\s\S]))/gm
  let match = pattern.exec(text)

  while (match) {
    samples[match[1]] = match[2].trim()
    match = pattern.exec(text)
  }

  return samples
}

const parseSdkFunctionPathSamples = (value) => {
  const text = normalizeSdkDocText(value)
  const samples = {}

  if (!text) {
    return samples
  }

  const lines = text.split('\n').map(line => line.trim()).filter(Boolean)

  for (const line of lines) {
    const valueText = line.replace(/[\uFF08(].*?[\uFF09)]/g, '').trim()

    if (/C#/.test(line)) {
      samples['C#'] = valueText
    } else if (/C\/C\+\+/.test(line)) {
      samples.C = valueText
      samples['C++'] = valueText
    } else if (/C\+\+/.test(line)) {
      samples['C++'] = valueText
    } else if (/\bC\b/.test(line)) {
      samples.C = valueText
    }
  }

  return samples
}

const apiDoc = computed(() => {
  const functionName = activeSdkItem.value?.functionName || ''
  const sdkDoc = activeSdkModule.value?.documents?.functions?.[functionName]

  if (sdkDoc) {
    const codeSamples = parseSdkCodeSamples(sdkDoc.codeSamples)

    return {
      codeTabs: sdkLanguageTabs.value,
      title: activeSdkItem.value?.title || '',
      path: normalizeSdkDocText(sdkDoc.path),
      pathSamples: parseSdkFunctionPathSamples(sdkDoc.path),
      params: parseSdkDocRows(sdkDoc.params),
      responseFields: parseSdkDocRows(sdkDoc.returns),
      code: codeSamples.C || '',
      codeSamples,
    }
  }

  return {
    codeTabs: [],
    title: '',
    path: '',
    pathSamples: {},
    params: [],
    responseFields: [],
    code: '',
    codeSamples: {},
  }
})

const activeFunctionPath = computed(() => apiDoc.value.pathSamples?.[activeCodeTab.value] || apiDoc.value.path || '')
const activeCode = computed(() => apiDoc.value.codeSamples?.[activeCodeTab.value] || apiDoc.value.code || '')
const hasApiLanguageTabs = computed(() => {
  return apiDoc.value.codeTabs.length > 0
    && (Object.keys(apiDoc.value.pathSamples || {}).length > 0 || Object.keys(apiDoc.value.codeSamples || {}).length > 0)
})
const copiedCodeKey = ref('')
let copyCodeResetTimer = null
const activeCodeCopyKey = computed(() => `${activeSdkItem.value?.key || 'sdk'}:${activeCodeTab.value}`)
const isActiveCodeCopied = computed(() => copiedCodeKey.value === activeCodeCopyKey.value)
const copyCodeButtonAriaLabel = computed(() => {
  return isActiveCodeCopied.value ? cameraLabels.value.codeCopied : cameraLabels.value.copyCode
})

const isMobileSdkLayout = () => {
  return import.meta.client && window.matchMedia('(max-width: 980px)').matches
}

const scrollToSdkDownloadPanel = async () => {
  if (!isMobileSdkLayout()) return

  await nextTick()
  sdkDownloadPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const selectSdkItem = (item, scrollOnMobile = true) => {
  if (!item) return

  activeItemKey.value = item.key

  if (scrollOnMobile) {
    void scrollToSdkDownloadPanel()
  }
}

const toggleGroup = (key) => {
  activeGroupKey.value = activeGroupKey.value === key ? '' : key
}

const selectStandaloneGroup = (group, scrollOnMobile = false) => {
  activeGroupKey.value = group.key

  if (group.items?.[0]) {
    activeItemKey.value = group.items[0].key
  } else {
    activeItemKey.value = ''
  }

  if (scrollOnMobile) {
    void scrollToSdkDownloadPanel()
  }
}

const handleDemoDownload = (demo) => {
  if (!process.client) {
    return
  }

  const downloadUrl = getDemoDownloadUrl(demo)

  if (!downloadUrl) {
    showRequestFailToast()
    return
  }

  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = ''
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const copyCode = async (code) => {
  if (!process.client) {
    return false
  }

  const codeText = String(code || '')

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(codeText)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = codeText
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)

      try {
        textarea.select()
        if (!document.execCommand('copy')) {
          throw new Error('Copy failed')
        }
      } finally {
        document.body.removeChild(textarea)
      }
    }

    showRequestSuccessToast()
    return true
  } catch {
    showRequestFailToast()
    return false
  }
}

const copyActiveCode = async () => {
  const didCopy = await copyCode(activeCode.value)

  if (!didCopy || !process.client) {
    return
  }

  const copiedKey = activeCodeCopyKey.value
  copiedCodeKey.value = copiedKey

  if (copyCodeResetTimer) {
    window.clearTimeout(copyCodeResetTimer)
  }

  copyCodeResetTimer = window.setTimeout(() => {
    if (copiedCodeKey.value === copiedKey) {
      copiedCodeKey.value = ''
    }

    copyCodeResetTimer = null
  }, 1600)
}

const selectSdkGroupByKey = (key) => {
  const group = sdkGroups.value.find(item => item.key === key)

  if (!group) {
    return false
  }

  activeGroupKey.value = group.key

  const defaultItem = group.items?.find(item => item.key === group.defaultItemKey)
  const firstItem = defaultItem || group.items?.[0]

  if (firstItem) {
    activeItemKey.value = firstItem.key
  } else {
    activeItemKey.value = ''
  }

  return true
}

const syncSdkTargetFromRoute = () => {
  const target = getSdkTargetFromRoute()

  if (target === 'api') {
    const apiGroup = sdkGroups.value.find(group => group.items?.some(item => item.functionName))
    const firstApiItem = apiGroup?.items.find(item => item.functionName)

    if (apiGroup && firstApiItem) {
      activeGroupKey.value = apiGroup.key
      activeItemKey.value = firstApiItem.key
    }

    return
  }

  const targetMap = {
    camera: 'camera',
    audio: 'audio',
  }

  if (targetMap[target]) {
    if (target === 'audio' && !soundcardModule.value) {
      activeGroupKey.value = 'audio'
      activeItemKey.value = 'audio-notice'
      return
    }

    if (target === 'camera' && !cameraModule.value) {
      activeGroupKey.value = 'camera'
      activeItemKey.value = 'camera-notice'
      return
    }

    selectSdkGroupByKey(targetMap[target])
  }
}

useLocalizedAsyncState({
  locale,
  loadedLocale: sdkBoxLocale,
  load: currentLocale => getSdks(currentLocale),
  sync: response => {
    sdkBox.value = getSdkBoxFromResponse(response)
  },
  reset: () => {
    sdkBox.value = createEmptySdkBox()
  },
})

useLocalizedAsyncState({
  locale,
  loadedLocale: cameraModuleLocale,
  load: currentLocale => getCameras(currentLocale),
  sync: response => {
    cameraModule.value = getCameraModuleFromResponse(response)
  },
  reset: () => {
    cameraModule.value = null
  },
})

useLocalizedAsyncState({
  locale,
  loadedLocale: soundcardModuleLocale,
  load: currentLocale => getSoundcards(currentLocale),
  sync: response => {
    soundcardModule.value = getSoundcardModuleFromResponse(response)
  },
  reset: () => {
    soundcardModule.value = null
  },
})

useLocalizedAsyncState({
  locale,
  loadedLocale: exampleModuleLocale,
  load: currentLocale => getExamples(currentLocale),
  sync: response => {
    exampleModule.value = getExampleModuleFromResponse(response)
  },
  reset: () => {
    exampleModule.value = null
  },
})

onMounted(() => {
  syncSdkTargetFromRoute()
  getAllSdkDownloadsSafely().then((downloads) => {
    sdkDownloadConfig.value = downloads
  })
})

onBeforeUnmount(() => {
  if (copyCodeResetTimer && process.client) {
    window.clearTimeout(copyCodeResetTimer)
  }
})

watch(() => route.query.sdkTarget, () => {
  syncSdkTargetFromRoute()
})

watch(cameraModule, (module) => {
  if (!module) {
    return
  }

  if (activeGroupKey.value === 'camera' && !sdkLanguageTabs.value.includes(activeCodeTab.value)) {
    activeCodeTab.value = sdkLanguageTabs.value[0] || ''
  }

  syncSdkTargetFromRoute()
})

watch(soundcardModule, (module) => {
  if (!module) {
    return
  }

  if (activeGroupKey.value === 'audio' && !sdkLanguageTabs.value.includes(activeCodeTab.value)) {
    activeCodeTab.value = sdkLanguageTabs.value[0] || ''
  }

  syncSdkTargetFromRoute()
})

setupPageSeo('sdk', () => sdkBox.value.seo)
</script>

<style scoped>
.sdk-page-shell {
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

.sdk-page-main {
  width: 100%;
  flex: 1;
  background: var(--theme-route-page-background, var(--page-route-background));
}

.sdk-hero {
  width: 100%;
  padding: 42px 0 38px;
  background: var(--theme-sdk-hero-background);
}

.sdk-hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.sdk-eyebrow {
  min-width: 74px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid var(--theme-primary-border);
  border-radius: 999px;
  color: var(--theme-cyan-light);
  background: var(--theme-primary-soft);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

:root[data-theme="light"] .sdk-eyebrow {
  color: rgba(96, 165, 250, 1);
  background: rgba(59, 130, 246, 0.1);
}

.sdk-hero h1 {
  margin-top: 14px;
  color: var(--theme-sdk-hero-title, var(--theme-white));
  font-size: 58px;
  font-weight: 900;
  line-height: 68px;
}

.sdk-hero p {
  max-width: 700px;
  margin-top: 12px;
  color: var(--theme-sdk-hero-text, var(--theme-text-muted));
  font-size: 20px;
  line-height: 30px;
}

.sdk-feature-row {
  width: min(100%, 660px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  margin-top: 30px;
}

.sdk-feature {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 7px;
}

.sdk-feature-icon {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  color: var(--theme-accent);
  background: var(--theme-surface-78);
}

:root[data-theme="light"] .sdk-feature:nth-child(1) .sdk-feature-icon {
  background: rgba(219, 234, 254, 0.72);
}

:root[data-theme="light"] .sdk-feature:nth-child(2) .sdk-feature-icon {
  background: rgba(220, 252, 231, 0.72);
}

:root[data-theme="light"] .sdk-feature:nth-child(3) .sdk-feature-icon {
  background: rgba(243, 232, 255, 0.72);
}

:root[data-theme="light"] .sdk-feature:nth-child(4) .sdk-feature-icon {
  background: rgba(255, 237, 213, 0.72);
}

.sdk-feature-icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.sdk-feature strong {
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 16px;
  line-height: 24px;
}

:root[data-theme="light"] .sdk-feature:nth-child(1) strong,
:root[data-theme="light"] .sdk-feature:nth-child(1) span:last-child {
  color: rgba(40, 115, 253, 1);
}

:root[data-theme="light"] .sdk-feature:nth-child(2) strong,
:root[data-theme="light"] .sdk-feature:nth-child(2) span:last-child {
  color: rgba(22, 163, 74, 1);
}

:root[data-theme="light"] .sdk-feature:nth-child(3) strong,
:root[data-theme="light"] .sdk-feature:nth-child(3) span:last-child {
  color: rgba(147, 51, 234, 1);
}

:root[data-theme="light"] .sdk-feature:nth-child(4) strong,
:root[data-theme="light"] .sdk-feature:nth-child(4) span:last-child {
  color: rgba(249, 115, 22, 1);
}

.sdk-feature span:last-child {
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  font-size: 14px;
  line-height: 20px;
}

.sdk-content-section {
  width: 100%;
  padding: 32px 0 88px;
  background: var(--theme-route-page-background, var(--page-route-background));
}

.sdk-content-layout {
  display: grid;
  grid-template-columns: 303px 830px;
  justify-content: center;
  gap: 18px;
}

.sdk-sidebar {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 14px;
  overflow-anchor: none;
}

.sdk-sidebar-accordion,
.sdk-sidebar-single {
  overflow: hidden;
  border: 1px solid var(--theme-sdk-card-border, var(--theme-surface-soft));
  border-radius: 20px;
  background: var(--theme-sdk-card-background, var(--theme-surface-88));
}

.sdk-sidebar-group + .sdk-sidebar-group {
  border-top: 1px solid var(--theme-sdk-card-border, var(--theme-surface-soft));
}

.sdk-sidebar-single-active {
  border-color: var(--theme-extra-14-165-233-055);
}

.sdk-sidebar-group-button {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: var(--theme-sdk-title, var(--theme-text-light));
  text-align: left;
  cursor: pointer;
}

.sdk-sidebar-icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  border-radius: 8px;
  color: var(--theme-white);
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-purple));
}

.sdk-sidebar-title {
  min-width: 0;
  display: grid;
  gap: 2px;
  flex: 1 1 auto;
}

.sdk-sidebar-title strong,
.sdk-sidebar-title small {
  overflow-wrap: anywhere;
}

.sdk-sidebar-title strong {
  font-size: 13px;
  line-height: 18px;
}

.sdk-sidebar-title small {
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  font-size: 11px;
  line-height: 14px;
}

.sdk-sidebar-chevron {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: var(--theme-text-muted);
  transition: transform 0.2s ease;
}

.sdk-sidebar-group-open .sdk-sidebar-chevron {
  transform: rotate(180deg);
}

.sdk-sidebar-arrow {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: var(--theme-text-muted);
}

.sdk-sidebar-items-wrap {
  display: grid;
  overflow-anchor: none;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 0.25s ease;
}

.sdk-sidebar-items-wrap-open {
  grid-template-rows: 1fr;
}

.sdk-sidebar-items {
  min-height: 0;
  display: grid;
  overflow: hidden;
  padding: 0;
}

.sdk-sidebar-items-wrap-open .sdk-sidebar-items {
  padding-bottom: 8px;
}

.sdk-sidebar-item {
  min-height: 32px;
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 8px;
  padding: 7px 13px 7px 18px;
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  cursor: pointer;
}

.sdk-sidebar-item span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.sdk-sidebar-item svg {
  width: 13px;
  height: 13px;
}

.sdk-sidebar-item-active {
  color: var(--theme-profile-field-action, var(--theme-white));
  background: var(--theme-sdk-sidebar-active-background, linear-gradient(90deg, var(--theme-extra-14-165-233-044), var(--theme-extra-59-130-246-02)));
}

.sdk-help-panel {
  padding: 24px 26px;
  border: 1px solid var(--theme-sdk-card-border, var(--theme-surface-soft));
  border-radius: 10px;
  background: var(--theme-sdk-card-background, var(--theme-surface-88));
}

.sdk-help-panel h2 {
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 16px;
  font-weight: 800;
  line-height: 22px;
}

.sdk-help-panel p {
  margin-top: 18px;
  color: var(--theme-sdk-muted, var(--theme-text-secondary));
  font-size: 12px;
  line-height: 20px;
}

.sdk-help-button {
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 22px;
  border-radius: 6px;
  color: var(--theme-white);
  background: linear-gradient(90deg, var(--theme-accent), var(--theme-primary-strong));
  font-size: 13px;
  font-weight: 800;
}

.sdk-download-panel {
  width: 830px;
  min-width: 0;
  scroll-margin-top: calc(var(--page-header-height) + 12px);
  padding: 28px 24px 24px;
  border: 1px solid var(--theme-sdk-card-border, var(--theme-surface-soft));
  border-radius: 10px;
  background: var(--theme-sdk-panel-background, var(--theme-surface-soft-92));
}

.sdk-breadcrumb {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  font-size: 12px;
  line-height: 18px;
}

.sdk-breadcrumb svg {
  width: 12px;
  height: 12px;
}

.sdk-breadcrumb strong {
  color: var(--theme-sdk-title, var(--theme-white));
  font-weight: 700;
}

.sdk-download-panel h2 {
  margin-top: 34px;
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 26px;
  font-weight: 900;
  line-height: 34px;
}

.sdk-download-copy {
  margin-top: 10px;
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  font-size: 13px;
  line-height: 22px;
}

.sdk-demo-list {
  display: grid;
  gap: 16px;
  margin-top: 18px;
}

.sdk-demo-card {
  position: relative;
  overflow: hidden;
  width: 770px;
  height: auto;
  min-height: 240px;
  aspect-ratio: auto;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 24px;
  padding: 18px;
  border: 0;
  border-radius: 10px;
  background-color: var(--theme-surface);
  background-image: var(--sdk-demo-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.sdk-demo-art {
  min-height: 204px;
}

.sdk-demo-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sdk-demo-content h3 {
  color: var(--theme-cyan-light);
  font-size: 20px;
  font-weight: 900;
  line-height: 28px;
}

.sdk-demo-card-purple .sdk-demo-content h3 {
  color: var(--theme-extra-196-181-253-1);
}

.sdk-demo-card-cyan .sdk-demo-content h3 {
  color: var(--theme-extra-94-234-212-1);
}

.sdk-demo-content p {
  margin-top: 9px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 20px;
}

.sdk-download-button {
  width: 100%;
  height: 38px;
  min-height: 38px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  border-radius: 6px;
  color: var(--theme-white);
  background: linear-gradient(90deg, var(--theme-accent), var(--theme-primary-strong));
  font-size: 13px;
  font-weight: 800;
}

.sdk-demo-card-purple .sdk-download-button {
  background: linear-gradient(90deg, var(--theme-extra-167-139-250-1), var(--theme-purple));
}

.sdk-demo-card-cyan .sdk-download-button {
  background: linear-gradient(90deg, var(--theme-accent), var(--theme-extra-20-184-166-1));
}

.sdk-download-button svg {
  width: 15px;
  height: 15px;
}

.sdk-api-doc {
  margin-top: 34px;
}

.sdk-notice-doc {
  margin-top: 34px;
}

.sdk-api-doc h2,
.sdk-notice-doc h2 {
  margin-top: 0;
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 16px;
  font-weight: 900;
  line-height: 24px;
}

.sdk-api-path {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 0 24px;
  border: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  border-radius: 7px;
  color: var(--theme-sdk-text, var(--theme-white));
  background: var(--theme-sdk-table-background, var(--theme-surface));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 20px;
}

.sdk-doc-section {
  margin-top: 24px;
}

.sdk-doc-section h3 {
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 16px;
  font-weight: 900;
  line-height: 24px;
}

.sdk-language-title {
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 16px;
  font-weight: 900;
  line-height: 24px;
}

.sdk-notice-copy {
  margin-top: 10px;
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  font-size: 12px;
  line-height: 20px;
}

.sdk-notice-download-button {
  min-width: 148px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 0 18px;
  border-radius: 6px;
  color: var(--theme-white);
  background: linear-gradient(90deg, var(--theme-accent), var(--theme-primary-strong));
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

.sdk-notice-download-button svg {
  width: 15px;
  height: 15px;
}

.sdk-table,
.sdk-response-card {
  overflow: hidden;
  margin-top: 12px;
  border: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  border-radius: 7px;
  background: var(--theme-sdk-table-background, var(--theme-surface));
}

.sdk-code-block {
  position: relative;
  overflow: hidden;
  margin-top: 12px;
  border: 1px solid var(--theme-sdk-code-border, var(--theme-surface-soft));
  border-radius: 9px;
  background: var(--theme-sdk-code-background, var(--theme-surface));
}

.sdk-notice-image-wrap {
  overflow-x: auto;
  margin-top: 12px;
}

.sdk-notice-image {
  display: block;
  max-width: 100%;
  height: auto;
  border: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  border-radius: 7px;
  background: var(--theme-sdk-table-background, var(--theme-surface));
}

.sdk-notice-path-grid {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.sdk-notice-path-item {
  min-width: 0;
  display: grid;
  gap: 8px;
  padding: 16px 18px;
  border: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  border-radius: 7px;
  background: var(--theme-sdk-table-background, var(--theme-surface));
}

.sdk-notice-path-item strong {
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 12px;
  line-height: 18px;
}

.sdk-notice-path-item code {
  color: var(--theme-sdk-param-text, var(--theme-accent));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 18px;
  overflow-wrap: anywhere;
}

.sdk-notice-table {
  overflow: hidden;
  margin-top: 12px;
  border: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  border-radius: 7px;
  background: var(--theme-sdk-table-background, var(--theme-surface));
}

.sdk-notice-table-row {
  min-height: 58px;
  display: grid;
  grid-template-columns: minmax(130px, 0.82fr) minmax(150px, 1fr) minmax(0, 1.45fr);
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  color: var(--theme-sdk-text, var(--theme-text-muted));
  font-size: 12px;
  line-height: 18px;
}

.sdk-notice-table-2-columns .sdk-notice-table-row {
  grid-template-columns: minmax(310px, 0.95fr) minmax(0, 1.45fr);
}

.sdk-notice-table-row > span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.sdk-notice-table-row:not(.sdk-notice-table-head) > span:first-child {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

.sdk-notice-table-row + .sdk-notice-table-row {
  border-top: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
}

.sdk-notice-table-head {
  min-height: 44px;
  color: var(--theme-sdk-title, var(--theme-white));
  font-weight: 800;
}

.sdk-notice-code-group {
  margin-top: 12px;
}

.sdk-notice-code-block pre {
  padding: 52px 22px 18px;
}

.sdk-code-copy-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 6px;
  color: var(--theme-sdk-code-header-text, var(--theme-text-light));
  background: var(--theme-sdk-code-button-background, var(--theme-surface-soft));
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.sdk-code-copy-button:hover,
.sdk-code-copy-button:focus-visible,
.sdk-code-copy-button-copied {
  color: var(--theme-white);
  background: var(--theme-primary);
}

.sdk-code-copy-button:active {
  transform: translateY(1px);
}

.sdk-code-copy-button svg {
  width: 15px;
  height: 15px;
}

.sdk-table-row {
  min-height: 76px;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  padding: 16px 24px;
  color: var(--theme-sdk-text, var(--theme-text-muted));
  font-size: 12px;
  line-height: 18px;
}

.sdk-table-row + .sdk-table-row {
  border-top: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
}

.sdk-param-name {
  width: fit-content;
  min-width: 0;
  max-width: 260px;
  min-height: 34px;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  border-radius: 7px;
  color: var(--theme-sdk-param-text, var(--theme-accent));
  background: var(--theme-sdk-param-background, var(--theme-extra-14-74-112-088));
  font-weight: 800;
  line-height: 18px;
  overflow-wrap: anywhere;
  text-align: center;
}

.sdk-code-tabs {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.sdk-language-tabs {
  margin-top: 12px;
  margin-bottom: 18px;
}

.sdk-code-tab {
  width: 110px;
  height: 34px;
  border-radius: 7px;
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  background: var(--theme-sdk-tab-background, var(--theme-surface));
  font-size: 12px;
  font-weight: 800;
}

.sdk-code-tab-active {
  color: var(--theme-sdk-param-text, var(--theme-accent));
  background: var(--theme-sdk-tab-active-background, var(--theme-extra-14-74-112-088));
}

.sdk-code-block pre {
  margin: 0;
  padding: 52px 22px 18px;
  overflow-x: auto;
  color: var(--theme-sdk-code-text, var(--theme-accent-text));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 21px;
  white-space: pre-wrap;
  tab-size: 2;
}

@media (max-width: 980px) {
  .sdk-feature-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sdk-content-layout {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .sdk-sidebar {
    order: 1;
  }

  .sdk-download-panel {
    width: 100%;
    order: 2;
  }

  .sdk-demo-card {
    width: 100%;
    max-width: 770px;
    height: auto;
    min-height: 240px;
    aspect-ratio: auto;
  }

}

@media (max-width: 900px) {
  .sdk-hero {
    display: none;
  }

  .sdk-content-section {
    padding: 18px 0 64px;
  }

  .sdk-content-layout {
    gap: 14px;
  }

  .sdk-sidebar {
    width: 100%;
  }

  .sdk-download-panel {
    padding: 22px 16px;
  }

  .sdk-breadcrumb {
    flex-wrap: wrap;
  }

  .sdk-download-panel h2 {
    margin-top: 22px;
    font-size: 22px;
    line-height: 30px;
  }

  .sdk-api-doc,
  .sdk-notice-doc {
    margin-top: 24px;
  }

  .sdk-code-tabs {
    flex-wrap: wrap;
    gap: 8px;
  }

  .sdk-code-tab {
    width: auto;
    min-width: 78px;
    padding: 0 14px;
  }

  .sdk-api-path {
    min-height: 0;
    align-items: flex-start;
    padding: 14px 16px;
    overflow-wrap: anywhere;
  }

  .sdk-table-row,
  .sdk-notice-table-row,
  .sdk-notice-table-2-columns .sdk-notice-table-row {
    grid-template-columns: 1fr;
    align-items: start;
    gap: 8px;
    min-height: 0;
    padding: 14px 16px;
  }

  .sdk-table-row > span[aria-hidden="true"] {
    display: none;
  }

  .sdk-table-row > span,
  .sdk-notice-table-row > span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .sdk-param-name {
    max-width: 100%;
    justify-content: flex-start;
    text-align: left;
  }

  .sdk-code-block pre {
    padding: 50px 16px 16px;
  }
}

@media (max-width: 640px) {
  .sdk-feature-row {
    gap: 16px;
  }

  .sdk-demo-card {
    width: 100%;
    height: auto;
    min-height: 240px;
    aspect-ratio: auto;
    grid-template-columns: 1fr;
    gap: 0;
    padding: 0;
    background-image: none;
    background-color: var(--theme-surface);
  }

  .sdk-demo-art {
    min-height: 0;
    aspect-ratio: 770 / 242;
    background-image: var(--sdk-demo-image);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .sdk-demo-content {
    padding: 16px 18px 18px;
    background: linear-gradient(180deg, rgba(31, 20, 74, 0.98), rgba(17, 24, 39, 1));
  }

  .sdk-demo-card-cyan .sdk-demo-content {
    background: linear-gradient(180deg, rgba(8, 58, 64, 0.98), rgba(17, 24, 39, 1));
  }

  .sdk-demo-content h3 {
    font-size: 18px;
    line-height: 25px;
  }

  .sdk-demo-content p {
    margin-top: 8px;
    line-height: 20px;
  }

  .sdk-download-button {
    margin-top: 14px;
  }

}
</style>
