import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Space,
  DatePicker,
  Descriptions,
  Timeline,
  Tooltip,
  Badge
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GoodsSupplierChangeRecord = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    // 模拟修改记录数据
    const mockData = [
      {
        id: "LOG001",
        supplierName: "统一企业中国投资有限公司",
        supplierId: "GS001",
        changeType: "update",
        changeField: "联系信息",
        changeDescription: "更新联系人电话号码",
        operator: "张三",
        operatorId: "USER001",
        changeTime: "2024-01-18 14:30:25",
        oldValue: { contactPhone: "13812345678" },
        newValue: { contactPhone: "13812345679" },
        reason: "联系人更换手机号",
        approver: "李经理",
        status: "approved"
      },
      {
        id: "LOG002",
        supplierName: "康师傅控股有限公司",
        supplierId: "GS002",
        changeType: "create",
        changeField: "基本信息",
        changeDescription: "新建商品供应商",
        operator: "王五",
        operatorId: "USER002",
        changeTime: "2024-01-17 10:15:00",
        oldValue: null,
        newValue: {
          name: "康师傅控股有限公司",
          code: "KMF001",
          level: "A"
        },
        reason: "新增合作供应商",
        approver: "李经理",
        status: "approved"
      },
      {
        id: "LOG003",
        supplierName: "旺旺集团",
        supplierId: "GS003",
        changeType: "update",
        changeField: "经营信息",
        changeDescription: "调整供应商等级",
        operator: "赵六",
        operatorId: "USER003",
        changeTime: "2024-01-16 16:45:30",
        oldValue: { level: "B" },
        newValue: { level: "A" },
        reason: "合作表现优秀，提升等级",
        approver: "李经理",
        status: "pending"
      }
    ];
    setDataSource(mockData);
  }, []);

  // 变更对比渲染函数
  const renderValueComparison = (record) => {
    const { changeType, oldValue, newValue } = record;

    if (changeType === 'create') {
      return (
        <div>
          {newValue && Object.entries(newValue).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{key}:</span>
              <Tag color="green" style={{ marginLeft: 8 }}>{value}</Tag>
            </div>
          ))}
        </div>
      );
    }

    if (changeType === 'delete') {
      return (
        <div>
          {oldValue && Object.entries(oldValue).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{key}:</span>
              <Tag color="red" style={{ marginLeft: 8 }}>{value}</Tag>
            </div>
          ))}
        </div>
      );
    }

    if (changeType === 'update') {
      const allKeys = new Set([
        ...Object.keys(oldValue || {}),
        ...Object.keys(newValue || {})
      ]);

      return (
        <div>
          {Array.from(allKeys).map(key => {
            const oldVal = oldValue?.[key];
            const newVal = newValue?.[key];
            
            if (oldVal !== newVal) {
              return (
                <div key={key} style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>{key}:</span>
                  {oldVal && <Tag color="red" style={{ marginLeft: 8 }}>原值: {oldVal}</Tag>}
                  {newVal && <Tag color="green" style={{ marginLeft: 8 }}>新值: {newVal}</Tag>}
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }

    return null;
  };

  const columns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160,
      sorter: true,
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: '供应商信息',
      key: 'supplierInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.supplierName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.supplierId}</div>
        </div>
      )
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => {
        const typeConfig = {
          create: { color: 'success', text: '新建', icon: <PlusOutlined /> },
          update: { color: 'warning', text: '修改', icon: <EditOutlined /> },
          delete: { color: 'error', text: '删除', icon: <DeleteOutlined /> }
        };
        const config = typeConfig[type] || typeConfig.update;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
      key: 'changeField',
      width: 120,
      render: (field) => <Tag color="blue">{field}</Tag>
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text && text.length > 20 ? `${text.substring(0, 20)}...` : text}</span>
        </Tooltip>
      )
    },
    {
      title: '操作人',
      key: 'operatorInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.operator}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.operatorId}</div>
        </div>
      )
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          approved: { status: 'success', text: '已通过' },
          pending: { status: 'warning', text: '待审批' },
          rejected: { status: 'error', text: '已拒绝' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge status={config.status} text={config.text} />;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          style={{ borderRadius: '2px' }}
        >
          查看详情
        </Button>
      )
    }
  ];

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实际项目中这里会调用API
  };

  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setModalVisible(true);
  };

  const timelineItems = currentRecord ? [
    {
      color: 'blue',
      children: (
        <div>
          <div style={{ fontWeight: 500 }}>提交变更</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {currentRecord.changeTime} - {currentRecord.operator}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            变更原因：{currentRecord.reason}
          </div>
        </div>
      )
    },
    currentRecord.status === 'approved' ? {
      color: 'green',
      children: (
        <div>
          <div style={{ fontWeight: 500 }}>审批通过</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {currentRecord.changeTime} - {currentRecord.approver}
          </div>
        </div>
      )
    } : currentRecord.status === 'rejected' ? {
      color: 'red',
      children: (
        <div>
          <div style={{ fontWeight: 500 }}>审批拒绝</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {currentRecord.changeTime} - {currentRecord.approver}
          </div>
        </div>
      )
    } : {
      color: 'gray',
      children: (
        <div>
          <div style={{ fontWeight: 500 }}>等待审批</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            审批人：{currentRecord.approver}
          </div>
        </div>
      )
    }
  ] : [];

  return (
    <div>
      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="供应商名称、ID、操作人等" style={{ width: 200 }} allowClear />
          </Form.Item>
          
          <Form.Item name="changeType" label="变更类型">
            <Select placeholder="请选择变更类型" style={{ width: 120 }} allowClear>
              <Option value="create">新建</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="changeField" label="变更字段">
            <Select placeholder="请选择变更字段" style={{ width: 120 }} allowClear>
              <Option value="基本信息">基本信息</Option>
              <Option value="联系信息">联系信息</Option>
              <Option value="经营信息">经营信息</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
              <Option value="approved">已通过</Option>
              <Option value="pending">待审批</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="timeRange" label="时间范围">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={() => searchForm.resetFields()} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 记录列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={<span><HistoryOutlined /> 变更详情</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>关闭</Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <div>
            {/* 基本信息 */}
            <Descriptions
              title="基本信息"
              column={2}
              bordered
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="记录ID">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="供应商名称">{currentRecord.supplierName}</Descriptions.Item>
              <Descriptions.Item label="变更类型">
                <Tag color={
                  currentRecord.changeType === 'create' ? 'green' :
                  currentRecord.changeType === 'update' ? 'orange' : 'red'
                }>
                  {currentRecord.changeType === 'create' ? '新建' :
                   currentRecord.changeType === 'update' ? '修改' : '删除'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="变更字段">{currentRecord.changeField}</Descriptions.Item>
              <Descriptions.Item label="操作人">{currentRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="变更时间">{currentRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="变更原因" span={2}>{currentRecord.reason}</Descriptions.Item>
            </Descriptions>

            <Row gutter={16}>
              <Col span={12}>
                {/* 变更详情 */}
                <Card title="变更详情" size="small">
                  {renderValueComparison(currentRecord)}
                </Card>
              </Col>
              <Col span={12}>
                {/* 操作流程 */}
                <Card title="操作流程" size="small">
                  <Timeline items={timelineItems} />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GoodsSupplierChangeRecord;