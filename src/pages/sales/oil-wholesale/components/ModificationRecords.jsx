import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Row, Col, Tooltip, Modal, Descriptions, Timeline, message } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, HistoryOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { oilWholesaleService } from '../services/oilWholesaleService.jsx';

const { RangePicker } = DatePicker;
const { Option } = Select;

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
      const response = await oilWholesaleService.getModificationRecords();
      setRecordData(response.data || []);
    } catch (error) {
      console.error('加载修改记录数据失败:', error);
      message.error('加载数据失败');
      // 加载模拟数据
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockData = [
      {
        id: 'LOG001',
        targetId: 'ORDER001',
        targetName: '订货通知单 DH202501250001',
        changeType: 'update',
        changeField: '配送日期',
        changeDescription: '配送日期从2025-01-26调整为2025-01-27',
        operator: '张经理',
        operatorId: 'MGR001',
        changeTime: '2025-01-25 15:20:00',
        approver: '李总监',
        status: 'approved',
        oldValue: { deliveryDate: '2025-01-26' },
        newValue: { deliveryDate: '2025-01-27' },
        reason: '供应商要求调整配送时间'
      },
      {
        id: 'LOG002',
        targetId: 'RECEIPT001',
        targetName: '收货确认单 SH202501270001',
        changeType: 'update',
        changeField: '实际收货数量',
        changeDescription: '实际收货数量从18000L调整为17950L',
        operator: '李收货员',
        operatorId: 'REC001',
        changeTime: '2025-01-27 14:45:00',
        approver: '王主管',
        status: 'approved',
        oldValue: { actualQuantity: 18000 },
        newValue: { actualQuantity: 17950 },
        reason: '实际测量后发现数量差异'
      },
      {
        id: 'LOG003',
        targetId: 'ORDER002',
        targetName: '订货通知单 DH202501250002',
        changeType: 'create',
        changeField: '订单创建',
        changeDescription: '创建新的油品批发订货通知单',
        operator: '王经理',
        operatorId: 'MGR002',
        changeTime: '2025-01-25 10:45:00',
        approver: '赵总监',
        status: 'approved',
        oldValue: null,
        newValue: {
          orderNumber: 'DH202501250002',
          supplierName: '中石油江西销售公司',
          oilType: '95#汽油',
          quantity: 18000,
          totalAmount: 1456200.00
        },
        reason: '业务需求新建订单'
      }
    ];
    setRecordData(mockData);
  };

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实现搜索逻辑
  };

  const showDetailModal = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentRecord(null);
  };

  const columns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160,
      sorter: true,
      render: (time) => <strong>{time}</strong>,
    },
    {
      title: '目标信息',
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

  // 渲染详情弹窗
  const renderDetailModal = () => {
    if (!currentRecord) return null;

    return (
      <Modal
        title="修改记录详情"
        open={detailModalVisible}
        width={900}
        footer={[
          <Button key="close" onClick={closeDetailModal}>
            关闭
          </Button>
        ]}
        onCancel={closeDetailModal}
      >
        {/* 基本信息 */}
        <Descriptions column={2} bordered>
          <Descriptions.Item label="目标对象">{currentRecord.targetName}</Descriptions.Item>
          <Descriptions.Item label="变更类型">
            <Tag color={currentRecord.changeType === 'create' ? 'green' : 
                       currentRecord.changeType === 'update' ? 'blue' : 'red'}>
              {currentRecord.changeType === 'create' ? '新建' : 
               currentRecord.changeType === 'update' ? '修改' : '删除'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="变更字段">{currentRecord.changeField}</Descriptions.Item>
          <Descriptions.Item label="操作人">{currentRecord.operator}</Descriptions.Item>
          <Descriptions.Item label="变更时间">{currentRecord.changeTime}</Descriptions.Item>
          <Descriptions.Item label="审批状态">
            <Tag color={currentRecord.status === 'approved' ? 'green' : 
                       currentRecord.status === 'pending' ? 'orange' : 'red'}>
              {currentRecord.status === 'approved' ? '已审批' : 
               currentRecord.status === 'pending' ? '审批中' : '已驳回'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="变更描述" span={2}>
            {currentRecord.changeDescription}
          </Descriptions.Item>
          <Descriptions.Item label="变更原因" span={2}>
            {currentRecord.reason}
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
          操作流程
        </div>
        
        <Timeline
            items={[
              {
                color: 'blue',
                children: (
                  <div>
                    <div>提交变更</div>
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
      </Modal>
    );
  };

  return (
    <div>
      {/* 筛选区域 */}
      <div className="filter-area">
        <Form form={searchForm} onFinish={handleSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="搜索订单号、收货单号、操作人等" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="changeType" label="变更类型">
                <Select placeholder="请选择变更类型" allowClear>
                  <Option value="create">新建</Option>
                  <Option value="update">修改</Option>
                  <Option value="delete">删除</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="changeField" label="变更字段">
                <Select placeholder="请选择变更字段" allowClear>
                  <Option value="订单信息">订单信息</Option>
                  <Option value="配送日期">配送日期</Option>
                  <Option value="收货数量">收货数量</Option>
                  <Option value="状态">状态</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="approved">已通过</Option>
                  <Option value="pending">待审批</Option>
                  <Option value="rejected">已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => searchForm.resetFields()}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="timeRange" label="时间范围">
                <RangePicker 
                  style={{ width: '100%' }} 
                  showTime
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Space>
                <Button icon={<HistoryOutlined />}>
                  导出记录
                </Button>
                <Button type="link" icon={<HistoryOutlined />}>
                  清空记录
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 修改记录列表 */}
      <Table
        columns={columns}
        dataSource={recordData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          total: recordData.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
      />

      {/* 详情弹窗 */}
      {renderDetailModal()}
    </div>
  );
};

export default ModificationRecords;