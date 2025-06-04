import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Table, 
  Row, 
  Col, 
  Space, 
  Tooltip, 
  Tag,
  message,
  Modal,
  InputNumber,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 售价调整申请页面
const PriceAdjustment = () => {
  const [loading, setLoading] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [adjustmentForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新建售价调整申请');
  const [editingRecord, setEditingRecord] = useState(null);
  const [goodsList, setGoodsList] = useState([]);

  // 组件加载时获取数据
  useEffect(() => {
    fetchAdjustmentData();
    fetchGoodsList();
  }, [pagination.current, pagination.pageSize]);

  // 获取售价调整数据
  const fetchAdjustmentData = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setAdjustmentData(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取售价调整申请失败:', error);
      message.error('获取售价调整申请失败');
      setLoading(false);
    }
  };

  // 获取商品列表
  const fetchGoodsList = () => {
    // 模拟API请求
    setTimeout(() => {
      const goodsTypes = ['饮料', '零食', '香烟', '日用品', '汽车用品'];
      const goodsNames = [
        ['可口可乐', '百事可乐', '雪碧', '芬达', '农夫山泉'],
        ['薯片', '饼干', '巧克力', '糖果', '坚果'],
        ['中华', '万宝路', '玉溪', '黄鹤楼', '利群'],
        ['洗发水', '沐浴露', '牙膏', '洗衣液', '纸巾'],
        ['机油', '玻璃水', '车载香水', '车载充电器', '车载吸尘器']
      ];
      
      const list = [];
      for (let i = 0; i < 25; i++) {
        const typeIndex = Math.floor(i / 5);
        const nameIndex = i % 5;
        list.push({
          id: `G${String(i + 1).padStart(6, '0')}`,
          goodsType: goodsTypes[typeIndex],
          goodsName: goodsNames[typeIndex][nameIndex],
          currentPrice: ((Math.random() * 100) + 5).toFixed(2)
        });
      }
      setGoodsList(list);
    }, 500);
  };

  // 生成模拟数据
  const generateMockData = () => {
    const data = [];
    const total = 35;
    const pageSize = pagination.pageSize;
    const current = pagination.current;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const statuses = ['待审批', '已通过', '已拒绝', '已取消'];

    for (let i = 0; i < total; i++) {
      if (i >= startIndex && i < endIndex) {
        const applyDate = moment().subtract(i % 30, 'days').format('YYYY-MM-DD');
        const effectiveDate = moment(applyDate).add(7, 'days').format('YYYY-MM-DD');
        const goodsTypes = ['饮料', '零食', '香烟', '日用品', '汽车用品'];
        const goodsNames = [
          ['可口可乐', '百事可乐', '雪碧', '芬达', '农夫山泉'],
          ['薯片', '饼干', '巧克力', '糖果', '坚果'],
          ['中华', '万宝路', '玉溪', '黄鹤楼', '利群'],
          ['洗发水', '沐浴露', '牙膏', '洗衣液', '纸巾'],
          ['机油', '玻璃水', '车载香水', '车载充电器', '车载吸尘器']
        ];
        
        const typeIndex = i % 5;
        const nameIndex = i % 5;
        const status = statuses[i % 4];
        
        data.push({
          id: `PA${String(i + 1).padStart(6, '0')}`,
          applyDate,
          effectiveDate,
          goodsType: goodsTypes[typeIndex],
          goodsName: goodsNames[typeIndex][nameIndex],
          oldPrice: ((Math.random() * 100) + 5).toFixed(2),
          newPrice: ((Math.random() * 100) + 10).toFixed(2),
          adjustmentReason: `价格调整原因${i + 1}`,
          status,
          applicant: `申请人${i % 5 + 1}`,
          approver: status === '待审批' ? '-' : `审批人${i % 3 + 1}`,
          approvalDate: status === '待审批' ? '-' : moment(applyDate).add(3, 'days').format('YYYY-MM-DD')
        });
      }
    }

    return {
      data,
      total
    };
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setPagination({
      ...pagination,
      current: 1
    });
    fetchAdjustmentData();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    fetchAdjustmentData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 新建售价调整申请
  const handleAdd = () => {
    setModalTitle('新建售价调整申请');
    setEditingRecord(null);
    adjustmentForm.resetFields();
    setModalVisible(true);
  };

  // 编辑售价调整申请
  const handleEdit = (record) => {
    setModalTitle('编辑售价调整申请');
    setEditingRecord(record);
    adjustmentForm.setFieldsValue({
      goodsId: record.id,
      oldPrice: record.oldPrice,
      newPrice: record.newPrice,
      effectiveDate: moment(record.effectiveDate),
      adjustmentReason: record.adjustmentReason
    });
    setModalVisible(true);
  };

  // 删除售价调整申请
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除申请 ${record.id} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success(`申请 ${record.id} 已删除`);
        fetchAdjustmentData();
      }
    });
  };

  // 查看详情
  const handleViewDetail = (record) => {
    message.info(`查看申请 ${record.id} 的详情`);
  };

  // 取消申请
  const handleCancel = (record) => {
    Modal.confirm({
      title: '确认取消',
      content: `确定要取消申请 ${record.id} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success(`申请 ${record.id} 已取消`);
        fetchAdjustmentData();
      }
    });
  };

  // 提交表单
  const handleSubmit = () => {
    adjustmentForm.validateFields().then(values => {
      console.log('表单数据:', values);
      setModalVisible(false);
      message.success(editingRecord ? '售价调整申请已更新' : '售价调整申请已创建');
      fetchAdjustmentData();
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '待审批':
        return <Tag color="blue">待审批</Tag>;
      case '已通过':
        return <Tag color="green">已通过</Tag>;
      case '已拒绝':
        return <Tag color="red">已拒绝</Tag>;
      case '已取消':
        return <Tag color="default">已取消</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '申请编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
      render: (text, record) => <a onClick={() => handleViewDetail(record)}>{text}</a>
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 120
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 150
    },
    {
      title: '原价(元)',
      dataIndex: 'oldPrice',
      key: 'oldPrice',
      width: 100,
      align: 'right'
    },
    {
      title: '新价(元)',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 100,
      align: 'right'
    },
    {
      title: '调整原因',
      dataIndex: 'adjustmentReason',
      key: 'adjustmentReason',
      width: 200,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => getStatusTag(text)
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100
    },
    {
      title: '审批日期',
      dataIndex: 'approvalDate',
      key: 'approvalDate',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {record.status === '待审批' && (
            <>
              <Tooltip title="编辑">
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip title="取消">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => handleCancel(record)}
                  danger
                />
              </Tooltip>
            </>
          )}
          {(record.status === '已拒绝' || record.status === '已取消') && (
            <Tooltip title="删除">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(record)}
                danger
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="price-adjustment-search-form">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="id" label="申请编号">
              <Input placeholder="请输入申请编号" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="申请日期">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="goodsType" label="商品类型">
              <Select placeholder="请选择商品类型" allowClear>
                <Option value="饮料">饮料</Option>
                <Option value="零食">零食</Option>
                <Option value="香烟">香烟</Option>
                <Option value="日用品">日用品</Option>
                <Option value="汽车用品">汽车用品</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="goodsName" label="商品名称">
              <Input placeholder="请输入商品名称" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" allowClear>
                <Option value="待审批">待审批</Option>
                <Option value="已通过">已通过</Option>
                <Option value="已拒绝">已拒绝</Option>
                <Option value="已取消">已取消</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="applicant" label="申请人">
              <Input placeholder="请输入申请人" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新建申请
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 渲染调整申请表单
  const renderAdjustmentForm = () => (
    <Modal
      title={modalTitle}
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      onOk={handleSubmit}
      width={600}
      maskClosable={false}
    >
      <Form
        form={adjustmentForm}
        layout="vertical"
      >
        <Form.Item
          name="goodsId"
          label="商品"
          rules={[{ required: true, message: '请选择商品' }]}
        >
          <Select 
            placeholder="请选择商品"
            showSearch
            optionFilterProp="children"
          >
            {goodsList.map(item => (
              <Option key={item.id} value={item.id}>
                {item.goodsName} ({item.goodsType}) - 当前价格: ¥{item.currentPrice}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="oldPrice"
              label="原价(元)"
              rules={[{ required: true, message: '请输入原价' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0.01} 
                precision={2}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="newPrice"
              label="新价(元)"
              rules={[
                { required: true, message: '请输入新价' },
                { type: 'number', min: 0.01, message: '价格必须大于0' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0.01} 
                precision={2}
                placeholder="请输入新价格"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="effectiveDate"
          label="生效日期"
          rules={[{ required: true, message: '请选择生效日期' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            disabledDate={current => current && current < moment().startOf('day')}
          />
        </Form.Item>
        <Form.Item
          name="adjustmentReason"
          label="调整原因"
          rules={[{ required: true, message: '请输入调整原因' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="请输入调整原因"
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="price-adjustment">
      {renderSearchForm()}
      
      <Table
        className="price-adjustment-table"
        columns={columns}
        dataSource={adjustmentData}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1500 }}
      />
      
      {renderAdjustmentForm()}
    </div>
  );
};

export default PriceAdjustment; 