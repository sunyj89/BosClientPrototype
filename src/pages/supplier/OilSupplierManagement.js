import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  Tabs,
  Upload,
  Checkbox,
  Timeline,
  Card,
  Descriptions,
  List
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  UploadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  FilePdfOutlined,
  FileOutlined,
  ContainerOutlined
} from '@ant-design/icons';

// 导入模拟数据
import oilSupplierData from '../../mock/supplier/oilSupplierData.json';
import oilSupplierChangeRecord from '../../mock/supplier/oilSupplierChangeRecord.json';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const OilSupplierManagement = () => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [supplierData, setSupplierData] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [contractFileList, setContractFileList] = useState([]);
  const [approvalFlow, setApprovalFlow] = useState([]);

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = () => {
    setLoading(true);
    // 使用导入的模拟数据
    try {
      setSupplierData(oilSupplierData.oilSuppliers);
      setChangeRecords(oilSupplierChangeRecord.changeRecords);
      setLoading(false);
    } catch (err) {
      console.error('获取数据失败:', err);
      setLoading(false);
      message.error('获取数据失败');
    }
  };

  // 处理筛选
  const handleFilter = (values) => {
    setLoading(true);
    
    // 模拟筛选过程
    setTimeout(() => {
      let filtered = [...supplierData];
      
      if (values.supplierName) {
        filtered = filtered.filter(item => 
          item.name.includes(values.supplierName)
        );
      }
      
      if (values.supplierCode) {
        filtered = filtered.filter(item => 
          item.code.includes(values.supplierCode)
        );
      }
      
      if (values.oilTypes && values.oilTypes.length > 0) {
        filtered = filtered.filter(item => 
          values.oilTypes.some(type => item.oilTypes.includes(type))
        );
      }
      
      if (values.status) {
        filtered = filtered.filter(item => 
          item.status === values.status
        );
      }
      
      setSupplierData(filtered);
      setLoading(false);
    }, 300);
  };

  // 重置筛选
  const resetFilter = () => {
    filterForm.resetFields();
    fetchData();
  };

  // 添加/编辑供应商
  const handleAddEdit = (record = null) => {
    setCurrentRecord(record);
    if (record) {
      form.setFieldsValue({
        ...record
      });
    } else {
      form.resetFields();
    }
    setFileList([]);
    setContractFileList([]);
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      
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
      
      // 模拟提交
      setTimeout(() => {
        if (currentRecord) {
          // 更新现有记录
          const newData = supplierData.map(item => 
            item.id === currentRecord.id ? { ...item, ...formData } : item
          );
          setSupplierData(newData);
          message.success('供应商信息已更新');
        } else {
          // 添加新记录
          const newId = `OS${String(supplierData.length + 1).padStart(3, '0')}`;
          const newSupplier = {
            ...formData,
            id: newId
          };
          setSupplierData([...supplierData, newSupplier]);
          message.success('供应商已添加');
        }
        
        setModalVisible(false);
        setLoading(false);
      }, 500);
    });
  };

  // 文件上传的处理函数
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

  // 删除记录
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除供应商 ${record.name} 吗？`,
      onOk() {
        setLoading(true);
        setTimeout(() => {
          const newData = supplierData.filter(item => item.id !== record.id);
          setSupplierData(newData);
          setLoading(false);
          message.success('供应商已删除');
        }, 300);
      }
    });
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    // 模拟获取审批流程数据
    const mockApprovalFlow = [
      {
        key: '1',
        nodeName: '提交申请',
        operator: '张三',
        status: '已完成',
        time: '2024-05-01 09:30:00',
        comment: '已提交供应商申请'
      },
      {
        key: '2',
        nodeName: '部门经理审批',
        operator: '李四',
        status: record.status === '待审批' ? '进行中' : (record.status === '已驳回' ? '已驳回' : '已完成'),
        time: record.status === '待审批' ? '' : '2024-05-01 14:15:00',
        comment: record.status === '已驳回' ? '资质不符合要求，请补充相关材料' : '审核通过'
      },
      {
        key: '3',
        nodeName: '总经理审批',
        operator: '王五',
        status: record.status === '正常' ? '已完成' : '未开始',
        time: record.status === '正常' ? '2024-05-02 10:25:00' : '',
        comment: record.status === '正常' ? '同意合作' : ''
      }
    ];
    
    // 模拟附件和合同数据
    if (!record.attachments) {
      record.attachments = [
        { name: '营业执照副本.pdf', url: 'https://example.com/license.pdf' },
        { name: '资质证书.pdf', url: 'https://example.com/qualification.pdf' }
      ];
    }
    
    if (!record.contracts) {
      record.contracts = [
        { name: '框架合作协议.pdf', url: 'https://example.com/framework.pdf' },
        { name: '供油协议2024.pdf', url: 'https://example.com/oil-supply-2024.pdf' }
      ];
    }
    
    setApprovalFlow(mockApprovalFlow);
    setDetailModalVisible(true);
  };

  // 查看附件
  const handleViewAttachment = (file) => {
    Modal.info({
      title: '附件预览',
      content: (
        <div>
          <p>文件名: {file.name}</p>
          <p>文件链接: <a href={file.url} target="_blank" rel="noopener noreferrer">{file.url}</a></p>
          <p>在实际生产环境中，这里可以使用文档预览组件展示PDF或其他文档内容</p>
        </div>
      ),
      width: 600,
    });
  };

  // 查看合同
  const handleViewContract = (file) => {
    Modal.info({
      title: '合同预览',
      content: (
        <div>
          <p>合同名称: {file.name}</p>
          <p>合同链接: <a href={file.url} target="_blank" rel="noopener noreferrer">{file.url}</a></p>
          <p>在实际生产环境中，这里可以使用文档预览组件展示PDF或其他文档内容</p>
        </div>
      ),
      width: 600,
    });
  };

  // 供应商列表列配置
  const supplierColumns = [
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
      width: 130,
    },
    {
      title: '油品类型',
      dataIndex: 'oilTypes',
      key: 'oilTypes',
      width: 250,
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
        let color = level === 'A' ? 'green' : level === 'B' ? 'orange' : 'red';
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colorMap = {
          '正常': 'green',
          '暂停': 'red',
          '待审批': 'blue',
          '已驳回': 'orange'
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
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
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 变更记录列配置
  const changeRecordColumns = [
    {
      title: '记录ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
      key: 'changeField',
      width: 120,
    },
    {
      title: '原值',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 150,
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 150,
    },
    {
      title: '变更人',
      dataIndex: 'changeUser',
      key: 'changeUser',
      width: 100,
    },
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (status) => (
        <Tag color={status === '已审批' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      width: 150,
    }
  ];

  // 上传组件的属性
  const uploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // 模拟上传地址
    headers: {
      authorization: 'authorization-text',
    },
    onChange: handleFileChange,
  };

  // 合同上传组件的属性
  const contractUploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // 模拟上传地址
    headers: {
      authorization: 'authorization-text',
    },
    onChange: handleContractFileChange,
  };

  return (
    <div className="oil-supplier-page">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="油品供应商列表" key="1">
          <div className="filter-section" style={{ padding: '16px', marginBottom: '16px', background: '#f9f9f9' }}>
            <Form
              form={filterForm}
              layout="inline"
              onFinish={handleFilter}
            >
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                <Col span={6}>
                  <Form.Item
                    name="supplierName"
                    label="供应商名称"
                  >
                    <Input placeholder="请输入供应商名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="supplierCode"
                    label="供应商代码"
                  >
                    <Input placeholder="请输入供应商代码" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="oilTypes"
                    label="油品类型"
                  >
                    <Select
                      mode="multiple"
                      placeholder="请选择油品类型"
                      allowClear
                    >
                      <Option value="92#汽油">92#汽油</Option>
                      <Option value="95#汽油">95#汽油</Option>
                      <Option value="98#汽油">98#汽油</Option>
                      <Option value="0#柴油">0#柴油</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="status"
                    label="状态"
                  >
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="待审批">待审批</Option>
                      <Option value="已驳回">已驳回</Option>
                      <Option value="正常">正常</Option>
                      <Option value="暂停">暂停</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        查询
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={resetFilter}>
                        重置
                      </Button>
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddEdit()}>
                        新建
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            columns={supplierColumns}
            dataSource={supplierData}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
        
        <TabPane tab="供应商信息变更记录" key="2">
          <Table
            columns={changeRecordColumns}
            dataSource={changeRecords}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={currentRecord ? '编辑供应商' : '添加供应商'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        confirmLoading={loading}
        okText="提交审批"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="供应商名称"
                rules={[{ required: true, message: '请输入供应商名称' }]}
              >
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="供应商代码"
                rules={[{ required: true, message: '请输入供应商代码' }]}
              >
                <Input placeholder="请输入供应商代码" />
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
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[
                  { type: 'email', message: '邮箱格式不正确' },
                  { required: true, message: '请输入电子邮箱' }
                ]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="oilTypes"
                label="油品类型"
                rules={[{ required: true, message: '请选择油品类型' }]}
              >
                <Select mode="multiple" placeholder="请选择油品类型">
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
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
                  <Option value="正常">正常</Option>
                  <Option value="暂停">暂停</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="address"
                label="地址"
                rules={[{ required: true, message: '请输入地址' }]}
              >
                <Input placeholder="请输入地址" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="qualificationNumber"
                label="资质证书编号"
              >
                <Input placeholder="请输入资质证书编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="上传附件"
              >
                <Upload {...uploadProps} fileList={fileList}>
                  <Button icon={<UploadOutlined />}>上传附件</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="上传合同"
              >
                <Upload {...contractUploadProps} fileList={contractFileList}>
                  <Button icon={<UploadOutlined />}>上传合同</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 供应商详情与审批流程模态框 */}
      <Modal
        title="供应商详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <>
            <Descriptions 
              title="基本信息" 
              bordered 
              column={2}
              style={{ marginBottom: 20 }}
            >
              <Descriptions.Item label="供应商ID">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="供应商名称">{currentRecord.name}</Descriptions.Item>
              <Descriptions.Item label="供应商代码">{currentRecord.code}</Descriptions.Item>
              <Descriptions.Item label="联系人">{currentRecord.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentRecord.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱">{currentRecord.email}</Descriptions.Item>
              <Descriptions.Item label="地址">{currentRecord.address}</Descriptions.Item>
              <Descriptions.Item label="等级">{currentRecord.level}</Descriptions.Item>
              <Descriptions.Item label="油品类型">
                {currentRecord.oilTypes?.map(type => (
                  <Tag color="blue" key={type}>{type}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '正常' ? 'green' : 
                  currentRecord.status === '暂停' ? 'red' :
                  currentRecord.status === '待审批' ? 'blue' : 'orange'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <Card title="附件" style={{ marginTop: 20, marginBottom: 20 }}>
              <List
                itemLayout="horizontal"
                dataSource={currentRecord.attachments || []}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        size="small" 
                        onClick={() => handleViewAttachment(item)}
                      >
                        查看
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
                      title={item.name}
                      description={item.url}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card title="合同" style={{ marginTop: 20, marginBottom: 20 }}>
              <List
                itemLayout="horizontal"
                dataSource={currentRecord.contracts || []}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        size="small" 
                        onClick={() => handleViewContract(item)}
                      >
                        查看
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<ContainerOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                      title={item.name}
                      description={item.url}
                    />
                  </List.Item>
                )}
              />
            </Card>
            
            <Card title="审批流程" style={{ marginTop: 20 }}>
              <Timeline>
                {approvalFlow.map(item => (
                  <Timeline.Item
                    key={item.key}
                    color={
                      item.status === '已完成' ? 'green' : 
                      item.status === '进行中' ? 'blue' : 
                      item.status === '已驳回' ? 'red' : 'gray'
                    }
                    dot={
                      item.status === '已完成' ? <CheckCircleOutlined /> : 
                      item.status === '进行中' ? <LoadingOutlined /> : 
                      item.status === '已驳回' ? <CloseCircleOutlined /> : null
                    }
                  >
                    <div style={{ marginBottom: 10 }}>
                      <b>{item.nodeName}</b> - {item.operator}
                      <div style={{ float: 'right' }}>
                        <Tag color={
                          item.status === '已完成' ? 'green' : 
                          item.status === '进行中' ? 'blue' : 
                          item.status === '已驳回' ? 'red' : 'default'
                        }>
                          {item.status}
                        </Tag>
                      </div>
                    </div>
                    {item.time && <div>时间: {item.time}</div>}
                    {item.comment && <div>审批意见: {item.comment}</div>}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default OilSupplierManagement; 