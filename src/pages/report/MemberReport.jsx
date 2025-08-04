import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Breadcrumb, 
  Statistic, 
  Table, 
  DatePicker, 
  Button, 
  Select, 
  Tabs,
  Tag,
  Divider,
  Input,
  Avatar,
  Badge,
  TreeSelect
} from 'antd';
import { 
  DownloadOutlined, 
  PrinterOutlined, 
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const MemberReport = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [memberLevel, setMemberLevel] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('company-0');
  
  // 模拟组织结构数据
  const orgData = {
    key: 'company-0',
    title: '总公司',
    value: 'company-0',
    children: Array.from({ length: 7 }, (_, i) => ({
      key: `branch-${i}`,
      title: `分公司 ${i + 1}`,
      value: `branch-${i}`,
      children: Array.from({ length: 10 }, (_, j) => ({
        key: `station-${i}-${j}`,
        title: `加油站 ${i + 1}-${j + 1}`,
        value: `station-${i}-${j}`,
      }))
    }))
  };
  
  // 模拟会员数据
  const memberData = [
    {
      key: '1',
      id: 'M10001',
      name: '张三',
      phone: '13800138001',
      level: 'vip',
      points: 5800,
      totalConsumption: 58000,
      lastConsumptionDate: '2025-03-12',
      lastConsumptionAmount: 350,
      registrationDate: '2024-01-15',
      consumptionCount: 35,
      avgConsumption: 1657.14,
    },
    {
      key: '2',
      id: 'M10002',
      name: '李四',
      phone: '13800138002',
      level: 'gold',
      points: 3200,
      totalConsumption: 32000,
      lastConsumptionDate: '2025-03-10',
      lastConsumptionAmount: 280,
      registrationDate: '2024-02-20',
      consumptionCount: 25,
      avgConsumption: 1280.00,
    },
    {
      key: '3',
      id: 'M10003',
      name: '王五',
      phone: '13800138003',
      level: 'silver',
      points: 1500,
      totalConsumption: 15000,
      lastConsumptionDate: '2025-03-08',
      lastConsumptionAmount: 150,
      registrationDate: '2024-03-05',
      consumptionCount: 18,
      avgConsumption: 833.33,
    },
    {
      key: '4',
      id: 'M10004',
      name: '赵六',
      phone: '13800138004',
      level: 'regular',
      points: 800,
      totalConsumption: 8000,
      lastConsumptionDate: '2025-03-05',
      lastConsumptionAmount: 120,
      registrationDate: '2024-03-15',
      consumptionCount: 10,
      avgConsumption: 800.00,
    },
    {
      key: '5',
      id: 'M10005',
      name: '钱七',
      phone: '13800138005',
      level: 'vip',
      points: 6500,
      totalConsumption: 65000,
      lastConsumptionDate: '2025-03-13',
      lastConsumptionAmount: 420,
      registrationDate: '2023-12-10',
      consumptionCount: 42,
      avgConsumption: 1547.62,
    },
    {
      key: '6',
      id: 'M10006',
      name: '孙八',
      phone: '13800138006',
      level: 'gold',
      points: 2800,
      totalConsumption: 28000,
      lastConsumptionDate: '2025-03-11',
      lastConsumptionAmount: 250,
      registrationDate: '2024-01-25',
      consumptionCount: 22,
      avgConsumption: 1272.73,
    },
    {
      key: '7',
      id: 'M10007',
      name: '周九',
      phone: '13800138007',
      level: 'silver',
      points: 1800,
      totalConsumption: 18000,
      lastConsumptionDate: '2025-03-09',
      lastConsumptionAmount: 180,
      registrationDate: '2024-02-15',
      consumptionCount: 20,
      avgConsumption: 900.00,
    },
  ];

  // 模拟会员消费记录数据
  const memberConsumptionData = [
    {
      key: '1',
      date: '2025-03-13',
      memberId: 'M10005',
      memberName: '钱七',
      type: '油品',
      amount: 420,
      points: 42,
      paymentMethod: '微信支付',
      remark: '92#汽油加油',
    },
    {
      key: '2',
      date: '2025-03-12',
      memberId: 'M10001',
      memberName: '张三',
      type: '油品',
      amount: 350,
      points: 35,
      paymentMethod: '支付宝',
      remark: '95#汽油加油',
    },
    {
      key: '3',
      date: '2025-03-11',
      memberId: 'M10006',
      memberName: '孙八',
      type: '油品',
      amount: 250,
      points: 25,
      paymentMethod: '银行卡',
      remark: '92#汽油加油',
    },
    {
      key: '4',
      date: '2025-03-10',
      memberId: 'M10002',
      memberName: '李四',
      type: '商品',
      amount: 280,
      points: 28,
      paymentMethod: '现金',
      remark: '便利店购物',
    },
    {
      key: '5',
      date: '2025-03-09',
      memberId: 'M10007',
      memberName: '周九',
      type: '服务',
      amount: 180,
      points: 18,
      paymentMethod: '微信支付',
      remark: '洗车服务',
    },
    {
      key: '6',
      date: '2025-03-08',
      memberId: 'M10003',
      memberName: '王五',
      type: '油品',
      amount: 150,
      points: 15,
      paymentMethod: '支付宝',
      remark: '0#柴油加油',
    },
    {
      key: '7',
      date: '2025-03-05',
      memberId: 'M10004',
      memberName: '赵六',
      type: '商品',
      amount: 120,
      points: 12,
      paymentMethod: '微信支付',
      remark: '便利店购物',
    },
  ];

  // 会员数据表格列配置
  const memberColumns = [
    {
      title: '会员ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '会员姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '会员等级',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        let color = '';
        let text = '';
        
        switch (level) {
          case 'vip':
            color = 'purple';
            text = 'VIP会员';
            break;
          case 'gold':
            color = 'gold';
            text = '金卡会员';
            break;
          case 'silver':
            color = 'silver';
            text = '银卡会员';
            break;
          default:
            color = 'blue';
            text = '普通会员';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'VIP会员', value: 'vip' },
        { text: '金卡会员', value: 'gold' },
        { text: '银卡会员', value: 'silver' },
        { text: '普通会员', value: 'regular' },
      ],
      onFilter: (value, record) => record.level === value,
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: '累计消费(元)',
      dataIndex: 'totalConsumption',
      key: 'totalConsumption',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalConsumption - b.totalConsumption,
    },
    {
      title: '消费次数',
      dataIndex: 'consumptionCount',
      key: 'consumptionCount',
      sorter: (a, b) => a.consumptionCount - b.consumptionCount,
    },
    {
      title: '客单价(元)',
      dataIndex: 'avgConsumption',
      key: 'avgConsumption',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.avgConsumption - b.avgConsumption,
    },
    {
      title: '最近消费日期',
      dataIndex: 'lastConsumptionDate',
      key: 'lastConsumptionDate',
      sorter: (a, b) => new Date(a.lastConsumptionDate) - new Date(b.lastConsumptionDate),
    },
    {
      title: '注册日期',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      sorter: (a, b) => new Date(a.registrationDate) - new Date(b.registrationDate),
    },
  ];

  // 会员消费记录表格列配置
  const consumptionColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: '会员ID',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: '会员姓名',
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: '消费类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '油品', value: '油品' },
        { text: '商品', value: '商品' },
        { text: '服务', value: '服务' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        let color = '';
        
        switch (type) {
          case '油品':
            color = 'green';
            break;
          case '商品':
            color = 'blue';
            break;
          case '服务':
            color = 'purple';
            break;
          default:
            color = 'default';
        }
        
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '消费金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '获得积分',
      dataIndex: 'points',
      key: 'points',
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: [
        { text: '微信支付', value: '微信支付' },
        { text: '支付宝', value: '支付宝' },
        { text: '银行卡', value: '银行卡' },
        { text: '现金', value: '现金' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // 会员等级分布图配置
  const getMemberLevelOption = () => {
    // 统计各等级会员数量
    const levelCounts = {
      vip: memberData.filter(item => item.level === 'vip').length,
      gold: memberData.filter(item => item.level === 'gold').length,
      silver: memberData.filter(item => item.level === 'silver').length,
      regular: memberData.filter(item => item.level === 'regular').length,
    };
    
    return {
      title: {
        text: '会员等级分布'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['VIP会员', '金卡会员', '银卡会员', '普通会员']
      },
      series: [
        {
          name: '会员等级',
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
            { value: levelCounts.vip, name: 'VIP会员', itemStyle: { color: '#722ed1' } },
            { value: levelCounts.gold, name: '金卡会员', itemStyle: { color: '#faad14' } },
            { value: levelCounts.silver, name: '银卡会员', itemStyle: { color: '#bfbfbf' } },
            { value: levelCounts.regular, name: '普通会员', itemStyle: { color: '#1890ff' } },
          ]
        }
      ]
    };
  };

  // 会员消费趋势图配置
  const getMemberConsumptionOption = () => {
    // 这里应该根据会员消费记录数据计算每日消费趋势
    // 为简化，使用模拟数据
    return {
      title: {
        text: '会员消费趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['消费金额', '消费人次', '客单价']
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
        data: ['3月7日', '3月8日', '3月9日', '3月10日', '3月11日', '3月12日', '3月13日']
      },
      yAxis: [
        {
          type: 'value',
          name: '金额(元)',
          position: 'left',
        },
        {
          type: 'value',
          name: '人次',
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#1890ff'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: '消费金额',
          type: 'line',
          smooth: true,
          data: [1200, 1500, 1800, 2000, 1900, 2200, 2500],
          yAxisIndex: 0,
        },
        {
          name: '消费人次',
          type: 'bar',
          data: [12, 15, 18, 20, 19, 22, 25],
          yAxisIndex: 1,
        },
        {
          name: '客单价',
          type: 'line',
          smooth: true,
          data: [100, 100, 100, 100, 100, 100, 100],
          yAxisIndex: 0,
        }
      ]
    };
  };

  // 会员积分分布图配置
  const getMemberPointsOption = () => {
    // 统计各积分区间会员数量
    const pointsRanges = [
      { range: '0-1000', count: memberData.filter(item => item.points < 1000).length },
      { range: '1000-3000', count: memberData.filter(item => item.points >= 1000 && item.points < 3000).length },
      { range: '3000-5000', count: memberData.filter(item => item.points >= 3000 && item.points < 5000).length },
      { range: '5000以上', count: memberData.filter(item => item.points >= 5000).length },
    ];
    
    return {
      title: {
        text: '会员积分分布'
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
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: pointsRanges.map(item => item.range)
      },
      yAxis: {
        type: 'value',
        name: '会员数量'
      },
      series: [
        {
          name: '会员数量',
          type: 'bar',
          data: pointsRanges.map(item => item.count),
          itemStyle: {
            color: function(params) {
              const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1'];
              return colors[params.dataIndex];
            }
          },
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    };
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // 处理会员等级变化
  const handleMemberLevelChange = (value) => {
    setMemberLevel(value);
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // 处理组织选择变化
  const handleOrgChange = (value) => {
    setSelectedOrg(value);
  };

  // 获取组织名称
  const getOrgName = (value) => {
    if (value === 'company-0') return '总公司';
    
    if (value.startsWith('branch-')) {
      const branchIndex = parseInt(value.split('-')[1]);
      return `分公司 ${branchIndex + 1}`;
    }
    
    if (value.startsWith('station-')) {
      const [_, branchIndex, stationIndex] = value.split('-');
      return `加油站 ${parseInt(branchIndex) + 1}-${parseInt(stationIndex) + 1}`;
    }
    
    return '';
  };

  return (
    <div>
      <div className="page-header">
        <h2>会员报表 - {getOrgName(selectedOrg)}</h2>
      </div>

      {/* 统计数据卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="会员总数"
              value={memberData.length}
              valueStyle={{ color: '#1890ff' }}
              suffix="人"
            />
            <div style={{ marginTop: 8 }}>
              <Badge status="processing" text="活跃会员" /> {memberData.filter(item => new Date(item.lastConsumptionDate) >= new Date(dayjs().subtract(30, 'day'))).length}人
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="会员消费总额"
              value={memberData.reduce((sum, item) => sum + item.totalConsumption, 0)}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix="元"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 12.5%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上月</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="会员客单价"
              value={memberData.reduce((sum, item) => sum + item.totalConsumption, 0) / memberData.reduce((sum, item) => sum + item.consumptionCount, 0)}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix="¥"
              suffix="元"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 5.2%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上月</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="会员积分总额"
              value={memberData.reduce((sum, item) => sum + item.points, 0)}
              valueStyle={{ color: '#faad14' }}
              suffix="分"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 8.7%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上月</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 报表筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <span style={{ marginRight: 8 }}>组织层级:</span>
            <TreeSelect
              style={{ width: 200 }}
              value={selectedOrg}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={[orgData]}
              placeholder="请选择组织"
              treeDefaultExpandAll
              onChange={handleOrgChange}
            />
          </Col>
          <Col span={8}>
            <span style={{ marginRight: 8 }}>日期范围:</span>
            <RangePicker 
              value={dateRange} 
              onChange={handleDateRangeChange} 
              style={{ width: 230 }}
            />
          </Col>
          <Col span={8}>
            <span style={{ marginRight: 8 }}>会员等级:</span>
            <Select 
              value={memberLevel} 
              onChange={handleMemberLevelChange}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="vip">VIP会员</Option>
              <Option value="gold">金卡会员</Option>
              <Option value="silver">银卡会员</Option>
              <Option value="regular">普通会员</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={16}>
            <Search
              placeholder="搜索会员姓名或手机号"
              onSearch={handleSearch}
              style={{ width: 250 }}
              enterButton
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              style={{ marginRight: 8 }}
            >
              刷新数据
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              style={{ marginRight: 8 }}
            >
              导出报表
            </Button>
            <Button 
              icon={<PrinterOutlined />}
            >
              打印报表
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 图表展示 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="会员等级分布">
            <ReactECharts option={getMemberLevelOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="会员积分分布">
            <ReactECharts option={getMemberPointsOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="会员消费趋势">
            <ReactECharts option={getMemberConsumptionOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="会员列表" key="1">
          <Card>
            <Table 
              columns={memberColumns} 
              dataSource={memberData} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="消费记录" key="2">
          <Card>
            <Table 
              columns={consumptionColumns} 
              dataSource={memberConsumptionData} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Divider />
      
      <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
        <p>数据统计时间: {dateRange[0]?.format('YYYY-MM-DD')} 至 {dateRange[1]?.format('YYYY-MM-DD')}</p>
        <p>报表生成时间: {dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>
    </div>
  );
};

export default MemberReport; 