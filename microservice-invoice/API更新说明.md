# API更新说明

## 概述

为了提高代码可读性和维护性，我们对发票管理服务的字段名进行了标准化重命名。本文档说明了API接口的相关变更。

## 字段名变更说明

### 请求参数变更

| 原参数名 | 新参数名 | 说明 |
|---------|----------|------|
| fpqqlsh | orderCode | 发票请求流水号(内部订单编号) |
| lzfpbz | invoiceFlag | 蓝字发票标志 |
| fppz | invoiceType | 发票票种 |
| gmfmc | buyerName | 购买方名称 |

### 响应字段变更

| 原字段名 | 新字段名 | 说明 |
|---------|----------|------|
| fpqqlsh | orderCode | 发票请求流水号(内部订单编号) |
| lzfpbz | invoiceFlag | 蓝字发票标志 |
| fppz | invoiceType | 发票票种 |
| gmfmc | buyerName | 购买方名称 |
| hjje | totalAmount | 合计金额 |
| hjse | totalTax | 合计税额 |
| jshj | totalAmountWithTax | 价税合计 |
| kpr | drawerName | 开票人 |

## API接口变更

### 1. 查询参数变更

#### 分页查询开票记录列表
- **接口**: `GET /api/v1/invoice-records`
- **变更内容**: 查询参数字段名更改

**原请求参数**:
```json
{
  "fpqqlsh": "INV202401010001",
  "lzfpbz": "0",
  "fppz": "01",
  "gmfmc": "测试公司"
}
```

**新请求参数**:
```json
{
  "orderCode": "INV202401010001",
  "invoiceFlag": "0",
  "invoiceType": "01",
  "buyerName": "测试公司"
}
```

### 2. 响应字段变更

#### 分页查询响应示例

**原响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 2,
    "totalPages": 1,
    "list": [
      {
        "id": 1,
        "fpqqlsh": "INV202401010001",
        "lzfpbz": "0",
        "fppz": "01",
        "gmfmc": "测试公司A",
        "hjje": 1000.00,
        "hjse": 130.00,
        "jshj": 1130.00,
        "kpr": "张三"
      }
    ]
  }
}
```

**新响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 2,
    "totalPages": 1,
    "list": [
      {
        "id": 1,
        "orderCode": "INV202401010001",
        "invoiceFlag": "0",
        "invoiceType": "01",
        "buyerName": "测试公司A",
        "totalAmount": 1000.00,
        "totalTax": 130.00,
        "totalAmountWithTax": 1130.00,
        "drawerName": "张三"
      }
    ]
  }
}
```

### 3. 接口路径变更

#### 根据订单编号查询接口
- **原接口**: `GET /api/v1/invoice-records/by-fpqqlsh?fpqqlsh={fpqqlsh}`
- **新接口**: `GET /api/v1/invoice-records/by-order-code?orderCode={orderCode}`

**原请求示例**:
```
GET /api/v1/invoice-records/by-fpqqlsh?fpqqlsh=INV202401010001
```

**新请求示例**:
```
GET /api/v1/invoice-records/by-order-code?orderCode=INV202401010001
```

## Swagger文档更新

所有接口的Swagger文档已经更新，包括：

1. **参数描述更新**: 使用更直观的英文字段名
2. **示例值更新**: 更新了所有参数和响应的示例值
3. **接口说明更新**: 更新了接口的描述信息

## 兼容性说明

### 向后兼容性
- ⚠️ **不兼容**: 由于字段名发生变更，旧版本的客户端需要更新
- ✅ **接口路径**: 除`by-fpqqlsh`改为`by-order-code`外，其他路径保持不变
- ✅ **HTTP方法**: 所有HTTP方法保持不变
- ✅ **响应格式**: 响应的整体结构保持不变，仅字段名变更

### 迁移建议

1. **客户端更新**: 更新客户端代码中的字段名映射
2. **测试验证**: 在测试环境验证所有接口调用
3. **文档同步**: 更新相关的接口文档和使用说明

## 数据迁移

### 数据库变更
- 数据库表结构已同步更新字段名
- 历史数据保持不变，字段映射关系已更新

### 注意事项
1. 确保所有客户端都已更新字段名映射
2. 在生产环境部署前，先在测试环境进行完整验证
3. 准备回滚方案，以防出现兼容性问题

## 联系方式

如有任何问题或需要支持，请联系开发团队。

---

**更新时间**: 2024-01-01  
**版本**: v1.0.0  
**负责人**: 开发团队