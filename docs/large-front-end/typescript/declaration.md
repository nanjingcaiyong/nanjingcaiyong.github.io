
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

如果启用 `composite` 选项，则默认为 `true`；否则默认为 `false`

是否开启增量编译。

使 `TypeScript` 将上次编译信息保存到磁盘上的文件中。`.tsbuildinfo` 文件会生成在指定的 `编译输出目录` 中。

主要用于优化二次编译速度，只编译修改过的文件, 下次编译的时候会进行对比只编译修改过的文件。

### tsBuildInfoFile

必须启用 `incremental` 或 `composite`。

为 `.tsbuildinfo` 增量编译文件指定全路径（例如："tsBuildInfoFile": "./dist/.tsbuildinfo" ）。

### composite

`TypeScript 3.0` 引入了 `项目引用（references）` 这一重大特性，让一个 TypeScript 项目可以依赖于其他 TypeScript 项目——特别是可以让 `tsconfig.json` 文件引用其他的 `tsconfig.json` 文件。这样可以更容易地将代码拆分为更小的项目，也意味着可以逐步加快项目的构建速度，并支持跨项目浏览、编辑和重构。

`composite` 选项会强制执行某些约束。使得构建工具（包括 在 `--build` 模式下的 TypeScript 本身）可以快速确定一个工程是否已经建立。确保 TypeScript 可以确定在哪里可以找到引用项目的输出以编译项目

当启用`composite` 选项时：

- 如果未指定 `rootDir` ，默认为包含 `tsconfig.json` 文件的目录
- 所有实现的文件必须匹配由 `include` 来匹配，或在 `files` 数组中指出。如果违反了这一约束，`tsc` 会提示你哪些文件没有被指定。
- `declaration` 将默认为 `true`

`client` 和 `server` 共享 `shared`，这样可以避免触发`双重构建`以及意外地引入 shared 的所有内容。
```txt
├── client
│   ├── main.ts
├── server
│   ├── main.ts
├── shared
│   ├── main.ts
│   └── tsconfig.json
└── tsconfig.json
```

**shared/tsconfig.json**

```json
{
  "compilerOptions": {
    ...,
    "composite": true
  }
}
```

**tsconfig.json**
```json
{
  "compilerOptions": { ... },
  "references": [
    { "path": "./shared" }
  ],
  "include": [
    "shared/**/*",
    "server/**/*",
    "client/**/*"
  ]
}
```

根目录下的 `tsconfig.json` 必须指定 `include` 或 `files`，否则在编译阶段（`tsc`）报错。
```txt
error TS6305: Output file '/xxx/shared/index.d.ts' has not been built from source file '/xxx/shared/index.ts'.
  The file is in the program because:
    Matched by default include pattern '**/*'
```


### disableSourceOfProjectReferenceRedirect

### disableSolutionSearching

### disableReferencedProjectLoad


## Language and Environment

### target

现代浏览器支持全部 `ES6` 的功能，所以 `ES6` 是一个不错的选择。如果你的代码部署在旧的环境中，你可以选择设置一个更低的目标值。

改变 `target` 也会改变 `lib` 选项的默认值。 你可以根据需要混搭 `target` 和 `lib` 的配置，你也可以为了方便只设置 target。

如果你只使用 Node.js，这里推荐基于 Node 版本的 target：

| 名称    | 支持的编译目标|
|--------|-------|
| Node 8  | ES2017 |
| Node 10 | ES2018 |
| Node 12 | ES2019 |

特殊的 ESNext 值代表你的 TypeScript 所支持的最高版本。这个配置应当被谨慎使用，因为它在不同的 TypeScript 版本之间的含义不同，并且会导致升级更难预测。

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

你可能出于某些原因改变它：
- 你的程序不运行在浏览器中，因此你不想要 "dom" 类型定义。
- 你的运行时平台提供了某些 JavaScript API 对象（也许通过 polyfill），但还不支持某个 ECMAScript 版本的完整语法。
- 你有一些 （但不是全部）对于更高级别的 ECMAScript 版本的 polyfill 或本地实现。

### jsx

默认不支持 `jsx` 语法。支持 `preserve`、`react`、`react-jsx`、`react-jsxdev`、`react-native`

main.tsx
```tsx
export const render = () => <div>hello world</div>
```

tsconfig.json
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

编译后的 `main.jsx`
```jsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const render = () => <div>hello world</div>;
exports.render = render;
```

**react**

将 `JSX` 改为等价的对 `React.createElement` 的调用并生成 `.js` 文件。

当 `jsx` 选项设为 `react`，`main.tsx` 将报错：

```tsx
export const render = () => <div>hello world</div>; // “React”指 UMD 全局，但当前文件是模块。请考虑改为添加导入。ts(2686)
```

需要引入 `React` 模块，修改如下：
```tsx
import React from "react";
export const render = () => <div>hello world</div>
```

编译后的 `main.js`
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const render = () => React.createElement("div", null, "hello world");
exports.render = render;
```

**react-jsx**

改为 `__jsx` 调用并生成 `.js` 文件

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const render = () => (0, jsx_runtime_1.jsx)("div", { children: "hello world" }, void 0);
exports.render = render;

```
**react-jsxdev**

