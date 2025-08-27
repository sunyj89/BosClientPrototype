import React from 'react';
import { Card, Tabs, Typography, Row, Col, Statistic, Space, List } from 'antd';
import { 
  BarChartOutlined, 
  FundOutlined, 
  DownloadOutlined, 
  UploadOutlined,
  CalculatorOutlined,
  ToolOutlined,
  WarningOutlined,
  CarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟库存统计数据
const inventoryStats = {
  totalOilVolume: 356800,
  alertCount: 3,
  stationCount: 15,
  incomingDelivery: 5,
  oilTypes: [
    { type: '92#汽油', volume: 156000, percentage: 43.7 },
    { type: '95#汽油', volume: 124500, percentage: 34.9 },
    { type: '98#汽油', volume: 32300, percentage: 9.1 },
    { type: '0#柴油', volume: 44000, percentage: 12.3 }
  ],
  alerts: [
    { station: '北京海淀油站', tankName: '2号油罐', oilType: '95#汽油', issueType: '库存过低', currentVolume: 2500, capacity: 30000 },
    { station: '上海黄浦油站', tankName: '1号油罐', oilType: '92#汽油', issueType: '库存过低', currentVolume: 3200, capacity: 40000 },
    { station: '广州天河油站', tankName: '3号油罐', oilType: '98#汽油', issueType: '库存不足', currentVolume: 2100, capacity: 20000 }
  ],
  recentDeliveries: [
    { date: '2023-03-10', station: '北京海淀油站', oilType: '92#汽油', volume: 8000 },
    { date: '2023-03-09', station: '上海黄浦油站', oilType: '95#汽油', volume: 9000 },
    { date: '2023-03-09', station: '上海黄浦油站', oilType: '98#汽油', volume: 6000 },
    { date: '2023-03-08', station: '北京朝阳油站', oilType: '0#柴油', volume: 6000 }
  ]
};

// 模块链接数据
const moduleLinks = [
  { title: '油品入库', icon: <DownloadOutlined />, path: '/inventory/oil-input' },
  { title: '油品调拨', icon: <UploadOutlined />, path: '/inventory/oil-transfer' },
  { title: '库存查询', icon: <CalculatorOutlined />, path: '/inventory/inventory-query' },
  { title: '自用领用', icon: <ToolOutlined />, path: '/inventory/self-use' },
  { title: '油罐加注', icon: <CarOutlined />, path: '/inventory/refill' }
];

const InventoryManagement = () => {
  return (
    <div className="inventory-management">
      <Title level={2}>油品库存管理</Title>
      <Paragraph style={{ marginBottom: 20 }}>
        管理各油站的油品库存情况，包括入库、调拨、自用领用等操作。
      </Paragraph>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总库存量(L)" 
              value={inventoryStats.totalOilVolume} 
              precision={0} 
              valueStyle={{ color: '#3f8600' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="库存预警" 
              value={inventoryStats.alertCount} 
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="油站数量" 
              value={inventoryStats.stationCount} 
              prefix={<FundOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="待入库配送" 
              value={inventoryStats.incomingDelivery} 
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <Card title="快速链接">
            <Row gutter={[16, 16]}>
              {moduleLinks.map((link, index) => (
                <Col xs={12} sm={8} md={8} lg={4} key={index}>
                  <Link to={link.path}>
                    <Card 
                      hoverable 
                      className="text-center" 
                      size="small"
                      style={{ textAlign: 'center', height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                      <Space direction="vertical">
                        <div style={{ fontSize: 24 }}>{link.icon}</div>
                        <div>{link.title}</div>
                      </Space>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
          
          <Card title="油品库存分布" style={{ marginTop: 16 }}>
            <List
              itemLayout="horizontal"
              dataSource={inventoryStats.oilTypes}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.type}
                    description={
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.volume.toLocaleString()} L</span>
                          <span>{item.percentage}%</span>
                        </div>
                        <div style={{ height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, marginTop: 5 }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${item.percentage}%`, 
                              backgroundColor: 
                                item.type === '92#汽油' ? '#52c41a' : 
                                item.type === '95#汽油' ? '#1890ff' : 
                                item.type === '98#汽油' ? '#722ed1' : 
                                '#fa8c16',
                              borderRadius: 4 
                            }} 
                          />
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="库存预警" className="warning-card">
            <List
              size="small"
              dataSource={inventoryStats.alerts}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div>
                        <span style={{ color: '#cf1322' }}><WarningOutlined /> {item.issueType}</span>
                        <span style={{ marginLeft: 10 }}>{item.station}</span>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.tankName} ({item.oilType})</div>
                        <div>当前库存: {item.currentVolume}L / {item.capacity}L ({((item.currentVolume / item.capacity) * 100).toFixed(1)}%)</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
          
          <Card title="最近入库记录" style={{ marginTop: 16 }}>
            <List
              size="small"
              dataSource={inventoryStats.recentDeliveries}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<div>{item.date} - {item.station}</div>}
                    description={<div>{item.oilType}: {item.volume.toLocaleString()}L</div>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InventoryManagement; 