import React, { useState, useEffect } from 'react';
import { 
  Table, Form, Button, Space, Input, message, Modal, Tag, 
  Select, Card, Row, Col, 
  Tabs, Descriptions, Spin,
  DatePicker, InputNumber, TreeSelect,
  Cascader, Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { delay, mockResponse } from '../../utils/utils';
import stationData from '../../mock/station/stationData.json';
import stationChangeRecord from '../../mock/station/stationChangeRecord.json';
import './index.css';

const { confirm } = Modal;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

// 法人主体选项
const LEGAL_ENTITIES = [
  '高速石化',
  '化石能源'
];

// 表单验证规则
const FORM_RULES = {
  required: { required: true, message: '此字段为必填项' },
  phone: { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
  email: { type: 'email', message: '请输入正确的邮箱格式' },
  number: { type: 'number', message: '请输入数字' },
  coordinates: { pattern: /^\d+\.\d+,\d+\.\d+$/, message: '请输入正确的坐标格式（如：115.892151,28.676493）' }
};

const StationManagement = () => {
  // 基础状态
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stationList');
  const [stationList, setStationList] = useState([]);
  const [filteredStationList, setFilteredStationList] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 筛选表单
  const [filterForm] = Form.useForm();
  
  // 组织结构树和筛选状态
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [selectedStationTypes, setSelectedStationTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  // 级联选择器数据
  const [cascaderOptions, setCascaderOptions] = useState([]);
  
  // 油站表单状态
  const [stationForm] = Form.useForm();
  const [stationFormVisible, setStationFormVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [stationFormLoading, setStationFormLoading] = useState(false);
  const [stationFormSubmitting, setStationFormSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  
  // 级联查询相关状态
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [availableServiceAreas, setAvailableServiceAreas] = useState([]);

  // 处理分公司选择变化
  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId);
    
    // 获取对应的服务区
    const serviceAreas = stationData.serviceAreas?.filter(area => area.branchId === branchId) || [];
    setAvailableServiceAreas(serviceAreas);
    
    // 清空服务区选择
    stationForm.setFieldsValue({ serviceAreaId: undefined });
  };

  // 生成油站编号
  const generateStationCode = (branchId, serviceAreaId) => {
    if (!branchId || !serviceAreaId) return '';
    
    const branch = stationData.branches?.find(b => b.id === branchId);
    const serviceArea = stationData.serviceAreas?.find(s => s.id === serviceAreaId);
    
    if (!branch || !serviceArea) return '';
    
    // 获取同一服务区下的最大油站编号
    const existingStations = stationData.stations?.filter(s => s.serviceAreaId === serviceAreaId) || [];
    const maxStationNumber = existingStations.length > 0 
      ? Math.max(...existingStations.map(s => {
          const code = s.stationCode || '';
          return parseInt(code.slice(-4)) || 0;
        }))
      : 0;
    
    const newStationNumber = (maxStationNumber + 1).toString().padStart(4, '0');
    
    return `${branch.code}${serviceArea.code}${newStationNumber}`;
  };

  // 油品类型选项
  const OIL_TYPES = [
    '92#汽油',
    '95#汽油', 
    '98#汽油',
    '0#柴油',
    '-10#柴油',
    '-20#柴油'
  ];

  // 初始化加载数据
  useEffect(() => {
    loadStationData();
    loadChangeRecords();
    buildOrgTreeData();
    buildCascaderOptions();
  }, []);

  // 构建组织结构树数据
  const buildOrgTreeData = () => {
    if (!stationData || !stationData.stations) {
      return;
    }

    const branches = {};

    // 按分公司分组
    stationData.stations.forEach(station => {
      if (!branches[station.branchId]) {
        branches[station.branchId] = {
          title: station.branchName,
          value: station.branchId,
          key: station.branchId,
          children: []
        };
      }

      branches[station.branchId].children.push({
        title: station.name,
        value: station.id,
        key: station.id,
        isLeaf: true
      });
    });

    const treeData = [{
      title: '江西交投化石能源公司',
      value: 'HQ001',
      key: 'HQ001',
      children: Object.values(branches)
    }];

    setOrgTreeData(treeData);
  };

  // 构建级联选择器数据
  const buildCascaderOptions = () => {
    if (!stationData.branches || !stationData.serviceAreas) {
      return;
    }

    const options = stationData.branches.map(branch => ({
      value: branch.id,
      label: branch.name,
      children: stationData.serviceAreas
        .filter(area => area.branchId === branch.id)
        .map(area => ({
          value: area.id,
          label: area.name
        }))
    }));

    setCascaderOptions(options);
  };

  // 加载油站数据
  const loadStationData = async () => {
    try {
      setLoading(true);
      await delay(300);
      
      if (stationData && stationData.stations) {
        const stations = stationData.stations;
        setStationList(stations);
        setFilteredStationList(stations);
        setPagination({
          ...pagination,
          total: stations.length
        });
      }
    } catch (error) {
      message.error('加载油站数据失败');
      console.error('加载油站数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 筛选逻辑
  useEffect(() => {
    let filtered = stationList;

    // 按组织筛选
    if (selectedOrgs.length > 0) {
      filtered = filtered.filter(station => {
        return selectedOrgs.some(orgId => {
          return station.id === orgId || station.branchId === orgId;
        });
      });
    }

    // 按类型筛选
    if (selectedStationTypes.length > 0) {
      filtered = filtered.filter(station => selectedStationTypes.includes(station.type));
    }

    // 按状态筛选
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(station => selectedStatuses.includes(station.status));
    }

    // 按关键字筛选
    if (searchText) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (station.stationCode && station.stationCode.toLowerCase().includes(searchText.toLowerCase())) ||
        station.address.toLowerCase().includes(searchText.toLowerCase()) ||
        station.contactPerson.toLowerCase().includes(searchText.toLowerCase()) ||
        station.branchName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredStationList(filtered);
    setPagination({
      ...pagination,
      current: 1,
      total: filtered.length
    });
  }, [selectedOrgs, selectedStationTypes, selectedStatuses, searchText, stationList]);

  // 筛选处理函数
  const handleOrgChange = (value) => {
    setSelectedOrgs(value || []);
  };

  const handleStationTypeChange = (value) => {
    setSelectedStationTypes(value || []);
  };

  const handleStatusChange = (value) => {
    setSelectedStatuses(value || []);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleResetFilter = () => {
    setSelectedOrgs([]);
    setSelectedStationTypes([]);
    setSelectedStatuses([]);
    setSearchText('');
  };

  // 加载修改记录
  const loadChangeRecords = async () => {
    try {
      await delay(300);
      
      // 从独立文件加载修改记录数据
      setChangeRecords(stationChangeRecord.changeRecords || []);
    } catch (error) {
      message.error('加载修改记录失败');
      console.error('加载修改记录失败:', error);
    }
  };

  // 处理表格分页、排序、筛选变化
  const handleTableChange = (paginationInfo) => {
    setPagination(paginationInfo);
  };

  // 打开编辑油站表单
  const handleEditStation = (record) => {
    setEditingStation(record);
    setViewMode(false);
    setStationFormVisible(true);
    
    // 设置级联选择状态
    if (record.branchId) {
      setSelectedBranch(record.branchId);
      const serviceAreas = stationData.serviceAreas?.filter(area => area.branchId === record.branchId) || [];
      setAvailableServiceAreas(serviceAreas);
    }
    
    // 设置表单初始值
    const formValues = {
      ...record,
      oilTypes: typeof record.oilTypes === 'string' 
        ? record.oilTypes.split(', ') 
        : Array.isArray(record.oilTypes) 
          ? record.oilTypes 
          : [],
      createTime: record.createTime ? moment(record.createTime) : null,
      updateTime: record.updateTime ? moment(record.updateTime) : null,
      openDate: record.openDate ? moment(record.openDate) : null
    };
    stationForm.setFieldsValue(formValues);
  };

  // 查看油站详情
  const handleViewStation = (record) => {
    setEditingStation(record);
    setViewMode(true);
    setStationFormVisible(true);
    
    // 设置级联选择状态
    if (record.branchId) {
      setSelectedBranch(record.branchId);
      const serviceAreas = stationData.serviceAreas?.filter(area => area.branchId === record.branchId) || [];
      setAvailableServiceAreas(serviceAreas);
    }
    
    // 设置表单初始值
    const formValues = {
      ...record,
      oilTypes: typeof record.oilTypes === 'string' 
        ? record.oilTypes.split(', ') 
        : Array.isArray(record.oilTypes) 
          ? record.oilTypes 
          : [],
      createTime: record.createTime ? moment(record.createTime) : null,
      updateTime: record.updateTime ? moment(record.updateTime) : null,
      openDate: record.openDate ? moment(record.openDate) : null
    };
    stationForm.setFieldsValue(formValues);
  };

  // 新增油站
  const handleAddStation = () => {
    setEditingStation(null);
    setViewMode(false);
    setStationFormVisible(true);
    setSelectedBranch(null);
    setAvailableServiceAreas([]);
    stationForm.resetFields();
  };

  // 删除油站
  const handleDeleteStation = (record) => {
    confirm({
      title: '确认删除',
      content: `确定要删除油站"${record.name}"吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          await delay(500);
          message.success('删除成功');
          loadStationData();
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      }
    });
  };

  // 表单提交
  const handleStationSubmit = async () => {
    try {
      const values = await stationForm.validateFields();
      
      setStationFormSubmitting(true);
      
      // 模拟提交
      await delay(800);
      
      message.success('保存成功');
      setStationFormVisible(false);
      loadStationData();
      loadChangeRecords(); // 刷新修改记录
    } catch (error) {
      if (error.errorFields) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error('保存失败');
        console.error('保存失败:', error);
      }
    } finally {
      setStationFormSubmitting(false);
    }
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '正常':
        return 'green';
      case '维护中':
        return 'orange';
      case '停业':
        return 'red';
      case '建设中':
        return 'blue';
      default:
        return 'default';
    }
  };

  // 获取油站类型显示
  const getStationType = (type) => {
    return type || '高速站';
  };

  // 获取所属法人
  const getLegalEntity = (branchName) => {
    if (branchName && branchName.includes('高速')) {
      return '高速石化';
    }
    return '化石能源';
  };

  // 油站列表表格列定义
  const stationColumns = [
    {
      title: '油站编号',
      dataIndex: 'stationCode',
      key: 'stationCode',
      width: 120,
      fixed: 'left'
    },
    {
      title: '油站名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left'
    },
    {
      title: '油站类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => getStationType(type)
    },
    {
      title: '所属法人',
      dataIndex: 'legalEntity',
      key: 'legalEntity',
      width: 100
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150,
    },
    {
      title: '所属服务区',
      dataIndex: 'serviceAreaName',
      key: 'serviceAreaName',
      width: 150,
      render: (serviceAreaName) => serviceAreaName || '-'
    },
    {
      title: '序号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 80
    },
    {
      title: '油站联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 130,
    },
    {
      title: '油站状态',
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewStation(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStation(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个油站吗？"
            onConfirm={() => handleDeleteStation(record)}
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
        </Space>
      )
    }
  ];

  // 修改记录表格列定义
  const changeRecordColumns = [
    {
      title: '记录ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '油站编号',
      dataIndex: 'stationCode',
      key: 'stationCode',
      width: 120,
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (type) => (
        <Tag color={type === '新增' ? 'green' : type === '编辑' ? 'blue' : 'red'}>
          {type}
        </Tag>
      )
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 120,
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 150,
    },
    {
      title: '操作描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '变更内容',
      dataIndex: 'changes',
      key: 'changes',
      width: 300,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        const color = text === '已审批' ? 'green' : text === '审批中' ? 'orange' : 'red';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            Modal.info({
              title: '修改记录详情',
              width: 900,
              content: (
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="记录ID">{record.id}</Descriptions.Item>
                  <Descriptions.Item label="油站ID">{record.stationId}</Descriptions.Item>
                  <Descriptions.Item label="油站名称">{record.stationName}</Descriptions.Item>
                  <Descriptions.Item label="操作类型">
                    <Tag color={record.operationType === '新增' ? 'green' : record.operationType === '编辑' ? 'blue' : 'red'}>
                      {record.operationType}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="操作人">{record.operatorName}</Descriptions.Item>
                  <Descriptions.Item label="操作时间">{record.operateTime}</Descriptions.Item>
                  <Descriptions.Item label="审批状态">
                    <Tag color={record.approvalStatus === '已审批' ? 'green' : record.approvalStatus === '审批中' ? 'orange' : 'red'}>
                      {record.approvalStatus}
                    </Tag>
                  </Descriptions.Item>
                  {record.approver && (
                    <Descriptions.Item label="审批人">{record.approver}</Descriptions.Item>
                  )}
                  <Descriptions.Item label="操作描述" span={2}>{record.description}</Descriptions.Item>
                  <Descriptions.Item label="变更内容" span={2}>{record.changes}</Descriptions.Item>
                  {record.approvalRemark && (
                    <Descriptions.Item label="审批备注" span={2}>{record.approvalRemark}</Descriptions.Item>
                  )}
                </Descriptions>
              )
            });
          }}
        >
          查看
        </Button>
      )
    }
  ];

  // 渲染油站表单
  const renderStationForm = () => {
    const title = viewMode ? '查看油站详情' : (editingStation ? '编辑油站' : '新增油站');
    
    return (
      <Modal
        title={title}
        open={stationFormVisible}
        onCancel={() => setStationFormVisible(false)}
        width={800}
        destroyOnClose={true}
        footer={viewMode ? [
          <Button key="close" onClick={() => setStationFormVisible(false)}>
            关闭
          </Button>
        ] : [
          <Button key="cancel" onClick={() => setStationFormVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit"
            type="primary" 
            onClick={handleStationSubmit} 
            loading={stationFormSubmitting}
          >
            保存
          </Button>
        ]}
      >
        <Spin spinning={stationFormLoading}>
          <Form
            form={stationForm}
            layout="vertical"
            disabled={viewMode}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="stationCode"
                  label="油站编号"
                >
                  <Input disabled placeholder="系统自动生成" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="油站名称"
                  rules={[FORM_RULES.required]}
                >
                  <Input placeholder="请输入油站名称" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="油站类型"
                  rules={[FORM_RULES.required]}
                >
                  <Select placeholder="请选择油站类型">
                    <Option value="高速站">高速站</Option>
                    <Option value="城市站">城市站</Option>
                    <Option value="农村站">农村站</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="legalEntity"
                  label="所属法人"
                  rules={[FORM_RULES.required]}
                >
                  <Select placeholder="请选择所属法人">
                    {LEGAL_ENTITIES.map(entity => (
                      <Option key={entity} value={entity}>{entity}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="branchId"
                  label="所属分公司"
                  rules={[FORM_RULES.required]}
                >
                  <Select 
                    placeholder="请选择所属分公司"
                    onChange={handleBranchChange}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {stationData.branches?.map(branch => (
                      <Option key={branch.id} value={branch.id}>{branch.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="serviceAreaId"
                  label="所属服务区"
                  rules={[FORM_RULES.required]}
                >
                  <Select 
                    placeholder="请选择所属服务区"
                    disabled={!selectedBranch}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(serviceAreaId) => {
                      // 自动生成油站编号
                      if (selectedBranch && serviceAreaId) {
                        const newCode = generateStationCode(selectedBranch, serviceAreaId);
                        stationForm.setFieldsValue({ stationCode: newCode });
                      }
                    }}
                  >
                    {availableServiceAreas.map(area => (
                      <Option key={area.id} value={area.id}>{area.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="coordinates"
                  label="油站坐标"
                  rules={[FORM_RULES.required, FORM_RULES.coordinates]}
                  extra="请输入BD09坐标系坐标，格式：经度,纬度"
                >
                  <Input placeholder="115.892151,28.676493" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="orderNumber"
                  label="油站序号"
                  extra="数字越小越靠前，数字相同时按照创建时间倒序"
                >
                  <InputNumber 
                    min={1} 
                    style={{ width: '100%' }} 
                    placeholder="请输入排序序号（非必填）" 
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="thirdPartyCode"
                  label="第三方油站编号"
                >
                  <Input placeholder="请输入第三方油站编号（非必填）" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="onlineCode"
                  label="线上油站关联编号"
                >
                  <Input placeholder="请输入线上油站关联编号（非必填）" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="油站状态"
                  rules={[FORM_RULES.required]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="正常">正常</Option>
                    <Option value="维护中">维护中</Option>
                    <Option value="停业">停业</Option>
                    <Option value="建设中">建设中</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="openDate"
                  label="开业日期"
                >
                  <DatePicker style={{ width: '100%' }} placeholder="请选择开业日期" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="contactPerson"
                  label="油站联系人"
                  rules={[FORM_RULES.required]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                  rules={[FORM_RULES.phone]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="address"
              label="油站地址"
              rules={[FORM_RULES.required]}
            >
              <Input placeholder="请输入油站地址" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="oilGuns"
                  label="加油枪数量"
                >
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入加油枪数量" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="tankCount"
                  label="油罐数量"
                >
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入油罐数量" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="employees"
                  label="员工数量"
                >
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入员工数量" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="oilTypes"
              label="油品类型"
              rules={[FORM_RULES.required]}
            >
              <Select mode="multiple" placeholder="请选择油品类型">
                {OIL_TYPES.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="createTime"
                  label="创建时间"
                >
                  <DatePicker showTime style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="updateTime"
                  label="最近修改时间"
                >
                  <DatePicker showTime style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  };

  // 渲染油站列表筛选区域
  const renderStationFilterForm = () => {
    const stationTypes = ['高速站', '城市站', '农村站'];
    const stationStatuses = ['正常', '维护中', '停业', '建设中'];

    return (
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={5}>
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
              style={{ width: '100%' }}
              value={selectedOrgs}
              onChange={handleOrgChange}
            />
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              placeholder="请选择油站类型"
              allowClear
              style={{ width: '100%' }}
              value={selectedStationTypes}
              onChange={handleStationTypeChange}
            >
              {stationTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              placeholder="请选择状态"
              allowClear
              style={{ width: '100%' }}
              value={selectedStatuses}
              onChange={handleStatusChange}
            >
              {stationStatuses.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Input
              placeholder="请输入关键字"
              allowClear
              style={{ width: '100%' }}
              value={searchText}
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={7} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStation}>
                新增油站
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染油站列表Tab
  const renderStationListTab = () => {
    return (
      <div>
        {/* 筛选区域 */}
        {renderStationFilterForm()}
        
        {/* 数据表格 */}
        <Table
          columns={stationColumns}
          dataSource={filteredStationList}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '30', '50']
          }}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  };

  // 渲染修改记录Tab
  const renderChangeRecordTab = () => {
    return (
      <div>
        <Table
          columns={changeRecordColumns}
          dataSource={changeRecords}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '30', '50']
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  };

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 渲染页面主体
  return (
    <div className="station-management-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            <Tabs.TabPane tab="油站列表" key="stationList">
              {renderStationListTab()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="修改记录" key="changeRecord">
              {renderChangeRecordTab()}
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Card>
      
      {/* 油站表单弹窗 */}
      {renderStationForm()}
    </div>
  );
};

export default StationManagement; 