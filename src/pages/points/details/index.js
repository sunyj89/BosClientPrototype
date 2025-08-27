import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Tag, 
  Modal,
  Descriptions,
  message
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PointsDetails = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟详细数据
  const mockData = [
    {
      id: 'PT20240115001',
      transactionId: 'TX20240115143025001',
      memberName: '张三',
      memberPhone: '138****5678',
      memberCardNo: 'VIP20231001',
      pointsChange: +500,
      pointsBalanceBefore: 750,
      pointsBalanceAfter: 1250,
      changeType: 'earn',
      source: '消费获得',
      businessType: 'fuel_purchase',
      businessAmount: 500.00,
      conversionRate: 1.0,
      description: '加油消费500元获得积分',
      operatorName: '系统自动',
      operatorId: 'SYS001',
      stationName: '赣中分公司-南昌东服务区-1号油站',
      stationCode: 'ST001',
      deviceInfo: 'POS001',
      createTime: '2024-01-15 14:30:25',
      remark: '正常积分获得',
      status: 'success'
    },
    {
      id: 'PT20240115002',
      transactionId: 'TX20240115134518002',
      memberName: '李四',
      memberPhone: '139****1234',
      memberCardNo: 'VIP20231002',
      pointsChange: -200,
      pointsBalanceBefore: 1000,
      pointsBalanceAfter: 800,
      changeType: 'redeem',
      source: '积分兑换',
      businessType: 'service_redeem',
      businessAmount: 0,
      conversionRate: 0,
      description: '兑换洗车服务',
      operatorName: '王五',
      operatorId: 'OP001',
      stationName: '赣中分公司-南昌东服务区-1号油站',
      stationCode: 'ST001',
      deviceInfo: 'POS002',
      createTime: '2024-01-15 13:45:18',
      remark: '积分兑换洗车服务',
      status: 'success'
    },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDataSource(mockData);
      setPagination(prev => ({ ...prev, total: 50 }));
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (values) => {
    console.log('搜索条件:', values);
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: '明细编号',
      dataIndex: 'id',
      width: 140,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: '交易流水号',
      dataIndex: 'transactionId',
      width: 160,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: '会员信息',
      dataIndex: 'memberName',
      width: 140,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>{record.memberPhone}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>{record.memberCardNo}</div>
        </div>
      ),
    },
    {
      title: '积分变动',
      dataIndex: 'pointsChange',
      width: 100,
      render: (value) => (
        <span style={{ 
          color: value > 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {value > 0 ? <PlusOutlined /> : <MinusOutlined />}
          {Math.abs(value)}
        </span>
      ),
    },
    {
      title: '积分余额',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            变动前: {record.pointsBalanceBefore}
          </div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            变动后: {record.pointsBalanceAfter}
          </div>
        </div>
      ),
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      width: 100,
      render: (value) => {
        const typeMap = {
          fuel_purchase: '加油消费',
          service_redeem: '服务兑换',
          goods_redeem: '商品兑换',
          activity_reward: '活动奖励',
          manual_adjust: '人工调整'
        };
        return <Tag>{typeMap[value] || value}</Tag>;
      },
    },
    {
      title: '业务金额',
      dataIndex: 'businessAmount',
      width: 100,
      render: (value) => value > 0 ? `￥${value.toFixed(2)}` : '-',
    },
    {
      title: '兑换比例',
      dataIndex: 'conversionRate',
      width: 80,
      render: (value) => value > 0 ? `1:${value}` : '-',
    },
    {
      title: '操作员',
      dataIndex: 'operatorName',
      width: 100,
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (value) => (
        <Tag color={value === 'success' ? 'green' : 'red'}>
          {value === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          style={{ borderRadius: '2px' }}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 筛选区域 */}
      <Card style={{ marginBottom: '16px', background: '#fff' }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="id" label="明细编号">
            <Input placeholder="请输入明细编号" style={{ width: 150 }} />
          </Form.Item>
          
          <Form.Item name="transactionId" label="交易流水号">
            <Input placeholder="请输入交易流水号" style={{ width: 150 }} />
          </Form.Item>
          
          <Form.Item name="memberName" label="会员姓名">
            <Input placeholder="请输入会员姓名" style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item name="businessType" label="业务类型">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Option value="fuel_purchase">加油消费</Option>
              <Option value="service_redeem">服务兑换</Option>
              <Option value="goods_redeem">商品兑换</Option>
              <Option value="activity_reward">活动奖励</Option>
              <Option value="manual_adjust">人工调整</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="changeType" label="变动类型">
            <Select placeholder="请选择" style={{ width: 100 }} allowClear>
              <Option value="earn">获得</Option>
              <Option value="redeem">消耗</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="dateRange" label="操作时间">
            <RangePicker 
              placeholder={['开始时间', '结束时间']}
              style={{ width: 200 }}
            />
          </Form.Item>
        </Form>
        
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />}
              style={{ borderRadius: '2px' }}
              onClick={handleSearch}
            >
              查询
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
              style={{ borderRadius: '2px' }}
            >
              重置
            </Button>
            <Button 
              type="primary" 
              icon={<ExportOutlined />}
              style={{ borderRadius: '2px' }}
            >
              导出
            </Button>
          </Space>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card title="积分明细列表">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={setPagination}
          rowKey="id"
          scroll={{ x: 1500 }}
          size="middle"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="积分明细详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="明细编号">
              {selectedRecord.id}
            </Descriptions.Item>
            <Descriptions.Item label="交易流水号">
              {selectedRecord.transactionId}
            </Descriptions.Item>
            <Descriptions.Item label="会员姓名">
              {selectedRecord.memberName}
            </Descriptions.Item>
            <Descriptions.Item label="会员手机">
              {selectedRecord.memberPhone}
            </Descriptions.Item>
            <Descriptions.Item label="会员卡号">
              {selectedRecord.memberCardNo}
            </Descriptions.Item>
            <Descriptions.Item label="积分变动">
              <span style={{ 
                color: selectedRecord.pointsChange > 0 ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold'
              }}>
                {selectedRecord.pointsChange > 0 ? '+' : ''}{selectedRecord.pointsChange}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="变动前余额">
              {selectedRecord.pointsBalanceBefore}
            </Descriptions.Item>
            <Descriptions.Item label="变动后余额">
              {selectedRecord.pointsBalanceAfter}
            </Descriptions.Item>
            <Descriptions.Item label="业务类型">
              {selectedRecord.businessType}
            </Descriptions.Item>
            <Descriptions.Item label="业务金额">
              {selectedRecord.businessAmount > 0 ? `￥${selectedRecord.businessAmount.toFixed(2)}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="兑换比例">
              {selectedRecord.conversionRate > 0 ? `1:${selectedRecord.conversionRate}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="来源">
              {selectedRecord.source}
            </Descriptions.Item>
            <Descriptions.Item label="操作员">
              {selectedRecord.operatorName}
            </Descriptions.Item>
            <Descriptions.Item label="操作员ID">
              {selectedRecord.operatorId}
            </Descriptions.Item>
            <Descriptions.Item label="所属油站">
              {selectedRecord.stationName}
            </Descriptions.Item>
            <Descriptions.Item label="油站编码">
              {selectedRecord.stationCode}
            </Descriptions.Item>
            <Descriptions.Item label="设备信息">
              {selectedRecord.deviceInfo}
            </Descriptions.Item>
            <Descriptions.Item label="操作时间">
              {selectedRecord.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {selectedRecord.remark}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {selectedRecord.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PointsDetails; 