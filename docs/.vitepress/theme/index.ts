import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import ReleaseDownloads from './components/ReleaseDownloads.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReleaseDownloads', ReleaseDownloads)
  },
} satisfies Theme
