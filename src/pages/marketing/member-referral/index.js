import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, BarChartOutlined, UserAddOutlined } from '@ant-design/icons';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MemberReferral = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [searchForm] = Form.useForm();
  const [recordSearchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 拉新活动列表数据
  const [activityData, setActivityData] = useState([]);
  // 修改记录数据
  const [recordData, setRecordData] = useState([]);
  // 统计数据
  const [statisticsData, setStatisticsData] = useState({});

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 拉新活动模拟数据
    const mockActivityData = [
      {
        id: 'ACT001',
        activityName: '春节拉新大礼包',
        activityType: '邀请奖励',
        activityPeriod: '2025-01-20 ~ 2025-02-20',
        rewardRule: '邀请1人送10元',
        participantCount: 156,
        successCount: 89,
        status: 'active'
      },
      {
        id: 'ACT002',
        activityName: '新用户注册送积分',
        activityType: '注册奖励',
        activityPeriod: '2025-01-15 ~ 2025-03-15',
        rewardRule: '注册送500积分',
        participantCount: 234,
        successCount: 201,
        status: 'active'
      },
      {
        id: 'ACT003',
        activityName: '首次消费双倍积分',
        activityType: '消费奖励',
        activityPeriod: '2024-12-01 ~ 2024-12-31',
        rewardRule: '首次消费双倍积分',
        participantCount: 89,
        successCount: 67,
        status: 'ended'
      },
      {
        id: 'ACT004',
        activityName: '元宵节拉新活动',
        activityType: '邀请奖励',
        activityPeriod: '2025-02-10 ~ 2025-02-25',
        rewardRule: '邀请3人送30元',
        participantCount: 0,
        successCount: 0,
        status: 'pending'
      },
      {
        id: 'ACT005',
        activityName: '会员升级奖励',
        activityType: '注册奖励',
        activityPeriod: '2025-01-01 ~ 2025-12-31',
        rewardRule: '升级VIP送优惠券',
        participantCount: 78,
        successCount: 45,
        status: 'active'
      }
    ];

    // 修改记录模拟数据
    const mockRecordData = [
      {
        id: 'LOG001',
        activityId: 'ACT001',
        activityName: '春节拉新大礼包',
        changeType: 'update',
        changeField: '奖励规则',
        changeDescription: '更新邀请奖励金额从5元调整为10元',
        operator: '张经理',
        operatorId: 'USER001',
        changeTime: '2025-01-18 14:30:25',
        approver: '李总监',
        status: 'approved'
      },
      {
        id: 'LOG002',
        activityId: 'ACT002',
        activityName: '新用户注册送积分',
        changeType: 'create',
        changeField: '基本信息',
        changeDescription: '创建新的注册奖励活动',
        operator: '王主管',
        operatorId: 'USER002',
        changeTime: '2025-01-15 09:20:10',
        approver: '李总监',
        status: 'approved'
      },
      {
        id: 'LOG003',
        activityId: 'ACT003',
        activityName: '首次消费双倍积分',
        changeType: 'update',
        changeField: '活动时间',
        changeDescription: '延长活动结束时间到12月31日',
        operator: '赵助理',
        operatorId: 'USER003',
        changeTime: '2025-01-10 16:45:30',
        approver: '张经理',
        status: 'pending'
      },
      {
        id: 'LOG004',
        activityId: 'ACT001',
        activityName: '春节拉新大礼包',
        changeType: 'update',
        changeField: '基本信息',
        changeDescription: '修改活动名称和描述内容',
        operator: '刘专员',
        operatorId: 'USER004',
        changeTime: '2025-01-08 11:15:45',
        approver: '王主管',
        status: 'rejected'
      },
      {
        id: 'LOG005',
        activityId: 'ACT004',
        activityName: '元宵节拉新活动',
        changeType: 'create',
        changeField: '基本信息',
        changeDescription: '创建元宵节拉新促销活动',
        operator: '陈经理',
        operatorId: 'USER005',
        changeTime: '2025-01-05 08:30:20',
        approver: '李总监',
        status: 'approved'
      }
    ];

    setActivityData(mockActivityData);
    setRecordData(mockRecordData);
    setStatisticsData({
      totalActivities: mockActivityData.length,
      activeActivities: mockActivityData.filter(item => item.status === 'active').length,
      totalParticipants: mockActivityData.reduce((sum, item) => sum + item.participantCount, 0),
      totalSuccess: mockActivityData.reduce((sum, item) => sum + item.successCount, 0)
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

  const showDetailModal = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentRecord(null);
  };

  // 拉新活动列表列定义
  const activityColumns = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 200,
    },
    {
      title: '活动类型',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 120,
      render: (type) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: '活动时间',
      dataIndex: 'activityPeriod',
      key: 'activityPeriod',
      width: 200,
    },
    {
      title: '奖励规则',
      dataIndex: 'rewardRule',
      key: 'rewardRule',
      width: 150,
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 100,
    },
    {
      title: '成功拉新',
      dataIndex: 'successCount',
      key: 'successCount',
      width: 100,
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
      title: '活动信息',
      dataIndex: 'activityInfo',
      key: 'activityInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.activityName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>ID: {record.activityId}</div>
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

  // 渲染拉新活动列表tab
  const renderActivityList = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="activityName" label="活动名称">
            <Input placeholder="请输入活动名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="activityType" label="活动类型">
            <Select placeholder="请选择活动类型" style={{ width: 150 }}>
              <Option value="invite">邀请奖励</Option>
              <Option value="register">注册奖励</Option>
              <Option value="consume">消费奖励</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }}>
              <Option value="active">进行中</Option>
              <Option value="ended">已结束</Option>
              <Option value="pending">待开始</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="活动时间">
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
                新建活动
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={activityColumns}
          dataSource={activityData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: activityData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染拉新活动统计tab
  const renderActivityStatistics = () => (
    <Card>
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <BarChartOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
        <div style={{ fontSize: '16px', color: '#666' }}>拉新活动统计功能待开发</div>
        <div style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
          此处将展示拉新活动的各项统计数据和图表分析
        </div>
      </div>
    </Card>
  );

  // 渲染修改记录tab
  const renderModificationRecords = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={recordSearchForm} layout="inline" onFinish={handleRecordSearch}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="搜索活动名称、ID、操作人等" style={{ width: 200 }} />
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
              <Option value="reward">奖励规则</Option>
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
              <Descriptions.Item label="活动名称">{currentRecord.activityName}</Descriptions.Item>
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
          <UserAddOutlined />
          拉新活动列表
        </span>
      ),
      children: renderActivityList(),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          拉新活动统计
        </span>
      ),
      children: renderActivityStatistics(),
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
    <div className="member-referral-container">
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

export default MemberReferral;