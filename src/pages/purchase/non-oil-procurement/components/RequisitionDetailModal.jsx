import React from 'react';
import {
  Modal,
  Descriptions,
  Table,
  Tag,
  Badge,
  Timeline,
  Card,
  Button
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const RequisitionDetailModal = ({ visible, onCancel, requisitionData }) => {
  if (!requisitionData) return null;

  // 状态配置
  const statusConfig = {
    'draft': { color: 'default', text: '草稿', badge: 'default' },
    'pending': { color: 'processing', text: '待审批', badge: 'processing' },
    'approved': { color: 'success', text: '已批准', badge: 'success' },
    'rejected': { color: 'error', text: '已驳回', badge: 'error' },
    'processed': { color: 'warning', text: '已处理', badge: 'warning' }
  };

  // 优先级配置
  const priorityConfig = {
    'low': { color: 'default', text: '低' },
    'normal': { color: 'processing', text: '普通' },
    'urgent': { color: 'error', text: '紧急' }
  };

  // 商品列表表格列定义
  const productColumns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 200
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      render: (unit) => <Tag color="blue">{unit}</Tag>
    },
    {
      title: '申请数量',
      dataIndex: 'requestedQuantity',
      key: 'requestedQuantity',
      width: 100,
      align: 'right',
      render: (quantity) => <span style={{ fontWeight: 500 }}>{quantity}</span>
    },
    {
      title: '零售单价',
      dataIndex: 'estimatedUnitPrice',
      key: 'estimatedUnitPrice',
      width: 120,
      align: 'right',
      render: (price) => <span style={{ color: '#1890ff' }}>￥{price?.toFixed(2)}</span>
    },
    {
      title: '零售金额',
      dataIndex: 'estimatedAmount',
      key: 'estimatedAmount',
      width: 120,
      align: 'right',
      render: (amount) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>
          ￥{amount?.toFixed(2)}
        </span>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      ellipsis: true
    }
  ];

  // 生成审批流程时间线
  const generateTimeline = () => {
    const items = [
      {
        dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
        color: 'blue',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>申请创建</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              {requisitionData.applicant} 于 {requisitionData.createTime} 创建申请
            </div>
          </div>
        )
      }
    ];

    if (requisitionData.submitTime) {
      items.push({
        dot: <ExclamationCircleOutlined style={{ fontSize: '16px' }} />,
        color: 'orange',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>提交审批</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              于 {requisitionData.submitTime} 提交审批
            </div>
          </div>
        )
      });
    }

    if (requisitionData.approvalTime) {
      const isApproved = requisitionData.status === 'approved' || requisitionData.status === 'processed';
      items.push({
        dot: isApproved ? 
          <CheckCircleOutlined style={{ fontSize: '16px' }} /> : 
          <CloseCircleOutlined style={{ fontSize: '16px' }} />,
        color: isApproved ? 'green' : 'red',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>
              {isApproved ? '审批通过' : '审批驳回'}
            </div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              {requisitionData.approver} 于 {requisitionData.approvalTime} {isApproved ? '批准' : '驳回'}了申请
            </div>
            {requisitionData.approvalComments && (
              <div style={{ color: '#666', fontSize: '12px', marginTop: 4 }}>
                审批意见：{requisitionData.approvalComments}
              </div>
            )}
          </div>
        )
      });
    }

    if (requisitionData.status === 'processed') {
      items.push({
        dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
        color: 'green',
        children: (
          <div>
            <div style={{ fontWeight: 500 }}>已处理</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              申请已完成处理，商品已安排采购
            </div>
          </div>
        )
      });
    }

    return items;
  };

  return (
    <Modal
      title={`申请单详情 - ${requisitionData.requisitionNo}`}
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
      destroyOnClose
    >
      {/* 基本信息 */}
      <Card 
        title="基本信息" 
        size="small" 
        style={{ marginBottom: 16 }}
        headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="申请单号">
            <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>
              {requisitionData.requisitionNo}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="当前状态">
            <Badge 
              status={statusConfig[requisitionData.status].badge} 
              text={statusConfig[requisitionData.status].text} 
            />
          </Descriptions.Item>
          <Descriptions.Item label="采购渠道">
            <Tag color="blue">{requisitionData.channelName}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="申请优先级">
            <Tag color={priorityConfig[requisitionData.priority].color}>
              {priorityConfig[requisitionData.priority].text}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所屟分公司">
            {requisitionData.branchName}
          </Descriptions.Item>
          <Descriptions.Item label="申请加油站">
            {requisitionData.stationName}
          </Descriptions.Item>
          <Descriptions.Item label="申请人">
            {requisitionData.applicant} ({requisitionData.applicantRole})
          </Descriptions.Item>
          <Descriptions.Item label="申请日期">
            {requisitionData.applicationDate}
          </Descriptions.Item>
          <Descriptions.Item label="期望到货日期">
            {requisitionData.expectedDeliveryDate}
          </Descriptions.Item>
          <Descriptions.Item label="预估总金额">
            <span style={{ fontWeight: 500, color: '#1890ff', fontSize: '16px' }}>
              ¥{requisitionData.estimatedAmount?.toLocaleString()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="商品数量">
            共 {requisitionData.productCount} 种商品
          </Descriptions.Item>
          {requisitionData.actualAmount && (
            <Descriptions.Item label="实际金额" span={2}>
              <span style={{ fontWeight: 500, color: '#52c41a', fontSize: '16px' }}>
                ¥{requisitionData.actualAmount?.toLocaleString()}
              </span>
            </Descriptions.Item>
          )}
          {requisitionData.remarks && (
            <Descriptions.Item label="备注说明" span={2}>
              {requisitionData.remarks}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 商品明细 */}
      <Card 
        title="商品明细" 
        size="small" 
        style={{ marginBottom: 16 }}
        headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
      >
        {/* 价格说明备注 */}
        <div style={{ 
          marginBottom: 16, 
          padding: '8px 12px', 
          backgroundColor: '#f0f7ff', 
          border: '1px solid #91d5ff',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '12px', color: '#096dd9' }}>
            📊 <strong>价格说明：</strong>以下金额为零售价格，仅供参考，实际采购价格以供应商报价为准
          </div>
        </div>
        <Table
          columns={productColumns}
          dataSource={requisitionData.products || []}
          rowKey="productId"
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
          summary={(pageData) => {
            const totalAmount = pageData.reduce((sum, record) => sum + (record.estimatedAmount || 0), 0);
            const totalQuantity = pageData.reduce((sum, record) => sum + (record.requestedQuantity || 0), 0);
            
            return (
              <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <span style={{ fontWeight: 500 }}>合计</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <span style={{ fontWeight: 500 }}>{totalQuantity}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <span style={{ fontWeight: 500, color: '#1890ff' }}>
                    ¥{totalAmount.toFixed(2)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>

      {/* 审批流程 */}
      <Card 
        title="审批流程" 
        size="small"
        headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
      >
        <Timeline
          mode="left"
          items={generateTimeline()}
        />
      </Card>
    </Modal>
  );
};

export default RequisitionDetailModal;