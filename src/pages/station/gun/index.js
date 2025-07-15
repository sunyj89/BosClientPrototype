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
  Tag,
  TreeSelect,
  Row,
  Col,
  Tabs,
  Spin,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import './index.css';

// 引入模拟数据
import gunDataSource from '../../../mock/station/gunData.json';
import stationDataSource from '../../../mock/station/stationData.json';
import tankDataSource from '../../../mock/station/tankData.json';
import changeRecordDataSource from '../../../mock/station/gunChangeRecord.json';

const { Option } = Select;
const { confirm } = Modal;
const { SHOW_PARENT } = TreeSelect;

// 加油机品牌列表
const deviceBrands = ['正星', '托肯', '吉尔巴克', '恒山', '蓝峰', '稳牌'];

// 油品类型列表
const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油', '-10#柴油', '尿素'];

// 油枪状态列表
const gunStatuses = ['正常', '维修中', '停用'];

const GunManagement = () => {
  const [activeTab, setActiveTab] = useState('gunList');
  const [loading, setLoading] = useState(false);

  // 油枪列表相关状态
  const [guns, setGuns] = useState(gunDataSource.guns);
  const [filteredGuns, setFilteredGuns] = useState(gunDataSource.guns);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGun, setEditingGun] = useState(null);
  const [form] = Form.useForm();

  // 修改记录相关状态
  const [changeRecords, setChangeRecords] = useState(changeRecordDataSource.changeRecords);
  const [filteredChangeRecords, setFilteredChangeRecords] = useState(changeRecordDataSource.changeRecords);

  // 筛选相关状态
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [tankOptions, setTankOptions] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchText, setSearchText] = useState('');

  // 修改记录筛选状态
  const [recordSearchText, setRecordSearchText] = useState('');
  const [selectedChangeTypes, setSelectedChangeTypes] = useState([]);

  // 初始化数据
  useEffect(() => {
    // 构建组织树数据
    const buildOrgTreeData = () => {
      const branches = {};

      // 按分公司分组
      stationDataSource.stations.forEach(station => {
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

    // 构建油罐选项
    const buildTankOptions = () => {
      const options = tankDataSource.tanks.map(tank => ({
        value: tank.id,
        label: `${tank.name} (${tank.oilType}) - ${tank.stationName}`,
        stationId: tank.stationId,
        oilType: tank.oilType,
        defaultDensity: tank.defaultDensity
      }));
      setTankOptions(options);
    };

    buildOrgTreeData();
    buildTankOptions();
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

    // 按状态筛选
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(gun => selectedStatuses.includes(gun.status));
    }

    // 按关键字筛选
    if (searchText) {
      filtered = filtered.filter(gun =>
        gun.name.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.gunId.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.deviceBrand.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.deviceModel.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredGuns(filtered);
  }, [selectedOrgs, selectedBrands, selectedStatuses, searchText, guns]);

  // 修改记录筛选逻辑
  useEffect(() => {
    let filtered = changeRecords;

    // 按变更类型筛选
    if (selectedChangeTypes.length > 0) {
      filtered = filtered.filter(record => selectedChangeTypes.includes(record.changeType));
    }

    // 按关键字筛选
    if (recordSearchText) {
      filtered = filtered.filter(record =>
        record.gunName.toLowerCase().includes(recordSearchText.toLowerCase()) ||
        record.stationName.toLowerCase().includes(recordSearchText.toLowerCase()) ||
        record.changeType.toLowerCase().includes(recordSearchText.toLowerCase()) ||
        record.operator.toLowerCase().includes(recordSearchText.toLowerCase())
      );
    }

    setFilteredChangeRecords(filtered);
  }, [selectedChangeTypes, recordSearchText, changeRecords]);

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 筛选处理函数
  const handleOrgChange = (value) => {
    setSelectedOrgs(value);
  };

  const handleBrandChange = (value) => {
    setSelectedBrands(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatuses(value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleResetFilter = () => {
    setSelectedOrgs([]);
    setSelectedBrands([]);
    setSelectedStatuses([]);
    setSearchText('');
  };

  // 修改记录筛选处理函数
  const handleRecordSearchChange = (e) => {
    setRecordSearchText(e.target.value);
  };

  const handleChangeTypeChange = (value) => {
    setSelectedChangeTypes(value);
  };

  const handleResetRecordFilter = () => {
    setRecordSearchText('');
    setSelectedChangeTypes([]);
  };

  // 油枪操作函数
  const showAddModal = () => {
    setEditingGun(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingGun(record);
    form.setFieldsValue({
      ...record,
      stationId: record.stationId
    });
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

  // 根据选择的油站筛选油罐
  const getFilteredTanks = (stationId) => {
    return tankOptions.filter(tank => tank.stationId === stationId);
  };

  // 根据选择的油罐设置默认密度
  const handleTankChange = (tankId) => {
    const selectedTank = tankOptions.find(tank => tank.value === tankId);
    if (selectedTank) {
      form.setFieldsValue({
        oilType: selectedTank.oilType,
        defaultDensity: selectedTank.defaultDensity
      });
    }
  };

  // 生成油枪ID
  const generateGunId = (stationId) => {
    const existingGuns = guns.filter(gun => gun.stationId === stationId);
    const nextNumber = existingGuns.length + 1;
    return `GUN-${stationId}-${String(nextNumber).padStart(3, '0')}`;
  };

  // 提交表单
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
          const selectedStation = stationDataSource.stations.find(s => s.id === values.stationId);
          const selectedTank = tankOptions.find(t => t.value === values.tankId);

          const newGun = {
            ...values,
            id: `G${String(guns.length + 1).padStart(3, '0')}`,
            gunId: generateGunId(values.stationId),
            stationName: selectedStation.name,
            branchId: selectedStation.branchId,
            branchName: selectedStation.branchName,
            tankName: selectedTank.label.split(' (')[0],
            installDate: new Date().toISOString().split('T')[0],
            lastMaintenance: new Date().toISOString().split('T')[0],
            createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
            updateTime: new Date().toISOString().replace('T', ' ').split('.')[0]
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

  // 油枪列表表格列定义
  const gunColumns = [
    {
      title: '油枪ID',
      dataIndex: 'gunId',
      key: 'gunId',
      width: 140,
      fixed: 'left'
    },
    {
      title: '油枪名称',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100
    },
    {
      title: '关联油罐',
      dataIndex: 'tankName',
      key: 'tankName',
      width: 100
    },
    {
      title: '默认密度',
      dataIndex: 'defaultDensity',
      key: 'defaultDensity',
      width: 100
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
      width: 180
    },
    {
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150
    },
    {
      title: '加油机品牌',
      dataIndex: 'deviceBrand',
      key: 'deviceBrand',
      width: 100
    },
    {
      title: '加油机编号',
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: 120
    },
    {
      title: '最近维护',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
      width: 120
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
            onClick={() => showDeleteConfirm(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 修改记录表格列定义
  const changeRecordColumns = [
    {
      title: '油枪名称',
      dataIndex: 'gunName',
      key: 'gunName',
      width: 120
    },
    {
      title: '加油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180
    },
    {
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 150
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '变更前',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 120
    },
    {
      title: '变更后',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 120
    },
    {
      title: '变更原因',
      dataIndex: 'changeReason',
      key: 'changeReason',
      width: 150
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160
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
      width: 80,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
        >
          查看
        </Button>
      ),
    },
  ];

  // 渲染油枪列表筛选区域
  const renderGunFilterForm = () => {
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
              placeholder="请选择品牌"
              allowClear
              style={{ width: '100%' }}
              value={selectedBrands}
              onChange={handleBrandChange}
            >
              {deviceBrands.map(brand => (
                <Option key={brand} value={brand}>{brand}</Option>
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
              {gunStatuses.map(status => (
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
              <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                新增油枪
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染修改记录筛选区域
  const renderRecordFilterForm = () => {
    const changeTypes = ['状态变更', '密度调整', '关联油罐变更', '设备更换', '型号变更', '新增油枪'];

    return (
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              mode="multiple"
              placeholder="请选择变更类型"
              allowClear
              style={{ width: '100%' }}
              value={selectedChangeTypes}
              onChange={handleChangeTypeChange}
            >
              {changeTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Input
              placeholder="请输入关键字"
              allowClear
              style={{ width: '100%' }}
              value={recordSearchText}
              onChange={handleRecordSearchChange}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleResetRecordFilter}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="gun-management-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            <Tabs.TabPane tab="油枪列表" key="gunList">
              {renderGunFilterForm()}
              <Table
                columns={gunColumns}
                dataSource={filteredGuns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1400 }}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab="修改记录" key="changeRecord">
              {renderRecordFilterForm()}
              <Table
                columns={changeRecordColumns}
                dataSource={filteredChangeRecords}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Card>

      {/* 新增/编辑油枪弹窗 */}
      <Modal
        title={editingGun ? '编辑油枪信息' : '新增油枪'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            {editingGun ? '保存' : '确定'}
          </Button>,
        ]}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="油枪名称"
                rules={[{ required: true, message: '请输入油枪名称' }]}
              >
                <Input placeholder="请输入油枪名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  disabled={!!editingGun}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tankId"
                label="关联油罐编号"
                rules={[{ required: true, message: '请选择关联油罐' }]}
              >
                <Select
                  placeholder="请选择关联油罐"
                  onChange={handleTankChange}
                >
                  {form.getFieldValue('stationId') &&
                    getFilteredTanks(form.getFieldValue('stationId')).map(tank => (
                      <Option key={tank.value} value={tank.value}>
                        {tank.label}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="oilType"
                label="油品类型"
                rules={[{ required: true, message: '请选择油品类型' }]}
              >
                <Select placeholder="请选择油品类型" disabled>
                  {oilTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultDensity"
                label="设定默认密度"
                rules={[{ required: true, message: '请输入默认密度' }]}
              >
                <InputNumber
                  placeholder="请输入默认密度"
                  min={0}
                  max={2}
                  step={0.001}
                  precision={3}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceModel"
                label="加油机型号"
                rules={[{ required: true, message: '请输入加油机型号' }]}
              >
                <Input placeholder="请输入加油机型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceId"
                label="加油机编号"
                rules={[{ required: true, message: '请输入加油机编号' }]}
              >
                <Input placeholder="请输入加油机编号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="加油机状态"
                rules={[{ required: true, message: '请选择加油机状态' }]}
              >
                <Select placeholder="请选择加油机状态">
                  {gunStatuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default GunManagement; 