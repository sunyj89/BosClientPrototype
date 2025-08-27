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
import './index.css';
import './OilReceiptManagement.css';
import OilReceiptForm from './components/OilReceiptForm';
import OilReceiptViewModal from './components/OilReceiptViewModal';
import oilReceiptData from '../../../mock/purchase/oil-procurement/oilReceiptData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OilReceiptManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit
  const [currentRecord, setCurrentRecord] = useState(null);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const data = (oilReceiptData.oilReceiptList || []).map(item => ({
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
        item.stationName.includes(values.stationName)
      );
    }

    if (values.procurementApplicationNumber) {
      filtered = filtered.filter(item => 
        item.procurementApplicationNumber.includes(values.procurementApplicationNumber)
      );
    }

    if (values.deliveryOrderNumber) {
      filtered = filtered.filter(item => 
        item.deliveryOrderNumber.includes(values.deliveryOrderNumber)
      );
    }

    if (values.supplierName) {
      filtered = filtered.filter(item => 
        item.supplierName.includes(values.supplierName)
      );
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
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 删除
  const handleDelete = (record) => {
    if (record.status !== '草稿') {
      message.warning('只有草稿状态的单据才能删除');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除单据 ${record.receiptNumber} 吗？`,
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
          id: `RK${Date.now()}`,
          key: `RK${Date.now()}`,
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
      title: '单据编号',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 140,
      fixed: 'left'
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 200
    },
    {
      title: '油库名称',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150
    },
    {
      title: '关联采购申请单',
      dataIndex: 'procurementApplicationNumber',
      key: 'procurementApplicationNumber',
      width: 150,
      render: (text) => text || '-'
    },
    {
      title: '关联出库单编号',
      dataIndex: 'deliveryOrderNumber',
      key: 'deliveryOrderNumber',
      width: 150,
      render: (text) => text || '-'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200
    },
    {
      title: '实发体积Vt(L)',
      dataIndex: 'actualDeliveryVolume',
      key: 'actualDeliveryVolume',
      width: 120,
      align: 'right',
      render: (text) => text?.toLocaleString()
    },
    {
      title: '油罐实收体积Vt(L)',
      dataIndex: 'tankReceivedVolume',
      key: 'tankReceivedVolume',
      width: 140,
      align: 'right',
      render: (text) => text?.toLocaleString()
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
    <>
      {/* 筛选区域 */}
      <Form form={form} onFinish={handleSearch}>
        {/* 第一行：筛选条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={5}>
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
          <Col span={4}>
            <Form.Item name="procurementApplicationNumber" label="采购申请单">
              <Input placeholder="请输入采购申请单编号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="deliveryOrderNumber" label="出库单编号">
              <Input placeholder="请输入出库单编号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="supplierName" label="供应商">
              <Select placeholder="请选择供应商" allowClear>
                {oilReceiptData.supplierList.map(supplier => (
                  <Option key={supplier} value={supplier}>
                    {supplier}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={7} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Form.Item name="status" label="单据状态">
              <Select placeholder="请选择状态" allowClear>
                {oilReceiptData.statusList.map(status => (
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

        {/* 第二行：功能按钮 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新建入库卸油单
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={Array.isArray(filteredDataSource) ? filteredDataSource : []}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1800 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
        }}
      />

      {/* 表单弹窗 */}
      <Modal
        title={
          modalMode === 'create'
            ? '新建入库卸油单'
            : '编辑入库卸油单'
        }
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <OilReceiptForm
          mode={modalMode}
          initialValues={currentRecord}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>

      {/* 查看弹窗 */}
      <OilReceiptViewModal
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        record={currentRecord}
      />
    </>
  );
};

export default OilReceiptManagement; 