<template>
  <section id="tutorial-player" class="tutorial-player-section" :aria-label="content.sectionAriaLabel">
    <div class="tutorial-player-layout">
      <aside class="tutorial-sidebar" :aria-label="content.catalogAriaLabel">
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
                @click="selectLesson(lesson, false, true)"
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

      <div ref="tutorialContent" class="tutorial-content">
        <header class="tutorial-content-header">
          <h2>{{ activeLesson.title }}</h2>
          <p>{{ activeLesson.description }}</p>
        </header>

        <div class="tutorial-video-shell">
          <video
            :key="activeLesson.video"
            ref="videoPlayer"
            class="tutorial-video-player"
            :src="activeLesson.video"
            :poster="tutorialPoster"
            controls
            playsinline
            preload="metadata"
          />
        </div>

        <footer class="tutorial-step-nav">
          <button
            type="button"
            :class="['tutorial-step-button', { 'tutorial-step-button-disabled': !previousLesson }]"
            :disabled="!previousLesson"
            @click="selectLesson(previousLesson, true)"
          >
            <Icon name="lucide:chevron-left" aria-hidden="true" />
            <span>
              <small>{{ content.previousLabel }}</small>
              {{ previousLesson?.title || content.firstLessonText }}
            </span>
          </button>

          <button
            type="button"
            :class="['tutorial-step-button', 'tutorial-step-button-next', { 'tutorial-step-button-disabled': !nextLesson }]"
            :disabled="!nextLesson"
            @click="selectLesson(nextLesson, true)"
          >
            <span>
              <small>{{ content.nextLabel }}</small>
              {{ nextLesson?.title || content.lastLessonText }}
            </span>
            <Icon name="lucide:chevron-right" aria-hidden="true" />
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
  groups: {
    type: Array,
    required: true,
  },
})

const tutorialGroups = computed(() => props.groups)
const tutorialPoster = '/images/tutorial/video-poster.png'
const route = useRoute()

const activeGroupKey = ref('beginner')
const activeLessonId = ref('beginner-1')
const videoPlayer = ref(null)
const tutorialContent = ref(null)

const toggleTutorialGroup = (group) => {
  activeGroupKey.value = activeGroupKey.value === group.key ? '' : group.key
}

const activeLesson = computed(() => {
  const lessons = tutorialGroups.value.flatMap(group => group.lessons || [])
  return lessons.find(lesson => lesson.id === activeLessonId.value) || lessons[0]
})

const allLessons = computed(() => tutorialGroups.value.flatMap(group => group.lessons || []))
const activeLessonIndex = computed(() => allLessons.value.findIndex(lesson => lesson.id === activeLessonId.value))
const previousLesson = computed(() => activeLessonIndex.value > 0 ? allLessons.value[activeLessonIndex.value - 1] : null)
const nextLesson = computed(() => activeLessonIndex.value >= 0 && activeLessonIndex.value < allLessons.value.length - 1 ? allLessons.value[activeLessonIndex.value + 1] : null)

const playActiveLesson = async () => {
  await nextTick()

  try {
    await videoPlayer.value?.play()
  } catch {
    // Browsers can still block scripted playback through local autoplay policies.
  }
}

const getRouteLessonId = () => {
  const lesson = route.query.lesson

  return Array.isArray(lesson) ? lesson[0] : lesson
}

const shouldAutoplayRouteLesson = () => route.query.autoplay === '1'

const isMobileTutorialLayout = () => {
  return import.meta.client && window.matchMedia('(max-width: 900px)').matches
}

const scrollToTutorialContent = async () => {
  if (!isMobileTutorialLayout()) return

  await nextTick()
  tutorialContent.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const shouldScrollToRouteLesson = () => {
  return route.hash === '#tutorial-player' || shouldAutoplayRouteLesson()
}

const selectLesson = (lesson, autoplay = false, scrollOnMobile = false) => {
  if (!lesson) return
  activeLessonId.value = lesson.id
  activeGroupKey.value = tutorialGroups.value.find(group => (group.lessons || []).some(item => item.id === lesson.id))?.key || activeGroupKey.value

  if (scrollOnMobile) {
    void scrollToTutorialContent()
  }

  if (autoplay) {
    void playActiveLesson()
  }
}

const syncRouteLesson = () => {
  const lessonId = getRouteLessonId()
  const lesson = allLessons.value.find(item => item.id === lessonId)

  if (lesson) {
    selectLesson(lesson, shouldAutoplayRouteLesson(), shouldScrollToRouteLesson())
  }
}

watch(tutorialGroups, (groups) => {
  const lessons = groups.flatMap(group => group.lessons || [])

  if (!lessons.some(lesson => lesson.id === activeLessonId.value)) {
    activeLessonId.value = lessons[0]?.id || ''
  }

  if (!groups.some(group => group.key === activeGroupKey.value)) {
    activeGroupKey.value = groups[0]?.key || ''
  }
  syncRouteLesson()
}, { immediate: true })

watch(() => route.query.lesson, () => {
  syncRouteLesson()
})
</script>

<style scoped>
.tutorial-player-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 80px 0;
  background: var(--page-route-background);
}

