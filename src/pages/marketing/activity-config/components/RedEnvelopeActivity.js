import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, DatePicker, Form, Row, Col, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const RedEnvelopeActivity = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([
    {
      id: '1',
      activityName: '新用户红包活动',
      activityType: '注册红包',
      status: 'active',
      startTime: '2025-01-01 00:00:00',
      endTime: '2025-03-31 23:59:59',
      participantCount: 1280,
      totalAmount: 12800,
      createTime: '2024-12-25 10:30:00',
    },
    {
      id: '2', 
      activityName: '春节红包雨',
      activityType: '随机红包',
      status: 'active',
      startTime: '2025-02-08 00:00:00',
      endTime: '2025-02-15 23:59:59',
      participantCount: 2560,
      totalAmount: 25600,
      createTime: '2025-01-20 14:20:00',
    },
  ]);

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 180,
    },
    {
      title: '活动类型',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 120,
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          active: { color: 'success', text: '进行中' },
          pending: { color: 'warning', text: '待开始' },
          ended: { color: 'default', text: '已结束' },
          paused: { color: 'error', text: '已暂停' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '活动时间',
      key: 'activityTime',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>开始：{record.startTime}</div>
          <div style={{ fontSize: '12px' }}>结束：{record.endTime}</div>
        </div>
      )
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 100,
      render: (count) => count.toLocaleString()
    },
    {
      title: '红包总额(元)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      )
    }
  ];

  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    message.info('红包活动搜索功能开发中...');
  };

  const handleReset = () => {
    searchForm.resetFields();
  };

  const handleCreate = () => {
    message.info('创建红包活动功能开发中...');
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
          <Form.Item name="activityName" label="活动名称">
            <Input placeholder="请输入活动名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="activityType" label="活动类型">
            <Select placeholder="请选择类型" style={{ width: 120 }} allowClear>
              <Option value="注册红包">注册红包</Option>
              <Option value="随机红包">随机红包</Option>
              <Option value="任务红包">任务红包</Option>
              <Option value="消费红包">消费红包</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
              <Option value="active">进行中</Option>
              <Option value="pending">待开始</Option>
              <Option value="ended">已结束</Option>
              <Option value="paused">已暂停</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="活动时间">
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
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新建红包活动
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 活动列表 */}
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
    </div>
  );
};

export default RedEnvelopeActivity; 