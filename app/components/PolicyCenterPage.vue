<template>
  <div class="privacy-page-shell">
    <SiteHeader />

    <main class="privacy-page-main">
      <section class="privacy-hero-section" aria-labelledby="privacy-hero-title">
        <div class="privacy-hero-inner">
          <span class="privacy-hero-eyebrow">政策中心</span>

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
        <aside class="privacy-sidebar" role="tablist" aria-label="政策目录">
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
            <nav class="privacy-breadcrumb" aria-label="当前位置">
              <span>政策中心</span>
              <Icon name="lucide:chevron-right" aria-hidden="true" />
              <strong>{{ activePolicy.label }}</strong>
            </nav>

            <button type="button" class="privacy-share-button" aria-label="分享">
              <Icon name="lucide:share-2" aria-hidden="true" />
            </button>
          </header>

          <div
            :id="`${activePolicy.key}-policy-panel`"
            class="privacy-article"
            role="tabpanel"
          >
            <h1 :id="`${activePolicy.key}-policy-title`">{{ activePolicy.title }}</h1>

            <section
              v-for="section in activePolicy.sections"
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
import SiteFooter from './SiteFooter.vue'
import SiteHeader from './SiteHeader.vue'
import { setupPageSeo } from '../utils/seo'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const policyTabs = [
  {
    key: 'privacy',
    path: '/privacy',
    label: '隐私政策',
    icon: 'lucide:shield-check',
    title: '隐私政策',
    heroTitle: '用户隐私与数据保护',
    heroDescription: '了解我们如何收集、使用、保存和保护您的个人信息。',
    updatedAt: '2026年5月29日',
    description: '本政策说明 VicastCam 在您访问网站、注册账号、购买订阅或使用产品服务时，如何处理与保护您的个人信息。',
    highlights: [
      { title: '透明收集', text: '仅收集提供服务所需的信息', icon: 'lucide:database' },
      { title: '安全保护', text: '采用合理措施降低数据风险', icon: 'lucide:lock-keyhole' },
      { title: '用户权利', text: '支持查询、更正或删除相关信息', icon: 'lucide:user-check' },
    ],
    sections: [
      {
        key: 'privacy-information',
        title: '我们收集的信息',
        paragraphs: [
          '当您注册账号、提交表单、订阅服务、联系我们或使用 VicastCam 产品时，我们可能会收集您的邮箱、昵称、公司信息、订单信息、设备信息以及必要的日志数据。',
          '我们也会自动记录访问时间、浏览器类型、设备类型、IP 地址、页面访问路径等信息，用于保障服务稳定、分析产品体验并排查异常问题。',
        ],
      },
      {
        key: 'privacy-usage',
        title: '信息使用方式',
        paragraphs: [
          '我们会将信息用于账号管理、订单处理、产品交付、客户支持、安全风控、服务优化以及向您发送必要的服务通知。',
          '未经您的明确同意，我们不会出售您的个人信息。只有在提供支付、云服务、数据分析、客服等必要服务时，才会向合作服务商共享最低限度的信息。',
        ],
      },
      {
        key: 'privacy-cookies',
        title: 'Cookie 与同类技术',
        paragraphs: [
          '我们可能使用 Cookie 记住您的偏好设置、保持登录状态、统计访问数据并提升网站体验。您可以在浏览器中管理或拒绝 Cookie。',
          '如果您禁用 Cookie，部分账号、支付或个性化功能可能无法正常使用。',
        ],
      },
      {
        key: 'privacy-rights',
        title: '您的权利',
        paragraphs: [
          '您可以联系我们查询、更正、删除您的个人信息，或撤回部分授权。我们会在验证身份后，在合理期限内处理您的请求。',
          '如需发起隐私相关请求，请通过 business@vicastcam.com 与我们联系。',
        ],
      },
    ],
  },
  {
    key: 'terms',
    path: '/terms',
    label: '服务条款',
    icon: 'lucide:file-check-2',
    title: '服务条款',
    heroTitle: '服务使用规则',
    heroDescription: '了解您使用 VicastCam 网站、软件和相关服务时需要遵守的基本规则。',
    updatedAt: '2026年5月29日',
    description: '本条款适用于您访问 VicastCam 网站、下载软件、注册账号、购买订阅以及使用我们提供的相关功能与服务。',
    highlights: [
      { title: '合法使用', text: '不得用于违法或侵权场景', icon: 'lucide:scale' },
      { title: '账号安全', text: '请妥善保管登录凭证', icon: 'lucide:key-round' },
      { title: '服务变更', text: '产品能力可能持续升级调整', icon: 'lucide:refresh-cw' },
    ],
    sections: [
      {
        key: 'terms-account',
        title: '账号与使用资格',
        paragraphs: [
          '您应确保注册信息真实、准确并保持更新。账号仅供您本人或被授权的团队成员使用，不得恶意共享、转让、出租或出售。',
          '因您未妥善保管账号、密码或验证码导致的损失，应由您自行承担；如发现异常使用，请及时联系我们处理。',
        ],
      },
      {
        key: 'terms-acceptable-use',
        title: '可接受使用',
        paragraphs: [
          '您不得利用 VicastCam 服务从事违反法律法规、侵犯他人权益、传播恶意软件、干扰系统运行或绕过安全限制的行为。',
          '您应对通过本服务制作、上传、投放或直播的内容负责，并确保拥有相应授权。',
        ],
      },
      {
        key: 'terms-ip',
        title: '知识产权',
        paragraphs: [
          'VicastCam 网站、软件、界面、图标、素材、文档及相关技术成果的知识产权归我们或合法授权方所有。',
          '除非获得书面许可，您不得复制、修改、反向工程、转售或以其他方式商业化使用我们的软件和内容。',
        ],
      },
      {
        key: 'terms-liability',
        title: '免责声明与责任限制',
        paragraphs: [
          '我们会努力保障服务稳定，但不承诺服务永不中断或完全无错误。因不可抗力、第三方服务异常、网络故障或您自身操作导致的影响，我们将尽力协助排查。',
          '在法律允许范围内，我们对间接损失、利润损失、数据损失或业务中断不承担超出已支付服务费用的责任。',
        ],
      },
    ],
  },
  {
    key: 'sales',
    path: '/sales-policy',
    label: '销售政策',
    icon: 'lucide:receipt-text',
    title: '销售政策',
    heroTitle: '订阅、付款与退款说明',
    heroDescription: '了解 VicastCam 套餐购买、订单确认、发票、续费和退款相关规则。',
    updatedAt: '2026年5月29日',
    description: '本政策说明您购买 VicastCam 订阅、增值服务或相关产品时的价格、付款、交付、续费、变更及售后规则。',
    highlights: [
      { title: '订单确认', text: '付款完成后开通对应权益', icon: 'lucide:badge-check' },
      { title: '价格透明', text: '页面展示价格为购买依据', icon: 'lucide:badge-dollar-sign' },
      { title: '售后支持', text: '异常订单可联系邮箱处理', icon: 'lucide:headphones' },
    ],
    sections: [
      {
        key: 'sales-products',
        title: '产品与订阅',
        paragraphs: [
          'VicastCam 可能提供免费版、月卡、年卡或其他限时套餐。不同套餐包含的权益、有效期、可用平台和功能范围，以购买页面展示为准。',
          '订阅权益自订单成功或激活完成后开始计算。若因系统延迟导致权益未及时生效，请保留订单信息并联系我们处理。',
        ],
      },
      {
        key: 'sales-payment',
        title: '价格与付款',
        paragraphs: [
          '购买页面显示的价格、币种、折扣和税费信息为下单时的有效价格。我们可能根据市场、活动或汇率情况调整价格，但不会影响已完成订单的当前周期权益。',
          '您应使用合法有效的支付方式完成付款。第三方支付渠道可能会根据其规则收取手续费或进行风控审核。',
        ],
      },
      {
        key: 'sales-refund',
        title: '退款规则',
        paragraphs: [
          '如您因重复扣款、套餐未开通、无法正常激活等原因申请售后，请在发现问题后尽快通过 business@vicastcam.com 联系我们，并提供订单号和支付凭证。',
          '已正常开通并使用的数字订阅服务通常不支持无理由退款。法律法规或支付平台另有强制规定的，从其规定。',
        ],
      },
      {
        key: 'sales-invoice',
        title: '发票与订单支持',
        paragraphs: [
          '如需发票、收据或订单证明，请通过官方邮箱提交公司名称、订单号、付款时间和开票信息，我们会在核验后协助处理。',
          '如您需要升级、续费、变更套餐或处理企业采购，请联系商务支持获取进一步说明。',
        ],
      },
    ],
  },
]

const policyKeySet = new Set(policyTabs.map(tab => tab.key))
const routePolicyKeyMap = {
  privacy: 'privacy',
  terms: 'terms',
  'sales-policy': 'sales',
}

const getSingleQueryValue = value => Array.isArray(value) ? value[0] : value

const normalizePolicyKey = value => {
  const key = String(value || '').trim()

  return policyKeySet.has(key) ? key : 'privacy'
}

const getRoutePolicyKey = () => {
  const routeSegment = route.path.split('/').filter(Boolean).pop() || 'privacy'

  return routePolicyKeyMap[routeSegment] || 'privacy'
}

const activePolicyKey = computed(() => {
  return getRoutePolicyKey()
})

const activePolicy = computed(() => {
  return policyTabs.find(tab => tab.key === activePolicyKey.value) || policyTabs[0]
})

const selectPolicyTab = (key) => {
  const targetKey = normalizePolicyKey(key)
  const targetPolicy = policyTabs.find(tab => tab.key === targetKey) || policyTabs[0]
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
  const targetPolicy = policyTabs.find(tab => tab.key === targetKey)

  if (targetPolicy) {
    router.replace(localePath(targetPolicy.path))
  }
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
