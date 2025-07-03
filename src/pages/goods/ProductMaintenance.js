import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Upload,
  message,
  Row,
  Col,
  Descriptions,
  InputNumber,
  TreeSelect,
  Radio,
  Tooltip,
  Spin,
  Switch,
  Checkbox,
  DatePicker
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  StopOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

// 导入mock数据
import productData from '../../mock/goods/productMaintenance.json';
import './ProductMaintenance.css';

const { Option } = Select;
const { TextArea } = Input;

const ProductMaintenance = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    // 从mock数据初始化
    setDataSource(productData.products);
  }, []);

  // 商品分类树形数据
  const categoryTreeData = [
    {
      value: '饮品',
      title: '饮品',
      children: [
        {
          value: '饮品/瓶装水',
          title: '瓶装水',
          children: [
            { value: '饮品/瓶装水/天然水', title: '天然水' },
            { value: '饮品/瓶装水/纯净水', title: '纯净水' },
            { value: '饮品/瓶装水/矿物质水', title: '矿物质水' }
          ]
        },
        {
          value: '饮品/碳酸饮料',
          title: '碳酸饮料',
          children: [
            { value: '饮品/碳酸饮料/可乐', title: '可乐' },
            { value: '饮品/碳酸饮料/气泡水', title: '气泡水' }
          ]
        }
      ]
    },
    {
      value: '食品零食',
      title: '食品零食',
      children: [
        {
          value: '食品零食/方便速食',
          title: '方便速食',
          children: [
            { value: '食品零食/方便速食/方便面', title: '方便面' },
            { value: '食品零食/方便速食/自热食品', title: '自热食品' }
          ]
        },
        {
          value: '食品零食/休闲零食',
          title: '休闲零食',
          children: [
            { value: '食品零食/休闲零食/薯片', title: '薯片' },
            { value: '食品零食/休闲零食/坚果', title: '坚果' }
          ]
        }
      ]
    },
    {
      value: '日用品',
      title: '日用品',
      children: [
        {
          value: '日用品/生活用品',
          title: '生活用品',
          children: [
            { value: '日用品/生活用品/清洁用品', title: '清洁用品' },
            { value: '日用品/生活用品/个人护理', title: '个人护理' }
          ]
        }
      ]
    }
  ];

  // 单位选项
  const unitOptions = [
    { value: 'piece', label: '个' },
    { value: 'bottle', label: '瓶' },
    { value: 'box', label: '盒' },
    { value: 'bag', label: '袋' },
    { value: 'can', label: '罐' },
    { value: 'pack', label: '包' },
    { value: 'case', label: '箱' },
    { value: 'strip', label: '条' },
    { value: 'kg', label: '千克' },
    { value: 'g', label: '克' },
    { value: 'liter', label: '升' },
    { value: 'ml', label: '毫升' }
  ];

  // 重量单位选项
  const weightUnitOptions = [
    { value: 'kg', label: '千克' },
    { value: 'g', label: '克' },
    { value: 'ton', label: '吨' }
  ];

  // 体积单位选项
  const volumeUnitOptions = [
    { value: 'cbm', label: '立方米' },
    { value: 'liter', label: '升' },
    { value: 'ml', label: '毫升' }
  ];

  // 判断商品是否可以编辑
  const isEditable = (status) => {
    return status === 'DRAFT' || status === 'INACTIVE';
  };

  const columns = [
    {
      title: 'SKU编码',
      dataIndex: 'sku_code',
      key: 'sku_code',
      width: 120,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.id}</div>
        </div>
      )
    },
    {
      title: 'SKU名称',
      dataIndex: 'sku_name',
      key: 'sku_name',
      ellipsis: true,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            规格：{record.specifications} | 条码：{record.barcode}
          </div>
          <div style={{ fontSize: '12px', color: '#1890ff' }}>
            销售单价：¥{record.default_sale_price || 0}
          </div>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      ellipsis: true,
      render: (text) => text && <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: '单位信息',
      key: 'unitInfo',
      width: 150,
      render: (_, record) => {
        const baseUnit = unitOptions.find(u => u.value === record.base_unit_id)?.label || record.base_unit_id;
        const auxUnit = record.aux_unit_id ? unitOptions.find(u => u.value === record.aux_unit_id)?.label || record.aux_unit_id : null;
        return (
          <div>
            <div style={{ fontWeight: 500 }}>基本单位：{baseUnit}</div>
            {auxUnit && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                辅助单位：{auxUnit}
                {record.conversion_rate && ` (1:${record.conversion_rate})`}
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: '税率信息',
      key: 'taxInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            进项：{record.current_input_tax_rate || 0}%
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            销项：{record.current_output_tax_rate || 0}%
          </div>
        </div>
      )
    },
    {
      title: '库存设置',
      key: 'stockInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            最低库存限制：{record.min_stock || 0}
          </div>
          {record.shelf_life && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              保质期：{record.shelf_life}天
            </div>
          )}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          DRAFT: { color: 'default', text: '草稿' },
          PENDING: { color: 'warning', text: '待审核' },
          ACTIVE: { color: 'success', text: '生效' },
          INACTIVE: { color: 'error', text: '停用' }
        };
        const config = statusConfig[status] || statusConfig.DRAFT;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '创建信息',
      key: 'createInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>{record.created_at}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            创建人：{record.created_by}
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        const editable = isEditable(record.status);
        
        return (
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
            
            {editable ? (
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
              <Tooltip title="只有草稿和停用状态的商品可以编辑">
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

            {record.status === 'PENDING' && (
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                style={{ borderRadius: '2px' }}
                onClick={() => handleApprove(record)}
              >
                审核
              </Button>
            )}

            {record.status === 'DRAFT' && (
              <Button
                type="primary"
                size="small"
                icon={<SendOutlined />}
                style={{ borderRadius: '2px' }}
                onClick={() => handleSubmitApproval(record)}
              >
                提交审核
              </Button>
            )}

            {record.status === 'ACTIVE' && (
              <Button
                type="primary"
                size="small"
                danger
                icon={<StopOutlined />}
                style={{ borderRadius: '2px' }}
                onClick={() => handleDeactivate(record)}
              >
                停用
              </Button>
            )}

            {record.status === 'INACTIVE' && (
              <Button
                type="primary"
                size="small"
                icon={<PlayCircleOutlined />}
                style={{ borderRadius: '2px' }}
                onClick={() => handleActivate(record)}
              >
                激活
              </Button>
            )}

            {(record.status === 'DRAFT' || record.status === 'INACTIVE') && (
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
            )}
          </Space>
        );
      }
    }
  ];

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实际项目中这里会调用API
  };

  const handleCreate = () => {
    setModalType('create');
    setCurrentRecord(null);
    productForm.resetFields();
    // 设置默认值
    productForm.setFieldsValue({
      status: 'DRAFT',
      current_input_tax_rate: 13,
      current_output_tax_rate: 13,
      min_stock: 0,
      base_unit_id: 'piece',
      logistics_type: 'weight'
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    productForm.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record) => {
    setModalType('view');
    setCurrentRecord(record);
    productForm.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除SKU "${record.sku_name}" 吗？`,
      onOk() {
        message.success('删除成功');
        // 实际项目中这里会调用删除API
      }
    });
  };

  const handleApprove = (record) => {
    Modal.confirm({
      title: '审核商品',
      icon: <CheckOutlined />,
      content: `确认审核通过SKU "${record.sku_name}" 吗？`,
      onOk() {
        message.success('审核通过');
        // 实际项目中这里会调用审核API
      }
    });
  };

  const handleSubmitApproval = (record) => {
    Modal.confirm({
      title: '提交审核',
      icon: <SendOutlined />,
      content: `确认提交SKU "${record.sku_name}" 进行审核吗？`,
      onOk() {
        message.success('已提交审核');
        // 实际项目中这里会调用API
      }
    });
  };

  const handleDeactivate = (record) => {
    Modal.confirm({
      title: '停用商品',
      icon: <StopOutlined />,
      content: `确认停用SKU "${record.sku_name}" 吗？`,
      onOk() {
        message.success('商品已停用');
        // 实际项目中这里会调用API
      }
    });
  };

  const handleActivate = (record) => {
    Modal.confirm({
      title: '激活商品',
      icon: <PlayCircleOutlined />,
      content: `确认激活SKU "${record.sku_name}" 吗？`,
      onOk() {
        message.success('商品已激活');
        // 实际项目中这里会调用API
      }
    });
  };

  const handleModalOk = () => {
    productForm.validateFields().then(values => {
      console.log('表单数据:', values);
      setModalVisible(false);
      message.success(`${modalType === 'create' ? '创建' : '编辑'}成功`);
      // 实际项目中这里会调用API
    });
  };

  const handleBatchImport = () => {
    // 创建文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        message.success(`正在导入文件: ${file.name}`);
        // 实际项目中这里会调用导入API
      }
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    // 实际项目中这里会下载模板文件
    const link = document.createElement('a');
    link.href = '/templates/sku_import_template.xlsx';
    link.download = 'SKU商品导入模板.xlsx';
    link.click();
    message.success('模板下载完成');
  };

  const handleBatchSubmitApproval = () => {
    const draftItems = dataSource.filter(item => 
      selectedRowKeys.includes(item.id) && item.status === 'DRAFT'
    );
    
    if (draftItems.length === 0) {
      message.warning('只能提交状态为草稿的商品');
      return;
    }

    Modal.confirm({
      title: '批量提交审核',
      icon: <SendOutlined />,
      content: `确认提交 ${draftItems.length} 个草稿状态的商品进行审核吗？`,
      onOk() {
        message.success(`已批量提交 ${draftItems.length} 个商品进行审核`);
        setSelectedRowKeys([]);
        // 实际项目中这里会调用批量提交审核API
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="product-maintenance-container">
      <Card>
        <Spin spinning={loading}>
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form
              form={searchForm}
              layout="inline"
              onFinish={handleSearch}
            >
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="SKU名称/编码/条码" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="category" label="商品分类">
                <TreeSelect
                  style={{ width: 200 }}
                  placeholder="请选择分类"
                  treeData={categoryTreeData}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                  <Option value="DRAFT">草稿</Option>
                  <Option value="PENDING">待审核</Option>
                  <Option value="ACTIVE">生效</Option>
                  <Option value="INACTIVE">停用</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ borderRadius: '2px' }}>
                    查询
                  </Button>
                  <Button onClick={() => searchForm.resetFields()} style={{ borderRadius: '2px' }}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          {/* 操作工具栏 */}
          <Card style={{ marginBottom: 16 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ borderRadius: '2px' }}>
                    新建SKU
                  </Button>
                  <Button 
                    type="default" 
                    icon={<UploadOutlined />} 
                    onClick={handleBatchImport}
                    style={{ borderRadius: '2px' }}
                  >
                    批量导入
                  </Button>
                  <Button 
                    type="default" 
                    onClick={handleDownloadTemplate}
                    style={{ borderRadius: '2px' }}
                  >
                    下载模板
                  </Button>
                  <Button 
                    type="primary"
                    ghost
                    icon={<SendOutlined />}
                    disabled={selectedRowKeys.length === 0}
                    onClick={handleBatchSubmitApproval}
                    style={{ borderRadius: '2px' }}
                  >
                    批量提交审核
                  </Button>
                </Space>
              </Col>
              <Col>
                <Space>
                  <span style={{ color: '#666' }}>
                    已选择 {selectedRowKeys.length} 项
                  </span>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 商品列表 */}
          <Card>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              scroll={{ x: 1500 }}
              pagination={{
                total: dataSource.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
            />
          </Card>
        </Spin>
      </Card>

      {/* 新建/编辑商品弹窗 */}
      <Modal
        title={
          modalType === 'create' ? '新建SKU' : 
          modalType === 'edit' ? '编辑SKU' : '查看SKU'
        }
        open={modalVisible}
        onOk={modalType !== 'view' ? handleModalOk : undefined}
        onCancel={() => setModalVisible(false)}
        width={1200}
        footer={modalType === 'view' ? [
          <Button key="close" onClick={() => setModalVisible(false)} style={{ borderRadius: '2px' }}>
            关闭
          </Button>
        ] : undefined}
        destroyOnClose
      >
        <Form
          form={productForm}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          {/* 基本信息 */}
          <Card 
            title="基本信息" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="product_id"
                  label="关联SPU ID"
                >
                  <Input placeholder="请输入关联的SPU ID" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sku_code"
                  label="SKU编码"
                  rules={[{ required: true, message: '请输入SKU编码' }]}
                >
                  <Input placeholder="请输入SKU编码" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="sku_name"
              label="SKU名称"
              rules={[{ required: true, message: '请输入SKU名称' }]}
            >
              <Input placeholder="请输入SKU名称" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="barcode"
                  label="条形码"
                >
                  <Input placeholder="请输入条形码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="商品分类"
                  rules={[{ required: true, message: '请选择商品分类' }]}
                >
                  <TreeSelect
                    placeholder="请选择商品分类"
                    treeData={categoryTreeData}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="specifications"
                  label="规格描述"
                >
                  <Input placeholder="如：颜色:原色钛金属; 容量:256GB" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="default_sale_price"
                  label="默认销售单价（元）"
                  rules={[{ required: true, message: '请输入默认销售单价' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入默认销售单价"
                    min={0}
                    precision={2}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 单位体系 */}
          <Card 
            title="单位体系" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="base_unit_id"
                  label="基本/库存单位"
                  rules={[{ required: true, message: '请选择基本单位' }]}
                >
                  <Select placeholder="请选择基本单位">
                    {unitOptions.map(unit => (
                      <Option key={unit.value} value={unit.value}>{unit.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="aux_unit_id"
                  label="辅助单位"
                >
                  <Select placeholder="请选择辅助单位" allowClear>
                    {unitOptions.map(unit => (
                      <Option key={unit.value} value={unit.value}>{unit.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="conversion_rate"
              label="固定单位换算比率"
              help="仅用于固定转换，如 1箱 = 24个"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入换算比率"
                min={0}
                precision={3}
              />
            </Form.Item>
          </Card>

          {/* 物流属性 */}
          <Card 
            title="物流属性" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Form.Item
              name="logistics_type"
              label="物流属性类型"
            >
              <Radio.Group>
                <Radio value="weight">重量</Radio>
                <Radio value="volume">体积</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const logisticsType = getFieldValue('logistics_type');
                
                if (logisticsType === 'weight') {
                  return (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="weight"
                          label="重量"
                          rules={[{ required: true, message: '请输入重量' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入重量"
                            min={0}
                            precision={3}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="weight_unit_id"
                          label="重量单位"
                          rules={[{ required: true, message: '请选择重量单位' }]}
                        >
                          <Select placeholder="请选择重量单位">
                            {weightUnitOptions.map(unit => (
                              <Option key={unit.value} value={unit.value}>{unit.label}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                
                if (logisticsType === 'volume') {
                  return (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="volume"
                          label="体积"
                          rules={[{ required: true, message: '请输入体积' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入体积"
                            min={0}
                            precision={3}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="volume_unit_id"
                          label="体积单位"
                          rules={[{ required: true, message: '请选择体积单位' }]}
                        >
                          <Select placeholder="请选择体积单位">
                            {volumeUnitOptions.map(unit => (
                              <Option key={unit.value} value={unit.value}>{unit.label}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                
                return null;
              }}
            </Form.Item>
          </Card>

          {/* 财务信息 */}
          <Card 
            title="财务信息" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="current_input_tax_rate"
                  label="当前进项税率（%）"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入进项税率"
                    min={0}
                    max={100}
                    precision={2}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="current_output_tax_rate"
                  label="当前销项税率（%）"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入销项税率"
                    min={0}
                    max={100}
                    precision={2}
                  />
                </Form.Item>
                </Col>
            </Row>
          </Card>

          {/* 库存管理 */}
          <Card 
            title="库存管理" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="min_stock"
                  label="最低库存限制"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入最低库存限制"
                    min={0}
                    precision={3}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="shelf_life"
                  label="保质期（天）"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入保质期天数"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="warning_days"
                  label="临期预警天数"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入临期预警天数"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 审批流状态 - 仅查看模式显示 */}
          {modalType === 'view' && currentRecord && (
            <Card 
              title="审批流信息" 
              size="small" 
              style={{ marginBottom: 16 }}
              headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
            >
              <Descriptions column={2} size="small">
                <Descriptions.Item label="当前状态">
                  <Tag color={
                    currentRecord.status === 'DRAFT' ? 'default' :
                    currentRecord.status === 'PENDING' ? 'orange' :
                    currentRecord.status === 'ACTIVE' ? 'green' : 'red'
                  }>
                    {currentRecord.status === 'DRAFT' ? '草稿' :
                     currentRecord.status === 'PENDING' ? '待审核' :
                     currentRecord.status === 'ACTIVE' ? '生效' : '停用'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建人">
                  {currentRecord.created_by || '系统'}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {currentRecord.created_at}
                </Descriptions.Item>
                <Descriptions.Item label="最后更新人">
                  {currentRecord.updated_by || '系统'}
                </Descriptions.Item>
                <Descriptions.Item label="最后更新时间">
                  {currentRecord.updated_at}
                </Descriptions.Item>
                {currentRecord.approved_by && (
                  <Descriptions.Item label="审核人">
                    {currentRecord.approved_by}
                  </Descriptions.Item>
                )}
                {currentRecord.approved_at && (
                  <Descriptions.Item label="审核时间">
                    {currentRecord.approved_at}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ProductMaintenance; 