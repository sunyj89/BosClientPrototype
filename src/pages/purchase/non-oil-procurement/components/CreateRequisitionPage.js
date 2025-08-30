import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Modal,
  Row,
  Col,
  Space,
  message,
  Popconfirm,
  InputNumber,
  Checkbox,
  Tag,
  Divider,
  TreeSelect
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  SaveOutlined,
  SendOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import purchaseRequisitionData from '../../../../mock/purchase/purchaseRequisition.json';
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;
const { TextArea } = Input;

const CreateRequisitionPage = ({ mode = 'create', requisitionData = null, onBack }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState([]);

  // 构建组织架构树数据
  const buildStationTreeData = () => {
    const { branches, serviceAreas, stations } = stationData;
    
    const tree = [{
      title: '江西交投化石能源公司',
      value: 'ROOT',
      key: 'ROOT',
      children: []
    }];
    
    branches.forEach(branch => {
      const branchNode = {
        title: branch.name,
        value: branch.id,
        key: branch.id,
        children: []
      };
      
      // 添加该分公司下的服务区
      const branchServiceAreas = serviceAreas.filter(sa => sa.branchId === branch.id);
      branchServiceAreas.forEach(serviceArea => {
        const serviceAreaNode = {
          title: serviceArea.name,
          value: serviceArea.id,
          key: serviceArea.id,
          children: []
        };
        
        // 添加该服务区下的加油站
        const serviceAreaStations = stations.filter(station => station.serviceAreaId === serviceArea.id);
        serviceAreaStations.forEach(station => {
          serviceAreaNode.children.push({
            title: station.name,
            value: station.id,
            key: station.id,
            isLeaf: true
          });
        });
        
        branchNode.children.push(serviceAreaNode);
      });
      
      tree[0].children.push(branchNode);
    });
    
    return tree;
  };

  // 模拟商品主数据（包含采购单位信息）
  const mockProducts = [
    {
      id: 'PRD001',
      name: '高效燃油宝',
      sku: 'SKU001001',
      specification: '300ml装',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 10, // 1箱=10瓶
      currentStock: 5,
      category: '汽车养护',
      supplier: '环保科技有限公司',
      estimatedPrice: 285.00 // 零售价格（每箱）
    },
    {
      id: 'PRD002',
      name: '品牌A尿素溶液',
      sku: 'SKU001002',
      specification: '10L装',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 4, // 1箱=4瓶
      currentStock: 12,
      category: '尿素',
      supplier: '环保科技有限公司',
      estimatedPrice: 114.00
    },
    {
      id: 'PRD003',
      name: '5W-30全合成机油',
      sku: 'SKU001003',
      specification: '4L装',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 6, // 1箱=6瓶
      currentStock: 8,
      category: '润滑油',
      supplier: '中石化润滑油公司',
      estimatedPrice: 2280.00
    },
    {
      id: 'PRD004',
      name: '农夫山泉矿泉水',
      sku: 'SKU001004',
      specification: '550ml×24瓶',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 24, // 1箱=24瓶
      currentStock: 48,
      category: '饮料',
      supplier: '农夫山泉股份有限公司',
      estimatedPrice: 48.00
    },
    {
      id: 'PRD005',
      name: '康师傅红烧牛肉面',
      sku: 'SKU001005',
      specification: '袋装',
      baseUnit: '包',
      procurementUnit: '箱',
      conversionRate: 12, // 1箱=12包
      currentStock: 25,
      category: '食品',
      supplier: '康师傅控股有限公司',
      estimatedPrice: 54.00
    },
    {
      id: 'PRD006',
      name: '防冻液',
      sku: 'SKU001006',
      specification: '4L装',
      baseUnit: '瓶',
      procurementUnit: '桶',
      conversionRate: 8, // 1桶=8瓶
      currentStock: 16,
      category: '汽车养护',
      supplier: '中石化润滑油公司',
      estimatedPrice: 364.00
    }
  ];

  useEffect(() => {
    // 初始化表单
    if (mode === 'edit' && requisitionData) {
      form.setFieldsValue({
        channelId: requisitionData.channelId,
        expectedDeliveryDate: dayjs(requisitionData.expectedDeliveryDate),
        priority: requisitionData.priority,
        remarks: requisitionData.remarks
      });
      // 设置已选商品
      if (requisitionData.products) {
        const formattedProducts = requisitionData.products.map(product => ({
          ...product,
          requestedQuantity: Math.floor(product.requestedQuantity / product.conversionRate) // 转换为采购单位
        }));
        setSelectedProducts(formattedProducts);
      }
    } else {
      // 新建模式，设置默认值
      form.setFieldsValue({
        expectedDeliveryDate: dayjs().add(7, 'day'),
        priority: 'normal'
      });
    }
    setProductList(mockProducts);
  }, [mode, requisitionData, form]);

  // 打开商品选择弹窗
  const handleAddProduct = () => {
    setProductModalVisible(true);
  };

  // 商品选择弹窗确认
  const handleProductModalOk = () => {
    const selectedRowKeys = productModalVisible.selectedRowKeys || [];
    const newProducts = productList
      .filter(product => selectedRowKeys.includes(product.id))
      .filter(product => !selectedProducts.some(selected => selected.id === product.id))
      .map(product => ({
        ...product,
        requestedQuantity: 1, // 默认申请1个采购单位
        totalBaseUnits: product.conversionRate, // 自动计算基本单位总数
        totalAmount: product.estimatedPrice // 自动计算总金额
      }));

    setSelectedProducts([...selectedProducts, ...newProducts]);
    setProductModalVisible(false);
    message.success(`已添加 ${newProducts.length} 个商品`);
  };

  // 删除商品
  const handleDeleteProduct = (productId) => {
    const newProducts = selectedProducts.filter(product => product.id !== productId);
    setSelectedProducts(newProducts);
    message.success('商品已删除');
  };

  // 申请数量变化处理
  const handleQuantityChange = (productId, quantity) => {
    const newProducts = selectedProducts.map(product => {
      if (product.id === productId) {
        const validQuantity = Math.max(1, Math.floor(quantity || 1)); // 确保为正整数
        return {
          ...product,
          requestedQuantity: validQuantity,
          totalBaseUnits: validQuantity * product.conversionRate,
          totalAmount: validQuantity * product.estimatedPrice
        };
      }
      return product;
    });
    setSelectedProducts(newProducts);
  };

  // 保存草稿
  const handleSaveDraft = () => {
    form.validateFields().then(values => {
      if (selectedProducts.length === 0) {
        message.error('请至少添加一个商品');
        return;
      }

      setLoading(true);
      const formData = {
        ...values,
        products: selectedProducts,
        status: 'draft',
        estimatedAmount: calculateTotalAmount()
      };

      // 模拟API调用
      setTimeout(() => {
        console.log('保存草稿:', formData);
        message.success('草稿保存成功');
        setLoading(false);
        onBack?.();
      }, 1000);
    });
  };

  // 提交申请
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (selectedProducts.length === 0) {
        message.error('请至少添加一个商品');
        return;
      }

      // 验证所有商品申请数量
      const invalidProducts = selectedProducts.filter(product => 
        !Number.isInteger(product.requestedQuantity) || product.requestedQuantity < 1
      );

      if (invalidProducts.length > 0) {
        message.error('申请数量必须为正整数');
        return;
      }

      setLoading(true);
      const formData = {
        ...values,
        products: selectedProducts,
        status: 'pending',
        estimatedAmount: calculateTotalAmount(),
        submitTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      // 模拟API调用
      setTimeout(() => {
        console.log('提交申请:', formData);
        message.success('申请提交成功，等待审批');
        setLoading(false);
        onBack?.();
      }, 1000);
    });
  };

  // 计算总金额
  const calculateTotalAmount = () => {
    return selectedProducts.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
  };

  // 商品选择弹窗的表格列定义
  const productModalColumns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{text}</span>
      )
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120
    },
    {
      title: '订货单位',
      key: 'procurementUnit',
      width: 100,
      render: (_, record) => (
        <Tag color="blue">{record.procurementUnit}</Tag>
      )
    },
    {
      title: '换算关系',
      key: 'conversionRate',
      width: 120,
      render: (_, record) => (
        <span style={{ color: '#666', fontSize: '12px' }}>
          (1{record.procurementUnit} = {record.conversionRate}{record.baseUnit})
        </span>
      )
    },
    {
      title: '当前库存',
      key: 'currentStock',
      width: 100,
      render: (_, record) => (
        <span style={{ color: record.currentStock < 10 ? '#ff4d4f' : '#52c41a' }}>
          {record.currentStock} {record.baseUnit}
        </span>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      ellipsis: true
    }
  ];

  // 已选商品明细表格列定义
  const selectedProductColumns = [
    {
      title: '商品名称/SKU',
      key: 'productInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
            {record.sku}
          </div>
        </div>
      )
    },
    {
      title: '订货单位',
      dataIndex: 'procurementUnit',
      key: 'procurementUnit',
      width: 100,
      render: (text) => (
        <Tag color="blue" style={{ fontWeight: 500 }}>{text}</Tag>
      )
    },
    {
      title: '换算关系',
      key: 'conversionRate',
      width: 120,
      render: (_, record) => (
        <span style={{ color: '#666', fontSize: '12px' }}>
          (1{record.procurementUnit} = {record.conversionRate}{record.baseUnit})
        </span>
      )
    },
    {
      title: '当前库存',
      key: 'currentStock',
      width: 100,
      render: (_, record) => (
        <span style={{ color: record.currentStock < 10 ? '#ff4d4f' : '#52c41a' }}>
          {record.currentStock} {record.baseUnit}
        </span>
      )
    },
    {
      title: '申请数量',
      key: 'requestedQuantity',
      width: 150,
      render: (_, record) => (
        <Space.Compact>
          <InputNumber
            min={1}
            precision={0}
            value={record.requestedQuantity}
            onChange={(value) => handleQuantityChange(record.id, value)}
            style={{ width: 80 }}
          />
          <Input
            value={record.procurementUnit}
            readOnly
            style={{ 
              width: 60, 
              backgroundColor: '#f5f5f5',
              color: '#666',
              fontWeight: 500
            }}
          />
        </Space.Compact>
      )
    },
    {
      title: '合计数量(基本单位)',
      key: 'totalBaseUnits',
      width: 150,
      render: (_, record) => (
        <span style={{ 
          color: '#1890ff', 
          fontWeight: 500,
          fontSize: '13px'
        }}>
          (共 {record.totalBaseUnits} {record.baseUnit})
        </span>
      )
    },
    {
      title: '零售金额',
      key: 'totalAmount',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>
          ￥{record.totalAmount?.toFixed(2)}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm
          title="确定要删除这个商品吗？"
          onConfirm={() => handleDeleteProduct(record.id)}
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
      )
    }
  ];

  return (
    <div className="module-container">
      <Card>
        {/* 页面标题 */}
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              style={{ borderRadius: '2px' }}
            >
              返回
            </Button>
            <Divider type="vertical" />
            <span style={{ fontSize: '16px', fontWeight: 500 }}>
              {mode === 'create' ? '新建采购申请' : '编辑采购申请'}
            </span>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          size="large"
        >
          {/* 基础信息区 */}
          <Card 
            title="基础信息" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="stationId"
                  label="所属加油站"
                  rules={[{ required: true, message: '请选择所属加油站' }]}
                >
                  <TreeSelect
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={buildStationTreeData()}
                    placeholder="请选择加油站"
                    showSearch
                    treeDefaultExpandAll={false}
                    treeNodeFilterProp="title"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="channelId"
                  label="采购渠道"
                  rules={[{ required: true, message: '请选择采购渠道' }]}
                >
                  <Select placeholder="请选择采购渠道">
                    {purchaseRequisitionData.procurementChannels.map(channel => (
                      <Option key={channel.id} value={channel.id}>
                        {channel.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="expectedDeliveryDate"
                  label="期望到货日期"
                  rules={[{ required: true, message: '请选择期望到货日期' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current < dayjs().subtract(1, 'day')}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="priority"
                  label="申请优先级"
                  rules={[{ required: true, message: '请选择申请优先级' }]}
                >
                  <Select placeholder="请选择优先级">
                    <Option value="low">低</Option>
                    <Option value="normal">普通</Option>
                    <Option value="urgent">紧急</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="remarks" label="备注说明">
                  <TextArea 
                    rows={3}
                    placeholder="请输入备注信息（可选）"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 商品明细区 */}
          <Card 
            title="商品明细" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddProduct}
                style={{ borderRadius: '2px' }}
              >
                添加商品
              </Button>
            }
          >
            {selectedProducts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0', 
                color: '#999',
                fontSize: '14px'
              }}>
                暂无商品，请点击"添加商品"按钮选择商品
              </div>
            ) : (
              <Table
                columns={selectedProductColumns}
                dataSource={selectedProducts}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1000 }}
                size="small"
                summary={() => {
                  const totalAmount = calculateTotalAmount();
                  const totalItems = selectedProducts.length;
                  return (
                    <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                      <Table.Summary.Cell index={0} colSpan={5}>
                        <span style={{ fontWeight: 500 }}>
                          合计（{totalItems} 种商品）
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <span style={{ fontWeight: 500, color: '#1890ff', fontSize: '16px' }}>
                          ¥{totalAmount.toFixed(2)}
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            )}
          </Card>

          {/* 底部操作区 */}
          <Card size="small">
            <Row justify="end">
              <Col>
                <Space>
                  <Button 
                    onClick={onBack}
                    style={{ borderRadius: '2px' }}
                  >
                    取消
                  </Button>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleSaveDraft}
                    loading={loading}
                    disabled={selectedProducts.length === 0}
                    style={{ borderRadius: '2px' }}
                  >
                    保存草稿
                  </Button>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={selectedProducts.length === 0}
                    style={{ borderRadius: '2px' }}
                  >
                    提交申请
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Form>
      </Card>

      {/* 商品选择弹窗 */}
      <Modal
        title={
          <Space>
            <SearchOutlined />
            <span>选择商品</span>
          </Space>
        }
        open={productModalVisible}
        onOk={handleProductModalOk}
        onCancel={() => setProductModalVisible(false)}
        width={1000}
        destroyOnClose
      >
        <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f7ff', borderRadius: '4px' }}>
          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: 4 }}>
            💡 选择提示：
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            • 每个商品都有固定的"订货单位"，申请数量必须按订货单位的整数倍填写
            <br />
            • 选择商品时请注意查看换算关系，例如：1箱 = 10瓶
            <br />
            • 库存不足的商品会用红色显示，建议优先采购
          </div>
        </div>
        
        <Table
          columns={productModalColumns}
          dataSource={productList}
          rowKey="id"
          scroll={{ x: 800 }}
          size="small"
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              productModalVisible.selectedRowKeys = selectedRowKeys;
            },
            getCheckboxProps: (record) => ({
              disabled: selectedProducts.some(product => product.id === record.id)
            })
          }}
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false
          }}
        />
      </Modal>
    </div>
  );
};

export default CreateRequisitionPage;