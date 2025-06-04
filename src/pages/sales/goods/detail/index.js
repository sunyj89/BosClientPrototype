import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Tooltip, 
  Tag,
  message
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  EyeOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 商品销售明细页面
const GoodsSalesDetail = () => {
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();

  // 获取销售数据
  const fetchSalesData = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setSalesData(mockData.data);
        setPagination(prev => ({
          ...prev,
          total: mockData.total
        }));
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取商品销售明细失败:', error);
      message.error('获取商品销售明细失败');
      setLoading(false);
    }
  }, [generateMockData, pagination.current, pagination.pageSize]);

  // 组件加载时获取数据
  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  // 生成模拟数据
  const generateMockData = useCallback(() => {
    const data = [];
    const total = 85;
    const pageSize = pagination.pageSize;
    const current = pagination.current;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    for (let i = 0; i < total; i++) {
      if (i >= startIndex && i < endIndex) {
        const date = moment().subtract(i % 30, 'days').format('YYYY-MM-DD HH:mm:ss');
        const goodsTypes = ['饮料', '零食', '香烟', '日用品', '汽车用品'];
        const goodsNames = [
          ['可口可乐', '百事可乐', '雪碧', '芬达', '农夫山泉'],
          ['薯片', '饼干', '巧克力', '糖果', '坚果'],
          ['中华', '万宝路', '玉溪', '黄鹤楼', '利群'],
          ['洗发水', '沐浴露', '牙膏', '洗衣液', '纸巾'],
          ['机油', '玻璃水', '车载香水', '车载充电器', '车载吸尘器']
        ];
        
        const typeIndex = i % 5;
        const nameIndex = i % 5;
        
        data.push({
          id: `GS${String(i + 1).padStart(6, '0')}`,
          date,
          stationName: `加油站${i % 10 + 1}`,
          goodsType: goodsTypes[typeIndex],
          goodsName: goodsNames[typeIndex][nameIndex],
          quantity: Math.floor(Math.random() * 10) + 1,
          unitPrice: ((Math.random() * 100) + 5).toFixed(2),
          amount: ((Math.random() * 1000) + 50).toFixed(2),
          paymentMethod: ['现金', '微信', '支付宝', '银行卡', '会员卡'][i % 5],
          operator: `操作员${i % 5 + 1}`,
          memberNo: Math.random() > 0.5 ? `M${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}` : '-'
        });
      }
    }

    return {
      data,
      total
    };
  }, [pagination.current, pagination.pageSize]);

  // 处理搜索
  const handleSearch = useCallback((values) => {
    console.log('搜索条件:', values);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    fetchSalesData();
  }, [fetchSalesData]);

  // 重置搜索表单
  const handleReset = useCallback(() => {
    searchForm.resetFields();
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    fetchSalesData();
  }, [searchForm, fetchSalesData]);

  // 处理表格分页变化
  const handleTableChange = useCallback((newPagination) => {
    setPagination(newPagination);
  }, []);

  // 查看详情
  const handleViewDetail = useCallback((record) => {
    message.info(`查看销售记录 ${record.id} 的详情`);
  }, []);

  // 打印小票
  const handlePrint = useCallback((record) => {
    message.success(`打印销售记录 ${record.id} 的小票`);
  }, []);

  // 导出数据
  const handleExport = useCallback(() => {
    message.success('导出商品销售明细数据');
  }, []);

  // 表格列定义
  const getColumns = (handleViewDetail, handlePrint) => [
    {
      title: '销售单号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
      render: (text, record) => <a onClick={() => handleViewDetail(record)}>{text}</a>
    },
    {
      title: '销售时间',
      dataIndex: 'date',
      key: 'date',
      width: 180
    },
    {
      title: '站点',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 120
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 150
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right'
    },
    {
      title: '单价(元)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      align: 'right'
    },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      align: 'right'
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (text) => {
        let color = 'default';
        if (text === '微信') color = 'green';
        if (text === '支付宝') color = 'blue';
        if (text === '会员卡') color = 'purple';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '会员号',
      dataIndex: 'memberNo',
      key: 'memberNo',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="打印小票">
            <Button 
              type="text" 
              icon={<PrinterOutlined />} 
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 使用 useMemo 优化表格列定义
  const columns = useMemo(() => getColumns(handleViewDetail, handlePrint), [handleViewDetail, handlePrint]);

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="goods-sales-search-form">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="salesId" label="销售单号">
              <Input placeholder="请输入销售单号" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="销售时间">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="stationName" label="站点">
              <Select placeholder="请选择站点" allowClear>
                <Option value="站点1">站点1</Option>
                <Option value="站点2">站点2</Option>
                <Option value="站点3">站点3</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="goodsType" label="商品类型">
              <Select placeholder="请选择商品类型" allowClear>
                <Option value="饮料">饮料</Option>
                <Option value="零食">零食</Option>
                <Option value="香烟">香烟</Option>
                <Option value="日用品">日用品</Option>
                <Option value="汽车用品">汽车用品</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="goodsName" label="商品名称">
              <Input placeholder="请输入商品名称" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="paymentMethod" label="支付方式">
              <Select placeholder="请选择支付方式" allowClear>
                <Option value="现金">现金</Option>
                <Option value="微信">微信</Option>
                <Option value="支付宝">支付宝</Option>
                <Option value="银行卡">银行卡</Option>
                <Option value="会员卡">会员卡</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="operator" label="操作员">
              <Input placeholder="请输入操作员" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="memberNo" label="会员号">
              <Input placeholder="请输入会员号" allowClear />
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

  return (
    <div className="goods-sales-detail">
      {renderSearchForm()}
      
      <Table
        className="goods-sales-table"
        columns={columns}
        dataSource={salesData}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default GoodsSalesDetail; 