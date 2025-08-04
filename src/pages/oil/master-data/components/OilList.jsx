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

const { Option } = Select;

const OilList = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // 模拟数据 - 包含新分类的油品
  const mockData = [
    {
      key: '1',
      code: '100001',
      onlineCode: 'OL2024001',
      name: '92号汽油国V',
      categoryKey: '1-1-1',
      category: '92号',
      categoryPath: '油品 > 汽油 > 92号',
      shortName: '92#汽油',
      oilType: '汽油',
      emissionLevel: '国V',
      status: '生效中',
      density: 0.75,
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-15 10:30:00',
      approver: '张经理'
    },
    {
      key: '2',
      code: '100002',
      onlineCode: 'OL2024002',
      name: '92号汽油国VIA',
      categoryKey: '1-1-1',
      category: '92号',
      categoryPath: '油品 > 汽油 > 92号',
      shortName: '92#汽油VIA',
      oilType: '汽油',
      emissionLevel: '国VIA',
      status: '生效中',
      density: 0.75,
      createTime: '2024-01-16 14:20:00',
      updateTime: '2024-01-16 14:20:00',
      approver: '王主管'
    },
    {
      key: '3',
      code: '100003',
      onlineCode: 'OL2024003',
      name: '95号汽油国V',
      categoryKey: '1-1-2',
      category: '95号',
      categoryPath: '油品 > 汽油 > 95号',
      shortName: '95#汽油',
      oilType: '汽油',
      emissionLevel: '国V',
      status: '审批中',
      density: 0.76,
      createTime: '2024-01-18 09:15:00',
      updateTime: '2024-01-18 09:15:00',
      approver: ''
    },
    {
      key: '4',
      code: '100004',
      onlineCode: 'OL2024004',
      name: '95号汽油国VIA',
      categoryKey: '1-1-2',
      category: '95号',
      categoryPath: '油品 > 汽油 > 95号',
      shortName: '95#汽油VIA',
      oilType: '汽油',
      emissionLevel: '国VIA',
      status: '生效中',
      density: 0.76,
      createTime: '2024-01-20 11:45:00',
      updateTime: '2024-01-20 11:45:00',
      approver: '张经理'
    },
    {
      key: '5',
      code: '100005',
      onlineCode: 'OL2024005',
      name: '98号汽油国V',
      categoryKey: '1-1-3',
      category: '98号',
      categoryPath: '油品 > 汽油 > 98号',
      shortName: '98#汽油',
      oilType: '汽油',
      emissionLevel: '国V',
      status: '未生效',
      density: 0.77,
      createTime: '2024-01-22 16:30:00',
      updateTime: '2024-01-22 16:30:00',
      approver: ''
    },
    {
      key: '6',
      code: '100006',
      onlineCode: 'OL2024006',
      name: '0号柴油国V',
      categoryKey: '1-2-3',
      category: '0号',
      categoryPath: '油品 > 柴油 > 0号',
      shortName: '0#柴油',
      oilType: '柴油',
      emissionLevel: '国V',
      status: '生效中',
      density: 0.83,
      createTime: '2024-01-10 08:00:00',
      updateTime: '2024-01-10 08:00:00',
      approver: '王主管'
    },
    {
      key: '7',
      code: '100007',
      onlineCode: 'OL2024007',
      name: 'LNG液化天然气',
      categoryKey: '2-1-1',
      category: 'LNG液化天然气',
      categoryPath: '天然气 > 车用天然气 > LNG液化天然气',
      shortName: 'LNG',
      oilType: '天然气',
      emissionLevel: '',
      status: '生效中',
      density: 0.42,
      createTime: '2024-01-25 10:00:00',
      updateTime: '2024-01-25 10:00:00',
      approver: '李经理'
    },
    {
      key: '8',
      code: '100008',
      onlineCode: 'OL2024008',
      name: 'CNG压缩天然气',
      categoryKey: '2-1-2',
      category: 'CNG压缩天然气',
      categoryPath: '天然气 > 车用天然气 > CNG压缩天然气',
      shortName: 'CNG',
      oilType: '天然气',
      emissionLevel: '',
      status: '审批中',
      density: 0.65,
      createTime: '2024-01-26 14:30:00',
      updateTime: '2024-01-26 14:30:00',
      approver: ''
    },
    {
      key: '9',
      code: '100009',
      onlineCode: 'OL2024009',
      name: '桶装车用尿素',
      categoryKey: '3-1-1',
      category: '桶装车用尿素',
      categoryPath: '尾气处理液 > 柴油机尾气处理液 > 桶装车用尿素',
      shortName: '桶装尿素',
      oilType: '尿素',
      emissionLevel: '',
      status: '生效中',
      density: 1.09,
      createTime: '2024-01-28 09:30:00',
      updateTime: '2024-01-28 09:30:00',
      approver: '张经理'
    },
    {
      key: '10',
      code: '100010',
      onlineCode: 'OL2024010',
      name: '散装车用尿素',
      categoryKey: '3-1-2',
      category: '散装车用尿素',
      categoryPath: '尾气处理液 > 柴油机尾气处理液 > 散装车用尿素',
      shortName: '散装尿素',
      oilType: '尿素',
      emissionLevel: '',
      status: '未生效',
      density: 1.09,
      createTime: '2024-01-30 15:00:00',
      updateTime: '2024-01-30 15:00:00',
      approver: ''
    }
  ];

  // 分类树形数据 - 根据提示词记录修正分类结构
  const categoryTreeData = [
    {
      title: '油品',
      value: '1',
      categoryId: 'OIL',
      level: 1,
      children: [
        {
          title: '汽油',
          value: '1-1',
          categoryId: 'GAS',
          level: 2,
          children: [
            { title: '92号', value: '1-1-1', categoryId: 'GAS92', level: 3 },
            { title: '95号', value: '1-1-2', categoryId: 'GAS95', level: 3 },
            { title: '98号', value: '1-1-3', categoryId: 'GAS98', level: 3 },
            { title: '101号', value: '1-1-4', categoryId: 'GAS101', level: 3 }
          ]
        },
        {
          title: '柴油',
          value: '1-2',
          categoryId: 'DIESEL',
          level: 2,
          children: [
            { title: '10号', value: '1-2-1', categoryId: 'DIESEL10', level: 3 },
            { title: '5号', value: '1-2-2', categoryId: 'DIESEL5', level: 3 },
            { title: '0号', value: '1-2-3', categoryId: 'DIESEL0', level: 3 },
            { title: '-10号', value: '1-2-4', categoryId: 'DIESEL-10', level: 3 },
            { title: '-20号', value: '1-2-5', categoryId: 'DIESEL-20', level: 3 },
            { title: '-35号', value: '1-2-6', categoryId: 'DIESEL-35', level: 3 }
          ]
        }
      ]
    },
    {
      title: '天然气',
      value: '2',
      categoryId: 'NATURAL_GAS',
      level: 1,
      children: [
        {
          title: '车用天然气',
          value: '2-1',
          categoryId: 'VEHICLE_GAS',
          level: 2,
          children: [
            { title: 'LNG液化天然气', value: '2-1-1', categoryId: 'LNG', level: 3 },
            { title: 'CNG压缩天然气', value: '2-1-2', categoryId: 'CNG', level: 3 }
          ]
        }
      ]
    },
    {
      title: '尾气处理液',
      value: '3',
      categoryId: 'EXHAUST_FLUID',
      level: 1,
      children: [
        {
          title: '柴油机尾气处理液',
          value: '3-1',
          categoryId: 'DIESEL_EXHAUST_FLUID',
          level: 2,
          children: [
            { title: '桶装车用尿素', value: '3-1-1', categoryId: 'BARREL_UREA', level: 3 },
            { title: '散装车用尿素', value: '3-1-2', categoryId: 'BULK_UREA', level: 3 }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setDataSource(mockData);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (values) => {
    setLoading(true);
    // 模拟搜索
    setTimeout(() => {
      let filteredData = [...mockData];
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