import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Breadcrumb, 
  message, 
  Popconfirm,
  Tag,
  Row,
  Col,
  Statistic,
  Tree
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  AppstoreOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const GoodsCategoryManagement = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增商品类别');
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedKeys] = useState(['1']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  
  // 模拟商品类别数据
  const [categories, setCategories] = useState([
    {
      key: '1',
      id: 'C001',
      name: '饮料',
      code: 'drink',
      level: 1,
      parentId: '0',
      parentName: '顶级类别',
      status: '启用',
      sort: 1,
      createTime: '2025-01-10',
      children: [
        {
          key: '1-1',
          id: 'C001001',
          name: '碳酸饮料',
          code: 'drink_carbonated',
          level: 2,
          parentId: 'C001',
          parentName: '饮料',
          status: '启用',
          sort: 1,
          createTime: '2025-01-10',
        },
        {
          key: '1-2',
          id: 'C001002',
          name: '果汁',
          code: 'drink_juice',
          level: 2,
          parentId: 'C001',
          parentName: '饮料',
          status: '启用',
          sort: 2,
          createTime: '2025-01-10',
        },
        {
          key: '1-3',
          id: 'C001003',
          name: '茶饮料',
          code: 'drink_tea',
          level: 2,
          parentId: 'C001',
          parentName: '饮料',
          status: '启用',
          sort: 3,
          createTime: '2025-01-10',
        }
      ]
    },
    {
      key: '2',
      id: 'C002',
      name: '食品',
      code: 'food',
      level: 1,
      parentId: '0',
      parentName: '顶级类别',
      status: '启用',
      sort: 2,
      createTime: '2025-01-11',
      children: [
        {
          key: '2-1',
          id: 'C002001',
          name: '方便面',
          code: 'food_instant_noodles',
          level: 2,
          parentId: 'C002',
          parentName: '食品',
          status: '启用',
          sort: 1,
          createTime: '2025-01-11',
        },
        {
          key: '2-2',
          id: 'C002002',
          name: '零食',
          code: 'food_snacks',
          level: 2,
          parentId: 'C002',
          parentName: '食品',
          status: '启用',
          sort: 2,
          createTime: '2025-01-11',
        }
      ]
    },
    {
      key: '3',
      id: 'C003',
      name: '日用品',
      code: 'daily',
      level: 1,
      parentId: '0',
      parentName: '顶级类别',
      status: '启用',
      sort: 3,
      createTime: '2025-01-12',
      children: [
        {
          key: '3-1',
          id: 'C003001',
          name: '洗护用品',
          code: 'daily_cleaning',
          level: 2,
          parentId: 'C003',
          parentName: '日用品',
          status: '启用',
          sort: 1,
          createTime: '2025-01-12',
        },
        {
          key: '3-2',
          id: 'C003002',
          name: '纸品',
          code: 'daily_paper',
          level: 2,
          parentId: 'C003',
          parentName: '日用品',
          status: '启用',
          sort: 2,
          createTime: '2025-01-12',
        }
      ]
    },
    {
      key: '4',
      id: 'C004',
      name: '汽车用品',
      code: 'auto',
      level: 1,
      parentId: '0',
      parentName: '顶级类别',
      status: '启用',
      sort: 4,
      createTime: '2025-01-13',
      children: [
        {
          key: '4-1',
          id: 'C004001',
          name: '机油',
          code: 'auto_oil',
          level: 2,
          parentId: 'C004',
          parentName: '汽车用品',
          status: '启用',
          sort: 1,
          createTime: '2025-01-13',
        },
        {
          key: '4-2',
          id: 'C004002',
          name: '车载电器',
          code: 'auto_electronics',
          level: 2,
          parentId: 'C004',
          parentName: '汽车用品',
          status: '启用',
          sort: 2,
          createTime: '2025-01-13',
        }
      ]
    },
    {
      key: '5',
      id: 'C005',
      name: '其他',
      code: 'other',
      level: 1,
      parentId: '0',
      parentName: '顶级类别',
      status: '禁用',
      sort: 5,
      createTime: '2025-01-14',
    }
  ]);

  // 将类别数据转换为树形结构
  const getCategoryTreeData = () => {
    return categories.map(category => ({
      title: category.name,
      key: category.key,
      children: category.children ? category.children.map(child => ({
        title: child.name,
        key: child.key,
      })) : undefined
    }));
  };

  // 获取所有类别（扁平化）
  const getAllCategories = () => {
    let allCategories = [...categories];
    categories.forEach(category => {
      if (category.children) {
        allCategories = [...allCategories, ...category.children];
      }
    });
    return allCategories;
  };

  // 获取父类别选项
  const getParentOptions = () => {
    const options = [{ id: '0', name: '顶级类别' }];
    categories.forEach(category => {
      options.push({ id: category.id, name: category.name });
    });
    return options;
  };

  // 表格列配置
  const columns = [
    {
      title: '类别ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '类别名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '类别编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (text) => `${text}级`,
    },
    {
      title: '上级类别',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 150,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        return text === '启用' ? 
          <Tag color="green">启用</Tag> : 
          <Tag color="red">禁用</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此类别吗？"
            description="删除后将无法恢复！"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理添加按钮点击
  const handleAdd = () => {
    setModalTitle('新增商品类别');
    setEditingRecord(null);
    form.resetFields();
    
    // 设置默认值
    form.setFieldsValue({
      parentId: '0',
      level: 1,
      status: '启用',
      sort: 1,
    });
    
    setModalVisible(true);
  };

  // 处理编辑按钮点击
  const handleEdit = (record) => {
    setModalTitle('编辑商品类别');
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  // 处理删除按钮点击
  const handleDelete = (record) => {
    // 检查是否有子类别
    if (record.children && record.children.length > 0) {
      message.error('该类别下有子类别，无法删除！');
      return;
    }
    
    // 删除类别
    if (record.level === 1) {
      // 删除一级类别
      setCategories(categories.filter(item => item.key !== record.key));
    } else {
      // 删除二级类别
      const updatedCategories = categories.map(category => {
        if (category.id === record.parentId) {
          return {
            ...category,
            children: category.children.filter(child => child.key !== record.key)
          };
        }
        return category;
      });
      setCategories(updatedCategories);
    }
    
    message.success('删除成功');
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const { name, code, parentId, status, sort } = values;
          
          // 获取父类别信息
          const parentCategory = getParentOptions().find(item => item.id === parentId);
          
          if (editingRecord) {
            // 编辑现有类别
            if (editingRecord.level === 1) {
              // 编辑一级类别
              const updatedCategories = categories.map(item => {
                if (item.key === editingRecord.key) {
                  return { 
                    ...item, 
                    name,
                    code,
                    parentId,
                    parentName: parentCategory.name,
                    status,
                    sort: parseInt(sort),
                  };
                }
                return item;
              });
              
              setCategories(updatedCategories);
            } else {
              // 编辑二级类别
              const updatedCategories = categories.map(category => {
                if (category.id === editingRecord.parentId) {
                  return {
                    ...category,
                    children: category.children.map(child => {
                      if (child.key === editingRecord.key) {
                        return {
                          ...child,
                          name,
                          code,
                          status,
                          sort: parseInt(sort),
                        };
                      }
                      return child;
                    })
                  };
                }
                return category;
              });
              
              setCategories(updatedCategories);
            }
            
            message.success('编辑成功');
          } else {
            // 添加新类别
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10);
            
            if (parentId === '0') {
              // 添加一级类别
              const newKey = (parseInt(categories[categories.length - 1]?.key || '0') + 1).toString();
              const newId = `C${newKey.padStart(3, '0')}`;
              
              const newCategory = {
                key: newKey,
                id: newId,
                name,
                code,
                level: 1,
                parentId,
                parentName: parentCategory.name,
                status,
                sort: parseInt(sort),
                createTime: dateStr,
              };
              
              setCategories([...categories, newCategory]);
            } else {
              // 添加二级类别
              const parentCategoryIndex = categories.findIndex(item => item.id === parentId);
              
              if (parentCategoryIndex === -1) {
                message.error('父类别不存在');
                setLoading(false);
                return;
              }
              
              const parentCategory = categories[parentCategoryIndex];
              const childrenCount = parentCategory.children?.length || 0;
              const newKey = `${parentCategoryIndex + 1}-${childrenCount + 1}`;
              const newId = `${parentId}${(childrenCount + 1).toString().padStart(3, '0')}`;
              
              const newChild = {
                key: newKey,
                id: newId,
                name,
                code,
                level: 2,
                parentId,
                parentName: parentCategory.name,
                status,
                sort: parseInt(sort),
                createTime: dateStr,
              };
              
              const updatedCategories = [...categories];
              if (!updatedCategories[parentCategoryIndex].children) {
                updatedCategories[parentCategoryIndex].children = [];
              }
              updatedCategories[parentCategoryIndex].children.push(newChild);
              
              setCategories(updatedCategories);
            }
            
            message.success('添加成功');
          }
          
          setLoading(false);
          setModalVisible(false);
        }, 500);
      })
      .catch(info => {
        console.log('验证失败:', info);
      });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理树选择
  const handleTreeSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  // 统计数据
  const statistics = {
    totalCategories: getAllCategories().length,
    level1Categories: categories.length,
    level2Categories: getAllCategories().length - categories.length,
    enabledCategories: getAllCategories().filter(item => item.status === '启用').length,
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/goods">商品管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>商品类别管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>商品类别管理</h2>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="类别总数"
              value={statistics.totalCategories}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="一级类别数"
              value={statistics.level1Categories}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="二级类别数"
              value={statistics.level2Categories}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="启用类别数"
              value={statistics.enabledCategories}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 类别树 */}
        <Col span={6}>
          <Card title="类别树" style={{ marginBottom: 16 }}>
            <Tree
              treeData={getCategoryTreeData()}
              defaultExpandedKeys={expandedKeys}
              onSelect={handleTreeSelect}
              showLine
              showIcon
              icon={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        
        {/* 类别列表 */}
        <Col span={18}>
          <Card>
            {/* 搜索区域 */}
            <div className="search-container" style={{ marginBottom: 16 }}>
              <Form layout="inline">
                <Form.Item name="id" label="类别ID">
                  <Input placeholder="请输入类别ID" />
                </Form.Item>
                <Form.Item name="name" label="类别名称">
                  <Input placeholder="请输入类别名称" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </div>
            
            <div className="table-operations" style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                新增类别
              </Button>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={selectedKeys.length > 0 ? 
                getAllCategories().filter(item => selectedKeys.includes(item.key)) : 
                getAllCategories()} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 添加/编辑模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          name="categoryForm"
        >
          <Form.Item
            name="name"
            label="类别名称"
            rules={[{ required: true, message: '请输入类别名称' }]}
          >
            <Input placeholder="请输入类别名称" />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="类别编码"
            rules={[{ required: true, message: '请输入类别编码' }]}
          >
            <Input placeholder="请输入类别编码" />
          </Form.Item>
          
          <Form.Item
            name="parentId"
            label="上级类别"
            rules={[{ required: true, message: '请选择上级类别' }]}
          >
            <select 
              style={{ width: '100%', height: '32px', borderRadius: '2px', border: '1px solid #d9d9d9', padding: '0 11px' }}
              disabled={editingRecord && editingRecord.level === 2}
            >
              {getParentOptions().map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <select style={{ width: '100%', height: '32px', borderRadius: '2px', border: '1px solid #d9d9d9', padding: '0 11px' }}>
              <option value="启用">启用</option>
              <option value="禁用">禁用</option>
            </select>
          </Form.Item>
          
          <Form.Item
            name="sort"
            label="排序"
            rules={[
              { required: true, message: '请输入排序值' },
              { type: 'number', min: 1, message: '排序值必须大于0' }
            ]}
          >
            <Input type="number" placeholder="请输入排序值" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GoodsCategoryManagement; 