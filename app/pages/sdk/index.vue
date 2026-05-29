<template>
  <div class="sdk-page-shell">
    <SiteHeader />

    <main class="sdk-page-main">
      <section class="sdk-hero">
        <div class="page-container sdk-hero-inner">
          <span class="sdk-eyebrow">SDK</span>
          <h1>VicastCam SDK</h1>
          <p>强大、稳定、易用的音视频虚拟设备与投屏解决方案，助力开发者快速集成。</p>

          <div class="sdk-feature-row" aria-label="SDK优势">
            <article v-for="feature in heroFeatures" :key="feature.title" class="sdk-feature">
              <span class="sdk-feature-icon">
                <img :src="feature.icon" :alt="feature.title">
              </span>
              <strong>{{ feature.title }}</strong>
              <span>{{ feature.text }}</span>
            </article>
          </div>
        </div>
      </section>

      <section class="sdk-content-section">
        <div class="page-container sdk-content-layout">
          <aside class="sdk-sidebar" aria-label="SDK目录">
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
                      @click="activeItemKey = item.key"
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
              <button type="button" class="sdk-sidebar-group-button" @click="selectStandaloneGroup(group)">
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

            <div class="sdk-help-panel">
              <h2>需要帮助？</h2>
              <p>如果在接入过程中遇到问题，请随时联系我们的技术支持团队。</p>
              <button type="button">联系技术支持</button>
            </div>
          </aside>

          <section class="sdk-download-panel" aria-labelledby="sdk-content-title">
            <nav class="sdk-breadcrumb" aria-label="当前位置">
              <span>SDK文档</span>
              <Icon name="lucide:chevron-right" aria-hidden="true" />
              <span>{{ activeGroupTitle }}</span>
              <Icon name="lucide:chevron-right" aria-hidden="true" />
              <strong>{{ activeItemTitle }}</strong>
            </nav>

            <template v-if="isDemoDownloadView">
              <h2 id="sdk-content-title">Demo下载</h2>
              <p class="sdk-download-copy">选择对应业务场景的示例工程，快速验证 VicastCam SDK 的虚拟相机、虚拟声卡和投屏能力。</p>

              <div class="sdk-demo-list">
                <article
                  v-for="demo in demoDownloads"
                  :key="demo.key"
                  :class="['sdk-demo-card', `sdk-demo-card-${demo.theme}`]"
                  :style="{ backgroundImage: `url(${demo.image})` }"
                >
                  <div class="sdk-demo-art" aria-hidden="true"></div>

                  <div class="sdk-demo-content">
                    <h3>{{ demo.title }}</h3>
                    <p>{{ demo.description }}</p>

                    <div class="sdk-demo-tags">
                      <span v-for="tag in demo.tags" :key="tag">{{ tag }}</span>
                    </div>

                    <button type="button" class="sdk-download-button" @click="handleDemoDownload(demo)">
                      <Icon name="lucide:download" aria-hidden="true" />
                      <span>立即下载</span>
                    </button>
                  </div>
                </article>
              </div>
            </template>

            <div v-else class="sdk-api-doc">
              <h2 id="sdk-content-title">{{ apiDoc.title }}</h2>
              <div class="sdk-api-path">{{ apiDoc.path }}</div>

              <section class="sdk-doc-section" aria-labelledby="sdk-query-title">
                <h3 id="sdk-query-title">请求参数</h3>
                <div class="sdk-table">
                  <div class="sdk-table-head">
                    <span>Query 参数</span>
                  </div>
                  <div v-for="param in apiDoc.params" :key="param.name" class="sdk-table-row">
                    <span class="sdk-param-name">{{ param.name }}</span>
                    <span>{{ param.type }}</span>
                    <span>{{ param.description }}</span>
                    <strong>{{ param.required }}</strong>
                  </div>
                </div>
              </section>

              <section class="sdk-doc-section" aria-labelledby="sdk-code-title">
                <h3 id="sdk-code-title">请求示例代码</h3>
                <div class="sdk-code-tabs" role="tablist">
                  <button
                    v-for="tab in apiDoc.codeTabs"
                    :key="tab"
                    type="button"
                    :class="['sdk-code-tab', { 'sdk-code-tab-active': tab === activeCodeTab }]"
                    @click="activeCodeTab = tab"
                  >
                    {{ tab }}
                  </button>
                </div>
                <div class="sdk-code-block">
                  <div class="sdk-code-header">
                    <span>示例代码</span>
                    <button type="button" aria-label="复制示例代码" @click="copyCode(apiDoc.code)">
                      <Icon name="lucide:copy" aria-hidden="true" />
                    </button>
                  </div>
                  <pre><code>{{ apiDoc.code }}</code></pre>
                </div>
              </section>

              <section class="sdk-doc-section" aria-labelledby="sdk-response-title">
                <h3 id="sdk-response-title">返回响应</h3>
                <div class="sdk-response-card">
                  <div class="sdk-response-status">
                    <span></span>
                    <strong>200</strong>
                    <span>成功</span>
                  </div>
                  <div class="sdk-response-body">
                    <div class="sdk-response-fields">
                      <div v-for="(field, index) in apiDoc.responseFields" :key="`${field.name}-${index}`" class="sdk-table-row">
                        <span class="sdk-param-name">{{ field.name }}</span>
                        <span>{{ field.type }}</span>
                        <span>{{ field.description }}</span>
                        <strong>{{ field.required }}</strong>
                      </div>
                    </div>
                    <div class="sdk-response-example">
                      <div class="sdk-response-example-header">
                        <strong>示例</strong>
                        <button type="button" aria-label="复制返回示例" @click="copyCode(apiDoc.responseExample)">
                          <Icon name="lucide:copy" aria-hidden="true" />
                        </button>
                      </div>
                      <pre><code>{{ apiDoc.responseExample }}</code></pre>
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
import { setupPageSeo } from '../../utils/seo'

