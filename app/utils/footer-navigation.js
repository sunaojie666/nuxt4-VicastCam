// 底部导航配置统一维护，后续新增栏目只需要在这里追加。
export const siteFooterColumnConfig = [
  {
    key: 'product',
    links: ['features', 'pricing', 'download', 'changelog'],
  },
  {
    key: 'developer',
    links: ['sdk', 'apiDocs'],
  },
  {
    key: 'company',
    links: ['about', 'privacy', 'terms', 'salesPolicy'],
  },
  {
    key: 'support',
    links: ['docs', 'tutorials', 'faq', 'contact'],
  },
]

// 底部社交入口当前只做展示，后续接真实链接时在这里加 url。
export const siteFooterSocialConfig = [
  { key: 'facebook', icon: 'lucide:facebook' },
  { key: 'x', icon: 'lucide:x' },
  { key: 'github', icon: 'lucide:github' },
]

// 根据当前语言生成底部导航列。
export const createSiteFooterColumns = (translate) => {
  return siteFooterColumnConfig.map(column => {
    return {
      key: column.key,
      title: translate(`footer.columns.${column.key}.title`),
      links: column.links.map(link => {
        return {
          key: link,
          label: translate(`footer.columns.${column.key}.${link}`),
        }
      }),
    }
  })
}

// 根据当前语言生成底部品牌文案和社交入口。
export const createSiteFooterText = (translate) => {
  return {
    brand: translate('footer.brand'),
    brandMain: translate('footer.brandMain'),
    brandAccent: translate('footer.brandAccent'),
    logoText: translate('footer.logoText'),
    description: translate('footer.description'),
    socials: siteFooterSocialConfig.map(item => {
      return {
        key: item.key,
        icon: item.icon,
        label: translate(`footer.social.${item.key}`),
      }
    }),
  }
}
