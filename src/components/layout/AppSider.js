﻿﻿﻿﻿import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShopOutlined,
  ShoppingOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  DatabaseOutlined,
  CreditCardOutlined,
  GiftOutlined,
  LineChartOutlined,
  StockOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  BranchesOutlined,
  GoldOutlined,
  BankOutlined,
  ToolOutlined,
  DesktopOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  AuditOutlined,
  NodeIndexOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  ContactsOutlined,
  CommentOutlined,
  AccountBookOutlined,
  FormOutlined,
  ReloadOutlined,
  SearchOutlined,
  TrophyOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  TruckOutlined,
  SecurityScanOutlined,
  FundViewOutlined,
  PercentageOutlined,
  IdcardOutlined,
  CrownOutlined,
  ShareAltOutlined,
  TagOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

// 自定义菜单项标签组件，处理文本过长问题
const MenuItemLabel = ({ text, link, tooltip }) => {
  // 如果文本长度超过12个字符，显示tooltip
  const needTooltip = text.length > 12;
  
  // 为"油品询价管理"添加红色文字样式
  const linkStyle = {
    whiteSpace: 'normal', 
    lineHeight: '1.2', 
    display: 'inline-block',
    color: text === '油品询价管理' ? 'red' : 'inherit' // 添加条件样式
  };
  
  const content = (
    <Link to={link} style={linkStyle}>
      {text}
    </Link>
  );
  
  if (needTooltip && tooltip) {
    return (
      <Tooltip placement="right" title={tooltip}>
        {content}
      </Tooltip>
    );
  }
  
  return content;
};

