import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Table, 
  Space, 
  message, 
  Modal, 
  Descriptions,
  Tag,
  Row,
  Col,
  Divider
} from 'antd';
import { SearchOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import InvoiceAmountDisplay from '../components/InvoiceAmountDisplay';

// 模拟数据导入
import manualInvoiceData from '../../../mock/invoice/redInvoiceAndManual.json';

const { Option } = Select;
const { TextArea } = Input;

const ManualInvoice = () => {
  const [searchForm] = Form.useForm();
  const [invoiceForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
  });

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = async (params = {}) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = manualInvoiceData.manualInvoiceOrders
        .filter(order => order.canInvoice && !order.hasInvoice)
        .map(item => ({
          ...item,
          key: item.id
        }));
      
      setOrderList(data);
      setPagination(prev => ({
        ...prev,
        total: data.length
      }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    const params = {
      ...values,
      startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: values.dateRange?.[1]?.format('YYYY-MM-DD')
    };
    delete params.dateRange;
    
    await loadOrderData(params);
    message.success('查询完成');
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadOrderData();
  };

  const handleCreateInvoice = (record) => {
    setSelectedOrder(record);
    invoiceForm.setFieldsValue({
      buyerName: record.buyerName,
      buyerTaxNo: record.buyerTaxNo,
      buyerAddress: record.buyerAddress,
      buyerPhone: record.buyerPhone,
      invoiceType: record.customerType === '企业' ? '01' : '02',
      emailAddress: ''
    });
    setInvoiceModalVisible(true);
  };

  const handleInvoiceSubmit = async () => {
    try {
      const values = await invoiceForm.validateFields();
      
      message.loading('正在提交开票申请...', 2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('开票申请提交成功');
      setInvoiceModalVisible(false);
      loadOrderData();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const renderOrderInfo = () => {
    if (!selectedOrder) return null;
    
    return (
      <Card title="订单信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="订单编号">
            {selectedOrder.orderCode}
          </Descriptions.Item>
          <Descriptions.Item label="油站名称">
            {selectedOrder.stationName}
          </Descriptions.Item>
          <Descriptions.Item label="下单时间">
            {selectedOrder.orderTime}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">
            <InvoiceAmountDisplay 
              totalWithTax={selectedOrder.totalAmountWithTax}
              amount={selectedOrder.totalAmount}
              tax={selectedOrder.totalTax}
              showDetail={true}
            />
          </Descriptions.Item>
          <Descriptions.Item label="商品明细" span={2}>
            <Table
              size="small"
              dataSource={selectedOrder.products}
              pagination={false}
              columns={[
                { title: '商品名称', dataIndex: 'productName', width: 120 },
                { title: '数量', dataIndex: 'quantity', width: 80, align: 'right' },
                { title: '单位', dataIndex: 'unit', width: 60 },
                { title: '单价', dataIndex: 'unitPrice', width: 80, align: 'right', render: v => `¥${v}` },
                { title: '金额', dataIndex: 'amount', width: 100, align: 'right', render: v => `¥${v.toFixed(2)}` }
              ]}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  const searchColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderCode',
      width: 160
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      width: 180,
      ellipsis: true
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      width: 100,
      render: (text) => (
        <Tag color={text === '企业' ? 'blue' : 'green'}>
          {text}
        </Tag>
      )
    },
    {
      title: '购买方',
      dataIndex: 'buyerName',
      width: 200,
      ellipsis: true
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmountWithTax',
      width: 120,
      align: 'right',
      render: (value, record) => (
        <InvoiceAmountDisplay 
          totalWithTax={value}
          amount={record.totalAmount}
          tax={record.totalTax}
        />
      )
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<FileTextOutlined />}
          onClick={() => handleCreateInvoice(record)}
          style={{ borderRadius: '2px' }}
        >
          开票
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* 搜索区域 */}
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Form 
          form={searchForm} 
          layout="inline" 
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="orderCode" label="订单编号" style={{ width: 200 }}>
            <Input placeholder="请输入订单编号" />
          </Form.Item>
          
          <Form.Item name="stationName" label="油站名称" style={{ width: 200 }}>
            <Select placeholder="请选择油站" allowClear>
              <Option value="昌北收费站服务区加油站">昌北收费站服务区加油站</Option>
              <Option value="德安服务区加油站">德安服务区加油站</Option>
              <Option value="庐山服务区加油站">庐山服务区加油站</Option>
              <Option value="南昌西服务区加油站">南昌西服务区加油站</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="customerType" label="客户类型" style={{ width: 120 }}>
            <Select placeholder="请选择" allowClear>
              <Option value="企业">企业</Option>
              <Option value="个人">个人</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="buyerName" label="购买方" style={{ width: 200 }}>
            <Input placeholder="请输入购买方名称" />
          </Form.Item>
        </Form>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />}
              loading={loading}
              onClick={() => searchForm.submit()}
              style={{ borderRadius: '2px' }}
            >
              查询
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              style={{ borderRadius: '2px' }}
            >
              重置
            </Button>
          </Space>
        </div>
      </Card>

      {/* 订单列表 */}
      <Card title="可开票订单列表">
        <Table
          columns={searchColumns}
          dataSource={orderList}
          loading={loading}
          pagination={pagination}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>

      {/* 开票申请弹窗 */}
      <Modal
        title="手动开票申请"
        open={invoiceModalVisible}
        onCancel={() => setInvoiceModalVisible(false)}
        onOk={handleInvoiceSubmit}
        width={800}
        style={{ borderRadius: '2px' }}
      >
        {renderOrderInfo()}
        
        <Card title="发票信息" size="small">
          <Form
            form={invoiceForm}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="buyerName"
                  label="购买方名称"
                  rules={[{ required: true, message: '请输入购买方名称' }]}
                >
                  <Input placeholder="请输入购买方名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="buyerTaxNo"
                  label="纳税人识别号"
                >
                  <Input placeholder="请输入纳税人识别号" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="buyerAddress"
                  label="购买方地址"
                >
                  <Input placeholder="请输入购买方地址" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="buyerPhone"
                  label="联系电话"
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="invoiceType"
                  label="发票类型"
                  rules={[{ required: true, message: '请选择发票类型' }]}
                >
                  <Select placeholder="请选择发票类型">
                    <Option value="01">增值税普通发票</Option>
                    <Option value="02">增值税电子普通发票</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="emailAddress"
                  label="邮箱地址"
                  rules={[
                    { type: 'email', message: '请输入正确的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入邮箱地址（可选）" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="remarks"
              label="备注信息"
            >
              <TextArea
                rows={3}
                placeholder="请输入备注信息（可选）"
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default ManualInvoice;