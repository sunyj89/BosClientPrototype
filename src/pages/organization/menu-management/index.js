import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  message, 
  Typography,
  Breadcrumb,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  HomeOutlined,
  SettingOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MenuTable from './components/MenuTable';
import MenuFormModal from './components/MenuFormModal';
import * as menuApi from './services/api';
import './index.css';

const { Title } = Typography;

const MenuManagement = () => {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const result = await menuApi.getMenus();
      if (result.success) {
        setMenuData(result.data);
      } else {
        message.error(result.message || '获取菜单列表失败');
      }
    } catch (error) {
      message.error('获取菜单列表失败');
      console.error('获取菜单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setEditingMenu(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditingMenu(record);
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const result = await menuApi.deleteMenu(record.id);
      if (result.success) {
        message.success('删除菜单成功');
        loadMenus();
      } else {
        message.error(result.message || '删除菜单失败');
      }
    } catch (error) {
      message.error('删除菜单失败');
      console.error('删除菜单失败:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setModalLoading(true);
      let result;
      
      if (isEditMode) {
        result = await menuApi.updateMenu(editingMenu.id, formData);
      } else {
        result = await menuApi.createMenu(formData);
      }
      
      if (result.success) {
        message.success(isEditMode ? '更新菜单成功' : '添加菜单成功');
        setModalVisible(false);
        loadMenus();
      } else {
        message.error(result.message || '保存菜单失败');
      }
    } catch (error) {
      message.error('保存菜单失败');
      console.error('保存菜单失败:', error);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="menu-management">
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
          <MenuOutlined />
          菜单管理
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <div className="page-header">
          <div>
            <Title level={4} style={{ margin: 0 }}>菜单管理</Title>
            <p style={{ color: '#666', margin: 0 }}>
              管理系统菜单和权限配置，支持树状菜单结构管理
            </p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增菜单
          </Button>
        </div>

        <Spin spinning={loading}>
          <MenuTable
            menuData={menuData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </Spin>
      </Card>

      <MenuFormModal
        visible={modalVisible}
        isEdit={isEditMode}
        initialData={editingMenu}
        menuTreeData={menuData}
        loading={modalLoading}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default MenuManagement;