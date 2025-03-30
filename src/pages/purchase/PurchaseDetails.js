import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Space, 
  Breadcrumb, 
  Tag, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  DatePicker,
  Button,
  Drawer,
  Descriptions,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  FileTextOutlined,
  DollarOutlined,
  PrinterOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 生成模拟数据
const generateMockData = () => {
  const data = [];
  const suppliers = ['中石化北京分公司', '中石油天津分公司', '中海油河北分公司', '壳牌石油有限公司'];
  const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
  const stations = ['北京朝阳加油站', '北京海淀加油站', '天津河西加油站', '河北廊坊加油站'];
  
  for (let i = 1; i <= 20; i++) {
    const date = moment().subtract(Math.floor(Math.random() * 30), 'days');
    const quantity = Math.floor(5000 + Math.random() * 15000);
    const price = (6 + Math.random() * 3).toFixed(2);
    const amount = (quantity * price).toFixed(2);
    
    data.push({
      key: i,
      id: `PD${moment().format('YYYY')}${String(i).padStart(4, '0')}`,
      settlementId: `PS${moment().format('YYYY')}${String(Math.floor(i/3) + 1).padStart(4, '0')}`,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      date: date.format('YYYY-MM-DD'),
      oilType: oilTypes[Math.floor(Math.random() * oilTypes.length)],
      station: stations[Math.floor(Math.random() * stations.length)],
      quantity: quantity,
      price: price,
      amount: amount,
      status: i % 4 === 0 ? '待审核' : (i % 4 === 1 ? '已审核' : (i % 4 === 2 ? '已结算' : '已取消')),
    });
  }
  
  return data;
};

const PurchaseDetails = () => {
  const [form] = Form.useForm();
  const [detailsData, setDetailsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  
  // 初始化数据
  useEffect(() => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setDetailsData(generateMockData());
      setLoading(false);
    }, 500);
  }, []);
  
  // 查询处理
  const handleSearch = (values) => {
    setLoading(true);
    console.log('查询条件:', values);
    // 模拟API请求
    setTimeout(() => {
      setDetailsData(generateMockData().filter(item => {
        let match = true;
        if (values.id) {
          match = match && item.id.includes(values.id);
        }
        if (values.settlementId) {
          match = match && item.settlementId.includes(values.settlementId);
        }
        if (values.supplier) {
          match = match && item.supplier === values.supplier;
        }
        if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
          const startDate = values.dateRange[0].format('YYYY-MM-DD');
          const endDate = values.dateRange[1].format('YYYY-MM-DD');
          match = match && item.date >= startDate && item.date <= endDate;
        }
        if (values.oilType) {
          match = match && item.oilType === values.oilType;
        }
        if (values.station) {
          match = match && item.station === values.station;
        }
        if (values.status) {
          match = match && item.status === values.status;
        }
        return match;
      }));
      setLoading(false);
    }, 500);
  };
  
  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };
  
  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDrawerVisible(true);
  };
  
  // 表格列定义
  const columns = [
    {
      title: '明细编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '结算单号',
      dataIndex: 'settlementId',
      key: 'settlementId',
      width: 150,
      render: (text) => <Link to={`/purchase/settlement?id=${text}`}>{text}</Link>,
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 180,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '加油站',
      dataIndex: 'station',
      key: 'station',
      width: 180,
    },
    {
      title: '数量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (text) => text.toLocaleString(),
    },
    {
      title: '单价(元/L)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        let color = 'default';
        if (text === '已审核') color = 'green';
        else if (text === '已结算') color = 'blue';
        else if (text === '已取消') color = 'red';
        else if (text === '待审核') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="default" 
          size="small" 
          icon={<FileTextOutlined />} 
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];
  
  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>采购管理</Breadcrumb.Item>
        <Breadcrumb.Item>结算明细</Breadcrumb.Item>
      </Breadcrumb>
      
      <Card title="结算明细查询" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="id" label="明细编号">
                <Input placeholder="请输入明细编号" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="settlementId" label="结算单号">
                <Input placeholder="请输入结算单号" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="supplier" label="供应商">
                <Select placeholder="请选择供应商" allowClear style={{ width: '100%' }}>
                  <Option value="中石化北京分公司">中石化北京分公司</Option>
                  <Option value="中石油天津分公司">中石油天津分公司</Option>
                  <Option value="中海油河北分公司">中海油河北分公司</Option>
                  <Option value="壳牌石油有限公司">壳牌石油有限公司</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="oilType" label="油品类型">
                <Select placeholder="请选择油品类型" allowClear style={{ width: '100%' }}>
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="station" label="加油站">
                <Select placeholder="请选择加油站" allowClear style={{ width: '100%' }}>
                  <Option value="北京朝阳加油站">北京朝阳加油站</Option>
                  <Option value="北京海淀加油站">北京海淀加油站</Option>
                  <Option value="天津河西加油站">天津河西加油站</Option>
                  <Option value="河北廊坊加油站">河北廊坊加油站</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear style={{ width: '100%' }}>
                  <Option value="待审核">待审核</Option>
                  <Option value="已审核">已审核</Option>
                  <Option value="已结算">已结算</Option>
                  <Option value="已取消">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label=" " colon={false}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <Card 
        title="结算明细列表" 
        extra={
          <Space>
            <Button icon={<ExportOutlined />} type="default">
              导出
            </Button>
            <Button icon={<PrinterOutlined />} type="default">
              打印
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8} md={6} lg={6}>
            <Statistic
              title="总记录数"
              value={detailsData.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={6}>
            <Statistic
              title="总金额"
              value={detailsData.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={6}>
            <Statistic
              title="总数量"
              value={detailsData.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
              suffix="L"
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={detailsData}
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
      
      {/* 详情抽屉 */}
      <Drawer
        title="结算明细详情"
        width={600}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Button icon={<PrinterOutlined />} type="default">
            打印
          </Button>
        }
      >
        {currentRecord && (
          <>
            <Descriptions title="基本信息" bordered column={1} size="middle" labelStyle={{ width: '120px' }}>
              <Descriptions.Item label="明细编号">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="结算单号">
                <Link to={`/purchase/settlement?id=${currentRecord.settlementId}`}>{currentRecord.settlementId}</Link>
              </Descriptions.Item>
              <Descriptions.Item label="供应商">{currentRecord.supplier}</Descriptions.Item>
              <Descriptions.Item label="日期">{currentRecord.date}</Descriptions.Item>
              <Descriptions.Item label="油品类型">{currentRecord.oilType}</Descriptions.Item>
              <Descriptions.Item label="加油站">{currentRecord.station}</Descriptions.Item>
              <Descriptions.Item label="数量">{currentRecord.quantity.toLocaleString()} L</Descriptions.Item>
              <Descriptions.Item label="单价">{currentRecord.price} 元/L</Descriptions.Item>
              <Descriptions.Item label="金额">{parseFloat(currentRecord.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '已审核' ? 'green' : 
                  currentRecord.status === '已结算' ? 'blue' : 
                  currentRecord.status === '已取消' ? 'red' : 'orange'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default PurchaseDetails; 