# 带你走进 Web Components 新世界

今天我们来聊一聊 `Web Components`，笔者一直相信 `存在即合理`。

下面来说说我接触 Web Components 的背景：我司是做跨境电商的，C端站点是基于三方的SaaS电商服务平台，后期代码全部通过该平台进行维护。由于公司快速发展，该平台已经限制了我们业务发展的边界，无法满足日益定制化的需求，搭建自己的系统不可或缺。直接全量切自研系统不太现实，所以我们按业务模块通过不断迭代逐个替换。

目前我们采取的方案是：使用 webpack + vue全家桶打包成 `MPA` 项目，将打包好的模块引入到三方平台，说白点就是把打包后推到 CDN 上的 js 和 css 引入到三方平台挂载到指定 `DOM` 上。

但是这里有个问题，由于三方平台里面的代码质量问题，原有的样式会影响到我们自建模块里面的样式，每次本地开发完成，核对一遍 UI 没问题，但是一旦代码加入到三方平台，各种样式问题就找来了, 除非再核对一遍 UI，那么工作量直接double；还有就是多站点代码迁移，由于每个站的样式覆盖代码不同，还得针对每个站的覆盖情况进行重置，导致 UED 和 我们都很痛苦。

想到了两种解决方案：
1. `iframe` ，天然的`沙箱`，但存在几个问题，就是如何解决iframe的`高度自适应`的问题，以及如何解决两个系统`数据高度依赖`的问题，所以只能进入待定区。
2. `Web Components` 里面有个叫 `Shadow DOM` 的东西，也是一个天然的 `DOM` 和 `样式`的 沙箱。

说了这么多总算把背景说完了，下面进入正题。


## 让我们带着问题进入今天的学习
1. 离开vue、react、angular，你怎么实现组件化？
2. 为什么要组件化？
3. 组件化的优点和特征有哪些？
4. 为什么说 Web Components 可以实现跨框架的组件开发？

## 基础知识

### 特征：
- 非侵入
- 无依赖
- 纯原生

### 三大技术套件
-  Custom elements（自定义元素）： 一组JavaScript API，允许您定义custom elements及其行为，然后可以在您的用户界面中按照需要使用它们。
-  Shadow DOM（影子DOM）：一组JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而**不用担心与文档的其他部分发生冲突**。
-  HTML templates（HTML模板）：[`<template>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template) 和 [`<slot>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/slot) 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。


### 1. Custom elements
第1步：定义组件类
```js
  class UserCard extends HTMLElement {
    constructor () {
      super();
      const elm = document.createElement('div');
      elm.textContent = 'Hello world';
      elm.id = 'container';
      elm.onclick = function () {
       console.log(shadow.getElementById('container'))
      }
      const style = document.createElement('style');
      style.textContent = `
        body {
          background: red;
        }
        #container {
          color: blue
        }
      `
      this.append(elm, style)
    }
  }
```

第2步：注册组件
```js
customElements.define('user-card', UserCard);
```

第3步：使用自定义标签
```html
<div>
  <user-card></user-card>
  <user-card></user-card>
</div>
```

完整代码
```html
 <style>
  body #container {
    color: #fff;
  }
  </style>
  <div>
    <user-card></user-card>
    <user-card></user-card>
  </div>
  
  <script>
  class UserCard extends HTMLElement {
    constructor () {
      super();
      const elm = document.createElement('div');
      elm.textContent = 'Hello world';
      elm.id = 'container';
      elm.onclick = function () {
       console.log(shadow.getElementById('container'))
      }
      const style = document.createElement('style');
      style.textContent = `
        body {
          background: red;
        }
        #container {
          color: blue
        }
      `
      this.append(elm, style)
    }
  }
  customElements.define('user-card', UserCard);
  </script>
```

这个也没啥说的了，就是通过`customElements`的`define` 函数注册一个自定义组件，然后组件的内容这里通过 `JavaScript API` 维护，然后在需要的地方使用这个自定义标签。这里有一点要注意，就是自定义标签命名的限制，如下：
1. 必须以小写字母开头
2. 必须有至少一个中划线
3. 容许小写字母，中划线，下划线，点号，数字

