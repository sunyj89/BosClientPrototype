import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Table, Row, Col, Tag, Space, Breadcrumb } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined, EyeOutlined, HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 定义颜色映射
const abandonReasonColors = {
  '价格异常': 'red',
  '数量超限': 'orange',
  '客户取消': 'blue',
  '系统故障': 'purple',
  '操作错误': 'cyan'
};

// 模拟数据
const generateMockData = (count) => {
  const data = [];
  const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
  const abandonReasons = ['价格异常', '数量超限', '客户取消', '系统故障', '操作错误'];
  const controlTypes = ['系统自动管控', '人工管控', '预警管控'];
  
  for (let i = 0; i < count; i++) {
    const oilType = oilTypes[Math.floor(Math.random() * oilTypes.length)];
    const abandonReason = abandonReasons[Math.floor(Math.random() * abandonReasons.length)];
    const controlType = controlTypes[Math.floor(Math.random() * controlTypes.length)];
    
    data.push({
      key: i,
      abandonId: `ABD${moment().format('YYYYMMDD')}${String(i + 1001).padStart(4, '0')}`,
      abandonDate: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
      stationName: `测试油站${Math.floor(Math.random() * 10) + 1}`,
      oilType,
      gunNumber: Math.floor(Math.random() * 12) + 1,
      quantity: (Math.random() * 100 + 10).toFixed(2),
      unitPrice: (Math.random() * 2 + 6).toFixed(2),
      amount: (Math.random() * 1000 + 100).toFixed(2),
      abandonReason,
      operator: `操作员${Math.floor(Math.random() * 5) + 1}`,
      controlType,
      controlValue: abandonReason === '价格异常' ? `¥${(Math.random() * 2 + 6).toFixed(2)}` : 
                   abandonReason === '数量超限' ? `${(Math.random() * 100 + 50).toFixed(2)}L` : 
                   abandonReason === '客户取消' ? '客户主动取消' : 
                   abandonReason === '系统故障' ? `故障码: E${Math.floor(Math.random() * 100) + 1}` : 
                   '操作员误操作',
      remark: `${abandonReason}导致订单被弃用，${controlType}触发`,
    });
  }
  
  return data;
};

const AbandonedOrder = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(generateMockData(20));
  
  const handleSearch = (values) => {
    console.log('Search values:', values);
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      setData(generateMockData(20));
      setLoading(false);
    }, 500);
  };
  
  const handleReset = () => {
    form.resetFields();
  };
  
  const columns = [
    {
      title: '弃单编号',
      dataIndex: 'abandonId',
      key: 'abandonId',
      width: 180,
    },
    {
      title: '弃单时间',
      dataIndex: 'abandonDate',
      key: 'abandonDate',
      width: 180,
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '油枪号',
      dataIndex: 'gunNumber',
      key: 'gunNumber',
      width: 80,
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
      render: (text) => `¥${text}`,
    },
    {
      title: '交易金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (text) => `¥${text}`,
    },
    {
      title: '弃单原因',
      dataIndex: 'abandonReason',
      key: 'abandonReason',
      width: 120,
      render: (text) => <Tag color={abandonReasonColors[text] || 'default'}>{text}</Tag>,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '管控类型',
      dataIndex: 'controlType',
      key: 'controlType',
      width: 120,
    },
    {
      title: '管控值',
      dataIndex: 'controlValue',
      key: 'controlValue',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} size="small">
            查看
          </Button>
        </Space>
      ),
    },
  ];
  
  // 统计数据
  const stats = {
    totalAbandoned: data.length,
    totalAmount: data.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2),
    totalQuantity: data.reduce((sum, item) => sum + parseFloat(item.quantity), 0).toFixed(2),
    avgAmount: (data.reduce((sum, item) => sum + parseFloat(item.amount), 0) / data.length).toFixed(2)
  };
  
  return (
    <div className="abandoned-order">
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard"><HomeOutlined /> 首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales">销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales/oil">油品销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>管控弃单记录</Breadcrumb.Item>
      </Breadcrumb>
      
      <div style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>弃单总数</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalAbandoned}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#fff2e8', borderColor: '#ffbb96' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>弃单总金额</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{stats.totalAmount}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>弃单总量</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalQuantity}L</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#f9f0ff', borderColor: '#d3adf7' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>平均弃单金额</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{stats.avgAmount}</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      
      <Card title="查询条件" style={{ marginBottom: '20px' }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
        >
          <Form.Item name="abandonId" label="弃单编号">
            <Input placeholder="请输入弃单编号" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="dateRange" label="弃单时间">
            <RangePicker style={{ width: 300 }} />
          </Form.Item>
          <Form.Item name="stationName" label="油站名称">
            <Select placeholder="请选择油站" style={{ width: 200 }} allowClear>
              <Option value="station1">测试油站1</Option>
              <Option value="station2">测试油站2</Option>
              <Option value="station3">测试油站3</Option>
            </Select>
          </Form.Item>
          <Form.Item name="oilType" label="油品类型">
            <Select placeholder="请选择油品" style={{ width: 120 }} allowClear>
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
            </Select>
          </Form.Item>
          <Form.Item name="abandonReason" label="弃单原因">
            <Select placeholder="请选择弃单原因" style={{ width: 150 }} allowClear>
              <Option value="价格异常">价格异常</Option>
              <Option value="数量超限">数量超限</Option>
              <Option value="客户取消">客户取消</Option>
              <Option value="系统故障">系统故障</Option>
              <Option value="操作错误">操作错误</Option>
            </Select>
          </Form.Item>
          <Form.Item name="controlType" label="管控类型">
            <Select placeholder="请选择管控类型" style={{ width: 150 }} allowClear>
              <Option value="系统自动管控">系统自动管控</Option>
              <Option value="人工管控">人工管控</Option>
              <Option value="预警管控">预警管控</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginLeft: 'auto' }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<ExportOutlined />}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="管控弃单记录列表">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1800 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default AbandonedOrder; 