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
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import OrgTreeSelect from './OrgTreeSelect';
import { fetchDensityHistoryData } from '../services/api';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 密度调整历史标签页组件
 */
const DensityHistoryTab = () => {
  // 状态定义
  const [historyList, setHistoryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  
  // 初始加载数据
  useEffect(() => {
    loadHistoryData();
  }, []);
  
  // 加载历史数据
  const loadHistoryData = async () => {
    setLoading(true);
    try {
      const data = await fetchDensityHistoryData();
      setHistoryList(data);
      setFilteredList(data);
    } catch (error) {
      message.error('获取密度调整历史数据失败');
      console.error('获取密度调整历史数据失败:', error);
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
      tankNo: values.tankNo,
      deliveryOrderNo: values.deliveryOrderNo,
      approvalStatus: values.approvalStatus,
      dateRange: values.dateRange
    };
    
    // 调用API查询
    fetchDensityHistoryData(params)
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
    setFilteredList(historyList);
  };
  
  // 表格列定义
  const columns = [
    {
      title: '调整ID',
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
      title: '调整后密度(kg/L)',
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
      title: '调整日期',
      dataIndex: 'adjustmentDate',
      key: 'adjustmentDate',
      width: 120,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        let color = 'green';
        if (text === '待审批') {
          color = 'orange';
        } else if (text === '已拒绝') {
          color = 'red';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
    {
      title: '调整原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
    }
  ];
  
  return (
    <div className="density-history-tab">
      {/* 查询表单 */}
      <Form
        form={searchForm}
        name="history_search"
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
              name="tankNo"
              label="油罐编号"
              style={{ width: '100%' }}
            >
              <Input placeholder="请输入油罐编号" allowClear />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="deliveryOrderNo"
              label="卸油单号"
              style={{ width: '100%' }}
            >
              <Input placeholder="请输入卸油单号" allowClear />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="approvalStatus"
              label="审批状态"
              style={{ width: '100%' }}
            >
              <Select placeholder="请选择审批状态" allowClear>
                <Option value="待审批">待审批</Option>
                <Option value="已审批">已审批</Option>
                <Option value="已拒绝">已拒绝</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="dateRange"
              label="调整日期"
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
                  className="density-button-primary"
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
    </div>
  );
};

export default DensityHistoryTab; 