import { locales } from './i18n/locales.config'

// 站点正式域名统一从环境变量读取，SEO、sitemap、robots、i18n 都使用同一个值。
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.NUXT_SITE_URL || 'https://example.com'

// 站点名称用于 sitemap 展示、默认标题模板和生产环境识别。
const siteName = process.env.NUXT_SITE_NAME || 'My International Site'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 开发服务默认暴露到局域网，启动时直接显示 Network 地址。
  devServer: {
    host: '0.0.0.0',
  },

  // 全局样式入口。
  css: [
    '@/assets/styles/theme.css',
    '@/assets/styles/main.css'
  ],

  // Tailwind 负责样式，i18n 负责多语言路由和语言包加载。
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  // Nuxt SEO 模块读取这里生成 sitemap、robots 和规范站点地址。
  site: {
    url: siteUrl,
    name: siteName,
  },

  app: {
    head: {
      // 全局默认 SEO 模板，具体页面标题仍然由 app/utils/seo.js 按当前语言生成。
      titleTemplate: `%s | ${siteName}`,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // 默认允许搜索引擎收录，并开启大图预览。
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      ],
    },
  },

  hooks: {
    'pages:extend'(pages) {
      const removePageComponents = (routes: typeof pages) => {
        for (let index = routes.length - 1; index >= 0; index -= 1) {
          const route = routes[index]

          if (route.file?.replaceAll('\\', '/').includes('/pages/components/')) {
            routes.splice(index, 1)
            continue
          }

          if (route.children?.length) {
            removePageComponents(route.children)
          }
        }
      }

      removePageComponents(pages)
    },
  },

  i18n: {
    // SEO 生成 canonical、hreflang、Open Graph URL 时需要完整站点域名。
    baseUrl: siteUrl,
    // 语言清单从独立文件导入，方便未来扩展到多个国家。
    locales,
    // 默认语言是英文，默认语言路由不加前缀。
    defaultLocale: 'en',
    // 默认语言走 /，其他语言走 /语言代码，例如 /zh-CN。
    strategy: 'prefix_except_default',
    // 语言 JSON 文件目录：i18n/locales。
    langDir: 'locales',
    // 首次访问根路径时，根据浏览器语言和 cookie 处理跳转。
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  sitemap: {
    // sitemap 自动读取 Nuxt 页面路由，并结合 @nuxtjs/i18n 生成多语言链接。
    autoI18n: true,
    // 生成 sitemap 时自动发现页面中的图片，方便后续图片 SEO。
    discoverImages: true,
    defaults: {
      // 首页和普通静态页面默认按周更新，后续动态页面可单独覆盖。
      changefreq: 'weekly',
      priority: 0.8,
    },
  },

  robots: {
    // 生成 /robots.txt，并自动附带 sitemap 地址。
    robotsTxt: true,
    sitemap: ['/sitemap.xml'],
    allow: ['/'],
    // 默认不屏蔽 Nuxt 静态资源，避免影响搜索引擎正确渲染页面。
    disallow: [],
  },

  vite: {
    // 预构建 devtools 依赖，减少开发环境页面 reload 提示。
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
})
