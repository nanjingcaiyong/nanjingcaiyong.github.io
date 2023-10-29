# node 的全局对象和浏览器全局对象区别

## 全局对象

`js` 中不使用 `var` 声明的变量，它会被作为全局对象的属性。在浏览器中全局对象是 `window`

```js
name = 'win';
console.log(window.name); // win
```

`node` 中同样不使用 var 声明变量

```js
name = 'node';
console.log(global.name); // node
```

## this

在浏览器环境下普通函数的 `this` 总是指向调用该函数的对象

最外层的对象就是 `window`。

```js
console.log(this); // Window
console.log(this === window); // true

this.name = 'win';
function test () {
  console.log(this.name); // win
}
test()
```


在 node 环境中，我们会认为 node 只是把全局变量的名字由 `window` 换成了 `global`。

```js
global.name = 'node';
function test () {
  console.log(this.name); // node
}
test()
```

可是，这不代表 node 中仅仅是把全局对象的名字改为 `global` 这么简单

```js
this.name = 'node';
console.log(this === global); // false

function test () {
  console.log(this === global); // true
  console.log(this.name); // undefined
}
test();
```

也就是说在`node环境`中，在 `最外层的this` 不等于 `global`，但是 test 函数的 this 依旧指向 global

这是因为最外层的 this 并不是全局对象 global，而是 `module.exports`

```js
console.log(module.exports === this); // true
```

总结：node 中最外层的 this 指向 module.exports。而在最外层调用函数时候，会讲函数中的 this 指向 global