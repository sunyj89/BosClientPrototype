import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Button, 
  Space, 
  Row, 
  Col, 
  message,
  Divider 
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

const GlobalRestrictions = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // 加载全局限制配置
  const loadGlobalRestrictions = async () => {
    setLoading(true);
    try {
      // TODO: 调用API获取全局限制配置
      const mockData = {
        dailyIssueLimit: 1000,
        userDailyLimit: 5,
        userTotalLimit: 20,
        enableBlacklist: true,
        enableWhitelist: false,
        minOrderAmount: 50,
        maxDiscountAmount: 500,
      };
      form.setFieldsValue(mockData);
    } catch (error) {
      message.error('加载全局限制配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存配置
  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const values = await form.validateFields();
      
      // TODO: 调用API保存全局限制配置
      console.log('保存全局限制配置:', values);
      
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaveLoading(false);
    }
  };

  // 重置配置
  const handleReset = () => {
    form.resetFields();
    loadGlobalRestrictions();
  };

  useEffect(() => {
    loadGlobalRestrictions();
  }, []);

  return (
    <Card title="全局限制配置" loading={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dailyIssueLimit"
              label="每日发放限制"
              rules={[{ required: true, message: '请输入每日发放限制' }]}
              extra="系统每日最多发放优惠券数量"
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                addonAfter="张"
                placeholder="请输入每日发放限制"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="userDailyLimit"
              label="用户每日限制"
              rules={[{ required: true, message: '请输入用户每日限制' }]}
              extra="单个用户每日最多获得优惠券数量"
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                addonAfter="张"
                placeholder="请输入用户每日限制"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="userTotalLimit"
              label="用户总限制"
              rules={[{ required: true, message: '请输入用户总限制' }]}
              extra="单个用户累计最多持有优惠券数量"
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                addonAfter="张"
                placeholder="请输入用户总限制"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="minOrderAmount"
              label="最小订单金额"
              rules={[{ required: true, message: '请输入最小订单金额' }]}
              extra="使用优惠券的最小订单金额限制"
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                addonAfter="元"
                placeholder="请输入最小订单金额"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="maxDiscountAmount"
              label="最大优惠金额"
              rules={[{ required: true, message: '请输入最大优惠金额' }]}
              extra="单张优惠券最大优惠金额限制"
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                addonAfter="元"
                placeholder="请输入最大优惠金额"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">用户控制</Divider>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="enableBlacklist"
              label="启用黑名单"
              valuePropName="checked"
              extra="启用后，黑名单用户无法获得优惠券"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="enableWhitelist"
              label="启用白名单"
              valuePropName="checked"
              extra="启用后，仅白名单用户可以获得优惠券"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={saveLoading}
              icon={<SaveOutlined />}
            >
              保存配置
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default GlobalRestrictions; 