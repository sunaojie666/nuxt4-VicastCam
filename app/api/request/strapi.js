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

// 首页内容接口，按当前语言读取 Strapi 中配置的首屏内容。
export const getHomes = (locale) => {
  return createStrapiRequest().get('/homes', {
    params: {
      locale,
      populate: 'bgVideo',
    },
  })
}

// 导航栏接口，对应 Strapi 里的 api::navigation.navigation，REST 路由为 /api/navigations。
export const getNavigation = (locale) => {
  return createStrapiRequest().get('/navigations', {
    params: {
      locale,
    },
  })
}

// 登录页文案接口，对应 Strapi 里的 api::login.login，按当前语言读取。
export const getLogin = (locale) => {
  return createStrapiRequest().get('/logins', {
    params: {
      locale,
    },
  })
}
