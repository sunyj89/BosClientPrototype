# 智慧能源系统BOS后台设计规范 v2.0

## 设计理念

### 整体风格
- 采用企业级应用的简洁现代风格
- 以蓝色为主色调，搭配白色背景，体现专业性和清晰度
- 布局结构清晰，层次分明，便于用户快速定位功能
- 遵循一致性原则，各页面保持统一的设计语言

### 组件库
- 基于 Ant Design 组件库开发
- 遵循 Ant Design 设计规范，保持组件使用的一致性
- 适当定制组件样式，以符合智慧能源系统BOS后台的业务特点
- 不需要在表单页面展示统计功能
- Dashboard使用 Apache Echarts

### 通用布局
- 页面顶部为导航栏
- 左侧为菜单栏，采用树形结构展示功能模块
- 右侧为内容区域，使用卡片式布局包裹内容
- 表单和表格区域之间使用分隔线（不用卡片）
- 不需要面包屑导航

### 主容器结构

**✅ 正确的页面结构（单层Card）**
```jsx
<div className="module-container">
  <Card>
    <Spin spinning={loading}>
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        size="large"
        tabBarStyle={{ marginBottom: '16px' }}
        items={tabItems}
      />
    </Spin>
  </Card>
</div>
```

**❌ 错误的页面结构（多层Card嵌套）**
```jsx
// 禁止：Tab内容组件再次嵌套Card
<div className="module-container">
  <Card>
    <Tabs>
      <TabPane>
        <Card>  {/* ❌ 禁止嵌套Card */}
          <Form>...</Form>
        </Card>
      </TabPane>
    </Tabs>
  </Card>
</div>
```

**CSS样式规范**
```css
.module-container {
  padding: 24px;  /* 页面四周留白 */
}

.module-container .ant-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);  /* 卡片阴影 */
}
```

## 筛选区域设计规范（重要更新）

### 筛选区域规范
- 筛选区域的按钮必须右对齐
- 所有的筛选条件在一行，按钮在下一行，这样确保筛选框长度不影响布局
- 每个筛选框都有固定宽度，不会相互影响
- 按钮组独立成行，与筛选条件保持适当间距
- 使用 Space 组件确保按钮间距一致
- 筛选区域的background color是白色

### 1. 布局结构规范

**✅ 正确的筛选区域结构**
```jsx
// 使用Row/Col布局，确保响应式和对齐
<div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
  <Form form={form} onFinish={handleSearch}>
    {/* 第一行：筛选条件 */}
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={5}>
        <Form.Item name="code" label="编号">
          <Input placeholder="请输入编号" style={{ width: '100%' }} allowClear />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name="name" label="名称">
          <Input placeholder="请输入名称" style={{ width: '100%' }} allowClear />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name="type" label="类型">
          <Select placeholder="请选择类型" style={{ width: '100%' }} allowClear>
            <Option value="type1">类型1</Option>
            <Option value="type2">类型2</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
            <Option value="active">激活</Option>
            <Option value="inactive">停用</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={7} style={{ textAlign: 'right' }}>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Col>
    </Row>
    
    {/* 第二行：功能按钮 */}
    <Row gutter={16}>
      <Col span={24}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
          <Button icon={<UploadOutlined />}>
            批量导入
          </Button>
          <Button type="link" icon={<DownloadOutlined />}>
            下载模板
          </Button>
        </Space>
      </Col>
    </Row>
  </Form>
</div>
```

**❌ 错误的筛选区域结构**
```jsx
// 禁止：使用Card嵌套
<Card className="filter-card">  {/* ❌ 禁止在Tab内再嵌套Card */}
  <Form layout="inline">  {/* ❌ 禁止纯inline布局 */}
    <Form.Item style={{ width: 180 }}>  {/* ❌ 禁止随意设置宽度 */}
    <Form.Item style={{ width: 130 }}>  {/* ❌ 宽度不一致 */}
    <Divider />  {/* ❌ 禁止在表单内分割 */}
    <div style={{ textAlign: 'right' }}>  {/* ❌ 按钮不应该在表单内 */}
      <Button />
    </div>
  </Form>
</Card>
```

