import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Row, 
  Col, 
  Breadcrumb, 
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
  EyeOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

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
      key: `branch-${i}`,
      title: `分公司 ${i + 1}`,
      value: `branch-${i}`,
      children: Array.from({ length: 5 }, (_, j) => ({
        key: `station-${i}-${j}`,
        title: `加油站 ${i + 1}-${j + 1}`,
        value: `station-${i}-${j}`,
      }))
    }))
  };

  // 模拟设备数据
  useEffect(() => {
    fetchDeviceList();
  }, [pagination.current, pagination.pageSize, form.getFieldsValue()]);

  // 模拟获取设备数据
  const fetchDeviceList = () => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 生成模拟数据
      const data = generateMockDeviceData();
      setDeviceList(data);
      
      // 计算告警数量
      const alarms = data.filter(device => device.alarmStatus !== 'normal').length;
      setAlarmCount(alarms);
      
      setLoading(false);
    }, 500);
  };

  // 生成模拟设备数据
  const generateMockDeviceData = () => {
    const statusOptions = ['online', 'offline', 'maintenance'];
    const alarmStatusOptions = ['normal', 'warning', 'critical'];
    
    // 根据选择的组织层级生成不同数量的设备
    let deviceCount = 20; // 默认设备数量
    
    if (selectedOrg.startsWith('branch-')) {
      deviceCount = 10;
    } else if (selectedOrg.startsWith('station-')) {
      deviceCount = 1;
    }
    
    return Array.from({ length: deviceCount }, (_, index) => {
      const stationIndex = index % 15;
      const branchIndex = Math.floor(stationIndex / 5);
      
      // 随机生成设备状态
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const alarmStatus = status === 'offline' ? 'critical' : 
                          (Math.random() > 0.7 ? alarmStatusOptions[Math.floor(Math.random() * alarmStatusOptions.length)] : 'normal');
      
      // 为每个设备生成4个油罐数据
      const tanks = Array.from({ length: 4 }, (_, tankIndex) => {
        const fuelLevel = Math.floor(Math.random() * 100);
        const waterLevel = Math.floor(Math.random() * 10);
        const fuelTemp = (Math.random() * 15 + 10).toFixed(1);
        const envTemp = (Math.random() * 10 + 15).toFixed(1);
        const pressure = (Math.random() * 0.5 + 0.1).toFixed(2);
        
        // 油量低或水位高时生成告警
        const tankAlarm = fuelLevel < 20 ? 'low_fuel' : 
                          waterLevel > 5 ? 'high_water' : 
                          'normal';
        
        return {
          tankId: `T${tankIndex + 1}`,
          fuelType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][tankIndex],
          fuelLevel,
          waterLevel,
          fuelTemp,
          envTemp,
          pressure,
          tankAlarm
        };
      });
      
      return {
        key: `device-${index}`,
        deviceId: `LYY-${branchIndex + 1}${stationIndex + 1}-${index + 1}`,
        stationName: `加油站 ${branchIndex + 1}-${stationIndex % 5 + 1}`,
        branchName: `分公司 ${branchIndex + 1}`,
        deviceName: `液位仪 ${index + 1}`,
        deviceModel: `ATG-${1000 + index}`,
        status,
        alarmStatus,
        lastUpdateTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleString(),
        tanks
      };
    });
  };

  // 处理组织选择变化
  const handleOrgChange = (value) => {
    setSelectedOrg(value);
  };

  // 处理搜索文本变化
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // 处理状态筛选变化
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  // 处理告警筛选变化
  const handleAlarmFilterChange = (value) => {
    setAlarmFilter(value);
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchDeviceList();
  };

  // 获取组织名称
  const getOrgName = (value) => {
    if (value === 'company-0') return '总公司';
    
    if (value.startsWith('branch-')) {
      const branchIndex = parseInt(value.split('-')[1]);
      return `分公司 ${branchIndex + 1}`;
    }
    
    if (value.startsWith('station-')) {
      const [_, branchIndex, stationIndex] = value.split('-');
      return `加油站 ${parseInt(branchIndex) + 1}-${parseInt(stationIndex) + 1}`;
    }
    
    return '';
  };

  // 渲染设备状态标签
  const renderStatusTag = (status) => {
    switch (status) {
      case 'online':
        return <Tag color="success" icon={<CheckCircleOutlined />}>在线</Tag>;
      case 'offline':
        return <Tag color="error" icon={<CloseCircleOutlined />}>离线</Tag>;
      case 'maintenance':
        return <Tag color="warning" icon={<ExclamationCircleOutlined />}>维护中</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 渲染告警状态标签
  const renderAlarmTag = (alarmStatus) => {
    switch (alarmStatus) {
      case 'normal':
        return <Tag color="success">正常</Tag>;
      case 'warning':
        return <Tag color="warning" icon={<WarningOutlined />}>警告</Tag>;
      case 'critical':
        return <Tag color="error" icon={<ExclamationCircleOutlined />}>严重</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: 120,
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 120,
    },
    {
      title: '设备型号',
      dataIndex: 'deviceModel',
      key: 'deviceModel',
      width: 120,
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => renderStatusTag(status),
      filters: [
        { text: '在线', value: 'online' },
        { text: '离线', value: 'offline' },
        { text: '维护中', value: 'maintenance' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '告警状态',
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      width: 100,
      render: (alarmStatus) => renderAlarmTag(alarmStatus),
      filters: [
        { text: '正常', value: 'normal' },
        { text: '警告', value: 'warning' },
        { text: '严重', value: 'critical' },
      ],
      onFilter: (value, record) => record.alarmStatus === value,
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="default" 
            icon={<EyeOutlined />}
            size="small"
          >
            <Link to={`/station/device/detail/${record.deviceId}`}>查看详情</Link>
          </Button>
        </Space>
      ),
    },
  ];

  // 过滤设备列表
  const filteredDeviceList = deviceList.filter(device => {
    // 搜索文本过滤
    const textMatch = searchText === '' || 
                      device.deviceId.toLowerCase().includes(searchText.toLowerCase()) ||
                      device.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
                      device.deviceName.toLowerCase().includes(searchText.toLowerCase());
    
    // 状态过滤
    const statusMatch = statusFilter === 'all' || device.status === statusFilter;
    
    // 告警过滤
    const alarmMatch = alarmFilter === 'all' || device.alarmStatus === alarmFilter;
    
    return textMatch && statusMatch && alarmMatch;
  });

  return (
    <div className="device-management">
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/station">油站管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>设备管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>液位仪设备管理 - {getOrgName(selectedOrg)}</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={deviceList.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={deviceList.filter(device => device.status === 'online').length}
              valueStyle={{ color: '#3f8600' }}
              suffix={`/ ${deviceList.length}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={deviceList.filter(device => device.status === 'offline').length}
              valueStyle={{ color: '#cf1322' }}
              suffix={`/ ${deviceList.length}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="告警设备"
              value={alarmCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
              suffix={`/ ${deviceList.length}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 告警提示 */}
      {alarmCount > 0 && (
        <Alert
          message={`当前有 ${alarmCount} 个设备存在告警，请及时处理！`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary">
              查看全部告警
            </Button>
          }
        />
      )}

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <span style={{ marginRight: 8 }}>组织层级:</span>
            <TreeSelect
              style={{ width: 200 }}
              value={selectedOrg}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={[orgData]}
              placeholder="请选择组织"
              treeDefaultExpandAll
              onChange={handleOrgChange}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="搜索设备ID/名称/油站"
              value={searchText}
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col span={4}>
            <span style={{ marginRight: 8 }}>状态:</span>
            <Select 
              value={statusFilter} 
              onChange={handleStatusFilterChange}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Col>
          <Col span={4}>
            <span style={{ marginRight: 8 }}>告警:</span>
            <Select 
              value={alarmFilter} 
              onChange={handleAlarmFilterChange}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="normal">正常</Option>
              <Option value="warning">警告</Option>
              <Option value="critical">严重</Option>
            </Select>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
            >
              刷新数据
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 设备列表 */}
      <Card title="液位仪设备列表">
        <Table 
          columns={columns} 
          dataSource={filteredDeviceList} 
          rowKey="key"
          loading={loading}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0 }}>
                <h4>油罐状态信息</h4>
                <Row gutter={[16, 16]}>
                  {record.tanks.map(tank => (
                    <Col span={6} key={tank.tankId}>
                      <Card 
                        size="small" 
                        title={`${tank.tankId} - ${tank.fuelType}`}
                        extra={
                          tank.tankAlarm !== 'normal' && (
                            <Tooltip title={tank.tankAlarm === 'low_fuel' ? '油量过低' : '水位过高'}>
                              <Badge status="error" />
                            </Tooltip>
                          )
                        }
                      >
                        <p>
                          <strong>油位高度:</strong> {tank.fuelLevel}cm
                          {tank.fuelLevel < 20 && (
                            <Tag color="error" style={{ marginLeft: 8 }}>油量过低</Tag>
                          )}
                        </p>
                        <p>
                          <strong>水位高度:</strong> {tank.waterLevel}cm
                          {tank.waterLevel > 5 && (
                            <Tag color="error" style={{ marginLeft: 8 }}>水位过高</Tag>
                          )}
                        </p>
                        <p><strong>油品温度:</strong> {tank.fuelTemp}°C</p>
                        <p><strong>环境温度:</strong> {tank.envTemp}°C</p>
                        <p><strong>罐内压力:</strong> {tank.pressure}MPa</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default DeviceManagement; 