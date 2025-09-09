import React, { useState, useEffect } from 'react';
import { 
  Tabs,
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  message, 
  Tooltip,
  Tag,
  Typography,
  Input,
  Form,
  Breadcrumb
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RoleConfigModal from './components/RoleConfigModal';
import * as api from '../services/api';
import './index.css';

const { Title } = Typography;
const { confirm } = Modal;

const RoleConfiguration = () => {
  const navigate = useNavigate();
  const [roleConfigs, setRoleConfigs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [copyingRole, setCopyingRole] = useState(null);
  const [copyForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState('system');
  const [businessLoading, setBusinessLoading] = useState(false);
  const [systemLoading, setSystemLoading] = useState(false);
  const [systemRoleConfigs, setSystemRoleConfigs] = useState([]);
const [businessRoleConfigs, setBusinessRoleConfigs] = useState([]);

// 系统角色表格列定义
const systemRoleColumns = [
  // 与原columns类似，但只包含系统角色相关的列
  { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
  { title: '角色类型', dataIndex: 'roleType', key: 'roleType', render: type => '系统角色' },
  { title: '适用组织类型', dataIndex: 'orgTypes', key: 'orgTypes', render: types => types.join(', ') },
  { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime' },
  { title: '操作', key: 'action', render: (_, record) => (
    <Space size="middle">
      <a onClick={() => handleEdit(record)}>编辑</a>
      <a onClick={() => handleDelete(record.id)}>删除</a>
    </Space>
  )}
];

// 业务和自定义角色表格列定义
const businessRoleColumns = [
  { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
  { title: '角色类型', dataIndex: 'roleType', key: 'roleType' },
  { title: '适用组织类型', dataIndex: 'orgTypes', key: 'orgTypes', render: types => types.join(', ') },
  { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime' },
  { title: '操作', key: 'action', render: (_, record) => (
    <Space size="middle">
      <a onClick={() => handleEdit(record)}>编辑</a>
      <a onClick={() => handleDelete(record.id)}>删除</a>
    </Space>
  )}
];

  // 初始化加载数据
  useEffect(() => {
    loadRoleConfigurations();
    loadPermissions();
    loadOrgTreeData();
  }, []);

  // 切换标签页时的处理函数
  const handleTabChange = (key) => {
    setActiveTab(key);
    console.log(key);
    if (key === 'system') {
      loadRoleConfigurations();
    } else {
      fetchBusinessRoles();
    }
  };

  // 加载角色配置列表
  const loadRoleConfigurations = async () => {
    try {
      setLoading(true);
      const result = await api.getRoleConfigurations();
      if (result.success) {
        setRoleConfigs(result.data);
      } else {
        message.error(result.message || '获取角色配置列表失败');
      }
    } catch (error) {
      message.error('获取角色配置列表失败');
      console.error('获取角色配置列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载业务角色列表
  const fetchBusinessRoles = async () => {
    try {
      setBusinessLoading(true);
      const result = await api.getBusinessRoles();
      if (result.success) {
        setBusinessRoleConfigs(result.data);
      } else {
        message.error(result.message || '获取业务角色列表失败');
      }
    } catch (error) {
      console.error('获取业务角色列表失败:', error);
    } finally {
      setBusinessLoading(false);
    }
  };

  // 加载权限定义
  const loadPermissions = async () => {
    try {
      const menus =  await api.getMenus()
      console.log(menus);
      if (menus.success) {
        setPermissions(menus.data);
      }
      // const result = await api.getPermissions();
      // if (result.success) {
      //   setPermissions(result.data);
      // }
    } catch (error) {
      console.error('获取权限定义失败:', error);
    }
  };

  // 加载组织树数据
  const loadOrgTreeData = async () => {
    try {
      const result = await api.getOrgTree();
      if (result.success) {
        setOrgTreeData(result.data);
      }
    } catch (error) {
      console.error('获取组织树数据失败:', error);
    }
  };

  // 新增角色配置
  const handleAdd = () => {
    setEditingRole(null);
    setModalVisible(true);
  };

  // 编辑角色配置
  const handleEdit = (record) => {
    setEditingRole(record);
    setModalVisible(true);
  };

  // 复制角色配置
  const handleCopy = (record) => {
    setCopyingRole(record);
    copyForm.resetFields();
    copyForm.setFieldsValue({
      roleName: `${record.roleName}_副本`,
      description: `复制自: ${record.description}`
    });
    setCopyModalVisible(true);
  };

  // 确认复制角色
  const handleCopyConfirm = async () => {
    try {
      const values = await copyForm.validateFields();
      setModalLoading(true);
      
      const result = await api.copyRoleConfiguration(
        copyingRole.id, 
        values.roleName, 
        values.description,
        copyingRole
      );
      
      if (result.success) {
        message.success('复制角色配置成功');
        setCopyModalVisible(false);
        if (activeTab === 'system') {
          loadRoleConfigurations();
        } else {
          fetchBusinessRoles();
        }
      } else {
        message.error(result.message || '复制角色配置失败');
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error('复制角色配置失败');
      console.error('复制角色配置失败:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // 删除角色配置
  const handleDelete = (record) => {
    if (record.isSystemRole) {
      message.warning('系统角色不允许删除');
      return;
    }

    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除角色配置 "${record.roleName}" 吗？删除后不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await api.deleteRoleConfiguration(record.id);
          if (result.success) {
            message.success('删除角色配置成功');
            if (activeTab === 'system') {
              loadRoleConfigurations();
            } else {
              fetchBusinessRoles();
            }
          } else {
            message.error(result.message || '删除角色配置失败');
          }
        } catch (error) {
          message.error('删除角色配置失败');
          console.error('删除角色配置失败:', error);
        }
      }
    });
  };

  // 保存角色配置
  const handleSave = async (formData) => {
    try {
      setModalLoading(true);
      let result;
      
      if (editingRole) {
        result = await api.updateRoleConfiguration(editingRole.id, formData);
      } else {
        result = await api.addRoleConfiguration(formData);
      }
      
      if (result.success) {
        message.success(editingRole ? '更新角色配置成功' : '添加角色配置成功');
        setModalVisible(false);
        if (activeTab === 'system') {
          loadRoleConfigurations();
        } else {
          fetchBusinessRoles();
        }
      } else {
        message.error(result.message || '保存角色配置失败');
      }
    } catch (error) {
      message.error('保存角色配置失败');
      console.error('保存角色配置失败:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 150,
      render: (text, record) => (
        <Space>
          {text}
          {record.isSystemRole && (
            <Tag color="blue" size="small">系统</Tag>
          )}
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '适用组织类型',
      dataIndex: 'orgTypes',
      key: 'orgTypes',
      width: 200,
      render: (orgTypes) => (
        <Space wrap>
          {(orgTypes || []).map(type => {
            const typeMap = {
              'MERCHANT': '商户',
              'COMPANY': '公司',
              'REGION': '区域',
              'DEPARTMENT': '部门',
              'GAS_STATION': '加油站'
            };
            return (
              <Tag key={type} size="small">
                {typeMap[type] || type}
              </Tag>
            );
          })}
        </Space>
      )
    },
    {
      title: '页面权限',
      dataIndex: 'permissions',
      key: 'pagePermissions',
      width: 120,
      render: (permissions) => (
        <Tag color="green">{permissions.pageOperations?.length || 0} 个</Tag>
      )
    },
    {
      title: '数据权限',
      dataIndex: 'permissions',
      key: 'dataScope',
      width: 120,
      render: (permissions) => {
        const scopeMap = {
          'all': '全部数据',
          'self_org': '本组织及子组织',
          'self_org_only': '仅本组织',
          'self': '仅本人'
        };
        return <Tag color="orange">{scopeMap[permissions?.dataScope] || '未设置'}</Tag>;
      }
    },
    {
      title: '关联油站',
      dataIndex: 'permissions',
      key: 'associatedStations',
      width: 100,
      render: (permissions) => (
        <Tag color="cyan">{permissions?.associatedStations?.length || 0} 个</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 150,
      render: (time) => new Date(time).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Tooltip>
          <Tooltip title="复制">
            <Button 
              type="link" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            >
              复制
            </Button>
          </Tooltip>
          {!record.isSystemRole && (
            <Tooltip title="删除">
              <Button 
                type="link" 
                size="small" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              >
                删除
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="role-configuration">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item 
          className="breadcrumb-link"
          onClick={() => navigate('/organization')}
        >
          组织架构管理
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <SettingOutlined />
          角色配置
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <div className="page-header">
          <div>
            <Title level={4} style={{ margin: 0 }}>角色配置管理</Title>
            <p style={{ color: '#666', margin: 0 }}>
              管理系统角色和权限配置，支持自定义角色权限设置
            </p>
          </div>
          {/* <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增角色
          </Button> */}
        </div>

      {/* 添加Tabs组件实现菜单页切换 */}
      <Tabs
        defaultActiveKey="system"
        style={{ marginTop: 16 }}
        onChange={handleTabChange}
        tabBarExtraContent={
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={handleAdd}
          >
            新增角色
          </Button>
        }
      >
            {/* 系统管理菜单页 */}
    <Tabs.TabPane
      key="system"
      tab={
        <span>
          <SettingOutlined /> 系统管理
        </span>
      }
    >
      <Table
        columns={columns}
        dataSource={roleConfigs}
        rowKey="id"
        loading={systemLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        scroll={{ x: 1200 }}
      />
    </Tabs.TabPane>
        {/* 业务和自定义角色管理菜单页 */}
    <Tabs.TabPane
      key="business"
      tab={
        <span>
          <SettingOutlined /> 业务和自定义角色管理
        </span>
      }
    >
      <Table
        columns={columns}
        dataSource={businessRoleConfigs}
        rowKey="id"
        loading={businessLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        scroll={{ x: 1200 }}
      />
    </Tabs.TabPane>
  </Tabs>

        {/* <Table
          columns={columns}
          dataSource={roleConfigs}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        /> */}
      </Card>

      {/* 角色配置弹窗 */}
      <RoleConfigModal
        visible={modalVisible}
        loading={modalLoading}
        editingRole={editingRole}
        permissions={permissions}
        orgTreeData={orgTreeData}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
      />

      {/* 复制角色弹窗 */}
      <Modal
        title="复制角色配置"
        open={copyModalVisible}
        onOk={handleCopyConfirm}
        onCancel={() => setCopyModalVisible(false)}
        confirmLoading={modalLoading}
        destroyOnClose
      >
        <Form
          form={copyForm}
          layout="vertical"
        >
          <Form.Item
            name="roleName"
            label="新角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea 
              placeholder="请输入角色描述" 
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleConfiguration; 