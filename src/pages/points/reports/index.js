import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  DatePicker, 
  Select, 
  Button,
  Table,
  Space,
  Tabs,
  Statistic,
  Tag,
  Tooltip,
  Form,
  Input,
  message
} from 'antd';
import ReactECharts from 'echarts-for-react';
import { DownloadOutlined, ReloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const PointsReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('trend');
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis');
  
  // 积分进销存查询条件
  const [inventoryQuery, setInventoryQuery] = useState({
    timeGranularity: 'day',
    dateRange: null
  });
  
  // 积分负债与核销流水查询条件
  const [debtFlowQuery, setDebtFlowQuery] = useState({
    flowType: 'all', // all: 全部, issue: 积分发放, redemption: 积分核销
    dateRange: null,
    orderId: '',
    userId: ''
  });

  // 模拟趋势数据
  const trendData = [
    { date: '01-01', issued: 12000, consumed: 8500, balance: 280000 },
    { date: '01-02', issued: 15000, consumed: 12000, balance: 283000 },
    { date: '01-03', issued: 13000, consumed: 9800, balance: 286200 },
    { date: '01-04', issued: 18000, consumed: 15200, balance: 289000 },
    { date: '01-05', issued: 16000, consumed: 13400, balance: 291600 },
    { date: '01-06', issued: 14500, consumed: 11200, balance: 294900 },
    { date: '01-07', issued: 19000, consumed: 16800, balance: 297100 },
  ];

  // 模拟分类数据
  const categoryData = [
    { name: '加油消费', value: 65, color: '#8884d8' },
    { name: '积分兑换', value: 20, color: '#82ca9d' },
    { name: '活动奖励', value: 10, color: '#ffc658' },
    { name: '人工调整', value: 5, color: '#ff7300' },
  ];

  // 模拟排行数据
  const rankingData = [
    { station: '南昌东服务区-1号油站', issued: 45000, consumed: 38000, rate: 84.4 },
    { station: '南昌西服务区-2号油站', issued: 42000, consumed: 35000, rate: 83.3 },
    { station: '九江服务区-1号油站', issued: 38000, consumed: 30000, rate: 78.9 },
    { station: '赣州服务区-1号油站', issued: 35000, consumed: 28000, rate: 80.0 },
    { station: '上饶服务区-2号油站', issued: 32000, consumed: 25000, rate: 78.1 },
  ];

  // 生成更多的积分进销存模拟数据
  const generateInventoryData = (granularity, startDate, endDate) => {
    const data = [];
    let currentDate = moment(startDate || '2024-01-01');
    const end = moment(endDate || '2024-01-31');
    let openingBalance = 280000;

    while (currentDate.isSameOrBefore(end)) {
      const issued = Math.floor(Math.random() * 10000) + 10000; // 10000-20000
      const consumed = Math.floor(Math.random() * 8000) + 8000; // 8000-16000
      const expired = Math.floor(Math.random() * 500) + 100; // 100-600
      const closing = openingBalance + issued - consumed - expired;
      const redemptionRate = ((consumed / issued) * 100).toFixed(1);

      data.push({
        date: currentDate.format(granularity === 'day' ? 'YYYY-MM-DD' : 
              granularity === 'week' ? 'YYYY-[W]WW' :
              granularity === 'month' ? 'YYYY-MM' :
              granularity === 'quarter' ? 'YYYY-[Q]Q' : 'YYYY'),
        opening: openingBalance,
        issued,
        consumed,
        expired,
        closing,
        redemptionRate: parseFloat(redemptionRate)
      });

      openingBalance = closing;
      
      // 根据时间粒度增加日期
      if (granularity === 'day') {
        currentDate.add(1, 'day');
      } else if (granularity === 'week') {
        currentDate.add(1, 'week');
      } else if (granularity === 'month') {
        currentDate.add(1, 'month');
      } else if (granularity === 'quarter') {
        currentDate.add(3, 'months');
      } else {
        currentDate.add(1, 'year');
      }
    }

    return data;
  };

  // 生成积分流水模拟数据（包含发放和核销）
  const generatePointsFlowData = (flowType, startDate, endDate, orderId, userId) => {
    const data = [];
    
    // 积分发放类型
    const issueTypes = [
      '会员注册奖励', '加油消费奖励', '便利店消费奖励', '邀请好友奖励', 
      '签到奖励', '活动奖励', '生日奖励', '人工发放'
    ];
    
    // 积分核销类型
    const redemptionTypes = ['订单抵扣', '商品兑换'];
    
    const paymentMethods = [
      '微信支付', '支付宝', '银联卡', '预付卡', '现金',
      '微信支付+预付卡', '支付宝+预付卡', '银联卡+预付卡'
    ];

    // 生成积分发放数据
    if (flowType === 'all' || flowType === 'issue') {
      for (let i = 1; i <= 30; i++) {
        const randomType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
        const randomDate = moment('2024-01-01').add(Math.floor(Math.random() * 30), 'days');
        const randomUserId = `U${String(Math.floor(Math.random() * 999999) + 100000)}`;
        const randomOrderId = randomType.includes('消费') ? 
          `O${randomDate.format('YYYYMMDD')}${String(i).padStart(4, '0')}` : '';
        
        // 如果有查询条件，进行过滤
        if (startDate && endDate) {
          if (!randomDate.isBetween(moment(startDate), moment(endDate), 'day', '[]')) {
            continue;
          }
        }
        
        if (orderId && randomOrderId && !randomOrderId.includes(orderId)) {
          continue;
        }
        
        if (userId && !randomUserId.includes(userId)) {
          continue;
        }

        const pointsIssued = Math.floor(Math.random() * 1000) + 50; // 50-1050积分
        const issueAmount = pointsIssued / 10; // 10积分=1元，计算负债金额
        
        // 根据发放类型确定关联订单和消费金额
        let originalAmount = 0;
        let relatedInfo = '';
        
        if (randomType.includes('消费')) {
          originalAmount = Math.floor(Math.random() * 500) + 100; // 消费金额
          relatedInfo = `消费${originalAmount}元`;
        } else if (randomType === '会员注册奖励') {
          relatedInfo = '新用户注册';
        } else if (randomType === '邀请好友奖励') {
          relatedInfo = '成功邀请1位好友';
        } else if (randomType === '签到奖励') {
          relatedInfo = '每日签到';
        } else if (randomType === '生日奖励') {
          relatedInfo = '生日当月奖励';
        } else {
          relatedInfo = '系统发放';
        }

        data.push({
          id: `I${randomDate.format('YYYYMMDD')}${String(i).padStart(4, '0')}`,
          time: randomDate.format('YYYY-MM-DD HH:mm:ss'),
          userId: randomUserId,
          orderId: randomOrderId || '-',
          flowType: '积分发放',
          type: randomType,
          pointsChange: pointsIssued,
          changeAmount: issueAmount,
          originalAmount: originalAmount,
          finalAmount: originalAmount,
          relatedInfo: relatedInfo,
          operator: '系统自动'
        });
      }
    }

    // 生成积分核销数据
    if (flowType === 'all' || flowType === 'redemption') {
      for (let i = 1; i <= 30; i++) {
        const randomType = redemptionTypes[Math.floor(Math.random() * redemptionTypes.length)];
        const randomDate = moment('2024-01-01').add(Math.floor(Math.random() * 30), 'days');
        const randomUserId = `U${String(Math.floor(Math.random() * 999999) + 100000)}`;
        const randomOrderId = `O${randomDate.format('YYYYMMDD')}${String(i).padStart(4, '0')}`;
        
        // 如果有查询条件，进行过滤
        if (startDate && endDate) {
          if (!randomDate.isBetween(moment(startDate), moment(endDate), 'day', '[]')) {
            continue;
          }
        }
        
        if (orderId && !randomOrderId.includes(orderId)) {
          continue;
        }
        
        if (userId && !randomUserId.includes(userId)) {
          continue;
        }

        const pointsUsed = Math.floor(Math.random() * 1500) + 100;
        const discountAmount = pointsUsed / 10; // 10积分=1元
        const originalAmount = Math.floor(Math.random() * 300) + 50;
        const finalAmount = Math.max(0, originalAmount - discountAmount);
        const paymentMethod = finalAmount > 0 ? 
          `${paymentMethods[Math.floor(Math.random() * paymentMethods.length)]}${finalAmount.toFixed(2)}元` :
          '积分全额兑换';

        data.push({
          id: `R${randomDate.format('YYYYMMDD')}${String(i).padStart(4, '0')}`,
          time: randomDate.format('YYYY-MM-DD HH:mm:ss'),
          userId: randomUserId,
          orderId: randomOrderId,
          flowType: '积分核销',
          type: randomType,
          pointsChange: -pointsUsed, // 负数表示消耗
          changeAmount: discountAmount,
          originalAmount: originalAmount,
          finalAmount: finalAmount,
          relatedInfo: paymentMethod,
          operator: '用户操作'
        });
      }
    }

    // 按时间倒序排列
    return data.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf()).slice(0, 25);
  };

  // 当前显示的数据
  const [currentInventoryData, setCurrentInventoryData] = useState(
    generateInventoryData('day', '2024-01-01', '2024-01-10')
  );
  
  const [currentRedemptionData, setCurrentRedemptionData] = useState(
    generatePointsFlowData('all', '2024-01-01', '2024-01-10', '', '')
  );

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '油站名称',
      dataIndex: 'station',
      width: 200,
    },
    {
      title: '发放积分',
      dataIndex: 'issued',
      width: 100,
      render: (value) => value.toLocaleString(),
    },
    {
      title: '消耗积分',
      dataIndex: 'consumed',
      width: 100,
      render: (value) => value.toLocaleString(),
    },
    {
      title: '核销率',
      dataIndex: 'rate',
      width: 100,
      render: (value) => `${value}%`,
    },
  ];

  // 积分进销存表格列配置
  const inventoryColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '期初结余积分',
      dataIndex: 'opening',
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    {
      title: '本期发放积分',
      dataIndex: 'issued',
      width: 120,
      render: (value) => <span style={{ color: '#52c41a' }}>+{value.toLocaleString()}</span>,
    },
    {
      title: '本期消耗积分',
      dataIndex: 'consumed',
      width: 120,
      render: (value) => <span style={{ color: '#ff4d4f' }}>-{value.toLocaleString()}</span>,
    },
    {
      title: '本期过期积分',
      dataIndex: 'expired',
      width: 120,
      render: (value) => <span style={{ color: '#faad14' }}>-{value.toLocaleString()}</span>,
    },
    {
      title: '期末结余积分',
      dataIndex: 'closing',
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    {
      title: '核销率',
      dataIndex: 'redemptionRate',
      width: 100,
      render: (value) => (
        <Tag color={value >= 80 ? 'green' : value >= 60 ? 'orange' : 'red'}>
          {value}%
        </Tag>
      ),
    },
  ];

  // 积分流水表格列配置
  const flowColumns = [
    {
      title: '流水ID',
      dataIndex: 'id',
      width: 140,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      width: 160,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 100,
    },
    {
      title: '流水类型',
      dataIndex: 'flowType',
      width: 100,
      render: (text) => (
        <Tag color={text === '积分发放' ? 'green' : 'red'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '业务类型',
      dataIndex: 'type',
      width: 120,
      render: (text) => (
        <Tag color={
          text.includes('注册') ? 'blue' :
          text.includes('消费') ? 'orange' :
          text.includes('抵扣') ? 'purple' :
          text.includes('兑换') ? 'cyan' : 'default'
        }>
          {text}
        </Tag>
      ),
    },
    {
      title: '积分变动',
      dataIndex: 'pointsChange',
      width: 100,
      render: (value) => (
        <span style={{ 
          color: value > 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {value > 0 ? '+' : ''}{value.toLocaleString()}
        </span>
      ),
    },
    {
      title: '金额变动(元)',
      dataIndex: 'changeAmount',
      width: 120,
      render: (value) => `¥${value.toFixed(2)}`,
    },
    {
      title: '关联订单号',
      dataIndex: 'orderId',
      width: 140,
      render: (text) => (
        text && text !== '-' ? (
          <Tooltip title="点击查看订单详情">
            <Button type="link" size="small" icon={<EyeOutlined />}>
              {text}
            </Button>
          </Tooltip>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      ),
    },
    {
      title: '相关信息',
      dataIndex: 'relatedInfo',
      width: 180,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100,
    },
  ];

  // 积分进销存查询
  const handleInventoryQuery = () => {
    setLoading(true);
    
    const { timeGranularity, dateRange } = inventoryQuery;
    const startDate = dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '2024-01-01';
    const endDate = dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '2024-01-31';
    
    // 模拟异步查询
    setTimeout(() => {
      const newData = generateInventoryData(timeGranularity, startDate, endDate);
      setCurrentInventoryData(newData);
      setLoading(false);
      message.success(`查询成功，共找到 ${newData.length} 条记录`);
    }, 1000);
  };

  // 积分负债与核销流水查询
  const handleDebtFlowQuery = () => {
    setLoading(true);
    
    const { flowType, dateRange, orderId, userId } = debtFlowQuery;
    const startDate = dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null;
    const endDate = dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null;
    
    // 模拟异步查询
    setTimeout(() => {
      const newData = generatePointsFlowData(flowType, startDate, endDate, orderId, userId);
      setCurrentRedemptionData(newData);
      setLoading(false);
      message.success(`查询成功，共找到 ${newData.length} 条记录`);
    }, 1000);
  };

  // 计算KPI数据
  const calculateInventoryKPI = (data) => {
    if (!data || data.length === 0) {
      return {
        opening: 0,
        totalIssued: 0,
        totalConsumed: 0,
        totalExpired: 0,
        closing: 0,
        avgRedemptionRate: 0
      };
    }

    const totalIssued = data.reduce((sum, item) => sum + item.issued, 0);
    const totalConsumed = data.reduce((sum, item) => sum + item.consumed, 0);
    const totalExpired = data.reduce((sum, item) => sum + item.expired, 0);
    const avgRedemptionRate = data.reduce((sum, item) => sum + item.redemptionRate, 0) / data.length;

    return {
      opening: data[0]?.opening || 0,
      totalIssued,
      totalConsumed,
      totalExpired,
      closing: data[data.length - 1]?.closing || 0,
      avgRedemptionRate: avgRedemptionRate.toFixed(1)
    };
  };

  const calculateDebtKPI = (data) => {
    if (!data || data.length === 0) {
      return {
        openingDebt: 28000,
        newDebt: 0,
        redemptionDebt: 0,
        expiredDebt: 170,
        closingDebt: 28000
      };
    }

    // 计算积分发放产生的新增负债
    const issueData = data.filter(item => item.flowType === '积分发放');
    const newDebt = issueData.reduce((sum, item) => sum + item.changeAmount, 0);
    
    // 计算积分核销减少的负债
    const redemptionData = data.filter(item => item.flowType === '积分核销');
    const redemptionDebt = redemptionData.reduce((sum, item) => sum + item.changeAmount, 0);
    
    const openingDebt = 28000; // 期初负债
    const expiredDebt = 170; // 过期解除负债
    const closingDebt = openingDebt + newDebt - redemptionDebt - expiredDebt;
    
    return {
      openingDebt,
      newDebt,
      redemptionDebt,
      expiredDebt,
      closingDebt: Math.max(0, closingDebt) // 确保不为负数
    };
  };

  // 趋势图表配置
  const getTrendOption = () => ({
    title: {
      text: '积分趋势分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['发放积分', '消耗积分'],
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
      data: trendData.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '发放积分',
        type: 'line',
        data: trendData.map(item => item.issued),
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '消耗积分',
        type: 'line',
        data: trendData.map(item => item.consumed),
        itemStyle: { color: '#1890ff' }
      }
    ]
  });

  // 消耗分布饼图配置
  const getConsumptionDistributionOption = () => ({
    title: {
      text: '积分消耗分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '消耗分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 50, name: '油品抵扣', itemStyle: { color: '#1890ff' } },
          { value: 30, name: '商品兑换', itemStyle: { color: '#52c41a' } },
          { value: 20, name: '便利店消费抵扣', itemStyle: { color: '#faad14' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });

  // 饼图配置
  const getPieOption = () => ({
    title: {
      text: '积分获得渠道分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '积分来源',
        type: 'pie',
        radius: '50%',
        data: categoryData.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
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
  });

  // 柱状图配置
  const getBarOption = () => ({
    title: {
      text: '积分使用情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: categoryData.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: categoryData.map(item => ({
          value: item.value,
          itemStyle: { color: item.color }
        })),
        type: 'bar'
      }
    ]
  });

  const handleExport = () => {
    // 导出逻辑
    console.log('导出报表');
  };

  const renderTrendReport = () => (
    <Card title="积分趋势分析">
      <ReactECharts 
        option={getTrendOption()} 
        style={{ width: '100%', height: '400px' }}
      />
    </Card>
  );

  const renderCategoryReport = () => (
    <Row gutter={[24, 24]}>
      <Col span={12}>
        <Card title="积分获得渠道分布">
          <ReactECharts 
            option={getPieOption()} 
            style={{ width: '100%', height: '300px' }}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="积分使用情况">
          <ReactECharts 
            option={getBarOption()} 
            style={{ width: '100%', height: '300px' }}
          />
        </Card>
      </Col>
    </Row>
  );

  const renderRankingReport = () => (
    <Card title="油站积分排行榜">
      <Table
        columns={columns}
        dataSource={rankingData}
        pagination={false}
        size="middle"
      />
    </Card>
  );

  // 渲染积分进销存分析报表
  const renderInventoryReport = () => {
    const kpiData = calculateInventoryKPI(currentInventoryData);
    
    return (
      <div>
        {/* KPI卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="期初结余积分"
                value={kpiData.opening}
                valueStyle={{ color: '#1890ff' }}
                suffix="积分"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="本期发放积分"
                value={kpiData.totalIssued}
                valueStyle={{ color: '#52c41a' }}
                suffix="积分"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="本期消耗积分"
                value={kpiData.totalConsumed}
                valueStyle={{ color: '#ff4d4f' }}
                suffix="积分"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="本期过期积分"
                value={kpiData.totalExpired}
                valueStyle={{ color: '#faad14' }}
                suffix="积分"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="期末结余积分"
                value={kpiData.closing}
                valueStyle={{ color: '#1890ff' }}
                suffix="积分"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="平均核销率"
                value={kpiData.avgRedemptionRate}
                valueStyle={{ color: '#722ed1' }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* 明细表格 */}
        <Card title="积分进销存明细" style={{ marginBottom: 16 }}>
          <Table
            columns={inventoryColumns}
            dataSource={currentInventoryData}
            pagination={{
              total: currentInventoryData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            }}
            size="small"
            scroll={{ x: 800 }}
            loading={loading}
          />
        </Card>

        {/* 消耗分布图 */}
        <Card title="积分消耗分布分析">
          <ReactECharts 
            option={getConsumptionDistributionOption()} 
            style={{ width: '100%', height: '400px' }}
          />
        </Card>
      </div>
    );
  };

  // 渲染积分负债与核销流水报表
  const renderDebtFlowReport = () => {
    const kpiData = calculateDebtKPI(currentRedemptionData);
    
    return (
      <div>
        {/* 财务KPI卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={5}>
            <Card size="small">
              <Statistic
                title="期初负债金额"
                value={kpiData.openingDebt}
                valueStyle={{ color: '#1890ff' }}
                prefix="¥"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card size="small">
              <Statistic
                title="本期新增负债"
                value={kpiData.newDebt}
                valueStyle={{ color: '#52c41a' }}
                prefix="¥"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card size="small">
              <Statistic
                title="本期核销负债"
                value={kpiData.redemptionDebt}
                valueStyle={{ color: '#ff4d4f' }}
                prefix="¥"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="本期过期解除负债"
                value={kpiData.expiredDebt}
                valueStyle={{ color: '#faad14' }}
                prefix="¥"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card size="small">
              <Statistic
                title="期末负债金额"
                value={kpiData.closingDebt}
                valueStyle={{ color: '#722ed1' }}
                prefix="¥"
                precision={2}
              />
            </Card>
          </Col>
        </Row>

        {/* 积分流水明细表 */}
        <Card title="积分流水明细" extra={
          <Space>
            <Button 
              type="primary" 
              size="small" 
              icon={<DownloadOutlined />}
              style={{ borderRadius: '2px' }}
            >
              导出Excel
            </Button>
          </Space>
        }>
          <Table
            columns={flowColumns}
            dataSource={currentRedemptionData}
            pagination={{
              total: 1000,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            }}
            size="small"
            scroll={{ x: 1600 }}
            loading={loading}
          />
          <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
            注：此表包含积分发放和核销的完整流水记录，支持按流水类型、订单号、用户ID等条件精确查询
          </div>
        </Card>
      </div>
    );
  };

  const renderReport = () => {
    switch (reportType) {
      case 'trend':
        return renderTrendReport();
      case 'category':
        return renderCategoryReport();
      case 'ranking':
        return renderRankingReport();
      default:
        return renderTrendReport();
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="数据分析" key="analysis">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Select
                  value={reportType}
                  onChange={setReportType}
                  style={{ width: '100%' }}
                  placeholder="选择报表类型"
                >
                  <Option value="trend">趋势分析</Option>
                  <Option value="category">分类统计</Option>
                  <Option value="ranking">排行榜</Option>
                </Select>
              </Col>
              <Col span={8}>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              </Col>
              <Col span={10}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<ReloadOutlined />}
                    loading={loading}
                    onClick={() => setLoading(true)}
                    style={{ borderRadius: '2px' }}
                  >
                    刷新数据
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    style={{ borderRadius: '2px' }}
                  >
                    导出报表
                  </Button>
                </Space>
              </Col>
            </Row>
            
            {renderReport()}
          </Card>
        </TabPane>
        
        <TabPane tab="积分进销存" key="inventory">
          <Card>
            {/* 查询表单 */}
            <Card size="small" style={{ marginBottom: 16, background: '#fff' }} title="查询条件">
              <Form layout="inline">
                <Form.Item label="时间粒度">
                  <Select
                    value={inventoryQuery.timeGranularity}
                    onChange={(value) => setInventoryQuery({...inventoryQuery, timeGranularity: value})}
                    style={{ width: 120 }}
                  >
                    <Option value="day">按日</Option>
                    <Option value="week">按周</Option>
                    <Option value="month">按月</Option>
                    <Option value="quarter">按季度</Option>
                    <Option value="year">按年</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="时间范围">
                  <RangePicker
                    value={inventoryQuery.dateRange}
                    onChange={(dates) => setInventoryQuery({...inventoryQuery, dateRange: dates})}
                    style={{ width: 240 }}
                    placeholder={['开始日期', '结束日期']}
                  />
                </Form.Item>
              </Form>
              
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    onClick={handleInventoryQuery}
                    loading={loading}
                    style={{ borderRadius: '2px' }}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setInventoryQuery({
                        timeGranularity: 'day',
                        dateRange: null
                      });
                      setCurrentInventoryData(generateInventoryData('day', '2024-01-01', '2024-01-10'));
                    }}
                    style={{ borderRadius: '2px' }}
                  >
                    重置
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    style={{ borderRadius: '2px' }}
                  >
                    导出报表
                  </Button>
                </Space>
              </div>
            </Card>
            
            {renderInventoryReport()}
          </Card>
        </TabPane>
        
        <TabPane tab="积分负债与核销流水" key="debt-flow">
          <Card>
            {/* 查询表单 */}
            <Card size="small" style={{ marginBottom: 16, background: '#fff' }} title="查询条件">
              <Form layout="inline">
                <Form.Item label="流水类型">
                  <Select
                    value={debtFlowQuery.flowType}
                    onChange={(value) => setDebtFlowQuery({...debtFlowQuery, flowType: value})}
                    style={{ width: 120 }}
                  >
                    <Option value="all">全部流水</Option>
                    <Option value="issue">积分发放</Option>
                    <Option value="redemption">积分核销</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="时间范围">
                  <RangePicker
                    value={debtFlowQuery.dateRange}
                    onChange={(dates) => setDebtFlowQuery({...debtFlowQuery, dateRange: dates})}
                    style={{ width: 240 }}
                    placeholder={['开始日期', '结束日期']}
                  />
                </Form.Item>
                <Form.Item label="订单号">
                  <Input
                    value={debtFlowQuery.orderId}
                    onChange={(e) => setDebtFlowQuery({...debtFlowQuery, orderId: e.target.value})}
                    placeholder="请输入订单号"
                    style={{ width: 150 }}
                  />
                </Form.Item>
                <Form.Item label="用户ID">
                  <Input
                    value={debtFlowQuery.userId}
                    onChange={(e) => setDebtFlowQuery({...debtFlowQuery, userId: e.target.value})}
                    placeholder="请输入用户ID"
                    style={{ width: 150 }}
                  />
                </Form.Item>
              </Form>
              
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    onClick={handleDebtFlowQuery}
                    loading={loading}
                    style={{ borderRadius: '2px' }}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setDebtFlowQuery({
                        flowType: 'all',
                        dateRange: null,
                        orderId: '',
                        userId: ''
                      });
                      setCurrentRedemptionData(generatePointsFlowData('all', '2024-01-01', '2024-01-10', '', ''));
                    }}
                    style={{ borderRadius: '2px' }}
                  >
                    重置
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    style={{ borderRadius: '2px' }}
                  >
                    导出流水报表
                  </Button>
                </Space>
              </div>
            </Card>
            
            {renderDebtFlowReport()}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PointsReports; 