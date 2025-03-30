import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Descriptions, 
  Tag, 
  Button, 
  Tabs, 
  Table,
  Statistic,
  Progress,
  Alert,
  Space,
  Tooltip,
  Badge,
  Divider,
  Modal,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  message
} from 'antd';
import { 
  WarningOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  HistoryOutlined,
  ToolOutlined,
  RollbackOutlined,
  EditOutlined,
  SaveOutlined,
  FileSearchOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  // 新增状态变量
  const [alarmDetailVisible, setAlarmDetailVisible] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [processingVisible, setProcessingVisible] = useState(false);
  const [maintenanceDrawerVisible, setMaintenanceDrawerVisible] = useState(false);
  const [maintenanceForm] = Form.useForm();
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  
  // 获取设备数据
  useEffect(() => {
    fetchDeviceData();
    // 定时刷新数据，模拟实时监控
    const timer = setInterval(() => {
      if (activeTab === 'monitoring') {
        // 只在监控标签页时自动刷新数据
        fetchDeviceData();
      }
    }, 60000); // 每分钟刷新一次
    
    return () => clearInterval(timer);
  }, [activeTab]); // 添加activeTab作为依赖项
  
  // 模拟获取设备数据
  const fetchDeviceData = () => {
    setLoading(true);
    
    try {
      // 模拟API请求延迟
      setTimeout(() => {
        // 生成模拟数据
        const data = generateMockDeviceData();
        setDeviceInfo(data);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("获取设备数据出错:", error);
      message.error("获取设备数据失败，请刷新页面重试");
      setLoading(false);
    }
  };
  
  // 生成模拟设备数据
  const generateMockDeviceData = () => {
    // 验证设备ID格式
    if (!deviceId || typeof deviceId !== 'string') {
      return {
        deviceId: deviceId || '未知设备',
        stationName: '未知油站',
        branchName: '未知分公司',
        deviceName: '未知设备',
        deviceModel: '未知型号',
        manufacturer: '未知厂商',
        installDate: '未知',
        lastMaintenanceDate: '未知',
        ipAddress: '未知',
        firmwareVersion: '未知',
        status: 'offline',
        alarmStatus: 'normal',
        lastUpdateTime: new Date().toLocaleString(),
        tanks: generateMockTanks(4),
        deviceAlarmHistory: generateMockAlarmHistory(5)
      };
    }
    
    // 解析设备ID中的信息
    const idParts = deviceId.split('-');
    
    // 处理不同格式的设备ID
    let branchIndex = 0;
    let stationIndex = 0;
    let deviceIndex = 0;
    
    if (idParts.length >= 3) {
      // 标准格式：前缀-站点-设备编号
      if (idParts[1].length >= 2) {
        branchIndex = parseInt(idParts[1].charAt(0)) - 1;
        stationIndex = parseInt(idParts[1].charAt(1)) - 1;
      }
      deviceIndex = parseInt(idParts[2]) - 1;
    } else if (idParts.length === 2) {
      // 简化格式：前缀-设备编号
      deviceIndex = parseInt(idParts[1]) - 1;
    }
    
    // 确保索引有效
    branchIndex = isNaN(branchIndex) || branchIndex < 0 ? 0 : branchIndex;
    stationIndex = isNaN(stationIndex) || stationIndex < 0 ? 0 : stationIndex;
    deviceIndex = isNaN(deviceIndex) || deviceIndex < 0 ? 0 : deviceIndex;
    
    // 随机生成设备状态
    const statusOptions = ['online', 'offline', 'maintenance'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const alarmStatus = status === 'offline' ? 'critical' : 
                        (Math.random() > 0.7 ? ['normal', 'warning', 'critical'][Math.floor(Math.random() * 3)] : 'normal');
    
    // 为设备生成4个油罐数据
    const tanks = generateMockTanks(4);
    
    // 生成设备告警历史
    const deviceAlarmHistory = generateMockAlarmHistory(alarmStatus !== 'normal' ? 5 : 2);
    
    return {
      deviceId,
      stationName: `加油站 ${branchIndex + 1}-${stationIndex + 1}`,
      branchName: `分公司 ${branchIndex + 1}`,
      deviceName: `液位仪 ${deviceIndex + 1}`,
      deviceModel: `ATG-${1000 + deviceIndex}`,
      manufacturer: '北京液位仪器有限公司',
      installDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 3600000)).toLocaleDateString(),
      lastMaintenanceDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 3600000)).toLocaleDateString(),
      ipAddress: `192.168.1.${100 + deviceIndex}`,
      firmwareVersion: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      status,
      alarmStatus,
      lastUpdateTime: new Date().toLocaleString(),
      tanks,
      deviceAlarmHistory
    };
  };
  
  // 生成模拟油罐数据
  const generateMockTanks = (count) => {
    return Array.from({ length: count }, (_, tankIndex) => {
      const fuelLevel = Math.floor(Math.random() * 100);
      const waterLevel = Math.floor(Math.random() * 10);
      const fuelTemp = (Math.random() * 15 + 10).toFixed(1);
      const envTemp = (Math.random() * 10 + 15).toFixed(1);
      const pressure = (Math.random() * 0.5 + 0.1).toFixed(2);
      
      // 油量低或水位高时生成告警
      const tankAlarm = fuelLevel < 20 ? 'low_fuel' : 
                        waterLevel > 5 ? 'high_water' : 
                        'normal';
      
      // 生成历史数据（过去24小时）
      const historyData = Array.from({ length: 24 }, (_, i) => {
        const time = new Date();
        time.setHours(time.getHours() - 23 + i);
        
        return {
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fuelLevel: Math.max(0, fuelLevel + Math.floor(Math.random() * 10) - 5),
          waterLevel: Math.max(0, waterLevel + Math.floor(Math.random() * 2) - 1),
          fuelTemp: (parseFloat(fuelTemp) + (Math.random() * 2 - 1)).toFixed(1),
          envTemp: (parseFloat(envTemp) + (Math.random() * 2 - 1)).toFixed(1),
          pressure: (parseFloat(pressure) + (Math.random() * 0.1 - 0.05)).toFixed(2)
        };
      });
      
      // 生成告警历史
      const alarmHistory = generateTankAlarmHistory(tankIndex, tankAlarm);
      
      const fuelTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
      const capacities = [30000, 25000, 20000, 15000];
      
      return {
        tankId: `T${tankIndex + 1}`,
        tankName: `${tankIndex + 1}号油罐`,
        fuelType: fuelTypes[tankIndex % fuelTypes.length],
        capacity: capacities[tankIndex % capacities.length],
        fuelLevel,
        waterLevel,
        fuelTemp,
        envTemp,
        pressure,
        tankAlarm,
        historyData,
        alarmHistory,
        lastCalibrationDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600000)).toLocaleDateString(),
        maintenanceStatus: Math.random() > 0.8 ? '需要维护' : '正常'
      };
    });
  };
  
  // 生成油罐告警历史
  const generateTankAlarmHistory = (tankIndex, tankAlarm) => {
    const alarmHistory = [];
    if (tankAlarm !== 'normal' || Math.random() > 0.7) {
      const alarmTypes = ['low_fuel', 'high_water', 'high_temp', 'low_pressure'];
      const alarmCount = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < alarmCount; i++) {
        const alarmTime = new Date();
        alarmTime.setHours(alarmTime.getHours() - Math.floor(Math.random() * 24));
        
        alarmHistory.push({
          id: `alarm-${tankIndex}-${i}`,
          type: alarmTypes[Math.floor(Math.random() * alarmTypes.length)],
          time: alarmTime.toLocaleString(),
          status: Math.random() > 0.3 ? 'resolved' : 'active',
          description: '系统自动检测到异常'
        });
      }
    }
    return alarmHistory;
  };
  
  // 生成设备告警历史
  const generateMockAlarmHistory = (count) => {
    const alarmHistory = [];
    const alarmTypes = ['connection_lost', 'power_failure', 'sensor_error', 'communication_error'];
    
    for (let i = 0; i < count; i++) {
      const alarmTime = new Date();
      alarmTime.setHours(alarmTime.getHours() - Math.floor(Math.random() * 72));
      
      alarmHistory.push({
        id: `device-alarm-${i}`,
        type: alarmTypes[Math.floor(Math.random() * alarmTypes.length)],
        time: alarmTime.toLocaleString(),
        status: Math.random() > 0.3 ? 'resolved' : 'active',
        description: '系统自动检测到设备异常'
      });
    }
    return alarmHistory;
  };
  
  // 手动刷新数据
  const handleRefresh = () => {
    fetchDeviceData();
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
  
  // 渲染油罐告警标签
  const renderTankAlarmTag = (tankAlarm) => {
    switch (tankAlarm) {
      case 'normal':
        return <Tag color="success">正常</Tag>;
      case 'low_fuel':
        return <Tag color="error" icon={<WarningOutlined />}>油量过低</Tag>;
      case 'high_water':
        return <Tag color="error" icon={<WarningOutlined />}>水位过高</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };
  
  // 渲染告警历史状态标签
  const renderAlarmHistoryStatusTag = (status) => {
    switch (status) {
      case 'active':
        return <Tag color="error">未处理</Tag>;
      case 'resolved':
        return <Tag color="success">已解决</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };
  
  // 渲染告警类型标签
  const renderAlarmTypeTag = (type) => {
    switch (type) {
      case 'low_fuel':
        return <Tag color="orange">油量过低</Tag>;
      case 'high_water':
        return <Tag color="blue">水位过高</Tag>;
      case 'high_temp':
        return <Tag color="red">温度过高</Tag>;
      case 'low_pressure':
        return <Tag color="purple">压力过低</Tag>;
      case 'connection_lost':
        return <Tag color="magenta">连接丢失</Tag>;
      case 'power_failure':
        return <Tag color="red">电源故障</Tag>;
      case 'sensor_error':
        return <Tag color="volcano">传感器错误</Tag>;
      case 'communication_error':
        return <Tag color="geekblue">通信错误</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };
  
  // 油位历史趋势图配置
  const getFuelLevelChartOption = (tankIndex) => {
    if (!deviceInfo || !deviceInfo.tanks[tankIndex]) return {};
    
    const tank = deviceInfo.tanks[tankIndex];
    const times = tank.historyData.map(item => item.time);
    const fuelLevels = tank.historyData.map(item => item.fuelLevel);
    const waterLevels = tank.historyData.map(item => item.waterLevel);
    
    return {
      title: {
        text: '油位和水位历史趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['油位高度', '水位高度']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value',
        name: '高度(cm)'
      },
      series: [
        {
          name: '油位高度',
          type: 'line',
          data: fuelLevels,
          smooth: true,
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '水位高度',
          type: 'line',
          data: waterLevels,
          smooth: true,
          itemStyle: {
            color: '#32AF50'
          }
        }
      ]
    };
  };
  
  // 温度历史趋势图配置
  const getTemperatureChartOption = (tankIndex) => {
    if (!deviceInfo || !deviceInfo.tanks[tankIndex]) return {};
    
    const tank = deviceInfo.tanks[tankIndex];
    const times = tank.historyData.map(item => item.time);
    const fuelTemps = tank.historyData.map(item => item.fuelTemp);
    const envTemps = tank.historyData.map(item => item.envTemp);
    
    return {
      title: {
        text: '温度历史趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['油品温度', '环境温度']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value',
        name: '温度(°C)'
      },
      series: [
        {
          name: '油品温度',
          type: 'line',
          data: fuelTemps,
          smooth: true,
          itemStyle: {
            color: '#fa8c16'
          }
        },
        {
          name: '环境温度',
          type: 'line',
          data: envTemps,
          smooth: true,
          itemStyle: {
            color: '#722ed1'
          }
        }
      ]
    };
  };
  
  // 压力历史趋势图配置
  const getPressureChartOption = (tankIndex) => {
    if (!deviceInfo || !deviceInfo.tanks[tankIndex]) return {};
    
    const tank = deviceInfo.tanks[tankIndex];
    const times = tank.historyData.map(item => item.time);
    const pressures = tank.historyData.map(item => item.pressure);
    
    return {
      title: {
        text: '压力历史趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value',
        name: '压力(MPa)'
      },
      series: [
        {
          name: '罐内压力',
          type: 'line',
          data: pressures,
          smooth: true,
          itemStyle: {
            color: '#eb2f96'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(235, 47, 150, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(235, 47, 150, 0.1)'
                }
              ]
            }
          }
        }
      ]
    };
  };
  
  // 处理告警详情
  const handleViewAlarmDetail = (record) => {
    setCurrentAlarm(record);
    setAlarmDetailVisible(true);
  };

  // 处理告警处理
  const handleProcessAlarm = (record) => {
    setCurrentAlarm(record);
    setProcessingVisible(true);
  };

  // 提交告警处理
  const handleSubmitProcessing = () => {
    message.success('告警处理成功');
    setProcessingVisible(false);
    fetchDeviceData(); // 刷新数据
  };

  // 打开设备维护抽屉
  const handleOpenMaintenanceDrawer = () => {
    maintenanceForm.resetFields();
    setMaintenanceDrawerVisible(true);
  };

  // 提交设备维护
  const handleSubmitMaintenance = (values) => {
    console.log('维护表单数据:', values);
    message.success('设备维护记录已提交');
    setMaintenanceDrawerVisible(false);
  };

  // 查看历史记录
  const handleViewHistory = () => {
    setHistoryModalVisible(true);
  };

  // 告警历史表格列配置
  const alarmHistoryColumns = [
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => renderAlarmTypeTag(type),
    },
    {
      title: '告警时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderAlarmHistoryStatusTag(status),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'active' && (
            <Tooltip title="处理告警">
              <Button 
                type="default" 
                size="small" 
                icon={<CheckOutlined />} 
                onClick={() => handleProcessAlarm(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="查看详情">
            <Button 
              type="default" 
              size="small" 
              icon={<FileSearchOutlined />} 
              onClick={() => handleViewAlarmDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  // 生成设备维护记录
  const generateMaintenanceRecords = () => {
    const maintenanceTypes = ['定期维护', '故障维修', '设备升级', '设备校准'];
    const maintenancePersons = ['张工', '李工', '王工', '赵工', '刘工'];
    const maintenanceContents = [
      '设备清洁、参数校准',
      '更换传感器',
      '固件升级',
      '油罐液位校准',
      '通信模块维修',
      '电源系统检查',
      '数据线路检查',
      '防雷系统检查'
    ];
    const maintenanceResults = ['正常', '已修复', '升级成功', '校准完成', '需要进一步维护'];
    
    // 生成5-10条维护记录
    const count = Math.floor(Math.random() * 6) + 5;
    const records = [];
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365)); // 过去一年内的随机日期
      
      records.push({
        id: `maintenance-${i}`,
        date: date.toLocaleDateString(),
        type: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
        person: maintenancePersons[Math.floor(Math.random() * maintenancePersons.length)],
        content: maintenanceContents[Math.floor(Math.random() * maintenanceContents.length)],
        result: maintenanceResults[Math.floor(Math.random() * maintenanceResults.length)]
      });
    }
    
    // 按日期降序排序
    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  if (loading || !deviceInfo) {
    return (
      <div className="device-detail">
        <div className="page-header">
          <h2>液位仪设备详情 - {deviceId}</h2>
        </div>
        <Card loading={true}>
          <div style={{ padding: '50px 0', textAlign: 'center' }}>
            <h3>正在加载设备数据，请稍候...</h3>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="device-detail">
      <div className="page-header">
        <h2>液位仪设备详情 - {deviceInfo.deviceName}</h2>
      </div>
      
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Space>
            <Link to="/device">
              <Button icon={<RollbackOutlined />}>返回设备列表</Button>
            </Link>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
            >
              刷新数据
            </Button>
            <Button 
              icon={<ToolOutlined />} 
              onClick={handleOpenMaintenanceDrawer}
            >
              登记维护
            </Button>
            <Button 
              icon={<HistoryOutlined />} 
              onClick={handleViewHistory}
            >
              维护历史
            </Button>
          </Space>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="设备基本信息" 
          >
            <Row gutter={[16, 16]}>
              <Col span={18}>
                <Descriptions bordered column={3}>
                  <Descriptions.Item label="设备ID">{deviceInfo.deviceId}</Descriptions.Item>
                  <Descriptions.Item label="设备名称">{deviceInfo.deviceName}</Descriptions.Item>
                  <Descriptions.Item label="设备型号">{deviceInfo.deviceModel}</Descriptions.Item>
                  <Descriptions.Item label="所属油站">{deviceInfo.stationName}</Descriptions.Item>
                  <Descriptions.Item label="所属分公司">{deviceInfo.branchName}</Descriptions.Item>
                  <Descriptions.Item label="制造商">{deviceInfo.manufacturer}</Descriptions.Item>
                  <Descriptions.Item label="安装日期">{deviceInfo.installDate}</Descriptions.Item>
                  <Descriptions.Item label="最后维护日期">{deviceInfo.lastMaintenanceDate}</Descriptions.Item>
                  <Descriptions.Item label="固件版本">{deviceInfo.firmwareVersion}</Descriptions.Item>
                  <Descriptions.Item label="IP地址">{deviceInfo.ipAddress}</Descriptions.Item>
                  <Descriptions.Item label="运行状态">{renderStatusTag(deviceInfo.status)}</Descriptions.Item>
                  <Descriptions.Item label="告警状态">{renderAlarmTag(deviceInfo.alarmStatus)}</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="最后更新时间"
                    value={deviceInfo.lastUpdateTime}
                    valueStyle={{ fontSize: '16px' }}
                  />
                  <Divider />
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" icon={<ToolOutlined />} block onClick={handleOpenMaintenanceDrawer}>设备维护</Button>
                    <Button icon={<HistoryOutlined />} block onClick={handleViewHistory}>查看历史记录</Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      {deviceInfo.status === 'offline' && (
        <Alert
          message="设备当前处于离线状态，无法获取实时数据"
          type="error"
          showIcon
          style={{ margin: '16px 0' }}
          action={
            <Button size="small" type="primary">
              尝试重连
            </Button>
          }
        />
      )}
      
      <div className="device-detail-tabs">
        <Tabs defaultActiveKey="maintenance">
          <TabPane tab="油罐状态" key="tank">
            <Row gutter={[16, 16]}>
              {deviceInfo.tanks.map((tank, index) => (
                <Col span={12} key={tank.tankId}>
                  <Card 
                    title={`${tank.tankId} - ${tank.fuelType}`}
                    extra={renderTankAlarmTag(tank.tankAlarm)}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Descriptions bordered column={1} size="small">
                          <Descriptions.Item label="油罐名称">{tank.tankName}</Descriptions.Item>
                          <Descriptions.Item label="油品类型">{tank.fuelType}</Descriptions.Item>
                          <Descriptions.Item label="油罐容量">{tank.capacity} L</Descriptions.Item>
                          <Descriptions.Item label="油位高度">
                            {tank.fuelLevel} cm
                            {tank.fuelLevel < 20 && (
                              <Tag color="error" style={{ marginLeft: 8 }}>油量过低</Tag>
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="水位高度">
                            {tank.waterLevel} cm
                            {tank.waterLevel > 5 && (
                              <Tag color="error" style={{ marginLeft: 8 }}>水位过高</Tag>
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="油品温度">{tank.fuelTemp} °C</Descriptions.Item>
                          <Descriptions.Item label="环境温度">{tank.envTemp} °C</Descriptions.Item>
                          <Descriptions.Item label="罐内压力">{tank.pressure} MPa</Descriptions.Item>
                          <Descriptions.Item label="最后标定日期">{tank.lastCalibrationDate}</Descriptions.Item>
                          <Descriptions.Item label="维护状态">{tank.maintenanceStatus}</Descriptions.Item>
                        </Descriptions>
                      </Col>
                      <Col span={12}>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                          <Statistic
                            title="当前油量百分比"
                            value={tank.fuelLevel}
                            suffix="%"
                            valueStyle={{ color: tank.fuelLevel < 20 ? '#cf1322' : '#3f8600' }}
                          />
                          <Progress
                            type="dashboard"
                            percent={tank.fuelLevel}
                            status={tank.fuelLevel < 20 ? 'exception' : 'normal'}
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <Statistic
                            title="当前水位百分比"
                            value={tank.waterLevel * 10}
                            suffix="%"
                            valueStyle={{ color: tank.waterLevel > 5 ? '#cf1322' : '#3f8600' }}
                          />
                          <Progress
                            percent={tank.waterLevel * 10}
                            status={tank.waterLevel > 5 ? 'exception' : 'normal'}
                            strokeColor={tank.waterLevel > 5 ? '#cf1322' : '#3f8600'}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
          
          <TabPane tab="历史趋势" key="trend">
            <Card title="设备历史数据趋势" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card title="时间范围选择" size="small">
                    <Space>
                      <Button type="primary">日</Button>
                      <Button>周</Button>
                      <Button>月</Button>
                      <Button>季</Button>
                      <Button>年</Button>
                    </Space>
                  </Card>
                </Col>
                
                {deviceInfo && deviceInfo.tanks && deviceInfo.tanks.map((tank, index) => (
                  <Col span={24} key={index}>
                    <Card 
                      title={`${tank.tankName} - ${tank.fuelType} 历史趋势`} 
                      bordered={false}
                      extra={
                        <Space>
                          <Tag color="#32AF50">{tank.tankId}</Tag>
                          <Tag color={tank.tankAlarm === 'normal' ? 'success' : 'error'}>
                            {tank.tankAlarm === 'normal' ? '正常' : tank.tankAlarm === 'low_fuel' ? '油位低' : '水位高'}
                          </Tag>
                        </Space>
                      }
                    >
                      <Tabs defaultActiveKey="level">
                        <TabPane tab="油位和水位" key="level">
                          <ReactECharts 
                            option={getFuelLevelChartOption(index)} 
                            style={{ height: '300px' }} 
                          />
                        </TabPane>
                        <TabPane tab="温度" key="temperature">
                          <ReactECharts 
                            option={getTemperatureChartOption(index)} 
                            style={{ height: '300px' }} 
                          />
                        </TabPane>
                        <TabPane tab="压力" key="pressure">
                          <ReactECharts 
                            option={getPressureChartOption(index)} 
                            style={{ height: '300px' }} 
                          />
                        </TabPane>
                      </Tabs>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </TabPane>
          
          <TabPane tab="告警历史" key="3">
            <Card title="设备告警历史">
              <Table 
                columns={alarmHistoryColumns} 
                dataSource={deviceInfo.deviceAlarmHistory} 
                rowKey="id"
                pagination={false}
              />
            </Card>
            
            <Tabs defaultActiveKey="0" style={{ marginTop: 16 }}>
              {deviceInfo.tanks.map((tank, index) => (
                <TabPane tab={`${tank.tankId} - ${tank.fuelType}`} key={index}>
                  <Card title={`${tank.tankName} 告警历史`}>
                    <Table 
                      columns={alarmHistoryColumns} 
                      dataSource={tank.alarmHistory} 
                      rowKey="id"
                      pagination={false}
                    />
                  </Card>
                </TabPane>
              ))}
            </Tabs>
          </TabPane>
          
          <TabPane tab="设备维护" key="4">
            <Card title="设备维护记录">
              <Table
                columns={[
                  { title: '维护日期', dataIndex: 'date', key: 'date' },
                  { title: '维护类型', dataIndex: 'type', key: 'type' },
                  { title: '维护人员', dataIndex: 'person', key: 'person' },
                  { title: '维护内容', dataIndex: 'content', key: 'content' },
                  { title: '维护结果', dataIndex: 'result', key: 'result' }
                ]}
                dataSource={generateMaintenanceRecords()}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* 告警详情模态框 */}
      <Modal
        title="告警详情"
        open={alarmDetailVisible}
        onCancel={() => setAlarmDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAlarmDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {currentAlarm && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="告警类型">{renderAlarmTypeTag(currentAlarm.type)}</Descriptions.Item>
            <Descriptions.Item label="告警时间">{currentAlarm.time}</Descriptions.Item>
            <Descriptions.Item label="告警状态">{renderAlarmHistoryStatusTag(currentAlarm.status)}</Descriptions.Item>
            <Descriptions.Item label="告警描述">{currentAlarm.description}</Descriptions.Item>
            {currentAlarm.status === 'resolved' && (
              <>
                <Descriptions.Item label="处理人">系统管理员</Descriptions.Item>
                <Descriptions.Item label="处理时间">2023-11-15 14:30:45</Descriptions.Item>
                <Descriptions.Item label="处理方式">远程重启设备</Descriptions.Item>
                <Descriptions.Item label="处理结果">告警已解除</Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 告警处理模态框 */}
      <Modal
        title="告警处理"
        open={processingVisible}
        onOk={handleSubmitProcessing}
        onCancel={() => setProcessingVisible(false)}
        okText="提交"
        cancelText="取消"
        width={600}
      >
        {currentAlarm && (
          <Form layout="vertical">
            <Form.Item label="告警类型">
              {renderAlarmTypeTag(currentAlarm.type)}
            </Form.Item>
            <Form.Item label="告警时间">
              {currentAlarm.time}
            </Form.Item>
            <Form.Item label="告警描述">
              {currentAlarm.description}
            </Form.Item>
            <Form.Item
              name="processingMethod"
              label="处理方式"
              rules={[{ required: true, message: '请选择处理方式' }]}
            >
              <Select placeholder="请选择处理方式">
                <Option value="restart">远程重启设备</Option>
                <Option value="reset">重置设备参数</Option>
                <Option value="manual">人工现场处理</Option>
                <Option value="ignore">忽略告警</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="processingResult"
              label="处理结果"
              rules={[{ required: true, message: '请输入处理结果' }]}
            >
              <TextArea rows={4} placeholder="请输入处理结果" />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 设备维护抽屉 */}
      <Drawer
        title="设备维护"
        width={600}
        open={maintenanceDrawerVisible}
        onClose={() => setMaintenanceDrawerVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setMaintenanceDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => maintenanceForm.submit()}>
              提交
            </Button>
          </Space>
        }
      >
        <Form
          form={maintenanceForm}
          layout="vertical"
          onFinish={handleSubmitMaintenance}
        >
          <Form.Item
            name="maintenanceType"
            label="维护类型"
            rules={[{ required: true, message: '请选择维护类型' }]}
          >
            <Select placeholder="请选择维护类型">
              <Option value="regular">定期维护</Option>
              <Option value="repair">故障维修</Option>
              <Option value="upgrade">设备升级</Option>
              <Option value="calibration">设备校准</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="maintenanceDate"
            label="维护日期"
            rules={[{ required: true, message: '请选择维护日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="maintenancePerson"
            label="维护人员"
            rules={[{ required: true, message: '请输入维护人员' }]}
          >
            <Input placeholder="请输入维护人员" />
          </Form.Item>
          <Form.Item
            name="maintenanceContent"
            label="维护内容"
            rules={[{ required: true, message: '请输入维护内容' }]}
          >
            <TextArea rows={4} placeholder="请输入维护内容" />
          </Form.Item>
          <Form.Item
            name="maintenanceResult"
            label="维护结果"
            rules={[{ required: true, message: '请输入维护结果' }]}
          >
            <TextArea rows={4} placeholder="请输入维护结果" />
          </Form.Item>
          <Form.Item
            name="nextMaintenanceDate"
            label="下次维护日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* 历史记录模态框 */}
      <Modal
        title="设备历史记录"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <Tabs defaultActiveKey="maintenance">
          <TabPane tab="维护记录" key="maintenance">
            <Card title="设备维护记录" bordered={false}>
              <Table 
                dataSource={generateMaintenanceRecords()}
                columns={[
                  {
                    title: '维护日期',
                    dataIndex: 'date',
                    key: 'date',
                    sorter: (a, b) => new Date(a.date) - new Date(b.date),
                  },
                  {
                    title: '维护类型',
                    dataIndex: 'type',
                    key: 'type',
                    filters: [
                      { text: '定期维护', value: '定期维护' },
                      { text: '故障维修', value: '故障维修' },
                      { text: '设备升级', value: '设备升级' },
                      { text: '设备校准', value: '设备校准' },
                    ],
                    onFilter: (value, record) => record.type === value,
                    render: (text) => {
                      let color = 'blue';
                      if (text === '故障维修') color = 'red';
                      if (text === '设备升级') color = 'green';
                      if (text === '设备校准') color = 'orange';
                      return <Tag color={color}>{text}</Tag>;
                    }
                  },
                  {
                    title: '维护人员',
                    dataIndex: 'person',
                    key: 'person',
                  },
                  {
                    title: '维护内容',
                    dataIndex: 'content',
                    key: 'content',
                  },
                  {
                    title: '维护结果',
                    dataIndex: 'result',
                    key: 'result',
                    render: (text) => {
                      let color = 'green';
                      if (text === '需要进一步维护') color = 'orange';
                      return <Tag color={color}>{text}</Tag>;
                    }
                  },
                ]}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="告警记录" key="alarm">
            <Card title="设备告警历史" bordered={false}>
              <Table
                columns={alarmHistoryColumns.filter(col => col.key !== 'action')}
                dataSource={deviceInfo?.deviceAlarmHistory || []}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </TabPane>
          <TabPane tab="操作记录" key="operation">
            <Card title="设备操作记录" bordered={false}>
              <Table
                columns={[
                  {
                    title: '操作时间',
                    dataIndex: 'time',
                    key: 'time',
                    sorter: (a, b) => new Date(a.time) - new Date(b.time),
                  },
                  {
                    title: '操作类型',
                    dataIndex: 'type',
                    key: 'type',
                    filters: [
                      { text: '远程控制', value: '远程控制' },
                      { text: '参数调整', value: '参数调整' },
                      { text: '状态切换', value: '状态切换' },
                      { text: '数据查询', value: '数据查询' },
                    ],
                    onFilter: (value, record) => record.type === value,
                    render: (text) => {
                      let color = 'blue';
                      if (text === '远程控制') color = 'purple';
                      if (text === '参数调整') color = 'cyan';
                      if (text === '状态切换') color = 'green';
                      return <Tag color={color}>{text}</Tag>;
                    }
                  },
                  {
                    title: '操作人员',
                    dataIndex: 'operator',
                    key: 'operator',
                  },
                  {
                    title: '操作内容',
                    dataIndex: 'content',
                    key: 'content',
                  },
                  {
                    title: '操作结果',
                    dataIndex: 'result',
                    key: 'result',
                    render: (text) => {
                      let color = 'green';
                      if (text === '失败') color = 'red';
                      if (text === '部分成功') color = 'orange';
                      return <Tag color={color}>{text}</Tag>;
                    }
                  },
                ]}
                dataSource={[
                  {
                    key: '1',
                    time: '2023-11-15 14:30:22',
                    type: '远程控制',
                    operator: '系统管理员',
                    content: '重启设备',
                    result: '成功'
                  },
                  {
                    key: '2',
                    time: '2023-11-10 09:15:45',
                    type: '参数调整',
                    operator: '张工',
                    content: '调整液位报警阈值',
                    result: '成功'
                  },
                  {
                    key: '3',
                    time: '2023-10-25 16:42:18',
                    type: '状态切换',
                    operator: '李工',
                    content: '切换至维护模式',
                    result: '成功'
                  },
                  {
                    key: '4',
                    time: '2023-10-20 11:05:33',
                    type: '远程控制',
                    operator: '系统管理员',
                    content: '固件升级',
                    result: '部分成功'
                  },
                  {
                    key: '5',
                    time: '2023-10-15 08:30:12',
                    type: '数据查询',
                    operator: '王工',
                    content: '导出历史数据',
                    result: '成功'
                  }
                ]}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default DeviceDetail; 