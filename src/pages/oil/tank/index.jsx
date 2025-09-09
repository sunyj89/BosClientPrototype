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
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './index.css';
import orgData from '../../../mock/station/orgData.json';

const { Option } = Select;
const { confirm } = Modal;

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
  const [filterForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredTanks, setFilteredTanks] = useState(initialTanks);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  
  // 组织树数据
  const orgTreeData = buildOrgTreeData();
  
  useEffect(() => {
    filterTanks();
  }, [searchText, tanks, selectedOrgs]);
  
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
    form.validateFields().then(values => {
      setLoading(true);
      setTimeout(() => {
        if (editingTank) {
          setTanks(tanks.map(tank => 
            tank.id === editingTank.id ? { ...tank, ...values } : tank
          ));
          message.success('油罐信息更新成功');
        } else {
          const newTank = {
            id: `T${String(tanks.length + 1).padStart(3, '0')}`,
            ...values,
          };
          setTanks([...tanks, newTank]);
          message.success('油罐添加成功');
        }
        setLoading(false);
        setIsModalVisible(false);
      }, 1000);
    });
  };

  const handleDelete = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除油罐 "${record.name}" 吗？`,
      onOk() {
        setTanks(tanks.filter(tank => tank.id !== record.id));
        message.success('删除成功');
      },
    });
  };

  const handleOrgChange = (value) => {
    setSelectedOrgs(value);
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedOrgs([]);
    filterForm.resetFields();
  };

  // 表格列定义
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
      title: '油罐类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '容量(L)',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 120,
      render: (text) => text?.toLocaleString(),
    },
    {
      title: '当前油量(L)',
      dataIndex: 'currentVolume',
      key: 'currentVolume',
      width: 130,
      render: (text) => text?.toLocaleString(),
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
      width: 80,
      render: (text) => (
        <Tag color={text === '正常' ? 'green' : text === '维修中' ? 'orange' : 'red'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '最近检查日期',
      dataIndex: 'lastCheckDate',
      key: 'lastCheckDate',
      width: 130,
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120,
    },
    {
      title: '所属加油站',
      dataIndex: 'station',
      key: 'station',
      width: 150,
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
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="tank-management">
      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <TreeSelect
              treeData={orgTreeData}
              value={selectedOrgs}
              onChange={handleOrgChange}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              placeholder="请选择组织"
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              allowClear
              treeNodeFilterProp="title"
              showSearch
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="搜索油罐名称/油品类型/油站"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => filterTanks()}
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
              >
                新增油罐
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据表格区 */}
      <Card title="油罐管理列表">
        <Table
          columns={columns}
          dataSource={filteredTanks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
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
    </div>
  );
};

export default TankManagement; 