### 2. 列宽分配标准

**常用列宽分配方案：**
- **5项筛选+按钮**: `5-4-4-4-7` (总24)
- **4项筛选+按钮**: `6-4-4-4-6` (总24)
- **3项筛选+按钮**: `6-6-6-6` (总24)
- **2项筛选+按钮**: `8-8-8` (总24)

**筛选项宽度标准（组件内部width: 100%）：**
- 短文本输入框：Col span={4-5}
- 长文本输入框：Col span={6}
- 下拉选择框：Col span={4}
- 日期范围选择：Col span={6-7}
- 按钮区域：Col span={6-7}

### 3. 表单项组件规范

**输入框规范：**
```jsx
<Form.Item name="code" label="编号">
  <Input 
    placeholder="请输入编号" 
    style={{ width: '100%' }} 
    allowClear 
  />
</Form.Item>
```

**下拉选择规范：**
```jsx
<Form.Item name="type" label="类型">
  <Select 
    placeholder="请选择类型" 
    style={{ width: '100%' }} 
    allowClear
  >
    <Option value="value1">显示文本1</Option>
    <Option value="value2">显示文本2</Option>
  </Select>
</Form.Item>
```

**树形选择规范：**
```jsx
<Form.Item name="organization" label="组织">
  <TreeSelect
    style={{ width: '100%' }}
    placeholder="请选择组织"
    allowClear
    treeData={treeData}
    showSearch
    treeDefaultExpandAll
  />
</Form.Item>
```

### 4. 按钮区域规范

**查询按钮组：**
```jsx
<Col span={7} style={{ textAlign: 'right' }}>
  <Space>
    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
      查询
    </Button>
    <Button icon={<ReloadOutlined />} onClick={handleReset}>
      重置
    </Button>
  </Space>
</Col>
```

**功能按钮组：**
```jsx
<Col span={24}>
  <Space>
    <Button type="primary" icon={<PlusOutlined />}>
      新建
    </Button>
    <Button icon={<UploadOutlined />}>
      批量导入
    </Button>
    <Button type="link" icon={<DownloadOutlined />}>
      下载模板
    </Button>
    <Button icon={<ExportOutlined />}>
      导出
    </Button>
  </Space>
</Col>
```

## 页面结构层级规范（新增）

### 1. Tab页面结构限制

**最大嵌套层级：**
```
Container (div) 
  └── Card (唯一主容器)
      └── Tabs
          └── TabPane Content (直接组件，不再嵌套Card)
              ├── 筛选区域 (div + styles)
              ├── 功能按钮区 (div)
              └── 表格区域 (Table)
```

**✅ 正确的Tab内容组件：**
```jsx
const TabContentComponent = () => {
  return (
    <div>
      {/* 筛选区域 - 使用div+styles，不用Card */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form>...</Form>
      </div>
      
      {/* 功能按钮区 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button>新建</Button>
        </Space>
      </div>
      
      {/* 表格区域 */}
      <Table />
    </div>
  );
};
```

### 2. 禁止的嵌套结构

**❌ 禁止多层Card嵌套：**
```jsx
// 错误示例
<Card>
  <Tabs>
    <TabPane>
      <Card>  {/* ❌ 禁止 */}
        <Form>
          <Card>  {/* ❌ 禁止 */}
            ...
          </Card>
        </Form>
      </Card>
    </TabPane>
  </Tabs>
</Card>
```

## 按钮配色规范

### 按钮使用全局配色变量
```css
:root {
  --primary-color: #32AF50;        /* 主色调 - 绿色 */
  --primary-color-light: #4FC16A;  /* 主色调浅色 */
  --primary-color-dark: #278C3F;   /* 主色调深色 */
  --error-color: #f5222d;          /* 错误色 - 深红色 */
  --error-color-light: #ff7875;    /* 错误色浅色 - 浅红色 */
  --border-radius: 2px;            /* 统一圆角 */
}
```

### 按钮类型配色
1. **主要操作按钮**: `type="primary"` - 查询、新建、保存、确认等
2. **次要操作按钮**: 默认类型 - 重置、取消、关闭等
3. **危险操作按钮**: `type="primary" + danger` - 删除、清空等

