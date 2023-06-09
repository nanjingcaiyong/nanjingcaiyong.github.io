# 一行展示不下，如何隐藏单个dom?

图片上左侧文案 和 标签内蓝色文案都是在后管维护

左侧文案重要性高所以不进行省略，而右侧标签`自适应剩余宽度`进行省略


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/083f5f94b3a948ccb27f0454072b6ea0~tplv-k3u1fbpfcp-watermark.image?)


**下面简单写出html结构和css样式**
```html
<style>
.container {
  display: flex;
}
.right {
  display: flex;
  flex: 1;
  width: 0;
}
span {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
}
span:first-child {
  white-space: nowrap;
  flex: 0;
  overflow: visible;
}
.label {
  background: rgba(0, 119, 255, 0.218);
  color: rgb(24, 110, 229);
}
</style>
<div class="container">
  <div class="left">
    <img src="" alt="" width="300" height="300">
  </div>
  <div class="right">
    <span>我的简介我的简介我的简介我的简介我的简介我的简介我的简介我的简介我的简介我的简介</span>
    <span class="label">好人、坏人、热心、阳光、自信、乐观、上进、与众不同、非主流</span>
  </div>
</div>
```

**起作用的关键：width: 0**

两个行内元素的父元素设置 `flex: 1;width: 0;`

如果没有设置width, 当`内部元素的内容大小` 超过 `平均分配的剩余空间`时, 元素的宽度 `等于` 内容大小。如果设置了width 并且 这个width的大小 `小于` 平均分配的剩余空间大小时, 取平均分配的剩余空间;

当flex设置为 1 时 相当于 剩余空间大小 = 父元素的宽度

因此平均的剩余空间大小等于 = 父元素的宽度 / 元素的个数

直接设置width为0可以保证元素宽度平分父元素宽度
