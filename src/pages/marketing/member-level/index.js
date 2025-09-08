import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Button, Form, Input, Select, DatePicker, Space, Tag, Badge, Modal, Descriptions, Timeline, Row, Col, Tooltip, Progress, Statistic, Switch, InputNumber, Upload, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, BarChartOutlined, CrownOutlined, SettingOutlined, TrophyOutlined, UploadOutlined, SaveOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MemberLevel = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const [ruleSearchForm] = Form.useForm();
  const [recordSearchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [configForm] = Form.useForm();
  const [levelForm] = Form.useForm();
  const [editingLevel, setEditingLevel] = useState(null);

  // 等级规则配置数据
  const [levelRulesData, setLevelRulesData] = useState([]);
  // 等级数据统计
  const [statisticsData, setStatisticsData] = useState({});
  // 修改记录数据
  const [recordData, setRecordData] = useState([]);
  // 等级配置基础信息
  const [levelConfigInfo, setLevelConfigInfo] = useState({});

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 等级配置基础信息
    const mockLevelConfigInfo = {
      effectiveTime: '2025-01-01 00:00:00',
      effectiveEndTime: null, // null表示长期有效
      levelingCycle: {
        type: 'month', // month, quarter, year, custom
        value: 1, // 周期数值
        description: '按月定级，每个自然月为一个定级周期'
      },
      levelingType: {
        basis: 'consumption', // consumption, points, mixed
        description: '按消费金额定级',
        includeServices: ['fuel', 'carWash', 'convenience'] // 计入定级的服务类型
      },
      defaultLevel: 'LEVEL001', // 用户初始等级
      upgradeRule: {
        type: 'upgrade_downgrade', // upgrade_downgrade, upgrade_only, protected_level
        description: '根据上一周期消费情况升降级',
        protectedLevel: null // 保护等级，仅在type为protected_level时有效
      },
      status: 'active', // active, pending, inactive, expired
      lastModified: '2025-01-20 16:20:00',
      modifiedBy: '张管理员'
    };

    // 等级规则配置模拟数据
    const mockLevelRulesData = [
      {
        id: 'LEVEL001',
        levelName: '普通会员',
        levelCode: 'NORMAL',
        levelOrder: 1,
        upgradeConditions: '注册即可获得',
        consumptionThreshold: 0,
        pointsThreshold: 0,
        privileges: ['基础积分获得', '生日优惠券', '会员专属价格'],
        privilegeDetails: {
          pointsEarning: '消费1元=1积分',
          birthdayDiscount: '生日当月享受专属优惠券',
          memberPrice: '享受会员专属商品价格',
          fuelDiscount: '无折扣',
          carWashDiscount: '无折扣'
        },
        discountRate: 0,
        pointsMultiplier: 1.0,
        validityPeriod: '永久有效',
        memberCount: 12580,
        status: 'active',
        levelTemplate: '/images/level/normal.png',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-15 14:30:00'
      },
      {
        id: 'LEVEL002',
        levelName: '银牌会员',
        levelCode: 'SILVER',
        levelOrder: 2,
        upgradeConditions: '定级周期内累计加油消费满1000元',
        consumptionThreshold: 1000,
        pointsThreshold: 500,
        privileges: ['油品95折', '双倍积分日', '免费洗车2次/月', '专属客服'],
        privilegeDetails: {
          pointsEarning: '消费1元=1.2积分',
          fuelDiscount: '92#、95#汽油享95折优惠',
          carWashService: '每月免费洗车服务2次',
          doublePointsDay: '每月指定日期双倍积分',
          customerService: '专属客服热线服务'
        },
        discountRate: 0.05,
        pointsMultiplier: 1.2,
        validityPeriod: '365天',
        memberCount: 3456,
        status: 'active',
        levelTemplate: '/images/level/silver.png',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-20 16:20:00'
      },
      {
        id: 'LEVEL003',
        levelName: '金牌会员',
        levelCode: 'GOLD',
        levelOrder: 3,
        upgradeConditions: '定级周期内累计加油消费满5000元',
        consumptionThreshold: 5000,
        pointsThreshold: 2500,
        privileges: ['油品9折', '三倍积分日', '免费洗车5次/月', '生日礼品', '优先加油'],
        privilegeDetails: {
          pointsEarning: '消费1元=1.5积分',
          fuelDiscount: '全品类油品享9折优惠',
          carWashService: '每月免费精品洗车服务5次',
          triplePointsDay: '每月指定日期三倍积分',
          birthdayGift: '生日月享受专属生日礼品',
          priorityService: '享受优先加油服务'
        },
        discountRate: 0.10,
        pointsMultiplier: 1.5,
        validityPeriod: '730天',
        memberCount: 856,
        status: 'active',
        levelTemplate: '/images/level/gold.png',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-18 11:45:00'
      },
      {
        id: 'LEVEL004',
        levelName: '钻石会员',
        levelCode: 'DIAMOND',
        levelOrder: 4,
        upgradeConditions: '定级周期内累计加油消费满20000元',
        consumptionThreshold: 20000,
        pointsThreshold: 10000,
        privileges: ['油品85折', '五倍积分日', '专车接送', '年度大礼包', 'VIP专属通道'],
        privilegeDetails: {
          pointsEarning: '消费1元=2积分',
          fuelDiscount: '全品类油品享85折优惠',
          carWashService: '无限次免费精品洗车',
          fiveTimesPointsDay: '每月指定日期五倍积分',
          shuttleService: '提供专车接送服务（限本市）',
          annualGift: '年度会员大礼包',
          vipChannel: 'VIP专属服务通道'
        },
        discountRate: 0.15,
        pointsMultiplier: 2.0,
        validityPeriod: '1095天',
        memberCount: 234,
        status: 'active',
        levelTemplate: '/images/level/diamond.png',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2025-01-22 09:15:00'
      },
      {
        id: 'LEVEL005',
        levelName: '至尊会员',
        levelCode: 'SUPREME',
        levelOrder: 5,
        upgradeConditions: '定级周期内累计加油消费满50000元',
        consumptionThreshold: 50000,
        pointsThreshold: 25000,
        privileges: ['油品8折', '十倍积分日', '专属管家', '定制服务', '年度豪华旅游'],
        privilegeDetails: {
          pointsEarning: '消费1元=3积分',
          fuelDiscount: '全品类油品享8折优惠',
          carWashService: '无限次豪华洗车+美容服务',
          tenTimesPointsDay: '每月指定日期十倍积分',
          personalManager: '专属客户经理一对一服务',
          customService: '个性化定制服务方案',
          luxuryTravel: '年度豪华旅游套餐（全家）'
        },
        discountRate: 0.20,
        pointsMultiplier: 3.0,
        validityPeriod: '永久有效',
        memberCount: 67,
        status: 'inactive',
        levelTemplate: '/images/level/supreme.png',
        createTime: '2024-12-01 10:00:00',
        updateTime: '2024-12-25 15:30:00'
      }
    ];

    // 扩展修改记录数据，增加更多配置相关记录
    const mockRecordData = [
      {
        id: 'LOG001',
        targetId: 'CONFIG_BASE',
        targetName: '等级配置基础设置',
        changeType: 'update',
        changeField: '定级周期',
        changeDescription: '调整定级周期从季度改为月度',
        operator: '系统管理员',
        operatorId: 'SYSADMIN001',
        changeTime: '2025-01-25 10:30:00',
        approver: '总经理',
        status: 'approved'
      },
      {
        id: 'LOG002',
        targetId: 'LEVEL002',
        targetName: '银牌会员等级规则',
        changeType: 'update',
        changeField: '升级条件',
        changeDescription: '调整消费门槛从800元提升到1000元',
        operator: '张管理员',
        operatorId: 'ADMIN001',
        changeTime: '2025-01-20 16:20:00',
        approver: '李主管',
        status: 'approved'
      },
      {
        id: 'LOG003',
        targetId: 'LEVEL004',
        targetName: '钻石会员等级规则',
        changeType: 'update',
        changeField: '会员权益',
        changeDescription: '新增VIP专属通道服务权益',
        operator: '王管理员',
        operatorId: 'ADMIN002',
        changeTime: '2025-01-22 09:15:00',
        approver: '赵主管',
        status: 'approved'
      },
      {
        id: 'LOG004',
        targetId: 'LEVEL005',
        targetName: '至尊会员等级规则',
        changeType: 'update',
        changeField: '状态',
        changeDescription: '暂停至尊会员等级，停止新用户升级',
        operator: '李管理员',
        operatorId: 'ADMIN003',
        changeTime: '2024-12-25 15:30:00',
        approver: '张主管',
        status: 'approved'
      },
      {
        id: 'LOG005',
        targetId: 'LEVEL003',
        targetName: '金牌会员等级规则',
        changeType: 'update',
        changeField: '积分倍数',
        changeDescription: '调整积分倍数从1.3倍提升到1.5倍',
        operator: '赵管理员',
        operatorId: 'ADMIN004',
        changeTime: '2025-01-18 11:45:00',
        approver: '王主管',
        status: 'approved'
      },
      {
        id: 'LOG006',
        targetId: 'LEVEL001',
        targetName: '普通会员等级规则',
        changeType: 'update',
        changeField: '会员权益',
        changeDescription: '新增会员专属价格权益',
        operator: '陈管理员',
        operatorId: 'ADMIN005',
        changeTime: '2025-01-15 14:30:00',
        approver: '李主管',
        status: 'approved'
      },
      {
        id: 'LOG007',
        targetId: 'CONFIG_RULE',
        targetName: '等级规则系统配置',
        changeType: 'update',
        changeField: '升降级规则',
        changeDescription: '启用等级保护机制，设置最低等级保护',
        operator: '系统管理员',
        operatorId: 'SYSADMIN002',
        changeTime: '2025-01-10 14:20:00',
        approver: '总经理',
        status: 'approved'
      },
      {
        id: 'LOG008',
        targetId: 'CONFIG_TYPE',
        targetName: '等级配置定级类型',
        changeType: 'update',
        changeField: '定级类型',
        changeDescription: '更新定级类型，增加便民店消费计入定级',
        operator: '业务管理员',
        operatorId: 'BIZADMIN001',
        changeTime: '2025-01-08 16:45:00',
        approver: '业务经理',
        status: 'approved'
      }
    ];

    // 等级数据统计
    const mockStatisticsData = {
      totalMembers: mockLevelRulesData.reduce((sum, level) => sum + level.memberCount, 0),
      activeLevels: mockLevelRulesData.filter(level => level.status === 'active').length,
      levelDistribution: mockLevelRulesData.map(level => ({
        levelName: level.levelName,
        memberCount: level.memberCount,
        percentage: (level.memberCount / mockLevelRulesData.reduce((sum, l) => sum + l.memberCount, 0) * 100).toFixed(1)
      })),
      monthlyUpgrades: [
        { month: '2024-12', upgrades: 156, downgrades: 23 },
        { month: '2025-01', upgrades: 189, downgrades: 18 }
      ],
      avgConsumption: {
        normal: 156.8,
        silver: 890.5,
        gold: 2456.7,
        diamond: 8934.2,
        supreme: 15678.9
      }
    };


    setLevelConfigInfo(mockLevelConfigInfo);
    setLevelRulesData(mockLevelRulesData);
    setStatisticsData(mockStatisticsData);
    setRecordData(mockRecordData);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleRuleSearch = (values) => {
    console.log('规则搜索条件:', values);
  };

  const handleRecordSearch = (values) => {
    console.log('记录搜索条件:', values);
  };

  const showConfigModal = () => {
    const values = {
      effectiveTime: levelConfigInfo.effectiveTime ? moment(levelConfigInfo.effectiveTime) : undefined,
      effectiveEndTime: levelConfigInfo.effectiveEndTime ? moment(levelConfigInfo.effectiveEndTime) : undefined,
      levelingCycleType: levelConfigInfo.levelingCycle?.type || 'month',
      levelingCycleValue: levelConfigInfo.levelingCycle?.value || 1,
      levelingBasis: levelConfigInfo.levelingType?.basis || 'consumption',
      defaultLevel: levelConfigInfo.defaultLevel,
      upgradeRuleType: levelConfigInfo.upgradeRule?.type || 'upgrade_downgrade'
    };
    configForm.setFieldsValue(values);
    setConfigModalVisible(true);
  };

  const handleConfigSubmit = async (values) => {
    try {
      const configData = {
        effectiveTime: values.effectiveTime?.format('YYYY-MM-DD HH:mm:ss'),
        effectiveEndTime: values.effectiveEndTime?.format('YYYY-MM-DD HH:mm:ss'),
        levelingCycle: {
          type: values.levelingCycleType,
          value: values.levelingCycleValue,
          description: getLevelingCycleDescription(values.levelingCycleType, values.levelingCycleValue)
        },
        levelingType: {
          basis: values.levelingBasis,
          description: getLevelingBasisDescription(values.levelingBasis)
        },
        defaultLevel: values.defaultLevel,
        upgradeRule: {
          type: values.upgradeRuleType,
          description: getUpgradeRuleDescription(values.upgradeRuleType)
        },
        lastModified: moment().format('YYYY-MM-DD HH:mm:ss'),
        modifiedBy: '当前用户'
      };
      
      console.log('保存配置:', configData);
      message.success('配置保存成功');
      
      setConfigModalVisible(false);
      loadMockData();
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };
  
  const getLevelingCycleDescription = (type, value) => {
    const typeMap = {
      month: `按${value}个月定级`,
      quarter: `按${value}个季度定级`,
      year: `按${value}年定级`,
      custom: `自定义${value}天周期定级`
    };
    return typeMap[type] || '按月定级';
  };
  
  const getLevelingBasisDescription = (basis) => {
    const basisMap = {
      consumption: '按加油消费金额定级',
      volume: '按加油升数定级',
      mixed: '消费金额和升数混合定级'
    };
    return basisMap[basis] || '按消费金额定级';
  };
  
  const getUpgradeRuleDescription = (type) => {
    const typeMap = {
      upgrade_downgrade: '根据上一周期消费情况升降级',
      upgrade_only: '只升不降级',
      protected_level: '最低会员等级保护'
    };
    return typeMap[type] || '根据消费情况升降级';
  };
  
  const handleStatusToggle = async (action) => {
    try {
      let newStatus;
      let actionText;
      
      switch (action) {
        case 'activate':
          newStatus = 1;
          actionText = '启用';
          break;
        case 'deactivate':
          newStatus = 2;
          actionText = '停用';
          break;
        case 'submit':
          newStatus = 0;
          actionText = '提交';
          break;
        default:
          return;
      }
      
      console.log(`${actionText}等级规则`, { newStatus });
      message.success(`等级规则${actionText}成功`);
      
      setLevelConfigInfo(prev => ({
        ...prev,
        status: newStatus,
        lastModified: moment().format('YYYY-MM-DD HH:mm:ss')
      }));
    } catch (error) {
      message.error(`操作失败，请重试`);
    }
  };

  const showLevelModal = (record = null) => {
    setEditingLevel(record);
    if (record) {
      const values = {
        ...record,
        privileges: record.privileges ? record.privileges.join(',') : ''
      };
      levelForm.setFieldsValue(values);
    } else {
      levelForm.resetFields();
      // 设置新等级的默认排序
      const nextOrder = Math.max(...levelRulesData.map(level => level.levelOrder)) + 1;
      levelForm.setFieldsValue({
        levelOrder: nextOrder,
        status: 'active',
        pointsMultiplier: 1.0,
        discountRate: 0,
        consumptionThreshold: 0,
        pointsThreshold: 0
      });
    }
    setLevelModalVisible(true);
  };

  const handleLevelSubmit = async (values) => {
    try {
      const levelData = {
        ...values,
        privileges: values.privileges ? values.privileges.split(',').map(p => p.trim()) : [],
        id: editingLevel ? editingLevel.id : `LEVEL${String(values.levelOrder).padStart(3, '0')}`,
        createTime: editingLevel ? editingLevel.createTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        memberCount: editingLevel ? editingLevel.memberCount : 0
      };
      
      console.log('保存等级:', levelData);
      message.success(editingLevel ? '等级修改成功' : '等级创建成功');
      
      setLevelModalVisible(false);
      setEditingLevel(null);
      loadMockData();
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  const showDetailModal = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentRecord(null);
  };

  // 等级规则配置列定义
  const levelRulesColumns = [
    {
      title: '等级排序',
      dataIndex: 'levelOrder',
      key: 'levelOrder',
      width: 80,
      sorter: (a, b) => a.levelOrder - b.levelOrder,
      render: (order) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
          {order}
        </div>
      ),
    },
    {
      title: '等级名称',
      dataIndex: 'levelName',
      key: 'levelName',
      width: 120,
      render: (name, record) => {
        const levelColors = {
          1: '#8c8c8c',
          2: '#c0c0c0', 
          3: '#ffd700',
          4: '#4169e1',
          5: '#800080'
        };
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CrownOutlined style={{ color: levelColors[record.levelOrder], marginRight: '8px' }} />
            <strong style={{ color: levelColors[record.levelOrder] }}>{name}</strong>
          </div>
        );
      },
    },
    {
      title: '等级编码',
      dataIndex: 'levelCode',
      key: 'levelCode',
      width: 100,
      render: (code) => <Tag color="geekblue">{code}</Tag>,
    },
    {
      title: '升级条件',
      dataIndex: 'upgradeConditions',
      key: 'upgradeConditions',
      width: 180,
    },
    {
      title: '消费门槛',
      dataIndex: 'consumptionThreshold',
      key: 'consumptionThreshold',
      width: 100,
      render: (threshold) => threshold > 0 ? `¥${threshold.toLocaleString()}` : '无要求',
    },
    {
      title: '积分门槛',
      dataIndex: 'pointsThreshold',
      key: 'pointsThreshold',
      width: 100,
      render: (threshold) => threshold > 0 ? `${threshold.toLocaleString()}分` : '无要求',
    },
    {
      title: '折扣优惠',
      dataIndex: 'discountRate',
      key: 'discountRate',
      width: 100,
      render: (rate) => rate > 0 ? `${(rate * 100).toFixed(0)}%优惠` : '无折扣',
    },
    {
      title: '积分倍数',
      dataIndex: 'pointsMultiplier',
      key: 'pointsMultiplier',
      width: 100,
      render: (multiplier) => `${multiplier}x`,
    },
    {
      title: '会员权益',
      dataIndex: 'privileges',
      key: 'privileges',
      width: 250,
      render: (privileges) => (
        <div>
          {privileges.slice(0, 3).map((privilege, index) => (
            <Tag key={index} color="cyan" style={{ marginBottom: '4px' }}>
              {privilege}
            </Tag>
          ))}
          {privileges.length > 3 && (
            <Tag color="default">+{privileges.length - 3}项</Tag>
          )}
        </div>
      ),
    },
    {
      title: '会员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
      render: (count) => (
        <strong style={{ color: '#1890ff' }}>{count.toLocaleString()}</strong>
      ),
    },
    {
      title: '有效期',
      dataIndex: 'validityPeriod',
      key: 'validityPeriod',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          active: { color: 'success', text: '启用中' },
          inactive: { color: 'default', text: '已停用' }
        };
        const config = statusConfig[status];
        return <Badge status={config.color} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => showDetailModal(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => showLevelModal(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 修改记录列定义
  const recordColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160,
      sorter: true,
      render: (time) => <strong>{time}</strong>,
    },
    {
      title: '等级信息',
      dataIndex: 'targetInfo',
      key: 'targetInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.targetName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>ID: {record.targetId}</div>
        </div>
      ),
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => {
        const typeConfig = {
          create: { color: 'success', icon: <PlusOutlined />, text: '新建' },
          update: { color: 'warning', icon: <EditOutlined />, text: '修改' },
          delete: { color: 'error', icon: <DeleteOutlined />, text: '删除' }
        };
        const config = typeConfig[type] || typeConfig.update;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
      key: 'changeField',
      width: 120,
      render: (field) => <Tag color="blue">{field}</Tag>,
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 200,
      render: (description) => (
        <Tooltip title={description}>
          <div style={{ 
            maxWidth: '180px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorInfo',
      key: 'operatorInfo',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.operator}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>ID: {record.operatorId}</div>
        </div>
      ),
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          approved: { status: 'success', text: '已通过' },
          pending: { status: 'warning', text: '待审批' },
          rejected: { status: 'error', text: '已拒绝' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge status={config.status} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => showDetailModal(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  // 渲染等级基础配置弹窗
  const renderConfigModal = () => (
    <Modal
      title={<><SettingOutlined /> 定级基础配置</>}
      open={configModalVisible}
      width={1000}
      footer={[
        <Button key="cancel" onClick={() => setConfigModalVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => configForm.submit()}>
          保存配置
        </Button>
      ]}
      onCancel={() => setConfigModalVisible(false)}
    >
      <Form
        form={configForm}
        layout="vertical"
        onFinish={handleConfigSubmit}
      >
        {/* 等级基础配置表单 */}
        <Card title="时间设置" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="effectiveTime"
                label="规则生效时间"
                rules={[{ required: true, message: '请选择生效时间' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  placeholder="请选择生效时间"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="effectiveEndTime"
                label="规则结束时间"
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  placeholder="不设置则长期有效"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        
        <Card title="定级规则" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="levelingCycleType"
                label="定级周期类型"
                rules={[{ required: true, message: '请选择定级周期' }]}
              >
                <Select placeholder="请选择定级周期">
                  <Select.Option value="month">自然月</Select.Option>
                  <Select.Option value="quarter">自然季度</Select.Option>
                  <Select.Option value="year">自然年</Select.Option>
                  <Select.Option value="custom">自定义天数</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="levelingCycleValue"
                label="周期数值"
                rules={[{ required: true, message: '请输入周期数值' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入数值" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="levelingBasis"
                label="定级依据"
                rules={[{ required: true, message: '请选择定级依据' }]}
              >
                <Select placeholder="请选择定级依据">
                  <Select.Option value="consumption">加油消费金额</Select.Option>
                  <Select.Option value="volume">加油升数</Select.Option>
                  <Select.Option value="mixed">消费+升数混合</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        
        <Card title="等级设置">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultLevel"
                label="用户初始等级"
                rules={[{ required: true, message: '请选择初始等级' }]}
              >
                <Select placeholder="请选择初始等级">
                  {levelRulesData.filter(level => level.status === 'active').map(level => (
                    <Select.Option key={level.id} value={level.id}>
                      Lv{level.levelOrder} {level.levelName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="upgradeRuleType"
                label="升降级规则"
                rules={[{ required: true, message: '请选择升降级规则' }]}
              >
                <Select placeholder="请选择升降级规则">
                  <Select.Option value="upgrade_downgrade">根据消费情况升降级</Select.Option>
                  <Select.Option value="upgrade_only">只升不降级</Select.Option>
                  <Select.Option value="protected_level">最低等级保护</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        
        <Card title="配置说明" size="small" style={{ backgroundColor: '#f8f9fa' }}>
          <div style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
            <div><strong>定级周期说明：</strong></div>
            <div>• 自然月：每个自然月为一个定级周期，例如：2025-01-01 至 2025-01-31</div>
            <div>• 自然季度：每个自然季度为一个定级周期</div>
            <div>• 自定义天数：按指定天数循环计算定级周期</div>
            <div style={{ marginTop: 12 }}><strong>升降级规则说明：</strong></div>
            <div>• 根据消费情况升降级：每个定级周期结束后，根据用户在该周期的消费金额重新计算等级</div>
            <div>• 只升不降级：在保留用户当前等级的基础上，根据本周期消费情况进行升级</div>
            <div>• 最低等级保护：设置一个最低保护等级，该等级及以上等级的会员不会降级</div>
          </div>
        </Card>
      </Form>
    </Modal>
  );
  
  // 渲染等级编辑弹窗
  const renderLevelModal = () => (
    <Modal
      title={
        editingLevel ? (
          <><EditOutlined /> 编辑等级 - {editingLevel.levelName}</>
        ) : (
          <><PlusOutlined /> 新建等级</>
        )
      }
      open={levelModalVisible}
      width={800}
      footer={[
        <Button key="cancel" onClick={() => setLevelModalVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => levelForm.submit()}>
          {editingLevel ? '保存修改' : '创建等级'}
        </Button>
      ]}
      onCancel={() => setLevelModalVisible(false)}
    >
      <Form
        form={levelForm}
        layout="vertical"
        onFinish={handleLevelSubmit}
      >
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="levelName"
                label="等级名称"
                rules={[{ required: true, message: '请输入等级名称' }]}
              >
                <Input placeholder="如：银牌会员" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="levelCode"
                label="等级编码"
                rules={[{ required: true, message: '请输入等级编码' }]}
              >
                <Input placeholder="如：SILVER" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="levelOrder"
                label="等级排序"
                rules={[{ required: true, message: '请输入等级排序' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="数字越小等级越高" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        
        <Card title="升级条件" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="consumptionThreshold"
                label="消费门槛（元）"
                rules={[{ required: true, message: '请输入消费门槛' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="升级所需最低消费" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pointsThreshold"
                label="积分门槛"
                rules={[{ required: true, message: '请输入积分门槛' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="升级所需积分" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="validityPeriod"
                label="等级有效期"
                rules={[{ required: true, message: '请输入有效期' }]}
              >
                <Input placeholder="如：365天、永久有效" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="upgradeConditions"
            label="升级条件描述"
            rules={[{ required: true, message: '请输入升级条件描述' }]}
          >
            <Input.TextArea rows={2} placeholder="如：定级周期内累计加油消费满1000元" />
          </Form.Item>
        </Card>
        
        <Card title="会员权益" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="discountRate"
                label="折扣率（%）"
              >
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} placeholder="如：5 表示95折" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pointsMultiplier"
                label="积分倍数"
                rules={[{ required: true, message: '请输入积分倍数' }]}
              >
                <InputNumber min={1} step={0.1} style={{ width: '100%' }} placeholder="如：1.2" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="等级状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Select.Option value="active">启用中</Select.Option>
                  <Select.Option value="inactive">已停用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="privileges"
            label="权益列表（逗号分隔）"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="如：油品95折,双倍积分日,免费洗车2次/月,专属客服"
            />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );


  // 获取状态显示文本和颜色
  const getStatusConfig = (status) => {
    const statusMap = {
      '-1': { text: '待设置', color: 'default', bgColor: '#f5f5f5' },
      '0': { text: '待生效', color: 'warning', bgColor: '#fff7e6' },
      '1': { text: '生效中', color: 'success', bgColor: '#f6ffed' },
      '2': { text: '已停用', color: 'error', bgColor: '#fff2f0' },
      '3': { text: '已过期', color: 'default', bgColor: '#f5f5f5' }
    };
    return statusMap[status] || statusMap['-1'];
  };

  // 获取提示信息
  const getStatusPrompt = () => {
    const status = levelConfigInfo.status;
    switch (status) {
      case -1:
        return '按照以下模板，结合实际情况配置集团定级规则';
      case 1:
        return `集团定级规则生效中，修改规则后，新规则将会在下一周期${levelConfigInfo.nextCycleTime}生效`;
      case 0:
        return `集团定级规则将会在${levelConfigInfo.effectiveTime}生效`;
      case 3:
        return '集团定级规则已过期，可编辑后重新启用';
      case 2:
        return '集团定级规则已停用，可编辑后重新启用';
      default:
        return '';
    }
  };

  // 渲染等级规则配置tab
  const renderLevelRulesConfig = () => {
    const statusConfig = getStatusConfig(levelConfigInfo.status);
    
    return (
      <div>
        {/* 定级规则状态头部 */}
        <div 
          style={{ 
            marginBottom: 16, 
            background: statusConfig.bgColor,
            borderLeft: '4px solid #32AF50',
            padding: '16px',
            borderRadius: '4px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: 0, color: '#32AF50', marginBottom: '8px' }}>定级规则</h3>
              {levelConfigInfo.isSupportOperation ? (
                <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                  {getStatusPrompt()}
                  {levelConfigInfo.status === 1 && (
                    <div style={{ 
                      background: '#fff', 
                      padding: '12px', 
                      marginTop: '8px', 
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9',
                      fontSize: '13px'
                    }}>
                      <div>1.仅修改说明文案（等级模板、等级名字、升降级描述、特权描述）将直接生效</div>
                      <div>2.除上述内容只要修改其中一项（定级周期、定级类型、用户初始等级、用户等级保护、所需积分），修改后将会在下一周期生效</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: '#666', fontSize: '14px' }}>
                  如需创建或者修改会员等级规则，请<span style={{ color: '#32AF50' }}>登录集团账号</span>。
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <Tag color={statusConfig.color} style={{ marginBottom: '8px' }}>
                {statusConfig.text}
              </Tag>
              <div style={{ fontSize: '12px', color: '#999' }}>
                当前时间：{levelConfigInfo.currentTime}
              </div>
            </div>
          </div>
        </div>

        {/* 基础配置区域 */}
        <div style={{ marginBottom: 20 }}>
          <Card>
            {/* 规则生效时间 */}
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <Row align="middle">
                <Col span={4}>
                  <span style={{ fontWeight: '500' }}>规则生效时间</span>
                </Col>
                <Col span={16}>
                  <Input 
                    value={levelConfigInfo.effectiveTime || ''} 
                    disabled={levelConfigInfo.status === 1 || (levelConfigInfo.levelCount > 1 && levelConfigInfo.status === 0)}
                    placeholder="请选择生效时间"
                    style={{ width: 300 }}
                  />
                </Col>
                <Col span={4}>
                  <div style={{ fontSize: '12px', color: '#999' }}>请选择</div>
                </Col>
              </Row>
            </div>

            {/* 定级周期 */}
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <Row align="middle">
                <Col span={4}>
                  <span style={{ fontWeight: '500' }}>定级周期</span>
                </Col>
                <Col span={16}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Select 
                      value={levelConfigInfo.levelingCycle?.type || 'month'} 
                      disabled={!levelConfigInfo.isSupportOperation}
                      style={{ width: 200 }}
                    >
                      <Select.Option value="month">按月定级</Select.Option>
                      <Select.Option value="quarter">按季度定级</Select.Option>
                      <Select.Option value="year">按年定级</Select.Option>
                    </Select>
                    <InputNumber 
                      value={levelConfigInfo.levelingCycle?.value || 1}
                      min={1}
                      disabled={!levelConfigInfo.isSupportOperation}
                      style={{ width: 80 }}
                    />
                    <span>个周期</span>
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ fontSize: '12px', color: '#999' }}>请选择</div>
                </Col>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Col offset={4} span={16}>
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '8px 12px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    规则生效时间内，按照用户在定级周期内的消费来升降级或保级<br/>
                    例1：定级周期1月=1个自然月<br/>
                    定级规则在5月20日生效，定级周期为5.20-5.31、6.1-6.30等
                  </div>
                </Col>
              </Row>
            </div>

            {/* 定级类型 */}
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <Row align="middle">
                <Col span={4}>
                  <span style={{ fontWeight: '500' }}>定级类型</span>
                </Col>
                <Col span={16}>
                  <Select 
                    value={levelConfigInfo.levelingType?.basis || 'consumption'} 
                    disabled={!levelConfigInfo.isSupportOperation}
                    style={{ width: 300 }}
                  >
                    <Select.Option value="consumption">按消费金额定级</Select.Option>
                    <Select.Option value="volume">按加油升数定级</Select.Option>
                    <Select.Option value="mixed">混合定级</Select.Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <div style={{ fontSize: '12px', color: '#999' }}>请选择</div>
                </Col>
              </Row>
            </div>

            {/* 用户初始等级 */}
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <Row align="middle">
                <Col span={4}>
                  <span style={{ fontWeight: '500' }}>用户初始等级</span>
                </Col>
                <Col span={16}>
                  <Select 
                    value={levelConfigInfo.defaultLevel} 
                    disabled={!levelConfigInfo.isSupportOperation}
                    style={{ width: 300 }}
                  >
                    {levelRulesData.filter(level => level.status === 'active').map(level => (
                      <Select.Option key={level.id} value={level.id}>
                        Lv{level.levelOrder}{level.levelName}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={4}>
                  <div style={{ fontSize: '12px', color: '#999' }}>请选择</div>
                </Col>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Col offset={4} span={16}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    用户初始等级为用户注册会员后获得的初始化等级
                  </div>
                </Col>
              </Row>
            </div>

            {/* 升降级规则 */}
            <div style={{ paddingBottom: '16px' }}>
              <Row align="middle">
                <Col span={4}>
                  <span style={{ fontWeight: '500' }}>升降级规则</span>
                </Col>
                <Col span={12}>
                  <Select 
                    value={levelConfigInfo.upgradeRule?.type || 'upgrade_downgrade'} 
                    disabled={!levelConfigInfo.isSupportOperation}
                    style={{ width: 300 }}
                  >
                    <Select.Option value="upgrade_downgrade">根据上一周期消费情况升降级</Select.Option>
                    <Select.Option value="upgrade_only">只升不降级</Select.Option>
                    <Select.Option value="protected_level">最低会员等级保护</Select.Option>
                  </Select>
                </Col>
                {levelConfigInfo.upgradeRule?.type === 'protected_level' && (
                  <Col span={4}>
                    <Select 
                      placeholder="选择保护等级" 
                      style={{ width: 150 }}
                      disabled={!levelConfigInfo.isSupportOperation}
                    >
                      {levelRulesData.filter(level => level.status === 'active').map(level => (
                        <Select.Option key={level.id} value={level.id}>
                          Lv{level.levelOrder}{level.levelName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                )}
                <Col span={4}>
                  <div style={{ fontSize: '12px', color: '#999' }}>请选择</div>
                </Col>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Col offset={4} span={18}>
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '8px 12px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    <div><strong>根据上一周期消费情况升降级</strong></div>
                    <div>每个周期初始，油站用户默认按照上一周期的消费情况根据定级规则获得对应的会员等级</div>
                    <div>例：一个金卡用户本周期未消费，下一周期定级为最低等级会员</div>
                    <br/>
                    <div><strong>只升不降级</strong></div>
                    <div>每个周期初始，在保留用户当前等级的基础上以本周期消费情况进行升级</div>
                    <div>例：一个金卡用户本周期未消费，下一周期定级为金卡会员，非最低等级会员</div>
                    <br/>
                    <div><strong>最低会员等级保护</strong></div>
                    <div>在"根据上一周期消费情况升降级"的基础上，通过设置会员最低等级，此等级及以上等级的会员无论如何消费都不会掉至此等级以下</div>
                    <div>例：设置最低等级Lv2金卡会员，一个白金用户本周期未消费，下一周期定级为金卡会员，非最低等级会员</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </div>

        {/* 等级详细配置表格 */}
        <Card>
          <Table
            columns={[
              {
                title: '等级',
                dataIndex: 'levelOrder',
                key: 'levelOrder',
                width: 80,
                align: 'center',
                render: (order, record) => (
                  <div>
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                      <strong>Lv{order}</strong>
                    </div>
                    {levelConfigInfo.isSupportOperation && (
                      <div style={{ textAlign: 'center' }}>
                        <Button 
                          type="link" 
                          size="small" 
                          danger
                          disabled={record.memberCount > 0}
                        >
                          删除
                        </Button>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                title: '等级模板',
                dataIndex: 'levelTemplate',
                key: 'levelTemplate',
                width: 100,
                align: 'center',
                render: (template, record) => (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <img 
                      src={template || '/images/level/default.png'} 
                      alt={record.levelName}
                      style={{ width: '40px', height: '40px' }}
                    />
                    {levelConfigInfo.isSupportOperation && (
                      <div style={{ marginTop: '8px' }}>
                        <Upload showUploadList={false}>
                          <Button size="small" type="link">上传</Button>
                        </Upload>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                title: '等级名字',
                dataIndex: 'levelName',
                key: 'levelName',
                width: 120,
                render: (name, record) => (
                  <div style={{ padding: '20px 0' }}>
                    {levelConfigInfo.isSupportOperation ? (
                      <Input.TextArea 
                        value={name} 
                        autoSize={{ minRows: 1, maxRows: 3 }}
                        maxLength={7}
                        style={{ border: 'none', padding: 0, resize: 'none' }}
                      />
                    ) : (
                      <div>{name}</div>
                    )}
                  </div>
                ),
              },
              {
                title: levelConfigInfo.levelingType?.basis === 'consumption' ? '消费金额(元)' : '加油升数',
                dataIndex: 'consumptionThreshold',
                key: 'consumptionThreshold',
                width: 150,
                render: (threshold, record, index) => (
                  <div style={{ padding: '20px 0' }}>
                    {index === 0 ? (
                      <div>注册即可</div>
                    ) : (
                      levelConfigInfo.isSupportOperation ? (
                        <InputNumber
                          value={threshold}
                          min={0}
                          style={{ width: '100%' }}
                          placeholder="请输入门槛值"
                        />
                      ) : (
                        <div>{threshold.toLocaleString()}</div>
                      )
                    )}
                  </div>
                ),
              },
              {
                title: '升级描述',
                dataIndex: 'upgradeConditions',
                key: 'upgradeConditions',
                width: 200,
                render: (desc) => (
                  <div style={{ padding: '20px 0' }}>
                    {levelConfigInfo.isSupportOperation ? (
                      <Input.TextArea 
                        value={desc} 
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        maxLength={1024}
                        style={{ border: 'none', padding: 0, resize: 'none' }}
                      />
                    ) : (
                      <div>{desc}</div>
                    )}
                  </div>
                ),
              },
              {
                title: '降级描述',
                dataIndex: 'levelDownDesc',
                key: 'levelDownDesc', 
                width: 200,
                render: (desc, record) => (
                  <div style={{ padding: '20px 0' }}>
                    {levelConfigInfo.isSupportOperation ? (
                      <Input.TextArea 
                        value={desc || '未达到升级要求将降级至低等级'} 
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        maxLength={1024}
                        style={{ border: 'none', padding: 0, resize: 'none' }}
                      />
                    ) : (
                      <div>{desc || '未达到升级要求将降级至低等级'}</div>
                    )}
                  </div>
                ),
              },
              {
                title: '特权描述',
                dataIndex: 'privileges',
                key: 'privileges',
                width: 250,
                render: (privileges, record) => (
                  <div style={{ padding: '20px 0' }}>
                    {levelConfigInfo.isSupportOperation ? (
                      <div 
                        contentEditable
                        style={{ 
                          minHeight: '60px', 
                          border: '1px solid #d9d9d9',
                          padding: '8px',
                          borderRadius: '4px'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: Array.isArray(privileges) ? 
                            `<ol>${privileges.map(p => `<li>${p}</li>`).join('')}</ol>` : 
                            privileges || '<ol><li>待设置</li></ol>'
                        }}
                      />
                    ) : (
                      <div>
                        {Array.isArray(privileges) ? (
                          <ol>
                            {privileges.map((privilege, index) => (
                              <li key={index}>{privilege}</li>
                            ))}
                          </ol>
                        ) : (
                          privileges || '待设置'
                        )}
                      </div>
                    )}
                  </div>
                ),
              }
            ]}
            dataSource={levelRulesData}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
          />
          
          {/* 添加等级按钮 */}
          {levelConfigInfo.isSupportOperation && (
            <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #f0f0f0', marginTop: '16px' }}>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => showLevelModal()}
                disabled={levelConfigInfo.status === 1}
              >
                添加等级
              </Button>
            </div>
          )}
        </Card>

        {/* 底部操作按钮 */}
        {levelConfigInfo.isSupportOperation && (
          <div style={{ textAlign: 'center', marginTop: '24px', padding: '20px 0' }}>
            <Space size="large">
              {levelConfigInfo.status === -1 && (
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => handleStatusToggle('submit')}
                >
                  提交配置
                </Button>
              )}
              
              {levelConfigInfo.status === 0 && (
                <>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => handleStatusToggle('submit')}
                  >
                    保存修改
                  </Button>
                  {levelConfigInfo.levelCount === 1 && (
                    <Button 
                      size="large"
                      onClick={() => handleStatusToggle('activate')}
                    >
                      立即启用
                    </Button>
                  )}
                </>
              )}
              
              {levelConfigInfo.status === 1 && (
                <>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => handleStatusToggle('submit')}
                  >
                    保存修改
                  </Button>
                  {levelConfigInfo.levelCount === 1 && (
                    <Button 
                      size="large" 
                      danger
                      onClick={() => handleStatusToggle('deactivate')}
                    >
                      立即停用
                    </Button>
                  )}
                </>
              )}
              
              {levelConfigInfo.status === 3 && (
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => handleStatusToggle('submit')}
                >
                  提交配置
                </Button>
              )}
            </Space>
          </div>
        )}
      </div>
    );
  };

  // 渲染等级数据统计tab
  const renderLevelStatistics = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="会员总数" 
              value={statisticsData.totalMembers} 
              valueStyle={{ color: '#3f8600' }}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="启用等级数" 
              value={statisticsData.activeLevels} 
              valueStyle={{ color: '#1890ff' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月升级" 
              value={189} 
              valueStyle={{ color: '#cf1322' }}
              suffix="人次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月降级" 
              value={18} 
              valueStyle={{ color: '#8c8c8c' }}
              suffix="人次"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="等级分布统计" style={{ height: '400px' }}>
            {statisticsData.levelDistribution && statisticsData.levelDistribution.map((item, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{item.levelName}</span>
                  <span>{item.memberCount}人 ({item.percentage}%)</span>
                </div>
                <Progress 
                  percent={parseFloat(item.percentage)} 
                  strokeColor={['#8c8c8c', '#c0c0c0', '#ffd700', '#4169e1', '#800080'][index]}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="平均消费水平" style={{ height: '400px' }}>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <BarChartOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
              <div style={{ fontSize: '16px', color: '#666' }}>等级消费统计图表待开发</div>
              <div style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
                此处将展示各等级会员的平均消费水平分析
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染修改记录tab
  const renderModificationRecords = () => (
    <div>
      {/* 修改记录筛选区域 */}
      <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
        <Form form={recordSearchForm} onFinish={handleRecordSearch}>
          {/* 第一行：筛选条件 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={5}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="搜索等级名称、ID、操作人等" style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="changeType" label="变更类型">
                <Select placeholder="请选择变更类型" style={{ width: '100%' }} allowClear>
                  <Option value="create">新建</Option>
                  <Option value="update">修改</Option>
                  <Option value="delete">删除</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="changeField" label="变更字段">
                <Select placeholder="请选择变更字段" style={{ width: '100%' }} allowClear>
                  <Option value="basic">基本信息</Option>
                  <Option value="conditions">升级条件</Option>
                  <Option value="privileges">会员权益</Option>
                  <Option value="status">状态</Option>
                  <Option value="config">系统配置</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                  <Option value="approved">已通过</Option>
                  <Option value="pending">待审批</Option>
                  <Option value="rejected">已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => recordSearchForm.resetFields()}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
          
          {/* 第二行：时间筛选 */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="timeRange" label="时间范围">
                <RangePicker 
                  style={{ width: '100%' }} 
                  showTime
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Space>
                <Button icon={<HistoryOutlined />}>
                  导出记录
                </Button>
                <Button type="link" icon={<HistoryOutlined />}>
                  清空记录
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 修改记录列表 */}
      <Table
        columns={recordColumns}
        dataSource={recordData}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          total: recordData.length,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
      />
    </div>
  );

  // 渲染详情弹窗
  const renderDetailModal = () => (
    <Modal
      title={<><HistoryOutlined /> 变更详情</>}
      open={detailModalVisible}
      width={800}
      footer={[
        <Button key="close" onClick={closeDetailModal}>
          关闭
        </Button>
      ]}
      onCancel={closeDetailModal}
    >
      {currentRecord && (
        <>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="记录ID">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="等级名称">{currentRecord.targetName}</Descriptions.Item>
              <Descriptions.Item label="变更类型">
                <Tag color="warning">
                  <EditOutlined /> 修改
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作人">{currentRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="变更时间">{currentRecord.changeTime}</Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Badge status="success" text="已通过" />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="变更详情" style={{ height: '300px' }}>
                <div style={{ textAlign: 'center', paddingTop: '80px', color: '#666' }}>
                  变更对比详情待开发
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="操作流程" style={{ height: '300px' }}>
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <div>提交申请</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {currentRecord.changeTime}
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'green',
                      children: (
                        <div>
                          <div>审批通过</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            审批人: {currentRecord.approver}<br />
                            {currentRecord.changeTime}
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );

  const tabItems = [
    {
      key: 'config',
      label: (
        <span>
          <SettingOutlined />
          定级规则配置
        </span>
      ),
      children: renderLevelRulesConfig(),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <TrophyOutlined />
          等级数据统计
        </span>
      ),
      children: renderLevelStatistics(),
    },
    {
      key: 'records',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: renderModificationRecords(),
    },
  ];

  return (
    <div className="module-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>
      {renderDetailModal()}
      {renderConfigModal()}
      {renderLevelModal()}
    </div>
  );
};

export default MemberLevel;