改为 `__jsx` 调用并生成 .js 文件

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

不对 `JSX` 进行改变并生成 `.js` 文件

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const render = () => <div>hello world</div>;
exports.render = render;
```

### reactNamespace

已弃用。使用`jsxFactory`替代

### jsxFactory

只有在 `jsx` 选项值为 `react` 时生效。

更改使用经典 `JSX` 运行时编译 `JSX Elements` 时在 `.js` 文件中调用的函数。最常见的变化是使用 `h` 或 `React.createElement`。

### jsxFragmentFactory

### jsxImportSource

### experimentalDecorators 

是否启用装饰器

### emitDecoratorMetadata

需要先启用 `experimentalDecorators`。

启用对使用 `reflect-metadata` 模块的 `装饰器` 发射类型` 元数据`（是指附加在对象、类、方法、属性、参数上的数据,它可以用来帮助实现某种业务功能需要用到的数据）的实验性支持

`Reflect Metadata` 是 `ES7` 的一个提案，它主要用来在声明的时候添加和读取元数据。`TypeScript` 在 `1.5+` 的版本已经支持它，你只需要：

- npm i reflect-metadata --save
- 在 tsconfig.json 里配置 emitDecoratorMetadata 选项

Reflect Metadata 的 API 可以用于类或者类的属性上，如：

```sh
function metadata(
  metadataKey: any,
  metadataValue: any
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
};
```

`Reflect.metadata` 当作 `Decorator` 使用，当修饰类时，在类上添加元数据，当修饰类属性时，在类原型的属性上添加元数据，如：

```ts
@Reflect.metadata('inClass', 'A')
class Test {
  @Reflect.metadata('inMethod', 'B')
  public hello(): string {
    return 'hello world';
  }
}

console.log(Reflect.getMetadata('inClass', Test)); // 'A'
console.log(Reflect.getMetadata('inMethod', new Test(), 'hello')); // 'B'
```

### noLib

禁用自动包含任何库文件。如果设置了该选项，`lib` 选项将被忽略。

当启用时，`Array`、`Boolean`、`Function`、`IArguments`、`Number`、`Object`、`RegExp`和 `String` 等类型都需要自己重新声明。除非你希望自己重新定义类型，否则不要做修改。

### useDefineForClassFields

启用后的作用是将 `class` 声明中的字段语义从 [[Set]] 变更到 [[Define]]

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

### sourceRoot

需要启用 `inlineSourceMap` 或选 `sourceMap`，才能生效。

指定`编译后`文件映射回 `TypeScript` `源文件` 的路径，以便调试器定位。当TypeScript文件的位置是在运行时指定时，才会使用此标记。路径信息会被加到 sourceMap里。例如：
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "sourceRoot": "https://my-website.com/debug/source/"
  }
}
```

编译后的 `index.js`文件映射回源文件路径 `https://my-website.com/debug/source/index.ts`。

index.js.map 文件
```json
{
  "version":3,
  "file":"index.js",
  "sourceRoot":"https://my-website.com/debug/source/",
  "sources":["index.ts"],
  "names":[],
  "mappings":";;AAGA,IAAM,GAAG,GAAG,QAAQ,CAAC;;IACrB,KAAgB,IAAA,QAAA,SAAA,GAAG,CAAA,wBAAA,yCAAE;QAAhB,IAAM,CAAC,gBAAA;QACV,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC;KAChB;;;;;;;;;AAED,IAAM,GAAG,kBAAI,CAAC,GAAK,CAAC,CAAC,EAAC,CAAC,EAAC,CAAC,CAAC,QAAC,CAAC"
}
```

### mapRoot

