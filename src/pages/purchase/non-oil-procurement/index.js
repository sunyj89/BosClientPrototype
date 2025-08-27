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

const { TabPane } = Tabs;

const NonOilProcurement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('price-maintenance');

  useEffect(() => {
    // 页面初始化
    console.log('非油商品采购管理页面初始化');
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    console.log('切换到Tab:', key);
  };

  return (
    <div className="non-oil-procurement-container">
      <Card 
      >
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            <TabPane tab="价格维护" key="price-maintenance">
              <PriceMaintenance />
            </TabPane>
            
            <TabPane tab="采购订单" key="purchase-order">
              <PurchaseOrder />
            </TabPane>
            
            <TabPane tab="采购入库" key="purchase-receiving">
              <PurchaseReceiving />
            </TabPane>
            
            <TabPane tab="退货管理" key="return-management">
              <ReturnManagement />
            </TabPane>
            
            <TabPane tab="仓间调拨" key="stock-transfer">
              <StockTransfer />
            </TabPane>
            
            <TabPane tab="智能补货" key="intelligent-replenishment">
              <IntelligentReplenishment />
            </TabPane>
          </Tabs>
        </Spin>
      </Card>
    </div>
  );
};

export default NonOilProcurement; 