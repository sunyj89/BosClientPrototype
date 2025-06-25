import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Card, 
  Row, 
  Col, 
  Divider,
  Typography,
  Space,
  Alert,
  Collapse,
  Tag,
  Tree
} from 'antd';
import { 
  UserOutlined, 
  SafetyOutlined, 
  DesktopOutlined, 
  SettingOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const RoleConfigModal = ({ 
  visible, 
  loading, 
  editingRole, 
  permissions, 
  onSave, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [selectedPageOperations, setSelectedPageOperations] = useState([]);
  const [selectedDataScope, setSelectedDataScope] = useState('self');
  const [selectedPosDevices, setSelectedPosDevices] = useState([]);
  const [selectedOrgTypes, setSelectedOrgTypes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  // 组织类型选项
  const orgTypeOptions = [
    { value: 'HEADQUARTER', label: '总部' },
    { value: 'DEPARTMENT', label: '部门' },
    { value: 'CITY_BRANCH', label: '分公司' },
    { value: 'SERVICE_AREA', label: '服务区' },
    { value: 'GAS_STATION', label: '加油站' }
  ];

  // 将权限数据转换为树形结构
  const convertToTreeData = (pageOperations) => {
    if (!pageOperations) return [];
    
    return pageOperations.map(page => {
      const pageNode = {
        title: page.name,
        key: page.id,
        children: []
      };

      // 添加操作权限作为子节点
      if (page.operations && page.operations.length > 0) {
        pageNode.children = page.operations.map(operation => ({
          title: operation.name,
          key: operation.id,
          isLeaf: true
        }));
      }

      // 处理子页面
      if (page.children && page.children.length > 0) {
        const childPages = page.children.map(childPage => ({
          title: childPage.name,
          key: childPage.id,
          children: childPage.operations ? childPage.operations.map(operation => ({
            title: operation.name,
            key: operation.id,
            isLeaf: true
          })) : []
        }));
        pageNode.children = [...pageNode.children, ...childPages];
      }

      return pageNode;
    });
  };

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (editingRole) {
        // 编辑模式
        form.setFieldsValue({
          roleName: editingRole.roleName,
          description: editingRole.description,
          orgTypes: editingRole.orgTypes
        });
        setSelectedPageOperations(editingRole.permissions.pageOperations || []);
        setCheckedKeys(editingRole.permissions.pageOperations || []);
        setSelectedDataScope(editingRole.permissions.dataScope || 'self');
        setSelectedPosDevices(editingRole.permissions.posDevices || []);
        setSelectedOrgTypes(editingRole.orgTypes || []);
        // 设置展开的节点（展开所有页面节点）
        if (permissions.pageOperations) {
          const expandKeys = permissions.pageOperations.map(page => page.id);
          setExpandedKeys(expandKeys);
        }
      } else {
        // 新增模式
        form.resetFields();
        setSelectedPageOperations([]);
        setCheckedKeys([]);
        setSelectedDataScope('self');
        setSelectedPosDevices([]);
        setSelectedOrgTypes([]);
        setExpandedKeys([]);
      }
    }
  }, [visible, editingRole, form, permissions]);

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        permissions: {
          pageOperations: checkedKeys,
          dataScope: selectedDataScope,
          posDevices: selectedPosDevices
        },
        orgTypes: selectedOrgTypes
      };
      onSave(formData);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 树形权限选择变化处理
  const handleTreeCheck = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys);
    setSelectedPageOperations(checkedKeys);
  };

  // POS设备权限变化处理
  const handlePosDeviceChange = (checkedValues) => {
    setSelectedPosDevices(checkedValues);
  };

  // 获取所有权限ID（用于全选）
  const getAllPermissionIds = () => {
    const allIds = [];
    const traverse = (nodes) => {
      nodes.forEach(node => {
        allIds.push(node.key);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    
    if (permissions.pageOperations) {
      const treeData = convertToTreeData(permissions.pageOperations);
      traverse(treeData);
    }
    return allIds;
  };

  // 全选/取消全选页面权限
  const handleSelectAllPageOperations = (checked) => {
    if (checked) {
      const allIds = getAllPermissionIds();
      setCheckedKeys(allIds);
      setSelectedPageOperations(allIds);
    } else {
      setCheckedKeys([]);
      setSelectedPageOperations([]);
    }
  };

  // 全选/取消全选POS设备权限
  const handleSelectAllPosDevices = (checked) => {
    if (checked) {
      setSelectedPosDevices(permissions.posDevices?.map(d => d.id) || []);
    } else {
      setSelectedPosDevices([]);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          {editingRole ? '编辑角色配置' : '新增角色配置'}
        </Space>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={900}
      destroyOnClose
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        {/* 基本信息 */}
        <Card 
          size="small" 
          title={
            <Space>
              <UserOutlined style={{ color: '#1890ff' }} />
              基本信息
            </Space>
          }
          style={{ marginBottom: 16 }}
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
                name="orgTypes"
                label="适用组织类型"
                rules={[{ required: true, message: '请选择适用的组织类型' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择适用的组织类型"
                  onChange={setSelectedOrgTypes}
                >
                  {orgTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <TextArea 
              placeholder="请输入角色描述" 
              rows={3}
            />
          </Form.Item>
        </Card>

        {/* 权限配置 */}
        <Collapse defaultActiveKey={['1', '2', '3']} ghost>
          {/* 页面与操作权限 */}
          <Panel 
            header={
              <Space>
                <DesktopOutlined style={{ color: '#52c41a' }} />
                <Text strong>页面与操作权限</Text>
                <Tag color="green">{checkedKeys.length} 个已选择</Tag>
              </Space>
            } 
            key="1"
          >
            <Card size="small">
              <Alert
                message="权限说明"
                description="选择页面即可访问该功能模块，选择具体操作可控制在该模块中的操作权限。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <div style={{ marginBottom: 16 }}>
                <Checkbox
                  indeterminate={
                    checkedKeys.length > 0 && 
                    checkedKeys.length < getAllPermissionIds().length
                  }
                  checked={checkedKeys.length === getAllPermissionIds().length}
                  onChange={(e) => handleSelectAllPageOperations(e.target.checked)}
                >
                  全选所有权限
                </Checkbox>
              </div>
              <Tree
                checkable
                checkedKeys={checkedKeys}
                expandedKeys={expandedKeys}
                onCheck={handleTreeCheck}
                onExpand={setExpandedKeys}
                treeData={convertToTreeData(permissions.pageOperations)}
                style={{ 
                  maxHeight: 400, 
                  overflow: 'auto',
                  border: '1px solid #f0f0f0',
                  borderRadius: 6,
                  padding: 16,
                  background: '#fafafa'
                }}
              />
            </Card>
          </Panel>

          {/* 数据权限 */}
          <Panel 
            header={
              <Space>
                <DatabaseOutlined style={{ color: '#fa8c16' }} />
                <Text strong>数据权限</Text>
                <Tag color="orange">
                  {permissions.dataScopes?.find(ds => ds.id === selectedDataScope)?.name}
                </Tag>
              </Space>
            } 
            key="2"
          >
            <Card size="small">
              <Alert
                message="数据权限说明"
                description="数据权限控制用户可以查看和操作的数据范围，请根据角色职责谨慎选择。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Select
                value={selectedDataScope}
                onChange={setSelectedDataScope}
                style={{ width: '100%' }}
                placeholder="请选择数据权限范围"
              >
                {permissions.dataScopes?.map(scope => (
                  <Option key={scope.id} value={scope.id}>
                    {scope.name}
                  </Option>
                ))}
              </Select>
            </Card>
          </Panel>

          {/* POS设备权限 */}
          <Panel 
            header={
              <Space>
                <SettingOutlined style={{ color: '#722ed1' }} />
                <Text strong>POS设备权限</Text>
                <Tag color="purple">{selectedPosDevices.length} 个已选择</Tag>
              </Space>
            } 
            key="3"
          >
            <Card size="small">
              <Alert
                message="POS设备权限说明"
                description="POS设备权限控制用户对加油站设备的配置和操作权限，请根据实际需要选择。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <div style={{ marginBottom: 16 }}>
                <Checkbox
                  indeterminate={
                    selectedPosDevices.length > 0 && 
                    selectedPosDevices.length < (permissions.posDevices?.length || 0)
                  }
                  checked={selectedPosDevices.length === (permissions.posDevices?.length || 0)}
                  onChange={(e) => handleSelectAllPosDevices(e.target.checked)}
                >
                  全选POS设备权限
                </Checkbox>
              </div>
              <Checkbox.Group
                value={selectedPosDevices}
                onChange={handlePosDeviceChange}
                style={{ width: '100%' }}
              >
                <Row gutter={[8, 8]}>
                  {permissions.posDevices?.map(device => (
                    <Col span={8} key={device.id}>
                      <Checkbox value={device.id}>
                        {device.name}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Card>
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  );
};

export default RoleConfigModal; 