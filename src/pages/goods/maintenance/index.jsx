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
  message,
  Row,
  Col,
  InputNumber,
  TreeSelect,
  Tooltip,
  Switch,
  Popconfirm,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';

// 导入mock数据
import productData from '../../../mock/goods/productMaintenance.json';
import ProductViewModal from '../shared/ProductViewModal';
import './index.css';

const { Option } = Select;

const ProductMaintenance = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [unitList, setUnitList] = useState([]); // 计量单位列表
  const [baseUnit, setBaseUnit] = useState(''); // 基本单位

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

  // 单位选项（保留作为参考）
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
          ACTIVE: { color: 'success', text: '生效' }
        };
        const config = statusConfig[status] || statusConfig.DRAFT;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '状态开关',
      key: 'statusSwitch',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.status === 'ACTIVE'}
          checkedChildren="开启"
          unCheckedChildren="关闭"
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      )
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
      width: 160,
      fixed: 'right',
      render: (_, record) => {
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
            
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              style={{ borderRadius: '2px' }}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>

            <Popconfirm
              title="确定要删除这个SKU吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                size="small"
                icon={<DeleteOutlined />}
                style={{ 
                  borderRadius: '2px',
                  backgroundColor: '#ff4d4f',
                  borderColor: '#ff4d4f'
                }}
              >
                删除
              </Button>
            </Popconfirm>
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
    setUnitList([]); // 清空计量单位列表
    setBaseUnit(''); // 清空基本单位
    // 设置默认值
    productForm.setFieldsValue({
      status: false, // 开关默认为关闭状态（DRAFT）
      current_input_tax_rate: 13,
      current_output_tax_rate: 13,
      min_stock: 0,
      base_unit: ''
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    
    // 将状态转换为开关值
    const formData = {
      ...record,
      status: record.status === 'ACTIVE' // 将状态转换为开关的checked值
    };
    
    productForm.setFieldsValue(formData);
    
    // 加载计量单位数据（模拟数据，实际项目中从 API 获取）
    if (record.base_unit_id) {
      const baseUnitName = unitOptions.find(u => u.value === record.base_unit_id)?.label || record.base_unit_id;
      setBaseUnit(baseUnitName);
      productForm.setFieldsValue({ base_unit: baseUnitName });
      
      const mockUnits = [
        {
          id: 'base_unit',
          unitName: baseUnitName,
          conversionFactor: 1,
          barcode: record.barcode || '', // 从记录中加载条码
          salePrice: record.default_sale_price || 0, // 从记录中加载销售价格
          isBase: true,
          isSalesDefault: true,
          isPurchaseDefault: false
        }
      ];
      
      // 如果有辅助单位，也加载
      if (record.aux_unit_id && record.conversion_rate) {
        const auxUnitName = unitOptions.find(u => u.value === record.aux_unit_id)?.label || record.aux_unit_id;
        mockUnits.push({
          id: 'aux_unit',
          unitName: auxUnitName,
          conversionFactor: record.conversion_rate,
          barcode: '', // 辅助单位的条码初始化为空
          salePrice: 0, // 辅助单位的销售价格初始化为0
          isBase: false,
          isSalesDefault: false,
          isPurchaseDefault: true
        });
      }
      
      setUnitList(mockUnits);
    } else {
      setUnitList([]);
      setBaseUnit('');
    }
    
    setModalVisible(true);
  };

  const handleView = (record) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setCurrentRecord(null);
  };

  const handleDelete = (record) => {
    message.success('删除成功');
    // 实际项目中这里会调用删除API
  };

  // 状态切换处理函数
  const handleStatusChange = (record, checked) => {
    const newStatus = checked ? 'ACTIVE' : 'DRAFT';
    const statusText = checked ? '开启' : '关闭';
    
    Modal.confirm({
      title: `确认${statusText}商品`,
      content: `确定要${statusText}商品“${record.sku_name}”吗？`,
      onOk() {
        // 实际项目中这里会调用API更新状态
        message.success(`商品状态已${statusText}`);
        
        // 更新本地数据（模拟）
        setDataSource(prev => prev.map(item => 
          item.id === record.id ? { ...item, status: newStatus } : item
        ));
      },
      okText: '确认',
      cancelText: '取消'
    });
  };

  // 计量单位管理相关函数
  const handleAddUnit = () => {
    const newUnit = {
      id: `unit_${Date.now()}`,
      unitName: '',
      conversionFactor: 1,
      barcode: '', // 新增商品条码字段
      salePrice: 0, // 新增销售价格字段
      isBase: false,
      isSalesDefault: false,
      isPurchaseDefault: false
    };
    setUnitList(prev => [...prev, newUnit]);
  };

  const handleUnitChange = (id, field, value) => {
    setUnitList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleUnitTypeChange = (id, type, checked) => {
    setUnitList(prev => {
      if (type === 'sales') {
        if (checked) {
          // 只能有一个默认销售单位
          return prev.map(unit => ({
            ...unit,
            isSalesDefault: unit.id === id
          }));
        } else {
          return prev.map(unit => {
            if (unit.id === id) {
              return { ...unit, isSalesDefault: false };
            }
            return unit;
          });
        }
      } else if (type === 'purchase') {
        if (checked) {
          // 只能有一个默认采购单位
          return prev.map(unit => ({
            ...unit,
            isPurchaseDefault: unit.id === id
          }));
        } else {
          return prev.map(unit => {
            if (unit.id === id) {
              return { ...unit, isPurchaseDefault: false };
            }
            return unit;
          });
        }
      }
      return prev;
    });
  };

  const handleDeleteUnit = (id) => {
    setUnitList(prev => prev.filter(item => item.id !== id));
  };

  const handleModalOk = () => {
    productForm.validateFields().then(values => {
      // 验证税收信息业务逻辑
      if (values.is_tax_free && values.tax_rate && values.tax_rate > 0) {
        message.error('已开启免税开关，税率必须为0');
        return;
      }
      
      if (!values.is_tax_free && values.tax_rate === undefined) {
        // 如果未开启免税，建议设置税率
        Modal.confirm({
          title: '提示',
          content: '未开启免税且未设置税率，是否继续？',
          onOk() {
            submitForm(values);
          }
        });
        return;
      }
      
      submitForm(values);
    });
  };

  const submitForm = (values) => {
    // 将开关状态转换为实际状态值
    const submitData = {
      ...values,
      status: values.status ? 'ACTIVE' : 'DRAFT'
    };
    
    console.log('表单数据:', submitData);
    setModalVisible(false);
    message.success(`${modalType === 'create' ? '创建' : '编辑'}成功`);
    // 实际项目中这里会调用API
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
                <Input placeholder="SKU名称/编码/条码" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="category" label="商品分类">
                <TreeSelect
                  style={{ width: '100%' }}
                  placeholder="请选择分类"
                  treeData={categoryTreeData}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                  <Option value="DRAFT">草稿</Option>
                  <Option value="ACTIVE">生效</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="unit" label="单位">
                <Select placeholder="请选择单位" style={{ width: '100%' }} allowClear>
                  {unitOptions.map(unit => (
                    <Option key={unit.value} value={unit.value}>{unit.label}</Option>
                  ))}
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
                  新建SKU
                </Button>
                <Button icon={<UploadOutlined />} onClick={handleBatchImport} style={{ borderRadius: '2px' }}>
                  批量导入
                </Button>
                <Button type="link" icon={<DownloadOutlined />} onClick={handleDownloadTemplate} style={{ borderRadius: '2px' }}>
                  下载模板
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 商品列表 */}
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

      {/* 新建/编辑商品弹窗 */}
      <Modal
        title={modalType === 'create' ? '新建SKU' : '编辑SKU'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={1200}
        destroyOnClose
      >
        <Form
          form={productForm}
          layout="vertical"
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
              <Col span={8}>
                <Form.Item
                  name="barcode"
                  label="条形码"
                >
                  <Input placeholder="请输入条形码" />
                </Form.Item>
              </Col>
              <Col span={8}>
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
              <Col span={8}>
                <Form.Item
                  name="specifications"
                  label="规格描述"
                >
                  <Input placeholder="如：颜色:原色钛金属; 容量:256GB" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
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
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="商品状态"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    onChange={(checked) => {
                      productForm.setFieldsValue({ 
                        status: checked ? 'ACTIVE' : 'DRAFT' 
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 计量单位管理 */}
          <Card 
            title="计量单位" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Form.Item
                  name="base_unit"
                  label="基本单位/库存单位"
                  rules={[{ required: true, message: '请输入基本单位' }]}
                  help="所有库存都以此为准，设定后不可更改"
                >
                  <Input 
                    placeholder="请输入基本单位，如：瓶、个、克" 
                    onChange={(e) => {
                      const value = e.target.value;
                      setBaseUnit(value);
                      if (value) {
                        // 自动创建基本单位记录
                        const baseUnitRecord = {
                          id: 'base_unit',
                          unitName: value,
                          conversionFactor: 1,
                          barcode: '', // 新增商品条码字段
                          salePrice: 0, // 新增销售价格字段
                          isBase: true,
                          isSalesDefault: true,
                          isPurchaseDefault: false
                        };
                        setUnitList(prev => {
                          const filtered = prev.filter(item => item.id !== 'base_unit');
                          return [baseUnitRecord, ...filtered];
                        });
                      } else {
                        setUnitList(prev => prev.filter(item => item.id !== 'base_unit'));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 单位列表 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 500 }}>单位列表</span>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<PlusOutlined />}
                  onClick={handleAddUnit}
                  disabled={!baseUnit}
                >
                  添加新单位
                </Button>
              </div>
              
              <Table
                size="small"
                dataSource={unitList}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: '单位名称',
                    dataIndex: 'unitName',
                    key: 'unitName',
                    width: 120,
                    render: (text, record) => (
                      record.isBase ? (
                        <span style={{ fontWeight: 500 }}>{text} (基本单位)</span>
                      ) : (
                        <Input 
                          size="small"
                          value={text}
                          placeholder="如：箱、打、件"
                          onChange={(e) => handleUnitChange(record.id, 'unitName', e.target.value)}
                        />
                      )
                    )
                  },
                  {
                    title: '换算关系',
                    key: 'conversion',
                    width: 200,
                    render: (_, record) => (
                      record.isBase ? (
                        <span>1 {record.unitName} = 1 基本单位</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>1 {record.unitName || '新单位'} = </span>
                          <InputNumber
                            size="small"
                            style={{ width: 80, margin: '0 4px' }}
                            value={record.conversionFactor}
                            min={0.001}
                            precision={3}
                            onChange={(value) => handleUnitChange(record.id, 'conversionFactor', value)}
                          />
                          <span>{baseUnit}</span>
                        </div>
                      )
                    )
                  },
                  {
                    title: '商品条码(Barcode)',
                    key: 'barcode',
                    width: 150,
                    render: (_, record) => (
                      record.isBase ? (
                        <span style={{ color: '#666', fontSize: '13px' }}>
                          {productForm.getFieldValue('barcode') || '未设置'}
                          <div style={{ fontSize: '11px', color: '#999' }}>来自基本信息</div>
                        </span>
                      ) : (
                        <Input 
                          size="small"
                          value={record.barcode || ''}
                          placeholder="请输入商品条码"
                          onChange={(e) => handleUnitChange(record.id, 'barcode', e.target.value)}
                        />
                      )
                    )
                  },
                  {
                    title: '销售价格(元)',
                    key: 'salePrice',
                    width: 120,
                    render: (_, record) => (
                      record.isBase ? (
                        <span style={{ color: '#666', fontSize: '13px' }}>
                          ¥{(productForm.getFieldValue('default_sale_price') || 0).toFixed(2)}
                          <div style={{ fontSize: '11px', color: '#999' }}>来自基本信息</div>
                        </span>
                      ) : (
                        <InputNumber
                          size="small"
                          style={{ width: '100%' }}
                          value={record.salePrice}
                          placeholder="0.00"
                          min={0}
                          precision={2}
                          onChange={(value) => handleUnitChange(record.id, 'salePrice', value)}
                        />
                      )
                    )
                  },
                  {
                    title: '单位类型',
                    key: 'type',
                    width: 200,
                    render: (_, record) => (
                      <div>
                        <Checkbox
                          checked={record.isSalesDefault}
                          disabled={record.isBase}
                          onChange={(e) => handleUnitTypeChange(record.id, 'sales', e.target.checked)}
                        >
                          默认销售单位
                        </Checkbox>
                        <br />
                        <Checkbox
                          checked={record.isPurchaseDefault}
                          onChange={(e) => handleUnitTypeChange(record.id, 'purchase', e.target.checked)}
                        >
                          默认采购单位
                        </Checkbox>
                      </div>
                    )
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 60,
                    render: (_, record) => (
                      !record.isBase && (
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteUnit(record.id)}
                        >
                        </Button>
                      )
                    )
                  }
                ]}
                locale={{ emptyText: '请先设置基本单位' }}
              />
            </div>
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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tax_classification"
                  label="税收分类"
                  rules={[
                    {
                      pattern: /^\d+$/,
                      message: '税收分类只能输入纯数字'
                    }
                  ]}
                >
                  <Input
                    placeholder="请输入税收分类编码（纯数字）"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="is_tax_free"
                  label="免税开关"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="免税"
                    unCheckedChildren="征税"
                    onChange={(checked) => {
                      if (checked) {
                        productForm.setFieldsValue({ tax_rate: 0 });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tax_rate"
                  label="税率（%）"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入税率"
                    min={0}
                    max={100}
                    precision={2}
                    disabled={productForm.getFieldValue('is_tax_free')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="erp_product_code"
                  label="ERP商品编码"
                >
                  <Input
                    placeholder="请输入ERP商品编码"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="erp_category_code"
                  label="ERP分类编码"
                >
                  <Input
                    placeholder="请输入ERP分类编码"
                    style={{ width: '100%' }}
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

        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <ProductViewModal
        visible={isViewModalVisible}
        data={currentRecord}
        onClose={handleViewModalClose}
      />
      
      {/* 页面备注信息 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f0f2f5',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666',
        borderLeft: '4px solid #1890ff'
      }}>
        <strong>功能说明：</strong>
        <br />1. 新增了商品税收信息管理功能，包括税收分类（纯数字）、税率设置、免税开关等
        <br />2. 免税开关开启时，税率自动设为0且不可编辑；关闭时可手动设置税率
        <br />3. 新增ERP商品编码和ERP分类编码字段，便于与外部ERP系统集成
        <br />4. <strong>新增一品多码管理：</strong>在计量单位管理中增加“商品条码”和“销售价格”列，基本单位自动显示基本信息中的数据，其他包装单位可独立设置
        <br />5. <strong>新增状态开关管理：</strong>去掉停用状态，采用开关形式管理商品状态，列表页可直接切换，修改时有确认弹窗
        <br />5. 表单验证：税收分类仅支持纯数字，税率范围0-100%，商品条码支持自定义输入
        <br />6. 演示时请重点展示计量单位的一品多码管理功能和税收信息的联动逻辑
      </div>
    </div>
  );
};

export default ProductMaintenance; 