import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  DatePicker,
  Modal,
  Descriptions,
  Timeline,
  Tag,
  Badge,
  Tooltip,
  Row,
  Col,
  message
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  HistoryOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';

// 导入模拟数据 - 根据模块类型动态加载
const getModuleMockData = (moduleType) => {
  switch (moduleType) {
    case 'invoice':
      return [
        {
          id: "LOG001",
          productId: "INV001",
          productName: "发票开票记录",
          changeType: "create",
          changeField: "开票信息",
          changeDescription: "新建发票开票记录",
          operator: "张三",
          operatorId: "USER001",
          changeTime: "2025-01-18 14:30:25",
          oldValue: null,
          newValue: { 
            invoiceNo: "INV20250118001", 
            amount: 1000.00,
            buyerName: "江西交投化石能源公司"
          },
          reason: "客户申请开票",
          approver: "李经理",
          status: "approved"
        },
        {
          id: "LOG002",
          productId: "INV001",
          productName: "发票开票记录",
          changeType: "update",
          changeField: "发票状态",
          changeDescription: "更新发票状态为已开具",
          operator: "李四",
          operatorId: "USER002",
          changeTime: "2025-01-18 15:45:10",
          oldValue: { status: "申请中" },
          newValue: { status: "已开具" },
          reason: "发票开具完成",
          approver: "王经理",
          status: "approved"
        }
      ];
    case 'invoice-records':
      return [
        {
          id: "LOG005",
          productId: "OR20250118001",
          productName: "开票记录-江西交投化石能源公司",
          changeType: "update",
          changeField: "开票状态",
          changeDescription: "更新开票状态从处理中到开票成功",
          operator: "系统自动",
          operatorId: "SYSTEM",
          changeTime: "2025-01-18 16:20:30",
          oldValue: { invoiceStatus: "03", statusText: "处理中" },
          newValue: { invoiceStatus: "02", statusText: "开票成功", invoiceNo: "00001234567890123" },
          reason: "系统自动开票成功",
          approver: "自动审批",
          status: "approved"
        },
        {
          id: "LOG006",
          productId: "OR20250117001",
          productName: "开票记录-德安服务区加油站",
          changeType: "update",
          changeField: "邮箱地址",
          changeDescription: "修改开票邮箱地址",
          operator: "赵六",
          operatorId: "USER006",
          changeTime: "2025-01-17 14:15:45",
          oldValue: { emailAddress: "old@example.com" },
          newValue: { emailAddress: "new@company.com" },
          reason: "客户要求更改邮箱",
          approver: "孙经理",
          status: "approved"
        },
        {
          id: "LOG007",
          productId: "OR20250116001",
          productName: "开票记录-庐山服务区加油站",
          changeType: "create",
          changeField: "红冲申请",
          changeDescription: "创建发票红冲申请",
          operator: "周八",
          operatorId: "USER008",
          changeTime: "2025-01-16 11:30:20",
          oldValue: null,
          newValue: { 
            redInvoiceReason: "开票信息错误",
            redInvoiceAmount: 500.00,
            originalInvoiceNo: "00001234567890120"
          },
          reason: "客户反馈开票信息有误",
          approver: "李经理",
          status: "pending"
        }
      ];
    case 'invoice-settings':
      return [
        {
          id: "LOG003",
          productId: "STATION001",
          productName: "昌北服务区加油站",
          changeType: "update",
          changeField: "税号信息",
          changeDescription: "更新油站税号信息",
          operator: "王五",
          operatorId: "USER003",
          changeTime: "2025-01-17 10:20:15",
          oldValue: { taxNo: "360123456789012" },
          newValue: { taxNo: "360123456789013" },
          reason: "税号变更通知",
          approver: "张经理",
          status: "approved"
        },
        {
          id: "LOG004",
          productId: "PROVIDER001",
          productName: "百望云服务商",
          changeType: "update",
          changeField: "API配置",
          changeDescription: "更新服务商API地址",
          operator: "赵六",
          operatorId: "USER004",
          changeTime: "2025-01-16 16:30:45",
          oldValue: { apiUrl: "https://old.api.com" },
          newValue: { apiUrl: "https://new.api.com" },
          reason: "服务商API升级",
          approver: "李经理",
          status: "approved"
        }
      ];
    default:
      return [];
  }
};

