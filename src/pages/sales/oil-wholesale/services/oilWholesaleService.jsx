// 油品批发管理服务层 - Mock数据版本
// 使用本地Mock数据模拟API接口

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 参考设计文件的完整Mock数据结构
const mockData = {
  "orderNotifications": [
    {
      "id": "ORDER001",
      "orderNumber": "DH202501250001",
      "orderDate": "2025-01-25",
      "orderingCompany": "江西交投化石能源公司赣中分公司",
      "oilType": "92#汽油",
      "quantityTons": 10.5,
      "requiredDeliveryDate": "2025-01-27",
      "deliveryAddress": "江西省南昌市赣中北服务区加油站A区卸油点",
      "receiverName": "李站长",
      "contactPhone": "13800138001",
      "idCardNumber": "360103198512251234",
      "attachments": [
        { "name": "订货通知单.pdf", "url": "/uploads/order-notice-001.pdf" },
        { "name": "询价函.pdf", "url": "/uploads/inquiry-letter-001.pdf" }
      ],
      "orderStatus": "pending_delivery",
      "createTime": "2025-01-25 09:30:00",
      "creator": "张经理",
      "approver": "李总监",
      "approvalTime": "2025-01-25 10:15:00"
    },
    {
      "id": "ORDER002",
      "orderNumber": "DH202501250002",
      "orderDate": "2025-01-25",
      "orderingCompany": "江西交投化石能源公司赣中分公司",
      "oilType": "95#汽油",
      "quantityTons": 15.2,
      "requiredDeliveryDate": "2025-01-28",
      "deliveryAddress": "江西省南昌市赣中南服务区加油站A区卸油点",
      "receiverName": "张站长",
      "contactPhone": "13800138002",
      "idCardNumber": "360103198610152567",
      "attachments": [
        { "name": "订货通知单.pdf", "url": "/uploads/order-notice-002.pdf" },
        { "name": "询价函.pdf", "url": "/uploads/inquiry-letter-002.pdf" }
      ],
      "orderStatus": "delivered",
      "createTime": "2025-01-25 10:45:00",
      "creator": "王经理",
      "approver": "赵总监",
      "approvalTime": "2025-01-25 11:30:00"
    },
    {
      "id": "ORDER003",
      "orderNumber": "DH202501240001",
      "orderDate": "2025-01-24",
      "orderingCompany": "江西交投化石能源公司赣东北分公司",
      "oilType": "0#柴油",
      "quantityTons": 25.8,
      "requiredDeliveryDate": "2025-01-26",
      "deliveryAddress": "江西省上饶市赣东北东服务区加油站A区卸油点",
      "receiverName": "刘站长",
      "contactPhone": "13800138003",
      "idCardNumber": "361125198803201890",
      "attachments": [
        { "name": "订货通知单.pdf", "url": "/uploads/order-notice-003.pdf" },
        { "name": "询价函.pdf", "url": "/uploads/inquiry-letter-003.pdf" }
      ],
      "orderStatus": "completed",
      "createTime": "2025-01-24 14:20:00",
      "creator": "陈经理",
      "approver": "刘总监",
      "approvalTime": "2025-01-24 15:05:00"
    }
  ],
  "receiptConfirmations": [
    {
      "id": "RECEIPT001",
      "receiptNumber": "SH202501270001",
      "relatedOrderId": "ORDER002",
      "relatedOrderNumber": "DH202501250002",
      "supplierId": "SUP002",
      "supplierName": "中石油江西销售公司",
      "quotationId": "QUO202501250001",
      "quotationNumber": "BJD202501250001",
      "arrivalTime": "2025-01-27 14:30:00",
      "actualWeightKg": 12650,
      "weighingSlips": [
        { "name": "过磅单1.jpg", "url": "/uploads/weighing-slip-001-1.jpg" },
        { "name": "过磅单2.jpg", "url": "/uploads/weighing-slip-001-2.jpg" }
      ],
      "oilType": "95#汽油",
      "orderedQuantityTons": 15.2,
      "actualQuantityTons": 12.65,
      "varianceTons": -2.55,
      "varianceReason": "运输损耗和密度差异",
      "receiptStatus": "confirmed",
      "receiver": "李收货员",
      "receiverId": "REC001",
      "createTime": "2025-01-27 15:00:00",
      "confirmTime": "2025-01-27 16:30:00",
      "remarks": "油品质量合格，温度正常，密度符合标准",
      // 兼容旧字段
      "orderNumber": "DH202501250002",
      "orderId": "ORDER002",
      "deliveryDate": "2025-01-27",
      "receiptDate": "2025-01-27 14:30:00",
      "orderedQuantity": 15200,
      "actualQuantity": 12650,
      "variance": -2550,
      "varianceRate": -16.78,
      "totalAmount": 102352.50,
      "station": "赣中南加油站A",
      "unitPrice": 8.09,
      "temperature": 15.5,
      "density": 0.725,
      "qualityReport": "合格",
      "tankNumber": "2号罐",
      "inspector": "张质检员",
      "inspectorId": "INS001",
      "driver": "王司机",
      "driverId": "DRV001",
      "vehicleNumber": "赣A12345",
      "photos": ["/images/receipt/photo1.jpg", "/images/receipt/photo2.jpg"],
      "documents": ["/docs/receipt/quality-report-001.pdf"]
    },
    {
      "id": "RECEIPT002",
      "receiptNumber": "SH202501260001",
      "relatedOrderId": "ORDER003",
      "relatedOrderNumber": "DH202501240001",
      "supplierId": "SUP003",
      "supplierName": "中海油江西分公司",
      "quotationId": "QUO202501240001",
      "quotationNumber": "BJD202501240001",
      "arrivalTime": "2025-01-26 16:45:00",
      "actualWeightKg": 25800,
      "weighingSlips": [
        { "name": "过磅单1.jpg", "url": "/uploads/weighing-slip-002-1.jpg" }
      ],
      "oilType": "0#柴油",
      "orderedQuantityTons": 25.8,
      "actualQuantityTons": 25.8,
      "varianceTons": 0,
      "varianceReason": "无差异",
      "receiptStatus": "confirmed",
      "receiver": "刘收货员",
      "receiverId": "REC002",
      "createTime": "2025-01-26 17:00:00",
      "confirmTime": "2025-01-26 17:30:00",
      "remarks": "收货正常，无异常",
      // 兼容旧字段
      "orderNumber": "DH202501240001",
      "orderId": "ORDER003",
      "deliveryDate": "2025-01-26",
      "receiptDate": "2025-01-26 16:45:00",
      "orderedQuantity": 25800,
      "actualQuantity": 25800,
      "variance": 0,
      "varianceRate": 0,
      "totalAmount": 183470.00,
      "station": "赣东北东加油站A",
      "unitPrice": 7.115,
      "temperature": 12.8,
      "density": 0.832,
      "qualityReport": "合格",
      "tankNumber": "1号罐",
      "inspector": "赵质检员",
      "inspectorId": "INS002",
      "driver": "孙司机",
      "driverId": "DRV002",
      "vehicleNumber": "赣B67890",
      "photos": ["/images/receipt/photo3.jpg"],
      "documents": ["/docs/receipt/quality-report-002.pdf"]
    },
    {
      "id": "RECEIPT003",
      "receiptNumber": "SH202501280001",
      "relatedOrderId": "ORDER001",
      "relatedOrderNumber": "DH202501250001",
      "supplierId": "SUP001",
      "supplierName": "中石化江西分公司",
      "quotationId": "QUO202501250002",
      "quotationNumber": "BJD202501250002",
      "arrivalTime": "2025-01-28 09:15:00",
      "actualWeightKg": 10680,
      "weighingSlips": [
        { "name": "过磅单1.jpg", "url": "/uploads/weighing-slip-003-1.jpg" },
        { "name": "过磅单2.jpg", "url": "/uploads/weighing-slip-003-2.jpg" }
      ],
      "oilType": "92#汽油",
      "orderedQuantityTons": 10.5,
      "actualQuantityTons": 10.68,
      "varianceTons": 0.18,
      "varianceReason": "温度补偿",
      "receiptStatus": "pending",
      "receiver": "陈收货员",
      "receiverId": "REC003",
      "createTime": "2025-01-28 09:30:00",
      "confirmTime": null,
      "remarks": "待质检员确认",
      // 兼容旧字段
      "orderNumber": "DH202501250001",
      "orderId": "ORDER001",
      "deliveryDate": "2025-01-28",
      "receiptDate": "2025-01-28 09:15:00",
      "orderedQuantity": 10500,
      "actualQuantity": 10680,
      "variance": 180,
      "varianceRate": 1.71,
      "totalAmount": 76255.20,
      "station": "赣中北加油站A",
      "unitPrice": 7.14,
      "temperature": 18.2,
      "density": 0.730,
      "qualityReport": "待检测",
      "tankNumber": "3号罐",
      "inspector": "黄质检员",
      "inspectorId": "INS003",
      "driver": "李司机",
      "driverId": "DRV003",
      "vehicleNumber": "赣C54321",
      "photos": [],
      "documents": []
    }
  ],
  "modificationRecords": [
    {
      "id": "LOG001",
      "targetId": "ORDER001",
      "targetName": "订货通知单 DH202501250001",
      "changeType": "update",
      "changeField": "配送日期",
      "changeDescription": "配送日期从2025-01-26调整为2025-01-27",
      "operator": "张经理",
      "operatorId": "MGR001",
      "changeTime": "2025-01-25 15:20:00",
      "approver": "李总监",
      "status": "approved",
      "oldValue": { "deliveryDate": "2025-01-26" },
      "newValue": { "deliveryDate": "2025-01-27" },
      "reason": "供应商要求调整配送时间"
    },
    {
      "id": "LOG002",
      "targetId": "RECEIPT001",
      "targetName": "收货确认单 SH202501270001",
      "changeType": "update",
      "changeField": "实际收货数量",
      "changeDescription": "实际收货数量从18000L调整为17950L",
      "operator": "李收货员",
      "operatorId": "REC001",
      "changeTime": "2025-01-27 14:45:00",
      "approver": "王主管",
      "status": "approved",
      "oldValue": { "actualQuantity": 18000 },
      "newValue": { "actualQuantity": 17950 },
      "reason": "实际测量后发现数量差异"
    },
    {
      "id": "LOG003",
      "targetId": "ORDER002",
      "targetName": "订货通知单 DH202501250002",
      "changeType": "create",
      "changeField": "订单创建",
      "changeDescription": "创建新的油品批发订货通知单",
      "operator": "王经理",
      "operatorId": "MGR002",
      "changeTime": "2025-01-25 10:45:00",
      "approver": "赵总监",
      "status": "approved",
      "oldValue": null,
      "newValue": {
        "orderNumber": "DH202501250002",
        "supplierName": "中石油江西销售公司",
        "oilType": "95#汽油",
        "quantity": 18000,
        "totalAmount": 1456200.00
      },
      "reason": "业务需求新建订单"
    }
  ],
  "statistics": {
    "totalOrders": 3,
    "pendingOrders": 1,
    "deliveredOrders": 1,
    "completedOrders": 1,
    "totalReceipts": 3,
    "confirmedReceipts": 2,
    "pendingReceipts": 1
  }
};

