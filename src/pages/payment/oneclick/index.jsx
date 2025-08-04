import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Switch, Modal, Space, InputNumber, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import './index.css';

const OneclickConfig = () => {
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
        id: 'STATION001',
        stationName: '江西交投加油站001',
        stationCode: 'JXT001',
        enabled: true,
        maxAmount: 500,
        minAmount: 50,
        dailyLimit: 2000,
        monthlyLimit: 10000,
        defaultAmount: 200,
        paymentTimeout: 30,
        updateTime: '2025-01-20 14:20:00'
      },
      {
        id: 'STATION002',
        stationName: '江西交投加油站002',
        stationCode: 'JXT002',
        enabled: false,
        maxAmount: 300,
        minAmount: 30,
        dailyLimit: 1500,
        monthlyLimit: 8000,
        defaultAmount: 150,
        paymentTimeout: 25,
        updateTime: '2025-01-19 16:45:00'
      },
      {
        id: 'STATION003',
        stationName: '江西交投加油站003',
        stationCode: 'JXT003',
        enabled: true,
        maxAmount: 600,
        minAmount: 60,
        dailyLimit: 2500,
        monthlyLimit: 12000,
        defaultAmount: 250,
        paymentTimeout: 35,
        updateTime: '2025-01-18 10:30:00'
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
      content: `确定要删除加油站"${record.stationName}"的一键加油配置吗？`,
      onOk: () => {
        setDataSource(prev => prev.filter(item => item.id !== record.id));
        message.success('删除成功');
      }
    });
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (editingRecord) {
        setDataSource(prev => prev.map(item => 
          item.id === editingRecord.id 
            ? { ...item, ...values, updateTime: new Date().toLocaleString() }
            : item
        ));
        message.success('更新成功');
      } else {
        const newRecord = {
          id: `STATION${String(Date.now()).slice(-3)}`,
          ...values,
          updateTime: new Date().toLocaleString()
        };
        setDataSource(prev => [...prev, newRecord]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (record) => {
    setDataSource(prev => prev.map(item => 
      item.id === record.id 
        ? { 
            ...item, 
            enabled: !item.enabled,
            updateTime: new Date().toLocaleString()
          }
        : item
    ));
    message.success(`${record.stationName}的一键加油功能已${record.enabled ? '禁用' : '启用'}`);
  };

  const columns = [
    {
      title: '加油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 200,
    },
    {
      title: '站点编码',
      dataIndex: 'stationCode',
      key: 'stationCode',
      width: 120,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 120,
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
      title: '默认金额(元)',
      dataIndex: 'defaultAmount',
      key: 'defaultAmount',
      width: 120,
    },
    {
      title: '最小金额(元)',
      dataIndex: 'minAmount',
      key: 'minAmount',
      width: 120,
    },
    {
      title: '最大金额(元)',
      dataIndex: 'maxAmount',
      key: 'maxAmount',
      width: 120,
    },
    {
      title: '每日限额(元)',
      dataIndex: 'dailyLimit',
      key: 'dailyLimit',
      width: 120,
    },
    {
      title: '每月限额(元)',
      dataIndex: 'monthlyLimit',
      key: 'monthlyLimit',
      width: 120,
    },
    {
      title: '超时时间(秒)',
      dataIndex: 'paymentTimeout',
      key: 'paymentTimeout',
      width: 120,
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
    <div className="oneclick-config-container">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增加油站配置
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingRecord ? '编辑一键加油配置' : '新增一键加油配置'}
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
            name="stationName"
            label="加油站名称"
            rules={[{ required: true, message: '请输入加油站名称' }]}
          >
            <Input placeholder="请输入加油站名称" />
          </Form.Item>

          <Form.Item
            name="stationCode"
            label="站点编码"
            rules={[{ required: true, message: '请输入站点编码' }]}
          >
            <Input placeholder="请输入站点编码" />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用一键加油"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="defaultAmount"
              label="默认加油金额(元)"
              rules={[{ required: true, message: '请输入默认加油金额' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={2000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="minAmount"
              label="最小加油金额(元)"
              rules={[{ required: true, message: '请输入最小加油金额' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={1000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="maxAmount"
              label="最大加油金额(元)"
              rules={[{ required: true, message: '请输入最大加油金额' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={5000} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="dailyLimit"
              label="每日限额(元)"
              rules={[{ required: true, message: '请输入每日限额' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={10000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="monthlyLimit"
              label="每月限额(元)"
              rules={[{ required: true, message: '请输入每月限额' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={50000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="paymentTimeout"
              label="支付超时(秒)"
              rules={[{ required: true, message: '请输入支付超时时间' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={10} max={300} style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OneclickConfig;