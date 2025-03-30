import React, { useState, useEffect } from 'react';
import { Tabs, Card, Spin } from 'antd';
import DensityDataTab from './components/DensityDataTab';
import DensityHistoryTab from './components/DensityHistoryTab';
import DensityApprovalTab from './components/DensityApprovalTab';
import './index.css';

const { TabPane } = Tabs;

/**
 * 油品密度管理页面
 * 包含三个标签页：
 * 1. 油品密度数据 - 展示当前油品密度信息
 * 2. 密度调整历史 - 展示历史密度调整记录
 * 3. 审批中心 - 展示密度调整的审批信息
 */
const OilDensity = () => {
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('1');

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className="oil-density-container">
      <Spin spinning={loading}>
        <Card 
          title="油品密度管理" 
          bordered={false}
          className="oil-density-card"
        >
          <Tabs 
            activeKey={activeKey} 
            onChange={handleTabChange}
            type="card"
            size="large"
            className="density-tabs"
          >
            <TabPane tab="油品密度数据" key="1">
              <DensityDataTab />
            </TabPane>
            <TabPane tab="密度调整历史" key="2">
              <DensityHistoryTab />
            </TabPane>
            <TabPane tab="审批中心" key="3">
              <DensityApprovalTab />
            </TabPane>
          </Tabs>
        </Card>
      </Spin>
    </div>
  );
};

export default OilDensity; 