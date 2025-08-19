import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  Space, 
  Modal, 
  message, 
  Tag, 
  Tooltip,
  DatePicker,
  Descriptions,
  Typography,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import mockData from '../../../../mock/marketing/price-discount-config.json';
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const DiscountConfigList = ({ setLoading }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(mockData.discountConfigList);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData.discountConfigList];
      
      if (values.configId) {
        filteredData = filteredData.filter(item => 
          item.id.includes(values.configId)
        );
      }
      
      if (values.name) {
        filteredData = filteredData.filter(item => 
          item.name.includes(values.name)
        );
      }
      
      if (values.discountTarget) {
        filteredData = filteredData.filter(item => 
          item.discountTarget === values.discountTarget
        );
      }
      
      if (values.discountType) {
        filteredData = filteredData.filter(item => 
          item.discountType === values.discountType
        );
      }
      
      if (values.approvalStatus) {
        filteredData = filteredData.filter(item => 
          item.approvalStatus === values.approvalStatus
        );
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => 
          item.status === values.status
        );
      }

      if (values.maintainer) {
        filteredData = filteredData.filter(item => 
          item.maintainer.includes(values.maintainer)
        );
      }

      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    loadData();
  };

  const handleCreate = () => {
    navigate('/marketing/price-discount-config/create');
  };

  const handleEdit = (record) => {
    navigate(`/marketing/price-discount-config/edit/${record.id}`);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleDelete = (record) => {
    if (record.approvalStatus === '审批中') {
      message.warning('审批中的配置不能删除');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除优惠配置"${record.name}"吗？`,
      onOk() {
        setLoading(true);
        setTimeout(() => {
          // 如果是审批通过的配置，需要重新审批
          if (record.approvalStatus === '审批通过') {
            const updatedData = dataSource.map(item => 
              item.id === record.id 
                ? { ...item, approvalStatus: '审批中', status: '已结束' }
                : item
            );
            setDataSource(updatedData);
            message.success('删除申请已提交，等待审批');
          } else {
            // 直接删除待提交或被驳回的配置
            const updatedData = dataSource.filter(item => item.id !== record.id);
            setDataSource(updatedData);
            message.success('删除成功');
          }
          setLoading(false);
        }, 500);
      }
    });
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const isOperationDisabled = (record, operation) => {
    if (operation === 'edit' || operation === 'delete') {
      return record.approvalStatus === '审批中';
    }
    return false;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '生效中':
        return 'green';
      case '计划生效':
        return 'orange';
      case '已结束':
        return 'red';
      default:
        return 'default';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case '审批通过':
        return 'green';
      case '审批中':
        return 'orange';
      case '被驳回':
        return 'red';
      case '待提交':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getDiscountTypeColor = (type) => {
    switch (type) {
      case '普通优惠':
        return 'blue';
      case '渠道优惠':
        return 'purple';
      default:
        return 'default';
    }
  };

  const renderStations = (stationNames) => {
    if (stationNames.length <= 2) {
      return stationNames.join('、');
    }
    return (
      <Tooltip title={stationNames.join('、')}>
        <span>{stationNames.slice(0, 2).join('、')}等{stationNames.length}个站点</span>
      </Tooltip>
    );
  };

  const renderOils = (oilNames) => {
    if (oilNames.length <= 2) {
      return oilNames.join('、');
    }
    return (
      <Tooltip title={oilNames.join('、')}>
        <span>{oilNames.slice(0, 2).join('、')}等{oilNames.length}种油品</span>
      </Tooltip>
    );
  };

  const renderTimeRange = (timeRange, repeatType) => {
    const { startDate, endDate, startTime, endTime, weekDays, monthDays } = timeRange;
    let display = `${startDate} 至 ${endDate}`;
    
    if (startTime && endTime) {
      display += ` ${startTime}-${endTime}`;
    }

    if (repeatType === '每周重复' && weekDays && weekDays.length > 0) {
      const weekDayMap = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const days = weekDays.map(d => weekDayMap[d - 1]).join('、');
      display += ` (每周${days})`;
    } else if (repeatType === '每月重复' && monthDays && monthDays.length > 0) {
      const days = monthDays.join('、');
      display += ` (每月${days}号)`;
    } else if (repeatType !== '不重复') {
      display += ` (${repeatType})`;
    }
    
    return display;
  };

  const columns = [
    {
      title: '配置ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      fixed: 'left'
    },
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      fixed: 'left'
    },
    {
      title: '优惠站点',
      dataIndex: 'stationNames',
      key: 'stationNames',
      width: 180,
      render: renderStations
    },
    {
      title: '优惠对象',
      dataIndex: 'discountTarget',
      key: 'discountTarget',
      width: 120,
      render: (text) => <Tag color="cyan">{text}</Tag>
    },
    {
      title: '优惠类型',
      dataIndex: 'discountType',
      key: 'discountType',
      width: 100,
      render: (type) => (
        <Tag color={getDiscountTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: '优惠油品',
      dataIndex: 'oilNames',
      key: 'oilNames',
      width: 180,
      render: renderOils
    },
    {
      title: '重复类型',
      dataIndex: 'repeatType',
      key: 'repeatType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '每天重复': 'blue',
          '每周重复': 'green',
          '每月重复': 'orange',
          '不重复': 'default'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (status) => (
        <Tag color={getApprovalStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '优惠时间范围',
      key: 'timeRange',
      width: 200,
      render: (_, record) => renderTimeRange(record.timeRange, record.repeatType)
    },
    {
      title: '维护人',
      dataIndex: 'maintainer',
      key: 'maintainer',
      width: 100
    },
    {
      title: '维护时间',
      dataIndex: 'maintainTime',
      key: 'maintainTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={isOperationDisabled(record, 'edit')}
          >
            编辑
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => navigate(`/marketing/price-discount-config/rules/${record.id}`)}
          >
            配置规则
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            disabled={isOperationDisabled(record, 'delete')}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}
      >
        <Form.Item name="configId" label="配置ID">
          <Input
            placeholder="请输入配置ID"
            style={{ width: 140 }}
            allowClear
          />
        </Form.Item>
        <Form.Item name="name" label="配置名称">
          <Input
            placeholder="请输入配置名称"
            style={{ width: 140 }}
            allowClear
          />
        </Form.Item>
        <Form.Item name="discountTarget" label="优惠对象">
          <Select
            placeholder="请选择优惠对象"
            style={{ width: 140 }}
            allowClear
          >
            <Option value="新注册会员">新注册会员</Option>
            <Option value="VIP会员客户">VIP会员客户</Option>
            <Option value="黄金会员客户">黄金会员客户</Option>
            <Option value="钻石会员客户">钻石会员客户</Option>
            <Option value="企业客户">企业客户</Option>
          </Select>
        </Form.Item>
        <Form.Item name="discountType" label="优惠类型">
          <Select
            placeholder="请选择优惠类型"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="普通优惠">普通优惠</Option>
            <Option value="渠道优惠">渠道优惠</Option>
          </Select>
        </Form.Item>
        <Form.Item name="approvalStatus" label="审批状态">
          <Select
            placeholder="请选择审批状态"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="待提交">待提交</Option>
            <Option value="审批中">审批中</Option>
            <Option value="被驳回">被驳回</Option>
            <Option value="审批通过">审批通过</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            placeholder="请选择状态"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="生效中">生效中</Option>
            <Option value="计划生效">计划生效</Option>
            <Option value="已结束">已结束</Option>
          </Select>
        </Form.Item>
        <Form.Item name="maintainer" label="维护人">
          <Input
            placeholder="请输入维护人"
            style={{ width: 120 }}
            allowClear
          />
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto' }}>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 操作区域 */}
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="middle"
        >
          新建优惠配置
        </Button>
      </div>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* 查看详情弹窗 */}
      <Modal
        title="优惠配置详情"
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button key="close" onClick={handleViewModalClose}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        {selectedRecord && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="配置ID">{selectedRecord.id}</Descriptions.Item>
              <Descriptions.Item label="配置名称">{selectedRecord.name}</Descriptions.Item>
              <Descriptions.Item label="优惠对象">
                <Tag color="cyan">{selectedRecord.discountTarget}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优惠类型">
                <Tag color={getDiscountTypeColor(selectedRecord.discountType)}>
                  {selectedRecord.discountType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="参与资格">{selectedRecord.eligibility}</Descriptions.Item>
              <Descriptions.Item label="重复类型">
                <Tag color={
                  selectedRecord.repeatType === '每天重复' ? 'blue' :
                  selectedRecord.repeatType === '每周重复' ? 'green' :
                  selectedRecord.repeatType === '每月重复' ? 'orange' : 'default'
                }>
                  {selectedRecord.repeatType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优惠时间范围" span={2}>
                {renderTimeRange(selectedRecord.timeRange, selectedRecord.repeatType)}
              </Descriptions.Item>
              <Descriptions.Item label="计算方式">{selectedRecord.calculateMethod}</Descriptions.Item>
              <Descriptions.Item label="优惠形式">{selectedRecord.discountForm}</Descriptions.Item>
              <Descriptions.Item label="每日限制">{selectedRecord.dailyLimit || '不限制'}次</Descriptions.Item>
              <Descriptions.Item label="总计限制">{selectedRecord.totalLimit || '不限制'}次</Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Tag color={getApprovalStatusColor(selectedRecord.approvalStatus)}>
                  {selectedRecord.approvalStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="维护人">{selectedRecord.maintainer}</Descriptions.Item>
              <Descriptions.Item label="维护时间">{selectedRecord.maintainTime}</Descriptions.Item>
            </Descriptions>

            {/* 优惠站点 */}
            <Alert
              message="优惠站点"
              description={selectedRecord.stationNames.join('、')}
              type="info"
              style={{ marginBottom: 16 }}
            />

            {/* 优惠油品 */}
            <Alert
              message="优惠油品"
              description={selectedRecord.oilNames.join('、')}
              type="info"
              style={{ marginBottom: 16 }}
            />

            {/* 优惠规则 */}
            {selectedRecord.rules && selectedRecord.rules.length > 0 && (
              <div>
                <h4>优惠规则:</h4>
                {selectedRecord.rules.map((rule, index) => (
                  <div key={index} className="rule-list-item">
                    <div className="rule-item-header">
                      <Text strong>{rule.oilName}</Text>
                    </div>
                    <div className="rule-item-content">
                      {rule.rangeType}范围：{rule.minAmount}-{rule.maxAmount}
                      {rule.rangeType === '金额' ? '元' : '升'}，
                      优惠：{rule.discountValue}{rule.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 驳回原因 */}
            {selectedRecord.rejectReason && (
              <Alert
                message="驳回原因"
                description={selectedRecord.rejectReason}
                type="error"
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DiscountConfigList;
