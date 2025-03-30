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
  Divider,
  message,
  Alert,
  Spin
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  UserOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import { 
  fetchStationAuditHistory, 
  auditStation 
} from '../services/stationService';
import { 
  AUDIT_DRAWER_CONFIG, 
  APPROVAL_STATUS, 
  AUDIT_ACTIONS,
  FORM_RULES,
  STATION_STATUS
} from '../utils/constants';

const { TextArea } = Input;

const AuditDrawer = ({ visible, onClose, station, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (visible && station?.id) {
      fetchHistory(station.id);
      form.resetFields();
    }
  }, [visible, station, form]);

  const fetchHistory = async (stationId) => {
    try {
      setHistoryLoading(true);
      const response = await fetchStationAuditHistory(stationId);
      setAuditHistory(response.list || []);
    } catch (error) {
      console.error('获取审批历史失败', error);
      message.error('获取审批历史失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await auditStation({
        stationId: station.id,
        result: values.result,
        comments: values.comments,
        operateUser: '当前审批人', // 实际项目中应该从登录用户信息中获取
        operateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      
      if (response.success) {
        message.success(response.message);
        if (onSuccess) onSuccess();
      } else {
        message.error(response.message || '审批操作失败');
      }
    } catch (error) {
      console.error('审批提交错误:', error);
      message.error('提交失败，请检查表单');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return '#faad14'; // 黄色
      case APPROVAL_STATUS.APPROVED:
        return '#52c41a'; // 绿色
      case APPROVAL_STATUS.REJECTED:
        return '#f5222d'; // 红色
      default:
        return '#d9d9d9'; // 灰色
    }
  };

  const getAlertType = (status) => {
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return 'warning';
      case APPROVAL_STATUS.APPROVED:
        return 'success';
      case APPROVAL_STATUS.REJECTED:
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (operateType) => {
    if (operateType.includes('通过')) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    } else if (operateType.includes('拒绝')) {
      return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    } else if (operateType.includes('提交')) {
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    } else {
      return <UserOutlined />;
    }
  };

  // 渲染油站信息
  const renderStationInfo = () => {
    if (!station) return null;

    return (
      <div className="audit-info">
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="油站ID" span={1}>{station.id}</Descriptions.Item>
          <Descriptions.Item label="油站名称" span={1}>{station.name}</Descriptions.Item>
          <Descriptions.Item label="所属分公司" span={1}>{station.branchName}</Descriptions.Item>
          <Descriptions.Item label="站长" span={1}>{station.manager}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={1}>{station.contact}</Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>
            <Tag color={station.status === STATION_STATUS.NORMAL ? 'green' : 'orange'}>
              {station.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="油品类型" span={2}>{station.oilTypes}</Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>{station.address}</Descriptions.Item>
          <Descriptions.Item label="加油枪数" span={1}>{station.gunCount}</Descriptions.Item>
          <Descriptions.Item label="员工数" span={1}>{station.employeeCount}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>{station.createTime}</Descriptions.Item>
          <Descriptions.Item label="审批状态" span={1}>
            <Tag color={getStatusColor(station.approvalStatus)}>
              {station.approvalStatus || '无需审批'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  // 渲染审批历史
  const renderAuditHistory = () => {
    return (
      <div className="audit-history">
        <Spin spinning={historyLoading}>
          <Timeline>
            {auditHistory.length > 0 ? (
              auditHistory.map((item, index) => (
                <Timeline.Item 
                  key={index}
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
        </Spin>
      </div>
    );
  };

  // 渲染审批表单
  const renderAuditForm = () => {
    const isPending = station?.approvalStatus === APPROVAL_STATUS.PENDING;

    return (
      <div className="audit-form">
        <Form
          form={form}
          layout="vertical"
        >
          {isPending && (
            <>
              <Form.Item
                name="result"
                label="审批结果"
                rules={[FORM_RULES.required]}
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
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose}>关闭</Button>
              {isPending && (
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
                    style={{ 
                      backgroundColor: '#32AF50', 
                      borderColor: '#32AF50' 
                    }}
                  >
                    通过
                  </Button>
                </>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <Drawer
      title={AUDIT_DRAWER_CONFIG.title}
      open={visible}
      onClose={onClose}
      width={AUDIT_DRAWER_CONFIG.width}
      placement={AUDIT_DRAWER_CONFIG.placement}
      destroyOnClose={AUDIT_DRAWER_CONFIG.destroyOnClose}
      className="audit-drawer"
      footer={null}
    >
      <div className="audit-drawer-content">
        <Alert
          message={
            <span>
              当前状态：
              <Tag color={getStatusColor(station?.approvalStatus)}>
                {station?.approvalStatus || '无需审批'}
              </Tag>
              {station?.submitter && station?.submitTime && (
                <>
                  提交人：{station.submitter} | 
                  提交时间：{station.submitTime}
                </>
              )}
            </span>
          }
          type={getAlertType(station?.approvalStatus)}
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <div className="audit-section">
          <h3>基本信息</h3>
          {renderStationInfo()}
        </div>
        
        <Divider />
        
        <div className="audit-section">
          <h3>审批历史</h3>
          {renderAuditHistory()}
        </div>
        
        <Divider />
        
        <div className="audit-section">
          <h3>审批操作</h3>
          {renderAuditForm()}
        </div>
      </div>
    </Drawer>
  );
};

export default AuditDrawer; 