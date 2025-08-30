# 发票管理服务 (microservice-invoice)

## 项目简介

发票管理服务是京东发票业务系统的核心微服务，负责处理发票的开具、查询、管理等业务功能。

## 技术栈

- **Java**: 17
- **Spring Boot**: 3.1.5
- **Spring Cloud**: 2022.0.4
- **MyBatis-Plus**: 3.5.7
- **MySQL**: 8.0+
- **Redis**: 7.0+
- **Maven**: 3.8+

## 功能特性

- 开票记录管理
- 发票明细管理
- 发票状态跟踪
- 支持多种发票类型
- 支持特定业务场景（建筑服务、不动产、运输等）

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Redis 7.0+

### 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd microservice-invoice
```

2. 创建数据库
```sql
CREATE DATABASE invoice DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. 执行初始化脚本
```bash
mysql -u root -p invoice < sql/init.sql
```

4. 修改配置文件
编辑 `src/main/resources/application-dev.yml`，配置数据库连接信息。

5. 启动应用
```bash
mvn spring-boot:run
```

### Docker部署

1. 构建镜像
```bash
mvn clean package
docker build -t microservice-invoice .
```

2. 运行容器
```bash
docker run -d -p 8083:8083 --name invoice-service microservice-invoice
```

## API文档

启动应用后，访问以下地址查看API文档：

- Swagger UI: http://localhost:8083/doc.html
- OpenAPI JSON: http://localhost:8083/v3/api-docs

## 主要接口

### 开票记录管理

- `GET /api/v1/invoice-records` - 分页查询开票记录列表
- `GET /api/v1/invoice-records/{id}` - 获取开票记录详情
- `GET /api/v1/invoice-records/by-order-code` - 根据订单编号获取开票记录

## 数据库设计

### 主要数据表

- `invoice_record` - 开票记录表
- `invoice_detail` - 发票明细表
- `invoice_traveler` - 出行人信息表
- `invoice_transport` - 运输明细表
- `invoice_construction` - 建筑服务特定要素表
- `invoice_real_estate_lease` - 不动产经营租赁特定要素表
- `invoice_real_estate_sale` - 不动产销售特定要素表

## 配置说明

### 环境配置

- `application-dev.yml` - 开发环境配置
- `application-test.yml` - 测试环境配置
- `application-prod.yml` - 生产环境配置

### 主要配置项

- 数据库连接配置
- Redis连接配置
- 服务端口配置
- 日志级别配置

## 开发规范

- 遵循阿里巴巴Java开发手册
- 使用统一的代码格式化配置
- 编写完整的单元测试
- 添加详细的API文档注解

## 部署说明

### 开发环境

```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

### 测试环境

```bash
mvn spring-boot:run -Dspring.profiles.active=test
```

### 生产环境

```bash
mvn spring-boot:run -Dspring.profiles.active=prod
```

## 监控与日志

- 健康检查: http://localhost:8083/actuator/health
- 应用信息: http://localhost:8083/actuator/info
- 日志级别: 可通过配置文件调整

## 常见问题

### 1. 数据库连接失败

检查数据库配置信息，确保数据库服务正常运行。

### 2. Redis连接失败

检查Redis配置信息，确保Redis服务正常运行。

### 3. 端口被占用

修改 `application.yml` 中的 `server.port` 配置。

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

如有问题或建议，请联系开发团队。 