import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Collapse, Checkbox, Row, Col, Divider } from 'antd';
import { getPermissions } from '../../services/api';

const { Panel } = Collapse;
const { Option } = Select;

const RoleConfigModal = ({ visible, onCancel, onOk, roleData, title }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [checkedModulePermissions, setCheckedModulePermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const result = await getPermissions();
        if (result.success) {
          setPermissions(result.data);
        }
      } catch (error) {
        console.error('获取权限失败:', error);
      }
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (roleData && visible) {
      form.setFieldsValue({
        roleName: roleData.roleName,
        description: roleData.description,
        orgTypes: roleData.orgTypes,
        dataScope: roleData.permissions?.dataScope,
        posDevices: roleData.permissions?.posDevices || []
      });
      setCheckedModulePermissions(roleData.permissions?.modulePermissions || []);
    } else if (visible) {
      form.resetFields();
      setCheckedModulePermissions([]);
    }
  }, [roleData, visible, form]);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const formData = {
        ...values,
        permissions: {
          modulePermissions: checkedModulePermissions,
          dataScope: values.dataScope,
          posDevices: values.posDevices || []
        }
      };

      await onOk(formData);
      form.resetFields();
      setCheckedModulePermissions([]);
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCheckedModulePermissions([]);
    onCancel();
  };

  // 处理模块权限选择
  const handleModulePermissionChange = (moduleId, operationId, checked) => {
    if (checked) {
      setCheckedModulePermissions(prev => [...prev, operationId]);
    } else {
      setCheckedModulePermissions(prev => prev.filter(id => id !== operationId));
    }
  };

  // 处理模块全选
  const handleModuleSelectAll = (moduleId, checked) => {
    const module = permissions.modules?.find(m => m.id === moduleId);
    if (!module) return;

    const operationIds = module.operations.map(op => op.id);
    
    if (checked) {
      setCheckedModulePermissions(prev => {
        const filtered = prev.filter(id => !operationIds.includes(id));
        return [...filtered, ...operationIds];
      });
    } else {
      setCheckedModulePermissions(prev => 
        prev.filter(id => !operationIds.includes(id))
      );
    }
  };

  // 检查模块是否全选
  const isModuleAllSelected = (moduleId) => {
    const module = permissions.modules?.find(m => m.id === moduleId);
    if (!module) return false;
    
    const operationIds = module.operations.map(op => op.id);
    return operationIds.every(id => checkedModulePermissions.includes(id));
  };

  // 检查模块是否部分选择
  const isModuleIndeterminate = (moduleId) => {
    const module = permissions.modules?.find(m => m.id === moduleId);
    if (!module) return false;
    
    const operationIds = module.operations.map(op => op.id);
    const selectedCount = operationIds.filter(id => checkedModulePermissions.includes(id)).length;
    return selectedCount > 0 && selectedCount < operationIds.length;
  };

  // 权限类型颜色映射
  const getOperationTypeColor = (type) => {
    const colors = {
      access: '#52c41a',
      query: '#1890ff',
      action: '#faad14',
      export: '#722ed1',
      import: '#f5222d'
    };
    return colors[type] || '#666';
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          dataScope: 'self_org',
          orgTypes: [],
          posDevices: []
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="roleName"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input placeholder="请输入角色名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dataScope"
              label="数据权限范围"
              rules={[{ required: true, message: '请选择数据权限范围' }]}
            >
              <Select placeholder="请选择数据权限范围">
                {permissions.dataScopes?.map(scope => (
                  <Option key={scope.id} value={scope.id}>
                    {scope.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="角色描述"
        >
          <Input.TextArea 
            placeholder="请输入角色描述" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="orgTypes"
          label="适用组织类型"
        >
          <Select
            mode="multiple"
            placeholder="请选择适用的组织类型"
            allowClear
          >
            <Option value="HEADQUARTER">集团总部</Option>
            <Option value="DEPARTMENT">部门</Option>
            <Option value="CITY_BRANCH">分公司</Option>
            <Option value="SERVICE_AREA">服务区</Option>
            <Option value="GAS_STATION">加油站</Option>
          </Select>
        </Form.Item>

        <Divider>功能权限配置</Divider>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Collapse ghost>
            {permissions.modules?.map(module => (
              <Panel
                key={module.id}
                header={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={isModuleAllSelected(module.id)}
                      indeterminate={isModuleIndeterminate(module.id)}
                      onChange={(e) => handleModuleSelectAll(module.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <strong>{module.name}</strong>
                    </Checkbox>
                    <span style={{ marginLeft: '8px', color: '#999', fontSize: '12px' }}>
                      ({module.operations.length}个权限)
                    </span>
                  </div>
                }
              >
                <div style={{ paddingLeft: '24px' }}>
                  <Row gutter={[8, 8]}>
                    {module.operations.map(operation => (
                      <Col span={8} key={operation.id}>
                        <Checkbox
                          checked={checkedModulePermissions.includes(operation.id)}
                          onChange={(e) => handleModulePermissionChange(module.id, operation.id, e.target.checked)}
                        >
                          <span 
                            style={{ 
                              color: getOperationTypeColor(operation.type),
                              fontSize: '12px'
                            }}
                          >
                            {operation.name}
                          </span>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>

        <Divider>POS设备权限</Divider>

        <Form.Item
          name="posDevices"
          label="POS设备权限"
        >
          <Checkbox.Group>
            <Row gutter={[16, 8]}>
              {permissions.posDevices?.map(device => (
                <Col span={12} key={device.id}>
                  <Checkbox value={device.id}>
                    {device.name}
                    {device.description && (
                      <span style={{ color: '#999', fontSize: '12px', marginLeft: '4px' }}>
                        ({device.description})
                      </span>
                    )}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleConfigModal; 