.tutorial-player-layout {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: 242px minmax(0, 1fr);
  align-items: start;
  gap: 20px;
  padding: 0 var(--page-padding-x);
}

.tutorial-sidebar {
  overflow: hidden;
  overflow-anchor: none;
  align-self: start;
  border: 1px solid var(--theme-route-card-border, var(--theme-border-soft));
  border-radius: var(--theme-route-card-radius, 15px);
  background: var(--theme-route-card-background, var(--theme-surface));
  box-shadow: var(--theme-route-card-shadow, none);
}

.tutorial-group + .tutorial-group {
  border-top: 1px solid var(--theme-sdk-card-border, var(--theme-border-soft));
}

.tutorial-group:last-child {
  border-bottom: 1px solid var(--theme-sdk-card-border, var(--theme-border-soft));
}

.tutorial-group-button {
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

.tutorial-group-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  border-radius: 7px;
  color: var(--theme-white);
  background: linear-gradient(135deg, var(--theme-extra-14-165-233-1), var(--theme-primary));
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
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 11px;
  line-height: 14px;
}

.tutorial-group-chevron {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  transition: transform 0.24s ease;
}

.tutorial-group-active .tutorial-group-chevron {
  transform: rotate(180deg);
}

.tutorial-lessons-wrap {
  display: grid;
  overflow-anchor: none;
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
  background: var(--theme-sdk-card-background, var(--theme-route-card-background, var(--theme-surface-soft-58)));
}

.tutorial-lesson {
  width: 100%;
  height: 40px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 0 12px 0 20px;
  color: var(--theme-route-card-text, var(--theme-text-secondary));
  text-align: left;
  cursor: pointer;
}

.tutorial-lesson-active {
  color: var(--theme-profile-field-action, var(--theme-white));
  background: var(--theme-sdk-sidebar-active-background, var(--theme-extra-14-116-144-055));
}

.tutorial-lesson-index {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--theme-sdk-table-head-background, var(--theme-route-card-background, var(--theme-page-72)));
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
  color: var(--theme-route-card-text, var(--theme-text-muted));
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
  scroll-margin-top: calc(var(--page-header-height) + 12px);
}

.tutorial-content-header {
  margin-bottom: 10px;
}

.tutorial-content-header h2 {
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 22px;
  font-weight: 900;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.tutorial-content-header p {
  margin-top: 2px;
  color: var(--theme-route-card-text, var(--theme-text-muted));
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
  background: var(--theme-route-card-background, var(--theme-surface));
  border: 1px solid var(--theme-route-card-border, transparent);
  box-shadow: var(--theme-route-card-shadow, none);
}

.tutorial-video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
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
  background: var(--theme-route-card-background, var(--theme-surface-soft));
  border: 1px solid var(--theme-route-card-border, transparent);
  border-top: none;
  box-shadow: var(--theme-route-card-shadow, none);
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
  color: var(--theme-route-card-title, var(--theme-text-light));
  border: 1px solid var(--theme-route-card-border, transparent);
  background: var(--theme-sdk-table-head-background, var(--theme-route-card-background, var(--theme-surface)));
  text-align: left;
  cursor: pointer;
}

.tutorial-step-button-disabled {
  color: var(--theme-route-card-text, var(--theme-text-subtle));
  background: var(--theme-route-page-background, var(--theme-extra-15-23-42-05));
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
  color: var(--theme-route-card-text, var(--theme-text-subtle));
  font-size: 10px;
}

.tutorial-step-button svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

@media (max-width: 900px) {
  .tutorial-player-section {
    padding-top: 18px;
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
