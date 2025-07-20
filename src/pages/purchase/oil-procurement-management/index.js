import React, { useState } from 'react';
import { 
  Card, 
  Tabs,
  Spin,
  Result
} from 'antd';
import './index.css';
import ProcurementApplication from './components/ProcurementApplication';
import OilReceiptManagement from './OilReceiptManagement';
import OilTransferManagement from './OilTransferManagement';
import OperationRecords from './OperationRecords';

const OilProcurementManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('purchase-order');

  const handleTabChange = (key) => {
    setActiveTab(key);
    console.log('切换到Tab:', key);
  };

  // Tab页面组件 - 开发中状态
  const DevelopingComponent = ({ title, description }) => (
    <Result
      icon={<div style={{ fontSize: '64px', color: '#1890ff' }}>🚧</div>}
      title={title}
      subTitle={description || "该功能正在开发中，敬请期待..."}
      style={{ 
        padding: '60px 0',
        background: '#fafafa',
        borderRadius: '8px',
        margin: '20px 0'
      }}
    />
  );

  const tabItems = [
    {
      key: 'oil-price-adjustment',
      label: (
        <span>
          油品维价
        </span>
      ),
      children: (
        <DevelopingComponent 
          title="油品维价管理"
          description="油品维价管理功能开发中..."
        />
      ),
    },
    {
      key: 'purchase-order',
      label: (
        <span>
          油品采购申请
        </span>
      ),
      children: <ProcurementApplication />,
    },
    {
      key: 'receiving-order',
      label: (
        <span>
          入库卸油
        </span>
      ),
      children: <OilReceiptManagement />,
    },
    {
      key: 'transfer-order',
      label: (
        <span>
          油品调拨
        </span>
      ),
      children: <OilTransferManagement />,
    },
    {
      key: 'operation-records',
      label: (
        <span>
          操作记录
        </span>
      ),
      children: <OperationRecords />,
    },

  ];

  return (
    <div className="oil-procurement-management-container">
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

export default OilProcurementManagement; 