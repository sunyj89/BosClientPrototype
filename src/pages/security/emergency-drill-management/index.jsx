import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, Upload, Popconfirm, Alert, TreeSelect, Switch } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, FileOutlined, HistoryOutlined, AlertOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import stationData from '../../../mock/station/stationData.json';
import emergencyDrillData from '../../../mock/security/emergencyDrillData.json';
import emergencyDrillRecordData from '../../../mock/security/emergencyDrillRecordData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EmergencyDrillManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const [form] = Form.useForm();
  const [drillForm] = Form.useForm();
  
  // 数据状态
  const [drillPlanList, setDrillPlanList] = useState([]);
  const [drillRecordList, setDrillRecordList] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  
  // 演练记录相关状态
  const [recordForm] = Form.useForm();
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [recordModalType, setRecordModalType] = useState('add'); // add, edit, view
  const [currentRecordData, setCurrentRecordData] = useState(null);
  const [recordSelectedRowKeys, setRecordSelectedRowKeys] = useState([]);
  
  // 弹窗状态
  const [drillModalVisible, setDrillModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDrillPlanList(emergencyDrillData.drillPlans);
      setDrillRecordList(emergencyDrillRecordData.drillRecords);
      setChangeRecords(emergencyDrillData.changeRecords);
      setLoading(false);
    }, 500);
  };

  // 构建组织树结构数据
  const getOrganizationTreeData = () => {
    const treeData = [];
    
    // 添加分公司节点
    stationData.branches.forEach(branch => {
      const branchNode = {
        title: branch.name,
        value: `branch-${branch.id}`,
        key: `branch-${branch.id}`,
        children: []
      };
      
      // 添加该分公司下的服务区节点
      const serviceAreas = stationData.serviceAreas.filter(area => area.branchId === branch.id);
      serviceAreas.forEach(area => {
        const areaNode = {
          title: area.name,
          value: `area-${area.id}`,
          key: `area-${area.id}`,
          children: []
        };
        
        // 添加该服务区下的油站节点
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

  // 演练记录相关函数
  const handleRecordSearch = (values) => {
    console.log('演练记录搜索条件:', values);
    message.success('演练记录搜索功能已触发');
  };

  const handleRecordReset = () => {
    form.resetFields();
    message.info('演练记录搜索条件已重置');
  };

  const handleAddRecord = () => {
    setRecordModalType('add');
    recordForm.resetFields();
    setRecordModalVisible(true);
  };

  const handleEditRecord = (record) => {
    setRecordModalType('edit');
    setCurrentRecordData(record);
    
    recordForm.setFieldsValue({
      ...record,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null
    });
    
    setRecordModalVisible(true);
  };

  const handleViewRecord = (record) => {
    setCurrentRecordData(record);
    setRecordModalType('view');
    setRecordModalVisible(true);
  };

  const handleDeleteRecord = (record) => {
    message.success(`删除演练记录"${record.recordName}"成功`);
  };

  const handleSaveRecord = async (values) => {
    try {
      const processedValues = {
        ...values,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null
      };
      
      if (recordModalType === 'add') {
        processedValues.recordId = `SD${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        console.log('保存演练记录:', processedValues);
        message.success(`演练记录创建成功，记录ID：${processedValues.recordId}`);
      } else {
        console.log('更新演练记录:', processedValues);
        message.success('演练记录更新成功');
      }
      
      setRecordModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDownloadFile = (filePath, fileName) => {
    message.success(`正在下载文件：${fileName}`);
    console.log('下载文件路径:', filePath);
  };

  // 新增演练计划
  const handleAddDrill = () => {
    setModalType('add');
    drillForm.resetFields();
    setDrillModalVisible(true);
  };

  // 编辑演练计划
  const handleEditDrill = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    
    // 格式化组织ID
    let formattedOrgId;
    if (record.orgType === '分公司') {
      formattedOrgId = `branch-${record.orgId}`;
    } else if (record.orgType === '服务区') {
      formattedOrgId = `area-${record.orgId}`;
    } else {
      formattedOrgId = `station-${record.orgId}`;
    }
    
    drillForm.setFieldsValue({
      ...record,
      orgId: formattedOrgId,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null
    });
    
    setDrillModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 提交审批
  const handleSubmitApproval = (record) => {
    Modal.confirm({
      title: '确认提交审批',
      content: `确定要提交"${record.planName}"的审批申请吗？`,
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          message.success('提交审批成功');
          loadData();
        } catch (error) {
          message.error('提交审批失败');
        }
      },
    });
  };

  // 删除记录
  const handleDelete = (record) => {
    message.success(`删除演练计划"${record.planName}"成功`);
  };

  // 保存演练计划
  const handleSaveDrill = async (values) => {
    try {
      // 处理组织ID和类型
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
      
      const processedValues = {
        ...values,
        orgId,
        orgType,
        orgName,
        stationName,
        branchName,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null
      };
      
      // 如果是新增模式，系统自动生成演练计划ID
      if (modalType === 'add') {
        processedValues.planId = `ED${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        console.log('保存演练计划:', processedValues);
        message.success(`演练计划创建成功，计划ID：${processedValues.planId}`);
      } else {
        console.log('保存演练计划:', processedValues);
        message.success('演练计划更新成功');
      }
      
      setDrillModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 获取状态颜色和文本
  const getStatusInfo = (status) => {
    const statusMap = {
      '草稿': { color: 'default', text: '草稿' },
      '待审批': { color: 'warning', text: '待审批' },
      '审批中': { color: 'processing', text: '审批中' },
      '已驳回': { color: 'error', text: '已驳回' },
      '待执行': { color: 'cyan', text: '待执行' },
      '进行中': { color: 'blue', text: '进行中' },
      '已取消': { color: 'default', text: '已取消' },
      '已结束': { color: 'success', text: '已结束' }
    };
    return statusMap[status] || { color: 'default', text: status };
  };

  // 演练计划表格列
  const drillPlanColumns = [
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
      title: '演练场所',
      dataIndex: 'drillLocation',
      key: 'drillLocation',
      width: 150,
    },
    {
      title: '演练内容',
      dataIndex: 'drillContent',
      key: 'drillContent',
      width: 200,
      ellipsis: true,
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
      width: 280,
      fixed: 'right',
      render: (_, record) => {
        const { status } = record;
        const statusInfo = getStatusInfo(status);
        
        return (
          <Space size="small">
            {['待审批', '审批中', '已驳回', '待执行', '进行中', '已取消', '已结束'].includes(status) && (
              <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
                查看
              </Button>
            )}
            {['草稿', '已驳回'].includes(status) && (
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditDrill(record)}>
                编辑
              </Button>
            )}
            {['草稿', '已驳回'].includes(status) && (
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleSubmitApproval(record)}>
                提交审批
              </Button>
            )}
            {status === '草稿' && (
              <Popconfirm title="确定要删除这个演练计划吗？" onConfirm={() => handleDelete(record)}>
                <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  // 演练记录表格列
  const drillRecordColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '安全培训记录唯一ID',
      dataIndex: 'recordId',
      key: 'recordId',
      width: 160,
      render: (text) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
    },
    {
      title: '记录名称',
      dataIndex: 'recordName',
      key: 'recordName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '关联所属安全培训计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 200,
      ellipsis: true
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
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
    },
    {
      title: '演练负责人',
      dataIndex: 'drillLeader',
      key: 'drillLeader',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
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
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewRecord(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditRecord(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个演练记录吗？" onConfirm={() => handleDeleteRecord(record)}>
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
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
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
          <FileOutlined />
          演练计划和方案
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleSearch}>
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
                  <Form.Item name="status" label="计划状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="草稿">草稿</Option>
                      <Option value="待审批">待审批</Option>
                      <Option value="审批中">审批中</Option>
                      <Option value="已驳回">已驳回</Option>
                      <Option value="待执行">待执行</Option>
                      <Option value="进行中">进行中</Option>
                      <Option value="已取消">已取消</Option>
                      <Option value="已结束">已结束</Option>
                    </Select>
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDrill}>
                      创建演练计划
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      disabled={selectedRowKeys.length === 0}
                      onClick={() => {
                        message.success(`批量导出 ${selectedRowKeys.length} 个演练计划成功`);
                        setSelectedRowKeys([]);
                      }}
                    >
                      批量导出 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 演练计划列表 */}
          <Card>
            <Table
              columns={drillPlanColumns}
              dataSource={drillPlanList}
              rowKey="planId"
              scroll={{ x: 1800 }}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              pagination={{
                total: drillPlanList.length,
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
          <HistoryOutlined />
          演练记录和总结
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleRecordSearch}>
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
                  <Form.Item name="recordName" label="演练名称">
                    <Input placeholder="请输入演练名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="timeRange" label="时间范围">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
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
                      创建演练记录
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      disabled={recordSelectedRowKeys.length === 0}
                      onClick={() => {
                        message.success(`批量导出 ${recordSelectedRowKeys.length} 个演练记录成功`);
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

          {/* 演练记录列表 */}
          <Card>
            <Table
              columns={drillRecordColumns}
              dataSource={drillRecordList}
              rowKey="recordId"
              scroll={{ x: 1800 }}
              rowSelection={{
                selectedRowKeys: recordSelectedRowKeys,
                onChange: setRecordSelectedRowKeys,
              }}
              pagination={{
                total: drillRecordList.length,
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
          <EditOutlined />
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
    <div className="emergency-drill-management-container">
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

      {/* 演练计划表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增演练计划' : '编辑演练计划'}
        open={drillModalVisible}
        onCancel={() => setDrillModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setDrillModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => drillForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={drillForm}
          layout="vertical"
          onFinish={handleSaveDrill}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="planId" label="演练计划ID">
                <Input disabled placeholder="系统自动生成" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="planName" label="计划名称" rules={[{ required: true, message: '请输入计划名称' }]}>
                <Input placeholder="请输入演练计划名称" />
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
              <Form.Item name="drillLocation" label="演练场所" rules={[{ required: true, message: '请输入演练场所' }]}>
                <Input placeholder="请输入演练场所" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="drillContent" label="演练内容" rules={[{ required: true, message: '请输入演练内容' }]}>
                <Input placeholder="请输入演练内容" />
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
            <Col span={8}>
              <Form.Item name="drillPlan" label="演练方案">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传演练方案</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="personnelList" label="人员名单">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传人员名单</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="materialList" label="物资清单">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传物资清单</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="drillLeader" label="演练负责人" rules={[{ required: true, message: '请输入演练负责人' }]}>
                <Input placeholder="请输入演练负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="演练详情"
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
              <Descriptions.Item label="计划ID">{currentRecord.planId}</Descriptions.Item>
              <Descriptions.Item label="计划名称">{currentRecord.planName}</Descriptions.Item>
              <Descriptions.Item label="所属组织">{currentRecord.orgName}</Descriptions.Item>
              <Descriptions.Item label="演练场所">{currentRecord.drillLocation}</Descriptions.Item>
              <Descriptions.Item label="演练内容">{currentRecord.drillContent}</Descriptions.Item>
              <Descriptions.Item label="计划状态">
                {(() => {
                  const statusInfo = getStatusInfo(currentRecord.status);
                  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">{currentRecord.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{currentRecord.endTime}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="联系信息" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="演练负责人">{currentRecord.drillLeader}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentRecord.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="创建人">{currentRecord.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
            </Descriptions>

            {currentRecord.remark && (
              <Descriptions title="备注信息" column={1} bordered style={{ marginTop: 16 }}>
                <Descriptions.Item label="备注">{currentRecord.remark}</Descriptions.Item>
              </Descriptions>
            )}
          </div>
        )}
      </Modal>

      {/* 演练记录表单弹窗 */}
      <Modal
        title={recordModalType === 'add' ? '新增演练记录' : recordModalType === 'edit' ? '编辑演练记录' : '查看演练记录'}
        open={recordModalVisible}
        onCancel={() => setRecordModalVisible(false)}
        width={1000}
        footer={
          recordModalType === 'view' ? [
            <Button key="close" onClick={() => setRecordModalVisible(false)}>
              关闭
            </Button>
          ] : [
            <Button key="cancel" onClick={() => setRecordModalVisible(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={() => recordForm.submit()}>
              保存
            </Button>
          ]
        }
      >
        {recordModalType === 'view' && currentRecordData ? (
          <div>
            <Descriptions title="基本信息" column={2} bordered>
              <Descriptions.Item label="记录ID">{currentRecordData.recordId}</Descriptions.Item>
              <Descriptions.Item label="记录名称">{currentRecordData.recordName}</Descriptions.Item>
              <Descriptions.Item label="关联培训计划">{currentRecordData.planName}</Descriptions.Item>
              <Descriptions.Item label="所属油站">{currentRecordData.stationName}</Descriptions.Item>
              <Descriptions.Item label="所属分公司">{currentRecordData.branchName}</Descriptions.Item>
              <Descriptions.Item label="演练发起部门">{currentRecordData.drillDepartment}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="时间信息" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="开始时间">{currentRecordData.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{currentRecordData.endTime}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecordData.createTime}</Descriptions.Item>
              <Descriptions.Item label="创建人">{currentRecordData.creator}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="联系信息" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="演练负责人">{currentRecordData.drillLeader}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentRecordData.contactPhone}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="相关文件" column={1} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="演练记录文件">
                <Button 
                  type="link" 
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadFile(currentRecordData.drillRecordFile, '演练记录文件.pdf')}
                >
                  演练记录文件.pdf
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="参与人员名单">
                <Button 
                  type="link" 
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadFile(currentRecordData.participantListFile, '参与人员名单.xlsx')}
                >
                  参与人员名单.xlsx
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="演练总结文件">
                <Button 
                  type="link" 
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadFile(currentRecordData.summaryFile, '演练总结文件.pdf')}
                >
                  演练总结文件.pdf
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="其他材料">
                <Space direction="vertical">
                  {currentRecordData.otherFiles?.map((file, index) => (
                    <Button 
                      key={index}
                      type="link" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadFile(file, `其他材料${index + 1}`)}
                    >
                      {file.split('/').pop()}
                    </Button>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <Form
            form={recordForm}
            layout="vertical"
            onFinish={handleSaveRecord}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="recordId" label="演练记录唯一ID">
                  <Input disabled placeholder="系统自动生成" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="recordName" label="记录名称" rules={[{ required: true, message: '请输入记录名称' }]}>
                  <Input placeholder="请输入演练记录名称" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="orgId" label="所属组织" rules={[{ required: true, message: '请选择组织' }]}>
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择所属组织（树状多层级选择）"
                    allowClear
                    treeDefaultExpandAll
                    treeData={getOrganizationTreeData()}
                    fieldNames={{ label: 'title', value: 'value' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="drillDepartment" label="演练发起部门" rules={[{ required: true, message: '请输入发起部门' }]}>
                  <Input placeholder="请输入演练发起部门" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="drillLeader" label="演练负责人姓名" rules={[{ required: true, message: '请输入负责人姓名' }]}>
                  <Input placeholder="请输入演练负责人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                  <DatePicker showTime style={{ width: '100%' }} placeholder="请选择开始时间" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                  <DatePicker showTime style={{ width: '100%' }} placeholder="请选择结束时间" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="drillRecordFile" label="上传演练记录文件">
                  <Upload {...uploadProps} accept=".pdf,.doc,.docx">
                    <Button icon={<UploadOutlined />}>上传PDF/Word文件</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="participantListFile" label="参与培训人员名单">
                  <Upload {...uploadProps} accept=".xlsx,.xls,.csv">
                    <Button icon={<UploadOutlined />}>上传Excel文件</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="summaryFile" label="上传演练总结文件">
                  <Upload {...uploadProps} accept=".pdf,.doc,.docx">
                    <Button icon={<UploadOutlined />}>上传总结文件</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="otherFiles" label="上传其他材料">
                  <Upload {...uploadProps} multiple>
                    <Button icon={<UploadOutlined />}>上传其他文件</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {/* 演示备注信息 */}
      <Card title="演示数据说明" style={{ marginTop: '24px' }}>
        <p>为方便演示，当前应急演练管理使用的是模拟数据，具体说明如下：</p>
        <ul>
          <li>
            <strong>演练类型：</strong>
            <ul>
              <li>消防演练：火灾应急疏散、灭火器使用等</li>
              <li>泄漏演练：油品泄漏处置、应急堵漏等</li>
              <li>综合演练：多种突发事件综合处置</li>
              <li>专项演练：特定风险场景应急响应</li>
            </ul>
          </li>
          <li>
            <strong>管理流程：</strong>
            <ul>
              <li>演练计划：制定演练方案和时间安排</li>
              <li>演练记录：记录实际演练执行情况</li>
              <li>记录编号：12位数字+英文唯一标识</li>
              <li>文件管理：演练方案、人员名单、总结等</li>
            </ul>
          </li>
          <li>
            <strong>数据特点：</strong>
            <ul>
              <li>覆盖各分公司和油站的演练活动</li>
              <li>支持树状组织架构多层级选择</li>
              <li>包含完整的时间、人员、场所信息</li>
              <li>文件上传下载，支持多种格式</li>
            </ul>
          </li>
          <li>
            <strong>功能亮点：</strong>
            <ul>
              <li>演练计划与记录关联管理</li>
              <li>多种文件类型支持（PDF/Word/Excel）</li>
              <li>详细的联系人和责任人信息</li>
              <li>完整的创建、编辑、查看权限控制</li>
            </ul>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default EmergencyDrillManagement;
