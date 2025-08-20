import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Empty, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as api from '../services/api';

const OrgDetails = ({ selectedNode, onAddOrg, onEditOrg, onDeleteOrg }) => {
  if (!selectedNode) {
    return (
      <Card title="组织详情" style={{ marginBottom: '16px' }}>
        <Empty description="请选择组织节点查看详情" />
      </Card>
    );
  }

  const [legalEntities, setLegalEntities] = useState([]);

  useEffect(() => {
    loadLegalEntities();
  }, []);

    // 加载法人主体
  const loadLegalEntities = async () => {
    try {
      const result = await api.getLegalEntities();
      if (result.success) {
        setLegalEntities(result.data);
      }
    } catch (error) {
      console.error('获取法人主体失败:', error);
    }
  };

  // 根据法人主体ID获取颜色
  const getLegalEntityColor = (legalEntityId) => {
    const colors = ['blue', 'green', 'orange', 'red', 'purple'];
    return colors[legalEntityId % colors.length];
  };

  // 根据法人主体ID获取名称
  const getLegalEntityName = (legalEntityId) => {
    console.log(selectedNode);
    console.log(legalEntities);
    const entity = legalEntities.find(item => item.id === legalEntityId);
    return entity ? entity.itemName : '未知法人';
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
    console.log(orgType);
    return orgType === 'HEADQUARTER' || orgType === 'CITY_BRANCH' || orgType === 'SERVICE_AREA' || orgType === 'MERCHANT';
  };

  // 判断是否可以删除组织（根节点不能删除）
  const canDelete = () => {
    return selectedNode && selectedNode.parentId;
  };

  // 卡片标题
  const cardTitle = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>组织详情</span>
      <Space size="small">
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
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEditOrg && onEditOrg()}
          style={{ borderRadius: '2px' }}
        >
          修改
        </Button>
        {canDelete() && (
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteOrg && onDeleteOrg()}
            style={{ borderRadius: '2px' }}
          >
            删除
          </Button>
        )}
      </Space>
    </div>
  );

  return (
    <Card 
      title={cardTitle()} 
      size="small"
      style={{ marginBottom: '16px' }}
      styles={{ padding: '8px 16px' }}
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
          <strong>{selectedNode.orgName}</strong>
        </Descriptions.Item>
        
        <Descriptions.Item label="类型">
          <Tag color={getOrgTypeColor(selectedNode.orgType)} size="small">
            {getOrgTypeDisplayName(selectedNode.orgType)}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="ID">
          {selectedNode.id}
        </Descriptions.Item>
        
        {selectedNode.parentId && (
          <Descriptions.Item label="上级ID">
            {selectedNode.parentId}
          </Descriptions.Item>
        )}
        
        {selectedNode.parentName && (
          <Descriptions.Item label="上级名称" span={selectedNode.parentId ? 2 : 3}>
            {selectedNode.parentName}
          </Descriptions.Item>
        )}
        
        <Descriptions.Item label="法人" span={selectedNode.parentName ? 2 : 4}>
          <Tag color={getLegalEntityColor(selectedNode.legalEntityId)} size="small">
            {getLegalEntityName(selectedNode.legalEntityId)}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrgDetails;