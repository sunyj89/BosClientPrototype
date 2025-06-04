import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Tag, Tooltip, TreeSelect, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import './index.css';
import orgDataSource from '../../../mock/station/orgData.json';

const { Option } = Select;
const { confirm } = Modal;
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
  
  // 筛选相关状态
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filterForm] = Form.useForm();

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

    setOrgTreeData(hardcodedTreeData);

    // 设置品牌选项
    const brandOpts = deviceBrands.map(brand => ({
      label: brand,
      value: brand
    }));
    setBrandOptions(brandOpts);
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = guns;

    // 按组织筛选
    if (selectedOrgs.length > 0) {
      filtered = filtered.filter(gun => {
        return selectedOrgs.some(orgId => {
          return gun.stationId === orgId || gun.branchId === orgId;
        });
      });
    }

    // 按品牌筛选
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(gun => selectedBrands.includes(gun.deviceBrand));
    }

    // 按关键字筛选
    if (searchText) {
      filtered = filtered.filter(gun =>
        gun.name.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.deviceBrand.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.deviceModel.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredGuns(filtered);
  }, [selectedOrgs, searchText, selectedBrands, guns]);

  const handleOrgChange = (value) => {
    setSelectedOrgs(value);
  };

  const handleBrandChange = (value) => {
    setSelectedBrands(value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleResetFilter = () => {
    filterForm.resetFields();
    setSelectedOrgs([]);
    setSelectedBrands([]);
    setSearchText('');
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

  const showDeleteConfirm = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除 ${record.name} 吗？`,
      onOk() {
        const updatedGuns = guns.filter(gun => gun.id !== record.id);
        setGuns(updatedGuns);
        message.success('删除成功');
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingGun(null);
    form.resetFields();
  };

  // 表格列定义
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
      render: (text) => {
        let color = 'green';
        if (text === '维修中') color = 'orange';
        else if (text === '停用') color = 'red';
        return <Tag color={color}>{text}</Tag>;
      },
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
      title: '最近维护',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
      width: 120,
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
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      
      setTimeout(() => {
        if (editingGun) {
          // 更新油枪
          const updatedGuns = guns.map(gun => 
            gun.id === editingGun.id ? { ...gun, ...values } : gun
          );
          setGuns(updatedGuns);
          message.success('修改成功');
        } else {
          // 添加新油枪
          const selectedStation = form.getFieldValue('stationId');
          const stationInfo = findStationInfo(selectedStation);
          
          const newGun = {
            ...values,
            id: `G${String(guns.length + 1).padStart(3, '0')}`,
            stationId: stationInfo.id,
            stationName: stationInfo.name,
            branchId: stationInfo.parentId,
            branchName: stationInfo.branchName,
          };
          
          setGuns([...guns, newGun]);
          message.success('新增成功');
        }
        setLoading(false);
        setIsModalVisible(false);
        setEditingGun(null);
        form.resetFields();
      }, 1000);
    }).catch((info) => {
      console.log('Validate Failed:', info);
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

  // 渲染筛选区域
  const renderFilterForm = () => {
    return (
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
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
          <Col span={6}>
            <Select
              mode="multiple"
              placeholder="请选择油机品牌"
              allowClear
              style={{ width: '100%' }}
              value={selectedBrands}
              onChange={handleBrandChange}
              options={brandOptions}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="请输入关键字"
              allowClear
              style={{ width: '100%' }}
              value={searchText}
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                新增油枪
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="gun-management-container">
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
            {editingGun ? '保存' : '确定'}
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
    </div>
  );
};

export default GunManagement; 