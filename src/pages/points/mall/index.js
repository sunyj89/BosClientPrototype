import React, { useState, useEffect } from 'react';
import './index.css';
import dayjs from 'dayjs';
import { 
  Card, 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  Modal,
  Upload,
  InputNumber,
  Switch,
  Space, 
  Tag, 
  Image,
  message,
  Tabs,
  DatePicker,
  Row,
  Col,
  Drawer,
  Descriptions,
  Badge,
  Divider,
  Popconfirm,
  TreeSelect,
  Checkbox
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

// 引入主数据分类树形数据
import masterCategoryData from '../../../mock/points/masterCategoryData.json';
// 引入商品数据
import productsData from '../../../mock/points/productsData.json';
// 引入订单数据
import orderData from '../../../mock/points/orderData.json';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Group: CheckboxGroup } = Checkbox;

const PointsMall = () => {
  const [activeTab, setActiveTab] = useState('banner');
  
  // Banner管理相关状态
  const [bannerForm] = Form.useForm();
  const [bannerModalForm] = Form.useForm();
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerDataSource, setBannerDataSource] = useState([]);
  const [bannerModalVisible, setBannerModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerPagination, setBannerPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 商品管理相关状态
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 库存查看相关状态
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 分类管理相关状态
  const [categoryForm] = Form.useForm();
  const [categoryModalForm] = Form.useForm();
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryDataSource, setCategoryDataSource] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryPagination, setCategoryPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 订单管理相关状态
  const [orderForm] = Form.useForm();
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderDataSource, setOrderDataSource] = useState([]);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [orderPagination, setOrderPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 主数据分类相关状态
  const [selectedMainCategory, setSelectedMainCategory] = useState({
    level1: null,
    level2: null,
    level3: null
  });

  // 积分商城规则相关状态
  const [rulesForm] = Form.useForm();
  const [rulesData, setRulesData] = useState({
    pointsUsageLimit: 10000, // 积分使用上限
    maxPointsPerOrder: 300, // 每单最大积分使用量
    isPointsLimitEnabled: true, // 是否启用积分限制
    description: '每个用户每天最多使用10000积分，每单只能使用300积分。',
    // 积分规则文档配置
    pointsRulesDoc: {
      fileName: '',
      fileUrl: '',
      uploadTime: '',
      fileSize: 0
    },
    // 用户须知文档配置
    userGuideDoc: {
      fileName: '',
      fileUrl: '',
      uploadTime: '',
      fileSize: 0
    }
  });
  
  // 文件上传相关状态
  const [uploadingRules, setUploadingRules] = useState(false);
  const [uploadingGuide, setUploadingGuide] = useState(false);

  // 活动配置相关状态
  const [activityForm] = Form.useForm();
  const [activityModalForm] = Form.useForm();
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityDataSource, setActivityDataSource] = useState([]);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityPagination, setActivityPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Banner模拟数据
  const bannerData = [
    {
      id: 1,
      title: "春节特惠活动Banner",
      image: "/images/banner.jpg",
      status: "active",
      linkType: "page",
      linkUrl: "/points/activities/spring-festival",
      linkText: "春节活动页面",
      startTime: "2024-02-01 00:00:00",
      endTime: "2024-02-29 23:59:59",
      sort: 1,
      createTime: "2024-01-25 10:30:00",
      updateTime: "2024-01-25 10:30:00"
    },
    {
      id: 2,
      title: "积分兑换优惠Banner",
      image: "/images/banner.jpg",
      status: "scheduled",
      linkType: "product",
      linkUrl: "/points/mall?category=voucher",
      linkText: "代金券专区",
      startTime: "2024-03-01 00:00:00",
      endTime: "2024-03-31 23:59:59",
      sort: 2,
      createTime: "2024-02-20 14:15:00",
      updateTime: "2024-02-20 14:15:00"
    },
    {
      id: 3,
      title: "会员专享服务Banner",
      image: "/images/banner.jpg",
      status: "inactive",
      linkType: "external",
      linkUrl: "https://example.com/member-service",
      linkText: "会员服务详情",
      startTime: "2024-01-01 00:00:00",
      endTime: "2024-01-31 23:59:59",
      sort: 3,
      createTime: "2023-12-25 09:45:00",
      updateTime: "2024-01-31 23:59:59"
    },
    {
      id: 4,
      title: "新用户注册礼包Banner",
      image: "/images/banner.jpg",
      status: "active",
      linkType: "page",
      linkUrl: "/points/register-gift",
      linkText: "注册礼包页面",
      startTime: "2024-01-01 00:00:00",
      endTime: "2024-12-31 23:59:59",
      sort: 4,
      createTime: "2024-01-01 08:00:00",
      updateTime: "2024-01-15 16:20:00"
    },
    {
      id: 5,
      title: "端午节积分抽奖Banner",
      image: "/images/banner.jpg",
      status: "scheduled",
      linkType: "page",
      linkUrl: "/points/lottery/dragon-boat",
      linkText: "端午节抽奖活动",
      startTime: "2024-06-08 00:00:00",
      endTime: "2024-06-10 23:59:59",
      sort: 5,
      createTime: "2024-05-25 11:00:00",
      updateTime: "2024-05-25 11:00:00"
    },
    {
      id: 6,
      title: "夏季清凉商品专区Banner",
      image: "/images/banner.jpg",
      status: "active",
      linkType: "product",
      linkUrl: "/points/mall?category=summer",
      linkText: "夏季商品专区",
      startTime: "2024-06-01 00:00:00",
      endTime: "2024-08-31 23:59:59",
      sort: 6,
      createTime: "2024-05-20 14:30:00",
      updateTime: "2024-05-20 14:30:00"
    },
    {
      id: 7,
      title: "积分转赠功能Banner",
      image: "/images/banner.jpg",
      status: "active",
      linkType: "page",
      linkUrl: "/points/transfer",
      linkText: "积分转赠页面",
      startTime: "2024-01-15 00:00:00",
      endTime: "2024-12-31 23:59:59",
      sort: 7,
      createTime: "2024-01-10 09:45:00",
      updateTime: "2024-02-01 10:15:00"
    },
    {
      id: 8,
      title: "汽车保养服务Banner",
      image: "/images/banner.jpg",
      status: "inactive",
      linkType: "product",
      linkUrl: "/points/mall?category=service",
      linkText: "汽车服务专区",
      startTime: "2023-12-01 00:00:00",
      endTime: "2023-12-31 23:59:59",
      sort: 8,
      createTime: "2023-11-20 13:20:00",
      updateTime: "2023-12-31 23:59:59"
    }
  ];



  // 分类管理模拟数据
  const categoryData = [
    {
      id: 1,
      categoryName: "美食饮品",
      categoryCode: "FOOD001",
      level1Code: "01",
      level1Name: "食品饮料",
      level2Code: "0101",
      level2Name: "饮品",
      level3Code: "010101",
      level3Name: "咖啡茶饮",
      displayOrder: 1,
      status: "active",
      productCount: 25,
      createTime: "2024-01-15 10:30:00",
      updateTime: "2024-01-20 14:15:00"
    },
    {
      id: 2,
      categoryName: "汽车服务",
      categoryCode: "AUTO001",
      level1Code: "02",
      level1Name: "汽车服务",
      level2Code: "0201",
      level2Name: "保养维修",
      level3Code: "020101",
      level3Name: "洗车服务",
      displayOrder: 2,
      status: "active",
      productCount: 18,
      createTime: "2024-01-10 09:20:00",
      updateTime: "2024-01-25 16:40:00"
    },
    {
      id: 3,
      categoryName: "日用百货",
      categoryCode: "DAILY001",
      level1Code: "03",
      level1Name: "日用品",
      level2Code: "0301",
      level2Name: "生活用品",
      level3Code: "030101",
      level3Name: "清洁用品",
      displayOrder: 3,
      status: "active",
      productCount: 42,
      createTime: "2024-01-08 11:45:00",
      updateTime: "2024-01-22 13:20:00"
    },
    {
      id: 4,
      categoryName: "京东商品",
      categoryCode: "JD001",
      level1Code: "99",
      level1Name: "第三方商品",
      level2Code: "9901",
      level2Name: "京东商城",
      level3Code: "990101",
      level3Name: "京东精选",
      displayOrder: 4,
      status: "active",
      productCount: 156,
      createTime: "2024-01-05 08:30:00",
      updateTime: "2024-01-28 10:50:00"
    },
    {
      id: 5,
      categoryName: "代金券",
      categoryCode: "VOUCHER001",
      level1Code: "04",
      level1Name: "优惠券类",
      level2Code: "0401",
      level2Name: "代金券",
      level3Code: "040101",
      level3Name: "通用代金券",
      displayOrder: 5,
      status: "active",
      productCount: 8,
      createTime: "2024-01-12 15:20:00",
      updateTime: "2024-01-26 17:30:00"
    },
    {
      id: 6,
      categoryName: "数码电器",
      categoryCode: "DIGITAL001",
      level1Code: "05",
      level1Name: "数码电器",
      level2Code: "0501",
      level2Name: "手机配件",
      level3Code: "050101",
      level3Name: "手机周边",
      displayOrder: 6,
      status: "inactive",
      productCount: 0,
      createTime: "2024-01-20 12:15:00",
      updateTime: "2024-01-20 12:15:00"
    }
  ];

  // 活动配置模拟数据
  const activityData = [
    {
      id: 1,
      activityId: "ACT202401001",
      activityName: "春节积分狂欢节",
      startTime: "2024-02-01 00:00:00",
      endTime: "2024-02-29 23:59:59",
      status: "进行中",
      applicableStations: ["赣中分公司-服务区A-油站A1", "赣中分公司-服务区A-油站A2", "赣东北分公司-服务区A-油站A1"],
      description: "春节期间积分商城全场9折，满1000积分再减100积分",
      rules: "1. 活动期间积分商城商品享受9折优惠\n2. 单笔消费满1000积分可再减100积分\n3. 每个用户每天最多享受3次优惠\n4. 活动商品以页面展示为准",
      posterImage: "/images/activity-poster-1.jpg",
      productJumpLink: "/points/mall?activity=spring2024",
      h5Link: "https://activity.example.com/spring2024",
      createTime: "2024-01-25 10:30:00",
      updateTime: "2024-02-01 08:00:00"
    },
    {
      id: 2,
      activityId: "ACT202401002", 
      activityName: "会员专享积分双倍",
      startTime: "2024-03-01 00:00:00",
      endTime: "2024-03-31 23:59:59",
      status: "未开始",
      applicableStations: ["赣东分公司-服务区A-油站A1", "赣东分公司-服务区B-油站B1"],
      description: "VIP会员积分获取双倍，兑换商品享受专属价格",
      rules: "1. 仅限VIP会员参与\n2. 活动期间积分获取翻倍\n3. 兑换指定商品享受专属价格\n4. 不与其他活动同享",
      posterImage: "/images/activity-poster-2.jpg",
      productJumpLink: "/points/mall?activity=vip2024",
      h5Link: "https://activity.example.com/vip2024",
      createTime: "2024-02-15 14:20:00",
      updateTime: "2024-02-15 14:20:00"
    },
    {
      id: 3,
      activityId: "ACT202312001",
      activityName: "元旦新年礼品季",
      startTime: "2024-01-01 00:00:00", 
      endTime: "2024-01-15 23:59:59",
      status: "已结束",
      applicableStations: ["赣南分公司-服务区A-油站A1", "赣南分公司-服务区A-油站A2", "赣西南分公司-服务区A-油站A1"],
      description: "元旦期间精选礼品限时兑换，数量有限先到先得",
      rules: "1. 活动商品数量有限\n2. 每人限兑换2件\n3. 积分不足可现金补差\n4. 活动结束后恢复原价",
      posterImage: "/images/activity-poster-3.jpg",
      productJumpLink: "/points/mall?activity=newyear2024",
      h5Link: "https://activity.example.com/newyear2024",
      createTime: "2023-12-20 16:45:00",
      updateTime: "2024-01-15 23:59:59"
    },
    {
      id: 4,
      activityId: "ACT202401003",
      activityName: "京东商品专场",
      startTime: "2024-02-15 00:00:00",
      endTime: "2024-04-15 23:59:59", 
      status: "进行中",
      applicableStations: ["赣西分公司-服务区A-油站A1", "赣西分公司-服务区B-油站B1", "赣西北分公司-服务区A-油站A1"],
      description: "京东商品积分兑换专场，品质保证，京东物流配送",
      rules: "1. 仅限京东商品参与\n2. 京东物流配送到家\n3. 享受京东售后服务\n4. 部分商品支持7天无理由退换",
      posterImage: "/images/activity-poster-4.jpg", 
      productJumpLink: "/points/mall?category=jd&activity=jd2024",
      h5Link: "https://activity.example.com/jd2024",
      createTime: "2024-02-10 11:30:00",
      updateTime: "2024-02-15 00:00:00"
    },
    {
      id: 5,
      activityId: "ACT202401004",
      activityName: "积分清仓大甩卖",
      startTime: "2024-04-01 00:00:00",
      endTime: "2024-04-30 23:59:59",
      status: "未开始", 
      applicableStations: ["赣东南分公司-服务区A-油站A1", "赣东南分公司-服务区A-油站A2"],
      description: "积分清仓活动，部分商品低至5折，清仓不退换",
      rules: "1. 清仓商品售完即止\n2. 清仓商品不支持退换\n3. 积分支付优先\n4. 活动商品以实际库存为准",
      posterImage: "/images/activity-poster-5.jpg",
      productJumpLink: "/points/mall?activity=clearance2024", 
      h5Link: "https://activity.example.com/clearance2024",
      createTime: "2024-03-15 09:15:00",
      updateTime: "2024-03-15 09:15:00"
    }
  ];

  useEffect(() => {
    if (activeTab === 'banner') {
      loadBannerData();
    } else if (activeTab === 'products') {
    loadData();
    } else if (activeTab === 'categories') {
      loadCategoryData();
    } else if (activeTab === 'activities') {
      loadActivityData();
    } else if (activeTab === 'orders') {
      loadOrderData();
    }
  }, [activeTab, bannerPagination.current, bannerPagination.pageSize, pagination.current, pagination.pageSize, categoryPagination.current, categoryPagination.pageSize, activityPagination.current, activityPagination.pageSize, orderPagination.current, orderPagination.pageSize]);

  // Banner数据加载
  const loadBannerData = async () => {
    setBannerLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBannerDataSource(bannerData);
      setBannerPagination(prev => ({ ...prev, total: bannerData.length }));
    } catch (error) {
      message.error('加载Banner数据失败');
    } finally {
      setBannerLoading(false);
    }
  };

  // 商品数据加载
  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDataSource(productsData);
      setPagination(prev => ({ ...prev, total: productsData.length }));
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 分类数据加载
  const loadCategoryData = async () => {
    setCategoryLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategoryDataSource(categoryData);
      setCategoryPagination(prev => ({ ...prev, total: categoryData.length }));
    } catch (error) {
      message.error('加载分类数据失败');
    } finally {
      setCategoryLoading(false);
    }
  };

  // 订单数据加载
  const loadOrderData = async () => {
    setOrderLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrderDataSource(orderData);
      setOrderPagination(prev => ({ ...prev, total: orderData.length }));
    } catch (error) {
      message.error('加载订单数据失败');
    } finally {
      setOrderLoading(false);
    }
  };

  // 活动配置数据加载
  const loadActivityData = async () => {
    setActivityLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivityDataSource(activityData);
      setActivityPagination(prev => ({ ...prev, total: activityData.length }));
    } catch (error) {
      message.error('加载活动数据失败');
    } finally {
      setActivityLoading(false);
    }
  };

  // Banner搜索
  const handleBannerSearch = async (values) => {
    console.log('Banner搜索条件:', values);
    setBannerPagination(prev => ({ ...prev, current: 1 }));
    loadBannerData();
  };

  // Banner重置
  const handleBannerReset = () => {
    bannerForm.resetFields();
    setBannerPagination(prev => ({ ...prev, current: 1 }));
    loadBannerData();
  };

  // 新增Banner
  const handleAddBanner = () => {
    setEditingBanner(null);
    bannerModalForm.resetFields();
    setBannerModalVisible(true);
  };

  // 编辑Banner
  const handleEditBanner = (record) => {
    setEditingBanner(record);
    bannerModalForm.setFieldsValue({
      ...record,
      status: record.status === 'active',
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null,
      image: record.image ? [{ url: record.image }] : []
    });
    setBannerModalVisible(true);
  };

  // 删除Banner
  const handleDeleteBanner = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除Banner"${record.title}"吗？`,
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          message.success('删除成功');
          loadBannerData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // Banner弹窗确认
  const handleBannerModalOk = async () => {
    try {
      const values = await bannerModalForm.validateFields();
      
      // 处理日期格式
      const bannerData = {
        ...values,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
        status: values.status ? 'active' : 'inactive'
      };
      
      console.log('Banner提交数据:', bannerData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(editingBanner ? 'Banner更新成功' : 'Banner添加成功');
      setBannerModalVisible(false);
      bannerModalForm.resetFields();
      setEditingBanner(null);
      loadBannerData();
    } catch (error) {
      console.error('Banner validation failed:', error);
    }
  };

  // 活动配置搜索
  const handleActivitySearch = async (values) => {
    console.log('活动搜索条件:', values);
    setActivityPagination(prev => ({ ...prev, current: 1 }));
    loadActivityData();
  };

  // 活动配置重置
  const handleActivityReset = () => {
    activityForm.resetFields();
    setActivityPagination(prev => ({ ...prev, current: 1 }));
    loadActivityData();
  };

  // 新增活动
  const handleAddActivity = () => {
    setEditingActivity(null);
    activityModalForm.resetFields();
    setActivityModalVisible(true);
  };

  // 编辑活动
  const handleEditActivity = (record) => {
    setEditingActivity(record);
    activityModalForm.setFieldsValue({
      ...record,
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null,
      applicableStations: record.applicableStations || [],
      posterImage: record.posterImage ? [{ url: record.posterImage }] : []
    });
    setActivityModalVisible(true);
  };

  // 删除活动
  const handleDeleteActivity = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除活动"${record.activityName}"吗？`,
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          message.success('删除成功');
          loadActivityData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 停止活动
  const handleStopActivity = (record) => {
    Modal.confirm({
      title: '确认停止活动',
      content: `确定要停止活动"${record.activityName}"吗？停止后活动将立即结束。`,
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          message.success('活动已停止');
          loadActivityData();
        } catch (error) {
          message.error('停止活动失败');
        }
      },
    });
  };

  // 查看活动详情
  const handleViewActivity = (record) => {
    Modal.info({
      title: `活动详情 - ${record.activityName}`,
      width: 800,
      content: (
        <div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="活动ID">{record.activityId}</Descriptions.Item>
            <Descriptions.Item label="活动名称">{record.activityName}</Descriptions.Item>
            <Descriptions.Item label="活动时间">
              {record.startTime} ~ {record.endTime}
            </Descriptions.Item>
            <Descriptions.Item label="活动状态">
              <Tag color={
                record.status === '进行中' ? 'green' : 
                record.status === '未开始' ? 'blue' : 'default'
              }>
                {record.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="适用油站">
              {record.applicableStations.join('、')}
            </Descriptions.Item>
            <Descriptions.Item label="活动描述">{record.description}</Descriptions.Item>
            <Descriptions.Item label="活动规则">
              <div style={{ whiteSpace: 'pre-line' }}>{record.rules}</div>
            </Descriptions.Item>
            <Descriptions.Item label="商品跳转链接">
              <a href={record.productJumpLink} target="_blank" rel="noopener noreferrer">
                {record.productJumpLink}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="H5活动页面">
              <a href={record.h5Link} target="_blank" rel="noopener noreferrer">
                {record.h5Link}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    });
  };

  // 活动配置弹窗确认
  const handleActivityModalOk = async () => {
    try {
      const values = await activityModalForm.validateFields();
      
      // 处理日期格式
      const activityData = {
        ...values,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
        // 根据时间自动判断状态
        status: (() => {
          const now = dayjs();
          const start = dayjs(values.startTime);
          const end = dayjs(values.endTime);
          if (now.isBefore(start)) return '未开始';
          if (now.isAfter(end)) return '已结束';
          return '进行中';
        })(),
        // 生成H5链接
        h5Link: `https://activity.example.com/${values.activityId.toLowerCase()}`
      };
      
      console.log('活动提交数据:', activityData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(editingActivity ? '活动更新成功' : '活动添加成功');
      setActivityModalVisible(false);
      activityModalForm.resetFields();
      setEditingActivity(null);
      loadActivityData();
    } catch (error) {
      console.error('活动 validation failed:', error);
    }
  };

  // 商品搜索
  const handleSearch = async (values) => {
    console.log('搜索条件:', values);
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  // 商品重置
  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  // 新增商品
  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    
    // 自动生成商品编号
    const timestamp = Date.now();
    const productCode = `PSG${String(timestamp).slice(-6)}`;
    modalForm.setFieldsValue({ productCode });
    
    setModalVisible(true);
  };

  // 编辑商品
  const handleEdit = (record) => {
    setEditingRecord(record);
    
    // 处理图片数据 - 支持多图片
    let imagesData = [];
    if (record.images && Array.isArray(record.images)) {
      // 新格式：多图片数组
      imagesData = record.images.map((img, index) => ({
        uid: `image-${index}`,
        name: `image-${index}.jpg`,
        status: 'done',
        url: img
      }));
    } else if (record.image) {
      // 兼容旧格式：单张图片
      imagesData = [{
        uid: 'image-0',
        name: 'image-0.jpg', 
        status: 'done',
        url: record.image
      }];
    }
    
    // 处理时间格式和商品编号
    const formData = {
      ...record,
      productCode: record.productCode || `PSG${String(record.id).padStart(6, '0')}`,
      autoOnlineTime: record.autoOnlineTime ? dayjs(record.autoOnlineTime) : null,
      autoOfflineTime: record.autoOfflineTime ? dayjs(record.autoOfflineTime) : null,
      images: imagesData
    };
    
    modalForm.setFieldsValue(formData);
    setModalVisible(true);
  };

  // 删除商品
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除商品"${record.name}"吗？`,
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          message.success('删除成功');
          loadData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 查看库存
  const handleViewStock = (record) => {
    setSelectedProduct(record);
    setStockModalVisible(true);
  };



  // 商品弹窗确认
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      
      // 获取分类名称
      const categoryMap = {
        1: '汽车服务',
        2: '生活服务',
        3: '日用百货',
        4: '京东商品',
        5: '代金券',
        6: '数码电器'
      };
      
      // 站点名称映射
      const stationMap = {
        'ST001': '南昌高速服务区加油站',
        'ST002': '上饶高速服务区加油站',
        'ST003': '赣州高速服务区加油站',
        'ST004': '九江高速服务区加油站',
        'ST005': '南昌市区加油站',
        'ST006': '上饶市区加油站',
        'ST007': '赣州市区加油站',
        'ST008': '九江市区加油站'
      };
      
      // 生成站点库存数据
      const stationStocks = values.availableStations.map(stationCode => {
        const baseStock = Math.floor(Math.random() * 50) + 20; // 20-70的随机库存
        const safetyStock = values.safetyStock || 0;
        return {
          stationCode,
          stationName: stationMap[stationCode],
          realTimeStock: baseStock,
          safetyStock,
          availableStock: Math.max(0, baseStock - safetyStock)
        };
      });
      
      // 计算总库存
      const totalStock = stationStocks.reduce((sum, stock) => sum + stock.availableStock, 0);
      
      // 处理图片数据
      let processedImages = [];
      let mainImage = null;
      
      if (values.images && values.images.length > 0) {
        processedImages = values.images.map(file => {
          if (file.response && file.response.url) {
            return file.response.url;
          } else if (file.url) {
            return file.url;
          }
          return '/images/gift.jpg'; // 默认图片
        });
        
        // 第一张图片作为主图
        mainImage = processedImages[0];
      }
      
      // 处理数据格式
      const productData = {
        ...values,
        categoryName: categoryMap[values.categoryId],
        totalStock,
        stationStocks,
        productCode: values.productCode || `PSG${String(Date.now()).slice(-6)}`,
        // 图片处理
        images: processedImages,
        image: mainImage || '/images/gift.jpg', // 兼容性保留单张图片字段
        autoOnlineTime: values.autoOnlineTime ? dayjs(values.autoOnlineTime).format('YYYY-MM-DD HH:mm:ss') : null,
        autoOfflineTime: values.autoOfflineTime ? dayjs(values.autoOfflineTime).format('YYYY-MM-DD HH:mm:ss') : null,
        createTime: editingRecord ? editingRecord.createTime : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        id: editingRecord ? editingRecord.id : Date.now()
      };
      
      console.log('提交数据:', productData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(editingRecord ? '更新成功' : '添加成功');
      setModalVisible(false);
      modalForm.resetFields();
      setEditingRecord(null);
      loadData();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Banner表格列配置
  const bannerColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 60,
      render: (_, __, index) => (bannerPagination.current - 1) * bannerPagination.pageSize + index + 1,
    },
    {
      title: 'Banner图片',
      dataIndex: 'image',
      width: 120,
      render: (url) => (
        <Image
          width={80}
          height={30}
          src={url}
          className="banner-image"
          style={{ objectFit: 'cover' }}
          fallback="/images/banner.jpg"
          preview={{ mask: <EyeOutlined /> }}
          onError={(e) => {
            console.log('Banner图片加载失败:', url, e);
          }}
        />
      ),
    },
    {
      title: 'Banner标题',
      dataIndex: 'title',
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => {
        const statusMap = {
          active: { text: '已上线', color: 'green' },
          scheduled: { text: '定时上线', color: 'blue' },
          inactive: { text: '已下线', color: 'red' },
        };
        const status = statusMap[value] || { text: value, color: 'default' };
        return <Tag color={status.color} className="status-tag">{status.text}</Tag>;
      },
    },
    {
      title: '跳转链接',
      dataIndex: 'linkText',
      width: 150,
      ellipsis: true,
    },
    {
      title: '有效期',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.startTime}</div>
          <div>{record.endTime}</div>
        </div>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditBanner(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBanner(record)}
            style={{ borderRadius: '2px' }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 商品表格列配置
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '商品图片',
      dataIndex: 'image',
      width: 80,
      render: (url) => (
        <Image
          width={50}
          height={50}
          src={url}
          style={{ objectFit: 'cover', borderRadius: '4px' }}
          fallback="/images/gift.jpg"
          preview={{ mask: <EyeOutlined /> }}
          onError={(e) => {
            console.log('商品图片加载失败:', url, e);
          }}
        />
      ),
    },
    {
      title: '商品编号',
      dataIndex: 'productCode',
      width: 120,
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
          {text || 'PSG000000'}
        </span>
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 180,
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          {record.promotionTags && record.promotionTags.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {record.promotionTags.map(tag => {
                const tagConfig = {
                  hot: { text: '热门', color: '#ff4d4f' },
                  top: { text: '置顶', color: '#722ed1' },
                  recommended: { text: '推荐', color: '#fa8c16' }
                };
                const config = tagConfig[tag] || { text: tag, color: '#1890ff' };
                return (
                  <Tag key={tag} color={config.color} size="small">
                    {config.text}
                  </Tag>
                );
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '类别',
      dataIndex: 'categoryName',
      width: 100,
      render: (text, record) => (
        <div>
          <Tag color="blue">{text}</Tag>
          {record.categoryId === 4 && (
            <div style={{ marginTop: 2 }}>
              <Tag color="orange" size="small">京东商品</Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '京东信息',
      width: 150,
      render: (_, record) => {
        if (record.categoryId === 4) {
          return (
            <div style={{ fontSize: '12px' }}>
              <div>ID: {record.jdProductId || '-'}</div>
              {record.jdProductUrl && (
                <div style={{ marginTop: 2 }}>
                  <a 
                    href={record.jdProductUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#1890ff' }}
                  >
                    查看京东商品
                  </a>
                </div>
              )}
            </div>
          );
        }
        return <span style={{ color: '#ccc' }}>-</span>;
      },
    },
    {
      title: '商城价格',
      width: 120,
      render: (_, record) => {
        const { supportPaymentMethod, mallPrice } = record;
        
        if (supportPaymentMethod === 'points') {
          return (
            <div style={{ fontSize: '12px', color: '#000', fontWeight: 'bold' }}>
              {mallPrice} 积分
            </div>
          );
        }
        
        if (supportPaymentMethod === 'wechat') {
          return (
            <div style={{ fontSize: '12px', color: '#000' }}>
              ￥{mallPrice.toFixed(2)}
            </div>
          );
        }
        
        if (supportPaymentMethod === 'pointsWithWechat' && typeof mallPrice === 'object') {
          return (
            <div style={{ fontSize: '12px', color: '#000' }}>
              {mallPrice.points}积分+￥{mallPrice.wechat.toFixed(2)}
            </div>
          );
        }
        
        return <div style={{ fontSize: '12px', color: '#000' }}>-</div>;
      },
    },
    {
      title: '原价',
      dataIndex: 'originalPrice',
      width: 80,
      render: (value) => `￥${value.toFixed(2)}`,
    },
    {
      title: '总库存',
      dataIndex: 'totalStock',
      width: 80,
      render: (value) => (
        <span style={{ color: value > 50 ? '#52c41a' : value > 10 ? '#faad14' : '#ff4d4f' }}>
          {value}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => {
        const statusConfig = {
          active: { text: '已上架', color: 'green' },
          scheduled: { text: '定时上架', color: 'blue' },
          inactive: { text: '已下架', color: 'red' }
        };
        const config = statusConfig[value] || { text: value, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '支付方式',
      dataIndex: 'supportPaymentMethod',
      width: 120,
      render: (method) => {
        const methodConfig = {
          points: '积分支付',
          pointsWithWechat: '积分+微信',
          wechat: '微信支付'
        };
        return (
          <span style={{ color: '#000' }}>
            {methodConfig[method] || method}
          </span>
        );
      },
    },
    {
      title: '限购数量',
      dataIndex: 'purchaseLimit',
      width: 80,
      render: (value) => (
        <span style={{ color: value > 0 ? '#fa8c16' : '#52c41a' }}>
          {value > 0 ? `限${value}件` : '不限购'}
        </span>
      ),
    },
    {
      title: '配送方式',
      width: 120,
      render: (_, record) => {
        const isJdDelivery = record.deliveryMethod === 'jd_express';
        return (
          <div>
            <Tag color={isJdDelivery ? 'orange' : 'blue'}>
              {isJdDelivery ? '京东配送' : '油站自提'}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'displayOrder',
      width: 60,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewStock(record)}
            style={{ borderRadius: '2px' }}
          >
            库存
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            style={{ borderRadius: '2px' }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // Banner筛选区域
  const renderBannerFilter = () => (
    <Card className="filter-card">
      <Form
        form={bannerForm}
        layout="inline"
        onFinish={handleBannerSearch}
      >
        <Form.Item name="title" label="Banner标题">
          <Input placeholder="请输入Banner标题" style={{ width: 150 }} />
        </Form.Item>
        
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="active">已上线</Option>
            <Option value="scheduled">定时上线</Option>
            <Option value="inactive">已下线</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="timeRange" label="有效期">
          <RangePicker 
            style={{ width: 240 }} 
            format="YYYY-MM-DD"
            placeholder={['开始日期', '结束日期']}
          />
        </Form.Item>
      </Form>
      
      <div className="filter-buttons">
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SearchOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={handleBannerSearch}
          >
            查询
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleBannerReset}
            style={{ borderRadius: '2px' }}
          >
            重置
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddBanner}
            style={{ borderRadius: '2px' }}
          >
            新建
          </Button>
        </Space>
      </div>
    </Card>
  );

  // 商品筛选区域
  const renderProductFilter = () => (
    <Card className="filter-card">
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="name" label="商品名称">
            <Input placeholder="请输入商品名称" style={{ width: 150 }} />
          </Form.Item>
          
          <Form.Item name="category" label="商品类别">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Option value="service">服务</Option>
              <Option value="voucher">代金券</Option>
              <Option value="goods">实物商品</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" style={{ width: 100 }} allowClear>
              <Option value="active">上架</Option>
              <Option value="inactive">下架</Option>
            </Select>
          </Form.Item>
        </Form>
        
      <div className="filter-buttons">
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
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ borderRadius: '2px' }}
            >
              新建
            </Button>
          </Space>
        </div>
      </Card>
  );

  // 分类管理相关处理函数
  const handleCategorySearch = async (values) => {
    console.log('分类搜索条件:', values);
    setCategoryPagination(prev => ({ ...prev, current: 1 }));
    loadCategoryData();
  };

  const handleCategoryReset = () => {
    categoryForm.resetFields();
    setCategoryPagination(prev => ({ ...prev, current: 1 }));
    loadCategoryData();
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    categoryModalForm.resetFields();
    // 重置主数据分类选择状态
    setSelectedMainCategory({
      level1: null,
      level2: null,
      level3: null
    });
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    categoryModalForm.setFieldsValue({
      ...record,
      status: record.status === 'active',
      level1Selection: record.level1Code,
      level2Selection: record.level2Code,
      level3Selection: record.level3Code,
    });
    // 设置主数据分类选择状态
    setSelectedMainCategory({
      level1: record.level1Code,
      level2: record.level2Code,
      level3: record.level3Code
    });
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分类"${record.categoryName}"吗？`,
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          message.success('删除成功');
          loadCategoryData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleCategoryModalOk = async () => {
    try {
      const values = await categoryModalForm.validateFields();
      
      const categoryData = {
        ...values,
        status: values.status ? 'active' : 'inactive'
      };
      
      console.log('分类提交数据:', categoryData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(editingCategory ? '分类更新成功' : '分类添加成功');
      setCategoryModalVisible(false);
      categoryModalForm.resetFields();
      setEditingCategory(null);
      loadCategoryData();
    } catch (error) {
      console.error('分类validation failed:', error);
    }
  };

  // 订单管理相关处理函数
  const handleOrderSearch = async (values) => {
    console.log('订单搜索条件:', values);
    setOrderPagination(prev => ({ ...prev, current: 1 }));
    loadOrderData();
  };

  const handleOrderReset = () => {
    orderForm.resetFields();
    setOrderPagination(prev => ({ ...prev, current: 1 }));
    loadOrderData();
  };

  const handleViewOrderDetail = (record) => {
    setSelectedOrder(record);
    setOrderDetailVisible(true);
  };

  const handleRefundApproval = (record) => {
    setSelectedOrder(record);
    setRefundModalVisible(true);
  };

  const handleRefundApprove = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('退款申请已批准，退款处理中');
      setRefundModalVisible(false);
      setSelectedOrder(null);
      loadOrderData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleRefundReject = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('退款申请已拒绝');
      setRefundModalVisible(false);
      setSelectedOrder(null);
      loadOrderData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 积分商城规则相关处理函数
  const handleRulesSave = async () => {
    try {
      const values = await rulesForm.validateFields();
      setRulesData({ ...rulesData, ...values });
      message.success('积分商城规则保存成功');
    } catch (error) {
      message.error('请检查输入信息');
    }
  };

  const handleRulesReset = () => {
    rulesForm.resetFields();
    setRulesData({
      pointsUsageLimit: 300,
      maxPointsPerOrder: 300,
      isPointsLimitEnabled: true,
      description: '每个用户每单只能使用300积分，超过300积分就无法兑换',
      pointsRulesDoc: {
        fileName: '',
        fileUrl: '',
        uploadTime: '',
        fileSize: 0
      },
      userGuideDoc: {
        fileName: '',
        fileUrl: '',
        uploadTime: '',
        fileSize: 0
      }
    });
    message.success('规则配置已重置');
  };

  // 文件上传处理函数
  const handleFileUpload = async (file, type) => {
    const isValidType = file.type === 'text/html' || 
                       file.type === 'text/plain';
    
    if (!isValidType) {
      message.error('只支持上传 HTML 或 TXT 格式的文件！');
      return false;
    }

    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('文件大小不能超过 1MB！');
      return false;
    }

    // 设置上传状态
    if (type === 'rules') {
      setUploadingRules(true);
    } else {
      setUploadingGuide(true);
    }

    try {
      // 模拟文件上传
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockFileUrl = `/uploads/${type}/${Date.now()}_${file.name}`;
      const uploadTime = new Date().toLocaleString();
      
      // 更新规则数据
      const newRulesData = { ...rulesData };
      if (type === 'rules') {
        newRulesData.pointsRulesDoc = {
          fileName: file.name,
          fileUrl: mockFileUrl,
          uploadTime: uploadTime,
          fileSize: file.size
        };
      } else {
        newRulesData.userGuideDoc = {
          fileName: file.name,
          fileUrl: mockFileUrl,
          uploadTime: uploadTime,
          fileSize: file.size
        };
      }
      
      setRulesData(newRulesData);
      message.success('文件上传成功！');
      
    } catch (error) {
      message.error('文件上传失败，请重试！');
    } finally {
      // 重置上传状态
      if (type === 'rules') {
        setUploadingRules(false);
      } else {
        setUploadingGuide(false);
      }
    }
    
    return false; // 阻止默认上传行为
  };

  // 删除文件
  const handleFileDelete = (type) => {
    const newRulesData = { ...rulesData };
    if (type === 'rules') {
      newRulesData.pointsRulesDoc = {
        fileName: '',
        fileUrl: '',
        uploadTime: '',
        fileSize: 0
      };
    } else {
      newRulesData.userGuideDoc = {
        fileName: '',
        fileUrl: '',
        uploadTime: '',
        fileSize: 0
      };
    }
    setRulesData(newRulesData);
    message.success('文件已删除');
  };

  // 下载文件
  const handleFileDownload = (fileUrl, fileName) => {
    // 模拟文件下载
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('文件下载中...');
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 活动配置表格列配置
  const activityColumns = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => (activityPagination.current - 1) * activityPagination.pageSize + index + 1,
    },
    {
      title: '活动ID',
      dataIndex: 'activityId',
      width: 120,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      width: 200,
      render: (text) => <span style={{ color: '#1890ff' }}>{text}</span>,
    },
    {
      title: '活动时间',
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '13px' }}>开始：{record.startTime}</div>
          <div style={{ fontSize: '13px' }}>结束：{record.endTime}</div>
        </div>
      ),
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => (
        <Tag color={
          value === '进行中' ? 'green' : 
          value === '未开始' ? 'blue' : 'default'
        }>
          {value}
        </Tag>
      ),
    },
    {
      title: '适用油站',
      dataIndex: 'applicableStations',
      width: 200,
      render: (stations) => (
        <div>
          {stations.slice(0, 2).map((station, index) => (
            <div key={index} style={{ fontSize: '12px', color: '#666' }}>
              {station}
            </div>
          ))}
          {stations.length > 2 && (
            <div style={{ fontSize: '12px', color: '#999' }}>
              等{stations.length}个油站
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'H5链接',
      dataIndex: 'h5Link',
      width: 200,
      render: (link) => (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px' }}>
          {link.length > 30 ? link.substring(0, 30) + '...' : link}
        </a>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        if (record.status === '未开始') {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditActivity(record)}
                style={{ borderRadius: '2px' }}
              >
                编辑
              </Button>
              <Button
                type="primary"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteActivity(record)}
                style={{ borderRadius: '2px' }}
              >
                删除
              </Button>
            </Space>
          );
        } else if (record.status === '进行中') {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewActivity(record)}
                style={{ borderRadius: '2px' }}
              >
                查看
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStopActivity(record)}
                style={{ borderRadius: '2px' }}
              >
                停止
              </Button>
            </Space>
          );
        } else {
          return (
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewActivity(record)}
              style={{ borderRadius: '2px' }}
            >
              查看
            </Button>
          );
        }
      },
    },
  ];

  // 分类表格列配置
  const categoryColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 60,
      render: (_, __, index) => (categoryPagination.current - 1) * categoryPagination.pageSize + index + 1,
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      width: 150,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '分类编码',
      dataIndex: 'categoryCode',
      width: 120,
    },
    {
      title: '一级分类',
      width: 120,
      render: (_, record) => (
        <span>{record.level1Code}-{record.level1Name}</span>
      ),
    },
    {
      title: '二级分类',
      width: 120,
      render: (_, record) => (
        <span>{record.level2Code}-{record.level2Name}</span>
      ),
    },
    {
      title: '三级分类',
      width: 120,
      render: (_, record) => (
        <span>{record.level3Code}-{record.level3Name}</span>
      ),
    },
    {
      title: '显示顺序',
      dataIndex: 'displayOrder',
      width: 100,
    },
    {
      title: '商品数量',
      dataIndex: 'productCount',
      width: 100,
      render: (value) => (
        <span style={{ color: value > 0 ? '#52c41a' : '#999' }}>
          {value}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => (
        <Tag color={value === 'active' ? 'green' : 'red'}>
          {value === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
            style={{ borderRadius: '2px' }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCategory(record)}
            style={{ borderRadius: '2px' }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 订单表格列配置
  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '用户信息',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.userPhone.replace(/(\d{3})\*{4}(\d{4})/, '$1****$2')}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.userName}</div>
        </div>
      ),
    },
    {
      title: '商品信息',
      width: 200,
      render: (_, record) => {
        const hasJdProduct = record.products.some(p => p.categoryId === 4);
        return (
          <div>
            {record.products.map((product, index) => (
              <div key={index} style={{ marginBottom: index < record.products.length - 1 ? 4 : 0 }}>
                <div style={{ 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {product.categoryId === 4 && (
                    <Tag color="orange" size="small">京东</Tag>
                  )}
                  <span>{product.productName}</span>
                </div>
                {product.categoryId === 4 && (
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                    ID: {product.jdProductId}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      width: 150,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethodText',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '订单金额',
      width: 120,
      render: (_, record) => (
        <div>
          <div>￥{record.totalAmount.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: '#f50' }}>{record.pointsUsed}积分</div>
        </div>
      ),
    },
    {
      title: '配送方式',
      width: 120,
      render: (_, record) => {
        const isJdDelivery = record.deliveryMethod === 'jd_express';
        return (
          <div>
            <Tag color={isJdDelivery ? 'orange' : 'blue'}>
              {isJdDelivery ? '京东配送' : '油站自提'}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 100,
      render: (value, record) => {
        const statusConfig = {
          paid: { color: 'blue', text: '支付成功' },
          completed: { color: 'green', text: record.deliveryMethod === 'jd_express' ? '配送完成' : '提货完成' },
          cancelled: { color: 'red', text: '取消支付' },
          pending_refund: { color: 'orange', text: '待退款' },
          refunded: { color: 'purple', text: '退款完成' },
          exception: { color: 'red', text: '异常订单' },
        };
        const config = statusConfig[value] || { color: 'default', text: record.statusText };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '配送信息',
      width: 180,
      render: (_, record) => {
        if (record.deliveryMethod === 'jd_express') {
          return (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fa8c16' }}>
                京东配送
              </div>
              {/* 移除京东发货信息显示，因为系统无法获取京东物流状态 */}
              {record.deliveryAddress && (
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  {record.deliveryAddress.length > 20 
                    ? record.deliveryAddress.substring(0, 20) + '...'
                    : record.deliveryAddress
                  }
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1890ff' }}>
                油站信息
              </div>
              <div style={{ fontSize: '12px' }}>
                {record.pickupStation || '-'}
              </div>
              {record.stationCode && (
                <div style={{ fontSize: '11px', color: '#999' }}>
                  {record.stationCode}
                </div>
              )}
            </div>
          );
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrderDetail(record)}
            style={{ borderRadius: '2px' }}
          >
            详情
          </Button>
          {record.status === 'pending_refund' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleRefundApproval(record)}
              style={{ borderRadius: '2px' }}
            >
              退款审批
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 分类筛选区域
  const renderCategoryFilter = () => (
    <Card className="filter-card">
      <Form
        form={categoryForm}
        layout="inline"
        onFinish={handleCategorySearch}
      >
        <Form.Item name="categoryName" label="分类名称">
          <Input placeholder="请输入分类名称" style={{ width: 150 }} />
        </Form.Item>
        
        <Form.Item name="categoryCode" label="分类编码">
          <Input placeholder="请输入分类编码" style={{ width: 150 }} />
        </Form.Item>
        
        <Form.Item name="level1Code" label="一级分类">
          <Select placeholder="请选择一级分类" style={{ width: 150 }} allowClear>
            <Option value="01">01-食品饮料</Option>
            <Option value="02">02-汽车服务</Option>
            <Option value="03">03-日用品</Option>
            <Option value="04">04-优惠券类</Option>
            <Option value="05">05-数码电器</Option>
            <Option value="99">99-第三方商品</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="active">启用</Option>
            <Option value="inactive">禁用</Option>
          </Select>
        </Form.Item>
      </Form>
      
      <div className="filter-buttons">
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SearchOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={handleCategorySearch}
          >
            查询
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleCategoryReset}
            style={{ borderRadius: '2px' }}
          >
            重置
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddCategory}
            style={{ borderRadius: '2px' }}
          >
            新建
          </Button>
        </Space>
      </div>
    </Card>
  );

  // 订单筛选区域
  const renderOrderFilter = () => (
    <Card className="filter-card">
      <Form
        form={orderForm}
        layout="inline"
        onFinish={handleOrderSearch}
      >
        <Form.Item name="orderNo" label="订单号">
          <Input placeholder="请输入订单号" style={{ width: 180 }} />
        </Form.Item>
        
        <Form.Item name="userPhone" label="用户手机号">
          <Input placeholder="请输入手机号" style={{ width: 150 }} />
        </Form.Item>
        
        <Form.Item name="paymentMethod" label="支付方式">
          <Select placeholder="请选择支付方式" style={{ width: 150 }} allowClear>
            <Option value="points">积分</Option>
            <Option value="mixed_wechat">积分+微信支付</Option>
            <Option value="mixed_cash">积分+现金</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="status" label="订单状态">
          <Select placeholder="请选择订单状态" style={{ width: 150 }} allowClear>
            <Option value="paid">支付成功</Option>
            <Option value="completed">提货完成</Option>
            <Option value="cancelled">取消支付</Option>
            <Option value="pending_refund">待退款</Option>
            <Option value="refunded">退款完成</Option>
            <Option value="exception">异常订单</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="deliveryMethod" label="配送方式">
          <Select placeholder="请选择配送方式" style={{ width: 150 }} allowClear>
            <Option value="pickup">油站自提</Option>
            <Option value="jd_express">京东配送</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="orderTimeRange" label="下单时间">
          <RangePicker 
            style={{ width: 240 }} 
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
      </Form>
      
      <div className="filter-buttons">
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SearchOutlined />}
            style={{ borderRadius: '2px' }}
            onClick={handleOrderSearch}
          >
            查询
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleOrderReset}
            style={{ borderRadius: '2px' }}
          >
            重置
          </Button>
        </Space>
      </div>
    </Card>
  );

  // 活动配置筛选条件渲染
  const renderActivityFilter = () => (
    <Card className="filter-card" style={{ marginBottom: 16 }}>
      <Form
        form={activityForm}
        layout="inline"
        onFinish={handleActivitySearch}
        className="filter-form"
      >
        <Form.Item name="activityId" label="活动ID">
          <Input placeholder="请输入活动ID" style={{ width: 150 }} />
        </Form.Item>
        
        <Form.Item name="activityName" label="活动名称">
          <Input placeholder="请输入活动名称" style={{ width: 180 }} />
        </Form.Item>
        
        <Form.Item name="status" label="活动状态">
          <Select placeholder="请选择活动状态" style={{ width: 120 }} allowClear>
            <Option value="未开始">未开始</Option>
            <Option value="进行中">进行中</Option>
            <Option value="已结束">已结束</Option>
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button onClick={handleActivityReset} icon={<ReloadOutlined />}>
              重置
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddActivity}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              创建活动
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );

  // 积分商城规则配置区域
  const renderRulesConfig = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 积分使用限制配置 */}
      <Card title="积分使用限制配置" className="rules-config-card">
        <Form
          form={rulesForm}
          layout="vertical"
          initialValues={rulesData}
          onFinish={handleRulesSave}
        >
          <Row gutter={24}>
            <Col span={24}>
              <div style={{ 
                background: '#f6f8fa', 
                padding: '16px', 
                borderRadius: '6px', 
                marginBottom: '24px',
                border: '1px solid #e1e4e8'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#24292e' }}>积分使用规则说明</h4>
                <p style={{ margin: '0 0 8px 0', color: '#586069' }}>
                  • 通过设置积分使用上限，可以控制用户在单次兑换中使用的积分数量
                </p>
                <p style={{ margin: '0 0 8px 0', color: '#586069' }}>
                  • 当用户使用的积分超过设定上限时，系统将提示无法兑换
                </p>
                <p style={{ margin: '0', color: '#586069' }}>
                  • 此规则适用于所有积分商城的商品兑换
                </p>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="isPointsLimitEnabled"
                label="启用积分使用限制"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                  onChange={(checked) => {
                    setRulesData({ ...rulesData, isPointsLimitEnabled: checked });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.isPointsLimitEnabled !== currentValues.isPointsLimitEnabled
            }
          >
            {({ getFieldValue }) => {
              const isEnabled = getFieldValue('isPointsLimitEnabled');
              
              return isEnabled ? (
                <>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="pointsUsageLimit"
                        label="每日积分使用上限"
                        rules={[
                          { required: true, message: '请输入每日积分使用上限' },
                          { type: 'number', min: 1, message: '积分上限必须大于0' }
                        ]}
                      >
                        <InputNumber
                          placeholder="请输入积分使用上限"
                          min={1}
                          style={{ width: '100%' }}
                          addonAfter="积分"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="maxPointsPerOrder"
                        label="每单最大积分使用量"
                        rules={[
                          { required: true, message: '请输入每单最大积分使用量' },
                          { type: 'number', min: 1, message: '每单积分使用量必须大于0' }
                        ]}
                      >
                        <InputNumber
                          placeholder="请输入每单最大积分使用量"
                          min={1}
                          style={{ width: '100%' }}
                          addonAfter="积分"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="规则描述"
                        rules={[{ required: true, message: '请输入规则描述' }]}
                      >
                        <TextArea
                          placeholder="请输入规则描述，例如：每个用户每单只能使用300积分，超过300积分就无法兑换"
                          rows={3}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                <div style={{ 
                  background: '#f5f5f5', 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#999',
                  borderRadius: '6px'
                }}>
                  积分使用限制已禁用，用户可以不受限制地使用积分进行兑换
                </div>
              );
            }}
          </Form.Item>

          <Row gutter={24}>
            <Col span={24}>
              <div className="form-actions" style={{ textAlign: 'right', marginTop: '24px' }}>
                <Space>
                  <Button 
                    onClick={handleRulesReset}
                    style={{ borderRadius: '2px' }}
                  >
                    重置
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    style={{ borderRadius: '2px' }}
                  >
                    保存规则
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>

        {/* 当前规则预览 */}
        <Divider>当前生效规则</Divider>
        <div style={{ 
          background: '#fff7e6', 
          border: '1px solid #ffd591', 
          borderRadius: '6px', 
          padding: '16px' 
        }}>
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                  {rulesData.isPointsLimitEnabled ? rulesData.pointsUsageLimit : '无限制'}
                </div>
                <div style={{ color: '#8c8c8c', marginTop: '4px' }}>积分使用上限</div>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                  {rulesData.isPointsLimitEnabled ? rulesData.maxPointsPerOrder : '无限制'}
                </div>
                <div style={{ color: '#8c8c8c', marginTop: '4px' }}>每单最大积分</div>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: rulesData.isPointsLimitEnabled ? '#52c41a' : '#999' 
                }}>
                  {rulesData.isPointsLimitEnabled ? '已启用' : '已禁用'}
                </div>
                <div style={{ color: '#8c8c8c', marginTop: '4px' }}>规则状态</div>
              </div>
            </Col>
          </Row>
          {rulesData.isPointsLimitEnabled && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#fff', 
              borderRadius: '4px',
              border: '1px solid #f0f0f0'
            }}>
              <strong>规则说明：</strong>{rulesData.description}
            </div>
          )}
        </div>
      </Card>

      {/* 积分规则文档管理 */}
      <Card title="积分规则文档管理" className="rules-doc-card">
        <Row gutter={24}>
          <Col span={24}>
            <div style={{ 
              background: '#f6f8fa', 
              padding: '16px', 
              borderRadius: '6px', 
              marginBottom: '24px',
              border: '1px solid #e1e4e8'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#24292e' }}>积分规则文档说明</h4>
              <p style={{ margin: '0 0 8px 0', color: '#586069' }}>
                • 上传详细的积分规则文档，供用户查看和下载
              </p>
              <p style={{ margin: '0 0 8px 0', color: '#586069' }}>
                • 支持HTML、TXT格式，文件大小不超过1MB
              </p>
              <p style={{ margin: '0', color: '#586069' }}>
                • 文档更新后会自动替换原有文档
              </p>
            </div>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ marginBottom: '12px' }}>当前积分规则文档</h4>
              {rulesData.pointsRulesDoc.fileName ? (
                <div style={{ 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '6px', 
                  padding: '12px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {rulesData.pointsRulesDoc.fileName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        上传时间: {rulesData.pointsRulesDoc.uploadTime}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        文件大小: {formatFileSize(rulesData.pointsRulesDoc.fileSize)}
                      </div>
                    </div>
                    <Space>
                      <Button 
                        size="small" 
                        icon={<DownloadOutlined />}
                        onClick={() => handleFileDownload(rulesData.pointsRulesDoc.fileUrl, rulesData.pointsRulesDoc.fileName)}
                      >
                        下载
                      </Button>
                      <Button 
                        size="small" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleFileDelete('rules')}
                      >
                        删除
                      </Button>
                    </Space>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  border: '1px dashed #d9d9d9', 
                  borderRadius: '6px', 
                  padding: '20px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  暂未上传积分规则文档
                </div>
              )}
              
              <Upload
                beforeUpload={(file) => handleFileUpload(file, 'rules')}
                showUploadList={false}
                style={{ marginTop: '12px' }}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploadingRules}
                  style={{ borderRadius: '2px' }}
                >
                  {uploadingRules ? '上传中...' : '上传积分规则文档'}
                </Button>
              </Upload>
            </div>
          </Col>

          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ marginBottom: '12px' }}>当前用户须知文档</h4>
              {rulesData.userGuideDoc.fileName ? (
                <div style={{ 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '6px', 
                  padding: '12px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {rulesData.userGuideDoc.fileName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        上传时间: {rulesData.userGuideDoc.uploadTime}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        文件大小: {formatFileSize(rulesData.userGuideDoc.fileSize)}
                      </div>
                    </div>
                    <Space>
                      <Button 
                        size="small" 
                        icon={<DownloadOutlined />}
                        onClick={() => handleFileDownload(rulesData.userGuideDoc.fileUrl, rulesData.userGuideDoc.fileName)}
                      >
                        下载
                      </Button>
                      <Button 
                        size="small" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleFileDelete('guide')}
                      >
                        删除
                      </Button>
                    </Space>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  border: '1px dashed #d9d9d9', 
                  borderRadius: '6px', 
                  padding: '20px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  暂未上传用户须知文档
                </div>
              )}
              
              <Upload
                beforeUpload={(file) => handleFileUpload(file, 'guide')}
                showUploadList={false}
                style={{ marginTop: '12px' }}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploadingGuide}
                  style={{ borderRadius: '2px' }}
                >
                  {uploadingGuide ? '上传中...' : '上传用户须知文档'}
                </Button>
              </Upload>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  return (
    <div className="points-mall-container">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="points-mall-tabs">
          <TabPane tab="Banner管理" key="banner">
            {renderBannerFilter()}
            
            <Card title="积分商城Banner管理" className="table-card">
              <Table
                columns={bannerColumns}
                dataSource={bannerDataSource}
                loading={bannerLoading}
                pagination={bannerPagination}
                onChange={setBannerPagination}
                rowKey="id"
                scroll={{ x: 1200 }}
                size="middle"
              />
            </Card>
          </TabPane>
          
          <TabPane tab="商品管理" key="products">
            {renderProductFilter()}
            
            <Card title="积分商城商品管理" className="table-card">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={setPagination}
          rowKey="id"
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
          </TabPane>
          
          <TabPane tab="分类管理" key="categories">
            {renderCategoryFilter()}
            
            <Card title="积分商城分类管理" className="table-card">
              <Table
                columns={categoryColumns}
                dataSource={categoryDataSource}
                loading={categoryLoading}
                pagination={categoryPagination}
                onChange={setCategoryPagination}
                rowKey="id"
                scroll={{ x: 1200 }}
                size="middle"
              />
            </Card>
          </TabPane>
          
          <TabPane tab="活动配置" key="activities">
            {renderActivityFilter()}
            
            <Card title="积分商城活动配置" className="table-card">
              <Table
                columns={activityColumns}
                dataSource={activityDataSource}
                loading={activityLoading}
                pagination={activityPagination}
                onChange={setActivityPagination}
                rowKey="id"
                scroll={{ x: 1600 }}
                size="middle"
              />
            </Card>
          </TabPane>
          
          <TabPane tab="商城订单" key="orders">
            {renderOrderFilter()}
            
            <Card title="积分商城订单管理" className="table-card">
              <Table
                columns={orderColumns}
                dataSource={orderDataSource}
                loading={orderLoading}
                pagination={orderPagination}
                onChange={setOrderPagination}
                rowKey="id"
                scroll={{ x: 1800 }}
                size="middle"
              />
            </Card>
          </TabPane>

          <TabPane tab="积分商城规则" key="rules">
            {renderRulesConfig()}
          </TabPane>
        </Tabs>
      </Card>

      {/* Banner编辑弹窗 */}
      <Modal
        title={editingBanner ? '编辑Banner' : '新增Banner'}
        open={bannerModalVisible}
        onOk={handleBannerModalOk}
        onCancel={() => setBannerModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={bannerModalForm}
          layout="vertical"
          initialValues={{
            status: true,
            sort: 1,
            linkType: 'page'
          }}
        >
          <Form.Item
            name="title"
            label="Banner标题"
            rules={[{ required: true, message: '请输入Banner标题' }]}
          >
            <Input placeholder="请输入Banner标题" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Banner图片"
            rules={[{ required: true, message: '请上传Banner图片' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={(file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('只能上传 JPG/PNG 格式的图片!');
                  return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('图片大小不能超过 2MB!');
                  return false;
                }
                return true;
              }}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  (图片大小不超过2MB)
                </div>
              </div>
            </Upload>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="linkType"
                label="跳转类型"
                rules={[{ required: true, message: '请选择跳转类型' }]}
              >
                <Select placeholder="请选择跳转类型">
                  <Option value="page">页面链接</Option>
                  <Option value="product">商品链接</Option>
                  <Option value="external">外部链接</Option>
                  <Option value="none">不跳转</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="linkUrl"
                label="跳转链接"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('linkType') !== 'none' && !value) {
                        return Promise.reject(new Error('请输入跳转链接'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="请输入跳转链接" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="linkText"
            label="链接描述"
          >
            <Input placeholder="请输入链接描述，便于识别" />
          </Form.Item>

                     <Row gutter={16}>
             <Col span={12}>
               <Form.Item
                 name="startTime"
                 label="开始时间"
                 rules={[{ required: true, message: '请选择开始时间' }]}
               >
                 <DatePicker 
                   style={{ width: '100%' }}
                   showTime
                   format="YYYY-MM-DD HH:mm:ss"
                   placeholder="请选择开始时间"
                 />
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item
                 name="endTime"
                 label="结束时间"
                 rules={[{ required: true, message: '请选择结束时间' }]}
               >
                 <DatePicker 
                   style={{ width: '100%' }}
                   showTime
                   format="YYYY-MM-DD HH:mm:ss"
                   placeholder="请选择结束时间"
                 />
               </Form.Item>
             </Col>
           </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sort" label="排序">
                <InputNumber
                  placeholder="请输入排序号"
                  min={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" valuePropName="checked">
                <Switch
                  checkedChildren="已上线"
                  unCheckedChildren="已下线"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 商品编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={1000}
        destroyOnClose
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={{
            status: 'active',
            displayOrder: 1,
            safetyStock: 0,
            supportPaymentMethod: 'points',
            promotionTags: [],
            availableStations: [],
            purchaseLimit: 0,
            deliveryMethod: '京东物流',
          }}
        >
          {/* 基本信息区域 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="productCode"
                label="商品编号"
                rules={[{ required: true, message: '请输入商品编号' }]}
              >
                <Input 
                  placeholder="PSG开头的商品编号" 
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && !value.startsWith('PSG')) {
                      modalForm.setFieldsValue({ productCode: 'PSG' + value.replace(/^PSG/, '') });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="商品类别"
                rules={[{ required: true, message: '请选择商品类别' }]}
              >
                <Select 
                  placeholder="请选择商品类别"
                  onChange={(value) => {
                    // 当选择京东商品时，自动设置支付方式为积分支付
                    if (value === 4) {
                      modalForm.setFieldsValue({ supportPaymentMethod: 'points' });
                    }
                  }}
                >
                  <Option value={1}>汽车服务</Option>
                  <Option value={2}>生活服务</Option>
                  <Option value={3}>日用百货</Option>
                  <Option value={4}>京东商品</Option>
                  <Option value={5}>代金券</Option>
                  <Option value={6}>数码电器</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                shouldUpdate={(prevValues, currentValues) => 
                  prevValues.categoryId !== currentValues.categoryId
                }
              >
                {({ getFieldValue }) => {
                  const categoryId = getFieldValue('categoryId');
                  const isJdProduct = categoryId === 4;
                  
                  return (
                    <Form.Item
                      name="supportPaymentMethod"
                      label="支付方式"
                      rules={[{ required: true, message: '请选择支付方式' }]}
                    >
                      <Select 
                        placeholder="请选择支付方式"
                        disabled={isJdProduct}
                      >
                        <Option value="points">积分支付</Option>
                        {!isJdProduct && <Option value="pointsWithWechat">积分+微信组合</Option>}
                        {!isJdProduct && <Option value="wechat">微信支付</Option>}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          {/* 京东商品特殊字段 */}
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.categoryId !== currentValues.categoryId
            }
          >
            {({ getFieldValue }) => {
              const categoryId = getFieldValue('categoryId');
              const isJdProduct = categoryId === 4;
              
              if (isJdProduct) {
                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="jdProductId"
                        label="京东商品ID"
                        rules={[{ required: true, message: '请输入京东商品ID' }]}
                      >
                        <Input placeholder="请输入京东商品ID" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="jdProductUrl"
                        label="京东商品链接"
                        rules={[
                          { required: true, message: '请输入京东商品链接' },
                          { type: 'url', message: '请输入正确的链接格式' }
                        ]}
                      >
                        <Input placeholder="请输入京东商品链接" />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              return null;
            }}
          </Form.Item>

          {/* 价格配置区域 */}
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.supportPaymentMethod !== currentValues.supportPaymentMethod
            }
          >
            {({ getFieldValue }) => {
              const paymentMethod = getFieldValue('supportPaymentMethod');
              
              if (paymentMethod === 'points') {
                return (
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="originalPrice"
                        label="原价（零管系统价格）"
                        rules={[{ required: true, message: '请输入原价' }]}
                      >
                        <InputNumber
                          placeholder="零管系统价格，不可修改"
                          min={0}
                          precision={2}
                          style={{ width: '100%' }}
                          addonBefore="￥"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="mallPrice"
                        label="积分价格"
                        rules={[{ required: true, message: '请输入积分价格' }]}
                      >
                        <InputNumber
                          placeholder="积分数量"
                          min={1}
                          style={{ width: '100%' }}
                          addonAfter="积分"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              
              if (paymentMethod === 'wechat') {
                return (
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="originalPrice"
                        label="原价（零管系统价格）"
                        rules={[{ required: true, message: '请输入原价' }]}
                      >
                        <InputNumber
                          placeholder="零管系统价格，不可修改"
                          min={0}
                          precision={2}
                          style={{ width: '100%' }}
                          addonBefore="￥"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="mallPrice"
                        label="微信价格"
                        rules={[{ required: true, message: '请输入微信价格' }]}
                      >
                        <InputNumber
                          placeholder="微信支付金额"
                          min={0}
                          precision={2}
                          style={{ width: '100%' }}
                          addonBefore="￥"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              
              if (paymentMethod === 'pointsWithWechat') {
                return (
                  <>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name="originalPrice"
                          label="原价（零管系统价格）"
                          rules={[{ required: true, message: '请输入原价' }]}
                        >
                          <InputNumber
                            placeholder="零管系统价格，不可修改"
                            min={0}
                            precision={2}
                            style={{ width: '100%' }}
                            addonBefore="￥"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name={['mallPrice', 'points']}
                          label="积分"
                          rules={[{ required: true, message: '请输入积分数量' }]}
                        >
                          <InputNumber
                            placeholder="积分数量"
                            min={0}
                            style={{ width: '100%' }}
                            addonAfter="积分"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['mallPrice', 'wechat']}
                          label="微信支付"
                          rules={[{ required: true, message: '请输入微信支付金额' }]}
                        >
                          <InputNumber
                            placeholder="微信支付金额"
                            min={0}
                            precision={2}
                            style={{ width: '100%' }}
                            addonBefore="￥"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                );
              }
              
              return (
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="originalPrice"
                      label="原价（零管系统价格）"
                      rules={[{ required: true, message: '请输入原价' }]}
                    >
                      <InputNumber
                        placeholder="零管系统价格，不可修改"
                        min={0}
                        precision={2}
                        style={{ width: '100%' }}
                        addonBefore="￥"
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              );
            }}
          </Form.Item>



          {/* 商品顺序 - 单独一行 */}
          <Form.Item name="displayOrder" label="商品顺序">
            <InputNumber
              placeholder="请输入排序号"
              min={1}
              style={{ width: '20%' }}
            />
          </Form.Item>

          {/* 安全库存 - 单独一行 */}
          <Form.Item name="safetyStock" label="安全库存">
            <InputNumber
              placeholder="安全库存数量"
              min={0}
              style={{ width: '20%' }}
            />
          </Form.Item>

       
          {/* 商品状态 - 单独一行 */}
          <Form.Item name="status" label="商品状态" style={{ width: '100%' }}>
            <Select placeholder="请选择商品状态" style={{ width: '20%' }}>
              <Option value="active">已上架</Option>
              <Option value="scheduled">定时上架</Option>
              <Option value="inactive">已下架</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="autoOnlineTime"
                label="自动上架时间"
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择自动上架时间"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="autoOfflineTime"
                label="自动下架时间"
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择自动下架时间"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 自提油站选择 - 京东商品不显示 */}
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.categoryId !== currentValues.categoryId
            }
          >
            {({ getFieldValue }) => {
              const categoryId = getFieldValue('categoryId');
              const isJdProduct = categoryId === 4;
              
              if (isJdProduct) {
                return (
                  <Form.Item
                    name="deliveryMethod"
                    label="配送方式"
                    initialValue="京东物流"
                  >
                    <Input 
                      value="京东物流" 
                      disabled 
                      style={{ width: '200px' }}
                    />
                  </Form.Item>
                );
              }
              
              return (
                <Form.Item
                  name="availableStations"
                  label="支持自提的油站"
                  rules={[{ required: true, message: '请选择支持自提的油站' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择支持自提的油站"
                    style={{ width: '100%' }}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="ST001">南昌高速服务区加油站</Option>
                    <Option value="ST002">上饶高速服务区加油站</Option>
                    <Option value="ST003">赣州高速服务区加油站</Option>
                    <Option value="ST004">九江高速服务区加油站</Option>
                    <Option value="ST005">南昌市区加油站</Option>
                    <Option value="ST006">上饶市区加油站</Option>
                    <Option value="ST007">赣州市区加油站</Option>
                    <Option value="ST008">九江市区加油站</Option>
                  </Select>
                </Form.Item>
              );
            }}
          </Form.Item>

          {/* 商品限购数量 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="purchaseLimit"
                label="商品限购数量"
                rules={[{ required: true, message: '请输入商品限购数量' }]}
                initialValue={0}
              >
                <InputNumber
                  placeholder="每个用户可购买的最大数量"
                  min={0}
                  style={{ width: '100%' }}
                  addonAfter="件"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                设置为0表示不限购，设置具体数量表示每个用户最多可购买的商品数量
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: '16px 0' }}>商品详细信息</Divider>

          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <TextArea
              placeholder="请输入商品描述"
              rows={4}
            />
          </Form.Item>

          <Form.Item name="images" label="商品图片（最多5张）">
            <Upload
              listType="picture-card"
              maxCount={5}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              multiple
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
                  {/* 促销标签 - 单独一行 */}
                  <Form.Item
            name="promotionTags"
            label="促销标签"
          >
            <CheckboxGroup
              options={[
                { label: '置顶', value: 'top' },
                { label: '热门', value: 'hot' },
                { label: '推荐', value: 'recommended' },
              ]}
            />
          </Form.Item>
      </Modal>

      {/* 分类编辑弹窗 */}
      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={categoryModalVisible}
        onOk={handleCategoryModalOk}
        onCancel={() => {
          setCategoryModalVisible(false);
          setSelectedMainCategory({
            level1: null,
            level2: null,
            level3: null
          });
        }}
        width={800}
        destroyOnClose
      >
        <Form
          form={categoryModalForm}
          layout="vertical"
          initialValues={{
            status: true,
            displayOrder: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryName"
                label="分类名称"
                rules={[{ required: true, message: '请输入分类名称' }]}
              >
                <Input placeholder="请输入分类名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryCode"
                label="分类编码"
                rules={[{ required: true, message: '请输入分类编码' }]}
              >
                <Input placeholder="请输入分类编码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level1Selection"
                label="主数据一级分类"
                rules={[{ required: true, message: '请选择一级分类' }]}
              >
                <TreeSelect
                  treeData={masterCategoryData}
                  placeholder="请选择一级分类"
                  treeDefaultExpandAll={false}
                  allowClear
                  onChange={(value, node) => {
                    if (node && node.children && node.children.length > 0) {
                      // 选择的是一级分类
                      categoryModalForm.setFieldsValue({
                        level1Code: value,
                        level1Name: node.title.split('-')[1],
                        level2Code: '',
                        level2Name: '',
                        level3Code: '',
                        level3Name: ''
                      });
                      setSelectedMainCategory({
                        level1: value,
                        level2: null,
                        level3: null
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level2Selection"
                label="主数据二级分类"
                rules={[{ required: true, message: '请选择二级分类' }]}
              >
                <TreeSelect
                  treeData={selectedMainCategory.level1 ? 
                    masterCategoryData.find(item => item.value === selectedMainCategory.level1)?.children || [] : []
                  }
                  placeholder="请先选择一级分类"
                  disabled={!selectedMainCategory.level1}
                  allowClear
                  onChange={(value, node) => {
                    if (node && node.children && node.children.length > 0) {
                      // 选择的是二级分类
                      categoryModalForm.setFieldsValue({
                        level2Code: value,
                        level2Name: node.title.split('-')[1],
                        level3Code: '',
                        level3Name: ''
                      });
                      setSelectedMainCategory({
                        ...selectedMainCategory,
                        level2: value,
                        level3: null
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level3Selection"
                label="主数据三级分类"
                rules={[{ required: true, message: '请选择三级分类' }]}
              >
                <TreeSelect
                  treeData={selectedMainCategory.level2 ? 
                    masterCategoryData.find(item => item.value === selectedMainCategory.level1)
                      ?.children?.find(item => item.value === selectedMainCategory.level2)?.children || [] : []
                  }
                  placeholder="请先选择二级分类"
                  disabled={!selectedMainCategory.level2}
                  allowClear
                  onChange={(value, node) => {
                    if (node) {
                      // 选择的是三级分类
                      categoryModalForm.setFieldsValue({
                        level3Code: value,
                        level3Name: node.title.split('-')[1]
                      });
                      setSelectedMainCategory({
                        ...selectedMainCategory,
                        level3: value
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="level1Code"
                label="一级分类编码"
              >
                <Input disabled placeholder="自动填充" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="level1Name"
                label="一级分类名称"
              >
                <Input disabled placeholder="自动填充" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="level2Code"
                label="二级分类编码"
              >
                <Input disabled placeholder="自动填充" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="level2Name"
                label="二级分类名称"
              >
                <Input disabled placeholder="自动填充" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="level3Code"
                label="三级分类编码"
              >
                <Input disabled placeholder="自动填充" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="level3Name"
                label="三级分类名称"
              >
                <Input disabled placeholder="自动填充" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="displayOrder" label="显示顺序">
                <InputNumber
                  placeholder="请输入显示顺序"
                  min={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" valuePropName="checked">
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 订单详情弹窗 */}
      <Modal
        title="订单详情"
        width={800}
        open={orderDetailVisible}
        onCancel={() => setOrderDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setOrderDetailVisible(false)}>
            关闭
          </Button>
        ]}
        destroyOnClose
      >
        {selectedOrder && (
          <div>
            <Descriptions title="基本信息" column={1} bordered>
              <Descriptions.Item label="订单号">{selectedOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="用户信息">
                {selectedOrder.userName} / {selectedOrder.fullPhone || selectedOrder.userPhone}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">{selectedOrder.orderTime}</Descriptions.Item>
              <Descriptions.Item label="支付时间">{selectedOrder.payTime || '未支付'}</Descriptions.Item>
              <Descriptions.Item label="配送方式">
                <Tag color={selectedOrder.deliveryMethod === 'jd_express' ? 'orange' : 'blue'}>
                  {selectedOrder.deliveryMethod === 'jd_express' ? '京东配送' : '油站自提'}
                </Tag>
              </Descriptions.Item>
              {selectedOrder.deliveryMethod === 'jd_express' ? (
                <>
                  <Descriptions.Item label="配送地址">{selectedOrder.deliveryAddress}</Descriptions.Item>
                  <Descriptions.Item label="配送时间">{selectedOrder.deliveryTime || '未配送'}</Descriptions.Item>
                  {/* 移除京东物流相关信息显示，因为系统无法获取京东物流状态 */}
                </>
              ) : (
                <>
                  <Descriptions.Item label="提货时间">{selectedOrder.pickupTime || '未提货'}</Descriptions.Item>
                  <Descriptions.Item label="自提站点">{selectedOrder.pickupStation}</Descriptions.Item>
                </>
              )}
            </Descriptions>

            <Divider />

            <Descriptions title="订单状态" column={1} bordered>
              <Descriptions.Item label="订单状态">
                <Badge 
                  status={selectedOrder.status === 'completed' ? 'success' : 
                         selectedOrder.status === 'pending_refund' ? 'warning' : 
                         selectedOrder.status === 'cancelled' ? 'error' : 'processing'} 
                  text={selectedOrder.statusText} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="支付方式">{selectedOrder.paymentMethodText}</Descriptions.Item>
              {selectedOrder.exceptionReason && (
                <Descriptions.Item label="异常原因">{selectedOrder.exceptionReason}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Descriptions title="费用明细" column={2} bordered>
              <Descriptions.Item label="订单总金额">￥{selectedOrder.totalAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="使用积分">{selectedOrder.pointsUsed}积分</Descriptions.Item>
              <Descriptions.Item label="现金支付">￥{selectedOrder.cashAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="微信支付">￥{selectedOrder.wechatAmount.toFixed(2)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <h4>商品明细</h4>
              {selectedOrder.products && selectedOrder.products.map((product, index) => (
                <Card key={index} size="small" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong>{product.productName}</strong>
                        {product.categoryId === 4 && (
                          <Tag color="orange" size="small">京东商品</Tag>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        数量：{product.quantity} | 积分：{product.points} | 原价：￥{product.originalPrice.toFixed(2)}
                      </div>
                      {product.categoryId === 4 && (
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                          <div>京东商品ID: {product.jdProductId}</div>
                          {product.jdProductUrl && (
                            <div>
                              商品链接: 
                              <a 
                                href={product.jdProductUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ marginLeft: '4px' }}
                              >
                                查看详情
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>实付：￥{product.actualPrice.toFixed(2)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedOrder.refundInfo && (
              <>
                <Divider />
                <Descriptions title="退款信息" column={1} bordered>
                  <Descriptions.Item label="退款原因">{selectedOrder.refundInfo.refundReason}</Descriptions.Item>
                  <Descriptions.Item label="退款金额">￥{selectedOrder.refundInfo.refundAmount.toFixed(2)}</Descriptions.Item>
                  <Descriptions.Item label="退款积分">{selectedOrder.refundInfo.refundPoints}积分</Descriptions.Item>
                  <Descriptions.Item label="申请时间">{selectedOrder.refundInfo.applyTime}</Descriptions.Item>
                  <Descriptions.Item label="审批状态">
                    <Badge 
                      status={selectedOrder.refundInfo.approvalStatus === 'approved' ? 'success' : 
                             selectedOrder.refundInfo.approvalStatus === 'pending' ? 'processing' : 'error'} 
                      text={selectedOrder.refundInfo.approvalStatus === 'approved' ? '已批准' :
                            selectedOrder.refundInfo.approvalStatus === 'pending' ? '待审批' : '已拒绝'} 
                    />
                  </Descriptions.Item>
                  {selectedOrder.refundInfo.approver && (
                    <Descriptions.Item label="审批人">{selectedOrder.refundInfo.approver}</Descriptions.Item>
                  )}
                  {selectedOrder.refundInfo.approvalTime && (
                    <Descriptions.Item label="审批时间">{selectedOrder.refundInfo.approvalTime}</Descriptions.Item>
                  )}
                  {selectedOrder.refundInfo.refundTime && (
                    <Descriptions.Item label="退款时间">{selectedOrder.refundInfo.refundTime}</Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 退款审批弹窗 */}
      <Modal
        title="退款审批"
        open={refundModalVisible}
        onCancel={() => setRefundModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRefundModalVisible(false)}>
            取消
          </Button>,
          <Button key="reject" danger onClick={handleRefundReject}>
            拒绝退款
          </Button>,
          <Button key="approve" type="primary" onClick={handleRefundApprove}>
            批准退款
          </Button>,
        ]}
        width={600}
        destroyOnClose
      >
        {selectedOrder && selectedOrder.refundInfo && (
          <div>
            <Descriptions title="订单信息" column={1} bordered>
              <Descriptions.Item label="订单号">{selectedOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="用户信息">
                {selectedOrder.userName} / {selectedOrder.userPhone}
              </Descriptions.Item>
              <Descriptions.Item label="订单金额">￥{selectedOrder.totalAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="使用积分">{selectedOrder.pointsUsed}积分</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="退款申请" column={1} bordered>
              <Descriptions.Item label="退款原因">{selectedOrder.refundInfo.refundReason}</Descriptions.Item>
              <Descriptions.Item label="申请退款金额">￥{selectedOrder.refundInfo.refundAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="申请退款积分">{selectedOrder.refundInfo.refundPoints}积分</Descriptions.Item>
              <Descriptions.Item label="申请时间">{selectedOrder.refundInfo.applyTime}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <p><strong>审批说明：</strong></p>
              <p>请仔细核查订单信息和退款原因，确认无误后进行审批操作。</p>
              <p>批准退款后，系统将自动处理退款到用户账户。</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 库存查看弹窗 */}
      <Modal
        title="商品库存详情"
        width={800}
        open={stockModalVisible}
        onCancel={() => setStockModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setStockModalVisible(false)}>
            关闭
          </Button>
        ]}
        destroyOnClose
      >
        {selectedProduct && (
          <div>
            <Descriptions title="商品基本信息" column={2} bordered>
              <Descriptions.Item label="商品名称">{selectedProduct.name}</Descriptions.Item>
              <Descriptions.Item label="商品分类">{selectedProduct.categoryName}</Descriptions.Item>
              <Descriptions.Item label="总库存">{selectedProduct.totalStock}</Descriptions.Item>
              <Descriptions.Item label="安全库存">{selectedProduct.safetyStock}</Descriptions.Item>
              <Descriptions.Item label="自动上架时间">{selectedProduct.autoOnlineTime}</Descriptions.Item>
              <Descriptions.Item label="自动下架时间">{selectedProduct.autoOfflineTime}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <h4>各站点库存情况</h4>
            </div>
            <Table
              dataSource={selectedProduct.stationStocks}
              pagination={false}
              size="small"
              rowKey="stationCode"
              columns={[
                {
                  title: '站点代码',
                  dataIndex: 'stationCode',
                  width: 100,
                },
                {
                  title: '站点名称',
                  dataIndex: 'stationName',
                  width: 200,
                },
                {
                  title: '实时库存',
                  dataIndex: 'realTimeStock',
                  width: 100,
                  render: (value) => (
                    <span style={{ color: value > 30 ? '#52c41a' : value > 10 ? '#faad14' : '#ff4d4f' }}>
                      {value}
                    </span>
                  ),
                },
                {
                  title: '安全库存',
                  dataIndex: 'safetyStock',
                  width: 100,
                },
                {
                  title: '可售库存',
                  dataIndex: 'availableStock',
                  width: 100,
                  render: (value) => (
                    <span style={{ color: value > 20 ? '#52c41a' : value > 5 ? '#faad14' : '#ff4d4f' }}>
                      {value}
                    </span>
                  ),
                },
                {
                  title: '库存状态',
                  width: 100,
                  render: (_, record) => {
                    if (record.realTimeStock <= record.safetyStock) {
                      return <Tag color="red">库存不足</Tag>;
                    } else if (record.realTimeStock <= record.safetyStock * 2) {
                      return <Tag color="orange">库存偏低</Tag>;
                    } else {
                      return <Tag color="green">库存正常</Tag>;
                    }
                  },
                }
              ]}
            />

            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <p><strong>库存说明：</strong></p>
              <p>• 实时库存：当前站点实际库存数量</p>
              <p>• 安全库存：保证正常供应的最低库存量</p>
              <p>• 可售库存：扣除安全库存后的可对外销售库存</p>
              <p>• 当实时库存低于安全库存时，系统会自动下架该商品</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 活动配置编辑弹窗 */}
      <Modal
        title={editingActivity ? '编辑活动' : '新增活动'}
        open={activityModalVisible}
        onOk={handleActivityModalOk}
        onCancel={() => setActivityModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={activityModalForm}
          layout="vertical"
          initialValues={{
            status: '未开始'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="activityId"
                label="活动ID"
                rules={[{ required: true, message: '请输入活动ID' }]}
              >
                <Input placeholder="请输入活动ID，如：ACT202401001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="activityName"
                label="活动名称"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input placeholder="请输入活动名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="活动开始时间"
                rules={[{ required: true, message: '请选择活动开始时间' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择活动开始时间"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="活动结束时间"
                rules={[{ required: true, message: '请选择活动结束时间' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择活动结束时间"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="applicableStations"
            label="活动适用油站清单"
            rules={[{ required: true, message: '请选择适用油站' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择适用油站"
              style={{ width: '100%' }}
              maxTagCount="responsive"
            >
              <Option value="赣中分公司-服务区A-油站A1">赣中分公司-服务区A-油站A1</Option>
              <Option value="赣中分公司-服务区A-油站A2">赣中分公司-服务区A-油站A2</Option>
              <Option value="赣东北分公司-服务区A-油站A1">赣东北分公司-服务区A-油站A1</Option>
              <Option value="赣东分公司-服务区A-油站A1">赣东分公司-服务区A-油站A1</Option>
              <Option value="赣东分公司-服务区B-油站B1">赣东分公司-服务区B-油站B1</Option>
              <Option value="赣南分公司-服务区A-油站A1">赣南分公司-服务区A-油站A1</Option>
              <Option value="赣南分公司-服务区A-油站A2">赣南分公司-服务区A-油站A2</Option>
              <Option value="赣西南分公司-服务区A-油站A1">赣西南分公司-服务区A-油站A1</Option>
              <Option value="赣西分公司-服务区A-油站A1">赣西分公司-服务区A-油站A1</Option>
              <Option value="赣西分公司-服务区B-油站B1">赣西分公司-服务区B-油站B1</Option>
              <Option value="赣西北分公司-服务区A-油站A1">赣西北分公司-服务区A-油站A1</Option>
              <Option value="赣东南分公司-服务区A-油站A1">赣东南分公司-服务区A-油站A1</Option>
              <Option value="赣东南分公司-服务区A-油站A2">赣东南分公司-服务区A-油站A2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: '请输入活动描述' }]}
          >
            <TextArea
              placeholder="请输入活动描述，如：春节期间积分商城全场9折，满1000积分再减100积分"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="rules"
            label="活动规则"
            rules={[{ required: true, message: '请输入活动规则' }]}
          >
            <TextArea
              placeholder="请输入详细的活动规则，每条规则占一行"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="posterImage"
            label="活动海报图片"
            rules={[{ required: true, message: '请上传活动海报图片' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={(file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('只能上传 JPG/PNG 格式的图片!');
                  return false;
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('图片大小不能超过 5MB!');
                  return false;
                }
                return true;
              }}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传海报</div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  (建议尺寸：750x400px，不超过5MB)
                </div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="productJumpLink"
            label="参与活动商品跳转链接"
            rules={[{ required: true, message: '请输入商品跳转链接' }]}
          >
            <Input placeholder="请输入商品跳转链接，如：/points/mall?activity=spring2024" />
          </Form.Item>

          <div style={{ 
            background: '#f6f8fa', 
            padding: '12px', 
            borderRadius: '6px', 
            marginTop: '16px',
            border: '1px solid #e1e4e8'
          }}>
            <p style={{ margin: '0', color: '#586069', fontSize: '13px' }}>
              <strong>说明：</strong>H5活动页面链接将根据活动ID自动生成，格式为：https://activity.example.com/[活动ID小写]
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsMall; 