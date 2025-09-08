import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Row,
  Col,
  InputNumber,
  Transfer,
  Divider,
  Popconfirm,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;

const ComboProduct = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [comboForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [transferKeys, setTransferKeys] = useState([]);

  // 商品分类选项
  const categoryOptions = [
    { value: 'food', label: '食品饮料' },
    { value: 'snack', label: '零食糖果' },
    { value: 'drink', label: '饮品冲调' },
    { value: 'daily', label: '日用百货' },
    { value: 'fresh', label: '生鲜食品' }
  ];

  // 模拟组合商品数据
  const mockData = [
    {
      id: 'COMBO001',
      spuId: 'SPU001',
      skuCode: 'COMBO_SKU001',
      name: '早餐优惠套餐',
      category: 'food',
      categoryName: '食品饮料',
      specifications: '经典早餐组合，包含豆浆、包子、咸菜',
      unit: '组',
      price: 12.8,
      originalPrice: 16.0,
      discount: 3.2,
      status: 'active', // draft, pending, active, inactive
      statusName: '生效',
      stock: 50,
      salesCount: 156,
      createTime: '2025-01-15 10:30:00',
      approver: '张三',
      approveTime: '2025-01-15 14:20:00',
      items: [
        { skuId: 'SKU003001', name: '豆浆 原味 250ml', price: 3.5, quantity: 1 },
        { skuId: 'SKU003002', name: '包子 猪肉大葱 个', price: 4.0, quantity: 2 },
        { skuId: 'SKU003003', name: '咸菜 榨菜丝 袋', price: 2.5, quantity: 1 }
      ]
    },
    {
      id: 'COMBO002',
      spuId: '',
      skuCode: 'COMBO_SKU002',
      name: '饮品特惠组合',
      category: 'drink',
      categoryName: '饮品冲调',
      specifications: '多种饮品组合装，适合聚会分享',
      unit: '组',
      price: 25.8,
      originalPrice: 32.0,
      discount: 6.2,
      status: 'pending',
      statusName: '待审核',
      stock: 0,
      salesCount: 0,
      createTime: '2025-01-16 14:20:00',
      submitter: '李四',
      submitTime: '2025-01-16 14:20:00',
      items: [
        { skuId: 'SKU001001', name: '农夫山泉天然水 550ml', price: 2.5, quantity: 2 },
        { skuId: 'SKU004001', name: '可口可乐 330ml', price: 3.5, quantity: 3 },
        { skuId: 'SKU004002', name: '雪碧 330ml', price: 3.0, quantity: 2 }
      ]
    },
    {
      id: 'COMBO003',
      spuId: 'SPU003',
      skuCode: 'COMBO_SKU003',
      name: '零食大礼包',
      category: 'snack',
      categoryName: '零食糖果',
      specifications: '精选多种零食，满足不同口味需求',
      unit: '组',
      price: 45.0,
      originalPrice: 58.0,
      discount: 13.0,
      status: 'draft',
      statusName: '草稿',
      stock: 0,
      salesCount: 0,
      createTime: '2025-01-17 09:15:00',
      items: [
        { skuId: 'SKU005001', name: '薯片 原味 袋', price: 8.5, quantity: 2 },
        { skuId: 'SKU005002', name: '巧克力 牛奶味 块', price: 12.0, quantity: 1 },
        { skuId: 'SKU005003', name: '坚果 混合装 袋', price: 15.0, quantity: 1 },
        { skuId: 'SKU005004', name: '果冻 什锦味 盒', price: 6.5, quantity: 2 }
      ]
    },
    {
      id: 'COMBO004',
      spuId: 'SPU004',
      skuCode: 'COMBO_SKU004',
      name: '经典套餐组合',
      category: 'food',
      categoryName: '食品饮料',
      specifications: '经典搭配，营养均衡',
      unit: '组',
      price: 35.0,
      originalPrice: 42.0,
      discount: 7.0,
      status: 'inactive',
      statusName: '停用',
      stock: 0,
      salesCount: 25,
      createTime: '2025-01-10 08:30:00',
      items: [
        { skuId: 'SKU001001', name: '农夫山泉天然水 550ml', price: 2.5, quantity: 1 },
        { skuId: 'SKU002001', name: '康师傅方便面 红烧牛肉面', price: 3.5, quantity: 2 }
      ]
    }
  ];

  // 可选商品数据（用于组合商品选择）
  const availableProducts = [
    { key: 'SKU001001', title: '农夫山泉天然水 550ml - ¥2.5', price: 2.5, stock: 1200 },
    { key: 'SKU001002', title: '农夫山泉天然水 1.5L - ¥4.0', price: 4.0, stock: 800 },
    { key: 'SKU002001', title: '康师傅方便面 红烧牛肉面 - ¥3.5', price: 3.5, stock: 500 },
    { key: 'SKU003001', title: '豆浆 原味 250ml - ¥3.5', price: 3.5, stock: 200 },
    { key: 'SKU003002', title: '包子 猪肉大葱 个 - ¥4.0', price: 4.0, stock: 150 },
    { key: 'SKU003003', title: '咸菜 榨菜丝 袋 - ¥2.5', price: 2.5, stock: 300 },
    { key: 'SKU004001', title: '可口可乐 330ml - ¥3.5', price: 3.5, stock: 600 },
    { key: 'SKU004002', title: '雪碧 330ml - ¥3.0', price: 3.0, stock: 450 },
    { key: 'SKU005001', title: '薯片 原味 袋 - ¥8.5', price: 8.5, stock: 180 },
    { key: 'SKU005002', title: '巧克力 牛奶味 块 - ¥12.0', price: 12.0, stock: 120 },
    { key: 'SKU005003', title: '坚果 混合装 袋 - ¥15.0', price: 15.0, stock: 80 },
    { key: 'SKU005004', title: '果冻 什锦味 盒 - ¥6.5', price: 6.5, stock: 250 }
  ];

  const [dataSource, setDataSource] = useState(mockData);
  const [comboItems, setComboItems] = useState([]);

  // 获取状态配置
  const getStatusConfig = (status) => {
    const configs = {
      draft: { color: 'default', text: '草稿' },
      pending: { color: 'processing', text: '待审核' },
      active: { color: 'success', text: '生效' },
      inactive: { color: 'error', text: '停用' }
    };
    return configs[status] || configs.draft;
  };

  // 检查操作权限
  const checkPermission = (record, action) => {
    const { status } = record;
    
    switch (action) {
      case 'edit':
        return status === 'draft';
      case 'delete':
        return status === 'draft';
      case 'view':
        return true;
      default:
        return false;
    }
  };

  const columns = [
    {
      title: '组合商品信息',
      key: 'productInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
            ID: {record.id}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
            SKU: {record.skuCode}
          </div>
          {record.spuId && (
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
              SPU: {record.spuId}
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#666' }}>
            包含 {record.items.length} 个子商品
          </div>
          <Tag color="purple" size="small" style={{ marginTop: 4 }}>
            {record.unit}
          </Tag>
        </div>
      )
    },
    {
      title: '分类信息',
      key: 'categoryInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.categoryName}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            {record.specifications}
          </div>
        </div>
      )
    },
    {
      title: '价格信息',
      key: 'priceInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ color: '#ff4d4f', fontWeight: 500, fontSize: '16px' }}>
            ¥{record.price}
          </div>
          <div style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
            原价：¥{record.originalPrice}
          </div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>
            优惠：¥{record.discount}
          </div>
        </div>
      )
    },
    {
      title: '库存/销量',
      key: 'stockSales',
      width: 120,
      render: (_, record) => (
        <div>
          <div>库存：{record.stock}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            销量：{record.salesCount}
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          
          {checkPermission(record, 'edit') ? (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              style={{ borderRadius: '2px' }}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          ) : (
            <Tooltip title="只有草稿状态的组合商品可以编辑">
              <Button
                size="small"
                icon={<EditOutlined />}
                style={{ borderRadius: '2px' }}
                disabled
              >
                编辑
              </Button>
            </Tooltip>
          )}
          
          {checkPermission(record, 'delete') && (
            <Popconfirm
              title="确定要删除这个组合商品吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                size="small"
                danger
                icon={<DeleteOutlined />}
                style={{ borderRadius: '2px' }}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  // 子商品表格列
  const itemColumns = [
    {
      title: 'SKU',
      dataIndex: 'skuId',
      key: 'skuId',
      width: 120
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price) => `¥${price}`
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity, record, index) => (
        modalType === 'view' ? quantity : (
          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => handleItemQuantityChange(index, value)}
            style={{ width: 60 }}
          />
        )
      )
    },
    {
      title: '小计',
      key: 'subtotal',
      width: 80,
      render: (_, record) => `¥${(record.price * record.quantity).toFixed(2)}`
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record, index) => (
        modalType !== 'view' && (
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleRemoveItem(index)}
          >
            移除
          </Button>
        )
      )
    }
  ];

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  const handleCreate = () => {
    setModalType('create');
    setCurrentRecord(null);
    setComboItems([]);
    setTransferKeys([]);
    comboForm.resetFields();
    // 设置默认值
    comboForm.setFieldsValue({
      unit: '组',
      status: 'draft'
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    setComboItems(record.items || []);
    setTransferKeys(record.items?.map(item => item.skuId) || []);
    comboForm.setFieldsValue({
      spuId: record.spuId,
      skuCode: record.skuCode,
      name: record.name,
      category: record.category,
      specifications: record.specifications,
      unit: record.unit,
      price: record.price,
      originalPrice: record.originalPrice,
      status: record.status
    });
    setModalVisible(true);
  };

  const handleView = (record) => {
    setModalType('view');
    setCurrentRecord(record);
    setComboItems(record.items || []);
    comboForm.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record) => {
    const newDataSource = dataSource.filter(item => item.id !== record.id);
    setDataSource(newDataSource);
    message.success('删除成功');
  };



  const handleModalOk = () => {
    comboForm.validateFields().then(values => {
      if (comboItems.length === 0) {
        message.error('请至少选择一个子商品');
        return;
      }

      // 计算原价总计
      const originalPrice = comboItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // 获取分类名称
      const categoryName = categoryOptions.find(cat => cat.value === values.category)?.label || '';

      const formData = {
        ...values,
        categoryName,
        originalPrice: originalPrice.toFixed(2),
        items: comboItems
      };

      if (modalType === 'create') {
        // 创建新记录
        const newRecord = {
          id: `COMBO${(dataSource.length + 1).toString().padStart(3, '0')}`,
          ...formData,
          stock: 0,
          salesCount: 0,
          createTime: new Date().toLocaleString('zh-CN')
        };
        setDataSource([...dataSource, newRecord]);
      } else {
        // 编辑现有记录
        const newDataSource = dataSource.map(item => {
          if (item.id === currentRecord.id) {
            return {
              ...item,
              ...formData
            };
          }
          return item;
        });
        setDataSource(newDataSource);
      }

      console.log('组合商品数据:', formData);
      setModalVisible(false);
      message.success(`${modalType === 'create' ? '创建' : '编辑'}成功`);
    });
  };

  const handleTransferChange = (keys, direction, moveKeys) => {
    setTransferKeys(keys);
    
    if (direction === 'right') {
      // 添加商品到组合
      const newItems = moveKeys.map(key => {
        const product = availableProducts.find(p => p.key === key);
        return {
          skuId: key,
          name: product.title.split(' - ')[0],
          price: product.price,
          quantity: 1
        };
      });
      setComboItems([...comboItems, ...newItems]);
    } else {
      // 从组合中移除商品
      setComboItems(comboItems.filter(item => !moveKeys.includes(item.skuId)));
    }
  };

  const handleItemQuantityChange = (index, quantity) => {
    const newItems = [...comboItems];
    newItems[index].quantity = quantity;
    setComboItems(newItems);
    
    // 更新表单中的总价
    updateTotalPrice(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = comboItems.filter((_, i) => i !== index);
    setComboItems(newItems);
    setTransferKeys(transferKeys.filter(key => key !== comboItems[index].skuId));
    updateTotalPrice(newItems);
  };

  const updateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    comboForm.setFieldsValue({ originalPrice: total.toFixed(2) });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      {/* 筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={searchForm} onFinish={handleSearch}>
          {/* 第一行：筛选条件 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="组合商品名称/ID" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="category" label="商品分类">
                <Select placeholder="请选择分类" style={{ width: '100%' }} allowClear>
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                  <Option value="draft">草稿</Option>
                  <Option value="active">生效</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="unit" label="单位">
                <Select placeholder="请选择单位" style={{ width: '100%' }} allowClear>
                  <Option value="组">组</Option>
                  <Option value="套">套</Option>
                  <Option value="份">份</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ borderRadius: '2px' }}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => searchForm.resetFields()} style={{ borderRadius: '2px' }}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
          
          {/* 第二行：功能按钮 */}
          <Row gutter={16}>
            <Col span={24}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ borderRadius: '2px' }}>
                  新建组合商品
                </Button>
                <Button disabled={selectedRowKeys.length === 0} style={{ borderRadius: '2px' }}>
                  批量操作
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 组合商品列表 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
        }}
      />

      {/* 新建/编辑组合商品弹窗 */}
      <Modal
        title={
          modalType === 'create' ? '新建组合商品' : 
          modalType === 'edit' ? '编辑组合商品' : '查看组合商品'
        }
        open={modalVisible}
        onOk={modalType !== 'view' ? handleModalOk : undefined}
        onCancel={() => setModalVisible(false)}
        width={1000}
        footer={modalType === 'view' ? [
          <Button key="close" onClick={() => setModalVisible(false)} style={{ borderRadius: '2px' }}>
            关闭
          </Button>
        ] : undefined}
        destroyOnClose
      >
        <Form
          form={comboForm}
          layout="vertical"
          disabled={modalType === 'view'}
        >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="spuId"
                  label="SPU ID"
                >
                  <Input placeholder="请输入SPU ID（非必填）" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="skuCode"
                  label="SKU编码"
                  rules={[{ required: true, message: '请输入SKU编码' }]}
                >
                  <Input placeholder="请输入SKU编码" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="组合商品名称"
                  rules={[{ required: true, message: '请输入组合商品名称' }]}
                >
                  <Input placeholder="请输入组合商品名称" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="category"
                  label="商品分类"
                  rules={[{ required: true, message: '请选择商品分类' }]}
                >
                  <Select placeholder="请选择商品分类">
                    {categoryOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="unit"
                  label="单位"
                  rules={[{ required: true, message: '请输入单位' }]}
                  initialValue="组"
                >
                  <Input placeholder="单位" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="draft">草稿</Option>
                    <Option value="active">生效</Option>
                    <Option value="inactive">停用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item 
              name="specifications" 
              label="描述规格"
              rules={[{ required: true, message: '请输入描述规格' }]}
            >
              <TextArea rows={3} placeholder="请输入组合商品的描述规格" />
            </Form.Item>

          <Divider>选择商品</Divider>

          {modalType !== 'view' ? (
            <Transfer
              dataSource={availableProducts}
              titles={['可选商品', '已选商品']}
              targetKeys={transferKeys}
              onChange={handleTransferChange}
              render={item => item.title}
              listStyle={{
                width: 300,
                height: 300,
              }}
              showSearch
              filterOption={(inputValue, option) =>
                option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
              }
            />
          ) : null}

          {comboItems.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>组合商品明细</h4>
              <Table
                columns={itemColumns}
                dataSource={comboItems}
                rowKey="skuId"
                pagination={false}
                size="small"
                summary={(pageData) => {
                  const total = pageData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        合计：
                      </Table.Summary.Cell>
                      <Table.Summary.Cell style={{ fontWeight: 'bold' }}>
                        ¥{total.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell />
                    </Table.Summary.Row>
                  );
                }}
              />
            </div>
          )}

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Form.Item name="originalPrice" label="原价总计（元）">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  min={0}
                  precision={2}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="组合优惠价（元）"
                rules={[{ required: true, message: '请输入组合优惠价' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="优惠金额（元）">
                <div style={{ 
                  padding: '4px 11px', 
                  backgroundColor: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '6px',
                  color: '#52c41a',
                  fontWeight: 500
                }}>
                  ¥{((comboForm.getFieldValue('originalPrice') || 0) - (comboForm.getFieldValue('price') || 0)).toFixed(2)}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ComboProduct; 