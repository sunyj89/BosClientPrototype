import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Switch, Modal, Space, Select, InputNumber, Divider, Tag, Badge, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;

const PaymentMethods = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockData = [
      {
        id: 'PAY001',
        methodName: '微信支付',
        methodType: 'wechat',
        enabled: true,
        priority: 1,
        feeRate: 0.6,
        merchantId: 'WX123456789',
        apiKey: 'wx_api_key_***',
        notifyUrl: 'https://api.example.com/notify/wechat',
        status: 'active',
        createTime: '2025-01-15 10:30:00',
        updateTime: '2025-01-20 14:20:00'
      },
      {
        id: 'PAY002',
        methodName: '支付宝',
        methodType: 'alipay',
        enabled: true,
        priority: 2,
        feeRate: 0.6,
        merchantId: 'AL987654321',
        apiKey: 'alipay_api_key_***',
        notifyUrl: 'https://api.example.com/notify/alipay',
        status: 'active',
        createTime: '2025-01-15 10:35:00',
        updateTime: '2025-01-20 14:25:00'
      },
      {
        id: 'PAY003',
        methodName: '银联云闪付',
        methodType: 'unionpay',
        enabled: false,
        priority: 3,
        feeRate: 0.5,
        merchantId: 'UP555666777',
        apiKey: 'unionpay_api_key_***',
        notifyUrl: 'https://api.example.com/notify/unionpay',
        status: 'inactive',
        createTime: '2025-01-16 09:15:00',
        updateTime: '2025-01-18 16:45:00'
      }
    ];
    setDataSource(mockData);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除支付方式"${record.methodName}"吗？`,
      onOk: () => {
        setDataSource(prev => prev.filter(item => item.id !== record.id));
        message.success('删除成功');
      }
    });
  };

  const handleSave = async (values) => {
    try {
      if (editingRecord) {
        setDataSource(prev => prev.map(item => 
          item.id === editingRecord.id 
            ? { ...item, ...values, updateTime: new Date().toLocaleString() }
            : item
        ));
        message.success('更新成功');
      } else {
        const newRecord = {
          id: `PAY${String(Date.now()).slice(-3)}`,
          ...values,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        };
        setDataSource(prev => [...prev, newRecord]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleStatusToggle = (record) => {
    setDataSource(prev => prev.map(item => 
      item.id === record.id 
        ? { 
            ...item, 
            enabled: !item.enabled,
            status: !item.enabled ? 'active' : 'inactive',
            updateTime: new Date().toLocaleString()
          }
        : item
    ));
    message.success(`${record.methodName}已${record.enabled ? '禁用' : '启用'}`);
  };

  const columns = [
    {
      title: '支付方式',
      dataIndex: 'methodName',
      key: 'methodName',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'methodType',
      key: 'methodType',
      width: 120,
      render: (type) => {
        const typeMap = {
          wechat: { text: '微信支付', color: 'green' },
          alipay: { text: '支付宝', color: 'blue' },
          unionpay: { text: '银联', color: 'orange' }
        };
        const config = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: '费率(%)',
      dataIndex: 'feeRate',
      key: 'feeRate',
      width: 100,
      render: (rate) => `${rate}%`,
    },
    {
      title: '商户号',
      dataIndex: 'merchantId',
      key: 'merchantId',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled, record) => (
        <Switch 
          checked={enabled} 
          onChange={() => handleStatusToggle(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
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
    <div className="payment-methods-container">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增支付方式
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingRecord ? '编辑支付方式' : '新增支付方式'}
        open={modalVisible}
        width={600}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="methodName"
            label="支付方式名称"
            rules={[{ required: true, message: '请输入支付方式名称' }]}
          >
            <Input placeholder="请输入支付方式名称" />
          </Form.Item>

          <Form.Item
            name="methodType"
            label="支付类型"
            rules={[{ required: true, message: '请选择支付类型' }]}
          >
            <Select placeholder="请选择支付类型">
              <Option value="wechat">微信支付</Option>
              <Option value="alipay">支付宝</Option>
              <Option value="unionpay">银联云闪付</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请输入优先级' }]}
          >
            <InputNumber min={1} max={99} placeholder="数字越小优先级越高" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="feeRate"
            label="费率(%)"
            rules={[{ required: true, message: '请输入费率' }]}
          >
            <InputNumber min={0} max={10} step={0.1} placeholder="请输入费率" style={{ width: '100%' }} />
          </Form.Item>

          <Divider orientation="left">接口配置</Divider>

          <Form.Item
            name="merchantId"
            label="商户号"
            rules={[{ required: true, message: '请输入商户号' }]}
          >
            <Input placeholder="请输入商户号" />
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API密钥"
            rules={[{ required: true, message: '请输入API密钥' }]}
          >
            <Input.Password placeholder="请输入API密钥" />
          </Form.Item>

          <Form.Item
            name="notifyUrl"
            label="回调地址"
            rules={[
              { required: true, message: '请输入回调地址' },
              { type: 'url', message: '请输入有效的URL地址' }
            ]}
          >
            <Input placeholder="请输入回调地址" />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentMethods;