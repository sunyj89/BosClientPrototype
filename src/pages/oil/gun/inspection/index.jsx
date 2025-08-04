import React, { useState, useEffect } from 'react';
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
  Tag, 
  Divider, 
  Row, 
  Col, 
  Tabs,
  TreeSelect,
  Drawer,
  Descriptions,
  Radio,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  FileTextOutlined, 
  ReloadOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import orgDataJson from '../../../../mock/station/orgData.json';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

// 模拟油枪数据
const guns = [
  { id: 'G001', name: '1号油枪', tankName: '1号油罐', oilType: '92#汽油', position: 'A1', station: '南昌服务区加油站1', company: '赣中分公司', brand: '正星科技' },
  { id: 'G002', name: '2号油枪', tankName: '1号油罐', oilType: '92#汽油', position: 'A2', station: '南昌服务区加油站1', company: '赣中分公司', brand: '正星科技' },
  { id: 'G003', name: '3号油枪', tankName: '2号油罐', oilType: '95#汽油', position: 'B1', station: '上饶服务区加油站1', company: '赣东北分公司', brand: '托肯' },
  { id: 'G004', name: '4号油枪', tankName: '2号油罐', oilType: '95#汽油', position: 'B2', station: '上饶服务区加油站1', company: '赣东北分公司', brand: '托肯' },
  { id: 'G005', name: '5号油枪', tankName: '3号油罐', oilType: '0#柴油', position: 'C1', station: '鹰潭服务区加油站1', company: '赣东分公司', brand: '吉尔巴克' },
  { id: 'G006', name: '6号油枪', tankName: '4号油罐', oilType: '0#柴油', position: 'C2', station: '鹰潭服务区加油站1', company: '赣东分公司', brand: '吉尔巴克' },
  { id: 'G007', name: '7号油枪', tankName: '5号油罐', oilType: '98#汽油', position: 'D1', station: '赣州服务区加油站1', company: '赣东南分公司', brand: '托肯' },
];

// 模拟检查项目
const inspectionItems = [
  { id: 'I001', name: '油枪外观检查', description: '检查油枪外观是否有损坏、变形等问题' },
  { id: 'I002', name: '油枪密封性检查', description: '检查油枪是否有漏油现象' },
  { id: 'I003', name: '油枪计量精度检查', description: '检查油枪计量是否准确' },
  { id: 'I004', name: '油枪自动跳枪功能检查', description: '检查油枪自动跳枪功能是否正常' },
  { id: 'I005', name: '油枪流量检查', description: '检查油枪流量是否符合标准' },
  { id: 'I006', name: '油枪管线检查', description: '检查油枪管线是否有老化、破损等问题' },
];

// 模拟检查记录数据
const initialInspections = [
  {
    id: 'INS20230401001',
    gunId: 'G001',
    gunName: '1号油枪',
    inspectionDate: '2023-04-01',
    inspector: '张三',
    result: '合格',
    issues: '',
    remarks: '正常使用',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '南昌服务区加油站1',
    company: '赣中分公司',
    brand: '正星科技'
  },
  {
    id: 'INS20230401002',
    gunId: 'G002',
    gunName: '2号油枪',
    inspectionDate: '2023-04-01',
    inspector: '张三',
    result: '合格',
    issues: '',
    remarks: '正常使用',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '南昌服务区加油站1',
    company: '赣中分公司',
    brand: '正星科技'
  },
  {
    id: 'INS20230415001',
    gunId: 'G003',
    gunName: '3号油枪',
    inspectionDate: '2023-04-15',
    inspector: '李四',
    result: '不合格',
    issues: '油枪密封性不合格，存在漏油现象',
    remarks: '需要维修',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '不合格', remarks: '存在漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '上饶服务区加油站1',
    company: '赣东北分公司',
    brand: '托肯'
  },
  {
    id: 'INS20230415002',
    gunId: 'G004',
    gunName: '4号油枪',
    inspectionDate: '2023-04-15',
    inspector: '李四',
    result: '合格',
    issues: '',
    remarks: '正常使用',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '上饶服务区加油站1',
    company: '赣东北分公司',
    brand: '托肯'
  },
  {
    id: 'INS20230501001',
    gunId: 'G005',
    gunName: '5号油枪',
    inspectionDate: '2023-05-01',
    inspector: '王五',
    result: '不合格',
    issues: '油枪流量不合格，流量过低',
    remarks: '需要维修',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '不合格', remarks: '流量过低' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '鹰潭服务区加油站1',
    company: '赣东分公司',
    brand: '吉尔巴克'
  },
];

// 将组织数据转换为TreeSelect需要的格式
const transformOrgData = (orgData) => {
  if (!orgData || !Array.isArray(orgData) || orgData.length === 0) {
    return [];
  }

  // 递归转换组织数据
  const transformNode = (node) => {
    return {
      title: node.name,
      value: node.id,
      key: node.id,
      selectable: true,
      isLeaf: node.type === 'station',
      children: node.children ? node.children.map(child => transformNode(child)) : []
    };
  };

  // 转换顶级组织数据
  return orgData.map(org => transformNode(org));
};

const treeData = transformOrgData(orgDataJson);

const GunInspection = () => {
  const [inspections, setInspections] = useState(initialInspections);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [isApprovalDrawerVisible, setIsApprovalDrawerVisible] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [form] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [filteredInspections, setFilteredInspections] = useState(initialInspections);
  const [itemResults, setItemResults] = useState({});
  const [activeTab, setActiveTab] = useState('inspection');
  const [orgSelectedValues, setOrgSelectedValues] = useState([]);
  const [filterForm] = Form.useForm();
  const [approvalData, setApprovalData] = useState([
    {
      key: '1',
      id: 'GUN-INS-20230501001',
      title: '1号油枪自检审批',
      applicant: '张三',
      applyDate: '2023-05-01',
      status: '待审批',
      urgency: '普通',
      department: '运营部',
      content: '1号油枪自检发现外观良好，密封性正常，计量精度、自动跳枪功能、流量和管线都符合要求，检查结果合格。',
      stationId: 'ST001',
      gunId: 'G001',
      station: '南昌服务区加油站1',
      company: '赣中分公司'
    },
    {
      key: '2',
      id: 'GUN-INS-20230502002',
      title: '2号油枪自检审批',
      applicant: '李四',
      applyDate: '2023-05-02',
      status: '待审批',
      urgency: '紧急',
      department: '运营部',
      content: '2号油枪自检发现外观良好，密封性正常，计量精度、自动跳枪功能、流量和管线都符合要求，检查结果合格。',
      stationId: 'ST001',
      gunId: 'G002',
      station: '南昌服务区加油站1',
      company: '赣中分公司'
    },
    {
      key: '3',
      id: 'GUN-INS-20230410003',
      title: '3号油枪自检审批',
      applicant: '王五',
      applyDate: '2023-04-10',
      status: '已完成',
      approver: '赵总监',
      approveDate: '2023-04-11',
      urgency: '普通',
      department: '运营部',
      content: '3号油枪自检发现外观良好，密封性正常，计量精度、自动跳枪功能、流量和管线都符合要求，检查结果合格。',
      stationId: 'ST003',
      gunId: 'G003',
      station: '上饶服务区加油站1',
      company: '赣东北分公司',
      approvalResult: '通过',
      approvalOpinion: '检查项目合格，同意通过'
    }
  ]);

  useEffect(() => {
    let filtered = inspections;

    // 按文本搜索
    if (searchText) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.gunName.toLowerCase().includes(searchText.toLowerCase()) ||
          inspection.inspector.toLowerCase().includes(searchText.toLowerCase()) ||
          inspection.result.toLowerCase().includes(searchText.toLowerCase()) ||
          inspection.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 按日期范围过滤
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      filtered = filtered.filter(
        (inspection) => inspection.inspectionDate >= startDate && inspection.inspectionDate <= endDate
      );
    }

    // 按组织筛选
    if (orgSelectedValues && orgSelectedValues.length > 0) {
      // 在这里，我们假设每个inspection记录中有一个station字段表示所属加油站
      // 实际实现时需要根据具体数据结构调整
      filtered = filtered.filter(inspection => {
        // 如果选择了总公司，不需要筛选
        if (orgSelectedValues.includes('HQ001')) {
          return true;
        }
        // 根据选择的分公司或油站筛选
        // 由于示例数据中没有明确的分公司ID关联，这里仅作示例
        return orgSelectedValues.some(value => {
          // 检查是否选择了分公司
          const branch = orgDataJson.branches.find(b => b.id === value);
          if (branch) {
            // 如果选择了分公司，检查是否包含当前油站
            return branch.stations.some(s => s.name === inspection.station);
          }
          // 检查是否直接选择了油站
          return value === inspection.station;
        });
      });
    }

    setFilteredInspections(filtered);
  }, [searchText, dateRange, orgSelectedValues, inspections]);

  const showAddModal = () => {
    form.resetFields();
    // 初始化检查项目结果
    const initialItemResults = {};
    inspectionItems.forEach(item => {
      initialItemResults[item.id] = {
        result: '合格',
        remarks: ''
      };
    });
    setItemResults(initialItemResults);
    setIsModalVisible(true);
  };

  const showDetailModal = (record) => {
    setSelectedInspection(record);
    setIsDetailDrawerVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDetailCancel = () => {
    setIsDetailDrawerVisible(false);
  };

  const handleItemResultChange = (itemId, field, value) => {
    setItemResults(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      setTimeout(() => {
        // 获取选中油枪的信息
        const selectedGun = guns.find(gun => gun.id === values.gunId);
        
        // 构建检查项目数据
        const items = inspectionItems.map(item => ({
          itemId: item.id,
          itemName: item.name,
          result: itemResults[item.id].result,
          remarks: itemResults[item.id].remarks
        }));
        
        // 判断整体结果
        const hasFailedItem = items.some(item => item.result === '不合格');
        const overallResult = hasFailedItem ? '不合格' : '合格';
        
        // 构建问题描述
        const issues = hasFailedItem 
          ? items
              .filter(item => item.result === '不合格')
              .map(item => `${item.itemName}不合格，${item.remarks}`)
              .join('；')
          : '';
        
        // 创建新的检查记录
        const newInspection = {
          id: `INS${moment().format('YYYYMMDD')}${String(inspections.length + 1).padStart(3, '0')}`,
          gunId: values.gunId,
          gunName: selectedGun.name,
          inspectionDate: values.inspectionDate.format('YYYY-MM-DD'),
          inspector: values.inspector,
          result: overallResult,
          issues: issues,
          remarks: values.remarks,
          items: items,
          station: selectedGun.station,
          company: selectedGun.company,
          brand: selectedGun.brand
        };
        
        setInspections([newInspection, ...inspections]);
        message.success('检查记录已添加');
        setLoading(false);
        setIsModalVisible(false);
      }, 500);
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleOrgChange = (value) => {
    setOrgSelectedValues(value);
  };

  const handleReset = () => {
    filterForm.resetFields();
    setSearchText('');
    setDateRange([]);
    setOrgSelectedValues([]);
  };

  const showApprovalDrawer = (record) => {
    setSelectedApproval(record);
    approvalForm.resetFields();
    setIsApprovalDrawerVisible(true);
  };

  const handleApprovalCancel = () => {
    setIsApprovalDrawerVisible(false);
  };

  const handleApprove = () => {
    approvalForm.validateFields().then(values => {
      setApprovalLoading(true);
      
      setTimeout(() => {
        const updatedApprovalData = approvalData.map(item => {
          if (item.id === selectedApproval.id) {
            return {
              ...item,
              status: '已完成',
              approver: '当前用户',
              approveDate: moment().format('YYYY-MM-DD'),
              approvalResult: values.result,
              approvalOpinion: values.opinion
            };
          }
          return item;
        });
        
        setApprovalData(updatedApprovalData);
        setApprovalLoading(false);
        setIsApprovalDrawerVisible(false);
        message.success('审批操作已完成');
      }, 500);
    });
  };

  const columns = [
    {
      title: '检查单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '油枪名称',
      dataIndex: 'gunName',
      key: 'gunName',
      width: 120,
    },
    {
      title: '加油站',
      dataIndex: 'station',
      key: 'station',
      width: 180,
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      key: 'company',
      width: 150,
    },
    {
      title: '加油机品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
    },
    {
      title: '检查日期',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      width: 120,
    },
    {
      title: '检查人员',
      dataIndex: 'inspector',
      key: 'inspector',
      width: 100,
    },
    {
      title: '检查结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (text) => {
        const color = text === '合格' ? 'green' : 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '问题描述',
      dataIndex: 'issues',
      key: 'issues',
      width: 250,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => showDetailModal(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  const approvalColumns = [
    {
      title: '审批单号',
      dataIndex: 'id',
      key: 'id',
      width: 160,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 120,
    },
    {
      title: '加油站',
      dataIndex: 'station',
      key: 'station',
      width: 180,
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      key: 'company',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const color = text === '待审批' ? 'gold' : text === '已完成' ? 'green' : 'volcano';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: (text) => {
        const color = text === '紧急' ? 'red' : 'blue';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        record.status === '待审批' ? (
          <Button
            type="primary"
            size="small"
            onClick={() => showApprovalDrawer(record)}
          >
            审批
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showApprovalDrawer(record)}
          >
            详情
          </Button>
        )
      ),
    },
  ];

  const renderFilterForm = () => {
    return (
      <Form form={filterForm} layout="inline" className="filter-form">
        <Form.Item name="orgId" label="组织筛选">
          <TreeSelect
            treeData={treeData}
            value={orgSelectedValues}
            onChange={handleOrgChange}
            treeCheckable={true}
            showCheckedStrategy={SHOW_PARENT}
            placeholder="请选择组织"
            style={{ width: 300 }}
            treeDefaultExpandAll
            allowClear
            showSearch
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <Form.Item name="keyword" label="关键字">
          <Input
            placeholder="搜索检查记录"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        </Form.Item>
        <Form.Item name="dateRange" label="日期范围">
          <RangePicker
            onChange={setDateRange}
            placeholder={['开始日期', '结束日期']}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              htmlType="submit"
              onClick={() => {/* 已经通过useEffect实现了实时筛选 */}}
            >
              查询
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
            {activeTab === 'inspection' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
              >
                新增检查
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="gun-inspection">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="油枪自检" key="inspection">
          <div style={{ padding: '0' }}>
            {renderFilterForm()}
          </div>
          <Table
            columns={columns}
            dataSource={filteredInspections}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1800 }}
          />
        </TabPane>
        <TabPane tab="审批中心" key="approval">
          <div style={{ padding: '0' }}>
            {renderFilterForm()}
          </div>
          <Table
            columns={approvalColumns}
            dataSource={approvalData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1500 }}
          />
        </TabPane>
      </Tabs>

      {/* 新增检查记录表单 */}
      <Modal
        title="新增检查记录"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={800}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="gunId"
            label="选择油枪"
            rules={[{ required: true, message: '请选择油枪' }]}
          >
            <Select placeholder="请选择油枪">
              {guns.map(gun => (
                <Option key={gun.id} value={gun.id}>{`${gun.name} (${gun.oilType})`}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="inspectionDate"
            label="检查日期"
            rules={[{ required: true, message: '请选择检查日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="inspector"
            label="检查人员"
            rules={[{ required: true, message: '请输入检查人员' }]}
          >
            <Input placeholder="请输入检查人员" />
          </Form.Item>
          
          <Divider>检查项目</Divider>
          
          {inspectionItems.map(item => (
            <div key={item.id} className="inspection-item">
              <div className="item-header">
                <h4>{item.name}</h4>
                <p className="item-description">{item.description}</p>
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="检查结果"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Select
                      defaultValue="合格"
                      onChange={(value) => handleItemResultChange(item.id, 'result', value)}
                    >
                      <Option value="合格">合格</Option>
                      <Option value="不合格">不合格</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label="备注"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input
                      placeholder="请输入备注"
                      onChange={(e) => handleItemResultChange(item.id, 'remarks', e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
          
          <Divider />
          
          <Form.Item
            name="remarks"
            label="整体备注"
          >
            <TextArea rows={3} placeholder="请输入整体备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 检查记录详情抽屉 */}
      <Drawer
        title="检查记录详情"
        open={isDetailDrawerVisible}
        onClose={handleDetailCancel}
        width={800}
        extra={
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => message.info('打印功能开发中')}
          >
            打印报告
          </Button>
        }
      >
        {selectedInspection && (
          <div className="inspection-detail">
            <Descriptions 
              bordered 
              column={2} 
              size="small"
              title="基本信息"
            >
              <Descriptions.Item label="检查单号" span={1}>{selectedInspection.id}</Descriptions.Item>
              <Descriptions.Item label="检查日期" span={1}>{selectedInspection.inspectionDate}</Descriptions.Item>
              <Descriptions.Item label="油枪名称" span={1}>{selectedInspection.gunName}</Descriptions.Item>
              <Descriptions.Item label="检查人员" span={1}>{selectedInspection.inspector}</Descriptions.Item>
              <Descriptions.Item label="所属加油站" span={1}>{selectedInspection.station}</Descriptions.Item>
              <Descriptions.Item label="检查结果" span={1}>
                <Tag color={selectedInspection.result === '合格' ? 'green' : 'red'}>
                  {selectedInspection.result}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="所属公司" span={1}>{selectedInspection.company}</Descriptions.Item>
              <Descriptions.Item label="加油机品牌" span={1}>{selectedInspection.brand}</Descriptions.Item>
              {selectedInspection.issues && (
                <Descriptions.Item label="问题描述" span={2}>{selectedInspection.issues}</Descriptions.Item>
              )}
              {selectedInspection.remarks && (
                <Descriptions.Item label="备注" span={2}>{selectedInspection.remarks}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">检查项目详情</Divider>

            <Table
              dataSource={selectedInspection.items}
              rowKey="itemId"
              pagination={false}
              columns={[
                {
                  title: '检查项目',
                  dataIndex: 'itemName',
                  key: 'itemName',
                  width: 200,
                },
                {
                  title: '检查结果',
                  dataIndex: 'result',
                  key: 'result',
                  width: 100,
                  render: (text) => {
                    const color = text === '合格' ? 'green' : 'red';
                    const icon = text === '合格' ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
                    return <Tag color={color} icon={icon}>{text}</Tag>;
                  },
                },
                {
                  title: '备注',
                  dataIndex: 'remarks',
                  key: 'remarks',
                },
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* 审批抽屉 */}
      <Drawer
        title="油枪自检审批"
        open={isApprovalDrawerVisible}
        onClose={handleApprovalCancel}
        width={800}
        extra={
          selectedApproval && selectedApproval.status === '待审批' ? (
            <Space>
              <Button onClick={handleApprovalCancel}>
                取消
              </Button>
              <Button 
                type="primary" 
                danger
                onClick={() => {
                  approvalForm.setFieldsValue({ result: '拒绝' });
                  handleApprove();
                }}
              >
                拒绝
              </Button>
              <Button 
                type="primary" 
                style={{ 
                  backgroundColor: '#32AF50', 
                  borderColor: '#32AF50' 
                }}
                onClick={() => {
                  approvalForm.setFieldsValue({ result: '通过' });
                  handleApprove();
                }}
                loading={approvalLoading}
              >
                通过
              </Button>
            </Space>
          ) : null
        }
        footer={null}
      >
        {selectedApproval && (
          <div className="inspection-detail">
            <Alert
              message={
                <span>
                  当前状态：
                  <Tag color={selectedApproval.status === '待审批' ? 'gold' : selectedApproval.status === '已完成' ? 'green' : 'volcano'}>
                    {selectedApproval.status}
                  </Tag>
                  {selectedApproval.status === '已完成' && (
                    <>
                      &nbsp;&nbsp;审批结果：
                      <Tag color={selectedApproval.approvalResult === '通过' ? 'green' : 'red'}>
                        {selectedApproval.approvalResult}
                      </Tag>
                    </>
                  )}
                  &nbsp;&nbsp;提交时间：{selectedApproval.applyDate}
                  {selectedApproval.approveDate && (
                    <>&nbsp;&nbsp;审批时间：{selectedApproval.approveDate}</>
                  )}
                </span>
              }
              type={selectedApproval.status === '待审批' ? 'warning' : selectedApproval.status === '已完成' ? 'success' : 'error'}
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Descriptions 
              bordered 
              column={2} 
              size="small"
              title="基本信息"
            >
              <Descriptions.Item label="审批单号" span={1}>{selectedApproval.id}</Descriptions.Item>
              <Descriptions.Item label="紧急程度" span={1}>
                <Tag color={selectedApproval.urgency === '紧急' ? 'red' : 'blue'}>
                  {selectedApproval.urgency}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="标题" span={2}>{selectedApproval.title}</Descriptions.Item>
              <Descriptions.Item label="申请人" span={1}>{selectedApproval.applicant}</Descriptions.Item>
              <Descriptions.Item label="所属部门" span={1}>{selectedApproval.department}</Descriptions.Item>
              <Descriptions.Item label="加油站" span={1}>{selectedApproval.station}</Descriptions.Item>
              <Descriptions.Item label="所属公司" span={1}>{selectedApproval.company}</Descriptions.Item>
              <Descriptions.Item label="自检内容" span={2}>{selectedApproval.content}</Descriptions.Item>
            </Descriptions>

            {selectedApproval.status === '待审批' ? (
              <>
                <Divider orientation="left">审批意见</Divider>
                <Form
                  form={approvalForm}
                  layout="vertical"
                >
                  <Form.Item
                    name="result"
                    label="审批结果"
                    rules={[{ required: true, message: '请选择审批结果' }]}
                    initialValue="通过"
                  >
                    <Radio.Group>
                      <Radio value="通过">
                        <Tag color="green" icon={<CheckOutlined />}>通过</Tag>
                      </Radio>
                      <Radio value="拒绝">
                        <Tag color="red" icon={<CloseOutlined />}>拒绝</Tag>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  <Form.Item
                    name="opinion"
                    label="审批意见"
                    rules={[{ required: true, message: '请输入审批意见' }]}
                  >
                    <TextArea rows={4} placeholder="请输入审批意见" />
                  </Form.Item>
                </Form>
              </>
            ) : (
              <>
                <Divider orientation="left">审批记录</Divider>
                <Descriptions bordered>
                  <Descriptions.Item label="审批人" span={1}>{selectedApproval.approver}</Descriptions.Item>
                  <Descriptions.Item label="审批时间" span={1}>{selectedApproval.approveDate}</Descriptions.Item>
                  <Descriptions.Item label="审批结果" span={1}>
                    <Tag color={selectedApproval.approvalResult === '通过' ? 'green' : 'red'}>
                      {selectedApproval.approvalResult}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="审批意见" span={3}>{selectedApproval.approvalOpinion}</Descriptions.Item>
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default GunInspection; 