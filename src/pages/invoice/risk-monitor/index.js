import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  message, 
  Modal, 
  Tag,
  Alert,
  Descriptions,
  Divider
} from 'antd';
import { 
  AlertOutlined, 
  WarningOutlined, 
  UserDeleteOutlined, 
  SecurityScanOutlined,
  SearchOutlined, 
  ReloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import InvoiceStatusTag from '../components/InvoiceStatusTag';
import InvoiceAmountDisplay from '../components/InvoiceAmountDisplay';
import InvoiceActionButtons from '../components/InvoiceActionButtons';
import InvoiceDetailModal from '../components/InvoiceDetailModal';
import RedInvoiceModal from '../components/RedInvoiceModal';
import BlacklistForm from '../components/BlacklistForm';

// 模拟数据导入
import riskMonitorData from '../../../mock/invoice/riskMonitor.json';

const { Option } = Select;

const RiskMonitor = () => {
  const [alertForm] = Form.useForm();
  const [blacklistForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [riskOverview, setRiskOverview] = useState({});
  const [alertList, setAlertList] = useState([]);
  const [blackList, setBlackList] = useState([]);
  const [riskRules, setRiskRules] = useState([]);
  const [activeTab, setActiveTab] = useState('alerts');
  const [blacklistModalVisible, setBlacklistModalVisible] = useState(false);
  const [blacklistModalType, setBlacklistModalType] = useState('create'); // create | edit
  const [selectedBlacklistRecord, setSelectedBlacklistRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRiskOverview(riskMonitorData.riskOverview);
      setAlertList(riskMonitorData.riskAlerts.map(item => ({ ...item, key: item.id })));
      setBlackList(riskMonitorData.blacklist.map(item => ({ ...item, key: item.id })));
      setRiskRules(riskMonitorData.riskRules.map(item => ({ ...item, key: item.id })));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertSearch = async (values) => {
    await loadData();
    message.success('查询完成');
  };

  const handleAlertReset = () => {
    alertForm.resetFields();
    loadData();
  };

  const handleBlacklistSearch = async (values) => {
    await loadData();
    message.success('查询完成');
  };

  const handleBlacklistReset = () => {
    blacklistForm.resetFields();
    loadData();
  };

  const handleProcessAlert = (record) => {
    Modal.confirm({
      title: '确认处理预警',
      content: `确定要处理这个风险预警吗？\n预警类型：${record.alertType}`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          message.loading('正在处理预警...', 2);
          await new Promise(resolve => setTimeout(resolve, 2000));
          message.success('预警处理完成');
          loadData();
        } catch (error) {
          message.error('处理失败');
        }
      }
    });
  };

  const handleAddBlacklist = () => {
    setBlacklistModalType('create');
    setSelectedBlacklistRecord(null);
    setBlacklistModalVisible(true);
  };

  const handleEditBlacklist = (record) => {
    setBlacklistModalType('edit');
    setSelectedBlacklistRecord(record);
    setBlacklistModalVisible(true);
  };

  const handleBlacklistSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (blacklistModalType === 'create') {
        message.success('黑名单添加成功');
      } else {
        message.success('黑名单更新成功');
      }
      
      setBlacklistModalVisible(false);
      setSelectedBlacklistRecord(null);
      loadData(); // 重新加载数据
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlacklist = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除黑名单企业吗？\n企业名称：${record.companyName}`,
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: async () => {
        try {
          message.loading('正在删除...', 1);
          await new Promise(resolve => setTimeout(resolve, 1000));
          message.success('删除成功');
          loadData();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const getRiskLevelTag = (level) => {
    const levelMap = {
      '高': { color: 'red', text: '高风险' },
      '中': { color: 'orange', text: '中风险' },
      '低': { color: 'green', text: '低风险' }
    };
    const config = levelMap[level] || { color: 'default', text: level };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status) => {
    const statusMap = {
      '待处理': { color: 'orange', text: '待处理' },
      '已处理': { color: 'green', text: '已处理' },
      '已阻止': { color: 'red', text: '已阻止' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 风险概览卡片
  const renderRiskOverview = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="今日预警"
            value={riskOverview.todayAlerts}
            prefix={<AlertOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="本周预警"
            value={riskOverview.weeklyAlerts}
            prefix={<WarningOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="黑名单数量"
            value={riskOverview.blacklistCount}
            prefix={<UserDeleteOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="可疑行为"
            value={riskOverview.suspiciousCount}
            prefix={<SecurityScanOutlined />}
            valueStyle={{ color: '#13c2c2' }}
          />
        </Card>
      </Col>
    </Row>
  );

  // 风险预警表格列定义
  const alertColumns = [
    {
      title: '预警类型',
      dataIndex: 'alertType',
      width: 120
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      width: 100,
      render: getRiskLevelTag
    },
    {
      title: '企业名称',
      dataIndex: 'buyerName',
      width: 200,
      ellipsis: true
    },
    {
      title: '税号',
      dataIndex: 'buyerTaxNo',
      width: 180,
      ellipsis: true
    },
    {
      title: '预警时间',
      dataIndex: 'alertTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: getStatusTag
    },
    {
      title: '操作员',
      dataIndex: 'operatorName',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {record.status === '待处理' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleProcessAlert(record)}
              style={{ borderRadius: '2px' }}
            >
              处理
            </Button>
          )}
        </Space>
      )
    }
  ];

  // 黑名单表格列定义
  const blacklistColumns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      width: 200,
      ellipsis: true
    },
    {
      title: '税号',
      dataIndex: 'taxNo',
      width: 180,
      ellipsis: true
    },
    {
      title: '拉黑原因',
      dataIndex: 'reason',
      width: 160,
      ellipsis: true
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      width: 160
    },
    {
      title: '操作员',
      dataIndex: 'operatorName',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === '生效中' ? 'red' : 'gray'}>
          {text}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditBlacklist(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBlacklist(record)}
            style={{ borderRadius: '2px' }}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 风险规则表格列定义
  const ruleColumns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      width: 160
    },
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      width: 120
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
      width: 200,
      ellipsis: true
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      width: 100,
      render: getRiskLevelTag
    },
    {
      title: '处理动作',
      dataIndex: 'action',
      width: 120,
      render: (text) => (
        <Tag color={text === '自动阻止' ? 'red' : 'orange'}>
          {text}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (text) => (
        <Tag color={text === '启用' ? 'green' : 'gray'}>
          {text}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 160
    }
  ];

  return (
    <div>
      {/* 风险概览 */}
      {renderRiskOverview()}

      {/* 风险预警列表 */}
      <Card title="风险预警列表" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
          <Form form={alertForm} onFinish={handleAlertSearch}>
            {/* 第一行：筛选条件 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={4}>
                <Form.Item name="alertType" label="预警类型">
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value="频繁开票">频繁开票</Option>
                    <Option value="异常金额">异常金额</Option>
                    <Option value="税号异常">税号异常</Option>
                    <Option value="重复开票">重复开票</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="riskLevel" label="风险等级">
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value="高">高风险</Option>
                    <Option value="中">中风险</Option>
                    <Option value="低">低风险</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="status" label="处理状态">
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value="待处理">待处理</Option>
                    <Option value="已处理">已处理</Option>
                    <Option value="已阻止">已阻止</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="buyerName" label="企业名称">
                  <Input placeholder="请输入企业名称" style={{ width: '100%' }} allowClear />
                </Form.Item>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                    style={{ borderRadius: '2px' }}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleAlertReset}
                    style={{ borderRadius: '2px' }}
                  >
                    重置
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>

        <Table
          columns={alertColumns}
          dataSource={alertList}
          loading={loading}
          scroll={{ x: 'max-content' }}
          size="middle"
          expandable={{
            expandedRowRender: (record) => (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="详细描述">
                  {record.description}
                </Descriptions.Item>
              </Descriptions>
            ),
            rowExpandable: (record) => !!record.description
          }}
        />
      </Card>

      {/* 黑名单管理 */}
      <Card title="黑名单管理" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
          <Form form={blacklistForm} onFinish={handleBlacklistSearch}>
            {/* 第一行：筛选条件 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Form.Item name="companyName" label="企业名称">
                  <Input placeholder="请输入企业名称" style={{ width: '100%' }} allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="taxNo" label="税号">
                  <Input placeholder="请输入税号" style={{ width: '100%' }} allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="phone" label="联系电话">
                  <Input placeholder="请输入联系电话" style={{ width: '100%' }} allowClear />
                </Form.Item>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                    style={{ borderRadius: '2px' }}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleBlacklistReset}
                    style={{ borderRadius: '2px' }}
                  >
                    重置
                  </Button>
                </Space>
              </Col>
            </Row>
            
            {/* 第二行：功能按钮 */}
            <Row gutter={16}>
              <Col span={24}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAddBlacklist}
                    style={{ borderRadius: '2px' }}
                  >
                    添加黑名单
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>

        <Table
          columns={blacklistColumns}
          dataSource={blackList}
          loading={loading}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>

      {/* 风险规则配置 */}
      <Card title="风险规则配置">
        <Alert
          message="风险规则说明"
          description="系统会根据配置的风险规则自动检测开票行为，发现异常时会自动预警或阻止。规则配置需要谨慎操作。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={ruleColumns}
          dataSource={riskRules}
          loading={loading}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>

      {/* 黑名单表单弹窗 */}
      <BlacklistForm
        visible={blacklistModalVisible}
        type={blacklistModalType}
        data={selectedBlacklistRecord}
        onOk={handleBlacklistSubmit}
        onCancel={() => {
          setBlacklistModalVisible(false);
          setSelectedBlacklistRecord(null);
        }}
      />
    </div>
  );
};

export default RiskMonitor;