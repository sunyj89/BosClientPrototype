import React from 'react';
import { Card, Typography, Space, Divider, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

const TestPage = () => {
  return (
    <div className="test-page">
      <Card title="测试页面">
        <Alert 
          message="测试环境" 
          description="这是一个测试页面，用于开发和调试使用。" 
          type="info" 
          showIcon 
          style={{ marginBottom: 20 }}
        />
        
        <Title level={2}>站点管理测试功能</Title>
        <Paragraph>
          本页面用于测试站点管理模块的各项功能，确保系统稳定运行。
        </Paragraph>
        
        <Divider />
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card title="功能列表" size="small">
            <ul>
              <li>站点基本信息管理</li>
              <li>站点设备管理</li>
              <li>站点人员管理</li>
              <li>站点销售数据查询</li>
              <li>站点油品库存管理</li>
              <li>站点配送管理</li>
            </ul>
          </Card>
          
          <Card title="测试说明" size="small">
            <Paragraph>
              <Text strong>测试环境：</Text> 开发环境
            </Paragraph>
            <Paragraph>
              <Text strong>测试数据：</Text> 模拟数据，非实际业务数据
            </Paragraph>
            <Paragraph>
              <Text strong>访问权限：</Text> 仅开发人员可用
            </Paragraph>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default TestPage; 