/**
 * 订货通知单管理接口
 */
export const orderService = {
  // 获取订货通知单列表
  async getOrderList(params = {}) {
    await delay(300);
    let orders = [...mockData.orderNotifications];
    
    // 模拟筛选
    if (params.orderingCompany) {
      orders = orders.filter(order => order.orderingCompany.includes(params.orderingCompany));
    }
    if (params.oilType) {
      orders = orders.filter(order => order.oilType === params.oilType);
    }
    if (params.orderStatus) {
      orders = orders.filter(order => order.orderStatus === params.orderStatus);
    }
    if (params.startDate && params.endDate) {
      orders = orders.filter(order => order.orderDate >= params.startDate && order.orderDate <= params.endDate);
    }
    
    // 模拟分页
    const total = orders.length;
    const current = params.current || 1;
    const pageSize = params.pageSize || 10;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: orders.slice(start, end),
      total,
      current,
      pageSize,
      success: true
    };
  },

  // 获取订货通知单详情
  async getOrderDetail(orderId) {
    await delay(200);
    const order = mockData.orderNotifications.find(item => item.id === orderId);
    if (!order) {
      throw new Error('订货通知单不存在');
    }
    return { data: order, success: true };
  },

  // 创建订货通知单
  async createOrder(data) {
    await delay(500);
    const newOrder = {
      id: `ORDER${Date.now()}`,
      orderNumber: `DH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(mockData.orderNotifications.length + 1).padStart(4, '0')}`,
      createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      orderStatus: 'pending_delivery',
      ...data
    };
    return { data: newOrder, success: true };
  },

  // 更新订货通知单
  async updateOrder(orderId, data) {
    await delay(400);
    const order = mockData.orderNotifications.find(item => item.id === orderId);
    if (!order) {
      throw new Error('订货通知单不存在');
    }
    return { data: { ...order, ...data }, success: true };
  },

  // 删除订货通知单
  async deleteOrder(orderId) {
    await delay(300);
    return { success: true, message: '删除成功' };
  },

  // 批量删除订货通知单
  async batchDeleteOrders(orderIds) {
    await delay(500);
    return { success: true, message: `成功删除${orderIds.length}条记录` };
  },

  // 上传订货通知单附件
  async uploadOrderAttachment(file) {
    await delay(1000);
    return {
      data: {
        name: file.name,
        url: `/uploads/order-attachment-${Date.now()}.${file.name.split('.').pop()}`
      },
      success: true
    };
  }
};

