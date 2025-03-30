import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Space, Input, message, Modal, Tag, Select, TreeSelect, Card, Row, Col, List, Badge, Tabs, Checkbox } from 'antd';
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
  FilterOutlined
} from '@ant-design/icons';
import { fetchOrgStructure, fetchStationStats, deleteStation, batchAuditStations, fetchPendingApprovals } from './services/stationService';
import { STATION_TABLE_COLUMNS, STATION_STATUS, PAGINATION_CONFIG, APPROVAL_STATUS } from './utils/constants';
import StationForm from './components/StationForm';
import AuditDrawer from './components/AuditDrawer';
import { useLocation } from 'react-router-dom';
import './index.css';

const { confirm } = Modal;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;

const StationManagement = () => {
  const location = useLocation();
  
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [pendingStations, setPendingStations] = useState([]);
  const [pagination, setPagination] = useState({
    ...PAGINATION_CONFIG,
    current: 1,
    total: 0
  });
  const [pendingPagination, setPendingPagination] = useState({
    ...PAGINATION_CONFIG,
    current: 1,
    total: 0
  });
  const [stationFormVisible, setStationFormVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [filterForm] = Form.useForm();
  const [approvalFilterForm] = Form.useForm();
  const [auditDrawerVisible, setAuditDrawerVisible] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState(
    location.state?.activeTabKey || '1'
  );
  const [selectedPendingRows, setSelectedPendingRows] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // 初始化加载数据
  useEffect(() => {
    fetchOrganizationData();
    fetchStationList();
    fetchPendingCount();
    
    // 清除location.state，防止刷新页面后仍然停留在审批中心选项卡
    if (location.state?.activeTabKey) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Tab切换时加载相应数据
  useEffect(() => {
    if (activeTabKey === '1') {
      fetchStationList(filterForm.getFieldsValue());
    } else {
      fetchPendingStations(approvalFilterForm.getFieldsValue());
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
      
      // 实际项目中应该调用API获取筛选后的油站列表
      // 这里我们模拟从组织结构中获取数据并进行筛选
      const result = await fetchOrgStructure();
      if (result && result.data) {
        let allStations = [];
        
        // 从新的组织结构中提取所有油站
        const extractStations = (nodes, parentInfo = {}) => {
          if (!nodes || nodes.length === 0) return;
          
          nodes.forEach(node => {
            if (node.type === 'station') {
              // 获取随机油站状态
              const statusOptions = [
                STATION_STATUS.NORMAL, 
                STATION_STATUS.MAINTENANCE, 
                STATION_STATUS.SHUTDOWN, 
                STATION_STATUS.SUSPENDED
              ];
              const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
              
              // 生成随机数据
              const stationIndex = allStations.length;
              const oilGunCount = 4 + Math.floor(Math.random() * 8); // 4-12油枪
              const oilTankCount = 2 + Math.floor(Math.random() * 4); // 2-6油罐
              const employeeCount = 8 + Math.floor(Math.random() * 15); // 8-23员工
              const dailySales = 40000 + Math.floor(Math.random() * 60000); // 4-10万日销售额
              
              // 生成手机号
              const phonePrefix = ['138', '139', '135', '158', '187', '186', '150', '151', '189'];
              const randomPrefix = phonePrefix[Math.floor(Math.random() * phonePrefix.length)];
              const randomSuffix = String(1000000 + Math.floor(Math.random() * 9000000)).substring(1);
              const randomPhone = `${randomPrefix}${randomSuffix}`;
              
              // 生成创建日期和更新日期
              const currentDate = new Date();
              const creationDate = new Date(currentDate);
              creationDate.setMonth(currentDate.getMonth() - Math.floor(Math.random() * 24)); // 0-24个月前
              
              const updateDate = new Date(creationDate);
              updateDate.setDate(updateDate.getDate() + Math.floor(Math.random() * 180)); // 0-180天后
              
              // 格式化日期
              const formatDate = (date) => {
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              };
              
              // 提取油站信息，包括上级组织信息
              allStations.push({
                id: node.id,
                name: node.name,
                branchName: parentInfo.branchName || '未知分公司',
                branchId: parentInfo.branchId || '',
                serviceAreaName: parentInfo.serviceAreaName || '未知服务区',
                serviceAreaId: parentInfo.serviceAreaId || '',
                address: node.address || `江西省南昌市青山湖区昌东大道${stationIndex + 1}号`,
                status: randomStatus,
                approvalStatus: APPROVAL_STATUS.APPROVED, // 默认为已审批
                // 以下为模拟数据
                manager: `站长${String.fromCharCode(65 + (stationIndex % 26))}`,
                contact: randomPhone,
                oilGuns: oilGunCount,
                oilTanks: oilTankCount,
                employees: employeeCount,
                dailySales: dailySales,
                createTime: formatDate(creationDate),
                updateTime: formatDate(updateDate),
              });
            } else if (node.children && node.children.length > 0) {
              let newParentInfo = { ...parentInfo };
              
              if (node.type === 'organization' && node.id !== 'JXJTFS') {
                // 记录分公司信息
                newParentInfo.branchName = node.name;
                newParentInfo.branchId = node.id;
              } else if (node.type === 'serviceArea') {
                // 记录服务区信息
                newParentInfo.serviceAreaName = node.name;
                newParentInfo.serviceAreaId = node.id;
              }
              
              // 递归处理子节点
              extractStations(node.children, newParentInfo);
            }
          });
        };
        
        // 提取所有油站
        extractStations(result.data);
        
        // 应用筛选条件
        let filteredStations = [...allStations];
        
        // 处理组织结构树选择
        if (filters.orgNodes && filters.orgNodes.length > 0) {
          // 对每个选择的节点进行判断
          const orgFilter = (station) => {
            for (const nodeValue of filters.orgNodes) {
              // 解析节点类型和ID
              const [nodeType, nodeId] = nodeValue.split('-');
              
              if (nodeType === 'org' && station.branchId === nodeId) {
                return true; // 如果是该分公司下的油站
              } else if (nodeType === 'area' && station.serviceAreaId === nodeId) {
                return true; // 如果是该服务区下的油站
              } else if (nodeType === 'station' && station.id === nodeId) {
                return true; // 如果是指定的油站
              }
            }
            return false;
          };
          
          // 筛选满足条件的油站
          filteredStations = filteredStations.filter(orgFilter);
        }
        
        // 状态筛选
        if (filters.status) {
          filteredStations = filteredStations.filter(station => 
            station.status === filters.status
          );
        }
        
        // 只显示非待审批的油站
        const approvedStations = filteredStations.filter(
          station => station.approvalStatus !== APPROVAL_STATUS.PENDING
        );
        
        // 处理分页
        const { current = 1, pageSize = 10 } = pagination;
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedStations = approvedStations.slice(startIndex, endIndex);
        
        setStationList(paginatedStations);
        setPagination({
          ...pagination,
          total: approvedStations.length
        });
      }
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
      
      // 调用API获取待审批数据
      const result = await fetchPendingApprovals({
        approvalType: filters.approvalType,
        orgNodes: filters.orgNodes,
        approvalStatus: filters.approvalStatus,
        keyword: filters.keyword,
        current: pendingPagination.current,
        pageSize: pendingPagination.pageSize
      });
      
      if (result && result.data) {
        // 处理关键字搜索
        let filteredList = [...result.data.list];
        
        if (filters.keyword) {
          const keyword = filters.keyword.toLowerCase();
          filteredList = filteredList.filter(item => 
            (item.id && item.id.toLowerCase().includes(keyword)) ||
            (item.name && item.name.toLowerCase().includes(keyword)) ||
            (item.branchName && item.branchName.toLowerCase().includes(keyword)) ||
            (item.approvalType && item.approvalType.toLowerCase().includes(keyword)) ||
            (item.submitter && item.submitter.toLowerCase().includes(keyword))
          );
        }
        
        // 处理组织筛选
        if (filters.orgNodes && filters.orgNodes.length > 0) {
          const orgFilter = (station) => {
            for (const nodeValue of filters.orgNodes) {
              // 解析节点类型和ID
              const [nodeType, nodeId] = nodeValue.split('-');
              
              if (nodeType === 'org' && station.branchId === nodeId) {
                return true; // 如果是该分公司下的油站
              } else if (nodeType === 'area' && station.serviceAreaId === nodeId) {
                return true; // 如果是该服务区下的油站
              } else if (nodeType === 'station' && station.id === nodeId) {
                return true; // 如果是指定的油站
              }
            }
            return false;
          };
          
          filteredList = filteredList.filter(orgFilter);
        }
        
        // 处理审批状态筛选
        if (filters.approvalStatus) {
          filteredList = filteredList.filter(item => 
            item.approvalStatus === filters.approvalStatus
          );
        }
        
        setPendingStations(filteredList);
        setPendingPagination({
          ...pendingPagination,
          total: result.data.total,
          current: result.data.current,
          pageSize: result.data.pageSize
        });
      }
    } catch (error) {
      message.error('获取待审批列表失败');
      console.error('获取待审批列表失败:', error);
    } finally {
      setPendingLoading(false);
    }
  };

  // 处理表格分页、排序、筛选变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    const filters = filterForm.getFieldsValue();
    fetchStationList(filters);
  };

  // 处理待审批表格分页变化
  const handlePendingTableChange = (pagination) => {
    setPendingPagination(pagination);
    const filters = approvalFilterForm.getFieldsValue();
    fetchPendingStations(filters);
  };

  // 处理筛选表单提交
  const handleFilterSubmit = () => {
    const values = filterForm.getFieldsValue();
    setPagination({
      ...pagination,
      current: 1  // 重置到第一页
    });
    fetchStationList(values);
  };

  // 处理待审批筛选表单提交
  const handleApprovalFilterSubmit = () => {
    const values = approvalFilterForm.getFieldsValue();
    setPendingPagination({
      ...pendingPagination,
      current: 1  // 重置到第一页
    });
    fetchPendingStations(values);
  };

  // 重置筛选条件
  const handleFilterReset = () => {
    filterForm.resetFields();
    setPagination({
      ...pagination,
      current: 1  // 重置到第一页
    });
    fetchStationList({});
  };

  // 重置待审批筛选条件
  const handleApprovalFilterReset = () => {
    approvalFilterForm.resetFields();
    setPendingPagination({
      ...pendingPagination,
      current: 1  // 重置到第一页
    });
    fetchPendingStations({});
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

  // 删除油站 - 修改为提交审批
  const handleDeleteStation = (record) => {
    confirm({
      title: '确认删除审批',
      icon: <ExclamationCircleOutlined />,
      content: `确定要提交油站 "${record.name}" 的删除审批吗？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 更新油站状态为待审批，操作类型为删除
          const updatedStation = {
            ...record,
            approvalStatus: APPROVAL_STATUS.PENDING,
            approvalType: 'delete',
            submitter: '当前用户', // 实际项目中应该从登录用户信息中获取
            submitTime: new Date().toISOString().split('.')[0].replace('T', ' ')
          };
          
          // 模拟API调用，提交删除审批
          await deleteStation(record.id);
          message.success('删除审批已提交');
          
          // 更新列表
          if (activeTabKey === '1') {
            fetchStationList(filterForm.getFieldsValue());
          } else {
            fetchPendingStations(approvalFilterForm.getFieldsValue());
          }
          
          // 切换到审批中心Tab
          setActiveTabKey('2');
        } catch (error) {
          message.error('提交删除审批失败');
          console.error('提交删除审批失败:', error);
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
      fetchPendingStations(approvalFilterForm.getFieldsValue());
    }
    
    // 提交成功后切换到审批中心Tab
    setActiveTabKey('2');
  };

  // 获取状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case STATION_STATUS.NORMAL:
        return 'green';
      case STATION_STATUS.MAINTENANCE:
        return 'orange';
      case STATION_STATUS.SHUTDOWN:
        return 'red';
      case STATION_STATUS.SUSPENDED:
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
        return '#32AF50';  // 绿色
      case APPROVAL_STATUS.REJECTED:
        return '#f5222d';  // 红色
      default:
        return '#d9d9d9';  // 灰色
    }
  };

  // 打开审批抽屉
  const handleAudit = (record) => {
    setCurrentStation(record);
    setAuditDrawerVisible(true);
  };

  // 审批成功处理
  const handleAuditSuccess = () => {
    setAuditDrawerVisible(false);
    
    // 更新相应Tab的数据
    if (activeTabKey === '1') {
      fetchStationList(filterForm.getFieldsValue());
    } else {
      fetchPendingStations(approvalFilterForm.getFieldsValue());
      setSelectedPendingRows([]);
    }
  };

  // 批量审批处理
  const handleBatchAudit = async (isApprove) => {
    if (selectedPendingRows.length === 0) {
      message.warning('请选择需要审批的记录');
      return;
    }

    try {
      setPendingLoading(true);
      const result = await batchAuditStations({
        ids: selectedPendingRows.map(item => item.id),
        result: isApprove ? 'approve' : 'reject',
        comments: isApprove ? '批量通过' : '批量拒绝',
        operateUser: '当前审批人', // 实际项目中应该从登录用户信息中获取
        operateTime: new Date().toISOString().split('.')[0].replace('T', ' ')
      });

      if (result.success) {
        message.success(isApprove ? '批量通过成功' : '批量拒绝成功');
        fetchPendingStations(approvalFilterForm.getFieldsValue());
        setSelectedPendingRows([]);
      } else {
        message.error(result.message || '批量审批失败');
      }
    } catch (error) {
      console.error('批量审批失败:', error);
      message.error('批量审批操作失败');
    } finally {
      setPendingLoading(false);
    }
  };

  // 表格选择变化
  const handlePendingSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedPendingRows(selectedRows);
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys: selectedPendingRows.map(item => item.id),
    onChange: handlePendingSelectionChange
  };

  // 扩展表格列配置，添加操作列
  const tableColumns = [
    ...STATION_TABLE_COLUMNS.filter(col => col.key !== 'action'), // 过滤掉原有的操作列
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditStation(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteStation(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 状态列的渲染函数
  const statusColumnIndex = tableColumns.findIndex(col => col.dataIndex === 'status');
  if (statusColumnIndex !== -1) {
    tableColumns[statusColumnIndex] = {
      ...tableColumns[statusColumnIndex],
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    };
  }
  
  // 待审批表格列配置
  const pendingColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
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
      title: '所属服务区',
      dataIndex: 'serviceAreaName',
      key: 'serviceAreaName',
      width: 150
    },
    {
      title: '申请类型',
      dataIndex: 'approvalType',
      key: 'approvalType',
      width: 100,
      render: (type) => (
        <Tag color={
          type === 'delete' ? 'red' :
          type === 'update' ? 'blue' : 'green'
        }>
          {type === 'delete' ? '删除' :
           type === 'update' ? '修改' : '新增'}
        </Tag>
      )
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (status) => {
        const color = getApprovalStatusColor(status);
        let text = '';
        
        switch(status) {
          case APPROVAL_STATUS.PENDING:
            text = '待审批';
            break;
          case APPROVAL_STATUS.APPROVED:
            text = '已批准';
            break;
          case APPROVAL_STATUS.REJECTED:
            text = '已拒绝';
            break;
          default:
            text = '未知状态';
        }
        
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 100
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<AuditOutlined />}
            size="small"
            onClick={() => handleAudit(record)}
          >
            审批
          </Button>
        </Space>
      )
    }
  ];

  // 渲染油站列表Tab
  const renderStationListTab = () => {
    return (
      <div>
        {/* 筛选表单 */}
        <Form
          form={filterForm}
          layout="inline"
          onFinish={handleFilterSubmit}
          className="filter-form"
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
              treeDefaultExpandAll
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              placeholder="请选择状态"
              allowClear
              style={{ width: 120 }}
            >
              {Object.values(STATION_STATUS).map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleFilterReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 油站列表表格 */}
        <Table
          columns={tableColumns}
          dataSource={stationList}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  };

  // 渲染审批中心Tab
  const renderApprovalCenterTab = () => {
    return (
      <div>
        {/* 筛选表单 */}
        <Form
          form={approvalFilterForm}
          layout="inline"
          onFinish={handleApprovalFilterSubmit}
          className="filter-form"
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
              treeDefaultExpandAll
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item name="approvalType" label="申请类型">
            <Select
              placeholder="请选择申请类型"
              allowClear
              style={{ width: 120 }}
            >
              <Option value="create">新增</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
            </Select>
          </Form.Item>
          <Form.Item name="approvalStatus" label="审批状态">
            <Select
              placeholder="请选择审批状态"
              allowClear
              style={{ width: 120 }}
            >
              <Option value={APPROVAL_STATUS.PENDING}>待审批</Option>
              <Option value={APPROVAL_STATUS.APPROVED}>已批准</Option>
              <Option value={APPROVAL_STATUS.REJECTED}>已拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input 
              placeholder="请输入关键词" 
              style={{ width: 150 }}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
                筛选
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleApprovalFilterReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 批量操作 */}
        <div className="batch-actions" style={{ marginBottom: 16 }}>
          <Space>
            <span>已选择 {selectedPendingRows.length} 项</span>
            <Button 
              type="primary" 
              onClick={() => handleBatchAudit(true)}
              disabled={selectedPendingRows.length === 0}
              icon={<CheckOutlined />}
              style={{ backgroundColor: '#32AF50', borderColor: '#32AF50' }}
            >
              批量通过
            </Button>
            <Button
              danger
              onClick={() => handleBatchAudit(false)}
              disabled={selectedPendingRows.length === 0}
              icon={<CloseOutlined />}
            >
              批量拒绝
            </Button>
          </Space>
        </div>

        {/* 待审批列表表格 */}
        <Table
          columns={pendingColumns}
          dataSource={pendingStations}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={pendingPagination}
          onChange={handlePendingTableChange}
          loading={pendingLoading}
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  };

  return (
    <div className="station-management">
      <Card
        title="油站管理" 
        extra={
          activeTabKey === '1' ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddStation}
            >
              新增油站
            </Button>
          ) : null
        }
      >
        <Tabs 
          activeKey={activeTabKey} 
          onChange={setActiveTabKey}
          type="card"
          className="station-tabs"
        >
          <TabPane tab="油站列表" key="1">
            {renderStationListTab()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                审批中心
                {pendingCount > 0 && 
                  <Badge 
                    count={pendingCount} 
                    style={{ marginLeft: 8 }}
                  />
                }
              </span>
            } 
            key="2"
          >
            {renderApprovalCenterTab()}
          </TabPane>
        </Tabs>
      </Card>

      {/* 油站表单抽屉 */}
      {stationFormVisible && (
        <StationForm
          open={stationFormVisible}
          onClose={() => setStationFormVisible(false)}
          onSuccess={handleFormSuccess}
          initialValues={editingStation}
          branchList={treeData[0]?.children || []}
        />
      )}

      {/* 审批抽屉 */}
      {auditDrawerVisible && (
        <AuditDrawer
          open={auditDrawerVisible}
          onClose={() => setAuditDrawerVisible(false)}
          onSuccess={handleAuditSuccess}
          station={currentStation}
        />
      )}
    </div>
  );
};

export default StationManagement; 