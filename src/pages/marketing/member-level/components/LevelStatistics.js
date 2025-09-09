import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Form, Select, DatePicker, Button, Space } from 'antd';
import { TrophyOutlined, UserOutlined, ArrowUpOutlined, ArrowDownOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { Option } = Select;
const { RangePicker } = DatePicker;

const LevelStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [statisticsData, setStatisticsData] = useState({});
  const [levelDistributionData, setLevelDistributionData] = useState([]);
  const [memberFlowData, setMemberFlowData] = useState([]);

  useEffect(() => {
    loadStatisticsData();
    initCharts();
  }, []);

  const loadStatisticsData = async () => {
    setLoading(true);
    try {
      // 模拟统计数据
      const mockStatistics = {
        totalMembers: 25680,
        activeLevels: 4,
        thisMonthUpgrades: 1289,
        thisMonthDowngrades: 523,
        averageConsumption: 1850.5,
        retentionRate: 87.5
      };
      setStatisticsData(mockStatistics);

      // 模拟等级分布数据
      const mockLevelDistribution = [
        {
          levelName: 'Lv1-普通会员',
          memberCount: 12580,
          percentage: 49.0,
          averageConsumption: 800.5,
          color: '#8c8c8c'
        },
        {
          levelName: 'Lv2-银牌会员',
          memberCount: 7850,
          percentage: 30.6,
          averageConsumption: 1650.8,
          color: '#c0c0c0'
        },
        {
          levelName: 'Lv3-黄金会员',
          memberCount: 4200,
          percentage: 16.4,
          averageConsumption: 2850.3,
          color: '#ffd700'
        },
        {
          levelName: 'Lv4-钻石会员',
          memberCount: 1050,
          percentage: 4.0,
          averageConsumption: 5200.8,
          color: '#4169e1'
        }
      ];
      setLevelDistributionData(mockLevelDistribution);

      // 模拟会员流动数据
      const mockMemberFlow = [
        {
          date: '2025-01-01',
          upgrades: 145,
          downgrades: 32,
          newMembers: 256
        },
        {
          date: '2025-01-02',
          upgrades: 189,
          downgrades: 45,
          newMembers: 198
        }
      ];
      setMemberFlowData(mockMemberFlow);

    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const initCharts = () => {
    // 初始化图表
    setTimeout(() => {
      initLevelDistributionChart();
      initMemberFlowChart();
    }, 100);
  };

  const initLevelDistributionChart = () => {
    const chartDom = document.getElementById('levelDistributionChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '会员等级分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '会员等级分布',
          type: 'pie',
          radius: '50%',
          data: levelDistributionData.map(item => ({
            value: item.memberCount,
            name: item.levelName,
            itemStyle: {
              color: item.color
            }
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

  const initMemberFlowChart = () => {
    const chartDom = document.getElementById('memberFlowChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    const dates = ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'];
    const option = {
      title: {
        text: '会员等级变动趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['升级人数', '降级人数', '新增会员'],
        top: 30
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
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '升级人数',
          type: 'line',
          stack: 'Total',
          data: [145, 189, 167, 198, 234, 156, 178],
          itemStyle: { color: '#52c41a' }
        },
        {
          name: '降级人数',
          type: 'line',
          stack: 'Total',
          data: [32, 45, 38, 52, 41, 35, 48],
          itemStyle: { color: '#ff4d4f' }
        },
        {
          name: '新增会员',
          type: 'line',
          stack: 'Total',
          data: [256, 198, 234, 287, 198, 267, 223],
          itemStyle: { color: '#1890ff' }
        }
      ]
    };
    
    myChart.setOption(option);
  };

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    loadStatisticsData();
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadStatisticsData();
  };

  const levelColumns = [
    {
      title: '等级名称',
      dataIndex: 'levelName',
      key: 'levelName',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{
              width: 16,
              height: 16,
              backgroundColor: record.color,
              borderRadius: '50%',
              marginRight: 8
            }}
          />
          <strong>{name}</strong>
        </div>
      )
    },
    {
      title: '会员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
      render: (count) => (
        <strong style={{ color: '#1890ff' }}>{count.toLocaleString()}</strong>
      )
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage, record) => (
        <div>
          <Progress 
            percent={percentage} 
            size="small" 
            strokeColor={record.color}
            format={() => `${percentage}%`}
          />
        </div>
      )
    },
    {
      title: '平均消费(元)',
      dataIndex: 'averageConsumption',
      key: 'averageConsumption',
      render: (consumption) => `¥${consumption.toFixed(2)}`
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={searchForm} onFinish={handleSearch}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Form.Item name="dateRange" label="统计时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="stationGroup" label="油站组">
                <Select placeholder="请选择油站组" style={{ width: '100%' }} allowClear>
                  <Option value="all">全部油站</Option>
                  <Option value="central">赣中分公司</Option>
                  <Option value="northeast">赣东北分公司</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="memberType" label="会员类型">
                <Select placeholder="请选择会员类型" style={{ width: '100%' }} allowClear>
                  <Option value="all">全部会员</Option>
                  <Option value="individual">个人会员</Option>
                  <Option value="corporate">企业会员</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="会员总数"
              value={statisticsData.totalMembers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="启用等级数"
              value={statisticsData.activeLevels}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月升级人数"
              value={statisticsData.thisMonthUpgrades}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月降级人数"
              value={statisticsData.thisMonthDowngrades}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="等级分布统计">
            <div id="levelDistributionChart" style={{ height: '300px' }}></div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="会员流动趋势">
            <div id="memberFlowChart" style={{ height: '300px' }}></div>
          </Card>
        </Col>
      </Row>

      {/* 详细数据表格 */}
      <Card title="等级详细分布">
        <Table
          columns={levelColumns}
          dataSource={levelDistributionData}
          rowKey="levelName"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default LevelStatistics;