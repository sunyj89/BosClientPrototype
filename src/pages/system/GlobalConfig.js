import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Space, 
  message,
  Spin,
  Tag,
  Tooltip
} from 'antd';
import './GlobalConfig.css';
import { 
  SettingOutlined, 
  EditOutlined, 
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const GlobalConfig = () => {
  const [loading, setLoading] = useState(false);
  const [configList, setConfigList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 加载配置数据
  useEffect(() => {
    loadConfigData();
  }, []);

  const loadConfigData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const response = await fetch('/api/system/global-config');
      if (response.ok) {
        const data = await response.json();
        setConfigList(data);
      } else {
        // 使用模拟数据
        const mockData = await import('../../mock/system/globalConfigData.json');
        setConfigList(mockData.default);
      }
    } catch (error) {
      // 使用模拟数据
      const mockData = await import('../../mock/system/globalConfigData.json');
      setConfigList(mockData.default);
    } finally {
      setLoading(false);
    }
  };

  // 打开编辑弹窗
  const handleEdit = (record) => {
    setEditingConfig(record);
    form.setFieldsValue({
      ...record,
      value: record.type === 'boolean' ? record.value === 'true' : record.value
    });
    setModalVisible(true);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingConfig(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 保存配置
  const handleSave = async (values) => {
    try {
      setLoading(true);
      
      // 处理布尔值类型
      if (values.type === 'boolean') {
        values.value = values.value ? 'true' : 'false';
      }

      const configData = {
        ...values,
        id: editingConfig ? editingConfig.id : Date.now().toString(),
        updateTime: new Date().toISOString().split('T')[0]
      };

      if (editingConfig) {
        // 更新配置
        const updatedList = configList.map(item => 
          item.id === editingConfig.id ? configData : item
        );
        setConfigList(updatedList);
        message.success('配置更新成功');
      } else {
        // 新增配置
        setConfigList([...configList, configData]);
        message.success('配置添加成功');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索配置
  const handleSearch = (values) => {
    // 这里可以实现搜索逻辑
    console.log('搜索条件:', values);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    loadConfigData();
  };

  // 表格列定义
  const columns = [
    {
      title: '配置项名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.key}</div>
        </div>
      )
    },
    {
      title: '配置值',
      dataIndex: 'value',
      key: 'value',
      width: 150,
      render: (text, record) => {
        if (record.type === 'boolean') {
          return (
            <Tag color={text === 'true' ? 'green' : 'red'}>
              {text === 'true' ? '是' : '否'}
            </Tag>
          );
        }
        if (record.type === 'select') {
          const option = record.options?.find(opt => opt.value === text);
          return <Tag color="blue">{option?.label || text}</Tag>;
        }
        return text;
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text) => {
        const typeMap = {
          'string': '文本',
          'number': '数字',
          'boolean': '开关',
          'select': '选择',
          'textarea': '多行文本'
        };
        return <Tag>{typeMap[text] || text}</Tag>;
      }
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (text) => <Tag color="purple">{text}</Tag>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
      sorter: (a, b) => new Date(a.updateTime) - new Date(b.updateTime)
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="global-config-container">
      <Card>
        <Spin spinning={loading}>
          {/* 搜索表单 */}
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="name">
              <Input placeholder="配置项名称" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="category">
              <Select placeholder="配置分类" style={{ width: 150 }} allowClear>
                <Option value="business">业务配置</Option>
                <Option value="system">系统配置</Option>
                <Option value="notification">通知配置</Option>
              </Select>
            </Form.Item>
            <Form.Item name="type">
              <Select placeholder="配置类型" style={{ width: 120 }} allowClear>
                <Option value="string">文本</Option>
                <Option value="number">数字</Option>
                <Option value="boolean">开关</Option>
                <Option value="select">选择</Option>
                <Option value="textarea">多行文本</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新建配置
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {/* 配置列表表格 */}
          <Table
            columns={columns}
            dataSource={configList}
            rowKey="id"
            pagination={{
              total: configList.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
            }}
            scroll={{ x: 'max-content' }}
          />
        </Spin>
      </Card>

      {/* 编辑/新增弹窗 */}
      <Modal
        title={editingConfig ? '编辑配置' : '新增配置'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="配置项名称"
            rules={[{ required: true, message: '请输入配置项名称' }]}
          >
            <Input placeholder="请输入配置项名称" />
          </Form.Item>

          <Form.Item
            name="key"
            label="配置项键值"
            rules={[{ required: true, message: '请输入配置项键值' }]}
          >
            <Input placeholder="请输入配置项键值（英文）" />
          </Form.Item>

          <Form.Item
            name="category"
            label="配置分类"
            rules={[{ required: true, message: '请选择配置分类' }]}
          >
            <Select placeholder="请选择配置分类">
              <Option value="business">业务配置</Option>
              <Option value="system">系统配置</Option>
              <Option value="notification">通知配置</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="配置类型"
            rules={[{ required: true, message: '请选择配置类型' }]}
          >
            <Select placeholder="请选择配置类型">
              <Option value="string">文本</Option>
              <Option value="number">数字</Option>
              <Option value="boolean">开关</Option>
              <Option value="select">选择</Option>
              <Option value="textarea">多行文本</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              
              if (type === 'boolean') {
                return (
                  <Form.Item
                    name="value"
                    label="配置值"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                );
              }
              
              if (type === 'select') {
                return (
                  <>
                    <Form.Item
                      name="value"
                      label="配置值"
                      rules={[{ required: true, message: '请选择配置值' }]}
                    >
                      <Select placeholder="请选择配置值">
                        <Option value="manual">手工确认</Option>
                        <Option value="auto">自动确认</Option>
                      </Select>
                    </Form.Item>
                  </>
                );
              }
              
              if (type === 'textarea') {
                return (
                  <Form.Item
                    name="value"
                    label="配置值"
                    rules={[{ required: true, message: '请输入配置值' }]}
                  >
                    <TextArea rows={4} placeholder="请输入配置值" />
                  </Form.Item>
                );
              }
              
              return (
                <Form.Item
                  name="value"
                  label="配置值"
                  rules={[{ required: true, message: '请输入配置值' }]}
                >
                  <Input placeholder="请输入配置值" />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            name="description"
            label="配置描述"
            rules={[{ required: true, message: '请输入配置描述' }]}
          >
            <TextArea rows={3} placeholder="请输入配置描述" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GlobalConfig; 