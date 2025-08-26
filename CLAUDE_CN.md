# CLAUDE.md (中文版)

本文件为 Claude Code (claude.ai/code) 在处理此代码库时提供指导。

## 常用开发命令

### 开发相关
```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行单元测试
npm test

# 使用 Playwright 运行端到端测试
npm run test:e2e

# 以 UI 模式运行 e2e 测试（调试）
npm run test:e2e:ui

# 显示测试报告
npm run test:e2e:report
```

开发服务器运行在 `http://127.0.0.1:3000`，支持本地网络访问的主机绑定。

## 项目架构

### 技术栈
- **React 18** 使用函数组件和钩子
- **Ant Design 5.3.0** 作为主要 UI 组件库
- **React Router DOM 6.8.2** 用于客户端路由
- **ECharts 5.6.0** 用于数据可视化
- **Axios 1.3.4** 用于 HTTP 请求
- **Playwright** 用于端到端测试

### 项目结构
```
src/
├── components/layout/     # 布局组件（AppHeader, AppSider, AppFooter）
├── pages/                # 按领域组织的功能模块
│   ├── supplier/         # 供应商管理
│   ├── purchase/         # 采购（油品和非油品）
│   ├── sales/           # 销售管理（油品和商品）
│   ├── goods/           # 商品管理
│   ├── oil/             # 油品管理
│   ├── station/         # 加油站管理（油罐、油枪）
│   ├── equipment/       # 设备管理
│   ├── organization/    # 组织和角色管理
│   ├── member/          # 会员中心
│   ├── points/          # 积分系统
│   ├── marketing/       # 营销活动
│   ├── security/        # 安全管理
│   ├── analytics/       # 数据分析
│   └── report/          # 报表
├── mock/                # 按模块组织的模拟数据
├── utils/               # 工具函数
└── router.js           # 路由定义
```

### 组件组织
- 每个功能模块在 `src/pages/` 下有自己的目录
- 模块结构：`index.js`（主组件）、`index.css`（样式）、`components/`（子组件）
- 共享组件在 `src/components/`
- 模拟数据在 `src/mock/` 中镜像页面结构

## 设计系统和 UI 指南

### 整体风格
- 采用企业级应用的简洁现代风格
- 以绿色为主色调（#32AF50），搭配白色背景，体现专业性和清晰度
- 布局结构清晰，层次分明，便于用户快速定位功能
- 遵循一致性原则，各页面保持统一的设计语言

### 布局架构
- **头部**：顶部导航栏
- **侧边栏**：两级树形菜单结构，使用 Ant Design 图标
- **内容区**：基于卡片的布局，24px 内边距
- **标签页**：大型标签页，底部 16px 边距
- 不使用面包屑导航

### 主容器结构
```jsx
<div className="module-container">
  <Card>
    <Spin spinning={loading}>
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        size="large"
        tabBarStyle={{ marginBottom: '16px' }}
      >
        {/* 内容 */}
      </Tabs>
    </Spin>
  </Card>
</div>
```

```css
.module-container {
  padding: 24px;
}

.module-container .ant-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

### 按钮标准
主色：`#32AF50`（绿色），错误色：`#f5222d`（红色）

**按钮类型：**
- 主要操作：`type="primary"`（查询、保存、创建）
- 次要操作：默认类型（重置、取消）
- 危险操作：`type="primary" danger`（删除）
- 表格操作：`type="primary" size="small"`

所有按钮必须有 `border-radius: 2px`

### 表单和筛选布局
- 筛选条件在一行，按钮在下一行（右对齐）
- 使用 `Space` 组件确保按钮间距一致
- 表单使用响应式 `Row`/`Col` 网格系统
- 表格支持水平滚动 `scroll={{ x: 'max-content' }}`

### 弹窗使用
- 使用弹窗（不是抽屉）进行创建/编辑/查看操作
- 页脚按钮：取消/关闭（左侧），保存/确认（右侧，主要）

### 列表页面查看弹窗布局规范

#### 弹窗基础结构
```jsx
<Modal
  title="详情标题"           // 统一格式："{模块名}详情"
  open={isViewModalVisible}
  onCancel={closeModal}
  footer={[                 // 只有关闭按钮
    <Button key="close" onClick={closeModal}>
      关闭
    </Button>
  ]}
  width={900}               // 固定宽度900px
>
```

#### 内容布局规范
1. **主要信息区域**
   - 使用 `Descriptions` 组件：`column={2} bordered`
   - 2列布局，带边框显示
   - 每个字段使用 `Descriptions.Item`

2. **特殊字段处理**
   - **状态类字段**：使用 `Tag` 组件，颜色编码
   - **文件类字段**：使用 `Button type="link"` 显示下载链接
   - **数值类字段**：使用 `toLocaleString()` 格式化显示