指定调试器`定位`映射文件(.map)时的寻址位置，例如：
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "mapRoot": "https://my-website.com/debug/sourcemaps/"
  }
}
```

index.js 在映射回 `源文件` 时，会先通过`映射文件` https://my-website.com/debug/sourcemaps/index.js.map，才能找到源文件。这里的 `映射文件` 地址路径来自于选项 `mapRoot` 的配置。

### inlineSourceMap

启用后，源映射内容不会生成在单独的 `.js.map` 文件中，而是作为嵌入字符串包含在 `编译后的文件` 中。虽然这会导致编译后的 `JS` 文件更大，但在某些场景下可能很方便。例如，你可能想要在不允许 `.map` 提供文件的 `Web服务器` 上调试 `js` 文件。

`inlineSourceMap` 与 `sourceMap` 互斥。`sourceMap` 会将 `源映射内容` 生成在单独的 `.js.map` 文件中，而 `inlineSourceMap` 会将 `源映射内容` 嵌入编译后的文件底部。例如：

```ts
const helloWorld = "hi";
console.log(helloWorld);
```

默认情况下转换为以下 JavaScript

```ts
"use strict";
const helloWorld = "hi";
console.log(helloWorld);
```

启用`inlineSourceMap`, 编译后的文件底部有一条注释，其中包括文件的源映射。

```js
"use strict";
const helloWorld = "hi";
console.log(helloWorld);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMifQ==
```

### inlineSources

启用后，会将 `.ts` 原始内容作为字符串包含在源映射中。

需要同时启用 `sourceMap` 或 `inlineSourceMap`。

`sourceMap` 和 `inlineSources`组合，`源映射内容` 和 `.ts原始代码` 都会被包含在 `.js.map`中。

`inlineSourceMap` 和 `inlineSources`组合，不会额外生成`.js.map`文件。`源映射内容` 和 `.ts原始代码` 都会被包含在编译后的 `JS` 文件中。

例如：
```ts
const helloWorld = "hi";
console.log(helloWorld);
```

默认情况下转换为以下 JavaScript：

```js
"use strict";
const helloWorld = "hi";
console.log(helloWorld);
```

启用 `inlineSources` 和 `inlineSourceMap`，编译后的文件底部有一条注释，其中包括文件的源映射。

注意，结尾的源映射内容与 `只单独启用` `inlineSourceMap` 不同。因为启用 `inlineSources`后，源映射内容包含了 `.ts` 的 `原始代码`

```js
"use strict";
const helloWorld = "hi";
console.log(helloWorld);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBoZWxsb1dvcmxkID0gXCJoaVwiO1xuY29uc29sZS5sb2coaGVsbG9Xb3JsZCk7Il19
```

### emitBOM


### newLine

指定输出文件时使用的行尾结束符: CRLF (dos)或 LF (unix)。


### stripInternal

不对具有 /** @internal */ JSDoc注解的代码生成声明。这是一个内部编译器选项，尽量不要修改选项。

例如：

```ts
/**
 * Days available in a week
 * @internal
 */
export const daysInAWeek = 7;
 
/** Calculate how much someone earns in a week */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate;
}
```

将选项设置为`false`（默认），生成的 `.d.ts`文件
```ts
/**
 * Days available in a week
 * @internal
 */
export declare const daysInAWeek = 7;
/** Calculate how much someone earns in a week */
export declare function weeklySalary(dayRate: number): number;
```


启用 `stripInternal`后，生成的`.d.ts`文件
```ts
/** Calculate how much someone earns in a week */
export declare function weeklySalary(dayRate: number): number;
```

只有生成的声明文件存在差异，编译后的 `JavaScript` 相同

### preserveConstEnums

在生成的代码中保留 `const enum` 的声明。 `const enum` 提供了通过 `JavaScript` 生成枚举值的方法而不是运行时跟踪，来减少应用程序在运行时的总体内存占用

例如：
```ts
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3,
}
 
const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

默认 `const enum` 是将 `any` 转换 `Album.Something` 为相应的数字，并从 JavaScript 中完全`删除`对枚举的引用

```js
"use strict";
const selectedAlbum = 1 /* Album.JimmyEatWorldFutures */;
if (selectedAlbum === 1 /* Album.JimmyEatWorldFutures */) {
    console.log("That is a great choice.");
}
```
当 启用`preserveConstEnums`时

```js
"use strict";
var Album;
(function (Album) {
    Album[Album["JimmyEatWorldFutures"] = 1] = "JimmyEatWorldFutures";
    Album[Album["TubRingZooHypothesis"] = 2] = "TubRingZooHypothesis";
    Album[Album["DogFashionDiscoAdultery"] = 3] = "DogFashionDiscoAdultery";
})(Album || (Album = {}));
const selectedAlbum = 1 /* Album.JimmyEatWorldFutures */;
if (selectedAlbum === 1 /* Album.JimmyEatWorldFutures */) {
    console.log("That is a great choice.");
}
```

本质上 `const enums` 只是`实现`了这样的源代码枚举功能，没有在运行时跟踪

### declarationDir

必须先启用 `declaration` 选项。

用于配置`声明文件` `根路径`的选项。
```txt
example
├── index.ts
├── package.json
└── tsconfig.json
```

tsconfig.json
```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./types"
  }
}
```

将`index.ts`编译生成的`.d.ts`声明文件放在 `types` 目录下
```txt
example
├── index.js
├── index.ts
├── package.json
├── tsconfig.json
└── types
    └── index.d.ts
```


### preserveValueImports

已弃用。使用 `verbatimModuleSyntax`

在某些情况下，`TypeScript` 无法检测到您正在使用的导入。例如：

```ts
import { Animal } from "./animal.js";
eval("console.log(new Animal().isDangerous())");
```

或正在使用的代码 `编译为 HTML` 语言像 `Svelte` 或 `vue`。`preserveValueImports` 将阻止 `TypeScript` 删除看起来`未使用`的导入。

与 `isolatedModules` 结合使用时，导入的类型必须标记为仅类型，因为一次处理单个文件的编译器无法知道导入是否是未使用的值，或者是必须删除以避免运行时崩溃的类型。


## Interop Constraints

### isolatedModules

虽然可以使用 `TypeScript` 从 `TypeScript` 中生成 `JavaScript` 代码，但使用`Babel`等其他转译器也很常见。然而，其他转译器一次只能操作一个文件，这意味着它们无法进行基于完全理解类型系统后的代码转译。

