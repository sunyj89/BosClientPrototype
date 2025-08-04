import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  DatePicker,
  InputNumber,
  Tag,
  Card,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PurchaseOrder = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  // 统计数据
  const [stats, setStats] = useState({
    totalOrders: 156,
    pendingAudit: 23,
    pendingConfirm: 18,
    totalAmount: 458900.00
  });

  // 模拟采购订单数据
  const mockOrderData = [
    {
      id: 'PO20240315001',
      orderNo: 'PO20240315001',
      supplierName: '可口可乐公司',
      stationName: '赣中分公司-服务区A-油站1',
      orderDate: '2024-03-15',
      expectedDate: '2024-03-18',
      status: '待审核',
      totalAmount: 8560.00,
      itemCount: 3,
      createBy: '张三',
      createTime: '2024-03-15 09:30:00',
      remarks: '常规补货'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setOrderData(mockOrderData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      '草稿': 'default',
      '待审核': 'orange',
      '已驳回': 'red',
      '待供应商确认': 'blue',
      '待入库': 'cyan',
      '已完成': 'green'
    };
    return statusMap[status] || 'default';
  };

  const columns = [
    {
      title: '采购单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 160
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text) => (
        <Tag color={getStatusColor(text)}>{text}</Tag>
      )
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      align: 'right',
      render: (text) => `¥${text.toFixed(2)}`
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="primary" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      )
    }
  ];

  const handleSearch = () => {
    fetchData();
  };

  const handleReset = () => {
    filterForm.resetFields();
  };

  return (
    <div className="procurement-container">
      <Row gutter={16} className="stat-cards">
        <Col span={6}>
          <Card>
            <Statistic 
              title="采购单总数" 
              value={stats.totalOrders} 
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待审核" 
              value={stats.pendingAudit} 
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待确认" 
              value={stats.pendingConfirm} 
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="采购总金额" 
              value={stats.totalAmount} 
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      <Form 
        form={filterForm}
        layout="inline"
        className="filter-form"
        onFinish={handleSearch}
      >
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item name="orderNo" label="采购单号">
              <Input placeholder="请输入采购单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="supplierName" label="供应商">
              <Select placeholder="请选择供应商" allowClear>
                <Option value="可口可乐公司">可口可乐公司</Option>
                <Option value="华润万家">华润万家</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<PlusOutlined />}>
                  新建采购单
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table 
        columns={columns}
        dataSource={orderData}
        loading={loading}
        rowKey="id"
        className="procurement-table"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />
    </div>
  );
};

export default PurchaseOrder; 