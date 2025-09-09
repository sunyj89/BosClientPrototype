import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip, Switch, Upload, ColorPicker, InputNumber, Divider, Checkbox } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, SettingOutlined, BgColorsOutlined, PhoneOutlined, AppstoreOutlined, FileTextOutlined, SafetyOutlined, CreditCardOutlined, ShareAltOutlined, PictureOutlined, UploadOutlined, DragOutlined, ControlOutlined } from '@ant-design/icons';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const PersonalCenterConfig = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('grid');
  const [gridForm] = Form.useForm();
  const [privacyForm] = Form.useForm();
  const [agreementForm] = Form.useForm();
  const [cardForm] = Form.useForm();
  const [shareForm] = Form.useForm();
  const [globalRulesForm] = Form.useForm();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentVersions, setCurrentVersions] = useState([]);

  // 九宫格配置数据
  const [gridConfig, setGridConfig] = useState([]);
  // 文档数据
  const [documentsData, setDocumentsData] = useState({});
  // 全局规则配置数据
  const [globalRulesConfig, setGlobalRulesConfig] = useState({
    memberRegistration: {
      idCard: true,
      plateNumber: true,
      birthday: false,
      referrer: false
    },
    pointsClearCycle: {
      years: 1,
      month: 1,
      day: 1
    },
    dailyConsumptionLimit: 0
  });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 九宫格配置模拟数据
    const mockGridConfig = [
      {
        id: 'GRID001',
        name: '我的订单',
        icon: 'shopping-cart',
        enabled: true,
        sortOrder: 1,
        linkUrl: '/orders'
      },
      {
        id: 'GRID002',
        name: '积分商城',
        icon: 'gift',
        enabled: true,
        sortOrder: 2,
        linkUrl: '/points-mall'
      },
      {
        id: 'GRID003',
        name: '优惠券',
        icon: 'tags',
        enabled: true,
        sortOrder: 3,
        linkUrl: '/coupons'
      },
      {
        id: 'GRID004',
        name: '服务记录',
        icon: 'file-text',
        enabled: false,
        sortOrder: 4,
        linkUrl: '/service-records'
      },
      {
        id: 'GRID005',
        name: '意见反馈',
        icon: 'message',
        enabled: true,
        sortOrder: 5,
        linkUrl: '/feedback'
      },
      {
        id: 'GRID006',
        name: '联系客服',
        icon: 'customer-service',
        enabled: true,
        sortOrder: 6,
        linkUrl: '/contact'
      },
      {
        id: 'GRID007',
        name: '设置',
        icon: 'setting',
        enabled: true,
        sortOrder: 7,
        linkUrl: '/settings'
      },
      {
        id: 'GRID008',
        name: '关于我们',
        icon: 'info-circle',
        enabled: false,
        sortOrder: 8,
        linkUrl: '/about'
      },
      {
        id: 'GRID009',
        name: '帮助中心',
        icon: 'question-circle',
        enabled: true,
        sortOrder: 9,
        linkUrl: '/help'
      }
    ];

    // 文档数据模拟
    const mockDocumentsData = {
      privacy: {
        currentVersion: '2.1.0',
        updateTime: '2025-01-20 10:30:00',
        content: '用户隐私政策内容...',
        versions: [
          {
            version: '2.1.0',
            updateTime: '2025-01-20 10:30:00',
            content: '最新版本隐私政策内容...',
            status: 'current'
          },
          {
            version: '2.0.0',
            updateTime: '2024-12-15 14:20:00',
            content: '上一版本隐私政策内容...',
            status: 'archived'
          },
          {
            version: '1.0.0',
            updateTime: '2024-06-01 09:00:00',
            content: '初始版本隐私政策内容...',
            status: 'archived'
          }
        ]
      },
      agreement: {
        currentVersion: '1.3.0',
        updateTime: '2025-01-18 16:45:00',
        content: '会员协议内容...',
        versions: [
          {
            version: '1.3.0',
            updateTime: '2025-01-18 16:45:00',
            content: '最新版本会员协议内容...',
            status: 'current'
          },
          {
            version: '1.2.0',
            updateTime: '2024-11-10 11:30:00',
            content: '上一版本会员协议内容...',
            status: 'archived'
          }
        ]
      },
      cardRegulation: {
        currentVersion: '1.1.0',
        updateTime: '2025-01-15 13:20:00',
        content: '预付卡章程内容...',
        versions: [
          {
            version: '1.1.0',
            updateTime: '2025-01-15 13:20:00',
            content: '最新版本预付卡章程内容...',
            status: 'current'
          },
          {
            version: '1.0.0',
            updateTime: '2024-08-20 10:15:00',
            content: '初始版本预付卡章程内容...',
            status: 'archived'
          }
        ]
      },
      shareList: {
        currentVersion: '1.0.1',
        updateTime: '2025-01-22 09:40:00',
        content: '第三方共享个人信息清单内容...',
        versions: [
          {
            version: '1.0.1',
            updateTime: '2025-01-22 09:40:00',
            content: '最新版本第三方共享清单内容...',
            status: 'current'
          }
        ]
      }
    };

    setGridConfig(mockGridConfig);
    setDocumentsData(mockDocumentsData);
    
    // 初始化全局规则表单数据
    globalRulesForm.setFieldsValue(globalRulesConfig);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSaveGrid = (values) => {
    console.log('保存九宫格配置:', values);
  };

  const handleGridToggle = (gridId, enabled) => {
    setGridConfig(prev => 
      prev.map(item => 
        item.id === gridId ? { ...item, enabled } : item
      )
    );
  };

  const handleDocumentEdit = (docType) => {
    setCurrentDocument(docType);
    setModalVisible(true);
  };

  const handleViewVersions = (docType) => {
    setCurrentDocument(docType);
    setCurrentVersions(documentsData[docType]?.versions || []);
    setVersionModalVisible(true);
  };

  const handleSaveDocument = (values) => {
    console.log('保存文档:', currentDocument, values);
    setModalVisible(false);
  };

  const handleSaveGlobalRules = (values) => {
    console.log('保存全局规则配置:', values);
    setGlobalRulesConfig(values);
  };

  // 九宫格配置列定义
  const gridColumns = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (order) => (
        <div style={{ textAlign: 'center' }}>
          <DragOutlined style={{ marginRight: '8px', color: '#ccc' }} />
          {order}
        </div>
      ),
    },
    {
      title: '功能名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: (icon) => <Tag color="blue">{icon}</Tag>,
    },
    {
      title: '跳转链接',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
      width: 200,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled, record) => (
        <Switch 
          checked={enabled} 
          onChange={(checked) => handleGridToggle(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
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

  // Banner配置列定义
  const bannerColumns = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (order) => (
        <div style={{ textAlign: 'center' }}>
          <DragOutlined style={{ marginRight: '8px', color: '#ccc' }} />
          {order}
        </div>
      ),
    },
    {
      title: 'Banner标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '图片预览',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (url) => (
        <div style={{ width: '80px', height: '40px', background: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PictureOutlined style={{ color: '#ccc' }} />
        </div>
      ),
    },
    {
      title: '跳转链接',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
      width: 200,
    },
    {
      title: '展示时间',
      key: 'displayTime',
      width: 200,
      render: (_, record) => `${record.startTime} ~ ${record.endTime}`,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled) => (
        <Badge status={enabled ? 'success' : 'default'} text={enabled ? '启用' : '禁用'} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            预览
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

  // 渲染九宫格配置tab
  const renderGridConfig = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增功能
          </Button>
          <Button>批量操作</Button>
          <div style={{ marginLeft: '16px', color: '#666' }}>
            拖拽行可调整显示顺序
          </div>
        </Space>
      </Card>

      <Card>
        <Table
          columns={gridColumns}
          dataSource={gridConfig}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );

  // 渲染文档维护tab
  const renderDocumentMaintenance = () => (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="用户隐私政策" extra={
            <Space>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleDocumentEdit('privacy')}>
                编辑
              </Button>
              <Button size="small" icon={<HistoryOutlined />} onClick={() => handleViewVersions('privacy')}>
                版本历史
              </Button>
            </Space>
          }>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="当前版本">{documentsData.privacy?.currentVersion}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{documentsData.privacy?.updateTime}</Descriptions.Item>
              <Descriptions.Item label="版本数量">{documentsData.privacy?.versions?.length || 0}个</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="会员协议" extra={
            <Space>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleDocumentEdit('agreement')}>
                编辑
              </Button>
              <Button size="small" icon={<HistoryOutlined />} onClick={() => handleViewVersions('agreement')}>
                版本历史
              </Button>
            </Space>
          }>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="当前版本">{documentsData.agreement?.currentVersion}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{documentsData.agreement?.updateTime}</Descriptions.Item>
              <Descriptions.Item label="版本数量">{documentsData.agreement?.versions?.length || 0}个</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="预付卡章程" extra={
            <Space>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleDocumentEdit('cardRegulation')}>
                编辑
              </Button>
              <Button size="small" icon={<HistoryOutlined />} onClick={() => handleViewVersions('cardRegulation')}>
                版本历史
              </Button>
            </Space>
          }>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="当前版本">{documentsData.cardRegulation?.currentVersion}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{documentsData.cardRegulation?.updateTime}</Descriptions.Item>
              <Descriptions.Item label="版本数量">{documentsData.cardRegulation?.versions?.length || 0}个</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="第三方共享个人信息清单" extra={
            <Space>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleDocumentEdit('shareList')}>
                编辑
              </Button>
              <Button size="small" icon={<HistoryOutlined />} onClick={() => handleViewVersions('shareList')}>
                版本历史
              </Button>
            </Space>
          }>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="当前版本">{documentsData.shareList?.currentVersion}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{documentsData.shareList?.updateTime}</Descriptions.Item>
              <Descriptions.Item label="版本数量">{documentsData.shareList?.versions?.length || 0}个</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染文档编辑弹窗
  const renderDocumentModal = () => (
    <Modal
      title={`编辑${currentDocument === 'privacy' ? '隐私政策' : 
                currentDocument === 'agreement' ? '会员协议' : 
                currentDocument === 'cardRegulation' ? '预付卡章程' : 
                '第三方共享清单'}`}
      open={modalVisible}
      width={800}
      footer={[
        <Button key="cancel" onClick={() => setModalVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleSaveDocument({})}>
          保存
        </Button>
      ]}
      onCancel={() => setModalVisible(false)}
    >
      <Form layout="vertical">
        <Form.Item name="version" label="版本号" rules={[{ required: true }]}>
          <Input placeholder="请输入版本号，如 2.1.0" />
        </Form.Item>
        <Form.Item name="content" label="文档内容" rules={[{ required: true }]}>
          <TextArea rows={12} placeholder="请输入文档内容" />
        </Form.Item>
        <Form.Item name="remark" label="更新说明">
          <TextArea rows={3} placeholder="请输入本次更新的说明" />
        </Form.Item>
      </Form>
    </Modal>
  );

  // 渲染版本历史弹窗
  const renderVersionModal = () => (
    <Modal
      title="版本历史"
      open={versionModalVisible}
      width={900}
      footer={[
        <Button key="close" onClick={() => setVersionModalVisible(false)}>
          关闭
        </Button>
      ]}
      onCancel={() => setVersionModalVisible(false)}
    >
      <Timeline>
        {currentVersions.map((version, index) => (
          <Timeline.Item 
            key={index}
            color={version.status === 'current' ? 'green' : 'gray'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>版本 {version.version}</strong>
                {version.status === 'current' && <Tag color="green">当前版本</Tag>}
              </div>
              <div style={{ color: '#666', fontSize: '12px', margin: '4px 0' }}>
                更新时间: {version.updateTime}
              </div>
              <div style={{ marginTop: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                {version.content}
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Modal>
  );

  // 渲染全局规则配置tab
  const renderGlobalRulesConfig = () => (
    <Card>
      <Form
        form={globalRulesForm}
        layout="vertical"
        onFinish={handleSaveGlobalRules}
        initialValues={globalRulesConfig}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Divider orientation="left">会员注册设置</Divider>
            <Form.Item label="注册会员时可填写的信息">
              <Form.Item name={['memberRegistration', 'idCard']} valuePropName="checked" style={{ display: 'inline-block', marginRight: 16 }}>
                <Checkbox>身份证号</Checkbox>
              </Form.Item>
              <Form.Item name={['memberRegistration', 'plateNumber']} valuePropName="checked" style={{ display: 'inline-block', marginRight: 16 }}>
                <Checkbox>车牌号</Checkbox>
              </Form.Item>
              <Form.Item name={['memberRegistration', 'birthday']} valuePropName="checked" style={{ display: 'inline-block', marginRight: 16 }}>
                <Checkbox>生日</Checkbox>
              </Form.Item>
              <Form.Item name={['memberRegistration', 'referrer']} valuePropName="checked" style={{ display: 'inline-block' }}>
                <Checkbox>推荐人</Checkbox>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Divider orientation="left">积分清零周期</Divider>
            <Space align="baseline">
            <span>每隔</span>
              <Form.Item name={['pointsClearCycle', 'years']} style={{ marginBottom: 0 }}>
                <InputNumber min={0} placeholder="0" addonAfter="年" />
              </Form.Item>
              <span>年的</span>
              <Form.Item name={['pointsClearCycle', 'month']} style={{ marginBottom: 0 }}>
                <Select style={{ width: 80 }}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <Option key={i + 1} value={i + 1}>{i + 1}</Option>
                  ))}
                </Select>
              </Form.Item>
              <span>月</span>
              <Form.Item name={['pointsClearCycle', 'day']} style={{ marginBottom: 0 }}>
                <Select style={{ width: 80 }}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <Option key={i + 1} value={i + 1}>{i + 1}</Option>
                  ))}
                </Select>
              </Form.Item>
              <span>日清零</span>
            </Space>
            <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
              设置为0年表示不清零
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Divider orientation="left">会员消费限制</Divider>
            <Form.Item name="dailyConsumptionLimit" label="每日消费限制">
              <InputNumber min={0} placeholder="0" addonAfter="次" style={{ width: 200 }} />
            </Form.Item>
            <div style={{ marginTop: -16, color: '#666', fontSize: '12px' }}>
              设置为0表示不限制
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存配置
                </Button>
                <Button onClick={() => globalRulesForm.resetFields()}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  const tabItems = [
    {
      key: 'grid',
      label: (
        <span>
          <AppstoreOutlined />
          九宫格配置
        </span>
      ),
      children: renderGridConfig(),
    },
    {
      key: 'documents',
      label: (
        <span>
          <FileTextOutlined />
          文档维护
        </span>
      ),
      children: renderDocumentMaintenance(),
    },
    {
      key: 'globalRules',
      label: (
        <span>
          <ControlOutlined />
          全局规则配置
        </span>
      ),
      children: renderGlobalRulesConfig(),
    },
  ];

  return (
    <div className="personal-center-config-container">
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
      {renderDocumentModal()}
      {renderVersionModal()}
    </div>
  );
};

export default PersonalCenterConfig;