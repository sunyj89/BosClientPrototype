const fs = require('fs');
const path = require('path');

// 定义要处理的目录路径
const pagesDir = path.join(__dirname, 'src', 'pages');

// 递归遍历目录并修改文件后缀
function renameJsToJsx(dir) {
  // 读取目录内容
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    // 如果是目录，递归处理
    if (stats.isDirectory()) {
      renameJsToJsx(filePath);
    } 
    // 如果是.js文件，修改为.jsx
    else if (path.extname(file) === '.js') {
      const newFilePath = path.join(dir, `${path.basename(file, '.js')}.jsx`);
      fs.renameSync(filePath, newFilePath);
      console.log(`重命名: ${filePath} -> ${newFilePath}`);
    }
  });
}

// 执行重命名操作
console.log(`开始重命名${pagesDir}目录下的.js文件...`);
renameJsToJsx(pagesDir);
console.log('重命名完成!');