<template>
  <el-card class="news-card">
    <a :href="data.link">
      <div class="flex justify-between items-center">
        <div class="letter">
          <h3 class="text-[18px] font-[600] mb-[8px] leading-none">{{ data.title }}</h3>
          <p class="text-[14px] line-clamp-2 desc mb-[8px]">{{ data.content }}</p>
          <p class="text-[12px]">
            <span class="split">{{ data.date }}</span>
            <span>{{ data.type }}</span>
          </p>
        </div>
        <img 
          class="flex w-[100px] ml:w-[120px] object-contain ml-[12px] md:ml-[24px]" 
          src="../../assets/news_1.jpg"
        >
      </div>
    </a>
  </el-card>
</template>


<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'NewCard',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
});
</script>
<style>
.letter {
  color: var(--vp-c-text-1);
}

.desc {
  color: var(--description-font-color)
}

.news-card .split::after {
  content: "";
  display: inline-block;
  width: 1px;
  height: 8px;
  margin: 0 10px;
  background-color: #4e5969;
}
</style>