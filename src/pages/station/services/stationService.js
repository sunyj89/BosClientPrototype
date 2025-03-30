import { delay, mockResponse } from '../../../utils/utils';
import orgData from '../../../mock/station/orgData.json';
import employeeData from '../../../mock/station/employeeData.json';
import equipmentData from '../../../mock/station/equipmentData.json';
import salesData from '../../../mock/station/salesData.json';
import deliveryTaskData from '../../../mock/station/deliveryTaskData.json';
import approvalData from '../../../mock/station/approvalData.json';

// 组织结构服务
export async function fetchOrgStructure() {
  await delay(500); // 模拟网络延迟
  return mockResponse(orgData);
}

export async function fetchStationDetail(id) {
  await delay(500);
  const company = orgData.company;
  let station = null;
  
  // 遍历寻找匹配的油站
  orgData.branches.forEach(branch => {
    const found = branch.stations.find(item => item.id === id);
    if (found) {
      station = {
        ...found,
        branchId: branch.id,
        branchName: branch.name
      };
    }
  });
  
  return station ? mockResponse(station) : mockResponse(null, 404, 'not found');
}

export async function createStation(data) {
  await delay(800);
  const newStation = {
    id: `ST${Date.now().toString().substr(-6)}`,
    ...data,
    createTime: new Date().toISOString().split('T')[0]
  };
  return mockResponse(newStation);
}

export async function updateStation(data) {
  await delay(800);
  return mockResponse(data);
}

export async function deleteStation(id) {
  await delay(800);
  return mockResponse(null);
}

// 员工管理服务
export async function fetchEmployeeList(params) {
  await delay(500);
  const { orgId, current = 1, pageSize = 10 } = params || {};
  
  let list = [...employeeData];
  if (orgId) {
    list = list.filter(item => item.orgId === orgId);
  }
  
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  const pageList = list.slice(start, end);
  
  return mockResponse({
    list: pageList,
    total: list.length,
    current,
    pageSize
  });
}

export async function fetchEmployeeDetail(id) {
  await delay(500);
  const employee = employeeData.find(item => item.id === id);
  
  return employee ? mockResponse(employee) : mockResponse(null, 404, 'not found');
}

export async function createEmployee(data) {
  await delay(800);
  const newEmployee = {
    id: `EMP${Date.now().toString().substr(-6)}`,
    ...data,
    hireDate: new Date().toISOString().split('T')[0]
  };
  return mockResponse(newEmployee);
}

export async function updateEmployee(data) {
  await delay(800);
  return mockResponse(data);
}

export async function deleteEmployee(id) {
  await delay(800);
  return mockResponse(null);
}

// 设备管理服务
export async function fetchEquipmentList(params) {
  await delay(500);
  const { stationId, current = 1, pageSize = 10 } = params || {};
  
  let list = [...equipmentData];
  if (stationId) {
    list = list.filter(item => item.stationId === stationId);
  }
  
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  const pageList = list.slice(start, end);
  
  return mockResponse({
    list: pageList,
    total: list.length,
    current,
    pageSize
  });
}

export async function fetchEquipmentDetail(id) {
  await delay(500);
  const equipment = equipmentData.find(item => item.id === id);
  
  return equipment ? mockResponse(equipment) : mockResponse(null, 404, 'not found');
}

export async function createEquipment(data) {
  await delay(800);
  const newEquipment = {
    id: `EQ${Date.now().toString().substr(-6)}`,
    ...data,
    installDate: new Date().toISOString().split('T')[0],
    lastMaintenance: new Date().toISOString().split('T')[0]
  };
  return mockResponse(newEquipment);
}

export async function updateEquipment(data) {
  await delay(800);
  return mockResponse(data);
}

export async function deleteEquipment(id) {
  await delay(800);
  return mockResponse(null);
}

// 销售数据服务
export async function fetchDailySales(params) {
  await delay(500);
  const { stationId, date, current = 1, pageSize = 10 } = params || {};
  
  let list = [...salesData.daily];
  if (stationId) {
    list = list.filter(item => item.stationId === stationId);
  }
  if (date) {
    list = list.filter(item => item.date === date);
  }
  
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  const pageList = list.slice(start, end);
  
  return mockResponse({
    list: pageList,
    total: list.length,
    current,
    pageSize
  });
}

export async function fetchMonthlySales(params) {
  await delay(500);
  const { stationId, month, current = 1, pageSize = 10 } = params || {};
  
  let list = [...salesData.monthly];
  if (stationId) {
    list = list.filter(item => item.stationId === stationId);
  }
  if (month) {
    list = list.filter(item => item.month === month);
  }
  
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  const pageList = list.slice(start, end);
  
  return mockResponse({
    list: pageList,
    total: list.length,
    current,
    pageSize
  });
}

export async function fetchYearlySales(params) {
  await delay(500);
  const { stationId, year, current = 1, pageSize = 10 } = params || {};
  
  let list = [...salesData.yearly];
  if (stationId) {
    list = list.filter(item => item.stationId === stationId);
  }
  if (year) {
    list = list.filter(item => item.year === year);
  }
  
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  const pageList = list.slice(start, end);
  
  return mockResponse({
    list: pageList,
    total: list.length,
    current,
    pageSize
  });
}

