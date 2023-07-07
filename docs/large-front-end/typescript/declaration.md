
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

### 编译
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

### 类型校验
- strictBindCallApply
  默认值为 `true`
  ```ts
  function sum (num1: number, num2: number) {
    return num1 + num2
  }

  sum.apply(null, [1, 2, 3]); // 
  /* 报错：
    类型“[number, number, number]”的参数不能赋给类型“[num1: number, num2: number]”的参数。
      源具有 3 个元素，但目标仅允许 2 个 
  */

  sum.call(null, 1, 2, 3);
  /* 报错：
    应有 3 个参数，但获得 4 个 
  */

  sum.bind(null, 1, 2, 3)
  /* 报错：
    应有 3 个参数，但获得 4 个 
  */

  ```

  禁用对bind、call、apply入参数量校验（"strictBindCallApply": false）；或者将入参改为`rest`方式
  ```ts
  function sum (...args: number[]) {
    return args.reduce<number>((total, num) => total + num, 0)
  }
  sum.apply(null, [1, 2, 3])
  sum.apply(null, 1, 2, 3)
  sum.bind(null, 1, 2, 3)
  ```

- strictFunctionTypes
  协变：子类赋值给父类，逆变：父类赋值给子类。TS是允许双变的，默认为（true，不允许函数入参协变）

  一般要求入参`逆变`，出参`协变`
  ```ts
  interface Animal {
    age: number
    eat: () => void
  }

  interface Dog {
    age: number
    eat: () => void
    bark: () => void
  }

  let visitAnimal = (animal: Animal): Dog => {
    return {
      age: animal.age,
      eat: animal.eat,
      bark: () => console.log('汪汪')
    }
  }

  let visitDog = (dog: Dog): Animal => {
    return {
      age: dog.age,
      eat: dog.eat
    }
  }

  visitDog = visitAnimal; // 兼容
  visitAnimal = visitDog; // 不兼容
  ```

  为什么 visitAnimal 可以赋值给 visitDog，反之则会报错？改写一下上面的函数：
  ```ts
  // before
  visitDog = visitAnimal

  // after
  visitDog = (dog: Dog): Animal => {
    // 入参 dog 满足 visitAnimal 入参需要的 Animal 类型
    // 并且 visitAnimal 返回值 dog 包含更多的信息，也符合 visitDog 返回值要求的 Animal 类型
    const dog = visitAnimal(dog);
    return dog.age;
  }
  ```
  可以理解为在之前调用 `visitDog` 的时候传入的是 `Dog类型` ({age: 8, eat:() => console.log('吃'), bark: () => console.log('旺旺')})。现在 把 `visitAnimal` 赋值给 `visitDog`，入参类型由 `Dog` 变成了 `Animal`，而之前传的参数值不变({age: 8, eat: () => console.log('吃'), bark: () => console.log('旺旺')}), 再次调用的时候是可以赋值给 Animal 类型的；
  
  而回参在被使用的时候如 `const dog = visitDog();console.log(dog.age);dog.eat()`，回参类型由 `Animal` 变成了 `Dog`，因为 `Dog` 类型具备 `Animal` 类型的所有字段，所以外层调用仍然是安全的。

  反之则不行，我们可以按照上面的方法来改写：
  ```ts
  // before
  visitAnimal = visitDog

  // after 
  visitAnimal = (animal: Animal): Dog => {
    // 入参 animal 不满足 visitDog 入参要求的 Dog 类型
    // 并且 visitDog 返回值 animal 不符合 visitDog 返回值要求的 Dog 类型。如果调用 animal.bark() 会导致程序抛错
    const animal = visitDog(animal); 
    return animal;
  }
  ```


### 

