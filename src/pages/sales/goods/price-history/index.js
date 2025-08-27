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
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  EyeOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 售价调价记录页面
const PriceHistory = () => {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 组件加载时获取数据
  useEffect(() => {
    fetchHistoryData();
  }, [pagination.current, pagination.pageSize]);

  // 获取调价记录数据
  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setHistoryData(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取售价调价记录失败:', error);
      message.error('获取售价调价记录失败');
      setLoading(false);
    }
  };

  // 生成模拟数据
  const generateMockData = () => {
    const data = [];
    const total = 65;
    const pageSize = pagination.pageSize;
    const current = pagination.current;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    for (let i = 0; i < total; i++) {
      if (i >= startIndex && i < endIndex) {
        const applyDate = moment().subtract(i % 30, 'days').format('YYYY-MM-DD');
        const effectiveDate = moment(applyDate).add(7, 'days').format('YYYY-MM-DD');
        const approvalDate = moment(applyDate).add(3, 'days').format('YYYY-MM-DD');
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
        
        data.push({
          id: `PA${String(i + 1).padStart(6, '0')}`,
          applyDate,
          effectiveDate,
          approvalDate,
          goodsType: goodsTypes[typeIndex],
          goodsName: goodsNames[typeIndex][nameIndex],
          oldPrice: ((Math.random() * 100) + 5).toFixed(2),
          newPrice: ((Math.random() * 100) + 10).toFixed(2),
          adjustmentReason: `价格调整原因${i + 1}`,
          applicant: `申请人${i % 5 + 1}`,
          approver: `审批人${i % 3 + 1}`,
          adjustmentType: i % 3 === 0 ? '上调' : (i % 3 === 1 ? '下调' : '首次定价'),
          adjustmentRate: ((Math.random() * 20) - 10).toFixed(2) + '%'
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
    fetchHistoryData();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    fetchHistoryData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  // 打印记录
  const handlePrint = (record) => {
    message.success(`打印调价记录 ${record.id}`);
  };

  // 导出数据
  const handleExport = () => {
    message.success('导出售价调价记录数据');
  };

  // 获取调整类型标签
  const getAdjustmentTypeTag = (type) => {
    switch (type) {
      case '上调':
        return <Tag color="red">上调</Tag>;
      case '下调':
        return <Tag color="green">下调</Tag>;
      case '首次定价':
        return <Tag color="blue">首次定价</Tag>;
      default:
        return <Tag color="default">{type}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '记录编号',
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
      title: '调整类型',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      width: 100,
      render: (text) => getAdjustmentTypeTag(text)
    },
    {
      title: '调整幅度',
      dataIndex: 'adjustmentRate',
      key: 'adjustmentRate',
      width: 100,
      render: (text) => {
        const value = parseFloat(text);
        return <span style={{ color: value > 0 ? 'red' : (value < 0 ? 'green' : 'inherit') }}>{text}</span>;
      }
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
      width: 100,
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
          <Tooltip title="打印记录">
            <Button 
              type="text" 
              icon={<PrinterOutlined />} 
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="price-history-search-form">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="id" label="记录编号">
              <Input placeholder="请输入记录编号" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="申请日期">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="effectiveDateRange" label="生效日期">
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
            <Form.Item name="adjustmentType" label="调整类型">
              <Select placeholder="请选择调整类型" allowClear>
                <Option value="上调">上调</Option>
                <Option value="下调">下调</Option>
                <Option value="首次定价">首次定价</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="applicant" label="申请人">
              <Input placeholder="请输入申请人" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="approver" label="审批人">
              <Input placeholder="请输入审批人" allowClear />
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
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 渲染详情弹窗
  const renderDetailModal = () => {
    if (!currentRecord) return null;
    
    return (
      <Modal
        title="调价记录详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => handlePrint(currentRecord)}>
            打印记录
          </Button>,
          <Button key="close" type="primary" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
        className="price-history-detail-modal"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">记录编号:</span>
              <span className="detail-value">{currentRecord.id}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">调整类型:</span>
              <span className="detail-value">{getAdjustmentTypeTag(currentRecord.adjustmentType)}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">商品类型:</span>
              <span className="detail-value">{currentRecord.goodsType}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">商品名称:</span>
              <span className="detail-value">{currentRecord.goodsName}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">原价(元):</span>
              <span className="detail-value">{currentRecord.oldPrice}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">新价(元):</span>
              <span className="detail-value">{currentRecord.newPrice}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">调整幅度:</span>
              <span className="detail-value" style={{ 
                color: parseFloat(currentRecord.adjustmentRate) > 0 
                  ? 'red' 
                  : (parseFloat(currentRecord.adjustmentRate) < 0 ? 'green' : 'inherit') 
              }}>
                {currentRecord.adjustmentRate}
              </span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">申请日期:</span>
              <span className="detail-value">{currentRecord.applyDate}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">生效日期:</span>
              <span className="detail-value">{currentRecord.effectiveDate}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">审批日期:</span>
              <span className="detail-value">{currentRecord.approvalDate}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">申请人:</span>
              <span className="detail-value">{currentRecord.applicant}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="detail-item">
              <span className="detail-label">审批人:</span>
              <span className="detail-value">{currentRecord.approver}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className="detail-item">
              <span className="detail-label">调整原因:</span>
              <div className="detail-value" style={{ marginTop: 8 }}>
                {currentRecord.adjustmentReason}
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  };

  return (
    <div className="price-history">
      {renderSearchForm()}
      
      <Table
        className="price-history-table"
        columns={columns}
        dataSource={historyData}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1500 }}
      />
      
      {renderDetailModal()}
    </div>
  );
};

export default PriceHistory; 