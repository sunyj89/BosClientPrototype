import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Upload, Button, Card, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { oilWholesaleService } from '../services/oilWholesaleService.jsx';

const { Option } = Select;
const { TextArea } = Input;

const OrderModal = ({ visible, editingOrder, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editingOrder) {
        // 编辑模式，填充表单数据
        form.setFieldsValue({
          orderNumber: editingOrder.orderNumber,
          orderDate: editingOrder.orderDate ? moment(editingOrder.orderDate) : undefined,
          orderingCompany: editingOrder.orderingCompany,
          oilType: editingOrder.oilType,
          quantityTons: editingOrder.quantityTons,
          requiredDeliveryDate: editingOrder.requiredDeliveryDate ? moment(editingOrder.requiredDeliveryDate) : undefined,
          deliveryAddress: editingOrder.deliveryAddress,
          receiverName: editingOrder.receiverName,
          contactPhone: editingOrder.contactPhone,
          idCardNumber: editingOrder.idCardNumber,
          attachments: editingOrder.attachments || []
        });
      } else {
        // 新建模式，重置表单并设置默认值
        form.resetFields();
        const orderNumber = `DH${moment().format('YYYYMMDD')}${String(Math.random()).substring(2, 6).padStart(4, '0')}`;
        form.setFieldsValue({ 
          orderNumber,
          orderDate: moment()
        });
      }
    }
  }, [visible, editingOrder, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const orderData = {
        ...values,
        orderDate: values.orderDate?.format('YYYY-MM-DD'),
        requiredDeliveryDate: values.requiredDeliveryDate?.format('YYYY-MM-DD'),
        id: editingOrder ? editingOrder.id : `ORDER${String(Math.random()).substring(2, 5).padStart(3, '0')}`,
        orderStatus: 'pending_delivery',
        createTime: editingOrder ? editingOrder.createTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        creator: '当前用户', // 实际应该从登录用户获取
        approver: '待审批',
        approvalTime: null
      };
      
      if (editingOrder) {
        await oilWholesaleService.updateOrder(editingOrder.id, orderData);
        message.success('订货通知单修改成功');
      } else {
        await oilWholesaleService.createOrder(orderData);
        message.success('订货通知单创建成功');
      }
      
      onSuccess();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    listType: 'text',
    multiple: true,
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/msword' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type === 'application/vnd.ms-excel' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isValidType) {
        message.error('只能上传PDF、Word、Excel格式文件!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB!');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    }
  };

  return (
    <Modal
      title={
        editingOrder ? (
          <><EditOutlined /> 编辑订货通知单 - {editingOrder.orderNumber}</>
        ) : (
          <><PlusOutlined /> 新建订货通知单</>
        )
      }
      open={visible}
      width={1000}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {editingOrder ? '保存修改' : '创建订单'}
        </Button>
      ]}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="orderNumber"
                label="订单编号"
                rules={[{ required: true, message: '请输入订单编号' }]}
              >
                <Input placeholder="系统自动生成" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderDate"
                label="下单日期"
                rules={[{ required: true, message: '请选择下单日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="请选择下单日期"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderingCompany"
                label="订货单位"
                rules={[{ required: true, message: '请选择订货单位' }]}
              >
                <Select placeholder="请选择订货单位">
                  <Option value="江西交投化石能源公司赣中分公司">江西交投化石能源公司赣中分公司</Option>
                  <Option value="江西交投化石能源公司赣东北分公司">江西交投化石能源公司赣东北分公司</Option>
                  <Option value="江西交投化石能源公司赣南分公司">江西交投化石能源公司赣南分公司</Option>
                  <Option value="江西交投化石能源公司赣西分公司">江西交投化石能源公司赣西分公司</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="oilType"
                label="油品种类"
                rules={[{ required: true, message: '请选择油品种类' }]}
              >
                <Select placeholder="请选择油品种类">
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                  <Option value="-10#柴油">-10#柴油</Option>
                  <Option value="-20#柴油">-20#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quantityTons"
                label="订货数量（吨）"
                rules={[
                  { required: true, message: '请输入订货数量' },
                  { type: 'number', min: 0.1, message: '订货数量必须大于0.1吨' }
                ]}
              >
                <InputNumber
                  min={0.1}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="请输入订货数量"
                  addonAfter="吨"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="requiredDeliveryDate"
                label="需到货日期"
                rules={[{ required: true, message: '请选择需到货日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="请选择需到货日期"
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="收货信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="deliveryAddress"
                label="收货地址"
                rules={[{ required: true, message: '请输入收货地址' }]}
              >
                <TextArea 
                  rows={2} 
                  placeholder="请输入详细的收货地址"
                  maxLength={200}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="receiverName"
                label="收货人"
                rules={[{ required: true, message: '请输入收货人姓名' }]}
              >
                <Input placeholder="请输入收货人姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contactPhone"
                label="联系方式"
                rules={[
                  { required: true, message: '请输入联系方式' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="idCardNumber"
                label="联系人身份证号"
                rules={[
                  { required: true, message: '请输入身份证号码' },
                  { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码' }
                ]}
              >
                <Input placeholder="请输入18位身份证号码" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="附件信息">
          <Form.Item
            name="attachments"
            label="上传附件（订货通知单和询价函）"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
              支持上传PDF、Word、Excel格式文件，单个文件不超过10MB
            </div>
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default OrderModal;