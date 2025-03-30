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
  Radio,
  Divider,
  TreeSelect
} from 'antd';
import { 
  DownloadOutlined, 
  PrinterOutlined, 
  ReloadOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesReport = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [reportType, setReportType] = useState('daily');
  const [productType, setProductType] = useState('all');
  const [chartType, setChartType] = useState('line');
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
  
  // 模拟销售数据
  const salesData = [
    {
      key: '1',
      date: '2025-03-13',
      totalSales: 15800.50,
      transactions: 158,
      avgTransaction: 100.00,
      oilSales: 10500.20,
      goodsSales: 3800.30,
      serviceSales: 1500.00,
    },
    {
      key: '2',
      date: '2025-03-12',
      totalSales: 16300.75,
      transactions: 163,
      avgTransaction: 100.00,
      oilSales: 11200.50,
      goodsSales: 3600.25,
      serviceSales: 1500.00,
    },
    {
      key: '3',
      date: '2025-03-11',
      totalSales: 15200.25,
      transactions: 152,
      avgTransaction: 100.00,
      oilSales: 10100.15,
      goodsSales: 3600.10,
      serviceSales: 1500.00,
    },
    {
      key: '4',
      date: '2025-03-10',
      totalSales: 13800.50,
      transactions: 138,
      avgTransaction: 100.00,
      oilSales: 9200.30,
      goodsSales: 3100.20,
      serviceSales: 1500.00,
    },
    {
      key: '5',
      date: '2025-03-09',
      totalSales: 14100.25,
      transactions: 141,
      avgTransaction: 100.00,
      oilSales: 9500.15,
      goodsSales: 3100.10,
      serviceSales: 1500.00,
    },
    {
      key: '6',
      date: '2025-03-08',
      totalSales: 13200.75,
      transactions: 132,
      avgTransaction: 100.00,
      oilSales: 8800.50,
      goodsSales: 2900.25,
      serviceSales: 1500.00,
    },
    {
      key: '7',
      date: '2025-03-07',
      totalSales: 12500.50,
      transactions: 125,
      avgTransaction: 100.00,
      oilSales: 8300.30,
      goodsSales: 2700.20,
      serviceSales: 1500.00,
    },
  ];

  // 模拟商品销售排行数据
  const productRankingData = [
    {
      key: '1',
      rank: 1,
      name: '92#汽油',
      category: '油品',
      quantity: 3500,
      unit: '升',
      sales: 24500.00,
      proportion: 35.77,
    },
    {
      key: '2',
      rank: 2,
      name: '95#汽油',
      category: '油品',
      quantity: 2800,
      unit: '升',
      sales: 21000.00,
      proportion: 30.66,
    },
    {
      key: '3',
      rank: 3,
      name: '0#柴油',
      category: '油品',
      quantity: 3000,
      unit: '升',
      sales: 18000.00,
      proportion: 26.28,
    },
    {
      key: '4',
      rank: 4,
      name: '可口可乐',
      category: '饮料',
      quantity: 350,
      unit: '瓶',
      sales: 1225.00,
      proportion: 1.79,
    },
    {
      key: '5',
      rank: 5,
      name: '康师傅方便面',
      category: '食品',
      quantity: 280,
      unit: '包',
      sales: 1120.00,
      proportion: 1.63,
    },
    {
      key: '6',
      rank: 6,
      name: '洗车服务',
      category: '服务',
      quantity: 75,
      unit: '次',
      sales: 1875.00,
      proportion: 2.74,
    },
    {
      key: '7',
      rank: 7,
      name: '机油更换',
      category: '服务',
      quantity: 25,
      unit: '次',
      sales: 750.00,
      proportion: 1.09,
    },
  ];

  // 销售数据表格列配置
  const salesColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '销售总额(元)',
      dataIndex: 'totalSales',
      key: 'totalSales',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalSales - b.totalSales,
    },
    {
      title: '交易笔数',
      dataIndex: 'transactions',
      key: 'transactions',
      sorter: (a, b) => a.transactions - b.transactions,
    },
    {
      title: '客单价(元)',
      dataIndex: 'avgTransaction',
      key: 'avgTransaction',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.avgTransaction - b.avgTransaction,
    },
    {
      title: '油品销售(元)',
      dataIndex: 'oilSales',
      key: 'oilSales',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.oilSales - b.oilSales,
    },
    {
      title: '商品销售(元)',
      dataIndex: 'goodsSales',
      key: 'goodsSales',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.goodsSales - b.goodsSales,
    },
    {
      title: '服务销售(元)',
      dataIndex: 'serviceSales',
      key: 'serviceSales',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.serviceSales - b.serviceSales,
    },
  ];

  // 商品销售排行表格列配置
  const productRankingColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '油品', value: '油品' },
        { text: '饮料', value: '饮料' },
        { text: '食品', value: '食品' },
        { text: '服务', value: '服务' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '销售数量',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '销售金额(元)',
      dataIndex: 'sales',
      key: 'sales',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: '占比(%)',
      dataIndex: 'proportion',
      key: 'proportion',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.proportion - b.proportion,
    },
  ];

  // 销售趋势图配置
  const getSalesTrendOption = () => {
    const dates = salesData.map(item => item.date).reverse();
    const totalSales = salesData.map(item => item.totalSales).reverse();
    const transactions = salesData.map(item => item.transactions).reverse();
    const oilSales = salesData.map(item => item.oilSales).reverse();
    const goodsSales = salesData.map(item => item.goodsSales).reverse();
    const serviceSales = salesData.map(item => item.serviceSales).reverse();
    
    let series = [];
    
    if (productType === 'all' || productType === 'total') {
      series.push({
        name: '销售总额',
        type: chartType,
        data: totalSales,
        smooth: true,
      });
    }
    
    if (productType === 'all' || productType === 'oil') {
      series.push({
        name: '油品销售',
        type: chartType,
        data: oilSales,
        smooth: true,
      });
    }
    
    if (productType === 'all' || productType === 'goods') {
      series.push({
        name: '商品销售',
        type: chartType,
        data: goodsSales,
        smooth: true,
      });
    }
    
    if (productType === 'all' || productType === 'service') {
      series.push({
        name: '服务销售',
        type: chartType,
        data: serviceSales,
        smooth: true,
      });
    }
    
    if (productType === 'transactions') {
      series = [{
        name: '交易笔数',
        type: chartType,
        data: transactions,
        smooth: true,
      }];
    }
    
    return {
      title: {
        text: '销售趋势分析'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: series.map(item => item.name)
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
        type: 'value',
        name: productType === 'transactions' ? '交易笔数' : '销售额(元)'
      },
      series: series
    };
  };

  // 销售构成图配置
  const getSalesCompositionOption = () => {
    // 计算各类销售总额
    const totalOilSales = salesData.reduce((sum, item) => sum + item.oilSales, 0);
    const totalGoodsSales = salesData.reduce((sum, item) => sum + item.goodsSales, 0);
    const totalServiceSales = salesData.reduce((sum, item) => sum + item.serviceSales, 0);
    
    return {
      title: {
        text: '销售构成分析'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['油品销售', '商品销售', '服务销售']
      },
      series: [
        {
          name: '销售额',
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
            { value: totalOilSales, name: '油品销售' },
            { value: totalGoodsSales, name: '商品销售' },
            { value: totalServiceSales, name: '服务销售' }
          ]
        }
      ]
    };
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // 处理报表类型变化
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  // 处理商品类型变化
  const handleProductTypeChange = (value) => {
    setProductType(value);
  };

  // 处理图表类型变化
  const handleChartTypeChange = (value) => {
    setChartType(value);
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
        <h2>销售报表 - {getOrgName(selectedOrg)}</h2>
      </div>

      {/* 统计数据卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售总额"
              value={salesData.reduce((sum, item) => sum + item.totalSales, 0)}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix="元"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 8.2%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上周期</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="交易笔数"
              value={salesData.reduce((sum, item) => sum + item.transactions, 0)}
              valueStyle={{ color: '#1890ff' }}
              suffix="笔"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 5.3%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上周期</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客单价"
              value={salesData.reduce((sum, item) => sum + item.totalSales, 0) / salesData.reduce((sum, item) => sum + item.transactions, 0)}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix="¥"
              suffix="元"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#cf1322' }}>
                <FallOutlined /> 2.1%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上周期</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="油品销售占比"
              value={(salesData.reduce((sum, item) => sum + item.oilSales, 0) / salesData.reduce((sum, item) => sum + item.totalSales, 0)) * 100}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              suffix="%"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 1.5%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上周期</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 报表筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
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
          <Col span={6}>
            <span style={{ marginRight: 8 }}>日期范围:</span>
            <RangePicker 
              value={dateRange} 
              onChange={handleDateRangeChange} 
              style={{ width: 230 }}
            />
          </Col>
          <Col span={6}>
            <span style={{ marginRight: 8 }}>报表类型:</span>
            <Radio.Group value={reportType} onChange={handleReportTypeChange}>
              <Radio.Button value="daily">日报</Radio.Button>
              <Radio.Button value="weekly">周报</Radio.Button>
              <Radio.Button value="monthly">月报</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={6}>
            <span style={{ marginRight: 8 }}>商品类型:</span>
            <Select 
              value={productType} 
              onChange={handleProductTypeChange}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="total">销售总额</Option>
              <Option value="oil">油品</Option>
              <Option value="goods">商品</Option>
              <Option value="service">服务</Option>
              <Option value="transactions">交易笔数</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={6}>
            <span style={{ marginRight: 8 }}>图表类型:</span>
            <Select 
              value={chartType} 
              onChange={handleChartTypeChange}
              style={{ width: 120 }}
            >
              <Option value="line">折线图</Option>
              <Option value="bar">柱状图</Option>
              <Option value="area">面积图</Option>
            </Select>
          </Col>
          <Col span={18} style={{ textAlign: 'right' }}>
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
        <Col span={16}>
          <Card title="销售趋势">
            <ReactECharts option={getSalesTrendOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="销售构成">
            <ReactECharts option={getSalesCompositionOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="销售数据" key="1">
          <Card>
            <Table 
              columns={salesColumns} 
              dataSource={salesData} 
              rowKey="key"
              pagination={false}
              summary={pageData => {
                let totalSales = 0;
                let totalTransactions = 0;
                let totalOilSales = 0;
                let totalGoodsSales = 0;
                let totalServiceSales = 0;
                
                pageData.forEach(({ totalSales: sales, transactions, oilSales, goodsSales, serviceSales }) => {
                  totalSales += sales;
                  totalTransactions += transactions;
                  totalOilSales += oilSales;
                  totalGoodsSales += goodsSales;
                  totalServiceSales += serviceSales;
                });
                
                const avgTransaction = totalSales / totalTransactions;
                
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}><strong>{totalSales.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}><strong>{totalTransactions}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}><strong>{avgTransaction.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}><strong>{totalOilSales.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}><strong>{totalGoodsSales.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}><strong>{totalServiceSales.toFixed(2)}</strong></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="商品销售排行" key="2">
          <Card>
            <Table 
              columns={productRankingColumns} 
              dataSource={productRankingData} 
              rowKey="key"
              pagination={false}
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

export default SalesReport; 