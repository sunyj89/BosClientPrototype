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
  Divider,
  Tag,
  message,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  SaveOutlined, 
  PrinterOutlined,
  UploadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

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

// 模拟供应商数据
const suppliers = [
  { id: 'S001', name: '中国石化', code: 'SINOPEC001' },
  { id: 'S002', name: '中国石油', code: 'CNPC002' },
  { id: 'S003', name: '中国海油', code: 'CNOOC003' },
  { id: 'S004', name: '壳牌石油', code: 'SHELL004' }
];

// 模拟入库记录
const mockInputRecords = [
  {
    id: 'IN001',
    date: '2023-03-10',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T001',
    tankName: '1号油罐',
    oilType: '92#汽油',
    volume: 8000,
    supplierId: 'S001',
    supplierName: '中国石化',
    operator: '张经理',
    status: '已完成',
    vehicleNo: '京A12345',
    notes: '正常入库'
  },
  {
    id: 'IN002',
    date: '2023-03-09',
    stationId: 'SH001',
    stationName: '上海黄浦油站',
    tankId: 'T010',
    tankName: '2号油罐',
    oilType: '95#汽油',
    volume: 9000,
    supplierId: 'S002',
    supplierName: '中国石油',
    operator: '李站长',
    status: '已完成',
    vehicleNo: '沪A54321',
    notes: '正常入库'
  },
  {
    id: 'IN003',
    date: '2023-03-09',
    stationId: 'SH001',
    stationName: '上海黄浦油站',
    tankId: 'T011',
    tankName: '3号油罐',
    oilType: '98#汽油',
    volume: 6000,
    supplierId: 'S002',
    supplierName: '中国石油',
    operator: '李站长',
    status: '已完成',
    vehicleNo: '沪A54321',
    notes: '正常入库'
  },
  {
    id: 'IN004',
    date: '2023-03-08',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankId: 'T008',
    tankName: '4号油罐',
    oilType: '0#柴油',
    volume: 6000,
    supplierId: 'S001',
    supplierName: '中国石化',
    operator: '王副站长',
    status: '已完成',
    vehicleNo: '京B54321',
    notes: '正常入库'
  }
];

const OilInput = () => {
  const [form] = Form.useForm();
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationTanks, setStationTanks] = useState([]);
  const [inputRecords, setInputRecords] = useState(mockInputRecords);
  
  // 处理油站选择
  const handleStationChange = (value) => {
    setSelectedStation(value);
    setStationTanks(tanks[value] || []);
    form.setFieldsValue({ tankId: undefined });
  };
  
  // 处理油罐选择
  const handleTankChange = (value) => {
    const selectedTank = stationTanks.find(tank => tank.id === value);
    if (selectedTank) {
      form.setFieldsValue({
        oilType: selectedTank.oilType,
        currentVolume: selectedTank.currentVolume,
        remainingCapacity: selectedTank.capacity - selectedTank.currentVolume
      });
    }
  };
  
  // 提交表单
  const handleSubmit = (values) => {
    console.log('提交的表单数据:', values);
    
    // 获取选中的油站和油罐名称
    const station = stations.find(s => s.id === values.stationId);
    const tank = stationTanks.find(t => t.id === values.tankId);
    
    // 获取选中的供应商名称
    const supplier = suppliers.find(s => s.id === values.supplierId);
    
    // 创建新的入库记录
    const newRecord = {
      id: `IN${String(inputRecords.length + 1).padStart(3, '0')}`,
      date: values.date.format('YYYY-MM-DD'),
      stationId: values.stationId,
      stationName: station ? station.name : '',
      tankId: values.tankId,
      tankName: tank ? tank.name : '',
      oilType: values.oilType,
      volume: values.volume,
      supplierId: values.supplierId,
      supplierName: supplier ? supplier.name : '',
      operator: values.operator,
      status: '已完成',
      vehicleNo: values.vehicleNo,
      notes: values.notes || '正常入库'
    };
    
    // 更新入库记录列表
    setInputRecords([newRecord, ...inputRecords]);
    
    // 显示成功消息
    message.success('油品入库单创建成功');
    
    // 重置表单
    form.resetFields();
    setSelectedStation(null);
    setStationTanks([]);
  };
  
  // 表格列定义
  const columns = [
    {
      title: '入库单号',
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
      title: '入库量(L)',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
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
      render: (status) => (
        <Tag color={status === '已完成' ? 'green' : 'blue'} icon={status === '已完成' ? <CheckCircleOutlined /> : null}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="link" size="small" icon={<PrinterOutlined />}>打印</Button>
          <Button type="link" size="small" icon={<UploadOutlined />}>导出</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="oil-input">
      <Title level={2}>油品入库管理</Title>
      
      <Card title="新增入库单" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleSubmit}
          initialValues={{
            date: moment(),
            oilSource: '外部采购'
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
                label="入库日期"
                rules={[{ required: true, message: '请选择入库日期' }]}
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
                name="remainingCapacity"
                label="剩余容量(L)"
              >
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="volume"
                label="入库量(L)"
                rules={[
                  { required: true, message: '请输入入库量' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const remainingCapacity = getFieldValue('remainingCapacity');
                      if (!value || !remainingCapacity || value <= remainingCapacity) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(`入库量不能超过剩余容量 ${remainingCapacity}L`));
                    },
                  }),
                ]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="oilSource"
                label="油品来源"
                rules={[{ required: true, message: '请选择油品来源' }]}
              >
                <Select placeholder="请选择油品来源">
                  <Option value="外部采购">外部采购</Option>
                  <Option value="站间调拨">站间调拨</Option>
                  <Option value="库存调整">库存调整</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="supplierId"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select 
                  placeholder="请选择供应商"
                  showSearch
                  optionFilterProp="children"
                >
                  {suppliers.map(supplier => (
                    <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
                  ))}
                </Select>
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
                label="操作员"
                rules={[{ required: true, message: '请输入操作员姓名' }]}
              >
                <Input placeholder="请输入操作员姓名" />
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
                保存入库单
              </Button>
              <Button icon={<PrinterOutlined />}>
                打印入库单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="入库记录查询">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input placeholder="搜索入库单号/油站" prefix={<SearchOutlined />} />
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
              <Button icon={<UploadOutlined />}>导出数据</Button>
            </Space>
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={inputRecords}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1500 }}
        />
      </Card>
    </div>
  );
};

export default OilInput; 