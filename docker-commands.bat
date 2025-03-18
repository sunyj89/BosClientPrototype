@echo off
setlocal

if "%1"=="" goto help
if "%1"=="build" goto build
if "%1"=="run" goto run
if "%1"=="stop" goto stop
if "%1"=="remove" goto remove
if "%1"=="logs" goto logs
if "%1"=="help" goto help

:build
echo 构建Docker镜像...
docker build -t bos-client-prototype:latest .
goto end

:run
echo 运行Docker容器...
docker run -d -p 8080:80 --name bos-client bos-client-prototype:latest
goto end

:stop
echo 停止Docker容器...
docker stop bos-client
goto end

:remove
echo 删除Docker容器...
docker rm bos-client
goto end

:logs
echo 查看容器日志...
docker logs -f bos-client
goto end

:help
echo 使用方法: docker-commands.bat [命令]
echo 命令:
echo   build    - 构建Docker镜像
echo   run      - 运行Docker容器
echo   stop     - 停止Docker容器
echo   remove   - 删除Docker容器
echo   logs     - 查看容器日志
echo   help     - 显示帮助信息

:end
endlocal 