const { showRequestSuccessToast, showRequestFailToast } = useSiteToast()
const route = useRoute()

const heroFeatures = [
  { title: '全面兼容', text: '支持多平台多场景', icon: '/images/sdk/feature-compatible.png' },
  { title: '专业支持', text: '7*24小时技术支持', icon: '/images/sdk/feature-support.png' },
  { title: '简单易用', text: '提供丰富的API接口', icon: '/images/sdk/feature-api.png' },
  { title: '安全稳定', text: '高性能传输与隐私保护', icon: '/images/sdk/feature-secure.png' },
]

const sdkGroups = [
  {
    key: 'camera',
    title: '虚拟相机',
    count: '12个',
    icon: 'lucide:camera',
    items: [
      { key: 'camera-qrcode', title: '获取二维码' },
      { key: 'camera-sdk-1', title: 'SDK介绍' },
      { key: 'camera-sdk-2', title: 'SDK接入' },
      { key: 'camera-sdk-3', title: 'SDK体验' },
      { key: 'camera-sdk-4', title: 'SDK实例' },
      { key: 'camera-sdk-5', title: 'SDK文档' },
      { key: 'camera-sdk-6', title: 'SDK下载' },
    ],
  },
  {
    key: 'audio',
    title: '虚拟声卡',
    count: '12个',
    icon: 'lucide:volume-2',
    items: [
      { key: 'audio-overview', title: '功能概览' },
      { key: 'audio-demo', title: 'Demo下载' },
    ],
  },
  {
    key: 'cast',
    title: '虚拟投屏',
    count: '12个',
    icon: 'lucide:screen-share',
    items: [
      { key: 'cast-overview', title: '功能概览' },
      { key: 'cast-demo', title: 'Demo下载' },
    ],
  },
  {
    key: 'guide',
    title: '第三方库',
    count: '2个',
    icon: 'lucide:library',
    items: [
      { key: 'guide-install', title: '集成方式' },
    ],
  },
  {
    key: 'demo',
    title: 'Demo下载',
    count: '12个',
    icon: 'lucide:download',
    items: [
      { key: 'demo-download', title: 'Demo下载' },
    ],
  },
]

const demoDownloads = [
  {
    key: 'cast',
    title: '投屏Demo下载',
    description: '包含无线投屏、高清投屏、多屏互动等功能示例，适用于手机投屏、会议投屏、直播投屏等场景。',
    tags: ['Windows', 'C++/C#', '86MB'],
    image: '/images/sdk/demo-basic.png',
    theme: 'blue',
  },
  {
    key: 'camera',
    title: '虚拟相机Demo下载',
    description: '包含虚拟摄像头创建、画面渲染、背景替换、特效展示等功能示例，适用于视频会议、直播等场景。',
    tags: ['Windows', 'C++/C#', '86MB'],
    image: '/images/sdk/demo-camera.png',
    theme: 'purple',
  },
  {
    key: 'audio',
    title: '虚拟相机Demo下载',
    description: '包含虚拟音频设备创建、音频混流、背景音效、等功能示例，适用于录播会议、直播场景等场景。',
    tags: ['Windows', 'C++/C#', '86MB'],
    image: '/images/sdk/demo-stream.png',
    theme: 'cyan',
  },
]

