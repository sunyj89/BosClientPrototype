import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Table, 
  Row, 
  Col, 
  Breadcrumb,
  Tag,
  Statistic,
  Space,
  Drawer,
  Descriptions
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  FileExcelOutlined,
  StopOutlined,
  WarningOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AbandonedOrder = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [abandonedData, setAbandonedData] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setAbandonedData(generateMockData());
      setLoading(false);
    }, 500);
  };

  // 模拟数据
  const generateMockData = () => {
    return Array.from({ length: 20 }).map((_, index) => ({
      id: `ABD${String(index + 1).padStart(6, '0')}`,
      abandonDate: `2023-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
      stationName: `油站${Math.floor(Math.random() * 5) + 1}`,
      oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][Math.floor(Math.random() * 4)],
      quantity: (Math.random() * 100 + 10).toFixed(2),
      amount: (Math.random() * 1000 + 100).toFixed(2),
      abandonReason: ['价格异常', '数量超限', '客户取消', '系统故障', '操作错误'][Math.floor(Math.random() * 5)],
      operatorName: `员工${Math.floor(Math.random() * 10) + 1}`,
      controlType: ['价格管控', '数量管控', '时间管控', '客户管控'][Math.floor(Math.random() * 4)],
      controlValue: (Math.random() * 100 + 10).toFixed(2),
      createTime: `2023-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      remark: '系统自动弃单，原因：' + ['价格异常', '数量超限', '客户取消', '系统故障', '操作错误'][Math.floor(Math.random() * 5)]
    }));
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalAbandoned: abandonedData.length,
      totalAmount: abandonedData.reduce((sum, a) => sum + parseFloat(a.amount), 0).toFixed(2),
      totalQuantity: abandonedData.reduce((sum, a) => sum + parseFloat(a.quantity), 0).toFixed(2),
      averageAmount: (abandonedData.reduce((sum, a) => sum + parseFloat(a.amount), 0) / (abandonedData.length || 1)).toFixed(2)
    };
  };

  const stats = getStatistics();

  const columns = [
    {
      title: '弃单编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '弃单日期',
      dataIndex: 'abandonDate',
      key: 'abandonDate',
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
      title: '加油量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
    },
    {
      title: '交易金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '弃单原因',
      dataIndex: 'abandonReason',
      key: 'abandonReason',
      width: 150,
      render: (reason) => {
        const colorMap = {
          '价格异常': 'red',
          '数量超限': 'orange',
          '客户取消': 'blue',
          '系统故障': 'purple',
          '操作错误': 'cyan'
        };
        return <Tag color={colorMap[reason] || 'default'}>{reason}</Tag>;
      },
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
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
      width: 100,
      align: 'right',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<FileTextOutlined />}
          onClick={() => handleView(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 处理查看详情
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

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
    <div className="abandoned-order">
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/sales">销售管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/sales/oil">油品销售管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>管控弃单记录</Breadcrumb.Item>
        </Breadcrumb>
        <h2>管控弃单记录查询</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="弃单总数" 
              value={stats.totalAbandoned} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="弃单总金额" 
              value={stats.totalAmount} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="弃单总量(L)" 
              value={stats.totalQuantity} 
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="平均弃单金额" 
              value={stats.averageAmount} 
              valueStyle={{ color: '#1890ff' }}
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="stationId" label="油站">
            <Select placeholder="请选择油站" allowClear style={{ width: 200 }}>
              <Option value="1">油站1</Option>
              <Option value="2">油站2</Option>
              <Option value="3">油站3</Option>
              <Option value="4">油站4</Option>
              <Option value="5">油站5</Option>
            </Select>
          </Form.Item>
          <Form.Item name="oilType" label="油品类型">
            <Select placeholder="请选择油品类型" allowClear style={{ width: 120 }}>
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
            </Select>
          </Form.Item>
          <Form.Item name="abandonId" label="弃单编号">
            <Input placeholder="请输入弃单编号" allowClear />
          </Form.Item>
          <Form.Item name="abandonReason" label="弃单原因">
            <Select placeholder="请选择弃单原因" allowClear style={{ width: 120 }}>
              <Option value="价格异常">价格异常</Option>
              <Option value="数量超限">数量超限</Option>
              <Option value="客户取消">客户取消</Option>
              <Option value="系统故障">系统故障</Option>
              <Option value="操作错误">操作错误</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="弃单日期">
            <RangePicker />
          </Form.Item>
          <Form.Item name="controlType" label="管控类型">
            <Select placeholder="请选择管控类型" allowClear style={{ width: 120 }}>
              <Option value="价格管控">价格管控</Option>
              <Option value="数量管控">数量管控</Option>
              <Option value="时间管控">时间管控</Option>
              <Option value="客户管控">客户管控</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button 
                type="primary" 
                icon={<FileExcelOutlined />} 
                onClick={handleExport}
              >
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="管控弃单记录列表">
        <Table
          columns={columns}
          dataSource={abandonedData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            defaultPageSize: 10,
            total: abandonedData.length,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 查看详情抽屉 */}
      <Drawer
        title="弃单记录详情"
        placement="right"
        width={600}
        onClose={() => setViewModalVisible(false)}
        open={viewModalVisible}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="弃单编号">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="弃单日期">{currentRecord.abandonDate}</Descriptions.Item>
              <Descriptions.Item label="油站名称">{currentRecord.stationName}</Descriptions.Item>
              <Descriptions.Item label="油品类型">{currentRecord.oilType}</Descriptions.Item>
              <Descriptions.Item label="加油量(L)">{currentRecord.quantity}</Descriptions.Item>
              <Descriptions.Item label="交易金额(元)">¥{currentRecord.amount}</Descriptions.Item>
              <Descriptions.Item label="弃单原因">
                <Tag color={
                  currentRecord.abandonReason === '价格异常' ? 'red' :
                  currentRecord.abandonReason === '数量超限' ? 'orange' :
                  currentRecord.abandonReason === '客户取消' ? 'blue' :
                  currentRecord.abandonReason === '系统故障' ? 'purple' : 'cyan'
                }>
                  {currentRecord.abandonReason}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作人">{currentRecord.operatorName}</Descriptions.Item>
              <Descriptions.Item label="管控类型">{currentRecord.controlType}</Descriptions.Item>
              <Descriptions.Item label="管控值">{currentRecord.controlValue}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{currentRecord.remark}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default AbandonedOrder; 