import React, { useEffect, useRef, useState } from 'react';
import { Card, Form, Button, Table, Space, DatePicker, Select, Row, Col, Divider, Tabs, message } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined, DownloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const OilLossAnalysis = () => {
  const [form] = Form.useForm();
  const reasonChartRef = useRef(null);
  const seasonChartRef = useRef(null);
  const [reasonChart, setReasonChart] = useState(null);
  const [seasonChart, setSeasonChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('reason');

  // 模拟数据 - 损失原因分析
  const reasonStats = [
    {
      key: '1',
      reason: '温度变化',
      totalOrders: 45,
      totalLossQuantity: 2468,
      proportion: 40.8,
      avgLossRate: 1.57,
    },
    {
      key: '2',
      reason: '运输过程',
      totalOrders: 32,
      totalLossQuantity: 1642,
      proportion: 27.1,
      avgLossRate: 1.66,
    },
    {
      key: '3',
      reason: '计量误差',
      totalOrders: 18,
      totalLossQuantity: 691,
      proportion: 11.4,
      avgLossRate: 1.51,
    },
    {
      key: '4',
      reason: '蒸发损耗',
      totalOrders: 25,
      totalLossQuantity: 1247,
      proportion: 20.6,
      avgLossRate: 1.58,
    },
    {
      key: '5',
      reason: '所有原因',
      totalOrders: 120,
      totalLossQuantity: 6048,
      proportion: 100.0,
      avgLossRate: 1.59,
    },
  ];

  // 模拟数据 - 季节性分析
  const seasonStats = [
    {
      key: '1',
      season: '春季',
      totalOrders: 28,
      totalLossQuantity: 1555,
      proportion: 25.7,
      avgLossRate: 1.63,
    },
    {
      key: '2',
      season: '夏季',
      totalOrders: 32,
      totalLossQuantity: 1956,
      proportion: 32.3,
      avgLossRate: 1.82,
    },
    {
      key: '3',
      season: '秋季',
      totalOrders: 25,
      totalLossQuantity: 1247,
      proportion: 20.6,
      avgLossRate: 1.58,
    },
    {
      key: '4',
      season: '冬季',
      totalOrders: 35,
      totalLossQuantity: 1290,
      proportion: 21.3,
      avgLossRate: 1.41,
    },
    {
      key: '5',
      season: '全年',
      totalOrders: 120,
      totalLossQuantity: 6048,
      proportion: 100.0,
      avgLossRate: 1.59,
    },
  ];

  // 初始化图表
  useEffect(() => {
    // 初始化损失原因分析图表
    if (reasonChartRef.current) {
      const chart = echarts.init(reasonChartRef.current);
      setReasonChart(chart);
      
      const reasonOption = {
        title: {
          text: '损失原因分析',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: reasonStats.map(item => item.reason)
        },
        toolbox: {
          feature: {
            saveAsImage: { title: '保存为图片' },
            dataView: { title: '数据视图', lang: ['数据视图', '关闭', '刷新'] }
          }
        },
        series: [
          {
            name: '损失原因',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
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
            data: reasonStats.map(item => ({
              value: item.totalLossQuantity,
              name: item.reason
            }))
          }
        ]
      };
      
      chart.setOption(reasonOption);
      
      // 添加点击事件
      chart.on('click', (params) => {
        message.info(`选中了 ${params.name}，损耗量: ${params.value}L`);
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
  }, [reasonChartRef]);
  
  // 初始化季节性分析图表
  useEffect(() => {
    if (seasonChartRef.current) {
      const chart = echarts.init(seasonChartRef.current);
      setSeasonChart(chart);
      
      const seasonOption = {
        title: {
          text: '季节性损耗分析',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['损耗量(L)', '平均损耗率(%)'],
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
        xAxis: {
          type: 'category',
          data: seasonStats.map(item => item.season)
        },
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
            name: '损耗率(%)',
            min: 0,
            max: 3,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '损耗量(L)',
            type: 'bar',
            data: seasonStats.map(item => item.totalLossQuantity),
            itemStyle: {
              color: '#5470C6'
            }
          },
          {
            name: '平均损耗率(%)',
            type: 'line',
            yAxisIndex: 1,
            data: seasonStats.map(item => item.avgLossRate),
            itemStyle: {
              color: '#EE6666'
            }
          }
        ]
      };
      
      chart.setOption(seasonOption);
      
      // 添加点击事件
      chart.on('click', (params) => {
        if (params.seriesType === 'bar') {
          message.info(`选中了 ${params.name}，损耗量: ${params.value}L`);
        } else {
          message.info(`选中了 ${params.name}，损耗率: ${params.value}%`);
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
  }, [seasonChartRef]);

  const reasonColumns = [
    {
      title: '损失原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '订单数量',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
    {
      title: '损耗总量(L)',
      dataIndex: 'totalLossQuantity',
      key: 'totalLossQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '占比(%)',
      dataIndex: 'proportion',
      key: 'proportion',
      render: (text) => <span>{text}%</span>,
    },
    {
      title: '平均损耗率(%)',
      dataIndex: 'avgLossRate',
      key: 'avgLossRate',
      render: (text) => <span style={{ color: 'red' }}>{text}%</span>,
    },
  ];

  const seasonColumns = [
    {
      title: '季节',
      dataIndex: 'season',
      key: 'season',
    },
    {
      title: '订单数量',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
    {
      title: '损耗总量(L)',
      dataIndex: 'totalLossQuantity',
      key: 'totalLossQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '占比(%)',
      dataIndex: 'proportion',
      key: 'proportion',
      render: (text) => <span>{text}%</span>,
    },
    {
      title: '平均损耗率(%)',
      dataIndex: 'avgLossRate',
      key: 'avgLossRate',
      render: (text) => <span style={{ color: 'red' }}>{text}%</span>,
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
    if (activeTab === 'reason' && reasonChart) {
      const url = reasonChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = '损失原因分析.png';
      link.href = url;
      link.click();
      message.success('图表导出成功');
    } else if (activeTab === 'season' && seasonChart) {
      const url = seasonChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = '季节性损耗分析.png';
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
      <Card title="损失分析">
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
                    导出分析数据
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />

        <Tabs defaultActiveKey="reason" onChange={handleTabChange}>
          <TabPane tab="按损失原因分析" key="reason">
            <div 
              ref={reasonChartRef} 
              style={{ height: 400, marginBottom: 24 }}
            />
            <Table 
              columns={reasonColumns} 
              dataSource={reasonStats} 
              scroll={{ x: 'max-content' }}
              pagination={{ 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="按季节分析" key="season">
            <div 
              ref={seasonChartRef} 
              style={{ height: 400, marginBottom: 24 }}
            />
            <Table 
              columns={seasonColumns} 
              dataSource={seasonStats} 
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

export default OilLossAnalysis; 