最终效果如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dabf6cfd448e41fc98d2c87492264014~tplv-k3u1fbpfcp-watermark.image?)

我们发现两个问题：
1. 组件中的body全局样式影响了主文档的样式，主文档中设置的字体颜色覆盖了组件中的字体颜色，组件和主文档样式相互影响
2. 点击 `Hello world` 获取了两个同名 DOM，这是因为组件中的 DOM 没有隔离

下面我们通过 `Shadow DOM` 来解决这两个问题

### 2. Shadow DOM

Shadow DOM 允许在文档（Document）渲染时插入一棵 `子 DOM 树`，并且这棵子树不在 `主 DOM 树`中，同时为子树中的 DOM 元素和 CSS 提供了封装的能力。Shadow DOM 使得子树 DOM 与主文档的 DOM 保持分离，子 DOM 树中的 样式 不会影响到主 DOM 树的内容，如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0b2f030c8c345ecba2a139deb09eed0~tplv-k3u1fbpfcp-watermark.image?)

**举例说明**

**例1**：在开发一个表单的时候，`同学A` 给form表单加了一个 `id` 叫 `newForm`, 然后通过给 `id` 为 `newForm` 的这个dom绑定了一个事件用于校验表单，经测试后成功上线。后面 `同学B` 基于业务需要也要在这个 html 里面加个 form，巧的是给新加的form `id` 也取了 `newForm` 这个名字，并且也是通过获取dom的方式绑定事件去校验表单。我们不难猜到对两个相同`id`的form绑定事件，永远都只会绑定到第一个form上面，如果用我们今天所学的知识怎么解决呢？

真相就是：Shadow DOM 🎉，利用了它的 `DOM 隔离`特性。

**例子**：脱离 vue、react 等框架后，通过纯原生封装组件，`同学A` 在 html里面写了一个 `Table` element 片段，然后通过 `js` 移动到指定的地方，这个时候发现有很对样式被覆盖了，通过 devtools 发现是被祖先节点的标签样式覆盖。如果还是用我们今天所学的知识怎么解决呢？

真相还是就是：Shadow DOM 🎉，利用了它的 `样式隔离` 特性。

### 3. HTML templates 和 slot

使用 JavaScript 写 DOM 结构很麻烦，Web Components API 提供了`<template>`标签，可以在它里面使用 HTML 定义 DOM。 `<slot>` 标签则是将变化部分开放给开发者，提高组件的复用性，类似于 VUE 的 `<slot>` 标签。


## 实战

1. 实现一个名片组件

    ```html
    <style>
      .container {
        background: red;
      }
    </style>
    <user-card></user-card>
    <script src="./main.js"></script>
    ```

    ```js
    class UserCard extends HTMLElement {
      constructor() {
        super();

        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'wrapper')

        var container = document.createElement('div');
        container.classList.add('container');

        var image = document.createElement('img');
        image.src = 'https://semantic-ui.com/images/avatar2/large/kristy.png';
        image.classList.add('image');

        var name = document.createElement('p');
        name.classList.add('name');
        name.innerText = 'yong.cai';

        var email = document.createElement('p');
        email.classList.add('email');
        email.innerText = 'yong.cai@kapeixi.com';

        var button = document.createElement('button');
        button.classList.add('button');
        button.innerText = '关注';
        button.onclick = function () { alert("关注成功") }

        const style = document.createElement('style');
        style.textContent = `
         .wrapper {
           display: flex;
         }
         .container {
           margin-left: 10px;
         }
         img {
           width: 150px;
         }
        `
        container.append(name, email, button, style);
        wrapper.append(image, container)
        this.append(wrapper);
      }
    }
    customElements.define('user-card', UserCard)
    ```
    效果如下：

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ae4765c7a3c4144889b166ad679aa5c~tplv-k3u1fbpfcp-watermark.image?)

    我们可以看到 `组件的样式` 被 `主文档的样式` 影响了

