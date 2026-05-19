<template>
  <section class="tutorial-player-section" aria-label="教程列表">
    <div class="tutorial-player-layout">
      <aside class="tutorial-sidebar" aria-label="教程目录">
        <section
          v-for="group in tutorialGroups"
          :key="group.key"
          :class="['tutorial-group', { 'tutorial-group-active': group.key === activeGroupKey }]"
        >
          <button type="button" class="tutorial-group-button" @click="toggleTutorialGroup(group)">
            <span class="tutorial-group-icon">
              <Icon :name="group.icon" aria-hidden="true" />
            </span>
            <span class="tutorial-group-text">
              <strong>{{ group.title }}</strong>
              <small>{{ group.count }}</small>
            </span>
            <Icon class="tutorial-group-chevron" name="lucide:chevron-down" aria-hidden="true" />
          </button>

          <div :class="['tutorial-lessons-wrap', { 'tutorial-lessons-wrap-open': group.key === activeGroupKey }]">
            <div class="tutorial-lessons">
              <button
                v-for="lesson in group.lessons"
                :key="lesson.id"
                type="button"
                :class="['tutorial-lesson', { 'tutorial-lesson-active': lesson.id === activeLessonId }]"
                @click="activeLessonId = lesson.id"
              >
                <span class="tutorial-lesson-index">{{ lesson.index }}</span>
                <span>{{ lesson.title }}</span>
                <small>
                  <Icon name="lucide:clock-3" aria-hidden="true" />
                  {{ lesson.time }}
                </small>
              </button>
            </div>
          </div>
        </section>
      </aside>

      <div class="tutorial-content">
        <header class="tutorial-content-header">
          <h2>{{ activeLesson.title }}</h2>
          <p>{{ activeLesson.description }}</p>
        </header>

        <div class="tutorial-video-shell">
          <video
            class="tutorial-video-player"
            src="/videos/tutorial-demo.mp4"
            controls
            preload="metadata"
          />
        </div>

        <footer class="tutorial-step-nav">
          <button type="button" class="tutorial-step-button tutorial-step-button-disabled">
            <Icon name="lucide:chevron-left" aria-hidden="true" />
            <span>
              <small>上一集</small>
              已经是第一集
            </span>
          </button>

          <button type="button" class="tutorial-step-button tutorial-step-button-next">
            <span>
              <small>下一集</small>
              第2集:如何注册和登录
            </span>
            <Icon name="lucide:chevron-right" aria-hidden="true" />
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
const tutorialGroups = [
  {
    key: 'desktop',
    title: '电脑端',
    count: '12集',
    icon: 'lucide:monitor',
    lessons: [
      { id: 'desktop-1', index: 1, title: '如何下载与安装VicastCam', description: '手把手教你在电脑端下载与安装 VicastCam', time: '04:32' },
      { id: 'desktop-2', index: 2, title: '如何注册与登录VicastCam', description: '快速完成账号注册并登录软件', time: '04:32' },
      { id: 'desktop-3', index: 3, title: '如何开启虚拟背景', description: '学习选择、预览和应用虚拟背景', time: '04:32' },
      { id: 'desktop-4', index: 4, title: '如何调整直播画面', description: '调整画面比例、清晰度和背景效果', time: '04:32' },
      { id: 'desktop-5', index: 5, title: '如何连接直播平台', description: '连接常用直播平台并完成推流准备', time: '04:32' },
    ],
  },
  {
    key: 'beginner',
    title: '入门教程',
    count: '8集',
    icon: 'lucide:folder-open',
    lessons: [
      { id: 'beginner-1', index: 1, title: '认识VicastCam界面', description: '快速了解软件的主要功能区域', time: '03:18' },
      { id: 'beginner-2', index: 2, title: '第一次创建直播场景', description: '完成第一个可用直播场景', time: '05:12' },
    ],
  },
  {
    key: 'advanced',
    title: '高级教程',
    count: '10集',
    icon: 'lucide:folder',
    lessons: [
      { id: 'advanced-1', index: 1, title: '专业抠图参数设置', description: '调节边缘、光线和人物细节', time: '06:06' },
    ],
  },
  {
    key: 'others',
    title: '其他教程',
    count: '6集',
    icon: 'lucide:folder',
    lessons: [
      { id: 'others-1', index: 1, title: '常见问题处理', description: '处理安装、登录和视频输出问题', time: '04:08' },
    ],
  },
]

const activeGroupKey = ref('desktop')
const activeLessonId = ref('desktop-1')

const toggleTutorialGroup = (group) => {
  activeGroupKey.value = activeGroupKey.value === group.key ? '' : group.key

  if (group.key && group.lessons?.[0]) {
    activeLessonId.value = group.lessons[0].id
  }
}

const activeLesson = computed(() => {
  const lessons = tutorialGroups.flatMap(group => group.lessons)
  return lessons.find(lesson => lesson.id === activeLessonId.value) || lessons[0]
})
</script>

