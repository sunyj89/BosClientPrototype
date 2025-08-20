import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const service = axios.create({
  baseURL: '', // 基础URL，可从环境变量获取
  timeout: 50000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 处理成功响应
    const res = response.data;
    // 这里可以根据后端返回的状态码做统一处理
    if (res.code !== 0) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res;
  },
  error => {
    // 处理响应错误
    console.error('响应错误:', error);
    message.error('网络异常，请稍后再试');
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = (url, params = {}) => {
  return service.get(url, { params });
};

// 封装POST请求
export const post = (url, data = {}) => {
  console.log(url, data);
  return service.post(url, data);
};

// 封装PUT请求
export const put = (url, data = {}) => {
  return service.put(url, data);
};

// 封装DELETE请求
// 支持两种参数传递方式：
// 1. params: 通过URL参数传递
// 2. data: 通过请求体传递
// 如果需要同时传递两种参数，可以传入{ params, data }对象
// 也可以直接传入一个参数对象，默认作为请求体data
// 兼容旧版本的调用方式
export const del = (url, options = {}) => {
  // 如果options是普通对象且不包含params和data属性，将其视为data
  if (typeof options === 'object' && !options.params && !options.data) {
    return service.delete(url, { data: options });
  }
  // 否则按照传入的options配置
  return service.delete(url, options);
};

export default service;