const activeGroupKey = ref('camera')
const activeItemKey = ref('camera-qrcode')
const activeCodeTab = ref('C')

const accordionGroups = computed(() => sdkGroups.slice(0, 3))
const standaloneGroups = computed(() => sdkGroups.slice(3))

const activeGroupTitle = computed(() => {
  return sdkGroups.find(group => group.key === activeGroupKey.value)?.title || '资源下载'
})

const activeItemTitle = computed(() => {
  const items = sdkGroups.flatMap(group => group.items)
  return items.find(item => item.key === activeItemKey.value)?.title || '资源下载'
})

const isDemoDownloadView = computed(() => activeGroupKey.value === 'demo' || activeItemKey.value.includes('demo'))

const apiDoc = {
  title: '获取扫码登录二维码',
  path: '/v1/GetQrcode',
  params: [
    { name: 'platform', type: 'string', description: '平台类型，支持 pc、xr', required: '必需' },
  ],
  codeTabs: ['C', 'C++'],
  code: `curl --request GET \\
  --url 'https://api.vicastcam.com/v1/GetQrcode?platform=pc' \\
  --header 'Authorization: Bearer YOUR_TOKEN'`,
  responseFields: [
    { name: 'platform', type: 'string', description: '状态码，0正常，非0错误。', required: '必需' },
    { name: 'platform', type: 'string', description: '状态码，0正常，非0错误。', required: '必需' },
  ],
  responseExample: `{
  "error_code": 0,
  "data": {
    "uuid": "27cc670b2856db1",
    "qrcode": "data:image/png;base64,..."
  },
  "msg": "生成uuid成功!"
}`,
}

const toggleGroup = (key) => {
  activeGroupKey.value = activeGroupKey.value === key ? '' : key

  const group = sdkGroups.find(item => item.key === key)
  if (group?.items?.[0]) {
    activeItemKey.value = group.items[0].key
  }
}

const selectStandaloneGroup = (group) => {
  activeGroupKey.value = group.key

  if (group.items?.[0]) {
    activeItemKey.value = group.items[0].key
  }
}

const handleDemoDownload = (demo) => {
  if (!process.client) {
    return
  }

}

const copyCode = async (code) => {
  if (!process.client) {
    return
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    showRequestSuccessToast()
  } catch {
    showRequestFailToast()
  }
}

const getSingleQueryValue = value => Array.isArray(value) ? value[0] : value

const selectSdkGroupByKey = (key) => {
  const group = sdkGroups.find(item => item.key === key)

  if (!group) {
    return
  }

  activeGroupKey.value = group.key

  if (group.items?.[0]) {
    activeItemKey.value = group.items[0].key
  }
}

const syncSdkTargetFromRoute = () => {
  const target = String(getSingleQueryValue(route.query.sdkTarget) || '').trim().toLowerCase()
  const targetMap = {
    camera: 'camera',
    audio: 'audio',
    cast: 'cast',
  }

  if (targetMap[target]) {
    selectSdkGroupByKey(targetMap[target])
  }
}

onMounted(() => {
  syncSdkTargetFromRoute()
})

watch(() => route.query.sdkTarget, () => {
  syncSdkTargetFromRoute()
})

setupPageSeo('sdk')
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
}

.sdk-sidebar-items-wrap-open {
  max-height: 360px;
}

.sdk-sidebar-items {
  display: grid;
  padding: 0 0 8px;
}

.sdk-sidebar-item {
  min-height: 32px;
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 8px;
  padding: 0 13px 0 18px;
  color: var(--theme-sdk-muted, var(--theme-text-muted));
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  cursor: pointer;
}

.sdk-sidebar-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.sdk-help-panel button {
  width: 100%;
  height: 40px;
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
  height: 240px;
  aspect-ratio: 770 / 240;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 24px;
  padding: 18px;
  border: 0;
  border-radius: 10px;
  background-color: var(--theme-surface);
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
  color: var(--theme-text-secondary);
  font-size: 12px;
  line-height: 20px;
}

.sdk-demo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.sdk-demo-tags span {
  min-width: 54px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 4px;
  color: var(--theme-text-secondary);
  background: var(--theme-surface-44);
  font-size: 10px;
  font-weight: 700;
}

