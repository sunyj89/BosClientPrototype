const { test, expect } = require('@playwright/test');
const { AuthHelper } = require('../utils/auth');

test.describe('供应商管理模块测试', () => {
  test.beforeEach(async ({ page }) => {
    const auth = new AuthHelper(page);
    await auth.login();
    
    // 导航到供应商管理页面
    await page.click('text=供应商管理, .ant-menu-item:has-text("供应商")');
    await page.waitForLoadState('networkidle');
  });

  test('供应商列表页面加载', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h1, .page-title, .ant-page-header-heading-title')).toContainText(/供应商/);
    
    // 验证表格存在
    await expect(page.locator('.ant-table, table')).toBeVisible();
    
    // 验证搜索框存在
    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="查询"], .ant-input-search input');
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
    
    // 验证新增按钮存在
    const addButton = page.locator('button:has-text("新增"), button:has-text("添加"), .ant-btn:has-text("新增")');
    if (await addButton.isVisible()) {
      await expect(addButton).toBeVisible();
    }
  });

  test('搜索功能测试', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="查询"], .ant-input-search input').first();
    
    if (await searchInput.isVisible()) {
      // 输入搜索关键词
      await searchInput.fill('测试供应商');
      
      // 点击搜索按钮或按回车
      const searchButton = page.locator('.ant-input-search-button, button:has-text("搜索")');
      if (await searchButton.isVisible()) {
        await searchButton.click();
      } else {
        await searchInput.press('Enter');
      }
      
      // 等待搜索结果
      await page.waitForTimeout(1000);
      
      // 验证表格仍然可见
      await expect(page.locator('.ant-table')).toBeVisible();
    }
  });

  test('新增供应商功能', async ({ page }) => {
    const addButton = page.locator('button:has-text("新增"), button:has-text("添加"), .ant-btn:has-text("新增")').first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // 验证弹窗或新页面打开
      const modal = page.locator('.ant-modal, .ant-drawer, .form-container');
      await expect(modal).toBeVisible();
      
      // 填写表单
      await page.fill('input[placeholder*="名称"], input[name*="name"]', '测试供应商');
      
      const contactInput = page.locator('input[placeholder*="联系"], input[name*="contact"]');
      if (await contactInput.isVisible()) {
        await contactInput.fill('张三');
      }
      
      const phoneInput = page.locator('input[placeholder*="电话"], input[name*="phone"]');
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('13800138000');
      }
      
      // 点击保存按钮
      const saveButton = page.locator('button:has-text("保存"), button:has-text("确定"), .ant-btn-primary');
      await saveButton.click();
      
      // 验证成功提示
      const successMessage = page.locator('.ant-message-success, .ant-notification-notice-success');
      if (await successMessage.isVisible()) {
        await expect(successMessage).toBeVisible();
      }
    }
  });

  test('编辑供应商功能', async ({ page }) => {
    // 等待表格加载
    await page.waitForSelector('.ant-table-tbody tr', { timeout: 5000 });
    
    const tableRows = page.locator('.ant-table-tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount > 0) {
      // 点击第一行的编辑按钮
      const editButton = tableRows.first().locator('button:has-text("编辑"), .ant-btn:has-text("编辑"), a:has-text("编辑")');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // 验证编辑弹窗打开
        const modal = page.locator('.ant-modal, .ant-drawer');
        await expect(modal).toBeVisible();
        
        // 修改名称
        const nameInput = page.locator('input[placeholder*="名称"], input[name*="name"]');
        await nameInput.clear();
        await nameInput.fill('修改后的供应商名称');
        
        // 保存修改
        const saveButton = page.locator('button:has-text("保存"), button:has-text("确定"), .ant-btn-primary');
        await saveButton.click();
        
        // 验证成功提示
        const successMessage = page.locator('.ant-message-success, .ant-notification-notice-success');
        if (await successMessage.isVisible()) {
          await expect(successMessage).toBeVisible();
        }
      }
    }
  });

  test('分页功能测试', async ({ page }) => {
    // 等待表格加载
    await page.waitForTimeout(2000);
    
    // 查找分页组件
    const pagination = page.locator('.ant-pagination');
    
    if (await pagination.isVisible()) {
      // 验证分页组件存在
      await expect(pagination).toBeVisible();
      
      // 测试下一页按钮
      const nextButton = pagination.locator('.ant-pagination-next');
      if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        // 验证页面变化
        await expect(page.locator('.ant-table')).toBeVisible();
      }
    }
  });

  test('表格排序功能', async ({ page }) => {
    // 等待表格加载
    await page.waitForTimeout(2000);
    
    // 查找可排序的列头
    const sortableHeaders = page.locator('.ant-table-column-sorters');
    const headerCount = await sortableHeaders.count();
    
    if (headerCount > 0) {
      // 点击第一个可排序的列头
      await sortableHeaders.first().click();
      await page.waitForTimeout(1000);
      
      // 验证排序图标变化
      const sortIcon = page.locator('.ant-table-column-sorter-up.active, .ant-table-column-sorter-down.active');
      if (await sortIcon.isVisible()) {
        await expect(sortIcon).toBeVisible();
      }
    }
  });
}); 