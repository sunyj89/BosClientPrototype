import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber,
  Select,
  Breadcrumb, 
  message, 
  Row,
  Col,
  DatePicker,
  Tabs,
  Statistic
} from 'antd';
import { 
  EditOutlined, 
  HistoryOutlined, 
  SearchOutlined,
  ReloadOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GoodsPriceManagement = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('调整价格');
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [currentGoodsId, setCurrentGoodsId] = useState(null);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  
  // 模拟数据
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      id: '1001',
      name: '可口可乐',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      costPrice: 2.5,
      retailPrice: 3.5,
      memberPrice: 3.2,
      vipPrice: 3.0,
      lastUpdateTime: '2025-03-10 10:30:00',
      updater: '张三',
    },
    {
      key: '2',
      id: '1002',
      name: '百事可乐',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      costPrice: 2.3,
      retailPrice: 3.5,
      memberPrice: 3.2,
      vipPrice: 3.0,
      lastUpdateTime: '2025-03-10 10:35:00',
      updater: '张三',
    },
    {
      key: '3',
      id: '1003',
      name: '雪碧',
      category: '饮料',
      specification: '330ml/罐',
      unit: '罐',
      costPrice: 2.4,
      retailPrice: 3.5,
      memberPrice: 3.2,
      vipPrice: 3.0,
      lastUpdateTime: '2025-03-10 10:40:00',
      updater: '张三',
    },
    {
      key: '4',
      id: '1004',
      name: '农夫山泉',
      category: '饮料',
      specification: '550ml/瓶',
      unit: '瓶',
      costPrice: 1.5,
      retailPrice: 2.0,
      memberPrice: 1.8,
      vipPrice: 1.6,
      lastUpdateTime: '2025-03-10 10:45:00',
      updater: '张三',
    },
    {
      key: '5',
      id: '1005',
      name: '康师傅方便面',
      category: '食品',
      specification: '100g/包',
      unit: '包',
      costPrice: 2.8,
      retailPrice: 4.5,
      memberPrice: 4.2,
      vipPrice: 4.0,
      lastUpdateTime: '2025-03-10 11:00:00',
      updater: '张三',
    },
    {
      key: '6',
      id: '1006',
      name: '统一方便面',
      category: '食品',
      specification: '100g/包',
      unit: '包',
      costPrice: 2.7,
      retailPrice: 4.5,
      memberPrice: 4.2,
      vipPrice: 4.0,
      lastUpdateTime: '2025-03-10 11:05:00',
      updater: '张三',
    },
    {
      key: '7',
      id: '1007',
      name: '洗发水',
      category: '日用品',
      specification: '400ml/瓶',
      unit: '瓶',
      costPrice: 25.0,
      retailPrice: 38.0,
      memberPrice: 35.0,
      vipPrice: 32.0,
      lastUpdateTime: '2025-03-10 11:10:00',
      updater: '张三',
    },
    {
      key: '8',
      id: '1008',
      name: '沐浴露',
      category: '日用品',
      specification: '400ml/瓶',
      unit: '瓶',
      costPrice: 22.0,
      retailPrice: 35.0,
      memberPrice: 32.0,
      vipPrice: 30.0,
      lastUpdateTime: '2025-03-10 11:15:00',
      updater: '张三',
    },
  ]);

  // 模拟价格历史记录数据
  const [historyData, setHistoryData] = useState([
    {
      key: '1',
      goodsId: '1001',
      priceType: '零售价',
      beforePrice: 3.0,
      afterPrice: 3.5,
      updateTime: '2025-03-10 10:30:00',
      updater: '张三',
      remark: '价格调整',
    },
    {
      key: '2',
      goodsId: '1001',
      priceType: '会员价',
      beforePrice: 2.8,
      afterPrice: 3.2,
      updateTime: '2025-03-10 10:30:00',
      updater: '张三',
      remark: '价格调整',
    },
    {
      key: '3',
      goodsId: '1001',
      priceType: 'VIP价',
      beforePrice: 2.5,
      afterPrice: 3.0,
      updateTime: '2025-03-10 10:30:00',
      updater: '张三',
      remark: '价格调整',
    },
    {
      key: '4',
      goodsId: '1001',
      priceType: '成本价',
      beforePrice: 2.0,
      afterPrice: 2.5,
      updateTime: '2025-03-09 14:20:00',
      updater: '李四',
      remark: '成本上涨',
    },
  ]);

  // 表格列配置
  const columns = [
    {
      title: '商品编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
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
        { text: '饮料', value: '饮料' },
        { text: '食品', value: '食品' },
        { text: '日用品', value: '日用品' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '成本价(元)',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.costPrice - b.costPrice,
    },
    {
      title: '零售价(元)',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.retailPrice - b.retailPrice,
    },
    {
      title: '会员价(元)',
      dataIndex: 'memberPrice',
      key: 'memberPrice',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.memberPrice - b.memberPrice,
    },
    {
      title: 'VIP价(元)',
      dataIndex: 'vipPrice',
      key: 'vipPrice',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.vipPrice - b.vipPrice,
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      sorter: (a, b) => new Date(a.lastUpdateTime) - new Date(b.lastUpdateTime),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            调整
          </Button>
          <Button 
            type="primary" 
            icon={<HistoryOutlined />} 
            size="small"
            onClick={() => handleViewHistory(record.id)}
          >
            历史
          </Button>
          <Button 
            type="primary" 
            icon={<LineChartOutlined />} 
            size="small"
            onClick={() => handleViewChart(record.id)}
          >
            趋势
          </Button>
        </Space>
      ),
    },
  ];

  // 历史记录表格列配置
  const historyColumns = [
    {
      title: '价格类型',
      dataIndex: 'priceType',
      key: 'priceType',
      filters: [
        { text: '零售价', value: '零售价' },
        { text: '会员价', value: '会员价' },
        { text: 'VIP价', value: 'VIP价' },
        { text: '成本价', value: '成本价' },
      ],
      onFilter: (value, record) => record.priceType === value,
    },
    {
      title: '调整前价格(元)',
      dataIndex: 'beforePrice',
      key: 'beforePrice',
      render: (text) => text.toFixed(2),
    },
    {
      title: '调整后价格(元)',
      dataIndex: 'afterPrice',
      key: 'afterPrice',
      render: (text) => text.toFixed(2),
    },
    {
      title: '调整时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a, b) => new Date(a.updateTime) - new Date(b.updateTime),
    },
    {
      title: '操作人',
      dataIndex: 'updater',
      key: 'updater',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // 处理编辑按钮点击
  const handleEdit = (record) => {
    setModalTitle('调整价格');
    setEditingRecord(record);
    form.resetFields();
    form.setFieldsValue({
      goodsId: record.id,
      goodsName: record.name,
      costPrice: record.costPrice,
      retailPrice: record.retailPrice,
      memberPrice: record.memberPrice,
      vipPrice: record.vipPrice,
    });
    setModalVisible(true);
  };

  // 处理查看历史按钮点击
  const handleViewHistory = (goodsId) => {
    if (!goodsId) {
      message.error('商品ID无效，无法查看历史记录');
      return;
    }
    setCurrentGoodsId(goodsId);
    setHistoryModalVisible(true);
  };

  // 处理查看趋势图按钮点击
  const handleViewChart = (goodsId) => {
    if (!goodsId) {
      message.error('商品ID无效，无法查看价格趋势');
      return;
    }
    setCurrentGoodsId(goodsId);
    setChartModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const { costPrice, retailPrice, memberPrice, vipPrice, remark } = values;
          
          // 添加历史记录
          const newHistoryRecords = [];
          
          if (costPrice !== editingRecord.costPrice) {
            newHistoryRecords.push({
              key: (parseInt(historyData[historyData.length - 1]?.key || '0') + 1).toString(),
              goodsId: editingRecord.id,
              priceType: '成本价',
              beforePrice: editingRecord.costPrice,
              afterPrice: costPrice,
              updateTime: new Date().toLocaleString(),
              updater: '当前用户',
              remark: remark || '价格调整',
            });
          }
          
          if (retailPrice !== editingRecord.retailPrice) {
            newHistoryRecords.push({
              key: (parseInt(historyData[historyData.length - 1]?.key || '0') + newHistoryRecords.length + 1).toString(),
              goodsId: editingRecord.id,
              priceType: '零售价',
              beforePrice: editingRecord.retailPrice,
              afterPrice: retailPrice,
              updateTime: new Date().toLocaleString(),
              updater: '当前用户',
              remark: remark || '价格调整',
            });
          }
          
          if (memberPrice !== editingRecord.memberPrice) {
            newHistoryRecords.push({
              key: (parseInt(historyData[historyData.length - 1]?.key || '0') + newHistoryRecords.length + 1).toString(),
              goodsId: editingRecord.id,
              priceType: '会员价',
              beforePrice: editingRecord.memberPrice,
              afterPrice: memberPrice,
              updateTime: new Date().toLocaleString(),
              updater: '当前用户',
              remark: remark || '价格调整',
            });
          }
          
          if (vipPrice !== editingRecord.vipPrice) {
            newHistoryRecords.push({
              key: (parseInt(historyData[historyData.length - 1]?.key || '0') + newHistoryRecords.length + 1).toString(),
              goodsId: editingRecord.id,
              priceType: 'VIP价',
              beforePrice: editingRecord.vipPrice,
              afterPrice: vipPrice,
              updateTime: new Date().toLocaleString(),
              updater: '当前用户',
              remark: remark || '价格调整',
            });
          }
          
          if (newHistoryRecords.length > 0) {
            // 更新商品价格
            const updatedDataSource = dataSource.map(item => {
              if (item.key === editingRecord.key) {
                return { 
                  ...item, 
                  costPrice, 
                  retailPrice, 
                  memberPrice, 
                  vipPrice,
                  lastUpdateTime: new Date().toLocaleString(),
                  updater: '当前用户',
                };
              }
              return item;
            });
            
            setDataSource(updatedDataSource);
            setHistoryData([...historyData, ...newHistoryRecords]);
            message.success('价格调整成功！');
          } else {
            message.info('价格未发生变化！');
          }
          
          setLoading(false);
          setModalVisible(false);
        }, 500);
      })
      .catch(info => {
        console.log('验证失败:', info);
      });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理历史记录模态框取消
  const handleHistoryModalCancel = () => {
    setHistoryModalVisible(false);
  };

  // 处理趋势图模态框取消
  const handleChartModalCancel = () => {
    setChartModalVisible(false);
  };

  // 获取指定商品的历史记录
  const getGoodsHistory = (goodsId) => {
    if (!goodsId) {
      return [];
    }
    return historyData.filter(item => item.goodsId === goodsId);
  };

  // 获取指定商品的价格趋势数据
  const getGoodsPriceTrend = (goodsId) => {
    // 确保goodsId存在
    if (!goodsId) {
      return {
        dates: [],
        costPrice: [],
        retailPrice: [],
        memberPrice: [],
        vipPrice: [],
      };
    }
    
    // 这里应该从历史记录中提取数据，但为了简化，我们使用模拟数据
    return {
      dates: ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'],
      costPrice: [2.0, 2.0, 2.2, 2.3, 2.4, 2.5],
      retailPrice: [3.0, 3.0, 3.2, 3.3, 3.4, 3.5],
      memberPrice: [2.8, 2.8, 3.0, 3.1, 3.2, 3.2],
      vipPrice: [2.5, 2.5, 2.7, 2.8, 2.9, 3.0],
    };
  };

  // 价格趋势图配置
  const getPriceTrendOption = (goodsId) => {
    // 确保goodsId存在
    if (!goodsId) {
      return {
        title: {
          text: '商品价格趋势',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['成本价', '零售价', '会员价', 'VIP价'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
          name: '价格(元)',
        },
        series: [
          {
            name: '成本价',
            type: 'line',
            data: [],
          },
          {
            name: '零售价',
            type: 'line',
            data: [],
          },
          {
            name: '会员价',
            type: 'line',
            data: [],
          },
          {
            name: 'VIP价',
            type: 'line',
            data: [],
          },
        ],
      };
    }
    
    const data = getGoodsPriceTrend(goodsId);
    
    return {
      title: {
        text: '商品价格趋势',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['成本价', '零售价', '会员价', 'VIP价'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates,
      },
      yAxis: {
        type: 'value',
        name: '价格(元)',
      },
      series: [
        {
          name: '成本价',
          type: 'line',
          data: data.costPrice,
        },
        {
          name: '零售价',
          type: 'line',
          data: data.retailPrice,
        },
        {
          name: '会员价',
          type: 'line',
          data: data.memberPrice,
        },
        {
          name: 'VIP价',
          type: 'line',
          data: data.vipPrice,
        },
      ],
    };
  };

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/goods">商品管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>价格管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>商品价格管理</h2>
      </div>

      <Card>
        {/* 搜索区域 */}
        <div className="search-container" style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item name="goodsId" label="商品编号">
              <Input placeholder="请输入商品编号" />
            </Form.Item>
            <Form.Item name="goodsName" label="商品名称">
              <Input placeholder="请输入商品名称" />
            </Form.Item>
            <Form.Item name="category" label="商品分类">
              <Select placeholder="请选择分类" style={{ width: 120 }} allowClear>
                <Option value="饮料">饮料</Option>
                <Option value="食品">食品</Option>
                <Option value="日用品">日用品</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button icon={<ReloadOutlined />}>
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 调整价格模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          name="priceForm"
        >
          <Form.Item
            name="goodsId"
            label="商品编号"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="goodsName"
            label="商品名称"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="costPrice"
            label="成本价(元)"
            rules={[
              { required: true, message: '请输入成本价' },
              { type: 'number', min: 0.01, message: '价格必须大于0' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0.01} precision={2} />
          </Form.Item>
          
          <Form.Item
            name="retailPrice"
            label="零售价(元)"
            rules={[
              { required: true, message: '请输入零售价' },
              { type: 'number', min: 0.01, message: '价格必须大于0' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0.01} precision={2} />
          </Form.Item>
          
          <Form.Item
            name="memberPrice"
            label="会员价(元)"
            rules={[
              { required: true, message: '请输入会员价' },
              { type: 'number', min: 0.01, message: '价格必须大于0' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0.01} precision={2} />
          </Form.Item>
          
          <Form.Item
            name="vipPrice"
            label="VIP价(元)"
            rules={[
              { required: true, message: '请输入VIP价' },
              { type: 'number', min: 0.01, message: '价格必须大于0' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0.01} precision={2} />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 历史记录模态框 */}
      <Modal
        title="价格调整历史"
        open={historyModalVisible}
        onCancel={handleHistoryModalCancel}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form layout="inline">
                <Form.Item label="价格类型">
                  <Select placeholder="请选择价格类型" style={{ width: 120 }} allowClear>
                    <Option value="零售价">零售价</Option>
                    <Option value="会员价">会员价</Option>
                    <Option value="VIP价">VIP价</Option>
                    <Option value="成本价">成本价</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="调整时间">
                  <RangePicker />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button icon={<ReloadOutlined />}>
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
        <Table 
          columns={historyColumns} 
          dataSource={getGoodsHistory(currentGoodsId)} 
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      {/* 价格趋势图模态框 */}
      <Modal
        title="价格趋势分析"
        open={chartModalVisible}
        onCancel={handleChartModalCancel}
        footer={null}
        width={800}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          items={[
            {
              key: '1',
              label: '价格趋势',
              children: <ReactECharts option={getPriceTrendOption(currentGoodsId)} style={{ height: 400 }} />
            },
            {
              key: '2',
              label: '价格对比',
              children: (
                <div style={{ padding: '20px 0' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="零售价与成本价对比">
                        <Statistic
                          title="毛利率"
                          value={(() => {
                            const item = dataSource.find(item => item.id === currentGoodsId);
                            if (!item) return 0;
                            return ((item.retailPrice - item.costPrice) / item.retailPrice * 100).toFixed(2);
                          })()}
                          suffix="%"
                          precision={2}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="会员价折扣">
                        <Statistic
                          title="折扣率"
                          value={(() => {
                            const item = dataSource.find(item => item.id === currentGoodsId);
                            if (!item) return 0;
                            return (item.memberPrice / item.retailPrice * 100).toFixed(2);
                          })()}
                          suffix="%"
                          precision={2}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            }
          ]}
        />
      </Modal>
    </div>
  );
};

export default GoodsPriceManagement; 