import React, { useState, useEffect } from 'react';
import { Layout, message, Modal, Form, Input, Select, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import OrgTree from './components/OrgTree';
import OrgDetails from './components/OrgDetails';
import UserList from './components/UserList';
import AddOrgModal from './components/AddOrgModal';
import * as api from './services/api';
import './index.css';

const { Sider, Content } = Layout;
const { confirm } = Modal;

const OrganizationManagement = () => {
  
  // 状态管理
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [userModalLoading, setUserModalLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [addOrgModalVisible, setAddOrgModalVisible] = useState(false);
  const [editOrgModalVisible, setEditOrgModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  
  const [userForm] = Form.useForm();

  // 初始化加载数据
  useEffect(() => {
    loadTreeData();
    loadRoles();
  }, []);

  // 加载组织树数据
  const loadTreeData = async () => {
    try {
      setTreeLoading(true);
      const result = await api.getOrgTree();
      console.log(result);
      if (result.success) {
        setTreeData(result.data);
      } else {
        message.error(result.message || '获取组织架构失败');
      }
    } catch (error) {
      message.error('获取组织架构失败');
      console.error('获取组织架构失败:', error);
    } finally {
      setTreeLoading(false);
    }
  };

  // 加载角色数据
  const loadRoles = async () => {
    try {
      const result = await api.getRoles();
      if (result.success) {
        setRoles(result.data);
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
    }
  };

  // 处理树节点选择
  const handleNodeSelect = async (selectedKeys, { node }) => {
    if (selectedKeys.length > 0) {
      try {
        setLoading(true);
        setSelectedNode(node);
        console.log('node', node);
        
        // 获取用户列表
        const userResult = await api.getUsersByOrgId(node.id);
        if (userResult.success) {
          setUsers(userResult.data);
        } else {
          message.error(userResult.message || '获取用户列表失败');
          setUsers([]);
        }
      } catch (error) {
        message.error('获取用户列表失败');
        setUsers([]);
        console.error('获取用户列表失败:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 添加用户
  const handleAddUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    userForm.setFieldsValue({
      orgUnitId: selectedNode?.id
    });
    setUserModalVisible(true);
  };

  // 编辑用户
  const handleEditUser = (user) => {
    setEditingUser(user);
    console.log(user);
    userForm.setFieldsValue({
      name: user.username,
      roleId: user.roleId
    });
    setUserModalVisible(true);
  };

  // 删除用户
  const handleDeleteUser = (user) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除用户 "${user.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await api.deleteUser(user.id);
          if (result.success) {
            message.success('删除用户成功');
            // 重新加载用户列表
            if (selectedNode) {
              const userResult = await api.getUsersByOrgId(selectedNode.id);
              if (userResult.success) {
                setUsers(userResult.data);
              }
            }
          } else {
            message.error(result.message || '删除用户失败');
          }
        } catch (error) {
          message.error('删除用户失败');
          console.error('删除用户失败:', error);
        }
      }
    });
  };

  // 提交用户表单
  const handleUserSubmit = async () => {
    try {
      const values = await userForm.validateFields();
      setUserModalLoading(true);

      // 构造用户数据
      const userData = {
        ...values,
        orgUnitId: selectedNode.id,
        role: roles.find(role => role.id === values.roleId)
      };

      console.log(userData);

      let result;
      if (editingUser) {
        console.log(editingUser);
        // 编辑用户
        userData.username = userData.name;
        userData.position = userData.role.roleName;
        userData.realName = userData.name;
        result = await api.updateUser({ ...editingUser, ...userData });
      } else {
        // 添加用户
        result = await api.addUser(userData);
      }

      if (result.success) {
        message.success(editingUser ? '更新用户成功' : '添加用户成功');
        setUserModalVisible(false);
        
        // 重新加载用户列表
        const userResult = await api.getUsersByOrgId(selectedNode.id);
        if (userResult.success) {
          setUsers(userResult.data);
        }
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error('操作失败');
      console.error('用户操作失败:', error);
    } finally {
      setUserModalLoading(false);
    }
  };

  // 打开新增组织弹窗
  const handleAddOrg = () => {
    setAddOrgModalVisible(true);
  };

  // 新增组织成功
  const handleAddOrgSuccess = async (newOrgUnit) => {
    setAddOrgModalVisible(false);
    message.success('新增组织单元成功，请刷新页面查看');
    // 重新加载树数据
    await loadTreeData();
  };

  // 编辑组织
  const handleEditOrg = () => {
    console.log('selectedNode', selectedNode);
    // 确保editingOrg包含完整的节点信息，包括可能需要的父级信息
    setEditingOrg({
      ...selectedNode,
      // 确保包含parentId和parentName字段，以保持与AddOrgModal组件的兼容性
      parentId: selectedNode.parentId || (selectedNode.parent && selectedNode.parent.id),
      parentName: selectedNode.parentName || (selectedNode.parent && selectedNode.parent.name)
    });
    setEditOrgModalVisible(true);
  };

  // 删除组织
  const handleDeleteOrg = () => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>确定要删除组织 "{selectedNode?.name}" 吗？</p>
          <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
            警告：删除后该组织下的所有子组织和员工都将被删除，此操作不可恢复！
          </p>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const result = await api.deleteOrgUnit(selectedNode.id);
          if (result.success) {
            message.success('删除组织成功');
            setSelectedNode(null);
            setUsers([]);
            // 重新加载树数据
            await loadTreeData();
          } else {
            message.error(result.message || '删除组织失败');
          }
        } catch (error) {
          message.error('删除组织失败');
          console.error('删除组织失败:', error);
        }
      }
    });
  };

  // 编辑组织成功
  const handleEditOrgSuccess = async (updatedOrgUnit) => {
    setEditOrgModalVisible(false);
    message.success('修改组织单元成功');
    // 重新加载树数据
    await loadTreeData();
    // 更新选中节点
    setSelectedNode({ ...selectedNode, ...updatedOrgUnit });
  };

  return (
    <div className="organization-management">
      {/* 页面头部 */}
      <div className="page-header-actions" style={{ 
        padding: '16px 24px', 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>组织架构管理</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            管理组织架构树和人员配置
          </p>
        </div>
        {!treeData || treeData.length === 0 ? (
          <div>
            <Button type="primary" onClick={handleAddOrg}>
              新增组织
            </Button>
          </div>
        ) : null}
      </div>
      
      <Layout style={{ minHeight: 'calc(100vh - 175px)' }}>
        <Sider width={300} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
          <OrgTree 
            treeData={treeData}
            onSelect={handleNodeSelect}
            loading={treeLoading}
          />
        </Sider>
        <Content style={{ 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column',
          height: 'calc(100vh - 175px)',
          overflow: 'hidden'
        }}>
          <div style={{ flex: '0 0 auto' }}>
            <OrgDetails 
              selectedNode={selectedNode} 
              onAddOrg={handleAddOrg}
              onEditOrg={handleEditOrg}
              onDeleteOrg={handleDeleteOrg}
            />
          </div>
          <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
            <UserList 
              users={users}
              loading={loading}
              selectedNode={selectedNode}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        </Content>
      </Layout>

      {/* 用户编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={userModalVisible}
        onOk={handleUserSubmit}
        onCancel={() => setUserModalVisible(false)}
        confirmLoading={userModalLoading}
        destroyOnClose
      >
        <Form
          form={userForm}
          layout="vertical"
        >
          <Form.Item
            name="realName"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="username"
            label="登录名"
            rules={[{ required: true, message: '请输入登录名' }]}
          >
            <Input placeholder="请输入登录名" />
          </Form.Item>

          
          <Form.Item
            name="roleId"
            label="岗位/角色"
            rules={[{ required: true, message: '请选择岗位角色' }]}
          >
            <Select placeholder="请选择岗位角色">
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.roleName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          {/* <Form.Item
            name="orgUnitId"
            label="所属组织"
          >
            <Input disabled value={selectedNode.createdTime} />
          </Form.Item> */}
          <Form.Item
            name="orgUnitId"
            label="所属组织"
          >
            {selectedNode?.orgName}
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增组织单元弹窗 */}
      <AddOrgModal
        visible={addOrgModalVisible}
        onCancel={() => setAddOrgModalVisible(false)}
        onSuccess={handleAddOrgSuccess}
        selectedNode={selectedNode}
      />

      {/* 编辑组织单元弹窗 */}
      <AddOrgModal
        visible={editOrgModalVisible}
        onCancel={() => setEditOrgModalVisible(false)}
        onSuccess={handleEditOrgSuccess}
        selectedNode={editingOrg?.parentId ? { id: editingOrg.parentId, name: editingOrg.parentName, orgType: editingOrg.orgType } : null}
        editingOrg={editingOrg}
        isEdit={true}
      />
    </div>
  );
};

export default OrganizationManagement;