这个限制也同样适用于被一些构建工具使用的 `TypeScript` 的 `ts.transpileModule` 接口。

这些限制可能会导致某些 `TypeScript` 功能（例如`const enums` 和 `namespaces`）出现运行时问题。

启用 `isolatedModules` 选项会告诉 `TypeScript` 在编写的某些代码`无法`被`单文件转译的过程` `正确解释`时`发出警告`。

该选项不会改变代码的行为，也不会改变 TypeScript 检查和代码生成过程的行为。

当启用 `isolatedModules` 时不能正常工作的例子

在 `TypeScript` 中，可以导入类型，然后将其导出

someModule.ts
```ts
export function someFunction () {}
export type someType = {[key: string]: any}
```

main.ts
```ts
import { someType, someFunction } from "someModule";
 
someFunction();
 
export { someType, someFunction };
```

因为 `someType` 没有值，所以在代码生成的时候 `export` 不会将它导出（将在 `JavaScript` 中运行时报错）
```js
export { someFunction };
```

`单文件转译器`不知道`someType` 是否生成值，因此`仅导出``引用类型的名称`是`错误`的。

**非模块文件**

如果启用 `isolatedModules`，则所有实现文件都必须是`模块`（文件内含有 `import` 或 `export` 才能成为 `模块`）。如果任何文件不是模块，则会发生报错（`TypeScript@5.0.0`后不报错）。 例如：

```ts
function fn() {}
```

此限制不适用于.d.ts文件。

**参考 const enum**

在 `TypeScript` 中，当您引用 `const enum` 时，生成的 `JavaScript` 中的实际值被替换。例如：

```ts
declare const enum Numbers {
  Zero = 0,
  One = 1,
}
console.log(Numbers.Zero + Numbers.One);
```

编译后的 JavaScript：
```js
"use strict";
console.log(0 + 1);
```

如果不知道这些枚举成员的值，其他转译器就无法替换`Numbers`的引用，如果不管的话，运行时报错（因为运行时Numbers没有对象）。因此，启用`isolatedModules` 选项时，`Numbers` 成员将在其使用的文件中报错



### verbatimModuleSyntax

要求在如果导入的是一个类型，必须用 `type` 操作符声明，否则报错。

```ts
// car.ts
export type Car = {name: 'benz'}
```

```ts
// main.ts
import { Car } from './car.ts'; // 启用 verbatimModuleSyntax 选项后将报错
```

main.ts修改为
```ts
import type { Car } from './car.ts'; // 添加 type 操作符后，报错消失
```

默认情况下，`TypeScript` 会执行称为 `import elision` 的操作。例如下面这种情况：
```js
import { Car } from './car'
export function drive (car: Car) {
  // ...
}
```

当 `TypeScript` 在编译时检测到仅使用类型导入后会将该 `import`语句完全删除。生成的 `JavaScript` 代码如下：
```js
export function drive(car) {
  // ...
}
```

大多数时候没问题，因为如果 `Car` 不是从 `./car` 导出的值，那么在运行环境中将报错。

但它确实为某些边缘情况增加了一层复杂性。例如，没有任何状态的 `import` 语句像`import "./car";` 会被完全删除。

这实际上对于有副作用或没有副作用的模块的影响是不一样的。

`TypeScript` 生成 `JavaScript` 的策略还具有另外几层复杂性。import `elision` 并不是总是由导入的方式决定。它通常


`TypeScript` `5.0` 引入了一个名为 `--verbatimModuleSyntax` 的新选项去简化流程。规则要简单得多，任何没有`type`修饰符的导入或导出都会保留，而使用 `type` 修饰符的内容都会被`完全删除` - 它通常也会参考值的声明方式。

所以并不总是清楚代码是否像下面这样

```ts
export { Card } from './car';
```

是否应该保留还是删除。如果 `Car` 是用类似 `class` 那样被声明，那么它会被保留在生成的`JavaScript`文件中。但是如果用 `type` 或 `interface` 声明 `Car`，那么 `JavaScript` 文件就不会导出 `Car`。

`导入` 和 `导出` 的 `type` 修饰符能够针对上面的情况有所帮助。我们可以明确指出 `导入` 或 `导出` 是否仅用于类型分析，并且可以使用 `type` 修饰符指定在生成 `JavaScript` 文件的时候完全删除该条 `导入` 或 `导出` 语句。

```ts
// Erased away entirely.
import type { A } from "a";
// Rewritten to 'import { b } from "bcd";'
import { b, type c, type d } from "bcd";
// Rewritten to 'import {} from "xyz";'
import { type xyz } from "xyz";
```

