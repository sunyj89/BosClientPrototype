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
  Tooltip, 
  Tag,
  message,
  Modal,
  InputNumber,
  Progress,
  Popconfirm,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 机构销售任务页面
const OrganizationTask = () => {
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('创建销售任务');
  const [editingTask, setEditingTask] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 组件加载时获取数据
  useEffect(() => {
    fetchTaskData();
  }, [pagination.current, pagination.pageSize]);

  // 获取任务数据
  const fetchTaskData = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = generateMockData();
        setTaskData(mockData.data);
        setPagination({
          ...pagination,
          total: mockData.total
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取机构销售任务数据失败:', error);
      message.error('获取机构销售任务数据失败');
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

    const taskTypes = ['月度任务', '季度任务', '年度任务', '特殊任务'];
    const taskStatuses = ['进行中', '已完成', '未完成', '未开始'];
    const regions = ['华东区', '华南区', '华北区', '华中区', '西南区'];
    const goodsTypes = ['饮料', '零食', '香烟', '日用品', '汽车用品'];

    for (let i = 0; i < total; i++) {
      if (i >= startIndex && i < endIndex) {
        const typeIndex = i % 4;
        const statusIndex = i % 4;
        const regionIndex = i % 5;
        const goodsTypeIndex = i % 5;
        
        const startDate = moment().subtract(i % 30, 'days').format('YYYY-MM-DD');
        const endDate = moment(startDate).add(typeIndex === 0 ? 30 : (typeIndex === 1 ? 90 : (typeIndex === 2 ? 365 : 15)), 'days').format('YYYY-MM-DD');
        const targetSales = ((Math.random() * 500000) + 100000).toFixed(2);
        const actualSales = ((Math.random() * 600000) + 50000).toFixed(2);
        const completionRate = ((parseFloat(actualSales) / parseFloat(targetSales)) * 100).toFixed(2);
        
        data.push({
          id: `T${String(1000 + i).padStart(6, '0')}`,
          taskName: `${regions[regionIndex]}${goodsTypes[goodsTypeIndex]}销售${taskTypes[typeIndex]}`,
          taskType: taskTypes[typeIndex],
          region: regions[regionIndex],
          goodsType: goodsTypes[goodsTypeIndex],
          startDate,
          endDate,
          targetSales,
          actualSales,
          completionRate,
          status: taskStatuses[statusIndex],
          createdBy: `管理员${i % 5 + 1}`,
          createdAt: moment().subtract(i % 60, 'days').format('YYYY-MM-DD HH:mm:ss'),
          remark: i % 3 === 0 ? `这是一个${taskTypes[typeIndex]}，目标是完成${targetSales}元的销售额。` : ''
        });
      }
    }

    return {
      data,
      total
    };
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setPagination({
      ...pagination,
      current: 1
    });
    fetchTaskData();
  };

  // 重置搜索表单
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
    fetchTaskData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 打开创建任务模态框
  const handleCreateTask = () => {
    setModalTitle('创建销售任务');
    setEditingTask(null);
    taskForm.resetFields();
    taskForm.setFieldsValue({
      startDate: moment(),
      endDate: moment().add(1, 'month')
    });
    setModalVisible(true);
  };

  // 打开编辑任务模态框
  const handleEditTask = (record) => {
    setModalTitle('编辑销售任务');
    setEditingTask(record);
    taskForm.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
      targetSales: parseFloat(record.targetSales)
    });
    setModalVisible(true);
  };

  // 复制任务
  const handleCopyTask = (record) => {
    setModalTitle('复制销售任务');
    setEditingTask(null);
    taskForm.setFieldsValue({
      ...record,
      taskName: `${record.taskName} - 副本`,
      startDate: moment(),
      endDate: moment().add(1, 'month'),
      targetSales: parseFloat(record.targetSales)
    });
    setModalVisible(true);
  };

  // 删除任务
  const handleDeleteTask = async (id) => {
    try {
      // 模拟API请求
      setLoading(true);
      setTimeout(() => {
        const newData = taskData.filter(item => item.id !== id);
        setTaskData(newData);
        message.success('删除任务成功');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('删除任务失败:', error);
      message.error('删除任务失败');
      setLoading(false);
    }
  };

  // 提交任务表单
  const handleSubmitTask = async () => {
    try {
      const values = await taskForm.validateFields();
      setConfirmLoading(true);
      
      // 格式化日期
      values.startDate = values.startDate.format('YYYY-MM-DD');
      values.endDate = values.endDate.format('YYYY-MM-DD');
      
      // 模拟API请求
      setTimeout(() => {
        if (editingTask) {
          // 更新任务
          const newData = taskData.map(item => {
            if (item.id === editingTask.id) {
              return {
                ...item,
                ...values,
                completionRate: ((parseFloat(item.actualSales) / parseFloat(values.targetSales)) * 100).toFixed(2)
              };
            }
            return item;
          });
          setTaskData(newData);
          message.success('更新任务成功');
        } else {
          // 创建任务
          const newTask = {
            id: `T${String(1000 + Math.floor(Math.random() * 9000)).padStart(6, '0')}`,
            ...values,
            actualSales: '0.00',
            completionRate: '0.00',
            status: '未开始',
            createdBy: '当前用户',
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
          };
          setTaskData([newTask, ...taskData]);
          message.success('创建任务成功');
        }
        
        setModalVisible(false);
        setConfirmLoading(false);
      }, 500);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 取消任务表单
  const handleCancelTask = () => {
    setModalVisible(false);
  };

  // 获取任务状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '进行中':
        return <Tag color="processing">进行中</Tag>;
      case '已完成':
        return <Tag color="success">已完成</Tag>;
      case '未完成':
        return <Tag color="error">未完成</Tag>;
      case '未开始':
        return <Tag color="default">未开始</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left'
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 120
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 100
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: 100
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120
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
      render: (text) => parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 200,
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => getStatusTag(text)
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditTask(record)}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button 
              type="text" 
              icon={<CopyOutlined />} 
              onClick={() => handleCopyTask(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个任务吗？"
              onConfirm={() => handleDeleteTask(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card className="organization-task-search-form">
      <Form
        form={searchForm}
        layout="horizontal"
        onFinish={handleSearch}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="taskName" label="任务名称">
              <Input placeholder="请输入任务名称" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="taskType" label="任务类型">
              <Select placeholder="请选择任务类型" allowClear>
                <Option value="月度任务">月度任务</Option>
                <Option value="季度任务">季度任务</Option>
                <Option value="年度任务">年度任务</Option>
                <Option value="特殊任务">特殊任务</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="region" label="区域">
              <Select placeholder="请选择区域" allowClear>
                <Option value="华东区">华东区</Option>
                <Option value="华南区">华南区</Option>
                <Option value="华北区">华北区</Option>
                <Option value="华中区">华中区</Option>
                <Option value="西南区">西南区</Option>
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
            <Form.Item name="dateRange" label="日期范围">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" allowClear>
                <Option value="进行中">进行中</Option>
                <Option value="已完成">已完成</Option>
                <Option value="未完成">未完成</Option>
                <Option value="未开始">未开始</Option>
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
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask}>
                创建任务
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 渲染任务表单模态框
  const renderTaskModal = () => (
    <Modal
      title={modalTitle}
      open={modalVisible}
      onOk={handleSubmitTask}
      onCancel={handleCancelTask}
      confirmLoading={confirmLoading}
      width={700}
      destroyOnClose
    >
      <Form
        form={taskForm}
        layout="vertical"
        initialValues={{
          taskType: '月度任务',
          startDate: moment(),
          endDate: moment().add(1, 'month')
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="taskName"
              label="任务名称"
              rules={[{ required: true, message: '请输入任务名称' }]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="taskType"
              label="任务类型"
              rules={[{ required: true, message: '请选择任务类型' }]}
            >
              <Select placeholder="请选择任务类型">
                <Option value="月度任务">月度任务</Option>
                <Option value="季度任务">季度任务</Option>
                <Option value="年度任务">年度任务</Option>
                <Option value="特殊任务">特殊任务</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="region"
              label="区域"
              rules={[{ required: true, message: '请选择区域' }]}
            >
              <Select placeholder="请选择区域">
                <Option value="华东区">华东区</Option>
                <Option value="华南区">华南区</Option>
                <Option value="华北区">华北区</Option>
                <Option value="华中区">华中区</Option>
                <Option value="西南区">西南区</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="goodsType"
              label="商品类型"
              rules={[{ required: true, message: '请选择商品类型' }]}
            >
              <Select placeholder="请选择商品类型">
                <Option value="饮料">饮料</Option>
                <Option value="零食">零食</Option>
                <Option value="香烟">香烟</Option>
                <Option value="日用品">日用品</Option>
                <Option value="汽车用品">汽车用品</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="targetSales"
              label="目标销售额(元)"
              rules={[{ required: true, message: '请输入目标销售额' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder="请输入目标销售额"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="开始日期"
              rules={[{ required: true, message: '请选择开始日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="结束日期"
              rules={[
                { required: true, message: '请选择结束日期' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('结束日期必须晚于开始日期'));
                  },
                }),
              ]}
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
  );

  return (
    <div className="organization-task">
      {renderSearchForm()}
      
      <Table
        className="organization-task-table"
        columns={columns}
        dataSource={taskData}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1800 }}
      />
      
      {renderTaskModal()}
    </div>
  );
};

export default OrganizationTask; 