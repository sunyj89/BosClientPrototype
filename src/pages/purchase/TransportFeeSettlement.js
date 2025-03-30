import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Breadcrumb, 
  Tag, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  Statistic,
  DatePicker,
  InputNumber,
  Descriptions,
  Timeline,
  Drawer
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  PrinterOutlined,
  AuditOutlined,
  CloseCircleOutlined,
  DeleteOutlined
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
    const settlementDate = moment().subtract(Math.floor(Math.random() * 30), 'days');
    const periodStart = moment(settlementDate).subtract(15, 'days');
    const periodEnd = moment(settlementDate);
    const totalAmount = Math.floor(Math.random() * 50000 + 10000);
    
    data.push({
      key: i,
      id: `TF${moment().format('YYYY')}${String(i).padStart(4, '0')}`,
      transportUnit: transportUnits[Math.floor(Math.random() * transportUnits.length)],
      settlementDate: settlementDate.format('YYYY-MM-DD'),
      periodStart: periodStart.format('YYYY-MM-DD'),
      periodEnd: periodEnd.format('YYYY-MM-DD'),
      status: ['待审核', '已审核', '已确认', '已取消'][Math.floor(Math.random() * 4)],
      totalAmount: totalAmount,
      paymentStatus: ['未支付', '部分支付', '已支付'][Math.floor(Math.random() * 3)],
      paymentMethod: ['银行转账', '现金', '支票'][Math.floor(Math.random() * 3)],
      items: Array(Math.floor(Math.random() * 3 + 1)).fill(null).map((_, index) => ({
        id: `${i}-${index + 1}`,
        date: moment(periodStart).add(Math.floor(Math.random() * 15), 'days').format('YYYY-MM-DD'),
        route: routes[Math.floor(Math.random() * routes.length)],
        vehicleNumber: vehicles[Math.floor(Math.random() * vehicles.length)],
        distance: Math.floor(Math.random() * 500 + 100),
        unitPrice: (Math.random() * 2 + 1).toFixed(2),
        amount: Math.floor(Math.random() * 5000 + 1000)
      })),
      remarks: '运费结算'
    });
  }
  return data;
};

