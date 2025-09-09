import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Select, Button, Space, DatePicker, message, Statistic } from 'antd';
import { SearchOutlined, ReloadOutlined, UserOutlined, TeamOutlined, TrophyOutlined, LinkOutlined, HeartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import './index.css';
import customerCenterData from '../../../mock/analytics/customerCenterData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CustomerCenter = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('memberGrowth');
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState('last7Days');
  const [customDateRange, setCustomDateRange] = useState([]);


  // 数据状态
  const [memberGrowthData, setMemberGrowthData] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);
  const [memberLevelData, setMemberLevelData] = useState({});
  const [channelData, setChannelData] = useState([]);
  const [loyaltyData, setLoyaltyData] = useState([]);

  useEffect(() => {
    loadData();
  }, [dateRange, customDateRange]);

  // 加载数据
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      let sourceData;
      
      if (dateRange === 'custom' && customDateRange.length === 2) {
        // 自定义日期范围 - 使用模拟数据
        sourceData = customerCenterData.memberGrowthTrend.last30Days;
      } else {
        switch (dateRange) {
          case 'today':
            sourceData = [customerCenterData.memberGrowthTrend.today];
            break;
          case 'yesterday':
            sourceData = [customerCenterData.memberGrowthTrend.yesterday];
            break;
          case 'last7Days':
            sourceData = customerCenterData.memberGrowthTrend.last7Days;
            break;
          case 'last30Days':
            sourceData = customerCenterData.memberGrowthTrend.last30Days;
            break;
          default:
            sourceData = customerCenterData.memberGrowthTrend.last7Days;
        }
      }

      setMemberGrowthData(sourceData);
      
      // 设置其他数据
      if (dateRange === 'custom' && customDateRange.length === 2) {
        setConsumptionData(customerCenterData.consumptionDistribution.last30Days);
        setMemberLevelData(customerCenterData.memberLevelAnalysis.last30Days);
        setChannelData(customerCenterData.channelAnalysis.last30Days.channels);
        setLoyaltyData(customerCenterData.loyaltyAnalysis.last30Days);
      } else {
        const consumptionKey = dateRange === 'today' ? 'today' : 
                             dateRange === 'yesterday' ? 'yesterday' :
                             dateRange === 'last7Days' ? 'last7Days' :
                             'last30Days';
        
        setConsumptionData(Array.isArray(customerCenterData.consumptionDistribution[consumptionKey]) 
          ? customerCenterData.consumptionDistribution[consumptionKey] 
          : [customerCenterData.consumptionDistribution[consumptionKey]]);
          
        setMemberLevelData(customerCenterData.memberLevelAnalysis[consumptionKey]);
        setChannelData(customerCenterData.channelAnalysis[consumptionKey].channels);
        setLoyaltyData(Array.isArray(customerCenterData.loyaltyAnalysis[consumptionKey]) 
          ? customerCenterData.loyaltyAnalysis[consumptionKey] 
          : [customerCenterData.loyaltyAnalysis[consumptionKey]]);
      }
      
      setLoading(false);
    }, 500);
  };

  // 处理筛选
  const handleFilter = (values) => {
    if (values.dateRange === 'custom' && values.customRange) {
      setDateRange('custom');
      setCustomDateRange(values.customRange);
    } else if (values.dateRange && values.dateRange !== 'custom') {
      setDateRange(values.dateRange);
      setCustomDateRange([]);
    }
  };

  // 重置筛选
  const handleReset = () => {
    form.resetFields();
    setDateRange('last7Days');
    setCustomDateRange([]);
  };

  // 跳转到会员中心
  const handleGoToMemberCenter = () => {
    // 使用window.location进行页面跳转
    window.location.hash = '#/member';
    message.info('正在跳转到会员中心...');
  };

  // 会员增长趋势图表配置
  const memberGrowthOption = {
    title: {
      text: '会员增长趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['新增会员', '累计会员'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: memberGrowthData.map(item => Array.isArray(memberGrowthData) && memberGrowthData.length === 1 ? '今日' : item.date)
    },
    yAxis: [
      {
        type: 'value',
        name: '新增会员',
        position: 'left',
        axisLabel: {
          formatter: '{value} 人'
        }
      },
      {
        type: 'value',
        name: '累计会员',
        position: 'right',
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [
      {
        name: '新增会员',
        type: 'line',
        yAxisIndex: 0,
        data: memberGrowthData.map(item => item.newMembers),
        itemStyle: { color: '#32AF50' },
        smooth: true
      },
      {
        name: '累计会员',
        type: 'bar',
        yAxisIndex: 1,
        data: memberGrowthData.map(item => item.totalMembers),
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  // 消费人数分布图表配置
  const consumptionDistributionOption = {
    title: {
      text: '会员消费与非会员消费分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['会员消费金额', '非会员消费金额', '会员人数', '非会员人数'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: consumptionData.map(item => Array.isArray(consumptionData) && consumptionData.length === 1 ? '今日' : item.date)
    },
    yAxis: [
      {
        type: 'value',
        name: '消费金额(元)',
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '人数',
        position: 'right',
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [
      {
        name: '会员消费金额',
        type: 'bar',
        yAxisIndex: 0,
        data: consumptionData.map(item => item.memberConsumption),
        itemStyle: { color: '#32AF50' }
      },
      {
        name: '非会员消费金额',
        type: 'bar',
        yAxisIndex: 0,
        data: consumptionData.map(item => item.nonMemberConsumption),
        itemStyle: { color: '#fa8c16' }
      },
      {
        name: '会员人数',
        type: 'line',
        yAxisIndex: 1,
        data: consumptionData.map(item => item.memberCount),
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '非会员人数',
        type: 'line',
        yAxisIndex: 1,
        data: consumptionData.map(item => item.nonMemberCount),
        itemStyle: { color: '#f5222d' }
      }
    ]
  };

  // 会员等级分析图表配置
  const memberLevelOption = {
    title: {
      text: '会员等级分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} 人 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      data: Object.keys(memberLevelData)
    },
    series: [
      {
        name: '会员等级',
        type: 'pie',
        radius: '50%',
        center: ['60%', '50%'],
        data: Object.entries(memberLevelData).map(([level, data]) => ({
          value: data.count,
          name: level
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

  // 渠道客户分析图表配置
  const channelAnalysisOption = {
    title: {
      text: '注册渠道分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} 人 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      data: channelData.map(item => item.name)
    },
    series: [
      {
        name: '注册渠道',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: channelData.map(item => ({
          value: item.count,
          name: item.name
        }))
      }
    ]
  };

  // 渠道会员活跃度图表配置
  const channelActiveRateOption = {
    title: {
      text: '渠道会员活跃度排名',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    yAxis: {
      type: 'category',
      data: channelData.map(item => item.name)
    },
    series: [
      {
        name: '活跃度',
        type: 'bar',
        data: channelData.map(item => item.activeRate),
        itemStyle: { color: '#32AF50' }
      }
    ]
  };

  // 会员忠诚度分析图表配置
  const loyaltyAnalysisOption = {
    title: {
      text: '会员忠诚度分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['消费金额', '消费次数', '积分获得', '积分使用', '优惠券发送', '优惠券核销'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: loyaltyData.map(item => Array.isArray(loyaltyData) && loyaltyData.length === 1 ? '今日' : item.date)
    },
    yAxis: [
      {
        type: 'value',
        name: '金额/次数',
        position: 'left'
      },
      {
        type: 'value',
        name: '积分/优惠券',
        position: 'right'
      }
    ],
    series: [
      {
        name: '消费金额',
        type: 'line',
        yAxisIndex: 0,
        data: loyaltyData.map(item => item.consumptionAmount),
        itemStyle: { color: '#32AF50' }
      },
      {
        name: '消费次数',
        type: 'line',
        yAxisIndex: 0,
        data: loyaltyData.map(item => item.consumptionCount),
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '积分获得',
        type: 'line',
        yAxisIndex: 1,
        data: loyaltyData.map(item => item.pointsEarned),
        itemStyle: { color: '#fa8c16' }
      },
      {
        name: '积分使用',
        type: 'line',
        yAxisIndex: 1,
        data: loyaltyData.map(item => item.pointsUsed),
        itemStyle: { color: '#f5222d' }
      },
      {
        name: '优惠券发送',
        type: 'bar',
        yAxisIndex: 1,
        data: loyaltyData.map(item => item.couponsIssued),
        itemStyle: { color: '#722ed1' }
      },
      {
        name: '优惠券核销',
        type: 'bar',
        yAxisIndex: 1,
        data: loyaltyData.map(item => item.couponsRedeemed),
        itemStyle: { color: '#13c2c2' }
      }
    ]
  };

  // 油品消费占比图表配置
  const oilConsumptionOption = {
    title: {
      text: '会员油品消费结构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['汽油', '柴油']
    },
    series: [
      {
        name: '油品消费',
        type: 'pie',
        radius: '55%',
        center: ['60%', '50%'],
        data: loyaltyData.length > 0 ? [
          { value: loyaltyData[loyaltyData.length - 1]?.oilConsumption?.gasoline || 0, name: '汽油' },
          { value: loyaltyData[loyaltyData.length - 1]?.oilConsumption?.diesel || 0, name: '柴油' }
        ] : [],
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

  const tabItems = [
    {
      key: 'memberGrowth',
      label: (
        <span>
          <UserOutlined />
          会员增长趋势
        </span>
      ),
      children: (
        <div>
          <Row gutter={16}>
            <Col span={18}>
              <Card className="dashboard-card">
                <ReactECharts option={memberGrowthOption} style={{ height: 400 }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="增长概览" className="dashboard-card">
                <div style={{ padding: '20px 0' }}>
                  <Statistic 
                    title="今日新增" 
                    value={memberGrowthData.length > 0 ? memberGrowthData[memberGrowthData.length - 1]?.newMembers : 0} 
                    suffix="人"
                    valueStyle={{ color: '#32AF50' }}
                  />
                  <Statistic 
                    title="累计会员" 
                    value={memberGrowthData.length > 0 ? memberGrowthData[memberGrowthData.length - 1]?.totalMembers : 0} 
                    suffix="人"
                    valueStyle={{ color: '#1890ff' }}
                    style={{ marginTop: 20 }}
                  />
                  <Statistic 
                    title="平均日增" 
                    value={memberGrowthData.length > 0 ? Math.round(memberGrowthData.reduce((sum, item) => sum + item.newMembers, 0) / memberGrowthData.length) : 0} 
                    suffix="人"
                    valueStyle={{ color: '#fa8c16' }}
                    style={{ marginTop: 20 }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'consumptionDistribution',
      label: (
        <span>
          <TeamOutlined />
          消费人数分布
        </span>
      ),
      children: (
        <div>
          <Row gutter={16}>
            <Col span={24}>
              <Card className="dashboard-card">
                <ReactECharts option={consumptionDistributionOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card className="dashboard-card">
                <Statistic 
                  title="会员消费占比" 
                  value={consumptionData.length > 0 ? 
                    ((consumptionData[consumptionData.length - 1]?.memberConsumption || 0) / 
                    ((consumptionData[consumptionData.length - 1]?.memberConsumption || 0) + 
                     (consumptionData[consumptionData.length - 1]?.nonMemberConsumption || 0)) * 100).toFixed(1) : 0} 
                  suffix="%"
                  valueStyle={{ color: '#32AF50' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="dashboard-card">
                <Statistic 
                  title="非会员消费占比" 
                  value={consumptionData.length > 0 ? 
                    ((consumptionData[consumptionData.length - 1]?.nonMemberConsumption || 0) / 
                    ((consumptionData[consumptionData.length - 1]?.memberConsumption || 0) + 
                     (consumptionData[consumptionData.length - 1]?.nonMemberConsumption || 0)) * 100).toFixed(1) : 0} 
                  suffix="%"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="dashboard-card">
                <Statistic 
                  title="会员人数占比" 
                  value={consumptionData.length > 0 ? 
                    ((consumptionData[consumptionData.length - 1]?.memberCount || 0) / 
                    ((consumptionData[consumptionData.length - 1]?.memberCount || 0) + 
                     (consumptionData[consumptionData.length - 1]?.nonMemberCount || 0)) * 100).toFixed(1) : 0} 
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="dashboard-card">
                <Statistic 
                  title="非会员人数占比" 
                  value={consumptionData.length > 0 ? 
                    ((consumptionData[consumptionData.length - 1]?.nonMemberCount || 0) / 
                    ((consumptionData[consumptionData.length - 1]?.memberCount || 0) + 
                     (consumptionData[consumptionData.length - 1]?.nonMemberCount || 0)) * 100).toFixed(1) : 0} 
                  suffix="%"
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'memberLevel',
      label: (
        <span>
          <TrophyOutlined />
          会员等级分析
        </span>
      ),
      children: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card className="dashboard-card">
                <ReactECharts option={memberLevelOption} style={{ height: 400 }} />
              </Card>
            </Col>
            <Col span={12}>
                             <Card title="等级分布详情" className="dashboard-card">
                 <div style={{ padding: '20px 0' }}>
                   {Object.entries(memberLevelData).map(([level, data]) => (
                     <div key={level} className="level-detail-item">
                       <span className="level-detail-label">{level}会员：</span>
                       <span>
                         <strong className="level-detail-value">{data.count}</strong> 人 
                         <span className="level-detail-percentage">({data.percentage}%)</span>
                       </span>
                     </div>
                   ))}
                 </div>
               </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'memberDetails',
      label: (
        <span>
          <TeamOutlined />
          会员明细分析
        </span>
      ),
      children: (
        <div>
          <Card className="dashboard-card">
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <UserOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
              <h2>会员明细分析</h2>
              <p style={{ color: '#666', marginBottom: 32 }}>
                查看详细的会员数据和分析报告
              </p>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleGoToMemberCenter}
                icon={<TeamOutlined />}
              >
                前往会员中心查看详细数据
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: 'channelAnalysis',
      label: (
        <span>
          <LinkOutlined />
          渠道客户分析
        </span>
      ),
      children: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card className="dashboard-card">
                <ReactECharts option={channelAnalysisOption} style={{ height: 350 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="dashboard-card">
                <ReactECharts option={channelActiveRateOption} style={{ height: 350 }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="渠道贡献排名" className="dashboard-card">
                                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                   {channelData.map((channel, index) => (
                     <Card key={channel.name} size="small" className="channel-contribution-card">
                       <Statistic 
                         title={`${index + 1}. ${channel.name}`} 
                         value={channel.contributionAmount} 
                         suffix="元"
                         precision={0}
                         valueStyle={{ color: index < 3 ? '#32AF50' : '#666' }}
                       />
                       <div className="channel-meta">
                         会员数: {channel.count} | 活跃度: {channel.activeRate}%
                       </div>
                     </Card>
                   ))}
                 </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'loyalty',
      label: (
        <span>
          <HeartOutlined />
          会员忠诚度分析
        </span>
      ),
      children: (
        <div>
          <Row gutter={16}>
            <Col span={24}>
              <Card className="dashboard-card">
                <ReactECharts option={loyaltyAnalysisOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card className="dashboard-card">
                <ReactECharts option={oilConsumptionOption} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="忠诚度指标" className="dashboard-card">
                <div style={{ padding: '20px 0' }}>
                  <Statistic 
                    title="平均消费金额" 
                    value={loyaltyData.length > 0 ? (loyaltyData[loyaltyData.length - 1]?.consumptionAmount || 0) : 0} 
                    suffix="元"
                    valueStyle={{ color: '#32AF50' }}
                  />
                  <Statistic 
                    title="平均消费次数" 
                    value={loyaltyData.length > 0 ? (loyaltyData[loyaltyData.length - 1]?.consumptionCount || 0) : 0} 
                    suffix="次"
                    valueStyle={{ color: '#1890ff' }}
                    style={{ marginTop: 16 }}
                  />
                  <Statistic 
                    title="积分获得" 
                    value={loyaltyData.length > 0 ? (loyaltyData[loyaltyData.length - 1]?.pointsEarned || 0) : 0} 
                    suffix="分"
                    valueStyle={{ color: '#fa8c16' }}
                    style={{ marginTop: 16 }}
                  />
                  <Statistic 
                    title="优惠券核销率" 
                    value={loyaltyData.length > 0 && loyaltyData[loyaltyData.length - 1]?.couponsIssued > 0 ? 
                      ((loyaltyData[loyaltyData.length - 1]?.couponsRedeemed || 0) / 
                       (loyaltyData[loyaltyData.length - 1]?.couponsIssued || 1) * 100).toFixed(1) : 0} 
                    suffix="%"
                    valueStyle={{ color: '#722ed1' }}
                    style={{ marginTop: 16 }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="customer-center-container">
      <Card>
        <Spin spinning={loading}>
          {/* 筛选区域 */}
          <Form
            form={form}
            layout="inline"
            onFinish={handleFilter}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={24}>
                <Space wrap>
                  <Form.Item name="dateRange" label="时间范围" initialValue="last7Days">
                    <Select style={{ width: 150 }}>
                      <Option value="today">当天</Option>
                      <Option value="yesterday">昨天</Option>
                      <Option value="last7Days">过去7天</Option>
                      <Option value="last30Days">过去30天</Option>
                      <Option value="custom">自定义</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => 
                      prevValues.dateRange !== currentValues.dateRange
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('dateRange') === 'custom' ? (
                        <Form.Item name="customRange" label="自定义日期">
                          <RangePicker style={{ width: 240 }} />
                        </Form.Item>
                      ) : null
                    }
                  </Form.Item>
                </Space>
              </Col>
              <Col span={24} style={{ marginTop: 8 }}>
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

          {/* Tab页面 */}
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>

      {/* 备注信息 */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: '#f6f8fa', 
        borderRadius: 4, 
        border: '1px solid #e1e8ed',
        fontSize: 12,
        color: '#666'
      }}>
        <strong>功能演示说明：</strong>
        <br />
        1. 会员增长趋势：展示老会员和新增会员的趋势图及总用户数据信息
        <br />
        2. 消费人数分布：展示会员消费与非会员消费趋势和比例
        <br />
        3. 会员等级分析：展示各等级会员占总会员的比重
        <br />
        4. 会员明细分析：点击按钮可跳转到会员中心查看详细数据
        <br />
        5. 渠道客户分析：展示不同注册渠道客户分析，包括渠道会员活跃度和贡献排名
        <br />
        6. 会员忠诚度分析：展示会员消费金额、油品占比、消费次数、积分和优惠券数据
        <br />
        * 所有图表支持当天、昨天、过去7天、过去30天或自定义日期范围筛选
      </div>
    </div>
  );
};

export default CustomerCenter;