## 业务领域知识

### 组织结构
- **公司**：江西交投化石能源公司
- **8个分公司**：赣中、赣东北、赣东、赣东南、赣南、赣西南、赣西、赣西北
- **层级**：公司 → 分公司 → 服务区 → 加油站
- **角色**：经理级别、业务经理、加油站员工（收银员、加油员、安全人员）

### 油品产品
每个加油站的标准油品类型：92#、95#、98#、0#（柴油），加尿素（DEF）
每个加油站有8个加油枪（每个油品品号2个）+ 1个尿素枪

### 模块关系
- **采购**：油品询价 → 采购 → 配送管理
- **销售**：油品/商品销售，包含价格管理和报表
- **库存**：连接采购、销售和损耗管理
- **审批流程**：定价、采购申请的多级审批

## 测试

### 测试结构
- 单元测试：使用 React Testing Library 的 Jest
- E2E 测试：支持跨浏览器的 Playwright
- 测试文件按功能组织在 `/tests` 目录中
- 为所有主要业务实体提供模拟数据

### 测试环境
- E2E 测试自动启动开发服务器
- 测试在多个浏览器上运行（Chrome、Firefox、Safari）
- 包含移动视口测试
- 失败时捕获截图和视频

## 开发指南

### 代码风格
- 使用带钩子的函数组件
- 遵循 Ant Design 组件模式
- 保持一致的文件命名：组件用 PascalCase，目录用 kebab-case
- CSS 类遵循模块命名：`.module-name-container`

### API 和数据
- 模拟数据按业务模块组织在 `/src/mock/`
- 使用 Axios 进行 HTTP 请求
- 使用 Ant Design Spin 组件实现加载状态
- 遵循业务流程的审批工作流模式

### 状态管理
- React 内置状态管理（useState、useEffect）
- 页面级状态管理
- 无外部状态管理库

### 文件组织规则

#### 基础目录结构
```
src/
├── pages/                    # 页面目录
│   ├── [模块名]/            # 功能模块目录
│   │   ├── index.js         # 模块入口文件
│   │   ├── index.css        # 模块样式文件
│   │   ├── components/      # 模块私有组件
│   │   ├── services/        # 模块服务
│   │   └── utils/           # 模块工具函数
│   ├── components/          # 公共组件
│   ├── services/            # 公共服务
│   └── utils/               # 公共工具函数
├── components/              # 全局组件
├── services/                # 全局服务
├── utils/                   # 全局工具函数
├── assets/                  # 静态资源
├── styles/                  # 全局样式
├── docs/                    # 项目文档
└── config/                  # 配置文件
```

#### 命名规范
- 文件夹：小写字母，多词用连字符
- 组件文件：大驼峰命名
- 样式文件：与组件同名，使用css后缀
- 服务文件：小驼峰命名
- 工具函数：小驼峰命名

## 模拟数据规范

### 数据文件组织
- 位置：`src/mock/[模块名]/[功能名].json`
- 命名规范：使用小驼峰命名法
- 示例：`src/mock/system/userList.json`

### 通用模拟数据
- 组织架构要求
  - 总公司：江西交投化石能源公司
  - 分公司（8个）：赣中分公司、赣东北分公司、赣东分公司、赣东南分公司、赣南分公司、赣西南分公司、赣西分公司、赣西北分公司
  - 每个分公司下有2个服务区，每个服务区有2个油站

- 员工要求
  - 总公司：总经理，副总经理，部长，副部长，主任，业务经理
  - 分公司：经理，副经理，业务经理
  - 油站：油站经理，加油员，收银员，财务人员，安全管理人员

- 油品品号
  - 每个加油站都有4种油品品号+1种尿素：92#，95#，98#，0#，尿素

- 油枪信息
  - 每个加油站都有8把加油枪+1个尿素枪：92#有2把油枪，95#有2把油枪，98#有2把油枪，0#有2把油枪，尿素有1把油枪

### 审批数据规范
- 审批中心模拟数据位置：`src/mock/[模块名]/[模块名]ApprovalData.json`
- 标准数据结构：
  ```javascript
  {
    "pendingApprovals": [ /* 待审批记录 */ ],
    "approvalHistory": [ /* 审批历史记录 */ ]
  }
  ```

## 重要开发原则

1. **一致性**：所有同类型组件保持统一样式和交互
2. **层次性**：通过颜色、大小、位置体现信息层级
3. **响应式**：适配不同屏幕尺寸
4. **可用性**：操作流程简单直观，减少用户认知负担
5. **安全性**：危险操作必须二次确认

## 重要指导原则
- 执行用户要求的任务，不多不少
- 除非绝对必要，否则不要创建文件
- 始终优先编辑现有文件而非创建新文件
- 除非用户明确要求，否则不要主动创建文档文件（*.md）或 README 文件