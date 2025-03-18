import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Table, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, FileExcelOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrderDetail = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData = Array.from({ length: 20 }).map((_, index) => ({
    id: `ORD${String(index + 1).padStart(6, '0')}`,
    orderDate: `2023-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
    stationName: `油站${Math.floor(Math.random() * 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][Math.floor(Math.random() * 4)],
    quantity: (Math.random() * 100 + 10).toFixed(2),
    unitPrice: (Math.random() * 10 + 5).toFixed(2),
    amount: (Math.random() * 1000 + 100).toFixed(2),
    paymentMethod: ['现金', '微信', '支付宝', '银行卡', '会员卡'][Math.floor(Math.random() * 5)],
    employeeName: `员工${Math.floor(Math.random() * 10) + 1}`,
    oilGunNo: `${Math.floor(Math.random() * 10) + 1}号枪`,
    status: ['已完成', '已取消', '处理中'][Math.floor(Math.random() * 3)],
  }));

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '交易日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 120,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '油枪号',
      dataIndex: 'oilGunNo',
      key: 'oilGunNo',
      width: 100,
    },
    {
      title: '加油量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
    },
    {
      title: '单价(元/L)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      align: 'right',
    },
    {
      title: '交易金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
    },
    {
      title: '操作员',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = 'default';
        if (status === '已完成') color = 'success';
        else if (status === '已取消') color = 'error';
        else if (status === '处理中') color = 'processing';
        return <span style={{ color: color === 'success' ? 'green' : color === 'error' ? 'red' : 'blue' }}>{status}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => console.log('查看详情', record)}>
          查看详情
        </Button>
      ),
    },
  ];

  const handleSearch = (values) => {
    console.log('查询条件:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleExport = () => {
    console.log('导出数据');
  };

  return (
    <div className="order-detail">
      <Card title="查询条件" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="油站" name="stationId">
                <Select placeholder="请选择油站" allowClear>
                  <Option value="1">油站1</Option>
                  <Option value="2">油站2</Option>
                  <Option value="3">油站3</Option>
                  <Option value="4">油站4</Option>
                  <Option value="5">油站5</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="油品类型" name="oilType">
                <Select placeholder="请选择油品类型" allowClear>
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="订单编号" name="orderId">
                <Input placeholder="请输入订单编号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="支付方式" name="paymentMethod">
                <Select placeholder="请选择支付方式" allowClear>
                  <Option value="现金">现金</Option>
                  <Option value="微信">微信</Option>
                  <Option value="支付宝">支付宝</Option>
                  <Option value="银行卡">银行卡</Option>
                  <Option value="会员卡">会员卡</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="交易日期" name="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="操作员" name="employeeName">
                <Input placeholder="请输入操作员姓名" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="油枪号" name="oilGunNo">
                <Input placeholder="请输入油枪号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="已完成">已完成</Option>
                  <Option value="已取消">已取消</Option>
                  <Option value="处理中">处理中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button icon={<ReloadOutlined />} style={{ marginRight: 8 }} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button 
                type="primary" 
                icon={<FileExcelOutlined />} 
                style={{ marginLeft: 8 }}
                onClick={handleExport}
              >
                导出
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="订单明细列表">
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            defaultPageSize: 10,
            total: mockData.length,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default OrderDetail; 