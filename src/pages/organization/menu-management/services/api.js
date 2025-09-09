import organizationData from '../../../../mock/organization/organizationData.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMenuId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

const convertToTreeStructure = (permissions) => {
  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => {
        if (parentId === null) {
          return !item.parentId;
        }
        return item.parentId === parentId;
      })
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map(item => {
        const children = buildTree(items, item.id);
        const operations = item.operations || [];
        
        return {
          id: item.id,
          name: item.name,
          type: item.type || (children.length > 0 ? 'directory' : 'menu'),
          path: item.path,
          parentId: parentId,
          sort: item.sort || 1,
          status: item.status !== undefined ? item.status : 1,
          isSystem: item.isSystem !== undefined ? item.isSystem : true,
          icon: item.icon,
          component: item.component,
          description: item.description || `系统菜单：${item.name}`,
          children: [
            ...children,
            ...operations.map((op, index) => ({
              id: op.id,
              name: op.name,
              type: 'button',
              path: null,
              parentId: item.id,
              sort: (item.sort || 0) * 1000 + index + 1,
              status: 1,
              isSystem: true,
              icon: null,
              component: null,
              description: `操作按钮：${op.name}`
            }))
          ]
        };
      });
  };

  const flattenPermissions = (items) => {
    let result = [];
    
    const traverse = (items, parentId = null) => {
      items.forEach(item => {
        result.push({
          id: item.id,
          name: item.name,
          path: item.path,
          parentId: item.parentId || parentId,
          operations: item.operations,
          children: item.children,
          sort: item.sort,
          type: item.type,
          icon: item.icon,
          component: item.component,
          status: item.status,
          isSystem: item.isSystem,
          description: item.description
        });
        
        if (item.children && item.children.length > 0) {
          traverse(item.children, item.id);
        }
      });
    };
    
    traverse(items);
    return result;
  };

  const flatPermissions = flattenPermissions(permissions);
  return buildTree(flatPermissions);
};

export const getMenus = async () => {
  await delay(300);
  try {
    const treeData = convertToTreeStructure(organizationData.permissions.pageOperations);
    return {
      success: true,
      data: treeData,
      message: '获取菜单列表成功'
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: '获取菜单列表失败'
    };
  }
};

export const createMenu = async (menuData) => {
  await delay(500);
  try {
    const newMenu = {
      id: generateMenuId(),
      ...menuData,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      isSystem: false
    };
    
    return {
      success: true,
      data: newMenu,
      message: '创建菜单成功'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: '创建菜单失败'
    };
  }
};

export const updateMenu = async (id, menuData) => {
  await delay(500);
  try {
    const updatedMenu = {
      id,
      ...menuData,
      updateTime: new Date().toISOString()
    };
    
    return {
      success: true,
      data: updatedMenu,
      message: '更新菜单成功'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: '更新菜单失败'
    };
  }
};

export const deleteMenu = async (id) => {
  await delay(400);
  try {
    return {
      success: true,
      data: null,
      message: '删除菜单成功'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: '删除菜单失败'
    };
  }
};

export const getMenuById = async (id) => {
  await delay(200);
  try {
    const treeData = convertToTreeStructure(organizationData.permissions.pageOperations);
    
    const findMenuById = (menus, targetId) => {
      for (const menu of menus) {
        if (menu.id === targetId) {
          return menu;
        }
        if (menu.children && menu.children.length > 0) {
          const found = findMenuById(menu.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    
    const menu = findMenuById(treeData, id);
    
    if (menu) {
      return {
        success: true,
        data: menu,
        message: '获取菜单详情成功'
      };
    } else {
      return {
        success: false,
        data: null,
        message: '未找到对应的菜单'
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: '获取菜单详情失败'
    };
  }
};