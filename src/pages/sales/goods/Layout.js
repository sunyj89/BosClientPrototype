import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Button, Drawer, message } from 'antd';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  FileTextOutlined,
  MenuOutlined,
  DollarOutlined,
  BarChartOutlined,
  TrophyOutlined,
  RiseOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { TabPane } = Tabs;

const GoodsSalesLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeKey, setActiveKey] = useState('/sales/goods/detail');

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

  // 根据当前路径设置活动标签
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/sales/goods/')) {
      setActiveKey(path);
    } else {
      setActiveKey('/sales/goods/detail');
    }
  }, [location.pathname]);

  // 标签页数据
  const tabItems = [
    {
      key: '/sales/goods/detail',
      icon: <FileTextOutlined />,
      label: '商品销售明细',
    },
    {
      key: '/sales/goods/price-adjustment',
      icon: <DollarOutlined />,
      label: '售价调整申请',
    },
    {
      key: '/sales/goods/price-history',
      icon: <FileTextOutlined />,
      label: '售价调价记录',
    },
    {
      key: '/sales/goods/daily-report',
      icon: <BarChartOutlined />,
      label: '销售日报表',
    },
    {
      key: '/sales/goods/ranking',
      icon: <TrophyOutlined />,
      label: '销售排行',
    },
    {
      key: '/sales/goods/performance',
      icon: <RiseOutlined />,
      label: '销售绩效',
    },
    {
      key: '/sales/goods/organization-task',
      icon: <TeamOutlined />,
      label: '机构销售任务',
    },
  ];

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveKey(key);
    navigate(key);
  };

  // 渲染标签页
  const renderTabs = () => (
    <Tabs
      activeKey={activeKey}
      onChange={handleTabChange}
      type="card"
      size={isMobile ? "small" : "default"}
      style={{ marginBottom: 16 }}
      tabPosition="top"
      items={tabItems.map(item => ({
        key: item.key,
        label: (
          <span>
            {item.icon}
            <span style={{ marginLeft: 8 }}>{item.label}</span>
          </span>
        )
      }))}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout style={{ padding: '0 24px 24px' }}>
        <div style={{ padding: '16px 0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>商品销售管理</h2>
          {isMobile && (
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setDrawerVisible(true)}
            />
          )}
        </div>
        
        {isMobile ? (
          <>
            <Drawer
              title="商品销售管理"
              placement="right"
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              width={250}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tabItems.map(item => (
                  <Button 
                    key={item.key}
                    type={activeKey === item.key ? "primary" : "text"}
                    icon={item.icon}
                    onClick={() => {
                      handleTabChange(item.key);
                      setDrawerVisible(false);
                    }}
                    style={{ marginBottom: 8, textAlign: 'left' }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </Drawer>
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                onClick={() => setDrawerVisible(true)}
                style={{ width: '100%' }}
              >
                {tabItems.find(item => item.key === activeKey)?.label || '选择功能'}
              </Button>
            </div>
          </>
        ) : (
          renderTabs()
        )}
        
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
            borderRadius: 4,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default GoodsSalesLayout; 