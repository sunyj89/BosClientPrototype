import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  Modal,
  Tag,
  DatePicker,
  Row,
  Col,
  Descriptions,
  Typography
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import './OperationRecords.css';
import operationRecordsData from '../../../mock/purchase/oil-procurement/operationRecordsData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const OperationRecords = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const data = (operationRecordsData.operationRecords || []).map(item => ({
        ...item,
        key: item.id
      }));
      setDataSource(data);
      setFilteredDataSource(data);
    } catch (error) {
      console.error('数据加载错误:', error);
      setDataSource([]);
      setFilteredDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理查询
  const handleSearch = (values) => {
    setLoading(true);
    const sourceArray = Array.isArray(dataSource) ? dataSource : [];
    let filtered = [...sourceArray];

    if (values.module) {
      filtered = filtered.filter(item => item.module === values.module);
    }

    if (values.operationType) {
      filtered = filtered.filter(item => item.operationType === values.operationType);
    }

    if (values.approvalStatus) {
      filtered = filtered.filter(item => item.approvalStatus === values.approvalStatus);
    }

    if (values.operatorName) {
      filtered = filtered.filter(item => 
        item.operatorName.includes(values.operatorName)
      );
    }

    if (values.businessNumber) {
      filtered = filtered.filter(item => 
        item.businessNumber.includes(values.businessNumber)
      );
    }

    if (values.stationName) {
      filtered = filtered.filter(item => 
        item.stationName.includes(values.stationName)
      );
    }

    if (values.dateRange && values.dateRange.length === 2) {
      const [startDate, endDate] = values.dateRange;
      filtered = filtered.filter(item => {
        const operateTime = new Date(item.operateTime);
        return operateTime >= startDate.toDate() && operateTime <= endDate.toDate();
      });
    }

    setFilteredDataSource(filtered);
    setLoading(false);
  };

  // 重置查询
  const handleReset = () => {
    form.resetFields();
    setFilteredDataSource(Array.isArray(dataSource) ? dataSource : []);
  };

  // 查看详情
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 关闭详情弹窗
  const closeViewModal = () => {
    setViewModalVisible(false);
    setCurrentRecord(null);
  };

  // 获取操作类型标签颜色
  const getOperationTypeColor = (type) => {
    const colors = {
      '新增': 'green',
      '编辑': 'blue',
      '删除': 'red',
      '审批': 'orange',
      '驳回': 'red',
      '撤回': 'default',
      '质量异议': 'purple',
      '执行完成': 'cyan'
    };
    return colors[type] || 'default';
  };

  // 获取审批状态标签颜色
  const getApprovalStatusColor = (status) => {
    const colors = {
      '无需审批': 'default',
      '审批中': 'orange',
      '已审批': 'green',
      '已驳回': 'red',
      '已撤回': 'default',
      '异议处理中': 'purple',
      '已完成': 'green'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => new Date(a.operateTime) - new Date(b.operateTime),
      defaultSortOrder: 'descend'
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module) => (
        <Tag color="blue">{module}</Tag>
      )
    },
    {
      title: '业务单号',
      dataIndex: 'businessNumber',
      key: 'businessNumber',
      width: 140
    },
    {
      title: '业务标题',
      dataIndex: 'businessTitle',
      key: 'businessTitle',
      width: 250,
      ellipsis: true
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (type) => (
        <Tag color={getOperationTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 100
    },
    {
      title: '操作描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 120,
      render: (status) => (
        <Tag color={getApprovalStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
      render: (approver) => approver || '-'
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          查看
        </Button>
      )
    }
  ];

  return (
    <div className="operation-records-container">
      <Card>
        {/* 筛选区域 */}
        <Form
          form={form}
          onFinish={handleSearch}
          className="search-form"
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item name="module" label="所属模块">
                <Select placeholder="请选择模块" allowClear>
                  {operationRecordsData.moduleList.map(module => (
                    <Option key={module.value} value={module.value}>
                      {module.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="operationType" label="操作类型">
                <Select placeholder="请选择操作类型" allowClear>
                  {operationRecordsData.operationTypeList.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="approvalStatus" label="审批状态">
                <Select placeholder="请选择审批状态" allowClear>
                  {operationRecordsData.approvalStatusList.map(status => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="operatorName" label="操作人">
                <Input placeholder="请输入操作人" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="dateRange" label="操作时间">
                <RangePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item name="businessNumber" label="业务单号">
                <Input placeholder="请输入业务单号" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="stationName" label="油站名称">
                <Input placeholder="请输入油站名称" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 表格区域 */}
        <Table
          columns={columns}
          dataSource={Array.isArray(filteredDataSource) ? filteredDataSource : []}
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 详情查看弹窗 */}
      <Modal
        title={
          <Space>
            <HistoryOutlined />
            操作记录详情
          </Space>
        }
        open={viewModalVisible}
        onCancel={closeViewModal}
        footer={[
          <Button key="close" onClick={closeViewModal}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <div>
            {/* 基本信息 */}
            <Descriptions
              title="基本信息"
              column={2}
              bordered
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="操作时间">{currentRecord.operateTime}</Descriptions.Item>
              <Descriptions.Item label="所属模块">
                <Tag color="blue">{currentRecord.module}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="业务单号">{currentRecord.businessNumber}</Descriptions.Item>
              <Descriptions.Item label="操作类型">
                <Tag color={getOperationTypeColor(currentRecord.operationType)}>
                  {currentRecord.operationType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作人">{currentRecord.operatorName}</Descriptions.Item>
              <Descriptions.Item label="操作人ID">{currentRecord.operatorId}</Descriptions.Item>
              <Descriptions.Item label="业务标题" span={2}>
                <Text strong>{currentRecord.businessTitle}</Text>
              </Descriptions.Item>
            </Descriptions>

            {/* 操作详情 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              操作详情
            </div>
            <Descriptions
              column={1}
              bordered
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="操作描述">
                {currentRecord.description}
              </Descriptions.Item>
              <Descriptions.Item label="变更内容">
                <Text code style={{ whiteSpace: 'pre-wrap' }}>
                  {currentRecord.changes}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {/* 审批信息 */}
            {currentRecord.approvalStatus !== '无需审批' && (
              <>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  marginBottom: 16,
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: 8
                }}>
                  审批信息
                </div>
                <Descriptions
                  column={2}
                  bordered
                  style={{ marginBottom: 24 }}
                >
                  <Descriptions.Item label="审批状态">
                    <Tag color={getApprovalStatusColor(currentRecord.approvalStatus)}>
                      {currentRecord.approvalStatus}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="审批人">
                    {currentRecord.approver || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="审批时间">
                    {currentRecord.approvalTime || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="审批备注" span={2}>
                    {currentRecord.approvalRemark || '-'}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

            {/* 其他信息 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              其他信息
            </div>
            <Descriptions
              column={2}
              bordered
              size="small"
            >
              <Descriptions.Item label="油站名称">
                {currentRecord.stationName}
              </Descriptions.Item>
              <Descriptions.Item label="所属分公司">
                {currentRecord.branchName}
              </Descriptions.Item>
              <Descriptions.Item label="IP地址">
                {currentRecord.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label="浏览器信息">
                {currentRecord.userAgent}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OperationRecords; 