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
  FormOutlined,
  ReloadOutlined,
  SearchOutlined,
  TrophyOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
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
      ],
    },
    {
      key: 'purchase',
      icon: <ShoppingCartOutlined />,
      label: '采购管理',
      children: [
        {
          key: 'purchase_oil_order',
          icon: <ShoppingCartOutlined />,
          label: <MenuItemLabel text="油品采购订单" link="/purchase/oil-order" />,
        },
        {
          key: 'purchase_oil_purchase_price_management',
          icon: <DollarOutlined />,
          label: <MenuItemLabel text="油品进价管理" link="/purchase/oil-purchase-price-management" />,
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
        {
          key: 'purchase_non_oil_procurement',
          icon: <ShoppingOutlined />,
          label: <MenuItemLabel text="非油商品采购管理" link="/purchase/non-oil-procurement" />,
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
      key: 'inventory',
      icon: <DatabaseOutlined />,
      label: '油品库存管理',
      children: [
        {
          key: 'inventory_oil_input',
          icon: <DatabaseOutlined />,
          label: <MenuItemLabel text="进油管理" link="/inventory/oil-input" />,
        },
        {
          key: 'inventory_oil_transfer',
          icon: <SwapOutlined />,
          label: <MenuItemLabel text="油品调拨" link="/inventory/oil-transfer" />,
        },
        {
          key: 'inventory_inventory_query',
          icon: <SearchOutlined />,
          label: <MenuItemLabel text="库存查询" link="/inventory/inventory-query" />,
        },
        {
          key: 'inventory_self_use',
          icon: <FormOutlined />,
          label: <MenuItemLabel text="自用油申请" link="/inventory/self-use" />,
        },
        {
          key: 'inventory_refill',
          icon: <ReloadOutlined />,
          label: <MenuItemLabel text="回灌油申请" link="/inventory/refill" />,
        },
      ],
    },
    {
      key: 'delivery',
      icon: <CarOutlined />,
      label: '配送管理',
      children: [
        {
          key: 'supplier_transport',
          icon: <CarOutlined />,
          label: <MenuItemLabel text="承运单位" link="/supplier/transport" />,
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
      key: 'device',
      icon: <DesktopOutlined />,
      label: '设备管理',
      children: [
        {
          key: 'device_list',
          icon: <DesktopOutlined />,
          label: <MenuItemLabel text="液位仪管理" link="/device" />,
        },
      ],
    },
    {
      key: 'loss',
      icon: <LineChartOutlined />,
      label: '损溢管理',
      children: [],
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
        {
          key: 'report_station-inventory',
          icon: <AccountBookOutlined />,
          label: <MenuItemLabel text="9003油站进销存" link="/report/station-inventory" />,
        },
        {
          key: 'report_station-sales-monthly',
          icon: <BarChartOutlined />,
          label: <MenuItemLabel text="9020油站销售月报表" link="/report/station-sales-monthly" />,
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
        {
          key: 'system_global_config',
          icon: <SettingOutlined />,
          label: <MenuItemLabel text="全局配置" link="/system/global-config" />,
        },
        {
          key: 'system_sitemap',
          icon: <BranchesOutlined />,
          label: <MenuItemLabel text="网站地图" link="/system/sitemap" />,
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