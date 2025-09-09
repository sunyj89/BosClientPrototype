import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  Space, 
  Modal, 
  message, 
  Tag, 
  TreeSelect,
  InputNumber,
  DatePicker,
  Descriptions,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import mockData from '../../../../mock/oil/oil-price.json';
import oilMasterData from '../../../../mock/oil/master-data.json';
import stationData from '../../../../mock/station/stationData.json';
import moment from 'moment';

const { Option } = Select;

const OilPriceManagement = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stationTreeData, setStationTreeData] = useState([]);
  const [oilOptions, setOilOptions] = useState([]);

  useEffect(() => {
    initializeData();
    loadData();
  }, []);

  // 初始化基础数据
  const initializeData = () => {
    // 构建油站树形数据
    const treeData = [
      {
        title: '江西交投化石能源公司',
        value: 'COMPANY',
        selectable: false,
        children: stationData.branches.map(branch => ({
          title: branch.name,
          value: branch.id,
          children: stationData.serviceAreas
            .filter(sa => sa.branchId === branch.id)
            .map(serviceArea => ({
              title: serviceArea.name,
              value: serviceArea.id,
              children: stationData.stations
                .filter(station => station.serviceAreaId === serviceArea.id)
                .map(station => ({
                  title: station.name,
                  value: station.id,
                  isLeaf: true
                }))
            }))
        }))
      }
    ];
    setStationTreeData(treeData);

    // 设置油品选项
    setOilOptions(oilMasterData.oilList);
  };

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(mockData.oilPriceList);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData.oilPriceList];
      
      if (values.stationId) {
        // 如果选择的是分公司或服务区，筛选其下所有油站
        if (values.stationId.startsWith('BR')) {
          const serviceAreas = stationData.serviceAreas.filter(sa => sa.branchId === values.stationId);
          const stationIds = stationData.stations
            .filter(station => serviceAreas.some(sa => sa.id === station.serviceAreaId))
            .map(station => station.id);
          filteredData = filteredData.filter(item => stationIds.includes(item.stationId));
        } else if (values.stationId.startsWith('SA')) {
          const stationIds = stationData.stations
            .filter(station => station.serviceAreaId === values.stationId)
            .map(station => station.id);
          filteredData = filteredData.filter(item => stationIds.includes(item.stationId));
        } else if (values.stationId !== 'COMPANY') {
          filteredData = filteredData.filter(item => item.stationId === values.stationId);
        }
      }
      
      if (values.oilName) {
        filteredData = filteredData.filter(item => 
          item.oilName.includes(values.oilName)
        );
      }
      
      if (values.oilType) {
        filteredData = filteredData.filter(item => 
          item.oilType === values.oilType
        );
      }
      
      if (values.priceConfig) {
        filteredData = filteredData.filter(item => 
          item.priceConfig === values.priceConfig
        );
      }
      
      if (values.priceStatus) {
        filteredData = filteredData.filter(item => 
          item.priceStatus === values.priceStatus
        );
      }
      
      if (values.approvalStatus) {
        filteredData = filteredData.filter(item => 
          item.approvalStatus === values.approvalStatus
        );
      }

      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    loadData();
  };

  const handleCreate = () => {
    setModalType('create');
    setSelectedRecord(null);
    setIsModalVisible(true);
    modalForm.resetFields();
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedRecord(record);
    setIsModalVisible(true);
    modalForm.setFieldsValue({
      ...record,
      effectiveTime: record.effectiveTime ? moment(record.effectiveTime) : null
    });
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleDelete = (record) => {
    if (record.approvalStatus === '审批中') {
      message.warning('审批中的价格不能删除');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除${record.stationName}的${record.oilName}价格吗？`,
      onOk() {
        setLoading(true);
        setTimeout(() => {
          // 如果是审批通过的价格，需要重新审批
          if (record.approvalStatus === '审批通过') {
            const updatedData = dataSource.map(item => 
              item.id === record.id 
                ? { ...item, approvalStatus: '审批中', priceStatus: '失效' }
                : item
            );
            setDataSource(updatedData);
            message.success('删除申请已提交，等待审批');
          } else {
            // 直接删除待提交或被驳回的价格
            const updatedData = dataSource.filter(item => item.id !== record.id);
            setDataSource(updatedData);
            message.success('删除成功');
          }
          setLoading(false);
        }, 500);
      }
    });
  };

  const handleModalOk = () => {
    modalForm.validateFields().then(values => {
      setLoading(true);
      setTimeout(() => {
        const formattedValues = {
          ...values,
          effectiveTime: values.effectiveTime ? values.effectiveTime.format('YYYY-MM-DD HH:mm:ss') : null
        };

        if (modalType === 'create') {
          const newRecord = {
            ...formattedValues,
            id: `OP${Date.now()}`,
            maintainTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            maintainer: '当前用户',
            approvalStatus: '待提交',
            priceStatus: '失效'
          };
          
          // 获取选中油站和油品的详细信息
          const selectedStation = stationData.stations.find(s => s.id === values.stationId);
          const selectedBranch = stationData.branches.find(b => 
            stationData.serviceAreas.some(sa => 
              sa.branchId === b.id && 
              stationData.stations.some(s => s.serviceAreaId === sa.id && s.id === values.stationId)
            )
          );
          const selectedOil = oilOptions.find(o => o.code === values.oilCode);
          
          if (selectedStation && selectedBranch && selectedOil) {
            newRecord.stationName = selectedStation.name;
            newRecord.branchName = selectedBranch.name;
            newRecord.branchId = selectedBranch.id;
            newRecord.oilName = selectedOil.name;
            newRecord.oilType = selectedOil.oilType;
          }
          
          setDataSource([...dataSource, newRecord]);
          message.success('创建成功，状态为待提交');
        } else if (modalType === 'edit') {
          const updatedData = dataSource.map(item => 
            item.id === selectedRecord.id 
              ? { 
                  ...item, 
                  ...formattedValues, 
                  maintainTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                  approvalStatus: selectedRecord.approvalStatus === '审批通过' ? '审批中' : selectedRecord.approvalStatus
                }
              : item
          );
          setDataSource(updatedData);
          message.success(
            selectedRecord.approvalStatus === '审批通过' 
              ? '编辑成功，已提交审批' 
              : '编辑成功'
          );
        }
        setIsModalVisible(false);
        setLoading(false);
      }, 800);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '生效':
        return 'green';
      case '失效':
        return 'red';
      default:
        return 'default';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case '审批通过':
        return 'green';
      case '审批中':
        return 'orange';
      case '被驳回':
        return 'red';
      case '待提交':
        return 'blue';
      default:
        return 'default';
    }
  };

  const isOperationDisabled = (record, operation) => {
    if (operation === 'edit' || operation === 'delete') {
      return record.approvalStatus === '审批中';
    }
    return false;
  };

  const columns = [
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 140,
      fixed: 'left'
    },
    {
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120
    },
    {
      title: '油品编号',
      dataIndex: 'oilCode',
      key: 'oilCode',
      width: 100
    },
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      width: 140
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '汽油': 'red',
          '柴油': 'blue',
          '天然气': 'green',
          '尿素': 'purple'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      }
    },
    {
      title: '挂牌价格(元/升)',
      dataIndex: 'listPrice',
      key: 'listPrice',
      width: 130,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '发改委指导价(元/升)',
      dataIndex: 'ndrcPrice',
      key: 'ndrcPrice',
      width: 150,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '价格配置',
      dataIndex: 'priceConfig',
      key: 'priceConfig',
      width: 100,
      render: (text) => (
        <Tag color={text === '统一定价' ? 'blue' : 'orange'}>{text}</Tag>
      )
    },
    {
      title: '油价状态',
      dataIndex: 'priceStatus',
      key: 'priceStatus',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (status) => (
        <Tag color={getApprovalStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '价格生效时间',
      dataIndex: 'effectiveTime',
      key: 'effectiveTime',
      width: 160
    },
    {
      title: '维护时间',
      dataIndex: 'maintainTime',
      key: 'maintainTime',
      width: 160
    },
    {
      title: '维护人',
      dataIndex: 'maintainer',
      key: 'maintainer',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={isOperationDisabled(record, 'edit')}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            disabled={isOperationDisabled(record, 'delete')}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}
      >
        <Form.Item name="stationId" label="公司/油站">
          <TreeSelect
            style={{ width: 200 }}
            placeholder="请选择公司或油站"
            allowClear
            treeData={stationTreeData}
            showSearch
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item name="oilName" label="油品名称">
          <Input
            placeholder="请输入油品名称"
            style={{ width: 140 }}
            allowClear
          />
        </Form.Item>
        <Form.Item name="oilType" label="油品类型">
          <Select
            placeholder="请选择油品类型"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="汽油">汽油</Option>
            <Option value="柴油">柴油</Option>
            <Option value="天然气">天然气</Option>
            <Option value="尿素">尿素</Option>
          </Select>
        </Form.Item>
        <Form.Item name="priceConfig" label="价格配置">
          <Select
            placeholder="请选择价格配置"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="统一定价">统一定价</Option>
            <Option value="差异化定价">差异化定价</Option>
          </Select>
        </Form.Item>
        <Form.Item name="priceStatus" label="价格状态">
          <Select
            placeholder="请选择价格状态"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="生效">生效</Option>
            <Option value="失效">失效</Option>
          </Select>
        </Form.Item>
        <Form.Item name="approvalStatus" label="审批状态">
          <Select
            placeholder="请选择审批状态"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="待提交">待提交</Option>
            <Option value="审批中">审批中</Option>
            <Option value="被驳回">被驳回</Option>
            <Option value="审批通过">审批通过</Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto' }}>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 操作区域 */}
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="middle"
        >
          新建价格
        </Button>
      </div>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* 新建/编辑弹窗 */}
      <Modal
        title={modalType === 'create' ? '新建价格' : '编辑价格'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        destroyOnClose
      >
        <Form
          form={modalForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stationId"
                label="油站"
                rules={[{ required: true, message: '请选择油站' }]}
              >
                <TreeSelect
                  placeholder="请选择油站"
                  allowClear
                  treeData={stationTreeData}
                  showSearch
                  treeDefaultExpandAll
                  disabled={modalType === 'edit'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="oilCode"
                label="油品"
                rules={[{ required: true, message: '请选择油品' }]}
              >
                <Select
                  placeholder="请选择油品"
                  showSearch
                  optionFilterProp="children"
                  disabled={modalType === 'edit'}
                >
                  {oilOptions.map(oil => (
                    <Option key={oil.code} value={oil.code}>
                      {oil.name} ({oil.code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="listPrice"
                label="挂牌价格(元/升)"
                rules={[{ required: true, message: '请输入挂牌价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  precision={2}
                  placeholder="请输入挂牌价格"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ndrcPrice"
                label="发改委指导价(元/升)"
                rules={[{ required: true, message: '请输入发改委指导价' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  precision={2}
                  placeholder="请输入发改委指导价"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priceConfig"
                label="价格配置"
                rules={[{ required: true, message: '请选择价格配置' }]}
              >
                <Select placeholder="请选择价格配置">
                  <Option value="统一定价">统一定价</Option>
                  <Option value="差异化定价">差异化定价</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="effectiveTime"
                label="价格生效时间"
                rules={[{ required: true, message: '请选择价格生效时间' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder="请选择价格生效时间"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="价格详情"
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button key="close" onClick={handleViewModalClose}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="油站名称">{selectedRecord.stationName}</Descriptions.Item>
            <Descriptions.Item label="分公司">{selectedRecord.branchName}</Descriptions.Item>
            <Descriptions.Item label="油品编号">{selectedRecord.oilCode}</Descriptions.Item>
            <Descriptions.Item label="油品名称">{selectedRecord.oilName}</Descriptions.Item>
            <Descriptions.Item label="油品类型">
              <Tag color={
                selectedRecord.oilType === '汽油' ? 'red' : 
                selectedRecord.oilType === '柴油' ? 'blue' : 
                selectedRecord.oilType === '天然气' ? 'green' : 'purple'
              }>
                {selectedRecord.oilType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="价格配置">
              <Tag color={selectedRecord.priceConfig === '统一定价' ? 'blue' : 'orange'}>
                {selectedRecord.priceConfig}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="挂牌价格">¥{selectedRecord.listPrice.toFixed(2)}/升</Descriptions.Item>
            <Descriptions.Item label="发改委指导价">¥{selectedRecord.ndrcPrice.toFixed(2)}/升</Descriptions.Item>
            <Descriptions.Item label="油价状态">
              <Tag color={getStatusColor(selectedRecord.priceStatus)}>
                {selectedRecord.priceStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="审批状态">
              <Tag color={getApprovalStatusColor(selectedRecord.approvalStatus)}>
                {selectedRecord.approvalStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="价格生效时间">{selectedRecord.effectiveTime}</Descriptions.Item>
            <Descriptions.Item label="维护时间">{selectedRecord.maintainTime}</Descriptions.Item>
            <Descriptions.Item label="维护人">{selectedRecord.maintainer}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OilPriceManagement;
