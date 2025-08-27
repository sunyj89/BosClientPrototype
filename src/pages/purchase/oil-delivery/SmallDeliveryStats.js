import React from 'react';
import { Card, Form, Button, Table, Space, DatePicker, Select, Row, Col, Statistic, Divider, Tabs } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, ExportOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const SmallDeliveryStats = () => {
  const [form] = Form.useForm();

  // 模拟数据 - 按油品类型统计
  const oilTypeStats = [
    {
      key: '1',
      oilType: '92#汽油',
      totalDeliveries: 28,
      totalQuantity: 32560,
      avgQuantity: 1162.9,
      completedDeliveries: 25,
      completionRate: 89.3,
    },
    {
      key: '2',
      oilType: '95#汽油',
      totalDeliveries: 22,
      totalQuantity: 24780,
      avgQuantity: 1126.4,
      completedDeliveries: 20,
      completionRate: 90.9,
    },
    {
      key: '3',
      oilType: '98#汽油',
      totalDeliveries: 15,
      totalQuantity: 16850,
      avgQuantity: 1123.3,
      completedDeliveries: 13,
      completionRate: 86.7,
    },
    {
      key: '4',
      oilType: '0#柴油',
      totalDeliveries: 18,
      totalQuantity: 21450,
      avgQuantity: 1191.7,
      completedDeliveries: 16,
      completionRate: 88.9,
    },
    {
      key: '5',
      oilType: '所有油品',
      totalDeliveries: 83,
      totalQuantity: 95640,
      avgQuantity: 1152.3,
      completedDeliveries: 74,
      completionRate: 89.2,
    },
  ];

  // 模拟数据 - 按油站统计
  const stationStats = [
    {
      key: '1',
      station: '油站1',
      totalDeliveries: 18,
      totalQuantity: 20560,
      avgQuantity: 1142.2,
      completedDeliveries: 16,
      completionRate: 88.9,
    },
    {
      key: '2',
      station: '油站2',
      totalDeliveries: 22,
      totalQuantity: 25780,
      avgQuantity: 1171.8,
      completedDeliveries: 20,
      completionRate: 90.9,
    },
    {
      key: '3',
      station: '油站3',
      totalDeliveries: 15,
      totalQuantity: 17450,
      avgQuantity: 1163.3,
      completedDeliveries: 13,
      completionRate: 86.7,
    },
    {
      key: '4',
      station: '油站4',
      totalDeliveries: 16,
      totalQuantity: 18350,
      avgQuantity: 1146.9,
      completedDeliveries: 14,
      completionRate: 87.5,
    },
    {
      key: '5',
      station: '油站5',
      totalDeliveries: 12,
      totalQuantity: 13500,
      avgQuantity: 1125.0,
      completedDeliveries: 11,
      completionRate: 91.7,
    },
  ];

  const oilTypeColumns = [
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '配送总数',
      dataIndex: 'totalDeliveries',
      key: 'totalDeliveries',
    },
    {
      title: '配送总量(L)',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: '平均配送量(L)',
      dataIndex: 'avgQuantity',
      key: 'avgQuantity',
    },
    {
      title: '已完成配送数',
      dataIndex: 'completedDeliveries',
      key: 'completedDeliveries',
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
      title: '配送总数',
      dataIndex: 'totalDeliveries',
      key: 'totalDeliveries',
    },
    {
      title: '配送总量(L)',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: '平均配送量(L)',
      dataIndex: 'avgQuantity',
      key: 'avgQuantity',
    },
    {
      title: '已完成配送数',
      dataIndex: 'completedDeliveries',
      key: 'completedDeliveries',
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
              title="本月小额配送总数"
              value={83}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月小额配送总量"
              value={95640}
              suffix="L"
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月配送完成率"
              value={89.2}
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
              value={1152.3}
              suffix="L"
              precision={1}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="小车配送统计">
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

export default SmallDeliveryStats; 