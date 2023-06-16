# Git 操作指南

## 初始化
```sh
git init
```

## 远程仓库
```sh
# 查看本地仓库映射的远程仓库地址
git remote -v
# 添加本地别名 origin 映射到 git@github.com:xxx/xxx.github.io.git
git remote add origin <url>
# 删除别名 origin 映射
git remote remove origin
```

## 分支管理

### 创建

```sh
# 创建分支
git branch <branchName>
# 创建并切换分支
git checkout -b <branchName>
```

### 切换

```sh
# checkout 命令集成多个功能，switch 为了拆分其切换功能
git checkout <branchName>
# 等同于checkout 切换分支功能
git switch <branchName>
```

### 删除
```sh
# 软删除（不可删除未合并至主分支的特性分支，控制台会抛错误提示）
git branch -d <branchName>
# 强删除（可删除未合并至主分支的特性分支）
git branch -D <branchName>
```

### 修改
```sh
# 修改分支名
git branch -m <branchOldName> <branchNewName>
```

## 标签管理

### 创建
```sh
# 创建标签
git tag <tagName>
# 创建带备注的标签
git tag <tagName> -m <message>
```

### 删除
```sh
# 删除本地单个标签
git tag -d <tagName>
# 删除本地所有标签
git tag -d $(git tag -l)
```

## 远程操作

### 分支
```sh
# 推送本地 test 分支至远程
git push origin -u <branchName>
```

```sh
# 本地 master 分支跟踪 远程 master分支
git branch -u origin/master master
```

### 标签
```sh
git tag <tagName>
# 推送标签至远程
git push origin <tagName>
# 删除远程标签
git push origin -d <tagName>
```

## 暂存

### 新增
```sh
git stash save <message>
```

### 使用暂存
```sh
# 使用最新一次暂存并删除
git stash pop
# 使用指定的暂存
git stash apply <index | stashName>
# 从暂存创建分支
git stash branch <branchName>
```

### 暂存列表
```sh
git stash list
```

### 删除
```sh
git stash drop <index | stashName>
# 清空暂存
git stash clear
```

## 日志
```sh
# 打印提交记录
git log
# 打印简化后的提交记录
git log --oneline
# 重要，如果提交记录被回滚了，只能通过reflog的记录来还原
git reflog <branchName>
```

## 提交
```sh
git commit -m <message>
# 合并了git add 和 git commit
git commit -am <message>
# 合并上次提交，并使用上次提交信息
git commit --amend --no-edit
# 合并上次提交，并使用当前提交信息
git commit --amend -m <message>
```

## 合并

### merge（建议关闭fast-forward）

fast-forward（默认）
```sh
git merge <branchName>
git merge <branchName> -m <message>
```

关闭fast-forward
```sh
git merge <branchName> --no-ff
# 压缩合并，可将n次提交合并成一次
git commit -m <message> --squash
# 合并某次提交，可以是其他分支上的提交
git cherry-pick <commitId>
```

### rebase（用于特性分支，禁止在环境分支上使用变基）

```sh
# 基于master最新版
git rebase master
# 解决完冲突
git rabase --continue
# 放弃变基
git rebase --abort
```

## 拉取
```sh
# 从远程下载最新版到本地
git fetch
# 从远程下载最新版并 merge 到本地
git pull
# 远程有更新且本地有提交
git pull origin --rebase
```

## 查错（二分查找）

```sh
# 开始查找
git bisect start <startCommitId> <endCommitId>
# 当前节点是否正确
git bisect <bad|good>
# 重新开始
git bisect reset
```

## 撤销

## Git 管道
### 操作符
**|**: 管道命令，用于将一串命令串联起来。前面命令的输出可以作为后面命令的输入，
**grep**: 搜索过滤命令。使用正则表达式搜索文本
**grep -E**: 匹配
**grep -v -E**: 排除匹配到的
**xargs**: 参数传递命令。用于将标准输入作为命令的参数传给下一个命令


### 批量删除
```sh
# 删除当前分支外的所有分支
git branch | xargs git branch -d

# 删除模糊匹配到的所有分支
git branch | grep 'dev*' | xargs git branch -d

# 删除指定分支的所有分支
git branch -a | grep -E 'master|develop' | xargs git branch -D

# 删除排除外的所有分支
git branch -a | grep -v -E 'master|develop' | xargs git branch -D
```
