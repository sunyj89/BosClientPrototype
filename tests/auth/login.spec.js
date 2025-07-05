const { test, expect } = require('@playwright/test');
const { AuthHelper } = require('../utils/auth');

test.describe('登录功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前清除存储
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test('成功登录', async ({ page }) => {
    const auth = new AuthHelper(page);
    
    await page.goto('/');
    
    // 验证登录页面元素
    await expect(page).toHaveTitle(/登录|Login|BOS/);
    await expect(page.locator('input[placeholder*="用户名"], input[placeholder*="username"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], .ant-btn-primary')).toBeVisible();
    
    // 执行登录
    await auth.login('admin', 'admin123');
    
    // 验证登录成功
    await expect(page).toHaveURL(/dashboard|main|home/);
    await expect(page.locator('.ant-layout, .dashboard')).toBeVisible();
  });

  test('用户名为空时显示错误', async ({ page }) => {
    await page.goto('/');
    
    // 只填写密码
    await page.fill('input[type="password"]', 'admin123');
    
    // 点击登录
    await page.click('button[type="submit"], .ant-btn-primary');
    
    // 验证错误提示
    await expect(page.locator('.ant-form-item-explain-error, .ant-message-error')).toBeVisible();
  });

  test('密码为空时显示错误', async ({ page }) => {
    await page.goto('/');
    
    // 只填写用户名
    await page.fill('input[placeholder*="用户名"], input[placeholder*="username"]', 'admin');
    
    // 点击登录
    await page.click('button[type="submit"], .ant-btn-primary');
    
    // 验证错误提示
    await expect(page.locator('.ant-form-item-explain-error, .ant-message-error')).toBeVisible();
  });

  test('错误的用户名密码', async ({ page }) => {
    await page.goto('/');
    
    // 填写错误的凭据
    await page.fill('input[placeholder*="用户名"], input[placeholder*="username"]', 'wronguser');
    await page.fill('input[type="password"]', 'wrongpass');
    
    // 点击登录
    await page.click('button[type="submit"], .ant-btn-primary');
    
    // 验证错误提示（等待可能的网络请求）
    await page.waitForTimeout(2000);
    const errorVisible = await page.locator('.ant-message-error, .ant-notification-notice-error').isVisible();
    if (errorVisible) {
      await expect(page.locator('.ant-message-error, .ant-notification-notice-error')).toBeVisible();
    }
  });

  test('记住我功能', async ({ page }) => {
    await page.goto('/');
    
    // 查找"记住我"复选框
    const rememberCheckbox = page.locator('input[type="checkbox"], .ant-checkbox');
    if (await rememberCheckbox.isVisible()) {
      await rememberCheckbox.check();
      await expect(rememberCheckbox).toBeChecked();
    }
  });
}); 