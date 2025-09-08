import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import './index.css';

// 导入各个子页面组件
import RecordsManagement from './records/RecordsManagement';
import RiskMonitor from './risk-monitor';
import StatisticsAnalysis from './statistics';
import RecordHistory from './shared/RecordHistory';

const InvoiceManagement = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'records',
      label: '开票记录',
      children: (
        <div>
          <RecordsManagement />
        </div>
      )
    },
    {
      key: 'risk-monitor',
      label: '风险监控',
      children: <RiskMonitor />
    },
    {
      key: 'statistics',
      label: '统计分析',
      children: <StatisticsAnalysis />
    },
    {
      key: 'record-history',
      label: '修改记录',
      children: <RecordHistory moduleType="invoice" />
    }
  ];

  return (
    <div className="invoice-management-container">
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
      
      <div className="page-remark">
        <p><strong>发票管理功能说明：</strong></p>
        <p>1. 开票记录：管理所有发票开具记录，支持查看、下载、重试、红冲等操作</p>
        <p>2. 风险监控：实时监控开票风险，包括频率控制、金额限制等</p>
        <p>3. 统计分析：提供开票数据的统计分析和报表功能</p>
        <p>4. 修改记录：记录所有开票相关操作的变更历史，便于审计追溯</p>
        <p>5. 发票设置功能已单独提取到二级菜单，包含油站配置、服务商设置、系统参数等</p>
      </div>
    </div>
  );
};

export default InvoiceManagement;