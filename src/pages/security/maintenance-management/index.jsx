import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, TreeSelect, Popconfirm, Timeline, Steps, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SendOutlined, CheckOutlined, CloseOutlined, HistoryOutlined, ToolOutlined, SafetyOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import maintenanceData from '../../../mock/security/maintenanceData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

const MaintenanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('applications');
  const [form] = Form.useForm();
  const [applicationForm] = Form.useForm();
  
  // 数据状态
  const [applicationList, setApplicationList] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  
  // 弹窗状态
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setApplicationList(maintenanceData.constructionApplications);
      setChangeRecords(maintenanceData.changeRecords);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    message.success('搜索功能已触发');
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    message.info('搜索条件已重置');
  };

  // 新增申报单
  const handleAddApplication = () => {
    setModalType('add');
    applicationForm.resetFields();
    // 自动生成申报单号
    const number = 'CS' + new Date().getFullYear().toString().substr(2) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 90 + 10);
    applicationForm.setFieldsValue({ applicationNumber: number });
    setApplicationModalVisible(true);
  };

  // 编辑申报单
  const handleEditApplication = (record) => {
    if (record.status !== '草稿' && record.status !== '已拒绝') {
      message.warning('只能编辑草稿或已拒绝状态的申报单');
      return;
    }
    setModalType('edit');
    setCurrentRecord(record);
    applicationForm.setFieldsValue({
      ...record,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null
    });
    setApplicationModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 查看修改记录
  const handleViewChanges = () => {
    setChangeModalVisible(true);
  };

  // 删除申报单
  const handleDelete = (record) => {
    if (record.status !== '草稿') {
      message.warning('只能删除草稿状态的申报单');
      return;
    }
    message.success(`删除申报单"${record.applicationNumber}"成功`);
  };

  // 提交审批
  const handleSubmitApproval = (record) => {
    if (record.status !== '草稿' && record.status !== '已拒绝') {
      message.warning('只能提交草稿或已拒绝状态的申报单');
      return;
    }
    Modal.confirm({
      title: '确认提交审批',
      content: `确定要提交申报单"${record.applicationNumber}"进行审批吗？`,
      onOk: () => {
        message.success('申报单已提交审批');
        loadData();
      }
    });
  };

  // 保存申报单
  const handleSaveApplication = async (values) => {
    try {
      console.log('保存申报单:', values);
      message.success(modalType === 'add' ? '申报单创建成功' : '申报单更新成功');
      setApplicationModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 获取状态信息
  const getStatusInfo = (status) => {
    const statusMap = {
      '草稿': { color: 'default', text: '草稿' },
      '待审批': { color: 'processing', text: '待审批' },
      '已审批': { color: 'success', text: '已审批' },
      '已拒绝': { color: 'error', text: '已拒绝' }
    };
    return statusMap[status] || { color: 'default', text: status };
  };

  // 获取可用操作
  const getAvailableActions = (record) => {
    const actions = [];
    
    // 查看操作对所有状态都可用
    actions.push({
      key: 'view',
      label: '查看',
      icon: <EyeOutlined />,
      onClick: () => handleViewDetail(record)
    });

    // 根据状态确定可用操作
    if (record.status === '草稿' || record.status === '已拒绝') {
      actions.push({
        key: 'edit',
        label: '编辑',
        icon: <EditOutlined />,
        onClick: () => handleEditApplication(record)
      });
      
      actions.push({
        key: 'submit',
        label: '提交审批',
        icon: <SendOutlined />,
        onClick: () => handleSubmitApproval(record)
      });
    }

    if (record.status === '草稿') {
      actions.push({
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDelete(record)
      });
    }

    return actions;
  };

  // 申报单表格列
  const applicationColumns = [
    {
      title: '申报单号',
      dataIndex: 'applicationNumber',
      key: 'applicationNumber',
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '油站信息',
      key: 'stationInfo',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.stationName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.branchName}</div>
        </div>
      )
    },
    {
      title: '施工原因',
      dataIndex: 'constructionReason',
      key: 'constructionReason',
      width: 150
    },
    {
      title: '施工类型',
      dataIndex: 'constructionType',
      key: 'constructionType',
      width: 120,
      render: (text) => {
        const colorMap = {
          '设备维修': 'blue',
          '设备清洗': 'green',
          '系统改造': 'purple',
          '设备检测': 'orange'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '施工时间',
      key: 'constructionTime',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>开始：{record.startTime}</div>
          <div style={{ fontSize: 12 }}>结束：{record.endTime}</div>
        </div>
      )
    },
    {
      title: '施工单位',
      dataIndex: 'constructionUnit',
      key: 'constructionUnit',
      width: 180
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100
    },
    {
      title: '审批级别',
      dataIndex: 'approvalLevel',
      key: 'approvalLevel',
      width: 120,
      render: (text) => {
        const colorMap = {
          '分公司级': 'blue',
          '集团公司级': 'red'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusInfo = getStatusInfo(status);
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => {
        const actions = getAvailableActions(record);
        return (
          <Space size="small">
            {actions.map(action => {
              if (action.key === 'delete') {
                return (
                  <Popconfirm
                    key={action.key}
                    title="确定要删除这个申报单吗？"
                    onConfirm={action.onClick}
                  >
                    <Button type="primary" size="small" danger icon={action.icon}>
                      {action.label}
                    </Button>
                  </Popconfirm>
                );
              }
              return (
                <Button
                  key={action.key}
                  type="primary"
                  size="small"
                  icon={action.icon}
                  danger={action.danger}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              );
            })}
          </Space>
        );
      }
    }
  ];

  // 修改记录表格列
  const changeColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '新增': 'success',
          '修改': 'warning',
          '删除': 'error'
        };
        const iconMap = {
          '新增': <PlusOutlined />,
          '修改': <EditOutlined />,
          '删除': <DeleteOutlined />
        };
        return <Tag color={colorMap[text]} icon={iconMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '变更对象',
      dataIndex: 'changeObject',
      key: 'changeObject',
      width: 120
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 250
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        const colorMap = {
          '已审批': 'success',
          '审批中': 'processing',
          '已拒绝': 'error'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      )
    }
  ];

  // 获取审批流程状态
  const getApprovalSteps = (record) => {
    const steps = [
      {
        title: '申请提交',
        status: record.submitTime ? 'finish' : 'wait',
        description: record.submitTime ? `${record.applicant} ${record.submitTime}` : '待提交'
      },
      {
        title: '审批处理',
        status: record.status === '已审批' ? 'finish' : 
               record.status === '已拒绝' ? 'error' : 
               record.status === '待审批' ? 'process' : 'wait',
        description: record.approver ? 
          `${record.approver} ${record.approvalTime}` : 
          record.status === '待审批' ? '审批中' : '待审批'
      },
      {
        title: '施工执行',
        status: record.actualStartTime ? 'finish' : 
               record.status === '已审批' ? 'wait' : 'wait',
        description: record.actualStartTime ? 
          `${record.actualStartTime} 开始施工` : '待执行'
      }
    ];
    return steps;
  };

  const tabItems = [
    {
      key: 'applications',
      label: (
        <span>
          <ToolOutlined />
          油站施工申报单
        </span>
      ),
      children: (
        <div>
          {/* 状态统计 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {applicationList.length}
                  </div>
                  <div style={{ color: '#666' }}>申报单总数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {applicationList.filter(item => item.status === '已审批').length}
                  </div>
                  <div style={{ color: '#666' }}>已审批</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                    {applicationList.filter(item => item.status === '待审批').length}
                  </div>
                  <div style={{ color: '#666' }}>待审批</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                    {applicationList.filter(item => item.status === '已拒绝').length}
                  </div>
                  <div style={{ color: '#666' }}>已拒绝</div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="stationName" label="油站名称">
                    <TreeSelect
                      placeholder="请选择油站"
                      treeData={[
                        {
                          title: '全部油站',
                          value: 'all',
                          children: stationData.branches.map(branch => ({
                            title: branch.name,
                            value: branch.id,
                            children: stationData.stations.filter(s => s.branchId === branch.id).map(station => ({
                              title: station.name,
                              value: station.id
                            }))
                          }))
                        }
                      ]}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status" label="单据状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="草稿">草稿</Option>
                      <Option value="待审批">待审批</Option>
                      <Option value="已审批">已审批</Option>
                      <Option value="已拒绝">已拒绝</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="constructionType" label="施工类型">
                    <Select placeholder="请选择类型" allowClear>
                      <Option value="设备维修">设备维修</Option>
                      <Option value="设备清洗">设备清洗</Option>
                      <Option value="系统改造">系统改造</Option>
                      <Option value="设备检测">设备检测</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="timeRange" label="时间范围">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddApplication}>
                      新建申报单
                    </Button>
                    <Button icon={<HistoryOutlined />} onClick={handleViewChanges}>
                      修改记录
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 申报单列表 */}
          <Card>
            <Table
              columns={applicationColumns}
              dataSource={applicationList}
              rowKey="id"
              scroll={{ x: 1600 }}
              pagination={{
                total: applicationList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'changes',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: (
        <div>
          <Card>
            <Table
              columns={changeColumns}
              dataSource={changeRecords}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: changeRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="maintenance-management-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>

      {/* 申报单表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新建施工申报单' : '编辑施工申报单'}
        open={applicationModalVisible}
        onCancel={() => setApplicationModalVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setApplicationModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => applicationForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={applicationForm}
          layout="vertical"
          onFinish={handleSaveApplication}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="applicationNumber" label="申报单号">
                <Input disabled style={{ fontFamily: 'monospace', fontWeight: 'bold' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stationId" label="所属油站" rules={[{ required: true, message: '请选择油站' }]}>
                <Select placeholder="请选择油站">
                  {stationData.stations.map(station => (
                    <Option key={station.id} value={station.id}>{station.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="constructionReason" label="施工原因" rules={[{ required: true, message: '请输入施工原因' }]}>
                <Input placeholder="请输入施工原因" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="constructionType" label="施工类型" rules={[{ required: true, message: '请选择施工类型' }]}>
                <Select placeholder="请选择施工类型">
                  <Option value="设备维修">设备维修</Option>
                  <Option value="设备清洗">设备清洗</Option>
                  <Option value="系统改造">系统改造</Option>
                  <Option value="设备检测">设备检测</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startTime" label="计划开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="计划结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="constructionUnit" label="施工单位" rules={[{ required: true, message: '请输入施工单位' }]}>
                <Input placeholder="请输入施工单位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPerson" label="联系人" rules={[{ required: true, message: '请输入联系人' }]}>
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="constructionArea" label="施工区域" rules={[{ required: true, message: '请输入施工区域' }]}>
                <Input placeholder="请输入施工区域" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="constructionDescription" label="施工描述" rules={[{ required: true, message: '请输入施工描述' }]}>
                <TextArea rows={3} placeholder="请详细描述施工内容和要求" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="safetyMeasures" label="安全措施" rules={[{ required: true, message: '请输入安全措施' }]}>
                <TextArea rows={3} placeholder="请详细描述施工期间的安全措施" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="emergencyPlan" label="应急预案" rules={[{ required: true, message: '请输入应急预案' }]}>
                <TextArea rows={3} placeholder="请详细描述紧急情况的应对预案" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="施工申报单详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        {currentRecord && (
          <div>
            <Steps current={getApprovalSteps(currentRecord).findIndex(step => step.status === 'process')} style={{ marginBottom: 24 }}>
              {getApprovalSteps(currentRecord).map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  status={step.status}
                />
              ))}
            </Steps>

            <Descriptions title="基本信息" column={2} bordered>
              <Descriptions.Item label="申报单号">{currentRecord.applicationNumber}</Descriptions.Item>
              <Descriptions.Item label="申请人">{currentRecord.applicant}</Descriptions.Item>
              <Descriptions.Item label="所属油站">{currentRecord.stationName}</Descriptions.Item>
              <Descriptions.Item label="申请时间">{currentRecord.applicationTime}</Descriptions.Item>
              <Descriptions.Item label="施工原因">{currentRecord.constructionReason}</Descriptions.Item>
              <Descriptions.Item label="施工类型">
                <Tag color={currentRecord.constructionType === '设备维修' ? 'blue' : currentRecord.constructionType === '设备清洗' ? 'green' : 'purple'}>
                  {currentRecord.constructionType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="计划开始时间">{currentRecord.startTime}</Descriptions.Item>
              <Descriptions.Item label="计划结束时间">{currentRecord.endTime}</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                {(() => {
                  const statusInfo = getStatusInfo(currentRecord.status);
                  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="审批级别">
                <Tag color={currentRecord.approvalLevel === '分公司级' ? 'blue' : 'red'}>
                  {currentRecord.approvalLevel}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="施工单位信息" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="施工单位">{currentRecord.constructionUnit}</Descriptions.Item>
              <Descriptions.Item label="联系人">{currentRecord.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentRecord.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="施工区域">{currentRecord.constructionArea}</Descriptions.Item>
              <Descriptions.Item label="施工描述" span={2}>{currentRecord.constructionDescription}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="安全措施和应急预案" column={1} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="安全措施">{currentRecord.safetyMeasures}</Descriptions.Item>
              <Descriptions.Item label="应急预案">{currentRecord.emergencyPlan}</Descriptions.Item>
            </Descriptions>

            {currentRecord.approver && (
              <Descriptions title="审批信息" column={2} bordered style={{ marginTop: 16 }}>
                <Descriptions.Item label="审批人">{currentRecord.approver}</Descriptions.Item>
                <Descriptions.Item label="审批时间">{currentRecord.approvalTime}</Descriptions.Item>
                <Descriptions.Item label="审批备注" span={2}>{currentRecord.approvalRemark}</Descriptions.Item>
              </Descriptions>
            )}

            {currentRecord.actualStartTime && (
              <Descriptions title="执行信息" column={2} bordered style={{ marginTop: 16 }}>
                <Descriptions.Item label="实际开始时间">{currentRecord.actualStartTime}</Descriptions.Item>
                <Descriptions.Item label="实际结束时间">{currentRecord.actualEndTime || '进行中'}</Descriptions.Item>
                <Descriptions.Item label="完成备注" span={2}>{currentRecord.completionRemark}</Descriptions.Item>
              </Descriptions>
            )}
          </div>
        )}
      </Modal>

      {/* 修改记录弹窗 */}
      <Modal
        title={<><HistoryOutlined /> 修改记录</>}
        open={changeModalVisible}
        onCancel={() => setChangeModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setChangeModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        <Table
          columns={changeColumns}
          dataSource={changeRecords}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>

      {/* 备注信息 */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: '#f6f8fa', 
        borderRadius: 4, 
        border: '1px solid #e1e8ed',
        fontSize: 12,
        color: '#666'
      }}>
        <strong>功能演示说明：</strong>
        <br />
        1. 油站施工申报单：列表展示施工申请单，全局唯一ID（6位数字+英文），支持根据油站名称、创建时间范围、单据状态进行筛选查询
        <br />
        2. 申报单管理：油站可以创建施工申报，包括油站名称、施工原因、施工时间范围、施工原因、审核状态
        <br />
        3. 操作权限：查看（所有状态）、编辑（草稿和已拒绝）、删除（草稿）、提交审批（草稿、已拒绝）
        <br />
        4. 单据状态：草稿、待审批、已拒绝、已审批，支持完整的审批流程跟踪
        <br />
        5. 审批流程：申请提交 → 审批处理 → 施工执行，可视化展示当前进度
        <br />
        6. 修改记录：完整记录所有申报单的变更历史，包括创建、修改、状态变更等操作
        <br />
        * 系统根据施工类型和风险等级自动确定审批级别（分公司级/集团公司级）
      </div>
    </div>
  );
};

export default MaintenanceManagement; 