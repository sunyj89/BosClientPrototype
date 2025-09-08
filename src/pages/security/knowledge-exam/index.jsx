import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, Upload, Popconfirm, Tree, Layout, Steps, InputNumber, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, HistoryOutlined, BookOutlined, QuestionCircleOutlined, FileTextOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import knowledgeExamData from '../../../mock/security/knowledgeExamData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea, Search } = Input;
const { Sider, Content } = Layout;
const { Step } = Steps;

const KnowledgeExamManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  
  // 表单实例
  const [courseForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [paperForm] = Form.useForm();
  const [examForm] = Form.useForm();
  const [courseFilterForm] = Form.useForm();
  const [questionFilterForm] = Form.useForm();
  const [paperFilterForm] = Form.useForm();
  const [examFilterForm] = Form.useForm();
  
  // 数据状态
  const [courseList, setCourseList] = useState([]);
  const [questionBankTree, setQuestionBankTree] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [paperList, setPaperList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  
  // 弹窗状态
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [paperModalVisible, setPaperModalVisible] = useState(false);
  const [examModalVisible, setExamModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [batchImportModalVisible, setBatchImportModalVisible] = useState(false);
  
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view
  const [currentModule, setCurrentModule] = useState('course'); // course, question, paper, exam
  
  // 题库相关状态
  const [selectedQuestionBank, setSelectedQuestionBank] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  
  // 试卷创建状态
  const [paperCreateStep, setPaperCreateStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');
  const [questionCourseFilter, setQuestionCourseFilter] = useState(null);
  
  // 选择状态
  const [paperSelectedRowKeys, setPaperSelectedRowKeys] = useState([]);
  const [examSelectedRowKeys, setExamSelectedRowKeys] = useState([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setCourseList(knowledgeExamData.courses || []);
      setQuestionBankTree(knowledgeExamData.questionBankTree || []);
      setQuestionList(knowledgeExamData.questions || []);
      setPaperList(knowledgeExamData.papers || []);
      setExamList(knowledgeExamData.exams || []);
      setChangeRecords(knowledgeExamData.changeRecords || []);
      setLoading(false);
    }, 500);
  };

  // 课程相关操作
  const handleAddCourse = () => {
    setModalType('add');
    setCurrentModule('course');
    courseForm.resetFields();
    setCourseModalVisible(true);
  };

  const handleEditCourse = (record) => {
    setModalType('edit');
    setCurrentModule('course');
    setCurrentRecord(record);
    courseForm.setFieldsValue({
      ...record,
      createTime: record.createTime ? moment(record.createTime) : null
    });
    setCourseModalVisible(true);
  };

  const handleSaveCourse = async (values) => {
    try {
      // 如果是新增模式，系统自动生成课程ID
      if (modalType === 'add') {
        values.courseId = `CRS${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        values.id = values.courseId;
        values.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        values.creator = '管理员';
        console.log('保存课程:', values);
        message.success(`课程创建成功，课程编号：${values.courseId}`);
      } else {
        console.log('更新课程:', values);
        message.success('课程更新成功');
      }
      
      setCourseModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDeleteCourse = (record) => {
    message.success(`删除课程"${record.courseName}"成功`);
  };

  // 题库相关操作
  const onSelectQuestionBank = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      setSelectedQuestionBank(info.node);
      // 根据选中的题库过滤题目列表
      const bankId = selectedKeys[0];
      const filteredQuestions = knowledgeExamData.questions.filter(q => q.questionBankId === bankId);
      setQuestionList(filteredQuestions);
    }
  };

  const handleAddQuestion = () => {
    if (!selectedQuestionBank) {
      message.warning('请先选择题库');
      return;
    }
    setModalType('add');
    setCurrentModule('question');
    questionForm.resetFields();
    questionForm.setFieldsValue({
      questionType: 'single',
      questionBankId: selectedQuestionBank.key,
      questionBankName: selectedQuestionBank.title
    });
    setQuestionModalVisible(true);
  };


  const handleSaveQuestion = async (values) => {
    try {
      // 如果是新增模式，系统自动生成题目ID
      if (modalType === 'add') {
        values.questionId = `QST${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        values.id = values.questionId;
        values.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        values.creator = '管理员';
        
        // 处理选项数据
        if (values.questionType !== 'essay') {
          values.options = [
            values.optionA,
            values.optionB,
            values.optionC || '',
            values.optionD || ''
          ].filter(option => option);
        }
        
        console.log('保存题目:', values);
        message.success(`题目创建成功，题目编号：${values.questionId}`);
      } else {
        console.log('更新题目:', values);
        message.success('题目更新成功');
      }
      
      setQuestionModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 试卷相关操作
  const handleAddPaper = () => {
    setModalType('add');
    setCurrentModule('paper');
    paperForm.resetFields();
    setPaperCreateStep(0);
    setSelectedQuestions([]);
    setSelectedCourse(null);
    setQuestionSearchTerm('');
    setQuestionCourseFilter(null);
    setPaperModalVisible(true);
  };

  const handleEditPaper = (record) => {
    setModalType('edit');
    setCurrentModule('paper');
    setCurrentRecord(record);
    paperForm.setFieldsValue(record);
    setPaperModalVisible(true);
  };

  const handleSavePaper = async () => {
    try {
      const values = paperForm.getFieldsValue();
      // 如果是新增模式，系统自动生成试卷ID
      if (modalType === 'add') {
        values.paperId = `EXM${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        values.id = values.paperId;
        values.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        values.creator = '管理员';
        values.status = '草稿';
        values.questionCount = selectedQuestions.length;
        values.totalScore = selectedQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
        values.relatedCourse = selectedCourse;
        console.log('保存试卷:', values);
        message.success(`试卷创建成功，试卷编号：${values.paperId}`);
      } else {
        console.log('保存试卷:', values);
        message.success('试卷更新成功');
      }
      
      setPaperModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 考试相关操作
  const handleAddExam = () => {
    setModalType('add');
    setCurrentModule('exam');
    examForm.resetFields();
    setExamModalVisible(true);
  };

  const handleEditExam = (record) => {
    setModalType('edit');
    setCurrentModule('exam');
    setCurrentRecord(record);
    examForm.setFieldsValue({
      ...record,
      startTime: record.startTime ? moment(record.startTime) : null,
      endTime: record.endTime ? moment(record.endTime) : null
    });
    setExamModalVisible(true);
  };

  const handleSaveExam = async (values) => {
    try {
      // 如果是新增模式，系统自动生成考试ID
      if (modalType === 'add') {
        values.id = `EXM${String(Date.now()).slice(-6)}`;
        values.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        values.creator = '管理员';
        values.status = '未开始';
        values.participantCount = 0;
        values.completedCount = 0;
        console.log('保存考试:', values);
        message.success(`考试创建成功，考试ID：${values.id}`);
      } else {
        console.log('保存考试:', values);
        message.success('考试更新成功');
      }
      
      setExamModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 通用操作
  const handleViewDetail = (record, module) => {
    setCurrentRecord(record);
    setCurrentModule(module);
    setViewModalVisible(true);
  };


  const handleDelete = (record, module) => {
    const moduleNames = {
      course: '课程',
      question: '题目',
      paper: '试卷',
      exam: '考试'
    };
    message.success(`删除${moduleNames[module]}"${record.courseName || record.questionContent || record.paperTitle || record.examTitle}"成功`);
  };

  // 试卷预览函数
  const handlePreviewPaper = (record) => {
    setCurrentRecord(record);
    setPreviewModalVisible(true);
  };

  // 下载Word功能
  const handleDownloadWord = () => {
    message.success('试卷Word文档下载开始，请稍候...');
  };

  // 过滤题目列表
  const getFilteredQuestions = () => {
    let filtered = questionList;
    
    // 按名称过滤
    if (questionSearchTerm) {
      filtered = filtered.filter(q => 
        q.questionName?.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
        q.questionContent?.toLowerCase().includes(questionSearchTerm.toLowerCase())
      );
    }
    
    // 按课程过滤
    if (questionCourseFilter) {
      filtered = filtered.filter(q => q.relatedCourse === questionCourseFilter);
    }
    
    return filtered;
  };

  // 搜索重置
  const handleCourseSearch = (values) => {
    console.log('课程搜索条件:', values);
    message.success('搜索功能已触发');
  };

  const handleCourseReset = () => {
    courseFilterForm.resetFields();
    message.info('搜索条件已重置');
  };

  const handleQuestionSearch = (values) => {
    console.log('题目搜索条件:', values);
    message.success('搜索功能已触发');
  };

  const handleQuestionReset = () => {
    questionFilterForm.resetFields();
    message.info('搜索条件已重置');
  };

  const handlePaperSearch = (values) => {
    console.log('试卷搜索条件:', values);
    message.success('搜索功能已触发');
  };

  const handlePaperReset = () => {
    paperFilterForm.resetFields();
    message.info('搜索条件已重置');
  };

  const handleExamSearch = (values) => {
    console.log('考试搜索条件:', values);
    message.success('搜索功能已触发');
  };

  const handleExamReset = () => {
    examFilterForm.resetFields();
    message.info('搜索条件已重置');
  };

  // 表格列定义
  const courseColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '课程编号',
      dataIndex: 'courseId',
      key: 'courseId',
      width: 140,
      render: (text) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      key: 'courseType',
      width: 120,
      render: (type) => {
        const typeMap = {
          '安全培训': { color: 'red', text: '安全培训' },
          '技能培训': { color: 'blue', text: '技能培训' },
          '法规培训': { color: 'green', text: '法规培训' },
          '应急培训': { color: 'orange', text: '应急培训' }
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '课程分类',
      dataIndex: 'courseCategory',
      key: 'courseCategory',
      width: 120
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'course')}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditCourse(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个课程吗？"
            onConfirm={() => handleDeleteCourse(record)}
          >
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const questionColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '题目编号',
      dataIndex: 'questionId',
      key: 'questionId',
      width: 140,
      render: (text) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
    },
    {
      title: '题目名称',
      dataIndex: 'questionName',
      key: 'questionName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '题型',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 80,
      render: (type) => {
        const typeMap = {
          single: { color: 'blue', text: '单选' },
          multiple: { color: 'green', text: '多选' },
          judge: { color: 'orange', text: '判断' },
          essay: { color: 'purple', text: '问答' }
        };
        const config = typeMap[type] || { color: 'default', text: '未知' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '题干',
      dataIndex: 'questionContent',
      key: 'questionContent',
      width: 300,
      ellipsis: true
    },
    {
      title: '答案',
      dataIndex: 'correctAnswer',
      key: 'correctAnswer',
      width: 100,
      render: (answer, record) => {
        if (record.questionType === 'essay') {
          return <Tag color="default">主观题</Tag>;
        }
        return <Tag color="success">{answer}</Tag>;
      }
    },
    {
      title: '关联课程',
      dataIndex: 'relatedCourse',
      key: 'relatedCourse',
      width: 150,
      ellipsis: true
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'question')}>
          查看
        </Button>
      )
    }
  ];

  const paperColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '试卷编号',
      dataIndex: 'paperId',
      key: 'paperId',
      width: 140,
      render: (text) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
    },
    {
      title: '试卷名称',
      dataIndex: 'paperTitle',
      key: 'paperTitle',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '关联课程',
      dataIndex: 'relatedCourse',
      key: 'relatedCourse',
      width: 150
    },
    {
      title: '题目数量',
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 100,
      align: 'center'
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 80,
      align: 'center'
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handlePreviewPaper(record)}>
            预览
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditPaper(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这份试卷吗？"
            onConfirm={() => handleDelete(record, 'paper')}
          >
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const examColumns = [
    {
      title: '考试名称',
      dataIndex: 'examTitle',
      key: 'examTitle',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '关联试卷',
      dataIndex: 'paperTitle',
      key: 'paperTitle',
      width: 180
    },
    {
      title: '考试时间',
      key: 'examTime',
      width: 300,
      render: (_, record) => (
        <div>
          <div>开始：{record.startTime}</div>
          <div>结束：{record.endTime}</div>
        </div>
      )
    },
    {
      title: '考试时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration) => `${duration}分钟`
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 100,
      align: 'center'
    },
    {
      title: '完成人数',
      dataIndex: 'completedCount',
      key: 'completedCount',
      width: 100,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusMap = {
          未开始: { color: 'default', text: '未开始' },
          进行中: { color: 'processing', text: '进行中' },
          已结束: { color: 'success', text: '已结束' },
          已取消: { color: 'error', text: '已取消' }
        };
        const config = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'exam')}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditExam(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" icon={<UserOutlined />}>
            考生管理
          </Button>
        </Space>
      )
    }
  ];

  const changeRecordColumns = [
    {
      title: '操作时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 180
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120
    },
    {
      title: '操作类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
      render: (type) => {
        const typeMap = {
          create: { color: 'success', text: '新增' },
          update: { color: 'processing', text: '修改' },
          delete: { color: 'error', text: '删除' }
        };
        const config = typeMap[type] || { color: 'default', text: '未知' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120
    },
    {
      title: '对象名称',
      dataIndex: 'objectName',
      key: 'objectName',
      width: 200
    },
    {
      title: '变更内容',
      dataIndex: 'changeContent',
      key: 'changeContent',
      ellipsis: true
    }
  ];

  return (
    <div className="knowledge-exam-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            {/* 课程中心 */}
            <Tabs.TabPane
              key="courses"
              tab={
                <span>
                  <BookOutlined />
                  课程中心
                </span>
              }
            >
              <div>
                {/* 筛选区域 */}
                <Card style={{ marginBottom: 16 }}>
                  <Form form={courseFilterForm} layout="inline" onFinish={handleCourseSearch}>
                    <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                      <Col span={6}>
                        <Form.Item name="courseName" label="课程名称">
                          <Input placeholder="请输入课程名称" allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="courseType" label="课程类型">
                          <Select placeholder="请选择课程类型" allowClear>
                            <Option value="安全培训">安全培训</Option>
                            <Option value="技能培训">技能培训</Option>
                            <Option value="法规培训">法规培训</Option>
                            <Option value="应急培训">应急培训</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            查询
                          </Button>
                          <Button icon={<ReloadOutlined />} onClick={handleCourseReset}>
                            重置
                          </Button>
                          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCourse}>
                            新建课程
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Form>
                </Card>

                {/* 课程列表 */}
                <Card>
                  <Table
                    columns={courseColumns}
                    dataSource={courseList}
                    rowKey="id"
                    scroll={{ x: 1400 }}
                    pagination={{
                      total: courseList.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                    }}
                  />
                </Card>
              </div>
            </Tabs.TabPane>

            {/* 题库中心 */}
            <Tabs.TabPane
              key="questions"
              tab={
                <span>
                  <QuestionCircleOutlined />
                  题库中心
                </span>
              }
            >
              <div>
                {/* 筛选区域 */}
                <Card style={{ marginBottom: 16 }}>
                  <Form form={questionFilterForm} layout="inline" onFinish={handleQuestionSearch}>
                    <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                      <Col span={4}>
                        <Form.Item name="questionType" label="题型">
                          <Select placeholder="请选择题型" allowClear>
                            <Option value="single">单选题</Option>
                            <Option value="multiple">多选题</Option>
                            <Option value="judge">判断题</Option>
                            <Option value="essay">问答题</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item name="questionId" label="题目编号">
                          <Input placeholder="请输入题目编号" allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="questionName" label="题目名称">
                          <Input placeholder="请输入题目名称" allowClear />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            查询
                          </Button>
                          <Button icon={<ReloadOutlined />} onClick={handleQuestionReset}>
                            重置
                          </Button>
                          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion}>
                            新建题目
                          </Button>
                          <Button type="primary" icon={<UploadOutlined />} onClick={() => setBatchImportModalVisible(true)}>
                            批量导入
                          </Button>
                          <Button icon={<DownloadOutlined />}>
                            下载模板
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Form>
                </Card>

                {/* 题库导航和题目列表 */}
                <Card>
                  <Layout style={{ minHeight: 600 }}>
                    <Sider width={300} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
                      <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <h4 style={{ margin: 0, textAlign: 'center' }}>题库导航</h4>
                      </div>
                      <div style={{ padding: 16 }}>
                        <Tree
                          showLine
                          defaultExpandAll
                          selectedKeys={selectedQuestionBank ? [selectedQuestionBank.key] : []}
                          expandedKeys={expandedKeys}
                          onExpand={setExpandedKeys}
                          onSelect={onSelectQuestionBank}
                          treeData={questionBankTree}
                        />
                      </div>
                    </Sider>
                    <Content style={{ padding: '0 16px' }}>
                      <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <h4 style={{ margin: 0 }}>
                          {selectedQuestionBank ? `${selectedQuestionBank.title} - 题目列表` : '请选择题库查看题目'}
                        </h4>
                      </div>
                      <div style={{ paddingTop: 16 }}>
                        <Table
                          columns={questionColumns}
                          dataSource={questionList}
                          rowKey="id"
                          scroll={{ x: 1400 }}
                          pagination={{
                            total: questionList.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                          }}
                        />
                      </div>
                    </Content>
                  </Layout>
                </Card>
              </div>
            </Tabs.TabPane>

            {/* 试卷中心 */}
            <Tabs.TabPane
              key="papers"
              tab={
                <span>
                  <FileTextOutlined />
                  试卷中心
                </span>
              }
            >
              <div>
                {/* 筛选区域 */}
                <Card style={{ marginBottom: 16 }}>
                  <Form form={paperFilterForm} layout="inline" onFinish={handlePaperSearch}>
                    <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                      <Col span={6}>
                        <Form.Item name="paperTitle" label="试卷名称">
                          <Input placeholder="请输入试卷名称" allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="relatedCourse" label="关联课程">
                          <Select placeholder="请选择关联课程" allowClear>
                            {courseList.map(course => (
                              <Option key={course.id} value={course.courseName}>{course.courseName}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="timeRange" label="创建时间">
                          <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            查询
                          </Button>
                          <Button icon={<ReloadOutlined />} onClick={handlePaperReset}>
                            重置
                          </Button>
                          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPaper}>
                            新建试卷
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Form>
                </Card>

                {/* 试卷列表 */}
                <Card>
                  <Table
                    columns={paperColumns}
                    dataSource={paperList}
                    rowKey="id"
                    scroll={{ x: 1300 }}
                    rowSelection={{
                      selectedRowKeys: paperSelectedRowKeys,
                      onChange: setPaperSelectedRowKeys,
                    }}
                    pagination={{
                      total: paperList.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                    }}
                  />
                </Card>
              </div>
            </Tabs.TabPane>

            {/* 考试中心 */}
            <Tabs.TabPane
              key="exams"
              tab={
                <span>
                  <ClockCircleOutlined />
                  考试中心
                </span>
              }
            >
              <div>
                {/* 筛选区域 */}
                <Card style={{ marginBottom: 16 }}>
                  <Form form={examFilterForm} layout="inline" onFinish={handleExamSearch}>
                    <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                      <Col span={6}>
                        <Form.Item name="examTitle" label="考试名称">
                          <Input placeholder="请输入考试名称" allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item name="status" label="状态">
                          <Select placeholder="请选择状态" allowClear>
                            <Option value="未开始">未开始</Option>
                            <Option value="进行中">进行中</Option>
                            <Option value="已结束">已结束</Option>
                            <Option value="已取消">已取消</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="timeRange" label="考试时间">
                          <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            查询
                          </Button>
                          <Button icon={<ReloadOutlined />} onClick={handleExamReset}>
                            重置
                          </Button>
                          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddExam}>
                            发布考试
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Form>
                </Card>

                {/* 考试列表 */}
                <Card>
                  <Table
                    columns={examColumns}
                    dataSource={examList}
                    rowKey="id"
                    scroll={{ x: 1400 }}
                    rowSelection={{
                      selectedRowKeys: examSelectedRowKeys,
                      onChange: setExamSelectedRowKeys,
                    }}
                    pagination={{
                      total: examList.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                    }}
                  />
                </Card>
              </div>
            </Tabs.TabPane>

            {/* 修改记录 */}
            <Tabs.TabPane
              key="changes"
              tab={
                <span>
                  <HistoryOutlined />
                  修改记录
                </span>
              }
            >
              <div>
                <Card>
                  <Table
                    columns={changeRecordColumns}
                    dataSource={changeRecords}
                    rowKey="id"
                    scroll={{ x: 1000 }}
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
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Card>

      {/* 课程表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新建课程' : '编辑课程'}
        open={courseModalVisible}
        onCancel={() => setCourseModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setCourseModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => courseForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={courseForm}
          layout="vertical"
          onFinish={handleSaveCourse}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="courseId" label="课程编号">
                <Input disabled placeholder="系统自动生成" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="courseName" label="课程名称" rules={[{ required: true, message: '请输入课程名称' }]}>
                <Input placeholder="请输入课程名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="courseType" label="课程类型" rules={[{ required: true, message: '请选择课程类型' }]}>
                <Select placeholder="请选择课程类型">
                  <Option value="安全培训">安全培训</Option>
                  <Option value="技能培训">技能培训</Option>
                  <Option value="法规培训">法规培训</Option>
                  <Option value="应急培训">应急培训</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="courseCategory" label="课程分类" rules={[{ required: true, message: '请输入课程分类' }]}>
                <Input placeholder="请输入课程分类" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="manager" label="负责人" rules={[{ required: true, message: '请输入负责人' }]}>
                <Input placeholder="请输入课程负责人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* 空列用于对齐 */}
            </Col>
            <Col span={24}>
              <Form.Item name="courseSummary" label="课程概述" rules={[{ required: true, message: '请输入课程概述' }]}>
                <TextArea rows={4} placeholder="请输入课程的详细概述" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="courseAttachment" label="上传课程附件">
                <Upload
                  name="file"
                  action="/api/upload"
                  headers={{
                    authorization: 'Bearer token',
                  }}
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi"
                  onChange={(info) => {
                    if (info.file.status === 'done') {
                      message.success(`${info.file.name} 文件上传成功`);
                    } else if (info.file.status === 'error') {
                      message.error(`${info.file.name} 文件上传失败`);
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>上传课程附件（PDF/Word/PPT/视频）</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 题目表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新建题目' : '编辑题目'}
        open={questionModalVisible}
        onCancel={() => setQuestionModalVisible(false)}
        width={1200}
        footer={[
          <Button key="cancel" onClick={() => setQuestionModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => questionForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={questionForm}
          layout="vertical"
          onFinish={handleSaveQuestion}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="questionId" label="题目编号">
                <Input disabled placeholder="系统自动生成" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1890ff' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="questionName" label="题目名称" rules={[{ required: true, message: '请输入题目名称' }]}>
                <Input placeholder="请输入题目名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="questionType" label="题型" rules={[{ required: true, message: '请选择题型' }]}>
                <Select placeholder="请选择题型" onChange={(value) => {
                  // 根据题型变化重置选项和答案
                  if (value === 'judge') {
                    questionForm.setFieldsValue({
                      optionA: '正确',
                      optionB: '错误',
                      optionC: '',
                      optionD: ''
                    });
                  } else if (value === 'essay') {
                    questionForm.setFieldsValue({
                      optionA: '',
                      optionB: '',
                      optionC: '',
                      optionD: '',
                      correctAnswer: ''
                    });
                  }
                }}>
                  <Option value="single">单选题</Option>
                  <Option value="multiple">多选题</Option>
                  <Option value="judge">判断题</Option>
                  <Option value="essay">问答题</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="questionBankName" label="所属题库">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="relatedCourse" label="关联课程">
                <Select placeholder="请选择关联课程" allowClear>
                  {courseList.map(course => (
                    <Option key={course.id} value={course.courseName}>{course.courseName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="questionContent" label="题干" rules={[{ required: true, message: '请输入题干' }]}>
                <TextArea rows={4} placeholder="请输入题干内容" />
              </Form.Item>
            </Col>
            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.questionType !== currentValues.questionType}>
              {({ getFieldValue }) => {
                const questionType = getFieldValue('questionType');
                
                if (questionType === 'essay') {
                  return (
                    <Col span={24}>
                      <Form.Item label="答题说明">
                        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          <p style={{ margin: 0, color: '#666' }}>
                            问答题由答题者填写文字内容，无需设置选项。系统将提供文本框供答题者输入答案。
                          </p>
                        </div>
                      </Form.Item>
                    </Col>
                  );
                }
                
                if (questionType === 'judge') {
                  return (
                    <Col span={24}>
                      <Form.Item label="选项（判断题）">
                        <div>
                          <Row gutter={8} style={{ marginBottom: 8 }}>
                            <Col span={2}>A:</Col>
                            <Col span={22}>
                              <Input value="正确" disabled />
                            </Col>
                          </Row>
                          <Row gutter={8}>
                            <Col span={2}>B:</Col>
                            <Col span={22}>
                              <Input value="错误" disabled />
                            </Col>
                          </Row>
                        </div>
                      </Form.Item>
                    </Col>
                  );
                }
                
                return (
                  <Col span={24}>
                    <Form.Item label="选项">
                      <div>
                        <Row gutter={8} style={{ marginBottom: 8 }}>
                          <Col span={2}>A:</Col>
                          <Col span={22}>
                            <Form.Item name="optionA" noStyle>
                              <Input placeholder="选项A内容" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: 8 }}>
                          <Col span={2}>B:</Col>
                          <Col span={22}>
                            <Form.Item name="optionB" noStyle>
                              <Input placeholder="选项B内容" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: 8 }}>
                          <Col span={2}>C:</Col>
                          <Col span={22}>
                            <Form.Item name="optionC" noStyle>
                              <Input placeholder="选项C内容" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={8}>
                          <Col span={2}>D:</Col>
                          <Col span={22}>
                            <Form.Item name="optionD" noStyle>
                              <Input placeholder="选项D内容" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </Form.Item>
                  </Col>
                );
              }}
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.questionType !== currentValues.questionType}>
              {({ getFieldValue }) => {
                const questionType = getFieldValue('questionType');
                
                if (questionType === 'essay') {
                  return null;
                }
                
                const answerOptions = questionType === 'judge' 
                  ? [{ value: 'A', label: 'A (正确)' }, { value: 'B', label: 'B (错误)' }]
                  : [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }, { value: 'D', label: 'D' }];
                
                return (
                  <Col span={12}>
                    <Form.Item name="correctAnswer" label="正确答案" rules={[{ required: true, message: '请选择正确答案' }]}>
                      {questionType === 'multiple' ? (
                        <Select mode="multiple" placeholder="请选择正确答案（可多选）">
                          {answerOptions.map(option => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                          ))}
                        </Select>
                      ) : (
                        <Select placeholder="请选择正确答案">
                          {answerOptions.map(option => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                );
              }}
            </Form.Item>
            <Col span={12}>
              <Form.Item name="score" label="分值" rules={[{ required: true, message: '请输入分值' }]}>
                <InputNumber min={1} max={100} placeholder="请输入分值" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="explanation" label="解析">
                <TextArea rows={3} placeholder="请输入答案解析（可选）" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 试卷创建弹窗 */}
      <Modal
        title="创建试卷"
        open={paperModalVisible}
        onCancel={() => setPaperModalVisible(false)}
        width={1200}
        footer={null}
      >
        <Steps current={paperCreateStep} style={{ marginBottom: 24 }}>
          <Step title="基本信息" />
          <Step title="选择题目" />
          <Step title="完成创建" />
        </Steps>

        {paperCreateStep === 0 && (
          <Form
            form={paperForm}
            layout="vertical"
            onFinish={handleSavePaper}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="paperTitle" label="试卷名称" rules={[{ required: true, message: '请输入试卷名称' }]}>
                  <Input placeholder="请输入试卷名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="relatedCourse" label="关联课程" rules={[{ required: true, message: '请选择关联课程' }]}>
                  <Select placeholder="请选择关联课程" onChange={(value) => {
                    setSelectedCourse(value);
                  }}>
                    {courseList.map(course => (
                      <Option key={course.id} value={course.courseName}>{course.courseName}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="paperDescription" label="试卷描述">
                  <TextArea rows={4} placeholder="请输入试卷描述" />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button type="primary" onClick={() => setPaperCreateStep(1)}>
                下一步
              </Button>
            </div>
          </Form>
        )}

        {paperCreateStep === 1 && (
          <div>
            <Alert
              message="选择题目"
              description="请从下方题库中选择具体题目构成试卷"
              type="info"
              style={{ marginBottom: 16 }}
            />
            
            {/* 题目筛选区域 */}
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Search
                    placeholder="按题目名称或题干搜索"
                    allowClear
                    value={questionSearchTerm}
                    onChange={(e) => setQuestionSearchTerm(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={8}>
                  <Select 
                    placeholder="按课程筛选"
                    allowClear
                    style={{ width: '100%' }}
                    value={questionCourseFilter}
                    onChange={setQuestionCourseFilter}
                  >
                    {courseList.map(course => (
                      <Option key={course.id} value={course.courseName}>{course.courseName}</Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Card>
            
            <div>
              <Table
                size="small"
                columns={questionColumns.filter(col => col.key !== 'action')}
                dataSource={getFilteredQuestions()}
                rowKey="id"
                scroll={{ x: 800, y: 400 }}
                rowSelection={{
                  selectedRowKeys: selectedQuestions.map(q => q.id),
                  onChange: (keys, rows) => setSelectedQuestions(rows),
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                }}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={() => setPaperCreateStep(0)}>
                  上一步
                </Button>
                <Button type="primary" onClick={() => setPaperCreateStep(2)}>
                  下一步
                </Button>
              </Space>
            </div>
          </div>
        )}

        {paperCreateStep === 2 && (
          <div>
            <Alert
              message="试卷创建完成"
              description="请确认试卷信息无误后保存"
              type="success"
              style={{ marginBottom: 16 }}
            />
            <Descriptions title="试卷信息" bordered>
              <Descriptions.Item label="试卷名称">安全知识测试卷</Descriptions.Item>
              <Descriptions.Item label="组卷方式">固定组卷</Descriptions.Item>
              <Descriptions.Item label="题目数量">{selectedQuestions.length}</Descriptions.Item>
              <Descriptions.Item label="总分">100</Descriptions.Item>
            </Descriptions>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={() => setPaperCreateStep(1)}>
                  上一步
                </Button>
                <Button type="primary" onClick={handleSavePaper}>
                  保存试卷
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 考试发布弹窗 */}
      <Modal
        title={modalType === 'add' ? '发布考试' : '编辑考试'}
        open={examModalVisible}
        onCancel={() => setExamModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setExamModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => examForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={examForm}
          layout="vertical"
          onFinish={handleSaveExam}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="examTitle" label="考试名称" rules={[{ required: true, message: '请输入考试名称' }]}>
                <Input placeholder="请输入考试名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="paperId" label="关联试卷" rules={[{ required: true, message: '请选择试卷' }]}>
                <Select placeholder="请选择试卷">
                  {paperList.map(paper => (
                    <Option key={paper.id} value={paper.id}>{paper.paperTitle}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="考试时长（分钟）" rules={[{ required: true, message: '请输入考试时长' }]}>
                <InputNumber min={1} placeholder="请输入考试时长" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="passScore" label="及格分数" rules={[{ required: true, message: '请输入及格分数' }]}>
                <InputNumber min={0} max={100} placeholder="请输入及格分数" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="participants" label="参与人员" rules={[{ required: true, message: '请选择参与人员' }]}>
                <Select mode="multiple" placeholder="请选择参与人员">
                  <Option value="user1">张三</Option>
                  <Option value="user2">李四</Option>
                  <Option value="user3">王五</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="examDescription" label="考试说明">
                <TextArea rows={4} placeholder="请输入考试说明" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 试卷预览弹窗 */}
      <Modal
        title="试卷预览"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        width={1000}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadWord}>
            下载Word
          </Button>,
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {currentRecord && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2>{currentRecord.paperTitle || '试卷预览'}</h2>
              <p>题目数量：{currentRecord.questionCount}题 &nbsp;&nbsp; 总分：{currentRecord.totalScore}分 &nbsp;&nbsp; 关联课程：{currentRecord.relatedCourse || '无'}</p>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <h4>一、单选题（每题5分，共10题）</h4>
              <div style={{ marginLeft: 20 }}>
                <p>1. 加油站员工上岗前必须经过哪些培训？</p>
                <div style={{ marginLeft: 20 }}>
                  <p>A. 安全知识培训</p>
                  <p>B. 操作技能培训</p>
                  <p>C. 应急处理培训</p>
                  <p>D. 以上都是</p>
                </div>
              </div>
              <div style={{ marginLeft: 20, marginTop: 16 }}>
                <p>2. 使用加油机前，首先应该检查什么？</p>
                <div style={{ marginLeft: 20 }}>
                  <p>A. 油枪是否完好</p>
                  <p>B. 计量器是否归零</p>
                  <p>C. 接地线是否连接</p>
                  <p>D. 以上都要检查</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4>二、多选题（每题8分，共5题）</h4>
              <div style={{ marginLeft: 20 }}>
                <p>1. 加油站安全检查应包括哪些内容？</p>
                <div style={{ marginLeft: 20 }}>
                  <p>A. 设备运行状态</p>
                  <p>B. 安全标识完整性</p>
                  <p>C. 消防设施完好性</p>
                  <p>D. 人员操作规范性</p>
                </div>
              </div>
              <div style={{ marginLeft: 20, marginTop: 16 }}>
                <p>2. 火灾发生的必要条件包括？</p>
                <div style={{ marginLeft: 20 }}>
                  <p>A. 可燃物</p>
                  <p>B. 助燃物（氧气）</p>
                  <p>C. 着火源</p>
                  <p>D. 化学催化剂</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4>三、判断题（每题3分，共3题）</h4>
              <div style={{ marginLeft: 20 }}>
                <p>1. 加油站可以在雷雨天气进行加油作业。</p>
                <div style={{ marginLeft: 20 }}>
                  <p>A. 正确 &nbsp;&nbsp;&nbsp;&nbsp; B. 错误</p>
                </div>
              </div>
              <div style={{ marginLeft: 20, marginTop: 16 }}>
                <p>2. 加油站废油可以直接倒入下水道。</p>
                <div style={{ marginLeft: 20 }}>
                  <p>A. 正确 &nbsp;&nbsp;&nbsp;&nbsp; B. 错误</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4>四、问答题（共15分）</h4>
              <div style={{ marginLeft: 20 }}>
                <p>1. 请阐述定期开展应急演练对加油站安全管理的重要性，并说明如何提高演练效果？（15分）</p>
                <div style={{ marginLeft: 20, marginTop: 10, padding: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>答题区域（请在此处填写答案）</p>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 40, padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#666' }}>试卷预览完毕，可点击上方"下载Word"按钮获取完整试卷文档</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 批量导入弹窗 */}
      <Modal
        title="批量导入题目"
        open={batchImportModalVisible}
        onCancel={() => setBatchImportModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setBatchImportModalVisible(false)}>
            取消
          </Button>,
          <Button key="download" onClick={() => message.success('模板下载成功')}>
            下载模板
          </Button>,
          <Button key="import" type="primary">
            开始导入
          </Button>
        ]}
      >
        <div>
          <Alert
            message="导入说明"
            description="请下载Excel模板，按照模板格式填写题目信息后上传"
            type="info"
            style={{ marginBottom: 16 }}
          />
          <Upload.Dragger
            name="file"
            multiple={false}
            accept=".xlsx,.xls"
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持扩展名：.xlsx .xls
            </p>
          </Upload.Dragger>
        </div>
      </Modal>

      {/* 课程查看详情弹窗 */}
      <Modal
        title="课程详情"
        open={viewModalVisible && currentModule === 'course'}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <div>
            <Descriptions title="基本信息" column={2} bordered>
              <Descriptions.Item label="课程编号">{currentRecord.courseId}</Descriptions.Item>
              <Descriptions.Item label="课程名称">{currentRecord.courseName}</Descriptions.Item>
              <Descriptions.Item label="课程类型">
                {(() => {
                  const typeMap = {
                    '安全培训': { color: 'red', text: '安全培训' },
                    '技能培训': { color: 'blue', text: '技能培训' },
                    '法规培训': { color: 'green', text: '法规培训' },
                    '应急培训': { color: 'orange', text: '应急培训' }
                  };
                  const config = typeMap[currentRecord.courseType] || { color: 'default', text: currentRecord.courseType };
                  return <Tag color={config.color}>{config.text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="课程分类">{currentRecord.courseCategory}</Descriptions.Item>
              <Descriptions.Item label="负责人" span={2}>{currentRecord.manager}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="课程信息" column={1} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="课程概述">{currentRecord.courseSummary}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="创建信息" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="创建人">{currentRecord.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
            </Descriptions>

            {currentRecord.courseAttachment && (
              <Descriptions title="课程附件" column={1} bordered style={{ marginTop: 16 }}>
                <Descriptions.Item label="附件文件">
                  <Button 
                    type="link" 
                    icon={<DownloadOutlined />}
                    onClick={() => message.success('正在下载课程附件')}
                  >
                    课程附件文件.pdf
                  </Button>
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        )}
      </Modal>

      {/* 题目查看详情弹窗 */}
      <Modal
        title="题目详情"
        open={viewModalVisible && currentModule === 'question'}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <div>
            <Descriptions title="基本信息" column={2} bordered>
              <Descriptions.Item label="题目编号">{currentRecord.questionId}</Descriptions.Item>
              <Descriptions.Item label="题目名称">{currentRecord.questionName}</Descriptions.Item>
              <Descriptions.Item label="题型">
                {(() => {
                  const typeMap = {
                    single: { color: 'blue', text: '单选题' },
                    multiple: { color: 'green', text: '多选题' },
                    judge: { color: 'orange', text: '判断题' },
                    essay: { color: 'purple', text: '问答题' }
                  };
                  const config = typeMap[currentRecord.questionType] || { color: 'default', text: '未知' };
                  return <Tag color={config.color}>{config.text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="分值">{currentRecord.score}分</Descriptions.Item>
              <Descriptions.Item label="所属题库">{currentRecord.questionBankName}</Descriptions.Item>
              <Descriptions.Item label="关联课程">{currentRecord.relatedCourse || '无'}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="题目内容" column={1} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="题干">{currentRecord.questionContent}</Descriptions.Item>
              
              {currentRecord.questionType !== 'essay' && (
                <Descriptions.Item label="选项">
                  {currentRecord.options && currentRecord.options.map((option, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: currentRecord.correctAnswer && 
                               (Array.isArray(currentRecord.correctAnswer) 
                                 ? currentRecord.correctAnswer.includes(String.fromCharCode(65 + index))
                                 : currentRecord.correctAnswer === String.fromCharCode(65 + index)) 
                               ? '#52c41a' : '#666' 
                      }}>
                        {String.fromCharCode(65 + index)}. 
                      </span>
                      {option}
                      {currentRecord.correctAnswer && 
                       (Array.isArray(currentRecord.correctAnswer) 
                         ? currentRecord.correctAnswer.includes(String.fromCharCode(65 + index))
                         : currentRecord.correctAnswer === String.fromCharCode(65 + index)) && 
                       <Tag color="success" style={{ marginLeft: 8 }}>正确答案</Tag>}
                    </div>
                  ))}
                </Descriptions.Item>
              )}
              
              {currentRecord.questionType !== 'essay' && (
                <Descriptions.Item label="正确答案">
                  <Tag color="success">
                    {Array.isArray(currentRecord.correctAnswer) 
                      ? currentRecord.correctAnswer.join(', ') 
                      : currentRecord.correctAnswer}
                  </Tag>
                </Descriptions.Item>
              )}
              
              {currentRecord.explanation && (
                <Descriptions.Item label="答案解析">{currentRecord.explanation}</Descriptions.Item>
              )}
              
              {currentRecord.questionType === 'essay' && (
                <Descriptions.Item label="答题说明">
                  <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <p style={{ margin: 0, color: '#666' }}>
                      此为问答题，考生需要根据题目要求填写详细的文字答案。评分标准请参考答案解析。
                    </p>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Descriptions title="创建信息" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="创建人">{currentRecord.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
            </Descriptions>

            {/* 题目内容展示 */}
            <div style={{ 
              marginTop: 24, 
              padding: '20px', 
              backgroundColor: '#f9f9f9', 
              borderRadius: '6px',
              border: '1px solid #e8e8e8'
            }}>
              <h4 style={{ marginBottom: '16px', color: '#333' }}>📋 题目完整内容</h4>
              <div style={{ 
                backgroundColor: '#fff', 
                padding: '16px', 
                borderRadius: '4px',
                border: '1px solid #d9d9d9'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>
                  {currentRecord.questionContent}
                </div>
                
                {currentRecord.questionType !== 'essay' && currentRecord.options && (
                  <div style={{ marginTop: '12px' }}>
                    {currentRecord.options.map((option, index) => (
                      <div key={index} style={{ 
                        marginBottom: '8px', 
                        padding: '8px 12px',
                        backgroundColor: currentRecord.correctAnswer && 
                          (Array.isArray(currentRecord.correctAnswer) 
                            ? currentRecord.correctAnswer.includes(String.fromCharCode(65 + index))
                            : currentRecord.correctAnswer === String.fromCharCode(65 + index)) 
                          ? '#f6ffed' : '#fafafa',
                        border: '1px solid ' + (currentRecord.correctAnswer && 
                          (Array.isArray(currentRecord.correctAnswer) 
                            ? currentRecord.correctAnswer.includes(String.fromCharCode(65 + index))
                            : currentRecord.correctAnswer === String.fromCharCode(65 + index)) 
                          ? '#52c41a' : '#d9d9d9'),
                        borderRadius: '4px'
                      }}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          marginRight: '8px',
                          color: currentRecord.correctAnswer && 
                            (Array.isArray(currentRecord.correctAnswer) 
                              ? currentRecord.correctAnswer.includes(String.fromCharCode(65 + index))
                              : currentRecord.correctAnswer === String.fromCharCode(65 + index)) 
                            ? '#52c41a' : '#333'
                        }}>
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                        {currentRecord.correctAnswer && 
                         (Array.isArray(currentRecord.correctAnswer) 
                           ? currentRecord.correctAnswer.includes(String.fromCharCode(65 + index))
                           : currentRecord.correctAnswer === String.fromCharCode(65 + index)) && 
                         <Tag color="success" style={{ marginLeft: 8, fontSize: '12px' }}>✓ 正确答案</Tag>}
                      </div>
                    ))}
                  </div>
                )}
                
                {currentRecord.questionType === 'essay' && (
                  <div style={{ 
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#fff2e8',
                    border: '1px solid #ffd591',
                    borderRadius: '4px'
                  }}>
                    <p style={{ margin: 0, color: '#d48806' }}>
                      📝 此为主观题，考生需要根据题目要求填写详细的文字答案。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 演示备注信息 */}
      <Card title="演示数据说明" style={{ marginTop: '24px' }}>
        <p>为方便演示，当前安全知识考试系统使用的是模拟数据，具体说明如下：</p>
        <ul>
          <li>
            <strong>题库分类：</strong>
            <ul>
              <li>消防安全：消防设施、火灾预防、应急疏散</li>
              <li>操作规程：加油作业、设备操作、标准流程</li>
              <li>职业健康：劳动防护、健康管理、职业病防护</li>
              <li>环保法规：环境保护、污染防治、合规要求</li>
            </ul>
          </li>
          <li>
            <strong>题型支持：</strong>
            <ul>
              <li>单选题：四选一，适用于基础知识考核</li>
              <li>多选题：多项选择，考查综合理解能力</li>
              <li>判断题：正误判断，快速检验概念掌握</li>
              <li>问答题：主观表述，深度考核应用能力</li>
            </ul>
          </li>
          <li>
            <strong>系统模块：</strong>
            <ul>
              <li>课程中心：安全培训课程管理，支持附件上传</li>
              <li>题库中心：分类题目管理，批量导入功能</li>
              <li>试卷中心：固定组卷方式，关联课程体系</li>
              <li>考试中心：在线考试发布，成绩统计分析</li>
            </ul>
          </li>
          <li>
            <strong>功能特色：</strong>
            <ul>
              <li>课程与试卷强关联，建立完整知识体系</li>
              <li>试卷编号自动生成（EXM+年份+随机码）</li>
              <li>支持Word格式试卷下载，便于线下使用</li>
              <li>题目搜索筛选，答案高亮显示</li>
            </ul>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default KnowledgeExamManagement;
