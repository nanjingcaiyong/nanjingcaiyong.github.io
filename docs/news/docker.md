
# Docker 和 docker-compose
## 基础知识

### 容器（container）

### 镜像（iamge）

### 仓库（Repository）

## 常用命令

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


## Dockerfile

### FROM 
第一条指令必须是 `FROM` 指令，并且如果在同一个 `Dockerfile` 中创建多个镜像时，可以使用多个 `FROM` 指令（每个镜像一次）

```txt
# V1.0
FROM node:latest
```

### MAINTAINER

维护者信息

```txt
# V1.0
FROM node:latest
MAINTAINER cy18651600452@gmail.com
```

### RUN 
每条指令将在当前镜像基础上执行，并提交为新的镜像，可以用 `\` 换行

```txt
# V1.0
FROM node:latest
MAINTAINER cy18651600452@gmail.com
RUN npm i -g pnpm
```

### CMD 
指定启动容器时执行的命令，每个 `Dockerfile` 只能有一条 `CMD` 指令，如果指定了多条指令，则最后一条执行

### EXPOSE
告诉 `Docker` 服务器端暴露端口，在`容器` 启动时需要通过 `-p` 做端口映射

### ENV
指定环境变量，会被 `RUN` 指令使用，并在容器运行时保存

### ADD

复制指定的到容器中，可以是 `Dockerfile` 所在的目录的一个相对路径。可以是 `URL`，也可以是`tar.gz`（自动解压）

### COPY

复制本地主机的（为`Dockerfile所在目录的相对路径`）到容器中（当使用本地目录为源目录时推荐使用 `COPY`）

### ENTRYPOINT
配置容器启动后执行的命令，并且不可被 `docker run` 提供的参数覆盖（每个 `Dockerfile` 中只能有一个 `ENTTRYPOINT`，当指定多个时，只有最后一个起效）

### VOLUME
创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要保持的数据等


### USER
指定运行容器时的用户名或UID，后续的 `RUN` 也会使用指定用户

### WORKDIR
为后续的`RUN`、`CMD`、`ENTRYPOINT` 指令配置工作目录（可以同时使用多个 `WORKDIR` 指令，后续命令如果参数是相对路径，则会基于之前命令指定的路径

### ONBUILD
配置当所创建的镜像作为其他新创建镜像的基础镜像时，所执行的操作命令





## 案例

### 启动 vue 项目