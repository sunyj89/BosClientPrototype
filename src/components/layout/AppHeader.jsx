import React from 'react';
import { Layout, Button, Dropdown, Badge, Space, Avatar } from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  UserOutlined, 
  BellOutlined, 
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header } = Layout;

const AppHeader = ({ collapsed, setCollapsed, onLogout }) => {
  const userMenuItems = [
    {
      key: '1',
      label: '个人中心',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: '系统设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: onLogout,
    },
  ];

  // 头部样式
  const headerStyle = {
    padding: '0 24px',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 9
  };

  // 用户信息样式
  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0 8px',
    borderRadius: '4px',
    transition: 'all 0.3s',
    ':hover': {
      background: 'rgba(0, 0, 0, 0.025)'
    }
  };

  return (
    <Header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
        <div style={{ marginLeft: 16, fontSize: 16, fontWeight: 'bold', color: '#32AF50' }}>
          智慧能源系统BOS后台
        </div>
      </div>
      
      <div className="header-right">
        <Badge count={5} size="small" style={{ marginRight: 24 }}>
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            style={{ fontSize: '16px' }} 
          />
        </Badge>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={userInfoStyle}>
            <Avatar style={{ backgroundColor: '#32AF50' }} icon={<UserOutlined />} />
            <span style={{ marginLeft: 8 }}>管理员</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader; 