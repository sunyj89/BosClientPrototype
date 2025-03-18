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

const PurchaseReport = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [reportType, setReportType] = useState('daily');
  const [supplierType, setSupplierType] = useState('all');
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
  
  // 模拟采购数据
  const purchaseData = [
    {
      key: '1',
      date: '2025-03-13',
      totalAmount: 5680.50,
      totalInputTax: 568.05,
      totalOutputTax: 852.08,
      purchaseOrders: 5,
      avgAmount: 1136.10,
      goodsTypes: 12,
      goodsQuantity: 1520,
    },
    {
      key: '2',
      date: '2025-03-12',
      totalAmount: 4890.25,
      totalInputTax: 489.03,
      totalOutputTax: 733.54,
      purchaseOrders: 4,
      avgAmount: 1222.56,
      goodsTypes: 10,
      goodsQuantity: 1280,
    },
    {
      key: '3',
      date: '2025-03-11',
      totalAmount: 6120.80,
      totalInputTax: 612.08,
      totalOutputTax: 918.12,
      purchaseOrders: 6,
      avgAmount: 1020.13,
      goodsTypes: 15,
      goodsQuantity: 1850,
    },
    {
      key: '4',
      date: '2025-03-10',
      totalAmount: 3250.40,
      totalInputTax: 325.04,
      totalOutputTax: 487.56,
      purchaseOrders: 3,
      avgAmount: 1083.47,
      goodsTypes: 8,
      goodsQuantity: 950,
    },
    {
      key: '5',
      date: '2025-03-09',
      totalAmount: 4200.60,
      totalInputTax: 420.06,
      totalOutputTax: 630.09,
      purchaseOrders: 4,
      avgAmount: 1050.15,
      goodsTypes: 11,
      goodsQuantity: 1320,
    },
    {
      key: '6',
      date: '2025-03-08',
      totalAmount: 5150.30,
      totalInputTax: 515.03,
      totalOutputTax: 772.55,
      purchaseOrders: 5,
      avgAmount: 1030.06,
      goodsTypes: 13,
      goodsQuantity: 1580,
    },
    {
      key: '7',
      date: '2025-03-07',
      totalAmount: 3980.70,
      totalInputTax: 398.07,
      totalOutputTax: 597.11,
      purchaseOrders: 4,
      avgAmount: 995.18,
      goodsTypes: 9,
      goodsQuantity: 1150,
    },
  ];

  // 模拟供应商采购排行数据
  const supplierRankingData = [
    {
      key: '1',
      rank: 1,
      name: '北京供应商A',
      purchaseOrders: 12,
      totalAmount: 15680.50,
      totalInputTax: 1568.05,
      totalOutputTax: 2352.08,
      proportion: 28.35,
    },
    {
      key: '2',
      rank: 2,
      name: '上海供应商B',
      purchaseOrders: 10,
      totalAmount: 12450.75,
      totalInputTax: 1245.08,
      totalOutputTax: 1867.61,
      proportion: 22.50,
    },
    {
      key: '3',
      rank: 3,
      name: '广州供应商C',
      purchaseOrders: 8,
      totalAmount: 9820.30,
      totalInputTax: 982.03,
      totalOutputTax: 1473.05,
      proportion: 17.75,
    },
    {
      key: '4',
      rank: 4,
      name: '深圳供应商D',
      purchaseOrders: 7,
      totalAmount: 8560.40,
      totalInputTax: 856.04,
      totalOutputTax: 1284.06,
      proportion: 15.47,
    },
    {
      key: '5',
      rank: 5,
      name: '杭州供应商E',
      purchaseOrders: 5,
      totalAmount: 5320.80,
      totalInputTax: 532.08,
      totalOutputTax: 798.12,
      proportion: 9.62,
    },
    {
      key: '6',
      rank: 6,
      name: '成都供应商F',
      purchaseOrders: 3,
      totalAmount: 3480.60,
      totalInputTax: 348.06,
      totalOutputTax: 522.09,
      proportion: 6.29,
    },
  ];

  // 采购数据表格列配置
  const purchaseColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '采购总额(元)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
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
      title: '采购单数',
      dataIndex: 'purchaseOrders',
      key: 'purchaseOrders',
      sorter: (a, b) => a.purchaseOrders - b.purchaseOrders,
    },
    {
      title: '平均单价(元)',
      dataIndex: 'avgAmount',
      key: 'avgAmount',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.avgAmount - b.avgAmount,
    },
    {
      title: '商品种类',
      dataIndex: 'goodsTypes',
      key: 'goodsTypes',
      sorter: (a, b) => a.goodsTypes - b.goodsTypes,
    },
    {
      title: '商品数量',
      dataIndex: 'goodsQuantity',
      key: 'goodsQuantity',
      sorter: (a, b) => a.goodsQuantity - b.goodsQuantity,
    },
  ];

  // 供应商排行表格列配置
  const supplierRankingColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '采购单数',
      dataIndex: 'purchaseOrders',
      key: 'purchaseOrders',
      sorter: (a, b) => a.purchaseOrders - b.purchaseOrders,
    },
    {
      title: '采购金额(元)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '进项税额(元)',
      dataIndex: 'totalInputTax',
      key: 'totalInputTax',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalInputTax - b.totalInputTax,
    },
    {
      title: '销项税额(元)',
      dataIndex: 'totalOutputTax',
      key: 'totalOutputTax',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalOutputTax - b.totalOutputTax,
    },
    {
      title: '占比(%)',
      dataIndex: 'proportion',
      key: 'proportion',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.proportion - b.proportion,
    },
  ];

  // 采购趋势图配置
  const getPurchaseTrendOption = () => {
    const dates = purchaseData.map(item => item.date).reverse();
    const totalAmounts = purchaseData.map(item => item.totalAmount).reverse();
    const totalInputTaxes = purchaseData.map(item => item.totalInputTax).reverse();
    const totalOutputTaxes = purchaseData.map(item => item.totalOutputTax).reverse();
    const purchaseOrderCounts = purchaseData.map(item => item.purchaseOrders).reverse();
    
    let series = [];
    
    if (supplierType === 'all' || supplierType === 'amount') {
      series.push({
        name: '采购总额',
        type: chartType,
        data: totalAmounts,
        smooth: true,
      });
    }
    
    if (supplierType === 'all' || supplierType === 'inputTax') {
      series.push({
        name: '进项税总额',
        type: chartType,
        data: totalInputTaxes,
        smooth: true,
      });
    }
    
    if (supplierType === 'all' || supplierType === 'outputTax') {
      series.push({
        name: '销项税总额',
        type: chartType,
        data: totalOutputTaxes,
        smooth: true,
      });
    }
    
    if (supplierType === 'orders') {
      series = [{
        name: '采购单数',
        type: chartType,
        data: purchaseOrderCounts,
        smooth: true,
      }];
    }
    
    return {
      title: {
        text: '采购趋势分析'
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
        name: supplierType === 'orders' ? '采购单数' : '金额(元)'
      },
      series: series
    };
  };

  // 供应商占比图配置
  const getSupplierProportionOption = () => {
    return {
      title: {
        text: '供应商采购占比'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: supplierRankingData.map(item => item.name)
      },
      series: [
        {
          name: '采购金额',
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
          data: supplierRankingData.map(item => ({
            value: item.totalAmount,
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

  // 处理供应商类型变化
  const handleSupplierTypeChange = (value) => {
    setSupplierType(value);
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
        <h2>采购报表 - {getOrgName(selectedOrg)}</h2>
      </div>

      {/* 统计数据卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="采购总额"
              value={purchaseData.reduce((sum, item) => sum + item.totalAmount, 0)}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
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
              title="采购单数"
              value={purchaseData.reduce((sum, item) => sum + item.purchaseOrders, 0)}
              valueStyle={{ color: '#1890ff' }}
              suffix="单"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#3f8600' }}>
                <RiseOutlined /> 4.2%
              </span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>较上周期</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进项税总额"
              value={purchaseData.reduce((sum, item) => sum + item.totalInputTax, 0)}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
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
              title="销项税总额"
              value={purchaseData.reduce((sum, item) => sum + item.totalOutputTax, 0)}
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
              value={supplierType} 
              onChange={handleSupplierTypeChange}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="amount">采购金额</Option>
              <Option value="inputTax">进项税额</Option>
              <Option value="outputTax">销项税额</Option>
              <Option value="orders">采购单数</Option>
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
          <Card title="采购趋势">
            <ReactECharts option={getPurchaseTrendOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="供应商占比">
            <ReactECharts option={getSupplierProportionOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="采购数据" key="1">
          <Card>
            <Table 
              columns={purchaseColumns} 
              dataSource={purchaseData} 
              rowKey="key"
              pagination={false}
              summary={pageData => {
                let totalAmount = 0;
                let totalInputTax = 0;
                let totalOutputTax = 0;
                let totalOrders = 0;
                let totalTypes = 0;
                let totalQuantity = 0;
                
                pageData.forEach(({ totalAmount: amount, totalInputTax: inputTax, totalOutputTax: outputTax, purchaseOrders, goodsTypes, goodsQuantity }) => {
                  totalAmount += amount;
                  totalInputTax += inputTax;
                  totalOutputTax += outputTax;
                  totalOrders += purchaseOrders;
                  totalTypes += goodsTypes;
                  totalQuantity += goodsQuantity;
                });
                
                const avgAmount = totalAmount / totalOrders;
                
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}><strong>{totalAmount.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}><strong>{totalInputTax.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}><strong>{totalOutputTax.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}><strong>{totalOrders}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}><strong>{avgAmount.toFixed(2)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}><strong>{totalTypes}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={7}><strong>{totalQuantity}</strong></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="供应商排行" key="2">
          <Card>
            <Table 
              columns={supplierRankingColumns} 
              dataSource={supplierRankingData} 
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

export default PurchaseReport; 