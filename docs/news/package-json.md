# package.json 字段详解

## 基础信息配置

### name（可选）

包的名称，如果不打算发包，那么它是可选的。如需发到 npm 上，请保证它是唯一的。name 的命名是有规则的，如下：

- 不能包含大写字母
- 不能超过214个字符

### version（可选）

项目或包的版本号，在项目生命周期中必须是唯一的

### author 
作者信息

- name
- email

### license
- ISC
- MIT

### repository
- type
- url 仓库地址

## type
- commonjs
- module

### bugs

## 依赖配置

### packageManager

包管理工具

### devDependencies

开发依赖

### dependencies

生产依赖

### peerDependencies

在某些场景下，希望当前`工具包`与`宿主项目`依赖的兼容性（依赖的版本一致性），需要用 peer 指定依赖。如果当前`工具包`希望和`宿主项目`同样依赖 vue@3, 当前工具包的配置如下：
```json
{
  "name": "xxx",
  "version": "x.x.x",
  "peerDependencies": {
    "vue": "3.x",
  },
}
```

## npm 配置

### keywords
关键字，用于其他开发者在 npm 上能够通过`关键词`检索你的工具包

### publishConfig
- registry 发布的仓库。公司私仓库 或 npm (https://registry.npmjs.org/)

### homepage

工具包的文档主页，一般是使用文档

### files

指定包含的文件、目录 或 排除指定的文件、目录外 提交到 npm。 和 `.npmignore` 作用类似, `.npmignore` 不会覆盖 files 字段，但在子目录中会覆盖。


## 导出配置

### main

包的入口文件，如果 `工具包` 名为 `rich-js`，然后执行 `require('rich-js')`，则将返回 `rich-js`的导出对象。

导出的文件路径是相对于包文件夹的根目录

如果未设置main字段，则默认采用根目录下的index.js文件

### module

同 main 字段，区别在于 ESM 模块管理机制

### browser

main、module、browser 区别

- 在 `浏览器` 环境下，加载的优先级 `browser > module > main`, 比如如果 browser 未配置，则采用 module；如果 module 未配置，则采用 main。注意，如果使用打包工具如 webpack，通过 resolve.mainFields 是会覆盖上述优先级。
- 在 `node` 环境下，只会采用 `main` 配置，如果没有则报错

### types

导出声明文件

### exports

在 node v12.7.0 后提供了对于入口文件的替代品字段，它的优先级是高于任何入口字段的（module、main、browser）

**路径封装**

首先 exports 字段可以对于包中导出的路径进行封装

比如下面的代码：

```json
{
  // 表示该包仅存在默认导出，默认导出为 ./index.js
  "exports": "./index.js"
}
// 上述的写法相当于
{
  "exports": {
    ".": "./index.js"
  }
}
```

当我们定义了该字段后，该 Npm 包仅支持引入包自身，禁止引入其他子路径，相当于对于子路径的封装

换句话说，我们仅仅只能引入 index.js。比如我们引入了未在 exports 中定义的模块。

```js
// Error
// 此时控制台会报错，找不到该模块(无法引入在 exports 未定义的子模块路径)
import Rich from 'rich-js/src/test.js'
// correct
import Rich from 'rich-js'
```

同时在使用 exports 关键字时，可以通过 . 的方式来定义主入口文件：
```json
{
  "exports": {
    // . 表示引入包默认的导出文件路径， 比如 import qingfeng from 'qingfeng'
    // 这里的 . 即表示未携带任何路径的 qingfeng，相当于默认导出 ./index.js 文件的内容
    ".": "./index.js",
    // 同时额外定义一个可以被引入的子路径
    // 可以通过 import qingfengSub from 'qingfeng/submodule.js' 进行引入 /src/submodule.js 的文件
    "./submodule.js": "./src/submodule.js"
  }
}
```

**条件导出**

同样， exports 字段的强大不仅仅在于它对于包中子模块的封装。这个字段同时提供了一种根据特定条件映射到不同路径的方法

比如，通常我们编写的 NPM 包支持被 ESM 和 CJS 两种方式同时引入，根据不同的引入方式来寻找不同的入口文件
