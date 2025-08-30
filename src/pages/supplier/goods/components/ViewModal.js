import React from 'react';
import { Descriptions, Tag, Row, Col } from 'antd';

const GoodsSupplierViewModal = ({ data }) => {
  if (!data) return null;

  // 状态配置
  const statusConfig = {
    '待审批': { color: 'orange', text: '待审批' },
    '正常': { color: 'green', text: '正常' },
    '暂停': { color: 'red', text: '暂停' },
    '已驳回': { color: 'default', text: '已驳回' }
  };

  // 等级配置
  const levelConfig = {
    A: { color: 'red', text: 'A级' },
    B: { color: 'orange', text: 'B级' },
    C: { color: 'blue', text: 'C级' }
  };

  return (
    <div>
      {/* 基本信息 */}
      <Descriptions
        title="基本信息"
        column={2}
        bordered
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="供应商ID">{data.id}</Descriptions.Item>
        <Descriptions.Item label="供应商编码">{data.code}</Descriptions.Item>
        <Descriptions.Item label="供应商名称">{data.name}</Descriptions.Item>
        <Descriptions.Item label="联系人">{data.contactPerson}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{data.contactPhone}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{data.email}</Descriptions.Item>
        <Descriptions.Item label="企业地址" span={2}>{data.address}</Descriptions.Item>
      </Descriptions>

      {/* 经营信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8 
      }}>
        经营信息
      </div>
      <Descriptions
        column={3}
        bordered
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="供应商等级">
          <Tag color={levelConfig[data.level]?.color}>
            {levelConfig[data.level]?.text}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="结算周期">{data.settlementCycle}</Descriptions.Item>
        <Descriptions.Item label="账期">{data.creditDays}天</Descriptions.Item>
        <Descriptions.Item label="资质证书号">{data.qualificationNumber}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusConfig[data.status]?.color}>
            {statusConfig[data.status]?.text}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
      </Descriptions>

      {/* 商品类型 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8 
      }}>
        供应品类
      </div>
      <div style={{ marginBottom: 16 }}>
        {data.goodsTypes && data.goodsTypes.map((type, index) => (
          <Tag key={index} color="blue" style={{ marginBottom: 8 }}>
            {type}
          </Tag>
        ))}
      </div>

      {/* 备注信息 */}
      {data.remarks && (
        <>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 16,
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 8 
          }}>
            备注信息
          </div>
          <div style={{ 
            padding: 12, 
            backgroundColor: '#f9f9f9', 
            borderRadius: 4,
            color: '#666'
          }}>
            {data.remarks}
          </div>
        </>
      )}
    </div>
  );
};

export default GoodsSupplierViewModal;