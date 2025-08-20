import organizationData from '../../../mock/organization/organizationData.json';
import { get,post,put,del } from '../../../utils/http';

// 模拟网络延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 生成10位数字组织ID
const generateOrgId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

// 生成4位角色ID
const generateRoleId = () => {
  return Math.floor(1000 + Math.random() * 9000);
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
  console.log('getOrgTree');
  let data = {
    rootId: '2002'
  }
  const res = await get('/merchant/api/organization/tree-data',data);
  console.log(res);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取组织架构成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }

  await delay(300); // 模拟网络延迟
  return {
    success: true,
    data: organizationData.orgTreeData,
    message: '获取组织架构成功'
  };
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

  const res = await get(`/merchant/api/users/org/${orgId}`);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取用户列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
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

  const res = await get(`/merchant/api/roles/business`);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取角色列表成功'
    };
  }else {
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }


  await delay(100);
  return {
    success: true,
    data: organizationData.roles,
    message: '获取角色列表成功'
  };
};

// 添加用户
export const addUser = async (userData) => {

  console.log(userData);
  let data = {
    orgUnitId: userData.orgUnitId,
    roleId: userData.role.id,
    username: userData.username,
    realName: userData.realName,
    position: userData.role.roleName,
  }
  const res = await post(`/merchant/api/users`,data);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '添加用户成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
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
    console.log('------------');
    console.log(userData);
    const res = await put(`/merchant/api/users`,userData);
    if (res.code === 0) {
      return {
        success: true,
        data: res.data,
        message: '更新用户成功'
      };
    }else{
      return {
        success: false,
        data: null,
        message: res.msg
      };
    }
  // if (res.success) {
  //   return {
  //     success: true,
  //     data: res.data,
  //     message: '更新用户成功'
  //   };
  // }

  // await delay(500);
  // return {
  //   success: true,
  //   data: { ...userData, updateTime: new Date().toISOString() },
  //   message: '更新用户成功'
  // };
};

