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
  Upload,
  InputNumber,
  Spin,
  Descriptions,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import './index.css';
import tankData from '../../../mock/station/tankData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

// 构建用于TreeSelect的油站数据
const buildStationTreeData = () => {
  if (!stationData || !stationData.stations || stationData.stations.length === 0) {
    return [];
  }
  
  return stationData.stations.map(station => ({
    title: station.name,
    value: station.id,
    key: station.id,
    stationId: station.id,
    stationName: station.name,
    organizationId: station.branchId,
    organizationName: station.branchName
  }));
};

// 生成油枪选项数据
const generateGunOptions = () => {
  const guns = [];
  for (let i = 1; i <= 9; i++) {
    if (i <= 8) {
      guns.push({
        value: `G${String(i).padStart(3, '0')}`,
        label: `${i}号枪`
      });
    } else {
      guns.push({
        value: `G${String(i).padStart(3, '0')}`,
        label: '尿素枪'
      });
    }
  }
  return guns;
};

const TankManagement = () => {
  const [activeTab, setActiveTab] = useState('tankList');
  const [loading, setLoading] = useState(false);
  const [tankList, setTankList] = useState([]);
  const [modifyRecords, setModifyRecords] = useState([]);
  const [filteredTankList, setFilteredTankList] = useState([]);
  const [filteredModifyRecords, setFilteredModifyRecords] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingTank, setEditingTank] = useState(null);
  const [viewingTank, setViewingTank] = useState(null);
  const [form] = Form.useForm();

  // 组织结构树和筛选状态
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [selectedOilTypes, setSelectedOilTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchText, setSearchText] = useState('');

  // 初始化数据
  useEffect(() => {
    loadData();
    buildOrgTreeData();
  }, []);

  // 构建组织结构树数据
  const buildOrgTreeData = () => {
    if (!stationData || !stationData.stations) {
      return;
    }

    const branches = {};

    // 按分公司分组
    stationData.stations.forEach(station => {
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

  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setTankList(tankData.tankList || []);
      setModifyRecords(tankData.modifyRecords || []);
      setFilteredTankList(tankData.tankList || []);
      setFilteredModifyRecords(tankData.modifyRecords || []);
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 筛选逻辑
  useEffect(() => {
    let filtered = tankList;

    // 按组织筛选
    if (selectedOrgs.length > 0) {
      filtered = filtered.filter(tank => {
        return selectedOrgs.some(orgId => {
          return tank.stationId === orgId || tank.organizationId === orgId;
        });
      });
    }

    // 按油品类型筛选
    if (selectedOilTypes.length > 0) {
      filtered = filtered.filter(tank => selectedOilTypes.includes(tank.oilType));
    }

    // 按状态筛选
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(tank => selectedStatuses.includes(tank.status));
    }

    // 按关键字筛选
    if (searchText) {
      filtered = filtered.filter(tank =>
        tank.tankId.toLowerCase().includes(searchText.toLowerCase()) ||
        tank.tankName.toLowerCase().includes(searchText.toLowerCase()) ||
        tank.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
        tank.oilType.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredTankList(filtered);
  }, [selectedOrgs, selectedOilTypes, selectedStatuses, searchText, tankList]);

  // 筛选处理函数
  const handleOrgChange = (value) => {
    setSelectedOrgs(value || []);
  };

  const handleOilTypeChange = (value) => {
    setSelectedOilTypes(value || []);
  };

  const handleStatusChange = (value) => {
    setSelectedStatuses(value || []);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleResetFilter = () => {
    setSelectedOrgs([]);
    setSelectedOilTypes([]);
    setSelectedStatuses([]);
    setSearchText('');
  };



  // 打开新增/编辑弹窗
  const openTankModal = (tank = null) => {
    setEditingTank(tank);
    setIsModalVisible(true);
    if (tank) {
      form.setFieldsValue({
        ...tank,
        stationId: tank.stationId,
        associatedGuns: tank.associatedGuns || []
      });
    } else {
      form.resetFields();
    }
  };

  // 打开查看弹窗
  const openViewModal = (tank) => {
    setViewingTank(tank);
    setIsViewModalVisible(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setEditingTank(null);
    setViewingTank(null);
    form.resetFields();
  };

  // 保存油罐信息
  const handleSave = async (values) => {
    try {
      setLoading(true);
      
      // 获取选中油站的详细信息
      const selectedStation = stationData.stations?.find(station => station.id === values.stationId);
      
              const tankInfo = {
          ...values,
          id: editingTank ? editingTank.id : `T${String(tankList.length + 1).padStart(3, '0')}`,
          stationName: selectedStation ? selectedStation.name : '',
          organizationId: selectedStation ? selectedStation.branchId : '',
          organizationName: selectedStation ? selectedStation.branchName : '',
        associatedGunNames: values.associatedGuns ? values.associatedGuns.map(gunId => {
          const gunOption = generateGunOptions().find(gun => gun.value === gunId);
          return gunOption ? gunOption.label : gunId;
        }) : [],
        currentVolume: editingTank ? editingTank.currentVolume : 0,
        createTime: editingTank ? editingTank.createTime : new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      };

      if (editingTank) {
        // 编辑
        const updatedList = tankList.map(tank => 
          tank.id === editingTank.id ? tankInfo : tank
        );
        setTankList(updatedList);
        setFilteredTankList(updatedList);
        message.success('油罐信息更新成功');
      } else {
        // 新增
        const newList = [...tankList, tankInfo];
        setTankList(newList);
        setFilteredTankList(newList);
        message.success('油罐添加成功');
      }
      
      closeModal();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除油罐
  const handleDelete = (tank) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除油罐"${tank.tankName}"吗？`,
      onOk() {
        const updatedList = tankList.filter(item => item.id !== tank.id);
        setTankList(updatedList);
        setFilteredTankList(updatedList);
        message.success('删除成功');
      }
    });
  };

  // 油罐列表表格列定义
  const tankColumns = [
    {
      title: '油罐ID',
      dataIndex: 'tankId',
      key: 'tankId',
      width: 100,
      fixed: 'left'
    },
    {
      title: '油罐名称',
      dataIndex: 'tankName',
      key: 'tankName',
      width: 120
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 160
    },
    {
      title: '所属组织',
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: 140
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
      render: (text) => (
        <Tag color={text === '92#' ? 'green' : text === '95#' ? 'blue' : text === '98#' ? 'purple' : text === '0#' ? 'orange' : 'default'}>
          {text}
        </Tag>
      )
    },
    {
      title: '容量(L)',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (text) => text ? text.toLocaleString() : '-'
    },
    {
      title: '当前存量(L)',
      dataIndex: 'currentVolume',
      key: 'currentVolume',
      width: 120,
      render: (text) => text ? text.toLocaleString() : '-'
    },
    {
      title: '关联油枪',
      dataIndex: 'associatedGunNames',
      key: 'associatedGunNames',
      width: 120,
      render: (gunNames) => gunNames ? gunNames.join(', ') : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === '正常' ? 'green' : text === '维护中' ? 'orange' : 'red'}>
          {text}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openTankModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个油罐吗？"
            onConfirm={() => handleDelete(record)}
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
      )
    }
  ];

  // 修改记录表格列定义
  const recordColumns = [
    {
      title: '油罐ID',
      dataIndex: 'tankId',
      key: 'tankId',
      width: 100
    },
    {
      title: '油罐名称',
      dataIndex: 'tankName',
      key: 'tankName',
      width: 120
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 160
    },
    {
      title: '修改类型',
      dataIndex: 'modifyType',
      key: 'modifyType',
      width: 120,
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '修改内容',
      dataIndex: 'modifyContent',
      key: 'modifyContent',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      title: '修改人',
      dataIndex: 'modifier',
      key: 'modifier',
      width: 100
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      width: 160
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === '已审批' ? 'green' : text === '审批中' ? 'orange' : 'red'}>
          {text}
        </Tag>
      )
    }
  ];

  // 文件上传属性
  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('只能上传Excel文件!');
      }
      return isExcel;
    }
  };

  return (
    <div className="tank-management-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            <TabPane tab="油罐列表" key="tankList">
              {/* 筛选区域 */}
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
                      placeholder="请选择油品类型"
                      allowClear
                      style={{ width: '100%' }}
                      value={selectedOilTypes}
                      onChange={handleOilTypeChange}
                    >
                      {tankData.oilTypes?.map(type => (
                        <Option key={type.value} value={type.value}>{type.label}</Option>
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
                      {tankData.tankStatuses?.map(status => (
                        <Option key={status.value} value={status.value}>{status.label}</Option>
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
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => openTankModal()}>
                        新增油罐
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* 油罐列表表格 */}
              <Table
                columns={tankColumns}
                dataSource={filteredTankList}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                  total: filteredTankList.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                }}
              />
            </TabPane>

            <TabPane tab="修改记录" key="modifyRecord">
              {/* 修改记录表格 */}
              <Table
                columns={recordColumns}
                dataSource={filteredModifyRecords}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                  total: filteredModifyRecords.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                }}
              />
            </TabPane>
          </Tabs>
        </Spin>
      </Card>

      {/* 新增/编辑油罐弹窗 */}
      <Modal
        title={editingTank ? '编辑油罐' : '新增油罐'}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tankId"
                label="油罐ID"
                rules={[{ required: true, message: '请输入油罐ID' }]}
              >
                <Input placeholder="请输入油罐ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tankName"
                label="油罐名称"
                rules={[{ required: true, message: '请输入油罐名称' }]}
              >
                <Input placeholder="请输入油罐名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stationId"
                label="所属油站"
                rules={[{ required: true, message: '请选择油站' }]}
              >
                <TreeSelect
                  placeholder="请选择油站"
                  treeData={buildStationTreeData()}
                  showSearch
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="oilType"
                label="油品类型"
                rules={[{ required: true, message: '请选择油品类型' }]}
              >
                <Select placeholder="请选择油品类型">
                  {tankData.oilTypes?.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="油罐容量(L)"
                rules={[{ required: true, message: '请输入油罐容量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入油罐容量"
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="associatedGuns"
                label="关联油枪"
                rules={[{ required: true, message: '请选择关联油枪' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择关联油枪"
                  options={generateGunOptions()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultDensity"
                label="默认密度"
                rules={[{ required: true, message: '请输入默认密度' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入默认密度"
                  min={0}
                  max={2}
                  step={0.001}
                  precision={3}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="levelMeterInterface"
                label="液位仪接口"
                rules={[{ required: true, message: '请选择液位仪接口' }]}
              >
                <Select placeholder="请选择液位仪接口">
                  {tankData.levelMeterInterfaces?.map(interfaceItem => (
                    <Option key={interfaceItem.value} value={interfaceItem.value}>
                      {interfaceItem.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="levelMeterBrand"
                label="液位仪品牌"
                rules={[{ required: true, message: '请选择液位仪品牌' }]}
              >
                <Select placeholder="请选择液位仪品牌">
                  {tankData.levelMeterBrands?.map(brand => (
                    <Option key={brand.value} value={brand.value}>
                      {brand.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  {tankData.tankStatuses?.map(status => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tankCapacityFile"
            label="罐容表文件"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>点击上传罐容表</Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#666' }}>
              支持上传Excel格式的罐容表文件
            </div>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={closeModal}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingTank ? '更新' : '保存'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看油罐详情弹窗 */}
      <Modal
        title="油罐详情"
        open={isViewModalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {viewingTank && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="油罐ID">{viewingTank.tankId}</Descriptions.Item>
            <Descriptions.Item label="油罐名称">{viewingTank.tankName}</Descriptions.Item>
            <Descriptions.Item label="所属油站">{viewingTank.stationName}</Descriptions.Item>
            <Descriptions.Item label="所属组织">{viewingTank.organizationName}</Descriptions.Item>
            <Descriptions.Item label="油品类型">
              <Tag color={viewingTank.oilType === '92#' ? 'green' : viewingTank.oilType === '95#' ? 'blue' : viewingTank.oilType === '98#' ? 'purple' : viewingTank.oilType === '0#' ? 'orange' : 'default'}>
                {viewingTank.oilType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="油罐容量">{viewingTank.capacity?.toLocaleString()} L</Descriptions.Item>
            <Descriptions.Item label="当前存量">{viewingTank.currentVolume?.toLocaleString()} L</Descriptions.Item>
            <Descriptions.Item label="关联油枪">{viewingTank.associatedGunNames?.join(', ')}</Descriptions.Item>
            <Descriptions.Item label="默认密度">{viewingTank.defaultDensity}</Descriptions.Item>
            <Descriptions.Item label="液位仪接口">{viewingTank.levelMeterInterface}</Descriptions.Item>
            <Descriptions.Item label="液位仪品牌">{viewingTank.levelMeterBrand}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={viewingTank.status === '正常' ? 'green' : viewingTank.status === '维护中' ? 'orange' : 'red'}>
                {viewingTank.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="罐容表文件">
              {viewingTank.tankCapacityFile ? (
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() => message.info('开始下载罐容表文件')}
                >
                  {viewingTank.tankCapacityFile}
                </Button>
              ) : '未上传'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{viewingTank.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{viewingTank.updateTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TankManagement; 