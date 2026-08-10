import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // GitHub Pages 部署：仓库名 EverLinkPage → base 路径
  base: '/EverLinkPage/',
  title: 'EverLink',
  description: '工业设备协议调试与局域网工具箱 —— 支持 Modbus TCP / MQTT / WebSocket / HTTP / OPC UA，内置快传、Ping、网络调试与剪贴板管理。',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#14b8a6' }],
    ['link', { rel: 'icon', href: '/ic_launcher.png' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction' },
      { text: '更新日志', link: '/changelog' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '安装与更新', link: '/guide/install' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
        {
          text: '核心功能',
          items: [
            { text: '协议调试', link: '/guide/protocols' },
            { text: '工具箱', link: '/guide/tools' },
            { text: '设置与主题', link: '/guide/settings' },
          ],
        },
        {
          text: '帮助',
          items: [
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bobocha214/everlink' },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6.5 19a4.75 4.75 0 0 1-.42-9.47 6 6 0 0 1 11.6-1.36A4.25 4.25 0 0 1 18 19h-11.5z"/></svg>',
        },
        link: 'https://gitee.com/zhiyu_214/ever-link',
      },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'EverLink · 仅供设备调试与学习使用',
      copyright: 'Copyright © 2026 EverLink',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '本页目录',
    },

    lastUpdated: {
      text: '最后更新于',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
  },
})
