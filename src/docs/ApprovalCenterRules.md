# 审批中心设计规范

## 1. 功能概述

审批中心是系统中统一处理各类审批事项的功能模块。它遵循"先提交申请，后台审批"的流程，确保数据变更的可追溯性和安全性。审批中心应满足以下特点：

- 集中展示所有待审批事项
- 支持批量和单个审批操作
- 提供筛选和分类功能
- 记录审批历史，支持追溯查询

## 2. 页面结构

### 2.1 Tab页结构

审批相关功能通常采用双Tab页设计：
- 第一个Tab：数据列表，显示已审核通过的数据
- 第二个Tab：审批中心，显示待审批的申请记录

```jsx
<Tabs activeKey={activeTabKey} onChange={setActiveTabKey} type="card" className="approval-tabs">
  <TabPane tab="数据列表" key="1">
    {renderDataListTab()}
  </TabPane>
  <TabPane 
    tab={
      <span>
        审批中心
        {pendingCount > 0 && <Badge count={pendingCount} style={{ marginLeft: 8 }} />}
      </span>
    } 
    key="2"
  >
    {renderApprovalCenterTab()}
  </TabPane>
</Tabs>
```

### 2.2 数据列表Tab

- 只显示已审批通过的记录
- 提供筛选、排序功能
- 操作按钮（新增、修改、删除）会触发审批流程

### 2.3 审批中心Tab

- 筛选区域：按申请类型（新增、修改、删除）筛选
- 批量操作区：展示选中数量，提供批量通过/拒绝按钮
- 数据表格：展示待审批记录，支持选择和单个审批操作

## 3. 数据模型

### 3.1 待审批记录基本字段

```javascript
{
  "id": "PA001",                                       // 审批记录ID
  "name": "记录名称",                                  // 业务数据名称
  "branchId": "B001",                                  // 所属分支机构ID
  "branchName": "分支机构名称",                        // 所属分支机构名称
  "status": "正常",                                    // 业务数据状态
  "createTime": "2023-07-15 09:30:22",                 // 数据创建时间
  "approvalStatus": "待审批",                          // 审批状态：待审批/已通过/已拒绝
  "approvalType": "create",                            // 审批类型：create/update/delete
  "submitter": "提交人",                               // 提交人
  "submitTime": "2023-10-12 14:30:45"                  // 提交时间
}
```

### 3.2 审批历史记录字段

```javascript
{
  "id": "AH001",                                       // 历史记录ID
  "recordId": "PA001",                                 // 关联的业务数据ID
  "operateUser": "审批人",                             // 审批操作人
  "operateType": "审批通过",                           // 操作类型：审批通过/审批拒绝
  "content": "审批意见内容",                           // 审批意见
  "time": "2023-09-15 14:30:45"                        // 审批时间
}
```

## 4. API接口规范

### 4.1 获取待审批记录接口

```javascript
// 获取待审批记录列表
export async function fetchPendingApprovals(params) {
  // params参数：
  // - approvalType: 审批类型筛选（create/update/delete）
  // - current: 当前页码
  // - pageSize: 每页条数
  // 返回格式：
  // {
  //   list: [], // 待审批记录列表
  //   total: 0, // 总记录数
  //   current: 1, // 当前页码
  //   pageSize: 10 // 每页条数
  // }
}
```

### 4.2 获取审批历史接口

```javascript
// 获取审批历史记录
export async function fetchApprovalHistory(params) {
  // params参数：
  // - recordId: 业务数据ID
  // - current: 当前页码
  // - pageSize: 每页条数
  // 返回格式同上
}
```

### 4.3 审批操作接口

```javascript
// 单个审批
export async function auditRecord(auditData) {
  // auditData参数：
  // - recordId: 审批记录ID
  // - result: 审批结果（approve/reject）
  // - comments: 审批意见
  // - operateUser: 审批人
  // - operateTime: 审批时间
}

// 批量审批
export async function batchAudit(batchData) {
  // batchData参数：
  // - ids: 审批记录ID数组
  // - result: 审批结果（approve/reject）
  // - comments: 审批意见
  // - operateUser: 审批人
  // - operateTime: 审批时间
}
```

## 5. 组件设计

### 5.1 审批中心Tab组件

