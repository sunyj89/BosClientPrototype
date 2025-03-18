import React from 'react';
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
  AccountBookOutlined,
  SearchOutlined,
  EditOutlined,
  TrophyOutlined,
  RiseOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

// 自定义菜单项标签组件，处理文本过长问题
const MenuItemLabel = ({ text, link, tooltip }) => {
  // 如果文本长度超过12个字符，显示tooltip
  const needTooltip = text.length > 12;
  
  const content = (
    <Link to={link} style={{ whiteSpace: 'normal', lineHeight: '1.2', display: 'inline-block' }}>
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
    background: '#32AF50', // 使用主题色作为Logo背景
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
          key: 'supplier_list',
          icon: <TeamOutlined />,
          label: <MenuItemLabel text="供应商列表" link="/supplier" />,
        },
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
          key: 'supplier_transport',
          icon: <CarOutlined />,
          label: <MenuItemLabel text="承运单位" link="/supplier/transport" />,
        }
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
          key: 'station_organization',
          icon: <TeamOutlined />,
          label: <MenuItemLabel text="组织结构" link="/station/organization" />,
        },
        {
          key: 'station_device',
          icon: <DesktopOutlined />,
          label: <MenuItemLabel text="设备管理" link="/station/device" />,
        },
      ],
    },
    {
      key: 'oil',
      icon: <ShopOutlined />,
      label: '油品管理',
      children: [
        {
          key: 'oil_tank',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="油罐管理" link="/oil/tank" />,
        },
        {
          key: 'oil_tank_change',
          icon: <SwapOutlined />,
          label: <MenuItemLabel text="油罐油品变更" link="/oil/tank/change" />,
        },
        {
          key: 'oil_gun',
          icon: <ToolOutlined />,
          label: <MenuItemLabel text="油枪管理" link="/oil/gun" />,
        },
        {
          key: 'oil_gun_inspection',
          icon: <SafetyCertificateOutlined />,
          label: <MenuItemLabel text="油枪自检记录" link="/oil/gun/inspection" />,
        },
        {
          key: 'oil_gun_change',
          icon: <SwapOutlined />,
          label: <MenuItemLabel text="油枪油品变更" link="/oil/gun/change" />,
        },
        {
          key: 'oil_gun_change_approval',
          icon: <AuditOutlined />,
          label: <MenuItemLabel text="变更审批记录" link="/oil/gun/change/approval" tooltip="油枪油品变更审批记录" />,
        },
        {
          key: 'oil_info',
          icon: <GoldOutlined />,
          label: <MenuItemLabel text="油品信息" link="/oil/info" />,
        },
        {
          key: 'oil_density',
          icon: <StockOutlined />,
          label: <MenuItemLabel text="油品密度" link="/oil/density" />,
        },
        {
          key: 'oil_depot',
          icon: <BankOutlined />,
          label: <MenuItemLabel text="油库管理" link="/oil/depot" />,
        },
        {
          key: 'oil_depot_distance',
          icon: <EnvironmentOutlined />,
          label: <MenuItemLabel text="油库距离管理" link="/oil/depot/distance" tooltip="油库与油站距离管理" />,
        },
      ],
    },
    {
      key: 'purchase',
      icon: <ShoppingCartOutlined />,
      label: '采购管理',
      children: [
        {
          key: 'purchase_oil_delivery',
          icon: <CarOutlined />,
          label: <MenuItemLabel text="油品配送管理" link="/purchase/oil-delivery" />,
        },
        {
          key: 'purchase_oil_input',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="进油管理" link="/purchase/oil-input" />,
        },
        {
          key: 'purchase_oil_loss',
          icon: <LineChartOutlined />,
          label: <MenuItemLabel text="油品损耗管理" link="/purchase/oil-loss" />,
        },
        {
          key: 'purchase_oil_order',
          icon: <ShoppingCartOutlined />,
          label: <MenuItemLabel text="油品采购订单" link="/purchase/oil-order" />,
        },
        {
          key: 'purchase_goods_order',
          icon: <ShoppingCartOutlined />,
          label: <MenuItemLabel text="商品采购订单" link="/purchase/goods-order" />,
        },
        {
          key: 'purchase_settlement',
          icon: <AccountBookOutlined />,
          label: <MenuItemLabel text="采购结算单" link="/purchase/settlement" />,
        },
        {
          key: 'purchase_details',
          icon: <NodeIndexOutlined />,
          label: <MenuItemLabel text="结算明细" link="/purchase/details" />,
        },
        {
          key: 'purchase_transport_settlement',
          icon: <CarOutlined />,
          label: <MenuItemLabel text="运费结算单" link="/purchase/transport-settlement" />,
        },
        {
          key: 'purchase_transport_details',
          icon: <NodeIndexOutlined />,
          label: <MenuItemLabel text="运费明细" link="/purchase/transport-details" />,
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
      key: 'goods',
      icon: <ShoppingOutlined />,
      label: '商品管理',
      children: [
        {
          key: 'goods_category',
          icon: <BranchesOutlined />,
          label: <MenuItemLabel text="商品类别" link="/goods/category" />,
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
      key: 'membership',
      icon: <UserOutlined />,
      label: '会员管理',
      children: [
        {
          key: 'membership_card',
          icon: <CreditCardOutlined />,
          label: <MenuItemLabel text="会员卡管理" link="/membership/card" />,
        },
        {
          key: 'membership_points',
          icon: <GiftOutlined />,
          label: <MenuItemLabel text="积分管理" link="/membership/points" />,
        },
      ],
    },
    {
      key: 'report',
      icon: <BarChartOutlined />,
      label: '报表管理',
      children: [
        {
          key: 'report_sales',
          icon: <LineChartOutlined />,
          label: <MenuItemLabel text="销售报表" link="/report/sales" />,
        },
        {
          key: 'report_inventory',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="库存报表" link="/report/inventory" />,
        },
        {
          key: 'report_member',
          icon: <UserOutlined />,
          label: <MenuItemLabel text="会员报表" link="/report/member" />,
        },
        {
          key: 'report_purchase',
          icon: <ShoppingCartOutlined />,
          label: <MenuItemLabel text="商品采购报表" link="/report/purchase" />,
        },
        {
          key: 'report_goods-sales',
          icon: <ShoppingOutlined />,
          label: <MenuItemLabel text="商品销售报表" link="/report/goods-sales" />,
        },
        {
          key: 'report_density',
          icon: <StockOutlined />,
          label: <MenuItemLabel text="油品密度报表" link="/report/density" />,
        },
      ],
    },

    {
      key: 'approval_center',
      icon: <AuditOutlined />,
      label: <MenuItemLabel text="审批中心" link="/approval/center" />,
    },

    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: 'system_workflow',
          icon: <NodeIndexOutlined />,
          label: <MenuItemLabel text="工作流程管理" link="/system/workflow" />,
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
    >
      <div style={logoStyle}>
        {!collapsed && 'BOS智慧油站'}
        {collapsed && 'BOS'}
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        style={{ borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default AppSider; 