2. 我们用 Shadow DOM 实现 dom 和 样式的隔离
    ```js
    // main.js
    + const shadow = this.attachShadow({mode: 'open'});
    ……
    - this.append(wrapper);
    + shadow.appendChild(wrapper);
    ```

    同样，我们看下效果：

    ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52cef39f64d34eea82d857fcc72348d3~tplv-k3u1fbpfcp-watermark.image?)


    我们可以看到 `组件的样式` 不会仔被 `主文档的样式` 影响了，就实现了 组件样式隔离，这就是 `Shadow DOM 存在的意义`

3. 使用 template 标签 解决用 js 写页面的痛苦

    ```html
   <style>
      .container {
        background: red;
      }
    </style>
    <user-card></user-card>

    <template id="userCardTemplate">
      <style>
        .wrapper {
          display: flex;
        }

        .container {
          margin-left: 10px;
        }

        img {
          width: 150px;
        }
      </style>
      <script>
        function follow() {
          alert('关注成功')
        }
      </script>
      <div class="wrapper">
        <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image">
        <div class="container">
          <p class="name">yong.cai</p>
          <p class="email">yong.cai@kapeixi.com</p>
          <button onclick="follow()">关注</button>
        </div>
      </div>
    </template>
    ```

    ```js
    class UserCard extends HTMLElement {
      constructor() {
        super();
        var shadow = this.attachShadow({'mode': 'open'})
        var templateElem = document.getElementById('userCardTemplate');
        var content = templateElem.content.cloneNode(true);
        shadow.append(content);
      }
    }
    customElements.define('user-card', UserCard)
    ```

    我们之前使用 js 写 html 代码是不是感觉很不方便，用了 template 后我们就又回到了熟悉的html开发了，完美

4. 使用 slot 标签，将变化的部分暴露给开发者，提供复用性

    ```html
    <style>
      .container {
        background: red;
      }
    </style>
    <user-card>
      <span slot="uName">yong.cai</span>
      <span slot="email">yong.cai@kapeixi.com</span>
    </user-card>

    <template id="userCardTemplate">
      <style>
        .wrapper {
          display: flex;
        }

        .container {
          margin-left: 10px;
        }

        img {
          width: 150px;
        }
      </style>
      <script>
        function follow() { alert("关注成功") }
      </script>
      <div class="wrapper">
        <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image">
        <div class="container">
          <p class="name">
            <slot name="uName">占位</slot>
          </p>
          <p class="email">
            <slot name="email">占位</slot>
          </p>
          <button class="button" onclick="follow()">关注</button>
        </div>
      </div>
    </template>
    ```

    ```js
    class UserCard extends HTMLElement {
      constructor() {
        super();
        var shadow = this.attachShadow({mode:'open'})
        var templateElem = document.getElementById('userCardTemplate');
        var content = templateElem.content.cloneNode(true);

        shadow.appendChild(content)
      }
    }
    customElements.define('user-card', UserCard)
    ```


## 总结

我们可以通过原生的 Web Components 来封装组件，由于是原生的，所以我们就可以在Vue、React、angular等框架中使用，而且不需要引入任何依赖，不会对我们代码有任何入侵，具备了组件化的能力，能够隔离外界对组件内部 `DOM` 和 `样式`的影响（类似于 Vue 的 scoped），yyds啊

但是千万别把 Web Components 只当作用来封装组件的技术，这样认为就过于片面了，只有了解三大套件的特性才能更好的应用到实际开发中。

 **Custom elements（自定义元素）**：使用 customElements.define 声明自定义标签
 
 **Shadow DOM（影子DOM）**：将自定义组件 和 外界 的 dom 和 样式隔离
 
 **HTML templates（HTML模板）**：用 HTML 的方式定义模版
 
 **Slot（插槽）**：类似于 VUE \<slot\> 标签，将变化开放给开发者，提高复用性。但只能在 `Shadow DOM` 中使用。

**Demo 地址：**[前往](https://github.com/nanjingcaiyong/webcomponents-demos)

