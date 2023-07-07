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

导出配置，详细介绍见[package.json 之 exports]('/news/package-json-exports')

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