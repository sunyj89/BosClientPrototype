import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Tag, Tooltip, Tabs, TreeSelect, Badge, Drawer, Alert, Timeline, Radio, Row, Col, Divider, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, ReloadOutlined, CheckOutlined, CloseOutlined, HistoryOutlined } from '@ant-design/icons';
import './index.css';
import orgDataSource from '../../../mock/station/orgData.json';

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

// 加油机品牌列表
const deviceBrands = ['正星', '托肯', '吉尔巴克', '恒山', '蓝峰', '稳牌'];

// 模拟油枪数据
const initialGuns = [
  {
    id: 'G001',
    name: '1号油枪',
    oilType: '92#汽油',
    status: '正常',
    lastMaintenance: '2023-03-10',
    stationId: 'ST001',
    stationName: '南昌服务区加油站1',
    branchId: 'BR001',
    branchName: '赣中分公司',
    deviceId: 'D001',
    deviceBrand: '正星',
    deviceModel: 'ZX-9000',
  },
  {
    id: 'G002',
    name: '2号油枪',
    oilType: '95#汽油',
    status: '正常',
    lastMaintenance: '2023-03-10',
    stationId: 'ST001',
    stationName: '南昌服务区加油站1',
    branchId: 'BR001',
    branchName: '赣中分公司',
    deviceId: 'D001',
    deviceBrand: '正星',
    deviceModel: 'ZX-9000',
  },
  {
    id: 'G003',
    name: '3号油枪',
    oilType: '98#汽油',
    status: '正常',
    lastMaintenance: '2023-03-10',
    stationId: 'ST002',
    stationName: '南昌服务区加油站2',
    branchId: 'BR001',
    branchName: '赣中分公司',
    deviceId: 'D002',
    deviceBrand: '托肯',
    deviceModel: 'TK-6600',
  },
  {
    id: 'G004',
    name: '4号油枪',
    oilType: '0#柴油',
    status: '维修中',
    lastMaintenance: '2023-02-15',
    stationId: 'ST002',
    stationName: '南昌服务区加油站2',
    branchId: 'BR001',
    branchName: '赣中分公司',
    deviceId: 'D002',
    deviceBrand: '托肯',
    deviceModel: 'TK-6600',
  },
  {
    id: 'G005',
    name: '5号油枪',
    oilType: '92#汽油',
    status: '正常',
    lastMaintenance: '2023-03-10',
    stationId: 'ST003',
    stationName: '上饶服务区加油站1',
    branchId: 'BR002',
    branchName: '赣东北分公司',
    deviceId: 'D003',
    deviceBrand: '吉尔巴克',
    deviceModel: 'GB-4500',
  },
  {
    id: 'G006',
    name: '6号油枪',
    oilType: '0#柴油',
    status: '停用',
    lastMaintenance: '2023-01-20',
    stationId: 'ST003',
    stationName: '上饶服务区加油站1',
    branchId: 'BR002',
    branchName: '赣东北分公司',
    deviceId: 'D003',
    deviceBrand: '吉尔巴克',
    deviceModel: 'GB-4500',
  },
  {
    id: 'G007',
    name: '7号油枪',
    oilType: '98#汽油',
    status: '正常',
    lastMaintenance: '2023-03-10',
    stationId: 'ST004',
    stationName: '上饶服务区加油站2',
    branchId: 'BR002',
    branchName: '赣东北分公司',
    deviceId: 'D004',
    deviceBrand: '恒山',
    deviceModel: 'HS-2800',
  },
];

// 模拟油罐数据
const tanks = [
  { id: 'T001', name: '1号油罐', oilType: '92#汽油', station: '中石化XX加油站', stationId: 'ST001' },
  { id: 'T002', name: '2号油罐', oilType: '95#汽油', station: '中石化XX加油站', stationId: 'ST002' },
  { id: 'T003', name: '3号油罐', oilType: '0#柴油', station: '南昌服务区加油站1', stationId: 'ST003' },
  { id: 'T004', name: '4号油罐', oilType: '0#柴油', station: '南昌服务区加油站1', stationId: 'ST003' },
  { id: 'T005', name: '5号油罐', oilType: '98#汽油', station: '上饶服务区加油站2', stationId: 'ST004' },
];

