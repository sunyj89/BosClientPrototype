import React, { useState, useEffect } from 'react';
import { Card, Form, Select, DatePicker, Button, Table, Space, Tag, Typography, Input, TreeSelect, Spin, Tabs, Modal, Descriptions, InputNumber, Upload, message, Timeline, Radio, Divider, Alert, Drawer } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, EyeOutlined, UploadOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, CheckOutlined, CloseOutlined, AuditOutlined } from '@ant-design/icons';
import './index.css';
// 导入mock数据
import mockData from '../../../mock/purchase/nonOilPurchaseRequestData.json';
import orgData from '../../../mock/station/orgData.json';
import approvalHistoryData from '../../../mock/purchase/approvalHistoryData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;
const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;

const NonOilPurchaseRequest = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [orgSelectedValues, setOrgSelectedValues] = useState([]);
  const [activeTab, setActiveTab] = useState('1'); // 主页面tab状态：1-非油采购申请，2-审批中心
  const [drawerActiveTab, setDrawerActiveTab] = useState('1'); // 抽屉tab状态
  
  // 组织树数据状态
  const [treeData, setTreeData] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);

  // 在组件挂载时加载数据
  useEffect(() => {
    fetchData();
    fetchOrgData();
  }, [activeTab]);

  // 模拟从服务器获取数据
  const fetchData = () => {
    setLoading(true);
    // 模拟API调用延迟
    setTimeout(() => {
      // 根据当前活动tab过滤数据
      let filteredData = [...mockData.list];
      
      if (activeTab === '1') { // 非油采购申请 - 只显示已通过的申请
        filteredData = filteredData.filter(item => item.status === 'approved');
      } else if (activeTab === '2') { // 审批中心 - 显示未提交、审核中和已驳回的申请
        filteredData = filteredData.filter(item => 
          item.status === 'pending' || 
          item.status === 'branch_review' || 
          item.status === 'head_review' || 
          item.status === 'rejected'
        );
      }
      
      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };
  
  // 获取组织数据
  const fetchOrgData = () => {
    setTreeLoading(true);
    // 模拟API调用延迟
    setTimeout(() => {
      const processedData = processTreeData(orgData);
      setTreeData(processedData);
      setTreeLoading(false);
    }, 300);
  };
  
  // 递归处理树节点，添加title和value属性
  const processTreeData = (data) => {
    return data.map(item => {
      const node = {
        title: item.name,
        value: item.id,
        key: item.id,
        type: item.type,
        selectable: true,
      };
      
      if (item.children && item.children.length > 0) {
        node.children = processTreeData(item.children);
      }
      
      return node;
    });
  };

  // 判断记录是否可以编辑
  const isRecordEditable = (status) => {
    // 未提交和已驳回的状态可编辑
    return status === 'pending' || status === 'rejected';
  };

  // 状态标签渲染函数
  const renderStatusTag = (status) => {
    let color = '';
    let text = '';
    
    switch(status) {
      case 'pending':
        color = 'orange';
        text = '未审批';
        break;
      case 'branch_review':
        color = 'blue';
        text = '审批中';
        break;
      case 'head_review':
        color = 'purple';
        text = '审批中';
        break;
      case 'approved':
        color = 'green';
        text = '已通过';
        break;
      case 'rejected':
        color = 'red';
        text = '已驳回';
        break;
      default:
        color = 'default';
        text = '未知状态';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '分公司名称',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150,
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: '商品编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '商品品类',
      dataIndex: 'productCategory',
      key: 'productCategory',
      width: 120,
      render: (text) => {
        const categoryMap = {
          'lubricant': '润滑油',
          'rice_oil': '米油',
          'urea': '尿素',
          'general': '通用商品'
        };
        return categoryMap[text] || text;
      }
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '零售单价(含税)',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      width: 120,
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '进货价格(含税)',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 120,
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '采购数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: '进货结算金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 150,
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: renderStatusTag,  
    },
  ];

  const handleView = (record) => {
    setCurrentRecord(record);
    setIsEdit(false);
    setIsCreate(false);
    setModalVisible(true);
    setDrawerActiveTab('1');
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setIsEdit(true);
    setIsCreate(false);
    setModalVisible(true);
    setDrawerActiveTab('1');
  };

  const handleCreate = () => {
    setCurrentRecord(null);
    setIsEdit(false);
    setIsCreate(true);
    setModalVisible(true);
    setDrawerActiveTab('1');
  };

  // 处理组织筛选变化
  const handleOrgChange = (values) => {
    setOrgSelectedValues(values);
    form.setFieldsValue({ organizations: values });
  };

  const handleSearch = (values) => {
    setLoading(true);
    
    // 模拟根据搜索条件筛选数据
    setTimeout(() => {
      let filteredData = [...mockData.list];
      
      // 首先根据当前tab筛选
      if (activeTab === '1') { // 非油采购申请 - 只显示已通过的申请
        filteredData = filteredData.filter(item => item.status === 'approved');
      } else if (activeTab === '2') { // 审批中心 - 显示未提交、审核中和已驳回的申请
        filteredData = filteredData.filter(item => 
          item.status === 'pending' || 
          item.status === 'branch_review' || 
          item.status === 'head_review' || 
          item.status === 'rejected'
        );
      }
      
      if (values.organizations && values.organizations.length > 0) {
        // 组织和油站过滤逻辑
        filteredData = filteredData.filter(item => {
          return values.organizations.some(org => 
            item.stationName.includes(org) || 
            item.branchName.includes(org)
          );
        });
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => 
          item.status === values.status
        );
      }
      
      if (values.dateRange && values.dateRange.length === 2) {
        const startDate = values.dateRange[0].startOf('day').valueOf();
        const endDate = values.dateRange[1].endOf('day').valueOf();
        
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.submitTime).valueOf();
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    setOrgSelectedValues([]);
    fetchData();
  };

  const handleDrawerClose = () => {
    setModalVisible(false);
  };

  const handleDrawerSuccess = () => {
    fetchData(); // 刷新列表数据
  };

  // PurchaseRequestForm 组件集成
  const [formInstance] = Form.useForm();
  const [unitOptions, setUnitOptions] = useState([]);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [formType, setFormType] = useState('general');
  
  useEffect(() => {
    if (currentRecord && currentRecord.id) {
      formInstance.setFieldsValue(currentRecord);
      
      // 根据商品类别设置表单类型
      switch(currentRecord.productCategory) {
        case 'lubricant':
          setFormType('lubricant');
          break;
        case 'rice_oil':
          setFormType('rice_oil');
          break;
        case 'urea':
          setFormType('urea');
          break;
        default:
          setFormType('general');
      }
      
      // 如果有初始价格和数量，计算金额
      if (currentRecord.purchasePrice && currentRecord.quantity) {
        const amount = currentRecord.purchasePrice * currentRecord.quantity;
        setCalculatedAmount(Number(amount.toFixed(2)));
      }
    } else {
      formInstance.resetFields();
      setFormType('general');
      setCalculatedAmount(0);
    }
  }, [currentRecord, formInstance]);
  
  // 根据表单类型设置单位选项
  useEffect(() => {
    if (formType === 'urea') {
      setUnitOptions([
        { value: '升', label: '升' },
        { value: '桶', label: '桶' }
      ]);
    } else if (formType === 'general') {
      setUnitOptions([
        { value: '件', label: '件' },
        { value: '箱', label: '箱' },
        { value: '升', label: '升' },
        { value: '桶', label: '桶' }
      ]);
    } else {
      setUnitOptions([
        { value: '桶', label: '桶' },
        { value: '件', label: '件' },
        { value: '箱', label: '箱' },
        { value: '袋', label: '袋' },
        { value: '个', label: '个' }
      ]);
    }
  }, [formType]);
  
  // 价格或数量变化时重新计算金额
  const handlePriceOrQuantityChange = () => {
    const purchasePrice = formInstance.getFieldValue('purchasePrice') || 0;
    const quantity = formInstance.getFieldValue('quantity') || 0;
    const amount = purchasePrice * quantity;
    setCalculatedAmount(Number(amount.toFixed(2)));
    formInstance.setFieldsValue({ totalAmount: Number(amount.toFixed(2)) });
  };

  // 处理表单提交
  const handleFormFinish = (values) => {
    // 计算进货结算金额
    const totalAmount = values.purchasePrice * values.quantity;
    
    // 模拟API调用
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(isCreate ? '创建成功' : '更新成功');
      handleDrawerSuccess();
      handleDrawerClose();
    }, 500);
  };

  // ApprovalHistory 组件集成
  const ApprovalHistory = ({ requestId }) => {
    const [historyLoading, setHistoryLoading] = useState(true);
    const [approvalHistory, setApprovalHistory] = useState([]);
  
    useEffect(() => {
      if (requestId) {
        // 模拟API调用获取审批历史
        setHistoryLoading(true);
        setTimeout(() => {
          // 从JSON文件加载数据
          const filteredHistory = approvalHistoryData.approvalHistory.filter(
            record => record.requestId === requestId
          );
          setApprovalHistory(filteredHistory);
          setHistoryLoading(false);
        }, 500);
      } else {
        setApprovalHistory([]);
        setHistoryLoading(false);
      }
    }, [requestId]);
  
    // 根据审批状态获取对应的图标
    const getStatusIcon = (action) => {
      switch (action) {
        case 'submit':
          return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
        case 'approve':
          return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        case 'reject':
          return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
        case 'review':
          return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
        default:
          return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      }
    };
  
    // 获取操作描述
    const getActionDesc = (record) => {
      switch (record.action) {
        case 'submit':
          return '提交申请';
        case 'approve':
          return '审批通过';
        case 'reject':
          return '驳回申请';
        case 'review':
          return '审核中';
        default:
          return '未知操作';
      }
    };
  
    return (
      <Card bordered={false} className="approval-history-card">
        {historyLoading ? (
          <div className="loading-container">
            <Spin tip="加载中..." />
          </div>
        ) : approvalHistory.length === 0 ? (
          <div className="empty-container">
            暂无审批记录
          </div>
        ) : (
          <Timeline mode="left">
            {approvalHistory.map(record => (
              <Timeline.Item 
                key={record.id}
                dot={getStatusIcon(record.action)}
              >
                <div className="timeline-content">
                  <div className="timeline-title">
                    <span className="action">{getActionDesc(record)}</span>
                    <span className="time">{record.timestamp}</span>
                  </div>
                  <div className="timeline-info">
                    <span className="operator">{record.operator}</span>
                    <span className="role">{record.role}</span>
                  </div>
                  {record.comments && (
                    <div className="timeline-comment">
                      {record.comments}
                    </div>
                  )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    );
  };

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key);
    form.resetFields();
    setOrgSelectedValues([]);
  };

  // 修改使用弹窗代替抽屉
  const [auditDrawerVisible, setAuditDrawerVisible] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [stationAuditForm] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState([]);

  // 批量审批操作
  const handleBatchAudit = async (result) => {
    if (selectedKeys.length === 0) {
      message.info('请选择要审批的记录');
      return;
    }
    
    try {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        message.success(`批量${result === 'approve' ? '通过' : '拒绝'}成功`);
        // 刷新数据
        fetchData();
        // 清空选中
        setSelectedKeys([]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('批量审批失败:', error);
      message.error('批量审批失败');
      setLoading(false);
    }
  };

  // 确认批量审批操作
  const confirmBatchAudit = (result) => {
    if (selectedKeys.length === 0) {
      message.info('请选择要审批的记录');
      return;
    }
    
    const title = result === 'approve' ? '批量通过' : '批量拒绝';
    const content = `确定要${result === 'approve' ? '通过' : '拒绝'}选中的 ${selectedKeys.length} 条记录吗？`;
    
    confirm({
      title,
      content,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleBatchAudit(result);
      }
    });
  };

  // 审批中心 - 表格行选择配置
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // 当用户选择或取消选择行时，更新选中的键值
      setSelectedKeys(selectedRowKeys);
      // selectedRows 包含了所有被选中行的完整数据对象
      // 这里我们只存储了键值，但如果需要可以同时存储完整行数据
      // 选中的数据随后可用于批量审批操作
    },
    // 可以根据记录状态决定某行是否可选
    getCheckboxProps: (record) => ({
      // 例如：只允许选择特定状态的记录
      disabled: record.status === 'approved', // 已批准的记录不可选
      name: record.id,
    }),
  };

  // 审批中心Tab中添加批量处理按钮
  const renderBatchActions = () => {
    return (
      <div className="batch-actions">
        <Space>
          <span>已选择 {selectedKeys.length} 项</span>
          <Button 
            type="primary" 
            icon={<CheckOutlined />}
            onClick={() => confirmBatchAudit('approve')}
            disabled={selectedKeys.length === 0}
            className="approve-btn"
          >
            批量通过
          </Button>
          <Button 
            danger 
            icon={<CloseOutlined />}
            onClick={() => confirmBatchAudit('reject')}
            disabled={selectedKeys.length === 0}
          >
            批量拒绝
          </Button>
        </Space>
      </div>
    );
  };

  // 审批记录信息
  const openAuditDrawer = (record) => {
    setCurrentRecord(record);
    setAuditDrawerVisible(true);
    stationAuditForm.resetFields();
    if (record?.id) {
      fetchHistory(record.id);
    }
  };

  // 获取审批历史记录
  const fetchHistory = async (requestId) => {
    try {
      setHistoryLoading(true);
      // 模拟API调用
      setTimeout(() => {
        // 从JSON文件加载数据
        const filteredHistory = approvalHistoryData.approvalHistory.filter(
          record => record.requestId === requestId
        );
        setAuditHistory(filteredHistory);
        setHistoryLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取审批历史失败', error);
      message.error('获取审批历史失败');
      setHistoryLoading(false);
    }
  };

  // 提交审批
  const handleAuditSubmit = async () => {
    try {
      const values = await stationAuditForm.validateFields();
      setAuditSubmitting(true);
      
      // 模拟API调用
      setTimeout(() => {
        message.success('审批操作成功');
        setAuditDrawerVisible(false);
        // 刷新数据
        fetchData();
        setAuditSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('审批提交错误:', error);
      message.error('提交失败，请检查表单');
      setAuditSubmitting(false);
    }
  };

  // 审批抽屉 - 获取状态图标
  const getStatusIcon = (operateType) => {
    if (operateType === 'approve') {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    } else if (operateType === 'reject') {
      return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    } else if (operateType === 'submit') {
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    } else if (operateType === 'review') {
      return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
    } else {
      return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  // 获取操作描述
  const getActionDesc = (record) => {
    switch (record.action) {
      case 'submit':
        return '提交申请';
      case 'approve':
        return '审批通过';
      case 'reject':
        return '驳回申请';
      case 'review':
        return '审核中';
      default:
        return '未知操作';
    }
  };

  // 审批抽屉 - 渲染申请单信息
  const renderRequestInfo = () => {
    if (!currentRecord) return null;

    return (
      <div className="audit-info">
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="油站名称">{currentRecord?.stationName || '-'}</Descriptions.Item>
          <Descriptions.Item label="分公司名称">{currentRecord?.branchName || '-'}</Descriptions.Item>
          <Descriptions.Item label="仓库名称">{currentRecord?.warehouseName || '-'}</Descriptions.Item>
          <Descriptions.Item label="商品编码">{currentRecord?.productCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="商品名称">{currentRecord?.productName || '-'}</Descriptions.Item>
          <Descriptions.Item label="商品品类">
            {(() => {
              switch(currentRecord?.productCategory) {
                case 'lubricant': return '润滑油';
                case 'rice_oil': return '米油';
                case 'urea': return '尿素';
                case 'general': return '通用商品';
                default: return currentRecord?.productCategory || '-';
              }
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="单位">{currentRecord?.unit || '-'}</Descriptions.Item>
          <Descriptions.Item label="零售单价(含税)">{currentRecord?.retailPrice ? `¥${currentRecord.retailPrice.toFixed(2)}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="进货价格(含税)">{currentRecord?.purchasePrice ? `¥${currentRecord.purchasePrice.toFixed(2)}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="采购数量">{currentRecord?.quantity || '-'}</Descriptions.Item>
          <Descriptions.Item label="进货结算金额(含税)">{currentRecord?.totalAmount ? `¥${currentRecord.totalAmount.toFixed(2)}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="备注信息" span={2}>{currentRecord?.remark || '-'}</Descriptions.Item>
          <Descriptions.Item label="审批状态" span={1}>
            {renderStatusTag(currentRecord?.status)}
          </Descriptions.Item>
          <Descriptions.Item label="提交时间" span={1}>{currentRecord?.submitTime || '-'}</Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  // 审批抽屉 - 渲染审批历史
  const renderAuditHistory = () => {
    return (
      <div className="audit-history">
        <Spin spinning={historyLoading}>
          <Timeline>
            {auditHistory.length > 0 ? (
              auditHistory.map((record) => (
                <Timeline.Item 
                  key={record.id}
                  dot={getStatusIcon(record.action)}
                >
                  <div className="timeline-content">
                    <div className="timeline-title">
                      <span className="action">{getActionDesc(record)}</span>
                      <span className="time">{record.timestamp}</span>
                    </div>
                    <div className="timeline-info">
                      <span className="operator">{record.operator}</span>
                      <span className="role">{record.role}</span>
                    </div>
                    {record.comments && (
                      <div className="timeline-comment">
                        {record.comments}
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              ))
            ) : (
              <Timeline.Item>暂无审批记录</Timeline.Item>
            )}
          </Timeline>
        </Spin>
      </div>
    );
  };

  // 审批抽屉 - 渲染审批表单
  const renderAuditForm = () => {
    const isPending = currentRecord?.status === 'pending' || 
                     currentRecord?.status === 'branch_review' || 
                     currentRecord?.status === 'head_review';

    return (
      <div className="audit-form">
        <Form
          form={stationAuditForm}
          layout="vertical"
        >
          {isPending && (
            <>
              <Form.Item
                name="result"
                label="审批结果"
                rules={[{ required: true, message: '请选择审批结果' }]}
              >
                <Radio.Group>
                  <Radio value="approve">通过</Radio>
                  <Radio value="reject">拒绝</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item
                name="comments"
                label="审批意见"
                rules={[{ required: true, message: '请输入审批意见' }]}
              >
                <TextArea rows={4} placeholder="请输入审批意见..." maxLength={200} showCount />
              </Form.Item>
            </>
          )}
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setAuditDrawerVisible(false)}>关闭</Button>
              {isPending && (
                <>
                  <Button 
                    danger 
                    onClick={() => {
                      stationAuditForm.setFieldsValue({ result: 'reject' });
                      handleAuditSubmit();
                    }}
                    loading={auditSubmitting}
                  >
                    拒绝
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      stationAuditForm.setFieldsValue({ result: 'approve' });
                      handleAuditSubmit();
                    }}
                    loading={auditSubmitting}
                    className="approve-btn"
                  >
                    通过
                  </Button>
                </>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  };

  // 渲染审批抽屉
  const renderAuditDrawer = () => {
    return (
      <Drawer
        title="采购申请审批"
        width={720}
        open={auditDrawerVisible}
        onClose={() => setAuditDrawerVisible(false)}
        bodyStyle={{ paddingBottom: 80 }}
        className="audit-drawer"
      >
        <Alert
          message={`申请编号: ${currentRecord?.id || ''}`}
          type={
            currentRecord?.status === 'pending'
              ? 'warning'
              : currentRecord?.status === 'approved'
                ? 'success'
                : currentRecord?.status === 'rejected'
                  ? 'error'
                  : 'info'
          }
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        {renderRequestInfo()}
        
        <Divider style={{ margin: '24px 0 16px' }} />
        
        <h3>审批历史</h3>
        {renderAuditHistory()}
        
        <Divider style={{ margin: '24px 0 16px' }} />
        
        <h3>审批操作</h3>
        {renderAuditForm()}
      </Drawer>
    );
  };

  // 查看详情抽屉
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [viewHistory, setViewHistory] = useState([]);
  const [viewHistoryLoading, setViewHistoryLoading] = useState(false);

  // 打开查看详情抽屉
  const openViewDrawer = (record) => {
    setViewRecord(record);
    setViewDrawerVisible(true);
    if (record?.id) {
      fetchViewHistory(record.id);
    }
  };

  // 获取查看详情的历史记录
  const fetchViewHistory = async (requestId) => {
    try {
      setViewHistoryLoading(true);
      // 模拟API调用
      setTimeout(() => {
        // 从JSON文件加载数据
        const filteredHistory = approvalHistoryData.approvalHistory.filter(
          record => record.requestId === requestId
        );
        setViewHistory(filteredHistory);
        setViewHistoryLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取审批历史失败', error);
      message.error('获取审批历史失败');
      setViewHistoryLoading(false);
    }
  };

  // 渲染查看详情抽屉
  const renderViewDrawer = () => {
    return (
      <Drawer
        title="采购申请详情"
        width={720}
        open={viewDrawerVisible}
        onClose={() => setViewDrawerVisible(false)}
        bodyStyle={{ paddingBottom: 80 }}
        className="view-drawer"
      >
        <Alert
          message={`申请编号: ${viewRecord?.id || ''}`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 20 }}>
          <Descriptions.Item label="油站名称">{viewRecord?.stationName || '-'}</Descriptions.Item>
          <Descriptions.Item label="分公司名称">{viewRecord?.branchName || '-'}</Descriptions.Item>
          <Descriptions.Item label="仓库名称">{viewRecord?.warehouseName || '-'}</Descriptions.Item>
          <Descriptions.Item label="商品编码">{viewRecord?.productCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="商品名称">{viewRecord?.productName || '-'}</Descriptions.Item>
          <Descriptions.Item label="商品品类">
            {(() => {
              switch(viewRecord?.productCategory) {
                case 'lubricant': return '润滑油';
                case 'rice_oil': return '米油';
                case 'urea': return '尿素';
                case 'general': return '通用商品';
                default: return viewRecord?.productCategory || '-';
              }
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="单位">{viewRecord?.unit || '-'}</Descriptions.Item>
          <Descriptions.Item label="零售单价(含税)">{viewRecord?.retailPrice ? `¥${viewRecord.retailPrice.toFixed(2)}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="进货价格(含税)">{viewRecord?.purchasePrice ? `¥${viewRecord.purchasePrice.toFixed(2)}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="采购数量">{viewRecord?.quantity || '-'}</Descriptions.Item>
          <Descriptions.Item label="进货结算金额(含税)">{viewRecord?.totalAmount ? `¥${viewRecord.totalAmount.toFixed(2)}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="备注信息" span={2}>{viewRecord?.remark || '-'}</Descriptions.Item>
        </Descriptions>
        
        <Divider style={{ margin: '24px 0 16px' }} />
        
        <h3>审批记录</h3>
        <div className="audit-history">
          <Spin spinning={viewHistoryLoading}>
            <Timeline>
              {viewHistory.length > 0 ? (
                viewHistory.map((record) => (
                  <Timeline.Item 
                    key={record.id}
                    dot={getStatusIcon(record.action)}
                  >
                    <div className="timeline-content">
                      <div className="timeline-title">
                        <span className="action">{getActionDesc(record)}</span>
                        <span className="time">{record.timestamp}</span>
                      </div>
                      <div className="timeline-info">
                        <span className="operator">{record.operator}</span>
                        <span className="role">{record.role}</span>
                      </div>
                      {record.comments && (
                        <div className="timeline-comment">
                          {record.comments}
                        </div>
                      )}
                    </div>
                  </Timeline.Item>
                ))
              ) : (
                <Timeline.Item>暂无审批记录</Timeline.Item>
              )}
            </Timeline>
          </Spin>
        </div>
      </Drawer>
    );
  };

  return (
    <div className="non-oil-purchase-request">
      
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="main-tabs">
        <TabPane tab="非油采购申请" key="1">
          <Card className="search-card">
            <Form
              form={form}
              layout="horizontal"
              onFinish={handleSearch}
              className="filter-form"
            >
              <div className="filter-row">
                <Form.Item name="organizations" label="组织筛选" className="filter-item org-filter">
                  <TreeSelect
                    treeData={treeData}
                    value={orgSelectedValues}
                    onChange={handleOrgChange}
                    treeCheckable={true}
                    showCheckedStrategy={SHOW_PARENT}
                    placeholder="请选择组织或油站"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    allowClear
                    loading={treeLoading}
                    multiple={true}
                    showSearch
                    treeNodeFilterProp="title"
                  />
                </Form.Item>
                
                <Form.Item name="dateRange" label="提交时间" className="filter-item date-filter">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
                
                <div className="action-buttons">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} className="action-button">
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset} className="action-button">
                    重置
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="action-button">
                    新建
                  </Button>
                </div>
              </div>
            </Form>

            <Table
              columns={[
                ...columns.slice(0, -1),
                {
                  title: '操作',
                  key: 'action',
                  fixed: 'right',
                  width: 150,
                  render: (_, record) => (
                    <Space size="small">
                      <Button 
                        type="primary" 
                        size="small" 
                        icon={<EyeOutlined />} 
                        onClick={() => openViewDrawer(record)}
                      >
                        查看
                      </Button>
                    </Space>
                  ),
                }
              ]}
              dataSource={dataSource}
              loading={loading}
              scroll={{ x: 'max-content' }}
              pagination={{
                total: dataSource.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              rowKey="id"
              style={{ marginTop: 16 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="审批中心" key="2">
          <Card className="search-card">
            <Form
              form={form}
              layout="horizontal"
              onFinish={handleSearch}
              className="filter-form"
            >
              <div className="filter-row">
                <Form.Item name="organizations" label="组织筛选" className="filter-item org-filter" style={{ width: '50%', display: 'inline-block', marginRight: '16px' }}>
                  <TreeSelect
                    treeData={treeData}
                    value={orgSelectedValues}
                    onChange={handleOrgChange}
                    treeCheckable={true}
                    showCheckedStrategy={SHOW_PARENT}
                    placeholder="请选择组织或油站"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    allowClear
                    loading={treeLoading}
                    multiple={true}
                    showSearch
                    treeNodeFilterProp="title"
                  />
                </Form.Item>
                
                <Form.Item name="status" label="审批状态" className="filter-item" style={{ width: '20%', display: 'inline-block', marginRight: '16px' }}>
                  <Select
                    placeholder="请选择状态"
                    style={{ width: '100%' }}
                    allowClear
                  >
                    <Option value="pending">未审批</Option>
                    <Option value="branch_review">分公司审批中</Option>
                    <Option value="head_review">总部审批中</Option>
                    <Option value="rejected">已驳回</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item name="dateRange" label="提交时间" className="filter-item date-filter" style={{ width: '30%', display: 'inline-block' }}>
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
                
                <div className="action-buttons">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} className="action-button">
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset} className="action-button">
                    重置
                  </Button>
                </div>
              </div>
            </Form>

            {renderBatchActions()}

            <Table
              rowSelection={rowSelection}
              columns={[
                ...columns.slice(0, -1),
                {
                  title: '操作',
                  key: 'action',
                  fixed: 'right',
                  width: 100,
                  render: (_, record) => (
                    <Space size="small">
                      <Button 
                        type="primary" 
                        size="small" 
                        icon={<AuditOutlined />} 
                        onClick={() => openAuditDrawer(record)}
                      >
                        审批
                      </Button>
                    </Space>
                  ),
                }
              ]}
              dataSource={dataSource}
              loading={loading}
              scroll={{ x: 'max-content' }}
              pagination={{
                total: dataSource.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              rowKey="id"
              style={{ marginTop: 16 }}
            />
          </Card>
        </TabPane>
      </Tabs>
      
      {/* 使用Modal代替Drawer */}
      <Modal
        title={isCreate ? '新建非油品采购申请' : (isEdit ? '编辑非油品采购申请' : '查看非油品采购申请')}
        width={720}
        open={modalVisible}
        onCancel={handleDrawerClose}
        footer={
          <div>
            <Button onClick={handleDrawerClose}>取消</Button>
            {(isEdit || isCreate) && isRecordEditable(currentRecord?.status) && (
              <Button 
                type="primary" 
                loading={loading}
                onClick={() => {
                  formInstance.submit();
                }}
              >
                提交
              </Button>
            )}
          </div>
        }
        destroyOnClose
      >
        <div>
          <Descriptions bordered column={2} size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="油站名称">{currentRecord?.stationName || '-'}</Descriptions.Item>
            <Descriptions.Item label="分公司名称">{currentRecord?.branchName || '-'}</Descriptions.Item>
            <Descriptions.Item label="仓库名称">{currentRecord?.warehouseName || '-'}</Descriptions.Item>
            <Descriptions.Item label="商品编码">{currentRecord?.productCode || '-'}</Descriptions.Item>
            <Descriptions.Item label="商品名称">{currentRecord?.productName || '-'}</Descriptions.Item>
            <Descriptions.Item label="商品品类">
              {(() => {
                switch(currentRecord?.productCategory) {
                  case 'lubricant': return '润滑油';
                  case 'rice_oil': return '米油';
                  case 'urea': return '尿素';
                  case 'general': return '通用商品';
                  default: return currentRecord?.productCategory || '-';
                }
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="单位">{currentRecord?.unit || '-'}</Descriptions.Item>
            <Descriptions.Item label="零售单价(含税)">{currentRecord?.retailPrice ? `¥${currentRecord.retailPrice.toFixed(2)}` : '-'}</Descriptions.Item>
            <Descriptions.Item label="进货价格(含税)">{currentRecord?.purchasePrice ? `¥${currentRecord.purchasePrice.toFixed(2)}` : '-'}</Descriptions.Item>
            <Descriptions.Item label="采购数量">{currentRecord?.quantity || '-'}</Descriptions.Item>
            <Descriptions.Item label="进货结算金额(含税)">{currentRecord?.totalAmount ? `¥${currentRecord.totalAmount.toFixed(2)}` : '-'}</Descriptions.Item>
            <Descriptions.Item label="备注信息" span={2}>{currentRecord?.remark || '-'}</Descriptions.Item>
          </Descriptions>
          
          {!isCreate && currentRecord && currentRecord.id && (
            <>
              <Divider style={{ margin: '24px 0 16px' }} />
              <h3>审批记录</h3>
              <ApprovalHistory requestId={currentRecord.id} />
            </>
          )}
        </div>
      </Modal>

      {/* 审批抽屉 */}
      {renderAuditDrawer()}

      {/* 查看详情抽屉 */}
      {renderViewDrawer()}
    </div>
  );
};

export default NonOilPurchaseRequest; 