
# typescript 的声明文件

声明文件输出两种方式
- 1、库的代码是通过 `ts` 写的，那么在使用 `tsc` 命令将ts转换为js 时候，添加 `declaration` 选项，就可以同时也生成 `.d.ts` 声明文件了。
- 2、库代码通过 `js` 写的，那么这个时候就需求手动为库添加声明文件，比如我们为三方库单独添加声明文件


## 声明文件导出

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


## cli

### tsc

`--build`: 此外，为了兼容已有的构建流程，tsc`不会自动地构建依赖项`，除非启用了--build选项。 下面让我们看看--build。

### tsx


# 声明文件

### 编译
- target
- lib

### 路径相关
- declarationDir 声明文件导出路径
- baseUrl        全局基础路径（引入模块的相对路径都是基于该配置、导出的路径等）
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
- rootDir        指定 TypeScript 项目的源代码文件夹的根目录。编译器会在这个文件夹下搜索源代码
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

### 编译文件
- include
- exclude
- files

# tsconfig.json

## compilerOptions
指定 typescript 的编译配置。

## projects

### incremental

是否开启增量编译。

使 TypeScript 将上次编译的工程图信息保存到磁盘上的文件中。这将会在您编译输出的同一文件夹中创建一系列 .tsbuildinfo 文件

### tsBuildInfoFile

指定路径来存放增量编译信息（tsconfig.tsbuildinfo）

### composite

被引用的工程必须启用`composite`设置。使得构建工具（`tsc` 在 `--build` 模式下）可以快速确定引用工程的输出文件位置。 若启用composite标记则会发生如下变动：
- 如果未指定`rootDir`，默认为包含`tsconfig.json`文件的目录
- 所有的实现文件必须匹配`include`模式或在`files`数组里列出。如果违反了这个限制，tsc会提示你哪些文件未指定。
- declaration选项默认为`true`

### disableSourceOfProjectReferenceRedirect

### disableSolutionSearching

### disableReferencedProjectLoad



## Language and Environment

### target

指定`编译后`生成的的`JS版本`: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'

### lib

为指定的 `target` 选项注入新的js特性的 `polyfill` 来满足编译要求，因为 `typescript` 是不会在编译的时候自动注入 `polyfill` 的。例如 `target` 设为 `ES5`，那么使用 `Symbol` 的类型定义是将报错，例如：

项目结构：

```txt
├── tsconfig.json
├── main.ts
└── package.json
```

tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

main.ts
```js
const KEY = Symbol('Hello world')
// “Symbol” 仅指类型，但在此处用作值。是否需要更改目标库? 请尝试将 “lib” 编译器选项更改为 es2015 或更高版本
```

下面我们在 `tsconfig.json` 文件中添加 `lib`字段
```json
  "compilerOptions": {
    "target": "ES5",
    "lib": ["ES2015.Symbol"],
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
```

或者将 `target` 改为 `ES6` 或者更新

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

你可能出于某些原因改变这些：
- 你的程序不运行在浏览器中，因此你不想要 "dom" 类型定义。
- 你的运行时平台提供了某些 JavaScript API 对象（也许通过 polyfill），但还不支持某个 ECMAScript 版本的完整语法。
- 你有一些 （但不是全部）对于更高级别的 ECMAScript 版本的 polyfill 或本地实现。

### jsx

控制 JSX 在 JavaScript 文件中的输出方式。 这只影响 .tsx 文件的 JS 文件输出。

```tsx
export const render = () => <div>hello world</div>
```

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "jsx": "preserve",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

**preserve**
不对 JSX 进行改变并生成 .jsx 文件

```jsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const render = () => <div>hello world</div>;
exports.render = render;

```

**react**

将 JSX 改为等价的对 React.createElement 的调用并生成 .js 文件。

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const render = () => React.createElement("div", null, "hello world");
exports.render = render;
```

**react-jsx**

改为 jsx 调用并生成 .js 文件

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const render = () => (0, jsx_runtime_1.jsx)("div", { children: "hello world" }, void 0);
exports.render = render;

```
**react-jsxdev**

改为 jsxDEV 调用并生成 .js 文件

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const jsx_dev_runtime_1 = require("react/jsx-dev-runtime");
const _jsxFileName = "/Users/caiyong/Desktop/mono/main.tsx";
const render = () => (0, jsx_dev_runtime_1.jsxDEV)("div", { children: "hello world" }, void 0, false, { fileName: _jsxFileName, lineNumber: 1, columnNumber: 28 }, this);
exports.render = render;

```
**react-native**

不对 JSX 进行改变并生成 .js 文件

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const render = () => <div>hello world</div>;
exports.render = render;
```

