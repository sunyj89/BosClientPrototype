import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Descriptions,
  Steps,
  Divider,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Table,
  message,
  Modal,
  Form,
  Input,
  Spin,
  Result
} from 'antd';
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import './index.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const DirectSalesOrderDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalForm] = Form.useForm();
  const [approvalType, setApprovalType] = useState('approve');

  // 从URL获取订单ID
  const getOrderIdFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('id');
  };

  // 组件加载时获取订单详情
  useEffect(() => {
    const orderId = getOrderIdFromUrl();
    if (orderId) {
      fetchOrderDetail(orderId);
    } else {
      message.error('订单ID不存在');
      navigate('/sales/oil/direct');
    }
  }, []);

  // 获取订单详情
  const fetchOrderDetail = (orderId) => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockDetail = generateMockOrderDetail(orderId);
      setOrderDetail(mockDetail);
      setLoading(false);
    }, 1000);
  };

  // 生成模拟订单详情数据
  const generateMockOrderDetail = (orderId) => {
    const statuses = ['待审批', '已审批', '已完成', '已取消', '草稿'];
    const status = statuses[Math.floor(Math.random() * 3)]; // 随机状态，但不包括已取消和草稿
    const createdTime = moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss');
    const deliveryTime = moment(createdTime).add(Math.floor(Math.random() * 10), 'days').format('YYYY-MM-DD');
    
    // 生成审批步骤和日志
    const approvalSteps = [
      {
        title: '提交申请',
        status: 'finish',
        description: '管理员 ' + createdTime
      },
      {
        title: '审批',
        status: status === '待审批' ? 'process' : 'finish',
        description: status === '待审批' ? '等待审批' : '系统管理员 ' + moment(createdTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '完成',
        status: status === '已完成' ? 'finish' : 'wait',
        description: status === '已完成' ? '订单已完成 ' + moment(createdTime).add(3, 'days').format('YYYY-MM-DD HH:mm:ss') : '等待完成'
      }
    ];
    
    // 生成审批日志
    const approvalLogs = [];
    if (status !== '待审批' && status !== '草稿') {
      approvalLogs.push({
        time: moment(createdTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        operator: '系统管理员',
        action: status === '已取消' ? '驳回了申请' : '审批通过了申请',
        comment: status === '已取消' ? '不符合直销条件，请修改后重新提交' : '符合直销条件，审批通过'
      });
    }
    
    if (status === '已完成') {
      approvalLogs.push({
        time: moment(createdTime).add(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
        operator: '系统管理员',
        action: '标记订单为已完成',
        comment: '订单已完成交付'
      });
    }
    
    return {
      id: orderId,
      customer: '中石化XX分公司',
      customerContact: '张经理',
      customerPhone: '13800138000',
      oilType: '92#汽油',
      volume: 8500,
      price: 7.25,
      amount: (8500 * 7.25).toFixed(2),
      deliveryTime,
      deliveryAddress: 'XX市XX区XX路XX号',
      transportMethod: '自提',
      paymentMethod: '月结',
      status,
      createdBy: '管理员',
      createdTime,
      approver: status === '待审批' ? '' : '系统管理员',
      approvalTime: status === '待审批' ? '' : moment(createdTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      remark: '客户要求在工作日上午9点前交付',
      approvalSteps,
      approvalLogs
    };
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/sales/oil/direct');
  };

  // 处理审批
  const handleApproval = (type) => {
    setApprovalType(type);
    approvalForm.resetFields();
    setApprovalModalVisible(true);
  };

  // 提交审批
  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(values => {
      console.log('审批信息:', values);
      message.success(`订单 ${orderDetail.id} 已${approvalType === 'approve' ? '审批通过' : '驳回'}`);
      setApprovalModalVisible(false);
      
      // 更新订单状态
      setOrderDetail({
        ...orderDetail,
        status: approvalType === 'approve' ? '已审批' : '已取消',
        approver: '系统管理员',
        approvalTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        approvalSteps: orderDetail.approvalSteps.map((step, index) => {
          if (index === 1) {
            return {
              ...step,
              status: 'finish',
              description: '系统管理员 ' + moment().format('YYYY-MM-DD HH:mm:ss')
            };
          }
          return step;
        }),
        approvalLogs: [
          ...orderDetail.approvalLogs,
          {
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            operator: '系统管理员',
            action: approvalType === 'approve' ? '审批通过了申请' : '驳回了申请',
            comment: values.comment
          }
        ]
      });
    });
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '待审批':
        return <Tag color="blue" className="direct-sales-status-tag">待审批</Tag>;
      case '已审批':
        return <Tag color="green" className="direct-sales-status-tag">已审批</Tag>;
      case '已完成':
        return <Tag color="success" className="direct-sales-status-tag">已完成</Tag>;
      case '已取消':
        return <Tag color="red" className="direct-sales-status-tag">已取消</Tag>;
      case '草稿':
        return <Tag color="default" className="direct-sales-status-tag">草稿</Tag>;
      default:
        return <Tag color="default" className="direct-sales-status-tag">{status}</Tag>;
    }
  };

  // 渲染审批弹窗
  const renderApprovalModal = () => (
    <Modal
      title={`${approvalType === 'approve' ? '审批' : '驳回'}订单 - ${orderDetail?.id || ''}`}
      open={approvalModalVisible}
      onCancel={() => setApprovalModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setApprovalModalVisible(false)}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleApprovalSubmit}
        >
          确认{approvalType === 'approve' ? '审批' : '驳回'}
        </Button>
      ]}
    >
      <Form form={approvalForm} layout="vertical">
        <Form.Item
          name="comment"
          label="审批意见"
          rules={[{ required: true, message: '请输入审批意见' }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder={`请输入${approvalType === 'approve' ? '审批' : '驳回'}意见`} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="direct-sales-container">
      <div className="direct-sales-header">
        <Space>
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            返回列表
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            油品直销订单详情
          </Title>
        </Space>
        <Space>
          {orderDetail && orderDetail.status === '待审批' && (
            <>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleApproval('approve')}
              >
                审批通过
              </Button>
              <Button 
                danger 
                icon={<CloseCircleOutlined />} 
                onClick={() => handleApproval('reject')}
              >
                驳回
              </Button>
            </>
          )}
          <Button 
            type="primary" 
            icon={<PrinterOutlined />}
            onClick={() => message.info('打印功能开发中')}
          >
            打印
          </Button>
          <Button 
            type="primary" 
            icon={<ExportOutlined />}
            onClick={() => message.info('导出功能开发中')}
          >
            导出
          </Button>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : orderDetail ? (
        <>
          <Card title="基本信息" className="direct-sales-detail-card">
            <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="订单编号">{orderDetail.id}</Descriptions.Item>
              <Descriptions.Item label="客户名称">{orderDetail.customer}</Descriptions.Item>
              <Descriptions.Item label="联系人">{orderDetail.customerContact}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{orderDetail.customerPhone}</Descriptions.Item>
              <Descriptions.Item label="油品类型">{orderDetail.oilType}</Descriptions.Item>
              <Descriptions.Item label="销售数量">{orderDetail.volume.toLocaleString()} 升</Descriptions.Item>
              <Descriptions.Item label="单价">{orderDetail.price} 元/升</Descriptions.Item>
              <Descriptions.Item label="销售金额">{parseFloat(orderDetail.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元</Descriptions.Item>
              <Descriptions.Item label="交付日期">{orderDetail.deliveryTime}</Descriptions.Item>
              <Descriptions.Item label="交付地址">{orderDetail.deliveryAddress}</Descriptions.Item>
              <Descriptions.Item label="运输方式">{orderDetail.transportMethod}</Descriptions.Item>
              <Descriptions.Item label="支付方式">{orderDetail.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(orderDetail.status)}</Descriptions.Item>
              <Descriptions.Item label="创建人">{orderDetail.createdBy}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{orderDetail.createdTime}</Descriptions.Item>
              {orderDetail.approver && (
                <Descriptions.Item label="审批人">{orderDetail.approver}</Descriptions.Item>
              )}
              {orderDetail.approvalTime && (
                <Descriptions.Item label="审批时间">{orderDetail.approvalTime}</Descriptions.Item>
              )}
              <Descriptions.Item label="备注" span={2}>{orderDetail.remark || '无'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="审批流程" className="direct-sales-detail-card" style={{ marginTop: 16 }}>
            <Steps 
              current={orderDetail.status === '待审批' ? 1 : (orderDetail.status === '已审批' ? 2 : (orderDetail.status === '已完成' ? 3 : -1))}
              status={orderDetail.status === '已取消' ? 'error' : 'process'}
              className="direct-sales-approval-steps"
            >
              {orderDetail.approvalSteps.map((step, index) => (
                <Step 
                  key={index} 
                  title={step.title} 
                  description={step.description} 
                  status={step.status}
                />
              ))}
            </Steps>
          </Card>

          {orderDetail.approvalLogs.length > 0 && (
            <Card title="审批记录" className="direct-sales-detail-card" style={{ marginTop: 16 }}>
              {orderDetail.approvalLogs.map((log, index) => (
                <div key={index} className="direct-sales-approval-log-item">
                  <div className="direct-sales-approval-log-time">{log.time}</div>
                  <div className="direct-sales-approval-log-content">
                    <Text strong>{log.operator}</Text> 
                    <Text> {log.action}</Text>
                  </div>
                  <div className="direct-sales-approval-log-comment">
                    {log.comment}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      ) : (
        <Card>
          <Result
            status="error"
            title="获取订单详情失败"
            subTitle="无法获取订单信息，请返回列表重试"
            extra={[
              <Button type="primary" key="back" onClick={handleBack}>
                返回列表
              </Button>,
            ]}
          />
        </Card>
      )}

      {renderApprovalModal()}
    </div>
  );
};

export default DirectSalesOrderDetail; 