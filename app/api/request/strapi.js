import { useRuntimeConfig } from '#imports'
import { createRequest } from './index'

// Strapi REST 接口统一挂在 /api 下，这里兼容配置里是否带尾部斜杠。
const normalizeStrapiApiBaseURL = (url) => {
  if (process.client) {
    return '/api/strapi'
  }

  const baseURL = url || 'http://192.168.18.100:1337'
  return `${baseURL.replace(/\/+$/, '')}/api`
}

// 创建 Strapi 专用请求实例，baseURL 从 nuxt.config.ts 的 runtimeConfig 读取。
const createStrapiRequest = () => {
  const config = useRuntimeConfig()

  return createRequest({
    baseURL: normalizeStrapiApiBaseURL(config.public.strapiUrl),
  })
}

const homeRequestOptions = {
  skipGlobalLoading: true,
  skipAuthExpiredRedirect: true,
}

// 首页内容接口，按当前语言读取 Strapi 中配置的首屏内容。
export const getHomes = (locale) => {
  return createStrapiRequest().get('/homes', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: 'bgVideo',
    },
  })
}

// 关于我们页面文案接口，对应 Strapi 里的 api::about.about。
export const getAbouts = (locale) => {
  return createStrapiRequest().get('/abouts', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 下载页文案接口，对应 Strapi 里的 api::download.download。
export const getDownloads = (locale) => {
  return createStrapiRequest().get('/downloads', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// SDK 页文案接口，对应 Strapi 里的 api::sdk.sdk。
export const getSdks = (locale) => {
  return createStrapiRequest().get('/sdks', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 商务合作页文案接口，对应 Strapi 里的 api::team.team。
export const getCameras = (locale) => {
  return createStrapiRequest().get('/cameras', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// SDK 虚拟声卡模块接口，对应 Strapi 里的 api::soundcard.soundcard。
export const getSoundcards = (locale) => {
  return createStrapiRequest().get('/soundcards', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// SDK Demo 下载模块文案接口，对应 Strapi 里的 api::example.example。
export const getExamples = (locale) => {
  return createStrapiRequest().get('/examples', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

export const getTeams = (locale) => {
  return createStrapiRequest().get('/teams', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 导航栏接口，对应 Strapi 里的 api::navigation.navigation，REST 路由为 /api/navigations。
export const getNavigation = (locale) => {
  return createStrapiRequest().get('/navigations', {
    ...homeRequestOptions,
    params: {
      locale,
    },
  })
}

// 登录页文案接口，对应 Strapi 里的 api::login.login，按当前语言读取。
export const getLogin = (locale) => {
  return createStrapiRequest().get('/logins', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 隐私政策接口，对应 Strapi 里的 api::privacy.privacy，REST 路由为 /api/privacys。
export const getPrivacys = (locale) => {
  return createStrapiRequest().get('/privacys', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// GDPR 与数据保护接口，对应 Strapi 的 gdpr 内容类型。
export const getGdprs = (locale) => {
  return createStrapiRequest().get('/gdprs', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 安全与隐私承诺接口，对应 Strapi 的 safety 内容类型。
export const getSafetys = (locale) => {
  return createStrapiRequest().get('/safetys', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 退款规则接口，对应 Strapi 的 refund 内容类型。
export const getRefunds = (locale) => {
  return createStrapiRequest().get('/refunds', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 用户协议接口，对应 Strapi 里的 api::agreement.agreement，REST 路由为 /api/agreements。
export const getAgreements = (locale) => {
  return createStrapiRequest().get('/agreements', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 会员订阅协议内容接口，对应 Strapi 中的 api::member.member。
export const getMembers = (locale) => {
  return createStrapiRequest().get('/members', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 首页功能特色接口，对应 Strapi 里的 api::feature.feature。
export const getFeature = (locale) => {
  return createStrapiRequest().get('/features', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 底部文案接口，对应 Strapi 里的 api::footer.footer。
export const getFooter = (locale) => {
  return createStrapiRequest().get('/footers', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 首页常见问题接口，对应 Strapi 里的 api::faq.faq。
export const getFaq = (locale) => {
  return createStrapiRequest().get('/faqs', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 首页多平台支持文案接口，对应 Strapi 里的 api::form.form。
export const getForm = (locale) => {
  return createStrapiRequest().get('/forms', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 首页虚拟相机文案接口，对应 Strapi 里的 api::virtual.virtual。
export const getVirtual = (locale) => {
  return createStrapiRequest().get('/virtuals', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 首页全球社区文案接口，对应 Strapi 里的 api::community.community，REST 路由为 /api/communitys。
export const getCommunity = (locale) => {
  return createStrapiRequest().get('/communitys', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 首页全球社区轮播主播接口，对应 Strapi 里的 api::streamer.streamer，REST 路由为 /api/streamers。
export const getStreamers = (locale) => {
  return createStrapiRequest().get('/streamers', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: 'avatar',
    },
  })
}

// 首页教程中心文案接口，对应 Strapi 里的 api::tutorial.tutorial，REST 路由为 /api/tutorials。
export const getTutorials = (locale) => {
  return createStrapiRequest().get('/tutorials', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 视频教程页接口，对应 Strapi 里的 api::video.video，REST 路由为 /api/videos。
export const getVideos = (locale) => {
  return createStrapiRequest().get('/videos', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 首页教程中心卡片接口，对应 Strapi 里的 api::card.card，REST 路由为 /api/cards。
export const getCards = (locale) => {
  return createStrapiRequest().get('/cards', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: 'coverImg',
    },
  })
}

// 首页订阅模块文案接口，对应 Strapi 里的 api::pricing.pricing，REST 路由为 /api/pricings。
export const getPricings = (locale) => {
  return createStrapiRequest().get('/pricings', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 订阅结算页文案接口，对应 Strapi 里的 api::checkout.checkout，REST 路由为 /api/checkouts。
export const getCheckouts = (locale) => {
  return createStrapiRequest().get('/checkouts', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}

// 个人中心文案接口，对应 Strapi 里的 api::profile.profile。
export const getProfiles = (locale) => {
  return createStrapiRequest().get('/profiles', {
    ...homeRequestOptions,
    params: {
      locale,
      populate: '*',
    },
  })
}
