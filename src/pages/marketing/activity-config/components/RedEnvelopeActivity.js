import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, DatePicker, Form, Row, Col, message, Modal, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import redPackageData from '../../../../mock/marketing/redPackageActivityData.json';
import CreateRedPackageModal from './CreateRedPackageModal';

const { Option } = Select;
const { RangePicker } = DatePicker;

const RedEnvelopeActivity = () => {
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 组件加载时获取数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const activities = redPackageData.activityList.map(item => ({
        ...item,
        key: item.id,
        activityTypeText: item.activityType === 'normal' ? '普通红包' : '裂变红包',
        participantCount: item.statistics.participantCount,
        totalAmount: item.statistics.totalAmount
      }));
      setDataSource(activities);
      setFilteredData(activities);
      setPagination(prev => ({ ...prev, total: activities.length }));
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: '红包ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '红包类型',
      dataIndex: 'activityTypeText',
      key: 'activityTypeText',
      width: 120,
      render: (type, record) => {
        const color = record.activityType === 'normal' ? 'blue' : 'purple';
        return <Tag color={color}>{type}</Tag>;
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
          pending: { color: 'warning', text: '未开始' },
          ended: { color: 'default', text: '已结束' },
          paused: { color: 'error', text: '已暂停' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '红包有效期',
      key: 'validity',
      width: 200,
      render: (_, record) => {
        if (record.validityType === 'fixed_time') {
          return (
            <div>
              <div style={{ fontSize: '12px' }}>开始：{record.startTime}</div>
              <div style={{ fontSize: '12px' }}>结束：{record.endTime}</div>
            </div>
          );
        } else {
          return <span>领取后{record.validityDays}天有效</span>;
        }
      }
    },
    {
      title: '红包数量',
      dataIndex: 'packageCount',
      key: 'packageCount',
      width: 100,
      render: (count) => `${count.toLocaleString()}个`
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 100,
      render: (count) => count.toLocaleString()
    },
    {
      title: '预算金额(元)',
      dataIndex: 'totalBudget',
      key: 'totalBudget',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 'active' && (
            <Button type="primary" size="small" danger icon={<PauseOutlined />} onClick={() => handlePause(record)}>
              暂停
            </Button>
          )}
          {record.status === 'paused' && (
            <Button type="primary" size="small" icon={<PlayCircleOutlined />} onClick={() => handleResume(record)}>
              恢复
            </Button>
          )}
        </Space>
      )
    }
  ];

  const handleSearch = (values) => {
    let filtered = [...dataSource];
    
    // 按活动名称筛选
    if (values.activityName) {
      filtered = filtered.filter(item => 
        item.activityName.toLowerCase().includes(values.activityName.toLowerCase())
      );
    }
    
    // 按活动类型筛选
    if (values.activityType) {
      filtered = filtered.filter(item => item.activityType === values.activityType);
    }
    
    // 按状态筛选
    if (values.status) {
      filtered = filtered.filter(item => item.status === values.status);
    }
    
    // 按时间范围筛选
    if (values.dateRange && values.dateRange.length === 2) {
      const [startDate, endDate] = values.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= startDate.startOf('day') && createTime <= endDate.endOf('day');
      });
    }
    
    setFilteredData(filtered);
    setPagination(prev => ({ ...prev, current: 1, total: filtered.length }));
  };

  const handleReset = () => {
    searchForm.resetFields();
    setFilteredData(dataSource);
    setPagination(prev => ({ ...prev, current: 1, total: dataSource.length }));
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditModalVisible(true);
  };

  const handlePause = (record) => {
    Modal.confirm({
      title: '确认暂停活动？',
      content: `确定要暂停活动"${record.activityName}"吗？`,
      onOk: () => {
        // 更新状态为暂停
        const updatedData = dataSource.map(item => 
          item.id === record.id ? { ...item, status: 'paused' } : item
        );
        setDataSource(updatedData);
        setFilteredData(updatedData);
        message.success('活动已暂停');
      }
    });
  };

  const handleResume = (record) => {
    Modal.confirm({
      title: '确认恢复活动？',
      content: `确定要恢复活动"${record.activityName}"吗？`,
      onOk: () => {
        // 更新状态为进行中
        const updatedData = dataSource.map(item => 
          item.id === record.id ? { ...item, status: 'active' } : item
        );
        setDataSource(updatedData);
        setFilteredData(updatedData);
        message.success('活动已恢复');
      }
    });
  };

  const handleCreateSuccess = (newActivity) => {
    const activityWithDisplay = {
      ...newActivity,
      key: newActivity.id,
      activityTypeText: newActivity.activityType === 'normal' ? '普通红包' : '裂变红包',
      participantCount: newActivity.statistics.participantCount,
      totalAmount: newActivity.statistics.totalAmount
    };
    const updatedData = [activityWithDisplay, ...dataSource];
    setDataSource(updatedData);
    setFilteredData(updatedData);
    setPagination(prev => ({ ...prev, total: updatedData.length }));
    setCreateModalVisible(false);
    message.success('红包活动创建成功！');
  };

  const handleEditSuccess = (updatedActivity) => {
    const activityWithDisplay = {
      ...updatedActivity,
      key: updatedActivity.id,
      activityTypeText: updatedActivity.activityType === 'normal' ? '普通红包' : '裂变红包',
      participantCount: updatedActivity.statistics.participantCount,
      totalAmount: updatedActivity.statistics.totalAmount
    };
    const updatedData = dataSource.map(item => 
      item.id === updatedActivity.id ? activityWithDisplay : item
    );
    setDataSource(updatedData);
    setFilteredData(updatedData);
    setEditModalVisible(false);
    message.success('红包活动修改成功！');
  };

  const renderDetailModal = () => {
    if (!selectedRecord) return null;
    
    return (
      <Modal
        title="红包活动详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="红包ID">{selectedRecord.id}</Descriptions.Item>
          <Descriptions.Item label="活动名称">{selectedRecord.activityName}</Descriptions.Item>
          <Descriptions.Item label="红包类型">{selectedRecord.activityTypeText}</Descriptions.Item>
          <Descriptions.Item label="页面标题">{selectedRecord.pageTitle}</Descriptions.Item>
          <Descriptions.Item label="油站名称">{selectedRecord.stationName}</Descriptions.Item>
          <Descriptions.Item label="主标语">{selectedRecord.mainTitle}</Descriptions.Item>
          <Descriptions.Item label="红包有效期" span={2}>
            {selectedRecord.validityType === 'fixed_time' 
              ? `${selectedRecord.startTime} 至 ${selectedRecord.endTime}`
              : `领取后${selectedRecord.validityDays}天有效`
            }
          </Descriptions.Item>
          <Descriptions.Item label="领取用户">
            {selectedRecord.userType === 1 ? '未加油用户' : '所有用户'}
          </Descriptions.Item>
          <Descriptions.Item label="重复领取">
            {selectedRecord.repeatType === 1 ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label="能否分享">
            {selectedRecord.shareType === 2 ? '可以分享' : '不可分享'}
          </Descriptions.Item>
          <Descriptions.Item label="是否免费">
            {selectedRecord.ifFree === 1 ? '免费' : `¥${selectedRecord.eachCost}`}
          </Descriptions.Item>
          <Descriptions.Item label="次数限制">{selectedRecord.timesLimit}次</Descriptions.Item>
          <Descriptions.Item label="红包数量">{selectedRecord.packageCount}个</Descriptions.Item>
          <Descriptions.Item label="预算金额">¥{selectedRecord.totalBudget.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="参与人数">{selectedRecord.participantCount}人</Descriptions.Item>
          <Descriptions.Item label="活动规则" span={2}>
            <div style={{ whiteSpace: 'pre-line' }}>{selectedRecord.activityRules}</div>
          </Descriptions.Item>
        </Descriptions>
        
        {selectedRecord.coupons && selectedRecord.coupons.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>包含营销券</h4>
            <Table 
              size="small"
              dataSource={selectedRecord.coupons}
              rowKey="couponId"
              pagination={false}
              columns={[
                { title: '券名', dataIndex: 'couponName', key: 'couponName' },
                { title: '券ID', dataIndex: 'couponId', key: 'couponId' },
                { title: '券额', dataIndex: 'faceValue', key: 'faceValue', render: val => `¥${val}` },
                { title: '券类型', dataIndex: 'couponType', key: 'couponType' },
                { title: '券数量', dataIndex: 'couponCount', key: 'couponCount', render: val => `${val}张` }
              ]}
            />
          </div>
        )}
      </Modal>
    );
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
          <Form.Item name="activityType" label="红包类型">
            <Select placeholder="请选择类型" style={{ width: 120 }} allowClear>
              <Option value="normal">普通红包</Option>
              <Option value="fission">裂变红包</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
              <Option value="active">进行中</Option>
              <Option value="pending">未开始</Option>
              <Option value="ended">已结束</Option>
              <Option value="paused">已暂停</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="创建时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
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
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setPagination(prev => ({ ...prev, current: page, pageSize: size }));
            }
          }}
        />
      </Card>
      
      {/* 创建红包活动弹窗 */}
      <CreateRedPackageModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
      
      {/* 编辑红包活动弹窗 */}
      <CreateRedPackageModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={handleEditSuccess}
        editData={selectedRecord}
      />
      
      {/* 详情查看弹窗 */}
      {renderDetailModal()}
      
      {/* 页面备注 */}
      <div style={{
        marginTop: '24px',
        padding: '12px',
        backgroundColor: '#f0f2f5',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div><strong>页面说明：</strong></div>
        <div>• 此页面用于管理红包营销活动，支持创建普通红包和裂变红包</div>
        <div>• 可以查看活动详情、编辑活动配置、暂停/恢复活动</div>
        <div>• 红包活动包含营销券配置，支持多种有效期和领取限制设置</div>
      </div>
    </div>
  );
};

export default RedEnvelopeActivity;