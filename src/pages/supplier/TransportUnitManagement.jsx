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
  CarOutlined,
  TruckOutlined,
  DollarOutlined,
  FileTextOutlined,
  UploadOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TransportUnitManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [transportData, setTransportData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  // 模拟数据 - 承运单位
  const mockTransportUnits = [
    {
      key: '1',
      id: 'TU001',
      name: '北京安捷物流有限公司',
      category: 'A',
      contactPerson: '王经理',
      phone: '13700137001',
      email: 'wangwu@example.com',
      address: '北京市大兴区亦庄经济开发区',
      status: '正常',
      transportTypes: ['油品运输', '危险品运输'],
      vehicleCount: 20,
      driverCount: 25,
      licenseExpireDate: '2024-12-31',
      lastInspectionDate: '2024-03-01',
      contractEndDate: '2024-12-31'
    }
  ];

  // 模拟数据 - 车辆信息
  const mockVehicles = [
    {
      key: '1',
      id: 'V001',
      plateNumber: '京A12345',
      transportUnitId: 'TU001',
      transportUnitName: '北京安捷物流有限公司',
      vehicleType: '油罐车',
      capacity: '30000L',
      driver: '张师傅',
      driverPhone: '13800138000',
      licenseExpireDate: '2024-12-31',
      insuranceExpireDate: '2024-12-31',
      lastMaintenanceDate: '2024-02-15',
      status: '正常',
      currentLocation: '北京市大兴区'
    }
  ];

  // 模拟数据 - 合同记录
  const mockContracts = [
    {
      key: '1',
      id: 'CON001',
      transportUnitId: 'TU001',
      transportUnitName: '北京安捷物流有限公司',
      contractType: '年度运输协议',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: '执行中',
      transportTypes: ['油品运输', '危险品运输'],
      terms: {
        paymentTerm: '月结30天',
        insuranceTerm: '全额保险',
        safetyTerm: '安全责任制'
      },
      attachments: [
        { name: '运输协议.pdf', url: '#' },
        { name: '安全责任书.pdf', url: '#' }
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
      setTransportData(mockTransportUnits);
      setVehicleData(mockVehicles);
      setContractData(mockContracts);
      setLoading(false);
    }, 500);
  };

  // 承运单位列表列配置
  const transportColumns = [
    {
      title: '单位编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '单位名称',
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
      title: '运输类型',
      dataIndex: 'transportTypes',
      key: 'transportTypes',
      width: 200,
      render: (types) => (
        <>
          {types.map(type => (
            <Tag color="blue" key={type}>
              {type}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '车辆数量',
      dataIndex: 'vehicleCount',
      key: 'vehicleCount',
      width: 100,
    },
    {
      title: '驾驶员数量',
      dataIndex: 'driverCount',
      key: 'driverCount',
      width: 100,
    },
    {
      title: '证照到期日',
      dataIndex: 'licenseExpireDate',
      key: 'licenseExpireDate',
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
            icon={<CarOutlined />} 
            size="small"
            onClick={() => handleVehicle(record)}
          >
            车辆
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

  // 车辆信息列配置
  const vehicleColumns = [
    {
      title: '车辆编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 120,
    },
    {
      title: '所属单位',
      dataIndex: 'transportUnitName',
      key: 'transportUnitName',
      width: 200,
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 120,
    },
    {
      title: '载重容量',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
    },
    {
      title: '驾驶员',
      dataIndex: 'driver',
      key: 'driver',
      width: 100,
    },
    {
      title: '证照到期日',
      dataIndex: 'licenseExpireDate',
      key: 'licenseExpireDate',
      width: 120,
    },
    {
      title: '保险到期日',
      dataIndex: 'insuranceExpireDate',
      key: 'insuranceExpireDate',
      width: 120,
    },
    {
      title: '最近维护日期',
      dataIndex: 'lastMaintenanceDate',
      key: 'lastMaintenanceDate',
      width: 120,
    },
    {
      title: '当前位置',
      dataIndex: 'currentLocation',
      key: 'currentLocation',
      width: 150,
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditVehicle(record)}
          >
            编辑
          </Button>
          <Button 
            type="default" 
            icon={<SafetyCertificateOutlined />} 
            size="small"
            onClick={() => handleInspection(record)}
          >
            检查
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
      title: '承运单位',
      dataIndex: 'transportUnitName',
      key: 'transportUnitName',
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
      title: '运输类型',
      dataIndex: 'transportTypes',
      key: 'transportTypes',
      width: 250,
      render: (types) => (
        <>
          {types.map(type => (
            <Tag color="blue" key={type}>
              {type}
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

  // 处理车辆管理
  const handleVehicle = (record) => {
    setCurrentRecord(record);
    setVehicleModalVisible(true);
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

  // 处理车辆编辑
  const handleEditVehicle = (record) => {
    message.info(`编辑车辆信息：${record.plateNumber}`);
  };

  // 处理车辆检查
  const handleInspection = (record) => {
    message.info(`检查车辆：${record.plateNumber}`);
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
      totalUnits: transportData.length,
      activeUnits: transportData.filter(t => t.status === '正常').length,
      totalVehicles: vehicleData.length,
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
          <Breadcrumb.Item>承运单位</Breadcrumb.Item>
        </Breadcrumb>
        <h2>承运单位管理</h2>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="承运单位管理" key="1">
            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="承运单位总数" 
                    value={stats.totalUnits} 
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<CarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="正常运营" 
                    value={stats.activeUnits} 
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="车辆总数" 
                    value={stats.totalVehicles} 
                    valueStyle={{ color: '#faad14' }}
                    prefix={<TruckOutlined />}
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
                <Form.Item name="name" label="单位名称">
                  <Input placeholder="请输入单位名称" allowClear />
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

            {/* 承运单位列表 */}
            <Table 
              columns={transportColumns} 
              dataSource={transportData}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1500 }}
            />
          </TabPane>

          <TabPane tab="车辆管理" key="2">
            {/* 车辆管理过滤条件 */}
            <Card style={{ marginBottom: 16 }}>
              <Form layout="inline">
                <Form.Item name="plateNumber" label="车牌号">
                  <Input placeholder="请输入车牌号" allowClear />
                </Form.Item>
                <Form.Item name="transportUnit" label="所属单位">
                  <Select placeholder="请选择承运单位" allowClear style={{ width: 200 }}>
                    {transportData.map(unit => (
                      <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                    <Option value="正常">正常</Option>
                    <Option value="维护中">维护中</Option>
                    <Option value="停运">停运</Option>
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
                      新增车辆
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            {/* 车辆列表 */}
            <Table 
              columns={vehicleColumns} 
              dataSource={vehicleData}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1800 }}
            />
          </TabPane>

          <TabPane tab="合同管理" key="3">
            {/* 合同管理过滤条件 */}
            <Card style={{ marginBottom: 16 }}>
              <Form layout="inline">
                <Form.Item name="dateRange" label="合同期限">
                  <RangePicker />
                </Form.Item>
                <Form.Item name="transportUnit" label="承运单位">
                  <Select placeholder="请选择承运单位" allowClear style={{ width: 200 }}>
                    {transportData.map(unit => (
                      <Option key={unit.id} value={unit.id}>{unit.name}</Option>
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

      {/* 承运单位编辑模态框 */}
      <Modal
        title={currentRecord ? '编辑承运单位' : '新增承运单位'}
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

      {/* 车辆管理模态框 */}
      <Modal
        title="车辆管理"
        visible={vehicleModalVisible}
        onOk={() => setVehicleModalVisible(false)}
        onCancel={() => setVehicleModalVisible(false)}
        width={800}
      >
        <Form layout="vertical">
          {/* 车辆表单内容 */}
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

export default TransportUnitManagement; 