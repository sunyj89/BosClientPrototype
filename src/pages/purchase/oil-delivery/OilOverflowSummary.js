import React, { useEffect, useRef, useState } from 'react';
import { Card, Form, Button, Table, Space, DatePicker, Select, Row, Col, Statistic, Divider, Tabs, message } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, ExportOutlined, SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const OilOverflowSummary = () => {
  const [form] = Form.useForm();
  const oilTypeChartRef = useRef(null);
  const stationChartRef = useRef(null);
  const [oilTypeChart, setOilTypeChart] = useState(null);
  const [stationChart, setStationChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('oilType');

  // 模拟数据 - 按油品类型统计
  const oilTypeStats = [
    {
      key: '1',
      oilType: '92#汽油',
      totalOrders: 45,
      planQuantity: 157000,
      actualQuantity: 159468,
      overflowQuantity: 2468,
      overflowRate: 1.57,
    },
    {
      key: '2',
      oilType: '95#汽油',
      totalOrders: 32,
      planQuantity: 98900,
      actualQuantity: 100542,
      overflowQuantity: 1642,
      overflowRate: 1.66,
    },
    {
      key: '3',
      oilType: '98#汽油',
      totalOrders: 18,
      planQuantity: 45700,
      actualQuantity: 46391,
      overflowQuantity: 691,
      overflowRate: 1.51,
    },
    {
      key: '4',
      oilType: '0#柴油',
      totalOrders: 25,
      planQuantity: 78900,
      actualQuantity: 80147,
      overflowQuantity: 1247,
      overflowRate: 1.58,
    },
    {
      key: '5',
      oilType: '所有油品',
      totalOrders: 120,
      planQuantity: 380500,
      actualQuantity: 386548,
      overflowQuantity: 6048,
      overflowRate: 1.59,
    },
  ];

  // 模拟数据 - 按油站统计
  const stationStats = [
    {
      key: '1',
      station: '站点A',
      totalOrders: 28,
      planQuantity: 95000,
      actualQuantity: 96555,
      overflowQuantity: 1555,
      overflowRate: 1.63,
    },
    {
      key: '2',
      station: '站点B',
      totalOrders: 32,
      planQuantity: 107500,
      actualQuantity: 109456,
      overflowQuantity: 1956,
      overflowRate: 1.82,
    },
    {
      key: '3',
      station: '站点C',
      totalOrders: 25,
      planQuantity: 78900,
      actualQuantity: 80147,
      overflowQuantity: 1247,
      overflowRate: 1.58,
    },
    {
      key: '4',
      station: '站点D',
      totalOrders: 35,
      planQuantity: 99100,
      actualQuantity: 100390,
      overflowQuantity: 1290,
      overflowRate: 1.41,
    },
    {
      key: '5',
      station: '所有站点',
      totalOrders: 120,
      planQuantity: 380500,
      actualQuantity: 386548,
      overflowQuantity: 6048,
      overflowRate: 1.59,
    },
  ];

  // 初始化图表
  useEffect(() => {
    // 初始化油品类型统计图表
    if (oilTypeChartRef.current) {
      const chart = echarts.init(oilTypeChartRef.current);
      setOilTypeChart(chart);
      
      const oilTypeOption = {
        title: {
          text: '按油品类型超溢统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['计划量(L)', '实际量(L)', '超溢量(L)', '超溢率(%)'],
          bottom: '0%'
        },
        toolbox: {
          feature: {
            saveAsImage: { title: '保存为图片' },
            dataView: { title: '数据视图', lang: ['数据视图', '关闭', '刷新'] },
            magicType: { type: ['line', 'bar', 'stack'], title: { line: '切换为折线图', bar: '切换为柱状图', stack: '切换为堆叠' } }
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
          data: oilTypeStats.filter(item => item.oilType !== '所有油品').map(item => item.oilType)
        },
        yAxis: [
          {
            type: 'value',
            name: '数量(L)',
            min: 0,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '超溢率(%)',
            min: 0,
            max: 3,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '计划量(L)',
            type: 'bar',
            data: oilTypeStats.filter(item => item.oilType !== '所有油品').map(item => item.planQuantity),
            itemStyle: {
              color: '#91CC75'
            }
          },
          {
            name: '实际量(L)',
            type: 'bar',
            data: oilTypeStats.filter(item => item.oilType !== '所有油品').map(item => item.actualQuantity),
            itemStyle: {
              color: '#5470C6'
            }
          },
          {
            name: '超溢量(L)',
            type: 'bar',
            data: oilTypeStats.filter(item => item.oilType !== '所有油品').map(item => item.overflowQuantity),
            itemStyle: {
              color: '#FAC858'
            }
          },
          {
            name: '超溢率(%)',
            type: 'line',
            yAxisIndex: 1,
            data: oilTypeStats.filter(item => item.oilType !== '所有油品').map(item => item.overflowRate),
            itemStyle: {
              color: '#EE6666'
            }
          }
        ]
      };
      
      chart.setOption(oilTypeOption);
      
      // 添加点击事件
      chart.on('click', (params) => {
        if (params.seriesName === '超溢率(%)') {
          message.info(`${params.name} 超溢率: ${params.value}%`);
        } else {
          message.info(`${params.name} ${params.seriesName}: ${params.value}L`);
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
  }, [oilTypeChartRef]);
  
  // 初始化油站统计图表
  useEffect(() => {
    if (stationChartRef.current) {
      const chart = echarts.init(stationChartRef.current);
      setStationChart(chart);
      
      const stationOption = {
        title: {
          text: '按油站超溢统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: stationStats.filter(item => item.station !== '所有站点').map(item => item.station)
        },
        toolbox: {
          feature: {
            saveAsImage: { title: '保存为图片' },
            dataView: { title: '数据视图', lang: ['数据视图', '关闭', '刷新'] }
          }
        },
        series: [
          {
            name: '超溢量',
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
            data: stationStats.filter(item => item.station !== '所有站点').map(item => ({
              value: item.overflowQuantity,
              name: item.station
            }))
          }
        ]
      };
      
      chart.setOption(stationOption);
      
      // 添加点击事件
      chart.on('click', (params) => {
        message.info(`选中了 ${params.name}，超溢量: ${params.value}L`);
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
  }, [stationChartRef]);

  const oilTypeColumns = [
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '订单数量',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
    {
      title: '计划量(L)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
    },
    {
      title: '实际量(L)',
      dataIndex: 'actualQuantity',
      key: 'actualQuantity',
    },
    {
      title: '超溢量(L)',
      dataIndex: 'overflowQuantity',
      key: 'overflowQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '超溢率(%)',
      dataIndex: 'overflowRate',
      key: 'overflowRate',
      render: (text) => <span style={{ color: 'red' }}>{text}%</span>,
    },
  ];

  const stationColumns = [
    {
      title: '油站',
      dataIndex: 'station',
      key: 'station',
    },
    {
      title: '订单数量',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
    {
      title: '计划量(L)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
    },
    {
      title: '实际量(L)',
      dataIndex: 'actualQuantity',
      key: 'actualQuantity',
    },
    {
      title: '超溢量(L)',
      dataIndex: 'overflowQuantity',
      key: 'overflowQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '超溢率(%)',
      dataIndex: 'overflowRate',
      key: 'overflowRate',
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
    if (activeTab === 'oilType' && oilTypeChart) {
      const url = oilTypeChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = '按油品类型超溢统计.png';
      link.href = url;
      link.click();
      message.success('图表导出成功');
    } else if (activeTab === 'station' && stationChart) {
      const url = stationChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = '按油站超溢统计.png';
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
              title="本月超溢订单总数"
              value={103}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月超溢总量"
              value={3652}
              suffix="L"
              precision={0}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: 'green' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月平均超溢率"
              value={1.09}
              suffix="%"
              precision={2}
              prefix={<PieChartOutlined />}
              valueStyle={{ color: 'green' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月超溢金额"
              value={30384}
              suffix="元"
              precision={2}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: 'green' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="超溢汇总">
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
                    导出汇总数据
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
          <TabPane tab="按油站统计" key="station">
            <div 
              ref={stationChartRef} 
              style={{ height: 400, marginBottom: 24 }}
            />
            <Table 
              columns={stationColumns} 
              dataSource={stationStats} 
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

export default OilOverflowSummary; 