// 配送任务服务
export async function fetchDeliveryTaskList(params) {
  await delay(500);
  const { targetStationId, status, current = 1, pageSize = 10 } = params || {};
  
  let list = [...deliveryTaskData];
  if (targetStationId) {
    list = list.filter(item => item.targetStationId === targetStationId);
  }
  if (status) {
    list = list.filter(item => item.status === status);
  }
  
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  const pageList = list.slice(start, end);
  
  return mockResponse({
    list: pageList,
    total: list.length,
    current,
    pageSize
  });
}

export async function fetchDeliveryTaskDetail(id) {
  await delay(500);
  const task = deliveryTaskData.find(item => item.id === id);
  
  return task ? mockResponse(task) : mockResponse(null, 404, 'not found');
}

export async function createDeliveryTask(data) {
  await delay(800);
  const newTask = {
    id: `T${Date.now().toString().substr(-6)}`,
    ...data,
    createTime: new Date().toISOString().split('T')[0],
    status: '待发车'
  };
  return mockResponse(newTask);
}

export async function updateDeliveryTaskStatus(data) {
  const { id, status } = data;
  await delay(500);
  
  const task = deliveryTaskData.find(item => item.id === id);
  if (!task) {
    return mockResponse(null, 404, '任务不存在');
  }
  
  // 状态流转检查 (待发车 -> 运输中 -> 已完成)
  const statusFlow = {
    '待发车': ['运输中'],
    '运输中': ['已完成', '异常'],
    '异常': ['已完成', '已取消'],
    '已完成': [],
    '已取消': []
  };
  
  if (!statusFlow[task.status].includes(status)) {
    return mockResponse(null, 400, `不能从 ${task.status} 状态变更为 ${status}`);
  }
  
  task.status = status;
  return mockResponse(task);
}

// 油站统计服务
export async function fetchStationStats(stationId) {
  await delay(800);
  
  if (!stationId) {
    return mockResponse(null, 400, '缺少油站ID参数');
  }
  
  // 查找油站信息
  let station = null;
  let branch = null;
  
  orgData.branches.forEach(b => {
    const foundStation = b.stations.find(s => s.id === stationId);
    if (foundStation) {
      station = foundStation;
      branch = b;
    }
  });
  
  if (!station) {
    return mockResponse(null, 404, '油站不存在');
  }
  
  // 获取油站相关数据
  const employees = employeeData.filter(item => item.stationId === stationId);
  const equipments = equipmentData.filter(item => item.stationId === stationId);
  
  // 获取销售数据
  const dailySales = salesData.daily.filter(item => item.stationId === stationId);
  const monthlySales = salesData.monthly.filter(item => item.stationId === stationId);
  const yearlySales = salesData.yearly.filter(item => item.stationId === stationId);
  
  // 获取配送任务
  const deliveryTasks = deliveryTaskData.filter(item => item.targetStationId === stationId);
  
  // 组装最近销售数据
  const lastDailySales = dailySales.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  const lastMonthlySales = monthlySales.sort((a, b) => {
    const dateA = new Date(`${a.year}-${a.month}-01`);
    const dateB = new Date(`${b.year}-${b.month}-01`);
    return dateB - dateA;
  }).slice(0, 6);
  
  // 统计员工部门分布
  const departmentStats = {};
  employees.forEach(emp => {
    if (!departmentStats[emp.department]) {
      departmentStats[emp.department] = 0;
    }
    departmentStats[emp.department]++;
  });
  
  // 统计油品销售分布
  const oilSalesStats = {};
  lastDailySales.forEach(sale => {
    sale.details.forEach(detail => {
      if (!oilSalesStats[detail.oilType]) {
        oilSalesStats[detail.oilType] = 0;
      }
      oilSalesStats[detail.oilType] += detail.volume;
    });
  });
  
  // 计算销售趋势
  const salesTrend = lastDailySales.map(item => ({
    date: item.date,
    amount: item.salesAmount
  })).reverse();
  
  // 计算客流趋势
  const customerTrend = lastDailySales.map(item => ({
    date: item.date,
    count: item.customerCount
  })).reverse();
  
  // 计算配送状态分布
  const deliveryStats = {
    total: deliveryTasks.length,
    pending: deliveryTasks.filter(item => item.status === '待发车').length,
    inTransit: deliveryTasks.filter(item => item.status === '运输中').length,
    completed: deliveryTasks.filter(item => item.status === '已完成').length,
    exception: deliveryTasks.filter(item => item.status === '异常').length,
    cancelled: deliveryTasks.filter(item => item.status === '已取消').length
  };
  
  // 格式化最近交易
  const recentTransactions = lastDailySales.slice(0, 5).map(sale => ({
    date: sale.date,
    amount: sale.salesAmount,
    customerCount: sale.customerCount
  }));
  
  const stats = {
    stationInfo: {
      ...station,
      branchName: branch.name
    },
    overview: {
      employeeCount: employees.length,
      equipmentCount: equipments.length,
      gunCount: station.gunCount || 0,
      tankCount: station.tankCount || 0,
      annualSales: yearlySales.length > 0 ? yearlySales[0].salesAmount : 0
    },
    salesData: {
      trend: salesTrend,
      customerTrend: customerTrend,
      oilDistribution: Object.entries(oilSalesStats).map(([type, volume]) => ({
        type,
        volume
      })),
      recentTransactions
    },
    employeeData: {
      total: employees.length,
      departmentDistribution: Object.entries(departmentStats).map(([name, value]) => ({
        name,
        value
      }))
    },
    equipmentData: {
      total: equipments.length,
      normal: equipments.filter(item => item.status === '正常').length,
      maintenance: equipments.filter(item => item.status === '维修中').length,
      fault: equipments.filter(item => item.status === '故障').length
    },
    deliveryData: deliveryStats
  };
  
  return mockResponse(stats);
}

