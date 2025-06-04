import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Tag, 
  Form, 
  Input, 
  Row, 
  Col, 
  Descriptions, 
  Select, 
  message, 
  Divider,
  Tooltip,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  InfoCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  SyncOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import './index.css';

const { Option } = Select;

// 油品信息管理组件
const OilInfo = () => {
  // 状态定义
  const [oilList, setOilList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    code: '',
    name: '',
    type: '',
    status: ''
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOil, setCurrentOil] = useState(null);
  const [searchForm] = Form.useForm();
  const [expandFilter, setExpandFilter] = useState(false);

  // 模拟数据
  useEffect(() => {
    fetchOilData();
  }, []);

  // 获取油品数据
  const fetchOilData = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          code: '92-RON',
          name: '92#汽油',
          fullName: '92号普通汽油(国VI)',
          type: '汽油',
          status: '正常',
          density: 0.737,
          densityTemperature: 20,
          octaneNumber: 92,
          sulfurContent: '≤10mg/kg',
          standard: '国VI',
          color: '浅黄色',
          description: '普通92号汽油，适用于大部分家用轿车',
          createTime: '2023-01-01',
          updateTime: '2023-05-15',
          price: 7.23,
          taxRate: 0.13,
          barrelPrice: 102.5
        },
        {
          id: '2',
          code: '95-RON',
          name: '95#汽油',
          fullName: '95号普通汽油(国VI)',
          type: '汽油',
          status: '正常',
          density: 0.745,
          densityTemperature: 20,
          octaneNumber: 95,
          sulfurContent: '≤10mg/kg',
          standard: '国VI',
          color: '淡黄色',
          description: '优质95号汽油，适用于中高档轿车',
          createTime: '2023-01-01',
          updateTime: '2023-05-15',
          price: 7.68,
          taxRate: 0.13,
          barrelPrice: 109.8
        },
        {
          id: '3',
          code: '98-RON',
          name: '98#汽油',
          fullName: '98号高级汽油(国VI)',
          type: '汽油',
          status: '正常',
          density: 0.751,
          densityTemperature: 20,
          octaneNumber: 98,
          sulfurContent: '≤10mg/kg',
          standard: '国VI',
          color: '淡黄色',
          description: '高级98号汽油，适用于高档轿车和运动型车辆',
          createTime: '2023-01-01',
          updateTime: '2023-05-15',
          price: 8.25,
          taxRate: 0.13,
          barrelPrice: 118.2
        },
        {
          id: '4',
          code: '0-DSL',
          name: '0#柴油',
          fullName: '0号普通柴油(国VI)',
          type: '柴油',
          status: '正常',
          density: 0.84,
          densityTemperature: 20,
          cetaneNumber: 51,
          sulfurContent: '≤10mg/kg',
          standard: '国VI',
          color: '无色至淡黄色',
          description: '普通0号柴油，适用于大部分柴油车辆',
          createTime: '2023-01-01',
          updateTime: '2023-05-15',
          price: 7.10,
          taxRate: 0.13,
          barrelPrice: 97.5
        },
        {
          id: '5',
          code: '-10-DSL',
          name: '-10#柴油',
          fullName: '-10号普通柴油(国VI)',
          type: '柴油',
          status: '停售',
          density: 0.835,
          densityTemperature: 20,
          cetaneNumber: 49,
          sulfurContent: '≤10mg/kg',
          standard: '国VI',
          color: '无色至淡黄色',
          description: '低温-10号柴油，适用于低温环境',
          createTime: '2023-01-01',
          updateTime: '2023-05-15',
          price: 7.50,
          taxRate: 0.13,
          barrelPrice: 102.0
        },
      ];
      setOilList(mockData);
      setFilteredList(mockData);
      setLoading(false);
    }, 500);
  };

  // 搜索处理
  const handleSearch = (values) => {
    setLoading(true);
    setSearchParams(values);
    
    setTimeout(() => {
      const filtered = oilList.filter(oil => {
        const codeMatch = values.code ? oil.code.toLowerCase().includes(values.code.toLowerCase()) : true;
        const nameMatch = values.name ? oil.name.toLowerCase().includes(values.name.toLowerCase()) : true;
        const typeMatch = values.type ? oil.type === values.type : true;
        const statusMatch = values.status ? oil.status === values.status : true;
        
        return codeMatch && nameMatch && typeMatch && statusMatch;
      });
      
      setFilteredList(filtered);
      setLoading(false);
      
      message.success(`查询成功，共找到 ${filtered.length} 条记录`);
    }, 300);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({
      code: '',
      name: '',
      type: '',
      status: ''
    });
    setFilteredList(oilList);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentOil(record);
    setDetailVisible(true);
  };

  // 获取状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '正常':
        return '#52c41a';
      case '停售':
        return '#f5222d';
      case '即将停售':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '油品代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: '油品名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '油品类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      filters: [
        { text: '汽油', value: '汽油' },
        { text: '柴油', value: '柴油' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '标准',
      dataIndex: 'standard',
      key: 'standard',
      width: 100,
    },
    {
      title: '密度(g/cm³)',
      dataIndex: 'density',
      key: 'density',
      width: 120,
      sorter: (a, b) => a.density - b.density,
    },
    {
      title: '价格(元/L)',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (text) => `¥${text.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <Tag color={getStatusColor(text)}>{text}</Tag>,
      filters: [
        { text: '正常', value: '正常' },
        { text: '停售', value: '停售' },
        { text: '即将停售', value: '即将停售' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="primary"  size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ),
    },
  ];

  // 渲染筛选表单
  const renderFilterForm = () => (
    <Form
      form={searchForm}
      layout="inline"
      onFinish={handleSearch}
      initialValues={searchParams}
    >
      <Form.Item name="code" label="油品代码">
        <Input placeholder="请输入油品代码" allowClear />
      </Form.Item>
      <Form.Item name="name" label="油品名称">
        <Input placeholder="请输入油品名称" allowClear />
      </Form.Item>
      <Form.Item name="type" label="油品类型">
        <Select placeholder="请选择油品类型" allowClear style={{ width: 150 }}>
          <Option value="汽油">汽油</Option>
          <Option value="柴油">柴油</Option>
          <Option value="燃料油">燃料油</Option>
        </Select>
      </Form.Item>
      
      {expandFilter && (
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" allowClear style={{ width: 150 }}>
            <Option value="正常">正常</Option>
            <Option value="停售">停售</Option>
            <Option value="即将停售">即将停售</Option>
          </Select>
        </Form.Item>
      )}
      
      <Form.Item>
        <Space>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: '#32AF50', borderColor: '#32AF50' }}>
            查询
          </Button>
          <Button type="primary"  onClick={() => setExpandFilter(!expandFilter)}>
            {expandFilter ? '收起' : '展开'} {expandFilter ? '▲' : '▼'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <div className="oil-info-page">
      <h2 style={{ marginBottom: '20px' }}>油品信息管理</h2>
      
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="筛选条件" style={{ marginBottom: '16px' }}>
            {renderFilterForm()}
          </Card>
        </Col>
        
        <Col xs={24}>
          <Card 
            title="油品信息列表"
            extra={
              <Space>
                <Button 
                  icon={<SyncOutlined />} 
                  onClick={fetchOilData}
                >
                  刷新
                </Button>
                <Button 
                  icon={<DownloadOutlined />}
                  style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}
                >
                  导出
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
                  <Statistic 
                    title="总油品数" 
                    value={filteredList.length}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                  <Statistic 
                    title="汽油品种" 
                    value={filteredList.filter(oil => oil.type === '汽油').length}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#fffbe6', borderColor: '#ffe58f' }}>
                  <Statistic 
                    title="柴油品种" 
                    value={filteredList.filter(oil => oil.type === '柴油').length}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#fff0f6', borderColor: '#ffadd2' }}>
                  <Statistic 
                    title="停售油品" 
                    value={filteredList.filter(oil => oil.status === '停售').length} 
                    valueStyle={{ color: '#eb2f96' }}
                  />
                </Card>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredList}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详情弹窗 */}
      <Modal
        title="油品详细信息"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {currentOil && (
          <>
            <Card title="基本信息" bordered={false} style={{ marginBottom: 16 }}>
              <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="油品代码">{currentOil.code}</Descriptions.Item>
                <Descriptions.Item label="油品名称">{currentOil.name}</Descriptions.Item>
                <Descriptions.Item label="完整名称">{currentOil.fullName}</Descriptions.Item>
                <Descriptions.Item label="油品类型">{currentOil.type}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={getStatusColor(currentOil.status)}>{currentOil.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="颜色">{currentOil.color}</Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>{currentOil.description}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="技术指标" bordered={false} style={{ marginBottom: 16 }}>
              <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="密度">
                  {currentOil.density} g/cm³ ({currentOil.densityTemperature}℃)
                </Descriptions.Item>
                {currentOil.type === '汽油' ? (
                  <Descriptions.Item label="辛烷值">{currentOil.octaneNumber}</Descriptions.Item>
                ) : (
                  <Descriptions.Item label="十六烷值">{currentOil.cetaneNumber}</Descriptions.Item>
                )}
                <Descriptions.Item label="硫含量">{currentOil.sulfurContent}</Descriptions.Item>
                <Descriptions.Item label="标准">{currentOil.standard}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="价格信息" bordered={false} style={{ marginBottom: 16 }}>
              <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="零售价格">¥{currentOil.price.toFixed(2)} 元/L</Descriptions.Item>
                <Descriptions.Item label="税率">{(currentOil.taxRate * 100).toFixed(0)}%</Descriptions.Item>
                <Descriptions.Item label="桶装价格">¥{currentOil.barrelPrice.toFixed(2)} 元/桶</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="系统信息" bordered={false}>
              <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="创建时间">{currentOil.createTime}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{currentOil.updateTime}</Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default OilInfo; 