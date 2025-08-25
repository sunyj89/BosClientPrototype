import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Row, Col, Statistic, Progress, Spin, message, Tooltip, Switch, InputNumber, Divider, Rate } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExportOutlined, SettingOutlined, CommentOutlined, StarOutlined, BarChartOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import mockData from '../../../mock/member/feedbackEvaluationData.json';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const MemberFeedbackEvaluation = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');
  const [feedbackForm] = Form.useForm();
  const [evaluationForm] = Form.useForm();
  const [ruleForm] = Form.useForm();
  
  // 数据状态
  const [feedbackData, setFeedbackData] = useState([]);
  const [evaluationData, setEvaluationData] = useState([]);
  const [statisticsData, setStatisticsData] = useState({});
  const [evaluationRules, setEvaluationRules] = useState({});
  
  // 弹窗状态
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      // 加载Mock数据
      setFeedbackData(mockData.feedbackData || []);
      setEvaluationData(mockData.evaluationData || []);
      setStatisticsData(mockData.statisticsData || {});
      setEvaluationRules(mockData.evaluationRules || {});
      setLoading(false);
    }, 500);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 会员意见反馈明列表处理函数
  const handleFeedbackSearch = (values) => {
    console.log('搜索意见反馈:', values);
  };

  const handleFeedbackReset = () => {
    feedbackForm.resetFields();
  };

  const handleViewFeedback = (record) => {
    setCurrentRecord(record);
    setFeedbackModalVisible(true);
  };

  const handleReplyFeedback = (record) => {
    message.info('回复功能开发中');
  };

  // 会员消费评价列表处理函数
  const handleEvaluationSearch = (values) => {
    console.log('搜索消费评价:', values);
  };

  const handleEvaluationReset = () => {
    evaluationForm.resetFields();
  };

  const handleViewEvaluation = (record) => {
    setCurrentRecord(record);
    setEvaluationModalVisible(true);
  };

  const handleOpenRuleSettings = () => {
    setRuleModalVisible(true);
  };

  const handleSaveRules = (values) => {
    console.log('保存评价规则:', values);
    setEvaluationRules(values);
    setRuleModalVisible(false);
    message.success('评价规则保存成功');
  };

  // 会员意见反馈列定义
  const feedbackColumns = [
    {
      title: '反馈ID',
      dataIndex: 'feedbackId',
      key: 'feedbackId',
      width: 100,
    },
    {
      title: '会员信息',
      key: 'memberInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.memberName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.memberPhone}</div>
        </div>
      ),
    },
    {
      title: '反馈类型',
      dataIndex: 'feedbackType',
      key: 'feedbackType',
      width: 100,
      render: (type) => {
        const colors = {
          '服务投诉': 'red',
          '功能建议': 'blue',
          '系统问题': 'orange',
          '其他': 'default'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      },
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: '280px'
          }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const configs = {
          '待处理': { color: 'orange', text: '待处理' },
          '处理中': { color: 'blue', text: '处理中' },
          '已回复': { color: 'green', text: '已回复' },
          '已关闭': { color: 'default', text: '已关闭' }
        };
        return <Badge status={configs[status]?.color} text={configs[status]?.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewFeedback(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<MessageOutlined />} onClick={() => handleReplyFeedback(record)}>
            回复
          </Button>
        </Space>
      ),
    },
  ];

  // 会员消费评价列定义
  const evaluationColumns = [
    {
      title: '评价ID',
      dataIndex: 'evaluationId',
      key: 'evaluationId',
      width: 100,
    },
    {
      title: '会员信息',
      key: 'memberInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.memberName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.memberPhone}</div>
        </div>
      ),
    },
    {
      title: '订单信息',
      key: 'orderInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.orderId}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>￥{record.orderAmount}</div>
        </div>
      ),
    },
    {
      title: '评价星级',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: '14px' }} />,
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: '280px'
          }}>
            {text || '用户未填写评价内容'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '评价时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewEvaluation(record)}>
          查看
        </Button>
      ),
    },
  ];

  // 渲染会员意见反馈明列表tab
  const renderFeedbackList = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={feedbackForm} layout="inline" onFinish={handleFeedbackSearch}>
          <Form.Item name="feedbackType" label="反馈类型">
            <Select placeholder="请选择反馈类型" style={{ width: 140 }} allowClear>
              <Option value="服务投诉">服务投诉</Option>
              <Option value="功能建议">功能建议</Option>
              <Option value="系统问题">系统问题</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="处理状态">
            <Select placeholder="请选择处理状态" style={{ width: 140 }} allowClear>
              <Option value="待处理">待处理</Option>
              <Option value="处理中">处理中</Option>
              <Option value="已回复">已回复</Option>
              <Option value="已关闭">已关闭</Option>
            </Select>
          </Form.Item>
          <Form.Item name="memberName" label="会员姓名">
            <Input placeholder="请输入会员姓名" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="dateRange" label="反馈时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleFeedbackReset}>
                重置
              </Button>
              <Button type="primary" icon={<ExportOutlined />}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={feedbackColumns}
          dataSource={feedbackData}
          rowKey="feedbackId"
          scroll={{ x: 'max-content' }}
          pagination={{
            total: feedbackData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染会员消费评价列表tab
  const renderEvaluationList = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Form form={evaluationForm} layout="inline" onFinish={handleEvaluationSearch}>
              <Form.Item name="rating" label="评价星级">
                <Select placeholder="请选择星级" style={{ width: 120 }} allowClear>
                  <Option value={5}>5星</Option>
                  <Option value={4}>4星</Option>
                  <Option value={3}>3星</Option>
                  <Option value={2}>2星</Option>
                  <Option value={1}>1星</Option>
                </Select>
              </Form.Item>
              <Form.Item name="stationName" label="油站">
                <Select placeholder="请选择油站" style={{ width: 180 }} allowClear>
                  <Option value="南昌高速服务区加油站">南昌高速服务区加油站</Option>
                  <Option value="上饶高速服务区加油站">上饶高速服务区加油站</Option>
                </Select>
              </Form.Item>
              <Form.Item name="memberName" label="会员姓名">
                <Input placeholder="请输入会员姓名" style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name="dateRange" label="评价时间">
                <RangePicker style={{ width: 240 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleEvaluationReset}>
                    重置
                  </Button>
                  <Button type="primary" icon={<ExportOutlined />}>
                    导出
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>
          <Col>
            <Button type="primary" icon={<SettingOutlined />} onClick={handleOpenRuleSettings}>
              评价规则设置
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={evaluationColumns}
          dataSource={evaluationData}
          rowKey="evaluationId"
          scroll={{ x: 'max-content' }}
          pagination={{
            total: evaluationData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染会员评价参与率和满意度统计tab
  const renderStatistics = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总评价数"
              value={statisticsData.totalEvaluations || 0}
              prefix={<CommentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="参与率"
              value={statisticsData.participationRate || 0}
              suffix="%"
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均满意度"
              value={statisticsData.averageRating || 0}
              precision={1}
              suffix="星"
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="好评率"
              value={statisticsData.positiveRate || 0}
              suffix="%"
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="评价星级分布">
            <div style={{ height: '300px', padding: '20px' }}>
              {/* 这里将放置星级分布图表 */}
              <div style={{ textAlign: 'center', color: '#666', marginTop: '120px' }}>
                评价星级分布图表区域
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="月度评价趋势">
            <div style={{ height: '300px', padding: '20px' }}>
              {/* 这里将放置月度趋势图表 */}
              <div style={{ textAlign: 'center', color: '#666', marginTop: '120px' }}>
                月度评价趋势图表区域
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染意见反馈查看弹窗
  const renderFeedbackModal = () => (
    <Modal
      title="意见反馈详情"
      open={feedbackModalVisible}
      onCancel={() => setFeedbackModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setFeedbackModalVisible(false)}>
          关闭
        </Button>,
        <Button key="reply" type="primary" icon={<MessageOutlined />}>
          回复
        </Button>
      ]}
      width={800}
    >
      {currentRecord && (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div><strong>反馈ID：</strong>{currentRecord.feedbackId}</div>
            </Col>
            <Col span={12}>
              <div><strong>反馈类型：</strong>{currentRecord.feedbackType}</div>
            </Col>
            <Col span={12}>
              <div><strong>会员姓名：</strong>{currentRecord.memberName}</div>
            </Col>
            <Col span={12}>
              <div><strong>联系电话：</strong>{currentRecord.memberPhone}</div>
            </Col>
            <Col span={24}>
              <div><strong>反馈内容：</strong></div>
              <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                {currentRecord.content}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );

  // 渲染消费评价查看弹窗
  const renderEvaluationModal = () => (
    <Modal
      title="消费评价详情"
      open={evaluationModalVisible}
      onCancel={() => setEvaluationModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setEvaluationModalVisible(false)}>
          关闭
        </Button>
      ]}
      width={800}
    >
      {currentRecord && (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div><strong>评价ID：</strong>{currentRecord.evaluationId}</div>
            </Col>
            <Col span={12}>
              <div><strong>订单号：</strong>{currentRecord.orderId}</div>
            </Col>
            <Col span={12}>
              <div><strong>会员姓名：</strong>{currentRecord.memberName}</div>
            </Col>
            <Col span={12}>
              <div><strong>消费金额：</strong>￥{currentRecord.orderAmount}</div>
            </Col>
            <Col span={12}>
              <div><strong>评价星级：</strong><Rate disabled defaultValue={currentRecord.rating} /></div>
            </Col>
            <Col span={12}>
              <div><strong>油站：</strong>{currentRecord.stationName}</div>
            </Col>
            <Col span={24}>
              <div><strong>评价内容：</strong></div>
              <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                {currentRecord.content || '用户未填写评价内容'}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );

  // 渲染评价规则设置弹窗
  const renderRuleModal = () => (
    <Modal
      title="评价规则设置"
      open={ruleModalVisible}
      onCancel={() => setRuleModalVisible(false)}
      onOk={() => ruleForm.submit()}
      width={600}
    >
      <Form form={ruleForm} layout="vertical" onFinish={handleSaveRules}>
        <Form.Item name="enableAutoRequest" label="自动邀请评价" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
        <Form.Item name="requestDelay" label="邀请延迟时间">
          <InputNumber
            min={0}
            max={24}
            placeholder="请输入小时数"
            addonAfter="小时"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name="reminderCount" label="提醒次数">
          <InputNumber
            min={0}
            max={5}
            placeholder="请输入提醒次数"
            addonAfter="次"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name="incentivePoints" label="评价奖励积分">
          <InputNumber
            min={0}
            placeholder="请输入奖励积分"
            addonAfter="积分"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name="validityPeriod" label="评价有效期">
          <InputNumber
            min={1}
            max={30}
            placeholder="请输入天数"
            addonAfter="天"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  const tabItems = [
    {
      key: 'feedback',
      label: (
        <span>
          <CommentOutlined />
          会员意见反馈明列表
        </span>
      ),
      children: renderFeedbackList(),
    },
    {
      key: 'evaluation',
      label: (
        <span>
          <StarOutlined />
          会员消费评价列表
        </span>
      ),
      children: renderEvaluationList(),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          评价参与率和满意度统计
        </span>
      ),
      children: renderStatistics(),
    },
  ];

  return (
    <div className="member-feedback-evaluation-container">
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
      {renderFeedbackModal()}
      {renderEvaluationModal()}
      {renderRuleModal()}

      {/* 演示数据说明 */}
      <Card title="演示数据说明" style={{ marginTop: 16 }}>
        <ul>
          <li>
            <strong>功能概述：</strong>
            <ul>
              <li>会员意见反馈明列表：管理和查看会员提交的各类意见反馈</li>
              <li>会员消费评价列表：查看会员对消费服务的星级评价和评价内容</li>
              <li>评价参与率和满意度统计：统计分析会员评价的参与情况和满意度指标</li>
            </ul>
          </li>
          <li>
            <strong>主要功能：</strong>
            <ul>
              <li>支持按反馈类型、处理状态、会员信息、时间范围筛选</li>
              <li>支持查看详细反馈内容和进行回复操作</li>
              <li>支持设置评价规则（自动邀请、奖励积分等）</li>
              <li>提供评价数据统计和可视化图表展示</li>
            </ul>
          </li>
          <li>
            <strong>数据说明：</strong>
            <ul>
              <li>反馈类型：服务投诉、功能建议、系统问题、其他</li>
              <li>处理状态：待处理、处理中、已回复、已关闭</li>
              <li>评价星级：1-5星评价系统</li>
              <li>统计指标：总评价数、参与率、平均满意度、好评率</li>
            </ul>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default MemberFeedbackEvaluation; 