<style scoped>
.tutorial-player-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 0 78px;
  background: var(--page-route-background);
}

.tutorial-player-layout {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: 242px minmax(0, 1fr);
  gap: 20px;
  padding: 0 var(--page-padding-x);
}

.tutorial-sidebar {
  overflow: hidden;
  height: 508px;
  border: 1px solid rgba(37, 48, 70, 1);
  border-radius: 10px;
  background: rgba(15, 23, 42, 1);
}

.tutorial-group + .tutorial-group {
  border-top: 1px solid rgba(37, 48, 70, 1);
}

.tutorial-group:last-child {
  border-bottom: 1px solid rgba(37, 48, 70, 1);
}

.tutorial-group-button {
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: rgba(226, 232, 240, 1);
  text-align: left;
  cursor: pointer;
}

.tutorial-group-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  border-radius: 7px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(135deg, rgba(14, 165, 233, 1), rgba(59, 130, 246, 1));
}

.tutorial-group-icon svg {
  width: 16px;
  height: 16px;
}

.tutorial-group-text {
  min-width: 0;
  display: grid;
  gap: 2px;
  flex: 1 1 auto;
}

.tutorial-group-text strong,
.tutorial-group-text small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tutorial-group-text strong {
  font-size: 13px;
  line-height: 18px;
}

.tutorial-group-text small {
  color: rgba(148, 163, 184, 1);
  font-size: 11px;
  line-height: 14px;
}

.tutorial-group-chevron {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: rgba(148, 163, 184, 1);
  transition: transform 0.24s ease;
}

.tutorial-group-active .tutorial-group-chevron {
  transform: rotate(180deg);
}

.tutorial-lessons-wrap {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  opacity: 0;
  transition:
    grid-template-rows 0.26s ease,
    opacity 0.2s ease;
}

.tutorial-lessons-wrap-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.tutorial-lessons {
  min-height: 0;
  overflow: hidden;
  display: grid;
  padding: 0;
  background: rgba(30, 41, 59, 0.58);
}

.tutorial-lesson {
  width: 100%;
  height: 40px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 0 12px 0 20px;
  color: rgba(203, 213, 225, 1);
  text-align: left;
  cursor: pointer;
}

.tutorial-lesson-active {
  color: rgba(255, 255, 255, 1);
  background: rgba(14, 116, 144, 0.55);
}

.tutorial-lesson-index {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: rgba(3, 7, 18, 0.72);
  font-size: 10px;
}

.tutorial-lesson > span:nth-child(2) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
}

.tutorial-lesson small {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: rgba(148, 163, 184, 1);
  font-size: 10px;
  white-space: nowrap;
}

.tutorial-lesson small svg {
  width: 10px;
  height: 10px;
}

.tutorial-content {
  min-width: 0;
  width: 774px;
}

.tutorial-content-header {
  margin-bottom: 10px;
}

.tutorial-content-header h2 {
  color: rgba(255, 255, 255, 1);
  font-size: 22px;
  font-weight: 900;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.tutorial-content-header p {
  margin-top: 2px;
  color: rgba(148, 163, 184, 1);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.tutorial-video-shell {
  position: relative;
  overflow: hidden;
  width: 774px;
  height: 391px;
  border-radius: 10px 10px 0 0;
  background: rgba(15, 23, 42, 1);
}

.tutorial-video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tutorial-step-nav {
  height: 105px;
  display: grid;
  grid-template-columns: repeat(2, 352px);
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  padding: 20px 18px;
  border-radius: 0 0 10px 10px;
  background: rgba(30, 41, 59, 1);
}

.tutorial-step-button {
  width: 352px;
  height: 65px;
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  border-radius: 8px;
  color: rgba(226, 232, 240, 1);
  background: rgba(15, 23, 42, 1);
  text-align: left;
  cursor: pointer;
}

.tutorial-step-button-disabled {
  color: rgba(100, 116, 139, 1);
  background: rgba(15, 23, 42, 0.5);
  cursor: default;
}

.tutorial-step-button-next {
  grid-template-columns: minmax(0, 1fr) 16px;
  text-align: right;
}

.tutorial-step-button span {
  min-width: 0;
  display: grid;
  gap: 1px;
  justify-items: start;
  font-size: 13px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tutorial-step-button-next span {
  justify-items: end;
}

.tutorial-step-button small {
  color: rgba(100, 116, 139, 1);
  font-size: 10px;
}

.tutorial-step-button svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

@media (max-width: 900px) {
  .tutorial-player-section {
    padding: 22px 0 58px;
  }

  .tutorial-player-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .tutorial-content,
  .tutorial-video-shell {
    width: 100%;
  }

  .tutorial-video-shell {
    height: auto;
    aspect-ratio: 774 / 391;
  }
}

@media (max-width: 560px) {
  .tutorial-step-nav {
    grid-template-columns: 1fr;
    height: auto;
  }

  .tutorial-step-button {
    width: 100%;
  }
}
</style>
