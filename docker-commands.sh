#!/bin/bash

# 构建镜像
build_image() {
  echo "构建Docker镜像..."
  docker build -t bos-client-prototype:latest .
}

# 运行容器
run_container() {
  echo "运行Docker容器..."
  docker run -d -p 8080:80 --name bos-client bos-client-prototype:latest
}

# 停止容器
stop_container() {
  echo "停止Docker容器..."
  docker stop bos-client
}

# 删除容器
remove_container() {
  echo "删除Docker容器..."
  docker rm bos-client
}

# 查看容器日志
view_logs() {
  echo "查看容器日志..."
  docker logs -f bos-client
}

# 显示帮助信息
show_help() {
  echo "使用方法: ./docker-commands.sh [命令]"
  echo "命令:"
  echo "  build    - 构建Docker镜像"
  echo "  run      - 运行Docker容器"
  echo "  stop     - 停止Docker容器"
  echo "  remove   - 删除Docker容器"
  echo "  logs     - 查看容器日志"
  echo "  help     - 显示帮助信息"
}

# 处理命令行参数
case "$1" in
  build)
    build_image
    ;;
  run)
    run_container
    ;;
  stop)
    stop_container
    ;;
  remove)
    remove_container
    ;;
  logs)
    view_logs
    ;;
  help)
    show_help
    ;;
  *)
    show_help
    ;;
esac 