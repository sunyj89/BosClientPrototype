# API接口文档 - 安全卫士系统

**版本号**: v1.1  
**日期**: 2025年8月21日

## 1. 接口概述

### 1.1 接口架构
安全卫士系统提供三套API接口：
- **移动端API** (`/api/v1`) - 为移动APP提供巡检执行功能
- **后台管理API** (`/api/v1`) - 为Web管理后台提供配置和监控功能
- **Web接口** - 基础Web页面访问

### 1.2 认证机制
- **认证方式**: Session会话认证
- **认证中间件**: checkLogin
- **权限体系**: 平台级(≤2) → 集团级(=2) → 油站级(>2)
- **访问频率**: 移动端500次/分钟，后台100次/分钟

### 1.3 通用响应格式
```json
{
  "status": 200,           // 状态码: 200成功, 5000错误
  "info": "操作成功",      // 消息描述
  "data": {}              // 响应数据
}
```

### 1.4 分页参数
```json
{
  "page": 1,              // 页码，默认1
  "page_size": 20,        // 每页条数，最大限制见具体接口
  "total": 100,           // 总记录数
  "total_page": 5         // 总页数
}
```

## 2. 认证接口

### 2.1 移动端登录
**接口地址**: `POST /api/v1/user/login`  
**接口描述**: 移动APP用户登录认证

**请求参数**:
```json
{
  "username": "string",    // 必填，用户名
  "password": "string",    // 必填，密码
  "code": "string"        // 选填，验证码
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "登录成功",
  "data": {
    "user_id": "12345",
    "username": "inspector001",
    "real_name": "张三",
    "station_id": "100001",
    "station_name": "XX加油站",
    "authority": 3,
    "permissions": ["inspect", "upload"]
  }
}
```

### 2.2 移动端登出
**接口地址**: `POST /api/v1/user/logout`  
**接口描述**: 移动APP用户登出

**响应示例**:
```json
{
  "status": 200,
  "info": "登出成功",
  "data": null
}
```

### 2.3 后台管理员登录
**接口地址**: `POST /api/v1/admin/login`  
**接口描述**: Web后台管理员登录

**请求参数**:
```json
{
  "username": "string",    // 必填，管理员用户名
  "password": "string",    // 必填，密码
  "remember": "boolean",   // 选填，记住登录
  "code": "string"        // 选填，验证码
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "登录成功",
  "data": {
    "admin_id": "1001",
    "username": "admin",
    "real_name": "管理员",
    "authority": 1,
    "merchant_type": 0,
    "available_stations": ["100001", "100002"],
    "menu_permissions": ["inspect_config", "work_order", "archives"]
  }
}
```

### 2.4 后台管理员登出
**接口地址**: `POST /api/v1/admin/logout`  
**接口描述**: Web后台管理员登出，支持SSO单点登出

## 3. 移动端API接口

### 3.1 巡检管理接口

#### 3.1.1 获取巡检任务列表
**接口地址**: `GET /api/v1/appInspect/getList`  
**权限要求**: 登录用户  
**接口描述**: 获取当前用户的巡检任务列表

**请求参数**:
```json
{
  "type": "integer",       // 选填，巡检类型 1日检 2周检 3月检
  "start_date": "string",  // 选填，开始日期 YYYY-MM-DD
  "end_date": "string",    // 选填，结束日期 YYYY-MM-DD
  "page": "integer",       // 选填，页码 默认1
  "page_size": "integer"   // 选填，每页条数 最大100
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "list": [
      {
        "id": "20250821001",
        "type": 1,
        "type_name": "日检",
        "create_date": "20250821",
        "status": 0,
        "status_name": "未完成",
        "total_labels": 25,
        "completed_labels": 18,
        "exception_count": 2,
        "completion_rate": "72%"
      }
    ],
    "total": 10,
    "page": 1,
    "page_size": 20
  }
}
```

#### 3.1.2 获取巡检详情
**接口地址**: `GET /api/v1/appInspect/getDetail`  
**权限要求**: 登录用户  
**接口描述**: 获取指定巡检记录的详细信息

