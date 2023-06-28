# package.json 中 module、main、browser 的优先级

## 前言

前端开发中使用到 `npm` 包那可算是家常便饭，而使用到 `npm` 包总免不了接触到 `package.json` 包配置文件。

那么这里就有一个问题，当我们在不同环境下 `import` 一个 `npm` 包时，到底加载的是 `npm` 包的哪个文件？

老司机们很快地给出答案：**`main` 字段中指定的文件**。

然而我们清楚 `npm` 包其实又分为：只允许在客户端使用的，只允许造服务端使用的，浏览器/服务端都可以使用。  
如果我们需要开发一个 `npm` 包同时兼容支持 web端 和 server 端，**需要在不同环境下加载npm包不同的入口文件**，显然一个 `main` 字段已经不能够满足我们的需求，这就衍生出来了 `module` 与 `browser` 字段。

本文就来说下 这几个字段的使用场景，以及同时存在这几个字段时，他们之间的优先级。

## 搭建测试环境

```sh
# 创建项目
mkdir package-demo && cd package-demo && code .
# 初始化npm
npm init -y
# 安装依赖
npm i webpack-cli -D
# 初始化webpack
npx webpack init
```

初始化webpack
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a79733145f24f0b9100a517944e4124~tplv-k3u1fbpfcp-watermark.image?)

根目录下的 package.json 文件如下：
```json
{
  "name": "my-webpack-project",
  "version": "1.0.0",
  "description": "My webpack project",
  "main": "index.js",
  "scripts": {
    "serve": "webpack serve"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.22.5",
    "@babel/preset-env": "^7.22.5",
    "@webpack-cli/generators": "^3.0.7",
    "babel-loader": "^9.1.2",
    "html-webpack-plugin": "^5.5.3",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  },
  "workspaces": [
    "packages/*"
  ]
}

```


2、创建packages/pk1文件夹
```txt
├── packages
    ├── pk1
        ├── index.js        
        ├── index.mjs.js
        ├── index.browser.js
        ├── package.json

```

```js
// index.js
exports.log = function () {
    console.log('this is main entry')
}
```


```js
// index.mjs.js
export const log = function () {
    console.log('this is module entry')
}
```

```js
// index.browser.js
export const log = function () {
    console.log('this is browser entry')
}
```

```json
{
  "name": "pk1",
  "version": "1.0.0",
  "main": "index.js",
  "module": "index.mjs.js",
  "browser": "index.browser.js",
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

3、在 src/index.js中引入依赖包 `pk1`, 我们先以 `commonjs` 的方式引入
```js
const { log } = require('pk1')
log()
```
 
这是我们好奇依赖包 `pk1` 是怎么来的？
 
下面我们修改修改根目录下的package.json，添加字段 `workspaces`，代码如下：
 
```json
{
  "name": "my-webpack-project",
  "version": "1.0.0",
  "description": "My webpack project",
  "main": "index.js",
  "scripts": {
    "serve": "webpack serve"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.22.5",
    "@babel/preset-env": "^7.22.5",
    "@webpack-cli/generators": "^3.0.7",
    "babel-loader": "^9.1.2",
    "html-webpack-plugin": "^5.5.3",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  },
  "workspaces": [
    "packages/*"
  ]
}

```
具体对 `workspaces` 字段解释，请参考我的博客package.json一文
    
配置完成后，执行`npm link ./packages/pk1`

## 测试

我们分两个场景进行测试，一个是 `node环境`，另一个是 `浏览器环境`

### node 环境

回顾一下，我们当前src/index.js是通过commonjs对模块进行引入的
```js
const { log } = require('pk1')
log()
```

下面我们执行代码 `node index.js`, 发现打印出来的是 `this is main entry`，也就是我们 `main` 字段指定的入口。下面我们把 引用方式改成 es6，代码如下:
```
import { log } from 'pk1';
log()
```
改代码的同时，我们在根目录的package.json添加`"type": "module"`, 或者把index.js改成index.mjs，告诉node我要用 `esm` 做模块解析。

接着我们同样执行`node index.js`， 发现打印的还是 `this is main entry`。

所以得出第一个结论，在 `node环境` 不论用 `ESM` 或 `commonjs`都是优先采用 `main` 字段作为入口。

那么如果我们把 `main` 字段给删了呢？会不会采用 `module` 或 `browser`字段指定的入口。

接下来我们删除 `packages/pk1/package.json` 中的 `main` 字段，然后接着执行 `node index.js`，发现打印出来的仍是 `this is main entry`。最后我们删除`packages/pk1/index.js`，发现控制台报错了。

这样得出了第二个结局，在 `node环境` 只会使用 `main` 字段指定的入口文件，如果没有配置 `main` 字段，默认采用当前包根目录下的 index.js。

测试完，我们恢复删除的`"main": "index.js"`, 恢复`packages/pk1/index.js`文件， 删除刚才在package.json 中添加 `"type": "module"`


### 浏览器环境

首先我们启动项目`npm run serve`，发现控制台打印的 `this is browser entry`。

得出第一个结论，在 `浏览器环境` 下 `browser` 的优先级最高

接下来我们删除 `packages/pk1/package.json` 中的 `browser` 字段并重启项目，发现这次控制台打印的是 `this is module entry`

得出第二个结论，在 `浏览器环境` 下 `module` 的优先级仅次于 `browser`。然后，我们删除 `module` 字段并重启项目，这次不出意外打印的是 `this is main entry`

### webpack 的 resolve.mainFields 重新配置三个字段的优先级. 例如下面配置：
```js
// webpack.config.js
{
    resolve: {
        mainFields: ['main', 'module', 'browser']
    },
}
```
我们重新测试，会发现优先级是按照 `mainFields` 字段配置从左往右的顺序执行

## 总结一下
1、在 `node` 环境中 不论是使用 `ESM` 或 `commonjs` 都只会使用 `main` 字段指定的入口，如果没有配置`main` 字段，则默认使用包根目录下的index.js，如果不存在该文件则报错。

2、在 `浏览器` 环境中，优先级如下 `browser` > `module` > `main`

3、如果配置了webpack的 `resolve.mainFields`，优先级被重新定义
