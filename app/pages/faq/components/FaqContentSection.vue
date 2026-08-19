<template>
  <section
    v-if="activeQuestion && activeQuestionGroup"
    id="faq-content"
    class="faq-content-section"
    :aria-label="content.sectionAriaLabel"
  >
    <div class="faq-content-layout">
      <aside class="faq-sidebar" :aria-label="content.catalogAriaLabel">
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
                v-for="(question, index) in group.questions"
                :key="question.id"
                type="button"
                :class="['faq-question', { 'faq-question-active': question.id === activeQuestionId }]"
                @click="selectQuestion(question, true)"
              >
                <span class="faq-question-index">{{ String(index + 1).padStart(2, '0') }}</span>
                <span>{{ question.title }}</span>
              </button>
            </div>
          </div>
        </section>
      </aside>

      <div ref="faqContent" class="faq-content">
        <header class="faq-content-header">
          <h2>{{ activeQuestion.title }}</h2>
          <p>{{ questionProgress }}</p>
        </header>

        <article class="faq-answer-shell">
          <div class="faq-answer-label">
            <Icon name="lucide:circle-help" aria-hidden="true" />
            <span>{{ content.answerLabel }}</span>
          </div>

          <div class="faq-answer-content">
            <template v-for="(block, index) in activeQuestion.answer || []" :key="`${activeQuestion.id}-${index}`">
              <h3 v-if="block.type === 'heading'">{{ block.text }}</h3>
              <ul v-else-if="block.type === 'list'">
                <li v-for="item in block.items" :key="item">{{ item }}</li>
              </ul>
              <figure v-else-if="block.type === 'image'" class="faq-answer-image">
                <img :src="block.src" :alt="block.alt || activeQuestion.title" loading="lazy" />
                <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
              </figure>
              <p v-else>{{ block.text }}</p>
            </template>
          </div>
        </article>

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

const route = useRoute()
const faqGroups = computed(() => props.groups)
const activeGroupKey = ref('')
const activeQuestionId = ref('')
const faqContent = ref(null)

const allQuestions = computed(() => faqGroups.value.flatMap(group => group.questions || []))

const activeQuestion = computed(() => {
  return allQuestions.value.find(question => question.id === activeQuestionId.value) || allQuestions.value[0]
})

const activeQuestionGroup = computed(() => {
  return faqGroups.value.find(group => (group.questions || []).some(question => question.id === activeQuestion.value?.id)) || faqGroups.value[0]
})

const activeGroupQuestionIndex = computed(() => {
  return activeQuestionGroup.value?.questions?.findIndex(question => question.id === activeQuestion.value?.id) ?? -1
})

const questionProgress = computed(() => {
  return String(props.content.questionProgressTemplate || '')
    .replaceAll('{group}', activeQuestionGroup.value?.title || '')
    .replaceAll('{current}', String(activeGroupQuestionIndex.value + 1))
    .replaceAll('{total}', String(activeQuestionGroup.value?.questions?.length || 0))
})

const isMobileFaqLayout = () => {
  return import.meta.client && window.matchMedia('(max-width: 900px)').matches
}

const scrollToFaqContent = async () => {
  if (!isMobileFaqLayout()) return

  await nextTick()
  faqContent.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const selectQuestion = (question, scrollOnMobile = false) => {
  if (!question) return

  activeQuestionId.value = question.id
  activeGroupKey.value = faqGroups.value.find(group => (group.questions || []).some(item => item.id === question.id))?.key || activeGroupKey.value

  if (scrollOnMobile) {
    void scrollToFaqContent()
  }
}

const toggleFaqGroup = (group) => {
  if (activeGroupKey.value === group.key) {
    activeGroupKey.value = ''
    return
  }

  activeGroupKey.value = group.key

  if (!(group.questions || []).some(question => question.id === activeQuestionId.value)) {
    selectQuestion(group.questions?.[0])
  }
}

const getQueryValue = (value) => {
  return Array.isArray(value) ? value[0] : value
}

const syncRouteQuestion = () => {
  const questionId = getQueryValue(route.query.question)
  const routeQuestion = allQuestions.value.find(question => question.id === questionId)

  if (routeQuestion) {
    selectQuestion(routeQuestion, route.hash === '#faq-content')
    return
  }

  const tab = String(getQueryValue(route.query.tab) || '').toLowerCase()
  const routeGroup = faqGroups.value.find(group => group.key === tab)

  if (routeGroup?.questions?.[0]) {
    selectQuestion(routeGroup.questions[0], route.hash === '#faq-content')
  }
}

watch(
  faqGroups,
  (groups) => {
    const questions = groups.flatMap(group => group.questions || [])

    if (!questions.some(question => question.id === activeQuestionId.value)) {
      activeQuestionId.value = questions[0]?.id || ''
    }

    if (!groups.some(group => group.key === activeGroupKey.value)) {
      activeGroupKey.value = groups[0]?.key || ''
    }

    syncRouteQuestion()
  },
  { immediate: true },
)

watch(
  () => [route.query.tab, route.query.question],
  syncRouteQuestion,
  { immediate: true },
)
</script>

<style scoped>
.faq-content-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 80px 0;
  background: var(--page-route-background);
}

