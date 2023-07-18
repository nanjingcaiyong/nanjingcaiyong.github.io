# 如何在 ESM 中的 使用__dirname 和 __filename

## commonjs
```js
console.log(__dirname, __filename)
```

## esm

### import.meta.url

`import.meta` 包含当前模块的一些信息，其中 `import.meta.url` 表示当前模块的 `file:` 绝对路径，拿到这个绝对路径我们就可以配合其他 API 来实现 `__filename` 和 `__dirname`。

代码如下：
```js
console.log(import.meta.url);
```
运行会得到一个基于 file 协议的 URL：`file:///Users/cy/Desktop/demos/test.js`


### fileURLToPath

接下来需要把 file 协议转换成路径，需要借助 Node.js 内部 url 模块的 fileURLToPath API。

运行得到路径：`/Users/cy/Desktop/demo/index.js`。


最终实现代码如下：
```js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname, __filename)
```
