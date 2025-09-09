import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  DatePicker,
  Form,
  Row,
  Col,
  Tooltip,
  Modal,
  Descriptions,
  Timeline,
  Badge,
  message
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
import { getCouponChangeRecords } from '../services/api';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CouponChangeRecord = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 加载修改记录数据
  const loadChangeRecords = async (params = {}) => {
    setLoading(true);
    try {
      const searchValues = searchForm.getFieldsValue();
      const requestParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchValues,
        ...params,
      };

      const response = await getCouponChangeRecords(requestParams);
      setDataSource(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        current: response.page || 1,
        pageSize: response.pageSize || 10,
      }));
    } catch (error) {
      console.error('加载修改记录失败:', error);
      message.error('加载修改记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = (values) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadChangeRecords({ page: 1, ...values });
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    loadChangeRecords({ page: 1 });
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 表格分页变化
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    loadChangeRecords({ 
      page: newPagination.current, 
      pageSize: newPagination.pageSize 
    });
  };

  // 渲染变更对比
  const renderValueComparison = (oldValue, newValue, changeType) => {
    if (changeType === 'create') {
      return (
        <Descriptions column={1} size="small">
          {Object.entries(newValue || {}).map(([key, value]) => (
            <Descriptions.Item key={key} label={key}>
              <Tag color="green">新增: {JSON.stringify(value)}</Tag>
            </Descriptions.Item>
          ))}
        </Descriptions>
      );
    }

    if (changeType === 'delete') {
      return (
        <Descriptions column={1} size="small">
          {Object.entries(oldValue || {}).map(([key, value]) => (
            <Descriptions.Item key={key} label={key}>
              <Tag color="red">删除: {JSON.stringify(value)}</Tag>
            </Descriptions.Item>
          ))}
        </Descriptions>
      );
    }

    // 更新类型的对比
    const allKeys = new Set([
      ...Object.keys(oldValue || {}),
      ...Object.keys(newValue || {})
    ]);

    return (
      <Descriptions column={1} size="small">
        {Array.from(allKeys).map(key => {
          const oldVal = oldValue?.[key];
          const newVal = newValue?.[key];
          
          if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            return (
              <Descriptions.Item key={key} label={key}>
                <div>
                  <Tag color="red">原值: {JSON.stringify(oldVal)}</Tag>
                  <Tag color="green">新值: {JSON.stringify(newVal)}</Tag>
                </div>
              </Descriptions.Item>
            );
          }
          
          return (
            <Descriptions.Item key={key} label={key}>
              <Tag>{JSON.stringify(oldVal)}</Tag>
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    );
  };

  // 渲染操作时间线
  const renderTimeline = (record) => {
    const timelineItems = [
      {
        color: 'blue',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>操作提交</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.operator} 在 {record.changeTime} 提交了变更
            </div>
            <div style={{ fontSize: '12px', marginTop: 4 }}>
              变更原因：{record.reason}
            </div>
          </div>
        )
      }
    ];

    if (record.status === 'approved') {
      timelineItems.push({
        color: 'green',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>审批通过</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.approver} 审批通过
            </div>
          </div>
        )
      });
    } else if (record.status === 'rejected') {
      timelineItems.push({
        color: 'red',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>审批拒绝</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.approver} 拒绝了此次变更
            </div>
          </div>
        )
      });
    } else {
      timelineItems.push({
        color: 'gray',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>等待审批</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              等待 {record.approver} 审批
            </div>
          </div>
        )
      });
    }

    return <Timeline items={timelineItems} />;
  };

  // 表格列定义
  const columns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
      sorter: (a, b) => new Date(a.changeTime) - new Date(b.changeTime),
      render: (time) => (
        <div>
          <div style={{ fontWeight: 500 }}>{time}</div>
        </div>
      )
    },
    {
      title: '优惠券信息',
      key: 'couponInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.couponName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.couponId}</div>
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
      render: (field) => (
        <Tag color="blue">{field}</Tag>
      )
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      )
    },
    {
      title: '操作人',
      key: 'operatorInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.operator}</div>
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
          approved: { color: 'success', text: '已通过' },
          pending: { color: 'warning', text: '待审批' },
          rejected: { color: 'error', text: '已拒绝' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge status={config.color} text={config.text} />;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      )
    }
  ];

  useEffect(() => {
    loadChangeRecords();
  }, []);

  return (
    <div>
      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="优惠券名称/ID/操作人" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="changeType" label="变更类型">
            <Select placeholder="请选择类型" style={{ width: 120 }} allowClear>
              <Option value="create">新建</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
            </Select>
          </Form.Item>
          <Form.Item name="changeField" label="变更字段">
            <Select placeholder="请选择字段" style={{ width: 140 }} allowClear>
              <Option value="优惠券创建">优惠券创建</Option>
              <Option value="券面额配置">券面额配置</Option>
              <Option value="时间限制">时间限制</Option>
              <Option value="券状态">券状态</Option>
              <Option value="油站限制">油站限制</Option>
              <Option value="优惠券删除">优惠券删除</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
              <Option value="approved">已通过</Option>
              <Option value="pending">待审批</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="时间范围">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 修改记录列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <HistoryOutlined />
            变更详情
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {currentRecord && (
          <div>
            {/* 基本信息 */}
            <Card size="small" title="基本信息" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="变更ID">{currentRecord.id}</Descriptions.Item>
                <Descriptions.Item label="优惠券ID">{currentRecord.couponId}</Descriptions.Item>
                <Descriptions.Item label="优惠券名称">{currentRecord.couponName}</Descriptions.Item>
                <Descriptions.Item label="变更类型">
                  <Tag color={
                    currentRecord.changeType === 'create' ? 'success' :
                    currentRecord.changeType === 'update' ? 'warning' : 'error'
                  }>
                    {currentRecord.changeType === 'create' ? '新建' :
                     currentRecord.changeType === 'update' ? '修改' : '删除'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="变更字段">{currentRecord.changeField}</Descriptions.Item>
                <Descriptions.Item label="变更描述">{currentRecord.changeDescription}</Descriptions.Item>
                <Descriptions.Item label="变更原因">{currentRecord.reason}</Descriptions.Item>
                <Descriptions.Item label="影响优惠券">
                  {currentRecord.affectedCoupons?.map(coupon => (
                    <Tag key={coupon} size="small">{coupon}</Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Row gutter={16}>
              {/* 变更详情 */}
              <Col span={12}>
                <Card size="small" title="变更详情">
                  {renderValueComparison(
                    currentRecord.oldValue,
                    currentRecord.newValue,
                    currentRecord.changeType
                  )}
                </Card>
              </Col>

              {/* 操作流程 */}
              <Col span={12}>
                <Card size="small" title="操作流程">
                  {renderTimeline(currentRecord)}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CouponChangeRecord; 