import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Card, Button, Drawer } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  CarOutlined,
  MenuOutlined,
  BarChartOutlined,
  FileTextOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { Content } = Layout;

const OilDeliveryLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('/purchase/oil-delivery/plan');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setDrawerVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 根据当前路径设置活动的Tab
  useEffect(() => {
    if (location.pathname === '/purchase/oil-delivery') {
      setActiveKey('/purchase/oil-delivery/plan');
    } else {
      setActiveKey(location.pathname);
    }
  }, [location.pathname]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    navigate(key);
  };

  const tabItems = [
    {
      key: '/purchase/oil-delivery/plan',
      label: (
        <span>
          <FileTextOutlined />
          配送计划申请
        </span>
      ),
    },
    {
      key: '/purchase/oil-delivery/plan-detail',
      label: (
        <span>
          <FileTextOutlined />
          配送计划明细
        </span>
      ),
    },
    {
      key: '/purchase/oil-delivery/plan-stats',
      label: (
        <span>
          <BarChartOutlined />
          配送计划统计
        </span>
      ),
    },
    {
      key: '/purchase/oil-delivery/small',
      label: (
        <span>
          <CarOutlined />
          小车配送登记
        </span>
      ),
    },
    {
      key: '/purchase/oil-delivery/small-stats',
      label: (
        <span>
          <BarChartOutlined />
          小车配送统计
        </span>
      ),
    },
  ];

  const renderTabs = () => (
    <Tabs
      activeKey={activeKey}
      onChange={handleTabChange}
      type="card"
      items={tabItems}
      size={isMobile ? "small" : "middle"}
      style={{ marginBottom: 16 }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <>
          <div style={{ padding: '16px', background: '#fff', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center' }}>
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setDrawerVisible(true)}
              style={{ marginRight: '16px' }}
            />
            <h3 style={{ margin: 0 }}>油品配送管理</h3>
          </div>
          <Drawer
            title="油品配送管理"
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={250}
          >
            {renderTabs()}
          </Drawer>
        </>
      ) : null}
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: '24px 0',
            minHeight: 280,
            borderRadius: 4,
          }}
        >
          <Card 
            title="油品配送管理" 
            bordered={false}
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: 0, paddingTop: 16 }}
          >
            {!isMobile && renderTabs()}
          </Card>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default OilDeliveryLayout; 