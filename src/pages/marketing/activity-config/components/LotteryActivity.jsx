import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, DatePicker, Form, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const LotteryActivity = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([
    {
      id: '1',
      activityName: '元旦抽奖大转盘',
      lotteryType: '转盘抽奖',
      totalPrizes: 1000,
      remainingPrizes: 675,
      participantCount: 2340,
      status: 'active',
      startTime: '2025-01-01 00:00:00',
      endTime: '2025-01-31 23:59:59',
      createTime: '2024-12-28 14:20:00',
    },
    {
      id: '2',
      activityName: '春节刮刮乐',
      lotteryType: '刮刮乐',
      totalPrizes: 5000,
      remainingPrizes: 5000,
      participantCount: 0,
      status: 'pending',
      startTime: '2025-02-08 00:00:00',
      endTime: '2025-02-15 23:59:59',
      createTime: '2025-01-22 10:15:00',
    },
    {
      id: '3',
      activityName: '每日签到抽奖',
      lotteryType: '签到抽奖',
      totalPrizes: 500,
      remainingPrizes: 120,
      participantCount: 1560,
      status: 'active',
      startTime: '2025-01-15 00:00:00',
      endTime: '2025-04-15 23:59:59',
      createTime: '2025-01-10 09:30:00',
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
      title: '抽奖类型',
      dataIndex: 'lotteryType',
      key: 'lotteryType',
      width: 120,
      render: (type) => {
        const typeConfig = {
          '转盘抽奖': 'purple',
          '刮刮乐': 'orange',
          '签到抽奖': 'cyan',
          '九宫格': 'magenta'
        };
        return <Tag color={typeConfig[type] || 'blue'}>{type}</Tag>;
      }
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
      title: '奖品情况',
      key: 'prizeInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>总计：{record.totalPrizes}</div>
          <div style={{ fontSize: '12px' }}>剩余：{record.remainingPrizes}</div>
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
      title: '中奖率',
      key: 'winRate',
      width: 80,
      render: (_, record) => {
        const winCount = record.totalPrizes - record.remainingPrizes;
        const rate = record.participantCount > 0 ? 
          ((winCount / record.participantCount) * 100).toFixed(1) : 0;
        return `${rate}%`;
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
    message.info('抽奖活动搜索功能开发中...');
  };

  const handleReset = () => {
    searchForm.resetFields();
  };

  const handleCreate = () => {
    message.info('创建抽奖活动功能开发中...');
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
          <Form.Item name="lotteryType" label="抽奖类型">
            <Select placeholder="请选择类型" style={{ width: 120 }} allowClear>
              <Option value="转盘抽奖">转盘抽奖</Option>
              <Option value="刮刮乐">刮刮乐</Option>
              <Option value="签到抽奖">签到抽奖</Option>
              <Option value="九宫格">九宫格</Option>
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
                新建抽奖活动
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
          scroll={{ x: 1300 }}
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

export default LotteryActivity; 