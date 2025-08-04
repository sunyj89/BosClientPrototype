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
  Alert,
  Statistic,
  Progress
} from 'antd';
import {
  SearchOutlined,
  SaveOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  SwapOutlined,
  SyncOutlined,
  ExclamationCircleOutlined
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

// 模拟加油机数据
const pumps = {
  'BJ001': [
    { id: 'P001', name: '1号加油机', oilTypes: ['92#汽油', '95#汽油'], status: '正常' },
    { id: 'P002', name: '2号加油机', oilTypes: ['92#汽油', '0#柴油'], status: '正常' },
    { id: 'P003', name: '3号加油机', oilTypes: ['95#汽油', '98#汽油'], status: '正常' },
    { id: 'P004', name: '4号加油机', oilTypes: ['92#汽油', '95#汽油'], status: '维护中' }
  ],
  'BJ002': [
    { id: 'P005', name: '1号加油机', oilTypes: ['92#汽油', '95#汽油'], status: '正常' },
    { id: 'P006', name: '2号加油机', oilTypes: ['92#汽油', '0#柴油'], status: '正常' },
    { id: 'P007', name: '3号加油机', oilTypes: ['95#汽油', '98#汽油'], status: '正常' }
  ]
};

// 模拟油罐数据
const tanks = {
  'BJ001': [
    { id: 'T001', name: '1号油罐', oilType: '92#汽油', capacity: 30000, currentVolume: 12500, pumpIds: ['P001', 'P002'] },
    { id: 'T002', name: '2号油罐', oilType: '95#汽油', capacity: 30000, currentVolume: 8300, pumpIds: ['P001', 'P003'] },
    { id: 'T003', name: '3号油罐', oilType: '98#汽油', capacity: 20000, currentVolume: 6200, pumpIds: ['P003'] },
    { id: 'T004', name: '4号油罐', oilType: '0#柴油', capacity: 20000, currentVolume: 5800, pumpIds: ['P002'] }
  ],
  'BJ002': [
    { id: 'T005', name: '1号油罐', oilType: '92#汽油', capacity: 30000, currentVolume: 15600, pumpIds: ['P005', 'P006'] },
    { id: 'T006', name: '2号油罐', oilType: '95#汽油', capacity: 30000, currentVolume: 9800, pumpIds: ['P005', 'P007'] },
    { id: 'T007', name: '3号油罐', oilType: '98#汽油', capacity: 20000, currentVolume: 7300, pumpIds: ['P007'] },
    { id: 'T008', name: '4号油罐', oilType: '0#柴油', capacity: 20000, currentVolume: 8900, pumpIds: ['P006'] }
  ]
};

// 模拟加注记录
const mockRefillRecords = [
  {
    id: 'RF001',
    date: '2023-03-10',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T001',
    tankName: '1号油罐',
    pumpId: 'P001',
    pumpName: '1号加油机',
    oilType: '92#汽油',
    operator: '张经理',
    beforeVolume: 10500,
    afterVolume: 12500,
    refillVolume: 2000,
    status: '已完成',
    notes: '正常加注'
  },
  {
    id: 'RF002',
    date: '2023-03-09',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T002',
    tankName: '2号油罐',
    pumpId: 'P003',
    pumpName: '3号加油机',
    oilType: '95#汽油',
    operator: '李站长',
    beforeVolume: 7300,
    afterVolume: 8300,
    refillVolume: 1000,
    status: '已完成',
    notes: '正常加注'
  },
  {
    id: 'RF003',
    date: '2023-03-08',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankId: 'T005',
    tankName: '1号油罐',
    pumpId: 'P005',
    pumpName: '1号加油机',
    oilType: '92#汽油',
    operator: '王站长',
    beforeVolume: 14600,
    afterVolume: 15600,
    refillVolume: 1000,
    status: '已完成',
    notes: '正常加注'
  },
  {
    id: 'RF004',
    date: '2023-03-07',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankId: 'T008',
    tankName: '4号油罐',
    pumpId: 'P006',
    pumpName: '2号加油机',
    oilType: '0#柴油',
    operator: '赵副站长',
    beforeVolume: 7900,
    afterVolume: 8900,
    refillVolume: 1000,
    status: '已完成',
    notes: '正常加注'
  }
];

const Refill = () => {
  const [form] = Form.useForm();
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTank, setSelectedTank] = useState(null);
  const [stationTanks, setStationTanks] = useState([]);
  const [tankPumps, setTankPumps] = useState([]);
  const [refillRecords, setRefillRecords] = useState(mockRefillRecords);
  const [activeTab, setActiveTab] = useState('1');
  
  // 处理油站选择
  const handleStationChange = (value) => {
    setSelectedStation(value);
    setSelectedTank(null);
    setStationTanks(tanks[value] || []);
    setTankPumps([]);
    form.setFieldsValue({
      tankId: undefined,
      pumpId: undefined,
      oilType: undefined,
      currentVolume: undefined,
      capacity: undefined
    });
  };
  
  // 处理油罐选择
  const handleTankChange = (value) => {
    const selectedTank = stationTanks.find(tank => tank.id === value);
    setSelectedTank(selectedTank);
    
    if (selectedTank) {
      // 获取关联的加油机
      const tankRelatedPumps = pumps[selectedStation]
        .filter(pump => selectedTank.pumpIds.includes(pump.id) && pump.status === '正常')
        .filter(pump => pump.oilTypes.includes(selectedTank.oilType));
        
      setTankPumps(tankRelatedPumps);
      
      form.setFieldsValue({
        oilType: selectedTank.oilType,
        currentVolume: selectedTank.currentVolume,
        capacity: selectedTank.capacity,
        pumpId: undefined
      });
    } else {
      setTankPumps([]);
    }
  };
  
  // 提交表单
  const handleSubmit = (values) => {
    console.log('提交的表单数据:', values);
    
    // 获取选中的油站、油罐和加油机名称
    const station = stations.find(s => s.id === values.stationId);
    const tank = stationTanks.find(t => t.id === values.tankId);
    const pump = tankPumps.find(p => p.id === values.pumpId);
    
    // 创建新的加注记录
    const newRecord = {
      id: `RF${String(refillRecords.length + 1).padStart(3, '0')}`,
      date: values.date.format('YYYY-MM-DD'),
      stationId: values.stationId,
      stationName: station ? station.name : '',
      tankId: values.tankId,
      tankName: tank ? tank.name : '',
      pumpId: values.pumpId,
      pumpName: pump ? pump.name : '',
      oilType: values.oilType,
      operator: values.operator,
      beforeVolume: values.currentVolume,
      afterVolume: values.currentVolume + values.refillVolume,
      refillVolume: values.refillVolume,
      status: '已完成',
      notes: values.notes || '正常加注'
    };
    
    // 更新加注记录列表
    setRefillRecords([newRecord, ...refillRecords]);
    
    // 显示成功消息
    message.success('加注操作已完成');
    
    // 重置表单
    form.resetFields();
    setSelectedStation(null);
    setSelectedTank(null);
    setStationTanks([]);
    setTankPumps([]);
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
      title: '加油机',
      dataIndex: 'pumpName',
      key: 'pumpName',
      width: 100,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '操作前库存(L)',
      dataIndex: 'beforeVolume',
      key: 'beforeVolume',
      width: 130,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '加注量(L)',
      dataIndex: 'refillVolume',
      key: 'refillVolume',
      width: 100,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '操作后库存(L)',
      dataIndex: 'afterVolume',
      key: 'afterVolume',
      width: 130,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status) => {
        if (status === '已完成') {
          return <Tag color="green" icon={<CheckCircleOutlined />}>已完成</Tag>;
        } else if (status === '进行中') {
          return <Tag color="blue" icon={<SyncOutlined spin />}>进行中</Tag>;
        } else {
          return <Tag color="red" icon={<ExclamationCircleOutlined />}>{status}</Tag>;
        }
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
      render: () => (
        <Space size="small">
          <Button type="link" size="small" icon={<PrinterOutlined />}>打印</Button>
        </Space>
      ),
    },
  ];

  // 计算油罐信息
  const getTankInfo = () => {
    if (!selectedTank) return null;
    
    const percentFilled = Math.round((selectedTank.currentVolume / selectedTank.capacity) * 100);
    
    return {
      percentFilled,
      availablePumps: tankPumps.length
    };
  };
  
  const tankInfo = getTankInfo();

  return (
    <div className="refill">
      <Title level={2}>油罐加注管理</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="油罐加注操作" key="1">
          <Card title="油罐加注" style={{ marginBottom: 16 }}>
            <Alert
              message="油罐加注说明"
              description="油罐加注是指将油罐中的油品加注到加油机中，以供加油使用。请选择油站、油罐和加油机，并记录加注量。"
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
                    label="操作日期"
                    rules={[{ required: true, message: '请选择操作日期' }]}
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
                    name="pumpId"
                    label="加油机"
                    rules={[{ required: true, message: '请选择加油机' }]}
                  >
                    <Select 
                      placeholder="请选择加油机" 
                      disabled={!selectedTank || tankPumps.length === 0}
                    >
                      {tankPumps.map(pump => (
                        <Option key={pump.id} value={pump.id}>
                          {pump.name}
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
                    name="operator"
                    label="操作员"
                    rules={[{ required: true, message: '请输入操作员姓名' }]}
                  >
                    <Input placeholder="请输入操作员姓名" />
                  </Form.Item>
                </Col>
                
                {tankInfo && (
                  <>
                    <Col span={24}>
                      <div style={{ background: '#f5f5f5', padding: '10px', marginBottom: '16px' }}>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Statistic 
                              title="当前库存"
                              value={selectedTank.currentVolume}
                              suffix="L"
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic 
                              title="总容量"
                              value={selectedTank.capacity}
                              suffix="L"
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic 
                              title="可用加油机数量"
                              value={tankInfo.availablePumps}
                              suffix="台"
                            />
                          </Col>
                          <Col span={24} style={{ marginTop: 16 }}>
                            <div>
                              <span>油罐储量: {tankInfo.percentFilled}%</span>
                              <Progress 
                                percent={tankInfo.percentFilled}
                                status={tankInfo.percentFilled < 20 ? 'exception' : 'normal'}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </>
                )}
                
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
                    name="capacity"
                    label="油罐容量(L)"
                  >
                    <InputNumber disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="refillVolume"
                    label="加注量(L)"
                    rules={[
                      { required: true, message: '请输入加注量' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const currentVolume = getFieldValue('currentVolume');
                          if (!value) return Promise.resolve();
                          
                          if (value <= 0) {
                            return Promise.reject(new Error('加注量必须大于0'));
                          }
                          
                          if (value > currentVolume) {
                            return Promise.reject(new Error(`加注量不能超过当前库存 ${currentVolume}L`));
                          }
                          
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item
                    name="notes"
                    label="备注"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <TextArea rows={3} placeholder="请输入备注信息" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item wrapperCol={{ offset: 3, span: 20 }}>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SwapOutlined />}
                    disabled={!selectedTank || tankPumps.length === 0}
                  >
                    执行加注操作
                  </Button>
                  <Button onClick={() => form.resetFields()}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane tab="加注记录查询" key="2">
          <Card title="加注记录查询">
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
              <Col span={6}>
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                  <Button icon={<FileExcelOutlined />}>导出</Button>
                </Space>
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={refillRecords}
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

export default Refill; 