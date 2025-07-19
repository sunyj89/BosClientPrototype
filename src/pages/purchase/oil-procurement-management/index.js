import React, { useState } from 'react';
import { 
  Card, 
  Tabs,
  Spin,
  Result
} from 'antd';
import './index.css';
import ProcurementApplication from './components/ProcurementApplication';

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
      children: (
        <DevelopingComponent 
          title="入库卸油管理"
          description="油品入库、卸油据管理功能开发中..."
        />
      ),
    },
    {
      key: 'transfer-order',
      label: (
        <span>
          油品调拨
        </span>
      ),
      children: (
        <DevelopingComponent 
          title="油品调拨管理"
          description="油品库存调拨、转移据管理功能开发中..."
        />
      ),
    },
    {
      key: 'return-application',
      label: (
        <span>
          油品退货
        </span>
      ),
      children: (
        <DevelopingComponent 
          title="油品退货管理"
          description="油品退货申请、审批、处理流程功能开发中..."
        />
      ),
    },
    {
      key: 'operation-records',
      label: (
        <span>
          操作记录
        </span>
      ),
      children: (
        <DevelopingComponent 
          title="操作记录查询"
          description="采购相关操作日志记录和查询功能开发中..."
        />
      ),
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