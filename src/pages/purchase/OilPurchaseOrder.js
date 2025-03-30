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
  Descriptions
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
  PrinterOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OilPurchaseOrder = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditForm] = Form.useForm();

  // 模拟数据 - 采购单
  const mockOrders = [
    {
      key: '1',
      id: 'PO20240315001',
      supplierId: 'OS001',
      supplierName: '中石化北京分公司',
      orderDate: '2024-03-15',
      deliveryDate: '2024-03-17',
      status: '待审核',
      items: [
        { 
          productName: '92#汽油',
          quantity: 20000,
          unit: '升',
          unitPrice: 6.89,
          amount: 137800
        },
        {
          productName: '95#汽油',
          quantity: 15000,
          unit: '升',
          unitPrice: 7.32,
          amount: 109800
        }
      ],
      totalAmount: 247600,
      paymentStatus: '未支付',
      remarks: '常规补货'
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
      setOrderData(mockOrders);
      setLoading(false);
    }, 500);
  };

  // 采购单列表列配置
  const columns = [
    {
      title: '采购单号',
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
      title: '采购日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
    },
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 120,
    },
    {
      title: '采购金额',
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
      width: 280,
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

  // 获取统计数据
  const getStatistics = () => {
    return {
      totalOrders: orderData.length,
      pendingOrders: orderData.filter(o => o.status === '待审核').length,
      totalAmount: orderData.reduce((sum, order) => sum + order.totalAmount, 0),
      unpaidAmount: orderData.filter(o => o.paymentStatus === '未支付')
        .reduce((sum, order) => sum + order.totalAmount, 0)
    };
  };

  const stats = getStatistics();

  // 处理编辑
  const handleEdit = (record) => {
    const formData = {
      ...record,
      orderDate: moment(record.orderDate),
      deliveryDate: moment(record.deliveryDate),
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
        orderDate: values.orderDate.format('YYYY-MM-DD'),
        deliveryDate: values.deliveryDate.format('YYYY-MM-DD'),
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

  // 查看详情
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 审核
  const handleAudit = (record) => {
    setCurrentRecord(record);
    setAuditModalVisible(true);
  };

  // 审核操作
  const handleAuditSubmit = () => {
    auditForm.validateFields().then(values => {
      console.log('审核信息:', values);
      message.success('审核成功');
      setAuditModalVisible(false);
      fetchData();
    });
  };

  // 处理打印
  const handlePrint = (record) => {
    message.success(`正在打印采购单：${record.id}`);
  };

  return (
    <div>
      <div className="page-header">
        <h2>油品采购单管理</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="采购单总数" 
              value={stats.totalOrders} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待审核采购单" 
              value={stats.pendingOrders} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="采购总金额" 
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
          <Form.Item name="id" label="采购单号">
            <Input placeholder="请输入采购单号" allowClear />
          </Form.Item>
          <Form.Item name="dateRange" label="采购日期">
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
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                新建采购单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 采购单列表 */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={orderData}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 编辑模态框 */}
      <Modal
        title={currentRecord ? '编辑采购单' : '新建采购单'}
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
                name="orderDate" 
                label="采购日期"
                rules={[{ required: true, message: '请选择采购日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="deliveryDate" 
                label="交货日期"
                rules={[{ required: true, message: '请选择交货日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
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

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card 
                    key={key} 
                    style={{ marginBottom: 16 }} 
                    title={`采购项 #${name + 1}`}
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
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unit']}
                          label="单位"
                          rules={[{ required: true, message: '请选择单位' }]}
                        >
                          <Select placeholder="请选择单位">
                            <Option value="升">升</Option>
                            <Option value="吨">吨</Option>
                          </Select>
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
                  添加采购项
                </Button>
              </>
            )}
          </Form.List>

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
        title="采购单详情"
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
          <Descriptions bordered column={2}>
            <Descriptions.Item label="采购单号">{currentRecord.id}</Descriptions.Item>
            <Descriptions.Item label="供应商">{currentRecord.supplierName}</Descriptions.Item>
            <Descriptions.Item label="采购日期">{currentRecord.orderDate}</Descriptions.Item>
            <Descriptions.Item label="交货日期">{currentRecord.deliveryDate}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                currentRecord.status === '已审核' ? 'green' :
                currentRecord.status === '待审核' ? 'orange' :
                currentRecord.status === '已确认' ? 'blue' : 'red'
              }>
                {currentRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="总金额">￥{currentRecord.totalAmount}</Descriptions.Item>
          </Descriptions>
        )}
        
        {currentRecord?.items && (
          <div style={{ marginTop: 24 }}>
            <h3>采购明细</h3>
            <Table
              dataSource={currentRecord.items}
              columns={[
                { title: '油品', dataIndex: 'productName' },
                { title: '数量', dataIndex: 'quantity' },
                { title: '单位', dataIndex: 'unit' },
                { title: '单价', dataIndex: 'unitPrice' },
                { title: '金额', dataIndex: 'amount' }
              ]}
              pagination={false}
            />
          </div>
        )}

        {currentRecord?.remarks && (
          <div style={{ marginTop: 24 }}>
            <h3>备注</h3>
            <p>{currentRecord.remarks}</p>
          </div>
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title="采购单审核"
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

export default OilPurchaseOrder; 