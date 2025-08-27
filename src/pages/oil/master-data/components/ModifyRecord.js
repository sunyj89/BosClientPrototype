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
  Descriptions 
} from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import mockData from '../../../../mock/oil/master-data.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
      setDataSource(mockData.modifyRecordList);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData.modifyRecordList];
      
      if (values.oilName) {
        filteredData = filteredData.filter(item => 
          item.oilName.includes(values.oilName)
        );
      }
      
      if (values.operationType) {
        filteredData = filteredData.filter(item => 
          item.operationType === values.operationType
        );
      }
      
      if (values.approvalStatus) {
        filteredData = filteredData.filter(item => 
          item.approvalStatus === values.approvalStatus
        );
      }
      
      if (values.operatorName) {
        filteredData = filteredData.filter(item => 
          item.operatorName.includes(values.operatorName)
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

  const getOperationTypeColor = (type) => {
    switch (type) {
      case '新建':
        return 'green';
      case '编辑':
        return 'blue';
      case '删除':
        return 'red';
      default:
        return 'default';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case '已审批':
        return 'green';
      case '审批中':
        return 'orange';
      case '已拒绝':
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
    },
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      width: 180,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (type) => (
        <Tag color={getOperationTypeColor(type)}>{type}</Tag>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 160,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (status) => (
        <Tag color={getApprovalStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '变更原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      ellipsis: true,
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
      ),
    },
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
        <Form.Item name="oilName" label="油品名称">
          <Input placeholder="请输入油品名称" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="operationType" label="操作类型">
          <Select placeholder="请选择操作类型" style={{ width: 120 }} allowClear>
            <Option value="新建">新建</Option>
            <Option value="编辑">编辑</Option>
            <Option value="删除">删除</Option>
          </Select>
        </Form.Item>
        <Form.Item name="approvalStatus" label="审批状态">
          <Select placeholder="请选择审批状态" style={{ width: 120 }} allowClear>
            <Option value="审批中">审批中</Option>
            <Option value="已审批">已审批</Option>
            <Option value="已拒绝">已拒绝</Option>
          </Select>
        </Form.Item>
        <Form.Item name="operatorName" label="操作人">
          <Input placeholder="请输入操作人" style={{ width: 120 }} />
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
        width={800}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="油品编号">{selectedRecord.oilCode}</Descriptions.Item>
            <Descriptions.Item label="油品名称">{selectedRecord.oilName}</Descriptions.Item>
            <Descriptions.Item label="操作类型">
              <Tag color={getOperationTypeColor(selectedRecord.operationType)}>
                {selectedRecord.operationType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作人">{selectedRecord.operatorName}</Descriptions.Item>
            <Descriptions.Item label="操作时间">{selectedRecord.operateTime}</Descriptions.Item>
            <Descriptions.Item label="审批状态">
              <Tag color={getApprovalStatusColor(selectedRecord.approvalStatus)}>
                {selectedRecord.approvalStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="变更原因" span={2}>
              {selectedRecord.reason}
            </Descriptions.Item>
            {selectedRecord.changeFields && selectedRecord.changeFields.length > 0 && (
              <Descriptions.Item label="变更内容" span={2}>
                <Table
                  size="small"
                  dataSource={selectedRecord.changeFields}
                  pagination={false}
                  rowKey="field"
                  columns={[
                    {
                      title: '字段名称',
                      dataIndex: 'field',
                      key: 'field',
                      width: 120,
                    },
                    {
                      title: '原值',
                      dataIndex: 'oldValue',
                      key: 'oldValue',
                    },
                    {
                      title: '新值',
                      dataIndex: 'newValue',
                      key: 'newValue',
                    },
                  ]}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ModifyRecord; 