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
  Tag,
  Card,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Option } = Select;

const ReturnManagement = () => {
  const [loading, setLoading] = useState(false);
  const [returnData, setReturnData] = useState([]);
  const [filterForm] = Form.useForm();

  const mockData = [
    {
      id: 'RT001',
      returnNo: 'RT20240315001',
      supplierName: '可口可乐公司',
      returnReason: '质量问题',
      status: '待审核',
      totalAmount: 1280.00,
      createBy: '张三',
      createTime: '2024-03-15 14:30:00'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setReturnData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      '草稿': 'default',
      '待审核': 'orange',
      '已审核': 'blue',
      '已退货': 'green',
      '已驳回': 'red'
    };
    return statusMap[status] || 'default';
  };

  const columns = [
    {
      title: '退货单号',
      dataIndex: 'returnNo',
      key: 'returnNo'
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: '退货原因',
      dataIndex: 'returnReason',
      key: 'returnReason'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={getStatusColor(text)}>{text}</Tag>
    },
    {
      title: '退货金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => `¥${text.toFixed(2)}`
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small">查看</Button>
          <Button type="primary" size="small">编辑</Button>
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
              title="退货单总数" 
              value={45} 
              prefix={<RollbackOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="待审核" 
              value={12} 
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="退货金额" 
              value={23500} 
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#f50' }}
            />
          </Card>
        </Col>
      </Row>

      <Form form={filterForm} layout="inline" className="filter-form">
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item name="returnNo" label="退货单号">
              <Input placeholder="请输入退货单号" allowClear />
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
          <Col span={6}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" allowClear>
                <Option value="草稿">草稿</Option>
                <Option value="待审核">待审核</Option>
                <Option value="已审核">已审核</Option>
                <Option value="已退货">已退货</Option>
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
                <Button icon={<ReloadOutlined />}>
                  重置
                </Button>
                <Button type="primary" icon={<PlusOutlined />}>
                  新建退货单
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table 
        columns={columns}
        dataSource={returnData}
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

export default ReturnManagement; 