`type` 修饰符自身没什么作用 - 默认情况下 `module elision` 仍会删除导入，并且不会强制你去区分 `type` 和 `普通` 导入 和 导出。所以 `TypeScript` 使用 `--importsNotUsedAsValues` 标志来确保你使用 `type` 修饰符，`--preserveValueImports` 标志来防止 `module elision` 对导入语句的删除，并且 `--isolatedModules` 来确保你的 `TypeScript` 代码可以在`不同` `编译器`间运行。理解这 `3个` 标志的细节很困难，而且仍然存在一些意外的边缘情况。


 `TypeScript` `5.0` 引入了 `--verbatimModuleSyntax` 标志来简化这种情况。这些规则非常简单 - 任何没有 `type`标识符 的 `导入` 或 `导出` 都会被保留，而任何使用 `type` 标识符的 `导入` 或 `导出` 会被删除。


 ```ts
 // Erased away entirely.
import type { A } from "a";
// Rewritten to 'import { b } from "bcd";'
import { b, type c, type d } from "bcd";
// Rewritten to 'import {} from "xyz";'
import { type xyz } from "xyz";
```

启用该选项，当你设置或文件扩展名暗示不同系统时，ECMAScript `import` 和 `export` 不会被重写为 `require` 调用。相反，你会收到报错。如果你需要生成的代码使用 `require` 和 `module.exports`，你将不得不使用 ES2015之前的 `TypeScript` 模块语法

typescript 代码
```ts
import foo = require('foo')

// foo.ts
function foo () {}
function bar () {}
function baz () {}

export = {
  foo,
  bar,
  baz
}
```

生成的 JavaScript 代码

```js
const foo = require('foo');

// foo.js
function foo () {}
function bar () {}
function baz () {}

module.exports = {
  foo,
  bar,
  baz
}
```

上述 `import xxx = require('xxx')` 的语法只能在 `module`选项设为 `commonjs`时生效，否则会报错。

虽然这是一种限制，但是确实有助于使 `import elision` 的问题在静态编译静态暴露出来。例如，在`module`设为 `node16`情况下，忘记设置 `package.json` 的 `type`字段非常常见。因此，开发人员会在没有意识到的情况下开始编写 `CommonJS模块` 而不是 `ES模块`，从而得到意外的查找规则和 `JavaScript`输出。这个新标志可确保你完全清楚你所使用的文件类型。


因为 `-verbatimModuleSyntax` 选项提供了 `importsNotUsedAsValues` 和 `preserveValueImports` 几乎一致的功能，所以这两个选项被废弃。


### allowSyntheticDefaultImports

启用该选项，`allowSyntheticDefaultImports` 允许这样导入例如：
```ts
import React from 'react';
```
取代:
```ts
import * as React from 'react';
```

当模块`没有`显式指定默认导出时。

例如：没有启用 `allowSyntheticDefaultImports` 选项

utilFunctions.js
```js 
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
 
module.exports = {
  getStringLength,
};
 
// @filename: index.ts
import utils from "./utilFunctions"; // 模块“"/xxx/utilFunctions"”没有默认导出。ts(1192)
 
const count = utils.getStringLength("Check JS");
```

此代码会引发报错，因为没有`import`的模块没有导出`default`。尽管感觉应该如此。为了方便起见，如果没有创建，像 Babel 这样的转译器会自动创建一个默认值。让模块看起来像：

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};
module.exports = allFunctions;
module.exports.default = allFunctions;
```

该选项不会影响编译，它仅用于类型检查。此选项使 `TypeScript` 的行为与 `Babel` 保持一致，生成的代码确保有模块的默认导出（default）。


### esModuleInterop

默认情况下（如果将 `esModuleInterop` 设为 `false` 或 未设置） `TypeScript` 像 ES6 模块一样对待 `CommonJS/AMD/UMD`。这样的行为有两个被证实的缺陷：

- 例如 `import * as moment from 'moment'` 这样的命名空间导入等价于 `const moment = require('moment')`
- 例如 `import moment from 'moment'` 这样的默认导入等价于 `const moment = require('moment').default`

这种错误的行为导致了这两个问题：
- ES6 模块规范规定，命名空间导入（import * as x）只能是一个对象。TypeScript 把它处理成 = require("x") 的行为允许把导入当作一个可调用的函数，这样不符合规范。
- 虽然 TypeScript 准确实现了 ES6 模块规范，但是大多数使用 CommonJS/AMD/UMD 模块的库并没有像 TypeScript 那样严格遵守。

开启 `esModuleInterop` 选项将会修复 `TypeScript` 转译中的这两个问题。第一个改变了编译器中的行为，第二个由`polyfill`的两个新的辅助函数修复，确保生成的 `JavaScript` 的兼容性：

```ts
import * as fs from "fs";
import _ from "lodash";
fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

禁用 `esModuleInterop`
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const lodash_1 = require("lodash");
fs.readFileSync("file.txt", "utf8");
lodash_1.default.chunk(["a", "b", "c", "d"], 2);
```

启用 `esModuleInterop`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
fs.readFileSync("file.txt", "utf8");
lodash_1.default.chunk(["a", "b", "c", "d"], 2);
```

注意：命名空间导入`import * as fs from 'fs'`仅考虑导入对象所拥有的属性（基本上是在对象上设置的属性，而不是通过原型链设置的属性）。如果您要导入的模块使用继承属性定义其 API，则需要使用默认导入形式 ( `import fs from 'fs'`) 或禁用esModuleInterop。

