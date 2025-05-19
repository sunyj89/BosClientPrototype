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
  message
} from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const QuotationDetail = ({ visible, record, onCancel, onAccept, onReject }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  
  // 获取状态对应的颜色
  const getStatusColor = (status) => {
    const colorMap = {
      '待确认': 'blue',
      '已接受': 'green',
      '已拒绝': 'red'
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
  
  // 渲染底部按钮
  const renderFooterButtons = () => {
    // 只有待确认状态才显示接受/拒绝按钮
    if (record && record.status === '待确认') {
      return [
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
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
      ];
    }
    
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