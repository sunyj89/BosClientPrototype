import React from 'react';
import { Modal, Button, Descriptions, Tag } from 'antd';
import moment from 'moment';

const ReceiptViewModal = ({ visible, receiptData, onClose }) => {
  if (!receiptData) return null;

  const statusConfig = {
    pending: { text: '待确认', color: 'orange' },
    confirmed: { text: '已确认', color: 'green' },
    rejected: { text: '已驳回', color: 'red' }
  };

  return (
    <Modal
      title="收货确认单详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
      width={900}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="收货单号">{receiptData.receiptNumber}</Descriptions.Item>
        <Descriptions.Item label="关联订单号">{receiptData.relatedOrderNumber || receiptData.orderNumber}</Descriptions.Item>
        <Descriptions.Item label="关联供应商">{receiptData.supplierName}</Descriptions.Item>
        <Descriptions.Item label="报价单号">{receiptData.quotationNumber}</Descriptions.Item>
        <Descriptions.Item label="油品类型">
          <Tag color="blue">{receiptData.oilType}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="到货时间">
          {receiptData.arrivalTime ? moment(receiptData.arrivalTime).format('YYYY-MM-DD HH:mm') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="订购数量(吨)">{receiptData.orderedQuantityTons}吨</Descriptions.Item>
        <Descriptions.Item label="到货重量(kg)">
          <strong style={{ color: '#1890ff' }}>
            {receiptData.actualWeightKg ? receiptData.actualWeightKg.toLocaleString() : 0}kg
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label="实际数量(吨)">
          <strong>{receiptData.actualQuantityTons}吨</strong>
        </Descriptions.Item>
        <Descriptions.Item label="差异数量(吨)">
          <strong style={{ 
            color: receiptData.varianceTons > 0 ? '#52c41a' : receiptData.varianceTons < 0 ? '#f5222d' : '#666'
          }}>
            {receiptData.varianceTons > 0 ? '+' : ''}{receiptData.varianceTons}吨
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label="过磅单">
          {receiptData.weighingSlips && receiptData.weighingSlips.length > 0 ? (
            <Tag color="green">{receiptData.weighingSlips.length}张</Tag>
          ) : (
            <Tag color="default">无</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="收货状态">
          <Tag color={statusConfig[receiptData.receiptStatus]?.color || 'default'}>
            {statusConfig[receiptData.receiptStatus]?.text || receiptData.receiptStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="收货员">{receiptData.receiver}</Descriptions.Item>
        <Descriptions.Item label="差异原因">{receiptData.varianceReason || '-'}</Descriptions.Item>
        <Descriptions.Item label="备注说明" span={2}>{receiptData.remarks || '-'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ReceiptViewModal;