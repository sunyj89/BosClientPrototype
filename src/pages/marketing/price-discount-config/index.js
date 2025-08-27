import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import DiscountConfigList from './components/DiscountConfigList';
import DiscountRules from './components/DiscountRules';
import ModifyRecord from './components/ModifyRecord';
import './PriceDiscountConfig.css';

const PriceDiscountConfig = () => {
  const [activeTab, setActiveTab] = useState('discountConfigList');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'discountConfigList',
      label: '优惠价格配置',
      children: <DiscountConfigList setLoading={setLoading} />
    },
    {
      key: 'discountRules',
      label: '价格优惠规则',
      children: <DiscountRules setLoading={setLoading} />
    },
    {
      key: 'modifyRecord',
      label: '修改记录',
      children: <ModifyRecord setLoading={setLoading} />
    }
  ];

  return (
    <div className="price-discount-config-container">
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
      
      {/* 备注信息 */}
      <div className="demo-note">
        <p>备注：本页面为价格优惠配置功能演示，包含优惠价格配置、价格优惠规则、修改记录三个功能模块。</p>
        <p>功能特点：</p>
        <ul>
          <li>支持面包屑分步创建/编辑优惠配置（第一步：基础信息配置，第二步：优惠规则设置）</li>
          <li>支持多种重复类型：每天重复、每周重复、每月重复、不重复</li>
          <li>支持多站点、多油品、多会员等级的优惠配置</li>
          <li>支持按原价或按升数的计算方式，每升直降或折扣优惠形式</li>
          <li>支持分级优惠规则，同一油品可设置多个优惠区间</li>
          <li>完整的审批流程控制，权限管理基于审批状态</li>
          <li>详细的修改记录跟踪，支持数据变更对比</li>
        </ul>
      </div>
    </div>
  );
};

export default PriceDiscountConfig;
