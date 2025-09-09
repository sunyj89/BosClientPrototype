import React from 'react';
import { Modal, Descriptions, Tag, Button, Space, Table, Alert } from 'antd';
import { DownloadOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import InvoiceStatusTag from './InvoiceStatusTag';
import InvoiceAmountDisplay from './InvoiceAmountDisplay';

const InvoiceDetailModal = ({ 
  visible, 
  onCancel, 
  invoiceData,
  onDownload,
  onResendEmail,
  onResendSMS,
  onRetry,
  onEdit,
  onRedInvoice
}) => {
  if (!invoiceData) return null;

  // 订单明细表格列定义
  const orderDetailColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      width: 120
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      width: 80,
      align: 'center',
      render: (value) => `${(value * 100).toFixed(0)}%`
    },
    {
      title: '含税金额',
      dataIndex: 'amountWithTax',
      width: 120,
      align: 'right',
      render: (value) => `¥${value?.toFixed(2)}`
    },
    {
      title: '未税金额',
      dataIndex: 'amountWithoutTax',
      width: 120,
      align: 'right',
      render: (value) => `¥${value?.toFixed(2)}`
    },
    {
      title: '税额',
      dataIndex: 'taxAmount',
      width: 100,
      align: 'right',
      render: (value) => `¥${value?.toFixed(2)}`
    },
    {
      title: '交易时间',
      dataIndex: 'transactionTime',
      width: 160
    }
  ];

  // 渲染错误信息
  const renderErrorInfo = () => {
    if (invoiceData.invoiceStatus === '03' && (invoiceData.errorCode || invoiceData.errorMessage)) {
      return (
        <Alert
          message="开票失败信息"
          description={
            <div>
              {invoiceData.errorCode && <div>错误代码：{invoiceData.errorCode}</div>}
              {invoiceData.errorMessage && <div>错误信息：{invoiceData.errorMessage}</div>}
            </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      );
    }
    return null;
  };

  const renderFooter = () => {
    const buttons = [];

    // 根据发票状态显示不同操作按钮
    switch (invoiceData.invoiceStatus) {
      case '02': // 开票成功
        buttons.push(
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => onDownload?.(invoiceData)}
            style={{ borderRadius: '2px' }}
          >
            下载发票
          </Button>
        );
        
        if (invoiceData.emailAddress) {
          buttons.push(
            <Button 
              key="resend" 
              type="primary"
              icon={<MailOutlined />}
              onClick={() => onResendEmail?.(invoiceData)}
              style={{ borderRadius: '2px' }}
            >
              重发邮件
            </Button>
          );
        }

        if (invoiceData.buyerMobile) {
          buttons.push(
            <Button 
              key="resendSMS" 
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => onResendSMS?.(invoiceData)}
              style={{ borderRadius: '2px' }}
            >
              重发短信
            </Button>
          );
        }
        
        // 添加红冲按钮
        buttons.push(
          <Button 
            key="redInvoice"
            type="primary" 
            danger
            onClick={() => onRedInvoice?.(invoiceData)}
            style={{ borderRadius: '2px' }}
          >
            红冲申请
          </Button>
        );
        break;
        
      case '03': // 开票失败
        buttons.push(
          <Button 
            key="retry"
            type="primary" 
            onClick={() => onRetry?.(invoiceData)}
            style={{ borderRadius: '2px' }}
          >
            重试开票
          </Button>
        );
        break;
        
      case '00': // 待开票
        buttons.push(
          <Button 
            key="edit"
            type="primary" 
            onClick={() => onEdit?.(invoiceData)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
        );
        break;
        
      default:
        break;
    }

    // 始终显示关闭按钮
    buttons.push(
      <Button key="close" onClick={onCancel} style={{ borderRadius: '2px' }}>
        关闭
      </Button>
    );

    return buttons;
  };

  return (
    <Modal
      title="发票详情"
      open={visible}
      onCancel={onCancel}
      footer={renderFooter()}
      width={800}
      style={{ borderRadius: '2px' }}
    >
      {renderErrorInfo()}
      
      <Descriptions column={2} bordered>
        <Descriptions.Item label="发票流水号" span={1}>
          {invoiceData.orderCode}
        </Descriptions.Item>
        <Descriptions.Item label="发票号码" span={1}>
          {invoiceData.invoiceNo || '暂无'}
        </Descriptions.Item>
        
        <Descriptions.Item label="开票状态" span={1}>
          <InvoiceStatusTag status={invoiceData.invoiceStatus} />
        </Descriptions.Item>
        <Descriptions.Item label="发票类型" span={1}>
          <Tag color="blue">
            {invoiceData.invoiceType === '01' ? '增值税普通发票' : '增值税电子普通发票'}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="购买方名称" span={2}>
          {invoiceData.buyerName}
        </Descriptions.Item>
        
        <Descriptions.Item label="纳税人识别号" span={1}>
          {invoiceData.buyerTaxNo || '无'}
        </Descriptions.Item>
        <Descriptions.Item label="手机号" span={1}>
          {invoiceData.buyerMobile || '无'}
        </Descriptions.Item>
        
        <Descriptions.Item label="联系电话" span={1}>
          {invoiceData.buyerPhone || '无'}
        </Descriptions.Item>
        <Descriptions.Item label="邮箱地址" span={1}>
          {invoiceData.emailAddress || '无'}
        </Descriptions.Item>
        
        <Descriptions.Item label="购买方地址" span={2}>
          {invoiceData.buyerAddress || '无'}
        </Descriptions.Item>
        
        <Descriptions.Item label="销售方名称" span={2}>
          {invoiceData.sellerName}
        </Descriptions.Item>
        
        <Descriptions.Item label="销售方纳税人识别号" span={2}>
          {invoiceData.sellerTaxNo}
        </Descriptions.Item>
        
        <Descriptions.Item label="开票金额" span={1}>
          <InvoiceAmountDisplay 
            amount={invoiceData.totalAmount}
            tax={invoiceData.totalTax}
            totalWithTax={invoiceData.totalAmountWithTax}
            showDetail={true}
          />
        </Descriptions.Item>
        <Descriptions.Item label="油站名称" span={1}>
          {invoiceData.oilStationName}
        </Descriptions.Item>
        
        <Descriptions.Item label="申请时间" span={1}>
          {invoiceData.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="开票时间" span={1}>
          {invoiceData.invoiceTime || '暂无'}
        </Descriptions.Item>
        
        <Descriptions.Item label="操作员" span={2}>
          {invoiceData.operatorName}
        </Descriptions.Item>
        
        <Descriptions.Item label="备注信息" span={2}>
          {invoiceData.invoiceStatus === '03' && invoiceData.errorCode && invoiceData.errorMessage ? (
            <div>
              <div>原备注：{invoiceData.remarks || '无'}</div>
              <div style={{ color: '#ff4d4f', marginTop: 4 }}>
                错误代码：{invoiceData.errorCode}
              </div>
              <div style={{ color: '#ff4d4f' }}>
                错误信息：{invoiceData.errorMessage}
              </div>
            </div>
          ) : (
            invoiceData.remarks || '无'
          )}
        </Descriptions.Item>
      </Descriptions>
      
      {/* 订单明细 */}
      {invoiceData.orderDetails && invoiceData.orderDetails.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4>订单明细</h4>
          <Table
            columns={orderDetailColumns}
            dataSource={invoiceData.orderDetails.map((item, index) => ({
              ...item,
              key: index
            }))}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}
    </Modal>
  );
};

export default InvoiceDetailModal;