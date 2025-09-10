import React from 'react';
import { Card } from 'antd';

const TestComponent = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <h2>测试页面</h2>
        <p>如果你看到这个页面，说明组件可以正常渲染。</p>
      </Card>
    </div>
  );
};

export default TestComponent;