import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Select, Tag, Steps, Input } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;

// 油枪变更管理组件
const GunChangeManagement = () => {
  // 模拟油枪变更数据
  const initialChanges = [
    {
      id: 'GCH20230601001',
      gunId: 'G001',
      gunName: '1号油枪',
      oldTankId: 'T001',
      oldTankName: '1号油罐',
      oldOilType: '92#汽油',
      newTankId: 'T002',
      newTankName: '2号油罐',
      newOilType: '95#汽油',
      changeDate: '2023-06-01',
      reason: '油品升级调整',
      status: '已完成',
      operator: '张三',
      approver: '李四',
      station: '中石化XX加油站',
    },
  ];

  const [changes] = useState(initialChanges);
  const [searchText, setSearchText] = useState('');
  const [filteredChanges, setFilteredChanges] = useState(initialChanges);

  useEffect(() => {
    const filtered = changes.filter(
      (change) =>
        change.id.toLowerCase().includes(searchText.toLowerCase()) ||
        change.gunName.toLowerCase().includes(searchText.toLowerCase()) ||
        change.oldOilType.toLowerCase().includes(searchText.toLowerCase()) ||
        change.newOilType.toLowerCase().includes(searchText.toLowerCase()) ||
        change.status.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredChanges(filtered);
  }, [changes, searchText]);

  const getStatusColor = (status) => {
    switch (status) {
      case '待审批':
        return 'orange';
      case '审批中':
        return 'blue';
      case '已完成':
        return 'green';
      case '已拒绝':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '变更编号',
      dataIndex: 'id',
      key: 'id',
      width: 140,
    },
    {
      title: '油枪',
      dataIndex: 'gunName',
      key: 'gunName',
      width: 100,
    },
    {
      title: '原油罐',
      dataIndex: 'oldTankName',
      key: 'oldTankName',
      width: 100,
    },
    {
      title: '原油品',
      dataIndex: 'oldOilType',
      key: 'oldOilType',
      width: 100,
    },
    {
      title: '新油罐',
      dataIndex: 'newTankName',
      key: 'newTankName',
      width: 100,
    },
    {
      title: '新油品',
      dataIndex: 'newOilType',
      key: 'newOilType',
      width: 100,
    },
    {
      title: '变更日期',
      dataIndex: 'changeDate',
      key: 'changeDate',
      width: 110,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <Tag color={getStatusColor(text)}>{text}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => {}}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="gun-change-management">
      <Card
        title="油枪变更管理"
        extra={
          <Space>
            <Input
              placeholder="搜索变更记录"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              申请变更
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredChanges}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default GunChangeManagement;
