// 底部导航配置统一维护，未接 Strapi 的文案不跟随语言自动切换。
export const siteFooterColumnConfig = [
  {
    key: 'product',
    title: '产品',
    links: [
      { key: 'features', label: '功能特色', sectionId: 'home-features-anchor' },
      { key: 'pricing', label: '价格', sectionId: 'home-pricing-anchor' },
      { key: 'download', label: '下载', path: '/download' },
      { key: 'changelog', label: '更新日志' },
    ],
  },
  {
    key: 'developer',
    title: '开发者',
    links: [
      { key: 'sdk', label: 'SDK', path: '/sdk' },
      { key: 'apiDocs', label: 'API 文档' },
    ],
  },
  {
    key: 'company',
    title: '公司',
    links: [
      { key: 'about', label: '关于我们' },
      { key: 'privacy', label: '隐私政策', path: '/privacy' },
      { key: 'terms', label: '服务条款' },
      { key: 'salesPolicy', label: '销售政策' },
    ],
  },
  {
    key: 'support',
    title: '支持',
    links: [
      { key: 'docs', label: '文档' },
      { key: 'tutorials', label: '教程', path: '/tutorial' },
      { key: 'faq', label: '常见问题', path: '/faq' },
      { key: 'contact', label: '联系我们' },
    ],
  },
]

// 底部社交入口当前只做展示，后续接真实链接时在这里加 url。
export const siteFooterSocialConfig = [
  { key: 'facebook', icon: 'lucide:facebook' },
  { key: 'x', icon: 'lucide:x' },
  { key: 'github', icon: 'lucide:github' },
]

// 生成底部导航列，后续接 Strapi 时再替换这里的数据来源。
export const createSiteFooterColumns = () => {
  return siteFooterColumnConfig.map(column => {
    return {
      key: column.key,
      title: column.title,
      links: column.links.map(link => {
        return {
          key: link.key,
          label: link.label,
          path: link.path || '',
          sectionId: link.sectionId || '',
        }
      }),
    }
  })
}

// 生成底部品牌文案和社交入口，未接 Strapi 前固定显示一套文案。
export const createSiteFooterText = () => {
  return {
    brand: 'VicastCam',
    brandMain: 'Vicast',
    brandAccent: 'Cam',
    logoText: 'VicastCam',
    description: 'VicastCam 为创作者提供虚拟背景、直播增强和跨平台工具。',
    socials: siteFooterSocialConfig.map(item => {
      return {
        key: item.key,
        icon: item.icon,
        label: item.key,
      }
    }),
  }
}
