import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Table, Row, Col, Tag, Space, Breadcrumb, Drawer, Descriptions, Divider, Typography, Statistic, message } from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  EyeOutlined, 
  HomeOutlined, 
  CloseOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  DollarOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

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
      customerType: Math.random() > 0.5 ? '会员' : '非会员',
      customerName: Math.random() > 0.5 ? `会员${Math.floor(Math.random() * 1000) + 1}` : '-',
      cardNumber: Math.random() > 0.5 ? `6225 **** **** ${Math.floor(Math.random() * 10000)}` : '-',
      points: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0,
      // 添加更多详细信息
      stationId: `ST${Math.floor(Math.random() * 100) + 1}`,
      transactionId: `TX${moment().format('YYYYMMDD')}${String(i + 5001).padStart(4, '0')}`,
      invoiceNo: Math.random() > 0.7 ? `INV${moment().format('YYYYMMDD')}${String(i + 3001).padStart(4, '0')}` : '-',
      invoiceStatus: Math.random() > 0.7 ? '已开票' : '未开票',
      discountAmount: Math.random() > 0.6 ? (Math.random() * 10).toFixed(2) : '0.00',
      paymentTime: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
      remark: Math.random() > 0.8 ? '客户要求开具发票' : '',
    });
  }
  
  return data;
};

const OrderDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(generateMockData(20));
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  
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

  const handleExport = () => {
    // 设置导出按钮加载状态
    setLoading(true);
    
    // 模拟导出操作
    setTimeout(() => {
      setLoading(false);
      // 导出成功提示
      message.success('导出成功');
    }, 1000);
  };

  const showDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
  };
  
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
    },
    {
      title: '交易时间',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 180,
      sorter: (a, b) => moment(a.transactionDate).valueOf() - moment(b.transactionDate).valueOf(),
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
      filters: [
        { text: '92#汽油', value: '92#汽油' },
        { text: '95#汽油', value: '95#汽油' },
        { text: '98#汽油', value: '98#汽油' },
        { text: '0#柴油', value: '0#柴油' },
      ],
      onFilter: (value, record) => record.oilType === value,
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
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: '单价(元/L)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      align: 'right',
      render: (text) => `¥${text}`,
      sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    {
      title: '交易金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (text) => `¥${text}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      filters: [
        { text: '现金', value: '现金' },
        { text: '微信', value: '微信' },
        { text: '支付宝', value: '支付宝' },
        { text: '银行卡', value: '银行卡' },
        { text: '会员卡', value: '会员卡' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      key: 'customerType',
      width: 100,
      render: (text) => (
        <Tag color={text === '会员' ? 'blue' : 'default'}>{text}</Tag>
      ),
      filters: [
        { text: '会员', value: '会员' },
        { text: '非会员', value: '非会员' },
      ],
      onFilter: (value, record) => record.customerType === value,
    },
    {
      title: '会员姓名',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 120,
    },
    {
      title: '会员卡号',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      width: 150,
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.points - b.points,
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
      filters: [
        { text: '已完成', value: '已完成' },
        { text: '已取消', value: '已取消' },
        { text: '处理中', value: '处理中' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => showDetail(record)}
          >
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
    memberOrders: data.filter(item => item.customerType === '会员').length,
    avgOrderAmount: (data.reduce((sum, item) => sum + parseFloat(item.amount), 0) / data.length).toFixed(2)
  };
  
  return (
    <div className="order-detail">
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
        <Breadcrumb.Item>订单明细</Breadcrumb.Item>
      </Breadcrumb>
      
      <Card>
        {/* 统计信息卡片 - 按照设计规范14.3节要求 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
              <Statistic 
                title="订单总数" 
                value={stats.totalOrders} 
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <Statistic 
                title="已完成订单" 
                value={stats.completedOrders} 
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#fff2e8', borderColor: '#ffbb96' }}>
              <Statistic 
                title="销售总金额" 
                value={stats.totalAmount} 
                valueStyle={{ color: '#fa541c' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#f9f0ff', borderColor: '#d3adf7' }}>
              <Statistic 
                title="会员订单数" 
                value={stats.memberOrders} 
                valueStyle={{ color: '#722ed1' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        {/* 查询条件卡片 - 按照设计规范14.4节要求 */}
        <Card title="查询条件" style={{ marginBottom: '16px' }}>
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
          >
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
            <Form.Item name="dateRange" label="交易时间">
              <RangePicker style={{ width: 300 }} />
            </Form.Item>
            <Form.Item name="orderId" label="订单编号">
              <Input placeholder="请输入订单编号" style={{ width: 200 }} prefix={<SearchOutlined />} />
            </Form.Item>
            <Form.Item name="customerType" label="客户类型">
              <Select placeholder="请选择客户类型" style={{ width: 120 }} allowClear>
                <Option value="会员">会员</Option>
                <Option value="非会员">非会员</Option>
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
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<ExportOutlined />} onClick={handleExport} loading={loading}>
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
        
        {/* 数据表格卡片 - 按照设计规范14.5节要求 */}
        <Card 
          title="订单明细列表"
          extra={
            <Space>
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport} loading={loading}>
                导出数据
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: 1800 }}
            rowKey="orderId"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              pageSize: 10,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
          />
        </Card>

        {/* 订单详情抽屉 - 按照设计规范14.6节要求 */}
        <Drawer
          title="订单详情"
          width={600}
          placement="right"
          onClose={closeDetail}
          open={detailVisible}
          closable={true}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Button type="text" icon={<CloseOutlined />} onClick={closeDetail} />
          }
        >
          {currentRecord && (
            <>
              <Title level={5}>基本信息</Title>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="订单编号" span={2}>{currentRecord.orderId}</Descriptions.Item>
                <Descriptions.Item label="交易编号">{currentRecord.transactionId}</Descriptions.Item>
                <Descriptions.Item label="交易时间">{currentRecord.transactionDate}</Descriptions.Item>
                <Descriptions.Item label="油站编号">{currentRecord.stationId}</Descriptions.Item>
                <Descriptions.Item label="油站名称">{currentRecord.stationName}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={statusColors[currentRecord.status]}>{currentRecord.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="操作员">{currentRecord.operator}</Descriptions.Item>
              </Descriptions>

              <Divider />
              <Title level={5}>油品信息</Title>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="油品类型">{currentRecord.oilType}</Descriptions.Item>
                <Descriptions.Item label="油枪号">{currentRecord.gunNumber}号枪</Descriptions.Item>
                <Descriptions.Item label="加油量">{currentRecord.quantity}L</Descriptions.Item>
                <Descriptions.Item label="单价">¥{currentRecord.unitPrice}/L</Descriptions.Item>
              </Descriptions>

              <Divider />
              <Title level={5}>支付信息</Title>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="交易金额" span={2}>¥{currentRecord.amount}</Descriptions.Item>
                <Descriptions.Item label="优惠金额">¥{currentRecord.discountAmount}</Descriptions.Item>
                <Descriptions.Item label="实付金额">¥{(parseFloat(currentRecord.amount) - parseFloat(currentRecord.discountAmount)).toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="支付方式">{currentRecord.paymentMethod}</Descriptions.Item>
                <Descriptions.Item label="支付时间">{currentRecord.paymentTime}</Descriptions.Item>
                <Descriptions.Item label="发票号码">{currentRecord.invoiceNo}</Descriptions.Item>
                <Descriptions.Item label="开票状态">
                  <Tag color={currentRecord.invoiceStatus === '已开票' ? 'green' : 'default'}>
                    {currentRecord.invoiceStatus}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {currentRecord.customerType === '会员' && (
                <>
                  <Divider />
                  <Title level={5}>会员信息</Title>
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="会员姓名">{currentRecord.customerName}</Descriptions.Item>
                    <Descriptions.Item label="会员卡号">{currentRecord.cardNumber}</Descriptions.Item>
                    <Descriptions.Item label="获得积分">{currentRecord.points}</Descriptions.Item>
                    <Descriptions.Item label="客户类型">
                      <Tag color="blue">{currentRecord.customerType}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}

              {currentRecord.remark && (
                <>
                  <Divider />
                  <Title level={5}>备注信息</Title>
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="备注">{currentRecord.remark}</Descriptions.Item>
                  </Descriptions>
                </>
              )}

              <div style={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid #e8e8e8', padding: '10px 16px', textAlign: 'right', left: 0, background: '#fff' }}>
                <Button onClick={closeDetail} style={{ marginRight: 8 }}>关闭</Button>
                <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>打印</Button>
              </div>
            </>
          )}
        </Drawer>
      </Card>
    </div>
  );
};

export default OrderDetail; 