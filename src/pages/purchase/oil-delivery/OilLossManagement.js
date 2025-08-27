import React from 'react';
import { Card, Form, Input, Button, Table, Space, DatePicker, Select, Tabs, Tag } from 'antd';
import { SearchOutlined, LineChartOutlined, ExportOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const OilLossManagement = () => {
  const [form] = Form.useForm();

  // 模拟数据 - 损耗记录
  const lossRecords = Array.from({ length: 20 }).map((_, index) => ({
    key: index,
    recordNo: `LS${String(2023001 + index).padStart(6, '0')}`,
    recordDate: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
    station: `油站${(index % 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    lossQuantity: Math.floor(50 + Math.random() * 200),
    reason: ['蒸发损耗', '测量误差', '温度变化', '泄漏损失', '其他原因'][index % 5],
    status: ['pending', 'processing', 'completed', 'rejected'][index % 4],
  }));

  // 模拟数据 - 损耗统计
  const lossStats = [
    {
      key: '1',
      station: '油站1',
      oilType: '92#汽油',
      totalLoss: 568,
      lossCount: 8,
      avgLoss: 71.0,
      percentage: 0.32,
    },
    {
      key: '2',
      station: '油站1',
      oilType: '95#汽油',
      totalLoss: 423,
      lossCount: 6,
      avgLoss: 70.5,
      percentage: 0.28,
    },
    {
      key: '3',
      station: '油站2',
      oilType: '92#汽油',
      totalLoss: 612,
      lossCount: 9,
      avgLoss: 68.0,
      percentage: 0.35,
    },
    {
      key: '4',
      station: '油站2',
      oilType: '0#柴油',
      totalLoss: 487,
      lossCount: 7,
      avgLoss: 69.6,
      percentage: 0.30,
    },
    {
      key: '5',
      station: '油站3',
      oilType: '98#汽油',
      totalLoss: 356,
      lossCount: 5,
      avgLoss: 71.2,
      percentage: 0.25,
    },
  ];

  const columns = [
    {
      title: '记录编号',
      dataIndex: 'recordNo',
      key: 'recordNo',
    },
    {
      title: '记录日期',
      dataIndex: 'recordDate',
      key: 'recordDate',
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
      title: '损耗数量(L)',
      dataIndex: 'lossQuantity',
      key: 'lossQuantity',
    },
    {
      title: '损耗原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === 'pending') {
          return <Tag color="blue">待处理</Tag>;
        } else if (text === 'processing') {
          return <Tag color="orange">处理中</Tag>;
        } else if (text === 'completed') {
          return <Tag color="green">已处理</Tag>;
        } else if (text === 'rejected') {
          return <Tag color="red">已驳回</Tag>;
        }
        return text;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>查看</a>
          <a>处理</a>
          <a>审批</a>
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Card title="油品损耗管理">
      <Tabs defaultActiveKey="1">
        <TabPane tab="损耗记录" key="1">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Space style={{ marginBottom: 16 }} size="large">
              <Form.Item name="recordNo" label="记录编号">
                <Input placeholder="请输入记录编号" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="dateRange" label="记录日期">
                <RangePicker />
              </Form.Item>
              <Form.Item name="station" label="油站">
                <Select style={{ width: 200 }} placeholder="请选择油站">
                  <Option value="station1">油站1</Option>
                  <Option value="station2">油站2</Option>
                </Select>
              </Form.Item>
              <Form.Item name="oilType" label="油品类型">
                <Select style={{ width: 120 }} placeholder="油品类型">
                  <Option value="92#">92#汽油</Option>
                  <Option value="95#">95#汽油</Option>
                  <Option value="98#">98#汽油</Option>
                  <Option value="0#">0#柴油</Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="处理状态">
                <Select style={{ width: 120 }} placeholder="处理状态">
                  <Option value="pending">待处理</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="completed">已处理</Option>
                  <Option value="rejected">已驳回</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>
            </Space>
          </Form>

          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<LineChartOutlined />}>
              损耗分析
            </Button>
            <Button icon={<ExportOutlined />}>
              导出数据
            </Button>
          </Space>

          <Table columns={columns} dataSource={lossRecords} />
        </TabPane>
        
        <TabPane tab="损耗统计" key="2">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Space style={{ marginBottom: 16 }} size="large">
              <Form.Item name="dateRange" label="统计日期">
                <RangePicker />
              </Form.Item>
              <Form.Item name="station" label="油站">
                <Select style={{ width: 200 }} placeholder="请选择油站">
                  <Option value="station1">油站1</Option>
                  <Option value="station2">油站2</Option>
                  <Option value="all">所有油站</Option>
                </Select>
              </Form.Item>
              <Form.Item name="oilType" label="油品类型">
                <Select style={{ width: 120 }} placeholder="油品类型">
                  <Option value="92#">92#汽油</Option>
                  <Option value="95#">95#汽油</Option>
                  <Option value="98#">98#汽油</Option>
                  <Option value="0#">0#柴油</Option>
                  <Option value="all">所有油品</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  统计
                </Button>
              </Form.Item>
            </Space>
          </Form>

          <Table 
            columns={[
              { title: '油站', dataIndex: 'station', key: 'station' },
              { title: '油品类型', dataIndex: 'oilType', key: 'oilType' },
              { title: '损耗总量(L)', dataIndex: 'totalLoss', key: 'totalLoss' },
              { title: '损耗次数', dataIndex: 'lossCount', key: 'lossCount' },
              { title: '平均损耗量(L)', dataIndex: 'avgLoss', key: 'avgLoss' },
              { title: '占总入库量比例', dataIndex: 'percentage', key: 'percentage', render: (text) => `${text}%` },
            ]} 
            dataSource={lossStats} 
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default OilLossManagement; 