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
  Tabs,
  Statistic,
  DatePicker,
  InputNumber,
  Descriptions,
  Timeline
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
  AuditOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OilPurchaseSettlement = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('list');

  // 状态定义
  const [loading, setLoading] = useState(false);
  const [settlementData, setSettlementData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditForm] = Form.useForm();

  // 根据路由路径设置活动标签
  useEffect(() => {
    if (location.pathname === '/purchase/details') {
      setActiveTab('details');
    } else if (location.pathname === '/purchase/settlement') {
      setActiveTab('list');
    }
  }, [location]);

  // 模拟数据 - 结算单
  const mockSettlements = [
    {
      key: '1',
      id: 'PS20240315001',
      supplierId: 'OS001',
      supplierName: '中石化北京分公司',
      settlementDate: '2024-03-15',
      periodStart: '2024-03-01',
      periodEnd: '2024-03-15',
      status: '待审核',
      items: [
        {
          purchaseOrderId: 'PO20240315001',
          orderDate: '2024-03-15',
          productName: '92#汽油',
          quantity: 20000,
          unit: '升',
          unitPrice: 6.89,
          amount: 137800
        },
        {
          purchaseOrderId: 'PO20240315001',
          orderDate: '2024-03-15',
          productName: '95#汽油',
          quantity: 15000,
          unit: '升',
          unitPrice: 7.32,
          amount: 109800
        }
      ],
      totalAmount: 247600,
      paymentStatus: '未支付',
      paymentMethod: '银行转账',
      remarks: '3月上半月结算'
    }
  ];

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setSettlementData(mockSettlements);
      setLoading(false);
    }, 500);
  };

  // 结算单列表列配置
  const columns = [
    {
      title: '结算单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: '结算日期',
      dataIndex: 'settlementDate',
      key: 'settlementDate',
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
      key: 'totalAmount',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
      key: 'paymentStatus',
      width: 100,
      render: (status) => (
        <Tag color={status === '已支付' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
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
            查看
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

  // 结算明细列表列配置
  const detailColumns = [
    {
      title: '结算单号',
      dataIndex: 'purchaseOrderId',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 200,
    },
    {
      title: '订单日期',
      dataIndex: 'orderDate',
      width: 120,
    },
    {
      title: '油品名称',
      dataIndex: 'productName',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 100,
      render: (quantity, record) => `${quantity} ${record.unit}`,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`,
    }
  ];

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalSettlements: settlementData.length,
      pendingSettlements: settlementData.filter(s => s.status === '待审核').length,
      totalAmount: settlementData.reduce((sum, settlement) => sum + settlement.totalAmount, 0),
      unpaidAmount: settlementData.filter(s => s.paymentStatus === '未支付')
        .reduce((sum, settlement) => sum + settlement.totalAmount, 0)
    };
  };

  const stats = getStatistics();

  // 处理编辑
  const handleEdit = (record) => {
    const formData = {
      ...record,
      settlementDate: moment(record.settlementDate),
      periodStart: moment(record.periodStart),
      periodEnd: moment(record.periodEnd),
      items: record.items.map(item => ({
        ...item,
        amount: item.quantity * item.unitPrice
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
          amount: (item.quantity || 0) * (item.unitPrice || 0)
        })),
        totalAmount: values.items.reduce((sum, item) => 
          sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0)
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
        amount: (item.quantity || 0) * (item.unitPrice || 0)
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
    message.success(`正在打印结算单：${record.id}`);
  };

  const handleAuditSubmit = () => {
    auditForm.validateFields().then(values => {
      console.log(values);
      setAuditModalVisible(false);
      message.success('审核提交成功');
    }).catch(error => {
      console.error('审核提交失败:', error);
    });
  };

  return (
    <div className="oil-purchase-settlement">
      <Card>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>采购管理</Breadcrumb.Item>
          <Breadcrumb.Item>
            {activeTab === 'details' ? '结算明细' : '采购结算单'}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="结算单列表" key="list">
            <div style={{ marginBottom: 16 }}>
              {/* 搜索表单 */}
              <Form form={filterForm} layout="inline" onFinish={fetchData}>
                <Form.Item name="id" label="结算单号">
                  <Input placeholder="请输入结算单号" allowClear />
                </Form.Item>
                <Form.Item name="dateRange" label="结算日期">
                  <RangePicker />
                </Form.Item>
                <Form.Item name="supplier" label="供应商">
                  <Select placeholder="请选择供应商" allowClear style={{ width: 200 }}>
                    <Option value="OS001">中石化北京分公司</Option>
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
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => filterForm.resetFields()}>
                      重置
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />}>
                      新建结算单
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
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

            {/* 结算单列表表格 */}
            <Table
              columns={columns}
              dataSource={settlementData}
              loading={loading}
              rowKey="id"
              pagination={{
                total: settlementData.length,
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </TabPane>

          <TabPane tab="结算明细" key="details">
            <div style={{ marginBottom: 16 }}>
              {/* 明细搜索表单 */}
              <Form form={filterForm} layout="inline" onFinish={fetchData}>
                <Form.Item name="settlementNo" label="结算单号">
                  <Input placeholder="请输入结算单号" allowClear />
                </Form.Item>
                <Form.Item name="dateRange" label="结算日期">
                  <RangePicker />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button icon={<ReloadOutlined />} onClick={() => filterForm.resetFields()}>
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </div>

            {/* 结算明细表格 */}
            <Table
              columns={detailColumns}
              dataSource={settlementData.flatMap(settlement => 
                settlement.items.map(item => ({
                  ...item,
                  settlementNo: settlement.settlementNo,
                  settlementDate: settlement.settlementDate,
                  supplier: settlement.supplier
                }))
              )}
              loading={loading}
              rowKey={(record) => `${record.settlementNo}-${record.id}`}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </TabPane>
        </Tabs>
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
                name="supplierId" 
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="请选择供应商">
                  <Option value="OS001">中石化北京分公司</Option>
                  <Option value="OS002">中石油北京分公司</Option>
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
                    title={`结算项 #${name + 1}`}
                    extra={
                      <Button type="button" onClick={() => remove(name)} danger>
                        删除
                      </Button>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'orderId']}
                          label="采购单号"
                          rules={[{ required: true, message: '请选择采购单' }]}
                        >
                          <Select placeholder="请选择采购单">
                            <Option value="PO001">PO001</Option>
                            <Option value="PO002">PO002</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'productName']}
                          label="油品"
                          rules={[{ required: true, message: '请选择油品' }]}
                        >
                          <Select placeholder="请选择油品">
                            <Option value="92#汽油">92#汽油</Option>
                            <Option value="95#汽油">95#汽油</Option>
                            <Option value="98#汽油">98#汽油</Option>
                            <Option value="0#柴油">0#柴油</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label="数量"
                          rules={[{ required: true, message: '请输入数量' }]}
                        >
                          <InputNumber 
                            style={{ width: '100%' }} 
                            min={1}
                            placeholder="请输入数量"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          label="单价"
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
                  添加结算项
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
                  <Option value="未付款">未付款</Option>
                  <Option value="部分付款">部分付款</Option>
                  <Option value="已付款">已付款</Option>
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

      {/* 查看详情弹窗 */}
      <Modal
        title="结算单详情"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="结算单号">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentRecord.supplierName}</Descriptions.Item>
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
                  currentRecord.paymentStatus === '已付款' ? 'green' :
                  currentRecord.paymentStatus === '部分付款' ? 'orange' : 'red'
                }>
                  {currentRecord.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="付款方式">{currentRecord.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="总金额">￥{currentRecord.totalAmount}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h3>结算明细</h3>
              <Table
                dataSource={currentRecord.items}
                columns={[
                  { title: '采购单号', dataIndex: 'orderId' },
                  { title: '油品', dataIndex: 'productName' },
                  { title: '数量', dataIndex: 'quantity' },
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
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title="结算单审核"
        visible={auditModalVisible}
        onOk={handleAuditSubmit}
        onCancel={() => setAuditModalVisible(false)}
      >
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
      </Modal>
    </div>
  );
};

export default OilPurchaseSettlement; 