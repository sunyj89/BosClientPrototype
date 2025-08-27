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
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const NDRCPriceMaintenance = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [oilOptions, setOilOptions] = useState([]);

  useEffect(() => {
    initializeData();
    loadData();
  }, []);

  const initializeData = () => {
    // 设置油品选项
    setOilOptions(oilMasterData.oilList);
  };

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(mockData.ndrcPriceList);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData.ndrcPriceList];
      
      if (values.province) {
        filteredData = filteredData.filter(item => 
          item.province === values.province
        );
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
      
      if (values.status) {
        filteredData = filteredData.filter(item => 
          item.status === values.status
        );
      }
      
      if (values.adjustmentNotice) {
        filteredData = filteredData.filter(item => 
          item.adjustmentNotice.includes(values.adjustmentNotice)
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
      effectiveTime: record.effectiveTime ? moment(record.effectiveTime) : null,
      publishTime: record.publishTime ? moment(record.publishTime) : null
    });
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除${record.oilName}的发改委价格吗？`,
      onOk() {
        setLoading(true);
        setTimeout(() => {
          const updatedData = dataSource.filter(item => item.id !== record.id);
          setDataSource(updatedData);
          message.success('删除成功');
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
          effectiveTime: values.effectiveTime ? values.effectiveTime.format('YYYY-MM-DD 00:00:00') : null,
          publishTime: values.publishTime ? values.publishTime.format('YYYY-MM-DD HH:mm:ss') : null
        };

        if (modalType === 'create') {
          const selectedOil = oilOptions.find(o => o.code === values.oilCode);
          const newRecord = {
            ...formattedValues,
            id: `NP${Date.now()}`,
            oilName: selectedOil ? selectedOil.name : '',
            oilType: selectedOil ? selectedOil.oilType : ''
          };
          
          setDataSource([...dataSource, newRecord]);
          message.success('创建成功');
        } else if (modalType === 'edit') {
          const updatedData = dataSource.map(item => 
            item.id === selectedRecord.id 
              ? { ...item, ...formattedValues }
              : item
          );
          setDataSource(updatedData);
          message.success('编辑成功');
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
      case '待生效':
        return 'orange';
      case '已失效':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      width: 80
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
      title: '当前价格(元/升)',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 130,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '调价通知文号',
      dataIndex: 'adjustmentNotice',
      key: 'adjustmentNotice',
      width: 160,
      ellipsis: true
    },
    {
      title: '生效时间',
      dataIndex: 'effectiveTime',
      key: 'effectiveTime',
      width: 160
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      ellipsis: true
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
        <Form.Item name="province" label="省份">
          <Select
            placeholder="请选择省份"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="江西">江西</Option>
            <Option value="湖北">湖北</Option>
            <Option value="湖南">湖南</Option>
            <Option value="安徽">安徽</Option>
          </Select>
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
        <Form.Item name="status" label="状态">
          <Select
            placeholder="请选择状态"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="生效">生效</Option>
            <Option value="待生效">待生效</Option>
            <Option value="已失效">已失效</Option>
          </Select>
        </Form.Item>
        <Form.Item name="adjustmentNotice" label="调价通知文号">
          <Input
            placeholder="请输入调价通知文号"
            style={{ width: 160 }}
            allowClear
          />
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
          新建发改委价格
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
        title={modalType === 'create' ? '新建发改委价格' : '编辑发改委价格'}
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
            <Col span={8}>
              <Form.Item
                name="province"
                label="省份"
                rules={[{ required: true, message: '请选择省份' }]}
              >
                <Select placeholder="请选择省份">
                  <Option value="江西">江西</Option>
                  <Option value="湖北">湖北</Option>
                  <Option value="湖南">湖南</Option>
                  <Option value="安徽">安徽</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="currentPrice"
                label="当前价格(元/升)"
                rules={[{ required: true, message: '请输入当前价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  precision={2}
                  placeholder="请输入当前价格"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="adjustmentNotice"
                label="调价通知文号"
                rules={[{ required: true, message: '请输入调价通知文号' }]}
              >
                <Input placeholder="例如：发改价格〔2024〕123号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="生效">生效</Option>
                  <Option value="待生效">待生效</Option>
                  <Option value="已失效">已失效</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="effectiveTime"
                label="生效时间"
                rules={[{ required: true, message: '请选择生效时间' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择生效时间(自动设为00:00:00)"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="publishTime"
                label="发布时间"
                rules={[{ required: true, message: '请选择发布时间' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder="请选择发布时间"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea 
              rows={4} 
              placeholder="请输入备注信息"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="发改委价格详情"
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
            <Descriptions.Item label="省份">{selectedRecord.province}</Descriptions.Item>
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
            <Descriptions.Item label="当前价格">¥{selectedRecord.currentPrice.toFixed(2)}/升</Descriptions.Item>
            <Descriptions.Item label="调价通知文号" span={2}>
              {selectedRecord.adjustmentNotice}
            </Descriptions.Item>
            <Descriptions.Item label="生效时间">{selectedRecord.effectiveTime}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{selectedRecord.publishTime}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getStatusColor(selectedRecord.status)}>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {selectedRecord.remark || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default NDRCPriceMaintenance;
