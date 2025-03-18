import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Table, 
  Row, 
  Col, 
  Space, 
  Tabs,
  Statistic,
  Progress,
  message,
  Tooltip,
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// 商品销售绩效页面
const SalesPerformance = () => {
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('employee');
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    targetSales: 0,
    completionRate: 0,
    employeeCount: 0,
    achievedCount: 0
  });

  // 组件加载时获取数据
  useEffect(() => {
    fetchPerformanceData();
  }, [activeTab, pagination.current, pagination.pageSize]);

  // 获取绩效数据
  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setPerformanceData(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        
        // 计算汇总数据
        const totalSales = mockData.data.reduce((sum, item) => sum + parseFloat(item.actualSales || 0), 0);
        const targetSales = mockData.data.reduce((sum, item) => sum + parseFloat(item.targetSales || 0), 0);
        const completionRate = targetSales > 0 ? (totalSales / targetSales * 100).toFixed(2) : 0;
        const achievedCount = mockData.data.filter(item => parseFloat(item.completionRate) >= 100).length;
        
        setSummaryData({
          totalSales,
          targetSales,
          completionRate,
          employeeCount: mockData.data.length,
          achievedCount
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取销售绩效数据失败:', error);
      message.error('获取销售绩效数据失败');
      setLoading(false);
    }
  };

  // 生成模拟数据
  const generateMockData = () => {
    const data = [];
    const total = 50;
    const pageSize = pagination.pageSize;
    const current = pagination.current;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // 根据不同的标签页生成不同的数据
    if (activeTab === 'employee') {
      for (let i = 0; i < total; i++) {
        if (i >= startIndex && i < endIndex) {
          const targetSales = ((Math.random() * 50000) + 10000).toFixed(2);
          const actualSales = ((Math.random() * 60000) + 5000).toFixed(2);
          const completionRate = ((parseFloat(actualSales) / parseFloat(targetSales)) * 100).toFixed(2);
          const orderCount = Math.floor(Math.random() * 200) + 20;
          const customerCount = Math.floor(Math.random() * 100) + 10;
          const avgOrderValue = (parseFloat(actualSales) / orderCount).toFixed(2);
          
          data.push({
            id: i + 1,
            employeeId: `E${String(1000 + i).padStart(6, '0')}`,
            employeeName: `员工${i + 1}`,
            department: `部门${i % 5 + 1}`,
            position: i % 3 === 0 ? '销售经理' : (i % 3 === 1 ? '销售主管' : '销售员'),
            targetSales,
            actualSales,
            completionRate,
            orderCount,
            customerCount,
            avgOrderValue,
            status: parseFloat(completionRate) >= 100 ? '已达标' : '未达标'
          });
        }
      }
    } else if (activeTab === 'department') {
      for (let i = 0; i < 5; i++) {
        const targetSales = ((Math.random() * 200000) + 100000).toFixed(2);
        const actualSales = ((Math.random() * 250000) + 80000).toFixed(2);
        const completionRate = ((parseFloat(actualSales) / parseFloat(targetSales)) * 100).toFixed(2);
        const orderCount = Math.floor(Math.random() * 1000) + 200;
        const employeeCount = Math.floor(Math.random() * 20) + 5;
        const achievedCount = Math.floor(Math.random() * employeeCount);
        const achieveRate = ((achievedCount / employeeCount) * 100).toFixed(2);
        
        data.push({
          id: i + 1,
          departmentId: `D${String(100 + i).padStart(3, '0')}`,
          departmentName: `部门${i + 1}`,
          employeeCount,
          achievedCount,
          achieveRate,
          targetSales,
          actualSales,
          completionRate,
          orderCount,
          avgPerEmployee: (parseFloat(actualSales) / employeeCount).toFixed(2)
        });
      }
    } else if (activeTab === 'station') {
      for (let i = 0; i < 20; i++) {
        if (i >= startIndex && i < endIndex) {
          const targetSales = ((Math.random() * 300000) + 150000).toFixed(2);
          const actualSales = ((Math.random() * 350000) + 100000).toFixed(2);
          const completionRate = ((parseFloat(actualSales) / parseFloat(targetSales)) * 100).toFixed(2);
          const orderCount = Math.floor(Math.random() * 2000) + 500;
          const employeeCount = Math.floor(Math.random() * 15) + 3;
          const customerCount = Math.floor(Math.random() * 1000) + 200;
          
          data.push({
            id: i + 1,
            stationId: `S${String(100 + i).padStart(3, '0')}`,
            stationName: `加油站${i + 1}`,
            region: `区域${i % 5 + 1}`,
            employeeCount,
            customerCount,
            targetSales,
            actualSales,
            completionRate,
            orderCount,
            avgPerEmployee: (parseFloat(actualSales) / employeeCount).toFixed(2),
            avgPerCustomer: (parseFloat(actualSales) / customerCount).toFixed(2),
            status: parseFloat(completionRate) >= 100 ? '已达标' : '未达标'
          });
        }
      }
    }

    return {
      data,
      total: activeTab === 'department' ? 5 : total
    };
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setPagination({
      ...pagination,
      current: 1
    });
    fetchPerformanceData();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    fetchPerformanceData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 导出数据
  const handleExport = () => {
    message.success('导出销售绩效数据');
  };

  // 获取完成率状态标签
  const getCompletionRateTag = (rate) => {
    const rateValue = parseFloat(rate);
    if (rateValue >= 100) {
      return <Tag color="success">已达标</Tag>;
    } else if (rateValue >= 80) {
      return <Tag color="warning">接近达标</Tag>;
    } else {
      return <Tag color="error">未达标</Tag>;
    }
  };

  // 员工绩效表格列定义
  const employeeColumns = [
    {
      title: '员工编号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 120,
      fixed: 'left'
    },
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 120
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 100
    },
    {
      title: '目标销售额(元)',
      dataIndex: 'targetSales',
      key: 'targetSales',
      width: 140,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '实际销售额(元)',
      dataIndex: 'actualSales',
      key: 'actualSales',
      width: 140,
      align: 'right',
      sorter: (a, b) => parseFloat(a.actualSales) - parseFloat(b.actualSales),
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 200,
      sorter: (a, b) => parseFloat(a.completionRate) - parseFloat(b.completionRate),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress 
            percent={parseFloat(text)} 
            size="small" 
            status={parseFloat(text) >= 100 ? 'success' : 'active'} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <span style={{ marginLeft: 8 }}>{text}%</span>
        </div>
      )
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right'
    },
    {
      title: '客户数',
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 100,
      align: 'right'
    },
    {
      title: '平均订单金额(元)',
      dataIndex: 'avgOrderValue',
      key: 'avgOrderValue',
      width: 150,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => getCompletionRateTag(record.completionRate)
    }
  ];

  // 部门绩效表格列定义
  const departmentColumns = [
    {
      title: '部门编号',
      dataIndex: 'departmentId',
      key: 'departmentId',
      width: 120
    },
    {
      title: '部门名称',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 120
    },
    {
      title: '员工数',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 100,
      align: 'right'
    },
    {
      title: '达标员工数',
      dataIndex: 'achievedCount',
      key: 'achievedCount',
      width: 120,
      align: 'right'
    },
    {
      title: '员工达标率',
      dataIndex: 'achieveRate',
      key: 'achieveRate',
      width: 200,
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress 
            percent={parseFloat(text)} 
            size="small" 
            status={parseFloat(text) >= 80 ? 'success' : 'active'} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <span style={{ marginLeft: 8 }}>{text}%</span>
        </div>
      )
    },
    {
      title: '目标销售额(元)',
      dataIndex: 'targetSales',
      key: 'targetSales',
      width: 140,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '实际销售额(元)',
      dataIndex: 'actualSales',
      key: 'actualSales',
      width: 140,
      align: 'right',
      sorter: (a, b) => parseFloat(a.actualSales) - parseFloat(b.actualSales),
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 200,
      sorter: (a, b) => parseFloat(a.completionRate) - parseFloat(b.completionRate),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress 
            percent={parseFloat(text)} 
            size="small" 
            status={parseFloat(text) >= 100 ? 'success' : 'active'} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <span style={{ marginLeft: 8 }}>{text}%</span>
        </div>
      )
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right'
    },
    {
      title: '人均销售额(元)',
      dataIndex: 'avgPerEmployee',
      key: 'avgPerEmployee',
      width: 140,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => getCompletionRateTag(record.completionRate)
    }
  ];

  // 站点绩效表格列定义
  const stationColumns = [
    {
      title: '站点编号',
      dataIndex: 'stationId',
      key: 'stationId',
      width: 120,
      fixed: 'left'
    },
    {
      title: '站点名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 120
    },
    {
      title: '所属区域',
      dataIndex: 'region',
      key: 'region',
      width: 120
    },
    {
      title: '员工数',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 100,
      align: 'right'
    },
    {
      title: '客户数',
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 100,
      align: 'right'
    },
    {
      title: '目标销售额(元)',
      dataIndex: 'targetSales',
      key: 'targetSales',
      width: 140,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '实际销售额(元)',
      dataIndex: 'actualSales',
      key: 'actualSales',
      width: 140,
      align: 'right',
      sorter: (a, b) => parseFloat(a.actualSales) - parseFloat(b.actualSales),
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 200,
      sorter: (a, b) => parseFloat(a.completionRate) - parseFloat(b.completionRate),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress 
            percent={parseFloat(text)} 
            size="small" 
            status={parseFloat(text) >= 100 ? 'success' : 'active'} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <span style={{ marginLeft: 8 }}>{text}%</span>
        </div>
      )
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right'
    },
    {
      title: '人均销售额(元)',
      dataIndex: 'avgPerEmployee',
      key: 'avgPerEmployee',
      width: 140,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '客均销售额(元)',
      dataIndex: 'avgPerCustomer',
      key: 'avgPerCustomer',
      width: 140,
      align: 'right',
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => getCompletionRateTag(record.completionRate)
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="sales-performance-search-form">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
        initialValues={{
          dateRange: [moment().startOf('month'), moment()]
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="日期范围" rules={[{ required: true, message: '请选择日期范围' }]}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {activeTab === 'employee' && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="department" label="部门">
                  <Select placeholder="请选择部门" allowClear>
                    <Option value="部门1">部门1</Option>
                    <Option value="部门2">部门2</Option>
                    <Option value="部门3">部门3</Option>
                    <Option value="部门4">部门4</Option>
                    <Option value="部门5">部门5</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="employeeName" label="员工姓名">
                  <Input placeholder="请输入员工姓名" allowClear />
                </Form.Item>
              </Col>
            </>
          )}
          {activeTab === 'station' && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="region" label="所属区域">
                  <Select placeholder="请选择区域" allowClear>
                    <Option value="区域1">区域1</Option>
                    <Option value="区域2">区域2</Option>
                    <Option value="区域3">区域3</Option>
                    <Option value="区域4">区域4</Option>
                    <Option value="区域5">区域5</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="stationName" label="站点名称">
                  <Input placeholder="请输入站点名称" allowClear />
                </Form.Item>
              </Col>
            </>
          )}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="status" label="达标状态">
              <Select placeholder="请选择达标状态" allowClear>
                <Option value="已达标">已达标</Option>
                <Option value="未达标">未达标</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 渲染绩效指标卡片
  const renderPerformanceCards = () => (
    <Row gutter={16} className="sales-performance-statistics">
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            title={
              <div>
                总销售额(元)
                <Tooltip title="当前筛选条件下的总销售额">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </div>
            }
            value={summaryData.totalSales}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<RiseOutlined />}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            title={
              <div>
                目标销售额(元)
                <Tooltip title="当前筛选条件下的目标销售额">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </div>
            }
            value={summaryData.targetSales}
            precision={2}
            valueStyle={{ color: '#1890ff' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            title={
              <div>
                总体完成率
                <Tooltip title="实际销售额/目标销售额">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </div>
            }
            value={summaryData.completionRate}
            precision={2}
            valueStyle={{ 
              color: parseFloat(summaryData.completionRate) >= 100 
                ? '#3f8600' 
                : (parseFloat(summaryData.completionRate) >= 80 ? '#faad14' : '#cf1322')
            }}
            suffix="%"
            prefix={parseFloat(summaryData.completionRate) >= 100 
              ? <CheckCircleOutlined /> 
              : (parseFloat(summaryData.completionRate) >= 80 ? <WarningOutlined /> : <CloseCircleOutlined />)
            }
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            title={
              <div>
                达标率
                <Tooltip title="达标数量/总数量">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </div>
            }
            value={summaryData.employeeCount > 0 
              ? ((summaryData.achievedCount / summaryData.employeeCount) * 100).toFixed(2) 
              : 0
            }
            precision={2}
            valueStyle={{ color: '#722ed1' }}
            suffix="%"
          />
          <div className="statistic-footer">
            {summaryData.achievedCount}/{summaryData.employeeCount}
          </div>
        </Card>
      </Col>
    </Row>
  );

  // 渲染绩效内容
  const renderPerformanceContent = () => (
    <div className="sales-performance-content">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="员工绩效" key="employee">
          <Table
            className="sales-performance-table"
            columns={employeeColumns}
            dataSource={performanceData}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1500 }}
          />
        </TabPane>
        <TabPane tab="部门绩效" key="department">
          <Table
            className="sales-performance-table"
            columns={departmentColumns}
            dataSource={performanceData}
            rowKey="id"
            pagination={false}
            loading={loading}
            scroll={{ x: 1500 }}
          />
        </TabPane>
        <TabPane tab="站点绩效" key="station">
          <Table
            className="sales-performance-table"
            columns={stationColumns}
            dataSource={performanceData}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1800 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );

  return (
    <div className="sales-performance">
      {renderSearchForm()}
      {renderPerformanceCards()}
      {renderPerformanceContent()}
    </div>
  );
};

export default SalesPerformance; 