.faq-content-layout {
  width: min(100%, var(--page-max-width));
  display: grid;
  grid-template-columns: 242px minmax(0, 1fr);
  align-items: start;
  gap: 20px;
  padding: 0 var(--page-padding-x);
}

.faq-sidebar {
  overflow: hidden;
  overflow-anchor: none;
  align-self: start;
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
  background: linear-gradient(135deg, var(--theme-extra-14-165-233-1), var(--theme-primary));
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
  font-size: 14px;
  line-height: 20px;
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
  overflow-anchor: none;
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

.faq-question {
  width: 100%;
  min-height: 44px;
  height: auto;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 10px 12px 10px 20px;
  color: var(--theme-route-card-text, var(--theme-text-secondary));
  text-align: left;
  cursor: pointer;
}

.faq-question-active {
  color: var(--theme-profile-field-action, var(--theme-white));
  background: var(--theme-sdk-sidebar-active-background, var(--theme-extra-14-116-144-055));
}

.faq-question-index {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--theme-sdk-table-head-background, var(--theme-route-card-background, var(--theme-page-72)));
  font-size: 10px;
}

.faq-question > span:last-child {
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  font-size: 12px;
  line-height: 18px;
}

.faq-content {
  min-width: 0;
  width: 774px;
  scroll-margin-top: calc(var(--page-header-height) + 12px);
}

.faq-content-header {
  margin-bottom: 10px;
}

.faq-content-header h2 {
  color: var(--theme-sdk-title, var(--theme-white));
  font-size: 22px;
  font-weight: 900;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.faq-content-header p {
  margin-top: 2px;
  color: var(--theme-route-card-text, var(--theme-text-muted));
  font-size: 13px;
  line-height: 20px;
}

.faq-answer-shell {
  width: 774px;
  min-height: 391px;
  padding: 24px 28px 30px;
  border: 1px solid var(--theme-route-card-border, transparent);
  border-radius: 10px;
  color: var(--theme-route-card-title, var(--theme-text-light));
  background: var(--theme-route-card-background, var(--theme-surface));
  box-shadow: var(--theme-route-card-shadow, none);
}

.faq-answer-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--theme-primary-light);
  font-size: 12px;
  font-weight: 800;
  line-height: 18px;
}

.faq-answer-label svg {
  width: 16px;
  height: 16px;
}

.faq-answer-content {
  margin-top: 20px;
  color: var(--theme-route-card-text, var(--theme-text-secondary));
  font-size: 14px;
  line-height: 26px;
}

.faq-answer-content p + p,
.faq-answer-content p + h3,
.faq-answer-content ul + p,
.faq-answer-content ul + h3,
.faq-answer-content h3 + p,
.faq-answer-content h3 + ul {
  margin-top: 16px;
}

.faq-answer-content h3 {
  color: var(--theme-route-card-title, var(--theme-text-light));
  font-size: 15px;
  font-weight: 800;
  line-height: 24px;
}

.faq-answer-content ul {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.faq-answer-content li {
  position: relative;
  padding-left: 18px;
  overflow-wrap: anywhere;
}

.faq-answer-content li::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--theme-primary);
}

.faq-answer-content p {
  overflow-wrap: anywhere;
}

.faq-answer-image {
  margin: 20px 0 0;
}

.faq-answer-image img {
  display: block;
  width: min(100%, 320px);
  height: auto;
  margin: 0 auto;
  border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.12));
  border-radius: 8px;
}

.faq-answer-image figcaption {
  margin-top: 8px;
  color: var(--theme-text-muted, var(--theme-text-secondary));
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

@media (max-width: 900px) {
  .faq-content-section {
    padding-top: 18px;
  }

  .faq-content-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .faq-content,
  .faq-answer-shell {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .faq-answer-shell {
    min-height: 320px;
    padding: 20px 18px 24px;
  }

}
</style>
