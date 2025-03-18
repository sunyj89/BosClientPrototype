import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Card, Button, Drawer } from 'antd';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import {
  ImportOutlined,
  MenuOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

// 导入油品入库相关组件
import OilInputWithOrder from './oil-delivery/OilInputWithOrder';
import OilInputWithoutOrder from './oil-delivery/OilInputWithoutOrder';
import OilInputDetail from './oil-delivery/OilInputDetail';
import OilInputStats from './oil-delivery/OilInputStats';

const { Content } = Layout;

const OilInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('/purchase/oil-input/input-with-order');
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
    const path = location.pathname;
    if (path === '/purchase/oil-input' || path === '/purchase/oil-input/') {
      setActiveKey('/purchase/oil-input/input-with-order');
    } else {
      setActiveKey(path);
    }
  }, [location.pathname]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    navigate(key);
  };

  const tabItems = [
    {
      key: '/purchase/oil-input/input-with-order',
      label: (
        <span>
          <ImportOutlined />
          有单入库
        </span>
      ),
    },
    {
      key: '/purchase/oil-input/input-without-order',
      label: (
        <span>
          <ImportOutlined />
          无单入库
        </span>
      ),
    },
    {
      key: '/purchase/oil-input/input-detail',
      label: (
        <span>
          <FileTextOutlined />
          入库单明细
        </span>
      ),
    },
    {
      key: '/purchase/oil-input/input-stats',
      label: (
        <span>
          <BarChartOutlined />
          入库统计
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
            <h3 style={{ margin: 0 }}>油品入库管理</h3>
          </div>
          <Drawer
            title="油品入库管理"
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
            title="油品入库管理" 
            bordered={false}
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: 0, paddingTop: 16 }}
          >
            {!isMobile && renderTabs()}
          </Card>
          <Routes>
            <Route index element={<OilInputWithOrder />} />
            <Route path="input-with-order" element={<OilInputWithOrder />} />
            <Route path="input-without-order" element={<OilInputWithoutOrder />} />
            <Route path="input-detail" element={<OilInputDetail />} />
            <Route path="input-stats" element={<OilInputStats />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OilInput; 