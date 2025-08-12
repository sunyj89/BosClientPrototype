import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Descriptions,
  Alert,
  Typography
} from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import mockData from '../../../../mock/marketing/price-discount-config.json';

const { Option } = Select;
const { Text } = Typography;

const DiscountRules = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(mockData.discountRules);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData.discountRules];
      
      if (values.configId) {
        filteredData = filteredData.filter(item => 
          item.configId.includes(values.configId)
        );
      }
      
      if (values.configName) {
        filteredData = filteredData.filter(item => 
          item.configName.includes(values.configName)
        );
      }
      
      if (values.oilName) {
        filteredData = filteredData.filter(item => 
          item.oilName.includes(values.oilName)
        );
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => 
          item.status === values.status
        );
      }
      
      if (values.creator) {
        filteredData = filteredData.filter(item => 
          item.creator.includes(values.creator)
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

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setIsDetailVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '生效中':
        return 'green';
      case '审批中':
        return 'orange';
      case '已失效':
        return 'red';
      default:
        return 'default';
    }
  };

  const renderConditions = (conditions) => {
    if (!conditions || conditions.length === 0) return '-';
    
    return conditions.map((condition, index) => (
      <div key={index} style={{ marginBottom: 4 }}>
        {condition.rangeType}：{condition.minAmount}-{condition.maxAmount}
        {condition.rangeType === '金额' ? '元' : '升'}，
        优惠：{condition.discountValue}{condition.unit}
      </div>
    ));
  };

  const columns = [
    {
      title: '规则ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '配置ID',
      dataIndex: 'configId',
      key: 'configId',
      width: 140
    },
    {
      title: '配置名称',
      dataIndex: 'configName',
      key: 'configName',
      width: 160
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 160
    },
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      width: 140
    },
    {
      title: '优惠条件',
      dataIndex: 'conditions',
      key: 'conditions',
      width: 280,
      render: renderConditions
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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
        style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}
      >
        <Form.Item name="configId" label="配置ID">
          <Input placeholder="请输入配置ID" style={{ width: 140 }} allowClear />
        </Form.Item>
        <Form.Item name="configName" label="配置名称">
          <Input placeholder="请输入配置名称" style={{ width: 140 }} allowClear />
        </Form.Item>
        <Form.Item name="oilName" label="油品名称">
          <Input placeholder="请输入油品名称" style={{ width: 140 }} allowClear />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
            <Option value="生效中">生效中</Option>
            <Option value="审批中">审批中</Option>
            <Option value="已失效">已失效</Option>
          </Select>
        </Form.Item>
        <Form.Item name="creator" label="创建人">
          <Input placeholder="请输入创建人" style={{ width: 120 }} allowClear />
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

      {/* 详情弹窗 */}
      <Modal
        title="优惠规则详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="规则ID">{selectedRecord.id}</Descriptions.Item>
              <Descriptions.Item label="配置ID">{selectedRecord.configId}</Descriptions.Item>
              <Descriptions.Item label="配置名称">{selectedRecord.configName}</Descriptions.Item>
              <Descriptions.Item label="规则名称">{selectedRecord.ruleName}</Descriptions.Item>
              <Descriptions.Item label="油品编号">{selectedRecord.oilCode}</Descriptions.Item>
              <Descriptions.Item label="油品名称">{selectedRecord.oilName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="创建人">{selectedRecord.creator}</Descriptions.Item>
            </Descriptions>
            
            {/* 优惠条件详情 */}
            <div>
              <h4>优惠条件详情:</h4>
              {selectedRecord.conditions && selectedRecord.conditions.map((condition, index) => (
                <Alert
                  key={index}
                  message={`条件${index + 1}`}
                  description={
                    <div>
                      <p><Text strong>范围类型：</Text>{condition.rangeType}</p>
                      <p><Text strong>范围：</Text>{condition.minAmount} - {condition.maxAmount} {condition.rangeType === '金额' ? '元' : '升'}</p>
                      <p><Text strong>优惠值：</Text>{condition.discountValue} {condition.unit}</p>
                    </div>
                  }
                  type="info"
                  style={{ marginBottom: 8 }}
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DiscountRules;
