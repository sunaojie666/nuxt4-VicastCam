import { createThemeContext } from '../utils/theme'

export default defineNuxtPlugin(() => {
  const { initTheme } = createThemeContext()

  initTheme()
})
