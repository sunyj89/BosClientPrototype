import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Breadcrumb, 
  Tag, 
  Input, 
  Select, 
  Form, 
  Row, 
  Col,
  Modal,
  message,
  Tabs,
  Steps,
  Divider,
  Typography,
  Tooltip,
  Popconfirm,
  Switch,
  Tree,
  Descriptions
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  NodeIndexOutlined,
  ApartmentOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  BranchesOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = Tree;

const WorkflowManagement = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [designModalVisible, setDesignModalVisible] = useState(false);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  
  // 模拟数据
  const mockData = [
    {
      key: '1',
      id: 'WF001',
      name: '油罐油品变更审批流程',
      type: '油品管理',
      description: '油罐油品变更的审批流程，包括部门主管审批、运营总监审批和执行确认',
      steps: [
        { key: '1', name: '提交申请', role: '油站经理', type: 'start' },
        { key: '2', name: '部门主管审批', role: '部门主管', type: 'approval' },
        { key: '3', name: '运营总监审批', role: '运营总监', type: 'approval' },
        { key: '4', name: '执行确认', role: '技术员', type: 'execution' },
        { key: '5', name: '完成', role: '系统', type: 'end' }
      ],
      status: '启用',
      createdBy: '系统管理员',
      createdAt: '2023-01-15',
      updatedAt: '2023-03-20'
    },
    {
      key: '2',
      id: 'WF002',
      name: '油枪油品变更审批流程',
      type: '油品管理',
      description: '油枪油品变更的审批流程，包括部门主管审批和执行确认',
      steps: [
        { key: '1', name: '提交申请', role: '油站经理', type: 'start' },
        { key: '2', name: '部门主管审批', role: '部门主管', type: 'approval' },
        { key: '3', name: '执行确认', role: '技术员', type: 'execution' },
        { key: '4', name: '完成', role: '系统', type: 'end' }
      ],
      status: '启用',
      createdBy: '系统管理员',
      createdAt: '2023-01-20',
      updatedAt: '2023-02-15'
    },
    {
      key: '3',
      id: 'WF003',
      name: '商品采购审批流程',
      type: '商品管理',
      description: '商品采购的审批流程，包括采购主管审批、财务审批和执行确认',
      steps: [
        { key: '1', name: '提交申请', role: '采购专员', type: 'start' },
        { key: '2', name: '采购主管审批', role: '采购主管', type: 'approval' },
        { key: '3', name: '财务审批', role: '财务主管', type: 'approval' },
        { key: '4', name: '执行确认', role: '采购专员', type: 'execution' },
        { key: '5', name: '完成', role: '系统', type: 'end' }
      ],
      status: '启用',
      createdBy: '系统管理员',
      createdAt: '2023-02-10',
      updatedAt: '2023-04-05'
    },
    {
      key: '4',
      id: 'WF004',
      name: '价格调整审批流程',
      type: '商品管理',
      description: '商品价格调整的审批流程，包括部门主管审批、总经理审批和执行确认',
      steps: [
        { key: '1', name: '提交申请', role: '商品经理', type: 'start' },
        { key: '2', name: '部门主管审批', role: '部门主管', type: 'approval' },
        { key: '3', name: '总经理审批', role: '总经理', type: 'approval' },
        { key: '4', name: '执行确认', role: '商品经理', type: 'execution' },
        { key: '5', name: '完成', role: '系统', type: 'end' }
      ],
      status: '禁用',
      createdBy: '系统管理员',
      createdAt: '2023-03-05',
      updatedAt: '2023-05-10'
    },
    {
      key: '5',
      id: 'WF005',
      name: '会员优惠活动审批流程',
      type: '会员管理',
      description: '会员优惠活动的审批流程，包括营销主管审批、财务审批和执行确认',
      steps: [
        { key: '1', name: '提交申请', role: '营销专员', type: 'start' },
        { key: '2', name: '营销主管审批', role: '营销主管', type: 'approval' },
        { key: '3', name: '财务审批', role: '财务主管', type: 'approval' },
        { key: '4', name: '执行确认', role: '营销专员', type: 'execution' },
        { key: '5', name: '完成', role: '系统', type: 'end' }
      ],
      status: '启用',
      createdBy: '系统管理员',
      createdAt: '2023-04-15',
      updatedAt: '2023-05-20'
    }
  ];

  // 工作流类型
  const workflowTypes = [
    '油品管理',
    '商品管理',
    '会员管理',
    '财务管理',
    '人事管理',
    '系统管理'
  ];

  // 角色列表
  const roles = [
    '系统管理员',
    '总经理',
    '运营总监',
    '财务主管',
    '采购主管',
    '营销主管',
    '部门主管',
    '油站经理',
    '采购专员',
    '营销专员',
    '技术员',
    '系统'
  ];

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = (filters = {}) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      let filteredData = [...mockData];
      
      // 应用过滤条件
      if (filters.name) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      
      if (filters.type && filters.type !== '全部') {
        filteredData = filteredData.filter(item => item.type === filters.type);
      }
      
      if (filters.status && filters.status !== '全部') {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      
      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  // 处理查询
  const handleSearch = () => {
    filterForm.validateFields().then(values => {
      fetchData(values);
    });
  };

  // 重置过滤条件
  const handleReset = () => {
    filterForm.resetFields();
    fetchData();
  };

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 打开新增/编辑模态框
  const showModal = (record = null) => {
    setCurrentWorkflow(record);
    form.resetFields();
    
    if (record) {
      // 编辑模式
      form.setFieldsValue({
        name: record.name,
        type: record.type,
        description: record.description,
        status: record.status === '启用'
      });
    } else {
      // 新增模式
      form.setFieldsValue({
        status: true
      });
    }
    
    setModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      
      // 构建新记录
      const newRecord = {
        key: currentWorkflow ? currentWorkflow.key : `${dataSource.length + 1}`,
        id: currentWorkflow ? currentWorkflow.id : `WF${String(dataSource.length + 1).padStart(3, '0')}`,
        name: values.name,
        type: values.type,
        description: values.description,
        steps: currentWorkflow ? currentWorkflow.steps : [
          { key: '1', name: '提交申请', role: '系统', type: 'start' },
          { key: '2', name: '完成', role: '系统', type: 'end' }
        ],
        status: values.status ? '启用' : '禁用',
        createdBy: currentWorkflow ? currentWorkflow.createdBy : '当前用户',
        createdAt: currentWorkflow ? currentWorkflow.createdAt : new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      // 模拟API请求
      setTimeout(() => {
        if (currentWorkflow) {
          // 更新记录
          const newDataSource = dataSource.map(item => 
            item.key === currentWorkflow.key ? newRecord : item
          );
          setDataSource(newDataSource);
          message.success('工作流程已更新');
        } else {
          // 新增记录
          setDataSource([...dataSource, newRecord]);
          message.success('工作流程已创建');
        }
        
        setLoading(false);
        setModalVisible(false);
      }, 500);
    });
  };

  // 处理删除
  const handleDelete = (key) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const newDataSource = dataSource.filter(item => item.key !== key);
      setDataSource(newDataSource);
      message.success('工作流程已删除');
      setLoading(false);
    }, 500);
  };

  // 处理状态切换
  const handleStatusChange = (checked, record) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const newStatus = checked ? '启用' : '禁用';
      const newDataSource = dataSource.map(item => 
        item.key === record.key ? { ...item, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : item
      );
      setDataSource(newDataSource);
      message.success(`工作流程已${newStatus}`);
      setLoading(false);
    }, 500);
  };

  // 打开流程设计模态框
  const showDesignModal = (record) => {
    setCurrentWorkflow(record);
    setDesignModalVisible(true);
  };

  // 关闭流程设计模态框
  const handleDesignCancel = () => {
    setDesignModalVisible(false);
  };

  // 渲染状态标签
  const renderStatusTag = (status) => {
    let color = status === '启用' ? 'green' : 'red';
    let icon = status === '启用' ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
    
    return <Tag color={color} icon={icon}>{status}</Tag>;
  };

  // 表格列配置
  const columns = [
    {
      title: '流程ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '流程名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: '步骤数',
      key: 'stepsCount',
      width: 100,
      render: (_, record) => record.steps.length,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatusTag,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<NodeIndexOutlined />} 
            size="small"
            onClick={() => showDesignModal(record)}
          >
            流程设计
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此工作流程吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
          <Switch 
            checkedChildren="启用" 
            unCheckedChildren="禁用" 
            checked={record.status === '启用'} 
            onChange={(checked) => handleStatusChange(checked, record)}
          />
        </Space>
      ),
    },
  ];

  // 渲染流程步骤
  const renderWorkflowSteps = (steps) => {
    return (
      <Steps direction="vertical" current={-1}>
        {steps.map((step, index) => {
          let icon = null;
          
          if (step.type === 'start') {
            icon = <UserOutlined />;
          } else if (step.type === 'approval') {
            icon = <TeamOutlined />;
          } else if (step.type === 'execution') {
            icon = <SettingOutlined />;
          } else if (step.type === 'end') {
            icon = <CheckCircleOutlined />;
          }
          
          return (
            <Step 
              key={step.key} 
              title={step.name} 
              description={`执行角色: ${step.role}`}
              icon={icon}
            />
          );
        })}
      </Steps>
    );
  };

  // 渲染组织结构树
  const renderOrgTree = () => {
    return (
      <Tree
        showLine
        defaultExpandAll
        defaultSelectedKeys={['dept1']}
      >
        <TreeNode title="总公司" key="company" icon={<BranchesOutlined />}>
          <TreeNode title="运营部" key="dept1" icon={<ApartmentOutlined />}>
            <TreeNode title="运营总监" key="role1" icon={<UserOutlined />} />
            <TreeNode title="部门主管" key="role2" icon={<UserOutlined />} />
            <TreeNode title="油站经理" key="role3" icon={<UserOutlined />} />
            <TreeNode title="技术员" key="role4" icon={<UserOutlined />} />
          </TreeNode>
          <TreeNode title="采购部" key="dept2" icon={<ApartmentOutlined />}>
            <TreeNode title="采购主管" key="role5" icon={<UserOutlined />} />
            <TreeNode title="采购专员" key="role6" icon={<UserOutlined />} />
          </TreeNode>
          <TreeNode title="财务部" key="dept3" icon={<ApartmentOutlined />}>
            <TreeNode title="财务主管" key="role7" icon={<UserOutlined />} />
          </TreeNode>
          <TreeNode title="营销部" key="dept4" icon={<ApartmentOutlined />}>
            <TreeNode title="营销主管" key="role8" icon={<UserOutlined />} />
            <TreeNode title="营销专员" key="role9" icon={<UserOutlined />} />
          </TreeNode>
        </TreeNode>
      </Tree>
    );
  };

  return (
    <div>
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/dashboard">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/system">系统管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>工作流程管理</Breadcrumb.Item>
        </Breadcrumb>
        <h2>工作流程管理</h2>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="工作流程列表" key="1">
            {/* 过滤条件 */}
            <Card style={{ marginBottom: 16 }}>
              <Form
                form={filterForm}
                layout="horizontal"
                name="filterForm"
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="name"
                      label="流程名称"
                    >
                      <Input 
                        placeholder="请输入流程名称" 
                        allowClear 
                        suffix={<SearchOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="type"
                      label="类型"
                    >
                      <Select placeholder="请选择类型" allowClear defaultValue="全部">
                        <Option value="全部">全部</Option>
                        {workflowTypes.map(type => (
                          <Option key={type} value={type}>{type}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="status"
                      label="状态"
                    >
                      <Select placeholder="请选择状态" allowClear defaultValue="全部">
                        <Option value="全部">全部</Option>
                        <Option value="启用">启用</Option>
                        <Option value="禁用">禁用</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4} style={{ textAlign: 'right' }}>
                    <Form.Item>
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<SearchOutlined />}
                          onClick={handleSearch}
                        >
                          查询
                        </Button>
                        <Button 
                          icon={<ReloadOutlined />}
                          onClick={handleReset}
                        >
                          重置
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* 数据表格 */}
            <Card
              title="工作流程列表"
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => showModal()}
                >
                  新增工作流程
                </Button>
              }
            >
              <Table 
                columns={columns} 
                dataSource={dataSource} 
                rowKey="key"
                pagination={{ pageSize: 10 }}
                loading={loading}
                scroll={{ x: 1500 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="组织结构" key="2">
            <Card title="组织结构与角色">
              <Row gutter={16}>
                <Col span={8}>
                  {renderOrgTree()}
                </Col>
                <Col span={16}>
                  <Card title="角色说明" size="small">
                    <Paragraph>
                      <Text strong>系统管理员：</Text>负责系统配置和工作流程管理
                    </Paragraph>
                    <Paragraph>
                      <Text strong>总经理：</Text>负责最终审批重要业务流程
                    </Paragraph>
                    <Paragraph>
                      <Text strong>运营总监：</Text>负责油品相关业务的高级审批
                    </Paragraph>
                    <Paragraph>
                      <Text strong>财务主管：</Text>负责财务相关审批
                    </Paragraph>
                    <Paragraph>
                      <Text strong>采购主管：</Text>负责采购相关审批
                    </Paragraph>
                    <Paragraph>
                      <Text strong>营销主管：</Text>负责营销活动相关审批
                    </Paragraph>
                    <Paragraph>
                      <Text strong>部门主管：</Text>负责部门内业务的初级审批
                    </Paragraph>
                    <Paragraph>
                      <Text strong>油站经理：</Text>负责油站日常业务管理和申请提交
                    </Paragraph>
                    <Paragraph>
                      <Text strong>采购专员：</Text>负责商品采购申请和执行
                    </Paragraph>
                    <Paragraph>
                      <Text strong>营销专员：</Text>负责营销活动申请和执行
                    </Paragraph>
                    <Paragraph>
                      <Text strong>技术员：</Text>负责油品变更等技术操作的执行
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={currentWorkflow ? '编辑工作流程' : '新增工作流程'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="workflowForm"
        >
          <Form.Item
            name="name"
            label="流程名称"
            rules={[{ required: true, message: '请输入流程名称' }]}
          >
            <Input placeholder="请输入流程名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="流程类型"
            rules={[{ required: true, message: '请选择流程类型' }]}
          >
            <Select placeholder="请选择流程类型">
              {workflowTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="流程描述"
            rules={[{ required: true, message: '请输入流程描述' }]}
          >
            <TextArea rows={3} placeholder="请输入流程描述" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 流程设计模态框 */}
      <Modal
        title="流程设计"
        visible={designModalVisible}
        onCancel={handleDesignCancel}
        footer={[
          <Button key="back" onClick={handleDesignCancel}>
            关闭
          </Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleDesignCancel}>
            保存设计
          </Button>
        ]}
        width={800}
      >
        {currentWorkflow && (
          <>
            <Descriptions title="流程基本信息" bordered column={2} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="流程ID">{currentWorkflow.id}</Descriptions.Item>
              <Descriptions.Item label="流程名称">{currentWorkflow.name}</Descriptions.Item>
              <Descriptions.Item label="类型">{currentWorkflow.type}</Descriptions.Item>
              <Descriptions.Item label="状态">{renderStatusTag(currentWorkflow.status)}</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>{currentWorkflow.description}</Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">流程步骤</Divider>
            
            <Row gutter={16}>
              <Col span={16}>
                {renderWorkflowSteps(currentWorkflow.steps)}
              </Col>
              <Col span={8}>
                <Card title="可用角色" size="small">
                  <div style={{ height: 300, overflowY: 'auto' }}>
                    {roles.map(role => (
                      <Tag 
                        key={role} 
                        style={{ margin: '5px', cursor: 'pointer' }}
                        icon={<UserOutlined />}
                        color="blue"
                      >
                        {role}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
            
            <Divider orientation="left">操作说明</Divider>
            <Paragraph>
              <ul>
                <li>点击"添加步骤"按钮可以在流程中添加新的步骤</li>
                <li>拖拽步骤可以调整步骤顺序</li>
                <li>点击步骤右侧的编辑按钮可以修改步骤信息</li>
                <li>点击步骤右侧的删除按钮可以删除步骤</li>
                <li>从右侧"可用角色"中拖拽角色到步骤中可以设置步骤执行角色</li>
              </ul>
            </Paragraph>
          </>
        )}
      </Modal>
    </div>
  );
};

export default WorkflowManagement; 