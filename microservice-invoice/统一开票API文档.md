# 统一开票API文档

## 概述

统一开票服务提供了完整的发票开具和查询功能，支持多种开票服务商集成，包括蓝字发票开具、红字发票申请和发票查询等功能。

**服务地址**: `http://localhost:8083/invoice`
**基础路径**: `/api/v1/invoice`

## 接口列表

### 1. 开具发票

#### 接口信息
- **URL**: `/api/v1/invoice/issue`
- **方法**: `POST`
- **Content-Type**: `application/json`
- **描述**: 根据油站配置的开票服务商进行开票，支持标准格式和业务系统格式，系统自动转换

#### 请求体
详见InvoiceRequestDTO定义，支持两种格式：
- 业务系统格式（oilInfo/retailInfo）
- 标准格式（details）

### 2. 获取发票下载地址

#### 接口信息
- **URL**: `/api/v1/invoice/download-url`
- **方法**: `POST` （原GET方法已改为POST）
- **Content-Type**: `application/json`
- **描述**: 根据发票号码或订单编码获取发票下载地址，二者至少提供一个

#### 请求体

| 参数名 | 类型 | 必填 | 描述 | 示例 |
|-------|------|------|-----|------|
| invoiceNo | String | 否 | 发票号码（与orderCode二选一） | 20250126000001 |
| orderCode | String | 否 | 订单编码（与invoiceNo二选一） | ORDER_DIESEL_001 |
| merchantId | Long | 是 | 商户ID | 2001 |

#### 请求示例

**通过发票号码查询：**
```json
{
  "invoiceNo": "20250126000001",
  "merchantId": 2001
}
```

**通过订单编码查询：**
```json
{
  "orderCode": "ORDER_DIESEL_001",
  "merchantId": 2001
}
```

#### 响应示例
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "invoiceNo": "20250126000001",
    "invoiceCode": "144001900111",
    "pdfUrl": "http://example.com/pdf/20250126000001.pdf",
    "ofdUrl": "http://example.com/ofd/20250126000001.ofd",
    "ewmUrl": "http://example.com/qr/20250126000001.png",
    "xmlUrl": "http://example.com/xml/20250126000001.xml"
  },
  "timestamp": "2024-01-26T12:00:00Z"
}
```

### 3. 查询发票

#### 接口信息
- **URL**: `/api/v1/invoice/query`
- **方法**: `POST` （原GET方法已改为POST）
- **Content-Type**: `application/json`
- **描述**: 根据发票号码或订单编码查询发票信息，二者至少提供一个

#### 请求体

| 参数名 | 类型 | 必填 | 描述 | 示例 |
|-------|------|------|-----|------|
| invoiceNo | String | 否 | 发票号码（与orderCode二选一） | 20250126000001 |
| orderCode | String | 否 | 订单编码（与invoiceNo二选一） | ORDER_DIESEL_001 |
| merchantId | Long | 是 | 商户ID | 2001 |

#### 请求示例

**通过发票号码查询：**
```json
{
  "invoiceNo": "20250126000001",
  "merchantId": 2001
}
```

**通过订单编码查询：**
```json
{
  "orderCode": "ORDER_DIESEL_001",
  "merchantId": 2001
}
```

#### 响应示例
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "invoiceNo": "20250126000001",
    "invoiceCode": "144001900111",
    "invoiceDate": "2024-01-26",
    "totalAmount": 636.10,
    "totalTax": 82.69,
    "totalAmountWithTax": 718.79,
    "buyerName": "江西省交投化石能源有限公司虚拟单位",
    "buyerTaxNo": "9X0001GGMACM2L8N6B",
    "sellerName": "测试销售方",
    "sellerTaxNo": "91360000158263012K",
    "status": "02",
    "pdfUrl": "http://example.com/pdf/20250126000001.pdf",
    "ofdUrl": "http://example.com/ofd/20250126000001.ofd"
  },
  "timestamp": "2024-01-26T12:00:00Z"
}
```

### 4. 申请红字确认单

#### 接口信息
- **URL**: `/api/v1/invoice/red-confirm`
- **方法**: `POST`
- **Content-Type**: `application/json`
- **描述**: 申请红字确认单

#### 请求体
使用InvoiceRequestDTO，必须包含原发票信息

### 5. 开具红字发票

#### 接口信息
- **URL**: `/api/v1/invoice/red-invoice`
- **方法**: `POST`
- **Content-Type**: `application/json`
- **描述**: 开具红字发票

#### 请求体
使用InvoiceRequestDTO，必须包含红字确认单号

### 6. 创建开票记录

#### 接口信息
- **URL**: `/api/v1/invoice/record/create`
- **方法**: `POST`
- **Content-Type**: `application/json`
- **描述**: 业务端创建开票记录，支持批量开票关联逻辑

#### 请求体
使用InvoiceRecordCreateRequest

## 接口变更记录

### 2025-01-26
- **变更内容**：
  1. 统一所有接口为JSON格式传参
  2. 查询接口支持根据订单编码查询
- **影响接口**：
  - `/api/v1/invoice/download-url`：
    - GET改为POST，参数改为JSON格式
    - 新增支持通过orderCode查询
    - invoiceNo和orderCode二选一，至少提供一个
  - `/api/v1/invoice/query`：
    - GET改为POST，参数改为JSON格式
    - 新增支持通过orderCode查询
    - invoiceNo和orderCode二选一，至少提供一个
- **新增/修改DTO**：
  - `InvoiceQueryDTO`：新增orderCode字段，添加自定义校验
- **新增Service方法**：
  - `getInvoiceDownloadUrlByOrderCode`：根据订单编码获取下载地址
  - `queryInvoiceByOrderCode`：根据订单编码查询发票
- **注意事项**：
  - 前端调用这两个接口需要相应调整请求方式和参数格式
  - 优先使用发票号码查询，当未提供发票号码时使用订单编码查询