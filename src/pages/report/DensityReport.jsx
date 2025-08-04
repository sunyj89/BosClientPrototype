import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  DatePicker, 
  Select, 
  Breadcrumb,
  Row,
  Col,
  Statistic,
  Divider,
  Typography,
  Tabs,
  Radio
} from 'antd';
import { 
  DownloadOutlined, 
  PrinterOutlined, 
  ReloadOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DensityReport = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([dayjs().subtract(6, 'month'), dayjs()]);
  const [selectedStation, setSelectedStation] = useState('all');
  const [selectedOilType, setSelectedOilType] = useState('all');
  const [reportType, setReportType] = useState('monthly');
  const [chartType, setChartType] = useState('line');
  const [densityData, setDensityData] = useState([]);
  
  // 模拟油站数据
  const stations = [
    { id: 'station-1', name: '加油站 1-1' },
    { id: 'station-2', name: '加油站 1-2' },
    { id: 'station-3', name: '加油站 1-3' },
    { id: 'station-4', name: '加油站 2-1' },
    { id: 'station-5', name: '加油站 2-2' },
  ];
  
  // 模拟油品类型
  const oilTypes = [
    { id: 'oil-1', name: '92#汽油' },
    { id: 'oil-2', name: '95#汽油' },
    { id: 'oil-3', name: '98#汽油' },
    { id: 'oil-4', name: '0#柴油' },
  ];
  
  // 获取密度数据
  useEffect(() => {
    fetchDensityData();
  }, [selectedStation, selectedOilType, dateRange, reportType]);
  
  // 模拟获取密度数据
  const fetchDensityData = () => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 生成模拟数据
      const data = generateMockDensityData();
      setDensityData(data);
      setLoading(false);
    }, 500);
  };
  
  // 生成模拟密度数据
  const generateMockDensityData = () => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    
    // 根据报表类型确定数据粒度
    let dataPoints = [];
    if (reportType === 'monthly') {
      // 按月生成数据点
      let currentDate = dayjs(startDate).startOf('month');
      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'month')) {
        dataPoints.push(currentDate);
        currentDate = currentDate.add(1, 'month');
      }
    } else {
      // 按季度生成数据点
      let currentDate = dayjs(startDate).startOf('quarter');
      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'quarter')) {
        dataPoints.push(currentDate);
        currentDate = currentDate.add(1, 'quarter');
      }
    }
    
    // 为每个油站和油品类型生成数据
    const data = [];
    
    stations.forEach(station => {
      if (selectedStation !== 'all' && selectedStation !== station.id) {
        return;
      }
      
      oilTypes.forEach(oilType => {
        if (selectedOilType !== 'all' && selectedOilType !== oilType.id) {
          return;
        }
        
        // 为每个时间点生成密度记录
        dataPoints.forEach(date => {
          const baseDensity = getBaseDensity(oilType.id);
          
          // 随机生成密度值（基础密度值上下浮动）
          const density = (baseDensity + (Math.random() * 0.02 - 0.01)).toFixed(4);
          
          // 计算吨升转换系数
          const conversionFactor = (1 / parseFloat(density)).toFixed(4);
          
          // 生成随机的温度值 (15-30°C)
          const temperature = (15 + Math.random() * 15).toFixed(1);
          
          data.push({
            key: `${station.id}-${oilType.id}-${date.format('YYYY-MM')}`,
            stationId: station.id,
            stationName: station.name,
            oilTypeId: oilType.id,
            oilTypeName: oilType.name,
            period: reportType === 'monthly' ? date.format('YYYY-MM') : `${date.format('YYYY')}Q${date.quarter()}`,
            density: density,
            conversionFactor: conversionFactor,
            temperature: temperature,
            recordCount: Math.floor(Math.random() * 10) + 1,
            minDensity: (parseFloat(density) - 0.005).toFixed(4),
            maxDensity: (parseFloat(density) + 0.005).toFixed(4),
            stdDev: (Math.random() * 0.003).toFixed(4)
          });
        });
      });
    });
    
    return data;
  };
  
  // 获取基础密度值
  const getBaseDensity = (oilTypeId) => {
    switch (oilTypeId) {
      case 'oil-1': return 0.725; // 92#汽油
      case 'oil-2': return 0.737; // 95#汽油
      case 'oil-3': return 0.753; // 98#汽油
      case 'oil-4': return 0.845; // 0#柴油
      default: return 0.75;
    }
  };
  
  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };
  
  // 处理油站选择变化
  const handleStationChange = (value) => {
    setSelectedStation(value);
  };
  
  // 处理油品类型选择变化
  const handleOilTypeChange = (value) => {
    setSelectedOilType(value);
  };
  
  // 处理报表类型变化
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };
  
  // 处理图表类型变化
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };
  
  // 获取密度趋势图配置
  const getDensityTrendOption = () => {
    // 按油品类型分组
    const oilTypeGroups = {};
    oilTypes.forEach(oilType => {
      if (selectedOilType === 'all' || selectedOilType === oilType.id) {
        oilTypeGroups[oilType.id] = densityData.filter(item => item.oilTypeId === oilType.id);
      }
    });
    
    // 准备图表数据
    const xAxisData = [...new Set(densityData.map(item => item.period))].sort();
    const series = [];
    
    Object.keys(oilTypeGroups).forEach(oilTypeId => {
      const oilTypeName = oilTypes.find(ot => ot.id === oilTypeId).name;
      const data = [];
      
      xAxisData.forEach(period => {
        const matchingItems = oilTypeGroups[oilTypeId].filter(item => item.period === period);
        if (matchingItems.length > 0) {
          // 计算该时间段该油品类型的平均密度
          const avgDensity = matchingItems.reduce((sum, item) => sum + parseFloat(item.density), 0) / matchingItems.length;
          data.push(avgDensity.toFixed(4));
        } else {
          data.push(null);
        }
      });
      
      series.push({
        name: oilTypeName,
        type: chartType,
        data: data,
        smooth: true
      });
    });
    
    return {
      title: {
        text: '密度趋势图',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: Object.keys(oilTypeGroups).map(id => oilTypes.find(ot => ot.id === id).name),
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        name: '密度(kg/L)',
        min: function(value) {
          return (Math.floor(value.min * 1000) / 1000).toFixed(3);
        }
      },
      series: series
    };
  };
  
  // 获取温度与密度关系图配置
  const getTemperatureDensityOption = () => {
    // 按油品类型分组
    const oilTypeGroups = {};
    oilTypes.forEach(oilType => {
      if (selectedOilType === 'all' || selectedOilType === oilType.id) {
        oilTypeGroups[oilType.id] = densityData.filter(item => item.oilTypeId === oilType.id);
      }
    });
    
    // 准备图表数据
    const series = [];
    
    Object.keys(oilTypeGroups).forEach(oilTypeId => {
      const oilTypeName = oilTypes.find(ot => ot.id === oilTypeId).name;
      const data = oilTypeGroups[oilTypeId].map(item => [parseFloat(item.temperature), parseFloat(item.density)]);
      
      series.push({
        name: oilTypeName,
        type: 'scatter',
        data: data,
        symbolSize: 10
      });
    });
    
    return {
      title: {
        text: '温度与密度关系图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `${params.seriesName}<br/>温度: ${params.value[0]}°C<br/>密度: ${params.value[1]} kg/L`;
        }
      },
      legend: {
        data: Object.keys(oilTypeGroups).map(id => oilTypes.find(ot => ot.id === id).name),
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '温度(°C)'
      },
      yAxis: {
        type: 'value',
        name: '密度(kg/L)',
        min: function(value) {
          return (Math.floor(value.min * 1000) / 1000).toFixed(3);
        }
      },
      series: series
    };
  };
  
  // 表格列配置
  const columns = [
    {
      title: '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '油品类型',
      dataIndex: 'oilTypeName',
      key: 'oilTypeName',
      width: 120,
    },
    {
      title: reportType === 'monthly' ? '月份' : '季度',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      sorter: (a, b) => a.period.localeCompare(b.period),
    },
    {
      title: '平均密度(kg/L)',
      dataIndex: 'density',
      key: 'density',
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
      sorter: (a, b) => parseFloat(a.density) - parseFloat(b.density),
    },
    {
      title: '吨升转换系数',
      dataIndex: 'conversionFactor',
      key: 'conversionFactor',
      width: 120,
      render: (text) => <span style={{ color: '#1890ff' }}>{text}</span>,
    },
    {
      title: '最小密度',
      dataIndex: 'minDensity',
      key: 'minDensity',
      width: 120,
    },
    {
      title: '最大密度',
      dataIndex: 'maxDensity',
      key: 'maxDensity',
      width: 120,
    },
    {
      title: '标准差',
      dataIndex: 'stdDev',
      key: 'stdDev',
      width: 100,
    },
    {
      title: '记录数',
      dataIndex: 'recordCount',
      key: 'recordCount',
      width: 100,
    },
    {
      title: '平均温度(°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 120,
    }
  ];
  
  return (
    <div className="density-report">
      <div className="page-header">
        <h2>油品密度报表</h2>
      </div>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="密度记录总数"
              value={densityData.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="92#汽油平均密度"
              value={
                densityData
                  .filter(item => item.oilTypeId === 'oil-1')
                  .reduce((sum, item) => sum + parseFloat(item.density), 0) / 
                (densityData.filter(item => item.oilTypeId === 'oil-1').length || 1)
              }
              precision={4}
              valueStyle={{ color: '#3f8600' }}
              suffix="kg/L"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="95#汽油平均密度"
              value={
                densityData
                  .filter(item => item.oilTypeId === 'oil-2')
                  .reduce((sum, item) => sum + parseFloat(item.density), 0) / 
                (densityData.filter(item => item.oilTypeId === 'oil-2').length || 1)
              }
              precision={4}
              valueStyle={{ color: '#3f8600' }}
              suffix="kg/L"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="0#柴油平均密度"
              value={
                densityData
                  .filter(item => item.oilTypeId === 'oil-4')
                  .reduce((sum, item) => sum + parseFloat(item.density), 0) / 
                (densityData.filter(item => item.oilTypeId === 'oil-4').length || 1)
              }
              precision={4}
              valueStyle={{ color: '#3f8600' }}
              suffix="kg/L"
            />
          </Card>
        </Col>
      </Row>
      
      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Space>
              <span>时间范围:</span>
              <RangePicker 
                value={dateRange} 
                onChange={handleDateRangeChange}
                picker={reportType === 'monthly' ? 'month' : 'quarter'}
                style={{ width: 280 }}
              />
            </Space>
          </Col>
          <Col span={4}>
            <Space>
              <span>油站:</span>
              <Select 
                value={selectedStation} 
                onChange={handleStationChange}
                style={{ width: 150 }}
              >
                <Option value="all">全部油站</Option>
                {stations.map(station => (
                  <Option key={station.id} value={station.id}>{station.name}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col span={4}>
            <Space>
              <span>油品:</span>
              <Select 
                value={selectedOilType} 
                onChange={handleOilTypeChange}
                style={{ width: 120 }}
              >
                <Option value="all">全部油品</Option>
                {oilTypes.map(oilType => (
                  <Option key={oilType.id} value={oilType.id}>{oilType.name}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col span={4}>
            <Radio.Group value={reportType} onChange={handleReportTypeChange}>
              <Radio.Button value="monthly">月度</Radio.Button>
              <Radio.Button value="quarterly">季度</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                icon={<FileExcelOutlined />}
              >
                导出Excel
              </Button>
              <Button 
                icon={<PrinterOutlined />}
              >
                打印
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchDensityData}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      {/* 图表展示 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Radio.Group value={chartType} onChange={handleChartTypeChange} buttonStyle="solid">
            <Radio.Button value="line">折线图</Radio.Button>
            <Radio.Button value="bar">柱状图</Radio.Button>
          </Radio.Group>
        </div>
        <Tabs defaultActiveKey="trend">
          <TabPane tab="密度趋势" key="trend">
            <ReactECharts 
              option={getDensityTrendOption()} 
              style={{ height: 400 }} 
            />
          </TabPane>
          <TabPane tab="温度与密度关系" key="temperature">
            <ReactECharts 
              option={getTemperatureDensityOption()} 
              style={{ height: 400 }} 
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 密度数据表格 */}
      <Card title="密度数据明细">
        <Table 
          columns={columns} 
          dataSource={densityData} 
          rowKey="key"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </Card>
    </div>
  );
};

export default DensityReport; 