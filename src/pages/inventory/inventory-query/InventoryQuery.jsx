import React, { useState } from 'react';
import {
  Card,
  Table,
  Form,
  Select,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Progress,
  Statistic,
  InputNumber,
  Tag,
  DatePicker,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  FileExcelOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 模拟油站数据
const stations = [
  { id: 'BJ001', name: '北京海淀油站' },
  { id: 'BJ002', name: '北京朝阳油站' },
  { id: 'SH001', name: '上海黄浦油站' },
  { id: 'SH002', name: '上海浦东油站' },
  { id: 'GZ001', name: '广州天河油站' },
  { id: 'GZ002', name: '广州海珠油站' }
];

// 模拟油罐库存数据
const tankInventoryData = [
  {
    id: 'T001',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankName: '1号油罐',
    oilType: '92#汽油',
    capacity: 30000,
    currentVolume: 12500,
    alarmThreshold: 5000,
    lastUpdateTime: '2023-03-10 08:30:00',
    status: '正常'
  },
  {
    id: 'T002',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankName: '2号油罐',
    oilType: '95#汽油',
    capacity: 30000,
    currentVolume: 4300,
    alarmThreshold: 5000,
    lastUpdateTime: '2023-03-10 08:30:00',
    status: '警告'
  },
  {
    id: 'T003',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankName: '3号油罐',
    oilType: '98#汽油',
    capacity: 20000,
    currentVolume: 6200,
    alarmThreshold: 4000,
    lastUpdateTime: '2023-03-10 08:30:00',
    status: '正常'
  },
  {
    id: 'T004',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankName: '4号油罐',
    oilType: '0#柴油',
    capacity: 20000,
    currentVolume: 5800,
    alarmThreshold: 4000,
    lastUpdateTime: '2023-03-10 08:30:00',
    status: '正常'
  },
  {
    id: 'T005',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankName: '1号油罐',
    oilType: '92#汽油',
    capacity: 30000,
    currentVolume: 15600,
    alarmThreshold: 5000,
    lastUpdateTime: '2023-03-10 09:15:00',
    status: '正常'
  },
  {
    id: 'T006',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankName: '2号油罐',
    oilType: '95#汽油',
    capacity: 30000,
    currentVolume: 9800,
    alarmThreshold: 5000,
    lastUpdateTime: '2023-03-10 09:15:00',
    status: '正常'
  },
  {
    id: 'T007',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankName: '3号油罐',
    oilType: '98#汽油',
    capacity: 20000,
    currentVolume: 7300,
    alarmThreshold: 4000,
    lastUpdateTime: '2023-03-10 09:15:00',
    status: '正常'
  },
  {
    id: 'T008',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankName: '4号油罐',
    oilType: '0#柴油',
    capacity: 20000,
    currentVolume: 8900,
    alarmThreshold: 4000,
    lastUpdateTime: '2023-03-10 09:15:00',
    status: '正常'
  },
  {
    id: 'T009',
    stationId: 'SH001',
    stationName: '上海黄浦油站',
    tankName: '1号油罐',
    oilType: '92#汽油',
    capacity: 40000,
    currentVolume: 3200,
    alarmThreshold: 6000,
    lastUpdateTime: '2023-03-10 08:45:00',
    status: '警告'
  },
  {
    id: 'T010',
    stationId: 'SH001',
    stationName: '上海黄浦油站',
    tankName: '2号油罐',
    oilType: '95#汽油',
    capacity: 40000,
    currentVolume: 15800,
    alarmThreshold: 6000,
    lastUpdateTime: '2023-03-10 08:45:00',
    status: '正常'
  },
  {
    id: 'T011',
    stationId: 'SH001',
    stationName: '上海黄浦油站',
    tankName: '3号油罐',
    oilType: '98#汽油',
    capacity: 30000,
    currentVolume: 9500,
    alarmThreshold: 5000,
    lastUpdateTime: '2023-03-10 08:45:00',
    status: '正常'
  },
  {
    id: 'T012',
    stationId: 'SH002',
    stationName: '上海浦东油站',
    tankName: '1号油罐',
    oilType: '92#汽油',
    capacity: 40000,
    currentVolume: 18200,
    alarmThreshold: 6000,
    lastUpdateTime: '2023-03-10 09:30:00',
    status: '正常'
  },
  {
    id: 'T013',
    stationId: 'SH002',
    stationName: '上海浦东油站',
    tankName: '2号油罐',
    oilType: '95#汽油',
    capacity: 40000,
    currentVolume: 13600,
    alarmThreshold: 6000,
    lastUpdateTime: '2023-03-10 09:30:00',
    status: '正常'
  }
];

// 模拟库存流水记录
const inventoryTransactions = [
  {
    id: 'IT001',
    date: '2023-03-10',
    time: '08:30:00',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T001',
    tankName: '1号油罐',
    oilType: '92#汽油',
    transactionType: '入库',
    volume: 8000,
    balanceVolume: 12500,
    operator: '张经理',
    relatedDocNo: 'IN001',
    notes: '正常入库'
  },
  {
    id: 'IT002',
    date: '2023-03-09',
    time: '17:30:00',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T001',
    tankName: '1号油罐',
    oilType: '92#汽油',
    transactionType: '销售',
    volume: -2350,
    balanceVolume: 4500,
    operator: '系统',
    relatedDocNo: '',
    notes: '日终结算'
  },
  {
    id: 'IT003',
    date: '2023-03-09',
    time: '08:30:00',
    stationId: 'SH001',
    stationName: '上海黄浦油站',
    tankId: 'T010',
    tankName: '2号油罐',
    oilType: '95#汽油',
    transactionType: '入库',
    volume: 9000,
    balanceVolume: 15800,
    operator: '李站长',
    relatedDocNo: 'IN002',
    notes: '正常入库'
  },
  {
    id: 'IT004',
    date: '2023-03-08',
    time: '16:45:00',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankId: 'T008',
    tankName: '4号油罐',
    oilType: '0#柴油',
    transactionType: '入库',
    volume: 6000,
    balanceVolume: 8900,
    operator: '王副站长',
    relatedDocNo: 'IN004',
    notes: '正常入库'
  },
  {
    id: 'IT005',
    date: '2023-03-08',
    time: '14:30:00',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankId: 'T005',
    tankName: '1号油罐',
    oilType: '92#汽油',
    transactionType: '销售',
    volume: -1800,
    balanceVolume: 15600,
    operator: '系统',
    relatedDocNo: '',
    notes: '日间结算'
  },
  {
    id: 'IT006',
    date: '2023-03-07',
    time: '10:20:00',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T001',
    tankName: '1号油罐',
    oilType: '92#汽油',
    transactionType: '调出',
    volume: -5000,
    balanceVolume: 6850,
    operator: '张经理',
    relatedDocNo: 'TR001',
    notes: '调往北京朝阳油站'
  },
  {
    id: 'IT007',
    date: '2023-03-07',
    time: '14:15:00',
    stationId: 'BJ002',
    stationName: '北京朝阳油站',
    tankId: 'T005',
    tankName: '1号油罐',
    oilType: '92#汽油',
    transactionType: '调入',
    volume: 5000,
    balanceVolume: 17400,
    operator: '李站长',
    relatedDocNo: 'TR001',
    notes: '来自北京海淀油站'
  },
  {
    id: 'IT008',
    date: '2023-03-06',
    time: '09:45:00',
    stationId: 'BJ001',
    stationName: '北京海淀油站',
    tankId: 'T002',
    tankName: '2号油罐',
    oilType: '95#汽油',
    transactionType: '调出',
    volume: -4000,
    balanceVolume: 8300,
    operator: '张经理',
    relatedDocNo: 'TR002',
    notes: '调往北京朝阳油站'
  }
];

const InventoryQuery = () => {
  const [form] = Form.useForm();
  const [inventoryData, setInventoryData] = useState(tankInventoryData);
  const [transactionData, setTransactionData] = useState(inventoryTransactions);
  const [activeTab, setActiveTab] = useState('1');
  
  // 查询油罐库存
  const handleSearchInventory = (values) => {
    console.log('库存查询条件:', values);
    
    let filteredData = [...tankInventoryData];
    
    if (values.stationId) {
      filteredData = filteredData.filter(item => item.stationId === values.stationId);
    }
    
    if (values.oilType) {
      filteredData = filteredData.filter(item => item.oilType === values.oilType);
    }
    
    if (values.status) {
      filteredData = filteredData.filter(item => item.status === values.status);
    }
    
    if (values.volumeRange) {
      if (values.volumeRange[0]) {
        filteredData = filteredData.filter(item => item.currentVolume >= values.volumeRange[0]);
      }
      if (values.volumeRange[1]) {
        filteredData = filteredData.filter(item => item.currentVolume <= values.volumeRange[1]);
      }
    }
    
    setInventoryData(filteredData);
  };
  
  // 查询库存流水
  const handleSearchTransactions = (values) => {
    console.log('流水查询条件:', values);
    
    let filteredData = [...inventoryTransactions];
    
    if (values.stationId) {
      filteredData = filteredData.filter(item => item.stationId === values.stationId);
    }
    
    if (values.oilType) {
      filteredData = filteredData.filter(item => item.oilType === values.oilType);
    }
    
    if (values.transactionType) {
      filteredData = filteredData.filter(item => item.transactionType === values.transactionType);
    }
    
    if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
      const startDate = values.dateRange[0].format('YYYY-MM-DD');
      const endDate = values.dateRange[1].format('YYYY-MM-DD');
      
      filteredData = filteredData.filter(item => {
        return item.date >= startDate && item.date <= endDate;
      });
    }
    
    setTransactionData(filteredData);
  };
  
  // 重置表单
  const handleReset = () => {
    form.resetFields();
    
    if (activeTab === '1') {
      setInventoryData(tankInventoryData);
    } else {
      setTransactionData(inventoryTransactions);
    }
  };
  
  // 油罐库存表格列
  const inventoryColumns = [
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
      title: '容量(L)',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (capacity) => capacity.toLocaleString(),
    },
    {
      title: '当前库存(L)',
      dataIndex: 'currentVolume',
      key: 'currentVolume',
      width: 120,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '库存占比',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 200,
      render: (_, record) => {
        const percent = Math.round((record.currentVolume / record.capacity) * 100);
        let status = 'normal';
        
        if (percent <= 20) {
          status = 'exception';
        } else if (percent <= 30) {
          status = 'warning';
        }
        
        return (
          <div>
            <Progress 
              percent={percent} 
              size="small" 
              status={status}
              format={percent => `${percent}%`}
            />
          </div>
        );
      },
    },
    {
      title: '警戒值(L)',
      dataIndex: 'alarmThreshold',
      key: 'alarmThreshold',
      width: 100,
      render: (threshold) => threshold.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        if (status === '警告') {
          return <Tag color="orange" icon={<WarningOutlined />}>警告</Tag>;
        } else if (status === '正常') {
          return <Tag color="green" icon={<CheckCircleOutlined />}>正常</Tag>;
        } else {
          return <Tag color="red" icon={<InfoCircleOutlined />}>{status}</Tag>;
        }
      },
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 160,
    },
  ];

  // 库存流水表格列
  const transactionColumns = [
    {
      title: '流水号',
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
      title: '时间',
      dataIndex: 'time',
      key: 'time',
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
      title: '业务类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 100,
      render: (type) => {
        let color = 'blue';
        let icon = null;
        
        if (type === '入库' || type === '调入') {
          color = 'green';
          icon = <AreaChartOutlined />;
        } else if (type === '销售' || type === '调出' || type === '自用') {
          color = 'orange';
          icon = <BarChartOutlined />;
        }
        
        return <Tag color={color} icon={icon}>{type}</Tag>;
      },
    },
    {
      title: '数量(L)',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (volume) => {
        const color = volume > 0 ? '#3f8600' : '#cf1322';
        return <span style={{ color }}>{volume.toLocaleString()}</span>;
      },
    },
    {
      title: '结存(L)',
      dataIndex: 'balanceVolume',
      key: 'balanceVolume',
      width: 100,
      render: (volume) => volume.toLocaleString(),
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '关联单号',
      dataIndex: 'relatedDocNo',
      key: 'relatedDocNo',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
    },
  ];

  // 统计信息
  const calculateStatistics = () => {
    const totalVolume = inventoryData.reduce((sum, item) => sum + item.currentVolume, 0);
    const totalCapacity = inventoryData.reduce((sum, item) => sum + item.capacity, 0);
    const warningCount = inventoryData.filter(item => item.status === '警告').length;
    const oilTypes = [...new Set(inventoryData.map(item => item.oilType))];
    
    return {
      totalVolume,
      totalCapacity,
      warningCount,
      oilTypeCount: oilTypes.length,
      tankCount: inventoryData.length,
      usagePercentage: Math.round((totalVolume / totalCapacity) * 100)
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="inventory-query">
      <Title level={2}>库存查询</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="油罐库存查询" key="1">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总库存量"
                  value={stats.totalVolume}
                  suffix="L"
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总容量"
                  value={stats.totalCapacity}
                  suffix="L"
                  precision={0}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="油罐数量"
                  value={stats.tankCount}
                  suffix="个"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="警告数量"
                  value={stats.warningCount}
                  suffix="个"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Card style={{ marginTop: 16 }}>
            <Form
              form={form}
              layout="horizontal"
              onFinish={handleSearchInventory}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name="stationId" label="油站">
                    <Select placeholder="请选择油站" allowClear>
                      {stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="oilType" label="油品类型">
                    <Select placeholder="请选择油品类型" allowClear>
                      <Option value="92#汽油">92#汽油</Option>
                      <Option value="95#汽油">95#汽油</Option>
                      <Option value="98#汽油">98#汽油</Option>
                      <Option value="0#柴油">0#柴油</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="status" label="状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="正常">正常</Option>
                      <Option value="警告">警告</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="volumeRange" label="库存范围">
                    <Space>
                      <InputNumber placeholder="最小" style={{ width: 100 }} />
                      <Text>-</Text>
                      <InputNumber placeholder="最大" style={{ width: 100 }} />
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button onClick={handleReset}>
                      重置
                    </Button>
                    <Button icon={<FileExcelOutlined />}>
                      导出Excel
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
          
          <Card style={{ marginTop: 16 }}>
            <Table
              columns={inventoryColumns}
              dataSource={inventoryData}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1300 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="库存流水查询" key="2">
          <Card>
            <Form
              form={form}
              layout="horizontal"
              onFinish={handleSearchTransactions}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name="stationId" label="油站">
                    <Select placeholder="请选择油站" allowClear>
                      {stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="oilType" label="油品类型">
                    <Select placeholder="请选择油品类型" allowClear>
                      <Option value="92#汽油">92#汽油</Option>
                      <Option value="95#汽油">95#汽油</Option>
                      <Option value="98#汽油">98#汽油</Option>
                      <Option value="0#柴油">0#柴油</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="transactionType" label="业务类型">
                    <Select placeholder="请选择业务类型" allowClear>
                      <Option value="入库">入库</Option>
                      <Option value="销售">销售</Option>
                      <Option value="调入">调入</Option>
                      <Option value="调出">调出</Option>
                      <Option value="自用">自用</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="dateRange" label="日期范围">
                    <RangePicker />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button onClick={handleReset}>
                      重置
                    </Button>
                    <Button icon={<FileExcelOutlined />}>
                      导出Excel
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
          
          <Card style={{ marginTop: 16 }}>
            <Table
              columns={transactionColumns}
              dataSource={transactionData}
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

export default InventoryQuery; 