import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, Upload, Popconfirm, Alert, TreeSelect, Switch } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, FileOutlined, HistoryOutlined, AlertOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import stationData from '../../../mock/station/stationData.json';
import emergencyDrillData from '../../../mock/security/emergencyDrillData.json';

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
      setDrillRecordList(emergencyDrillData.drillRecords);
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
      title: '记录ID',
      dataIndex: 'recordId',
      key: 'recordId',
      width: 120,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '演练名称',
      dataIndex: 'drillName',
      key: 'drillName',
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
      title: '实际执行时间',
      key: 'actualTime',
      width: 200,
      render: (_, record) => (
        <div>
          <div>开始：{record.actualStartTime}</div>
          <div>结束：{record.actualEndTime}</div>
        </div>
      )
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 100,
    },
    {
      title: '演练效果',
      dataIndex: 'drillEffect',
      key: 'drillEffect',
      width: 120,
      render: (effect) => {
        const colorMap = {
          '优秀': 'success',
          '良好': 'processing',
          '一般': 'warning',
          '较差': 'error'
        };
        return <Tag color={colorMap[effect]}>{effect}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看总结
          </Button>
          <Button type="primary" size="small" icon={<DownloadOutlined />}>
            下载报告
          </Button>
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
          <Card>
            <Table
              columns={drillRecordColumns}
              dataSource={drillRecordList}
              rowKey="recordId"
              scroll={{ x: 1400 }}
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
        1. 演练计划和方案：支持创建、编辑、查看、审批流程管理，包含完整的演练信息和文件上传
        <br />
        2. 演练记录和总结：记录实际演练执行情况，支持效果评估和报告下载
        <br />
        3. 修改记录：完整记录所有演练相关的变更历史，包括新增、修改、删除操作
        <br />
        4. 状态管理：支持草稿→待审批→审批中→待执行→进行中→已结束的完整流程
        <br />
        5. 权限控制：不同状态下显示不同的操作按钮，确保流程规范性
        <br />
        6. 批量操作：支持多选和批量导出功能，提高工作效率
        <br />
        * 所有功能均支持树状组织结构选择和完整的审批流程管理
      </div>
    </div>
  );
};

export default EmergencyDrillManagement;
