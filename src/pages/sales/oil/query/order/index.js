import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Table, Row, Col, Tag, Space, Breadcrumb } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined, EyeOutlined, HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 定义状态颜色映射
const statusColors = { '已完成': 'success', '已取消': 'error', '处理中': 'processing' };

// 模拟数据
const generateMockData = (count) => {
  const data = [];
  const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
  const paymentMethods = ['现金', '微信', '支付宝', '银行卡', '会员卡'];
  const statuses = ['已完成', '已取消', '处理中'];
  
  for (let i = 0; i < count; i++) {
    const oilType = oilTypes[Math.floor(Math.random() * oilTypes.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    data.push({
      key: i,
      orderId: `ORD${moment().format('YYYYMMDD')}${String(i + 1001).padStart(4, '0')}`,
      transactionDate: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
      stationName: `测试油站${Math.floor(Math.random() * 10) + 1}`,
      oilType,
      gunNumber: Math.floor(Math.random() * 12) + 1,
      quantity: (Math.random() * 100 + 10).toFixed(2),
      unitPrice: (Math.random() * 2 + 6).toFixed(2),
      amount: (Math.random() * 1000 + 100).toFixed(2),
      paymentMethod,
      operator: `操作员${Math.floor(Math.random() * 5) + 1}`,
      status,
    });
  }
  
  return data;
};

const OrderList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(generateMockData(20));
  
  const handleSearch = (values) => {
    console.log('Search values:', values);
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      setData(generateMockData(20));
      setLoading(false);
    }, 500);
  };
  
  const handleReset = () => {
    form.resetFields();
  };
  
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 180,
    },
    {
      title: '交易时间',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 180,
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '油枪号',
      dataIndex: 'gunNumber',
      key: 'gunNumber',
      width: 80,
    },
    {
      title: '加油量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
    },
    {
      title: '单价(元/L)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      align: 'right',
      render: (text) => `¥${text}`,
    },
    {
      title: '交易金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (text) => `¥${text}`,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <Tag color={statusColors[text]}>{text}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} size="small">
            查看
          </Button>
        </Space>
      ),
    },
  ];
  
  // 统计数据
  const stats = {
    totalOrders: data.length,
    completedOrders: data.filter(item => item.status === '已完成').length,
    totalAmount: data.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2),
    averageAmount: (data.reduce((sum, item) => sum + parseFloat(item.amount), 0) / data.length).toFixed(2)
  };
  
  return (
    <div className="order-list">
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard"><HomeOutlined /> 首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales">销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales/oil">油品销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>订单流水</Breadcrumb.Item>
      </Breadcrumb>
      
      <div style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>订单总数</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalOrders}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>已完成订单</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.completedOrders}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#fff2e8', borderColor: '#ffbb96' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>销售总金额</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{stats.totalAmount}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#f9f0ff', borderColor: '#d3adf7' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>平均订单金额</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{stats.averageAmount}</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      
      <Card title="查询条件" style={{ marginBottom: '20px' }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
        >
          <Form.Item name="orderId" label="订单编号">
            <Input placeholder="请输入订单编号" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="dateRange" label="交易时间">
            <RangePicker style={{ width: 300 }} />
          </Form.Item>
          <Form.Item name="stationName" label="油站名称">
            <Select placeholder="请选择油站" style={{ width: 200 }} allowClear>
              <Option value="station1">测试油站1</Option>
              <Option value="station2">测试油站2</Option>
              <Option value="station3">测试油站3</Option>
            </Select>
          </Form.Item>
          <Form.Item name="oilType" label="油品类型">
            <Select placeholder="请选择油品" style={{ width: 120 }} allowClear>
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
              <Option value="已完成">已完成</Option>
              <Option value="已取消">已取消</Option>
              <Option value="处理中">处理中</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginLeft: 'auto' }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<ExportOutlined />}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="订单流水列表">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default OrderList; 