// 删除用户
export const deleteUser = async (userId) => {
  const res = await del(`/merchant/api/users/${userId}`);
  if (res.code === 0) {
    return {
      success: true,
      data: null,
      message: '删除用户成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
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
  const res = await get('/merchant/api/dictionary/model/org_type');
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取组织类型成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
};

// 'MERCHANT': '商户',
//               'COMPANY': '公司',
//               'REGION': '区域',
//               'DEPARTMENT': '部门',
//               'GAS_STATION': '加油站'
//               { value: 'MERCHANT', label: '部门' },
//     { value: 'Com', label: '分公司' },
//     { value: 'SERVICE_AREA', label: '服务区' },
//     { value: 'GAS_STATION', label: '加油站' }

// 获取法人主体列表
export const getLegalEntities = async () => {

  const res = await get('/merchant/api/dictionary/model/legal_entity_type');
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取法人主体成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
  await delay(100);
  return {
    success: true,
    data: organizationData.legalEntities,
    message: '获取法人主体成功'
  };
};

// 添加组织单元
export const addOrgUnit = async (orgData) => {

  console.log(orgData);
  let data = {
    orgName: orgData.name,
    orgType: orgData.orgType,
    parentId: orgData.parentId,
    legalEntityId: orgData.legalEntity.id,
  }
  console.log(data);
  const res = await post(`/merchant/api/organization`, data);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '添加组织单元成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
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
  console.log('orgData', orgData);
  let data = {
    id: orgData.id,
    orgName: orgData.name,
    orgType: orgData.orgType,
    legalEntityId: orgData.legalEntityId,
  }
  const res = await put(`/merchant/api/organization/${orgData.id}`,data);
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
  const res = await del(`/merchant/api/organization/${orgId}`);
  if (res.code === 0) {
    return {
      success: true,
      data: null,
      message: '删除组织单元成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
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

  const res = await get(`/merchant/api/roles/system`);
  if (res.code === 0) {
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      element.description = element.roleDescription
      element.isSystemRole = true
      element.permissions = {
        "pageOperations": [],
        "dataScope": element.dataScope,
        "posDevices": [],
        "associatedStations": []
      }
      try {
        element.orgTypes = JSON.parse(element.applicableOrgTypes)
      } catch (error) {
        element.orgTypes = []
      }
      element.isSystemRole = true
    }
    return {
      success: true,
      data: res.data,
      message: '获取角色配置列表成功'
    };
  }
  //   {
  //   "id": 1,
  //   "roleId": 1,
  //   "roleName": "集团CEO",
  //   "description": "集团CEO，拥有全部权限",
  //   "isSystemRole": true,
  //   "permissions": {
  //     "pageOperations": ["dashboard:view", "organization:view", "organization:add", "organization:edit", "organization:delete", "organization:user_add", "organization:user_edit", "organization:user_delete", "organization_role:view", "organization_role:add", "organization_role:edit", "organization_role:delete", "organization_role:copy", "supplier:view", "supplier:add", "supplier:edit", "supplier:delete", "supplier:approve", "supplier:export", "station:view", "station:add", "station:edit", "station:delete", "station:config", "device:view", "device:add", "device:edit", "device:delete", "device:config", "purchase:view", "purchase:add", "purchase:edit", "purchase:delete", "purchase:approve", "purchase:export", "goods:view", "goods:add", "goods:edit", "goods:delete", "goods:price_adjust", "goods:export", "points:view", "points:config", "points:adjust", "points:export", "sales:view", "sales:add", "sales:edit", "sales:delete", "sales:approve", "sales:export", "oil:view", "oil:add", "oil:edit", "oil:config", "oil:export"],
  //     "dataScope": "all",
  //     "posDevices": ["gun_config", "tank_config", "price_config", "device_control", "report_print"],
  //     "associatedStations": [15, 16, 18, 19, 21, 22, 24, 25]
  //   },
  //   "orgTypes": ["HEADQUARTER", "DEPARTMENT", "CITY_BRANCH", "SERVICE_AREA", "GAS_STATION"],
  //   "createTime": "2024-01-01T00:00:00Z",
  //   "updateTime": "2024-01-01T00:00:00Z"
  // },
  await delay(200);
  return {
    success: true,
    data: organizationData.roleConfigurations,
    message: '获取角色配置列表成功'
  };
};

// 获取业务角色列表
export const getBusinessRoles = async () => {
  const res = await get(`/merchant/api/roles/business`);
  if (res.code === 0) {
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      element.description = element.roleDescription
      element.isSystemRole = true
      element.permissions = {
        "pageOperations": [],
        "dataScope": element.dataScope,
        "posDevices": [],
        "associatedStations": []
      }
      try {
        element.orgTypes = JSON.parse(element.applicableOrgTypes)
      } catch (error) {
        element.orgTypes = []
      }
      element.isSystemRole = false
    }
    return {
      success: true,
      data: res.data,
      message: '获取角色配置列表成功'
    };
  }
  return {
    success: true,
    data: organizationData.businessRoles,
    message: '获取业务角色列表成功'
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

// 检查角色编码是否存在
const checkRoleCode = async (roleCode) => {
  const query = {
    roleCode: roleCode
  };
  const res = await get(`/merchant/api/roles/check-role-code`, query);
  if (res.code === 0) {
    return res.data
  }
  return false
};

// 添加角色配置
export const addRoleConfiguration = async (roleConfigData) => {
  console.log(roleConfigData)

  let roleCode = ""
  let isExist = true

  while (isExist) {
    roleCode = roleConfigData.roleType + generateRoleId()
    isExist = await checkRoleCode(roleCode)
  }

  var data = {
    "applicableOrgTypes": JSON.stringify(roleConfigData.orgTypes),
    "roleCode": roleCode,
    "roleName": roleConfigData.roleName,
    "roleDescription": roleConfigData.description,
    "dataScope": roleConfigData.permissions.dataScope,
    "roleType": roleConfigData.roleType,
    "isSystemRole": roleConfigData.roleType === "SYSTEM" ? 1:0
  }
  console.log(data)

  const res = await post(`/merchant/api/roles/comprehensive`,data);
  if (res.code === 0) {
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      element.description = ""
      element.isSystemRole = true
      element.permissions = {
        "pageOperations": [],
        "dataScope": "all",
        "posDevices": [],
        "associatedStations": []
      }
      element.orgTypes = []

    }
    return {
      success: true,
      data: res.data,
      message: '添加角色配置成功'
    };
  }
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
  console.log(id)
  const res = await del(`/merchant/api/roles/${id}`);
  console.log(res)
  if (res.code === 0) {
    return {
      success: true,
      data: null,
      message: '删除角色配置成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: '删除角色配置失败'
    };
  }
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
export const copyRoleConfiguration = async (id, newRoleName, newDescription, copyingRole) => {

  console.log(copyingRole)

  let roleCode = ""
  let isExist = true

  while (isExist) {
    roleCode = copyingRole.roleType + generateRoleId()
    isExist = await checkRoleCode(roleCode)
  }

  let data = {
    "sourceRoleId": copyingRole.id,
    "newRoleCode": roleCode,
    "newRoleName": newRoleName,
    "newRoleDescription": newDescription
  }
  const res = await post(`/merchant/api/roles/copy`,data);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '复制角色配置成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: '复制角色配置失败'
    };
  }
}; 