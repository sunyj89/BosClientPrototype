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
  PrinterOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './index.css';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OilOrder = () => {
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

  // 处理查看详情
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 处理打印
  const handlePrint = (record) => {
    console.log('打印订单:', record.id);
    message.success(`正在打印采购单: ${record.id}`);
  };

  // 处理审核
  const handleAudit = (record) => {
    setCurrentRecord(record);
    setAuditModalVisible(true);
  };

  // 审核提交
  const handleAuditSubmit = () => {
    auditForm.validateFields().then(values => {
      console.log('审核提交:', values);
      message.success('审核完成');
      setAuditModalVisible(false);
      fetchData();
    });
  };

  return (
    <div className="oil-purchase-order-page">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>采购管理</Breadcrumb.Item>
        <Breadcrumb.Item>油品采购订单</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="采购单总数" 
                value={stats.totalOrders} 
                prefix={<FileTextOutlined />} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="待审核单据" 
                value={stats.pendingOrders} 
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="采购总金额" 
                value={stats.totalAmount} 
                precision={2}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="未支付金额" 
                value={stats.unpaidAmount} 
                precision={2}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card 
        title="油品采购订单管理" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setCurrentRecord(null);
              setModalVisible(true);
            }}
          >
            新建采购单
          </Button>
        }
      >
        <Form 
          layout="inline" 
          form={filterForm}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="orderNo" label="采购单号">
            <Input placeholder="请输入采购单号" allowClear />
          </Form.Item>
          <Form.Item name="supplier" label="供应商">
            <Select 
              placeholder="请选择供应商" 
              allowClear
              style={{ width: 180 }}
            >
              <Option value="OS001">中石化北京分公司</Option>
              <Option value="OS002">中石油华北销售</Option>
              <Option value="OS003">中海油北方能源</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="采购日期">
            <RangePicker />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select 
              placeholder="请选择状态" 
              allowClear
              style={{ width: 120 }}
            >
              <Option value="待审核">待审核</Option>
              <Option value="已审核">已审核</Option>
              <Option value="已确认">已确认</Option>
              <Option value="已取消">已取消</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={() => console.log('搜索:', filterForm.getFieldsValue())}
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => filterForm.resetFields()}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table 
          columns={columns} 
          dataSource={orderData}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 编辑/新建采购单模态框 */}
      <Modal
        title={currentRecord ? '编辑采购单' : '新建采购单'}
        open={modalVisible}
        width={800}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit}
          >
            保存
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            orderDate: moment(),
            deliveryDate: moment().add(2, 'days'),
            items: [{ quantity: 0, unitPrice: 0, amount: 0 }]
          }}
          onValuesChange={handleItemValuesChange}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="supplierId"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="请选择供应商">
                  <Option value="OS001">中石化北京分公司</Option>
                  <Option value="OS002">中石油华北销售</Option>
                  <Option value="OS003">中海油北方能源</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderDate"
                label="采购日期"
                rules={[{ required: true, message: '请选择采购日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="deliveryDate"
                label="交货日期"
                rules={[{ required: true, message: '请选择交货日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} style={{ marginBottom: 8 }}>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'productName']}
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
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: '请输入数量' }]}
                      >
                        <InputNumber 
                          placeholder="数量" 
                          style={{ width: '100%' }} 
                          min={0}
                          precision={0}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'unit']}
                        initialValue="升"
                      >
                        <Select>
                          <Option value="升">升</Option>
                          <Option value="吨">吨</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'unitPrice']}
                        rules={[{ required: true, message: '请输入单价' }]}
                      >
                        <InputNumber 
                          placeholder="单价" 
                          style={{ width: '100%' }} 
                          min={0}
                          precision={2}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                      >
                        <InputNumber 
                          placeholder="小计" 
                          style={{ width: '100%' }} 
                          disabled
                          precision={2}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      {fields.length > 1 && (
                        <Button 
                          type="text" 
                          danger
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)} 
                        />
                      )}
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add({ quantity: 0, unitPrice: 0, amount: 0 })} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    添加油品
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item name="remarks" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情模态框 */}
      <Modal
        title="采购单详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
          currentRecord?.status === '待审核' && (
            <Button 
              key="audit" 
              type="primary" 
              onClick={() => {
                setViewModalVisible(false);
                handleAudit(currentRecord);
              }}
            >
              审核
            </Button>
          ),
          <Button 
            key="print" 
            onClick={() => {
              handlePrint(currentRecord);
              setViewModalVisible(false);
            }}
          >
            打印
          </Button>
        ]}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={3}>
              <Descriptions.Item label="采购单号">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentRecord.supplierName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '待审核' ? 'orange' :
                  currentRecord.status === '已审核' ? 'blue' :
                  currentRecord.status === '已确认' ? 'green' : 'red'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="采购日期">{currentRecord.orderDate}</Descriptions.Item>
              <Descriptions.Item label="交货日期">{currentRecord.deliveryDate}</Descriptions.Item>
              <Descriptions.Item label="支付状态">
                <Tag color={currentRecord.paymentStatus === '已支付' ? 'green' : 'orange'}>
                  {currentRecord.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={3}>{currentRecord.remarks || '-'}</Descriptions.Item>
            </Descriptions>

            <h3 style={{ margin: '16px 0' }}>采购明细</h3>
            <Table 
              columns={[
                { title: '油品名称', dataIndex: 'productName' },
                { title: '数量', dataIndex: 'quantity' },
                { title: '单位', dataIndex: 'unit' },
                { 
                  title: '单价', 
                  dataIndex: 'unitPrice',
                  render: price => `¥${price.toFixed(2)}`
                },
                { 
                  title: '金额', 
                  dataIndex: 'amount',
                  render: amount => `¥${amount.toLocaleString()}`
                }
              ]}
              dataSource={currentRecord.items}
              pagination={false}
              rowKey={(record, index) => index}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>¥{currentRecord.totalAmount.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </>
        )}
      </Modal>

      {/* 审核模态框 */}
      <Modal
        title="采购单审核"
        open={auditModalVisible}
        onCancel={() => setAuditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAuditModalVisible(false)}>
            取消
          </Button>,
          <Button key="reject" danger onClick={() => {
            auditForm.setFieldsValue({ auditResult: '拒绝' });
            handleAuditSubmit();
          }}>
            拒绝
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            onClick={() => {
              auditForm.setFieldsValue({ auditResult: '通过' });
              handleAuditSubmit();
            }}
          >
            通过
          </Button>
        ]}
      >
        <Form
          form={auditForm}
          layout="vertical"
          initialValues={{ auditResult: '通过' }}
        >
          <Form.Item name="auditResult" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="auditComment" label="审核意见">
            <Input.TextArea rows={4} placeholder="请输入审核意见" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OilOrder; 