const TransportFeeSettlement = () => {
  const [loading, setLoading] = useState(false);
  const [settlementData, setSettlementData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const [auditForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setSettlementData(generateMockData());
      setLoading(false);
    }, 500);
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalSettlements: settlementData.length,
      pendingSettlements: settlementData.filter(s => s.status === '待审核').length,
      totalAmount: settlementData.reduce((sum, s) => sum + s.totalAmount, 0),
      unpaidAmount: settlementData.filter(s => s.paymentStatus === '未支付')
        .reduce((sum, s) => sum + s.totalAmount, 0)
    };
  };

  const stats = getStatistics();

  const columns = [
    {
      title: '结算单号',
      dataIndex: 'id',
      width: 150,
    },
    {
      title: '承运单位',
      dataIndex: 'transportUnit',
      width: 200,
    },
    {
      title: '结算日期',
      dataIndex: 'settlementDate',
      width: 120,
    },
    {
      title: '结算期间',
      key: 'period',
      width: 200,
      render: (_, record) => `${record.periodStart} 至 ${record.periodEnd}`,
    },
    {
      title: '结算金额',
      dataIndex: 'totalAmount',
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
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 100,
      render: (status) => {
        const colorMap = {
          '未支付': 'red',
          '部分支付': 'orange',
          '已支付': 'green'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="default" 
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            详情
          </Button>
          <Button 
            type="default" 
            icon={<AuditOutlined />}
            size="small"
            onClick={() => handleAudit(record)}
          >
            审核
          </Button>
          <Button 
            type="default" 
            icon={<PrinterOutlined />}
            size="small"
            onClick={() => handlePrint(record)}
          >
            打印
          </Button>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record) => {
    const formData = {
      ...record,
      settlementDate: moment(record.settlementDate),
      periodStart: moment(record.periodStart),
      periodEnd: moment(record.periodEnd),
      items: record.items.map(item => ({
        ...item,
        date: moment(item.date)
      }))
    };
    setCurrentRecord(record);
    form.setFieldsValue(formData);
    setModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const submitData = {
        ...values,
        settlementDate: values.settlementDate.format('YYYY-MM-DD'),
        periodStart: values.periodStart.format('YYYY-MM-DD'),
        periodEnd: values.periodEnd.format('YYYY-MM-DD'),
        items: values.items.map(item => ({
          ...item,
          date: item.date.format('YYYY-MM-DD'),
          amount: (item.distance || 0) * (item.unitPrice || 0)
        })),
        totalAmount: values.items.reduce((sum, item) => 
          sum + ((item.distance || 0) * (item.unitPrice || 0)), 0)
      };
      console.log('提交数据:', submitData);
      message.success('保存成功');
      setModalVisible(false);
      fetchData();
    });
  };

  // 处理金额计算
  const handleItemValuesChange = (allValues) => {
    if (allValues.items) {
      const items = allValues.items.map(item => ({
        ...item,
        amount: (item.distance || 0) * (item.unitPrice || 0)
      }));
      form.setFieldsValue({ items });
    }
  };

  // 处理查看
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 处理审核
  const handleAudit = (record) => {
    setCurrentRecord(record);
    setAuditModalVisible(true);
  };

  // 处理打印
  const handlePrint = (record) => {
    message.success(`正在打印运费结算单：${record.id}`);
  };

  // 处理审核提交
  const handleAuditSubmit = () => {
    auditForm.validateFields().then(values => {
      console.log('审核信息:', values);
      message.success('审核成功');
      setAuditModalVisible(false);
      fetchData();
    });
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/purchase">采购管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>运费结算申请</Breadcrumb.Item>
        </Breadcrumb>
        <h2>运费结算申请</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="结算单总数" 
              value={stats.totalSettlements} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待审核结算单" 
              value={stats.pendingSettlements} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="结算总金额" 
              value={stats.totalAmount} 
              valueStyle={{ color: '#52c41a' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="未支付金额" 
              value={stats.unpaidAmount} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={filterForm} layout="inline">
          <Form.Item name="id" label="结算单号">
            <Input placeholder="请输入结算单号" allowClear />
          </Form.Item>
          <Form.Item name="dateRange" label="结算日期">
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
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setCurrentRecord(null);
                form.resetFields();
                setModalVisible(true);
              }}>
                新建结算单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 结算单列表 */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={settlementData}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 编辑模态框 */}
      <Modal
        title={currentRecord ? '编辑结算单' : '新建结算单'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleItemValuesChange}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="transportUnit" 
                label="承运单位"
                rules={[{ required: true, message: '请选择承运单位' }]}
              >
                <Select placeholder="请选择承运单位">
                  <Option value="京运物流有限公司">京运物流有限公司</Option>
                  <Option value="北方运输集团">北方运输集团</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="settlementDate" 
                label="结算日期"
                rules={[{ required: true, message: '请选择结算日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="periodStart" 
                label="结算期间开始"
                rules={[{ required: true, message: '请选择结算期间开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="periodEnd" 
                label="结算期间结束"
                rules={[{ required: true, message: '请选择结算期间结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card 
                    key={key} 
                    style={{ marginBottom: 16 }} 
                    title={`运费项 #${name + 1}`}
                    extra={
                      <Button type="link" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
                        删除
                      </Button>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'date']}
                          label="运输日期"
                          rules={[{ required: true, message: '请选择运输日期' }]}
                        >
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'route']}
                          label="运输路线"
                          rules={[{ required: true, message: '请选择运输路线' }]}
                        >
                          <Select placeholder="请选择运输路线">
                            <Option value="北京-天津">北京-天津</Option>
                            <Option value="北京-石家庄">北京-石家庄</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'vehicleNumber']}
                          label="车牌号"
                          rules={[{ required: true, message: '请输入车牌号' }]}
                        >
                          <Input placeholder="请输入车牌号" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'distance']}
                          label="运输距离(公里)"
                          rules={[{ required: true, message: '请输入运输距离' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="请输入运输距离"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          label="单价(元/公里)"
                          rules={[{ required: true, message: '请输入单价' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            placeholder="请输入单价"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'amount']}
                          label="金额"
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            disabled
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                >
                  添加运费项
                </Button>
              </>
            )}
          </Form.List>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Form.Item 
                name="paymentMethod" 
                label="付款方式"
                rules={[{ required: true, message: '请选择付款方式' }]}
              >
                <Select placeholder="请选择付款方式">
                  <Option value="银行转账">银行转账</Option>
                  <Option value="现金">现金</Option>
                  <Option value="支票">支票</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="paymentStatus" 
                label="付款状态"
                rules={[{ required: true, message: '请选择付款状态' }]}
              >
                <Select placeholder="请选择付款状态">
                  <Option value="未支付">未支付</Option>
                  <Option value="部分支付">部分支付</Option>
                  <Option value="已支付">已支付</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="status" 
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="待审核">待审核</Option>
                  <Option value="已审核">已审核</Option>
                  <Option value="已确认">已确认</Option>
                  <Option value="已取消">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="remarks" 
            label="备注"
            style={{ marginTop: 16 }}
          >
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情抽屉 */}
      <Drawer
        title="结算单详情"
        placement="right"
        width={600}
        onClose={() => setViewModalVisible(false)}
        open={viewModalVisible}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="结算单号">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="承运单位">{currentRecord.transportUnit}</Descriptions.Item>
              <Descriptions.Item label="结算日期">{currentRecord.settlementDate}</Descriptions.Item>
              <Descriptions.Item label="结算期间">{`${currentRecord.periodStart} 至 ${currentRecord.periodEnd}`}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '已审核' ? 'green' :
                  currentRecord.status === '待审核' ? 'orange' :
                  currentRecord.status === '已确认' ? 'blue' : 'red'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="付款状态">
                <Tag color={
                  currentRecord.paymentStatus === '已支付' ? 'green' :
                  currentRecord.paymentStatus === '部分支付' ? 'orange' : 'red'
                }>
                  {currentRecord.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="付款方式">{currentRecord.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="总金额">￥{currentRecord.totalAmount}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h3>运费明细</h3>
              <Table
                dataSource={currentRecord.items}
                columns={[
                  { title: '运输日期', dataIndex: 'date' },
                  { title: '运输路线', dataIndex: 'route' },
                  { title: '车牌号', dataIndex: 'vehicleNumber' },
                  { title: '运输距离', dataIndex: 'distance' },
                  { title: '单价', dataIndex: 'unitPrice' },
                  { title: '金额', dataIndex: 'amount' }
                ]}
                pagination={false}
              />
            </div>

            {currentRecord.remarks && (
              <div style={{ marginTop: 24 }}>
                <h3>备注</h3>
                <p>{currentRecord.remarks}</p>
              </div>
            )}
          </>
        )}
      </Drawer>

      {/* 审核抽屉 */}
      <Drawer
        title="结算单审核"
        placement="right"
        width={600}
        onClose={() => setAuditModalVisible(false)}
        open={auditModalVisible}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="结算单号" span={2}>{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="承运单位" span={2}>{currentRecord.transportUnit}</Descriptions.Item>
              <Descriptions.Item label="结算日期">{currentRecord.settlementDate}</Descriptions.Item>
              <Descriptions.Item label="结算期间">{`${currentRecord.periodStart} 至 ${currentRecord.periodEnd}`}</Descriptions.Item>
              <Descriptions.Item label="总金额" span={2}>¥{currentRecord.totalAmount}</Descriptions.Item>
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
              <Form form={auditForm} layout="vertical">
                <Form.Item
                  name="auditStatus"
                  label="审核结果"
                  rules={[{ required: true, message: '请选择审核结果' }]}
                >
                  <Select>
                    <Option value="approved">通过</Option>
                    <Option value="rejected">拒绝</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="auditComments"
                  label="审核意见"
                  rules={[{ required: true, message: '请输入审核意见' }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Form>
            </div>

            <div style={{ marginTop: 24 }}>
              <h3>审核记录</h3>
              <Timeline style={{ marginTop: 16 }}>
                {currentRecord.auditHistory && currentRecord.auditHistory.map((item, index) => (
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

            <div style={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid #e8e8e8', padding: '10px 16px', textAlign: 'right', left: 0, background: '#fff' }}>
              <Button onClick={() => setAuditModalVisible(false)} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" onClick={handleAuditSubmit}>
                提交
              </Button>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default TransportFeeSettlement; 