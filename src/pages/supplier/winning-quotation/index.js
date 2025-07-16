import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Descriptions, 
  Tag, 
  Divider, 
  List, 
  Space, 
  message, 
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select
} from 'antd';
import { 
  FilePdfOutlined, 
  DownloadOutlined, 
  MailOutlined, 
  FileTextOutlined,
  PrinterOutlined,
  ShoppingOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 模拟中标报价单数据
const mockWinningQuotation = {
  id: "QUO20240520002",
  inquiryId: "INQ20240501004",
  inquiryName: "5月份0#柴油询价单",
  status: "中标报价单",
  supplierId: "SP004",
  supplierName: "中海油能源发展股份有限公司",
  oilType: "0#柴油",
  unitPrice: 7820,
  quantity: 40000,
  deliveryTime: "2024-05-31 14:00:00",
  deliveryAddress: "江西省南昌市高新区",
  includeFreight: true,
  submitTime: "2024-05-19 15:45:20",
  contactPerson: "李经理",
  contactPhone: "13678901234",
  contactEmail: "manager.li@cnooc.com",
  attachments: [
    {
      name: "报价单文件.pdf",
      url: "/uploads/quo20240520002_file.pdf"
    },
    {
      name: "质量保证书.pdf",
      url: "/uploads/quo20240520002_quality.pdf"
    }
  ],
  remarks: "可以优先配送，保证油品质量"
};

const WinningQuotation = () => {
  // 状态定义
  const [quotation] = useState(mockWinningQuotation);
  const [createOrderVisible, setCreateOrderVisible] = useState(false);
  const [notifySupplierVisible, setNotifySupplierVisible] = useState(false);
  const [orderForm] = Form.useForm();
  const [notifyForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // 处理下载附件
  const handleDownload = (file) => {
    message.info(`下载附件: ${file.name}`);
    // 实际实现应该是发送请求下载文件
  };
  
  // 处理创建采购订单
  const handleCreateOrder = () => {
    // 设置表单初始值
    orderForm.setFieldsValue({
      inquiryId: quotation.inquiryId,
      inquiryName: quotation.inquiryName,
      supplierId: quotation.supplierId,
      supplierName: quotation.supplierName,
      oilType: quotation.oilType,
      quantity: quotation.quantity,
      unitPrice: quotation.unitPrice,
      totalAmount: quotation.quantity * quotation.unitPrice,
      deliveryAddress: quotation.deliveryAddress,
      contactPerson: quotation.contactPerson,
      contactPhone: quotation.contactPhone,
      expectedDeliveryTime: quotation.deliveryTime
    });
    
    setCreateOrderVisible(true);
  };
  
  // 提交采购订单
  const handleSubmitOrder = () => {
    orderForm.validateFields().then(values => {
      setLoading(true);
      
      // 模拟提交请求
      setTimeout(() => {
        console.log('采购订单数据:', values);
        setLoading(false);
        setCreateOrderVisible(false);
        message.success('采购订单创建成功');
      }, 1000);
    });
  };
  
  // 处理通知供应商
  const handleNotifySupplier = () => {
    // 设置表单初始值
    notifyForm.setFieldsValue({
      to: quotation.contactEmail,
      subject: `中标通知：${quotation.inquiryName}`,
      content: `尊敬的${quotation.supplierName}：\n\n恭喜贵公司在"${quotation.inquiryName}"(询价单号: ${quotation.inquiryId})中成功中标。\n\n请贵公司尽快安排后续交付事宜，我方将在近期内与您联系，商讨具体合作细节。\n\n特此通知！\n\n江西交投化石能源有限公司\n采购部`
    });
    
    setNotifySupplierVisible(true);
  };
  
  // 发送通知
  const handleSendNotification = () => {
    notifyForm.validateFields().then(values => {
      setLoading(true);
      
      // 模拟发送请求
      setTimeout(() => {
        console.log('通知数据:', values);
        setLoading(false);
        setNotifySupplierVisible(false);
        message.success('通知已发送给供应商');
      }, 1000);
    });
  };
  
  // 打印报价确认单
  const handlePrintConfirmation = () => {
    message.success('正在打印报价确认单');
    // 实际实现应该是调用打印API或生成PDF
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>中标报价单详情</Title>
          <Tag color="gold" style={{ fontSize: 14, padding: '4px 8px' }}>中标报价单</Tag>
        </div>
        
        <Descriptions bordered column={2} size="default">
          <Descriptions.Item label="报价单ID" span={1}>{quotation.id}</Descriptions.Item>
          <Descriptions.Item label="询价单ID" span={1}>{quotation.inquiryId}</Descriptions.Item>
          <Descriptions.Item label="询价单名称" span={2}>{quotation.inquiryName}</Descriptions.Item>
          <Descriptions.Item label="供应商名称" span={2}>{quotation.supplierName}</Descriptions.Item>
          <Descriptions.Item label="联系人" span={1}>{quotation.contactPerson}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={1}>{quotation.contactPhone}</Descriptions.Item>
          <Descriptions.Item label="电子邮箱" span={2}>{quotation.contactEmail}</Descriptions.Item>
          <Descriptions.Item label="油品类型" span={1}>{quotation.oilType}</Descriptions.Item>
          <Descriptions.Item label="单价(元/吨)" span={1}>{quotation.unitPrice}</Descriptions.Item>
          <Descriptions.Item label="数量(吨)" span={1}>{quotation.quantity}</Descriptions.Item>
          <Descriptions.Item label="总金额(元)" span={1}>{quotation.unitPrice * quotation.quantity}</Descriptions.Item>
          <Descriptions.Item label="是否包含运费" span={1}>{quotation.includeFreight ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="提交时间" span={1}>{quotation.submitTime}</Descriptions.Item>
          <Descriptions.Item label="到货时间" span={1}>{quotation.deliveryTime}</Descriptions.Item>
          <Descriptions.Item label="交货地点" span={1}>{quotation.deliveryAddress}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{quotation.remarks}</Descriptions.Item>
        </Descriptions>
        
        <Divider orientation="left">附件</Divider>
        
        {quotation.attachments && quotation.attachments.length > 0 ? (
          <List
            size="small"
            bordered
            dataSource={quotation.attachments}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    icon={<DownloadOutlined />} 
                    onClick={() => handleDownload(item)}
                  >
                    下载
                  </Button>
                ]}
              >
                <Space>
                  <FilePdfOutlined />
                  <Text>{item.name}</Text>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">无附件</Text>
        )}
        
        <Divider />
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
          <Button 
            type="primary" 
            icon={<ShoppingOutlined />} 
            onClick={handleCreateOrder} 
            size="large"
          >
            创建采购订单
          </Button>
          <Button 
            type="primary" 
            icon={<MailOutlined />} 
            onClick={handleNotifySupplier}
            size="large"
          >
            通知中标供应商
          </Button>
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={handlePrintConfirmation}
            size="large"
          >
            打印报价确认单
          </Button>
        </div>
      </Card>
      
      {/* 创建采购订单弹窗 */}
      <Modal
        title="创建采购订单"
        visible={createOrderVisible}
        onCancel={() => setCreateOrderVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCreateOrderVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={handleSubmitOrder}
          >
            提交
          </Button>
        ]}
        width={800}
      >
        <Form
          form={orderForm}
          layout="vertical"
          requiredMark="optional"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="询价单ID" name="inquiryId">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="询价单名称" name="inquiryName">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="供应商ID" name="supplierId">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="供应商名称" name="supplierName">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="油品类型" name="oilType">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="数量(吨)" name="quantity">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="单价(元/吨)" name="unitPrice">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="总金额(元)" name="totalAmount">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="付款方式" 
                name="paymentMethod"
                rules={[{ required: true, message: '请选择付款方式' }]}
              >
                <Select placeholder="请选择付款方式">
                  <Option value="预付款">预付款</Option>
                  <Option value="货到付款">货到付款</Option>
                  <Option value="分期付款">分期付款</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="联系人" name="contactPerson">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="contactPhone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="预计交货时间" name="expectedDeliveryTime">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="订单日期" 
                name="orderDate"
                rules={[{ required: true, message: '请选择订单日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="交货地址" name="deliveryAddress">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="备注" name="remarks">
                <TextArea rows={4} placeholder="请输入备注信息（可选）" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
      {/* 通知供应商弹窗 */}
      <Modal
        title="通知中标供应商"
        visible={notifySupplierVisible}
        onCancel={() => setNotifySupplierVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setNotifySupplierVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={handleSendNotification}
          >
            发送
          </Button>
        ]}
        width={600}
      >
        <Form
          form={notifyForm}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item 
            label="收件人" 
            name="to"
            rules={[{ required: true, message: '请输入收件人邮箱' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="抄送" 
            name="cc"
          >
            <Input placeholder="多个邮箱请用英文分号;分隔" />
          </Form.Item>
          <Form.Item 
            label="主题" 
            name="subject"
            rules={[{ required: true, message: '请输入邮件主题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="正文" 
            name="content"
            rules={[{ required: true, message: '请输入邮件内容' }]}
          >
            <TextArea rows={12} />
          </Form.Item>
          <Form.Item label="附件">
            <Button icon={<FileTextOutlined />}>添加附件</Button>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              可添加报价确认单等文件
            </Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WinningQuotation; 