const { test, expect } = require('@playwright/test');

test.describe('API 接口测试', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    // 创建独立的 API 上下文
    apiContext = await playwright.request.newContext({
      baseURL: 'http://127.0.0.1:3001', // 假设后端 API 地址
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('用户登录 API', async () => {
    const response = await apiContext.post('/api/auth/login', {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody).toHaveProperty('user');
  });

  test('获取供应商列表 API', async () => {
    // 先登录获取 token
    const loginResponse = await apiContext.post('/api/auth/login', {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;

    // 使用 token 请求供应商列表
    const response = await apiContext.get('/api/suppliers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(Array.isArray(responseBody.data || responseBody)).toBeTruthy();
  });

  test('创建供应商 API', async () => {
    // 登录获取 token
    const loginResponse = await apiContext.post('/api/auth/login', {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;

    // 创建供应商
    const supplierData = {
      name: '测试供应商API',
      contact: '测试联系人',
      phone: '13800138000',
      address: '测试地址'
    };

    const response = await apiContext.post('/api/suppliers', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: supplierData
    });

    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.name).toBe(supplierData.name);
  });

  test('更新供应商 API', async () => {
    // 登录
    const loginResponse = await apiContext.post('/api/auth/login', {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;

    // 先创建一个供应商
    const createResponse = await apiContext.post('/api/suppliers', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        name: '待更新供应商',
        contact: '联系人',
        phone: '13800138000'
      }
    });

    const createdSupplier = await createResponse.json();
    const supplierId = createdSupplier.id;

    // 更新供应商
    const updateData = {
      name: '已更新供应商',
      contact: '新联系人',
      phone: '13900139000'
    };

    const updateResponse = await apiContext.put(`/api/suppliers/${supplierId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: updateData
    });

    expect(updateResponse.status()).toBe(200);
    
    const updatedSupplier = await updateResponse.json();
    expect(updatedSupplier.name).toBe(updateData.name);
  });

  test('删除供应商 API', async () => {
    // 登录
    const loginResponse = await apiContext.post('/api/auth/login', {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;

    // 先创建一个供应商
    const createResponse = await apiContext.post('/api/suppliers', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        name: '待删除供应商',
        contact: '联系人',
        phone: '13800138000'
      }
    });

    const createdSupplier = await createResponse.json();
    const supplierId = createdSupplier.id;

    // 删除供应商
    const deleteResponse = await apiContext.delete(`/api/suppliers/${supplierId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(deleteResponse.status()).toBe(200);

    // 验证删除成功 - 尝试获取已删除的供应商应该返回 404
    const getResponse = await apiContext.get(`/api/suppliers/${supplierId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(getResponse.status()).toBe(404);
  });

  test('API 错误处理', async () => {
    // 测试未授权访问
    const unauthorizedResponse = await apiContext.get('/api/suppliers');
    expect(unauthorizedResponse.status()).toBe(401);

    // 测试错误的登录凭据
    const badLoginResponse = await apiContext.post('/api/auth/login', {
      data: {
        username: 'wronguser',
        password: 'wrongpass'
      }
    });
    expect(badLoginResponse.status()).toBe(401);
  });
}); 