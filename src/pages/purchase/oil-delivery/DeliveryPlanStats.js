import React from 'react';
import { Card, Form, Button, Table, Space, DatePicker, Select, Row, Col, Statistic, Divider, Tabs } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, ExportOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const DeliveryPlanStats = () => {
  const [form] = Form.useForm();

  // 模拟数据 - 按油品类型统计
  const oilTypeStats = [
    {
      key: '1',
      oilType: '92#汽油',
      totalPlans: 45,
      totalQuantity: 156789,
      avgQuantity: 3484.2,
      completedPlans: 38,
      completionRate: 84.4,
    },
    {
      key: '2',
      oilType: '95#汽油',
      totalPlans: 32,
      totalQuantity: 98765,
      avgQuantity: 3086.4,
      completedPlans: 28,
      completionRate: 87.5,
    },
    {
      key: '3',
      oilType: '98#汽油',
      totalPlans: 18,
      totalQuantity: 45678,
      avgQuantity: 2537.7,
      completedPlans: 15,
      completionRate: 83.3,
    },
    {
      key: '4',
      oilType: '0#柴油',
      totalPlans: 25,
      totalQuantity: 78901,
      avgQuantity: 3156.0,
      completedPlans: 22,
      completionRate: 88.0,
    },
    {
      key: '5',
      oilType: '所有油品',
      totalPlans: 120,
      totalQuantity: 380133,
      avgQuantity: 3167.8,
      completedPlans: 103,
      completionRate: 85.8,
    },
  ];

  // 模拟数据 - 按油站统计
  const stationStats = [
    {
      key: '1',
      station: '油站1',
      totalPlans: 28,
      totalQuantity: 95678,
      avgQuantity: 3417.1,
      completedPlans: 24,
      completionRate: 85.7,
    },
    {
      key: '2',
      station: '油站2',
      totalPlans: 32,
      totalQuantity: 102345,
      avgQuantity: 3198.3,
      completedPlans: 27,
      completionRate: 84.4,
    },
    {
      key: '3',
      station: '油站3',
      totalPlans: 25,
      totalQuantity: 78901,
      avgQuantity: 3156.0,
      completedPlans: 22,
      completionRate: 88.0,
    },
    {
      key: '4',
      station: '油站4',
      totalPlans: 18,
      totalQuantity: 56789,
      avgQuantity: 3154.9,
      completedPlans: 16,
      completionRate: 88.9,
    },
    {
      key: '5',
      station: '油站5',
      totalPlans: 17,
      totalQuantity: 46420,
      avgQuantity: 2730.6,
      completedPlans: 14,
      completionRate: 82.4,
    },
  ];

  const oilTypeColumns = [
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '计划总数',
      dataIndex: 'totalPlans',
      key: 'totalPlans',
    },
    {
      title: '计划配送总量(L)',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: '平均配送量(L)',
      dataIndex: 'avgQuantity',
      key: 'avgQuantity',
    },
    {
      title: '已完成计划数',
      dataIndex: 'completedPlans',
      key: 'completedPlans',
    },
    {
      title: '完成率(%)',
      dataIndex: 'completionRate',
      key: 'completionRate',
    },
  ];

  const stationColumns = [
    {
      title: '油站',
      dataIndex: 'station',
      key: 'station',
    },
    {
      title: '计划总数',
      dataIndex: 'totalPlans',
      key: 'totalPlans',
    },
    {
      title: '计划配送总量(L)',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: '平均配送量(L)',
      dataIndex: 'avgQuantity',
      key: 'avgQuantity',
    },
    {
      title: '已完成计划数',
      dataIndex: 'completedPlans',
      key: 'completedPlans',
    },
    {
      title: '完成率(%)',
      dataIndex: 'completionRate',
      key: 'completionRate',
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
              title="本月计划总数"
              value={120}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月计划配送总量"
              value={380133}
              suffix="L"
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月计划完成率"
              value={85.8}
              suffix="%"
              precision={1}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月平均配送量"
              value={3167.8}
              suffix="L"
              precision={1}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="配送计划统计">
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

export default DeliveryPlanStats; 