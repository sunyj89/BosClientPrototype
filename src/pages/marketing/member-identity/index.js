import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip, Switch, Upload } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, BarChartOutlined, CarOutlined, SettingOutlined, AuditOutlined, UserOutlined, UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const MemberIdentity = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const [ruleSearchForm] = Form.useForm();
  const [auditSearchForm] = Form.useForm();
  const [userSearchForm] = Form.useForm();
  const [recordSearchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 渠道会员规则配置数据
  const [rulesData, setRulesData] = useState([]);
  // 渠道会员审核记录数据
  const [auditData, setAuditData] = useState([]);
  // 渠道会员用户管理数据
  const [userData, setUserData] = useState([]);
  // 修改记录数据
  const [recordData, setRecordData] = useState([]);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 渠道会员规则配置模拟数据
    const mockRulesData = [
      {
        id: 'RULE001',
        ruleName: '渠道会员司机认证规则',
        ruleType: '身份认证',
        applicableRegion: '全国',
        requiredDocuments: '身份证,驾驶证,行驶证,营运证',
        validityPeriod: '365天',
        autoReview: true,
        status: 'active',
        createTime: '2025-01-15 10:30:00',
        updateTime: '2025-01-20 14:20:00'
      },
      {
        id: 'RULE002',
        ruleName: '渠道会员车辆认证规则',
        ruleType: '车辆认证',
        applicableRegion: '江西省',
        requiredDocuments: '行驶证,保险单,年检证明',
        validityPeriod: '180天',
        autoReview: false,
        status: 'active',
        createTime: '2025-01-10 09:15:00',
        updateTime: '2025-01-18 16:45:00'
      },
      {
        id: 'RULE003',
        ruleName: '渠道会员平台准入规则',
        ruleType: '平台准入',
        applicableRegion: '南昌市',
        requiredDocuments: '网约车许可证,平台协议',
        validityPeriod: '720天',
        autoReview: true,
        status: 'active',
        createTime: '2025-01-05 11:20:00',
        updateTime: '2025-01-15 13:30:00'
      },
      {
        id: 'RULE004',
        ruleName: '渠道会员服务质量规则',
        ruleType: '服务认证',
        applicableRegion: '赣州市',
        requiredDocuments: '服务承诺书,培训证书',
        validityPeriod: '90天',
        autoReview: false,
        status: 'inactive',
        createTime: '2024-12-20 15:10:00',
        updateTime: '2024-12-25 10:45:00'
      }
    ];

    // 渠道会员审核记录模拟数据
    const mockAuditData = [
      {
        id: 'AUDIT001',
        applicantName: '张师傅',
        applicantPhone: '138****5678',
        applicationType: '司机认证',
        submitTime: '2025-01-20 09:30:00',
        auditTime: '2025-01-20 14:20:00',
        auditor: '李审核员',
        auditResult: 'approved',
        rejectReason: '',
        documents: ['身份证.jpg', '驾驶证.jpg', '行驶证.jpg'],
        status: 'completed'
      },
      {
        id: 'AUDIT002',
        applicantName: '王司机',
        applicantPhone: '139****9876',
        applicationType: '车辆认证',
        submitTime: '2025-01-19 15:45:00',
        auditTime: '2025-01-20 10:15:00',
        auditor: '赵审核员',
        auditResult: 'rejected',
        rejectReason: '行驶证照片不清晰，请重新上传',
        documents: ['行驶证.jpg', '保险单.pdf'],
        status: 'completed'
      },
      {
        id: 'AUDIT003',
        applicantName: '刘师傅',
        applicantPhone: '137****3456',
        applicationType: '平台准入',
        submitTime: '2025-01-20 11:20:00',
        auditTime: '',
        auditor: '',
        auditResult: '',
        rejectReason: '',
        documents: ['网约车许可证.jpg'],
        status: 'pending'
      },
      {
        id: 'AUDIT004',
        applicantName: '陈司机',
        applicantPhone: '136****7890',
        applicationType: '服务认证',
        submitTime: '2025-01-20 08:15:00',
        auditTime: '',
        auditor: '李审核员',
        auditResult: '',
        rejectReason: '',
        documents: ['服务承诺书.pdf', '培训证书.jpg'],
        status: 'reviewing'
      }
    ];

    // 渠道会员用户管理模拟数据
    const mockUserData = [
      {
        id: 'USER001',
        userName: '张师傅',
        userPhone: '138****5678',
        userType: '渠道会员司机',
        certificationStatus: 'certified',
        certificationTime: '2025-01-20 14:20:00',
        expiryTime: '2026-01-20 14:20:00',
        vehicleInfo: '赣A12345 比亚迪秦PLUS',
        serviceRegion: '南昌市',
        orderCount: 156,
        rating: 4.8,
        status: 'active'
      },
      {
        id: 'USER002',
        userName: '王司机',
        userPhone: '139****9876',
        userType: '渠道会员司机',
        certificationStatus: 'rejected',
        certificationTime: '',
        expiryTime: '',
        vehicleInfo: '赣B67890 荣威i6',
        serviceRegion: '赣州市',
        orderCount: 0,
        rating: 0,
        status: 'inactive'
      },
      {
        id: 'USER003',
        userName: '刘师傅',
        userPhone: '137****3456',
        userType: '渠道会员司机',
        certificationStatus: 'pending',
        certificationTime: '',
        expiryTime: '',
        vehicleInfo: '赣C54321 吉利帝豪',
        serviceRegion: '九江市',
        orderCount: 0,
        rating: 0,
        status: 'pending'
      },
      {
        id: 'USER004',
        userName: '陈司机',
        userPhone: '136****7890',
        userType: '渠道会员司机',
        certificationStatus: 'expired',
        certificationTime: '2024-06-15 10:30:00',
        expiryTime: '2024-12-15 10:30:00',
        vehicleInfo: '赣D98765 大众朗逸',
        serviceRegion: '上饶市',
        orderCount: 89,
        rating: 4.5,
        status: 'expired'
      }
    ];

    // 修改记录模拟数据
    const mockRecordData = [
      {
        id: 'LOG001',
        targetId: 'RULE001',
        targetName: '渠道会员司机认证规则',
        changeType: 'update',
        changeField: '认证材料',
        changeDescription: '新增营运证为必需材料',
        operator: '张管理员',
        operatorId: 'ADMIN001',
        changeTime: '2025-01-20 14:20:00',
        approver: '李主管',
        status: 'approved'
      },
      {
        id: 'LOG002',
        targetId: 'USER001',
        targetName: '张师傅认证',
        changeType: 'update',
        changeField: '认证状态',
        changeDescription: '审核通过，更新认证状态为已认证',
        operator: '李审核员',
        operatorId: 'AUDIT001',
        changeTime: '2025-01-20 14:20:00',
        approver: '赵主管',
        status: 'approved'
      },
      {
        id: 'LOG003',
        targetId: 'RULE002',
        targetName: '渠道会员车辆认证规则',
        changeType: 'update',
        changeField: '有效期',
        changeDescription: '调整认证有效期从365天改为180天',
        operator: '王管理员',
        operatorId: 'ADMIN002',
        changeTime: '2025-01-18 16:45:00',
        approver: '李主管',
        status: 'approved'
      },
      {
        id: 'LOG004',
        targetId: 'USER002',
        targetName: '王司机认证',
        changeType: 'update',
        changeField: '审核结果',
        changeDescription: '审核不通过，行驶证照片不清晰',
        operator: '赵审核员',
        operatorId: 'AUDIT002',
        changeTime: '2025-01-20 10:15:00',
        approver: '张主管',
        status: 'approved'
      }
    ];

    setRulesData(mockRulesData);
    setAuditData(mockAuditData);
    setUserData(mockUserData);
    setRecordData(mockRecordData);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleRuleSearch = (values) => {
    console.log('规则搜索条件:', values);
  };

  const handleAuditSearch = (values) => {
    console.log('审核记录搜索条件:', values);
  };

  const handleUserSearch = (values) => {
    console.log('用户搜索条件:', values);
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

  const handleApprove = (record) => {
    console.log('审核通过:', record);
  };

  const handleReject = (record) => {
    console.log('审核拒绝:', record);
  };

  // 渠道会员规则配置列定义
  const rulesColumns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
    },
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      key: 'ruleType',
      width: 120,
      render: (type) => (
        <Tag color="cyan">{type}</Tag>
      ),
    },
    {
      title: '适用区域',
      dataIndex: 'applicableRegion',
      key: 'applicableRegion',
      width: 120,
    },
    {
      title: '必需材料',
      dataIndex: 'requiredDocuments',
      key: 'requiredDocuments',
      width: 200,
      render: (docs) => (
        <div>
          {docs.split(',').map((doc, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>{doc}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '有效期',
      dataIndex: 'validityPeriod',
      key: 'validityPeriod',
      width: 100,
    },
    {
      title: '自动审核',
      dataIndex: 'autoReview',
      key: 'autoReview',
      width: 100,
      render: (auto) => (
        <Switch checked={auto} disabled />
      ),
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
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
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

  // 渠道会员审核记录列定义
  const auditColumns = [
    {
      title: '申请人',
      dataIndex: 'applicantName',
      key: 'applicantName',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'applicantPhone',
      key: 'applicantPhone',
      width: 130,
    },
    {
      title: '申请类型',
      dataIndex: 'applicationType',
      key: 'applicationType',
      width: 120,
      render: (type) => (
        <Tag color="orange">{type}</Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      width: 160,
      render: (time) => time || '-',
    },
    {
      title: '审核员',
      dataIndex: 'auditor',
      key: 'auditor',
      width: 100,
      render: (auditor) => auditor || '-',
    },
    {
      title: '审核结果',
      dataIndex: 'auditResult',
      key: 'auditResult',
      width: 100,
      render: (result) => {
        if (!result) return '-';
        const resultConfig = {
          approved: { color: 'success', icon: <CheckCircleOutlined />, text: '通过' },
          rejected: { color: 'error', icon: <CloseCircleOutlined />, text: '拒绝' }
        };
        const config = resultConfig[result];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          pending: { status: 'warning', text: '待审核' },
          reviewing: { status: 'processing', text: '审核中' },
          completed: { status: 'success', text: '已完成' }
        };
        const config = statusConfig[status];
        return <Badge status={config.status} text={config.text} />;
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
          {record.status === 'pending' && (
            <>
              <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record)}>
                通过
              </Button>
              <Button type="primary" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record)}>
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 渠道会员用户管理列定义
  const userColumns = [
    {
      title: '用户姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'userPhone',
      key: 'userPhone',
      width: 130,
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      key: 'userType',
      width: 120,
      render: (type) => (
        <Tag color="purple">{type}</Tag>
      ),
    },
    {
      title: '认证状态',
      dataIndex: 'certificationStatus',
      key: 'certificationStatus',
      width: 120,
      render: (status) => {
        const statusConfig = {
          certified: { color: 'success', text: '已认证' },
          pending: { color: 'warning', text: '待认证' },
          rejected: { color: 'error', text: '已拒绝' },
          expired: { color: 'default', text: '已过期' }
        };
        const config = statusConfig[status];
        return <Badge status={config.color} text={config.text} />;
      },
    },
    {
      title: '车辆信息',
      dataIndex: 'vehicleInfo',
      key: 'vehicleInfo',
      width: 180,
    },
    {
      title: '服务区域',
      dataIndex: 'serviceRegion',
      key: 'serviceRegion',
      width: 100,
    },
    {
      title: '订单数量',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (rating) => rating > 0 ? rating.toFixed(1) : '-',
    },
    {
      title: '认证到期时间',
      dataIndex: 'expiryTime',
      key: 'expiryTime',
      width: 160,
      render: (time) => time || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          active: { status: 'success', text: '正常' },
          inactive: { status: 'default', text: '停用' },
          pending: { status: 'warning', text: '待审核' },
          expired: { status: 'error', text: '已过期' }
        };
        const config = statusConfig[status];
        return <Badge status={config.status} text={config.text} />;
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
          {record.status === 'active' && (
            <Button type="primary" size="small" danger>
              停用
            </Button>
          )}
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

  // 渲染渠道会员规则配置tab
  const renderRulesConfig = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={ruleSearchForm} layout="inline" onFinish={handleRuleSearch}>
          <Form.Item name="ruleName" label="规则名称">
            <Input placeholder="请输入规则名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="ruleType" label="规则类型">
            <Select placeholder="请选择规则类型" style={{ width: 120 }}>
              <Option value="identity">身份认证</Option>
              <Option value="vehicle">车辆认证</Option>
              <Option value="platform">平台准入</Option>
              <Option value="service">服务认证</Option>
            </Select>
          </Form.Item>
          <Form.Item name="region" label="适用区域">
            <Select placeholder="请选择区域" style={{ width: 120 }}>
              <Option value="national">全国</Option>
              <Option value="province">江西省</Option>
              <Option value="city">南昌市</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 100 }}>
              <Option value="active">启用中</Option>
              <Option value="inactive">已停用</Option>
            </Select>
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
                新建规则
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={rulesColumns}
          dataSource={rulesData}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            total: rulesData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染渠道会员审核记录tab
  const renderAuditRecords = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={auditSearchForm} layout="inline" onFinish={handleAuditSearch}>
          <Form.Item name="applicantName" label="申请人">
            <Input placeholder="请输入申请人姓名" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="applicationType" label="申请类型">
            <Select placeholder="请选择申请类型" style={{ width: 120 }}>
              <Option value="driver">司机认证</Option>
              <Option value="vehicle">车辆认证</Option>
              <Option value="platform">平台准入</Option>
              <Option value="service">服务认证</Option>
            </Select>
          </Form.Item>
          <Form.Item name="auditResult" label="审核结果">
            <Select placeholder="请选择审核结果" style={{ width: 100 }}>
              <Option value="approved">通过</Option>
              <Option value="rejected">拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 100 }}>
              <Option value="pending">待审核</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="提交时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => auditSearchForm.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={auditColumns}
          dataSource={auditData}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            total: auditData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );

  // 渲染渠道会员用户管理tab
  const renderUserManagement = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={userSearchForm} layout="inline" onFinish={handleUserSearch}>
          <Form.Item name="userName" label="用户姓名">
            <Input placeholder="请输入用户姓名" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="userPhone" label="联系电话">
            <Input placeholder="请输入联系电话" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="certificationStatus" label="认证状态">
            <Select placeholder="请选择认证状态" style={{ width: 120 }}>
              <Option value="certified">已认证</Option>
              <Option value="pending">待认证</Option>
              <Option value="rejected">已拒绝</Option>
              <Option value="expired">已过期</Option>
            </Select>
          </Form.Item>
          <Form.Item name="serviceRegion" label="服务区域">
            <Select placeholder="请选择服务区域" style={{ width: 120 }}>
              <Option value="nanchang">南昌市</Option>
              <Option value="ganzhou">赣州市</Option>
              <Option value="jiujiang">九江市</Option>
              <Option value="shangrao">上饶市</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="用户状态">
            <Select placeholder="请选择状态" style={{ width: 100 }}>
              <Option value="active">正常</Option>
              <Option value="inactive">停用</Option>
              <Option value="expired">已过期</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => userSearchForm.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={userColumns}
          dataSource={userData}
          rowKey="id"
          scroll={{ x: 1600 }}
          pagination={{
            total: userData.length,
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
        <Form form={recordSearchForm} layout="inline" onFinish={handleRecordSearch}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="搜索目标名称、ID、操作人等" style={{ width: 200 }} />
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
              <Option value="certification">认证状态</Option>
              <Option value="documents">认证材料</Option>
              <Option value="validity">有效期</Option>
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
      title={<><HistoryOutlined /> 详情信息</>}
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
              <Descriptions.Item label="申请人">{currentRecord.applicantName || currentRecord.targetName}</Descriptions.Item>
              <Descriptions.Item label="申请类型">{currentRecord.applicationType || currentRecord.changeType}</Descriptions.Item>
              <Descriptions.Item label="提交时间">{currentRecord.submitTime || currentRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge status="success" text="详情信息" />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="详细信息" style={{ height: '300px' }}>
                <div style={{ textAlign: 'center', paddingTop: '80px', color: '#666' }}>
                  详细信息展示待开发
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="操作记录" style={{ height: '300px' }}>
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <div>申请提交</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            2025-01-20 09:30:00
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'green',
                      children: (
                        <div>
                          <div>审核完成</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            审核人: 李审核员<br />
                            2025-01-20 14:20:00
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
          渠道会员规则配置
        </span>
      ),
      children: renderRulesConfig(),
    },
    {
      key: 'audit',
      label: (
        <span>
          <AuditOutlined />
          渠道会员审核记录
        </span>
      ),
      children: renderAuditRecords(),
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined />
          渠道会员用户管理
        </span>
      ),
      children: renderUserManagement(),
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
    <div className="member-identity-container">
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

export default MemberIdentity;