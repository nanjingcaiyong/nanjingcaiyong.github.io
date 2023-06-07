<template>
  <div indicator-position="outside">
    <el-carousel class="pb-[70%] xl:pb-[30%] relative h-0">
      <el-carousel-item>
        <div class="h-full relative">
          <img src="../../assets/home_swiper1.jpg" class="absolute w-full h-full object-cover">
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="h-full relative">
          <img src="../../assets/home_swiper2.jpg" class="absolute w-full h-full object-cover">
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Carousel'
})
</script>

<style>
.el-carousel__container {
  height: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
