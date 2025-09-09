import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, DatePicker, Form, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GroupBuyActivity = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([
    {
      id: '1',
      activityName: '汽油拼团优惠',
      productName: '92#汽油',
      originalPrice: 7.58,
      groupPrice: 7.20,
      minGroupSize: 5,
      currentGroups: 23,
      totalParticipants: 145,
      status: 'active',
      startTime: '2025-01-01 00:00:00',
      endTime: '2025-03-31 23:59:59',
      createTime: '2024-12-20 11:15:00',
    },
    {
      id: '2',
      activityName: '洗车服务拼团',
      productName: '精品洗车套餐',
      originalPrice: 30.00,
      groupPrice: 22.00,
      minGroupSize: 3,
      currentGroups: 8,
      totalParticipants: 34,
      status: 'active',
      startTime: '2025-01-15 00:00:00',
      endTime: '2025-04-15 23:59:59',
      createTime: '2025-01-10 16:30:00',
    },
    {
      id: '3',
      activityName: '便利店商品拼团',
      productName: '矿泉水24瓶装',
      originalPrice: 28.00,
      groupPrice: 24.00,
      minGroupSize: 4,
      currentGroups: 0,
      totalParticipants: 0,
      status: 'pending',
      startTime: '2025-02-01 00:00:00',
      endTime: '2025-02-28 23:59:59',
      createTime: '2025-01-25 09:45:00',
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
      title: '拼团商品',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      render: (name) => <Tag color="geekblue">{name}</Tag>
    },
    {
      title: '价格信息',
      key: 'priceInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', textDecoration: 'line-through', color: '#999' }}>
            原价：¥{record.originalPrice}
          </div>
          <div style={{ fontSize: '14px', color: '#f5222d', fontWeight: 500 }}>
            团价：¥{record.groupPrice}
          </div>
        </div>
      )
    },
    {
      title: '成团人数',
      dataIndex: 'minGroupSize',
      key: 'minGroupSize',
      width: 100,
      render: (size) => `${size}人成团`
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
      title: '拼团数据',
      key: 'groupData',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>拼团：{record.currentGroups}个</div>
          <div style={{ fontSize: '12px' }}>参与：{record.totalParticipants}人</div>
        </div>
      )
    },
    {
      title: '优惠幅度',
      key: 'discount',
      width: 100,
      render: (_, record) => {
        const discount = ((record.originalPrice - record.groupPrice) / record.originalPrice * 100).toFixed(1);
        return <Tag color="volcano">{discount}%</Tag>;
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
    message.info('拼团活动搜索功能开发中...');
  };

  const handleReset = () => {
    searchForm.resetFields();
  };

  const handleCreate = () => {
    message.info('创建拼团活动功能开发中...');
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
          <Form.Item name="productName" label="商品名称">
            <Input placeholder="请输入商品名称" style={{ width: 150 }} />
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
                新建拼团活动
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
          scroll={{ x: 1400 }}
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

export default GroupBuyActivity; 