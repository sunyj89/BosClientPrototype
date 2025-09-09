import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Table, 
  Row, 
  Col, 
  Space, 
  Tabs,
  Radio,
  Statistic,
  Progress,
  message
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// 商品销售排行页面
const SalesRanking = () => {
  const [loading, setLoading] = useState(false);
  const [rankingData, setRankingData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [rankingType, setRankingType] = useState('amount');
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('goods');

  // 组件加载时获取数据
  useEffect(() => {
    fetchRankingData();
  }, [rankingType, timeRange, activeTab, pagination.current, pagination.pageSize]);

  // 获取排行数据
  const fetchRankingData = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setRankingData(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取销售排行数据失败:', error);
      message.error('获取销售排行数据失败');
      setLoading(false);
    }
  };

  // 生成模拟数据
  const generateMockData = () => {
    const data = [];
    const total = 50;
    const pageSize = pagination.pageSize;
    const current = pagination.current;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // 根据不同的排行类型生成不同的数据
    const goodsTypes = ['饮料', '零食', '香烟', '日用品', '汽车用品'];
    const goodsNames = [
      ['可口可乐', '百事可乐', '雪碧', '芬达', '农夫山泉', '红牛', '王老吉', '脉动', '茶π', '冰红茶'],
      ['薯片', '饼干', '巧克力', '糖果', '坚果', '辣条', '膨化食品', '面包', '蛋糕', '果冻'],
      ['中华', '万宝路', '玉溪', '黄鹤楼', '利群', '芙蓉王', '红塔山', '云烟', '七星', '南京'],
      ['洗发水', '沐浴露', '牙膏', '洗衣液', '纸巾', '洗洁精', '肥皂', '洗手液', '卫生巾', '湿巾'],
      ['机油', '玻璃水', '车载香水', '车载充电器', '车载吸尘器', '轮胎', '座套', '脚垫', '车蜡', '补漆笔']
    ];

    // 根据不同的标签页生成不同的数据
    if (activeTab === 'goods') {
      for (let i = 0; i < total; i++) {
        if (i >= startIndex && i < endIndex) {
          const typeIndex = i % 5;
          const nameIndex = i % 10;
          const quantity = Math.floor(Math.random() * 1000) + 100;
          const unitPrice = ((Math.random() * 50) + 5).toFixed(2);
          const salesAmount = (quantity * parseFloat(unitPrice)).toFixed(2);
          const orderCount = Math.floor(Math.random() * 200) + 20;
          const profit = (parseFloat(salesAmount) * (Math.random() * 0.3 + 0.1)).toFixed(2);
          const profitRate = ((parseFloat(profit) / parseFloat(salesAmount)) * 100).toFixed(2);
          
          // 根据排行类型排序
          let rank = i + 1;
          if (rankingType === 'amount') {
            rank = total - i;
          } else if (rankingType === 'quantity') {
            rank = (total - i) % 30 + 1;
          } else if (rankingType === 'profit') {
            rank = (total - i) % 20 + 1;
          }
          
          data.push({
            id: i + 1,
            rank,
            goodsType: goodsTypes[typeIndex],
            goodsName: goodsNames[typeIndex][nameIndex],
            goodsCode: `G${String(1000 + i).padStart(6, '0')}`,
            quantity,
            unitPrice,
            salesAmount,
            orderCount,
            profit,
            profitRate,
            averagePrice: (parseFloat(salesAmount) / quantity).toFixed(2)
          });
        }
      }
    } else if (activeTab === 'type') {
      for (let i = 0; i < goodsTypes.length; i++) {
        const quantity = Math.floor(Math.random() * 10000) + 1000;
        const salesAmount = ((Math.random() * 500000) + 50000).toFixed(2);
        const orderCount = Math.floor(Math.random() * 2000) + 200;
        const profit = (parseFloat(salesAmount) * (Math.random() * 0.3 + 0.1)).toFixed(2);
        const profitRate = ((parseFloat(profit) / parseFloat(salesAmount)) * 100).toFixed(2);
        const goodsCount = Math.floor(Math.random() * 50) + 10;
        
        data.push({
          id: i + 1,
          rank: i + 1,
          goodsType: goodsTypes[i],
          goodsCount,
          quantity,
          salesAmount,
          orderCount,
          profit,
          profitRate,
          percentage: ((5 - i) * 5 + Math.random() * 10).toFixed(2)
        });
      }
    } else if (activeTab === 'station') {
      for (let i = 0; i < 20; i++) {
        if (i >= startIndex && i < endIndex) {
          const quantity = Math.floor(Math.random() * 10000) + 1000;
          const salesAmount = ((Math.random() * 500000) + 50000).toFixed(2);
          const orderCount = Math.floor(Math.random() * 2000) + 200;
          const profit = (parseFloat(salesAmount) * (Math.random() * 0.3 + 0.1)).toFixed(2);
          const profitRate = ((parseFloat(profit) / parseFloat(salesAmount)) * 100).toFixed(2);
          const goodsCount = Math.floor(Math.random() * 100) + 50;
          
          data.push({
            id: i + 1,
            rank: i + 1,
            stationName: `加油站${i + 1}`,
            stationCode: `S${String(1000 + i).padStart(6, '0')}`,
            goodsCount,
            quantity,
            salesAmount,
            orderCount,
            profit,
            profitRate,
            percentage: ((20 - i) * 2 + Math.random() * 5).toFixed(2)
          });
        }
      }
    }

    // 根据排行类型排序
    if (rankingType === 'amount') {
      data.sort((a, b) => parseFloat(b.salesAmount) - parseFloat(a.salesAmount));
    } else if (rankingType === 'quantity') {
      data.sort((a, b) => b.quantity - a.quantity);
    } else if (rankingType === 'profit') {
      data.sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit));
    }

    // 更新排名
    data.forEach((item, index) => {
      item.rank = index + 1;
    });

    return {
      data,
      total: activeTab === 'type' ? goodsTypes.length : total
    };
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setPagination({
      ...pagination,
      current: 1
    });
    fetchRankingData();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    fetchRankingData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 导出数据
  const handleExport = () => {
    message.success('导出销售排行数据');
  };

  // 处理排行类型变化
  const handleRankingTypeChange = (e) => {
    setRankingType(e.target.value);
  };

  // 处理时间范围变化
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  // 商品排行表格列定义
  const goodsColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      fixed: 'left',
      render: (text) => (
        <div className="ranking-number">
          {text <= 3 ? (
            <span className={`top-${text}`}>{text}</span>
          ) : (
            <span>{text}</span>
          )}
        </div>
      )
    },
    {
      title: '商品编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 120
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 150
    },
    {
      title: '销售数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (text) => text.toLocaleString()
    },
    {
      title: '单价(元)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      align: 'right'
    },
    {
      title: '销售金额(元)',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 120,
      align: 'right',
      sorter: (a, b) => parseFloat(a.salesAmount) - parseFloat(b.salesAmount),
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 80,
      align: 'right',
      render: (text) => text.toLocaleString()
    },
    {
      title: '利润(元)',
      dataIndex: 'profit',
      key: 'profit',
      width: 100,
      align: 'right',
      sorter: (a, b) => parseFloat(a.profit) - parseFloat(b.profit),
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '利润率',
      dataIndex: 'profitRate',
      key: 'profitRate',
      width: 80,
      align: 'right',
      render: (text) => `${text}%`
    }
  ];

  // 商品类型排行表格列定义
  const typeColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (text) => (
        <div className="ranking-number">
          {text <= 3 ? (
            <span className={`top-${text}`}>{text}</span>
          ) : (
            <span>{text}</span>
          )}
        </div>
      )
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: 120
    },
    {
      title: '商品数量',
      dataIndex: 'goodsCount',
      key: 'goodsCount',
      width: 100,
      align: 'right'
    },
    {
      title: '销售数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'right',
      render: (text) => text.toLocaleString()
    },
    {
      title: '销售金额(元)',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 150,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right',
      render: (text) => text.toLocaleString()
    },
    {
      title: '利润(元)',
      dataIndex: 'profit',
      key: 'profit',
      width: 120,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '利润率',
      dataIndex: 'profitRate',
      key: 'profitRate',
      width: 100,
      align: 'right',
      render: (text) => `${text}%`
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 200,
      render: (text) => (
        <Progress 
          percent={parseFloat(text)} 
          size="small" 
          status="active" 
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
      )
    }
  ];

  // 站点排行表格列定义
  const stationColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (text) => (
        <div className="ranking-number">
          {text <= 3 ? (
            <span className={`top-${text}`}>{text}</span>
          ) : (
            <span>{text}</span>
          )}
        </div>
      )
    },
    {
      title: '站点编码',
      dataIndex: 'stationCode',
      key: 'stationCode',
      width: 120
    },
    {
      title: '站点名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150
    },
    {
      title: '商品数量',
      dataIndex: 'goodsCount',
      key: 'goodsCount',
      width: 100,
      align: 'right'
    },
    {
      title: '销售数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'right',
      render: (text) => text.toLocaleString()
    },
    {
      title: '销售金额(元)',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 150,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right',
      render: (text) => text.toLocaleString()
    },
    {
      title: '利润(元)',
      dataIndex: 'profit',
      key: 'profit',
      width: 120,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '利润率',
      dataIndex: 'profitRate',
      key: 'profitRate',
      width: 100,
      align: 'right',
      render: (text) => `${text}%`
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 200,
      render: (text) => (
        <Progress 
          percent={parseFloat(text)} 
          size="small" 
          status="active" 
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
      )
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="sales-ranking-search-form">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
        initialValues={{
          dateRange: [moment().subtract(7, 'days'), moment()]
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="日期范围" rules={[{ required: true, message: '请选择日期范围' }]}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {activeTab === 'goods' && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="goodsType" label="商品类型">
                  <Select placeholder="请选择商品类型" allowClear>
                    <Option value="饮料">饮料</Option>
                    <Option value="零食">零食</Option>
                    <Option value="香烟">香烟</Option>
                    <Option value="日用品">日用品</Option>
                    <Option value="汽车用品">汽车用品</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="goodsName" label="商品名称">
                  <Input placeholder="请输入商品名称" allowClear />
                </Form.Item>
              </Col>
            </>
          )}
          {activeTab === 'station' && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="stationName" label="站点名称">
                <Input placeholder="请输入站点名称" allowClear />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 渲染排行设置
  const renderRankingSettings = () => (
    <Card className="sales-ranking-settings">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <div className="setting-group">
            <span className="setting-label">排行类型:</span>
            <Radio.Group value={rankingType} onChange={handleRankingTypeChange}>
              <Radio.Button value="amount">销售额</Radio.Button>
              <Radio.Button value="quantity">销售量</Radio.Button>
              <Radio.Button value="profit">利润</Radio.Button>
            </Radio.Group>
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <div className="setting-group">
            <span className="setting-label">时间范围:</span>
            <Radio.Group value={timeRange} onChange={handleTimeRangeChange}>
              <Radio.Button value="day">今日</Radio.Button>
              <Radio.Button value="week">本周</Radio.Button>
              <Radio.Button value="month">本月</Radio.Button>
              <Radio.Button value="year">本年</Radio.Button>
            </Radio.Group>
          </div>
        </Col>
      </Row>
    </Card>
  );

  // 渲染统计卡片
  const renderStatisticCards = () => {
    // 计算汇总数据
    const totalSales = rankingData.reduce((sum, item) => sum + parseFloat(item.salesAmount || 0), 0);
    const totalQuantity = rankingData.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalProfit = rankingData.reduce((sum, item) => sum + parseFloat(item.profit || 0), 0);
    
    return (
      <Row gutter={16} className="sales-ranking-statistics">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总销售额(元)"
              value={totalSales}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总销售量"
              value={totalQuantity}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BarChartOutlined />}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总利润(元)"
              value={totalProfit}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<RiseOutlined />}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 渲染排行榜内容
  const renderRankingContent = () => (
    <div className="sales-ranking-content">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="商品排行" key="goods">
          <Table
            className="sales-ranking-table"
            columns={goodsColumns}
            dataSource={rankingData}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1200 }}
          />
        </TabPane>
        <TabPane tab="商品类型排行" key="type">
          <Table
            className="sales-ranking-table"
            columns={typeColumns}
            dataSource={rankingData}
            rowKey="id"
            pagination={false}
            loading={loading}
            scroll={{ x: 1200 }}
          />
        </TabPane>
        <TabPane tab="站点排行" key="station">
          <Table
            className="sales-ranking-table"
            columns={stationColumns}
            dataSource={rankingData}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1200 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );

  return (
    <div className="sales-ranking">
      {renderSearchForm()}
      {renderRankingSettings()}
      {renderStatisticCards()}
      {renderRankingContent()}
    </div>
  );
};

export default SalesRanking; 