**请求参数**:
```json
{
  "id": "string",          // 必填，巡检记录ID
  "only_exception": "integer" // 选填，仅显示异常项 0否 1是
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "id": "20250821001",
    "type": 1,
    "create_date": "20250821",
    "status": 1,
    "point_positions": [
      {
        "id": "pos_001",
        "name": "加油机01号",
        "labels": [
          {
            "id": "label_001",
            "code": "10000001",
            "name": "压力表检查",
            "status": 1,
            "result": "正常",
            "pictures": ["http://xxx.com/img1.jpg"],
            "check_time": "2025-08-21 10:30:00"
          }
        ]
      }
    ]
  }
}
```

#### 3.1.3 扫码获取标签详情
**接口地址**: `GET /api/v1/appInspect/getLabelDetailByCode`  
**权限要求**: 登录用户  
**接口描述**: 通过扫描二维码获取标签巡检项目详情

**请求参数**:
```json
{
  "code": "string",        // 必填，标签二维码内容
  "type": "integer"        // 选填，巡检类型
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "label_id": "label_001",
    "code": "10000001",
    "name": "压力表检查点",
    "point_position": {
      "id": "pos_001",
      "name": "加油机01号",
      "location": "A区01号"
    },
    "inspect_items": [
      {
        "id": "item_001",
        "name": "压力读数检查",
        "description": "检查压力表读数是否在正常范围内",
        "feedback_type": 1,
        "feedback_options": [
          {"content": "正常", "is_exception": 0},
          {"content": "偏高", "is_exception": 1},
          {"content": "偏低", "is_exception": 1}
        ]
      }
    ]
  }
}
```

#### 3.1.4 保存巡检结果
**接口地址**: `POST /api/v1/appInspect/save`  
**权限要求**: 登录用户  
**接口描述**: 保存单个巡检项目的检查结果

**请求参数**:
```json
{
  "type": "integer",               // 必填，巡检类型
  "code": "string",               // 必填，标签编码
  "commit_type": "integer",       // 必填，提交类型
  "label_conf_id": "string",      // 必填，标签配置ID
  "commit_user_id": "string",     // 必填，提交用户ID
  "commit_user_name": "string",   // 必填，提交用户姓名
  "point_position_conf_id": "string", // 必填，点位配置ID
  "result_content": "string",     // 必填，检查结果内容JSON
  "result_status": "integer"      // 选填，结果状态 默认0
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "保存成功",
  "data": {
    "record_id": "rec_20250821_001",
    "save_time": "2025-08-21 10:35:00",
    "next_item": {
      "code": "10000002",
      "name": "下一个检查点"
    }
  }
}
```

#### 3.1.5 提交异常报告
**接口地址**: `POST /api/v1/appInspect/commitItemException`  
**权限要求**: 登录用户  
**接口描述**: 提交巡检项目异常，自动生成工单

**请求参数**:
```json
{
  "type": "integer",              // 必填，巡检类型
  "item_id": "string",           // 必填，巡检项目ID
  "result": "string",            // 必填，异常结果
  "content": "string",           // 必填，异常描述
  "picture": "array",            // 必填，异常照片URL数组
  "label_conf_id": "string",     // 必填，标签配置ID
  "label_conf_name": "string",   // 必填，标签配置名称
  "commit_user_id": "string",    // 必填，提交用户ID
  "commit_user_name": "string",  // 必填，提交用户姓名
  "inspect_item_conf_id": "string",     // 必填，巡检项配置ID
  "inspect_item_conf_name": "string",   // 必填，巡检项配置名称
  "point_position_conf_id": "string",   // 必填，点位配置ID
  "point_position_conf_name": "string"  // 必填，点位配置名称
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "异常提交成功，已自动生成工单",
  "data": {
    "exception_id": "exp_20250821_001",
    "work_order_id": "wo_20250821_001",
    "work_order_status": "待分配"
  }
}
```

#### 3.1.6 图片上传
**接口地址**: `POST /api/v1/appInspect/upload`  
**权限要求**: 登录用户  
**接口描述**: 上传巡检照片到云存储

**请求参数**:
- Content-Type: multipart/form-data
- 支持格式: jpg, png, jpeg, bmp
- 单次可上传多个文件

