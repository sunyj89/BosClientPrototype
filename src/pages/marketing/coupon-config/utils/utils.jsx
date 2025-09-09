// 优惠券相关工具函数

// 生成12位优惠券ID（英文+数字）
export const generateCouponId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 格式化金额
export const formatAmount = (amount) => {
  if (typeof amount !== 'number') return '0.00';
  return amount.toFixed(2);
};

// 格式化券类型
export const formatCouponType = (type) => {
  const typeMap = {
    'oil': '油品券',
    'goods': '非油券',
    'recharge': '充值赠金券',
  };
  return typeMap[type] || type;
};

// 格式化券状态
export const formatCouponStatus = (status) => {
  const statusMap = {
    'active': '生效中',
    'expired': '已过期',
    'disabled': '已作废',
  };
  return statusMap[status] || status;
};

// 计算核销率
export const calculateUsageRate = (usedCount, issuedCount) => {
  if (!issuedCount || issuedCount === 0) return 0;
  return ((usedCount / issuedCount) * 100).toFixed(1);
};

// 验证优惠券配置
export const validateCouponConfig = (config) => {
  const errors = [];
  
  if (!config.name) {
    errors.push('券名称不能为空');
  }
  
  if (!config.type) {
    errors.push('券类型不能为空');
  }
  
  if (!config.amountType) {
    errors.push('券面额类型不能为空');
  }
  
  if (config.amountType === 'fixed' && !config.fixedAmount) {
    errors.push('固定金额不能为空');
  }
  
  if (config.amountType === 'random') {
    if (!config.randomAmountMin || !config.randomAmountMax) {
      errors.push('随机金额范围不能为空');
    }
    if (config.randomAmountMin >= config.randomAmountMax) {
      errors.push('最小金额必须小于最大金额');
    }
  }
  
  if (config.amountType === 'discount' && !config.discountRate) {
    errors.push('折扣率不能为空');
  }
  
  return errors;
};

// 格式化有效期
export const formatValidityPeriod = (validityType, config) => {
  switch (validityType) {
    case 'range':
      if (config.validityRange && config.validityRange.length === 2) {
        return `${config.validityRange[0].format('YYYY-MM-DD')} ~ ${config.validityRange[1].format('YYYY-MM-DD')}`;
      }
      return '-';
    case 'days_from_receive':
      return `领取后${config.validityDays}天内有效`;
    case 'days_from_date':
      return `领取后第${config.effectiveDays}天生效，有效期${config.validityDaysFromEffective}天`;
    default:
      return '-';
  }
}; 