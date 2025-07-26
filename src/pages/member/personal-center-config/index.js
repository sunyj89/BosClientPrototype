import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip, Switch, Upload, ColorPicker, InputNumber, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, SettingOutlined, BgColorsOutlined, PhoneOutlined, AppstoreOutlined, FileTextOutlined, SafetyOutlined, CreditCardOutlined, ShareAltOutlined, PictureOutlined, UploadOutlined, DragOutlined } from '@ant-design/icons';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const PersonalCenterConfig = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const [appearanceForm] = Form.useForm();
  const [gridForm] = Form.useForm();
  const [privacyForm] = Form.useForm();
  const [agreementForm] = Form.useForm();
  const [cardForm] = Form.useForm();
  const [shareForm] = Form.useForm();
  const [bannerForm] = Form.useForm();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentVersions, setCurrentVersions] = useState([]);

  // 外观配置数据
  const [appearanceConfig, setAppearanceConfig] = useState({});
  // 九宫格配置数据
  const [gridConfig, setGridConfig] = useState([]);
  // 文档数据
  const [documentsData, setDocumentsData] = useState({});
  // Banner数据
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 外观配置模拟数据
    const mockAppearanceConfig = {
      backgroundColor: '#f0f2f5',
      backgroundImage: null,
      useBackgroundImage: false,
      hidePhoneNumbers: true
    };

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

    // Banner数据模拟
    const mockBannerData = [
      {
        id: 'BANNER001',
        title: '春节优惠活动',
        imageUrl: '/images/banner1.jpg',
        linkUrl: '/activities/spring-festival',
        sortOrder: 1,
        enabled: true,
        startTime: '2025-01-20 00:00:00',
        endTime: '2025-02-20 23:59:59',
        createTime: '2025-01-15 10:30:00'
      },
      {
        id: 'BANNER002',
        title: '会员福利升级',
        imageUrl: '/images/banner2.jpg',
        linkUrl: '/member/benefits',
        sortOrder: 2,
        enabled: true,
        startTime: '2025-01-01 00:00:00',
        endTime: '2025-12-31 23:59:59',
        createTime: '2024-12-25 14:20:00'
      },
      {
        id: 'BANNER003',
        title: '新用户专享',
        imageUrl: '/images/banner3.jpg',
        linkUrl: '/newuser/gift',
        sortOrder: 3,
        enabled: false,
        startTime: '2025-01-10 00:00:00',
        endTime: '2025-01-31 23:59:59',
        createTime: '2025-01-08 16:45:00'
      }
    ];

    setAppearanceConfig(mockAppearanceConfig);
    setGridConfig(mockGridConfig);
    setDocumentsData(mockDocumentsData);
    setBannerData(mockBannerData);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSaveAppearance = (values) => {
    console.log('保存外观配置:', values);
    setAppearanceConfig({ ...appearanceConfig, ...values });
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

  const handleSaveBanner = (values) => {
    console.log('保存Banner配置:', values);
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

  // 渲染外观配置tab
  const renderAppearanceConfig = () => (
    <div>
      <Card title="背景设置" style={{ marginBottom: 16 }}>
        <Form form={appearanceForm} layout="vertical" onFinish={handleSaveAppearance} initialValues={appearanceConfig}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="useBackgroundImage" label="背景类型" valuePropName="checked">
                <Switch checkedChildren="使用图片" unCheckedChildren="使用颜色" />
              </Form.Item>
              <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.useBackgroundImage !== currentValues.useBackgroundImage}>
                {({ getFieldValue }) => {
                  const useImage = getFieldValue('useBackgroundImage');
                  return useImage ? (
                    <Form.Item name="backgroundImage" label="背景图片">
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        accept="image/*"
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>上传图片</div>
                        </div>
                      </Upload>
                    </Form.Item>
                  ) : (
                    <Form.Item name="backgroundColor" label="背景颜色">
                      <ColorPicker showText />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ padding: '20px', border: '1px dashed #d9d9d9', borderRadius: '6px' }}>
                <h4>预览效果</h4>
                <div style={{ 
                  width: '200px', 
                  height: '120px', 
                  background: appearanceConfig.useBackgroundImage ? `url(${appearanceConfig.backgroundImage}) center/cover` : appearanceConfig.backgroundColor,
                  borderRadius: '4px',
                  border: '1px solid #d9d9d9'
                }}>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="隐私设置">
        <Form layout="vertical">
          <Form.Item name="hidePhoneNumbers" label="手机号显示" valuePropName="checked" initialValue={appearanceConfig.hidePhoneNumbers}>
            <Switch checkedChildren="隐藏中间4位" unCheckedChildren="完整显示" />
          </Form.Item>
          <Form.Item>
            <div style={{ color: '#666', fontSize: '12px' }}>
              开启后，用户的手机号将显示为 "138****5678" 格式
            </div>
          </Form.Item>
        </Form>
        
        <div style={{ marginTop: '24px' }}>
          <Button type="primary" onClick={() => appearanceForm.submit()}>
            保存配置
          </Button>
        </div>
      </Card>
    </div>
  );

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

  // 渲染Banner配置tab
  const renderBannerConfig = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增Banner
          </Button>
          <Button>批量操作</Button>
          <div style={{ marginLeft: '16px', color: '#666' }}>
            拖拽行可调整显示顺序
          </div>
        </Space>
      </Card>

      <Card>
        <Table
          columns={bannerColumns}
          dataSource={bannerData}
          rowKey="id"
          pagination={{
            total: bannerData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
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

  const tabItems = [
    {
      key: 'appearance',
      label: (
        <span>
          <BgColorsOutlined />
          外观配置
        </span>
      ),
      children: renderAppearanceConfig(),
    },
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
      key: 'banner',
      label: (
        <span>
          <PictureOutlined />
          Banner配置
        </span>
      ),
      children: renderBannerConfig(),
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