**响应示例**:
```json
{
  "status": 200,
  "info": "上传成功",
  "data": [
    "https://upyun.com/safeguard/20250821/img_001.jpg",
    "https://upyun.com/safeguard/20250821/img_002.jpg"
  ]
}
```

### 3.2 工单管理接口

#### 3.2.1 获取工单列表
**接口地址**: `GET /api/v1/appWorkOrder/getList`  
**权限要求**: 登录用户  
**接口描述**: 获取用户相关的工单列表

**请求参数**:
```json
{
  "type": "integer",       // 选填，工单类型
  "status": "integer",     // 选填，工单状态
  "start_date": "string",  // 选填，开始日期
  "end_date": "string",    // 选填，结束日期
  "page": "integer",       // 选填，页码
  "page_size": "integer"   // 选填，每页条数
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "list": [
      {
        "id": "wo_20250821_001",
        "title": "压力表异常",
        "type": "巡检异常",
        "status": 2,
        "status_name": "处理中",
        "priority": 1,
        "priority_name": "高",
        "create_time": "2025-08-21 10:35:00",
        "handle_user": "李四",
        "overdue_time": "2025-08-22 18:00:00"
      }
    ],
    "total": 5,
    "page": 1,
    "page_size": 20
  }
}
```

#### 3.2.2 工单分配
**接口地址**: `POST /api/v1/appWorkOrder/distribute`  
**权限要求**: 登录用户  
**接口描述**: 分配工单给指定处理人员

**请求参数**:
```json
{
  "id": "string",              // 必填，工单ID
  "handle_user_id": "string",  // 必填，处理人ID
  "handle_user_name": "string", // 必填，处理人姓名
  "overdue_time": "string"     // 选填，截止时间 YYYY-MM-DD HH:mm:ss
}
```

#### 3.2.3 工单处理
**接口地址**: `POST /api/v1/appWorkOrder/handleWorkOrder`  
**权限要求**: 登录用户  
**接口描述**: 接受或拒绝工单处理

**请求参数**:
```json
{
  "id": "string",         // 必填，工单ID
  "type": "integer",      // 必填，操作类型 1接受 2拒绝
  "message": "string"     // 选填，处理说明
}
```

#### 3.2.4 工单审核
**接口地址**: `POST /api/v1/appWorkOrder/auditWorkOrder`  
**权限要求**: 登录用户  
**接口描述**: 审核工单处理结果

**请求参数**:
```json
{
  "id": "string",                  // 必填，工单ID
  "type": "integer",               // 必填，审核结果 1通过 2退回
  "remark": "string",              // 选填，审核意见
  "transfer_user_id": "string",    // 选填，转派用户ID
  "transfer_user_name": "string"   // 选填，转派用户姓名
}
```

## 4. 后台管理API接口

### 4.1 系统管理接口

