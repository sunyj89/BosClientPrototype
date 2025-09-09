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
  TreeSelect,
  Tag
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

const GoodsSalesReport = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [reportType, setReportType] = useState('daily');
  const [goodsType, setGoodsType] = useState('all');
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
      totalSales: 12500.50,
      totalCost: 8750.35,
      grossProfit: 3750.15,
      grossProfitRate: 30.00,
      totalInputTax: 875.04,
      totalOutputTax: 1625.07,
      salesOrders: 158,
      avgSales: 79.12,
      goodsTypes: 25,
      goodsQuantity: 1850,
    },
    {
      key: '2',
      date: '2025-03-12',
      totalSales: 13200.75,
      totalCost: 9240.53,
      grossProfit: 3960.22,
      grossProfitRate: 30.00,
      totalInputTax: 924.05,
      totalOutputTax: 1716.10,
      salesOrders: 163,
      avgSales: 80.99,
      goodsTypes: 28,
      goodsQuantity: 1920,
    },
    {
      key: '3',
      date: '2025-03-11',
      totalSales: 15200.25,
      totalCost: 10640.18,
      grossProfit: 4560.07,
      grossProfitRate: 30.00,
      totalInputTax: 1064.02,
      totalOutputTax: 1976.03,
      salesOrders: 152,
      avgSales: 100.00,
      goodsTypes: 30,
      goodsQuantity: 2150,
    },
    {
      key: '4',
      date: '2025-03-10',
      totalSales: 13800.50,
      totalCost: 9660.35,
      grossProfit: 4140.15,
      grossProfitRate: 30.00,
      totalInputTax: 966.04,
      totalOutputTax: 1794.07,
      salesOrders: 138,
      avgSales: 100.00,
      goodsTypes: 26,
      goodsQuantity: 1780,
    },
    {
      key: '5',
      date: '2025-03-09',
      totalSales: 14100.25,
      totalCost: 9870.18,
      grossProfit: 4230.07,
      grossProfitRate: 30.00,
      totalInputTax: 987.02,
      totalOutputTax: 1833.03,
      salesOrders: 141,
      avgSales: 100.00,
      goodsTypes: 27,
      goodsQuantity: 1850,
    },
    {
      key: '6',
      date: '2025-03-08',
      totalSales: 13200.75,
      totalCost: 9240.53,
      grossProfit: 3960.22,
      grossProfitRate: 30.00,
      totalInputTax: 924.05,
      totalOutputTax: 1716.10,
      salesOrders: 132,
      avgSales: 100.00,
      goodsTypes: 25,
      goodsQuantity: 1720,
    },
    {
      key: '7',
      date: '2025-03-07',
      totalSales: 12500.50,
      totalCost: 8750.35,
      grossProfit: 3750.15,
      grossProfitRate: 30.00,
      totalInputTax: 875.04,
      totalOutputTax: 1625.07,
      salesOrders: 125,
      avgSales: 100.00,
      goodsTypes: 24,
      goodsQuantity: 1650,
    },
  ];

  // 模拟商品销售排行数据
  const goodsRankingData = [
    {
      key: '1',
      rank: 1,
      name: '可口可乐',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      quantity: 3500,
      sales: 8750.00,
      cost: 7000.00,
      grossProfit: 1750.00,
      grossProfitRate: 20.00,
      proportion: 9.25,
    },
    {
      key: '2',
      rank: 2,
      name: '百事可乐',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      quantity: 3200,
      sales: 7360.00,
      cost: 5760.00,
      grossProfit: 1600.00,
      grossProfitRate: 21.74,
      proportion: 7.78,
    },
    {
      key: '3',
      rank: 3,
      name: '康师傅方便面',
      category: '食品',
      specification: '100g/包',
      unit: '包',
      quantity: 2800,
      sales: 7840.00,
      cost: 5600.00,
      grossProfit: 2240.00,
      grossProfitRate: 28.57,
      proportion: 8.29,
    },
    {
      key: '4',
      rank: 4,
      name: '统一方便面',
      category: '食品',
      specification: '100g/包',
      unit: '包',
      quantity: 2500,
      sales: 6750.00,
      cost: 4500.00,
      grossProfit: 2250.00,
      grossProfitRate: 33.33,
      proportion: 7.14,
    },
    {
      key: '5',
      rank: 5,
      name: '农夫山泉',
      category: '饮料',
      specification: '550ml/瓶',
      unit: '瓶',
      quantity: 3800,
      sales: 5700.00,
      cost: 3800.00,
      grossProfit: 1900.00,
      grossProfitRate: 33.33,
      proportion: 6.03,
    },
    {
      key: '6',
      rank: 6,
      name: '洗发水',
      category: '日化',
      specification: '400ml/瓶',
      unit: '瓶',
      quantity: 180,
      sales: 4500.00,
      cost: 2880.00,
      grossProfit: 1620.00,
      grossProfitRate: 36.00,
      proportion: 4.76,
    },
    {
      key: '7',
      rank: 7,
      name: '沐浴露',
      category: '日化',
      specification: '400ml/瓶',
      unit: '瓶',
      quantity: 150,
      sales: 3300.00,
      cost: 2100.00,
      grossProfit: 1200.00,
      grossProfitRate: 36.36,
      proportion: 3.49,
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
      title: '成本总额(元)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalCost - b.totalCost,
    },
    {
      title: '毛利(元)',
      dataIndex: 'grossProfit',
      key: 'grossProfit',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.grossProfit - b.grossProfit,
    },
    {
      title: '毛利率(%)',
      dataIndex: 'grossProfitRate',
      key: 'grossProfitRate',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.grossProfitRate - b.grossProfitRate,
    },
    {
      title: '进项税总额(元)',
      dataIndex: 'totalInputTax',
      key: 'totalInputTax',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalInputTax - b.totalInputTax,
    },
    {
      title: '销项税总额(元)',
      dataIndex: 'totalOutputTax',
      key: 'totalOutputTax',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalOutputTax - b.totalOutputTax,
    },
    {
      title: '销售单数',
      dataIndex: 'salesOrders',
      key: 'salesOrders',
      sorter: (a, b) => a.salesOrders - b.salesOrders,
    },
    {
      title: '平均单价(元)',
      dataIndex: 'avgSales',
      key: 'avgSales',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.avgSales - b.avgSales,
    },
  ];

  // 商品销售排行表格列配置
  const goodsRankingColumns = [
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
        { text: '饮料', value: '饮料' },
        { text: '食品', value: '食品' },
        { text: '日化', value: '日化' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (text) => {
        let color = text === '饮料' ? 'blue' : text === '食品' ? 'green' : 'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '销售数量',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: '销售金额(元)',
      dataIndex: 'sales',
      key: 'sales',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: '成本金额(元)',
      dataIndex: 'cost',
      key: 'cost',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: '毛利(元)',
      dataIndex: 'grossProfit',
      key: 'grossProfit',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.grossProfit - b.grossProfit,
    },
    {
      title: '毛利率(%)',
      dataIndex: 'grossProfitRate',
      key: 'grossProfitRate',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.grossProfitRate - b.grossProfitRate,
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
    const totalCosts = salesData.map(item => item.totalCost).reverse();
    const grossProfits = salesData.map(item => item.grossProfit).reverse();
    const salesOrderCounts = salesData.map(item => item.salesOrders).reverse();
    
    let series = [];
    
    if (goodsType === 'all' || goodsType === 'sales') {
      series.push({
        name: '销售总额',
        type: chartType,
        data: totalSales,
        smooth: true,
      });
    }
    
    if (goodsType === 'all' || goodsType === 'cost') {
      series.push({
        name: '成本总额',
        type: chartType,
        data: totalCosts,
        smooth: true,
      });
    }
    
    if (goodsType === 'all' || goodsType === 'profit') {
      series.push({
        name: '毛利',
        type: chartType,
        data: grossProfits,
        smooth: true,
      });
    }
    
    if (goodsType === 'orders') {
      series = [{
        name: '销售单数',
        type: chartType,
        data: salesOrderCounts,
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
        name: goodsType === 'orders' ? '销售单数' : '金额(元)'
      },
      series: series
    };
  };

  // 商品销售占比图配置
  const getGoodsSalesProportionOption = () => {
    return {
      title: {
        text: '商品销售占比'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: goodsRankingData.map(item => item.name)
      },
      series: [
        {
          name: '销售金额',
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
          data: goodsRankingData.map(item => ({
            value: item.sales,
            name: item.name
          }))
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
  const handleGoodsTypeChange = (value) => {
    setGoodsType(value);
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
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/report">报表管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>商品销售报表</Breadcrumb.Item>
        </Breadcrumb>
        <h2>商品销售报表 - {getOrgName(selectedOrg)}</h2>
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
              title="毛利总额"
              value={salesData.reduce((sum, item) => sum + item.grossProfit, 0)}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix="¥"
              suffix="元"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 7.5%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上周期</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="毛利率"
              value={(salesData.reduce((sum, item) => sum + item.grossProfit, 0) / salesData.reduce((sum, item) => sum + item.totalSales, 0)) * 100}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="%"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#cf1322' }}>
                <FallOutlined /> 0.5%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上周期</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售单数"
              value={salesData.reduce((sum, item) => sum + item.salesOrders, 0)}
              valueStyle={{ color: '#1890ff' }}
              suffix="单"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 5.3%
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
            <span style={{ marginRight: 8 }}>数据类型:</span>
            <Select 
              value={goodsType} 
              onChange={handleGoodsTypeChange}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="sales">销售额</Option>
              <Option value="cost">成本额</Option>
              <Option value="profit">毛利</Option>
              <Option value="orders">销售单数</Option>
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
          <Card title="商品销售占比">
            <ReactECharts option={getGoodsSalesProportionOption()} style={{ height: 350 }} />
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
                let totalCost = 0;
                let totalGrossProfit = 0;
                let totalInputTax = 0;
                let totalOutputTax = 0;
                let totalOrders = 0;
                
                pageData.forEach(({ totalSales: sales, totalCost: cost, grossProfit, totalInputTax: inputTax, totalOutputTax: outputTax, salesOrders }) => {
                  totalSales += sales;
                  totalCost += cost;
                  totalGrossProfit += grossProfit;
                  totalInputTax += inputTax;
                  totalOutputTax += outputTax;
                  totalOrders += salesOrders;
                });
                
                const avgGrossProfitRate = (totalGrossProfit / totalSales) * 100;
                const avgSales = totalSales / totalOrders;
                
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}><strong>{totalSales.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}><strong>{totalCost.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}><strong>{totalGrossProfit.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}><strong>{avgGrossProfitRate.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}><strong>{totalInputTax.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}><strong>{totalOutputTax.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={7}><strong>{totalOrders}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}><strong>{avgSales.toFixed(2)}</strong></Table.Summary.Cell>
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
              columns={goodsRankingColumns} 
              dataSource={goodsRankingData} 
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

export default GoodsSalesReport; 