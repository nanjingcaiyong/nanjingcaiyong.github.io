<template>
  <div class="relative">
    <Carousel></Carousel>
    <div
      class="flex items-center justify-center absolute top-0 right-0 bottom-0 left-0 text-[26px] md:text-[40px] font-[800] leading-none">
      <p class="typing">
        日益努力、而后风生水起
      </p>
    </div>
  </div>
  <div class="max-w-[95%] xl:max-w-[80%] mx-auto mt-[25px] xl:mt-[60px] flex justify-between">
    <News class="w-full md:w-[70%]"></News>
    <RightBar class="w-[25%] sticky top-[92px] hidden md:block"></RightBar>
  </div>
</template>
<script>
import { provide, defineComponent } from 'vue';
import { Carousel, News, RightBar } from '../../components';
import { useStore } from '../../dataBase/store'

export default defineComponent({
  name: 'Home',
  components: {
    Carousel,
    News,
    RightBar
  },
  setup() {
    const store = useStore()
    provide('store', store)
  }
});


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

.typing {
  text-shadow: 1px 1px 2px #4e5969;
  width: 11.1em;
}

.typing {
  white-space: nowrap;
  border-right: 2px solid transparent;
  animation: typing 3.5s steps(11, end), blink-caret .75s step-end infinite;
  overflow: hidden;
}

/* 打印效果 */
@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 11.1em;
  }
}

/* 光标闪啊闪 */
@keyframes blink-caret {

  from,
  to {
    box-shadow: 1px 0 0 0 transparent;
  }

  50% {
    box-shadow: 1px 0 0 0;
  }
}</style>