```jsx
const renderApprovalCenterTab = () => {
  return (
    <div>
      {/* 筛选表单 */}
      <Form layout="inline" className="filter-form">
        <Form.Item name="approvalType" label="申请类型">
          <Select placeholder="请选择申请类型" allowClear>
            <Option value="create">新增</Option>
            <Option value="update">修改</Option>
            <Option value="delete">删除</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>筛选</Button>
            <Button icon={<ReloadOutlined />}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 批量操作 */}
      <div className="batch-actions">
        <Space>
          <span>已选择 {selectedRows.length} 项</span>
          <Button 
            type="primary" 
            icon={<CheckOutlined />}
            style={{ backgroundColor: '#32AF50', borderColor: '#32AF50' }}
          >
            批量通过
          </Button>
          <Button danger icon={<CloseOutlined />}>批量拒绝</Button>
        </Space>
      </div>

      {/* 待审批列表表格 */}
      <Table
        rowSelection={{...rowSelection}}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};
```

### 5.2 审批抽屉组件

审批抽屉是用于展示审批详情和提交审批意见的组件。

```jsx
<AuditDrawer
  open={visible}
  onClose={handleClose}
  onSuccess={handleSuccess}
  record={currentRecord}
/>
```

审批抽屉组件内部结构：
- 基本信息展示
- 审批历史展示
- 审批意见输入表单
- 底部操作按钮（通过/拒绝/取消）

## 6. 样式规范

### 6.1 审批中心Tab样式

```css
/* Tab标签样式 */
.approval-tabs .ant-tabs-nav {
  margin-bottom: 16px;
}

.approval-tabs .ant-tabs-tab {
  padding: 8px 16px;
}

.approval-tabs .ant-tabs-tab-active {
  font-weight: 500;
}

/* 筛选表单样式 */
.filter-form {
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}

/* 批量操作区样式 */
.batch-actions {
  padding: 12px 16px;
  background-color: #f0f7ff;
  border-radius: 4px;
  margin-bottom: 16px;
}

/* 表格头部样式 */
.approval-table .ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 500;
}

/* 选中行样式 */
.ant-table-row-selected > td {
  background-color: #e6f7ff;
}
```

### 6.2 审批状态标签样式

```jsx
// 审批状态颜色
const getApprovalStatusColor = (status) => {
  switch (status) {
    case '待审批': return '#faad14';  // 黄色
    case '已通过': return '#32AF50';  // 绿色
    case '已拒绝': return '#f5222d';  // 红色
    default: return '#d9d9d9';  // 灰色
  }
};

// 申请类型颜色
const getApprovalTypeColor = (type) => {
  switch (type) {
    case 'create': return 'green';
    case 'update': return 'blue';
    case 'delete': return 'red';
    default: return 'default';
  }
};
```

## 7. 交互规范

### 7.1 提交申请

当用户进行新增、修改、删除操作时：
1. 显示确认对话框
2. 用户确认后，提交审批申请
3. 提交成功后，自动切换到审批中心Tab
4. 更新待审批Badge计数

### 7.2 审批操作

单个审批：
1. 点击记录行的"审批"按钮
2. 打开审批抽屉，填写审批意见
3. 点击"通过"或"拒绝"按钮
4. 提交成功后，刷新审批列表，更新Badge计数

批量审批：
1. 勾选多条记录
2. 点击"批量通过"或"批量拒绝"按钮
3. 确认操作
4. 提交成功后，刷新审批列表，更新Badge计数

## 8. 最佳实践

### 8.1 模拟数据结构

为确保开发和测试的一致性，应创建标准的模拟数据结构：

```javascript
// src/mock/[模块名]/approvalData.json
{
  "pendingApprovals": [
    // 待审批记录数组
  ],
  "approvalHistory": [
    // 审批历史记录数组
  ]
}
```

### 8.2 状态管理

- 在组件初始化时获取待审批总数
- 在每次审批操作后更新待审批总数
- 切换Tab时重新加载相应数据

### 8.3 分页和筛选

- 筛选条件变更时重置页码为第一页
- 分页、筛选参数变更时重新加载数据
- 保持筛选条件和分页状态的独立性

## 9. 注意事项

1. 审批流程应确保数据的一致性和完整性
2. 审批历史应完整记录所有操作，便于追踪
3. 批量操作应有数量限制，防止性能问题
4. 应提供清晰的审批状态展示和数据变更预览
5. 操作按钮应设置适当的权限控制 