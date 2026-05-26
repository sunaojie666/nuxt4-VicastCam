<template>
  <section class="faq-content-section" aria-label="问答列表">
    <div class="faq-content-layout">
      <aside class="faq-sidebar" aria-label="问答分类">
        <section
          v-for="group in faqGroups"
          :key="group.key"
          :class="['faq-group', { 'faq-group-active': group.key === activeGroupKey }]"
        >
          <button type="button" class="faq-group-button" @click="toggleFaqGroup(group)">
            <span class="faq-group-icon">
              <Icon :name="group.icon" aria-hidden="true" />
            </span>
            <span class="faq-group-text">
              <strong>{{ group.title }}</strong>
              <small>{{ group.count }}</small>
            </span>
            <Icon class="faq-group-chevron" name="lucide:chevron-down" aria-hidden="true" />
          </button>

          <div :class="['faq-questions-wrap', { 'faq-questions-wrap-open': group.key === activeGroupKey }]">
            <div class="faq-questions">
              <button
                v-for="question in group.questions"
                :key="question.id"
                type="button"
                :class="['faq-question-item', { 'faq-question-item-active': question.id === activeQuestionId }]"
                @click="activeQuestionId = question.id"
              >
                <Icon name="lucide:file-text" aria-hidden="true" />
                <span>{{ question.title }}</span>
                <Icon name="lucide:chevron-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </aside>

      <article class="faq-article">
        <header class="faq-article-header">
          <div class="faq-breadcrumb">
            <span>常见问题</span>
            <Icon name="lucide:chevron-right" aria-hidden="true" />
            <span>{{ activeQuestion.title }}</span>
          </div>

          <button type="button" class="faq-share-button" aria-label="分享">
            <Icon name="lucide:share-2" aria-hidden="true" />
          </button>
        </header>

        <h2>{{ activeQuestion.title }}</h2>

        <div class="faq-meta">
          <span>
            <Icon name="lucide:clock-3" aria-hidden="true" />
            更新时间：2025-04-10
          </span>
          <span>
            <Icon name="lucide:eye" aria-hidden="true" />
            12,403次浏览
          </span>
        </div>

        <p class="faq-summary">5步快速上手 VicastCam</p>

        <div class="faq-rich-content">
          <p>本文将手把手教你在 VicastCam 中完成基础设置，并快速理解直播背景、画面调整和常用功能入口。</p>

          <h3>第一步：打开VicastCam手机App，进入直播间</h3>
          <p>点击软件中的直播入口，按照提示进入直播预览界面，并确认摄像头和麦克风权限已经开启。</p>

          <img class="faq-article-image faq-article-image-small" src="/images/login/background.png" alt="VicastCam手机端直播界面">

          <h3>第二步：打开VicastCam手机App，进入直播间</h3>
          <p>点击软件中的直播入口进入直播间后，选择合适的背景效果和画面比例。你也可以在直播过程中随时调整画面参数。</p>

          <img class="faq-article-image" src="/images/home/virtual/camera-reflection-frame.png" alt="VicastCam桌面端界面">

          <p class="faq-image-caption">图片备注：丰富的预设背景与自定义导入</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const questionTitle = '如何下载与安装VicastCam'

const faqGroups = [
  {
    key: 'common',
    title: '常见问题',
    count: '12件',
    icon: 'lucide:help-circle',
    questions: [
      { id: 'common-1', title: questionTitle },
      { id: 'common-2', title: questionTitle },
      { id: 'common-3', title: questionTitle },
      { id: 'common-4', title: questionTitle },
      { id: 'common-5', title: questionTitle },
      { id: 'common-6', title: questionTitle },
      { id: 'common-7', title: questionTitle },
      { id: 'common-8', title: questionTitle },
    ],
  },
  {
    key: 'software',
    title: '软件相关',
    count: '12件',
    icon: 'lucide:folder',
    questions: [
      { id: 'software-1', title: '如何设置直播画面' },
      { id: 'software-2', title: '如何导入自定义背景' },
    ],
  },
  {
    key: 'live',
    title: '直播相关',
    count: '12件',
    icon: 'lucide:folder',
    questions: [
      { id: 'live-1', title: '如何连接直播平台' },
    ],
  },
  {
    key: 'account',
    title: '账号相关',
    count: '12件',
    icon: 'lucide:folder',
    questions: [
      { id: 'account-1', title: '如何注册和登录账号' },
    ],
  },
  {
    key: 'order',
    title: '订单与账单',
    count: '12件',
    icon: 'lucide:folder',
    questions: [
      { id: 'order-1', title: '如何查看订单记录' },
    ],
  },
  {
    key: 'safe',
    title: '设备安全',
    count: '12件',
    icon: 'lucide:folder',
    questions: [
      { id: 'safe-1', title: '如何保护账号安全' },
    ],
  },
  {
    key: 'download',
    title: '下载安装',
    count: '12件',
    icon: 'lucide:folder',
    questions: [
      { id: 'download-1', title: questionTitle },
    ],
  },
  {
    key: 'advanced',
    title: '高级功能',
    count: '12件',
    icon: 'lucide:folder',
    questions: [
      { id: 'advanced-1', title: '如何调节专业参数' },
    ],
  },
]

const activeGroupKey = ref('common')
const activeQuestionId = ref('common-1')

const toggleFaqGroup = (group) => {
  activeGroupKey.value = activeGroupKey.value === group.key ? '' : group.key

  if (group.key && group.questions?.[0]) {
    activeQuestionId.value = group.questions[0].id
  }
}

