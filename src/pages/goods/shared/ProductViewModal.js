import React from 'react';
import { Modal, Button, Descriptions, Tag } from 'antd';

const ProductViewModal = ({ visible, data, onClose }) => {
  if (!data) return null;

  // 获取状态颜色和文本
  const getStatusConfig = (status) => {
    const statusConfig = {
      DRAFT: { color: 'default', text: '草稿' },
      PENDING: { color: 'warning', text: '待审核' },
      ACTIVE: { color: 'success', text: '生效' },
      INACTIVE: { color: 'error', text: '停用' }
    };
    return statusConfig[status] || statusConfig.DRAFT;
  };

  // 获取物流类型显示文本
  const getLogisticsTypeText = (type) => {
    const typeMap = {
      'weight': '按重量',
      'volume': '按体积',
      'piece': '按件数'
    };
    return typeMap[type] || type;
  };

  // 获取单位选项的显示文本
  const getUnitText = (unitId) => {
    const unitOptions = {
      'bottle': '瓶',
      'case': '箱',
      'kg': '千克',
      'g': '克',
      'l': '升',
      'ml': '毫升',
      'cbm': '立方米',
      'piece': '个',
      'pack': '包',
      'box': '盒'
    };
    return unitOptions[unitId] || unitId;
  };

  const statusConfig = getStatusConfig(data.status);

  return (
    <Modal
      title="商品详情"
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
        <Descriptions.Item label="SKU编码">{data.sku_code}</Descriptions.Item>
        <Descriptions.Item label="关联SPU ID">{data.product_id || '-'}</Descriptions.Item>
        <Descriptions.Item label="SKU名称">{data.sku_name}</Descriptions.Item>
        <Descriptions.Item label="商品条码">{data.barcode}</Descriptions.Item>
        <Descriptions.Item label="商品分类">{data.category}</Descriptions.Item>
        <Descriptions.Item label="商品规格">{data.specifications}</Descriptions.Item>
        <Descriptions.Item label="基本单位">{getUnitText(data.base_unit_id)}</Descriptions.Item>
        <Descriptions.Item label="辅助单位">
          {data.aux_unit_id ? 
            `${getUnitText(data.aux_unit_id)} (1:${data.conversion_rate})` : 
            '-'
          }
        </Descriptions.Item>
        <Descriptions.Item label="商品状态">
          <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="物流类型">
          <Tag color="blue">{getLogisticsTypeText(data.logistics_type)}</Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* 分段信息：重量体积信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 24,
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        重量体积信息
      </div>
      
      <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="重量">
          {data.weight} {getUnitText(data.weight_unit_id)}
        </Descriptions.Item>
        <Descriptions.Item label="体积">
          {data.volume} {getUnitText(data.volume_unit_id)}
        </Descriptions.Item>
        <Descriptions.Item label="保质期">
          {data.shelf_life ? `${data.shelf_life}天` : '-'}
        </Descriptions.Item>
      </Descriptions>

      {/* 分段信息：价格税率信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 24,
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        价格税率信息
      </div>
      
      <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="默认售价">
          ¥{(data.default_sale_price || 0).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="进项税率">
          {data.current_input_tax_rate}%
        </Descriptions.Item>
        <Descriptions.Item label="销项税率">
          {data.current_output_tax_rate}%
        </Descriptions.Item>
      </Descriptions>

      {/* 分段信息：库存设置 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 24,
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        库存设置
      </div>
      
      <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="最低库存">
          {data.min_stock || 0} {getUnitText(data.base_unit_id)}
        </Descriptions.Item>
        <Descriptions.Item label="预警天数">
          {data.warning_days ? `${data.warning_days}天` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="是否已删除">
          <Tag color={data.is_deleted ? 'red' : 'green'}>
            {data.is_deleted ? '是' : '否'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* 分段信息：操作记录信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 24,
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        操作记录信息
      </div>
      
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="创建人">{data.created_by}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{data.created_at}</Descriptions.Item>
        <Descriptions.Item label="最后修改人">{data.updated_by}</Descriptions.Item>
        <Descriptions.Item label="最后修改时间">{data.updated_at}</Descriptions.Item>
        <Descriptions.Item label="审批人">{data.approved_by || '未审批'}</Descriptions.Item>
        <Descriptions.Item label="审批时间">{data.approved_at || '未审批'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ProductViewModal; 