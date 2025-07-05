import React from 'react';
import { Card, Table, Button, Space, Tag, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const UserList = ({ users, loading, selectedNode, onAddUser, onEditUser, onDeleteUser }) => {
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '岗位/角色',
      key: 'role',
      width: 120,
      render: (_, record) => (
        <Tag color="blue">{record.role?.name}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditUser && onEditUser(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteUser && onDeleteUser(record)}
            style={{ borderRadius: '2px' }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const title = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>员工列表</span>
      {selectedNode && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => onAddUser && onAddUser()}
          style={{ borderRadius: '2px' }}
        >
          添加用户
        </Button>
      )}
    </div>
  );

  if (!selectedNode) {
    return (
      <Card title="员工列表">
        <Empty description="请选择组织节点查看员工列表" />
      </Card>
    );
  }

  return (
    <Card 
      title={title()} 
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ 
        flex: 1, 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          defaultPageSize: 15,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          size: 'small'
        }}
        scroll={{ 
          x: 'max-content',
          y: 'calc(100vh - 320px)'
        }}
        size="small"
        style={{ flex: 1 }}
      />
    </Card>
  );
};

export default UserList; 