### experimentalDecorators 

是否启用装饰器

### emitDecoratorMetadata

启用对使用`reflect-metadata`模块的装饰器发射类型元数据的实验性支持

### jsxFactory

### jsxFragmentFactory

### jsxImportSource

### reactNamespace

已弃用。使用`jsxFactory`替代

### noLib

禁用自动包含任何库文件。如果设置了该选项，`lib`选项将被忽略。

当启用这个设置的时候`Array`, `Boolean`, `Function`, `IArguments`, `Number`, `Object`, `RegExp` and `String` 等类型都需要自己重新声明。除非你希望自己重新定义类型，否则不要做修改。

### useDefineForClassFields

启用后的作用是将 class 声明中的字段语义从 [[Set]] 变更到 [[Define]]

项目结构：

```txt
├── tsconfig.json
├── main.ts
└── package.json
```

tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

main.ts
```ts
class C {
  foo = 100;
  bar: string;
}
```

编译后生成的main.js
```js
"use strict";
class C {
  constructor() {
    this.foo = 100;
  }
}
```

将 `useDefineForClassFields` 选项设为 `true`

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "useDefineForClassFields": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

编译后生成的main.js

```js
"use strict";
class C {
  constructor() {
    Object.defineProperty(this, "foo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 100
    });
    Object.defineProperty(this, "bar", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
}
```

可以看到变化主要由如下两点：
- 字段声明的方式从 = 赋值的方式变更成了 Object.defineProperty
- 所有的字段声明都会生效，即使它没有指定默认值

默认 = 赋值的方式就是所谓的 [[Set]] 语义，因为 this.foo = 100 这个操作会隐式地调用上下文中 foo 的 setter。相应地 Object.defineProperty 的方式即所谓的 [[Define]] 语义。

## Modules

### module

设置编译后文件使用的模块系统

编译前的源文件
```ts
import { add } from './utils';
add(1, 2);
```

**CommonJS**
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
(0, utils_1.add)(1, 2);
```

**UMD**
```js
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const utils_1 = require("./utils");
    (0, utils_1.add)(1, 2);
});
```

**AMD**
```js
define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (0, utils_1.add)(1, 2);
});
```

**System**
```js
System.register(["./constants"], function (exports_1, context_1) {
    "use strict";
    var constants_1, twoPi;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }
        ],
        execute: function () {
            exports_1("twoPi", twoPi = constants_1.valueOfPi * 2);
        }
    };
});
```

**ES2015/ES2020/ES2022/ES6/ESNext**
```js
import { add } from './utils';
add(1, 2);
```

ES2022 进一步增加了顶层 `await` 的支持

*None*

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
(0, utils_1.add)(1, 2);
```

**Node16/NodeNext**

从`typescript` `4.7+` 开始支持 `Node16` 和 `NodeNext`

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
(0, utils_1.add)(1, 2);
```

### rootDir

`TypeScript` 项目的默认的根目录为 `tsconfig.json` 文件所在的目录，所有的相对路径都是相对于这个根目录的。

当 `TypeScript` 编译文件时，它会在输出目录中保留与输入目录中相同的目录结构。

注意，`rootDir` 不会影响哪些文件成为编译的一部分。tsconfig.json 中 `include` 、 `exclude` 与 `files` 这三个选项才会影响哪些文件成为编译的一部分，如果被包含的编译文件在 `rootDir` 指定的目录外， `ts` 将报错

### rootDirs

通过 rootDirs，你可以告诉编译器有许多 `虚拟` 的目录作为一个根目录。 这将会允许编译器在这些 `虚拟` 目录中解析相对应的模块导入，就像它们被合并到同一目录中一样。

### moduleResolution

指定模块解析策略。

如果未指定值，当 module 为 CommonJS时，为 node，当 module 为 UMD，AMD， System，ESNext，ES2015时，为 classic 。

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

### baseUrl

baseUrl 是指模块导入时的基础路径。

也就是说，设置了 baseUrl 后，所有模块导入路径都是相对于 baseUrl 的路径

这个选项一般用于解决模块路径的问题，比如缩短模块的导入路径或者解决模块之间的相互依赖。

### paths

路径设置。将模块导入重新映射到相对于 baseUrl 路径的配置。


告诉 TypeScript 文件解析器支持一些自定义的前缀来寻找代码。 这种模式可以避免在你的代码中出现过长的相对路径:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
        "@/*": ["src/*"],
        "@apis/*": ["src/apis/*"] 
    }
  }
}
```

需要注意，路径映射是相对于 `baseUrl` 选项来配置的

