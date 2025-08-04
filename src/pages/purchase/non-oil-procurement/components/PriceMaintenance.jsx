import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  DatePicker,
  InputNumber,
  Tag,
  Card,
  Tabs,
  Switch,
  Descriptions,
  Divider,
  List,
  Typography,
  Radio
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  HistoryOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Text } = Typography;

const PriceMaintenance = () => {
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  // 模拟数据
  const mockPriceData = [
    {
      id: 'PM001',
      skuCode: 'SKU001',
      skuName: '可口可乐 330ml',
      unit: '瓶',
      category: '饮料',
      mainSupplier: '可口可乐公司',
      mainSupplierPrice: 2.85,
      supplierCount: 3,
      effectiveDate: '2024-03-01',
      expiryDate: '2024-12-31',
      status: '生效中',
      updateTime: '2024-03-15 09:30:00',
      updatedBy: '张三',
      suppliers: [
        {
          id: 'SUP001',
          name: '可口可乐公司',
          price: 2.85,
          taxPrice: 3.22,
          moq: 100,
          deliveryDays: 3,
          validUntil: '2024-12-31',
          isMain: true
        },
        {
          id: 'SUP002',
          name: '华润万家',
          price: 2.90,
          taxPrice: 3.28,
          moq: 50,
          deliveryDays: 2,
          validUntil: '2024-12-31',
          isMain: false
        }
      ]
    },
    {
      id: 'PM002',
      skuCode: 'SKU002',
      skuName: '红牛 250ml',
      unit: '瓶',
      category: '饮料',
      mainSupplier: '红牛公司',
      mainSupplierPrice: 4.50,
      supplierCount: 2,
      effectiveDate: '2024-03-01',
      expiryDate: '2024-12-31',
      status: '生效中',
      updateTime: '2024-03-15 10:15:00',
      updatedBy: '李四',
      suppliers: [
        {
          id: 'SUP003',
          name: '红牛公司',
          price: 4.50,
          taxPrice: 5.09,
          moq: 50,
          deliveryDays: 5,
          validUntil: '2024-12-31',
          isMain: true
        }
      ]
    }
  ];

  // 价格变更历史模拟数据
  const mockHistoryData = [
    {
      id: 'PH001',
      changeDate: '2024-03-15',
      changeType: '价格调整',
      supplierName: '可口可乐公司',
      oldPrice: 2.80,
      newPrice: 2.85,
      changeReason: '成本上涨',
      operator: '张三',
      remarks: '原材料价格上涨导致成本增加'
    },
    {
      id: 'PH002',
      changeDate: '2024-03-10',
      changeType: '新增供应商',
      supplierName: '华润万家',
      oldPrice: 0,
      newPrice: 2.90,
      changeReason: '供应商开发',
      operator: '王五',
      remarks: '新增备用供应商'
    },
    {
      id: 'PH003',
      changeDate: '2024-03-05',
      changeType: '主供应商变更',
      supplierName: '可口可乐公司',
      oldPrice: 2.80,
      newPrice: 2.80,
      changeReason: '供应商策略调整',
      operator: '张三',
      remarks: '设为主供应商'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setPriceData(mockPriceData);
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: 'SKU编码',
      dataIndex: 'skuCode',
      key: 'skuCode',
      width: 120,
      fixed: 'left'
    },
    {
      title: 'SKU名称',
      dataIndex: 'skuName',
      key: 'skuName',
      width: 200,
      fixed: 'left'
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      align: 'center'
    },
    {
      title: '商品类别',
      dataIndex: 'category',
      key: 'category',
      width: 100
    },
    {
      title: '主供应商',
      dataIndex: 'mainSupplier',
      key: 'mainSupplier',
      width: 150,
      render: (text) => (
        <span>
          <StarFilled style={{ color: '#faad14', marginRight: 4 }} />
          {text}
        </span>
      )
    },
    {
      title: '主供应商价格',
      dataIndex: 'mainSupplierPrice',
      key: 'mainSupplierPrice',
      width: 120,
      align: 'right',
      render: (text) => `¥${text.toFixed(2)}`
    },
    {
      title: '供应商数量',
      dataIndex: 'supplierCount',
      key: 'supplierCount',
      width: 100,
      align: 'center',
      render: (text) => (
        <Tag color="blue">{text}家</Tag>
      )
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120
    },
    {
      title: '失效日期',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === '生效中' ? 'green' : text === '已过期' ? 'red' : 'orange'}>
          {text}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160
    },
    {
      title: '更新人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" className="table-actions">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record)}
          >
            历史
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  const historyColumns = [
    {
      title: '变更日期',
      dataIndex: 'changeDate',
      key: 'changeDate',
      width: 120
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
      render: (text) => (
        <Tag color={
          text === '价格调整' ? 'blue' :
          text === '新增供应商' ? 'green' :
          text === '主供应商变更' ? 'orange' : 'default'
        }>
          {text}
        </Tag>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150
    },
    {
      title: '原价格',
      dataIndex: 'oldPrice',
      key: 'oldPrice',
      width: 100,
      align: 'right',
      render: (text) => text > 0 ? `¥${text.toFixed(2)}` : '-'
    },
    {
      title: '新价格',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 100,
      align: 'right',
      render: (text) => `¥${text.toFixed(2)}`
    },
    {
      title: '变更原因',
      dataIndex: 'changeReason',
      key: 'changeReason',
      width: 120
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true
    }
  ];

  const handleSearch = () => {
    const values = filterForm.getFieldsValue();
    console.log('搜索条件:', values);
    // 这里实现搜索逻辑
    fetchData();
  };

  const handleReset = () => {
    filterForm.resetFields();
    fetchData();
  };

  const handleAdd = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      effectiveDate: moment(),
      expiryDate: moment().add(1, 'year'),
      suppliers: [
        {
          price: 0,
          taxPrice: 0,
          moq: 0,
          deliveryDays: 0,
          isMain: true
        }
      ]
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      skuCode: record.skuCode,
      skuName: record.skuName,
      unit: record.unit,
      category: record.category,
      effectiveDate: moment(record.effectiveDate),
      expiryDate: moment(record.expiryDate),
      suppliers: record.suppliers.map(supplier => ({
        ...supplier,
        validUntil: moment(supplier.validUntil)
      }))
    });
    setModalVisible(true);
  };

  const handleView = (record) => {
    setCurrentRecord(record);
    // 这里可以打开查看详情的模态框
    message.info('查看详情功能');
  };

  const handleViewHistory = (record) => {
    setCurrentRecord(record);
    setHistoryData(mockHistoryData);
    setHistoryModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const submitData = {
          ...values,
          effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
          expiryDate: values.expiryDate.format('YYYY-MM-DD'),
          suppliers: values.suppliers.map(supplier => ({
            ...supplier,
            validUntil: supplier.validUntil.format('YYYY-MM-DD')
          }))
        };
        console.log('提交数据:', submitData);
        message.success('保存成功');
        setModalVisible(false);
        fetchData();
      })
      .catch(info => {
        console.log('验证失败:', info);
      });
  };

  const handleSupplierChange = (index, changes) => {
    const suppliers = form.getFieldValue('suppliers');
    const newSuppliers = [...suppliers];
    newSuppliers[index] = { ...newSuppliers[index], ...changes };
    
    // 计算含税价格
    if (changes.price !== undefined) {
      newSuppliers[index].taxPrice = (changes.price * 1.13).toFixed(2);
    }
    
    form.setFieldsValue({ suppliers: newSuppliers });
  };

  const handleSetMainSupplier = (index) => {
    const suppliers = form.getFieldValue('suppliers');
    const newSuppliers = suppliers.map((supplier, i) => ({
      ...supplier,
      isMain: i === index
    }));
    form.setFieldsValue({ suppliers: newSuppliers });
  };

  return (
    <div className="procurement-container">
      {/* 筛选表单 */}
      <Form 
        form={filterForm}
        layout="inline"
        className="filter-form"
        onFinish={handleSearch}
      >
        <Row gutter={16} style={{ width: '100%' }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="keyword" label="关键字">
              <Input placeholder="SKU编码/名称" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="category" label="商品类别">
              <Select placeholder="请选择类别" allowClear>
                <Option value="饮料">饮料</Option>
                <Option value="食品">食品</Option>
                <Option value="日用品">日用品</Option>
                <Option value="汽车用品">汽车用品</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="supplier" label="供应商">
              <Select placeholder="请选择供应商" allowClear>
                <Option value="可口可乐公司">可口可乐公司</Option>
                <Option value="华润万家">华润万家</Option>
                <Option value="红牛公司">红牛公司</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" allowClear>
                <Option value="生效中">生效中</Option>
                <Option value="已过期">已过期</Option>
                <Option value="未生效">未生效</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新建价格
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* 数据表格 */}
      <Table 
        columns={columns}
        dataSource={priceData}
        loading={loading}
        rowKey="id"
        className="procurement-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        scroll={{ x: 1500 }}
      />

      {/* 编辑/新建价格模态框 */}
      <Modal
        title={currentRecord ? "编辑价格" : "新建价格"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={900}
        className="procurement-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues, allValues) => {
            console.log('表单值变化:', changedValues);
          }}
        >
          <Row gutter={16}>
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
                name="skuName"
                label="SKU名称"
                rules={[{ required: true, message: '请输入SKU名称' }]}
              >
                <Input placeholder="请输入SKU名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请选择单位' }]}
              >
                <Select placeholder="请选择单位">
                  <Option value="个">个</Option>
                  <Option value="瓶">瓶</Option>
                  <Option value="盒">盒</Option>
                  <Option value="包">包</Option>
                  <Option value="袋">袋</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="商品类别"
                rules={[{ required: true, message: '请选择商品类别' }]}
              >
                <Select placeholder="请选择商品类别">
                  <Option value="饮料">饮料</Option>
                  <Option value="食品">食品</Option>
                  <Option value="日用品">日用品</Option>
                  <Option value="汽车用品">汽车用品</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="effectiveDate"
                label="生效日期"
                rules={[{ required: true, message: '请选择生效日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="expiryDate"
                label="失效日期"
                rules={[{ required: true, message: '请选择失效日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">供应商价格信息</Divider>
          
          <Form.List name="suppliers">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card 
                    key={field.key} 
                    size="small" 
                    style={{ marginBottom: 16 }}
                    title={`供应商 ${index + 1}`}
                    extra={
                      <Space>
                        <Button
                          type="link"
                          size="small"
                          icon={<StarFilled />}
                          onClick={() => handleSetMainSupplier(index)}
                          style={{ 
                            color: form.getFieldValue(['suppliers', index, 'isMain']) ? '#faad14' : '#d9d9d9' 
                          }}
                        >
                          主供应商
                        </Button>
                        {fields.length > 1 && (
                          <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          >
                            删除
                          </Button>
                        )}
                      </Space>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          label="供应商名称"
                          rules={[{ required: true, message: '请选择供应商' }]}
                        >
                          <Select placeholder="请选择供应商">
                            <Option value="可口可乐公司">可口可乐公司</Option>
                            <Option value="华润万家">华润万家</Option>
                            <Option value="红牛公司">红牛公司</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'price']}
                          label="采购价格(不含税)"
                          rules={[{ required: true, message: '请输入采购价格' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            placeholder="请输入价格"
                            onChange={(value) => handleSupplierChange(index, { price: value })}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'taxPrice']}
                          label="采购价格(含税)"
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            placeholder="自动计算"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'moq']}
                          label="最小起订量"
                          rules={[{ required: true, message: '请输入最小起订量' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="请输入数量"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'deliveryDays']}
                          label="供货周期(天)"
                          rules={[{ required: true, message: '请输入供货周期' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="请输入天数"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'validUntil']}
                          label="报价有效期"
                          rules={[{ required: true, message: '请选择报价有效期' }]}
                        >
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add({ 
                      price: 0, 
                      taxPrice: 0, 
                      moq: 0, 
                      deliveryDays: 0, 
                      isMain: false,
                      validUntil: moment().add(1, 'year')
                    })} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    添加供应商
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* 价格变更历史模态框 */}
      <Modal
        title={`价格变更历史 - ${currentRecord?.skuName}`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        <Table
          columns={historyColumns}
          dataSource={historyData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          scroll={{ x: 800 }}
        />
      </Modal>
    </div>
  );
};

export default PriceMaintenance; 