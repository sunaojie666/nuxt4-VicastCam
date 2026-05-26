<template>
  <div class="privacy-page-shell">
    <SiteHeader />

    <main class="privacy-page-main">
      <section class="privacy-hero-section" aria-labelledby="privacy-hero-title">
        <div class="privacy-hero-inner">
          <span class="privacy-hero-eyebrow">隐私政策</span>

          <h1 id="privacy-hero-title" class="privacy-hero-title">
            <span>VicastCam</span>
            <span class="theme-gradient-text">用户隐私与数据保护</span>
          </h1>

          <p class="privacy-hero-subtitle">
            <span>了解我们如何收集、使用、保存和保护您的个人信息。</span>
          </p>
        </div>
      </section>

      <div class="page-container privacy-layout">
        <aside class="privacy-sidebar" aria-label="政策目录">
          <button
            v-for="item in privacyMenuItems"
            :key="item.key"
            type="button"
            :class="['privacy-menu-item', { 'privacy-menu-item-active': item.key === activeSectionKey }]"
            @click="activeSectionKey = item.key"
          >
            <Icon :name="item.icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
            <Icon class="privacy-menu-chevron" name="lucide:chevron-right" aria-hidden="true" />
          </button>
        </aside>

        <article class="privacy-content-card" aria-labelledby="privacy-title">
          <header class="privacy-content-header">
            <nav class="privacy-breadcrumb" aria-label="当前位置">
              <span>隐私政策</span>
              <Icon name="lucide:chevron-right" aria-hidden="true" />
              <strong>{{ activeSectionTitle }}</strong>
            </nav>

            <button type="button" class="privacy-share-button" aria-label="分享">
              <Icon name="lucide:share-2" aria-hidden="true" />
            </button>
          </header>

          <div class="privacy-article">
            <h1 id="privacy-title">{{ privacyPolicy.title }}</h1>

            <section
              v-for="section in privacyPolicy.sections"
              :key="section.key"
              :id="section.key"
              class="privacy-section"
            >
              <h2>{{ section.title }}</h2>
              <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
            </section>
          </div>
        </article>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../../components/SiteFooter.vue'
import SiteHeader from '../../components/SiteHeader.vue'
import { setupPageSeo } from '../../utils/seo'

const activeSectionKey = ref('privacy-overview')

const privacyPolicy = {
  title: '隐私政策',
  sections: [
    {
      key: 'privacy-overview',
      title: '概述',
      paragraphs: [
        '保护个人信息是VicastCam的核心价值观之一。本隐私声明详细说明了我们如何收集和使用您在我们网站上提供的个人信息。同时，它也告知了您在个人信息使用方面的选择权，以及您可以采取哪些措施来更改这些信息，或要求我们纠正或删除相关信息。',
        'VicastCam遵守美国商务部制定的安全港框架规定，该框架涉及从欧盟地区收集、使用和存储数据的相关事项。',
      ],
    },
    {
      key: 'privacy-collection',
      title: '信息收集',
      paragraphs: [
        '与大多数网站一样，我们也会自动收集信息，并将这些信息存储在日志文件中。这些信息包括互联网协议地址、浏览器类型、互联网服务供应商、访问页面、操作系统、日期和时间戳以及用户点击流数据。',
        '我们使用这些信息分析趋势、管理网站、跟踪用户在网站中的行为并收集有关整体受众的统计信息。我们不会将自动收集的数据链接到个人可识别的信息。',
        '我们还会收集您向我们主动提供的信息，例如您创建账户、提交表单、订阅服务或联系我们时提供的姓名、邮箱地址、公司信息和其他联系信息。这些信息用于处理您的请求、提供服务、改进产品体验以及履行我们的合同义务。',
        '除非获得您的明确同意，或法律要求我们这样做，否则我们不会出售、出租或以其他方式向第三方披露您的个人信息。我们可能会与服务供应商共享必要信息，以便他们代表我们提供托管、分析、支付、客户支持和通信等服务。',
      ],
    },
    {
      key: 'privacy-cookies',
      title: 'Cookie 使用',
      paragraphs: [
        '“Cookie”是一种小型文件，其中包含一串字符。当您访问某个网站时，该网站会将这种Cookie发送到您的电脑上。下次您再次访问同一网站时，Cookie能够帮助网站识别您的浏览器。',
        'Cookie可以用来存储用户的偏好设置以及其他相关信息。您可以重新设置浏览器，让其拒绝所有Cookie，或者在发送新的Cookie被发送时得到提示。不过，如果没有Cookie的话，一些网站的功能或服务可能无法正常使用。',
        '我们使用Cookies来提升您的在线体验，并了解您使用我们服务的方式，从而改进服务质量。当您访问我们的网站时，我们的服务器会自动记录相关信息，包括URL、IP地址、浏览器类型和语言，以及访问的日期和时间。',
      ],
    },
  ],
}

const privacyMenuItems = [
  { key: 'privacy-overview', label: '概述', icon: 'lucide:shield-check' },
  { key: 'privacy-collection', label: '信息收集', icon: 'lucide:database' },
  { key: 'privacy-cookies', label: 'Cookie 使用', icon: 'lucide:cookie' },
]

const activeSectionTitle = computed(() => {
  return privacyMenuItems.find(item => item.key === activeSectionKey.value)?.label || privacyPolicy.title
})

setupPageSeo('privacy')
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

.privacy-article h1 {
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 30px;
  font-weight: 900;
  line-height: 42px;
}

.privacy-section {
  margin-top: 18px;
}

.privacy-section h2 {
  margin-bottom: 8px;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 18px;
  font-weight: 800;
  line-height: 28px;
}

.privacy-section h2:empty {
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

  .privacy-article h1 {
    font-size: 24px;
    line-height: 32px;
  }
}
</style>
