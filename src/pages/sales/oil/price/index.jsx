import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Table, 
  Space, 
  DatePicker, 
  Select, 
  Row, 
  Col, 
  Statistic, 
  Drawer, 
  Descriptions, 
  Tag, 
  Divider,
  message,
  Tooltip,
  Popconfirm,
  InputNumber,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  EyeOutlined, 
  EditOutlined, 
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  LineChartOutlined,
  BarChartOutlined,
  RiseOutlined,
  CheckOutlined,
  StopOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 生成模拟数据
const generateMockData = () => {
  const stations = ['油站1', '油站2', '油站3', '油站4', '油站5'];
  const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油'];
  const statuses = ['待生效', '已生效', '已取消'];
  
  const mockData = [];
  
  for (let i = 1; i <= 25; i++) {
    const station = stations[Math.floor(Math.random() * stations.length)];
    const oilType = oilTypes[Math.floor(Math.random() * oilTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const oldPrice = (7.5 + Math.random() * 2).toFixed(2);
    const newPrice = (parseFloat(oldPrice) + (Math.random() * 0.4 - 0.2)).toFixed(2);
    
    // 创建日期在过去30天内
    const createDate = moment().subtract(Math.floor(Math.random() * 30), 'days');
    // 生效日期在创建日期之后的1-7天
    const effectiveDate = moment(createDate).add(Math.floor(Math.random() * 7) + 1, 'days');
    
    mockData.push({
      id: `PRC2023${10000 + i}`,
      station,
      oilType,
      oldPrice: parseFloat(oldPrice),
      newPrice: parseFloat(newPrice),
      effectiveDate: effectiveDate.format('YYYY-MM-DD'),
      status,
      creator: ['张三', '李四', '王五'][Math.floor(Math.random() * 3)],
      createTime: createDate.format('YYYY-MM-DD HH:mm:ss'),
      approver: status !== '待生效' ? ['赵六', '钱七', '孙八'][Math.floor(Math.random() * 3)] : null,
      approvalTime: status !== '待生效' ? moment(createDate).add(Math.floor(Math.random() * 2) + 1, 'days').format('YYYY-MM-DD HH:mm:ss') : null,
      remark: Math.random() > 0.5 ? '根据市场价格波动进行调整' : ''
    });
  }
  
  return mockData;
};

const OilPriceManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条记录`
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [approvalDrawerVisible, setApprovalDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [approvalForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [statisticsData, setStatisticsData] = useState({
    totalChanges: 0,
    pendingChanges: 0,
    effectiveChanges: 0
  });
  
  const navigate = useNavigate();

  // 初始加载数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = (params = {}) => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setPagination({
        ...pagination,
        total: mockData.length
      });
      
      // 计算统计数据
      const totalChanges = mockData.length;
      const pendingChanges = mockData.filter(item => item.status === '待生效').length;
      const effectiveChanges = mockData.filter(item => item.status === '已生效').length;
      
      setStatisticsData({
        totalChanges,
        pendingChanges,
        effectiveChanges
      });
      
      setLoading(false);
    }, 1000);
  };

  // 修复useEffect依赖
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]); // 添加pagination.current和pagination.pageSize作为依赖项

  // 处理表格变化
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    fetchData({
      pageSize: pagination.pageSize,
      current: pagination.current,
      ...filters,
      ...sorter
    });
  };

  // 处理查询
  const handleSearch = (values) => {
    console.log('查询条件:', values);
    fetchData(values);
  };

  // 重置查询条件
  const handleReset = () => {
    form.resetFields();
    fetchData();
  };

  // 导出数据
  const handleExport = () => {
    message.success('数据导出成功');
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 编辑价格调整
  const handleEdit = (record) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      oilType: record.oilType,
      station: record.station,
      oldPrice: record.oldPrice,
      newPrice: record.newPrice,
      effectiveDate: moment(record.effectiveDate),
      remarks: record.remark || ''
    });
    setEditModalVisible(true);
  };

  // 提交编辑
  const handleEditSubmit = (values) => {
    console.log('编辑提交的数据:', values);
    message.success('价格调整编辑成功');
    setEditModalVisible(false);
    fetchData();
  };

  // 打开审批抽屉
  const handleApproval = (record) => {
    setCurrentRecord(record);
    approvalForm.resetFields();
    setApprovalDrawerVisible(true);
  };

  // 提交审批
  const handleApprovalSubmit = (values) => {
    console.log('审批提交的数据:', values);
    message.success(`价格调整已${values.approvalResult === 'approved' ? '通过' : '拒绝'}`);
    setApprovalDrawerVisible(false);
    fetchData();
  };

  // 取消价格调整
  const handleCancel = (record) => {
    console.log('取消价格调整:', record);
    message.success('价格调整已取消');
    fetchData();
  };

  // 新增价格调整
  const handleAdd = () => {
    navigate('/sales/oil/price/add');
  };

  // 渲染状态标签
  const renderStatusTag = (status) => {
    const statusMap = {
      '待生效': { color: 'blue', text: '待生效' },
      '已生效': { color: 'green', text: '已生效' },
      '已取消': { color: 'default', text: '已取消' }
    };
    
    const { color, text } = statusMap[status] || { color: 'default', text: '未知状态' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '调整单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
      render: (text) => <a onClick={() => handleViewDetail({ id: text })}>{text}</a>
    },
    {
      title: '油站',
      dataIndex: 'station',
      key: 'station',
      width: 120
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 120
    },
    {
      title: '当前价格(元/L)',
      dataIndex: 'oldPrice',
      key: 'oldPrice',
      width: 140,
      render: (text) => `¥ ${text.toFixed(2)}`
    },
    {
      title: '新价格(元/L)',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 140,
      render: (text) => `¥ ${text.toFixed(2)}`
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120,
      sorter: (a, b) => moment(a.effectiveDate).unix() - moment(b.effectiveDate).unix()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: '待生效', value: '待生效' },
        { text: '已生效', value: '已生效' },
        { text: '已取消', value: '已取消' }
      ],
      render: renderStatusTag
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a, b) => moment(a.createTime).unix() - moment(b.createTime).unix()
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)} 
          >
            详情
          </Button>
          
          {record.status === '待生效' && (
            <>
              <Button 
                type="default" 
                size="small"
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)} 
              >
                编辑
              </Button>
              
              <Button 
                type="primary" 
                ghost
                size="small"
                icon={<CheckOutlined />} 
                onClick={() => handleApproval(record)}
                style={{ color: '#32AF50', borderColor: '#32AF50' }}
              >
                审批
              </Button>
              
              <Popconfirm
                title="确定要取消此价格调整吗?"
                onConfirm={() => handleCancel(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="primary" 
                  danger
                  size="small"
                  icon={<StopOutlined />}
                >
                  取消
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="oil-price-management">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="价格调整总数" 
              value={statisticsData.totalChanges} 
              suffix="次" 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="待生效调整" 
              value={statisticsData.pendingChanges} 
              suffix="次" 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="已生效调整" 
              value={statisticsData.effectiveChanges} 
              suffix="次" 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSearch}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="id" label="调整单号">
                <Input placeholder="请输入调整单号" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="station" label="油站">
                <Select placeholder="请选择油站" allowClear>
                  <Option value="油站1">油站1</Option>
                  <Option value="油站2">油站2</Option>
                  <Option value="油站3">油站3</Option>
                  <Option value="油站4">油站4</Option>
                  <Option value="油站5">油站5</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="oilType" label="油品类型">
                <Select placeholder="请选择油品类型" allowClear>
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="待生效">待生效</Option>
                  <Option value="已生效">已生效</Option>
                  <Option value="已取消">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="生效日期">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                  <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                    查询
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新增
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<FileTextOutlined />} 
                    onClick={() => navigate('/sales/oil/price/application')}
                  >
                    调价申请
                  </Button>
                  <Button icon={<ExportOutlined />} onClick={handleExport}>
                    导出
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="价格调整详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentRecord && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="价格编号" span={2}>{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="油品类型">{currentRecord.oilType}</Descriptions.Item>
              <Descriptions.Item label="加油站">{currentRecord.station}</Descriptions.Item>
              <Descriptions.Item label="原价(元/升)">¥{currentRecord.oldPrice.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="新价(元/升)">¥{currentRecord.newPrice.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="生效日期">{currentRecord.effectiveDate}</Descriptions.Item>
              <Descriptions.Item label="状态">{renderStatusTag(currentRecord.status)}</Descriptions.Item>
              <Descriptions.Item label="创建人">{currentRecord.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{currentRecord.remark || '无'}</Descriptions.Item>
            </Descriptions>
            
            {['已生效', '已取消'].includes(currentRecord.status) && (
              <>
                <Divider orientation="left">审批信息</Divider>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="审批人">{currentRecord.approver}</Descriptions.Item>
                  <Descriptions.Item label="审批时间">{currentRecord.approvalTime}</Descriptions.Item>
                  <Descriptions.Item label="审批结果">
                    {currentRecord.status === '已取消' ? 
                      <Tag color="red">拒绝</Tag> : 
                      <Tag color="green">通过</Tag>
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label="审批意见" span={2}>
                    {currentRecord.remark || '无'}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </>
        )}
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        title="编辑价格调整"
        open={editModalVisible}
        onOk={() => editForm.submit()}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={700}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="oilType"
                label="油品类型"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="station"
                label="加油站"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="oldPrice"
                label="原价(元/升)"
              >
                <InputNumber 
                  disabled 
                  style={{ width: '100%' }} 
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="newPrice"
                label="新价(元/升)"
                rules={[{ required: true, message: '请输入新价格' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0}
                  step={0.01}
                  precision={2}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="effectiveDate"
                label="生效日期"
                rules={[{ required: true, message: '请选择生效日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="备注"
              >
                <TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 审批抽屉 */}
      <Drawer
        title="价格调整审批"
        width={600}
        open={approvalDrawerVisible}
        onClose={() => setApprovalDrawerVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setApprovalDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => approvalForm.submit()}>
              提交
            </Button>
          </Space>
        }
      >
        {currentRecord && (
          <>
            <Descriptions title="价格调整信息" bordered column={2}>
              <Descriptions.Item label="价格编号" span={2}>{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="油品类型">{currentRecord.oilType}</Descriptions.Item>
              <Descriptions.Item label="加油站">{currentRecord.station}</Descriptions.Item>
              <Descriptions.Item label="原价(元/升)">¥{currentRecord.oldPrice.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="新价(元/升)">¥{currentRecord.newPrice.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="生效日期">{currentRecord.effectiveDate}</Descriptions.Item>
              <Descriptions.Item label="创建人">{currentRecord.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{currentRecord.remark || '无'}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Form
              form={approvalForm}
              layout="vertical"
              onFinish={handleApprovalSubmit}
            >
              <Form.Item
                name="approvalResult"
                label="审批结果"
                rules={[{ required: true, message: '请选择审批结果' }]}
              >
                <Select placeholder="请选择审批结果">
                  <Option value="approved">通过</Option>
                  <Option value="rejected">拒绝</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="approvalComments"
                label="审批意见"
                rules={[{ required: true, message: '请输入审批意见' }]}
              >
                <TextArea rows={4} placeholder="请输入审批意见" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Button 
                    type="primary" 
                    block 
                    icon={<CheckOutlined />}
                    onClick={() => {
                      approvalForm.setFieldsValue({
                        approvalResult: 'approved',
                        approvalComments: '价格调整合理，同意执行'
                      });
                      approvalForm.submit();
                    }}
                  >
                    快速通过
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    danger 
                    block 
                    icon={<StopOutlined />}
                    onClick={() => {
                      approvalForm.setFieldsValue({
                        approvalResult: 'rejected',
                        approvalComments: '价格调整幅度过大，需要重新评估'
                      });
                      approvalForm.submit();
                    }}
                  >
                    快速拒绝
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default OilPriceManagement; 