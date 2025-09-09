import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  Tag,
  Card,
  Statistic,
  Tabs,
  InputNumber,
  Switch,
  Alert,
  Divider,
  List,
  Typography,
  Progress,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  BulbOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

const IntelligentReplenishment = () => {
  const [loading, setLoading] = useState(false);
  const [suggestionData, setSuggestionData] = useState([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [filterForm] = Form.useForm();
  const [configForm] = Form.useForm();

  // 补货建议数据
  const mockSuggestionData = [
    {
      id: 'RS001',
      skuCode: 'SKU001',
      skuName: '可口可乐 330ml',
      stationName: '赣中分公司-服务区A-油站1',
      currentStock: 45,
      safetyStock: 100,
      maxStock: 500,
      avgDailySales: 25,
      suggestedQty: 200,
      urgencyLevel: '高',
      reason: '低于安全库存',
      mainSupplier: '可口可乐公司',
      leadTime: 3,
      lastSalesData: [23, 28, 21, 26, 30, 25, 22] // 最近7天销量
    },
    {
      id: 'RS002',
      skuCode: 'SKU002',
      skuName: '雪碧 330ml',
      stationName: '赣中分公司-服务区A-油站1',
      currentStock: 80,
      safetyStock: 80,
      maxStock: 400,
      avgDailySales: 18,
      suggestedQty: 120,
      urgencyLevel: '中',
      reason: '达到补货点',
      mainSupplier: '可口可乐公司',
      leadTime: 3,
      lastSalesData: [15, 20, 16, 19, 22, 18, 16]
    }
  ];

  // 补货策略配置数据
  const mockConfigData = [
    {
      id: 'CFG001',
      skuCode: 'SKU001',
      skuName: '可口可乐 330ml',
      stationName: '赣中分公司-服务区A-油站1',
      safetyStock: 100,
      maxStock: 500,
      reorderPoint: 150,
      leadTime: 3,
      minOrderQty: 50,
      reviewCycle: 7,
      isActive: true,
      strategy: 'min_max'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setSuggestionData(mockSuggestionData);
      setLoading(false);
    }, 1000);
  };

  const getUrgencyColor = (level) => {
    const colorMap = {
      '高': 'red',
      '中': 'orange',
      '低': 'green'
    };
    return colorMap[level] || 'default';
  };

  const suggestionColumns = [
    {
      title: 'SKU编码',
      dataIndex: 'skuCode',
      key: 'skuCode',
      width: 120,
      fixed: 'left'
    },
    {
      title: 'SKU名称',
      dataIndex: 'skuName',
      key: 'skuName',
      width: 150,
      fixed: 'left'
    },
    {
      title: '站点',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
      ellipsis: true
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <span style={{ 
          color: text <= record.safetyStock ? '#f5222d' : '#52c41a' 
        }}>
          {text}
        </span>
      )
    },
    {
      title: '安全库存',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
      width: 100,
      align: 'center'
    },
    {
      title: '库存率',
      key: 'stockRate',
      width: 120,
      render: (_, record) => {
        const rate = (record.currentStock / record.maxStock * 100).toFixed(1);
        const status = rate < 20 ? 'exception' : rate < 50 ? 'active' : 'success';
        return (
          <Progress 
            percent={parseFloat(rate)} 
            size="small" 
            status={status}
            format={percent => `${percent}%`}
          />
        );
      }
    },
    {
      title: '日均销量',
      dataIndex: 'avgDailySales',
      key: 'avgDailySales',
      width: 100,
      align: 'center'
    },
    {
      title: '建议补货量',
      dataIndex: 'suggestedQty',
      key: 'suggestedQty',
      width: 120,
      align: 'center',
      render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>
    },
    {
      title: '紧急程度',
      dataIndex: 'urgencyLevel',
      key: 'urgencyLevel',
      width: 100,
      render: (text) => <Tag color={getUrgencyColor(text)}>{text}</Tag>
    },
    {
      title: '补货原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 120
    },
    {
      title: '主供应商',
      dataIndex: 'mainSupplier',
      key: 'mainSupplier',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" className="table-actions">
          <Tooltip title="查看详细分析">
            <Button size="small" icon={<InfoCircleOutlined />}>
              详情
            </Button>
          </Tooltip>
          <Button
            type="primary"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => handleCreatePO(record)}
          >
            生成采购单
          </Button>
        </Space>
      )
    }
  ];

  const configColumns = [
    {
      title: 'SKU编码',
      dataIndex: 'skuCode',
      key: 'skuCode'
    },
    {
      title: 'SKU名称',
      dataIndex: 'skuName',
      key: 'skuName'
    },
    {
      title: '站点',
      dataIndex: 'stationName',
      key: 'stationName',
      ellipsis: true
    },
    {
      title: '安全库存',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
      align: 'center'
    },
    {
      title: '最大库存',
      dataIndex: 'maxStock',
      key: 'maxStock',
      align: 'center'
    },
    {
      title: '补货点',
      dataIndex: 'reorderPoint',
      key: 'reorderPoint',
      align: 'center'
    },
    {
      title: '提前期(天)',
      dataIndex: 'leadTime',
      key: 'leadTime',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text) => (
        <Switch checked={text} size="small" />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleEditConfig(record)}
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  const handleCreatePO = (record) => {
    Modal.confirm({
      title: '生成采购单',
      content: `确认为 ${record.skuName} 生成采购单，数量：${record.suggestedQty}？`,
      onOk() {
        message.success('采购单生成成功');
      }
    });
  };

  const handleBatchCreatePO = () => {
    const selectedKeys = []; // 这里应该从表格选中状态获取
    if (selectedKeys.length === 0) {
      message.warning('请先选择要生成采购单的商品');
      return;
    }
    
    Modal.confirm({
      title: '批量生成采购单',
      content: `确认为选中的 ${selectedKeys.length} 个商品生成采购单？`,
      onOk() {
        message.success(`已生成 ${selectedKeys.length} 个采购单`);
      }
    });
  };

  const handleRunReplenishment = () => {
    setLoading(true);
    message.info('正在运行智能补货算法...');
    setTimeout(() => {
      setLoading(false);
      message.success('补货建议已更新');
      fetchData();
    }, 2000);
  };

  const handleEditConfig = (record) => {
    setCurrentConfig(record);
    configForm.setFieldsValue(record);
    setConfigModalVisible(true);
  };

  const handleSaveConfig = () => {
    configForm.validateFields()
      .then(values => {
        console.log('保存配置:', values);
        message.success('配置保存成功');
        setConfigModalVisible(false);
      })
      .catch(info => {
        console.log('验证失败:', info);
      });
  };

  return (
    <div className="procurement-container">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="补货建议" key="suggestions">
          {/* 统计卡片 */}
          <Row gutter={16} className="stat-cards">
            <Col span={6}>
              <Card>
                <Statistic 
                  title="补货建议" 
                  value={15} 
                  prefix={<BulbOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic 
                  title="高紧急程度" 
                  value={5} 
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic 
                  title="预计采购金额" 
                  value={45600} 
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic 
                  title="覆盖站点" 
                  value={8} 
                  suffix="个"
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 操作区域 */}
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Alert
                message="智能补货说明"
                description="系统基于历史销售数据、库存水位、补货规则等因素自动生成补货建议。建议您定期运行补货算法以获取最新建议。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Space style={{ marginBottom: 16 }}>
                <Button 
                  type="primary" 
                  icon={<ThunderboltOutlined />}
                  onClick={handleRunReplenishment}
                  loading={loading}
                >
                  运行补货算法
                </Button>
                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />}
                  onClick={handleBatchCreatePO}
                >
                  批量生成采购单
                </Button>
                <Button icon={<ReloadOutlined />} onClick={fetchData}>
                  刷新数据
                </Button>
              </Space>
            </Col>
          </Row>

          {/* 筛选表单 */}
          <Form form={filterForm} layout="inline" className="filter-form">
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={6}>
                <Form.Item name="keyword" label="关键字">
                  <Input placeholder="SKU编码/名称" allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="stationName" label="站点">
                  <Select placeholder="请选择站点" allowClear>
                    <Option value="赣中分公司-服务区A-油站1">赣中分公司-服务区A-油站1</Option>
                    <Option value="赣东分公司-服务区B-油站2">赣东分公司-服务区B-油站2</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="urgencyLevel" label="紧急程度">
                  <Select placeholder="请选择紧急程度" allowClear>
                    <Option value="高">高</Option>
                    <Option value="中">中</Option>
                    <Option value="低">低</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* 补货建议表格 */}
          <Table 
            columns={suggestionColumns}
            dataSource={suggestionData}
            loading={loading}
            rowKey="id"
            className="procurement-table"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            scroll={{ x: 1800 }}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                console.log('选中的行:', selectedRowKeys, selectedRows);
              }
            }}
          />
        </TabPane>

        <TabPane tab="补货策略配置" key="config">
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Alert
                message="策略配置说明"
                description="为每个SKU和站点配置补货策略参数，包括安全库存、最大库存、补货点等。系统将根据这些参数自动生成补货建议。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                新增配置
              </Button>
            </Col>
          </Row>

          <Table 
            columns={configColumns}
            dataSource={mockConfigData}
            loading={loading}
            rowKey="id"
            className="procurement-table"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`
            }}
          />
        </TabPane>
      </Tabs>

      {/* 策略配置模态框 */}
      <Modal
        title="编辑补货策略"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        onOk={handleSaveConfig}
        width={600}
        className="procurement-modal"
      >
        <Form form={configForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="skuName" label="SKU名称">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stationName" label="站点">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">库存参数</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="safetyStock"
                label="安全库存"
                rules={[{ required: true, message: '请输入安全库存' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="安全库存"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxStock"
                label="最大库存"
                rules={[{ required: true, message: '请输入最大库存' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="最大库存"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="reorderPoint"
                label="补货点"
                rules={[{ required: true, message: '请输入补货点' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="补货点"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">订货参数</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="leadTime"
                label="提前期(天)"
                rules={[{ required: true, message: '请输入提前期' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="提前期"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="minOrderQty"
                label="最小订货量"
                rules={[{ required: true, message: '请输入最小订货量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="最小订货量"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="reviewCycle"
                label="检查周期(天)"
                rules={[{ required: true, message: '请输入检查周期' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="检查周期"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="strategy"
                label="补货策略"
                rules={[{ required: true, message: '请选择补货策略' }]}
              >
                <Select placeholder="请选择补货策略">
                  <Option value="min_max">最小-最大库存</Option>
                  <Option value="reorder_point">补货点策略</Option>
                  <Option value="periodic">定期订货</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isActive" label="启用状态" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default IntelligentReplenishment; 