import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import RecordsManagement from './RecordsManagement';
import RecordHistory from '../shared/RecordHistory';
import './index.css';

const InvoiceRecords = () => {
  const [activeTab, setActiveTab] = useState('records');

  const tabItems = [
    {
      key: 'records',
      label: '开票记录',
      children: <RecordsManagement />
    },
    {
      key: 'record-history',
      label: '修改记录',
      children: <RecordHistory moduleType="invoice-records" />
    }
  ];

  return (
    <div className="invoice-records-container">
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: '16px' }}
          items={tabItems}
        />
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
        <br />1. 开票记录：查看和管理所有发票开具记录，支持多种筛选和导出功能
        <br />2. 支持发票查看、下载、重试开票、重发邮件、红冲申请等操作
        <br />3. 修改记录：记录所有开票记录的变更历史，包括状态变更、信息修改等
        <br />4. 提供完整的操作审计追踪，便于问题排查和合规审计
        <br />5. 演示时请重点展示开票记录的查询功能和修改记录的追溯能力
      </div>
    </div>
  );
};

export default InvoiceRecords;