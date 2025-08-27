import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Breadcrumb, 
  Tabs, 
  Tag, 
  Input, 
  Select, 
  DatePicker, 
  Form, 
  Row, 
  Col,
  Statistic,
  Badge,
  Tooltip,
  message
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined, 
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  BellOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './index.css';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const ApprovalCenter = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [dataSource, setDataSource] = useState([]);
  const [filterForm] = Form.useForm();
  
  // 模拟数据
  const mockData = {
    pending: [
      {
        key: '1',
        id: 'TCH20230515003',
        title: '5号油罐油品变更',
        type: '油罐变更',
        objectName: '5号油罐',
        content: '0#柴油 → 92#汽油',
        applicant: '王经理',
        applyDate: '2023-05-15',
        status: '待审批',
        urgency: '普通',
        department: '运营部',
        route: '/oil/tank/change/detail/TCH20230515003'
      },
      {
        key: '2',
        id: 'TCH20230525005',
        title: '2号油罐油品变更',
        type: '油罐变更',
        objectName: '2号油罐',
        content: '92#汽油 → 95#汽油',
        applicant: '张经理',
        applyDate: '2023-05-25',
        status: '待审批',
        urgency: '紧急',
        department: '运营部',
        route: '/oil/tank/change/detail/TCH20230525005'
      },
      {
        key: '3',
        id: 'CHG20230515003',
        title: '5号油枪油品变更',
        type: '油枪变更',
        objectName: '5号油枪',
        content: '0#柴油 → 92#汽油',
        applicant: '王经理',
        applyDate: '2023-05-15',
        status: '待审批',
        urgency: '普通',
        department: '运营部',
        route: '/oil/gun/change'
      },
      {
        key: '4',
        id: 'CHG20230525005',
        title: '2号油枪油品变更',
        type: '油枪变更',
        objectName: '2号油枪',
        content: '92#汽油 → 95#汽油',
        applicant: '张经理',
        applyDate: '2023-05-25',
        status: '待审批',
        urgency: '紧急',
        department: '运营部',
        route: '/oil/gun/change'
      },
      {
        key: '5',
        id: 'PO20230610001',
        title: '6月份商品采购单',
        type: '采购单',
        objectName: '商品采购',
        content: '饮料、零食等商品采购',
        applicant: '李采购',
        applyDate: '2023-06-10',
        status: '待审批',
        urgency: '紧急',
        department: '采购部',
        route: '/goods/purchase'
      }
    ],
    processed: [
      {
        key: '6',
        id: 'TCH20230501001',
        title: '1号油罐油品变更',
        type: '油罐变更',
        objectName: '1号油罐',
        content: '92#汽油 → 95#汽油',
        applicant: '张经理',
        applyDate: '2023-05-01',
        status: '已完成',
        approver: '李总监',
        approveDate: '2023-05-02',
        urgency: '普通',
        department: '运营部',
        route: '/oil/tank/change/detail/TCH20230501001'
      },
      {
        key: '7',
        id: 'TCH20230510002',
        title: '3号油罐油品变更',
        type: '油罐变更',
        objectName: '3号油罐',
        content: '95#汽油 → 98#汽油',
        applicant: '张经理',
        applyDate: '2023-05-10',
        status: '已批准',
        approver: '李总监',
        approveDate: '2023-05-11',
        urgency: '普通',
        department: '运营部',
        route: '/oil/tank/change/detail/TCH20230510002'
      },
      {
        key: '8',
        id: 'TCH20230520004',
        title: '7号油罐油品变更',
        type: '油罐变更',
        objectName: '7号油罐',
        content: '92#汽油 → 0#柴油',
        applicant: '王经理',
        applyDate: '2023-05-20',
        status: '已拒绝',
        approver: '李总监',
        approveDate: '2023-05-21',
        urgency: '普通',
        department: '运营部',
        route: '/oil/tank/change/detail/TCH20230520004'
      },
      {
        key: '9',
        id: 'CHG20230501001',
        title: '1号油枪油品变更',
        type: '油枪变更',
        objectName: '1号油枪',
        content: '92#汽油 → 95#汽油',
        applicant: '张经理',
        applyDate: '2023-05-01',
        status: '已完成',
        approver: '李总监',
        approveDate: '2023-05-02',
        urgency: '普通',
        department: '运营部',
        route: '/oil/gun/change'
      },
      {
        key: '10',
        id: 'PO20230501001',
        title: '5月份商品采购单',
        type: '采购单',
        objectName: '商品采购',
        content: '饮料、零食等商品采购',
        applicant: '李采购',
        applyDate: '2023-05-01',
        status: '已完成',
        approver: '王总监',
        approveDate: '2023-05-02',
        urgency: '普通',
        department: '采购部',
        route: '/goods/purchase'
      }
    ],
    initiated: [
      {
        key: '11',
        id: 'TCH20230515003',
        title: '5号油罐油品变更',
        type: '油罐变更',
        objectName: '5号油罐',
        content: '0#柴油 → 92#汽油',
        applicant: '王经理',
        applyDate: '2023-05-15',
        status: '待审批',
        urgency: '普通',
        department: '运营部',
        route: '/oil/tank/change/detail/TCH20230515003'
      },
      {
        key: '12',
        id: 'CHG20230515003',
        title: '5号油枪油品变更',
        type: '油枪变更',
        objectName: '5号油枪',
        content: '0#柴油 → 92#汽油',
        applicant: '王经理',
        applyDate: '2023-05-15',
        status: '待审批',
        urgency: '普通',
        department: '运营部',
        route: '/oil/gun/change'
      },
      {
        key: '13',
        id: 'PO20230610001',
        title: '6月份商品采购单',
        type: '采购单',
        objectName: '商品采购',
        content: '饮料、零食等商品采购',
        applicant: '李采购',
        applyDate: '2023-06-10',
        status: '待审批',
        urgency: '紧急',
        department: '采购部',
        route: '/goods/purchase'
      }
    ]
  };

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // 获取数据
  const fetchData = (filters = {}) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      let data = [];
      
      if (activeTab === 'pending') {
        data = mockData.pending;
      } else if (activeTab === 'processed') {
        data = mockData.processed;
      } else if (activeTab === 'initiated') {
        data = mockData.initiated;
      }
      
      // 应用筛选条件
      if (filters.keyword) {
        data = data.filter(item => 
          item.id.includes(filters.keyword) || 
          item.title.includes(filters.keyword) ||
          item.content.includes(filters.keyword)
        );
      }
      
      if (filters.type) {
        data = data.filter(item => item.type === filters.type);
      }
      
      if (filters.dateRange && filters.dateRange.length === 2) {
        const startDate = filters.dateRange[0].format('YYYY-MM-DD');
        const endDate = filters.dateRange[1].format('YYYY-MM-DD');
        
        data = data.filter(item => {
          const applyDate = item.applyDate;
          return applyDate >= startDate && applyDate <= endDate;
        });
      }
      
      setDataSource(data);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = () => {
    const values = filterForm.getFieldsValue();
    fetchData(values);
  };

  // 重置搜索表单
  const handleReset = () => {
    filterForm.resetFields();
    fetchData();
  };

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 处理查看详情
  const handleViewDetail = (record) => {
    navigate(record.route);
  };

  // 处理快速审批
  const handleQuickApprove = (record, isApproved) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const status = isApproved ? '已批准' : '已拒绝';
      message.success(`申请 ${record.id} 已${status}`);
      
      // 更新数据
      const newDataSource = dataSource.filter(item => item.key !== record.key);
      setDataSource(newDataSource);
      
      setLoading(false);
    }, 500);
  };

  // 渲染状态标签
  const renderStatusTag = (status) => {
    let color = 'blue';
    let icon = <SyncOutlined spin />;
    
    if (status === '已完成') {
      color = 'green';
      icon = <CheckCircleOutlined />;
    } else if (status === '已批准') {
      color = 'cyan';
      icon = <CheckCircleOutlined />;
    } else if (status === '已拒绝') {
      color = 'red';
      icon = <CloseCircleOutlined />;
    } else if (status === '待审批') {
      color = 'orange';
      icon = <SyncOutlined spin />;
    }
    
    return <Tag color={color} icon={icon}>{status}</Tag>;
  };

  // 渲染紧急程度标签
  const renderUrgencyTag = (urgency) => {
    let color = 'blue';
    
    if (urgency === '紧急') {
      color = 'red';
    } else if (urgency === '普通') {
      color = 'blue';
    } else if (urgency === '低') {
      color = 'green';
    }
    
    return <Tag color={color}>{urgency}</Tag>;
  };

  // 待审批表格列配置
  const pendingColumns = [
    {
      title: '申请单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '对象',
      dataIndex: 'objectName',
      key: 'objectName',
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 120,
      sorter: (a, b) => new Date(a.applyDate) - new Date(b.applyDate),
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: renderUrgencyTag,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<FileTextOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Tooltip title="快速批准">
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              size="small"
              onClick={() => handleQuickApprove(record, true)}
            />
          </Tooltip>
          <Tooltip title="快速拒绝">
            <Button 
              danger
              icon={<CloseOutlined />} 
              size="small"
              onClick={() => handleQuickApprove(record, false)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 已处理表格列配置
  const processedColumns = [
    {
      title: '申请单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '对象',
      dataIndex: 'objectName',
      key: 'objectName',
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatusTag,
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '审批日期',
      dataIndex: 'approveDate',
      key: 'approveDate',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<FileTextOutlined />} 
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  // 我发起的表格列配置
  const initiatedColumns = [
    {
      title: '申请单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '对象',
      dataIndex: 'objectName',
      key: 'objectName',
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatusTag,
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: renderUrgencyTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<FileTextOutlined />} 
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  // 获取当前标签页对应的表格列
  const getColumns = () => {
    if (activeTab === 'pending') {
      return pendingColumns;
    } else if (activeTab === 'processed') {
      return processedColumns;
    } else if (activeTab === 'initiated') {
      return initiatedColumns;
    }
    return pendingColumns;
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      pending: mockData.pending.length,
      urgent: mockData.pending.filter(item => item.urgency === '紧急').length,
      processed: mockData.processed.length,
      initiated: mockData.initiated.length
    };
  };

  const stats = getStatistics();

  return (
    <div className="approval-center">
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>审批中心</Breadcrumb.Item>
        </Breadcrumb>
        <h2>审批中心</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待我审批" 
              value={stats.pending} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="紧急审批" 
              value={stats.urgent} 
              valueStyle={{ color: '#f5222d' }}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已处理" 
              value={stats.processed} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="我发起的" 
              value={stats.initiated} 
              valueStyle={{ color: '#722ed1' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 审批列表 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane 
            tab={
              <Badge count={stats.pending} offset={[10, 0]}>
                <span>待我审批</span>
              </Badge>
            } 
            key="pending"
          >
            <Card className="filter-card">
              <Form
                form={filterForm}
                layout="horizontal"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="keyword" label="关键词">
                      <Input placeholder="单号/标题/内容" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="type" label="类型">
                      <Select placeholder="请选择类型" allowClear>
                        <Option value="油罐变更">油罐变更</Option>
                        <Option value="油枪变更">油枪变更</Option>
                        <Option value="采购单">采购单</Option>
                        <Option value="价格调整">价格调整</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="dateRange" label="申请日期">
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Button 
                      type="primary" 
                      icon={<FilterOutlined />}
                      onClick={handleSearch}
                      style={{ marginRight: 8 }}
                    >
                      查询
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                    >
                      重置
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
            
            <Table 
              columns={getColumns()} 
              dataSource={dataSource} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              loading={loading}
              scroll={{ x: 1500 }}
            />
          </TabPane>
          <TabPane tab="我已处理" key="processed">
            <Table 
              columns={getColumns()} 
              dataSource={dataSource} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              loading={loading}
              scroll={{ x: 1500 }}
            />
          </TabPane>
          <TabPane 
            tab={
              <Badge count={stats.initiated} offset={[10, 0]}>
                <span>我发起的</span>
              </Badge>
            } 
            key="initiated"
          >
            <Table 
              columns={getColumns()} 
              dataSource={dataSource} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              loading={loading}
              scroll={{ x: 1500 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ApprovalCenter; 