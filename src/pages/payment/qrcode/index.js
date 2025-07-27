import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Switch, Modal, Space, Select, Upload, Row, Col, Tag, message, QRCode, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, UploadOutlined, QrcodeOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;

const QRCodeConfig = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockData = [
      {
        id: 'QR001',
        name: '微信收款码',
        type: 'wechat',
        paymentType: 'wechat',
        qrContent: 'wxp://f2f0QO7a1A2B3C4D5E6F',
        status: 'active',
        enabled: true,
        displayName: '微信支付',
        logoUrl: '/images/wechat-logo.png',
        backgroundColor: '#07C160',
        textColor: '#FFFFFF',
        createTime: '2025-01-15 10:30:00',
        updateTime: '2025-01-20 14:20:00'
      },
      {
        id: 'QR002',
        name: '支付宝收款码',
        type: 'alipay',
        paymentType: 'alipay',
        qrContent: 'https://qr.alipay.com/fkx123456789',
        status: 'active',
        enabled: true,
        displayName: '支付宝',
        logoUrl: '/images/alipay-logo.png',
        backgroundColor: '#1677FF',
        textColor: '#FFFFFF',
        createTime: '2025-01-15 10:35:00',
        updateTime: '2025-01-20 14:25:00'
      },
      {
        id: 'QR003',
        name: '银联收款码',
        type: 'unionpay',
        paymentType: 'unionpay',
        qrContent: 'unionpay://pay?merchantId=123456789',
        status: 'inactive',
        enabled: false,
        displayName: '银联支付',
        logoUrl: '/images/unionpay-logo.png',
        backgroundColor: '#E60012',
        textColor: '#FFFFFF',
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

  const handlePreview = (record) => {
    setPreviewRecord(record);
    setPreviewModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除收款码"${record.name}"吗？`,
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
          id: `QR${String(Date.now()).slice(-3)}`,
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
    message.success(`${record.name}已${record.enabled ? '禁用' : '启用'}`);
  };

  const handleDownloadQR = (record) => {
    // 模拟下载二维码
    message.success(`正在下载 ${record.name} 二维码`);
  };

  const uploadProps = {
    name: 'logo',
    action: '/api/upload',
    listType: 'picture-card',
    maxCount: 1,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB');
      }
      return isJpgOrPng && isLt2M;
    },
  };

  const columns = [
    {
      title: '收款码名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '支付类型',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 120,
      render: (type) => {
        const typeMap = {
          wechat: { text: '微信支付', color: 'green' },
          alipay: { text: '支付宝', color: 'blue' },
          unionpay: { text: '银联支付', color: 'orange' }
        };
        const config = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      width: 120,
    },
    {
      title: '二维码内容',
      dataIndex: 'qrContent',
      key: 'qrContent',
      width: 200,
      render: (content) => (
        <div style={{ 
          maxWidth: '180px', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap' 
        }}>
          {content}
        </div>
      )
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
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
            预览
          </Button>
          <Button type="primary" size="small" icon={<DownloadOutlined />} onClick={() => handleDownloadQR(record)}>
            下载
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
    <div className="qrcode-config-container">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增收款码
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
        title={editingRecord ? '编辑收款码' : '新增收款码'}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="收款码名称"
                rules={[{ required: true, message: '请输入收款码名称' }]}
              >
                <Input placeholder="请输入收款码名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentType"
                label="支付类型"
                rules={[{ required: true, message: '请选择支付类型' }]}
              >
                <Select placeholder="请选择支付类型">
                  <Option value="wechat">微信支付</Option>
                  <Option value="alipay">支付宝</Option>
                  <Option value="unionpay">银联支付</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="displayName"
                label="显示名称"
                rules={[{ required: true, message: '请输入显示名称' }]}
              >
                <Input placeholder="请输入显示名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="backgroundColor"
                label="背景颜色"
                rules={[{ required: true, message: '请选择背景颜色' }]}
              >
                <Input type="color" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="qrContent"
            label="二维码内容"
            rules={[{ required: true, message: '请输入二维码内容' }]}
          >
            <TextArea rows={3} placeholder="请输入二维码内容或链接" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="textColor"
                label="文字颜色"
                rules={[{ required: true, message: '请选择文字颜色' }]}
              >
                <Input type="color" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enabled"
                label="启用状态"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="logoUrl" label="支付图标">
            <Upload {...uploadProps}>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图标</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预览弹窗 */}
      <Modal
        title="二维码预览"
        open={previewModalVisible}
        width={500}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => handleDownloadQR(previewRecord)}>
            下载二维码
          </Button>,
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {previewRecord && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ marginBottom: 20 }}>
              <QRCode 
                value={previewRecord.qrContent} 
                size={200}
                color={previewRecord.textColor || '#000000'}
                backgroundColor={previewRecord.backgroundColor || '#FFFFFF'}
              />
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: previewRecord.textColor || '#000000',
              backgroundColor: previewRecord.backgroundColor || '#FFFFFF',
              padding: '10px',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              {previewRecord.displayName}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QRCodeConfig;