/**
 * 收货确认单管理接口
 */
export const receiptService = {
  // 获取收货确认单列表
  async getReceiptList(params = {}) {
    await delay(300);
    let receipts = [...mockData.receiptConfirmations];
    
    // 模拟筛选
    if (params.supplierName) {
      receipts = receipts.filter(receipt => receipt.supplierName.includes(params.supplierName));
    }
    if (params.oilType) {
      receipts = receipts.filter(receipt => receipt.oilType === params.oilType);
    }
    if (params.receiptStatus) {
      receipts = receipts.filter(receipt => receipt.receiptStatus === params.receiptStatus);
    }
    if (params.startDate && params.endDate) {
      receipts = receipts.filter(receipt => receipt.deliveryDate >= params.startDate && receipt.deliveryDate <= params.endDate);
    }
    
    // 模拟分页
    const total = receipts.length;
    const current = params.current || 1;
    const pageSize = params.pageSize || 10;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: receipts.slice(start, end),
      total,
      current,
      pageSize,
      success: true
    };
  },

  // 获取收货确认单详情
  async getReceiptDetail(receiptId) {
    await delay(200);
    const receipt = mockData.receiptConfirmations.find(item => item.id === receiptId);
    if (!receipt) {
      throw new Error('收货确认单不存在');
    }
    return { data: receipt, success: true };
  },

  // 创建收货确认单
  async createReceipt(data) {
    await delay(500);
    const newReceipt = {
      id: `RECEIPT${Date.now()}`,
      receiptNumber: `SH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(mockData.receiptConfirmations.length + 1).padStart(4, '0')}`,
      receiptDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      receiptStatus: 'pending',
      ...data
    };
    return { data: newReceipt, success: true };
  },

  // 更新收货确认单
  async updateReceipt(receiptId, data) {
    await delay(400);
    const receipt = mockData.receiptConfirmations.find(item => item.id === receiptId);
    if (!receipt) {
      throw new Error('收货确认单不存在');
    }
    return { data: { ...receipt, ...data }, success: true };
  },

  // 删除收货确认单
  async deleteReceipt(receiptId) {
    await delay(300);
    return { success: true, message: '删除成功' };
  },

  // 确认收货
  async confirmReceipt(receiptId) {
    await delay(400);
    return { success: true, message: '收货确认成功' };
  },

  // 批量确认收货
  async batchConfirmReceipts(receiptIds) {
    await delay(600);
    return { success: true, message: `成功确认${receiptIds.length}条记录` };
  },

  // 上传过磅单图片
  async uploadWeighingSlip(file) {
    await delay(1500);
    return {
      data: {
        name: file.name,
        url: `/uploads/weighing-slip-${Date.now()}.${file.name.split('.').pop()}`
      },
      success: true
    };
  }
};

