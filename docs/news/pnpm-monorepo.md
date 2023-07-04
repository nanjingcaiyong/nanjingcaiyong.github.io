现在越来越多的项目使用 `monorepo`，最近在开发组件库的时候，正好用到了，这里记录一下。

## 介绍
现在像组件库、mvvm框架、脚手架等许多优秀开源的作品都在使用 monorepo 来管理代码。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8a06b47e7b545698644cc07e19d0ad3~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/198962c087a34d8abd079514a76b27e4~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b0fd265900f438b9c94ea599fde5384~tplv-k3u1fbpfcp-watermark.image?)

以组件库分举例，组件库一般为几个部分，`文档`、`组件`、`图标`、`指令`、`主题`等，某些部分可能是相互依赖的；并且我们既要每部分都独立发布，又要考虑本地调试、开发，思考一下如何设计项目结构？

按照传统模式，我们可能把每个部分都作为独立仓库 和 npm包来管理，然后通过 link 软链的方式来调试，很显然这样在开发和代码仓库协同上肯定有弊端，而 `monorepo` 正式解决这种问题的，将相关项目放在一个仓库中

`monorepo` 是 一种项目代码管理方式，指单个仓库中管理多个项目，有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。

可以简单理解在 根目录下`packages` 里面维护了多个项目。

下面我们用 pnpm + typescript 演练一下。需要大家有一定的知识储备：
- 基本的 pnpm 操作
- typescript 声明文件
- package.json 中文件导出配置 

## 初始化项目

```sh
# 创建文件夹
mkdir mono && cd mono
# 创建子包文件夹
mkdir packages
# 初始化pnpm
pnpm init
# 创建工作区
touch pnpm-workspace.yaml
```

`pnpm-workspace.yaml` 定义了 [工作空间](https://pnpm.io/zh/workspaces) 的根目录，并能够使您从工作空间中包含 / 排除目录 。 默认情况下，包含所有子目录。


```yaml
packages:
  - 'packages/*'
```

### 创建子包

我们先创建第一个子包，名为 `package1`
```sh
mkdir packages/package1 && cd packages/package1 && pnpm init && cd ../../
```

在 package1 文件夹下我们需要创建以下类型文件：

- x.mjs 采用 esm 进行模块管理
- x.cjs 采用 commonjs 进行模块管理
- x.d.ts 模块的声明文件

因为要针对开发者使用不同的模块引用方式（`import` 和 `require`），所以要区分.mjs 和 .cjs。具体创建以下6个文件：

```js
// index.mjs
export const add = (a, b) => {
  return a + b
}
export const minus = (a, b) => {
  return a - b
}
```

```js
// global.mjs
const add = (a, b) => {
  return a + b
}
const minus = (a, b) => {
  return a - b
}
export default {
  add,
  minus
}
```

```js
// index.cjs
exports.add = (a, b) => {
  return a + b
}

exports.minus = (a, b) => {
  return a - b
}
```

```js
// global.cjs
const add = (a, b) => {
  return a + b
}
const minus = (a, b) => {
  return a - b
}
module.exports = {
  add,
  minus
}
```

```ts
// types/index.d.ts
declare module 'package1' {
  export function add (a: number, b: number): number;
  export function minus (a: number, b: number): number;
}
```

```ts
// types/global.d.ts
declare module 'package1/global' {
  export function add (a: number, b: number): number;
  export function minus (a: number, b: number): number;
}
```

```json
{
  "name": "package1",
  "version": "0.0.1",
  "description": "",
  "main": "index.mjs",
  "module": "index.cjs",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs",
      "types": "./types/index.d.ts"
    },
    "./global": {
      "import": "./global.mjs",
      "require": "./global.cjs",
      "types": "./types/global.d.ts"
    }
  },
  "typesVersions": {
    "*": {
      ".": ["types/index.d.ts"],
      "global": ["types/global.d.ts"]
    }
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

最终包文件夹结构如下：
```txt
├── packages
    ├── package1
        ├── types
            ├── index.d.ts
            ├── global.d.ts
        ├── index.mjs
        ├── index.cjs
        ├── global.mjs
        ├── global.cjs
        ├── package.json
        
```

接下来我们再创建一个子包，名为 `package2`，并且该包依赖 `package1`
```sh
mkdir packages/package2 && cd packages/package2 && pnpm init && cd ../../
```

```js
// index.mjs
import { add, minus } from 'package1';

export const calc = (a, b) => {
  return minus(add(a, b), 1)
}
```

```js
// global.mjs
import pk1 from 'package1/global';

export default {
  calc (a, b) {
    return pk1.minus(pk1.add(a, b), 1)
  }
}
```

```js
// index.cjs
const { add, minus } = require('package1');

exports.calc = (a, b) => {
  return minus(add(a, b), 1)
}
```

```js
// global.cjs
const pk1 = require('package1/global');

module.exports = {
  calc (a, b) {
    return pk1.minus(pk1.add(a, b), 1)
  }
}
```

```js
// index.d.ts
declare module "package2" {
  export function calc (a, number, b: number): number;
}
```

```js
// global.d.ts
declare module "package2/global" {
  export function calc (a, number, b: number): number;
}
```

```json

```json
{
  "name": "package2",
  "version": "0.0.1",
  "description": "",
  "main": "index.mjs",
  "module": "index.cjs",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs",
      "types": "./index.d.ts"
    },
    "./global": {
      "import": "./global.mjs",
      "require": "./global.cjs",
      "types": "./global.d.ts"
    }
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

子包 `package2` 文件创建完成，下面需要安装对 `package1` 的依赖
```sh
# 在 子包 package2 中 安装 package1
pnpm install package1 --filter package2
```

--filter 指定在哪个子包中安装。可选，如果不指定则在所有子包中进行安装

最终 package.json 和 项目结构如下：

```json
{
  "name": "package2",
  "version": "0.0.1",
  "description": "",
  "main": "index.mjs",
  "module": "index.cjs",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs",
      "types": "./index.d.ts"
    },
    "./global": {
      "import": "./global.mjs",
      "require": "./global.cjs",
      "types": "./global.d.ts"
    }
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "package1": "workspace:^"
  }
}
```

项目结构如下：
```txt
├── packages
    ├── package2
        ├── index.mjs
        ├── index.cjs
        ├── index.d.ts
        ├── global.mjs
        ├── global.cjs
        ├── global.d.ts
        ├── package.json
```

在项目根目录创建入口文件
```js
// index.mjs
import { calc } from 'package2'
import pk2 from 'package2/global'

console.log(calc(1,2), pk2.calc(3,1))
```

```js
// index.cjs
const pk2 = require('package2/global')
console.log(pk2.calc(1,2))
```

```sh
pnpm install ./packages/package2 -w
```


```sh
node index.mjs
# 2 3

node index.cjs
# 2
```
