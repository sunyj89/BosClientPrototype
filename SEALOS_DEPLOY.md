# 在Sealos上部署BOS客户端原型

本文档提供了如何将BOS客户端原型部署到Sealos平台的详细指南。

## 方法一：使用Sealos Devbox（推荐）

Sealos Devbox是一个云端开发环境，可以直接在云端构建和部署应用。

### 步骤1: 创建Devbox环境

1. 登录Sealos平台 (https://cloud.sealos.io)
2. 打开Devbox应用
3. 点击"新建项目"
4. 选择以下配置:
   - 环境类型: Node.js
   - 版本: 18
   - 名称: bosclient (或您喜欢的任何名称)
   - 资源配置: 推荐2核4G以上
   - 存储: 默认20G即可
   - 公网访问: 选择"启用"
   - 端口: 80

### 步骤2: 导入代码

1. 在Devbox环境创建成功后，使用Git导入代码:
   ```bash
   git clone https://github.com/sunyj89/BosClientPrototype.git
   cd BosClientPrototype
   ```

2. 安装依赖并构建项目:
   ```bash
   npm install
   npm run build
   ```

### 步骤3: 使用endpoint.sh配置部署

1. 确保您已经创建了`endpoint.sh`文件（本仓库已包含）
2. 在Devbox控制台点击"发布版本"
3. 填写版本号（例如v1.0.0）和描述
4. 点击"发布"
5. 发布完成后，点击"部署应用"
6. 在部署页面确认配置，然后点击"部署"

完成以上步骤后，您的应用将在几分钟内部署完成，并可通过分配的域名访问。

## 方法二：使用Docker镜像部署

如果您更喜欢使用Docker镜像方式部署，可以按照以下步骤操作。

### 步骤1: 构建Docker镜像

1. 在本地构建Docker镜像:
   ```bash
   docker build -t bos-client-prototype:latest .
   ```

2. 将镜像推送到Sealos镜像仓库:
   ```bash
   # 登录镜像仓库
   docker login registry.sealos.io -u yourusername -p yourpassword
   
   # 标记镜像
   docker tag bos-client-prototype:latest registry.sealos.io/yourusername/bos-client-prototype:latest
   
   # 推送镜像
   docker push registry.sealos.io/yourusername/bos-client-prototype:latest
   ```

### 步骤2: 在Sealos创建应用

1. 登录Sealos平台
2. 打开"应用"或"应用部署"功能
3. 点击"从镜像部署"
4. 输入镜像地址: `registry.sealos.io/yourusername/bos-client-prototype:latest`
5. 设置应用名称: `bosclient`
6. 设置暴露端口: `80`
7. 点击"部署"

## 方法三：使用部署脚本（适用于本地开发环境）

本仓库提供了`deploy-to-sealos.sh`脚本，可以简化部署过程。

1. 确保脚本有执行权限:
   ```bash
   chmod +x deploy-to-sealos.sh
   ```

2. 运行脚本:
   ```bash
   ./deploy-to-sealos.sh
   ```

3. 按照脚本提示输入Sealos用户名和密码
4. 脚本会自动构建、推送镜像并提供后续部署步骤

## 注意事项

1. 确保您拥有Sealos平台的有效账户
2. 部署后可能需要几分钟时间应用才能完全启动
3. 如果应用无法访问，请检查Sealos平台上的日志信息

## 调试与故障排除

如果您在部署过程中遇到问题，可以尝试以下方法：

1. 查看Sealos平台上的应用日志
2. 确认镜像构建是否成功
3. 验证端口配置是否正确
4. 检查网络连接是否正常

如需更多帮助，请参考Sealos官方文档或联系管理员。 