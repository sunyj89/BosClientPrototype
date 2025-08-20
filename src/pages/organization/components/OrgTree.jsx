import React from 'react';
import { Tree, Card } from 'antd';
import {
  ApartmentOutlined,
  BankOutlined,
  EnvironmentOutlined,
  ShopOutlined,
} from '@ant-design/icons';

const OrgTree = ({ treeData, onSelect, loading }) => {
  // 根据组织类型获取图标
  const getIcon = (orgType) => {
    switch (orgType) {
      case 'HEADQUARTER':
      case '总公司':
        return <ApartmentOutlined style={{ color: '#32AF50' }} />;
      case 'DEPARTMENT':
      case '部门':
        return <BankOutlined style={{ color: '#722ed1' }} />;
      case 'CITY_BRANCH':
      case '分公司':
        return <BankOutlined style={{ color: '#1677ff' }} />;
      case 'SERVICE_AREA':
      case '服务区':
        return <EnvironmentOutlined style={{ color: '#faad14' }} />;
      case 'GAS_STATION':
      case '油站':
        return <ShopOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ApartmentOutlined />;
    }
  };

  // 处理树节点选择
  const handleSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0 && onSelect) {
      onSelect(selectedKeys, info);
    }
  };

  // 转换树数据，添加图标
  const transformTreeData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(node => ({
      ...node,
      key: node.id,
      title: node.orgName,
      icon: getIcon(node.orgType),
      children: node.children ? transformTreeData(node.children) : []
    }));
  };

  const transformedTreeData = transformTreeData(treeData);

  return (
    <Card 
      title="组织架构" 
      style={{ height: '100%' }}
      styles={{ body: { padding: '12px', height: 'calc(100% - 57px)', overflow: 'auto' } }}
    >
      <Tree
        showIcon
        defaultExpandAll
        treeData={transformedTreeData}
        onSelect={handleSelect}
        style={{
          background: 'transparent'
        }}
      />
    </Card>
  );
};

export default OrgTree; 