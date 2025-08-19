import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Form, 
  Modal, 
  Input, 
  Select, 
  Switch, 
  Space,
  message,
  Popconfirm,
  DatePicker,
  Row,
  Col,
  Descriptions,
  Tag,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

// 模拟数据
import organizationData from '../../../mock/organization/organizationData.json';
import paymentData from '../../../mock/payment/paymentAcceptanceData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 支付平台配置数据
const paymentPlatformConfig = paymentData.paymentPlatformConfig;

// 开通业务选项
const businessOptions = paymentData.businessOptions;

const PaymentAcceptanceConfig = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  
  // 表单和弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isChangeDetailModalVisible, setIsChangeDetailModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [viewingChangeRecord, setViewingChangeRecord] = useState(null);
  
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [changeSearchForm] = Form.useForm();
  
  // 级联选择状态
  const [selectedPrimaryPlatform, setSelectedPrimaryPlatform] = useState(null);
  const [selectedSecondaryPlatform, setSelectedSecondaryPlatform] = useState(null);

  // 初始化数据
  useEffect(() => {
    loadConfigData();
    loadChangeRecords();
  }, []);

  const loadConfigData = () => {
    // 加载配置数据
    setDataSource(paymentData.paymentConfigs);
  };

  const loadChangeRecords = () => {
    // 加载修改记录数据
    setChangeRecords(paymentData.changeRecords);
  };

  // 处理一级支付平台变化
  const handlePrimaryPlatformChange = (value) => {
    setSelectedPrimaryPlatform(value);
    setSelectedSecondaryPlatform(null);
    form.setFieldsValue({
      secondaryPlatform: undefined,
      paymentMethod: undefined,
      channelId: undefined
    });
  };

  // 处理二级支付平台变化
  const handleSecondaryPlatformChange = (value) => {
    setSelectedSecondaryPlatform(value);
    if (selectedPrimaryPlatform && value) {
      const config = paymentPlatformConfig[selectedPrimaryPlatform][value];
      form.setFieldsValue({
        paymentMethod: config.method,
        channelId: config.channelId
      });
    }
  };

  // 生成配置ID
  const generateConfigId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 打开新增/编辑弹窗
  const openModal = (record = null) => {
    setEditingRecord(record);
    setIsModalVisible(true);
    
    if (record) {
      // 编辑模式
      setSelectedPrimaryPlatform(record.primaryPlatform);
      setSelectedSecondaryPlatform(record.secondaryPlatform);
      
      // 构建组织信息的value
      const orgValue = `${record.orgType}_${record.orgId}`;
      
      form.setFieldsValue({
        ...record,
        orgInfo: orgValue,
        startTime: moment(record.startTime),
        endTime: record.endTime === '长期有效' ? null : moment(record.endTime),
        isLongTerm: record.endTime === '长期有效'
      });
    } else {
      // 新增模式
      setSelectedPrimaryPlatform(null);
      setSelectedSecondaryPlatform(null);
      form.resetFields();
      form.setFieldsValue({
        configId: generateConfigId(),
        isDefault: false,
        merchantAccount: '1',
        accessToken: '1',
        terminalNo: '1',
        status: '开启',
        isLongTerm: false
      });
    }
  };

  // 打开查看弹窗
  const openViewModal = (record) => {
    setViewingRecord(record);
    setIsViewModalVisible(true);
  };

  // 打开修改记录详情弹窗
  const openChangeDetailModal = (record) => {
    setViewingChangeRecord(record);
    setIsChangeDetailModalVisible(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setIsChangeDetailModalVisible(false);
    setEditingRecord(null);
    setViewingRecord(null);
    setViewingChangeRecord(null);
    form.resetFields();
  };

  // 保存配置
  const handleSave = async (values) => {
    try {
      setLoading(true);
      
      // 处理组织信息
      const orgTreeData = buildOrgTreeData(organizationData);
      const selectedOrg = orgTreeData.find(item => item.value === values.orgInfo);
      
      // 处理结束时间
      const endTime = values.isLongTerm ? '长期有效' : values.endTime.format('YYYY-MM-DD HH:mm:ss');
      
      const configData = {
        ...values,
        orgType: selectedOrg?.orgType,
        orgId: selectedOrg?.orgId,
        orgName: selectedOrg?.orgName,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime,
        createTime: editingRecord ? editingRecord.createTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };

      if (editingRecord) {
        // 更新
        const newDataSource = dataSource.map(item => 
          item.id === editingRecord.id ? { ...item, ...configData } : item
        );
        setDataSource(newDataSource);
        message.success('配置更新成功');
      } else {
        // 新增
        const newRecord = {
          id: Date.now(),
          ...configData
        };
        setDataSource([...dataSource, newRecord]);
        message.success('配置创建成功');
      }
      
      closeModal();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除配置
  const handleDelete = (record) => {
    const newDataSource = dataSource.filter(item => item.id !== record.id);
    setDataSource(newDataSource);
    message.success('删除成功');
  };

  // 搜索配置
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 这里应该调用API进行搜索
  };

  // 搜索修改记录
  const handleChangeSearch = (values) => {
    console.log('修改记录搜索条件:', values);
    // 这里应该调用API进行搜索
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 重置修改记录搜索
  const handleChangeReset = () => {
    changeSearchForm.resetFields();
  };

  // 构建组织树数据 - 仅包含法人实体和油站
  const buildOrgTreeData = (orgData) => {
    const result = [];
    
    // 添加法人实体
    orgData.legalEntities.forEach(legal => {
      result.push({
        title: legal.name,
        value: `legal_${legal.id}`,
        key: `legal_${legal.id}`,
        orgType: 'legal',
        orgId: legal.id,
        orgName: legal.name
      });
    });
    
    // 递归查找所有油站
    const findStations = (nodes) => {
      const stations = [];
      nodes.forEach(node => {
        if (node.orgType === 'GAS_STATION') {
          stations.push({
            title: node.name,
            value: `station_${node.id}`,
            key: `station_${node.id}`,
            orgType: 'station',
            orgId: node.id,
            orgName: node.name
          });
        }
        if (node.children && node.children.length > 0) {
          stations.push(...findStations(node.children));
        }
      });
      return stations;
    };
    
    // 添加所有油站
    const stations = findStations(orgData.orgTreeData);
    result.push(...stations);
    
    return result;
  };

  // 配置表格列
  const configColumns = [
    {
      title: '配置ID',
      dataIndex: 'configId',
      key: 'configId',
      width: 100,
      fixed: 'left'
    },
    {
      title: '开通业务',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 120,
      render: (type) => (
        <Tag color="blue">{type}</Tag>
      )
    },
    {
      title: '组织信息',
      key: 'orgInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.orgName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.orgType === 'station' ? '油站' : '法律实体'}
          </div>
        </div>
      )
    },
    {
      title: '支付平台',
      key: 'platform',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.primaryPlatform}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.secondaryPlatform}</div>
        </div>
      )
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150
    },
    {
      title: '渠道ID',
      dataIndex: 'channelId',
      key: 'channelId',
      width: 100
    },
    {
      title: '子商户ID',
      dataIndex: 'merchantId',
      key: 'merchantId',
      width: 150
    },
    {
      title: '是否默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: 100,
      render: (isDefault) => (
        <Tag color={isDefault ? 'green' : 'default'}>
          {isDefault ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === '开启' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: '受理时间',
      key: 'acceptTime',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>开始：{record.startTime}</div>
          <div style={{ fontSize: '12px' }}>结束：{record.endTime}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="删除后您的支付将会出现异常，谨慎操作"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 修改记录表格列
  const changeColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
      sorter: true,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '配置信息',
      key: 'configInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.configId}</div>
        </div>
      )
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => {
        const config = {
          create: { color: 'success', icon: <PlusOutlined />, text: '新建' },
          update: { color: 'warning', icon: <EditOutlined />, text: '修改' },
          delete: { color: 'error', icon: <DeleteOutlined />, text: '删除' }
        };
        const { color, icon, text } = config[type] || config.update;
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
      key: 'changeField',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text.length > 20 ? `${text.slice(0, 20)}...` : text}</span>
        </Tooltip>
      )
    },
    {
      title: '操作人',
      key: 'operatorInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.operator}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.operatorId}</div>
        </div>
      )
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = {
          approved: { status: 'success', text: '已通过' },
          pending: { status: 'warning', text: '待审批' },
          rejected: { status: 'error', text: '已拒绝' }
        };
        const { status: badgeStatus, text } = config[status] || config.pending;
        return <Tag color={badgeStatus === 'success' ? 'green' : badgeStatus === 'error' ? 'red' : 'orange'}>{text}</Tag>;
      }
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
          onClick={() => openChangeDetailModal(record)}
        >
          查看详情
        </Button>
      )
    }
  ];

  // 配置Tab内容
  const configTabContent = (
    <div>
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={5}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="配置ID/组织名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="primaryPlatform" label="支付平台">
                <Select placeholder="请选择" allowClear>
                  {Object.keys(paymentPlatformConfig).map(platform => (
                    <Option key={platform} value={platform}>{platform}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Option value="开启">开启</Option>
                  <Option value="关闭">关闭</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="orgType" label="组织类型">
                <Select placeholder="请选择" allowClear>
                  <Option value="station">油站</Option>
                  <Option value="legal">法律实体</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 功能按钮区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row>
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => openModal()}
              >
                新建配置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 表格区域 */}
      <Card>
        <Table
          columns={configColumns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            total: dataSource.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  );

  // 修改记录Tab内容
  const changeRecordTabContent = (
    <div>
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={changeSearchForm} layout="inline" onFinish={handleChangeSearch}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={5}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="配置ID/操作人" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="changeType" label="变更类型">
                <Select placeholder="请选择" allowClear>
                  <Option value="create">新建</Option>
                  <Option value="update">修改</Option>
                  <Option value="delete">删除</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Option value="approved">已通过</Option>
                  <Option value="pending">待审批</Option>
                  <Option value="rejected">已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="timeRange" label="时间范围">
                <RangePicker showTime />
              </Form.Item>
            </Col>
            <Col span={5} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleChangeReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card>
        <Table
          columns={changeColumns}
          dataSource={changeRecords}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: changeRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  );

  return (
    <div className="payment-acceptance-config-container">
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: '16px' }}
          items={[
            {
              key: 'config',
              label: '支付受理配置',
              children: configTabContent
            },
            {
              key: 'changeRecord',
              label: '修改记录',
              children: changeRecordTabContent
            }
          ]}
        />
      </Card>

      {/* 新增/编辑配置弹窗 */}
      <Modal
        title={editingRecord ? '编辑支付受理配置' : '新建支付受理配置'}
        open={isModalVisible}
        onCancel={closeModal}
        width={800}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
            {editingRecord ? '更新' : '创建'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            isDefault: false,
            merchantAccount: '1',
            accessToken: '1',
            terminalNo: '1',
            status: '开启',
            isLongTerm: false
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="configId"
                label="配置唯一ID"
                rules={[{ required: true, message: '请输入配置ID' }]}
              >
                <Input placeholder="6位数英文+数字" disabled={!!editingRecord} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orgInfo"
                label="组织架构"
                rules={[{ required: true, message: '请选择组织架构' }]}
              >
                <Select
                  placeholder="请选择法律实体或油站"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={buildOrgTreeData(organizationData).map(item => ({
                    label: `${item.title} (${item.orgType === 'legal' ? '法律实体' : '油站'})`,
                    value: item.value,
                    orgType: item.orgType,
                    orgId: item.orgId,
                    orgName: item.orgName
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="businessType"
                label="开通业务"
                rules={[{ required: true, message: '请选择开通业务' }]}
              >
                <Select
                  placeholder="请选择开通业务"
                  options={businessOptions.map(option => ({ label: option, value: option }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="primaryPlatform"
                label="一级支付平台"
                rules={[{ required: true, message: '请选择一级支付平台' }]}
              >
                <Select
                  placeholder="请选择"
                  onChange={handlePrimaryPlatformChange}
                >
                  {Object.keys(paymentPlatformConfig).map(platform => (
                    <Option key={platform} value={platform}>{platform}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="secondaryPlatform"
                label="二级支付平台"
                rules={[{ required: true, message: '请选择二级支付平台' }]}
              >
                <Select
                  placeholder="请选择"
                  onChange={handleSecondaryPlatformChange}
                  disabled={!selectedPrimaryPlatform}
                >
                  {selectedPrimaryPlatform && Object.keys(paymentPlatformConfig[selectedPrimaryPlatform]).map(platform => (
                    <Option key={platform} value={platform}>{platform}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="paymentMethod"
                label="支付方式"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="channelId"
                label="渠道ID"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="merchantId"
                label="子商户ID"
                rules={[{ required: true, message: '请输入子商户ID' }]}
              >
                <Input placeholder="请输入子商户ID" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isDefault"
                label="是否为默认"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="appId"
                label="公众号APPID"
              >
                <Input placeholder="非必填" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="merchantAccount"
                label="子商户账户名"
                rules={[{ required: true, message: '请输入子商户账户名' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="accessToken"
                label="访问令牌"
              >
                <Input placeholder="非必填" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="terminalNo"
                label="终端号"
              >
                <Input placeholder="非必填" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="开启">开启</Option>
                  <Option value="关闭">关闭</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="受理开始时间"
                rules={[{ required: true, message: '请选择受理开始时间' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  placeholder="请选择开始时间"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isLongTerm"
                label="受理结束时间"
                valuePropName="checked"
              >
                <Switch checkedChildren="长期有效" unCheckedChildren="指定时间" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.isLongTerm !== currentValues.isLongTerm}>
            {({ getFieldValue }) => {
              const isLongTerm = getFieldValue('isLongTerm');
              return !isLongTerm ? (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="endTime"
                      label=" "
                      rules={[{ required: !isLongTerm, message: '请选择受理结束时间' }]}
                    >
                      <DatePicker 
                        showTime 
                        style={{ width: '100%' }} 
                        placeholder="请选择结束时间"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="支付受理配置详情"
        open={isViewModalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {viewingRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="配置ID">{viewingRecord.configId}</Descriptions.Item>
              <Descriptions.Item label="开通业务">
                <Tag color="blue">{viewingRecord.businessType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="组织名称">{viewingRecord.orgName}</Descriptions.Item>
              <Descriptions.Item label="组织类型">
                {viewingRecord.orgType === 'station' ? '油站' : '法律实体'}
              </Descriptions.Item>
              <Descriptions.Item label="一级支付平台">{viewingRecord.primaryPlatform}</Descriptions.Item>
              <Descriptions.Item label="二级支付平台">{viewingRecord.secondaryPlatform}</Descriptions.Item>
              <Descriptions.Item label="支付方式">{viewingRecord.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="渠道ID">{viewingRecord.channelId}</Descriptions.Item>
              <Descriptions.Item label="子商户ID">{viewingRecord.merchantId}</Descriptions.Item>
              <Descriptions.Item label="是否为默认">
                <Tag color={viewingRecord.isDefault ? 'green' : 'default'}>
                  {viewingRecord.isDefault ? '是' : '否'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="公众号APPID">{viewingRecord.appId || '-'}</Descriptions.Item>
              <Descriptions.Item label="子商户账户名">{viewingRecord.merchantAccount}</Descriptions.Item>
              <Descriptions.Item label="访问令牌">{viewingRecord.accessToken}</Descriptions.Item>
              <Descriptions.Item label="终端号">{viewingRecord.terminalNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={viewingRecord.status === '开启' ? 'green' : 'red'}>
                  {viewingRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="受理开始时间">{viewingRecord.startTime}</Descriptions.Item>
              <Descriptions.Item label="受理结束时间">{viewingRecord.endTime}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{viewingRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{viewingRecord.updateTime}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 修改记录详情弹窗 */}
      <Modal
        title="变更详情"
        open={isChangeDetailModalVisible}
        onCancel={closeModal}
        width={800}
        footer={[
          <Button key="close" onClick={closeModal}>
            关闭
          </Button>
        ]}
      >
        {viewingChangeRecord && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="配置ID">{viewingChangeRecord.configId}</Descriptions.Item>
              <Descriptions.Item label="变更类型">
                <Tag color={
                  viewingChangeRecord.changeType === 'create' ? 'success' : 
                  viewingChangeRecord.changeType === 'update' ? 'warning' : 'error'
                }>
                  {viewingChangeRecord.changeType === 'create' ? '新建' : 
                   viewingChangeRecord.changeType === 'update' ? '修改' : '删除'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="变更字段">{viewingChangeRecord.changeField}</Descriptions.Item>
              <Descriptions.Item label="操作人">{viewingChangeRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="变更时间">{viewingChangeRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Tag color={
                  viewingChangeRecord.status === 'approved' ? 'green' : 
                  viewingChangeRecord.status === 'pending' ? 'orange' : 'red'
                }>
                  {viewingChangeRecord.status === 'approved' ? '已通过' : 
                   viewingChangeRecord.status === 'pending' ? '待审批' : '已拒绝'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="变更描述" span={2}>{viewingChangeRecord.changeDescription}</Descriptions.Item>
              <Descriptions.Item label="变更原因" span={2}>{viewingChangeRecord.reason}</Descriptions.Item>
              {viewingChangeRecord.approver && (
                <>
                  <Descriptions.Item label="审批人">{viewingChangeRecord.approver}</Descriptions.Item>
                  <Descriptions.Item label="审批时间">{viewingChangeRecord.approvalTime}</Descriptions.Item>
                  <Descriptions.Item label="审批备注" span={2}>{viewingChangeRecord.approvalRemark}</Descriptions.Item>
                </>
              )}
            </Descriptions>

            {/* 变更详情 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              变更详情
            </div>
            <Descriptions column={2} bordered size="small">
              {Object.keys(viewingChangeRecord.newValue).map(key => (
                <Descriptions.Item key={key} label={key}>
                  {viewingChangeRecord.changeType === 'create' ? (
                    <Tag color="green">新增: {JSON.stringify(viewingChangeRecord.newValue[key])}</Tag>
                  ) : viewingChangeRecord.changeType === 'update' ? (
                    <div>
                      <Tag color="red">原值: {JSON.stringify(viewingChangeRecord.oldValue[key])}</Tag>
                      <Tag color="green">新值: {JSON.stringify(viewingChangeRecord.newValue[key])}</Tag>
                    </div>
                  ) : (
                    <Tag color="red">删除: {JSON.stringify(viewingChangeRecord.oldValue[key])}</Tag>
                  )}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        )}
      </Modal>
      
      {/* 页面底部备注 */}
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        backgroundColor: '#f0f2f5', 
        borderRadius: 4,
        fontSize: 12,
        color: '#666'
      }}>
        <strong>备注信息：</strong>
        支付受理配置模块已完成更新，开通业务已调整为单选模式，包含8种业务类型：一键加油主扫/被扫、充值主扫/被扫、微信小程序、积分商城、闪付主扫/被扫。
        表格列顺序调整为：配置ID → 开通业务 → 组织信息。组织选择仅支持法律实体和油站，不包含其他机构层级。
        修改记录功能按照修改记录设计规范实现，支持变更历史追踪和详情查看。
        删除操作包含安全提示"删除后您的支付将会出现异常，谨慎操作"。
        页面遵循设计规范要求，使用双Tab页设计，支持筛选、搜索、新建、编辑、查看和删除等完整功能。
      </div>
    </div>
  );
};

export default PaymentAcceptanceConfig; 