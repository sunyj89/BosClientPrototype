import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import OilList from './components/OilList';
import OilCategory from './components/OilCategory';
import ModifyRecord from './components/ModifyRecord';
import './OilMasterData.css';

const OilMasterData = () => {
  const [activeTab, setActiveTab] = useState('oilList');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'oilList',
      label: '油品列表',
      children: <OilList setLoading={setLoading} />
    },
    {
      key: 'oilCategory',
      label: '油品分类',
      children: <OilCategory setLoading={setLoading} />
    },
    {
      key: 'modifyRecord',
      label: '修改记录',
      children: <ModifyRecord setLoading={setLoading} />
    }
  ];

  return (
    <div className="oil-master-data-container">
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
      
      {/* 页面备注信息 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f0f2f5',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666',
        borderLeft: '4px solid #1890ff'
      }}>
        <strong>功能说明：</strong>
        <br />1. 新增了油品财务信息管理功能，包括进项税（必填）、销项税（必填）等字段
        <br />2. 新增税收分类（纯数字，非必填）和税率（非必填）字段
        <br />3. 新增ERP商品编码和ERP分类编码字段，便于与外部ERP系统集成
        <br />4. 表单验证：进项税和销项税为必填项，税率范围0-100%
        <br />5. 演示时请重点展示新建和编辑油品时的财务信息必填验证
      </div>
    </div>
  );
};

export default OilMasterData; 