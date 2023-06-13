<template>
  <div class="sideBar flex flex-col h-full">
    <el-card class="self-introduce">
      <div class="letter mb-[16px]">
        <h2 class="desc text-[22px] font-[800] mb-[16px]">{{ user.name }}的简介</h2>
        <p><span>公司：</span><span>{{ user.company }}</span></p>
        <p><span>职业：</span><span>{{ user.job }}</span></p>
        <p><span>现居：</span><span>{{ user.address }}</span></p>
      </div>
      <div class="flex justify-between">
        <a :href="user.email" class="icon_email"></a>
        <a :href="user.qq" class="icon_qq"></a>
        <div class="relative weixin_popover">
          <img width="200" src="../../assets/weixin_qrcode.png" class="absolute bottom-[60px]">
          <a class="icon_weixin"></a>
        </div>
      </div>
    </el-card>
    <el-card class="count-card mt-[10px]">
      <div class="letter flex justify-between text-center">
        <div class="flex flex-col">
          <span class="text-[18px] font-[600]">{{news.length}}</span>
          <span class="mt-[6px]">博客文章</span>
        </div>
        <span class="split"></span>
        <div class="flex flex-col">
          <span class="text-[18px] font-[600]">+{{monthlyCount}}</span>
          <span class="mt-[6px]">本月更新</span>
        </div>
        <span class="split"></span>
        <div class="flex flex-col">
          <span class="text-[18px] font-[600]">+{{weeklyCount}}</span>
          <span class="mt-[6px]">本周更新</span>
        </div>
      </div>
    </el-card>

    <el-card class="hot-card mt-[10px]">
      <h2 class="desc mb-[16px]">🔥 精选文章</h2>
      <a
        v-for="(item, index) in hots"
        :href="item.link" 
        class="flex flex-col leading-[20px]" 
        :class="{'mb-[5px]': index <= hots.length}" 
      >
        <span class="text-[16px] letter line-clamp-1">
          <label :class="`no n${index + 1 > 3 ? 'x' : index + 1 }st`">{{ index + 1 }}</label><span>{{ item.title }}</span>
        </span>
        <p class="text-[12px] ml-[30px] flex mt-[2px]">
          <span class="split desc">{{ item.date }}</span>
          <span class="desc">{{ item.type }}</span>
        </p>
      </a>
    </el-card>
  </div>
</template> 

<script>
import { defineComponent, inject, reactive, toRefs } from 'vue'
export default defineComponent({
  name: 'RightBar',
  setup () {
    const store = inject('store')
    const state = reactive({
      weeklyCount: 0,
      monthlyCount: 0
    })
    let index = -1, length = store.news?.length;
    while(++index < length) {
      const info = store.news[index];
      const infoDate = new Date(info.date)
      if (infoDate.getMonth() == new Date().getMonth()) {
        state.monthlyCount += 1;
        if (new Date().getDate() - infoDate.getDate() <= 7) {
          state.weeklyCount += 1;
        }
      }
    }
    return {
      hots: store.news.sort((a, b) => b.index - a.index).slice(0, 10),
      ...toRefs(store),
      ...toRefs(state)
    }
  }
})
</script>

<style>
.count-card .split {
  display: flex;
  align-items: center;
}

.count-card .split::after {
  content: "";
  display: inline-flex;
  width: 1px;
  height: 15px;
  margin: 0 10px;
  background-color: #4e5969;
}

.hot-card .split::after {
  content: "";
  display: inline-block;
  width: 1px;
  height: 8px;
  margin: 0 10px;
  background: var(--description-font-color);
}

.letter {
  color: var(--vp-c-text-1);
}

.desc {
  color: var(--description-font-color)
}

.no {
  display: inline-flex;
  width: 20px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.n1st {
  content: '';
  background: #F56C6C;
}

.n2st {
  content: '';
  background: #67C23B;
}

.n3st {
  content: '';
  background: #409EFF;
}

.nxst {
  content: '';
}

.self-introduce {
  font-size: 12px;
  color: var(--vp-c-text-1);
  line-height: 1;
}

.self-introduce p {
  line-height: 22px;
}

.self-introduce a {
  width: 53px;
  height: 53px;
  display: block;
  overflow: hidden;
  box-shadow: 0px 1px 0px rgba(255,255,255,.1), inset 0px 1px 1px rgba(0,0,0,.7);
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
}

.weixin_popover img {
  display: none;
  max-width: 90px;
  left: calc((63px - 90px)/2);
  object-fit: contain;
}

.weixin_popover:hover img {
  display: flex;
}

a.icon_email {
  background: url(../../assets/email.png) no-repeat center;
}

a.icon_qq {
  background: url(../../assets/qq.png) no-repeat center;
}

a.icon_weixin {
  position: relative;
  background: url(../../assets/weixin.png) no-repeat center;
}
</style>