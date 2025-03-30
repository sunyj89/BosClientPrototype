import React from 'react';
import { Tabs } from 'antd';
import OilSupplier from './OilSupplier';
import GoodsSupplier from './GoodsSupplier';

const { TabPane } = Tabs;

const SupplierManagement = () => {
  return (
    <div className="supplier-management">
      <Tabs defaultActiveKey="1">
        <TabPane tab="油品供应商" key="1">
          <OilSupplier />
        </TabPane>
        <TabPane tab="商品供应商" key="2">
          <GoodsSupplier />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SupplierManagement; 