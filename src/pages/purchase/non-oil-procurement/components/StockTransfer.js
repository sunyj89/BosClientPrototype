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
  Statistic,
  Steps
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  SwapOutlined,
  TruckOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Step } = Steps;

const StockTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const [filterForm] = Form.useForm();

  const mockData = [
    {
      id: 'TO001',
      transferNo: 'TO20240315001',
      fromStation: '中心仓库',
      toStation: '赣中分公司-服务区A-油站1',
      expectedDate: '2024-03-18',
      status: '待出库',
      itemCount: 5,
      createBy: '张三',
      createTime: '2024-03-15 10:30:00'
    },
    {
      id: 'TO002',
      transferNo: 'TO20240314002',
      fromStation: '赣中分公司-服务区A-油站1',
      toStation: '赣中分公司-服务区A-油站2',
      expectedDate: '2024-03-16',
      status: '在途',
      itemCount: 3,
      createBy: '李四',
      createTime: '2024-03-14 15:20:00'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setTransferData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      '草稿': 'default',
      '待审核': 'orange',
      '待出库': 'blue',
      '在途': 'cyan',
      '待入库': 'lime',
      '已完成': 'green',
      '已驳回': 'red'
    };
    return statusMap[status] || 'default';
  };

  const getStatusStep = (status) => {
    const stepMap = {
      '草稿': 0,
      '待审核': 0,
      '待出库': 1,
      '在途': 2,
      '待入库': 2,
      '已完成': 3
    };
    return stepMap[status] || 0;
  };

  const columns = [
    {
      title: '调拨单号',
      dataIndex: 'transferNo',
      key: 'transferNo',
      width: 160
    },
    {
      title: '调出仓',
      dataIndex: 'fromStation',
      key: 'fromStation',
      width: 150
    },
    {
      title: '调入仓',
      dataIndex: 'toStation',
      key: 'toStation',
      width: 200,
      ellipsis: true
    },
    {
      title: '期望到货日期',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 130
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <Tag color={getStatusColor(text)}>{text}</Tag>
    },
    {
      title: '商品数量',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100,
      align: 'center',
      render: (text) => `${text}种`
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button size="small">查看</Button>
          {record.status === '草稿' && (
            <Button type="primary" size="small">编辑</Button>
          )}
          {record.status === '待出库' && (
            <Button type="primary" size="small">出库</Button>
          )}
          {record.status === '在途' && (
            <Button type="primary" size="small">入库</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="procurement-container">
      <Row gutter={16} className="stat-cards">
        <Col span={6}>
          <Card>
            <Statistic 
              title="调拨单总数" 
              value={89} 
              prefix={<SwapOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待出库" 
              value={15} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="在途中" 
              value={8} 
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月完成" 
              value={156} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Form form={filterForm} layout="inline" className="filter-form">
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item name="transferNo" label="调拨单号">
              <Input placeholder="请输入调拨单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="fromStation" label="调出仓">
              <Select placeholder="请选择调出仓" allowClear>
                <Option value="中心仓库">中心仓库</Option>
                <Option value="赣中分公司-服务区A-油站1">赣中分公司-服务区A-油站1</Option>
                <Option value="赣东分公司-服务区B-油站2">赣东分公司-服务区B-油站2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="toStation" label="调入仓">
              <Select placeholder="请选择调入仓" allowClear>
                <Option value="赣中分公司-服务区A-油站1">赣中分公司-服务区A-油站1</Option>
                <Option value="赣中分公司-服务区A-油站2">赣中分公司-服务区A-油站2</Option>
                <Option value="赣东分公司-服务区B-油站1">赣东分公司-服务区B-油站1</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" allowClear>
                <Option value="草稿">草稿</Option>
                <Option value="待审核">待审核</Option>
                <Option value="待出库">待出库</Option>
                <Option value="在途">在途</Option>
                <Option value="待入库">待入库</Option>
                <Option value="已完成">已完成</Option>
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
                  新建调拨单
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table 
        columns={columns}
        dataSource={transferData}
        loading={loading}
        rowKey="id"
        className="procurement-table"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        scroll={{ x: 1200 }}
        expandable={{
          expandedRowRender: record => (
            <div style={{ padding: '16px' }}>
              <h4>调拨进度</h4>
              <Steps current={getStatusStep(record.status)} size="small">
                <Step title="创建调拨单" />
                <Step title="调出出库" />
                <Step title="运输中" />
                <Step title="调入入库" />
              </Steps>
            </div>
          ),
          rowExpandable: record => record.status !== '草稿'
        }}
      />
    </div>
  );
};

export default StockTransfer; 