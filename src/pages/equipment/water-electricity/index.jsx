import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin } from 'antd';
import HandoverRecords from './components/HandoverRecords';
import MonthlyReports from './components/MonthlyReports';
import ModifyRecords from './components/ModifyRecords';
import './index.css';

const WaterElectricityRecords = () => {
  const [activeTab, setActiveTab] = useState('handover');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'handover',
      label: '水电表交接明细',
      children: <HandoverRecords />
    },
    {
      key: 'monthly',
      label: '水电表月报表',
      children: <MonthlyReports />
    },
    {
      key: 'modify',
      label: '修改记录',
      children: <ModifyRecords />
    }
  ];

  return (
    <div className="water-electricity-container">
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

export default WaterElectricityRecords; 