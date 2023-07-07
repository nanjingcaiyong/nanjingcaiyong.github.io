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

在 `node@12.7.0` 后提供了对于入口文件的替代品字段，它的优先级是 `高于` 任何入口字段的（module、main、browser）

当打包工具支持exports字段时（webpack、Rollup 等），以上main，browser，module，types四个字段都被忽略。

**主入口导出**

类似 main 和 module 字段，我们可以使用下面的写法来配置一个模块没有写子路径时怎样导出的，也叫主入口：

```json
{
  "name": "xxx",
  "exports": {
    ".": "./index.js"
  }
}
```

对于上面的例子，可以换成简单写法
```json
{
  "name": "xxx",
  "exports": "./index.js"
}
```

例如 `import x from 'xxx'` 其实会被解析到 `node_modules/xxx/index.js`

当我们定义了该字段后，禁止引入其他子路径，例如模块`xxx`我们仅仅只能引入 index.js。那么我们引入了未在 `exports` 中定义的模块，nodejs 将报错。

```js
// Error
// 此时控制台会报错，找不到该模块(无法引入在 exports 未定义的子模块路径)
import Rich from 'xxx/src/test.js'
// correct
import Rich from 'xxx'
```

**子路径导出**

你可以像下面这样定义子路径模块的映射规则：
```json
{
  "name": "xxx",
  "exports": {
    "./add.js": "./src/add.js"
  }
}
```

没有声明的子路径不能使用：
```js
// 加载 ./node_modules/xxx/src/submodule.js
import submodule from 'xxx/add.js';

// Throws ERR_PACKAGE_PATH_NOT_EXPORTED
import submodule from 'xxx/private-minus.js';

```


**导出多个子路径**
例如我们重构 lodash，把所有的子路径模块，也就是 package.json 同级的的那一堆 js 模块放到 lib 文件夹。一种选择就是声明所有子路径：

```json
{
  "name": "lodash",
  "exports": {
    "./add": "./lib/add.js",
    "./multiply": "./lib/multiply.js",
    "...": "..."
  }
}
```

但是由于 lodash 的模块非常多，这样处理会导致 package.json 非常臃肿。

通过在子路径中使用通配符可以处理任意的嵌套子路径：

```json
{
  "name": "lodash",
  "exports": {
    "./*": "./lib/*.js"
  }
}
```

