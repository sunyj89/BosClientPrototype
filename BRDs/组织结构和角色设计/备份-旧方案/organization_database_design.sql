-- ==========================================
-- 组织架构管理系统数据库设计
-- 数据库：bos_client_organization
-- 版本：1.0
-- 创建时间：2024-01-01
-- ==========================================

-- 1. 法人主体表
CREATE TABLE `legal_entity` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '法人主体ID',
  `name` varchar(100) NOT NULL COMMENT '法人主体名称',
  `code` varchar(50) NOT NULL COMMENT '统一社会信用代码',
  `legal_person` varchar(50) DEFAULT NULL COMMENT '法定代表人',
  `address` varchar(200) DEFAULT NULL COMMENT '注册地址',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用 0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='法人主体表';

-- 2. 组织单元表
CREATE TABLE `organization_unit` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '组织ID',
  `name` varchar(100) NOT NULL COMMENT '组织名称',
  `code` varchar(50) DEFAULT NULL COMMENT '组织编码',
  `org_type` varchar(20) NOT NULL COMMENT '组织类型(HEADQUARTER:总部,DEPARTMENT:部门,CITY_BRANCH:分公司,SERVICE_AREA:服务区,GAS_STATION:加油站)',
  `parent_id` bigint DEFAULT NULL COMMENT '上级组织ID',
  `level` int NOT NULL DEFAULT '1' COMMENT '组织层级',
  `path` varchar(500) DEFAULT NULL COMMENT '组织路径，用/分隔',
  `legal_entity_id` bigint NOT NULL COMMENT '法人主体ID',
  `manager_id` bigint DEFAULT NULL COMMENT '负责人ID',
  `description` text COMMENT '组织描述',
  `sort_order` int DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用 0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_legal_entity_id` (`legal_entity_id`),
  KEY `idx_manager_id` (`manager_id`),
  KEY `idx_path` (`path`),
  KEY `idx_org_type` (`org_type`),
  CONSTRAINT `fk_org_legal_entity` FOREIGN KEY (`legal_entity_id`) REFERENCES `legal_entity` (`id`),
  CONSTRAINT `fk_org_parent` FOREIGN KEY (`parent_id`) REFERENCES `organization_unit` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组织单元表';

-- 3. 权限定义表
CREATE TABLE `permission` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `permission_code` varchar(100) NOT NULL COMMENT '权限编码',
  `permission_name` varchar(100) NOT NULL COMMENT '权限名称',
  `permission_type` varchar(20) NOT NULL COMMENT '权限类型(PAGE:页面权限,OPERATION:操作权限,DATA:数据权限)',
  `parent_id` bigint DEFAULT NULL COMMENT '父权限ID',
  `module` varchar(50) NOT NULL COMMENT '所属模块',
  `resource_url` varchar(200) DEFAULT NULL COMMENT '资源URL',
  `description` text COMMENT '权限描述',
  `sort_order` int DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用 0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission_code` (`permission_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_module` (`module`),
  KEY `idx_permission_type` (`permission_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限定义表';

-- 4. 角色配置表
CREATE TABLE `role_configuration` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色配置ID',
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) DEFAULT NULL COMMENT '角色编码',
  `description` text COMMENT '角色描述',
  `data_scope` varchar(20) NOT NULL DEFAULT 'self' COMMENT '数据权限范围(all:全部数据,self_org:本组织及子组织,self_org_only:仅本组织,self:仅本人)',
  `is_system_role` tinyint NOT NULL DEFAULT '0' COMMENT '是否系统角色(1:是 0:否)',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用 0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`),
  KEY `idx_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色配置表';

-- 5. 角色权限关联表
CREATE TABLE `role_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `permission_id` bigint NOT NULL COMMENT '权限ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`,`permission_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `role_configuration` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- 6. 角色适用组织类型表
CREATE TABLE `role_org_type` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `org_type` varchar(20) NOT NULL COMMENT '组织类型',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_org_type` (`role_id`,`org_type`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_org_type` (`org_type`),
  CONSTRAINT `fk_rot_role` FOREIGN KEY (`role_id`) REFERENCES `role_configuration` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色适用组织类型表';

-- 7. 用户表
CREATE TABLE `organization_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `name` varchar(50) NOT NULL COMMENT '用户姓名',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `employee_no` varchar(50) DEFAULT NULL COMMENT '员工编号',
  `org_unit_id` bigint NOT NULL COMMENT '所属组织ID',
  `role_id` bigint DEFAULT NULL COMMENT '角色ID',
  `position` varchar(50) DEFAULT NULL COMMENT '职位',
  `hire_date` date DEFAULT NULL COMMENT '入职日期',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:在职 0:离职)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_employee_no` (`employee_no`),
  KEY `idx_org_unit_id` (`org_unit_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_name` (`name`),
  KEY `idx_phone` (`phone`),
  CONSTRAINT `fk_user_org` FOREIGN KEY (`org_unit_id`) REFERENCES `organization_unit` (`id`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `role_configuration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 8. 组织类型定义表（数据字典）
CREATE TABLE `organization_type_dict` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type_code` varchar(20) NOT NULL COMMENT '类型编码',
  `type_name` varchar(50) NOT NULL COMMENT '类型名称',
  `parent_types` varchar(200) DEFAULT NULL COMMENT '可作为父级的类型，逗号分隔',
  `child_types` varchar(200) DEFAULT NULL COMMENT '可创建的子级类型，逗号分隔',
  `level` int NOT NULL COMMENT '层级',
  `icon` varchar(50) DEFAULT NULL COMMENT '图标',
  `color` varchar(20) DEFAULT NULL COMMENT '颜色',
  `sort_order` int DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用 0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_type_code` (`type_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组织类型定义表';

-- ==========================================
-- 初始化数据
-- ==========================================

-- 初始化法人主体数据
INSERT INTO `legal_entity` (`id`, `name`, `code`, `legal_person`, `address`, `phone`, `status`) VALUES
(1, '某某石油销售有限公司', '91110000123456789X', '张三', '北京市朝阳区XX路XX号', '010-12345678', 1),
(2, '某某能源服务有限公司', '91110000987654321Y', '李四', '北京市海淀区YY路YY号', '010-87654321', 1);

-- 初始化组织类型定义
INSERT INTO `organization_type_dict` (`type_code`, `type_name`, `parent_types`, `child_types`, `level`, `icon`, `color`, `sort_order`) VALUES
('HEADQUARTER', '总部', NULL, 'DEPARTMENT,CITY_BRANCH', 1, 'ApartmentOutlined', '#32AF50', 1),
('DEPARTMENT', '部门', 'HEADQUARTER', NULL, 2, 'BankOutlined', '#722ed1', 2),
('CITY_BRANCH', '分公司', 'HEADQUARTER', 'SERVICE_AREA', 2, 'BankOutlined', '#1677ff', 3),
('SERVICE_AREA', '服务区', 'CITY_BRANCH', 'GAS_STATION', 3, 'EnvironmentOutlined', '#faad14', 4),
('GAS_STATION', '加油站', 'SERVICE_AREA', NULL, 4, 'ShopOutlined', '#ff4d4f', 5);

-- 初始化组织架构数据
INSERT INTO `organization_unit` (`id`, `name`, `code`, `org_type`, `parent_id`, `level`, `path`, `legal_entity_id`, `sort_order`) VALUES
(1, '总公司', 'HQ001', 'HEADQUARTER', NULL, 1, '/1', 1, 1),
(2, '人力资源部', 'HR001', 'DEPARTMENT', 1, 2, '/1/2', 1, 2),
(3, '财务部', 'FIN001', 'DEPARTMENT', 1, 2, '/1/3', 1, 3),
(4, '北京分公司', 'BJ001', 'CITY_BRANCH', 1, 2, '/1/4', 1, 4),
(5, '上海分公司', 'SH001', 'CITY_BRANCH', 1, 2, '/1/5', 1, 5),
(6, '京藏高速服务区', 'SA001', 'SERVICE_AREA', 4, 3, '/1/4/6', 1, 6),
(7, '京沪高速服务区', 'SA002', 'SERVICE_AREA', 5, 3, '/1/5/7', 1, 7),
(8, '康庄加油站', 'GS001', 'GAS_STATION', 6, 4, '/1/4/6/8', 1, 8),
(9, '八达岭加油站', 'GS002', 'GAS_STATION', 6, 4, '/1/4/6/9', 1, 9);

-- 初始化权限数据
INSERT INTO `permission` (`permission_code`, `permission_name`, `permission_type`, `parent_id`, `module`, `resource_url`, `description`, `sort_order`) VALUES
-- 组织管理模块权限
('org:view', '组织架构查看', 'PAGE', NULL, 'organization', '/organization', '查看组织架构页面', 1),
('org:add', '新增组织', 'OPERATION', 1, 'organization', '/api/organization/unit', '新增组织单元', 2),
('org:edit', '编辑组织', 'OPERATION', 1, 'organization', '/api/organization/unit/*', '编辑组织信息', 3),
('org:delete', '删除组织', 'OPERATION', 1, 'organization', '/api/organization/unit/*', '删除组织单元', 4),
-- 用户管理权限
('user:view', '用户查看', 'PAGE', NULL, 'organization', '/organization/users', '查看用户列表', 5),
('user:add', '新增用户', 'OPERATION', 5, 'organization', '/api/organization/user', '新增用户', 6),
('user:edit', '编辑用户', 'OPERATION', 5, 'organization', '/api/organization/user/*', '编辑用户信息', 7),
('user:delete', '删除用户', 'OPERATION', 5, 'organization', '/api/organization/user/*', '删除用户', 8),
-- 角色配置权限
('role:view', '角色查看', 'PAGE', NULL, 'organization', '/organization/role-configuration', '查看角色配置页面', 9),
('role:add', '新增角色', 'OPERATION', 9, 'organization', '/api/organization/role-configuration', '新增角色配置', 10),
('role:edit', '编辑角色', 'OPERATION', 9, 'organization', '/api/organization/role-configuration/*', '编辑角色配置', 11),
('role:delete', '删除角色', 'OPERATION', 9, 'organization', '/api/organization/role-configuration/*', '删除角色配置', 12),
('role:copy', '复制角色', 'OPERATION', 9, 'organization', '/api/organization/role-configuration/*/copy', '复制角色配置', 13);

-- 初始化角色配置
INSERT INTO `role_configuration` (`id`, `role_name`, `role_code`, `description`, `data_scope`, `is_system_role`) VALUES
(1, '系统管理员', 'SYSTEM_ADMIN', '系统超级管理员，拥有所有权限', 'all', 1),
(2, '组织管理员', 'ORG_ADMIN', '组织架构管理员，可管理组织和人员', 'self_org', 1),
(3, '部门经理', 'DEPT_MANAGER', '部门经理角色，可查看本部门数据', 'self_org_only', 0),
(4, '普通员工', 'EMPLOYEE', '普通员工角色，只能查看个人相关数据', 'self', 0),
(5, '加油站站长', 'STATION_MANAGER', '加油站站长，管理加油站日常运营', 'self_org_only', 0);

-- 初始化角色权限关联（系统管理员拥有所有权限）
INSERT INTO `role_permission` (`role_id`, `permission_id`) 
SELECT 1, id FROM `permission`;

-- 初始化组织管理员权限
INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13);

-- 初始化角色适用组织类型
INSERT INTO `role_org_type` (`role_id`, `org_type`) VALUES
(1, 'HEADQUARTER'), (1, 'DEPARTMENT'), (1, 'CITY_BRANCH'), (1, 'SERVICE_AREA'), (1, 'GAS_STATION'),
(2, 'HEADQUARTER'), (2, 'DEPARTMENT'), (2, 'CITY_BRANCH'),
(3, 'DEPARTMENT'), (3, 'CITY_BRANCH'), (3, 'SERVICE_AREA'),
(4, 'DEPARTMENT'), (4, 'CITY_BRANCH'), (4, 'SERVICE_AREA'), (4, 'GAS_STATION'),
(5, 'GAS_STATION');

-- 初始化用户数据
INSERT INTO `organization_user` (`id`, `name`, `username`, `phone`, `email`, `employee_no`, `org_unit_id`, `role_id`, `position`, `hire_date`) VALUES
(1, '系统管理员', 'admin', '13800138000', 'admin@example.com', 'EMP001', 1, 1, '系统管理员', '2023-01-01'),
(2, '张三', 'zhangsan', '13800138001', 'zhangsan@example.com', 'EMP002', 2, 3, '人事经理', '2023-02-01'),
(3, '李四', 'lisi', '13800138002', 'lisi@example.com', 'EMP003', 3, 3, '财务经理', '2023-03-01'),
(4, '王五', 'wangwu', '13800138003', 'wangwu@example.com', 'EMP004', 8, 5, '站长', '2023-04-01'),
(5, '赵六', 'zhaoliu', '13800138004', 'zhaoliu@example.com', 'EMP005', 9, 5, '站长', '2023-05-01'); 