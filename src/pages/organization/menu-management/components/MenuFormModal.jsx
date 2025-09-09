import React, { useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  TreeSelect, 
  InputNumber, 
  Switch,
  message 
} from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const MenuFormModal = ({ 
  visible, 
  isEdit, 
  initialData, 
  menuTreeData,
  onCancel, 
  onSubmit,
  loading 
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isEdit && initialData) {
        form.setFieldsValue({
          ...initialData,
          status: initialData.status === 1
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          type: 'menu',
          status: true,
          sort: 1
        });
      }
    }
  }, [visible, isEdit, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        status: values.status ? 1 : 0
      };
      onSubmit(formData);
    } catch (error) {
      message.error('请检查表单输入');
    }
  };

  const menuTypeOptions = [
    { value: 'directory', label: '目录' },
    { value: 'menu', label: '菜单' },
    { value: 'button', label: '按钮' }
  ];

  const getTreeSelectData = (data) => {
    return data?.map(item => ({
      title: item.name,
      value: item.id,
      children: item.children ? getTreeSelectData(item.children) : undefined
    })) || [];
  };

  return (
    <Modal
      title={isEdit ? '编辑菜单' : '新增菜单'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnHidden
      width={600}
      okText="确定"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          name="parentId"
          label="父级菜单"
        >
          <TreeSelect
            placeholder="请选择父级菜单（留空表示顶级菜单）"
            treeData={getTreeSelectData(menuTreeData)}
            allowClear
            showSearch
            treeNodeFilterProp="title"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="菜单类型"
          rules={[{ required: true, message: '请选择菜单类型' }]}
        >
          <Select placeholder="请选择菜单类型">
            {menuTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="菜单名称"
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="请输入菜单名称" />
        </Form.Item>

        <Form.Item
          name="id"
          label="权限标识"
          rules={[{ required: true, message: '请输入权限标识' }]}
        >
          <Input placeholder="请输入权限标识，如：dashboard:view" />
        </Form.Item>

        <Form.Item
          name="path"
          label="路由地址"
        >
          <Input placeholder="请输入路由地址，如：/dashboard" />
        </Form.Item>

        <Form.Item
          name="icon"
          label="图标"
        >
          <Input placeholder="请输入图标名称，如：DashboardOutlined" />
        </Form.Item>

        <Form.Item
          name="component"
          label="组件路径"
        >
          <Input placeholder="请输入组件路径，如：./Dashboard" />
        </Form.Item>

        <Form.Item
          name="sort"
          label="排序序号"
          rules={[{ required: true, message: '请输入排序序号' }]}
        >
          <InputNumber 
            placeholder="请输入排序序号" 
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="启用" 
            unCheckedChildren="禁用" 
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <TextArea 
            placeholder="请输入菜单描述" 
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuFormModal;