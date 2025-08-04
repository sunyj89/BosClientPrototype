import React, { useState } from 'react';
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
  Badge
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  HistoryOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ChangeRecord = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 模拟修改记录数据
  const mockData = [
    {
      id: 'LOG001',
      productId: 'SPU001',
      productName: '农夫山泉天然水',
      changeType: 'update',
      changeField: '价格信息',
      changeDescription: '更新SKU价格',
      operator: '张三',
      operatorId: 'USER001',
      changeTime: '2025-01-18 14:30:25',
      oldValue: { price: 2.0, memberPrice: 1.8 },
      newValue: { price: 2.5, memberPrice: 2.2 },
      reason: '供应商涨价调整',
      affectedSkus: ['SKU001001', 'SKU001002'],
      approver: '李经理',
      status: 'approved'
    },
    {
      id: 'LOG002',
      productId: 'SKU002001',
      productName: '康师傅方便面 红烧牛肉面',
      changeType: 'create',
      changeField: '商品创建',
      changeDescription: '新建商品SKU',
      operator: '李四',
      operatorId: 'USER002',
      changeTime: '2025-01-17 09:15:30',
      oldValue: null,
      newValue: {
        name: '康师傅方便面 红烧牛肉面',
        price: 3.5,
        barcode: '6901111222221',
        category: '食品零食/方便速食/方便面'
      },
      reason: '新品上架',
      affectedSkus: ['SKU002001'],
      approver: '王主管',
      status: 'approved'
    },
    {
      id: 'LOG003',
      productId: 'COMBO001',
      productName: '早餐优惠套餐',
      changeType: 'update',
      changeField: '组合商品配置',
      changeDescription: '调整组合商品内容',
      operator: '王五',
      operatorId: 'USER003',
      changeTime: '2025-01-16 16:45:12',
      oldValue: {
        items: [
          { skuId: 'SKU003001', quantity: 1 },
          { skuId: 'SKU003002', quantity: 1 }
        ],
        price: 10.5
      },
      newValue: {
        items: [
          { skuId: 'SKU003001', quantity: 1 },
          { skuId: 'SKU003002', quantity: 2 },
          { skuId: 'SKU003003', quantity: 1 }
        ],
        price: 12.8
      },
      reason: '优化套餐内容，增加配菜',
      affectedSkus: ['SKU003001', 'SKU003002', 'SKU003003'],
      approver: '陈总监',
      status: 'approved'
    },
    {
      id: 'LOG004',
      productId: 'SPU002',
      productName: '康师傅方便面',
      changeType: 'delete',
      changeField: '商品下架',
      changeDescription: '商品永久下架',
      operator: '赵六',
      operatorId: 'USER004',
      changeTime: '2025-01-15 11:20:45',
      oldValue: { status: 'active' },
      newValue: { status: 'deleted' },
      reason: '供应商停产',
      affectedSkus: ['SKU002003', 'SKU002004'],
      approver: '李经理',
      status: 'approved'
    },
    {
      id: 'LOG005',
      productId: 'SKU001003',
      productName: '农夫山泉天然水 550ml*24瓶/箱',
      changeType: 'update',
      changeField: '库存信息',
      changeDescription: '调整库存预警阈值',
      operator: '孙七',
      operatorId: 'USER005',
      changeTime: '2025-01-14 13:10:20',
      oldValue: { minStock: 50, maxStock: 200 },
      newValue: { minStock: 100, maxStock: 500 },
      reason: '销量增长，调整库存策略',
      affectedSkus: ['SKU001003'],
      approver: '张主管',
      status: 'pending'
    }
  ];

  const [dataSource, setDataSource] = useState(mockData);

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
      title: '商品信息',
      key: 'productInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.productName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.productId}</div>
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

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    // 实际项目中这里会调用API
  };

  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
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
            <Input placeholder="商品名称/ID/操作人" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="changeType" label="变更类型">
            <Select placeholder="请选择类型" style={{ width: 120 }} allowClear>
              <Option value="create">新建</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
            </Select>
          </Form.Item>
          <Form.Item name="changeField" label="变更字段">
            <Select placeholder="请选择字段" style={{ width: 120 }} allowClear>
              <Option value="价格信息">价格信息</Option>
              <Option value="库存信息">库存信息</Option>
              <Option value="商品信息">商品信息</Option>
              <Option value="组合商品配置">组合商品配置</Option>
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
              <Button onClick={() => searchForm.resetFields()}>
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
            total: dataSource.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
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
                <Descriptions.Item label="商品ID">{currentRecord.productId}</Descriptions.Item>
                <Descriptions.Item label="商品名称">{currentRecord.productName}</Descriptions.Item>
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
                <Descriptions.Item label="影响SKU">
                  {currentRecord.affectedSkus?.map(sku => (
                    <Tag key={sku} size="small">{sku}</Tag>
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

export default ChangeRecord; 