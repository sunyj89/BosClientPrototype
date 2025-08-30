-- 为invoice_record表添加email字段
-- 创建时间: 2025-01-20
-- 版本: 1.1.0

USE `invoice`;

-- 在buyer_phone字段后面添加email字段
ALTER TABLE `invoice_record` 
ADD COLUMN `email` VARCHAR(100) DEFAULT '' COMMENT '购买方邮箱' AFTER `buyer_phone`;

-- 添加email字段的索引（可选，如果需要通过email查询）
ALTER TABLE `invoice_record` 
ADD INDEX `idx_email` (`email`);