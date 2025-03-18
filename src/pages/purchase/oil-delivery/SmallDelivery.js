import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, Space, DatePicker, Select, Modal, Alert, Row, Col, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const SmallDelivery = () => {
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [visible, setVisible] = useState(false);

  // 模拟数据
  const mockData = Array.from({ length: 20 }).map((_, index) => ({
    key: index,
    recordNo: `SD${String(2023001 + index).padStart(6, '0')}`,
    recordDate: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
    station: `油站${(index % 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    quantity: Math.floor(500 + Math.random() * 1500),
    vehicle: `京A${String(Math.floor(10000 + Math.random() * 90000)).substring(0, 5)}`,
    driver: ['张三', '李四', '王五', '赵六', '钱七'][index % 5],
    phone: `1${Math.floor(3 + Math.random() * 6)}${String(Math.floor(100000000 + Math.random() * 900000000)).substring(0, 9)}`,
    status: ['待配送', '配送中', '已完成', '已取消'][index % 4],
  }));

  const columns = [
    {
      title: '登记单号',
      dataIndex: 'recordNo',
      key: 'recordNo',
    },
    {
      title: '登记日期',
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
      title: '配送量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '配送车辆',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: '司机',
      dataIndex: 'driver',
      key: 'driver',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '配送状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">确认</Button>
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

  const onRegisterFinish = (values) => {
    console.log('Register form values:', values);
    setVisible(false);
    registerForm.resetFields();
  };

  return (
    <div>
      <Card title="小车配送登记">
        <Alert
          message="小车配送说明"
          description="小车配送是指由油站自行安排车辆进行的小批量油品配送。请在配送前进行登记，配送完成后确认。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="registerNo" label="登记单号">
                <Input placeholder="请输入登记单号" prefix={<SearchOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="dateRange" label="登记日期">
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
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="status" label="配送状态">
                <Select style={{ width: '100%' }} placeholder="请选择配送状态" allowClear>
                  <Option value="pending">待配送</Option>
                  <Option value="completed">已完成</Option>
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setVisible(true)}
                >
                  新建登记单
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
          pagination={{ 
            showSizeChanger: true, 
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />

        <Modal
          title="小车配送登记"
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          width={700}
        >
          <Form
            form={registerForm}
            layout="vertical"
            onFinish={onRegisterFinish}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="station"
                  label="油站"
                  rules={[{ required: true, message: '请选择油站' }]}
                >
                  <Select placeholder="请选择油站">
                    <Option value="station1">油站1</Option>
                    <Option value="station2">油站2</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="oilType"
                  label="油品类型"
                  rules={[{ required: true, message: '请选择油品类型' }]}
                >
                  <Select placeholder="请选择油品类型">
                    <Option value="92#">92#汽油</Option>
                    <Option value="95#">95#汽油</Option>
                    <Option value="0#">0#柴油</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="amount"
                  label="配送量(L)"
                  rules={[{ required: true, message: '请输入配送量' }]}
                >
                  <Input type="number" placeholder="请输入配送量" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="vehicle"
                  label="配送车辆"
                  rules={[{ required: true, message: '请输入配送车辆' }]}
                >
                  <Input placeholder="请输入配送车辆" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="driver"
                  label="司机"
                  rules={[{ required: true, message: '请输入司机姓名' }]}
                >
                  <Input placeholder="请输入司机姓名" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label="联系电话"
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="reason"
                  label="配送原因"
                  rules={[{ required: true, message: '请输入配送原因' }]}
                >
                  <TextArea rows={4} placeholder="请输入配送原因" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="expectedTime"
                  label="预计到达时间"
                  rules={[{ required: true, message: '请选择预计到达时间' }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} placeholder="请选择预计到达时间" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Space>
                <Button onClick={() => setVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Space>
            </Row>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default SmallDelivery; 