如果需要通过webpack编译，需要对应配置 `resolve.alias` 选项


### typeRoots

默认情况下，所有的 `node_modules/@types` 下的所有包。

如果指定 `typeRoots`，仅有 在 `typeRoots` 下的包才会被包含在编译过程中。例如：

```json
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```

这个配置文件将包含 `./typings` 和 `./vendor/types` 路径下的所有包，而不包括 ./node_modules/@types 下的。其中所有的路径都是相对于 tsconfig.json


### types

默认情况下，所有 `node_modules/@types` 下的包都将包含在你的编译过程中。 例如，这意味着包含 ./node_modules/@types/，../node_modules/@types/，../../node_modules/@types/ 中所有的包

当 types 被指定，则只有列出的包才会被包含在全局范围内。例如：

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

这个 tsconfig.json 文件将 只会 包含

`./node_modules/@types/node`，`./node_modules/@types/jest` 和 `./node_modules/@types/express`。 其他在 `node_modules/@types/*` 下的包将不会被包含。

此选项不会影响 `@types/*` 被包含在代码中，例如如果按上面的 `compilerOptions` 示例
```js
import * as moment from "moment";
moment().format("MMMM Do YYYY, h:mm:ss a");
```

当设置此选项时候，不在 `types` 数组中包含包含，它将：
- 不会在项目中添加全局声明
- 导出不会出现在自动导入的建议中

### allowUmdGlobalAccess

当 `allowUmdGlobalAccess` 设置为 `true` 时，将允许你在模块文件中以全局变量的形式访问 UMD 的导出。 模块文件是具有或同时导入、导出的文件。当未设置这个选项时，使用 UMD 模块的导出需要首先导入声明。

比如，在一个 Web 项目中， 知道特定的库（如 jQuery 或 Lodash ）在运行时总是可用的，但无法通过导入来使用他们。

### resolveJsonModule

`module` 选项不能为 `System`、`AMD`、`UMD`、`None`
允许导入带有.json扩展名的模块。import包括基于静态 `JSON` 形状生成的类型

### noResolve

默认情况下，typescript 将检查 import 的初始文件集，并将 `/// <reference/>` 和 这些已解析的文件添加到您的程序中。

如果将 `noResolve` 选项设为 `true`，上述过程将不会发生。不会把 `/// <reference>` 或 `模块导入`的文件加到编译文件列表

即使安装了`@types/node`，下面导入的 `path` 模块仍会报错
```js
import { resolve } from 'path'; // 找不到模块“path”或其相应的类型声明。ts(2307)
```

## JavaScript Support

### allowJs (默认 false)

该标志可用作将 TypeScript 文件增量添加到 JS 项目中的方法，允许.ts和.tsx文件与现有 JavaScript 文件一起存在。

可以用于逐步将 TypeScript 文件逐步添加到 JS 工程中。

