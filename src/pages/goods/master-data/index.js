import React, { useState } from 'react';
import './index.css';
import { Tabs, Card, Spin } from 'antd';
import ProductMaintenance from '../maintenance';
import CategoryManagement from '../category';
import ComboProduct from '../combo';
import ChangeRecord from '../shared/ChangeRecord';

const ProductMasterData = () => {
  const [activeTab, setActiveTab] = useState('maintenance');
  const [loading, setLoading] = useState(false);

  const tabItems = [
    {
      key: 'maintenance',
      label: '商品维护',
      children: <ProductMaintenance />,
    },
    {
      key: 'category',
      label: '分类管理',
      children: <CategoryManagement />,
    },
    {
      key: 'combo',
      label: '组合商品',
      children: <ComboProduct />,
    },
    {
      key: 'record',
      label: '修改记录',
      children: <ChangeRecord />,
    },
  ];

  return (
    <div className="module-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default ProductMasterData; 