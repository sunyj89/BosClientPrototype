import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Space, 
  Table, 
  Tag, 
  Select,
  Modal,
  message,
  Popconfirm,
  Divider,
  TreeSelect,
  Spin
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined, 
  CloseCircleOutlined
} from '@ant-design/icons';
import EmployeeAuditDrawer from './components/EmployeeAuditDrawer';

const { TabPane } = Tabs;
const { Option } = Select;
const { SHOW_PARENT, SHOW_ALL } = TreeSelect;

const EmployeeManagement = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('1');
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auditDrawerVisible, setAuditDrawerVisible] = useState(false);
  const [currentAuditRecord, setCurrentAuditRecord] = useState(null);

  // 处理组织结构数据
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [orgLoading, setOrgLoading] = useState(false);

  // 获取组织结构数据
  useEffect(() => {
    fetchOrgData();
  }, []);

  // 模拟获取组织结构数据
  const fetchOrgData = () => {
    setOrgLoading(true);
    // 模拟API请求
    setTimeout(() => {
      try {
        // 实际项目中应该通过API获取数据
        const orgData = {
          company: {
            id: "HQ001",
            key: "company-0",
            name: "江西交投化石能源公司",
            type: "company"
          },
          branches: [
            {
              id: "BR001",
              key: "branch-0",
              name: "赣中分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST001",
                  key: "station-0-0",
                  name: "南昌服务区加油站1",
                  type: "station",
                  parentId: "BR001"
                },
                {
                  id: "ST002",
                  key: "station-0-1",
                  name: "南昌服务区加油站2",
                  type: "station",
                  parentId: "BR001"
                }
              ]
            },
            {
              id: "BR002",
              key: "branch-1",
              name: "赣东北分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST003",
                  key: "station-1-0",
                  name: "上饶服务区加油站1",
                  type: "station",
                  parentId: "BR002"
                },
                {
                  id: "ST004",
                  key: "station-1-1",
                  name: "上饶服务区加油站2",
                  type: "station",
                  parentId: "BR002"
                }
              ]
            },
            {
              id: "BR003",
              key: "branch-2",
              name: "赣东分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST005",
                  key: "station-2-0",
                  name: "鹰潭服务区加油站1",
                  type: "station",
                  parentId: "BR003"
                },
                {
                  id: "ST006",
                  key: "station-2-1",
                  name: "鹰潭服务区加油站2",
                  type: "station",
                  parentId: "BR003"
                }
              ]
            },
            {
              id: "BR004",
              key: "branch-3",
              name: "赣东南分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST007",
                  key: "station-3-0",
                  name: "赣州服务区加油站1",
                  type: "station",
                  parentId: "BR004"
                },
                {
                  id: "ST008",
                  key: "station-3-1",
                  name: "赣州服务区加油站2",
                  type: "station",
                  parentId: "BR004"
                }
              ]
            },
            {
              id: "BR005",
              key: "branch-4",
              name: "赣南分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST009",
                  key: "station-4-0",
                  name: "南康服务区加油站1",
                  type: "station",
                  parentId: "BR005"
                },
                {
                  id: "ST010",
                  key: "station-4-1",
                  name: "南康服务区加油站2",
                  type: "station",
                  parentId: "BR005"
                }
              ]
            },
            {
              id: "BR006",
              key: "branch-5",
              name: "赣西南分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST011",
                  key: "station-5-0",
                  name: "吉安服务区加油站1",
                  type: "station",
                  parentId: "BR006"
                },
                {
                  id: "ST012",
                  key: "station-5-1",
                  name: "吉安服务区加油站2",
                  type: "station",
                  parentId: "BR006"
                }
              ]
            },
            {
              id: "BR007",
              key: "branch-6",
              name: "赣西分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST013",
                  key: "station-6-0",
                  name: "新余服务区加油站1",
                  type: "station",
                  parentId: "BR007"
                },
                {
                  id: "ST014",
                  key: "station-6-1",
                  name: "新余服务区加油站2",
                  type: "station",
                  parentId: "BR007"
                }
              ]
            },
            {
              id: "BR008",
              key: "branch-7",
              name: "赣西北分公司",
              type: "branch",
              parentId: "HQ001",
              stations: [
                {
                  id: "ST015",
                  key: "station-7-0",
                  name: "九江服务区加油站1",
                  type: "station",
                  parentId: "BR008"
                },
                {
                  id: "ST016",
                  key: "station-7-1",
                  name: "九江服务区加油站2",
                  type: "station",
                  parentId: "BR008"
                }
              ]
            }
          ]
        };

        // 构建TreeSelect需要的数据结构
        const treeData = [
          {
            title: orgData.company.name,
            value: orgData.company.key,
            key: orgData.company.key,
            children: orgData.branches.map(branch => ({
              title: branch.name,
              value: branch.key,
              key: branch.key,
              children: branch.stations.map(station => ({
                title: station.name,
                value: station.key,
                key: station.key,
              }))
            }))
          }
        ];

        setOrgTreeData(treeData);
      } catch (error) {
        console.error('获取组织数据失败:', error);
        message.error('获取组织数据失败');
      } finally {
        setOrgLoading(false);
      }
    }, 500);
  };

  // 处理组织选择变化
  const handleOrgChange = (value) => {
    console.log('组织选择:', value);
  };

  // 模拟员工数据
  const [employeeData, setEmployeeData] = useState(Array.from({ length: 20 }, (_, index) => {
    const orgTypes = ['总公司', '分公司', '加油站'];
    const orgPositions = {
      '总公司': ['总经理', '副总经理', '部长', '副部长', '主任', '业务经理'],
      '分公司': ['经理', '副经理', '业务经理'],
      '加油站': ['油站经理', '加油员', '收银员', '财务人员', '安全管理人员']
    };
    
    const orgType = index < 5 ? '总公司' : (index < 12 ? '分公司' : '加油站');
    const orgName = orgType === '总公司' 
      ? '江西交投化石能源公司' 
      : (orgType === '分公司' 
        ? ['赣中分公司', '赣东北分公司', '赣东分公司', '赣东南分公司', '赣南分公司', '赣西南分公司', '赣西分公司', '赣西北分公司'][index % 8] 
        : `${['赣中分公司', '赣东北分公司', '赣东分公司', '赣东南分公司', '赣南分公司', '赣西南分公司', '赣西分公司', '赣西北分公司'][index % 8]}-${index % 2 + 1}号加油站`);
    
    const positionList = orgPositions[orgType];
    const position = positionList[index % positionList.length];
    
    return {
      key: index.toString(),
      id: `E${1000 + index}`,
      name: `员工${index + 1}`,
      gender: index % 2 === 0 ? '男' : '女',
      position: position,
      organization: orgName,
      orgType: orgType,
      contact: `1380013${String(8000 + index).padStart(4, '0')}`,
      email: `employee${index + 1}@example.com`,
      status: index % 5 === 0 ? '离职' : '在职'
    };
  }));

  // 员工管理表格列配置
  const employeeColumns = [
    {
      title: '员工编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'organization',
      width: 180,
    },
    {
      title: '联系电话',
      dataIndex: 'contact',
      key: 'contact',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '在职' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: '在职', value: '在职' },
        { text: '离职', value: '离职' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要申请删除该员工吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 审批中心表格列配置
  const approvalColumns = [
    {
      title: '申请编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '申请类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      filters: [
        { text: '入职审批', value: '入职审批' },
        { text: '离职审批', value: '离职审批' },
        { text: '调岗审批', value: '调岗审批' },
        { text: '信息变更审批', value: '信息变更审批' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
    },
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 100,
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'organization',
      width: 180,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 180,
      sorter: (a, b) => new Date(a.applyTime) - new Date(b.applyTime),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          '待审核': { color: '#faad14', icon: <ExclamationCircleOutlined /> },
          '已审核': { color: '#32AF50', icon: <CheckCircleOutlined /> },
          '已确认': { color: '#1890ff', icon: <CheckCircleOutlined /> },
          '已取消': { color: '#d9d9d9', icon: <CloseCircleOutlined /> },
          '已拒绝': { color: '#f5222d', icon: <CloseCircleOutlined /> },
        };
        
        return (
          <Tag color={statusConfig[status].color} icon={statusConfig[status].icon}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '待审核', value: '待审核' },
        { text: '已审核', value: '已审核' },
        { text: '已确认', value: '已确认' },
        { text: '已取消', value: '已取消' },
        { text: '已拒绝', value: '已拒绝' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleAudit(record)}
            disabled={record.status !== '待审核'}
          >
            审批
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟审批数据
  const [approvalData, setApprovalData] = useState(Array.from({ length: 15 }, (_, index) => {
    const types = ['入职审批', '离职审批', '调岗审批', '信息变更审批'];
    const statuses = ['待审核', '已审核', '已确认', '已取消', '已拒绝'];
    const status = statuses[index % 5];
    const type = types[index % 4];
    const employee = employeeData[index % employeeData.length];
    
    return {
      key: index.toString(),
      id: `A${2000 + index}`,
      type: type,
      title: `${type}-${employee.name}`,
      employeeName: employee.name,
      organization: employee.organization,
      applicant: `申请人${index + 1}`,
      applyTime: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status: status,
      approver: status !== '待审核' ? '张审批' : '',
      approveTime: status !== '待审核' ? `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : '',
      content: `${employee.name}的${type}申请`,
    };
  }));

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 处理查询
  const handleSearch = (values) => {
    setLoading(true);
    console.log('查询条件:', values);
    
    // 模拟查询操作
    setTimeout(() => {
      setLoading(false);
      message.success('查询成功');
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 处理添加
  const handleAdd = () => {
    setModalType('add');
    setCurrentRecord(null);
    modalForm.resetFields();
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    modalForm.setFieldsValue({
      id: record.id,
      name: record.name,
      gender: record.gender,
      position: record.position,
      organization: record.organization,
      contact: record.contact,
      status: record.status,
    });
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    // 创建删除审批
    const newApprovalItem = {
      key: String(approvalData.length),
      id: `A${2000 + approvalData.length}`,
      type: '离职审批',
      title: `离职审批-${record.name}`,
      employeeName: record.name,
      organization: record.organization,
      applicant: '当前用户',
      applyTime: new Date().toLocaleString(),
      status: '待审核',
      approver: '',
      approveTime: '',
      content: `申请删除员工：${record.name}`,
      relatedRecord: record
    };
    
    setApprovalData([newApprovalItem, ...approvalData]);
    message.success('删除申请已提交，等待审批');
  };

  // 处理审批
  const handleAudit = (record) => {
    setCurrentAuditRecord(record);
    setAuditDrawerVisible(true);
  };

  // 处理审批确认
  const handleAuditSubmit = (values) => {
    console.log('审批提交:', values);
    
    // 模拟审批操作
    const newApprovalData = approvalData.map(item => {
      if (item.key === currentAuditRecord.key) {
        const isApprove = values.result === 'approve';
        const newStatus = isApprove ? '已审核' : '已拒绝';
        
        // 如果是审批通过，则更新员工数据
        if (isApprove) {
          if (item.type === '入职审批' && item.formValues) {
            // 添加员工
            const newRecord = {
              key: String(employeeData.length),
              id: `E${1000 + employeeData.length}`,
              ...item.formValues,
            };
            setEmployeeData([...employeeData, newRecord]);
          } else if (item.type === '信息变更审批' && item.formValues && item.originalRecord) {
            // 更新员工
            const newData = employeeData.map(emp => {
              if (emp.key === item.originalRecord.key) {
                return { ...emp, ...item.formValues };
              }
              return emp;
            });
            setEmployeeData(newData);
          } else if (item.type === '离职审批' && item.relatedRecord) {
            // 删除员工
            const newData = employeeData.filter(emp => emp.key !== item.relatedRecord.key);
            setEmployeeData(newData);
          }
        }
        
        return { 
          ...item, 
          status: newStatus,
          approver: '当前用户',
          approveTime: new Date().toLocaleString()
        };
      }
      return item;
    });
    
    setApprovalData(newApprovalData);
    setAuditDrawerVisible(false);
    message.success('审批操作成功');
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    modalForm.validateFields().then(values => {
      
      if (modalType === 'add') {
        // 创建入职审批
        const newApprovalItem = {
          key: String(approvalData.length),
          id: `A${2000 + approvalData.length}`,
          type: '入职审批',
          title: `入职审批-${values.name}`,
          employeeName: values.name,
          organization: values.organization,
          applicant: '当前用户',
          applyTime: new Date().toLocaleString(),
          status: '待审核',
          approver: '',
          approveTime: '',
          content: `申请新增员工：${values.name}`,
          formValues: values
        };
        
        setApprovalData([newApprovalItem, ...approvalData]);
        message.success('入职申请已提交，等待审批');
      } else {
        // 创建编辑审批
        const newApprovalItem = {
          key: String(approvalData.length),
          id: `A${2000 + approvalData.length}`,
          type: '信息变更审批',
          title: `信息变更审批-${values.name}`,
          employeeName: values.name,
          organization: values.organization,
          applicant: '当前用户',
          applyTime: new Date().toLocaleString(),
          status: '待审核',
          approver: '',
          approveTime: '',
          content: `申请修改员工：${values.name} 的信息`,
          formValues: values,
          originalRecord: currentRecord
        };
        
        setApprovalData([newApprovalItem, ...approvalData]);
        message.success('信息变更申请已提交，等待审批');
      }
      
      setModalVisible(false);
    });
  };

  return (
    <div className="employee-management-container">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="员工管理" key="1">
          <div className="search-form-container">
            <Form
              form={searchForm}
              layout="inline"
              onFinish={handleSearch}
            >
              <Form.Item name="keyword" label="关键字">
                <Input placeholder="姓名/编号/电话" allowClear />
              </Form.Item>
              <Form.Item name="organizations" label="所属组织">
                <TreeSelect
                  treeData={orgTreeData}
                  placeholder="请选择组织"
                  style={{ width: 300 }}
                  allowClear
                  treeCheckable
                  showCheckedStrategy={SHOW_PARENT}
                  showSearch
                  treeNodeFilterProp="title"
                  filterTreeNode={(search, item) => {
                    return item.title.indexOf(search) > -1;
                  }}
                  loading={orgLoading}
                  maxTagCount={2}
                  maxTagPlaceholder={(omittedValues) => `+ ${omittedValues.length} 个组织`}
                  onChange={handleOrgChange}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Form.Item>
              <Form.Item name="position" label="职位">
                <Select placeholder="请选择" allowClear style={{ width: 150 }}>
                  <Option value="总经理">总经理</Option>
                  <Option value="经理">经理</Option>
                  <Option value="部长">部长</Option>
                  <Option value="主任">主任</Option>
                  <Option value="业务经理">业务经理</Option>
                  <Option value="油站经理">油站经理</Option>
                  <Option value="加油员">加油员</Option>
                  <Option value="收银员">收银员</Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" allowClear style={{ width: 100 }}>
                  <Option value="在职">在职</Option>
                  <Option value="离职">离职</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新建
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <Table
            columns={employeeColumns}
            dataSource={employeeData}
            loading={loading}
            pagination={{ 
              defaultPageSize: 10, 
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
        
        <TabPane tab="审批中心" key="2">
          <div className="search-form-container">
            <Form
              form={searchForm}
              layout="inline"
              onFinish={handleSearch}
            >
              <Form.Item name="approvalKeyword" label="关键字">
                <Input placeholder="标题/申请人" allowClear />
              </Form.Item>
              <Form.Item name="approvalOrganizations" label="所属组织">
                <TreeSelect
                  treeData={orgTreeData}
                  placeholder="请选择组织"
                  style={{ width: 300 }}
                  allowClear
                  treeCheckable
                  showCheckedStrategy={SHOW_PARENT}
                  showSearch
                  treeNodeFilterProp="title"
                  filterTreeNode={(search, item) => {
                    return item.title.indexOf(search) > -1;
                  }}
                  loading={orgLoading}
                  maxTagCount={2}
                  maxTagPlaceholder={(omittedValues) => `+ ${omittedValues.length} 个组织`}
                  onChange={handleOrgChange}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Form.Item>
              <Form.Item name="approvalType" label="申请类型">
                <Select placeholder="请选择" allowClear style={{ width: 150 }}>
                  <Option value="入职审批">入职审批</Option>
                  <Option value="离职审批">离职审批</Option>
                  <Option value="调岗审批">调岗审批</Option>
                  <Option value="信息变更审批">信息变更审批</Option>
                </Select>
              </Form.Item>
              <Form.Item name="approvalStatus" label="状态">
                <Select placeholder="请选择" allowClear style={{ width: 120 }}>
                  <Option value="待审核">待审核</Option>
                  <Option value="已审核">已审核</Option>
                  <Option value="已确认">已确认</Option>
                  <Option value="已取消">已取消</Option>
                  <Option value="已拒绝">已拒绝</Option>
                </Select>
              </Form.Item>
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
            </Form>
          </div>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <Table
            columns={approvalColumns}
            dataSource={approvalData}
            loading={loading}
            pagination={{ 
              defaultPageSize: 10, 
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
      </Tabs>

      {/* 员工表单模态框 */}
      <Modal
        title={modalType === 'add' ? '申请新增员工' : '申请编辑员工'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
      >
        <Form
          form={modalForm}
          layout="vertical"
        >
          <Form.Item name="id" label="员工编号" hidden={modalType === 'add'}>
            <Input disabled />
          </Form.Item>
          <Form.Item 
            name="name" 
            label="姓名" 
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item 
            name="gender" 
            label="性别" 
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="organization" 
            label="所属组织" 
            rules={[{ required: true, message: '请选择所属组织' }]}
          >
            <TreeSelect
              treeData={orgTreeData}
              placeholder="请选择组织"
              allowClear
              showSearch
              treeNodeFilterProp="title"
              filterTreeNode={(search, item) => {
                return item.title.indexOf(search) > -1;
              }}
              loading={orgLoading}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          </Form.Item>
          <Form.Item 
            name="position" 
            label="职位" 
            rules={[{ required: true, message: '请选择职位' }]}
          >
            <Select placeholder="请选择职位">
              <Option value="总经理">总经理</Option>
              <Option value="副总经理">副总经理</Option>
              <Option value="部长">部长</Option>
              <Option value="副部长">副部长</Option>
              <Option value="主任">主任</Option>
              <Option value="业务经理">业务经理</Option>
              <Option value="经理">经理</Option>
              <Option value="副经理">副经理</Option>
              <Option value="油站经理">油站经理</Option>
              <Option value="加油员">加油员</Option>
              <Option value="收银员">收银员</Option>
              <Option value="财务人员">财务人员</Option>
              <Option value="安全管理人员">安全管理人员</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="contact" 
            label="联系电话" 
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item 
            name="status" 
            label="状态" 
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="在职">在职</Option>
              <Option value="离职">离职</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批抽屉 */}
      <EmployeeAuditDrawer
        visible={auditDrawerVisible}
        record={currentAuditRecord}
        onClose={() => setAuditDrawerVisible(false)}
        onSubmit={handleAuditSubmit}
      />
    </div>
  );
};

export default EmployeeManagement; 