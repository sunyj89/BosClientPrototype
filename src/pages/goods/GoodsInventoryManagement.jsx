import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber,
  Select,
  Row,
  Col,
  DatePicker,
  Tag,
  Tooltip,
  message
} from 'antd';
import { 
  EditOutlined, 
  HistoryOutlined, 
  SearchOutlined,
  ReloadOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GoodsInventoryManagement = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('调整库存');
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [currentGoodsId, setCurrentGoodsId] = useState(null);
  
  // 模拟数据
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      id: '1001',
      name: '可口可乐',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      currentStock: 120,
      warningStock: 30,
      costPrice: 2.5,
      retailPrice: 3.5,
      status: '正常',
    },
    {
      key: '2',
      id: '1002',
      name: '百事可乐',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      currentStock: 85,
      warningStock: 30,
      costPrice: 2.3,
      retailPrice: 3.5,
      status: '正常',
    },
    {
      key: '3',
      id: '1003',
      name: '雪碧',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      currentStock: 25,
      warningStock: 30,
      costPrice: 2.4,
      retailPrice: 3.5,
      status: '库存预警',
    },
    {
      key: '4',
      id: '1004',
      name: '农夫山泉',
      category: '饮料',
      specification: '550ml/瓶',
      unit: '瓶',
      currentStock: 200,
      warningStock: 50,
      costPrice: 1.5,
      retailPrice: 2.0,
      status: '正常',
    },
    {
      key: '5',
      id: '1005',
      name: '康师傅方便面',
      category: '食品',
      specification: '100g/包',
      unit: '包',
      currentStock: 45,
      warningStock: 50,
      costPrice: 2.8,
      retailPrice: 4.5,
      status: '库存预警',
    },
    {
      key: '6',
      id: '1006',
      name: '统一方便面',
      category: '食品',
      specification: '100g/包',
      unit: '包',
      currentStock: 60,
      warningStock: 50,
      costPrice: 2.7,
      retailPrice: 4.5,
      status: '正常',
    },
    {
      key: '7',
      id: '1007',
      name: '洗发水',
      category: '日用品',
      specification: '400ml/瓶',
      unit: '瓶',
      currentStock: 30,
      warningStock: 20,
      costPrice: 25.0,
      retailPrice: 38.0,
      status: '正常',
    },
    {
      key: '8',
      id: '1008',
      name: '沐浴露',
      category: '日用品',
      specification: '400ml/瓶',
      unit: '瓶',
      currentStock: 15,
      warningStock: 20,
      costPrice: 22.0,
      retailPrice: 35.0,
      status: '库存预警',
    },
  ]);

  // 模拟库存历史记录数据
  const [historyData, setHistoryData] = useState([
    {
      key: '1',
      goodsId: '1001',
      operationType: '入库',
      quantity: 50,
      beforeStock: 70,
      afterStock: 120,
      operationTime: '2025-03-12 10:30:00',
      operator: '张三',
      remark: '常规进货',
    },
    {
      key: '2',
      goodsId: '1001',
      operationType: '出库',
      quantity: 10,
      beforeStock: 130,
      afterStock: 120,
      operationTime: '2025-03-12 14:20:00',
      operator: '李四',
      remark: '销售出库',
    },
    {
      key: '3',
      goodsId: '1003',
      operationType: '入库',
      quantity: 30,
      beforeStock: 15,
      afterStock: 45,
      operationTime: '2025-03-11 09:15:00',
      operator: '张三',
      remark: '常规进货',
    },
    {
      key: '4',
      goodsId: '1003',
      operationType: '出库',
      quantity: 20,
      beforeStock: 45,
      afterStock: 25,
      operationTime: '2025-03-12 16:40:00',
      operator: '李四',
      remark: '销售出库',
    },
  ]);

  // 表格列配置
  const columns = [
    {
      title: '商品编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '饮料', value: '饮料' },
        { text: '食品', value: '食品' },
        { text: '日用品', value: '日用品' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      sorter: (a, b) => a.currentStock - b.currentStock,
      render: (text, record) => (
        <span>
          {text}
          {record.status === '库存预警' && (
            <Tooltip title="库存低于预警值">
              <WarningOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
            </Tooltip>
          )}
        </span>
      ),
    },
    {
      title: '预警库存',
      dataIndex: 'warningStock',
      key: 'warningStock',
    },
    {
      title: '成本价(元)',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (text) => text.toFixed(2),
    },
    {
      title: '零售价(元)',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      render: (text) => text.toFixed(2),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = text === '正常' ? 'green' : 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            调整
          </Button>
          <Button 
            type="primary" 
            icon={<HistoryOutlined />} 
            size="small"
            onClick={() => handleViewHistory(record.id)}
          >
            历史
          </Button>
        </Space>
      ),
    },
  ];

  // 历史记录表格列配置
  const historyColumns = [
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (text) => {
        let color = text === '入库' ? 'green' : 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '操作前库存',
      dataIndex: 'beforeStock',
      key: 'beforeStock',
    },
    {
      title: '操作后库存',
      dataIndex: 'afterStock',
      key: 'afterStock',
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
      sorter: (a, b) => new Date(a.operationTime) - new Date(b.operationTime),
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // 处理编辑按钮点击
  const handleEdit = (record) => {
    setModalTitle('调整库存');
    setEditingRecord(record);
    form.resetFields();
    form.setFieldsValue({
      goodsId: record.id,
      goodsName: record.name,
      currentStock: record.currentStock,
      operationType: '入库',
      quantity: 0,
    });
    setModalVisible(true);
  };

  // 处理查看历史按钮点击
  const handleViewHistory = (goodsId) => {
    setCurrentGoodsId(goodsId);
    setHistoryModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const { operationType, quantity } = values;
          const currentStock = editingRecord.currentStock;
          let newStock;
          
          if (operationType === '入库') {
            newStock = currentStock + quantity;
          } else {
            newStock = currentStock - quantity;
            if (newStock < 0) {
              message.error('库存不足，无法出库！');
              setLoading(false);
              return;
            }
          }
          
          // 更新库存
          const updatedDataSource = dataSource.map(item => {
            if (item.key === editingRecord.key) {
              const status = newStock < item.warningStock ? '库存预警' : '正常';
              return { ...item, currentStock: newStock, status };
            }
            return item;
          });
          
          setDataSource(updatedDataSource);
          
          // 添加历史记录
          const newHistoryRecord = {
            key: (parseInt(historyData[historyData.length - 1]?.key || '0') + 1).toString(),
            goodsId: editingRecord.id,
            operationType,
            quantity,
            beforeStock: currentStock,
            afterStock: newStock,
            operationTime: new Date().toLocaleString(),
            operator: '当前用户',
            remark: values.remark || '',
          };
          
          setHistoryData([...historyData, newHistoryRecord]);
          
          message.success(`${operationType}成功！`);
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

  // 处理历史记录模态框取消
  const handleHistoryModalCancel = () => {
    setHistoryModalVisible(false);
  };

  // 获取指定商品的历史记录
  const getGoodsHistory = (goodsId) => {
    return historyData.filter(item => item.goodsId === goodsId);
  };

  // 处理操作类型变化
  const handleOperationTypeChange = (value) => {
    // 可以在这里添加一些额外的逻辑
  };

  return (
    <div>
      <div className="page-header">
        <h2>商品库存管理</h2>
      </div>

      <Card>
        {/* 搜索区域 */}
        <div className="search-container" style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item name="goodsId" label="商品编号">
              <Input placeholder="请输入商品编号" />
            </Form.Item>
            <Form.Item name="goodsName" label="商品名称">
              <Input placeholder="请输入商品名称" />
            </Form.Item>
            <Form.Item name="category" label="商品分类">
              <Select placeholder="请选择分类" style={{ width: 120 }} allowClear>
                <Option value="饮料">饮料</Option>
                <Option value="食品">食品</Option>
                <Option value="日用品">日用品</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="库存状态">
              <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                <Option value="正常">正常</Option>
                <Option value="库存预警">库存预警</Option>
              </Select>
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
        
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 调整库存模态框 */}
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
          name="inventoryForm"
        >
          <Form.Item
            name="goodsId"
            label="商品编号"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="goodsName"
            label="商品名称"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="currentStock"
            label="当前库存"
          >
            <InputNumber style={{ width: '100%' }} disabled />
          </Form.Item>
          
          <Form.Item
            name="operationType"
            label="操作类型"
            rules={[{ required: true, message: '请选择操作类型' }]}
          >
            <Select onChange={handleOperationTypeChange}>
              <Option value="入库">入库</Option>
              <Option value="出库">出库</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="quantity"
            label="数量"
            rules={[
              { required: true, message: '请输入数量' },
              { type: 'number', min: 1, message: '数量必须大于0' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 历史记录模态框 */}
      <Modal
        title="库存操作历史"
        open={historyModalVisible}
        onCancel={handleHistoryModalCancel}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form layout="inline">
                <Form.Item label="操作类型">
                  <Select placeholder="请选择操作类型" style={{ width: 120 }} allowClear>
                    <Option value="入库">入库</Option>
                    <Option value="出库">出库</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="操作时间">
                  <RangePicker />
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
            </Col>
          </Row>
        </div>
        <Table 
          columns={historyColumns} 
          dataSource={getGoodsHistory(currentGoodsId)} 
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default GoodsInventoryManagement; 