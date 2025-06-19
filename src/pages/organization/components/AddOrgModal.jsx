import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import * as api from '../services/api';

const AddOrgModal = ({ visible, onCancel, onSuccess, selectedNode }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orgTypes, setOrgTypes] = useState([]);
  const [legalEntities, setLegalEntities] = useState([]);

  useEffect(() => {
    if (visible) {
      loadOrgTypes();
      loadLegalEntities();
      // 设置默认值
      if (selectedNode) {
        form.setFieldsValue({
          parentId: selectedNode.id,
          parentName: selectedNode.name,
          legalEntityId: selectedNode.legalEntity?.id
        });
      }
    }
  }, [visible, selectedNode, form]);

  // 加载组织类型
  const loadOrgTypes = async () => {
    try {
      const result = await api.getOrgTypes();
      if (result.success) {
        setOrgTypes(result.data);
      }
    } catch (error) {
      console.error('获取组织类型失败:', error);
    }
  };

  // 加载法人主体
  const loadLegalEntities = async () => {
    try {
      const result = await api.getLegalEntities();
      if (result.success) {
        setLegalEntities(result.data);
      }
    } catch (error) {
      console.error('获取法人主体失败:', error);
    }
  };

  // 根据父节点类型过滤可选的组织类型
  const getAvailableOrgTypes = () => {
    if (!selectedNode) return orgTypes;
    
    const { orgType } = selectedNode;
    switch (orgType) {
      case 'HEADQUARTER':
        return orgTypes.filter(type => 
          type.value === 'DEPARTMENT' || type.value === 'CITY_BRANCH'
        );
      case 'DEPARTMENT':
        return []; // 部门下不能创建子节点
      case 'CITY_BRANCH':
        return orgTypes.filter(type => type.value === 'SERVICE_AREA');
      case 'SERVICE_AREA':
        return orgTypes.filter(type => type.value === 'GAS_STATION');
      case 'GAS_STATION':
        return []; // 加油站下不能创建子节点
      default:
        return orgTypes;
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 找到选中的法人主体
      const legalEntity = legalEntities.find(entity => entity.id === values.legalEntityId);
      
      const orgData = {
        name: values.name,
        orgType: values.orgType,
        parentId: selectedNode.id,
        parentName: selectedNode.name,
        legalEntity: legalEntity
      };

      const result = await api.addOrgUnit(orgData);
      if (result.success) {
        message.success(result.message);
        form.resetFields();
        onSuccess && onSuccess(result.data);
      } else {
        message.error(result.message || '添加失败');
      }
    } catch (error) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error('添加失败');
      console.error('添加组织单元失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    form.resetFields();
    onCancel && onCancel();
  };

  const availableOrgTypes = getAvailableOrgTypes();

  return (
    <Modal
      title={
        <div>
          新增组织单元
          <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginTop: '4px' }}>
            在 "{selectedNode?.name}" 下创建子组织
          </div>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          name="name"
          label="组织名称"
          rules={[
            { required: true, message: '请输入组织名称' },
            { min: 2, message: '组织名称至少2个字符' },
            { max: 50, message: '组织名称不超过50个字符' }
          ]}
        >
          <Input placeholder="请输入组织名称" />
        </Form.Item>

        <Form.Item
          name="orgType"
          label="组织类型"
          rules={[{ required: true, message: '请选择组织类型' }]}
        >
          <Select 
            placeholder="请选择组织类型"
            disabled={availableOrgTypes.length === 0}
          >
            {availableOrgTypes.map(type => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="legalEntityId"
          label="法人主体"
          rules={[{ required: true, message: '请选择法人主体' }]}
        >
          <Select placeholder="请选择法人主体">
            {legalEntities.map(entity => (
              <Select.Option key={entity.id} value={entity.id}>
                {entity.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="parentName"
          label="上级组织"
        >
          <Input disabled />
        </Form.Item>

        {availableOrgTypes.length === 0 && (
          <div style={{ 
            color: '#faad14', 
            background: '#fffbe6', 
            border: '1px solid #ffe58f',
            borderRadius: '4px',
            padding: '8px 12px',
            marginTop: '-8px',
            fontSize: '13px'
          }}>
            <strong>提示：</strong>当前组织类型下无法创建子组织单元
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default AddOrgModal; 