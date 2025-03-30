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
  Tooltip,
  Popconfirm,
  Statistic,
  Divider
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
  AuditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

const SupplierManagement = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  
  // 模拟数据
  const mockData = [
    {
      key: '1',
      id: 'SP001',
      name: '中石化北京分公司',
      type: '油品供应商',
      category: 'A',
      contactPerson: '张经理',
      phone: '13800138001',
      email: 'zhangsan@sinopec.com',
      address: '北京市朝阳区朝阳门北大街22号',
      status: '正常',
      createTime: '2022-01-15',
      updateTime: '2023-05-20',
      products: ['92#汽油', '95#汽油', '0#柴油'],
      hasTransport: true,
      contractEndDate: '2024-12-31'
    },
    {
      key: '2',
      id: 'SP002',
      name: '中石油华北销售公司',
      type: '油品供应商',
      category: 'A',
      contactPerson: '李经理',
      phone: '13800138002',
      email: 'lisi@cnpc.com',
      address: '北京市海淀区学院南路44号',
      status: '正常',
      createTime: '2022-02-20',
      updateTime: '2023-04-15',
      products: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'],
      hasTransport: true,
      contractEndDate: '2024-10-31'
    },
    {
      key: '3',
      id: 'SP003',
      name: '广州食品批发有限公司',
      type: '商品供应商',
      category: 'B',
      contactPerson: '王经理',
      phone: '13800138003',
      email: 'wangwu@gzfood.com',
      address: '广州市白云区机场路788号',
      status: '正常',
      createTime: '2022-03-10',
      updateTime: '2023-06-01',
      products: ['饮料', '零食', '日用品'],
      hasTransport: false,
      contractEndDate: '2023-12-31'
    },
    {
      key: '4',
      id: 'SP004',
      name: '深圳市润滑油有限公司',
      type: '油品供应商',
      category: 'B',
      contactPerson: '赵经理',
      phone: '13800138004',
      email: 'zhaoliu@szoil.com',
      address: '深圳市南山区科技园路10号',
      status: '暂停合作',
      createTime: '2022-04-05',
      updateTime: '2023-05-10',
      products: ['机油', '润滑油'],
      hasTransport: false,
      contractEndDate: '2023-09-30'
    },
    {
      key: '5',
      id: 'SP005',
      name: '成都便利店商品配送中心',
      type: '商品供应商',
      category: 'C',
      contactPerson: '钱经理',
      phone: '13800138005',
      email: 'qian@cdmart.com',
      address: '成都市武侯区武侯大道100号',
      status: '正常',
      createTime: '2022-05-15',
      updateTime: '2023-03-20',
      products: ['饮料', '零食', '烟酒', '日用品'],
      hasTransport: true,
      contractEndDate: '2024-06-30'
    }
  ];

  // 供应商类型
  const supplierTypes = [
    '油品供应商',
    '商品供应商'
  ];

  // 供应商等级
  const supplierCategories = [
    'A',
    'B',
    'C'
  ];

  // 供应商状态
  const supplierStatus = [
    '正常',
    '暂停合作',
    '合同到期',
    '黑名单'
  ];

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = (filters = {}) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      let filteredData = [...mockData];
      
      // 应用过滤条件
      if (filters.name) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      
      if (filters.type && filters.type !== '全部') {
        filteredData = filteredData.filter(item => item.type === filters.type);
      }
      
      if (filters.status && filters.status !== '全部') {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      
      if (filters.category && filters.category !== '全部') {
        filteredData = filteredData.filter(item => item.category === filters.category);
      }
      
      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  // 处理查询
  const handleSearch = () => {
    filterForm.validateFields().then(values => {
      fetchData(values);
    });
  };

  // 重置过滤条件
  const handleReset = () => {
    filterForm.resetFields();
    fetchData();
  };

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 打开新增/编辑模态框
  const showModal = (record = null) => {
    setCurrentSupplier(record);
    form.resetFields();
    
    if (record) {
      // 编辑模式
      form.setFieldsValue({
        name: record.name,
        type: record.type,
        category: record.category,
        contactPerson: record.contactPerson,
        phone: record.phone,
        email: record.email,
        address: record.address,
        status: record.status,
        products: record.products,
        hasTransport: record.hasTransport,
        contractEndDate: record.contractEndDate
      });
    }
    
    setModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      
      // 构建新记录
      const newRecord = {
        key: currentSupplier ? currentSupplier.key : `${dataSource.length + 1}`,
        id: currentSupplier ? currentSupplier.id : `SP${String(dataSource.length + 1).padStart(3, '0')}`,
        name: values.name,
        type: values.type,
        category: values.category,
        contactPerson: values.contactPerson,
        phone: values.phone,
        email: values.email,
        address: values.address,
        status: values.status,
        products: values.products,
        hasTransport: values.hasTransport,
        contractEndDate: values.contractEndDate,
        createTime: currentSupplier ? currentSupplier.createTime : new Date().toISOString().split('T')[0],
        updateTime: new Date().toISOString().split('T')[0]
      };
      
      // 模拟API请求
      setTimeout(() => {
        if (currentSupplier) {
          // 更新记录
          const newDataSource = dataSource.map(item => 
            item.key === currentSupplier.key ? newRecord : item
          );
          setDataSource(newDataSource);
          message.success('供应商信息已更新');
        } else {
          // 新增记录
          setDataSource([...dataSource, newRecord]);
          message.success('供应商已创建');
        }
        
        setLoading(false);
        setModalVisible(false);
      }, 500);
    });
  };

  // 处理删除
  const handleDelete = (key) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const newDataSource = dataSource.filter(item => item.key !== key);
      setDataSource(newDataSource);
      message.success('供应商已删除');
      setLoading(false);
    }, 500);
  };

  // 渲染状态标签
  const renderStatusTag = (status) => {
    let color = 'green';
    let icon = <CheckCircleOutlined />;
    
    if (status === '暂停合作') {
      color = 'orange';
      icon = <CloseCircleOutlined />;
    } else if (status === '合同到期') {
      color = 'red';
      icon = <CloseCircleOutlined />;
    } else if (status === '黑名单') {
      color = 'black';
      icon = <CloseCircleOutlined />;
    }
    
    return <Tag color={color} icon={icon}>{status}</Tag>;
  };

  // 获取统计数据
  const getStatistics = () => {
    const total = dataSource.length;
    const oilSuppliers = dataSource.filter(item => item.type === '油品供应商').length;
    const goodsSuppliers = dataSource.filter(item => item.type === '商品供应商').length;
    const normalSuppliers = dataSource.filter(item => item.status === '正常').length;
    const suspendedSuppliers = dataSource.filter(item => item.status === '暂停合作').length;
    const expiredSuppliers = dataSource.filter(item => item.status === '合同到期').length;
    const blacklistSuppliers = dataSource.filter(item => item.status === '黑名单').length;
    
    return { 
      total, 
      oilSuppliers, 
      goodsSuppliers, 
      normalSuppliers, 
      suspendedSuppliers, 
      expiredSuppliers, 
      blacklistSuppliers 
    };
  };

  // 表格列配置
  const columns = [
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (text) => {
        const icon = text === '油品供应商' ? <ShopOutlined /> : <ShopOutlined />;
        return <span>{icon} {text}</span>;
      },
    },
    {
      title: '等级',
      dataIndex: 'category',
      key: 'category',
      width: 80,
      render: (text) => {
        let color = 'green';
        if (text === 'B') color = 'blue';
        if (text === 'C') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text) => <span><PhoneOutlined /> {text}</span>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text) => <span><MailOutlined /> {text}</span>,
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
      title: '自有运输',
      dataIndex: 'hasTransport',
      key: 'hasTransport',
      width: 100,
      render: (hasTransport) => hasTransport ? <Tag color="green">有</Tag> : <Tag color="red">无</Tag>,
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
      render: renderStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="default" 
            icon={<FileTextOutlined />} 
            size="small"
            onClick={() => message.info(`查看${record.name}的合同信息`)}
          >
            合同
          </Button>
          {record.type === '油品供应商' && (
            <Button 
              type="default" 
              icon={<CarOutlined />} 
              size="small"
              onClick={() => message.info(`查看${record.name}的运输车辆`)}
            >
              车队
            </Button>
          )}
          <Popconfirm
            title="确定要删除此供应商吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 获取统计数据
  const stats = getStatistics();

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>供应商管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>供应商管理</h2>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="供应商列表" key="1">
            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={4}>
                <Card>
                  <Statistic 
                    title="供应商总数" 
                    value={stats.total} 
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic 
                    title="油品供应商" 
                    value={stats.oilSuppliers} 
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<ShopOutlined />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic 
                    title="商品供应商" 
                    value={stats.goodsSuppliers} 
                    valueStyle={{ color: '#faad14' }}
                    prefix={<ShopOutlined />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic 
                    title="正常合作" 
                    value={stats.normalSuppliers} 
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic 
                    title="暂停合作" 
                    value={stats.suspendedSuppliers} 
                    valueStyle={{ color: '#faad14' }}
                    prefix={<CloseCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic 
                    title="合同到期" 
                    value={stats.expiredSuppliers} 
                    valueStyle={{ color: '#f5222d' }}
                    prefix={<CloseCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* 过滤条件 */}
            <Card style={{ marginBottom: 16 }}>
              <Form
                form={filterForm}
                layout="horizontal"
                name="filterForm"
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name="name"
                      label="供应商名称"
                    >
                      <Input 
                        placeholder="请输入供应商名称" 
                        allowClear 
                        suffix={<SearchOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="type"
                      label="类型"
                    >
                      <Select placeholder="请选择类型" allowClear defaultValue="全部">
                        <Option value="全部">全部</Option>
                        {supplierTypes.map(type => (
                          <Option key={type} value={type}>{type}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="status"
                      label="状态"
                    >
                      <Select placeholder="请选择状态" allowClear defaultValue="全部">
                        <Option value="全部">全部</Option>
                        {supplierStatus.map(status => (
                          <Option key={status} value={status}>{status}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    <Form.Item>
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<SearchOutlined />}
                          onClick={handleSearch}
                        >
                          查询
                        </Button>
                        <Button 
                          icon={<ReloadOutlined />}
                          onClick={handleReset}
                        >
                          重置
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* 数据表格 */}
            <Card
              title="供应商列表"
              extra={
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => showModal()}
                  >
                    新增供应商
                  </Button>
                  <Button 
                    type="default" 
                    icon={<FileTextOutlined />} 
                    onClick={() => message.info('查看合同管理')}
                  >
                    合同管理
                  </Button>
                </Space>
              }
            >
              <Table 
                columns={columns} 
                dataSource={dataSource} 
                rowKey="key"
                pagination={{ pageSize: 10 }}
                loading={loading}
                scroll={{ x: 1800 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="油品供应商" key="2">
            <Card title="油品供应商管理">
              <p>油品供应商专属管理功能开发中...</p>
            </Card>
          </TabPane>
          <TabPane tab="商品供应商" key="3">
            <Card title="商品供应商管理">
              <p>商品供应商专属管理功能开发中...</p>
            </Card>
          </TabPane>
          <TabPane tab="承运单位管理" key="4">
            <Card title="承运单位管理">
              <p>承运单位管理功能开发中...</p>
            </Card>
          </TabPane>
          <TabPane tab="车队管理" key="5">
            <Card title="运输车队管理">
              <p>运输车队管理功能开发中...</p>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={currentSupplier ? '编辑供应商' : '新增供应商'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          name="supplierForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="供应商名称"
                rules={[{ required: true, message: '请输入供应商名称' }]}
              >
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="供应商类型"
                rules={[{ required: true, message: '请选择供应商类型' }]}
              >
                <Select placeholder="请选择供应商类型">
                  {supplierTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="供应商等级"
                rules={[{ required: true, message: '请选择供应商等级' }]}
              >
                <Select placeholder="请选择供应商等级">
                  {supplierCategories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择供应商状态' }]}
              >
                <Select placeholder="请选择供应商状态">
                  {supplierStatus.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人姓名' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入供应商地址' }]}
          >
            <Input placeholder="请输入供应商地址" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="products"
                label="供应产品"
                rules={[{ required: true, message: '请选择供应产品' }]}
              >
                <Select 
                  mode="tags" 
                  placeholder="请输入供应产品"
                  style={{ width: '100%' }}
                >
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                  <Option value="机油">机油</Option>
                  <Option value="润滑油">润滑油</Option>
                  <Option value="饮料">饮料</Option>
                  <Option value="零食">零食</Option>
                  <Option value="烟酒">烟酒</Option>
                  <Option value="日用品">日用品</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contractEndDate"
                label="合同到期日"
                rules={[{ required: true, message: '请输入合同到期日' }]}
              >
                <Input placeholder="请输入合同到期日 (YYYY-MM-DD)" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="hasTransport"
            label="是否有自有运输"
            valuePropName="checked"
          >
            <Select placeholder="请选择是否有自有运输">
              <Option value={true}>有</Option>
              <Option value={false}>无</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierManagement; 