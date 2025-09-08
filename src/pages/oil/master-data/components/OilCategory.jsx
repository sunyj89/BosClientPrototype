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
import './OilCategory.css';
import mockData from '../../../../mock/oil/master-data.json';

const { TextArea } = Input;
const { Option } = Select;

const OilCategory = ({ setLoading }) => {
  const [loading, setLoadingState] = useState(false);
  const [categoryForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['1', '1-1', '1-2', '2', '2-1', '3', '3-1']);
  const [treeData, setTreeData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchedKeys, setSearchedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [oilList, setOilList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoadingState(true);
    setLoading(true);
    setTimeout(() => {
      setTreeData(mockData.oilCategoryTree);
      setOilList(mockData.oilListForCategory);
      setLoadingState(false);
      setLoading(false);
    }, 500);
  };

  // 处理树形数据，添加渲染所需的属性
  const processTreeData = (data) => {
    return data.map(node => ({
      ...node,
      title: renderTreeTitle(node),
      children: node.children ? processTreeData(node.children) : undefined
    }));
  };

  // 获取扁平化的分类列表
  const getFlatCategoryList = (data, result = []) => {
    data.forEach(item => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        getFlatCategoryList(item.children, result);
      }
    });
    return result;
  };

  // 生成分类ID
  const generateCategoryId = (parentCategoryId = null, level) => {
    // 这里可以根据业务需求生成分类ID
    const timestamp = Date.now().toString().slice(-4);
    return parentCategoryId ? `${parentCategoryId}_${timestamp}` : `CAT_${timestamp}`;
  };

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
        <Tag size="small" color={
          nodeData.level === 1 ? 'blue' : 
          nodeData.level === 2 ? 'green' : 
          nodeData.level === 3 ? 'orange' : 'purple'
        }>
          {nodeData.level}级
        </Tag>
        {(nodeData.level >= 3) && nodeData.oilCodes && (
          <Tag size="small" color="purple">
            {nodeData.oilCodes.length}个油品
          </Tag>
        )}
      </Space>
      <Space size="small" onClick={(e) => e.stopPropagation()}>
        {nodeData.level < 4 && (
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
            onClick={() => handleDelete(nodeData)}
          />
        </Tooltip>
      </Space>
    </div>
  );

  // 表格列定义
  const columns = [
    {
      title: '分类ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 140,
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '分类名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        const displayTitle = typeof text === 'string' ? text : record.originalTitle || record.title;
        return (
          <Space>
            {record.level === 1 && <FolderOutlined style={{ color: '#1890ff' }} />}
            {record.level === 2 && <FolderOpenOutlined style={{ color: '#52c41a' }} />}
            {record.level === 3 && <AppstoreOutlined style={{ color: '#faad14' }} />}
            {record.level === 4 && <AppstoreOutlined style={{ color: '#722ed1' }} />}
            <span style={{ fontWeight: 500 }}>{displayTitle}</span>
            <Tag color={
              record.level === 1 ? 'blue' : 
              record.level === 2 ? 'green' : 
              record.level === 3 ? 'orange' : 'purple'
            }>
              {record.level}级
            </Tag>
          </Space>
        );
      }
    },
    {
      title: '上级分类ID',
      dataIndex: 'parentCategoryId',
      key: 'parentCategoryId',
      width: 140,
      render: (text) => (
        text ? <Tag color="geekblue">{text}</Tag> : '-'
      )
    },
    {
      title: '上级分类名称',
      dataIndex: 'parentCategoryName',
      key: 'parentCategoryName',
      width: 140,
      render: (text) => (
        text ? <span>{text}</span> : '-'
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
      title: '关联油品数',
      key: 'oilCount',
      width: 120,
      align: 'center',
      render: (_, record) => (
        record.level >= 3 ? (
          <Tag color="purple">{record.oilCodes ? record.oilCodes.length : 0}</Tag>
        ) : '-'
      )
    }
  ];

  const handleAddRoot = () => {
    setModalType('create');
    setCurrentCategory(null);
    setModalVisible(true);
    categoryForm.setFieldsValue({
      level: 1,
      status: 'active',
      sort: 1,
      parentCategoryId: null,
      parentCategoryName: null
    });
  };

  const handleAddChild = (parent) => {
    if (parent.level >= 4) {
      message.warning('最多支持四级分类');
      return;
    }

    setModalType('create');
    setCurrentCategory(parent);
    setModalVisible(true);
    categoryForm.setFieldsValue({
      level: parent.level + 1,
      parentTitle: typeof parent.title === 'string' ? parent.title : parent.originalTitle || parent.title,
      parentCategoryId: parent.categoryId,
      parentCategoryName: typeof parent.title === 'string' ? parent.title : parent.originalTitle || parent.title,
      status: 'active',
      sort: 1
    });
  };

  const handleEdit = (category) => {
    setModalType('edit');
    setCurrentCategory(category);
    setModalVisible(true);
    const displayTitle = typeof category.title === 'string' ? category.title : category.originalTitle || category.title;
    categoryForm.setFieldsValue({
      categoryId: category.categoryId,
      title: displayTitle,
      level: category.level,
      sort: category.sort,
      status: category.status,
      description: category.description,
      parentTitle: category.parentCategoryName,
      parentCategoryId: category.parentCategoryId,
      parentCategoryName: category.parentCategoryName
    });
  };

  const handleDelete = (category) => {
    if (category.level === 1) {
      message.warning('一级分类不能删除');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除"${typeof category.title === 'string' ? category.title : category.originalTitle || category.title}"分类吗？`,
      onOk() {
        message.success('删除成功');
        loadData();
      }
    });
  };

  const handleModalOk = () => {
    categoryForm.validateFields().then(values => {
      setLoadingState(true);
      setTimeout(() => {
        if (modalType === 'create') {
          message.success('添加成功');
        } else {
          message.success('编辑成功');
        }
        setModalVisible(false);
        categoryForm.resetFields();
        loadData();
        setLoadingState(false);
      }, 800);
    });
  };

  const onTreeSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  const onTreeExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const searchInTree = (data, keyword) => {
    const loop = (nodes) => {
      const result = [];
      nodes.forEach(node => {
        const title = typeof node.title === 'string' ? node.title : node.originalTitle || node.title;
        if (title.toLowerCase().includes(keyword.toLowerCase()) || 
            node.categoryId.toLowerCase().includes(keyword.toLowerCase())) {
          result.push(node.key);
        }
        if (node.children) {
          result.push(...loop(node.children));
        }
      });
      return result;
    };
    return loop(data);
  };

  const getAllParentKeys = (data, targetKeys) => {
    const loop = (nodes, parentKey = null) => {
      const result = [];
      nodes.forEach(node => {
        if (targetKeys.includes(node.key) && parentKey) {
          result.push(parentKey);
        }
        if (node.children) {
          result.push(...loop(node.children, node.key));
        }
      });
      return result;
    };
    
    const parentKeys = [];
    loop(data);
    return parentKeys;
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    
    if (!value) {
      setSearchedKeys([]);
      setExpandedKeys(['1', '1-1', '1-2', '1-3', '1-4']);
      setAutoExpandParent(false);
      return;
    }
    
    const matchedKeys = searchInTree(treeData, value);
    const parentKeys = getAllParentKeys(treeData, matchedKeys);
    const allExpandedKeys = [...new Set([...matchedKeys, ...parentKeys])];
    
    setSearchedKeys(matchedKeys);
    setExpandedKeys(allExpandedKeys);
    setAutoExpandParent(true);
    
    if (matchedKeys.length === 1) {
      setSelectedKeys(matchedKeys);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setSearchedKeys([]);
    setExpandedKeys(['1', '1-1', '1-2', '1-3', '1-4']);
    setAutoExpandParent(false);
  };

  const selectedCategory = selectedKeys.length > 0 
    ? getFlatCategoryList(treeData).find(item => item.key === selectedKeys[0])
    : null;

  // 获取关联的油品列表
  const getRelatedOils = (category) => {
    if (!category || !category.oilCodes) return [];
    return oilList.filter(oil => category.oilCodes.includes(oil.code));
  };

  return (
    <div className="oil-category-container">
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
                    
                    {/* 关联油品列表 */}
                    {selectedCategory.level >= 3 && (
                      <div style={{ marginTop: 16 }}>
                        <h4>关联油品</h4>
                        {getRelatedOils(selectedCategory).length > 0 ? (
                          <Table
                            columns={[
                              {
                                title: '油品编号',
                                dataIndex: 'code',
                                key: 'code',
                                width: 120
                              },
                              {
                                title: '油品名称',
                                dataIndex: 'name',
                                key: 'name'
                              }
                            ]}
                            dataSource={getRelatedOils(selectedCategory)}
                            pagination={false}
                            rowKey="code"
                            size="small"
                          />
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                            暂无关联油品
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* 子分类列表 */}
                    {selectedCategory.level < 4 && (
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
        width={700}
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
                label="分类ID"
                rules={[{ required: true, message: '请输入分类ID' }]}
              >
                <Input placeholder="请输入分类ID" disabled={modalType === 'edit'} />
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
            <Col span={8}>
              <Form.Item name="level" label="分类级别">
                <Select disabled>
                  <Option value={1}>一级分类</Option>
                  <Option value={2}>二级分类</Option>
                  <Option value={3}>三级分类</Option>
                  <Option value={4}>四级分类</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="parentCategoryId" label="上级分类ID">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="parentCategoryName" label="上级分类名称">
                <Input disabled />
              </Form.Item>
            </Col>
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

export default OilCategory; 