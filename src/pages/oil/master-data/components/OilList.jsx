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
import * as api from '../../services/api';

const { Option } = Select;

const OilList = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [oilStandardData, setOilStandardData] = useState([]);
  const [oilTypeData, setOilTypeData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // 从 mock 文件中获取数据
    // setDataSource(mockData.oilList);
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);

    // 从 API 获取油品分类列表
    api.getOilCategoryList().then(res => {
      if (res.success) {
        setCategoryData(res.data);
      }
    });

    // 查询字典
    api.getDictList('oil_product_type').then(res => {
      if (res.success) {
        setOilTypeData(res.data);
      }
    });

    // 获取油品列表
    getOilList();

    // 获取油品标准列表
    api.getOilStandardList().then(res => {
      if (res.success) {
        setOilStandardData(res.data);
      }
    });

  };

  const getOilList = () => {
    console.log('currentPage',currentPage);
    console.log('pageSize',pageSize);
    setLoading(true);
    // 从 API 获取油品列表
    api.getOilList({
      page: currentPage,
      pageSize: pageSize
    }).then(res => {
      if (res.success) {
        setDataSource(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
      }
    });
  };

  const handleSearch = (values) => {
    setLoading(true);
    // 模拟搜索
    console.log(values);
      let params = {};
      if (values.code) {
        params.oilCode = values.code;
      }
      if (values.onlineCode) {
        params.onlineCode = values.onlineCode;
      }
      if (values.name) {
        params.oilName = values.name;
      }
      if (values.category) {
        params.categoryId = values.category;
      }
      if (values.oilType) {
        params.oilType = values.oilType;
      }
      if (values.emissionLevel) {
        params.oilStandardName = values.emissionLevel;
      }
      if (values.status) {
        params.status = values.status;
      }
      params.page = currentPage;
      params.pageSize = pageSize;
      api.getOilList(params).then(res => {
        if (res.success) {
          setDataSource(res.data.list);
          setLoading(false);
        }
      });
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

  const handlePaginationChange = (page, pageSize) => {
    console.log(page, pageSize);
    setCurrentPage(page);
    setPageSize(pageSize);
    console.log('currentPage',currentPage);
    console.log('pageSize',pageSize);
    getOilList();
  };

  const handleModalOk = (values) => {

    console.log(values);

    setLoading(true);
    if (modalType === 'create') {
      let data = {
        "oilCode": values.code,
        "onlineCode": values.onlineCode,
        "oilName": values.name,
        "oilShortName": values.shortName,
        "oilNumber": values.number,
        "categoryId": values.category,
        "oilType": values.oilType,
        "oilStandardName": values.emissionLevel,
        "density": values.density,
        "inputTaxRate": values.input_tax_rate,
        "outputTaxRate": values.output_tax_rate,
        "taxCategory": values.tax_classification,
        "taxRate": values.tax_rate,
        "erpProductCode": values.erp_product_code,
        "erpCategoryCode": values.erp_category_code
      }
      api.addOil(data).then(res => {
        if (res.success) {
          loadData();
          setIsModalVisible(false);
          setLoading(false);
        }
      });
    }
    // setTimeout(() => {
    //   if (modalType === 'create') {
    //     const newRecord = {
    //       ...values,
    //       key: Date.now().toString(),
    //       createTime: new Date().toLocaleString(),
    //       updateTime: new Date().toLocaleString(),
    //       status: '审批中',
    //       operator: '当前用户',
    //       approver: ''
    //     };
    //     setDataSource([...dataSource, newRecord]);
    //     message.success('创建成功，已提交审批');
    //   } 
    // else if (modalType === 'edit') {
    //     const updatedData = dataSource.map(item => 
    //       item.key === selectedRecord.key 
    //         ? { ...item, ...values, updateTime: new Date().toLocaleString(), status: '审批中' }
    //         : item
    //     );
    //     setDataSource(updatedData);
    //     message.success('编辑成功，已提交审批');
    //   }
    //   setIsModalVisible(false);
    //   setLoading(false);
    // }, 800);
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
      dataIndex: 'oilCode',
      key: 'oilCode',
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
      dataIndex: 'oilName',
      key: 'oilName',
      width: 160,
      fixed: 'left'
    },

    {
      title: '油品简称',
      dataIndex: 'oilShortName',
      key: 'oilShortName',
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
      dataIndex: 'oilStandardName',
      key: 'oilStandardName',
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
          'active': 'success',
          '审批中': 'processing',
          'inactive': 'default'
        };
        const statusText = status === 'active' ? '使用中' : status === 'inactive' ? '已停用' : status === 'approved' ? '已审核' : status === 'pending' ? '挂起' : '草稿';
        return <Tag color={colorMap[status]}>{statusText}</Tag>;
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
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_, record) => {
        const renderButtons = () => {
          if (record.status === 'active') {
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
          } else if (record.status === 'pending') {
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
          } else if (record.status === 'draft' || record.status === 'inactive') {
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
        <Select placeholder="请选择油品分类" style={{ width: 150 }} allowClear>
              {categoryData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
      </Form.Item>
      <Form.Item name="oilType" label="油品类型">
        <Select
          placeholder="请选择油品类型"
          style={{ width: 120 }}
          allowClear
        >
          {oilTypeData.map(item => (
                <Option key={item.id} value={item.itemName}>{item.itemName}</Option>
              ))}
        </Select>
      </Form.Item>
      <Form.Item name="emissionLevel" label="排放等级">
        <Select
          placeholder="请选择排放等级"
          style={{ width: 120 }}
          allowClear
        >
          {oilStandardData.map(item => (
                <Option key={item.id} value={item.name}>{item.name}</Option>
              ))}
        </Select>
      </Form.Item>
      <Form.Item name="status" label="油品状态">
        <Select
          placeholder="请选择油品状态"
          style={{ width: 120 }}
          allowClear
        >
          <Option value="draft">草稿</Option>
          <Option value="pending">挂起</Option>
          <Option value="approved">已审核</Option>
          <Option value="active">使用中</Option>
          <Option value="inactive">已停用</Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ marginLeft: 'auto' }}>
        <Space>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
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
          total,
          current: currentPage,
          pageSize: pageSize,
          showTotal: (total) => `共 ${total} 条记录`,
          onShowSizeChange: handlePaginationChange,
          onChange : handlePaginationChange
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
        categoryData={categoryData}
        onClose={handleViewModalClose}
      />
    </div>
  );
};

export default OilList; 