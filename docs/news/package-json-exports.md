# package.json 之 exports 

在 `node@12.7.0` 后提供了对于入口文件的替代品字段（exports），它的优先级是 `高于` 任何入口字段的（module、main、browser）

当打包工具支持exports字段时（webpack、Rollup 等），以上main，browser，module，types四个字段都被忽略。

## 主入口导出

类似 `main` 和`module` 字段，我们可以使用下面的写法来配置一个模块没有写子路径时怎样导出的，也叫主入口：

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

## 子路径导出

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


### 导出多个子路径
例如我们重构 `lodash`，把所有的子路径模块，也就是 `package.json` 同级的的那一堆 js 模块放到 lib 文件夹。一种选择就是声明所有子路径：

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

但是由于 lodash 的模块非常多，这样处理会导致 `package.json` 非常臃肿。

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
- `exports` 可以写通配符 * 的路径例如 `./*` 在英文术语里叫 pattern，也就是模式
- `exports` 的 value ./lib/*.js 的英文术语叫 target pattern，也就是目标模式

注意我们这里的 `*` 用的不是 glob 语法，在 glob 语法里面 `*` 表示任意的一层目录，但是在 exports pattern 中可以表示无限层任意路径。

要读懂这个映射规则，我们可以这样理解：

- 给定一个模块 id `lodash/add`
- 使用模块名 `lodash` 替换左侧的 pattern `./*` 中的 `.` ，得到 `lodash/*`
- 把 pattern `lodash/*` 和模块 id `lodash/add` 做模式匹配，得到 `*` 的值就是 `add`
- 将 target pattern `./lib/*.js` 中的 `*` 替换第三步得到的 `*` 的值得到 `./lib/add.js`，也就是相对于 `lodash` package 的相对路径
- 把相对路径中的 `.` 替换为 `lodash` package 的绝对路径就能得到模块 id `lodash/add` 的绝对路径：/xxx/node_modules/lodash/lib/add.js

### 禁止模块导出

你可以用通过将一个模块的 target pattern 设置为 null 来禁止某个子路径被另一个模块导入：
```json
{
  "name": "xxx",
  "exports": {
    "./forbidden": null
  }
}
```
```js
import 'xxx/forbidden';
// 报错：Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './hello' is not defined by "exports"
```

### 扩展名和文件夹模块问题

需要注意的是 nodejs 在通过 exports 解析模块时是不会做自动添加扩展名的操作，例如你写成下面这样是有问题的：
```json
{
  "name": "lodash",
  "exports": {
    "./*": "./lib/*"
  }
}
```

使用上面的配置， `lodash/add` 会被解析到 `xxx/node_modules/lodash/lib/add`，如果是在 nodejs 环境下，由于模块必须带扩展名，它显然是有问题的。

### 优先级

如果 `exports` 映射左侧的多个 pattern 都能匹配当前导入模块，最终会选择哪个呢?

当 package.json 为：
```json
{
  "name": "xxx",
  "export": {
    "./*": "./*",
    "./a/*": "./a/*.js",
    "./a/b": "./a/b.js",
    "./*.js": "./*.js"
  }
}
```
例如模块 id 是：`xxx/a/b`，其实最终会使用最具体的 `./a/b`

短路匹配：从前到后匹配，当一个 key pattern 匹配成功，不管 target pattern 对应的文件能否找到都结束匹配

`./*`, `./a/*`, `./a/b` 都能匹配这个模块 id，显然短路匹配时是不合理的，因为如果采用短路匹配，那么就是采用 `./*` 这个规则了，我们就没办法去设置一个更具体的规则，也就是说 `./a/b` 这个规则就没用了。

再看另一个例子：
```json
{
  "name": "xxx",
  "exports": {
    "./*": null,
    "./a/*/c": null,
    "./a/b/*": "./dist/hello.js"
  }
}
```

当模块 id 是 `xxx/a/b/c`，nodejs 会采用 `./a/b/*`。尴尬的是：目前主流的几个 node 模块解析库都不能正确解析这个例子，只有 webpack 用的 enhanced-resolve 是可以解析的，下面三全跪：

- `vite` 内置插件 `vite:resolve` 使用的 `resolve.exports`：[resolve priority incorrectly](https://github.com/lukeed/resolve.exports/issues/29)
- `rollup` 官方插件 `@rollup/plugin-node-resolve`：[[node-resolve] * in exports key can't correctly resolved](https://github.com/rollup/plugins/issues/1476)
- rspack 使用的 nodejs-resolver: [can't deal with priority correctly](https://github.com/web-infra-dev/nodejs_resolver/issues/177)

虽然 `enhanced-resolve` 可以处理上面给出的用例，但是它却处理不了下面这个例子：
```json
// issue: https://github.com/webpack/enhanced-resolve/issues/376
{
  "name": "xxx",
  "exports": {
    "./*/c": "./dist/hello.js"
  }
}
```
```js
import 'xxx/a/b/c';
```


对于这个例子 `enhanced-resolve` 的结果是 `undefined`, 但是 nodejs 是可以正确解析到 `./dist/hello.js` 这个 target。可见 nodejs 的模块解析策略之复杂远超常人想象，以至于主流的解析库在处理一些特殊情况都或多或少有些 bug，尤其是在处理优先级的时候。

那么所谓的更具体到底是怎样的算法呢？参考 enhanced-resolve 的源码 ，我们可以这样做：

- 首先遍历所有 pattern，筛选出和模块 id 可以匹配的 pattern。在我们之前的例子就是 `./*`, `./a/*/c`, `./a/b/*`
- 根据所有匹配的 pattern 构造一颗树，每一个节点对应 pattern.split('/') 的一个元素
- 采用层级遍历顺序，优先取当前层非通配符的节点。这个例子中就在第二层把 `./*` pass 掉了，在第三层把 `./a/*/c `pass
- 最终遍历到叶子节点的这条路径表示的 pattern 就是最特殊的 pattern，也就是 `./a/b/*`


## 条件导出

为了能够在不同条件下使用不同的模块解析规则，你可以使用条件导出。
```json
{
  "exports": {
    ".": {
      // node-addons, node, import 这些 key 表示条件
      "node-addons": "./c-plus-native.node",
      "node": "./can-be-esm-or-cjs.js",
      "import": "./index-module.mjs",
      "require": "./index-require.cjs",
      "default": "./fallback-to-this-pattern.js"
    }
  }
}
```

上面这个例子演示的是 nodejs 内置支持的条件，导入模块 xxx：

- 在 nodejs esm 情况下，会使用 "import": "./index-module.mjs"
- 在 commonjs 情况下，会使用 "require": "./index-require.cjs"
- 在各种情况不满足的情况下，会使用 "default": "./fallback-to-this-pattern.js"

语法糖简写版本：
```json
{
  "exports": {
    "node-addons": "./c-plus-native.node",
    "node": "./can-be-esm-or-cjs.js",
    "import": "./index-module.mjs",
    "require": "./index-require.cjs",
    "default": "./fallback-to-this-pattern.js"
  }
}
```

自然而然，子路径导出也是支持条件导出的：
```json
{
  "exports": {
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```

条件导出的各个条件的优先级取决于它声明的顺序，越前面的越高。

换句话说它是从前到后短路匹配的，因此，在 node 使用 `commonjs` 情况下导入下面这个模块会报错：

```json
{
  "name": "xxx",
  "exports": {
    ".": {
      "default": null,
      "require": "./dist/hello.js"
    }
  }
}
```
这就要求我们使用条件导出的时候注意按照优先级顺序去编写，将越特殊的条件放越前面。

### 自定义 condition

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


### 内联条件

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

### types 条件

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

### 通用类型配置方法

typescript 在所有模块解析策略下查找类型时都支持`相邻同名文件`的`扩展名匹配`，例如：
```txt
├── dist
│   ├── add.js
│   └── add.d.ts
```

也就是说在其它配置不使用的情况下（例如不使用 exports、不设置 typings）：
- 如果你是使用 node 策略，对于 ./dist/index.js，只要存在相邻的 ./index/index.d.ts 即可。
- 如果你使用的 `node16` | `nodenext` 策略，对于 `./dist/index.mjs` 需要存在 `./dist/index.d.mts`；对于 `./dist/index.cjs`，需要存在 `./dist/index.cts`。

### 优先级

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
