import React from 'react';
import { Card, Result } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import './index.css';

const ShiftHandoverReport = () => {
  return (
    <div className="shift-handover-report-container">
      <Card>
        <Result
          icon={<ToolOutlined style={{ color: '#32AF50' }} />}
          title="01加油站交接班报表"
          subTitle="该功能正在开发中，敬请期待..."
          extra={
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
              color: '#52c41a'
            }}>
              <p style={{ margin: 0, fontWeight: 500 }}>
                🚧 功能开发中
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                该报表模块将提供加油站交接班数据的查询、统计和导出功能
              </p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default ShiftHandoverReport; 