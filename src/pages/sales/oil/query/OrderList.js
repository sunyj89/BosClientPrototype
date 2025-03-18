import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Table, 
  Row, 
  Col, 
  Breadcrumb,
  Tag,
  Statistic,
  Space
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  FileExcelOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 定义状态颜色映射
const statusColors = {
  '已完成': 'success',
  '已取消': 'error',
  '处理中': 'processing'
};

const OrderList = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setOrderData(generateMockData());
      setLoading(false);
    }, 500);
  };

  // 模拟数据
  const generateMockData = () => {
    return Array.from({ length: 20 }).map((_, index) => ({
      id: `ORD${String(index + 1).padStart(6, '0')}`,
      orderDate: `2023-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
      stationName: `油站${Math.floor(Math.random() * 5) + 1}`,
      oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][Math.floor(Math.random() * 4)],
      oilGunNumber: `${Math.floor(Math.random() * 10) + 1}号枪`,
      quantity: (Math.random() * 100 + 10).toFixed(2),
      unitPrice: (Math.random() * 10 + 5).toFixed(2),
      amount: (Math.random() * 1000 + 100).toFixed(2),
      paymentMethod: ['现金', '微信', '支付宝', '银行卡', '会员卡'][Math.floor(Math.random() * 5)],
      operatorName: `员工${Math.floor(Math.random() * 10) + 1}`,
      status: ['已完成', '已取消', '处理中'][Math.floor(Math.random() * 3)],
    }));
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalOrders: orderData.length,
      completedOrders: orderData.filter(o => o.status === '已完成').length,
      totalAmount: orderData.reduce((sum, o) => sum + parseFloat(o.amount), 0).toFixed(2),
      averageAmount: (orderData.reduce((sum, o) => sum + parseFloat(o.amount), 0) / (orderData.length || 1)).toFixed(2)
    };
  };

  const stats = getStatistics();

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '交易日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 120,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '油枪号',
      dataIndex: 'oilGunNumber',
      key: 'oilGunNumber',
      width: 100,
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
    },
    {
      title: '交易金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
    },
    {
      title: '操作员',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        return <Tag color={statusColors[status]}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<FileTextOutlined />}
          onClick={() => console.log('查看详情', record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const handleSearch = (values) => {
    console.log('查询条件:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleExport = () => {
    console.log('导出数据');
  };

  return (
    <div className="order-list">
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/sales">销售管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/sales/oil">油品销售管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>订单流水</Breadcrumb.Item>
        </Breadcrumb>
        <h2>订单流水查询</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="订单总数" 
              value={stats.totalOrders} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已完成订单" 
              value={stats.completedOrders} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="销售总金额" 
              value={stats.totalAmount} 
              valueStyle={{ color: '#52c41a' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="平均订单金额" 
              value={stats.averageAmount} 
              valueStyle={{ color: '#1890ff' }}
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="stationId" label="油站">
            <Select placeholder="请选择油站" allowClear style={{ width: 200 }}>
              <Option value="1">油站1</Option>
              <Option value="2">油站2</Option>
              <Option value="3">油站3</Option>
              <Option value="4">油站4</Option>
              <Option value="5">油站5</Option>
            </Select>
          </Form.Item>
          <Form.Item name="oilType" label="油品类型">
            <Select placeholder="请选择油品类型" allowClear style={{ width: 120 }}>
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
            </Select>
          </Form.Item>
          <Form.Item name="orderId" label="订单编号">
            <Input placeholder="请输入订单编号" allowClear />
          </Form.Item>
          <Form.Item name="dateRange" label="交易日期">
            <RangePicker />
          </Form.Item>
          <Form.Item name="paymentMethod" label="支付方式">
            <Select placeholder="请选择支付方式" allowClear style={{ width: 120 }}>
              <Option value="现金">现金</Option>
              <Option value="微信">微信</Option>
              <Option value="支付宝">支付宝</Option>
              <Option value="银行卡">银行卡</Option>
              <Option value="会员卡">会员卡</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Option value="已完成">已完成</Option>
              <Option value="已取消">已取消</Option>
              <Option value="处理中">处理中</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button 
                type="primary" 
                icon={<FileExcelOutlined />} 
                onClick={handleExport}
              >
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="订单流水列表">
        <Table
          columns={columns}
          dataSource={orderData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            defaultPageSize: 10,
            total: orderData.length,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>
    </div>
  );
};

export default OrderList; 