import React from 'react';
import { Tabs, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import ControlFlow from './ControlFlow';
import AbandonedOrder from './AbandonedOrder';

const { TabPane } = Tabs;

const OrderQuery = () => {
  const navigate = useNavigate();

  return (
    <div className="order-query">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>销售数据查询</h2>
        <Button onClick={() => navigate('/sales/oil')}>返回油品销售管理</Button>
      </div>
      
      <Card>
        <Tabs defaultActiveKey="orderList" type="card">
          <TabPane tab="订单流水" key="orderList">
            <OrderList />
          </TabPane>
          <TabPane tab="订单明细" key="orderDetail">
            <OrderDetail />
          </TabPane>
          <TabPane tab="管控流水" key="controlFlow">
            <ControlFlow />
          </TabPane>
          <TabPane tab="管控弃单记录" key="abandonedOrder">
            <AbandonedOrder />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default OrderQuery; 