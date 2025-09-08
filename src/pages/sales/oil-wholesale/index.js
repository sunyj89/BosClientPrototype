import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip, Progress, Statistic, Switch, InputNumber, Upload, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, BarChartOutlined, CrownOutlined, SettingOutlined, TrophyOutlined, UploadOutlined, SaveOutlined, PlayCircleOutlined, PauseCircleOutlined, FileTextOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OilWholesaleManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('order-notification');
  const [orderSearchForm] = Form.useForm();
  const [receiptSearchForm] = Form.useForm();
  const [recordSearchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [receiptForm] = Form.useForm();
  const [editingReceipt, setEditingReceipt] = useState(null);
  
  // 订货通知单弹窗状态
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderForm] = Form.useForm();
  const [editingOrder, setEditingOrder] = useState(null);

  // 订货通知单数据
  const [orderNotificationData, setOrderNotificationData] = useState([]);
  // 收货确认单数据
  const [receiptConfirmationData, setReceiptConfirmationData] = useState([]);
  // 修改记录数据
  const [modificationRecordData, setModificationRecordData] = useState([]);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 订货通知单模拟数据
    const mockOrderNotificationData = [
      {
        id: 'ORDER001',
        orderNumber: 'DH202501250001',
        orderDate: '2025-01-25', // 下单日期
        orderingCompany: '江西交投化石能源公司赣中分公司', // 订货单位
        oilType: '92#汽油', // 油品种类
        quantityTons: 10.5, // 订货数量（吨）
        requiredDeliveryDate: '2025-01-27', // 需到货日期
        deliveryAddress: '江西省南昌市赣中北服务区加油站A区卸油点', // 收货地址
        receiverName: '李站长', // 收货人
        contactPhone: '13800138001', // 联系方式
        idCardNumber: '360103198512251234', // 联系人身份证号
        attachments: [ // 上传附件
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

    // 收货确认单模拟数据
    const mockReceiptConfirmationData = [
      {
        id: 'RECEIPT001',
        receiptNumber: 'SH202501270001',
        relatedOrderId: 'ORDER002', // 关联订货通知单ID
        relatedOrderNumber: 'DH202501250002', // 关联订货通知单编号
        supplierId: 'SUP002', // 关联供应商ID
        supplierName: '中石油江西销售公司', // 关联供应商名称
        quotationId: 'QUO202501250001', // 关联报价单ID
        quotationNumber: 'BJD202501250001', // 关联报价单编号
        arrivalTime: '2025-01-27 14:30:00', // 到货时间
        actualWeightKg: 12650, // 到货重量（净重kg）
        weighingSlips: [ // 上传过磅单（图片）
          { name: '过磅单1.jpg', url: '/uploads/weighing-slip-001-1.jpg' },
          { name: '过磅单2.jpg', url: '/uploads/weighing-slip-001-2.jpg' }
        ],
        oilType: '95#汽油',
        orderedQuantityTons: 15.2, // 订购数量（吨）
        actualQuantityTons: 12.65, // 实际到货数量（吨，基于净重计算）
        varianceTons: -2.55, // 差异数量（吨）
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

    // 修改记录模拟数据
    const mockModificationRecordData = [
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

    setOrderNotificationData(mockOrderNotificationData);
    setReceiptConfirmationData(mockReceiptConfirmationData);
    setModificationRecordData(mockModificationRecordData);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleOrderSearch = (values) => {
    console.log('订货通知单搜索条件:', values);
    // 实现搜索逻辑
  };

  const handleReceiptSearch = (values) => {
    console.log('收货确认单搜索条件:', values);
    // 实现搜索逻辑
  };

  const handleRecordSearch = (values) => {
    console.log('修改记录搜索条件:', values);
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

  const showReceiptModal = (record = null) => {
    setEditingReceipt(record);
    if (record) {
      // 编辑模式，填充表单数据
      receiptForm.setFieldsValue({
        receiptNumber: record.receiptNumber,
        relatedOrderId: record.relatedOrderId,
        supplierId: record.supplierId,
        quotationId: record.quotationId,
        arrivalTime: record.arrivalTime ? moment(record.arrivalTime) : undefined,
        actualWeightKg: record.actualWeightKg,
        varianceReason: record.varianceReason,
        remarks: record.remarks
      });
    } else {
      // 新建模式，重置表单
      receiptForm.resetFields();
    }
    setReceiptModalVisible(true);
  };

  const handleReceiptSubmit = async (values) => {
    try {
      // 计算实际数量（这里简化处理，实际应该根据油品密度计算）
      const actualQuantityTons = (values.actualWeightKg / 1000).toFixed(2);
      
      // 如果是编辑模式，需要获取订购数量来计算差异
      let orderedQuantityTons = 0;
      if (values.relatedOrderId) {
        const relatedOrder = orderNotificationData.find(order => order.id === values.relatedOrderId);
        if (relatedOrder) {
          orderedQuantityTons = relatedOrder.quantityTons;
        }
      }
      
      const varianceTons = (parseFloat(actualQuantityTons) - orderedQuantityTons).toFixed(2);
      
      const receiptData = {
        ...values,
        actualQuantityTons: parseFloat(actualQuantityTons),
        varianceTons: parseFloat(varianceTons),
        arrivalTime: values.arrivalTime?.format('YYYY-MM-DD HH:mm:ss'),
        id: editingReceipt ? editingReceipt.id : `RECEIPT${String(receiptConfirmationData.length + 1).padStart(3, '0')}`,
        receiptNumber: editingReceipt ? editingReceipt.receiptNumber : `SH${moment().format('YYYYMMDD')}${String(receiptConfirmationData.length + 1).padStart(4, '0')}`,
        receiptStatus: 'pending',
        receiver: '当前用户', // 实际应该从登录用户获取
        receiverId: 'CURRENT_USER',
        createTime: editingReceipt ? editingReceipt.createTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        confirmTime: null
      };
      
      console.log('保存收货确认单:', receiptData);
      message.success(editingReceipt ? '收货确认单修改成功' : '收货确认单创建成功');
      
      setReceiptModalVisible(false);
      setEditingReceipt(null);
      loadMockData();
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  // 显示订货通知单弹窗
  const showOrderModal = (record = null) => {
    setEditingOrder(record);
    if (record) {
      // 编辑模式，填充表单数据
      orderForm.setFieldsValue({
        orderNumber: record.orderNumber,
        orderDate: record.orderDate ? moment(record.orderDate) : undefined,
        orderingCompany: record.orderingCompany,
        oilType: record.oilType,
        quantityTons: record.quantityTons,
        requiredDeliveryDate: record.requiredDeliveryDate ? moment(record.requiredDeliveryDate) : undefined,
        deliveryAddress: record.deliveryAddress,
        receiverName: record.receiverName,
        contactPhone: record.contactPhone,
        idCardNumber: record.idCardNumber
      });
    } else {
      // 新建模式，重置表单
      orderForm.resetFields();
      // 自动设置订单编号
      const orderNumber = `DH${moment().format('YYYYMMDD')}${String(orderNotificationData.length + 1).padStart(4, '0')}`;
      orderForm.setFieldsValue({ orderNumber });
    }
    setOrderModalVisible(true);
  };

  // 订货通知单提交处理
  const handleOrderSubmit = async (values) => {
    try {
      const orderData = {
        ...values,
        orderDate: values.orderDate?.format('YYYY-MM-DD'),
        requiredDeliveryDate: values.requiredDeliveryDate?.format('YYYY-MM-DD'),
        id: editingOrder ? editingOrder.id : `ORDER${String(orderNotificationData.length + 1).padStart(3, '0')}`,
        orderNumber: values.orderNumber,
        orderStatus: 'pending_delivery',
        createTime: editingOrder ? editingOrder.createTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        creator: '当前用户', // 实际应该从登录用户获取
        approver: '待审批',
        approvalTime: null,
        attachments: values.attachments || []
      };
      
      console.log('保存订货通知单:', orderData);
      message.success(editingOrder ? '订货通知单修改成功' : '订货通知单创建成功');
      
      setOrderModalVisible(false);
      setEditingOrder(null);
      loadMockData();
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  // 订货通知单列定义
  const orderNotificationColumns = [
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
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => showDetailModal(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => showOrderModal(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 收货确认单列定义
  const receiptConfirmationColumns = [
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
      render: (weight) => <strong style={{ color: '#1890ff' }}>{weight.toLocaleString()}kg</strong>,
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
        const color = variance > 0 ? '#52c41a' : variance < 0 ? '#f5222d' : '#666';
        return <strong style={{ color }}>{variance > 0 ? '+' : ''}{variance}吨</strong>;
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
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => showDetailModal(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => showReceiptModal(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
            确认
          </Button>
        </Space>
      ),
    },
  ];

  // 修改记录列定义
  const modificationRecordColumns = [
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

  // 渲染订货通知单tab
  const renderOrderNotification = () => (
    <div>
      {/* 筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={orderSearchForm} onFinish={handleOrderSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="orderNumber" label="订单编号">
                <Input placeholder="请输入订单编号" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="orderingCompany" label="订货单位">
                <Input placeholder="请输入订货单位" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="oilType" label="油品类型">
                <Select placeholder="请选择油品类型" style={{ width: '100%' }} allowClear>
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
                <Select placeholder="请选择订单状态" style={{ width: '100%' }} allowClear>
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
                <Button icon={<ReloadOutlined />} onClick={() => orderSearchForm.resetFields()}>
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
            <Col span={18}>
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
        columns={orderNotificationColumns}
        dataSource={orderNotificationData}
        rowKey="id"
        scroll={{ x: 1800 }}
        pagination={{
          total: orderNotificationData.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
      />
    </div>
  );

  // 渲染收货确认单tab
  const renderReceiptConfirmation = () => (
    <div>
      {/* 筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={receiptSearchForm} onFinish={handleReceiptSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="receiptNumber" label="收货单号">
                <Input placeholder="请输入收货单号" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="orderNumber" label="关联订单号">
                <Input placeholder="请输入订单编号" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="supplierName" label="供应商">
                <Input placeholder="请输入供应商名称" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="receiptStatus" label="收货状态">
                <Select placeholder="请选择收货状态" style={{ width: '100%' }} allowClear>
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
                <Button icon={<ReloadOutlined />} onClick={() => receiptSearchForm.resetFields()}>
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
            <Col span={18}>
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
        columns={receiptConfirmationColumns}
        dataSource={receiptConfirmationData}
        rowKey="id"
        scroll={{ x: 2000 }}
        pagination={{
          total: receiptConfirmationData.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
      />
    </div>
  );

  // 渲染修改记录tab
  const renderModificationRecords = () => (
    <div>
      {/* 筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={recordSearchForm} onFinish={handleRecordSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="搜索订单号、收货单号、操作人等" style={{ width: '100%' }} allowClear />
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
                  <Option value="订单信息">订单信息</Option>
                  <Option value="配送日期">配送日期</Option>
                  <Option value="收货数量">收货数量</Option>
                  <Option value="状态">状态</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
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
                <Button icon={<ReloadOutlined />} onClick={() => recordSearchForm.resetFields()}>
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
            <Col span={18}>
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
        columns={modificationRecordColumns}
        dataSource={modificationRecordData}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          total: modificationRecordData.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
      />
    </div>
  );

  // 渲染详情弹窗
  const renderDetailModal = () => {
    if (!currentRecord) return null;

    return (
      <Modal
        title={<><HistoryOutlined /> 详细信息</>}
        open={detailModalVisible}
        width={800}
        footer={[
          <Button key="close" onClick={closeDetailModal}>
            关闭
          </Button>
        ]}
        onCancel={closeDetailModal}
      >
        {/* 基本信息 */}
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Descriptions column={2}>
            {currentRecord.orderNumber && (
              <>
                <Descriptions.Item label="订单编号">{currentRecord.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="下单日期">{currentRecord.orderDate}</Descriptions.Item>
                <Descriptions.Item label="订货单位">{currentRecord.orderingCompany}</Descriptions.Item>
                <Descriptions.Item label="油品种类">{currentRecord.oilType}</Descriptions.Item>
                <Descriptions.Item label="订货数量">{currentRecord.quantityTons}吨</Descriptions.Item>
                <Descriptions.Item label="需到货日期">{currentRecord.requiredDeliveryDate}</Descriptions.Item>
                <Descriptions.Item label="收货地址">{currentRecord.deliveryAddress}</Descriptions.Item>
                <Descriptions.Item label="收货人">{currentRecord.receiverName}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{currentRecord.contactPhone}</Descriptions.Item>
                <Descriptions.Item label="身份证号">{currentRecord.idCardNumber?.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')}</Descriptions.Item>
                <Descriptions.Item label="附件数量">
                  {currentRecord.attachments?.length || 0}个文件
                  {currentRecord.attachments && currentRecord.attachments.length > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      {currentRecord.attachments.map((file, index) => (
                        <Tag key={index} color="blue" style={{ marginBottom: '2px' }}>
                          {file.name}
                        </Tag>
                      ))}
                    </div>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="订单状态">
                  <Badge 
                    color={currentRecord.orderStatus === 'completed' ? 'green' : currentRecord.orderStatus === 'delivered' ? 'blue' : 'orange'} 
                    text={currentRecord.orderStatus === 'completed' ? '已完成' : currentRecord.orderStatus === 'delivered' ? '已配送' : '待配送'} 
                  />
                </Descriptions.Item>
              </>
            )}
            {currentRecord.receiptNumber && (
              <>
                <Descriptions.Item label="收货单号">{currentRecord.receiptNumber}</Descriptions.Item>
                <Descriptions.Item label="关联订单">{currentRecord.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="实收数量">{currentRecord.actualQuantity?.toLocaleString()}L</Descriptions.Item>
                <Descriptions.Item label="差异数量">{currentRecord.variance}L</Descriptions.Item>
                <Descriptions.Item label="差异原因">{currentRecord.varianceReason}</Descriptions.Item>
                <Descriptions.Item label="收货员">{currentRecord.receiver}</Descriptions.Item>
              </>
            )}
            {currentRecord.targetName && (
              <>
                <Descriptions.Item label="目标对象">{currentRecord.targetName}</Descriptions.Item>
                <Descriptions.Item label="变更类型">{currentRecord.changeType === 'create' ? '新建' : currentRecord.changeType === 'update' ? '修改' : '删除'}</Descriptions.Item>
                <Descriptions.Item label="变更字段">{currentRecord.changeField}</Descriptions.Item>
                <Descriptions.Item label="操作人">{currentRecord.operator}</Descriptions.Item>
                <Descriptions.Item label="变更时间">{currentRecord.changeTime}</Descriptions.Item>
                <Descriptions.Item label="审批状态">
                  <Badge 
                    status={currentRecord.status === 'approved' ? 'success' : currentRecord.status === 'pending' ? 'warning' : 'error'} 
                    text={currentRecord.status === 'approved' ? '已通过' : currentRecord.status === 'pending' ? '待审批' : '已拒绝'} 
                  />
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Card>

        {/* 变更详情和操作流程 */}
        {currentRecord.targetName && (
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
              </Card>
            </Col>
          </Row>
        )}
      </Modal>
    );
  };

  // 渲染订货通知单创建/编辑弹窗
  const renderOrderModal = () => (
    <Modal
      title={
        editingOrder ? (
          <><EditOutlined /> 编辑订货通知单 - {editingOrder.orderNumber}</>
        ) : (
          <><PlusOutlined /> 新建订货通知单</>
        )
      }
      open={orderModalVisible}
      width={1000}
      footer={[
        <Button key="cancel" onClick={() => setOrderModalVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => orderForm.submit()}>
          {editingOrder ? '保存修改' : '创建订单'}
        </Button>
      ]}
      onCancel={() => setOrderModalVisible(false)}
    >
      <Form
        form={orderForm}
        layout="vertical"
        onFinish={handleOrderSubmit}
      >
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="orderNumber"
                label="订单编号"
                rules={[{ required: true, message: '请输入订单编号' }]}
              >
                <Input placeholder="系统自动生成" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderDate"
                label="下单日期"
                rules={[{ required: true, message: '请选择下单日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="请选择下单日期"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderingCompany"
                label="订货单位"
                rules={[{ required: true, message: '请选择订货单位' }]}
              >
                <Select placeholder="请选择订货单位" style={{ width: '100%' }}>
                  <Option value="江西交投化石能源公司赣中分公司">江西交投化石能源公司赣中分公司</Option>
                  <Option value="江西交投化石能源公司赣东北分公司">江西交投化石能源公司赣东北分公司</Option>
                  <Option value="江西交投化石能源公司赣南分公司">江西交投化石能源公司赣南分公司</Option>
                  <Option value="江西交投化石能源公司赣西分公司">江西交投化石能源公司赣西分公司</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="oilType"
                label="油品种类"
                rules={[{ required: true, message: '请选择油品种类' }]}
              >
                <Select placeholder="请选择油品种类" style={{ width: '100%' }}>
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                  <Option value="-10#柴油">-10#柴油</Option>
                  <Option value="-20#柴油">-20#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quantityTons"
                label="订货数量（吨）"
                rules={[
                  { required: true, message: '请输入订货数量' },
                  { type: 'number', min: 0.1, message: '订货数量必须大于0.1吨' }
                ]}
              >
                <InputNumber
                  min={0.1}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="请输入订货数量"
                  addonAfter="吨"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="requiredDeliveryDate"
                label="需到货日期"
                rules={[{ required: true, message: '请选择需到货日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="请选择需到货日期"
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="收货信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="deliveryAddress"
                label="收货地址"
                rules={[{ required: true, message: '请输入收货地址' }]}
              >
                <Input.TextArea 
                  rows={2} 
                  placeholder="请输入详细的收货地址"
                  maxLength={200}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="receiverName"
                label="收货人"
                rules={[{ required: true, message: '请输入收货人姓名' }]}
              >
                <Input placeholder="请输入收货人姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contactPhone"
                label="联系方式"
                rules={[
                  { required: true, message: '请输入联系方式' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="idCardNumber"
                label="联系人身份证号"
                rules={[
                  { required: true, message: '请输入身份证号码' },
                  { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码' }
                ]}
              >
                <Input placeholder="请输入18位身份证号码" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="附件信息">
          <Form.Item
            name="attachments"
            label="上传附件（订货通知单和询价函）"
          >
            <Upload
              listType="text"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              beforeUpload={() => false} // 阻止自动上传
              onChange={(info) => {
                const fileList = info.fileList.map(file => ({
                  name: file.name,
                  url: file.url || `/uploads/${file.name}`
                }));
                orderForm.setFieldsValue({ attachments: fileList });
              }}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
              支持上传PDF、Word、Excel格式文件，单个文件不超过10MB
            </div>
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );

  // 渲染收货确认单创建/编辑弹窗
  const renderReceiptModal = () => (
    <Modal
      title={
        editingReceipt ? (
          <><EditOutlined /> 编辑收货确认单 - {editingReceipt.receiptNumber}</>
        ) : (
          <><PlusOutlined /> 新建收货确认单</>
        )
      }
      open={receiptModalVisible}
      width={1000}
      footer={[
        <Button key="cancel" onClick={() => setReceiptModalVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => receiptForm.submit()}>
          {editingReceipt ? '保存修改' : '创建确认单'}
        </Button>
      ]}
      onCancel={() => setReceiptModalVisible(false)}
    >
      <Form
        form={receiptForm}
        layout="vertical"
        onFinish={handleReceiptSubmit}
      >
        <Card title="关联信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="relatedOrderId"
                label="关联订货通知单"
                rules={[{ required: true, message: '请选择关联的订货通知单' }]}
              >
                <Select placeholder="请选择订货通知单" style={{ width: '100%' }}>
                  {orderNotificationData.map(order => (
                    <Option key={order.id} value={order.id}>
                      {order.orderNumber} - {order.oilType} ({order.quantityTons}吨)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="supplierId"
                label="关联供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="请选择供应商" style={{ width: '100%' }}>
                  <Option value="SUP001">中石化江西分公司</Option>
                  <Option value="SUP002">中石油江西销售公司</Option>
                  <Option value="SUP003">中海油江西分公司</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quotationId"
                label="关联报价单"
                rules={[{ required: true, message: '请选择关联的报价单' }]}
              >
                <Select placeholder="请选择报价单" style={{ width: '100%' }}>
                  <Option value="QUO202501250001">BJD202501250001</Option>
                  <Option value="QUO202501250002">BJD202501250002</Option>
                  <Option value="QUO202501240001">BJD202501240001</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="收货信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="arrivalTime"
                label="到货时间"
                rules={[{ required: true, message: '请选择到货时间' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  placeholder="请选择到货时间"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="actualWeightKg"
                label="到货重量（净重kg）"
                rules={[
                  { required: true, message: '请输入到货重量' },
                  { type: 'number', min: 0, message: '重量必须大于0' }
                ]}
              >
                <InputNumber
                  min={0}
                  precision={1}
                  style={{ width: '100%' }}
                  placeholder="请输入净重（kg）"
                  addonAfter="kg"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weighingSlips"
                label="上传过磅单（图片）"
                rules={[{ required: true, message: '请上传过磅单' }]}
              >
                <Upload
                  listType="picture-card"
                  multiple
                  accept="image/*"
                  beforeUpload={() => false} // 阻止自动上传
                  onChange={(info) => {
                    const fileList = info.fileList.map(file => ({
                      name: file.name,
                      url: file.url || URL.createObjectURL(file.originFileObj)
                    }));
                    receiptForm.setFieldsValue({ weighingSlips: fileList });
                  }}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传过磅单</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="varianceReason"
                label="差异原因"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="如有差异，请填写差异原因"
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="备注信息">
          <Form.Item
            name="remarks"
            label="备注说明"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入收货备注信息"
              maxLength={1000}
            />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );

  const tabItems = [
    {
      key: 'order-notification',
      label: (
        <span>
          <FileTextOutlined />
          订货通知单
        </span>
      ),
      children: renderOrderNotification(),
    },
    {
      key: 'receipt-confirmation',
      label: (
        <span>
          <CheckCircleOutlined />
          收货确认单
        </span>
      ),
      children: renderReceiptConfirmation(),
    },
    {
      key: 'modification-records',
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
    <div className="module-container">
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
      {renderOrderModal()}
      {renderReceiptModal()}
    </div>
  );
};

export default OilWholesaleManagement;