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
  Popconfirm,
  Tag,
  Tooltip,
  TreeSelect
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  ClearOutlined
} from '@ant-design/icons';
import OilForm from './OilForm';
import OilViewModal from './OilViewModal';
import mockData from '../../../../mock/oil/master-data.json';

const { Option } = Select;

const OilList = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [categoryTreeData, setCategoryTreeData] = useState([]);

  useEffect(() => {
    // 从 mock 文件中获取数据
    setDataSource(mockData.oilList);
    setCategoryTreeData(mockData.categoryTree);
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setDataSource(mockData.oilList);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (values) => {
    setLoading(true);
    // 模拟搜索
    setTimeout(() => {
      let filteredData = [...mockData.oilList];
      if (values.code) {
        filteredData = filteredData.filter(item => 
          item.code.includes(values.code)
        );
      }
      if (values.onlineCode) {
        filteredData = filteredData.filter(item => 
          item.onlineCode.includes(values.onlineCode)
        );
      }
      if (values.name) {
        filteredData = filteredData.filter(item => 
          item.name.includes(values.name)
        );
      }
      if (values.category) {
        filteredData = filteredData.filter(item => 
          item.category.includes(values.category)
        );
      }
      if (values.oilType) {
        filteredData = filteredData.filter(item => 
          item.oilType === values.oilType
        );
      }
      if (values.emissionLevel) {
        filteredData = filteredData.filter(item => 
          item.emissionLevel === values.emissionLevel
        );
      }
      if (values.status) {
        filteredData = filteredData.filter(item => 
          item.status === values.status
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
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除油品"${record.name}"吗？`,
      onOk() {
        setLoading(true);
        setTimeout(() => {
          const updatedData = dataSource.map(item => 
            item.key === record.key 
              ? { ...item, status: '审批中', operationType: '删除' }
              : item
          );
          setDataSource(updatedData);
          message.success('删除申请已提交，等待审批');
          setLoading(false);
        }, 500);
      }
    });
  };

  const handleModalOk = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (modalType === 'create') {
        const newRecord = {
          ...values,
          key: Date.now().toString(),
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString(),
          status: '审批中',
          operator: '当前用户',
          approver: ''
        };
        setDataSource([...dataSource, newRecord]);
        message.success('创建成功，已提交审批');
      } else if (modalType === 'edit') {
        const updatedData = dataSource.map(item => 
          item.key === selectedRecord.key 
            ? { ...item, ...values, updateTime: new Date().toLocaleString(), status: '审批中' }
            : item
        );
        setDataSource(updatedData);
        message.success('编辑成功，已提交审批');
      }
      setIsModalVisible(false);
      setLoading(false);
    }, 800);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '生效中':
        return 'green';
      case '审批中':
        return 'orange';
      case '未生效':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '油品编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      fixed: 'left'
    },
    {
      title: '线上油品编号',
      dataIndex: 'onlineCode',
      key: 'onlineCode',
      width: 140,
      fixed: 'left'
    },
    {
      title: '油品名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      fixed: 'left'
    },

    {
      title: '油品简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 100
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
          '尿素': 'purple',
          '其他': 'default'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      }
    },
    {
      title: '排放等级',
      dataIndex: 'emissionLevel',
      key: 'emissionLevel',
      width: 100,
      render: (text) => (
        text ? <Tag color="orange">{text}</Tag> : '-'
      )
    },
    {
      title: '油品状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colorMap = {
          '生效中': 'success',
          '审批中': 'processing',
          '未生效': 'default'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      }
    },
    {
      title: '默认密度',
      dataIndex: 'density',
      key: 'density',
      width: 100,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_, record) => {
        const renderButtons = () => {
          if (record.status === '生效中') {
            // 生效中：查看和编辑
            return (
              <>
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
                >
                  编辑
                </Button>
              </>
            );
          } else if (record.status === '审批中') {
            // 审批中：仅查看
            return (
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
              >
                查看
              </Button>
            );
          } else if (record.status === '未生效') {
            // 未生效：编辑和删除
            return (
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
            );
          }
          return null;
        };
        
        return <Space size="small">{renderButtons()}</Space>;
      }
    }
  ];

  // 筛选表单组件
  const FilterForm = () => (
    <Form
      form={form}
      layout="inline"
      onFinish={handleSearch}
      style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}
    >
      <Form.Item name="code" label="油品编号">
        <Input
          placeholder="请输入油品编号"
          style={{ width: 120 }}
          allowClear
        />
      </Form.Item>
      <Form.Item name="onlineCode" label="线上油品编号">
        <Input
          placeholder="请输入线上油品编号"
          style={{ width: 140 }}
          allowClear
        />
      </Form.Item>
      <Form.Item name="name" label="油品名称">
        <Input
          placeholder="请输入油品名称"
          style={{ width: 140 }}
          allowClear
        />
      </Form.Item>
      <Form.Item name="category" label="油品分类">
        <TreeSelect
          style={{ width: 200 }}
          placeholder="请选择分类"
          allowClear
          treeData={categoryTreeData}
          showSearch
          treeDefaultExpandAll
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
          <Option value="其他">其他</Option>
        </Select>
      </Form.Item>
      <Form.Item name="emissionLevel" label="排放等级">
        <Select
          placeholder="请选择排放等级"
          style={{ width: 120 }}
          allowClear
        >
          <Option value="国V">国V</Option>
          <Option value="国VIA">国VIA</Option>
          <Option value="国VIB">国VIB</Option>
          <Option value="乙醇E10">乙醇E10</Option>
        </Select>
      </Form.Item>
      <Form.Item name="status" label="油品状态">
        <Select
          placeholder="请选择油品状态"
          style={{ width: 120 }}
          allowClear
        >
          <Option value="生效中">生效中</Option>
          <Option value="审批中">审批中</Option>
          <Option value="未生效">未生效</Option>
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
  );

  return (
    <div>
      {/* 筛选区域 */}
      <FilterForm />

      {/* 操作区域 */}
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="middle"
        >
          新建油品
        </Button>
      </div>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* 编辑/新建弹窗表单 */}
      <Modal
        title={modalType === 'create' ? '新建油品' : '编辑油品'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <OilForm
          visible={isModalVisible}
          type={modalType}
          data={selectedRecord}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>

      {/* 查看详情弹窗 */}
      <OilViewModal
        visible={isViewModalVisible}
        data={selectedRecord}
        onClose={handleViewModalClose}
      />
    </div>
  );
};

export default OilList; 