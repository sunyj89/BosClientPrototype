import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tooltip, 
  Tag, 
  TreeSelect, 
  Row, 
  Col,
  Tabs,
  Drawer,
  Alert,
  Timeline,
  Radio,
  Upload,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  UploadOutlined
} from '@ant-design/icons';
import './index.css';
import orgData from '../../../mock/station/orgData.json';

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text } = Typography;

// 构建用于TreeSelect的组织数据
const buildOrgTreeData = () => {
  if (!orgData || !orgData[0]) {
    return []; // 如果数据结构不正确，返回空数组
  }
  
  const headquarters = orgData[0]; // 总部
  
  const hqNode = {
    title: headquarters.name,
    value: headquarters.id,
    key: headquarters.id,
    children: []
  };
  
  // 处理区域（分公司）
  if (headquarters.children && headquarters.children.length > 0) {
    hqNode.children = headquarters.children.map(branch => {
      const branchNode = {
        title: branch.name,
        value: branch.id,
        key: branch.id,
        children: []
      };
      
      // 处理油站
      if (branch.children && branch.children.length > 0) {
        branchNode.children = branch.children
          .filter(station => station.type === 'station')
          .map(station => ({
            title: station.name,
            value: station.id,
            key: station.id,
          }));
      }
      
      return branchNode;
    });
  }
  
  return [hqNode];
};

// 模拟油罐数据
const generateMockTanks = () => {
  const tankList = [];
  let tankId = 1;
  
  // 适应新的orgData结构
  if (!orgData || !orgData[0] || !orgData[0].children) {
    return tankList; // 如果数据结构不正确，返回空列表
  }
  
  const headquarters = orgData[0]; // 总部
  
  headquarters.children.forEach((branch, branchIndex) => {
    if (!branch.children) return;
    
    branch.children.forEach((station, stationIndex) => {
      // 每个油站生成4个油罐
      const tankTypes = ['地埋式', '卧式', '立式'];
      const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
      const statuses = ['正常', '维修中', '停用'];
      
      for (let i = 0; i < 4; i++) {
        const capacity = [20000, 30000, 40000][Math.floor(Math.random() * 3)];
        const currentVolume = Math.floor(Math.random() * capacity);
        const statusIndex = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : 2) : 0;
        
        tankList.push({
          id: `T${String(tankId++).padStart(3, '0')}`,
          name: `${i + 1}号油罐`,
          type: tankTypes[Math.floor(Math.random() * tankTypes.length)],
          capacity: capacity,
          currentVolume: currentVolume,
          oilType: oilTypes[i],
          status: statuses[statusIndex],
          lastCheckDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          station: station.name,
          stationId: station.id,
          branchId: branch.id,
          branchName: branch.name,
          approvalStatus: Math.random() > 0.7 ? (Math.random() > 0.5 ? '待审批' : '已审批') : null,
        });
      }
    });
  });
  
  return tankList;
};

const initialTanks = generateMockTanks();