注意：您可以通过启用`importHelpers`, 使 JS 生成更简洁的代码：
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
fs.readFileSync("file.txt", "utf8");
lodash_1.default.chunk(["a", "b", "c", "d"], 2);
```

启用 `esModuleInterop` 也将启用 `allowSyntheticDefaultImports`

### preserveSymlinks

`TypeScript 2.5` 带来了 `preserveSymlinks` 选项，它对应了 `Node.js` 中 `--preserve-symlinks` 选项的行为。这一选项也会带来和`Webpack`的 `resolve.symlinks` 选项相反的行为（也就是说，将`TypeScript`的` preserveSymlinks`选项设置为 `true` 对应了将 `Webpack` 的 `resolve.symlinks` 选项设为 `false`，反之亦然）。

在这一模式中，对于模块和包的引用（比如 import语句和 /// <reference type=".." />指令）都会以相对符号链接文件的位置被解析，而不是相对于符号链接解析到的路径。更具体的例子，可以参考 [Node.js网站的文档](https://nodejs.org/api/cli.html#cli_preserve_symlinks)。

### forceConsistentCasingInFileNames（默认 true）

`TypeScript` 遵循其运行的文件系统的区分大小写规则。如果一些开发人员在区分大小写的文件系统中工作而其他开发人员则不然，这可能会出现问题。`fileManager.ts` 如果尝试通过指定文件导入 `./FileManager.ts`，则该文件将在不区分大小写的文件系统中找到，但不会在区分大小写的文件系统上找到。

启用该选项后，如果程序尝试使用一个在磁盘上大小写不同的文件，`TypeScript` 将发出错误。

## Type Checking

### strict

支持更严格的类型检查

### noImplicitAny

不能隐式声明 `any` 类型。

在没有类型注释的情况下，typescript 在无法推断类型时，会将类型回退到 any。这可能会导致一些错误被遗漏。这可能会导致一些错误被遗漏。

启用此配置， `TypeScript` 会在类型回退到 `any` 时提示错误。
```ts
function fn (s) {
  // Parameter 's' implicitly has an 'any' type.
  console.log(s.substr(3));
}
```

### strictNullChecks

启用后，`TypeScript` 会把 `undefined` 和 `null` 作为不同的类型。

例如下面的 `TypeScript` 代码，`users.find` 不能保证找到 `user` 对象，尽管这样你仍然可以像下面这样写代码：

```ts
declare const loggedInUsername: string;
 
const users = [
  { name: "Oby", age: 12 },
  { name: "Heera", age: 32 },
];
 
const loggedInUser = users.find((u) => u.name === loggedInUsername);
console.log(loggedInUser.age);
```

启用该选项后，将引发报错。表示在使用 `loggedInUser` 前不能保证它有值。

### strictFunctionTypes

当开启时，TypeScript 会对 函数的参数类型使用更严格的检查。

```ts
function fn(x: string) {
  return x
}
type Fn = (ns: string | number) => string | number

const fn1: Fn = fn // error: Types of parameters 'x' and 'ns' are incompatible.

```

需要注意的是，该配置只适用于 `function` 语法，而不适用于 `method` 语法。如下：

```ts
type Methodish = {
  func(x: string | number): void;
};
 
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}
 
// Ultimately an unsafe assignment, but not detected
const m: Methodish = {
  func: fn,
};
m.func(10);
```

### strictBindCallApply

当开启时，TypeScript 会检查 call、bind和apply是否使用正确的参数调用底层函数。

```ts
// With strictBindCallApply on
function fn(x: string) {
  return parseInt(x);
}
 
const n1 = fn.call(undefined, "10");
 
const n2 = fn.call(undefined, false); // Argument of type 'boolean' is not assignable to parameter of type 'string'.
```

当禁用时，函数接受 `任何参数` 并返回 `any`
```ts
// With strictBindCallApply off
function fn(x: string) {
  return parseInt(x);
}
 
// Note: No error; return type is 'any'
const n = fn.call(undefined, false);
```

### strictPropertyInitialization

当启用时，typescript 会检查 在 class 中已声明的属性，是否有在 constructor 中进行初始化。

```ts
class UserAccount {
  name: string;
  accountType = "user";
 
  email: string; // Property 'email' has no initializer and is not definitely assigned in the constructor.

  address: string | undefined;
 
  constructor(name: string) {
    this.name = name;
    // Note that this.email is not set
  }
}
```

在上面的例子中：

- `this.name` 在构建函数中被赋值
- `this.accountType` 被设置默认值
- `this.email` 没有被设置会引发错误
- `this.address` 声明的类型包含潜在的 `undefined`，所以不一定要赋值

### noImplicitThis

如果启用 `strict`，`noImplicitThis` 默认为 `true`。否则为 `false`。

在具有隐含 `any` 类型的 `this` 表达式上引发错误。

例如，下面的 `class` 返回一个函数，函数内尝试返回 `this.width` 和 `this.height` - 但是 `getAreaFunction` 里面 `return`的函数里面的`this`上下文 并不是 `Rectangle` 的实例

```ts
class Rectangle {
  width: number;
  height: number;
 
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
 
