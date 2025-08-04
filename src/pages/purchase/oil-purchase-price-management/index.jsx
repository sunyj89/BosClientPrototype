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
  Card,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  SaveOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OilPurchasePriceManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  // 模拟数据 - 油品进价数据
  const mockPriceData = [
    {
      key: '1',
      id: 'OILP20240315001',
      supplierName: '中石化北京分公司',
      startDate: '2024-03-15',
      endDate: '2024-03-31',
      status: '生效中',
      items: [
        {
          oilType: '92#汽油',
          unitPrice: 6.89,
          taxRate: 0.13,
          afterTaxPrice: 7.79
        },
        {
          oilType: '95#汽油',
          unitPrice: 7.32,
          taxRate: 0.13,
          afterTaxPrice: 8.27
        },
        {
          oilType: '98#汽油',
          unitPrice: 8.15,
          taxRate: 0.13,
          afterTaxPrice: 9.21
        },
        {
          oilType: '0#柴油',
          unitPrice: 6.43,
          taxRate: 0.13,
          afterTaxPrice: 7.27
        }
      ],
      createdBy: '张三',
      createdTime: '2024-03-14 15:30:22',
      remarks: '按计划定价'
    },
    {
      key: '2',
      id: 'OILP20240201001',
      supplierName: '中石化北京分公司',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      status: '已过期',
      items: [
        {
          oilType: '92#汽油',
          unitPrice: 6.75,
          taxRate: 0.13,
          afterTaxPrice: 7.63
        },
        {
          oilType: '95#汽油',
          unitPrice: 7.20,
          taxRate: 0.13,
          afterTaxPrice: 8.14
        },
        {
          oilType: '98#汽油',
          unitPrice: 8.05,
          taxRate: 0.13,
          afterTaxPrice: 9.10
        },
        {
          oilType: '0#柴油',
          unitPrice: 6.35,
          taxRate: 0.13,
          afterTaxPrice: 7.18
        }
      ],
      createdBy: '张三',
      createdTime: '2024-01-30 14:15:30',
      remarks: '常规定价'
    }
  ];

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setPriceData(mockPriceData);
      setLoading(false);
    }, 500);
  };

  // 油品价格列表列配置
  const columns = [
    {
      title: '价格单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: '生效日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '失效日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colorMap = {
          '生效中': 'green',
          '已过期': 'orange',
          '未生效': 'blue',
          '已作废': 'red'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
            disabled={record.status !== '未生效'}
          >
            编辑
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record, true)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 表单提交
  const onFinish = (values) => {
    setLoading(true);
    console.log('提交的筛选条件: ', values);
    // 这里应该调用API进行筛选查询
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 重置表单
  const handleReset = () => {
    filterForm.resetFields();
  };

  // 处理编辑操作
  const handleEdit = (record, isReadOnly = false) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      supplierId: record.supplierId,
      supplierName: record.supplierName,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
      remarks: record.remarks,
      items: record.items
    });
    setModalVisible(true);
  };

  // 处理新建操作
  const handleAdd = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      startDate: moment(),
      endDate: moment().add(1, 'month').subtract(1, 'day'),
      items: [
        { oilType: '92#汽油', unitPrice: 0, taxRate: 0.13, afterTaxPrice: 0 },
        { oilType: '95#汽油', unitPrice: 0, taxRate: 0.13, afterTaxPrice: 0 },
        { oilType: '98#汽油', unitPrice: 0, taxRate: 0.13, afterTaxPrice: 0 },
        { oilType: '0#柴油', unitPrice: 0, taxRate: 0.13, afterTaxPrice: 0 }
      ]
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        // 这里处理表单提交
        message.success('保存成功');
        setModalVisible(false);
        fetchData(); // 刷新数据
      })
      .catch(info => {
        console.log('验证失败:', info);
      });
  };

  // 价格明细表格列配置
  const priceItemColumns = [
    {
      title: '油品品种',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 150,
    },
    {
      title: '含税单价(元/升)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={['items', index, 'unitPrice']}
          noStyle
        >
          <InputNumber
            min={0}
            precision={2}
            style={{ width: '100%' }}
            onChange={(value) => handlePriceChange(index, value)}
          />
        </Form.Item>
      ),
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      key: 'taxRate',
      width: 100,
      render: (text) => `${(text * 100).toFixed(0)}%`,
    },
    {
      title: '税后单价(元/升)',
      dataIndex: 'afterTaxPrice',
      key: 'afterTaxPrice',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={['items', index, 'afterTaxPrice']}
          noStyle
        >
          <InputNumber
            min={0}
            precision={2}
            style={{ width: '100%' }}
            disabled
          />
        </Form.Item>
      ),
    }
  ];

  // 处理价格变化，自动计算税后价格
  const handlePriceChange = (index, value) => {
    const items = form.getFieldValue('items');
    const taxRate = items[index].taxRate;
    const afterTaxPrice = value ? (value * (1 + taxRate)).toFixed(2) : 0;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      unitPrice: value,
      afterTaxPrice: parseFloat(afterTaxPrice)
    };
    form.setFieldsValue({ items: newItems });
  };

  return (
    <div className="oil-purchase-price-management-container">
      {/* 筛选表单 */}
      <Form 
        form={filterForm}
        layout="inline"
        onFinish={onFinish}
        style={{ marginBottom: '16px', padding: '16px 0' }}
      >
        <Form.Item name="keyword" label="关键字">
          <Input placeholder="单号/供应商" allowClear />
        </Form.Item>
        <Form.Item name="dateRange" label="生效日期">
          <RangePicker />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" allowClear style={{ width: 160 }}>
            <Option value="生效中">生效中</Option>
            <Option value="已过期">已过期</Option>
            <Option value="未生效">未生效</Option>
            <Option value="已作废">已作废</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 表格 */}
      <Table 
        columns={columns}
        dataSource={priceData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      {/* 编辑/新建弹窗 */}
      <Modal
        title={currentRecord ? (currentRecord.status !== '未生效' ? '查看油品价格' : '编辑油品价格') : '新建油品价格'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
        footer={currentRecord && currentRecord.status !== '未生效' ? [
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ] : [
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
            保存
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplierName"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select 
                  placeholder="请选择供应商"
                  disabled={currentRecord && currentRecord.status !== '未生效'}
                >
                  <Option value="中石化北京分公司">中石化北京分公司</Option>
                  <Option value="中石油江西分公司">中石油江西分公司</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="生效日期"
                rules={[{ required: true, message: '请选择生效日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabled={currentRecord && currentRecord.status !== '未生效'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="失效日期"
                rules={[{ required: true, message: '请选择失效日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabled={currentRecord && currentRecord.status !== '未生效'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input 
                  placeholder="请输入备注信息"
                  disabled={currentRecord && currentRecord.status !== '未生效'}
                />
              </Form.Item>
            </Col>
          </Row>
          
          {/* 价格明细表格 */}
          <Form.List name="items">
            {(fields) => (
              <div style={{ marginTop: 16 }}>
                <div className="table-title">油品价格明细</div>
                <Table
                  columns={priceItemColumns}
                  dataSource={fields.map(field => {
                    return {
                      ...field,
                      ...form.getFieldValue('items')[field.name],
                      key: field.key
                    };
                  })}
                  pagination={false}
                  rowKey="key"
                  size="small"
                  bordered
                />
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default OilPurchasePriceManagement; 