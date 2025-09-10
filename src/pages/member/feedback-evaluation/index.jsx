import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Form, Input, Select, DatePicker, Space, Modal, Row, Col, Statistic, Spin, message, Tooltip, Rate, Tag, Badge, Descriptions, Timeline } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, ExportOutlined, StarOutlined, BarChartOutlined, UserOutlined, CommentOutlined, MessageOutlined, CheckOutlined, CloseOutlined, HistoryOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MemberFeedbackEvaluation = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('evaluation');
  const [evaluationForm] = Form.useForm();
  const [ruleForm] = Form.useForm();
  
  // 数据状态
  const [evaluationData, setEvaluationData] = useState([]);
  const [statisticsData, setStatisticsData] = useState({});
  const [modificationRecords, setModificationRecords] = useState([]);
  
  // 弹窗状态
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [batchReplyModalVisible, setBatchReplyModalVisible] = useState(false);
  const [modificationDetailModalVisible, setModificationDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentModificationRecord, setCurrentModificationRecord] = useState(null);
  
  // 批量选择状态
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  
  // 回复表单
  const [replyForm] = Form.useForm();
  const [batchReplyForm] = Form.useForm();
  const [modificationSearchForm] = Form.useForm();

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    console.log('开始加载数据...');
    setLoading(true);
    try {
      // 使用动态导入加载Mock数据
      const mockDataModule = await import('../../../mock/member/feedbackEvaluationData.json');
      const mockData = mockDataModule.default;
      console.log('成功加载数据:', mockData);
      
      setEvaluationData(mockData.evaluationData || []);
      setStatisticsData(mockData.statisticsData || {});
      setModificationRecords(mockData.modificationRecords || []);
      console.log('数据设置完成');
    } catch (error) {
      console.error('Failed to load mock data:', error);
      // 设置默认空数据，避免页面卡死
      setEvaluationData([]);
      setStatisticsData({});
      setModificationRecords([]);
    } finally {
      setLoading(false);
      console.log('加载状态设置为false');
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
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

  // 单个回复功能
  const handleReplyEvaluation = (record) => {
    setCurrentRecord(record);
    setReplyModalVisible(true);
    replyForm.resetFields();
  };

  const handleSubmitReply = (values) => {
    console.log('回复评价:', currentRecord.evaluationId, values);
    // 更新评价数据
    const updatedData = evaluationData.map(item => {
      if (item.evaluationId === currentRecord.evaluationId) {
        return {
          ...item,
          replyStatus: '已回复',
          replyContent: values.replyContent,
          replyTime: new Date().toLocaleString('zh-CN'),
          replyBy: '当前管理员'
        };
      }
      return item;
    });
    setEvaluationData(updatedData);
    setReplyModalVisible(false);
    message.success('回复发送成功');
  };

  // 批量选择功能
  const handleSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  // 批量回复功能
  const handleBatchReply = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要回复的评价');
      return;
    }
    setBatchReplyModalVisible(true);
    batchReplyForm.resetFields();
  };

  const handleSubmitBatchReply = (values) => {
    console.log('批量回复评价:', selectedRowKeys, values);
    // 更新多个评价的数据
    const updatedData = evaluationData.map(item => {
      if (selectedRowKeys.includes(item.evaluationId)) {
        return {
          ...item,
          replyStatus: '已回复',
          replyContent: values.replyContent,
          replyTime: new Date().toLocaleString('zh-CN'),
          replyBy: '当前管理员'
        };
      }
      return item;
    });
    setEvaluationData(updatedData);
    setBatchReplyModalVisible(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    message.success(`成功回复 ${selectedRowKeys.length} 条评价`);
  };

  // 修改记录相关处理函数
  const handleModificationSearch = (values) => {
    console.log('搜索修改记录:', values);
  };

  const handleModificationReset = () => {
    modificationSearchForm.resetFields();
  };

  const handleViewModificationDetail = (record) => {
    setCurrentModificationRecord(record);
    setModificationDetailModalVisible(true);
  };


  // 修改记录列定义
  const modificationColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
      sorter: true,
      render: (time) => <strong>{time}</strong>,
    },
    {
      title: '评价信息',
      key: 'evaluationInfo',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.evaluationId}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.memberName}</div>
        </div>
      ),
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => {
        const configs = {
          'create': { color: 'success', icon: <PlusOutlined />, text: '新建' },
          'update': { color: 'warning', icon: <EditOutlined />, text: '修改' },
          'delete': { color: 'error', icon: <DeleteOutlined />, text: '删除' }
        };
        const config = configs[type] || configs['update'];
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
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: '180px'
          }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '操作人',
      key: 'operatorInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.operator}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.operatorId}</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewModificationDetail(record)}
        >
          查看详情
        </Button>
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
      title: '分公司',
      dataIndex: 'branchCompany',
      key: 'branchCompany',
      width: 120,
    },
    {
      title: '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
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
      title: '回复状态',
      dataIndex: 'replyStatus',
      key: 'replyStatus',
      width: 100,
      render: (status) => {
        const configs = {
          '已回复': { color: 'green', icon: <CheckOutlined /> },
          '未回复': { color: 'orange', icon: <CloseOutlined /> }
        };
        const config = configs[status] || configs['未回复'];
        return (
          <span style={{ color: config.color }}>
            {config.icon} {status}
          </span>
        );
      },
    },
    {
      title: '回复时间',
      dataIndex: 'replyTime',
      key: 'replyTime',
      width: 150,
      render: (time) => time || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewEvaluation(record)}>
            查看
          </Button>
          {record.replyStatus !== '已回复' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<MessageOutlined />} 
              onClick={() => handleReplyEvaluation(record)}
            >
              回复
            </Button>
          )}
        </Space>
      ),
    },
  ];


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
              <Form.Item name="branchCompany" label="分公司">
                <Select placeholder="请选择分公司" style={{ width: 120 }} allowClear>
                  <Option value="赣中分公司">赣中分公司</Option>
                  <Option value="赣东北分公司">赣东北分公司</Option>
                  <Option value="赣东分公司">赣东分公司</Option>
                  <Option value="赣东南分公司">赣东南分公司</Option>
                </Select>
              </Form.Item>
              <Form.Item name="stationName" label="油站">
                <Select placeholder="请选择油站" style={{ width: 180 }} allowClear>
                  <Option value="南昌高速服务区加油站">南昌高速服务区加油站</Option>
                  <Option value="上饶高速服务区加油站">上饶高速服务区加油站</Option>
                </Select>
              </Form.Item>
              <Form.Item name="replyStatus" label="回复状态">
                <Select placeholder="请选择回复状态" style={{ width: 120 }} allowClear>
                  <Option value="已回复">已回复</Option>
                  <Option value="未回复">未回复</Option>
                </Select>
              </Form.Item>
              <Form.Item name="memberPhone" label="会员手机号">
                <Input placeholder="请输入会员手机号" style={{ width: 140 }} />
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
                  <Button 
                    type="primary" 
                    icon={<MessageOutlined />} 
                    onClick={handleBatchReply}
                    disabled={selectedRowKeys.length === 0}
                  >
                    批量回复 ({selectedRowKeys.length})
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={evaluationColumns}
          dataSource={evaluationData}
          rowKey="evaluationId"
          scroll={{ x: 'max-content' }}
          rowSelection={{
            selectedRowKeys,
            onChange: handleSelectChange,
            getCheckboxProps: (record) => ({
              disabled: record.replyStatus === '已回复',
              name: record.evaluationId,
            }),
          }}
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

  // 渲染修改记录tab
  const renderModificationRecords = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={modificationSearchForm} layout="inline" onFinish={handleModificationSearch}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="评价ID、会员姓名、操作人" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="changeType" label="变更类型">
            <Select placeholder="请选择变更类型" style={{ width: 120 }} allowClear>
              <Option value="create">新建</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
            </Select>
          </Form.Item>
          <Form.Item name="changeField" label="变更字段">
            <Select placeholder="请选择变更字段" style={{ width: 120 }} allowClear>
              <Option value="回复信息">回复信息</Option>
              <Option value="评价内容">评价内容</Option>
              <Option value="状态信息">状态信息</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="时间范围">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleModificationReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={modificationColumns}
          dataSource={modificationRecords}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={{
            total: modificationRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
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
              <div><strong>分公司：</strong>{currentRecord.branchCompany}</div>
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
            {currentRecord.replyStatus === '已回复' && (
              <>
                <Col span={24} style={{ marginTop: 16 }}>
                  <div><strong>管理员回复：</strong></div>
                  <div style={{ marginTop: 8, padding: 12, background: '#e6f7ff', borderRadius: 4, border: '1px solid #91d5ff' }}>
                    {currentRecord.replyContent}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    <strong>回复时间：</strong>{currentRecord.replyTime}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    <strong>回复人：</strong>{currentRecord.replyBy}
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>
      )}
    </Modal>
  );

  // 渲染单个回复弹窗
  const renderReplyModal = () => (
    <Modal
      title="回复评价"
      open={replyModalVisible}
      onCancel={() => setReplyModalVisible(false)}
      onOk={() => replyForm.submit()}
      width={600}
    >
      {currentRecord && (
        <div style={{ marginBottom: 16 }}>
          <div><strong>会员：</strong>{currentRecord.memberName}</div>
          <div><strong>评价内容：</strong></div>
          <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            {currentRecord.content || '用户未填写评价内容'}
          </div>
        </div>
      )}
      <Form form={replyForm} layout="vertical" onFinish={handleSubmitReply}>
        <Form.Item 
          name="replyContent" 
          label="回复内容" 
          rules={[{ required: true, message: '请输入回复内容' }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="请输入回复内容..." 
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  // 渲染批量回复弹窗
  const renderBatchReplyModal = () => (
    <Modal
      title={`批量回复 (${selectedRowKeys.length} 条)`}
      open={batchReplyModalVisible}
      onCancel={() => setBatchReplyModalVisible(false)}
      onOk={() => batchReplyForm.submit()}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <div><strong>选中的评价：</strong></div>
        <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 4, padding: 12, marginTop: 8 }}>
          {selectedRows.map(record => (
            <div key={record.evaluationId} style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
              <div><strong>{record.memberName}</strong> - {record.orderId}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.content || '用户未填写评价内容'}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Form form={batchReplyForm} layout="vertical" onFinish={handleSubmitBatchReply}>
        <Form.Item 
          name="replyContent" 
          label="批量回复内容" 
          rules={[{ required: true, message: '请输入回复内容' }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="请输入批量回复内容..." 
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  // 渲染修改记录详情弹窗
  const renderModificationDetailModal = () => (
    <Modal
      title={<><HistoryOutlined /> 变更详情</>}
      open={modificationDetailModalVisible}
      onCancel={() => setModificationDetailModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setModificationDetailModalVisible(false)}>
          关闭
        </Button>
      ]}
      width={800}
    >
      {currentModificationRecord && (
        <div>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="记录ID">{currentModificationRecord.id}</Descriptions.Item>
              <Descriptions.Item label="变更时间">{currentModificationRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="评价ID">{currentModificationRecord.evaluationId}</Descriptions.Item>
              <Descriptions.Item label="会员姓名">{currentModificationRecord.memberName}</Descriptions.Item>
              <Descriptions.Item label="变更类型">
                <Tag color={currentModificationRecord.changeType === 'create' ? 'success' : 
                           currentModificationRecord.changeType === 'update' ? 'warning' : 'error'}>
                  {currentModificationRecord.changeType === 'create' ? '新建' : 
                   currentModificationRecord.changeType === 'update' ? '修改' : '删除'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="变更字段">
                <Tag color="blue">{currentModificationRecord.changeField}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作人" span={2}>
                {currentModificationRecord.operator} ({currentModificationRecord.operatorId})
              </Descriptions.Item>
              <Descriptions.Item label="变更原因" span={2}>
                {currentModificationRecord.reason || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="变更详情">
                {currentModificationRecord.changeType === 'create' && (
                  <div>
                    <Tag color="success">新增</Tag>
                    <div style={{ marginTop: 8, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
                      {JSON.stringify(currentModificationRecord.newValue, null, 2)}
                    </div>
                  </div>
                )}
                {currentModificationRecord.changeType === 'update' && (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <Tag color="error">原值</Tag>
                      <div style={{ marginTop: 8, padding: 12, background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 4 }}>
                        {JSON.stringify(currentModificationRecord.oldValue, null, 2)}
                      </div>
                    </div>
                    <div>
                      <Tag color="success">新值</Tag>
                      <div style={{ marginTop: 8, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
                        {JSON.stringify(currentModificationRecord.newValue, null, 2)}
                      </div>
                    </div>
                  </div>
                )}
                {currentModificationRecord.changeType === 'delete' && (
                  <div>
                    <Tag color="error">删除</Tag>
                    <div style={{ marginTop: 8, padding: 12, background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 4 }}>
                      {JSON.stringify(currentModificationRecord.oldValue, null, 2)}
                    </div>
                  </div>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="操作流程">
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <div><strong>操作提交</strong></div>
                          <div style={{ color: '#666', fontSize: '12px' }}>
                            {currentModificationRecord.changeTime}
                          </div>
                          <div style={{ color: '#666', fontSize: '12px' }}>
                            操作人: {currentModificationRecord.operator}
                          </div>
                        </div>
                      ),
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );

  const tabItems = [
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
      key: 'modification',
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
      {renderEvaluationModal()}
      {renderReplyModal()}
      {renderBatchReplyModal()}
      {renderModificationDetailModal()}

      {/* 字段说明 */}
      <Card title="字段说明" style={{ marginTop: 16 }}>
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <h4>基础信息</h4>
            <ul style={{ paddingLeft: 16 }}>
              <li><strong>评价ID：</strong>系统自动生成的唯一标识</li>
              <li><strong>会员信息：</strong>包含会员姓名和手机号</li>
              <li><strong>订单信息：</strong>包含订单号和消费金额</li>
              <li><strong>评价星级：</strong>1-5星评分，5星为最高</li>
              <li><strong>评价内容：</strong>会员填写的文字评价</li>
              <li><strong>评价时间：</strong>会员提交评价的时间</li>
            </ul>
          </Col>
          <Col span={8}>
            <h4>组织架构</h4>
            <ul style={{ paddingLeft: 16 }}>
              <li><strong>分公司：</strong>油站所属的分公司</li>
              <li><strong>油站：</strong>具体的加油站名称</li>
            </ul>
            <h4>回复管理</h4>
            <ul style={{ paddingLeft: 16 }}>
              <li><strong>回复状态：</strong>已回复/未回复</li>
              <li><strong>回复时间：</strong>管理员回复的时间</li>
              <li><strong>回复内容：</strong>管理员的回复文字</li>
              <li><strong>回复人：</strong>执行回复操作的管理员</li>
            </ul>
          </Col>
          <Col span={8}>
            <h4>操作功能</h4>
            <ul style={{ paddingLeft: 16 }}>
              <li><strong>查看：</strong>查看评价详情和回复记录</li>
              <li><strong>回复：</strong>对未回复评价进行回复</li>
              <li><strong>批量回复：</strong>选择多个评价统一回复</li>
            </ul>
            <h4>筛选条件</h4>
            <ul style={{ paddingLeft: 16 }}>
              <li><strong>评价星级：</strong>按1-5星筛选</li>
              <li><strong>分公司：</strong>按分公司筛选</li>
              <li><strong>油站：</strong>按油站筛选</li>
              <li><strong>回复状态：</strong>已回复/未回复</li>
              <li><strong>会员手机号：</strong>精确查找会员</li>
              <li><strong>评价时间：</strong>按时间范围筛选</li>
            </ul>
            <h4>修改记录</h4>
            <ul style={{ paddingLeft: 16 }}>
              <li><strong>变更时间：</strong>操作发生的时间</li>
              <li><strong>变更类型：</strong>新建/修改/删除</li>
              <li><strong>变更字段：</strong>具体变更的数据字段</li>
              <li><strong>变更描述：</strong>操作的简要说明</li>
              <li><strong>操作人：</strong>执行操作的用户</li>
              <li><strong>变更对比：</strong>修改前后数据对比</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MemberFeedbackEvaluation; 