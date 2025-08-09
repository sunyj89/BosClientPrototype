import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, Upload, Popconfirm, TreeSelect } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, FileOutlined, HistoryOutlined, TeamOutlined, BookOutlined, ReconciliationOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import stationData from '../../../mock/station/stationData.json';
import trainingData from '../../../mock/security/trainingData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const TrainingManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  
  // 表单实例
  const [planForm] = Form.useForm();
  const [recordForm] = Form.useForm();
  const [meetingForm] = Form.useForm();
  const [planFilterForm] = Form.useForm();
  const [recordFilterForm] = Form.useForm();
  const [meetingFilterForm] = Form.useForm();
  
  // 数据状态
  const [trainingPlanList, setTrainingPlanList] = useState([]);
  const [trainingRecordList, setTrainingRecordList] = useState([]);
  const [meetingRecordList, setMeetingRecordList] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  
  // 弹窗状态
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view
  const [currentModule, setCurrentModule] = useState('plan'); // plan, record, meeting
  
  // 选择状态
  const [planSelectedRowKeys, setPlanSelectedRowKeys] = useState([]);
  const [recordSelectedRowKeys, setRecordSelectedRowKeys] = useState([]);
  const [meetingSelectedRowKeys, setMeetingSelectedRowKeys] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setTrainingPlanList(trainingData.trainingPlans);
      setTrainingRecordList(trainingData.trainingRecords);
      setMeetingRecordList(trainingData.meetingRecords);
      setChangeRecords(trainingData.changeRecords);
      setLoading(false);
    }, 500);
  };

  // 构建组织树结构数据
  const getOrganizationTreeData = () => {
    const treeData = [];
    
    stationData.branches.forEach(branch => {
      const branchNode = {
        title: branch.name,
        value: `branch-${branch.id}`,
        key: `branch-${branch.id}`,
        children: []
      };
      
      const serviceAreas = stationData.serviceAreas.filter(area => area.branchId === branch.id);
      serviceAreas.forEach(area => {
        const areaNode = {
          title: area.name,
          value: `area-${area.id}`,
          key: `area-${area.id}`,
          children: []
        };
        
        const stations = stationData.stations.filter(station => station.serviceAreaId === area.id);
        stations.forEach(station => {
          areaNode.children.push({
            title: station.name,
            value: `station-${station.id}`,
            key: `station-${station.id}`
          });
        });
        
        branchNode.children.push(areaNode);
      });
      
      treeData.push(branchNode);
    });
    
    return treeData;
  };

  // 获取培训计划选项（用于培训记录关联）
  const getTrainingPlanOptions = () => {
    return trainingPlanList.map(plan => ({
      label: plan.planName,
      value: plan.planId
    }));
  };

  // 处理搜索
  const handlePlanSearch = (values) => {
    console.log('培训计划搜索条件:', values);
    message.success('搜索功能已触发');
  };

  const handleRecordSearch = (values) => {
    console.log('培训记录搜索条件:', values);
    message.success('搜索功能已触发');
  };

  const handleMeetingSearch = (values) => {
    console.log('会议记录搜索条件:', values);
    message.success('搜索功能已触发');
  };

  // 重置搜索
  const handlePlanReset = () => {
    planFilterForm.resetFields();
    message.info('搜索条件已重置');
  };

  const handleRecordReset = () => {
    recordFilterForm.resetFields();
    message.info('搜索条件已重置');
  };

  const handleMeetingReset = () => {
    meetingFilterForm.resetFields();
    message.info('搜索条件已重置');
  };

  // 新增操作
  const handleAddPlan = () => {
    setModalType('add');
    setCurrentModule('plan');
    planForm.resetFields();
    setPlanModalVisible(true);
  };

  const handleAddRecord = () => {
    setModalType('add');
    setCurrentModule('record');
    recordForm.resetFields();
    setRecordModalVisible(true);
  };

  const handleAddMeeting = () => {
    setModalType('add');
    setCurrentModule('meeting');
    meetingForm.resetFields();
    setMeetingModalVisible(true);
  };

  // 编辑操作
  const handleEditPlan = (record) => {
    setModalType('edit');
    setCurrentModule('plan');
    setCurrentRecord(record);
    
    let formattedOrgId;
    if (record.orgType === '分公司') {
      formattedOrgId = `branch-${record.orgId}`;
    } else if (record.orgType === '服务区') {
      formattedOrgId = `area-${record.orgId}`;
    } else {
      formattedOrgId = `station-${record.orgId}`;
    }
    
    planForm.setFieldsValue({
      ...record,
      orgId: formattedOrgId,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null
    });
    
    setPlanModalVisible(true);
  };

  const handleEditRecord = (record) => {
    setModalType('edit');
    setCurrentModule('record');
    setCurrentRecord(record);
    
    let formattedOrgId;
    if (record.orgType === '分公司') {
      formattedOrgId = `branch-${record.orgId}`;
    } else if (record.orgType === '服务区') {
      formattedOrgId = `area-${record.orgId}`;
    } else {
      formattedOrgId = `station-${record.orgId}`;
    }
    
    recordForm.setFieldsValue({
      ...record,
      orgId: formattedOrgId,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null
    });
    
    setRecordModalVisible(true);
  };

  const handleEditMeeting = (record) => {
    setModalType('edit');
    setCurrentModule('meeting');
    setCurrentRecord(record);
    
    let formattedOrgId;
    if (record.orgType === '分公司') {
      formattedOrgId = `branch-${record.orgId}`;
    } else if (record.orgType === '服务区') {
      formattedOrgId = `area-${record.orgId}`;
    } else {
      formattedOrgId = `station-${record.orgId}`;
    }
    
    meetingForm.setFieldsValue({
      ...record,
      orgId: formattedOrgId,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null
    });
    
    setMeetingModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record, module) => {
    setCurrentRecord(record);
    setCurrentModule(module);
    setViewModalVisible(true);
  };

  // 删除记录
  const handleDelete = (record, module) => {
    const moduleNames = {
      plan: '培训计划',
      record: '培训记录',
      meeting: '会议记录'
    };
    message.success(`删除${moduleNames[module]}"${record.planName || record.recordName || record.meetingSubject}"成功`);
  };

  // 保存操作
  const handleSavePlan = async (values) => {
    try {
      const processedValues = await processFormValues(values);
      
      // 如果是新增模式，系统自动生成培训计划ID
      if (modalType === 'add') {
        processedValues.planId = `TP${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        console.log('保存培训计划:', processedValues);
        message.success(`培训计划创建成功，计划ID：${processedValues.planId}`);
      } else {
        console.log('保存培训计划:', processedValues);
        message.success('培训计划更新成功');
      }
      
      setPlanModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleSaveRecord = async (values) => {
    try {
      const processedValues = await processFormValues(values);
      
      // 如果是新增模式，系统自动生成培训记录ID
      if (modalType === 'add') {
        processedValues.recordId = `TR${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        console.log('保存培训记录:', processedValues);
        message.success(`培训记录创建成功，记录ID：${processedValues.recordId}`);
      } else {
        console.log('保存培训记录:', processedValues);
        message.success('培训记录更新成功');
      }
      
      setRecordModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleSaveMeeting = async (values) => {
    try {
      const processedValues = await processFormValues(values);
      console.log('保存会议记录:', processedValues);
      message.success(modalType === 'add' ? '会议记录创建成功' : '会议记录更新成功');
      setMeetingModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 处理表单值
  const processFormValues = async (values) => {
    let orgId, orgType, orgName, stationName, branchName;
    if (values.orgId) {
      const [type, id] = values.orgId.split('-');
      orgId = id;
      
      if (type === 'branch') {
        orgType = '分公司';
        const branch = stationData.branches.find(b => b.id === id);
        orgName = branch?.name || '';
        branchName = branch?.name || '';
        stationName = '';
      } else if (type === 'area') {
        orgType = '服务区';
        const area = stationData.serviceAreas.find(a => a.id === id);
        orgName = area?.name || '';
        const branch = stationData.branches.find(b => b.id === area?.branchId);
        branchName = branch?.name || '';
        stationName = '';
      } else {
        orgType = '油站';
        const station = stationData.stations.find(s => s.id === id);
        orgName = station?.name || '';
        stationName = station?.name || '';
        const branch = stationData.branches.find(b => b.id === station?.branchId);
        branchName = branch?.name || '';
      }
    }
    
    return {
      ...values,
      orgId,
      orgType,
      orgName,
      stationName,
      branchName,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null
    };
  };

  // 培训计划表格列
  const trainingPlanColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '计划ID',
      dataIndex: 'planId',
      key: 'planId',
      width: 120,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120,
    },
    {
      title: '培训类型',
      dataIndex: 'trainingType',
      key: 'trainingType',
      width: 120,
      render: (type) => {
        const colorMap = {
          '消防安全': 'red',
          '操作规程': 'blue',
          '应急处置': 'orange',
          '设备维护': 'green'
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      }
    },
    {
      title: '计划时间',
      key: 'planTime',
      width: 200,
      render: (_, record) => (
        <div>
          <div>开始：{record.startTime}</div>
          <div>结束：{record.endTime}</div>
        </div>
      )
    },
    {
      title: '创建信息',
      key: 'createInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.createTime}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.creator}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'plan')}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditPlan(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个培训计划吗？" onConfirm={() => handleDelete(record, 'plan')}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 培训记录表格列
  const trainingRecordColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '记录ID',
      dataIndex: 'recordId',
      key: 'recordId',
      width: 120,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '记录名称',
      dataIndex: 'recordName',
      key: 'recordName',
      width: 180,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '关联培训计划',
      dataIndex: 'relatedPlanName',
      key: 'relatedPlanName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120,
    },
    {
      title: '执行时间',
      key: 'executionTime',
      width: 200,
      render: (_, record) => (
        <div>
          <div>开始：{record.startTime}</div>
          <div>结束：{record.endTime}</div>
        </div>
      )
    },
    {
      title: '创建信息',
      key: 'createInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.createTime}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.creator}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'record')}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditRecord(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个培训记录吗？" onConfirm={() => handleDelete(record, 'record')}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 会议记录表格列
  const meetingRecordColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '记录ID',
      dataIndex: 'meetingId',
      key: 'meetingId',
      width: 120,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '会议主题',
      dataIndex: 'meetingSubject',
      key: 'meetingSubject',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120,
    },
    {
      title: '会议时间',
      key: 'meetingTime',
      width: 200,
      render: (_, record) => (
        <div>
          <div>开始：{record.startTime}</div>
          <div>结束：{record.endTime}</div>
        </div>
      )
    },
    {
      title: '创建信息',
      key: 'createInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.createTime}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.creator}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'meeting')}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditMeeting(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个会议记录吗？" onConfirm={() => handleDelete(record, 'meeting')}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
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
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'change')}>
          查看详情
        </Button>
      )
    }
  ];

  // 上传属性
  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'Bearer token',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  const tabItems = [
    {
      key: 'plans',
      label: (
        <span>
          <BookOutlined />
          安全培训计划
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={planFilterForm} layout="inline" onFinish={handlePlanSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="orgName" label="公司层级">
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择公司/油站"
                      allowClear
                      treeDefaultExpandAll
                      treeData={getOrganizationTreeData()}
                      fieldNames={{ label: 'title', value: 'value' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="planName" label="计划名称">
                    <Input placeholder="请输入计划名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="timeRange" label="时间范围">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="trainingType" label="培训类型">
                    <Select placeholder="请选择类型" allowClear>
                      <Option value="消防安全">消防安全</Option>
                      <Option value="操作规程">操作规程</Option>
                      <Option value="应急处置">应急处置</Option>
                      <Option value="设备维护">设备维护</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handlePlanReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan}>
                      创建培训计划
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      disabled={planSelectedRowKeys.length === 0}
                      onClick={() => {
                        message.success(`批量导出 ${planSelectedRowKeys.length} 个培训计划成功`);
                        setPlanSelectedRowKeys([]);
                      }}
                    >
                      批量导出 {planSelectedRowKeys.length > 0 && `(${planSelectedRowKeys.length})`}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 培训计划列表 */}
          <Card>
            <Table
              columns={trainingPlanColumns}
              dataSource={trainingPlanList}
              rowKey="planId"
              scroll={{ x: 1600 }}
              rowSelection={{
                selectedRowKeys: planSelectedRowKeys,
                onChange: setPlanSelectedRowKeys,
              }}
              pagination={{
                total: trainingPlanList.length,
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
      key: 'records',
      label: (
        <span>
          <ReconciliationOutlined />
          安全培训记录
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={recordFilterForm} layout="inline" onFinish={handleRecordSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="orgName" label="公司层级">
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择公司/油站"
                      allowClear
                      treeDefaultExpandAll
                      treeData={getOrganizationTreeData()}
                      fieldNames={{ label: 'title', value: 'value' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="planName" label="计划名称">
                    <Input placeholder="请输入计划名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="recordName" label="记录名称">
                    <Input placeholder="请输入记录名称" allowClear />
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
                    <Button icon={<ReloadOutlined />} onClick={handleRecordReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRecord}>
                      创建培训记录
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      disabled={recordSelectedRowKeys.length === 0}
                      onClick={() => {
                        message.success(`批量导出 ${recordSelectedRowKeys.length} 个培训记录成功`);
                        setRecordSelectedRowKeys([]);
                      }}
                    >
                      批量导出 {recordSelectedRowKeys.length > 0 && `(${recordSelectedRowKeys.length})`}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 培训记录列表 */}
          <Card>
            <Table
              columns={trainingRecordColumns}
              dataSource={trainingRecordList}
              rowKey="recordId"
              scroll={{ x: 1600 }}
              rowSelection={{
                selectedRowKeys: recordSelectedRowKeys,
                onChange: setRecordSelectedRowKeys,
              }}
              pagination={{
                total: trainingRecordList.length,
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
      key: 'meetings',
      label: (
        <span>
          <TeamOutlined />
          安全会议记录
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={meetingFilterForm} layout="inline" onFinish={handleMeetingSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="orgName" label="公司层级">
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择公司/油站"
                      allowClear
                      treeDefaultExpandAll
                      treeData={getOrganizationTreeData()}
                      fieldNames={{ label: 'title', value: 'value' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="meetingSubject" label="会议主题">
                    <Input placeholder="请输入会议主题" allowClear />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="timeRange" label="会议时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleMeetingReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMeeting}>
                      创建会议记录
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      disabled={meetingSelectedRowKeys.length === 0}
                      onClick={() => {
                        message.success(`批量导出 ${meetingSelectedRowKeys.length} 个会议记录成功`);
                        setMeetingSelectedRowKeys([]);
                      }}
                    >
                      批量导出 {meetingSelectedRowKeys.length > 0 && `(${meetingSelectedRowKeys.length})`}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 会议记录列表 */}
          <Card>
            <Table
              columns={meetingRecordColumns}
              dataSource={meetingRecordList}
              rowKey="meetingId"
              scroll={{ x: 1500 }}
              rowSelection={{
                selectedRowKeys: meetingSelectedRowKeys,
                onChange: setMeetingSelectedRowKeys,
              }}
              pagination={{
                total: meetingRecordList.length,
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
    <div className="training-management-container">
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

      {/* 培训计划表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增培训计划' : '编辑培训计划'}
        open={planModalVisible}
        onCancel={() => setPlanModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setPlanModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => planForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={planForm}
          layout="vertical"
          onFinish={handleSavePlan}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="planId" label="培训计划ID">
                <Input disabled placeholder="系统自动生成" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="planName" label="计划名称" rules={[{ required: true, message: '请输入计划名称' }]}>
                <Input placeholder="请输入培训计划名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="orgId" label="所属组织" rules={[{ required: true, message: '请选择组织' }]}>
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择所属组织"
                  allowClear
                  treeDefaultExpandAll
                  treeData={getOrganizationTreeData()}
                  fieldNames={{ label: 'title', value: 'value' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="draftDepartment" label="计划起草部门" rules={[{ required: true, message: '请输入起草部门' }]}>
                <Input placeholder="请输入计划起草部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="planManager" label="计划负责人" rules={[{ required: true, message: '请输入计划负责人' }]}>
                <Input placeholder="请输入计划负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="trainingType" label="安全培训类型" rules={[{ required: true, message: '请选择培训类型' }]}>
                <Select placeholder="请选择培训类型">
                  <Option value="消防安全">消防安全</Option>
                  <Option value="操作规程">操作规程</Option>
                  <Option value="应急处置">应急处置</Option>
                  <Option value="设备维护">设备维护</Option>
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
              <Form.Item name="trainingPlan" label="培训计划文件">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传培训计划</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="otherMaterials" label="其他材料">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传其他材料</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 培训记录表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增培训记录' : '编辑培训记录'}
        open={recordModalVisible}
        onCancel={() => setRecordModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setRecordModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => recordForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={recordForm}
          layout="vertical"
          onFinish={handleSaveRecord}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="recordId" label="培训记录ID">
                <Input disabled placeholder="系统自动生成" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="recordName" label="记录名称" rules={[{ required: true, message: '请输入记录名称' }]}>
                <Input placeholder="请输入培训记录名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="orgId" label="所属组织" rules={[{ required: true, message: '请选择组织' }]}>
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择所属组织"
                  allowClear
                  treeDefaultExpandAll
                  treeData={getOrganizationTreeData()}
                  fieldNames={{ label: 'title', value: 'value' }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="relatedPlanId" label="关联培训计划" rules={[{ required: true, message: '请选择关联的培训计划' }]}>
                <Select placeholder="请选择关联的培训计划" showSearch optionFilterProp="children">
                  {getTrainingPlanOptions().map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="trainingDepartment" label="培训发起部门" rules={[{ required: true, message: '请输入发起部门' }]}>
                <Input placeholder="请输入培训发起部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="trainingManager" label="培训负责人" rules={[{ required: true, message: '请输入培训负责人' }]}>
                <Input placeholder="请输入培训负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="trainingRecord" label="培训记录文件">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传培训记录</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="participantList" label="参与人员名单">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传人员名单</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="otherMaterials" label="其他材料">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传其他材料</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 会议记录表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增会议记录' : '编辑会议记录'}
        open={meetingModalVisible}
        onCancel={() => setMeetingModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setMeetingModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => meetingForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={meetingForm}
          layout="vertical"
          onFinish={handleSaveMeeting}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="meetingId" label="会议记录ID" rules={[{ required: true, message: '请输入会议记录ID' }]}>
                <Input placeholder="12位数字+英文，如：SM2024001ABC" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="meetingSubject" label="会议主题" rules={[{ required: true, message: '请输入会议主题' }]}>
                <Input placeholder="请输入会议主题" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="orgId" label="所属组织" rules={[{ required: true, message: '请选择组织' }]}>
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择所属组织"
                  allowClear
                  treeDefaultExpandAll
                  treeData={getOrganizationTreeData()}
                  fieldNames={{ label: 'title', value: 'value' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="meetingDepartment" label="会议发起部门" rules={[{ required: true, message: '请输入发起部门' }]}>
                <Input placeholder="请输入会议发起部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="meetingManager" label="会议负责人" rules={[{ required: true, message: '请输入会议负责人' }]}>
                <Input placeholder="请输入会议负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startTime" label="会议开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="会议结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="meetingAgenda" label="会议主要议题" rules={[{ required: true, message: '请输入会议主要议题' }]}>
                <TextArea rows={4} placeholder="请输入会议主要议题内容" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="meetingFiles" label="会议文件">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传会议文件</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="participantList" label="参与人员名单">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传人员名单</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="otherMaterials" label="其他材料">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传其他材料</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="详情信息"
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
            <Descriptions title="基本信息" column={2} bordered>
              {currentModule === 'plan' && (
                <>
                  <Descriptions.Item label="计划ID">{currentRecord.planId}</Descriptions.Item>
                  <Descriptions.Item label="计划名称">{currentRecord.planName}</Descriptions.Item>
                  <Descriptions.Item label="培训类型">
                    <Tag>{currentRecord.trainingType}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="起草部门">{currentRecord.draftDepartment}</Descriptions.Item>
                  <Descriptions.Item label="计划负责人">{currentRecord.planManager}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{currentRecord.contactPhone}</Descriptions.Item>
                </>
              )}
              {currentModule === 'record' && (
                <>
                  <Descriptions.Item label="记录ID">{currentRecord.recordId}</Descriptions.Item>
                  <Descriptions.Item label="记录名称">{currentRecord.recordName}</Descriptions.Item>
                  <Descriptions.Item label="关联培训计划">{currentRecord.relatedPlanName}</Descriptions.Item>
                  <Descriptions.Item label="发起部门">{currentRecord.trainingDepartment}</Descriptions.Item>
                  <Descriptions.Item label="培训负责人">{currentRecord.trainingManager}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{currentRecord.contactPhone}</Descriptions.Item>
                </>
              )}
              {currentModule === 'meeting' && (
                <>
                  <Descriptions.Item label="会议ID">{currentRecord.meetingId}</Descriptions.Item>
                  <Descriptions.Item label="会议主题">{currentRecord.meetingSubject}</Descriptions.Item>
                  <Descriptions.Item label="发起部门">{currentRecord.meetingDepartment}</Descriptions.Item>
                  <Descriptions.Item label="会议负责人">{currentRecord.meetingManager}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{currentRecord.contactPhone}</Descriptions.Item>
                  <Descriptions.Item label="会议议题" span={2}>{currentRecord.meetingAgenda}</Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="所属组织">{currentRecord.orgName}</Descriptions.Item>
              <Descriptions.Item label="开始时间">{currentRecord.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{currentRecord.endTime}</Descriptions.Item>
              <Descriptions.Item label="创建人">{currentRecord.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
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
        1. 安全培训计划：支持创建、编辑、查看培训计划，包含完整的培训信息和文件上传功能
        <br />
        2. 安全培训记录：记录实际培训执行情况，可关联培训计划，支持人员名单管理
        <br />
        3. 安全会议记录：记录安全会议纪要，支持会议议题录入和相关文件上传下载
        <br />
        4. 修改记录：完整记录所有培训相关的变更历史，包括新增、修改、删除操作
        <br />
        5. 树状组织结构：支持多层级组织选择，方便按组织架构管理培训活动
        <br />
        6. 批量操作：支持多选和批量导出功能，提高工作效率
        <br />
        * 所有功能均支持文件上传下载和完整的CRUD操作，确保培训管理的规范性
      </div>
    </div>
  );
};

export default TrainingManagement;
