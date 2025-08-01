import organizationData from '../../../mock/organization/organizationData.json';
import { get,post,put,del } from '../../../utils/http';

// 模拟网络延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 生成10位数字组织ID
const generateOrgId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

// 生成12位数字员工ID
const generateEmployeeId = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000);
};

// 辅助函数：在树中递归查找节点
function findNodeInTree(nodes, id) {
  for (const node of nodes) {
    if (node.id === parseInt(id)) return node;
    if (node.children) {
      const found = findNodeInTree(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// 获取组织树数据
export const getOrgTree = async () => {

  const res = await get('/merchant/api/organization/tree');
  if (res.success) {
    return {
      success: true,
      data: res.data,
      message: '获取组织架构成功'
    };
  }

  // await delay(300); // 模拟网络延迟
  // return {
  //   success: true,
  //   data: organizationData.orgTreeData,
  //   message: '获取组织架构成功'
  // };
};

// 根据ID获取组织详情
export const getOrgDetailsById = async (id) => {
  await delay(200);
  const node = findNodeInTree(organizationData.orgTreeData, id);
  if (node) {
    return {
      success: true,
      data: node,
      message: '获取组织详情成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '未找到对应的组织单元'
    };
  }
};

// 根据组织ID获取用户列表
export const getUsersByOrgId = async (orgId) => {

  const res = await get(`/api/users/org/${orgId}`);
  if (res.success) {
    return {
      success: true,
      data: res.data,
      message: '获取用户列表成功'
    };
  }

  // await delay(250);
  // const users = organizationData.userData.filter(user => user.orgUnitId === parseInt(orgId));
  // return {
  //   success: true,
  //   data: users,
  //   message: '获取用户列表成功'
  // };
};

// 获取所有角色
export const getRoles = async () => {
  await delay(100);
  return {
    success: true,
    data: organizationData.roles,
    message: '获取角色列表成功'
  };
};

// 添加用户
export const addUser = async (userData) => {

  const res = await post(`/api/users`,userData);
  if (res.success) {
    return {
      success: true,
      data: res.data,
      message: '添加用户成功'
    };
  }

  // await delay(500);
  // const newUser = {
  //   id: generateEmployeeId(), // 生成12位数字员工ID
  //   ...userData,
  //   createTime: new Date().toISOString()
  // };
  // return {
  //   success: true,
  //   data: newUser,
  //   message: '添加用户成功'
  // };
};

// 更新用户
export const updateUser = async (userData) => {

    const res = await put(`/api/users`,userData);
  if (res.success) {
    return {
      success: true,
      data: res.data,
      message: '更新用户成功'
    };
  }

  // await delay(500);
  // return {
  //   success: true,
  //   data: { ...userData, updateTime: new Date().toISOString() },
  //   message: '更新用户成功'
  // };
};

// 删除用户
export const deleteUser = async (userId) => {
  const res = await del(`/api/users/${userId}`);
  if (res.success) {
    return {
      success: true,
      data: null,
      message: '删除用户成功'
    };
  }
  // await delay(400);
  // return {
  //   success: true,
  //   data: null,
  //   message: '删除用户成功'
  // };
};

// 获取组织类型列表
export const getOrgTypes = async () => {
  await delay(100);
  const orgTypes = [
    { value: 'DEPARTMENT', label: '部门' },
    { value: 'CITY_BRANCH', label: '分公司' },
    { value: 'SERVICE_AREA', label: '服务区' },
    { value: 'GAS_STATION', label: '加油站' }
  ];
  return { success: true, data: orgTypes };
};

// 获取法人主体列表
export const getLegalEntities = async () => {
  await delay(100);
  return {
    success: true,
    data: organizationData.legalEntities,
    message: '获取法人主体成功'
  };
};

// 添加组织单元
export const addOrgUnit = async (orgData) => {

  const res = await post(`/api/users/organization-user`,orgData);
  if (res.success) {
    return {
      success: true,
      data: res.data,
      message: '添加组织单元成功'
    };
  }

  // await delay(600);
  
  // // 生成10位数字组织ID
  // const newId = generateOrgId();
  
  // const newOrgUnit = {
  //   id: newId,
  //   ...orgData,
  //   children: []
  // };
  
  // // 在真实应用中，这里会调用后端API保存数据
  // // 这里只是模拟成功响应
  // return { 
  //   success: true, 
  //   data: newOrgUnit, 
  //   message: '添加组织单元成功' 
  // };
};

// 更新组织单元
export const updateOrgUnit = async (orgData) => {

  const res = await put(`/api/users/organization-user/${orgData.id}`,orgData);
  if (res.success) {
    return {
      success: true,
      data: res.data,
      message: '修改组织单元成功'
    };
  }


  await delay(600);
  
  // 在真实应用中，这里会调用后端API更新数据
  // 这里只是模拟成功响应
  return { 
    success: true, 
    data: orgData, 
    message: '修改组织单元成功' 
  };
};

// 删除组织单元
export const deleteOrgUnit = async (orgId) => {
  const res = await delete(`/api/users/organization-user/${orgId}`);
  if (res.success) {
    return {
      success: true,
      data: null,
      message: '删除组织单元成功'
    };
  }
  // await delay(500);
  
  // // 在真实应用中，这里会调用后端API删除数据
  // // 需要检查是否有子组织和员工
  // // 这里只是模拟成功响应
  // return { 
  //   success: true, 
  //   data: null, 
  //   message: '删除组织单元成功' 
  // };
};

// ========== 角色配置相关API ==========

// 获取权限定义
export const getPermissions = async () => {
  await delay(100);
  return {
    success: true,
    data: organizationData.permissions,
    message: '获取权限定义成功'
  };
};

// 获取角色配置列表
export const getRoleConfigurations = async () => {
  await delay(200);
  return {
    success: true,
    data: organizationData.roleConfigurations,
    message: '获取角色配置列表成功'
  };
};

// 根据ID获取角色配置详情
export const getRoleConfigurationById = async (id) => {
  await delay(150);
  const roleConfig = organizationData.roleConfigurations.find(config => config.id === parseInt(id));
  if (roleConfig) {
    return {
      success: true,
      data: roleConfig,
      message: '获取角色配置详情成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '未找到对应的角色配置'
    };
  }
};

// 添加角色配置
export const addRoleConfiguration = async (roleConfigData) => {
  await delay(500);
  const newRoleConfig = {
    id: generateOrgId(), // 使用10位数字ID
    ...roleConfigData,
    isSystemRole: false,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };
  
  // 在实际应用中，这里会调用后端API保存数据
  organizationData.roleConfigurations.push(newRoleConfig);
  
  return {
    success: true,
    data: newRoleConfig,
    message: '添加角色配置成功'
  };
};

// 更新角色配置
export const updateRoleConfiguration = async (id, roleConfigData) => {
  await delay(500);
  const index = organizationData.roleConfigurations.findIndex(config => config.id === parseInt(id));
  if (index !== -1) {
    const updatedRoleConfig = {
      ...organizationData.roleConfigurations[index],
      ...roleConfigData,
      updateTime: new Date().toISOString()
    };
    organizationData.roleConfigurations[index] = updatedRoleConfig;
    
    return {
      success: true,
      data: updatedRoleConfig,
      message: '更新角色配置成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '未找到对应的角色配置'
    };
  }
};

// 删除角色配置
export const deleteRoleConfiguration = async (id) => {
  await delay(400);
  const index = organizationData.roleConfigurations.findIndex(config => config.id === parseInt(id));
  if (index !== -1) {
    const roleConfig = organizationData.roleConfigurations[index];
    if (roleConfig.isSystemRole) {
      return {
        success: false,
        data: null,
        message: '系统角色不允许删除'
      };
    }
    organizationData.roleConfigurations.splice(index, 1);
    return {
      success: true,
      data: null,
      message: '删除角色配置成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '未找到对应的角色配置'
    };
  }
};

// 复制角色配置
export const copyRoleConfiguration = async (id, newRoleName, newDescription) => {
  await delay(400);
  const sourceRoleConfig = organizationData.roleConfigurations.find(config => config.id === parseInt(id));
  if (sourceRoleConfig) {
    const newRoleConfig = {
      ...sourceRoleConfig,
      id: generateOrgId(), // 使用10位数字ID
      roleName: newRoleName,
      description: newDescription,
      isSystemRole: false,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    organizationData.roleConfigurations.push(newRoleConfig);
    
    return {
      success: true,
      data: newRoleConfig,
      message: '复制角色配置成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '未找到源角色配置'
    };
  }
}; 