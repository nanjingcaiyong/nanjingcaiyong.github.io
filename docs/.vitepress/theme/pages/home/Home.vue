<template>
  <Carousel></Carousel>
  <div class="max-w-[90%] xl:max-w-[60%] mx-auto mt-[25px] xl:mt-[60px] flex justify-between">
    <News class="w-full md:w-[65%]"></News>
    <SideBar 
      class="w-[30%] sticky top-[92px] hidden md:block" 
    />
  </div>
</template>
<script setup>
import { reactive, provide } from 'vue'
import { Carousel, News, SideBar } from '../../components';
const store = reactive({
  news: [
    {
      title: '第一期',
      content: '① 从浏览器到 Node.js 环境，一文彻底搞懂前端沙箱 ② Vite是如何兼容旧版本浏览器的 ③ npmmirror 镜像站已内置支持类似 unpkg cdn 解析能力 ④ chrome114的一些新东西 ⑤ Deno 1.34 ⑥ flutter_chat_box ⑦ Dify ⑧ 读取大脑重建高清视频 ⑨ 阿里云「通义听悟」公测',
      img: '',
      view: 100,
      date: '2023-05-26',
      link: '/guide'
    },
    {
      title: '第二期',
      content: '① 从浏览器到 Node.js 环境，一文彻底搞懂前端沙箱 ② Vite是如何兼容旧版本浏览器的 ③ npmmirror 镜像站已内置支持类似 unpkg cdn 解析能力 ④ chrome114的一些新东西 ⑤ Deno 1.34 ⑥ flutter_chat_box ⑦ Dify ⑧ 读取大脑重建高清视频 ⑨ 阿里云「通义听悟」公测',
      img: '',
      view: 100,
      date: '2023-05-26',
      link: '/guide'
    },
    {
      title: '第三期',
      content: '① 从浏览器到 Node.js 环境，一文彻底搞懂前端沙箱 ② Vite是如何兼容旧版本浏览器的 ③ npmmirror 镜像站已内置支持类似 unpkg cdn 解析能力 ④ chrome114的一些新东西 ⑤ Deno 1.34 ⑥ flutter_chat_box ⑦ Dify ⑧ 读取大脑重建高清视频 ⑨ 阿里云「通义听悟」公测',
      img: '',
      view: 100,
      date: '2023-05-26',
      link: '/guide'
    },
    {
      title: '第四期',
      content: '① 从浏览器到 Node.js 环境，一文彻底搞懂前端沙箱 ② Vite是如何兼容旧版本浏览器的 ③ npmmirror 镜像站已内置支持类似 unpkg cdn 解析能力 ④ chrome114的一些新东西 ⑤ Deno 1.34 ⑥ flutter_chat_box ⑦ Dify ⑧ 读取大脑重建高清视频 ⑨ 阿里云「通义听悟」公测',
      img: '',
      view: 100,
      date: '2023-05-26',
      link: '/guide'
    },
    {
      title: '第五期',
      content: '① 从浏览器到 Node.js 环境，一文彻底搞懂前端沙箱 ② Vite是如何兼容旧版本浏览器的 ③ npmmirror 镜像站已内置支持类似 unpkg cdn 解析能力 ④ chrome114的一些新东西 ⑤ Deno 1.34 ⑥ flutter_chat_box ⑦ Dify ⑧ 读取大脑重建高清视频 ⑨ 阿里云「通义听悟」公测',
      img: '',
      view: 100,
      date: '2023-05-26',
      link: '/guide'
    },
    {
      title: '第六期',
      content: '① 从浏览器到 Node.js 环境，一文彻底搞懂前端沙箱 ② Vite是如何兼容旧版本浏览器的 ③ npmmirror 镜像站已内置支持类似 unpkg cdn 解析能力 ④ chrome114的一些新东西 ⑤ Deno 1.34 ⑥ flutter_chat_box ⑦ Dify ⑧ 读取大脑重建高清视频 ⑨ 阿里云「通义听悟」公测',
      img: '',
      view: 100,
      date: '2023-05-26',
      link: '/guide'
    }
  ]
});
provide('store', store)
</script>

<style>
html {
  --badge-font-color: #4e5969;
  --description-font-color: #86909c;
}


html[class=dark] {
  --badge-font-color: #bdc3cc;
  --description-font-color: #9facba;
}
</style>