  getAreaFunction() {
    return function () {
      return this.width * this.height;
// 'this' implicitly has type 'any' because it does not have a type annotation.
// 'this' implicitly has type 'any' because it does not have a type annotation.
    };
  }
}
```

### useUnknownInCatchVariables

如果启用 `strict`，该选项默认为 `true`。否则为 `false`

在 `TypeScript 4.0` 中，添加了允许将 `catch` 子句中的变量类型从 `any` 更改为 `unknow`。

`useUnknownInCatchVariables` 值为 `false`时，允许这样的代码：

```ts
try {
  // ...
} catch (err) {
  console.log(err.message);
}
```

但是我们无法保证`catch` 抛出的 `err` 对象是 `Error` 的子类，有可能引发异常。所以我们需要在使用 `err` 对象前进行验证，代码修改为：

```ts
try {
  // ...
} catch (err) {
  if (err instanceof Error) {
    console.log(err.message);
  }
}
```

因为您无法提前保证抛出的对象是`Error` 子类，`useUnknownInCatchVariables` 选项确保在静态编译阶段提供错误提示。启用该标志`useUnknownInCatchVariables`后，您不需要额外的语法 (`err:unknown`) 或 `instanceof` 也不需要 `linter` 规则来尝试强制执行此行为。


### alwaysStrict

确保文件在 `ECMAScript` 严格模式下解析，并对每个源文件添加 `"use strict"`。

`ECMAScript strict` 模式是在 `ES5` 中引入的，它为 `JavaScript` 引擎的运行时行为进行调整从而提高性能，并且`严格模式`会引发一系列错误提示。

### noUnusedLocals

启用后，检查未使用的局部变量(只提示不报错)

```ts
const createKeyboard = (modelID: number) => {
  const defaultModelID = 23; //'defaultModelID' is declared but its value is never read.
  return { type: "keyboard", modelID };
};
```

### noUnusedParameters

启用后，检查未使用的函数参数(只提示不报错)

```ts
const createDefaultKeyboard = (modelID: number) => {
// 'modelID' is declared but its value is never read.
  const defaultModelID = 23;
  return { type: "keyboard", modelID: defaultModelID };
};
```

### exactOptionalPropertyTypes

使用该选项，必须先启用 `strictNullChecks`。

启用后，`typescript` 将会用更加严格的模式，对通过 `type` 或者 `interface` 声明的包含 `?` 的可选属性的检查。

```ts
interface Theme {
  colorThemeOverride?: 'dark' | 'light';
}
```

如果没有启用这个配置，那么 colorThemeOverride 的值可以是 `'dark' | 'light' | undefined`。如果启用这个配置，则值不能被显示的赋值 `undefined`。


### noImplicitReturns

启用后，`TypeScript` 将检查函数中的所有代码路径以确保他们返回值（只提示不报错）

```ts
function lookupHeadphonesManufacturer(color: "blue" | "black") { // 并非所有代码路径都返回值。ts(7030)
  if (color === "blue") {
    return "beats";
  } else {
    "bose";
  }
}
```

### noFallthroughCasesInSwitch


确保 `switch` 语句内的任何非空 `case` 都包含 `break`、`return` 或 `throw`。(只提示不报错)

```ts
const a: number = 6;
 
switch (a) {
  case 0: // switch 语句中的 Fallthrough 情况。ts(7029)
    console.log("even");
  case 1:
    console.log("odd");
    break;
}
```

### noUncheckedIndexedAccess

TypeScript 有一种方法可以通过索引签名来描述具有未知键但已知值的对象。

```ts
interface EnvironmentVars {
  NAME: string;
  OS: string;
 
  // Unknown properties are covered by this index signature.
  [propName: string]: string;
}
 
declare const env: EnvironmentVars;
 
// Declared as existing
const sysName = env.NAME;
const os = env.OS;
      
const os: string
 
// Not declared, but because of the index
// signature, then it is considered a string
const nodeEnv = env.NODE_ENV;  // const nodeEnv: string

console.log(nodeEnv.includes('prd'))
```

`TypeScript` 认为 `nodeEnv` 类型是 `string`，但运行时发现类型是 `undefined`，这可能是不安全的。

那么启用 `noUncheckedIndexedAccess` 选项后，会将添加 `undefined` 到类型中任何未声明的字段中。

```ts
declare const env: EnvironmentVars;
 
// Declared as existing
const sysName = env.NAME;
const os = env.OS;
      
const os: string
 
// Not declared, but because of the index
// signature, then it is considered a string
const nodeEnv = env.NODE_ENV; // const nodeEnv = string | undefined

console.log(nodeEnv.includes('prd')) // "nodeEnv"可能为"未定义"。ts(18048)
```


### noImplicitOverride 是否禁止子类隐式覆盖父类的成员

要求子类覆盖父类成员时，显示标记 `override`。以免父类修改了成员名称，而子类忘记修改，开启此规则后，子类隐式覆盖父类成员时会收到报错。例如，假设正在对音乐专辑进行建模：
```ts
class Album {
  download () {
    // Default behavior
  }
}

class SharedAlbum extends Album {
  download() {
    // Override to get info from many sources
  }
}
```

然后，当你对机器学习生成的播放列表的支持时，你重构了 `Album` 类使用 `setup` 替代了 `download`

```ts
class Album {
  setup() {
    // Default behavior
  }
}
 
