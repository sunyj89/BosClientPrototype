-- 添加批量开票相关字段
-- 执行时间: 2025-01-19

USE `invoice`;

-- 添加批量关联订单号字段
ALTER TABLE `invoice_record` 
ADD COLUMN `batch_relate_order_code` VARCHAR(64) DEFAULT '' COMMENT '批量关联订单号（批量开票时的主订单号）' AFTER `platform_code`;

-- 添加是否批量开票字段
ALTER TABLE `invoice_record` 
ADD COLUMN `is_batch` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否批量开票 0:否 1:是' AFTER `batch_relate_order_code`;

-- 添加商品类型字段
ALTER TABLE `invoice_record` 
ADD COLUMN `product_type` TINYINT NOT NULL DEFAULT 0 COMMENT '商品类型 0:非油品 1:油品 2:充值卡' AFTER `is_batch`;

-- 为批量关联订单号添加索引，方便查询
ALTER TABLE `invoice_record` 
ADD INDEX `idx_batch_relate_order_code` (`batch_relate_order_code`);