在 node 官方文档中：
- exports 可以写通配符 * 的路径例如 ./* 在英文术语里叫 pattern，也就是模式
- exports 的 value ./lib/*.js 的英文术语叫 target pattern，也就是目标模式

注意我们这里的 * 用的不是 glob 语法，在 glob 语法里面 * 表示任意的一层目录，但是在 exports pattern 中可以表示无限层任意路径。

要读懂这个映射规则，我们可以这样理解：

- 给定一个模块 id lodash/add
- 使用模块名 lodash 替换左侧的 pattern ./* 中的 `.` ，得到 lodash/*
- 把 pattern lodash/* 和模块 id lodash/add 做模式匹配，得到 * 的值就是 add
- 将 target pattern ./lib/*.js 中的 * 替换第三步得到的 * 的值得到 ./lib/add.js，也就是相对于 lodash package 的相对路径
- 把相对路径中的 `.` 替换为 lodash package 的绝对路径就能得到模块 id lodash/add 的绝对路径：/xxx/node_modules/lodash/lib/add.js

**禁止模块导出**

你可以用通过将一个模块的 target pattern 设置为 null 来禁止某个子路径被另一个模块导入：
```json
{
  "name": "xxx",
  "exports": {
    "./forbidden": null
  }
}
```

**扩展名和文件夹模块问题**

需要注意的是 nodejs 在通过 exports 解析模块时是不会做自动添加扩展名的操作，例如你写成下面这样是有问题的：
```json
{
  "name": "lodash",
  "exports": {
    "./*": "./lib/*"
  }
}
```

使用上面的配置， lodash/add 会被解析到 xxx/node_modules/lodash/lib/add，如果是在 nodejs 环境下，由于模块必须带扩展名，它显然是有问题的。




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

在 monorepo 越来越流行的今天，一个 app package 引用另一个在 workspace 中的 library package 的场景是非常常见的。如果直接使用 library package 对外发布时的 exports 规则（例如都指向 dist 文件夹的文件），就不方便通过修改 library src 下的源码来利用热更新。


```txt
├── apps
│   └── app1
│       ├── package.json
│       ├── src
│       │   └── main.ts
│       └── vite.config.ts
└── packages
    └── library1
        ├── dist
        │   └── index.mjs // 发布时的代码
        ├── package.json
        └── src
            └── index.ts // 希望修改代码热更新能生效
```

为了实现 vite 开发环境下 library package 能热更新，我们一般会这样组织它的 exports：
```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": {
        // 开发环境使用 src 下的源码，因此我们修改源码也能热更新
        "development": "./src",
        // 生产环境下，也就是在 app 运行 vite build 时使用打包编译的 dist
        "default": "./dist/es/index.mjs"
      }
    }
  },
  "publishConfig": {
    // 发布出去时我们不需要保留 development 这个 condition
    // 如果保留，会导致使用这个库的用户也走 src
    "exports": {
      ".": {
        "import": "./dist/es/index.mjs"
      }
    }
  }
}
```

在上面的例子中，首先我们使用了 `development` 条件，这个条件 vite 是默认支持的。然后你会发现我们是在 `import` 条件中使用的 `development` 条件，也就是说 `exports` 是支持内嵌条件的。
值得注意的是我们使用了 `publishConfig` 配置来在 `npm publish` 时覆盖我们的 `exports` 配置。
并不是所有的字段都支持在 `publicConfig` 覆盖，例如 npm 不支持覆盖 `typesVersion`，但是我平时使用的 pnpm 是支持的。

**types 条件**

前面我们提到过可以使用 typesVersions 字段处理子路径模块的 typescript 类型，但是 typesVersions 正如它的名字所表达的是用来表示不同的版本下使用不同的类型。聪明的你应该很容易想到要是能统一用 exports 来管理类型就好了，types条件就是用来描述 typescript 类型的解析规则。

看一个实际的例子：
```json
{
  "name": "unplugin-auto-import",
  "version": "0.15.2",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.cjs",
      "import": "./dist/index.js"
    },
    "./*": "./*",
    "./nuxt": {
      "types": "./dist/nuxt.d.ts",
      "require": "./dist/nuxt.cjs",
      "import": "./dist/nuxt.js"
    },
    "./astro": {
      "types": "./dist/astro.d.ts",
      "require": "./dist/astro.cjs",
      "import": "./dist/astro.js"
    },
    "./rollup": {
      "types": "./dist/rollup.d.ts",
      "require": "./dist/rollup.cjs",
      "import": "./dist/rollup.js"
    },
    "./types": {
      "types": "./dist/types.d.ts",
      "require": "./dist/types.cjs",
      "import": "./dist/types.js"
    },
    "./vite": {
      "types": "./dist/vite.d.ts",
      "require": "./dist/vite.cjs",
      "import": "./dist/vite.js"
    },
    "./webpack": {
      "types": "./dist/webpack.d.ts",
      "require": "./dist/webpack.cjs",
      "import": "./dist/webpack.js"
    },
    "./esbuild": {
      "types": "./dist/esbuild.d.ts",
      "require": "./dist/esbuild.cjs",
      "import": "./dist/esbuild.js"
    }
  },
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "typesVersions": {
    "*": {
      "*": ["./dist/*"]
    }
  }
}
```

注意点：

- types 条件应该放到其它条件也就是 require 和 import 前面
- 这里声明 main, module,typesVersions 是为了兼容性，在理想情况下，一个 exports 对象能解决所有问题，它们都可以不写。

**通用类型配置方法**

typescript 在所有模块解析策略下查找类型时都支持`相邻同名文件`的`扩展名匹配`，例如：
```txt
├── dist
│   ├── add.js
│   └── add.d.ts
```

也就是说在其它配置不使用的情况下（例如不使用 exports、不设置 typings）：
- 如果你是使用 node 策略，对于 ./dist/index.js，只要存在相邻的 ./index/index.d.ts 即可。
- 如果你使用的 `node16` | `nodenext` 策略，对于 `./dist/index.mjs` 需要存在 `./dist/index.d.mts`；对于 `./dist/index.cjs`，需要存在 `./dist/index.cts`。


**优先级**

**自定义 condition**

显然，nodejs 不可能内置支持所有条件，例如社区广泛使用的下列条件
- "types"
- "deno"
- "browser"
- "react-native"
- "development"
- "production"

如果你想让 nodejs 能够处理 xxx 条件，你可以在运行 node 指定 conditions 参数：
```json
{
  "name": "xxx",
  "exports": {
    ".": {
      "xxx": "./dist/hello.js",
      "require": null,
      "default": null
    }
  }
}
```
```sh
node --conditions=xxx apps/commonjs-app/index.js
```

注意这里条件 `xxx` 我放到了 `执行文件` 前面了，因为 commonjs 下 require 条件也能匹配，所以为了 xxx 能优先匹配，需要将它放到 `执行文件` 前面。


可以看到它同时配置了 typesVersion 和 exports，那 tsc 以哪个为标准呢？

首先这和 `tsconfig` 的 `moduleResolution` 有关，如果是 node，那它根本不认识 exports 字段，所以使用的是 typesVersions。也因为这个原因，unplugin-auto-import 为了兼容用户使用的moduleResolution 是 node 的情况，还是配置了 typesVersions。

在使用 node16 之后新增的模块解析策略时，tsc 会优先取 exports 配置的类型解析规则，忽略 typesVersions。不过如果你不使用 exports 配置 ts 类型，tsc 还是支持typesVersions 的。需要注意的是这个时候 typesVersions 需要写扩展名：

```json
{
  "name": "math",
  "exports": {
    "./*": {
      "types": "./src/*.ts"
    }
  },
  // moduleResolution: node16 情况下，没写 exports, typesVersions 还是有用的
  "typesVersions": {
    "*": {
      "*": [
        // 如果是 moduleResolution: node，不用写扩展名 .ts
        "./src/*.ts"
      ]
    }
  }
}
```


### typesVersions

发布 npm 包的类型声明文件目前主要有两种形式：

- 发布 types 包到 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)，目前有 8000+ 包采用这个方式
- 发布 npm 包携带 `声明文件`

当我们发布一个 npm 包并且想要把类型声明文件一起发布的时候，一般情况下我们使用 typings 字段指向我们入口类型文件即可，例如 moment：
```json
{
  "name": "moment",
  "version": "2.29.4",
  "main": "./moment.js",
  "typings": "./moment.d.ts"
}
```

**子路径导出类型声明**

如果你选择使用 types 包发布类型声明，那问题倒简单，你只需要像 [@types/lodash](https://npmview.vercel.app/@types/lodash) 那样将类型声明文件按照导入的路径一样组织目录即可
```txt
├── add.d.ts
├── fp
│   └── add.d.ts
└── package.json

```

具体来说你导入语句是

```js
import add from 'lodash/add';
```

就需要存在 node_modules/@types/lodash/add.d.ts 这样的文件。如果你是像 node_modules/@types/lodash/types/add.d.ts 这样组织，把声明文件放到 `types` 目录下，tsc 肯定是找不到的。

但如果你是选择类型声明和源码一起捆绑发布，还采用这种方式，把源码和类型声明混在一起，维护起来便会相当难受。

```txt
├── add.d.ts
├── add.js
├── fp
│   ├── minus.d.ts
│   ├── minus.js
└── package.json
```

可以看到它的 .d.ts 没有平铺到 package.json 同级，那么现在问题就是怎样把类型声明从 unplugin-auto-import/vite 重定向到 unplugin-auto-import/dist/vite.d.ts 了。这就用到了 typesVersions 字段：

我们来看看 [unplugin-auto-import](https://npmview.vercel.app/unplugin-auto-import) 是怎样做的，首先它的目录结构是这样：
```txt
├── auto-imports.d.ts
├── dist
│   ├── astro.d.ts
│   ├── esbuild.d.ts
│   ├── index.d.ts
│   ├── nuxt.d.ts
│   ├── rollup.d.ts
│   ├── types.d.ts
│   ├── vite.d.ts
│   ├── webpack.d.ts
└── package.json
```

可以看到它的 .d.ts 没有平铺到 package.json 同级，那么现在问题就是怎样把类型声明从 `unplugin-auto-import/vite` 重定向到 `unplugin-auto-import/dist/vite.d.ts` 了。这就用到了 typesVersions 字段：

```json
{
  "name": "unplugin-auto-import",
  "version": "0.15.2",
  "types": "dist/index.d.ts",
  "typesVersions": {
    "*": {
      "*": ["./dist/*"]
    }
  }
}
```
- 外层的 * 表示 `typescript版本范围` 是 `任意版本`
- 内层的 * 表示 `任意子路径`，例如 unplugin-auto-import/vite 就对应 vite

整体表示在 `任意版本` 的 `typescript` 下，查找 unplugin-auto-import 的类型时，将查找路径重定向到 `dist` 目录。更详细的解释可以看官方文档：[Version selection withtypesVersions](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions)。

注意我们这里 ./dist/* 没有写扩展名，如果 tsconfig.json 设置的 moduleResolution 是 `node16` | `nodenext`，那就要改成 `./dist/*.d.ts`

其实 `typesVersions` 设计目的并不是用来处理子路径导出的，这一点从它的名字就可以看出来，它是用来解决同一个包在不同版本的 typescript 下使用不同的类型声明，例如我们看 @types/node：
```json
{
  "name": "@types/node",
  "version": "18.15.11",
  "typesVersions": {
    "<=4.8": {
      "*": ["ts4.8/*"]
    }
  }
}
```

也就是说当你使用的 typescript 版本不大于 4.8，tsc 就会使用 @types/node/ts4.8 文件夹内的类型说明，否则就用 @types/node 包根目录的类型声明：
```txt
├── fs
│   └── promises.d.ts
├── fs.d.ts
├── package.json
├── ts4.8
│   ├── fs
│   │   └── promises.d.ts
│   ├── fs.d.ts
│   └── zlib.d.ts
└── zlib.d.ts
```

对于下面的导入语句：
```ts
import fs from 'node:fs/promises';
```

当 ts 版本为 4.7，会找到 @types/node/ts4.8/fs/promises

当 ts 版本为 5.0，会找到 @types/node/fs/promises

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