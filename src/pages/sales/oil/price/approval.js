import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Row, 
  Col, 
  message,
  Breadcrumb,
  Descriptions,
  Radio,
  Divider,
  Spin,
  Tag,
  Alert
} from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  RollbackOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';

const OilPriceApproval = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [priceDetail, setPriceDetail] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // 获取价格调整详情
  useEffect(() => {
    const fetchPriceDetail = async () => {
      setInitialLoading(true);
      try {
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟价格调整详情数据
        const mockDetail = {
          priceNo: 'PRC20231121001',
          station: '油站2',
          oilType: '95#汽油',
          oldPrice: 8.38,
          newPrice: 8.58,
          effectiveDate: '2023-11-25',
          status: '待生效',
          creator: '张三',
          createTime: '2023-11-21 10:15:30',
          remark: '根据市场价格波动进行调整'
        };
        
        setPriceDetail(mockDetail);
      } catch (error) {
        console.error('获取价格调整详情失败:', error);
        message.error('获取价格调整详情失败');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPriceDetail();
  }, [id]);

  // 表单提交
  const handleSubmit = (values) => {
    console.log('提交的审批数据:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      if (values.approvalResult === 'approved') {
        message.success('价格调整单审批通过');
      } else {
        message.success('价格调整单已拒绝');
      }
      setLoading(false);
      navigate('/sales/oil/price');
    }, 1500);
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/sales/oil/price');
  };

  // 快速通过
  const handleQuickApprove = () => {
    form.setFieldsValue({
      approvalResult: 'approved',
      approvalRemark: '价格调整合理，同意生效'
    });
    form.submit();
  };

  // 快速拒绝
  const handleQuickReject = () => {
    form.setFieldsValue({
      approvalResult: 'rejected',
      approvalRemark: '价格调整不合理，不同意生效'
    });
    form.submit();
  };

  return (
    <div>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales">销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales/oil">油品销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales/oil/price">价格管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>价格调整审批</Breadcrumb.Item>
      </Breadcrumb>

      {/* 提示信息 */}
      <Alert
        message="价格调整审批说明"
        description="请仔细审核价格调整信息，确认调整合理性后进行审批。审批通过后，价格调整将在生效日期自动生效。"
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      <Spin spinning={initialLoading}>
        {priceDetail && (
          <>
            {/* 基本信息卡片 */}
            <Card title="价格调整信息" bordered={false}>
              <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="调整单号">{priceDetail.priceNo}</Descriptions.Item>
                <Descriptions.Item label="油站">{priceDetail.station}</Descriptions.Item>
                <Descriptions.Item label="油品类型">{priceDetail.oilType}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag icon={<ClockCircleOutlined />} color="warning">待生效</Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="当前价格">
                  ¥ {priceDetail.oldPrice.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="新价格">
                  ¥ {priceDetail.newPrice.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="生效日期">{priceDetail.effectiveDate}</Descriptions.Item>
                
                <Descriptions.Item label="创建人">{priceDetail.creator}</Descriptions.Item>
                <Descriptions.Item label="创建时间" span={3}>{priceDetail.createTime}</Descriptions.Item>
                
                <Descriptions.Item label="备注" span={4}>{priceDetail.remark || '无'}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 审批表单卡片 */}
            <Card title="审批信息" style={{ marginTop: 16 }} bordered={false}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  approvalResult: 'approved'
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name="approvalResult"
                      label="审批结果"
                      rules={[{ required: true, message: '请选择审批结果' }]}
                    >
                      <Radio.Group>
                        <Radio value="approved">
                          <Tag icon={<CheckCircleOutlined />} color="success">通过</Tag>
                        </Radio>
                        <Radio value="rejected">
                          <Tag icon={<CloseCircleOutlined />} color="error">拒绝</Tag>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name="approvalRemark"
                      label="审批意见"
                      rules={[{ required: true, message: '请输入审批意见' }]}
                    >
                      <Input.TextArea rows={4} placeholder="请输入审批意见" />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Space>
                      <Button onClick={handleBack} icon={<RollbackOutlined />}>
                        返回
                      </Button>
                      <Button 
                        type="danger" 
                        onClick={handleQuickReject} 
                        icon={<CloseOutlined />}
                        loading={loading}
                      >
                        拒绝
                      </Button>
                      <Button 
                        type="primary" 
                        onClick={handleQuickApprove} 
                        icon={<CheckOutlined />}
                        loading={loading}
                      >
                        通过
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Card>
          </>
        )}
      </Spin>
    </div>
  );
};

export default OilPriceApproval; 