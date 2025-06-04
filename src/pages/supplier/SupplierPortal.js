import React, { useState, useEffect } from 'react';
import { 
  Tabs,
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
  Tag,
  Card,
  Typography,
  Descriptions,
  Badge,
  Upload,
  Divider,
  List,
  Statistic,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  EyeOutlined,
  FormOutlined,
  UploadOutlined,
  BellOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import moment from 'moment';

// 导入模拟数据
import mockInquiries from '../../mock/supplier/inquiryData.json';
import mockQuotations from '../../mock/supplier/quotationData.json';
import mockMessages from '../../mock/supplier/messageData.json';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 供应商状态对应的颜色
const getSupplierStatusColor = (status) => {
  const colorMap = {
    '未提交': 'default',
    '已提交': 'blue',
    '已确认': 'green',
    '已拒绝': 'red',
    '未中标': 'orange',
    '已中标': 'gold'
  };
  return colorMap[status] || 'default';
};

// 询价单状态对应的颜色
const getInquiryStatusColor = (status) => {
  const colorMap = {
    '待报价': 'blue',
    '已报价': 'green',
    '已结束': 'purple',
    '已取消': 'red'
  };
  return colorMap[status] || 'default';
};

// 获取报价单状态对应的颜色
const getQuotationStatusColor = (status) => {
  const colorMap = {
    '草稿': 'default',
    '已提交': 'blue',
    '已确认': 'green',
    '已拒绝': 'red',
    '未中标': 'orange',
    '已中标': 'gold'
  };
  return colorMap[status] || 'default';
};

// 计算剩余时间
const getRemainingTime = (endTime) => {
  const end = moment(endTime);
  const now = moment();
  
  if (now > end) {
    return '已截止';
  }
  
  const duration = moment.duration(end.diff(now));
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  
  return `${days}天${hours}小时${minutes}分钟`;
};

const SupplierPortal = () => {
  // 状态定义
  const [activeTab, setActiveTab] = useState('1');
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [quotations, setQuotations] = useState(mockQuotations);
  const [messages, setMessages] = useState(mockMessages);
  const [loading, setLoading] = useState(false);
  const [filterForm] = Form.useForm();
  const [quotationFilterForm] = Form.useForm();
  const [quotationForm] = Form.useForm();
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quotationDetailVisible, setQuotationDetailVisible] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [messageDetailVisible, setMessageDetailVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [fileList, setFileList] = useState([]);

  // 获取数据
  useEffect(() => {
    // 这里应该是从API获取数据
    // 目前使用模拟数据
  }, []);

  // 查询处理
  const onFinish = (values) => {
    setLoading(true);
    console.log('查询参数:', values);
    
    // 模拟查询请求
    setTimeout(() => {
      let filteredData = [...mockInquiries];
      
      if (values.keyword) {
        filteredData = filteredData.filter(item => 
          item.id.toLowerCase().includes(values.keyword.toLowerCase()) ||
          item.name.toLowerCase().includes(values.keyword.toLowerCase())
        );
      }
      
      if (values.oilType) {
        filteredData = filteredData.filter(item => item.oilType === values.oilType);
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => item.supplierStatus === values.status);
      }
      
      if (values.dateRange && values.dateRange.length === 2) {
        const [start, end] = values.dateRange;
        filteredData = filteredData.filter(item => {
          const quoteEndTime = moment(item.quoteEndTime);
          return quoteEndTime.isBetween(start, end, null, '[]');
        });
      }
      
      setInquiries(filteredData);
      setLoading(false);
    }, 500);
  };

  // 重置查询
  const handleReset = () => {
    filterForm.resetFields();
    setInquiries(mockInquiries);
  };

  // Tab页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 查看询价单详情
  const handleViewDetail = (record) => {
    setCurrentInquiry(record);
    setDetailModalVisible(true);
  };

  // 打开报价表单
  const handleQuote = (record) => {
    setCurrentInquiry(record);
    quotationForm.resetFields();
    
    // 设置表单初始值
    quotationForm.setFieldsValue({
      inquiryId: record.id,
      inquiryName: record.name,
      oilType: record.oilType,
      quantity: record.quantity,
      deliveryAddress: record.deliveryAddress
    });
    
    setFileList([]);
    setQuoteModalVisible(true);
  };

  // 提交报价
  const handleSubmitQuote = () => {
    quotationForm.validateFields()
      .then(values => {
        try {
          // 显示确认对话框
          Modal.confirm({
            title: '提交确认',
            icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
            content: (
              <div style={{ padding: '10px 0' }}>
                <Alert
                  message="重要提示"
                  description="您只有一次提交报价的机会，请仔细核对报价单内容，如果报价单被拒绝，您将失去参与本次报价的机会！"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 10 }}
                />
              </div>
            ),
            okText: '确认',
            cancelText: '取消',
            okButtonProps: {
              type: 'primary',
              danger: true,
            },
            onOk: () => {
              setLoading(true);
              
              // 模拟提交请求
              setTimeout(() => {
                try {
                  console.log('报价表单数据:', values);
                  console.log('附件:', fileList);
                  
                  // 更新列表中的询价单状态
                  const updatedInquiries = inquiries.map(item => {
                    if (item.id === currentInquiry.id) {
                      return { ...item, supplierStatus: '已提交' };
                    }
                    return item;
                  });
                  
                  setInquiries(updatedInquiries);
                  setQuoteModalVisible(false);
                  setLoading(false);
                  message.success('报价提交成功');
                } catch (error) {
                  console.error('提交处理出错:', error);
                  setLoading(false);
                  message.error('提交处理过程中发生错误');
                }
              }, 1000);
            },
            onCancel: () => {
              // 取消提交，保持在当前报价单页面
              message.info('已取消提交');
            },
          });
        } catch (error) {
          console.error('确认对话框创建出错:', error);
          message.error('操作失败，请重试');
        }
      })
      .catch(errorInfo => {
        console.error('表单验证出错:', errorInfo);
        message.error('请检查表单填写是否正确');
      });
  };

  // 查看消息详情
  const handleViewMessage = (record) => {
    // 标记消息为已读
    const updatedMessages = messages.map(item => {
      if (item.id === record.id) {
        return { ...item, read: true };
      }
      return item;
    });
    
    setMessages(updatedMessages);
    setCurrentMessage(record);
    setMessageDetailVisible(true);
  };

  // 文件上传处理
  const handleFileChange = (info) => {
    try {
      if (info && info.fileList) {
        const newFileList = info.fileList.map(file => {
          if (file.response) {
            // 如果有响应，添加url属性
            return {
              ...file,
              url: file.response.url || file.url
            };
          }
          return file;
        });
        setFileList(newFileList);
      }
    } catch (error) {
      console.error('处理文件上传出错:', error);
      message.error('文件处理失败');
    }
  };

  // 上传文件前的检查
  const beforeUpload = (file) => {
    try {
      // 文件大小限制 (10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件必须小于10MB!');
      }
      return false; // 返回false阻止自动上传
    } catch (error) {
      console.error('文件上传前检查出错:', error);
      message.error('文件检查失败');
      return false;
    }
  };

  // 处理下载报价单附件
  const handleQuotationDownload = (file) => {
    message.info(`下载附件: ${file.name}`);
    // 实际实现应该是发送请求下载文件
  };

  // 查看报价详情
  const handleViewQuotationDetail = (record) => {
    setCurrentQuotation(record);
    setQuotationDetailVisible(true);
  };

  // 编辑报价（仅草稿状态可编辑）
  const handleEditQuotation = (record) => {
    setCurrentQuotation(record);
    
    // 设置表单初始值
    quotationForm.setFieldsValue({
      inquiryId: record.inquiryId,
      inquiryName: record.inquiryName,
      oilType: record.oilType,
      quantity: record.quantity,
      deliveryAddress: record.deliveryAddress,
      oilUnitPrice: record.oilUnitPrice,
      freightUnitPrice: record.freightUnitPrice,
      deliveryTime: record.deliveryTime ? moment(record.deliveryTime) : null,
      remarks: record.remarks
    });
    
    // 设置附件列表
    const newFileList = record.attachments.map((file, index) => ({
      uid: `-${index}`,
      name: file.name,
      status: 'done',
      url: file.url
    }));
    
    setFileList(newFileList);
    setQuoteModalVisible(true);
  };

  // 删除草稿报价
  const handleDeleteDraftQuotation = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个报价草稿吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 从列表中移除该项
        const newQuotations = quotations.filter(item => item.id !== record.id);
        setQuotations(newQuotations);
        message.success('草稿已删除');
      }
    });
  };

  // 提交草稿报价
  const handleSubmitDraftQuotation = (record) => {
    try {
      Modal.confirm({
        title: '确认提交',
        icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
        content: (
          <div style={{ padding: '10px 0' }}>
            <Alert
              message="重要提示"
              description="您只有一次提交报价的机会，请仔细核对报价单内容，如果报价单被拒绝，您将失去参与本次报价的机会！"
              type="warning"
              showIcon
              style={{ marginBottom: 10 }}
            />
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        okButtonProps: {
          type: 'primary',
          danger: true,
        },
        onOk: () => {
          try {
            // 更新状态为已提交
            const newQuotations = quotations.map(item => {
              if (item.id === record.id) {
                return {
                  ...item,
                  status: '已提交',
                  submitTime: moment().format('YYYY-MM-DD HH:mm:ss')
                };
              }
              return item;
            });
            setQuotations(newQuotations);
            message.success('报价已提交');
          } catch (error) {
            console.error('报价提交处理出错:', error);
            message.error('提交处理过程中发生错误');
          }
        },
        onCancel: () => {
          message.info('已取消提交');
        }
      });
    } catch (error) {
      console.error('确认对话框创建出错:', error);
      message.error('操作失败，请重试');
    }
  };

  // 报价列表查询处理
  const handleQuotationSearch = (values) => {
    setLoading(true);
    
    // 模拟查询请求
    setTimeout(() => {
      let filteredData = [...mockQuotations];
      
      if (values.keyword) {
        filteredData = filteredData.filter(item => 
          item.id.toLowerCase().includes(values.keyword.toLowerCase()) ||
          item.inquiryName.toLowerCase().includes(values.keyword.toLowerCase()) ||
          item.inquiryId.toLowerCase().includes(values.keyword.toLowerCase())
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

  // 重置报价列表查询
  const handleQuotationReset = () => {
    quotationFilterForm.resetFields();
    setQuotations(mockQuotations);
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
      width: 180,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '采购数量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: '询价状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getInquiryStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: '我的状态',
      dataIndex: 'supplierStatus',
      key: 'supplierStatus',
      width: 100,
      render: (status) => (
        <Tag color={getSupplierStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: '报价截止时间',
      dataIndex: 'quoteEndTime',
      key: 'quoteEndTime',
      width: 160,
    },
    {
      title: '剩余时间',
      key: 'remainingTime',
      width: 140,
      render: (_, record) => {
        const remainingTime = getRemainingTime(record.quoteEndTime);
        const isExpired = remainingTime === '已截止';
        
        return (
          <span style={{ color: isExpired ? '#f5222d' : '#1890ff' }}>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            {remainingTime}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        // 根据状态和截止时间决定显示的按钮
        const isExpired = getRemainingTime(record.quoteEndTime) === '已截止';
        const canQuote = !isExpired && (record.supplierStatus === '未提交' || record.supplierStatus === '已提交');
        
        return (
          <Space size="small">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            >
              详情
            </Button>
            
            {canQuote && (
              <Button 
                type="primary" 
                size="small" 
                icon={<FormOutlined />} 
                onClick={() => handleQuote(record)}
              >
                报价
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  // 消息列表列配置
  const messageColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (text, record) => (
        <span>
          {!record.read && <Badge color="red" style={{ marginRight: 8 }} />}
          {text}
        </span>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewMessage(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 获取未读消息数量
  const getUnreadMessageCount = () => {
    return messages.filter(msg => !msg.read).length;
  };

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
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
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
      render: (amount) => `${(amount / 100)?.toLocaleString() || 0}`,
    },
    {
      title: '到货地点',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 180,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getQuotationStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        const actionButtons = [
          <Button 
            key="view" 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewQuotationDetail(record)}
          >
            详情
          </Button>
        ];
        
        // 根据状态显示不同的操作按钮
        if (record.status === '草稿') {
          actionButtons.push(
            <Button 
              key="edit" 
              type="primary" 
              size="small" 
              icon={<FormOutlined />} 
              onClick={() => handleEditQuotation(record)}
            >
              编辑
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              size="small" 
              onClick={() => handleSubmitDraftQuotation(record)}
            >
              提交
            </Button>,
            <Button 
              key="delete" 
              danger
              size="small" 
              onClick={() => handleDeleteDraftQuotation(record)}
            >
              删除
            </Button>
          );
        }
        
        return <Space size="small">{actionButtons}</Space>;
      },
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Title level={4}>供应商门户</Title>
            <Paragraph>欢迎访问江西交投化石能源有限公司供应商门户，您可以在这里查看询价单并提交报价。</Paragraph>
          </Col>
          <Col span={8}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="待报价询价单" 
                  value={inquiries.filter(i => i.supplierStatus === '未提交').length} 
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="未读消息" 
                  value={getUnreadMessageCount()} 
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<BellOutlined />}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Tabs activeKey={activeTab} onChange={handleTabChange} className="tab-container">
        <TabPane tab="询价单列表" key="1">
          {/* 筛选表单 */}
          <div className="form-section" style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5' }}>
            <Form
              form={filterForm}
              layout="inline"
              onFinish={onFinish}
              initialValues={{}}
            >
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                <Col span={6}>
                  <Form.Item name="keyword" label="关键字">
                    <Input placeholder="询价单ID/名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="oilType" label="油品类型">
                    <Select placeholder="请选择" allowClear>
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
                    <Select placeholder="请选择" allowClear>
                      <Option value="未提交">未提交</Option>
                      <Option value="已提交">已提交</Option>
                      <Option value="已确认">已确认</Option>
                      <Option value="已拒绝">已拒绝</Option>
                      <Option value="未中标">未中标</Option>
                      <Option value="已中标">已中标</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="dateRange" label="截止日期">
                    <RangePicker style={{ width: '100%' }} />
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
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            columns={inquiryColumns}
            dataSource={inquiries}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
        
        <TabPane tab="我的报价" key="2">
          {/* 筛选表单 */}
          <div className="form-section" style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5' }}>
            <Form
              form={quotationFilterForm}
              layout="inline"
              onFinish={handleQuotationSearch}
              initialValues={{}}
            >
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                <Col span={6}>
                  <Form.Item name="keyword" label="关键字">
                    <Input placeholder="报价单ID/询价单ID/名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="oilType" label="油品类型">
                    <Select placeholder="请选择" allowClear>
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
                    <Select placeholder="请选择" allowClear>
                      <Option value="草稿">草稿</Option>
                      <Option value="已提交">已提交</Option>
                      <Option value="已确认">已确认</Option>
                      <Option value="已拒绝">已拒绝</Option>
                      <Option value="未中标">未中标</Option>
                      <Option value="已中标">已中标</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        查询
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={handleQuotationReset}>
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            columns={quotationColumns}
            dataSource={quotations}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              消息通知
              {getUnreadMessageCount() > 0 && (
                <Badge count={getUnreadMessageCount()} style={{ marginLeft: 8 }} />
              )}
            </span>
          } 
          key="3"
        >
          <Table
            columns={messageColumns}
            dataSource={messages}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      {/* 询价单详情弹窗 */}
      <Modal
        title={
          currentInquiry && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>询价单详情</span>
              {currentInquiry.supplierStatus && (
                <Tag color={getSupplierStatusColor(currentInquiry.supplierStatus)}>
                  {currentInquiry.supplierStatus}
                </Tag>
              )}
            </div>
          )
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          currentInquiry && 
          currentInquiry.supplierStatus === '未提交' && 
          getRemainingTime(currentInquiry?.quoteEndTime) !== '已截止' && (
            <Button 
              key="quote" 
              type="primary" 
              onClick={() => {
                setDetailModalVisible(false);
                handleQuote(currentInquiry);
              }}
            >
              提交报价
            </Button>
          )
        ]}
        width={700}
      >
        {currentInquiry && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="询价单ID" span={1}>{currentInquiry.id}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={1}>{currentInquiry.createTime}</Descriptions.Item>
              <Descriptions.Item label="询价单名称" span={2}>{currentInquiry.name}</Descriptions.Item>
              <Descriptions.Item label="油品类型" span={1}>{currentInquiry.oilType}</Descriptions.Item>
              <Descriptions.Item label="采购数量" span={1}>{currentInquiry.quantity} L</Descriptions.Item>
              <Descriptions.Item label="报价开始时间" span={1}>{currentInquiry.quoteStartTime}</Descriptions.Item>
              <Descriptions.Item label="报价截止时间" span={1}>{currentInquiry.quoteEndTime}</Descriptions.Item>
              <Descriptions.Item label="采购单位" span={1}>{currentInquiry.createdBy}</Descriptions.Item>
              <Descriptions.Item label="交货地点" span={1}>{currentInquiry.deliveryAddress}</Descriptions.Item>
              <Descriptions.Item label="联系人" span={1}>{currentInquiry.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="联系电话" span={1}>{currentInquiry.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱" span={2}>{currentInquiry.contactEmail}</Descriptions.Item>
            </Descriptions>
            
            {getRemainingTime(currentInquiry.quoteEndTime) !== '已截止' ? (
              <Alert 
                style={{ marginTop: 16 }}
                message={`距离报价截止还剩: ${getRemainingTime(currentInquiry.quoteEndTime)}`} 
                type="info" 
                showIcon 
              />
            ) : (
              <Alert 
                style={{ marginTop: 16 }}
                message="报价已截止" 
                type="warning" 
                showIcon 
              />
            )}
          </>
        )}
      </Modal>

      {/* 报价表单弹窗 */}
      <Modal
        title="提交报价"
        open={quoteModalVisible}
        onCancel={() => setQuoteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setQuoteModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={handleSubmitQuote}
          >
            提交报价
          </Button>
        ]}
        width={700}
      >
        <Form
          form={quotationForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="询价单ID"
                name="inquiryId"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="油品类型"
                name="oilType"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="询价单名称"
                name="inquiryName"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="数量(L)"
                name="quantity"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="到货地点"
                name="deliveryAddress"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="油品单价（元/吨,不含运费）"
                name="oilUnitPrice"
                rules={[{ required: true, message: '请输入油品单价' }]}
              >
                <Input type="number" min={0} step={0.01} placeholder="请输入油品单价" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="运费单价(元/吨)"
                name="freightUnitPrice"
                rules={[{ required: true, message: '请输入运费单价' }]}
              >
                <Input type="number" min={0} step={0.01} placeholder="请输入运费单价" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="到货时间"
                name="deliveryTime"
                rules={[{ required: true, message: '请选择到货时间' }]}
                getValueProps={(date) => {
                  if (date && typeof date === 'string') {
                    return { value: moment(date) };
                  }
                  return { value: date };
                }}
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="备注"
                name="remarks"
              >
                <TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">上传附件</Divider>
          <Form.Item name="attachments">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={beforeUpload}
              multiple
              maxCount={5}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
              <div style={{ marginTop: 8 }}>支持PDF、Office文档和图片格式，最多5个文件</div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 报价详情弹窗 */}
      <Modal
        title={
          currentQuotation && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>报价单详情</span>
              <Tag color={getQuotationStatusColor(currentQuotation.status)}>
                {currentQuotation.status}
              </Tag>
            </div>
          )
        }
        open={quotationDetailVisible}
        onCancel={() => setQuotationDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQuotationDetailVisible(false)}>
            关闭
          </Button>,
          currentQuotation && currentQuotation.status === '草稿' && (
            <Button 
              key="edit" 
              type="primary" 
              onClick={() => {
                setQuotationDetailVisible(false);
                handleEditQuotation(currentQuotation);
              }}
            >
              编辑报价
            </Button>
          )
        ]}
        width={700}
      >
        {currentQuotation && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="报价单ID" span={1}>{currentQuotation.id}</Descriptions.Item>
              <Descriptions.Item label="询价单ID" span={1}>{currentQuotation.inquiryId}</Descriptions.Item>
              <Descriptions.Item label="询价单名称" span={2}>{currentQuotation.inquiryName}</Descriptions.Item>
              <Descriptions.Item label="油品类型" span={1}>{currentQuotation.oilType}</Descriptions.Item>
              <Descriptions.Item label="数量(吨)" span={1}>{currentQuotation.quantity}</Descriptions.Item>
              <Descriptions.Item label="油品单价（元/吨,不含运费）" span={1}>{currentQuotation.oilUnitPrice?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="运费单价(元/吨)" span={1}>{currentQuotation.freightUnitPrice?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="到站单价（元/吨）" span={1}>{currentQuotation.stationUnitPrice?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="总金额（元）" span={1}>{(currentQuotation.totalAmount / 100)?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="到货地点" span={2}>{currentQuotation.deliveryAddress}</Descriptions.Item>
              <Descriptions.Item label="交货时间" span={1}>{currentQuotation.deliveryTime}</Descriptions.Item>
              <Descriptions.Item label="提交时间" span={1}>{currentQuotation.submitTime || '-'}</Descriptions.Item>
              
              {currentQuotation.rejectReason && (
                <Descriptions.Item label="拒绝原因" span={2}>
                  <Text type="danger">{currentQuotation.rejectReason}</Text>
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="备注信息" span={2}>{currentQuotation.remarks}</Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">附件</Divider>
            
            {currentQuotation.attachments && currentQuotation.attachments.length > 0 ? (
              <List
                size="small"
                bordered
                dataSource={currentQuotation.attachments}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        icon={<DownloadOutlined />} 
                        onClick={() => handleQuotationDownload(item)}
                      >
                        下载
                      </Button>
                    ]}
                  >
                    <Space>
                      <FileTextOutlined />
                      <Text>{item.name}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">无附件</Text>
            )}
            
            {currentQuotation.status === '已中标' && (
              <Alert 
                style={{ marginTop: 16 }}
                message="恭喜，您的报价已中标！请关注采购方的后续通知。" 
                type="success" 
                showIcon 
              />
            )}
          </>
        )}
      </Modal>

      {/* 消息详情弹窗 */}
      <Modal
        title="消息详情"
        open={messageDetailVisible}
        onCancel={() => setMessageDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMessageDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {currentMessage && (
          <>
            <Title level={5}>{currentMessage.title}</Title>
            <Text type="secondary">{currentMessage.time}</Text>
            <Divider />
            <Paragraph>{currentMessage.content}</Paragraph>
            
            {currentMessage.relatedId && (
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary"
                  onClick={() => {
                    // 查找关联的询价单并查看详情
                    const inquiry = inquiries.find(item => item.id === currentMessage.relatedId);
                    if (inquiry) {
                      setMessageDetailVisible(false);
                      setCurrentInquiry(inquiry);
                      setDetailModalVisible(true);
                    }
                  }}
                >
                  查看相关询价单
                </Button>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default SupplierPortal; 