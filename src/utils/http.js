import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const service = axios.create({
  baseURL: '', // 基础URL，可从环境变量获取
  timeout: 50000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
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
    if (res.code !== 200) {
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
  return service.post(url, data);
};

// 封装PUT请求
export const put = (url, data = {}) => {
  return service.put(url, data);
};

// 封装DELETE请求
export const del = (url, params = {}) => {
  return service.delete(url, { params });
};

export default service;