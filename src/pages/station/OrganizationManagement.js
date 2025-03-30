import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Breadcrumb, 
  Tree, 
  Button, 
  Input, 
  Space, 
  Modal, 
  Form, 
  Select,
  Divider,
  Table,
  message,
  Dropdown,
  Menu,
  Popconfirm,
  Empty,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  BranchesOutlined,
  GoldOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SearchOutlined,
  DownOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { TreeNode } = Tree;
const { Option } = Select;

const OrganizationManagement = () => {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState(['company-0']);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  // 模拟组织结构数据
  const [orgData, setOrgData] = useState({
    key: 'company-0',
    title: '总公司',
    type: 'company',
    children: Array.from({ length: 7 }, (_, i) => ({
      key: `branch-${i}`,
      title: `分公司 ${i + 1}`,
      type: 'branch',
      children: Array.from({ length: 10 }, (_, j) => ({
        key: `station-${i}-${j}`,
        title: `加油站 ${i + 1}-${j + 1}`,
        type: 'station',
      }))
    }))
  });

  // 模拟员工数据
  const employeeData = Array.from({ length: 20 }, (_, index) => {
    const orgType = index < 5 ? 'company' : (index < 12 ? 'branch' : 'station');
    const branchIndex = orgType === 'branch' ? index - 5 : Math.floor((index - 12) / 3);
    const stationIndex = orgType === 'station' ? (index - 12) % 3 : 0;
    
    let orgName = '';
    if (orgType === 'company') {
      orgName = '总公司';
    } else if (orgType === 'branch') {
      orgName = `分公司 ${branchIndex + 1}`;
    } else {
      orgName = `加油站 ${branchIndex + 1}-${stationIndex + 1}`;
    }
    
    return {
      key: index.toString(),
      id: `E${1000 + index}`,
      name: `员工${index + 1}`,
      gender: index % 2 === 0 ? '男' : '女',
      position: orgType === 'company' ? '总部职员' : (orgType === 'branch' ? '分公司职员' : '站点职员'),
      organization: orgName,
      contact: `1380013${String(8000 + index).padStart(4, '0')}`,
      email: `employee${index + 1}@example.com`,
    };
  });

  // 表格列配置
  const columns = [
    {
      title: '员工编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: '联系电话',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
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
            onClick={() => handleEditEmployee(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEmployee(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理组织树选择
  const handleTreeSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      setSelectedOrg(selectedKeys[0]);
    } else {
      setSelectedOrg(null);
    }
  };

  // 处理组织树展开/收起
  const handleTreeExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  // 处理添加组织
  const handleAddOrg = () => {
    if (!selectedOrg) {
      message.warning('请先选择一个组织节点');
      return;
    }

    setModalType('add');
    setCurrentRecord(null);
    form.resetFields();
    
    // 根据选中的组织类型，设置可添加的子组织类型
    const selectedOrgType = getOrgTypeByKey(selectedOrg);
    let orgTypes = [];
    
    if (selectedOrgType === 'company') {
      orgTypes = [{ value: 'branch', label: '分公司' }];
    } else if (selectedOrgType === 'branch') {
      orgTypes = [{ value: 'station', label: '加油站' }];
    } else {
      message.warning('无法在加油站下添加子组织');
      return;
    }
    
    form.setFieldsValue({
      parentOrg: getOrgTitleByKey(selectedOrg),
      type: orgTypes[0]?.value,
    });
    
    setModalVisible(true);
  };

  // 处理编辑组织
  const handleEditOrg = () => {
    if (!selectedOrg) {
      message.warning('请先选择一个组织节点');
      return;
    }

    if (selectedOrg === 'company-0') {
      message.warning('总公司信息不可编辑');
      return;
    }

    setModalType('edit');
    setCurrentRecord({ key: selectedOrg });
    
    form.setFieldsValue({
      name: getOrgTitleByKey(selectedOrg),
      type: getOrgTypeByKey(selectedOrg),
    });
    
    setModalVisible(true);
  };

  // 处理删除组织
  const handleDeleteOrg = () => {
    if (!selectedOrg) {
      message.warning('请先选择一个组织节点');
      return;
    }

    if (selectedOrg === 'company-0') {
      message.warning('总公司不可删除');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${getOrgTitleByKey(selectedOrg)} 及其所有子组织吗？`,
      onOk() {
        // 这里应该调用API删除数据
        console.log('删除组织', selectedOrg);
        
        // 模拟删除成功
        const newOrgData = { ...orgData };
        deleteOrgNode(newOrgData, selectedOrg);
        setOrgData(newOrgData);
        setSelectedOrg(null);
        
        message.success('删除成功！');
      },
    });
  };

  // 递归删除组织节点
  const deleteOrgNode = (node, targetKey) => {
    if (!node.children) return false;
    
    const index = node.children.findIndex(item => item.key === targetKey);
    if (index > -1) {
      node.children.splice(index, 1);
      return true;
    }
    
    for (let i = 0; i < node.children.length; i++) {
      if (deleteOrgNode(node.children[i], targetKey)) {
        return true;
      }
    }
    
    return false;
  };

  // 处理添加员工
  const handleAddEmployee = () => {
    if (!selectedOrg) {
      message.warning('请先选择一个组织节点');
      return;
    }

    // 这里应该跳转到员工管理页面或打开添加员工的模态框
    message.info('跳转到员工管理页面添加员工');
  };

  // 处理编辑员工
  const handleEditEmployee = (record) => {
    // 这里应该跳转到员工管理页面或打开编辑员工的模态框
    message.info(`编辑员工: ${record.name}`);
  };

  // 处理删除员工
  const handleDeleteEmployee = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除员工 ${record.name} 吗？`,
      onOk() {
        // 这里应该调用API删除数据
        console.log('删除员工', record);
        // 模拟删除成功
        message.success('删除成功！');
      },
    });
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (modalType === 'add') {
        // 添加组织
        const newNode = {
          key: `${values.type}-${Date.now()}`,
          title: values.name,
          type: values.type,
          children: [],
        };
        
        // 找到父节点并添加子节点
        const newOrgData = { ...orgData };
        addChildNode(newOrgData, selectedOrg, newNode);
        setOrgData(newOrgData);
        
        message.success('添加成功！');
      } else {
        // 编辑组织
        const newOrgData = { ...orgData };
        updateNodeTitle(newOrgData, currentRecord.key, values.name);
        setOrgData(newOrgData);
        
        message.success('更新成功！');
      }
      
      setModalVisible(false);
    });
  };

  // 递归添加子节点
  const addChildNode = (node, parentKey, newNode) => {
    if (node.key === parentKey) {
      if (!node.children) node.children = [];
      node.children.push(newNode);
      return true;
    }
    
    if (!node.children) return false;
    
    for (let i = 0; i < node.children.length; i++) {
      if (addChildNode(node.children[i], parentKey, newNode)) {
        return true;
      }
    }
    
    return false;
  };

  // 递归更新节点标题
  const updateNodeTitle = (node, targetKey, newTitle) => {
    if (node.key === targetKey) {
      node.title = newTitle;
      return true;
    }
    
    if (!node.children) return false;
    
    for (let i = 0; i < node.children.length; i++) {
      if (updateNodeTitle(node.children[i], targetKey, newTitle)) {
        return true;
      }
    }
    
    return false;
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 根据key获取组织类型
  const getOrgTypeByKey = (key) => {
    if (key.startsWith('company-')) return 'company';
    if (key.startsWith('branch-')) return 'branch';
    if (key.startsWith('station-')) return 'station';
    return '';
  };

  // 根据key获取组织标题
  const getOrgTitleByKey = (key) => {
    const findTitle = (node, targetKey) => {
      if (node.key === targetKey) return node.title;
      if (!node.children) return null;
      
      for (let child of node.children) {
        const title = findTitle(child, targetKey);
        if (title) return title;
      }
      
      return null;
    };
    
    return findTitle(orgData, key) || '';
  };

  // 渲染组织树
  const renderTreeNodes = (data) => {
    return (
      <TreeNode 
        key={data.key} 
        title={data.title} 
        icon={
          data.type === 'company' ? <BranchesOutlined /> : 
          data.type === 'branch' ? <GoldOutlined /> : 
          <EnvironmentOutlined />
        }
      >
        {data.children && data.children.map(item => renderTreeNodes(item))}
      </TreeNode>
    );
  };

  // 根据选中的组织筛选员工数据
  const getFilteredEmployeeData = () => {
    if (!selectedOrg) {
      return employeeData;
    }

    const orgTitle = getOrgTitleByKey(selectedOrg);
    
    if (selectedOrg === 'company-0') {
      return employeeData.filter(item => item.organization === '总公司');
    }

    return employeeData.filter(item => item.organization === orgTitle);
  };

  const filteredEmployeeData = getFilteredEmployeeData();

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/station">油站管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>组织结构管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>组织结构管理</h2>
      </div>

      <Row gutter={16}>
        {/* 左侧组织树 */}
        <Col span={8}>
          <Card 
            title="组织结构" 
            extra={
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="small"
                  onClick={handleAddOrg}
                >
                  添加
                </Button>
                <Button 
                  icon={<EditOutlined />} 
                  size="small"
                  onClick={handleEditOrg}
                >
                  编辑
                </Button>
                <Button 
                  danger 
                  icon={<DeleteOutlined />} 
                  size="small"
                  onClick={handleDeleteOrg}
                >
                  删除
                </Button>
              </Space>
            }
          >
            <Tree
              showIcon
              defaultExpandedKeys={expandedKeys}
              onSelect={handleTreeSelect}
              onExpand={handleTreeExpand}
              selectedKeys={selectedOrg ? [selectedOrg] : []}
            >
              {renderTreeNodes(orgData)}
            </Tree>
          </Card>
        </Col>

        {/* 右侧员工列表 */}
        <Col span={16}>
          <Card 
            title={`${getOrgTitleByKey(selectedOrg) || '全部'}员工列表`}
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddEmployee}
              >
                添加员工
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={filteredEmployeeData}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 添加/编辑组织模态框 */}
      <Modal
        title={modalType === 'add' ? '添加组织' : '编辑组织'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          {modalType === 'add' && (
            <Form.Item
              name="parentOrg"
              label="上级组织"
            >
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="组织名称"
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input placeholder="请输入组织名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="组织类型"
            rules={[{ required: true, message: '请选择组织类型' }]}
          >
            <Select 
              placeholder="请选择组织类型"
              disabled={modalType === 'edit'}
            >
              <Option value="branch">分公司</Option>
              <Option value="station">加油站</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationManagement; 