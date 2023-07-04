

## 声明文件

声明文件输出两种方式
- 1、库的代码是通过 `ts` 写的，那么在使用 `tsc` 命令将ts转换为js 时候，添加 `declaration` 选项，就可以同时也生成 `.d.ts` 声明文件了。
- 2、库代码通过 `js` 写的，那么这个时候就需求手动为库添加 声明文件，比如我们为三方库单独添加声明文件


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


## cli

### tsx

### tsc



## 声明文件

```json
{
    "compilerOptions": {
      "baseUrl": ".",
      "declarationDir": "./dist/types", // 执行 tsc 输出的声明文件目录
      "noEmit": false,                  // 是否输出声明文件。true: 不生成声明文件，false: 生成声明文件

      "experimentalDecorators": true,   // 是否启用装饰器
    }
}
```