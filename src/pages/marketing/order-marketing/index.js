import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip, Alert, InputNumber } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, BarChartOutlined, ShoppingCartOutlined, ExperimentOutlined, PlayCircleOutlined } from '@ant-design/icons';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const OrderMarketing = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [searchForm] = Form.useForm();
  const [recordSearchForm] = Form.useForm();
  const [testForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 整单营销列表数据
  const [orderMarketingData, setOrderMarketingData] = useState([]);
  // 修改记录数据
  const [recordData, setRecordData] = useState([]);
  // 统计数据
  const [statisticsData, setStatisticsData] = useState({});
  // 测试结果
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 整单营销模拟数据
    const mockOrderMarketingData = [
      {
        id: 'OMK001',
        ruleName: '满500送100活动',
        ruleType: '满减促销',
        applicableScope: '全品类商品',
        conditions: '单笔订单满500元',
        discount: '赠送100元优惠券',
        validPeriod: '2025-01-20 ~ 2025-03-20',
        usageCount: 289,
        totalOrderAmount: 145000,
        totalDiscount: 28900,
        status: 'active'
      },
      {
        id: 'OMK002',
        ruleName: '新用户首单立减',
        ruleType: '首单优惠',
        applicableScope: '全部商品',
        conditions: '新用户首次下单',
        discount: '立减50元',
        validPeriod: '2025-01-01 ~ 2025-12-31',
        usageCount: 156,
        totalOrderAmount: 78000,
        totalDiscount: 7800,
        status: 'active'
      },
      {
        id: 'OMK003',
        ruleName: 'VIP专享整单95折',
        ruleType: '会员折扣',
        applicableScope: '指定分类',
        conditions: 'VIP会员且订单金额≥200元',
        discount: '整单95折',
        validPeriod: '2025-01-15 ~ 2025-02-15',
        usageCount: 423,
        totalOrderAmount: 211500,
        totalDiscount: 10575,
        status: 'active'
      },
      {
        id: 'OMK004',
        ruleName: '年货节大促销',
        ruleType: '节日促销',
        applicableScope: '精选商品',
        conditions: '单笔订单满300元',
        discount: '送价值50元礼品',
        validPeriod: '2024-12-25 ~ 2025-01-05',
        usageCount: 198,
        totalOrderAmount: 99000,
        totalDiscount: 9900,
        status: 'ended'
      },
      {
        id: 'OMK005',
        ruleName: '情人节特惠套餐',
        ruleType: '套餐促销',
        applicableScope: '指定套餐',
        conditions: '购买指定情人节套餐',
        discount: '套餐价8折',
        validPeriod: '2025-02-10 ~ 2025-02-20',
        usageCount: 0,
        totalOrderAmount: 0,
        totalDiscount: 0,
        status: 'pending'
      }
    ];

    // 修改记录模拟数据
    const mockRecordData = [
      {
        id: 'LOG001',
        marketingId: 'OMK001',
        marketingName: '满500送100活动',
        changeType: 'update',
        changeField: '优惠条件',
        changeDescription: '调整满减门槛从400元提升到500元',
        operator: '张经理',
        operatorId: 'USER001',
        changeTime: '2025-01-18 14:30:25',
        approver: '李总监',
        status: 'approved'
      },
      {
        id: 'LOG002',
        marketingId: 'OMK002',
        marketingName: '新用户首单立减',
        changeType: 'create',
        changeField: '基本信息',
        changeDescription: '创建新用户首单立减活动',
        operator: '王主管',
        operatorId: 'USER002',
        changeTime: '2025-01-15 09:20:10',
        approver: '李总监',
        status: 'approved'
      },
      {
        id: 'LOG003',
        marketingId: 'OMK003',
        marketingName: 'VIP专享整单95折',
        changeType: 'update',
        changeField: '折扣力度',
        changeDescription: '调整VIP折扣从9折改为95折',
        operator: '赵助理',
        operatorId: 'USER003',
        changeTime: '2025-01-10 16:45:30',
        approver: '张经理',
        status: 'pending'
      },
      {
        id: 'LOG004',
        marketingId: 'OMK001',
        marketingName: '满500送100活动',
        changeType: 'update',
        changeField: '活动时间',
        changeDescription: '延长活动结束时间到3月底',
        operator: '刘专员',
        operatorId: 'USER004',
        changeTime: '2025-01-08 11:15:45',
        approver: '王主管',
        status: 'rejected'
      },
      {
        id: 'LOG005',
        marketingId: 'OMK005',
        marketingName: '情人节特惠套餐',
        changeType: 'create',
        changeField: '基本信息',
        changeDescription: '创建情人节特惠套餐活动',
        operator: '陈经理',
        operatorId: 'USER005',
        changeTime: '2025-01-05 08:30:20',
        approver: '李总监',
        status: 'approved'
      }
    ];

    setOrderMarketingData(mockOrderMarketingData);
    setRecordData(mockRecordData);
    setStatisticsData({
      totalRules: mockOrderMarketingData.length,
      activeRules: mockOrderMarketingData.filter(item => item.status === 'active').length,
      totalUsage: mockOrderMarketingData.reduce((sum, item) => sum + item.usageCount, 0),
      totalOrderAmount: mockOrderMarketingData.reduce((sum, item) => sum + item.totalOrderAmount, 0),
      totalDiscount: mockOrderMarketingData.reduce((sum, item) => sum + item.totalDiscount, 0)
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
  };

  const handleReset = () => {
    searchForm.resetFields();
  };

  const handleRecordSearch = (values) => {
    console.log('记录搜索条件:', values);
  };

  const handleRecordReset = () => {
    recordSearchForm.resetFields();
  };

  const handleTestRule = (values) => {
    console.log('测试规则:', values);
    // 模拟测试结果
    const orderAmount = values.orderAmount || 500;
    const discountAmount = orderAmount >= 500 ? 100 : (orderAmount >= 200 ? orderAmount * 0.05 : 0);
    
    setTestResult({
      success: true,
      message: '整单营销规则测试完成',
      details: {
        originalAmount: orderAmount,
        discountAmount: discountAmount,
        finalAmount: orderAmount - discountAmount,
        applicableRules: discountAmount > 0 ? ['满500送100活动', 'VIP专享整单95折'] : [],
        savings: discountAmount
      }
    });
  };

  const showDetailModal = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentRecord(null);
  };

  // 整单营销列表列定义
  const orderMarketingColumns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 180,
    },
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      key: 'ruleType',
      width: 120,
      render: (type) => (
        <Tag color="purple">{type}</Tag>
      ),
    },
    {
      title: '适用范围',
      dataIndex: 'applicableScope',
      key: 'applicableScope',
      width: 120,
    },
    {
      title: '优惠条件',
      dataIndex: 'conditions',
      key: 'conditions',
      width: 180,
    },
    {
      title: '优惠内容',
      dataIndex: 'discount',
      key: 'discount',
      width: 150,
    },
    {
      title: '有效期',
      dataIndex: 'validPeriod',
      key: 'validPeriod',
      width: 200,
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 100,
    },
    {
      title: '订单总额',
      dataIndex: 'totalOrderAmount',
      key: 'totalOrderAmount',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '优惠总额',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          active: { color: 'success', text: '进行中' },
          ended: { color: 'default', text: '已结束' },
          pending: { color: 'warning', text: '待开始' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge status={config.color} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 修改记录列定义
  const recordColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160,
      sorter: true,
      render: (time) => <strong>{time}</strong>,
    },
    {
      title: '规则信息',
      dataIndex: 'marketingInfo',
      key: 'marketingInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.marketingName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>ID: {record.marketingId}</div>
        </div>
      ),
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => {
        const typeConfig = {
          create: { color: 'success', icon: <PlusOutlined />, text: '新建' },
          update: { color: 'warning', icon: <EditOutlined />, text: '修改' },
          delete: { color: 'error', icon: <DeleteOutlined />, text: '删除' }
        };
        const config = typeConfig[type] || typeConfig.update;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
      key: 'changeField',
      width: 120,
      render: (field) => <Tag color="blue">{field}</Tag>,
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 200,
      render: (description) => (
        <Tooltip title={description}>
          <div style={{ 
            maxWidth: '180px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorInfo',
      key: 'operatorInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.operator}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>ID: {record.operatorId}</div>
        </div>
      ),
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          approved: { status: 'success', text: '已通过' },
          pending: { status: 'warning', text: '待审批' },
          rejected: { status: 'error', text: '已拒绝' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge status={config.status} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => showDetailModal(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  // 渲染整单营销列表tab
  const renderOrderMarketingList = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="ruleName" label="规则名称">
            <Input placeholder="请输入规则名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="ruleType" label="规则类型">
            <Select placeholder="请选择规则类型" style={{ width: 150 }}>
              <Option value="discount">满减促销</Option>
              <Option value="firstOrder">首单优惠</Option>
              <Option value="member">会员折扣</Option>
              <Option value="festival">节日促销</Option>
              <Option value="package">套餐促销</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }}>
              <Option value="active">进行中</Option>
              <Option value="ended">已结束</Option>
              <Option value="pending">待开始</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="有效期">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                新建规则
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={orderMarketingColumns}
          dataSource={orderMarketingData}
          rowKey="id"
          scroll={{ x: 1600 }}
          pagination={{
            total: orderMarketingData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染整单营销统计tab
  const renderOrderMarketingStatistics = () => (
    <Card>
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <BarChartOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
        <div style={{ fontSize: '16px', color: '#666' }}>整单营销统计功能待开发</div>
        <div style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
          此处将展示整单营销的使用统计、转化率分析、ROI计算等数据
        </div>
      </div>
    </Card>
  );

  // 渲染规则测试工具tab
  const renderRuleTestTool = () => (
    <div>
      <Card title="整单营销规则测试工具" style={{ marginBottom: 16 }}>
        <Form form={testForm} layout="vertical" onFinish={handleTestRule}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="testRule" label="选择测试规则" rules={[{ required: true, message: '请选择测试规则' }]}>
                <Select placeholder="请选择要测试的规则">
                  {orderMarketingData.map(item => (
                    <Option key={item.id} value={item.id}>{item.ruleName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orderAmount" label="订单金额" rules={[{ required: true, message: '请输入订单金额' }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入订单金额"
                  min={0}
                  max={999999}
                  addonAfter="元"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="memberLevel" label="会员等级">
                <Select placeholder="请选择会员等级">
                  <Option value="normal">普通会员</Option>
                  <Option value="vip">VIP会员</Option>
                  <Option value="svip">超级VIP</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="customerType" label="客户类型">
                <Select placeholder="请选择客户类型">
                  <Option value="new">新客户</Option>
                  <Option value="old">老客户</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orderType" label="订单类型">
                <Select placeholder="请选择订单类型">
                  <Option value="normal">普通订单</Option>
                  <Option value="package">套餐订单</Option>
                  <Option value="group">团购订单</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="paymentMethod" label="支付方式">
                <Select placeholder="请选择支付方式">
                  <Option value="online">在线支付</Option>
                  <Option value="cash">现金支付</Option>
                  <Option value="card">刷卡支付</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="testNotes" label="测试备注">
                <TextArea rows={3} placeholder="请输入测试备注信息（可选）" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlayCircleOutlined />} size="large">
              开始测试
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {testResult && (
        <Card title="测试结果">
          <Alert
            message={testResult.success ? "测试成功" : "测试失败"}
            description={testResult.message}
            type={testResult.success ? "success" : "error"}
            style={{ marginBottom: 16 }}
          />
          
          {testResult.success && testResult.details && (
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>订单原价</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>¥{testResult.details.originalAmount}</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>优惠金额</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>¥{testResult.details.discountAmount}</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>实付金额</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>¥{testResult.details.finalAmount}</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>节省金额</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>¥{testResult.details.savings}</div>
                </div>
              </Col>
            </Row>
          )}
          
          {testResult.details && testResult.details.applicableRules.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4>适用规则:</h4>
              {testResult.details.applicableRules.map((rule, index) => (
                <Tag key={index} color="green" style={{ marginBottom: '8px' }}>{rule}</Tag>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );

  // 渲染修改记录tab
  const renderModificationRecords = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={recordSearchForm} layout="inline" onFinish={handleRecordSearch}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="搜索规则名称、ID、操作人等" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="changeType" label="变更类型">
            <Select placeholder="请选择变更类型" style={{ width: 120 }}>
              <Option value="create">新建</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
            </Select>
          </Form.Item>
          <Form.Item name="changeField" label="变更字段">
            <Select placeholder="请选择变更字段" style={{ width: 120 }}>
              <Option value="basic">基本信息</Option>
              <Option value="conditions">优惠条件</Option>
              <Option value="discount">折扣力度</Option>
              <Option value="time">活动时间</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 100 }}>
              <Option value="approved">已通过</Option>
              <Option value="pending">待审批</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" label="时间范围">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleRecordReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={recordColumns}
          dataSource={recordData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: recordData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染详情弹窗
  const renderDetailModal = () => (
    <Modal
      title={<><HistoryOutlined /> 变更详情</>}
      open={detailModalVisible}
      width={800}
      footer={[
        <Button key="close" onClick={closeDetailModal}>
          关闭
        </Button>
      ]}
      onCancel={closeDetailModal}
    >
      {currentRecord && (
        <>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="记录ID">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="规则名称">{currentRecord.marketingName}</Descriptions.Item>
              <Descriptions.Item label="变更类型">
                <Tag color="warning">
                  <EditOutlined /> 修改
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作人">{currentRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="变更时间">{currentRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Badge status="success" text="已通过" />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="变更详情" style={{ height: '300px' }}>
                <div style={{ textAlign: 'center', paddingTop: '80px', color: '#666' }}>
                  变更对比详情待开发
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="操作流程" style={{ height: '300px' }}>
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <div>提交申请</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            2025-01-18 14:30:25
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'green',
                      children: (
                        <div>
                          <div>审批通过</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            审批人: 李经理<br />
                            2025-01-18 15:20:10
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );

  const tabItems = [
    {
      key: 'list',
      label: (
        <span>
          <ShoppingCartOutlined />
          整单营销列表
        </span>
      ),
      children: renderOrderMarketingList(),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          整单营销统计
        </span>
      ),
      children: renderOrderMarketingStatistics(),
    },
    {
      key: 'test',
      label: (
        <span>
          <ExperimentOutlined />
          规则测试工具
        </span>
      ),
      children: renderRuleTestTool(),
    },
    {
      key: 'records',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: renderModificationRecords(),
    },
  ];

  return (
    <div className="order-marketing-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>
      {renderDetailModal()}
    </div>
  );
};

export default OrderMarketing;