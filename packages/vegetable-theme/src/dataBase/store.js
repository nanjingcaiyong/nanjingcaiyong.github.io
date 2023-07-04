import { reactive } from 'vue';
const store = reactive({
  news: [
    {
      title: '基于pnpm 创建 monorepo 项目',
      content: '现在越来越多的项目使用 monorepo，最近在开发组件库的时候，正好用到了，这里记录一下。现在像组件库、mvvm框架、脚手架等许多优秀开源的作品都在使用 monorepo 来管理代码。',
      img: '',
      type: '大前端',
      date: '2023-07-04',
      link: '/news/pnpm-monorepo',
      index: 12,
    },
    {
      title: 'package.json 中 module、main、browser 的优先级',
      content: '前端开发中使用到 npm 包那可算是家常便饭，而使用到 npm 包总免不了接触到 package.json 包配置文件。',
      img: '',
      type: '大前端',
      date: '2023-06-28',
      link: '/news/module-main-browser',
      index: 11,
    },
    {
      title: 'scroll-margin-top 和 scrollintoview黄金搭档',
      content: '',
      img: '',
      type: '大前端',
      date: '2023-06-28',
      link: '/news/scroll-into-view',
      index: 10,
    },
    {
      title: '移动端如何让两个滚动条同步？',
      content: '',
      img: '',
      type: '大前端',
      date: '2023-06-28',
      link: '/news/sync-scroll-bar',
      index: 9,
    },
    {
      title: 'pc 和 移动端事件差异',
      content: '在 pc 和 移动端 上同样的事件触发的时期可能是不一样的，总结了一些差异性的问题',
      img: '',
      type: '大前端',
      date: '2023-06-28',
      link: '/news/pc-mobile-event',
      index: 8,
    },
    {
      title: 'package.json 字段详解',
      content: '总结了package.json中各字段的作用，以及在开发中的使用场景',
      img: '',
      type: '大前端',
      date: '2023-06-21',
      link: '/news/package-json',
      index: 7,
    },
    {
      title: 'mac 常用快捷键',
      content: '总结了常用的 mac 快捷键，包含vscode，浏览器等',
      img: '',
      type: '大前端',
      date: '2023-06-20',
      link: '/news/mac-keys',
      index: 6,
    },
    {
      title: '常用的 git 操作',
      content: '一些常用的 git 操作，例如：分支、提交、撤销、标签、暂存、合并等……',
      img: '',
      type: '大前端',
      date: '2023-06-16',
      link: '/news/git-operation',
      index: 5,
    },
    {
      title: 'npm、yarn、pnpm对比',
      content: '有这么一个UI交互，一行需要“展示全”三个标签，如果最后一个不能展示全（文案需要全部展示出来，不能出现省略号），那么就展示成两个；如下图，最后一个应省略',
      img: '',
      type: '大前端',
      date: '2023-06-13',
      link: '/news/package-tool',
      index: 4,
    },
    {
      title: '基于多项目的微前端思考',
      content: '公司业务高速发展，为了迎合发展的需要，拆分出多个后台管理系统，部分已经投入使用。虽然拆分出的系统更利于开发和维护，但是其他上下游部门使用起来比较分散不便于管理，所以我们就考虑使用一个平台将各个子系统接入进来，有两个优势：',
      type: '大前端',
      img: '',
      date: '2023-06-11',
      link: '/news/mutil-project',
      index: 3,
    },
    {
      title: '带你走进 Web Components 新世界',
      content: '下面来说说我接触 Web Components 的背景：我司是做跨境电商的，C端站点是基于三方的SaaS电商服务平台，后期代码全部通过该平台进行维护。由于公司快速发展，该平台已经限制了我们业务发展的边界，无法满足日益定制化的需求，搭建自己的系统不可或缺。直接全量切自研系统不太现实，所以我们按业务模块通过不断迭代逐个替换。',
      img: '',
      type: '大前端',
      date: '2023-06-10',
      link: '/news/web-component',
      index: 2,
    },
    {
      title: '一行展示不下，如何隐藏单个dom?',
      content: '有这么一个UI交互，一行需要“展示全”三个标签，如果最后一个不能展示全（文案需要全部展示出来，不能出现省略号），那么就展示成两个；如下图，最后一个应省略',
      img: '',
      type: '大前端',
      date: '2023-06-1',
      link: '/news/hidden-row-dom',
      index: 1,
    }
  ],
  user: {
    name: '蔡勇',
    job: '高级前端开发工程师',
    company: 'Cupshe',
    address: '南京市-雨花台区',
    email: 'http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=2872845261@qq.com',
    qq: 'http://wpa.qq.com/msgrd?v=3&amp;uin=2872845261&amp;site=qq&amp;menu=yes'
  },
  experiences: [{
    company: 'Cupshe',
    job: '前端开发工程师',
    date: '2021.03 ～ 至今',
    tags: [
      'vue',
      'nodejs',
      'express',
      'typescript',
      'koa',
      'sequelize',
      'mysql',
      'webpack',
      'rollup',
      'vite',
      'es6',
      'css',
      'html5',
    ]
  }, {
    company: '艾佳生活',
    job: '前端开发工程师',
    date: '2019.07 ~ 2021.03',
    tags: [
      'vue',
      'nodejs',
      'express',
      'typescript',
      'react',
      'webpack',
      'nuxt',
      'uniapp',
      'antd',
      'es6',
      'css',
      'html5',
      'pixijs',
    ]
  }, {
    company: '江苏华博',
    job: '前端开发工程师',
    date: '2015.09 ~ 2019.06',
    tags: [
      'vue',
      'jquery',
      'nodejs',
      'express',
      'typescript',
      '.NET',
      'SqlServer',
      'IIS'
    ]
  }]
});

export function useStore () {
  return store;
}