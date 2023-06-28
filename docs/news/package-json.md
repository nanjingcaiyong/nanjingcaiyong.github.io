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
- type
- url 仓库地址

## type
- commonjs
- module

### bugs

## 依赖配置

### packageManager

包管理工具

### devDependencies

开发依赖

### dependencies

生产依赖

### peerDependencies

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


### exports

### types
