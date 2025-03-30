import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Space, 
  Modal, 
  Form, 
  Select, 
  message, 
  Tag, 
  Popconfirm, 
  Row, 
  Col,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

// 模拟油品供应商数据
const mockOilSuppliers = [
  {
    id: 'OS001',
    name: '中国石化',
    code: 'SINOPEC001',
    contactPerson: '张经理',
    contactPhone: '13812345678',
    address: '北京市朝阳区朝阳门北大街22号',
    oilTypes: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'],
    qualificationNumber: 'QL2022001',
    status: '正常',
    level: 'A',
    remarks: '中石化一级供应商'
  },
  {
    id: 'OS002',
    name: '中国石油',
    code: 'CNPC002',
    contactPerson: '李经理',
    contactPhone: '13987654321',
    address: '北京市西城区六铺炕街6号',
    oilTypes: ['92#汽油', '95#汽油', '0#柴油'],
    qualificationNumber: 'QL2022002',
    status: '正常',
    level: 'A',
    remarks: '中石油一级供应商'
  },
  {
    id: 'OS003',
    name: '中国海油',
    code: 'CNOOC003',
    contactPerson: '王经理',
    contactPhone: '13876543210',
    address: '北京市东城区朝阳门北大街25号',
    oilTypes: ['92#汽油', '95#汽油'],
    qualificationNumber: 'QL2022003',
    status: '暂停',
    level: 'B',
    remarks: '合作中'
  },
  {
    id: 'OS004',
    name: '壳牌石油',
    code: 'SHELL004',
    contactPerson: '赵经理',
    contactPhone: '13765432109',
    address: '上海市浦东新区浦东南路1118号',
    oilTypes: ['95#汽油', '98#汽油'],
    qualificationNumber: 'QL2022004',
    status: '正常',
    level: 'A',
    remarks: '国际一级供应商'
  },
  {
    id: 'OS005',
    name: '中化石油',
    code: 'SINOCHEM005',
    contactPerson: '钱经理',
    contactPhone: '13654321098',
    address: '北京市西城区复兴门内大街28号',
    oilTypes: ['92#汽油', '0#柴油'],
    qualificationNumber: 'QL2022005',
    status: '正常',
    level: 'B',
    remarks: '二级供应商'
  }
];

const OilSupplierManagement = () => {
  const [suppliers, setSuppliers] = useState(mockOilSuppliers);
  const [filteredSuppliers, setFilteredSuppliers] = useState(mockOilSuppliers);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 过滤供应商
  const filterSuppliers = () => {
    if (!searchText) {
      setFilteredSuppliers(suppliers);
      return;
    }

    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
        supplier.code.toLowerCase().includes(searchText.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredSuppliers(filtered);
  };

  // 重置搜索
  const resetSearch = () => {
    setSearchText('');
    setFilteredSuppliers(suppliers);
  };

  // 显示新增模态框
  const showAddModal = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 显示编辑模态框
  const showEditModal = (record) => {
    setEditingSupplier(record);
    form.setFieldsValue({
      ...record,
      oilTypes: record.oilTypes
    });
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      
      setTimeout(() => {
        if (editingSupplier) {
          // 编辑现有供应商
          const updatedSuppliers = suppliers.map((supplier) =>
            supplier.id === editingSupplier.id ? { ...supplier, ...values } : supplier
          );
          setSuppliers(updatedSuppliers);
          setFilteredSuppliers(updatedSuppliers);
          message.success('供应商信息已更新');
        } else {
          // 添加新供应商
          const newSupplier = {
            ...values,
            id: `OS${String(suppliers.length + 1).padStart(3, '0')}`,
          };
          const newSuppliers = [...suppliers, newSupplier];
          setSuppliers(newSuppliers);
          setFilteredSuppliers(newSuppliers);
          message.success('新供应商已添加');
        }
        
        setLoading(false);
        setIsModalVisible(false);
      }, 500);
    });
  };

  // 删除供应商
  const handleDelete = (record) => {
    const newSuppliers = suppliers.filter((supplier) => supplier.id !== record.id);
    setSuppliers(newSuppliers);
    setFilteredSuppliers(newSuppliers);
    message.success('供应商已删除');
  };

  // 表格列定义
  const columns = [
    {
      title: '供应商ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '供应商代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
    {
      title: '油品类型',
      dataIndex: 'oilTypes',
      key: 'oilTypes',
      width: 200,
      render: (oilTypes) => (
        <>
          {oilTypes.map((type) => (
            <Tag color="blue" key={type}>
              {type}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => {
        let color = 'green';
        if (level === 'B') {
          color = 'orange';
        } else if (level === 'C') {
          color = 'red';
        }
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = 'green';
        if (status === '暂停') {
          color = 'orange';
        } else if (status === '终止') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此供应商吗?"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="oil-supplier-management">
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索供应商名称/代码/联系人"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={filterSuppliers}
              allowClear
            />
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={filterSuppliers}
              >
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetSearch}>
                重置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
              >
                新增供应商
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="油品供应商列表">
        <Table
          columns={columns}
          dataSource={filteredSuppliers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingSupplier ? '编辑供应商' : '新增供应商'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={700}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="name"
            label="供应商名称"
            rules={[{ required: true, message: '请输入供应商名称' }]}
          >
            <Input placeholder="请输入供应商名称" />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="供应商代码"
            rules={[{ required: true, message: '请输入供应商代码' }]}
          >
            <Input placeholder="请输入供应商代码" />
          </Form.Item>
          
          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
          
          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
          
          <Form.Item
            name="oilTypes"
            label="油品类型"
            rules={[{ required: true, message: '请选择油品类型' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择油品类型"
              style={{ width: '100%' }}
            >
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
              <Option value="-10#柴油">-10#柴油</Option>
              <Option value="-20#柴油">-20#柴油</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="qualificationNumber"
            label="资质证书编号"
            rules={[{ required: true, message: '请输入资质证书编号' }]}
          >
            <Input placeholder="请输入资质证书编号" />
          </Form.Item>
          
          <Form.Item
            name="level"
            label="供应商等级"
            rules={[{ required: true, message: '请选择供应商等级' }]}
          >
            <Select placeholder="请选择供应商等级">
              <Option value="A">A级</Option>
              <Option value="B">B级</Option>
              <Option value="C">C级</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="正常">正常</Option>
              <Option value="暂停">暂停</Option>
              <Option value="终止">终止</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="remarks"
            label="备注"
          >
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OilSupplierManagement; 