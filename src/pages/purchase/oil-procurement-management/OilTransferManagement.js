import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  Modal,
  message,
  TreeSelect,
  DatePicker,
  Row,
  Col
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './OilTransferManagement.css';
import OilTransferForm from './components/OilTransferForm';
import oilTransferData from '../../../mock/purchase/oil-procurement/oilTransferData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OilTransferManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const data = (oilTransferData.oilTransferList || []).map(item => ({
        ...item,
        key: item.id
      }));
      setDataSource(data);
      setFilteredDataSource(data);
    } catch (error) {
      message.error('数据加载失败');
      console.error('数据加载错误:', error);
      setDataSource([]);
      setFilteredDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理查询
  const handleSearch = (values) => {
    setLoading(true);
    const sourceArray = Array.isArray(dataSource) ? dataSource : [];
    let filtered = [...sourceArray];

    if (values.stationName) {
      filtered = filtered.filter(item => 
        item.createStationName.includes(values.stationName) ||
        item.outboundStationName.includes(values.stationName) ||
        item.inboundStationName.includes(values.stationName)
      );
    }

    if (values.transferNumber) {
      filtered = filtered.filter(item => 
        item.transferNumber.includes(values.transferNumber)
      );
    }

    if (values.carrierName) {
      filtered = filtered.filter(item => 
        item.carrierName.includes(values.carrierName)
      );
    }

    if (values.outboundStationName) {
      filtered = filtered.filter(item => 
        item.outboundStationName.includes(values.outboundStationName)
      );
    }

    if (values.inboundStationName) {
      filtered = filtered.filter(item => 
        item.inboundStationName.includes(values.inboundStationName)
      );
    }

    if (values.transferScope) {
      filtered = filtered.filter(item => item.transferScope === values.transferScope);
    }

    if (values.status) {
      filtered = filtered.filter(item => item.status === values.status);
    }

    if (values.dateRange && values.dateRange.length === 2) {
      const [startDate, endDate] = values.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= startDate.toDate() && createTime <= endDate.toDate();
      });
    }

    setFilteredDataSource(filtered);
    setLoading(false);
  };

  // 重置查询
  const handleReset = () => {
    form.resetFields();
    setFilteredDataSource(Array.isArray(dataSource) ? dataSource : []);
  };

  // 新建
  const handleCreate = () => {
    setModalMode('create');
    setCurrentRecord(null);
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record) => {
    if (record.status !== '草稿') {
      message.warning('只有草稿状态的单据才能编辑');
      return;
    }
    setModalMode('edit');
    setCurrentRecord(record);
    setModalVisible(true);
  };

  // 查看
  const handleView = (record) => {
    setModalMode('view');
    setCurrentRecord(record);
    setModalVisible(true);
  };

  // 删除
  const handleDelete = (record) => {
    if (record.status !== '草稿') {
      message.warning('只有草稿状态的单据才能删除');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除调拨单 ${record.transferNumber} 吗？`,
      onOk: () => {
        const sourceArray = Array.isArray(dataSource) ? dataSource : [];
        const filteredArray = Array.isArray(filteredDataSource) ? filteredDataSource : [];
        const newDataSource = sourceArray.filter(item => item.id !== record.id);
        setDataSource(newDataSource);
        setFilteredDataSource(newDataSource.filter(item => 
          filteredArray.some(filtered => filtered.id === item.id)
        ));
        message.success('删除成功');
      }
    });
  };

  // 模态框确认
  const handleModalOk = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (modalMode === 'create') {
        const newRecord = {
          ...values,
          id: `TR${Date.now()}`,
          key: `TR${Date.now()}`,
          createTime: new Date().toLocaleString(),
          operator: '当前用户'
        };
        const sourceArray = Array.isArray(dataSource) ? dataSource : [];
        const filteredArray = Array.isArray(filteredDataSource) ? filteredDataSource : [];
        const newDataSource = [newRecord, ...sourceArray];
        setDataSource(newDataSource);
        setFilteredDataSource([newRecord, ...filteredArray]);
        message.success('创建成功');
      } else if (modalMode === 'edit') {
        const sourceArray = Array.isArray(dataSource) ? dataSource : [];
        const filteredArray = Array.isArray(filteredDataSource) ? filteredDataSource : [];
        const newDataSource = sourceArray.map(item => 
          item.id === currentRecord.id ? { ...item, ...values } : item
        );
        setDataSource(newDataSource);
        setFilteredDataSource(newDataSource.filter(item => 
          filteredArray.some(filtered => filtered.id === item.id)
        ));
        message.success('更新成功');
      }
      setModalVisible(false);
      setLoading(false);
    }, 1000);
  };

  // 模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 构建油站树形数据
  const buildStationTreeData = () => {
    if (!stationData.branches || !stationData.serviceAreas || !stationData.stations) {
      return [];
    }

    return stationData.branches.map(branch => ({
      title: branch.name,
      value: branch.name,
      key: branch.id,
      children: stationData.serviceAreas
        .filter(serviceArea => serviceArea.branchId === branch.id)
        .map(serviceArea => ({
          title: serviceArea.name,
          value: serviceArea.name,
          key: serviceArea.id,
          children: stationData.stations
            .filter(station => station.serviceAreaId === serviceArea.id)
            .map(station => ({
              title: station.name,
              value: `${branch.name}-${serviceArea.name}-${station.name}`,
              key: station.id
            }))
        }))
    }));
  };

  const columns = [
    {
      title: '调拨单编号',
      dataIndex: 'transferNumber',
      key: 'transferNumber',
      width: 140,
      fixed: 'left'
    },
    {
      title: '创建油站名称',
      dataIndex: 'createStationName',
      key: 'createStationName',
      width: 200
    },
    {
      title: '出库油站',
      dataIndex: 'outboundStationName',
      key: 'outboundStationName',
      width: 200
    },
    {
      title: '入库油站',
      dataIndex: 'inboundStationName',
      key: 'inboundStationName',
      width: 200
    },
    {
      title: '调拨单类型',
      dataIndex: 'transferType',
      key: 'transferType',
      width: 100
    },
    {
      title: '调拨范围',
      dataIndex: 'transferScope',
      key: 'transferScope',
      width: 120
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusColors = {
          '草稿': '#666',
          '已提交': '#1890ff',
          '待审批': '#faad14',
          '已审批': '#52c41a'
        };
        return (
          <span style={{ color: statusColors[status] || '#666' }}>
            {status}
          </span>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
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
          {record.status === '草稿' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
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
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="oil-transfer-management-container">
      <Card>
        {/* 筛选区域 */}
        <Form
          form={form}
          onFinish={handleSearch}
          className="search-form"
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="stationName" label="油站名称">
                <TreeSelect
                  placeholder="请选择油站"
                  treeData={buildStationTreeData()}
                  allowClear
                  showSearch
                  treeDefaultExpandAll={false}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="transferNumber" label="调拨单编号">
                <Input placeholder="请输入调拨单编号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="carrierName" label="承运商">
                <Select placeholder="请选择承运商" allowClear>
                  {oilTransferData.carrierList.map(carrier => (
                    <Option key={carrier} value={carrier}>
                      {carrier}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="outboundStationName" label="出库油站">
                <TreeSelect
                  placeholder="请选择出库油站"
                  treeData={buildStationTreeData()}
                  allowClear
                  showSearch
                  treeDefaultExpandAll={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="inboundStationName" label="入库油站">
                <TreeSelect
                  placeholder="请选择入库油站"
                  treeData={buildStationTreeData()}
                  allowClear
                  showSearch
                  treeDefaultExpandAll={false}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="transferScope" label="调拨范围">
                <Select placeholder="请选择调拨范围" allowClear>
                  {oilTransferData.transferScopeList.map(scope => (
                    <Option key={scope.value} value={scope.value}>
                      {scope.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="单据状态">
                <Select placeholder="请选择状态" allowClear>
                  {oilTransferData.statusList.map(status => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dateRange" label="创建时间">
                <RangePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    新建
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 表格区域 */}
        <Table
          columns={columns}
          dataSource={Array.isArray(filteredDataSource) ? filteredDataSource : []}
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 表单弹窗 */}
      <Modal
        title={
          modalMode === 'create'
            ? '新建油品调拨单'
            : modalMode === 'edit'
            ? '编辑油品调拨单'
            : '油品调拨单详情'
        }
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={modalMode === 'view' ? [
          <Button key="close" onClick={handleModalCancel}>
            关闭
          </Button>
        ] : null}
        width={modalMode === 'view' ? 900 : 1200}
        destroyOnClose
      >
        <OilTransferForm
          mode={modalMode}
          initialValues={currentRecord}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default OilTransferManagement; 