import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Row, 
  Col, 
  Select, 
  Input, 
  Badge, 
  Space,
  Tooltip,
  TreeSelect,
  Statistic,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './index.css';

const { Option } = Select;

const DeviceManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('company-0');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alarmFilter, setAlarmFilter] = useState('all');
  const [alarmCount, setAlarmCount] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [form, setForm] = useState({ getFieldsValue: () => {} });
  
  // 模拟组织结构数据
  const orgData = {
    key: 'company-0',
    title: '总公司',
    value: 'company-0',
    children: Array.from({ length: 3 }, (_, i) => ({
      key: `company-${i+1}`,
      title: `分公司${i+1}`,
      value: `company-${i+1}`,
      children: Array.from({ length: 2 }, (_, j) => ({
        key: `station-${i+1}-${j+1}`,
        title: `油站${i+1}-${j+1}`,
        value: `station-${i+1}-${j+1}`
      }))
    }))
  };

  // 设备状态配置
  const deviceStatusConfig = {
    online: { color: 'green', text: '在线', icon: <CheckCircleOutlined /> },
    offline: { color: 'red', text: '离线', icon: <CloseCircleOutlined /> },
    maintenance: { color: 'orange', text: '维护中', icon: <ToolOutlined /> },
    error: { color: 'red', text: '故障', icon: <ExclamationCircleOutlined /> }
  };

  // 报警状态配置
  const alarmStatusConfig = {
    normal: { color: 'green', text: '正常' },
    warning: { color: 'orange', text: '警告' },
    error: { color: 'red', text: '错误' }
  };

  // 模拟设备数据
  const mockDeviceData = [
    {
      id: 'device-001',
      name: '油枪001',
      type: '加油设备',
      station: '油站1-1',
      location: '1号加油岛',
      status: 'online',
      alarmStatus: 'normal',
      lastActiveTime: '2024-03-20 14:30:00',
      model: 'JYQ-2000',
      manufacturer: '华为石化',
      installDate: '2023-01-15',
      maintenanceCount: 3,
      faultCount: 0
    },
    {
      id: 'device-002', 
      name: '油枪002',
      type: '加油设备',
      station: '油站1-1',
      location: '1号加油岛', 
      status: 'offline',
      alarmStatus: 'warning',
      lastActiveTime: '2024-03-20 12:15:00',
      model: 'JYQ-2000',
      manufacturer: '华为石化',
      installDate: '2023-01-15',
      maintenanceCount: 5,
      faultCount: 1
    },
    {
      id: 'device-003',
      name: '储油罐001', 
      type: '储油设备',
      station: '油站1-2',
      location: '地下储油区',
      status: 'online',
      alarmStatus: 'normal',
      lastActiveTime: '2024-03-20 14:45:00',
      model: 'CYG-5000',
      manufacturer: '中石化设备',
      installDate: '2022-12-01',
      maintenanceCount: 2,
      faultCount: 0
    },
    {
      id: 'device-004',
      name: '监控摄像头001',
      type: '监控设备', 
      station: '油站1-1',
      location: '收银台',
      status: 'error',
      alarmStatus: 'error',
      lastActiveTime: '2024-03-19 16:20:00',
      model: 'JK-HD200',
      manufacturer: '海康威视',
      installDate: '2023-05-10',
      maintenanceCount: 1,
      faultCount: 2
    },
    {
      id: 'device-005',
      name: '支付终端001',
      type: '支付设备',
      station: '油站1-2', 
      location: '收银台1',
      status: 'maintenance',
      alarmStatus: 'warning',
      lastActiveTime: '2024-03-20 10:00:00',
      model: 'ZF-PAY300',
      manufacturer: '银联商务',
      installDate: '2023-03-20',
      maintenanceCount: 4,
      faultCount: 1
    }
  ];

  // 获取设备数据
  const fetchDeviceData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredData = [...mockDeviceData];
      
      // 根据组织筛选
      if (selectedOrg && selectedOrg !== 'company-0') {
        filteredData = filteredData.filter(device => 
          device.station.includes(selectedOrg.replace('station-', '').replace('-', '-'))
        );
      }
      
      // 根据搜索文本筛选
      if (searchText) {
        filteredData = filteredData.filter(device =>
          device.name.toLowerCase().includes(searchText.toLowerCase()) ||
          device.type.toLowerCase().includes(searchText.toLowerCase()) ||
          device.location.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // 根据状态筛选
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(device => device.status === statusFilter);
      }
      
      // 根据报警状态筛选
      if (alarmFilter !== 'all') {
        filteredData = filteredData.filter(device => device.alarmStatus === alarmFilter);
      }
      
      setDeviceList(filteredData);
      
      // 计算报警数量
      const alarmDevices = mockDeviceData.filter(device => 
        device.alarmStatus === 'warning' || device.alarmStatus === 'error'
      );
      setAlarmCount(alarmDevices.length);
      
    } catch (error) {
      console.error('获取设备数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置筛选条件
  const handleReset = () => {
    setSelectedOrg('company-0');
    setSearchText('');
    setStatusFilter('all');
    setAlarmFilter('all');
    setPagination({ current: 1, pageSize: 10 });
  };

  useEffect(() => {
    fetchDeviceData();
  }, [selectedOrg, searchText, statusFilter, alarmFilter]);

  // 表格列定义
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 120,
      render: (text, record) => (
        <Link to={`/device/detail/${record.id}`} className="device-name-link">
          {text}
        </Link>
      )
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '所属油站',
      dataIndex: 'station',
      key: 'station',
      width: 100
    },
    {
      title: '安装位置',
      dataIndex: 'location',
      key: 'location',
      width: 120
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = deviceStatusConfig[status];
        return (
          <Badge 
            status={config.color === 'green' ? 'success' : config.color === 'red' ? 'error' : 'warning'}
            text={
              <span>
                {config.icon}
                <span style={{ marginLeft: 4 }}>{config.text}</span>
              </span>
            }
          />
        );
      }
    },
    {
      title: '报警状态',
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      width: 100,
      render: (status) => {
        const config = alarmStatusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '最后活跃时间',
      dataIndex: 'lastActiveTime',
      key: 'lastActiveTime',
      width: 140
    },
    {
      title: '设备型号',
      dataIndex: 'model',
      key: 'model',
      width: 100
    },
    {
      title: '制造商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 100
    },
    {
      title: '维护次数',
      dataIndex: 'maintenanceCount',
      key: 'maintenanceCount',
      width: 80,
      render: (count) => (
        <Tooltip title="点击查看维护记录">
          <span className="maintenance-count">{count}</span>
        </Tooltip>
      )
    },
    {
      title: '故障次数',
      dataIndex: 'faultCount',
      key: 'faultCount',
      width: 80,
      render: (count) => (
        <span className={count > 0 ? 'fault-count-error' : 'fault-count-normal'}>
          {count}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Space>
          <Link to={`/device/detail/${record.id}`}>
            <Button type="primary" size="small" icon={<EyeOutlined />}>
              查看
            </Button>
          </Link>
        </Space>
      )
    }
  ];

  return (
    <div className="device-management-container">
      <Card>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="设备总数"
                value={mockDeviceData.length}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="在线设备"
                value={mockDeviceData.filter(d => d.status === 'online').length}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="离线设备"
                value={mockDeviceData.filter(d => d.status === 'offline').length}
                prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="报警设备"
                value={alarmCount}
                prefix={<WarningOutlined style={{ color: '#fa8c16' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* 报警提示 */}
        {alarmCount > 0 && (
          <Alert
            message={`当前有 ${alarmCount} 台设备存在报警，请及时处理`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 筛选区域 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <TreeSelect
              style={{ width: '100%' }}
              value={selectedOrg}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={[orgData]}
              placeholder="请选择组织"
              treeDefaultExpandAll
              onChange={setSelectedOrg}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="搜索设备名称、类型或位置"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="设备状态"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">全部状态</Option>
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="error">故障</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="报警状态"
              value={alarmFilter}
              onChange={setAlarmFilter}
            >
              <Option value="all">全部报警</Option>
              <Option value="normal">正常</Option>
              <Option value="warning">警告</Option>
              <Option value="error">错误</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={fetchDeviceData}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 设备列表表格 */}
        <Table
          columns={columns}
          dataSource={deviceList}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            ...pagination,
            total: deviceList.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize })
          }}
        />
      </Card>
    </div>
  );
};

export default DeviceManagement; 