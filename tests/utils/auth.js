// 认证相关工具函数
class AuthHelper {
  constructor(page) {
    this.page = page;
  }

  // 登录功能
  async login(username = 'admin', password = 'admin123') {
    await this.page.goto('/');
    
    // 等待登录页面加载
    await this.page.waitForSelector('input[placeholder*="用户名"], input[placeholder*="username"]');
    
    // 填写用户名
    await this.page.fill('input[placeholder*="用户名"], input[placeholder*="username"]', username);
    
    // 填写密码
    await this.page.fill('input[type="password"]', password);
    
    // 点击登录按钮
    await this.page.click('button[type="submit"], .ant-btn-primary:has-text("登录")');
    
    // 等待登录成功，跳转到仪表板
    await this.page.waitForURL(/dashboard|main|home/);
    await this.page.waitForSelector('.ant-layout, .dashboard', { timeout: 10000 });
  }

  // 登出功能
  async logout() {
    // 查找登出按钮（可能在用户菜单中）
    const logoutSelectors = [
      'text=退出登录',
      'text=登出',
      '.ant-dropdown-menu-item:has-text("退出")',
      '[data-testid="logout"]'
    ];

    for (const selector of logoutSelectors) {
      try {
        if (await this.page.isVisible(selector)) {
          await this.page.click(selector);
          await this.page.waitForURL(/login/);
          return;
        }
      } catch (e) {
        continue;
      }
    }
  }

  // 检查是否已登录
  async isLoggedIn() {
    try {
      await this.page.waitForSelector('.ant-layout, .dashboard', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { AuthHelper }; 