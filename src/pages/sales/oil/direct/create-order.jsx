import React, { useState } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Row,
  Col,
  message,
  Typography,
  Divider,
  Modal
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateDirectSalesOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  
  // 计算销售金额
  const calculateAmount = (volume, price) => {
    if (volume && price) {
      return (volume * price).toFixed(2);
    }
    return 0;
  };

  // 处理数量或价格变化
  const handleVolumeOrPriceChange = () => {
    const volume = form.getFieldValue('volume');
    const price = form.getFieldValue('price');
    const amount = calculateAmount(volume, price);
    setCalculatedAmount(amount);
    form.setFieldsValue({ amount });
  };

  // 返回列表页
  const handleBack = () => {
    Modal.confirm({
      title: '确认返回',
      content: '您有未保存的内容，确定要返回吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => navigate('/sales/oil/direct')
    });
  };

  // 保存为草稿
  const handleSaveDraft = () => {
    form.validateFields().then(values => {
      setLoading(true);
      // 模拟API请求
      setTimeout(() => {
        console.log('保存草稿:', values);
        message.success('订单已保存为草稿');
        setLoading(false);
        navigate('/sales/oil/direct');
      }, 1000);
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  // 提交订单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      // 模拟API请求
      setTimeout(() => {
        console.log('提交订单:', values);
        message.success('订单已提交，等待审批');
        setLoading(false);
        navigate('/sales/oil/direct');
      }, 1000);
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  return (
    <div className="direct-sales-container">
      <div className="direct-sales-header">
        <Space>
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="ant-btn-primary"
          >
            返回列表
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            新建油品直销订单
          </Title>
        </Space>
        <Space>
          <Button 
            loading={loading}
            icon={<SaveOutlined />} 
            onClick={handleSaveDraft}
          >
            保存草稿
          </Button>
          <Button 
            type="primary" 
            loading={loading}
            icon={<CheckOutlined />} 
            onClick={handleSubmit}
            className="ant-btn-success"
          >
            提交订单
          </Button>
        </Space>
      </div>

      <Card className="direct-sales-form-card">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            deliveryTime: moment().add(3, 'days'),
            transportMethod: '自提',
            paymentMethod: '月结'
          }}
        >
          <Divider orientation="left">基本信息</Divider>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="customer"
                label="客户名称"
                rules={[{ required: true, message: '请选择客户' }]}
              >
                <Select placeholder="请选择客户">
                  <Option value="中石化XX分公司">中石化XX分公司</Option>
                  <Option value="中石油XX分公司">中石油XX分公司</Option>
                  <Option value="XX物流公司">XX物流公司</Option>
                  <Option value="XX运输公司">XX运输公司</Option>
                  <Option value="XX加油站">XX加油站</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="customerContact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="customerPhone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">油品信息</Divider>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="oilType"
                label="油品类型"
                rules={[{ required: true, message: '请选择油品类型' }]}
              >
                <Select placeholder="请选择油品类型">
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="volume"
                label="销售数量(升)"
                rules={[
                  { required: true, message: '请输入销售数量' },
                  { type: 'number', min: 1, message: '销售数量必须大于0' }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="请输入销售数量" 
                  min={1}
                  onChange={handleVolumeOrPriceChange}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="price"
                label="单价(元/升)"
                rules={[
                  { required: true, message: '请输入单价' },
                  { type: 'number', min: 0.01, message: '单价必须大于0' }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="请输入单价" 
                  min={0.01}
                  step={0.01}
                  precision={2}
                  onChange={handleVolumeOrPriceChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="amount"
                label="销售金额(元)"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  disabled
                  precision={2}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">交付信息</Divider>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="deliveryTime"
                label="交付日期"
                rules={[{ required: true, message: '请选择交付日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={current => current && current < moment().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="deliveryAddress"
                label="交付地址"
                rules={[{ required: true, message: '请输入交付地址' }]}
              >
                <Input placeholder="请输入交付地址" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="transportMethod"
                label="运输方式"
                rules={[{ required: true, message: '请选择运输方式' }]}
              >
                <Select placeholder="请选择运输方式">
                  <Option value="自提">自提</Option>
                  <Option value="送货上门">送货上门</Option>
                  <Option value="第三方物流">第三方物流</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="paymentMethod"
                label="支付方式"
                rules={[{ required: true, message: '请选择支付方式' }]}
              >
                <Select placeholder="请选择支付方式">
                  <Option value="月结">月结</Option>
                  <Option value="现金">现金</Option>
                  <Option value="银行转账">银行转账</Option>
                  <Option value="支票">支票</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="remark"
                label="备注"
              >
                <TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateDirectSalesOrder; 