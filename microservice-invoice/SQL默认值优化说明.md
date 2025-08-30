# SQL默认值优化说明

## 优化概述

为了提高数据库的健壮性和查询性能，我们对SQL文件中的所有表进行了默认值优化，将原来的 `DEFAULT NULL` 改为具体的默认值。

## 优化原则

1. **字符串字段**: 默认值设为空字符串 `''`
2. **数值字段**: 默认值设为 `0` 或 `0.00`
3. **日期时间字段**: 
   - 创建时间、更新时间：使用 `CURRENT_TIMESTAMP`
   - 业务时间字段：默认值设为 `1900-01-01` 或 `1900-01-01 00:00:00`
   - 软删除时间：保持 `NULL`（NULL表示未删除）
4. **JSON字段**: 默认值设为 `'{}'` 或 `'[]'`
5. **系统字段**: 默认值设为 `''` 而非 `'system'`（避免误导）
6. **布尔字段**: 根据业务逻辑设置合理的默认值（0或1）

## 具体修改内容

### 1. 油站发票配置表 (station_invoice_configs)
- 所有VARCHAR字段默认值从 `NULL` 改为 `''`
- `station_id` 默认值设为 `0`（实际使用时必须提供有效值）
- `provider_type` 默认值设为 `1`（百旺乐企）
- `invoice_validity_period_in_hours` 设为NOT NULL，默认 `720`
- `provider_specific_config` 默认值从 `NULL` 改为 `'{}'`
- `start_time` 默认值设为 `CURRENT_TIMESTAMP`
- `created_by` 和 `updated_by` 默认值从 `NULL` 改为 `''`
- **保留NULL的字段**：
  - `end_time`：NULL表示永久有效
  - `deleted_time`：NULL表示未删除

### 2. 开票记录表 (invoice_record)
- 所有VARCHAR字段的默认值从 `NULL` 改为 `''`
- `invoice_date` 默认值从 `NULL` 改为 `'1900-01-01'`
- `deleted_time` 默认值从 `NULL` 改为 `'1900-01-01 00:00:00'`
- `created_by` 和 `updated_by` 默认值从 `NULL` 改为 `'system'`

### 3. 发票明细表 (invoice_detail)
- 字符串字段默认值从 `NULL` 改为 `''`
- 数值字段默认值设置：
  - `sl` (数量): `0.000000`
  - `dj` (单价): `0.000000`
  - `kce` (差额征税扣除额): `0.00`
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

### 4. 出行人信息表 (invoice_traveler)
- 所有VARCHAR字段默认值从 `NULL` 改为 `''`
- `chuxrq` (出行日期) 默认值从 `NULL` 改为 `'1900-01-01'`
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

### 5. 运输明细表 (invoice_transport)
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

### 5. 建筑服务特定要素表 (invoice_construction)
- 字符串字段默认值从 `NULL` 改为 `''`
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

### 6. 不动产经营租赁特定要素表 (invoice_real_estate_lease)
- 字符串字段默认值从 `NULL` 改为 `''`
- `cph` (车牌号数组) 默认值从 `NULL` 改为 `'[]'`
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

### 7. 不动产销售特定要素表 (invoice_real_estate_sale)
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

### 8. 共同购买方表 (invoice_common_buyer)
- 字符串字段默认值从 `NULL` 改为 `''`
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

### 9. 不动产信息表 (invoice_real_estate_info)
- 字符串字段默认值从 `NULL` 改为 `''`
- 数值字段默认值设置：
  - `hdjsjg` (核定计税价格): `0.00`
  - `sjcjhsje` (实际成交含税金额): `0.00`
- 系统字段默认值设置：
  - `deleted_time`: `'1900-01-01 00:00:00'`
  - `created_by` 和 `updated_by`: `'system'`

## 优化效果

### 1. 提高查询性能
- 避免NULL值比较，提高索引效率
- 减少NULL值处理逻辑
- 优化WHERE条件查询

### 2. 增强数据一致性
- 所有字段都有明确的默认值
- 减少数据插入时的NULL值
- 便于数据验证和业务逻辑处理

### 3. 简化应用代码
- 不需要频繁的NULL值检查
- 减少空值判断逻辑
- 提高代码可读性

### 4. 便于数据统计
- 空字符串和0值便于统计计算
- 避免NULL值在聚合函数中的问题
- 提高报表查询效率

## 注意事项

1. **业务逻辑调整**: 应用代码中需要相应调整NULL值判断逻辑
2. **数据迁移**: 如果已有数据，需要考虑默认值的兼容性
3. **查询优化**: 可以利用非NULL默认值优化查询条件
4. **数据验证**: 在应用层需要验证空字符串和0值的业务含义

## 建议

1. 在应用代码中统一处理空字符串和0值的业务逻辑
2. 建立数据验证规则，确保默认值的合理性
3. 定期检查数据质量，避免无效的默认值数据
4. 在查询时合理利用默认值，提高查询效率 