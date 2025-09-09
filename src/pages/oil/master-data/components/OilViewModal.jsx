import React from 'react';
import { Modal, Button, Descriptions, Tag } from 'antd';

const OilViewModal = ({ visible, data, onClose, categoryData  }) => {
  if (!data) return null;

  // 获取油品分类名称
  const getCategoryName = (id) => {
    console.log(categoryData);
    if (!categoryData) return '-';
    const category = categoryData.find(c => c.id === id);
    return category ? category.name : '-';
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '生效中':
        return 'green';
      case '审批中':
        return 'orange';
      case '未生效':
        return 'red';
      default:
        return 'default';
    }
  };

  // 获取油品类型颜色
  const getOilTypeColor = (type) => {
    const colorMap = {
      '汽油': 'red',
      '柴油': 'blue',
      '天然气': 'green',
      '尿素': 'purple',
      '其他': 'default'
    };
    return colorMap[type] || 'default';
  };

  return (
    <Modal
      title="油品详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
      width={900}
    >
      {/* 主要信息区域 */}
      <Descriptions column={2} bordered>
        <Descriptions.Item label="油品编号">{data.oilCode}</Descriptions.Item>
        <Descriptions.Item label="线上油品编号">{data.onlineCode}</Descriptions.Item>
        <Descriptions.Item label="油品名称">{data.oilName}</Descriptions.Item>
        <Descriptions.Item label="油品简称">{data.oilShortName}</Descriptions.Item>
        <Descriptions.Item label="油品分类">
          {getCategoryName(data.categoryId)}
        </Descriptions.Item>
        <Descriptions.Item label="油品类型">
          <Tag color={getOilTypeColor(data.oilType)}>{data.oilType}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="排放等级">
          {data.oilStandardName ? (
            <Tag color="orange">{data.oilStandardName}</Tag>
          ) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="默认密度">{data.density}</Descriptions.Item>
        <Descriptions.Item label="油品状态">
          <Tag color={getStatusColor(data.status)}>{data.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="审批人">{data.approver || '-'}</Descriptions.Item>
      </Descriptions>

      {/* 分段信息：创建和修改信息 */}
      {/* <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 24,
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        操作记录信息
      </div> */}
      
      {/* <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
        <Descriptions.Item label="操作类型">
          {data.operationType ? (
            <Tag color="blue">{data.operationType}</Tag>
          ) : '-'}
        </Descriptions.Item>
      </Descriptions> */}
    </Modal>
  );
};

export default OilViewModal; 