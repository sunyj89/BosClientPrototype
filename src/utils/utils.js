/**
 * 通用工具函数库
 */

// 格式化日期
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 生成UUID
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 格式化金额（保留两位小数，千分位分隔符）
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// 格式化数字（带千分位分隔符）
export const formatNumber = (value, decimals = 0) => {
  if (!value && value !== 0) return '';
  
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

// 深拷贝对象
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  
  return clonedObj;
};

// 从对象数组中查找指定属性值的项
export const findItemByProperty = (array, property, value) => {
  if (!array || !Array.isArray(array)) return null;
  return array.find(item => item[property] === value) || null;
};

// 分组对象数组
export const groupBy = (array, key) => {
  if (!array || !Array.isArray(array)) return {};
  
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// 将对象转换为查询字符串
export const objectToQueryString = (obj) => {
  if (!obj) return '';
  
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

// 从查询字符串解析对象
export const queryStringToObject = (queryString) => {
  if (!queryString) return {};
  
  const pairs = queryString.replace(/^\?/, '').split('&');
  const result = {};
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      result[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  
  return result;
};

// 获取随机整数
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成随机颜色
export const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// 检查对象是否为空
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

// 截断文本
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 模拟延迟函数
export const delay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 模拟API响应
export const mockResponse = (data, success = true, message = success ? '操作成功' : '操作失败', code = success ? 200 : 500) => {
  return {
    success,
    message,
    code,
    data
  };
}; 