const RecordHistory = ({ moduleType = 'default' }) => {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, [moduleType]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData = getModuleMockData(moduleType);
      setDataSource(mockData.map(item => ({ ...item, key: item.id })));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      // 这里应该是实际的搜索逻辑
      message.success('查询完成');
    } catch (error) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadData();
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const getChangeTypeTag = (type) => {
    const typeMap = {
      create: { color: 'success', icon: <PlusOutlined />, text: '新建' },
      update: { color: 'warning', icon: <EditOutlined />, text: '修改' },
      delete: { color: 'error', icon: <DeleteOutlined />, text: '删除' }
    };
    const config = typeMap[type] || { color: 'default', icon: null, text: type };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { status: 'success', text: '已通过' },
      pending: { status: 'warning', text: '待审批' },
      rejected: { status: 'error', text: '已拒绝' }
    };
    const config = statusMap[status] || { status: 'default', text: status };
    return <Badge status={config.status} text={config.text} />;
  };

  // 渲染值对比
  const renderValueComparison = (record) => {
    const { changeType, oldValue, newValue } = record;
    
    if (changeType === 'create') {
      return (
        <div>
          {Object.entries(newValue || {}).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <strong>{key}:</strong>
              <Tag color="green" style={{ marginLeft: 8 }}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Tag>
            </div>
          ))}
        </div>
      );
    }
    
    if (changeType === 'delete') {
      return (
        <div>
          {Object.entries(oldValue || {}).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <strong>{key}:</strong>
              <Tag color="red" style={{ marginLeft: 8 }}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Tag>
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
          {Array.from(allKeys).map(key => (
            <div key={key} style={{ marginBottom: 8 }}>
              <strong>{key}:</strong>
              {oldValue && oldValue[key] && (
                <Tag color="red" style={{ marginLeft: 8 }}>
                  原值: {typeof oldValue[key] === 'object' ? JSON.stringify(oldValue[key]) : String(oldValue[key])}
                </Tag>
              )}
              {newValue && newValue[key] && (
                <Tag color="green" style={{ marginLeft: 8 }}>
                  新值: {typeof newValue[key] === 'object' ? JSON.stringify(newValue[key]) : String(newValue[key])}
                </Tag>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return <div>无变更详情</div>;
  };

  const columns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160,
      sorter: true,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '对象信息',
      key: 'productInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.productName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.productId}</div>
        </div>
      )
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (text) => getChangeTypeTag(text)
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
      key: 'changeField',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          {text}
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
          <div style={{ fontSize: '12px', color: '#666' }}>{record.operatorId}</div>
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
      render: (text) => getStatusBadge(text)
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

  const getTimelineItems = (record) => {
    const items = [
      {
        color: 'blue',
        children: (
          <div>
            <div><strong>提交变更</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.operator} 于 {record.changeTime} 提交变更申请
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              变更原因: {record.reason}
            </div>
          </div>
        )
      }
    ];

    if (record.status === 'approved') {
      items.push({
        color: 'green',
        children: (
          <div>
            <div><strong>审批通过</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.approver} 审批通过
            </div>
          </div>
        )
      });
    } else if (record.status === 'rejected') {
      items.push({
        color: 'red',
        children: (
          <div>
            <div><strong>审批拒绝</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.approver} 审批拒绝
            </div>
          </div>
        )
      });
    } else {
      items.push({
        color: 'gray',
        children: (
          <div>
            <div><strong>等待审批</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              等待 {record.approver} 审批
            </div>
          </div>
        )
      });
    }

    return items;
  };

  return (
    <div>
      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="名称/ID/操作人" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item name="changeType" label="变更类型">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value="create">新建</Select.Option>
              <Select.Option value="update">修改</Select.Option>
              <Select.Option value="delete">删除</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="changeField" label="变更字段">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value="基本信息">基本信息</Select.Option>
              <Select.Option value="配置信息">配置信息</Select.Option>
              <Select.Option value="状态信息">状态信息</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="pending">待审批</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="timeRange" label="时间范围">
            <DatePicker.RangePicker style={{ width: 240 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset}>
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
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={<><HistoryOutlined /> 变更详情</>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedRecord && (
          <div>
            {/* 基本信息 */}
            <Descriptions
              title="基本信息"
              column={2}
              bordered
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="变更对象">{selectedRecord.productName}</Descriptions.Item>
              <Descriptions.Item label="对象ID">{selectedRecord.productId}</Descriptions.Item>
              <Descriptions.Item label="变更类型">{getChangeTypeTag(selectedRecord.changeType)}</Descriptions.Item>
              <Descriptions.Item label="变更字段">{selectedRecord.changeField}</Descriptions.Item>
              <Descriptions.Item label="操作人">{selectedRecord.operator} ({selectedRecord.operatorId})</Descriptions.Item>
              <Descriptions.Item label="变更时间">{selectedRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="变更原因" span={2}>{selectedRecord.reason}</Descriptions.Item>
            </Descriptions>

            <Row gutter={16}>
              <Col span={12}>
                <Card title="变更详情" size="small">
                  {renderValueComparison(selectedRecord)}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="操作流程" size="small">
                  <Timeline items={getTimelineItems(selectedRecord)} />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecordHistory;