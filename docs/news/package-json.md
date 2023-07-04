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

指定一个代码存放地址，对想要为你的项目贡献代码的人有帮助
- type
- url 仓库地址
- directory 如果是 `monorepo` 需要指定所在目录

### type
- commonjs
- module

### bugs

### private

是否私有化。如果设为 `true`，执行 `npm publish` 会被 npm 拒绝，这是为了防止意外的将私有模块无意的发布出去

### fundig

赞助商

## 依赖配置

### packageManager

包管理工具

### devDependencies

表示在开发时所需要用到的或依赖的包

### dependencies

表示该项目在运行时所需要用到的依赖项

### peerDependencies

peerDependencies 主要用于依赖包中，在项目中不起作用。在依赖包中 执行 `npm install` 时依赖会被安装，但在宿主项目中不会被安装，用于检查宿主项目该包的版本与 peerDependencies 指定的版本是否匹配，如果不匹配或未安装，控制台输出警告。 

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

### optionalDependencies

安装失败时不会中断安装行为，程序依旧可以正常运行。项目中使用时应该通过判定该包是否存在来决定所需要执行的代码。


### bundleDependencies

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
导出 主声明文件

### typiping
"typings" 与 "types" 具有相同的意义

### exports

在 node v12.7.0 后提供了对于入口文件的替代品字段，它的优先级是高于任何入口字段的（module、main、browser）

当打包工具支持exports字段时（webpack、Rollup 等），以上main，browser，module，types四个字段都被忽略。

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

在 exports 字段中同时为我们提供了该条件判断：
```js
// package.json
{
  "exports": {
    // ESM 引入时的入口文件
    "import": "./index-module.js",
    // CJS 方式引入时寻找的路径
    "require": "./index-require.cjs"
  },
}
// 相当于
{
  "exports": {
    "import": {
        ".":  "./index-module.js"
    },
    "require": {
        ".": "./index-require.cjs"
    }
  },
}
```

关于条件判断的 Key 值，除了上述的 import 和 require 分别代表的 ESM 引入和 CJS 引入的方式，NodeJS 同样提供了以下的条件匹配：
- "import" 当包通过 ESM 或加载时匹配 import()，或者通过 ECMAScript 模块加载器的任何顶级导入或解析操作
- "require" 当包通过 CJS 加载时，匹配require()
- "default" 始终匹配的默认选项。可以是 CommonJS 或 ES 模块文件。这种情况应始终排在最后。（他会匹配任意模块引入方式）

**嵌套条件**

exports 还支持多层嵌套，支持在运行环境中嵌套不同的引入方式从而进行有条件的导出。

```json
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```

上述的匹配条件就类似于 js 中的 if 语句，首先检查是否是 Node 环境下去运行。如果是则进入模块判断是 ESM 引入方式还是 CJS 方式。

如果不是，则进行往下匹配进入 default 默认匹配，default 会匹配任何方式。

**更多的 exports key**

当然，除了上述 Node 中支持的 exports key 的条件。比如上述我们提到的 import、require、node、default 等。

同样，exports 的 Key 也支持许多社区中的成熟关键字条件，比如：

- "types" typescipt 可以使用它来解析给定导出的类型定义文件
- "deno" 表示 Deno 平台的关键 key。
- "browser" 任何 Web 浏览器环境。
- "development" 可用于定义仅开发环境入口点，例如提供额外的调试上下文。
- "production" 可用于定义生产环境入口点。必须始终与 互斥"development"


最后，让我们以 Vue/Core 中的 exports 来为大家看看开源项目中的 exports 关键字用法：

```json
{
   "exports": {
    ".": {
      "import": {
        "node": "./index.mjs",
        "default": "./dist/vue.runtime.esm-bundler.js"
      },
      "require": "./index.js",
      "types": "./dist/vue.d.ts"
    },
    "./server-renderer": {
      "import": "./server-renderer/index.mjs",
      "require": "./server-renderer/index.js"
    },
    "./compiler-sfc": {
      "import": "./compiler-sfc/index.mjs",
      "require": "./compiler-sfc/index.js"
    },
    "./dist/*": "./dist/*",
    "./package.json": "./package.json",
    "./macros": "./macros.d.ts",
    "./macros-global": "./macros-global.d.ts",
    "./ref-macros": "./ref-macros.d.ts"
  }
}
```

### typesVersions

typesVersions 是对主声明文件路径的映射

```json
{
  "exports": {
    ".": {
      "import": ""
    }
  },
}
```


## 开发配置

### workspaces

### scripts

### lint-staged（非官方）

### browserslist（非官方）
### sideEffects（非官方）
指示包是否具有副作用，协助Webpack，Rollup等进行tree shaking。多数情况下可以直接设置为false，这样打包工具就会自动删除未被import的代码

但是有些情况例外：
- 有一些特定的模块文件，它们执行一些副作用操作，如注册全局事件监听器、修改全局状态等。
- 告诉构建工具不要将样式文件排除在无用代码消除的优化范围之外