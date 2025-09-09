import request from '../../../utils/request';

/**
 * 会员等级管理服务层
 * 按照V2.0需求文档实现的API接口
 */

// API基础路径
const API_BASE = '/api/marketing/member-level';

/**
 * 定级规则管理接口
 */
export const ruleService = {
  // 获取规则列表
  async getRuleList(params = {}) {
    return request.get(`${API_BASE}/rules`, { params });
  },

  // 获取规则详情
  async getRuleDetail(ruleId) {
    return request.get(`${API_BASE}/rules/${ruleId}`);
  },

  // 创建规则
  async createRule(data) {
    return request.post(`${API_BASE}/rules`, data);
  },

  // 更新规则
  async updateRule(ruleId, data) {
    return request.put(`${API_BASE}/rules/${ruleId}`, data);
  },

  // 删除规则
  async deleteRule(ruleId) {
    return request.delete(`${API_BASE}/rules/${ruleId}`);
  },

  // 启用规则
  async activateRule(ruleId) {
    return request.post(`${API_BASE}/rules/${ruleId}/activate`);
  },

  // 停用规则
  async deactivateRule(ruleId) {
    return request.post(`${API_BASE}/rules/${ruleId}/deactivate`);
  },

  // 批量删除规则
  async batchDeleteRules(ruleIds) {
    return request.delete(`${API_BASE}/rules/batch`, { data: { ids: ruleIds } });
  }
};

/**
 * 等级配置接口
 */
export const levelService = {
  // 获取等级配置列表
  async getLevelList(ruleId) {
    return request.get(`${API_BASE}/rules/${ruleId}/levels`);
  },

  // 获取等级详情
  async getLevelDetail(ruleId, levelId) {
    return request.get(`${API_BASE}/rules/${ruleId}/levels/${levelId}`);
  },

  // 创建等级
  async createLevel(ruleId, data) {
    return request.post(`${API_BASE}/rules/${ruleId}/levels`, data);
  },

  // 更新等级
  async updateLevel(ruleId, levelId, data) {
    return request.put(`${API_BASE}/rules/${ruleId}/levels/${levelId}`, data);
  },

  // 删除等级
  async deleteLevel(ruleId, levelId) {
    return request.delete(`${API_BASE}/rules/${ruleId}/levels/${levelId}`);
  },

  // 上传等级图标
  async uploadLevelIcon(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request.post(`${API_BASE}/upload/level-icon`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

/**
 * 权益配置接口
 */
export const privilegeService = {
  // 获取优惠券列表
  async getCouponList(params = {}) {
    return request.get(`${API_BASE}/coupons`, { params });
  },

  // 获取价格规则列表
  async getPriceRuleList(params = {}) {
    return request.get(`${API_BASE}/price-rules`, { params });
  },

  // 配置等级权益
  async configLevelPrivilege(ruleId, levelId, data) {
    return request.post(`${API_BASE}/rules/${ruleId}/levels/${levelId}/privileges`, data);
  }
};

/**
 * 油站和会员组接口
 */
export const configService = {
  // 获取油站树形结构
  async getStationTree() {
    return request.get(`${API_BASE}/stations/tree`);
  },

  // 获取会员组列表
  async getMemberGroupList() {
    return request.get(`${API_BASE}/member-groups`);
  }
};

/**
 * 统计数据接口
 */
export const statisticsService = {
  // 获取会员等级统计数据
  async getLevelStatistics(params = {}) {
    return request.get(`${API_BASE}/statistics/levels`, { params });
  },

  // 获取等级分布数据
  async getLevelDistribution(params = {}) {
    return request.get(`${API_BASE}/statistics/distribution`, { params });
  },

  // 获取会员流动数据
  async getMemberFlowData(params = {}) {
    return request.get(`${API_BASE}/statistics/member-flow`, { params });
  }
};

/**
 * 修改记录接口
 */
export const recordService = {
  // 获取修改记录列表
  async getRecordList(params = {}) {
    return request.get(`${API_BASE}/records`, { params });
  },

  // 获取修改记录详情
  async getRecordDetail(recordId) {
    return request.get(`${API_BASE}/records/${recordId}`);
  }
};

/**
 * 自动化定级接口
 */
export const automationService = {
  // 手动触发定级任务
  async triggerLevelingTask(ruleId) {
    return request.post(`${API_BASE}/automation/trigger-leveling`, { ruleId });
  },

  // 获取定级任务状态
  async getLevelingTaskStatus(taskId) {
    return request.get(`${API_BASE}/automation/tasks/${taskId}`);
  },

  // 处理退款影响
  async handleRefundImpact(data) {
    return request.post(`${API_BASE}/automation/handle-refund`, data);
  }
};

/**
 * 预览和验证接口
 */
export const validationService = {
  // 验证规则配置
  async validateRuleConfig(data) {
    return request.post(`${API_BASE}/validation/rule-config`, data);
  },

  // 预览定级结果
  async previewLevelingResult(ruleId, params = {}) {
    return request.get(`${API_BASE}/preview/leveling-result/${ruleId}`, { params });
  },

  // 预估影响会员数量
  async estimateAffectedMembers(data) {
    return request.post(`${API_BASE}/validation/estimate-members`, data);
  }
};

// 导出所有服务
export default {
  rule: ruleService,
  level: levelService,
  privilege: privilegeService,
  config: configService,
  statistics: statisticsService,
  record: recordService,
  automation: automationService,
  validation: validationService
};