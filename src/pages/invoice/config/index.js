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

// 模拟数据导入
import configData from '../../../mock/invoice/systemConfig.json';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ConfigManagement = () => {
  const [stationForm] = Form.useForm();
  const [paramForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [oilStationConfigs, setOilStationConfigs] = useState([]);
  const [taxRateConfigs, setTaxRateConfigs] = useState([]);
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
      setTaxRateConfigs(configData.taxRateConfigs.map(item => ({ ...item, key: item.id })));
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
      title: '税率',
      dataIndex: 'taxRate',
      width: 80,
      align: 'center',
      render: (value) => `${(value * 100).toFixed(0)}%`
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

  // 税率配置表格列定义
  const taxRateColumns = [
    {
      title: '产品类型',
      dataIndex: 'productType',
      width: 120
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      width: 100,
      align: 'center',
      render: (value) => `${(value * 100).toFixed(0)}%`
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === '生效中' ? 'green' : 'gray'}>
          {text}
        </Tag>
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
          <Descriptions.Item label="税率">{(selectedConfig.taxRate * 100).toFixed(0)}%</Descriptions.Item>
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
            name="taxRate"
            label="税率"
            rules={[{ required: true, message: '请选择税率' }]}
          >
            <Select placeholder="请选择税率">
              <Option value={0.13}>13%</Option>
              <Option value={0.09}>9%</Option>
              <Option value={0.06}>6%</Option>
            </Select>
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

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="油站配置" key="oilStation">
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
        </TabPane>

        <TabPane tab="税率配置" key="taxRate">
          <Card title="税率配置管理">
            <Table
              columns={taxRateColumns}
              dataSource={taxRateConfigs}
              loading={loading}
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="服务商配置" key="provider">
          <Card title="开票服务商配置">
            <Table
              columns={providerColumns}
              dataSource={invoiceProviders}
              loading={loading}
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="系统参数" key="parameter">
          <Card title="系统参数配置">
            <Table
              columns={parameterColumns}
              dataSource={systemParameters}
              loading={loading}
              scroll={{ x: 'max-content' }}
              size="middle"
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ConfigManagement;