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
  AlertOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ControlFlow = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [controlData, setControlData] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setControlData(generateMockData());
      setLoading(false);
    }, 500);
  };

  // 模拟数据
  const generateMockData = () => {
    return Array.from({ length: 20 }).map((_, index) => ({
      id: `CTL${String(index + 1).padStart(6, '0')}`,
      controlDate: `2023-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
      stationName: `油站${Math.floor(Math.random() * 5) + 1}`,
      oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][Math.floor(Math.random() * 4)],
      controlType: ['价格管控', '数量管控', '时间管控', '客户管控'][Math.floor(Math.random() * 4)],
      controlValue: (Math.random() * 100 + 10).toFixed(2),
      controlReason: ['超出限额', '价格异常', '非营业时间', '黑名单客户'][Math.floor(Math.random() * 4)],
      operatorName: `管理员${Math.floor(Math.random() * 5) + 1}`,
      status: ['已处理', '未处理', '已忽略'][Math.floor(Math.random() * 3)],
      createTime: `2023-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      processTime: `2023-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      processOperator: `处理员${Math.floor(Math.random() * 5) + 1}`,
      processRemark: '已处理完成，符合管控要求'
    }));
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalControls: controlData.length,
      pendingControls: controlData.filter(c => c.status === '未处理').length,
      processedControls: controlData.filter(c => c.status === '已处理').length,
      ignoredControls: controlData.filter(c => c.status === '已忽略').length
    };
  };

  const stats = getStatistics();

  const columns = [
    {
      title: '管控编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '管控日期',
      dataIndex: 'controlDate',
      key: 'controlDate',
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
      title: '管控原因',
      dataIndex: 'controlReason',
      key: 'controlReason',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colorMap = {
          '已处理': 'green',
          '未处理': 'red',
          '已忽略': 'orange'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<FileTextOutlined />}
            onClick={() => handleView(record)}
          >
            查看详情
          </Button>
          {record.status === '未处理' && (
            <Button 
              type="default" 
              size="small" 
              icon={<ToolOutlined />}
              onClick={() => console.log('处理', record)}
            >
              处理
            </Button>
          )}
        </Space>
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
    <div className="control-flow">
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/sales">销售管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/sales/oil">油品销售管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>管控流水</Breadcrumb.Item>
        </Breadcrumb>
        <h2>管控流水查询</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="管控总数" 
              value={stats.totalControls} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="未处理管控" 
              value={stats.pendingControls} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已处理管控" 
              value={stats.processedControls} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已忽略管控" 
              value={stats.ignoredControls} 
              valueStyle={{ color: '#faad14' }}
              prefix={<AlertOutlined />}
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
          <Form.Item name="controlId" label="管控编号">
            <Input placeholder="请输入管控编号" allowClear />
          </Form.Item>
          <Form.Item name="controlType" label="管控类型">
            <Select placeholder="请选择管控类型" allowClear style={{ width: 120 }}>
              <Option value="价格管控">价格管控</Option>
              <Option value="数量管控">数量管控</Option>
              <Option value="时间管控">时间管控</Option>
              <Option value="客户管控">客户管控</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="管控日期">
            <RangePicker />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Option value="已处理">已处理</Option>
              <Option value="未处理">未处理</Option>
              <Option value="已忽略">已忽略</Option>
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

      <Card title="管控流水列表">
        <Table
          columns={columns}
          dataSource={controlData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            defaultPageSize: 10,
            total: controlData.length,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 查看详情抽屉 */}
      <Drawer
        title="管控流水详情"
        placement="right"
        width={600}
        onClose={() => setViewModalVisible(false)}
        open={viewModalVisible}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="管控编号">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="管控日期">{currentRecord.controlDate}</Descriptions.Item>
              <Descriptions.Item label="油站名称">{currentRecord.stationName}</Descriptions.Item>
              <Descriptions.Item label="油品类型">{currentRecord.oilType}</Descriptions.Item>
              <Descriptions.Item label="管控类型">{currentRecord.controlType}</Descriptions.Item>
              <Descriptions.Item label="管控值">{currentRecord.controlValue}</Descriptions.Item>
              <Descriptions.Item label="管控原因">{currentRecord.controlReason}</Descriptions.Item>
              <Descriptions.Item label="操作人">{currentRecord.operatorName}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '已处理' ? 'green' :
                  currentRecord.status === '未处理' ? 'red' : 'orange'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {currentRecord.status === '已处理' && (
              <div style={{ marginTop: 24 }}>
                <h3>处理信息</h3>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="处理时间">{currentRecord.processTime}</Descriptions.Item>
                  <Descriptions.Item label="处理人">{currentRecord.processOperator}</Descriptions.Item>
                  <Descriptions.Item label="处理备注" span={2}>{currentRecord.processRemark}</Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default ControlFlow; 