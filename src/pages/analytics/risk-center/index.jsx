import React from 'react';
import { Card, Result } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import './index.css';

const RiskCenter = () => {
  return (
    <div className="risk-center-container">
      <Card>
        <Result
          icon={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
          title="风险监控中心"
          subTitle="该功能正在紧张开发中，敬请期待..."
          extra={
            <div style={{ color: '#666', fontSize: '14px' }}>
              功能包含：风险预警、异常监控、合规检查等
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default RiskCenter;