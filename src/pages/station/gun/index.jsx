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
  InputNumber,
  Popconfirm,
  Descriptions
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './index.css';

// 引入模拟数据
import gunDataSource from '../../../mock/station/gunData.json';
import stationDataSource from '../../../mock/station/stationData.json';
import tankDataSource from '../../../mock/station/tankData.json';
import changeRecordDataSource from '../../../mock/station/gunChangeRecord.json';
import equipmentDataSource from '../../../mock/station/equipmentData.json';
import * as api from '../services/api';

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
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingGun, setEditingGun] = useState(null);
  const [viewingGun, setViewingGun] = useState(null);
  const [form] = Form.useForm();

  // 集线器配置相关状态
  const [isVhubModalVisible, setIsVhubModalVisible] = useState(false);
  const [vhubForm] = Form.useForm();
  
  // 查看修改记录弹窗
  const [isViewRecordModalVisible, setIsViewRecordModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);

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

    // 获取油枪列表
    getGunList();
    getTankList();

    // 构建油罐选项
    // const buildTankOptions = () => {
    //   const options = tankDataSource.tanks.map(tank => ({
    //     value: tank.id,
    //     label: `${tank.name} (${tank.oilType}) - ${tank.stationName}`,
    //     stationId: tank.stationId,
    //     oilType: tank.oilType,
    //     tankCode: tank.tankCode
    //   }));
    //   console.log(options);
    //   setTankOptions(options);
    // };

    buildOrgTreeData();
    // buildTankOptions();
  }, []);

    // 获取油枪列表
  const getGunList = async () => {
    const res = await api.getOilGunList();
    if (res.success) {
      setGuns(res.data.list);
      setFilteredGuns(res.data.list);
    }
  };

  // 获取油罐详情
  const getTankList = async () => {
    const res = await api.getOilTankList();
    if (res.success) {
      setTankOptions(res.data.list);
    }
  };

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
      filtered = filtered.filter(gun => selectedBrands.includes(gun.deviceCode));
    }

    // 按状态筛选
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(gun => selectedStatuses.includes(gun.status));
    }

    // 按关键字筛选
    if (searchText) {
      filtered = filtered.filter(gun =>
        gun.name.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.gunCode.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.oilType.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
        gun.deviceCode.toLowerCase().includes(searchText.toLowerCase())
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

  const showViewModal = (record) => {
    setViewingGun(record);
    setIsViewModalVisible(true);
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

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewingGun(null);
  };

  // 根据选择的油站筛选油罐
  const getFilteredTanks = (stationId) => {
    return tankOptions.filter(tank => tank.stationId === stationId);
  };

  // 根据选择的油罐设置油品类型
  const handleTankChange = (tankId) => {
    const selectedTank = tankOptions.find(tank => tank.value === tankId);
    if (selectedTank) {
      form.setFieldsValue({
        oilType: selectedTank.oilType,
        tankCode: selectedTank.tankCode
      });
    }
  };

  // 生成油枪编号
  const generateGunCode = (stationId) => {
    const station = stationDataSource.stations.find(s => s.id === stationId);
    const stationCode = station?.code || '0001';
    const existingGuns = guns.filter(gun => gun.stationId === stationId);
    const nextNumber = existingGuns.length + 1;
    return `${stationCode}GUN${String(nextNumber).padStart(3, '0')}`;
  };

  // 根据油站获取设备选项
  const getDevicesByStation = (stationId) => {
    return equipmentDataSource.devices.filter(device => 
      device.stationId === stationId && device.deviceType === '加油机'
    );
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
          const selectedDevice = equipmentDataSource.devices.find(d => d.deviceCode === values.deviceCode);

          const newGun = {
            ...values,
            id: `G${String(guns.length + 1).padStart(3, '0')}`,
            gunCode: generateGunCode(values.stationId),
            stationCode: selectedStation.code,
            stationName: selectedStation.name,
            branchId: selectedStation.branchId,
            branchName: selectedStation.branchName,
            tankName: selectedTank?.label.split(' (')[0] || '',
            tankCode: selectedTank?.tankCode || '',
            oilCode: values.oilType === '92#汽油' ? '92' : 
                     values.oilType === '95#汽油' ? '95' : 
                     values.oilType === '98#汽油' ? '98' : 
                     values.oilType === '0#柴油' ? '0' : 'UF',
            installDate: new Date().toISOString().split('T')[0],
            lastMaintenance: new Date().toISOString().split('T')[0],
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            vhubConfig: {
              channelNumber: 1,
              mainboardCode: `MB${String(guns.length + 1).padStart(3, '0')}`,
              hubSerialPort: 'COM1',
              hubPortNumber: 'PORT1',
              connectionType: '直连',
              pumpCodeMillions: 0,
              currentStatus: '在线'
            }
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

  // 集线器V-Hub配置
  const showVhubConfigModal = () => {
    setIsVhubModalVisible(true);
  };

  const handleVhubCancel = () => {
    setIsVhubModalVisible(false);
    vhubForm.resetFields();
  };

  const handleVhubSubmit = () => {
    vhubForm.validateFields().then((values) => {
      console.log('V-Hub配置数据:', values);
      message.success('V-Hub配置保存成功');
      setIsVhubModalVisible(false);
      vhubForm.resetFields();
    });
  };

  // 查看修改记录详情
  const showViewRecordModal = (record) => {
    setViewingRecord(record);
    setIsViewRecordModalVisible(true);
  };

  const handleViewRecordCancel = () => {
    setIsViewRecordModalVisible(false);
    setViewingRecord(null);
  };

  // 油枪列表表格列定义
  const gunColumns = [
    {
      title: '油枪编号',
      dataIndex: 'gunCode',
      key: 'gunCode',
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
      title: 'POS显示ID',
      dataIndex: 'posDisplayId',
      key: 'posDisplayId',
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
      dataIndex: 'tankCode',
      key: 'tankCode',
      width: 120
    },
    {
      title: '油机编号',
      dataIndex: 'deviceCode',
      key: 'deviceCode',
      width: 120
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
      title: '最近维护',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个油枪吗？"
            onConfirm={() => showDeleteConfirm(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
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
          onClick={() => showViewRecordModal(record)}
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
          <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                新增油枪
              </Button>
              <Button type="primary" icon={<SettingOutlined />} onClick={showVhubConfigModal}>
                V-Hub配置
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
                name="gunCode"
                label="油枪编号"
              >
                <Input placeholder="系统自动生成" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="油枪名称"
                rules={[{ required: true, message: '请输入油枪名称' }]}
              >
                <Input placeholder="请输入油枪名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                  onChange={(value) => {
                    if (!editingGun) {
                      form.setFieldsValue({
                        gunCode: generateGunCode(value)
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="posDisplayId"
                label="POS显示ID"
                rules={[{ required: true, message: '请输入POS显示ID' }]}
              >
                <InputNumber
                  placeholder="请输入POS显示ID"
                  min={1}
                  max={99}
                  style={{ width: '100%' }}
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
                name="deviceCode"
                label="关联油机编号"
                rules={[{ required: true, message: '请选择关联油机编号' }]}
              >
                <Select
                  placeholder="请选择关联油机编号"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {form.getFieldValue('stationId') &&
                    getDevicesByStation(form.getFieldValue('stationId')).map(device => (
                      <Option key={device.deviceCode} value={device.deviceCode}>
                        {device.deviceCode} - {device.deviceName}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="油枪状态"
                rules={[{ required: true, message: '请选择油枪状态' }]}
              >
                <Select placeholder="请选择油枪状态">
                  {gunStatuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看油枪详情弹窗 */}
      <Modal
        title="油枪详情"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {viewingGun && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div><strong>油枪编号：</strong>{viewingGun.gunCode}</div>
              </Col>
              <Col span={12}>
                <div><strong>油枪名称：</strong>{viewingGun.name}</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div><strong>POS显示ID：</strong>{viewingGun.posDisplayId}</div>
              </Col>
              <Col span={12}>
                <div><strong>油品类型：</strong>{viewingGun.oilType}</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div><strong>关联油罐：</strong>{viewingGun.tankCode}</div>
              </Col>
              <Col span={12}>
                <div><strong>关联油机：</strong>{viewingGun.deviceCode}</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div><strong>油枪状态：</strong>
                  <Tag color={viewingGun.status === '正常' ? 'green' : viewingGun.status === '维修中' ? 'orange' : 'red'}>
                    {viewingGun.status}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div><strong>所属加油站：</strong>{viewingGun.stationName}</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div><strong>所属分公司：</strong>{viewingGun.branchName}</div>
              </Col>
              <Col span={12}>
                <div><strong>安装日期：</strong>{viewingGun.installDate}</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div><strong>最近维护：</strong>{viewingGun.lastMaintenance}</div>
              </Col>
              <Col span={12}>
                <div><strong>创建时间：</strong>{viewingGun.createTime}</div>
              </Col>
            </Row>
            
            {/* V-Hub配置信息 */}
            {viewingGun.vhubConfig && (
              <>
                <div style={{ marginTop: 24, marginBottom: 16 }}>
                  <strong>V-Hub配置信息</strong>
                </div>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <div><strong>通道号：</strong>{viewingGun.vhubConfig.channelNumber}</div>
                  </Col>
                  <Col span={12}>
                    <div><strong>主板编号：</strong>{viewingGun.vhubConfig.mainboardCode}</div>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <div><strong>串口端口：</strong>{viewingGun.vhubConfig.hubSerialPort} - {viewingGun.vhubConfig.hubPortNumber}</div>
                  </Col>
                  <Col span={12}>
                    <div><strong>连接方式：</strong>{viewingGun.vhubConfig.connectionType}</div>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <div><strong>泵码数百万位：</strong>{viewingGun.vhubConfig.pumpCodeMillions}</div>
                  </Col>
                  <Col span={12}>
                    <div><strong>当前状态：</strong>
                      <Tag color={viewingGun.vhubConfig.currentStatus === '在线' ? 'green' : 'red'}>
                        {viewingGun.vhubConfig.currentStatus}
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 集线器V-Hub配置弹窗 */}
      <Modal
        title="集线器V-Hub配置"
        open={isVhubModalVisible}
        onCancel={handleVhubCancel}
        footer={[
          <Button key="cancel" onClick={handleVhubCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleVhubSubmit}>
            保存配置
          </Button>,
        ]}
        width={1000}
      >
        <Table
          dataSource={filteredGuns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1200 }}
          columns={[
            {
              title: '油枪编号',
              dataIndex: 'gunCode',
              key: 'gunCode',
              width: 120,
              fixed: 'left'
            },
            {
              title: '油品编号',
              dataIndex: 'oilCode',
              key: 'oilCode',
              width: 100
            },
            {
              title: '油品名称',
              dataIndex: 'oilType',
              key: 'oilType',
              width: 100
            },
            {
              title: '油罐编号',
              dataIndex: 'tankCode',
              key: 'tankCode',
              width: 120
            },
            {
              title: '通道号',
              dataIndex: ['vhubConfig', 'channelNumber'],
              key: 'channelNumber',
              width: 80,
              render: (text, record) => (
                <InputNumber
                  value={text}
                  min={1}
                  max={99}
                  size="small"
                  style={{ width: '100%' }}
                />
              )
            },
            {
              title: '加油机主板编号',
              dataIndex: ['vhubConfig', 'mainboardCode'],
              key: 'mainboardCode',
              width: 140,
              render: (text) => (
                <Input
                  value={text}
                  size="small"
                  style={{ width: '100%' }}
                />
              )
            },
            {
              title: '串口端口',
              key: 'hubPort',
              width: 150,
              render: (text, record) => (
                <Input
                  value={`${record.vhubConfig.hubSerialPort}-${record.vhubConfig.hubPortNumber}`}
                  placeholder="COM1-PORT1"
                  size="small"
                  style={{ width: '100%' }}
                />
              )
            },
            {
              title: '连接方式',
              dataIndex: ['vhubConfig', 'connectionType'],
              key: 'connectionType',
              width: 100,
              render: (text) => (
                <Select
                  value={text}
                  size="small"
                  style={{ width: '100%' }}
                >
                  <Option value="直连">直连</Option>
                  <Option value="侦听">侦听</Option>
                </Select>
              )
            },
            {
              title: '泵码数百万位数值',
              dataIndex: ['vhubConfig', 'pumpCodeMillions'],
              key: 'pumpCodeMillions',
              width: 130,
              render: (text) => (
                <InputNumber
                  value={text}
                  min={0}
                  max={999}
                  size="small"
                  style={{ width: '100%' }}
                />
              )
            },
            {
              title: '当前状态',
              dataIndex: ['vhubConfig', 'currentStatus'],
              key: 'currentStatus',
              width: 100,
              render: (text) => {
                const color = text === '在线' ? 'green' : 'red';
                return <Tag color={color}>{text}</Tag>;
              }
            }
          ]}
        />
      </Modal>

      {/* 查看修改记录详情弹窗 */}
      <Modal
        title="修改记录详情"
        open={isViewRecordModalVisible}
        onCancel={handleViewRecordCancel}
        footer={[
          <Button key="close" onClick={handleViewRecordCancel}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {viewingRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="油枪名称">{viewingRecord.gunName}</Descriptions.Item>
              <Descriptions.Item label="加油站">{viewingRecord.stationName}</Descriptions.Item>
              <Descriptions.Item label="分公司">{viewingRecord.branchName}</Descriptions.Item>
              <Descriptions.Item label="变更类型">
                <Tag color="blue">{viewingRecord.changeType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="变更前">{viewingRecord.oldValue}</Descriptions.Item>
              <Descriptions.Item label="变更后">{viewingRecord.newValue}</Descriptions.Item>
              <Descriptions.Item label="变更原因">{viewingRecord.changeReason}</Descriptions.Item>
              <Descriptions.Item label="操作人">{viewingRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="变更时间">{viewingRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Tag color={viewingRecord.approvalStatus === '已审批' ? 'green' : viewingRecord.approvalStatus === '审批中' ? 'orange' : 'red'}>
                  {viewingRecord.approvalStatus}
                </Tag>
              </Descriptions.Item>
              {viewingRecord.approvalTime && (
                <Descriptions.Item label="审批时间">{viewingRecord.approvalTime}</Descriptions.Item>
              )}
              {viewingRecord.approver && (
                <Descriptions.Item label="审批人">{viewingRecord.approver}</Descriptions.Item>
              )}
              {viewingRecord.approvalRemark && (
                <Descriptions.Item label="审批备注" span={2}>{viewingRecord.approvalRemark}</Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GunManagement; 