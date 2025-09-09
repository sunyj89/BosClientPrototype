import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import { GiftOutlined, BarChartOutlined, SettingOutlined, HistoryOutlined } from '@ant-design/icons';
import CouponList from './components/CouponList';
import CouponStatistics from './components/CouponStatistics';
import GlobalRestrictions from './components/GlobalRestrictions';
import CouponChangeRecord from './components/CouponChangeRecord';
import './index.css';

const CouponConfig = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'list',
      label: (
        <span>
          <GiftOutlined />
          优惠券列表
        </span>
      ),
      children: <CouponList />,
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          优惠券统计
        </span>
      ),
      children: <CouponStatistics />,
    },
    {
      key: 'global',
      label: (
        <span>
          <SettingOutlined />
          全局限制
        </span>
      ),
      children: <GlobalRestrictions />,
    },
    {
      key: 'record',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: <CouponChangeRecord />,
    },
  ];

  return (
    <div className="coupon-config-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default CouponConfig; 