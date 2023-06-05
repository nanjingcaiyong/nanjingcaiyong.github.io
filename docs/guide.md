# 起步

> 文档：https://vitepress.vuejs.org/

## vitepress-starter 是什么?

vitepress-starter 是一个基于 vitepress 的文档快速开发模板

## 下载
```sh
git clone git@github.com:nanjingcaiyong/vitepress-starter.git
```

## 安装

```sh
npm i
```

## 使用

启动
```sh
npm run docs:dev
```

发布文档（通过 husky pre-push钩子进行发布）
```sh
git push
```

## 基础配置

1. 使用三方组件库
  ```js
  import DefaultTheme from 'vitepress/theme'
  import ElementPlus from 'element-plus'
  import 'element-plus/dist/index.css'
  export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
      app.use(ElementPlus)
    }
  }
  ```

  ```md
  <Breadcrumb category="Other" title="queryString"/>

  <script setup>
  import Breadcrumb from '../.vitepress/components/Breadcrumb.vue'
  </script>
  ```

2. algolia搜索
   - 前往[algolia](https://www.algolia.com/)注册账号。主要获取apiKey、appId、indexName 
   - 修改项目模板 docs/.vitepress/config.js 内 的 algolia 实际配置
   - 本地爬虫获取信息推送algolia, 爬虫项目如下：
    ```sh
    git clone git@github.com:nanjingcaiyong/algolia-docsearch.git
    ```
   - 根据实际配置修改根目录下config.json
   - 执行
    ```sh
    pipenv install 
    pipenv shell 
    ./docsearch run ./config.json
    ```