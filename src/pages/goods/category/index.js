import React, { useState, useEffect } from 'react';
import {
  Card,
  Tree,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Table,
  Tag,
  Tooltip,
  Select,
  InputNumber,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  SearchOutlined,
  ClearOutlined
} from '@ant-design/icons';

// 导入mock数据
import categoryData from '../../../mock/goods/categoryList.json';
import './index.css';

const { TextArea } = Input;
const { Option } = Select;

const CategoryManagement = () => {
  const [loading, setLoading] = useState(false);
  const [categoryForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['1', '2']);
  const [treeData, setTreeData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchedKeys, setSearchedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  useEffect(() => {
    // 从mock数据初始化
    setTreeData(categoryData.categories);
  }, []);

  // 表格列定义（用于显示分类详情）
  const columns = [
    {
      title: '品类ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 120,
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '分类名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          {record.level === 1 && <FolderOutlined style={{ color: '#1890ff' }} />}
          {record.level === 2 && <FolderOpenOutlined style={{ color: '#52c41a' }} />}
          {record.level === 3 && <AppstoreOutlined style={{ color: '#faad14' }} />}
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag color={record.level === 1 ? 'blue' : record.level === 2 ? 'green' : 'orange'}>
            {record.level}级
          </Tag>
        </Space>
      )
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.level < 3 && (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              style={{ borderRadius: '2px' }}
              onClick={() => handleAddChild(record)}
            >
              添加子类
            </Button>
          )}
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 高亮搜索文本
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: '#ffc069', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 树形节点渲染
  const renderTreeTitle = (nodeData) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Space>
        <span style={{ fontWeight: 500 }}>
          {highlightText(nodeData.originalTitle || nodeData.title, searchValue)}
        </span>
        <Tag size="small" color="blue">
          {highlightText(nodeData.categoryId, searchValue)}
        </Tag>
        <Tag size="small" color={nodeData.level === 1 ? 'blue' : nodeData.level === 2 ? 'green' : 'orange'}>
          {nodeData.level}级
        </Tag>
      </Space>
      <Space size="small" onClick={(e) => e.stopPropagation()}>
        {nodeData.level < 3 && (
          <Tooltip title="添加子分类">
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              style={{ borderRadius: '2px' }}
              onClick={() => handleAddChild(nodeData)}
            />
          </Tooltip>
        )}
        <Tooltip title="编辑">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={() => handleEdit(nodeData)}
          />
        </Tooltip>
        <Tooltip title="删除">
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            style={{ borderRadius: '2px' }}
            danger
            onClick={() => handleDelete(nodeData)}
          />
        </Tooltip>
      </Space>
    </div>
  );

  // 递归处理树形数据，添加自定义标题
  const processTreeData = (data) => {
    return data.map(item => ({
      ...item,
      originalTitle: item.title, // 保留原始标题用于搜索
      title: renderTreeTitle(item),
      children: item.children ? processTreeData(item.children) : undefined
    }));
  };

  // 获取选中分类的详细信息（扁平化树形数据）
  const getFlatCategoryList = (data, result = []) => {
    data.forEach(item => {
      // 从原始数据获取标题，而不是从渲染的React组件中获取
      const originalTitle = typeof item.title === 'string' ? item.title : 
        (item.originalTitle || item.title?.props?.children[0]?.props?.children || '');
      
      result.push({
        key: item.key,
        categoryId: item.categoryId,
        title: originalTitle,
        level: item.level,
        sort: item.sort,
        status: item.status,
        description: item.description
      });
      if (item.children) {
        getFlatCategoryList(item.children, result);
      }
    });
    return result;
  };

  // 生成新的品类ID
  const generateCategoryId = (parentCategoryId = null, level) => {
    if (level === 1) {
      const lastId = treeData.length > 0 ? 
        Math.max(...treeData.map(item => parseInt(item.categoryId.slice(-3)))) + 1 : 1;
      return `CTG${lastId.toString().padStart(3, '0')}`;
    } else {
      const newSeq = '001'; // 简化处理，实际项目中会计算现有子类数量
      return `${parentCategoryId}-${newSeq}`;
    }
  };

  const handleAddRoot = () => {
    setModalType('create');
    setCurrentCategory({ level: 1, parentKey: null });
    categoryForm.resetFields();
    categoryForm.setFieldsValue({ 
      level: 1, 
      status: 'active', 
      sort: 1,
      categoryId: generateCategoryId(null, 1)
    });
    setModalVisible(true);
  };

  const handleAddChild = (parent) => {
    // 获取原始标题
    const parentTitle = typeof parent.title === 'string' ? parent.title :
      (parent.originalTitle || parent.title?.props?.children[0]?.props?.children || '');
      
    setModalType('create');
    setCurrentCategory({ 
      level: parent.level + 1, 
      parentKey: parent.key,
      parentTitle: parentTitle,
      parentCategoryId: parent.categoryId
    });
    categoryForm.resetFields();
    categoryForm.setFieldsValue({ 
      level: parent.level + 1, 
      status: 'active', 
      sort: 1,
      parentTitle: parentTitle,
      categoryId: generateCategoryId(parent.categoryId, parent.level + 1)
    });
    setModalVisible(true);
  };

  const handleEdit = (category) => {
    // 获取原始标题
    const originalTitle = typeof category.title === 'string' ? category.title :
      (category.originalTitle || category.title?.props?.children[0]?.props?.children || '');
      
    setModalType('edit');
    setCurrentCategory(category);
    categoryForm.setFieldsValue({
      categoryId: category.categoryId,
      title: originalTitle,
      level: category.level,
      sort: category.sort,
      status: category.status,
      description: category.description || ''
    });
    setModalVisible(true);
  };

  const handleDelete = (category) => {
    // 获取原始标题
    const originalTitle = typeof category.title === 'string' ? category.title :
      (category.originalTitle || category.title?.props?.children[0]?.props?.children || '');
      
    Modal.confirm({
      title: '确认删除分类',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>确定要删除分类 "{originalTitle}" 吗？</p>
          {category.children && category.children.length > 0 && (
            <p style={{ color: '#ff4d4f' }}>注意：删除该分类将同时删除所有子分类！</p>
          )}
        </div>
      ),
      onOk() {
        message.success('删除成功');
        // 实际项目中这里会调用删除API
      }
    });
  };

  const handleModalOk = () => {
    categoryForm.validateFields().then(values => {
      console.log('分类数据:', values);
      setModalVisible(false);
      message.success(`${modalType === 'create' ? '创建' : '编辑'}成功`);
      // 实际项目中这里会调用API
    });
  };

  const onTreeSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  const onTreeExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  // 搜索功能
  const searchInTree = (data, keyword) => {
    const result = [];
    const loop = (nodes) => {
      nodes.forEach(node => {
        const title = node.originalTitle || node.title || '';
        const categoryId = node.categoryId || '';
        
        if (title.toLowerCase().includes(keyword.toLowerCase()) || 
            categoryId.toLowerCase().includes(keyword.toLowerCase())) {
          result.push(node.key);
        }
        
        if (node.children) {
          loop(node.children);
        }
      });
    };
    
    loop(data);
    return result;
  };

  const getAllParentKeys = (data, targetKeys) => {
    const parentKeys = [];
    const loop = (nodes, parentKey = null) => {
      nodes.forEach(node => {
        if (targetKeys.includes(node.key) && parentKey) {
          parentKeys.push(parentKey);
          // 递归获取所有父级key
          let currentParent = parentKey;
          while (currentParent) {
            const parts = currentParent.split('-');
            if (parts.length > 1) {
              parts.pop();
              currentParent = parts.join('-');
              if (!parentKeys.includes(currentParent)) {
                parentKeys.push(currentParent);
              }
            } else {
              break;
            }
          }
        }
        
        if (node.children) {
          loop(node.children, node.key);
        }
      });
    };
    
    loop(data);
    return parentKeys;
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    
    if (!value) {
      setSearchedKeys([]);
      setExpandedKeys(['1', '2']);
      setAutoExpandParent(false);
      return;
    }
    
    const matchedKeys = searchInTree(treeData, value); // 使用原始树数据进行搜索
    const parentKeys = getAllParentKeys(treeData, matchedKeys);
    const allExpandedKeys = [...new Set([...matchedKeys, ...parentKeys])];
    
    setSearchedKeys(matchedKeys);
    setExpandedKeys(allExpandedKeys);
    setAutoExpandParent(true);
    
    // 如果只有一个搜索结果，自动选中
    if (matchedKeys.length === 1) {
      setSelectedKeys(matchedKeys);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setSearchedKeys([]);
    setExpandedKeys(['1', '2']);
    setAutoExpandParent(false);
  };

  const selectedCategory = selectedKeys.length > 0 
    ? getFlatCategoryList(treeData).find(item => item.key === selectedKeys[0])
    : null;

  return (
    <div className="category-management-container">
      <Card>
        <Spin spinning={loading}>
          <Row gutter={16}>
            {/* 左侧分类树 */}
            <Col span={12}>
              <Card 
                title="分类树" 
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    style={{ borderRadius: '2px' }}
                    onClick={handleAddRoot}
                  >
                    添加一级分类
                  </Button>
                }
              >
                {/* 搜索框 */}
                <div style={{ marginBottom: 16 }}>
                  <Input.Search
                    placeholder="搜索分类名称或分类ID"
                    allowClear
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                    enterButton={<SearchOutlined />}
                    suffix={
                      searchValue ? (
                        <Tooltip title="清除搜索">
                          <Button
                            type="text"
                            size="small"
                            icon={<ClearOutlined />}
                            onClick={handleClearSearch}
                            style={{ border: 'none', padding: 0 }}
                          />
                        </Tooltip>
                      ) : null
                    }
                  />
                  {searchedKeys.length > 0 && (
                    <div style={{ 
                      marginTop: 8, 
                      fontSize: '12px', 
                      color: '#666',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>找到 {searchedKeys.length} 个匹配结果</span>
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={handleClearSearch}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        清除搜索
                      </Button>
                    </div>
                  )}
                </div>
                
                <Tree
                  showLine
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onSelect={onTreeSelect}
                  onExpand={onTreeExpand}
                  treeData={processTreeData(treeData)}
                  style={{ minHeight: 500 }}
                />
              </Card>
            </Col>

            {/* 右侧分类详情 */}
            <Col span={12}>
              <Card title="分类详情">
                {selectedCategory ? (
                  <div>
                    <Table
                      columns={columns}
                      dataSource={[selectedCategory]}
                      pagination={false}
                      rowKey="key"
                      scroll={{ x: 'max-content' }}
                    />
                    
                    {/* 子分类列表 */}
                    {selectedCategory.level < 3 && (
                      <div style={{ marginTop: 16 }}>
                        <h4>子分类</h4>
                        <Table
                          columns={columns}
                          dataSource={getFlatCategoryList(treeData).filter(item => 
                            item.key.startsWith(selectedCategory.key + '-') &&
                            item.key.split('-').length === selectedCategory.key.split('-').length + 1
                          )}
                          pagination={false}
                          rowKey="key"
                          size="small"
                          scroll={{ x: 'max-content' }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                    请从左侧选择分类查看详情
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Spin>
      </Card>

      {/* 新建/编辑分类弹窗 */}
      <Modal
        title={modalType === 'create' ? '新建分类' : '编辑分类'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={categoryForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="品类ID"
                rules={[{ required: true, message: '请输入品类ID' }]}
              >
                <Input placeholder="请输入品类ID" disabled={modalType === 'edit'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="title"
                label="分类名称"
                rules={[{ required: true, message: '请输入分类名称' }]}
              >
                <Input placeholder="请输入分类名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="level" label="分类级别">
                <Select disabled>
                  <Option value={1}>一级分类</Option>
                  <Option value={2}>二级分类</Option>
                  <Option value={3}>三级分类</Option>
                </Select>
              </Form.Item>
            </Col>
            {currentCategory?.parentTitle && (
              <Col span={12}>
                <Form.Item name="parentTitle" label="上级分类">
                  <Input disabled />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sort"
                label="排序"
                rules={[{ required: true, message: '请输入排序号' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="数字越小排序越靠前"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="active">启用</Option>
                  <Option value="inactive">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="分类描述">
            <TextArea rows={4} placeholder="请输入分类描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement; 