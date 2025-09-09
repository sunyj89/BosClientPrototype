import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs,
  Spin
} from 'antd';
import './index.css';

// 导入各个Tab页面组件
import PriceMaintenance from './components/PriceMaintenance';
import PurchaseOrder from './components/PurchaseOrder';
import PurchaseReceiving from './components/PurchaseReceiving';
import ReturnManagement from './components/ReturnManagement';
import StockTransfer from './components/StockTransfer';
import IntelligentReplenishment from './components/IntelligentReplenishment';
import PurchaseRequisition from './components/PurchaseRequisition';
import PurchaseRequisitionSummary from './components/PurchaseRequisitionSummary';

const NonOilProcurement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('purchase-requisition');

  useEffect(() => {
    // 页面初始化
    console.log('非油商品采购管理页面初始化');
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    console.log('切换到Tab:', key);
  };

  // Tab项配置
  const tabItems = [
    {
      key: 'purchase-requisition',
      label: '非油采购申请',
      children: <PurchaseRequisition />
    },
    {
      key: 'purchase-requisition-summary',
      label: '采购申请汇总',
      children: <PurchaseRequisitionSummary />
    },
    {
      key: 'price-maintenance',
      label: '价格维护',
      children: <PriceMaintenance />
    },
    {
      key: 'purchase-order',
      label: '采购订单',
      children: <PurchaseOrder />
    },
    {
      key: 'purchase-receiving',
      label: '采购入库',
      children: <PurchaseReceiving />
    },
    {
      key: 'return-management',
      label: '退货管理',
      children: <ReturnManagement />
    },
    {
      key: 'stock-transfer',
      label: '仓间调拨',
      children: <StockTransfer />
    },
    {
      key: 'intelligent-replenishment',
      label: '智能补货',
      children: <IntelligentReplenishment />
    }
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

export default NonOilProcurement; 