import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, DatePicker, Form, Row, Col, message, Modal, Descriptions, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, PauseOutlined, PlayCircleOutlined, CopyOutlined, BarChartOutlined } from '@ant-design/icons';
import inviteFriendData from '../../../../mock/marketing/inviteFriendActivityData.json';
import CreateInviteFriendModal from './CreateInviteFriendModal';

const { Option } = Select;
const { RangePicker } = DatePicker;

const InviteFriends = () => {
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
      const activities = inviteFriendData.activityList.map(item => ({
        ...item,
        key: item.id
      }));
      setDataSource(activities);
      setFilteredData(activities);
      setPagination(prev => ({ ...prev, total: activities.length }));
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: '活动ID',
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
      title: '活动类型',
      dataIndex: 'activityTypeText',
      key: 'activityTypeText',
      width: 120,
      render: (type, record) => {
        const colorMap = {
          1: 'blue',
          2: 'purple', 
          5: 'orange'
        };
        return <Tag color={colorMap[record.activityType] || 'blue'}>{type}</Tag>;
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
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>总邀请：{record.statistics.totalInvites.toLocaleString()}</div>
          <div style={{ fontSize: '12px' }}>已接受：{record.statistics.acceptedInvites.toLocaleString()}</div>
          <div style={{ fontSize: '12px' }}>已完成：{record.statistics.completedInvites.toLocaleString()}</div>
        </div>
      )
    },
    {
      title: '成功率',
      key: 'successRate',
      width: 80,
      render: (_, record) => {
        return `${record.statistics.successRate}%`;
      }
    },
    {
      title: '奖励总额(元)',
      key: 'totalRewardAmount',
      width: 120,
      render: (_, record) => `¥${record.statistics.totalRewardAmount.toLocaleString()}`
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" icon={<CopyOutlined />} onClick={() => handleCopyLink(record)}>
            复制链接
          </Button>
          <Button type="primary" size="small" icon={<BarChartOutlined />} onClick={() => handleViewStats(record)}>
            统计
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

  const handleCopyLink = (record) => {
    navigator.clipboard.writeText(record.activityUrl);
    message.success('活动链接已复制到剪贴板');
  };

  const handleViewStats = (record) => {
    message.info(`查看活动 ${record.activityName} 的详细统计数据`);
    // 这里可以跳转到统计页面或打开统计弹窗
  };

  const handlePause = (record) => {
    Modal.confirm({
      title: '确认暂停活动',
      content: `确定要暂停活动"${record.activityName}"吗？`,
      onOk: () => {
        message.success('活动已暂停');
        loadData(); // 重新加载数据
      }
    });
  };

  const handleResume = (record) => {
    Modal.confirm({
      title: '确认恢复活动',
      content: `确定要恢复活动"${record.activityName}"吗？`,
      onOk: () => {
        message.success('活动已恢复');
        loadData(); // 重新加载数据
      }
    });
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    loadData(); // 重新加载数据
    message.success('邀请好友活动创建成功！');
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    setSelectedRecord(null);
    loadData(); // 重新加载数据
    message.success('邀请好友活动更新成功！');
  };

  return (
    <div>
      {/* 搜索筛选区域 */}
      <div style={{
        background: '#fff',
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '16px'
      }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="activityName" label="活动名称">
                <Input placeholder="请输入活动名称" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="activityType" label="活动类型">
                <Select placeholder="请选择类型" style={{ width: 140 }} allowClear>
                  <Option value={1}>1级邀请</Option>
                  <Option value={2}>2级邀请</Option>
                  <Option value={5}>代理商模式</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                  <Option value="active">进行中</Option>
                  <Option value="pending">未开始</Option>
                  <Option value="ended">已结束</Option>
                  <Option value="paused">已暂停</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="dateRange" label="创建时间">
                <RangePicker style={{ width: 240 }} />
              </Form.Item>
            </Col>
            <Col flex="auto" style={{ textAlign: 'right' }}>
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
            </Col>
          </Row>
        </Form>
      </div>

      {/* 活动列表 */}
      <div style={{ background: '#fff', padding: '24px' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
            }
          }}
        />
      </div>

      {/* 活动详情弹窗 */}
      <Modal
        title="邀请好友活动详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="活动ID">{selectedRecord.id}</Descriptions.Item>
              <Descriptions.Item label="活动名称">{selectedRecord.activityName}</Descriptions.Item>
              <Descriptions.Item label="活动类型">{selectedRecord.activityTypeText}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedRecord.status === 'active' ? 'success' : 'warning'}>
                  {selectedRecord.status === 'active' ? '进行中' : selectedRecord.status === 'pending' ? '未开始' : selectedRecord.status === 'ended' ? '已结束' : '已暂停'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="活动时间" span={2}>
                {selectedRecord.startTime} 至 {selectedRecord.endTime}
              </Descriptions.Item>
              <Descriptions.Item label="邀请人资格">{selectedRecord.inviterQualification}</Descriptions.Item>
              <Descriptions.Item label="被邀人资格">{selectedRecord.inviteeQualification}</Descriptions.Item>
              <Descriptions.Item label="完成条件" span={2}>{selectedRecord.completeCondition}</Descriptions.Item>
              <Descriptions.Item label="页面标题" span={2}>{selectedRecord.pageTitle}</Descriptions.Item>
              <Descriptions.Item label="主标语" span={2}>{selectedRecord.mainSlogan}</Descriptions.Item>
            </Descriptions>
            
            <Divider>统计数据</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {selectedRecord.statistics.totalInvites.toLocaleString()}
                  </div>
                  <div>总邀请数</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {selectedRecord.statistics.acceptedInvites.toLocaleString()}
                  </div>
                  <div>已接受数</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {selectedRecord.statistics.completedInvites.toLocaleString()}
                  </div>
                  <div>已完成数</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eb2f96' }}>
                    {selectedRecord.statistics.successRate}%
                  </div>
                  <div>成功率</div>
                </div>
              </Col>
            </Row>
            
            <Divider>活动规则</Divider>
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {selectedRecord.activityRule}
            </div>
          </div>
        )}
      </Modal>

      {/* 创建活动弹窗 */}
      <CreateInviteFriendModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* 编辑活动弹窗 */}
      <CreateInviteFriendModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedRecord(null);
        }}
        onSuccess={handleEditSuccess}
        editData={selectedRecord}
        isEdit={true}
      />
    </div>
  );
};

export default InviteFriends; 