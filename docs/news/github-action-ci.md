

## 创建
```sh
mkdir .github/workflows
touch ci.yml
```

## 字段

### name 
```txt
on: Github Action Demo
```

name字段是 workflow 的名称。如果省略该字段，默认为当前 workflow 的文件名。

### on 

on字段指定触发 workflow 的条件，通常是某些事件。
```txt
on: push
```

上面代码指定，push事件触发 workflow。

on字段也可以是事件的数组。

```txt
on: [push, pull_request]
```

上面代码指定，push事件或pull_request事件都可以触发 workflow。

完整的事件列表，请查看官方文档。除了代码库事件，GitHub Actions 也支持外部事件触发，或者定时运行。
