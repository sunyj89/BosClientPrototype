import React from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // 模拟登录验证
    if (values.username === 'admin' && values.password === 'admin') {
      message.success('登录成功！');
      onLogin();
      navigate('/dashboard');
    } else {
      message.error('用户名或密码错误！');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        style={{ width: 400 }}
        title={
          <div style={{ textAlign: 'center' }}>
            <img src="/logo192.png" alt="Logo" style={{ height: 40, marginRight: 8 }} />
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>BOS客户端系统</span>
          </div>
        }
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Button 
              type="link"
              className="login-form-forgot" 
              style={{ float: 'right', padding: 0 }}
              onClick={() => message.info('请联系系统管理员重置密码')}
            >
              忘记密码
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <p>用户名: admin, 密码: admin</p>
        </div>
      </Card>
    </div>
  );
};

export default Login; 