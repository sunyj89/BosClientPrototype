# 构建阶段
FROM node:18-alpine as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:stable-alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 从构建阶段复制构建产物
COPY --from=build /app/build .

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 