# 创建一个vscode 插件

## 文档

- vscode 扩展[仓库地址](https://marketplace.visualstudio.com/)

## 安装环境

安装一个脚手架工具yeoman
```sh
npm install -g yo
```

安装 vscode 扩展 的yeoman生成器
```sh
npm install -g generator-code
```


## 创建项目
```sh
yo code myExtensionProject
```


## 编码

在 `extension.js` 中实现核心逻辑

```js

```

在 `package.json` 中配置对应的信息


```txt
配置说明：
name: 项目名 
displayName: 插件名 
description: 插件描述 
version: 版本号 
publisher: 发布者id 
author: 作者 
engines>vscode: vscode版本 
categories: 类别 
activationEvents: 扩展的激活事件 
main: 主入口 
contributes>commands: 配置命令 
contributes>keybindings: 配置快捷键 
```

## 发布

### 本地打包

安装vsce

```sh
npm i vsce -g
```

### 发布到应用市场
```sh
vsce login rich
```

```sh
vsce publish
```