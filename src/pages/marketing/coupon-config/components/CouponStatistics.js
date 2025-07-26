import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Button, Space, message } from 'antd';
import { GiftOutlined, SendOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

import { getCouponStatistics, getCouponOptions } from '../services/api';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const CouponStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [couponOptions, setCouponOptions] = useState([]);
  const [filters, setFilters] = useState({
    couponId: 'all',
    couponType: 'all',
    dateRange: [moment().subtract(6, 'days'), moment()],
  });
  const [statisticsData, setStatisticsData] = useState({
    summary: {
      totalIssued: 0,
      totalRedeemed: 0,
      totalExpired: 0,
      redemptionRate: 0,
    },
    dailyTrends: [],
  });

  // 加载优惠券选项
  const loadCouponOptions = async () => {
    try {
      const response = await getCouponOptions();
      setCouponOptions(response.data || []);
    } catch (error) {
      console.error('加载优惠券选项失败:', error);
      message.error('加载优惠券选项失败');
    }
  };

  // 加载统计数据
  const loadStatistics = async () => {
    setLoading(true);
    setChartLoading(true);
    try {
      const params = {
        couponId: filters.couponId,
        couponType: filters.couponType,
        dateRange: filters.dateRange ? [
          filters.dateRange[0].format('YYYY-MM-DD'),
          filters.dateRange[1].format('YYYY-MM-DD')
        ] : null,
      };
      
      const response = await getCouponStatistics(params);
      setStatisticsData(response.data || {
        summary: { totalIssued: 0, totalRedeemed: 0, totalExpired: 0, redemptionRate: 0 },
        dailyTrends: [],
      });
    } catch (error) {
      console.error('加载统计数据失败:', error);
      message.error('加载统计数据失败');
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  // 重置筛选条件
  const handleReset = () => {
    setFilters({
      couponId: 'all',
      couponType: 'all',
      dateRange: [moment().subtract(6, 'days'), moment()],
    });
  };

  // 筛选条件变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    loadCouponOptions();
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [filters]);

  // 构建图表配置
  const buildChartOption = () => {
    const dates = statisticsData.dailyTrends.map(item => 
      moment(item.date).format('MM-DD')
    );
    const issuedData = statisticsData.dailyTrends.map(item => item.issued);
    const redeemedData = statisticsData.dailyTrends.map(item => item.redeemed);

    return {
      title: {
        text: '优惠券发送和核销趋势',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach(item => {
            result += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['发送数量', '核销数量'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12
        }
      },
      color: ['#32AF50', '#1890ff'],
      series: [
        {
          name: '发送数量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          data: issuedData,
          areaStyle: {
            opacity: 0.3
          }
        },
        {
          name: '核销数量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          data: redeemedData,
          areaStyle: {
            opacity: 0.3
          }
        },
      ],
    };
  };

  return (
    <div>
      {/* 筛选条件 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>选择优惠券</div>
            <Select 
              placeholder="请选择优惠券" 
              style={{ width: '100%' }}
              value={filters.couponId}
              onChange={(value) => handleFilterChange('couponId', value)}
            >
              {couponOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>优惠券类型</div>
            <Select 
              placeholder="选择优惠券类型" 
              style={{ width: '100%' }}
              value={filters.couponType}
              onChange={(value) => handleFilterChange('couponType', value)}
            >
              <Option value="all">全部类型</Option>
              <Option value="oil">油品券</Option>
              <Option value="non-oil">非油券</Option>
              <Option value="recharge">充值赠金券</Option>
            </Select>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>时间范围</div>
            <RangePicker 
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              format="YYYY-MM-DD"
            />
          </Col>
          <Col span={4}>
            <div style={{ marginBottom: 8, fontSize: '14px', color: 'transparent' }}>操作</div>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={loadStatistics}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="累计发送（领取）"
              value={statisticsData.summary.totalIssued}
              prefix={<SendOutlined />}
              valueStyle={{ color: '#32AF50', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="累计核销"
              value={statisticsData.summary.totalRedeemed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="累计过期"
              value={statisticsData.summary.totalExpired}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="核销率"
              value={statisticsData.summary.redemptionRate}
              precision={1}
              suffix="%"
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="发送和核销趋势分析" className="dashboard-card">
            <ReactECharts 
              option={buildChartOption()} 
              style={{ height: 350 }}
              loading={chartLoading}
              loadingOption={{
                text: '图表加载中...',
                color: '#32AF50',
                textColor: '#666',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CouponStatistics; 