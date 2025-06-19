import React, { useState, useEffect } from 'react';
import { 
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
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [copyingRole, setCopyingRole] = useState(null);
  const [copyForm] = Form.useForm();

  // 初始化加载数据
  useEffect(() => {
    loadRoleConfigurations();
    loadPermissions();
  }, []);

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

  // 加载权限定义
  const loadPermissions = async () => {
    try {
      const result = await api.getPermissions();
      if (result.success) {
        setPermissions(result.data);
      }
    } catch (error) {
      console.error('获取权限定义失败:', error);
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
        values.description
      );
      
      if (result.success) {
        message.success('复制角色配置成功');
        setCopyModalVisible(false);
        loadRoleConfigurations();
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
            loadRoleConfigurations();
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
        loadRoleConfigurations();
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

  // 计算权限统计
  const getPermissionStats = (permissions) => {
    if (!permissions) return '无权限';
    
    const moduleCount = permissions.modulePermissions?.length || 0;
    const posDeviceCount = permissions.posDevices?.length || 0;
    
    return `模块权限: ${moduleCount}个, POS设备: ${posDeviceCount}个`;
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
          {orgTypes.map(type => {
            const typeMap = {
              'HEADQUARTER': '总部',
              'DEPARTMENT': '部门',
              'CITY_BRANCH': '分公司',
              'SERVICE_AREA': '服务区',
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
        return <Tag color="orange">{scopeMap[permissions.dataScope]}</Tag>;
      }
    },
    {
      title: '权限统计',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => getPermissionStats(permissions),
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增角色
          </Button>
        </div>

        <Table
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
        />
      </Card>

      {/* 角色配置弹窗 */}
      <RoleConfigModal
        visible={modalVisible}
        title={editingRole ? '编辑角色' : '新增角色'}
        roleData={editingRole}
        onOk={handleSave}
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