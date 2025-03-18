// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 模态框功能
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    // 打开模态框
    if (modalTriggers) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // 防止背景滚动
                }
            });
        });
    }
    
    // 关闭模态框
    if (modalCloses) {
        modalCloses.forEach(close => {
            close.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // 恢复背景滚动
                }
            });
        });
    }
    
    // 点击模态框背景关闭模态框
    const modals = document.querySelectorAll('.modal');
    if (modals) {
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // 表单验证
    const forms = document.querySelectorAll('form');
    if (forms) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                const requiredFields = this.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        // 添加错误提示
                        field.classList.add('error');
                        
                        // 如果没有错误消息元素，则创建一个
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = '此字段为必填项';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    } else {
                        // 移除错误提示
                        field.classList.remove('error');
                        const errorMsg = field.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // 选项卡功能
    const tabLinks = document.querySelectorAll('.tab-link');
    if (tabLinks) {
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 移除所有选项卡的活动状态
                tabLinks.forEach(l => l.classList.remove('active'));
                
                // 隐藏所有选项卡内容
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 激活当前选项卡
                this.classList.add('active');
                
                // 显示对应的选项卡内容
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }
    
    // 如果存在选项卡，默认激活第一个
    if (tabLinks.length > 0) {
        tabLinks[0].click();
    }
    
    // 表格排序功能
    const sortableHeaders = document.querySelectorAll('th[data-sort]');
    if (sortableHeaders) {
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const table = this.closest('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const sortBy = this.getAttribute('data-sort');
                const isAsc = this.classList.contains('asc');
                
                // 移除所有表头的排序类
                sortableHeaders.forEach(h => {
                    h.classList.remove('asc', 'desc');
                });
                
                // 设置当前表头的排序类
                this.classList.add(isAsc ? 'desc' : 'asc');
                
                // 排序行
                rows.sort((a, b) => {
                    const aValue = a.querySelector(`td[data-${sortBy}]`).getAttribute(`data-${sortBy}`);
                    const bValue = b.querySelector(`td[data-${sortBy}]`).getAttribute(`data-${sortBy}`);
                    
                    if (isAsc) {
                        return aValue.localeCompare(bValue, 'zh-CN');
                    } else {
                        return bValue.localeCompare(aValue, 'zh-CN');
                    }
                });
                
                // 重新添加排序后的行
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    }
}); 