import React from 'react';
import { Card, Table, Button, Space, Input, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const OilDelivery = () => {
  const columns = [
    {
      title: '配送单号',
      dataIndex: 'deliveryNo',
      key: 'deliveryNo',
    },
    {
      title: '配送日期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '配送数量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '配送状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>查看</a>
          <a>编辑</a>
        </Space>
      ),
    },
  ];

  return (
    <Card title="油品配送管理">
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="配送单号" prefix={<SearchOutlined />} />
        <RangePicker placeholder={['开始日期', '结束日期']} />
        <Button type="primary" icon={<PlusOutlined />}>
          新建配送单
        </Button>
      </Space>
      <Table columns={columns} dataSource={[]} />
    </Card>
  );
};

export default OilDelivery; 