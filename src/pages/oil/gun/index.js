import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;
const { confirm } = Modal;

// 模拟油枪数据
const initialGuns = [
  {
    id: 'G001',
    name: '1号油枪',
    tankId: 'T001',
    tankName: '1号油罐',
    oilType: '92#汽油',
    position: 'A1',
    status: '正常',
    lastMaintenance: '2023-03-10',
    station: '中石化XX加油站',
    flowRate: 35,
  },
  {
    id: 'G002',
    name: '2号油枪',
    tankId: 'T001',
    tankName: '1号油罐',
    oilType: '92#汽油',
    position: 'A2',
    status: '正常',
    lastMaintenance: '2023-03-10',
    station: '中石化XX加油站',
    flowRate: 35,
  },
  {
    id: 'G003',
    name: '3号油枪',
    tankId: 'T002',
    tankName: '2号油罐',
    oilType: '95#汽油',
    position: 'B1',
    status: '正常',
    lastMaintenance: '2023-03-10',
    station: '中石化XX加油站',
    flowRate: 35,
  },
  {
    id: 'G004',
    name: '4号油枪',
    tankId: 'T002',
    tankName: '2号油罐',
    oilType: '95#汽油',
    position: 'B2',
    status: '维修中',
    lastMaintenance: '2023-02-15',
    station: '中石化XX加油站',
    flowRate: 35,
  },
  {
    id: 'G005',
    name: '5号油枪',
    tankId: 'T003',
    tankName: '3号油罐',
    oilType: '0#柴油',
    position: 'C1',
    status: '正常',
    lastMaintenance: '2023-03-10',
    station: '中石化XX加油站',
    flowRate: 40,
  },
  {
    id: 'G006',
    name: '6号油枪',
    tankId: 'T004',
    tankName: '4号油罐',
    oilType: '0#柴油',
    position: 'C2',
    status: '停用',
    lastMaintenance: '2023-01-20',
    station: '中石化XX加油站',
    flowRate: 40,
  },
  {
    id: 'G007',
    name: '7号油枪',
    tankId: 'T005',
    tankName: '5号油罐',
    oilType: '98#汽油',
    position: 'D1',
    status: '正常',
    lastMaintenance: '2023-03-10',
    station: '中石化XX加油站',
    flowRate: 35,
  },
];

// 模拟油罐数据
const tanks = [
  { id: 'T001', name: '1号油罐', oilType: '92#汽油', station: '中石化XX加油站' },
  { id: 'T002', name: '2号油罐', oilType: '95#汽油', station: '中石化XX加油站' },
  { id: 'T003', name: '3号油罐', oilType: '0#柴油', station: '中石化XX加油站' },
  { id: 'T004', name: '4号油罐', oilType: '0#柴油', station: '中石化XX加油站' },
  { id: 'T005', name: '5号油罐', oilType: '98#汽油', station: '中石化XX加油站' },
];

const GunManagement = () => {
  const [guns, setGuns] = useState(initialGuns);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGun, setEditingGun] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredGuns, setFilteredGuns] = useState(initialGuns);

  useEffect(() => {
    const filtered = guns.filter(
      (gun) =>
        gun.name.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.tankName.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.position.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.status.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredGuns(filtered);
  }, [searchText, guns]);

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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      setTimeout(() => {
        // 获取选中油罐的信息
        const selectedTank = tanks.find(tank => tank.id === values.tankId);
        
        if (editingGun) {
          // 编辑现有油枪
          const updatedGuns = guns.map((gun) =>
            gun.id === editingGun.id ? { 
              ...gun, 
              ...values,
              tankName: selectedTank.name,
              oilType: selectedTank.oilType,
              station: selectedTank.station
            } : gun
          );
          setGuns(updatedGuns);
          message.success('油枪信息已更新');
        } else {
          // 添加新油枪
          const newGun = {
            ...values,
            id: `G${String(guns.length + 1).padStart(3, '0')}`,
            tankName: selectedTank.name,
            oilType: selectedTank.oilType,
            station: selectedTank.station
          };
          setGuns([...guns, newGun]);
          message.success('新油枪已添加');
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
        const updatedGuns = guns.filter((gun) => gun.id !== record.id);
        setGuns(updatedGuns);
        message.success('油枪已删除');
      },
    });
  };

  const columns = [
    {
      title: '油枪编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '油枪名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '所属油罐',
      dataIndex: 'tankName',
      key: 'tankName',
      width: 120,
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '位置',
      dataIndex: 'position',
      key: 'position',
      width: 80,
    },
    {
      title: '流量(L/min)',
      dataIndex: 'flowRate',
      key: 'flowRate',
      width: 120,
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
      title: '最近维护日期',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
      width: 150,
    },
    {
      title: '所属加油站',
      dataIndex: 'station',
      key: 'station',
      width: 180,
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

  return (
    <div className="gun-management">
      <Card
        title="油枪管理"
        extra={
          <Space>
            <Input
              placeholder="搜索油枪"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
            >
              新增油枪
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredGuns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </Card>

      <Modal
        title={editingGun ? '编辑油枪' : '新增油枪'}
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
            label="油枪名称"
            rules={[{ required: true, message: '请输入油枪名称' }]}
          >
            <Input placeholder="请输入油枪名称" />
          </Form.Item>
          <Form.Item
            name="tankId"
            label="所属油罐"
            rules={[{ required: true, message: '请选择所属油罐' }]}
          >
            <Select placeholder="请选择所属油罐">
              {tanks.map(tank => (
                <Option key={tank.id} value={tank.id}>{`${tank.name} (${tank.oilType})`}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="position"
            label="位置"
            rules={[{ required: true, message: '请输入位置' }]}
          >
            <Input placeholder="请输入位置" />
          </Form.Item>
          <Form.Item
            name="flowRate"
            label="流量(L/min)"
            rules={[{ required: true, message: '请输入流量' }]}
          >
            <Input type="number" placeholder="请输入流量" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择油枪状态' }]}
          >
            <Select placeholder="请选择油枪状态">
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
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GunManagement; 