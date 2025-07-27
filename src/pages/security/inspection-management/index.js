import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, TreeSelect, Popconfirm, Progress, Statistic, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SafetyOutlined, ScanOutlined, EnvironmentOutlined, AlertOutlined, BarChartOutlined, HistoryOutlined } from '@ant-design/icons';
import './index.css';
import inspectionData from '../../../mock/security/inspectionData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const InspectionManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [nfcForm] = Form.useForm();
  const [pointForm] = Form.useForm();
  
  // 数据状态
  const [taskList, setTaskList] = useState([]);
  const [nfcTags, setNfcTags] = useState([]);
  const [inspectionPoints, setInspectionPoints] = useState([]);
  const [executionStats, setExecutionStats] = useState([]);
  const [rectificationRecords, setRectificationRecords] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  
  // 弹窗状态
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [nfcModalVisible, setNfcModalVisible] = useState(false);
  const [pointModalVisible, setPointModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setTaskList(inspectionData.inspectionTasks);
      setNfcTags(inspectionData.nfcTags);
      setInspectionPoints(inspectionData.inspectionPoints);
      setExecutionStats(inspectionData.executionStats);
      setRectificationRecords(inspectionData.rectificationRecords);
      setRiskAnalysis(inspectionData.riskAnalysis);
      setChangeRecords(inspectionData.changeRecords);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    message.success('搜索功能已触发');
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    message.info('搜索条件已重置');
  };

  // 新增任务
  const handleAddTask = () => {
    setModalType('add');
    taskForm.resetFields();
    setTaskModalVisible(true);
  };

  // 编辑任务
  const handleEditTask = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    taskForm.setFieldsValue(record);
    setTaskModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 查看修改记录
  const handleViewChanges = () => {
    setChangeModalVisible(true);
  };

  // 删除记录
  const handleDelete = (record) => {
    message.success(`删除${record.taskName || record.tagName || record.pointName}成功`);
  };

  // 保存任务
  const handleSaveTask = async (values) => {
    try {
      console.log('保存任务:', values);
      message.success(modalType === 'add' ? '任务创建成功' : '任务更新成功');
      setTaskModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 巡检任务表格列
  const taskColumns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '油站信息',
      key: 'stationInfo',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.stationName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.branchName}</div>
        </div>
      )
    },
    {
      title: '巡检类型',
      dataIndex: 'inspectionType',
      key: 'inspectionType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '日常巡检': 'blue',
          '专项巡检': 'green',
          '消防巡检': 'red'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '巡检频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (text) => {
        const colorMap = {
          '高': 'red',
          '中': 'orange',
          '低': 'green'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const colorMap = {
          '进行中': 'processing',
          '待执行': 'warning',
          '已完成': 'success',
          '已暂停': 'default'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '下次巡检',
      dataIndex: 'nextInspectionTime',
      key: 'nextInspectionTime',
      width: 150
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditTask(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个巡检任务吗？" onConfirm={() => handleDelete(record)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // NFC标签表格列
  const nfcColumns = [
    {
      title: 'NFC标签编码',
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '标签名称',
      dataIndex: 'tagName',
      key: 'tagName',
      width: 200
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180
    },
    {
      title: '关联点位',
      dataIndex: 'pointName',
      key: 'pointName',
      width: 120
    },
    {
      title: '电量',
      dataIndex: 'batteryLevel',
      key: 'batteryLevel',
      width: 120,
      render: (level) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress 
            percent={level} 
            size="small" 
            strokeColor={level > 50 ? '#52c41a' : level > 20 ? '#faad14' : '#ff4d4f'}
            style={{ width: 60 }}
          />
          <span>{level}%</span>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const colorMap = {
          '正常': 'success',
          '低电量': 'warning',
          '故障': 'error',
          '离线': 'default'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '扫描次数',
      dataIndex: 'scanCount',
      key: 'scanCount',
      width: 100
    },
    {
      title: '最近扫描',
      dataIndex: 'lastScanTime',
      key: 'lastScanTime',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个NFC标签吗？" onConfirm={() => handleDelete(record)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 巡检点位表格列
  const pointColumns = [
    {
      title: '点位编码',
      dataIndex: 'pointCode',
      key: 'pointCode',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '点位名称',
      dataIndex: 'pointName',
      key: 'pointName',
      width: 150
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180
    },
    {
      title: '巡检区域',
      dataIndex: 'area',
      key: 'area',
      width: 120
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (text) => {
        const colorMap = {
          '高风险': 'red',
          '中风险': 'orange',
          '低风险': 'green'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '巡检频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100
    },
    {
      title: 'NFC标签',
      dataIndex: 'nfcTagId',
      key: 'nfcTagId',
      width: 100,
      render: (tagId) => tagId ? <Tag color="blue">已关联</Tag> : <Tag color="default">未关联</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const colorMap = {
          '正常': 'success',
          '异常': 'error',
          '维护中': 'warning'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个巡检点位吗？" onConfirm={() => handleDelete(record)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 执行统计表格列
  const statsColumns = [
    {
      title: '组织类型',
      dataIndex: 'orgType',
      key: 'orgType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '分公司': 'blue',
          '服务区': 'green',
          '油站': 'orange'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '上级组织',
      dataIndex: 'parentOrgName',
      key: 'parentOrgName',
      width: 150,
      render: (text) => text || '-'
    },
    {
      title: '总任务数',
      dataIndex: 'totalTasks',
      key: 'totalTasks',
      width: 100,
      render: (num) => <span style={{ fontWeight: 'bold' }}>{num}</span>
    },
    {
      title: '已完成',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
      width: 100,
      render: (num) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{num}</span>
    },
    {
      title: '进行中',
      dataIndex: 'pendingTasks',
      key: 'pendingTasks',
      width: 100,
      render: (num) => <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{num}</span>
    },
    {
      title: '已逾期',
      dataIndex: 'overdueTasks',
      key: 'overdueTasks',
      width: 100,
      render: (num) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{num}</span>
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 150,
      render: (rate) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={rate >= 90 ? '#52c41a' : rate >= 70 ? '#faad14' : '#ff4d4f'}
            style={{ width: 80 }}
          />
          <span>{rate}%</span>
        </div>
      )
    },
    {
      title: '准时率',
      dataIndex: 'onTimeRate',
      key: 'onTimeRate',
      width: 150,
      render: (rate) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={rate >= 95 ? '#52c41a' : rate >= 80 ? '#faad14' : '#ff4d4f'}
            style={{ width: 80 }}
          />
          <span>{rate}%</span>
        </div>
      )
    }
  ];

  // 整改记录表格列
  const rectificationColumns = [
    {
      title: '问题标题',
      dataIndex: 'issueTitle',
      key: 'issueTitle',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '油站信息',
      key: 'stationInfo',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.stationName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.pointName}</div>
        </div>
      )
    },
    {
      title: '风险等级',
      dataIndex: 'issueLevel',
      key: 'issueLevel',
      width: 100,
      render: (text) => {
        const colorMap = {
          '高风险': 'red',
          '中风险': 'orange',
          '低风险': 'green'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '发现时间',
      dataIndex: 'discoverTime',
      key: 'discoverTime',
      width: 150
    },
    {
      title: '责任人',
      dataIndex: 'responsiblePerson',
      key: 'responsiblePerson',
      width: 100
    },
    {
      title: '计划完成时间',
      dataIndex: 'planCompletionTime',
      key: 'planCompletionTime',
      width: 150
    },
    {
      title: '整改状态',
      dataIndex: 'rectificationStatus',
      key: 'rectificationStatus',
      width: 100,
      render: (text) => {
        const colorMap = {
          '已完成': 'success',
          '整改中': 'processing',
          '已逾期': 'error'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          查看
        </Button>
      )
    }
  ];

  // 风险分析表格列
  const riskColumns = [
    {
      title: '风险标题',
      dataIndex: 'riskTitle',
      key: 'riskTitle',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level) => {
        const colors = ['', '#52c41a', '#faad14', '#fa8c16', '#ff4d4f', '#a0071b'];
        const texts = ['', '低风险', '较低风险', '中等风险', '高风险', '极高风险'];
        return <Tag color={colors[level]}>{texts[level]} (L{level})</Tag>;
      }
    },
    {
      title: '风险类型',
      dataIndex: 'riskType',
      key: 'riskType',
      width: 120,
      render: (text) => {
        const colorMap = {
          '设备风险': 'blue',
          '环保风险': 'green',
          '技术风险': 'purple',
          '安全风险': 'red'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '影响油站数',
      dataIndex: 'affectedStations',
      key: 'affectedStations',
      width: 120,
      render: (stations) => <span style={{ fontWeight: 'bold' }}>{stations.length} 个</span>
    },
    {
      title: '问题总数',
      dataIndex: 'issueCount',
      key: 'issueCount',
      width: 100
    },
    {
      title: '未解决',
      dataIndex: 'unsolvedCount',
      key: 'unsolvedCount',
      width: 100,
      render: (num) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{num}</span>
    },
    {
      title: '风险评分',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 120,
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={score >= 80 ? '#ff4d4f' : score >= 60 ? '#fa8c16' : '#faad14'}
            style={{ width: 60 }}
          />
          <span>{score}</span>
        </div>
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          查看
        </Button>
      )
    }
  ];

  // 修改记录表格列
  const changeColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '新增': 'success',
          '修改': 'warning',
          '删除': 'error'
        };
        const iconMap = {
          '新增': <PlusOutlined />,
          '修改': <EditOutlined />,
          '删除': <DeleteOutlined />
        };
        return <Tag color={colorMap[text]} icon={iconMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '变更对象',
      dataIndex: 'changeObject',
      key: 'changeObject',
      width: 120
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 250
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        const colorMap = {
          '已审批': 'success',
          '审批中': 'processing',
          '已拒绝': 'error'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      )
    }
  ];

  const tabItems = [
    {
      key: 'tasks',
      label: (
        <span>
          <SafetyOutlined />
          巡检任务列表
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="stationName" label="油站名称">
                    <TreeSelect
                      placeholder="请选择油站"
                      treeData={[
                        {
                          title: '全部油站',
                          value: 'all',
                          children: stationData.branches.map(branch => ({
                            title: branch.name,
                            value: branch.id,
                            children: stationData.stations.filter(s => s.branchId === branch.id).map(station => ({
                              title: station.name,
                              value: station.id
                            }))
                          }))
                        }
                      ]}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="inspectionType" label="巡检类型">
                    <Select placeholder="请选择类型" allowClear>
                      <Option value="日常巡检">日常巡检</Option>
                      <Option value="专项巡检">专项巡检</Option>
                      <Option value="消防巡检">消防巡检</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status" label="任务状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="进行中">进行中</Option>
                      <Option value="待执行">待执行</Option>
                      <Option value="已完成">已完成</Option>
                      <Option value="已暂停">已暂停</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="priority" label="优先级">
                    <Select placeholder="请选择优先级" allowClear>
                      <Option value="高">高</Option>
                      <Option value="中">中</Option>
                      <Option value="低">低</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>
                      新建任务
                    </Button>
                    <Button icon={<HistoryOutlined />} onClick={handleViewChanges}>
                      修改记录
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 任务列表 */}
          <Card>
            <Table
              columns={taskColumns}
              dataSource={taskList}
              rowKey="id"
              scroll={{ x: 1400 }}
              pagination={{
                total: taskList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'nfc',
      label: (
        <span>
          <ScanOutlined />
          NFC标签管理
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={nfcForm} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={6}>
                  <Form.Item name="tagCode" label="标签编码">
                    <Input placeholder="请输入标签编码" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="stationId" label="所属油站">
                    <Select placeholder="请选择油站" allowClear>
                      {stationData.stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status" label="标签状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="正常">正常</Option>
                      <Option value="低电量">低电量</Option>
                      <Option value="故障">故障</Option>
                      <Option value="离线">离线</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={9} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />}>
                      新增标签
                    </Button>
                    <Button icon={<HistoryOutlined />} onClick={handleViewChanges}>
                      修改记录
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* NFC标签列表 */}
          <Card>
            <Table
              columns={nfcColumns}
              dataSource={nfcTags}
              rowKey="id"
              scroll={{ x: 1300 }}
              pagination={{
                total: nfcTags.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'points',
      label: (
        <span>
          <EnvironmentOutlined />
          巡检点位维护
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={pointForm} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="pointName" label="点位名称">
                    <Input placeholder="请输入点位名称" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="stationId" label="所属油站">
                    <Select placeholder="请选择油站" allowClear>
                      {stationData.stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="area" label="巡检区域">
                    <Select placeholder="请选择区域" allowClear>
                      <Option value="储存区域">储存区域</Option>
                      <Option value="作业区域">作业区域</Option>
                      <Option value="设施区域">设施区域</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="riskLevel" label="风险等级">
                    <Select placeholder="请选择等级" allowClear>
                      <Option value="高风险">高风险</Option>
                      <Option value="中风险">中风险</Option>
                      <Option value="低风险">低风险</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />}>
                      新增点位
                    </Button>
                    <Button icon={<HistoryOutlined />} onClick={handleViewChanges}>
                      修改记录
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 巡检点位列表 */}
          <Card>
            <Table
              columns={pointColumns}
              dataSource={inspectionPoints}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: inspectionPoints.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          巡检任务执行统计
        </span>
      ),
      children: (
        <div>
          {/* 统计概览 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总任务数"
                  value={executionStats.reduce((sum, item) => sum + item.totalTasks, 0)}
                  suffix="个"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已完成任务"
                  value={executionStats.reduce((sum, item) => sum + item.completedTasks, 0)}
                  suffix="个"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="进行中任务"
                  value={executionStats.reduce((sum, item) => sum + item.pendingTasks, 0)}
                  suffix="个"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="逾期任务"
                  value={executionStats.reduce((sum, item) => sum + item.overdueTasks, 0)}
                  suffix="个"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 执行统计表格 */}
          <Card>
            <Table
              columns={statsColumns}
              dataSource={executionStats}
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={{
                total: executionStats.length,
                pageSize: 15,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'rectification',
      label: (
        <span>
          <AlertOutlined />
          整改情况查询
        </span>
      ),
      children: (
        <div>
          {/* 整改概览 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="整改问题总数"
                  value={rectificationRecords.length}
                  suffix="个"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="已完成整改"
                  value={rectificationRecords.filter(r => r.rectificationStatus === '已完成').length}
                  suffix="个"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="整改中"
                  value={rectificationRecords.filter(r => r.rectificationStatus === '整改中').length}
                  suffix="个"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 整改记录表格 */}
          <Card>
            <Table
              columns={rectificationColumns}
              dataSource={rectificationRecords}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: rectificationRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'risk',
      label: (
        <span>
          <AlertOutlined />
          风险分析报表
        </span>
      ),
      children: (
        <div>
          {/* 风险概览 */}
          <Alert
            message="风险分析提醒"
            description={`当前系统共识别 ${riskAnalysis.length} 个风险点，其中高风险 ${riskAnalysis.filter(r => r.riskLevel >= 4).length} 个，需要重点关注和处理。`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="风险总数"
                  value={riskAnalysis.length}
                  suffix="个"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="高风险项"
                  value={riskAnalysis.filter(r => r.riskLevel >= 4).length}
                  suffix="个"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="未解决问题"
                  value={riskAnalysis.reduce((sum, item) => sum + item.unsolvedCount, 0)}
                  suffix="个"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均风险评分"
                  value={Math.round(riskAnalysis.reduce((sum, item) => sum + item.riskScore, 0) / riskAnalysis.length)}
                  suffix="分"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 风险分析表格 */}
          <Card>
            <Table
              columns={riskColumns}
              dataSource={riskAnalysis}
              rowKey="id"
              scroll={{ x: 1300 }}
              pagination={{
                total: riskAnalysis.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'changes',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: (
        <div>
          <Card>
            <Table
              columns={changeColumns}
              dataSource={changeRecords}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: changeRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="inspection-management-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>

      {/* 任务表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新建巡检任务' : '编辑巡检任务'}
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setTaskModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => taskForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleSaveTask}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="taskName" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stationId" label="所属油站" rules={[{ required: true, message: '请选择油站' }]}>
                <Select placeholder="请选择油站">
                  {stationData.stations.map(station => (
                    <Option key={station.id} value={station.id}>{station.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="inspectionType" label="巡检类型" rules={[{ required: true, message: '请选择巡检类型' }]}>
                <Select placeholder="请选择巡检类型">
                  <Option value="日常巡检">日常巡检</Option>
                  <Option value="专项巡检">专项巡检</Option>
                  <Option value="消防巡检">消防巡检</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="frequency" label="巡检频率" rules={[{ required: true, message: '请输入巡检频率' }]}>
                <Select placeholder="请选择巡检频率">
                  <Option value="每日一次">每日一次</Option>
                  <Option value="每周一次">每周一次</Option>
                  <Option value="每月一次">每月一次</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assignee" label="负责人" rules={[{ required: true, message: '请输入负责人' }]}>
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="高">高</Option>
                  <Option value="中">中</Option>
                  <Option value="低">低</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="任务描述">
                <TextArea rows={3} placeholder="请输入任务描述" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="详情查看"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="名称">{currentRecord.taskName || currentRecord.tagName || currentRecord.pointName || currentRecord.issueTitle || currentRecord.riskTitle}</Descriptions.Item>
            <Descriptions.Item label="状态">{currentRecord.status || currentRecord.rectificationStatus}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentRecord.createTime || currentRecord.discoverTime}</Descriptions.Item>
            <Descriptions.Item label="负责人">{currentRecord.assignee || currentRecord.responsiblePerson}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 修改记录弹窗 */}
      <Modal
        title={<><HistoryOutlined /> 修改记录</>}
        open={changeModalVisible}
        onCancel={() => setChangeModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setChangeModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        <Table
          columns={changeColumns}
          dataSource={changeRecords}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>

      {/* 备注信息 */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: '#f6f8fa', 
        borderRadius: 4, 
        border: '1px solid #e1e8ed',
        fontSize: 12,
        color: '#666'
      }}>
        <strong>功能演示说明：</strong>
        <br />
        1. 巡检任务列表：支持创建和查看巡检任务，关联整个集团的加油站巡检点位、巡检项、巡检内容和巡检频率
        <br />
        2. NFC标签管理：管理NFC标签的信息、电量状态和关联点位
        <br />
        3. 巡检点位维护：列表方式列出巡检点位，包括不同的巡检区域和风险等级
        <br />
        4. 巡检任务执行统计：统计每个分公司、服务区、油站的执行巡检任务情况
        <br />
        5. 整改情况查询：统计问题点位的整改和维修情况
        <br />
        6. 风险分析报表：统计尚未解决的巡检问题和风险，对风险进行5级分级
        <br />
        * 所有功能均支持筛选查询，并包含完整的修改记录追踪
      </div>
    </div>
  );
};

export default InspectionManagement; 