const TankManagement = () => {
  const [tanks, setTanks] = useState(initialTanks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTank, setEditingTank] = useState(null);
  const [form] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredTanks, setFilteredTanks] = useState(initialTanks);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [approvalDrawerVisible, setApprovalDrawerVisible] = useState(false);
  const [currentApproval, setCurrentApproval] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('待审批');
  const [selectedOilType, setSelectedOilType] = useState(null);
  
  // 组织树数据
  const orgTreeData = buildOrgTreeData();
  
  useEffect(() => {
    filterTanks();
  }, [searchText, tanks, selectedOrgs, activeTab, approvalStatus, selectedOilType]);
  
  // 过滤油罐数据
  const filterTanks = () => {
    let filtered = tanks;
    
    // 根据组织筛选
    if (selectedOrgs && selectedOrgs.length > 0) {
      filtered = filtered.filter(tank => {
        // 检查是否匹配选中的组织
        return selectedOrgs.some(orgId => {
          // 匹配油站
          if (tank.stationId === orgId) {
            return true;
          }
          
          // 匹配分公司/区域
          if (tank.branchId === orgId) {
            return true;
          }
          
          // 匹配总部
          if (orgId === 'HQ') {
            return true;
          }
          
          return false;
        });
      });
    }
    
    // 文本搜索筛选
    if (searchText) {
      filtered = filtered.filter(
        (tank) =>
          tank.name.toLowerCase().includes(searchText.toLowerCase()) ||
          tank.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
          tank.station.toLowerCase().includes(searchText.toLowerCase()) ||
          tank.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 审批中心tab筛选
    if (activeTab === '2') {
      filtered = filtered.filter(tank => tank.approvalStatus);
      
      // 根据审批状态筛选
      if (approvalStatus) {
        filtered = filtered.filter(tank => tank.approvalStatus === approvalStatus);
      }
      
      // 根据油品类型筛选
      if (selectedOilType) {
        filtered = filtered.filter(tank => tank.oilType === selectedOilType);
      }
    }
    
    setFilteredTanks(filtered);
  };

  const showAddModal = () => {
    setEditingTank(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingTank(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      setTimeout(() => {
        if (editingTank) {
          // 编辑现有油罐
          const updatedTanks = tanks.map((tank) =>
            tank.id === editingTank.id ? { ...tank, ...values } : tank
          );
          setTanks(updatedTanks);
          message.success('油罐信息已更新');
        } else {
          // 添加新油罐
          const newTank = {
            ...values,
            id: `T${String(tanks.length + 1).padStart(3, '0')}`,
            approvalStatus: '待审批',
          };
          setTanks([...tanks, newTank]);
          message.success('新油罐已添加');
        }
        setLoading(false);
        setIsModalVisible(false);
      }, 500);
    });
  };

  const handleDelete = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除 ${record.name} 吗？此操作不可恢复。`,
      onOk() {
        const updatedTanks = tanks.filter((tank) => tank.id !== record.id);
        setTanks(updatedTanks);
        message.success('油罐已删除');
      },
    });
  };
  
  // 处理组织选择变化
  const handleOrgChange = (value) => {
    setSelectedOrgs(value);
  };
  
  // 处理审批状态选择变化
  const handleApprovalStatusChange = (value) => {
    setApprovalStatus(value);
  };
  
  // 处理油品类型选择变化
  const handleOilTypeChange = (value) => {
    setSelectedOilType(value);
  };

  // 处理重置筛选条件
  const handleReset = () => {
    setSelectedOrgs([]);
    setSearchText('');
    setApprovalStatus('待审批');
    setSelectedOilType(null);
    filterForm.resetFields();
  };
  
  // 处理Tab切换
  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
  };

  // 打开审批抽屉
  const showApprovalDrawer = (record) => {
    setCurrentApproval(record);
    setApprovalDrawerVisible(true);
  };
  
  // 关闭审批抽屉
  const closeApprovalDrawer = () => {
    setApprovalDrawerVisible(false);
    setCurrentApproval(null);
    approvalForm.resetFields();
  };
  
  // 获取随机日期
  const getRandomPastDate = (daysAgo = 30) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date.toISOString().split('T')[0] + ' ' + 
           new Date().toTimeString().split(' ')[0].substring(0, 5);
  };
  
  // 生成模拟审批历史记录
  const generateApprovalHistory = () => {
    if (!currentApproval) return [];
    
    const history = [];
    
    // 创建申请记录
    history.push({
      time: getRandomPastDate(7),
      operateUser: '张三',
      operateType: '创建',
      content: `创建了油罐"${currentApproval.name}"的申请`,
    });
    
    // 审核记录
    if (currentApproval.approvalStatus === '已审批') {
      history.push({
        time: getRandomPastDate(3),
        operateUser: '李经理',
        operateType: '审批通过',
        content: '审批通过，油罐信息已更新',
      });
    }
    
    return history;
  };
  
  // 处理审批提交
  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(values => {
      setLoading(true);
      
      // 模拟审批处理
      setTimeout(() => {
        const updatedTanks = tanks.map(tank => {
          if (tank.id === currentApproval.id) {
            const newStatus = values.approvalResult === 'approve' ? '已审批' : '已拒绝';
            return {
              ...tank,
              approvalStatus: newStatus,
              approvalComment: values.comment,
              approvalTime: new Date().toISOString(),
            };
          }
          return tank;
        });
        
        setTanks(updatedTanks);
        message.success(`审批${values.approvalResult === 'approve' ? '通过' : '拒绝'}成功`);
        setLoading(false);
        closeApprovalDrawer();
      }, 500);
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '油罐编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '油罐名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150,
    },
    {
      title: '所属加油站',
      dataIndex: 'station',
      key: 'station',
      width: 180,
    },
    {
      title: '油罐类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '容量(L)',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (text) => `${text.toLocaleString()}`,
    },
    {
      title: '当前油量(L)',
      dataIndex: 'currentVolume',
      key: 'currentVolume',
      width: 120,
      render: (text, record) => {
        const percentage = (text / record.capacity) * 100;
        let color = 'green';
        if (percentage < 30) {
          color = 'red';
        } else if (percentage < 50) {
          color = 'orange';
        }
        return (
          <Tooltip title={`${percentage.toFixed(1)}%`}>
            <span style={{ color }}>{text.toLocaleString()}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        let color = 'green';
        if (text === '维修中') {
          color = 'orange';
        } else if (text === '停用') {
          color = 'red';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '最近检查日期',
      dataIndex: 'lastCheckDate',
      key: 'lastCheckDate',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  
  // 审批中心的表格列
  const approvalColumns = [
    ...columns.slice(0, -1),
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        const color = text === '待审批' ? 'orange' : 'green';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => showApprovalDrawer(record)}
          >
            审批
          </Button>
        </Space>
      ),
    },
  ];
  
  // 根据当前Tab返回对应的列配置
  const getColumns = () => {
    return activeTab === '1' ? columns : approvalColumns;
  };

  // 渲染审批历史记录
  const renderApprovalHistory = () => {
    const history = generateApprovalHistory();
    
    return (
      <Timeline>
        {history.map((item, index) => (
          <Timeline.Item
            key={index}
            color={item.operateType === '审批通过' ? 'green' : item.operateType === '审批拒绝' ? 'red' : 'blue'}
            dot={
              item.operateType === '审批通过' ? <CheckCircleOutlined /> : 
              item.operateType === '审批拒绝' ? <CloseCircleOutlined /> : 
              item.operateType === '取消' ? <StopOutlined /> : null
            }
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
    );
  };

  // 渲染审批中心的筛选表单
  const renderApprovalFilterForm = () => {
    return (
      <Form 
        form={filterForm}
        layout="inline"
        initialValues={{ approvalStatus: '待审批' }}
        className="filter-form"
      >
        <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
          <Col span={10}>
            <Form.Item label="组织筛选" name="organizations">
              <TreeSelect
                treeData={orgTreeData}
                value={selectedOrgs}
                onChange={handleOrgChange}
                treeCheckable
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                placeholder="请选择组织"
                style={{ width: '300px' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                allowClear
                treeNodeFilterProp="title"
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="keyword" label="关键字">
              <Input
                placeholder="搜索油罐名称/编号"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="审批状态" name="approvalStatus">
              <Select 
                placeholder="请选择审批状态" 
                style={{ width: '100%' }}
                allowClear
                defaultValue="待审批"
                value={approvalStatus}
                onChange={handleApprovalStatusChange}
              >
                <Option value="待审批">待审批</Option>
                <Option value="已审批">已审批</Option>
                <Option value="已拒绝">已拒绝</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} className="form-buttons">
            <Space>
              <Button 
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => filterTanks()}
                htmlType="submit"
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <div className="tank-management">
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="tank-tabs">
        <TabPane tab="油罐列表" key="1">
          <Card style={{ marginBottom: 16 }}>
            <Form 
              layout="inline" 
              className="filter-form"
            >
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={10}>
                  <Form.Item label="组织筛选">
                    <TreeSelect
                      treeData={orgTreeData}
                      value={selectedOrgs}
                      onChange={handleOrgChange}
                      treeCheckable
                      showCheckedStrategy={TreeSelect.SHOW_PARENT}
                      placeholder="请选择组织"
                      style={{ width: '300px' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      allowClear
                      treeNodeFilterProp="title"
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="关键字">
                    <Input
                      placeholder="搜索油罐名称/油品类型/油站"
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: '300px' }}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={4} className="form-buttons">
                  <Space>
                    <Button 
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={() => filterTanks()}
                      htmlType="submit"
                    >
                      查询
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={handleReset}
                    >
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="form-buttons">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                  >
                    新增油罐
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card title="油罐管理列表">
            <Table
              columns={getColumns()}
              dataSource={filteredTanks}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1500 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="审批中心" key="2">
          <Card style={{ marginBottom: 16 }}>
            {renderApprovalFilterForm()}
          </Card>

          <Card title="油罐审批列表">
            <Table
              columns={getColumns()}
              dataSource={filteredTanks}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1500 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={editingTank ? '编辑油罐' : '新增油罐'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={700}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="name"
            label="油罐名称"
            rules={[{ required: true, message: '请输入油罐名称' }]}
          >
            <Input placeholder="请输入油罐名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="油罐类型"
            rules={[{ required: true, message: '请选择油罐类型' }]}
          >
            <Select placeholder="请选择油罐类型">
              <Option value="地埋式">地埋式</Option>
              <Option value="卧式">卧式</Option>
              <Option value="立式">立式</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="capacity"
            label="容量(L)"
            rules={[{ required: true, message: '请输入油罐容量' }]}
          >
            <Input type="number" placeholder="请输入油罐容量" />
          </Form.Item>
          <Form.Item
            name="currentVolume"
            label="当前油量(L)"
            rules={[{ required: true, message: '请输入当前油量' }]}
          >
            <Input type="number" placeholder="请输入当前油量" />
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
              <Option value="-10#柴油">-10#柴油</Option>
              <Option value="-20#柴油">-20#柴油</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择油罐状态' }]}
          >
            <Select placeholder="请选择油罐状态">
              <Option value="正常">正常</Option>
              <Option value="维修中">维修中</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="lastCheckDate"
            label="最近检查日期"
            rules={[{ required: true, message: '请输入最近检查日期' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="station"
            label="所属加油站"
            rules={[{ required: true, message: '请选择所属加油站' }]}
          >
            <TreeSelect
              treeData={orgTreeData}
              treeNodeFilterProp="title"
              showSearch
              placeholder="请选择所属加油站"
              treeDefaultExpandAll
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 审批抽屉 */}
      <Drawer
        title="油罐审批"
        width={800}
        onClose={closeApprovalDrawer}
        open={approvalDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={closeApprovalDrawer}>取消</Button>
              <Button danger onClick={() => {
                approvalForm.setFieldsValue({ approvalResult: 'reject' });
                handleApprovalSubmit();
              }}>
                拒绝
              </Button>
              <Button 
                type="primary" 
                onClick={() => {
                  approvalForm.setFieldsValue({ approvalResult: 'approve' });
                  handleApprovalSubmit();
                }} 
                style={{ 
                  backgroundColor: '#32AF50', 
                  borderColor: '#32AF50' 
                }}
              >
                通过
              </Button>
            </Space>
          </div>
        }
      >
        {currentApproval && (
          <>
            <Alert
              message={
                <span>
                  当前状态：
                  <Tag color={currentApproval.approvalStatus === '待审批' ? '#faad14' : '#32AF50'}>
                    {currentApproval.approvalStatus}
                  </Tag>
                  提交时间：{getRandomPastDate(10)}
                </span>
              }
              type={currentApproval.approvalStatus === '待审批' ? 'warning' : 'success'}
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text strong>油罐编号：</Text> {currentApproval.id}
                </Col>
                <Col span={8}>
                  <Text strong>油罐名称：</Text> {currentApproval.name}
                </Col>
                <Col span={8}>
                  <Text strong>油罐类型：</Text> {currentApproval.type}
                </Col>
                <Col span={8}>
                  <Text strong>容量(L)：</Text> {currentApproval.capacity.toLocaleString()}
                </Col>
                <Col span={8}>
                  <Text strong>当前油量(L)：</Text> {currentApproval.currentVolume.toLocaleString()}
                </Col>
                <Col span={8}>
                  <Text strong>油品类型：</Text> {currentApproval.oilType}
                </Col>
                <Col span={8}>
                  <Text strong>状态：</Text> 
                  <Tag color={
                    currentApproval.status === '正常' ? 'green' : 
                    currentApproval.status === '维修中' ? 'orange' : 'red'
                  }>
                    {currentApproval.status}
                  </Tag>
                </Col>
                <Col span={8}>
                  <Text strong>最近检查日期：</Text> {currentApproval.lastCheckDate}
                </Col>
                <Col span={8}>
                  <Text strong>所属分公司：</Text> {currentApproval.branchName}
                </Col>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Col span={16}>
                  <Text strong>所属加油站：</Text> {currentApproval.station}
                </Col>
              </Row>
            </Card>
            
            <Card title="审核流程" style={{ marginBottom: 16 }}>
              {renderApprovalHistory()}
            </Card>
            
            <Card title="审核意见">
              <Form
                form={approvalForm}
                layout="vertical"
              >
                <Form.Item
                  name="approvalResult"
                  label="审核结果"
                  rules={[{ required: true, message: '请选择审核结果' }]}
                  initialValue="approve"
                >
                  <Radio.Group>
                    <Radio value="approve">通过</Radio>
                    <Radio value="reject">拒绝</Radio>
                  </Radio.Group>
                </Form.Item>
                
                <Form.Item
                  name="comment"
                  label="审核意见"
                  rules={[{ required: true, message: '请填写审核意见' }]}
                >
                  <TextArea rows={4} placeholder="请输入审核意见" maxLength={200} showCount />
                </Form.Item>
                
                <Form.Item
                  name="attachment"
                  label="附件上传"
                >
                  <Upload
                    name="file"
                    action="/upload.do"
                    listType="text"
                    maxCount={3}
                  >
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Card>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default TankManagement; 