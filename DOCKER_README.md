# BOS Client Prototype Docker 使用指南

本文档提供了使用Docker构建和运行BOS Client Prototype应用的详细说明。

## 前提条件

- 已安装 [Docker](https://www.docker.com/get-started)
- 基本的命令行知识

## 文件说明

项目包含以下与Docker相关的文件：

- `Dockerfile`: 用于构建Docker镜像的配置文件
- `.dockerignore`: 指定构建镜像时需要忽略的文件和目录
- `docker-commands.sh`: Linux/Mac系统下的Docker命令脚本
- `docker-commands.bat`: Windows系统下的Docker命令脚本
- `docker-compose.yml`: Docker Compose配置文件，用于简化容器管理

## 构建和运行步骤

### 方法一：使用Docker Compose（推荐）

如果已安装Docker Compose，可以使用以下命令：

```
# 构建并启动容器
docker-compose up -d

# 停止容器
docker-compose down

# 查看容器日志
docker-compose logs -f
```

### 方法二：使用提供的脚本

#### Windows系统

在命令提示符或PowerShell中运行：

```
# 构建镜像
docker-commands.bat build

# 运行容器
docker-commands.bat run

# 停止容器
docker-commands.bat stop

# 删除容器
docker-commands.bat remove

# 查看容器日志
docker-commands.bat logs
```

#### Linux/Mac系统

首先赋予脚本执行权限：

```
chmod +x docker-commands.sh
```

然后运行脚本：

```
# 构建镜像
./docker-commands.sh build

# 运行容器
./docker-commands.sh run

# 停止容器
./docker-commands.sh stop

# 删除容器
./docker-commands.sh remove

# 查看容器日志
./docker-commands.sh logs
```

### 方法三：直接使用Docker命令

#### 构建镜像

```
docker build -t bos-client-prototype:latest .
```

#### 运行容器

```
docker run -d -p 8080:80 --name bos-client bos-client-prototype:latest
```

#### 停止容器

```
docker stop bos-client
```

#### 删除容器

```
docker rm bos-client
```

#### 查看容器日志

```
docker logs -f bos-client
```

## 访问应用

成功构建并运行容器后，可通过浏览器访问以下地址使用应用：

```
http://localhost:8080
```

## 常见问题解答

### 1. 端口被占用

如果8080端口已被占用，可以修改端口映射：

#### 使用Docker Compose

编辑 `docker-compose.yml` 文件，修改端口映射：

```yaml
ports:
  - "<新端口>:80"
```

#### 使用Docker命令

```
docker run -d -p <新端口>:80 --name bos-client bos-client-prototype:latest
```

### 2. 修改应用后重新构建

对应用进行修改后，需要重新构建镜像并重新创建容器：

#### 使用Docker Compose

```
docker-compose down
docker-compose up -d --build
```

#### 使用Docker命令

```
# 停止并删除现有容器
docker stop bos-client
docker rm bos-client

# 重新构建镜像
docker build -t bos-client-prototype:latest .

# 创建新容器
docker run -d -p 8080:80 --name bos-client bos-client-prototype:latest
```

### 3. 查看容器内文件

如需检查容器内文件，可以执行：

```
docker exec -it bos-client /bin/sh
```

## 注意事项

- 镜像构建过程中会下载依赖包，首次构建可能需要较长时间
- 确保 Docker 守护进程已经启动
- 在生产环境中部署时，建议使用更安全的配置和环境变量管理
- 如果遇到权限问题，在Linux/Mac系统上可能需要使用 `sudo` 命令 