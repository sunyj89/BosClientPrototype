import React from 'react';
import { Card, Form, Input, Button, Table, Space, DatePicker, Select, Tag, Row, Col, Divider } from 'antd';
import { SearchOutlined, PrinterOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OilInputDetail = () => {
  const [form] = Form.useForm();

  // 模拟数据
  const mockData = Array.from({ length: 20 }).map((_, index) => ({
    key: index,
    inputNo: index < 10 ? `IN${String(2023001 + index).padStart(6, '0')}` : `NI${String(2023001 + index - 10).padStart(6, '0')}`,
    inputType: index < 10 ? 'withOrder' : 'withoutOrder',
    deliveryNo: index < 10 ? `DL${String(2023001 + index).padStart(6, '0')}` : '',
    inputDate: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
    station: `油站${(index % 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    quantity: Math.floor(1000 + Math.random() * 9000),
    temperature: (15 + Math.random() * 10).toFixed(1),
    density: (740 + Math.random() * 60).toFixed(1),
    operator: ['张经理', '李主管', '王站长', '赵操作员', '钱技术员'][index % 5],
  }));

  const columns = [
    {
      title: '入库单号',
      dataIndex: 'inputNo',
      key: 'inputNo',
    },
    {
      title: '入库类型',
      dataIndex: 'inputType',
      key: 'inputType',
      render: (text) => {
        if (text === 'withOrder') {
          return <Tag color="green">有单入库</Tag>;
        } else if (text === 'withoutOrder') {
          return <Tag color="orange">无单入库</Tag>;
        }
        return text;
      }
    },
    {
      title: '配送单号',
      dataIndex: 'deliveryNo',
      key: 'deliveryNo',
    },
    {
      title: '入库日期',
      dataIndex: 'inputDate',
      key: 'inputDate',
    },
    {
      title: '油站',
      dataIndex: 'station',
      key: 'station',
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '入库量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '温度(℃)',
      dataIndex: 'temperature',
      key: 'temperature',
    },
    {
      title: '密度(kg/m³)',
      dataIndex: 'density',
      key: 'density',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{ padding: 0 }}>查看</Button>
          <Button type="link" style={{ padding: 0 }}>打印</Button>
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Card title="入库单明细">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item name="inputNo" label="入库单号">
              <Input placeholder="请输入入库单号" prefix={<SearchOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item name="deliveryNo" label="配送单号">
              <Input placeholder="请输入配送单号" prefix={<SearchOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item name="dateRange" label="入库日期">
              <RangePicker style={{ width: '100%' }} />
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
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item name="inputType" label="入库类型">
              <Select style={{ width: '100%' }} placeholder="请选择入库类型" allowClear>
                <Option value="withOrder">有单入库</Option>
                <Option value="withoutOrder">无单入库</Option>
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
              <Space>
                <Button icon={<PrinterOutlined />}>批量打印</Button>
                <Button icon={<ExportOutlined />}>导出数据</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider />

      <Table 
        columns={columns} 
        dataSource={mockData} 
        scroll={{ x: 'max-content' }}
        pagination={{ 
          showSizeChanger: true, 
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />
    </Card>
  );
};

export default OilInputDetail; 