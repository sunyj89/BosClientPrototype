import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Table, 
  Space, 
  DatePicker, 
  Select, 
  Card,
  Row,
  Col 
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import stationData from '../../../mock/station/stationData.json';
import lossData from '../../../mock/loss/stationLossSummaryData.json';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const StationLossSummary = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [queryMode, setQueryMode] = useState('summary'); // 'summary' 汇总查询, 'station' 单站查询

  // 转换油站数据为Select格式
  const getStationOptions = () => {
    const options = [];
    stationData.branches.forEach(branch => {
      const branchStations = stationData.stations.filter(station => station.branchId === branch.id);
      if (branchStations.length > 0) {
        options.push({
          label: branch.name,
          options: branchStations.map(station => ({
            label: station.name,
            value: station.id,
            branchName: branch.name
          }))
        });
      }
    });
    return options;
  };

  // 获取当前月份的默认日期范围（本月1日到昨天）
  const getDefaultDateRange = () => {
    const today = moment();
    const startOfMonth = moment().startOf('month');
    const yesterday = moment().subtract(1, 'day');
    return [startOfMonth, yesterday];
  };

  // 初始化数据和默认日期
  useEffect(() => {
    // 默认加载汇总数据
    loadSummaryData();
    
    // 设置默认日期范围
    form.setFieldsValue({
      dateRange: getDefaultDateRange(),
      queryMode: 'summary'
    });
  }, []);

  // 加载汇总数据
  const loadSummaryData = () => {
    const summaryData = lossData.summaryTotalData || lossData.summaryData.slice(0, 2).map(item => ({
      ...item,
      stationName: '汇总',
      branchName: '', // 汇总时不显示分公司
      rowSpan: 1
    }));
    setTableData(summaryData);
    setFilteredData(summaryData);
  };

  // 加载单站数据
  const loadStationData = (stationId) => {
    if (!stationId) {
      setFilteredData([]);
      return;
    }
    
    const station = stationData.stations.find(s => s.id === stationId);
    const branch = stationData.branches.find(b => b.id === station.branchId);
    
    // 为该油站生成多天的数据，第一行合并显示油站名称和分公司
    const stationLossData = lossData.summaryData.map((item, index) => ({
      ...item,
      stationName: index === 0 ? station.name : '',
      branchName: index === 0 ? branch.name : '',
      stationRowSpan: index === 0 ? lossData.summaryData.length : 0,
      branchRowSpan: index === 0 ? lossData.summaryData.length : 0
    }));
    
    setTableData(stationLossData);
    setFilteredData(stationLossData);
  };

  // 查询模式切换
  const handleQueryModeChange = (mode) => {
    setQueryMode(mode);
    if (mode === 'summary') {
      loadSummaryData();
      form.setFieldsValue({ selectedStation: undefined });
    } else {
      form.setFieldsValue({ selectedStation: undefined });
      setFilteredData([]);
    }
  };

  // 油站选择变化
  const handleStationChange = (stationId) => {
    if (queryMode === 'station' && stationId) {
      loadStationData(stationId);
    }
  };

  // 查询处理
  const handleSearch = (values) => {
    setLoading(true);
    console.log('查询条件:', values);
    
    // 模拟查询延迟
    setTimeout(() => {
      if (queryMode === 'summary') {
        loadSummaryData();
      } else if (values.selectedStation) {
        loadStationData(values.selectedStation);
      }
      setLoading(false);
    }, 500);
  };

  // 重置表单
  const handleReset = () => {
    const currentMode = form.getFieldValue('queryMode') || 'summary';
    form.resetFields();
    form.setFieldsValue({
      dateRange: getDefaultDateRange(),
      queryMode: currentMode
    });
    
    if (currentMode === 'summary') {
      loadSummaryData();
    } else {
      setFilteredData([]);
    }
  };

  // 导出功能
  const handleExport = () => {
    console.log('导出数据:', filteredData);
    // 这里可以实现导出逻辑
  };

  // 表格列定义
  const columns = [
    {
      title: queryMode === 'summary' ? '汇总' : '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
      fixed: 'left',
      render: (text, record, index) => {
        if (queryMode === 'station' && record.stationRowSpan !== undefined) {
          return {
            children: text,
            props: {
              rowSpan: record.stationRowSpan
            }
          };
        }
        return text;
      }
    },
    ...(queryMode === 'station' ? [{
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120,
      render: (text, record, index) => {
        if (record.branchRowSpan !== undefined) {
          return {
            children: text,
            props: {
              rowSpan: record.branchRowSpan
            }
          };
        }
        return text;
      }
    }] : []),
    {
      title: '日结时间',
      dataIndex: 'settlementDate',
      key: 'settlementDate',
      width: 120,
    },
    {
      title: '0#柴油(升)',
      children: [
        {
          title: '账面数',
          dataIndex: 'dieselBookValue',
          key: 'dieselBookValue',
          width: 100,
          align: 'right',
        },
        {
          title: '罐存数',
          dataIndex: 'dieselTankValue',
          key: 'dieselTankValue',
          width: 100,
          align: 'right',
        },
        {
          title: '销量',
          dataIndex: 'dieselSales',
          key: 'dieselSales',
          width: 100,
          align: 'right',
        },
        {
          title: '当日损溢数',
          dataIndex: 'dieselLoss',
          key: 'dieselLoss',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
        {
          title: '当日损溢率',
          dataIndex: 'dieselLossRate',
          key: 'dieselLossRate',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}‰
            </span>
          ),
        },
        {
          title: '当月累计损益',
          dataIndex: 'dieselMonthlyLoss',
          key: 'dieselMonthlyLoss',
          width: 120,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '92#汽油(升)',
      children: [
        {
          title: '账面数',
          dataIndex: 'gasoline92BookValue',
          key: 'gasoline92BookValue',
          width: 100,
          align: 'right',
        },
        {
          title: '罐存数',
          dataIndex: 'gasoline92TankValue',
          key: 'gasoline92TankValue',
          width: 100,
          align: 'right',
        },
        {
          title: '销量',
          dataIndex: 'gasoline92Sales',
          key: 'gasoline92Sales',
          width: 100,
          align: 'right',
        },
        {
          title: '当日损溢数',
          dataIndex: 'gasoline92Loss',
          key: 'gasoline92Loss',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
        {
          title: '当日损溢率',
          dataIndex: 'gasoline92LossRate',
          key: 'gasoline92LossRate',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}‰
            </span>
          ),
        },
        {
          title: '当月累计损益',
          dataIndex: 'gasoline92MonthlyLoss',
          key: 'gasoline92MonthlyLoss',
          width: 120,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '95#汽油(升)',
      children: [
        {
          title: '账面数',
          dataIndex: 'gasoline95BookValue',
          key: 'gasoline95BookValue',
          width: 100,
          align: 'right',
        },
        {
          title: '罐存数',
          dataIndex: 'gasoline95TankValue',
          key: 'gasoline95TankValue',
          width: 100,
          align: 'right',
        },
        {
          title: '销量',
          dataIndex: 'gasoline95Sales',
          key: 'gasoline95Sales',
          width: 100,
          align: 'right',
        },
        {
          title: '当日损溢数',
          dataIndex: 'gasoline95Loss',
          key: 'gasoline95Loss',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
        {
          title: '当日损溢率',
          dataIndex: 'gasoline95LossRate',
          key: 'gasoline95LossRate',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}‰
            </span>
          ),
        },
        {
          title: '当月累计损益',
          dataIndex: 'gasoline95MonthlyLoss',
          key: 'gasoline95MonthlyLoss',
          width: 120,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '98#汽油(升)',
      children: [
        {
          title: '账面数',
          dataIndex: 'gasoline98BookValue',
          key: 'gasoline98BookValue',
          width: 100,
          align: 'right',
        },
        {
          title: '罐存数',
          dataIndex: 'gasoline98TankValue',
          key: 'gasoline98TankValue',
          width: 100,
          align: 'right',
        },
        {
          title: '销量',
          dataIndex: 'gasoline98Sales',
          key: 'gasoline98Sales',
          width: 100,
          align: 'right',
        },
        {
          title: '当日损溢数',
          dataIndex: 'gasoline98Loss',
          key: 'gasoline98Loss',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
        {
          title: '当日损溢率',
          dataIndex: 'gasoline98LossRate',
          key: 'gasoline98LossRate',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}‰
            </span>
          ),
        },
        {
          title: '当月累计损益',
          dataIndex: 'gasoline98MonthlyLoss',
          key: 'gasoline98MonthlyLoss',
          width: 120,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '车用尾气处理液(升)',
      children: [
        {
          title: '账面数',
          dataIndex: 'ureaBookValue',
          key: 'ureaBookValue',
          width: 100,
          align: 'right',
        },
        {
          title: '罐存数',
          dataIndex: 'ureaTankValue',
          key: 'ureaTankValue',
          width: 100,
          align: 'right',
        },
        {
          title: '销量',
          dataIndex: 'ureaSales',
          key: 'ureaSales',
          width: 100,
          align: 'right',
        },
        {
          title: '当日损溢数',
          dataIndex: 'ureaLoss',
          key: 'ureaLoss',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
        {
          title: '当日损溢率',
          dataIndex: 'ureaLossRate',
          key: 'ureaLossRate',
          width: 100,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}‰
            </span>
          ),
        },
        {
          title: '当月累计损益',
          dataIndex: 'ureaMonthlyLoss',
          key: 'ureaMonthlyLoss',
          width: 120,
          align: 'right',
          render: (value) => (
            <span style={{ color: value < 0 ? '#f5222d' : '#52c41a' }}>
              {value}
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <div className="station-loss-summary">
      {/* 筛选区域 */}
      <Card 
        title="各站损溢汇总查询"
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: '16px' }}
      >
        <Form
          form={form}
          onFinish={handleSearch}
          layout="vertical"
          style={{ background: '#fff' }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="queryMode" label="查询模式">
                <Select 
                  value={queryMode}
                  onChange={handleQueryModeChange}
                  style={{ width: '100%' }}
                >
                  <Option value="summary">汇总查询</Option>
                  <Option value="station">单站查询</Option>
                </Select>
              </Form.Item>
            </Col>
            {queryMode === 'station' && (
              <Col xs={24} sm={12} md={6} lg={4}>
                <Form.Item 
                  name="selectedStation" 
                  label="选择油站"
                  rules={[{ required: true, message: '请选择油站' }]}
                >
                  <Select
                    placeholder="请选择油站"
                    onChange={handleStationChange}
                    options={getStationOptions()}
                    style={{ width: '100%' }}
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="dateRange" label="日结时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                  >
                    重置
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                  >
                    导出
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          scroll={{ x: 'max-content', y: 600 }}
          pagination={{
            total: filteredData.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          bordered
          size="small"
        />
      </Card>
    </div>
  );
};

export default StationLossSummary; 