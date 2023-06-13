# npm、yarn、pnpm对比

## npm

### 经历两个主要版本：v2 和 v3

**v2版本 采用树型依赖关系**

缺点：
- 包经常创建太深的依赖树，这会导致 Windows 上出现长目录路径问题
- 包在不同的依赖项中需要时被多次复制粘贴

**v3版本 采用平铺依赖**

优点（相对npm\@2）
- 节省了相同依赖多次复制的空间

缺点
- **幽灵依赖**（模块可以访问它们不依赖的包。比如`包A`依赖`包B`，安装`包A`后`包B`平铺在node\_modules的根目录下，然后开发过程中代码可以随意引入`包B`且不会报错；但是uninstall`包A`后虽然`包B`仍存在，由于package.json中没有`包B`的引用，一旦执行`npm i`后，`包B`就会被删除，导致程序异常）
- **相同依赖不同版本**（比如`包A`依赖`包B@1.0`、`包C`依赖`包B@2.0`。平铺逻辑是先判断上层有没有相同依赖，没有则平铺到上层node\_modules下；如果有且版本不同则会安装在父依赖包的node\_modules下，依赖关系如下：）
        ├─ node_modules
        │  ├─ A
        │  ├─ B@1.0
        │  └─ C
        │  │  └─ node_modules
        │  │  │  └─ B@2.0
- 扁平化依赖树的算法非常复杂

## yarn

缺点：
- 与 npm 相同的扁平node\_modules结构

## pnpm

优点：

-  硬链接取代复制粘贴（npm 和 yarn都是将包缓存在全局引用的时候再逐个复制粘贴到项目中），节约磁盘空间
-  仍然采用树形依赖关系，算法简单提高安装速度
-  没有幽灵依赖


## 注意

在 pnpm 升级到 v7 可能会出现如下报错

```text
Run "pnpm setup" to create it automatically, or set the global-bin-dir setting, or the PNPM_HOME env variable. The global bin directory should be in the PATH.
```

通过执行以下命令可解决
```sh
source ~/.zshrc
```


