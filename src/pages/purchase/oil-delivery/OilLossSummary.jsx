import React, { useEffect, useRef } from 'react';
import { Card, Form, Button, Table, Space, DatePicker, Select, Row, Col, Statistic, Divider, Tabs } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, ExportOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const OilLossSummary = () => {
  const [form] = Form.useForm();
  const oilTypeChartRef = useRef(null);
  const stationChartRef = useRef(null);

  // 模拟数据 - 按油品类型统计
  const oilTypeStats = [
    {
      key: '1',
      oilType: '92#汽油',
      totalOrders: 45,
      totalPlanQuantity: 156789,
      totalActualQuantity: 154321,
      totalLossQuantity: 2468,
      avgLossRate: 1.57,
    },
    {
      key: '2',
      oilType: '95#汽油',
      totalOrders: 32,
      totalPlanQuantity: 98765,
      totalActualQuantity: 97123,
      totalLossQuantity: 1642,
      avgLossRate: 1.66,
    },
    {
      key: '3',
      oilType: '98#汽油',
      totalOrders: 18,
      totalPlanQuantity: 45678,
      totalActualQuantity: 44987,
      totalLossQuantity: 691,
      avgLossRate: 1.51,
    },
    {
      key: '4',
      oilType: '0#柴油',
      totalOrders: 25,
      totalPlanQuantity: 78901,
      totalActualQuantity: 77654,
      totalLossQuantity: 1247,
      avgLossRate: 1.58,
    },
    {
      key: '5',
      oilType: '所有油品',
      totalOrders: 120,
      totalPlanQuantity: 380133,
      totalActualQuantity: 374085,
      totalLossQuantity: 6048,
      avgLossRate: 1.59,
    },
  ];

  // 模拟数据 - 按油站统计
  const stationStats = [
    {
      key: '1',
      station: '油站1',
      totalOrders: 28,
      totalPlanQuantity: 95678,
      totalActualQuantity: 94123,
      totalLossQuantity: 1555,
      avgLossRate: 1.63,
    },
    {
      key: '2',
      station: '油站2',
      totalOrders: 32,
      totalPlanQuantity: 102345,
      totalActualQuantity: 100789,
      totalLossQuantity: 1556,
      avgLossRate: 1.52,
    },
    {
      key: '3',
      station: '油站3',
      totalOrders: 25,
      totalPlanQuantity: 78901,
      totalActualQuantity: 77654,
      totalLossQuantity: 1247,
      avgLossRate: 1.58,
    },
    {
      key: '4',
      station: '油站4',
      totalOrders: 18,
      totalPlanQuantity: 56789,
      totalActualQuantity: 55876,
      totalLossQuantity: 913,
      avgLossRate: 1.61,
    },
    {
      key: '5',
      station: '油站5',
      totalOrders: 17,
      totalPlanQuantity: 46420,
      totalActualQuantity: 45643,
      totalLossQuantity: 777,
      avgLossRate: 1.67,
    },
  ];

  // 初始化油品类型图表
  useEffect(() => {
    if (oilTypeChartRef.current) {
      const oilTypeChart = echarts.init(oilTypeChartRef.current);
      
      const oilTypeOption = {
        title: {
          text: '各油品类型损耗情况',
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: oilTypeStats.map(item => item.oilType)
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
            data: oilTypeStats.map(item => item.totalLossQuantity),
            itemStyle: {
              color: '#5470C6'
            }
          },
          {
            name: '平均损耗率(%)',
            type: 'line',
            yAxisIndex: 1,
            data: oilTypeStats.map(item => item.avgLossRate),
            itemStyle: {
              color: '#EE6666'
            }
          }
        ]
      };
      
      oilTypeChart.setOption(oilTypeOption);
      
      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        oilTypeChart.resize();
      });
      
      return () => {
        window.removeEventListener('resize', () => {
          oilTypeChart.resize();
        });
        oilTypeChart.dispose();
      };
    }
  }, [oilTypeChartRef]);
  
  // 初始化油站图表
  useEffect(() => {
    if (stationChartRef.current) {
      const stationChart = echarts.init(stationChartRef.current);
      
      const stationOption = {
        title: {
          text: '各油站损耗情况',
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: stationStats.map(item => item.station),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
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
            data: stationStats.map(item => item.totalLossQuantity),
            itemStyle: {
              color: '#91CC75'
            }
          },
          {
            name: '平均损耗率(%)',
            type: 'line',
            yAxisIndex: 1,
            data: stationStats.map(item => item.avgLossRate),
            itemStyle: {
              color: '#EE6666'
            }
          }
        ]
      };
      
      stationChart.setOption(stationOption);
      
      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        stationChart.resize();
      });
      
      return () => {
        window.removeEventListener('resize', () => {
          stationChart.resize();
        });
        stationChart.dispose();
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
      title: '订单总数',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
    {
      title: '计划总量(L)',
      dataIndex: 'totalPlanQuantity',
      key: 'totalPlanQuantity',
    },
    {
      title: '实际总量(L)',
      dataIndex: 'totalActualQuantity',
      key: 'totalActualQuantity',
    },
    {
      title: '损耗总量(L)',
      dataIndex: 'totalLossQuantity',
      key: 'totalLossQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '平均损耗率(%)',
      dataIndex: 'avgLossRate',
      key: 'avgLossRate',
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
      title: '订单总数',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
    {
      title: '计划总量(L)',
      dataIndex: 'totalPlanQuantity',
      key: 'totalPlanQuantity',
    },
    {
      title: '实际总量(L)',
      dataIndex: 'totalActualQuantity',
      key: 'totalActualQuantity',
    },
    {
      title: '损耗总量(L)',
      dataIndex: 'totalLossQuantity',
      key: 'totalLossQuantity',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '平均损耗率(%)',
      dataIndex: 'avgLossRate',
      key: 'avgLossRate',
      render: (text) => <span style={{ color: 'red' }}>{text}%</span>,
    },
  ];

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月损耗订单总数"
              value={120}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月损耗总量"
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
              title="本月平均损耗率"
              value={1.59}
              suffix="%"
              precision={2}
              prefix={<PieChartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月损耗金额"
              value={48384}
              suffix="元"
              precision={2}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="损耗汇总">
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
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
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
                <Button icon={<ExportOutlined />}>
                  导出统计数据
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />

        <Tabs defaultActiveKey="oilType">
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
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default OilLossSummary; 