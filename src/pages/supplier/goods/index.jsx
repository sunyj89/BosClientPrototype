import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Row,
  Col,
  Popconfirm,
  Tooltip,
  DatePicker,
  Tabs,
  Spin,
  Upload,
  List
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FileTextOutlined,
  HistoryOutlined,
  FilePdfOutlined,
  ContainerOutlined
} from '@ant-design/icons';

// 导入模拟数据
import goodsSupplierData from '../../../mock/supplier/goodsSupplier.json';
import GoodsSupplierViewModal from './components/ViewModal';
import GoodsSupplierChangeRecord from './components/ChangeRecord';
import ProcurementCatalog from './components/ProcurementCatalog';
import './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GoodsSupplierManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('management');
  const [searchForm] = Form.useForm();
  const [supplierForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [contractFileList, setContractFileList] = useState([]);

  useEffect(() => {
    // 从mock数据初始化
    setDataSource(goodsSupplierData.suppliers);
  }, []);

  // 文件上传配置
  const uploadProps = {
    name: 'file',
    action: '/api/upload', // 实际项目中替换为真实的上传接口
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB!');
        return false;
      }
      return true;
    },
    onChange(info) {
      handleFileChange(info);
    },
  };

  const contractUploadProps = {
    name: 'file',
    action: '/api/upload', // 实际项目中替换为真实的上传接口
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB!');
        return false;
      }
      return true;
    },
    onChange(info) {
      handleContractFileChange(info);
    },
  };

  // 附件上传处理函数
  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(fileList);
  };

  // 合同文件上传的处理函数
  const handleContractFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setContractFileList(fileList);
  };

  const columns = [
    {
      title: '供应商ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: '供应商代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
      render: (text) => (
        <span>{text}</span>
      )
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
      render: (text) => (
        <span>{text}</span>
      )
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => {
        const levelConfig = {
          A: { color: 'red', text: 'A级' },
          B: { color: 'orange', text: 'B级' },
          C: { color: 'blue', text: 'C级' }
        };
        const config = levelConfig[level] || levelConfig.B;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          '待审批': { color: 'orange', text: '待审批' },
          '正常': { color: 'green', text: '正常' },
          '暂停': { color: 'red', text: '暂停' },
          '已驳回': { color: 'default', text: '已驳回' }
        };
        const config = statusConfig[status] || statusConfig['待审批'];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (text) => text && text.split(' ')[0]
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
            style={{ borderRadius: '2px' }}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>

          <Popconfirm
            title="确定要删除这个供应商吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              size="small"
              icon={<DeleteOutlined />}
              style={{ 
                borderRadius: '2px',
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f'
              }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实际项目中这里会调用API
  };

  const handleCreate = () => {
    setModalType('create');
    setCurrentRecord(null);
    supplierForm.resetFields();
    // 清空文件列表
    setFileList([]);
    setContractFileList([]);
    // 设置默认值
    supplierForm.setFieldsValue({
      status: '待审批',
      level: 'B'
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    supplierForm.setFieldsValue(record);
    // 模拟现有附件和合同
    setFileList(record.attachments?.map((item, index) => ({
      uid: `-${index}`,
      name: item.name,
      status: 'done',
      url: item.url
    })) || []);
    setContractFileList(record.contracts?.map((item, index) => ({
      uid: `-${index}`,
      name: item.name,
      status: 'done',
      url: item.url
    })) || []);
    setModalVisible(true);
  };

  const handleView = (record) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setCurrentRecord(null);
  };

  const handleDelete = (record) => {
    message.success('删除成功');
    // 实际项目中这里会调用删除API
  };

  const handleModalOk = () => {
    supplierForm.validateFields().then(values => {
      // 处理文件上传
      const formData = {
        ...values,
        attachments: fileList.map(file => ({
          name: file.name,
          url: file.url || file.response?.url || 'https://example.com/file'
        })),
        contracts: contractFileList.map(file => ({
          name: file.name,
          url: file.url || file.response?.url || 'https://example.com/contract'
        }))
      };
      console.log('表单数据:', formData);
      setModalVisible(false);
      message.success(`${modalType === 'create' ? '创建' : '编辑'}成功`);
      // 实际项目中这里会调用API
    });
  };

  const handleBatchImport = () => {
    // 创建文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        message.success(`正在导入文件: ${file.name}`);
        // 实际项目中这里会调用导入API
      }
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    // 实际项目中这里会下载模板文件
    const link = document.createElement('a');
    link.href = '/templates/goods_supplier_template.xlsx';
    link.download = '商品供应商导入模板.xlsx';
    link.click();
    message.success('模板下载完成');
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const tabItems = [
    {
      key: 'management',
      label: '非油品供应商列表',
      children: (
        <div>


          {/* 筛选区域 */}
          <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
            <Form form={searchForm} onFinish={handleSearch}>
              {/* 第一行：筛选条件 */}
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Form.Item name="keyword" label="关键词">
                    <Input placeholder="供应商名称/编码" style={{ width: '100%' }} allowClear />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status" label="状态">
                    <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                      <Option value="待审批">待审批</Option>
                      <Option value="正常">正常</Option>
                      <Option value="暂停">暂停</Option>
                      <Option value="已驳回">已驳回</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="level" label="等级">
                    <Select placeholder="请选择等级" style={{ width: '100%' }} allowClear>
                      <Option value="A">A级</Option>
                      <Option value="B">B级</Option>
                      <Option value="C">C级</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ borderRadius: '2px' }}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => searchForm.resetFields()} style={{ borderRadius: '2px' }}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              
              {/* 第二行：功能按钮 */}
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ borderRadius: '2px' }}>
                      新建供应商
                    </Button>
                    <Button icon={<UploadOutlined />} onClick={handleBatchImport} style={{ borderRadius: '2px' }}>
                      批量导入
                    </Button>
                    <Button type="link" icon={<DownloadOutlined />} onClick={handleDownloadTemplate} style={{ borderRadius: '2px' }}>
                      下载模板
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </div>

          {/* 供应商列表 */}
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            scroll={{ x: 'max-content' }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
            }}
          />
        </div>
      ),
    },
    {
      key: 'catalog',
      label: '非油采购商品目录',
      children: <ProcurementCatalog />,
    },
    {
      key: 'records',
      label: '修改记录',
      children: <GoodsSupplierChangeRecord />,
    },
  ];

  return (
    <div className="module-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>

      {/* 新建/编辑供应商弹窗 */}
      <Modal
        title={modalType === 'create' ? '新建商品供应商' : '编辑商品供应商'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={supplierForm}
          layout="vertical"
        >
          {/* 基本信息 */}
          <Card 
            title="基本信息" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="供应商编码"
                  rules={[{ required: true, message: '请输入供应商编码' }]}
                >
                  <Input placeholder="请输入供应商编码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="供应商名称"
                  rules={[{ required: true, message: '请输入供应商名称' }]}
                >
                  <Input placeholder="请输入供应商名称" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="contactPerson"
                  label="联系人"
                  rules={[{ required: true, message: '请输入联系人' }]}
                >
                  <Input placeholder="请输入联系人" />
                </Form.Item>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入正确的邮箱格式' }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="qualificationNumber"
                  label="资质证书号"
                  rules={[{ required: true, message: '请输入资质证书号' }]}
                >
                  <Input placeholder="请输入资质证书号" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="企业地址"
              rules={[{ required: true, message: '请输入企业地址' }]}
            >
              <Input placeholder="请输入企业地址" />
            </Form.Item>
          </Card>

          {/* 经营信息 */}
          <Card 
            title="经营信息" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={12}>
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
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="待审批">待审批</Option>
                    <Option value="正常">正常</Option>
                    <Option value="暂停">暂停</Option>
                    <Option value="已驳回">已驳回</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="remarks" label="备注">
              <Input.TextArea rows={4} placeholder="请输入备注信息（可选）" />
            </Form.Item>
          </Card>

          {/* 附件上传 */}
          <Card 
            title="附件管理" 
            size="small" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="上传附件">
                  <Upload {...uploadProps} fileList={fileList}>
                    <Button icon={<UploadOutlined />}>上传附件</Button>
                  </Upload>
                  <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
                    支持 PDF、Word、Excel 等格式，单个文件不超过10MB
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="上传合同">
                  <Upload {...contractUploadProps} fileList={contractFileList}>
                    <Button icon={<UploadOutlined />}>上传合同</Button>
                  </Upload>
                  <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
                    支持 PDF、Word 等格式，单个文件不超过10MB
                  </div>
                </Form.Item>
              </Col>
            </Row>
            
            {/* 现有附件列表 */}
            {fileList.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>已上传附件：</div>
                <List
                  size="small"
                  dataSource={fileList}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => {
                            const newFileList = fileList.filter(file => file.uid !== item.uid);
                            setFileList(newFileList);
                          }}
                        >
                          删除
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FilePdfOutlined style={{ fontSize: 16, color: '#ff4d4f' }} />}
                        title={item.name}
                        description={item.status === 'done' ? '上传成功' : '上传中...'}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
            
            {/* 现有合同列表 */}
            {contractFileList.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>已上传合同：</div>
                <List
                  size="small"
                  dataSource={contractFileList}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => {
                            const newFileList = contractFileList.filter(file => file.uid !== item.uid);
                            setContractFileList(newFileList);
                          }}
                        >
                          删除
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<ContainerOutlined style={{ fontSize: 16, color: '#1890ff' }} />}
                        title={item.name}
                        description={item.status === 'done' ? '上传成功' : '上传中...'}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      {isViewModalVisible && currentRecord && (
        <Modal
          title="商品供应商详情"
          open={isViewModalVisible}
          onCancel={handleViewModalClose}
          footer={[
            <Button key="close" onClick={handleViewModalClose}>关闭</Button>
          ]}
          width={900}
        >
          <GoodsSupplierViewModal data={currentRecord} />
        </Modal>
      )}
    </div>
  );
};

export default GoodsSupplierManagement;