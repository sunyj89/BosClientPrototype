import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Table,
  Typography,
  Tag,
  message,
  Row,
  Col,
  Tabs,
  Alert
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  SaveOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

// 模拟油站数据
const stations = [
  { id: 'BJ001', name: '北京海淀油站' },
  { id: 'BJ002', name: '北京朝阳油站' },
  { id: 'SH001', name: '上海黄浦油站' },
  { id: 'SH002', name: '上海浦东油站' },
  { id: 'GZ001', name: '广州天河油站' },
  { id: 'GZ002', name: '广州海珠油站' }
];

// 模拟油罐数据
const tanks = {
  'BJ001': [
    { id: 'T001', name: '1号油罐', oilType: '92#汽油', capacity: 30000, currentVolume: 12500 },
    { id: 'T002', name: '2号油罐', oilType: '95#汽油', capacity: 30000, currentVolume: 8300 },
    { id: 'T003', name: '3号油罐', oilType: '98#汽油', capacity: 20000, currentVolume: 6200 },
    { id: 'T004', name: '4号油罐', oilType: '0#柴油', capacity: 20000, currentVolume: 5800 }
  ],
  'BJ002': [
    { id: 'T005', name: '1号油罐', oilType: '92#汽油', capacity: 30000, currentVolume: 15600 },
    { id: 'T006', name: '2号油罐', oilType: '95#汽油', capacity: 30000, currentVolume: 9800 },
    { id: 'T007', name: '3号油罐', oilType: '98#汽油', capacity: 20000, currentVolume: 7300 },
    { id: 'T008', name: '4号油罐', oilType: '0#柴油', capacity: 20000, currentVolume: 8900 }
  ]
};

// 模拟部门数据
const departments = [
  { id: 'D001', name: '加油站运营部' },
  { id: 'D002', name: '维修部' },
  { id: 'D003', name: '安保部' },
  { id: 'D004', name: '清洁部' },
  { id: 'D005', name: '行政部' }
];

// 模拟用途数据
const usages = [
  { id: 'U001', name: '车辆用油' },
  { id: 'U002', name: '发电机用油' },
  { id: 'U003', name: '设备测试' },
  { id: 'U004', name: '其他设备使用' }
];

// 模拟自用领用记录
const mockSelfUseRecords = [
  {
    id: 'SU001',
    date: '2023-03-10',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T001',
    tankName: '1号油罐',
    oilType: '92#汽油',
    volume: 50,
    departmentId: 'D001',
    departmentName: '加油站运营部',
    usageId: 'U001',
    usageName: '车辆用油',
    applicant: '张经理',
    approver: '王站长',
    status: '已批准',
    notes: '站内巡检车辆加油'
  },
  {
    id: 'SU002',
    date: '2023-03-09',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T004',
    tankName: '4号油罐',
    oilType: '0#柴油',
    volume: 100,
    departmentId: 'D002',
    departmentName: '维修部',
    usageId: 'U002',
    usageName: '发电机用油',
    applicant: '李工',
    approver: '王站长',
    status: '已批准',
    notes: '停电时后备发电机用油'
  },
  {
    id: 'SU003',
    date: '2023-03-08',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankId: 'T005',
    tankName: '1号油罐',
    oilType: '92#汽油',
    volume: 30,
    departmentId: 'D001',
    departmentName: '加油站运营部',
    usageId: 'U001',
    usageName: '车辆用油',
    applicant: '赵经理',
    approver: '陈站长',
    status: '已批准',
    notes: '站内巡检车辆加油'
  },
  {
    id: 'SU004',
    date: '2023-03-08',
    stationId: 'SH001',
    stationName: '上海黄浦油站',
    tankId: 'T010',
    tankName: '2号油罐',
    oilType: '95#汽油',
    volume: 20,
    departmentId: 'D003',
    departmentName: '安保部',
    usageId: 'U001',
    usageName: '车辆用油',
    applicant: '钱队长',
    approver: null,
    status: '待审批',
    notes: '安保巡逻车加油'
  },
  {
    id: 'SU005',
    date: '2023-03-07',
    stationId: 'SH002',
    stationName: '上海浦东油站',
    tankId: 'T013',
    tankName: '2号油罐',
    oilType: '95#汽油',
    volume: 120,
    departmentId: 'D002',
    departmentName: '维修部',
    usageId: 'U003',
    usageName: '设备测试',
    applicant: '孙工',
    approver: '高站长',
    status: '已拒绝',
    notes: '申请数量过大，请重新申请'
  }
];

