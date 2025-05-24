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
  Tabs,
  Tag,
  Popconfirm,
  Descriptions
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  EyeOutlined,
  StopOutlined,
  CheckOutlined,
  SendOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ExportOutlined,
  FilePdfOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import InquiryForm from './InquiryForm';
import QuotationDetail from './QuotationDetail';

// 导入模拟数据
import inquiryData from '../../../mock/purchase/oil-inquiry/inquiryData.json';
import quotationData from '../../../mock/purchase/oil-inquiry/quotationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { confirm } = Modal;

const OilInquiryManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [filterForm] = Form.useForm();
  const [quotationFilterForm] = Form.useForm();
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('create'); // create, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [quotationDetailVisible, setQuotationDetailVisible] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [inquiryReportVisible, setInquiryReportVisible] = useState(false);
  const [reportData, setReportData] = useState([]);

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setData(inquiryData);
      setQuotations(quotationData);
      setLoading(false);
    }, 500);
  };

  // 状态对应的标签颜色
  const getStatusColor = (status) => {
    const colorMap = {
      '草稿': 'default',
      '待发布': 'blue',
      '询价中': 'geekblue',
      '已取消': 'red',
      '报价结束': 'orange',
      '询价完成': 'green',
      '待确认': 'blue',
      '已接受': 'green',
      '已拒绝': 'red',
      '中标报价单': 'gold'
    };
    return colorMap[status] || 'default';
  };

  // 询价单列表列配置
  const inquiryColumns = [
    {
      title: '询价单ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '询价单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '油品名称',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 120,
    },
    {
      title: '预计采购数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (quantity) => `${quantity} L`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} className="status-tag">
          {status}
        </Tag>
      ),
    },
    {
      title: '报价开始时间',
      dataIndex: 'quoteStartTime',
      key: 'quoteStartTime',
      width: 160,
    },
    {
      title: '报价结束时间',
      dataIndex: 'quoteEndTime',
      key: 'quoteEndTime',
      width: 160,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => {
        const { status } = record;
        
        // 根据状态显示不同的操作按钮
        switch (status) {
          case '草稿':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                  编辑
                </Button>
                <Popconfirm
                  title="确定要删除此询价单吗？"
                  onConfirm={() => handleDelete(record)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger size="small" icon={<StopOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            );
          case '待发布':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                  编辑
                </Button>
                <Button type="primary" size="small" icon={<SendOutlined />} onClick={() => handlePublish(record)}>
                  发布询价
                </Button>
              </Space>
            );
          case '询价中':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                  查看
                </Button>
                <Button size="small" icon={<StopOutlined />} onClick={() => handleStopInquiry(record)}>
                  中止询价
                </Button>
                <Button size="small" icon={<FileTextOutlined />} onClick={() => handleViewQuotationDetails(record)}>
                  报价单明细
                </Button>
              </Space>
            );
          case '已取消':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                  编辑
                </Button>
              </Space>
            );
          case '报价结束':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                  查看
                </Button>
                <Button size="small" icon={<StopOutlined />} onClick={() => handleStopInquiry(record)}>
                  中止询价
                </Button>
                <Button size="small" icon={<FileTextOutlined />} onClick={() => handleViewQuotationDetails(record)}>
                  报价单明细
                </Button>
                <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleCompleteInquiry(record)}>
                  询价完成
                </Button>
              </Space>
            );
          case '询价完成':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                  查看
                </Button>
                <Button size="small" icon={<FileTextOutlined />} onClick={() => handleViewQuotationDetails(record)}>
                  报价单明细
                </Button>
                <Button type="primary" size="small" icon={<FileExcelOutlined />} onClick={() => handleViewInquiryReport(record)}>
                  导出询价报告
                </Button>
              </Space>
            );
          default:
            return null;
        }
      },
    },
  ];

  // 报价单列表列配置
  const quotationColumns = [
    {
      title: '报价单ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '询价单ID',
      dataIndex: 'inquiryId',
      key: 'inquiryId',
      width: 150,
    },
    {
      title: '询价单名称',
      dataIndex: 'inquiryName',
      key: 'inquiryName',
      width: 180,
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 180,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 120,
    },
    {
      title: '油品单价（元/吨,不含运费）',
      dataIndex: 'oilUnitPrice',
      key: 'oilUnitPrice',
      width: 180,
      sorter: (a, b) => a.oilUnitPrice - b.oilUnitPrice,
      render: (price) => `${price?.toLocaleString() || 0}`,
    },
    {
      title: '运费单价(元/吨)',
      dataIndex: 'freightUnitPrice',
      key: 'freightUnitPrice',
      width: 140,
      sorter: (a, b) => a.freightUnitPrice - b.freightUnitPrice,
      render: (price) => `${price?.toLocaleString() || 0}`,
    },
    {
      title: '到站单价（元/吨）',
      dataIndex: 'stationUnitPrice',
      key: 'stationUnitPrice',
      width: 150,
      sorter: (a, b) => a.stationUnitPrice - b.stationUnitPrice,
      render: (price) => `${price?.toLocaleString() || 0}`,
    },
    {
      title: '数量(吨)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: '总金额（元）',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ['ascend', 'descend'],
      render: (amount) => `${(amount / 100)?.toLocaleString() || 0}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} className="status-tag">
          {status}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewQuotation(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 表单查询处理
  const onFinish = (values) => {
    setLoading(true);
    console.log('查询参数:', values);
    
    // 模拟查询请求
    setTimeout(() => {
      // 这里应该是根据筛选条件过滤数据的逻辑
      // 目前是简单地重新获取所有数据
      fetchData();
    }, 500);
  };

  // 重置表单
  const handleReset = () => {
    filterForm.resetFields();
    fetchData();
  };

  // 编辑询价单
  const handleEdit = (record) => {
    setCurrentRecord(record);
    setFormMode('edit');
    setFormVisible(true);
  };

  // 查看询价单
  const handleView = (record) => {
    setCurrentRecord(record);
    setFormMode('view');
    setFormVisible(true);
  };

  // 删除询价单
  const handleDelete = (record) => {
    const newData = data.filter(item => item.id !== record.id);
    setData(newData);
    message.success(`已删除询价单 ${record.id}`);
  };

  // 发布询价
  const handlePublish = (record) => {
    message.success(`已发布询价单 ${record.id}`);
    // 这里应该有更新状态的逻辑
    const newData = data.map(item => {
      if (item.id === record.id) {
        return { ...item, status: '询价中' };
      }
      return item;
    });
    setData(newData);
  };

  // 中止询价
  const handleStopInquiry = (record) => {
    confirm({
      title: '确定要中止此询价吗？',
      icon: <ExclamationCircleOutlined />,
      content: `询价单 ${record.id} 将被中止`,
      onOk() {
        message.success(`已中止询价单 ${record.id}`);
        // 这里应该有更新状态的逻辑
        const newData = data.map(item => {
          if (item.id === record.id) {
            return { ...item, status: '已取消' };
          }
          return item;
        });
        setData(newData);
      },
    });
  };

  // 询价完成
  const handleCompleteInquiry = (record) => {
    // 检查是否有报价单
    const relatedQuotations = quotations.filter(q => q.inquiryId === record.id);
    if (relatedQuotations.length === 0) {
      message.error('该询价单暂无报价，无法完成询价');
      return;
    }

    // 检查是否已选择中标报价
    const winnerQuotation = relatedQuotations.find(q => q.status === '中标报价单');
    if (!winnerQuotation) {
      message.error('请先选择中标报价单');
      return;
    }

    confirm({
      title: '确定要完成此询价吗？',
      icon: <ExclamationCircleOutlined />,
      content: `询价单 ${record.id} 将标记为完成状态`,
      onOk() {
        message.success(`询价单 ${record.id} 已完成`);
        const newData = data.map(item => {
          if (item.id === record.id) {
            return { 
              ...item, 
              status: '询价完成',
              completedTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              winnerSupplier: winnerQuotation.supplierName,
              finalPrice: winnerQuotation.totalPrice
            };
          }
          return item;
        });
        setData(newData);
      },
    });
  };

  // 查看报价单
  const handleViewQuotation = (record) => {
    setCurrentQuotation(record);
    setQuotationDetailVisible(true);
  };

  // 接受报价
  const handleAcceptQuotation = (record) => {
    const newQuotations = quotations.map(item => {
      if (item.id === record.id) {
        return { ...item, status: '已接受' };
      }
      return item;
    });
    
    setQuotations(newQuotations);
    setQuotationDetailVisible(false);
    message.success(`已接受报价单: ${record.id}`);
  };

  // 拒绝报价
  const handleRejectQuotation = (record, reason) => {
    const newQuotations = quotations.map(item => {
      if (item.id === record.id) {
        return { ...item, status: '已拒绝', rejectReason: reason };
      }
      return item;
    });
    
    setQuotations(newQuotations);
    setQuotationDetailVisible(false);
    message.success(`已拒绝报价单: ${record.id}`);
  };

  // 确认中标报价
  const handleConfirmWinner = (record) => {
    // 先检查同一询价单下是否已有中标报价
    const hasWinner = quotations.some(item => 
      item.inquiryId === record.inquiryId && 
      item.status === '中标报价单' && 
      item.id !== record.id
    );

    if (hasWinner) {
      message.error(`询价单 ${record.inquiryId} 已有中标报价，不能重复设置`);
      return;
    }

    // 更新状态为中标报价单
    const newQuotations = quotations.map(item => {
      if (item.id === record.id) {
        return { ...item, status: '中标报价单' };
      }
      return item;
    });
    
    setQuotations(newQuotations);
    setQuotationDetailVisible(false);
    message.success(`已确认 ${record.id} 为中标报价单`);
  };

  // 导出报价单
  const handleExportQuotations = () => {
    message.success('报价单导出成功');
    // 实际实现应该是发送请求下载报价单数据
  };

  // 查看询价报告
  const handleViewInquiryReport = (record) => {
    // 获取与此询价单关联的所有报价单
    const relatedQuotations = quotations.filter(q => q.inquiryId === record.id);
    
    if (relatedQuotations.length === 0) {
      message.info('暂无报价单数据，无法生成询价报告');
      return;
    }

    // 设置报告数据
    setReportData({
      inquiry: record,
      quotations: relatedQuotations,
      winnerQuotation: relatedQuotations.find(q => q.status === '中标报价单') || null
    });
    
    // 显示询价报告弹窗
    setInquiryReportVisible(true);
  };

  // 查看报价明细
  const handleViewQuotationDetails = (record) => {
    // 获取与此询价单关联的所有报价单
    const relatedQuotations = quotations.filter(q => q.inquiryId === record.id);
    
    if (relatedQuotations.length === 0) {
      message.info('暂无报价单');
      return;
    }
    
    // 切换到报价单Tab页
    setActiveTab('2');
    
    // 设置筛选条件
    quotationFilterForm.setFieldsValue({
      inquiryId: record.id
    });
    
    // 手动触发查询
    quotationFilterForm.submit();
  };

  // 报价单筛选查询
  const onQuotationFinish = (values) => {
    setLoading(true);
    console.log('报价单查询参数:', values);
    
    // 模拟查询请求
    setTimeout(() => {
      let filteredData = [...quotationData];
      
      if (values.id) {
        filteredData = filteredData.filter(item => 
          item.id.toLowerCase().includes(values.id.toLowerCase())
        );
      }
      
      if (values.inquiryId) {
        filteredData = filteredData.filter(item => 
          item.inquiryId.toLowerCase().includes(values.inquiryId.toLowerCase())
        );
      }
      
      if (values.supplierName) {
        filteredData = filteredData.filter(item => 
          item.supplierName.toLowerCase().includes(values.supplierName.toLowerCase())
        );
      }
      
      if (values.oilType) {
        filteredData = filteredData.filter(item => item.oilType === values.oilType);
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => item.status === values.status);
      }
      
      setQuotations(filteredData);
      setLoading(false);
    }, 500);
  };

  // 重置报价单筛选表单
  const handleQuotationReset = () => {
    quotationFilterForm.resetFields();
    setQuotations(quotationData);
  };

  // 创建询价单
  const handleCreate = () => {
    setCurrentRecord(null);
    setFormMode('create');
    setFormVisible(true);
  };

  // 表单提交处理
  const handleFormSubmit = (values, mode) => {
    console.log('表单提交值:', values);
    
    if (mode === 'create') {
      // 创建新询价单
      const newRecord = {
        ...values,
        id: values.id || `INQ${moment().format('YYYYMMDDHHmmss')}`,
        createTime: values.createTime || moment().format('YYYY-MM-DD HH:mm:ss'),
        createdBy: values.createdBy || '当前用户'
      };
      
      setData([newRecord, ...data]);
      message.success(`创建询价单成功: ${newRecord.id}`);
    } else if (mode === 'edit') {
      // 更新询价单
      const newData = data.map(item => {
        if (item.id === values.id) {
          return { ...item, ...values };
        }
        return item;
      });
      
      setData(newData);
      message.success(`更新询价单成功: ${values.id}`);
    }
    
    setFormVisible(false);
  };

  // Tab页切换处理
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="tab-container">
        <TabPane tab="油品询价管理" key="1">
          {/* 询价单筛选表单 */}
          <div className="form-section">
            <Form
              form={filterForm}
              layout="inline"
              onFinish={onFinish}
              initialValues={{}}
            >
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                <Col span={6}>
                  <Form.Item name="inquiryId" label="询价单ID">
                    <Input placeholder="请输入询价单ID" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="inquiryName" label="询价单名称">
                    <Input placeholder="请输入询价单名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="dateRange" label="报价时间" labelCol={{ style: { marginRight: '12px' } }}>
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="status" label="状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="草稿">草稿</Option>
                      <Option value="待发布">待发布</Option>
                      <Option value="询价中">询价中</Option>
                      <Option value="已取消">已取消</Option>
                      <Option value="报价结束">报价结束</Option>
                      <Option value="询价完成">询价完成</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        查询
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={handleReset}>
                        重置
                      </Button>
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        创建询价单
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            className="inquiry-table"
            columns={inquiryColumns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
        
        <TabPane tab="报价单" key="2">
          <div className="form-section">
            <Form
              form={quotationFilterForm}
              layout="inline"
              onFinish={onQuotationFinish}
              initialValues={{}}
            >
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                <Col span={6}>
                  <Form.Item name="id" label="报价单ID">
                    <Input placeholder="请输入报价单ID" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="inquiryId" label="询价单ID">
                    <Input placeholder="请输入询价单ID" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="supplierName" label="供应商名称">
                    <Input placeholder="请输入供应商名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="oilType" label="油品类型">
                    <Select placeholder="请选择油品类型" allowClear>
                      <Option value="92#汽油">92#汽油</Option>
                      <Option value="95#汽油">95#汽油</Option>
                      <Option value="98#汽油">98#汽油</Option>
                      <Option value="0#柴油">0#柴油</Option>
                      <Option value="尿素">尿素</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="status" label="状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="待确认">待确认</Option>
                      <Option value="已接受">已接受</Option>
                      <Option value="已拒绝">已拒绝</Option>
                      <Option value="中标报价单">中标报价单</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        查询
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={handleQuotationReset}>
                        重置
                      </Button>
                      <Button type="primary" icon={<ExportOutlined />} onClick={handleExportQuotations}>
                        导出报价单
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            className="inquiry-table"
            columns={quotationColumns}
            dataSource={quotations}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            onChange={(pagination, filters, sorter) => {
              console.log('排序参数:', sorter);
            }}
          />
        </TabPane>
      </Tabs>

      {/* 询价单表单 */}
      <InquiryForm
        visible={formVisible}
        record={currentRecord}
        mode={formMode}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleFormSubmit}
      />

      {/* 报价单详情 */}
      <QuotationDetail
        visible={quotationDetailVisible}
        record={currentQuotation}
        onCancel={() => setQuotationDetailVisible(false)}
        onAccept={handleAcceptQuotation}
        onReject={handleRejectQuotation}
        onConfirmWinner={handleConfirmWinner}
      />

      {/* 询价报告弹窗 */}
      <Modal
        title="询价报告"
        open={inquiryReportVisible}
        onCancel={() => setInquiryReportVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setInquiryReportVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="export" 
            type="primary" 
            icon={<FileExcelOutlined />}
            onClick={() => {
              message.success('询价报告已导出为Excel文件');
              setInquiryReportVisible(false);
            }}
          >
            导出询价报告
          </Button>
        ]}
      >
        {reportData && (
          <div className="inquiry-report">
            <div className="report-header">
              <h2>{reportData.inquiry?.name} - 询价报告</h2>
              <p>询价单ID: {reportData.inquiry?.id}</p>
              <p>油品类型: {reportData.inquiry?.oilType}</p>
              <p>预计采购数量: {reportData.inquiry?.quantity} L</p>
              <p>报价时间: {reportData.inquiry?.quoteStartTime} 至 {reportData.inquiry?.quoteEndTime}</p>
            </div>
            
            <div className="report-body">
              <h3>报价单汇总</h3>
              <Table
                columns={[
                  {
                    title: '供应商名称',
                    dataIndex: 'supplierName',
                    key: 'supplierName',
                    width: 180,
                  },
                  {
                    title: '报价时间',
                    dataIndex: 'submitTime',
                    key: 'submitTime',
                    width: 150,
                  },
                  {
                    title: '油品单价（元/吨,不含运费）',
                    dataIndex: 'oilUnitPrice',
                    key: 'oilUnitPrice',
                    width: 180,
                    sorter: (a, b) => a.oilUnitPrice - b.oilUnitPrice,
                    render: (price) => `${price?.toLocaleString() || 0}`,
                  },
                  {
                    title: '运费单价(元/吨)',
                    dataIndex: 'freightUnitPrice',
                    key: 'freightUnitPrice',
                    width: 140,
                    render: (price) => `${price?.toLocaleString() || 0}`,
                  },
                  {
                    title: '到站单价（元/吨）',
                    dataIndex: 'stationUnitPrice',
                    key: 'stationUnitPrice',
                    width: 150,
                    sorter: (a, b) => a.stationUnitPrice - b.stationUnitPrice,
                    render: (price) => `${price?.toLocaleString() || 0}`,
                  },
                  {
                    title: '交货时间',
                    dataIndex: 'deliveryTime',
                    key: 'deliveryTime',
                    width: 150,
                  },
                  {
                    title: '交货地点',
                    dataIndex: 'deliveryAddress',
                    key: 'deliveryAddress',
                    width: 200,
                  },
                  {
                    title: '总金额（元）',
                    dataIndex: 'totalAmount',
                    key: 'totalAmount',
                    width: 150,
                    sorter: (a, b) => a.totalAmount - b.totalAmount,
                    render: (amount) => `${(amount / 100)?.toLocaleString() || 0}`,
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    width: 100,
                    render: (status) => (
                      <Tag color={getStatusColor(status)} className="status-tag">
                        {status}
                      </Tag>
                    ),
                  }
                ]}
                dataSource={reportData.quotations}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content' }}
                size="small"
              />
              
              {reportData.winnerQuotation && (
                <div className="winner-section">
                  <h3>中标供应商信息</h3>
                  <Descriptions bordered size="small" column={2}>
                    <Descriptions.Item label="供应商名称" span={2}>{reportData.winnerQuotation.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="联系人">{reportData.winnerQuotation.contactPerson || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{reportData.winnerQuotation.contactPhone || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="电子邮箱" span={2}>{reportData.winnerQuotation.contactEmail || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="油品单价（元/吨,不含运费）">{reportData.winnerQuotation.oilUnitPrice?.toLocaleString() || 0}</Descriptions.Item>
                    <Descriptions.Item label="运费单价(元/吨)">{reportData.winnerQuotation.freightUnitPrice?.toLocaleString() || 0}</Descriptions.Item>
                    <Descriptions.Item label="到站单价（元/吨）">{reportData.winnerQuotation.stationUnitPrice?.toLocaleString() || 0}</Descriptions.Item>
                    <Descriptions.Item label="中标数量(吨)">{reportData.winnerQuotation.quantity}</Descriptions.Item>
                    <Descriptions.Item label="到货时间">{reportData.winnerQuotation.deliveryTime}</Descriptions.Item>
                    <Descriptions.Item label="交货地点">{reportData.winnerQuotation.deliveryAddress}</Descriptions.Item>
                    <Descriptions.Item label="总金额（元）">{(reportData.winnerQuotation.totalAmount / 100)?.toLocaleString() || 0}</Descriptions.Item>
                    <Descriptions.Item label="备注" span={1}>{reportData.winnerQuotation.remarks || '无'}</Descriptions.Item>
                  </Descriptions>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OilInquiryManagement; 