import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Row,
  Col,
  Space,
  message,
  Popconfirm,
  InputNumber,
  Tag,
  Card,
  TreeSelect
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import purchaseRequisitionData from '../../../../mock/purchase/purchaseRequisition.json';
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;
const { TextArea } = Input;

const RequisitionFormModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  mode = 'create', 
  requisitionData = null 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [productList] = useState([
    {
      id: 'PRD001',
      name: '高效燃油宝',
      sku: 'SKU001001',
      specification: '300ml装',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 10,
      currentStock: 5,
      category: '汽车养护',
      supplier: '环保科技有限公司',
      retailPrice: 285.00 // 零售价格（每箱）
    },
    {
      id: 'PRD002',
      name: '品牌A尿素溶液',
      sku: 'SKU001002',
      specification: '10L装',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 4,
      currentStock: 12,
      category: '尿素',
      supplier: '环保科技有限公司',
      retailPrice: 114.00
    },
    {
      id: 'PRD003',
      name: '5W-30全合成机油',
      sku: 'SKU001003',
      specification: '4L装',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 6,
      currentStock: 8,
      category: '润滑油',
      supplier: '中石化润滑油公司',
      retailPrice: 2280.00
    },
    {
      id: 'PRD004',
      name: '农夫山泉矿泉水',
      sku: 'SKU001004',
      specification: '550ml×24瓶',
      baseUnit: '瓶',
      procurementUnit: '箱',
      conversionRate: 24,
      currentStock: 48,
      category: '饮料',
      supplier: '农夫山泉股份有限公司',
      retailPrice: 48.00
    },
    {
      id: 'PRD005',
      name: '康师傅红烧牛肉面',
      sku: 'SKU001005',
      specification: '袋装',
      baseUnit: '包',
      procurementUnit: '箱',
      conversionRate: 12,
      currentStock: 25,
      category: '食品',
      supplier: '康师傅控股有限公司',
      retailPrice: 54.00
    },
    {
      id: 'PRD006',
      name: '防冻液',
      sku: 'SKU001006',
      specification: '4L装',
      baseUnit: '瓶',
      procurementUnit: '桶',
      conversionRate: 8,
      currentStock: 16,
      category: '汽车养护',
      supplier: '中石化润滑油公司',
      retailPrice: 364.00
    }
  ]);

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

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && requisitionData) {
        // 编辑模式，填充数据
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
            requestedQuantity: Math.floor(product.requestedQuantity / (product.conversionRate || 1)),
            totalBaseUnits: product.requestedQuantity,
            totalAmount: product.estimatedAmount
          }));
          setSelectedProducts(formattedProducts);
        }
      } else {
        // 新建模式，设置默认值
        form.setFieldsValue({
          expectedDeliveryDate: dayjs().add(7, 'day'),
          priority: 'normal'
        });
        setSelectedProducts([]);
      }
    }
  }, [visible, mode, requisitionData, form]);

  // 关闭弹窗时重置表单
  const handleCancel = () => {
    form.resetFields();
    setSelectedProducts([]);
    setSelectedRowKeys([]);
    onCancel();
  };

  // 打开商品选择弹窗
  const handleAddProduct = () => {
    setSelectedRowKeys([]);
    setProductModalVisible(true);
  };

  // 商品选择弹窗确认
  const handleProductModalOk = () => {
    const newProducts = productList
      .filter(product => selectedRowKeys.includes(product.id))
      .filter(product => !selectedProducts.some(selected => selected.id === product.id))
      .map(product => ({
        ...product,
        requestedQuantity: 1,
        totalBaseUnits: product.conversionRate,
        totalAmount: product.retailPrice // 使用零售价格
      }));

    setSelectedProducts([...selectedProducts, ...newProducts]);
    setSelectedRowKeys([]);
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
        const validQuantity = Math.max(1, Math.floor(quantity || 1));
        return {
          ...product,
          requestedQuantity: validQuantity,
          totalBaseUnits: validQuantity * product.conversionRate,
          totalAmount: validQuantity * product.retailPrice // 使用零售价格
        };
      }
      return product;
    });
    setSelectedProducts(newProducts);
  };

  // 计算总金额
  const calculateTotalAmount = () => {
    return selectedProducts.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
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
        estimatedAmount: calculateTotalAmount(),
        expectedDeliveryDate: values.expectedDeliveryDate.format('YYYY-MM-DD')
      };

      setTimeout(() => {
        console.log('保存草稿:', formData);
        message.success('草稿保存成功');
        setLoading(false);
        onOk(formData);
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
        expectedDeliveryDate: values.expectedDeliveryDate.format('YYYY-MM-DD'),
        submitTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      setTimeout(() => {
        console.log('提交申请:', formData);
        message.success(mode === 'edit' ? '申请修改成功' : '申请提交成功，等待审批');
        setLoading(false);
        onOk(formData);
      }, 1000);
    });
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
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px' }}>{record.name}</div>
          <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
            {record.sku}
          </div>
        </div>
      )
    },
    {
      title: '订货单位',
      dataIndex: 'procurementUnit',
      key: 'procurementUnit',
      width: 80,
      render: (text) => (
        <Tag color="blue" style={{ fontWeight: 500 }}>{text}</Tag>
      )
    },
    {
      title: '换算关系',
      key: 'conversionRate',
      width: 100,
      render: (_, record) => (
        <span style={{ color: '#666', fontSize: '11px' }}>
          (1{record.procurementUnit} = {record.conversionRate}{record.baseUnit})
        </span>
      )
    },
    {
      title: '当前库存',
      key: 'currentStock',
      width: 80,
      render: (_, record) => (
        <span style={{ 
          color: record.currentStock < 10 ? '#ff4d4f' : '#52c41a',
          fontSize: '12px'
        }}>
          {record.currentStock} {record.baseUnit}
        </span>
      )
    },
    {
      title: '申请数量',
      key: 'requestedQuantity',
      width: 120,
      render: (_, record) => (
        <Space.Compact>
          <InputNumber
            min={1}
            precision={0}
            value={record.requestedQuantity}
            onChange={(value) => handleQuantityChange(record.id, value)}
            style={{ width: 60 }}
            size="small"
          />
          <Input
            value={record.procurementUnit}
            readOnly
            size="small"
            style={{ 
              width: 50, 
              backgroundColor: '#f5f5f5',
              color: '#666',
              fontWeight: 500,
              fontSize: '11px'
            }}
          />
        </Space.Compact>
      )
    },
    {
      title: '合计数量',
      key: 'totalBaseUnits',
      width: 100,
      render: (_, record) => (
        <span style={{ 
          color: '#1890ff', 
          fontWeight: 500,
          fontSize: '11px'
        }}>
          (共 {record.totalBaseUnits} {record.baseUnit})
        </span>
      )
    },
    {
      title: '零售金额',
      key: 'totalAmount',
      width: 90,
      align: 'right',
      render: (_, record) => (
        <span style={{ fontWeight: 500, color: '#1890ff', fontSize: '12px' }}>
          ¥{record.totalAmount?.toFixed(2)}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
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
    <>
      <Modal
        title={mode === 'create' ? '新建采购申请' : '编辑采购申请'}
        open={visible}
        onCancel={handleCancel}
        width={1200}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="saveDraft"
            onClick={handleSaveDraft}
            loading={loading}
            disabled={selectedProducts.length === 0}
            style={{ borderRadius: '2px' }}
          >
            保存草稿
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={selectedProducts.length === 0}
            style={{ borderRadius: '2px' }}
          >
            {mode === 'edit' ? '保存修改' : '提交申请'}
          </Button>
        ]}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          size="middle"
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
                    rows={2}
                    placeholder="请输入备注信息（可选）"
                    maxLength={300}
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
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAddProduct}
                style={{ borderRadius: '2px' }}
              >
                添加商品
              </Button>
            }
          >
            {/* 价格说明备注 */}
            <div style={{ 
              marginBottom: 16, 
              padding: '12px', 
              backgroundColor: '#fff7e6', 
              border: '1px solid #ffd591',
              borderRadius: '4px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: 4, color: '#d48806' }}>
                📊 价格说明：
              </div>
              <div style={{ fontSize: '12px', color: '#ad6800' }}>
                • 以下展示的金额为<strong>零售价格</strong>，仅供参考和预估用途
                <br />
                • 实际采购价格以供应商报价为准，可能与零售价格存在差异
              </div>
            </div>
            
            {selectedProducts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '30px 0', 
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
                scroll={{ x: 800 }}
                size="small"
                summary={() => {
                  const totalAmount = calculateTotalAmount();
                  const totalItems = selectedProducts.length;
                  return (
                    <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                      <Table.Summary.Cell index={0} colSpan={6}>
                        <span style={{ fontWeight: 500 }}>
                          合计（{totalItems} 种商品）
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <span style={{ fontWeight: 500, color: '#1890ff', fontSize: '14px' }}>
                          ¥{totalAmount.toFixed(2)}
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            )}
          </Card>
        </Form>
      </Modal>

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
            selectedRowKeys: selectedRowKeys,
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys);
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
    </>
  );
};

export default RequisitionFormModal;