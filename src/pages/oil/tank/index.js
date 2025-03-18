import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;
const { confirm } = Modal;

// 模拟油罐数据
const initialTanks = [
  {
    id: 'T001',
    name: '1号油罐',
    type: '地埋式',
    capacity: 30000,
    currentVolume: 18500,
    oilType: '92#汽油',
    status: '正常',
    lastCheckDate: '2023-02-15',
    station: '中石化XX加油站',
  },
  {
    id: 'T002',
    name: '2号油罐',
    type: '地埋式',
    capacity: 30000,
    currentVolume: 22000,
    oilType: '95#汽油',
    status: '正常',
    lastCheckDate: '2023-02-15',
    station: '中石化XX加油站',
  },
  {
    id: 'T003',
    name: '3号油罐',
    type: '地埋式',
    capacity: 40000,
    currentVolume: 15000,
    oilType: '0#柴油',
    status: '维修中',
    lastCheckDate: '2023-01-20',
    station: '中石化XX加油站',
  },
  {
    id: 'T004',
    name: '4号油罐',
    type: '地埋式',
    capacity: 40000,
    currentVolume: 32000,
    oilType: '0#柴油',
    status: '正常',
    lastCheckDate: '2023-02-15',
    station: '中石化XX加油站',
  },
  {
    id: 'T005',
    name: '5号油罐',
    type: '地埋式',
    capacity: 20000,
    currentVolume: 8000,
    oilType: '98#汽油',
    status: '正常',
    lastCheckDate: '2023-02-15',
    station: '中石化XX加油站',
  },
];

const TankManagement = () => {
  const [tanks, setTanks] = useState(initialTanks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTank, setEditingTank] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredTanks, setFilteredTanks] = useState(initialTanks);

  useEffect(() => {
    const filtered = tanks.filter(
      (tank) =>
        tank.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tank.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
        tank.station.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTanks(filtered);
  }, [searchText, tanks]);

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
    <div className="tank-management">
      <Card
        title="油罐管理"
        extra={
          <Space>
            <Input
              placeholder="搜索油罐"
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
              新增油罐
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredTanks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </Card>

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
            rules={[{ required: true, message: '请输入所属加油站' }]}
          >
            <Input placeholder="请输入所属加油站" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TankManagement; 