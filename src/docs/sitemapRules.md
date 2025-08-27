# 网站地图页面生成逻辑

这个文件实现了一个网站地图功能，用于展示系统所有页面的结构和关系。主要逻辑如下：

## 数据结构

1. `navigationData` 数组包含整个网站的层级结构，每项包含：
   - `title`: 页面标题
   - `key`: 唯一标识
   - `path`: 访问路径
   - `file`: 对应的主文件
   - `dependencies`: 依赖文件
   - `children`: 子页面

## 主要功能组件

1. **功能导航**：使用树形结构展示所有页面的层级关系
2. **搜索功能**：可通过关键词搜索页面名称、路径或文件
3. **文件目录**：按文件夹结构展示所有文件
4. **依赖关系**：展示各模块间的依赖关系

## 核心逻辑函数

1. `generateTreeNodes`: 将数据转换为树形结构
2. `searchTree`: 递归搜索匹配的节点
3. `getAllFiles`: 扁平化提取所有文件路径
4. `fileStatistics`: 统计各类型文件数量
5. `fileTree`: 构建文件目录树
6. `renderFileTree`: 递归渲染文件树结构

## 关键处理流程

1. 搜索处理：
   ```jsx
   useEffect(() => {
     if (searchValue) {
       const results = searchTree(navigationData, searchValue);
       setSearchResults(results);
       setExpandedKeys(results.map(item => item.key));
       setAutoExpandParent(true);
     } else {
       setSearchResults([]);
       setExpandedKeys([]);
     }
   }, [searchValue]);
   ```

2. 文件统计计算：
   ```jsx
   const fileStatistics = useMemo(() => {
     const stats = { JS: 0, CSS: 0, '模拟数据': 0, '服务': 0, '组件': 0, '工具': 0, total: 0 };
     getAllFiles.forEach(file => {
       stats[file.type]++;
       stats.total++;
     });
     return stats;
   }, [getAllFiles]);
   ```

页面通过选项卡展示这四种不同视图，方便用户从不同角度理解系统结构。
