import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col, 
  Space, 
  Tag, 
  Tooltip, 
  Modal, 
  Divider,
  Popconfirm,
  message,
  Tree,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  BranchesOutlined,
  GoldOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { TreeNode } = Tree;
const { Option } = Select;
const { Search } = Input;

const StationManagement = () => {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState(['company-0']);
  const [searchValue, setSearchValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  // 模拟组织结构数据
  const orgData = {
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
  };

  // 模拟油站数据
  const stationData = Array.from({ length: 70 }, (_, index) => {
    const branchIndex = Math.floor(index / 10);
    const stationIndex = index % 10;
    return {
      key: `station-${branchIndex}-${stationIndex}`,
      id: `S${100 + index}`,
      name: `加油站 ${branchIndex + 1}-${stationIndex + 1}`,
      branch: `分公司 ${branchIndex + 1}`,
      address: `XX市XX区XX路${index + 1}号`,
      manager: `站长${index + 1}`,
      contact: `1380013${String(8000 + index).padStart(4, '0')}`,
      status: index % 3 === 0 ? 'active' : (index % 3 === 1 ? 'maintenance' : 'inactive'),
      oilGuns: 4 + (index % 4),
      oilTanks: 2 + (index % 3),
      employees: 8 + (index % 5),
      dailySales: 50000 + (index * 1000),
    };
  });

  // 表格列配置
  const columns = [
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
      width: 150,
    },
    {
      title: '所属分公司',
      dataIndex: 'branch',
      key: 'branch',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: '站长',
      dataIndex: 'manager',
      key: 'manager',
      width: 100,
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
      render: (status) => {
        let color = 'green';
        let text = '正常营业';
        
        if (status === 'maintenance') {
          color = 'orange';
          text = '维护中';
        } else if (status === 'inactive') {
          color = 'red';
          text = '停业';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: '正常营业', value: 'active' },
        { text: '维护中', value: 'maintenance' },
        { text: '停业', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '油枪数',
      dataIndex: 'oilGuns',
      key: 'oilGuns',
      width: 80,
    },
    {
      title: '油罐数',
      dataIndex: 'oilTanks',
      key: 'oilTanks',
      width: 80,
    },
    {
      title: '员工数',
      dataIndex: 'employees',
      key: 'employees',
      width: 80,
    },
    {
      title: '日均销售额(元)',
      dataIndex: 'dailySales',
      key: 'dailySales',
      width: 140,
      render: (text) => text.toLocaleString('zh-CN'),
      sorter: (a, b) => a.dailySales - b.dailySales,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
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
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
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

  // 处理搜索
  const handleSearch = (value) => {
    setSearchValue(value);
  };

  // 处理添加
  const handleAdd = () => {
    setModalType('add');
    setCurrentRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      branch: record.branch,
      address: record.address,
      manager: record.manager,
      contact: record.contact,
      status: record.status,
      oilGuns: record.oilGuns,
      oilTanks: record.oilTanks,
      employees: record.employees,
    });
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${record.name} 吗？`,
      onOk() {
        // 这里应该调用API删除数据
        console.log('删除', record);
        // 模拟删除成功
        Modal.success({
          content: '删除成功！',
        });
      },
    });
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields().then(values => {
      // 这里应该调用API保存数据
      console.log('保存', values);
      // 模拟保存成功
      Modal.success({
        content: modalType === 'add' ? '添加成功！' : '更新成功！',
        onOk() {
          setModalVisible(false);
        },
      });
    });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
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

  // 根据选中的组织筛选油站数据
  const getFilteredStationData = () => {
    if (!selectedOrg) {
      return stationData;
    }

    if (selectedOrg === 'company-0') {
      return stationData;
    }

    if (selectedOrg.startsWith('branch-')) {
      const branchIndex = parseInt(selectedOrg.split('-')[1]);
      return stationData.filter(item => item.branch === `分公司 ${branchIndex + 1}`);
    }

    if (selectedOrg.startsWith('station-')) {
      const [_, branchIndex, stationIndex] = selectedOrg.split('-');
      return stationData.filter(item => item.key === selectedOrg);
    }

    return [];
  };

  // 根据搜索值进一步筛选数据
  const getSearchedData = () => {
    const filteredData = getFilteredStationData();
    if (!searchValue) {
      return filteredData;
    }
    
    return filteredData.filter(item => 
      item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.address.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.contact.includes(searchValue)
    );
  };

  // 获取统计数据
  const getStatistics = () => {
    const filteredData = getFilteredStationData();
    return {
      totalStations: filteredData.length,
      activeStations: filteredData.filter(item => item.status === 'active').length,
      totalSales: filteredData.reduce((sum, item) => sum + item.dailySales, 0),
      avgSales: filteredData.length > 0 
        ? filteredData.reduce((sum, item) => sum + item.dailySales, 0) / filteredData.length 
        : 0,
    };
  };

  const stats = getStatistics();
  const dataSource = getSearchedData();

  return (
    <div>
      <div className="page-header">
        <h2>油站管理</h2>
      </div>

      {/* 统计数据卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="油站总数"
              value={stats.totalStations}
              valueStyle={{ color: '#1890ff' }}
              prefix={<EnvironmentOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常营业油站"
              value={stats.activeStations}
              valueStyle={{ color: '#52c41a' }}
              prefix={<EnvironmentOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="日均销售总额"
              value={stats.totalSales}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              prefix="¥"
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="单站日均销售额"
              value={stats.avgSales}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
              prefix="¥"
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 左侧组织树 */}
        <Col span={6}>
          <Card title="组织结构" style={{ marginBottom: 16 }}>
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

        {/* 右侧油站列表 */}
        <Col span={18}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Search
                    placeholder="搜索油站编号、名称、地址等"
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                    allowClear
                  />
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAdd}
                  >
                    添加油站
                  </Button>
                </Col>
              </Row>
            </div>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1500 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 添加/编辑模态框 */}
      <Modal
        title={modalType === 'add' ? '添加油站' : '编辑油站'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="id"
            label="站点编号"
            rules={[{ required: true, message: '请输入站点编号' }]}
          >
            <Input placeholder="请输入站点编号" />
          </Form.Item>
          <Form.Item
            name="name"
            label="站点名称"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input placeholder="请输入站点名称" />
          </Form.Item>
          <Form.Item
            name="branch"
            label="所属分公司"
            rules={[{ required: true, message: '请选择所属分公司' }]}
          >
            <Select placeholder="请选择所属分公司">
              {Array.from({ length: 7 }, (_, i) => (
                <Option key={i} value={`分公司 ${i + 1}`}>分公司 {i + 1}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item
            name="manager"
            label="站长"
            rules={[{ required: true, message: '请输入站长姓名' }]}
          >
            <Input placeholder="请输入站长姓名" />
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
              <Option value="active">正常营业</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="inactive">停业</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="oilGuns"
            label="油枪数"
            rules={[{ required: true, message: '请输入油枪数' }]}
          >
            <Input type="number" min={1} placeholder="请输入油枪数" />
          </Form.Item>
          <Form.Item
            name="oilTanks"
            label="油罐数"
            rules={[{ required: true, message: '请输入油罐数' }]}
          >
            <Input type="number" min={1} placeholder="请输入油罐数" />
          </Form.Item>
          <Form.Item
            name="employees"
            label="员工数"
            rules={[{ required: true, message: '请输入员工数' }]}
          >
            <Input type="number" min={1} placeholder="请输入员工数" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StationManagement; 