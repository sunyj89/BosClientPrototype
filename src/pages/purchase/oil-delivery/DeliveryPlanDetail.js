import React from 'react';
import { Card, Form, Input, Button, Table, Space, DatePicker, Select, Tag, Descriptions, Divider, Row, Col } from 'antd';
import { SearchOutlined, FileTextOutlined, PrinterOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DeliveryPlanDetail = () => {
  const [form] = Form.useForm();

  // 模拟数据
  const mockData = Array.from({ length: 20 }).map((_, index) => ({
    key: index,
    detailId: `DPD${String(2023001 + index).padStart(6, '0')}`,
    planNo: `DP${String(2023001 + Math.floor(index / 4)).padStart(6, '0')}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    planQuantity: Math.floor(1000 + Math.random() * 3000),
    actualQuantity: Math.floor(900 + Math.random() * 3000),
    tankNo: `${(index % 5) + 1}号油罐`,
    deliveryTime: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
    status: ['待配送', '配送中', '已完成', '已取消'][index % 4],
    remark: index % 3 === 0 ? '紧急配送' : '',
  }));

  const columns = [
    {
      title: '明细编号',
      dataIndex: 'detailId',
      key: 'detailId',
    },
    {
      title: '计划单号',
      dataIndex: 'planNo',
      key: 'planNo',
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '计划配送量(L)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
    },
    {
      title: '实际配送量(L)',
      dataIndex: 'actualQuantity',
      key: 'actualQuantity',
    },
    {
      title: '目标油罐',
      dataIndex: 'tankNo',
      key: 'tankNo',
    },
    {
      title: '配送时间',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
    },
    {
      title: '配送状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === '待配送') {
          return <Tag color="blue">{text}</Tag>;
        } else if (text === '配送中') {
          return <Tag color="orange">{text}</Tag>;
        } else if (text === '已完成') {
          return <Tag color="green">{text}</Tag>;
        } else if (text === '已取消') {
          return <Tag color="red">{text}</Tag>;
        }
        return text;
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">打印</Button>
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
    <div>
      <Card title="配送计划明细">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="planNo" label="申请单号">
                <Input placeholder="请输入申请单号" prefix={<SearchOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="dateRange" label="申请日期">
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
                <Space>
                  <Button icon={<PrinterOutlined />}>
                    批量打印
                  </Button>
                  <Button icon={<ExportOutlined />}>
                    导出
                  </Button>
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
    </div>
  );
};

export default DeliveryPlanDetail; 