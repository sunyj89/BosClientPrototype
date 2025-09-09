import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Table, Row, Col, Tag, Space, Breadcrumb } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined, EyeOutlined, CheckOutlined, HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 定义状态颜色映射
const statusColors = { '未处理': 'error', '已处理': 'success', '已忽略': 'warning' };

// 模拟数据
const generateMockData = (count) => {
  const data = [];
  const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
  const controlTypes = ['价格异常', '数量超限', '加油频率异常', '油枪故障', '系统预警'];
  const statuses = ['未处理', '已处理', '已忽略'];
  
  for (let i = 0; i < count; i++) {
    const oilType = oilTypes[Math.floor(Math.random() * oilTypes.length)];
    const controlType = controlTypes[Math.floor(Math.random() * controlTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    data.push({
      key: i,
      controlId: `CTL${moment().format('YYYYMMDD')}${String(i + 1001).padStart(4, '0')}`,
      controlDate: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
      stationName: `测试油站${Math.floor(Math.random() * 10) + 1}`,
      oilType,
      gunNumber: Math.floor(Math.random() * 12) + 1,
      controlType,
      controlValue: controlType === '价格异常' ? `¥${(Math.random() * 2 + 6).toFixed(2)}` : 
                   controlType === '数量超限' ? `${(Math.random() * 100 + 50).toFixed(2)}L` : 
                   controlType === '加油频率异常' ? `${Math.floor(Math.random() * 10) + 1}次/小时` : 
                   controlType === '油枪故障' ? `故障码: E${Math.floor(Math.random() * 100) + 1}` : 
                   `预警级别: ${Math.floor(Math.random() * 3) + 1}`,
      controlReason: `${controlType}，系统自动管控`,
      operator: status !== '未处理' ? `操作员${Math.floor(Math.random() * 5) + 1}` : '-',
      operateDate: status !== '未处理' ? moment().subtract(Math.floor(Math.random() * 10), 'days').format('YYYY-MM-DD HH:mm:ss') : '-',
      status,
    });
  }
  
  return data;
};

const ControlFlow = () => {
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
      title: '管控编号',
      dataIndex: 'controlId',
      key: 'controlId',
      width: 180,
    },
    {
      title: '管控时间',
      dataIndex: 'controlDate',
      key: 'controlDate',
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
      title: '管控类型',
      dataIndex: 'controlType',
      key: 'controlType',
      width: 120,
      render: (text) => {
        let color = 'default';
        if (text === '价格异常') color = 'red';
        else if (text === '数量超限') color = 'orange';
        else if (text === '加油频率异常') color = 'blue';
        else if (text === '油枪故障') color = 'purple';
        else if (text === '系统预警') color = 'cyan';
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '管控值',
      dataIndex: 'controlValue',
      key: 'controlValue',
      width: 120,
    },
    {
      title: '管控原因',
      dataIndex: 'controlReason',
      key: 'controlReason',
      width: 200,
    },
    {
      title: '处理人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '处理时间',
      dataIndex: 'operateDate',
      key: 'operateDate',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <Tag color={statusColors[text]}>{text}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} size="small">
            查看
          </Button>
          {record.status === '未处理' && (
            <Button type="link" icon={<CheckOutlined />} size="small" style={{ color: '#52c41a' }}>
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ];
  
  // 统计数据
  const stats = {
    totalControls: data.length,
    pendingControls: data.filter(item => item.status === '未处理').length,
    processedControls: data.filter(item => item.status === '已处理').length,
    ignoredControls: data.filter(item => item.status === '已忽略').length
  };
  
  return (
    <div className="control-flow">
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
        <Breadcrumb.Item>管控流水</Breadcrumb.Item>
      </Breadcrumb>
      
      <div style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>管控总数</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalControls}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#fff1f0', borderColor: '#ffa39e' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>未处理管控</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.pendingControls}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>已处理管控</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.processedControls}</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ background: '#fffbe6', borderColor: '#ffe58f' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>已忽略管控</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.ignoredControls}</p>
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
          <Form.Item name="controlId" label="管控编号">
            <Input placeholder="请输入管控编号" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="dateRange" label="管控时间">
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
          <Form.Item name="controlType" label="管控类型">
            <Select placeholder="请选择管控类型" style={{ width: 150 }} allowClear>
              <Option value="价格异常">价格异常</Option>
              <Option value="数量超限">数量超限</Option>
              <Option value="加油频率异常">加油频率异常</Option>
              <Option value="油枪故障">油枪故障</Option>
              <Option value="系统预警">系统预警</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
              <Option value="未处理">未处理</Option>
              <Option value="已处理">已处理</Option>
              <Option value="已忽略">已忽略</Option>
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
      
      <Card title="管控流水列表">
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

export default ControlFlow; 