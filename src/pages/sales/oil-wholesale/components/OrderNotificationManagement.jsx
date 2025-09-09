import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Row, Col, Tooltip, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import OrderModal from './OrderModal';
import OrderViewModal from './OrderViewModal';
import { oilWholesaleService } from '../services/oilWholesaleService.jsx';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrderNotificationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [orderData, setOrderData] = useState([]);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = async () => {
    setLoading(true);
    try {
      const response = await oilWholesaleService.getOrderList();
      setOrderData(response.data || []);
    } catch (error) {
      console.error('加载订货通知单数据失败:', error);
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
        id: 'ORDER001',
        orderNumber: 'DH202501250001',
        orderDate: '2025-01-25',
        orderingCompany: '江西交投化石能源公司赣中分公司',
        oilType: '92#汽油',
        quantityTons: 10.5,
        requiredDeliveryDate: '2025-01-27',
        deliveryAddress: '江西省南昌市赣中北服务区加油站A区卸油点',
        receiverName: '李站长',
        contactPhone: '13800138001',
        idCardNumber: '360103198512251234',
        attachments: [
          { name: '订货通知单.pdf', url: '/uploads/order-notice-001.pdf' },
          { name: '询价函.pdf', url: '/uploads/inquiry-letter-001.pdf' }
        ],
        orderStatus: 'pending_delivery',
        createTime: '2025-01-25 09:30:00',
        creator: '张经理',
        approver: '李总监',
        approvalTime: '2025-01-25 10:15:00'
      },
      {
        id: 'ORDER002',
        orderNumber: 'DH202501250002',
        orderDate: '2025-01-25',
        orderingCompany: '江西交投化石能源公司赣中分公司',
        oilType: '95#汽油',
        quantityTons: 15.2,
        requiredDeliveryDate: '2025-01-28',
        deliveryAddress: '江西省南昌市赣中南服务区加油站A区卸油点',
        receiverName: '张站长',
        contactPhone: '13800138002',
        idCardNumber: '360103198610152567',
        attachments: [
          { name: '订货通知单.pdf', url: '/uploads/order-notice-002.pdf' },
          { name: '询价函.pdf', url: '/uploads/inquiry-letter-002.pdf' }
        ],
        orderStatus: 'delivered',
        createTime: '2025-01-25 10:45:00',
        creator: '王经理',
        approver: '赵总监',
        approvalTime: '2025-01-25 11:30:00'
      },
      {
        id: 'ORDER003',
        orderNumber: 'DH202501240001',
        orderDate: '2025-01-24',
        orderingCompany: '江西交投化石能源公司赣东北分公司',
        oilType: '0#柴油',
        quantityTons: 25.8,
        requiredDeliveryDate: '2025-01-26',
        deliveryAddress: '江西省上饶市赣东北东服务区加油站A区卸油点',
        receiverName: '刘站长',
        contactPhone: '13800138003',
        idCardNumber: '361125198803201890',
        attachments: [
          { name: '订货通知单.pdf', url: '/uploads/order-notice-003.pdf' },
          { name: '询价函.pdf', url: '/uploads/inquiry-letter-003.pdf' }
        ],
        orderStatus: 'completed',
        createTime: '2025-01-24 14:20:00',
        creator: '陈经理',
        approver: '刘总监',
        approvalTime: '2025-01-24 15:05:00'
      }
    ];
    setOrderData(mockData);
  };

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实现搜索逻辑
  };

  const showOrderModal = (record = null) => {
    setEditingOrder(record);
    setOrderModalVisible(true);
  };

  const showViewModal = (record) => {
    setViewingOrder(record);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setViewingOrder(null);
  };

  const handleOrderSave = () => {
    setOrderModalVisible(false);
    setEditingOrder(null);
    loadOrderData();
  };

  const handleDelete = (record) => {
    // 实现删除逻辑
    console.log('删除订单:', record);
  };

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (text) => <strong style={{ color: '#1890ff' }}>{text}</strong>,
    },
    {
      title: '下单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 100,
      sorter: true,
    },
    {
      title: '订货单位',
      dataIndex: 'orderingCompany',
      key: 'orderingCompany',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '油品种类',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '订货数量(吨)',
      dataIndex: 'quantityTons',
      key: 'quantityTons',
      width: 120,
      render: (quantity) => <strong>{quantity}吨</strong>,
    },
    {
      title: '需到货日期',
      dataIndex: 'requiredDeliveryDate',
      key: 'requiredDeliveryDate',
      width: 120,
      sorter: true,
    },
    {
      title: '收货地址',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 220,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '收货人',
      dataIndex: 'receiverName',
      key: 'receiverName',
      width: 100,
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
    {
      title: '身份证号',
      dataIndex: 'idCardNumber',
      key: 'idCardNumber',
      width: 150,
      render: (idCard) => (
        <span style={{ fontFamily: 'monospace' }}>
          {idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')}
        </span>
      ),
    },
    {
      title: '附件',
      dataIndex: 'attachments',
      key: 'attachments',
      width: 120,
      render: (attachments) => (
        <div>
          {attachments && attachments.length > 0 ? (
            <Tag color="green">{attachments.length}个文件</Tag>
          ) : (
            <Tag color="default">无附件</Tag>
          )}
        </div>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 100,
      render: (status) => {
        const statusConfig = {
          pending_delivery: { color: 'orange', text: '待配送' },
          delivered: { color: 'blue', text: '已配送' },
          completed: { color: 'green', text: '已完成' },
          cancelled: { color: 'red', text: '已取消' }
        };
        const config = statusConfig[status] || statusConfig.pending_delivery;
        return <Badge color={config.color} text={config.text} />;
      },
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
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => showOrderModal(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
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
              <Form.Item name="orderNumber" label="订单编号">
                <Input placeholder="请输入订单编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="orderingCompany" label="订货单位">
                <Input placeholder="请输入订货单位" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="oilType" label="油品类型">
                <Select placeholder="请选择油品类型" allowClear>
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                  <Option value="尿素">尿素</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="orderStatus" label="订单状态">
                <Select placeholder="请选择订单状态" allowClear>
                  <Option value="pending_delivery">待配送</Option>
                  <Option value="delivered">已配送</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
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
              <Form.Item name="orderDateRange" label="下单日期">
                <RangePicker 
                  style={{ width: '100%' }} 
                  placeholder={['开始日期', '结束日期']}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="deliveryDateRange" label="需到货日期">
                <RangePicker 
                  style={{ width: '100%' }} 
                  placeholder={['开始日期', '结束日期']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showOrderModal()}>
                  新建订单
                </Button>
                <Button icon={<UploadOutlined />}>
                  批量导入
                </Button>
                <Button type="link" icon={<UploadOutlined />}>
                  导出数据
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 订货通知单列表 */}
      <Table
        columns={columns}
        dataSource={orderData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1800 }}
        pagination={{
          total: orderData.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
      />

      {/* 订货通知单弹窗 */}
      <OrderModal
        visible={orderModalVisible}
        editingOrder={editingOrder}
        onCancel={() => setOrderModalVisible(false)}
        onSuccess={handleOrderSave}
      />
      
      <OrderViewModal
        visible={viewModalVisible}
        orderData={viewingOrder}
        onClose={closeViewModal}
      />
    </div>
  );
};

export default OrderNotificationManagement;