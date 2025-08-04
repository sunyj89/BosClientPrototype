import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select,
  DatePicker,
  Breadcrumb, 
  message, 
  Row,
  Col,
  Statistic,
  Tabs,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  ReloadOutlined,
  GiftOutlined,
  UpCircleOutlined,
  DownCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const MemberPointsManagement = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('积分调整');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  
  // 模拟会员数据
  const members = [
    { id: 'M20250001', name: '张三', phone: '13800138001', cardType: '金卡', points: 2800 },
    { id: 'M20250002', name: '李四', phone: '13800138002', cardType: '银卡', points: 1500 },
    { id: 'M20250003', name: '王五', phone: '13800138003', cardType: '普通卡', points: 500 },
    { id: 'M20250004', name: '赵六', phone: '13800138004', cardType: 'VIP卡', points: 8000 },
    { id: 'M20250005', name: '钱七', phone: '13800138005', cardType: '银卡', points: 1200 },
    { id: 'M20250006', name: '孙八', phone: '13800138006', cardType: '普通卡', points: 300 },
  ];
  
  // 模拟积分记录数据
  const [pointsRecords, setPointsRecords] = useState([
    {
      key: '1',
      id: 'P20250312001',
      memberId: 'M20250001',
      memberName: '张三',
      phone: '13800138001',
      type: '消费积分',
      points: 200,
      balance: 2800,
      createTime: '2025-03-12 10:30:00',
      operator: '系统',
      remark: '购物消费获得积分',
    },
    {
      key: '2',
      id: 'P20250311001',
      memberId: 'M20250002',
      memberName: '李四',
      phone: '13800138002',
      type: '消费积分',
      points: 150,
      balance: 1500,
      createTime: '2025-03-11 15:20:00',
      operator: '系统',
      remark: '购物消费获得积分',
    },
    {
      key: '3',
      id: 'P20250310001',
      memberId: 'M20250003',
      memberName: '王五',
      phone: '13800138003',
      type: '消费积分',
      points: 50,
      balance: 500,
      createTime: '2025-03-10 09:15:00',
      operator: '系统',
      remark: '购物消费获得积分',
    },
    {
      key: '4',
      id: 'P20250309001',
      memberId: 'M20250004',
      memberName: '赵六',
      phone: '13800138004',
      type: '消费积分',
      points: 500,
      balance: 8000,
      createTime: '2025-03-09 14:45:00',
      operator: '系统',
      remark: '购物消费获得积分',
    },
    {
      key: '5',
      id: 'P20250308001',
      memberId: 'M20250001',
      memberName: '张三',
      phone: '13800138001',
      type: '积分兑换',
      points: -500,
      balance: 2600,
      createTime: '2025-03-08 11:30:00',
      operator: '李店长',
      remark: '积分兑换商品',
    },
    {
      key: '6',
      id: 'P20250307001',
      memberId: 'M20250002',
      memberName: '李四',
      phone: '13800138002',
      type: '积分调整',
      points: 200,
      balance: 1350,
      createTime: '2025-03-07 16:20:00',
      operator: '李店长',
      remark: '积分活动奖励',
    },
    {
      key: '7',
      id: 'P20250306001',
      memberId: 'M20250005',
      memberName: '钱七',
      phone: '13800138005',
      type: '积分过期',
      points: -300,
      balance: 1200,
      createTime: '2025-03-06 00:00:00',
      operator: '系统',
      remark: '积分到期自动扣除',
    },
  ]);

  // 积分记录表格列配置
  const recordColumns = [
    {
      title: '记录编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '会员卡号',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: '会员姓名',
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '消费积分', value: '消费积分' },
        { text: '积分兑换', value: '积分兑换' },
        { text: '积分调整', value: '积分调整' },
        { text: '积分过期', value: '积分过期' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (text) => {
        let color = '';
        switch (text) {
          case '消费积分':
            color = 'green';
            break;
          case '积分兑换':
            color = 'blue';
            break;
          case '积分调整':
            color = 'purple';
            break;
          case '积分过期':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '积分变动',
      dataIndex: 'points',
      key: 'points',
      sorter: (a, b) => a.points - b.points,
      render: (text) => {
        if (text > 0) {
          return <span style={{ color: '#52c41a' }}>+{text}</span>;
        } else {
          return <span style={{ color: '#f5222d' }}>{text}</span>;
        }
      },
    },
    {
      title: '积分余额',
      dataIndex: 'balance',
      key: 'balance',
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
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

  // 处理积分调整按钮点击
  const handleAdjustPoints = () => {
    setModalTitle('积分调整');
    form.resetFields();
    setModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const { memberId, adjustType, points, remark } = values;
          
          // 获取会员信息
          const member = members.find(m => m.id === memberId);
          
          if (!member) {
            message.error('会员不存在');
            setLoading(false);
            return;
          }
          
          // 计算积分变动
          const pointsChange = adjustType === 'add' ? points : -points;
          
          // 计算新的积分余额
          const newBalance = member.points + pointsChange;
          
          if (newBalance < 0) {
            message.error('积分余额不足');
            setLoading(false);
            return;
          }
          
          // 生成记录ID
          const today = new Date();
          const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
          const newKey = (parseInt(pointsRecords[0]?.key || '0') + 1).toString();
          const newId = `P${dateStr}${newKey.padStart(3, '0')}`;
          
          // 创建新记录
          const newRecord = {
            key: newKey,
            id: newId,
            memberId: member.id,
            memberName: member.name,
            phone: member.phone,
            type: '积分调整',
            points: pointsChange,
            balance: newBalance,
            createTime: new Date().toLocaleString(),
            operator: '当前用户',
            remark: remark || '',
          };
          
          // 更新积分记录
          setPointsRecords([newRecord, ...pointsRecords]);
          
          // 更新会员积分（实际应用中应该通过API更新）
          member.points = newBalance;
          
          message.success('积分调整成功');
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
    totalPoints: members.reduce((sum, item) => sum + item.points, 0),
    totalRecords: pointsRecords.length,
    addPoints: pointsRecords.filter(item => item.points > 0).reduce((sum, item) => sum + item.points, 0),
    reducePoints: Math.abs(pointsRecords.filter(item => item.points < 0).reduce((sum, item) => sum + item.points, 0)),
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/membership">会员管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>积分管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>会员积分管理</h2>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="会员总积分"
              value={statistics.totalPoints}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="积分记录总数"
              value={statistics.totalRecords}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计增加积分"
              value={statistics.addPoints}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UpCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计减少积分"
              value={statistics.reducePoints}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DownCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="积分记录" key="1">
            {/* 搜索区域 */}
            <div className="search-container" style={{ marginBottom: 16 }}>
              <Form layout="inline">
                <Form.Item name="memberId" label="会员卡号">
                  <Input placeholder="请输入会员卡号" />
                </Form.Item>
                <Form.Item name="memberName" label="会员姓名">
                  <Input placeholder="请输入会员姓名" />
                </Form.Item>
                <Form.Item name="phone" label="手机号">
                  <Input placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item name="type" label="类型">
                  <Select placeholder="请选择类型" style={{ width: 120 }} allowClear>
                    <Option value="消费积分">消费积分</Option>
                    <Option value="积分兑换">积分兑换</Option>
                    <Option value="积分调整">积分调整</Option>
                    <Option value="积分过期">积分过期</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="dateRange" label="操作时间">
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
            </div>
            
            <div className="table-operations" style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAdjustPoints}
              >
                积分调整
              </Button>
            </div>
            
            <Table 
              columns={recordColumns} 
              dataSource={pointsRecords} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          <TabPane tab="积分规则" key="2">
            <Card title="积分获取规则">
              <p>1. 消费积分：每消费1元获得1积分</p>
              <p>2. 会员等级倍率：</p>
              <ul>
                <li>普通会员：1倍积分</li>
                <li>银卡会员：1.2倍积分</li>
                <li>金卡会员：1.5倍积分</li>
                <li>VIP会员：2倍积分</li>
              </ul>
              <p>3. 特殊活动：根据活动规则额外获得积分</p>
            </Card>
            
            <Card title="积分使用规则" style={{ marginTop: 16 }}>
              <p>1. 积分兑换：100积分 = 1元</p>
              <p>2. 积分有效期：自获得之日起1年内有效</p>
              <p>3. 积分不可转让，不可兑换现金</p>
              <p>4. 会员卡注销时，积分自动作废</p>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* 积分调整模态框 */}
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
          name="pointsForm"
        >
          <Form.Item
            name="memberId"
            label="会员卡号"
            rules={[{ required: true, message: '请选择会员' }]}
          >
            <Select placeholder="请选择会员">
              {members.map(member => (
                <Option key={member.id} value={member.id}>
                  {member.id} - {member.name} ({member.phone})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="adjustType"
            label="调整类型"
            rules={[{ required: true, message: '请选择调整类型' }]}
          >
            <Select placeholder="请选择调整类型">
              <Option value="add">增加积分</Option>
              <Option value="reduce">减少积分</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="points"
            label="积分数量"
            rules={[
              { required: true, message: '请输入积分数量' },
              { type: 'number', min: 1, message: '积分数量必须大于0' }
            ]}
          >
            <Input type="number" placeholder="请输入积分数量" />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberPointsManagement; 