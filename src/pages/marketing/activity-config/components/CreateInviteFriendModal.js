import React, { useState, useEffect } from 'react';
import { Modal, Steps, Form, Input, Select, DatePicker, Radio, Row, Col, Button, Upload, message, Card, InputNumber, Checkbox } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import inviteFriendData from '../../../../mock/marketing/inviteFriendActivityData.json';

const { Step } = Steps;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CreateInviteFriendModal = ({ visible, onCancel, onSuccess, editData, isEdit = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (visible) {
      if (isEdit && editData) {
        // 编辑模式，填充现有数据
        const initialValues = {
          activityName: editData.activityName,
          activityType: editData.activityType,
          activityTime: [dayjs(editData.startTime), dayjs(editData.endTime)],
          pageTitle: editData.pageTitle,
          mainSlogan: editData.mainSlogan,
          guideSlogan: editData.guideSlogan,
          activityRule: editData.activityRule,
          // ... 其他字段
        };
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
      setCurrentStep(0);
    }
  }, [visible, isEdit, editData, form]);

  const steps = [
    { title: '基础设置', description: '活动基本信息' },
    { title: '资格设置', description: '参与资格配置' },
    { title: '页面设置', description: '页面内容配置' },
    { title: '奖励设置', description: '奖励规则配置' },
    { title: '确认信息', description: '预览和确认' }
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success(isEdit ? '活动更新成功！' : '活动创建成功！');
      onSuccess();
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicSettings();
      case 1:
        return renderQualificationSettings();
      case 2:
        return renderPageSettings();
      case 3:
        return renderRewardSettings();
      case 4:
        return renderConfirmation();
      default:
        return null;
    }
  };

  const renderBasicSettings = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ background: '#fff', padding: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Form.Item
              label="活动名称"
              name="activityName"
              rules={[{ required: true, message: '请输入活动名称' }]}
            >
              <Input placeholder="请输入活动名称（最多15个字符）" maxLength={15} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="活动时间"
              name="activityTime"
              rules={[{ required: true, message: '请选择活动时间' }]}
            >
              <RangePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="活动类型"
              name="activityType"
              rules={[{ required: true, message: '请选择活动类型' }]}
            >
              <Radio.Group>
                <Radio value={1}>1级邀请</Radio>
                <Radio value={2}>2级邀请</Radio>
                <Radio value={5}>代理商模式</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  const renderQualificationSettings = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ background: '#fff', padding: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item
              label="邀请人资格"
              name="inviterQualification"
              rules={[{ required: true, message: '请选择邀请人资格' }]}
            >
              <Select placeholder="请选择邀请人资格">
                {inviteFriendData.qualificationTypes.inviter.map(item => (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="被邀人资格"
              name="inviteeQualification"
              rules={[{ required: true, message: '请选择被邀人资格' }]}
            >
              <Select placeholder="请选择被邀人资格">
                {inviteFriendData.qualificationTypes.invitee.map(item => (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="完成邀请条件"
              name="completeCondition"
              rules={[{ required: true, message: '请选择完成邀请条件' }]}
            >
              <Radio.Group>
                <Radio value={1}>注册即完成</Radio>
                <Radio value={2}>注册并加油满足条件</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  const renderPageSettings = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ background: '#fff', padding: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Form.Item
              label="页面标题"
              name="pageTitle"
              rules={[{ required: true, message: '请输入页面标题' }]}
            >
              <Input placeholder="请输入页面标题" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="主标语"
              name="mainSlogan"
              rules={[{ required: true, message: '请输入主标语' }]}
            >
              <Input placeholder="请输入主标语" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="引导标语"
              name="guideSlogan"
              rules={[{ required: true, message: '请输入引导标语' }]}
            >
              <TextArea rows={3} placeholder="请输入引导标语" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="活动规则"
              name="activityRule"
              rules={[{ required: true, message: '请输入活动规则' }]}
            >
              <TextArea rows={6} placeholder="请输入活动规则详细描述" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  const renderRewardSettings = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ background: '#fff', padding: '24px' }}>
        <div style={{ marginBottom: 16, fontSize: '16px', fontWeight: 'bold' }}>邀请人奖励设置</div>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item
              label="接受邀请时奖励"
              name="acceptRewardType"
              rules={[{ required: true, message: '请选择奖励类型' }]}
            >
              <Select placeholder="请选择奖励类型">
                {inviteFriendData.rewardTypes.map(item => (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="奖励数量"
              name="acceptRewardAmount"
              rules={[{ required: true, message: '请输入奖励数量' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入奖励数量" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="完成邀请时奖励"
              name="completeRewardType"
              rules={[{ required: true, message: '请选择奖励类型' }]}
            >
              <Select placeholder="请选择奖励类型">
                {inviteFriendData.rewardTypes.map(item => (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="奖励数量"
              name="completeRewardAmount"
              rules={[{ required: true, message: '请输入奖励数量' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入奖励数量" />
            </Form.Item>
          </Col>
        </Row>
        
        <div style={{ marginTop: 24, marginBottom: 16, fontSize: '16px', fontWeight: 'bold' }}>被邀人奖励设置</div>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item
              label="奖励类型"
              name="inviteeRewardType"
              rules={[{ required: true, message: '请选择奖励类型' }]}
            >
              <Select placeholder="请选择奖励类型">
                {inviteFriendData.rewardTypes.map(item => (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="奖励数量"
              name="inviteeRewardAmount"
              rules={[{ required: true, message: '请输入奖励数量' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入奖励数量" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ background: '#fff', padding: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 16 }}>确认活动信息</div>
        <p>请确认以上设置信息无误后提交创建活动。</p>
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
          <p><strong>活动名称：</strong>{formData.activityName}</p>
          <p><strong>活动类型：</strong>{formData.activityType === 1 ? '1级邀请' : formData.activityType === 2 ? '2级邀请' : '代理商模式'}</p>
          <p><strong>页面标题：</strong>{formData.pageTitle}</p>
          <p><strong>主标语：</strong>{formData.mainSlogan}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      title={isEdit ? '编辑邀请好友活动' : '创建邀请好友活动'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} description={item.description} />
        ))}
      </Steps>

      <Form form={form} layout="vertical">
        {renderStepContent()}
      </Form>

      <div style={{ textAlign: 'right', borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
        {currentStep > 0 && (
          <Button style={{ marginRight: 8 }} onClick={handlePrev}>
            上一步
          </Button>
        )}
        <Button type="primary" loading={loading} onClick={handleNext}>
          {currentStep < steps.length - 1 ? '下一步' : (isEdit ? '更新活动' : '创建活动')}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateInviteFriendModal;