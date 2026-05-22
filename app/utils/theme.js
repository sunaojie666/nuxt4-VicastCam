// 皮肤本地缓存 key，用户刷新页面后继续使用上次选择的皮肤。
export const themeStorageKey = 'site-theme'

// 主题列表只负责切换状态，浅色具体样式等设计稿确认后再补。
export const themeOptions = [
  { code: 'light', icon: 'lucide:sun' },
  { code: 'dark', icon: 'lucide:moon' },
]

// 判断传入的皮肤 code 是否存在，避免写入无效主题。
export const isValidThemeCode = (code) => {
  return themeOptions.some(item => item.code === code)
}

// 根据 code 获取皮肤配置，用于按钮展示当前选中的皮肤。
export const findThemeOption = (code) => {
  return themeOptions.find(item => item.code === code) || themeOptions[0]
}

// 把当前皮肤写到 html 标签上，CSS 会根据 data-theme 切换变量。
export const applyThemeToDocument = (code) => {
  if (!process.client) {
    return
  }

  const themeCode = isValidThemeCode(code) ? code : 'dark'

  document.documentElement.setAttribute('data-theme', themeCode)
  document.documentElement.style.colorScheme = themeCode === 'light' ? 'light' : 'dark'
}

// 从浏览器缓存读取用户上次选择的皮肤。
export const readThemeFromStorage = () => {
  if (!process.client) {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey)

  return isValidThemeCode(storedTheme) ? storedTheme : 'dark'
}

// 创建页面或组件可复用的换肤上下文。
export const createThemeContext = () => {
  // useState 可以让当前皮肤在 Nuxt 页面和组件之间共享。
  const currentTheme = useState('current-theme', () => readThemeFromStorage())

  // 初始化皮肤：优先读取本地缓存，再同步到 html 标签。
  const initTheme = () => {
    currentTheme.value = readThemeFromStorage()
    applyThemeToDocument(currentTheme.value)
  }

  // 切换皮肤：更新全局状态、html 标签和本地缓存。
  const setTheme = (code) => {
    const themeCode = isValidThemeCode(code) ? code : 'dark'

    currentTheme.value = themeCode
    applyThemeToDocument(themeCode)

    if (process.client) {
      window.localStorage.setItem(themeStorageKey, themeCode)
    }
  }

  return {
    currentTheme,
    themeOptions,
    initTheme,
    setTheme,
    findThemeOption,
  }
}
