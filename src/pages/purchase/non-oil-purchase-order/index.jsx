import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  DatePicker,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  FileTextOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const NonOilPurchaseOrder = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // 模拟数据 - 非油品采购单
  const mockOrders = [
    {
      key: '1',
      id: 'NPO20240315001',
      supplierId: 'NS001',
      supplierName: '江西食品供应商有限公司',
      orderDate: '2024-03-15',
      deliveryDate: '2024-03-17',
      status: '待审核',
      items: [
        { 
          productName: '方便面',
          quantity: 200,
          unit: '箱',
          unitPrice: 120,
          amount: 24000
        },
        {
          productName: '矿泉水',
          quantity: 100,
          unit: '箱',
          unitPrice: 40,
          amount: 4000
        }
      ],
      totalAmount: 28000,
      paymentStatus: '未支付',
      remarks: '便利店补货'
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
      fixed: 'right',
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

  // 处理编辑操作
  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      orderDate: moment(record.orderDate),
      deliveryDate: moment(record.deliveryDate),
    });
    setModalVisible(true);
  };

  // 处理新建操作
  const handleAdd = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      orderDate: moment(),
      deliveryDate: moment().add(2, 'days'),
    });
    setModalVisible(true);
  };

  // 处理查看操作
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 处理打印操作
  const handlePrint = (record) => {
    message.success(`打印采购单: ${record.id}`);
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        // 这里处理表单提交
        message.success('保存成功');
        setModalVisible(false);
        fetchData(); // 刷新数据
      })
      .catch(info => {
        console.log('验证失败:', info);
      });
  };

  // 表单提交
  const onFinish = (values) => {
    setLoading(true);
    console.log('提交的筛选条件: ', values);
    // 这里应该调用API进行筛选查询
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 重置表单
  const handleReset = () => {
    filterForm.resetFields();
  };

  return (
    <div className="non-oil-purchase-order-container">
      {/* 筛选表单 */}
      <Form 
        form={filterForm}
        layout="inline"
        onFinish={onFinish}
        style={{ marginBottom: '16px', padding: '16px 0' }}
      >
        <Form.Item name="keyword" label="关键字">
          <Input placeholder="采购单号/供应商" allowClear />
        </Form.Item>
        <Form.Item name="dateRange" label="采购日期">
          <RangePicker />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" allowClear style={{ width: 160 }}>
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
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 表格 */}
      <Table 
        columns={columns}
        dataSource={orderData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      {/* 编辑/新建弹窗 */}
      <Modal
        title={currentRecord ? '编辑采购单' : '新建采购单'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplierId"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="请选择供应商">
                  <Option value="NS001">江西食品供应商有限公司</Option>
                  <Option value="NS002">南昌百货有限公司</Option>
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
                label="预计交货日期"
                rules={[{ required: true, message: '请选择预计交货日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
          {/* 这里应该有采购明细表格 */}
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
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => handlePrint(currentRecord)}>
            打印
          </Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <div className="detail-item">
                  <span className="detail-label">采购单号:</span>
                  <span className="detail-value">{currentRecord.id}</span>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <span className="detail-label">供应商:</span>
                  <span className="detail-value">{currentRecord.supplierName}</span>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <span className="detail-label">状态:</span>
                  <span className="detail-value">
                    <Tag color={currentRecord.status === '已确认' ? 'green' : 'orange'}>
                      {currentRecord.status}
                    </Tag>
                  </span>
                </div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}>
                <div className="detail-item">
                  <span className="detail-label">采购日期:</span>
                  <span className="detail-value">{currentRecord.orderDate}</span>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <span className="detail-label">交货日期:</span>
                  <span className="detail-value">{currentRecord.deliveryDate}</span>
                </div>
              </Col>
              <Col span={8}>
                <div className="detail-item">
                  <span className="detail-label">总金额:</span>
                  <span className="detail-value">¥{currentRecord.totalAmount.toLocaleString()}</span>
                </div>
              </Col>
            </Row>
            <div style={{ marginTop: 20 }}>
              <h3>采购明细</h3>
              <Table 
                dataSource={currentRecord.items}
                pagination={false}
                rowKey="productName"
                columns={[
                  { title: '商品名称', dataIndex: 'productName', key: 'productName' },
                  { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                  { title: '单位', dataIndex: 'unit', key: 'unit' },
                  { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price) => `¥${price}` },
                  { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount) => `¥${amount.toLocaleString()}` },
                ]}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NonOilPurchaseOrder; 