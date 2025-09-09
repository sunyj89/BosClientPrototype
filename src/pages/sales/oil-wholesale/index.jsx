import React from 'react';
import { Card, Tabs } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import OrderNotificationManagement from './components/OrderNotificationManagement';
import ReceiptConfirmationManagement from './components/ReceiptConfirmationManagement';
import ModificationRecords from './components/ModificationRecords';
import './index.css';

const OilWholesaleManagement = () => {
  const tabItems = [
    {
      key: 'order-notification',
      label: (
        <span>
          <FileTextOutlined />
          订货通知单
        </span>
      ),
      children: <OrderNotificationManagement />,
    },
    {
      key: 'receipt-confirmation',
      label: (
        <span>
          <CheckCircleOutlined />
          收货确认单
        </span>
      ),
      children: <ReceiptConfirmationManagement />,
    },
    {
      key: 'modification-records',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: <ModificationRecords />,
    },
  ];

  return (
    <div className="module-container">
      <Card>
        <Tabs 
          size="large"
          tabBarStyle={{ marginBottom: '16px' }}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default OilWholesaleManagement;