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

const { Option } = Select;
const { RangePicker } = DatePicker;

const ModifyRecord = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // 模拟数据 - 更新为新的命名规范
  const mockData = [
    {
      id: 1,
      oilCode: '100001',
      oilName: '92号汽油国V',
      operationType: '编辑',
      operatorName: '张三',
      operateTime: '2024-01-20 14:30:25',
      approvalStatus: '审批中',
      changeFields: [
        { field: '默认密度', oldValue: '0.720', newValue: '0.725' },
        { field: '排放等级', oldValue: '国IV', newValue: '国V' }
      ],
      reason: '更新排放标准和密度参数'
    },
    {
      id: 2,
      oilCode: '100002',
      oilName: '92号汽油国VIA',
      operationType: '新建',
      operatorName: '李四',
      operateTime: '2024-01-19 10:15:00',
      approvalStatus: '已审批',
      changeFields: [],
      reason: '新增92号汽油国VIA品种'
    },
    {
      id: 3,
      oilCode: '100003',
      oilName: '95号汽油国V',
      operationType: '编辑',
      operatorName: '王五',
      operateTime: '2024-01-18 16:45:30',
      approvalStatus: '已审批',
      changeFields: [
        { field: '油品简称', oldValue: '95号', newValue: '95#' }
      ],
      reason: '统一简称命名规范'
    },
    {
      id: 4,
      oilCode: '100006',
      oilName: '0号柴油国V',
      operationType: '编辑',
      operatorName: '赵六',
      operateTime: '2024-01-17 09:20:15',
      approvalStatus: '已审批',
      changeFields: [
        { field: '分类', oldValue: '柴油', newValue: '0号' },
        { field: '排放等级', oldValue: '国IV', newValue: '国V' }
      ],
      reason: '更新分类归属和排放标准'
    },
    {
      id: 5,
      oilCode: '100005',
      oilName: '98号汽油国V',
      operationType: '新建',
      operatorName: '孙七',
      operateTime: '2024-01-16 11:30:45',
      approvalStatus: '已拒绝',
      changeFields: [],
      reason: '新增98号汽油品种'
    },
    {
      id: 6,
      oilCode: '100007',
      oilName: '0号柴油国VIA',
      operationType: '新建',
      operatorName: '周八',
      operateTime: '2024-01-15 14:20:30',
      approvalStatus: '审批中',
      changeFields: [],
      reason: '新增0号柴油国VIA品种'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(mockData);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData];
      
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