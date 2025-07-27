import React from 'react';
import { Card, Result } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import './index.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Card>
        <Result
          icon={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
          title="大数据超脑大屏"
          subTitle="该功能正在紧张开发中，敬请期待..."
          extra={
            <div style={{ color: '#666', fontSize: '14px' }}>
              功能包含：实时数据监控、智能分析、可视化大屏等
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default Dashboard;