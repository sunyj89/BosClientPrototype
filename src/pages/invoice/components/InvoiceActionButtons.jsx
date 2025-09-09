import React from 'react';
import { Button, Space } from 'antd';
import { 
  EyeOutlined, 
  DownloadOutlined, 
  RedoOutlined, 
  EditOutlined,
  MailOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const InvoiceActionButtons = ({ 
  record, 
  onView, 
  onDownload, 
  onRetry, 
  onResend, 
  onEdit,
  onRedInvoice
}) => {
  const renderButtons = () => {
    const buttons = [];
    
    // 查看详情按钮 - 所有状态都可查看
    buttons.push(
      <Button 
        key="view"
        type="primary" 
        size="small" 
        icon={<EyeOutlined />}
        onClick={() => onView?.(record)}
      >
        查看
      </Button>
    );
    
    // 根据发票状态显示不同操作按钮
    switch (record.invoiceStatus) {
      case '02': // 开票成功
        buttons.push(
          <Button 
            key="download"
            type="primary" 
            size="small" 
            icon={<DownloadOutlined />}
            onClick={() => onDownload?.(record)}
          >
            下载
          </Button>
        );
        if (record.emailAddress) {
          buttons.push(
            <Button 
              key="resend"
              type="primary" 
              size="small" 
              icon={<MailOutlined />}
              onClick={() => onResend?.(record)}
            >
              重发邮件
            </Button>
          );
        }
        // 添加红冲按钮
        buttons.push(
          <Button 
            key="redInvoice"
            type="primary" 
            size="small" 
            danger
            icon={<ExclamationCircleOutlined />}
            onClick={() => onRedInvoice?.(record)}
          >
            红冲
          </Button>
        );
        break;
        
      case '03': // 开票失败
        buttons.push(
          <Button 
            key="retry"
            type="primary" 
            size="small" 
            icon={<RedoOutlined />}
            onClick={() => onRetry?.(record)}
          >
            重试
          </Button>
        );
        break;
        
      case '00': // 待开票
        buttons.push(
          <Button 
            key="edit"
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          >
            编辑
          </Button>
        );
        break;
        
      default:
        break;
    }
    
    return buttons;
  };

  return (
    <Space size="small">
      {renderButtons()}
    </Space>
  );
};

export default InvoiceActionButtons;