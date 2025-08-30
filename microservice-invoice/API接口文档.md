# 开票记录管理 API接口文档

## 概述

开票记录管理提供了完整的发票管理功能，包括分页查询开票记录列表和获取开票记录详情等功能。

**服务地址**: `http://localhost:8083/invoice`

## 接口列表

### 1. 分页查询开票记录列表

#### 接口信息
- **URL**: `/api/v1/invoice-records`
- **方法**: `GET`
- **描述**: 根据条件分页查询开票记录列表，默认查询最近3个月的数据

#### 查询参数

| 参数名 | 类型 | 必填 | 默认值 | 描述 | 示例 |
|-------|------|------|-------|-----|------|
| page | Integer | 否 | 1 | 当前页码，必须大于0 | 1 |
| pageSize | Integer | 否 | 10 | 每页数量，必须大于0 | 10 |
| userId | Long | 否 | - | 用户ID | 1001 |
| orderCode | String | 否 | - | 订单编号（支持模糊查询） | INV202401010001 |
| invoiceNo | String | 否 | - | 发票号码（支持模糊查询） | 25997000000170129316 |
| buyerPhone | String | 否 | - | 购买方电话（支持模糊查询） | 13800138000 |
| createTimeStart | String | 否 | - | 创建开始时间 (格式: yyyy-MM-dd) | 2024-01-01 |
| createTimeEnd | String | 否 | - | 创建结束时间 (格式: yyyy-MM-dd) | 2024-12-31 |
| invoiceDateStart | String | 否 | - | 开票开始日期 (格式: yyyy-MM-dd) | 2024-01-01 |
| invoiceDateEnd | String | 否 | - | 开票结束日期 (格式: yyyy-MM-dd) | 2024-12-31 |
| invoiceStatus | String | 否 | - | 发票状态：00-待开票，01-开票中，02-开票成功，03-开票失败 | 02 |
| merchantId | Long | 否 | - | 商户ID | 1001 |
| sortBy | String | 否 | createdTime | 排序字段：orderCode、userId、merchantId、buyerName、totalAmount、totalAmountWithTax、invoiceStatus、invoiceDate、createdTime、updatedTime | createdTime |
| sortOrder | String | 否 | desc | 排序方向：asc、desc | desc |

#### 请求示例