/**
 * 修改记录管理接口
 */
export const recordService = {
  // 获取修改记录列表
  async getModificationRecords(params = {}) {
    await delay(300);
    let records = [...mockData.modificationRecords];
    
    // 模拟筛选
    if (params.targetName) {
      records = records.filter(record => record.targetName.includes(params.targetName));
    }
    if (params.changeType) {
      records = records.filter(record => record.changeType === params.changeType);
    }
    if (params.operator) {
      records = records.filter(record => record.operator.includes(params.operator));
    }
    if (params.startDate && params.endDate) {
      records = records.filter(record => {
        const changeDate = record.changeTime.split(' ')[0];
        return changeDate >= params.startDate && changeDate <= params.endDate;
      });
    }
    
    // 模拟分页
    const total = records.length;
    const current = params.current || 1;
    const pageSize = params.pageSize || 10;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: records.slice(start, end),
      total,
      current,
      pageSize,
      success: true
    };
  },

  // 获取修改记录详情
  async getRecordDetail(recordId) {
    await delay(200);
    const record = mockData.modificationRecords.find(item => item.id === recordId);
    if (!record) {
      throw new Error('修改记录不存在');
    }
    return { data: record, success: true };
  },

  // 导出修改记录
  async exportRecords(params = {}) {
    await delay(2000);
    const blob = new Blob(['模拟导出的修改记录数据'], { type: 'application/vnd.ms-excel' });
    return { data: blob, success: true };
  },

  // 清空修改记录
  async clearRecords(params = {}) {
    await delay(1000);
    return { success: true, message: '清空记录成功' };
  }
};

