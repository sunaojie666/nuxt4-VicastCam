import { useRuntimeConfig } from '#imports'
import { createRequest } from './index'

// Strapi REST 接口统一挂在 /api 下，这里兼容配置里是否带尾部斜杠。
const normalizeStrapiApiBaseURL = (url) => {
  const baseURL = url || 'http://localhost:1337'
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
