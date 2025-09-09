import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const MenuTable = ({ menuData, onEdit, onDelete, loading }) => {
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {record.isSystem && <Tag color="blue" size="small">系统</Tag>}
        </Space>
      )
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const typeMap = {
          'directory': { text: '目录', color: 'purple' },
          'menu': { text: '菜单', color: 'green' },
          'button': { text: '按钮', color: 'orange' }
        };
        const config = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '权限标识',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (text) => <code style={{ fontSize: '12px' }}>{text}</code>
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      width: 200,
      render: (text) => text ? <code style={{ fontSize: '12px' }}>{text}</code> : '-'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status = 1) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ color: '#1890ff' }}
          >
            编辑
          </Button>
          {!record.isSystem && (
            <Popconfirm
              title="确认删除"
              description={`确定要删除菜单 "${record.name}" 吗？删除后不可恢复。`}
              onConfirm={() => onDelete(record)}
              okText="确认删除"
              okType="danger"
              cancelText="取消"
            >
              <Button 
                type="link" 
                size="small" 
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={menuData}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`
      }}
      scroll={{ x: 1000 }}
      size="small"
      expandable={{
        defaultExpandAllRows: true
      }}
    />
  );
};

export default MenuTable;