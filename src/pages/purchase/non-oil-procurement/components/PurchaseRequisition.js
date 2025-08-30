import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  message,
  Popconfirm,
  Row,
  Col,
  Form,
  Badge,
  Tooltip,
  TreeSelect,
  Modal,
  Checkbox,
  Alert
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CopyOutlined,
  CheckOutlined,
  RollbackOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import RequisitionDetailModal from './RequisitionDetailModal';
import RequisitionFormModal from './RequisitionFormModal';
import purchaseRequisitionData from '../../../../mock/purchase/purchaseRequisition.json';
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PurchaseRequisition = () => {
  const [searchForm] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editRecord, setEditRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalRecord, setApprovalRecord] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 从 mock 数据加载采购渠道
  const procurementChannels = purchaseRequisitionData.procurementChannels;

  // 构建组织架构树数据
  const buildStationTreeData = () => {
    const { branches, serviceAreas, stations } = stationData;
    
    const tree = [{
      title: '江西交投化石能源公司',
      value: 'ROOT',
      key: 'ROOT',
      children: []
    }];
    
    branches.forEach(branch => {
      const branchNode = {
        title: branch.name,
        value: branch.id,
        key: branch.id,
        children: []
      };
      
      // 添加该分公司下的服务区
      const branchServiceAreas = serviceAreas.filter(sa => sa.branchId === branch.id);
      branchServiceAreas.forEach(serviceArea => {
        const serviceAreaNode = {
          title: serviceArea.name,
          value: serviceArea.id,
          key: serviceArea.id,
          children: []
        };
        
        // 添加该服务区下的加油站
        const serviceAreaStations = stations.filter(station => station.serviceAreaId === serviceArea.id);
        serviceAreaStations.forEach(station => {
          serviceAreaNode.children.push({
            title: station.name,
            value: station.id,
            key: station.id,
            isLeaf: true
          });
        });
        
        branchNode.children.push(serviceAreaNode);
      });
      
      tree[0].children.push(branchNode);
    });
    
    return tree;
  };

  // 从 mock 数据加载申请单数据
  const mockData = purchaseRequisitionData.purchaseRequisitions;

  // 状态配置
  const statusConfig = {
    'draft': { color: 'default', text: '草稿', badge: 'default' },
    'pending': { color: 'processing', text: '待审批', badge: 'processing' },
    'approved': { color: 'success', text: '已批准', badge: 'success' },
    'rejected': { color: 'error', text: '已驳回', badge: 'error' },
    'processed': { color: 'warning', text: '已处理', badge: 'warning' }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize]);

  // 加载数据
  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setDataSource(mockData);
      setPagination(prev => ({
        ...prev,
        total: mockData.length
      }));
      setLoading(false);
    }, 500);
  };

  // 搜索处理
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setLoading(true);
    // 模拟搜索
    setTimeout(() => {
      let filteredData = [...mockData];
      
      if (values.channel) {
        filteredData = filteredData.filter(item => item.channelId === values.channel);
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => item.status === values.status);
      }
      
      if (values.keyword) {
        filteredData = filteredData.filter(item => 
          item.requisitionNo.toLowerCase().includes(values.keyword.toLowerCase())
        );
      }
      
      if (values.dateRange && values.dateRange.length === 2) {
        const [start, end] = values.dateRange;
        filteredData = filteredData.filter(item => {
          const itemDate = dayjs(item.applicationDate);
          return itemDate.isAfter(start.subtract(1, 'day')) && itemDate.isBefore(end.add(1, 'day'));
        });
      }
      
      // 按分公司/加油站筛选
      if (values.stationId) {
        const { branches, serviceAreas, stations } = stationData;
        
        // 判断选择的是分公司、服务区还是加油站
        const isBranch = branches.find(b => b.id === values.stationId);
        const isServiceArea = serviceAreas.find(sa => sa.id === values.stationId);
        const isStation = stations.find(s => s.id === values.stationId);
        
        if (isBranch) {
          // 选择的是分公司，筛选该分公司下的所有加油站
          const branchStations = stations.filter(s => s.branchId === values.stationId);
          const stationIds = branchStations.map(s => s.id);
          filteredData = filteredData.filter(item => stationIds.includes(item.stationId));
        } else if (isServiceArea) {
          // 选择的是服务区，筛选该服务区下的所有加油站
          const serviceAreaStations = stations.filter(s => s.serviceAreaId === values.stationId);
          const stationIds = serviceAreaStations.map(s => s.id);
          filteredData = filteredData.filter(item => stationIds.includes(item.stationId));
        } else if (isStation) {
          // 选择的是具体加油站
          filteredData = filteredData.filter(item => item.stationId === values.stationId);
        }
      }
      
      setDataSource(filteredData);
      setPagination(prev => ({
        ...prev,
        total: filteredData.length,
        current: 1
      }));
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    loadData();
  };

  // 新建申请
  const handleCreate = () => {
    setEditRecord(null);
    setFormMode('create');
    setFormModalVisible(true);
  };

  // 编辑申请
  const handleEdit = (record) => {
    setEditRecord(record);
    setFormMode('edit');
    setFormModalVisible(true);
  };

  // 查看详情
  const handleView = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 删除申请
  const handleDelete = (record) => {
    setLoading(true);
    setTimeout(() => {
      const newData = dataSource.filter(item => item.id !== record.id);
      setDataSource(newData);
      setPagination(prev => ({
        ...prev,
        total: newData.length
      }));
      setLoading(false);
      message.success('删除成功');
    }, 500);
  };

  // 提交申请
  const handleSubmit = (record) => {
    setLoading(true);
    setTimeout(() => {
      const newData = dataSource.map(item => 
        item.id === record.id 
          ? { ...item, status: 'pending', updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : item
      );
      setDataSource(newData);
      setLoading(false);
      message.success('提交成功，等待审批');
    }, 500);
  };

  // 撤回申请
  const handleWithdraw = (record) => {
    setLoading(true);
    setTimeout(() => {
      const newData = dataSource.map(item => 
        item.id === record.id 
          ? { ...item, status: 'draft', updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : item
      );
      setDataSource(newData);
      setLoading(false);
      message.success('撤回成功');
    }, 500);
  };

  // 审批处理
  const handleApproval = (record, action) => {
    setApprovalRecord(record);
    setApprovalAction(action);
    setApprovalModalVisible(true);
    approvalForm.resetFields();
  };

  // 确认审批
  const handleApprovalConfirm = () => {
    approvalForm.validateFields().then(values => {
      const actionText = approvalAction === 'approve' ? '批准' : '驳回';
      
      Modal.confirm({
        title: `确认${actionText}`,
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>申请单号：{approvalRecord.requisitionNo}</p>
            <p>申请加油站：{approvalRecord.stationName}</p>
            <p>审批意见：{values.opinion || '无'}</p>
            <p style={{ color: '#1890ff' }}>确定要{actionText}这个采购申请吗？</p>
          </div>
        ),
        onOk: () => {
          const newStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
          
          // 模拟审批操作
          setDataSource(prev => prev.map(item => 
            item.id === approvalRecord.id 
              ? { 
                  ...item, 
                  status: newStatus,
                  approvalTime: new Date().toISOString(),
                  approvalOpinion: values.opinion,
                  approver: '当前用户' // 实际应该是登录用户
                }
              : item
          ));
          
          message.success(`申请单已${actionText}`);
          setApprovalModalVisible(false);
        }
      });
    });
  };

  // 批量审批
  const handleBatchApproval = (action) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要审批的申请单');
      return;
    }
    
    const actionText = action === 'approve' ? '批准' : '驳回';
    const selectedRecords = dataSource.filter(item => selectedRowKeys.includes(item.id));
    
    Modal.confirm({
      title: `批量${actionText}确认`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>即将{actionText} {selectedRowKeys.length} 个采购申请：</p>
          <ul style={{ maxHeight: 200, overflow: 'auto' }}>
            {selectedRecords.map(record => (
              <li key={record.id}>
                {record.requisitionNo} - {record.stationName}
              </li>
            ))}
          </ul>
          <p style={{ color: '#1890ff' }}>确定要执行批量{actionText}操作吗？</p>
        </div>
      ),
      onOk: () => {
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        
        setDataSource(prev => prev.map(item => 
          selectedRowKeys.includes(item.id)
            ? { 
                ...item, 
                status: newStatus,
                approvalTime: new Date().toISOString(),
                approvalOpinion: `批量${actionText}`,
                approver: '当前用户'
              }
            : item
        ));
        
        message.success(`已${actionText} ${selectedRowKeys.length} 个申请单`);
        setSelectedRowKeys([]);
      }
    });
  };

  // 复制申请
  const handleCopy = (record) => {
    setEditRecord({ ...record, requisitionNo: null, status: 'draft' }); // 清除编号和状态
    setFormMode('create');
    setFormModalVisible(true);
    message.info(`正在复制申请单：${record.requisitionNo}`);
  };

  // 表单弹窗确认
  const handleFormModalOk = (formData) => {
    setFormModalVisible(false);
    setEditRecord(null);
    loadData(); // 重新加载数据
  };

  // 表单弹窗取消
  const handleFormModalCancel = () => {
    setFormModalVisible(false);
    setEditRecord(null);
  };

  // 表格列定义
  const columns = [
    {
      title: '申请单号',
      dataIndex: 'requisitionNo',
      key: 'requisitionNo',
      width: 150,
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => handleView(record)}
          style={{ 
            padding: 0, 
            fontFamily: 'monospace',
            fontWeight: 500 
          }}
        >
          {text}
        </Button>
      )
    },
    {
      title: '采购渠道',
      dataIndex: 'channelName',
      key: 'channelName',
      width: 120,
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '申请加油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '商品概要',
      key: 'productSummary',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => {
        const summary = `${record.productSummary}... (共${record.productCount}项)`;
        return (
          <Tooltip title={summary}>
            <span>{summary}</span>
          </Tooltip>
        );
      }
    },
    {
      title: '零售总金额',
      dataIndex: 'estimatedAmount',
      key: 'estimatedAmount',
      width: 120,
      align: 'right',
      render: (amount) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>
          ¥{amount.toLocaleString()}
        </span>
      )
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100
    },
    {
      title: '申请日期',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      width: 110,
      sorter: (a, b) => dayjs(a.applicationDate).valueOf() - dayjs(b.applicationDate).valueOf()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = statusConfig[status];
        return <Badge status={config.badge} text={config.text} />;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        const { status } = record;
        
        // 根据状态动态显示操作按钮
        if (status === 'draft') {
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ borderRadius: '2px' }}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定要提交这个申请吗？"
                onConfirm={() => handleSubmit(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  style={{ borderRadius: '2px' }}
                >
                  提交
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要删除这个申请吗？"
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="primary"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ borderRadius: '2px' }}
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          );
        } else if (status === 'pending') {
          return (
            <Space size="small">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
                style={{ borderRadius: '2px' }}
              >
                查看
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApproval(record, 'approve')}
                style={{ borderRadius: '2px' }}
              >
                批准
              </Button>
              <Button
                type="primary"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleApproval(record, 'reject')}
                style={{ borderRadius: '2px' }}
              >
                驳回
              </Button>
              <Button
                size="small"
                icon={<RollbackOutlined />}
                onClick={() => handleWithdraw(record)}
                style={{ borderRadius: '2px' }}
              >
                撤回
              </Button>
            </Space>
          );
        } else {
          // approved, rejected, processed
          return (
            <Space size="small">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
                style={{ borderRadius: '2px' }}
              >
                查看
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => handleCopy(record)}
                style={{ borderRadius: '2px' }}
              >
                复制
              </Button>
            </Space>
          );
        }
      }
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          onFinish={handleSearch}
        >
          {/* 第一行：筛选条件 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="stationId" label="分公司/加油站">
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={buildStationTreeData()}
                  placeholder="请选择分公司/加油站"
                  allowClear
                  showSearch
                  treeDefaultExpandAll={false}
                  treeNodeFilterProp="title"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="channel" label="采购渠道">
                <Select placeholder="请选择采购渠道" allowClear>
                  {procurementChannels.map(channel => (
                    <Option key={channel.id} value={channel.id}>
                      {channel.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="status" label="申请单状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="draft">草稿</Option>
                  <Option value="pending">待审批</Option>
                  <Option value="approved">已批准</Option>
                  <Option value="rejected">已驳回</Option>
                  <Option value="processed">已处理</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="dateRange" label="申请日期">
                <RangePicker 
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="keyword" label="关键词搜索">
                <Input 
                  placeholder="搜索申请单号..."
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={5} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />}
                  style={{ borderRadius: '2px' }}
                >
                  搜索
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleReset}
                  style={{ borderRadius: '2px' }}
                >
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
          
          {/* 第二行：操作按钮 */}
          <Row gutter={16}>
            <Col span={12}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  style={{ borderRadius: '2px' }}
                >
                  新建采购申请
                </Button>
              </Space>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleBatchApproval('approve')}
                  disabled={selectedRowKeys.length === 0}
                  style={{ borderRadius: '2px' }}
                >
                  批量批准
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => handleBatchApproval('reject')}
                  disabled={selectedRowKeys.length === 0}
                  style={{ borderRadius: '2px' }}
                >
                  批量驳回
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 列表区域 */}
      <Card>
        {/* 审批功能提示 */}
        {dataSource.filter(item => item.status === 'pending').length > 0 && (
          <Alert
            message={<span><FileProtectOutlined /> 审批工作台</span>}
            description="作为审批人员，您可以在此对待审批的采购申请进行审批。支持单个审批和批量审批操作。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            closable
          />
        )}
        
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              disabled: record.status !== 'pending', // 只有待审批的可以选择
            }),
          }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize
              }));
            }
          }}
        />
      </Card>
      
      {/* 审批弹窗 */}
      <Modal
        title={
          <Space>
            <FileProtectOutlined />
            <span>{approvalAction === 'approve' ? '批准申请' : '驳回申请'}</span>
          </Space>
        }
        open={approvalModalVisible}
        onOk={handleApprovalConfirm}
        onCancel={() => setApprovalModalVisible(false)}
        width={600}
        okText="确认"
        cancelText="取消"
      >
        {approvalRecord && (
          <div>
            <Alert
              message="请仔细审查申请内容后做出审批决定"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <div style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>申请单号：</strong>{approvalRecord.requisitionNo}</p>
                  <p><strong>申请加油站：</strong>{approvalRecord.stationName}</p>
                </Col>
                <Col span={12}>
                  <p><strong>申请人：</strong>{approvalRecord.applicant}</p>
                  <p><strong>申请日期：</strong>{approvalRecord.applicationDate}</p>
                </Col>
              </Row>
              <p><strong>商品概要：</strong>{approvalRecord.productSummary}</p>
              <p><strong>零售总金额：</strong>¥{approvalRecord.estimatedAmount?.toLocaleString()}</p>
            </div>
            
            <Form form={approvalForm} layout="vertical">
              <Form.Item
                name="opinion"
                label="审批意见"
                rules={[
                  { required: approvalAction === 'reject', message: '驳回时必须填写审批意见' }
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={approvalAction === 'approve' ? '请填写审批意见（可选）' : '请填写驳回原因'}
                  maxLength={200}
                  showCount
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
      
      {/* 详情查看弹窗 */}
      <RequisitionDetailModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        requisitionData={currentRecord}
      />
      
      {/* 新建/编辑表单弹窗 */}
      <RequisitionFormModal
        visible={formModalVisible}
        mode={formMode}
        requisitionData={editRecord}
        onOk={handleFormModalOk}
        onCancel={handleFormModalCancel}
      />
    </div>
  );
};

export default PurchaseRequisition;