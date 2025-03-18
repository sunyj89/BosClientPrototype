import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, DatePicker, message, Tag, Steps, Divider } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
const { Step } = Steps;

// 模拟油罐变更数据
const initialChanges = [
  {
    id: 'TCH20230501001',
    tankId: 'T001',
    tankName: '1号油罐',
    oldOilType: '92#汽油',
    newOilType: '95#汽油',
    changeDate: '2023-05-01',
    reason: '油品升级',
    status: '已完成',
    operator: '张三',
    approver: '李四',
    station: '中石化XX加油站',
  },
  {
    id: 'TCH20230510002',
    tankId: 'T003',
    tankName: '3号油罐',
    oldOilType: '0#柴油',
    newOilType: '-10#柴油',
    changeDate: '2023-05-10',
    reason: '季节性调整',
    status: '已完成',
    operator: '张三',
    approver: '李四',
    station: '中石化XX加油站',
  },
  {
    id: 'TCH20230515003',
    tankId: 'T005',
    tankName: '5号油罐',
    oldOilType: '98#汽油',
    newOilType: '92#汽油',
    changeDate: '2023-05-15',
    reason: '市场需求变化',
    status: '审批中',
    operator: '王五',
    approver: '待定',
    station: '中石化XX加油站',
  },
  {
    id: 'TCH20230520004',
    tankId: 'T002',
    tankName: '2号油罐',
    oldOilType: '95#汽油',
    newOilType: '92#汽油',
    changeDate: '2023-05-20',
    reason: '市场需求变化',
    status: '已拒绝',
    operator: '王五',
    approver: '李四',
    station: '中石化XX加油站',
  },
  {
    id: 'TCH20230525005',
    tankId: 'T004',
    tankName: '4号油罐',
    oldOilType: '0#柴油',
    newOilType: '-20#柴油',
    changeDate: '2023-05-25',
    reason: '季节性调整',
    status: '待审批',
    operator: '赵六',
    approver: '待定',
    station: '中石化XX加油站',
  },
];

// 模拟油罐数据
const tanks = [
  { id: 'T001', name: '1号油罐', oilType: '95#汽油', station: '中石化XX加油站' },
  { id: 'T002', name: '2号油罐', oilType: '95#汽油', station: '中石化XX加油站' },
  { id: 'T003', name: '3号油罐', oilType: '-10#柴油', station: '中石化XX加油站' },
  { id: 'T004', name: '4号油罐', oilType: '0#柴油', station: '中石化XX加油站' },
  { id: 'T005', name: '5号油罐', oilType: '98#汽油', station: '中石化XX加油站' },
];

