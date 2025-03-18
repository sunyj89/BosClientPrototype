import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Form,
  Input,
  Select,
  DatePicker,
  Tabs,
  Tag,
  Drawer,
  Space,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  Steps,
  Divider,
  Typography,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './index.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;
const { TabPane } = Tabs;

const DirectSalesManagement = () => {
  // 状态变量
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [statsVisible, setStatsVisible] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalForm] = Form.useForm();
  const [approvalType, setApprovalType] = useState('approve');
  
  const navigate = useNavigate();

  // 组件加载时获取数据
  useEffect(() => {
    fetchOrderList();
  }, [pagination.current, pagination.pageSize, activeTab]);

  // 获取订单列表数据
  const fetchOrderList = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setOrderList(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取直销订单列表失败:', error);
      message.error('获取直销订单列表失败');
      setLoading(false);
    }
  };

  // 生成模拟数据
  const generateMockData = () => {
    const data = [];
    const statuses = ['待审批', '已审批', '已完成', '已取消', '草稿'];
    const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
    const customers = ['中石化XX分公司', '中石油XX分公司', 'XX物流公司', 'XX运输公司', 'XX加油站'];
    
    for (let i = 1; i <= 50; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdTime = moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss');
      const deliveryTime = moment(createdTime).add(Math.floor(Math.random() * 10), 'days').format('YYYY-MM-DD');
      
      // 只显示与当前选中标签相符的数据
      if (activeTab !== 'all' && !status.includes(activeTab.replace('draft', '草稿').replace('pending', '待审批').replace('approved', '已审批').replace('completed', '已完成').replace('cancelled', '已取消'))) {
        continue;
      }
      
      data.push({
        id: `DS${moment().format('YYYYMMDD')}${i.toString().padStart(4, '0')}`,
        customer: customers[Math.floor(Math.random() * customers.length)],
        oilType: oilTypes[Math.floor(Math.random() * oilTypes.length)],
        volume: Math.floor(Math.random() * 10000) + 1000,
        price: (Math.random() * 2 + 6).toFixed(2),
        amount: ((Math.random() * 2 + 6) * (Math.floor(Math.random() * 10000) + 1000)).toFixed(2),
        deliveryTime,
        status,
        createdBy: '管理员',
        createdTime,
        approver: status === '待审批' ? '' : '系统管理员',
        approvalTime: status === '待审批' ? '' : moment(createdTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      });
    }
    
    return {
      data: data.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize),
      total: data.length
    };
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setPagination({
      ...pagination,
      current: 1
    });
    fetchOrderList();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    setActiveTab('all');
    fetchOrderList();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 查看订单详情
  const handleViewDetail = (record) => {
    navigate(`/sales/oil/direct/order-detail?id=${record.id}`);
  };

  // 创建新订单
  const handleCreateOrder = () => {
    navigate('/sales/oil/direct/create');
  };

  // 编辑订单
  const handleEditOrder = (record) => {
    message.info(`编辑订单 ${record.id} 功能开发中`);
  };

  // 删除订单
  const handleDeleteOrder = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除订单 ${record.id} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success(`订单 ${record.id} 已删除`);
        fetchOrderList();
      }
    });
  };

  // 处理审批
  const handleApproval = (record, type) => {
    setCurrentOrder(record);
    setApprovalType(type);
    approvalForm.resetFields();
    setApprovalModalVisible(true);
  };

  // 提交审批
  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(values => {
      console.log('审批信息:', values);
      message.success(`订单 ${currentOrder.id} 已${approvalType === 'approve' ? '审批通过' : '驳回'}`);
      setApprovalModalVisible(false);
      fetchOrderList();
    });
  };

  // 查看统计数据
  const handleViewStats = () => {
    setStatsVisible(true);
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '待审批':
        return <Tag color="blue" className="direct-sales-status-tag">待审批</Tag>;
      case '已审批':
        return <Tag color="green" className="direct-sales-status-tag">已审批</Tag>;
      case '已完成':
        return <Tag color="success" className="direct-sales-status-tag">已完成</Tag>;
      case '已取消':
        return <Tag color="red" className="direct-sales-status-tag">已取消</Tag>;
      case '草稿':
        return <Tag color="default" className="direct-sales-status-tag">草稿</Tag>;
      default:
        return <Tag color="default" className="direct-sales-status-tag">{status}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      fixed: 'left',
      render: (text, record) => <a onClick={() => handleViewDetail(record)}>{text}</a>
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
      width: 180
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 120
    },
    {
      title: '销售数量(升)',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      render: (text) => text.toLocaleString()
    },
    {
      title: '单价(元/升)',
      dataIndex: 'price',
      key: 'price',
      width: 120
    },
    {
      title: '销售金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '交付日期',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => getStatusTag(text)
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" className="direct-sales-table-actions">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
              className="direct-sales-table-action-btn"
            />
          </Tooltip>
          {record.status === '待审批' && (
            <Tooltip title="审批">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleApproval(record, 'approve')}
                className="direct-sales-table-action-btn ant-btn-success"
              />
            </Tooltip>
          )}
          {record.status === '待审批' && (
            <Tooltip title="驳回">
              <Button 
                type="text" 
                icon={<CloseCircleOutlined />} 
                onClick={() => handleApproval(record, 'reject')}
                className="direct-sales-table-action-btn ant-btn-danger"
                danger
              />
            </Tooltip>
          )}
          {(record.status === '草稿' || record.status === '待审批') && (
            <Tooltip title="编辑">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEditOrder(record)}
                className="direct-sales-table-action-btn"
              />
            </Tooltip>
          )}
          {record.status === '草稿' && (
            <Tooltip title="删除">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                onClick={() => handleDeleteOrder(record)}
                className="direct-sales-table-action-btn"
                danger
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="direct-sales-search">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
        initialValues={{ status: 'all' }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="orderId" label="订单编号">
              <Input placeholder="请输入订单编号" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="customer" label="客户名称">
              <Input placeholder="请输入客户名称" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="oilType" label="油品类型">
              <Select placeholder="请选择油品类型" allowClear>
                <Option value="92#汽油">92#汽油</Option>
                <Option value="95#汽油">95#汽油</Option>
                <Option value="98#汽油">98#汽油</Option>
                <Option value="0#柴油">0#柴油</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="status" label="订单状态">
              <Select placeholder="请选择订单状态" allowClear>
                <Option value="all">全部</Option>
                <Option value="pending">待审批</Option>
                <Option value="approved">已审批</Option>
                <Option value="completed">已完成</Option>
                <Option value="cancelled">已取消</Option>
                <Option value="draft">草稿</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="创建日期">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="deliveryDate" label="交付日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 渲染审批弹窗
  const renderApprovalModal = () => (
    <Modal
      title={`${approvalType === 'approve' ? '审批' : '驳回'}订单 - ${currentOrder?.id || ''}`}
      open={approvalModalVisible}
      onCancel={() => setApprovalModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setApprovalModalVisible(false)}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleApprovalSubmit}
          className={approvalType === 'approve' ? 'ant-btn-success' : 'ant-btn-danger'}
        >
          确认{approvalType === 'approve' ? '审批' : '驳回'}
        </Button>
      ]}
    >
      <Form form={approvalForm} layout="vertical">
        <Form.Item
          name="comment"
          label="审批意见"
          rules={[{ required: true, message: '请输入审批意见' }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder={`请输入${approvalType === 'approve' ? '审批' : '驳回'}意见`} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  // 渲染统计弹窗
  const renderStatsModal = () => (
    <Modal
      title="油品直销统计数据"
      open={statsVisible}
      onCancel={() => setStatsVisible(false)}
      footer={[
        <Button key="close" type="primary" onClick={() => setStatsVisible(false)}>
          关闭
        </Button>
      ]}
      width={800}
    >
      <Row gutter={16} className="direct-sales-stats-card">
        <Col span={8}>
          <Card>
            <Statistic
              title="本月直销订单数"
              value={42}
              valueStyle={{ color: '#3f8600' }}
              suffix="单"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="本月直销金额(元)"
              value={1258600}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="本月直销数量(升)"
              value={156800}
              valueStyle={{ color: '#3f8600' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">销售趋势</Divider>
      <div className="direct-sales-chart-container">
        <Row gutter={16}>
          <Col span={12}>
            <Card title="近6个月销售金额趋势">
              <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">图表功能开发中...</Text>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="近6个月销售数量趋势">
              <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">图表功能开发中...</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Divider orientation="left">油品分布</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="油品类型销售金额占比">
            <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">图表功能开发中...</Text>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="油品类型销售数量占比">
            <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">图表功能开发中...</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">客户分析</Divider>
      <Card title="客户销售排行榜">
        <Table
          size="small"
          pagination={false}
          dataSource={[
            { key: '1', rank: 1, customer: '中石化XX分公司', amount: 458600, volume: 58500 },
            { key: '2', rank: 2, customer: '中石油XX分公司', amount: 356200, volume: 45800 },
            { key: '3', rank: 3, customer: 'XX物流公司', amount: 245800, volume: 32000 },
            { key: '4', rank: 4, customer: 'XX运输公司', amount: 125600, volume: 16500 },
            { key: '5', rank: 5, customer: 'XX加油站', amount: 72400, volume: 9500 }
          ]}
          columns={[
            { title: '排名', dataIndex: 'rank', key: 'rank', width: 80 },
            { title: '客户名称', dataIndex: 'customer', key: 'customer' },
            { 
              title: '销售金额(元)', 
              dataIndex: 'amount', 
              key: 'amount',
              render: (text) => text.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            },
            { 
              title: '销售数量(升)', 
              dataIndex: 'volume', 
              key: 'volume',
              render: (text) => text.toLocaleString()
            }
          ]}
        />
      </Card>
    </Modal>
  );

  return (
    <div className="direct-sales-container">
      <div className="direct-sales-header">
        <div className="direct-sales-title">油品直销管理</div>
        <Space>
          <Button 
            type="primary" 
            icon={<BarChartOutlined />} 
            onClick={handleViewStats}
            className="ant-btn-primary"
          >
            统计数据
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateOrder}
            className="ant-btn-success"
          >
            新建直销订单
          </Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="direct-sales-tabs"
      >
        <TabPane tab="全部" key="all" />
        <TabPane tab="待审批" key="pending" />
        <TabPane tab="已审批" key="approved" />
        <TabPane tab="已完成" key="completed" />
        <TabPane tab="已取消" key="cancelled" />
        <TabPane tab="草稿" key="draft" />
      </Tabs>

      {renderSearchForm()}

      <Table
        className="direct-sales-table"
        columns={columns}
        dataSource={orderList}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1500 }}
      />

      {renderApprovalModal()}
      {renderStatsModal()}
    </div>
  );
};

export default DirectSalesManagement; 