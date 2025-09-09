import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Radio, TreeSelect, Row, Col, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const BlacklistForm = ({ 
  visible, 
  onCancel, 
  onOk, 
  data, 
  type = 'create' // create | edit
}) => {
  const [form] = Form.useForm();
  const [blacklistType, setBlacklistType] = useState('taxNo');

  useEffect(() => {
    if (visible) {
      if (type === 'edit' && data) {
        // 编辑模式：设置表单值
        const formValues = {
          ...data,
          blacklistType: data.blacklistType || 'taxNo'
        };
        form.setFieldsValue(formValues);
        setBlacklistType(formValues.blacklistType);
      } else {
        // 新增模式：重置表单并设置默认值
        form.resetFields();
        form.setFieldsValue({ 
          blacklistType: 'taxNo',
          status: '启用',
          riskLevel: '中'
        });
        setBlacklistType('taxNo');
      }
    }
  }, [visible, data, type, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 根据黑名单类型验证必填字段
      if (values.blacklistType === 'taxNo' && !values.taxNo) {
        message.error('请输入税号');
        return;
      }
      if (values.blacklistType === 'contact' && !values.phone && !values.email) {
        message.error('请至少输入电话或邮箱中的一项');
        return;
      }
      if (values.blacklistType === 'member' && !values.memberId) {
        message.error('请选择会员');
        return;
      }
      
      const submitData = {
        ...values,
        id: type === 'edit' ? data?.id : undefined
      };
      
      onOk?.(submitData);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  // 模拟会员数据
  const memberTreeData = [
    {
      title: '个人会员',
      value: 'personal',
      children: [
        { title: '张三 (138****1234)', value: 'member_001' },
        { title: '李四 (139****5678)', value: 'member_002' },
        { title: '王五 (186****9012)', value: 'member_003' }
      ]
    },
    {
      title: '企业会员',
      value: 'enterprise',
      children: [
        { title: '江西某某科技有限公司', value: 'member_101' },
        { title: '南昌某某贸易有限公司', value: 'member_102' }
      ]
    }
  ];

  const renderFormFields = () => {
    return (
      <>
        {/* 基本信息 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="companyName" 
              label="企业名称" 
              rules={[{ required: true, message: '请输入企业名称' }]}
            >
              <Input placeholder="请输入企业名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="blacklistType" 
              label="黑名单类型"
              rules={[{ required: true, message: '请选择黑名单类型' }]}
            >
              <Radio.Group onChange={(e) => setBlacklistType(e.target.value)}>
                <Radio value="taxNo">税号限制</Radio>
                <Radio value="contact">联系方式限制</Radio>
                <Radio value="member">会员限制</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* 根据黑名单类型显示不同字段 */}
        {blacklistType === 'taxNo' && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="taxNo" 
                label="税号" 
                rules={[
                  { required: true, message: '请输入税号' },
                  { pattern: /^[A-Z0-9]{15,20}$/, message: '税号格式不正确' }
                ]}
              >
                <Input placeholder="请输入税号（15-20位大写字母和数字）" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {blacklistType === 'contact' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="phone" 
                label="联系电话"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="email" 
                label="邮箱地址"
                rules={[
                  { type: 'email', message: '请输入正确的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {blacklistType === 'member' && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="memberId" 
                label="选择会员"
                rules={[{ required: true, message: '请选择会员' }]}
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  placeholder="请选择会员"
                  allowClear
                  treeData={memberTreeData}
                  showSearch
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* 其他信息 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="riskLevel" label="风险等级">
              <Select placeholder="请选择风险等级">
                <Option value="高">高风险</Option>
                <Option value="中">中风险</Option>
                <Option value="低">低风险</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" defaultValue="启用">
                <Option value="启用">启用</Option>
                <Option value="禁用">禁用</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="reason" label="黑名单原因">
              <TextArea 
                rows={3} 
                placeholder="请输入加入黑名单的原因" 
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Modal
      title={type === 'create' ? '添加黑名单' : '编辑黑名单'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={800}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          blacklistType: 'taxNo',
          status: '启用',
          riskLevel: '中'
        }}
      >
        {renderFormFields()}
      </Form>
    </Modal>
  );
};

export default BlacklistForm;