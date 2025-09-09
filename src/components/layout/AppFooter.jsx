import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      BOS客户端系统 ©{new Date().getFullYear()} 加油站管理解决方案
    </Footer>
  );
};

export default AppFooter; 