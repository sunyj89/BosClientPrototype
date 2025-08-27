import React from 'react';
import { Modal, Descriptions, Button, Tag, Row, Col } from 'antd';

const CouponViewModal = ({ visible, onCancel, couponData }) => {
  if (!couponData) return null;

  // 格式化券类型
  const formatCouponType = (type) => {
    const typeMap = {
      'oil': '油品券',
      'non-oil': '非油券',
      'recharge': '充值赠金券'
    };
    return typeMap[type] || type;
  };

  // 格式化使用场景
  const formatUsageScenario = (scenarios) => {
    if (!scenarios || scenarios.length === 0) return '-';
    const scenarioMap = {
      'online': '线上核销',
      'offline': '线下核销'
    };
    return scenarios.map(s => scenarioMap[s] || s).join('、');
  };

  // 格式化支付方式限制
  const formatPaymentRestriction = (restriction) => {
    const restrictionMap = {
      'none': '不限制',
      'ecard_only': '仅电子储值卡可用',
      'ecard_disabled': '电子储值卡不可用'
    };
    return restrictionMap[restriction] || restriction;
  };

  // 格式化券状态
  const formatCouponStatus = (status) => {
    const statusConfig = {
      'active': { text: '生效中', color: 'green' },
      'expired': { text: '已过期', color: 'red' },
      'voided': { text: '已作废', color: 'red' },
      'draft': { text: '草稿', color: 'orange' }
    };
    const config = statusConfig[status] || { text: status, color: 'default' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 格式化券面额类型
  const formatDenominationType = (type, amount, minAmount, maxAmount, discount, maxDiscount) => {
    switch (type) {
      case 'fixed_amount':
        return `固定金额：${amount}元`;
      case 'random_amount':
        return `随机金额：${minAmount}元 - ${maxAmount}元`;
      case 'discount':
        return `固定折扣：${discount}折${maxDiscount ? ` (最多优惠${maxDiscount}元)` : ''}`;
      default:
        return '-';
    }
  };

  // 格式化有效期
  const formatValidityPeriod = (validityType, validityRange, validityDays, effectiveDays, validityDaysFromEffective) => {
    switch (validityType) {
      case 'range':
        return validityRange ? `${validityRange[0]} 至 ${validityRange[1]}` : '-';
      case 'days_from_receive':
        return `自领取之日起${validityDays}天内有效`;
      case 'days_from_date':
        return `自领取之日起第${effectiveDays}天生效，有效期${validityDaysFromEffective}天`;
      default:
        return '-';
    }
  };

  // 格式化时间限制
  const formatTimeRestriction = (timeRestrictionType, timeRestrictionPattern, dailyTimeSlots, weeklyTimeSlots, monthlyTimeSlots) => {
    if (timeRestrictionType === 'anytime') {
      return '有效期内可用';
    }
    
    const actionText = timeRestrictionType === 'specific_allow' ? '指定时间可用' : '指定时间不可用';
    
    if (timeRestrictionPattern === 'daily' && dailyTimeSlots?.length > 0) {
      const slots = dailyTimeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join('、');
      return `${actionText} - 每日重复：${slots}`;
    }
    
    if (timeRestrictionPattern === 'weekly' && weeklyTimeSlots?.length > 0) {
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      const slots = weeklyTimeSlots.map(slot => {
        const days = slot.weekdays?.map(day => weekdays[day]).join('、') || '';
        return `周${days} ${slot.startTime}-${slot.endTime}`;
      }).join('、');
      return `${actionText} - 每周重复：${slots}`;
    }
    
    if (timeRestrictionPattern === 'monthly' && monthlyTimeSlots?.length > 0) {
      const slots = monthlyTimeSlots.map(slot => {
        const days = slot.days?.join('、') || '';
        return `每月${days}日 ${slot.startTime}-${slot.endTime}`;
      }).join('、');
      return `${actionText} - 每月重复：${slots}`;
    }
    
    return actionText;
  };

  // 格式化使用条件
  const formatUsageConditions = (conditions) => {
    if (!conditions || conditions.length === 0) return '-';
    
    return conditions.map((condition, index) => {
      const { oilType, conditionType, value } = condition;
      const oilTypeText = oilType || '所有油品';
      const conditionTypeMap = {
        'original': '原价',
        'actual': '实付',
        'volume': '升数'
      };
      const conditionText = conditionTypeMap[conditionType] || conditionType;
      const unit = conditionType === 'volume' ? '升' : '元';
      
      return `${oilTypeText} - ${conditionText}满${value}${unit}`;
    }).join('；');
  };

  // 安全获取数据，提供默认值
  const safeData = {
    couponId: couponData.couponId || '-',
    name: couponData.name || '-',
    type: couponData.type || 'oil',
    status: couponData.status || 'active',
    usageScenario: couponData.usageScenario || [],
    paymentRestriction: couponData.paymentRestriction || 'none',
    stationRestriction: couponData.stationRestriction || 'all',
    denominationType: couponData.denominationType || 'fixed_amount',
    amount: couponData.amount,
    minAmount: couponData.minAmount,
    maxAmount: couponData.maxAmount,
    discount: couponData.discount,
    maxDiscountAmount: couponData.maxDiscountAmount,
    validityType: couponData.validityType || 'range',
    validityRange: couponData.validityRange,
    validityDays: couponData.validityDays,
    effectiveDays: couponData.effectiveDays,
    validityDaysFromEffective: couponData.validityDaysFromEffective,
    timeRestrictionType: couponData.timeRestrictionType || 'anytime',
    timeRestrictionPattern: couponData.timeRestrictionPattern,
    dailyTimeSlots: couponData.dailyTimeSlots || [],
    weeklyTimeSlots: couponData.weeklyTimeSlots || [],
    monthlyTimeSlots: couponData.monthlyTimeSlots || [],
    usageConditions: couponData.usageConditions || [],
    description: couponData.description || '-',
    totalIssued: couponData.totalIssued || couponData.issuedCount || 0,
    totalRedeemed: couponData.totalRedeemed || couponData.usedCount || 0,
    createTime: couponData.createTime || '-'
  };

  return (
    <Modal
      title="优惠券详情"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
      width={900}
    >
      {/* 主要信息区域 */}
      <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
        <Descriptions.Item label="优惠券ID">{safeData.couponId}</Descriptions.Item>
        <Descriptions.Item label="券名称">{safeData.name}</Descriptions.Item>
        <Descriptions.Item label="券类型">{formatCouponType(safeData.type)}</Descriptions.Item>
        <Descriptions.Item label="券状态">{formatCouponStatus(safeData.status)}</Descriptions.Item>
        <Descriptions.Item label="使用场景">{formatUsageScenario(safeData.usageScenario)}</Descriptions.Item>
        <Descriptions.Item label="支付方式限制">{formatPaymentRestriction(safeData.paymentRestriction)}</Descriptions.Item>
        <Descriptions.Item label="券面额" span={2}>
          {formatDenominationType(
            safeData.denominationType,
            safeData.amount,
            safeData.minAmount,
            safeData.maxAmount,
            safeData.discount,
            safeData.maxDiscountAmount
          )}
        </Descriptions.Item>
        <Descriptions.Item label="累计发放数量">{safeData.totalIssued?.toLocaleString() || 0}</Descriptions.Item>
        <Descriptions.Item label="累计核销数量">{safeData.totalRedeemed?.toLocaleString() || 0}</Descriptions.Item>
        <Descriptions.Item label="核销率">
          {safeData.totalIssued > 0 
            ? `${((safeData.totalRedeemed || 0) / safeData.totalIssued * 100).toFixed(2)}%`
            : '0%'
          }
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{safeData.createTime}</Descriptions.Item>
      </Descriptions>

      {/* 使用条件信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        使用条件设置
      </div>
      <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="油站限制">
          {safeData.stationRestriction === 'all' ? '全部油站' : '指定油站'}
        </Descriptions.Item>
        <Descriptions.Item label="使用条件" span={2}>
          {formatUsageConditions(safeData.usageConditions)}
        </Descriptions.Item>
      </Descriptions>

      {/* 时间设置信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        时间设置
      </div>
      <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="券有效期" span={2}>
          {formatValidityPeriod(
            safeData.validityType,
            safeData.validityRange,
            safeData.validityDays,
            safeData.effectiveDays,
            safeData.validityDaysFromEffective
          )}
        </Descriptions.Item>
        <Descriptions.Item label="时间限制" span={2}>
          {formatTimeRestriction(
            safeData.timeRestrictionType,
            safeData.timeRestrictionPattern,
            safeData.dailyTimeSlots,
            safeData.weeklyTimeSlots,
            safeData.monthlyTimeSlots
          )}
        </Descriptions.Item>
        <Descriptions.Item label="使用说明" span={2}>
          <div style={{ whiteSpace: 'pre-wrap', maxHeight: 100, overflowY: 'auto' }}>
            {safeData.description || '-'}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CouponViewModal; 