import React, { useState, useEffect } from 'react';
import { 
  Table, Form, Button, Space, Input, message, Modal, Tag, 
  Select, Card, Row, Col, 
  Tabs, Descriptions, Spin,
  DatePicker, InputNumber, TreeSelect
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
import './index.css';

const { confirm } = Modal;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

// 油品类型
const OIL_TYPES = [
  '92#汽油',
  '95#汽油',
  '98#汽油',
  '0#柴油',
  '-10#柴油',
  '-20#柴油'
];

// 表单验证规则
const FORM_RULES = {
  required: { required: true, message: '此字段为必填项' },
  phone: { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
  email: { type: 'email', message: '请输入正确的邮箱格式' },
  number: { type: 'number', message: '请输入数字' }
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
  
  // 油站表单状态
  const [stationForm] = Form.useForm();
  const [stationFormVisible, setStationFormVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [stationFormLoading, setStationFormLoading] = useState(false);
  const [stationFormSubmitting, setStationFormSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  
  // 初始化加载数据
  useEffect(() => {
    loadStationData();
    loadChangeRecords();
    buildOrgTreeData();
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
        station.id.toLowerCase().includes(searchText.toLowerCase()) ||
        station.address.toLowerCase().includes(searchText.toLowerCase()) ||
        station.contact.toLowerCase().includes(searchText.toLowerCase()) ||
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
      
      // 生成模拟修改记录数据
      const mockChangeRecords = [
        {
          id: 'CR001',
          stationId: 'ST001',
          stationName: '南昌高速服务区加油站',
          operationType: '编辑',
          operatorName: '张经理',
          operateTime: '2023-10-15 14:30:00',
          description: '修改了油站联系电话',
          changes: '联系电话：13812345678 → 13812345679'
        },
        {
          id: 'CR002',
          stationId: 'ST002',
          stationName: '上饶高速服务区加油站',
          operationType: '编辑',
          operatorName: '李站长',
          operateTime: '2023-10-12 10:15:00',
          description: '修改了油站状态',
          changes: '状态：维护中 → 正常'
        },
        {
          id: 'CR003',
          stationId: 'ST003',
          stationName: '赣州高速服务区加油站',
          operationType: '编辑',
          operatorName: '王经理',
          operateTime: '2023-10-10 16:45:00',
          description: '修改了油站地址',
          changes: '地址：江西省赣州市高速公路赣州服务区 → 江西省赣州市高速公路赣州服务区东区'
        },
        {
          id: 'CR004',
          stationId: 'ST004',
          stationName: '九江高速服务区加油站',
          operationType: '新增',
          operatorName: '刘站长',
          operateTime: '2023-10-08 09:20:00',
          description: '新增了油站',
          changes: '新增油站：九江高速服务区加油站'
        },
        {
          id: 'CR005',
          stationId: 'ST005',
          stationName: '南昌市区加油站',
          operationType: '编辑',
          operatorName: '陈经理',
          operateTime: '2023-10-05 13:25:00',
          description: '修改了油品类型',
          changes: '油品类型：92#汽油, 95#汽油, 0#柴油 → 92#汽油, 95#汽油, 98#汽油, 0#柴油'
        }
      ];
      
      setChangeRecords(mockChangeRecords);
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
    
    // 设置表单初始值
    const formValues = {
      ...record,
      oilTypes: typeof record.oilTypes === 'string' 
        ? record.oilTypes.split(', ') 
        : Array.isArray(record.oilTypes) 
          ? record.oilTypes 
          : [],
      createTime: record.createTime ? moment(record.createTime) : null,
      updateTime: record.updateTime ? moment(record.updateTime) : null
    };
    stationForm.setFieldsValue(formValues);
  };

  // 查看油站详情
  const handleViewStation = (record) => {
    setEditingStation(record);
    setViewMode(true);
    setStationFormVisible(true);
    
    // 设置表单初始值
    const formValues = {
      ...record,
      oilTypes: typeof record.oilTypes === 'string' 
        ? record.oilTypes.split(', ') 
        : Array.isArray(record.oilTypes) 
          ? record.oilTypes 
          : [],
      createTime: record.createTime ? moment(record.createTime) : null,
      updateTime: record.updateTime ? moment(record.updateTime) : null
    };
    stationForm.setFieldsValue(formValues);
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
      title: '油站ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
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
      dataIndex: 'branchName',
      key: 'legalEntity',
      width: 100,
      render: (branchName) => getLegalEntity(branchName)
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
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteStation(record)}
          >
            删除
          </Button>
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
      title: '油站ID',
      dataIndex: 'stationId',
      key: 'stationId',
      width: 100,
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
              width: 600,
              content: (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="记录ID">{record.id}</Descriptions.Item>
                  <Descriptions.Item label="油站ID">{record.stationId}</Descriptions.Item>
                  <Descriptions.Item label="油站名称">{record.stationName}</Descriptions.Item>
                  <Descriptions.Item label="操作类型">{record.operationType}</Descriptions.Item>
                  <Descriptions.Item label="操作人">{record.operatorName}</Descriptions.Item>
                  <Descriptions.Item label="操作时间">{record.operateTime}</Descriptions.Item>
                  <Descriptions.Item label="操作描述">{record.description}</Descriptions.Item>
                  <Descriptions.Item label="变更内容">{record.changes}</Descriptions.Item>
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
                  name="id"
                  label="油站ID"
                >
                  <Input disabled />
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
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="branchName"
                  label="所属分公司"
                  rules={[FORM_RULES.required]}
                >
                  <Select placeholder="请选择所属分公司">
                    <Option value="赣中分公司">赣中分公司</Option>
                    <Option value="赣东北分公司">赣东北分公司</Option>
                    <Option value="赣东分公司">赣东分公司</Option>
                    <Option value="赣东南分公司">赣东南分公司</Option>
                    <Option value="赣南分公司">赣南分公司</Option>
                    <Option value="赣西南分公司">赣西南分公司</Option>
                    <Option value="赣西分公司">赣西分公司</Option>
                    <Option value="赣西北分公司">赣西北分公司</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="serviceAreaName"
                  label="所属服务区"
                >
                  <Input placeholder="请输入所属服务区" />
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
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingStation(null);
                setViewMode(false);
                setStationFormVisible(true);
                stationForm.resetFields();
              }}>
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