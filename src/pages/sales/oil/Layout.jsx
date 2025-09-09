import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Button, Drawer } from 'antd';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  MenuOutlined,
  DollarOutlined,
  BarChartOutlined,
  EditOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import './Layout.css';

const { Content } = Layout;

const OilSalesLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeKey, setActiveKey] = useState('query');

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

  // 根据当前路径设置活动的标签页
  useEffect(() => {
    if (location.pathname.includes('/sales/oil/query')) {
      setActiveKey('query');
    } else if (location.pathname.includes('/sales/oil/price')) {
      setActiveKey('price');
    } else if (location.pathname.includes('/sales/oil/target')) {
      setActiveKey('target');
    } else if (location.pathname.includes('/sales/oil/correction')) {
      setActiveKey('correction');
    } else if (location.pathname.includes('/sales/oil/direct')) {
      setActiveKey('direct');
    } else {
      setActiveKey('query');
    }
  }, [location.pathname]);

  // 标签页项目
  const tabItems = [
    {
      key: 'query',
      label: (
        <span>
          <SearchOutlined />
          销售数据查询
        </span>
      ),
      children: (
        <Tabs
          activeKey={location.pathname}
          onChange={(key) => navigate(key)}
          className="oil-sales-subtabs"
          items={[
            {
              key: '/sales/oil/query/order',
              label: '订单流水',
            },
            {
              key: '/sales/oil/query/detail',
              label: '订单明细',
            },
            {
              key: '/sales/oil/query/control',
              label: '管控流水',
            },
            {
              key: '/sales/oil/query/abandoned',
              label: '管控弃单记录',
            },
          ]}
        />
      ),
    },
    {
      key: 'price',
      label: (
        <span>
          <DollarOutlined />
          价格管理
        </span>
      ),
      children: (
        <Tabs
          activeKey={location.pathname}
          onChange={(key) => navigate(key)}
          className="oil-sales-subtabs"
          items={[
            {
              key: '/sales/oil/price',
              label: '油品价格管理',
            },
            {
              key: '/sales/oil/price/application',
              label: '油品调价申请单',
            },
          ]}
        />
      ),
    },
    {
      key: 'target',
      label: (
        <span>
          <BarChartOutlined />
          任务目标
        </span>
      ),
      children: (
        <Tabs
          activeKey={location.pathname}
          onChange={(key) => navigate(key)}
          className="oil-sales-subtabs"
          items={[
            {
              key: '/sales/oil/target/application',
              label: '销售目标申请单',
            },
          ]}
        />
      ),
    },
    {
      key: 'correction',
      label: (
        <span>
          <EditOutlined />
          数据冲正管理
        </span>
      ),
      children: (
        <Tabs
          activeKey={location.pathname}
          onChange={(key) => navigate(key)}
          className="oil-sales-subtabs"
          items={[
            {
              key: '/sales/oil/correction',
              label: '销售数据修正管理',
            },
          ]}
        />
      ),
    },
    {
      key: 'direct',
      label: (
        <span>
          <ShoppingCartOutlined />
          油品直销
        </span>
      ),
      children: (
        <Tabs
          activeKey={location.pathname}
          onChange={(key) => navigate(key)}
          className="oil-sales-subtabs"
          items={[
            {
              key: '/sales/oil/direct',
              label: '油品直销管理',
            },
          ]}
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveKey(key);
    // 根据选中的标签页导航到对应的默认路由
    switch (key) {
      case 'query':
        navigate('/sales/oil/query/order');
        break;
      case 'price':
        navigate('/sales/oil/price');
        break;
      case 'target':
        navigate('/sales/oil/target/application');
        break;
      case 'correction':
        navigate('/sales/oil/correction');
        break;
      case 'direct':
        navigate('/sales/oil/direct');
        break;
      default:
        navigate('/sales/oil');
    }
  };

  const renderTabs = () => (
    <div style={{ width: '100%' }}>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        type="card"
        size="large"
        className="oil-sales-tabs"
        tabPosition="top"
        tabBarGutter={0}
        tabBarStyle={{ marginBottom: 0 }}
        items={tabItems}
        centered={false}
        tabBarExtraContent={{
          right: isMobile ? null : (
            <Button 
              type="primary" 
              onClick={() => navigate('/sales')}
              style={{ margin: '0 16px', backgroundColor: '#32AF50', borderColor: '#32AF50' }}
            >
              返回销售管理
            </Button>
          )
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: '0 16px' }}>
      {isMobile ? (
        <>
          <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>油品销售管理</h2>
            <Button 
              type="primary" 
              icon={<MenuOutlined />} 
              onClick={() => setDrawerVisible(true)}
            />
          </div>
          <Drawer
            title="油品销售管理"
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={300}
          >
            {renderTabs()}
          </Drawer>
        </>
      ) : (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ marginBottom: '16px' }}>油品销售管理</h2>
          {renderTabs()}
        </div>
      )}

      <Content
        style={{
          background: '#fff',
          padding: 24,
          margin: '16px 0',
          minHeight: 280,
          borderRadius: 4,
        }}
      >
        <Outlet />
      </Content>
    </div>
  );
};

export default OilSalesLayout; 