.sdk-download-button {
  width: 100%;
  height: 38px;
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

.sdk-api-doc h2 {
  margin-top: 0;
}

.sdk-api-path {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 0 24px;
  border: 1px solid var(--theme-sdk-path-border, var(--theme-extra-14-165-233-024));
  border-radius: 7px;
  color: var(--theme-sdk-text, var(--theme-white));
  background: var(--theme-sdk-path-background, var(--theme-extra-14-74-112-078));
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

.sdk-table,
.sdk-response-card {
  overflow: hidden;
  margin-top: 12px;
  border: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  border-radius: 7px;
  background: var(--theme-sdk-table-background, var(--theme-surface));
}

.sdk-code-block {
  overflow: hidden;
  margin-top: 12px;
  border: 1px solid var(--theme-sdk-code-border, var(--theme-surface-soft));
  border-radius: 9px;
  background: var(--theme-sdk-code-background, var(--theme-surface));
}

.sdk-table-head {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  color: var(--theme-sdk-title, var(--theme-white));
  background: var(--theme-sdk-table-head-background, transparent);
  font-size: 12px;
  font-weight: 800;
}

.sdk-code-header {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 18px;
  border-bottom: 1px solid var(--theme-sdk-code-border, var(--theme-surface-soft));
  color: var(--theme-sdk-code-header-text, var(--theme-white));
  background: var(--theme-sdk-code-header-background, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  font-weight: 700;
}

.sdk-table-row {
  min-height: 76px;
  display: grid;
  grid-template-columns: 120px 90px minmax(0, 1fr) 54px;
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

.sdk-table-row strong {
  color: var(--theme-warning);
  font-weight: 900;
}

.sdk-param-name {
  min-width: 86px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: var(--theme-sdk-param-text, var(--theme-accent));
  background: var(--theme-sdk-param-background, var(--theme-extra-14-74-112-088));
  font-weight: 800;
}

.sdk-code-tabs {
  display: flex;
  gap: 12px;
  margin-top: 12px;
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

.sdk-code-header button,
.sdk-response-example-header button {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--theme-accent);
  background: var(--theme-sdk-copy-button-background, var(--theme-extra-14-74-112-088));
}

.sdk-code-header button {
  background: var(--theme-sdk-code-button-background, var(--theme-extra-14-74-112-088));
}

.sdk-code-header svg,
.sdk-response-example-header svg {
  width: 15px;
  height: 15px;
}

.sdk-code-block pre,
.sdk-response-example pre {
  margin: 0;
  padding: 18px 22px;
  overflow-x: auto;
  color: var(--theme-sdk-code-text, var(--theme-accent-text));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 21px;
  white-space: pre-wrap;
  tab-size: 2;
}

.sdk-response-status {
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  border-bottom: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
  color: var(--theme-success);
  font-size: 12px;
  font-weight: 800;
}

.sdk-response-status span:first-child {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--theme-success);
}

.sdk-response-body {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
}

.sdk-response-fields {
  border-right: 1px solid var(--theme-sdk-table-border, var(--theme-surface-soft));
}

.sdk-response-example {
  min-width: 0;
  padding-top: 22px;
}

.sdk-response-example-header {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 24px;
}

.sdk-response-example-header strong {
  color: var(--theme-warning);
  font-size: 12px;
  line-height: 18px;
}

.sdk-response-example pre {
  color: var(--theme-warning);
  padding-top: 8px;
}

@media (max-width: 980px) {
  .sdk-feature-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sdk-content-layout {
    grid-template-columns: 1fr;
  }

  .sdk-sidebar {
    order: 2;
  }

  .sdk-download-panel {
    width: 100%;
    order: 1;
  }

  .sdk-demo-card {
    width: 100%;
    max-width: 770px;
    height: auto;
    min-height: auto;
    aspect-ratio: 770 / 240;
  }

  .sdk-response-body {
    grid-template-columns: 1fr;
  }

  .sdk-response-fields {
    border-right: 0;
    border-bottom: 1px solid var(--theme-surface-soft);
  }
}

@media (max-width: 640px) {
  .sdk-hero {
    padding-top: 34px;
  }

  .sdk-hero h1 {
    font-size: 34px;
    line-height: 42px;
  }

  .sdk-feature-row {
    gap: 16px;
  }

  .sdk-demo-card {
    width: 100%;
    height: auto;
    min-height: auto;
    aspect-ratio: 770 / 240;
    grid-template-columns: 1fr;
  }

  .sdk-demo-art {
    min-height: 112px;
  }

  .sdk-download-panel {
    padding: 22px 16px;
  }

  .sdk-table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
