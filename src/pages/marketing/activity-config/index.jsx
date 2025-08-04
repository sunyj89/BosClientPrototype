import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import { 
  RedEnvelopeOutlined, 
  UserAddOutlined, 
  GiftOutlined, 
  TeamOutlined, 
  BarChartOutlined, 
  HistoryOutlined 
} from '@ant-design/icons';
import RedEnvelopeActivity from './components/RedEnvelopeActivity';
import InviteFriends from './components/InviteFriends';
import LotteryActivity from './components/LotteryActivity';
import GroupBuyActivity from './components/GroupBuyActivity';
import ActivityStatistics from './components/ActivityStatistics';
import ActivityChangeRecord from './components/ActivityChangeRecord';
import './index.css';

const ActivityConfig = () => {
  const [activeTab, setActiveTab] = useState('redenvelope');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'redenvelope',
      label: (
        <span>
          <RedEnvelopeOutlined />
          红包活动
        </span>
      ),
      children: <RedEnvelopeActivity />,
    },
    {
      key: 'invite',
      label: (
        <span>
          <UserAddOutlined />
          邀请好友
        </span>
      ),
      children: <InviteFriends />,
    },
    {
      key: 'lottery',
      label: (
        <span>
          <GiftOutlined />
          抽奖活动
        </span>
      ),
      children: <LotteryActivity />,
    },
    {
      key: 'groupbuy',
      label: (
        <span>
          <TeamOutlined />
          拼团活动
        </span>
      ),
      children: <GroupBuyActivity />,
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          活动统计
        </span>
      ),
      children: <ActivityStatistics />,
    },
    {
      key: 'record',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: <ActivityChangeRecord />,
    },
  ];

  return (
    <div className="activity-config-container">
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

export default ActivityConfig; 