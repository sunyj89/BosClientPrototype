import React, { useState, useEffect } from 'react';
import { 
  Table, Form, Button, Space, Input, message, Modal, Tag, 
  Select, TreeSelect, Card, Row, Col, List, Badge, Tabs, 
  Checkbox, Drawer, Descriptions, Timeline, Radio, Spin, 
  Alert, Divider, DatePicker, InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined,
  AuditOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { delay, mockResponse } from '../../utils/utils';
import orgData from '../../mock/station/orgData.json';
import StationApprovalData from '../../mock/station/StationApprovalData.json';
import stationData from '../../mock/station/stationData.json';
import './index.css';

// 直接定义常量，替代constants.js

// 站点状态常量
const STATION_STATUS = {
  ACTIVE: '正常',
  MAINTENANCE: '维护中',
  CLOSED: '关闭',
  SHUTDOWN: '停业'
};

// 审批状态常量
const APPROVAL_STATUS = {
  PENDING: '待审批',
  APPROVED: '已审批',
  REJECTED: '已拒绝'
};

// 油品类型
const OIL_TYPES = [
  '92#汽油',
  '95#汽油',
  '98#汽油',
  '0#柴油',
  '-10#柴油',
  '-20#柴油'
];

// 表单布局
const FORM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

// 表单验证规则
const FORM_RULES = {
  required: { required: true, message: '此字段为必填项' },
  phone: { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
  email: { type: 'email', message: '请输入正确的邮箱格式' },
  number: { type: 'number', message: '请输入数字' }
};

// 分页配置
const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条记录`,
  pageSizeOptions: ['10', '20', '30', '50']
};

const { confirm } = Modal;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;
const { TextArea } = Input;

// === 服务函数 ===

// 组织结构服务
async function fetchOrgStructure() {
  await delay(500); // 模拟网络延迟
  return mockResponse(orgData);
}

// 创建油站
async function createStation(data) {
  await delay(800);
  const newStation = {
    id: `ST${Date.now().toString().substr(-6)}`,
    ...data,
    createTime: new Date().toISOString().split('T')[0]
  };
  return mockResponse(newStation);
}

// 更新油站
async function updateStation(data) {
  await delay(800);
  return mockResponse(data);
}

// 删除油站
async function deleteStation(id) {
  await delay(800);
  return mockResponse(null);
}

// 获取油站审批历史
async function fetchStationAuditHistory(stationId) {
  try {
    // 模拟从后端获取审批历史
    await delay(500);
    return {
      success: true,
      message: '获取审批历史成功',
      list: [
        {
          id: '1',
          stationId: stationId,
          operateUser: '张经理',
          operateType: '提交审批',
          content: '新增油站，请审批',
          time: '2023-05-15 10:30:45'
        },
        {
          id: '2',
          stationId: stationId,
          operateUser: '李总监',
          operateType: '审批通过',
          content: '油站信息符合要求，同意增设',
          time: '2023-05-16 14:22:18'
        }
      ]
    };
  } catch (error) {
    console.error('获取油站审批历史失败:', error);
    return { success: false, message: '获取油站审批历史失败' };
  }
}

// 审批油站
async function auditStation(auditData) {
  try {
    // 模拟审批请求
    console.log('审批数据:', auditData);
    
    // 模拟延迟
    await delay(500);
    
    // 创建一条审批记录
    const auditRecord = {
      id: `audit-${Date.now()}`,
      stationId: auditData.stationId,
      operateUser: auditData.operateUser || '当前用户',
      operateType: auditData.result === 'approve' ? '审批通过' : '审批拒绝',
      content: auditData.comments,
      time: auditData.operateTime || new Date().toISOString()
    };
    
    return {
      success: true,
      message: auditData.result === 'approve' ? '审批通过成功' : '拒绝审批成功',
      data: {
        auditRecord,
        updatedStatus: auditData.result === 'approve' ? '已通过' : '已拒绝'
      }
    };
  } catch (error) {
    console.error('审批油站失败:', error);
    return { success: false, message: '审批油站失败' };
  }
}

// 批量审批油站
async function batchAuditStations(batchData) {
  try {
    // 模拟批量审批请求
    console.log('批量审批数据:', batchData);
    
    // 模拟延迟
    await delay(800);
    
    // 为每个ID创建一条审批记录
    const auditRecords = batchData.ids.map(id => ({
      id: `audit-batch-${id}-${Date.now()}`,
      stationId: id,
      operateUser: batchData.operateUser || '当前用户',
      operateType: batchData.result === 'approve' ? '审批通过' : '审批拒绝',
      content: batchData.comments,
      time: batchData.operateTime || new Date().toISOString()
    }));
    
    return {
      success: true,
      message: batchData.result === 'approve' ? '批量审批通过成功' : '批量拒绝成功',
      data: {
        auditRecords,
        updatedIds: batchData.ids
      }
    };
  } catch (error) {
    console.error('批量审批油站失败:', error);
    return { success: false, message: '批量审批油站失败' };
  }
}

// 获取待审批油站列表
async function fetchPendingApprovals(params) {
  await delay(500);
  const { approvalType, current = 1, pageSize = 10 } = params || {};
  
  let pendingApprovals = [...StationApprovalData.pendingApprovals];
  
  // 应用筛选条件
  if (approvalType) {
    pendingApprovals = pendingApprovals.filter(item => item.approvalType === approvalType);
  }
  
  // 处理分页
  const total = pendingApprovals.length;
  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const list = pendingApprovals.slice(startIndex, endIndex);
  
  return mockResponse({
    list,
    total,
    current,
    pageSize
  });
}

// 获取审批历史记录
async function fetchApprovalHistory(params) {
  await delay(500);
  const { stationId, current = 1, pageSize = 10 } = params || {};
  
  let approvalHistory = [...StationApprovalData.approvalHistory];
  
  // 如果提供了stationId，过滤特定油站的审批历史
  if (stationId) {
    approvalHistory = approvalHistory.filter(item => item.stationId === stationId);
  }
  
  // 处理分页
  const total = approvalHistory.length;
  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const list = approvalHistory.slice(startIndex, endIndex);
  
  return mockResponse({
    list,
    total,
    current,
    pageSize
  });
}

// 获取油站统计数据
async function fetchStationStats(stationId) {
  await delay(800);
  
  // 模拟统计数据
  return mockResponse({
    id: stationId,
    dailySales: Math.floor(Math.random() * 50000) + 30000,
    monthSales: Math.floor(Math.random() * 1500000) + 1000000,
    oilVolume: Math.floor(Math.random() * 5000) + 3000,
    customerCount: Math.floor(Math.random() * 300) + 200
  });
}

const StationManagement = () => {
  const location = useLocation();
  
  // === 状态管理 ===
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  
  // 油站管理状态
  const [stationList, setStationList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filterForm] = Form.useForm();
  
  // 表格列定义 - 直接在组件内定义，替代constants.js中的定义
  const stationColumns = [
    {
      title: '站点编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '站点名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '站点地址',
      dataIndex: 'address',
      key: 'address',
      width: 220,
    },
    {
      title: '站点类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStationForm(record)}
          >
            编辑
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteStation(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];
  
  // 油站表单状态
  const [stationForm] = Form.useForm();
  const [stationFormVisible, setStationFormVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [stationFormLoading, setStationFormLoading] = useState(false);
  const [stationFormSubmitting, setStationFormSubmitting] = useState(false);
  const [branchOptions, setBranchOptions] = useState([]);
  
  // 审批中心状态
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [pendingList, setPendingList] = useState([]);
  const [pendingPagination, setPendingPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [approvalFilter, setApprovalFilter] = useState({
    type: 'all'
  });
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [auditComments, setAuditComments] = useState('');
  const [batchAuditVisible, setBatchAuditVisible] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [auditDrawerVisible, setAuditDrawerVisible] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [auditHistory, setAuditHistory] = useState([]);
  const [stationAuditForm] = Form.useForm();
  const [auditResult, setAuditResult] = useState('approve');
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // 初始化加载数据
  useEffect(() => {
    // 直接使用stationData中的数据初始化表格
    if (stationData && stationData.stations && stationData.stations.length > 0) {
      const initialStations = stationData.stations;
      setStationList(initialStations);
      setPagination({
        ...pagination,
        total: initialStations.length
      });
    }
    
    fetchOrganizationData();
    fetchPendingCount();
    
    // 如果URL带有activeTabKey参数，则自动切换到对应的选项卡
    if (location.state?.activeTabKey) {
      setActiveTabKey(location.state.activeTabKey);
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Tab切换时加载相应数据
  useEffect(() => {
    if (activeTabKey === '1') {
      fetchStationList(filterForm.getFieldsValue());
    } else {
      fetchPendingStations();
    }
  }, [activeTabKey]);

  // 获取待审批记录总数
  const fetchPendingCount = async () => {
    try {
      const result = await fetchPendingApprovals({
        pageSize: 1, // 只需要获取总数，所以只请求1条数据
        current: 1
      });
      
      if (result && result.data) {
        setPendingCount(result.data.total);
      }
    } catch (error) {
      console.error('获取待审批总数失败:', error);
    }
  };

  // 加载组织结构数据，用于获取分公司和油站树形结构
  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      const result = await fetchOrgStructure();
      if (result && result.data) {
        console.log('获取到的组织结构数据:', result.data);
        
        // 将导入的数据转换为TreeSelect可用的格式
        const convertToTreeData = (nodes) => {
          if (!nodes || nodes.length === 0) return [];
          
          return nodes.map(node => {
            const treeNode = {
              title: node.name,
              value: `${node.type === 'organization' ? 'org' : node.type === 'serviceArea' ? 'area' : 'station'}-${node.id}`,
              key: `${node.type === 'organization' ? 'org' : node.type === 'serviceArea' ? 'area' : 'station'}-${node.id}`,
              type: node.type,
              children: node.children ? convertToTreeData(node.children) : [],
              isLeaf: node.type === 'station'
            };
            return treeNode;
          });
        };
        
        const transformedData = convertToTreeData(result.data);
        console.log('转换后的组织树数据:', transformedData);
        setTreeData(transformedData);
      }
    } catch (error) {
      message.error('获取组织结构失败');
      console.error('获取组织结构失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取油站列表 - 仅获取已审批通过的
  const fetchStationList = async (filters = {}) => {
    try {
      setLoading(true);
      
      await delay(500); // 模拟网络延迟
      
      // 使用stationData中的数据
      let allStations = [...stationData.stations];
      let filteredStations = [...allStations];
      
      // 应用筛选条件
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredStations = filteredStations.filter(station => 
          (station.id && station.id.toLowerCase().includes(keyword)) ||
          (station.name && station.name.toLowerCase().includes(keyword)) ||
          (station.address && station.address.toLowerCase().includes(keyword)) ||
          (station.branchName && station.branchName.toLowerCase().includes(keyword))
        );
      }
      
      if (filters.status) {
        filteredStations = filteredStations.filter(station => 
          station.status === filters.status
        );
      }
      
      if (filters.orgNodes && filters.orgNodes.length > 0) {
        filteredStations = filteredStations.filter(station => {
          for (const nodeValue of filters.orgNodes) {
            // 简化组织节点逻辑匹配，仅基于ID
            if (nodeValue.includes(station.branchId) || 
                nodeValue.includes(station.id) || 
                (station.serviceAreaId && nodeValue.includes(station.serviceAreaId))) {
              return true;
            }
          }
          return false;
        });
      }
      
      // 设置分页
      const current = filters.current || pagination.current;
      const pageSize = filters.pageSize || pagination.pageSize;
      const total = filteredStations.length;
      
      // 计算当前页数据
      const startIndex = (current - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      const pagedStations = filteredStations.slice(startIndex, endIndex);
      
      // 更新状态
      setStationList(pagedStations);
      setPagination({
        ...pagination,
        current,
        pageSize,
        total
      });
    } catch (error) {
      message.error('获取油站列表失败');
      console.error('获取油站列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取待审批油站列表
  const fetchPendingStations = async (filters = {}) => {
    try {
      setPendingLoading(true);
      
      const { approvalType, current = 1, pageSize = 10 } = filters || {};
      
      // 调用API获取待审批列表
      const result = await fetchPendingApprovals({
        approvalType,
        current,
        pageSize
      });
      
      if (result && result.data) {
        setPendingList(result.data.list || []);
        setPendingPagination({
          ...pendingPagination,
          current: result.data.current || 1,
          total: result.data.total || 0,
          pageSize: result.data.pageSize || 10
        });
      }
    } catch (error) {
      message.error('获取待审批列表失败');
      console.error('获取待审批列表失败:', error);
    } finally {
      setPendingLoading(false);
    }
  };

  // 批量审批操作
  const handleBatchAudit = async (result) => {
    if (selectedKeys.length === 0) {
      message.info('请选择要审批的记录');
      return;
    }
    
    const selectedIds = selectedKeys;
    
    try {
      setPendingLoading(true);
      const response = await batchAuditStations({
        ids: selectedIds,
        result: result,
        comments: `批量${result === 'approve' ? '通过' : '拒绝'}`,
        operateUser: '当前审批人',
        operateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      
      if (response.success) {
        message.success(`批量${result === 'approve' ? '通过' : '拒绝'}成功`);
        // 刷新数据
        fetchPendingStations();
        fetchPendingCount();
        // 清空选中
        setSelectedKeys([]);
      } else {
        message.error(response.message || '批量审批失败');
      }
    } catch (error) {
      console.error('批量审批失败:', error);
      message.error('批量审批失败');
    } finally {
      setPendingLoading(false);
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
      setSelectedKeys(selectedRowKeys);
    }
  };

  // 审批中心 - 获取申请类型标签
  const getApprovalTypeTag = (type) => {
    switch (type) {
      case 'create':
        return <Tag color="green">新增</Tag>;
      case 'update':
        return <Tag color="blue">修改</Tag>;
      case 'delete':
        return <Tag color="red">删除</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 审批中心 - 获取审批状态标签
  const getApprovalStatusTag = (status) => {
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return <Tag className="status-pending">{status}</Tag>;
      case APPROVAL_STATUS.APPROVED:
        return <Tag className="status-approved">{status}</Tag>;
      case APPROVAL_STATUS.REJECTED:
        return <Tag className="status-rejected">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 审批中心 - 待审批表格列定义
  const pendingColumns = [
    {
      title: '油站ID',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: '油站名称',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150
    },
    {
      title: '申请类型',
      dataIndex: 'approvalType',
      key: 'approvalType',
      width: 100,
      render: (type) => getApprovalTypeTag(type)
    },
    {
      title: '状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (status) => getApprovalStatusTag(status)
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 120
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<AuditOutlined />}
            onClick={() => openAuditDrawer(record)}
          >
            审批
          </Button>
        </Space>
      )
    }
  ];

  // 审批中心 - 渲染筛选表单
  const renderApprovalFilterForm = () => {
    return (
      <div className="filter-form">
        <Space>
          <Select 
            placeholder="选择申请类型" 
            allowClear
            style={{ width: 150 }}
            onChange={(value) => {
              fetchPendingStations({ approvalType: value });
            }}
          >
            <Option value="create">新增</Option>
            <Option value="update">修改</Option>
            <Option value="delete">删除</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => {
              fetchPendingStations({});
            }}
          >
            重置
          </Button>
        </Space>
      </div>
    );
  };

  // 审批中心 - 渲染批量操作区
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

  // 渲染审批中心Tab
  const renderApprovalCenterTab = () => {
    return (
      <div className="approval-center-container">
        {renderApprovalFilterForm()}
        
        {renderBatchActions()}
        
        <Table
          rowSelection={rowSelection}
          columns={pendingColumns}
          dataSource={pendingList}
          rowKey="id"
          pagination={pendingPagination}
          onChange={(pagination) => {
            fetchPendingStations({
              current: pagination.current,
              pageSize: pagination.pageSize
            });
          }}
          loading={pendingLoading}
          className="approval-table"
        />
      </div>
    );
  };

  // 处理表格分页、排序、筛选变化
  const handleTableChange = (paginationInfo) => {
    setPagination(paginationInfo);
    const filters = filterForm.getFieldsValue();
    fetchStationList({
      ...filters,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    });
  };

  // 处理待审批表格分页变化
  const handlePendingTableChange = (pagination) => {
    setPendingPagination(pagination);
    fetchPendingStations({
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  // 处理筛选表单提交
  const handleFilterSubmit = (values) => {
    // 重置到第一页
    setPagination({
      ...pagination,
      current: 1
    });
    fetchStationList({
      ...values,
      current: 1
    });
  };

  // 重置筛选条件
  const handleFilterReset = () => {
    filterForm.resetFields();
    setPagination({
      ...pagination,
      current: 1  // 重置到第一页
    });
    // 重置后显示所有数据
    setStationList(stationData.stations);
    setPagination({
      ...pagination,
      current: 1,
      total: stationData.stations.length
    });
  };

  // 打开新增油站表单
  const handleAddStation = () => {
    setEditingStation(null);
    setStationFormVisible(true);
  };

  // 打开编辑油站表单
  const handleEditStation = (record) => {
    setEditingStation(record);
    setStationFormVisible(true);
  };

  // 删除油站
  const handleDeleteStation = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除油站"${record.name}"吗？此操作需要审批后才能生效。`,
      onOk: async () => {
        try {
          await deleteStation(record.id);
          message.success('删除申请已提交审批');
          // 刷新待审批列表和Badge计数
          setActiveTabKey('2'); // 切换到审批中心Tab
          fetchPendingStations(); // 刷新待审批列表
          fetchPendingCount(); // 更新待审批数量
        } catch (error) {
          message.error('删除申请提交失败');
          console.error('删除申请提交失败:', error);
        }
      }
    });
  };

  // 表单提交成功处理
  const handleFormSuccess = () => {
    setStationFormVisible(false);
    
    // 更新相应Tab的数据
    if (activeTabKey === '1') {
      fetchStationList(filterForm.getFieldsValue());
    } else {
      fetchPendingStations();
    }
    
    // 提交成功后切换到审批中心Tab
    setActiveTabKey('2');
  };

  // 获取状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '正常':
        return 'green';
      case '维护中':
        return 'orange';
      case '停业':
        return 'red';
      case '暂停营业':
        return 'volcano';
      default:
        return 'default';
    }
  };

  // 获取审批状态颜色
  const getApprovalStatusColor = (status) => {
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return '#faad14';  // 黄色
      case APPROVAL_STATUS.APPROVED:
        return '#52c41a';  // 绿色
      case APPROVAL_STATUS.REJECTED:
        return '#f5222d';  // 红色
      default:
        return '#d9d9d9';  // 灰色
    }
  };

  // 审批抽屉 - 获取审批历史记录
  const fetchHistory = async (stationId) => {
    try {
      setHistoryLoading(true);
      const response = await fetchStationAuditHistory(stationId);
      setAuditHistory(response.list || []);
    } catch (error) {
      console.error('获取审批历史失败', error);
      message.error('获取审批历史失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  // 审批抽屉 - 提交审批
  const handleAuditSubmit = async () => {
    try {
      const values = await stationAuditForm.validateFields();
      setAuditSubmitting(true);
      
      const response = await auditStation({
        stationId: currentStation.id,
        result: values.result,
        comments: values.comments,
        operateUser: '当前审批人', // 实际项目中应该从登录用户信息中获取
        operateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      
      if (response.success) {
        message.success(response.message || '审批操作成功');
        setAuditDrawerVisible(false);
        // 刷新数据
        fetchPendingStations();
        fetchPendingCount();
      } else {
        message.error(response.message || '审批操作失败');
      }
    } catch (error) {
      console.error('审批提交错误:', error);
      message.error('提交失败，请检查表单');
    } finally {
      setAuditSubmitting(false);
    }
  };

  // 审批抽屉 - 获取状态图标
  const getStatusIcon = (operateType) => {
    if (operateType.includes('通过')) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    } else if (operateType.includes('拒绝')) {
      return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    } else if (operateType.includes('提交')) {
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    } else {
      return <UserOutlined />;
    }
  };

  // 审批抽屉 - 打开抽屉
  const openAuditDrawer = (station) => {
    setCurrentStation(station);
    setAuditDrawerVisible(true);
    stationAuditForm.resetFields();
    if (station?.id) {
      fetchHistory(station.id);
    }
  };

  // 审批抽屉 - 渲染油站信息
  const renderStationInfo = () => {
    if (!currentStation) return null;

    return (
      <div className="audit-info">
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="油站ID" span={1}>{currentStation.id}</Descriptions.Item>
          <Descriptions.Item label="油站名称" span={1}>{currentStation.name}</Descriptions.Item>
          <Descriptions.Item label="所属分公司" span={1}>{currentStation.branchName}</Descriptions.Item>
          <Descriptions.Item label="站长" span={1}>{currentStation.manager}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={1}>{currentStation.contact}</Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>
            <Tag color={getStatusColor(currentStation.status)}>
              {currentStation.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="油品类型" span={2}>{currentStation.oilTypes}</Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>{currentStation.address}</Descriptions.Item>
          <Descriptions.Item label="加油枪数" span={1}>{currentStation.gunCount || currentStation.oilGuns}</Descriptions.Item>
          <Descriptions.Item label="员工数" span={1}>{currentStation.employeeCount || currentStation.employees}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>{currentStation.createTime}</Descriptions.Item>
          <Descriptions.Item label="审批状态" span={1}>
            <Tag color={getApprovalStatusColor(currentStation.approvalStatus)}>
              {currentStation.approvalStatus || '无需审批'}
            </Tag>
          </Descriptions.Item>
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
              auditHistory.map((item, index) => (
                <Timeline.Item 
                  key={index}
                  dot={getStatusIcon(item.operateType)}
                >
                  <div className="audit-history-item">
                    <div style={{ fontWeight: 'bold' }}>
                      {item.operateUser} - {item.operateType}
                    </div>
                    <div>{item.content}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>
                      {item.time}
                    </div>
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
    const isPending = currentStation?.approvalStatus === APPROVAL_STATUS.PENDING;

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
                rules={[FORM_RULES.required]}
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

  // 审批抽屉 - 渲染抽屉组件
  const renderAuditDrawer = () => {
    return (
      <Drawer
        title="审批油站信息"
        width={600}
        onClose={() => setAuditDrawerVisible(false)}
        open={auditDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        className="audit-drawer"
      >
        <Alert
          message={`审批类型: ${
            currentStation?.approvalType === 'create' 
              ? '新增' 
              : currentStation?.approvalType === 'update' 
                ? '修改' 
                : '删除'
          }`}
          type={
            currentStation?.approvalStatus === APPROVAL_STATUS.PENDING 
              ? 'warning'
              : currentStation?.approvalStatus === APPROVAL_STATUS.APPROVED
                ? 'success'
                : 'error'
          }
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        {renderStationInfo()}
        
        <Divider style={{ margin: '24px 0 16px' }} />
        
        <h3>审批历史</h3>
        {renderAuditHistory()}
        
        <Divider style={{ margin: '24px 0 16px' }} />
        
        <h3>审批操作</h3>
        {renderAuditForm()}
      </Drawer>
    );
  };

  // 油站表单 - 获取组织数据
  const fetchOrgData = async () => {
    try {
      setStationFormLoading(true);
      const result = await fetchOrgStructure();
      if (result && result.data) {
        // 提取分公司选项
        if (result.data.branches && result.data.branches.length > 0) {
          const options = result.data.branches.map(branch => ({
            label: branch.name,
            value: branch.id
          }));
          setBranchOptions(options);
        }
      }
    } catch (error) {
      message.error('获取组织数据失败');
      console.error('获取组织数据失败:', error);
    } finally {
      setStationFormLoading(false);
    }
  };

  // 油站表单 - 打开表单
  const openStationForm = (station = null) => {
    setEditingStation(station);
    setStationFormVisible(true);
    stationForm.resetFields();
    fetchOrgData();

    if (station) {
      // 编辑模式，设置初始值
      const formValues = {
        ...station,
        oilTypes: typeof station.oilTypes === 'string' && station.oilTypes 
          ? station.oilTypes.split(', ') 
          : Array.isArray(station.oilTypes) 
            ? station.oilTypes 
            : [],
        createTime: station.createTime ? moment(station.createTime) : null
      };
      stationForm.setFieldsValue(formValues);
    } else {
      // 新增模式，设置默认值
      stationForm.setFieldsValue({
        status: '正常', // 使用中文状态值而非常量
        createTime: moment(),
        gunCount: 0,
        employeeCount: 0
      });
    }
  };

  // 油站表单 - 提交表单
  const handleStationSubmit = async () => {
    try {
      // 表单验证
      const values = await stationForm.validateFields();
      
      // 格式化提交数据
      const submitData = {
        ...values,
        oilTypes: Array.isArray(values.oilTypes) ? values.oilTypes.join(', ') : (typeof values.oilTypes === 'string' ? values.oilTypes : ''),
        createTime: values.createTime ? values.createTime.format('YYYY-MM-DD HH:mm:ss') : null,
        approvalStatus: APPROVAL_STATUS.PENDING, // 设置为待审批状态
        approvalType: editingStation ? 'update' : 'create', // 标记审批类型
        submitter: '当前用户', // 实际项目中应该从登录用户信息中获取
        submitTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      
      setStationFormSubmitting(true);
      
      // 提交到服务器
      if (editingStation) {
        await updateStation(submitData);
        message.success('油站修改已提交审批');
      } else {
        await createStation(submitData);
        message.success('新油站已提交审批');
      }
      
      // 关闭表单并刷新数据
      setStationFormVisible(false);
      setActiveTabKey('2'); // 切换到审批中心Tab
      fetchPendingStations(); // 刷新待审批列表
      fetchPendingCount(); // 更新待审批数量
    } catch (error) {
      if (error.errorFields) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error(editingStation ? '提交审批失败' : '创建油站失败');
        console.error(editingStation ? '提交审批失败:' : '创建油站失败:', error);
      }
    } finally {
      setStationFormSubmitting(false);
    }
  };

  // 油站表单 - 渲染油品类型选项
  const renderOilTypeOptions = () => {
    return OIL_TYPES.map((value) => (
      <Option key={value} value={value}>
        {value}
      </Option>
    ));
  };

  // 油站表单 - 渲染状态选项
  const renderStatusOptions = () => {
    // 直接使用stationData.json中的状态值
    const statusOptions = [
      { value: '正常', label: '正常' },
      { value: '维护中', label: '维护中' },
      { value: '停业', label: '停业' }
    ];
    
    return statusOptions.map(option => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ));
  };

  // 油站表单 - 渲染分公司选项
  const renderBranchOptions = () => {
    return branchOptions && branchOptions.length > 0 ? branchOptions.map(option => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    )) : [];
  };

  // 油站表单 - 渲染表单抽屉
  const renderStationForm = () => {
    const title = editingStation ? '编辑油站' : '新增油站';
    
    return (
      <Drawer
        title={title}
        width={600}
        onClose={() => setStationFormVisible(false)}
        open={stationFormVisible}
        bodyStyle={{ paddingBottom: 80 }}
        className="station-drawer"
        destroyOnClose={true}
        footer={
          <div className="drawer-footer">
            <Space>
              <Button onClick={() => setStationFormVisible(false)}>取消</Button>
              <Button 
                type="primary" 
                onClick={handleStationSubmit} 
                loading={stationFormSubmitting}
              >
                提交审批
              </Button>
            </Space>
          </div>
        }
      >
        <Spin spinning={stationFormLoading}>
          <Form
            form={stationForm}
            layout="horizontal"
            {...FORM_LAYOUT}
          >
            <Form.Item
              name="name"
              label="油站名称"
              rules={[FORM_RULES.required]}
            >
              <Input placeholder="请输入油站名称" />
            </Form.Item>
            
            <Form.Item
              name="branchId"
              label="所属分公司"
              rules={[FORM_RULES.required]}
            >
              <Select placeholder="请选择所属分公司">
                {renderBranchOptions()}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="manager"
              label="站长"
              rules={[FORM_RULES.required]}
            >
              <Input placeholder="请输入站长姓名" />
            </Form.Item>
            
            <Form.Item
              name="contact"
              label="联系电话"
              rules={[FORM_RULES.phone]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            
            <Form.Item
              name="address"
              label="地址"
              rules={[FORM_RULES.required]}
            >
              <Input placeholder="请输入油站地址" />
            </Form.Item>
            
            <Form.Item
              name="status"
              label="状态"
              rules={[FORM_RULES.required]}
            >
              <Select placeholder="请选择状态">
                {renderStatusOptions()}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="oilTypes"
              label="油品类型"
              rules={[FORM_RULES.required]}
            >
              <Select mode="multiple" placeholder="请选择油品类型">
                {renderOilTypeOptions()}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="gunCount"
              label="加油枪数量"
              rules={[FORM_RULES.required]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="employeeCount"
              label="员工数量"
              rules={[FORM_RULES.required]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="createTime"
              label="创建时间"
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Spin>
      </Drawer>
    );
  };

  // 渲染页面主体
  return (
    <div className="station-container">
      <Tabs 
        activeKey={activeTabKey} 
        onChange={setActiveTabKey} 
        type="card"
        className="approval-tabs"
      >
        <TabPane tab="油站管理" key="1">
          {/* 油站管理Tab */}
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <Space style={{ float: 'right' }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openStationForm()}
                  >
                    新增油站
                  </Button>
                </Space>
              </Col>
            </Row>
            
            {/* 筛选表单 */}
            <Form
              form={filterForm}
              layout="inline"
              onFinish={handleFilterSubmit}
              className="filter-form"
              style={{ marginBottom: '16px' }}
            >
              <Form.Item name="orgNodes" label="组织/油站">
                <TreeSelect
                  treeData={treeData}
                  placeholder="请选择组织或油站"
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                  multiple
                  showCheckedStrategy={SHOW_PARENT}
                  treeCheckable
                  style={{ width: 300 }}
                />
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select
                  placeholder="请选择状态"
                  allowClear
                  style={{ width: 120 }}
                >
                  <Option value="正常">正常</Option>
                  <Option value="维护中">维护中</Option>
                  <Option value="停业">停业</Option>
                </Select>
              </Form.Item>
              <Form.Item name="keyword" label="关键词">
                <Input 
                  placeholder="站点名称/编号/地址"
                  allowClear
                  style={{ width: 180 }}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleFilterReset}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            
            {/* 油站列表表格 */}
            <div style={{ marginBottom: '10px' }}>
              <strong>油站总数: {stationData.stations?.length || 0}</strong>
            </div>
            <Table
              columns={stationColumns}
              dataSource={stationList}
              rowKey="id"
              pagination={pagination}
              onChange={handleTableChange}
              loading={loading}
              scroll={{ x: 1500 }}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              审批中心
              {pendingCount > 0 && <Badge count={pendingCount} style={{ marginLeft: 8 }} />}
            </span>
          } 
          key="2"
        >
          {/* 审批中心Tab */}
          <Card>
            {renderApprovalCenterTab()}
          </Card>
        </TabPane>
      </Tabs>
      
      {/* 油站表单抽屉 */}
      {renderStationForm()}
      
      {/* 审批抽屉 */}
      {renderAuditDrawer()}
    </div>
  );
};

export default StationManagement; 