/**
 * 基础数据接口
 */
export const baseDataService = {
  // 获取订货单位列表
  async getOrderingCompanies() {
    await delay(200);
    const companies = [...new Set(mockData.orderNotifications.map(order => order.orderingCompany))];
    return {
      data: companies.map(name => ({ id: name, name })),
      success: true
    };
  },

  // 获取油品类型列表
  async getOilTypes() {
    await delay(200);
    const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油', '尿素'];
    return {
      data: oilTypes.map(type => ({ id: type, name: type })),
      success: true
    };
  },

  // 获取供应商列表
  async getSuppliers() {
    await delay(200);
    const suppliers = [...new Set(mockData.receiptConfirmations.map(receipt => receipt.supplierName))];
    return {
      data: suppliers.map(name => ({ id: name, name })),
      success: true
    };
  },

  // 获取报价单列表
  async getQuotations(params = {}) {
    await delay(300);
    const quotations = [
      { id: 'Q001', supplierName: '中石化江西分公司', oilType: '92#汽油', unitPrice: 7.14, effectiveDate: '2025-01-25', expiryDate: '2025-02-25' },
      { id: 'Q002', supplierName: '中石油江西销售公司', oilType: '95#汽油', unitPrice: 8.09, effectiveDate: '2025-01-25', expiryDate: '2025-02-25' },
      { id: 'Q003', supplierName: '中海油江西分公司', oilType: '0#柴油', unitPrice: 7.115, effectiveDate: '2025-01-25', expiryDate: '2025-02-25' },
      { id: 'Q004', supplierName: '中石化江西分公司', oilType: '98#汽油', unitPrice: 9.17, effectiveDate: '2025-01-25', expiryDate: '2025-02-25' }
    ];
    return { data: quotations, success: true };
  }
};

/**
 * 统计分析接口
 */
export const statisticsService = {
  // 获取订货统计数据
  async getOrderStatistics(params = {}) {
    await delay(400);
    return {
      data: {
        ...mockData.statistics,
        monthlyOrderTrend: mockData.statistics.monthlyOrderTrend,
        companyStats: mockData.statistics.companyStats,
        oilTypeStats: mockData.statistics.oilTypeStats
      },
      success: true
    };
  },

  // 获取收货统计数据
  async getReceiptStatistics(params = {}) {
    await delay(400);
    const receipts = mockData.receiptConfirmations;
    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);
    const avgVarianceRate = receipts.reduce((sum, receipt) => sum + Math.abs(receipt.varianceRate), 0) / receipts.length;
    
    return {
      data: {
        totalReceipts: receipts.length,
        confirmedReceipts: receipts.filter(r => r.receiptStatus === 'confirmed').length,
        pendingReceipts: receipts.filter(r => r.receiptStatus === 'pending').length,
        totalAmount: totalAmount,
        avgVarianceRate: avgVarianceRate.toFixed(2)
      },
      success: true
    };
  },

  // 获取差异分析数据
  async getVarianceAnalysis(params = {}) {
    await delay(400);
    const receipts = mockData.receiptConfirmations;
    const varianceData = receipts.map(receipt => ({
      receiptNumber: receipt.receiptNumber,
      oilType: receipt.oilType,
      orderedQuantity: receipt.orderedQuantity,
      actualQuantity: receipt.actualQuantity,
      variance: receipt.variance,
      varianceRate: receipt.varianceRate,
      varianceReason: receipt.varianceReason,
      station: receipt.station
    }));
    
    return {
      data: varianceData,
      success: true
    };
  }
};