const activeQuestion = computed(() => {
  const questions = faqGroups.flatMap(group => group.questions)
  return questions.find(question => question.id === activeQuestionId.value) || questions[0]
})
</script>

<style scoped>
.faq-content-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 0 78px;
  background: var(--page-route-background);
}

.faq-content-layout {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: 305px 830px;
  gap: 20px;
  padding: 0 var(--page-padding-x);
}

.faq-sidebar {
  overflow: hidden;
  width: 305px;
  height: fit-content;
  border: 1px solid var(--theme-route-card-border, var(--theme-border-soft));
  border-radius: var(--theme-route-card-radius, 15px);
  background: var(--theme-route-card-background, var(--theme-surface));
  box-shadow: var(--theme-route-card-shadow, none);
}

.faq-group + .faq-group {
  border-top: 1px solid var(--theme-sdk-card-border, var(--theme-border-soft));
}

.faq-group:last-child {
  border-bottom: 1px solid var(--theme-sdk-card-border, var(--theme-border-soft));
}

.faq-group-button {
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: var(--theme-route-card-title, var(--theme-text-light));
  text-align: left;
  cursor: pointer;
}

.faq-group-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  border-radius: 7px;
  color: var(--theme-white);
  background: linear-gradient(135deg, var(--theme-extra-99-102-241-1), var(--theme-primary));
}

.faq-group-icon svg {
  width: 16px;
  height: 16px;
}

.faq-group-text {
  min-width: 0;
  display: grid;
  gap: 2px;
  flex: 1 1 auto;
}

.faq-group-text strong,
.faq-group-text small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.faq-group-text strong {
  font-size: 13px;
  line-height: 18px;
}

.faq-group-text small {
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 11px;
  line-height: 14px;
}

.faq-group-chevron {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  transition: transform 0.24s ease;
}

.faq-group-active .faq-group-chevron {
  transform: rotate(180deg);
}

.faq-questions-wrap {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  opacity: 0;
  transition:
    grid-template-rows 0.26s ease,
    opacity 0.2s ease;
}

.faq-questions-wrap-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.faq-questions {
  min-height: 0;
  overflow: hidden;
  display: grid;
  padding: 0;
  background: var(--theme-sdk-card-background, var(--theme-route-card-background, var(--theme-surface-soft-58)));
}

.faq-question-item {
  width: 100%;
  height: 40px;
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 8px;
  padding: 0 12px 0 20px;
  color: var(--theme-route-card-text, var(--theme-text-secondary));
  text-align: left;
  cursor: pointer;
}

.faq-question-item-active {
  color: var(--theme-profile-field-action, var(--theme-white));
  background: var(--theme-sdk-sidebar-active-background, var(--theme-extra-14-116-144-055));
}

.faq-question-item svg {
  width: 14px;
  height: 14px;
  color: var(--theme-text-muted);
}

.faq-question-item > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
}

.faq-article {
  width: 830px;
  height: 1138px;
  padding: 20px 28px 24px;
  border: 1px solid var(--theme-route-card-border, var(--theme-primary));
  border-radius: var(--theme-route-card-radius, 15px);
  color: var(--theme-route-card-title, var(--theme-text-light));
  background: var(--theme-route-card-background, var(--theme-surface-soft));
  box-shadow: var(--theme-route-card-shadow, none);
}

.faq-article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.faq-breadcrumb {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 12px;
}

.faq-breadcrumb span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.faq-breadcrumb svg,
.faq-share-button svg {
  width: 14px;
  height: 14px;
}

.faq-share-button {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  cursor: pointer;
  border-radius: 6px;
  background: var(--theme-sdk-table-head-background, transparent);
}

.faq-article h2 {
  margin-top: 34px;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 26px;
  font-weight: 900;
  line-height: 34px;
  overflow-wrap: anywhere;
}

.faq-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 12px;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 12px;
}

.faq-meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.faq-meta svg {
  width: 13px;
  height: 13px;
}

.faq-summary {
  height: 48px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  padding: 0 18px;
  border: 1px solid var(--theme-sdk-table-border, transparent);
  border-radius: 6px;
  color: var(--theme-sdk-title, var(--theme-route-card-title, var(--theme-text-light)));
  background: var(--theme-sdk-table-head-background, var(--theme-extra-14-116-144-05));
  font-size: 14px;
  font-weight: 700;
}

.faq-rich-content {
  margin-top: 18px;
  color: var(--theme-route-card-text, var(--theme-text-secondary));
  font-size: 13px;
  line-height: 24px;
}

.faq-rich-content h3 {
  margin-top: 22px;
  color: var(--theme-route-card-title, var(--theme-white));
  font-size: 16px;
  font-weight: 800;
  line-height: 24px;
}

.faq-rich-content p {
  margin-top: 10px;
  overflow-wrap: anywhere;
}

.faq-article-image {
  width: 100%;
  max-height: 230px;
  margin-top: 16px;
  border-radius: 4px;
  object-fit: cover;
}

.faq-article-image-small {
  width: 118px;
  height: 150px;
}

.faq-image-caption {
  color: var(--theme-route-card-text, var(--theme-text-muted));
  text-align: center;
}

@media (max-width: 900px) {
  .faq-content-layout {
    grid-template-columns: 1fr;
  }

  .faq-sidebar,
  .faq-article {
    width: 100%;
  }

  .faq-sidebar {
    height: auto;
  }

  .faq-article {
    min-height: 0;
  }
}

@media (max-width: 560px) {
  .faq-article {
    padding: 18px 16px 22px;
  }

  .faq-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
