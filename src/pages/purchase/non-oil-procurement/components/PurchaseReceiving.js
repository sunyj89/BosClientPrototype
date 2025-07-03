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
  SearchOutlined, 
  ReloadOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Option } = Select;

const PurchaseReceiving = () => {
  const [loading, setLoading] = useState(false);
  const [receivingData, setReceivingData] = useState([]);
  const [filterForm] = Form.useForm();

  const mockData = [
    {
      id: 'RC001',
      orderNo: 'PO20240315001',
      supplierName: '可口可乐公司',
      expectedDate: '2024-03-18',
      status: '待入库',
      totalAmount: 8560.00
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setReceivingData(mockData);
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: '采购单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
            入库
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="procurement-container">
      <Row gutter={16} className="stat-cards">
        <Col span={8}>
          <Card>
            <Statistic 
              title="待入库订单" 
              value={15} 
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="今日入库" 
              value={8} 
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="入库金额" 
              value={45600} 
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      <Form form={filterForm} layout="inline" className="filter-form">
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item name="orderNo" label="采购单号">
              <Input placeholder="请输入采购单号" allowClear />
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
                <Button icon={<ReloadOutlined />}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table 
        columns={columns}
        dataSource={receivingData}
        loading={loading}
        rowKey="id"
        className="procurement-table"
      />
    </div>
  );
};

export default PurchaseReceiving; 