```bash
GET /api/v1/invoice-records?page=1&pageSize=10&userId=1001&invoiceStatus=02&createTimeStart=2024-01-01&createTimeEnd=2024-12-31
```

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3,
    "list": [
      {
        "id": 1,
        "orderCode": "INV202401010001",
        "userId": 1001,
        "merchantId": 1001,
        "invoiceFlag": "0",
        "invoiceType": "01",
        "buyerName": "测试公司A",
        "totalAmount": 1000.00,
        "totalTax": 130.00,
        "totalAmountWithTax": 1130.00,
        "drawerName": "张三",
        "invoiceStatus": "02",
        "invoiceNo": "25997000000170129316",
        "invoiceCode": "144001900111",
        "invoiceDate": "2024-01-15",
        "errorMsg": "",
        "retryCount": 0,
        "pdfUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/pdf",
        "sjly": "系统生成",
        "ofdUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/ofd",
        "ewmUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/qr",
        "xmlUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/xml",
        "createdTime": "2024-01-01T10:00:00",
        "updatedTime": "2024-01-01T10:00:00"
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### 响应字段说明

| 字段名 | 类型 | 描述 |
|-------|------|-----|
| id | Long | 主键ID |
| orderCode | String | 发票请求流水号(内部订单编号) |
| userId | Long | 用户ID |
| merchantId | Long | 商户ID |
| invoiceFlag | String | 蓝字发票标志：0-蓝字发票，1-红字发票 |
| invoiceType | String | 发票票种：01-数电专，02-数电普 |
| buyerName | String | 购买方名称 |
| totalAmount | BigDecimal | 合计金额 |
| totalTax | BigDecimal | 合计税额 |
| totalAmountWithTax | BigDecimal | 价税合计 |
| drawerName | String | 开票人 |
| invoiceStatus | String | 发票状态：00-待开票，01-开票中，02-开票成功，03-开票失败 |
| invoiceNo | String | 发票号码 |
| invoiceCode | String | 发票代码 |
| invoiceDate | LocalDate | 开票日期 |
| errorMsg | String | 错误信息 |
| retryCount | Integer | 重试次数 |
| pdfUrl | String | PDF文件访问地址 |
| sjly | String | 数据来源 |
| ofdUrl | String | OFD文件访问地址 |
| ewmUrl | String | 二维码访问地址 |
| xmlUrl | String | XML文件访问地址 |
| createdTime | LocalDateTime | 创建时间 |
| updatedTime | LocalDateTime | 更新时间 |

### 2. 根据ID查询开票记录详情

#### 接口信息
- **URL**: `/api/v1/invoice-records/{id}`
- **方法**: `GET`
- **描述**: 根据主键ID查询开票记录详情

#### 路径参数

| 参数名 | 类型 | 必填 | 描述 | 示例 |
|-------|------|------|-----|------|
| id | Long | 是 | 开票记录ID | 1 |

#### 请求示例

```bash
GET /api/v1/invoice-records/1
```

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "orderCode": "INV202401010001",
    "userId": 1001,
    "stationId": 1001,
    "invoiceFlag": "0",
    "platformCode": "PLATFORM001",
    "invoiceType": "01",
    "buyerType": "N",
    "specialElements": "",
    "regionCode": "440100",
    "taxDeductionTypeCode": "",
    "purchaseInvoiceTypeCode": "",
    "exportBusinessPolicyCode": "",
    "vatInstantRefundCode": "",
    "sellerAddress": "深圳市南山区科技园",
    "sellerPhone": "0755-12345678",
    "sellerBankName": "工商银行深圳分行",
    "sellerBankAccount": "1234567890123456789",
    "buyerTaxId": "91440300123456789X",
    "buyerName": "测试公司A",
    "buyerAddress": "深圳市福田区CBD",
    "buyerPhone": "13800138000",
    "buyerBankName": "招商银行深圳分行",
    "buyerBankAccount": "9876543210987654321",
    "buyerAgentName": "李经理",
    "buyerAgentIdNumber": "440300198001011234",
    "buyerAgentPhone": "13900139000",
    "totalAmount": 1000.00,
    "totalTax": 130.00,
    "totalAmountWithTax": 1130.00,
    "collectionBankName": "工商银行深圳分行",
    "collectionBankAccount": "1234567890123456789",
    "settlementMethod": "02",
    "taxBehaviorLocation": "深圳市",
    "drawerName": "张三",
    "drawerIdNumber": "440300198001010001",
    "drawerIdType": "01",
    "correspondingBlueInvoiceNo": "",
    "redConfirmationInfoNo": "",
    "redConfirmationUuid": "",
    "remark": "测试发票",
    "serverIp": "192.168.1.100",
    "macAddress": "00:11:22:33:44:55",
    "cpuId": "BFEBFBFF000306A9",
    "motherboardSerial": "C02G8416DRJM",
    "showSellerBankFlag": "Y",
    "showBuyerBankFlag": "N",
    "payeeName": "王收款",
    "reviewerName": "赵复核",
    "invoiceStatus": "02",
    "invoiceNo": "25997000000170129316",
    "invoiceCode": "144001900111",
    "invoiceDate": "2024-01-15",
    "errorMsg": "",
    "retryCount": 0,
    "pdfUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/pdf",
    "sjly": "系统生成",
    "ofdUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/ofd",
    "ewmUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/qr",
    "xmlUrl": "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/xml",
    "createdTime": "2024-01-01T10:00:00",
    "updatedTime": "2024-01-01T10:00:00",
    "deletedTime": null,
    "createdBy": "system",
    "updatedBy": "system",
    "deleted": 0
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 税率管理 API接口文档

### 1. 分页查询税率配置列表

#### 接口信息
- **URL**: `/api/v1/tax-rate-configs`
- **方法**: `GET`
- **描述**: 根据条件分页查询税率配置列表

#### 查询参数

| 参数名 | 类型 | 必填 | 默认值 | 描述 | 示例 |
|-------|------|------|-------|-----|------|
| page | Integer | 否 | 1 | 当前页码 | 1 |
| pageSize | Integer | 否 | 10 | 每页数量 | 10 |
| merchantId | Long | 否 | - | 商户ID | 1001 |
| productName | String | 否 | - | 油品名称（支持模糊查询） | 92号汽油 |
| productCode | String | 否 | - | 商品编码（支持模糊查询） | 92# |
| unit | String | 否 | - | 单位 | 升 |
| spbm | String | 否 | - | 税收商品编码（支持模糊查询） | 1010101010000000000 |
| taxRateMin | BigDecimal | 否 | - | 最小税率 | 0.1000 |
| taxRateMax | BigDecimal | 否 | - | 最大税率 | 0.2000 |
| startTime | LocalDateTime | 否 | - | 创建开始时间 | 2024-01-01T00:00:00 |
| endTime | LocalDateTime | 否 | - | 创建结束时间 | 2024-12-31T23:59:59 |
| sortBy | String | 否 | createdTime | 排序字段 | createdTime |
| sortOrder | String | 否 | desc | 排序方向 | desc |

### 2. 根据油站ID和油品代码查询税率配置

#### 接口信息
- **URL**: `/api/v1/tax-rate-configs/by-station-product`
- **方法**: `GET`
- **描述**: 根据油站ID和油品代码查询税率配置

#### 查询参数

| 参数名 | 类型 | 必填 | 描述 | 示例 |
|-------|------|------|-----|------|
| merchantId | Long | 是 | 商户ID | 1001 |
| productCode | String | 是 | 商品编码 | 92# |

### 3. 根据油站ID查询所有税率配置

#### 接口信息
- **URL**: `/api/v1/tax-rate-configs/by-merchant/{merchantId}`
- **方法**: `GET`
- **描述**: 根据油站ID查询该油站下所有税率配置

#### 路径参数

| 参数名 | 类型 | 必填 | 描述 | 示例 |
|-------|------|------|-----|------|
| merchantId | Long | 是 | 商户ID | 1001 |

## 错误码说明

| 错误码 | 描述 |
|--------|-----|
| 0 | 成功 |
| 400001 | 请求参数错误 |
| 404001 | 资源不存在 |
| 500001 | 服务器内部错误 |

## 数据字典

### 发票状态 (invoiceStatus)
- `00`: 待开票
- `01`: 开票中
- `02`: 开票成功
- `03`: 开票失败

### 发票类型 (invoiceType)
- `01`: 数电专
- `02`: 数电普

### 蓝字发票标志 (invoiceFlag)
- `0`: 蓝字发票
- `1`: 红字发票

### 购买方类型 (buyerType)
- `Y`: 购买方是自然人
- `N`: 购买方非自然人

### 结算方式 (settlementMethod)
- `01`: 现金
- `02`: 银行转账
- `03`: 票据
- `04`: 第三方支付
- `05`: 预付卡
- `99`: 其他

### 单位类型 (unit)
- `升`: 升
- `方`: 方
- `件`: 件
- `箱`: 箱

## 重要说明

1. **默认查询范围**: 分页查询开票记录时，如果没有指定创建时间范围，系统默认查询最近3个月的数据。

2. **时间格式**: 
   - 日期格式：`yyyy-MM-dd`
   - 日期时间格式：`yyyy-MM-dd HH:mm:ss`

3. **分页参数**: 
   - 页码从1开始
   - 每页数量建议不超过100

4. **文件访问**: 
   - PDF、OFD、XML文件通过相应的URL直接访问
   - 二维码图片通过ewmUrl访问

5. **数据权限**: 建议根据用户权限过滤数据，确保数据安全。