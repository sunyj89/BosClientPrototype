import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Space, 
  Tag, 
  message,
  Divider,
  Drawer,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Timeline
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  AuditOutlined,
  HistoryOutlined,
  StopOutlined,
  CheckOutlined
} from '@ant-design/icons';
import OrgTreeSelect from './OrgTreeSelect';
import { fetchApprovalData, approveAdjustment } from '../services/api';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text, Title } = Typography;

/**
 * 密度调整审批中心组件
 */
const DensityApprovalTab = () => {
  // 状态定义
  const [approvalList, setApprovalList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [approvalDrawerVisible, setApprovalDrawerVisible] = useState(false);
  const [approvalAction, setApprovalAction] = useState('approve'); // 'approve' 或 'reject'
  
  // 初始加载数据
  useEffect(() => {
    loadApprovalData();
  }, []);
  
  // 加载审批数据
  const loadApprovalData = async () => {
    setLoading(true);
    try {
      const data = await fetchApprovalData();
      setApprovalList(data);
      setFilteredList(data);
    } catch (error) {
      message.error('获取审批数据失败');
      console.error('获取审批数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理查询
  const handleSearch = (values) => {
    setLoading(true);
    
    // 构建查询参数
    const params = {
      stationIds: values.stationIds,
      oilType: values.oilType,
      status: values.status,
      applicant: values.applicant,
      dateRange: values.dateRange
    };
    
    // 调用API查询
    fetchApprovalData(params)
      .then(data => {
        setFilteredList(data);
        message.success(`查询成功，共找到 ${data.length} 条记录`);
      })
      .catch(error => {
        message.error('查询失败');
        console.error('查询失败:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // 重置查询表单
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredList(approvalList);
  };
  
  // 显示审批抽屉
  const showApprovalDrawer = (record, action) => {
    setSelectedRecord(record);
    setApprovalAction(action);
    approvalForm.resetFields();
    setApprovalDrawerVisible(true);
  };
  
  // 关闭审批抽屉
  const handleApprovalCancel = () => {
    setApprovalDrawerVisible(false);
    setSelectedRecord(null);
    approvalForm.resetFields();
  };
  
  // 提交审批
  const handleApprovalSubmit = () => {
    approvalForm.validateFields()
      .then(values => {
        setLoading(true);
        
        // 调用API提交审批
        approveAdjustment(
          selectedRecord.id, 
          approvalAction === 'approve', 
          values.comment
        )
          .then(result => {
            if (result.success) {
              message.success(`密度调整申请${approvalAction === 'approve' ? '审批通过' : '已拒绝'}`);
              setApprovalDrawerVisible(false);
              setSelectedRecord(null);
              approvalForm.resetFields();
              loadApprovalData(); // 重新加载数据
            } else {
              message.error('审批操作失败');
            }
          })
          .catch(error => {
            message.error('审批操作失败');
            console.error('审批操作失败:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('表单验证失败:', error);
      });
  };
  
  // 获取审批状态的显示颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '已审批':
        return 'green';
      case '已拒绝':
        return 'red';
      case '待审批':
        return 'orange';
      default:
        return 'blue';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status) => {
    switch (status) {
      case '已审批':
        return <CheckCircleOutlined />;
      case '已拒绝':
        return <CloseCircleOutlined />;
      case '待审批':
        return <ExclamationCircleOutlined />;
      case '已取消':
        return <StopOutlined />;
      case '已确认':
        return <CheckOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };
  
  // 获取Alert类型
  const getAlertType = (status) => {
    switch (status) {
      case '已审批':
        return 'success';
      case '已拒绝':
        return 'error';
      case '待审批':
        return 'warning';
      default:
        return 'info';
    }
  };
  
  // 表格列定义
  const columns = [
    {
      title: '申请ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '油品',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '油罐编号',
      dataIndex: 'tankNo',
      key: 'tankNo',
      width: 100,
    },
    {
      title: '原密度(kg/L)',
      dataIndex: 'originalDensity',
      key: 'originalDensity',
      width: 120,
      render: (text, record) => `${text} (${record.temperature}℃)`,
    },
    {
      title: '申请密度(kg/L)',
      dataIndex: 'adjustedDensity',
      key: 'adjustedDensity',
      width: 120,
      render: (text, record) => `${text} (${record.temperature}℃)`,
    },
    {
      title: '卸油单号',
      dataIndex: 'deliveryOrderNo',
      key: 'deliveryOrderNo',
      width: 150,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '申请时间',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => {
        return <Tag color={getStatusColor(text)}>{text}</Tag>;
      },
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '审批时间',
      dataIndex: 'approvalDate',
      key: 'approvalDate',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => {
        if (record.status === '待审批') {
          return (
            <Button 
              type="primary" 
              icon={<AuditOutlined />}
              onClick={() => showApprovalDrawer(record, 'approve')}
            >
              审批
            </Button>
          );
        } else {
          return (
            <Button 
              type="primary" 
              icon={<AuditOutlined />} 
              onClick={() => showApprovalDrawer(record, 'view')}
            >
              详情
            </Button>
          );
        }
      },
    },
  ];
  
  // 渲染审批表单
  const renderApprovalForm = () => {
    if (!selectedRecord) return null;
    
    // 仅查看详情
    if (approvalAction === 'view') {
      return (
        <div>
          <Alert
            message={
              <Space>
                <span>当前状态：<Tag color={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Tag></span>
                <span>提交时间：{selectedRecord.applicationDate}</span>
              </Space>
            }
            type={getAlertType(selectedRecord.status)}
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Descriptions title="基本信息" bordered size="small" column={2}>
            <Descriptions.Item label="油站">{selectedRecord.stationName}</Descriptions.Item>
            <Descriptions.Item label="油罐编号">{selectedRecord.tankNo}</Descriptions.Item>
            <Descriptions.Item label="油品类型">{selectedRecord.oilType}</Descriptions.Item>
            <Descriptions.Item label="卸油单号">{selectedRecord.deliveryOrderNo}</Descriptions.Item>
            <Descriptions.Item label="原密度">{`${selectedRecord.originalDensity} (${selectedRecord.temperature}℃)`}</Descriptions.Item>
            <Descriptions.Item label="申请密度">{`${selectedRecord.adjustedDensity} (${selectedRecord.temperature}℃)`}</Descriptions.Item>
            <Descriptions.Item label="申请人">{selectedRecord.applicant}</Descriptions.Item>
            <Descriptions.Item label="申请时间">{selectedRecord.applicationDate}</Descriptions.Item>
            <Descriptions.Item label="调整原因" span={2}>{selectedRecord.reason}</Descriptions.Item>
          </Descriptions>
          
          {(selectedRecord.status === '已审批' || selectedRecord.status === '已拒绝') && (
            <div style={{ marginTop: 16 }}>
              <Descriptions title="审批信息" bordered size="small" column={2}>
                <Descriptions.Item label="审批人">{selectedRecord.approver}</Descriptions.Item>
                <Descriptions.Item label="审批时间">{selectedRecord.approvalDate}</Descriptions.Item>
                <Descriptions.Item label="审批意见" span={2}>{selectedRecord.comment}</Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {selectedRecord.approvalHistory && selectedRecord.approvalHistory.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Descriptions title="审批历史" bordered={false} column={1}>
                <Descriptions.Item>
                  <Timeline>
                    {selectedRecord.approvalHistory.map((item, index) => (
                      <Timeline.Item
                        key={index}
                        color={getStatusColor(item.operateType)}
                        dot={getStatusIcon(item.operateType)}
                      >
                        <div style={{ fontWeight: 'bold' }}>
                          {item.operateUser} - {item.operateType}
                        </div>
                        <div>{item.content}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>
                          {item.time}
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </div>
      );
    }
    
    // 审批操作表单
    return (
      <div>
        <Alert
          message={
            <Space>
              <span>当前状态：<Tag color={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Tag></span>
              <span>提交时间：{selectedRecord.applicationDate}</span>
            </Space>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Descriptions title="基本信息" bordered size="small" column={2}>
          <Descriptions.Item label="油站">{selectedRecord.stationName}</Descriptions.Item>
          <Descriptions.Item label="油罐编号">{selectedRecord.tankNo}</Descriptions.Item>
          <Descriptions.Item label="油品类型">{selectedRecord.oilType}</Descriptions.Item>
          <Descriptions.Item label="卸油单号">{selectedRecord.deliveryOrderNo}</Descriptions.Item>
          <Descriptions.Item label="原密度">{`${selectedRecord.originalDensity} (${selectedRecord.temperature}℃)`}</Descriptions.Item>
          <Descriptions.Item label="申请密度">{`${selectedRecord.adjustedDensity} (${selectedRecord.temperature}℃)`}</Descriptions.Item>
          <Descriptions.Item label="申请人">{selectedRecord.applicant}</Descriptions.Item>
          <Descriptions.Item label="申请时间">{selectedRecord.applicationDate}</Descriptions.Item>
          <Descriptions.Item label="调整原因" span={2}>{selectedRecord.reason}</Descriptions.Item>
        </Descriptions>
        
        <Form
          form={approvalForm}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="comment"
            label="审批意见"
            rules={[{ required: true, message: '请输入审批意见' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入审批意见"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleApprovalCancel}>取消</Button>
            <Button
              danger
              onClick={() => {
                setApprovalAction('reject');
                handleApprovalSubmit();
              }}
            >
              拒绝
            </Button>
            <Button 
              type="primary" 
              onClick={() => {
                setApprovalAction('approve');
                handleApprovalSubmit();
              }}
              style={{ 
                backgroundColor: '#32AF50', 
                borderColor: '#32AF50' 
              }}
            >
              通过
            </Button>
          </Space>
        </div>
      </div>
    );
  };
  
  return (
    <div className="density-approval-tab">
      {/* 查询表单 */}
      <Form
        form={searchForm}
        name="approval_search"
        layout="inline"
        onFinish={handleSearch}
        className="density-form density-form-inline"
      >
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="stationIds"
              label="组织油站"
              style={{ width: '100%' }}
            >
              <OrgTreeSelect placeholder="请选择组织或油站" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="oilType"
              label="油品类型"
              style={{ width: '100%' }}
            >
              <Select placeholder="请选择油品类型" allowClear>
                <Option value="92#汽油">92#汽油</Option>
                <Option value="95#汽油">95#汽油</Option>
                <Option value="98#汽油">98#汽油</Option>
                <Option value="0#柴油">0#柴油</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="status"
              label="状态"
              style={{ width: '100%' }}
            >
              <Select placeholder="请选择状态" allowClear>
                <Option value="待审批">待审批</Option>
                <Option value="已审批">已审批</Option>
                <Option value="已拒绝">已拒绝</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="applicant"
              label="申请人"
              style={{ width: '100%' }}
            >
              <Input placeholder="请输入申请人" allowClear />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="dateRange"
              label="申请时间"
              style={{ width: '100%' }}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={24} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />}
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
      
      <Divider style={{ margin: '16px 0' }} />
      
      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={filteredList}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50'],
        }}
        scroll={{ x: 'max-content' }}
        className="density-table"
      />
      
      {/* 审批抽屉 */}
      <Drawer
        title={
          approvalAction === 'view' ? '密度调整详情' : '密度调整审核'
        }
        open={approvalDrawerVisible}
        onClose={handleApprovalCancel}
        width={800}
        footer={
          approvalAction === 'view' ? 
          (
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleApprovalCancel}>
                关闭
              </Button>
            </div>
          ) : null
        }
      >
        {renderApprovalForm()}
      </Drawer>
    </div>
  );
};

export default DensityApprovalTab; 