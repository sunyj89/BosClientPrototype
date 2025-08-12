import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Form, 
  Input, 
  Select, 
  DatePicker,
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
const { RangePicker } = DatePicker;
const { Text } = Typography;

const ModifyRecord = ({ setLoading }) => {
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
      setDataSource(mockData.modifyRecords);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData.modifyRecords];
      
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
      
      if (values.operationType) {
        filteredData = filteredData.filter(item => 
          item.operationType === values.operationType
        );
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => 
          item.status === values.status
        );
      }
      
      if (values.operator) {
        filteredData = filteredData.filter(item => 
          item.operator.includes(values.operator)
        );
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const [startDate, endDate] = values.dateRange;
        filteredData = filteredData.filter(item => {
          const operateTime = new Date(item.operateTime);
          return operateTime >= startDate.startOf('day').toDate() && 
                 operateTime <= endDate.endOf('day').toDate();
        });
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

  const getOperationTypeColor = (type) => {
    switch (type) {
      case '创建配置':
        return 'green';
      case '修改配置':
        return 'blue';
      case '删除配置':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '已审批':
        return 'green';
      case '审批中':
        return 'orange';
      case '被驳回':
        return 'red';
      case '待提交':
        return 'blue';
      default:
        return 'default';
    }
  };

  const renderDataComparison = (oldData, newData, operationType) => {
    if (operationType === '创建配置' && newData) {
      return (
        <div>
          <h4>新增数据：</h4>
          {Object.entries(newData).map(([key, value]) => (
            <p key={key}><Text strong>{key}：</Text>{value}</p>
          ))}
        </div>
      );
    } else if (operationType === '删除配置' && oldData) {
      return (
        <div>
          <h4>删除数据：</h4>
          {Object.entries(oldData).map(([key, value]) => (
            <p key={key}><Text strong>{key}：</Text>{value}</p>
          ))}
        </div>
      );
    } else if (operationType === '修改配置' && oldData && newData) {
      return (
        <div>
          <h4>数据变更对比：</h4>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <h5>修改前：</h5>
              {Object.entries(oldData).map(([key, value]) => (
                <p key={key}><Text strong>{key}：</Text>{value}</p>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <h5>修改后：</h5>
              {Object.entries(newData).map(([key, value]) => (
                <p key={key}><Text strong>{key}：</Text>{value}</p>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const columns = [
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
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (type) => (
        <Tag color={getOperationTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: '变更原因',
      dataIndex: 'changeReason',
      key: 'changeReason',
      width: 200,
      ellipsis: true
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 160
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
      render: (approver) => approver || '-'
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      width: 160,
      render: (time) => time || '-'
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
        <Form.Item name="operationType" label="操作类型">
          <Select placeholder="请选择操作类型" style={{ width: 120 }} allowClear>
            <Option value="创建配置">创建配置</Option>
            <Option value="修改配置">修改配置</Option>
            <Option value="删除配置">删除配置</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="审批状态">
          <Select placeholder="请选择审批状态" style={{ width: 120 }} allowClear>
            <Option value="待提交">待提交</Option>
            <Option value="审批中">审批中</Option>
            <Option value="已审批">已审批</Option>
            <Option value="被驳回">被驳回</Option>
          </Select>
        </Form.Item>
        <Form.Item name="operator" label="操作人">
          <Input placeholder="请输入操作人" style={{ width: 120 }} allowClear />
        </Form.Item>
        <Form.Item name="dateRange" label="操作时间">
          <RangePicker style={{ width: 250 }} />
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
        title="修改记录详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {selectedRecord && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="配置ID">{selectedRecord.configId}</Descriptions.Item>
              <Descriptions.Item label="配置名称">{selectedRecord.configName}</Descriptions.Item>
              <Descriptions.Item label="操作类型">
                <Tag color={getOperationTypeColor(selectedRecord.operationType)}>
                  {selectedRecord.operationType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作人">{selectedRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="操作时间">{selectedRecord.operateTime}</Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="审批人">{selectedRecord.approver || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批时间">{selectedRecord.approveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="变更原因" span={2}>
                {selectedRecord.changeReason}
              </Descriptions.Item>
              {selectedRecord.rejectReason && (
                <Descriptions.Item label="驳回原因" span={2}>
                  <span style={{ color: '#f5222d' }}>{selectedRecord.rejectReason}</span>
                </Descriptions.Item>
              )}
            </Descriptions>
            
            {/* 数据变更对比 */}
            {renderDataComparison(selectedRecord.oldData, selectedRecord.newData, selectedRecord.operationType)}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModifyRecord;
