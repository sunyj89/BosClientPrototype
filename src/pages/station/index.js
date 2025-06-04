import React, { useState, useEffect } from 'react';
import { 
  Table, Form, Button, Space, Input, message, Modal, Tag, 
  Select, TreeSelect, Card, Row, Col, 
  Drawer, Descriptions, Spin,
  DatePicker, InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { delay, mockResponse } from '../../utils/utils';
import orgData from '../../mock/station/orgData.json';
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

// 获取油站统计信息
async function fetchStationStats(stationId) {
  await delay(300);
  return mockResponse({
    totalSales: 125000,
    todaySales: 8500,
    fuelVolume: 15000,
    customerCount: 320
  });
}

const StationManagement = () => {
  const location = useLocation();
  
  // 基础状态
  const [loading, setLoading] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [treeData, setTreeData] = useState([]);
  
  // 筛选表单
  const [filterForm] = Form.useForm();
  
  // 油站表单状态
  const [stationForm] = Form.useForm();
  const [stationFormVisible, setStationFormVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [stationFormLoading, setStationFormLoading] = useState(false);
  const [stationFormSubmitting, setStationFormSubmitting] = useState(false);
  const [branchOptions, setBranchOptions] = useState([]);
  
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
  }, []);

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

  // 获取油站列表
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
      content: `确定要删除油站"${record.name}"吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          await deleteStation(record.id);
          message.success('删除成功');
          fetchStationList(); // 刷新列表
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      }
    });
  };

  // 表单提交成功处理
  const handleFormSuccess = () => {
    setStationFormVisible(false);
    
    // 提交成功后刷新数据
    fetchStationList();
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case STATION_STATUS.ACTIVE:
        return 'green';
      case STATION_STATUS.MAINTENANCE:
        return 'orange';
      case STATION_STATUS.CLOSED:
        return 'red';
      case STATION_STATUS.SHUTDOWN:
        return 'gray';
      default:
        return 'default';
    }
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
        createTime: values.createTime ? values.createTime.format('YYYY-MM-DD HH:mm:ss') : null
      };
      
      setStationFormSubmitting(true);
      
      // 提交到服务器
      if (editingStation) {
        await updateStation(submitData);
        message.success('油站修改成功');
      } else {
        await createStation(submitData);
        message.success('新油站创建成功');
      }
      
      // 关闭表单并刷新数据
      setStationFormVisible(false);
      fetchStationList(); // 刷新数据
    } catch (error) {
      if (error.errorFields) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error(editingStation ? '修改油站失败' : '创建油站失败');
        console.error(editingStation ? '修改油站失败:' : '创建油站失败:', error);
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
      <Modal
        title={title}
        open={stationFormVisible}
        onCancel={() => setStationFormVisible(false)}
        width={800}
        destroyOnClose={true}
        footer={[
          <Button key="cancel" onClick={() => setStationFormVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit"
            type="primary" 
            onClick={handleStationSubmit} 
            loading={stationFormSubmitting}
            icon={<PlusOutlined />}
          >
            {editingStation ? '保存' : '新增'}
          </Button>
        ]}
      >
        <Spin spinning={stationFormLoading}>
          <Form
            form={stationForm}
            layout="vertical"
            initialValues={{
              status: '正常',
              gunCount: 0,
              employeeCount: 0
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="油站名称"
                  rules={[FORM_RULES.required]}
                >
                  <Input placeholder="请输入油站名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="branchId"
                  label="所属分公司"
                  rules={[FORM_RULES.required]}
                >
                  <Select placeholder="请选择所属分公司">
                    {renderBranchOptions()}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="manager"
                  label="站长"
                  rules={[FORM_RULES.required]}
                >
                  <Input placeholder="请输入站长姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contact"
                  label="联系电话"
                  rules={[FORM_RULES.phone]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="address"
              label="地址"
              rules={[FORM_RULES.required]}
            >
              <Input placeholder="请输入油站地址" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[FORM_RULES.required]}
                >
                  <Select placeholder="请选择状态">
                    {renderStatusOptions()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="oilTypes"
                  label="油品类型"
                  rules={[FORM_RULES.required]}
                >
                  <Select mode="multiple" placeholder="请选择油品类型">
                    {renderOilTypeOptions()}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gunCount"
                  label="加油枪数量"
                  rules={[FORM_RULES.required]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入加油枪数量" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="employeeCount"
                  label="员工数量"
                  rules={[FORM_RULES.required]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入员工数量" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="createTime"
              label="创建时间"
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    );
  };

  // 表格列定义
  const stationColumns = [
    {
      title: '站点编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
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
      width: 250,
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
      width: 130,
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
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStationForm(record)}
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

  // 渲染页面主体
  return (
    <div className="station-container">
        {/* 筛选区域 */}
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={filterForm}
            layout="inline"
            onFinish={handleFilterSubmit}
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
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
          
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                onClick={() => filterForm.submit()}
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleFilterReset}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openStationForm()}
              >
                新增油站
              </Button>
            </Space>
          </div>
        </Card>
        
        {/* 数据表格区 */}
        <Card title="油站列表">
          <Table
            columns={stationColumns}
            dataSource={stationList}
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
        </Card>
      
      {/* 油站表单弹窗 */}
      {renderStationForm()}
    </div>
  );
};

export default StationManagement; 