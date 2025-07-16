import React, { useState } from 'react';
import './index.css';
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
  Breadcrumb, 
  message, 
  DatePicker,
  Row,
  Col,
  Tabs,
  Tag,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PrinterOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GoodsPurchaseManagement = () => {
  // 状态定义
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增采购单');
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentPurchaseId, setCurrentPurchaseId] = useState(null);
  
  // 模拟采购单数据
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      key: '1',
      id: 'PO20250312001',
      supplier: '北京供应商A',
      purchaseDate: '2025-03-12',
      totalAmount: 5680.50,
      totalInputTax: 568.05,  // 新增：进项税总额
      totalOutputTax: 852.08, // 新增：销项税总额
      status: '已入库',
      creator: '张三',
      createTime: '2025-03-12 09:30:00',
      approver: '李四',
      approveTime: '2025-03-12 10:15:00',
      remark: '常规采购',
    },
    {
      key: '2',
      id: 'PO20250311001',
      supplier: '上海供应商B',
      purchaseDate: '2025-03-11',
      totalAmount: 3250.00,
      totalInputTax: 325.00,  // 新增：进项税总额
      totalOutputTax: 487.50, // 新增：销项税总额
      status: '已审核',
      creator: '张三',
      createTime: '2025-03-11 14:20:00',
      approver: '李四',
      approveTime: '2025-03-11 15:10:00',
      remark: '常规采购',
    },
    {
      key: '3',
      id: 'PO20250310001',
      supplier: '广州供应商C',
      purchaseDate: '2025-03-10',
      totalAmount: 4200.80,
      totalInputTax: 420.08,  // 新增：进项税总额
      totalOutputTax: 630.12, // 新增：销项税总额
      status: '待审核',
      creator: '王五',
      createTime: '2025-03-10 11:05:00',
      approver: '',
      approveTime: '',
      remark: '紧急采购',
    },
    {
      key: '4',
      id: 'PO20250309001',
      supplier: '深圳供应商D',
      purchaseDate: '2025-03-09',
      totalAmount: 1850.30,
      totalInputTax: 185.03,  // 新增：进项税总额
      totalOutputTax: 277.55, // 新增：销项税总额
      status: '已取消',
      creator: '王五',
      createTime: '2025-03-09 16:40:00',
      approver: '',
      approveTime: '',
      remark: '取消原因：供应商缺货',
    },
  ]);

  // 模拟采购单明细数据
  const [purchaseDetails, setPurchaseDetails] = useState([
    {
      key: '1-1',
      purchaseId: 'PO20250312001',
      goodsId: '1001',
      goodsName: '可口可乐',
      specification: '330ml/罐',
      unit: '罐',
      quantity: 500,
      purchasePrice: 2.00,  // 新增：采购单价
      price: 2.50,          // 修改：销售单价
      inputTaxRate: 10,     // 新增：进项税率
      outputTaxRate: 13,    // 新增：销项税率
      inputTax: 100.00,     // 新增：进项税额
      outputTax: 162.50,    // 新增：销项税额
      amount: 1250.00,
      remark: '',
    },
    {
      key: '1-2',
      purchaseId: 'PO20250312001',
      goodsId: '1002',
      goodsName: '百事可乐',
      specification: '330ml/罐',
      unit: '罐',
      quantity: 400,
      purchasePrice: 1.80,  // 新增：采购单价
      price: 2.30,          // 修改：销售单价
      inputTaxRate: 10,     // 新增：进项税率
      outputTaxRate: 13,    // 新增：销项税率
      inputTax: 72.00,      // 新增：进项税额
      outputTax: 119.60,    // 新增：销项税额
      amount: 920.00,
    },
    {
      key: '1-3',
      purchaseId: 'PO20250312001',
      goodsId: '1005',
      goodsName: '康师傅方便面',
      specification: '100g/包',
      unit: '包',
      quantity: 600,
      purchasePrice: 2.00,  // 新增：采购单价
      price: 2.80,          // 修改：销售单价
      inputTaxRate: 10,     // 新增：进项税率
      outputTaxRate: 13,    // 新增：销项税率
      inputTax: 120.00,      // 新增：进项税额
      outputTax: 182.00,     // 新增：销项税额
      amount: 1680.00,
    },
    {
      key: '1-4',
      purchaseId: 'PO20250312001',
      goodsId: '1006',
      goodsName: '统一方便面',
      specification: '100g/包',
      unit: '包',
      quantity: 500,
      purchasePrice: 1.80,  // 新增：采购单价
      price: 2.70,          // 修改：销售单价
      inputTaxRate: 10,     // 新增：进项税率
      outputTaxRate: 13,    // 新增：销项税率
      inputTax: 90.00,       // 新增：进项税额
      outputTax: 135.00,     // 新增：销项税额
      amount: 1350.00,
    },
    {
      key: '1-5',
      purchaseId: 'PO20250312001',
      goodsId: '1007',
      goodsName: '洗发水',
      specification: '400ml/瓶',
      unit: '瓶',
      quantity: 20,
      purchasePrice: 16.00,  // 新增：采购单价
      price: 25.00,          // 修改：销售单价
      inputTaxRate: 10,       // 新增：进项税率
      outputTaxRate: 13,      // 新增：销项税率
      inputTax: 32.00,         // 新增：进项税额
      outputTax: 46.00,         // 新增：销项税额
      amount: 480.00,
    },
    {
      key: '2-1',
      purchaseId: 'PO20250311001',
      goodsId: '1001',
      goodsName: '可口可乐',
      specification: '330ml/罐',
      unit: '罐',
      quantity: 300,
      purchasePrice: 2.00,  // 新增：采购单价
      price: 2.50,          // 修改：销售单价
      inputTaxRate: 10,     // 新增：进项税率
      outputTaxRate: 13,    // 新增：销项税率
      inputTax: 60.00,       // 新增：进项税额
      outputTax: 90.00,       // 新增：销项税额
      amount: 750.00,
    },
    {
      key: '2-2',
      purchaseId: 'PO20250311001',
      goodsId: '1004',
      goodsName: '农夫山泉',
      specification: '550ml/瓶',
      unit: '瓶',
      quantity: 500,
      purchasePrice: 1.50,  // 新增：采购单价
      price: 1.50,          // 修改：销售单价
      inputTaxRate: 10,     // 新增：进项税率
      outputTaxRate: 13,    // 新增：销项税率
      inputTax: 75.00,       // 新增：进项税额
      outputTax: 75.00,       // 新增：销项税额
      amount: 750.00,
    },
    {
      key: '2-3',
      purchaseId: 'PO20250311001',
      goodsId: '1008',
      goodsName: '沐浴露',
      specification: '400ml/瓶',
      unit: '瓶',
      quantity: 50,
      purchasePrice: 22.00,  // 新增：采购单价
      price: 22.00,          // 修改：销售单价
      inputTaxRate: 10,       // 新增：进项税率
      outputTaxRate: 13,       // 新增：销项税率
      inputTax: 110.00,         // 新增：进项税额
      outputTax: 143.00,         // 新增：销项税额
      amount: 1100.00,
    },
    {
      key: '2-4',
      purchaseId: 'PO20250311001',
      goodsId: '1007',
      goodsName: '洗发水',
      specification: '400ml/瓶',
      unit: '瓶',
      quantity: 30,
      purchasePrice: 25.00,  // 新增：采购单价
      price: 25.00,          // 修改：销售单价
      inputTaxRate: 10,       // 新增：进项税率
      outputTaxRate: 13,       // 新增：销项税率
      inputTax: 75.00,         // 新增：进项税额
      outputTax: 75.00,         // 新增：销项税额
      amount: 750.00,
    },
  ]);

  // 模拟供应商数据
  const suppliers = [
    { id: '1', name: '北京供应商A' },
    { id: '2', name: '上海供应商B' },
    { id: '3', name: '广州供应商C' },
    { id: '4', name: '深圳供应商D' },
  ];

  // 模拟商品数据
  const goods = [
    { id: '1001', name: '可口可乐', specification: '330ml/罐', unit: '罐', price: 2.50 },
    { id: '1002', name: '百事可乐', specification: '330ml/罐', unit: '罐', price: 2.30 },
    { id: '1003', name: '雪碧', specification: '330ml/罐', unit: '罐', price: 2.40 },
    { id: '1004', name: '农夫山泉', specification: '550ml/瓶', unit: '瓶', price: 1.50 },
    { id: '1005', name: '康师傅方便面', specification: '100g/包', unit: '包', price: 2.80 },
    { id: '1006', name: '统一方便面', specification: '100g/包', unit: '包', price: 2.70 },
    { id: '1007', name: '洗发水', specification: '400ml/瓶', unit: '瓶', price: 25.00 },
    { id: '1008', name: '沐浴露', specification: '400ml/瓶', unit: '瓶', price: 22.00 },
  ];

  // 采购单表格列配置
  const columns = [
    {
      title: '采购单号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
    },
    {
      title: '总金额(元)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '进项税总额(元)',
      dataIndex: 'totalInputTax',
      key: 'totalInputTax',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalInputTax - b.totalInputTax,
    },
    {
      title: '销项税总额(元)',
      dataIndex: 'totalOutputTax',
      key: 'totalOutputTax',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.totalOutputTax - b.totalOutputTax,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = '';
        switch (text) {
          case '待审核':
            color = 'orange';
            break;
          case '已审核':
            color = 'blue';
            break;
          case '已入库':
            color = 'green';
            break;
          case '已取消':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<FileTextOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record.id)}
          >
            详情
          </Button>
          {record.status === '待审核' && (
            <>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                size="small"
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                onClick={() => handleDelete(record.key)}
              >
                取消
              </Button>
            </>
          )}
          {record.status === '已审核' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleWarehouse(record.id)}
            >
              入库
            </Button>
          )}
          <Button 
            icon={<PrinterOutlined />} 
            size="small"
            onClick={() => handlePrint(record.id)}
          >
            打印
          </Button>
        </Space>
      ),
    },
  ];

  // 采购单明细表格列配置
  const detailColumns = [
    {
      title: '商品编号',
      dataIndex: 'goodsId',
      key: 'goodsId',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
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
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '采购单价(元)',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: (text) => text.toFixed(2),
    },
    {
      title: '销售单价(元)',
      dataIndex: 'price',
      key: 'price',
      render: (text) => text.toFixed(2),
    },
    {
      title: '进项税率(%)',
      dataIndex: 'inputTaxRate',
      key: 'inputTaxRate',
    },
    {
      title: '销项税率(%)',
      dataIndex: 'outputTaxRate',
      key: 'outputTaxRate',
    },
    {
      title: '进项税额(元)',
      dataIndex: 'inputTax',
      key: 'inputTax',
      render: (text) => text.toFixed(2),
    },
    {
      title: '销项税额(元)',
      dataIndex: 'outputTax',
      key: 'outputTax',
      render: (text) => text.toFixed(2),
    },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => text.toFixed(2),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // 处理查看详情
  const handleViewDetail = (purchaseId) => {
    setCurrentPurchaseId(purchaseId);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setModalTitle('编辑采购单');
    setEditingRecord(record);
    
    // 获取采购单明细
    const details = getPurchaseDetails(record.id);
    
    // 设置表单初始值
    form.setFieldsValue({
      supplier: record.supplier,
      purchaseDate: moment(record.purchaseDate),
      remark: record.remark,
      details: details.map(item => ({
        goodsId: item.goodsId,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        price: item.price,
        remark: item.remark || '',
      })),
    });
    
    setModalVisible(true);
  };

  // 处理删除/取消
  const handleDelete = (key) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消该采购单吗？取消后将无法恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 更新采购单状态为已取消
        const updatedOrders = purchaseOrders.map(item => {
          if (item.key === key) {
            return {
              ...item,
              status: '已取消',
              remark: item.remark + ' (已取消)'
            };
          }
          return item;
        });
        
        setPurchaseOrders(updatedOrders);
        message.success('采购单已取消');
      }
    });
  };

  // 处理入库
  const handleWarehouse = (purchaseId) => {
    Modal.confirm({
      title: '确认入库',
      content: '确定要将该采购单入库吗？入库后将增加相应商品的库存。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 更新采购单状态为已入库
        const updatedOrders = purchaseOrders.map(item => {
          if (item.id === purchaseId) {
            return {
              ...item,
              status: '已入库'
            };
          }
          return item;
        });
        
        setPurchaseOrders(updatedOrders);
        message.success('采购单已入库');
      }
    });
  };

  // 处理打印
  const handlePrint = (purchaseId) => {
    message.success('打印功能模拟：已发送采购单到打印机');
  };

  // 处理新增
  const handleAdd = () => {
    setModalTitle('新增采购单');
    setEditingRecord(null);
    form.resetFields();
    
    // 设置默认值
    form.setFieldsValue({
      purchaseDate: moment(),
      details: [{}], // 至少一行明细
    });
    
    setModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const { supplier, purchaseDate, remark, details } = values;
          
          // 计算总金额和税额
          let totalAmount = 0;
          let totalInputTax = 0;
          let totalOutputTax = 0;
          
          details.forEach(detail => {
            const amount = detail.quantity * detail.price;
            const inputTax = detail.quantity * detail.purchasePrice * (detail.inputTaxRate / 100);
            const outputTax = detail.quantity * detail.price * (detail.outputTaxRate / 100);
            
            totalAmount += amount;
            totalInputTax += inputTax;
            totalOutputTax += outputTax;
          });
          
          if (editingRecord) {
            // 编辑现有采购单
            const updatedOrders = purchaseOrders.map(item => {
              if (item.key === editingRecord.key) {
                return {
                  ...item,
                  supplier,
                  purchaseDate: purchaseDate.format('YYYY-MM-DD'),
                  totalAmount,
                  totalInputTax,
                  totalOutputTax,
                  remark: remark || '',
                };
              }
              return item;
            });
            
            // 更新采购单明细
            const existingDetails = purchaseDetails.filter(item => item.purchaseId !== editingRecord.id);
            const newDetails = details.map((detail, index) => {
              // 获取商品信息
              const goodsInfo = goods.find(g => g.id === detail.goodsId);
              const amount = detail.quantity * detail.price;
              const inputTax = detail.quantity * detail.purchasePrice * (detail.inputTaxRate / 100);
              const outputTax = detail.quantity * detail.price * (detail.outputTaxRate / 100);
              
              return {
                key: `${editingRecord.key}-${index + 1}`,
                purchaseId: editingRecord.id,
                goodsId: detail.goodsId,
                goodsName: goodsInfo.name,
                specification: goodsInfo.specification,
                unit: goodsInfo.unit,
                quantity: detail.quantity,
                purchasePrice: detail.purchasePrice,
                price: detail.price,
                inputTaxRate: detail.inputTaxRate,
                outputTaxRate: detail.outputTaxRate,
                inputTax: inputTax,
                outputTax: outputTax,
                amount: amount,
                remark: detail.remark || '',
              };
            });
            
            setPurchaseOrders(updatedOrders);
            setPurchaseDetails([...existingDetails, ...newDetails]);
            message.success('采购单编辑成功');
          } else {
            // 添加新采购单
            const newKey = (parseInt(purchaseOrders[purchaseOrders.length - 1]?.key || '0') + 1).toString();
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const newId = `PO${dateStr}${newKey.padStart(3, '0')}`;
            
            const newOrder = {
              key: newKey,
              id: newId,
              supplier,
              purchaseDate: purchaseDate.format('YYYY-MM-DD'),
              totalAmount,
              totalInputTax,
              totalOutputTax,
              status: '待审核',
              creator: '当前用户',
              createTime: new Date().toLocaleString(),
              approver: '',
              approveTime: '',
              remark: remark || '',
            };
            
            // 添加采购单明细
            const newDetails = details.map((detail, index) => {
              // 获取商品信息
              const goodsInfo = goods.find(g => g.id === detail.goodsId);
              const amount = detail.quantity * detail.price;
              const inputTax = detail.quantity * detail.purchasePrice * (detail.inputTaxRate / 100);
              const outputTax = detail.quantity * detail.price * (detail.outputTaxRate / 100);
              
              return {
                key: `${newKey}-${index + 1}`,
                purchaseId: newId,
                goodsId: detail.goodsId,
                goodsName: goodsInfo.name,
                specification: goodsInfo.specification,
                unit: goodsInfo.unit,
                quantity: detail.quantity,
                purchasePrice: detail.purchasePrice,
                price: detail.price,
                inputTaxRate: detail.inputTaxRate,
                outputTaxRate: detail.outputTaxRate,
                inputTax: inputTax,
                outputTax: outputTax,
                amount: amount,
                remark: detail.remark || '',
              };
            });
            
            setPurchaseOrders([...purchaseOrders, newOrder]);
            setPurchaseDetails([...purchaseDetails, ...newDetails]);
            message.success('采购单添加成功');
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

  // 处理商品选择变化
  const handleGoodsChange = (value, index) => {
    // 获取商品信息
    const goodsInfo = goods.find(g => g.id === value);
    
    // 设置默认值
    const details = form.getFieldValue('details');
    details[index].purchasePrice = goodsInfo.price * 0.8; // 采购价默认为销售价的80%
    details[index].price = goodsInfo.price;
    details[index].inputTaxRate = 10; // 默认进项税率
    details[index].outputTaxRate = 13; // 默认销项税率
    form.setFieldsValue({ details });
  };

  // 获取指定采购单的明细
  const getPurchaseDetails = (purchaseId) => {
    return purchaseDetails.filter(item => item.purchaseId === purchaseId);
  };

  // 获取指定采购单
  const getPurchaseOrder = (purchaseId) => {
    return purchaseOrders.find(item => item.id === purchaseId);
  };
  
  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/goods">商品管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>采购管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>商品采购管理</h2>
      </div>

      <Card>
        {/* 搜索区域 */}
        <div className="search-container" style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item name="purchaseId" label="采购单号">
              <Input placeholder="请输入采购单号" />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                <Option value="待审核">待审核</Option>
                <Option value="已审核">已审核</Option>
                <Option value="已入库">已入库</Option>
                <Option value="已取消">已取消</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" label="采购日期">
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
        </div>
        
        {/* 操作按钮区域 */}
        <div className="table-operations" style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
            新增采购单
          </Button>
        </div>
        
        {/* 表格区域 */}
        <Table 
          columns={columns} 
          dataSource={purchaseOrders} 
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 采购单详情模态框 */}
      <Modal
        title="采购单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {currentPurchaseId && (
          <div>
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <p><strong>采购单号：</strong>{getPurchaseOrder(currentPurchaseId)?.id}</p>
                </Col>
                <Col span={8}>
                  <p><strong>供应商：</strong>{getPurchaseOrder(currentPurchaseId)?.supplier}</p>
                </Col>
                <Col span={8}>
                  <p><strong>采购日期：</strong>{getPurchaseOrder(currentPurchaseId)?.purchaseDate}</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <p><strong>状态：</strong>
                    <Tag color={
                      getPurchaseOrder(currentPurchaseId)?.status === '待审核' ? 'orange' :
                      getPurchaseOrder(currentPurchaseId)?.status === '已审核' ? 'blue' :
                      getPurchaseOrder(currentPurchaseId)?.status === '已入库' ? 'green' :
                      'red'
                    }>
                      {getPurchaseOrder(currentPurchaseId)?.status}
                    </Tag>
                  </p>
                </Col>
                <Col span={8}>
                  <p><strong>创建人：</strong>{getPurchaseOrder(currentPurchaseId)?.creator}</p>
                </Col>
                <Col span={8}>
                  <p><strong>创建时间：</strong>{getPurchaseOrder(currentPurchaseId)?.createTime}</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <p><strong>审核人：</strong>{getPurchaseOrder(currentPurchaseId)?.approver || '未审核'}</p>
                </Col>
                <Col span={8}>
                  <p><strong>审核时间：</strong>{getPurchaseOrder(currentPurchaseId)?.approveTime || '未审核'}</p>
                </Col>
                <Col span={8}>
                  <p><strong>备注：</strong>{getPurchaseOrder(currentPurchaseId)?.remark}</p>
                </Col>
              </Row>
            </Card>
            
            <Card title="采购明细">
              <Table 
                columns={detailColumns} 
                dataSource={getPurchaseDetails(currentPurchaseId)} 
                rowKey="key"
                pagination={false}
                summary={pageData => {
                  let totalQuantity = 0;
                  let totalAmount = 0;
                  
                  pageData.forEach(({ quantity, amount }) => {
                    totalQuantity += quantity;
                    totalAmount += amount;
                  });
                  
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={4}>合计</Table.Summary.Cell>
                        <Table.Summary.Cell index={4}>{totalQuantity}</Table.Summary.Cell>
                        <Table.Summary.Cell index={5}></Table.Summary.Cell>
                        <Table.Summary.Cell index={6}>{totalAmount.toFixed(2)}</Table.Summary.Cell>
                        <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Card>
          </div>
        )}
      </Modal>

      {/* 新增/编辑采购单模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        maskClosable={false}
        width={1000}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="purchaseForm"
          initialValues={{ details: [{}] }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="supplier"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="请选择供应商">
                  {suppliers.map(supplier => (
                    <Option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="purchaseDate"
                label="采购日期"
                rules={[{ required: true, message: '请选择采购日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="remark"
                label="备注"
              >
                <Input.TextArea rows={1} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">采购明细</Divider>
          
          <Form.List name="details">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row gutter={16} key={key} style={{ marginBottom: 16 }}>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'goodsId']}
                        rules={[{ required: true, message: '请选择商品' }]}
                      >
                        <Select 
                          placeholder="请选择商品" 
                          onChange={(value) => handleGoodsChange(value, index)}
                        >
                          {goods.map(item => (
                            <Option key={item.id} value={item.id}>
                              {item.name} ({item.specification})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[
                          { required: true, message: '请输入数量' },
                          { type: 'number', min: 1, message: '数量必须大于0' }
                        ]}
                      >
                        <InputNumber 
                          placeholder="数量" 
                          style={{ width: '100%' }} 
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'purchasePrice']}
                        rules={[
                          { required: true, message: '请输入采购单价' },
                          { type: 'number', min: 0.01, message: '单价必须大于0' }
                        ]}
                      >
                        <InputNumber 
                          placeholder="采购单价" 
                          style={{ width: '100%' }} 
                          min={0.01} 
                          precision={2}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'price']}
                        rules={[
                          { required: true, message: '请输入销售单价' },
                          { type: 'number', min: 0.01, message: '单价必须大于0' }
                        ]}
                      >
                        <InputNumber 
                          placeholder="销售单价" 
                          style={{ width: '100%' }} 
                          min={0.01} 
                          precision={2}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'inputTaxRate']}
                        rules={[
                          { required: true, message: '请输入进项税率' },
                          { type: 'number', min: 0, max: 100, message: '税率必须在0-100之间' }
                        ]}
                      >
                        <InputNumber 
                          placeholder="进项税率%" 
                          style={{ width: '100%' }} 
                          min={0} 
                          max={100}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'outputTaxRate']}
                        rules={[
                          { required: true, message: '请输入销项税率' },
                          { type: 'number', min: 0, max: 100, message: '税率必须在0-100之间' }
                        ]}
                      >
                        <InputNumber 
                          placeholder="销项税率%" 
                          style={{ width: '100%' }} 
                          min={0} 
                          max={100}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'remark']}
                      >
                        <Input placeholder="备注" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined 
                          onClick={() => remove(name)} 
                          style={{ marginTop: 8 }}
                        />
                      ) : null}
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    添加商品
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default GoodsPurchaseManagement; 