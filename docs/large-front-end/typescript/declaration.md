
# typescript 的声明文件

声明文件输出两种方式
- 1、库的代码是通过 `ts` 写的，那么在使用 `tsc` 命令将ts转换为js 时候，添加 `declaration` 选项，就可以同时也生成 `.d.ts` 声明文件了。
- 2、库代码通过 `js` 写的，那么这个时候就需求手动为库添加声明文件，比如我们为三方库单独添加声明文件


### 声明文件导出

**单个主文件**
```txt
├── dist
    ├── index.cjs
    ├── index.mjs
    ├── index.d.ts
```
package.json
```json
{
  "main": "index.mjs",
  "module": "index.cjs",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs"
    }
  }
}
```

**多个主文件导出**

声明文件和主文件`同层级`

```txt
├── dist
    ├── index.cjs
    ├── index.mjs
    ├── index.d.ts
    ├── global.cjs
    ├── global.mjs
    ├── global.d.ts
```

package.json
```json
{
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
  }
}
```

声明文件和主文件`不同层级`，需要使用 typesVersions 对声明文件路径映射，否则无法找到 `非根目录` 下的模块声明

```txt
├── dist
    ├── types
        ├── index.d.ts
        ├── global.d.ts
    ├── index.cjs
    ├── index.mjs
    ├── global.cjs
    ├── global.mjs
```

package.json
```json
{
  "main": "index.mjs",
  "module": "index.cjs",
  "types": "./types/index.d.ts",
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
  }
}
```

### 声明查找顺序
- 当前编译上下文找该变量的定义
- 变量所在模块的 `index.d.ts` 声明文件中查找（或其package.json 中 `types` 字段指向文件），通常由npm包的维护者提供
- node_modules/@types/npm包名 查找声明
- 通过配置文件 tsconfig.json 中的 paths 和 baseUrl 字段指向的其他目录


## 定义声明文件


## 声明文件

### 输出
- target
- lib

### 路径相关
- declarationDir 声明文件导出路径
- baseUrl        全局基础路径（引入模块的相对路径都是基于该配置）
  目录结构
  ```txt
  ├── app.ts
  ├── src
      ├── api
          ├── index.ts
  ```
  
  修改前
  ```js
  // app.ts
  import from './src/api/index'
  ```

  修改tsconfig.json
  ```json
  {
    "baseUrl": "src/"
  }
  ```

  修改后
  ```js
  // app.ts
  import from 'api/index'
  ```

- outDir         ts编译后的js文件的导出路径
- rootDir        设置编译（tsx）的根目录（只编译该目录下的文件）
  目录结构
  ```txt
  ├── src
  │   └── index.ts
  └── tsconfig.json
  ```
  执行 `tsc` 后，目录变成了
  ```txt
  ├── dist
  │   ├── src
  │       ├── index.js
  ├── src
  │   ├──index.ts
  └── tsconfig.json
  ```

  在 "outDir": "./dist" 配置情况下，src/index.ts 编译后输出位置为 dist/src/index.js。输出目录带上了的 src 这一层，显然不是那么合理。

  解决办法是指定 rootDir: "src"。这样，根目录变成了 src，编译后输出则没有了 src 这一层。

  执行 `tsc` 后，目录变成了
  ```txt
  ├── dist
  │    └── index.js
  ├── src
  │    └── index.ts
  └── tsconfig.json
  ```

  但是如果我们把 `rootDir` 设置为 `src`，如果存在src同级目录，会不会有问题？把目录结构改为：
  
  ```txt
  ├── src
  │    └── index.ts
  ├── apis
  │    └── index.ts
  └── tsconfig.json
  ```

  依旧执行 `tsc`，发现报错了
  ```txt
  error TS6059: File '/xxx/typescript-demo/apis/index.ts' is not under 'rootDir' '/xxx/typescript-demo/src'. 'rootDir' is expected to contain all source files.
  ```

  简而言之，就是rootDir应该包含所有ts源文件，这里是因为 `apis` 文件夹未被包含


- paths           路径映射（只有配置baseUrl才能生效）
  目录结构
  ```txt
  ├── app.ts
  └── packages
      ├── lib1
      │    └── a.ts
      └── lib2
           └── b.ts
  ```

  修改前
  ```js
  import LibA from 'packages/lib1/a'
  import LibB from 'packages/lib1/b'
  ```

  修改配置
  ```json
  {
    "baseUrl": "./",
    "paths": {
      "packages/*": ["packages/lib1/*", "packages/lib2/*"]
    }
  }
  ```

  修改后
  ```js
  import LibA from 'packages/a'
  import LibB from 'packages/b'
  ```

### tsconfig.json 配置文件

```json
{
    "compilerOptions": {
      "target": "ES5",                           // 指定编译后生成的的JS版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'
      "lib": ["DOM", "ES2016", "ES2017.Object"], // 和 target 一起使用。编译成target 所需的 polyfill
      "module": "ES6",                           // "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"，"ES2015"，"ESNext"
      "declarationDir": "./dist/types",          // 输出的声明文件目录
      "baseUrl": ".",                            // 全局相对模块引入的基础路径
      "outDir": "dist",                         // 默认情况下，ts编译后的js文件，与源文件都在同一个目录下。使用outDir选项可以指定编译后的文件所在的目录。清理之前编译生成的js文件。
      "rootDir": "",
      "noEmit": false,                          // 是否输出声明文件。true: 不生成声明文件，false: 生成声明文件

      "experimentalDecorators": true,           // 是否启用装饰器
    },
    "files": [],                        // 指定需要被编译的文件列表。这里不能指定目录，只能是文件，可以省略.ts 后缀。适合需要编译的文件比较少的情况。默认值为 false；
    "include": [],                      // 指定需要编译的文件列表或匹配模式(glob)。include 可以通过通配符指定目录，如"src/**/*" 表示 src 下的所有文件。如果没有指定 files 配置，默认值为 ** ，即项目下所有文件；如果配置了 files，默认值为 [] 空数组；
    "exclude": [],                      // 在 include 圈定的范围内，排除掉一些文件。我们经常用它来排除编译输出目录、测试文件目录、一些生成文件的脚本等文件。默认值为 "node_modules,bower_componen"；
    "extends": "./tsconfig.base.json",                      // 继承另一个 ts 配置文件。这在 monorepo 的代码组织中非常有用，不同的 package 可以通过 extends 继承通用的 ts 配置。用法示例："extends": "./common-tsconfig.json"。
    "reference": []                     // 引用。项目中如果有多个相互独立的模块，可以使用这个属性来做分离。这样一个模块改变后，就只重新编译这个模块，其他模块不重新编译。编译时要改用tsc --build。这在非常大的项目中应该能有不小收益。
}
```