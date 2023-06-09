import { defineConfig } from 'vitepress'
const config = defineConfig({
  base: '/',
  lang: 'zh-CN',
  title: '一颗白菜',
  description: 'vitepress document basic framework',
  lastUpdated: true,
  themeConfig: {
    // sidebar: [],
  
    nav:  [
      { 
        text: '关于我', 
        link: '/guide.md',
      },
      {
        text: '计算机基础', 
        link: '/guide.md',
      },
      { 
        text: '大前端',
        link: '/guide.md',
      },
      { 
        text: '数据库',
        link: '/guide.md',
      },
      {
        text: '运维',
        link: '/guide.md',
      },
      {
        text: '开源项目',
        items: [
          {
            text: '工作流',
            link: 'https://nanjingcaiyong.github.io/flow/'
          },
          {
            text: 'c端工具库',
            link: 'https://nanjingcaiyong.github.io/rich-js/'
          }
        ]
      }
    ],
    editLink: {
      pattern: 'https://github.com/nanjingcaiyong/vitepress-starter/edit/main/docs/:path',
      text: '编辑页面'
    },
    algolia: {
      apiKey: '63e30509d0698684b33ffd93f7e7ffff',
      appId: 'PX4T8MU9V4',
      indexName: 'vitepress-starter',
      algoliaOptions: {
        hitsPerPage: 10,
      },
    },
    // github
    socialLinks: [
      { 
        icon: 'github', 
        link: 'https://github.com/nanjingcaiyong/vitepress-starter'
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present yong.cai'
    },
    search: {
      provider: 'local'
    }
  }
})

export default config