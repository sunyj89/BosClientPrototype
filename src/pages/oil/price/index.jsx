import React, { useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
import OilPriceQuery from './components/OilPriceQuery';
import OilPriceAdjustment from './components/OilPriceAdjustment';
import NDRCPriceMaintenance from './components/NDRCPriceMaintenance';
import ModifyRecord from './components/ModifyRecord';
import './OilPrice.css';

const OilPrice = () => {
  const [activeTab, setActiveTab] = useState('oilPriceQuery');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'oilPriceQuery',
      label: '油价查询',
      children: <OilPriceQuery setLoading={setLoading} />
    },
    {
      key: 'oilPriceAdjustment',
      label: '油价调整',
      children: <OilPriceAdjustment setLoading={setLoading} />
    },
    {
      key: 'ndrcPriceMaintenance',
      label: '发改委价格维护',
      children: <NDRCPriceMaintenance setLoading={setLoading} />
    },
    {
      key: 'modifyRecord',
      label: '修改记录',
      children: <ModifyRecord setLoading={setLoading} />
    }
  ];

  return (
    <div className="oil-price-container">
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
        <p>备注：本页面为油价管理功能演示，包含油价查询、油价调整、发改委价格维护、修改记录四个功能模块。</p>
        <p>功能特点：</p>
        <ul>
          <li><strong>油价查询：</strong>展示当前生效中的油价数据，仅显示审批通过且生效的价格</li>
          <li><strong>油价调整：</strong>支持创建调价单，包含12位唯一调价单ID，调价类型支持批量调价和单站调价</li>
          <li><strong>发改委价格维护：</strong>维护发改委指导价格，支持查看和编辑功能</li>
          <li><strong>修改记录：</strong>记录所有价格变更操作的详细历史</li>
          <li>调价页面支持按省份查询最新发改委价格作为参考</li>
          <li>调价方式简化为直接设定新价格，操作更直观</li>
          <li>调价单状态流转：待提交→审批中→审批通过→已执行</li>
        </ul>
      </div>
    </div>
  );
};

export default OilPrice;
