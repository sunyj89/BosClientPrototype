import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 导入组件
import AppHeader from './components/layout/AppHeader';
import AppSider from './components/layout/AppSider';
import AppFooter from './components/layout/AppFooter';

// 导入页面
import Login from './pages/Login';
import AppRouter from './router';

const { Content } = Layout;

// Configure dayjs locale
dayjs.locale('zh-cn');

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