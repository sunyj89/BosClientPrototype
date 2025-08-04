import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { 
  UserOutlined, 
  CreditCardOutlined, 
  GiftOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const MembershipManagement = () => {
  // 会员等级分布图表配置
  const memberLevelChartOption = {
    title: {
      text: '会员等级分布',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['普通会员', '银卡会员', '金卡会员', 'VIP会员']
    },
    series: [
      {
        name: '会员数量',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 580, name: '普通会员' },
          { value: 320, name: '银卡会员' },
          { value: 150, name: '金卡会员' },
          { value: 50, name: 'VIP会员' }
        ]
      }
    ]
  };

  // 会员消费统计图表配置
  const memberConsumptionChartOption = {
    title: {
      text: '近6个月会员消费统计',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['会员消费金额', '会员消费次数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['10月', '11月', '12月', '1月', '2月', '3月']
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额(元)',
        min: 0,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: '{value} 元'
        }
      },
      {
        type: 'value',
        name: '次数',
        min: 0,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#91CC75'
          }
        },
        axisLabel: {
          formatter: '{value} 次'
        }
      }
    ],
    series: [
      {
        name: '会员消费金额',
        type: 'bar',
        data: [25000, 28000, 32000, 18000, 22000, 30000],
        yAxisIndex: 0,
      },
      {
        name: '会员消费次数',
        type: 'line',
        yAxisIndex: 1,
        data: [500, 550, 600, 400, 450, 580]
      }
    ]
  };

  return (
    <div>
      <div className="page-header">
        <h2>会员管理</h2>
      </div>

      {/* 功能卡片区域 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/membership/card">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#1890ff' }}>
                <CreditCardOutlined />
              </div>
              <div className="card-content">
                <h3>会员卡管理</h3>
                <p>管理会员卡信息</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/membership/points">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#52c41a' }}>
                <GiftOutlined />
              </div>
              <div className="card-content">
                <h3>积分管理</h3>
                <p>管理会员积分信息</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/report/member">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#faad14' }}>
                <BarChartOutlined />
              </div>
              <div className="card-content">
                <h3>会员报表</h3>
                <p>查看会员相关报表</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/membership">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#eb2f96' }}>
                <UserOutlined />
              </div>
              <div className="card-content">
                <h3>会员列表</h3>
                <p>查看所有会员信息</p>
              </div>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* 统计信息区域 */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="会员总数"
              value={1100}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日新增会员"
              value={8}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="会员总积分"
              value={256800}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="本月会员消费"
              value={30000}
              precision={2}
              prefix={<CreditCardOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="会员等级分布">
            <ReactECharts option={memberLevelChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="会员消费统计">
            <ReactECharts option={memberConsumptionChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MembershipManagement; 