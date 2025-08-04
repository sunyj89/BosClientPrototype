import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Switch, Modal, Space, Select, InputNumber, Tag, Descriptions, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;

const SettlementChannel = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockData = [
      {
        id: 'SETTLE001',
        channelName: '微信支付结算',
        channelCode: 'WECHAT_SETTLE',
        bankName: '江西银行',
        accountName: '江西交投化石能源有限公司',
        accountNumber: '1234567890123456789',
        settleCycle: 'T+1',
        feeRate: 0.6,
        enabled: true,
        status: 'active',
        remark: '微信支付T+1结算通道',
        createTime: '2025-01-15 10:30:00',
        updateTime: '2025-01-20 14:20:00'
      },
      {
        id: 'SETTLE002',
        channelName: '支付宝结算',
        channelCode: 'ALIPAY_SETTLE',
        bankName: '江西银行',
        accountName: '江西交投化石能源有限公司',
        accountNumber: '9876543210987654321',
        settleCycle: 'T+1',
        feeRate: 0.6,
        enabled: true,
        status: 'active',
        remark: '支付宝T+1结算通道',
        createTime: '2025-01-15 10:35:00',
        updateTime: '2025-01-20 14:25:00'
      },
      {
        id: 'SETTLE003',
        channelName: '银联结算',
        channelCode: 'UNIONPAY_SETTLE',
        bankName: '江西银行',
        accountName: '江西交投化石能源有限公司',
        accountNumber: '5555666677778888999',
        settleCycle: 'T+0',
        feeRate: 0.5,
        enabled: false,
        status: 'inactive',
        remark: '银联T+0实时结算通道',
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

  const handleView = (record) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除结算通道"${record.channelName}"吗？`,
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
          id: `SETTLE${String(Date.now()).slice(-3)}`,
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
    message.success(`${record.channelName}已${record.enabled ? '禁用' : '启用'}`);
  };

  const columns = [
    {
      title: '通道名称',
      dataIndex: 'channelName',
      key: 'channelName',
      width: 150,
    },
    {
      title: '通道编码',
      dataIndex: 'channelCode',
      key: 'channelCode',
      width: 150,
    },
    {
      title: '结算银行',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 120,
    },
    {
      title: '结算周期',
      dataIndex: 'settleCycle',
      key: 'settleCycle',
      width: 100,
      render: (cycle) => {
        const colorMap = {
          'T+0': 'green',
          'T+1': 'blue',
          'T+2': 'orange'
        };
        return <Tag color={colorMap[cycle] || 'default'}>{cycle}</Tag>;
      }
    },
    {
      title: '费率(%)',
      dataIndex: 'feeRate',
      key: 'feeRate',
      width: 100,
      render: (rate) => `${rate}%`,
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
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
    <div className="settlement-channel-container">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增结算通道
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑结算通道' : '新增结算通道'}
        open={modalVisible}
        width={700}
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
            name="channelName"
            label="通道名称"
            rules={[{ required: true, message: '请输入通道名称' }]}
          >
            <Input placeholder="请输入通道名称" />
          </Form.Item>

          <Form.Item
            name="channelCode"
            label="通道编码"
            rules={[{ required: true, message: '请输入通道编码' }]}
          >
            <Input placeholder="请输入通道编码" />
          </Form.Item>

          <Form.Item
            name="bankName"
            label="结算银行"
            rules={[{ required: true, message: '请选择结算银行' }]}
          >
            <Select placeholder="请选择结算银行">
              <Option value="江西银行">江西银行</Option>
              <Option value="江西银行">江西银行</Option>
              <Option value="江西银行">江西银行</Option>
              <Option value="中国银行">中国银行</Option>
              <Option value="招商银行">招商银行</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="accountName"
            label="账户名称"
            rules={[{ required: true, message: '请输入账户名称' }]}
          >
            <Input placeholder="请输入账户名称" />
          </Form.Item>

          <Form.Item
            name="accountNumber"
            label="银行账号"
            rules={[{ required: true, message: '请输入银行账号' }]}
          >
            <Input placeholder="请输入银行账号" />
          </Form.Item>

          <Form.Item
            name="settleCycle"
            label="结算周期"
            rules={[{ required: true, message: '请选择结算周期' }]}
          >
            <Select placeholder="请选择结算周期">
              <Option value="T+0">T+0（实时到账）</Option>
              <Option value="T+1">T+1（次日到账）</Option>
              <Option value="T+2">T+2（2个工作日到账）</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="feeRate"
            label="手续费率(%)"
            rules={[{ required: true, message: '请输入手续费率' }]}
          >
            <InputNumber min={0} max={10} step={0.1} placeholder="请输入手续费率" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注说明"
          >
            <TextArea rows={3} placeholder="请输入备注说明" />
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

      {/* 详情查看弹窗 */}
      <Modal
        title="结算通道详情"
        open={detailModalVisible}
        width={600}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {viewingRecord && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="通道名称" span={2}>{viewingRecord.channelName}</Descriptions.Item>
            <Descriptions.Item label="通道编码">{viewingRecord.channelCode}</Descriptions.Item>
            <Descriptions.Item label="结算周期">{viewingRecord.settleCycle}</Descriptions.Item>
            <Descriptions.Item label="结算银行">{viewingRecord.bankName}</Descriptions.Item>
            <Descriptions.Item label="手续费率">{viewingRecord.feeRate}%</Descriptions.Item>
            <Descriptions.Item label="账户名称" span={2}>{viewingRecord.accountName}</Descriptions.Item>
            <Descriptions.Item label="银行账号" span={2}>{viewingRecord.accountNumber}</Descriptions.Item>
            <Descriptions.Item label="启用状态">
              <Tag color={viewingRecord.enabled ? 'green' : 'red'}>
                {viewingRecord.enabled ? '启用' : '禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{viewingRecord.createTime}</Descriptions.Item>
            <Descriptions.Item label="备注说明" span={2}>{viewingRecord.remark || '无'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SettlementChannel;