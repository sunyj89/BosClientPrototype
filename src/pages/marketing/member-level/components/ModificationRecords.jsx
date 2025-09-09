import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, DatePicker, Space, Tag, Modal, Descriptions, Timeline, Row, Col, Badge } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ModificationRecords = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [recordData, setRecordData] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    loadRecordData();
  }, []);

  const loadRecordData = async () => {
    setLoading(true);
    try {
      // 模拟修改记录数据
      const mockRecords = [
        {
          id: 'MOD001',
          changeTime: '2025-01-22 14:30:15',
          targetType: 'rule',
          targetId: 'RULE001',
          targetName: '2025年Q1会员冲刺活动',
          changeType: 'update',
          changeField: '等级门槛',
          changeDescription: '调整黄金会员消费门槛从2000元提升至2500元',
          operator: '张管理员',
          operatorId: 'USER001',
          approvalStatus: 'approved',
          approvalBy: '李经理',
          approvalTime: '2025-01-22 15:45:20',
          oldValue: '2000元',
          newValue: '2500元',
          reason: '根据市场调研，提升门槛以优化会员结构',
          affectedMembers: 1250
        },
        {
          id: 'MOD002',
          changeTime: '2025-01-21 10:15:30',
          targetType: 'level',
          targetId: 'LEVEL003',
          targetName: 'Lv3-黄金会员',
          changeType: 'update',
          changeField: '会员权益',
          changeDescription: '新增洗车服务优惠券权益',
          operator: '王主管',
          operatorId: 'USER002',
          approvalStatus: 'pending',
          approvalBy: null,
          approvalTime: null,
          oldValue: '油品95折，双倍积分',
          newValue: '油品95折，双倍积分，月度洗车券',
          reason: '提升黄金会员权益吸引力',
          affectedMembers: 4200
        },
        {
          id: 'MOD003',
          changeTime: '2025-01-20 16:45:00',
          targetType: 'rule',
          targetId: 'RULE001',
          targetName: '2025年Q1会员冲刺活动',
          changeType: 'create',
          changeField: '规则创建',
          changeDescription: '创建新的会员定级规则',
          operator: '张管理员',
          operatorId: 'USER001',
          approvalStatus: 'approved',
          approvalBy: '李经理',
          approvalTime: '2025-01-20 17:30:00',
          oldValue: null,
          newValue: '完整规则配置',
          reason: '2025年Q1业绩提升计划',
          affectedMembers: 25680
        },
        {
          id: 'MOD004',
          changeTime: '2025-01-19 09:20:10',
          targetType: 'level',
          targetId: 'LEVEL002',
          targetName: 'Lv2-银牌会员',
          changeType: 'update',
          changeField: '消费门槛',
          changeDescription: '降低银牌会员消费门槛',
          operator: '刘助理',
          operatorId: 'USER003',
          approvalStatus: 'rejected',
          approvalBy: '李经理',
          approvalTime: '2025-01-19 14:30:00',
          oldValue: '1000元',
          newValue: '800元',
          reason: '提升会员转化率',
          affectedMembers: 0,
          rejectReason: '调整幅度过大，需要重新评估'
        }
      ];
      setRecordData(mockRecords);
    } catch (error) {
      console.error('加载记录数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    loadRecordData();
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadRecordData();
  };

  const showDetailModal = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentRecord(null);
  };

  const getChangeTypeTag = (type) => {
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
  };

  const getApprovalStatusBadge = (status) => {
    const statusConfig = {
      pending: { status: 'processing', text: '待审批', color: '#1890ff' },
      approved: { status: 'success', text: '已通过', color: '#52c41a' },
      rejected: { status: 'error', text: '已拒绝', color: '#ff4d4f' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge status={config.status} text={config.text} />;
  };

  const columns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160,
      sorter: true,
      render: (time) => <strong>{time}</strong>
    },
    {
      title: '变更对象',
      key: 'target',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.targetName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {record.targetType === 'rule' ? '定级规则' : '会员等级'} | ID: {record.targetId}
          </div>
        </div>
      )
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => getChangeTypeTag(type)
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
      key: 'changeField',
      width: 120,
      render: (field) => <Tag color="blue">{field}</Tag>
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 250,
      ellipsis: true
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (status) => getApprovalStatusBadge(status)
    },
    {
      title: '影响会员数',
      dataIndex: 'affectedMembers',
      key: 'affectedMembers',
      width: 120,
      render: (count, record) => (
        <div>
          {record.approvalStatus === 'approved' ? (
            <strong style={{ color: '#1890ff' }}>{count.toLocaleString()}</strong>
          ) : (
            <span style={{ color: '#999' }}>-</span>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
          >
            查看详情
          </Button>
        </Space>
      )
    }
  ];

  const renderDetailModal = () => {
    if (!currentRecord) return null;

    return (
      <Modal
        title="修改记录详情"
        open={detailModalVisible}
        onCancel={closeDetailModal}
        width={800}
        footer={null}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="变更时间" span={2}>
            {currentRecord.changeTime}
          </Descriptions.Item>
          <Descriptions.Item label="变更对象">
            {currentRecord.targetName}
          </Descriptions.Item>
          <Descriptions.Item label="对象类型">
            {currentRecord.targetType === 'rule' ? '定级规则' : '会员等级'}
          </Descriptions.Item>
          <Descriptions.Item label="变更类型">
            {getChangeTypeTag(currentRecord.changeType)}
          </Descriptions.Item>
          <Descriptions.Item label="变更字段">
            <Tag color="blue">{currentRecord.changeField}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="变更描述" span={2}>
            {currentRecord.changeDescription}
          </Descriptions.Item>
          <Descriptions.Item label="变更原因" span={2}>
            {currentRecord.reason}
          </Descriptions.Item>
          {currentRecord.changeType !== 'create' && (
            <>
              <Descriptions.Item label="原始值">
                <div style={{ background: '#fff2f0', padding: '8px', borderRadius: '4px' }}>
                  {currentRecord.oldValue || '无'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="新值">
                <div style={{ background: '#f6ffed', padding: '8px', borderRadius: '4px' }}>
                  {currentRecord.newValue}
                </div>
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="操作人">
            {currentRecord.operator}
          </Descriptions.Item>
          <Descriptions.Item label="审批状态">
            {getApprovalStatusBadge(currentRecord.approvalStatus)}
          </Descriptions.Item>
          {currentRecord.approvalBy && (
            <Descriptions.Item label="审批人">
              {currentRecord.approvalBy}
            </Descriptions.Item>
          )}
          {currentRecord.approvalTime && (
            <Descriptions.Item label="审批时间">
              {currentRecord.approvalTime}
            </Descriptions.Item>
          )}
          {currentRecord.rejectReason && (
            <Descriptions.Item label="拒绝原因" span={2}>
              <div style={{ color: '#ff4d4f' }}>{currentRecord.rejectReason}</div>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="影响会员数">
            {currentRecord.approvalStatus === 'approved' ? 
              `${currentRecord.affectedMembers.toLocaleString()}人` : '暂无影响'}
          </Descriptions.Item>
        </Descriptions>

        {/* 操作流程时间线 */}
        <div style={{ marginTop: '24px' }}>
          <h4>操作流程</h4>
          <Timeline>
            <Timeline.Item 
              color="blue"
              dot={getChangeTypeTag(currentRecord.changeType).props.icon}
            >
              <div>
                <div><strong>{currentRecord.operator}</strong> 执行了{getChangeTypeTag(currentRecord.changeType).props.children}操作</div>
                <div style={{ color: '#666', fontSize: '12px' }}>{currentRecord.changeTime}</div>
              </div>
            </Timeline.Item>
            
            {currentRecord.approvalStatus === 'approved' && (
              <Timeline.Item color="green">
                <div>
                  <div><strong>{currentRecord.approvalBy}</strong> 审批通过</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{currentRecord.approvalTime}</div>
                </div>
              </Timeline.Item>
            )}
            
            {currentRecord.approvalStatus === 'rejected' && (
              <Timeline.Item color="red">
                <div>
                  <div><strong>{currentRecord.approvalBy}</strong> 审批拒绝</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{currentRecord.approvalTime}</div>
                  <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
                    拒绝原因: {currentRecord.rejectReason}
                  </div>
                </div>
              </Timeline.Item>
            )}
            
            {currentRecord.approvalStatus === 'pending' && (
              <Timeline.Item color="gray">
                <div>
                  <div>等待审批中...</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>预计1-2个工作日完成审批</div>
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      {/* 筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={searchForm} onFinish={handleSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="规则名称/等级名称" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="changeType" label="变更类型">
                <Select placeholder="请选择变更类型" style={{ width: '100%' }} allowClear>
                  <Option value="create">新建</Option>
                  <Option value="update">修改</Option>
                  <Option value="delete">删除</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="changeField" label="变更字段">
                <Select placeholder="请选择变更字段" style={{ width: '100%' }} allowClear>
                  <Option value="规则创建">规则创建</Option>
                  <Option value="等级门槛">等级门槛</Option>
                  <Option value="会员权益">会员权益</Option>
                  <Option value="消费门槛">消费门槛</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="approvalStatus" label="审批状态">
                <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                  <Option value="pending">待审批</Option>
                  <Option value="approved">已通过</Option>
                  <Option value="rejected">已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="timeRange" label="变更时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="operator" label="操作人">
                <Input placeholder="请输入操作人" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={recordData}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
        }}
        scroll={{ x: 'max-content' }}
      />

      {renderDetailModal()}
    </div>
  );
};

export default ModificationRecords;