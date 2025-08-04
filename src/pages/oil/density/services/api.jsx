/**
 * 油品密度管理API服务
 */

import orgData from '../../../../mock/station/orgData.json';
import tankData from '../../../../mock/oil/density/tankData.json';
import densityData from '../../../../mock/oil/density/densityData.json';
import densityHistoryData from '../../../../mock/oil/density/densityHistoryData.json';
import approvalData from '../../../../mock/oil/density/approvalData.json';

/**
 * 获取组织机构数据
 * @returns {Promise<Object>} 组织机构数据
 */
export const fetchOrgData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orgData);
    }, 300);
  });
};

/**
 * 获取油罐数据
 * @param {Object} params 查询参数
 * @returns {Promise<Array>} 油罐数据
 */
export const fetchTankData = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...tankData];
      
      // 按站点ID筛选
      if (params.stationIds && params.stationIds.length > 0) {
        filteredData = filteredData.filter(item => params.stationIds.includes(item.stationId));
      }
      
      // 按油品类型筛选
      if (params.oilType) {
        filteredData = filteredData.filter(item => item.oilType.includes(params.oilType));
      }
      
      resolve(filteredData);
    }, 300);
  });
};

/**
 * 获取油品密度数据
 * @param {Object} params 查询参数
 * @returns {Promise<Array>} 油品密度数据
 */
export const fetchDensityData = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...densityData];
      
      // 按站点ID筛选
      if (params.stationIds && params.stationIds.length > 0) {
        filteredData = filteredData.filter(item => params.stationIds.includes(item.stationId));
      }
      
      // 按油品类型筛选
      if (params.oilType) {
        filteredData = filteredData.filter(item => item.oilType.includes(params.oilType));
      }
      
      // 按油罐编号筛选
      if (params.tankNo) {
        filteredData = filteredData.filter(item => item.tankNo.includes(params.tankNo));
      }
      
      // 按卸油单号筛选
      if (params.deliveryOrderNo) {
        filteredData = filteredData.filter(item => item.deliveryOrderNo.includes(params.deliveryOrderNo));
      }
      
      // 按状态筛选
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      // 按日期范围筛选
      if (params.dateRange && params.dateRange.length === 2) {
        const startDate = params.dateRange[0];
        const endDate = params.dateRange[1];
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.measureDate);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      resolve(filteredData);
    }, 500);
  });
};

/**
 * 获取密度调整历史数据
 * @param {Object} params 查询参数
 * @returns {Promise<Array>} 密度调整历史数据
 */
export const fetchDensityHistoryData = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...densityHistoryData];
      
      // 按站点ID筛选
      if (params.stationIds && params.stationIds.length > 0) {
        filteredData = filteredData.filter(item => params.stationIds.includes(item.stationId));
      }
      
      // 按油品类型筛选
      if (params.oilType) {
        filteredData = filteredData.filter(item => item.oilType.includes(params.oilType));
      }
      
      // 按油罐编号筛选
      if (params.tankNo) {
        filteredData = filteredData.filter(item => item.tankNo.includes(params.tankNo));
      }
      
      // 按卸油单号筛选
      if (params.deliveryOrderNo) {
        filteredData = filteredData.filter(item => item.deliveryOrderNo.includes(params.deliveryOrderNo));
      }
      
      // 按审批状态筛选
      if (params.approvalStatus) {
        filteredData = filteredData.filter(item => item.approvalStatus === params.approvalStatus);
      }
      
      // 按日期范围筛选
      if (params.dateRange && params.dateRange.length === 2) {
        const startDate = params.dateRange[0];
        const endDate = params.dateRange[1];
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.adjustmentDate);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      resolve(filteredData);
    }, 500);
  });
};

/**
 * 获取审批数据
 * @param {Object} params 查询参数
 * @returns {Promise<Array>} 审批数据
 */
export const fetchApprovalData = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...approvalData];
      
      // 按站点ID筛选
      if (params.stationIds && params.stationIds.length > 0) {
        filteredData = filteredData.filter(item => params.stationIds.includes(item.stationId));
      }
      
      // 按油品类型筛选
      if (params.oilType) {
        filteredData = filteredData.filter(item => item.oilType.includes(params.oilType));
      }
      
      // 按状态筛选
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      // 按申请人筛选
      if (params.applicant) {
        filteredData = filteredData.filter(item => item.applicant.includes(params.applicant));
      }
      
      // 按日期范围筛选
      if (params.dateRange && params.dateRange.length === 2) {
        const startDate = params.dateRange[0];
        const endDate = params.dateRange[1];
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.applicationDate);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      resolve(filteredData);
    }, 500);
  });
};

/**
 * 提交密度调整申请
 * @param {Object} data 申请数据
 * @returns {Promise<Object>} 申请结果
 */
export const submitDensityAdjustment = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成一个随机的申请ID
      const applicationId = `APP${Date.now().toString().slice(-6)}`;
      resolve({
        success: true,
        data: {
          ...data,
          id: applicationId,
          applicationDate: new Date().toISOString(),
          status: '待审批'
        }
      });
    }, 800);
  });
};

/**
 * 审批密度调整申请
 * @param {String} id 申请ID
 * @param {Boolean} approved 是否批准
 * @param {String} comment 审批意见
 * @returns {Promise<Object>} 审批结果
 */
export const approveAdjustment = (id, approved, comment) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id,
          approved,
          comment,
          approvalDate: new Date().toISOString(),
          status: approved ? '已审批' : '已拒绝'
        }
      });
    }, 800);
  });
}; 