import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import OilList from './components/OilList';
import OilCategory from './components/OilCategory';
import ModifyRecord from './components/ModifyRecord';
import './OilMasterData.css';

const OilMasterData = () => {
  const [activeTab, setActiveTab] = useState('oilList');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'oilList',
      label: '油品列表',
      children: <OilList setLoading={setLoading} />
    },
    {
      key: 'oilCategory',
      label: '油品分类',
      children: <OilCategory setLoading={setLoading} />
    },
    {
      key: 'modifyRecord',
      label: '修改记录',
      children: <ModifyRecord setLoading={setLoading} />
    }
  ];

  return (
    <div className="oil-master-data-container">
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

export default OilMasterData; 