<template>
  <!-- <div class="max-w-[95%] xl:max-w-[50%] mx-auto">
    <el-timeline>
      <el-timeline-item v-for="item in experiences" :timestamp="item.date" placement="top">
        <el-card class="letter">
          <p><label>公司：</label><span>{{ item.company }}</span></p>
          <p><label>职位：</label><span>{{ item.job }}</span></p>
          <p class="leading-[2.5]">
            <label>技术栈：</label>
            <span 
              v-for="(tag, index) in item.tags" 
              class="label"
              :class="{'mr-[10px]': index < item.tags.length}"
              :style="{background: getRGB()}"
            >{{ tag }}</span>
          </p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2019.07 ~ 2021.03" placement="top">
        <el-card class="letter">
          <p><label>公司：</label><span>艾佳生活</span></p>
          <p><label>职位：</label><span>高级前端开发工程师</span></p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2015.09 ~ 2019.06" placement="top">
        <el-card class="letter">
          <p><label>公司：</label><span>江苏华博</span></p>
          <p><label>职位：</label><span>高级前端开发工程师</span></p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div> -->
  <div>hello world</div>
</template>

<script>
// import { defineComponent, reactive, toRefs } from 'vue';
// export default defineComponent({
//   setup () {
//     const store = reactive({
//       experiences: [{
//         company: 'Cupshe',
//         job: '高级前端开发工程师',
//         date: '2021.03 ～ 至今',
//         tags: [
//           'vue',
//           'nodejs',
//           'express',
//           'typescript'
//         ]
//       }]
//     });
//     function getRGB(){
//       let r = Math.floor(Math.random()*256);
//       let g = Math.floor(Math.random()*256);
//       let b = Math.floor(Math.random()*256);
//       let rgb = 'rgb('+r+','+g+','+b+')';
//       return rgb
//     }
//     return {
//       getRGB,
//       ...toRefs(store)
//     }
//   }
// })
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
</style>