const TankChangeManagement = () => {
  const [changes, setChanges] = useState(initialChanges);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredChanges, setFilteredChanges] = useState(initialChanges);

  useEffect(() => {
    const filtered = changes.filter(
      (change) =>
        change.tankName.toLowerCase().includes(searchText.toLowerCase()) ||
        change.oldOilType.toLowerCase().includes(searchText.toLowerCase()) ||
        change.newOilType.toLowerCase().includes(searchText.toLowerCase()) ||
        change.status.toLowerCase().includes(searchText.toLowerCase()) ||
        change.id.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredChanges(filtered);
  }, [searchText, changes]);

  const showAddModal = () => {
    setSelectedChange(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showDetailModal = (record) => {
    setSelectedChange(record);
    setIsDetailModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      setTimeout(() => {
        // 生成新的变更记录
        const newChange = {
          id: `TCH${moment().format('YYYYMMDD')}${String(changes.length + 1).padStart(3, '0')}`,
          tankId: values.tankId,
          tankName: tanks.find(tank => tank.id === values.tankId)?.name || '',
          oldOilType: tanks.find(tank => tank.id === values.tankId)?.oilType || '',
          newOilType: values.newOilType,
          changeDate: values.changeDate.format('YYYY-MM-DD'),
          reason: values.reason,
          status: '待审批',
          operator: '当前用户',
          approver: '待定',
          station: tanks.find(tank => tank.id === values.tankId)?.station || '',
        };
        setChanges([newChange, ...changes]);
        message.success('油罐油品变更申请已提交');
        setLoading(false);
        setIsModalVisible(false);
      }, 500);
    });
  };

  const getStatusStep = (status) => {
    switch (status) {
      case '待审批':
        return 1;
      case '审批中':
        return 1;
      case '已完成':
        return 2;
      case '已拒绝':
        return 2;
      default:
        return 0;
    }
  };

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
      title: '变更单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '油罐名称',
      dataIndex: 'tankName',
      key: 'tankName',
      width: 120,
    },
    {
      title: '原油品类型',
      dataIndex: 'oldOilType',
      key: 'oldOilType',
      width: 120,
    },
    {
      title: '新油品类型',
      dataIndex: 'newOilType',
      key: 'newOilType',
      width: 120,
    },
    {
      title: '变更日期',
      dataIndex: 'changeDate',
      key: 'changeDate',
      width: 120,
    },
    {
      title: '变更原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <Tag color={getStatusColor(text)}>{text}</Tag>,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showDetailModal(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="tank-change-management">
      <Card
        title="油罐油品变更管理"
        extra={
          <Space>
            <Input
              placeholder="搜索变更记录"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
            >
              申请变更
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredChanges}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 申请变更表单 */}
      <Modal
        title="申请油罐油品变更"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="tankId"
            label="选择油罐"
            rules={[{ required: true, message: '请选择油罐' }]}
          >
            <Select placeholder="请选择油罐">
              {tanks.map(tank => (
                <Option key={tank.id} value={tank.id}>{`${tank.name} (${tank.oilType})`}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="newOilType"
            label="新油品类型"
            rules={[{ required: true, message: '请选择新油品类型' }]}
          >
            <Select placeholder="请选择新油品类型">
              <Option value="92#汽油">92#汽油</Option>
              <Option value="95#汽油">95#汽油</Option>
              <Option value="98#汽油">98#汽油</Option>
              <Option value="0#柴油">0#柴油</Option>
              <Option value="-10#柴油">-10#柴油</Option>
              <Option value="-20#柴油">-20#柴油</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="changeDate"
            label="计划变更日期"
            rules={[{ required: true, message: '请选择计划变更日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reason"
            label="变更原因"
            rules={[{ required: true, message: '请输入变更原因' }]}
          >
            <TextArea rows={4} placeholder="请输入变更原因" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 变更详情 */}
      <Modal
        title="油罐油品变更详情"
        open={isDetailModalVisible}
        onCancel={handleDetailCancel}
        footer={[
          <Button key="back" onClick={handleDetailCancel}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedChange && (
          <div>
            <Steps current={getStatusStep(selectedChange.status)} status={selectedChange.status === '已拒绝' ? 'error' : 'process'}>
              <Step title="提交申请" description={`操作人: ${selectedChange.operator}`} />
              <Step title="审批" description={selectedChange.status === '待审批' || selectedChange.status === '审批中' ? '进行中' : `审批人: ${selectedChange.approver}`} />
              <Step title="完成变更" description={selectedChange.status === '已完成' ? '已完成' : ''} />
            </Steps>

            <Divider />

            <div className="detail-info">
              <div className="detail-item">
                <span className="label">变更单号:</span>
                <span className="value">{selectedChange.id}</span>
              </div>
              <div className="detail-item">
                <span className="label">油罐名称:</span>
                <span className="value">{selectedChange.tankName}</span>
              </div>
              <div className="detail-item">
                <span className="label">所属加油站:</span>
                <span className="value">{selectedChange.station}</span>
              </div>
              <div className="detail-item">
                <span className="label">原油品类型:</span>
                <span className="value">{selectedChange.oldOilType}</span>
              </div>
              <div className="detail-item">
                <span className="label">新油品类型:</span>
                <span className="value">{selectedChange.newOilType}</span>
              </div>
              <div className="detail-item">
                <span className="label">变更日期:</span>
                <span className="value">{selectedChange.changeDate}</span>
              </div>
              <div className="detail-item">
                <span className="label">变更原因:</span>
                <span className="value">{selectedChange.reason}</span>
              </div>
              <div className="detail-item">
                <span className="label">当前状态:</span>
                <span className="value">
                  <Tag color={getStatusColor(selectedChange.status)}>{selectedChange.status}</Tag>
                </span>
              </div>
              <div className="detail-item">
                <span className="label">操作人:</span>
                <span className="value">{selectedChange.operator}</span>
              </div>
              <div className="detail-item">
                <span className="label">审批人:</span>
                <span className="value">{selectedChange.approver}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TankChangeManagement; 