const SelfUse = () => {
  const [form] = Form.useForm();
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationTanks, setStationTanks] = useState([]);
  const [selfUseRecords, setSelfUseRecords] = useState(mockSelfUseRecords);
  const [activeTab, setActiveTab] = useState('1');
  
  // 处理油站选择
  const handleStationChange = (value) => {
    setSelectedStation(value);
    setStationTanks(tanks[value] || []);
    form.setFieldsValue({ tankId: undefined, oilType: undefined, currentVolume: undefined });
  };
  
  // 处理油罐选择
  const handleTankChange = (value) => {
    const selectedTank = stationTanks.find(tank => tank.id === value);
    if (selectedTank) {
      form.setFieldsValue({
        oilType: selectedTank.oilType,
        currentVolume: selectedTank.currentVolume
      });
    }
  };
  
  // 提交表单
  const handleSubmit = (values) => {
    console.log('提交的表单数据:', values);
    
    // 获取选中的油站和油罐名称
    const station = stations.find(s => s.id === values.stationId);
    const tank = stationTanks.find(t => t.id === values.tankId);
    
    // 获取选中的部门和用途名称
    const department = departments.find(d => d.id === values.departmentId);
    const usage = usages.find(u => u.id === values.usageId);
    
    // 创建新的自用领用记录
    const newRecord = {
      id: `SU${String(selfUseRecords.length + 1).padStart(3, '0')}`,
      date: values.date.format('YYYY-MM-DD'),
      stationId: values.stationId,
      stationName: station ? station.name : '',
      tankId: values.tankId,
      tankName: tank ? tank.name : '',
      oilType: values.oilType,
      volume: values.volume,
      departmentId: values.departmentId,
      departmentName: department ? department.name : '',
      usageId: values.usageId,
      usageName: usage ? usage.name : '',
      applicant: values.applicant,
      approver: null,
      status: '待审批',
      notes: values.notes || '自用领用'
    };
    
    // 更新自用领用记录列表
    setSelfUseRecords([newRecord, ...selfUseRecords]);
    
    // 显示成功消息
    message.success('自用领用申请已提交，等待审批');
    
    // 重置表单
    form.resetFields();
    setSelectedStation(null);
    setStationTanks([]);
  };
  
  // 表格列定义
  const columns = [
    {
      title: '单据编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '油罐',
      dataIndex: 'tankName',
      key: 'tankName',
      width: 100,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '领用量(L)',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '使用部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 120,
    },
    {
      title: '用途',
      dataIndex: 'usageName',
      key: 'usageName',
      width: 120,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status) => {
        let color = 'green';
        let icon = <CheckCircleOutlined />;
        
        if (status === '待审批') {
          color = 'blue';
          icon = <FilterOutlined />;
        } else if (status === '已拒绝') {
          color = 'red';
          icon = <CloseCircleOutlined />;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<PrinterOutlined />}>打印</Button>
          {record.status === '待审批' && (
            <Button type="link" size="small" danger>取消</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="self-use">
      <Title level={2}>油品自用领用</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="自用领用申请" key="1">
          <Card title="新增自用领用单" style={{ marginBottom: 16 }}>
            <Alert
              message="自用领用说明"
              description="自用领用是指油站内部使用油品的流程记录，如站内车辆加油、设备测试等。所有领用需经过站长批准。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              onFinish={handleSubmit}
              initialValues={{
                date: moment(),
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="stationId"
                    label="油站"
                    rules={[{ required: true, message: '请选择油站' }]}
                  >
                    <Select 
                      placeholder="请选择油站" 
                      onChange={handleStationChange}
                      showSearch
                      optionFilterProp="children"
                    >
                      {stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label="领用日期"
                    rules={[{ required: true, message: '请选择领用日期' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="tankId"
                    label="油罐"
                    rules={[{ required: true, message: '请选择油罐' }]}
                  >
                    <Select 
                      placeholder="请选择油罐" 
                      disabled={!selectedStation}
                      onChange={handleTankChange}
                    >
                      {stationTanks.map(tank => (
                        <Option key={tank.id} value={tank.id}>
                          {tank.name} ({tank.oilType})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="oilType"
                    label="油品类型"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="currentVolume"
                    label="当前库存(L)"
                  >
                    <InputNumber disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="volume"
                    label="领用量(L)"
                    rules={[
                      { required: true, message: '请输入领用量' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const currentVolume = getFieldValue('currentVolume');
                          if (!value || !currentVolume || value <= currentVolume) {
                            if (value > 0 && value <= 500) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('单次领用量不能超过500L或小于等于0L'));
                          }
                          return Promise.reject(new Error(`领用量不能超过当前库存 ${currentVolume}L`));
                        },
                      }),
                    ]}
                  >
                    <InputNumber min={1} max={500} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="departmentId"
                    label="使用部门"
                    rules={[{ required: true, message: '请选择使用部门' }]}
                  >
                    <Select placeholder="请选择使用部门">
                      {departments.map(dept => (
                        <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="usageId"
                    label="用途"
                    rules={[{ required: true, message: '请选择用途' }]}
                  >
                    <Select placeholder="请选择用途">
                      {usages.map(usage => (
                        <Option key={usage.id} value={usage.id}>{usage.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="applicant"
                    label="申请人"
                    rules={[{ required: true, message: '请输入申请人姓名' }]}
                  >
                    <Input placeholder="请输入申请人姓名" />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item
                    name="notes"
                    label="备注"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <TextArea rows={3} placeholder="请输入备注信息，说明具体用途" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item wrapperCol={{ offset: 3, span: 20 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    提交申请
                  </Button>
                  <Button onClick={() => form.resetFields()}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane tab="领用记录查询" key="2">
          <Card title="领用记录查询">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input placeholder="搜索单据编号/油站" prefix={<SearchOutlined />} />
              </Col>
              <Col span={4}>
                <Select placeholder="油品类型" style={{ width: '100%' }}>
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select placeholder="状态" style={{ width: '100%' }}>
                  <Option value="待审批">待审批</Option>
                  <Option value="已批准">已批准</Option>
                  <Option value="已拒绝">已拒绝</Option>
                </Select>
              </Col>
              <Col span={6}>
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                  <Button icon={<FileExcelOutlined />}>导出</Button>
                </Space>
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={selfUseRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1500 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SelfUse; 