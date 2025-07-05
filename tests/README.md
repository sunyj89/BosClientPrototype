# Playwright 自动化测试指南

## 📋 测试概述

本项目使用 Playwright 进行端到端（E2E）自动化测试，覆盖：

- 🔐 **用户认证**：登录、登出功能
- 📊 **仪表板**：页面加载、组件显示、响应式布局
- 🏢 **业务模块**：供应商管理、油品管理等核心业务功能
- 🔌 **API 接口**：后端接口的功能和错误处理测试

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
npx playwright install
```

### 2. 启动应用
```bash
npm start
```

### 3. 运行测试
```bash
# 运行所有测试
npm run test:e2e

# 运行特定测试文件
npx playwright test tests/auth/login.spec.js

# 运行特定测试用例
npx playwright test -g "登录功能"
```

## 🛠️ 测试命令

| 命令 | 功能 |
|------|------|
| `npm run test:e2e` | 运行所有测试（无头模式） |
| `npm run test:e2e:headed` | 运行测试（显示浏览器） |
| `npm run test:e2e:ui` | 打开 Playwright UI 界面 |
| `npm run test:e2e:debug` | 调试模式运行测试 |
| `npm run test:e2e:report` | 查看测试报告 |

## 📁 测试文件结构

```
tests/
├── auth/                 # 认证相关测试
│   └── login.spec.js    # 登录功能测试
├── pages/               # 页面级测试
│   └── dashboard.spec.js # 仪表板页面测试
├── modules/             # 业务模块测试
│   └── supplier.spec.js # 供应商管理测试
├── api/                 # API 接口测试
│   └── api.spec.js      # 接口功能测试
└── utils/               # 测试工具
    └── auth.js          # 认证辅助函数
```

## 🎯 测试场景覆盖

### 登录功能测试
- ✅ 成功登录
- ✅ 用户名/密码为空的错误提示
- ✅ 错误凭据的处理
- ✅ 记住我功能

### 仪表板测试
- ✅ 页面加载和布局验证
- ✅ 导航菜单显示
- ✅ 统计卡片和图表组件
- ✅ 响应式布局适配

### 供应商管理测试
- ✅ 列表页面加载
- ✅ 搜索功能
- ✅ 新增/编辑/删除操作
- ✅ 分页和排序功能

### API 接口测试
- ✅ 用户认证接口
- ✅ CRUD 操作接口
- ✅ 错误处理和状态码验证

## ⚙️ 配置说明

### 浏览器支持
- Chrome (Chromium)
- Firefox
- Safari (WebKit)
- Mobile Chrome
- Mobile Safari

### 测试配置
- **基础URL**: `http://127.0.0.1:3000`
- **超时时间**: 默认 30 秒
- **重试次数**: CI 环境 2 次，本地 0 次
- **并行执行**: 支持多线程并行测试

## 📝 编写测试用例

### 基本结构
```javascript
const { test, expect } = require('@playwright/test');
const { AuthHelper } = require('../utils/auth');

test.describe('测试套件名称', () => {
  test.beforeEach(async ({ page }) => {
    // 测试前置操作
    const auth = new AuthHelper(page);
    await auth.login();
  });

  test('测试用例名称', async ({ page }) => {
    // 测试步骤
    await page.goto('/some-page');
    await expect(page.locator('.some-element')).toBeVisible();
  });
});
```

### 最佳实践
1. **使用有意义的测试名称**：用中文描述测试目的
2. **保持测试独立性**：每个测试用例互不依赖
3. **使用稳定的选择器**：优先使用 data-testid、class 等
4. **适当的等待策略**：使用 `waitForSelector` 而非 `waitForTimeout`
5. **错误处理**：考虑元素可能不存在的情况

## 🔧 调试技巧

### 1. 显示浏览器调试
```bash
npx playwright test --headed --debug
```

### 2. 使用 Playwright Inspector
```bash
npx playwright test --debug
```

### 3. 截图和视频
- 失败时自动截图
- 失败时录制视频
- 查看 `test-results/` 目录

### 4. 查看测试报告
```bash
npx playwright show-report
```

## 🚨 常见问题

### Q: 测试运行很慢？
A: 考虑：
- 减少 `waitForTimeout` 的使用
- 使用更具体的选择器
- 启用并行执行

### Q: 选择器找不到元素？
A: 尝试：
- 检查元素是否需要等待加载
- 使用更通用的选择器
- 添加调试输出查看页面状态

### Q: 登录总是失败？
A: 检查：
- 应用是否正常启动
- 登录凭据是否正确
- 网络请求是否正常

## 📊 CI/CD 集成

可以将测试集成到 GitHub Actions、Jenkins 等 CI/CD 平台：

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
``` 