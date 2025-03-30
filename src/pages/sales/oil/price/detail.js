import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  Divider, 
  Breadcrumb,
  Spin,
  Row,
  Col,
  Timeline
} from 'antd';
import { 
  RollbackOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';

const OilPriceDetail = () => {
  const [loading, setLoading] = useState(true);
  const [priceDetail, setPriceDetail] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // 获取价格调整详情
  useEffect(() => {
    // 模拟API请求
    const fetchPriceDetail = async () => {
      setLoading(true);
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
          remark: '根据市场价格波动进行调整',
          approvalStatus: '已审批',
          approver: '李四',
          approvalTime: '2023-11-21 14:30:45',
          approvalRemark: '价格调整合理，同意生效',
          history: [
            {
              time: '2023-11-21 10:15:30',
              operator: '张三',
              action: '创建价格调整单',
              content: '创建了价格调整单PRC20231121001'
            },
            {
              time: '2023-11-21 11:20:15',
              operator: '王五',
              action: '提交审批',
              content: '提交价格调整单至审批中心'
            },
            {
              time: '2023-11-21 14:30:45',
              operator: '李四',
              action: '审批通过',
              content: '价格调整合理，同意生效'
            }
          ]
        };
        
        setPriceDetail(mockDetail);
      } catch (error) {
        console.error('获取价格调整详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceDetail();
  }, [id]);

  // 返回列表页
  const handleBack = () => {
    navigate('/sales/oil/price');
  };

  // 根据状态返回对应的标签
  const renderStatusTag = (status) => {
    switch (status) {
      case '待生效':
        return <Tag icon={<ClockCircleOutlined />} color="warning">待生效</Tag>;
      case '已生效':
        return <Tag icon={<CheckCircleOutlined />} color="success">已生效</Tag>;
      case '已取消':
        return <Tag icon={<CloseCircleOutlined />} color="error">已取消</Tag>;
      default:
        return <Tag icon={<ExclamationCircleOutlined />} color="default">{status}</Tag>;
    }
  };

  // 渲染审批状态标签
  const renderApprovalStatusTag = (status) => {
    switch (status) {
      case '待审批':
        return <Tag icon={<ClockCircleOutlined />} color="warning">待审批</Tag>;
      case '已审批':
        return <Tag icon={<CheckCircleOutlined />} color="success">已审批</Tag>;
      case '已拒绝':
        return <Tag icon={<CloseCircleOutlined />} color="error">已拒绝</Tag>;
      default:
        return <Tag icon={<ExclamationCircleOutlined />} color="default">{status}</Tag>;
    }
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
        <Breadcrumb.Item>价格调整详情</Breadcrumb.Item>
      </Breadcrumb>

      <Spin spinning={loading}>
        {priceDetail && (
          <>
            {/* 基本信息卡片 */}
            <Card 
              title="价格调整详情" 
              bordered={false}
              extra={
                <Button 
                  type="primary" 
                  icon={<RollbackOutlined />} 
                  onClick={handleBack}
                >
                  返回
                </Button>
              }
            >
              <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="调整单号">{priceDetail.priceNo}</Descriptions.Item>
                <Descriptions.Item label="油站">{priceDetail.station}</Descriptions.Item>
                <Descriptions.Item label="油品类型">{priceDetail.oilType}</Descriptions.Item>
                <Descriptions.Item label="状态">{renderStatusTag(priceDetail.status)}</Descriptions.Item>
                
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

              <Divider orientation="left">审批信息</Divider>
              
              <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="审批状态">
                  {renderApprovalStatusTag(priceDetail.approvalStatus)}
                </Descriptions.Item>
                <Descriptions.Item label="审批人">{priceDetail.approver}</Descriptions.Item>
                <Descriptions.Item label="审批时间" span={2}>{priceDetail.approvalTime}</Descriptions.Item>
                <Descriptions.Item label="审批意见" span={4}>{priceDetail.approvalRemark || '无'}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 操作历史卡片 */}
            <Card title="操作历史" style={{ marginTop: 16 }} bordered={false}>
              <Row>
                <Col span={24}>
                  <Timeline mode="left">
                    {priceDetail.history.map((item, index) => (
                      <Timeline.Item key={index} label={item.time}>
                        <p><strong>{item.operator}</strong> - {item.action}</p>
                        <p>{item.content}</p>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Spin>
    </div>
  );
};

export default OilPriceDetail; 