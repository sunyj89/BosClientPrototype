import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Row, 
  Col, 
  Tag, 
  Button, 
  Typography, 
  Divider, 
  Table,
  Space,
  List,
  Descriptions,
  message,
  Popconfirm
} from 'antd';
import { 
  DownloadOutlined, 
  FileTextOutlined, 
  TrophyOutlined,
  ShoppingOutlined,
  MailOutlined,
  PrinterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const QuotationDetail = ({ visible, record, onCancel, onAccept, onReject, onConfirmWinner }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  
  // 获取状态对应的颜色
  const getStatusColor = (status) => {
    const colorMap = {
      '待确认': 'blue',
      '已接受': 'green',
      '已拒绝': 'red',
      '中标报价单': 'gold'
    };
    return colorMap[status] || 'default';
  };
  
  // 处理下载附件
  const handleDownload = (file) => {
    message.info(`下载附件: ${file.name}`);
    // 实际实现应该是发送请求下载文件
  };
  
  // 处理接受报价
  const handleAccept = () => {
    if (onAccept) {
      onAccept(record);
    }
  };
  
  // 处理拒绝报价
  const handleReject = () => {
    if (rejectReason.trim() === '') {
      message.error('请输入拒绝原因');
      return;
    }
    
    if (onReject) {
      onReject(record, rejectReason);
      setRejectModalVisible(false);
      setRejectReason('');
    }
  };

  // 处理确认中标
  const handleConfirmWinner = () => {
    if (onConfirmWinner) {
      onConfirmWinner(record);
    }
  };
  
  // 处理创建采购订单
  const handleCreateOrder = () => {
    message.success('正在创建采购订单');
    // 跳转到油品采购订单页面
    window.location.href = `/purchase/oil-order?id=${record.id}`;
  };
  
  // 处理通知供应商
  const handleNotifySupplier = () => {
    message.success('正在发送通知给供应商');
    // 实际实现应该是打开通知供应商弹窗
  };
  
  // 处理打印报价确认单
  const handlePrintConfirmation = () => {
    message.success('正在准备打印报价确认单');
    // 实际实现应该是调用打印API
  };
  
  // 渲染底部按钮
  const renderFooterButtons = () => {
    if (!record) return null;
    
    // 中标报价单状态下的按钮
    if (record.status === '中标报价单') {
      return [
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
        <Button 
          key="print" 
          type="primary" 
          icon={<PrinterOutlined />}
          onClick={handlePrintConfirmation}
        >
          打印报价确认单
        </Button>,
        <Button 
          key="notify" 
          type="primary" 
          icon={<MailOutlined />}
          onClick={handleNotifySupplier}
        >
          通知中标供应商
        </Button>,
        <Button 
          key="create-order" 
          type="primary" 
          icon={<ShoppingOutlined />}
          onClick={handleCreateOrder}
        >
          创建采购订单
        </Button>
      ];
    }
    
    // 待确认或已接受状态下的按钮
    if (record.status === '待确认' || record.status === '已接受') {
      const buttons = [
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ];
      
      // 如果是待确认状态，显示接受/拒绝按钮
      if (record.status === '待确认') {
        buttons.push(
          <Button 
            key="reject" 
            danger
            onClick={() => setRejectModalVisible(true)}
          >
            拒绝报价
          </Button>,
          <Button 
            key="accept" 
            type="primary" 
            onClick={handleAccept}
          >
            接受报价
          </Button>
        );
      }
      
      // 添加确认中标按钮
      buttons.push(
        <Popconfirm
          key="confirm-winner"
          title="您确认这个报价单为中标报价么？"
          onConfirm={handleConfirmWinner}
          okText="是"
          cancelText="否"
        >
          <Button 
            type="primary" 
            icon={<TrophyOutlined />}
            style={{ background: '#faad14', borderColor: '#faad14' }}
          >
            确认为中标报价
          </Button>
        </Popconfirm>
      );
      
      return buttons;
    }
    
    // 默认情况
    return [
      <Button key="close" onClick={onCancel}>
        关闭
      </Button>
    ];
  };
  
  // 如果没有记录，不显示内容
  if (!record) {
    return null;
  }
  
  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={5}>报价单详情</Title>
            <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        footer={renderFooterButtons()}
        width={700}
      >
        <Descriptions bordered column={2} size="small" style={{ marginBottom: '20px' }}>
          <Descriptions.Item label="报价单ID" span={1}>{record.id}</Descriptions.Item>
          <Descriptions.Item label="询价单ID" span={1}>{record.inquiryId}</Descriptions.Item>
          <Descriptions.Item label="询价单名称" span={2}>{record.inquiryName}</Descriptions.Item>
          <Descriptions.Item label="供应商名称" span={2}>{record.supplierName}</Descriptions.Item>
          <Descriptions.Item label="联系人" span={1}>{record.contactPerson || '暂无'}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={1}>{record.contactPhone || '暂无'}</Descriptions.Item>
          <Descriptions.Item label="电子邮箱" span={2}>{record.contactEmail || '暂无'}</Descriptions.Item>
          <Descriptions.Item label="油品类型" span={1}>{record.oilType}</Descriptions.Item>
          <Descriptions.Item label="单价(元/吨)" span={1}>{record.unitPrice}</Descriptions.Item>
          <Descriptions.Item label="数量(吨)" span={1}>{record.quantity}</Descriptions.Item>
          <Descriptions.Item label="是否包含运费" span={1}>{record.includeFreight ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="到货时间" span={1}>{record.deliveryTime}</Descriptions.Item>
          <Descriptions.Item label="提交时间" span={1}>{record.submitTime}</Descriptions.Item>
          <Descriptions.Item label="交货地点" span={2}>{record.deliveryAddress}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{record.remarks}</Descriptions.Item>
          
          {record.rejectReason && (
            <Descriptions.Item label="拒绝原因" span={2}>
              <Text type="danger">{record.rejectReason}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>
        
        <Divider orientation="left">附件</Divider>
        
        {record.attachments && record.attachments.length > 0 ? (
          <List
            size="small"
            bordered
            dataSource={record.attachments}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    icon={<DownloadOutlined />} 
                    onClick={() => handleDownload(item)}
                  >
                    下载
                  </Button>
                ]}
              >
                <Space>
                  <FileTextOutlined />
                  <Text>{item.name}</Text>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">无附件</Text>
        )}
      </Modal>
      
      {/* 拒绝原因弹窗 */}
      <Modal
        title="拒绝报价"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="确认拒绝"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item 
            label="拒绝原因" 
            rules={[{ required: true, message: '请输入拒绝原因' }]}
          >
            <TextArea 
              rows={4} 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入拒绝原因"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QuotationDetail; 