const GunManagement = () => {
  const [guns, setGuns] = useState(initialGuns);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGun, setEditingGun] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredGuns, setFilteredGuns] = useState(initialGuns);
  
  // 新增状态
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filterForm] = Form.useForm();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedApprovalRows, setSelectedApprovalRows] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState('all');

  // 审批抽屉相关状态
  const [approvalDrawerVisible, setApprovalDrawerVisible] = useState(false);
  const [currentApproval, setCurrentApproval] = useState(null);
  const [approvalForm] = Form.useForm();
  const [approvalHistory, setApprovalHistory] = useState([]);

  // 在组件顶部的状态声明部分添加brandOptions
  const [brandOptions, setBrandOptions] = useState([]);

  // 获取组织数据
  useEffect(() => {
    // 硬编码组织树数据用于测试
    const hardcodedTreeData = [
      {
        title: '江西交投化石能源公司',
        value: 'HQ001',
        key: 'HQ001',
        selectable: true,
        children: [
          {
            title: '赣中分公司',
            value: 'BR001',
            key: 'BR001',
            selectable: true,
            children: [
              {
                title: '南昌服务区加油站1',
                value: 'ST001',
                key: 'ST001',
                selectable: true,
                isLeaf: true
              },
              {
                title: '南昌服务区加油站2',
                value: 'ST002',
                key: 'ST002',
                selectable: true,
                isLeaf: true
              }
            ]
          },
          {
            title: '赣东北分公司',
            value: 'BR002',
            key: 'BR002',
            selectable: true,
            children: [
              {
                title: '上饶服务区加油站1',
                value: 'ST003',
                key: 'ST003',
                selectable: true,
                isLeaf: true
              },
              {
                title: '上饶服务区加油站2',
                value: 'ST004',
                key: 'ST004',
                selectable: true,
                isLeaf: true
              }
            ]
          }
        ]
      }
    ];
    
    console.log('使用硬编码的组织树数据:', hardcodedTreeData);
    setOrgTreeData(hardcodedTreeData);
    
    // 设置品牌选项
    const brandOptions = ['正星', '托肯', '吉尔巴克', '恒山', '蓝峰', '稳牌'].map(brand => ({
      label: brand,
      value: brand
    }));
    setBrandOptions(brandOptions);
    
  }, []);

  // 格式化组织树数据
  const formatOrgTreeData = (data) => {
    if (!data || !data.company) {
      console.error('组织数据格式不正确:', data);
      return [];
    }

    // 调试输出
    console.log('开始处理组织数据:', JSON.stringify(data.company));
    console.log('分公司数量:', data.branches?.length);

    const treeData = [];
    
    // 添加总公司
    const companyNode = {
      title: data.company.name,
      value: data.company.id,
      key: data.company.id,
      selectable: true,
      children: []
    };
    
    // 记录所有油机品牌
    const allBrands = new Set(['正星', '托肯', '吉尔巴克', '恒山', '蓝峰', '稳牌']);
    
    // 添加分公司及其油站
    if (data.branches && data.branches.length > 0) {
      data.branches.forEach(branch => {
        const branchNode = {
          title: branch.name,
          value: branch.id,
          key: branch.id,
          selectable: true,
          children: []
        };
        
        if (branch.stations && branch.stations.length > 0) {
          branch.stations.forEach(station => {
            branchNode.children.push({
              title: station.name,
              value: station.id,
              key: station.id,
              selectable: true,
              isLeaf: true
            });
          });
        }
        
        companyNode.children.push(branchNode);
      });
    }
    
    treeData.push(companyNode);
    
    // 更新设备品牌选项
    const brandOptions = Array.from(allBrands).map(brand => ({
      label: brand,
      value: brand
    }));
    
    setBrandOptions(brandOptions);
    
    // 调试输出
    console.log('处理后的组织树数据:', JSON.stringify(treeData));
    
    return treeData;
  };

  // 模拟获取审批数据
  useEffect(() => {
    const mockApprovals = [
      {
        id: 'A001',
        gunId: 'G001',
        gunName: '1号油枪',
        oilType: '92#汽油',
        stationId: 'ST001',
        stationName: '南昌服务区加油站1',
        branchId: 'BR001',
        branchName: '赣中分公司',
        deviceId: 'D001',
        deviceBrand: '正星',
        deviceModel: 'ZX-9000',
        approvalType: 'create',
        submitter: '张三',
        submitTime: '2023-10-15 14:30:45',
        approvalStatus: '待审批'
      },
      {
        id: 'A002',
        gunId: 'G002',
        gunName: '2号油枪',
        oilType: '95#汽油',
        stationId: 'ST001',
        stationName: '南昌服务区加油站1',
        branchId: 'BR001',
        branchName: '赣中分公司',
        deviceId: 'D001',
        deviceBrand: '正星',
        deviceModel: 'ZX-9000',
        approvalType: 'update',
        submitter: '李四',
        submitTime: '2023-10-16 09:12:33',
        approvalStatus: '待审批'
      },
      {
        id: 'A003',
        gunId: 'G003',
        gunName: '3号油枪',
        oilType: '98#汽油',
        stationId: 'ST002',
        stationName: '南昌服务区加油站2',
        branchId: 'BR001',
        branchName: '赣中分公司',
        deviceId: 'D002',
        deviceBrand: '托肯',
        deviceModel: 'TK-6600',
        approvalType: 'delete',
        submitter: '王五',
        submitTime: '2023-10-17 16:08:22',
        approvalStatus: '待审批'
      },
      {
        id: 'A004',
        gunId: 'G005',
        gunName: '5号油枪',
        oilType: '92#汽油',
        stationId: 'ST003',
        stationName: '上饶服务区加油站1',
        branchId: 'BR002',
        branchName: '赣东北分公司',
        deviceId: 'D003',
        deviceBrand: '吉尔巴克',
        deviceModel: 'GB-4500',
        approvalType: 'update',
        submitter: '赵六',
        submitTime: '2023-10-18 10:25:14',
        approvalStatus: '待审批'
      }
    ];
    setPendingApprovals(mockApprovals);
  }, []);

  // 模拟审批历史数据
  useEffect(() => {
    const mockHistory = [
      {
        id: 'H001',
        recordId: 'A001',
        operateUser: '李经理',
        operateType: '审批通过',
        content: '符合要求，同意添加',
        time: '2023-10-16 10:30:45'
      },
      {
        id: 'H002',
        recordId: 'A002',
        operateUser: '王主任',
        operateType: '审批拒绝',
        content: '信息不完整，请补充油枪流量数据',
        time: '2023-10-17 14:22:33'
      }
    ];
    setApprovalHistory(mockHistory);
  }, []);

  useEffect(() => {
    handleFilter();
  }, [selectedOrgs, searchText, approvalStatus, guns]);

  const handleFilter = () => {
    console.log('执行筛选，当前筛选条件:', { selectedOrgs, selectedBrands, searchText });
    let filtered = [...initialGuns]; // 从原始数据开始筛选
    
    // 按组织筛选
    if (selectedOrgs && selectedOrgs.length > 0) {
      console.log('按组织筛选:', selectedOrgs);
      filtered = filtered.filter(gun => 
        selectedOrgs.includes(gun.stationId) || selectedOrgs.includes(gun.branchId)
      );
    }
    
    // 按品牌筛选
    if (selectedBrands && selectedBrands.length > 0) {
      console.log('按品牌筛选:', selectedBrands);
      filtered = filtered.filter(gun => 
        selectedBrands.includes(gun.deviceBrand)
      );
    }
    
    // 按关键字筛选
    if (searchText) {
      console.log('按关键字筛选:', searchText);
      filtered = filtered.filter(
        (gun) =>
          gun.name.toLowerCase().includes(searchText.toLowerCase()) ||
          gun.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
          gun.deviceModel.toLowerCase().includes(searchText.toLowerCase()) ||
          gun.deviceBrand.toLowerCase().includes(searchText.toLowerCase()) ||
          gun.status.toLowerCase().includes(searchText.toLowerCase()) ||
          gun.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
          gun.branchName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    console.log('筛选结果数量:', filtered.length);
    setFilteredGuns(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  const handleOrgChange = (value) => {
    console.log('组织选择变更:', value);
    setSelectedOrgs(value);
  };

  const handleBrandChange = (value) => {
    console.log('品牌选择变更:', value);
    setSelectedBrands(value);
  };

  const handleSearchChange = (e) => {
    console.log('搜索文本变更:', e.target.value);
    setSearchText(e.target.value);
  };

  const handleStatusChange = (value) => {
    setApprovalStatus(value);
  };

  const handleApprovalSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedApprovalRows(selectedRows);
  };

  const handleResetFilter = () => {
    console.log('重置筛选条件');
    filterForm.resetFields();
    setSelectedOrgs([]);
    setSelectedBrands([]);
    setSearchText('');
    setApprovalStatus('all');
    setFilteredGuns(initialGuns);
  };

  const showAddModal = () => {
    setEditingGun(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingGun(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const showApprovalDrawer = (record) => {
    setCurrentApproval(record);
    setApprovalDrawerVisible(true);
    approvalForm.resetFields();
  };

  const closeApprovalDrawer = () => {
    setApprovalDrawerVisible(false);
    setCurrentApproval(null);
    approvalForm.resetFields();
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除 ${record.name} 吗？此操作需要审批。`,
      onOk() {
        // 生成删除审批记录
        const approval = {
          id: `A${Date.now().toString().substr(-6)}`,
          gunId: record.id,
          gunName: record.name,
          oilType: record.oilType,
          stationId: record.stationId,
          stationName: record.stationName,
          branchId: record.branchId,
          branchName: record.branchName,
          deviceId: record.deviceId,
          deviceBrand: record.deviceBrand,
          deviceModel: record.deviceModel,
          approvalType: 'delete',
          submitter: '当前用户',
          submitTime: new Date().toLocaleString(),
          approvalStatus: '待审批',
          deleteData: record
        };
        
        setPendingApprovals([...pendingApprovals, approval]);
        message.success('删除申请已提交，等待审批');
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 在此处添加表格列定义
  // 定义油枪表格列
  const columns = [
    {
      title: '油枪编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '油枪名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '加油站',
      dataIndex: 'stationName',
      key: 'stationName',
    },
    {
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
    },
    {
      title: '油机品牌',
      dataIndex: 'deviceBrand',
      key: 'deviceBrand',
    },
    {
      title: '油机型号',
      dataIndex: 'deviceModel',
      key: 'deviceModel',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = 'green';
        if (text === '停用') color = 'red';
        else if (text === '维修中') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '最近维护',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 定义审批中心表格列
  const approvalColumns = [
    {
      title: '申请ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '油枪名称',
      dataIndex: 'gunName',
      key: 'gunName',
      width: 100,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '加油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150,
    },
    {
      title: '油机品牌',
      dataIndex: 'deviceBrand',
      key: 'deviceBrand',
      width: 100,
    },
    {
      title: '油机型号',
      dataIndex: 'deviceModel',
      key: 'deviceModel',
      width: 120,
    },
    {
      title: '申请类型',
      dataIndex: 'approvalType',
      key: 'approvalType',
      width: 100,
      render: (text) => {
        const typeMap = {
          'create': '新增',
          'update': '修改',
          'delete': '删除'
        };
        const color = text === 'create' ? 'green' : text === 'update' ? 'blue' : 'red';
        return <Tag color={color}>{typeMap[text] || text}</Tag>;
      },
    },
    {
      title: '申请人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 100,
    },
    {
      title: '申请时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 150,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        let color = 'blue';
        if (text === '已通过') color = 'green';
        else if (text === '已拒绝') color = 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {record.approvalStatus === '待审批' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => showApprovalDrawer(record)}
            >
              审批
            </Button>
          )}
          {record.approvalStatus !== '待审批' && (
            <Button 
              size="small"
              onClick={() => showApprovalDrawer(record)}
            >
              查看
            </Button>
          )}
        </Space>
      ),
    },
  ];
  
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      setTimeout(() => {
        
        if (editingGun) {
          // 生成审批记录而不是直接更新
          const updatedGun = { 
            ...editingGun, 
            ...values
          };
          
          // 生成审批记录
          const approval = {
            id: `A${Date.now().toString().substr(-6)}`,
            gunId: updatedGun.id,
            gunName: updatedGun.name,
            oilType: updatedGun.oilType,
            stationId: updatedGun.stationId,
            stationName: updatedGun.stationName,
            branchId: updatedGun.branchId,
            branchName: updatedGun.branchName,
            deviceId: updatedGun.deviceId,
            deviceBrand: updatedGun.deviceBrand,
            deviceModel: updatedGun.deviceModel,
            approvalType: 'update',
            submitter: '当前用户',
            submitTime: new Date().toLocaleString(),
            approvalStatus: '待审批',
            originalData: editingGun,
            updatedData: updatedGun
          };
          
          setPendingApprovals([...pendingApprovals, approval]);
          message.success('修改申请已提交，等待审批');
        } else {
          // 添加新油枪审批
          // 假设我们在创建新油枪时已选择了加油站
          const selectedStation = form.getFieldValue('stationId');
          const stationInfo = findStationInfo(selectedStation);
          
          // 创建新油枪数据
          const newGun = {
            ...values,
            id: `G${String(guns.length + 1).padStart(3, '0')}`,
            stationId: stationInfo.id,
            stationName: stationInfo.name,
            branchId: stationInfo.parentId,
            branchName: stationInfo.branchName,
          };
          
          // 生成审批记录
          const approval = {
            id: `A${Date.now().toString().substr(-6)}`,
            gunId: newGun.id,
            gunName: newGun.name,
            oilType: newGun.oilType,
            stationId: newGun.stationId,
            stationName: newGun.stationName,
            branchId: newGun.branchId,
            branchName: newGun.branchName,
            deviceId: newGun.deviceId,
            deviceBrand: newGun.deviceBrand,
            deviceModel: newGun.deviceModel,
            approvalType: 'create',
            submitter: '当前用户',
            submitTime: new Date().toLocaleString(),
            approvalStatus: '待审批',
            newData: newGun
          };
          
          setPendingApprovals([...pendingApprovals, approval]);
          message.success('新增申请已提交，等待审批');
        }
        setLoading(false);
        setIsModalVisible(false);
      }, 500);
    });
  };

  // 查找油站信息
  const findStationInfo = (stationId) => {
    let result = {
      id: stationId,
      name: '',
      parentId: '',
      branchName: ''
    };
    
    // 在orgTreeData中查找油站信息
    if (orgTreeData && orgTreeData.length > 0 && orgTreeData[0].children) {
      for (const branch of orgTreeData[0].children) {
        if (branch.children) {
          for (const station of branch.children) {
            if (station.key === stationId) {
              result.name = station.title;
              result.parentId = branch.key;
              result.branchName = branch.title;
              return result;
            }
          }
        }
      }
    }
    
    return result;
  };

  const handleDelete = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除 ${record.name} 吗？此操作需要审批。`,
      onOk() {
        // 生成删除审批记录
        const approval = {
          id: `A${Date.now().toString().substr(-6)}`,
          gunId: record.id,
          gunName: record.name,
          oilType: record.oilType,
          stationId: record.stationId,
          stationName: record.stationName,
          branchId: record.branchId,
          branchName: record.branchName,
          deviceId: record.deviceId,
          deviceBrand: record.deviceBrand,
          deviceModel: record.deviceModel,
          approvalType: 'delete',
          submitter: '当前用户',
          submitTime: new Date().toLocaleString(),
          approvalStatus: '待审批',
          deleteData: record
        };
        
        setPendingApprovals([...pendingApprovals, approval]);
        message.success('删除申请已提交，等待审批');
      },
    });
  };

  const handleApprovalSubmit = (approved = true) => {
    if (!currentApproval) {
      message.error('审批数据异常');
      return;
    }
    
    if (currentApproval.approvalStatus !== '待审批') {
      message.warning('该记录已经完成审批，不能重复操作');
      setApprovalDrawerVisible(false);
      return;
    }

    // 获取审批意见
    approvalForm.validateFields().then(values => {
      const { comment } = values;
      
      // 更新审批状态
      const newStatus = approved ? '已通过' : '已拒绝';
      
      // 添加审批历史记录
      const historyRecord = {
        id: `H${Date.now()}`,
        recordId: currentApproval.id,
        operateUser: '当前用户',
        operateType: newStatus,
        content: comment,
        time: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      
      setApprovalHistory([...approvalHistory, historyRecord]);
      
      // 更新审批状态
      const updatedApprovals = pendingApprovals.map(item => {
        if (item.id === currentApproval.id) {
          return { ...item, approvalStatus: newStatus };
        }
        return item;
      });
      
      setPendingApprovals(updatedApprovals);
      
      // 如果是审批通过，更新实际数据
      if (approved) {
        let updatedGuns = [...guns];
        
        if (currentApproval.approvalType === 'create') {
          // 添加新油枪
          const newGun = {
            id: currentApproval.gunId,
            name: currentApproval.gunName,
            oilType: currentApproval.oilType,
            stationId: currentApproval.stationId,
            stationName: currentApproval.stationName,
            branchId: currentApproval.branchId,
            branchName: currentApproval.branchName,
            deviceId: currentApproval.deviceId,
            deviceBrand: currentApproval.deviceBrand,
            deviceModel: currentApproval.deviceModel,
            status: '正常',
            lastMaintenance: new Date().toISOString().substring(0, 10)
          };
          
          updatedGuns.push(newGun);
        } else if (currentApproval.approvalType === 'update') {
          // 更新油枪
          updatedGuns = updatedGuns.map(gun => {
            if (gun.id === currentApproval.gunId) {
              return {
                ...gun,
                name: currentApproval.gunName,
                oilType: currentApproval.oilType,
                deviceBrand: currentApproval.deviceBrand,
                deviceModel: currentApproval.deviceModel,
                stationId: currentApproval.stationId,
                stationName: currentApproval.stationName,
                branchId: currentApproval.branchId,
                branchName: currentApproval.branchName,
              };
            }
            return gun;
          });
        } else if (currentApproval.approvalType === 'delete') {
          // 删除油枪
          updatedGuns = updatedGuns.filter(gun => gun.id !== currentApproval.gunId);
        }
        
        setGuns(updatedGuns);
      }
      
      message.success(`审批${approved ? '通过' : '拒绝'}成功`);
      setApprovalDrawerVisible(false);
    }).catch(err => {
      console.error('表单验证失败:', err);
      message.error('请填写审批意见');
    });
  };

  // 获取筛选后的审批记录
  const getFilteredApprovals = () => {
    let filtered = [...pendingApprovals];
    
    // 按组织筛选
    if (selectedOrgs && selectedOrgs.length > 0) {
      filtered = filtered.filter(item => 
        selectedOrgs.includes(item.stationId) || selectedOrgs.includes(item.branchId)
      );
    }
    
    // 按品牌筛选
    if (selectedBrands && selectedBrands.length > 0) {
      filtered = filtered.filter(item => 
        selectedBrands.includes(item.deviceBrand)
      );
    }
    
    // 按关键字筛选
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.gunName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
          item.deviceBrand.toLowerCase().includes(searchText.toLowerCase()) ||
          item.deviceModel.toLowerCase().includes(searchText.toLowerCase()) ||
          item.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.submitter.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 按审批状态筛选
    if (approvalStatus && approvalStatus !== 'all') {
      const statusMap = {
        'pending': '待审批',
        'approved': '已通过',
        'rejected': '已拒绝'
      };
      
      filtered = filtered.filter(item => 
        item.approvalStatus === statusMap[approvalStatus]
      );
    }
    
    return filtered;
  };

  // 渲染筛选区域
  const renderFilterForm = () => {
    // 调试输出当前组织树数据
    console.log('渲染筛选表单时的组织树数据:', orgTreeData);
    
    return (
      <Form
        form={filterForm}
        layout="inline"
        onFinish={handleFilter}
        className="filter-form"
        style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '16px' }}
      >
        <Form.Item label="组织/油站" name="organizations">
          <TreeSelect
            treeData={orgTreeData}
            placeholder="请选择组织或油站"
            allowClear
            showSearch
            treeNodeFilterProp="title"
            multiple
            showCheckedStrategy={SHOW_PARENT}
            treeCheckable
            treeDefaultExpandAll
            style={{ width: 300 }}
            value={selectedOrgs}
            onChange={handleOrgChange}
          />
        </Form.Item>
        <Form.Item label="油机品牌" name="brands">
          <Select
            mode="multiple"
            placeholder="请选择油机品牌"
            allowClear
            style={{ width: 200 }}
            value={selectedBrands}
            onChange={handleBrandChange}
            options={brandOptions}
          />
        </Form.Item>
        <Form.Item label="关键字" name="keyword">
          <Input
            placeholder="请输入关键字"
            allowClear
            style={{ width: 200 }}
            value={searchText}
            onChange={handleSearchChange}
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        {activeTabKey === '2' && (
          <>
            <Form.Item label="申请类型" name="approvalType">
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
            <Form.Item label="审批状态" name="approvalStatus">
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: 120 }}
                value={approvalStatus}
                onChange={handleStatusChange}
              >
                <Option value="all">全部</Option>
                <Option value="pending">待审批</Option>
                <Option value="approved">已通过</Option>
                <Option value="rejected">已拒绝</Option>
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
              重置
            </Button>
            {activeTabKey === '1' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={showAddModal}
              >
                新建
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    );
  };

  // 修改审批中心的样式和结构
  const renderApprovalCenter = () => {
    const filteredApprovals = getFilteredApprovals();
    
    const rowSelection = {
      selectedRowKeys: selectedApprovalRows.map(row => row.id),
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedApprovalRows(selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.approvalStatus !== '待审批',
      }),
    };
    
    return (
      <div>
        {/* 筛选表单 */}
        {renderFilterForm()}

        {/* 批量操作区域 */}
        {selectedApprovalRows.length > 0 && (
          <div className="batch-actions" style={{ padding: '12px 16px', backgroundColor: '#f0f7ff', borderRadius: '4px', marginBottom: '16px' }}>
            <Space>
              <span>已选择 {selectedApprovalRows.length} 项</span>
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                onClick={() => handleBatchApproval(true)}
                style={{ backgroundColor: '#32AF50', borderColor: '#32AF50' }}
                disabled={!selectedApprovalRows.some(row => row.approvalStatus === '待审批')}
              >
                批量通过
              </Button>
              <Button 
                danger 
                icon={<CloseOutlined />}
                onClick={() => handleBatchApproval(false)}
                disabled={!selectedApprovalRows.some(row => row.approvalStatus === '待审批')}
              >
                批量拒绝
              </Button>
            </Space>
          </div>
        )}
        
        {/* 待审批列表表格 */}
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          columns={approvalColumns}
          dataSource={filteredApprovals}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          className="approval-table"
        />
      </div>
    );
  };

  // 添加批量审批处理函数
  const handleBatchApproval = (isApprove) => {
    if (selectedApprovalRows.length === 0) {
      message.warning('请选择要审批的记录');
      return;
    }
    
    const pendingRows = selectedApprovalRows.filter(row => row.approvalStatus === '待审批');
    if (pendingRows.length === 0) {
      message.warning('选中记录中没有待审批的记录');
      return;
    }
    
    Modal.confirm({
      title: `批量${isApprove ? '通过' : '拒绝'}审批`,
      content: `确定要批量${isApprove ? '通过' : '拒绝'}选中的 ${pendingRows.length} 条记录吗？`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // 批量更新审批状态
        const newStatus = isApprove ? '已通过' : '已拒绝';
        
        // 添加批量审批历史记录
        const historyItems = pendingRows.map(approval => ({
          id: `H${Date.now()}-${approval.id}`,
          recordId: approval.id,
          operateUser: '当前用户',
          operateType: newStatus,
          content: isApprove ? '批量审批通过' : '批量审批拒绝',
          time: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }));
        
        setApprovalHistory([...approvalHistory, ...historyItems]);
        
        // 更新审批记录状态
        const updatedApprovals = pendingApprovals.map(item => {
          if (pendingRows.some(row => row.id === item.id)) {
            return { ...item, approvalStatus: newStatus };
          }
          return item;
        });
        
        setPendingApprovals(updatedApprovals);
        
        // 如果是批量通过，处理实际数据变更
        if (isApprove) {
          let updatedGuns = [...guns];
          
          pendingRows.forEach(approval => {
            if (approval.approvalType === 'create') {
              // 添加新油枪
              const newGun = {
                id: approval.gunId,
                name: approval.gunName,
                oilType: approval.oilType,
                stationId: approval.stationId,
                stationName: approval.stationName,
                branchId: approval.branchId,
                branchName: approval.branchName,
                deviceId: approval.deviceId,
                deviceBrand: approval.deviceBrand,
                deviceModel: approval.deviceModel,
                status: '正常',
                lastMaintenance: new Date().toISOString().substring(0, 10)
              };
              
              updatedGuns.push(newGun);
            } else if (approval.approvalType === 'update') {
              // 更新油枪
              updatedGuns = updatedGuns.map(gun => {
                if (gun.id === approval.gunId) {
                  return {
                    ...gun,
                    name: approval.gunName,
                    oilType: approval.oilType,
                    deviceBrand: approval.deviceBrand,
                    deviceModel: approval.deviceModel,
                    stationId: approval.stationId,
                    stationName: approval.stationName,
                    branchId: approval.branchId,
                    branchName: approval.branchName,
                  };
                }
                return gun;
              });
            } else if (approval.approvalType === 'delete') {
              // 删除油枪
              updatedGuns = updatedGuns.filter(gun => gun.id !== approval.gunId);
            }
          });
          
          setGuns(updatedGuns);
        }
        
        setSelectedApprovalRows([]);
        message.success(`批量${isApprove ? '通过' : '拒绝'}操作成功`);
      }
    });
  };

  // 修改审批抽屉
  const renderApprovalDrawer = () => {
    if (!currentApproval) return null;
    
    const { approvalType, approvalStatus } = currentApproval;
    
    const typeMap = {
      'create': '新增',
      'update': '修改',
      'delete': '删除'
    };
    
    return (
      <Drawer
        title="油枪配置审批"
        width={800}
        placement="right"
        onClose={closeApprovalDrawer}
        visible={approvalDrawerVisible}
        className="approval-drawer"
        footer={
          approvalStatus === '待审批' ? (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={closeApprovalDrawer}>取消</Button>
                <Button 
                  danger 
                  onClick={() => handleApprovalSubmit(false)}
                >
                  拒绝
                </Button>
                <Button 
                  type="primary"
                  style={{ backgroundColor: '#32AF50', borderColor: '#32AF50' }}
                  onClick={() => handleApprovalSubmit(true)}
                >
                  通过
                </Button>
              </Space>
            </div>
          ) : null
        }
      >
        {currentApproval && (
          <>
            <Alert
              message={
                <span>
                  当前状态：
                  <Tag color={approvalStatus === '待审批' ? 'orange' : approvalStatus === '已通过' ? 'green' : 'red'}>
                    {approvalStatus}
                  </Tag>
                  提交时间：{currentApproval.submitTime}
                </span>
              }
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>油枪编号：</strong> {currentApproval.gunId}</p>
                  <p><strong>油枪名称：</strong> {currentApproval.gunName}</p>
                  <p><strong>油品类型：</strong> {currentApproval.oilType}</p>
                  <p><strong>申请类型：</strong> {typeMap[approvalType] || approvalType}</p>
                </Col>
                <Col span={12}>
                  <p><strong>所属加油站：</strong> {currentApproval.stationName}</p>
                  <p><strong>所属分公司：</strong> {currentApproval.branchName}</p>
                  <p><strong>油机品牌：</strong> {currentApproval.deviceBrand}</p>
                  <p><strong>油机型号：</strong> {currentApproval.deviceModel}</p>
                </Col>
              </Row>
            </Card>
            
            {/* 审批历史记录 */}
            <Card title="审批历史" style={{ marginBottom: 16 }}>
              {approvalHistory.filter(item => item.recordId === currentApproval.id).length > 0 ? (
                <Timeline>
                  {approvalHistory
                    .filter(item => item.recordId === currentApproval.id)
                    .map(item => (
                      <Timeline.Item 
                        key={item.id}
                        color={item.operateType === '已通过' ? 'green' : item.operateType === '已拒绝' ? 'red' : 'blue'}
                      >
                        <div style={{ fontWeight: 'bold' }}>
                          {item.operateUser} - {item.operateType}
                        </div>
                        <div>{item.content}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>
                          {item.time}
                        </div>
                      </Timeline.Item>
                    ))}
                </Timeline>
              ) : (
                <Empty description="暂无审批历史" />
              )}
            </Card>
            
            {/* 审批表单 */}
            {approvalStatus === '待审批' && (
              <Card title="审批意见">
                <Form form={approvalForm} layout="vertical">
                  <Form.Item
                    name="comment"
                    label="审批意见"
                    rules={[{ required: true, message: '请输入审批意见' }]}
                  >
                    <Input.TextArea rows={4} placeholder="请输入审批意见..." maxLength={200} showCount />
                  </Form.Item>
                </Form>
              </Card>
            )}
          </>
        )}
      </Drawer>
    );
  };

  return (
    <div className="gun-management-container">
      <Tabs activeKey={activeTabKey} onChange={handleTabChange} type="card" className="approval-tabs">
        <TabPane tab="油枪列表" key="1">
          <div>
            {renderFilterForm()}
            <Table
              columns={columns}
              dataSource={filteredGuns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={loading}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </TabPane>
        <TabPane 
          tab={
            <span>
              审批中心
              {pendingApprovals.length > 0 && <Badge count={pendingApprovals.length} style={{ marginLeft: 8 }} />}
            </span>
          } 
          key="2"
        >
          {renderApprovalCenter()}
        </TabPane>
      </Tabs>

      {/* Modal for adding/editing guns */}
      <Modal
        title={editingGun ? '编辑油枪信息' : '添加新油枪'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            提交审批
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="油枪名称"
            rules={[{ required: true, message: '请输入油枪名称' }]}
          >
            <Input placeholder="请输入油枪名称" />
          </Form.Item>
          <Form.Item
            name="oilType"
            label="油品类型"
            rules={[{ required: true, message: '请选择油品类型' }]}
          >
            <Select placeholder="请选择油品类型">
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
              <Option value="尿素">尿素</Option>
            </Select>
          </Form.Item>
          {!editingGun && (
            <Form.Item
              name="stationId"
              label="所属加油站"
              rules={[{ required: true, message: '请选择所属加油站' }]}
            >
              <TreeSelect
                treeData={orgTreeData}
                placeholder="请选择所属加油站"
                treeDefaultExpandAll
                showSearch
                treeNodeFilterProp="title"
                filterTreeNode={(inputValue, treeNode) => {
                  return treeNode.type === 'station' && treeNode.title.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                }}
              />
            </Form.Item>
          )}
          <Form.Item
            name="deviceBrand"
            label="加油机品牌"
            rules={[{ required: true, message: '请选择加油机品牌' }]}
          >
            <Select placeholder="请选择加油机品牌">
              {deviceBrands.map(brand => (
                <Option key={brand} value={brand}>{brand}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="deviceModel"
            label="加油机型号"
            rules={[{ required: true, message: '请输入加油机型号' }]}
          >
            <Input placeholder="请输入加油机型号" />
          </Form.Item>
          <Form.Item
            name="deviceId"
            label="加油机编号"
            rules={[{ required: true, message: '请输入加油机编号' }]}
          >
            <Input placeholder="请输入加油机编号" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="正常">正常</Option>
              <Option value="维修中">维修中</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="lastMaintenance"
            label="最近维护日期"
            rules={[{ required: true, message: '请输入最近维护日期' }]}
          >
            <Input placeholder="格式：YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批抽屉 */}
      {renderApprovalDrawer()}
    </div>
  );
};

export default GunManagement; 