import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Modal, 
  message 
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined 
} from '@ant-design/icons';
import CouponCreateModal from './CouponCreateModal';
import CouponViewModal from './CouponViewModal';
import { getCouponList } from '../services/api';

const CouponList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // 优惠券状态映射
  const statusMap = {
    'active': { color: 'green', text: '生效中' },
    'expired': { color: 'red', text: '已过期' },
    'disabled': { color: 'gray', text: '已作废' },
  };

  // 券类型映射
  const typeMap = {
    'oil': '油品券',
    'non-oil': '非油券',
    'goods': '非油券',
    'recharge': '充值赠金券',
  };

  // 加载数据
  const loadData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getCouponList({
        ...params,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      setDataSource(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 查询
  const handleSearch = (values) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData(values);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setSelectedCoupon(record);
    setViewModalVisible(true);
  };

  // 修改状态
  const handleEditStatus = (record) => {
    // TODO: 实现修改状态逻辑
    console.log('修改状态:', record);
  };

  // 表格列配置
  const columns = [
    {
      title: '优惠券ID',
      dataIndex: 'couponId',
      key: 'couponId',
      width: 120,
    },
    {
      title: '券名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '券类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => typeMap[type] || type,
    },
    {
      title: '券配置信息',
      dataIndex: 'config',
      key: 'config',
      width: 250,
      render: (config) => (
        <div>
          <div>面额：{config?.amount || '-'}</div>
          <div>使用条件：{config?.condition || '-'}</div>
        </div>
      ),
    },
    {
      title: '券状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '券有效期',
      dataIndex: 'validPeriod',
      key: 'validPeriod',
      width: 180,
      render: (period) => (
        <div>
          <div>开始：{period?.startDate || '-'}</div>
          <div>结束：{period?.endDate || '-'}</div>
        </div>
      ),
    },
    {
      title: '累计发放数量',
      dataIndex: 'issuedCount',
      key: 'issuedCount',
      width: 120,
      align: 'right',
      render: (count) => count?.toLocaleString() || 0,
    },
    {
      title: '累计核销数量',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 120,
      align: 'right',
      render: (count) => count?.toLocaleString() || 0,
    },
    {
      title: '核销率',
      dataIndex: 'usageRate',
      key: 'usageRate',
      width: 100,
      align: 'right',
      render: (rate, record) => {
        const calcRate = record.issuedCount > 0 
          ? ((record.usedCount / record.issuedCount) * 100).toFixed(1)
          : 0;
        return `${calcRate}%`;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStatus(record)}
          >
            修改状态
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  return (
    <div>
      {/* 查询表单 */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="name" label="优惠券名称">
          <Input placeholder="请输入优惠券名称" style={{ width: 200 }} />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              新建优惠券
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
        scroll={{ x: 'max-content' }}
        onChange={(paginationInfo) => {
          setPagination(prev => ({
            ...prev,
            current: paginationInfo.current,
            pageSize: paginationInfo.pageSize,
          }));
        }}
      />

      {/* 创建优惠券弹窗 */}
      <CouponCreateModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          loadData();
        }}
      />

      {/* 查看优惠券详情弹窗 */}
      <CouponViewModal
        visible={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedCoupon(null);
        }}
        couponData={selectedCoupon}
      />
    </div>
  );
};

export default CouponList; 