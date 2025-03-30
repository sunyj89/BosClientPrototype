// 站点状态
export const STATION_STATUS = {
  ACTIVE: '正常',
  MAINTENANCE: '维护中',
  CLOSED: '关闭'
};

// 站点类型
export const STATION_TYPES = {
  STANDARD: '标准站',
  HIGHWAY: '高速站',
  COMMUNITY: '社区站',
  RURAL: '乡村站'
};

// 审批状态
export const APPROVAL_STATUS = {
  PENDING: '待审批',
  APPROVED: '已审批',
  REJECTED: '已拒绝'
};

// 设备状态
export const DEVICE_STATUS = {
  NORMAL: '正常',
  MAINTENANCE: '维护中',
  FAULT: '故障',
  OFFLINE: '离线'
};

// 员工角色
export const EMPLOYEE_ROLES = {
  MANAGER: '站长',
  ASSISTANT_MANAGER: '副站长',
  CASHIER: '收银员',
  OPERATOR: '加油员',
  SECURITY: '保安',
  CLEANER: '清洁工'
};

// 区域代码
export const REGION_CODES = {
  NORTH: '华北',
  EAST: '华东',
  SOUTH: '华南',
  CENTRAL: '华中',
  NORTHWEST: '西北',
  SOUTHWEST: '西南',
  NORTHEAST: '东北'
};

// 油品类型
export const OIL_TYPES = [
  '92#汽油',
  '95#汽油',
  '98#汽油',
  '0#柴油',
  '-10#柴油',
  '-20#柴油'
];

// 设备类型
export const EQUIPMENT_TYPES = {
  OIL_MACHINE: '加油机',
  POS: 'POS机',
  TANK: '油罐',
  CAMERA: '监控摄像头',
  AIR_MACHINE: '充气机',
  CAR_WASHER: '洗车机'
};

// 表单布局配置
export const FORM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

// 表单验证规则
export const VALIDATION_RULES = {
  required: { required: true, message: '此字段为必填项' },
  phone: { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
  email: { type: 'email', message: '请输入正确的邮箱格式' },
  number: { type: 'number', message: '请输入数字' }
};

// 表单验证规则(简写)
export const FORM_RULES = {
  required: { required: true, message: '此字段为必填项' },
  phone: { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
  email: { type: 'email', message: '请输入正确的邮箱格式' },
  number: { type: 'number', message: '请输入数字' }
};

// 审核抽屉配置
export const AUDIT_DRAWER_CONFIG = {
  width: 600,
  title: '审核站点信息',
  maskClosable: false,
  placement: 'right',
  footer: null
};

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条记录`,
  pageSizeOptions: ['10', '20', '30', '50']
};

// 站点表格列配置
export const STATION_TABLE_COLUMNS = [
  {
    title: '站点编号',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    fixed: 'left'
  },
  {
    title: '站点名称',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: '站点地址',
    dataIndex: 'address',
    key: 'address',
    width: 200
  },
  {
    title: '站点类型',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '区域',
    dataIndex: 'region',
    key: 'region',
    width: 100
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
    width: 100
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone',
    key: 'contactPhone',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '开业日期',
    dataIndex: 'openDate',
    key: 'openDate',
    width: 110
  },
  {
    title: '油罐数量',
    dataIndex: 'tankCount',
    key: 'tankCount',
    width: 100
  },
  {
    title: '加油机数量',
    dataIndex: 'pumpCount',
    key: 'pumpCount',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 240,
    fixed: 'right'
  }
]; 