// 获取油站审批历史
export const fetchStationAuditHistory = async (stationId) => {
  try {
    // 模拟从后端获取审批历史
    // 在实际项目中，这里应该调用真实的API
    return {
      success: true,
      message: '获取审批历史成功',
      list: [
        {
          id: '1',
          stationId: stationId,
          operateUser: '张经理',
          operateType: '提交审批',
          content: '新增油站，请审批',
          time: '2023-05-15 10:30:45'
        },
        {
          id: '2',
          stationId: stationId,
          operateUser: '李总监',
          operateType: '审批通过',
          content: '油站信息符合要求，同意增设',
          time: '2023-05-16 14:22:18'
        }
      ]
    };
  } catch (error) {
    console.error('获取油站审批历史失败:', error);
    return { success: false, message: '获取油站审批历史失败' };
  }
};

// 审批油站
export const auditStation = async (auditData) => {
  try {
    // 模拟审批请求
    // 在实际项目中，这里应该调用真实的API
    console.log('审批数据:', auditData);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 创建一条审批记录
    const auditRecord = {
      id: `audit-${Date.now()}`,
      stationId: auditData.stationId,
      operateUser: auditData.operateUser || '当前用户',
      operateType: auditData.result === 'approve' ? '审批通过' : '审批拒绝',
      content: auditData.comments,
      time: auditData.operateTime || new Date().toISOString()
    };
    
    return {
      success: true,
      message: auditData.result === 'approve' ? '审批通过成功' : '拒绝审批成功',
      data: {
        auditRecord,
        updatedStatus: auditData.result === 'approve' ? '已通过' : '已拒绝'
      }
    };
  } catch (error) {
    console.error('审批油站失败:', error);
    return { success: false, message: '审批油站失败' };
  }
};

// 批量审批油站
export const batchAuditStations = async (batchData) => {
  try {
    // 模拟批量审批请求
    // 在实际项目中，这里应该调用真实的API
    console.log('批量审批数据:', batchData);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 为每个ID创建一条审批记录
    const auditRecords = batchData.ids.map(id => ({
      id: `audit-batch-${id}-${Date.now()}`,
      stationId: id,
      operateUser: batchData.operateUser || '当前用户',
      operateType: batchData.result === 'approve' ? '审批通过' : '审批拒绝',
      content: batchData.comments,
      time: batchData.operateTime || new Date().toISOString()
    }));
    
    return {
      success: true,
      message: batchData.result === 'approve' ? '批量审批通过成功' : '批量拒绝成功',
      data: {
        auditRecords,
        updatedIds: batchData.ids
      }
    };
  } catch (error) {
    console.error('批量审批油站失败:', error);
    return { success: false, message: '批量审批油站失败' };
  }
};

// 获取待审批油站列表
export async function fetchPendingApprovals(params) {
  await delay(500);
  const { approvalType, current = 1, pageSize = 10 } = params || {};
  
  let pendingApprovals = [...approvalData.pendingApprovals];
  
  // 应用筛选条件
  if (approvalType) {
    pendingApprovals = pendingApprovals.filter(item => item.approvalType === approvalType);
  }
  
  // 处理分页
  const total = pendingApprovals.length;
  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const list = pendingApprovals.slice(startIndex, endIndex);
  
  return mockResponse({
    list,
    total,
    current,
    pageSize
  });
}

// 获取审批历史记录
export async function fetchApprovalHistory(params) {
  await delay(500);
  const { stationId, current = 1, pageSize = 10 } = params || {};
  
  let approvalHistory = [...approvalData.approvalHistory];
  
  // 如果提供了stationId，过滤特定油站的审批历史
  if (stationId) {
    approvalHistory = approvalHistory.filter(item => item.stationId === stationId);
  }
  
  // 处理分页
  const total = approvalHistory.length;
  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const list = approvalHistory.slice(startIndex, endIndex);
  
  return mockResponse({
    list,
    total,
    current,
    pageSize
  });
} 