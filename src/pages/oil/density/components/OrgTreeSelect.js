import React, { useState, useEffect } from 'react';
import { TreeSelect, Spin } from 'antd';
import { fetchOrgData } from '../services/api';

/**
 * 组织机构树形选择组件，支持多选
 * @param {Object} props 组件属性
 * @param {Function} props.onChange 选择变更回调
 * @param {Array} props.value 当前选中值
 * @param {String} props.placeholder 占位文本
 * @param {Boolean} props.allowClear 是否允许清除
 * @param {Boolean} props.disabled 是否禁用
 */
const OrgTreeSelect = ({ onChange, value, placeholder, allowClear = true, disabled = false }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载组织机构数据
  useEffect(() => {
    setLoading(true);
    fetchOrgData()
      .then(data => {
        // 转换数据格式为TreeSelect需要的格式
        const transformedData = transformOrgData(data);
        setTreeData(transformedData);
      })
      .catch(error => {
        console.error('获取组织机构数据失败:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 将组织机构数据转换为树形结构
  const transformOrgData = (data) => {
    if (!data) return [];
    
    // 公司节点
    const companyNode = {
      title: data.company.name,
      value: data.company.id,
      key: data.company.key,
      children: []
    };
    
    // 添加分公司节点
    if (data.branches && data.branches.length > 0) {
      data.branches.forEach(branch => {
        const branchNode = {
          title: branch.name,
          value: branch.id,
          key: branch.key,
          children: []
        };
        
        // 添加油站节点
        if (branch.stations && branch.stations.length > 0) {
          branch.stations.forEach(station => {
            branchNode.children.push({
              title: station.name,
              value: station.id,
              key: station.key,
              isLeaf: true
            });
          });
        }
        
        companyNode.children.push(branchNode);
      });
    }
    
    return [companyNode];
  };

  return (
    <Spin spinning={loading} size="small">
      <TreeSelect
        treeData={treeData}
        value={value}
        onChange={onChange}
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={placeholder || '请选择组织机构'}
        allowClear={allowClear}
        disabled={disabled}
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        treeDefaultExpandAll
        showSearch
        treeNodeFilterProp="title"
      />
    </Spin>
  );
};

export default OrgTreeSelect; 