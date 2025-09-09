import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Row, Col, message, Descriptions, Image } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import RuleConfigModal from './RuleConfigModal';

const { RangePicker } = DatePicker;
const { Option } = Select;

const RuleManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [rulesData, setRulesData] = useState([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [viewingRule, setViewingRule] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    loadRulesData();
  }, []);

  const loadRulesData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockRulesData = [
        {
          id: 'RULE001',
          ruleName: '2025年Q1会员冲刺活动',
          effectivePeriod: {
            startTime: '2025-01-01 00:00:00',
            endTime: '2025-03-31 23:59:59'
          },
          status: 'active', // pending, active, ended, manually_ended
          statusText: '生效中',
          createdTime: '2024-12-15 10:30:00',
          createdBy: '张管理员',
          description: '为提升Q1业绩，制定的会员等级激励规则。本规则采用油品消费升数作为等级判定标准，按自然月进行定级评定，支持严格的升降级机制。',
          levelCount: 4,
          memberCount: 15230
        },
        {
          id: 'RULE002', 
          ruleName: '2024年年终大促活动',
          effectivePeriod: {
            startTime: '2024-11-01 00:00:00',
            endTime: '2024-12-31 23:59:59'
          },
          status: 'ended',
          statusText: '已结束',
          createdTime: '2024-10-25 14:20:00',
          createdBy: '李经理',
          description: '年终促销期间的特殊等级规则。针对年终促销活动设计的专属等级体系，采用更加优惠的升级条件和丰富的会员权益。',
          levelCount: 5,
          memberCount: 12800
        },
        {
          id: 'RULE003',
          ruleName: '春节特惠活动',
          effectivePeriod: {
            startTime: '2025-02-01 00:00:00',
            endTime: '2025-02-28 23:59:59'
          },
          status: 'pending',
          statusText: '待生效',
          createdTime: '2025-01-20 16:45:00',
          createdBy: '王主管',
          description: '春节期间的会员等级优惠活动。为了在春节期间吸引更多会员消费，特别设计的优惠等级体系，包含多种会员权益和特殊优惠。',
          levelCount: 3,
          memberCount: 0
        }
      ];
      setRulesData(mockRulesData);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实现搜索逻辑
    loadRulesData();
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadRulesData();
  };

  const showCreateModal = () => {
    setEditingRule(null);
    setConfigModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRule(record);
    setConfigModalVisible(true);
  };
  
  const showViewModal = (record) => {
    setViewingRule(record);
    setViewModalVisible(true);
  };

  const handleModalClose = () => {
    setConfigModalVisible(false);
    setEditingRule(null);
    loadRulesData();
  };
  
  const handleViewModalClose = () => {
    setViewModalVisible(false);
    setViewingRule(null);
  };

  const handleStartRule = async (record) => {
    Modal.confirm({
      title: '确认启用规则',
      content: `确定要启用规则"${record.ruleName}"吗？启用后将自动停用其他生效中的规则。`,
      onOk: async () => {
        try {
          setLoading(true);
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 1000));
          message.success('规则启用成功');
          loadRulesData();
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleStopRule = async (record) => {
    Modal.confirm({
      title: '确认停用规则',
      content: `确定要停用规则"${record.ruleName}"吗？停用后该规则将不再生效。`,
      onOk: async () => {
        try {
          setLoading(true);
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 1000));
          message.success('规则已停用');
          loadRulesData();
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDeleteRule = async (record) => {
    Modal.confirm({
      title: '确认删除规则',
      content: `确定要删除规则"${record.ruleName}"吗？此操作不可恢复。`,
      onOk: async () => {
        try {
          setLoading(true);
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 1000));
          message.success('规则删除成功');
          loadRulesData();
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { status: 'processing', text: '待生效', color: '#1890ff' },
      active: { status: 'success', text: '生效中', color: '#52c41a' },
      ended: { status: 'default', text: '已结束', color: '#d9d9d9' },
      manually_ended: { status: 'warning', text: '人工结束', color: '#faad14' }
    };
    const config = statusConfig[status] || statusConfig.ended;
    return <Badge status={config.status} text={config.text} />;
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
      render: (name) => <strong>{name}</strong>
    },
    {
      title: '生效周期',
      dataIndex: 'effectivePeriod',
      key: 'effectivePeriod',
      width: 260,
      render: (period) => (
        <div>
          <div>{period.startTime}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>至 {period.endTime}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusBadge(status)
    },
    {
      title: '等级数量',
      dataIndex: 'levelCount',
      key: 'levelCount',
      width: 100,
      render: (count) => <Tag color="blue">{count}个等级</Tag>
    },
    {
      title: '覆盖会员',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 120,
      render: (count) => (
        <strong style={{ color: '#1890ff' }}>{count.toLocaleString()}</strong>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 160,
      render: (time) => time
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
          >
            查看
          </Button>
          {(record.status === 'pending' || record.status === 'ended') && (
            <Button 
              type="primary" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)}
            >
              编辑
            </Button>
          )}
          {record.status === 'pending' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartRule(record)}
            >
              启用
            </Button>
          )}
          {record.status === 'active' && (
            <Button 
              type="primary" 
              size="small" 
              danger
              icon={<PauseCircleOutlined />}
              onClick={() => handleStopRule(record)}
            >
              停用
            </Button>
          )}
          {record.status !== 'active' && (
            <Button 
              type="primary" 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteRule(record)}
            >
              删除
            </Button>
          )}
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'active'
    })
  };

  return (
    <div>
      {/* 筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={searchForm} onFinish={handleSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="ruleName" label="规则名称">
                <Input placeholder="请输入规则名称" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                  <Option value="pending">待生效</Option>
                  <Option value="active">生效中</Option>
                  <Option value="ended">已结束</Option>
                  <Option value="manually_ended">人工结束</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="effectiveTime" label="生效时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="createdBy" label="创建人">
                <Input placeholder="请输入创建人" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={5} style={{ textAlign: 'right' }}>
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
            <Col span={24}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
                  新建规则
                </Button>
                {selectedRowKeys.length > 0 && (
                  <Button danger>
                    批量删除 ({selectedRowKeys.length})
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={rulesData}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* 规则配置弹窗 */}
      <RuleConfigModal
        visible={configModalVisible}
        editingRule={editingRule}
        onCancel={handleModalClose}
        onSuccess={handleModalClose}
      />
      
      {/* 规则查看弹窗 */}
      <Modal
        title="定级规则详情"
        open={viewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button key="close" onClick={handleViewModalClose}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {viewingRule && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="规则名称">{viewingRule.ruleName}</Descriptions.Item>
              <Descriptions.Item label="规则状态">
                {getStatusBadge(viewingRule.status)}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{viewingRule.createdTime}</Descriptions.Item>
              <Descriptions.Item label="创建人">{viewingRule.createdBy}</Descriptions.Item>
              <Descriptions.Item label="生效开始时间">{viewingRule.effectivePeriod.startTime}</Descriptions.Item>
              <Descriptions.Item label="生效结束时间">{viewingRule.effectivePeriod.endTime}</Descriptions.Item>
              <Descriptions.Item label="等级数量">
                <Tag color="blue">{viewingRule.levelCount}个等级</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="覆盖会员">
                <strong style={{ color: '#1890ff' }}>{viewingRule.memberCount.toLocaleString()}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="规则描述" span={2}>{viewingRule.description}</Descriptions.Item>
            </Descriptions>
            
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginTop: 24,
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              等级配置信息
            </div>
            
            <Descriptions column={3} bordered size="small">
              <Descriptions.Item label="消费统计口径">
                油品消费升数
              </Descriptions.Item>
              <Descriptions.Item label="定级周期">
                按自然月
              </Descriptions.Item>
              <Descriptions.Item label="升降级模式">
                严格重评定
              </Descriptions.Item>
              <Descriptions.Item label="适用油站" span={2}>
                全部油站
              </Descriptions.Item>
              <Descriptions.Item label="排除会员组">
                无
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginTop: 24,
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              规则图示
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Image
                width={150}
                src="https://gw.alipayobjects.com/zos/antfincdn/LlvU1nEt%26l/step1.svg"
                alt="规则图示1"
              />
              <Image
                width={150}
                src="https://gw.alipayobjects.com/zos/antfincdn/LlvU1nEt%26l/step2.svg"
                alt="规则图示2"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RuleManagement;