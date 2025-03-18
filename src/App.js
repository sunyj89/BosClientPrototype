import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 导入组件
import AppHeader from './components/layout/AppHeader';
import AppSider from './components/layout/AppSider';
import AppFooter from './components/layout/AppFooter';

// 导入页面
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
// 导入供应商管理组件
import SupplierManagement from './pages/supplier/SupplierManagement';
import OilSupplierManagement from './pages/supplier/OilSupplierManagement';
import GoodsSupplierManagement from './pages/supplier/GoodsSupplierManagement';
import TransportUnitManagement from './pages/supplier/TransportUnitManagement';
// 导入商品管理和会员管理组件
import GoodsManagement from './pages/goods/GoodsManagement';
import GoodsCategoryManagement from './pages/goods/GoodsCategoryManagement';
import GoodsInventoryManagement from './pages/goods/GoodsInventoryManagement';
import GoodsPriceManagement from './pages/goods/GoodsPriceManagement';
import GoodsPurchaseManagement from './pages/goods/GoodsPurchaseManagement';
import MembershipManagement from './pages/membership/MembershipManagement';
import MemberCardManagement from './pages/membership/MemberCardManagement';
import MemberPointsManagement from './pages/membership/MemberPointsManagement';
// 导入报表管理组件
import ReportManagement from './pages/report/ReportManagement';
import SalesReport from './pages/report/SalesReport';
import InventoryReport from './pages/report/InventoryReport';
import MemberReport from './pages/report/MemberReport';
import PurchaseReport from './pages/report/PurchaseReport';
import GoodsSalesReport from './pages/report/GoodsSalesReport';
import DensityReport from './pages/report/DensityReport';
// 导入油站管理组件
import StationManagement from './pages/station/StationManagement';
import OrganizationManagement from './pages/station/OrganizationManagement';
import DeviceManagement from './pages/station/DeviceManagement';
import DeviceDetail from './pages/station/DeviceDetail';
import ApprovalCenter from './pages/approval/ApprovalCenter';
import WorkflowManagement from './pages/system/WorkflowManagement';
import SystemManagement from './pages/system/SystemManagement';
// 导入采购管理组件
import OilPurchaseOrder from './pages/purchase/OilPurchaseOrder';
import OilPurchaseSettlement from './pages/purchase/OilPurchaseSettlement';
import TransportFeeSettlement from './pages/purchase/TransportFeeSettlement';
import TransportFeeDetails from './pages/purchase/TransportFeeDetails';
import OilDeliveryLayout from './pages/purchase/oil-delivery/Layout';
import OilInput from './pages/purchase/OilInput';
import OilLoss from './pages/purchase/OilLoss';

import NotFound from './pages/NotFound';
import AppRouter from './router';

const { Content } = Layout;

// 定义主题配置
const themeConfig = {
  token: {
    colorPrimary: '#32AF50',
  },
};

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // 模拟登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // 如果未登录且不在登录页，重定向到登录页
  if (!isLoggedIn && !isLoginPage) {
    return <Navigate to="/login" />;
  }

  // 登录页不显示布局
  if (isLoginPage) {
    return (
      <ConfigProvider locale={zhCN} theme={themeConfig}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        <AppSider collapsed={collapsed} />
        <Layout className="site-layout">
          <AppHeader 
            collapsed={collapsed} 
            setCollapsed={setCollapsed} 
            onLogout={handleLogout}
          />
          <Content style={{ margin: '16px' }}>
            <AppRouter />
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App; 