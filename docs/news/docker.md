

```sh
docker image pull [image:version]
```

```sh
# -f 指定要使用的Dockerfile路径
# -t 镜像的名字及标签，通常 name:tag 或者 name 格式；可以在一次构建中为一个镜像设置多个标签
docker build -f ./Dockerfile -t [image:version]
```

启动
```sh
# 将容器的 8080 端口绑定到主机的 80 端口上
docker run -p 127.0.0.1:80:8080 [image]
```


保存镜像为文件
```sh
docker save -o [filename] [image]
```

## 操作容器

### 查看
```sh
docker container ls
docker container list
docker ps
```

### 终止容器
```sh
docker stop [containerId]
```

### 直接关闭容器
```sh
docker kill [containerId]
```

stop 和 kill 的主要区别是：
- stop 给予一定的关闭时间保存状态，关闭时间交由容器控制
- kill 直接关闭容器

### 启动容器
```sh
docker start [containerId]
```

### 重新启动容器
```sh
docker restart [containerId]
```
不包含容器文件系统的卸载与挂载操作，本质上docker restart不涉及文件系统的操作，因此restart命令并不是stop与start两个命令的顺序叠加。


### 删除容器
```sh
docker rm [containerId]
```
