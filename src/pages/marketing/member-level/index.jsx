import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip, Progress, Statistic } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, BarChartOutlined, CrownOutlined, SettingOutlined, TrophyOutlined } from '@ant-design/icons';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MemberLevel = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const [ruleSearchForm] = Form.useForm();
  const [recordSearchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 等级规则配置数据
  const [levelRulesData, setLevelRulesData] = useState([]);
  // 等级数据统计
  const [statisticsData, setStatisticsData] = useState({});
  // 修改记录数据
  const [recordData, setRecordData] = useState([]);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 等级规则配置模拟数据
    const mockLevelRulesData = [
      {
        id: 'LEVEL001',
        levelName: '普通会员',
        levelCode: 'NORMAL',
        levelOrder: 1,
        upgradeConditions: '注册即可获得',
        consumptionThreshold: 0,
        pointsThreshold: 0,
        privileges: ['基础积分', '生日优惠'],
        discountRate: 0,
        pointsMultiplier: 1.0,
        validityPeriod: '永久有效',
        memberCount: 12580,
        status: 'active',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-15 14:30:00'
      },
      {
        id: 'LEVEL002',
        levelName: '银牌会员',
        levelCode: 'SILVER',
        levelOrder: 2,
        upgradeConditions: '累计消费满1000元',
        consumptionThreshold: 1000,
        pointsThreshold: 500,
        privileges: ['95折优惠', '双倍积分日', '专属客服'],
        discountRate: 0.05,
        pointsMultiplier: 1.2,
        validityPeriod: '365天',
        memberCount: 3456,
        status: 'active',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-20 16:20:00'
      },
      {
        id: 'LEVEL003',
        levelName: '金牌会员',
        levelCode: 'GOLD',
        levelOrder: 3,
        upgradeConditions: '累计消费满5000元',
        consumptionThreshold: 5000,
        pointsThreshold: 2500,
        privileges: ['9折优惠', '三倍积分日', '免费洗车', '生日礼品'],
        discountRate: 0.10,
        pointsMultiplier: 1.5,
        validityPeriod: '730天',
        memberCount: 856,
        status: 'active',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-18 11:45:00'
      },
      {
        id: 'LEVEL004',
        levelName: '钻石会员',
        levelCode: 'DIAMOND',
        levelOrder: 4,
        upgradeConditions: '累计消费满20000元',
        consumptionThreshold: 20000,
        pointsThreshold: 10000,
        privileges: ['85折优惠', '五倍积分日', '专车接送', '年度大礼包', '优先服务'],
        discountRate: 0.15,
        pointsMultiplier: 2.0,
        validityPeriod: '1095天',
        memberCount: 234,
        status: 'active',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-22 09:15:00'
      },
      {
        id: 'LEVEL005',
        levelName: '至尊会员',
        levelCode: 'SUPREME',
        levelOrder: 5,
        upgradeConditions: '累计消费满50000元',
        consumptionThreshold: 50000,
        pointsThreshold: 25000,
        privileges: ['8折优惠', '十倍积分日', '专属管家', '定制服务', '年度旅游'],
        discountRate: 0.20,
        pointsMultiplier: 3.0,
        validityPeriod: '永久有效',
        memberCount: 67,
        status: 'inactive',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2024-12-25 15:30:00'
      }
    ];

    // 等级数据统计
    const mockStatisticsData = {
      totalMembers: mockLevelRulesData.reduce((sum, level) => sum + level.memberCount, 0),
      activeLevels: mockLevelRulesData.filter(level => level.status === 'active').length,
      levelDistribution: mockLevelRulesData.map(level => ({
        levelName: level.levelName,
        memberCount: level.memberCount,
        percentage: (level.memberCount / mockLevelRulesData.reduce((sum, l) => sum + l.memberCount, 0) * 100).toFixed(1)
      })),
      monthlyUpgrades: [
        { month: '2024-12', upgrades: 156, downgrades: 23 },
        { month: '2025-01', upgrades: 189, downgrades: 18 }
      ],
      avgConsumption: {
        normal: 156.8,
        silver: 890.5,
        gold: 2456.7,
        diamond: 8934.2,
        supreme: 15678.9
      }
    };

    // 修改记录模拟数据
    const mockRecordData = [
      {
        id: 'LOG001',
        targetId: 'LEVEL002',
        targetName: '银牌会员等级规则',
        changeType: 'update',
        changeField: '升级条件',
        changeDescription: '调整消费门槛从800元提升到1000元',
        operator: '张管理员',
        operatorId: 'ADMIN001',
        changeTime: '2025-01-20 16:20:00',
        approver: '李主管',
        status: 'approved'
      },
      {
        id: 'LOG002',
        targetId: 'LEVEL004',
        targetName: '钻石会员等级规则',
        changeType: 'update',
        changeField: '会员权益',
        changeDescription: '新增专车接送服务权益',
        operator: '王管理员',
        operatorId: 'ADMIN002',
        changeTime: '2025-01-22 09:15:00',
        approver: '赵主管',
        status: 'approved'
      },
      {
        id: 'LOG003',
        targetId: 'LEVEL005',
        targetName: '至尊会员等级规则',
        changeType: 'update',
        changeField: '状态',
        changeDescription: '暂停至尊会员等级，停止新用户升级',
        operator: '李管理员',
        operatorId: 'ADMIN003',
        changeTime: '2024-12-25 15:30:00',
        approver: '张主管',
        status: 'approved'
      },
      {
        id: 'LOG004',
        targetId: 'LEVEL003',
        targetName: '金牌会员等级规则',
        changeType: 'update',
        changeField: '积分倍数',
        changeDescription: '调整积分倍数从1.3倍提升到1.5倍',
        operator: '赵管理员',
        operatorId: 'ADMIN004',
        changeTime: '2025-01-18 11:45:00',
        approver: '王主管',
        status: 'approved'
      },
      {
        id: 'LOG005',
        targetId: 'LEVEL001',
        targetName: '普通会员等级规则',
        changeType: 'update',
        changeField: '会员权益',
        changeDescription: '新增生日优惠券权益',
        operator: '陈管理员',
        operatorId: 'ADMIN005',
        changeTime: '2025-01-15 14:30:00',
        approver: '李主管',
        status: 'approved'
      }
    ];

    setLevelRulesData(mockLevelRulesData);
    setStatisticsData(mockStatisticsData);
    setRecordData(mockRecordData);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleRuleSearch = (values) => {
    console.log('规则搜索条件:', values);
  };

  const handleRecordSearch = (values) => {
    console.log('记录搜索条件:', values);
  };

  const showDetailModal = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentRecord(null);
  };

  // 等级规则配置列定义
  const levelRulesColumns = [
    {
      title: '等级排序',
      dataIndex: 'levelOrder',
      key: 'levelOrder',
      width: 80,
      sorter: (a, b) => a.levelOrder - b.levelOrder,
      render: (order) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
          {order}
        </div>
      ),
    },
    {
      title: '等级名称',
      dataIndex: 'levelName',
      key: 'levelName',
      width: 120,
      render: (name, record) => {
        const levelColors = {
          1: '#8c8c8c',
          2: '#c0c0c0', 
          3: '#ffd700',
          4: '#4169e1',
          5: '#800080'
        };
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CrownOutlined style={{ color: levelColors[record.levelOrder], marginRight: '8px' }} />
            <strong style={{ color: levelColors[record.levelOrder] }}>{name}</strong>
          </div>
        );
      },
    },
    {
      title: '等级编码',
      dataIndex: 'levelCode',
      key: 'levelCode',
      width: 100,
      render: (code) => <Tag color="geekblue">{code}</Tag>,
    },
    {
      title: '升级条件',
      dataIndex: 'upgradeConditions',
      key: 'upgradeConditions',
      width: 180,
    },
    {
      title: '消费门槛',
      dataIndex: 'consumptionThreshold',
      key: 'consumptionThreshold',
      width: 100,
      render: (threshold) => threshold > 0 ? `¥${threshold.toLocaleString()}` : '无要求',
    },
    {
      title: '积分门槛',
      dataIndex: 'pointsThreshold',
      key: 'pointsThreshold',
      width: 100,
      render: (threshold) => threshold > 0 ? `${threshold.toLocaleString()}分` : '无要求',
    },
    {
      title: '折扣优惠',
      dataIndex: 'discountRate',
      key: 'discountRate',
      width: 100,
      render: (rate) => rate > 0 ? `${(rate * 100).toFixed(0)}%优惠` : '无折扣',
    },
    {
      title: '积分倍数',
      dataIndex: 'pointsMultiplier',
      key: 'pointsMultiplier',
      width: 100,
      render: (multiplier) => `${multiplier}x`,
    },
    {
      title: '会员权益',
      dataIndex: 'privileges',
      key: 'privileges',
      width: 250,
      render: (privileges) => (
        <div>
          {privileges.slice(0, 3).map((privilege, index) => (
            <Tag key={index} color="cyan" style={{ marginBottom: '4px' }}>
              {privilege}
            </Tag>
          ))}
          {privileges.length > 3 && (
            <Tag color="default">+{privileges.length - 3}项</Tag>
          )}
        </div>
      ),
    },
    {
      title: '会员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
      render: (count) => (
        <strong style={{ color: '#1890ff' }}>{count.toLocaleString()}</strong>
      ),
    },
    {
      title: '有效期',
      dataIndex: 'validityPeriod',
      key: 'validityPeriod',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          active: { color: 'success', text: '启用中' },
          inactive: { color: 'default', text: '已停用' }
        };
        const config = statusConfig[status];
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
      title: '等级信息',
      dataIndex: 'targetInfo',
      key: 'targetInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.targetName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>ID: {record.targetId}</div>
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

  // 渲染等级规则配置tab
  const renderLevelRulesConfig = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={ruleSearchForm} layout="inline" onFinish={handleRuleSearch}>
          <Form.Item name="levelName" label="等级名称">
            <Input placeholder="请输入等级名称" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="levelCode" label="等级编码">
            <Select placeholder="请选择等级编码" style={{ width: 120 }}>
              <Option value="NORMAL">NORMAL</Option>
              <Option value="SILVER">SILVER</Option>
              <Option value="GOLD">GOLD</Option>
              <Option value="DIAMOND">DIAMOND</Option>
              <Option value="SUPREME">SUPREME</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 100 }}>
              <Option value="active">启用中</Option>
              <Option value="inactive">已停用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="更新时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => ruleSearchForm.resetFields()}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                新建等级
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={levelRulesColumns}
          dataSource={levelRulesData}
          rowKey="id"
          scroll={{ x: 1800 }}
          pagination={{
            total: levelRulesData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染等级数据统计tab
  const renderLevelStatistics = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="会员总数" 
              value={statisticsData.totalMembers} 
              valueStyle={{ color: '#3f8600' }}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="启用等级数" 
              value={statisticsData.activeLevels} 
              valueStyle={{ color: '#1890ff' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月升级" 
              value={189} 
              valueStyle={{ color: '#cf1322' }}
              suffix="人次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月降级" 
              value={18} 
              valueStyle={{ color: '#8c8c8c' }}
              suffix="人次"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="等级分布统计" style={{ height: '400px' }}>
            {statisticsData.levelDistribution && statisticsData.levelDistribution.map((item, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{item.levelName}</span>
                  <span>{item.memberCount}人 ({item.percentage}%)</span>
                </div>
                <Progress 
                  percent={parseFloat(item.percentage)} 
                  strokeColor={['#8c8c8c', '#c0c0c0', '#ffd700', '#4169e1', '#800080'][index]}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="平均消费水平" style={{ height: '400px' }}>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <BarChartOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
              <div style={{ fontSize: '16px', color: '#666' }}>等级消费统计图表待开发</div>
              <div style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
                此处将展示各等级会员的平均消费水平分析
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染修改记录tab
  const renderModificationRecords = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={recordSearchForm} layout="inline" onFinish={handleRecordSearch}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="搜索等级名称、ID、操作人等" style={{ width: 200 }} />
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
              <Option value="conditions">升级条件</Option>
              <Option value="privileges">会员权益</Option>
              <Option value="status">状态</Option>
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
              <Button onClick={() => recordSearchForm.resetFields()}>
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
              <Descriptions.Item label="等级名称">{currentRecord.targetName}</Descriptions.Item>
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
                            {currentRecord.changeTime}
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
                            审批人: {currentRecord.approver}<br />
                            {currentRecord.changeTime}
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
      key: 'rules',
      label: (
        <span>
          <SettingOutlined />
          等级规则配置
        </span>
      ),
      children: renderLevelRulesConfig(),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <TrophyOutlined />
          等级数据统计
        </span>
      ),
      children: renderLevelStatistics(),
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
    <div className="member-level-container">
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

export default MemberLevel;