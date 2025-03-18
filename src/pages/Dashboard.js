import React from 'react';
import { Row, Col, Card, Statistic, Table, Button, Breadcrumb } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  ShopOutlined, 
  UserOutlined, 
  ShoppingOutlined, 
  DollarOutlined 
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const Dashboard = () => {
  // 销售趋势图表配置
  const salesOption = {
    title: {
      text: '近7天销售趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['油品销售', '非油品销售'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '油品销售',
        type: 'line',
        data: [12000, 13200, 10100, 13400, 15000, 16400, 17500],
      },
      {
        name: '非油品销售',
        type: 'line',
        data: [2200, 1820, 1910, 2340, 2900, 3300, 3100],
      },
    ],
  };

  // 销售占比图表配置
  const pieOption = {
    title: {
      text: '销售占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['92#汽油', '95#汽油', '0#柴油', '食品饮料', '汽车用品'],
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 35000, name: '92#汽油' },
          { value: 25000, name: '95#汽油' },
          { value: 18000, name: '0#柴油' },
          { value: 8000, name: '食品饮料' },
          { value: 6000, name: '汽车用品' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 最近交易数据
  const recentTransactions = [
    {
      key: '1',
      id: 'TX20250312001',
      time: '2025-03-12 08:23:15',
      type: '92#汽油',
      amount: '￥350.00',
      status: '已完成',
    },
    {
      key: '2',
      id: 'TX20250312002',
      time: '2025-03-12 09:15:32',
      type: '95#汽油',
      amount: '￥420.00',
      status: '已完成',
    },
    {
      key: '3',
      id: 'TX20250312003',
      time: '2025-03-12 10:05:47',
      type: '0#柴油',
      amount: '￥680.00',
      status: '已完成',
    },
    {
      key: '4',
      id: 'TX20250312004',
      time: '2025-03-12 11:30:22',
      type: '非油品',
      amount: '￥85.00',
      status: '已完成',
    },
    {
      key: '5',
      id: 'TX20250312005',
      time: '2025-03-12 12:45:18',
      type: '92#汽油',
      amount: '￥280.00',
      status: '已完成',
    },
  ];

  // 交易表格列配置
  const columns = [
    {
      title: '交易编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '交易时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: () => <Button type="link">查看详情</Button>,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>仪表盘</Breadcrumb.Item>
        </Breadcrumb>
        <h2>仪表盘</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="今日销售额"
              value={98765}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="元"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ marginRight: 16 }}>
                周同比 <ArrowUpOutlined style={{ color: '#3f8600' }} /> 12%
              </span>
              <span>
                日同比 <ArrowUpOutlined style={{ color: '#3f8600' }} /> 8%
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="今日交易量"
              value={846}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShopOutlined />}
              suffix="笔"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ marginRight: 16 }}>
                周同比 <ArrowUpOutlined style={{ color: '#3f8600' }} /> 5%
              </span>
              <span>
                日同比 <ArrowDownOutlined style={{ color: '#cf1322' }} /> 2%
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="会员数"
              value={12845}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
              suffix="人"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ marginRight: 16 }}>
                周新增 <span style={{ color: '#3f8600' }}>125</span>
              </span>
              <span>
                月新增 <span style={{ color: '#3f8600' }}>485</span>
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="商品库存预警"
              value={5}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ShoppingOutlined />}
              suffix="项"
            />
            <div style={{ marginTop: 8 }}>
              <Button type="link" style={{ padding: 0 }}>
                查看详情
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="销售趋势" className="dashboard-card">
            <ReactECharts option={salesOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="销售占比" className="dashboard-card">
            <ReactECharts option={pieOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      {/* 最近交易 */}
      <Card title="最近交易" className="dashboard-card">
        <Table columns={columns} dataSource={recentTransactions} pagination={false} />
      </Card>
    </div>
  );
};

export default Dashboard; 