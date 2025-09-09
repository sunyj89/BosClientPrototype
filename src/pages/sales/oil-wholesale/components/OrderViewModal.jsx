import React from 'react';
import { Modal, Button, Descriptions, Tag } from 'antd';
import moment from 'moment';

const OrderViewModal = ({ visible, orderData, onClose }) => {
  if (!orderData) return null;

  const statusConfig = {
    pending_delivery: { text: '待配送', color: 'orange' },
    delivered: { text: '已配送', color: 'blue' },
    completed: { text: '已完成', color: 'green' },
    cancelled: { text: '已取消', color: 'red' }
  };

  return (
    <Modal
      title="订货通知单详情"
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
        <Descriptions.Item label="订货单号">{orderData.orderNumber}</Descriptions.Item>
        <Descriptions.Item label="订货日期">{orderData.orderDate}</Descriptions.Item>
        <Descriptions.Item label="订货单位">{orderData.orderingCompany}</Descriptions.Item>
        <Descriptions.Item label="油品类型">{orderData.oilType}</Descriptions.Item>
        <Descriptions.Item label="订货数量">{orderData.quantityTons}吨</Descriptions.Item>
        <Descriptions.Item label="要求配送日期">{orderData.requiredDeliveryDate}</Descriptions.Item>
        <Descriptions.Item label="订单状态">
          <Tag color={statusConfig[orderData.orderStatus]?.color || 'default'}>
            {statusConfig[orderData.orderStatus]?.text || orderData.orderStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {orderData.createTime ? moment(orderData.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">{orderData.creator || '-'}</Descriptions.Item>
        <Descriptions.Item label="审批人">{orderData.approver || '-'}</Descriptions.Item>
        <Descriptions.Item label="审批时间">
          {orderData.approvalTime ? moment(orderData.approvalTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="配送地址" span={2}>{orderData.deliveryAddress}</Descriptions.Item>
      </Descriptions>

      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 24,
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        收货人信息
      </div>

      <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="收货人">{orderData.receiverName || '-'}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{orderData.contactPhone || '-'}</Descriptions.Item>
        <Descriptions.Item label="身份证号">{orderData.idCardNumber || '-'}</Descriptions.Item>
      </Descriptions>

      {orderData.attachments && orderData.attachments.length > 0 && (
        <>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginTop: 24,
            marginBottom: 16,
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 8
          }}>
            附件信息
          </div>
          
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="附件">
              {orderData.attachments.map((file, index) => (
                <Button key={index} type="link" href={file.url} target="_blank">
                  {file.name}
                </Button>
              ))}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default OrderViewModal;