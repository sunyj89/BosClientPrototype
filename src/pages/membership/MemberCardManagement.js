import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select,
  DatePicker,
  message, 
  Popconfirm,
  Tag,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const MemberCardManagement = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增会员卡');
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 模拟数据
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      id: 'M20250001',
      name: '张三',
      phone: '13800138001',
      cardType: '金卡',
      balance: 1500.00,
      points: 2800,
      status: '正常',
      createTime: '2025-01-15',
      expireTime: '2026-01-14',
      lastConsumeTime: '2025-03-10',
    },
    {
      key: '2',
      id: 'M20250002',
      name: '李四',
      phone: '13800138002',
      cardType: '银卡',
      balance: 800.50,
      points: 1500,
      status: '正常',
      createTime: '2025-01-20',
      expireTime: '2026-01-19',
      lastConsumeTime: '2025-03-08',
    },
    {
      key: '3',
      id: 'M20250003',
      name: '王五',
      phone: '13800138003',
      cardType: '普通卡',
      balance: 200.00,
      points: 500,
      status: '正常',
      createTime: '2025-02-01',
      expireTime: '2026-01-31',
      lastConsumeTime: '2025-03-05',
    },
    {
      key: '4',
      id: 'M20250004',
      name: '赵六',
      phone: '13800138004',
      cardType: 'VIP卡',
      balance: 5000.00,
      points: 8000,
      status: '正常',
      createTime: '2025-01-10',
      expireTime: '2026-01-09',
      lastConsumeTime: '2025-03-12',
    },
    {
      key: '5',
      id: 'M20250005',
      name: '钱七',
      phone: '13800138005',
      cardType: '银卡',
      balance: 0.00,
      points: 1200,
      status: '已过期',
      createTime: '2024-01-15',
      expireTime: '2025-01-14',
      lastConsumeTime: '2024-12-30',
    },
    {
      key: '6',
      id: 'M20250006',
      name: '孙八',
      phone: '13800138006',
      cardType: '普通卡',
      balance: 50.00,
      points: 300,
      status: '已冻结',
      createTime: '2025-02-10',
      expireTime: '2026-02-09',
      lastConsumeTime: '2025-02-28',
    },
  ]);

  // 会员卡类型
  const cardTypes = [
    { value: '普通卡', discount: 0.98, pointRate: 1 },
    { value: '银卡', discount: 0.95, pointRate: 1.2 },
    { value: '金卡', discount: 0.90, pointRate: 1.5 },
    { value: 'VIP卡', discount: 0.85, pointRate: 2 },
  ];

  // 表格列配置
  const columns = [
    {
      title: '会员卡号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '会员姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '卡类型',
      dataIndex: 'cardType',
      key: 'cardType',
      filters: cardTypes.map(type => ({ text: type.value, value: type.value })),
      onFilter: (value, record) => record.cardType === value,
      render: (text) => {
        let color = '';
        switch (text) {
          case '普通卡':
            color = 'default';
            break;
          case '银卡':
            color = 'blue';
            break;
          case '金卡':
            color = 'orange';
            break;
          case 'VIP卡':
            color = 'purple';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '余额(元)',
      dataIndex: 'balance',
      key: 'balance',
      render: (text) => text.toFixed(2),
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '正常', value: '正常' },
        { text: '已冻结', value: '已冻结' },
        { text: '已过期', value: '已过期' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => {
        let color = '';
        switch (text) {
          case '正常':
            color = 'green';
            break;
          case '已冻结':
            color = 'red';
            break;
          case '已过期':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '办卡日期',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      title: '到期日期',
      dataIndex: 'expireTime',
      key: 'expireTime',
      sorter: (a, b) => new Date(a.expireTime) - new Date(b.expireTime),
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
            编辑
          </Button>
          {record.status === '正常' ? (
            <Button 
              type="primary" 
              danger 
              size="small"
              onClick={() => handleFreeze(record.key)}
            >
              冻结
            </Button>
          ) : record.status === '已冻结' ? (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleUnfreeze(record.key)}
            >
              解冻
            </Button>
          ) : null}
          <Popconfirm
            title="确定要删除此会员卡吗？"
            description="删除后将无法恢复！"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理添加按钮点击
  const handleAdd = () => {
    setModalTitle('新增会员卡');
    setEditingRecord(null);
    form.resetFields();
    
    // 设置默认值
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    
    form.setFieldsValue({
      createTime: moment(today),
      expireTime: moment(nextYear),
      status: '正常',
      balance: 0,
      points: 0,
    });
    
    setModalVisible(true);
  };

  // 处理编辑按钮点击
  const handleEdit = (record) => {
    setModalTitle('编辑会员卡');
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      createTime: moment(record.createTime),
      expireTime: moment(record.expireTime),
    });
    setModalVisible(true);
  };

  // 处理删除按钮点击
  const handleDelete = (key) => {
    setDataSource(dataSource.filter(item => item.key !== key));
    message.success('删除成功');
  };

  // 处理冻结按钮点击
  const handleFreeze = (key) => {
    const updatedDataSource = dataSource.map(item => {
      if (item.key === key) {
        return { ...item, status: '已冻结' };
      }
      return item;
    });
    
    setDataSource(updatedDataSource);
    message.success('会员卡已冻结');
  };

  // 处理解冻按钮点击
  const handleUnfreeze = (key) => {
    const updatedDataSource = dataSource.map(item => {
      if (item.key === key) {
        return { ...item, status: '正常' };
      }
      return item;
    });
    
    setDataSource(updatedDataSource);
    message.success('会员卡已解冻');
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const { createTime, expireTime, ...rest } = values;
          
          // 格式化日期
          const formattedValues = {
            ...rest,
            createTime: createTime.format('YYYY-MM-DD'),
            expireTime: expireTime.format('YYYY-MM-DD'),
          };
          
          if (editingRecord) {
            // 编辑现有会员卡
            const updatedDataSource = dataSource.map(item => {
              if (item.key === editingRecord.key) {
                return { 
                  ...item, 
                  ...formattedValues,
                  lastConsumeTime: item.lastConsumeTime, // 保留最后消费时间
                };
              }
              return item;
            });
            
            setDataSource(updatedDataSource);
            message.success('编辑成功');
          } else {
            // 添加新会员卡
            const newKey = (parseInt(dataSource[dataSource.length - 1]?.key || '0') + 1).toString();
            const today = new Date();
            const year = today.getFullYear();
            const newId = `M${year}${newKey.padStart(4, '0')}`;
            
            const newRecord = {
              key: newKey,
              id: newId,
              ...formattedValues,
              lastConsumeTime: '-',
            };
            
            setDataSource([...dataSource, newRecord]);
            message.success('添加成功');
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

  // 统计数据
  const statistics = {
    total: dataSource.length,
    normal: dataSource.filter(item => item.status === '正常').length,
    frozen: dataSource.filter(item => item.status === '已冻结').length,
    expired: dataSource.filter(item => item.status === '已过期').length,
    totalBalance: dataSource.reduce((sum, item) => sum + item.balance, 0),
    totalPoints: dataSource.reduce((sum, item) => sum + item.points, 0),
  };

  return (
    <div>
      <div className="page-header">
        <h2>会员卡管理</h2>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="会员卡总数"
              value={statistics.total}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="正常会员卡"
              value={statistics.normal}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已冻结会员卡"
              value={statistics.frozen}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已过期会员卡"
              value={statistics.expired}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="会员卡总余额"
              value={statistics.totalBalance}
              precision={2}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="会员总积分"
              value={statistics.totalPoints}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 搜索区域 */}
        <div className="search-container" style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item name="id" label="会员卡号">
              <Input placeholder="请输入会员卡号" />
            </Form.Item>
            <Form.Item name="name" label="会员姓名">
              <Input placeholder="请输入会员姓名" />
            </Form.Item>
            <Form.Item name="phone" label="手机号">
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item name="cardType" label="卡类型">
              <Select placeholder="请选择卡类型" style={{ width: 120 }} allowClear>
                {cardTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.value}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                <Option value="正常">正常</Option>
                <Option value="已冻结">已冻结</Option>
                <Option value="已过期">已过期</Option>
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
        
        <div className="table-operations" style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增会员卡
          </Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 添加/编辑模态框 */}
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
          name="memberCardForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="会员姓名"
                rules={[{ required: true, message: '请输入会员姓名' }]}
              >
                <Input placeholder="请输入会员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cardType"
                label="卡类型"
                rules={[{ required: true, message: '请选择卡类型' }]}
              >
                <Select placeholder="请选择卡类型">
                  {cardTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.value} (折扣: {type.discount * 10}折, 积分倍率: {type.pointRate})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="正常">正常</Option>
                  <Option value="已冻结">已冻结</Option>
                  <Option value="已过期">已过期</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="balance"
                label="余额(元)"
                rules={[
                  { required: true, message: '请输入余额' },
                  { type: 'number', min: 0, message: '余额不能小于0' }
                ]}
              >
                <Input type="number" placeholder="请输入余额" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="points"
                label="积分"
                rules={[
                  { required: true, message: '请输入积分' },
                  { type: 'number', min: 0, message: '积分不能小于0' }
                ]}
              >
                <Input type="number" placeholder="请输入积分" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="createTime"
                label="办卡日期"
                rules={[{ required: true, message: '请选择办卡日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expireTime"
                label="到期日期"
                rules={[{ required: true, message: '请选择到期日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberCardManagement; 