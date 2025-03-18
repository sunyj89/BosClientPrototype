import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { LineChartOutlined, ShoppingOutlined, BarChartOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SalesManagement = () => {
  const navigate = useNavigate();

  // 功能卡片数据
  const functionCards = [
    {
      title: '油品销售管理',
      icon: <LineChartOutlined style={{ fontSize: '36px', color: '#1890ff' }} />,
      description: '管理油品销售数据、价格、任务目标、数据冲正和直销业务',
      onClick: () => navigate('/sales/oil'),
      color: '#e6f7ff',
      borderColor: '#91d5ff'
    },
    {
      title: '商品销售管理',
      icon: <ShoppingOutlined style={{ fontSize: '36px', color: '#52c41a' }} />,
      description: '管理商品销售明细、价格调整、销售报表和绩效分析',
      onClick: () => navigate('/sales/goods'),
      color: '#f6ffed',
      borderColor: '#b7eb8f'
    }
  ];

  return (
    <div className="sales-management">
      <h2 style={{ marginBottom: '20px' }}>销售管理</h2>
      
      <Row gutter={[16, 16]}>
        {functionCards.map((card, index) => (
          <Col xs={24} sm={12} md={12} lg={8} xl={8} key={index}>
            <Card 
              hoverable
              style={{ 
                height: '100%', 
                backgroundColor: card.color,
                borderColor: card.borderColor,
                borderWidth: '1px'
              }}
              onClick={card.onClick}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {card.icon}
              </div>
              <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>{card.title}</h3>
              <p style={{ textAlign: 'center' }}>{card.description}</p>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="primary" onClick={card.onClick}>
                  进入管理
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="销售数据概览" extra={<a href="#">更多</a>}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff', marginRight: '20px' }} />
                    <div>
                      <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)' }}>本月油品销售额</div>
                      <div style={{ fontSize: '24px' }}>¥ 1,284,500</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DollarOutlined style={{ fontSize: '48px', color: '#52c41a', marginRight: '20px' }} />
                    <div>
                      <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)' }}>本月商品销售额</div>
                      <div style={{ fontSize: '24px' }}>¥ 328,650</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesManagement; 