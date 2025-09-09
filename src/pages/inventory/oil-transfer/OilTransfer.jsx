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
  SwapOutlined,
  SearchOutlined,
  SaveOutlined,
  PrinterOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined
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
  ],
  'SH001': [
    { id: 'T009', name: '1号油罐', oilType: '92#汽油', capacity: 40000, currentVolume: 10200 },
    { id: 'T010', name: '2号油罐', oilType: '95#汽油', capacity: 40000, currentVolume: 15800 },
    { id: 'T011', name: '3号油罐', oilType: '98#汽油', capacity: 30000, currentVolume: 9500 }
  ]
};

// 模拟油品调拨记录
const mockTransferRecords = [
  {
    id: 'TR001',
    date: '2023-03-07',
    fromStationId: 'BJ001',
    fromStationName: '北京海淀油站',
    fromTankId: 'T001',
    fromTankName: '1号油罐',
    toStationId: 'BJ002',
    toStationName: '北京朝阳油站',
    toTankId: 'T005',
    toTankName: '1号油罐',
    oilType: '92#汽油',
    volume: 5000,
    reason: '油品调配',
    operator: '张经理',
    status: '已完成',
    vehicleNo: '京A12345',
    notes: '正常调拨'
  },
  {
    id: 'TR002',
    date: '2023-03-06',
    fromStationId: 'BJ001',
    fromStationName: '北京海淀油站',
    fromTankId: 'T002',
    fromTankName: '2号油罐',
    toStationId: 'BJ002',
    toStationName: '北京朝阳油站',
    toTankId: 'T006',
    toTankName: '2号油罐',
    oilType: '95#汽油',
    volume: 4000,
    reason: '油品调配',
    operator: '李站长',
    status: '已完成',
    vehicleNo: '京A54321',
    notes: '正常调拨'
  },
  {
    id: 'TR003',
    date: '2023-03-08',
    fromStationId: 'SH001',
    fromStationName: '上海黄浦油站',
    fromTankId: 'T010',
    fromTankName: '2号油罐',
    toStationId: 'SH002',
    toStationName: '上海浦东油站',
    toTankId: 'T014',
    toTankName: '1号油罐',
    oilType: '95#汽油',
    volume: 6000,
    reason: '油品调配',
    operator: '王经理',
    status: '运输中',
    vehicleNo: '沪B12345',
    notes: '正在运输中'
  },
  {
    id: 'TR004',
    date: '2023-03-09',
    fromStationId: 'BJ002',
    fromStationName: '北京朝阳油站',
    fromTankId: 'T007',
    fromTankName: '3号油罐',
    toStationId: 'BJ001',
    toStationName: '北京海淀油站',
    toTankId: 'T003',
    toTankName: '3号油罐',
    oilType: '98#汽油',
    volume: 3000,
    reason: '油品平衡',
    operator: '赵副站长',
    status: '审批中',
    vehicleNo: '京B54321',
    notes: '等待审批'
  }
];