#### 4.1.1 获取用户列表
**接口地址**: `GET /api/v1/admin/getUserListName`  
**权限要求**: 管理员登录  
**接口描述**: 获取当前管理范围内的用户列表

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": [
    {
      "id": "1001",
      "username": "inspector001",
      "real_name": "张三",
      "station_name": "XX加油站"
    }
  ]
}
```

#### 4.1.2 切换操作站点
**接口地址**: `POST /api/v1/Ostn/switchOstn`  
**权限要求**: 管理员登录  
**接口描述**: 切换当前操作的站点上下文

**请求参数**:
```json
{
  "ostn_id": "string",     // 必填，目标站点ID
  "merchant_type": "integer", // 必填，商户类型
  "merchant_id": "string"  // 必填，商户ID
}
```

#### 4.1.3 修改密码
**接口地址**: `POST /api/v1/admin/changePwd`  
**权限要求**: 管理员登录  
**接口描述**: 修改用户密码

**请求参数**:
```json
{
  "adid": "string",        // 必填，用户ID
  "new_pwd": "string",     // 必填，新密码（最少10位，包含大小写字母数字）
  "orig_pwd": "string"     // 必填，原密码
}
```

### 4.2 巡检模板管理

#### 4.2.1 获取模板库列表
**接口地址**: `GET /api/v1/inspectTemplate/getList`  
**权限要求**: 管理员登录  
**接口描述**: 获取巡检模板库列表

**请求参数**:
```json
{
  "authority": "integer",  // 选填，权限级别 0平台 2集团
  "name": "string",        // 选填，模板名称搜索
  "page": "integer",       // 选填，页码
  "page_size": "integer"   // 选填，每页条数，最大1000
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "list": [
      {
        "id": "tpl_001",
        "name": "日常巡检模板",
        "authority": 0,
        "authority_name": "平台级",
        "create_time": "2025-08-21 09:00:00",
        "creator": "系统管理员",
        "usage_count": 15
      }
    ],
    "total": 8,
    "page": 1,
    "page_size": 50
  }
}
```

#### 4.2.2 保存巡检模板
**接口地址**: `POST /api/v1/inspectTemplate/save`  
**权限要求**: 管理员登录（油站用户无权限）  
**接口描述**: 创建或更新巡检模板

**请求参数**:
```json
{
  "id": "string",          // 选填，模板ID（更新时提供）
  "name": "string",        // 必填，模板名称
  "feedback": "string",    // 必填，模板配置JSON字符串
  "remark": "string"       // 选填，模板说明
}
```

**模板配置JSON格式示例**:
```json
[
  {
    "name": "压力检查",
    "description": "检查设备压力是否正常",
    "feedback_type": 1,
    "content": [
      {"cnt": "正常", "is_exp": 0},
      {"cnt": "偏高", "is_exp": 1},
      {"cnt": "偏低", "is_exp": 1}
    ]
  }
]
```

### 4.3 标签配置管理

#### 4.3.1 获取标签列表
**接口地址**: `GET /api/v1/inspectLabel/getList`  
**权限要求**: 管理员登录  
**接口描述**: 获取当前站点的标签配置列表

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "list": [
      {
        "id": "label_001",
        "code": "10000001",
        "name": "01号加油机压力表",
        "point_position": "A区01号位置",
        "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
        "status": 1,
        "create_time": "2025-08-21 08:00:00"
      }
    ]
  }
}
```

#### 4.3.2 保存标签配置
**接口地址**: `POST /api/v1/inspectLabel/save`  
**权限要求**: 油站或集团管理员（平台用户无权限）  
**接口描述**: 创建或更新标签配置

**请求参数**:
```json
{
  "id": "string",                  // 选填，标签ID（更新时提供）
  "code": "string",               // 必填，8位数字标签编码
  "name": "string",               // 必填，标签名称
  "point_position_conf_id": "string", // 必填，关联点位ID
  "remark": "string"              // 选填，标签说明
}
```

#### 4.3.3 导入标签配置
**接口地址**: `POST /api/v1/inspectLabel/import`  
**权限要求**: 管理员登录  
**接口描述**: 批量导入标签配置

**请求参数**:
- Content-Type: multipart/form-data
- 文件格式: Excel (.xlsx)

### 4.4 工单管理（后台）

#### 4.4.1 获取工单列表
**接口地址**: `GET /api/v1/workOrder/getList`  
**权限要求**: 管理员登录  
**接口描述**: 获取工单管理列表

**请求参数**:
```json
{
  "station_id": "string",     // 选填，油站筛选
  "type": "integer",          // 选填，工单类型
  "status": "integer",        // 选填，工单状态
  "start_date": "string",     // 选填，开始日期
  "end_date": "string",       // 选填，结束日期
  "create_user": "string",    // 选填，创建人
  "handle_user": "string",    // 选填，处理人
  "page": "integer",          // 选填，页码
  "page_size": "integer"      // 选填，每页条数
}
```

### 4.5 档案管理接口

#### 4.5.1 浏览档案目录
**接口地址**: `GET /api/v1/archives/explore`  
**权限要求**: 油站用户登录  
**接口描述**: 浏览文件档案系统目录结构

