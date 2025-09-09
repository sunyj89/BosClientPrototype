import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import { SettingOutlined, TrophyOutlined, HistoryOutlined } from '@ant-design/icons';
import RuleManagement from './components/RuleManagement';
import LevelStatistics from './components/LevelStatistics';
import ModificationRecords from './components/ModificationRecords';
import './index.css';

const MemberLevel = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'rules',
      label: (
        <span>
          <SettingOutlined />
          定级规则管理
        </span>
      ),
      children: <RuleManagement />,
    },
    {
      key: 'statistics',
      label: (
        <span>
          <TrophyOutlined />
          等级数据统计
        </span>
      ),
      children: <LevelStatistics />,
    },
    {
      key: 'records',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: <ModificationRecords />,
    },
  ];

  return (
    <div className="module-container">
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

export default MemberLevel;