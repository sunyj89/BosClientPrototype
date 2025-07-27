import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Space, 
  message,
  Divider,
  Modal,
  Row,
  Col,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  HistoryOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import OrgTreeSelect from './OrgTreeSelect';
import tankData from '../../../../mock/station/tankData.json';
import densityData from '../../../../mock/oil/densityData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 油品密度数据标签页组件
 */
const DensityDataTab = () => {
  // 状态定义
  const [densityList, setDensityList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [historyForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);

  // 初始加载数据
  useEffect(() => {
    loadDensityData();
  }, []);

  // 加载密度数据
  const loadDensityData = async () => {
    setLoading(true);
    try {
      // 使用本地mock数据
      const data = densityData.densityData;
      setDensityList(data);
      setFilteredList(data);
      message.success(`加载成功，共找到 ${data.length} 条记录`);
    } catch (error) {
      message.error('获取油品密度数据失败');
      console.error('获取油品密度数据失败:', error);
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
      tankCode: values.tankCode,
      deliveryOrderNo: values.deliveryOrderNo,
      dateRange: values.dateRange
    };
    
    // 使用本地mock数据进行过滤
    let filteredData = densityData.densityData;
    
    // 按油罐编号过滤
    if (params.tankCode) {
      filteredData = filteredData.filter(item => 
        item.tankCode.includes(params.tankCode)
      );
    }
    
    // 按油品类型过滤
    if (params.oilType) {
      filteredData = filteredData.filter(item => 
        item.oilType === params.oilType
      );
    }
    
    // 按卸油单号过滤
    if (params.deliveryOrderNo) {
      filteredData = filteredData.filter(item => 
        item.deliveryOrderNo.includes(params.deliveryOrderNo)
      );
    }
    
    setFilteredList(filteredData);
    message.success(`查询成功，共找到 ${filteredData.length} 条记录`);
    setLoading(false);
  };

  // 重置查询表单
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredList(densityData.densityData);
  };

  // 显示历史变动记录弹窗
  const showHistoryModal = (record) => {
    setSelectedRecord(record);
    // 生成模拟历史数据
    const mockHistoryData = [
      {
        id: 1,
        date: '2024-01-15',
        density: 0.742,
        temperature: 15,
        changeReason: '进油后自动更新',
        operator: '系统自动',
        updateTime: '2024-01-15 14:30:00'
      },
      {
        id: 2,
        date: '2024-01-10',
        density: 0.745,
        temperature: 18,
        changeReason: '人工调整',
        operator: '张工程师',
        updateTime: '2024-01-10 09:15:00'
      },
      {
        id: 3,
        date: '2024-01-05',
        density: 0.748,
        temperature: 20,
        changeReason: '人工调整',
        operator: '李技师',
        updateTime: '2024-01-05 16:45:00'
      }
    ];
    setHistoryRecords(mockHistoryData);
    setHistoryModalVisible(true);
  };

  // 搜索历史记录
  const handleHistorySearch = (values) => {
    console.log('搜索历史记录:', values);
    // 这里可以根据搜索条件过滤历史记录
    // 实际项目中会调用API
  };

  // 关闭历史记录弹窗
  const handleHistoryCancel = () => {
    setHistoryModalVisible(false);
    setSelectedRecord(null);
    historyForm.resetFields();
  };


  // 表格列定义
  const columns = [
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
      dataIndex: 'tankCode',
      key: 'tankCode',
      width: 150,
    },
    {
      title: '卸油单号',
      dataIndex: 'deliveryOrderNo',
      key: 'deliveryOrderNo',
      width: 150,
    },
    {
      title: (
        <span>
          动态密度(kg/L)
          <Tooltip 
            title="动态密度计算公式：(期末重量+进油重量)/(期末体积+进油体积)，如果当天没有进油，那么第二天的动态密度就是前一天的密度"
            placement="top"
          >
            <QuestionCircleOutlined style={{ marginLeft: 4, color: '#1890ff' }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'density',
      key: 'density',
      width: 150,
      render: (text, record) => `${text} (${record.temperature}℃)`,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            icon={<HistoryOutlined />} 
            onClick={() => showHistoryModal(record)}
          >
            查看历史变动记录
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="density-data-tab">
      {/* 查询表单 */}
      <Form
        form={searchForm}
        name="density_search"
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
              name="tankCode"
              label="油罐编号"
              style={{ width: '100%' }}
            >
              <Select placeholder="请选择油罐编号" allowClear>
                {tankData.tanks.map(tank => (
                  <Option key={tank.tankCode} value={tank.tankCode}>
                    {tank.tankCode} - {tank.tankName}
                  </Option>
                ))}
              </Select>
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
              name="dateRange"
              label="时间范围"
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
      
      {/* 历史变动记录弹窗 */}
      <Modal
        title={`油罐历史变动记录 - ${selectedRecord?.tankCode || ''}`}
        open={historyModalVisible}
        onCancel={handleHistoryCancel}
        width={900}
        footer={[
          <Button key="close" onClick={handleHistoryCancel}>
            关闭
          </Button>
        ]}
      >
        {/* 搜索表单 */}
        <Form
          form={historyForm}
          layout="inline"
          onFinish={handleHistorySearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="dateRange" label="时间范围">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
        </Form>
        
        {/* 历史记录表格 */}
        <Table
          columns={[
            {
              title: '日期',
              dataIndex: 'date',
              key: 'date',
              width: 100,
            },
            {
              title: '动态密度(kg/L)',
              dataIndex: 'density',
              key: 'density',
              width: 120,
              render: (text, record) => `${text} (${record.temperature}℃)`,
            },
            {
              title: '变动原因',
              dataIndex: 'changeReason',
              key: 'changeReason',
              width: 150,
            },
            {
              title: '操作人',
              dataIndex: 'operator',
              key: 'operator',
              width: 100,
            },
            {
              title: '更新时间',
              dataIndex: 'updateTime',
              key: 'updateTime',
              width: 150,
            },
          ]}
          dataSource={historyRecords}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 10,
            pageSizeOptions: ['5', '10', '20'],
          }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default DensityDataTab; 