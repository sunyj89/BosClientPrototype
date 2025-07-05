import React from 'react';
import { Card, Descriptions, Tag, Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const OrgDetails = ({ selectedNode, onAddOrg }) => {
  if (!selectedNode) {
    return (
      <Card title="组织详情" style={{ marginBottom: '16px' }}>
        <Empty description="请选择组织节点查看详情" />
      </Card>
    );
  }

  // 根据法人主体ID获取颜色
  const getLegalEntityColor = (legalEntityId) => {
    const colors = ['blue', 'green', 'orange', 'red', 'purple'];
    return colors[legalEntityId % colors.length];
  };

  // 根据组织类型获取颜色
  const getOrgTypeColor = (orgType) => {
    switch (orgType) {
      case 'HEADQUARTER':
      case '总公司':
        return 'green';
      case 'CITY_BRANCH':
      case '分公司':
        return 'blue';
      case 'DEPARTMENT':
      case '部门':
        return 'purple';
      case 'SERVICE_AREA':
      case '服务区':
        return 'orange';
      case 'GAS_STATION':
      case '油站':
        return 'red';
      default:
        return 'default';
    }
  };

  // 组织类型显示名称映射
  const getOrgTypeDisplayName = (orgType) => {
    switch (orgType) {
      case 'HEADQUARTER':
        return '集团总部';
      case 'DEPARTMENT':
        return '部门';
      case 'CITY_BRANCH':
        return '分公司';
      case 'SERVICE_AREA':
        return '服务区';
      case 'GAS_STATION':
        return '加油站';
      default:
        return orgType;
    }
  };

  // 判断是否可以添加子组织
  const canAddChild = () => {
    if (!selectedNode) return false;
    const { orgType } = selectedNode;
    return orgType === 'HEADQUARTER' || orgType === 'CITY_BRANCH' || orgType === 'SERVICE_AREA';
  };

  // 卡片标题
  const cardTitle = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>组织详情</span>
      {canAddChild() && (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onAddOrg && onAddOrg()}
          style={{ borderRadius: '2px' }}
        >
          新增子组织
        </Button>
      )}
    </div>
  );

  return (
    <Card 
      title={cardTitle()} 
      size="small"
      style={{ marginBottom: '16px' }}
      bodyStyle={{ padding: '8px 16px' }}
    >
      <Descriptions 
        column={4} 
        size="small"
        colon={false}
        labelStyle={{ 
          width: '60px', 
          padding: '2px 8px 2px 0',
          fontSize: '12px',
          color: '#666'
        }}
        contentStyle={{ 
          padding: '2px 0',
          fontSize: '13px'
        }}
      >
        <Descriptions.Item label="名称" span={2}>
          <strong>{selectedNode.name}</strong>
        </Descriptions.Item>
        
        <Descriptions.Item label="类型">
          <Tag color={getOrgTypeColor(selectedNode.orgType)} size="small">
            {getOrgTypeDisplayName(selectedNode.orgType)}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="ID">
          {selectedNode.id}
        </Descriptions.Item>
        
        {selectedNode.parentName && (
          <Descriptions.Item label="上级" span={2}>
            {selectedNode.parentName}
          </Descriptions.Item>
        )}
        
        <Descriptions.Item label="法人" span={selectedNode.parentName ? 2 : 4}>
          <Tag color={getLegalEntityColor(selectedNode.legalEntity?.id)} size="small">
            {selectedNode.legalEntity?.name}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrgDetails; 