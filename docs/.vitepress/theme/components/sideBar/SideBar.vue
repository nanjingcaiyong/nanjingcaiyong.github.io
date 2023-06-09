<template>
  <div class="sideBar flex flex-col h-full">
    <el-card class="self-introduce">
      <div class="letter mb-[16px]">
        <h2 class="desc text-[22px] font-[800] mb-[16px]">蔡勇的简介</h2>
        <p><span>公司：</span><span>Cupshe</span></p>
        <p><span>职业：</span><span>高级前端开发工程师</span></p>
        <p><span>现居：</span><span>南京市-雨花台区</span></p>
      </div>
      <div class="flex justify-between">
        <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=2872845261@qq.com" class="icon_email"></a>
        <a href="http://wpa.qq.com/msgrd?v=3&amp;uin=2872845261&amp;site=qq&amp;menu=yes" class="icon_qq"></a>
        <el-popover
          placement="top-start"
          :width="200"
          trigger="hover"
        >
          <template #default>
            <img src="../../assets/weixin_qrcode.png">
          </template>
          <template #reference>
            <a class="icon_weixin"></a>
          </template>
        </el-popover>
      </div>
    </el-card>
    <el-card class="box-card mt-[10px]">
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

    <el-card class="box-card mt-[10px]">
      <h2 class="desc mb-[16px]">🔥 精选文章</h2>
      <a class="flex flex-col leading-[20px] mb-[5px]">
        <span class="no n1st text-[14px] letter">视野修炼-技术周刊</span>
        <span class="text-[12px] ml-[30px]">2023-06-03</span>
      </a>

      <a class="flex flex-col leading-[20px] mb-[5px]">
        <span class="no n2st text-[14px] letter">视野修炼-技术周刊</span>
        <span class="text-[12px] ml-[30px]">2023-06-03</span>
      </a>

      <a class="flex flex-col leading-[20px]">
        <span class="no n3st text-[14px] letter">视野修炼-技术周刊</span>
        <span class="text-[12px] ml-[30px]">2023-06-03</span>
      </a>
    </el-card>
  </div>
</template> 

<script>
import { defineComponent, inject, reactive, toRefs } from 'vue'
export default defineComponent({
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
      ...toRefs(store),
      ...toRefs(state)
    }
  }
})
</script>

<style>
.sideBar .split {
  display: flex;
  align-items: center;
}
.sideBar .split::after {
  content: "";
  display: inline-flex;
  width: 1px;
  height: 15px;
  margin: 0 10px;
  background-color: #4e5969;
}
.letter {
  color: var(--vp-c-text-1);
}
.desc {
  color: var(--description-font-color)
}
.no::before {
  display: inline-flex;
  width: 20px;
  justify-content: center;
  align-items: center;

  margin-right: 10px;
}

.n1st::before {
  content: '1';
  background: #F56C6C;
}

.n2st::before {
  content: '2';
  background: #67C23B;
}

.n1st::before {
  content: '1';
  background: #F56C6C;
}

.n3st::before {
  content: '3';
  background: #409EFF;
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
/* a.icon_weixin:hover {
  background: url(../../assets/weixin_qrcode.png);
  background-size: contain;
  position: absolute;
  top: -100px;
} */
</style>