它还可以一起使用[declaration]('https://www.typescriptlang.org/tsconfig#declaration')并为 JS 文件[emitDeclarationOnly](https://www.typescriptlang.org/tsconfig#emitDeclarationOnly)创建[声明]('https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html')。

### checkJs (默认 false)

与 `allowjs` 配合使用，当 `checkjs` 选项被启用时，javascript 文件中会报告错误。就相当于在项目中所有 `javascript` 文件顶部包含 `// @ts-check`


### maxNodeModuleJsDepth (默认 0)

搜索node_modules和加载 JavaScript 文件的最大依赖深度。

该标志只能在`allowJs` `启用`时使用.

## Emit

### declaration (默认 false)
为项目中每个 `Typescript` 或 `JavaScript` 文件生成`.d.ts`文

这些`.d.ts`文件是类型定义文件，描述模块的外部 API。

对于.d.ts文件，TypeScript 等工具可以为非类型化代码提供智能感知和准确类型。
### declarationMap

为映射回`.ts`源文件生成 `.d.ts.map`文件。这将允许 VSCode 等编辑器在使用`Go to Definition` 等功能时回到`.ts`源文件

### emitDeclarationOnly

只生成.d.ts文件；不生成.js文件。

下面列举了两个使用场景
- 你正在使用 `TypeScript` 以外的`转译器`来生成 `JavaScript`
- 你使用 `TypeScript` 只是为了生成 `.d.ts` 声明文件

### sourceMap

启用 `sourcemap` 选项，允许调试器和其他工具在使用生成的 `JavaScript` 文件时，显示原始的 TypeScript 代码。

以 `.js.map` 或 `.jsx.map` 后缀的形式生成 Source map 文件


### outFile

`outFile` 可以指定编译后的结果文件被打包成一个bundle，即一个js文件，前提是 `module` 选项被设置成 `System` 或 `AMD`。

如果想要支持其他的module选项，可以借助webpack、parcel等工具。

### outDir 

编译后的文件会在 `outDir` 指定的目录下生成。

如果未指定，`源文件` 将与`生成文件` 在同一目录，例如

```txt
$ tsc
example
├── index.js
└── index.ts
```

指定 `outDir` 为 `dist`
```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

那么生成的文件会按照 `outDir` 指定的路径生成

```txt
$ tsc
example
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```

### removeComments (默认 false)

当转换为 JavaScript 时，忽略所有 TypeScript 文件中的注释

### noEmit (默认 false)

禁止编译器生成文件，例如 JavaScript 代码，source-map 或声明。

这为另一个工具提供了空间，例如用 `Babel` 或 `swc` 来处理将 `TypeScript` 转换为可以在 `JavaScript` 环境中运行的文件的过程。

然后你可以使用 `TypeScript` 作为提供编辑器集成的工具，或用来对源码进行`类型检查`。

### importHelpers

`TypeScript` 编译其会有和在使用 `Babel` 一样的问题：在把 ES6 语法转换成 ES5 语法时需要注入辅助函数， 为了不让同样的辅助函数重复的出现在多个文件中，可以开启 TypeScript 编译器的 importHelpers 选项。

该选项的原理和 `babel`中介绍的 `@babel/plugin-transform-runtime` 非常类似，会把辅助函数换成以下语句:

```js
var _tslib = require('tslib');
_tslib._extend(target)
```

源文件
```js
class A {}
class B extends A {}
export = A;
```

未启用`importHelpers`后，编译生成

```js
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var A = (function () {
    function A() {
    }
    return A;
}());
var B = (function (_super) {
    __extends(B, _super);
    function B() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return B;
}(A));
module.exports = A;
```

启用`importHelpers`后，编译生成
```js
"use strict";
var tslib_1 = require("tslib");
var A = (function () {
    function A() {
    }
    return A;
}());
var B = (function (_super) {
    tslib_1.__extends(B, _super);
    function B() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return B;
}(A));
module.exports = A;
```

编译出的代码依赖`tslib`这个迷你库，避免了冗余代码


tslib（TS 内置的库）引入 helper 函数
### noEmitHelpers

启用`importHelpers`, 辅助函数将从 tslib 中被导入。

当使用 `noEmitHelpers`，辅助函数需要自行实现。

源文件
```js
class A {}
class B extends A {}
export = A;
```

启用`noEmitHelpers`, 禁用 `importHelpers` 后，编译生成
```js
var A = (function () {
    function A() {
    }
    return A;
}());
var B = (function (_super) {
    __extends(B, _super);
    function B() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return B;
}(A));
export {};
```

`noEmitHelpers` 和 `importHelpers` 只需启用一个，如果想要自行实现辅助函数则开启 `noEmitHelpers`，否则启用 `importHelpers`


### noEmitOnError

编译发生错误时不生成文件

### importsNotUsedAsValues

该选项 在`TypeScript` 版本 `5.5.` 后被弃用, 被 `verbatimModuleSyntax` 替代。如果仍想继续使用该选项，需将 `ignoreDeprecations` 选项设为 `5.0`

通过它可以来控制没被使用的导入语句将会被如何处理，它提供了三个不同的选项
- remove: 默认值。移除未使用的导入语句
- preserve: 保留`import`从未使用过`值`或`类型`的所有语句。这可能会导致 `imports` 或 `副作用` 被保留。
- error: 将会保留所有的导入语句(与preserve选项相同)，但当导入一个值作为类型使用时将会报错。

### downlevelIteration

`downlevel (降级)` 是 `TypeScript` 的术语，指用于转换到旧版本的 `JavaScript`。

这个选项是为了在旧版 Javascript 运行时上更准确的实现现代 JavaScript 迭代器的概念。

`ECMAScript 6` 增加了几个新的迭代器原语：`for / of` 循环（`for (el of arr)`），数组展开（`[a, ...b]`），参数展开（`fn(...args)`）和 `Symbol.iterator`。

如果 `Symbol.iterator` 存在的话，`--downlevelIteration` 将允许在 ES5 环境更准确的使用这些迭代原语。

示例：对的影响for / of

使用此 TypeScript 代码：
```ts
const str = "Hello!";
for (const s of str) {
 console.log(s);
}
```

如果不downlevelIteration启用，for / of任何对象上的循环都会降级为传统for循环：
```js
"use strict";
var str = "Hello!";
for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
    var s = str_1[_i];
    console.log(s);
}
```
这通常是人们期望的，但不是100% 符合 ECMAScript 迭代协议。

启用 `downlevelIteration` 后，`TypeScript` 将使用辅助函数来检查实现 `Symbol.iterator`（本地 或 polyfill）。如果缺少此实现，您将退回到基于索引的迭代。

```js
"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a;
var str = "Hello!";
try {
    for (var str_1 = __values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
        var s = str_1_1.value;
        console.log(s);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
    }
    finally { if (e_1) throw e_1.error; }
}
```

就像 `for / of` 一样，`downlevelIteration` 将使用 `Symbol.iterator`（如果存在）来更准确地模拟 ES 6 行为。

## include

## exclude

## files





```json
{
    "compilerOptions": {

      /* Projects */
      "incremental": true,                      // 保存 .tsbuildinfo 文件以允许项目的增量编译
      "tsBuildInfoFile": "./",                  // 为.tsbuildinfo增量编译文件指定文件夹。主要用于优化二次编译速度，只编译修改过的文件, 下次编译的时候会进行对比只编译修改过的文件 

      /* Language and Environment */
      "target": "ES5",                           // 指定编译后生成的的JS版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'
      "lib": ["DOM", "ES2016", "ES2017.Object"], // 和 target 一起使用。ts不会在编译的时候注入polyfull，需要手动配置 target 所需的 polyfill
      "jsx": "",                                 // 这些模式只在代码生成阶段起作用 - 类型检查并不受影响
      "experimentalDecorators": true,          // 是否启用装饰器

      /* Modules */
      "module": "ES6",                           // "None", "CommonJS", "AMD", "System", "UMD", "ES6", "ES2015", "ESNext"
      "rootDir": "",
      "baseUrl": ".",                            // 全局相对模块引入的基础路径
      "paths": [],                               // 指定模块路径别名
      "moduleResolution": "node10",              // 模块解析策略。"Bundler", "Classic", "classic", "Node", "Node16", "NodeNext"
      "types": [],                               // 指定要包含但不在源文件中引用的类型包名称。默认情况下，所有node_modules/@types里的包都会在编译中
      "typeRoots": [],


      /* JavaScript Support */
      "allowJs": true,                            // 允许js参与到编译中
      "checkJs": true, 

      /* Emit */
      "noEmit": false,                          // 是否输出声明文件。true: 不生成声明文件，false: 生成声明文件
      "declaration": true ,                     // 是否生成声明文件。设置 declarationDir 属性，declaration 必须为true
      "emitDeclarationOnly": true,              // 仅仅生成 *.d.js 文件
      "declarationDir": "./dist/types",         // 输出的声明文件目录
      "outDir": "dist",                          // 默认情况下，ts编译后的js文件，与源文件都在同一个目录下。使用outDir选项可以指定编译后的文件所在的目录。清理之前编译生成的js文件。
      "removeComments": true,                    // 是否删除注释
      "declarationMap": true,

      /* Interop Constraints */
      "allowSyntheticDefaultImports": true,
      "esModuleInterop": true,

      /* 类型检查 */
      "strict": true,
      "noImplicitAny": true,                   // 是否必须显式声明 `any`。true: 是(默认), false: 否
    },
    "files": [],                              // 指定需要被编译的文件列表。这里不能指定目录，只能是文件，可以省略.ts 后缀。适合需要编译的文件比较少的情况。默认值为 false；
    "include": [],                            // 指定需要编译的文件列表或匹配模式(glob)。include 可以通过通配符指定目录，如"src/**/*" 表示 src 下的所有文件。如果没有指定 files 配置，默认值为 ** ，即项目下所有文件；如果配置了 files，默认值为 [] 空数组；
    "exclude": [],                            // 在 include 圈定的范围内，排除掉一些文件。我们经常用它来排除编译输出目录、测试文件目录、一些生成文件的脚本等文件。默认值为 "node_modules,bower_componen"；
    "extends": "./tsconfig.base.json",       // 继承, 另一个 ts 配置文件。这在 monorepo 的代码组织中非常有用，不同的 package 可以通过 extends 继承通用的 ts 配置。用法示例："extends": "./common-tsconfig.json"。
    "references": [],                         // 引用, 引用项目 composite 选项设置为 true。项目中如果有多个相互独立的模块，可以使用这个属性来做分离。这样一个模块改变后，就只重新编译这个模块，其他模块不重新编译。编译时要改用tsc --build

    /* Completeness */
    "skipLibCheck": true                      // 跳过对所有.d.ts文件的类型检查
}
```