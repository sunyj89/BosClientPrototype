import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { 
  SearchOutlined, 
  DollarOutlined, 
  BarChartOutlined, 
  EditOutlined, 
  ShoppingCartOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const OilSalesManagement = () => {
  const navigate = useNavigate();

  // 功能卡片数据
  const functionCards = [
    {
      title: '销售数据查询',
      icon: <SearchOutlined style={{ fontSize: '36px', color: '#1890ff' }} />,
      description: '查询订单流水、订单明细、管控流水和管控弃单记录',
      onClick: () => navigate('/sales/oil/query/order'),
      color: '#e6f7ff',
      borderColor: '#91d5ff'
    },
    {
      title: '价格管理',
      icon: <DollarOutlined style={{ fontSize: '36px', color: '#52c41a' }} />,
      description: '管理油品调价申请单、油枪价格调整申请和预约油品调价',
      onClick: () => navigate('/sales/oil/price'),
      color: '#f6ffed',
      borderColor: '#b7eb8f'
    },
    {
      title: '任务目标',
      icon: <BarChartOutlined style={{ fontSize: '36px', color: '#faad14' }} />,
      description: '管理销售目标任务申请单及明细',
      onClick: () => navigate('/sales/oil/target/application'),
      color: '#fffbe6',
      borderColor: '#ffe58f'
    },
    {
      title: '数据冲正管理',
      icon: <EditOutlined style={{ fontSize: '36px', color: '#eb2f96' }} />,
      description: '管理销售数据修正申请单及统计',
      onClick: () => navigate('/sales/oil/correction/application'),
      color: '#fff0f6',
      borderColor: '#ffadd2'
    },
    {
      title: '油品直销',
      icon: <ShoppingCartOutlined style={{ fontSize: '36px', color: '#722ed1' }} />,
      description: '管理油品直销单及统计',
      onClick: () => navigate('/sales/oil/direct/order'),
      color: '#f9f0ff',
      borderColor: '#d3adf7'
    }
  ];

  return (
    <div className="oil-sales-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>油品销售管理</h2>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/sales')}
          style={{ backgroundColor: '#32AF50', borderColor: '#32AF50' }}
        >
          返回销售管理
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        {functionCards.map((card, index) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={8} key={index}>
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
    </div>
  );
};

export default OilSalesManagement; 