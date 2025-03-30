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
  Statistic,
  message,
  Tabs
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// 销售日报表页面
const DailyReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalQuantity: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });
  const [activeTab, setActiveTab] = useState('table');

  // 组件加载时获取数据
  useEffect(() => {
    fetchReportData();
  }, [pagination.current, pagination.pageSize]);

  // 获取报表数据
  const fetchReportData = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setReportData(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        
        // 计算汇总数据
        const totalSales = mockData.data.reduce((sum, item) => sum + parseFloat(item.salesAmount), 0);
        const totalQuantity = mockData.data.reduce((sum, item) => sum + item.quantity, 0);
        const totalOrders = mockData.data.reduce((sum, item) => sum + item.orderCount, 0);
        
        setSummaryData({
          totalSales,
          totalQuantity,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取销售日报表数据失败:', error);
      message.error('获取销售日报表数据失败');
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

    for (let i = 0; i < total; i++) {
      if (i >= startIndex && i < endIndex) {
        const date = moment().subtract(i % 30, 'days').format('YYYY-MM-DD');
        const goodsTypes = ['饮料', '零食', '香烟', '日用品', '汽车用品'];
        const goodsNames = [
          ['可口可乐', '百事可乐', '雪碧', '芬达', '农夫山泉'],
          ['薯片', '饼干', '巧克力', '糖果', '坚果'],
          ['中华', '万宝路', '玉溪', '黄鹤楼', '利群'],
          ['洗发水', '沐浴露', '牙膏', '洗衣液', '纸巾'],
          ['机油', '玻璃水', '车载香水', '车载充电器', '车载吸尘器']
        ];
        
        const typeIndex = i % 5;
        const nameIndex = i % 5;
        const quantity = Math.floor(Math.random() * 100) + 10;
        const unitPrice = ((Math.random() * 50) + 5).toFixed(2);
        const salesAmount = (quantity * parseFloat(unitPrice)).toFixed(2);
        const orderCount = Math.floor(Math.random() * 20) + 1;
        
        data.push({
          id: i + 1,
          date,
          stationName: `加油站${i % 10 + 1}`,
          goodsType: goodsTypes[typeIndex],
          goodsName: goodsNames[typeIndex][nameIndex],
          quantity,
          unitPrice,
          salesAmount,
          orderCount,
          averagePrice: (parseFloat(salesAmount) / quantity).toFixed(2)
        });
      }
    }

    return {
      data,
      total
    };
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setPagination({
      ...pagination,
      current: 1
    });
    fetchReportData();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    fetchReportData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 导出数据
  const handleExport = () => {
    message.success('导出销售日报表数据');
  };

  // 表格列定义
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      fixed: 'left'
    },
    {
      title: '站点',
      dataIndex: 'stationName',
      key: 'stationName',
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
      sorter: (a, b) => a.quantity - b.quantity
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
      align: 'right'
    },
    {
      title: '平均单价(元)',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      width: 120,
      align: 'right'
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="daily-report-search-form">
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="stationName" label="站点">
              <Select placeholder="请选择站点" allowClear>
                <Option value="站点1">站点1</Option>
                <Option value="站点2">站点2</Option>
                <Option value="站点3">站点3</Option>
              </Select>
            </Form.Item>
          </Col>
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

  // 渲染统计卡片
  const renderStatisticCards = () => (
    <Row gutter={16} className="daily-report-statistics">
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="总销售额(元)"
            value={summaryData.totalSales}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="总销售量"
            value={summaryData.totalQuantity}
            valueStyle={{ color: '#1890ff' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="总订单数"
            value={summaryData.totalOrders}
            valueStyle={{ color: '#722ed1' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="平均订单金额(元)"
            value={summaryData.averageOrderValue}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Card>
      </Col>
    </Row>
  );

  // 渲染图表占位符
  const renderChartPlaceholder = (title, icon) => (
    <div className="daily-report-chart-placeholder">
      <div className="placeholder-icon">{icon}</div>
      <div className="placeholder-text">
        <p>{title}图表开发中...</p>
        <p>此处将展示{title}图表，以可视化方式呈现销售数据</p>
      </div>
    </div>
  );

  // 渲染图表内容
  const renderChartContent = () => (
    <div className="daily-report-charts">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><BarChartOutlined />销售趋势</span>} 
          key="trend"
        >
          <Card title="销售趋势分析" extra={<Button icon={<DownloadOutlined />}>下载图表</Button>}>
            {renderChartPlaceholder('销售趋势', <LineChartOutlined style={{ fontSize: 48 }} />)}
          </Card>
        </TabPane>
        <TabPane 
          tab={<span><PieChartOutlined />商品类型分布</span>} 
          key="distribution"
        >
          <Card title="商品类型销售分布" extra={<Button icon={<DownloadOutlined />}>下载图表</Button>}>
            {renderChartPlaceholder('商品类型分布', <PieChartOutlined style={{ fontSize: 48 }} />)}
          </Card>
        </TabPane>
        <TabPane 
          tab={<span><BarChartOutlined />商品排行</span>} 
          key="ranking"
        >
          <Card title="商品销售排行" extra={<Button icon={<DownloadOutlined />}>下载图表</Button>}>
            {renderChartPlaceholder('商品排行', <BarChartOutlined style={{ fontSize: 48 }} />)}
          </Card>
        </TabPane>
        <TabPane 
          tab={<span><BarChartOutlined />数据表格</span>} 
          key="table"
        >
          <Table
            className="daily-report-table"
            columns={columns}
            dataSource={reportData}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1200 }}
            summary={pageData => {
              let totalQuantity = 0;
              let totalSalesAmount = 0;
              let totalOrderCount = 0;
              
              pageData.forEach(({ quantity, salesAmount, orderCount }) => {
                totalQuantity += quantity;
                totalSalesAmount += parseFloat(salesAmount);
                totalOrderCount += orderCount;
              });
              
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>合计</Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="right">{totalQuantity}</Table.Summary.Cell>
                    <Table.Summary.Cell index={5} align="right">-</Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="right">
                      {totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7} align="right">{totalOrderCount}</Table.Summary.Cell>
                    <Table.Summary.Cell index={8} align="right">-</Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );

  return (
    <div className="daily-report">
      {renderSearchForm()}
      {renderStatisticCards()}
      {renderChartContent()}
    </div>
  );
};

export default DailyReport; 