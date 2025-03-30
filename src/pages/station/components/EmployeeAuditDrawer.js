import React, { useEffect, useState } from 'react';
import { 
  Drawer, 
  Descriptions, 
  Tag, 
  Timeline, 
  Form, 
  Radio, 
  Input, 
  Button, 
  Space, 
  Alert,
  Card
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  UserOutlined,
  StopOutlined,
  CheckOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

// 审批状态定义
const APPROVAL_STATUS = {
  PENDING: '待审核',
  APPROVED: '已审核',
  CONFIRMED: '已确认',
  REJECTED: '已拒绝',
  CANCELED: '已取消'
};

const EmployeeAuditDrawer = ({ visible, onClose, record, onSubmit }) => {
  const [form] = Form.useForm();
  const [auditHistory, setAuditHistory] = useState([]);

  useEffect(() => {
    if (visible && record) {
      form.resetFields();
      // 模拟审批历史数据
      setAuditHistory(generateMockAuditHistory(record));
    }
  }, [visible, record, form]);

  // 生成模拟的审批历史记录
  const generateMockAuditHistory = (record) => {
    if (!record) return [];

    const baseHistory = [
      {
        operateUser: record.applicant,
        operateType: '提交申请',
        content: `提交了${record.type}申请`,
        time: record.applyTime
      }
    ];

    // 如果已经有审批结果，添加审批记录
    if (record.status !== APPROVAL_STATUS.PENDING) {
      baseHistory.push({
        operateUser: record.approver || '张审批',
        operateType: record.status === APPROVAL_STATUS.REJECTED ? '拒绝申请' : '通过申请',
        content: record.status === APPROVAL_STATUS.REJECTED ? 
          '申请不符合要求，拒绝' : '审核通过',
        time: record.approveTime || new Date().toLocaleString()
      });
    }

    // 如果是已确认状态，添加确认记录
    if (record.status === APPROVAL_STATUS.CONFIRMED) {
      baseHistory.push({
        operateUser: '李确认',
        operateType: '确认操作',
        content: '已确认完成审批流程',
        time: new Date(new Date(record.approveTime).getTime() + 86400000).toLocaleString() // 审批时间后一天
      });
    }

    return baseHistory;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return '#faad14'; // 黄色
      case APPROVAL_STATUS.APPROVED:
        return '#32AF50'; // 绿色
      case APPROVAL_STATUS.CONFIRMED:
        return '#1890ff'; // 蓝色
      case APPROVAL_STATUS.REJECTED:
        return '#f5222d'; // 红色
      case APPROVAL_STATUS.CANCELED:
        return '#d9d9d9'; // 灰色
      default:
        return '#d9d9d9';
    }
  };

  const getAlertType = (status) => {
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return 'warning';
      case APPROVAL_STATUS.APPROVED:
        return 'success';
      case APPROVAL_STATUS.CONFIRMED:
        return 'info';
      case APPROVAL_STATUS.REJECTED:
        return 'error';
      case APPROVAL_STATUS.CANCELED:
        return 'info';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (operateType) => {
    if (operateType.includes('通过')) {
      return <CheckCircleOutlined />;
    } else if (operateType.includes('拒绝')) {
      return <CloseCircleOutlined />;
    } else if (operateType.includes('提交')) {
      return <ExclamationCircleOutlined />;
    } else if (operateType.includes('取消')) {
      return <StopOutlined />;
    } else if (operateType.includes('确认')) {
      return <CheckOutlined />;
    } else {
      return <UserOutlined />;
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit({ 
        id: record.id,
        result: values.result,
        comments: values.comments 
      });
    });
  };

  // 渲染申请基本信息
  const renderApplicationInfo = () => {
    if (!record) return null;

    return (
      <Card title="申请基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="申请编号" span={1}>{record.id}</Descriptions.Item>
          <Descriptions.Item label="申请类型" span={1}>{record.type}</Descriptions.Item>
          <Descriptions.Item label="申请人" span={1}>{record.applicant}</Descriptions.Item>
          <Descriptions.Item label="申请时间" span={1}>{record.applyTime}</Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>
            <Tag color={getStatusColor(record.status)}>
              {record.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="申请内容" span={2}>{record.content}</Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // 渲染审批历史
  const renderAuditHistory = () => {
    return (
      <Card title="审批历史" style={{ marginBottom: 16 }}>
        <Timeline>
          {auditHistory.length > 0 ? (
            auditHistory.map((item, index) => (
              <Timeline.Item 
                key={index}
                color={
                  item.operateType.includes('通过') ? '#32AF50' :
                  item.operateType.includes('拒绝') ? '#f5222d' :
                  item.operateType.includes('提交') ? '#faad14' : '#d9d9d9'
                }
                dot={getStatusIcon(item.operateType)}
              >
                <div className="audit-history-item">
                  <div style={{ fontWeight: 'bold' }}>
                    {item.operateUser} - {item.operateType}
                  </div>
                  <div>{item.content}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    {item.time}
                  </div>
                </div>
              </Timeline.Item>
            ))
          ) : (
            <Timeline.Item>暂无审批记录</Timeline.Item>
          )}
        </Timeline>
      </Card>
    );
  };

  // 渲染审批表单
  const renderAuditForm = () => {
    const isPending = record?.status === APPROVAL_STATUS.PENDING;

    return (
      <Card title="审批意见" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
        >
          {isPending && (
            <>
              <Form.Item
                name="result"
                label="审批结果"
                rules={[{ required: true, message: '请选择审批结果' }]}
              >
                <Radio.Group>
                  <Radio value="approve">通过</Radio>
                  <Radio value="reject">拒绝</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item
                name="comments"
                label="审批意见"
                rules={[{ required: true, message: '请输入审批意见' }]}
              >
                <TextArea rows={4} placeholder="请输入审批意见..." maxLength={200} showCount />
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
    );
  };

  return (
    <Drawer
      title={`${record?.type || '员工'}审核`}
      open={visible}
      onClose={onClose}
      width={800}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            {record?.status === APPROVAL_STATUS.PENDING && (
              <>
                <Button danger onClick={() => {
                  form.setFieldsValue({ result: 'reject' });
                  handleSubmit();
                }}>
                  拒绝
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => {
                    form.setFieldsValue({ result: 'approve' });
                    handleSubmit();
                  }}
                  style={{ backgroundColor: '#32AF50', borderColor: '#32AF50' }}
                >
                  通过
                </Button>
              </>
            )}
          </Space>
        </div>
      }
    >
      {record && (
        <>
          <Alert
            message={
              <span>
                当前状态：<Tag color={getStatusColor(record.status)}>{record.status}</Tag>
                提交时间：{record.applyTime}
              </span>
            }
            type={getAlertType(record.status)}
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          {renderApplicationInfo()}
          {renderAuditHistory()}
          {renderAuditForm()}
        </>
      )}
    </Drawer>
  );
};

export default EmployeeAuditDrawer; 