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
  Popconfirm,
  Drawer,
  Descriptions,
  Steps,
  Divider,
  Statistic,
  Progress,
  Timeline,
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
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import '../target/index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TargetApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [targetList, setTargetList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  
  // 详情抽屉相关状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [oilTypeData, setOilTypeData] = useState([]);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalType, setApprovalType] = useState('approve'); // 'approve' or 'reject'
  const [approvalForm] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    fetchTargetList();
  }, []);

  // 模拟获取目标申请单列表
  const fetchTargetList = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData = Array.from({ length: 20 }, (_, index) => ({
        id: `TG${String(2023001 + index).padStart(6, '0')}`,
        title: `${dayjs().format('YYYY年')}第${Math.floor(index / 5) + 1}季度销售目标`,
        period: Math.floor(index / 5) + 1,
        year: dayjs().year(),
        periodType: index % 3 === 0 ? 'quarterly' : (index % 3 === 1 ? 'monthly' : 'yearly'),
        periodTypeName: index % 3 === 0 ? '季度' : (index % 3 === 1 ? '月度' : '年度'),
        station: `加油站 ${index % 5 + 1}`,
        stationId: `ST${String(10001 + index % 5).padStart(5, '0')}`,
        targetAmount: Math.floor(500000 + Math.random() * 500000),
        actualAmount: index < 10 ? Math.floor(400000 + Math.random() * 600000) : null,
        completionRate: index < 10 ? (Math.random() * 0.4 + 0.8).toFixed(2) : null,
        status: index < 5 ? 'completed' : (index < 10 ? 'in_progress' : (index < 15 ? 'pending' : 'draft')),
        createTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
        approveTime: index < 10 ? dayjs().subtract(index - 2, 'day').format('YYYY-MM-DD HH:mm:ss') : null,
        creator: `管理员${index % 3 + 1}`,
        approver: index < 10 ? `审批人${index % 2 + 1}` : null,
      }));
      setTargetList(mockData);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实际应用中这里应该调用API进行搜索
    message.success('搜索成功');
    fetchTargetList(); // 模拟搜索后刷新数据
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 处理添加新目标
  const handleAdd = () => {
    setEditingTarget(null);
    form.resetFields();
    form.setFieldsValue({
      year: dayjs().year(),
      periodType: 'quarterly',
      period: Math.ceil(dayjs().month() / 3),
      status: 'draft'
    });
    setModalVisible(true);
  };

  // 处理编辑目标
  const handleEdit = (record) => {
    setEditingTarget(record);
    form.setFieldsValue({
      ...record,
      periodType: record.periodType,
      period: record.period,
    });
    setModalVisible(true);
  };

  // 处理删除目标
  const handleDelete = (id) => {
    console.log('删除目标:', id);
    message.success(`删除目标 ${id} 成功`);
    setTargetList(targetList.filter(item => item.id !== id));
  };

  // 处理提交审批
  const handleSubmit = (id) => {
    console.log('提交审批:', id);
    message.success(`提交目标 ${id} 审批成功`);
    setTargetList(targetList.map(item => 
      item.id === id ? { ...item, status: 'pending' } : item
    ));
  };

  // 处理查看详情
  const handleViewDetail = (id) => {
    console.log('查看详情:', id);
    setDetailLoading(true);
    setDrawerVisible(true);
    fetchTargetDetail(id);
    fetchOilTypeData(id);
  };

  // 模拟获取目标详情数据
  const fetchTargetDetail = (id) => {
    // 模拟API请求
    setTimeout(() => {
      const target = targetList.find(item => item.id === id);
      if (target) {
        const detailData = {
          ...target,
          approvalSteps: [
            {
              title: '创建申请',
              status: 'finish',
              description: target.creator,
              time: target.createTime
            },
            {
              title: '部门审批',
              status: target.status === 'draft' ? 'wait' : 'finish',
              description: '部门经理',
              time: target.status === 'draft' ? null : dayjs(target.createTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
            },
            {
              title: '总经理审批',
              status: target.status === 'draft' || target.status === 'pending' ? 'wait' : 'finish',
              description: '总经理',
              time: target.status === 'draft' || target.status === 'pending' ? null : target.approveTime
            },
            {
              title: '执行中',
              status: target.status === 'in_progress' ? 'process' : (target.status === 'completed' ? 'finish' : 'wait'),
              description: target.status === 'in_progress' ? '目标执行中' : (target.status === 'completed' ? '已完成' : '待执行'),
              time: target.status === 'in_progress' || target.status === 'completed' ? target.approveTime : null
            },
            {
              title: '完成',
              status: target.status === 'completed' ? 'finish' : 'wait',
              description: target.status === 'completed' ? '已完成' : '待完成',
              time: target.status === 'completed' ? dayjs(target.approveTime).add(30, 'day').format('YYYY-MM-DD HH:mm:ss') : null
            }
          ],
          approvalLogs: [
            {
              action: '创建',
              operator: target.creator,
              time: target.createTime,
              comment: '创建销售目标申请单'
            }
          ]
        };

        // 添加审批日志
        if (target.status !== 'draft') {
          detailData.approvalLogs.push({
            action: '提交审批',
            operator: target.creator,
            time: dayjs(target.createTime).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            comment: '提交审批'
          });
        }

        if (target.status === 'in_progress' || target.status === 'completed') {
          detailData.approvalLogs.push({
            action: '审批通过',
            operator: '部门经理',
            time: dayjs(target.createTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            comment: '同意销售目标申请'
          });
          
          detailData.approvalLogs.push({
            action: '审批通过',
            operator: target.approver,
            time: target.approveTime,
            comment: '同意销售目标申请，请认真执行'
          });
        }

        setCurrentTarget(detailData);
      }
      setDetailLoading(false);
    }, 500);
  };

  // 模拟获取油品类型数据
  const fetchOilTypeData = (id) => {
    // 模拟API请求
    setTimeout(() => {
      const target = targetList.find(item => item.id === id);
      if (target) {
        const mockData = [
          {
            key: '1',
            oilType: '92#汽油',
            targetAmount: Math.round(target.targetAmount * 0.45),
            actualAmount: target.actualAmount ? Math.round(target.actualAmount * 0.45) : null,
            completionRate: target.completionRate ? parseFloat(target.completionRate) : null,
            targetVolume: Math.round(target.targetAmount * 0.45 / 7.5),
            actualVolume: target.actualAmount ? Math.round(target.actualAmount * 0.45 / 7.5) : null,
          },
          {
            key: '2',
            oilType: '95#汽油',
            targetAmount: Math.round(target.targetAmount * 0.35),
            actualAmount: target.actualAmount ? Math.round(target.actualAmount * 0.35) : null,
            completionRate: target.completionRate ? parseFloat(target.completionRate) + 0.01 : null,
            targetVolume: Math.round(target.targetAmount * 0.35 / 8),
            actualVolume: target.actualAmount ? Math.round(target.actualAmount * 0.35 / 8) : null,
          },
          {
            key: '3',
            oilType: '98#汽油',
            targetAmount: Math.round(target.targetAmount * 0.1),
            actualAmount: target.actualAmount ? Math.round(target.actualAmount * 0.1) : null,
            completionRate: target.completionRate ? parseFloat(target.completionRate) - 0.05 : null,
            targetVolume: Math.round(target.targetAmount * 0.1 / 8.5),
            actualVolume: target.actualAmount ? Math.round(target.actualAmount * 0.1 / 8.5) : null,
          },
          {
            key: '4',
            oilType: '0#柴油',
            targetAmount: Math.round(target.targetAmount * 0.1),
            actualAmount: target.actualAmount ? Math.round(target.actualAmount * 0.1) : null,
            completionRate: target.completionRate ? parseFloat(target.completionRate) - 0.01 : null,
            targetVolume: Math.round(target.targetAmount * 0.1 / 7),
            actualVolume: target.actualAmount ? Math.round(target.actualAmount * 0.1 / 7) : null,
          }
        ];
        setOilTypeData(mockData);
      }
    }, 600);
  };

  // 处理表单提交
  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values);
      
      // 构建目标对象
      const targetObj = {
        ...values,
        id: editingTarget ? editingTarget.id : `TG${String(2023001 + targetList.length).padStart(6, '0')}`,
        title: `${values.year}年${values.periodType === 'yearly' ? '' : values.periodType === 'quarterly' ? `第${values.period}季度` : `${values.period}月`}销售目标`,
        periodTypeName: values.periodType === 'yearly' ? '年度' : (values.periodType === 'quarterly' ? '季度' : '月度'),
        createTime: editingTarget ? editingTarget.createTime : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        creator: editingTarget ? editingTarget.creator : '当前用户',
        status: values.status || 'draft',
      };
      
      if (editingTarget) {
        // 更新现有目标
        setTargetList(targetList.map(item => 
          item.id === editingTarget.id ? targetObj : item
        ));
        message.success('更新目标成功');
      } else {
        // 添加新目标
        setTargetList([targetObj, ...targetList]);
        message.success('添加目标成功');
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
      case 'in_progress':
        return <Tag color="processing">进行中</Tag>;
      case 'pending':
        return <Tag color="warning">待审批</Tag>;
      case 'draft':
        return <Tag color="default">草稿</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // 处理关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setCurrentTarget(null);
    setOilTypeData([]);
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
        const updatedTarget = {
          ...currentTarget,
          status: 'in_progress',
          approveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          approver: '当前用户',
          approvalSteps: currentTarget.approvalSteps.map((step, index) => {
            if (index === 2) {
              return { ...step, status: 'finish', time: dayjs().format('YYYY-MM-DD HH:mm:ss') };
            } else if (index === 3) {
              return { ...step, status: 'process', time: dayjs().format('YYYY-MM-DD HH:mm:ss') };
            }
            return step;
          }),
          approvalLogs: [
            ...currentTarget.approvalLogs,
            {
              action: '审批通过',
              operator: '当前用户',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              comment: values.comment
            }
          ]
        };
        setCurrentTarget(updatedTarget);
        
        // 更新列表中的数据
        setTargetList(targetList.map(item => 
          item.id === currentTarget.id ? {
            ...item,
            status: 'in_progress',
            approveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            approver: '当前用户'
          } : item
        ));
      } else {
        const updatedTarget = {
          ...currentTarget,
          status: 'draft',
          approvalSteps: currentTarget.approvalSteps.map((step, index) => {
            if (index === 2) {
              return { ...step, status: 'error' };
            }
            return step;
          }),
          approvalLogs: [
            ...currentTarget.approvalLogs,
            {
              action: '审批驳回',
              operator: '当前用户',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              comment: values.comment
            }
          ]
        };
        setCurrentTarget(updatedTarget);
        
        // 更新列表中的数据
        setTargetList(targetList.map(item => 
          item.id === currentTarget.id ? {
            ...item,
            status: 'draft'
          } : item
        ));
      }
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '目标编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '目标名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '周期类型',
      dataIndex: 'periodTypeName',
      key: 'periodTypeName',
      width: 100,
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 80,
    },
    {
      title: '周期',
      key: 'periodDisplay',
      width: 80,
      render: (_, record) => {
        if (record.periodType === 'yearly') return '全年';
        if (record.periodType === 'quarterly') return `Q${record.period}`;
        return `${record.period}月`;
      }
    },
    {
      title: '油站',
      dataIndex: 'station',
      key: 'station',
      width: 120,
    },
    {
      title: '目标金额(元)',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      width: 120,
      render: (text) => text?.toLocaleString('zh-CN')
    },
    {
      title: '实际金额(元)',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 120,
      render: (text) => text ? text.toLocaleString('zh-CN') : '-'
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 100,
      render: (text) => {
        if (!text) return '-';
        const rate = parseFloat(text);
        let color = 'green';
        if (rate < 0.8) color = 'red';
        else if (rate < 1) color = 'orange';
        return <span style={{ color }}>{(rate * 100).toFixed(0)}%</span>;
      }
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
          
          {record.status === 'draft' && (
            <>
              <Button 
                type="link" 
                size="small" 
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定要删除此目标吗?"
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
              <Button 
                type="link" 
                size="small" 
                onClick={() => handleSubmit(record.id)}
              >
                提交
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 油品类型表格列配置
  const oilTypeColumns = [
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 120,
    },
    {
      title: '目标金额(元)',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      width: 150,
      render: (text) => text?.toLocaleString('zh-CN')
    },
    {
      title: '实际金额(元)',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 150,
      render: (text) => text ? text.toLocaleString('zh-CN') : '-'
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 150,
      render: (text) => {
        if (!text) return '-';
        const rate = parseFloat(text);
        let color = 'green';
        if (rate < 0.8) color = 'red';
        else if (rate < 1) color = 'orange';
        return <span style={{ color }}>{(rate * 100).toFixed(0)}%</span>;
      }
    },
    {
      title: '目标销量(升)',
      dataIndex: 'targetVolume',
      key: 'targetVolume',
      width: 150,
      render: (text) => text?.toLocaleString('zh-CN')
    },
    {
      title: '实际销量(升)',
      dataIndex: 'actualVolume',
      key: 'actualVolume',
      width: 150,
      render: (text) => text ? text.toLocaleString('zh-CN') : '-'
    }
  ];

  return (
    <div className="target-application">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              style={{ marginRight: 16 }}
              onClick={() => navigate('/sales/oil')}
            />
            <span>销售目标申请单</span>
          </div>
        }
        bordered={false}
      >
        {/* 搜索表单 */}
        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="id" label="目标编号">
                <Input placeholder="请输入目标编号" allowClear />
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
              <Form.Item name="periodType" label="周期类型">
                <Select placeholder="请选择周期类型" allowClear>
                  <Option value="yearly">年度</Option>
                  <Option value="quarterly">季度</Option>
                  <Option value="monthly">月度</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="draft">草稿</Option>
                  <Option value="pending">待审批</Option>
                  <Option value="in_progress">进行中</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="year" label="年份">
                <Select placeholder="请选择年份" allowClear>
                  <Option value={dayjs().year() - 1}>{dayjs().year() - 1}年</Option>
                  <Option value={dayjs().year()}>{dayjs().year()}年</Option>
                  <Option value={dayjs().year() + 1}>{dayjs().year() + 1}年</Option>
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
                  新建目标
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>

        {/* 目标列表表格 */}
        <Table
          columns={columns}
          dataSource={targetList}
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
      </Card>

      {/* 添加/编辑目标模态框 */}
      <Modal
        title={editingTarget ? '编辑销售目标' : '新建销售目标'}
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
            name="year"
            label="年份"
            rules={[{ required: true, message: '请选择年份' }]}
          >
            <Select placeholder="请选择年份">
              <Option value={dayjs().year() - 1}>{dayjs().year() - 1}年</Option>
              <Option value={dayjs().year()}>{dayjs().year()}年</Option>
              <Option value={dayjs().year() + 1}>{dayjs().year() + 1}年</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="periodType"
            label="周期类型"
            rules={[{ required: true, message: '请选择周期类型' }]}
          >
            <Select placeholder="请选择周期类型">
              <Option value="yearly">年度</Option>
              <Option value="quarterly">季度</Option>
              <Option value="monthly">月度</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.periodType !== currentValues.periodType}
          >
            {({ getFieldValue }) => {
              const periodType = getFieldValue('periodType');
              if (periodType === 'yearly') {
                return null;
              }
              
              return (
                <Form.Item
                  name="period"
                  label="周期"
                  rules={[{ required: true, message: '请选择周期' }]}
                >
                  {periodType === 'quarterly' ? (
                    <Select placeholder="请选择季度">
                      <Option value={1}>第一季度</Option>
                      <Option value={2}>第二季度</Option>
                      <Option value={3}>第三季度</Option>
                      <Option value={4}>第四季度</Option>
                    </Select>
                  ) : (
                    <Select placeholder="请选择月份">
                      {Array.from({ length: 12 }, (_, i) => (
                        <Option key={i + 1} value={i + 1}>{i + 1}月</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            }}
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
            name="targetAmount"
            label="目标金额(元)"
            rules={[
              { required: true, message: '请输入目标金额' },
              { type: 'number', min: 1, message: '目标金额必须大于0' }
            ]}
          >
            <Input type="number" placeholder="请输入目标金额" />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
          
          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 目标详情抽屉 */}
      <Drawer
        title="销售目标详情"
        width={800}
        placement="right"
        onClose={handleCloseDrawer}
        open={drawerVisible}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
            {currentTarget?.status === 'pending' && (
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
          </Space>
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : currentTarget ? (
          <div className="target-detail">
            <Descriptions 
              title="基本信息" 
              bordered 
              column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="目标编号">{currentTarget.id}</Descriptions.Item>
              <Descriptions.Item label="目标名称">{currentTarget.title}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(currentTarget.status)}</Descriptions.Item>
              <Descriptions.Item label="周期类型">{currentTarget.periodTypeName}</Descriptions.Item>
              <Descriptions.Item label="年份">{currentTarget.year}</Descriptions.Item>
              <Descriptions.Item label="周期">
                {currentTarget.periodType === 'yearly' ? '全年' : 
                 currentTarget.periodType === 'quarterly' ? `Q${currentTarget.period}` : 
                 `${currentTarget.period}月`}
              </Descriptions.Item>
              <Descriptions.Item label="油站">{currentTarget.station}</Descriptions.Item>
              <Descriptions.Item label="目标金额">
                {currentTarget.targetAmount?.toLocaleString('zh-CN')} 元
              </Descriptions.Item>
              <Descriptions.Item label="实际金额">
                {currentTarget.actualAmount ? `${currentTarget.actualAmount.toLocaleString('zh-CN')} 元` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="完成率" span={3}>
                {currentTarget.completionRate ? (
                  <Progress 
                    percent={parseFloat(currentTarget.completionRate) * 100} 
                    status={parseFloat(currentTarget.completionRate) >= 1 ? 'success' : 'active'}
                    format={percent => `${percent.toFixed(0)}%`}
                  />
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建人">{currentTarget.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentTarget.createTime}</Descriptions.Item>
              <Descriptions.Item label="审批人">{currentTarget.approver || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="detail-section">
              <h3>审批流程</h3>
              <Steps 
                current={currentTarget.approvalSteps.findIndex(step => step.status === 'process')}
                status={currentTarget.status === 'completed' ? 'finish' : 'process'}
                size="small"
                className="approval-steps"
              >
                {currentTarget.approvalSteps.map((step, index) => (
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
              <h3>油品销售目标明细</h3>
              <Table 
                columns={oilTypeColumns} 
                dataSource={oilTypeData}
                pagination={false}
                bordered
                scroll={{ x: 1000 }}
              />
            </div>

            <Divider />

            <div className="detail-section">
              <h3>审批日志</h3>
              <Timeline mode="left">
                {currentTarget.approvalLogs.map((log, index) => (
                  <Timeline.Item 
                    key={index}
                    label={log.time}
                    dot={
                      log.action.includes('创建') ? <FileTextOutlined /> :
                      log.action.includes('提交') ? <ExclamationCircleOutlined /> :
                      log.action.includes('通过') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                      log.action.includes('驳回') ? <CloseCircleOutlined style={{ color: '#f5222d' }} /> :
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

export default TargetApplication; 