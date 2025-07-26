import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Button, Space, message } from 'antd';
import { 
  TrophyOutlined, 
  UserOutlined, 
  DollarOutlined, 
  RiseOutlined,
  SearchOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ActivityStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState({
    totalActivities: 12,
    activeActivities: 8,
    totalParticipants: 15680,
    totalCost: 56780,
    participationRate: 68.5,
    avgCostPerUser: 3.62,
  });

  const handleSearch = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setLoading(false);
      message.info('活动统计搜索功能开发中...');
    }, 1000);
  };

  const handleReset = () => {
    message.info('重置统计条件功能开发中...');
  };

  return (
    <div>
      {/* 筛选条件 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>活动类型</div>
            <Select placeholder="请选择活动类型" style={{ width: '100%' }}>
              <Option value="all">全部活动</Option>
              <Option value="redenvelope">红包活动</Option>
              <Option value="invite">邀请好友</Option>
              <Option value="lottery">抽奖活动</Option>
              <Option value="groupbuy">拼团活动</Option>
            </Select>
          </Col>
          <Col span={4}>
            <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>活动状态</div>
            <Select placeholder="请选择状态" style={{ width: '100%' }}>
              <Option value="all">全部状态</Option>
              <Option value="active">进行中</Option>
              <Option value="pending">待开始</Option>
              <Option value="ended">已结束</Option>
              <Option value="paused">已暂停</Option>
            </Select>
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>时间范围</div>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={4}>
            <div style={{ marginBottom: 8, fontSize: '14px', color: 'transparent' }}>操作</div>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
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
              title="活动总数"
              value={statisticsData.totalActivities}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#32AF50', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="进行中活动"
              value={statisticsData.activeActivities}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="总参与人数"
              value={statisticsData.totalParticipants}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <Statistic
              title="总投入成本(元)"
              value={statisticsData.totalCost}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d', fontSize: '24px' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card className="dashboard-card">
            <Statistic
              title="平均参与率"
              value={statisticsData.participationRate}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="dashboard-card">
            <Statistic
              title="人均成本(元)"
              value={statisticsData.avgCostPerUser}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: '20px' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="活动参与趋势" className="dashboard-card">
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              color: '#999',
              fontSize: '16px'
            }}>
              📊 活动参与趋势图表开发中...
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="活动类型分布" className="dashboard-card">
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              color: '#999',
              fontSize: '16px'
            }}>
              🍕 活动类型分布图表开发中...
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="活动效果对比" className="dashboard-card">
            <div style={{ 
              height: 250, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              color: '#999',
              fontSize: '16px'
            }}>
              📈 活动效果对比图表开发中...
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ActivityStatistics; 