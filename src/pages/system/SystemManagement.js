import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Breadcrumb, 
  Statistic, 
  List, 
  Typography, 
  Space,
  Button
} from 'antd';
import { 
  SettingOutlined, 
  NodeIndexOutlined, 
  UserOutlined, 
  TeamOutlined, 
  SafetyOutlined,
  DatabaseOutlined,
  ToolOutlined,
  BellOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const SystemManagement = () => {
  const navigate = useNavigate();
  
  // 系统管理功能列表
  const systemModules = [
    {
      key: 'workflow',
      title: '工作流程管理',
      icon: <NodeIndexOutlined style={{ fontSize: 24 }} />,
      description: '管理系统中的各种审批流程，包括流程设计、角色分配和流程监控',
      path: '/system/workflow'
    },
    {
      key: 'user',
      title: '用户管理',
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      description: '管理系统用户，包括用户创建、权限分配和密码重置',
      path: '/system/user'
    },
    {
      key: 'role',
      title: '角色权限管理',
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      description: '管理系统角色和权限，定义不同角色的操作权限',
      path: '/system/role'
    },
    {
      key: 'security',
      title: '安全设置',
      icon: <SafetyOutlined style={{ fontSize: 24 }} />,
      description: '系统安全配置，包括密码策略、登录限制和安全审计',
      path: '/system/security'
    },
    {
      key: 'data',
      title: '数据字典',
      icon: <DatabaseOutlined style={{ fontSize: 24 }} />,
      description: '管理系统中的基础数据和枚举值',
      path: '/system/dictionary'
    },
    {
      key: 'log',
      title: '系统日志',
      icon: <BellOutlined style={{ fontSize: 24 }} />,
      description: '查看系统操作日志和异常记录',
      path: '/system/log'
    },
    {
      key: 'backup',
      title: '备份恢复',
      icon: <ToolOutlined style={{ fontSize: 24 }} />,
      description: '系统数据备份和恢复管理',
      path: '/system/backup'
    },
    {
      key: 'approval',
      title: '审批中心',
      icon: <AuditOutlined style={{ fontSize: 24 }} />,
      description: '集中管理所有待审批事项',
      path: '/approval/center'
    }
  ];

  // 系统统计数据
  const statistics = [
    {
      title: '用户总数',
      value: 56,
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      title: '角色数',
      value: 12,
      icon: <TeamOutlined />,
      color: '#52c41a'
    },
    {
      title: '工作流程',
      value: 8,
      icon: <NodeIndexOutlined />,
      color: '#722ed1'
    },
    {
      title: '待审批事项',
      value: 15,
      icon: <AuditOutlined />,
      color: '#fa8c16'
    }
  ];

  // 处理模块点击
  const handleModuleClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>系统管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>系统管理</h2>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statistics.map(stat => (
          <Col span={6} key={stat.title}>
            <Card>
              <Statistic 
                title={stat.title} 
                value={stat.value} 
                valueStyle={{ color: stat.color }}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 系统管理模块 */}
      <Card title="系统管理模块" className="module-card">
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={systemModules}
          renderItem={item => (
            <List.Item>
              <Card 
                hoverable 
                onClick={() => handleModuleClick(item.path)}
                className="module-item"
              >
                <Space align="start">
                  <div className="module-icon" style={{ color: '#1890ff' }}>
                    {item.icon}
                  </div>
                  <div className="module-content">
                    <Title level={4}>{item.title}</Title>
                    <Paragraph>{item.description}</Paragraph>
                    <Button type="button" icon={<SettingOutlined />}>
                      进入管理
                    </Button>
                  </div>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      {/* 系统信息 */}
      <Card title="系统信息" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="系统版本" value="v1.5.2" />
          </Col>
          <Col span={8}>
            <Statistic title="最后更新" value="2023-06-15" />
          </Col>
          <Col span={8}>
            <Statistic title="运行状态" value="正常" valueStyle={{ color: '#52c41a' }} />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={8}>
            <Statistic title="数据库状态" value="正常" valueStyle={{ color: '#52c41a' }} />
          </Col>
          <Col span={8}>
            <Statistic title="缓存状态" value="正常" valueStyle={{ color: '#52c41a' }} />
          </Col>
          <Col span={8}>
            <Statistic title="服务器负载" value="32%" />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SystemManagement; 