const OilTransfer = () => {
  const [form] = Form.useForm();
  const [fromStationId, setFromStationId] = useState(null);
  const [toStationId, setToStationId] = useState(null);
  const [fromStationTanks, setFromStationTanks] = useState([]);
  const [toStationTanks, setToStationTanks] = useState([]);
  const [transferRecords, setTransferRecords] = useState(mockTransferRecords);
  const [activeTab, setActiveTab] = useState('1');
  
  // 处理调出油站选择
  const handleFromStationChange = (value) => {
    setFromStationId(value);
    setFromStationTanks(tanks[value] || []);
    form.setFieldsValue({ fromTankId: undefined, oilType: undefined, currentFromVolume: undefined });
  };
  
  // 处理调入油站选择
  const handleToStationChange = (value) => {
    setToStationId(value);
    setToStationTanks(tanks[value] || []);
    form.setFieldsValue({ toTankId: undefined, remainingToCapacity: undefined });
  };
  
  // 处理调出油罐选择
  const handleFromTankChange = (value) => {
    const selectedTank = fromStationTanks.find(tank => tank.id === value);
    if (selectedTank) {
      form.setFieldsValue({
        oilType: selectedTank.oilType,
        currentFromVolume: selectedTank.currentVolume,
      });
    }
    
    // 根据油品类型筛选调入油罐
    if (toStationTanks.length > 0 && selectedTank) {
      const compatibleTanks = toStationTanks.filter(tank => tank.oilType === selectedTank.oilType);
      if (compatibleTanks.length === 0) {
        message.warning('调入油站没有匹配的油品类型油罐');
      }
    }
  };
  
  // 处理调入油罐选择
  const handleToTankChange = (value) => {
    const selectedTank = toStationTanks.find(tank => tank.id === value);
    if (selectedTank) {
      form.setFieldsValue({
        remainingToCapacity: selectedTank.capacity - selectedTank.currentVolume
      });
    }
  };
  
  // 提交表单
  const handleSubmit = (values) => {
    console.log('提交的表单数据:', values);
    
    // 获取选中的油站和油罐名称
    const fromStation = stations.find(s => s.id === values.fromStationId);
    const fromTank = fromStationTanks.find(t => t.id === values.fromTankId);
    const toStation = stations.find(s => s.id === values.toStationId);
    const toTank = toStationTanks.find(t => t.id === values.toTankId);
    
    // 创建新的调拨记录
    const newRecord = {
      id: `TR${String(transferRecords.length + 1).padStart(3, '0')}`,
      date: values.date.format('YYYY-MM-DD'),
      fromStationId: values.fromStationId,
      fromStationName: fromStation ? fromStation.name : '',
      fromTankId: values.fromTankId,
      fromTankName: fromTank ? fromTank.name : '',
      toStationId: values.toStationId,
      toStationName: toStation ? toStation.name : '',
      toTankId: values.toTankId,
      toTankName: toTank ? toTank.name : '',
      oilType: values.oilType,
      volume: values.volume,
      reason: values.reason,
      operator: values.operator,
      status: '审批中',
      vehicleNo: values.vehicleNo,
      notes: values.notes || '等待审批'
    };
    
    // 更新调拨记录列表
    setTransferRecords([newRecord, ...transferRecords]);
    
    // 显示成功消息
    message.success('油品调拨申请已提交，等待审批');
    
    // 重置表单
    form.resetFields();
    setFromStationId(null);
    setToStationId(null);
    setFromStationTanks([]);
    setToStationTanks([]);
  };
  
  // 表格列定义
  const columns = [
    {
      title: '调拨单号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 110,
    },
    {
      title: '调出油站',
      dataIndex: 'fromStationName',
      key: 'fromStationName',
      width: 150,
    },
    {
      title: '调出油罐',
      dataIndex: 'fromTankName',
      key: 'fromTankName',
      width: 100,
    },
    {
      title: '调入油站',
      dataIndex: 'toStationName',
      key: 'toStationName',
      width: 150,
    },
    {
      title: '调入油罐',
      dataIndex: 'toTankName',
      key: 'toTankName',
      width: 100,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '调拨量(L)',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      width: 100,
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
        let color = 'green';
        let icon = <CheckCircleOutlined />;
        
        if (status === '审批中') {
          color = 'blue';
          icon = <FilterOutlined />;
        } else if (status === '运输中') {
          color = 'orange';
          icon = <LoadingOutlined />;
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
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<PrinterOutlined />}>打印</Button>
          {record.status === '审批中' && (
            <Button type="link" size="small" danger>取消</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="oil-transfer">
      <Title level={2}>油品调拨管理</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
        <TabPane tab="提交调拨申请" key="1">
          <Card title="新增调拨单" style={{ marginBottom: 16 }}>
            <Alert
              message="温馨提示"
              description="油品调拨需要由调出油站负责人提交申请，经审批后执行。请确保油品类型匹配，并检查调入油罐的剩余容量是否足够。"
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
                reason: '油品调配'
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label="调拨日期"
                    rules={[{ required: true, message: '请选择调拨日期' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="reason"
                    label="调拨原因"
                    rules={[{ required: true, message: '请选择调拨原因' }]}
                  >
                    <Select placeholder="请选择调拨原因">
                      <Option value="油品调配">油品调配</Option>
                      <Option value="油品平衡">油品平衡</Option>
                      <Option value="临时需求">临时需求</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <div style={{ padding: '8px 0', textAlign: 'center', background: '#f5f5f5', marginBottom: 16 }}>
                    <b>调出信息</b>
                  </div>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="fromStationId"
                    label="调出油站"
                    rules={[{ required: true, message: '请选择调出油站' }]}
                  >
                    <Select 
                      placeholder="请选择调出油站" 
                      onChange={handleFromStationChange}
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
                    name="fromTankId"
                    label="调出油罐"
                    rules={[{ required: true, message: '请选择调出油罐' }]}
                  >
                    <Select 
                      placeholder="请选择调出油罐" 
                      disabled={!fromStationId}
                      onChange={handleFromTankChange}
                    >
                      {fromStationTanks.map(tank => (
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
                    name="currentFromVolume"
                    label="当前库存(L)"
                  >
                    <InputNumber disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <div style={{ padding: '8px 0', textAlign: 'center', background: '#f5f5f5', marginBottom: 16 }}>
                    <b>调入信息</b>
                  </div>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="toStationId"
                    label="调入油站"
                    rules={[
                      { required: true, message: '请选择调入油站' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value !== getFieldValue('fromStationId')) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('调入油站不能与调出油站相同'));
                        },
                      }),
                    ]}
                  >
                    <Select 
                      placeholder="请选择调入油站" 
                      onChange={handleToStationChange}
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
                    name="toTankId"
                    label="调入油罐"
                    rules={[{ required: true, message: '请选择调入油罐' }]}
                  >
                    <Select 
                      placeholder="请选择调入油罐" 
                      disabled={!toStationId}
                      onChange={handleToTankChange}
                    >
                      {toStationTanks
                        .filter(tank => form.getFieldValue('oilType') ? tank.oilType === form.getFieldValue('oilType') : true)
                        .map(tank => (
                          <Option key={tank.id} value={tank.id}>
                            {tank.name} ({tank.oilType})
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="remainingToCapacity"
                    label="剩余容量(L)"
                  >
                    <InputNumber disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="volume"
                    label="调拨量(L)"
                    rules={[
                      { required: true, message: '请输入调拨量' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) return Promise.resolve();
                          
                          const currentFromVolume = getFieldValue('currentFromVolume');
                          const remainingToCapacity = getFieldValue('remainingToCapacity');
                          
                          if (!currentFromVolume || value <= currentFromVolume) {
                            if (!remainingToCapacity || value <= remainingToCapacity) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`调拨量不能超过调入油罐剩余容量 ${remainingToCapacity}L`));
                          }
                          return Promise.reject(new Error(`调拨量不能超过调出油罐当前库存 ${currentFromVolume}L`));
                        },
                      }),
                    ]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="vehicleNo"
                    label="运输车牌号"
                    rules={[{ required: true, message: '请输入运输车牌号' }]}
                  >
                    <Input placeholder="请输入运输车牌号" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="operator"
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
                    <TextArea rows={3} placeholder="请输入备注信息" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item wrapperCol={{ offset: 3, span: 20 }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    提交调拨申请
                  </Button>
                  <Button icon={<SwapOutlined />} onClick={() => form.resetFields()}>
                    重置表单
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane tab="调拨记录查询" key="2">
          <Card title="调拨记录查询">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Input placeholder="搜索调拨单号/油站" prefix={<SearchOutlined />} />
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
                  <Option value="已完成">已完成</Option>
                  <Option value="运输中">运输中</Option>
                  <Option value="审批中">审批中</Option>
                  <Option value="已拒绝">已拒绝</Option>
                </Select>
              </Col>
              <Col span={6}>
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                </Space>
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={transferRecords}
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

export default OilTransfer; 