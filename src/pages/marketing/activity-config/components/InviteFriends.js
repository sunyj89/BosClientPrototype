import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, DatePicker, Form, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const InviteFriends = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([
    {
      id: '1',
      activityName: '邀请好友送油卡',
      inviteReward: '邀请者获得20元油卡',
      inviteeReward: '被邀请者获得10元油卡',
      status: 'active',
      startTime: '2025-01-01 00:00:00',
      endTime: '2025-06-30 23:59:59',
      totalInvites: 856,
      successfulInvites: 623,
      createTime: '2024-12-20 09:15:00',
    },
    {
      id: '2',
      activityName: '春节拉新活动',
      inviteReward: '邀请者获得30元代金券',
      inviteeReward: '被邀请者获得15元代金券',
      status: 'pending',
      startTime: '2025-02-01 00:00:00',
      endTime: '2025-02-29 23:59:59',
      totalInvites: 0,
      successfulInvites: 0,
      createTime: '2025-01-18 16:30:00',
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
      title: '邀请者奖励',
      dataIndex: 'inviteReward',
      key: 'inviteReward',
      width: 150,
      render: (reward) => <Tag color="green">{reward}</Tag>
    },
    {
      title: '被邀请者奖励',
      dataIndex: 'inviteeReward',
      key: 'inviteeReward',
      width: 150,
      render: (reward) => <Tag color="blue">{reward}</Tag>
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
      title: '邀请数据',
      key: 'inviteData',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>总邀请：{record.totalInvites}</div>
          <div style={{ fontSize: '12px' }}>成功：{record.successfulInvites}</div>
        </div>
      )
    },
    {
      title: '成功率',
      key: 'successRate',
      width: 80,
      render: (_, record) => {
        const rate = record.totalInvites > 0 ? 
          ((record.successfulInvites / record.totalInvites) * 100).toFixed(1) : 0;
        return `${rate}%`;
      }
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
    message.info('邀请好友搜索功能开发中...');
  };

  const handleReset = () => {
    searchForm.resetFields();
  };

  const handleCreate = () => {
    message.info('创建邀请好友活动功能开发中...');
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
                新建邀请活动
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

export default InviteFriends; 