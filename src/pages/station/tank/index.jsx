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
import { get } from '../../../utils/http';
import * as api from '../services/api';

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
    stationCode: station.stationCode,
    stationName: station.name,
    organizationId: station.branchId,
    organizationName: station.branchName
  }));
};

const TankManagement = () => {
  const [activeTab, setActiveTab] = useState('tankList');
  const [loading, setLoading] = useState(false);
  const [tankList, setTankList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [modifyRecords, setModifyRecords] = useState([]);
  const [filteredTankList, setFilteredTankList] = useState([]);
  const [filteredModifyRecords, setFilteredModifyRecords] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingTank, setEditingTank] = useState(null);
  const [viewingTank, setViewingTank] = useState(null);
  const [form] = Form.useForm();
  
  // 查看修改记录弹窗
  const [isViewRecordModalVisible, setIsViewRecordModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);

  // 组织结构树和筛选状态
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [selectedOilTypes, setSelectedOilTypes] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
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
      await loadTankList();
      await loadStationList();
      // 模拟API调用
      // await new Promise(resolve => setTimeout(resolve, 500));
      // setTankList(tankData.tanks || []);
      // setModifyRecords(tankData.modifyRecords || []);
      // setFilteredTankList(tankData.tanks || []);
      // setFilteredModifyRecords(tankData.modifyRecords || []);
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理查询
  const handleSearch = () => {
    loadTankList(1, 10, {
      stationId: selectedStation,
      oilType: selectedOilTypes[0],
      status: selectedStatuses[0],
      keyword:searchText
    });
  };

  const loadTankList = async (page = 1, pageSize = 10, filters = {}) => {
    setLoading(true);
    console.log(filters);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

      // 构建查询参数
      const params = {
        page,
        pageSize,
        ...filters
      };
      const response = await api.getOilTankList(params);
      if (response.success) {
        setTankList(response.data.list || []);
        setFilteredTankList(response.data.list || []);
      }

      
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStationList = async (page = 1, pageSize = 1000, filters = {}) => {
    try {
      // 构建查询参数
      const params = {
        page,
        pageSize,
        ...filters
      };
      const response = await api.getStationList(params);
      if (response.success) {
        setStationList(response.data.list || []);
      }
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  }

  const loadModifyRecordData = async (page = 1, pageSize = 10, filters = {}) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

      // 构建查询参数
      const params = {
        page,
        pageSize,
        ...filters
      };
      const response = await get('/microservice-station/api/tanks/modifyRecords', params);
      console.log(response);

      setModifyRecords(response.data || []);
      setFilteredModifyRecords(response.data || []);
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载油罐数据（用于批量导入后刷新）
  const loadTankData = () => {
    loadData();
  };

  // 筛选逻辑
  useEffect(() => {

    // // 按油品类型筛选
    // if (selectedOilTypes.length > 0) {
    //   filtered = filtered.filter(tank => selectedOilTypes.includes(tank.oilType));
    // }

    // // 按状态筛选
    // if (selectedStatuses.length > 0) {
    //   filtered = filtered.filter(tank => selectedStatuses.includes(tank.status));
    // }

    // // 按关键字筛选
    // if (searchText) {
    //   filtered = filtered.filter(tank =>
    //     (tank.tankCode && tank.tankCode.toLowerCase().includes(searchText.toLowerCase())) ||
    //     tank.tankName.toLowerCase().includes(searchText.toLowerCase()) ||
    //     tank.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
    //     tank.oilType.toLowerCase().includes(searchText.toLowerCase())
    //   );
    // }

    // setFilteredTankList(filtered);
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
    setSelectedStation(null);
    setSelectedOilTypes([]);
    setSelectedStatuses([]);
    setSearchText('');
    handleSearch();
  };



  // 打开新增/编辑弹窗
  const openTankModal = (tank = null) => {
    setEditingTank(tank);
    setIsModalVisible(true);
    if (tank) {
      form.setFieldsValue({
        ...tank,
        stationId: tank.stationId,
        thresholds: tank.thresholds || {
          minLevelAlarm: 0,
          minLevelDeviation: 0,
          maxLevelAlarm: 0,
          maxLevelDeviation: 0,
          waterLevelAlarm: 0,
          waterLevelDeviation: 0
        }
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

  // 查看修改记录详情
  const showViewRecordModal = (record) => {
    setViewingRecord(record);
    setIsViewRecordModalVisible(true);
  };

  const handleViewRecordCancel = () => {
    setIsViewRecordModalVisible(false);
    setViewingRecord(null);
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
        currentVolume: editingTank ? editingTank.currentVolume : 0,
        createTime: editingTank ? editingTank.createTime : new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      };

      if (editingTank) {
        console.log(tankInfo);
        // 编辑
        const response = await api.updateOilTank(tankInfo);
        if (response.success) {
          loadTankList();
        }
        // 编辑
        // const updatedList = tankList.map(tank => 
        //   tank.id === editingTank.id ? tankInfo : tank
        // );
        // setTankList(updatedList);
        // setFilteredTankList(updatedList);
        // message.success('油罐信息更新成功');
      } else {
        console.log(tankInfo);
        // 新增
        const response = await api.addOilTank(tankInfo);
        if (response.success) {
          loadTankList();
        }

        // const newList = [...tankList, tankInfo];
        // setTankList(newList);
        // setFilteredTankList(newList);
        message.success('油罐添加成功');
      }
      
      // closeModal();
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
        let data = {
          id: tank.id,
          reason: '删除'
        }
        api.delOilTank(data).then(res => {
          if (res.success) {
            loadTankList();
          }
        }).catch(err => {
          message.error('删除失败');
        })
        // const updatedList = tankList.filter(item => item.id !== tank.id);
        // setTankList(updatedList);
        // setFilteredTankList(updatedList);
        // message.success('删除成功');
      }
    });
  };

  // 油罐列表表格列定义
  const tankColumns = [
    {
      title: '油罐编号',
      dataIndex: 'tankCode',
      key: 'tankCode',
      width: 130,
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
      width: 120,
      render: (text) => (
        <Tag color={text.includes('92#') ? 'green' : text.includes('95#') ? 'blue' : text.includes('98#') ? 'purple' : text.includes('0#') ? 'orange' : 'default'}>
          {text}
        </Tag>
      )
    },
    {
      title: '最大罐容(L)',
      dataIndex: 'maxCapacity',
      key: 'maxCapacity',
      width: 120,
      render: (text) => text ? text.toLocaleString() : '-'
    },
    {
      title: '设计罐容(L)',
      dataIndex: 'designCapacity',
      key: 'designCapacity',
      width: 120,
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
      title: '默认密度(g/ml)',
      dataIndex: 'defaultDensity',
      key: 'defaultDensity',
      width: 130
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
      title: '油罐编号',
      dataIndex: 'tankCode',
      key: 'tankCode',
      width: 130
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
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 120,
      render: (text) => (
        <Tag color={text === '新增' ? 'green' : text === '编辑' ? 'blue' : text === '维护' ? 'orange' : 'default'}>
          {text}
        </Tag>
      )
    },
    {
      title: '操作描述',
      dataIndex: 'description',
      key: 'description',
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
      title: '变更内容',
      dataIndex: 'changes',
      key: 'changes',
      width: 250,
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
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
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
                    <Select placeholder="请选择油站" allowClear style={{ width: 200 }} value={selectedStation} onChange={setSelectedStation}>
                      {stationList.map(station => (
                        <Option key={station.id} value={station.id}>{station.stationName}</Option>
                      ))}
                    </Select>
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
                      <Option value="92#汽油">92#汽油</Option>
                      <Option value="95#汽油">95#汽油</Option>
                      <Option value="98#汽油">98#汽油</Option>
                      <Option value="0#柴油">0#柴油</Option>
                      <Option value="-10#柴油">-10#柴油</Option>
                      <Option value="尿素">尿素</Option>
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
                      <Option value="1">正常</Option>
                      <Option value="2">维护中</Option>
                      <Option value="3">停用</Option>
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
                      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
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
                      <Upload 
                        {...{
                          name: 'file',
                          action: '/api/upload/tank-batch',
                          headers: {
                            authorization: 'authorization-text',
                          },
                          onChange: (info) => {
                            if (info.file.status === 'done') {
                              message.success(`${info.file.name} 批量导入成功`);
                              loadTankData();
                            } else if (info.file.status === 'error') {
                              message.error(`${info.file.name} 批量导入失败`);
                            }
                          },
                          beforeUpload: (file) => {
                            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                                           file.type === 'application/vnd.ms-excel';
                            if (!isExcel) {
                              message.error('只能上传Excel文件!');
                            }
                            return isExcel;
                          },
                          showUploadList: false
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          批量导入
                        </Button>
                      </Upload>
                      <Button 
                        type="link" 
                        icon={<DownloadOutlined />}
                        onClick={() => message.info('开始下载油罐数据导入模板')}
                      >
                        下载模板
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
        width={900}
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
                name="tankCode"
                label="油罐编号"
              >
                <Input placeholder="系统自动生成" disabled />
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
                <Select placeholder="请选择油站">
                  {stationList.map(station => (
                    <Option key={station.id} value={station.id}>{station.stationName}</Option>
                  ))}
                </Select>
                {/* <TreeSelect
                  placeholder="请选择油站"
                  treeData={buildStationTreeData()}
                  showSearch
                  treeDefaultExpandAll
                  onChange={(value, node, extra) => {
                    // 自动生成油罐编号
                    if (value && node?.stationCode) {
                      const tanks = tankData.tanks?.filter(t => t.stationCode === node.stationCode) || [];
                      const maxTankNumber = tanks.length > 0 
                        ? Math.max(...tanks.map(t => parseInt(t.tankCode?.slice(-3)) || 0))
                        : 0;
                      const newTankNumber = (maxTankNumber + 1).toString().padStart(3, '0');
                      const newTankCode = `${node.stationCode.slice(0, 4)}TANK${newTankNumber}`;
                      form.setFieldsValue({ tankCode: newTankCode });
                    }
                  }}
                /> */}
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  <Option value="尿素">尿素</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maxCapacity"
                label="最大罐容(L)"
                rules={[{ required: true, message: '请输入最大罐容' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入最大罐容"
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="designCapacity"
                label="设计罐容(L)"
                rules={[{ required: true, message: '请输入设计罐容' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入设计罐容"
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="defaultDensity"
                label="默认密度(g/ml)"
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
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="levelMeterInterface"
                label="液位仪接口"
                rules={[{ required: true, message: '请选择液位仪接口' }]}
              >
                <Select 
                  placeholder="请选择液位仪接口"
                  onChange={(value) => {
                    // 如果选择网口，清空波特率
                    if (value === '网口') {
                      form.setFieldsValue({ baudRate: null });
                    }
                  }}
                >
                  <Option value="串口">串口</Option>
                  <Option value="网口">网口</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="baudRate"
                label="波特率(Hz)"
                dependencies={['levelMeterInterface']}
              >
                {({ getFieldValue }) => {
                  const interfaceType = getFieldValue('levelMeterInterface');
                  return (
                    <Select 
                      placeholder="请选择波特率"
                      disabled={interfaceType !== '串口'}
                    >
                      <Option value={10000}>10000 Hz</Option>
                      <Option value={12000}>12000 Hz</Option>
                      <Option value={15000}>15000 Hz</Option>
                    </Select>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="levelMeterBrand"
                label="液位仪品牌"
                rules={[{ required: true, message: '请输入液位仪品牌' }]}
              >
                <Input placeholder="请输入液位仪品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="1">正常</Option>
                  <Option value="2">维护中</Option>
                  <Option value="3">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tankCapacityTableFile"
            label="油罐容积表"
          >
            <Space>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传容积表</Button>
              </Upload>
              <Button 
                type="link" 
                icon={<DownloadOutlined />}
                onClick={() => message.info('开始下载罐容表模板')}
              >
                下载模板
              </Button>
            </Space>
            <div style={{ marginTop: 8, color: '#666' }}>
              支持上传Excel格式的罐容表文件
            </div>
          </Form.Item>

          {/* 油罐阈值设置 */}
          <div style={{ marginTop: 24, marginBottom: 16 }}>
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              油罐阈值设置
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name={['thresholds', 'minLevelAlarm']}
                      label="最低液位告警(cm)"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['thresholds', 'minLevelDeviation']}
                      label="偏差量(cm)"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              
              <Col span={12}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name={['thresholds', 'maxLevelAlarm']}
                      label="最高液位告警(cm)"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['thresholds', 'maxLevelDeviation']}
                      label="偏差量(cm)"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              
              <Col span={12}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name={['thresholds', 'waterLevelAlarm']}
                      label="水高告警(cm)"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['thresholds', 'waterLevelDeviation']}
                      label="水高偏差量(cm)"
                      initialValue={0}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

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
        width={900}
      >
        {viewingTank && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="油罐编号">{viewingTank.tankCode}</Descriptions.Item>
              <Descriptions.Item label="油罐名称">{viewingTank.tankName}</Descriptions.Item>
              <Descriptions.Item label="所属油站">{viewingTank.stationName}</Descriptions.Item>
              <Descriptions.Item label="所属组织">{viewingTank.organizationName}</Descriptions.Item>
              <Descriptions.Item label="油品类型">
                <Tag color={viewingTank.oilType?.includes('92#') ? 'green' : viewingTank.oilType?.includes('95#') ? 'blue' : viewingTank.oilType?.includes('98#') ? 'purple' : viewingTank.oilType?.includes('0#') ? 'orange' : 'default'}>
                  {viewingTank.oilType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="最大罐容">{viewingTank.maxCapacity?.toLocaleString()} L</Descriptions.Item>
              <Descriptions.Item label="设计罐容">{viewingTank.designCapacity?.toLocaleString()} L</Descriptions.Item>
              <Descriptions.Item label="当前存量">{viewingTank.currentVolume?.toLocaleString()} L</Descriptions.Item>
              <Descriptions.Item label="默认密度">{viewingTank.defaultDensity} {viewingTank.densityUnit}</Descriptions.Item>
              <Descriptions.Item label="液位仪接口">{viewingTank.levelMeterInterface}</Descriptions.Item>
              <Descriptions.Item label="波特率">{viewingTank.baudRate ? `${viewingTank.baudRate} Hz` : '-'}</Descriptions.Item>
              <Descriptions.Item label="液位仪品牌">{viewingTank.levelMeterBrand}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={viewingTank.status === '正常' ? 'green' : viewingTank.status === '维护中' ? 'orange' : 'red'}>
                  {viewingTank.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="油罐容积表">
                {viewingTank.tankCapacityTableFile ? (
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => message.info('开始下载罐容表文件')}
                  >
                    {viewingTank.tankCapacityTableFile}
                  </Button>
                ) : '未上传'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{viewingTank.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{viewingTank.updateTime}</Descriptions.Item>
            </Descriptions>

            {/* 油罐阈值信息 */}
            <div style={{ marginTop: 24 }}>
              <div style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                marginBottom: 16,
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: 8
              }}>
                油罐阈值设置
              </div>
              <Descriptions column={3} bordered size="small">
                <Descriptions.Item label="最低液位告警">{viewingTank.thresholds?.minLevelAlarm || 0} cm</Descriptions.Item>
                <Descriptions.Item label="最低液位偏差">{viewingTank.thresholds?.minLevelDeviation || 0} cm</Descriptions.Item>
                <Descriptions.Item label="最高液位告警">{viewingTank.thresholds?.maxLevelAlarm || 0} cm</Descriptions.Item>
                <Descriptions.Item label="最高液位偏差">{viewingTank.thresholds?.maxLevelDeviation || 0} cm</Descriptions.Item>
                <Descriptions.Item label="水高告警">{viewingTank.thresholds?.waterLevelAlarm || 0} cm</Descriptions.Item>
                <Descriptions.Item label="水高偏差">{viewingTank.thresholds?.waterLevelDeviation || 0} cm</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
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
              <Descriptions.Item label="油罐编号">{viewingRecord.tankCode}</Descriptions.Item>
              <Descriptions.Item label="油罐名称">{viewingRecord.tankName}</Descriptions.Item>
              <Descriptions.Item label="所属油站">{viewingRecord.stationName}</Descriptions.Item>
              <Descriptions.Item label="操作类型">
                <Tag color={viewingRecord.operationType === '新增' ? 'green' : viewingRecord.operationType === '编辑' ? 'blue' : viewingRecord.operationType === '维护' ? 'orange' : 'default'}>
                  {viewingRecord.operationType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作人">{viewingRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="操作时间">{viewingRecord.operateTime}</Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Tag color={viewingRecord.approvalStatus === '已审批' ? 'green' : viewingRecord.approvalStatus === '审批中' ? 'orange' : 'red'}>
                  {viewingRecord.approvalStatus}
                </Tag>
              </Descriptions.Item>
              {viewingRecord.approver && (
                <Descriptions.Item label="审批人">{viewingRecord.approver}</Descriptions.Item>
              )}
              {viewingRecord.approvalTime && (
                <Descriptions.Item label="审批时间">{viewingRecord.approvalTime}</Descriptions.Item>
              )}
              <Descriptions.Item label="操作描述" span={2}>{viewingRecord.description}</Descriptions.Item>
              <Descriptions.Item label="变更内容" span={2}>{viewingRecord.changes}</Descriptions.Item>
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

export default TankManagement;