import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { 
  FileTextOutlined, 
  DollarOutlined, 
  BarChartOutlined, 
  TrophyOutlined, 
  TeamOutlined,
  ShoppingOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const GoodsSalesManagement = () => {
  const navigate = useNavigate();

  // 功能卡片数据
  const functionCards = [
    {
      title: '商品销售明细',
      icon: <FileTextOutlined style={{ fontSize: '36px', color: '#1890ff' }} />,
      description: '查询商品销售的详细记录',
      onClick: () => navigate('/sales/goods/detail'),
      color: '#e6f7ff',
      borderColor: '#91d5ff'
    },
    {
      title: '商品售价调整申请',
      icon: <DollarOutlined style={{ fontSize: '36px', color: '#52c41a' }} />,
      description: '申请调整商品售价',
      onClick: () => navigate('/sales/goods/price-adjustment'),
      color: '#f6ffed',
      borderColor: '#b7eb8f'
    },
    {
      title: '商品售价调价记录',
      icon: <FileTextOutlined style={{ fontSize: '36px', color: '#faad14' }} />,
      description: '查看商品售价调整历史记录',
      onClick: () => navigate('/sales/goods/price-history'),
      color: '#fffbe6',
      borderColor: '#ffe58f'
    },
    {
      title: '商品销售日报表',
      icon: <BarChartOutlined style={{ fontSize: '36px', color: '#eb2f96' }} />,
      description: '查看商品销售日报表数据',
      onClick: () => navigate('/sales/goods/daily-report'),
      color: '#fff0f6',
      borderColor: '#ffadd2'
    },
    {
      title: '商品销售排行',
      icon: <TrophyOutlined style={{ fontSize: '36px', color: '#722ed1' }} />,
      description: '按员工、分类、商品查看销售排行',
      onClick: () => navigate('/sales/goods/ranking'),
      color: '#f9f0ff',
      borderColor: '#d3adf7'
    },
    {
      title: '商品销售绩效',
      icon: <RiseOutlined style={{ fontSize: '36px', color: '#fa541c' }} />,
      description: '按员工、分类、商品查看销售绩效',
      onClick: () => navigate('/sales/goods/performance'),
      color: '#fff2e8',
      borderColor: '#ffbb96'
    },
    {
      title: '机构销售任务完成情况',
      icon: <TeamOutlined style={{ fontSize: '36px', color: '#13c2c2' }} />,
      description: '查看机构销售任务完成量及百分比',
      onClick: () => navigate('/sales/goods/organization-task'),
      color: '#e6fffb',
      borderColor: '#87e8de'
    }
  ];

  return (
    <div className="goods-sales-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>商品销售管理</h2>
        <Button onClick={() => navigate('/sales')}>返回销售管理</Button>
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

export default GoodsSalesManagement; 