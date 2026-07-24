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

            <div
              v-if="sdkBox.help.title || sdkBox.help.description || sdkBox.help.buttonText"
              class="sdk-help-panel"
            >
              <h2 v-if="sdkBox.help.title">{{ sdkBox.help.title }}</h2>
              <p v-if="sdkBox.help.description">{{ sdkBox.help.description }}</p>
              <button v-if="sdkBox.help.buttonText" type="button">{{ sdkBox.help.buttonText }}</button>
            </div>
          </aside>

          <section class="sdk-download-panel" aria-labelledby="sdk-content-title">
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
                  :style="{ backgroundImage: `url(${demo.image})` }"
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
              <button type="button" class="sdk-notice-download-button">
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

            <div v-else class="sdk-api-doc">
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

              <h2 id="sdk-content-title">{{ cameraLabels.callFunction }}</h2>
              <div class="sdk-api-path">{{ activeFunctionPath }}</div>

              <section class="sdk-doc-section" aria-labelledby="sdk-function-params-title">
                <h3 id="sdk-function-params-title">{{ cameraLabels.functionParameters }}</h3>
                <div class="sdk-table">
                  <div v-for="(param, index) in apiDoc.params" :key="`${param.name}-${index}`" class="sdk-table-row">
                    <span v-if="param.name" class="sdk-param-name">{{ param.name }}</span>
                    <span v-else aria-hidden="true"></span>
                    <span>{{ param.description }}</span>
                  </div>
                </div>
              </section>

              <section class="sdk-doc-section" aria-labelledby="sdk-code-title">
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

              <section class="sdk-doc-section" aria-labelledby="sdk-return-title">
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
import { getCameras, getExamples, getSdks, getSoundcards } from '../../api/request/strapi'
import { setupPageSeo } from '../../utils/seo'

const { showRequestSuccessToast, showRequestFailToast } = useSiteToast()
const route = useRoute()
const { locale } = useI18n()

