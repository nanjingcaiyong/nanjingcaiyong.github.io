<template>
  <el-card class="box-card h-full">
    <div class="letter flex justify-between text-center">
      <div class="flex flex-col">
        <span class="text-[18px] font-[600]">{{news.length}}</span>
        <span class="mt-[6px]">博客文章</span>
      </div>
      <div class="flex flex-col">
        <span class="text-[18px] font-[600]">+1</span>
        <span class="mt-[6px]">本月更新</span>
      </div>
      <div class="flex flex-col">
        <span class="text-[18px] font-[600]">0</span>
        <span class="mt-[6px]">本周更新</span>
      </div>
    </div>
  </el-card>
</template> 

<script>
import { defineComponent, inject, toRefs } from 'vue'
export default defineComponent({
  setup () {
    const state = inject('store')
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style>
.letter {
  color: var(--vp-c-text-1);
}
</style>