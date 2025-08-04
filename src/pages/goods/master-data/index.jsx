import React, { useState } from 'react';
import './index.css';
import { Tabs, Breadcrumb } from 'antd';
import ProductMaintenance from '../maintenance';
import CategoryManagement from '../category';
import ComboProduct from '../combo';
import ChangeRecord from '../shared/ChangeRecord';

const ProductMasterData = () => {
  const [activeTab, setActiveTab] = useState('maintenance');

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
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品主数据</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

export default ProductMasterData; 