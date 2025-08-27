import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  DatePicker, 
  Select, 
  Button, 
  Space, 
  message,
  Progress,
  Divider
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import * as echarts from 'echarts';

// 模拟数据导入
import statisticsData from '../../../mock/invoice/statistics.json';

const { RangePicker } = DatePicker;
const { Option } = Select;

const StatisticsAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({});
  const [trendData, setTrendData] = useState({});
  const [stationStats, setStationStats] = useState([]);
  const [typeStats, setTypeStats] = useState([]);
  const [failureReasons, setFailureReasons] = useState([]);
  const [amountDistribution, setAmountDistribution] = useState([]);
  const [dateRange, setDateRange] = useState('thisMonth');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // 初始化图表
    initCharts();
  }, [trendData, typeStats, failureReasons, amountDistribution]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOverview(statisticsData.overview);
      setTrendData(statisticsData.trendData);
      setStationStats(statisticsData.stationStats.map(item => ({ ...item, key: item.stationName })));
      setTypeStats(statisticsData.invoiceTypeStats);
      setFailureReasons(statisticsData.failureReasons);
      setAmountDistribution(statisticsData.amountDistribution);
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const initCharts = () => {
    // 趋势图表
    if (trendData.daily && trendData.daily.length > 0) {
      initTrendChart();
    }
    
    // 发票类型图表
    if (typeStats.length > 0) {
      initTypeChart();
    }
    
    // 失败原因图表
    if (failureReasons.length > 0) {
      initFailureChart();
    }
    
    // 金额分布图表
    if (amountDistribution.length > 0) {
      initAmountChart();
    }
  };

  const initTrendChart = () => {
    const chartDom = document.getElementById('trendChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '开票趋势分析',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['开票总数', '成功数量', '失败数量'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: trendData.daily.map(item => item.date.substring(5))
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '开票总数',
          type: 'line',
          data: trendData.daily.map(item => item.total),
          smooth: true
        },
        {
          name: '成功数量',
          type: 'line',
          data: trendData.daily.map(item => item.success),
          smooth: true
        },
        {
          name: '失败数量',
          type: 'line',
          data: trendData.daily.map(item => item.failed),
          smooth: true
        }
      ]
    };
    myChart.setOption(option);
  };

  const initTypeChart = () => {
    const chartDom = document.getElementById('typeChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '发票类型分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '发票类型',
          type: 'pie',
          radius: '50%',
          data: typeStats.map(item => ({
            value: item.count,
            name: item.invoiceType
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  };

  const initFailureChart = () => {
    const chartDom = document.getElementById('failureChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '开票失败原因分析',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '失败原因',
          type: 'pie',
          radius: ['40%', '70%'],
          data: failureReasons.map(item => ({
            value: item.count,
            name: item.reason
          }))
        }
      ]
    };
    myChart.setOption(option);
  };

  const initAmountChart = () => {
    const chartDom = document.getElementById('amountChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '开票金额分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: amountDistribution.map(item => item.range)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: amountDistribution.map(item => item.count),
          type: 'bar',
          itemStyle: {
            color: '#1890ff'
          }
        }
      ]
    };
    myChart.setOption(option);
  };

  // 概览数据渲染
  const renderOverview = () => {
    const currentData = overview[dateRange] || {};
    
    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="开票总数"
              value={currentData.totalCount}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功数量"
              value={currentData.successCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="失败数量"
              value={currentData.failedCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功率"
              value={currentData.successRate}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 油站统计表格列定义
  const stationColumns = [
    {
      title: '油站名称',
      dataIndex: 'stationName',
      width: 200,
      ellipsis: true
    },
    {
      title: '开票总数',
      dataIndex: 'totalCount',
      width: 100,
      align: 'right'
    },
    {
      title: '成功数量',
      dataIndex: 'successCount',
      width: 100,
      align: 'right'
    },
    {
      title: '失败数量',
      dataIndex: 'failedCount',
      width: 100,
      align: 'right'
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      width: 120,
      align: 'center',
      render: (value) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value >= 95 ? 'success' : value >= 90 ? 'normal' : 'exception'}
        />
      )
    },
    {
      title: '开票金额',
      dataIndex: 'totalAmount',
      width: 120,
      align: 'right',
      render: (value) => `¥${value?.toLocaleString()}`
    },
    {
      title: '平均金额',
      dataIndex: 'avgAmount',
      width: 120,
      align: 'right',
      render: (value) => `¥${value?.toFixed(2)}`
    }
  ];

  return (
    <div>
      {/* 时间范围选择 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>统计周期：</span>
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 120 }}
          >
            <Option value="today">今日</Option>
            <Option value="thisWeek">本周</Option>
            <Option value="thisMonth">本月</Option>
          </Select>
          <RangePicker />
          <Button type="primary" style={{ borderRadius: '2px' }}>
            查询
          </Button>
        </Space>
      </Card>

      {/* 概览统计 */}
      {renderOverview()}

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="开票趋势">
            <div id="trendChart" style={{ height: 300 }}></div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="发票类型分布">
            <div id="typeChart" style={{ height: 300 }}></div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="失败原因分析">
            <div id="failureChart" style={{ height: 300 }}></div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="金额分布">
            <div id="amountChart" style={{ height: 300 }}></div>
          </Card>
        </Col>
      </Row>

      {/* 油站统计表格 */}
      <Card title="各油站开票统计">
        <Table
          columns={stationColumns}
          dataSource={stationStats}
          loading={loading}
          scroll={{ x: 'max-content' }}
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>
    </div>
  );
};

export default StatisticsAnalysis;