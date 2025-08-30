# 使用OpenJDK 17作为基础镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建应用用户
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 复制JAR文件
COPY target/microservice-invoice-*.jar app.jar

# 设置文件权限
RUN chown appuser:appuser app.jar

# 切换到应用用户
USER appuser

# 暴露端口
EXPOSE 8083

# 设置JVM参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+UseContainerSupport"

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 