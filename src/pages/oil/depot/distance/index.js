import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Select, 
  Table, 
  Row, 
  Col, 
  Space, 
  message, 
  Modal, 
  InputNumber,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './index.css';

const { Option } = Select;

// 油库距离管理页面
const DepotDistance = () => {
  const [loading, setLoading] = useState(false);
  const [distanceData, setDistanceData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增油库距离');
  const [editingRecord, setEditingRecord] = useState(null);
  const [depotOptions, setDepotOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 组件加载时获取数据
  useEffect(() => {
    fetchDistanceData();
    fetchDepotOptions();
    fetchStationOptions();
  }, []);  // 初始加载时只执行一次

  // 获取油库距离数据
  const fetchDistanceData = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setDistanceData(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取油库距离数据失败:', error);
      message.error('获取油库距离数据失败');
      setLoading(false);
    }
  };

  // 获取油库选项
  const fetchDepotOptions = () => {
    // 模拟API请求
    const mockDepots = [
      { id: 1, name: '北京油库' },
      { id: 2, name: '上海油库' },
      { id: 3, name: '广州油库' },
      { id: 4, name: '深圳油库' },
      { id: 5, name: '成都油库' }
    ];
    setDepotOptions(mockDepots);
  };

  // 获取油站选项
  const fetchStationOptions = () => {
    // 模拟API请求
    const mockStations = [
      { id: 1, name: '北京站点1' },
      { id: 2, name: '北京站点2' },
      { id: 3, name: '上海站点1' },
      { id: 4, name: '上海站点2' },
      { id: 5, name: '广州站点1' },
      { id: 6, name: '广州站点2' },
      { id: 7, name: '深圳站点1' },
      { id: 8, name: '深圳站点2' },
      { id: 9, name: '成都站点1' },
      { id: 10, name: '成都站点2' }
    ];
    setStationOptions(mockStations);
  };

  // 生成模拟数据
  const generateMockData = () => {
    const data = [];
    const total = 50;
    const pageSize = pagination.pageSize;
    const current = pagination.current;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    for (let i = 0; i < total; i++) {
      if (i >= startIndex && i < endIndex) {
        const depotId = (i % 5) + 1;
        const stationId = (i % 10) + 1;
        
        data.push({
          id: i + 1,
          depotId,
          depotName: `${depotOptions.find(d => d.id === depotId)?.name || '未知油库'}`,
          stationId,
          stationName: `${stationOptions.find(s => s.id === stationId)?.name || '未知站点'}`,
          distance: Math.floor(Math.random() * 100) + 10,
          transportTime: Math.floor(Math.random() * 5) + 1,
          transportFee: ((Math.random() * 10) + 1).toFixed(2),
          createdBy: `管理员${i % 3 + 1}`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
          updatedBy: i % 2 === 0 ? `管理员${i % 3 + 1}` : null,
          updatedAt: i % 2 === 0 ? new Date(Date.now() - i * 43200000).toISOString().split('T')[0] : null
        });
      }
    }

    return {
      data,
      total
    };
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setPagination({
      ...pagination,
      current: 1
    });
    fetchDistanceData();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    fetchDistanceData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 打开新增距离模态框
  const handleAdd = () => {
    setModalTitle('新增油库距离');
    setEditingRecord(null);
    editForm.resetFields();
    setModalVisible(true);
  };

  // 打开编辑距离模态框
  const handleEdit = (record) => {
    setModalTitle('编辑油库距离');
    setEditingRecord(record);
    editForm.setFieldsValue({
      depotId: record.depotId,
      stationId: record.stationId,
      distance: record.distance,
      transportTime: record.transportTime,
      transportFee: record.transportFee
    });
    setModalVisible(true);
  };

  // 删除距离记录
  const handleDelete = async (id) => {
    try {
      // 模拟API请求
      setLoading(true);
      setTimeout(() => {
        const newData = distanceData.filter(item => item.id !== id);
        setDistanceData(newData);
        message.success('删除成功');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      setConfirmLoading(true);
      
      // 模拟API请求
      setTimeout(() => {
        if (editingRecord) {
          // 更新记录
          const newData = distanceData.map(item => {
            if (item.id === editingRecord.id) {
              const depotName = depotOptions.find(d => d.id === values.depotId)?.name || '未知油库';
              const stationName = stationOptions.find(s => s.id === values.stationId)?.name || '未知站点';
              return {
                ...item,
                ...values,
                depotName,
                stationName,
                updatedBy: '当前用户',
                updatedAt: new Date().toISOString().split('T')[0]
              };
            }
            return item;
          });
          setDistanceData(newData);
          message.success('更新成功');
        } else {
          // 新增记录
          const depotName = depotOptions.find(d => d.id === values.depotId)?.name || '未知油库';
          const stationName = stationOptions.find(s => s.id === values.stationId)?.name || '未知站点';
          const newRecord = {
            id: distanceData.length + 1,
            ...values,
            depotName,
            stationName,
            createdBy: '当前用户',
            createdAt: new Date().toISOString().split('T')[0],
            updatedBy: null,
            updatedAt: null
          };
          setDistanceData([newRecord, ...distanceData]);
          message.success('新增成功');
        }
        
        setModalVisible(false);
        setConfirmLoading(false);
      }, 500);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 取消表单
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '油库',
      dataIndex: 'depotName',
      key: 'depotName',
      width: 150
    },
    {
      title: '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150
    },
    {
      title: '距离(公里)',
      dataIndex: 'distance',
      key: 'distance',
      width: 120,
      align: 'right'
    },
    {
      title: '运输时间(小时)',
      dataIndex: 'transportTime',
      key: 'transportTime',
      width: 150,
      align: 'right'
    },
    {
      title: '运输费用(元/吨)',
      dataIndex: 'transportFee',
      key: 'transportFee',
      width: 150,
      align: 'right'
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120
    },
    {
      title: '更新人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这条记录吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="depot-distance-search-form">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="depotId" label="油库">
              <Select placeholder="请选择油库" allowClear>
                {depotOptions.map(depot => (
                  <Option key={depot.id} value={depot.id}>{depot.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="stationId" label="油站">
              <Select placeholder="请选择油站" allowClear>
                {stationOptions.map(station => (
                  <Option key={station.id} value={station.id}>{station.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 渲染编辑表单模态框
  const renderEditModal = () => (
    <Modal
      title={modalTitle}
      open={modalVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <Form
        form={editForm}
        layout="vertical"
      >
        <Form.Item
          name="depotId"
          label="油库"
          rules={[{ required: true, message: '请选择油库' }]}
        >
          <Select placeholder="请选择油库">
            {depotOptions.map(depot => (
              <Option key={depot.id} value={depot.id}>{depot.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="stationId"
          label="油站"
          rules={[{ required: true, message: '请选择油站' }]}
        >
          <Select placeholder="请选择油站">
            {stationOptions.map(station => (
              <Option key={station.id} value={station.id}>{station.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="distance"
          label="距离(公里)"
          rules={[{ required: true, message: '请输入距离' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="请输入距离" />
        </Form.Item>
        <Form.Item
          name="transportTime"
          label="运输时间(小时)"
          rules={[{ required: true, message: '请输入运输时间' }]}
        >
          <InputNumber min={0} precision={1} style={{ width: '100%' }} placeholder="请输入运输时间" />
        </Form.Item>
        <Form.Item
          name="transportFee"
          label="运输费用(元/吨)"
          rules={[{ required: true, message: '请输入运输费用' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="请输入运输费用" />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="depot-distance">
      {renderSearchForm()}
      
      <Table
        className="depot-distance-table"
        columns={columns}
        dataSource={distanceData}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1500 }}
      />
      
      {renderEditModal()}
    </div>
  );
};

export default DepotDistance; 