import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Breadcrumb, 
  Tag, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  Tabs,
  Statistic,
  DatePicker,
  Upload,
  Descriptions,
  Timeline
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShopOutlined,
  CarOutlined,
  DollarOutlined,
  FileTextOutlined,
  UploadOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OilSupplierManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [supplierData, setSupplierData] = useState([]);
  const [inquiryData, setInquiryData] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  // 模拟数据 - 油品供应商
  const mockSuppliers = [
    {
      key: '1',
      id: 'OS001',
      name: '中石化北京分公司',
      category: 'A',
      contactPerson: '张经理',
      phone: '13800138001',
      email: 'zhangsan@sinopec.com',
      address: '北京市朝阳区朝阳门北大街22号',
      status: '正常',
      products: ['92#汽油', '95#汽油', '0#柴油'],
      hasTransport: true,
      contractEndDate: '2024-12-31',
      lastInquiryDate: '2024-03-10',
      lastQuotePrice: {
        '92#汽油': '6.89',
        '95#汽油': '7.32',
        '0#柴油': '6.45'
      }
    }
  ];

  // 模拟数据 - 询价记录
  const mockInquiries = [
    {
      key: '1',
      id: 'INQ001',
      supplierId: 'OS001',
      supplierName: '中石化北京分公司',
      inquiryDate: '2024-03-10',
      products: [
        { name: '92#汽油', quantity: 20000, unit: '升' },
        { name: '95#汽油', quantity: 15000, unit: '升' },
        { name: '0#柴油', quantity: 30000, unit: '升' }
      ],
      status: '已报价',
      quotation: {
        '92#汽油': '6.89',
        '95#汽油': '7.32',
        '0#柴油': '6.45'
      },
      quoteDate: '2024-03-11',
      validUntil: '2024-03-18'
    }
  ];

  // 模拟数据 - 合同记录
  const mockContracts = [
    {
      key: '1',
      id: 'CON001',
      supplierId: 'OS001',
      supplierName: '中石化北京分公司',
      contractType: '年度框架协议',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: '执行中',
      products: ['92#汽油', '95#汽油', '0#柴油'],
      terms: {
        paymentTerm: '月结30天',
        deliveryTerm: '供应商负责配送',
        qualityTerm: 'GB国标'
      },
      attachments: [
        { name: '框架协议.pdf', url: '#' },
        { name: '质量保证协议.pdf', url: '#' }
      ]
    }
  ];

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setSupplierData(mockSuppliers);
      setInquiryData(mockInquiries);
      setContractData(mockContracts);
      setLoading(false);
    }, 500);
  };

  // 供应商列表列配置
  const supplierColumns = [
    {
      title: '供应商编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '等级',
      dataIndex: 'category',
      key: 'category',
      width: 80,
      render: (text) => (
        <Tag color={text === 'A' ? 'green' : text === 'B' ? 'blue' : 'orange'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '供应产品',
      dataIndex: 'products',
      key: 'products',
      width: 200,
      render: (products) => (
        <>
          {products.map(product => (
            <Tag color="blue" key={product}>
              {product}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '最近询价日期',
      dataIndex: 'lastInquiryDate',
      key: 'lastInquiryDate',
      width: 120,
    },
    {
      title: '合同到期日',
      dataIndex: 'contractEndDate',
      key: 'contractEndDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '正常' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<DollarOutlined />} 
            size="small"
            onClick={() => handleInquiry(record)}
          >
            询价
          </Button>
          <Button 
            type="default" 
            icon={<FileTextOutlined />} 
            size="small"
            onClick={() => handleContract(record)}
          >
            合同
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="default" 
            icon={<HistoryOutlined />} 
            size="small"
            onClick={() => handleHistory(record)}
          >
            历史
          </Button>
        </Space>
      ),
    },
  ];

  // 询价记录列配置
  const inquiryColumns = [
    {
      title: '询价单号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: '询价日期',
      dataIndex: 'inquiryDate',
      key: 'inquiryDate',
      width: 120,
    },
    {
      title: '询价产品',
      dataIndex: 'products',
      key: 'products',
      width: 300,
      render: (products) => (
        <>
          {products.map(product => (
            <Tag color="blue" key={product.name}>
              {product.name}: {product.quantity}{product.unit}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '已报价' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '报价信息',
      dataIndex: 'quotation',
      key: 'quotation',
      width: 300,
      render: (quotation) => (
        <>
          {quotation && Object.entries(quotation).map(([product, price]) => (
            <Tag color="green" key={product}>
              {product}: ￥{price}/升
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '报价有效期',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditInquiry(record)}
          >
            处理
          </Button>
          <Button 
            type="default" 
            icon={<FileTextOutlined />} 
            size="small"
            onClick={() => handleViewInquiry(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 合同列配置
  const contractColumns = [
    {
      title: '合同编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      width: 150,
    },
    {
      title: '生效日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '到期日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '执行中' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '合同产品',
      dataIndex: 'products',
      key: 'products',
      width: 250,
      render: (products) => (
        <>
          {products.map(product => (
            <Tag color="blue" key={product}>
              {product}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<FileTextOutlined />} 
            size="small"
            onClick={() => handleViewContract(record)}
          >
            查看
          </Button>
          <Upload>
            <Button 
              type="default" 
              icon={<UploadOutlined />} 
              size="small"
            >
              上传附件
            </Button>
          </Upload>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditContract(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 处理询价
  const handleInquiry = (record) => {
    setCurrentRecord(record);
    setInquiryModalVisible(true);
  };

  // 处理合同
  const handleContract = (record) => {
    setCurrentRecord(record);
    setContractModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理历史记录
  const handleHistory = (record) => {
    message.info(`查看${record.name}的历史记录`);
  };

  // 处理询价编辑
  const handleEditInquiry = (record) => {
    message.info(`编辑询价单：${record.id}`);
  };

  // 处理询价查看
  const handleViewInquiry = (record) => {
    message.info(`查看询价单：${record.id}`);
  };

  // 处理合同查看
  const handleViewContract = (record) => {
    message.info(`查看合同：${record.id}`);
  };

  // 处理合同编辑
  const handleEditContract = (record) => {
    message.info(`编辑合同：${record.id}`);
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalSuppliers: supplierData.length,
      activeSuppliers: supplierData.filter(s => s.status === '正常').length,
      pendingInquiries: inquiryData.filter(i => i.status !== '已报价').length,
      activeContracts: contractData.filter(c => c.status === '执行中').length
    };
  };

  const stats = getStatistics();

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/supplier">供应商管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>油品供应商</Breadcrumb.Item>
        </Breadcrumb>
        <h2>油品供应商管理</h2>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="供应商管理" key="1">
            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="供应商总数" 
                    value={stats.totalSuppliers} 
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<ShopOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="正常合作" 
                    value={stats.activeSuppliers} 
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="待处理询价" 
                    value={stats.pendingInquiries} 
                    valueStyle={{ color: '#faad14' }}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="执行中合同" 
                    value={stats.activeContracts} 
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* 过滤条件 */}
            <Card style={{ marginBottom: 16 }}>
              <Form form={filterForm} layout="inline">
                <Form.Item name="name" label="供应商名称">
                  <Input placeholder="请输入供应商名称" allowClear />
                </Form.Item>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                    <Option value="正常">正常</Option>
                    <Option value="暂停">暂停</Option>
                    <Option value="终止">终止</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="category" label="等级">
                  <Select placeholder="请选择等级" allowClear style={{ width: 120 }}>
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            {/* 供应商列表 */}
            <Table 
              columns={supplierColumns} 
              dataSource={supplierData}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1500 }}
            />
          </TabPane>

          <TabPane tab="询价管理" key="2">
            {/* 询价管理过滤条件 */}
            <Card style={{ marginBottom: 16 }}>
              <Form layout="inline">
                <Form.Item name="dateRange" label="询价日期">
                  <RangePicker />
                </Form.Item>
                <Form.Item name="supplier" label="供应商">
                  <Select placeholder="请选择供应商" allowClear style={{ width: 200 }}>
                    {supplierData.map(supplier => (
                      <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                    <Option value="待报价">待报价</Option>
                    <Option value="已报价">已报价</Option>
                    <Option value="已确认">已确认</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />}>
                      重置
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />}>
                      新建询价
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            {/* 询价记录列表 */}
            <Table 
              columns={inquiryColumns} 
              dataSource={inquiryData}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1500 }}
            />
          </TabPane>

          <TabPane tab="合同管理" key="3">
            {/* 合同管理过滤条件 */}
            <Card style={{ marginBottom: 16 }}>
              <Form layout="inline">
                <Form.Item name="dateRange" label="合同期限">
                  <RangePicker />
                </Form.Item>
                <Form.Item name="supplier" label="供应商">
                  <Select placeholder="请选择供应商" allowClear style={{ width: 200 }}>
                    {supplierData.map(supplier => (
                      <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                    <Option value="执行中">执行中</Option>
                    <Option value="已到期">已到期</Option>
                    <Option value="已终止">已终止</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />}>
                      重置
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />}>
                      新增合同
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            {/* 合同列表 */}
            <Table 
              columns={contractColumns} 
              dataSource={contractData}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1500 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 供应商编辑模态框 */}
      <Modal
        title={currentRecord ? '编辑供应商' : '新增供应商'}
        visible={modalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            console.log(values);
            setModalVisible(false);
          });
        }}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {/* 表单内容 */}
        </Form>
      </Modal>

      {/* 询价模态框 */}
      <Modal
        title="发起询价"
        visible={inquiryModalVisible}
        onOk={() => setInquiryModalVisible(false)}
        onCancel={() => setInquiryModalVisible(false)}
        width={800}
      >
        <Form layout="vertical">
          {/* 询价表单内容 */}
        </Form>
      </Modal>

      {/* 合同模态框 */}
      <Modal
        title="合同管理"
        visible={contractModalVisible}
        onOk={() => setContractModalVisible(false)}
        onCancel={() => setContractModalVisible(false)}
        width={800}
      >
        <Form layout="vertical">
          {/* 合同表单内容 */}
        </Form>
      </Modal>
    </div>
  );
};

export default OilSupplierManagement; 