### 表格操作按钮规范
```jsx
<Space size="small">
  <Button type="primary" size="small" icon={<EyeOutlined />}>
    查看
  </Button>
  <Button type="primary" size="small" icon={<EditOutlined />}>
    编辑
  </Button>
  <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
    删除
  </Button>
</Space>
```

### 按钮样式规范
```css
.container-class .ant-btn {
  border-radius: 2px;
}

.container-class .ant-btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.container-class .ant-btn-primary:hover {
  background-color: var(--primary-color-light);
  border-color: var(--primary-color-light);
}

/* 危险操作按钮样式 */
.container-class .ant-btn-primary.ant-btn-dangerous {
  background-color: var(--error-color);
  border-color: var(--error-color);
  color: #fff;
}

.container-class .ant-btn-primary.ant-btn-dangerous:hover {
  background-color: var(--error-color-light);
  border-color: var(--error-color-light);
  color: #fff;
}
```

## 表格规范

### 表格基础规范
- 表格列宽度：根据内容设置合适的宽度
- 表格操作列：固定在右侧，宽度合适
- 表格分页：默认每页10条
- 表格空数据：显示友好的提示

### 表格配置示例
```jsx
<Table
  columns={columns}
  dataSource={dataSource}
  rowKey="id"
  pagination={{
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
  }}
  scroll={{ x: 'max-content' }}
/>
```

## 响应式设计

### 栅格系统使用规范
- 采用栅格系统（Row/Col）实现响应式布局
- 表单项在不同屏幕尺寸下自适应调整
- 小屏幕下单列显示，大屏幕下多列显示
- 表格支持水平滚动（`scroll={{ x: 'max-content' }}`）

### 响应式断点
```jsx
// 大屏幕 (≥1200px)
<Col xxl={4} xl={6} lg={8} md={12} sm={24} xs={24}>

// 中屏幕 (≥992px)
<Col xxl={6} xl={8} lg={12} md={24} sm={24} xs={24}>

// 小屏幕 (<768px)
<Col span={24}>
```

## 导航规范
- 左侧导航栏为2级目录设计
- 每个打开的报表采用顶部tab
- tab可以任意切换或者关闭，支持一次关闭所有tab
- 切换tab页时不刷新页面

## 组件与模式

### 创建，编辑，查看功能使用弹窗，不要使用抽屉

### 按钮样式规则
- 所有按钮的css样式都需要包含 border-radius:2px;

#### 主要操作按钮，位置在页面右侧
```jsx
// 查询按钮
<Button 
  type="primary" 
  icon={<SearchOutlined />}
  htmlType="submit"
>
  查询
</Button>

// 新建按钮
<Button 
  type="primary" 
  icon={<PlusOutlined />}
>
  新建
</Button>
```

#### 次要操作按钮，与主要操作按钮位置一样
```jsx
// 重置按钮
<Button 
  icon={<ReloadOutlined />}
>
  重置
</Button>

// 返回按钮
<Button 
  icon={<ArrowLeftOutlined />}
>
  返回
</Button>
```

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

## 开发规范

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

## 设计规范检查清单

### 页面结构检查
- [ ] 是否只有一层Card包裹Tabs？
- [ ] Tab内容是否直接是组件，没有嵌套Card？
- [ ] 筛选区域是否使用Row/Col布局？
- [ ] 按钮区域是否独立成行？

### 筛选区域检查
- [ ] 是否使用标准列宽分配？
- [ ] Form.Item是否使用width: 100%？
- [ ] 是否有统一的placeholder文案？
- [ ] 查询重置按钮是否右对齐？

### 按钮样式检查
- [ ] 是否使用全局配色变量？
- [ ] 是否设置border-radius: 2px？
- [ ] 危险操作是否使用danger属性？
- [ ] 表格操作按钮是否使用size="small"？

### 响应式检查
- [ ] 是否使用Row/Col栅格系统？
- [ ] 表格是否支持水平滚动？
- [ ] 小屏幕下是否正常显示？

---

**版本说明：** v2.0 - 2025年1月，新增筛选区域规范和页面结构层级限制