const sdkFeatureAssets = [
  { key: 'compatible', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/feature-compatible.png' },
  { key: 'support', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/feature-support.png' },
  { key: 'api', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/feature-api.png' },
  { key: 'secure', icon: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/feature-secure.png' },
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

const normalizeList = value => Array.isArray(value) ? value.filter(Boolean) : []

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

const staticSdkGroups = [
  {
    key: 'audio',
    title: '虚拟声卡SDK',
    count: '12个',
    icon: 'lucide:volume-2',
    items: [
      { key: 'audio-overview', title: '功能概览' },
      { key: 'audio-demo', title: 'Demo下载' },
    ],
  },
  {
    key: 'camera',
    title: '虚拟相机SDK',
    count: '14个',
    icon: 'lucide:camera',
    items: [
      { key: 'camera-notice', title: 'SDK使用须知' },
      { key: 'camera-load-dll', title: '加载相机dll组件', functionName: 'loadvicastcamdll' },
      { key: 'camera-init', title: '初始化相机', functionName: 'g_vicastcam_InitVcam' },
      { key: 'camera-output-format', title: '设置相机输出格式', functionName: 'g_vicastcam_SetOutputFormat' },
      { key: 'camera-yuy2-frame', title: '输出一帧YUY2画面', functionName: 'g_vicastcam_SendFrameYUY2' },
      { key: 'camera-nv12-frame', title: '输出一帧NV12画面', functionName: 'g_vicastcam_SendFrameNV12' },
      { key: 'camera-media-file-output', title: '多媒体文件输出给相机', functionName: 'g_vicastcam_getMultiMediaToCamera' },
      { key: 'camera-image-file-output', title: '图片文件输出给相机', functionName: 'g_vicastcam_getImageToCamera' },
      { key: 'camera-name', title: '设置相机名称', functionName: 'g_vicastcam_SetFriendlyName' },
      { key: 'camera-license-code', title: '检验授权码', functionName: 'g_vicastcam_SetLicenseCode' },
      { key: 'camera-switch', title: '相机开关', functionName: 'g_vicastcam_setVcamOn' },
      { key: 'camera-mirror-horizontal', title: '设置相机是否左右镜像', functionName: 'g_vicastcam_SetMirrorEnabled' },
      { key: 'camera-flip-vertical', title: '设置相机是否上下翻转', functionName: 'g_vicastcam_SetFlipEnabled' },
      { key: 'camera-rotate-clockwise', title: '设置相机旋转幅度（顺时针）', functionName: 'g_vicastcam_SetRotateRightDegree' },
      { key: 'camera-placeholder', title: '设置相机占位图', functionName: 'g_vicastcam_SetVacantImg' },
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

const defaultDemoContent = {
  title: 'Demo下载',
  description: '选择对应业务场景的示例工程，快速验证 VicastCam SDK 的虚拟相机和虚拟声卡能力。',
  listAriaLabel: 'VicastCam SDK Demo下载列表',
  downloadButtonText: '立即下载',
  downloads: [
    {
      key: 'camera',
      title: '虚拟相机SDK-Demo下载',
      description: '虚拟相机 SDK 可将图片、视频素材封装成系统原生摄像头源，兼容所有直播、推流、会议软件，可无缝集成至自有 Windows 项目，自定义画面输出。',
      image: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/demo-camera.png',
      theme: 'purple',
    },
    {
      key: 'audio',
      title: '虚拟声卡SDK-Demo下载',
      description: '虚拟声卡 SDK 可将外部音频、视频里的音频流转为系统麦克风输入源；支持自定义声卡与麦克风名称，能够无缝集成进 Windows 项目，适配直播推流、语音房间、线上会议等软件。',
      image: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/demo-basic.png',
      theme: 'cyan',
    },
  ],
}

const demoContent = computed(() => {
  const content = exampleModule.value?.content || {}
  const downloads = normalizeList(content.downloads)

  return {
    ...defaultDemoContent,
    ...content,
    downloads: downloads.length ? downloads : defaultDemoContent.downloads,
  }
})
const demoDownloads = computed(() => demoContent.value.downloads.filter(item => item.key !== 'cast'))

const activeGroupKey = ref('camera')
const activeItemKey = ref('camera-notice')
const activeCodeTab = ref('C')
const sdkNoticeComponentImages = {
  C: {
    src: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/notice-c.png',
    alt: 'VicastCam SDK C component folder',
  },
  'C++': {
    src: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/notice-cpp.png',
    alt: 'VicastCam SDK C++ component folder',
  },
  'C#': {
    src: 'https://cdn2.douyinggongchang.com/vicastcam-website-media-20260721/images/sdk/notice-csharp.png',
    alt: 'VicastCam SDK C# component folder',
  },
}

const sdkNoticeDocs = {
  C: {
    title: 'SDK 使用须知',
    description: '本页用于指导 C 语言客户快速接入 VicastCam 虚拟相机 SDK。客户侧只需包含 pre_vicastcam_c.h，并将 dll 文件夹中的运行时 DLL 放到程序执行目录。通过 loadvicastcamdll() 加载 vicastcam.dll 后，即可调用 g_vicastcam_* 函数指针。',
    sections: [
      {
        key: 'components',
        title: '1. SDK 组件文件夹内容',
        description: '下载并解压 VicastCam SDK 组件后，C 组件目录通常包含以下内容。',
        rows: [
          { name: 'pre_vicastcam_c.h', description: 'C 语言预加载头文件，客户程序通过 #include 引入。' },
          { name: 'dll 文件夹', description: '包含 vicastcam.dll 及其运行依赖，运行时需要放到客户程序 exe 同级目录。' },
        ],
      },
      {
        key: 'paths',
        title: '2. 确认客户程序路径',
        description: '接入前先确认客户程序的代码目录和 exe 输出目录，下面以 myprogram 为例。',
        pathItems: [
          { label: '程序代码路径示例', path: String.raw`C:\myprogram\main.c` },
          { label: '程序执行路径示例', path: String.raw`C:\myprogram\x64\Release\myprogram.exe` },
        ],
      },
      {
        key: 'import',
        title: '3. 导入 VicastCam SDK 组件',
        table: {
          headers: ['文件 / 文件夹', '放置位置', '说明'],
          rows: [
            ['pre_vicastcam_c.h', 'C:\\myprogram\\', '与 main.c 平级，供 C 源码直接 #include。'],
            ['dll 文件夹下所有 DLL', 'C:\\myprogram\\x64\\Release\\', '与 myprogram.exe 平级，确保运行时可以加载 vicastcam.dll 及其依赖。'],
          ],
        },
      },
      {
        key: 'main',
        title: '4. 在 main.c 中使用',
        description: '在 main.c 顶部导入头文件，然后加载 DLL、初始化虚拟相机并调用函数指针。',
        codeBlocks: [
          {
            title: '头文件导入',
            code: '#include "pre_vicastcam_c.h"',
          },
          {
            title: '基础初始化和调用示例',
            code: String.raw`#include <windows.h>
#include <stdio.h>
#include "pre_vicastcam_c.h"

int main(void)
{
    int ret = loadvicastcamdll(L"vicastcam.dll");
    if (ret != ERROR_SUCCESS) {
        printf("loadvicastcamdll failed, ret=%d, GetLastError=%lu\n",
               ret,
               GetLastError());
        return ret;
    }

    ret = g_vicastcam_InitVcam();
    if (ret != ERROR_SUCCESS) {
        printf("InitVcam failed, ret=%d, GetLastError=%lu\n",
               ret,
               GetLastError());
        return ret;
    }

    g_vicastcam_SetOutputFormat(1280, 720, 1);  /* 0 = YUY2, non-zero = NV12 */
    g_vicastcam_SetFriendlyName(L"VicastCam");
    g_vicastcam_SetMirrorEnabled(0);
    g_vicastcam_SetFlipEnabled(0);
    g_vicastcam_setVcamOn(1);

    /* Optional: output image or media file to virtual camera */
    /* g_vicastcam_getImageToCamera(L"test.png"); */
    /* g_vicastcam_getMultiMediaToCamera(L"test.mp4"); */

    return 0;
}`,
          },
        ],
      },
    ],
  },
  'C++': {
    title: 'SDK 使用须知',
    description: '本页用于指导 C++ 客户快速接入 VicastCam 虚拟相机 SDK。客户侧只需放置 pre_vicastcam_cplusplus.h 与 dll 文件夹中的运行时 DLL，通过 loadvicastcamdll() 加载 vicastcam.dll，再调用 g_vicastcam_* 函数指针即可。',
    sections: [
      {
        key: 'components',
        title: '1. SDK 组件文件夹内容',
        description: '下载并解压 VicastCam SDK 组件后，C++ 组件目录通常包含以下内容。',
        rows: [
          { name: 'pre_vicastcam_cplusplus.h', description: 'C++ 预加载头文件，客户程序通过 include 引入。' },
          { name: 'dll 文件夹', description: '包含 vicastcam.dll 及其运行依赖，运行时需要放到客户程序 exe 同级目录。' },
        ],
      },
      {
        key: 'paths',
        title: '2. 确认客户程序路径',
        description: '接入前先确认客户程序的代码目录和 exe 执行目录，下面以 myprogram 为例。',
        pathItems: [
          { label: '程序代码路径示例', path: String.raw`F:\myprogram\myprogram\main.cpp` },
          { label: '程序执行路径示例', path: String.raw`F:\myprogram\x64\Release\myprogram.exe` },
        ],
      },
      {
        key: 'import',
        title: '3. 导入 VicastCam SDK 组件',
        table: {
          headers: ['文件 / 文件夹', '放置位置', '说明'],
          rows: [
            ['pre_vicastcam_cplusplus.h', 'F:\\myprogram\\myprogram\\', '与 main.cpp 平级，供 C++ 源码直接 include。'],
            ['dll 文件夹下所有 DLL', 'F:\\myprogram\\x64\\Release\\', '与 myprogram.exe 平级，确保运行时可以加载 vicastcam.dll 及其依赖。'],
          ],
        },
      },
      {
        key: 'main',
        title: '4. 在 main.cpp 中使用',
        description: '在 main.cpp 顶部导入预加载头文件，然后加载 DLL、初始化虚拟相机并调用函数指针。',
        codeBlocks: [
          {
            title: '头文件导入',
            code: '#include "pre_vicastcam_cplusplus.h"',
          },
          {
            title: '基础初始化和调用示例',
            code: String.raw`#include <windows.h>
#include <iostream>
#include "pre_vicastcam_cplusplus.h"

int main()
{
    int ret = loadvicastcamdll(L"vicastcam.dll");
    if (ret != ERROR_SUCCESS) {
        std::cout << "loadvicastcamdll failed, ret=" << ret
                  << ", GetLastError=" << GetLastError() << std::endl;
        return ret;
    }

    ret = g_vicastcam_InitVcam();
    if (ret != ERROR_SUCCESS) {
        std::cout << "InitVcam failed, ret=" << ret
                  << ", GetLastError=" << GetLastError() << std::endl;
        return ret;
    }

    g_vicastcam_SetOutputFormat(1280, 720, 1);  // 0 = YUY2，非 0 = NV12
    g_vicastcam_SetFriendlyName(L"VicastCam");
    g_vicastcam_SetMirrorEnabled(0);
    g_vicastcam_SetFlipEnabled(0);
    g_vicastcam_setVcamOn(1);

    // 可选：输出图片或视频到虚拟相机
    // g_vicastcam_getImageToCamera(L"test.png");
    // g_vicastcam_getMultiMediaToCamera(L"test.mp4");

    return 0;
}`,
          },
        ],
      },
    ],
  },
  'C#': {
    title: 'SDK 使用须知',
    description: '本页用于指导 C# 客户快速接入 VicastCam 虚拟相机 SDK。客户侧只需将 pre_vicastcam_csharp.cs 添加到 C# 项目，并将 dll 文件夹中的运行时 DLL 放到程序输出目录。通过 PreVicastCam.LoadVicastCamDll() 加载 vicastcam.dll 后，即可调用 PreVicastCam.g_vicastcam_* 委托。',
    sections: [
      {
        key: 'components',
        title: '1. SDK 组件文件夹内容',
        description: '下载并解压 VicastCam SDK 组件后，C# 组件目录通常包含以下内容。',
        rows: [
          { name: 'pre_vicastcam_csharp.cs', description: 'C# 预加载桥接文件，需要加入项目参与编译。' },
          { name: 'dll 文件夹', description: '包含 vicastcam.dll 及其运行依赖，运行时需要放到客户程序 exe 同级目录。' },
        ],
      },
      {
        key: 'paths',
        title: '2. 确认客户程序路径',
        description: '接入前先确认客户程序的代码目录和 exe 输出目录，下面以 myprogram 为例。',
        pathItems: [
          { label: '程序代码路径示例', path: String.raw`C:\myprogram\main.cs` },
          { label: '程序执行路径示例', path: String.raw`C:\myprogram\bin\Release\net8.0-windows\myprogram.exe` },
        ],
      },
      {
        key: 'import',
        title: '3. 导入 VicastCam SDK 组件',
        table: {
          headers: ['文件 / 文件夹', '放置位置', '说明'],
          rows: [
            ['pre_vicastcam_csharp.cs', 'C:\\myprogram\\', '与 main.cs 平级，并在 Visual Studio 中添加到 C# 项目，或放入 SDK-style 项目目录自动编译。'],
            ['dll 文件夹下所有 DLL', 'C:\\myprogram\\bin\\Release\\net8.0-windows\\', '与 myprogram.exe 平级，确保运行时可以加载 vicastcam.dll 及其依赖。'],
          ],
        },
      },
      {
        key: 'main',
        title: '4. 在 main.cs 中使用',
        description: '将 pre_vicastcam_csharp.cs 加入项目后，C# 代码可直接调用 PreVicastCam。',
        codeBlocks: [
          {
            title: '项目导入说明',
            code: '// pre_vicastcam_csharp.cs 与 main.cs 一起参与编译，无需 include，也不需要 vcamplugin.lib。',
          },
          {
            title: '基础初始化和调用示例',
            code: String.raw`using System;
using System.Runtime.InteropServices;

class Program
{
    private const int ERROR_SUCCESS = 0;

    static void Main()
    {
        int ret = PreVicastCam.LoadVicastCamDll("vicastcam.dll");
        if (ret != ERROR_SUCCESS)
        {
            Console.WriteLine($"LoadVicastCamDll failed, ret={ret}, GetLastWin32Error={Marshal.GetLastWin32Error()}");
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
            return;
        }

        Console.WriteLine("LoadVicastCamDll success.");

        ret = PreVicastCam.g_vicastcam_InitVcam();
        if (ret != ERROR_SUCCESS)
        {
            Console.WriteLine($"InitVcam failed, ret={ret}, GetLastWin32Error={Marshal.GetLastWin32Error()}");
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
            return;
        }

        Console.WriteLine("InitVcam success.");

        ret = PreVicastCam.g_vicastcam_SetOutputFormat(1280, 720, 1);
        if (ret != ERROR_SUCCESS)
        {
            Console.WriteLine($"SetOutputFormat failed, ret={ret}, GetLastWin32Error={Marshal.GetLastWin32Error()}");
            Console.ReadKey();
            return;
        }

        PreVicastCam.g_vicastcam_SetFriendlyName("VicastCam777");
        PreVicastCam.g_vicastcam_SetMirrorEnabled(0);
        PreVicastCam.g_vicastcam_SetFlipEnabled(0);
        PreVicastCam.g_vicastcam_setVcamOn(1);

        Console.WriteLine("VicastCam SDK initialized successfully.");
        Console.WriteLine("Press any key to exit...");
        Console.ReadKey();

        // PreVicastCam.g_vicastcam_getMultiMediaToCamera("test.mp4");
    }
}`,
          },
        ],
      },
    ],
  },
}

const leadingStandaloneGroups = computed(() => [])
const sdkGroups = computed(() => [
  ...(soundcardModule.value ? [soundcardModule.value] : []),
  ...(cameraModule.value ? [cameraModule.value] : []),
  ...staticSdkGroups.filter(group => group.key !== 'camera' &&
    (group.key !== 'audio' || !soundcardModule.value) &&
    (group.key !== 'demo' || !exampleModule.value)),
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
  return activeSdkGroup.value?.title || '资源下载'
})

const activeItemTitle = computed(() => {
  return activeSdkItem.value?.title || ''
})

const isNoticeView = computed(() => activeItemKey.value === activeSdkModule.value?.defaultItemKey)
const defaultCameraLabels = {
  sidebarAriaLabel: 'SDK目录',
  breadcrumbAriaLabel: '当前位置',
  breadcrumbRoot: 'SDK文档',
  developmentLanguage: '开发语言',
  callFunction: '调用函数',
  functionParameters: '函数参数',
  exampleCode: '调用示例代码',
  returnValues: '返回值及其含义',
  copyCode: '复制代码',
  codeCopied: '代码已复制',
  downloadComponent: '下载SDK组件',
}
const cameraLabels = computed(() => {
  const labels = activeSdkModule.value?.labels || {}

  return Object.fromEntries(Object.entries(defaultCameraLabels).map(([key, fallback]) => {
    const value = String(labels[key] || '').trim()
    return [key, value && !value.includes('?') ? value : fallback]
  }))
})
const cameraNoticeDocs = computed(() => activeSdkModule.value?.documents?.notice || {})
const cameraNoticeComponentImages = computed(() => activeSdkModule.value?.assets?.noticeComponentImages || {})
const activeNoticeDoc = computed(() => cameraNoticeDocs.value[activeCodeTab.value] || {})
const activeNoticeComponentImage = computed(() => {
  return cameraNoticeComponentImages.value[activeCodeTab.value] || {}
})
const isDemoDownloadView = computed(() => activeGroupKey.value === 'demo' || activeItemKey.value.includes('demo'))
const isEmptyContentView = computed(() => activeSdkGroup.value && !activeSdkGroup.value.items?.length && !isNoticeView.value)

const createSdkFunctionCodeSamples = (functionName) => {
  if (!functionName) {
    return {
      C: '// 待补充',
      'C++': '// 待补充',
      'C#': '// 待补充',
    }
  }

  return {
    C: `${functionName}(...);`,
    'C++': `${functionName}(...);`,
    'C#': `${functionName}(...);`,
  }
}

const sdkFunctionParams = {
  InitVcam: [
    { name: '无参数', description: '' },
  ],
  SetOutputFormat: [
    { name: 'width', description: '输出宽度，必须 > 0，内部会规范为偶数，最大 4096。' },
    { name: 'height', description: '输出高度，必须 > 0，内部会规范为偶数，最大 4096。' },
    { name: 'format', description: '输出格式，0 = YUY2，非 0 = NV12；不再指定 fps。' },
  ],
  SendFrameYUY2: [
    { name: 'i_yuy2', description: 'YUY2 原始帧数据指针。' },
    { name: 'i_width', description: '输入帧宽度，建议偶数。' },
    { name: 'i_height', description: '输入帧高度，建议偶数。' },
    { name: 'i_stride', description: '每行字节数，通常为 i_width * 2。' },
  ],
  SendFrameNV12: [
    { name: 'i_nv12', description: 'NV12 原始帧数据指针，Y 平面后接交错 UV 平面。' },
    { name: 'i_width', description: '输入帧宽度，必须为偶数。' },
    { name: 'i_height', description: '输入帧高度，必须为偶数。' },
    { name: 'i_stride', description: 'Y/UV 每行字节数，通常为 i_width。' },
  ],
  getMultiMediaToCamera: [
    { name: 'tmpPath', description: '多媒体文件路径，wchar_t*，支持绝对路径或相对调用方 EXE 目录路径。' },
    { name: '', description: '支持格式：由当前 FFmpeg 构建决定，常见 mp4/avi/mkv/mov 等。' },
    { name: '', description: '函数为阻塞式播放：音频送默认扬声器，视频按媒体时间轴送虚拟相机。' },
  ],
  getImageToCamera: [
    { name: 'tmpPath', description: '图片文件路径，wchar_t*，支持绝对路径或相对调用方 EXE 目录路径。' },
    { name: '', description: '支持格式：由当前 FFmpeg 构建决定，常见 png/jpg/jpeg/bmp/webp/gif 等。' },
    { name: '', description: '静态图发送一帧；动态图/GIF 按自身时间戳逐帧推送。' },
  ],
  SetFriendlyName: [
    { name: 'friendly_name', description: '虚拟相机显示名称，wchar_t*。' },
    { name: '', description: '支持多语言 Unicode 名称；内部会去除非法注册表/设备名字符并限制长度。' },
  ],
  SetLicenseCode: [
    { name: 'license_code', description: '授权码字符串，char*。' },
    { name: '', description: '当前示例校验码为 ASCII 字符串；未调用或校验失败时，画面会显示居中 “vicastcam” 水印。' },
  ],
  setVcamOn: [
    { name: 'isOn', description: '相机输出开关，int。' },
    { name: '', description: '0 = false，始终显示占位图。' },
    { name: '', description: '非 0 = true，优先显示真实输入帧。' },
  ],
  SetMirrorEnabled: [
    { name: 'enabled', description: '左右镜像开关，int。' },
    { name: '', description: '0 = false，关闭镜像。' },
    { name: '', description: '非 0 = true，开启左右镜像。' },
  ],
  SetFlipEnabled: [
    { name: 'enabled', description: '上下翻转开关，int。' },
    { name: '', description: '0 = false，关闭上下翻转。' },
    { name: '', description: '非 0 = true，开启上下翻转。' },
  ],
  SetRotateRightDegree: [
    { name: 'degree', description: '顺时针旋转幅度。' },
    { name: '', description: '0 = +90°，1 = +180°，2 = +270°。' },
    { name: '', description: '调用效果会累积；非法值会设置 ERROR_INVALID_PARAMETER。' },
  ],
  SetVacantImg: [
    { name: 'imgPath', description: 'BMP 占位图路径，wchar_t*。' },
    { name: '', description: '支持绝对路径或相对调用方 EXE 目录路径。' },
    { name: '', description: '仅支持 BMP；设置成功后按当前用户持久化保存。' },
  ],
}

const sdkFunctionCodeSamples = {
  InitVcam: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = InitVcam();
if (ret != ERROR_SUCCESS) { DWORD err = GetLastError(); }`,
    'C++': String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = InitVcam();
if (ret != ERROR_SUCCESS) { DWORD err = ::GetLastError(); }`,
    'C#': String.raw`using System.Runtime.InteropServices;
[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int InitVcam();
int ret = InitVcam();
int err = Marshal.GetLastWin32Error();`,
  },
  SetOutputFormat: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = SetOutputFormat(1280, 720, 1); // 1=NV12`,
    'C++': String.raw`int ret = SetOutputFormat(1920, 1080, 0); // 0=YUY2
if (ret != ERROR_SUCCESS) DWORD err = ::GetLastError();`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int SetOutputFormat(int width, int height, int format);
int ret = SetOutputFormat(1280, 720, 1);`,
  },
  SendFrameYUY2: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
unsigned char* yuy2 = frameBuffer;
int ret = SendFrameYUY2(yuy2, width, height, width * 2);`,
    'C++': String.raw`std::vector<unsigned char> yuy2(width * height * 2);
int ret = SendFrameYUY2(yuy2.data(), width, height, width * 2);`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int SendFrameYUY2(byte[] data, int w, int h, int stride);
byte[] yuy2 = new byte[w * h * 2];
int ret = SendFrameYUY2(yuy2, w, h, w * 2);`,
  },
  SendFrameNV12: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
unsigned char* nv12 = frameBuffer;
int ret = SendFrameNV12(nv12, width, height, width);`,
    'C++': String.raw`std::vector<unsigned char> nv12(width * height * 3 / 2);
int ret = SendFrameNV12(nv12.data(), width, height, width);`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int SendFrameNV12(byte[] data, int w, int h, int stride);
byte[] nv12 = new byte[w * h * 3 / 2];
int ret = SendFrameNV12(nv12, w, h, w);`,
  },
  getMultiMediaToCamera: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = getMultiMediaToCamera(L"media\\demo.mp4");`,
    'C++': String.raw`std::wstring path = L"media\\demo.mp4";
int ret = getMultiMediaToCamera((wchar_t*)path.c_str());`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CharSet=CharSet.Unicode, CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int getMultiMediaToCamera(string path);
int ret = getMultiMediaToCamera(@"media\demo.mp4");`,
  },
  getImageToCamera: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = getImageToCamera(L"images\\demo.png");`,
    'C++': String.raw`std::wstring path = L"images\\demo.png";
int ret = getImageToCamera((wchar_t*)path.c_str());`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CharSet=CharSet.Unicode, CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int getImageToCamera(string path);
int ret = getImageToCamera(@"images\demo.png");`,
  },
  SetFriendlyName: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = SetFriendlyName(L"影优尽优虚拟相机");`,
    'C++': String.raw`std::wstring name = L"VicastCam 虚拟相机";
int ret = SetFriendlyName((wchar_t*)name.c_str());`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CharSet=CharSet.Unicode, CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int SetFriendlyName(string name);
int ret = SetFriendlyName("影优尽优虚拟相机");`,
  },
  SetLicenseCode: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = SetLicenseCode("VICAST-SDK-LICENSE-2026");`,
    'C++': String.raw`const char* code = "VICAST-SDK-LICENSE-2026";
int ret = SetLicenseCode((char*)code);`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CharSet=CharSet.Ansi, CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int SetLicenseCode(string code);
int ret = SetLicenseCode("VICAST-SDK-LICENSE-2026");`,
  },
  setVcamOn: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
setVcamOn(1);`,
    'C++': String.raw`setVcamOn(0);
DWORD err = ::GetLastError();`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern void setVcamOn(int isOn);
setVcamOn(1);
int err = Marshal.GetLastWin32Error();`,
  },
  SetMirrorEnabled: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
SetMirrorEnabled(1);`,
    'C++': String.raw`SetMirrorEnabled(0);
DWORD err = ::GetLastError();`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern void SetMirrorEnabled(int enabled);
SetMirrorEnabled(1);
int err = Marshal.GetLastWin32Error();`,
  },
  SetFlipEnabled: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
SetFlipEnabled(1);`,
    'C++': String.raw`SetFlipEnabled(0);
DWORD err = ::GetLastError();`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern void SetFlipEnabled(int enabled);
SetFlipEnabled(1);
int err = Marshal.GetLastWin32Error();`,
  },
  SetRotateRightDegree: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
SetRotateRightDegree(0); // 顺时针90度`,
    'C++': String.raw`SetRotateRightDegree(1); // 顺时针180度
DWORD err = ::GetLastError();`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern void SetRotateRightDegree(int degree);
SetRotateRightDegree(2);
int err = Marshal.GetLastWin32Error();`,
  },
  SetVacantImg: {
    C: String.raw`#include <windows.h>
#include "vicastcam_sdk.h"
int ret = SetVacantImg(L"images\\vacant.bmp");`,
    'C++': String.raw`std::wstring path = L"images\\vacant.bmp";
int ret = SetVacantImg((wchar_t*)path.c_str());`,
    'C#': String.raw`[DllImport("vicastcam_sdk.dll", CharSet=CharSet.Unicode, CallingConvention=CallingConvention.Cdecl, SetLastError=true)]
static extern int SetVacantImg(string path);
int ret = SetVacantImg(@"images\vacant.bmp");`,
  },
}

const sdkFunctionReturns = {
  InitVcam: [
    { name: 'ERROR_SUCCESS(0)', description: '初始化成功' },
    { name: 'ERROR_OPEN_FAILED', description: '共享内存/新帧事件创建或打开失败' },
  ],
  SetOutputFormat: [
    { name: 'ERROR_SUCCESS(0)', description: '设置成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: '宽高非法、超过上限或偶数规范后无效' },
    { name: 'ERROR_OPEN_FAILED', description: 'SDK共享资源打开失败' },
  ],
  SendFrameYUY2: [
    { name: 'ERROR_SUCCESS(0)', description: '发送成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: '数据指针为空或宽高非法' },
    { name: 'ERROR_OPEN_FAILED', description: '共享资源打开失败' },
    { name: 'ERROR_INVALID_DATA', description: 'YUY2数据尺寸/步长/格式不合法或转换失败' },
    { name: 'ERROR_WRITE_FAULT', description: '写入共享内存失败' },
  ],
  SendFrameNV12: [
    { name: 'ERROR_SUCCESS(0)', description: '发送成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: '数据指针为空或宽高非法' },
    { name: 'ERROR_OPEN_FAILED', description: '共享资源打开失败' },
    { name: 'ERROR_INVALID_DATA', description: 'NV12数据尺寸/步长/格式不合法或转换失败' },
    { name: 'ERROR_WRITE_FAULT', description: '写入共享内存失败' },
  ],
  getMultiMediaToCamera: [
    { name: 'ERROR_SUCCESS(0)', description: '播放完成或推送成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: '路径参数为空' },
    { name: 'ERROR_BAD_PATHNAME', description: '路径解析失败' },
    { name: 'ERROR_FILE_NOT_FOUND', description: '文件不存在' },
    { name: 'ERROR_UNSUPPORTED_TYPE / ERROR_INVALID_DATA', description: '无视频流、解码器不支持或媒体数据损坏' },
  ],
  getImageToCamera: [
    { name: 'ERROR_SUCCESS(0)', description: '图片推送成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: '路径参数为空' },
    { name: 'ERROR_BAD_PATHNAME', description: '路径解析失败' },
    { name: 'ERROR_FILE_NOT_FOUND', description: '文件不存在' },
    { name: 'ERROR_UNSUPPORTED_TYPE / ERROR_INVALID_DATA', description: '无可解码图像流、格式不支持或数据损坏' },
  ],
  SetFriendlyName: [
    { name: 'ERROR_SUCCESS(0)', description: '设置并写入成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: '名称为空或清理后为空' },
    { name: 'ERROR_ACCESS_DENIED', description: '无权限写入用户配置或注册表' },
    { name: 'ERROR_NOT_READY', description: '相机尚未注册或当前位数注册表视图未找到' },
  ],
  SetLicenseCode: [
    { name: 'ERROR_SUCCESS(0)', description: '授权校验成功，去除水印' },
    { name: 'ERROR_ACCESS_DENIED', description: '授权码为空、错误或校验失败' },
    { name: 'ERROR_OPEN_FAILED', description: '共享资源打开失败，无法写入授权状态' },
  ],
  setVcamOn: [
    { name: '无返回值', description: '调用后通过 GetLastError() 判断' },
    { name: 'ERROR_SUCCESS(0)', description: '设置成功' },
    { name: 'ERROR_OPEN_FAILED', description: '共享资源打开失败' },
    { name: 'ERROR_WRITE_FAULT', description: '控制状态写入/通知失败' },
  ],
  SetMirrorEnabled: [
    { name: '无返回值', description: '调用后通过 GetLastError() 判断' },
    { name: 'ERROR_SUCCESS(0)', description: '设置成功' },
    { name: 'ERROR_OPEN_FAILED', description: '共享资源打开失败' },
    { name: 'ERROR_WRITE_FAULT', description: '控制状态写入/通知失败' },
  ],
  SetFlipEnabled: [
    { name: '无返回值', description: '调用后通过 GetLastError() 判断' },
    { name: 'ERROR_SUCCESS(0)', description: '设置成功' },
    { name: 'ERROR_OPEN_FAILED', description: '共享资源打开失败' },
    { name: 'ERROR_WRITE_FAULT', description: '控制状态写入/通知失败' },
  ],
  SetRotateRightDegree: [
    { name: '无返回值', description: '调用后通过 GetLastError() 判断' },
    { name: 'ERROR_SUCCESS(0)', description: '设置成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: 'degree 不是 0/1/2' },
    { name: 'ERROR_OPEN_FAILED', description: '共享资源打开失败' },
    { name: 'ERROR_WRITE_FAULT', description: '控制状态写入/通知失败' },
  ],
  SetVacantImg: [
    { name: 'ERROR_SUCCESS(0)', description: '占位图设置成功' },
    { name: 'ERROR_INVALID_PARAMETER', description: '路径参数为空' },
    { name: 'ERROR_BAD_PATHNAME', description: '路径解析失败' },
    { name: 'ERROR_FILE_NOT_FOUND', description: 'BMP 文件不存在' },
    { name: 'ERROR_INVALID_DATA / ERROR_ACCESS_DENIED', description: '不是有效BMP、尺寸/格式不支持或持久化失败' },
  ],
}

const apiDocBase = {
  params: [
    { name: '', description: '请根据 SDK 头文件填写该函数参数。' },
  ],
  codeTabs: ['C', 'C++', 'C#'],
  responseFields: [
    { name: '', description: '请根据 SDK 头文件填写返回值及其含义。' },
  ],
}

const normalizeSdkDocText = value => String(value || '').replace(/\r\n?/g, '\n').trim()

const parseSdkDocRows = (value, fallbackRows = []) => {
  const lines = normalizeSdkDocText(value)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  if (!lines.length) {
    return fallbackRows
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
  const fallback = createSdkFunctionCodeSamples('')

  if (!text) {
    return fallback
  }

  const samples = { ...fallback }
  const pattern = /^(C|C\+\+|C#):\n([\s\S]*?)(?=^(?:C|C\+\+|C#):\n|(?![\s\S]))/gm
  let match = pattern.exec(text)

  while (match) {
    samples[match[1]] = match[2].trim()
    match = pattern.exec(text)
  }

  return samples
}

const createSdkFunctionPathSamples = (functionName) => {
  if (!functionName) {
    return {
      C: '\u5f85\u8865\u5145',
      'C++': '\u5f85\u8865\u5145',
      'C#': '\u5f85\u8865\u5145',
    }
  }

  return {
    C: functionName,
    'C++': functionName,
    'C#': functionName === 'loadvicastcamdll'
      ? 'PreVicastCam.LoadVicastCamDll'
      : 'PreVicastCam.' + functionName,
  }
}

const parseSdkFunctionPathSamples = (value, functionName) => {
  const text = normalizeSdkDocText(value)
  const samples = createSdkFunctionPathSamples(functionName)

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
      ...apiDocBase,
      codeTabs: sdkLanguageTabs.value,
      title: activeSdkItem.value?.title || 'SDK函数说明',
      path: normalizeSdkDocText(sdkDoc.path) || functionName,
      pathSamples: parseSdkFunctionPathSamples(sdkDoc.path, functionName),
      params: parseSdkDocRows(sdkDoc.params, apiDocBase.params),
      responseFields: parseSdkDocRows(sdkDoc.returns, apiDocBase.responseFields),
      code: codeSamples.C,
      codeSamples,
    }
  }

  const codeSamples = createSdkFunctionCodeSamples('')

  return {
    ...apiDocBase,
    codeTabs: sdkLanguageTabs.value,
    title: activeSdkItem.value?.title || 'SDK函数说明',
    path: '',
    pathSamples: createSdkFunctionPathSamples(''),
    params: [],
    responseFields: [],
    code: codeSamples.C,
    codeSamples,
  }
})

const activeFunctionPath = computed(() => apiDoc.value.pathSamples?.[activeCodeTab.value] || apiDoc.value.path)
const activeCode = computed(() => apiDoc.value.codeSamples?.[activeCodeTab.value] || apiDoc.value.code)
const copiedCodeKey = ref('')
let copyCodeResetTimer = null
const activeCodeCopyKey = computed(() => `${activeSdkItem.value?.key || 'sdk'}:${activeCodeTab.value}`)
const isActiveCodeCopied = computed(() => copiedCodeKey.value === activeCodeCopyKey.value)
const copyCodeButtonAriaLabel = computed(() => {
  return isActiveCodeCopied.value ? cameraLabels.value.codeCopied : cameraLabels.value.copyCode
})

const toggleGroup = (key) => {
  activeGroupKey.value = activeGroupKey.value === key ? '' : key

  const group = sdkGroups.value.find(item => item.key === key)
  if (group?.items?.[0]) {
    activeItemKey.value = group.items[0].key
  } else {
    activeItemKey.value = ''
  }
}

const selectStandaloneGroup = (group) => {
  activeGroupKey.value = group.key

  if (group.items?.[0]) {
    activeItemKey.value = group.items[0].key
  } else {
    activeItemKey.value = ''
  }
}

const handleDemoDownload = (demo) => {
  if (!process.client) {
    return
  }

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

const getSingleQueryValue = value => Array.isArray(value) ? value[0] : value

const selectSdkGroupByKey = (key) => {
  const group = sdkGroups.value.find(item => item.key === key)

  if (!group) {
    return
  }

  activeGroupKey.value = group.key

  if (group.items?.[0]) {
    activeItemKey.value = group.items[0].key
  } else {
    activeItemKey.value = ''
  }
}

const syncSdkTargetFromRoute = () => {
  const target = String(getSingleQueryValue(route.query.sdkTarget) || '').trim().toLowerCase()

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

  if (!sdkLanguageTabs.value.includes(activeCodeTab.value)) {
    activeCodeTab.value = sdkLanguageTabs.value[0] || ''
  }

  syncSdkTargetFromRoute()
})

watch(soundcardModule, (module) => {
  if (!module) {
    return
  }

  if (!sdkLanguageTabs.value.includes(activeCodeTab.value)) {
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
  display: grid;
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

  .sdk-notice-table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
