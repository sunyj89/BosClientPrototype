import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Row, Col, Tooltip, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import ReceiptModal from './ReceiptModal';
import ReceiptViewModal from './ReceiptViewModal';
import { oilWholesaleService } from '../services/oilWholesaleService.jsx';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReceiptConfirmationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [receiptData, setReceiptData] = useState([]);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  useEffect(() => {
    loadReceiptData();
  }, []);

  const loadReceiptData = async () => {
    setLoading(true);
    try {
      const response = await oilWholesaleService.getReceiptList();
      setReceiptData(response.data || []);
    } catch (error) {
      console.error('加载收货确认单数据失败:', error);
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
        id: 'RECEIPT001',
        receiptNumber: 'SH202501270001',
        relatedOrderId: 'ORDER002',
        relatedOrderNumber: 'DH202501250002',
        supplierId: 'SUP002',
        supplierName: '中石油江西销售公司',
        quotationId: 'QUO202501250001',
        quotationNumber: 'BJD202501250001',
        arrivalTime: '2025-01-27 14:30:00',
        actualWeightKg: 12650,
        weighingSlips: [
          { name: '过磅单1.jpg', url: '/uploads/weighing-slip-001-1.jpg' },
          { name: '过磅单2.jpg', url: '/uploads/weighing-slip-001-2.jpg' }
        ],
        oilType: '95#汽油',
        orderedQuantityTons: 15.2,
        actualQuantityTons: 12.65,
        varianceTons: -2.55,
        varianceReason: '运输损耗和密度差异',
        receiptStatus: 'confirmed',
        receiver: '李收货员',
        receiverId: 'REC001',
        createTime: '2025-01-27 15:00:00',
        confirmTime: '2025-01-27 16:30:00',
        remarks: '油品质量合格，温度正常，密度符合标准'
      },
      {
        id: 'RECEIPT002',
        receiptNumber: 'SH202501260001',
        relatedOrderId: 'ORDER003',
        relatedOrderNumber: 'DH202501240001',
        supplierId: 'SUP003',
        supplierName: '中海油江西分公司',
        quotationId: 'QUO202501240001',
        quotationNumber: 'BJD202501240001',
        arrivalTime: '2025-01-26 16:45:00',
        actualWeightKg: 25800,
        weighingSlips: [
          { name: '过磅单1.jpg', url: '/uploads/weighing-slip-002-1.jpg' }
        ],
        oilType: '0#柴油',
        orderedQuantityTons: 25.8,
        actualQuantityTons: 25.8,
        varianceTons: 0,
        varianceReason: '无差异',
        receiptStatus: 'confirmed',
        receiver: '刘收货员',
        receiverId: 'REC002',
        createTime: '2025-01-26 17:00:00',
        confirmTime: '2025-01-26 17:30:00',
        remarks: '收货正常，无异常'
      },
      {
        id: 'RECEIPT003',
        receiptNumber: 'SH202501280001',
        relatedOrderId: 'ORDER001',
        relatedOrderNumber: 'DH202501250001',
        supplierId: 'SUP001',
        supplierName: '中石化江西分公司',
        quotationId: 'QUO202501250002',
        quotationNumber: 'BJD202501250002',
        arrivalTime: '2025-01-28 09:15:00',
        actualWeightKg: 10680,
        weighingSlips: [
          { name: '过磅单1.jpg', url: '/uploads/weighing-slip-003-1.jpg' },
          { name: '过磅单2.jpg', url: '/uploads/weighing-slip-003-2.jpg' }
        ],
        oilType: '92#汽油',
        orderedQuantityTons: 10.5,
        actualQuantityTons: 10.68,
        varianceTons: 0.18,
        varianceReason: '温度补偿',
        receiptStatus: 'pending',
        receiver: '陈收货员',
        receiverId: 'REC003',
        createTime: '2025-01-28 09:30:00',
        confirmTime: null,
        remarks: '待质检员确认'
      }
    ];
    setReceiptData(mockData);
  };

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实现搜索逻辑
  };

  const showReceiptModal = (record = null) => {
    setEditingReceipt(record);
    setReceiptModalVisible(true);
  };

  const showViewModal = (record) => {
    setViewingReceipt(record);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setViewingReceipt(null);
  };

  const handleReceiptSave = () => {
    setReceiptModalVisible(false);
    setEditingReceipt(null);
    loadReceiptData();
  };

  const handleConfirm = (record) => {
    // 实现确认逻辑
    console.log('确认收货:', record);
  };

  const columns = [
    {
      title: '收货单号',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 150,
      render: (text) => <strong style={{ color: '#52c41a' }}>{text}</strong>,
    },
    {
      title: '关联订单号',
      dataIndex: 'relatedOrderNumber',
      key: 'relatedOrderNumber',
      width: 150,
      render: (text) => <strong style={{ color: '#1890ff' }}>{text}</strong>,
    },
    {
      title: '关联供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 180,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '报价单号',
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
      width: 150,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '到货时间',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
      width: 150,
      sorter: true,
      render: (time) => moment(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '订购数量(吨)',
      dataIndex: 'orderedQuantityTons',
      key: 'orderedQuantityTons',
      width: 120,
      render: (quantity) => `${quantity}吨`,
    },
    {
      title: '到货重量(kg)',
      dataIndex: 'actualWeightKg',
      key: 'actualWeightKg',
      width: 120,
      render: (weight) => <strong style={{ color: '#1890ff' }}>{weight ? weight.toLocaleString() : 0}kg</strong>,
    },
    {
      title: '实际数量(吨)',
      dataIndex: 'actualQuantityTons',
      key: 'actualQuantityTons',
      width: 120,
      render: (quantity) => <strong>{quantity}吨</strong>,
    },
    {
      title: '差异数量(吨)',
      dataIndex: 'varianceTons',
      key: 'varianceTons',
      width: 120,
      render: (variance) => {
        const color = variance > 0 ? 'var(--primary-color)' : variance < 0 ? 'var(--error-color)' : '#666';
        return (
          <strong className={variance > 0 ? 'variance-positive' : variance < 0 ? 'variance-negative' : 'variance-zero'}>
            {variance > 0 ? '+' : ''}{variance}吨
          </strong>
        );
      },
    },
    {
      title: '过磅单',
      dataIndex: 'weighingSlips',
      key: 'weighingSlips',
      width: 100,
      render: (slips) => (
        <div>
          {slips && slips.length > 0 ? (
            <Tag color="green">{slips.length}张</Tag>
          ) : (
            <Tag color="default">无</Tag>
          )}
        </div>
      ),
    },
    {
      title: '收货状态',
      dataIndex: 'receiptStatus',
      key: 'receiptStatus',
      width: 100,
      render: (status) => {
        const statusConfig = {
          confirmed: { color: 'success', text: '已确认' },
          pending: { color: 'warning', text: '待确认' },
          rejected: { color: 'error', text: '已拒绝' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge status={config.color} text={config.text} />;
      },
    },
    {
      title: '收货员',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => showViewModal(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => showReceiptModal(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleConfirm(record)}>
            确认
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <div className="filter-area">
        <Form form={searchForm} onFinish={handleSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="receiptNumber" label="收货单号">
                <Input placeholder="请输入收货单号" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="orderNumber" label="关联订单号">
                <Input placeholder="请输入订单编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="supplierName" label="供应商">
                <Input placeholder="请输入供应商名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="receiptStatus" label="收货状态">
                <Select placeholder="请选择收货状态" allowClear>
                  <Option value="confirmed">已确认</Option>
                  <Option value="pending">待确认</Option>
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
              <Form.Item name="dateRange" label="收货时间">
                <RangePicker 
                  style={{ width: '100%' }} 
                  showTime
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showReceiptModal()}>
                  新建收货单
                </Button>
                <Button icon={<CheckCircleOutlined />}>
                  批量确认
                </Button>
                <Button type="link" icon={<UploadOutlined />}>
                  导出数据
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 收货确认单列表 */}
      <Table
        columns={columns}
        dataSource={receiptData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 2000 }}
        pagination={{
          total: receiptData.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
      />

      {/* 收货确认单弹窗 */}
      <ReceiptModal
        visible={receiptModalVisible}
        editingReceipt={editingReceipt}
        onCancel={() => setReceiptModalVisible(false)}
        onSuccess={handleReceiptSave}
      />
      
      <ReceiptViewModal
        visible={viewModalVisible}
        receiptData={viewingReceipt}
        onClose={closeViewModal}
      />
    </div>
  );
};

export default ReceiptConfirmationManagement;