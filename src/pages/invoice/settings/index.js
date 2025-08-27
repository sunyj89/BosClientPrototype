import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Form, 
  Input, 
  InputNumber,
  Select, 
  Button, 
  Space, 
  message, 
  Modal, 
  Tag,
  Descriptions,
  Tabs,
  Switch,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons';

// 导入修改记录组件
import RecordHistory from '../shared/RecordHistory';

// 模拟数据导入
import configData from '../../../mock/invoice/systemConfig.json';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;

const InvoiceSettings = () => {
  const [stationForm] = Form.useForm();
  const [paramForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [oilStationConfigs, setOilStationConfigs] = useState([]);
  const [invoiceProviders, setInvoiceProviders] = useState([]);
  const [systemParameters, setSystemParameters] = useState([]);
  const [activeTab, setActiveTab] = useState('oilStation');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit' | 'view'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOilStationConfigs(configData.oilStationConfigs.map(item => ({ ...item, key: item.id })));
      setInvoiceProviders(configData.invoiceProviders.map(item => ({ ...item, key: item.id })));
      setSystemParameters(configData.systemParameters.map(item => ({ ...item, key: item.id })));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    await loadData();
    message.success('查询完成');
  };

  const handleReset = () => {
    stationForm.resetFields();
    loadData();
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedConfig(null);
    if (activeTab === 'oilStation') {
      stationForm.resetFields();
    }
    setConfigModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedConfig(record);
    if (activeTab === 'oilStation') {
      stationForm.setFieldsValue(record);
    }
    setConfigModalVisible(true);
  };

  const handleView = (record) => {
    setModalType('view');
    setSelectedConfig(record);
    setConfigModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这个配置吗？`,
      okType: 'danger',
      onOk: async () => {
        try {
          message.loading('正在删除...', 1);
          await new Promise(resolve => setTimeout(resolve, 1000));
          message.success('删除成功');
          loadData();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleConfigSave = async () => {
    try {
      if (activeTab === 'oilStation') {
        const values = await stationForm.validateFields();
        console.log('保存配置:', values);
      }
      
      message.loading('正在保存...', 2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('保存成功');
      setConfigModalVisible(false);
      loadData();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 油站配置表格列定义
  const stationColumns = [
    {
      title: '油站名称',
      dataIndex: 'stationName',
      width: 180,
      ellipsis: true
    },
    {
      title: '油站代码',
      dataIndex: 'stationCode',
      width: 120
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      width: 200,
      ellipsis: true
    },
    {
      title: '税号',
      dataIndex: 'taxNo',
      width: 180,
      ellipsis: true
    },
    {
      title: '开票服务商',
      dataIndex: 'invoiceProvider',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (text) => (
        <Tag color={text === '启用' ? 'green' : 'red'}>
          {text}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 160
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
            onClick={() => handleView(record)}
            style={{ borderRadius: '2px' }}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            style={{ borderRadius: '2px' }}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 开票服务商表格列定义
  const providerColumns = [
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      width: 150
    },
    {
      title: '服务商代码',
      dataIndex: 'providerCode',
      width: 120
    },
    {
      title: 'API地址',
      dataIndex: 'apiUrl',
      width: 200,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === '启用' ? 'green' : 'red'}>
          {text}
        </Tag>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ borderRadius: '2px' }}
        >
          编辑
        </Button>
      )
    }
  ];

  // 系统参数表格列定义
  const parameterColumns = [
    {
      title: '参数名称',
      dataIndex: 'paramKey',
      width: 200
    },
    {
      title: '参数值',
      dataIndex: 'paramValue',
      width: 150
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 250,
      ellipsis: true
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ borderRadius: '2px' }}
        >
          编辑
        </Button>
      )
    }
  ];

  // 渲染油站配置弹窗
  const renderStationModal = () => (
    <Modal
      title={modalType === 'add' ? '新增油站配置' : modalType === 'edit' ? '编辑油站配置' : '查看油站配置'}
      open={configModalVisible}
      onCancel={() => setConfigModalVisible(false)}
      onOk={modalType !== 'view' ? handleConfigSave : undefined}
      width={800}
      style={{ borderRadius: '2px' }}
      footer={modalType === 'view' ? [
        <Button key="close" onClick={() => setConfigModalVisible(false)}>
          关闭
        </Button>
      ] : undefined}
    >
      {modalType === 'view' && selectedConfig ? (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="油站名称">{selectedConfig.stationName}</Descriptions.Item>
          <Descriptions.Item label="油站代码">{selectedConfig.stationCode}</Descriptions.Item>
          <Descriptions.Item label="公司名称" span={2}>{selectedConfig.companyName}</Descriptions.Item>
          <Descriptions.Item label="税号" span={2}>{selectedConfig.taxNo}</Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>{selectedConfig.address}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{selectedConfig.phone}</Descriptions.Item>
          <Descriptions.Item label="开户银行" span={2}>{selectedConfig.bankName}</Descriptions.Item>
          <Descriptions.Item label="银行账号" span={2}>{selectedConfig.bankAccount}</Descriptions.Item>
          <Descriptions.Item label="开票服务商">{selectedConfig.invoiceProvider}</Descriptions.Item>
          <Descriptions.Item label="状态">{selectedConfig.status}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Form
          form={stationForm}
          layout="vertical"
        >
          <Form.Item
            name="stationName"
            label="油站名称"
            rules={[{ required: true, message: '请输入油站名称' }]}
          >
            <Input placeholder="请输入油站名称" />
          </Form.Item>
          
          <Form.Item
            name="stationCode"
            label="油站代码"
            rules={[{ required: true, message: '请输入油站代码' }]}
          >
            <Input placeholder="请输入油站代码" />
          </Form.Item>
          
          <Form.Item
            name="companyName"
            label="公司名称"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          
          <Form.Item
            name="taxNo"
            label="税号"
            rules={[{ required: true, message: '请输入税号' }]}
          >
            <Input placeholder="请输入税号" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          
          <Form.Item
            name="bankName"
            label="开户银行"
            rules={[{ required: true, message: '请输入开户银行' }]}
          >
            <Input placeholder="请输入开户银行" />
          </Form.Item>
          
          <Form.Item
            name="bankAccount"
            label="银行账号"
            rules={[{ required: true, message: '请输入银行账号' }]}
          >
            <Input placeholder="请输入银行账号" />
          </Form.Item>
          
          <Form.Item
            name="invoiceProvider"
            label="开票服务商"
            rules={[{ required: true, message: '请选择开票服务商' }]}
          >
            <Select placeholder="请选择开票服务商">
              <Option value="百望云">百望云</Option>
              <Option value="航天信息">航天信息</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );

  const tabItems = [
    {
      key: 'oilStation',
      label: '油站配置',
      children: (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <Form 
              form={stationForm} 
              layout="inline" 
              onFinish={handleSearch}
              style={{ marginBottom: 16 }}
            >
              <Form.Item name="stationName" label="油站名称" style={{ width: 200 }}>
                <Input placeholder="请输入油站名称" />
              </Form.Item>
              
              <Form.Item name="status" label="状态" style={{ width: 120 }}>
                <Select placeholder="请选择" allowClear>
                  <Option value="启用">启用</Option>
                  <Option value="禁用">禁用</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                    style={{ borderRadius: '2px' }}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleReset}
                    style={{ borderRadius: '2px' }}
                  >
                    重置
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAdd}
                    style={{ borderRadius: '2px' }}
                  >
                    新增配置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          <Card title="油站开票配置">
            <Table
              columns={stationColumns}
              dataSource={oilStationConfigs}
              loading={loading}
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          </Card>

          {renderStationModal()}
        </div>
      )
    },
    {
      key: 'provider',
      label: '服务商设置',
      children: (
        <Card title="开票服务商配置">
          <Table
            columns={providerColumns}
            dataSource={invoiceProviders}
            loading={loading}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </Card>
      )
    },
    {
      key: 'parameter',
      label: '系统参数',
      children: (
        <Card title="系统参数配置">
          <Table
            columns={parameterColumns}
            dataSource={systemParameters}
            loading={loading}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </Card>
      )
    },
    {
      key: 'record-history',
      label: '修改记录',
      children: <RecordHistory moduleType="invoice-settings" />
    }
  ];

  return (
    <div className="invoice-settings-container">
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: '16px' }}
          items={tabItems}
        />
      </Card>
      
      {/* 页面备注信息 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f0f2f5',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666',
        borderLeft: '4px solid #1890ff'
      }}>
        <strong>功能说明：</strong>
        <br />1. 发票设置包含油站配置、服务商设置、系统参数等发票相关配置功能
        <br />2. 油站配置：管理各油站的开票基础信息，包括公司信息、税号、银行账户等
        <br />3. 服务商设置：管理开票服务商的配置信息，支持多服务商对接
        <br />4. 系统参数：管理发票系统的全局参数配置
        <br />5. 修改记录：记录所有配置变更的详细历史，便于审计和追溯
        <br />6. 演示时请重点展示配置管理的完整性和修改记录的追溯功能
      </div>
    </div>
  );
};

export default InvoiceSettings;