**请求参数**:
```json
{
  "folder_id": "string"    // 选填，文件夹ID，默认0为根目录
}
```

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "current_folder": {
      "id": "0",
      "name": "根目录",
      "path": "/"
    },
    "folders": [
      {
        "id": "folder_001",
        "name": "巡检报告",
        "create_time": "2025-08-21 08:00:00",
        "file_count": 25
      }
    ],
    "files": [
      {
        "id": "file_001",
        "name": "2025年8月巡检报告.pdf",
        "size": "2.5MB",
        "type": "application/pdf",
        "upload_time": "2025-08-21 10:00:00",
        "uploader": "张三"
      }
    ]
  }
}
```

#### 4.5.2 上传文件
**接口地址**: `POST /api/v1/archives/upload`  
**权限要求**: 油站用户登录  
**接口描述**: 上传文件到档案系统

**请求参数**:
- Content-Type: multipart/form-data
- folder_id: 目标文件夹ID

#### 4.5.3 文件操作
**文件重命名**: `POST /api/v1/archives/renameFile`  
**删除文件**: `POST /api/v1/archives/deleteFile`  
**获取下载链接**: `POST /api/v1/archives/getDownloadLink`

### 4.6 数据统计接口

#### 4.6.1 首页统计信息
**接口地址**: `GET /api/v1/home/showInfo`  
**权限要求**: 管理员登录  
**接口描述**: 获取首页仪表板统计数据

**响应示例**:
```json
{
  "status": 200,
  "info": "获取成功",
  "data": {
    "today_inspect": {
      "total": 50,
      "completed": 35,
      "completion_rate": "70%"
    },
    "exception_summary": {
      "today": 3,
      "this_week": 15,
      "this_month": 42
    },
    "work_order_summary": {
      "pending": 5,
      "processing": 8,
      "completed_today": 12
    }
  }
}
```

#### 4.6.2 导出巡检记录
**接口地址**: `GET /api/v1/inspectRecord/export`  
**权限要求**: 管理员登录  
**接口描述**: 导出巡检记录为Excel文件

**请求参数**:
```json
{
  "start_date": "string",     // 必填，开始日期
  "end_date": "string",       // 必填，结束日期
  "station_ids": "array",     // 选填，站点ID数组
  "type": "integer"           // 选填，巡检类型
}
```

## 5. 错误码说明

| 状态码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 操作成功 | 正常处理 |
| 302 | 需要登录 | 跳转到登录页面 |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 403 | 权限不足 | 提示用户权限不足 |
| 404 | 资源不存在 | 检查资源ID是否正确 |
| 5000 | 业务逻辑错误 | 根据info字段提示用户 |
| 5001 | 数据验证失败 | 检查必填字段和格式 |
| 5002 | 数据库操作失败 | 联系系统管理员 |

## 6. 接口调用示例

### 6.1 JavaScript调用示例

```javascript
// 登录接口调用
async function login(username, password) {
  try {
    const response = await fetch('/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    const result = await response.json();
    if (result.status === 200) {
      // 登录成功，保存用户信息
      localStorage.setItem('user_info', JSON.stringify(result.data));
      return result.data;
    } else {
      throw new Error(result.info);
    }
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

// 获取巡检列表
async function getInspectList(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`/api/v1/appInspect/getList?${queryString}`, {
    method: 'GET',
    credentials: 'include' // 包含session cookie
  });
  
  return await response.json();
}

// 上传图片
async function uploadImages(files) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files[]', file);
  });
  
  const response = await fetch('/api/v1/appInspect/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  
  return await response.json();
}
```

### 6.2 移动端集成示例

```javascript
// 移动端API工具类
class SafeGuardAPI {
  constructor(baseURL = '/api/v1') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  // 扫码获取标签信息
  async getLabelByCode(code, type) {
    return await this.request('GET', '/appInspect/getLabelDetailByCode', {
      code: code,
      type: type
    });
  }

  // 保存巡检结果
  async saveInspectResult(data) {
    return await this.request('POST', '/appInspect/save', data);
  }

  // 提交异常
  async submitException(data) {
    return await this.request('POST', '/appInspect/commitItemException', data);
  }

  // 统一请求方法
  async request(method, endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (method === 'GET' && data) {
      const queryString = new URLSearchParams(data).toString();
      url += `?${queryString}`;
    } else if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (result.status !== 200) {
        throw new Error(result.info || '请求失败');
      }
      
      return result;
    } catch (error) {
      console.error(`API请求失败: ${method} ${endpoint}`, error);
      throw error;
    }
  }
}
```

---

*文档版本：v1.1*  
*创建日期：2025年8月21日*  
*文档状态：已完成*