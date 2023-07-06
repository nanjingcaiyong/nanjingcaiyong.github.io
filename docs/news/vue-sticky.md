# vue 实现快速实现 Sticky 组件

## 前言

我们在实际开发过程中，多多少少接触过吸顶的交互场景。

相信大家第一感觉就是很简单啊，用 `css` 的 `sticky` 完全满足，我也是这么想的。但是实际在使用的时候会发现 `sticky` 在快速滑动的时候会有细微的 `抖动`，在 移动端尤其明显。

于是想起了 UI库(antd、elementui) 有对吸顶相关的组件（Affix），于是粗略看了相关代码，发现他们不约而同的使用 `js` 实现了 `sticky` 的效果，至于为什么都不用 CSS 原生 Sticky 实现，相信现在大家心里都明白了。

所以今天我们说一下如何通过 js 实现 `sticky` 的效果。

## 实现

实现之前，我们先分析一下吸顶的具体交互过程：
- 当 `目标Dom底部` 消失在可视区域的时候，将 `目标Dom` 的 `position属性` 设为 `fixed`，`top属性` 设为 `0` (这里top根据实际情况), `z-index属性` 设为 `1`（这里根据实际情况）
- 当 `目标Dom底部` 出现在可视区域的时候，将 `目标Dom` 的 `position`、`top`、`z-index` 还原。(position: static;top: auto;z-index: auto)

分析完成后，我们发现第一步需要监听 `目标Dom底部` 是否出现在可视区域，常用的两种方式：
- 使用 `IntersectionObserver` 监听 `目标Dom底部` 是否出现在可视区域
- 监听 `scroll` 事件，判断 `目标Dom底部` 是否出现在可视区域


### IntersectionObserver
```js
const observer = new IntersectionObserver((entries)=> {
  if (entries[0].isIntersecting) { // 出现在可视区域
    Object.assign(target.style, {
      position: 'static',
      zIndex: 'auto',
      top: 'auto'
    })
  } else {                         // 消失在可视区域
    Object.assign(target.style, {
      position: 'fixed',
      zIndex: 1,
      top: 0
    })
  }
});
observer.observe(target);
```

我们拆步骤分析一下：
- 1、当 `目标Dom` target 消失在可视区域时，我们将 `position属性` 设为 `fixed` 且 `top属性` 设为 `0`，此时 `消失的目标Dom` 脱离文档流吸顶；
- 2、与此同时 `消失的目标Dom` 脱离文档流后，又出现在了 `可视区域`，此时又会将 `position属性` 设为 `static`，`消失的目标Dom` 又回归到文档流，消失在可视区域
- 3、往复执行……，形成死循环

根据上面分析 `IntersectionObserver` 显示不适合做吸顶的场景。

### scroll

首先我们需要获取到 `目标Dom底部` 距离页面顶部的距离，当滚动条的滚动距离超过 `目标Dom底部`，我们视为 `消失在可视区域`，让 `目标Dom` 脱离文档流完成吸顶；否则，视为 `出现在可视区域`，让 `目标Dom` 回归文档流取消吸顶，具体实现如下：

```js
const debounce = (func: (e: Event) => void, wait: number, immediate?: boolean) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[] | any) => {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(this, args);
      }
    }
    else {
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  };
};
const target = document.querySelector('xxx')
const rect = target.getBoundingClientRect();
window.addEventListener('scroll', debounce(() => {
  let style = { position: 'static', top: 'auto', zIndex: 'auto' };
  if (document.documentElement.scrollTop > rect.bottom) {
    style = { position: 'fixed', top: `${props.top}`, zIndex: `${props.zIndex}` };
  }
  Object.assign(target.style, style);
}, 15));
```

上面使用 `debounce` 函数进行 `防抖`，减少频繁触发的频率。


## vue 封装的sticky组件
```vue
<template>
  <div ref="stickyRef">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const stickyRef = ref();
defineOptions({
  name: 'Sticky'
});

const props = defineProps({
  zIndex: {
    type: Number,
    default: 99
  },
  top: {
    type: Number,
    default: 0
  }
});

const debounce = (func: (e: Event) => void, wait: number, immediate?: boolean) => {
  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout | null;
  return (...args: any[] | any) => {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(this, args);
      }
    }
    else {
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  };
};

onMounted(() => {
  const rect = stickyRef.value.getBoundingClientRect();
  window.addEventListener('scroll', debounce(() => {
    let style = { position: 'static', top: 'auto', zIndex: 'auto' };
    if (document.documentElement.scrollTop > rect.bottom) {
      style = { position: 'fixed', top: `${props.top}`, zIndex: `${props.zIndex}` };
    }
    Object.assign(stickyRef.value.style, style);
  }, 15));
});
</script>
```
