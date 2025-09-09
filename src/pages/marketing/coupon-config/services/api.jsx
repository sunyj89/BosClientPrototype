// 优惠券配置相关API服务

// 模拟数据
import couponData from '../../../../mock/marketing/couponData.json';
import stationData from '../../../../mock/station/stationData.json';
import couponStatisticsData from '../../../../mock/marketing/couponStatisticsData.json';
import couponChangeRecordData from '../../../../mock/marketing/couponChangeRecordData.json';

// 获取优惠券列表
export const getCouponList = async (params = {}) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { page = 1, pageSize = 10, name } = params;
    let filteredData = couponData.list || [];
    
    // 根据券名称筛选
    if (name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);
    
    return {
      data,
      total: filteredData.length,
      page,
      pageSize,
    };
  } catch (error) {
    throw new Error('获取优惠券列表失败');
  }
};

// 获取油站列表
export const getStationList = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      data: {
        branches: stationData.branches || [],
        serviceAreas: stationData.serviceAreas || [],
        stations: stationData.stations || [],
      },
    };
  } catch (error) {
    throw new Error('获取油站列表失败');
  }
};

// 创建优惠券
export const createCoupon = async (data) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('创建优惠券:', data);
    
    return {
      success: true,
      data: {
        id: Date.now(),
        ...data,
      },
    };
  } catch (error) {
    throw new Error('创建优惠券失败');
  }
};

// 更新优惠券状态
export const updateCouponStatus = async (id, status) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('更新优惠券状态:', { id, status });
    
    return {
      success: true,
    };
  } catch (error) {
    throw new Error('更新优惠券状态失败');
  }
};

// 获取优惠券详情
export const getCouponDetail = async (id) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const coupon = couponData.list?.find(item => item.id === id);
    
    if (!coupon) {
      throw new Error('优惠券不存在');
    }
    
    return {
      data: coupon,
    };
  } catch (error) {
    throw new Error('获取优惠券详情失败');
  }
};

// 获取优惠券统计数据
export const getCouponStatistics = async (params = {}) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { couponId, dateRange, couponType } = params;
    let statisticsData = { ...couponStatisticsData };
    
    // 根据券ID筛选
    if (couponId && couponId !== 'all') {
      const selectedCoupon = statisticsData.couponList.find(c => c.id === couponId);
      if (selectedCoupon) {
        statisticsData.summary = {
          totalIssued: selectedCoupon.issued,
          totalRedeemed: selectedCoupon.redeemed,
          totalExpired: selectedCoupon.expired,
          redemptionRate: selectedCoupon.redemptionRate
        };
        // 模拟单券的每日趋势数据（实际应该从后端获取）
        statisticsData.dailyTrends = statisticsData.dailyTrends.map(trend => ({
          ...trend,
          issued: Math.floor(trend.issued * 0.3),
          redeemed: Math.floor(trend.redeemed * 0.35),
          expired: Math.floor(trend.expired * 0.2)
        }));
      }
    }
    
    // 根据券类型筛选
    if (couponType && couponType !== 'all') {
      const filteredCoupons = statisticsData.couponList.filter(c => c.type === couponType);
      const totalStats = filteredCoupons.reduce((acc, coupon) => ({
        totalIssued: acc.totalIssued + coupon.issued,
        totalRedeemed: acc.totalRedeemed + coupon.redeemed,
        totalExpired: acc.totalExpired + coupon.expired,
      }), { totalIssued: 0, totalRedeemed: 0, totalExpired: 0 });
      
      statisticsData.summary = {
        ...totalStats,
        redemptionRate: totalStats.totalIssued > 0 ? 
          (totalStats.totalRedeemed / totalStats.totalIssued * 100).toFixed(1) : 0
      };
    }
    
    return {
      data: statisticsData,
    };
  } catch (error) {
    throw new Error('获取优惠券统计失败');
  }
};

// 获取优惠券选项列表（用于下拉选择）
export const getCouponOptions = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const options = couponData.list?.map(coupon => ({
      value: coupon.id,
      label: coupon.name,
      type: coupon.type
    })) || [];
    
    return {
      data: [
        { value: 'all', label: '全部优惠券', type: 'all' },
        ...options
      ],
    };
  } catch (error) {
    throw new Error('获取优惠券选项失败');
  }
};

// 获取优惠券修改记录
export const getCouponChangeRecords = async (params = {}) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { page = 1, pageSize = 10, keyword, changeType, changeField, status, dateRange } = params;
    let filteredData = couponChangeRecordData.list || [];
    
    // 根据关键词筛选
    if (keyword) {
      filteredData = filteredData.filter(item => 
        item.couponName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.couponId.toLowerCase().includes(keyword.toLowerCase()) ||
        item.operator.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // 根据变更类型筛选
    if (changeType) {
      filteredData = filteredData.filter(item => item.changeType === changeType);
    }
    
    // 根据变更字段筛选
    if (changeField) {
      filteredData = filteredData.filter(item => item.changeField === changeField);
    }
    
    // 根据状态筛选
    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }
    
    // 根据时间范围筛选
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filteredData = filteredData.filter(item => {
        const changeDate = new Date(item.changeTime);
        return changeDate >= new Date(startDate) && changeDate <= new Date(endDate);
      });
    }
    
    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);
    
    return {
      data,
      total: filteredData.length,
      page,
      pageSize,
    };
  } catch (error) {
    throw new Error('获取优惠券修改记录失败');
  }
}; 