/**
 * 数据导入导出接口
 */
export const importExportService = {
  // 批量导入订货通知单
  async importOrders(file) {
    await delay(2000);
    return {
      data: {
        successCount: 5,
        failureCount: 1,
        totalCount: 6,
        errors: ['第3行：订货单位不能为空']
      },
      success: true
    };
  },

  // 导出订货通知单数据
  async exportOrders(params = {}) {
    await delay(1500);
    const blob = new Blob(['模拟导出的订货通知单数据'], { type: 'application/vnd.ms-excel' });
    return { data: blob, success: true };
  },

  // 导出收货确认单数据
  async exportReceipts(params = {}) {
    await delay(1500);
    const blob = new Blob(['模拟导出的收货确认单数据'], { type: 'application/vnd.ms-excel' });
    return { data: blob, success: true };
  },

  // 下载导入模板
  async downloadTemplate(type) {
    await delay(1000);
    const templates = {
      order: '订货通知单导入模板.xlsx',
      receipt: '收货确认单导入模板.xlsx'
    };
    const filename = templates[type] || '导入模板.xlsx';
    const blob = new Blob(['模拟模板文件内容'], { type: 'application/vnd.ms-excel' });
    return { data: blob, filename, success: true };
  }
};

// 综合服务对象
export const oilWholesaleService = {
  // 订货通知单相关
  getOrderList: orderService.getOrderList,
  getOrderDetail: orderService.getOrderDetail,
  createOrder: orderService.createOrder,
  updateOrder: orderService.updateOrder,
  deleteOrder: orderService.deleteOrder,
  batchDeleteOrders: orderService.batchDeleteOrders,
  uploadOrderAttachment: orderService.uploadOrderAttachment,

  // 收货确认单相关
  getReceiptList: receiptService.getReceiptList,
  getReceiptDetail: receiptService.getReceiptDetail,
  createReceipt: receiptService.createReceipt,
  updateReceipt: receiptService.updateReceipt,
  deleteReceipt: receiptService.deleteReceipt,
  confirmReceipt: receiptService.confirmReceipt,
  batchConfirmReceipts: receiptService.batchConfirmReceipts,
  uploadWeighingSlip: receiptService.uploadWeighingSlip,

  // 修改记录相关
  getModificationRecords: recordService.getModificationRecords,
  getRecordDetail: recordService.getRecordDetail,
  exportRecords: recordService.exportRecords,
  clearRecords: recordService.clearRecords,

  // 基础数据相关
  getOrderingCompanies: baseDataService.getOrderingCompanies,
  getOilTypes: baseDataService.getOilTypes,
  getSuppliers: baseDataService.getSuppliers,
  getQuotations: baseDataService.getQuotations,

  // 统计分析相关
  getOrderStatistics: statisticsService.getOrderStatistics,
  getReceiptStatistics: statisticsService.getReceiptStatistics,
  getVarianceAnalysis: statisticsService.getVarianceAnalysis,

  // 导入导出相关
  importOrders: importExportService.importOrders,
  exportOrders: importExportService.exportOrders,
  exportReceipts: importExportService.exportReceipts,
  downloadTemplate: importExportService.downloadTemplate
};

// 导出所有服务
export default {
  order: orderService,
  receipt: receiptService,
  record: recordService,
  baseData: baseDataService,
  statistics: statisticsService,
  importExport: importExportService,
  oilWholesale: oilWholesaleService
};