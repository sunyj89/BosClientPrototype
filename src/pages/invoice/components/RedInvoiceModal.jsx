import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Alert, Descriptions } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const RedInvoiceModal = ({ 
  visible, 
  onCancel, 
  onOk,
  originalInvoice,
  loading = false 
}) => {
  const [form] = Form.useForm();
  const [redType, setRedType] = useState('full');

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        originalInvoiceNo: originalInvoice?.invoiceNo,
        originalOrderCode: originalInvoice?.orderCode,
        originalAmount: originalInvoice?.totalAmountWithTax
      };
      onOk?.(formData);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleRedTypeChange = (value) => {
    setRedType(value);
    if (value === 'full') {
      form.setFieldsValue({
        redAmount: originalInvoice?.totalAmountWithTax
      });
    } else {
      form.setFieldsValue({
        redAmount: undefined
      });
    }
  };

  if (!originalInvoice) return null;

  return (
    <Modal
      title="发票红冲申请"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={700}
      style={{ borderRadius: '2px' }}
    >
      <Alert
        message="红冲说明"
        description="发票红冲后将生成红字发票，原发票将失效。请确认红冲原因和金额无误后提交申请。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Descriptions 
        title="原发票信息" 
        column={2} 
        bordered 
        size="small"
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="发票号码">
          {originalInvoice.invoiceNo}
        </Descriptions.Item>
        <Descriptions.Item label="开票金额">
          ¥{originalInvoice.totalAmountWithTax?.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="购买方" span={2}>
          {originalInvoice.buyerName}
        </Descriptions.Item>
        <Descriptions.Item label="开票时间" span={2}>
          {originalInvoice.invoiceTime}
        </Descriptions.Item>
      </Descriptions>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          redType: 'full',
          redAmount: originalInvoice?.totalAmountWithTax
        }}
      >
        <Form.Item
          name="redType"
          label="红冲类型"
          rules={[{ required: true, message: '请选择红冲类型' }]}
        >
          <Select onChange={handleRedTypeChange}>
            <Option value="full">全额红冲</Option>
            <Option value="partial">部分红冲</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="redAmount"
          label="红冲金额"
          rules={[
            { required: true, message: '请输入红冲金额' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value <= 0) {
                  return Promise.reject(new Error('红冲金额必须大于0'));
                }
                if (value > originalInvoice?.totalAmountWithTax) {
                  return Promise.reject(new Error('红冲金额不能超过原发票金额'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入红冲金额"
            precision={2}
            max={originalInvoice?.totalAmountWithTax}
            min={0.01}
            disabled={redType === 'full'}
            addonAfter="元"
          />
        </Form.Item>

        <Form.Item
          name="requestReason"
          label="红冲原因"
          rules={[{ required: true, message: '请输入红冲原因' }]}
        >
          <Select placeholder="请选择红冲原因">
            <Option value="客户要求重开">客户要求重开</Option>
            <Option value="金额有误">金额有误</Option>
            <Option value="发票信息错误">发票信息错误</Option>
            <Option value="发票丢失重开">发票丢失重开</Option>
            <Option value="销售退货">销售退货</Option>
            <Option value="其他原因">其他原因</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="remarks"
          label="详细说明"
          rules={[{ required: true, message: '请输入详细说明' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细说明红冲原因和相关情况"
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RedInvoiceModal;