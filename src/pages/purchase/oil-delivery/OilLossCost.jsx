import React, { useEffect, useRef, useState } from 'react';
import { Card, Form, Button, Table, Space, DatePicker, Select, Row, Col, Statistic, Divider, Tabs, message } from 'antd';
import { DollarOutlined, LineChartOutlined, PieChartOutlined, ExportOutlined, SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const OilLossCost = () => {
  const [form] = Form.useForm();
  const oilTypeChartRef = useRef(null);
  const monthChartRef = useRef(null);
  const [oilTypeChart, setOilTypeChart] = useState(null);
  const [monthChart, setMonthChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('oilType');

  // 模拟数据 - 按油品类型统计
  const oilTypeStats = [
    {
      key: '1',
      oilType: '92#汽油',
      totalLossQuantity: 2468,
      avgPrice: 8.12,
      totalCost: 20040.16,
      proportion: 41.4,
    },
    {
      key: '2',
      oilType: '95#汽油',
      totalLossQuantity: 1642,
      avgPrice: 8.67,
      totalCost: 14236.14,
      proportion: 29.4,
    },
    {
      key: '3',
      oilType: '98#汽油',
      totalLossQuantity: 691,
      avgPrice: 9.23,
      totalCost: 6377.93,
      proportion: 13.2,
    },
    {
      key: '4',
      oilType: '0#柴油',
      totalLossQuantity: 1247,
      avgPrice: 7.78,
      totalCost: 9701.66,
      proportion: 20.1,
    },
    {
      key: '5',
      oilType: '所有油品',
      totalLossQuantity: 6048,
      avgPrice: 8.32,
      totalCost: 50319.36,
      proportion: 100.0,
    },
  ];

  // 模拟数据 - 按月份统计
  const monthStats = [
    {
      key: '1',
      month: '1月',
      totalLossQuantity: 520,
      avgPrice: 8.25,
      totalCost: 4290.00,
      proportion: 8.5,
    },
    {
      key: '2',
      month: '2月',
      totalLossQuantity: 485,
      avgPrice: 8.30,
      totalCost: 4025.50,
      proportion: 8.0,
    },
    {
      key: '3',
      month: '3月',
      totalLossQuantity: 550,
      avgPrice: 8.35,
      totalCost: 4592.50,
      proportion: 9.1,
    },
    {
      key: '4',
      month: '4月',
      totalLossQuantity: 510,
      avgPrice: 8.40,
      totalCost: 4284.00,
      proportion: 8.5,
    },
    {
      key: '5',
      month: '5月',
      totalLossQuantity: 530,
      avgPrice: 8.45,
      totalCost: 4478.50,
      proportion: 8.9,
    },
    {
      key: '6',
      month: '6月',
      totalLossQuantity: 580,
      avgPrice: 8.50,
      totalCost: 4930.00,
      proportion: 9.8,
    },
    {
      key: '7',
      month: '7月',
      totalLossQuantity: 610,
      avgPrice: 8.55,
      totalCost: 5215.50,
      proportion: 10.4,
    },
    {
      key: '8',
      month: '8月',
      totalLossQuantity: 590,
      avgPrice: 8.60,
      totalCost: 5074.00,
      proportion: 10.1,
    },
    {
      key: '9',
      month: '9月',
      totalLossQuantity: 540,
      avgPrice: 8.65,
      totalCost: 4671.00,
      proportion: 9.3,
    },
    {
      key: '10',
      month: '10月',
      totalLossQuantity: 520,
      avgPrice: 8.70,
      totalCost: 4524.00,
      proportion: 9.0,
    },
    {
      key: '11',
      month: '11月',
      totalLossQuantity: 490,
      avgPrice: 8.75,
      totalCost: 4287.50,
      proportion: 8.5,
    },
    {
      key: '12',
      month: '12月',
      totalLossQuantity: 480,
      avgPrice: 8.80,
      totalCost: 4224.00,
      proportion: 8.4,
    },
    {
      key: '13',
      month: '全年',
      totalLossQuantity: 6048,
      avgPrice: 8.32,
      totalCost: 50319.36,
      proportion: 100.0,
    },
  ];

  // 初始化油品类型图表
  useEffect(() => {
    if (oilTypeChartRef.current) {
      const chart = echarts.init(oilTypeChartRef.current);
      setOilTypeChart(chart);
      
      const oilTypeOption = {
        title: {
          text: '各油品类型损耗成本分析',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}元 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: oilTypeStats.filter(item => item.oilType !== '所有油品').map(item => item.oilType)
        },
        toolbox: {
          feature: {
            saveAsImage: { title: '保存为图片' },
            dataView: { title: '数据视图', lang: ['数据视图', '关闭', '刷新'] }
          }
        },
        series: [
          {
            name: '损耗成本',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            data: oilTypeStats.filter(item => item.oilType !== '所有油品').map(item => ({
              value: item.totalCost.toFixed(2),
              name: item.oilType
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            }
          }
        ]
      };
      
      chart.setOption(oilTypeOption);
      
      // 添加点击事件
      chart.on('click', (params) => {
        message.info(`选中了 ${params.name}，损耗成本: ${params.value}元`);
      });
      
      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        chart.resize();
      });
      
      return () => {
        window.removeEventListener('resize', () => {
          chart.resize();
        });
        chart.dispose();
      };
    }
  }, [oilTypeChartRef]);
  
  // 初始化月份图表
  useEffect(() => {
    if (monthChartRef.current) {
      const chart = echarts.init(monthChartRef.current);
      setMonthChart(chart);
      
      const monthOption = {
        title: {
          text: '月度损耗成本趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['损耗量(L)', '平均单价(元/L)', '损耗成本(元)'],
          bottom: '0%'
        },
        toolbox: {
          feature: {
            saveAsImage: { title: '保存为图片' },
            dataView: { title: '数据视图', lang: ['数据视图', '关闭', '刷新'] },
            magicType: { type: ['line', 'bar'], title: { line: '切换为折线图', bar: '切换为柱状图' } }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: monthStats.filter(item => item.month !== '全年').map(item => item.month),
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '损耗量(L)',
            min: 0,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '价格/成本',
            min: 0,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '损耗量(L)',
            type: 'bar',
            data: monthStats.filter(item => item.month !== '全年').map(item => item.totalLossQuantity),
            itemStyle: {
              color: '#5470C6'
            }
          },
          {
            name: '平均单价(元/L)',
            type: 'line',
            yAxisIndex: 1,
            data: monthStats.filter(item => item.month !== '全年').map(item => item.avgPrice),
            itemStyle: {
              color: '#91CC75'
            }
          },
          {
            name: '损耗成本(元)',
            type: 'line',
            yAxisIndex: 1,
            data: monthStats.filter(item => item.month !== '全年').map(item => item.totalCost.toFixed(2)),
            itemStyle: {
              color: '#EE6666'
            }
          }
        ]
      };
      
      chart.setOption(monthOption);
      
      // 添加点击事件
      chart.on('click', (params) => {
        if (params.seriesName === '平均单价(元/L)') {
          message.info(`${params.name} 平均单价: ${params.value}元/L`);
        } else if (params.seriesName === '损耗成本(元)') {
          message.info(`${params.name} 损耗成本: ${params.value}元`);
        } else {
          message.info(`${params.name} 损耗量: ${params.value}L`);
        }
      });
      
      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        chart.resize();
      });
      
      return () => {
        window.removeEventListener('resize', () => {
          chart.resize();
        });
        chart.dispose();
      };
    }
  }, [monthChartRef]);

  const oilTypeColumns = [
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '损耗总量(L)',
      dataIndex: 'totalLossQuantity',
      key: 'totalLossQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '平均单价(元/L)',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
    },
    {
      title: '损耗成本(元)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (text) => <span style={{ color: 'red' }}>{text.toFixed(2)}</span>,
    },
    {
      title: '占比(%)',
      dataIndex: 'proportion',
      key: 'proportion',
      render: (text) => <span>{text}%</span>,
    },
  ];

  const monthColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '损耗总量(L)',
      dataIndex: 'totalLossQuantity',
      key: 'totalLossQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '平均单价(元/L)',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
    },
    {
      title: '损耗成本(元)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (text) => <span style={{ color: 'red' }}>{text.toFixed(2)}</span>,
    },
    {
      title: '占比(%)',
      dataIndex: 'proportion',
      key: 'proportion',
      render: (text) => <span>{text}%</span>,
    },
  ];

  // 处理查询
  const onFinish = (values) => {
    console.log('查询条件:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      message.success('查询成功');
      setLoading(false);
    }, 1000);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
  };

  // 导出数据
  const handleExport = () => {
    setExportLoading(true);
    // 模拟导出过程
    setTimeout(() => {
      message.success('数据导出成功');
      setExportLoading(false);
    }, 1500);
  };

  // 导出图表为图片
  const handleExportChart = () => {
    if (activeTab === 'oilType' && oilTypeChart) {
      const url = oilTypeChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = '按油品类型损耗成本分析.png';
      link.href = url;
      link.click();
      message.success('图表导出成功');
    } else if (activeTab === 'month' && monthChart) {
      const url = monthChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = '月度损耗成本趋势.png';
      link.href = url;
      link.click();
      message.success('图表导出成功');
    }
  };

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本年损耗总量"
              value={6048}
              suffix="L"
              precision={0}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本年平均单价"
              value={8.32}
              suffix="元/L"
              precision={2}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本年损耗成本"
              value={50319.36}
              suffix="元"
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本年平均损耗率"
              value={1.59}
              suffix="%"
              precision={2}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="成本核算">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="dateRange" label="统计日期">
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="station" label="油站">
                <Select style={{ width: '100%' }} placeholder="请选择油站" allowClear>
                  <Option value="station1">油站1</Option>
                  <Option value="station2">油站2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="oilType" label="油品类型">
                <Select style={{ width: '100%' }} placeholder="请选择油品类型" allowClear>
                  <Option value="92#">92#汽油</Option>
                  <Option value="95#">95#汽油</Option>
                  <Option value="98#">98#汽油</Option>
                  <Option value="0#">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                    查询
                  </Button>
                  <Button onClick={onReset} icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item>
                <Space>
                  <Button icon={<DownloadOutlined />} onClick={handleExportChart}>
                    导出图表
                  </Button>
                  <Button icon={<ExportOutlined />} onClick={handleExport} loading={exportLoading}>
                    导出成本数据
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />

        <Tabs defaultActiveKey="oilType" onChange={handleTabChange}>
          <TabPane tab="按油品类型统计" key="oilType">
            <div 
              ref={oilTypeChartRef} 
              style={{ height: 400, marginBottom: 24 }}
            />
            <Table 
              columns={oilTypeColumns} 
              dataSource={oilTypeStats} 
              scroll={{ x: 'max-content' }}
              pagination={{ 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="按月份统计" key="month">
            <div 
              ref={monthChartRef} 
              style={{ height: 400, marginBottom: 24 }}
            />
            <Table 
              columns={monthColumns} 
              dataSource={monthStats} 
              scroll={{ x: 'max-content' }}
              pagination={{ 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default OilLossCost; 