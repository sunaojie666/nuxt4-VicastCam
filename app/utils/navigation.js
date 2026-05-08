// 导航配置统一维护在这里，后续新增页面时只需要追加一项。
export const siteNavigationConfig = [
  { key: 'clientDownload' },
  { key: 'features' },
  { key: 'pricing' },
  { key: 'faq' },
  { key: 'sdk' },
]

// 根据当前语言生成导航展示数据，当前阶段只展示入口，不绑定页面跳转或锚点滚动。
export const createSiteNavigationItems = ({ translate }) => {
  return siteNavigationConfig.map(item => {
    return {
      key: item.key,
      label: translate(`nav.${item.key}`),
    }
  })
}
