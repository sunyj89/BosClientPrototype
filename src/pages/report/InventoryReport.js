import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Breadcrumb, 
  Statistic, 
  Table, 
  DatePicker, 
  Button, 
  Select, 
  Tabs,
  Progress,
  Tag,
  Alert,
  Divider,
  Input,
  TreeSelect
} from 'antd';
import { 
  DownloadOutlined, 
  PrinterOutlined, 
  ReloadOutlined,
  SearchOutlined,
  WarningOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const InventoryReport = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [category, setCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('company-0');
  
  // 模拟组织结构数据
  const orgData = {
    key: 'company-0',
    title: '总公司',
    value: 'company-0',
    children: Array.from({ length: 7 }, (_, i) => ({
      key: `branch-${i}`,
      title: `分公司 ${i + 1}`,
      value: `branch-${i}`,
      children: Array.from({ length: 10 }, (_, j) => ({
        key: `station-${i}-${j}`,
        title: `加油站 ${i + 1}-${j + 1}`,
        value: `station-${i}-${j}`,
      }))
    }))
  };
  
  // 模拟库存数据
  const inventoryData = [
    {
      key: '1',
      id: '1001',
      name: '92#汽油',
      category: '油品',
      unit: '升',
      currentStock: 15000,
      minStock: 5000,
      maxStock: 20000,
      safetyStock: 8000,
      avgDailySales: 1200,
      turnoverRate: 8.0,
      lastPurchaseDate: '2025-03-10',
      lastPurchaseQuantity: 10000,
      status: 'normal',
    },
    {
      key: '2',
      id: '1002',
      name: '95#汽油',
      category: '油品',
      unit: '升',
      currentStock: 12000,
      minStock: 4000,
      maxStock: 18000,
      safetyStock: 7000,
      avgDailySales: 900,
      turnoverRate: 7.5,
      lastPurchaseDate: '2025-03-10',
      lastPurchaseQuantity: 8000,
      status: 'normal',
    },
    {
      key: '3',
      id: '1003',
      name: '0#柴油',
      category: '油品',
      unit: '升',
      currentStock: 3500,
      minStock: 3000,
      maxStock: 15000,
      safetyStock: 5000,
      avgDailySales: 1000,
      turnoverRate: 28.6,
      lastPurchaseDate: '2025-03-05',
      lastPurchaseQuantity: 8000,
      status: 'warning',
    },
    {
      key: '4',
      id: '2001',
      name: '可口可乐',
      category: '饮料',
      unit: '瓶',
      currentStock: 120,
      minStock: 50,
      maxStock: 200,
      safetyStock: 80,
      avgDailySales: 35,
      turnoverRate: 29.2,
      lastPurchaseDate: '2025-03-08',
      lastPurchaseQuantity: 100,
      status: 'normal',
    },
    {
      key: '5',
      id: '2002',
      name: '百事可乐',
      category: '饮料',
      unit: '瓶',
      currentStock: 85,
      minStock: 50,
      maxStock: 200,
      safetyStock: 80,
      avgDailySales: 30,
      turnoverRate: 35.3,
      lastPurchaseDate: '2025-03-08',
      lastPurchaseQuantity: 100,
      status: 'normal',
    },
    {
      key: '6',
      id: '3001',
      name: '康师傅方便面',
      category: '食品',
      unit: '包',
      currentStock: 45,
      minStock: 50,
      maxStock: 200,
      safetyStock: 80,
      avgDailySales: 28,
      turnoverRate: 62.2,
      lastPurchaseDate: '2025-03-05',
      lastPurchaseQuantity: 100,
      status: 'warning',
    },
    {
      key: '7',
      id: '4001',
      name: '机油',
      category: '汽车用品',
      unit: '瓶',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      safetyStock: 30,
      avgDailySales: 5,
      turnoverRate: 33.3,
      lastPurchaseDate: '2025-03-01',
      lastPurchaseQuantity: 50,
      status: 'danger',
    },
  ];

  // 模拟库存变动数据
  const inventoryChangeData = [
    {
      key: '1',
      date: '2025-03-13',
      productId: '1001',
      productName: '92#汽油',
      type: 'in',
      quantity: 5000,
      beforeQuantity: 10000,
      afterQuantity: 15000,
      operator: '张三',
      remark: '常规进货',
    },
    {
      key: '2',
      date: '2025-03-12',
      productId: '1002',
      productName: '95#汽油',
      type: 'in',
      quantity: 4000,
      beforeQuantity: 8000,
      afterQuantity: 12000,
      operator: '张三',
      remark: '常规进货',
    },
    {
      key: '3',
      date: '2025-03-11',
      productId: '1003',
      productName: '0#柴油',
      type: 'in',
      quantity: 3000,
      beforeQuantity: 500,
      afterQuantity: 3500,
      operator: '张三',
      remark: '紧急补货',
    },
    {
      key: '4',
      date: '2025-03-10',
      productId: '2001',
      productName: '可口可乐',
      type: 'in',
      quantity: 100,
      beforeQuantity: 20,
      afterQuantity: 120,
      operator: '李四',
      remark: '常规进货',
    },
    {
      key: '5',
      date: '2025-03-10',
      productId: '1001',
      productName: '92#汽油',
      type: 'out',
      quantity: 1200,
      beforeQuantity: 11200,
      afterQuantity: 10000,
      operator: '系统',
      remark: '日常销售',
    },
    {
      key: '6',
      date: '2025-03-10',
      productId: '1002',
      productName: '95#汽油',
      type: 'out',
      quantity: 900,
      beforeQuantity: 8900,
      afterQuantity: 8000,
      operator: '系统',
      remark: '日常销售',
    },
    {
      key: '7',
      date: '2025-03-10',
      productId: '1003',
      productName: '0#柴油',
      type: 'out',
      quantity: 1000,
      beforeQuantity: 1500,
      afterQuantity: 500,
      operator: '系统',
      remark: '日常销售',
    },
  ];

  // 库存数据表格列配置
  const inventoryColumns = [
    {
      title: '商品编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '油品', value: '油品' },
        { text: '饮料', value: '饮料' },
        { text: '食品', value: '食品' },
        { text: '汽车用品', value: '汽车用品' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      sorter: (a, b) => a.currentStock - b.currentStock,
    },
    {
      title: '库存状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        let text = '正常';
        
        if (status === 'warning') {
          color = 'orange';
          text = '预警';
        } else if (status === 'danger') {
          color = 'red';
          text = '紧缺';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: '正常', value: 'normal' },
        { text: '预警', value: 'warning' },
        { text: '紧缺', value: 'danger' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '安全库存',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
    },
    {
      title: '日均销量',
      dataIndex: 'avgDailySales',
      key: 'avgDailySales',
      sorter: (a, b) => a.avgDailySales - b.avgDailySales,
    },
    {
      title: '周转率(%)',
      dataIndex: 'turnoverRate',
      key: 'turnoverRate',
      render: (text) => text.toFixed(1),
      sorter: (a, b) => a.turnoverRate - b.turnoverRate,
    },
    {
      title: '库存水平',
      key: 'stockLevel',
      render: (_, record) => {
        const percent = (record.currentStock / record.maxStock) * 100;
        let strokeColor = '#52c41a';
        
        if (record.status === 'warning') {
          strokeColor = '#faad14';
        } else if (record.status === 'danger') {
          strokeColor = '#f5222d';
        }
        
        return <Progress percent={percent.toFixed(0)} size="small" strokeColor={strokeColor} />;
      },
    },
    {
      title: '最后进货日期',
      dataIndex: 'lastPurchaseDate',
      key: 'lastPurchaseDate',
      sorter: (a, b) => new Date(a.lastPurchaseDate) - new Date(b.lastPurchaseDate),
    },
  ];

  // 库存变动表格列配置
  const inventoryChangeColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: '商品编号',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        if (type === 'in') {
          return <Tag color="green">入库</Tag>;
        } else {
          return <Tag color="red">出库</Tag>;
        }
      },
      filters: [
        { text: '入库', value: 'in' },
        { text: '出库', value: 'out' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: '变动前库存',
      dataIndex: 'beforeQuantity',
      key: 'beforeQuantity',
    },
    {
      title: '变动后库存',
      dataIndex: 'afterQuantity',
      key: 'afterQuantity',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // 库存趋势图配置
  const getInventoryTrendOption = () => {
    // 这里应该根据库存变动数据计算每日库存趋势
    // 为简化，使用模拟数据
    return {
      title: {
        text: '库存趋势分析'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['92#汽油', '95#汽油', '0#柴油']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['3月7日', '3月8日', '3月9日', '3月10日', '3月11日', '3月12日', '3月13日']
      },
      yAxis: {
        type: 'value',
        name: '库存量'
      },
      series: [
        {
          name: '92#汽油',
          type: 'line',
          data: [8000, 7500, 7000, 6500, 6000, 10000, 15000],
          markLine: {
            data: [
              { name: '安全库存线', yAxis: 8000, lineStyle: { color: '#faad14' } }
            ]
          }
        },
        {
          name: '95#汽油',
          type: 'line',
          data: [6000, 5500, 5000, 4500, 4000, 8000, 12000],
          markLine: {
            data: [
              { name: '安全库存线', yAxis: 7000, lineStyle: { color: '#faad14' } }
            ]
          }
        },
        {
          name: '0#柴油',
          type: 'line',
          data: [5000, 4500, 4000, 3500, 500, 3500, 3500],
          markLine: {
            data: [
              { name: '安全库存线', yAxis: 5000, lineStyle: { color: '#faad14' } }
            ]
          }
        }
      ]
    };
  };

  // 周转率分析图配置
  const getTurnoverRateOption = () => {
    const categories = inventoryData.map(item => item.name);
    const turnoverRates = inventoryData.map(item => item.turnoverRate);
    
    return {
      title: {
        text: '周转率分析'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '周转率(%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: categories,
        inverse: true
      },
      series: [
        {
          name: '周转率',
          type: 'bar',
          data: turnoverRates,
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%'
          },
          itemStyle: {
            color: function(params) {
              // 根据周转率设置不同颜色
              const value = params.value;
              if (value > 50) {
                return '#52c41a'; // 高周转率 - 绿色
              } else if (value > 20) {
                return '#1890ff'; // 中等周转率 - 蓝色
              } else {
                return '#faad14'; // 低周转率 - 黄色
              }
            }
          }
        }
      ]
    };
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // 处理分类变化
  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // 处理组织选择变化
  const handleOrgChange = (value) => {
    setSelectedOrg(value);
  };

  // 获取组织名称
  const getOrgName = (value) => {
    if (value === 'company-0') return '总公司';
    
    if (value.startsWith('branch-')) {
      const branchIndex = parseInt(value.split('-')[1]);
      return `分公司 ${branchIndex + 1}`;
    }
    
    if (value.startsWith('station-')) {
      const [_, branchIndex, stationIndex] = value.split('-');
      return `加油站 ${parseInt(branchIndex) + 1}-${parseInt(stationIndex) + 1}`;
    }
    
    return '';
  };

  // 获取库存预警商品
  const getWarningProducts = () => {
    return inventoryData.filter(item => item.status === 'warning' || item.status === 'danger');
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/report">报表管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>库存报表</Breadcrumb.Item>
        </Breadcrumb>
        <h2>库存报表 - {getOrgName(selectedOrg)}</h2>
      </div>

      {/* 库存预警提示 */}
      {getWarningProducts().length > 0 && (
        <Alert
          message="库存预警"
          description={
            <div>
              <p>当前有 <strong>{getWarningProducts().length}</strong> 个商品库存不足，请及时处理。</p>
              <ul>
                {getWarningProducts().map(item => (
                  <li key={item.key}>
                    {item.status === 'danger' ? <ExclamationCircleOutlined style={{ color: 'red' }} /> : <WarningOutlined style={{ color: 'orange' }} />}
                    <span style={{ marginLeft: 8 }}>{item.name}：当前库存 {item.currentStock}{item.unit}，低于安全库存 {item.safetyStock}{item.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 统计数据卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="商品总数"
              value={inventoryData.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存总值"
              value={inventoryData.reduce((sum, item) => sum + (item.currentStock * (item.category === '油品' ? 7 : 5)), 0)}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预警商品数"
              value={inventoryData.filter(item => item.status === 'warning').length}
              valueStyle={{ color: '#faad14' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="紧缺商品数"
              value={inventoryData.filter(item => item.status === 'danger').length}
              valueStyle={{ color: '#f5222d' }}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      {/* 报表筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <span style={{ marginRight: 8 }}>组织层级:</span>
            <TreeSelect
              style={{ width: 200 }}
              value={selectedOrg}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={[orgData]}
              placeholder="请选择组织"
              treeDefaultExpandAll
              onChange={handleOrgChange}
            />
          </Col>
          <Col span={8}>
            <span style={{ marginRight: 8 }}>日期范围:</span>
            <RangePicker 
              value={dateRange} 
              onChange={handleDateRangeChange} 
              style={{ width: 230 }}
            />
          </Col>
          <Col span={8}>
            <span style={{ marginRight: 8 }}>商品分类:</span>
            <Select 
              value={category} 
              onChange={handleCategoryChange}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="oil">油品</Option>
              <Option value="drink">饮料</Option>
              <Option value="food">食品</Option>
              <Option value="auto">汽车用品</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={16}>
            <Search
              placeholder="搜索商品名称或编号"
              onSearch={handleSearch}
              style={{ width: 250 }}
              enterButton
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              style={{ marginRight: 8 }}
            >
              刷新数据
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              style={{ marginRight: 8 }}
            >
              导出报表
            </Button>
            <Button 
              icon={<PrinterOutlined />}
            >
              打印报表
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 图表展示 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card title="库存趋势">
            <ReactECharts option={getInventoryTrendOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="周转率分析">
            <ReactECharts option={getTurnoverRateOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="库存状态" key="1">
          <Card>
            <Table 
              columns={inventoryColumns} 
              dataSource={inventoryData} 
              rowKey="key"
              pagination={false}
            />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="库存变动记录" key="2">
          <Card>
            <Table 
              columns={inventoryChangeColumns} 
              dataSource={inventoryChangeData} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Divider />
      
      <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
        <p>数据统计时间: {dateRange[0]?.format('YYYY-MM-DD')} 至 {dateRange[1]?.format('YYYY-MM-DD')}</p>
        <p>报表生成时间: {dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>
    </div>
  );
};

export default InventoryReport; 