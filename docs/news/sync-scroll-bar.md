# 移动端如何让两个横向滚动条同步？

最近接到一个需求，页面底部有一个瀑布流，可以通过 tab 标签切换刷新瀑布流数据，用户往下滑动，tab 栏吸顶。

需求很简单，瀑布流会在后面文章详细讲解，这里说一下 tab 栏相关逻辑

- 1、用户往下滑动，当 tab栏 消失后吸顶
- 2、瀑布流上的 tab栏 和 吸顶的 tab栏 横向位置保持一致

然后脑海里面第一感觉就是用 sticky 实现，相信大多数人和我的反应一致，但是实际在使用的时候会发现 sticky 在滑动的时候会有细微的抖动，在 移动端尤其明显。

于是想起了 UI库 有对吸顶相关的组件（Affix），于是看了相关代码，发现他们都是通过 js 实现了 sticky 的效果（当目标Dom消失在可视区域，将其position 设为 fixed）, 至于为什么 几大 UI库都不用 CSS 原生 Sticky 实现，相信大家心里都明白了。

于是果断放弃了 sticky，又仔细思考了一下想到两个解决方案

## js 实现 sticky效果

后面会单独出一篇文章，这篇文章主要说 两个tab栏如何同步

## 两个 tab 栏，拖动时保持同步

一个用 Telport（vue3） 挂载到页面 header上，另一个仍然位于瀑布流上方。至于为什么会有这种方案，第一是因为 tab栏 和 吸顶的 tab栏 UI差异比较大，难以服复用；第二是因为网站 header 已经实现了吸顶，所以挂在到 header 下也就继承了吸顶功能。下面主要说一下两个横向滚动条如何同步？

思路：在两个 tab栏 的滚动容器上分别注册 scroll 事件，然后用当前触发的 tab栏 的 scrollLeft 赋值 另一个 tab栏 scrollLeft，来达到同步。

但发现一个问题，赋值另一个 tab栏 的scrollLeft 属性会触发它的 scroll事件，这样就导致了两个 tab栏 相互赋值的死循环。

方案：当 tab栏 的 scroll 触发前，销毁另一个 tab栏 注册的scroll事件。所以就需要一个开关（移动端：用户触碰tab栏，pc: 鼠标移动tab栏上），当用户触碰到当前 tab栏 时，注册当前 tab栏 scroll事件，并销毁另一个 tab栏 的 scroll事件

说完实现逻辑后，我们代码实现一下，如下：


```js
// 瀑布流上的 tabs
const tabs = document.querySelector("#tabs");
// 挂载到 header 上的 tabs
const stickyTabs = document.querySelector("#stickyTabs");

function bindEventTabs () {
  removeEventStickyTabs();
  tabs.addEventListener('scroll', tabsScroll);
}

function bindEventStickyTabs () {
  // 先销毁另一个tabs注册的scroll事件
  removeEventTabs();
  // 然后为当前tabs注册scroll事件
  stickyTabs.addEventListener('scroll', stickyTabsScroll);
}

function removeEventTabs () {
  tabs.removeEventListener('scroll', tabsScroll);
}

function removeEventStickyTabs () {
  stickyTabs.removeEventListener('scroll', stickyTabsScroll);
}

function tabsScroll () {
  // stickyTabs.scrollTop = tabs.scrollTop; // 同步上下位置
  stickyTabs.scrollLeft = tabs.scrollLeft;
}

function stickyTabsScroll () {
  // tabs.scrollTop = stickyTabs.scrollTop;
  tabs.scrollLeft = stickyTabs.scrollLeft;
}

// 用户触碰时注册scroll事件
stickyTabs.addEventListener('touchstart', bindEventStickyTabs);
tabs.addEventListener('touchstart', bindEventTabs);
```