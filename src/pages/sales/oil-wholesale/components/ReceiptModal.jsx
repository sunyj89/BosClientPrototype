import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Upload, Button, Card, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { oilWholesaleService } from '../services/oilWholesaleService.jsx';

const { Option } = Select;
const { TextArea } = Input;

const ReceiptModal = ({ visible, editingReceipt, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderOptions, setOrderOptions] = useState([]);

  useEffect(() => {
    if (visible) {
      loadOrderOptions();
      if (editingReceipt) {
        // 编辑模式，填充表单数据
        form.setFieldsValue({
          receiptNumber: editingReceipt.receiptNumber,
          relatedOrderId: editingReceipt.relatedOrderId,
          supplierId: editingReceipt.supplierId,
          quotationId: editingReceipt.quotationId,
          arrivalTime: editingReceipt.arrivalTime ? moment(editingReceipt.arrivalTime) : undefined,
          actualWeightKg: editingReceipt.actualWeightKg,
          varianceReason: editingReceipt.varianceReason,
          remarks: editingReceipt.remarks,
          weighingSlips: editingReceipt.weighingSlips || []
        });
      } else {
        // 新建模式，重置表单并设置默认值
        form.resetFields();
        const receiptNumber = `SH${moment().format('YYYYMMDD')}${String(Math.random()).substring(2, 6).padStart(4, '0')}`;
        form.setFieldsValue({ receiptNumber });
      }
    }
  }, [visible, editingReceipt, form]);

  const loadOrderOptions = async () => {
    try {
      const response = await oilWholesaleService.getOrderList();
      setOrderOptions(response.data || []);
    } catch (error) {
      console.error('加载订单选项失败:', error);
      // 使用模拟数据
      const mockOrders = [
        { id: 'ORDER001', orderNumber: 'DH202501250001', oilType: '92#汽油', quantityTons: 10.5 },
        { id: 'ORDER002', orderNumber: 'DH202501250002', oilType: '95#汽油', quantityTons: 15.2 },
        { id: 'ORDER003', orderNumber: 'DH202501240001', oilType: '0#柴油', quantityTons: 25.8 }
      ];
      setOrderOptions(mockOrders);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 计算实际数量（这里简化处理，实际应该根据油品密度计算）
      const actualQuantityTons = (values.actualWeightKg / 1000).toFixed(2);
      
      // 获取订购数量来计算差异
      let orderedQuantityTons = 0;
      if (values.relatedOrderId) {
        const relatedOrder = orderOptions.find(order => order.id === values.relatedOrderId);
        if (relatedOrder) {
          orderedQuantityTons = relatedOrder.quantityTons;
        }
      }
      
      const varianceTons = (parseFloat(actualQuantityTons) - orderedQuantityTons).toFixed(2);
      
      const receiptData = {
        ...values,
        actualQuantityTons: parseFloat(actualQuantityTons),
        varianceTons: parseFloat(varianceTons),
        arrivalTime: values.arrivalTime?.format('YYYY-MM-DD HH:mm:ss'),
        id: editingReceipt ? editingReceipt.id : `RECEIPT${String(Math.random()).substring(2, 5).padStart(3, '0')}`,
        receiptStatus: 'pending',
        receiver: '当前用户', // 实际应该从登录用户获取
        receiverId: 'CURRENT_USER',
        createTime: editingReceipt ? editingReceipt.createTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        confirmTime: null
      };
      
      if (editingReceipt) {
        await oilWholesaleService.updateReceipt(editingReceipt.id, receiptData);
        message.success('收货确认单修改成功');
      } else {
        await oilWholesaleService.createReceipt(receiptData);
        message.success('收货确认单创建成功');
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
    action: '/api/upload/image',
    listType: 'picture-card',
    multiple: true,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB!');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 图片上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 图片上传失败`);
      }
    }
  };

  return (
    <Modal
      title={
        editingReceipt ? (
          <><EditOutlined /> 编辑收货确认单 - {editingReceipt.receiptNumber}</>
        ) : (
          <><PlusOutlined /> 新建收货确认单</>
        )
      }
      open={visible}
      width={1000}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {editingReceipt ? '保存修改' : '创建确认单'}
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
        <Card title="关联信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="receiptNumber"
                label="收货单号"
                rules={[{ required: true, message: '请输入收货单号' }]}
              >
                <Input placeholder="系统自动生成" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="relatedOrderId"
                label="关联订货通知单"
                rules={[{ required: true, message: '请选择关联的订货通知单' }]}
              >
                <Select placeholder="请选择订货通知单">
                  {orderOptions.map(order => (
                    <Option key={order.id} value={order.id}>
                      {order.orderNumber} - {order.oilType} ({order.quantityTons}吨)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="supplierId"
                label="关联供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="请选择供应商">
                  <Option value="SUP001">中石化江西分公司</Option>
                  <Option value="SUP002">中石油江西销售公司</Option>
                  <Option value="SUP003">中海油江西分公司</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="quotationId"
                label="关联报价单"
                rules={[{ required: true, message: '请选择关联的报价单' }]}
              >
                <Select placeholder="请选择报价单">
                  <Option value="QUO202501250001">BJD202501250001</Option>
                  <Option value="QUO202501250002">BJD202501250002</Option>
                  <Option value="QUO202501240001">BJD202501240001</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="收货信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="arrivalTime"
                label="到货时间"
                rules={[{ required: true, message: '请选择到货时间' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  placeholder="请选择到货时间"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="actualWeightKg"
                label="到货重量（净重kg）"
                rules={[
                  { required: true, message: '请输入到货重量' },
                  { type: 'number', min: 0, message: '重量必须大于0' }
                ]}
              >
                <InputNumber
                  min={0}
                  precision={1}
                  style={{ width: '100%' }}
                  placeholder="请输入净重（kg）"
                  addonAfter="kg"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weighingSlips"
                label="上传过磅单（图片）"
                rules={[{ required: true, message: '请上传过磅单' }]}
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传过磅单</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="varianceReason"
                label="差异原因"
              >
                <TextArea 
                  rows={3} 
                  placeholder="如有差异，请填写差异原因"
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="备注信息">
          <Form.Item
            name="remarks"
            label="备注说明"
          >
            <TextArea 
              rows={3} 
              placeholder="请输入收货备注信息"
              maxLength={1000}
            />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default ReceiptModal;