const AppSider = ({ collapsed }) => {
  const location = useLocation();
  
  // 获取当前路径的第一级路径，用于设置默认选中的菜单项
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
  
  // 获取当前路径的第二级路径，用于设置默认展开的子菜单
  const secondLevelPath = location.pathname.split('/')[2];
  
  // 根据当前路径确定默认选中的菜单项
  const selectedKey = secondLevelPath 
    ? `${currentPath}_${secondLevelPath}` 
    : currentPath;
  
  // 根据当前路径确定默认展开的子菜单
  const openKeys = [currentPath];

  // 侧边栏样式
  const siderStyle = {
    background: '#fff', // 白色背景
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)', // 添加阴影效果
    zIndex: 10 // 确保侧边栏在其他元素之上
  };

  // Logo样式
  const logoStyle = {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: collapsed ? '0' : '0 24px',
    background: '#32AF50', // 绿色背景
    color: '#fff',
    fontWeight: 'bold',
    fontSize: collapsed ? '16px' : '18px',
    transition: 'all 0.3s'
  };

  // 菜单项配置
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <MenuItemLabel text="仪表盘" link="/dashboard" />,
    },
    {
      key: 'supplier',
      icon: <ContactsOutlined />,
      label: '供应商管理',
      children: [
        {
          key: 'supplier_oil',
          icon: <ShopOutlined />,
          label: <MenuItemLabel text="油品供应商" link="/supplier/oil" />,
        },
        {
          key: 'supplier_goods',
          icon: <ShoppingOutlined />,
          label: <MenuItemLabel text="商品供应商" link="/supplier/goods" />,
        },
        {
          key: 'supplier_portal',
          icon: <BankOutlined />,
          label: <MenuItemLabel text="供应商门户" link="/supplier/portal" />,
        },
      ],
    },
    {
      key: 'station',
      icon: <EnvironmentOutlined />,
      label: '油站管理',
      children: [
        {
          key: 'station_list',
          icon: <BankOutlined />,
          label: <MenuItemLabel text="油站列表" link="/station" />,
        },
        {
          key: 'station_tank',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="油罐列表" link="/station/tank" />,
        },
        {
          key: 'station_gun',
          icon: <ToolOutlined />,
          label: <MenuItemLabel text="油枪列表" link="/station/gun" />,
        },

      ],
    },
    {
      key: 'oil',
      icon: <ShopOutlined />,
      label: '油品管理',
      children: [
        {
          key: 'oil_master_data',
          icon: <AppstoreOutlined />,
          label: <MenuItemLabel text="油品主数据" link="/oil/master-data" />,
        },
        {
          key: 'oil_density',
          icon: <StockOutlined />,
          label: <MenuItemLabel text="油品密度" link="/oil/density" />,
        },
        {
          key: 'oil_price',
          icon: <DollarOutlined />,
          label: <MenuItemLabel text="油价维护" link="/oil/price" />,
        },
      ],
    },
    {
      key: 'goods',
      icon: <ShoppingOutlined />,
      label: '商品管理',
      children: [
        {
          key: 'goods_master_data',
          icon: <AppstoreOutlined />,
          label: <MenuItemLabel text="商品主数据" link="/goods/master-data" />,
        },
        {
          key: 'goods_inventory',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="库存管理" link="/goods/inventory" />,
        },
        {
          key: 'goods_price',
          icon: <DollarOutlined />,
          label: <MenuItemLabel text="价格调整" link="/goods/price" />,
        },
      ],
    },

    {
      key: 'purchase',
      icon: <ShoppingCartOutlined />,
      label: '采购管理',
      children: [
        {
          key: 'purchase_oil_procurement_management',
          icon: <ShoppingCartOutlined />,
          label: <MenuItemLabel text="油品采购管理" link="/purchase/oil-procurement-management" />,
        },
        {
          key: 'purchase_non_oil_procurement',
          icon: <ShoppingOutlined />,
          label: <MenuItemLabel text="非油商品采购管理" link="/purchase/non-oil-procurement" />,
        },
        {
          key: 'purchase_oil_inquiry_management',
          icon: <AuditOutlined />,
          label: <MenuItemLabel text="油品询价管理" link="/purchase/oil-inquiry-management" />,
        },
        {
          key: 'purchase_oil_delivery',
          icon: <CarOutlined />,
          label: <MenuItemLabel text="油品配送管理" link="/purchase/oil-delivery" />,
        },
        {
          key: 'purchase_oil_loss',
          icon: <LineChartOutlined />,
          label: <MenuItemLabel text="油品损耗管理" link="/purchase/oil-loss" />,
        },

      ],
    },
    {
      key: 'logistics',
      icon: <TruckOutlined />,
      label: '物流管理',
      children: [
        {
          key: 'logistics_oil_warehouse_delivery',
          icon: <CarOutlined />,
          label: <MenuItemLabel text="油库出库管理" link="/logistics/oil-warehouse-delivery" />,
        },
      ],
    },
    {
      key: 'sales',
      icon: <LineChartOutlined />,
      label: '销售管理',
      children: [
        {
          key: 'sales_oil',
          icon: <ShopOutlined />,
          label: <MenuItemLabel text="油品销售管理" link="/sales/oil" />,
        },
        {
          key: 'sales_goods',
          icon: <ShoppingOutlined />,
          label: <MenuItemLabel text="商品销售管理" link="/sales/goods" />,
        },
      ],
    },

    {
      key: 'marketing',
      icon: <SettingOutlined />,
      label: '营销中心',
      children: [
        {
          key: 'marketing_coupon_config',
          icon: <GiftOutlined />,
          label: <MenuItemLabel text="优惠券配置" link="/marketing/coupon-config" />,
        },
        {
          key: 'marketing_price_discount_config',
          icon: <PercentageOutlined />,
          label: <MenuItemLabel text="价格优惠配置" link="/marketing/price-discount-config" />,
        },
        {
          key: 'marketing_activity_config',
          icon: <TrophyOutlined />,
          label: <MenuItemLabel text="营销活动配置" link="/marketing/activity-config" />,
        },
        {
          key: 'marketing_member_identity',
          icon: <IdcardOutlined />,
          label: <MenuItemLabel text="渠道会员认证" link="/marketing/member-identity" />,
        },
        {
          key: 'marketing_member_level',
          icon: <CrownOutlined />,
          label: <MenuItemLabel text="会员等级" link="/marketing/member-level" />,
        },
        {
          key: 'marketing_member_referral',
          icon: <ShareAltOutlined />,
          label: <MenuItemLabel text="会员拉新" link="/marketing/member-referral" />,
        },
        {
          key: 'marketing_item_marketing',
          icon: <TagOutlined />,
          label: <MenuItemLabel text="明细营销" link="/marketing/item-marketing" />,
        },
        {
          key: 'marketing_order_marketing',
          icon: <ShoppingCartOutlined />,
          label: <MenuItemLabel text="整单营销" link="/marketing/order-marketing" />,
        },
      ],
    },

    {
      key: 'loss',
      icon: <LineChartOutlined />,
      label: '损溢管理',
      children: [
        {
          key: 'loss_station_summary',
          icon: <BarChartOutlined />,
          label: <MenuItemLabel text="各站损溢汇总查询" link="/loss" />,
        },
      ],
    },

    {
      key: 'member',
      icon: <UserOutlined />,
      label: '会员中心',
      children: [
        {
          key: 'member_data',
          icon: <TeamOutlined />,
          label: <MenuItemLabel text="会员数据" link="/member" />,
        },
        {
          key: 'personal_center_config',
          icon: <SettingOutlined />,
          label: <MenuItemLabel text="会员规则配置" link="/member/personal-center-config" />,
        },
        {
          key: 'member_feedback_evaluation',
          icon: <CommentOutlined />,
          label: <MenuItemLabel text="会员意见与评价" link="/member/feedback-evaluation" />,
        },
      ],
    },

    {
      key: 'points',
      icon: <TrophyOutlined />,
      label: '积分管理',
      children: [
        {
          key: 'points_dashboard',
          icon: <DashboardOutlined />,
          label: <MenuItemLabel text="积分看板" link="/points" />,
        },

        {
          key: 'points_details',
          icon: <FormOutlined />,
          label: <MenuItemLabel text="积分明细" link="/points/details" />,
        },
        {
          key: 'points_mall',
          icon: <ShoppingOutlined />,
          label: <MenuItemLabel text="积分商城" link="/points/mall" />,
        },
        {
          key: 'points_reports',
          icon: <BarChartOutlined />,
          label: <MenuItemLabel text="积分报表" link="/points/reports" />,
        },
        {
          key: 'points_config',
          icon: <SettingOutlined />,
          label: <MenuItemLabel text="积分配置" link="/points/config" />,
        },
      ],
    },

    {
      key: 'report',
      icon: <BarChartOutlined />,
      label: '报表管理',
      children: [
        {
          key: 'report_shift_handover',
          icon: <FormOutlined />,
          label: <MenuItemLabel text="加油站交接班报表" link="/report/shift-handover" />,
        },
        {
          key: 'report_oil_sales',
          icon: <LineChartOutlined />,
          label: <MenuItemLabel text="油品销售报表" link="/report/oil-sales" />,
        },
        {
          key: 'report_oil_inventory',
          icon: <StockOutlined />,
          label: <MenuItemLabel text="油品进销存日报" link="/report/oil-inventory" />,
        },
      ],
    },

    {
      key: 'equipment',
      icon: <ToolOutlined />,
      label: '设备管理',
      children: [
        {
          key: 'equipment_archive',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="设备档案管理" link="/equipment/archive" />,
        },
        {
          key: 'equipment_dispenser_calibration',
          icon: <SafetyCertificateOutlined />,
          label: <MenuItemLabel text="加油机校验记录" link="/equipment/dispenser-calibration" />,
        },
        {
          key: 'equipment_generator_operation',
          icon: <DesktopOutlined />,
          label: <MenuItemLabel text="发电机运行记录" link="/equipment/generator-operation" />,
        },
        {
          key: 'equipment_utility_records',
          icon: <NodeIndexOutlined />,
          label: <MenuItemLabel text="水电表记录" link="/equipment/water-electricity" />,
        },
        {
          key: 'equipment_liquid_level_meter',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="液位仪管理" link="/equipment/liquid-level-meter" />,
        },
      ],
    },



    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: '安全管理',
      children: [
        {
          key: 'security_inspection_management',
          icon: <SafetyCertificateOutlined />,
          label: <MenuItemLabel text="现场巡检管理" link="/security/inspection-management" />,
        },
        {
          key: 'security_archive_management',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="油站电子档案管理" link="/security/archive-management" />,
        },
        {
          key: 'security_maintenance_management',
          icon: <ToolOutlined />,
          label: <MenuItemLabel text="维修施工管理" link="/security/maintenance-management" />,
        },
        {
          key: 'security_emergency_drill_management',
          icon: <SecurityScanOutlined />,
          label: <MenuItemLabel text="应急演练管理" link="/security/emergency-drill-management" />,
        },
        {
          key: 'security_training_management',
          icon: <TeamOutlined />,
          label: <MenuItemLabel text="人员培训管理" link="/security/training-management" />,
        },
        {
          key: 'security_knowledge_exam',
          icon: <AuditOutlined />,
          label: <MenuItemLabel text="安全知识和考试管理" link="/security/knowledge-exam" />,
        },
      ],
    },

    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '数字化运营分析',
      children: [
        {
          key: 'analytics_data_center',
          icon: <DashboardOutlined />,
          label: <MenuItemLabel text="数据分析中心" link="/analytics/data-center" />,
        },
        {
          key: 'analytics_customer_center',
          icon: <UserOutlined />,
          label: <MenuItemLabel text="客户管理中心" link="/analytics/customer-center" />,
        },
        {
          key: 'analytics_risk_center',
          icon: <SecurityScanOutlined />,
          label: <MenuItemLabel text="风险监控中心" link="/analytics/risk-center" />,
        },
        {
          key: 'analytics_dashboard',
          icon: <FundViewOutlined />,
          label: <MenuItemLabel text="大数据超脑大屏" link="/analytics/dashboard" />,
        },
      ],
    },

    {
      key: 'payment',
      icon: <CreditCardOutlined />,
      label: '支付管理',
      children: [
        {
          key: 'payment_acceptance_config',
          icon: <SettingOutlined />,
          label: <MenuItemLabel text="支付受理配置" link="/payment/acceptance-config" />,
        },
      ],
    },

    {
      key: 'invoice',
      icon: <FileTextOutlined />,
      label: '发票管理',
      children: [
        {
          key: 'invoice_records',
          icon: <FileTextOutlined />,
          label: <MenuItemLabel text="开票记录" link="/invoice" />,
        },
        {
          key: 'invoice_settings',
          icon: <SettingOutlined />,
          label: <MenuItemLabel text="发票设置" link="/invoice/settings" />,
        },
      ],
    },

    {
      key: 'organization',
      icon: <ApartmentOutlined />,
      label: '组织架构管理',
      children: [
        {
          key: 'organization_structure',
          icon: <ApartmentOutlined />,
          label: <MenuItemLabel text="组织架构" link="/organization" />,
        },
        {
          key: 'organization_role_config',
          icon: <SettingOutlined />,
          label: <MenuItemLabel text="角色配置" link="/organization/role-configuration" />,
        },
      ],
    },

  ];

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      trigger={null}
      width={220}
      style={siderStyle}
      className="app-sider-custom"
    >
      <div style={logoStyle}>
        {!collapsed && '江西交投化石能源'}
        {collapsed && 'BOS'}
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        style={{ borderRight: 0, flex: '1', overflowY: 'auto' }}
        items={menuItems}
        forceSubMenuRender={false}
        inlineIndent={16}
      />
    </Sider>
  );
};

export default AppSider; 