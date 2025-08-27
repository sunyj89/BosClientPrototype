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
  Tag,
  Popconfirm,
  TreeSelect,
  Card,
  Descriptions,
  Steps,
  Timeline
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';

// 导入模拟数据
import procurementApplicationData from '../../../../mock/purchase/oil-procurement/procurementApplicationData.json';
import organizationData from '../../../../mock/organization/organizationData.json';
import stationData from '../../../../mock/station/stationData.json';

// 导入表单组件
import ProcurementApplicationForm from './ProcurementApplicationForm';

const { Option } = Select;
const { Step } = Steps;

const ProcurementApplication = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [filterForm] = Form.useForm();

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setData(procurementApplicationData.procurementApplications || []);
      setLoading(false);
    }, 500);
  };

  // 处理筛选
  const handleFilter = (values) => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = [...(procurementApplicationData.procurementApplications || [])];
      
      if (values.keyword) {
        filtered = filtered.filter(item => 
          item.applicationNumber.includes(values.keyword)
        );
      }
      
      if (values.organization) {
        filtered = filtered.filter(item => 
          item.branchId === values.organization || 
          item.serviceAreaId === values.organization ||
          item.stationId === values.organization
        );
      }
      
      if (values.status) {
        filtered = filtered.filter(item => 
          item.status === values.status
        );
      }
      
      setData(filtered);
      setLoading(false);
    }, 300);
  };

  // 重置筛选
  const handleReset = () => {
    filterForm.resetFields();
    fetchData();
  };

  // 查看详情
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 编辑
  const handleEdit = (record) => {
    setCurrentRecord(record);
    setFormMode('edit');
    setFormModalVisible(true);
  };

  // 删除
  const handleDelete = (record) => {
    setLoading(true);
    setTimeout(() => {
      const newData = data.filter(item => item.id !== record.id);
      setData(newData);
      setLoading(false);
      message.success('删除成功');
    }, 500);
  };

  // 创建申请
  const handleCreate = () => {
    setCurrentRecord(null);
    setFormMode('create');
    setFormModalVisible(true);
  };

  // 处理表单提交
  const handleFormSubmit = (formData) => {
    setLoading(true);
    
    setTimeout(() => {
      if (formMode === 'create') {
        // 创建新记录
        const newRecord = {
          ...formData,
          id: `PA${Date.now()}`, // 生成唯一ID
        };
        setData(prevData => [newRecord, ...prevData]);
      } else {
        // 更新现有记录
        setData(prevData => prevData.map(item => 
          item.id === currentRecord.id 
            ? { ...item, ...formData }
            : item
        ));
      }
      setLoading(false);
      fetchData(); // 重新获取数据以保持一致性
    }, 500);
  };

  // 关闭表单弹窗
  const handleFormCancel = () => {
    setFormModalVisible(false);
    setCurrentRecord(null);
    setFormMode('create');
  };

  // 提交审批
  const handleSubmitApproval = (record) => {
    setLoading(true);
    setTimeout(() => {
      const newData = data.map(item => {
        if (item.id === record.id) {
          return {
            ...item,
            status: '待审批',
            updateTime: new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            }).replace(/\//g, '-'),
            approvalProgress: [
              {
                step: 1,
                stepName: '站长申请',
                approver: '当前用户',
                approveTime: new Date().toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                }).replace(/\//g, '-'),
                status: '已通过',
                remark: '申请已提交，等待审批'
              },
              {
                step: 2,
                stepName: '服务区经理审批',
                approver: '服务区经理',
                approveTime: '',
                status: '待审批',
                remark: ''
              },
              {
                step: 3,
                stepName: '分公司总经理审批',
                approver: '分公司总经理',
                approveTime: '',
                status: '待审批',
                remark: ''
              }
            ]
          };
        }
        return item;
      });
      setData(newData);
      setLoading(false);
      message.success('申请已提交审批');
    }, 500);
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colorMap = {
      '草稿': 'default',
      '待审批': 'blue',
      '审批中': 'orange',
      '审批通过': 'green',
      '已拒绝': 'red'
    };
    return colorMap[status] || 'default';
  };

  // 生成组织树数据
  const generateOrgTreeData = () => {
    const branches = stationData.branches || [];
    const serviceAreas = stationData.serviceAreas || [];
    const stations = stationData.stations || [];

    return branches.map(branch => ({
      title: branch.name,
      value: branch.id,
      key: branch.id,
      children: [
        ...serviceAreas
          .filter(sa => sa.branchId === branch.id)
          .map(serviceArea => ({
            title: serviceArea.name,
            value: serviceArea.id,
            key: serviceArea.id,
            children: stations
              .filter(station => station.serviceAreaId === serviceArea.id)
              .map(station => ({
                title: station.name,
                value: station.id,
                key: station.id
              }))
          }))
      ]
    }));
  };

  // 获取审批进度状态
  const getApprovalStepStatus = (stepStatus) => {
    switch (stepStatus) {
      case '已通过':
        return 'finish';
      case '已拒绝':
        return 'error';
      case '审批中':
        return 'process';
      case '草稿':
        return 'wait';
      default:
        return 'wait';
    }
  };

  // 列配置
  const columns = [
    {
      title: '采购申请编号',
      dataIndex: 'applicationNumber',
      key: 'applicationNumber',
      width: 150,
      fixed: 'left'
    },
    {
      title: '申请油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 200
    },
    {
      title: '油品名称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 120
    },
    {
      title: '申请数量（吨）',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (quantity) => `${quantity} 吨`
    },
    {
      title: '期望到货时间',
      dataIndex: 'expectedDeliveryTime',
      key: 'expectedDeliveryTime',
      width: 160
    },
    {
      title: '采购申请状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => {
        const canEdit = record.status === '草稿' || record.status === '已拒绝';
        const canDelete = record.status === '草稿' || record.status === '已拒绝';
        const canSubmit = record.status === '草稿';
        
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            >
              查看
            </Button>
            {canEdit && (
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
            )}
            {canSubmit && (
              <Button
                type="primary"
                size="small"
                onClick={() => handleSubmitApproval(record)}
              >
                提交审批
              </Button>
            )}
            {canDelete && (
              <Popconfirm
                title="确定要删除这个采购申请吗？"
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="primary"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <>
      {/* 筛选区域 */}
      <Form form={filterForm} onFinish={handleFilter}>
        {/* 第一行：筛选条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={5}>
            <Form.Item name="organization" label="组织和油站">
              <TreeSelect
                placeholder="请选择组织或油站"
                allowClear
                treeData={generateOrgTreeData()}
                style={{ width: '100%' }}
                showSearch
                treeNodeFilterProp="title"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="keyword" label="申请编号">
              <Input
                placeholder="请输入申请编号"
                allowClear
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="status" label="申请状态">
              <Select placeholder="请选择状态" allowClear>
                <Option value="草稿">草稿</Option>
                <Option value="待审批">待审批</Option>
                <Option value="审批中">审批中</Option>
                <Option value="审批通过">审批通过</Option>
                <Option value="已拒绝">已拒绝</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={7} style={{ textAlign: 'right' }}>
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
        
        {/* 第二行：功能按钮 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                创建油品采购申请
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      {/* 表格 */}
      <Table 
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        loading={loading}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* 查看详情弹窗 */}
      <Modal
        title="采购申请详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="采购申请编号" span={1}>
                {currentRecord.applicationNumber}
              </Descriptions.Item>
              <Descriptions.Item label="申请状态" span={1}>
                <Tag color={getStatusColor(currentRecord.status)}>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="申请油站名称" span={2}>
                {currentRecord.stationName}
              </Descriptions.Item>
              <Descriptions.Item label="油品名称" span={1}>
                {currentRecord.oilName}
              </Descriptions.Item>
              <Descriptions.Item label="申请数量" span={1}>
                {currentRecord.quantity} {currentRecord.unit}
              </Descriptions.Item>
              <Descriptions.Item label="期望到货时间" span={1}>
                {currentRecord.expectedDeliveryTime}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={1}>
                {currentRecord.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="申请人姓名" span={1}>
                {currentRecord.applicantName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={1}>
                {currentRecord.applicantPhone}
              </Descriptions.Item>
              <Descriptions.Item label="收货地址" span={2}>
                {currentRecord.deliveryAddress}
              </Descriptions.Item>
              <Descriptions.Item label="创建人" span={1}>
                {currentRecord.createdBy}
              </Descriptions.Item>
              <Descriptions.Item label="最后修改时间" span={1}>
                {currentRecord.updateTime}
              </Descriptions.Item>
            </Descriptions>

            {/* 审批进度 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginTop: 24,
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              审批进度
            </div>
            
            <Timeline>
              {currentRecord.approvalProgress?.map((step, index) => (
                <Timeline.Item
                  key={index}
                  color={
                    step.status === '已通过' ? 'green' :
                    step.status === '已拒绝' ? 'red' :
                    step.status === '审批中' ? 'blue' : 'gray'
                  }
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{step.stepName}</div>
                    <div>审批人：{step.approver}</div>
                    {step.approveTime && <div>审批时间：{step.approveTime}</div>}
                    <div>状态：
                      <Tag color={
                        step.status === '已通过' ? 'green' :
                        step.status === '已拒绝' ? 'red' :
                        step.status === '审批中' ? 'blue' : 'default'
                      }>
                        {step.status}
                      </Tag>
                    </div>
                    {step.remark && <div>备注：{step.remark}</div>}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        )}
      </Modal>

      {/* 创建/编辑表单弹窗 */}
      <ProcurementApplicationForm
        visible={formModalVisible}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        initialData={currentRecord}
        mode={formMode}
      />
    </>
  );
};

export default ProcurementApplication; 