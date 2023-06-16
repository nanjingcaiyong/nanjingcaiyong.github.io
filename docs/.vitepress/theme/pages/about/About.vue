<template>
  <div class="max-w-[95%] xl:max-w-[70%] xxl:max-w-[50%] mx-auto mt-[25px] md:mt-[50px]">
    <el-card class="card-self">
      <h1 class="text-[18px] font-bold mb-[16px]">关于我</h1>
      <div class="el-descriptions__body">
        <table class="el-descriptions__table">
          <tbody>
            <tr>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label">姓名：</span>
                <span class="el-descriptions__content"> 蔡勇 </span>
              </td>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label">年龄：</span>
                <span class="el-descriptions__content"> 30岁 </span>
              </td>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label">政治面貌：</span>
                <span class="el-descriptions__content"> 党员 </span>
              </td>
            </tr>
            <tr>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label" style="margin-right: 6px;">手机号：</span>
                <span class="el-descriptions__content">18651600452 </span>
              </td>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label">籍贯：</span>
                <span class="el-descriptions__content"> 江苏南京 </span>
              </td>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label">工作经验：</span>
                <span class="el-descriptions__content"> 7年 </span>
              </td>
            </tr>
            <tr>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label">学历：</span>
                <span class="el-descriptions__content"> 本科 </span>
              </td>
              <td class="el-descriptions__cell">
                <span class="el-descriptions__label">教育经历：</span>
                <span class="el-descriptions__content"> 南京航空航天大学 </span>
              </td>
              <td class="el-descriptions__cell" colspan="1">
                <span class="el-descriptions__label">联系地址：</span>
                <span  class="el-descriptions__content"> 南京市雨花台区铁心桥街道 </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>

    <el-timeline class="mt-[50px]">
      <el-timeline-item 
        v-for="item in experiences" 
        :timestamp="item.date" 
        placement="top"
      >
        <el-card class="letter">
          <p><label>公司：</label><span>{{ item.company }}</span></p>
          <p><label>职位：</label><span>{{ item.job }}</span></p>
          <p class="leading-[2.5]">
            <label>技术栈：</label>
            <span 
              v-for="(tag, index) in item.tags" 
              class="label" 
              :class="{ 'mr-[10px]': index < item.tags.length }"
              :style="{ background: getRGB() }">{{ tag }}</span>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const store = reactive({
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
    function getRGB() {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      let rgb = 'rgba(' + r + ',' + g + ',' + b + ', .5)';
      return rgb
    }
    return {
      getRGB,
      ...toRefs(store)
    }
  }
})
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

h1 {
  color: var(--vp-c-text-1);
}

.el-descriptions__title {
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.el-descriptions__body {
  background: transparent;
}

.el-descriptions__label:not(.is-bordered-label) {
  color: var(--vp-c-text-1);
}


.letter {
  color: var(--vp-c-text-1);
}

.desc {
  color: var(--description-font-color)
}

.label {
  display: inline-flex;
  padding: 4px 8px;
  line-height: 1.2;
  border-radius: 10px;
}

.el-descriptions__table tr {
  display: flex;
  flex-flow: column;
}


.card-self .el-descriptions__label,
.card-self .el-descriptions__content {
  font-weight: 600;
}

.card-self .el-descriptions__content {
  color: var(--vp-c-text-1);
}

@media screen and (min-width: 768px) {
  .card-self .el-card__body {
    padding-left: 45px;
    padding-right: 45px;
  }

  .el-descriptions__table tr {
    display: table-row;
  }
}</style>