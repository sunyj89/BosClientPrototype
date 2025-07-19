import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Tree, 
  Input, 
  Space, 
  Tag, 
  Alert, 
  Button, 
  Checkbox,
  Row,
  Col,
  Empty,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  ShopOutlined,
  ClearOutlined,
  SelectOutlined
} from '@ant-design/icons';

const { Search } = Input;

const StationSelector = ({ 
  orgTreeData = [], 
  selectedStations = [], 
  onChange,
  style 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 初始化选中状态
  useEffect(() => {
    // 确保selectedStations是正确格式的数组（station_前缀）
    const formattedKeys = Array.isArray(selectedStations) 
      ? selectedStations.filter(key => typeof key === 'string' && key.startsWith('station_'))
      : [];
    setCheckedKeys(formattedKeys);
  }, [selectedStations]);

  // 从组织树中提取所有服务区和油站
  const extractStationsFromTree = (treeData) => {
    const stations = [];
    const serviceAreas = [];
    
    const traverse = (nodes) => {
      nodes.forEach(node => {
        if (node.orgType === 'SERVICE_AREA') {
          serviceAreas.push({
            id: node.id,
            name: node.name,
            parentName: node.parentName,
            type: 'SERVICE_AREA',
            key: `service_${node.id}`,
            title: node.name,
            icon: <EnvironmentOutlined style={{ color: '#faad14' }} />,
            children: []
          });
        } else if (node.orgType === 'GAS_STATION') {
          stations.push({
            id: node.id,
            name: node.name,
            parentName: node.parentName,
            type: 'GAS_STATION',
            key: `station_${node.id}`,
            title: node.name,
            icon: <ShopOutlined style={{ color: '#ff4d4f' }} />,
            isLeaf: true
          });
        }
        
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    
    traverse(treeData);
    
    // 将油站归类到对应的服务区下
    serviceAreas.forEach(serviceArea => {
      const serviceAreaStations = stations.filter(station => 
        station.parentName === serviceArea.name
      );
      serviceArea.children = serviceAreaStations;
    });
    
    return { stations, serviceAreas };
  };

  // 构建树形数据
  const { stations: allStations, serviceAreas } = useMemo(() => 
    extractStationsFromTree(orgTreeData), [orgTreeData]
  );

  // 根据搜索关键词过滤数据
  const filteredTreeData = useMemo(() => {
    if (!searchValue) {
      return serviceAreas;
    }
    
    const filtered = [];
    serviceAreas.forEach(serviceArea => {
      const matchedStations = serviceArea.children.filter(station =>
        station.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        station.parentName.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      const serviceAreaMatched = serviceArea.name.toLowerCase().includes(searchValue.toLowerCase());
      
      if (serviceAreaMatched || matchedStations.length > 0) {
        filtered.push({
          ...serviceArea,
          children: serviceAreaMatched ? serviceArea.children : matchedStations
        });
      }
    });
    
    return filtered;
  }, [serviceAreas, searchValue]);

  // 获取搜索匹配的节点keys用于展开
  const getMatchedKeys = () => {
    const keys = [];
    if (searchValue) {
      filteredTreeData.forEach(serviceArea => {
        keys.push(serviceArea.key);
        if (serviceArea.children.length > 0) {
          serviceArea.children.forEach(station => {
            if (station.name.toLowerCase().includes(searchValue.toLowerCase())) {
              keys.push(station.key);
            }
          });
        }
      });
    }
    return keys;
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      const matchedKeys = getMatchedKeys();
      setExpandedKeys(matchedKeys);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setAutoExpandParent(false);
    }
  };

  // 处理树节点展开
  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  // 处理选择变化
  const handleCheck = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys);
    
    // 提取实际的ID（去掉前缀）
    const stationIds = checkedKeys
      .filter(key => key.startsWith('station_'))
      .map(key => parseInt(key.replace('station_', '')));
    
    const serviceAreaIds = checkedKeys
      .filter(key => key.startsWith('service_'))
      .map(key => parseInt(key.replace('service_', '')));
    
    // 合并选中的服务区下的所有油站
    const allSelectedStationIds = [...stationIds];
    serviceAreaIds.forEach(serviceAreaId => {
      const serviceArea = serviceAreas.find(sa => sa.id === serviceAreaId);
      if (serviceArea) {
        serviceArea.children.forEach(station => {
          if (!allSelectedStationIds.includes(station.id)) {
            allSelectedStationIds.push(station.id);
          }
        });
      }
    });
    
    onChange && onChange(allSelectedStationIds);
  };

  // 全选所有油站
  const handleSelectAll = () => {
    const allKeys = [];
    serviceAreas.forEach(serviceArea => {
      allKeys.push(serviceArea.key);
      serviceArea.children.forEach(station => {
        allKeys.push(station.key);
      });
    });
    setCheckedKeys(allKeys);
    
    const allStationIds = allStations.map(station => station.id);
    onChange && onChange(allStationIds);
  };

  // 清空选择
  const handleClearAll = () => {
    setCheckedKeys([]);
    onChange && onChange([]);
  };

  // 获取选中的油站信息用于显示
  const getSelectedStationsInfo = () => {
    const selectedStationIds = checkedKeys
      .filter(key => key.startsWith('station_'))
      .map(key => parseInt(key.replace('station_', '')));
    
    return allStations.filter(station => selectedStationIds.includes(station.id));
  };

  return (
    <div style={style}>
      <Card size="small">
        <Alert
          message="油站关联说明"
          description="配置角色可以管理的油站范围。选择服务区将包含其下所有油站，也可以单独选择特定油站。支持跨组织选择。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        {/* 搜索框 */}
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索服务区或油站名称"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            allowClear
            style={{ width: '100%' }}
          />
        </div>

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              size="small" 
              icon={<SelectOutlined />}
              onClick={handleSelectAll}
            >
              全选所有油站
            </Button>
            <Button 
              size="small" 
              icon={<ClearOutlined />}
              onClick={handleClearAll}
            >
              清空选择
            </Button>
            <Tag color="blue">
              已选择 {getSelectedStationsInfo().length} 个油站
            </Tag>
          </Space>
        </div>

        {/* 树形选择器 */}
        {filteredTreeData.length > 0 ? (
          <Tree
            checkable
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={handleCheck}
            onExpand={handleExpand}
            treeData={filteredTreeData}
            style={{ 
              maxHeight: 300, 
              overflow: 'auto',
              border: '1px solid #f0f0f0',
              borderRadius: 6,
              padding: 12,
              background: '#fafafa'
            }}
          />
        ) : (
          <Empty 
            description={searchValue ? "未找到匹配的服务区或油站" : "暂无数据"}
            style={{ margin: '40px 0' }}
          />
        )}

        {/* 选中结果显示 */}
        {getSelectedStationsInfo().length > 0 && (
          <>
            <Divider orientation="left" style={{ margin: '16px 0 8px 0' }}>
              已选择的油站
            </Divider>
            <div style={{ maxHeight: 120, overflow: 'auto' }}>
              <Space wrap>
                {getSelectedStationsInfo().map(station => (
                  <Tag 
                    key={station.id}
                    color="blue"
                    style={{ marginBottom: 4 }}
                  >
                    <ShopOutlined /> {station.name}
                    <span style={{ color: '#999', fontSize: '12px', marginLeft: 4 }}>
                      ({station.parentName})
                    </span>
                  </Tag>
                ))}
              </Space>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default StationSelector; 