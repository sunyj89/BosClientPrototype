import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Form, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  Modal, 
  message, 
  Tag,
  Tooltip,
  Popconfirm,
  Drawer,
  Descriptions,
  Steps,
  Divider,
  Statistic,
  Progress,
  Timeline,
  Tabs,
  Empty,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  PrinterOutlined,
  DownloadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  BarChartOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const CorrectionManagement = () => {
  const navigate = useNavigate();
  
  // 状态变量
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [correctionList, setCorrectionList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCorrection, setEditingCorrection] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  
  // 详情抽屉相关状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentCorrection, setCurrentCorrection] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalType, setApprovalType] = useState('approve'); // 'approve' or 'reject'
  const [approvalForm] = Form.useForm();
  
  // 统计数据
  const [statsData, setStatsData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });

  // 组件挂载时加载数据
  useEffect(() => {
    fetchCorrectionList();
    fetchStatsData();
  }, []);

  // 模拟获取修正申请单列表
  const fetchCorrectionList = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData = Array.from({ length: 20 }, (_, index) => ({
        id: `CR${String(2023001 + index).padStart(6, '0')}`,
        title: `销售数据修正申请单-${index + 1}`,
        orderNo: `ORD${String(10001 + index).padStart(5, '0')}`,
        station: `加油站 ${index % 5 + 1}`,
        stationId: `ST${String(10001 + index % 5).padStart(5, '0')}`,
        correctionType: index % 3 === 0 ? 'price' : (index % 3 === 1 ? 'volume' : 'payment'),
        correctionTypeName: index % 3 === 0 ? '价格修正' : (index % 3 === 1 ? '数量修正' : '支付方式修正'),
        originalValue: index % 3 === 0 ? (7.5 + Math.random()).toFixed(2) : (index % 3 === 1 ? Math.floor(50 + Math.random() * 50) : '现金'),
        correctedValue: index % 3 === 0 ? (7.5 + Math.random()).toFixed(2) : (index % 3 === 1 ? Math.floor(50 + Math.random() * 50) : '微信支付'),
        reason: `由于${index % 3 === 0 ? '价格录入错误' : (index % 3 === 1 ? '数量录入错误' : '支付方式选择错误')}，需要进行修正`,
        status: index < 5 ? 'completed' : (index < 10 ? 'approved' : (index < 15 ? 'pending' : 'rejected')),
        createTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
        approveTime: index < 10 ? dayjs().subtract(index - 2, 'day').format('YYYY-MM-DD HH:mm:ss') : null,
        creator: `操作员${index % 3 + 1}`,
        approver: index < 10 ? `审批人${index % 2 + 1}` : null,
        oilType: `${index % 3 === 0 ? '92#' : (index % 3 === 1 ? '95#' : '0#')}${index % 3 === 2 ? '柴油' : '汽油'}`,
        amount: Math.floor(100 + Math.random() * 500),
      }));
      setCorrectionList(mockData);
      setLoading(false);
    }, 500);
  };

  // 模拟获取统计数据
  const fetchStatsData = () => {
    // 模拟API请求
    setTimeout(() => {
      setStatsData({
        total: 100,
        pending: 25,
        approved: 35,
        rejected: 15,
        completed: 25,
        byType: [
          { type: '价格修正', count: 40, percent: 40 },
          { type: '数量修正', count: 35, percent: 35 },
          { type: '支付方式修正', count: 25, percent: 25 }
        ],
        byStation: [
          { station: '加油站 1', count: 25, percent: 25 },
          { station: '加油站 2', count: 20, percent: 20 },
          { station: '加油站 3', count: 18, percent: 18 },
          { station: '加油站 4', count: 22, percent: 22 },
          { station: '加油站 5', count: 15, percent: 15 }
        ],
        byMonth: [
          { month: '1月', count: 8 },
          { month: '2月', count: 10 },
          { month: '3月', count: 12 },
          { month: '4月', count: 9 },
          { month: '5月', count: 11 },
          { month: '6月', count: 13 },
          { month: '7月', count: 15 },
          { month: '8月', count: 10 },
          { month: '9月', count: 8 },
          { month: '10月', count: 7 },
          { month: '11月', count: 9 },
          { month: '12月', count: 11 }
        ]
      });
    }, 600);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实际应用中这里应该调用API进行搜索
    message.success('搜索成功');
    fetchCorrectionList(); // 模拟搜索后刷新数据
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 处理添加新修正申请
  const handleAdd = () => {
    setEditingCorrection(null);
    form.resetFields();
    form.setFieldsValue({
      correctionType: 'price',
      status: 'pending'
    });
    setModalVisible(true);
  };

  // 处理编辑修正申请
  const handleEdit = (record) => {
    setEditingCorrection(record);
    form.setFieldsValue({
      ...record,
      correctionType: record.correctionType,
    });
    setModalVisible(true);
  };

  // 处理删除修正申请
  const handleDelete = (id) => {
    console.log('删除修正申请:', id);
    message.success(`删除修正申请 ${id} 成功`);
    setCorrectionList(correctionList.filter(item => item.id !== id));
  };

  // 处理查看详情
  const handleViewDetail = (id) => {
    console.log('查看详情:', id);
    setDetailLoading(true);
    setDrawerVisible(true);
    
    // 模拟API请求获取详情
    setTimeout(() => {
      const correction = correctionList.find(item => item.id === id);
      if (correction) {
        const detailData = {
          ...correction,
          approvalSteps: [
            {
              title: '创建申请',
              status: 'finish',
              description: correction.creator,
              time: correction.createTime
            },
            {
              title: '部门审批',
              status: correction.status === 'rejected' ? 'error' : 
                     (correction.status === 'pending' ? 'wait' : 'finish'),
              description: '部门经理',
              time: correction.status === 'pending' || correction.status === 'rejected' ? null : 
                    dayjs(correction.createTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
            },
            {
              title: '财务审批',
              status: correction.status === 'pending' || correction.status === 'rejected' ? 'wait' : 
                     (correction.status === 'approved' ? 'process' : 'finish'),
              description: '财务经理',
              time: correction.status === 'pending' || correction.status === 'rejected' ? null : 
                    correction.approveTime
            },
            {
              title: '完成修正',
              status: correction.status === 'completed' ? 'finish' : 'wait',
              description: correction.status === 'completed' ? '已完成' : '待完成',
              time: correction.status === 'completed' ? 
                    dayjs(correction.approveTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss') : null
            }
          ],
          approvalLogs: [
            {
              action: '创建',
              operator: correction.creator,
              time: correction.createTime,
              comment: '创建销售数据修正申请单'
            }
          ],
          orderDetails: {
            orderNo: correction.orderNo,
            orderTime: dayjs(correction.createTime).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            oilType: correction.oilType,
            volume: Math.floor(50 + Math.random() * 50),
            price: (7.5 + Math.random()).toFixed(2),
            amount: correction.amount,
            paymentMethod: correction.correctionType === 'payment' ? correction.originalValue : '现金',
            operator: `收银员${Math.floor(Math.random() * 5) + 1}`,
            gunNo: `${Math.floor(Math.random() * 8) + 1}号枪`
          }
        };

        // 添加审批日志
        if (correction.status !== 'pending') {
          detailData.approvalLogs.push({
            action: correction.status === 'rejected' ? '驳回' : '审批通过',
            operator: '部门经理',
            time: dayjs(correction.createTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            comment: correction.status === 'rejected' ? '申请信息有误，请修正后重新提交' : '同意销售数据修正申请'
          });
        }

        if (correction.status === 'approved' || correction.status === 'completed') {
          detailData.approvalLogs.push({
            action: '审批通过',
            operator: correction.approver,
            time: correction.approveTime,
            comment: '同意销售数据修正申请，请尽快完成修正'
          });
        }

        if (correction.status === 'completed') {
          detailData.approvalLogs.push({
            action: '完成修正',
            operator: `系统管理员`,
            time: dayjs(correction.approveTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            comment: '已完成销售数据修正'
          });
        }

        setCurrentCorrection(detailData);
      }
      setDetailLoading(false);
    }, 500);
  };

  // 处理表单提交
  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values);
      
      // 构建修正申请对象
      const correctionObj = {
        ...values,
        id: editingCorrection ? editingCorrection.id : `CR${String(2023001 + correctionList.length).padStart(6, '0')}`,
        title: `销售数据修正申请单-${correctionList.length + 1}`,
        correctionTypeName: values.correctionType === 'price' ? '价格修正' : 
                           (values.correctionType === 'volume' ? '数量修正' : '支付方式修正'),
        createTime: editingCorrection ? editingCorrection.createTime : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        creator: editingCorrection ? editingCorrection.creator : '当前用户',
        status: values.status || 'pending',
      };
      
      if (editingCorrection) {
        // 更新现有修正申请
        setCorrectionList(correctionList.map(item => 
          item.id === editingCorrection.id ? correctionObj : item
        ));
        message.success('更新修正申请成功');
      } else {
        // 添加新修正申请
        setCorrectionList([correctionObj, ...correctionList]);
        message.success('添加修正申请成功');
      }
      
      setModalVisible(false);
    });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'approved':
        return <Tag color="processing">已审批</Tag>;
      case 'pending':
        return <Tag color="warning">待审批</Tag>;
      case 'rejected':
        return <Tag color="error">已驳回</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // 处理关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setCurrentCorrection(null);
  };

  // 处理打印
  const handlePrint = () => {
    message.success('打印功能开发中');
  };

  // 处理导出
  const handleExport = () => {
    message.success('导出功能开发中');
  };

  // 处理审批
  const handleApproval = (type) => {
    setApprovalType(type);
    approvalForm.resetFields();
    setApprovalModalVisible(true);
  };

  // 处理审批提交
  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(values => {
      console.log('审批提交:', values);
      message.success(`${approvalType === 'approve' ? '审批通过' : '驳回'}成功`);
      setApprovalModalVisible(false);
      
      // 更新状态
      if (approvalType === 'approve') {
        const updatedCorrection = {
          ...currentCorrection,
          status: 'approved',
          approveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          approver: '当前用户',
          approvalSteps: currentCorrection.approvalSteps.map((step, index) => {
            if (index === 1) {
              return { ...step, status: 'finish', time: dayjs().format('YYYY-MM-DD HH:mm:ss') };
            } else if (index === 2) {
              return { ...step, status: 'process', time: dayjs().format('YYYY-MM-DD HH:mm:ss') };
            }
            return step;
          }),
          approvalLogs: [
            ...currentCorrection.approvalLogs,
            {
              action: '审批通过',
              operator: '当前用户',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              comment: values.comment
            }
          ]
        };
        setCurrentCorrection(updatedCorrection);
        
        // 更新列表中的数据
        setCorrectionList(correctionList.map(item => 
          item.id === currentCorrection.id ? {
            ...item,
            status: 'approved',
            approveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            approver: '当前用户'
          } : item
        ));
      } else {
        const updatedCorrection = {
          ...currentCorrection,
          status: 'rejected',
          approvalSteps: currentCorrection.approvalSteps.map((step, index) => {
            if (index === 1) {
              return { ...step, status: 'error', time: dayjs().format('YYYY-MM-DD HH:mm:ss') };
            }
            return step;
          }),
          approvalLogs: [
            ...currentCorrection.approvalLogs,
            {
              action: '审批驳回',
              operator: '当前用户',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              comment: values.comment
            }
          ]
        };
        setCurrentCorrection(updatedCorrection);
        
        // 更新列表中的数据
        setCorrectionList(correctionList.map(item => 
          item.id === currentCorrection.id ? {
            ...item,
            status: 'rejected'
          } : item
        ));
      }
    });
  };

  // 处理完成修正
  const handleComplete = (id) => {
    console.log('完成修正:', id);
    message.success(`完成修正 ${id} 成功`);
    
    // 更新列表中的数据
    setCorrectionList(correctionList.map(item => 
      item.id === id ? {
        ...item,
        status: 'completed'
      } : item
    ));
    
    // 如果当前正在查看该修正申请的详情，也需要更新详情数据
    if (currentCorrection && currentCorrection.id === id) {
      const updatedCorrection = {
        ...currentCorrection,
        status: 'completed',
        approvalSteps: currentCorrection.approvalSteps.map((step, index) => {
          if (index === 3) {
            return { 
              ...step, 
              status: 'finish', 
              time: dayjs().format('YYYY-MM-DD HH:mm:ss') 
            };
          }
          return step;
        }),
        approvalLogs: [
          ...currentCorrection.approvalLogs,
          {
            action: '完成修正',
            operator: '当前用户',
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            comment: '已完成销售数据修正'
          }
        ]
      };
      setCurrentCorrection(updatedCorrection);
    }
  };

  return (
    <div className="correction-management">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              style={{ marginRight: 16 }}
              onClick={() => navigate('/sales/oil')}
            />
            <span>销售数据修正管理</span>
          </div>
        }
        bordered={false}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane tab="修正申请单列表" key="list">
            {/* 搜索表单 */}
            <Form
              form={searchForm}
              layout="horizontal"
              onFinish={handleSearch}
              className="search-form"
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name="id" label="申请单号">
                    <Input placeholder="请输入申请单号" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="orderNo" label="订单号">
                    <Input placeholder="请输入订单号" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="station" label="油站">
                    <Select placeholder="请选择油站" allowClear>
                      <Option value="ST10001">加油站 1</Option>
                      <Option value="ST10002">加油站 2</Option>
                      <Option value="ST10003">加油站 3</Option>
                      <Option value="ST10004">加油站 4</Option>
                      <Option value="ST10005">加油站 5</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="correctionType" label="修正类型">
                    <Select placeholder="请选择修正类型" allowClear>
                      <Option value="price">价格修正</Option>
                      <Option value="volume">数量修正</Option>
                      <Option value="payment">支付方式修正</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name="status" label="状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="pending">待审批</Option>
                      <Option value="approved">已审批</Option>
                      <Option value="rejected">已驳回</Option>
                      <Option value="completed">已完成</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="dateRange" label="创建时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button onClick={handleReset}>重置</Button>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      搜索
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                      新建修正申请
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                      导出
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>

            {/* 修正申请列表表格 */}
            <Table
              columns={[
                {
                  title: '申请单号',
                  dataIndex: 'id',
                  key: 'id',
                  width: 120,
                },
                {
                  title: '订单号',
                  dataIndex: 'orderNo',
                  key: 'orderNo',
                  width: 120,
                },
                {
                  title: '油站',
                  dataIndex: 'station',
                  key: 'station',
                  width: 120,
                },
                {
                  title: '修正类型',
                  dataIndex: 'correctionTypeName',
                  key: 'correctionTypeName',
                  width: 100,
                },
                {
                  title: '原值',
                  dataIndex: 'originalValue',
                  key: 'originalValue',
                  width: 100,
                },
                {
                  title: '修正值',
                  dataIndex: 'correctedValue',
                  key: 'correctedValue',
                  width: 100,
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 100,
                  render: (status) => getStatusTag(status)
                },
                {
                  title: '创建时间',
                  dataIndex: 'createTime',
                  key: 'createTime',
                  width: 180,
                },
                {
                  title: '创建人',
                  dataIndex: 'creator',
                  key: 'creator',
                  width: 100,
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 200,
                  fixed: 'right',
                  render: (_, record) => (
                    <Space size="small">
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={() => handleViewDetail(record.id)}
                      >
                        详情
                      </Button>
                      
                      {record.status === 'pending' && (
                        <>
                          <Button 
                            type="link" 
                            size="small" 
                            onClick={() => handleEdit(record)}
                          >
                            编辑
                          </Button>
                          <Popconfirm
                            title="确定要删除此修正申请吗?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button 
                              type="link" 
                              danger 
                              size="small"
                            >
                              删除
                            </Button>
                          </Popconfirm>
                        </>
                      )}
                      
                      {record.status === 'approved' && (
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => handleComplete(record.id)}
                        >
                          完成修正
                        </Button>
                      )}
                    </Space>
                  ),
                },
              ]}
              dataSource={correctionList}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              scroll={{ x: 1500 }}
            />
          </TabPane>
          <TabPane tab="统计分析" key="stats">
            <Row gutter={16}>
              <Col span={4}>
                <Card className="stats-card">
                  <Statistic
                    title="总申请数"
                    value={statsData.total}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card className="stats-card">
                  <Statistic
                    title="待审批"
                    value={statsData.pending}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card className="stats-card">
                  <Statistic
                    title="已审批"
                    value={statsData.approved}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card className="stats-card">
                  <Statistic
                    title="已驳回"
                    value={statsData.rejected}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card className="stats-card">
                  <Statistic
                    title="已完成"
                    value={statsData.completed}
                    valueStyle={{ color: '#13c2c2' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card className="stats-card">
                  <Statistic
                    title="完成率"
                    value={statsData.total ? Math.round((statsData.completed / statsData.total) * 100) : 0}
                    suffix="%"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Divider orientation="left">按修正类型统计</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="修正类型分布" className="stats-card">
                  {statsData.byType && statsData.byType.map((item, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.type}</span>
                        <span>{item.count} ({item.percent}%)</span>
                      </div>
                      <Progress percent={item.percent} status="active" />
                    </div>
                  ))}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="油站分布" className="stats-card">
                  {statsData.byStation && statsData.byStation.map((item, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.station}</span>
                        <span>{item.count} ({item.percent}%)</span>
                      </div>
                      <Progress percent={item.percent} status="active" />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
            
            <Divider orientation="left">月度统计</Divider>
            <Card title="月度修正申请数量" className="stats-card">
              <div style={{ height: 300, display: 'flex', alignItems: 'flex-end' }}>
                {statsData.byMonth && statsData.byMonth.map((item, index) => {
                  const maxCount = Math.max(...statsData.byMonth.map(m => m.count));
                  const height = (item.count / maxCount) * 100;
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        flex: 1, 
                        margin: '0 4px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <div 
                        style={{ 
                          width: '100%', 
                          height: `${height}%`, 
                          backgroundColor: '#1890ff', 
                          borderRadius: '4px 4px 0 0',
                          position: 'relative'
                        }}
                      >
                        <div style={{ 
                          position: 'absolute', 
                          top: -20, 
                          width: '100%', 
                          textAlign: 'center' 
                        }}>
                          {item.count}
                        </div>
                      </div>
                      <div style={{ marginTop: 8 }}>{item.month}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
            
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button icon={<FileExcelOutlined />} onClick={handleExport}>
                导出统计数据
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 添加/编辑修正申请模态框 */}
      <Modal
        title={editingCorrection ? '编辑修正申请' : '新建修正申请'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="orderNo"
            label="订单号"
            rules={[{ required: true, message: '请输入订单号' }]}
          >
            <Input placeholder="请输入订单号" />
          </Form.Item>
          
          <Form.Item
            name="stationId"
            label="油站"
            rules={[{ required: true, message: '请选择油站' }]}
          >
            <Select placeholder="请选择油站">
              <Option value="ST10001">加油站 1</Option>
              <Option value="ST10002">加油站 2</Option>
              <Option value="ST10003">加油站 3</Option>
              <Option value="ST10004">加油站 4</Option>
              <Option value="ST10005">加油站 5</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="correctionType"
            label="修正类型"
            rules={[{ required: true, message: '请选择修正类型' }]}
          >
            <Select placeholder="请选择修正类型">
              <Option value="price">价格修正</Option>
              <Option value="volume">数量修正</Option>
              <Option value="payment">支付方式修正</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.correctionType !== currentValues.correctionType}
          >
            {({ getFieldValue }) => {
              const correctionType = getFieldValue('correctionType');
              
              return (
                <>
                  <Form.Item
                    name="originalValue"
                    label="原值"
                    rules={[{ required: true, message: '请输入原值' }]}
                  >
                    {correctionType === 'payment' ? (
                      <Select placeholder="请选择原支付方式">
                        <Option value="现金">现金</Option>
                        <Option value="微信支付">微信支付</Option>
                        <Option value="支付宝">支付宝</Option>
                        <Option value="银行卡">银行卡</Option>
                        <Option value="会员卡">会员卡</Option>
                      </Select>
                    ) : (
                      <Input 
                        type={correctionType === 'price' ? 'number' : 'number'} 
                        placeholder={correctionType === 'price' ? '请输入原价格' : '请输入原数量'} 
                        step={correctionType === 'price' ? '0.01' : '1'}
                      />
                    )}
                  </Form.Item>
                  
                  <Form.Item
                    name="correctedValue"
                    label="修正值"
                    rules={[{ required: true, message: '请输入修正值' }]}
                  >
                    {correctionType === 'payment' ? (
                      <Select placeholder="请选择修正后支付方式">
                        <Option value="现金">现金</Option>
                        <Option value="微信支付">微信支付</Option>
                        <Option value="支付宝">支付宝</Option>
                        <Option value="银行卡">银行卡</Option>
                        <Option value="会员卡">会员卡</Option>
                      </Select>
                    ) : (
                      <Input 
                        type={correctionType === 'price' ? 'number' : 'number'} 
                        placeholder={correctionType === 'price' ? '请输入修正后价格' : '请输入修正后数量'} 
                        step={correctionType === 'price' ? '0.01' : '1'}
                      />
                    )}
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>
          
          <Form.Item
            name="oilType"
            label="油品类型"
            rules={[{ required: true, message: '请选择油品类型' }]}
          >
            <Select placeholder="请选择油品类型">
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="修正原因"
            rules={[{ required: true, message: '请输入修正原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入修正原因" />
          </Form.Item>
          
          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修正申请详情抽屉 */}
      <Drawer
        title="销售数据修正申请详情"
        width={800}
        placement="right"
        onClose={handleCloseDrawer}
        open={drawerVisible}
        className="detail-drawer"
        extra={
          <Space>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
            {currentCorrection?.status === 'pending' && (
              <>
                <Button 
                  type="primary" 
                  danger
                  onClick={() => handleApproval('reject')}
                >
                  驳回
                </Button>
                <Button 
                  type="primary"
                  onClick={() => handleApproval('approve')}
                >
                  审批通过
                </Button>
              </>
            )}
            {currentCorrection?.status === 'approved' && (
              <Button 
                type="primary"
                onClick={() => handleComplete(currentCorrection.id)}
              >
                完成修正
              </Button>
            )}
          </Space>
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : currentCorrection ? (
          <div className="correction-detail">
            <Descriptions 
              title="基本信息" 
              bordered 
              column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="申请单号">{currentCorrection.id}</Descriptions.Item>
              <Descriptions.Item label="订单号">{currentCorrection.orderNo}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(currentCorrection.status)}</Descriptions.Item>
              <Descriptions.Item label="油站">{currentCorrection.station}</Descriptions.Item>
              <Descriptions.Item label="修正类型">{currentCorrection.correctionTypeName}</Descriptions.Item>
              <Descriptions.Item label="油品类型">{currentCorrection.oilType}</Descriptions.Item>
              <Descriptions.Item label="原值">{currentCorrection.originalValue}</Descriptions.Item>
              <Descriptions.Item label="修正值">{currentCorrection.correctedValue}</Descriptions.Item>
              <Descriptions.Item label="修正原因">{currentCorrection.reason}</Descriptions.Item>
              <Descriptions.Item label="创建人">{currentCorrection.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentCorrection.createTime}</Descriptions.Item>
              <Descriptions.Item label="审批人">{currentCorrection.approver || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="detail-section">
              <h3>审批流程</h3>
              <Steps 
                current={currentCorrection.approvalSteps.findIndex(step => step.status === 'process')}
                status={currentCorrection.status === 'rejected' ? 'error' : 'process'}
                size="small"
                className="approval-steps"
              >
                {currentCorrection.approvalSteps.map((step, index) => (
                  <Steps.Step 
                    key={index} 
                    title={step.title} 
                    description={
                      <div>
                        <div>{step.description}</div>
                        {step.time && <div style={{ fontSize: '12px', color: '#999' }}>{step.time}</div>}
                      </div>
                    }
                    status={step.status}
                  />
                ))}
              </Steps>
            </div>

            <Divider />

            <div className="detail-section">
              <h3>订单信息</h3>
              <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="订单号">{currentCorrection.orderDetails.orderNo}</Descriptions.Item>
                <Descriptions.Item label="订单时间">{currentCorrection.orderDetails.orderTime}</Descriptions.Item>
                <Descriptions.Item label="油品类型">{currentCorrection.orderDetails.oilType}</Descriptions.Item>
                <Descriptions.Item label="数量">{currentCorrection.orderDetails.volume} 升</Descriptions.Item>
                <Descriptions.Item label="单价">{currentCorrection.orderDetails.price} 元/升</Descriptions.Item>
                <Descriptions.Item label="金额">{currentCorrection.orderDetails.amount} 元</Descriptions.Item>
                <Descriptions.Item label="支付方式">{currentCorrection.orderDetails.paymentMethod}</Descriptions.Item>
                <Descriptions.Item label="操作员">{currentCorrection.orderDetails.operator}</Descriptions.Item>
                <Descriptions.Item label="加油枪">{currentCorrection.orderDetails.gunNo}</Descriptions.Item>
              </Descriptions>
            </div>

            <Divider />

            <div className="detail-section">
              <h3>审批日志</h3>
              <Timeline mode="left">
                {currentCorrection.approvalLogs.map((log, index) => (
                  <Timeline.Item 
                    key={index}
                    label={log.time}
                    dot={
                      log.action.includes('创建') ? <FileTextOutlined /> :
                      log.action.includes('提交') ? <ExclamationCircleOutlined /> :
                      log.action.includes('通过') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                      log.action.includes('驳回') ? <CloseCircleOutlined style={{ color: '#f5222d' }} /> :
                      log.action.includes('完成') ? <CheckOutlined style={{ color: '#13c2c2' }} /> :
                      <ClockCircleOutlined />
                    }
                  >
                    <p><strong>{log.action}</strong> - {log.operator}</p>
                    <p>{log.comment}</p>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
        ) : (
          <Empty description="暂无数据" />
        )}
      </Drawer>

      {/* 审批模态框 */}
      <Modal
        title={`${approvalType === 'approve' ? '审批通过' : '驳回'}`}
        open={approvalModalVisible}
        onOk={handleApprovalSubmit}
        onCancel={() => setApprovalModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={approvalForm}
          layout="vertical"
        >
          <Form.Item
            name="comment"
            label="审批意见"
            rules={[{ required: true, message: '请输入审批意见' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder={`请输入${approvalType === 'approve' ? '审批通过' : '驳回'}意见`} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CorrectionManagement; 