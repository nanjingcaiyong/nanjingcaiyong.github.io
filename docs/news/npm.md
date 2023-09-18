# 

## 缓存

查看缓存目录

```sh
npm config get cache
```

设置缓存路径

```sh
npm config set cache <path>
```

## 全局


设置全局安装路径

```sh
npm config set prefix <path>
```

## 配置镜像

- 通过 `config` 命令
  ```sh
  npm config set registry https://registry.npm.taobao.org
  ```
- 使用 `nrm`
  ```sh
  # 添加registry地址
  nrm add taobao https://registry.npm.taobao.org
  # 切换
  nrm use taobao
  ```

- 编辑 `~/.npmrc`
  ```txt
  registry = https://registry.npm.taobao.org
  ```


