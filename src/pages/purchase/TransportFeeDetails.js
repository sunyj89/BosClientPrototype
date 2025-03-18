import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Space, 
  Breadcrumb, 
  Tag, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  DatePicker,
  Button,
  Drawer,
  Descriptions,
  Timeline,
  message,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 生成模拟数据
const generateMockData = () => {
  const data = [];
  const transportUnits = ['京运物流有限公司', '北方运输集团', '华运物流股份公司', '安达运输有限公司'];
  const routes = ['北京-天津', '北京-石家庄', '天津-沧州', '廊坊-北京'];
  const vehicles = ['京A12345', '津B67890', '冀C45678', '京D98765'];
  
  for (let i = 1; i <= 20; i++) {
    const date = moment().subtract(Math.floor(Math.random() * 30), 'days');
    data.push({
      key: i,
      id: `TF${moment().format('YYYY')}${String(i).padStart(4, '0')}`,
      transportUnit: transportUnits[Math.floor(Math.random() * transportUnits.length)],
      date: date.format('YYYY-MM-DD'),
      route: routes[Math.floor(Math.random() * routes.length)],
      vehicleNumber: vehicles[Math.floor(Math.random() * vehicles.length)],
      distance: Math.floor(Math.random() * 500 + 100),
      unitPrice: (Math.random() * 2 + 1).toFixed(2),
      amount: Math.floor(Math.random() * 5000 + 1000),
      status: ['待审核', '已审核', '已确认', '已取消'][Math.floor(Math.random() * 4)],
      auditHistory: [
        {
          time: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
          operator: '张三',
          action: '提交申请',
          comments: '提交运费明细'
        },
        {
          time: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
          operator: '李四',
          action: '审核通过',
          comments: '运费明细符合要求'
        }
      ]
    });
  }
  return data;
};

const TransportFeeDetails = () => {
  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [filterForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setDetailsData(generateMockData());
      setLoading(false);
    }, 500);
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalDetails: detailsData.length,
      pendingDetails: detailsData.filter(s => s.status === '待审核').length,
      totalAmount: detailsData.reduce((sum, s) => sum + s.amount, 0),
      totalDistance: detailsData.reduce((sum, s) => sum + s.distance, 0)
    };
  };

  const stats = getStatistics();

  const columns = [
    {
      title: '明细编号',
      dataIndex: 'id',
      width: 150,
    },
    {
      title: '承运单位',
      dataIndex: 'transportUnit',
      width: 200,
    },
    {
      title: '运输日期',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '运输路线',
      dataIndex: 'route',
      width: 150,
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleNumber',
      width: 120,
    },
    {
      title: '运输距离(公里)',
      dataIndex: 'distance',
      width: 150,
    },
    {
      title: '单价(元/公里)',
      dataIndex: 'unitPrice',
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const colorMap = {
          '待审核': 'orange',
          '已审核': 'blue',
          '已确认': 'green',
          '已取消': 'red'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="default" 
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看
  const handleView = (record) => {
    setCurrentRecord(record);
    setDrawerVisible(true);
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/purchase">采购管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>运费明细</Breadcrumb.Item>
        </Breadcrumb>
        <h2>运费明细</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="明细总数" 
              value={stats.totalDetails} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待审核明细" 
              value={stats.pendingDetails} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="运费总金额" 
              value={stats.totalAmount} 
              valueStyle={{ color: '#52c41a' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总运输距离" 
              value={stats.totalDistance} 
              valueStyle={{ color: '#722ed1' }}
              suffix="公里"
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={filterForm} layout="inline">
          <Form.Item name="id" label="明细编号">
            <Input placeholder="请输入明细编号" allowClear />
          </Form.Item>
          <Form.Item name="dateRange" label="运输日期">
            <RangePicker />
          </Form.Item>
          <Form.Item name="transportUnit" label="承运单位">
            <Select placeholder="请选择承运单位" allowClear style={{ width: 200 }}>
              <Option value="京运物流有限公司">京运物流有限公司</Option>
              <Option value="北方运输集团">北方运输集团</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Option value="待审核">待审核</Option>
              <Option value="已审核">已审核</Option>
              <Option value="已确认">已确认</Option>
              <Option value="已取消">已取消</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => fetchData()}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => filterForm.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 明细列表 */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={detailsData}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title="运费明细详情"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="明细编号" span={2}>{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="承运单位" span={2}>{currentRecord.transportUnit}</Descriptions.Item>
              <Descriptions.Item label="运输日期">{currentRecord.date}</Descriptions.Item>
              <Descriptions.Item label="运输路线">{currentRecord.route}</Descriptions.Item>
              <Descriptions.Item label="车牌号">{currentRecord.vehicleNumber}</Descriptions.Item>
              <Descriptions.Item label="运输距离">{currentRecord.distance}公里</Descriptions.Item>
              <Descriptions.Item label="单价">¥{currentRecord.unitPrice}/公里</Descriptions.Item>
              <Descriptions.Item label="金额">¥{currentRecord.amount}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '已审核' ? 'green' :
                  currentRecord.status === '待审核' ? 'orange' :
                  currentRecord.status === '已确认' ? 'blue' : 'red'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h3>审核记录</h3>
              <Timeline style={{ marginTop: 16 }}>
                {currentRecord.auditHistory.map((item, index) => (
                  <Timeline.Item
                    key={index}
                    dot={
                      item.action === '审核通过' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                      item.action === '审核拒绝' ? <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> :
                      <ClockCircleOutlined style={{ color: '#1890ff' }} />
                    }
                  >
                    <p>
                      <strong>{item.action}</strong>
                      <span style={{ marginLeft: 8, color: '#666' }}>- {item.operator}</span>
                      <span style={{ float: 'right', color: '#999' }}>{item.time}</span>
                    </p>
                    <p style={{ color: '#666' }}>{item.comments}</p>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default TransportFeeDetails; 