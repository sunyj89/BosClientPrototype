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
import approvalData from '../../../mock/purchase/oil-inquiry/approvalData.json';
import quotationData from '../../../mock/purchase/oil-inquiry/quotationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { confirm } = Modal;

const OilInquiryManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [approvals, setApprovals] = useState({ pending: [], history: [] });
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
      // 扩展数据，增加供应商信息
      const extendedData = inquiryData.map(item => ({
        ...item,
        suppliers: [
          { id: 'SP001', name: '中石化北京分公司' },
          { id: 'SP002', name: '中石油华东分公司' }
        ],
        expectedDeliveryTime: '2024-06-01 10:00:00',
        deliveryAddress: '江西省南昌市高新区',
        maxPrice: 8500
      }));
      
      setData(extendedData);
      setApprovals({
        pending: approvalData.pendingApprovals,
        history: approvalData.approvalHistory
      });
      setQuotations(quotationData);
      setLoading(false);
    }, 500);
  };

  // 状态对应的标签颜色
  const getStatusColor = (status) => {
    const colorMap = {
      '草稿': 'default',
      '待审批': 'blue',
      '已审批': 'green',
      '已发布': 'cyan',
      '询价中': 'geekblue',
      '询价完成': 'purple',
      '已撤回': 'red',
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
          case '待审批':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                  查看
                </Button>
                <Button size="small" icon={<StopOutlined />} onClick={() => handleStopApproval(record)}>
                  中止审批
                </Button>
                <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleSubmitApproval(record)}>
                  提交审批
                </Button>
              </Space>
            );
          case '已审批':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                  查看
                </Button>
                <Button size="small" icon={<StopOutlined />} onClick={() => handleStopApproval(record)}>
                  中止审批
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
          case '已撤回':
            return (
              <Space size="small">
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                  查看
                </Button>
                <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                  编辑
                </Button>
                <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleSubmitApproval(record)}>
                  提交审批
                </Button>
              </Space>
            );
          default:
            return null;
        }
      },
    },
  ];

  // 审批记录列配置
  const approvalColumns = [
    {
      title: '审批ID',
      dataIndex: 'id',
      key: 'id',
      width: 160,
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
      width: 200,
    },
    {
      title: '油品名称',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 120,
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 100,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '待审批' ? 'blue' : 'green'} className="status-tag">
          {status}
        </Tag>
      ),
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewApproval(record)}>
          查看详情
        </Button>
      ),
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
      title: '单价(元/吨)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'descend',
    },
    {
      title: '数量(吨)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
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
    message.success(`已删除询价单: ${record.id}`);
    // 模拟删除后刷新数据
    const newData = data.filter(item => item.id !== record.id);
    setData(newData);
  };

  // 中止审批
  const handleStopApproval = (record) => {
    confirm({
      title: '确定要中止审批吗？',
      icon: <ExclamationCircleOutlined />,
      content: `询价单 ${record.id} 的审批将被中止`,
      onOk() {
        message.success(`已中止询价单 ${record.id} 的审批`);
        // 这里应该有更新状态的逻辑
        const newData = data.map(item => {
          if (item.id === record.id) {
            return { ...item, status: '草稿' };
          }
          return item;
        });
        setData(newData);
      },
    });
  };

  // 提交审批
  const handleSubmitApproval = (record) => {
    message.success(`已提交询价单 ${record.id} 的审批`);
    // 这里应该有更新状态的逻辑
    const newData = data.map(item => {
      if (item.id === record.id) {
        return { ...item, status: '待审批' };
      }
      return item;
    });
    setData(newData);
  };

  // 发布询价
  const handlePublish = (record) => {
    message.success(`已发布询价单 ${record.id}`);
    // 这里应该有更新状态的逻辑
    const newData = data.map(item => {
      if (item.id === record.id) {
        return { ...item, status: '已发布' };
      }
      return item;
    });
    setData(newData);
  };

  // 撤回询价
  const handleRevoke = (record) => {
    confirm({
      title: '确定要撤回此询价单吗？',
      icon: <ExclamationCircleOutlined />,
      content: `询价单 ${record.id} 将被撤回`,
      onOk() {
        message.success(`已撤回询价单 ${record.id}`);
        // 这里应该有更新状态的逻辑
        const newData = data.map(item => {
          if (item.id === record.id) {
            return { ...item, status: '已撤回' };
          }
          return item;
        });
        setData(newData);
      },
    });
  };

  // 查看审批详情
  const handleViewApproval = (record) => {
    // 找到对应的询价单
    const inquiryRecord = data.find(item => item.id === record.inquiryId);
    if (inquiryRecord) {
      setCurrentRecord(inquiryRecord);
      setFormMode('view');
      setFormVisible(true);
    } else {
      message.error(`找不到对应的询价单: ${record.inquiryId}`);
    }
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

  // 中止询价
  const handleStopInquiry = (record) => {
    confirm({
      title: '确定要中止询价吗？',
      icon: <ExclamationCircleOutlined />,
      content: `询价单 ${record.id} 的询价过程将被中止`,
      onOk() {
        message.success(`已中止询价单 ${record.id} 的询价过程`);
        const newData = data.map(item => {
          if (item.id === record.id) {
            return { ...item, status: '已撤回' };
          }
          return item;
        });
        setData(newData);
      },
    });
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
                      <Option value="待审批">待审批</Option>
                      <Option value="已审批">已审批</Option>
                      <Option value="询价中">询价中</Option>
                      <Option value="询价完成">询价完成</Option>
                      <Option value="已撤回">已撤回</Option>
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
        
        <TabPane tab="审批记录" key="3">
          <Table
            className="inquiry-table"
            columns={approvalColumns}
            dataSource={[...approvals.pending, ...approvals.history]}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
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
                    title: '单价(元/吨)',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    width: 120,
                    sorter: (a, b) => a.unitPrice - b.unitPrice,
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
                    title: '是否含运费',
                    dataIndex: 'includeFreight',
                    key: 'includeFreight',
                    width: 100,
                    render: (includeFreight) => includeFreight ? '是' : '否',
                  },
                  {
                    title: '含运费总价(元)',
                    key: 'totalWithFreight',
                    width: 150,
                    render: (_, record) => {
                      if (record.includeFreight) {
                        return (record.unitPrice * record.quantity).toLocaleString();
                      } else {
                        // 假设运费为单价的5%
                        const freight = record.unitPrice * 0.05;
                        return ((record.unitPrice + freight) * record.quantity).toLocaleString();
                      }
                    },
                  },
                  {
                    title: '不含运费总价(元)',
                    key: 'totalWithoutFreight',
                    width: 150,
                    render: (_, record) => (record.unitPrice * record.quantity).toLocaleString(),
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
                    <Descriptions.Item label="中标单价">{reportData.winnerQuotation.unitPrice} 元/吨</Descriptions.Item>
                    <Descriptions.Item label="中标数量">{reportData.winnerQuotation.quantity} 吨</Descriptions.Item>
                    <Descriptions.Item label="到货时间">{reportData.winnerQuotation.deliveryTime}</Descriptions.Item>
                    <Descriptions.Item label="交货地点">{reportData.winnerQuotation.deliveryAddress}</Descriptions.Item>
                    <Descriptions.Item label="是否含运费">{reportData.winnerQuotation.includeFreight ? '是' : '否'}</Descriptions.Item>
                    <Descriptions.Item label="总价(元)">{(reportData.winnerQuotation.unitPrice * reportData.winnerQuotation.quantity).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="备注" span={2}>{reportData.winnerQuotation.remarks || '无'}</Descriptions.Item>
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