- moduleResolution 模块解析策略
  
  描述的是一个模块包括 `相对路径`以及 `非相对路径`（也就是第三方库，亦或者说 npm 包）是按照怎样的规则去查找的。

  我们最熟悉的模块解析策略其实是 `nodejs` 的模块解析策略。最早只支持两个值：`classic` 和 `node`。node 策略在 typescript 中又称之为 `node10` 的解析策略。

  我们引入模块，设置不同的模块解析（moduleResolution）策略，来分析路径解析的逻辑
  
  `moduleResolution: classic` 是最容易想到的模块解析策略

  ```js
  // 文件：/root/src/test/index.js
  import Utils from 'utils'
  ```

  会经历下面的步骤来查找 `utils`：
  - /root/src/test/utils.js
  - /root/src/utils.js
  - /root/utils.js
  - /utils.js
  
  `moduleResolution: classic` 这个模块解析策略其实就是 nodejs 解析模块的策略，其实也就是 require.resolve 实现
   ```js
    // 文件：/root/src/index.js
    const Utils = require('utils')
    ```

  会经历下面的步骤来查找 `utils`：
  - /root/src/node_modules/utils.js
  - /root/src/node_modules/utils/package.json (如果指定了"main"属性，去找main指定的入口文件)
  - /root/src/node_modules/utils/index.js
  往父级目录查找
  - /root/node_modules/utils.js
  - /root/node_modules/utils/package.json (如果指定了"main"属性，去找main指定的入口文件)
  - /root/node_modules/utils/index.js
  继续往父级目录查找
  - /node_modules/utils.js
  - /node_modules/utils/package.json (如果指定了"main"属性，去找main指定的入口文件)
  - /node_modules/utils/index.js
  到这还是找不到就会报错

  需要注意，classic 和 node 这两个从 ts 诞生支持就存在，但它们不支持通过 package.json 的 exports 导出声明文件，后来新增的 node16, nodenext, bundler 都支持。


  **bundler**

  `bundler` 是 TypeScript5.0 新增的一个模块解析策略，它是一个对现实妥协的产物，社区倒逼标准。为啥么这么说呢？因为最理想最标准的模块解析策略其实是 node16 / nodenext：严格遵循 ESM 标准并且支持 exports。

  现实情况：拿 vite 来举个例子，vite 宣称是一个基于 ESM 的前端开发工具，但是声明相对路径模块的时候却不要求写扩展名。
  问题就出在现有的几个模块解析策略都不能完美适配 vite + ts + esm 开发场景：

  node：不支持 exports
  node16 / nodenext: 强制要求使用相对路径模块时必须写扩展名

  这就导致 node16 / nodenext 这俩策略几乎没人用，用的最多的还是 node。
  于是乎，ts5.0 新增了个新的模块解析策略：bundler。它的出现解决的最大痛点就是：可以让你使用 exports 声明类型的同时，使用相对路径模块可以不写扩展名。

  **nodenext**

  这个模块策略比 bundler 出的早，但是我放到最后说，因为它最复杂也不推荐使用。

  目前前端界大部分库都不能正常的在 moduleResolution: nodenext 下使用，例如 [@vitejs/plugin-vue2](https://npmview.vercel.app/@vitejs/plugin-vue2)：
  ```json
  {
    "name": "@vitejs/plugin-vue2",
    "version": "2.2.0",
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs"
      }
    }
  }
  ```
  ```ts
  // vite.config.mts
  import vitePluginVue2 from '@vitejs/plugin-vue2';

  vitePluginVue2();

  // This expression is not callable.
  // Type 'typeof import("/xxx/node_modules/.pnpm/@vitejs+plugin-vue2@2.2.0_vite@4.2.1_vue@2.7.14/node_modules/@vitejs/plugin-vue2/dist/index")' has no call signatures
  ```

  详细的解释你可以看 ts 团队在 github 上的一个回复：[ts error when moduleResolution is "node16"](https://github.com/vitejs/vite-plugin-react/issues/104#issuecomment-1485806985)
  我说下我自己的理解：nodenext 模块解析策略严格按照最新的 nodejs 模块解析算法判断一个 ts 文件是 commonjs 模块还是 esm 模块。也就是瞒住下面两个条件一个 js 模块会被 nodejs 视为 esm 模块：

  最近的 package.json 设置了 "type": "module"
  扩展名是 .mjs

  上面的例子中，vite.config.mts 是一个 esm 模块，因此 @vitejs/plugin-vue2 会匹配到 import 条件，最终解析到 /xxx/node_modules/@vitejs/plugin-vue2/dist/index.d.ts。
  但是这个文件会被识别为一个 commonjs 的 ts 模块，因为离它最近 /xxx/@vitejs/plugin-vue2/package.json 中没有声明 "type": "module"，它的扩展名也不是 .d.mts，所以它是一个 commonjs 的 ts 模块。从实际的报错信息来看，在 moduleResolution 是 node16 / nodenext 情况下，ts 是不支持对一个 commonjs 的 ts 模块使用默认导出，即便是 index.d.ts 中存在 export default 也没有用。
  
  实测如果你是使用命名导出是没问题的，例如：

  ```ts
  import { parseVueRequest } from '@vitejs/plugin-vue2';
  parseVueRequest('');
  ```

  如果你想正确配置，需要改成这样：
  ```json
  {
    "exports": {
      ".": {
        "import": {
          "types": "./dist/index.d.mts",
          "default": "./dist/index.mjs"
        },
        "require": {
          "types": "./dist/index.d.cts",
          "default": "./dist/index.cjs"
        }
      }
    }
  }
  ```

  所以为啥没人愿意用 `node16` | `nodenext`：

  - 相对路径需要要扩展名
  - 写类型要写两套
  
  尽管它是理论上最符合最新的 nodejs 模块解析规则的。

### tsconfig.json 配置文件

```json
{
    "compilerOptions": {

      /* Language and Environment */
      "target": "ES5",                           // 指定编译后生成的的JS版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'
      "lib": ["DOM", "ES2016", "ES2017.Object"], // 和 target 一起使用。ts不会在编译的时候注入polyfull，需要手动配置 target 所需的 polyfill
      
      /* Modules */
      "module": "ES6",                           // "None", "CommonJS", "AMD", "System", "UMD", "ES6", "ES2015", "ESNext"
      "rootDir": "",
      "baseUrl": ".",                            // 全局相对模块引入的基础路径
      "paths": [],                               //
      "moduleResolution": "node10",              // 模块解析策略。"Bundler", "Classic", "classic", "Node", "Node16", "NodeNext"
      
      /* Emit */
      "noEmit": false,                          // 是否输出声明文件。true: 不生成声明文件，false: 生成声明文件
      "declarationDir": "./dist/types",         // 输出的声明文件目录
      "outDir": "dist",                          // 默认情况下，ts编译后的js文件，与源文件都在同一个目录下。使用outDir选项可以指定编译后的文件所在的目录。清理之前编译生成的js文件。

      /* 类型检查 */
      "strict": true,
      "noImplicitAny": true,                   // 是否必须显式声明 `any`。true: 是(默认), false: 否
      "experimentalDecorators": true,          // 是否启用装饰器
    },
    "files": [],                              // 指定需要被编译的文件列表。这里不能指定目录，只能是文件，可以省略.ts 后缀。适合需要编译的文件比较少的情况。默认值为 false；
    "include": [],                            // 指定需要编译的文件列表或匹配模式(glob)。include 可以通过通配符指定目录，如"src/**/*" 表示 src 下的所有文件。如果没有指定 files 配置，默认值为 ** ，即项目下所有文件；如果配置了 files，默认值为 [] 空数组；
    "exclude": [],                            // 在 include 圈定的范围内，排除掉一些文件。我们经常用它来排除编译输出目录、测试文件目录、一些生成文件的脚本等文件。默认值为 "node_modules,bower_componen"；
    "extends": "./tsconfig.base.json",       // 继承另一个 ts 配置文件。这在 monorepo 的代码组织中非常有用，不同的 package 可以通过 extends 继承通用的 ts 配置。用法示例："extends": "./common-tsconfig.json"。
    "reference": []                         // 引用。项目中如果有多个相互独立的模块，可以使用这个属性来做分离。这样一个模块改变后，就只重新编译这个模块，其他模块不重新编译。编译时要改用tsc --build。这在非常大的项目中应该能有不小收益。
}
```