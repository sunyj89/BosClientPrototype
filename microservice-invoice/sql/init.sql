-- 发票管理服务数据库初始化脚本
-- 创建时间: 2024-01-01
-- 版本: 1.0.0

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `invoice` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `invoice`;

-- 开票记录表
CREATE TABLE `invoice_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_code` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '(fpqqlsh)发票请求流水号(内部订单编号)',
  `user_id` BIGINT NOT NULL DEFAULT 0 COMMENT '用户ID',
  `merchant_id` BIGINT NOT NULL DEFAULT 0 COMMENT '商户ID',
  `merchant_type` TINYINT NOT NULL DEFAULT 1 COMMENT '商户类型 1:单站 2:集团 3:第三方',
  `invoice_flag` VARCHAR(1) NOT NULL DEFAULT '0' COMMENT '(lzfpbz)蓝字发票标志 0：蓝字发票 1：红字发票',
  `platform_code` VARCHAR(32) DEFAULT '' COMMENT '(ptbh)平台编号',
  `batch_relate_order_code` VARCHAR(64) DEFAULT '' COMMENT '批量关联订单号（批量开票时的主订单号）',
  `is_batch` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否批量开票 0:否 1:是',
  `product_type` TINYINT NOT NULL DEFAULT 0 COMMENT '商品类型 0:非油品 1:油品 2:充值卡',
  `invoice_type` VARCHAR(2) NOT NULL DEFAULT '01' COMMENT '(fppz)发票票种 01：数电专 02：数电普',
  `buyer_type` VARCHAR(1) DEFAULT 'N' COMMENT '(gmfzrrbz)购买方自然人标志 Y：购买方是自然人 N：购买方非自然人',
  `special_elements` VARCHAR(2) DEFAULT '' COMMENT '(tdys)特定要素',
  `region_code` VARCHAR(6) DEFAULT '' COMMENT '(qydm)区域代码',
  `tax_deduction_type_code` VARCHAR(2) DEFAULT '' COMMENT '(cezslxDm)差额征税类型代码',
  `purchase_invoice_type_code` VARCHAR(2) DEFAULT '' COMMENT '(sgfplxDm)收购发票类型代码',
  `export_business_policy_code` VARCHAR(2) DEFAULT '' COMMENT '(ckywsyzcDm)出口业务适用政策代码',
  `vat_instant_refund_code` VARCHAR(2) DEFAULT '' COMMENT '(zzsjzjtDm)增值税即征即退代码',
  `seller_address` VARCHAR(200) DEFAULT '' COMMENT '(xsfdz)销售方地址',
  `seller_phone` VARCHAR(20) DEFAULT '' COMMENT '(xsfdh)销售方电话',
  `seller_bank_name` VARCHAR(100) DEFAULT '' COMMENT '(xsfkhh)销售方开户行',
  `seller_bank_account` VARCHAR(50) DEFAULT '' COMMENT '(xsfzh)销售方账号',
  `buyer_tax_id` VARCHAR(50) DEFAULT '' COMMENT '(gmfnsrsbh)购买方统一社会信用代码/纳税人识别号/身份证件号码',
  `buyer_name` VARCHAR(200) NOT NULL COMMENT '(gmfmc)购买方名称',
  `buyer_address` VARCHAR(200) DEFAULT '' COMMENT '(gmfdz)购买方地址',
  `buyer_phone` VARCHAR(20) DEFAULT '' COMMENT '(gmfdh)购买方电话',
  `buyer_bank_name` VARCHAR(100) DEFAULT '' COMMENT '(gmfkhh)购买方开户行',
  `buyer_bank_account` VARCHAR(50) DEFAULT '' COMMENT '(gmfzh)购买方账号',
  `buyer_agent_name` VARCHAR(50) DEFAULT '' COMMENT '(gmfjbr)购买方经办人姓名',
  `buyer_agent_id_number` VARCHAR(50) DEFAULT '' COMMENT '(jbrsfzjhm)经办人身份证件号码',
  `buyer_agent_phone` VARCHAR(20) DEFAULT '' COMMENT '(gmfjbrlxdh)经办人联系电话',
  `total_amount` DECIMAL(18,2) NOT NULL DEFAULT 0.00 COMMENT '(hjje)合计金额',
  `total_tax` DECIMAL(18,2) NOT NULL DEFAULT 0.00 COMMENT '(hjse)合计税额',
  `total_amount_with_tax` DECIMAL(18,2) NOT NULL DEFAULT 0.00 COMMENT '(jshj)价税合计',
  `collection_bank_name` VARCHAR(100) DEFAULT '' COMMENT '(skyhmc)收款银行名称',
  `collection_bank_account` VARCHAR(50) DEFAULT '' COMMENT '(skyhzh)收款银行账号',
  `settlement_method` VARCHAR(2) DEFAULT '' COMMENT '(jsfs)结算方式',
  `tax_behavior_location` VARCHAR(200) DEFAULT '' COMMENT '(ysxwfsd)应税行为发生地',
  `drawer_name` VARCHAR(50) NOT NULL COMMENT '(kpr)开票人',
  `drawer_id_number` VARCHAR(50) DEFAULT '' COMMENT '(kprzjhm)开票人证件号码',
  `drawer_id_type` VARCHAR(2) DEFAULT '' COMMENT '(kprzjlx)开票人证件类型',
  `corresponding_blue_invoice_no` VARCHAR(20) DEFAULT '' COMMENT '(dylzfphm)对应蓝字发票号码',
  `red_confirmation_info_no` VARCHAR(50) DEFAULT '' COMMENT '(hzqrxxdbh)红字确认信息单编号',
  `red_confirmation_uuid` VARCHAR(100) DEFAULT '' COMMENT '(hzqrduuid)红字确认单uuid',
  `remark` VARCHAR(500) DEFAULT '' COMMENT '(bz)备注',
  `server_ip` VARCHAR(50) DEFAULT '' COMMENT '(ip)服务器地址',
  `mac_address` VARCHAR(50) DEFAULT '' COMMENT '(macdz)mac地址',
  `cpu_id` VARCHAR(100) DEFAULT '' COMMENT '(cpuid)CPU序列号',
  `motherboard_serial` VARCHAR(100) DEFAULT '' COMMENT '(zbxlh)主板序列号',
  `show_seller_bank_flag` VARCHAR(1) DEFAULT 'N' COMMENT '(sfzsxsfyhzhbq)是否展示销售方银行账号标签 Y:展示 N:不展示',
  `show_buyer_bank_flag` VARCHAR(1) DEFAULT 'N' COMMENT '(sfzsgmfyhzhbq)是否展示购买方银行账号标签 Y:展示 N:不展示',
  `payee_name` VARCHAR(50) DEFAULT '' COMMENT '(skrxm)收款人姓名',
  `reviewer_name` VARCHAR(50) DEFAULT '' COMMENT '(fhrxm)复核人姓名',
  `invoice_status` VARCHAR(10) NOT NULL DEFAULT '00' COMMENT '发票状态 00：待开票 01：开票中 02：开票成功 03：开票失败',
  `invoice_no` VARCHAR(40) NOT NULL DEFAULT '' COMMENT '(fphm)发票号码(外部发票订单号)',
  `invoice_code` VARCHAR(20) DEFAULT '' COMMENT '发票代码',
  `invoice_date` DATE DEFAULT NULL COMMENT '开票日期',
  `error_msg` VARCHAR(500) DEFAULT '' COMMENT '错误信息',
  `retry_count` INT NOT NULL DEFAULT 0 COMMENT '重试次数',
  `pdf_url` VARCHAR(500) DEFAULT '' COMMENT 'PDF文件访问地址',
  `sjly` VARCHAR(100) DEFAULT '' COMMENT '数据来源',
  `ofd_url` VARCHAR(500) DEFAULT '' COMMENT 'OFD文件访问地址',
  `ewm_url` VARCHAR(500) DEFAULT '' COMMENT '二维码访问地址',
  `xml_url` VARCHAR(500) DEFAULT '' COMMENT 'XML文件访问地址',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_code` (`order_code`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_merchant_type` (`merchant_type`),
  KEY `idx_invoice_status` (`invoice_status`),
  KEY `idx_invoice_no` (`invoice_no`),
  KEY `idx_buyer_phone` (`buyer_phone`),
  KEY `idx_invoice_date` (`invoice_date`),
  KEY `idx_created_time` (`created_time`),
  KEY `idx_deleted` (`deleted`),
  KEY `idx_batch_relate_order_code` (`batch_relate_order_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='开票记录表';

-- 发票明细表
CREATE TABLE `invoice_detail` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `invoice_record_id` BIGINT NOT NULL COMMENT '开票记录ID',
  `corresponding_blue_detail_no` VARCHAR(10) DEFAULT '' COMMENT '(dylzfpmxxh)对应蓝字发票明细序号',
  `detail_no` VARCHAR(10) NOT NULL COMMENT '(mxxh)明细序号',
  `goods_service_name` VARCHAR(100) NOT NULL COMMENT '(spfwjc)商品服务简称',
  `item_name` VARCHAR(200) NOT NULL COMMENT '(xmmc)项目名称',
  `goods_or_service_full_name` VARCHAR(300) NOT NULL COMMENT '(hwhyslwfwmc)货物或应税劳务、服务名称',
  `specification` VARCHAR(100) DEFAULT '' COMMENT '(ggxh)规格型号',
  `unit` VARCHAR(20) DEFAULT '' COMMENT '(dw)单位',
  `quantity` DECIMAL(18,6) DEFAULT 0.000000 COMMENT '(sl)数量',
  `unit_price` DECIMAL(18,6) DEFAULT 0.000000 COMMENT '(dj)单价',
  `amount` DECIMAL(18,2) NOT NULL COMMENT '(je)金额',
  `tax_rate` VARCHAR(10) NOT NULL COMMENT '(slv)增值税税率/征收率',
  `tax_amount` DECIMAL(18,2) NOT NULL COMMENT '(se)税额',
  `amount_with_tax` DECIMAL(18,2) NOT NULL COMMENT '(hsje)含税金额',
  `deduction_amount` DECIMAL(18,2) DEFAULT 0.00 COMMENT '(kce)差额征税扣除额',
  `goods_service_tax_code` VARCHAR(20) NOT NULL COMMENT '(sphfwssflhbbm)商品和服务税收分类合并编码',
  `invoice_line_nature` VARCHAR(2) NOT NULL DEFAULT '00' COMMENT '(fphxz)发票行性质 00：正常行 01：折扣行 02：被折扣行',
  `preferential_policy_flag` VARCHAR(2) DEFAULT '' COMMENT '(yhzcbs)优惠政策标识',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_invoice_record_id` (`invoice_record_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='发票明细表';

-- 出行人信息表
CREATE TABLE `invoice_traveler` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `invoice_record_id` BIGINT NOT NULL COMMENT '开票记录ID',
  `traveler_no` VARCHAR(10) DEFAULT '' COMMENT '(cxrxh)出行人序号',
  `traveler_name` VARCHAR(100) DEFAULT '' COMMENT '(cxr)出行人',
  `traveler_id_type` VARCHAR(3) DEFAULT '' COMMENT '(cxrzjlxDm)出行人证件类型',
  `id_number` VARCHAR(50) DEFAULT '' COMMENT '(sfzjhm)有效身份证件号',
  `travel_date` DATE DEFAULT '1900-01-01' COMMENT '(chuxrq)出行日期',
  `departure_place` VARCHAR(100) DEFAULT '' COMMENT '(cfd)旅客出发地',
  `destination_place` VARCHAR(100) DEFAULT '' COMMENT '(ddd)旅客到达地',
  `seat_level` VARCHAR(50) DEFAULT '' COMMENT '(zwdj)等级',
  `transport_type` VARCHAR(1) DEFAULT '' COMMENT '(jtgjlxDm)交通工具类型',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_invoice_record_id` (`invoice_record_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='出行人信息表';

-- 运输明细表
CREATE TABLE `invoice_transport` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `invoice_record_id` BIGINT NOT NULL COMMENT '开票记录ID',
  `transport_detail_no` VARCHAR(10) NOT NULL COMMENT '(ysmxxh)运输明细序号',
  `departure_place` VARCHAR(100) NOT NULL COMMENT '(qyd)起运地',
  `destination_place` VARCHAR(100) NOT NULL COMMENT '(ddd)到达地',
  `transport_tool_type` VARCHAR(50) NOT NULL COMMENT '(ysgjzl)运输工具种类',
  `transport_tool_number` VARCHAR(50) NOT NULL COMMENT '(ysgjph)运输工具牌号',
  `cargo_name` VARCHAR(200) NOT NULL COMMENT '(yshwmc)运输货物名称',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_invoice_record_id` (`invoice_record_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='运输明细表';

-- 建筑服务特定要素表
CREATE TABLE `invoice_construction` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `invoice_record_id` BIGINT NOT NULL COMMENT '开票记录ID',
  `construction_service_location` VARCHAR(100) NOT NULL COMMENT '(jzfwfsd)建筑服务发生地',
  `construction_project_name` VARCHAR(200) NOT NULL COMMENT '(jzxmmc)建筑项目名称',
  `land_value_tax_project_no` VARCHAR(50) DEFAULT '' COMMENT '(tdzzsxmbh)土地增值税项目编号',
  `cross_city_flag` VARCHAR(1) NOT NULL COMMENT '(kdsbz)跨地市标志 Y：跨地市 N：非跨地市',
  `cross_region_tax_report_no` VARCHAR(50) DEFAULT '' COMMENT '(kqysssxbyglbh)跨区域涉税事项报验管理编号',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invoice_record_id` (`invoice_record_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='建筑服务特定要素表';

-- 不动产经营租赁特定要素表
CREATE TABLE `invoice_real_estate_lease` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `invoice_record_id` BIGINT NOT NULL COMMENT '开票记录ID',
  `serial_no` VARCHAR(10) NOT NULL COMMENT '(xh)序号',
  `property_location_province` VARCHAR(100) NOT NULL COMMENT '(bdczldzS)不动产坐落地址（省）',
  `property_location_city` VARCHAR(100) DEFAULT '' COMMENT '(bdczldzS1)不动产坐落地址（市）',
  `property_location_detail` VARCHAR(200) NOT NULL COMMENT '(bdczldzXxdz)不动产坐落地址（详细地址）',
  `lease_period` VARCHAR(100) NOT NULL COMMENT '(zlqqz)租赁期起止',
  `cross_city_flag` VARCHAR(1) NOT NULL COMMENT '(kdsbz)跨地市标志 Y：跨地市 N：非跨地市',
  `property_certificate_no` VARCHAR(100) NOT NULL COMMENT '(cqzsbh)产权证书/不动产权证号',
  `license_plates` VARCHAR(500) DEFAULT '[]' COMMENT '(cph)车牌号数组',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_invoice_record_id` (`invoice_record_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='不动产经营租赁特定要素表';

-- 不动产销售特定要素表
CREATE TABLE `invoice_real_estate_sale` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `invoice_record_id` BIGINT NOT NULL COMMENT '开票记录ID',
  `multi_buyer_flag` VARCHAR(1) DEFAULT 'N' COMMENT '(dfgtgmbz)多方共同购买标志 Y：多方共同购买 N：非多方共同购买',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invoice_record_id` (`invoice_record_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='不动产销售特定要素表';

-- 共同购买方表
CREATE TABLE `invoice_common_buyer` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `real_estate_sale_id` BIGINT NOT NULL COMMENT '不动产销售特定要素ID',
  `common_buyer_name` VARCHAR(200) NOT NULL COMMENT '(gtgmf)共同购买方',
  `id_type` VARCHAR(3) DEFAULT '' COMMENT '(zjlx)证件类型',
  `id_number` VARCHAR(50) DEFAULT '' COMMENT '(zjhm)证件号码',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_real_estate_sale_id` (`real_estate_sale_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='共同购买方表';

-- 不动产信息表
CREATE TABLE `invoice_real_estate_info` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `real_estate_sale_id` BIGINT NOT NULL COMMENT '不动产销售特定要素ID',
  `serial_no` VARCHAR(10) NOT NULL COMMENT '(xh)序号',
  `property_unit_code` VARCHAR(50) DEFAULT '' COMMENT '(bdcdwdm)不动产单位代码',
  `online_contract_record_no` VARCHAR(100) DEFAULT '' COMMENT '(wqhtbabh)网签合同备案编号',
  `property_location_province` VARCHAR(100) NOT NULL COMMENT '(bdczldzS)不动产坐落地址（省）',
  `property_location_city` VARCHAR(100) DEFAULT '' COMMENT '(bdczldzS1)不动产坐落地址（市）',
  `property_location_detail` VARCHAR(200) NOT NULL COMMENT '(bdczldzXxdz)不动产坐落地址（详细地址）',
  `land_value_tax_project_no` VARCHAR(50) DEFAULT '' COMMENT '(tdzzsxmbh)土地增值税项目编号',
  `cross_city_flag` VARCHAR(1) NOT NULL COMMENT '(kdsbz)跨地市标志 Y：跨地市 N：非跨地市',
  `approved_tax_price` DECIMAL(18,2) DEFAULT 0.00 COMMENT '(hdjsjg)核定计税价格',
  `actual_transaction_amount` DECIMAL(18,2) DEFAULT 0.00 COMMENT '(sjcjhsje)实际成交含税金额',
  `property_certificate_no` VARCHAR(100) DEFAULT '' COMMENT '(cqzsbh)产权证书/不动产权证号',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_real_estate_sale_id` (`real_estate_sale_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='不动产信息表';

-- 税率管理表
CREATE TABLE `tax_rate_config` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` BIGINT NOT NULL DEFAULT 0 COMMENT '商户ID',
  `merchant_type` TINYINT NOT NULL DEFAULT 1 COMMENT '商户类型 1:单站 2:集团 3:第三方',
  `product_name` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '名称',
  `product_code` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '商品编码',
  `tax_rate` DECIMAL(10,4) NOT NULL DEFAULT 0.0000 COMMENT '税率',
  `unit` VARCHAR(20) NOT NULL DEFAULT '升' COMMENT '单位（升、方、件、箱）',
  `spbm` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '税收商品编码',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_merchant_type` (`merchant_type`),
  KEY `idx_product_code` (`product_code`),
  KEY `idx_spbm` (`spbm`),
  KEY `idx_created_time` (`created_time`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='税率管理表';

-- 插入初始数据
INSERT INTO `invoice_record` (`order_code`, `user_id`, `merchant_id`, `merchant_type`, `invoice_flag`, `invoice_type`, `buyer_name`, `total_amount`, `total_tax`, `total_amount_with_tax`, `drawer_name`, `invoice_status`, `created_by`) VALUES
('INV202401010001', 1001, 1001, 1, '0', '01', '测试公司A', 1000.00, 130.00, 1130.00, '张三', '02', 'system'),
('INV202401010002', 1002, 1002, 1, '0', '02', '测试公司B', 2000.00, 260.00, 2260.00, '李四', '02', 'system');

-- 插入发票明细数据
INSERT INTO `invoice_detail` (`invoice_record_id`, `detail_no`, `goods_service_name`, `item_name`, `goods_or_service_full_name`, `amount`, `tax_rate`, `tax_amount`, `amount_with_tax`, `goods_service_tax_code`, `invoice_line_nature`, `created_by`) VALUES
(1, '1', '技术服务', '软件开发服务', '*技术服务*软件开发服务', 1000.00, '0.13', 130.00, 1130.00, '3040302000000000000', '00', 'system'),
(2, '1', '商品销售', '办公用品', '*商品销售*办公用品', 2000.00, '0.13', 260.00, 2260.00, '1010101010000000000', '00', 'system');

-- 插入税率管理数据
INSERT INTO `tax_rate_config` (`merchant_id`, `merchant_type`, `product_name`, `product_code`, `tax_rate`, `unit`, `spbm`, `created_by`) VALUES
(1001, 1, '92号汽油', '92#', 0.1300, '升', '1010101010000000000', 'system'),
(1001, 1, '95号汽油', '95#', 0.1300, '升', '1010101020000000000', 'system'),
(1001, 1, '98号汽油', '98#', 0.1300, '升', '1010101030000000000', 'system'),
(1001, 1, '0号柴油', '0#', 0.1300, '升', '1010102010000000000', 'system'),
(1001, 1, '-10号柴油', '-10#', 0.1300, '升', '1010102020000000000', 'system'),
(1002, 1, '92号汽油', '92#', 0.1300, '升', '1010101010000000000', 'system'),
(1002, 1, '95号汽油', '95#', 0.1300, '升', '1010101020000000000', 'system'),
(1002, 1, '0号柴油', '0#', 0.1300, '升', '1010102010000000000', 'system');

-- 发票抬头表
CREATE TABLE `invoice_header` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT NOT NULL DEFAULT 0 COMMENT '用户ID',
  `header_name` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '发票抬头名称',
  `tax_id` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '纳税人识别号',
  `header_type` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '抬头类型 1：个人 2：企业',
  `phone` VARCHAR(20) DEFAULT '' COMMENT '手机号码',
  `email` VARCHAR(100) DEFAULT '' COMMENT '邮箱地址',
  `address` VARCHAR(200) DEFAULT '' COMMENT '地址',
  `bank_name` VARCHAR(100) DEFAULT '' COMMENT '开户银行',
  `bank_account` VARCHAR(50) DEFAULT '' COMMENT '银行账号',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认抬头 0：非默认 1：默认',
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `created_by` VARCHAR(64) DEFAULT 'system' COMMENT '创建者',
  `updated_by` VARCHAR(64) DEFAULT 'system' COMMENT '更新者',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_header_type` (`header_type`),
  KEY `idx_is_default` (`is_default`),
  KEY `idx_created_time` (`created_time`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='发票抬头表';

-- 插入测试发票抬头数据
INSERT INTO `invoice_header` (`user_id`, `header_name`, `tax_id`, `header_type`, `phone`, `email`, `address`, `bank_name`, `bank_account`, `is_default`, `created_by`) VALUES
(1001, '张三', '110101199001011234', 1, '13800138001', 'zhangsan@example.com', '北京市朝阳区测试街道1号', '', '', 1, 'system'),
(1001, '北京测试科技有限公司', '91110000123456789X', 2, '13800138002', 'company@test.com', '北京市海淀区科技园区2号', '中国银行北京分行', '1234567890123456', 0, 'system'),
(1002, '李四', '110101199002022345', 1, '13800138003', 'lisi@example.com', '上海市浦东新区测试路3号', '', '', 1, 'system'); 

-- 油站发票配置表（优化版）
CREATE TABLE IF NOT EXISTS `station_invoice_configs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
    `merchant_id` BIGINT NOT NULL DEFAULT 0 COMMENT '商户ID',
    `merchant_type` TINYINT NOT NULL DEFAULT 1 COMMENT '商户类型 1:单站 2:集团 3:第三方',
    `station_name` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '油站名称(冗余字段，方便查询)',
    `provider_type` INT NOT NULL DEFAULT 1 COMMENT '服务商类型(1: 百旺乐企)',
    `default_invoice_merchant` TINYINT NOT NULL DEFAULT 1 COMMENT '默认开票商户 1:单站 2:集团 3:第三方',
    `taxpayer_id` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '销方-纳税人识别号',
    `bank_name` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '销方-开户银行',
    `bank_account` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '销方-银行账号',
    `station_address` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '销方-地址',
    `station_phone` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '销方-电话',
    `payee` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '收款人',
    `reviewer` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '复核人',
    `drawer` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '开票人',
    `paper_invoice_tax_disk_no` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '纸质发票税盘号',
    `electronic_invoice_tax_disk_no` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '电子发票税盘号',
    `extension_no` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '分机号',
    `drawer_email` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '开票员邮箱',
    `invoice_validity_period_in_hours` INT NOT NULL DEFAULT 720 COMMENT '开票有效期，单位：小时',
    `consumption_record_entry_enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否开启"消费记录"开票入口',
    `payment_complete_entry_enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否开启"支付完成"开票入口',
    `senseless_payment_auto_invoice_enabled` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否开启"无感支付"自动开票',
    `paper_invoice_option_enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否提供"纸质发票"选项',
    `invoice_amount_basis` TINYINT NOT NULL DEFAULT 1 COMMENT '发票金额依据(1: 实付金额, 2: 原价金额)',
    `recharge_default_oil` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '充值开票时使用的默认油品名称',
    `provider_specific_config` VARCHAR(3000) DEFAULT '[]' COMMENT '服务商特定配置(JSON格式)',
    `start_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '配置生效开始时间',
    `end_time` DATETIME DEFAULT NULL COMMENT '配置生效结束时间(NULL代表永久有效)',
    `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_time` DATETIME DEFAULT NULL COMMENT '软删除时间',
    `created_by` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '创建者',
    `updated_by` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '更新者',
    `deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_merchant_id` (`merchant_id`),
    KEY `idx_merchant_type` (`merchant_type`),
    KEY `idx_start_time` (`start_time`),
    KEY `idx_end_time` (`end_time`),
    KEY `idx_deleted` (`deleted`),
    KEY `idx_merchant_deleted` (`merchant_id`, `deleted`) COMMENT '联合索引优化查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='油站发票配置表';

INSERT INTO station_invoice_configs (
  merchant_id, merchant_type, station_name, provider_type, default_invoice_merchant, taxpayer_id,
  bank_name, bank_account, station_address, station_phone,
  payee, reviewer, drawer,
  paper_invoice_tax_disk_no, electronic_invoice_tax_disk_no, extension_no, drawer_email,
  invoice_validity_period_in_hours,
  consumption_record_entry_enabled, payment_complete_entry_enabled,
  senseless_payment_auto_invoice_enabled, paper_invoice_option_enabled,
  invoice_amount_basis, recharge_default_oil, provider_specific_config,
  start_time, end_time, created_by, updated_by, deleted
) VALUES
-- 示例1：百旺乐企，默认参数，长期有效
(100001, 1, '中石化北京朝阳加油站', 1, 1, '91110105MA01XXXX2X',
 '中国工商银行北京分行', '6222000000000001', '北京市朝阳区XX路1号', '010-88888888',
 '张三', '李四', '王五',
 'PAPER-0001', 'ELECTRONIC-0001', '8001', 'invoice01@example.com',
 720,
 1, 1,
 0, 1,
 1, '92号汽油', JSON_OBJECT('app_key','demo_key_1','app_secret','demo_secret_1'),
 NOW(), NULL, 'system', 'system', 0),

-- 示例2：百旺乐企，限制有效期
(100002, 1, '中石化上海浦东加油站', 1, 1, '91310115MA2XXXXXX',
 '中国银行上海分行', '6222000000000002', '上海市浦东新区XX路2号', '021-66666666',
 '赵六', '钱七', '孙八',
 'PAPER-0002', 'ELECTRONIC-0002', '8002', 'invoice02@example.com',
 720,
 1, 1,
 0, 1,
 1, '95号汽油', JSON_OBJECT('app_key','demo_key_2','app_secret','demo_secret_2'),
 NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), 'system', 'system', 0),

-- 示例3：关闭“纸质发票”，开启“无感自动开票”
(100003, 1, '中石油广州天河加油站', 1, 1, '91440101MA5XXXXXX',
 '建设银行广州分行', '6222000000000003', '广州市天河区XX路3号', '020-77777777',
 '吴九', '郑十', '周十一',
 'PAPER-0003', 'ELECTRONIC-0003', '8003', 'invoice03@example.com',
 720,
 1, 1,
 1, 0,
 1, '98号汽油', JSON_OBJECT('app_key','demo_key_3','app_secret','demo_secret_3'),
 NOW(), NULL, 'system', 'system', 0);