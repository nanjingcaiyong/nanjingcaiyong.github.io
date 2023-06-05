# `vitepress-starter`

## 安装
```bash
npm i
```

## 版本控制
示例：[major].[minor].[patch]

### 第一次生成变更日志
```bash
npm run release -- --first-release
```

### 标准版本
```bash
npm run release
```

### 预发布版本
```bash
npm run release -- --prerelease
```
版本标记为：1.0.1-0


如果预发布需要包含alpha前缀：
```bash
npm run release -- --prerelease alpha
```
版本标记为：1.0.1-alpha.0


### 目标版本
```bash
npm run release -- --release-as minor #或者
npm run release -- --release-as 1.1.0
```
获得版本标记为1.1.0，而不是自动生成的版本1.0.1