class MLAlbum extends Album {
  setup() {
    // Override to get info from algorithm
  }
}
 
class SharedAlbum extends Album {
  download() {
    // Override to get info from many sources
  }
}
```

这种情况下，`TypeScript` 没有对类 `SharedAlbum` 重写父类 `download` 函数的警告。

启用 `noImplicitOverride` 后，通过关键字 `override` 可以确保 `子类` 重写的函数和 `父类` 保持同步。

下面是启用 `noImplicitOverride`选项的示例，可以看到缺少 `override` 时收到错误：

```ts
class Album {
  setup() {}
}
 
class MLAlbum extends Album {
  override setup() {}
}
 
class SharedAlbum extends Album {
  setup() {}
  // This member must have an 'override' modifier because it overrides a member in the base class 'Album'.
}
```




### noPropertyAccessFromIndexSignature 是否禁止从索引签名中用点操作符访问未知属性

对于`索引签名`中`未知属性`的访问，用点操作符（`obj.key`）访问可能会是无意识的一个错误，应该使用索引的方式（`obj[key]`）来告诉编译器，这是你确定要访问此未知属性。

如果没有启用该选项，`TypeScript` 将允许你使用 `点操作符` 来访问未定义的字段：

```ts
interface GameSettings {
  speed: "fast" | "medium" | "slow";
  quality: "high" | "low";
  // 允许任何未知字段类型值为 string 类型
  [key: string]: string;
}
 
const settings: GameSettings = {speed: "fast", quality: "high", username: 'sa'}
settings.speed;   // (property) GameSettings.speed: "fast" | "medium" | "slow"
settings.quality; // (property) GameSettings.quality: "high" | "low"
 
settings.username; // 允许在 settings 对象上访问未知的 key，并且类型为 string
```

启用该标志将引发错误，因为对`未知字段`使用了`点`操作符而不是`索引`的方式。

```ts
const settings: GameSettings = {speed: "fast", quality: "high", username: 'sa'}
settings.speed;
settings.quality;
 
settings.username; // 属性“username”来自索引签名，因此必须使用[“username”]访问它。ts(4111)
```

此标志的目的是在调用语法中表明您对`该属性存在`的`确定程度`;

### allowUnusedLabels 是否允许未标签存在

- undefined 向编辑器提供建议作为警告
- true 允许
- false 不允许，并给出错误警告

```ts
function verifyAge(age: number) {
  // Forgot 'return' statement
  if (age > 18) {
    verified: true; // Unused label.
  }
}
```

```ts
function verifyAge(age: number) {
  // Forgot 'return' statement
  if (age > 18) {
    verified: true; // Unused label.
  }
}
```

### allowUnreachableCode 是否允许出现死区代码（永远无法执行到达的代码）

- undefined 向编辑器提供建议作为警告
- true 允许
- false 不允许，并给出错误警告

```ts
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true; // error: Unreachable code detected.
}
```

## Completeness

### skipDefaultLibCheck
使用 `skipLibCheck` 替换该选项。跳过默认库声明文件的类型检查

### skipLibCheck

跳过声明文件的类型检查。

这可以节省编译时间，但会牺牲类型系统的准确性。例如，两个库可以以不一致的方式定义同一类型的两个副本。TypeScript不会对所有d.ts文件进行全面检查，而是会对你在应用源代码中特别引用的代码进行类型检查

最常见的一个例子，当 `node_modules` 中存在一个`库的类型`的`两个版本`，就该考虑使用 `skipLibCheck` 选项。

另外一种情况， 当你在 `TypeScript` 版本之间迁移时，你并不想处理这些导致node_modules和JS标准库出现问题的变更


## include

## exclude

## files


```json
{
    "files": [],                              // 指定需要被编译的文件列表。这里不能指定目录，只能是文件，可以省略.ts 后缀。适合需要编译的文件比较少的情况。默认值为 false；
    "include": [],                            // 指定需要编译的文件列表或匹配模式(glob)。include 可以通过通配符指定目录，如"src/**/*" 表示 src 下的所有文件。如果没有指定 files 配置，默认值为 ** ，即项目下所有文件；如果配置了 files，默认值为 [] 空数组；
    "exclude": [],                            // 在 include 圈定的范围内，排除掉一些文件。我们经常用它来排除编译输出目录、测试文件目录、一些生成文件的脚本等文件。默认值为 "node_modules,bower_componen"；
    "extends": "./tsconfig.base.json",       // 继承, 另一个 ts 配置文件。这在 monorepo 的代码组织中非常有用，不同的 package 可以通过 extends 继承通用的 ts 配置。用法示例："extends": "./common-tsconfig.json"。
    "references": [],                         // 引用, 引用项目 composite 选项设置为 true。项目中如果有多个相互独立的模块，可以使用这个属性来做分离。这样一个模块改变后，就只重新编译这个模块，其他模块不重新编译。编译时要改用tsc --build

    /* Completeness */
    "skipLibCheck": true                      // 跳过对所有.d.ts文件的类型检查
}
```