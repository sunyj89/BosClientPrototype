import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// 添加stagewise工具栏(仅开发环境)
const isDevelopment = process.env.NODE_ENV === 'development';

// 创建应用根节点
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// 在开发环境下初始化stagewise工具栏
if (isDevelopment) {
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    // 创建一个单独的DOM元素来渲染工具栏
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id = 'stagewise-toolbar-container';
    document.body.appendChild(toolbarContainer);
    
    // 创建一个单独的React根节点来渲染工具栏
    const toolbarRoot = ReactDOM.createRoot(toolbarContainer);
    
    // 基本配置对象
    const stagewiseConfig = {
      plugins: []
    };
    
    // 渲染工具栏
    toolbarRoot.render(
      <StagewiseToolbar config={stagewiseConfig} />
    );
  });
} 