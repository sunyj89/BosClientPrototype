import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Switch, Button, Row, Col, Divider, InputNumber, Select, Space, message, Alert, Table, Tag } from 'antd';
import { SaveOutlined, ReloadOutlined, ApiOutlined, ExperimentOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;

const ContactlessConfig = () => {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [form] = Form.useForm();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [deviceList, setDeviceList] = useState([]);

  useEffect(() => {
    loadConfiguration();
    loadDeviceList();
  }, []);

  const loadConfiguration = () => {
    // 模拟加载配置数据
    const mockConfig = {
      enabled: true,
      serverHost: '192.168.1.100',
      serverPort: 8080,
      timeout: 30,
      retryCount: 3,
      heartbeatInterval: 60,
      protocol: 'TCP',
      encryption: true,
      encryptionKey: 'AES256_KEY_***',
      deviceId: 'DEVICE_001',
      stationCode: 'STATION_001',
      autoReconnect: true,
      logLevel: 'INFO',
      maxConnections: 10,
      bufferSize: 1024
    };
    
    form.setFieldsValue(mockConfig);
  };

  const loadDeviceList = () => {
    const mockDevices = [
      {
        id: 'DEV001',
        name: '加油机01',
        type: 'dispenser',
        status: 'online',
        ip: '192.168.1.101',
        lastHeartbeat: '2025-01-27 10:30:00'
      },
      {
        id: 'DEV002',
        name: '加油机02',
        type: 'dispenser',
        status: 'offline',
        ip: '192.168.1.102',
        lastHeartbeat: '2025-01-27 09:45:00'
      },
      {
        id: 'DEV003',
        name: '收银终端01',
        type: 'pos',
        status: 'online',
        ip: '192.168.1.103',
        lastHeartbeat: '2025-01-27 10:29:00'
      }
    ];
    setDeviceList(mockDevices);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // 模拟保存配置
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存配置:', values);
      message.success('通讯配置保存成功');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    loadConfiguration();
    message.info('已重置为默认配置');
  };

  const handleTestConnection = async () => {
    setTestLoading(true);
    try {
      // 模拟连接测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectionStatus('connected');
      message.success('连接测试成功');
    } catch (error) {
      setConnectionStatus('failed');
      message.error('连接测试失败');
    } finally {
      setTestLoading(false);
    }
  };

  const deviceColumns = [
    {
      title: '设备编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeMap = {
          dispenser: { text: '加油机', color: 'blue' },
          pos: { text: '收银终端', color: 'green' }
        };
        const config = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
    },
    {
      title: '连接状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'online' ? 'green' : 'red'}>
          {status === 'online' ? '在线' : '离线'}
        </Tag>
      )
    },
    {
      title: '最后心跳',
      dataIndex: 'lastHeartbeat',
      key: 'lastHeartbeat',
      width: 180,
    }
  ];

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'green';
      case 'failed': return 'red';
      default: return 'orange';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '已连接';
      case 'failed': return '连接失败';
      default: return '未连接';
    }
  };

  return (
    <div className="contactless-config-container">
      <Row gutter={16}>
        <Col span={16}>
          <Card title="无感支付通讯配置" extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={() => form.submit()}>
                保存配置
              </Button>
            </Space>
          }>
            <Alert
              message="无感支付通讯说明"
              description="无感支付通过与加油设备和收银系统的实时通讯，实现客户无需掏出手机即可完成支付的便捷体验。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
            >
              <Divider orientation="left">服务器配置</Divider>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="serverHost"
                    label="服务器地址"
                    rules={[{ required: true, message: '请输入服务器地址' }]}
                  >
                    <Input placeholder="请输入服务器IP地址" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="serverPort"
                    label="服务器端口"
                    rules={[{ required: true, message: '请输入服务器端口' }]}
                  >
                    <InputNumber min={1} max={65535} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name="protocol"
                    label="通讯协议"
                    rules={[{ required: true, message: '请选择通讯协议' }]}
                  >
                    <Select placeholder="请选择协议">
                      <Option value="TCP">TCP</Option>
                      <Option value="UDP">UDP</Option>
                      <Option value="HTTP">HTTP</Option>
                      <Option value="HTTPS">HTTPS</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="timeout"
                    label="超时时间(秒)"
                    rules={[{ required: true, message: '请输入超时时间' }]}
                  >
                    <InputNumber min={5} max={300} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="retryCount"
                    label="重试次数"
                    rules={[{ required: true, message: '请输入重试次数' }]}
                  >
                    <InputNumber min={0} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">设备配置</Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="deviceId"
                    label="设备编号"
                    rules={[{ required: true, message: '请输入设备编号' }]}
                  >
                    <Input placeholder="请输入设备编号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="stationCode"
                    label="站点编码"
                    rules={[{ required: true, message: '请输入站点编码' }]}
                  >
                    <Input placeholder="请输入站点编码" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name="heartbeatInterval"
                    label="心跳间隔(秒)"
                    rules={[{ required: true, message: '请输入心跳间隔' }]}
                  >
                    <InputNumber min={10} max={300} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="maxConnections"
                    label="最大连接数"
                    rules={[{ required: true, message: '请输入最大连接数' }]}
                  >
                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="bufferSize"
                    label="缓冲区大小(KB)"
                    rules={[{ required: true, message: '请输入缓冲区大小' }]}
                  >
                    <InputNumber min={512} max={8192} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">安全配置</Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="encryption"
                    label="数据加密"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="autoReconnect"
                    label="自动重连"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="encryptionKey"
                label="加密密钥"
              >
                <Input.Password placeholder="请输入加密密钥" />
              </Form.Item>

              <Form.Item
                name="logLevel"
                label="日志级别"
                rules={[{ required: true, message: '请选择日志级别' }]}
              >
                <Select placeholder="请选择日志级别">
                  <Option value="ERROR">ERROR</Option>
                  <Option value="WARN">WARN</Option>
                  <Option value="INFO">INFO</Option>
                  <Option value="DEBUG">DEBUG</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="连接状态" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '16px', marginBottom: '12px' }}>
                当前状态: <Tag color={getConnectionStatusColor()}>{getConnectionStatusText()}</Tag>
              </div>
              <Button 
                type="primary" 
                icon={<ExperimentOutlined />} 
                loading={testLoading}
                onClick={handleTestConnection}
              >
                测试连接
              </Button>
            </div>
          </Card>

          <Card title="设备状态" size="small">
            <Table
              columns={deviceColumns}
              dataSource={deviceList}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactlessConfig;