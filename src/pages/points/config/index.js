import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import EarningRuleForm from './components/EarningRuleForm';
import UsageRuleForm from './components/UsageRuleForm';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const PointsConfig = () => {
  const [activeTab, setActiveTab] = useState('earning');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [currentRuleType, setCurrentRuleType] = useState('');
  const [form] = Form.useForm();

  // 模拟积分获取规则数据
  const [earningRules, setEarningRules] = useState([
    {
      id: 1,
      name: '五一黄金周95号汽油阶梯积分活动',
      type: 'fuel_consumption',
      priority: 1,
      status: 'active',
      startTime: '2024-05-01 00:00:00',
      endTime: '2024-05-07 23:59:59',
      description: '95号汽油阶梯积分奖励',
      config: {
        fuelTypes: ['95#汽油'],
        memberLevels: ['普通会员', '银卡会员', '金卡会员'],
        paymentMethods: ['APP支付', '微信/支付宝'],
        calculationType: 'ladder_volume',
        ladders: [
          { min: 0, max: 100, reward: 10 },
          { min: 100.01, max: 200, reward: 15 },
          { min: 200.01, max: 9999, reward: 20 }
        ]
      },
      createTime: '2024-04-25 10:30:00'
    },
    {
      id: 2,
      name: '新会员注册奖励',
      type: 'member_behavior',
      priority: 5,
      status: 'active',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      description: '新用户注册成为会员后一次性奖励积分',
      config: {
        behaviorType: 'register',
        rewardPoints: 100
      },
      createTime: '2024-01-01 09:00:00'
    },
    {
      id: 3,
      name: '便利店饮料促销积分',
      type: 'store_consumption',
      priority: 3,
      status: 'draft',
      startTime: '2024-06-01 00:00:00',
      endTime: '2024-06-30 23:59:59',
      description: '购买指定饮料商品获得额外积分',
      config: {
        productCategories: ['饮料'],
        memberLevels: ['普通会员', '银卡会员', '金卡会员'],
        calculationType: 'fixed_ratio',
        basis: 'amount',
        ratio: 2
      },
      createTime: '2024-05-20 14:15:00'
    }
  ]);

  // 模拟积分应用规则数据
  const [usageRules, setUsageRules] = useState([
    {
      id: 1,
      name: '端午节积分抽奖活动',
      type: 'lottery',
      status: 'active',
      startTime: '2024-06-08 00:00:00',
      endTime: '2024-06-10 23:59:59',
      description: '消耗积分参与抽奖，赢取丰厚奖品',
      config: {
        costPerDraw: 50,
        dailyLimit: 5,
        prizes: [
          { name: '100积分', type: 'points', probability: 30, quantity: 1000 },
          { name: '5元洗车券', type: 'voucher', probability: 20, quantity: 200 },
          { name: '一瓶可乐', type: 'product', probability: 15, quantity: 100 }
        ]
      },
      createTime: '2024-05-25 16:20:00'
    },
    {
      id: 2,
      name: '积分转赠功能',
      type: 'transfer',
      status: 'active',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      description: '会员之间可以互相转移积分',
      config: {
        enabled: true,
        minTransfer: 10,
        maxTransfer: 1000,
        dailyLimit: 2000,
        feeRate: 0.02,
        memberLevelRestriction: false
      },
      createTime: '2024-01-01 09:00:00'
    },
    {
      id: 3,
      name: '全场积分抵扣规则',
      type: 'redemption',
      status: 'active',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      description: '设置积分在各种消费场景下的抵扣规则和限制',
      config: {
        pointsValue: 100,
        globalDiscountLimit: 50,
        oilTypes: ['92', '95', '98'],
        oilDiscountLimit: 100,
        productCategories: ['beverage', 'snack', 'daily'],
        productDiscountType: 'ratio',
        productDiscountValue: 30,
        couponStackRule: 'coupon_first',
        cardStackRule: 'points_first'
      },
      createTime: '2024-01-01 09:00:00'
    }
  ]);

  const ruleTypeMap = {
    member_behavior: { text: '会员行为', color: 'blue' },
    fuel_consumption: { text: '加油消费', color: 'green' },
    store_consumption: { text: '便利店消费', color: 'orange' },
    lottery: { text: '积分抽奖', color: 'purple' },
    transfer: { text: '积分转赠', color: 'cyan' },
    redemption: { text: '积分核销', color: 'magenta' }
  };

  const statusMap = {
    draft: { text: '草稿', color: 'default' },
    active: { text: '生效中', color: 'success' },
    disabled: { text: '已禁用', color: 'warning' },
    ended: { text: '已结束', color: 'error' }
  };

  // 积分获取规则列配置
  const earningColumns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      width: 200,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '规则类型',
      dataIndex: 'type',
      width: 120,
      render: (type) => (
        <Tag color={ruleTypeMap[type]?.color}>
          {ruleTypeMap[type]?.text}
        </Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      sorter: (a, b) => a.priority - b.priority
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text}
        </Tag>
      )
    },
    {
      title: '有效期',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.startTime}</div>
          <div>{record.endTime}</div>
        </div>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
            style={{ borderRadius: '2px' }}
          >
            复制
          </Button>
          {record.status === 'active' ? (
            <Button
              type="primary"
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'disabled')}
              style={{ borderRadius: '2px' }}
            >
              禁用
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'active')}
              style={{ borderRadius: '2px' }}
            >
              启用
            </Button>
          )}
          <Popconfirm
            title="确定删除这个规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: '2px' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 积分应用规则列配置
  const usageColumns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      width: 200,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      width: 120,
      render: (type) => (
        <Tag color={ruleTypeMap[type]?.color}>
          {ruleTypeMap[type]?.text}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text}
        </Tag>
      )
    },
    {
      title: '活动时间',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.startTime}</div>
          <div>{record.endTime}</div>
        </div>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
            style={{ borderRadius: '2px' }}
          >
            复制
          </Button>
          {record.status === 'active' ? (
            <Button
              type="primary"
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'disabled')}
              style={{ borderRadius: '2px' }}
            >
              禁用
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'active')}
              style={{ borderRadius: '2px' }}
            >
              启用
            </Button>
          )}
          <Popconfirm
            title="确定删除这个规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: '2px' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleAdd = () => {
    setEditingRule(null);
    setCurrentRuleType('');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setCurrentRuleType(rule.type);
    form.setFieldsValue({
      ...rule,
      dateRange: [moment(rule.startTime), moment(rule.endTime)]
    });
    setModalVisible(true);
  };

  const handleRuleTypeChange = (type) => {
    setCurrentRuleType(type);
    // 清除配置相关字段
    form.setFieldsValue({ config: {} });
  };

  const handleCopy = (rule) => {
    const newRule = {
      ...rule,
      id: Date.now(),
      name: `${rule.name} - 副本`,
      status: 'draft',
      createTime: new Date().toLocaleString()
    };
    
    if (activeTab === 'earning') {
      setEarningRules([...earningRules, newRule]);
    } else {
      setUsageRules([...usageRules, newRule]);
    }
    message.success('复制成功');
  };

  const handleDelete = (id) => {
    if (activeTab === 'earning') {
      setEarningRules(earningRules.filter(rule => rule.id !== id));
    } else {
      setUsageRules(usageRules.filter(rule => rule.id !== id));
    }
    message.success('删除成功');
  };

  const handleStatusChange = (id, status) => {
    if (activeTab === 'earning') {
      setEarningRules(earningRules.map(rule => 
        rule.id === id ? { ...rule, status } : rule
      ));
    } else {
      setUsageRules(usageRules.map(rule => 
        rule.id === id ? { ...rule, status } : rule
      ));
    }
    message.success(`${status === 'active' ? '启用' : '禁用'}成功`);
  };

  const handleSubmit = async (values) => {
    try {
      const ruleData = {
        ...values,
        id: editingRule ? editingRule.id : Date.now(),
        startTime: values.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        createTime: editingRule ? editingRule.createTime : new Date().toLocaleString()
      };
      
      delete ruleData.dateRange;

      if (editingRule) {
        // 编辑
        if (activeTab === 'earning') {
          setEarningRules(earningRules.map(rule => 
            rule.id === editingRule.id ? ruleData : rule
          ));
        } else {
          setUsageRules(usageRules.map(rule => 
            rule.id === editingRule.id ? ruleData : rule
          ));
        }
        message.success('更新成功');
      } else {
        // 新增
        if (activeTab === 'earning') {
          setEarningRules([...earningRules, ruleData]);
        } else {
          setUsageRules([...usageRules, ruleData]);
        }
        message.success('添加成功');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ borderRadius: '2px' }}
            >
              新建规则
            </Button>
          }
        >
          <TabPane tab="积分获取规则" key="earning">
            <Table
              columns={earningColumns}
              dataSource={earningRules}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
            />
          </TabPane>
          <TabPane tab="积分应用规则" key="usage">
            <Table
              columns={usageColumns}
              dataSource={usageRules}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 新建/编辑规则弹窗 */}
      <Modal
        title={editingRule ? '编辑规则' : '新建规则'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Card title="基础信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="规则名称"
                  rules={[{ required: true, message: '请输入规则名称' }]}
                >
                  <Input placeholder="请输入规则名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="规则类型"
                  rules={[{ required: true, message: '请选择规则类型' }]}
                >
                  <Select 
                    placeholder="请选择规则类型"
                    onChange={handleRuleTypeChange}
                  >
                    {activeTab === 'earning' ? (
                      <>
                        <Option value="member_behavior">会员行为</Option>
                        <Option value="fuel_consumption">加油消费</Option>
                        <Option value="store_consumption">便利店消费</Option>
                      </>
                    ) : (
                      <>
                                            <Option value="lottery">积分抽奖</Option>
                    <Option value="transfer">积分转赠</Option>
                    <Option value="redemption">积分核销</Option>
                      </>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={activeTab === 'earning' ? 12 : 24}>
                {activeTab === 'earning' && (
                  <Form.Item
                    name="priority"
                    label="优先级"
                    rules={[{ required: true, message: '请输入优先级' }]}
                    tooltip="数字越小，优先级越高"
                  >
                    <InputNumber
                      placeholder="请输入优先级"
                      min={1}
                      max={100}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="规则状态"
                  rules={[{ required: true, message: '请选择规则状态' }]}
                >
                  <Select placeholder="请选择规则状态">
                    <Option value="draft">草稿</Option>
                    <Option value="active">生效中</Option>
                    <Option value="disabled">已禁用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="dateRange"
              label="有效期"
              rules={[{ required: true, message: '请选择有效期' }]}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="规则描述"
              rules={[{ required: true, message: '请输入规则描述' }]}
            >
              <TextArea
                placeholder="请输入规则描述"
                rows={3}
              />
            </Form.Item>
          </Card>

          {/* 规则配置表单 */}
          {currentRuleType && (
            activeTab === 'earning' ? (
              <EarningRuleForm 
                form={form} 
                ruleType={currentRuleType}
                onRuleTypeChange={handleRuleTypeChange}
              />
            ) : (
              <UsageRuleForm 
                form={form} 
                ruleType={currentRuleType}
              />
            )
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={handleCancel}>
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ borderRadius: '2px' }}
              >
                {editingRule ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsConfig; 