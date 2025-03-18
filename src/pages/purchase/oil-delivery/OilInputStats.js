import React from 'react';
import { Card, Form, Button, Table, Space, DatePicker, Select, Row, Col, Statistic, Divider } from 'antd';
import { SearchOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OilInputStats = () => {
  const [form] = Form.useForm();

  // 模拟数据
  const mockData = [
    {
      key: '1',
      oilType: '92#汽油',
      totalQuantity: 156789,
      totalTimes: 32,
      avgQuantity: 4899.66,
      maxQuantity: 8500,
      minQuantity: 2100,
    },
    {
      key: '2',
      oilType: '95#汽油',
      totalQuantity: 98765,
      totalTimes: 25,
      avgQuantity: 3950.60,
      maxQuantity: 7800,
      minQuantity: 1800,
    },
    {
      key: '3',
      oilType: '98#汽油',
      totalQuantity: 45678,
      totalTimes: 15,
      avgQuantity: 3045.20,
      maxQuantity: 5500,
      minQuantity: 1500,
    },
    {
      key: '4',
      oilType: '0#柴油',
      totalQuantity: 78901,
      totalTimes: 17,
      avgQuantity: 4641.24,
      maxQuantity: 7200,
      minQuantity: 2300,
    },
    {
      key: '5',
      oilType: '所有油品',
      totalQuantity: 380133,
      totalTimes: 89,
      avgQuantity: 4270.03,
      maxQuantity: 8500,
      minQuantity: 1500,
    },
  ];

  const columns = [
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '入库总量(L)',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: '入库总次数',
      dataIndex: 'totalTimes',
      key: 'totalTimes',
    },
    {
      title: '平均单次入库量(L)',
      dataIndex: 'avgQuantity',
      key: 'avgQuantity',
    },
    {
      title: '最大单次入库量(L)',
      dataIndex: 'maxQuantity',
      key: 'maxQuantity',
    },
    {
      title: '最小单次入库量(L)',
      dataIndex: 'minQuantity',
      key: 'minQuantity',
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
              title="本月入库总量"
              value={380133}
              suffix="L"
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月入库次数"
              value={89}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月平均单次入库量"
              value={4270.03}
              suffix="L"
              precision={2}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="本月最大单次入库量"
              value={8500}
              suffix="L"
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="入库统计">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item name="dateRange" label="统计日期">
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item name="station" label="油站">
                <Select style={{ width: '100%' }} placeholder="请选择油站" allowClear>
                  <Option value="station1">油站1</Option>
                  <Option value="station2">油站2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
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
                    统计
                  </Button>
                  <Button onClick={onReset} icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item>
                <Button type="primary" icon={<ExportOutlined />}>
                  导出统计数据
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />

        <Table 
          columns={columns} 
          dataSource={mockData} 
          scroll={{ x: 'max-content' }}
          pagination={false}
          size="middle"
          bordered
        />
      </Card>
    </div>
  );
};

export default OilInputStats; 