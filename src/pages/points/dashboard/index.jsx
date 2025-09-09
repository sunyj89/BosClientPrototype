import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, DatePicker, Space, Select } from 'antd';
import { 
  TrophyOutlined, 
  SendOutlined, 
  ShoppingOutlined, 
  PercentageOutlined, 
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PointsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('today'); // today, week, month
  const [dateRange, setDateRange] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalPointsPool: 0,
    issuedAmount: 0,
    consumedAmount: 0,
    utilizationRate: 0,
    activeMemberCount: 0,
    // 增长率数据
    poolGrowthRate: 0,
    issuedGrowthRate: 0,
    consumedGrowthRate: 0,
    memberGrowthRate: 0
  });

  // 模拟数据加载
  useEffect(() => {
    loadDashboardData();
  }, [period, dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 根据不同周期生成不同的模拟数据
      const mockData = {
        today: {
          totalPointsPool: 2856420,
          issuedAmount: 45820,
          consumedAmount: 38650,
          utilizationRate: 84.35,
          activeMemberCount: 1256,
          poolGrowthRate: 2.5,
          issuedGrowthRate: 12.8,
          consumedGrowthRate: 15.2,
          memberGrowthRate: 8.6
        },
        week: {
          totalPointsPool: 2856420,
          issuedAmount: 321450,
          consumedAmount: 275380,
          utilizationRate: 85.66,
          activeMemberCount: 6842,
          poolGrowthRate: 1.8,
          issuedGrowthRate: 18.5,
          consumedGrowthRate: 22.1,
          memberGrowthRate: 15.3
        },
        month: {
          totalPointsPool: 2856420,
          issuedAmount: 1425600,
          consumedAmount: 1186420,
          utilizationRate: 83.22,
          activeMemberCount: 18750,
          poolGrowthRate: 5.2,
          issuedGrowthRate: 28.7,
          consumedGrowthRate: 25.9,
          memberGrowthRate: 22.4
        }
      };
      
      setDashboardData(mockData[period]);
    } catch (error) {
      console.error('加载积分看板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
    setDateRange([]); // 清空自定义日期范围
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setPeriod('custom'); // 设置为自定义模式
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const StatisticCard = ({ title, value, prefix, suffix, icon, precision = 0, color = '#1890ff', growthRate }) => (
    <Card>
      <Statistic
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{title}</span>
            {growthRate !== undefined && (
              <span style={{ 
                fontSize: '12px', 
                color: growthRate >= 0 ? '#52c41a' : '#ff4d4f',
                display: 'flex',
                alignItems: 'center'
              }}>
                {growthRate >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(growthRate)}%
              </span>
            )}
          </div>
        }
        value={value}
        precision={precision}
        valueStyle={{ color }}
        prefix={React.cloneElement(icon, { style: { color } })}
        suffix={suffix}
        formatter={(value) => formatNumber(value)}
      />
    </Card>
  );

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card 
        title="积分管理看板" 
        style={{ marginBottom: '24px' }}
        extra={
          <Space>
            <Select 
              value={period} 
              onChange={handlePeriodChange}
              style={{ width: 120 }}
            >
              <Option value="today">今日</Option>
              <Option value="week">本周</Option>
              <Option value="month">本月</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder={['开始日期', '结束日期']}
            />
          </Space>
        }
      >
        <div style={{ color: '#666', marginBottom: '16px' }}>
          以数据卡片形式，直观展示积分系统的核心运营指标
        </div>
      </Card>

      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <StatisticCard
              title="总积分池"
              value={dashboardData.totalPointsPool}
              icon={<TrophyOutlined />}
              color="#faad14"
              growthRate={dashboardData.poolGrowthRate}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={6}>
            <StatisticCard
              title={`${period === 'today' ? '今日' : period === 'week' ? '本周' : '本月'}发放量`}
              value={dashboardData.issuedAmount}
              icon={<SendOutlined />}
              color="#52c41a"
              growthRate={dashboardData.issuedGrowthRate}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={6}>
            <StatisticCard
              title={`${period === 'today' ? '今日' : period === 'week' ? '本周' : '本月'}消耗量`}
              value={dashboardData.consumedAmount}
                             icon={<ShoppingOutlined />}
              color="#1890ff"
              growthRate={dashboardData.consumedGrowthRate}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={6}>
            <StatisticCard
              title="积分核销率"
              value={dashboardData.utilizationRate}
              precision={2}
              suffix="%"
              icon={<PercentageOutlined />}
              color="#eb2f96"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={6}>
            <StatisticCard
              title="活跃会员数"
              value={dashboardData.activeMemberCount}
              icon={<TeamOutlined />}
              color="#722ed1"
              growthRate={dashboardData.memberGrowthRate}
            />
          </Col>
        </Row>

        {/* 核销率说明 */}
        <Card 
          title="指标说明" 
          style={{ marginTop: '24px' }}
          size="small"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <strong>总积分池：</strong>当前系统中所有用户未消耗的积分总量
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>周期内发放量：</strong>选定时间周期内发放的积分总量
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>周期内消耗量：</strong>选定时间周期内消耗（被兑换）的积分总量
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>积分核销率：</strong>（消耗量 / 发放量）× 100%，衡量积分活跃度的关键指标
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>活跃会员数：</strong>周期内有过积分变动（获取或使用）的独立用户数
              </div>
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  );
};

export default PointsDashboard; 